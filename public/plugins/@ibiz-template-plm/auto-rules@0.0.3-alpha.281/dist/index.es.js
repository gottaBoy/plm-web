import './style.css';
var ee = Object.defineProperty;
var le = (r, u, s) => u in r ? ee(r, u, { enumerable: !0, configurable: !0, writable: !0, value: s }) : r[u] = s;
var _ = (r, u, s) => (le(r, typeof u != "symbol" ? u + "" : u, s), s);
import { CodeListEditorController as te, registerEditorProvider as se } from "@ibiz-template/runtime";
import { defineComponent as ae, ref as v, computed as oe, watch as ne, onMounted as ue, createVNode as n, resolveComponent as f, createTextVNode as ce, isVNode as re } from "vue";
import { getDropdownProps as ie, getEditorEmits as de, useNamespace as ve } from "@ibiz-template/vue3-util";
import { RuntimeModelError as fe } from "@ibiz-template/core";
function k(r) {
  return typeof r == "function" || Object.prototype.toString.call(r) === "[object Object]" && !re(r);
}
const F = /* @__PURE__ */ ae({
  name: "AutoRules",
  props: {
    ...ie(),
    value: [String, Object, Array, Number]
  },
  emits: de(),
  setup(r, {
    emit: u
  }) {
    var j;
    const s = ve("auto-rules"), i = r.controller, p = v(!1), S = v(), g = v([]), C = v(!1), b = v(""), y = v(""), w = v([]), V = v(!1), T = v(), R = v(), L = v([]), N = v([]), O = v(!1), E = v(!1), {
      editorItems: o
    } = i.model, B = v([]), x = v("STRING");
    (j = i.editorParams) != null && j.emitType && (x.value = i.editorParams.emitType);
    const $ = (t, e = "", l = !0) => {
      if (t.length === 0)
        return [];
      const d = [];
      return t.forEach((a) => {
        if (d.push({
          ...a,
          pvalue: e,
          disabled: a.disableSelect === !0
        }), l && a.children && a.children.length > 0) {
          const c = $(a.children, a.value.toString(), l);
          d.push(...c);
        }
      }), d;
    }, J = async () => {
      E.value = !0;
      const t = await i.loadCodeList(r.data);
      O.value = !0, N.value = $(t, "", !1), B.value = $(t, ""), E.value = !1;
    }, m = (t) => B.value.find((e) => e.value === t), U = async (t) => {
      t && !O.value && await J();
    }, z = (t) => B.value.filter((e) => e.pvalue === t), P = () => {
      p.value = !1, C.value = !1, S.value = null, b.value = null, y.value = null;
    }, M = () => {
      V.value = !1, T.value = null, P();
    }, A = (t) => {
      const e = [{
        text: "- 任何 -",
        label: "- 任何 -",
        value: ""
      }];
      return (t === "true" || t === !0) && e.unshift({
        text: "- 空 -",
        label: "- 空 -",
        value: "null"
      }), e;
    }, H = async (t) => {
      if (M(), !t) {
        if (R.value = null, u("change", null), o && o.length > 0) {
          const e = o[0].id;
          u("change", null, e);
        }
        return;
      }
      if (t.endsWith(".*")) {
        if (R.value = t, L.value = z(t), V.value = !0, u("change", null), o && o.length > 0) {
          const e = o[0].id;
          u("change", null, e);
        }
      } else {
        if (R.value = null, o && o.length > 0) {
          const l = o[0].id;
          u("change", null, l);
        }
        u("change", t);
        const e = m(t);
        if (e && e.data) {
          const {
            allow_empty: l,
            codelist_tag: d,
            is_dropdown_list: a
          } = e.data;
          if (a === "true" || a === !0) {
            C.value = !0;
            const c = await i.loadCustomCodeList(d, r.data), h = A(l);
            w.value = [...h, ...c];
            return;
          }
          if (!l || l === "false" || l === !1) {
            if (o && o.length > 0) {
              const c = o[0].id;
              x.value === "ARRAY" ? u("change", ["", ""], c) : u("change", JSON.stringify(["", ""]), c);
            }
          } else
            (l === "true" || l === !0) && (g.value = i.allowEmptyText, p.value = !0);
        } else
          g.value = i.allowEmptyText, p.value = !0;
      }
    }, D = oe({
      get() {
        return R.value || r.value;
      },
      set(t) {
        H(t);
      }
    }), W = (t) => {
      if (o && o.length > 0) {
        const e = o[0].id;
        x.value === "ARRAY" ? u("change", JSON.parse(t), e) : u("change", t, e);
      }
    }, Y = (t, e) => {
      if (e === 1 ? b.value = t : y.value = t, o && o.length > 0) {
        const l = o[0].id;
        x.value === "ARRAY" ? u("change", [b.value, y.value], l) : u("change", JSON.stringify([b.value, y.value]), l);
      }
    }, G = async (t) => {
      if (P(), !t) {
        if (u("change", t), o && o.length > 0) {
          const l = o[0].id;
          u("change", null, l);
        }
        return;
      }
      const e = m(t);
      if (e && e.data) {
        const {
          allow_empty: l,
          codelist_tag: d,
          is_dropdown_list: a
        } = e.data;
        if (a === "true" || a === !0) {
          C.value = !0;
          const c = await i.loadCustomCodeList(d, r.data), h = A(l);
          w.value = [...h, ...c];
          return;
        }
        if (!l || l === "false" || l === !1) {
          if (o && o.length > 0) {
            const c = o[0].id;
            x.value === "ARRAY" ? u("change", ["", ""], c) : u("change", JSON.stringify(["", ""]), c);
            return;
          }
        } else
          (l === "true" || l === !0) && (g.value = i.allowEmptyText, p.value = !0);
      } else
        g.value = i.allowEmptyText, p.value = !0;
      if (u("change", t), o && o.length > 0) {
        const l = o[0].id;
        u("change", null, l);
      }
    }, q = () => {
      let t;
      return n(f("el-select"), {
        ref: "childFieldEditorRef",
        modelValue: T.value,
        "onUpdate:modelValue": (e) => T.value = e,
        clearable: !0,
        class: [s.b("child-select")],
        filterable: !0,
        "fit-input-width": !0,
        onChange: G
      }, k(t = L.value.map((e) => n(f("el-option"), {
        key: e.value,
        value: e.value.toString(),
        label: e.text,
        disabled: e.disableSelect === !0,
        style: e.bkcolor ? s.cssVarBlock({
          "select-option-item-bkcolor": "".concat(e.bkcolor)
        }) : "",
        class: [e.cls ? e.cls : null],
        title: e.text
      }, {
        default: () => n("div", {
          class: [s.b("select-option-content"), e.textCls ? e.textCls : null],
          style: e.color ? s.cssVarBlock({
            "select-option-item-color": "".concat(e.color)
          }) : ""
        }, [e.sysImage && n(f("iBizIcon"), {
          icon: e.sysImage
        }, null), n("span", {
          class: [s.be("select-option-content", "text")]
        }, [e.text])])
      }))) ? t : {
        default: () => [t]
      });
    }, K = () => {
      let t;
      return n(f("el-select"), {
        ref: "rulesEditorRef",
        modelValue: S.value,
        "onUpdate:modelValue": (e) => S.value = e,
        clearable: !0,
        class: [s.em("rules-select", "fix")],
        filterable: !0,
        "fit-input-width": !0,
        onChange: W
      }, k(t = g.value.map((e) => n(f("el-option"), {
        key: e.value,
        value: e.value.toString(),
        label: e.text,
        disabled: e.disableSelect === !0,
        style: e.bkcolor ? s.cssVarBlock({
          "select-option-item-bkcolor": "".concat(e.bkcolor)
        }) : "",
        class: [e.cls ? e.cls : null],
        title: e.text
      }, {
        default: () => n("div", {
          class: [s.b("select-option-content"), e.textCls ? e.textCls : null],
          style: e.color ? s.cssVarBlock({
            "select-option-item-color": "".concat(e.color)
          }) : ""
        }, [e.sysImage && n(f("iBizIcon"), {
          icon: e.sysImage
        }, null), n("span", {
          class: [s.be("select-option-content", "text")]
        }, [e.text])])
      }))) ? t : {
        default: () => [t]
      });
    }, Q = () => {
      let t, e;
      return n("div", {
        class: s.b("code-rules")
      }, [n(f("el-select"), {
        modelValue: b.value,
        "onUpdate:modelValue": (l) => b.value = l,
        clearable: !0,
        class: [s.b("rules-select")],
        filterable: !0,
        "fit-input-width": !0,
        onChange: (l) => Y(l, 1)
      }, k(t = w.value.map((l) => n(f("el-option"), {
        key: l.value,
        value: l.value.toString(),
        label: l.text,
        disabled: l.disableSelect === !0,
        style: l.bkcolor ? s.cssVarBlock({
          "select-option-item-bkcolor": "".concat(l.bkcolor)
        }) : "",
        class: [l.cls ? l.cls : null],
        title: l.text
      }, {
        default: () => n("div", {
          class: [s.b("select-option-content"), l.textCls ? l.textCls : null],
          style: l.color ? s.cssVarBlock({
            "select-option-item-color": "".concat(l.color)
          }) : ""
        }, [l.sysImage && n(f("iBizIcon"), {
          icon: l.sysImage
        }, null), n("span", {
          class: [s.be("select-option-content", "text")]
        }, [l.text])])
      }))) ? t : {
        default: () => [t]
      }), n("span", {
        class: s.be("code-rules", "change")
      }, [ce("变为")]), n(f("el-select"), {
        modelValue: y.value,
        "onUpdate:modelValue": (l) => y.value = l,
        clearable: !0,
        class: [s.b("rules-select")],
        filterable: !0,
        "fit-input-width": !0,
        onChange: (l) => Y(l, 2)
      }, k(e = w.value.map((l) => n(f("el-option"), {
        key: l.value,
        value: l.value.toString(),
        label: l.text,
        disabled: l.disableSelect === !0,
        style: l.bkcolor ? s.cssVarBlock({
          "select-option-item-bkcolor": "".concat(l.bkcolor)
        }) : "",
        class: [l.cls ? l.cls : null],
        title: l.text
      }, {
        default: () => n("div", {
          class: [s.b("select-option-content"), l.textCls ? l.textCls : null],
          style: l.color ? s.cssVarBlock({
            "select-option-item-color": "".concat(l.color)
          }) : ""
        }, [l.sysImage && n(f("iBizIcon"), {
          icon: l.sysImage
        }, null), n("span", {
          class: [s.be("select-option-content", "text")]
        }, [l.text])])
      }))) ? e : {
        default: () => [e]
      })]);
    }, X = () => {
      let t;
      return n(f("el-select"), {
        ref: "editorRef",
        modelValue: D.value,
        "onUpdate:modelValue": (e) => D.value = e,
        clearable: !0,
        class: [s.b("select")],
        filterable: !0,
        placeholder: i.placeHolder ? i.placeHolder : " ",
        disabled: r.disabled,
        loading: E.value,
        "fit-input-width": !0,
        onVisibleChange: U
      }, k(t = N.value.map((e) => n(f("el-option"), {
        key: e.value,
        value: e.value.toString(),
        label: e.text,
        disabled: e.disableSelect === !0,
        style: e.bkcolor ? s.cssVarBlock({
          "select-option-item-bkcolor": "".concat(e.bkcolor)
        }) : "",
        class: [e.cls ? e.cls : null],
        title: e.text
      }, {
        default: () => n("div", {
          class: [s.b("select-option-content"), e.textCls ? e.textCls : null],
          style: e.color ? s.cssVarBlock({
            "select-option-item-color": "".concat(e.color)
          }) : ""
        }, [e.sysImage && n(f("iBizIcon"), {
          icon: e.sysImage
        }, null), n("span", {
          class: [s.be("select-option-content", "text")]
        }, [e.text])])
      }))) ? t : {
        default: () => [t]
      });
    }, Z = async (t) => {
      const e = m(t);
      if (e != null && e.pvalue.endsWith(".*")) {
        R.value = e.pvalue, V.value = !0, T.value = t, p.value = !0, L.value = z(R.value);
        const l = m(t);
        if (l && l.data) {
          const {
            allow_empty: d,
            codelist_tag: a,
            is_dropdown_list: c
          } = l.data;
          if (c === "true" || c === !0) {
            C.value = !0;
            const h = await i.loadCustomCodeList(a, r.data), I = A(d);
            w.value = [...I, ...h];
          } else
            (d === "true" || d === !0) && (p.value = !0, g.value = i.allowEmptyText);
        } else
          g.value = i.allowEmptyText, p.value = !0;
        if (o && o.length > 0) {
          const d = o[0].id, a = r.data[d];
          if (a) {
            const c = {
              "[, null]": ["", null],
              "[null, ]": [null, ""],
              "[, ]": ["", ""]
            };
            x.value, c[a] ? S.value = JSON.stringify(c[a]) : S.value = a;
          }
        }
      } else {
        const l = m(t);
        if (l && l.data) {
          const {
            allow_empty: d,
            codelist_tag: a,
            is_dropdown_list: c
          } = l.data;
          if (c === "true" || c === !0) {
            C.value = !0;
            const h = await i.loadCustomCodeList(a, r.data), I = A(d);
            w.value = [...I, ...h];
          } else
            (d === "true" || d === !0) && (p.value = !0, g.value = i.allowEmptyText);
        } else
          g.value = i.allowEmptyText, p.value = !0;
        if (o && o.length > 0) {
          const d = o[0].id, a = r.data[d];
          try {
            if (!a) {
              y.value = null, b.value = null;
              return;
            }
            if (x.value === "ARRAY")
              if (Array.isArray(a))
                b.value = String(a[0]), y.value = String(a[1]);
              else {
                const c = a.substring(1, a.length - 1).split(",").map((h) => h.trim());
                b.value = String(c[0]), y.value = String(c[1]);
              }
            else {
              const c = JSON.parse(a);
              b.value = String(c[0]), y.value = String(c[1]);
            }
          } catch (c) {
            const h = a.substring(1, a.length - 1).split(",").map((I) => I.trim());
            h.length === 2 ? (b.value = String(h[0]), y.value = String(h[1])) : (y.value = null, b.value = null);
          }
        }
      }
    };
    return ne(() => r.value, async (t, e) => {
      (t || t === null || t === 0) && (!O.value && e === void 0 && await J(), t && t !== e && await Z(String(t)));
    }, {
      immediate: !0
    }), ue(async () => {
      await J();
    }), {
      ns: s,
      c: i,
      items: N,
      showSelect: p,
      showChildSelect: V,
      isLoading: E,
      curValue: D,
      showCodeRulesSelect: C,
      renderFieldSelect: q,
      renderRulesSelect: K,
      renderCodeRulesSelect: Q,
      renderRuleTypesSelect: X,
      onVisibleChange: U,
      getCodeListItemByValue: m
    };
  },
  render() {
    return n("div", {
      class: this.ns.b()
    }, [n("div", {
      class: this.ns.e("field-select")
    }, [this.renderRuleTypesSelect(), this.showChildSelect ? this.renderFieldSelect() : null]), n("div", {
      class: [this.ns.e("rules-select"), this.ns.is("visible", !this.showSelect && !this.showCodeRulesSelect)]
    }, [this.showSelect ? this.renderRulesSelect() : null, this.showCodeRulesSelect ? this.renderCodeRulesSelect() : null])]);
  }
});
class pe extends te {
  constructor() {
    super(...arguments);
    /**
     * [属性确定,文本项,允许空] 自定义仿真数据
     *
     * @static
     * @memberof AutoRulesController
     */
    _(this, "allowEmptyText", [
      { text: "从任何到任何", value: JSON.stringify(["", ""]) },
      {
        text: "从有值到空值",
        value: JSON.stringify(["", null])
      },
      {
        text: "从空值到有值",
        value: JSON.stringify([null, ""])
      }
    ]);
  }
  async onInit() {
    super.onInit();
  }
  // 加载自定义配置的下拉代码表
  async loadCustomCodeList(s, i) {
    const { context: p, params: S } = this.handlePublicParams(
      i,
      this.context,
      this.params
    );
    if (s) {
      const g = await ibiz.hub.getApp(this.context.srfappid);
      let C = [];
      return C = await g.codeList.get(
        "".concat(g.model.id, ".").concat(s),
        p,
        S
      ), C;
    }
    throw new fe(
      this.model,
      ibiz.i18n.t("runtime.controller.common.editor.editorNoConfigured", {
        editorType: this.model.editorType
      })
    );
  }
}
class he {
  constructor() {
    _(this, "formEditor", "AutoRules");
    _(this, "gridEditor", "AutoRules");
  }
  async createController(u, s) {
    const i = new pe(u, s);
    return await i.init(), i;
  }
}
const xe = {
  install(r) {
    r.component(F.name, F), se(
      "EDITOR_CUSTOMSTYLE_AUTO_RULES",
      () => new he()
    );
  }
};
export {
  xe as default
};
