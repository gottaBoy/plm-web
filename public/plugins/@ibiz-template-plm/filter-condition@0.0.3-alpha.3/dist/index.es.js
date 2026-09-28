import './assets/style.css';
import { defineComponent as N, ref as f, watch as P, h as i, resolveComponent as u } from "vue";
import { ValueOP as e, getEditorProvider as _, CodeListEditorController as g, getEntitySchema as y, registerEditorProvider as L } from "@ibiz-template/runtime";
import { getEditorEmits as S, useNamespace as C } from "@ibiz-template/vue3-util";
import { createUUID as m } from "qx-util";
const D = {
  string: [
    e.EQ,
    e.NOT_EQ,
    e.IS_NULL,
    e.IS_NOT_NULL,
    e.USER_LIKE,
    e.LIKE,
    e.LIFT_LIKE,
    e.RIGHT_LIKE
  ],
  number: [
    e.EQ,
    e.GT,
    e.GT_AND_EQ,
    e.LT,
    e.LT_AND_EQ,
    e.NOT_EQ,
    e.IS_NULL,
    e.IS_NOT_NULL,
    e.IN,
    e.NOT_IN
  ],
  date: [
    e.EQ,
    e.GT,
    e.GT_AND_EQ,
    e.LT,
    e.LT_AND_EQ,
    e.NOT_EQ,
    e.IS_NULL,
    e.IS_NOT_NULL,
    e.IN,
    e.NOT_IN
  ],
  dropdown: [
    e.EQ,
    e.NOT_EQ,
    e.IS_NULL,
    e.IS_NOT_NULL,
    e.IN,
    e.NOT_IN
  ],
  dataPicker: [
    e.EQ,
    e.NOT_EQ,
    e.IS_NULL,
    e.IS_NOT_NULL,
    e.IN,
    e.NOT_IN
  ]
}, F = [
  e.IS_NULL,
  e.IS_NOT_NULL,
  e.EXISTS,
  e.NOT_EXISTS
], M = {
  string: { appId: "", editorType: "TEXTBOX" },
  number: { appId: "", editorType: "NUMBER" },
  date: { appId: "", editorType: "DATEPICKEREX", dateTimeFormat: "YYYY-MM-DD" },
  dropdown: {
    appId: "",
    valueType: "SIMPLE",
    editorType: "MDROPDOWNLIST",
    appCodeListId: "",
    editorParams: { overflowMode: "ellipsis" }
  },
  dataPicker: {
    appId: "",
    editorType: "ADDRESSPICKUP",
    appDEDataSetId: "fetchdefault",
    objectIdField: "srfkey",
    objectNameField: "srfmajortext",
    valueType: "OBJECTS",
    editorParams: { overflowMode: "ellipsis" }
  }
}, w = [
  { valueOP: e.EQ, label: "等于(=)" },
  { valueOP: e.NOT_EQ, label: "不等于(<>)" },
  { valueOP: e.GT, label: "大于(>)" },
  { valueOP: e.GT_AND_EQ, label: "大于等于(>=)" },
  { valueOP: e.LT, label: "小于(<)" },
  { valueOP: e.LT_AND_EQ, label: "小于等于(<=)" },
  { valueOP: e.IS_NULL, label: "值为空(Nil)" },
  { valueOP: e.IS_NOT_NULL, label: "值不为空(NotNil)" },
  { valueOP: e.IN, label: "值在范围中(In)" },
  { valueOP: e.NOT_IN, label: "值不在范围中(NotIn)" },
  { valueOP: e.LIKE, label: "文本包含(%)" },
  { valueOP: e.LIFT_LIKE, label: "文本左包含(%#)" },
  { valueOP: e.RIGHT_LIKE, label: "文本右包含(#%)" },
  { valueOP: e.EXISTS, label: "存在(EXISTS)" },
  { valueOP: e.NOT_EXISTS, label: "不存在(NOTEXISTS)" }
], R = [
  { text: "且", value: "AND" },
  { text: "或", value: "OR" }
];
function U(o) {
  return typeof o == "function" || Object.prototype.toString.call(o) === "[object Object]" && !("__v_isVNode" in o);
}
function I(o, s) {
  return i("svg", {
    class: s,
    viewBox: "0 0 16 16",
    xmlns: "http://www.w3.org/2000/svg",
    height: "1em",
    width: "1em",
    preserveAspectRatio: "xMidYMid meet",
    focusable: "false"
  }, [i("g", { "stroke-width": "1", "fill-rule": "evenodd" }, [
    i("path", { d: o })
  ])]);
}
const T = N({
  name: "IBizFilterCondition",
  props: {
    value: [String, Number],
    controller: {
      type: Object,
      required: !0
    },
    data: {
      type: Object,
      required: !0
    },
    disabled: { type: Boolean },
    readonly: { type: Boolean, default: !1 },
    autoFocus: { type: Boolean, default: !1 },
    overflowMode: { type: String },
    controlParams: { type: Object, required: !1 }
  },
  emits: S(),
  setup(o, { emit: s }) {
    const a = C("filter-condition"), r = o.controller, n = f([]), h = /* @__PURE__ */ new Map();
    w.forEach((t) => h.set(t.valueOP, t.label));
    const p = async (t) => {
      const l = r.schemaFieldMap.get(t.field);
      if (!l)
        return;
      const d = r.getEditor(l), c = await _(d);
      c && (t.editorProvider = c, t.editor = await c.createController(d, {
        context: r.context,
        params: r.params
      }));
    };
    P(() => o.value, async (t) => {
      if (!t) {
        n.value = [];
        return;
      }
      if (typeof t == "string") {
        const l = JSON.parse(t), d = (l == null ? void 0 : l.condop) || "AND", c = (l == null ? void 0 : l.searchconds) || [];
        if (Array.isArray(c) && c.length) {
          n.value = await Promise.all(c.map(async (E) => {
            const O = {
              key: m(),
              connection: d,
              field: E.fieldname || "",
              valueOP: E.condop || "",
              value: E.value
            };
            return await p(O), O;
          }));
          return;
        }
      }
      n.value = [];
    }, { immediate: !0 });
    const v = () => {
      var l;
      if (!n.value.length) {
        s("change", "");
        return;
      }
      const t = {
        condop: ((l = n.value[0]) == null ? void 0 : l.connection) || "AND",
        condtype: "GROUP",
        searchconds: n.value.map((d) => ({
          condtype: "DEFIELD",
          fieldname: d.field,
          condop: d.valueOP,
          value: d.value
        }))
      };
      s("change", JSON.stringify(t));
    };
    return {
      ns: a,
      c: r,
      items: n,
      connectionItems: R,
      filterModeMap: h,
      handleAdd: async () => {
        var E, O, b;
        if (o.disabled)
          return;
        const t = n.value[0], l = ((E = r.schemaFields[0]) == null ? void 0 : E.appDEFieldId) || "", d = ((b = (O = r.schemaFieldMap.get(l)) == null ? void 0 : O.valueOPs) == null ? void 0 : b[0]) || "", c = {
          key: m(),
          connection: (t == null ? void 0 : t.connection) || "AND",
          field: l,
          valueOP: d
        };
        await p(c), n.value.push(c), v();
      },
      handleRemove: (t) => {
        o.disabled || (n.value.splice(t, 1), v());
      },
      renderEditor: (t) => {
        if (!t.valueOP || F.includes(t.valueOP))
          return null;
        if (!t.editorProvider || !t.editor)
          return;
        const l = u(t.editorProvider.formEditor);
        return i(l, {
          value: t.value,
          controller: t.editor,
          disabled: o.disabled,
          onChange: (d) => {
            t.value = d, v();
          }
        });
      },
      handleConnectionChange: (t) => {
        n.value.forEach((l) => {
          l.connection = t.connection;
        }), v();
      },
      handleFieldChange: async (t) => {
        var d;
        const l = r.schemaFieldMap.get(t.field);
        t.valueOP = ((d = l == null ? void 0 : l.valueOPs) == null ? void 0 : d[0]) || "", t.value = void 0, t.editorProvider = void 0, t.editor = void 0, await p(t), v();
      },
      handleValueOPChange: (t) => {
        t.value = void 0, v();
      },
      isComponent: U
    };
  },
  render() {
    return i("div", {
      class: [
        this.ns.b(),
        this.disabled && this.ns.m("disabled"),
        this.ns.is("border-mode", this.c.borderMode === "BORDER")
      ]
    }, [
      i("div", {
        class: [this.ns.b("content"), this.ns.is("border-mode", this.c.borderMode === "BORDER")]
      }, [
        this.c.borderMode && i("div", { class: this.ns.be("content", "total") }, [
          "查询条件(",
          this.items.length,
          ")"
        ]),
        this.items.map((o, s) => i("div", {
          key: o.key,
          class: this.ns.b("item")
        }, [
          i("div", {
            class: [
              this.ns.be("item", "connection"),
              s === 0 && this.ns.bem("item", "connection", "init")
            ]
          }, [s === 0 ? i("div", null, ["当"]) : i(u("el-select"), {
            modelValue: o.connection,
            "onUpdate:modelValue": (a) => {
              o.connection = a;
            },
            disabled: s > 1 || this.disabled,
            onChange: () => this.handleConnectionChange(o)
          }, () => this.connectionItems.map((a) => i(u("el-option"), {
            key: a.value,
            value: a.value,
            label: a.text
          })))]),
          i("div", { class: this.ns.b("item-content") }, [
            i("div", { class: this.ns.be("item", "field") }, [
              i(u("el-select"), {
                modelValue: o.field,
                "onUpdate:modelValue": (a) => {
                  o.field = a;
                },
                disabled: this.disabled,
                onChange: () => this.handleFieldChange(o)
              }, () => this.c.schemaFields.map((a) => i(u("el-option"), {
                key: a.appDEFieldId,
                value: a.appDEFieldId,
                label: a.caption
              })))
            ]),
            i("div", { class: this.ns.be("item", "valueOP") }, [
              i(u("el-select"), {
                modelValue: o.valueOP,
                "onUpdate:modelValue": (a) => {
                  o.valueOP = a;
                },
                disabled: this.disabled,
                onChange: () => this.handleValueOPChange(o)
              }, () => {
                var a, r;
                return (r = (a = this.c.schemaFieldMap.get(o.field)) == null ? void 0 : a.valueOPs) == null ? void 0 : r.map((n) => i(
                  u("el-option"),
                  {
                    key: n,
                    value: n,
                    label: this.filterModeMap.get(n) || n
                  }
                ));
              })
            ]),
            i("div", { class: this.ns.be("item", "editor") }, [
              this.renderEditor(o)
            ])
          ]),
          i("div", {
            class: this.ns.be("item", "btn"),
            onClick: (a) => {
              a.stopPropagation(), this.handleRemove(s);
            }
          }, [I(
            "M4.002 3.403V1a1 1 0 0 1 1-1h6.003a1 1 0 0 1 1 1v2.403h3.396a.6.6 0 1 1 0 1.2h-1.395V15a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4.603H.6a.6.6 0 0 1 0-1.2h3.4zm8.804 1.205H3.2V14.8h9.605V4.608zM5.202 1.2v2.155h5.603V1.2zm.6 6.417a.6.6 0 0 1 1.201 0v4.758a.6.6 0 0 1-1.2 0V7.617zm3.202 0a.6.6 0 0 1 1.2 0v4.758a.6.6 0 0 1-1.2 0V7.617z"
          )])
        ]))
      ]),
      i("div", {
        class: [this.ns.b("footer"), this.ns.is("border-mode", this.c.borderMode === "BORDER")]
      }, [
        i("div", {
          class: this.ns.b("footer-btn"),
          onClick: this.handleAdd
        }, [
          I("M8.578 7.383V1.602a.601.601 0 1 0-1.2 0v5.781H1.6a.601.601 0 0 0 0 1.203h5.777v5.812a.601.601 0 1 0 1.2 0V8.586H14.4a.601.601 0 0 0 0-1.203H8.578z", this.ns.be("footer-btn", "icon")),
          i("div", { class: this.ns.be("footer-btn", "text") }, ["新增筛选条件"])
        ])
      ])
    ]);
  }
});
class A extends g {
  constructor() {
    super(...arguments), this.jsonSchemaTag = "", this.schemaFields = [], this.schemaFieldMap = /* @__PURE__ */ new Map(), this.borderMode = "DEFAULT";
  }
  async onInit() {
    var a, r;
    if (await super.onInit(), this.jsonSchemaTag = ((a = this.editorParams) == null ? void 0 : a.JSONSCHEMATAG) || "", this.borderMode = ((r = this.editorParams) == null ? void 0 : r.BORDERMODE) === "BORDER" ? "BORDER" : "DEFAULT", !this.jsonSchemaTag)
      return;
    const s = await y(this.jsonSchemaTag, this.context, { ...this.params });
    s && (this.schemaFields = this.calcSchemaFieldBySchema(s), this.schemaFields.forEach((n) => {
      this.schemaFieldMap.set(n.appDEFieldId, n);
    }));
  }
  calcSchemaFieldBySchema(s) {
    if (!s.properties)
      return [];
    const a = s.properties;
    return Object.keys(a).length ? Object.keys(a).map((r) => {
      var p;
      const n = a[r];
      let h = "string";
      switch (n.type) {
        case "string":
          n.format === "date-time" && (h = "date"), n.enumSource && (h = "dropdown");
          break;
        case "integer":
        case "number":
          h = "number";
          break;
        default:
          n.$ref && (h = "dataPicker");
          break;
      }
      return {
        type: h,
        appDEFieldId: r,
        valueOPs: D[h],
        caption: n.description,
        appDataEntityId: (p = n.$ref) == null ? void 0 : p.split(".")[0],
        appCodeListId: n.enumSource
      };
    }) : [];
  }
  getEditor(s) {
    const a = { ...M[s.type] };
    return s.type === "dropdown" && Object.assign(a, { appCodeListId: s.appCodeListId }), s.type === "dataPicker" && Object.assign(a, { appDataEntityId: s.appDataEntityId }), a;
  }
}
class V {
  constructor() {
    this.formEditor = "IBizFilterCondition", this.gridEditor = "IBizFilterCondition";
  }
  async createController(s, a) {
    const r = new A(s, a);
    return await r.init(), r;
  }
}
function k() {
  L(
    "EDITOR_CUSTOMSTYLE_FILTER_CONDITION",
    () => new V()
  );
}
const J = {
  install(o) {
    o.component(T.name, T), k();
  }
};
export {
  T as FilterCondition,
  J as default
};
