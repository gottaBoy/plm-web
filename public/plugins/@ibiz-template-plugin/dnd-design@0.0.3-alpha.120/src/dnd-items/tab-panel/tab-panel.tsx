import { PropType, defineComponent, ref, watch } from 'vue';
import { useNamespace } from '@ibiz-template/vue3-util';
import { IDataEntity } from '@ibiz-template/runtime';
import {
  IDndDesignPanelItemController,
  IDndItemController,
} from '../../interface';
import { useRenderItems } from '../../use';
import { modelStateUtil } from '../../utils';
import './tab-panel.scss';

export default defineComponent({
  name: 'IBizDndDesignTabPanel',
  props: {
    controller: {
      type: Object as PropType<IDndItemController>,
      required: true,
    },
    dndDesignController: {
      type: Object as PropType<IDndDesignPanelItemController>,
      required: true,
    },
  },
  setup(props) {
    const ns = useNamespace('dnd-design-tab-panel');
    const c = props.controller;
    const renderItems = useRenderItems();

    const activePage = ref<string | undefined>();

    const select = ref<IDataEntity>(c.select.data as IDataEntity);

    c.select.on(data => {
      select.value = data as IDataEntity;
    });

    const onActivePageChange = (item: IDataEntity) => {
      activePage.value = item.srfkey;
      props.controller.select.set(item);
    };

    watch(
      select,
      () => {
        const items = props.controller.data.children;
        if (Array.isArray(items) && items.length) {
          if (select.value) {
            const data = items.find(
              item => item.srfkey === select.value.srfkey,
            );
            if (data) {
              activePage.value = data.srfkey;
            }
          }
        }
      },
      {
        immediate: true,
      },
    );

    const onPagePositionChange = async (evt: IData) => {
      const items = props.controller.data.children;
      if (Array.isArray(items)) {
        props.controller.change(evt, items, props.controller.data);
      }
    };

    const onPageAdd = async () => {
      const items = props.controller.data.children;
      if (Array.isArray(items)) {
        items.push({
          detailtype: 'TABPAGE',
        } as unknown as IDataEntity);
        props.controller.change(
          {
            added: {
              element: items[items.length - 1],
              newIndex: items.length - 1,
            },
          },
          items,
          props.controller.data,
        );
      }
    };

    const onPageRemove = async (page: IDataEntity) => {
      const items = props.controller.data.children;
      if (Array.isArray(items)) {
        props.controller.remove(items, page);
      }
    };

    return {
      ns,
      activePage,
      select,
      onActivePageChange,
      onPagePositionChange,
      onPageAdd,
      onPageRemove,
      renderItems,
    };
  },

  render() {
    const data = this.controller.data;
    const items = data.children || [];
    const modelState = this.dndDesignController.getModelState(data);
    return (
      <div class={this.ns.b()}>
        <iBizDraggableTabs
          value={this.activePage}
          dndDesignController={this.dndDesignController}
          items={items}
          dragSwitchPage={false}
          select={this.select}
          class={this.ns.b('content')}
          onChange={this.onActivePageChange}
          onDragChange={this.onPagePositionChange}
          onAdd={this.onPageAdd}
          onRemove={this.onPageRemove}
          enableAdd={modelStateUtil.isEnableDrop(modelState)}
        >
          {{
            default: (item: IDataEntity) => {
              return this.renderItems(item.children, item);
            },
          }}
        </iBizDraggableTabs>
      </div>
    );
  },
});
