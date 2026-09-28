import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  createVNode,
  resolveComponent,
  createTextVNode,
  isVNode,
} from 'vue';

import {
  getEditorEmits,
  getDropdownProps,
  useNamespace,
} from '@ibiz-template/vue3-util';
import type { CodeListItem } from '@ibiz-template/runtime';
import { AutoRulesController } from './auto-rules.controller';

type AutoRuleOption = {
  text: string;
  value: string | number;
  id?: string;
  pvalue?: string;
  disabled?: boolean;
  label?: string;
  color?: string;
  bkcolor?: string;
  textCls?: string;
  cls?: string;
  disableSelect?: boolean;
  sysImage?: CodeListItem['sysImage'];
  data?: CodeListItem['data'];
};

function isSlotValue(value: unknown): boolean {
  return (
    typeof value == 'function' ||
    (Object.prototype.toString.call(value) === '[object Object]' &&
      !isVNode(value))
  );
}

const AutoRules = defineComponent({
  name: 'AutoRules',
  props: getDropdownProps<AutoRulesController>() as any,
  emits: getEditorEmits(),
  setup(props, { emit: emit }) {
    var j;
    const namespace = useNamespace('auto-rules'),
      controller = props.controller,
      showSelect = ref(false),
      ruleValue = ref(),
      ruleOptions = ref<AutoRuleOption[]>([]),
      showCodeRulesSelect = ref(false),
      fromValue = ref(''),
      toValue = ref(''),
      codeRuleOptions = ref<AutoRuleOption[]>([]),
      showChildSelect = ref(false),
      childFieldValue = ref(),
      parentFieldValue = ref(),
      childFieldOptions = ref<AutoRuleOption[]>([]),
      fieldOptions = ref<AutoRuleOption[]>([]),
      codeListLoaded = ref(false),
      isLoading = ref(false),
      { editorItems: editorItems } = controller.model,
      allFieldOptions = ref<AutoRuleOption[]>([]),
      emitType = ref('STRING');
    (j = controller.editorParams) != null &&
      j.emitType &&
      (emitType.value = controller.editorParams.emitType);
    const flattenCodeList = (
        items: readonly CodeListItem[],
        parentValue = '',
        includeChildren = true,
      ): AutoRuleOption[] => {
        if (items.length === 0) return [];
        const flattened: AutoRuleOption[] = [];
        return (
          items.forEach(item => {
            if (
              (flattened.push({
                ...item,
                pvalue: parentValue,
                disabled: item.disableSelect === true,
              }),
              includeChildren && item.children && item.children.length > 0)
            ) {
              const children = flattenCodeList(
                item.children,
                item.value.toString(),
                includeChildren,
              );
              flattened.push(...children);
            }
          }),
          flattened
        );
      },
      loadCodeList = async (): Promise<void> => {
        isLoading.value = true;
        const t = await controller.loadCodeList(props.data);
        (codeListLoaded.value = true),
          (fieldOptions.value = flattenCodeList(t, '', false)),
          (allFieldOptions.value = flattenCodeList(t, '')),
          (isLoading.value = false);
      },
      getCodeListItemByValue = (
        value: string | number,
      ): AutoRuleOption | undefined =>
        allFieldOptions.value.find(e => e.value === value),
      onVisibleChange = async (visible: boolean): Promise<void> => {
        visible && !codeListLoaded.value && (await loadCodeList());
      },
      getChildFields = (value: string): AutoRuleOption[] =>
        allFieldOptions.value.filter(e => e.pvalue === value),
      resetRuleSelection = () => {
        (showSelect.value = false),
          (showCodeRulesSelect.value = false),
          (ruleValue.value = null),
          (fromValue.value = null),
          (toValue.value = null);
      },
      resetFieldSelection = () => {
        (showChildSelect.value = false),
          (childFieldValue.value = null),
          resetRuleSelection();
      },
      getEmptyOptions = (allowEmpty: unknown): AutoRuleOption[] => {
        const options: AutoRuleOption[] = [
          {
            text: '- 任何 -',
            label: '- 任何 -',
            value: '',
          },
        ];
        return (
          (allowEmpty === 'true' || allowEmpty === true) &&
            options.unshift({
              text: '- 空 -',
              label: '- 空 -',
              value: 'null',
            }),
          options
        );
      },
      onFieldChange = async (t: string | null | undefined): Promise<void> => {
        if ((resetFieldSelection(), !t)) {
          if (
            ((parentFieldValue.value = null),
            emit('change', null),
            editorItems && editorItems.length > 0)
          ) {
            const e = editorItems[0].id;
            emit('change', null, e);
          }
          return;
        }
        if (t.endsWith('.*')) {
          if (
            ((parentFieldValue.value = t),
            (childFieldOptions.value = getChildFields(t)),
            (showChildSelect.value = true),
            emit('change', null),
            editorItems && editorItems.length > 0)
          ) {
            const e = editorItems[0].id;
            emit('change', null, e);
          }
        } else {
          if (
            ((parentFieldValue.value = null),
            editorItems && editorItems.length > 0)
          ) {
            const l = editorItems[0].id;
            emit('change', null, l);
          }
          emit('change', t);
          const e = getCodeListItemByValue(t);
          if (e && e.data) {
            const {
              allow_empty: l,
              codelist_tag: d,
              is_dropdown_list: a,
            } = e.data;
            if (a === 'true' || a === true) {
              showCodeRulesSelect.value = true;
              const c = await controller.loadCustomCodeList(d, props.data),
                h = getEmptyOptions(l);
              codeRuleOptions.value = [...h, ...c];
              return;
            }
            if (!l || l === 'false' || l === false) {
              if (editorItems && editorItems.length > 0) {
                const c = editorItems[0].id;
                emitType.value === 'ARRAY'
                  ? emit('change', ['', ''], c)
                  : emit('change', JSON.stringify(['', '']), c);
              }
            } else
              (l === 'true' || l === true) &&
                ((ruleOptions.value = controller.allowEmptyText),
                (showSelect.value = true));
          } else
            (ruleOptions.value = controller.allowEmptyText),
              (showSelect.value = true);
        }
      },
      curValue = computed({
        get() {
          return parentFieldValue.value || props.value;
        },
        set(t) {
          onFieldChange(t);
        },
      }),
      onRuleChange = (t: string): void => {
        if (editorItems && editorItems.length > 0) {
          const e = editorItems[0].id;
          emitType.value === 'ARRAY'
            ? emit('change', JSON.parse(t), e)
            : emit('change', t, e);
        }
      },
      onCodeRuleChange = (t: string, e: number): void => {
        if (
          (e === 1 ? (fromValue.value = t) : (toValue.value = t),
          editorItems && editorItems.length > 0)
        ) {
          const l = editorItems[0].id;
          emitType.value === 'ARRAY'
            ? emit('change', [fromValue.value, toValue.value], l)
            : emit(
                'change',
                JSON.stringify([fromValue.value, toValue.value]),
                l,
              );
        }
      },
      onChildFieldChange = async (t: string | null | undefined): Promise<void> => {
        if ((resetRuleSelection(), !t)) {
          if ((emit('change', t), editorItems && editorItems.length > 0)) {
            const l = editorItems[0].id;
            emit('change', null, l);
          }
          return;
        }
        const e = getCodeListItemByValue(t);
        if (e && e.data) {
          const {
            allow_empty: l,
            codelist_tag: d,
            is_dropdown_list: a,
          } = e.data;
          if (a === 'true' || a === true) {
            showCodeRulesSelect.value = true;
            const c = await controller.loadCustomCodeList(d, props.data),
              h = getEmptyOptions(l);
            codeRuleOptions.value = [...h, ...c];
            return;
          }
          if (!l || l === 'false' || l === false) {
            if (editorItems && editorItems.length > 0) {
              const c = editorItems[0].id;
              emitType.value === 'ARRAY'
                ? emit('change', ['', ''], c)
                : emit('change', JSON.stringify(['', '']), c);
              return;
            }
          } else
            (l === 'true' || l === true) &&
              ((ruleOptions.value = controller.allowEmptyText),
              (showSelect.value = true));
        } else
          (ruleOptions.value = controller.allowEmptyText),
            (showSelect.value = true);
        if ((emit('change', t), editorItems && editorItems.length > 0)) {
          const l = editorItems[0].id;
          emit('change', null, l);
        }
      },
      renderFieldSelect = () => {
        let t;
        return createVNode(
          resolveComponent('el-select'),
          {
            ref: 'childFieldEditorRef',
            modelValue: childFieldValue.value,
            'onUpdate:modelValue': e => (childFieldValue.value = e),
            clearable: true,
            class: [namespace.b('child-select')],
            filterable: true,
            'fit-input-width': true,
            onChange: onChildFieldChange,
          },
          isSlotValue(
            (t = childFieldOptions.value.map(e =>
              createVNode(
                resolveComponent('el-option'),
                {
                  key: e.value,
                  value: e.value.toString(),
                  label: e.text,
                  disabled: e.disableSelect === true,
                  style: e.bkcolor
                    ? namespace.cssVarBlock({
                        'select-option-item-bkcolor': ''.concat(e.bkcolor),
                      })
                    : '',
                  class: [e.cls ? e.cls : null],
                  title: e.text,
                },
                {
                  default: () =>
                    createVNode(
                      'div',
                      {
                        class: [
                          namespace.b('select-option-content'),
                          e.textCls ? e.textCls : null,
                        ],
                        style: e.color
                          ? namespace.cssVarBlock({
                              'select-option-item-color': ''.concat(e.color),
                            })
                          : '',
                      },
                      [
                        e.sysImage &&
                          createVNode(
                            resolveComponent('iBizIcon'),
                            {
                              icon: e.sysImage,
                            },
                            null,
                          ),
                        createVNode(
                          'span',
                          {
                            class: [
                              namespace.be('select-option-content', 'text'),
                            ],
                          },
                          [e.text],
                        ),
                      ],
                    ),
                },
              ),
            )),
          )
            ? t
            : {
                default: () => [t],
              },
        );
      },
      renderRulesSelect = () => {
        let t;
        return createVNode(
          resolveComponent('el-select'),
          {
            ref: 'rulesEditorRef',
            modelValue: ruleValue.value,
            'onUpdate:modelValue': e => (ruleValue.value = e),
            clearable: true,
            class: [namespace.em('rules-select', 'fix')],
            filterable: true,
            'fit-input-width': true,
            onChange: onRuleChange,
          },
          isSlotValue(
            (t = ruleOptions.value.map(e =>
              createVNode(
                resolveComponent('el-option'),
                {
                  key: e.value,
                  value: e.value.toString(),
                  label: e.text,
                  disabled: e.disableSelect === true,
                  style: e.bkcolor
                    ? namespace.cssVarBlock({
                        'select-option-item-bkcolor': ''.concat(e.bkcolor),
                      })
                    : '',
                  class: [e.cls ? e.cls : null],
                  title: e.text,
                },
                {
                  default: () =>
                    createVNode(
                      'div',
                      {
                        class: [
                          namespace.b('select-option-content'),
                          e.textCls ? e.textCls : null,
                        ],
                        style: e.color
                          ? namespace.cssVarBlock({
                              'select-option-item-color': ''.concat(e.color),
                            })
                          : '',
                      },
                      [
                        e.sysImage &&
                          createVNode(
                            resolveComponent('iBizIcon'),
                            {
                              icon: e.sysImage,
                            },
                            null,
                          ),
                        createVNode(
                          'span',
                          {
                            class: [
                              namespace.be('select-option-content', 'text'),
                            ],
                          },
                          [e.text],
                        ),
                      ],
                    ),
                },
              ),
            )),
          )
            ? t
            : {
                default: () => [t],
              },
        );
      },
      renderCodeRulesSelect = () => {
        let t, e;
        return createVNode(
          'div',
          {
            class: namespace.b('code-rules'),
          },
          [
            createVNode(
              resolveComponent('el-select'),
              {
                modelValue: fromValue.value,
                'onUpdate:modelValue': l => (fromValue.value = l),
                clearable: true,
                class: [namespace.b('rules-select')],
                filterable: true,
                'fit-input-width': true,
                onChange: l => onCodeRuleChange(l, 1),
              },
              isSlotValue(
                (t = codeRuleOptions.value.map(l =>
                  createVNode(
                    resolveComponent('el-option'),
                    {
                      key: l.value,
                      value: l.value.toString(),
                      label: l.text,
                      disabled: l.disableSelect === true,
                      style: l.bkcolor
                        ? namespace.cssVarBlock({
                            'select-option-item-bkcolor': ''.concat(l.bkcolor),
                          })
                        : '',
                      class: [l.cls ? l.cls : null],
                      title: l.text,
                    },
                    {
                      default: () =>
                        createVNode(
                          'div',
                          {
                            class: [
                              namespace.b('select-option-content'),
                              l.textCls ? l.textCls : null,
                            ],
                            style: l.color
                              ? namespace.cssVarBlock({
                                  'select-option-item-color': ''.concat(
                                    l.color,
                                  ),
                                })
                              : '',
                          },
                          [
                            l.sysImage &&
                              createVNode(
                                resolveComponent('iBizIcon'),
                                {
                                  icon: l.sysImage,
                                },
                                null,
                              ),
                            createVNode(
                              'span',
                              {
                                class: [
                                  namespace.be('select-option-content', 'text'),
                                ],
                              },
                              [l.text],
                            ),
                          ],
                        ),
                    },
                  ),
                )),
              )
                ? t
                : {
                    default: () => [t],
                  },
            ),
            createVNode(
              'span',
              {
                class: namespace.be('code-rules', 'change'),
              },
              [createTextVNode('变为')],
            ),
            createVNode(
              resolveComponent('el-select'),
              {
                modelValue: toValue.value,
                'onUpdate:modelValue': l => (toValue.value = l),
                clearable: true,
                class: [namespace.b('rules-select')],
                filterable: true,
                'fit-input-width': true,
                onChange: l => onCodeRuleChange(l, 2),
              },
              isSlotValue(
                (e = codeRuleOptions.value.map(l =>
                  createVNode(
                    resolveComponent('el-option'),
                    {
                      key: l.value,
                      value: l.value.toString(),
                      label: l.text,
                      disabled: l.disableSelect === true,
                      style: l.bkcolor
                        ? namespace.cssVarBlock({
                            'select-option-item-bkcolor': ''.concat(l.bkcolor),
                          })
                        : '',
                      class: [l.cls ? l.cls : null],
                      title: l.text,
                    },
                    {
                      default: () =>
                        createVNode(
                          'div',
                          {
                            class: [
                              namespace.b('select-option-content'),
                              l.textCls ? l.textCls : null,
                            ],
                            style: l.color
                              ? namespace.cssVarBlock({
                                  'select-option-item-color': ''.concat(
                                    l.color,
                                  ),
                                })
                              : '',
                          },
                          [
                            l.sysImage &&
                              createVNode(
                                resolveComponent('iBizIcon'),
                                {
                                  icon: l.sysImage,
                                },
                                null,
                              ),
                            createVNode(
                              'span',
                              {
                                class: [
                                  namespace.be('select-option-content', 'text'),
                                ],
                              },
                              [l.text],
                            ),
                          ],
                        ),
                    },
                  ),
                )),
              )
                ? e
                : {
                    default: () => [e],
                  },
            ),
          ],
        );
      },
      renderRuleTypesSelect = () => {
        let t;
        return createVNode(
          resolveComponent('el-select'),
          {
            ref: 'editorRef',
            modelValue: curValue.value,
            'onUpdate:modelValue': e => (curValue.value = e),
            clearable: true,
            class: [namespace.b('select')],
            filterable: true,
            placeholder: controller.placeHolder ? controller.placeHolder : ' ',
            disabled: props.disabled,
            loading: isLoading.value,
            'fit-input-width': true,
            onVisibleChange: onVisibleChange,
          },
          isSlotValue(
            (t = fieldOptions.value.map(e =>
              createVNode(
                resolveComponent('el-option'),
                {
                  key: e.value,
                  value: e.value.toString(),
                  label: e.text,
                  disabled: e.disableSelect === true,
                  style: e.bkcolor
                    ? namespace.cssVarBlock({
                        'select-option-item-bkcolor': ''.concat(e.bkcolor),
                      })
                    : '',
                  class: [e.cls ? e.cls : null],
                  title: e.text,
                },
                {
                  default: () =>
                    createVNode(
                      'div',
                      {
                        class: [
                          namespace.b('select-option-content'),
                          e.textCls ? e.textCls : null,
                        ],
                        style: e.color
                          ? namespace.cssVarBlock({
                              'select-option-item-color': ''.concat(e.color),
                            })
                          : '',
                      },
                      [
                        e.sysImage &&
                          createVNode(
                            resolveComponent('iBizIcon'),
                            {
                              icon: e.sysImage,
                            },
                            null,
                          ),
                        createVNode(
                          'span',
                          {
                            class: [
                              namespace.be('select-option-content', 'text'),
                            ],
                          },
                          [e.text],
                        ),
                      ],
                    ),
                },
              ),
            )),
          )
            ? t
            : {
                default: () => [t],
              },
        );
      },
      restoreRuleSelection = async (t: string): Promise<void> => {
        const e = getCodeListItemByValue(t);
        if (e != null && e.pvalue?.endsWith('.*')) {
          (parentFieldValue.value = e.pvalue),
            (showChildSelect.value = true),
            (childFieldValue.value = t),
            (showSelect.value = true),
            (childFieldOptions.value = getChildFields(parentFieldValue.value));
          const l = getCodeListItemByValue(t);
          if (l && l.data) {
            const {
              allow_empty: d,
              codelist_tag: a,
              is_dropdown_list: c,
            } = l.data;
            if (c === 'true' || c === true) {
              showCodeRulesSelect.value = true;
              const h = await controller.loadCustomCodeList(a, props.data),
                I = getEmptyOptions(d);
              codeRuleOptions.value = [...I, ...h];
            } else
              (d === 'true' || d === true) &&
                ((showSelect.value = true),
                (ruleOptions.value = controller.allowEmptyText));
          } else
            (ruleOptions.value = controller.allowEmptyText),
              (showSelect.value = true);
          if (editorItems && editorItems.length > 0) {
            const d = editorItems[0].id,
              a = props.data[d];
            if (a) {
              const c = {
                '[, null]': ['', null],
                '[null, ]': [null, ''],
                '[, ]': ['', ''],
              };
              emitType.value,
                c[a]
                  ? (ruleValue.value = JSON.stringify(c[a]))
                  : (ruleValue.value = a);
            }
          }
        } else {
          const l = getCodeListItemByValue(t);
          if (l && l.data) {
            const {
              allow_empty: d,
              codelist_tag: a,
              is_dropdown_list: c,
            } = l.data;
            if (c === 'true' || c === true) {
              showCodeRulesSelect.value = true;
              const h = await controller.loadCustomCodeList(a, props.data),
                I = getEmptyOptions(d);
              codeRuleOptions.value = [...I, ...h];
            } else
              (d === 'true' || d === true) &&
                ((showSelect.value = true),
                (ruleOptions.value = controller.allowEmptyText));
          } else
            (ruleOptions.value = controller.allowEmptyText),
              (showSelect.value = true);
          if (editorItems && editorItems.length > 0) {
            const d = editorItems[0].id,
              a = props.data[d];
            try {
              if (!a) {
                (toValue.value = null), (fromValue.value = null);
                return;
              }
              if (emitType.value === 'ARRAY')
                if (Array.isArray(a))
                  (fromValue.value = String(a[0])),
                    (toValue.value = String(a[1]));
                else {
                  const c = a
                    .substring(1, a.length - 1)
                    .split(',')
                    .map(h => h.trim());
                  (fromValue.value = String(c[0])),
                    (toValue.value = String(c[1]));
                }
              else {
                const c = JSON.parse(a);
                (fromValue.value = String(c[0])),
                  (toValue.value = String(c[1]));
              }
            } catch (c) {
              const h = a
                .substring(1, a.length - 1)
                .split(',')
                .map(I => I.trim());
              h.length === 2
                ? ((fromValue.value = String(h[0])),
                  (toValue.value = String(h[1])))
                : ((toValue.value = null), (fromValue.value = null));
            }
          }
        }
      };
    return (
      watch(
        () => props.value,
        async (t, e) => {
          (t || t === null || t === 0) &&
            (!codeListLoaded.value && e === void 0 && (await loadCodeList()),
            t && t !== e && (await restoreRuleSelection(String(t))));
        },
        {
          immediate: true,
        },
      ),
      onMounted(async () => {
        await loadCodeList();
      }),
      {
        ns: namespace,
        c: controller,
        items: fieldOptions,
        showSelect: showSelect,
        showChildSelect: showChildSelect,
        isLoading: isLoading,
        curValue: curValue,
        showCodeRulesSelect: showCodeRulesSelect,
        renderFieldSelect: renderFieldSelect,
        renderRulesSelect: renderRulesSelect,
        renderCodeRulesSelect: renderCodeRulesSelect,
        renderRuleTypesSelect: renderRuleTypesSelect,
        onVisibleChange: onVisibleChange,
        getCodeListItemByValue: getCodeListItemByValue,
      }
    );
  },
  render() {
    return createVNode(
      'div',
      {
        class: this.ns.b(),
      },
      [
        createVNode(
          'div',
          {
            class: this.ns.e('field-select'),
          },
          [
            this.renderRuleTypesSelect(),
            this.showChildSelect ? this.renderFieldSelect() : null,
          ],
        ),
        createVNode(
          'div',
          {
            class: [
              this.ns.e('rules-select'),
              this.ns.is(
                'visible',
                !this.showSelect && !this.showCodeRulesSelect,
              ),
            ],
          },
          [
            this.showSelect ? this.renderRulesSelect() : null,
            this.showCodeRulesSelect ? this.renderCodeRulesSelect() : null,
          ],
        ),
      ],
    );
  },
});

export { isSlotValue, AutoRules };
