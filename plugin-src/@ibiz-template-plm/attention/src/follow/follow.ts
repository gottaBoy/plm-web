import { useNamespace } from '@ibiz-template/vue3-util';

import {
  defineComponent,
  ref,
  watch,
  createVNode,
  computed,
  onUnmounted,
  resolveComponent,
  type PropType,
} from 'vue';

import { isArray } from 'lodash-es';
import type { CodeListItem } from '@ibiz-template/runtime';

import { AttentionController } from '../attention-controller';

const IBizFollow = defineComponent({
  name: 'IBizFollow',
  props: {
    readonly: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
    value: {
      type: String,
    },
    codeListId: {
      type: String,
    },
    codeListMap: {
      type: Object as PropType<Record<string, any[]>>,
    },
    controller: {
      type: Object as PropType<AttentionController>,
      required: true,
    },
    defaultSelected: {
      type: String,
    },
  },
  emits: {
    /** 值变更事件 */
    change: (_o: unknown, _m?: string) => true,
    /** 失焦事件 */
    blur: (_o: unknown) => true,
    /** 聚焦事件 */
    focus: (_o: unknown) => true,
    /** 回车事件 */
    enter: (_o: unknown) => true,
    /** 信息文本变更事件 */
    infoTextChange: (_o: unknown) => true,
  },
  setup(props, { emit: emit }) {
    const namespace = useNamespace('follow'),
      controller = props.controller,
      dropdownRef = ref(),
      codeListLoaded = ref(false),
      isEditable = ref(false),
      editorRef = ref(),
      isLoading = ref(false),
      followState = ref(false),
      selectedValue = ref<string | number | null>(null),
      showState = ref(false),
      items = ref<CodeListItem[]>([]),
      codeListMap = computed(() => props.codeListMap || {}),
      cssVars = computed(() => ({})),
      loadCodeList = async () => {
        if (((isLoading.value = true), props.codeListId)) {
          const I = await ibiz.hub
            .getApp(controller.context.srfappid)
            .codeList.get(
              props.codeListId,
              controller.context,
              controller.params,
            );
          I && I.length > 0 && (items.value = [...I]), (codeListLoaded.value = true);
        }
        isLoading.value = false;
      },
      updateFollowState = M => {
        var S, x;
        (selectedValue.value = M),
          (
            (x = (S = codeListMap.value) == null ? void 0 : S.FOLLOWED) == null
              ? void 0
              : x.find(R => String(R) === String(M))
          )
            ? (followState.value = true)
            : (followState.value = false);
      };
    watch(
      () => props.value,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (M, I) => {
        var x;
        let S = M;
        !M &&
          props.codeListMap &&
          (S =
            ((x = codeListMap.value) == null ? void 0 : x.NOTFOLLOWING[0]) ||
            ''),
          updateFollowState(S);
      },
      {
        immediate: true,
        deep: true,
      },
    );
    const setEditable = M => {
        M
          ? (isEditable.value = M)
          : setTimeout(() => {
              isEditable.value = M;
            }, 100);
      },
      curValue = computed({
        get() {
          var M;
          return (M = props.value) == null ? void 0 : M.toString();
        },
        set(M) {
          emit('change', M), setEditable(false);
        },
      }),
      valueText = computed(() => {
        const M = Array.isArray(curValue.value)
            ? curValue.value
            : [curValue.value],
          I = items.value,
          S = [];
        return (
          M.forEach(x => {
            I.forEach(R => {
              R.value === x && S.push(R.text);
            });
          }),
          S.join(',')
        );
      });
    watch(
      valueText,
      (M, I) => {
        M !== I && emit('infoTextChange', M);
      },
      {
        immediate: true,
      },
    );
    const getCodeListItem = M => items.value.find(S => S.text === M),
      onShowChange = async M => {
        (showState.value = M),
          M && !codeListLoaded.value && (await loadCodeList());
      },
      onItemClick = M => {
        (selectedValue.value = M.value),
          updateFollowState(M.value),
          emit('change', M.value);
      },
      handleKeyDown = M => {
        var I;
        (M.key === 'Escape' || M.keyCode === 27) &&
          (M.stopPropagation(),
          (I = dropdownRef.value) == null || I.handleClose());
      };
    return (
      onUnmounted(() => {}),
      {
        ns: namespace,
        curValue: curValue,
        items: items,
        valueText: valueText,
        editorRef: editorRef,
        cssVars: cssVars,
        isEditable: isEditable,
        isLoading: isLoading,
        followState: followState,
        selectd: selectedValue,
        showState: showState,
        dropdownRef: dropdownRef,
        setEditable: setEditable,
        getCodeListItem: getCodeListItem,
        onShowChange: onShowChange,
        onItemClick: onItemClick,
        handleKeyDown: handleKeyDown,
      }
    );
  },
  render() {
    const o = createVNode(
        'div',
        {
          class: [this.ns.e('showcase'), this.showState ? 'is-active' : ''],
        },
        [
          createVNode(
            'span',
            {
              class: this.ns.em('showcase', 'icon'),
            },
            [
              createVNode(
                'svg',
                {
                  viewBox: '0 0 16 16',
                  xmlns: 'http://www.w3.org/2000/svg',
                  height: '1em',
                  width: '1em',
                  focusable: 'false',
                },
                [
                  createVNode(
                    'g',
                    {
                      id: 'follow/with/interest',
                      'stroke-width': '1',
                      'fill-rule': 'evenodd',
                    },
                    [
                      createVNode(
                        'path',
                        {
                          d: 'M8 3.4c2.823 0 5.04 1.367 7.38 3.637a2.037 2.037 0 0 1 0 2.925C13.04 12.232 10.824 13.6 8 13.6c-2.823 0-5.032-1.364-7.376-3.637a2.037 2.037 0 0 1 0-2.925C2.967 4.764 5.176 3.4 8 3.4zm0 1.2c-2.417 0-4.405 1.228-6.542 3.3a.837.837 0 0 0 0 1.2C3.596 11.173 5.584 12.4 8 12.4s4.413-1.231 6.546-3.3a.837.837 0 0 0 0-1.2C12.412 5.83 10.415 4.6 8 4.6zM8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0-1.2a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6z',
                          id: 'attention',
                          fill: 'currentColor',
                        },
                        null,
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
          createVNode(
            'span',
            {
              class: this.ns.em('showcase', 'text'),
            },
            [this.followState ? '已关注' : '未关注'],
          ),
        ],
      ),
      m = createVNode(
        resolveComponent('el-dropdown'),
        {
          'popper-class': this.ns.b('popover'),
          ref: r => {
            this.dropdownRef = r;
          },
          trigger: 'click',
          placement: 'top-start',
          onVisibleChange: this.onShowChange,
          onKeydown: r => {
            this.handleKeyDown(r);
          },
        },
        {
          default: () => o,
          dropdown: () =>
            createVNode(
              resolveComponent('el-dropdown-menu'),
              {
                class: this.ns.be('popper', 'dropdown-menu'),
              },
              {
                default: () =>
                  this.items.map((r, i) =>
                    createVNode(
                      resolveComponent('el-dropdown-item'),
                      {
                        onClick: () => this.onItemClick(r),
                      },
                      {
                        default: () => [
                          createVNode(
                            'div',
                            {
                              class: [
                                this.ns.b('content'),
                                String(this.selectd) === String(r.value)
                                  ? 'is-active'
                                  : '',
                              ],
                            },
                            [
                              createVNode(
                                'div',
                                {
                                  class: this.ns.em('item', 'text'),
                                },
                                [r.text],
                              ),
                              createVNode(
                                'div',
                                {
                                  class: this.ns.em('item', 'tooltip'),
                                },
                                [r.tooltip],
                              ),
                            ],
                          ),
                          i === this.items.length - 1
                            ? null
                            : createVNode(
                                'div',
                                {
                                  class: this.ns.em('item', 'divider'),
                                },
                                [
                                  createVNode(
                                    resolveComponent('el-divider'),
                                    null,
                                    null,
                                  ),
                                ],
                              ),
                        ],
                      },
                    ),
                  ),
              },
            ),
        },
      );
    return createVNode(
      'div',
      {
        class: [
          this.ns.b(),
          this.disabled ? this.ns.m('disabled') : '',
          this.readonly ? this.ns.m('readonly') : '',
          this.ns.is('editable', this.isEditable),
        ],
        style: this.cssVars,
      },
      [this.readonly ? o : m],
    );
  },
});

export { IBizFollow };
