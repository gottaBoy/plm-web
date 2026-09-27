import './assets/style.css';
import './assets/style.css';
import { registerPanelItemProvider as c, PanelItemController as p, PanelItemState as u } from "@ibiz-template/runtime";
import { withInstall as m, useNamespace as h } from "@ibiz-template/vue3-util";
import { defineComponent as I, createVNode as s, resolveComponent as d } from "vue";
var v = Object.defineProperty, f = (e, t, n) => t in e ? v(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, i = (e, t, n) => (f(e, typeof t != "symbol" ? t + "" : t, n), n);
class w extends u {
  constructor() {
    super(...arguments), i(this, "caption", "");
  }
}
class l extends p {
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
const a = /* @__PURE__ */ I({
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
      ns: h("data-info-title")
    };
  },
  render() {
    return s("div", {
      class: this.ns.b()
    }, [s("div", {
      class: [this.ns.b("caption"), this.ns.is("show-icon", !!this.$props.controller.model.sysImage)]
    }, [this.$props.controller.model.sysImage && s(d("iBizIcon"), {
      class: [this.ns.be("caption", "icon")],
      icon: this.$props.controller.model.sysImage
    }, null), s("span", null, [this.$props.controller.state.caption])])]);
  }
});
class b {
  constructor() {
    i(this, "component", "IBizDataInfoTitle");
  }
  async createController(t, n, o) {
    const r = new l(t, n, o);
    return await r.init(), r;
  }
}
const C = m(a, function(e) {
  e.component(a.name, a), c(
    "CUSTOM_DATA_INFO_TITLE",
    () => new b()
  );
});
export {
  C as IBizDataInfoTitle,
  C as default
};
