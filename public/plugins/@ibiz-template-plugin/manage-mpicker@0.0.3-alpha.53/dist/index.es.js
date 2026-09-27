import './assets/style.css';
import './assets/style.css';
import { registerEditorProvider as _, EditorController as W, ButtonContainerState as X, ControllerEvent as H, getDeACMode as q, UIActionButtonState as Q, OpenAppViewCommand as V, UIActionUtil as Y } from "@ibiz-template/runtime";
import { getDataPickerProps as Z, getEditorEmits as $, useNamespace as ee, withInstall as te } from "@ibiz-template/vue3-util";
import { RuntimeModelError as P } from "@ibiz-template/core";
import { clone as D, mergeDeepLeft as ae } from "ramda";
import { defineComponent as ie, ref as N, watch as S, computed as se, onMounted as oe, createVNode as u, resolveComponent as f, createTextVNode as F } from "vue";
var ne = Object.defineProperty, le = (l, i, o) => i in l ? ne(l, i, { enumerable: !0, configurable: !0, writable: !0, value: o }) : l[i] = o, d = (l, i, o) => (le(l, typeof i != "symbol" ? i + "" : i, o), o);
class re extends W {
  constructor() {
    super(...arguments), d(this, "multiple", !1), d(this, "pickupView", null), d(this, "linkView", null), d(this, "valueItem", ""), d(this, "keyName", "srfkey"), d(this, "textName", "srfmajortext"), d(this, "interfaceName", ""), d(this, "sort", ""), d(this, "noAC", !1), d(this, "noButton", !1), d(this, "deACMode"), d(this, "dataItems", []), d(this, "objectIdField", ""), d(this, "objectNameField", ""), d(this, "objectValueField", ""), d(this, "itemLayoutPanel"), d(this, "groupActionState", new X()), d(this, "evt", new H(
      this.getEventArgs.bind(this)
    ));
  }
  getEventArgs() {
    return {
      context: this.context,
      params: this.params,
      data: [],
      eventArg: "",
      targetName: this.model.name,
      view: this.getView()
    };
  }
  async onInit() {
    var i, o, e, m;
    if (super.onInit(), this.initParams(), this.valueItem = ((i = this.model.valueItemName) == null ? void 0 : i.toLowerCase()) || "", this.model.appDataEntityId && (this.model.appDEDataSetId && (this.interfaceName = this.model.appDEDataSetId), this.model.appDEACModeId && (this.deACMode = await q(
      this.model.appDEACModeId,
      this.model.appDataEntityId,
      this.context.srfappid
    ), this.deACMode))) {
      const { minorSortAppDEFieldId: r, minorSortDir: y } = this.deACMode;
      r && y && (this.sort = "".concat(r.toLowerCase(), ",").concat(y.toLowerCase())), this.deACMode.textAppDEFieldId && (this.textName = this.deACMode.textAppDEFieldId), this.deACMode.valueAppDEFieldId && (this.keyName = this.deACMode.valueAppDEFieldId), this.deACMode.deacmodeDataItems && (this.dataItems = [], this.deACMode.deacmodeDataItems.forEach(
        (v) => {
          v.id !== "value" && v.id !== "text" && this.dataItems.push(v);
        }
      )), this.deACMode.itemLayoutPanel && (this.itemLayoutPanel = this.deACMode.itemLayoutPanel);
    }
    const c = [
      "PICKEREX_DROPDOWNVIEW",
      "PICKEREX_DROPDOWNVIEW_LINK",
      "PICKUPVIEW"
    ];
    if (this.model.editorType && c.includes(this.model.editorType) && this.initPickupViewParams(), this.objectIdField = (o = this.model.objectIdField) == null ? void 0 : o.toLowerCase(), this.objectNameField = (e = this.model.objectNameField) == null ? void 0 : e.toLowerCase(), this.objectValueField = (m = this.model.objectValueField) == null ? void 0 : m.toLowerCase(), this.model.uiactionGroup) {
      const r = this.model.uiactionGroup.uiactionGroupDetails || [];
      r.length > 0 && (r.forEach((y) => {
        const v = y.uiactionId;
        if (v) {
          const I = new Q(
            y.id,
            this.context.srfappid,
            v
          );
          this.groupActionState.addState(y.id, I);
        }
      }), await this.groupActionState.init());
    }
    const p = this.getView();
    p && p.evt.on("onDataChange", (r) => {
      r.eventName === "onLoadSuccess" && this.context.srfshowchoose && this.toggleMenu(!0);
    });
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
   * @memberof PickerEditorController
   */
  async getServiceData(i, o) {
    const { context: e, params: m } = this.handlePublicParams(o, this.context, {
      ...this.params
    }), c = {};
    this.sort && !Object.is(this.sort, "") && Object.assign(c, { sort: this.sort }), i && Object.assign(c, { query: i }), Object.assign(c, { size: 1e3 });
    const p = ae(m, c);
    if (this.interfaceName)
      return await ibiz.hub.getApp(this.context.srfappid).deService.exec(
        this.model.appDataEntityId,
        this.interfaceName,
        e,
        p
      );
    throw new P(this.model, "请配置实体和实体数据集");
  }
  /**
   * 打开数据选择视图
   *
   * @param {IData} data 数据对象
   * @param {IData[]} selectedData 选中项集合
   * @returns {*}  {(Promise<IData[] | undefined>)}
   * @memberof PickerEditorController
   */
  async openPickUpView(i, o) {
    await this.initPickupViewParams();
    const { context: e, params: m } = this.handlePublicParams(i, this.context, {
      ...this.params
    });
    if (o && (m.selectedData = o), !this.pickupView)
      throw new P(this.model, "请配置数据选择视图");
    const c = await ibiz.commands.execute(
      V.TAG,
      this.pickupView.id,
      e,
      m,
      { openMode: "POPUPMODAL" }
    );
    if (c && c.ok && c.data)
      return c.data;
    ibiz.log.debug("模态取消或关闭异常", c);
  }
  /**
   * 打开数据链接视图
   */
  async openLinkView(i) {
    const o = this.context.clone();
    i[this.valueItem] && (o.srfkey = i[this.valueItem]);
    const { context: e, params: m } = this.handlePublicParams(i, o, {
      ...this.params
    }), { linkAppViewId: c } = this.model;
    if (!c)
      throw new P(this.model, "请配置数据链接视图");
    return ibiz.commands.execute(
      V.TAG,
      c,
      e,
      m
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
  async calcFillDataItems(i) {
    return this.deACMode ? this.dataItems.length === 0 ? [] : await Promise.all(
      this.dataItems.map((o) => {
        const e = i[o.appDEFieldId];
        return o.format || o.convertToCodeItemText && o.codeListId || o.customCode, { id: o.id, value: e };
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
  handleObjectParams(i) {
    const o = {};
    return this.objectIdField && Object.assign(o, {
      [this.objectIdField]: i[this.keyName]
    }), this.objectNameField && Object.assign(o, {
      [this.objectNameField]: i[this.textName]
    }), this.objectValueField && Object.assign(o, {
      [this.objectValueField]: D(i)
    }), o;
  }
  /**
   * 分组行为项点击
   *
   * @param {IUIActionGroupDetail} detail
   * @param {MouseEvent} event
   * @return {*}  {Promise<void>}
   * @memberof RoutePickerController
   */
  async onActionClick(i, o) {
    const e = i.uiactionId;
    await Y.execAndResolved(
      e,
      {
        context: this.context,
        params: this.params,
        data: [],
        view: this.getView(),
        event: o
      },
      i.appId
    );
  }
  /**
   * 获取当前视图
   *
   * @return {*}
   * @memberof ManageMPickerController
   */
  getView() {
    if (this.parent.view)
      return this.parent.view;
    if (this.parent.panel.view)
      return this.parent.panel.view;
  }
  /**
   * 收缩菜单
   *
   * @param {boolean} visible
   * @memberof ManageMPickerController
   */
  toggleMenu(i) {
    this.evt.emit("toggleMenu", { visible: i });
  }
}
class de {
  constructor() {
    d(this, "formEditor"), d(this, "gridEditor"), this.formEditor = "ManageMPicker", this.gridEditor = "ManageMPicker";
  }
  async createController(i, o) {
    const e = new re(i, o);
    return await e.init(), e;
  }
}
const x = /* @__PURE__ */ ie({
  name: "ManageMPicker",
  props: Z(),
  emits: $(),
  setup(l, {
    emit: i
  }) {
    const o = ee("mpicker"), e = l.controller, m = e.model, c = N([]), p = N([]), r = N([]), y = N(!1), v = N(), I = N(!1), k = N(!1);
    let b = null;
    const A = N("最近浏览"), j = N("更多");
    m.editorParams && (m.editorParams.toplabel && (A.value = m.editorParams.toplabel), m.editorParams.lastlabel && (j.value = m.editorParams.lastlabel));
    const w = (a) => {
      if (c.value = [], r.value = [], a) {
        if (e.model.valueType === "OBJECTS")
          a.forEach((t) => {
            const s = D(t);
            Object.assign(s, {
              [e.keyName]: t[e.objectIdField],
              [e.textName]: t[e.objectNameField]
            }), e.objectValueField && (Object.assign(s, {
              ...t[e.objectValueField]
            }), delete s[e.objectValueField]), s[e.keyName] && r.value.push(s);
          });
        else if (e.objectIdField && e.model.valueSeparator)
          a.split(e.model.valueSeparator).forEach((t) => {
            r.value.push({
              [e.keyName]: t
            });
          });
        else
          try {
            r.value = JSON.parse(a);
          } catch (t) {
            ibiz.log.error("SIMPLE类型地址栏值格式".concat(a, "不符合JSON字符串要求"));
          }
        r.value.forEach((t) => {
          c.value.push(t[e.keyName]), p.value.findIndex((s) => Object.is(s[e.keyName], t[e.keyName])) < 0 && p.value.push({
            [e.keyName]: t[e.keyName],
            [e.textName]: t[e.textName]
          });
        });
      }
    };
    S(() => l.value, (a) => {
      w(a);
    }, {
      immediate: !0,
      deep: !0
    });
    const M = (a) => {
      const t = [];
      a && Array.isArray(a) && a.forEach((n) => {
        Object.assign(n, {
          [e.keyName]: n[e.keyName] ? n[e.keyName] : n.srfkey,
          [e.textName]: n[e.textName] ? n[e.textName] : n.srfmajortext
        }), e.model.valueType === "OBJECTS" ? t.push(e.handleObjectParams(n)) : e.objectIdField ? t.push(n[e.keyName]) : t.push({
          [e.keyName]: n[e.keyName],
          [e.textName]: n[e.textName]
        }), p.value.findIndex((h) => Object.is(h[e.keyName], n[e.keyName])) < 0 && p.value.push(n);
      });
      let s = null;
      t.length > 0 && (e.model.valueType === "OBJECTS" ? s = t : s = e.objectIdField ? t.join(e.model.valueSeparator) : JSON.stringify(t)), b = s, w(b);
    }, T = async () => {
      let a;
      if (v.value.blur(), r.value.length) {
        const s = JSON.parse(JSON.stringify(r.value));
        s.forEach((n, h) => {
          s[h].srfkey = n[e.keyName], s[h].srfmajortext = n[e.textName];
        }), a = JSON.stringify(s);
      }
      I.value = !0;
      const t = await e.openPickUpView(l.data, a);
      t && M(t), I.value = !1;
    }, L = (a) => {
      const t = [];
      let s = null;
      a.length > 0 && (a.forEach((n) => {
        if (n !== "more" && n !== "recent") {
          let h = p.value.findIndex((E) => Object.is(E[e.keyName], n)), g = {};
          h >= 0 ? g = p.value[h] : (h = r.value.findIndex((E) => Object.is(E[e.keyName], n)), h >= 0 && (g = r.value[h])), e.model.valueType === "OBJECTS" ? t.push(e.handleObjectParams(g)) : e.objectIdField ? t.push(g[e.keyName]) : t.push({
            [e.keyName]: g[e.keyName],
            [e.textName]: g[e.textName]
          });
        }
      }), t.length > 0 && (e.model.valueType === "OBJECTS" ? s = t : s = e.objectIdField ? t.join(e.model.valueSeparator) : JSON.stringify(t)), b = s, w(b));
    }, B = (a) => {
      const t = r.value.findIndex((s) => Object.is(s[e.keyName], a));
      if (t >= 0) {
        r.value.splice(t, 1);
        const s = [];
        let n = null;
        r.value.forEach((h) => {
          e.model.valueType === "OBJECTS" ? s.push(e.handleObjectParams(h)) : e.objectIdField ? s.push(h[e.keyName]) : s.push({
            [e.keyName]: h[e.keyName],
            [e.textName]: h[e.textName]
          });
        }), s.length > 0 && (e.model.valueType === "OBJECTS" ? n = s : n = e.objectIdField ? s.join(e.model.valueSeparator) : JSON.stringify(s)), b = n, w(b);
      }
    }, C = async (a) => {
      if (e.model.appDataEntityId) {
        k.value = !0;
        try {
          const t = a.trim(), s = await e.getServiceData(t, l.data);
          k.value = !1, s && (p.value = s.data);
        } catch (t) {
          k.value = !1;
        }
      }
    }, J = (a) => {
      y.value = a, y.value && (p.value = [], C(""));
    }, R = () => {
      e.model.valueType === "OBJECTS" ? b = [] : b = "", i("change", b);
    }, U = () => {
      i("change", b);
    }, O = se(() => r.value.map((a) => a[e.textName]).join(","));
    S(O, (a, t) => {
      a !== t && i("infoTextChange", a);
    }, {
      immediate: !0
    });
    const K = (a) => {
      i("focus", a);
    }, z = (a) => {
      i("blur", a);
    }, G = (a) => {
      a && a.code === "Enter" && i("enter", a);
    };
    return oe(() => {
      e.objectNameField && C(""), e.evt.on("toggleMenu", () => {
        v.value && v.value.selectOption();
      });
    }), {
      ns: o,
      c: e,
      selectRef: v,
      curValue: c,
      loading: k,
      items: p,
      valueText: O,
      isOpenView: I,
      topLabel: A,
      lastLabel: j,
      onSearch: C,
      onOpenChange: J,
      onSelect: L,
      onRemove: B,
      openPickUpView: T,
      onFocus: K,
      onBlur: z,
      handleKeyUp: G,
      handleCancel: R,
      onConfirm: U,
      renderGroupAction: () => {
        const {
          uiactionGroup: a
        } = e.model;
        if (a)
          return u("div", {
            class: o.e("group-action")
          }, [u(f("iBizActionToolbar"), {
            class: o.be("group", "header-actions"),
            actionDetails: a.uiactionGroupDetails,
            "actions-state": e.groupActionState,
            onActionClick: (t, s) => {
              e.onActionClick(t, s);
            }
          }, null)]);
      },
      renderPanelItemLayout: (a, t) => {
        const {
          context: s,
          params: n
        } = e;
        return u(f("iBizControlShell"), {
          data: a,
          modelData: t,
          context: s,
          params: n
        }, null);
      }
    };
  },
  render() {
    return this.readonly ? u("div", {
      class: (this.ns.b(), this.ns.m("readonly"))
    }, [this.valueText]) : u("div", {
      class: [this.ns.b(), this.disabled ? this.ns.m("disabled") : "", this.ns.is("work-item", !0)],
      ref: "editorRef"
    }, [u(f("el-select"), {
      ref: "selectRef",
      modelValue: this.curValue,
      "onUpdate:modelValue": (l) => this.curValue = l,
      filterable: !0,
      remote: !0,
      multiple: !0,
      loading: this.loading,
      "popper-class": [this.ns.be("work-item", "popper"), this.ns.is("hidden", this.isOpenView)],
      placeholder: this.c.placeHolder ? this.c.placeHolder : " ",
      "remote-method": this.onSearch,
      onVisibleChange: this.onOpenChange,
      onChange: this.onSelect,
      onRemoveTag: this.onRemove,
      disabled: this.disabled,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onKeyup: this.handleKeyUp
    }, {
      default: () => [u(f("el-option"), {
        value: "recent",
        label: "recent",
        class: this.ns.e("recent")
      }, {
        default: () => [this.topLabel]
      }), this.items.map((l) => u(f("el-option"), {
        key: l[this.c.keyName],
        value: l[this.c.keyName],
        label: l[this.c.textName]
      }, {
        default: () => [this.c.itemLayoutPanel && this.renderPanelItemLayout(l, this.c.itemLayoutPanel)]
      })), this.c.model.pickupAppViewId && u(f("el-option"), {
        value: "more",
        label: "more",
        class: this.ns.e("more")
      }, {
        default: () => [u(f("el-button"), {
          text: !0,
          onClick: this.openPickUpView
        }, {
          default: () => [u(f("ion-icon"), {
            name: "list-outline"
          }, null), this.lastLabel]
        })]
      })]
    }), u("div", {
      class: this.ns.e("actions")
    }, [this.renderGroupAction()]), u("div", {
      class: this.ns.e("bottom")
    }, [u(f("el-button"), {
      text: !0,
      onClick: this.handleCancel
    }, {
      default: () => [F("取消")]
    }), u(f("el-button"), {
      onClick: this.onConfirm
    }, {
      default: () => [F("确认")]
    })])]);
  }
}), ce = te(x, function(l) {
  l.component(x.name, x), _("PICKER_MANAGE", () => new de());
}), be = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(l) {
    l.use(ce);
  }
};
export {
  ce as IBizManageMPicker,
  be as default
};
