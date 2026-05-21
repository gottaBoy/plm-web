import { ref, watch, resolveComponent, createVNode, defineComponent } from 'vue';
import { useNamespace } from '@ibiz-template/vue3-util';
import { useRenderItems } from '../../use/index.mjs';
import '../../utils/index.mjs';
import './tab-panel.css';
import { modelStateUtil } from '../../utils/model-state-util/model-state-util.mjs';

"use strict";
var Component = /* @__PURE__ */ defineComponent({
  name: "IBizDndDesignTabPanel",
  props: {
    controller: {
      type: Object,
      required: true
    },
    dndDesignController: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const ns = useNamespace("dnd-design-tab-panel");
    const c = props.controller;
    const renderItems = useRenderItems();
    const activePage = ref();
    const select = ref(c.select.data);
    c.select.on((data) => {
      select.value = data;
    });
    const onActivePageChange = (item) => {
      activePage.value = item.srfkey;
      props.controller.select.set(item);
    };
    watch(select, () => {
      const items = props.controller.data.children;
      if (Array.isArray(items) && items.length) {
        if (select.value) {
          const data = items.find((item) => item.srfkey === select.value.srfkey);
          if (data) {
            activePage.value = data.srfkey;
          }
        }
      }
    }, {
      immediate: true
    });
    const onPagePositionChange = async (evt) => {
      const items = props.controller.data.children;
      if (Array.isArray(items)) {
        props.controller.change(evt, items, props.controller.data);
      }
    };
    const onPageAdd = async () => {
      const items = props.controller.data.children;
      if (Array.isArray(items)) {
        items.push({
          detailtype: "TABPAGE"
        });
        props.controller.change({
          added: {
            element: items[items.length - 1],
            newIndex: items.length - 1
          }
        }, items, props.controller.data);
      }
    };
    const onPageRemove = async (page) => {
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
      renderItems
    };
  },
  render() {
    const data = this.controller.data;
    const items = data.children || [];
    const modelState = this.dndDesignController.getModelState(data);
    return createVNode("div", {
      "class": this.ns.b()
    }, [createVNode(resolveComponent("iBizDraggableTabs"), {
      "value": this.activePage,
      "dndDesignController": this.dndDesignController,
      "items": items,
      "dragSwitchPage": false,
      "select": this.select,
      "class": this.ns.b("content"),
      "onChange": this.onActivePageChange,
      "onDragChange": this.onPagePositionChange,
      "onAdd": this.onPageAdd,
      "onRemove": this.onPageRemove,
      "enableAdd": modelStateUtil.isEnableDrop(modelState)
    }, {
      default: (item) => {
        return this.renderItems(item.children, item);
      }
    })]);
  }
});

export { Component as default };
