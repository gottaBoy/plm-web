import {
  defineComponent,
  ref,
  watch,
  onBeforeUnmount,
  createVNode,
  resolveComponent,
  type PropType,
  type VNode,
} from 'vue';

import {
  getInputProps,
  getEditorEmits,
  useNamespace,
} from '@ibiz-template/vue3-util';

import { renderTextPhoto, stringToHexColor } from './comment-list.utils';
import { CommentListComtroller } from './comment-list.controller';

type CommentItem = IData & {
  id?: string;
  create_man?: string;
  create_time?: string;
  content?: string;
};

const { value: _inputValue, ...commentListInputProps } =
  getInputProps<CommentListComtroller>();

const CommentList = defineComponent({
  name: 'CommentList',
  props: {
    ...commentListInputProps,
    value: {
      type: Array as PropType<CommentItem[]>,
      default: () => [],
    },
  } as any,
  emits: getEditorEmits(),
  setup(props) {
    const namespace = useNamespace('comment-list'),
      controller = props.controller,
      comments = ref<CommentItem[]>([]),
      failedAvatars = ref<string[]>([]);
    watch(
      () => props.value,
      async s => {
        if (controller.isLocal) {
          comments.value = [];
          const c = await controller.getLocalTempData();
          if (c) {
            const o = await c.fetchDefault(controller.context);
            o.data && Array.isArray(o.data) && (comments.value = o.data);
          }
        } else
          s
            ? Array.isArray(s)
              ? (comments.value = [...s])
              : (comments.value = [])
            : (comments.value = []);
      },
      {
        immediate: true,
        deep: true,
      },
    );
    const onDeleteItem = (s: IData) => {
        const { eventArg: c } = s;
        if (c) {
          const o = comments.value.findIndex(d => d.id === c);
          o >= 0 && comments.value.splice(o, 1);
        }
      },
      onAddItem = (s: IData) => {
        comments.value.push(s.eventArg);
      },
      onEditReply = (s: IData) => {
        const c = comments.value.findIndex(o => o.id === s.id);
        c > -1 && comments.value.splice(c, 1, s);
      };
    controller.evt.on('deleteItem', onDeleteItem),
      controller.evt.on('addItem', onAddItem),
      controller.evt.on('editreply', onEditReply);
    const onDeleteComment = async (s: CommentItem) => {
        controller.deleteComment(s);
      },
      onAvatarError = (s: string) => {
        console.log('头像加载失败'), failedAvatars.value.push(s);
      },
      renderAvatarImage = (s: string) => {
        if (!s) return null;
        const c = JSON.parse(s);
        if (c.length === 0) return null;
        const { downloadUrl: o } = ibiz.util.file.calcFileUpDownUrl(
            controller.context,
            controller.params,
            props.data,
            controller.editorParams,
          ),
          d = o.replace('%fileId%', c[0].id);
        return createVNode(
          'img',
          {
            src: d,
            onError: () => onAvatarError(s),
            alt: '',
          },
          null,
        );
      },
      renderAvatar = (s: string | undefined) => {
        const c = controller.operatorMap.get(s);
        let o,
          d = s;
        if (c) {
          const { label: h, iconurl: f } = c.data;
          (d = h), f ? (o = renderAvatarImage(f)) : (o = renderTextPhoto(h));
        } else o = renderTextPhoto(s);
        return createVNode(
          'div',
          {
            class: namespace.em('item', 'avatar'),
          },
          [
            createVNode(
              'div',
              {
                class: namespace.em('item', 'img'),
                style: 'background-color:'.concat(stringToHexColor(d)),
              },
              [o],
            ),
            createVNode(
              'div',
              {
                class: namespace.em('item', 'label'),
              },
              [d],
            ),
          ],
        );
      },
      formatCommentTime = (s: string | undefined) => {
        if (!s) return;
        const c = s.split(' ');
        if (c.length === 2) {
          const o = c[0].split('-'),
            d = /* @__PURE__ */ new Date(),
            h = d.getFullYear() - Number(o[0]),
            f = d.getMonth() + 1 - Number(o[1]),
            v = d.getDate() - Number(o[2]);
          if (h === 0) {
            if (f === 0) {
              if (v === 0) return '今天 '.concat(s.slice(11, -3));
              if (v === 1) return '昨天 '.concat(s.slice(11, -3));
              if (v === 2) return '前天 '.concat(s.slice(11, -3));
            }
            return s.slice(5, -3);
          }
          return s.slice(0, -3);
        }
      },
      onEditComment = (s: CommentItem) => {
        controller.updateComment(s);
      },
      renderComment = (s: CommentItem) =>
        createVNode(
          'div',
          {
            class: namespace.e('item'),
          },
          [
            createVNode(
              'div',
              {
                class: namespace.em('item', 'header'),
              },
              [
                renderAvatar(s.create_man),
                createVNode(
                  'span',
                  {
                    class: namespace.em('item', 'time'),
                  },
                  [formatCommentTime(s.create_time)],
                ),
                s.create_man === controller.context.srfuserid
                  ? createVNode('div', null, [
                      createVNode(
                        'span',
                        {
                          class: namespace.em('item', 'edit'),
                          onClick: () => onEditComment(s),
                          title: '编辑',
                        },
                        [
                          createVNode(
                            'i',
                            {
                              class: 'fa fa-edit',
                              'aria-hidden': 'true',
                            },
                            null,
                          ),
                        ],
                      ),
                      createVNode(
                        'span',
                        {
                          class: namespace.em('item', 'delicon'),
                          onClick: () => onDeleteComment(s),
                          title: '删除',
                        },
                        [
                          createVNode(
                            'i',
                            {
                              class: 'fa fa-trash-o',
                              'aria-hidden': 'true',
                            },
                            null,
                          ),
                        ],
                      ),
                    ])
                  : null,
              ],
            ),
            createVNode(
              'div',
              {
                class: namespace.em('item', 'content'),
              },
              [
                createVNode(
                  'div',
                  {
                    innerHTML: s.content,
                  },
                  null,
                ),
              ],
            ),
          ],
        ),
      renderList = (): VNode =>
        comments.value.length === 0
          ? createVNode(
              resolveComponent('iBizNoData'),
              {
                class: namespace.e('nodata'),
              },
              null,
            )
          : createVNode(
              'div',
              {
                class: namespace.e('list'),
              },
              [comments.value.map(s => renderComment(s))],
            ),
      stopClick = (s: MouseEvent) => {
        s.stopPropagation(), s.preventDefault();
      };
    return (
      onBeforeUnmount(() => {
        controller.evt.off('addItem', onAddItem),
          controller.evt.off('deleteItem', onDeleteItem),
          controller.evt.off('editreply', onEditReply);
      }),
      {
        ns: namespace,
        c: controller,
        renderList: renderList,
        stopClick: stopClick,
      }
    );
  },
  render() {
    const state = this as unknown as {
      ns: ReturnType<typeof useNamespace>;
      stopClick: (event: MouseEvent) => void;
      renderList: () => VNode;
    };
    return createVNode(
      'div',
      {
        class: state.ns.b(),
        onClick: state.stopClick,
      },
      [state.renderList()],
    );
  },
});

export { CommentList };
