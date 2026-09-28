import './assets/style.css';
import { PanelItemState as l, PanelItemController as c, registerPanelItemProvider as p } from "@ibiz-template/runtime";
import { useNamespace as m, withInstall as I } from "@ibiz-template/vue3-util";
import { defineComponent as h, h as o, resolveComponent as u } from "vue";
class d extends l {
  constructor() {
    super(...arguments), this.caption = "";
  }
}
class r extends c {
  async onInit() {
    super.onInit(), this.state.caption = this.panel.view.state.caption, this.panel.view.evt.on("onViewInfoChange", ({ dataInfo: t }) => {
      var n, s;
      this.state.caption = "".concat(this.panel.view.state.caption).concat(t ? "-".concat(t) : ""), (s = (n = ibiz.util).setBrowserTitle) == null || s.call(n, this.state.caption);
    });
  }
  createState() {
    var t;
    return new d((t = this.parent) == null ? void 0 : t.state);
  }
}
const a = h({
  name: "IBizDataInfoTitle",
  props: {
    modelData: { type: Object, required: !0 },
    controller: { type: r, required: !0 }
  },
  setup() {
    return { ns: m("data-info-title") };
  },
  render() {
    const { model: e, state: t } = this.controller;
    return o("div", { class: this.ns.b() }, [
      o("div", {
        class: [this.ns.b("caption"), this.ns.is("show-icon", !!e.sysImage)]
      }, [
        e.sysImage && o(u("iBizIcon"), {
          class: [this.ns.be("caption", "icon")],
          icon: e.sysImage
        }),
        o("span", null, [t.caption])
      ])
    ]);
  }
});
class f {
  constructor() {
    this.component = "IBizDataInfoTitle";
  }
  async createController(t, n, s) {
    const i = new r(t, n, s);
    return await i.init(), i;
  }
}
const D = I(a, (e) => {
  e.component(a.name, a), p(
    "CUSTOM_DATA_INFO_TITLE",
    () => new f()
  );
});
export {
  D as IBizDataInfoTitle,
  D as default
};
