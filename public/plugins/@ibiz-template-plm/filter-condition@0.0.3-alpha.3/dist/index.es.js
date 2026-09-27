import './assets/style.css';
import './assets/style.css';
import { ValueOP as e, getEditorProvider as _, registerEditorProvider as S, CodeListEditorController as y, getEntitySchema as D } from "@ibiz-template/runtime";
import { defineComponent as w, ref as T, watch as M, resolveComponent as p, h as C, createVNode as s, createTextVNode as I, isVNode as F } from "vue";
import { getInputProps as R, getEditorEmits as U, useNamespace as A } from "@ibiz-template/vue3-util";
import { createUUID as g } from "qx-util";
var V = Object.defineProperty, k = (i, l, o) => l in i ? V(i, l, { enumerable: !0, configurable: !0, writable: !0, value: o }) : i[l] = o, b = (i, l, o) => (k(i, typeof l != "symbol" ? l + "" : l, o), o);
const Q = {
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
}, x = [
  e.IS_NULL,
  e.IS_NOT_NULL,
  e.EXISTS,
  e.NOT_EXISTS
], j = {
  string: {
    appId: "",
    editorType: "TEXTBOX"
  },
  number: {
    appId: "",
    editorType: "NUMBER"
  },
  date: {
    appId: "",
    editorType: "DATEPICKEREX",
    dateTimeFormat: "YYYY-MM-DD"
  },
  dropdown: {
    appId: "",
    valueType: "SIMPLE",
    editorType: "MDROPDOWNLIST",
    appCodeListId: "",
    editorParams: {
      overflowMode: "ellipsis"
    }
  },
  dataPicker: {
    appId: "",
    editorType: "ADDRESSPICKUP",
    appDEDataSetId: "fetchdefault",
    objectIdField: "srfkey",
    objectNameField: "srfmajortext",
    valueType: "OBJECTS",
    editorParams: {
      overflowMode: "ellipsis"
    }
  }
}, B = [
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
];
function L(i) {
  return typeof i == "function" || Object.prototype.toString.call(i) === "[object Object]" && !F(i);
}
const P = /* @__PURE__ */ w({
  name: "IBizFilterCondition",
  props: R(),
  emits: U(),
  setup(i, {
    emit: l
  }) {
    const o = A("filter-condition"), n = i.controller, t = T([]), h = T([{
      text: "且",
      value: "AND"
    }, {
      text: "或",
      value: "OR"
    }]), c = /* @__PURE__ */ new Map();
    B.forEach((a) => c.set(a.valueOP, a.label));
    const O = async (a) => {
      const r = n.schemaFieldMap.get(a.field);
      if (!r)
        return;
      const d = n.getEditor(r), u = await _(d);
      if (u) {
        a.editorProvider = u;
        const m = await u.createController(d, {
          context: n.context,
          params: n.params
        });
        a.editor = m;
      }
    };
    M(() => i.value, async () => {
      if (!i.value) {
        t.value = [];
        return;
      }
      if (typeof i.value == "string") {
        const a = JSON.parse(i.value), r = (a == null ? void 0 : a.condop) || "AND", d = (a == null ? void 0 : a.searchconds) || [];
        if (Array.isArray(d) && d.length) {
          t.value = await Promise.all(d.map(async (u) => {
            const m = u.fieldname || "", f = u.condop || "", E = u.value, N = {
              key: g(),
              connection: r,
              field: m,
              valueOP: f,
              value: E
            };
            return await O(N), N;
          }));
          return;
        }
      }
      t.value = [];
    }, {
      immediate: !0
    });
    const v = () => {
      var a;
      if (!t.value.length) {
        l("change", "");
        return;
      }
      const r = {
        condop: ((a = t.value[0]) == null ? void 0 : a.connection) || "AND",
        condtype: "GROUP",
        searchconds: []
      };
      t.value.forEach((d) => {
        r.searchconds.push({
          condtype: "DEFIELD",
          fieldname: d.field,
          condop: d.valueOP,
          value: d.value
        });
      }), l("change", JSON.stringify(r));
    };
    return {
      ns: o,
      c: n,
      items: t,
      connectionItems: h,
      filterModeMap: c,
      handleAdd: async () => {
        var a, r, d;
        if (i.disabled)
          return;
        const u = t.value[0], m = ((a = n.schemaFields[0]) == null ? void 0 : a.appDEFieldId) || "", f = ((d = (r = n.schemaFieldMap.get(m)) == null ? void 0 : r.valueOPs) == null ? void 0 : d[0]) || "", E = {
          key: g(),
          connection: u != null && u.connection ? u.connection : "AND",
          field: m,
          valueOP: f
        };
        await O(E), t.value.push(E), v();
      },
      handleRemove: (a) => {
        i.disabled || (t.value.splice(a, 1), v());
      },
      renderEditor: (a) => {
        if (!a.valueOP || x.includes(a.valueOP))
          return null;
        if (a.editorProvider && a.editor) {
          const r = p(a.editorProvider.formEditor);
          return C(r, {
            value: a.value,
            controller: a.editor,
            disabled: i.disabled,
            onChange: (d) => {
              a.value = d, v();
            }
          });
        }
      },
      handleConnectionChange: (a) => {
        t.value.forEach((r) => {
          r.connection = a.connection;
        }), v();
      },
      handleFieldChange: async (a) => {
        var r;
        const d = n.schemaFieldMap.get(a.field);
        a.valueOP = ((r = d == null ? void 0 : d.valueOPs) == null ? void 0 : r[0]) || "", a.value = void 0, a.editorProvider = void 0, a.editor = void 0, await O(a), v();
      },
      handleValueOPChange: (a) => {
        a.value = void 0, v();
      }
    };
  },
  render() {
    return s("div", {
      class: [this.ns.b(), this.disabled && this.ns.m("disabled"), this.ns.is("border-mode", this.c.borderMode === "BORDER")]
    }, [s("div", {
      class: [this.ns.b("content"), this.ns.is("border-mode", this.c.borderMode === "BORDER")]
    }, [this.c.borderMode && s("div", {
      class: this.ns.be("content", "total")
    }, [I("查询条件("), this.items.length, I(")")]), this.items.map((i, l) => {
      let o, n;
      return s("div", {
        class: this.ns.b("item")
      }, [s("div", {
        class: [this.ns.be("item", "connection"), l === 0 && this.ns.bem("item", "connection", "init")]
      }, [l === 0 ? s("div", null, [I("当")]) : s(p("el-select"), {
        modelValue: i.connection,
        "onUpdate:modelValue": (t) => i.connection = t,
        disabled: l > 1 || this.disabled,
        onChange: () => {
          this.handleConnectionChange(i);
        }
      }, L(o = this.connectionItems.map((t) => s(p("el-option"), {
        key: t.value,
        value: t.value,
        label: t.text
      }, null))) ? o : {
        default: () => [o]
      })]), s("div", {
        class: this.ns.b("item-content")
      }, [s("div", {
        class: this.ns.be("item", "field")
      }, [s(p("el-select"), {
        modelValue: i.field,
        "onUpdate:modelValue": (t) => i.field = t,
        disabled: this.disabled,
        onChange: () => {
          this.handleFieldChange(i);
        }
      }, L(n = this.c.schemaFields.map((t) => s(p("el-option"), {
        key: t.appDEFieldId,
        value: t.appDEFieldId,
        label: t.caption
      }, null))) ? n : {
        default: () => [n]
      })]), s("div", {
        class: this.ns.be("item", "valueOP")
      }, [s(p("el-select"), {
        modelValue: i.valueOP,
        "onUpdate:modelValue": (t) => i.valueOP = t,
        disabled: this.disabled,
        onChange: () => {
          this.handleValueOPChange(i);
        }
      }, {
        default: () => {
          var t, h;
          return [(h = (t = this.c.schemaFieldMap.get(i.field)) == null ? void 0 : t.valueOPs) == null ? void 0 : h.map((c) => s(p("el-option"), {
            key: c,
            value: c,
            label: this.filterModeMap.get(c) || c
          }, null))];
        }
      })]), s("div", {
        class: this.ns.be("item", "editor")
      }, [this.renderEditor(i)])]), s("div", {
        class: this.ns.be("item", "btn"),
        onClick: (t) => {
          t.stopPropagation(), this.handleRemove(l);
        }
      }, [s("svg", {
        viewBox: "0 0 16 16",
        xmlns: "http://www.w3.org/2000/svg",
        height: "1em",
        width: "1em",
        preserveAspectRatio: "xMidYMid meet",
        focusable: "false"
      }, [s("g", {
        "stroke-width": "1",
        "fill-rule": "evenodd"
      }, [s("path", {
        d: "M4.002 3.403V1a1 1 0 0 1 1-1h6.003a1 1 0 0 1 1 1v2.403h3.396a.6.6 0 1 1 0 1.2h-1.395V15a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4.603H.6a.6.6 0 1 1 0-1.2h3.4zm8.804 1.205H3.2V14.8h9.605V4.608zM5.202 1.2v2.155h5.603V1.2H5.202zm.6 6.417a.6.6 0 0 1 1.201 0v4.758a.6.6 0 0 1-1.2 0V7.617zm3.202 0a.6.6 0 0 1 1.2 0v4.758a.6.6 0 0 1-1.2 0V7.617z"
      }, null)])])])]);
    })]), s("div", {
      class: [this.ns.b("footer"), this.ns.is("border-mode", this.c.borderMode === "BORDER")]
    }, [s("div", {
      class: this.ns.b("footer-btn"),
      onClick: this.handleAdd
    }, [s("svg", {
      class: this.ns.be("footer-btn", "icon"),
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false"
    }, [s("g", {
      "stroke-width": "1",
      "fill-rule": "evenodd"
    }, [s("path", {
      d: "M8.578 7.383V1.602a.601.601 0 1 0-1.2 0v5.781H1.6a.601.601 0 0 0 0 1.203h5.777v5.812a.601.601 0 1 0 1.2 0V8.586H14.4a.601.601 0 0 0 0-1.203H8.578z"
    }, null)])]), s("div", {
      class: this.ns.be("footer-btn", "text")
    }, [I("新增筛选条件")])])])]);
  }
});
class G extends y {
  constructor() {
    super(...arguments), b(this, "jsonSchemaTag", ""), b(this, "schemaFields", []), b(this, "schemaFieldMap", /* @__PURE__ */ new Map()), b(this, "borderMode", "DEFAULT");
  }
  /**
   * 初始化
   *
   * @author zhanghengfeng
   * @date 2024-07-10 10:07:23
   * @protected
   * @return {*}  {Promise<void>}
   */
  async onInit() {
    var l, o;
    if (await super.onInit(), this.jsonSchemaTag = ((l = this.editorParams) == null ? void 0 : l.JSONSCHEMATAG) || "", this.borderMode = ((o = this.editorParams) == null ? void 0 : o.BORDERMODE) === "BORDER" ? "BORDER" : "DEFAULT", this.jsonSchemaTag) {
      const n = await D(
        this.jsonSchemaTag,
        this.context,
        {
          ...this.params
        }
      );
      if (n) {
        const t = this.calcSchemaFieldBySchema(n);
        this.schemaFields = t, this.schemaFields.forEach((h) => {
          this.schemaFieldMap.set(h.appDEFieldId, h);
        });
      }
    }
  }
  /**
   * 计算jsonSchema属性字段
   *
   * @author zhanghengfeng
   * @date 2024-07-10 10:07:35
   * @param {IData} jsonSchema
   * @return {*}  {ISchemaField[]}
   */
  calcSchemaFieldBySchema(l) {
    if (!l.properties)
      return [];
    const { properties: o } = l;
    if (!Object.keys(o).length)
      return [];
    const n = [];
    return Object.keys(o).forEach((t) => {
      var h;
      let c = "string";
      switch (o[t].type) {
        case "string":
          o[t].format === "date-time" && (c = "date"), o[t].enumSource && (c = "dropdown");
          break;
        case "integer":
        case "number":
          c = "number";
          break;
        default:
          o[t].$ref && (c = "dataPicker");
          break;
      }
      n.push({
        type: c,
        appDEFieldId: t,
        valueOPs: Q[c],
        caption: o[t].description,
        appDataEntityId: (h = o[t].$ref) == null ? void 0 : h.split(".")[0],
        appCodeListId: o[t].enumSource
      });
    }), n;
  }
  /**
   * 获取编辑器模型
   *
   * @author zhanghengfeng
   * @date 2024-07-10 10:07:49
   * @param {ISchemaField} field
   * @return {*}  {IEditor}
   */
  getEditor(l) {
    const o = { ...j[l.type] };
    return l.type === "dropdown" && Object.assign(o, {
      appCodeListId: l.appCodeListId
    }), l.type === "dataPicker" && Object.assign(o, {
      appDataEntityId: l.appDataEntityId
    }), o;
  }
}
class z {
  constructor() {
    b(this, "formEditor", "IBizFilterCondition"), b(this, "gridEditor", "IBizFilterCondition");
  }
  async createController(l, o) {
    const n = new G(l, o);
    return await n.init(), n;
  }
}
const J = {
  install(i) {
    i.component(P.name, P), S(
      "EDITOR_CUSTOMSTYLE_FILTER_CONDITION",
      () => new z()
    );
  }
};
export {
  J as default
};
