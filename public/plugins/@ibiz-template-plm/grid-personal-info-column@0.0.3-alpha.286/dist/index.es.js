import './assets/style.css';
import { registerGridColumnProvider as N, GridFieldColumnController as C, GridRowState as y } from "@ibiz-template/runtime";
import { defineComponent as O, computed as m, createVNode as c } from "vue";
import { useNamespace as h } from "@ibiz-template/vue3-util";
var P = Object.defineProperty, x = (e, o, r) => o in e ? P(e, o, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[o] = r, E = (e, o, r) => (x(e, typeof o != "symbol" ? o + "" : o, r), r);
const b = /* @__PURE__ */ O({
  name: "IBizGridPersonalInfoColumn",
  props: {
    controller: {
      type: C,
      required: !0
    },
    row: {
      type: y,
      required: !0
    }
  },
  setup(e) {
    const o = h("grid-field-column"), r = h("grid-personal-info-column"), l = e.controller, u = {
      id: "assignee_id",
      name: "assignee_name"
    };
    let v = "ROWFIELD", p = "---";
    const {
      userParam: a
    } = l.model;
    if (a) {
      if (a.USERFILTERMAP)
        try {
          const t = JSON.parse(a.USERFILTERMAP);
          Object.assign(u, t);
        } catch (t) {
          ibiz.log.error(t);
        }
      a.datasource && (v = a.datasource), a.placeholder !== void 0 && (p = a.placeholder);
    }
    const g = (t) => {
      e.controller.hasAction && (t.stopPropagation(), e.controller.triggerAction(e.row, t));
    }, d = m(() => {
      let t = e.row.data[e.controller.fieldName] || {};
      return v === "ROWDATA" && (t = e.row.data), t;
    }), n = m(() => d.value[u.name] || ""), f = m(() => d.value[u.id] || ""), w = () => {
      const t = l.codeListItems;
      if (!t || t.length === 0)
        return "";
      const s = t.find((i) => i.value && f.value && i.value === f.value || i.text && n.value && i.text === n.value) || {};
      if (s.data && s.data.iconurl) {
        const i = JSON.parse(s.data.iconurl);
        if (i.length > 0) {
          const {
            downloadUrl: I
          } = ibiz.util.file.calcFileUpDownUrl(l.context, l.params, e.row.data, {});
          return I.replace("%fileId%", i[0].id);
        }
      }
      return "";
    }, R = () => {
      var t;
      const s = w();
      return s ? c("img", {
        class: r.bem("content", "head-sculpture", "avatar-icon"),
        src: s,
        alt: ""
      }, null) : ((t = ibiz.util.text) == null ? void 0 : t.abbreviation(n.value)) || "";
    };
    return {
      ns: o,
      ns2: r,
      c: l,
      fieldValue: d,
      onCellClick: g,
      renderContent: () => {
        var t;
        return n.value ? c("div", {
          class: r.b("content")
        }, [c("div", {
          class: r.be("content", "head-sculpture"),
          style: "background-color:".concat((t = ibiz.util.text) == null ? void 0 : t.stringToHexColor(n.value))
        }, [R()]), n.value ? c("div", {
          class: r.be("content", "tip"),
          title: n.value
        }, [n.value]) : null]) : p;
      }
    };
  },
  render() {
    var e;
    return c("div", {
      class: [this.ns.b(), this.c.clickable(this.row) && this.ns.m("clickable"), this.ns.m(this.controller.grid.overflowMode), this.ns2.m(this.controller.grid.overflowMode), (e = this.controller.model.cellSysCss) == null ? void 0 : e.cssName, this.ns.is("has-action", !!this.c.model.deuiactionGroup)],
      onClick: this.onCellClick
    }, [this.renderContent()]);
  }
});
class k {
  constructor() {
    E(this, "component", "IBizGridPersonalInfoColumn");
  }
  async createController(o, r) {
    const l = new C(o, r);
    return await l.init(), l;
  }
}
const S = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(e) {
    e.component(b.name, b), N(
      "GRID_COLRENDER_PERSONAL_INFO_COLUMN",
      () => new k()
    );
  }
};
export {
  S as default
};
