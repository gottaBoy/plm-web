import './style.css';
var c = Object.defineProperty;
var p = (e, t, n) => t in e ? c(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var a = (e, t, n) => (p(e, typeof t != "symbol" ? t + "" : t, n), n);
import { PanelItemState as m, PanelItemController as I, registerPanelItemProvider as h } from "@ibiz-template/runtime";
import { useNamespace as d, withInstall as u } from "@ibiz-template/vue3-util";
import { defineComponent as f, createVNode as s, resolveComponent as T } from "vue";
class w extends m {
  constructor() {
    super(...arguments);
    /**
     * 标题
     */
    a(this, "caption", "");
  }
}
class l extends I {
  async onInit() {
    super.onInit(), this.state.caption = this.panel.view.state.caption, this.panel.view.evt.on(
      "onViewInfoChange",
      ({ caption: t, dataInfo: n }) => {
        var o;
        this.state.caption = "".concat(this.panel.view.state.caption).concat(n ? "-".concat(n) : ""), (o = ibiz.util) == null || o.setBrowserTitle(this.state.caption);
      }
    );
  }
  /**
   * 创建面板状态对象
   *
   * @protected
   * @return {*}  {IDataInfoTitleState}
   */
  createState() {
    var t;
    return new w((t = this.parent) == null ? void 0 : t.state);
  }
}
const i = /* @__PURE__ */ f({
  name: "IBizDataInfoTitle",
  props: {
    modelData: {
      type: Object,
      required: !0
    },
    controller: {
      type: l,
      required: !0
    }
  },
  setup() {
    return {
      ns: d("data-info-title")
    };
  },
  render() {
    return s("div", {
      class: this.ns.b()
    }, [s("div", {
      class: [this.ns.b("caption"), this.ns.is("show-icon", !!this.$props.controller.model.sysImage)]
    }, [this.$props.controller.model.sysImage && s(T("iBizIcon"), {
      class: [this.ns.be("caption", "icon")],
      icon: this.$props.controller.model.sysImage
    }, null), s("span", null, [this.$props.controller.state.caption])])]);
  }
});
class v {
  constructor() {
    a(this, "component", "IBizDataInfoTitle");
  }
  async createController(t, n, o) {
    const r = new l(t, n, o);
    return await r.init(), r;
  }
}
const b = u(i, function(e) {
  e.component(i.name, i), h(
    "CUSTOM_DATA_INFO_TITLE",
    () => new v()
  );
});
export {
  b as IBizDataInfoTitle,
  b as default
};
