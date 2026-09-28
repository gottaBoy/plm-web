import './assets/style.css';
import { CodeListEditorController as ee, registerEditorProvider as le } from "@ibiz-template/runtime";
import { defineComponent as te, ref as v, computed as ae, watch as se, onMounted as oe, createVNode as n, resolveComponent as f, createTextVNode as ne, isVNode as ue } from "vue";
import { getDropdownProps as ce, getEditorEmits as ie, useNamespace as re } from "@ibiz-template/vue3-util";
import { RuntimeModelError as de } from "@ibiz-template/core";
function E(r) {
  return typeof r == "function" || Object.prototype.toString.call(r) === "[object Object]" && !ue(r);
}
const D = te({
  name: "AutoRules",
  props: ce(),
  emits: ie(),
  setup(r, { emit: c }) {
    var x;
    const a = re("auto-rules"), i = r.controller, p = v(!1), k = v(), b = v([]), C = v(!1), g = v(""), m = v(""), w = v([]), T = v(!1), A = v(), R = v(), B = v([]), L = v([]), N = v(!1), O = v(!1), { editorItems: s } = i.model, F = v([]), S = v("STRING");
    (x = i.editorParams) != null && x.emitType && (S.value = i.editorParams.emitType);
    const J = (t, e = "", l = !0) => {
      if (t.length === 0)
        return [];
      const h = [];
      return t.forEach((u) => {
        if (h.push({
          ...u,
          pvalue: e,
          disabled: u.disableSelect === !0
        }), l && u.children && u.children.length > 0) {
          const o = J(
            u.children,
            u.value.toString(),
            l
          );
          h.push(...o);
        }
      }), h;
    }, P = async () => {
      O.value = !0;
      const t = await i.loadCodeList(r.data);
      N.value = !0, L.value = J(t, "", !1), F.value = J(t, ""), O.value = !1;
    }, V = (t) => F.value.find((e) => e.value === t), z = async (t) => {
      t && !N.value && await P();
    }, Y = (t) => F.value.filter((e) => e.pvalue === t), j = () => {
      p.value = !1, C.value = !1, k.value = null, g.value = null, m.value = null;
    }, H = () => {
      T.value = !1, A.value = null, j();
    }, _ = (t) => {
      const e = [
        {
          text: "- 任何 -",
          label: "- 任何 -",
          value: ""
        }
      ];
      return (t === "true" || t === !0) && e.unshift({
        text: "- 空 -",
        label: "- 空 -",
        value: "null"
      }), e;
    }, W = async (t) => {
      if (H(), !t) {
        if (R.value = null, c("change", null), s && s.length > 0) {
          const e = s[0].id;
          c("change", null, e);
        }
        return;
      }
      if (t.endsWith(".*")) {
        if (R.value = t, B.value = Y(t), T.value = !0, c("change", null), s && s.length > 0) {
          const e = s[0].id;
          c("change", null, e);
        }
      } else {
        if (R.value = null, s && s.length > 0) {
          const l = s[0].id;
          c("change", null, l);
        }
        c("change", t);
        const e = V(t);
        if (e && e.data) {
          const {
            allow_empty: l,
            codelist_tag: h,
            is_dropdown_list: u
          } = e.data;
          if (u === "true" || u === !0) {
            C.value = !0;
            const o = await i.loadCustomCodeList(h, r.data), d = _(l);
            w.value = [...d, ...o];
            return;
          }
          if (!l || l === "false" || l === !1) {
            if (s && s.length > 0) {
              const o = s[0].id;
              S.value === "ARRAY" ? c("change", ["", ""], o) : c("change", JSON.stringify(["", ""]), o);
            }
          } else
            (l === "true" || l === !0) && (b.value = i.allowEmptyText, p.value = !0);
        } else
          b.value = i.allowEmptyText, p.value = !0;
      }
    }, U = ae({
      get() {
        return R.value || r.value;
      },
      set(t) {
        W(t);
      }
    }), $ = (t) => {
      if (s && s.length > 0) {
        const e = s[0].id;
        S.value === "ARRAY" ? c("change", JSON.parse(t), e) : c("change", t, e);
      }
    }, M = (t, e) => {
      if (e === 1 ? g.value = t : m.value = t, s && s.length > 0) {
        const l = s[0].id;
        S.value === "ARRAY" ? c("change", [g.value, m.value], l) : c(
          "change",
          JSON.stringify([g.value, m.value]),
          l
        );
      }
    }, G = async (t) => {
      if (j(), !t) {
        if (c("change", t), s && s.length > 0) {
          const l = s[0].id;
          c("change", null, l);
        }
        return;
      }
      const e = V(t);
      if (e && e.data) {
        const {
          allow_empty: l,
          codelist_tag: h,
          is_dropdown_list: u
        } = e.data;
        if (u === "true" || u === !0) {
          C.value = !0;
          const o = await i.loadCustomCodeList(h, r.data), d = _(l);
          w.value = [...d, ...o];
          return;
        }
        if (!l || l === "false" || l === !1) {
          if (s && s.length > 0) {
            const o = s[0].id;
            S.value === "ARRAY" ? c("change", ["", ""], o) : c("change", JSON.stringify(["", ""]), o);
            return;
          }
        } else
          (l === "true" || l === !0) && (b.value = i.allowEmptyText, p.value = !0);
      } else
        b.value = i.allowEmptyText, p.value = !0;
      if (c("change", t), s && s.length > 0) {
        const l = s[0].id;
        c("change", null, l);
      }
    }, q = () => {
      let t;
      return n(
        f("el-select"),
        {
          ref: "childFieldEditorRef",
          modelValue: A.value,
          "onUpdate:modelValue": (e) => A.value = e,
          clearable: !0,
          class: [a.b("child-select")],
          filterable: !0,
          "fit-input-width": !0,
          onChange: G
        },
        E(
          t = B.value.map(
            (e) => n(
              f("el-option"),
              {
                key: e.value,
                value: e.value.toString(),
                label: e.text,
                disabled: e.disableSelect === !0,
                style: e.bkcolor ? a.cssVarBlock({
                  "select-option-item-bkcolor": "".concat(e.bkcolor)
                }) : "",
                class: [e.cls ? e.cls : null],
                title: e.text
              },
              {
                default: () => n(
                  "div",
                  {
                    class: [
                      a.b("select-option-content"),
                      e.textCls ? e.textCls : null
                    ],
                    style: e.color ? a.cssVarBlock({
                      "select-option-item-color": "".concat(e.color)
                    }) : ""
                  },
                  [
                    e.sysImage && n(
                      f("iBizIcon"),
                      {
                        icon: e.sysImage
                      },
                      null
                    ),
                    n(
                      "span",
                      {
                        class: [
                          a.be("select-option-content", "text")
                        ]
                      },
                      [e.text]
                    )
                  ]
                )
              }
            )
          )
        ) ? t : {
          default: () => [t]
        }
      );
    }, K = () => {
      let t;
      return n(
        f("el-select"),
        {
          ref: "rulesEditorRef",
          modelValue: k.value,
          "onUpdate:modelValue": (e) => k.value = e,
          clearable: !0,
          class: [a.em("rules-select", "fix")],
          filterable: !0,
          "fit-input-width": !0,
          onChange: $
        },
        E(
          t = b.value.map(
            (e) => n(
              f("el-option"),
              {
                key: e.value,
                value: e.value.toString(),
                label: e.text,
                disabled: e.disableSelect === !0,
                style: e.bkcolor ? a.cssVarBlock({
                  "select-option-item-bkcolor": "".concat(e.bkcolor)
                }) : "",
                class: [e.cls ? e.cls : null],
                title: e.text
              },
              {
                default: () => n(
                  "div",
                  {
                    class: [
                      a.b("select-option-content"),
                      e.textCls ? e.textCls : null
                    ],
                    style: e.color ? a.cssVarBlock({
                      "select-option-item-color": "".concat(e.color)
                    }) : ""
                  },
                  [
                    e.sysImage && n(
                      f("iBizIcon"),
                      {
                        icon: e.sysImage
                      },
                      null
                    ),
                    n(
                      "span",
                      {
                        class: [
                          a.be("select-option-content", "text")
                        ]
                      },
                      [e.text]
                    )
                  ]
                )
              }
            )
          )
        ) ? t : {
          default: () => [t]
        }
      );
    }, Q = () => {
      let t, e;
      return n(
        "div",
        {
          class: a.b("code-rules")
        },
        [
          n(
            f("el-select"),
            {
              modelValue: g.value,
              "onUpdate:modelValue": (l) => g.value = l,
              clearable: !0,
              class: [a.b("rules-select")],
              filterable: !0,
              "fit-input-width": !0,
              onChange: (l) => M(l, 1)
            },
            E(
              t = w.value.map(
                (l) => n(
                  f("el-option"),
                  {
                    key: l.value,
                    value: l.value.toString(),
                    label: l.text,
                    disabled: l.disableSelect === !0,
                    style: l.bkcolor ? a.cssVarBlock({
                      "select-option-item-bkcolor": "".concat(l.bkcolor)
                    }) : "",
                    class: [l.cls ? l.cls : null],
                    title: l.text
                  },
                  {
                    default: () => n(
                      "div",
                      {
                        class: [
                          a.b("select-option-content"),
                          l.textCls ? l.textCls : null
                        ],
                        style: l.color ? a.cssVarBlock({
                          "select-option-item-color": "".concat(
                            l.color
                          )
                        }) : ""
                      },
                      [
                        l.sysImage && n(
                          f("iBizIcon"),
                          {
                            icon: l.sysImage
                          },
                          null
                        ),
                        n(
                          "span",
                          {
                            class: [
                              a.be("select-option-content", "text")
                            ]
                          },
                          [l.text]
                        )
                      ]
                    )
                  }
                )
              )
            ) ? t : {
              default: () => [t]
            }
          ),
          n(
            "span",
            {
              class: a.be("code-rules", "change")
            },
            [ne("变为")]
          ),
          n(
            f("el-select"),
            {
              modelValue: m.value,
              "onUpdate:modelValue": (l) => m.value = l,
              clearable: !0,
              class: [a.b("rules-select")],
              filterable: !0,
              "fit-input-width": !0,
              onChange: (l) => M(l, 2)
            },
            E(
              e = w.value.map(
                (l) => n(
                  f("el-option"),
                  {
                    key: l.value,
                    value: l.value.toString(),
                    label: l.text,
                    disabled: l.disableSelect === !0,
                    style: l.bkcolor ? a.cssVarBlock({
                      "select-option-item-bkcolor": "".concat(l.bkcolor)
                    }) : "",
                    class: [l.cls ? l.cls : null],
                    title: l.text
                  },
                  {
                    default: () => n(
                      "div",
                      {
                        class: [
                          a.b("select-option-content"),
                          l.textCls ? l.textCls : null
                        ],
                        style: l.color ? a.cssVarBlock({
                          "select-option-item-color": "".concat(
                            l.color
                          )
                        }) : ""
                      },
                      [
                        l.sysImage && n(
                          f("iBizIcon"),
                          {
                            icon: l.sysImage
                          },
                          null
                        ),
                        n(
                          "span",
                          {
                            class: [
                              a.be("select-option-content", "text")
                            ]
                          },
                          [l.text]
                        )
                      ]
                    )
                  }
                )
              )
            ) ? e : {
              default: () => [e]
            }
          )
        ]
      );
    }, X = () => {
      let t;
      return n(
        f("el-select"),
        {
          ref: "editorRef",
          modelValue: U.value,
          "onUpdate:modelValue": (e) => U.value = e,
          clearable: !0,
          class: [a.b("select")],
          filterable: !0,
          placeholder: i.placeHolder ? i.placeHolder : " ",
          disabled: r.disabled,
          loading: O.value,
          "fit-input-width": !0,
          onVisibleChange: z
        },
        E(
          t = L.value.map(
            (e) => n(
              f("el-option"),
              {
                key: e.value,
                value: e.value.toString(),
                label: e.text,
                disabled: e.disableSelect === !0,
                style: e.bkcolor ? a.cssVarBlock({
                  "select-option-item-bkcolor": "".concat(e.bkcolor)
                }) : "",
                class: [e.cls ? e.cls : null],
                title: e.text
              },
              {
                default: () => n(
                  "div",
                  {
                    class: [
                      a.b("select-option-content"),
                      e.textCls ? e.textCls : null
                    ],
                    style: e.color ? a.cssVarBlock({
                      "select-option-item-color": "".concat(e.color)
                    }) : ""
                  },
                  [
                    e.sysImage && n(
                      f("iBizIcon"),
                      {
                        icon: e.sysImage
                      },
                      null
                    ),
                    n(
                      "span",
                      {
                        class: [
                          a.be("select-option-content", "text")
                        ]
                      },
                      [e.text]
                    )
                  ]
                )
              }
            )
          )
        ) ? t : {
          default: () => [t]
        }
      );
    }, Z = async (t) => {
      var l;
      const e = V(t);
      if (e != null && ((l = e.pvalue) != null && l.endsWith(".*"))) {
        R.value = e.pvalue, T.value = !0, A.value = t, p.value = !0, B.value = Y(R.value);
        const h = V(t);
        if (h && h.data) {
          const {
            allow_empty: u,
            codelist_tag: o,
            is_dropdown_list: d
          } = h.data;
          if (d === "true" || d === !0) {
            C.value = !0;
            const y = await i.loadCustomCodeList(o, r.data), I = _(u);
            w.value = [...I, ...y];
          } else
            (u === "true" || u === !0) && (p.value = !0, b.value = i.allowEmptyText);
        } else
          b.value = i.allowEmptyText, p.value = !0;
        if (s && s.length > 0) {
          const u = s[0].id, o = r.data[u];
          if (o) {
            const d = {
              "[, null]": ["", null],
              "[null, ]": [null, ""],
              "[, ]": ["", ""]
            };
            S.value, d[o] ? k.value = JSON.stringify(d[o]) : k.value = o;
          }
        }
      } else {
        const h = V(t);
        if (h && h.data) {
          const {
            allow_empty: u,
            codelist_tag: o,
            is_dropdown_list: d
          } = h.data;
          if (d === "true" || d === !0) {
            C.value = !0;
            const y = await i.loadCustomCodeList(o, r.data), I = _(u);
            w.value = [...I, ...y];
          } else
            (u === "true" || u === !0) && (p.value = !0, b.value = i.allowEmptyText);
        } else
          b.value = i.allowEmptyText, p.value = !0;
        if (s && s.length > 0) {
          const u = s[0].id, o = r.data[u];
          try {
            if (!o) {
              m.value = null, g.value = null;
              return;
            }
            if (S.value === "ARRAY")
              if (Array.isArray(o))
                g.value = String(o[0]), m.value = String(o[1]);
              else {
                const d = o.substring(1, o.length - 1).split(",").map((y) => y.trim());
                g.value = String(d[0]), m.value = String(d[1]);
              }
            else {
              const d = JSON.parse(o);
              g.value = String(d[0]), m.value = String(d[1]);
            }
          } catch (d) {
            const y = o.substring(1, o.length - 1).split(",").map((I) => I.trim());
            y.length === 2 ? (g.value = String(y[0]), m.value = String(y[1])) : (m.value = null, g.value = null);
          }
        }
      }
    };
    return se(
      () => r.value,
      async (t, e) => {
        (t || t === null || t === 0) && (!N.value && e === void 0 && await P(), t && t !== e && await Z(String(t)));
      },
      {
        immediate: !0
      }
    ), oe(async () => {
      await P();
    }), {
      ns: a,
      c: i,
      items: L,
      showSelect: p,
      showChildSelect: T,
      isLoading: O,
      curValue: U,
      showCodeRulesSelect: C,
      renderFieldSelect: q,
      renderRulesSelect: K,
      renderCodeRulesSelect: Q,
      renderRuleTypesSelect: X,
      onVisibleChange: z,
      getCodeListItemByValue: V
    };
  },
  render() {
    return n(
      "div",
      {
        class: this.ns.b()
      },
      [
        n(
          "div",
          {
            class: this.ns.e("field-select")
          },
          [
            this.renderRuleTypesSelect(),
            this.showChildSelect ? this.renderFieldSelect() : null
          ]
        ),
        n(
          "div",
          {
            class: [
              this.ns.e("rules-select"),
              this.ns.is(
                "visible",
                !this.showSelect && !this.showCodeRulesSelect
              )
            ]
          },
          [
            this.showSelect ? this.renderRulesSelect() : null,
            this.showCodeRulesSelect ? this.renderCodeRulesSelect() : null
          ]
        )
      ]
    );
  }
});
class ve extends ee {
  constructor() {
    super(...arguments), this.allowEmptyText = [
      { text: "从任何到任何", value: JSON.stringify(["", ""]) },
      {
        text: "从有值到空值",
        value: JSON.stringify(["", null])
      },
      {
        text: "从空值到有值",
        value: JSON.stringify([null, ""])
      }
    ];
  }
  async onInit() {
    super.onInit();
  }
  // 加载自定义配置的下拉代码表
  async loadCustomCodeList(c, x) {
    const { context: a, params: i } = this.handlePublicParams(
      x,
      this.context,
      this.params
    );
    if (c) {
      const p = await ibiz.hub.getApp(this.context.srfappid);
      return p.codeList.get("".concat(p.model.id, ".").concat(c), a, i);
    }
    throw new de(
      this.model,
      ibiz.i18n.t("runtime.controller.common.editor.editorNoConfigured", {
        editorType: this.model.editorType
      })
    );
  }
}
class he {
  constructor() {
    this.formEditor = "AutoRules", this.gridEditor = "AutoRules";
  }
  async createController(c, x) {
    const a = new ve(c, x);
    return await a.init(), a;
  }
}
const be = {
  install(r) {
    r.component(D.name, D), le(
      "EDITOR_CUSTOMSTYLE_AUTO_RULES",
      () => new he()
    );
  }
};
export {
  be as default
};
