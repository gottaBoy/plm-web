import './assets/style.css';
import { ValueOP as d, registerEditorProvider as A, CodeListEditorController as D, SearchBarFilterController as T } from "@ibiz-template/runtime";
import { defineComponent as S, ref as y, watch as B, resolveComponent as O, h as V, createVNode as i, createTextVNode as E, isVNode as _ } from "vue";
import { getInputProps as L, getEditorEmits as x, useNamespace as F } from "@ibiz-template/vue3-util";
import { createUUID as N } from "qx-util";
var U = Object.defineProperty, k = (e, n, u) => n in e ? U(e, n, { enumerable: !0, configurable: !0, writable: !0, value: u }) : e[n] = u, P = (e, n, u) => (k(e, typeof n != "symbol" ? n + "" : n, u), u);
const w = [
  { valueOP: d.EQ, label: "等于(=)" },
  { valueOP: d.NOT_EQ, label: "不等于(<>)" },
  { valueOP: d.GT, label: "大于(>)" },
  { valueOP: d.GT_AND_EQ, label: "大于等于(>=)" },
  { valueOP: d.LT, label: "小于(<)" },
  { valueOP: d.LT_AND_EQ, label: "小于等于(<=)" },
  { valueOP: d.IS_NULL, label: "值为空(Nil)" },
  { valueOP: d.IS_NOT_NULL, label: "值不为空(NotNil)" },
  { valueOP: d.IN, label: "值在范围中(In)" },
  { valueOP: d.NOT_IN, label: "值不在范围中(NotIn)" },
  { valueOP: d.LIKE, label: "文本包含(%)" },
  { valueOP: d.LIFT_LIKE, label: "文本左包含(%#)" },
  { valueOP: d.RIGHT_LIKE, label: "文本右包含(#%)" },
  { valueOP: d.EXISTS, label: "存在(EXISTS)" },
  { valueOP: d.NOT_EXISTS, label: "不存在(NOTEXISTS)" }
], H = [
  d.IS_NULL,
  d.IS_NOT_NULL,
  d.EXISTS,
  d.NOT_EXISTS
];
function M(e) {
  return typeof e == "function" || Object.prototype.toString.call(e) === "[object Object]" && !_(e);
}
const C = /* @__PURE__ */ S({
  name: "IBizSearchBarFilterCondition",
  props: L(),
  emits: x(),
  setup(e, {
    emit: n
  }) {
    const u = F("search-bar-filter-condition"), h = e.controller, v = y([]), o = y([{
      text: "且",
      value: "AND"
    }, {
      text: "或",
      value: "OR"
    }]), b = /* @__PURE__ */ new Map();
    o.value.forEach((l) => b.set(l.value, l.text));
    const f = /* @__PURE__ */ new Map();
    w.forEach((l) => f.set(l.valueOP, l.label)), B(() => e.value, () => {
      if (!e.value) {
        v.value = [];
        return;
      }
      if (typeof e.value == "string") {
        const l = JSON.parse(e.value), s = (l == null ? void 0 : l.condop) || "AND", a = (l == null ? void 0 : l.searchconds) || [];
        if (Array.isArray(a) && a.length) {
          v.value = a.map((r) => {
            const t = r.fieldname || "", c = r.condop || "", p = r.value, R = r.text, g = h.filterControllers.find((I) => I.fieldName === t ? I.valueOP ? I.valueOP === c : !0 : !1);
            return g != null && g.valueItem ? {
              key: N(),
              connection: s,
              field: t,
              valueOP: c,
              value: R,
              valueItem: p
            } : {
              key: N(),
              connection: s,
              field: t,
              valueOP: c,
              value: p
            };
          });
          return;
        }
      }
      v.value = [];
    }, {
      immediate: !0
    });
    const m = () => {
      var l;
      if (!v.value.length) {
        n("change", "");
        return;
      }
      const s = {
        condop: ((l = v.value[0]) == null ? void 0 : l.connection) || "AND",
        condtype: "GROUP",
        searchconds: []
      };
      v.value.forEach((a) => {
        const r = h.filterControllers.find((c) => c.fieldName === a.field ? c.valueOP ? c.valueOP === a.valueOP : !0 : !1), t = r != null && r.valueItem ? {
          condtype: "DEFIELD",
          fieldname: a.field,
          condop: a.valueOP,
          value: a.valueItem,
          text: a.value
        } : {
          condtype: "DEFIELD",
          fieldname: a.field,
          condop: a.valueOP,
          value: a.value
        };
        s.searchconds.push(t);
      }), n("change", JSON.stringify(s));
    };
    return {
      ns: u,
      c: h,
      items: v,
      connectionItems: o,
      connectionMap: b,
      filterModeMap: f,
      handleAdd: () => {
        var l, s, a;
        if (e.disabled || e.readonly)
          return;
        const r = v.value[0], t = ((l = h.fields[0]) == null ? void 0 : l.fieldName) || "", c = ((a = (s = h.fieldMap.get(t)) == null ? void 0 : s.valueOPs) == null ? void 0 : a[0]) || "", p = {
          key: N(),
          connection: (r == null ? void 0 : r.connection) || "AND",
          field: t,
          valueOP: c
        };
        v.value.push(p), m();
      },
      handleRemove: (l) => {
        e.disabled || e.readonly || (v.value.splice(l, 1), m());
      },
      renderEditor: (l) => {
        var s;
        if (!l.valueOP || H.includes(l.valueOP))
          return;
        const a = h.filterControllers.find((r) => r.fieldName === l.field ? r.valueOP ? r.valueOP === l.valueOP : !0 : !1);
        if (a && !a.noEditor) {
          if (a.editorProvider && a.editor) {
            const r = O(a.editorProvider.formEditor), t = {};
            return a.valueItem && (t[a.valueItem] = l.valueItem), V(r, {
              key: (s = a.editor.model) == null ? void 0 : s.id,
              value: l.value,
              controller: a.editor,
              disabled: e.disabled,
              readonly: e.readonly,
              data: t,
              onChange: (c, p) => {
                a.valueItem && p === a.valueItem ? l.valueItem = c : l.value = c, m();
              }
            });
          }
          return i(O("not-supported-editor"), {
            modelData: a.model.editor
          }, null);
        }
      },
      handleConnectionChange: (l) => {
        v.value.forEach((s) => {
          s.connection = l.connection;
        }), m();
      },
      handleFieldChange: async (l) => {
        var s;
        const a = h.fieldMap.get(l.field);
        l.valueOP = ((s = a == null ? void 0 : a.valueOPs) == null ? void 0 : s[0]) || "", l.value = void 0, l.valueItem = void 0, m();
      },
      handleValueOPChange: (l) => {
        l.value = void 0, l.valueItem = void 0, m();
      }
    };
  },
  render() {
    return i("div", {
      class: [this.ns.b(), this.disabled && this.ns.m("disabled"), this.readonly && this.ns.m("readonly"), this.ns.is("border-mode", this.c.borderMode === "BORDER")]
    }, [i("div", {
      class: [this.ns.b("content"), this.ns.is("border-mode", this.c.borderMode === "BORDER")]
    }, [this.c.borderMode === "BORDER" && i("div", {
      class: [this.ns.be("content", "total"), this.items.length && this.ns.bem("content", "total", "border")]
    }, [E("查询条件("), this.items.length, E(")")]), this.items.map((e, n) => {
      var u;
      let h, v;
      return i("div", {
        class: this.ns.b("item")
      }, [i("div", {
        class: [this.ns.be("item", "connection"), n === 0 && this.ns.bem("item", "connection", "init")]
      }, [n === 0 ? i("div", null, [E("当")]) : this.readonly ? i("div", {
        class: this.ns.bem("item", "connection", "readonly")
      }, [this.connectionMap.get(e.connection) || ""]) : i(O("el-select"), {
        modelValue: e.connection,
        "onUpdate:modelValue": (o) => e.connection = o,
        disabled: n > 1 || this.disabled,
        onChange: () => {
          this.handleConnectionChange(e);
        }
      }, M(h = this.connectionItems.map((o) => i(O("el-option"), {
        key: o.value,
        value: o.value,
        label: o.text
      }, null))) ? h : {
        default: () => [h]
      })]), i("div", {
        class: this.ns.b("item-content")
      }, [i("div", {
        class: this.ns.be("item", "field")
      }, [this.readonly ? ((u = this.c.fieldMap.get(e.field)) == null ? void 0 : u.label) || "" : i(O("el-select"), {
        modelValue: e.field,
        "onUpdate:modelValue": (o) => e.field = o,
        disabled: this.disabled,
        onChange: () => {
          this.handleFieldChange(e);
        }
      }, M(v = this.c.fields.map((o) => i(O("el-option"), {
        key: o.fieldName,
        value: o.fieldName,
        label: o.label
      }, null))) ? v : {
        default: () => [v]
      })]), i("div", {
        class: this.ns.be("item", "valueOP")
      }, [this.readonly ? this.filterModeMap.get(e.valueOP) || e.valueOP || "" : i(O("el-select"), {
        modelValue: e.valueOP,
        "onUpdate:modelValue": (o) => e.valueOP = o,
        disabled: this.disabled,
        onChange: () => {
          this.handleValueOPChange(e);
        }
      }, {
        default: () => {
          var o, b;
          return [(b = (o = this.c.fieldMap.get(e.field)) == null ? void 0 : o.valueOPs) == null ? void 0 : b.map((f) => i(O("el-option"), {
            key: f,
            value: f,
            label: this.filterModeMap.get(f) || f
          }, null))];
        }
      })]), i("div", {
        class: this.ns.be("item", "editor")
      }, [this.renderEditor(e)])]), i("div", {
        class: this.ns.be("item", "btn"),
        title: "删除",
        onClick: (o) => {
          o.stopPropagation(), this.handleRemove(n);
        }
      }, [i("svg", {
        viewBox: "0 0 16 16",
        xmlns: "http://www.w3.org/2000/svg",
        height: "1em",
        width: "1em",
        preserveAspectRatio: "xMidYMid meet",
        focusable: "false"
      }, [i("g", {
        "stroke-width": "1",
        "fill-rule": "evenodd"
      }, [i("path", {
        d: "M4.002 3.403V1a1 1 0 0 1 1-1h6.003a1 1 0 0 1 1 1v2.403h3.396a.6.6 0 1 1 0 1.2h-1.395V15a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4.603H.6a.6.6 0 1 1 0-1.2h3.4zm8.804 1.205H3.2V14.8h9.605V4.608zM5.202 1.2v2.155h5.603V1.2H5.202zm.6 6.417a.6.6 0 0 1 1.201 0v4.758a.6.6 0 0 1-1.2 0V7.617zm3.202 0a.6.6 0 0 1 1.2 0v4.758a.6.6 0 0 1-1.2 0V7.617z"
      }, null)])])])]);
    })]), i("div", {
      class: [this.ns.b("footer"), this.ns.is("border-mode", this.c.borderMode === "BORDER")]
    }, [i("div", {
      class: this.ns.b("footer-btn"),
      onClick: this.handleAdd
    }, [i("svg", {
      class: this.ns.be("footer-btn", "icon"),
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false"
    }, [i("g", {
      "stroke-width": "1",
      "fill-rule": "evenodd"
    }, [i("path", {
      d: "M8.578 7.383V1.602a.601.601 0 1 0-1.2 0v5.781H1.6a.601.601 0 0 0 0 1.203h5.777v5.812a.601.601 0 1 0 1.2 0V8.586H14.4a.601.601 0 0 0 0-1.203H8.578z"
    }, null)])]), i("div", {
      class: this.ns.be("footer-btn", "text")
    }, [E("新增筛选条件")])])])]);
  }
});
class z extends D {
  constructor() {
    super(...arguments), P(this, "fields", []), P(this, "fieldMap", /* @__PURE__ */ new Map()), P(this, "filterControllers", []), P(this, "borderMode", "DEFAULT"), P(this, "searchBarName", "searchbar");
  }
  async onInit() {
    var n, u;
    await super.onInit(), this.borderMode = ((n = this.editorParams) == null ? void 0 : n.BORDERMODE) === "BORDER" ? "BORDER" : "DEFAULT", (u = this.editorParams) != null && u.SEARCHBARNAME && (this.searchBarName = this.editorParams.SEARCHBARNAME), await this.initFields();
  }
  /**
   * 初始化字段
   *
   * @author zhanghengfeng
   * @date 2024-07-24 16:07:38
   * @return {*}  {Promise<void>}
   */
  async initFields() {
    var n, u, h, v;
    const o = this.searchBarName, b = this.parent;
    if (!b)
      return;
    const f = (v = (h = (u = (n = b.form) == null ? void 0 : n.view) == null ? void 0 : u.layoutPanel) == null ? void 0 : h.model) == null ? void 0 : v.controls;
    if (!Array.isArray(f))
      return;
    const m = f.find((t) => t.name === o);
    if (!m || !Array.isArray(m.searchBarFilters) || !m.searchBarFilters.length || !m.appDataEntityId)
      return;
    const l = await ibiz.hub.getAppDataEntity(
      m.appDataEntityId,
      this.context.srfappid
    ), s = m.searchBarFilters.map((t) => new T(
      t,
      l,
      this.context,
      this.params
    ));
    await Promise.all(s.map((t) => t.init()));
    const a = [], r = /* @__PURE__ */ new Map();
    s.forEach((t) => {
      if (t.hidden)
        return;
      let c = a.find((p) => p.fieldName === t.fieldName);
      c || (c = {
        fieldName: t.fieldName,
        label: t.label,
        valueOPs: []
      }, a.push(c)), t.valueOP ? c.valueOPs.push(t.valueOP) : c.valueOPs = w.map((p) => p.valueOP);
    }), a.forEach((t) => {
      t.valueOPs = [...new Set(t.valueOPs)], r.set(t.fieldName, t);
    }), this.fields = a, this.fieldMap = r, this.filterControllers = s.filter((t) => !t.hidden);
  }
}
class X {
  constructor() {
    P(this, "formEditor", "IBizSearchBarFilterCondition"), P(this, "gridEditor", "IBizSearchBarFilterCondition");
  }
  async createController(n, u) {
    const h = new z(
      n,
      u
    );
    return await h.init(), h;
  }
}
const Y = {
  install(e) {
    e.component(
      C.name,
      C
    ), A(
      "EDITOR_CUSTOMSTYLE_SEARCH_BAR_FILTER_CONDITION",
      () => new X()
    );
  }
};
export {
  Y as default
};
