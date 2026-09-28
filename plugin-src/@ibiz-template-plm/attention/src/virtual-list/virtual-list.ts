import { useNamespace } from '@ibiz-template/vue3-util';

import {
  defineComponent,
  ref,
  onMounted,
  watch,
  createVNode,
  type PropType,
} from 'vue';

const VirtualList = defineComponent({
  name: 'VirtualList',
  props: {
    items: {
      //  数据源
      type: Array as PropType<IData[]>,
      default: () => [],
    },
    itemHeight: {
      //  每行高度
      type: Number,
      default: 36,
    },
    showNum: {
      //  可视数量
      type: Number,
      default: 20,
    },
  },
  emits: ['scrollEvent'],
  setup(props, { emit: emit }) {
    const namespace = useNamespace('virtual-list-box'),
      contentHeight = ref(36),
      contentBox = ref<HTMLElement>(),
      showList = ref<IData[]>([]),
      top = ref(0),
      startIndex = ref(0),
      endIndex = ref(0),
      scrollTop = ref(0),
      emitScroll = (g: number, p: number) => {
        emit('scrollEvent', g, p);
      },
      updateVisibleItems = () => {
        (startIndex.value = Math.floor(scrollTop.value / props.itemHeight)),
          (endIndex.value = startIndex.value + props.showNum),
          (showList.value = props.items.slice(
            startIndex.value,
            endIndex.value,
          ));
        const g = scrollTop.value - (scrollTop.value % props.itemHeight);
        top.value = g;
      },
      onScroll = () => {
        (scrollTop.value = contentBox.value?.scrollTop || 0),
          updateVisibleItems(),
          emitScroll(contentHeight.value, scrollTop.value);
      };
    return (
      onMounted(() => {
        setTimeout(() => {
          scroll();
        }, 1e3);
      }),
      watch(
        () => props.items,
        () => {
          (contentHeight.value = props.itemHeight * props.items.length),
            updateVisibleItems();
        },
        {
          immediate: true,
          deep: true,
        },
      ),
      {
        ns: namespace,
        contentHeight: contentHeight,
        showList: showList,
        contentBox: contentBox,
        top: top,
        onScroll: onScroll,
      }
    );
  },
  render() {
    return createVNode(
      'div',
      {
        ref: 'contentBox',
        class: this.ns.b(),
        onScroll: () => this.onScroll(),
      },
      [
        createVNode(
          'div',
          {
            class: this.ns.e('container'),
            style: 'height:'.concat(this.contentHeight, 'px;'),
          },
          [
            createVNode(
              'div',
              {
                class: this.ns.e('content'),
                style: 'top:'.concat(this.top, 'px;'),
              },
              [
                this.showList.map((o, m) =>
                  createVNode(
                    'div',
                    {
                      key: m,
                      class: this.ns.m('item'),
                    },
                    [
                      this.$slots.default
                        ? this.$slots.default({
                            ...o,
                            index: m,
                          })
                        : o.name,
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ],
    );
  },
});

export { VirtualList };
