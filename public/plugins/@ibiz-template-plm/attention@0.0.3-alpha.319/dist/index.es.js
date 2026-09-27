import './assets/style.css';
import './assets/style.css';
import { getDataPickerProps as ct, getEditorEmits as pt, useNamespace as se, renderString as ht, withInstall as mt } from "@ibiz-template/vue3-util";
import { registerEditorProvider as vt, EditorController as ft, getDeACMode as gt, UIActionUtil as bt, OpenAppViewCommand as Fe } from "@ibiz-template/runtime";
import { RuntimeModelError as te } from "@ibiz-template/core";
import { clone as ie, mergeDeepLeft as wt } from "ramda";
import { notNilEmpty as q } from "qx-util";
import { defineComponent as ne, ref as f, computed as N, watch as R, onMounted as Ee, onBeforeUnmount as yt, createVNode as r, onUnmounted as Mt, resolveComponent as x, withDirectives as Ft, resolveDirective as Et, createTextVNode as B, nextTick as It, mergeProps as At, isVNode as Ct } from "vue";
import { isArray as Ot } from "lodash-es";
var xt = Object.defineProperty, Pt = (u, s, o) => s in u ? xt(u, s, { enumerable: !0, configurable: !0, writable: !0, value: o }) : u[s] = o, p = (u, s, o) => (Pt(u, typeof s != "symbol" ? s + "" : s, o), o);
class Ie extends ft {
  constructor() {
    super(...arguments), p(this, "operatorMap", /* @__PURE__ */ new Map()), p(this, "currentOperator"), p(this, "total", 0), p(this, "currentNumber", -1), p(this, "page", 0), p(this, "deptpage", 0), p(this, "deptcurrentNumber", -1), p(this, "depttotal", 0), p(this, "size", 20), p(this, "multiple", !0), p(this, "separator", ","), p(this, "pickupView", null), p(this, "linkView", null), p(this, "userFilterMap", {
      id: "id",
      name: "name",
      title: "title",
      avatar: ""
    }), p(this, "deptFilterMap", {
      id: "id",
      name: "name",
      title: "title",
      avatar: ""
    }), p(this, "valueItem", ""), p(this, "keyName", "srfkey"), p(this, "textName", "srfmajortext"), p(this, "interfaceName", ""), p(this, "sort", ""), p(this, "noAC", !1), p(this, "noButton", !1), p(this, "deACMode"), p(this, "dataItems", []), p(this, "objectIdField", ""), p(this, "objectNameField", ""), p(this, "objectValueField", ""), p(this, "userUrl", ""), p(this, "deptUrl", ""), p(this, "copyUserUrl", ""), p(this, "copyDeptUrl", ""), p(this, "userMethod", "post"), p(this, "deptMethod", "post"), p(this, "contextReg", /\$\{context.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g), p(this, "dataReg", /\$\{data.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g), p(this, "paramsReg", /\$\{params.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g), p(this, "valueType", "OBJECTS"), p(this, "codeListId", ""), p(this, "codeListMap"), p(this, "attentionTypeField", "type"), p(this, "selfFillMap", {
      user_id: "user_id",
      user_name: "name",
      user_title: "title"
    }), p(this, "defaultSelected", ""), p(this, "defaultAttentionValue", ""), p(this, "enableBottomButton", !1), p(this, "fieldMap", ""), p(this, "userAuthEntity", ""), p(this, "deptAuthEntity", "");
  }
  async onInit() {
    var s, o, i, e, d, m, g;
    if (super.onInit(), this.initParams(), await this.getOperatorUserList(), this.valueItem = ((s = this.model.valueItemName) == null ? void 0 : s.toLowerCase()) || "", this.model.appDataEntityId && (this.model.appDEDataSetId && (this.interfaceName = this.model.appDEDataSetId), this.model.appDEACModeId && (this.deACMode = await gt(
      this.model.appDEACModeId,
      this.model.appDataEntityId,
      this.context.srfappid
    ), this.deACMode))) {
      const { minorSortAppDEFieldId: y, minorSortDir: E } = this.deACMode;
      y && E && (this.sort = "".concat(y.toLowerCase(), ",").concat(E.toLowerCase())), this.deACMode.textAppDEFieldId && (this.textName = this.deACMode.textAppDEFieldId), this.deACMode.valueAppDEFieldId && (this.keyName = this.deACMode.valueAppDEFieldId), this.deACMode.deacmodeDataItems && (this.dataItems = [], this.deACMode.deacmodeDataItems.forEach(
        (M) => {
          M.id !== "value" && M.id !== "text" && this.dataItems.push(M);
        }
      ));
    }
    const w = [
      "PICKEREX_DROPDOWNVIEW",
      "PICKEREX_DROPDOWNVIEW_LINK",
      "PICKUPVIEW"
    ];
    this.model.editorType && w.includes(this.model.editorType) && this.initPickupViewParams(), this.objectIdField = (i = (o = this.model) == null ? void 0 : o.objectIdField) == null ? void 0 : i.toLowerCase(), this.objectNameField = (d = (e = this.model) == null ? void 0 : e.objectNameField) == null ? void 0 : d.toLowerCase(), this.objectValueField = (g = (m = this.model) == null ? void 0 : m.objectValueField) == null ? void 0 : g.toLowerCase();
  }
  /**
   * 初始化noAc和noButton
   */
  initParams() {
    var s, o, i, e, d, m, g, w, y, E, M, I;
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
    if (this.userUrl = this.editorParams.URL, this.deptUrl = this.editorParams.DEPTURL, this.userMethod = this.editorParams.USERMETHOD || "post", this.deptMethod = this.editorParams.DEPTMETHOD || "post", this.separator = this.editorParams.SEPARATOR || ",", (s = this.editorParams) != null && s.CODELISTID && (this.codeListId = (o = this.editorParams) == null ? void 0 : o.CODELISTID), (i = this.editorParams) != null && i.DEFAULTATNVALUE && (this.defaultAttentionValue = (e = this.editorParams) == null ? void 0 : e.DEFAULTATNVALUE), (d = this.editorParams) != null && d.VALUETYPE && (this.valueType = (m = this.editorParams) == null ? void 0 : m.VALUETYPE), (g = this.editorParams) != null && g.ENABLEBOTTOMBUTTON && (this.enableBottomButton = ((w = this.editorParams) == null ? void 0 : w.ENABLEBOTTOMBUTTON) === "true"), (y = this.editorParams) != null && y.FIELDMAP && (this.fieldMap = (E = this.editorParams) == null ? void 0 : E.FIELDMAP), this.editorParams.userauthentity && (this.userAuthEntity = this.editorParams.userauthentity), this.editorParams.deptauthentity && (this.deptAuthEntity = this.editorParams.deptauthentity), this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, "CODELISTMAP"))
      try {
        const c = JSON.parse((M = this.editorParams) == null ? void 0 : M.CODELISTMAP);
        Object.assign(this.codeListMap, c);
      } catch (c) {
        this.codeListMap = { FOLLOWED: [20, 30, 40], NOTFOLLOWING: [10] };
      }
    if (this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, "SELFFILLMAP"))
      try {
        const c = JSON.parse((I = this.editorParams) == null ? void 0 : I.SELFFILLMAP);
        Object.assign(this.selfFillMap, c);
      } catch (c) {
        this.selfFillMap = {
          user_id: "user_id",
          user_name: "name",
          user_title: "title"
        };
      }
    if (this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, "USERMAP"))
      try {
        const c = JSON.parse(this.editorParams.USERMAP);
        Object.assign(this.userFilterMap, c);
      } catch (c) {
        this.userFilterMap = {
          id: "id",
          name: "name",
          title: "title",
          avatar: ""
        };
      }
    if (this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, "DEPTMAP"))
      try {
        const c = JSON.parse(this.editorParams.DEPTMAP);
        Object.assign(this.deptFilterMap, c);
      } catch (c) {
        this.deptFilterMap = {
          id: "id",
          name: "name",
          title: "title",
          avatar: ""
        };
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
   * 初始化当前操作者数据
   */
  async initCurrentOperator(s, o) {
    const i = this.context.srfuserid;
    if (!i)
      return;
    const e = await this.getServiceData(
      "department",
      s,
      {},
      {
        ...o,
        page: 0,
        size: 20,
        n_id_eq: i
      }
    );
    e && e.data && e.data.length > 0 && (this.currentOperator = e.data.find(
      (d) => d[this.deptFilterMap.id] === i
    ));
  }
  /**
   * 重置状态
   */
  resetState() {
    this.total = 0, this.currentNumber = -1, this.page = 0, this.deptpage = 0, this.depttotal = 0, this.deptcurrentNumber = -1, this.copyDeptUrl = "", this.copyUserUrl = "";
  }
  /**
   * 加载更多
   */
  async loadMore(s, o, i = {}) {
    if (o === "user" && this.currentNumber < this.total) {
      const e = await this.getServiceData(o, s, i);
      if (e)
        return this.page += 1, this.currentNumber < 0 && (this.currentNumber += 1), this.currentNumber += this.size, this.total = e.total ? Number(e.total) : Number(e.headers["x-total"]), e.data.forEach((d) => {
          Object.keys(this.userFilterMap).forEach((m) => {
            d[m] = d[this.userFilterMap[m]];
          });
        }), e;
    } else if (o === "department" && this.deptcurrentNumber < this.depttotal) {
      const e = await this.getServiceData(o, s, i);
      if (e)
        return this.deptpage += 1, this.deptcurrentNumber < 0 && (this.deptcurrentNumber += 1), this.deptcurrentNumber += this.size, this.depttotal = e.total ? Number(e.total) : Number(e.headers["x-total"]), e.data.forEach((d) => {
          Object.keys(this.deptFilterMap).forEach((m) => {
            d[m] = d[this.deptFilterMap[m]];
          });
        }), e;
    }
  }
  /**
   * 触发界面行为组点击事件
   *
   * @param {IUIActionGroupDetail} detail
   * @param {GridRowState} row
   * @param {MouseEvent} event
   * @return {*}  {Promise<void>}
   * @memberof GridFieldColumnController
   */
  async onActionClick(s, o, i) {
    const e = s.uiactionId;
    await bt.execAndResolved(
      e,
      {
        context: this.context,
        params: this.params,
        data: o,
        view: this.parent.form.ctx.view,
        event: i
      },
      s.appId
    );
  }
  /**
   * 填充字符串中的数据
   *
   * @author chitanda
   * @date 2021-04-23 20:04:17
   * @static
   * @param {string} str
   * @param {*} [context]
   * @param {*} [data]
   * @return {*}  {string}
   */
  fill(s, o, i, e) {
    if (q(s)) {
      if (q(o)) {
        const d = s.match(this.contextReg);
        d == null || d.forEach((m) => {
          const g = m.slice(10, m.length - 1);
          s = s.replace("${context.".concat(g, "}"), o[g] || "");
        });
      }
      if (q(i)) {
        const d = s.match(this.paramsReg);
        d == null || d.forEach((m) => {
          const g = m.slice(9, m.length - 1);
          s = s.replace("${params.".concat(g, "}"), i[g] || "");
        });
      }
      if (q(e)) {
        const d = s.match(this.dataReg);
        d == null || d.forEach((m) => {
          const g = m.slice(7, m.length - 1);
          s = s.replace("${data.".concat(g, "}"), e[g] || "");
        });
      }
    }
    return s;
  }
  /**
   * 加载实体数据集数据
   *
   * @param {string} tag 当前分类 user || department
   * @param {IData} data 表单数据
   * @param {string} query 模糊匹配字符串
   * @returns {*}  {Promise<IHttpResponse<IData[]>>}
   * @memberof PersonelSelectController
   */
  async getServiceData(s, o, i, e) {
    const { context: d, params: m } = this.handlePublicParams(
      o,
      this.context,
      this.params
    ), g = {};
    this.sort && !Object.is(this.sort, "") && Object.assign(g, { sort: this.sort }), Object.assign(g, { size: this.size }), i && Object.assign(g, i);
    const w = e || wt(m, g);
    let y = "";
    const E = this.fill(this.userUrl, d, m, o).replaceAll(
      "//",
      "/"
    ), M = this.fill(this.deptUrl, d, m, o).replaceAll(
      "//",
      "/"
    );
    this.copyUserUrl = E, this.copyDeptUrl = M;
    let I = "post";
    const c = {};
    if (s === "user" ? (y = E, I = this.userMethod.toLowerCase(), Object.assign(c, { method: I, data: w })) : (y = M, I = this.deptMethod.toLowerCase(), Object.assign(c, { method: I, params: w })), y)
      return await ibiz.net.request(y, c);
    throw new te(this.model, "请配置数据接口地址");
  }
  /**
   * 打开数据选择视图
   *
   * @param {IData} data 数据对象
   * @param {IData[]} selectedData 选中项集合
   * @returns {*}  {(Promise<IData[] | undefined>)}
   * @memberof PersonelSelectController
   */
  async openPickUpView(s, o) {
    await this.initPickupViewParams();
    const { context: i, params: e } = this.handlePublicParams(
      s,
      this.context,
      this.params
    );
    if (o && (e.selectedData = o), !this.pickupView)
      throw new te(this.model, "请配置数据选择视图");
    const d = await ibiz.commands.execute(
      Fe.TAG,
      this.pickupView.id,
      i,
      e,
      { openMode: "POPUPMODAL" }
    );
    if (d && d.ok && d.data)
      return d.data;
    ibiz.log.debug("模态取消或关闭异常", d);
  }
  /**
   * 打开数据链接视图
   */
  async openLinkView(s) {
    const o = this.context.clone();
    s[this.valueItem] && (o.srfkey = s[this.valueItem]);
    const { context: i, params: e } = this.handlePublicParams(
      s,
      o,
      this.params
    ), { linkAppViewId: d } = this.model;
    if (!d)
      throw new te(this.model, "请配置数据链接视图");
    return ibiz.commands.execute(
      Fe.TAG,
      d,
      i,
      e
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
      this.dataItems.map((o) => {
        const i = s.map((e) => e[o.appDEFieldId]).join(this.separator);
        return o.format || o.convertToCodeItemText && o.codeListId || o.customCode, { id: o.id, value: i };
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
    const o = {};
    return this.objectIdField && Object.assign(o, {
      [this.objectIdField]: s[this.keyName]
    }), this.objectNameField && Object.assign(o, {
      [this.objectNameField]: s[this.textName]
    }), this.objectValueField && Object.assign(o, {
      [this.objectValueField]: ie(s)
    }), o;
  }
  /**
   * 获取操作用户列表
   *
   * @return {*}  {Promise<void>}
   * @memberof AttentionController
   */
  async getOperatorUserList() {
    const s = await ibiz.hub.getApp(this.context.srfappid);
    let o = [];
    o = await s.codeList.get(
      "SysOperator",
      this.context,
      this.params
    ), this.operatorMap = new Map(
      o.map((i) => [i.value, i])
    );
  }
  /**
   * 动态匹配${}
   *
   * @param {string} str
   * @param {Record<string, IData>} values
   * @return {*}  {string}
   */
  dynamicMatch(s, o) {
    return s.replace(/\${(.*?)}/g, (i, e) => {
      const [d, m] = e.split("."), g = o[d];
      return g && g[m] || "";
    });
  }
  /**
   * 获取人员头像路径
   *
   * @return {*}  {string}
   * @memberof AttentionController
   */
  getUserPictureUrl(s, o) {
    if (this.operatorMap.size <= 0)
      return "";
    let i = {};
    return this.operatorMap.get(s) ? i = this.operatorMap.get(s) : Array.from(this.operatorMap.entries()).find((e) => {
      const d = e[1] || {};
      return d.text && o && d.text === o ? (i = d, !0) : !1;
    }), i.data && i.data.iconurl ? i.data.iconurl : "";
  }
}
class Tt {
  constructor() {
    p(this, "component", "IBizAttention"), p(this, "formEditor", "IBizAttention"), p(this, "gridEditor", "IBizAttention");
  }
  async createController(s, o) {
    const i = new Ie(s, o);
    return await i.init(), i;
  }
}
const St = /* @__PURE__ */ ne({
  name: "VirtualList",
  props: {
    items: {
      //  数据源
      type: Array,
      default: () => []
    },
    itemHeight: {
      //  每行高度
      type: Number,
      default: 36
    },
    showNum: {
      //  可视数量
      type: Number,
      default: 20
    }
  },
  emits: ["scrollEvent"],
  setup(u, {
    emit: s
  }) {
    const o = se("virtual-list-box"), i = f(36), e = f(), d = f([]), m = f(0), g = f(0), w = f(0), y = f(0), E = (c, b) => {
      s("scrollEvent", c, b);
    }, M = () => {
      g.value = Math.floor(y.value / u.itemHeight), w.value = g.value + u.showNum, d.value = u.items.slice(g.value, w.value);
      const c = y.value - y.value % u.itemHeight;
      m.value = c;
    }, I = () => {
      y.value = e.value.scrollTop, M(), E(i.value, y.value);
    };
    return Ee(() => {
      setTimeout(() => {
        scroll();
      }, 1e3);
    }), R(() => u.items, () => {
      i.value = u.itemHeight * u.items.length, M();
    }, {
      immediate: !0,
      deep: !0
    }), {
      ns: o,
      contentHeight: i,
      showList: d,
      contentBox: e,
      top: m,
      onScroll: I
    };
  },
  render() {
    return r("div", {
      ref: "contentBox",
      class: this.ns.b(),
      onScroll: () => this.onScroll()
    }, [r("div", {
      class: this.ns.e("container"),
      style: "height:".concat(this.contentHeight, "px;")
    }, [r("div", {
      class: this.ns.e("content"),
      style: "top:".concat(this.top, "px;")
    }, [this.showList.map((u, s) => r("div", {
      key: s,
      class: this.ns.m("item")
    }, [this.$slots.default ? this.$slots.default({
      ...u,
      index: s
    }) : u.name]))])])]);
  }
}), Lt = /* @__PURE__ */ ne({
  name: "IBizFollow",
  props: {
    readonly: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    },
    value: {
      type: String
    },
    codeListId: {
      type: String
    },
    codeListMap: {
      type: Object
    },
    controller: {
      type: Ie,
      required: !0
    },
    defaultSelected: {
      type: String
    }
  },
  emits: {
    /** 值变更事件 */
    change: (u, s) => !0,
    /** 失焦事件 */
    blur: (u) => !0,
    /** 聚焦事件 */
    focus: (u) => !0,
    /** 回车事件 */
    enter: (u) => !0,
    /** 信息文本变更事件 */
    infoTextChange: (u) => !0
  },
  setup(u, {
    emit: s
  }) {
    const o = se("follow"), i = u.controller, e = f(), d = f(!1), m = f(!1), g = f(), w = f(!1), y = f(!1), E = f(null), M = f(!1), I = f([]), c = N(() => u.codeListMap || {}), b = N(() => ({})), z = async () => {
      if (w.value = !0, u.codeListId) {
        const v = await ibiz.hub.getApp(i.context.srfappid).codeList.get(u.codeListId, i.context, i.params);
        v && v.length > 0 && (I.value = v), d.value = !0;
      }
      w.value = !1;
    }, O = (v) => {
      var A, C;
      E.value = v, (C = (A = c.value) == null ? void 0 : A.FOLLOWED) != null && C.find((S) => String(S) === String(v)) ? y.value = !0 : y.value = !1;
    };
    R(
      () => u.value,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (v, A) => {
        var C;
        let S = v;
        !v && u.codeListMap && (S = ((C = c.value) == null ? void 0 : C.NOTFOLLOWING[0]) || ""), O(S);
      },
      {
        immediate: !0,
        deep: !0
      }
    );
    const U = (v) => {
      v ? m.value = v : setTimeout(() => {
        m.value = v;
      }, 100);
    }, T = N({
      get() {
        var v;
        return (v = u.value) == null ? void 0 : v.toString();
      },
      set(v) {
        s("change", v), U(!1);
      }
    }), _ = N(() => {
      const v = Array.isArray(T.value) ? T.value : [T.value], A = I.value, C = [];
      return v.forEach((S) => {
        A.forEach((W) => {
          W.value === S && C.push(W.text);
        });
      }), C.join(",");
    });
    R(_, (v, A) => {
      v !== A && s("infoTextChange", v);
    }, {
      immediate: !0
    });
    const j = (v) => I.value.find((A) => A.text === v), K = async (v) => {
      M.value = v, v && !d.value && await z();
    }, D = (v) => {
      E.value = v.value, O(v.value), s("change", v.value);
    }, H = (v) => {
      var A;
      (v.key === "Escape" || v.keyCode === 27) && (v.stopPropagation(), (A = e.value) == null || A.handleClose());
    };
    return Mt(() => {
    }), {
      ns: o,
      curValue: T,
      items: I,
      valueText: _,
      editorRef: g,
      cssVars: b,
      isEditable: m,
      isLoading: w,
      followState: y,
      selectd: E,
      showState: M,
      dropdownRef: e,
      setEditable: U,
      getCodeListItem: j,
      onShowChange: K,
      onItemClick: D,
      handleKeyDown: H
    };
  },
  render() {
    const u = r("div", {
      class: [this.ns.e("showcase"), this.showState ? "is-active" : ""]
    }, [r("span", {
      class: this.ns.em("showcase", "icon")
    }, [r("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      focusable: "false"
    }, [r("g", {
      id: "follow/with/interest",
      "stroke-width": "1",
      "fill-rule": "evenodd"
    }, [r("path", {
      d: "M8 3.4c2.823 0 5.04 1.367 7.38 3.637a2.037 2.037 0 0 1 0 2.925C13.04 12.232 10.824 13.6 8 13.6c-2.823 0-5.032-1.364-7.376-3.637a2.037 2.037 0 0 1 0-2.925C2.967 4.764 5.176 3.4 8 3.4zm0 1.2c-2.417 0-4.405 1.228-6.542 3.3a.837.837 0 0 0 0 1.2C3.596 11.173 5.584 12.4 8 12.4s4.413-1.231 6.546-3.3a.837.837 0 0 0 0-1.2C12.412 5.83 10.415 4.6 8 4.6zM8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0-1.2a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6z",
      id: "attention",
      fill: "currentColor"
    }, null)])])]), r("span", {
      class: this.ns.em("showcase", "text")
    }, [this.followState ? "已关注" : "未关注"])]), s = r(x("el-dropdown"), {
      "popper-class": this.ns.b("popover"),
      ref: (o) => {
        this.dropdownRef = o;
      },
      trigger: "click",
      placement: "top-start",
      onVisibleChange: this.onShowChange,
      onKeydown: (o) => {
        this.handleKeyDown(o);
      }
    }, {
      default: () => u,
      dropdown: () => r(x("el-dropdown-menu"), {
        class: this.ns.be("popper", "dropdown-menu")
      }, {
        default: () => this.items.map((o, i) => r(x("el-dropdown-item"), {
          onClick: () => this.onItemClick(o)
        }, {
          default: () => [r("div", {
            class: [this.ns.b("content"), String(this.selectd) === String(o.value) ? "is-active" : ""]
          }, [r("div", {
            class: this.ns.em("item", "text")
          }, [o.text]), r("div", {
            class: this.ns.em("item", "tooltip")
          }, [o.tooltip])]), i === this.items.length - 1 ? null : r("div", {
            class: this.ns.em("item", "divider")
          }, [r(x("el-divider"), null, null)])]
        }))
      })
    });
    return r("div", {
      class: [this.ns.b(), this.disabled ? this.ns.m("disabled") : "", this.readonly ? this.ns.m("readonly") : "", this.ns.is("editable", this.isEditable)],
      style: this.cssVars
    }, [this.readonly ? u : s]);
  }
});
class jt {
  /**
   * 计算选中项绘制个数 多选场景需计算显示人员是否超出
   * @author ljx
   * @date 2024-03-05 02:42:45
   * @param {IData} values 选中项key值集合
   * @returns {number} selRenderNum
   */
  static calcSelItemRenderNum(s, o) {
    let i = 0;
    if (o && (s == null ? void 0 : s.length) > 0) {
      const e = (o == null ? void 0 : o.offsetWidth) || 0, d = window.getComputedStyle(o), m = parseInt(d.marginLeft, 10), g = parseInt(d.marginRight, 10), w = parseInt(d.paddingLeft, 10), y = parseInt(d.paddingRight, 10), E = m + g + w + y, M = 70, I = 33, c = 28, b = 8, z = (c + b) * s.length;
      e - E - M - I - z < 0 && (i = Math.floor(
        (e - E - M - I) / (c + b)
      ), i -= 1);
    }
    return i;
  }
}
function ae(u) {
  return typeof u == "function" || Object.prototype.toString.call(u) === "[object Object]" && !Ct(u);
}
const le = /* @__PURE__ */ ne({
  name: "IBizAttention",
  props: ct(),
  emits: pt(),
  setup(u, {
    emit: s,
    attrs: o
  }) {
    const i = se("attention"), e = u.controller, d = f(""), m = f([]), g = f([]), w = f(""), y = f(!1), E = f(!1), M = f(""), I = f([]), c = f("user"), b = f([]), z = f([]), O = f(!1), U = f(!1), T = f(!1), _ = f(""), j = f(!1), K = f(), D = f(), H = f(""), v = f(), A = f([]);
    let C = 0;
    const S = f(295), W = N(() => u == null ? void 0 : u.readonly), Ae = () => {
      let t = 295;
      if (D.value) {
        const a = D.value.getBoundingClientRect(), l = 16, n = e.enableBottomButton ? 464 : 415, h = n - t, F = a.top < n + l, P = window.innerHeight - a.bottom < n + l;
        if (F && P) {
          const k = a.top - l - h;
          t = Math.max(50, Math.min(Math.floor(k), 295));
        }
      }
      S.value = t;
    }, Ce = N(() => !!(u.controlParams && u.controlParams.editmode === "hover")), L = N(() => ht(d.value)), $ = f({}), J = /* @__PURE__ */ new Set(), Oe = async (t, a = {}) => {
      if (!($.value[t] || J.has(t))) {
        J.add(t);
        try {
          const {
            downloadUrl: l
          } = ibiz.util.file.calcFileUpDownUrl(e.context, e.params, u.data, e.editorParams);
          let n = "";
          if (ibiz.config.common.enableDownloadTicket) {
            const h = c.value === "user" ? e.userAuthEntity : e.deptAuthEntity, F = c.value === "user" ? e.userFilterMap.id : e.deptFilterMap.id, P = await ibiz.util.file.getDownloadTicket(e.context, e.params, a, {
              fileId: t
            }, {
              appEntityTag: h,
              dataFieldTag: F
            });
            P != null && P.ticket && (n = l.replace("%fileId%", P.ticket));
          } else
            n = l.replace("%fileId%", t);
          n && ($.value[t] = n);
        } catch (l) {
          ibiz.log.error(l);
        } finally {
          J.delete(t);
        }
      }
    }, xe = (t) => /^https?:|^http?:|^data:image|(\.png$|\.svg|\.jpg|\.png|\.gif|\.psd|\.tif|\.bmp|\.jpeg)$/.test(t), Y = (t) => {
      t.preventDefault(), t.stopPropagation();
    }, G = () => {
      var t;
      const a = [], l = [];
      H.value = "", ((t = b.value) == null ? void 0 : t.length) > 0 && b.value.forEach((n) => {
        a.push(n[e.selfFillMap.user_id]), l.push(n[e.selfFillMap.user_name]), n[e.selfFillMap.user_id] === e.context.srfuserid && (H.value = n[e.attentionTypeField]);
      }), w.value = a == null ? void 0 : a.toString(), d.value = l == null ? void 0 : l.toString();
    }, Pe = (t) => {
      var a, l;
      return (l = (a = e.codeListMap) == null ? void 0 : a.FOLLOWED) == null ? void 0 : l.some((n) => String(n) === String(t));
    }, X = () => {
      const t = w.value.split(e.separator);
      C = jt.calcSelItemRenderNum(t, D.value), w.value = "", G();
    }, re = (t) => {
      if (t) {
        const a = Ot(t) ? t : [];
        b.value = [], a.forEach((l) => {
          const n = ie(l);
          e.selfFillMap.user_id && e.selfFillMap.user_name && Object.assign(n, {
            id: l[e.selfFillMap.user_id],
            name: l[e.selfFillMap.user_name],
            title: l[e.selfFillMap.user_title],
            [e.attentionTypeField]: l[e.attentionTypeField]
          }), e.objectValueField && (Object.assign(n, {
            ...l[e.objectValueField]
          }), delete n[e.objectValueField]), b.value.push(n);
        });
      } else
        b.value = [];
      z.value = ie(b.value);
    };
    R(() => u.value, (t) => {
      t ? e.valueType === "OBJECT" ? d.value = t ? t[e.objectNameField] : null : e.valueType === "OBJECTS" ? (re(t), G()) : d.value = t : (d.value = "", b.value = []), X();
    }, {
      immediate: !0
    });
    const Te = N(() => u.data && u.data[e.valueItem] || void 0);
    R(Te, (t, a) => {
      t !== a && (w.value = t, t === null && (b.value = [], s("change", null)));
    }, {
      immediate: !0,
      deep: !0
    });
    const oe = (t) => {
      t ? E.value = t : setTimeout(() => {
        E.value = t;
      }, 100);
    }, Se = (t) => {
      const a = {}, l = z.value.find((n) => n.id === t.id) || {};
      try {
        const n = e.dynamicMatch(e.fieldMap, {
          item: {
            ...l,
            ...t
          }
        }), h = JSON.parse(n);
        Object.keys(h).forEach((F) => {
          h[F] && Object.assign(a, {
            [F]: h[F]
          });
        });
      } catch (n) {
        ibiz.log.debug("".concat(e.fieldMap, "额外抛值字段映射"));
      }
      return a;
    }, Z = () => {
      if (e.enableBottomButton && !j.value)
        return;
      const t = b.value.map((a) => {
        const l = {};
        return Object.assign(l, {
          [e.selfFillMap.user_id]: a.id,
          [e.selfFillMap.user_name]: a.name,
          [e.selfFillMap.user_title]: a.title,
          [e.attentionTypeField]: a[e.attentionTypeField]
        }), e.fieldMap && Object.assign(l, Se(a)), l;
      });
      s("change", t);
    }, Le = (t, a) => {
      Y(a);
      const l = b.value.findIndex((n) => n.id === t.id);
      if (l > -1 && b.value.splice(l, 1), e.valueItem) {
        const n = b.value.map((h) => h.id);
        s("change", n.join(e.separator), e.valueItem);
      }
      if (e.valueType === "OBJECTS")
        j.value = !0, Z(), j.value = !1;
      else {
        const n = b.value.map((h) => h.name);
        s("change", n.join(e.separator));
      }
    }, je = async (t) => {
      M.value && (c.value === "user" ? m.value.unshift(t) : g.value.unshift(t));
      const a = {};
      if (Object.assign(a, t), c.value === "user") {
        Object.assign(a, {
          [e.userFilterMap.id]: a[e.userFilterMap.id] ? a[e.userFilterMap.id] : a.srfkey,
          [e.userFilterMap.name]: a[e.userFilterMap.name] ? a[e.userFilterMap.name] : a.srfmajortext
        });
        const l = b.value.findIndex((n) => n.id === a[e.userFilterMap.id]);
        l < 0 ? b.value.push({
          ...a,
          id: a[e.userFilterMap.id],
          name: a[e.userFilterMap.name],
          [e.attentionTypeField]: e.defaultAttentionValue
        }) : b.value.splice(l, 1);
      } else {
        Object.assign(a, {
          [e.deptFilterMap.id]: a[e.deptFilterMap.id] ? a[e.deptFilterMap.id] : a.srfkey,
          [e.deptFilterMap.name]: a[e.deptFilterMap.name] ? a[e.deptFilterMap.name] : a.srfmajortext
        });
        const l = b.value.findIndex((n) => n.id === a[e.deptFilterMap.id]);
        l < 0 ? b.value.push({
          ...a,
          id: a[e.deptFilterMap.id],
          name: a[e.deptFilterMap.name],
          [e.attentionTypeField]: e.defaultAttentionValue
        }) : b.value.splice(l, 1);
      }
      if (e.multiple) {
        if (e.valueItem) {
          const n = b.value.map((h) => h.id);
          s("change", n.join(e.separator), e.valueItem);
        }
        const l = b.value.map((n) => n.name);
        e.valueType === "OBJECTS" ? Z() : s("change", l.join(e.separator));
      } else {
        const l = await e.calcFillDataItems([t]);
        if (l.length && l.forEach((n) => {
          s("change", n.value, n.id);
        }), e.valueItem && (c.value === "user" ? s("change", a[e.userFilterMap.id], e.valueItem) : s("change", a[e.deptFilterMap.id], e.valueItem)), e.valueType === "OBJECT")
          s("change", e.handleObjectParams(a));
        else if (e.valueType === "OBJECTS") {
          const n = {};
          c.value === "user" ? Object.assign(n, {
            id: a[e.userFilterMap.id],
            name: a[e.userFilterMap.name]
          }) : Object.assign(n, {
            id: a[e.deptFilterMap.id],
            name: a[e.deptFilterMap.name]
          }), b.value = [n], Z();
        } else
          c.value === "user" ? s("change", t[e.userFilterMap.name]) : s("change", t[e.deptFilterMap.name]);
        T.value = !1;
      }
      e.valueType !== "OBJECTS" && s("blur", t), oe(!1);
    }, De = (t, a) => {
      t.forEach((l) => {
        const n = m.value.findIndex((h) => h[a] === l[a]);
        n > -1 ? m.value.splice(n, 1, l) : m.value.push(l);
      });
    }, V = async (t = !1) => {
      if (M.value)
        return;
      O.value = !0;
      const a = {};
      c.value === "department" ? a.page = e.deptpage : a.page = e.page;
      try {
        const l = await e.loadMore(u.data, c.value, a);
        l && (c.value === "user" ? m.value.length === 0 ? m.value = l.data : De(l.data, e.userFilterMap.id) : g.value.length === 0 ? g.value = l.data : g.value.push(...l.data));
      } catch (l) {
        O.value = !1;
      }
      O.value = !1;
    }, ue = (t) => {
      const {
        dataItems: a
      } = e;
      a != null && a.length && a.forEach((l) => {
        s("change", null, l.id);
      }), e.valueItem && s("change", null, e.valueItem), e.valueType === "OBJECTS" ? s("change", []) : (s("change", null), s("blur", t)), t.stopPropagation(), t.preventDefault();
    }, ke = async (t) => {
      if (e.codeListMap) {
        if (Pe(String(t))) {
          const a = b.value.find((l) => {
            var n;
            return l[e.selfFillMap.user_id] === ((n = e.context) == null ? void 0 : n.srfuserid);
          });
          if (a)
            Object.assign(a, {
              [e.attentionTypeField]: t
            });
          else {
            const l = {
              id: e.context.srfuserid,
              name: e.context.srfusername,
              [e.attentionTypeField]: t
            };
            e.currentOperator || await e.initCurrentOperator(u.data), e.currentOperator && Object.assign(l, {
              title: e.currentOperator[e.userFilterMap.title]
            }), b.value.push(l);
          }
        } else {
          const a = b.value.findIndex((l) => {
            var n;
            return l[e.selfFillMap.user_id] === ((n = e.context) == null ? void 0 : n.srfuserid);
          });
          a > -1 && b.value.splice(a, 1);
        }
        G(), Z();
      }
    };
    R(L, (t, a) => {
      t !== a && e.valueType !== "OBJECTS" && s("infoTextChange", t);
    }, {
      immediate: !0
    });
    const de = async (t) => {
      O.value = !0;
      try {
        const a = {};
        Object.assign(a, {
          query: t,
          size: 1e3
        });
        const l = await e.getServiceData(c.value, u.data, a);
        l && (c.value === "user" ? l.data.forEach((n) => {
          Object.keys(e.userFilterMap).forEach((h) => {
            n[h] = n[e.userFilterMap[h]];
          });
        }) : l.data.forEach((n) => {
          Object.keys(e.deptFilterMap).forEach((h) => {
            n[h] = n[e.deptFilterMap[h]];
          });
        }), I.value = l.data, O.value = !1);
      } catch (a) {
        O.value = !1;
      }
    }, ce = (t) => {
      if (c.value !== t) {
        if (c.value = t, M.value) {
          de(M.value);
          return;
        }
        c.value === "user" && m.value.length === 0 && V(), c.value === "department" && g.value.length === 0 && V();
      }
    }, Ne = () => {
      const t = document.documentElement;
      return t ? getComputedStyle(t).getPropertyValue("--ibiz-color-primary") : null;
    }, ze = (t) => /[\u4E00-\u9FA5]/.test(t), Ve = (t) => /[\u4e00-\u9fa5]+.*[a-zA-Z]+|[a-zA-Z]+.*[\u4e00-\u9fa5]+/.test(t), Q = (t) => {
      if (!t)
        return "";
      let a = 0;
      for (let k = 0; k < t.length; k++)
        if (ze(t))
          a = t.charCodeAt(k) + ((a << 5) - a), a = a & a;
        else {
          const dt = t.charCodeAt(k);
          a += dt.toString(16);
        }
      const l = String(a).substring(0, 6);
      let n = parseInt(l.substring(0, 2), 16), h = parseInt(l.substring(2, 4), 16), F = parseInt(l.substring(4, 6), 16);
      n < 0 && (n = 10), h < 0 && (h = 10), F < 0 && (F = 10);
      const P = "#".concat(n.toString(16).padStart(2, "0")).concat(h.toString(16).padStart(2, "0")).concat(F.toString(16).padStart(2, "0"));
      return P === "#FFFFFF" && Ne() || P;
    }, Be = (t) => {
      clearTimeout(v.value), v.value = setTimeout(() => {
        !t && t !== 0 ? V() : de(t), clearTimeout(v.value);
      }, 300);
    }, Ue = (t) => {
      t.forEach((a) => {
        if (a.capLanguageRes && a.capLanguageRes.lanResTag) {
          const l = ibiz.i18n.t(a.capLanguageRes.lanResTag, a.caption);
          Object.assign(a, {
            caption: l
          });
        }
        if (a.tooltipLanguageRes && a.tooltipLanguageRes.lanResTag) {
          const l = ibiz.i18n.t(a.tooltipLanguageRes.lanResTag, a.tooltip);
          Object.assign(a, {
            caption: l
          });
        }
      });
    }, Re = async (t, a) => {
      await e.onActionClick(t, [u.data], a);
    }, _e = (t) => M.value ? I.value : t, pe = () => {
      U.value = !1, $.value = {}, J.clear();
    }, He = () => {
      j.value = !1, T.value = !1, setTimeout(() => {
        re(u.value);
      }, 200);
    }, $e = () => {
      j.value = !0, T.value = !1, Z(), j.value = !1;
    }, Je = () => r(x("el-input"), {
      class: i.be("select-modal", "search-input"),
      ref: K,
      modelValue: M.value,
      "onUpdate:modelValue": (t) => M.value = t,
      placeholder: "搜索",
      onInput: (t) => Be(t)
    }, {
      suffix: () => r("svg", {
        viewBox: "0 0 16 16",
        xmlns: "http://www.w3.org/2000/svg",
        height: "1em",
        width: "1em",
        preserveAspectRatio: "xMidYMid meet",
        focusable: "false"
      }, [r("g", {
        id: "atwnormal/search",
        "stroke-width": "1",
        "fill-rule": "evenodd"
      }, [r("path", {
        d: "M6.751 12.303A5.557 5.557 0 0 1 1.2 6.751C1.2 3.691 3.69 1.2 6.751 1.2a5.558 5.558 0 0 1 5.551 5.551 5.557 5.557 0 0 1-5.551 5.552M6.751 0a6.751 6.751 0 1 0 4.309 11.949l3.855 3.855a.6.6 0 1 0 .849-.849l-3.854-3.853A6.751 6.751 0 0 0 6.751 0",
        id: "atwFill-1",
        fill: "currentColor"
      }, null)])])
    }), Ze = () => r("div", {
      class: i.be("select-modal", "select-state")
    }, [r("div", {
      class: [i.bem("select-modal", "select-state", "select-slider"), i.is("left", c.value === "user"), i.is("right", c.value !== "user")]
    }, null), r("div", {
      class: i.bem("select-modal", "select-state", "select-personel"),
      onClick: () => ce("user")
    }, [B("人员")]), r("div", {
      class: i.bem("select-modal", "select-state", "select-department"),
      onClick: () => ce("department")
    }, [B("部门")])]), Ke = (t) => r("div", {
      class: i.bem("select-modal", "actions", "item"),
      title: t.tooltip,
      onClick: (a) => Re(t, a)
    }, [t.showIcon && t.sysImage && r(x("iBizIcon"), {
      icon: t.sysImage
    }, null)]), We = () => {
      var t;
      const a = ((t = e.model.uiactionGroup) == null ? void 0 : t.uiactionGroupDetails) || [];
      return Ue(a), r("div", {
        class: i.be("select-modal", "actions")
      }, [a.map((l) => Ke(l))]);
    }, Ye = () => r("div", {
      class: i.be("select-modal", "select")
    }, [Ze(), We()]), qe = (t) => {
      if (e.multiple) {
        let a = -1;
        return w.value && (a = w.value.split(e.separator).findIndex((l) => l === t)), e.enableBottomButton && (a = b.value.findIndex((l) => (c.value === "user" ? l[e.userFilterMap.id] : l[e.deptFilterMap.id]) === t)), a > -1 ? r("div", {
          class: i.bem("select-modal", "personel-list", "icon")
        }, [r("i", {
          class: "fa fa-check",
          "aria-hidden": "true"
        }, null)]) : null;
      }
      return w.value === t ? r("div", {
        class: i.bem("select-modal", "personel-list", "icon")
      }, [r("i", {
        class: "fa fa-check",
        "aria-hidden": "true"
      }, null)]) : null;
    }, Ge = (t) => {
      if (t && t.toString().length < 2)
        return t;
      if (t && t.toString().length >= 2) {
        if (Ve(t)) {
          const a = t.split("").find((n) => /[a-zA-Z]/.test(n)) || "", l = t.split("").find((n) => /[\u4E00-\u9FA5]/.test(n)) || "";
          return "".concat(a).concat(l).toLowerCase();
        }
        return /[a-zA-Z]/.test(t) ? t.split("").filter((a) => /[a-zA-Z]/.test(a)).slice(0, 2).join("").toUpperCase() : /[\u4E00-\u9FA5]/.test(t) ? t.split("").filter((a) => /[\u4E00-\u9FA5]/.test(a)).slice(-2).join("") : t.replaceAll(" ", "").substring(0, 2);
      }
    }, Xe = (t) => {
      console.log("头像加载失败"), A.value.push(t);
    }, Qe = (t, a) => {
      if (!t)
        return null;
      let l = "";
      if (xe(t))
        l = t;
      else {
        let n = [];
        try {
          n = JSON.parse(t);
        } catch (F) {
          console.error("解析头像数据失败", F);
        }
        if (n.length === 0)
          return null;
        const h = n[0].id;
        if (l = $.value[h], !l)
          return Oe(h, a), null;
      }
      return r("img", {
        class: i.bem("select-modal", "personel-list", "avatar"),
        src: l,
        onError: () => Xe(t),
        alt: ""
      }, null);
    }, ee = (t, a, l) => {
      const n = l && (c.value === "user" ? l[e.userFilterMap.avatar] : l[e.deptFilterMap.avatar]) || e.getUserPictureUrl(t, a), h = Qe(n, l);
      return n && !A.value.includes(n) && h ? h : Ge(a);
    }, he = (t) => {
      const a = c.value === "user" ? t[e.userFilterMap.name] || t.name : t[e.deptFilterMap.name] || t.name, l = c.value === "user" ? t[e.userFilterMap.id] : t[e.deptFilterMap.id], n = c.value === "user" ? t[e.userFilterMap.title] : t[e.deptFilterMap.title];
      return r("div", {
        class: [i.bem("select-modal", "personel-list", "item"), i.is("selected", w.value === l)],
        onClick: () => je(t)
      }, [r("div", {
        class: i.bem("select-modal", "personel-list", "text")
      }, [r("div", {
        class: i.bem("select-modal", "personel-list", "text-img"),
        style: "background-color:".concat(Q(a))
      }, [ee(l, a, t)]), r("div", {
        class: i.bem("select-modal", "personel-list", "text-label")
      }, [a]), n && r("div", {
        class: i.bem("select-modal", "personel-list", "title-label")
      }, [n]), l === e.context.srfuserid ? r("div", {
        class: i.bem("select-modal", "personel-list", "myself")
      }, [B("我自己")]) : null]), qe(l)]);
    }, et = (t, a) => {
      const {
        context: l,
        params: n
      } = e;
      return r(x("iBizControlShell"), {
        class: i.b("panel-item"),
        data: t,
        modelData: a,
        context: l,
        params: n
      }, null);
    }, tt = (t, a) => r(x("el-popover"), {
      target: "hover",
      placement: "right",
      offset: 24,
      width: "auto"
    }, {
      reference: () => he(t),
      default: () => et(t, a)
    }), at = (t, a) => {
      U.value && (c.value === "user" ? t - a < 305 && (O.value || V()) : t - a < 265 && (O.value || V()));
    }, me = (t) => {
      var a;
      const l = _e(t), n = (a = e.deACMode) == null ? void 0 : a.itemLayoutPanel;
      return r(St, {
        items: l,
        itemHeight: 36,
        class: [i.be("select-modal", "personel-list"), i.be("select-modal", "personel-list-".concat(c.value))],
        onScrollEvent: (h, F) => at(h, F)
      }, {
        default: (h) => n ? tt(h, n) : he(h)
      });
    }, ve = (t) => {
      y.value = t;
    }, lt = () => r("div", {
      class: i.be("select-modal", "deptpersonel")
    }, [r("div", {
      class: i.bem("select-modal", "deptpersonel", "dept")
    }, [r("div", {
      class: "collpase-icon"
    }, [y.value ? r("i", {
      class: "fa fa-angle-right",
      "aria-hidden": "true",
      onClick: () => ve(!1)
    }, null) : r("i", {
      class: "fa fa-angle-down",
      "aria-hidden": "true",
      onClick: () => ve(!0)
    }, null)]), r("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false"
    }, [r("g", {
      id: "aqf1.Base基础/1.icon图标/2.normal/部门",
      "stroke-width": "1",
      "fill-rule": "evenodd"
    }, [r("path", {
      d: "M9 1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-.39l-.016 2.138H11.5a2.1 2.1 0 0 1 2.095 1.95l.005.15V11h.4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h.4V9.238a.9.9 0 0 0-.787-.893l-.113-.007h-7a.9.9 0 0 0-.893.787l-.007.113V11H4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h.4V9.238a2.1 2.1 0 0 1 1.95-2.094l.15-.006h2.894L7.41 5H7a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h2zm4.8 11.2h-1.6v1.6h1.6v-1.6zm-10 0H2.2v1.6h1.6v-1.6zm5-10H7.2v1.6h1.6V2.2z",
      id: "aqf形状结合",
      fill: "currentColor"
    }, null)])]), r("span", null, ["".concat(e.context.srfusername, "的团队")]), r("span", null, [B("·")]), r("span", null, [e.depttotal])]), y.value ? null : r("div", {
      class: i.bem("select-modal", "deptpersonel", "dept-person")
    }, [me(g.value)])]), it = () => {
      let t, a;
      return r("div", {
        class: i.be("select-modal", "bottom")
      }, [r(x("el-button"), {
        type: "text",
        onClick: He
      }, ae(t = ibiz.i18n.t("app.cancel")) ? t : {
        default: () => [t]
      }), r(x("el-button"), {
        onClick: $e
      }, ae(a = ibiz.i18n.t("app.confirm")) ? a : {
        default: () => [a]
      })]);
    }, fe = () => Ft(r("div", {
      class: i.b("select-modal"),
      onPointerdown: Y,
      onPointerup: Y,
      onClick: Y
    }, [Je(), Ye(), r("div", {
      class: i.be("select-modal", "container"),
      style: {
        height: "".concat(S.value, "px")
      }
    }, [c.value === "user" ? me(m.value) : lt()]), e.enableBottomButton && it()]), [[Et("loading"), O.value]]), ge = () => r("div", {
      class: i.b("no-select-value")
    }, [r("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false"
    }, [r("g", {
      id: "azeaction/user-add",
      "stroke-width": "1"
    }, [r("path", {
      d: "M7.9.4a4.1 4.1 0 1 1-.265 8.192.593.593 0 0 1-.268.126 6.411 6.411 0 0 0-4.624 3.698A6.375 6.375 0 0 0 2.2 15 .6.6 0 0 1 1 15c0-1.07.222-2.11.645-3.069a7.622 7.622 0 0 1 4.069-3.963A4.1 4.1 0 0 1 7.9.4zm4.6 9.9a.6.6 0 0 1 .592.503l.008.097-.001 1.399 1.401.001a.6.6 0 0 1 .592.503l.008.097a.6.6 0 0 1-.503.592l-.097.008-1.401-.001.001 1.401a.6.6 0 0 1-.503.592l-.097.008a.6.6 0 0 1-.592-.503L11.9 14.9v-1.401l-1.4.001a.6.6 0 0 1-.592-.503L9.9 12.9a.6.6 0 0 1 .503-.592l.097-.008h1.4v-1.4a.6.6 0 0 1 .503-.592l.097-.008zM7.9 1.6a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8z",
      id: "aze形状结合",
      fill: "currentColor"
    }, null)])]), r("span", null, [B("未设置")])]), st = () => r("div", {
      class: i.b("no-select-value")
    }, [r("span", null, [B("未设置")])]), be = () => {
      var t, a;
      if (e.multiple) {
        const l = [];
        if (w.value) {
          const h = w.value.split(e.separator), F = L.value.split(e.separator);
          h.forEach((P, k) => {
            l.push({
              id: P,
              name: F[k]
            });
          });
        }
        let n = !1;
        return C > 0 && (n = e.enableBottomButton ? C < ((t = z.value) == null ? void 0 : t.length) : C < ((a = b.value) == null ? void 0 : a.length), l == null || l.splice(C, l == null ? void 0 : l.length)), r("div", {
          class: [i.b("select-value-multiple"), i.is("hidden", n)]
        }, [l == null ? void 0 : l.map((h) => {
          let F;
          return r("div", {
            class: i.be("select-value-multiple", "item")
          }, [r("div", {
            class: [i.be("select-value", "textimg"), i.bem("select-value-multiple", "item", "textimg")],
            style: "background-color:".concat(Q(h.name))
          }, [r(x("el-tooltip"), {
            class: "box-item",
            effect: "dark",
            content: h.name,
            placement: "top",
            offset: 12
          }, ae(F = ee(h.id, h.name, h)) ? F : {
            default: () => [F]
          }), u.readonly ? null : r("div", {
            class: [i.bem("select-value-multiple", "item", "close")],
            onClick: (P) => Le(h, P)
          }, [r("i", {
            class: "fa fa-close",
            "aria-hidden": "true"
          }, null)])])]);
        }), n ? r(x("el-tooltip"), {
          class: i.b("multiple-ellipsis"),
          "popper-class": i.be("multiple-ellipsis", "popper"),
          effect: "dark",
          content: L.value,
          placement: "top",
          offset: 12
        }, {
          default: () => [r("span", {
            class: i.be("multiple-ellipsis", "default")
          }, [B("...")])]
        }) : null]);
      }
    }, we = () => e.multiple ? r("div", {
      class: i.b("select-value-multiple")
    }, [r("div", {
      class: i.b("select-value"),
      title: "选择人员"
    }, [r("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false"
    }, [r("g", {
      id: "azeaction/user-add",
      "stroke-width": "1"
    }, [r("path", {
      d: "M7.9.4a4.1 4.1 0 1 1-.265 8.192.593.593 0 0 1-.268.126 6.411 6.411 0 0 0-4.624 3.698A6.375 6.375 0 0 0 2.2 15 .6.6 0 0 1 1 15c0-1.07.222-2.11.645-3.069a7.622 7.622 0 0 1 4.069-3.963A4.1 4.1 0 0 1 7.9.4zm4.6 9.9a.6.6 0 0 1 .592.503l.008.097-.001 1.399 1.401.001a.6.6 0 0 1 .592.503l.008.097a.6.6 0 0 1-.503.592l-.097.008-1.401-.001.001 1.401a.6.6 0 0 1-.503.592l-.097.008a.6.6 0 0 1-.592-.503L11.9 14.9v-1.401l-1.4.001a.6.6 0 0 1-.592-.503L9.9 12.9a.6.6 0 0 1 .503-.592l.097-.008h1.4v-1.4a.6.6 0 0 1 .503-.592l.097-.008zM7.9 1.6a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8z",
      id: "aze形状结合",
      fill: "currentColor"
    }, null)])])])]) : r("div", {
      class: i.b("select-value")
    }, [r("div", {
      class: i.be("select-value", "textimg"),
      style: "background-color:".concat(Q(L.value))
    }, [ee(w.value, L.value)]), r("div", {
      class: i.be("select-value", "text")
    }, [r("div", {
      class: i.bem("select-value", "text", "label")
    }, [L.value])]), u.readonly ? null : r("i", {
      class: ["fa fa-times-circle", i.be("select-value", "close")],
      "aria-hidden": "true",
      onClick: (t) => ue(t)
    }, null)]), ye = async () => {
      var t, a;
      U.value = !0;
      const {
        context: l,
        params: n
      } = e.handlePublicParams(u.data, e.context, e.params), h = e.fill(e.userUrl, l, n, u.data).replaceAll("//", "/"), F = e.fill(e.deptUrl, l, n, u.data).replaceAll("//", "/");
      (h !== e.copyUserUrl || F !== e.copyDeptUrl || u.data && u.data.srfkey !== _.value) && (_.value = ((t = u.data) == null ? void 0 : t.srfkey) || "", m.value = [], g.value = [], e.resetState(), V(!0)), await It(), (a = K.value) == null || a.focus();
    }, nt = () => L.value ? we() : ge(), rt = () => L.value ? [be()] : st(), ot = () => r(x("el-popover"), At({
      visible: T.value,
      "onUpdate:visible": (t) => T.value = t,
      trigger: "click",
      popperClass: i.b("person-select"),
      placement: "top-start",
      width: 320,
      teleported: !0,
      onShow: () => ye(),
      onHide: () => pe(),
      onBeforeEnter: () => Ae()
    }, o), {
      reference: () => nt(),
      default: () => fe()
    }), ut = () => [be(), ot()], Me = () => {
      X();
    };
    return Ee(() => {
      D.value && (window == null || window.addEventListener("resize", Me), X());
    }), yt(() => {
      e.resetState(), D.value && (window == null || window.removeEventListener("resize", Me)), $.value = {}, J.clear();
    }), {
      ns: i,
      c: e,
      refValue: w,
      curValue: d,
      valueText: L,
      loading: O,
      items: m,
      isEditable: E,
      showFormDefaultContent: Ce,
      modelVisible: T,
      curAttentionValue: H,
      attentionRef: D,
      readonlyState: W,
      onClear: ue,
      load: V,
      setEditable: oe,
      renderDropModal: fe,
      renderNoSelectValue: ge,
      renderSelectInput: we,
      onPopShow: ye,
      onPageHide: pe,
      onAttentionChange: ke,
      renderEditContent: ut,
      renderReadonlyContent: rt
    };
  },
  render() {
    return r("div", {
      ref: "attentionRef",
      class: [this.ns.b(), this.ns.b("person-value"), this.disabled ? this.ns.m("disabled") : "", this.readonlyState ? this.ns.m("readonly") : "", this.ns.is("editable", this.isEditable), this.ns.is("show-default", this.showFormDefaultContent)]
    }, [this.readonlyState ? this.renderReadonlyContent() : this.renderEditContent(), r(Lt, {
      disabled: this.disabled,
      value: this.curAttentionValue,
      codeListId: this.c.codeListId,
      codeListMap: this.c.codeListMap,
      defaultSelected: this.c.defaultSelected,
      controller: this.c,
      onChange: this.onAttentionChange
    }, null)]);
  }
}), Dt = mt(le, function(u) {
  u.component(le.name, le), vt(
    "EDITOR_CUSTOMSTYLE_ATTENTION",
    () => new Tt()
  );
}), _t = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(u) {
    u.use(Dt);
  }
};
export {
  Dt as IBizAttention,
  _t as default
};
