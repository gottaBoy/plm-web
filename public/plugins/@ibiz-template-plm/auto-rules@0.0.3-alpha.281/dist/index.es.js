import './assets/style.css';
import './assets/style.css';
import { registerEditorProvider as ee, CodeListEditorController as te } from "@ibiz-template/runtime";
import { defineComponent as le, ref as v, computed as ae, watch as se, onMounted as oe, createVNode as i, resolveComponent as p, createTextVNode as ne, isVNode as ie } from "vue";
import { getDropdownProps as ce, getEditorEmits as ue, useNamespace as re } from "@ibiz-template/vue3-util";
import { RuntimeModelError as de } from "@ibiz-template/core";
var ve = Object.defineProperty, pe = (u, o, h) => o in u ? ve(u, o, { enumerable: !0, configurable: !0, writable: !0, value: h }) : u[o] = h, P = (u, o, h) => (pe(u, typeof o != "symbol" ? o + "" : o, h), h);
function E(u) {
  return typeof u == "function" || Object.prototype.toString.call(u) === "[object Object]" && !ie(u);
}
const D = /* @__PURE__ */ le({
  name: "AutoRules",
  props: {
    ...ce(),
    value: [String, Object, Array, Number]
  },
  emits: ue(),
  setup(u, {
    emit: o
  }) {
    var h;
    const a = re("auto-rules"), r = u.controller, m = v(!1), S = v(), y = v([]), w = v(!1), g = v(""), b = v(""), C = v([]), I = v(!1), T = v(), k = v(), B = v([]), N = v([]), O = v(!1), _ = v(!1), {
      editorItems: s
    } = r.model, L = v([]), x = v("STRING");
    (h = r.editorParams) != null && h.emitType && (x.value = r.editorParams.emitType);
    const J = (l, e = "", t = !0) => {
      if (l.length === 0)
        return [];
      const d = [];
      return l.forEach((n) => {
        if (d.push({
          ...n,
          pvalue: e,
          disabled: n.disableSelect === !0
        }), t && n.children && n.children.length > 0) {
          const c = J(n.children, n.value.toString(), t);
          d.push(...c);
        }
      }), d;
    }, U = async () => {
      _.value = !0;
      const l = await r.loadCodeList(u.data);
      O.value = !0, N.value = J(l, "", !1), L.value = J(l, ""), _.value = !1;
    }, R = (l) => L.value.find((e) => e.value === l), Y = async (l) => {
      l && !O.value && await U();
    }, j = (l) => L.value.filter((e) => e.pvalue === l), F = () => {
      m.value = !1, w.value = !1, S.value = null, g.value = null, b.value = null;
    }, H = () => {
      I.value = !1, T.value = null, F();
    }, A = (l) => {
      const e = [{
        text: "- 任何 -",
        label: "- 任何 -",
        value: ""
      }];
      return (l === "true" || l === !0) && e.unshift({
        text: "- 空 -",
        label: "- 空 -",
        value: "null"
      }), e;
    }, W = async (l) => {
      if (H(), !l) {
        if (k.value = null, o("change", null), s && s.length > 0) {
          const e = s[0].id;
          o("change", null, e);
        }
        return;
      }
      if (l.endsWith(".*")) {
        if (k.value = l, B.value = j(l), I.value = !0, o("change", null), s && s.length > 0) {
          const e = s[0].id;
          o("change", null, e);
        }
      } else {
        if (k.value = null, s && s.length > 0) {
          const t = s[0].id;
          o("change", null, t);
        }
        o("change", l);
        const e = R(l);
        if (e && e.data) {
          const {
            allow_empty: t,
            codelist_tag: d,
            is_dropdown_list: n
          } = e.data;
          if (n === "true" || n === !0) {
            w.value = !0;
            const c = await r.loadCustomCodeList(d, u.data), f = A(t);
            C.value = [...f, ...c];
            return;
          }
          if (!t || t === "false" || t === !1) {
            if (s && s.length > 0) {
              const c = s[0].id;
              x.value === "ARRAY" ? o("change", ["", ""], c) : o("change", JSON.stringify(["", ""]), c);
            }
          } else
            (t === "true" || t === !0) && (y.value = r.allowEmptyText, m.value = !0);
        } else
          y.value = r.allowEmptyText, m.value = !0;
      }
    }, z = ae({
      get() {
        return k.value || u.value;
      },
      set(l) {
        W(l);
      }
    }), G = (l) => {
      if (s && s.length > 0) {
        const e = s[0].id;
        x.value === "ARRAY" ? o("change", JSON.parse(l), e) : o("change", l, e);
      }
    }, M = (l, e) => {
      if (e === 1 ? g.value = l : b.value = l, s && s.length > 0) {
        const t = s[0].id;
        x.value === "ARRAY" ? o("change", [g.value, b.value], t) : o("change", JSON.stringify([g.value, b.value]), t);
      }
    }, q = async (l) => {
      if (F(), !l) {
        if (o("change", l), s && s.length > 0) {
          const t = s[0].id;
          o("change", null, t);
        }
        return;
      }
      const e = R(l);
      if (e && e.data) {
        const {
          allow_empty: t,
          codelist_tag: d,
          is_dropdown_list: n
        } = e.data;
        if (n === "true" || n === !0) {
          w.value = !0;
          const c = await r.loadCustomCodeList(d, u.data), f = A(t);
          C.value = [...f, ...c];
          return;
        }
        if (!t || t === "false" || t === !1) {
          if (s && s.length > 0) {
            const c = s[0].id;
            x.value === "ARRAY" ? o("change", ["", ""], c) : o("change", JSON.stringify(["", ""]), c);
            return;
          }
        } else
          (t === "true" || t === !0) && (y.value = r.allowEmptyText, m.value = !0);
      } else
        y.value = r.allowEmptyText, m.value = !0;
      if (o("change", l), s && s.length > 0) {
        const t = s[0].id;
        o("change", null, t);
      }
    }, K = () => {
      let l;
      return i(p("el-select"), {
        ref: "childFieldEditorRef",
        modelValue: T.value,
        "onUpdate:modelValue": (e) => T.value = e,
        clearable: !0,
        class: [a.b("child-select")],
        filterable: !0,
        "fit-input-width": !0,
        onChange: q
      }, E(l = B.value.map((e) => i(p("el-option"), {
        key: e.value,
        value: e.value.toString(),
        label: e.text,
        disabled: e.disableSelect === !0,
        style: e.bkcolor ? a.cssVarBlock({
          "select-option-item-bkcolor": "".concat(e.bkcolor)
        }) : "",
        class: [e.cls ? e.cls : null],
        title: e.text
      }, {
        default: () => i("div", {
          class: [a.b("select-option-content"), e.textCls ? e.textCls : null],
          style: e.color ? a.cssVarBlock({
            "select-option-item-color": "".concat(e.color)
          }) : ""
        }, [e.sysImage && i(p("iBizIcon"), {
          icon: e.sysImage
        }, null), i("span", {
          class: [a.be("select-option-content", "text")]
        }, [e.text])])
      }))) ? l : {
        default: () => [l]
      });
    }, Q = () => {
      let l;
      return i(p("el-select"), {
        ref: "rulesEditorRef",
        modelValue: S.value,
        "onUpdate:modelValue": (e) => S.value = e,
        clearable: !0,
        class: [a.em("rules-select", "fix")],
        filterable: !0,
        "fit-input-width": !0,
        onChange: G
      }, E(l = y.value.map((e) => i(p("el-option"), {
        key: e.value,
        value: e.value.toString(),
        label: e.text,
        disabled: e.disableSelect === !0,
        style: e.bkcolor ? a.cssVarBlock({
          "select-option-item-bkcolor": "".concat(e.bkcolor)
        }) : "",
        class: [e.cls ? e.cls : null],
        title: e.text
      }, {
        default: () => i("div", {
          class: [a.b("select-option-content"), e.textCls ? e.textCls : null],
          style: e.color ? a.cssVarBlock({
            "select-option-item-color": "".concat(e.color)
          }) : ""
        }, [e.sysImage && i(p("iBizIcon"), {
          icon: e.sysImage
        }, null), i("span", {
          class: [a.be("select-option-content", "text")]
        }, [e.text])])
      }))) ? l : {
        default: () => [l]
      });
    }, X = () => {
      let l, e;
      return i("div", {
        class: a.b("code-rules")
      }, [i(p("el-select"), {
        modelValue: g.value,
        "onUpdate:modelValue": (t) => g.value = t,
        clearable: !0,
        class: [a.b("rules-select")],
        filterable: !0,
        "fit-input-width": !0,
        onChange: (t) => M(t, 1)
      }, E(l = C.value.map((t) => i(p("el-option"), {
        key: t.value,
        value: t.value.toString(),
        label: t.text,
        disabled: t.disableSelect === !0,
        style: t.bkcolor ? a.cssVarBlock({
          "select-option-item-bkcolor": "".concat(t.bkcolor)
        }) : "",
        class: [t.cls ? t.cls : null],
        title: t.text
      }, {
        default: () => i("div", {
          class: [a.b("select-option-content"), t.textCls ? t.textCls : null],
          style: t.color ? a.cssVarBlock({
            "select-option-item-color": "".concat(t.color)
          }) : ""
        }, [t.sysImage && i(p("iBizIcon"), {
          icon: t.sysImage
        }, null), i("span", {
          class: [a.be("select-option-content", "text")]
        }, [t.text])])
      }))) ? l : {
        default: () => [l]
      }), i("span", {
        class: a.be("code-rules", "change")
      }, [ne("变为")]), i(p("el-select"), {
        modelValue: b.value,
        "onUpdate:modelValue": (t) => b.value = t,
        clearable: !0,
        class: [a.b("rules-select")],
        filterable: !0,
        "fit-input-width": !0,
        onChange: (t) => M(t, 2)
      }, E(e = C.value.map((t) => i(p("el-option"), {
        key: t.value,
        value: t.value.toString(),
        label: t.text,
        disabled: t.disableSelect === !0,
        style: t.bkcolor ? a.cssVarBlock({
          "select-option-item-bkcolor": "".concat(t.bkcolor)
        }) : "",
        class: [t.cls ? t.cls : null],
        title: t.text
      }, {
        default: () => i("div", {
          class: [a.b("select-option-content"), t.textCls ? t.textCls : null],
          style: t.color ? a.cssVarBlock({
            "select-option-item-color": "".concat(t.color)
          }) : ""
        }, [t.sysImage && i(p("iBizIcon"), {
          icon: t.sysImage
        }, null), i("span", {
          class: [a.be("select-option-content", "text")]
        }, [t.text])])
      }))) ? e : {
        default: () => [e]
      })]);
    }, Z = () => {
      let l;
      return i(p("el-select"), {
        ref: "editorRef",
        modelValue: z.value,
        "onUpdate:modelValue": (e) => z.value = e,
        clearable: !0,
        class: [a.b("select")],
        filterable: !0,
        placeholder: r.placeHolder ? r.placeHolder : " ",
        disabled: u.disabled,
        loading: _.value,
        "fit-input-width": !0,
        onVisibleChange: Y
      }, E(l = N.value.map((e) => i(p("el-option"), {
        key: e.value,
        value: e.value.toString(),
        label: e.text,
        disabled: e.disableSelect === !0,
        style: e.bkcolor ? a.cssVarBlock({
          "select-option-item-bkcolor": "".concat(e.bkcolor)
        }) : "",
        class: [e.cls ? e.cls : null],
        title: e.text
      }, {
        default: () => i("div", {
          class: [a.b("select-option-content"), e.textCls ? e.textCls : null],
          style: e.color ? a.cssVarBlock({
            "select-option-item-color": "".concat(e.color)
          }) : ""
        }, [e.sysImage && i(p("iBizIcon"), {
          icon: e.sysImage
        }, null), i("span", {
          class: [a.be("select-option-content", "text")]
        }, [e.text])])
      }))) ? l : {
        default: () => [l]
      });
    }, $ = async (l) => {
      const e = R(l);
      if (e != null && e.pvalue.endsWith(".*")) {
        k.value = e.pvalue, I.value = !0, T.value = l, m.value = !0, B.value = j(k.value);
        const t = R(l);
        if (t && t.data) {
          const {
            allow_empty: d,
            codelist_tag: n,
            is_dropdown_list: c
          } = t.data;
          if (c === "true" || c === !0) {
            w.value = !0;
            const f = await r.loadCustomCodeList(n, u.data), V = A(d);
            C.value = [...V, ...f];
          } else
            (d === "true" || d === !0) && (m.value = !0, y.value = r.allowEmptyText);
        } else
          y.value = r.allowEmptyText, m.value = !0;
        if (s && s.length > 0) {
          const d = s[0].id, n = u.data[d];
          if (n) {
            const c = {
              "[, null]": ["", null],
              "[null, ]": [null, ""],
              "[, ]": ["", ""]
            };
            x.value, c[n] ? S.value = JSON.stringify(c[n]) : S.value = n;
          }
        }
      } else {
        const t = R(l);
        if (t && t.data) {
          const {
            allow_empty: d,
            codelist_tag: n,
            is_dropdown_list: c
          } = t.data;
          if (c === "true" || c === !0) {
            w.value = !0;
            const f = await r.loadCustomCodeList(n, u.data), V = A(d);
            C.value = [...V, ...f];
          } else
            (d === "true" || d === !0) && (m.value = !0, y.value = r.allowEmptyText);
        } else
          y.value = r.allowEmptyText, m.value = !0;
        if (s && s.length > 0) {
          const d = s[0].id, n = u.data[d];
          try {
            if (!n) {
              b.value = null, g.value = null;
              return;
            }
            if (x.value === "ARRAY")
              if (Array.isArray(n))
                g.value = String(n[0]), b.value = String(n[1]);
              else {
                const c = n.substring(1, n.length - 1).split(",").map((f) => f.trim());
                g.value = String(c[0]), b.value = String(c[1]);
              }
            else {
              const c = JSON.parse(n);
              g.value = String(c[0]), b.value = String(c[1]);
            }
          } catch (c) {
            const f = n.substring(1, n.length - 1).split(",").map((V) => V.trim());
            f.length === 2 ? (g.value = String(f[0]), b.value = String(f[1])) : (b.value = null, g.value = null);
          }
        }
      }
    };
    return se(() => u.value, async (l, e) => {
      (l || l === null || l === 0) && (!O.value && e === void 0 && await U(), l && l !== e && await $(String(l)));
    }, {
      immediate: !0
    }), oe(async () => {
      await U();
    }), {
      ns: a,
      c: r,
      items: N,
      showSelect: m,
      showChildSelect: I,
      isLoading: _,
      curValue: z,
      showCodeRulesSelect: w,
      renderFieldSelect: K,
      renderRulesSelect: Q,
      renderCodeRulesSelect: X,
      renderRuleTypesSelect: Z,
      onVisibleChange: Y,
      getCodeListItemByValue: R
    };
  },
  render() {
    return i("div", {
      class: this.ns.b()
    }, [i("div", {
      class: this.ns.e("field-select")
    }, [this.renderRuleTypesSelect(), this.showChildSelect ? this.renderFieldSelect() : null]), i("div", {
      class: [this.ns.e("rules-select"), this.ns.is("visible", !this.showSelect && !this.showCodeRulesSelect)]
    }, [this.showSelect ? this.renderRulesSelect() : null, this.showCodeRulesSelect ? this.renderCodeRulesSelect() : null])]);
  }
});
class me extends te {
  constructor() {
    super(...arguments), P(this, "allowEmptyText", [
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
  async loadCustomCodeList(o, h) {
    const { context: a, params: r } = this.handlePublicParams(
      h,
      this.context,
      this.params
    );
    if (o) {
      const m = await ibiz.hub.getApp(this.context.srfappid);
      let S = [];
      return S = await m.codeList.get(
        "".concat(m.model.id, ".").concat(o),
        a,
        r
      ), S;
    }
    throw new de(
      this.model,
      ibiz.i18n.t("runtime.controller.common.editor.editorNoConfigured", {
        editorType: this.model.editorType
      })
    );
  }
}
class fe {
  constructor() {
    P(this, "formEditor", "AutoRules"), P(this, "gridEditor", "AutoRules");
  }
  async createController(o, h) {
    const a = new me(o, h);
    return await a.init(), a;
  }
}
const Se = {
  install(u) {
    u.component(D.name, D), ee(
      "EDITOR_CUSTOMSTYLE_AUTO_RULES",
      () => new fe()
    );
  }
};
export {
  Se as default
};
