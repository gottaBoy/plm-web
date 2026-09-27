import './style.css';
var R = Object.defineProperty;
var U = (e, n, r) => n in e ? R(e, n, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[n] = r;
var h = (e, n, r) => (U(e, typeof n != "symbol" ? n + "" : n, r), r);
import { GridFieldColumnController as I, GridRowState as A, registerGridColumnProvider as G } from "@ibiz-template/runtime";
import { defineComponent as O, computed as m, createVNode as c } from "vue";
import { useNamespace as g } from "@ibiz-template/vue3-util";
const p = /* @__PURE__ */ O({
  name: "IBizGridPersonalInfoColumn",
  props: {
    controller: {
      type: I,
      required: !0
    },
    row: {
      type: A,
      required: !0
    }
  },
  setup(e) {
    const n = g("grid-field-column"), r = g("grid-personal-info-column"), o = e.controller, d = {
      id: "assignee_id",
      name: "assignee_name"
    };
    let f = "ROWFIELD", v = "---";
    const {
      userParam: a
    } = o.model;
    if (a) {
      if (a.USERFILTERMAP)
        try {
          const t = JSON.parse(a.USERFILTERMAP);
          Object.assign(d, t);
        } catch (t) {
          ibiz.log.error(t);
        }
      a.datasource && (f = a.datasource), a.placeholder !== void 0 && (v = a.placeholder);
    }
    const b = (t) => {
      e.controller.hasAction && (t.stopPropagation(), e.controller.triggerAction(e.row, t));
    }, u = m(() => {
      let t = e.row.data[e.controller.fieldName] || {};
      return f === "ROWDATA" && (t = e.row.data), t;
    }), l = m(() => u.value[d.name] || ""), C = m(() => u.value[d.id] || ""), w = () => {
      const t = o.codeListItems;
      if (!t || t.length === 0)
        return "";
      const s = t.find((i) => i.value && C.value && i.value === C.value || i.text && l.value && i.text === l.value) || {};
      if (s.data && s.data.iconurl) {
        const i = JSON.parse(s.data.iconurl);
        if (i.length > 0) {
          const {
            downloadUrl: N
          } = ibiz.util.file.calcFileUpDownUrl(o.context, o.params, e.row.data, {});
          return N.replace("%fileId%", i[0].id);
        }
      }
      return "";
    }, P = () => {
      var s;
      const t = w();
      return t ? c("img", {
        class: r.bem("content", "head-sculpture", "avatar-icon"),
        src: t,
        alt: ""
      }, null) : ((s = ibiz.util.text) == null ? void 0 : s.abbreviation(l.value)) || "";
    };
    return {
      ns: n,
      ns2: r,
      c: o,
      fieldValue: u,
      onCellClick: b,
      renderContent: () => {
        var t;
        return l.value ? c("div", {
          class: r.b("content")
        }, [c("div", {
          class: r.be("content", "head-sculpture"),
          style: "background-color:".concat((t = ibiz.util.text) == null ? void 0 : t.stringToHexColor(l.value))
        }, [P()]), l.value ? c("div", {
          class: r.be("content", "tip"),
          title: l.value
        }, [l.value]) : null]) : v;
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
class x {
  constructor() {
    h(this, "component", "IBizGridPersonalInfoColumn");
  }
  async createController(n, r) {
    const o = new I(n, r);
    return await o.init(), o;
  }
}
const k = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(e) {
    e.component(p.name, p), G(
      "GRID_COLRENDER_PERSONAL_INFO_COLUMN",
      () => new x()
    );
  }
};
export {
  k as default
};
