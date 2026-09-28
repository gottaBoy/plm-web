import './assets/style.css';
import { withInstall as a, useControlController as c, useNamespace as p } from "@ibiz-template/vue3-util";
import { registerControlProvider as u, ControlType as m, ListController as d } from "@ibiz-template/runtime";
import { defineComponent as f, createVNode as r, resolveComponent as s, isVNode as b } from "vue";
var y = Object.defineProperty, v = (e, t, o) => t in e ? y(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o, h = (e, t, o) => (v(e, typeof t != "symbol" ? t + "" : t, o), o);
class C extends d {
  /**
   * 选择表格
   *
   * @readonly
   * @memberof SampleListController
   */
  get pickupGrid() {
    var t;
    return (t = this.view.getController("pickupviewpanel")) == null ? void 0 : t.embedView.getController("grid");
  }
  /**
   * 处理删除
   *
   * @param {IData} item
   * @memberof SampleListController
   */
  handleRemove(t) {
    const { items: o } = this.state, i = o.findIndex((l) => l.srfkey === t.srfkey);
    i !== -1 && o.splice(i, 1), this.pickupGrid.setSelection([...o]);
  }
  /**
   * 设置表格选中数据
   *
   * @param {IData[]} items
   * @memberof SampleListController
   */
  setData(t) {
    this.state.items = t, this.pickupGrid.setSelection([...t]);
  }
}
function S(e) {
  return typeof e == "function" || Object.prototype.toString.call(e) === "[object Object]" && !b(e);
}
const n = /* @__PURE__ */ f({
  name: "SampleList",
  props: {
    modelData: {
      type: Object,
      required: !0
    },
    context: {
      type: Object,
      required: !0
    },
    params: {
      type: Object,
      default: () => ({})
    },
    provider: {
      type: Object
    },
    mdctrlActiveMode: {
      type: Number,
      default: 2
    },
    singleSelect: {
      type: Boolean,
      default: !0
    },
    isSimple: {
      type: Boolean,
      required: !1
    },
    loadDefault: {
      type: Boolean,
      default: !0
    }
  },
  setup() {
    const e = c((...o) => new C(...o)), t = p("sample-list");
    return {
      c: e,
      ns: t,
      renderListContent: () => r("div", {
        class: t.b("content")
      }, [e.state.items.map((o) => r("div", {
        class: [t.b("item")]
      }, [r("span", {
        class: t.be("item", "caption")
      }, [o.srfmajortext]), r(s("ion-icon"), {
        name: "close-outline",
        class: t.be("item", "icon"),
        onClick: () => e.handleRemove(o)
      }, null)]))])
    };
  },
  render() {
    let e;
    return r(s("iBizControlBase"), {
      class: [this.ns.b()],
      controller: this.c
    }, S(e = this.renderListContent()) ? e : {
      default: () => [e]
    });
  }
});
class j {
  constructor() {
    h(this, "component", "SampleList");
  }
}
const L = a(n, function(e) {
  e.component(n.name, n), u(
    "".concat(m.LIST, "_RENDER_SAMPLE_LIST"),
    () => new j()
  );
}), B = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(e) {
    e.use(L);
  }
};
export {
  L as IBizSampleList,
  B as default
};
