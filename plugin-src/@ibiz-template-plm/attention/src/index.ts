import './style.css';
var dt = Object.defineProperty;
var pt = (o, m, r) => m in o ? dt(o, m, { enumerable: !0, configurable: !0, writable: !0, value: r }) : o[m] = r;
var h = (o, m, r) => (pt(o, typeof m != "symbol" ? m + "" : m, r), r);
import { useNamespace as le, getDataPickerProps as ht, getEditorEmits as mt, renderString as ft, withInstall as vt } from "@ibiz-template/vue3-util";
import { EditorController as gt, getDeACMode as bt, UIActionUtil as Mt, OpenAppViewCommand as Ee, registerEditorProvider as yt } from "@ibiz-template/runtime";
import { RuntimeModelError as te } from "@ibiz-template/core";
import { mergeDeepLeft as wt, clone as ie } from "ramda";
import { notNilEmpty as G } from "qx-util";
import { defineComponent as ne, ref as b, onMounted as Fe, watch as _, createVNode as l, computed as k, onUnmounted as Et, resolveComponent as O, onBeforeUnmount as Ft, withDirectives as Ct, resolveDirective as At, createTextVNode as V, nextTick as It, mergeProps as St, isVNode as Pt } from "vue";
import { isArray as Ot } from "lodash-es";
class Ce extends gt {
  constructor() {
    super(...arguments);
    /**
     * 云系统操作者Map
     *
     * @memberof AttentionController
     */
    h(this, "operatorMap", /* @__PURE__ */ new Map());
    /**
     * 当前操作者数据
     */
    h(this, "currentOperator");
    /**
     * 总数
     */
    h(this, "total", 0);
    /**
     * 当前人员数量
     */
    h(this, "currentNumber", -1);
    /**
     * 人员当前页
     */
    h(this, "page", 0);
    /**
     * 部门人员数据页数
     */
    h(this, "deptpage", 0);
    /**
     * 当前部门人员数量
     */
    h(this, "deptcurrentNumber", -1);
    /**
     * 部门人员总数
     */
    h(this, "depttotal", 0);
    /**
     * 每页数量
     */
    h(this, "size", 20);
    /**
     * 是否多选
     */
    h(this, "multiple", !0);
    /**
     * 多选时拼接的字符串
     */
    h(this, "separator", ",");
    /**
     *选择视图相关参数
     */
    h(this, "pickupView", null);
    /**
     *链接视图相关参数
     */
    h(this, "linkView", null);
    /**
     * 人员UI转化
     */
    h(this, "userFilterMap", {
      id: "id",
      name: "name",
      title: "title",
      avatar: ""
    });
    /**
     * 部门人员UI转化
     */
    h(this, "deptFilterMap", {
      id: "id",
      name: "name",
      title: "title",
      avatar: ""
    });
    /**
     *值项
     */
    h(this, "valueItem", "");
    /**
     * 主键属性名称
     */
    h(this, "keyName", "srfkey");
    /**
     * 主文本属性名称
     */
    h(this, "textName", "srfmajortext");
    /**
     * 数据集codeName
     */
    h(this, "interfaceName", "");
    /**
     * 自填模式sort排序
     */
    h(this, "sort", "");
    /**
     * 不支持AC（根据编辑器类型得）
     */
    h(this, "noAC", !1);
    /**
     * 不支持按钮（根据编辑器类型得）
     */
    h(this, "noButton", !1);
    /**
     * 实体自填模式模型
     */
    h(this, "deACMode");
    /**
     * 自填数据项集合（已排除了value和text)
     */
    h(this, "dataItems", []);
    // 对象标识属性
    h(this, "objectIdField", "");
    // 对象名称属性
    h(this, "objectNameField", "");
    // 对象值属性
    h(this, "objectValueField", "");
    // 人员请求地址
    h(this, "userUrl", "");
    // 部门请求地址
    h(this, "deptUrl", "");
    // 复制人员请求url,这是用来保证当配置的URL中的动态参数变化后可以刷新当前请求状态
    h(this, "copyUserUrl", "");
    // 复制部门人员请求url
    h(this, "copyDeptUrl", "");
    // 人员请求方式
    h(this, "userMethod", "post");
    // 部门人员请求方式
    h(this, "deptMethod", "post");
    /**
     * 上下文替换正则
     *
     */
    h(this, "contextReg", /\$\{context.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g);
    /**
     * 数据替换正则
     *
     */
    h(this, "dataReg", /\$\{data.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g);
    /**
     * 参数替换正则
     *
     */
    h(this, "paramsReg", /\$\{params.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g);
    /**
     * 值类型
     */
    h(this, "valueType", "OBJECTS");
    /**
     * 代码表的代码标识
     *
     */
    h(this, "codeListId", "");
    /**
     * 代码表值映射
     *
     */
    h(this, "codeListMap");
    /**
     * 关注类型属性
     *
     */
    h(this, "attentionTypeField", "type");
    /**
     * 自填充映射
     */
    h(this, "selfFillMap", {
      user_id: "user_id",
      user_name: "name",
      user_title: "title"
    });
    /**
     * 默认选中项
     *
     */
    h(this, "defaultSelected", "");
    /**
     * 选中后默认关注值
     *
     */
    h(this, "defaultAttentionValue", "");
    /**
     * 启用确认按钮
     */
    h(this, "enableBottomButton", !1);
    /**
     * 额外抛值字段映射
     */
    h(this, "fieldMap", "");
    /**
     * 人员头像文件权限归属实体
     */
    h(this, "userAuthEntity", "");
    /**
     * 部门头像文件权限归属实体
     */
    h(this, "deptAuthEntity", "");
  }
  async onInit() {
    var i, e, d, c, f, v, E;
    if (super.onInit(), this.initParams(), await this.getOperatorUserList(), this.valueItem = ((i = this.model.valueItemName) == null ? void 0 : i.toLowerCase()) || "", this.model.appDataEntityId && (this.model.appDEDataSetId && (this.interfaceName = this.model.appDEDataSetId), this.model.appDEACModeId && (this.deACMode = await bt(
      this.model.appDEACModeId,
      this.model.appDataEntityId,
      this.context.srfappid
    ), this.deACMode))) {
      const { minorSortAppDEFieldId: F, minorSortDir: w } = this.deACMode;
      F && w && (this.sort = "".concat(F.toLowerCase(), ",").concat(w.toLowerCase())), this.deACMode.textAppDEFieldId && (this.textName = this.deACMode.textAppDEFieldId), this.deACMode.valueAppDEFieldId && (this.keyName = this.deACMode.valueAppDEFieldId), this.deACMode.deacmodeDataItems && (this.dataItems = [], this.deACMode.deacmodeDataItems.forEach(
        (C) => {
          C.id !== "value" && C.id !== "text" && this.dataItems.push(C);
        }
      ));
    }
    const r = [
      "PICKEREX_DROPDOWNVIEW",
      "PICKEREX_DROPDOWNVIEW_LINK",
      "PICKUPVIEW"
    ];
    this.model.editorType && r.includes(this.model.editorType) && this.initPickupViewParams(), this.objectIdField = (d = (e = this.model) == null ? void 0 : e.objectIdField) == null ? void 0 : d.toLowerCase(), this.objectNameField = (f = (c = this.model) == null ? void 0 : c.objectNameField) == null ? void 0 : f.toLowerCase(), this.objectValueField = (E = (v = this.model) == null ? void 0 : v.objectValueField) == null ? void 0 : E.toLowerCase();
  }
  /**
   * 初始化noAc和noButton
   */
  initParams() {
    var r, i, e, d, c, f, v, E, F, w, C, g;
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
    if (this.userUrl = this.editorParams.URL, this.deptUrl = this.editorParams.DEPTURL, this.userMethod = this.editorParams.USERMETHOD || "post", this.deptMethod = this.editorParams.DEPTMETHOD || "post", this.separator = this.editorParams.SEPARATOR || ",", (r = this.editorParams) != null && r.CODELISTID && (this.codeListId = (i = this.editorParams) == null ? void 0 : i.CODELISTID), (e = this.editorParams) != null && e.DEFAULTATNVALUE && (this.defaultAttentionValue = (d = this.editorParams) == null ? void 0 : d.DEFAULTATNVALUE), (c = this.editorParams) != null && c.VALUETYPE && (this.valueType = (f = this.editorParams) == null ? void 0 : f.VALUETYPE), (v = this.editorParams) != null && v.ENABLEBOTTOMBUTTON && (this.enableBottomButton = ((E = this.editorParams) == null ? void 0 : E.ENABLEBOTTOMBUTTON) === "true"), (F = this.editorParams) != null && F.FIELDMAP && (this.fieldMap = (w = this.editorParams) == null ? void 0 : w.FIELDMAP), this.editorParams.userauthentity && (this.userAuthEntity = this.editorParams.userauthentity), this.editorParams.deptauthentity && (this.deptAuthEntity = this.editorParams.deptauthentity), this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, "CODELISTMAP"))
      try {
        const p = JSON.parse((C = this.editorParams) == null ? void 0 : C.CODELISTMAP);
        Object.assign(this.codeListMap, p);
      } catch (p) {
        this.codeListMap = { FOLLOWED: [20, 30, 40], NOTFOLLOWING: [10] };
      }
    if (this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, "SELFFILLMAP"))
      try {
        const p = JSON.parse((g = this.editorParams) == null ? void 0 : g.SELFFILLMAP);
        Object.assign(this.selfFillMap, p);
      } catch (p) {
        this.selfFillMap = {
          user_id: "user_id",
          user_name: "name",
          user_title: "title"
        };
      }
    if (this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, "USERMAP"))
      try {
        const p = JSON.parse(this.editorParams.USERMAP);
        Object.assign(this.userFilterMap, p);
      } catch (p) {
        this.userFilterMap = {
          id: "id",
          name: "name",
          title: "title",
          avatar: ""
        };
      }
    if (this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, "DEPTMAP"))
      try {
        const p = JSON.parse(this.editorParams.DEPTMAP);
        Object.assign(this.deptFilterMap, p);
      } catch (p) {
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
  async initCurrentOperator(r, i) {
    const e = this.context.srfuserid;
    if (!e)
      return;
    const d = await this.getServiceData(
      "department",
      r,
      {},
      {
        ...i,
        page: 0,
        size: 20,
        n_id_eq: e
      }
    );
    d && d.data && d.data.length > 0 && (this.currentOperator = d.data.find(
      (c) => c[this.deptFilterMap.id] === e
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
  async loadMore(r, i, e = {}) {
    if (i === "user" && this.currentNumber < this.total) {
      const d = await this.getServiceData(i, r, e);
      if (d)
        return this.page += 1, this.currentNumber < 0 && (this.currentNumber += 1), this.currentNumber += this.size, this.total = d.total ? Number(d.total) : Number(d.headers["x-total"]), d.data.forEach((c) => {
          Object.keys(this.userFilterMap).forEach((f) => {
            c[f] = c[this.userFilterMap[f]];
          });
        }), d;
    } else if (i === "department" && this.deptcurrentNumber < this.depttotal) {
      const d = await this.getServiceData(i, r, e);
      if (d)
        return this.deptpage += 1, this.deptcurrentNumber < 0 && (this.deptcurrentNumber += 1), this.deptcurrentNumber += this.size, this.depttotal = d.total ? Number(d.total) : Number(d.headers["x-total"]), d.data.forEach((c) => {
          Object.keys(this.deptFilterMap).forEach((f) => {
            c[f] = c[this.deptFilterMap[f]];
          });
        }), d;
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
  async onActionClick(r, i, e) {
    const d = r.uiactionId;
    await Mt.execAndResolved(
      d,
      {
        context: this.context,
        params: this.params,
        data: i,
        view: this.parent.form.ctx.view,
        event: e
      },
      r.appId
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
  fill(r, i, e, d) {
    if (G(r)) {
      if (G(i)) {
        const c = r.match(this.contextReg);
        c == null || c.forEach((f) => {
          const v = f.slice(10, f.length - 1);
          r = r.replace("${context.".concat(v, "}"), i[v] || "");
        });
      }
      if (G(e)) {
        const c = r.match(this.paramsReg);
        c == null || c.forEach((f) => {
          const v = f.slice(9, f.length - 1);
          r = r.replace("${params.".concat(v, "}"), e[v] || "");
        });
      }
      if (G(d)) {
        const c = r.match(this.dataReg);
        c == null || c.forEach((f) => {
          const v = f.slice(7, f.length - 1);
          r = r.replace("${data.".concat(v, "}"), d[v] || "");
        });
      }
    }
    return r;
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
  async getServiceData(r, i, e, d) {
    const { context: c, params: f } = this.handlePublicParams(
      i,
      this.context,
      this.params
    ), v = {};
    this.sort && !Object.is(this.sort, "") && Object.assign(v, { sort: this.sort }), Object.assign(v, { size: this.size }), e && Object.assign(v, e);
    const E = d || wt(f, v);
    let F = "";
    const w = this.fill(this.userUrl, c, f, i).replaceAll(
      "//",
      "/"
    ), C = this.fill(this.deptUrl, c, f, i).replaceAll(
      "//",
      "/"
    );
    this.copyUserUrl = w, this.copyDeptUrl = C;
    let g = "post";
    const p = {};
    if (r === "user" ? (F = w, g = this.userMethod.toLowerCase(), Object.assign(p, { method: g, data: E })) : (F = C, g = this.deptMethod.toLowerCase(), Object.assign(p, { method: g, params: E })), F)
      return await ibiz.net.request(F, p);
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
  async openPickUpView(r, i) {
    await this.initPickupViewParams();
    const { context: e, params: d } = this.handlePublicParams(
      r,
      this.context,
      this.params
    );
    if (i && (d.selectedData = i), !this.pickupView)
      throw new te(this.model, "请配置数据选择视图");
    const c = await ibiz.commands.execute(
      Ee.TAG,
      this.pickupView.id,
      e,
      d,
      { openMode: "POPUPMODAL" }
    );
    if (c && c.ok && c.data)
      return c.data;
    ibiz.log.debug("模态取消或关闭异常", c);
  }
  /**
   * 打开数据链接视图
   */
  async openLinkView(r) {
    const i = this.context.clone();
    r[this.valueItem] && (i.srfkey = r[this.valueItem]);
    const { context: e, params: d } = this.handlePublicParams(
      r,
      i,
      this.params
    ), { linkAppViewId: c } = this.model;
    if (!c)
      throw new te(this.model, "请配置数据链接视图");
    return ibiz.commands.execute(
      Ee.TAG,
      c,
      e,
      d
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
  async calcFillDataItems(r) {
    return this.deACMode ? this.dataItems.length === 0 ? [] : await Promise.all(
      this.dataItems.map((e) => {
        const c = r.map((f) => f[e.appDEFieldId]).join(this.separator);
        return e.format || e.convertToCodeItemText && e.codeListId || e.customCode, { id: e.id, value: c };
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
  handleObjectParams(r) {
    const i = {};
    return this.objectIdField && Object.assign(i, {
      [this.objectIdField]: r[this.keyName]
    }), this.objectNameField && Object.assign(i, {
      [this.objectNameField]: r[this.textName]
    }), this.objectValueField && Object.assign(i, {
      [this.objectValueField]: ie(r)
    }), i;
  }
  /**
   * 获取操作用户列表
   *
   * @return {*}  {Promise<void>}
   * @memberof AttentionController
   */
  async getOperatorUserList() {
    const r = await ibiz.hub.getApp(this.context.srfappid);
    let i = [];
    i = await r.codeList.get(
      "SysOperator",
      this.context,
      this.params
    ), this.operatorMap = new Map(
      i.map((e) => [e.value, e])
    );
  }
  /**
   * 动态匹配${}
   *
   * @param {string} str
   * @param {Record<string, IData>} values
   * @return {*}  {string}
   */
  dynamicMatch(r, i) {
    return r.replace(/\${(.*?)}/g, (e, d) => {
      const [c, f] = d.split("."), v = i[c];
      return v && v[f] || "";
    });
  }
  /**
   * 获取人员头像路径
   *
   * @return {*}  {string}
   * @memberof AttentionController
   */
  getUserPictureUrl(r, i) {
    if (this.operatorMap.size <= 0)
      return "";
    let e = {};
    return this.operatorMap.get(r) ? e = this.operatorMap.get(r) : Array.from(this.operatorMap.entries()).find((d) => {
      const c = d[1] || {};
      return c.text && i && c.text === i ? (e = c, !0) : !1;
    }), e.data && e.data.iconurl ? e.data.iconurl : "";
  }
}
class Tt {
  constructor() {
    h(this, "component", "IBizAttention");
    h(this, "formEditor", "IBizAttention");
    h(this, "gridEditor", "IBizAttention");
  }
  async createController(m, r) {
    const i = new Ce(m, r);
    return await i.init(), i;
  }
}
const xt = /* @__PURE__ */ ne({
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
  setup(o, {
    emit: m
  }) {
    const r = le("virtual-list-box"), i = b(36), e = b(), d = b([]), c = b(0), f = b(0), v = b(0), E = b(0), F = (g, p) => {
      m("scrollEvent", g, p);
    }, w = () => {
      f.value = Math.floor(E.value / o.itemHeight), v.value = f.value + o.showNum, d.value = o.items.slice(f.value, v.value);
      const g = E.value - E.value % o.itemHeight;
      c.value = g;
    }, C = () => {
      E.value = e.value.scrollTop, w(), F(i.value, E.value);
    };
    return Fe(() => {
      setTimeout(() => {
        scroll();
      }, 1e3);
    }), _(() => o.items, () => {
      i.value = o.itemHeight * o.items.length, w();
    }, {
      immediate: !0,
      deep: !0
    }), {
      ns: r,
      contentHeight: i,
      showList: d,
      contentBox: e,
      top: c,
      onScroll: C
    };
  },
  render() {
    return l("div", {
      ref: "contentBox",
      class: this.ns.b(),
      onScroll: () => this.onScroll()
    }, [l("div", {
      class: this.ns.e("container"),
      style: "height:".concat(this.contentHeight, "px;")
    }, [l("div", {
      class: this.ns.e("content"),
      style: "top:".concat(this.top, "px;")
    }, [this.showList.map((o, m) => l("div", {
      key: m,
      class: this.ns.m("item")
    }, [this.$slots.default ? this.$slots.default({
      ...o,
      index: m
    }) : o.name]))])])]);
  }
});
const Lt = /* @__PURE__ */ ne({
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
      type: Ce,
      required: !0
    },
    defaultSelected: {
      type: String
    }
  },
  emits: {
    /** 值变更事件 */
    change: (o, m) => !0,
    /** 失焦事件 */
    blur: (o) => !0,
    /** 聚焦事件 */
    focus: (o) => !0,
    /** 回车事件 */
    enter: (o) => !0,
    /** 信息文本变更事件 */
    infoTextChange: (o) => !0
  },
  setup(o, {
    emit: m
  }) {
    const r = le("follow"), i = o.controller, e = b(), d = b(!1), c = b(!1), f = b(), v = b(!1), E = b(!1), F = b(null), w = b(!1), C = b([]), g = k(() => o.codeListMap || {}), p = k(() => ({})), j = async () => {
      if (v.value = !0, o.codeListId) {
        const I = await ibiz.hub.getApp(i.context.srfappid).codeList.get(o.codeListId, i.context, i.params);
        I && I.length > 0 && (C.value = I), d.value = !0;
      }
      v.value = !1;
    }, P = (M) => {
      var S, x;
      F.value = M, ((x = (S = g.value) == null ? void 0 : S.FOLLOWED) == null ? void 0 : x.find((R) => String(R) === String(M))) ? E.value = !0 : E.value = !1;
    };
    _(
      () => o.value,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (M, I) => {
        var x;
        let S = M;
        !M && o.codeListMap && (S = ((x = g.value) == null ? void 0 : x.NOTFOLLOWING[0]) || ""), P(S);
      },
      {
        immediate: !0,
        deep: !0
      }
    );
    const U = (M) => {
      M ? c.value = M : setTimeout(() => {
        c.value = M;
      }, 100);
    }, T = k({
      get() {
        var M;
        return (M = o.value) == null ? void 0 : M.toString();
      },
      set(M) {
        m("change", M), U(!1);
      }
    }), $ = k(() => {
      const M = Array.isArray(T.value) ? T.value : [T.value], I = C.value, S = [];
      return M.forEach((x) => {
        I.forEach((R) => {
          R.value === x && S.push(R.text);
        });
      }), S.join(",");
    });
    _($, (M, I) => {
      M !== I && m("infoTextChange", M);
    }, {
      immediate: !0
    });
    const D = (M) => C.value.find((S) => S.text === M), Z = async (M) => {
      w.value = M, M && !d.value && await j();
    }, N = (M) => {
      F.value = M.value, P(M.value), m("change", M.value);
    }, H = (M) => {
      var I;
      (M.key === "Escape" || M.keyCode === 27) && (M.stopPropagation(), (I = e.value) == null || I.handleClose());
    };
    return Et(() => {
    }), {
      ns: r,
      curValue: T,
      items: C,
      valueText: $,
      editorRef: f,
      cssVars: p,
      isEditable: c,
      isLoading: v,
      followState: E,
      selectd: F,
      showState: w,
      dropdownRef: e,
      setEditable: U,
      getCodeListItem: D,
      onShowChange: Z,
      onItemClick: N,
      handleKeyDown: H
    };
  },
  render() {
    const o = l("div", {
      class: [this.ns.e("showcase"), this.showState ? "is-active" : ""]
    }, [l("span", {
      class: this.ns.em("showcase", "icon")
    }, [l("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      focusable: "false"
    }, [l("g", {
      id: "follow/with/interest",
      "stroke-width": "1",
      "fill-rule": "evenodd"
    }, [l("path", {
      d: "M8 3.4c2.823 0 5.04 1.367 7.38 3.637a2.037 2.037 0 0 1 0 2.925C13.04 12.232 10.824 13.6 8 13.6c-2.823 0-5.032-1.364-7.376-3.637a2.037 2.037 0 0 1 0-2.925C2.967 4.764 5.176 3.4 8 3.4zm0 1.2c-2.417 0-4.405 1.228-6.542 3.3a.837.837 0 0 0 0 1.2C3.596 11.173 5.584 12.4 8 12.4s4.413-1.231 6.546-3.3a.837.837 0 0 0 0-1.2C12.412 5.83 10.415 4.6 8 4.6zM8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0-1.2a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6z",
      id: "attention",
      fill: "currentColor"
    }, null)])])]), l("span", {
      class: this.ns.em("showcase", "text")
    }, [this.followState ? "已关注" : "未关注"])]), m = l(O("el-dropdown"), {
      "popper-class": this.ns.b("popover"),
      ref: (r) => {
        this.dropdownRef = r;
      },
      trigger: "click",
      placement: "top-start",
      onVisibleChange: this.onShowChange,
      onKeydown: (r) => {
        this.handleKeyDown(r);
      }
    }, {
      default: () => o,
      dropdown: () => l(O("el-dropdown-menu"), {
        class: this.ns.be("popper", "dropdown-menu")
      }, {
        default: () => this.items.map((r, i) => l(O("el-dropdown-item"), {
          onClick: () => this.onItemClick(r)
        }, {
          default: () => [l("div", {
            class: [this.ns.b("content"), String(this.selectd) === String(r.value) ? "is-active" : ""]
          }, [l("div", {
            class: this.ns.em("item", "text")
          }, [r.text]), l("div", {
            class: this.ns.em("item", "tooltip")
          }, [r.tooltip])]), i === this.items.length - 1 ? null : l("div", {
            class: this.ns.em("item", "divider")
          }, [l(O("el-divider"), null, null)])]
        }))
      })
    });
    return l("div", {
      class: [this.ns.b(), this.disabled ? this.ns.m("disabled") : "", this.readonly ? this.ns.m("readonly") : "", this.ns.is("editable", this.isEditable)],
      style: this.cssVars
    }, [this.readonly ? o : m]);
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
  static calcSelItemRenderNum(m, r) {
    let i = 0;
    if (r && (m == null ? void 0 : m.length) > 0) {
      const e = (r == null ? void 0 : r.offsetWidth) || 0, d = window.getComputedStyle(r), c = parseInt(d.marginLeft, 10), f = parseInt(d.marginRight, 10), v = parseInt(d.paddingLeft, 10), E = parseInt(d.paddingRight, 10), F = c + f + v + E, w = 70, C = 33, g = 28, p = 8, j = (g + p) * m.length;
      e - F - w - C - j < 0 && (i = Math.floor(
        (e - F - w - C) / (g + p)
      ), i -= 1);
    }
    return i;
  }
}
function ae(o) {
  return typeof o == "function" || Object.prototype.toString.call(o) === "[object Object]" && !Pt(o);
}
const se = /* @__PURE__ */ ne({
  name: "IBizAttention",
  props: ht(),
  emits: mt(),
  setup(o, {
    emit: m,
    attrs: r
  }) {
    const i = le("attention"), e = o.controller, d = b(""), c = b([]), f = b([]), v = b(""), E = b(!1), F = b(!1), w = b(""), C = b([]), g = b("user"), p = b([]), j = b([]), P = b(!1), U = b(!1), T = b(!1), $ = b(""), D = b(!1), Z = b(), N = b(), H = b(""), M = b(), I = b([]);
    let S = 0;
    const x = b(295), R = k(() => o == null ? void 0 : o.readonly), Ae = () => {
      let t = 295;
      if (N.value) {
        const a = N.value.getBoundingClientRect(), s = 16, n = e.enableBottomButton ? 464 : 415, u = n - t, y = a.top < n + s, A = window.innerHeight - a.bottom < n + s;
        if (y && A) {
          const B = a.top - s - u;
          t = Math.max(50, Math.min(Math.floor(B), 295));
        }
      }
      x.value = t;
    }, Ie = k(() => !!(o.controlParams && o.controlParams.editmode === "hover")), L = k(() => ft(d.value)), W = b({}), J = /* @__PURE__ */ new Set(), Se = async (t, a = {}) => {
      if (!(W.value[t] || J.has(t))) {
        J.add(t);
        try {
          const {
            downloadUrl: s
          } = ibiz.util.file.calcFileUpDownUrl(e.context, e.params, o.data, e.editorParams);
          let n = "";
          if (ibiz.config.common.enableDownloadTicket) {
            const u = g.value === "user" ? e.userAuthEntity : e.deptAuthEntity, y = g.value === "user" ? e.userFilterMap.id : e.deptFilterMap.id, A = await ibiz.util.file.getDownloadTicket(e.context, e.params, a, {
              fileId: t
            }, {
              appEntityTag: u,
              dataFieldTag: y
            });
            A != null && A.ticket && (n = s.replace("%fileId%", A.ticket));
          } else
            n = s.replace("%fileId%", t);
          n && (W.value[t] = n);
        } catch (s) {
          ibiz.log.error(s);
        } finally {
          J.delete(t);
        }
      }
    }, Pe = (t) => /^https?:|^http?:|^data:image|(\.png$|\.svg|\.jpg|\.png|\.gif|\.psd|\.tif|\.bmp|\.jpeg)$/.test(t), Y = (t) => {
      t.preventDefault(), t.stopPropagation();
    }, q = () => {
      var s;
      const t = [], a = [];
      H.value = "", ((s = p.value) == null ? void 0 : s.length) > 0 && p.value.forEach((n) => {
        t.push(n[e.selfFillMap.user_id]), a.push(n[e.selfFillMap.user_name]), n[e.selfFillMap.user_id] === e.context.srfuserid && (H.value = n[e.attentionTypeField]);
      }), v.value = t == null ? void 0 : t.toString(), d.value = a == null ? void 0 : a.toString();
    }, Oe = (t) => {
      var a, s;
      return (s = (a = e.codeListMap) == null ? void 0 : a.FOLLOWED) == null ? void 0 : s.some((n) => String(n) === String(t));
    }, X = () => {
      const t = v.value.split(e.separator);
      S = jt.calcSelItemRenderNum(t, N.value), v.value = "", q();
    }, re = (t) => {
      if (t) {
        const a = Ot(t) ? t : [];
        p.value = [], a.forEach((s) => {
          const n = ie(s);
          e.selfFillMap.user_id && e.selfFillMap.user_name && Object.assign(n, {
            id: s[e.selfFillMap.user_id],
            name: s[e.selfFillMap.user_name],
            title: s[e.selfFillMap.user_title],
            [e.attentionTypeField]: s[e.attentionTypeField]
          }), e.objectValueField && (Object.assign(n, {
            ...s[e.objectValueField]
          }), delete n[e.objectValueField]), p.value.push(n);
        });
      } else
        p.value = [];
      j.value = ie(p.value);
    };
    _(() => o.value, (t) => {
      t ? e.valueType === "OBJECT" ? d.value = t ? t[e.objectNameField] : null : e.valueType === "OBJECTS" ? (re(t), q()) : d.value = t : (d.value = "", p.value = []), X();
    }, {
      immediate: !0
    });
    const Te = k(() => o.data && o.data[e.valueItem] || void 0);
    _(Te, (t, a) => {
      t !== a && (v.value = t, t === null && (p.value = [], m("change", null)));
    }, {
      immediate: !0,
      deep: !0
    });
    const oe = (t) => {
      t ? F.value = t : setTimeout(() => {
        F.value = t;
      }, 100);
    }, xe = (t) => {
      const a = {}, s = j.value.find((n) => n.id === t.id) || {};
      try {
        const n = e.dynamicMatch(e.fieldMap, {
          item: {
            ...s,
            ...t
          }
        }), u = JSON.parse(n);
        Object.keys(u).forEach((y) => {
          u[y] && Object.assign(a, {
            [y]: u[y]
          });
        });
      } catch (n) {
        ibiz.log.debug("".concat(e.fieldMap, "额外抛值字段映射"));
      }
      return a;
    }, K = () => {
      if (e.enableBottomButton && !D.value)
        return;
      const t = p.value.map((a) => {
        const s = {};
        return Object.assign(s, {
          [e.selfFillMap.user_id]: a.id,
          [e.selfFillMap.user_name]: a.name,
          [e.selfFillMap.user_title]: a.title,
          [e.attentionTypeField]: a[e.attentionTypeField]
        }), e.fieldMap && Object.assign(s, xe(a)), s;
      });
      m("change", t);
    }, Le = (t, a) => {
      Y(a);
      const s = p.value.findIndex((n) => n.id === t.id);
      if (s > -1 && p.value.splice(s, 1), e.valueItem) {
        const n = p.value.map((u) => u.id);
        m("change", n.join(e.separator), e.valueItem);
      }
      if (e.valueType === "OBJECTS")
        D.value = !0, K(), D.value = !1;
      else {
        const n = p.value.map((u) => u.name);
        m("change", n.join(e.separator));
      }
    }, je = async (t) => {
      w.value && (g.value === "user" ? c.value.unshift(t) : f.value.unshift(t));
      const a = {};
      if (Object.assign(a, t), g.value === "user") {
        Object.assign(a, {
          [e.userFilterMap.id]: a[e.userFilterMap.id] ? a[e.userFilterMap.id] : a.srfkey,
          [e.userFilterMap.name]: a[e.userFilterMap.name] ? a[e.userFilterMap.name] : a.srfmajortext
        });
        const s = p.value.findIndex((n) => n.id === a[e.userFilterMap.id]);
        s < 0 ? p.value.push({
          ...a,
          id: a[e.userFilterMap.id],
          name: a[e.userFilterMap.name],
          [e.attentionTypeField]: e.defaultAttentionValue
        }) : p.value.splice(s, 1);
      } else {
        Object.assign(a, {
          [e.deptFilterMap.id]: a[e.deptFilterMap.id] ? a[e.deptFilterMap.id] : a.srfkey,
          [e.deptFilterMap.name]: a[e.deptFilterMap.name] ? a[e.deptFilterMap.name] : a.srfmajortext
        });
        const s = p.value.findIndex((n) => n.id === a[e.deptFilterMap.id]);
        s < 0 ? p.value.push({
          ...a,
          id: a[e.deptFilterMap.id],
          name: a[e.deptFilterMap.name],
          [e.attentionTypeField]: e.defaultAttentionValue
        }) : p.value.splice(s, 1);
      }
      if (e.multiple) {
        if (e.valueItem) {
          const n = p.value.map((u) => u.id);
          m("change", n.join(e.separator), e.valueItem);
        }
        const s = p.value.map((n) => n.name);
        e.valueType === "OBJECTS" ? K() : m("change", s.join(e.separator));
      } else {
        const s = await e.calcFillDataItems([t]);
        if (s.length && s.forEach((n) => {
          m("change", n.value, n.id);
        }), e.valueItem && (g.value === "user" ? m("change", a[e.userFilterMap.id], e.valueItem) : m("change", a[e.deptFilterMap.id], e.valueItem)), e.valueType === "OBJECT")
          m("change", e.handleObjectParams(a));
        else if (e.valueType === "OBJECTS") {
          const n = {};
          g.value === "user" ? Object.assign(n, {
            id: a[e.userFilterMap.id],
            name: a[e.userFilterMap.name]
          }) : Object.assign(n, {
            id: a[e.deptFilterMap.id],
            name: a[e.deptFilterMap.name]
          }), p.value = [n], K();
        } else
          g.value === "user" ? m("change", t[e.userFilterMap.name]) : m("change", t[e.deptFilterMap.name]);
        T.value = !1;
      }
      e.valueType !== "OBJECTS" && m("blur", t), oe(!1);
    }, De = (t, a) => {
      t.forEach((s) => {
        const n = c.value.findIndex((u) => u[a] === s[a]);
        n > -1 ? c.value.splice(n, 1, s) : c.value.push(s);
      });
    }, z = async (t = !1) => {
      if (w.value)
        return;
      P.value = !0;
      const a = {};
      g.value === "department" ? a.page = e.deptpage : a.page = e.page;
      try {
        const s = await e.loadMore(o.data, g.value, a);
        s && (g.value === "user" ? c.value.length === 0 ? c.value = s.data : De(s.data, e.userFilterMap.id) : f.value.length === 0 ? f.value = s.data : f.value.push(...s.data));
      } catch (s) {
        P.value = !1;
      }
      P.value = !1;
    }, ce = (t) => {
      const {
        dataItems: a
      } = e;
      a != null && a.length && a.forEach((s) => {
        m("change", null, s.id);
      }), e.valueItem && m("change", null, e.valueItem), e.valueType === "OBJECTS" ? m("change", []) : (m("change", null), m("blur", t)), t.stopPropagation(), t.preventDefault();
    }, Ne = async (t) => {
      if (!e.codeListMap)
        return;
      if (Oe(String(t))) {
        const s = p.value.find((n) => {
          var u;
          return n[e.selfFillMap.user_id] === ((u = e.context) == null ? void 0 : u.srfuserid);
        });
        if (s)
          Object.assign(s, {
            [e.attentionTypeField]: t
          });
        else {
          const n = {
            id: e.context.srfuserid,
            name: e.context.srfusername,
            [e.attentionTypeField]: t
          };
          e.currentOperator || await e.initCurrentOperator(o.data), e.currentOperator && Object.assign(n, {
            title: e.currentOperator[e.userFilterMap.title]
          }), p.value.push(n);
        }
      } else {
        const s = p.value.findIndex((n) => {
          var u;
          return n[e.selfFillMap.user_id] === ((u = e.context) == null ? void 0 : u.srfuserid);
        });
        s > -1 && p.value.splice(s, 1);
      }
      q(), K();
    };
    _(L, (t, a) => {
      t !== a && e.valueType !== "OBJECTS" && m("infoTextChange", t);
    }, {
      immediate: !0
    });
    const ue = async (t) => {
      P.value = !0;
      try {
        const a = {};
        Object.assign(a, {
          query: t,
          size: 1e3
        });
        const s = await e.getServiceData(g.value, o.data, a);
        s && (g.value === "user" ? s.data.forEach((n) => {
          Object.keys(e.userFilterMap).forEach((u) => {
            n[u] = n[e.userFilterMap[u]];
          });
        }) : s.data.forEach((n) => {
          Object.keys(e.deptFilterMap).forEach((u) => {
            n[u] = n[e.deptFilterMap[u]];
          });
        }), C.value = s.data, P.value = !1);
      } catch (a) {
        P.value = !1;
      }
    }, de = (t) => {
      if (g.value !== t) {
        if (g.value = t, w.value) {
          ue(w.value);
          return;
        }
        g.value === "user" && c.value.length === 0 && z(), g.value === "department" && f.value.length === 0 && z();
      }
    }, Be = () => {
      const t = document.documentElement;
      return t ? getComputedStyle(t).getPropertyValue("--ibiz-color-primary") : null;
    }, ke = (t) => /[\u4E00-\u9FA5]/.test(t), ze = (t) => /[\u4e00-\u9fa5]+.*[a-zA-Z]+|[a-zA-Z]+.*[\u4e00-\u9fa5]+/.test(t), Q = (t) => {
      if (!t)
        return "";
      let a = 0;
      for (let B = 0; B < t.length; B++)
        if (ke(t))
          a = t.charCodeAt(B) + ((a << 5) - a), a = a & a;
        else {
          const ut = t.charCodeAt(B);
          a += ut.toString(16);
        }
      const s = String(a).substring(0, 6);
      let n = parseInt(s.substring(0, 2), 16), u = parseInt(s.substring(2, 4), 16), y = parseInt(s.substring(4, 6), 16);
      n < 0 && (n = 10), u < 0 && (u = 10), y < 0 && (y = 10);
      const A = "#".concat(n.toString(16).padStart(2, "0")).concat(u.toString(16).padStart(2, "0")).concat(y.toString(16).padStart(2, "0"));
      return A === "#FFFFFF" && Be() || A;
    }, Ve = (t) => {
      clearTimeout(M.value), M.value = setTimeout(() => {
        !t && t !== 0 ? z() : ue(t), clearTimeout(M.value);
      }, 300);
    }, Ue = (t) => {
      t.forEach((a) => {
        if (a.capLanguageRes && a.capLanguageRes.lanResTag) {
          const s = ibiz.i18n.t(a.capLanguageRes.lanResTag, a.caption);
          Object.assign(a, {
            caption: s
          });
        }
        if (a.tooltipLanguageRes && a.tooltipLanguageRes.lanResTag) {
          const s = ibiz.i18n.t(a.tooltipLanguageRes.lanResTag, a.tooltip);
          Object.assign(a, {
            caption: s
          });
        }
      });
    }, Re = async (t, a) => {
      await e.onActionClick(t, [o.data], a);
    }, _e = (t) => w.value ? C.value : t, pe = () => {
      U.value = !1, W.value = {}, J.clear();
    }, $e = () => {
      D.value = !1, T.value = !1, setTimeout(() => {
        re(o.value);
      }, 200);
    }, He = () => {
      D.value = !0, T.value = !1, K(), D.value = !1;
    }, We = () => l(O("el-input"), {
      class: i.be("select-modal", "search-input"),
      ref: Z,
      modelValue: w.value,
      "onUpdate:modelValue": (t) => w.value = t,
      placeholder: "搜索",
      onInput: (t) => Ve(t)
    }, {
      suffix: () => l("svg", {
        viewBox: "0 0 16 16",
        xmlns: "http://www.w3.org/2000/svg",
        height: "1em",
        width: "1em",
        preserveAspectRatio: "xMidYMid meet",
        focusable: "false"
      }, [l("g", {
        id: "atwnormal/search",
        "stroke-width": "1",
        "fill-rule": "evenodd"
      }, [l("path", {
        d: "M6.751 12.303A5.557 5.557 0 0 1 1.2 6.751C1.2 3.691 3.69 1.2 6.751 1.2a5.558 5.558 0 0 1 5.551 5.551 5.557 5.557 0 0 1-5.551 5.552M6.751 0a6.751 6.751 0 1 0 4.309 11.949l3.855 3.855a.6.6 0 1 0 .849-.849l-3.854-3.853A6.751 6.751 0 0 0 6.751 0",
        id: "atwFill-1",
        fill: "currentColor"
      }, null)])])
    }), Je = () => l("div", {
      class: i.be("select-modal", "select-state")
    }, [l("div", {
      class: [i.bem("select-modal", "select-state", "select-slider"), i.is("left", g.value === "user"), i.is("right", g.value !== "user")]
    }, null), l("div", {
      class: i.bem("select-modal", "select-state", "select-personel"),
      onClick: () => de("user")
    }, [V("人员")]), l("div", {
      class: i.bem("select-modal", "select-state", "select-department"),
      onClick: () => de("department")
    }, [V("部门")])]), Ke = (t) => l("div", {
      class: i.bem("select-modal", "actions", "item"),
      title: t.tooltip,
      onClick: (a) => Re(t, a)
    }, [t.showIcon && t.sysImage && l(O("iBizIcon"), {
      icon: t.sysImage
    }, null)]), Ze = () => {
      var a;
      const t = ((a = e.model.uiactionGroup) == null ? void 0 : a.uiactionGroupDetails) || [];
      return Ue(t), l("div", {
        class: i.be("select-modal", "actions")
      }, [t.map((s) => Ke(s))]);
    }, Ye = () => l("div", {
      class: i.be("select-modal", "select")
    }, [Je(), Ze()]), Ge = (t) => {
      if (e.multiple) {
        let a = -1;
        return v.value && (a = v.value.split(e.separator).findIndex((n) => n === t)), e.enableBottomButton && (a = p.value.findIndex((s) => (g.value === "user" ? s[e.userFilterMap.id] : s[e.deptFilterMap.id]) === t)), a > -1 ? l("div", {
          class: i.bem("select-modal", "personel-list", "icon")
        }, [l("i", {
          class: "fa fa-check",
          "aria-hidden": "true"
        }, null)]) : null;
      }
      return v.value === t ? l("div", {
        class: i.bem("select-modal", "personel-list", "icon")
      }, [l("i", {
        class: "fa fa-check",
        "aria-hidden": "true"
      }, null)]) : null;
    }, qe = (t) => {
      if (t && t.toString().length < 2)
        return t;
      if (t && t.toString().length >= 2) {
        if (ze(t)) {
          const u = t.split("").find((A) => /[a-zA-Z]/.test(A)) || "", y = t.split("").find((A) => /[\u4E00-\u9FA5]/.test(A)) || "";
          return "".concat(u).concat(y).toLowerCase();
        }
        return /[a-zA-Z]/.test(t) ? t.split("").filter((u) => /[a-zA-Z]/.test(u)).slice(0, 2).join("").toUpperCase() : /[\u4E00-\u9FA5]/.test(t) ? t.split("").filter((u) => /[\u4E00-\u9FA5]/.test(u)).slice(-2).join("") : t.replaceAll(" ", "").substring(0, 2);
      }
    }, Xe = (t) => {
      console.log("头像加载失败"), I.value.push(t);
    }, Qe = (t, a) => {
      if (!t)
        return null;
      let s = "";
      if (Pe(t))
        s = t;
      else {
        let n = [];
        try {
          n = JSON.parse(t);
        } catch (y) {
          console.error("解析头像数据失败", y);
        }
        if (n.length === 0)
          return null;
        const u = n[0].id;
        if (s = W.value[u], !s)
          return Se(u, a), null;
      }
      return l("img", {
        class: i.bem("select-modal", "personel-list", "avatar"),
        src: s,
        onError: () => Xe(t),
        alt: ""
      }, null);
    }, ee = (t, a, s) => {
      const u = s && (g.value === "user" ? s[e.userFilterMap.avatar] : s[e.deptFilterMap.avatar]) || e.getUserPictureUrl(t, a), y = Qe(u, s);
      return u && !I.value.includes(u) && y ? y : qe(a);
    }, he = (t) => {
      const a = g.value === "user" ? t[e.userFilterMap.name] || t.name : t[e.deptFilterMap.name] || t.name, s = g.value === "user" ? t[e.userFilterMap.id] : t[e.deptFilterMap.id], n = g.value === "user" ? t[e.userFilterMap.title] : t[e.deptFilterMap.title];
      return l("div", {
        class: [i.bem("select-modal", "personel-list", "item"), i.is("selected", v.value === s)],
        onClick: () => je(t)
      }, [l("div", {
        class: i.bem("select-modal", "personel-list", "text")
      }, [l("div", {
        class: i.bem("select-modal", "personel-list", "text-img"),
        style: "background-color:".concat(Q(a))
      }, [ee(s, a, t)]), l("div", {
        class: i.bem("select-modal", "personel-list", "text-label")
      }, [a]), n && l("div", {
        class: i.bem("select-modal", "personel-list", "title-label")
      }, [n]), s === e.context.srfuserid ? l("div", {
        class: i.bem("select-modal", "personel-list", "myself")
      }, [V("我自己")]) : null]), Ge(s)]);
    }, et = (t, a) => {
      const {
        context: s,
        params: n
      } = e;
      return l(O("iBizControlShell"), {
        class: i.b("panel-item"),
        data: t,
        modelData: a,
        context: s,
        params: n
      }, null);
    }, tt = (t, a) => l(O("el-popover"), {
      target: "hover",
      placement: "right",
      offset: 24,
      width: "auto"
    }, {
      reference: () => he(t),
      default: () => et(t, a)
    }), at = (t, a) => {
      U.value && (g.value === "user" ? t - a < 305 && (P.value || z()) : t - a < 265 && (P.value || z()));
    }, me = (t) => {
      var n;
      const a = _e(t), s = (n = e.deACMode) == null ? void 0 : n.itemLayoutPanel;
      return l(xt, {
        items: a,
        itemHeight: 36,
        class: [i.be("select-modal", "personel-list"), i.be("select-modal", "personel-list-".concat(g.value))],
        onScrollEvent: (u, y) => at(u, y)
      }, {
        default: (u) => s ? tt(u, s) : he(u)
      });
    }, fe = (t) => {
      E.value = t;
    }, st = () => l("div", {
      class: i.be("select-modal", "deptpersonel")
    }, [l("div", {
      class: i.bem("select-modal", "deptpersonel", "dept")
    }, [l("div", {
      class: "collpase-icon"
    }, [E.value ? l("i", {
      class: "fa fa-angle-right",
      "aria-hidden": "true",
      onClick: () => fe(!1)
    }, null) : l("i", {
      class: "fa fa-angle-down",
      "aria-hidden": "true",
      onClick: () => fe(!0)
    }, null)]), l("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false"
    }, [l("g", {
      id: "aqf1.Base基础/1.icon图标/2.normal/部门",
      "stroke-width": "1",
      "fill-rule": "evenodd"
    }, [l("path", {
      d: "M9 1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-.39l-.016 2.138H11.5a2.1 2.1 0 0 1 2.095 1.95l.005.15V11h.4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h.4V9.238a.9.9 0 0 0-.787-.893l-.113-.007h-7a.9.9 0 0 0-.893.787l-.007.113V11H4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h.4V9.238a2.1 2.1 0 0 1 1.95-2.094l.15-.006h2.894L7.41 5H7a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h2zm4.8 11.2h-1.6v1.6h1.6v-1.6zm-10 0H2.2v1.6h1.6v-1.6zm5-10H7.2v1.6h1.6V2.2z",
      id: "aqf形状结合",
      fill: "currentColor"
    }, null)])]), l("span", null, ["".concat(e.context.srfusername, "的团队")]), l("span", null, [V("·")]), l("span", null, [e.depttotal])]), E.value ? null : l("div", {
      class: i.bem("select-modal", "deptpersonel", "dept-person")
    }, [me(f.value)])]), it = () => {
      let t, a;
      return l("div", {
        class: i.be("select-modal", "bottom")
      }, [l(O("el-button"), {
        type: "text",
        onClick: $e
      }, ae(t = ibiz.i18n.t("app.cancel")) ? t : {
        default: () => [t]
      }), l(O("el-button"), {
        onClick: He
      }, ae(a = ibiz.i18n.t("app.confirm")) ? a : {
        default: () => [a]
      })]);
    }, ve = () => Ct(l("div", {
      class: i.b("select-modal"),
      onPointerdown: Y,
      onPointerup: Y,
      onClick: Y
    }, [We(), Ye(), l("div", {
      class: i.be("select-modal", "container"),
      style: {
        height: "".concat(x.value, "px")
      }
    }, [g.value === "user" ? me(c.value) : st()]), e.enableBottomButton && it()]), [[At("loading"), P.value]]), ge = () => l("div", {
      class: i.b("no-select-value")
    }, [l("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false"
    }, [l("g", {
      id: "azeaction/user-add",
      "stroke-width": "1"
    }, [l("path", {
      d: "M7.9.4a4.1 4.1 0 1 1-.265 8.192.593.593 0 0 1-.268.126 6.411 6.411 0 0 0-4.624 3.698A6.375 6.375 0 0 0 2.2 15 .6.6 0 0 1 1 15c0-1.07.222-2.11.645-3.069a7.622 7.622 0 0 1 4.069-3.963A4.1 4.1 0 0 1 7.9.4zm4.6 9.9a.6.6 0 0 1 .592.503l.008.097-.001 1.399 1.401.001a.6.6 0 0 1 .592.503l.008.097a.6.6 0 0 1-.503.592l-.097.008-1.401-.001.001 1.401a.6.6 0 0 1-.503.592l-.097.008a.6.6 0 0 1-.592-.503L11.9 14.9v-1.401l-1.4.001a.6.6 0 0 1-.592-.503L9.9 12.9a.6.6 0 0 1 .503-.592l.097-.008h1.4v-1.4a.6.6 0 0 1 .503-.592l.097-.008zM7.9 1.6a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8z",
      id: "aze形状结合",
      fill: "currentColor"
    }, null)])]), l("span", null, [V("未设置")])]), lt = () => l("div", {
      class: i.b("no-select-value")
    }, [l("span", null, [V("未设置")])]), be = () => {
      var t, a;
      if (e.multiple) {
        const s = [];
        if (v.value) {
          const u = v.value.split(e.separator), y = L.value.split(e.separator);
          u.forEach((A, B) => {
            s.push({
              id: A,
              name: y[B]
            });
          });
        }
        let n = !1;
        return S > 0 && (n = e.enableBottomButton ? S < ((t = j.value) == null ? void 0 : t.length) : S < ((a = p.value) == null ? void 0 : a.length), s == null || s.splice(S, s == null ? void 0 : s.length)), l("div", {
          class: [i.b("select-value-multiple"), i.is("hidden", n)]
        }, [s == null ? void 0 : s.map((u) => {
          let y;
          return l("div", {
            class: i.be("select-value-multiple", "item")
          }, [l("div", {
            class: [i.be("select-value", "textimg"), i.bem("select-value-multiple", "item", "textimg")],
            style: "background-color:".concat(Q(u.name))
          }, [l(O("el-tooltip"), {
            class: "box-item",
            effect: "dark",
            content: u.name,
            placement: "top",
            offset: 12
          }, ae(y = ee(u.id, u.name, u)) ? y : {
            default: () => [y]
          }), o.readonly ? null : l("div", {
            class: [i.bem("select-value-multiple", "item", "close")],
            onClick: (A) => Le(u, A)
          }, [l("i", {
            class: "fa fa-close",
            "aria-hidden": "true"
          }, null)])])]);
        }), n ? l(O("el-tooltip"), {
          class: i.b("multiple-ellipsis"),
          "popper-class": i.be("multiple-ellipsis", "popper"),
          effect: "dark",
          content: L.value,
          placement: "top",
          offset: 12
        }, {
          default: () => [l("span", {
            class: i.be("multiple-ellipsis", "default")
          }, [V("...")])]
        }) : null]);
      }
    }, Me = () => e.multiple ? l("div", {
      class: i.b("select-value-multiple")
    }, [l("div", {
      class: i.b("select-value"),
      title: "选择人员"
    }, [l("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false"
    }, [l("g", {
      id: "azeaction/user-add",
      "stroke-width": "1"
    }, [l("path", {
      d: "M7.9.4a4.1 4.1 0 1 1-.265 8.192.593.593 0 0 1-.268.126 6.411 6.411 0 0 0-4.624 3.698A6.375 6.375 0 0 0 2.2 15 .6.6 0 0 1 1 15c0-1.07.222-2.11.645-3.069a7.622 7.622 0 0 1 4.069-3.963A4.1 4.1 0 0 1 7.9.4zm4.6 9.9a.6.6 0 0 1 .592.503l.008.097-.001 1.399 1.401.001a.6.6 0 0 1 .592.503l.008.097a.6.6 0 0 1-.503.592l-.097.008-1.401-.001.001 1.401a.6.6 0 0 1-.503.592l-.097.008a.6.6 0 0 1-.592-.503L11.9 14.9v-1.401l-1.4.001a.6.6 0 0 1-.592-.503L9.9 12.9a.6.6 0 0 1 .503-.592l.097-.008h1.4v-1.4a.6.6 0 0 1 .503-.592l.097-.008zM7.9 1.6a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8z",
      id: "aze形状结合",
      fill: "currentColor"
    }, null)])])])]) : l("div", {
      class: i.b("select-value")
    }, [l("div", {
      class: i.be("select-value", "textimg"),
      style: "background-color:".concat(Q(L.value))
    }, [ee(v.value, L.value)]), l("div", {
      class: i.be("select-value", "text")
    }, [l("div", {
      class: i.bem("select-value", "text", "label")
    }, [L.value])]), o.readonly ? null : l("i", {
      class: ["fa fa-times-circle", i.be("select-value", "close")],
      "aria-hidden": "true",
      onClick: (t) => ce(t)
    }, null)]), ye = async () => {
      var u, y;
      U.value = !0;
      const {
        context: t,
        params: a
      } = e.handlePublicParams(o.data, e.context, e.params), s = e.fill(e.userUrl, t, a, o.data).replaceAll("//", "/"), n = e.fill(e.deptUrl, t, a, o.data).replaceAll("//", "/");
      (s !== e.copyUserUrl || n !== e.copyDeptUrl || o.data && o.data.srfkey !== $.value) && ($.value = ((u = o.data) == null ? void 0 : u.srfkey) || "", c.value = [], f.value = [], e.resetState(), z(!0)), await It(), (y = Z.value) == null || y.focus();
    }, nt = () => L.value ? Me() : ge(), rt = () => L.value ? [be()] : lt(), ot = () => l(O("el-popover"), St({
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
    }, r), {
      reference: () => nt(),
      default: () => ve()
    }), ct = () => [be(), ot()], we = () => {
      X();
    };
    return Fe(() => {
      N.value && (window == null || window.addEventListener("resize", we), X());
    }), Ft(() => {
      e.resetState(), N.value && (window == null || window.removeEventListener("resize", we)), W.value = {}, J.clear();
    }), {
      ns: i,
      c: e,
      refValue: v,
      curValue: d,
      valueText: L,
      loading: P,
      items: c,
      isEditable: F,
      showFormDefaultContent: Ie,
      modelVisible: T,
      curAttentionValue: H,
      attentionRef: N,
      readonlyState: R,
      onClear: ce,
      load: z,
      setEditable: oe,
      renderDropModal: ve,
      renderNoSelectValue: ge,
      renderSelectInput: Me,
      onPopShow: ye,
      onPageHide: pe,
      onAttentionChange: Ne,
      renderEditContent: ct,
      renderReadonlyContent: rt
    };
  },
  render() {
    return l("div", {
      ref: "attentionRef",
      class: [this.ns.b(), this.ns.b("person-value"), this.disabled ? this.ns.m("disabled") : "", this.readonlyState ? this.ns.m("readonly") : "", this.ns.is("editable", this.isEditable), this.ns.is("show-default", this.showFormDefaultContent)]
    }, [this.readonlyState ? this.renderReadonlyContent() : this.renderEditContent(), l(Lt, {
      disabled: this.disabled,
      value: this.curAttentionValue,
      codeListId: this.c.codeListId,
      codeListMap: this.c.codeListMap,
      defaultSelected: this.c.defaultSelected,
      controller: this.c,
      onChange: this.onAttentionChange
    }, null)]);
  }
}), Dt = vt(se, function(o) {
  o.component(se.name, se), yt(
    "EDITOR_CUSTOMSTYLE_ATTENTION",
    () => new Tt()
  );
}), $t = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(o) {
    o.use(Dt);
  }
};
export {
  Dt as IBizAttention,
  $t as default
};
