import './style.css';
var J = Object.defineProperty;
var H = (c, n, s) => n in c ? J(c, n, { enumerable: !0, configurable: !0, writable: !0, value: s }) : c[n] = s;
var d = (c, n, s) => (H(c, typeof n != "symbol" ? n + "" : n, s), s);
import { EditorController as Q, ButtonContainerState as Y, getDeACMode as q, getAcItemProvider as Z, UIActionButtonState as ee, OpenAppViewCommand as F, UIActionUtil as te, registerEditorProvider as ie } from "@ibiz-template/runtime";
import { RuntimeModelError as D, showTitle as S } from "@ibiz-template/core";
import { mergeDeepLeft as se, isNil as E, isEmpty as oe } from "ramda";
import { defineComponent as ae, ref as I, computed as T, watch as A, onMounted as ne, createVNode as h, resolveComponent as f, mergeProps as ce, h as le } from "vue";
import { getDataPickerProps as re, getEditorEmits as de, useNamespace as he, renderString as ue } from "@ibiz-template/vue3-util";
class me extends Q {
  constructor() {
    super(...arguments);
    /**
     * 是否多选
     */
    d(this, "multiple", !1);
    /**
     *选择视图相关参数
     */
    d(this, "pickupView", null);
    /**
     *链接视图相关参数
     */
    d(this, "linkView", null);
    /**
     *值项
     */
    d(this, "valueItem", "");
    /**
     * 主键属性名称
     */
    d(this, "keyName", "srfkey");
    /**
     * 主文本属性名称
     */
    d(this, "textName", "srfmajortext");
    /**
     * 数据集codeName
     */
    d(this, "interfaceName", "");
    /**
     * 自填模式sort排序
     */
    d(this, "sort", "");
    /**
     * 不支持AC（根据编辑器类型得）
     */
    d(this, "noAC", !1);
    /**
     * 不支持按钮（根据编辑器类型得）
     */
    d(this, "noButton", !1);
    /**
     * 实体自填模式模型
     */
    d(this, "deACMode");
    /**
     * 自填数据项集合（已排除了value和text)
     */
    d(this, "dataItems", []);
    // 对象标识属性
    d(this, "objectIdField", "");
    // 对象名称属性
    d(this, "objectNameField", "");
    // 对象值属性
    d(this, "objectValueField", "");
    /**
     * 自填列表项适配器
     *
     * @author zhanghengfeng
     * @date 2024-05-21 17:05:50
     * @type {IAcItemProvider}
     */
    d(this, "acItemProvider");
    /**
     * 分组行为状态
     */
    d(this, "groupActionState", new Y());
    /**
     * @description 自填模式行为行为组
     * @type {IAppDEUIActionGroupDetail[]}
     * @memberof BomPickerEditorController
     */
    d(this, "actionDetails", []);
  }
  async onInit() {
    var t, a, r, i;
    if (super.onInit(), this.initParams(), this.valueItem = ((t = this.model.valueItemName) == null ? void 0 : t.toLowerCase()) || "", this.model.appDataEntityId && (this.model.appDEDataSetId && (this.interfaceName = this.model.appDEDataSetId), this.model.appDEACModeId && (this.deACMode = await q(
      this.model.appDEACModeId,
      this.model.appDataEntityId,
      this.context.srfappid
    ), this.deACMode))) {
      const { minorSortAppDEFieldId: l, minorSortDir: u } = this.deACMode;
      l && u && (this.sort = "".concat(l.toLowerCase(), ",").concat(u.toLowerCase())), this.deACMode.textAppDEFieldId && (this.textName = this.deACMode.textAppDEFieldId), this.deACMode.valueAppDEFieldId && (this.keyName = this.deACMode.valueAppDEFieldId), this.deACMode.deacmodeDataItems && (this.dataItems = [], this.deACMode.deacmodeDataItems.forEach(
        (m) => {
          m.id !== "value" && m.id !== "text" && this.dataItems.push(m);
        }
      )), this.deACMode.itemSysPFPluginId && (this.acItemProvider = await Z(this.deACMode));
    }
    const s = [
      "PICKEREX_DROPDOWNVIEW",
      "PICKEREX_DROPDOWNVIEW_LINK",
      "PICKUPVIEW",
      "MOBPICKER_DROPDOWNVIEW"
    ];
    this.model.editorType && s.includes(this.model.editorType) && this.initPickupViewParams(), this.objectIdField = (a = this.model.objectIdField) == null ? void 0 : a.toLowerCase(), this.objectNameField = (r = this.model.objectNameField) == null ? void 0 : r.toLowerCase(), this.objectValueField = (i = this.model.objectValueField) == null ? void 0 : i.toLowerCase(), this.model.uiactionGroup && (this.actionDetails = this.model.uiactionGroup.uiactionGroupDetails || [], this.actionDetails.length > 0 && (this.actionDetails.forEach((l) => {
      const u = l.uiactionId;
      if (u) {
        const m = new ee(
          l.id,
          this.context.srfappid,
          u
        );
        this.groupActionState.addState(l.id, m);
      }
    }), await this.groupActionState.init(), this.actionDetails.forEach((l) => {
      l.capLanguageRes && l.capLanguageRes.lanResTag && (l.caption = ibiz.i18n.t(
        l.capLanguageRes.lanResTag,
        l.caption
      )), l.tooltipLanguageRes && l.tooltipLanguageRes.lanResTag && (l.tooltip = ibiz.i18n.t(
        l.tooltipLanguageRes.lanResTag,
        l.tooltip
      ));
    })));
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
   * 初始化选择视图相关参数
   */
  async initPickupViewParams() {
    this.model.pickupAppViewId && (this.pickupView = await ibiz.hub.config.view.get(
      this.model.pickupAppViewId
    ));
  }
  /**
   * 初始化链接视图相关参数
   */
  async initLinkViewParams() {
    this.model.linkAppViewId && (this.linkView = await ibiz.hub.config.view.get(this.model.linkAppViewId));
  }
  /**
   * 加载实体数据集数据
   *
   * @param {string} query 模糊匹配字符串
   * @param {IData} data 表单数据
   * @returns {*}  {Promise<IHttpResponse<IData[]>>}
   * @memberof BomPickerEditorController
   */
  async getServiceData(s, t) {
    const { context: a, params: r } = this.handlePublicParams(
      t,
      this.context,
      this.params
    ), i = {};
    ibiz.config.pickerdefaultsort && Object.assign(i, { sort: ibiz.config.pickerdefaultsort }), this.sort && !Object.is(this.sort, "") && Object.assign(i, { sort: this.sort }), s && Object.assign(i, { query: s }), Object.assign(i, { size: 1e3 });
    const l = se(r, i);
    if (this.interfaceName)
      return await ibiz.hub.getApp(this.context.srfappid).deService.exec(
        this.model.appDataEntityId,
        this.interfaceName,
        a,
        l
      );
    throw new D(
      this.model,
      ibiz.i18n.t("editor.common.entityConfigErr")
    );
  }
  /**
   * 打开数据选择视图
   *
   * @param {IData} data 数据对象
   * @param {IData[]} selectedData 选中项集合
   * @returns {*}  {(Promise<IData[] | undefined>)}
   * @memberof BomPickerEditorController
   */
  async openPickUpView(s, t) {
    await this.initPickupViewParams();
    const { context: a, params: r } = this.handlePublicParams(
      s,
      this.context,
      this.params
    );
    if (t && (r.selecteddata = t), !this.pickupView)
      throw new D(
        this.model,
        ibiz.i18n.t("editor.common.selectViewConfigErr")
      );
    const i = await ibiz.commands.execute(
      F.TAG,
      this.pickupView.id,
      a,
      r,
      { openMode: "POPUPMODAL" }
    );
    if (i && i.ok && i.data)
      return i.data;
    ibiz.log.debug("模态取消或关闭异常", i);
  }
  /**
   * 打开数据链接视图
   */
  async openLinkView(s) {
    const t = this.context.clone();
    s[this.valueItem] && (t.srfkey = s[this.valueItem]);
    const { context: a, params: r } = this.handlePublicParams(
      s,
      t,
      this.params
    ), { linkAppViewId: i } = this.model;
    if (!i)
      throw new D(
        this.model,
        ibiz.i18n.t("editor.common.linkViewConfigErr")
      );
    return ibiz.commands.execute(
      F.TAG,
      i,
      a,
      r
    );
  }
  /**
   * 计算回填数据
   *
   * @author lxm
   * @date 2022-10-24 16:10:24
   * @param {IData} data 选中数据
   * @returns {*}  {Promise<Array<{ id: string; value: any }>>}
   */
  async calcFillDataItems(s) {
    return this.deACMode ? this.dataItems.length === 0 ? [] : await Promise.all(
      this.dataItems.map((a) => {
        const r = s[a.appDEFieldId];
        return a.format || a.convertToCodeItemText && a.codeListId || a.customCode, { id: a.id, value: r };
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
  handleObjectParams(s) {
    const t = {};
    if (this.objectIdField && Object.assign(t, {
      [this.objectIdField]: s[this.keyName]
    }), this.objectNameField && Object.assign(t, {
      [this.objectNameField]: s[this.textName]
    }), this.objectValueField) {
      const a = {
        ...s
      };
      delete a.srfkey, delete a.srfmajortext, Object.assign(t, {
        [this.objectValueField]: a
      });
    }
    return s.srfnodeid && Object.assign(t, {
      srfnodeid: s.srfnodeid
    }), t;
  }
  /**
   * @description 分组行为项点击
   * @param {IUIActionGroupDetail} detail
   * @param {MouseEvent} event
   * @return {*}  {Promise<void>}
   * @memberof BomPickerEditorController
   */
  async onActionClick(s, t, a) {
    const r = s.uiactionId;
    await te.execAndResolved(
      r,
      {
        context: this.context,
        params: this.params,
        data: [t],
        view: this.view,
        event: a
      },
      s.appId
    );
  }
}
class pe {
  constructor() {
    d(this, "formEditor");
    d(this, "gridEditor");
    const n = "IBizBomPicker";
    this.formEditor = n, this.gridEditor = n;
  }
  async createController(n, s) {
    const t = new me(n, s);
    return await t.init(), t;
  }
}
const M = /* @__PURE__ */ ae({
  name: "IBizBomPicker",
  props: re(),
  emits: de(),
  setup(c, {
    emit: n
  }) {
    var j;
    const s = he("bom-picker"), t = c.controller, a = I(""), r = I([]), i = I(!0), l = I(!1), u = I(), m = I(!1), v = I(!1), C = ((j = t.model.editorParams) == null ? void 0 : j.actionpostion) || "top", w = {
      _type: "title",
      caption: "创建 BOM (mBOM)"
    }, k = {
      _type: "title",
      caption: "选择现有 mBOM"
    };
    if (t.model.editorParams) {
      const {
        editorParams: e
      } = t.model;
      e.actiontitle && (w.caption = e.actiontitle), e.listtitle && (k.caption = e.listtitle);
    }
    const B = T(() => !!(c.controlParams && c.controlParams.editmode === "hover" && !c.readonly)), N = () => {
      const {
        value: e
      } = c;
      t.model.valueType === "OBJECT" ? a.value = e && t.objectNameField ? e[t.objectNameField] : "" : a.value = e || "";
      const o = c.data[t.valueItem];
      r.value.findIndex((g) => Object.is(g[t.keyName], o)) === -1 && (r.value = [], e && !oe(o) && r.value.push({
        [t.textName]: e,
        [t.keyName]: o
      }));
    };
    A(() => c.value, () => {
      N();
    }, {
      immediate: !0
    });
    const b = (e) => {
      e ? l.value = e : setTimeout(() => {
        l.value = e;
      }, 100);
    }, x = async (e) => {
      const o = await t.calcFillDataItems(e);
      o.length && o.forEach((p) => {
        n("change", p.value, p.id);
      }), Object.assign(e, {
        [t.keyName]: e[t.keyName] ? e[t.keyName] : e.srfkey,
        [t.textName]: e[t.textName] ? e[t.textName] : e.srfmajortext
      }), t.valueItem && n("change", e[t.keyName], t.valueItem), t.model.valueType === "OBJECT" ? n("change", t.handleObjectParams(e)) : n("change", e[t.textName]), b(!1);
    }, R = async (e, o) => {
      t.groupActionState[e.id].disabled || t.onActionClick(e, c.data, o);
    }, L = () => {
      const e = [];
      if (a.value) {
        const o = {
          srfkey: c.data[t.valueItem],
          srfmajortext: a.value,
          ...t.model.valueType === "OBJECT" && c.value && t.objectValueField ? c.value[t.objectValueField] : {}
        };
        t.deACMode && t.dataItems.length && t.dataItems.forEach((p) => Object.assign(o, {
          [p.appDEFieldId]: c.data[p.id]
        })), e.push(o);
      }
      return e;
    }, z = async (e) => {
      e.stopPropagation();
      const o = await t.openPickUpView(c.data, JSON.stringify(L()));
      o && o[0] && await x(o[0]);
    }, U = async (e) => {
      e.stopPropagation();
      const o = await t.openLinkView(c.data);
      o && o.ok && o.data && o.data.length > 0 && await x(o.data[0]);
    }, V = async (e, o) => {
      if (t.model.appDataEntityId) {
        const p = "", g = await t.getServiceData(p, c.data);
        if (g && (r.value = g.data, m.value = !0, o && o instanceof Function)) {
          const y = r.value.length ? [...r.value] : [{
            srftype: "empty"
          }], P = [...t.actionDetails];
          y.length > 0 && y.unshift(k), P.length > 0 && P.unshift(w), C === "top" ? y.unshift(...P) : y.push(...P), o(y);
        }
      }
    }, _ = async (e) => {
      var o;
      if (i.value = !0, b(!1), (o = u.value) == null || o.blur(), e._type !== "title") {
        if (e.srftype === "empty" || e.detailType === "DEUIACTION")
          return N();
        await x(e);
      }
    }, K = () => {
      const e = t.dataItems;
      e != null && e.length && e.forEach((o) => {
        n("change", null, o.id);
      }), t.valueItem && n("change", null, t.valueItem), n("change", null);
    }, W = (t.linkView ? 1 : 0) + (t.pickupView ? 1 : 0);
    A(u, (e) => {
      c.autoFocus && e && e.focus && e.focus();
    });
    const G = (e) => {
      v.value = !0, t.noAC || (u.value.loading = !0), n("focus", e), b(!0);
    }, X = (e) => {
      v.value = !1, N(), n("blur", e), b(!1);
    }, $ = (e) => {
      e && e.code === "Enter" && n("enter", e);
    }, O = T(() => ue(a.value));
    return A(O, (e, o) => {
      e !== o && n("infoTextChange", e);
    }, {
      immediate: !0
    }), ne(() => {
      A(() => c.data[t.valueItem], async (e, o) => {
        if (e !== o) {
          !m.value && E(c.value) && !E(e) && await V();
          const p = r.value.find((g) => Object.is(g[t.keyName], e));
          p && (a.value = p[t.textName], E(c.value) && !E(e) && n("change", a.value, t.model.id, !0)), e === null && n("change", null, t.model.id, !0);
        }
      }, {
        immediate: !0
      });
    }), {
      ns: s,
      c: t,
      items: r,
      curValue: a,
      valueText: O,
      editorRef: u,
      closeCircle: W,
      isEditable: l,
      isReverse: v,
      showFormDefaultContent: B,
      onBlur: X,
      onFocus: G,
      onClear: K,
      onSearch: V,
      onACSelect: _,
      handleKeyUp: $,
      setEditable: b,
      renderEmpty: () => h(f("iBizNoData"), {
        class: s.e("empty"),
        onClick: (e) => e.stopPropagation()
      }, null),
      openLinkView: U,
      openPickUpView: z,
      renderPrompt: (e) => h("div", {
        class: s.e("title"),
        title: e.caption
      }, [e.caption]),
      renderActionItem: (e) => {
        if (t.groupActionState[e.id].visible)
          return h("div", {
            title: S(e.tooltip),
            class: [s.e("action-item"), s.is("disabled", t.groupActionState[e.id].disabled)],
            onClick: (o) => {
              R(e, o);
            }
          }, [e.showIcon && e.sysImage && h(f("iBizIcon"), {
            class: s.em("action-item", "icon"),
            icon: e.sysImage
          }, null), h("span", {
            class: s.em("action-item", "caption")
          }, [e.showCaption ? e.caption : ""])]);
      }
    };
  },
  render() {
    const n = (this.c.editorParams.overflowMode || this.c.editorParams.overflowmode || ibiz.config.pickerEditor.overflowMode) === "ellipsis", s = (i) => {
      var w;
      const l = (w = this.c.deACMode) == null ? void 0 : w.itemLayoutPanel, {
        context: u,
        params: m
      } = this.c;
      let v = i[this.c.textName] || i.srfmajortext === this.curValue;
      this.c.valueItem && (v = (i[this.c.keyName] || i.srfkey) === this.data[this.c.valueItem]);
      const C = [this.ns.is("active", v), this.ns.e("transfer-item")];
      if (this.c.acItemProvider) {
        const k = f(this.c.acItemProvider.component);
        return le(k, {
          item: i,
          controller: this.c,
          class: C,
          onClick: () => {
            this.onACSelect(i);
          }
        });
      }
      return l ? h(f("iBizControlShell"), {
        data: i,
        class: C,
        modelData: l,
        context: u,
        params: m,
        onClick: () => {
          this.onACSelect(i);
        }
      }, null) : h("div", {
        class: [this.ns.is("ellipsis", n), ...C],
        title: S(n ? i[this.c.textName] : ""),
        onClick: () => {
          this.onACSelect(i);
        }
      }, [i[this.c.textName]]);
    }, t = h("div", {
      class: [this.ns.e("autocomplete"), this.ns.m(this.closeCircle.toString())]
    }, [h(f("el-autocomplete"), ce({
      ref: "editorRef",
      class: [this.ns.b("input")],
      modelValue: this.curValue,
      "onUpdate:modelValue": (i) => this.curValue = i,
      "value-key": this.c.textName,
      placeholder: this.c.placeHolder,
      clearable: !0,
      "popper-class": [this.ns.e("transfer"), this.ns.is("empty", !this.items.length)],
      "fetch-suggestions": this.onSearch,
      onClear: this.onClear,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      onKeyup: this.handleKeyUp,
      onSelect: this.onACSelect,
      disabled: this.disabled,
      "fit-input-width": n
    }, this.$attrs), {
      default: ({
        item: i
      }) => this.$slots.append ? this.$slots.append({}) : i.srftype === "empty" ? this.renderEmpty() : i._type === "title" ? this.renderPrompt(i) : i.detailType === "DEUIACTION" ? this.renderActionItem(i) : h("div", {
        class: [this.ns.e("item"), this.ns.is("select", this.data[this.c.valueItem] === i[this.c.keyName])]
      }, [s(i)]),
      suffix: () => {
        if (!this.c.noButton)
          return [this.c.model.pickupAppViewId ? h(f("ion-icon"), {
            onClick: this.openPickUpView,
            name: "search"
          }, null) : null, this.c.model.linkAppViewId && this.curValue ? h(f("ion-icon"), {
            onClick: this.openLinkView,
            name: "link-arrow"
          }, null) : null, this.c.model.showTrigger && !this.c.model.pickupAppViewId ? h(f("ion-icon"), {
            name: "chevron-down-outline",
            class: [this.ns.e("suffix"), this.ns.is("reverse", this.isReverse)]
          }, null) : null];
      }
    })]), a = h("div", {
      class: (this.ns.b(), this.ns.m("readonly"))
    }, [this.valueText]), r = h("div", {
      class: this.ns.b("form-default-content")
    }, [this.curValue ? this.valueText : h(f("iBizEditorEmptyText"), {
      showPlaceholder: this.c.emptyShowPlaceholder,
      placeHolder: this.c.placeHolder
    }, null)]);
    return h("div", {
      class: [this.ns.b(), this.disabled ? this.ns.m("disabled") : "", this.ns.is("editable", this.isEditable), this.ns.is("show-default", this.showFormDefaultContent)]
    }, [this.showFormDefaultContent && r, this.readonly ? a : t]);
  }
}), Pe = {
  install(c) {
    c.component(M.name, M), ie(
      "EDITOR_CUSTOMSTYLE_BOM_PICKER",
      () => new pe()
    );
  }
};
export {
  Pe as default
};
