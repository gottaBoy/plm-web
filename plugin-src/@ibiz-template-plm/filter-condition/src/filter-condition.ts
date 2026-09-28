import {
  defineComponent,
  h,
  ref,
  resolveComponent,
  watch,
  type PropType,
} from 'vue';
import {
  getEditorProvider,
  type IEditorContainerController,
  type IEditorProvider,
  type ValueOP,
} from '@ibiz-template/runtime';
import {
  getEditorEmits,
  useNamespace,
} from '@ibiz-template/vue3-util';
import { createUUID } from 'qx-util';
import { ExcludeOPs, FilterModes } from './utils';
import type { IFilterCondition } from './interface';
import { FilterConditionController } from './filter-condition.controller';

const connectionItems = [
  { text: '且', value: 'AND' },
  { text: '或', value: 'OR' },
];

function isComponent(value: unknown): boolean {
  return typeof value === 'function'
    || (Object.prototype.toString.call(value) === '[object Object]'
      && !('__v_isVNode' in (value as Record<string, unknown>)));
}

function createIcon(path: string, className?: string) {
  return h('svg', {
    class: className,
    viewBox: '0 0 16 16',
    xmlns: 'http://www.w3.org/2000/svg',
    height: '1em',
    width: '1em',
    preserveAspectRatio: 'xMidYMid meet',
    focusable: 'false',
  }, [h('g', { 'stroke-width': '1', 'fill-rule': 'evenodd' }, [
    h('path', { d: path }),
  ])]);
}

export const FilterCondition = defineComponent({
  name: 'IBizFilterCondition',
  props: {
    value: [String, Number],
    controller: {
      type: Object as PropType<FilterConditionController>,
      required: true,
    },
    data: {
      type: Object as PropType<IData>,
      required: true,
    },
    disabled: { type: Boolean },
    readonly: { type: Boolean, default: false },
    autoFocus: { type: Boolean, default: false },
    overflowMode: { type: String },
    controlParams: { type: Object, required: false },
  },
  emits: getEditorEmits(),
  setup(props, { emit }) {
    const ns = useNamespace('filter-condition');
    const controller = props.controller;
    const items = ref<IFilterCondition[]>([]);
    const filterModeMap = new Map<ValueOP, string>();
    FilterModes.forEach(item => filterModeMap.set(item.valueOP, item.label));

    const initEditor = async (item: IFilterCondition): Promise<void> => {
      const field = controller.schemaFieldMap.get(item.field);
      if (!field) return;
      const editorModel = controller.getEditor(field);
      const provider = await getEditorProvider(editorModel);
      if (!provider) return;
      item.editorProvider = provider;
      item.editor = await provider.createController(editorModel, {
        context: controller.context,
        params: controller.params,
      } as unknown as IEditorContainerController);
    };

    watch(() => props.value, async value => {
      if (!value) {
        items.value = [];
        return;
      }
      if (typeof value === 'string') {
        const parsed = JSON.parse(value);
        const connection = parsed?.condop || 'AND';
        const conditions = parsed?.searchconds || [];
        if (Array.isArray(conditions) && conditions.length) {
          items.value = await Promise.all(conditions.map(async condition => {
            const item: IFilterCondition = {
              key: createUUID(),
              connection,
              field: condition.fieldname || '',
              valueOP: condition.condop || '',
              value: condition.value,
            };
            await initEditor(item);
            return item;
          }));
          return;
        }
      }
      items.value = [];
    }, { immediate: true });

    const emitValue = (): void => {
      if (!items.value.length) {
        emit('change', '');
        return;
      }
      const result = {
        condop: items.value[0]?.connection || 'AND',
        condtype: 'GROUP',
        searchconds: items.value.map(item => ({
          condtype: 'DEFIELD',
          fieldname: item.field,
          condop: item.valueOP,
          value: item.value,
        })),
      };
      emit('change', JSON.stringify(result));
    };

    const handleAdd = async (): Promise<void> => {
      if (props.disabled) return;
      const first = items.value[0];
      const field = controller.schemaFields[0]?.appDEFieldId || '';
      const valueOP = controller.schemaFieldMap.get(field)?.valueOPs?.[0] || '';
      const item: IFilterCondition = {
        key: createUUID(),
        connection: first?.connection || 'AND',
        field,
        valueOP,
      };
      await initEditor(item);
      items.value.push(item);
      emitValue();
    };

    const handleRemove = (index: number): void => {
      if (props.disabled) return;
      items.value.splice(index, 1);
      emitValue();
    };

    const renderEditor = (item: IFilterCondition) => {
      if (!item.valueOP || ExcludeOPs.includes(item.valueOP as ValueOP)) return null;
      if (!item.editorProvider || !item.editor) return undefined;
      const editor = resolveComponent(item.editorProvider.formEditor);
      return h(editor, {
        value: item.value,
        controller: item.editor,
        disabled: props.disabled,
        onChange: (value: unknown) => {
          item.value = value;
          emitValue();
        },
      });
    };

    const handleConnectionChange = (item: IFilterCondition): void => {
      items.value.forEach(current => { current.connection = item.connection; });
      emitValue();
    };

    const handleFieldChange = async (item: IFilterCondition): Promise<void> => {
      const field = controller.schemaFieldMap.get(item.field);
      item.valueOP = field?.valueOPs?.[0] || '';
      item.value = undefined;
      item.editorProvider = undefined;
      item.editor = undefined;
      await initEditor(item);
      emitValue();
    };

    const handleValueOPChange = (item: IFilterCondition): void => {
      item.value = undefined;
      emitValue();
    };

    return {
      ns,
      c: controller,
      items,
      connectionItems,
      filterModeMap,
      handleAdd,
      handleRemove,
      renderEditor,
      handleConnectionChange,
      handleFieldChange,
      handleValueOPChange,
      isComponent,
    };
  },
  render() {
    return h('div', {
      class: [
        this.ns.b(),
        this.disabled && this.ns.m('disabled'),
        this.ns.is('border-mode', this.c.borderMode === 'BORDER'),
      ],
    }, [
      h('div', {
        class: [this.ns.b('content'), this.ns.is('border-mode', this.c.borderMode === 'BORDER')],
      }, [
        this.c.borderMode && h('div', { class: this.ns.be('content', 'total') }, [
          '查询条件(', this.items.length, ')',
        ]),
        this.items.map((item, index) => h('div', {
          key: item.key,
          class: this.ns.b('item'),
        }, [
          h('div', {
            class: [
              this.ns.be('item', 'connection'),
              index === 0 && this.ns.bem('item', 'connection', 'init'),
            ],
          }, [index === 0
            ? h('div', null, ['当'])
            : h(resolveComponent('el-select'), {
              modelValue: item.connection,
              'onUpdate:modelValue': (value: string) => { item.connection = value; },
              disabled: index > 1 || this.disabled,
              onChange: () => this.handleConnectionChange(item),
            }, () => this.connectionItems.map(option => h(resolveComponent('el-option'), {
              key: option.value, value: option.value, label: option.text,
            })))]),
          h('div', { class: this.ns.b('item-content') }, [
            h('div', { class: this.ns.be('item', 'field') }, [
              h(resolveComponent('el-select'), {
                modelValue: item.field,
                'onUpdate:modelValue': (value: string) => { item.field = value; },
                disabled: this.disabled,
                onChange: () => this.handleFieldChange(item),
              }, () => this.c.schemaFields.map(field => h(resolveComponent('el-option'), {
                key: field.appDEFieldId,
                value: field.appDEFieldId,
                label: field.caption,
              }))),
            ]),
            h('div', { class: this.ns.be('item', 'valueOP') }, [
              h(resolveComponent('el-select'), {
                modelValue: item.valueOP,
                'onUpdate:modelValue': (value: string) => { item.valueOP = value; },
                disabled: this.disabled,
                onChange: () => this.handleValueOPChange(item),
              }, () => this.c.schemaFieldMap.get(item.field)?.valueOPs?.map(valueOP => h(
                resolveComponent('el-option'),
                {
                  key: valueOP,
                  value: valueOP,
                  label: this.filterModeMap.get(valueOP) || valueOP,
                },
              ))),
            ]),
            h('div', { class: this.ns.be('item', 'editor') }, [
              this.renderEditor(item),
            ]),
          ]),
          h('div', {
            class: this.ns.be('item', 'btn'),
            onClick: (event: MouseEvent) => {
              event.stopPropagation();
              this.handleRemove(index);
            },
          }, [createIcon(
            'M4.002 3.403V1a1 1 0 0 1 1-1h6.003a1 1 0 0 1 1 1v2.403h3.396a.6.6 0 1 1 0 1.2h-1.395V15a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4.603H.6a.6.6 0 0 1 0-1.2h3.4zm8.804 1.205H3.2V14.8h9.605V4.608zM5.202 1.2v2.155h5.603V1.2zm.6 6.417a.6.6 0 0 1 1.201 0v4.758a.6.6 0 0 1-1.2 0V7.617zm3.202 0a.6.6 0 0 1 1.2 0v4.758a.6.6 0 0 1-1.2 0V7.617z',
          )]),
        ])),
      ]),
      h('div', {
        class: [this.ns.b('footer'), this.ns.is('border-mode', this.c.borderMode === 'BORDER')],
      }, [
        h('div', {
          class: this.ns.b('footer-btn'),
          onClick: this.handleAdd,
        }, [
          createIcon('M8.578 7.383V1.602a.601.601 0 1 0-1.2 0v5.781H1.6a.601.601 0 0 0 0 1.203h5.777v5.812a.601.601 0 1 0 1.2 0V8.586H14.4a.601.601 0 0 0 0-1.203H8.578z', this.ns.be('footer-btn', 'icon')),
          h('div', { class: this.ns.be('footer-btn', 'text') }, ['新增筛选条件']),
        ]),
      ]),
    ]);
  },
});
