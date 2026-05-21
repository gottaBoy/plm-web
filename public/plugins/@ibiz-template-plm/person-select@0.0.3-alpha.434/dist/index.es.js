import './style.css';
var nt = Object.defineProperty;
var ot = (o, h, i) => h in o ? nt(o, h, { enumerable: !0, configurable: !0, writable: !0, value: i }) : o[h] = i;
var d = (o, h, i) => (ot(o, typeof h != "symbol" ? h + "" : h, i), i);
import { useNamespace as te, getDataPickerProps as ut, getEditorEmits as ct, renderString as X, withInstall as dt } from "@ibiz-template/vue3-util";
import { EditorController as pt, getDeACMode as ht, UIActionUtil as mt, OpenAppViewCommand as ge, registerEditorProvider as ft } from "@ibiz-template/runtime";
import { RuntimeModelError as Y } from "@ibiz-template/core";
import { mergeDeepLeft as vt, clone as be } from "ramda";
import { notNilEmpty as _ } from "qx-util";
import { defineComponent as Me, ref as E, onMounted as Ee, watch as x, createVNode as r, computed as q, onBeforeUnmount as gt, resolveComponent as C, mergeProps as bt, withDirectives as Mt, resolveDirective as Et, createTextVNode as V, nextTick as yt, isVNode as St } from "vue";
import { isArray as wt } from "lodash-es";
class Pt extends pt {
  constructor() {
    super(...arguments);
    /**
     * 云系统操作者Map
     *
     * @memberof PersonelSelectController
     */
    d(this, "operatorMap", /* @__PURE__ */ new Map());
    /**
     * 当前操作者数据
     */
    d(this, "currentOperator");
    /**
     * 总数
     */
    d(this, "total", 0);
    /**
     * 当前人员数量
     */
    d(this, "currentNumber", -1);
    /**
     * 人员当前页
     */
    d(this, "page", 0);
    /**
     * 部门人员数据页数
     */
    d(this, "deptpage", 0);
    /**
     * 当前部门人员数量
     */
    d(this, "deptcurrentNumber", -1);
    /**
     * 部门人员总数
     */
    d(this, "depttotal", 0);
    /**
     * 每页数量
     */
    d(this, "size", 20);
    /**
     * 是否多选
     */
    d(this, "multiple", !1);
    /**
     * 是否附加符号 多选且开启附加符号并且选择值为多个时，每个选择值前后都拼接上单引号后再抛出去
     */
    d(this, "isAddSymbol", !1);
    /**
     * 多选时拼接的字符串
     */
    d(this, "separator", ",");
    /**
     *选择视图相关参数
     */
    d(this, "pickupView", null);
    /**
     *链接视图相关参数
     */
    d(this, "linkView", null);
    /**
     * 人员UI转化
     */
    d(this, "userFilterMap", {
      id: "id",
      name: "name",
      title: "title",
      avatar: ""
    });
    /**
     * 部门人员UI转化
     */
    d(this, "deptFilterMap", {
      id: "id",
      name: "name",
      title: "title",
      avatar: ""
    });
    /**
     * 是否显示人员部门分页
     */
    d(this, "isShowTab", !0);
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
    // 人员请求地址
    d(this, "userUrl", "");
    // 部门请求地址
    d(this, "deptUrl", "");
    // 复制人员请求url,这是用来保证当配置的URL中的动态参数变化后可以刷新当前请求状态
    d(this, "copyUserUrl", "");
    // 复制部门人员请求url
    d(this, "copyDeptUrl", "");
    // 人员请求方式
    d(this, "userMethod", "post");
    // 部门人员请求方式
    d(this, "deptMethod", "post");
    /**
     * 上下文替换正则
     *
     */
    d(this, "contextReg", /\$\{context.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g);
    /**
     * 数据替换正则
     *
     */
    d(this, "dataReg", /\$\{data.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g);
    /**
     * 参数替换正则
     *
     */
    d(this, "paramsReg", /\$\{params.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g);
    /**
     * 是否配置了默认显示当前用户
     */
    d(this, "defaultSelCurUser", !1);
    /**
     * 值类型
     */
    d(this, "valueType", "OBJECTS");
    /**
     * 关注类型属性
     *
     */
    d(this, "attentionTypeField", "type");
    /**
     * 自填充映射
     */
    d(this, "selfFillMap", {
      user_id: "user_id",
      user_name: "name",
      user_title: "title"
    });
    /**
     * 云操作者代码表标识
     */
    d(this, "sysOperatorCodeListTag", "");
    /**
     * 选中后默认关注值
     *
     */
    d(this, "defaultAttentionValue", "");
    /**
     * 是否显示姓名文字
     */
    d(this, "showNameText", !0);
    /**
     * 是否显示姓名提示
     */
    d(this, "showNameTip", !1);
    /**
     * 后缀
     *
     * @type {string}
     * @memberof PersonelSelectController
     */
    d(this, "suffix", "");
    /**
     * 是否清除过滤条件
     *
     * @type {boolean}
     * @memberof PersonelSelectController
     */
    d(this, "clearFilter", !1);
    /**
     * 人员头像文件权限归属实体
     */
    d(this, "userAuthEntity", "");
    /**
     * 部门头像文件权限归属实体
     */
    d(this, "deptAuthEntity", "");
    /**
     * @description 启用底部按钮
     * @type {boolean}
     * @memberof PersonelSelectController
     */
    d(this, "enableBottomButton", !1);
  }
  async onInit() {
    var c, e, p, u;
    if (super.onInit(), this.initDefaultAttribute(), this.valueItem = ((c = this.model.valueItemName) == null ? void 0 : c.toLowerCase()) || "", this.initParams(), await this.getOperatorUserList(), this.model.appDataEntityId && (this.model.appDEDataSetId && (this.interfaceName = this.model.appDEDataSetId), this.model.appDEACModeId && (this.deACMode = await ht(
      this.model.appDEACModeId,
      this.model.appDataEntityId,
      this.context.srfappid
    ), this.deACMode))) {
      const { minorSortAppDEFieldId: m, minorSortDir: g } = this.deACMode;
      m && g && (this.sort = "".concat(m.toLowerCase(), ",").concat(g.toLowerCase())), this.deACMode.textAppDEFieldId && (this.textName = this.deACMode.textAppDEFieldId), this.deACMode.valueAppDEFieldId && (this.keyName = this.deACMode.valueAppDEFieldId), this.deACMode.deacmodeDataItems && (this.dataItems = [], this.deACMode.deacmodeDataItems.forEach(
        (b) => {
          b.id !== "value" && b.id !== "text" && this.dataItems.push(b);
        }
      ));
    }
    const i = [
      "PICKEREX_DROPDOWNVIEW",
      "PICKEREX_DROPDOWNVIEW_LINK",
      "PICKUPVIEW"
    ];
    this.model.editorType && i.includes(this.model.editorType) && this.initPickupViewParams(), this.objectIdField = (e = this.model.objectIdField) == null ? void 0 : e.toLowerCase(), this.objectNameField = (p = this.model.objectNameField) == null ? void 0 : p.toLowerCase(), this.objectValueField = (u = this.model.objectValueField) == null ? void 0 : u.toLowerCase();
  }
  /**
   * 初始化字段默认属性
   */
  initDefaultAttribute() {
    this.model.valueType && (this.valueType = this.model.valueType);
  }
  /**
   * 初始化noAc和noButton
   */
  initParams() {
    var i, c, e, p, u, m, g, b, w;
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
    if (this.userUrl = this.editorParams.URL, this.deptUrl = this.editorParams.DEPTURL, this.userMethod = this.editorParams.USERMETHOD || "post", this.deptMethod = this.editorParams.DEPTMETHOD || "post", this.sysOperatorCodeListTag = this.editorParams.sysoperatorcodelisttag || "SysOperator", this.multiple = this.editorParams.MULTIPLE === "true", this.defaultSelCurUser = this.editorParams.DEFAULTSELCURUSER === "true", this.separator = this.editorParams.SEPARATOR || ",", this.isAddSymbol = this.editorParams.ISADDSYMBOL === "true" && this.multiple === !0, this.isShowTab = this.editorParams.ISSHOWTAB !== "false", this.suffix = this.editorParams.SUFFIX, this.clearFilter = this.editorParams.CLEARFILTER === "true", (i = this.editorParams) != null && i.VALUETYPE && (this.valueType = (c = this.editorParams) == null ? void 0 : c.VALUETYPE), (e = this.editorParams) != null && e.DEFAULTATNVALUE && (this.defaultAttentionValue = (p = this.editorParams) == null ? void 0 : p.DEFAULTATNVALUE), (u = this.editorParams) != null && u.VALUEITEMNAME && (this.valueItem = (m = this.editorParams) == null ? void 0 : m.VALUEITEMNAME), this.editorParams.userauthentity && (this.userAuthEntity = this.editorParams.userauthentity), this.editorParams.deptauthentity && (this.deptAuthEntity = this.editorParams.deptauthentity), (g = this.editorParams) != null && g.ENABLEBOTTOMBUTTON && (this.enableBottomButton = ((b = this.editorParams) == null ? void 0 : b.ENABLEBOTTOMBUTTON) === "true"), this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, "SELFFILLMAP"))
      try {
        const S = JSON.parse((w = this.editorParams) == null ? void 0 : w.SELFFILLMAP);
        Object.assign(this.selfFillMap, S);
      } catch (S) {
        ibiz.log.error(S);
      }
    if (this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, "USERMAP"))
      try {
        const S = JSON.parse(this.editorParams.USERMAP);
        Object.assign(this.userFilterMap, S);
      } catch (S) {
        this.userFilterMap = {
          id: "id",
          name: "name",
          title: "title",
          avatar: ""
        };
      }
    if (this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, "DEPTMAP"))
      try {
        const S = JSON.parse(this.editorParams.DEPTMAP);
        Object.assign(this.deptFilterMap, S);
      } catch (S) {
        this.deptFilterMap = {
          id: "id",
          name: "name",
          title: "title",
          avatar: ""
        };
      }
    this.editorParams.SHOWNAMETEXT && (this.showNameText = this.toBoolean(this.editorParams.SHOWNAMETEXT)), this.editorParams.SHOWNAMETIP && (this.showNameTip = this.toBoolean(this.editorParams.SHOWNAMETIP));
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
  async initCurrentOperator(i, c) {
    const e = this.context.srfuserid;
    if (!e)
      return;
    const p = await this.getServiceData(
      "department",
      i,
      {},
      {
        ...c,
        page: 0,
        size: 20,
        n_id_eq: e
      }
    );
    p && p.data && p.data.length > 0 && (this.currentOperator = p.data.find(
      (u) => u[this.deptFilterMap.id] === e
    ));
  }
  /**
   * 重置状态
   */
  resetState() {
    this.resetUserState(), this.resetDeptState();
  }
  /**
   * 重置全部人员分类的状态
   */
  resetUserState() {
    this.total = 0, this.currentNumber = -1, this.page = 0, this.copyUserUrl = "";
  }
  /**
   * 重置部门人员分类的状态
   */
  resetDeptState() {
    this.deptpage = 0, this.depttotal = 0, this.deptcurrentNumber = -1, this.copyDeptUrl = "";
  }
  /**
   * 加载更多
   */
  async loadMore(i, c, e = {}) {
    if (c === "user" && this.currentNumber < this.total) {
      const p = await this.getServiceData(c, i, e);
      if (p)
        return this.page += 1, this.currentNumber < 0 && (this.currentNumber += 1), this.currentNumber += this.size, this.total = (p.total ? Number(p.total) : Number(p.headers["x-total"])) || 0, p.data.forEach((u) => {
          Object.keys(this.userFilterMap).forEach((m) => {
            u[m] = u[this.userFilterMap[m]];
          });
        }), p;
    } else if (c === "department" && this.deptcurrentNumber < this.depttotal) {
      const p = await this.getServiceData(c, i, e);
      if (p)
        return this.deptpage += 1, this.deptcurrentNumber < 0 && (this.deptcurrentNumber += 1), this.deptcurrentNumber += this.size, this.depttotal = (p.total ? Number(p.total) : Number(p.headers["x-total"])) || 0, p.data.forEach((u) => {
          Object.keys(this.deptFilterMap).forEach((m) => {
            u[m] = u[this.deptFilterMap[m]];
          });
        }), p;
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
  async onActionClick(i, c, e) {
    const p = i.uiactionId;
    let u = {};
    this.parent.form ? u = this.parent.form.ctx.view : this.parent.grid && (u = this.parent.grid.ctx.view), await mt.execAndResolved(
      p,
      {
        context: this.context,
        params: this.params,
        data: c,
        view: u,
        event: e
      },
      i.appId
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
  fill(i = "", c, e, p) {
    if (_(i)) {
      if (_(c)) {
        const u = i.match(this.contextReg);
        u == null || u.forEach((m) => {
          const g = m.slice(10, m.length - 1);
          i = i.replace("${context.".concat(g, "}"), c[g] || "");
        });
      }
      if (_(e)) {
        const u = i.match(this.paramsReg);
        u == null || u.forEach((m) => {
          const g = m.slice(9, m.length - 1);
          i = i.replace("${params.".concat(g, "}"), e[g] || "");
        });
      }
      if (_(p)) {
        const u = i.match(this.dataReg);
        u == null || u.forEach((m) => {
          const g = m.slice(7, m.length - 1);
          i = i.replace("${data.".concat(g, "}"), p[g] || "");
        });
      }
    }
    return i;
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
  async getServiceData(i, c, e, p) {
    const { context: u, params: m } = this.handlePublicParams(
      c,
      this.context,
      this.params
    ), g = {};
    this.sort && !Object.is(this.sort, "") && Object.assign(g, { sort: this.sort }), Object.assign(g, { size: this.size }), e && Object.assign(g, e);
    const b = p || vt(m, g);
    let w = "";
    const S = this.fill(this.userUrl, u, m, c).replaceAll(
      "//",
      "/"
    ), P = this.fill(this.deptUrl, u, m, c).replaceAll(
      "//",
      "/"
    );
    this.copyUserUrl = S, this.copyDeptUrl = P;
    let A = "post";
    const v = {};
    if (i === "user" ? (w = S, A = this.userMethod.toLowerCase(), A === "get" ? Object.assign(v, { method: A, params: b }) : Object.assign(v, { method: A, data: b })) : (w = P, A = this.deptMethod.toLowerCase(), A === "get" ? Object.assign(v, { method: A, params: b }) : Object.assign(v, { method: A, data: b })), w)
      return await ibiz.net.request(w, v);
    throw new Y(this.model, "请配置数据接口地址");
  }
  /**
   * 打开数据选择视图
   *
   * @param {IData} data 数据对象
   * @param {IData[]} selectedData 选中项集合
   * @returns {*}  {(Promise<IData[] | undefined>)}
   * @memberof PersonelSelectController
   */
  async openPickUpView(i, c) {
    await this.initPickupViewParams();
    const { context: e, params: p } = this.handlePublicParams(
      i,
      this.context,
      this.params
    );
    if (c && (p.selectedData = c), !this.pickupView)
      throw new Y(this.model, "请配置数据选择视图");
    const u = await ibiz.commands.execute(
      ge.TAG,
      this.pickupView.id,
      e,
      p,
      { openMode: "POPUPMODAL" }
    );
    if (u && u.ok && u.data)
      return u.data;
    ibiz.log.debug("模态取消或关闭异常", u);
  }
  /**
   * 打开数据链接视图
   */
  async openLinkView(i) {
    const c = this.context.clone();
    i[this.valueItem] && (c.srfkey = i[this.valueItem]);
    const { context: e, params: p } = this.handlePublicParams(
      i,
      c,
      this.params
    ), { linkAppViewId: u } = this.model;
    if (!u)
      throw new Y(this.model, "请配置数据链接视图");
    return ibiz.commands.execute(
      ge.TAG,
      u,
      e,
      p
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
      this.dataItems.map((e) => {
        const u = i.map((m) => m[e.appDEFieldId]).join(this.separator);
        return e.format || e.convertToCodeItemText && e.codeListId || e.customCode, { id: e.id, value: u };
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
    const c = {};
    return this.objectIdField && Object.assign(c, {
      [this.objectIdField]: i[this.keyName]
    }), this.objectNameField && Object.assign(c, {
      [this.objectNameField]: i[this.textName]
    }), this.objectValueField && Object.assign(c, {
      [this.objectValueField]: be(i)
    }), c;
  }
  /**
   * 获取操作用户列表
   *
   * @memberof PersonelSelectController
   */
  async getOperatorUserList() {
    const i = await ibiz.hub.getApp(this.context.srfappid);
    let c = [];
    c = await i.codeList.get(
      this.sysOperatorCodeListTag,
      this.context,
      this.params
    ), this.operatorMap = new Map(
      c.map((e) => [e.value, e])
    );
  }
  /**
   * 判断是否显示姓名文字
   *
   * @return {*}  {boolean}
   * @memberof PersonelSelectController
   */
  isShowNameText() {
    return this.showNameText;
  }
  /**
   * 判断是否显示姓名提示
   *
   * @return {*}  {boolean}
   * @memberof PersonelSelectController
   */
  isShowNameTip() {
    return this.showNameTip;
  }
  /**
   * 获取人员头像路径
   *
   * @return {*}  {boolean}
   * @memberof PersonelSelectController
   */
  getUserPictureUrl(i, c) {
    if (this.operatorMap.size <= 0)
      return "";
    let e = {};
    return this.operatorMap.get(i) ? e = this.operatorMap.get(i) : Array.from(this.operatorMap.entries()).find((p) => {
      const u = p[1] || {};
      return u.text && c && u.text === c ? (e = u, !0) : !1;
    }), e.data && e.data.iconurl ? e.data.iconurl : "";
  }
}
class At {
  constructor() {
    d(this, "component", "PersonelSelect");
    d(this, "formEditor", "PersonelSelect");
    d(this, "gridEditor", "PersonelSelect");
  }
  async createController(h, i) {
    const c = new Pt(h, i);
    return await c.init(), c;
  }
}
const Ft = /* @__PURE__ */ Me({
  name: "VirtualList",
  props: {
    items: {
      // 数据源
      type: Array,
      default: () => []
    },
    itemHeight: {
      // 每行高度
      type: Number,
      default: 36
    },
    showNum: {
      // 可视数量
      type: Number,
      default: 20
    }
  },
  emits: ["scrollEvent"],
  setup(o, {
    emit: h
  }) {
    const i = te("virtual-list"), c = E(36), e = E(), p = E([]), u = E(0), m = E(0), g = E(0), b = E(0), w = () => {
      m.value = Math.floor(b.value / o.itemHeight), g.value = m.value + o.showNum, p.value = o.items.slice(m.value, g.value);
      const A = b.value - b.value % o.itemHeight;
      u.value = A;
    }, S = () => {
      b.value = e.value.scrollTop, w(), P(c.value, b.value);
    }, P = (A, v) => {
      h("scrollEvent", A, v);
    };
    return Ee(() => {
      setTimeout(() => {
        scroll();
      }, 1e3);
    }), x(() => o.items, () => {
      c.value = o.itemHeight * o.items.length, w();
    }, {
      immediate: !0,
      deep: !0
    }), {
      ns: i,
      contentHeight: c,
      showList: p,
      contentBox: e,
      top: u,
      onScroll: S
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
    }, [this.showList.map((o, h) => r("div", {
      key: h,
      class: this.ns.m("item")
    }, [this.$slots.default ? this.$slots.default({
      ...o,
      // eslint-disable-next-line object-shorthand
      index: h
    }) : o.name]))])])]);
  }
});
class Tt {
  /**
   * 计算选中项绘制个数 多选场景需计算显示人员是否超出
   * @author ljx
   * @date 2024-03-05 02:42:45
   * @param {IData} values 选中项key值集合
   * @returns {number} selRenderNum
   */
  static calcSelItemRenderNum(h, i) {
    let c = -1;
    if (i && (h == null ? void 0 : h.length) > 0) {
      const e = (i == null ? void 0 : i.offsetWidth) || 0, p = window.getComputedStyle(i), u = parseInt(p.marginLeft, 10), m = parseInt(p.marginRight, 10), g = parseInt(p.paddingLeft, 10), b = parseInt(p.paddingRight, 10), w = u + m + g + b, S = 32, P = 8, A = (S + P) * h.length;
      e - w - A < 0 && (c = Math.floor(
        (e - w) / (S + P)
      ), c = Math.max(c - 1, 0));
    }
    return c;
  }
}
function Q(o) {
  return typeof o == "function" || Object.prototype.toString.call(o) === "[object Object]" && !St(o);
}
const ee = /* @__PURE__ */ Me({
  name: "PersonelSelect",
  props: ut(),
  emits: ct(),
  setup(o, {
    emit: h
  }) {
    const i = te("picker-dropdown"), c = te("personel-select"), e = o.controller, p = e.valueType === "OBJECTS" && (o.overflowMode === "ellipsis" || e.defaultAttentionValue), u = E(""), m = E([]), g = E([]), b = E(""), w = E(!1), S = E(!1), P = E(""), A = E([]), v = E("user"), M = E([]), T = E(!1), H = E(!1), N = E(!1), ae = E(""), se = E(), B = E(), U = E();
    let D;
    const J = E(), ie = E([]);
    let z = 0;
    const le = E(295), ye = q(() => !!(o.controlParams && o.controlParams.editmode === "hover")), Se = () => {
      let t = 295;
      if (U.value) {
        const a = U.value.getBoundingClientRect(), s = 16, l = e.enableBottomButton ? 464 : 415, n = l - t, f = a.top < l + s, y = window.innerHeight - a.bottom < l + s;
        if (f && y) {
          const I = window.innerHeight - a.bottom - s - n;
          t = Math.max(50, Math.min(Math.floor(I), 295));
        }
      }
      le.value = t;
    }, we = (t) => /^https?:|^http?:|^data:image|(\.png$|\.svg|\.jpg|\.png|\.gif|\.psd|\.tif|\.bmp|\.jpeg)$/.test(t), re = (t) => {
      const a = [], s = [];
      M.value = [], t.forEach((l) => {
        var f, y;
        const n = be(l);
        (f = e.selfFillMap) != null && f.user_id && ((y = e.selfFillMap) != null && y.user_name) && Object.assign(n, {
          id: l[e.selfFillMap.user_id],
          name: l[e.selfFillMap.user_name]
        }), e.selfFillMap.user_title && Object.assign(n, {
          title: l[e.selfFillMap.user_title]
        }), a.push(l[e.selfFillMap.user_id]), s.push(l[e.selfFillMap.user_name]), M.value.push(n);
      }), b.value = a == null ? void 0 : a.join(e.separator), u.value = s == null ? void 0 : s.toString();
    }, L = (t = !1) => {
      if (e.enableBottomButton && !t)
        return;
      const a = M.value.map((s) => {
        var n, f, y;
        const l = {};
        return Object.assign(l, {
          [(n = e.selfFillMap) == null ? void 0 : n.user_id]: s.id,
          [(f = e.selfFillMap) == null ? void 0 : f.user_name]: s.name,
          [(y = e.selfFillMap) == null ? void 0 : y.user_title]: s.title
          // 添加用户职称
        }), e.attentionTypeField && e.defaultAttentionValue && Object.assign(l, {
          [e.attentionTypeField]: e.defaultAttentionValue
        }), l;
      });
      h("change", a), e.parent.form && (e.parent.form.state.modified = !1);
    }, Pe = (t) => {
      const a = {};
      return v.value === "user" ? Object.assign(a, {
        id: t[e.userFilterMap.id],
        name: t[e.userFilterMap.name]
      }) : Object.assign(a, {
        id: t[e.deptFilterMap.id],
        name: t[e.deptFilterMap.name]
      }), a;
    }, Ae = async () => {
      var t, a;
      if (e.defaultSelCurUser) {
        const s = {};
        if (Object.assign(s, {
          id: (t = e.context) == null ? void 0 : t.srfuserid,
          name: (a = e.context) == null ? void 0 : a.srfusername
        }), e.currentOperator || await e.initCurrentOperator({}), e.currentOperator && Object.assign(s, {
          title: e.currentOperator[e.deptFilterMap.title]
        }), e.multiple) {
          const l = M.value.findIndex((n) => n.id === s[e.deptFilterMap.id]);
          l < 0 ? M.value.push(s) : Object.assign(M.value[l], s);
        } else
          M.value.length === 0 && (M.value = [s]);
        L(!0);
      }
    }, ne = () => {
      D != null && D.value && D.value.hide(), B.value && B.value.hide();
    }, Fe = (t) => {
      (t.key === "Escape" || t.keyCode === 27) && (t.stopPropagation(), ne());
    }, W = () => {
      if (!p)
        return;
      const t = b.value.split(e.separator);
      z = Tt.calcSelItemRenderNum(t, U.value), b.value = "", re(M.value);
    }, oe = () => {
      var a;
      const t = o.value;
      if (e.model.valueType === "OBJECT")
        u.value = t ? t[e.objectNameField] : null;
      else if (e.valueType === "OBJECTS") {
        const s = wt(t) ? t : [];
        re(s), W(), h("infoTextChange", X(u.value));
        return;
      } else
        u.value = t;
      if (t == null)
        u.value = "", M.value = [], (a = e.parent.ctrl) != null && a.state.isLoaded && h("change", void 0, e.valueItem), h("blur");
      else if (e.multiple && M.value.length === 0 && e.valueItem && o.data && o.data[e.valueItem]) {
        let s = o.data[e.valueItem].split(e.separator), l = u.value.split(e.separator);
        e.isAddSymbol && (s = s.map((n) => n.slice(1, -1)), l = l.map((n) => n.slice(1, -1))), s.forEach((n, f) => {
          M.value.push({
            id: n,
            name: l[f]
          });
        });
      }
      h("infoTextChange", X(u.value));
    };
    x(() => o.value, () => {
      oe();
    }, {
      immediate: !0
    });
    const Te = q(() => o.data && o.data[e.valueItem] || void 0);
    x(Te, (t, a) => {
      t !== a && (b.value = t, t == null && (M.value = [], h("change", null)));
    }, {
      immediate: !0,
      deep: !0
    });
    const ue = (t) => {
      t ? S.value = t : setTimeout(() => {
        S.value = t;
      }, 100);
    }, Ce = (t, a) => {
      $(a);
      const s = M.value.findIndex((l) => l.id === t.id);
      if (s > -1 && M.value.splice(s, 1), e.valueItem) {
        let l = M.value.map((n) => n.id);
        e.isAddSymbol && (l = l.map((n) => "'".concat(n, "'"))), h("change", l.join(e.separator), e.valueItem);
      }
      if (e.valueType === "OBJECTS")
        L(!0);
      else {
        let l = M.value.map((n) => n.name);
        e.isAddSymbol && (l = l.map((n) => "'".concat(n, "'"))), h("change", l.join(e.separator));
      }
    }, Ie = async (t) => {
      P.value && (v.value === "user" ? m.value.unshift(t) : g.value.unshift(t)), e.clearFilter && (P.value = "");
      const a = {};
      if (Object.assign(a, t), v.value === "user") {
        Object.assign(a, {
          [e.userFilterMap.id]: a[e.userFilterMap.id] ? a[e.userFilterMap.id] : a.srfkey,
          [e.userFilterMap.name]: a[e.userFilterMap.name] ? a[e.userFilterMap.name] : a.srfmajortext
        });
        const s = M.value.findIndex((l) => l.id === a[e.userFilterMap.id]);
        s < 0 ? M.value.push({
          id: a[e.userFilterMap.id],
          name: a[e.userFilterMap.name],
          title: a[e.userFilterMap.title]
        }) : M.value.splice(s, 1);
      } else {
        Object.assign(a, {
          [e.deptFilterMap.id]: a[e.deptFilterMap.id] ? a[e.deptFilterMap.id] : a.srfkey,
          [e.deptFilterMap.name]: a[e.deptFilterMap.name] ? a[e.deptFilterMap.name] : a.srfmajortext
        });
        const s = M.value.findIndex((l) => l.id === a[e.deptFilterMap.id]);
        s < 0 ? M.value.push({
          id: a[e.deptFilterMap.id],
          name: a[e.deptFilterMap.name],
          title: a[e.deptFilterMap.title]
        }) : M.value.splice(s, 1);
      }
      if (e.multiple) {
        if (e.valueItem) {
          let s = M.value.map((l) => l.id);
          e.isAddSymbol && (s = s.map((l) => "'".concat(l, "'"))), h("change", s.join(e.separator), e.valueItem);
        }
        if (e.valueType === "OBJECTS")
          L();
        else {
          let s = M.value.map((l) => l.name);
          e.isAddSymbol && (s = s.map((l) => "'".concat(l, "'"))), h("change", s.join(e.separator));
        }
      } else {
        const s = await e.calcFillDataItems([t]);
        s.length && s.forEach((l) => {
          h("change", l.value, l.id);
        }), e.valueItem && (v.value === "user" ? h("change", a[e.userFilterMap.id], e.valueItem) : h("change", a[e.deptFilterMap.id], e.valueItem)), e.model.valueType === "OBJECT" ? h("change", e.handleObjectParams(a)) : e.valueType === "OBJECTS" ? (M.value = [Pe(a)], L()) : v.value === "user" ? h("change", t[e.userFilterMap.name]) : h("change", t[e.deptFilterMap.name]), N.value = !1;
      }
      e.valueType !== "OBJECTS" && h("blur", t), ue(!1);
    }, Oe = (t, a) => {
      t.forEach((s) => {
        const l = m.value.findIndex((n) => n[a] === s[a]);
        l > -1 ? m.value.splice(l, 1, s) : m.value.push(s);
      });
    }, O = async (t = !1) => {
      if (P.value)
        return;
      T.value = !0;
      const a = {};
      v.value === "department" ? a.page = e.deptpage : a.page = e.page;
      try {
        const s = await e.loadMore(o.data, v.value, a);
        s && (v.value === "user" ? m.value.length === 0 ? m.value = s.data : Oe(s.data, e.userFilterMap.id) : g.value.length === 0 ? g.value = s.data : g.value.push(...s.data));
      } catch (s) {
        T.value = !1;
      }
      T.value = !1;
    }, ce = (t) => {
      const {
        dataItems: a
      } = e;
      a != null && a.length && a.forEach((s) => {
        h("change", null, s.id);
      }), e.valueItem && h("change", null, e.valueItem), e.valueType === "OBJECTS" ? h("change", []) : (h("change", null), h("blur", t)), t.stopPropagation(), t.preventDefault();
    }, F = q(() => X(u.value)), j = E({}), k = /* @__PURE__ */ new Set(), xe = async (t, a = {}) => {
      if (!(j.value[t] || k.has(t))) {
        k.add(t);
        try {
          const {
            downloadUrl: s
          } = ibiz.util.file.calcFileUpDownUrl(e.context, e.params, o.data, e.editorParams);
          let l = "";
          if (ibiz.config.common.enableDownloadTicket) {
            const n = v.value === "user" ? e.userAuthEntity : e.deptAuthEntity, f = v.value === "user" ? e.userFilterMap.id : e.deptFilterMap.id, y = await ibiz.util.file.getDownloadTicket(e.context, e.params, a, {
              fileId: t
            }, {
              appEntityTag: n,
              dataFieldTag: f
            });
            y != null && y.ticket && (l = s.replace("%fileId%", y.ticket));
          } else
            l = s.replace("%fileId%", t);
          l && (j.value[t] = l);
        } catch (s) {
          ibiz.log.error(s);
        } finally {
          k.delete(t);
        }
      }
    };
    x(F, (t, a) => {
      t !== a && e.valueType !== "OBJECTS" && h("infoTextChange", t);
    }, {
      immediate: !0
    }), x(B, (t) => {
      o.autoFocus && t && (N.value = !0);
    }), x(N, (t) => {
      t === !1 && h("blur");
    });
    const de = async (t) => {
      T.value = !0;
      try {
        const a = {};
        Object.assign(a, {
          query: t,
          size: 1e3
        });
        const s = await e.getServiceData(v.value, o.data, a);
        s && (v.value === "user" ? s.data.forEach((l) => {
          Object.keys(e.userFilterMap).forEach((n) => {
            l[n] = l[e.userFilterMap[n]];
          });
        }) : s.data.forEach((l) => {
          Object.keys(e.deptFilterMap).forEach((n) => {
            l[n] = l[e.deptFilterMap[n]];
          });
        }), A.value = s.data, T.value = !1);
      } catch (a) {
        T.value = !1;
      }
    }, pe = (t) => {
      if (v.value !== t) {
        if (v.value = t, P.value) {
          de(P.value);
          return;
        }
        v.value === "user" && m.value.length === 0 && (e.resetUserState(), O()), v.value === "department" && g.value.length === 0 && (e.resetDeptState(), O());
      }
    }, Ne = (t) => {
      e.isShowNameText() || t.stopPropagation();
    }, Ue = () => {
      const t = document.documentElement;
      return t ? getComputedStyle(t).getPropertyValue("--ibiz-color-primary") : null;
    }, De = (t) => /[\u4E00-\u9FA5]/.test(t), Le = (t) => /[\u4e00-\u9fa5]+.*[a-zA-Z]+|[a-zA-Z]+.*[\u4e00-\u9fa5]+/.test(t), Z = (t) => {
      if (!t)
        return "";
      let a = 0;
      for (let I = 0; I < t.length; I++)
        if (De(t))
          a = t.charCodeAt(I) + ((a << 5) - a), a = a & a;
        else {
          const rt = t.charCodeAt(I);
          a += rt.toString(16);
        }
      const s = String(a).substring(0, 6);
      let l = parseInt(s.substring(0, 2), 16), n = parseInt(s.substring(2, 4), 16), f = parseInt(s.substring(4, 6), 16);
      l < 0 && (l = 10), n < 0 && (n = 10), f < 0 && (f = 10);
      const y = "#".concat(l.toString(16).padStart(2, "0")).concat(n.toString(16).padStart(2, "0")).concat(f.toString(16).padStart(2, "0"));
      return y === "#FFFFFF" && Ue() || y;
    }, je = (t) => {
      clearTimeout(J.value), J.value = setTimeout(() => {
        !t && t !== 0 ? O() : de(t), clearTimeout(J.value);
      }, 300);
    }, ke = () => r(C("el-input"), {
      ref: se,
      class: i.be("select-modal", "search-input"),
      placeholder: "搜索",
      modelValue: P.value,
      "onUpdate:modelValue": (t) => P.value = t,
      onInput: (t) => je(t),
      onKeydown: Fe
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
    }), Re = () => r("div", {
      class: i.be("select-modal", "select-state")
    }, [r("div", {
      class: [i.bem("select-modal", "select-state", "select-slider"), i.is("left", v.value === "user"), i.is("right", v.value !== "user")]
    }, null), r("div", {
      class: i.bem("select-modal", "select-state", "select-personel"),
      onClick: () => pe("user")
    }, [V("人员")]), r("div", {
      class: i.bem("select-modal", "select-state", "select-department"),
      onClick: () => pe("department")
    }, [V("部门")])]), Ve = (t) => {
      t.forEach((a) => {
        a.capLanguageRes && a.capLanguageRes.lanResTag && (a.caption = ibiz.i18n.t(a.capLanguageRes.lanResTag, a.caption)), a.tooltipLanguageRes && a.tooltipLanguageRes.lanResTag && (a.tooltip = ibiz.i18n.t(a.tooltipLanguageRes.lanResTag, a.tooltip));
      });
    }, Be = async (t, a) => {
      await e.onActionClick(t, [o.data], a);
    }, ze = (t) => r("div", {
      class: i.bem("select-modal", "actions", "item"),
      title: t.tooltip || t.caption,
      onClick: (a) => Be(t, a)
    }, [t.showIcon && t.sysImage && r(C("iBizIcon"), {
      icon: t.sysImage
    }, null)]), $e = () => {
      var a;
      const t = ((a = e.model.uiactionGroup) == null ? void 0 : a.uiactionGroupDetails) || [];
      return Ve(t), r("div", {
        class: i.be("select-modal", "actions")
      }, [t.map((s) => ze(s))]);
    }, _e = () => {
      var a;
      const t = ((a = e.model.uiactionGroup) == null ? void 0 : a.uiactionGroupDetails) || [];
      return !e.isShowTab && t.length === 0 ? null : r("div", {
        class: [i.be("select-modal", "select"), i.is("no-solider-tab", !e.isShowTab && t.length > 0)]
      }, [e.isShowTab ? Re() : null, $e()]);
    }, He = (t) => {
      if (e.multiple) {
        let a = -1;
        if (b.value) {
          let s = b.value.split(e.separator);
          e.isAddSymbol && (s = s.map((l) => l.slice(1, -1))), a = s.findIndex((l) => l === t);
        }
        return e.enableBottomButton && (a = M.value.findIndex((s) => s.id === t)), a > -1 ? r("div", {
          class: i.bem("select-modal", "personel-list", "icon")
        }, [r("i", {
          class: "fa fa-check",
          "aria-hidden": "true"
        }, null)]) : null;
      } else
        return b.value === t ? r("div", {
          class: i.bem("select-modal", "personel-list", "icon")
        }, [r("i", {
          class: "fa fa-check",
          "aria-hidden": "true"
        }, null)]) : null;
    }, Je = (t) => {
      if (t && t.toString().length < 2)
        return t;
      if (t && t.toString().length >= 2) {
        if (Le(t)) {
          const n = t.split("").find((y) => /[a-zA-Z]/.test(y)) || "", f = t.split("").find((y) => /[\u4E00-\u9FA5]/.test(y)) || "";
          return "".concat(n).concat(f).toLowerCase();
        }
        return /[a-zA-Z]/.test(t) ? t.split("").filter((n) => /[a-zA-Z]/.test(n)).slice(0, 2).join("").toUpperCase() : /[\u4E00-\u9FA5]/.test(t) ? t.split("").filter((n) => /[\u4E00-\u9FA5]/.test(n)).slice(-2).join("") : t.replaceAll(" ", "").substring(0, 2);
      }
    }, We = (t) => {
      ie.value.push(t);
    }, Ze = (t, a) => {
      if (!t)
        return null;
      let s = "";
      if (we(t))
        s = t;
      else {
        let l = [];
        try {
          l = JSON.parse(t);
        } catch (f) {
          console.error("解析头像数据失败", f);
        }
        if (l.length === 0)
          return null;
        const n = l[0].id;
        if (s = j.value[n], !s)
          return xe(n, a), null;
      }
      return r("img", {
        class: i.bem("select-modal", "personel-list", "avatar"),
        src: s,
        onError: () => We(t),
        alt: ""
      }, null);
    }, K = (t, a, s) => {
      const n = s && (v.value === "user" ? s[e.userFilterMap.avatar] : s[e.deptFilterMap.avatar]) || e.getUserPictureUrl(t, a), f = Ze(n, s);
      return n && !ie.value.includes(n) && f ? f : Je(a);
    }, he = (t) => {
      const a = v.value === "user" ? t[e.userFilterMap.name] || t.name : t[e.deptFilterMap.name] || t.name, s = v.value === "user" ? t[e.userFilterMap.id] : t[e.deptFilterMap.id], l = v.value === "user" ? t[e.userFilterMap.title] : t[e.deptFilterMap.title];
      return r("div", {
        class: [i.bem("select-modal", "personel-list", "item"), i.is("selected", b.value === s)],
        onClick: () => Ie(t)
      }, [r("div", {
        class: i.bem("select-modal", "personel-list", "text")
      }, [r("div", {
        class: i.bem("select-modal", "personel-list", "text-img"),
        style: "background-color:".concat(Z(a))
      }, [K(s, a, t)]), r("div", {
        class: i.bem("select-modal", "personel-list", "text-label")
      }, [a]), l && r("div", {
        class: i.bem("select-modal", "personel-list", "title-label")
      }, [l]), e.suffix && r("div", {
        class: i.bem("select-modal", "personel-list", "title-label")
      }, [t[e.suffix]]), s === e.context.srfuserid ? r("div", {
        class: i.bem("select-modal", "personel-list", "myself")
      }, [V("我自己")]) : null]), He(s)]);
    }, Ke = (t, a) => {
      const {
        context: s,
        params: l
      } = e;
      return r(C("iBizControlShell"), {
        class: i.b("panel-item"),
        data: t,
        modelData: a,
        context: s,
        params: l
      }, null);
    }, Ge = (t, a) => {
      const s = E();
      return r(C("el-popover"), {
        ref: s,
        target: "hover",
        placement: "right",
        offset: 24,
        width: "auto",
        onShow: (l) => {
          D = s;
        }
      }, {
        reference: () => he(t),
        default: () => Ke(t, a)
      });
    }, Xe = (t) => P.value ? A.value : t, $ = (t) => {
      t.stopPropagation();
    }, Ye = (t, a) => {
      H.value && (v.value === "user" ? t - a < 305 && (T.value || O()) : t - a < 250 && (T.value || O()));
    }, qe = () => {
      M.value = [], N.value = !1, oe();
    }, Qe = () => {
      L(!0), N.value = !1;
    }, et = () => {
      let t, a;
      if (e.enableBottomButton)
        return r("div", {
          class: i.be("select-modal", "bottom")
        }, [r(C("el-button"), {
          type: "text",
          onClick: qe
        }, Q(t = ibiz.i18n.t("app.cancel")) ? t : {
          default: () => [t]
        }), r(C("el-button"), {
          onClick: Qe
        }, Q(a = ibiz.i18n.t("app.confirm")) ? a : {
          default: () => [a]
        })]);
    }, me = (t) => {
      var n, f;
      const a = ((n = e.model.uiactionGroup) == null ? void 0 : n.uiactionGroupDetails) || [], s = Xe(t), l = (f = e.deACMode) == null ? void 0 : f.itemLayoutPanel;
      return r(Ft, {
        items: s,
        itemHeight: 36,
        class: [i.be("select-modal", "personel-list"), i.be("select-modal", "personel-list-".concat(v.value)), i.is("no-solider-tab", !e.isShowTab && a.length > 0)],
        onScrollEvent: (y, I) => Ye(y, I)
      }, {
        default: (y) => l ? Ge(y, l) : he(y)
      });
    }, fe = (t) => {
      w.value = t;
    }, tt = () => r("div", {
      class: i.be("select-modal", "deptpersonel")
    }, [r("div", {
      class: i.bem("select-modal", "deptpersonel", "dept")
    }, [r("div", {
      class: "collpase-icon"
    }, [w.value ? r("i", {
      class: "fa fa-angle-right",
      "aria-hidden": "true",
      onClick: () => fe(!1)
    }, null) : r("i", {
      class: "fa fa-angle-down",
      "aria-hidden": "true",
      onClick: () => fe(!0)
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
    }, null)])]), r("span", null, ["".concat(e.context.srfusername, "的团队")]), r("span", null, [V("·")]), r("span", null, [e.depttotal])]), w.value ? null : r("div", {
      class: i.bem("select-modal", "deptpersonel", "dept-person")
    }, [me(g.value)])]), at = () => Mt(r("div", {
      class: i.b("select-modal"),
      onPointerdown: $,
      onPointerup: $,
      onClick: $
    }, [ke(), _e(), r("div", {
      class: i.be("select-modal", "container"),
      style: {
        height: "".concat(le.value, "px")
      }
    }, [v.value === "user" ? me(m.value) : tt()]), et()]), [[Et("loading"), T.value]]), G = (t = !0) => r("div", {
      class: [i.b("no-select-value"), i.is("readonly", o.readonly || o.disabled)]
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
    }, null)])]), t ? r("span", null, [e.placeHolder || "未设置"]) : null]), ve = () => {
      const t = e.isShowNameTip();
      if (e.multiple) {
        let a = !1;
        const s = [];
        if (b.value) {
          let l = b.value.split(e.separator), n = F.value.split(e.separator);
          e.isAddSymbol && (l = l.map((f) => f.slice(1, -1))), e.isAddSymbol && (n = n.map((f) => f.slice(1, -1))), l.forEach((f, y) => {
            s.push({
              id: f,
              name: n[y]
            });
          });
        } else
          F.value === "当前用户" && o.disabled && s.push({
            id: F.value,
            name: F.value
          });
        return p && z > -1 && (a = z < s.length, s.splice(z, s.length)), r("div", {
          class: [i.b("select-value-multiple"), i.is("readonly", o.readonly || o.disabled), a ? i.be("select-value-multiple", "hidden") : ""]
        }, [s == null ? void 0 : s.map((l) => {
          let n;
          return r("div", {
            class: i.be("select-value-multiple", "item"),
            title: t ? l.name : ""
          }, [r("div", {
            class: [i.be("select-value", "textimg"), i.bem("select-value-multiple", "item", "textimg")],
            style: "background-color:".concat(Z(l.name))
          }, [r(C("el-tooltip"), {
            class: "box-item",
            effect: "dark",
            content: l.name,
            placement: "top",
            offset: 12
          }, Q(n = K(l.id, l.name, l)) ? n : {
            default: () => [n]
          }), o.readonly || o.disabled ? null : r("div", {
            class: [i.bem("select-value-multiple", "item", "close")],
            onClick: (f) => Ce(l, f)
          }, [r("i", {
            class: "fa fa-close",
            "aria-hidden": "true"
          }, null)])])]);
        }), a ? r(C("el-tooltip"), {
          class: c.b("multiple-ellipsis"),
          "popper-class": c.be("multiple-ellipsis", "popper"),
          effect: "dark",
          content: F.value,
          placement: "top",
          offset: 12
        }, {
          default: () => [r("div", {
            class: c.be("multiple-ellipsis", "default")
          }, [V("···")])]
        }) : null, G(!1)]);
      }
      return r("div", {
        class: [i.b("select-value"), i.is("readonly", o.readonly || o.disabled)],
        title: t ? F.value : ""
      }, [r("div", {
        class: i.be("select-value", "textimg"),
        style: "background-color:".concat(Z(F.value))
      }, [K(b.value, F.value)]), r("div", {
        class: i.be("select-value", "text")
      }, [r("div", {
        class: i.bem("select-value", "text", "label")
      }, [F.value])]), o.readonly || o.disabled ? null : r("i", {
        class: ["fa fa-times-circle", i.be("select-value", "close")],
        "aria-hidden": "true",
        onClick: (a) => ce(a)
      }, null)]);
    }, st = async () => {
      var n, f;
      H.value = !0, h("focus");
      const {
        context: t,
        params: a
      } = e.handlePublicParams(o.data, e.context, e.params), s = e.fill(e.userUrl, t, a, o.data).replaceAll("//", "/"), l = e.fill(e.deptUrl, t, a, o.data).replaceAll("//", "/");
      (s !== e.copyUserUrl || l !== e.copyDeptUrl || o.data && o.data.srfkey !== ae.value) && (ae.value = ((n = o.data) == null ? void 0 : n.srfkey) || "", m.value = [], g.value = [], e.resetState(), O(!0)), await yt(), (f = se.value) == null || f.focus();
    }, it = () => F.value ? ve() : G(), lt = () => {
      P.value = "", H.value = !1, j.value = {}, k.clear();
    };
    x(() => o.readonly, (t) => {
      t && ne();
    }, {
      deep: !0
    });
    let R;
    return Ee(() => {
      Ae(), W(), U.value && (R = new ResizeObserver(() => W()), R.observe(U.value));
    }), gt(() => {
      e.resetState(), R == null || R.disconnect(), j.value = {}, k.clear();
    }), {
      c: e,
      ns: i,
      ns2: c,
      items: m,
      loading: T,
      refValue: b,
      curValue: u,
      valueText: F,
      isEditable: S,
      popoverRef: B,
      modelVisible: N,
      personelSelRef: U,
      showFormDefaultContent: ye,
      load: O,
      onClear: ce,
      onPopShow: st,
      onPageHide: lt,
      calcHeight: Se,
      handleClick: Ne,
      setEditable: ue,
      renderDropModal: at,
      renderReadState: it,
      renderSelectInput: ve,
      renderNoSelectValue: G
    };
  },
  render() {
    const o = r(C("el-popover"), bt({
      ref: "popoverRef",
      visible: this.modelVisible,
      "onUpdate:visible": (h) => this.modelVisible = h,
      trigger: "click",
      popperClass: this.ns.b("person-select"),
      width: 320,
      teleported: !0,
      onShow: () => this.onPopShow(),
      onHide: () => this.onPageHide(),
      onBeforeEnter: () => this.calcHeight()
    }, this.$attrs), {
      reference: () => this.renderReadState(),
      default: () => this.renderDropModal()
    });
    return r("div", {
      ref: "personelSelRef",
      class: [this.ns.b(), this.ns2.b(), this.ns.b("person-value"), this.disabled ? this.ns.m("disabled") : "", this.readonly ? this.ns.m("readonly") : "", this.c.isShowNameText() ? "" : this.ns.m("only-icon"), this.ns.is("editable", this.isEditable), this.ns.is("show-default", this.showFormDefaultContent), this.ns2.is("multiple", this.c.multiple)],
      onClick: this.handleClick
    }, [this.readonly || this.disabled ? this.renderReadState() : o]);
  }
}), Ct = dt(
  ee,
  function(o) {
    o.component(ee.name, ee), ft(
      "EDITOR_CUSTOMSTYLE_PERSON_SELECT",
      () => new At()
    );
  }
), kt = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(o) {
    o.use(Ct);
  }
};
export {
  Ct as IBizPersonelSelect,
  kt as default
};
