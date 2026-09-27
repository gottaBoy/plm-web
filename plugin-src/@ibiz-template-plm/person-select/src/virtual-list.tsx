import { defineComponent, onMounted, ref, watch } from 'vue';
import { useNamespace } from '@ibiz-template/vue3-util';

export const VirtualList = defineComponent({
  name: 'VirtualList',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    itemHeight: {
      type: Number,
      default: 36,
    },
    showNum: {
      type: Number,
      default: 20,
    },
  },
  emits: ['scrollEvent'],
  setup(props, { emit }) {
    const ns = useNamespace('virtual-list');
    const contentHeight = ref(36);
    const contentBox = ref();
    const showList = ref<any[]>([]);
    const top = ref(0);
    let scrollTop = 0;
    let startIndex = 0;
    let endIndex = 0;

    const calculateVisibleItems = () => {
      startIndex = Math.floor(scrollTop / props.itemHeight);
      endIndex = startIndex + props.showNum;
      showList.value = props.items.slice(startIndex, endIndex);
      top.value = scrollTop - scrollTop % props.itemHeight;
    };

    const onScroll = () => {
      scrollTop = contentBox.value.scrollTop;
      calculateVisibleItems();
      emit('scrollEvent', contentHeight.value, scrollTop);
    };

    onMounted(() => {
      setTimeout(() => {
        calculateVisibleItems();
      }, 1000);
    });

    watch(
      () => props.items,
      () => {
        contentHeight.value = props.itemHeight * props.items.length;
        calculateVisibleItems();
      },
      { immediate: true, deep: true },
    );

    return {
      ns,
      contentHeight,
      showList,
      contentBox,
      top,
      onScroll,
    };
  },
  render() {
    return (
      <div ref="contentBox" class={this.ns.b()} onScroll={() => this.onScroll()}>
        <div class={this.ns.e('container')} style={`height:${this.contentHeight}px;`}>
          <div class={this.ns.e('content')} style={`top:${this.top}px;`}>
            {this.showList.map((item, index) => (
              <div key={index} class={this.ns.m('item')}>
                {this.$slots.default
                  ? this.$slots.default({ ...item, index })
                  : item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
});
