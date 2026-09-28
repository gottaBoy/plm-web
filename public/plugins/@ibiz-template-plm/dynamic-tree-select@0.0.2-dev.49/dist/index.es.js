import './assets/style.css';
import { getDataPickerProps as V, getEditorEmits as R, useNamespace as B, renderString as K, withInstall as U } from "@ibiz-template/vue3-util";
import { registerEditorProvider as _, EditorController as z, getDeACMode as H, ScriptFactory as J } from "@ibiz-template/runtime";
import { defineComponent as X, ref as u, computed as N, watch as C, onBeforeMount as q, createVNode as I, resolveComponent as Y } from "vue";
import { isNil as F, clone as j, mergeDeepLeft as G } from "ramda";
import { RuntimeModelError as Q } from "@ibiz-template/core";
import { cloneDeep as W } from "lodash-es";
var Z = Object.defineProperty, $ = (i, t, s) => t in i ? Z(i, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : i[t] = s, l = (i, t, s) => ($(i, typeof t != "symbol" ? t + "" : t, s), s);
const E = /* @__PURE__ */ X({
  name: "DynamicTreeSelect",
  props: V(),
  emits: R(),
  setup(i, {
    emit: t
  }) {
    const s = B("picker-dropdown"), e = i.controller, c = u(""), r = u([]), n = u(!1), h = u(""), m = u(!1), p = u(), w = N(() => !!(i.controlParams && i.controlParams.editmode === "hover"));
    C(() => i.value, (a) => {
      if (a || a === null) {
        e.model.valueType === "OBJECT" ? c.value = a ? a[e.objectNameField] : null : c.value = a, a === null && (c.value = ""), h.value = c.value;
        const o = i.data[e.valueItem];
        if (e.copyData.findIndex((d) => Object.is(d[e.keyName], o)) !== -1)
          return;
        r.value = [], !F(a) && !F(o) && r.value.push({
          [e.textName]: a,
          [e.keyName]: o
        });
      }
    }, {
      immediate: !0
    }), C(() => i.data[e.valueItem], (a, o) => {
      a !== o && (h.value = a, a === null && t("change", null));
    }, {
      immediate: !0,
      deep: !0
    });
    const f = (a) => {
      a ? m.value = a : setTimeout(() => {
        m.value = a;
      }, 100);
    }, v = u(!1), O = async (a) => {
      const o = await e.calcFillDataItems(a);
      o.length && o.forEach((g) => {
        t("change", g.value, g.id);
      });
      const d = j(a);
      Object.assign(d, {
        [e.keyName]: d[e.keyName] ? d[e.keyName] : d.srfkey,
        [e.textName]: d[e.textName] ? d[e.textName] : d.srfmajortext
      }), e.valueItem && t("change", d[e.keyName], e.valueItem), e.model.valueType === "OBJECT" ? t("change", e.handleObjectParams(d)) : t("change", a[e.textName]), f(!1);
    }, T = (a) => {
      const o = e.copyData.findIndex((d) => Object.is(d[e.keyName], a));
      o >= 0 && O(e.copyData[o]), n.value = !1;
    };
    let b = null;
    const y = async (a) => {
      if (n.value)
        if (e.model.appDataEntityId && v.value === !1) {
          v.value = !0;
          try {
            let o = "";
            a !== i.value && (o = a.trim());
            const d = await e.getServiceData(o, i.data);
            d && (r.value = d.data);
          } finally {
            if (v.value = !1, b != null) {
              const o = b;
              b = null, await y(o);
            }
          }
        } else
          b = a;
    }, A = (a) => {
      a && (n.value = !0, r.value = [], y(""));
    }, x = () => {
      const {
        dataItems: a
      } = e;
      a != null && a.length && a.forEach((o) => {
        t("change", null, o.id);
      }), e.valueItem && t("change", null, e.valueItem), t("change", null);
    }, M = (a) => {
      n.value = !0, t("focus", a), f(!0);
    }, P = (a) => {
      n.value = !1, t("blur", a), f(!1);
    }, k = (a) => {
      a && a.code === "Enter" && t("enter", a);
    }, S = () => {
      n.value = !0;
    }, D = N(() => K(c.value));
    C(D, (a, o) => {
      a !== o && t("infoTextChange", a);
    }, {
      immediate: !0
    });
    const L = (a, o) => {
      var d;
      return (d = a.children) != null && d.length ? s.e("branch-node") : null;
    };
    return q(() => {
      i.data && e.valueItem && i.data[e.valueItem] && !i.value && (n.value = !0, r.value = [], y(""));
    }), {
      ns: s,
      c: e,
      refValue: h,
      curValue: c,
      valueText: D,
      loading: v,
      items: r,
      onOpenChange: A,
      onClear: x,
      onSelect: T,
      onSearch: y,
      onFocus: M,
      onBlur: P,
      onClick: S,
      handleKeyUp: k,
      editorRef: p,
      isEditable: m,
      setEditable: f,
      showFormDefaultContent: w,
      customNodeClass: L
    };
  },
  render() {
    const i = this.readonly ? this.value : I(Y("el-tree-select"), {
      ref: "editorRef",
      modelValue: this.curValue,
      "onUpdate:modelValue": (e) => this.curValue = e,
      clearable: !0,
      class: [this.ns.b("select")],
      popperClass: this.ns.b("select-pop"),
      filterable: !0,
      teleported: !this.showFormDefaultContent,
      data: this.items,
      "check-strictly": !0,
      multiple: this.c.multiple,
      placeholder: this.c.placeHolder ? this.c.placeHolder : " ",
      disabled: this.disabled,
      onBlur: this.onBlur,
      onVisibleChange: this.onOpenChange,
      onFocus: this.onFocus,
      onKeyup: this.handleKeyUp,
      onChange: this.onSelect,
      props: {
        class: this.customNodeClass
      }
    }, null), t = I("div", {
      class: (this.ns.b(), this.ns.m("readonly"))
    }, [this.valueText]), s = I("div", {
      class: this.ns.b("form-default-content")
    }, [this.curValue ? this.valueText : "-"]);
    return I("div", {
      class: [this.ns.b(), this.disabled ? this.ns.m("disabled") : "", this.readonly ? this.ns.m("readonly") : "", this.ns.is("editable", this.isEditable), this.ns.is("show-default", this.showFormDefaultContent)]
    }, [this.showFormDefaultContent && s, this.readonly ? t : i]);
  }
});
class ee extends z {
  constructor() {
    super(...arguments), l(this, "multiple", !1), l(this, "pickupView", null), l(this, "linkView", null), l(this, "valueItem", ""), l(this, "keyName", "srfkey"), l(this, "textName", "srfmajortext"), l(this, "interfaceName", ""), l(this, "sort", ""), l(this, "noAC", !1), l(this, "noButton", !1), l(this, "deACMode"), l(this, "dataItems", []), l(this, "objectIdField", ""), l(this, "objectNameField", ""), l(this, "objectValueField", ""), l(this, "filterMap", {
      label: "name",
      value: "id"
    }), l(this, "copyData", []), l(this, "url", ""), l(this, "method", "post"), l(this, "pvalue", "pid");
  }
  async onInit() {
    var t, s, e, c;
    if (super.onInit(), this.initParams(), this.valueItem = ((t = this.model.valueItemName) == null ? void 0 : t.toLowerCase()) || "", this.model.appDataEntityId && (this.model.appDEDataSetId && (this.interfaceName = this.model.appDEDataSetId), this.model.appDEACModeId && (this.deACMode = await H(
      this.model.appDEACModeId,
      this.model.appDataEntityId,
      this.context.srfappid
    ), this.deACMode))) {
      const { minorSortAppDEFieldId: r, minorSortDir: n } = this.deACMode;
      r && n && (this.sort = "".concat(r.toLowerCase(), ",").concat(n.toLowerCase())), this.deACMode.textAppDEFieldId && (this.textName = this.deACMode.textAppDEFieldId), this.deACMode.valueAppDEFieldId && (this.keyName = this.deACMode.valueAppDEFieldId), this.deACMode.deacmodeDataItems && (this.dataItems = [], this.deACMode.deacmodeDataItems.forEach(
        (h) => {
          h.id !== "value" && h.id !== "text" && this.dataItems.push(h);
        }
      ));
    }
    if (this.objectIdField = (s = this.model.objectIdField) == null ? void 0 : s.toLowerCase(), this.objectNameField = (e = this.model.objectNameField) == null ? void 0 : e.toLowerCase(), this.objectValueField = (c = this.model.objectValueField) == null ? void 0 : c.toLowerCase(), this.pvalue = this.editorParams.PVALUE, this.url = this.editorParams.URL, this.method = this.editorParams.METHOD || "post", this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, "FILTERMAP"))
      try {
        const r = JSON.parse(this.editorParams.FILTERMAP);
        Object.assign(this.filterMap, r);
      } catch (r) {
        this.filterMap = {
          label: "name",
          value: "id"
        };
      }
  }
  /**
   * 初始化noAc和noButton
   */
  initParams() {
    switch (this.model.editorType) {
      case "PICKEREX_NOAC":
      case "PICKEREX_NOAC_LINK":
        this.noAC = !0;
        break;
      case "PICKEREX_NOBUTTON":
        this.noButton = !0;
        break;
      default:
        this.noButton = !1, this.noAC = !1;
    }
  }
  /**
   * 加载实体数据集数据
   *
   * @param {string} query 模糊匹配字符串
   * @param {IData} data 表单数据
   * @returns {*}  {Promise<IHttpResponse<IData[]>>}
   * @memberof PickerEditorController
   */
  async getServiceData(t, s) {
    const { context: e, params: c } = this.handlePublicParams(
      s,
      this.context,
      this.params
    ), r = {};
    this.sort && !Object.is(this.sort, "") && Object.assign(r, { sort: this.sort }), t && Object.assign(r, { query: t }), Object.assign(r, { size: 1e3 });
    const n = G(c, r), h = {};
    Object.assign(h, { method: this.method, data: n });
    const m = J.execScriptFn(
      { data: s, context: e, params: c },
      this.url,
      {
        singleRowReturn: !0,
        isAsync: !1
      }
    );
    if (m) {
      const p = await ibiz.net.request(m, h);
      return p.data = this.handleTreeData(p), p;
    }
    throw new Q(this.model, "请配置实体和实体数据集");
  }
  /**
   * 计算回填数据
   *
   * @author lxm
   * @date 2022-10-24 16:10:24
   * @param {IData} data 选中数据
   * @returns {*}  {Promise<Array<{ id: string; value: any }>>}
   */
  async calcFillDataItems(t) {
    return this.deACMode ? this.dataItems.length === 0 ? [] : await Promise.all(
      this.dataItems.map((s) => {
        const e = t[s.appDEFieldId];
        return s.format || s.convertToCodeItemText && s.codeListId || s.customCode, { id: s.id, value: e };
      })
    ) : [];
  }
  /**
   * 处理对象数据类型抛值
   * @param {IData} select
   * @return {*}
   * @author: zhujiamin
   * @Date: 2023-08-22 15:58:56
   */
  handleObjectParams(t) {
    const s = {};
    return this.objectIdField && Object.assign(s, {
      [this.objectIdField]: t[this.keyName]
    }), this.objectNameField && Object.assign(s, {
      [this.objectNameField]: t[this.textName]
    }), this.objectValueField && Object.assign(s, {
      [this.objectValueField]: j(t)
    }), s;
  }
  /**
   * 处理请求回来的数据
   * @param items 数据源
   */
  handleTreeData(t) {
    return t.data ? (t.data.forEach((s) => {
      Object.keys(this.filterMap).forEach((e) => {
        s[e] = s[this.filterMap[e]];
      });
    }), this.copyData = W(t.data), this.pvalue ? this.prepareTreeData(t.data) : t.data) : [];
  }
  /**
   * 组装树形数据
   * @param items
   * @returns
   */
  prepareTreeData(t) {
    const s = this.filterMap.value, e = this.pvalue, c = {}, r = [];
    return t.forEach((n) => {
      c[n[s]] = n;
    }), t.forEach((n) => {
      const h = c[n[e]];
      h ? (h.children = h.children || [], h.children.push(c[n[s]])) : r.push(c[n[s]]);
    }), r;
  }
}
class te {
  constructor() {
    l(this, "component", "DynamicTreeSelect"), l(this, "formEditor", "DynamicTreeSelect"), l(this, "gridEditor", "DynamicTreeSelect");
  }
  async createController(t, s) {
    const e = new ee(t, s);
    return await e.init(), e;
  }
}
const ae = U(
  E,
  function(i) {
    i.component(E.name, E), _(
      "EDITOR_CUSTOMSTYLE_MODEL_SELECT",
      () => new te()
    );
  }
), de = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(i) {
    i.use(ae);
  }
};
export {
  ae as IBizDynamicTreeSelect,
  de as default
};
