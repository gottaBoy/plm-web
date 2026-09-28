import './assets/style.css';
import { withInstall as z, useNamespace as w, useControlController as M, useClickOutside as I } from "@ibiz-template/vue3-util";
import { registerControlProvider as j, EditFormController as A, convertNavData as F, EditFormService as B, getEntitySchema as L } from "@ibiz-template/runtime";
import { defineComponent as k, computed as T, watch as D, reactive as x, ref as v, onMounted as S, createVNode as o, onUnmounted as N, resolveComponent as R, h as V, nextTick as H } from "vue";
import { debounce as _ } from "lodash-es";
import { clone as q } from "ramda";
var W = Object.defineProperty, U = (a, t, r) => t in a ? W(a, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : a[t] = r, g = (a, t, r) => (U(a, typeof t != "symbol" ? t + "" : t, r), r);
class Y {
  constructor() {
    g(this, "component", "IBizProjectAttributes");
  }
}
class J extends A {
  constructor() {
    super(...arguments), g(this, "jsonSchemaParams", {}), g(this, "calcFormDetail", (t) => {
      let r = "span";
      t.type === "string" ? r = "TEXTBOX" : t.type === "number" ? r = "NUMBER" : t.type === "picker" ? r = "MDROPDOWNLIST" : t.type === "date" && (r = "DATEPICKER");
      const n = {
        allowEmpty: !0,
        appDEFieldId: t.key,
        appId: ibiz.env.appId,
        capLanguageRes: { lanResTag: "DEF.LNAME.ID", appId: ibiz.env.appId },
        caption: t.description,
        codeName: t.key,
        dataType: 25,
        detailStyle: "DEFAULT",
        detailType: "FORMITEM",
        editor: {
          style: {},
          appId: ibiz.env.appId,
          editable: !0,
          editorType: r,
          halign: "LEFT",
          id: t.key,
          valign: "MIDDLE",
          valueType: "SIMPLE",
          wrapMode: "NOWRAP"
        },
        enableCond: 3,
        id: t.key,
        labelPos: "LEFT",
        labelWidth: 130,
        layoutPos: { colMD: 24, layout: "TABLE_24COL", appId: ibiz.env.appId },
        noPrivDisplayMode: 1,
        showCaption: !0
      };
      return t.type === "picker" && (Object.assign(n.editor, {
        appCodeListId: t.codelistId,
        valueItemName: t.key
      }), t.codelistId && Object.assign(n.editor, {
        appCodeListId: t.codelistId
      })), n;
    }), g(this, "addAttributes", v([])), g(this, "addAttributesFormDetail", []);
  }
  /**
   * 初始化方法
   *
   * @author lxm
   * @date 2022-08-22 22:08:16
   * @protected
   * @returns {*}  {Promise<void>}
   */
  async onCreated() {
    const t = JSON.parse(
      this.controlParams.jsonschemaparams || "{}"
    );
    this.jsonSchemaParams = F(
      t,
      this.params,
      this.context
    ), await this.initByEntitySchema(), this.model.deformPages && this.model.deformPages[0] && this.addAttributesFormDetail.forEach((r) => {
      var n;
      (n = this.model.deformPages[0].deformDetails) == null || n.push(r);
    }), await super.onCreated(), this.service = new B(this.model), await this.service.init(this.context), this.autoSave = _(this.autoSave.bind(this), 500, {
      trailing: !0
    });
  }
  async onMounted() {
    await super.onMounted(), !this.state.isSimple && this.state.loadDefault && this.load();
  }
  async calcColumnModelBySchema(t, r) {
    var n;
    if (!t.properties)
      return;
    const { properties: s } = t;
    if (!(Object.keys(s).length > 0))
      return;
    const c = {};
    (n = (await ibiz.hub.getAppDataEntity(
      r.model.appDataEntityId,
      r.model.appId
    )).appDEFields) == null || n.forEach((u) => {
      c[u.codeName.toLowerCase()] = u.id;
    });
    const p = [];
    return Object.keys(s).forEach((u) => {
      if (!c[u]) {
        let m;
        switch (s[u].type) {
          case "string":
            m = "string", s[u].format === "date-time" && (m = "date");
            break;
          case "integer":
            m = "integer";
            break;
          case "number":
            m = "number";
            break;
          default:
            ibiz.log.error(
              ibiz.i18n.t("runtime.controller.control.grid.unsupported", {
                type: s[u].type
              })
            );
            return;
        }
        p.push({
          key: u,
          description: s[u].description || s[u].key,
          type: m,
          ref: x({ isFocus: !0 }),
          codelistId: s[u].enumSource ? s[u].enumSource : ""
        });
      }
    }), p;
  }
  /**
   * 根据jsonschema初始化自定义表格列
   * @author lxm
   * @date 2024-01-02 04:41:23
   * @return {*}  {Promise<void>}
   */
  async initByEntitySchema() {
    const t = q(this.jsonSchemaParams);
    Object.assign(t, this.params);
    const r = await L(
      this.model.appDataEntityId,
      this.context,
      t
    );
    if (!r)
      return;
    const n = await this.calcColumnModelBySchema(r, this);
    n.length && (this.addAttributes.value = n, this.addAttributes.value.forEach((s) => {
      this.addAttributesFormDetail.push(this.calcFormDetail(s));
    }));
  }
}
const K = /* @__PURE__ */ k({
  name: "AutoInput",
  props: {
    controller: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: Object,
      required: !0
    },
    item: {
      type: Object,
      required: !0
    },
    emit: {
      // eslint-disable-next-line @typescript-eslint/ban-types
      type: Object,
      required: !0
    }
  },
  setup(a) {
    const t = w("project-attributes-input"), r = a.controller, n = v(""), s = v(!1), c = v();
    D(() => r.state.data, (i) => {
      if (i)
        for (const l in i)
          r.addAttributes.find((d) => d.key === l) && (n.value = i[l]);
    }, {
      immediate: !0
    });
    const p = v(), u = (i) => {
      i.stopPropagation(), s.value = !0, H(() => {
        c.value && c.value.focus();
      });
    }, m = (i) => {
      i.stopPropagation(), s.value = !1;
    }, b = () => o("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false"
    }, [o("g", {
      id: "aizaction/edit",
      "stroke-width": "1",
      "fill-rule": "evenodd"
    }, [o("path", {
      d: "M2 8.34L10.71 0 15 4.17 6.538 13H2V8.34zm1.2.512V11.8h2.826l7.283-7.6-2.606-2.533L3.2 8.852zM0 16v-1.2h16V16H0z",
      id: "aiz编辑"
    }, null)])]), f = (i) => {
      n.value = i.target.value;
      const l = r.formItems.find((d) => d.name === a.item.key);
      l && (i.target.value ? l.setDataValue(i.target.value, a.item.key) : l.setDataValue(null, a.item.key));
    };
    let e;
    return S(() => {
      p.value && (e = I(p, async (i) => {
        p.value && (s.value = !1);
      }));
    }), N(() => {
      e && e.stop && e.stop();
    }), {
      ns: t,
      c: r,
      startEdit: u,
      stopEdit: m,
      text: n,
      isEditing: s,
      change: f,
      componentRef: p,
      editSvg: b,
      inputRef: c
    };
  },
  render() {
    return o("div", {
      ref: "componentRef",
      class: [this.ns.b(), this.isEditing ? "edit" : ""]
    }, [this.isEditing ? o("input", {
      ref: "inputRef",
      type: "text",
      value: this.text,
      autofocus: !0,
      tabindex: "0",
      onChange: this.change,
      onBlur: (a) => this.stopEdit(a)
    }, null) : o("div", {
      class: this.ns.e("text"),
      onClick: (a) => this.startEdit(a)
    }, [this.text]), o("div", {
      class: this.ns.e("item-edit-svg"),
      onClick: (a) => this.startEdit(a)
    }, [this.editSvg()])]);
  }
}), E = /* @__PURE__ */ k({
  name: "IBizProjectAttributes",
  component: [K],
  props: {
    modelData: {
      type: Object,
      required: !0
    },
    context: {
      type: Object,
      required: !0
    },
    params: {
      type: Object,
      default: () => ({})
    },
    provider: {
      type: Object
    },
    isSimple: {
      type: Boolean,
      required: !1
    },
    data: {
      type: Object,
      required: !1
    },
    loadDefault: {
      type: Boolean,
      default: !0
    }
  },
  setup(a, {
    emit: t
  }) {
    const r = w("project-attributes"), n = [], s = M((...e) => new J(...e), {
      excludePropsKeys: ["data"]
    }), c = T(() => s.context.srfreadonly === !0 || s.context.srfreadonly === "true");
    a.isSimple && (s.evt.on("onMounted", () => {
      s.setSimpleData(a.data || {});
    }), D(() => a.data, (e) => {
      const i = e || {};
      Object.keys(s.data).find((l) => i[l] !== s.data[l]) && s.setSimpleData(i);
    }, {
      deep: !0
    })), s.evt.on("onCreated", () => {
      Object.keys(s.details).forEach((e) => {
        const i = s.details[e];
        i.state = x(i.state);
      });
    });
    const p = (e, i, l) => {
      const d = l || i;
      s.setDataValue(d, e);
    }, u = (e) => s.formItems.find((i) => i.name === e.key), m = (e, i) => {
      let l = null;
      const d = {};
      if (e.type === "string" ? d.autofocus = !0 : e.type === "number" && (d.controlsPosition = "right", d.controls = !0), !i)
        return;
      const C = {
        value: i.value,
        data: i.data,
        controller: i.editor,
        disabled: i.state.disabled,
        readonly: e.ref.isFocus,
        onChange: (h, P) => p(h, e.key, P),
        controlParams: i.form.controlParams,
        onFocus: (h) => {
          i.onFocus(h);
        },
        onBlur: (h) => {
          i.onBlur(h);
        },
        onEnter: (h) => i.onEnter(h),
        ...d
      };
      let y = "";
      e.type === "string" ? y = "IBizInput" : e.type === "number" ? y = "IBizInputNumber" : e.type === "picker" ? y = "IBizDropdown" : e.type === "date" && (y = "IBizDatePicker");
      const O = R(y);
      return l = V(O, {
        ...C
      }), l;
    }, b = () => o("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false"
    }, [o("g", {
      id: "aizaction/edit",
      "stroke-width": "1",
      "fill-rule": "evenodd"
    }, [o("path", {
      d: "M2 8.34L10.71 0 15 4.17 6.538 13H2V8.34zm1.2.512V11.8h2.826l7.283-7.6-2.606-2.533L3.2 8.852zM0 16v-1.2h16V16H0z",
      id: "aiz编辑"
    }, null)])]), f = v();
    return S(() => {
      I(f, async (e) => {
        if (e && e.target) {
          if (c.value || e.target.tagName.toLowerCase() === "input" || e.target.tagName.toLowerCase() === "svg" || e.target.className === "ibiz-dropdown-select-option-content" || e.target.className === "el-date-table-cell__text")
            return;
          let {
            id: i
          } = e.target.parentElement, l = s.addAttributes.value.find((d) => d.key === i);
          e.target.className === "ibiz-project-attributes__item-edit" && (i = e.target.id, l = s.addAttributes.value.find((d) => d.key === i)), l ? (s.addAttributes.value.forEach((d) => {
            d.ref.isFocus = !0;
          }), l.ref.isFocus = !1) : f.value.contains(e.target) || s.addAttributes.value.forEach((d) => {
            d.ref.isFocus = !0;
          });
        }
      });
    }), {
      c: s,
      ns: r,
      readonly: c,
      formItems: n,
      emit: t,
      renderEditor: m,
      editSvg: b,
      pxx: f,
      findController: u,
      startsWithHttpProtocol: (e) => /^(http:\/\/|https:\/\/)/.test(e),
      linkSvg: () => o("svg", {
        class: "icon",
        viewBox: "0 0 1024 1024",
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg",
        "p-id": "4033",
        height: "1em",
        width: "1em"
      }, [o("path", {
        d: "M832 128H640v64h146.752L521.376 457.376l45.248 45.248L832 237.248V384h64V128z",
        fill: "#181818",
        "p-id": "4034"
      }, null), o("path", {
        d: "M768 832H192V256h352v-64H160a32 32 0 0 0-32 32v640a32 32 0 0 0 32 32h640a32 32 0 0 0 32-32V480h-64v352z",
        fill: "#181818",
        "p-id": "4035"
      }, null)]),
      linkOpen: (e) => {
        window.open(e);
      }
    };
  },
  render() {
    return o("div", {
      class: this.ns.b()
    }, [this.c.addAttributes.value.length > 0 && this.c.addAttributes.value.map((a) => {
      const t = this.findController(a);
      let r = !1;
      return t && t.value && a.type === "string" && (r = this.startsWithHttpProtocol(t.value)), o("div", {
        class: [this.ns.e("item"), r ? "link" : ""]
      }, [o("div", {
        class: this.ns.e("item-text")
      }, [a.description]), o("div", {
        class: [this.ns.e("item-edit"), a.ref.isFocus ? "" : "edit"],
        id: a.key
      }, [this.renderEditor(a, t), !this.readonly && o("div", {
        class: this.ns.e("item-edit-svg")
      }, [this.editSvg()])]), r && a.ref.isFocus ? o("div", {
        class: this.ns.e("item-link-svg"),
        onClick: () => this.linkOpen(t.value),
        title: "打开链接"
      }, [this.linkSvg()]) : null]);
    }), o("div", {
      ref: "pxx"
    }, null)]);
  }
}), X = z(
  E,
  // eslint-disable-next-line func-names
  function(a) {
    a.component(E.name, E), j(
      "EDITFORM_RENDER_PROJECT_ATTRIBUTES",
      () => new Y()
    );
  }
), et = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(a) {
    a.use(X);
  }
};
export {
  X as IBizProjectAttributes,
  et as default
};
