import './assets/style.css';
import './assets/style.css';
import { registerGridColumnProvider as G, GridFieldColumnController as k, GridRowState as L, GridFieldEditColumnController as b } from "@ibiz-template/runtime";
import { withInstall as N, useNamespace as y } from "@ibiz-template/vue3-util";
import { defineComponent as A, computed as a, ref as x, createVNode as n, resolveComponent as f } from "vue";
import { isNotNil as V } from "ramda";
var z = Object.defineProperty, B = (o, t, l) => t in o ? z(o, t, { enumerable: !0, configurable: !0, writable: !0, value: l }) : o[t] = l, D = (o, t, l) => (B(o, typeof t != "symbol" ? t + "" : t, l), l);
const u = /* @__PURE__ */ A({
  name: "IBizIconGridColumn",
  props: {
    controller: {
      type: k,
      required: !0
    },
    row: {
      type: L,
      required: !0
    }
  },
  setup(o) {
    const t = y("grid-field-column"), l = (e) => {
      o.controller.hasAction && (e.stopPropagation(), o.controller.triggerAction(o.row, e));
    }, i = (e) => {
      o.controller.isLinkColumn && (e.stopPropagation(), o.controller.openLinkView(o.row, e));
    }, v = a(() => o.controller.getCustomHtml(o.row)), s = a(() => o.row.data[o.controller.model.codeName.toLowerCase()]), d = a(() => o.controller.formatValue(s.value)), m = x(""), w = (e) => {
      m.value = e;
    }, I = a(() => {
      if (o.controller.grid.overflowMode === "ellipsis" && V(s.value) && s.value !== "")
        return o.controller.codeList ? m.value : d.value + (o.controller.model.unitName || "");
    }), p = (e, r) => {
      if (e) {
        const C = e.find((c) => c.value == r);
        if (C)
          return C;
        for (let c = 0; c < e.length; c++) {
          const h = p(e[c].children, r);
          if (h)
            return h;
        }
      }
    }, g = a(() => {
      var e;
      const r = p(o.controller.codeListItems, "".concat((e = String(s.value)) == null ? void 0 : e.toLowerCase()));
      return r == null ? void 0 : r.sysImage;
    });
    return {
      ns: t,
      onCellClick: l,
      onTextClick: i,
      onInfoTextChange: w,
      onActionClick: async (e, r) => {
        await o.controller.onActionClick(e, o.row, r);
      },
      CustomHtml: v,
      fieldValue: s,
      formatValue: d,
      tooltip: I,
      codeListIcon: g
    };
  },
  render() {
    var o;
    const t = this.controller, l = t.model.deuiactionGroup ? n(f("iBizActionToolbar"), {
      class: this.ns.e("toolbar"),
      "action-details": t.model.deuiactionGroup.uiactionGroupDetails,
      "actions-state": this.row.uiActionGroupStates[this.controller.model.codeName],
      groupLevelKeys: [50, 100],
      onActionClick: this.onActionClick
    }, null) : null;
    let i = null;
    return t.isCustomCode ? i = n("span", {
      class: this.ns.e("script"),
      innerHTML: this.CustomHtml
    }, null) : t.codeList ? i = n("div", {
      class: this.ns.em("text", "icon")
    }, [n(f("iBizIcon"), {
      icon: this.codeListIcon
    }, null)]) : i = n("span", {
      class: this.ns.e("text"),
      title: this.tooltip,
      onClick: this.onTextClick
    }, [this.formatValue, this.fieldValue != null && t.model.unitName]), n("div", {
      class: [this.ns.b(), t.clickable(this.row) && this.ns.m("clickable"), this.ns.m(this.controller.grid.overflowMode), (o = this.controller.model.cellSysCss) == null ? void 0 : o.cssName, this.ns.is("has-action", !!t.model.deuiactionGroup)],
      onClick: this.onCellClick
    }, [t.model.deuiactionGroup ? [n("div", {
      class: this.ns.b("text-container")
    }, [i]), n("div", {
      class: this.ns.b("toolbar-container")
    }, [l])] : i]);
  }
});
class H {
  constructor() {
    D(this, "component", "IBizIconGridColumn");
  }
  async createController(t, l) {
    const i = new b(t, l);
    return await i.init(), i;
  }
}
const R = N(
  u,
  function(o) {
    o.component(u.name, u), G(
      "GRID_COLRENDER_ICON_GRIDCOLUMN",
      () => new H()
    );
  }
), S = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(o) {
    o.use(R);
  }
};
export {
  R as IBizIconGridColumn,
  S as default
};
