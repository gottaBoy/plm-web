import './style.css';
var Ce = Object.defineProperty;
var ge = (t, u, e) => u in t ? Ce(t, u, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[u] = e;
var _ = (t, u, e) => (ge(t, typeof u != "symbol" ? u + "" : u, e), e);
import { ValueOP as d, ConfigService as Oe, ControlController as be, convertNavData as Ie, getEntitySchema as Ee, ItemsValueOPs as Fe, isSimpleItems as Se, SearchBarFilterSimpleItemsController as Te, SearchBarFilterController as Pe, SearchBarFilterItemsController as we, ScriptFactory as Ne, SearchCondEx2filterNode as xe, calcSearchConds as Le, registerControlProvider as De } from "@ibiz-template/runtime";
import { useNamespace as ae, useControlController as ke, useUIStore as _e, useClickOutside as Be, withInstall as Ge } from "@ibiz-template/vue3-util";
import { defineComponent as K, computed as Q, createVNode as l, resolveComponent as C, isVNode as ie, ref as x, watch as ee, createTextVNode as A, h as ue, reactive as Me } from "vue";
import { clearAll as Re, createUUID as te } from "qx-util";
import { isString as de } from "lodash-es";
import { clone as U, recursiveIterate as pe, isElementSame as Ae } from "@ibiz-template/core";
var se = /* @__PURE__ */ ((t) => (t.OR = "或", t.AND = "与", t))(se || {});
const he = /\$\{[^}]*\}/, fe = [
  d.IS_NULL,
  d.IS_NOT_NULL,
  d.EXISTS,
  d.NOT_EXISTS
];
class je {
  /**
   * Creates an instance of OdooSearchBarService.
   * @param {ISearchBar} model
   * @param {IContext} context
   * @memberof OdooSearchBarService
   */
  constructor(u, e) {
    /**
     * 应用配置服务
     *
     * @type {ConfigService}
     */
    _(this, "config");
    var s, o;
    this.model = u, this.context = e, this.config = new Oe(
      u.appId,
      "searchbar",
      "".concat(e.srfuserid, "_").concat(((s = this.model.appDataEntityId) == null ? void 0 : s.toLowerCase()) || "app", "_").concat((o = this.model.codeName) == null ? void 0 : o.toLowerCase())
    );
  }
  /**
   * 保存
   *
   * @param {IData} data
   * @return {*}  {Promise<void>}
   * @memberof OdooSearchBarService
   */
  async save(u) {
    await this.config.save(u);
  }
  /**
   * 加载
   *
   * @return {*}  {Promise<IData>}
   * @memberof OdooSearchBarService
   */
  async load() {
    return this.config.load();
  }
}
const V = "", le = {
  string: [
    d.EQ,
    d.NOT_EQ,
    d.IS_NULL,
    d.IS_NOT_NULL,
    d.USER_LIKE,
    d.LIKE,
    d.LIFT_LIKE,
    d.RIGHT_LIKE
  ],
  number: [
    d.EQ,
    d.GT,
    d.GT_AND_EQ,
    d.LT,
    d.LT_AND_EQ,
    d.NOT_EQ,
    d.IS_NULL,
    d.IS_NOT_NULL,
    d.IN,
    d.NOT_IN
  ],
  date: [
    d.EQ,
    d.GT,
    d.GT_AND_EQ,
    d.LT,
    d.LT_AND_EQ,
    d.NOT_EQ,
    d.IS_NULL,
    d.IS_NOT_NULL,
    d.IN,
    d.NOT_IN
  ]
}, X = {};
function Ue() {
  Object.keys(le).forEach((t) => {
    le[t].forEach((e) => {
      if (fe.includes(e))
        return;
      const s = "".concat(t, "_").concat(e);
      X[s] || (t === "date" && ![d.IN, d.NOT_IN].includes(e) ? X[s] = {
        appId: V,
        editorType: "DATEPICKER",
        id: s
      } : X[s] = {
        appId: V,
        editorType: "TEXTBOX",
        id: s
      });
    });
  });
}
Ue();
function ze(t, u) {
  return t.enumSource ? {
    appId: V,
    editorType: "DROPDOWNLIST",
    singleSelect: !0,
    valueType: "SIMPLE",
    appCodeListId: t.enumSource,
    id: "".concat(t.key, "_").concat(u)
  } : X["".concat(t.type, "_").concat(u)];
}
async function $e(t, u, e) {
  var p;
  const s = [], o = [];
  if (!t.properties)
    return { schemaFields: s, searchBarFilters: o };
  const { properties: i } = t;
  if (!(Object.keys(i).length > 0))
    return { schemaFields: s, searchBarFilters: o };
  const r = {};
  return (p = (await ibiz.hub.getAppDataEntity(
    u,
    e
  )).appDEFields) == null || p.forEach((f) => {
    r[f.codeName.toLowerCase()] = f.id;
  }), ibiz.util.jsonSchema.sortProperties(Object.entries(i)).map((f) => f[0]).forEach((f) => {
    let h;
    switch (i[f].type) {
      case "string":
        h = "string", ["date", "date-time", "time"].includes(i[f].format) && (h = "date");
        break;
      case "integer":
      case "number":
        h = "number";
        break;
      default:
        ibiz.log.error(
          ibiz.i18n.t("runtime.controller.control.grid.unsupported", {
            type: i[f].type
          })
        );
        return;
    }
    h && s.push({
      key: f,
      type: h,
      description: i[f].description,
      enumSource: i[f].enumSource
    });
  }), s.forEach((f) => {
    const h = le[f.type];
    if (!h) {
      ibiz.log.error(
        ibiz.i18n.t("runtime.controller.control.grid.unsupported", {
          type: ""
        }),
        f.type
      );
      return;
    }
    h.forEach((P) => {
      f && o.push({
        appId: V,
        appDEFieldId: r[f.key],
        id: f.key,
        caption: f.description,
        defsearchMode: {
          appId: V,
          valueOP: P
        },
        editor: ze(f, P)
      });
    });
  }), { schemaFields: s, searchBarFilters: o };
}
class qe extends be {
  constructor() {
    super(...arguments);
    /**
     * @description 快速搜索占位符（根据属性计算出来的快速搜索占位符）
     * @memberof OdooSearchBarController
     */
    _(this, "placeHolder", "");
    /**
     * @description 搜索栏服务
     * @type {OdooSearchBarService}
     * @memberof OdooSearchBarController
     */
    _(this, "service");
    /**
     * @description 过滤项控制器
     * @type {SearchBarFilterController[]}
     * @memberof OdooSearchBarController
     */
    _(this, "filterControllers", []);
    /**
     * @description schema实体映射map
     * @type {(Map<string, string | undefined>)}
     * @memberof OdooSearchBarController
     */
    _(this, "schemaEntityMap", /* @__PURE__ */ new Map());
    /**
     * @description 互斥过滤项
     * @type {{ [key: string]: string[] }}
     * @memberof OdooSearchBarController
     */
    _(this, "exclusive", {});
    /**
     * @description OR关系组
     * @type {{ [key: string]: string[] }}
     * @memberof OdooSearchBarController
     */
    _(this, "filterORgroup", {});
    /**
     * @description 是否有默认选中
     * @memberof OdooSearchBarController
     */
    _(this, "hasDefaultSelect", !1);
    /**
     * @description 时间格式化
     * @memberof OdooSearchBarController
     */
    _(this, "dateFormat", [
      {
        label: "年",
        value: "year"
      },
      {
        label: "季",
        value: "quarter"
      },
      {
        label: "月",
        value: "month"
      },
      {
        label: "周",
        value: "week"
      },
      {
        label: "天",
        value: "day"
      }
    ]);
  }
  /**
   * 数据部件控制器（多数据）
   * @readonly
   * @type {MDControlController}
   */
  get xdataControl() {
    const { xdatacontrolname: e = "" } = this.view.state;
    if (e)
      return this.view.getController(e);
  }
  /**
   * @description 初始化UI状态
   * @protected
   * @memberof OdooSearchBarController
   */
  initState() {
    super.initState();
    const { groupMode: e } = this.model;
    this.state.singleSelect = !e || e === "SINGLE", this.state.condop = e === "OR" ? "OR" : "AND", this.state.filter = [], this.state.collect = [], this.state.group = [], this.state.selectedFilter = [], this.state.schemaFields = [], this.state.selectedCollect = void 0, this.state.selectedGroup = [], this.state.collectName = this.view.model.caption, this.state.showFilter = !0, this.state.showGroup = !0, this.state.showCollect = !0;
  }
  /**
   * @description 生命周期-创建完成
   * @protected
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async onCreated() {
    this.service = new je(this.model, this.context), await super.onCreated(), await this.initFiltersByJsonSchema(), await this.initSearchBarFilters(), await this.initSearchBar(), this.initFilterByUserParam();
  }
  /**
   * @description 通过用户参数初始化过滤配置
   * @private
   * @memberof OdooSearchBarController
   */
  initFilterByUserParam() {
    const { searchBarGroups: e } = this.model;
    !e || !e.length || e.forEach((s) => {
      var o, i;
      if ((o = s.userParam) != null && o.exclusive) {
        const r = this.exclusive[s.userParam.exclusive] || [];
        r.push(s.id), this.exclusive[s.userParam.exclusive] = r;
      }
      if ((i = s.userParam) != null && i.filterorgroup) {
        const r = this.filterORgroup[s.userParam.filterorgroup] || [];
        r.push(s.id), this.filterORgroup[s.userParam.filterorgroup] = r;
      }
    });
  }
  /**
   * @description 初始化schema实体映射map
   * @private
   * @param {IData} json
   * @returns {*}  {void}
   * @memberof OdooSearchBarController
   */
  initSchemaEntityMap(e) {
    if (!e.properties)
      return;
    const { properties: s } = e;
    if (!(Object.keys(s).length > 0))
      return;
    const o = /* @__PURE__ */ new Map();
    Object.keys(s).forEach((i) => {
      var r, n;
      o.set(i, (n = (r = s[i]) == null ? void 0 : r.$ref) == null ? void 0 : n.split(".")[0]);
    }), this.schemaEntityMap = o;
  }
  /**
   * @description 通过JsonSchema初始化过滤项模型
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async initFiltersByJsonSchema() {
    var n;
    const e = Ie(
      JSON.parse(this.controlParams.jsonschemaparams || "{}"),
      this.params,
      this.context
    );
    Object.assign(e, this.params);
    const s = await Ee(
      this.model.appDataEntityId,
      this.context,
      e
    );
    if (!s)
      return;
    this.initSchemaEntityMap(s);
    const { schemaFields: o, searchBarFilters: i } = await $e(
      s,
      this.model.appDataEntityId,
      this.model.appId
    );
    this.state.schemaFields = o;
    const r = [];
    (n = this.model.searchBarFilters) == null || n.forEach((m) => {
      i.findIndex(
        (f) => {
          var h;
          return f.appDEFieldId === m.appDEFieldId && ((h = m.defsearchMode) != null && h.valueOP ? f.defsearchMode.valueOP === m.defsearchMode.valueOP : !0);
        }
      ) === -1 && r.push(m);
    }), i.length && (this.model = U(this.model), this.model.searchBarFilters = r.concat(...i));
  }
  /**
   * @description 初始化过滤项控制器
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async initSearchBarFilters() {
    const { searchBarFilters: e, appDataEntityId: s } = this.model;
    if (!e || !e.length)
      return;
    const o = await ibiz.hub.getAppDataEntity(
      s,
      this.context.srfappid
    ), i = /* @__PURE__ */ new Map();
    e.forEach((r) => {
      var m;
      if ((m = r.defsearchMode) != null && m.valueOP && Fe.includes(r.defsearchMode.valueOP)) {
        if (Se(r)) {
          this.filterControllers.push(
            new Te(
              r,
              o,
              this.context,
              this.params
            )
          );
          return;
        }
        const p = "".concat(r.appDEFieldId, "_").concat(r.defsearchMode.valueOP);
        i.has(p) || i.set(p, []), i.get(p).push(r);
        return;
      }
      const n = new Pe(
        r,
        o,
        this.context,
        this.params
      );
      this.filterControllers.push(n);
    }), i.size > 0 && i.forEach((r) => {
      const n = new we(
        r,
        o,
        this.context,
        this.params
      );
      this.filterControllers.push(n);
    }), await Promise.all(
      this.filterControllers.map((r) => r.init())
    );
  }
  /**
   * @description 初始化搜索栏
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async initSearchBar() {
    var n;
    const { searchBarGroups: e, controlParam: s } = this.model;
    e && e.length && (this.state.filter = e.map((m) => {
      var f;
      const p = {
        id: m.id,
        isShow: !0,
        searchconds: [],
        isCustom: !1,
        isChange: !1,
        caption: m.caption,
        showSeparator: m.addSeparator === !0
      };
      if (m.data)
        try {
          const h = JSON.parse(m.data);
          (f = h.theme_model) != null && f.searchconds && (p.searchconds = h.theme_model.searchconds), p.isShow = h.valid_flag === "1";
        } catch (h) {
          ibiz.log.error(
            ibiz.i18n.t("runtime.controller.control.searchBar.JSONFormat", {
              data: m.data
            }),
            h
          );
        }
      return p;
    }));
    const o = (n = s == null ? void 0 : s.ctrlParams) == null ? void 0 : n.DEFAULTGROUP;
    o && o.split(",").forEach((p) => {
      const f = this.state.schemaFields.find(
        (h) => p.toLowerCase() === h.key.toLowerCase()
      );
      f && this.state.group.push({
        id: f.key,
        isCustom: !1,
        type: f.type,
        appDEFieldId: f.key,
        caption: f.description,
        appCodeListId: f.enumSource
      });
    });
    const i = await this.service.load();
    if (i) {
      const { filter: m, collect: p, group: f } = i;
      m != null && m.length && m.forEach((h) => {
        const P = this.state.filter.findIndex((G) => G.id === h.id);
        P === -1 ? this.state.filter.push({ ...h, isCustom: !0 }) : this.state.filter.splice(P, 1, h);
      }), p != null && p.length && (this.state.collect = p), f != null && f.length && this.state.group.push(...f);
    }
    const r = e == null ? void 0 : e.find(
      (m) => m.defaultGroup
    );
    if (r) {
      this.hasDefaultSelect = !0;
      const m = this.state.filter.find((p) => p.id === r.id);
      this.handleFilterClick(m);
    }
  }
  /**
   * @description 根据标识获取指定预置项的搜索分组数据
   * @param {string} id
   * @returns {*}  {ISearchCondGroup[]}
   * @memberof OdooSearchBarController
   */
  getSearchCondsById(e) {
    var r;
    let s = [];
    const { searchBarGroups: o } = this.model, i = o == null ? void 0 : o.find((n) => n.id === e);
    if (i) {
      if (i.data)
        try {
          const n = JSON.parse(i.data);
          (r = n.theme_model) != null && r.searchconds && (s = n.theme_model.searchconds);
        } catch (n) {
          ibiz.log.error(
            ibiz.i18n.t("runtime.controller.control.searchBar.JSONFormat", {
              data: i.data
            }),
            n
          );
        }
      return {
        searchconds: s,
        caption: i.caption
      };
    }
  }
  /**
   * 根据类型清空选中数据
   *
   * @param {SearchItemType} item
   * @return {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async onClearSelectedByType(e) {
    switch (e.type) {
      case "filter":
        e.filterType === "OR" && e.filterTypeId ? this.state.selectedFilter = this.state.selectedFilter.filter(
          (s) => !this.filterORgroup[e.filterTypeId].includes(s.id)
        ) : e.filterType === "EXCLUSIVE" && e.filterTypeId ? this.state.selectedFilter = this.state.selectedFilter.filter(
          (s) => !this.exclusive[e.filterTypeId].includes(s.id)
        ) : this.state.selectedFilter = this.state.selectedFilter.filter(
          (s) => {
            const o = Object.keys(this.filterORgroup).some(
              (r) => this.filterORgroup[r].includes(s.id)
            ), i = Object.values(this.exclusive).some(
              (r) => r.includes(s.id)
            );
            return !!(o || i);
          }
        ), await this.onSearch();
        break;
      case "collect":
        this.state.selectedCollect = void 0, await this.onSearch();
        break;
      case "group":
        this.state.selectedGroup.forEach((s) => {
          s.dateFormat = [], s.isExpand = !1;
        }), this.state.selectedGroup = [], this.execGroup();
        break;
    }
  }
  /**
   * @description 根据类型更新数据
   * @param {SearchItemType} type
   * @param {('update' | 'remove')} actionName
   * @param {(IFilterItem | IGroupItem | ICollectItem)} item
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async updateByType(e, s, o) {
    switch (e) {
      case "filter":
        await this.handleFilterUpdate(s, o);
        break;
      case "collect":
        await this.handleCollectUpdate(s, o);
        break;
      case "group":
        await this.handleGroupUpdate(s, o);
        break;
    }
  }
  /**
   * @description 处理过滤值更新
   * @private
   * @param {('update' | 'remove')} actionName
   * @param {IFilterItem} item
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async handleFilterUpdate(e, s) {
    const { selectedFilter: o, filter: i } = this.state;
    let r = i.findIndex((n) => n.id === s.id);
    e === "update" ? r !== -1 ? i.splice(r, 1, s) : i.push(s) : r !== -1 && (i.splice(r, 1), r = o.findIndex((n) => n.id === s.id), r !== -1 && await this.handleFilterClick(s)), await this.save();
  }
  /**
   * @description 处理收藏更新
   * @private
   * @param {('update' | 'remove')} actionName
   * @param {ICollectItem} item
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async handleCollectUpdate(e, s) {
    const { collect: o, selectedCollect: i } = this.state, r = o.findIndex((n) => n.id === s.id);
    e === "update" && r === -1 ? (o.push(s), this.state.selectedFilter = [], this.state.selectedGroup = [], await this.handleCollect(s)) : r !== -1 && (o.splice(r, 1), (i == null ? void 0 : i.id) === s.id && await this.handleCollect(s)), await this.save();
  }
  /**
   * @description 处理分组更新
   * @private
   * @param {('update' | 'remove')} actionName
   * @param {IGroupItem} item
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async handleGroupUpdate(e, s) {
    const { group: o, selectedGroup: i } = this.state;
    let r = o.findIndex((n) => n.id === s.id);
    e === "update" && r === -1 ? (o.push(s), s.type !== "date" && this.handleGroupClick(s)) : r !== -1 && (o.splice(r, 1), r = i.findIndex((n) => n.id === s.id), r !== -1 && this.handleGroupClick(s)), await this.save();
  }
  /**
   * @description 搜索项点击
   * @param {SearchItemType} type 数据类型
   * @param {(IFilterItem | IGroupItem | ICollectItem)} item 数据项
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async onSearchItemClick(e, s) {
    switch (e) {
      case "filter":
        this.handleFilterClick(s);
        break;
      case "collect":
        this.handleCollect(s);
        break;
      case "group":
        this.handleGroupClick(s);
        break;
    }
  }
  /**
   * @description 处理过滤点击
   * @private
   * @param {IFilterItem} item
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async handleFilterClick(e) {
    const { singleSelect: s } = this.state, o = this.state.selectedFilter.findIndex(
      (i) => i.id === e.id
    );
    if (s)
      this.state.selectedFilter = o !== -1 ? [] : [e];
    else {
      o !== -1 ? this.state.selectedFilter.splice(o, 1) : this.state.selectedFilter.push(e);
      const i = Object.values(this.exclusive).find(
        (r) => r.includes(e.id)
      );
      i != null && i.length && (this.state.selectedFilter = this.state.selectedFilter.filter((r) => i.includes(r.id) ? e.id === r.id : !0));
    }
    await this.onSearch();
  }
  /**
   * @description 处理分组点击
   * @private
   * @param {IGroupItem} item
   * @memberof OdooSearchBarController
   */
  handleGroupClick(e) {
    const { selectedGroup: s } = this.state, o = s.findIndex((i) => i.id === e.id);
    o !== -1 ? s.splice(o, 1) : s.push(e), this.execGroup();
  }
  /**
   * @description 执行分组
   * @memberof OdooSearchBarController
   */
  execGroup() {
    var r, n, m;
    if (!this.xdataControl)
      return;
    const { selectedGroup: e, selectedCollect: s } = this.state, o = U(e);
    (r = s == null ? void 0 : s.groups) != null && r.length && s.groups.forEach((p) => {
      const f = e.findIndex((h) => h.id === p.id);
      f !== -1 ? o.splice(f, 1, p) : o.push(p);
    });
    const i = o.map((p) => ({
      groupFieldId: p.appDEFieldId,
      groupCodeListId: p.appCodeListId,
      dateFormat: this.dateFormat.filter((f) => {
        var h;
        return (h = p.dateFormat) == null ? void 0 : h.includes(f.value);
      }).map((f) => f.value)
    }));
    (m = (n = this.xdataControl).execGroup) == null || m.call(n, i);
  }
  /**
   * @description 处理收藏点击
   * @private
   * @param {ICollectItem} item
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async handleCollect(e) {
    const { selectedCollect: s } = this.state;
    if ((s == null ? void 0 : s.id) !== e.id) {
      this.state.selectedCollect = e;
      const { filterIds: o, groups: i } = e;
      o.length && await this.onSearch(), i.length && this.execGroup();
    } else
      this.state.selectedCollect = void 0, await this.onSearch(), this.execGroup();
  }
  /**
   * @description 计算过滤项参数
   * @private
   * @returns {*}  {(ISearchCondGroup[] | undefined)}
   * @memberof OdooSearchBarController
   */
  calcFilters() {
    const { selectedFilter: e, selectedCollect: s, filter: o } = this.state, i = e.map((p) => ({ ...U(p) }));
    s && o.filter((p) => s.filterIds.includes(p.id)).forEach((p) => i.push({ ...U(p) }));
    const r = [], { grouped: n, ungrouped: m } = i.reduce(
      (p, f) => {
        var P;
        const h = Object.keys(this.filterORgroup).find(
          (G) => this.filterORgroup[G].includes(f.id)
        );
        return h ? (p.grouped[h] = p.grouped[h] || {
          condtype: "GROUP",
          condop: "OR",
          searchconds: []
        }, (P = p.grouped[h].searchconds) == null || P.push(...f.searchconds)) : p.ungrouped.push(...f.searchconds), p;
      },
      { grouped: {}, ungrouped: [] }
    );
    return r.push(...m), Object.keys(n).length && r.push(...Object.values(n)), pe(
      { searchconds: r },
      (p) => {
        p.condtype === "DEFIELD" && de(p.value) && he.test(p.value) && (p.value = Ne.execSingleLine("`".concat(p.value, "`"), {
          ...this.getEventArgs()
        }));
      },
      {
        childrenFields: ["searchconds"]
      }
    ), r.length ? [
      {
        condtype: "GROUP",
        condop: this.state.condop,
        searchconds: r
      }
    ] : void 0;
  }
  /**
   * @description 获取搜索栏的过滤参数（包括快速搜索，快速分组和过滤器的参数）
   * @returns {*}  {IParams}
   * @memberof OdooSearchBarController
   */
  getFilterParams() {
    const e = {};
    this.state.query && (e.query = this.state.query);
    const s = this.calcFilters();
    return s && (e.searchconds = s), e;
  }
  /**
   * @description 保存
   * @private
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async save() {
    const { filter: e, collect: s, group: o } = this.state, i = o.filter((n) => n.isCustom).map((n) => ({
      id: n.id,
      type: n.type,
      caption: n.caption,
      isCustom: n.isCustom,
      appDEFieldId: n.appDEFieldId,
      appCodeListId: n.appCodeListId
    })), r = e.filter((n) => n.isCustom || n.isChange);
    await this.service.save({
      collect: s,
      filter: r,
      group: i
    });
  }
  /**
   * @description 搜索
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async onSearch() {
    this.xdataControl && (this.xdataControl.state.searchParams = this.getFilterParams(), await this.xdataControl.load({ isInitialLoad: !0 }));
  }
  /**
   * @description 重置
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async resetFilter() {
    this.state.selectedCollect = void 0, this.state.selectedFilter = [], this.state.selectedGroup = [], await this.onSearch();
  }
}
function Qe(t) {
  return typeof t == "function" || Object.prototype.toString.call(t) === "[object Object]" && !ie(t);
}
const oe = [{
  valueOP: d.EQ,
  label: "等于(=)"
}, {
  valueOP: d.NOT_EQ,
  label: "不等于(<>)"
}, {
  valueOP: d.GT,
  label: "大于(>)"
}, {
  valueOP: d.GT_AND_EQ,
  label: "大于等于(>=)"
}, {
  valueOP: d.LT,
  label: "小于(<)"
}, {
  valueOP: d.LT_AND_EQ,
  label: "小于等于(<=)"
}, {
  valueOP: d.IS_NULL,
  label: "值为空(Nil)"
}, {
  valueOP: d.IS_NOT_NULL,
  label: "值不为空(NotNil)"
}, {
  valueOP: d.IN,
  label: "值在范围中(In)"
}, {
  valueOP: d.NOT_IN,
  label: "值不在范围中(NotIn)"
}, {
  valueOP: d.LIKE,
  label: "文本包含(%)"
}, {
  valueOP: d.LIFT_LIKE,
  label: "文本左包含(%#)"
}, {
  valueOP: d.RIGHT_LIKE,
  label: "文本右包含(#%)"
}, {
  valueOP: d.EXISTS,
  label: "存在(EXISTS)"
}, {
  valueOP: d.NOT_EXISTS,
  label: "不存在(NOTEXISTS)"
}], ne = /* @__PURE__ */ K({
  name: "IBizFilterModeSelect",
  props: {
    value: String,
    modes: Array,
    disabled: Boolean
  },
  emits: {
    change: (t) => !0
  },
  setup(t, {
    emit: u
  }) {
    return {
      availableModes: Q(() => {
        var o;
        return (o = t.modes) != null && o.length ? oe.filter((i) => t.modes.includes(i.valueOP)) : oe;
      }),
      onChange: (o) => {
        u("change", o);
      }
    };
  },
  render() {
    let t;
    return l(C("el-select"), {
      "model-value": this.value,
      disabled: this.disabled,
      teleported: !0,
      onChange: (u) => {
        this.onChange(u);
      }
    }, Qe(t = this.availableModes.map((u) => l(C("el-option"), {
      key: u.valueOP,
      value: u.valueOP,
      label: u.label
    }, null))) ? t : {
      default: () => [t]
    });
  }
});
function ce(t) {
  return typeof t == "function" || Object.prototype.toString.call(t) === "[object Object]" && !ie(t);
}
const Ve = [{
  valueOP: d.EQ,
  label: "等于(=)"
}, {
  valueOP: d.NOT_EQ,
  label: "不等于(<>)"
}, {
  valueOP: d.GT,
  label: "大于(>)"
}, {
  valueOP: d.GT_AND_EQ,
  label: "大于等于(>=)"
}, {
  valueOP: d.LT,
  label: "小于(<)"
}, {
  valueOP: d.LT_AND_EQ,
  label: "小于等于(<=)"
}, {
  valueOP: d.IS_NULL,
  label: "值为空(Nil)"
}, {
  valueOP: d.IS_NOT_NULL,
  label: "值不为空(NotNil)"
}, {
  valueOP: d.IN,
  label: "值在范围中(In)"
}, {
  valueOP: d.NOT_IN,
  label: "值不在范围中(NotIn)"
}, {
  valueOP: d.LIKE,
  label: "文本包含(%)"
}, {
  valueOP: d.LIFT_LIKE,
  label: "文本左包含(%#)"
}, {
  valueOP: d.RIGHT_LIKE,
  label: "文本右包含(#%)"
}, {
  valueOP: d.EXISTS,
  label: "存在(EXISTS)"
}, {
  valueOP: d.NOT_EXISTS,
  label: "不存在(NOTEXISTS)"
}], Xe = /* @__PURE__ */ K({
  name: "IBizFilterTreeControl",
  props: {
    filterControllers: {
      type: Array,
      required: !0
    },
    filterNodes: {
      type: Array,
      required: !0
    },
    filterMode: {
      type: String,
      default: "default"
    },
    customCond: {
      type: String,
      default: ""
    },
    context: {
      type: Object
    },
    params: {
      type: Object
    },
    schemaEntityMap: {
      type: Object,
      default: () => /* @__PURE__ */ new Map()
    }
  },
  emits: ["confirm", "cancel", "change", "customCondChange"],
  setup(t, {
    emit: u
  }) {
    const e = ae("search-item-filter-tree"), s = Q(() => t.filterNodes), o = (a) => {
      if (a.nodeType === "ITEMS" && a.simple) {
        const O = a.children[0];
        return t.filterControllers.find((E) => {
          if (E.type === "SIMPLE_ITEMS") {
            const I = E;
            if (I.fieldName === a.field && I.valueOP === a.valueOP && I.subFieldName === O.field && I.subValueOP === O.valueOP)
              return !0;
          }
          return !1;
        });
      }
      const {
        field: y,
        valueOP: b
      } = a;
      return t.filterControllers.find((O) => O.type === "SIMPLE_ITEMS" ? !1 : O.fieldName === y ? O.valueOP ? O.valueOP === b : !0 : !1);
    }, i = [];
    t.filterControllers.forEach((a) => {
      let y = i.find((b) => b.name === a.key);
      a.hidden || (y === void 0 && (y = {
        name: a.key,
        fieldName: a.fieldName,
        label: a.label,
        valueOPs: []
      }, a.type === "SIMPLE_ITEMS" && (y.simpleFilterC = a), i.push(y)), a.valueOP ? y.valueOPs.push(a.valueOP) : y.valueOPs = Ve.map((b) => b.valueOP));
    });
    const r = x([]);
    i.forEach(async (a) => {
      var b, O;
      const y = t.filterControllers.find((E) => E.key === a.name);
      y && r.value.push({
        appDEFieldId: a.fieldName,
        caption: a.label,
        valueOPs: a.valueOPs,
        appDataEntityId: t.schemaEntityMap.get(a.fieldName),
        appDataEntityFullTag: (b = y.appDataEntity) == null ? void 0 : b.defullTag,
        appCodeListId: (O = y.model.editor) == null ? void 0 : O.appCodeListId
      });
    });
    const n = x(), m = x(t.filterMode || "default"), p = x(""), f = (a) => {
      p.value = a, u("customCondChange", p.value);
    };
    ee(() => t.customCond, () => {
      p.value = t.customCond;
    }, {
      immediate: !0
    });
    const h = (a, y = i) => {
      if (!a)
        return;
      const b = y.find((O) => O.name === a);
      if (b)
        return b.valueOPs;
    }, P = (a, y, b = i) => {
      const O = b.find((E) => E.name === y);
      if (!O) {
        ibiz.log.error("allFields找不到属性标识为".concat(y, "的"));
        return;
      }
      if (Re(a), O.simpleFilterC) {
        O.simpleFilterC.addSimpleFilterNode(a);
        return;
      }
      a.nodeType = "FIELD", a.field = O.fieldName;
    }, G = (a, y) => {
      a.valueOP = y, a.value = null, ["EXISTS", "NOTEXISTS"].includes(y) ? Object.assign(a, {
        nodeType: "ITEMS",
        children: [{
          nodeType: "FIELD",
          field: null,
          valueOP: null,
          value: null
        }]
      }) : Object.assign(a, {
        nodeType: "FIELD",
        children: void 0
      });
    }, z = (a, y) => {
      a.logicType = y;
    }, $ = (a) => {
      a.children.push({
        nodeType: "GROUP",
        logicType: "AND",
        children: [{
          nodeType: "FIELD",
          field: null,
          valueOP: null,
          value: null
        }]
      });
    }, w = (a) => {
      a.children.push({
        nodeType: "FIELD",
        field: null,
        valueOP: null,
        value: null
      });
    }, F = (a, y) => {
      if (y.noEditor || a.valueOP && fe.includes(a.valueOP))
        return null;
      let b = null;
      if (y.editorProvider) {
        const {
          data: O,
          value: E
        } = y.calcEditorProps(a), I = C(y.editorProvider.formEditor);
        b = ue(I, {
          key: y.editor.model.id,
          value: E,
          controller: y.editor,
          disabled: a.disabled,
          data: O,
          onChange: (J, W) => {
            y.onEditorChange(a, J, W);
          }
        });
      } else
        b = l(C("not-supported-editor"), {
          modelData: y.model.editor
        }, null);
      return l("div", {
        class: e.e("editor")
      }, [b]);
    }, S = (a, y) => {
      if (a.hidden)
        return;
      let b = i;
      y && (b = y.allFields);
      const O = h(a.field, b);
      let E = null;
      if (a.field && a.valueOP)
        if (y) {
          const I = y.getSubFilterController(a.field, a.valueOP);
          E = F(a, I);
        } else {
          const I = o(a);
          I && !["EXISTS", "NOTEXISTS"].includes(I.valueOP) && (E = F(a, I));
        }
      return l("div", {
        class: e.b("item")
      }, [l(C("el-select"), {
        disabled: a.disabled,
        "model-value": a.field,
        teleported: !0,
        filterable: !0,
        class: e.e("field-select"),
        onChange: (I) => {
          P(a, I, b);
        }
      }, {
        default: () => [b == null ? void 0 : b.map((I) => l(C("el-option"), {
          key: I.name,
          value: I.name,
          label: I.label
        }, null))]
      }), O && O.length > 0 && l(ne, {
        disabled: a.disabled,
        class: e.e("mode-select"),
        value: a.valueOP,
        modes: O,
        onChange: (I) => {
          G(a, I);
        }
      }, null), E]);
    };
    let D = (a) => l("div", null, null);
    const q = (a, y, b) => {
      if (!a.hidden)
        return a.nodeType === "ITEMS" ? D(a) : l("div", {
          class: e.b("group")
        }, [l("div", {
          class: e.be("group", "actions")
        }, [l(C("el-button"), {
          text: !0,
          type: "primary",
          onClick: () => {
            if (m.value === "pql") {
              m.value = "default";
              return;
            }
            $(a);
          }
        }, {
          default: () => [m.value === "pql" ? "切换组" : "添加组"]
        }), l(C("el-button"), {
          text: !0,
          onClick: () => {
            if (m.value === "pql") {
              m.value = "default";
              return;
            }
            w(a);
          }
        }, {
          default: () => [m.value === "pql" ? "切换项" : "添加项"]
        }), b && l(C("el-button"), {
          text: !0,
          onClick: () => {
            m.value = "pql";
          }
        }, {
          default: () => [A("添加PQL")]
        }), l(C("el-select"), {
          "model-value": a.logicType,
          teleported: !1,
          class: e.be("group", "logic-type"),
          onChange: (O) => {
            m.value = "default", z(a, O);
          }
        }, {
          default: () => [l(C("el-option"), {
            key: "AND",
            value: "AND",
            label: "AND"
          }, null), l(C("el-option"), {
            key: "OR",
            value: "OR",
            label: "OR"
          }, null)]
        })]), m.value === "pql" && l("div", {
          class: e.be("group", "editor")
        }, [l(C("iBizPqlEditor"), {
          ref: "pqlEditor",
          value: p.value,
          fields: r.value,
          context: t.context,
          params: t.params,
          onChange: f
        }, null)]), m.value !== "pql" && l("div", {
          class: e.be("group", "list")
        }, [a.children.length > 0 && a.children.map((O, E) => {
          const I = O.nodeType === "FIELD" ? S(O, y) : q(O, y);
          return I ? l("div", {
            class: e.be("group", "list-item")
          }, [l("div", {
            class: e.be("group", "list-item-left")
          }, [a.logicType]), I, l(C("iBizIcon"), {
            class: e.be("group", "list-item-right"),
            onClick: () => {
              a.children.splice(E, 1);
            },
            icon: {
              cssClass: "trash"
            }
          }, null)]) : null;
        })])]);
    };
    return D = (a) => {
      let y;
      const b = o(a);
      if (b) {
        if (a.simple) {
          let O;
          const E = a.children[0];
          return E ? [l(C("el-select"), {
            disabled: E.disabled,
            "model-value": b.key,
            teleported: !0,
            filterable: !0,
            class: e.e("field-select"),
            onChange: (I) => {
              P(a, I);
            }
          }, ce(O = i.map((I) => l(C("el-option"), {
            key: I.name,
            value: I.name,
            label: I.label
          }, null))) ? O : {
            default: () => [O]
          }), l(ne, {
            disabled: !0,
            class: e.e("mode-select"),
            value: E.valueOP,
            modes: [E.valueOP]
          }, null), F(E, b)] : void 0;
        }
        return l("div", {
          class: (e.b("group"), e.bm("group", "items"))
        }, [l("div", {
          class: e.be("group", "actions")
        }, [S(a), l(C("el-button"), {
          text: !0,
          onClick: () => {
            w(a);
          }
        }, ce(y = ibiz.i18n.t("control.searchBar.filterTree.addItem")) ? y : {
          default: () => [y]
        })]), l("div", {
          class: e.be("group", "list")
        }, [a.children.length > 0 && a.children.map((O, E) => {
          const I = O.nodeType === "FIELD" ? S(O, b) : q(O, b);
          return l("div", {
            class: e.be("group", "list-item")
          }, [l("div", {
            class: e.be("group", "list-item-left")
          }, [A("AND")]), I, l(C("iBizIcon"), {
            class: e.be("group", "list-item-right"),
            onClick: () => {
              a.children.splice(E, 1);
            },
            icon: {
              cssClass: "trash"
            }
          }, null)]);
        })])]);
      }
    }, {
      ns: e,
      UiFilterNodes: s,
      currentCustomCond: p,
      verify: () => {
        var y, b;
        let a = !0;
        return m.value === "pql" && n.value && ((b = (y = n.value).verify) != null && b.call(y) || (a = !1)), a;
      },
      renderFilterGroup: q,
      renderFilterItem: S
    };
  },
  render() {
    return l("div", {
      class: [this.ns.b()]
    }, [this.UiFilterNodes.length > 0 && this.UiFilterNodes.map((t) => t.nodeType === "FIELD" ? this.renderFilterItem(t) : this.renderFilterGroup(t, void 0, !0))]);
  }
});
const Ke = /* @__PURE__ */ K({
  name: "IBizModal",
  props: {
    item: {
      type: Object
    },
    modal: {
      type: Object,
      required: !0
    },
    controller: {
      type: Object,
      required: !0
    }
  },
  setup(t) {
    const u = ae("control-odoo-search-bar-modal"), e = x(), s = x(), o = x([]), i = x(""), r = x(!1), n = Me(U(t.item) || {
      id: te(),
      caption: "",
      showSeparator: !1,
      searchconds: [{
        condtype: "GROUP",
        condop: "AND",
        searchconds: []
      }],
      isShow: !0,
      isCustom: !0,
      isChange: !0
    }), m = t.controller.getSearchCondsById(n.id), p = x(!n.isCustom && !!m && (m.caption !== n.caption || Ae(!n.searchconds || !n.searchconds.length ? [{
      condtype: "GROUP",
      condop: "AND",
      searchconds: []
    }] : m.searchconds, n.searchconds)));
    ee(() => n.caption, () => {
      !n.isCustom && m && (p.value = n.caption !== m.caption);
    }), ee(() => o.value, () => {
      !n.isCustom && m && r.value && (p.value = !0);
    }, {
      deep: !0
    });
    const f = () => {
      var w;
      if (r.value = !1, (!n.searchconds || !n.searchconds.length) && (n.searchconds = [{
        condtype: "GROUP",
        condop: "AND",
        searchconds: []
      }]), o.value = n.searchconds.map((F) => xe(F)), o.value.length) {
        const {
          children: F
        } = o.value[0];
        if (Array.isArray(F)) {
          const S = F.findIndex((D) => D.nodeType === "CUSTOM" && D.customType === "PQL");
          if (S !== -1) {
            const D = F.splice(S, 1);
            i.value = ((w = D[0]) == null ? void 0 : w.customCond) || "";
          }
        }
        pe(o.value[0], (S) => {
          S.nodeType === "FIELD" && S.field && S.valueOP && de(S.value) && he.test(S.value) && (S.disabled = !0);
        });
      }
      setTimeout(() => {
        r.value = !0;
      });
    }, h = (w) => {
      if (!i.value)
        return;
      w[0] || (w[0] = {
        nodeType: "GROUP",
        logicType: "AND",
        children: []
      });
      const F = w[0];
      Array.isArray(F.children) || (F.children = []);
      const S = F.children.find((D) => D.nodeType === "CUSTOM" && D.customType === "PQL");
      S ? S.customCond = i.value : F.children.push({
        nodeType: "CUSTOM",
        customType: "PQL",
        customCond: i.value
      });
    }, P = async () => {
      var F, S;
      let w = (F = e.value) == null ? void 0 : F.verify();
      try {
        await ((S = s.value) == null ? void 0 : S.validate());
      } catch (D) {
        w = !1;
      }
      return w;
    }, G = async () => {
      if (!await P())
        return;
      const F = U(o.value);
      h(F), n.searchconds = Le(F), n.isCustom || (n.isChange = p.value), t.modal.dismiss({
        ok: !0,
        data: [n]
      });
    }, z = () => {
      t.modal.dismiss({
        ok: !1
      });
    }, $ = async () => {
      await ibiz.confirm.warning({
        title: "警告",
        desc: "您确定要还原该筛选条件吗？还原后不可恢复！"
      }) && (Object.assign(n, U(m)), f(), p.value = !0);
    };
    return f(), {
      ns: u,
      data: n,
      isInit: r,
      formRef: s,
      customCond: i,
      showRestore: p,
      filterNodes: o,
      filterTreeRef: e,
      onCancel: z,
      onConfirm: G,
      onRestore: $
    };
  },
  render() {
    return l("div", {
      class: this.ns.b()
    }, [l("div", {
      class: this.ns.e("header")
    }, [l("div", null, [this.item ? "变更筛选" : "添加自定义筛选"]), this.showRestore && l(C("el-button"), {
      type: "primary",
      onClick: this.onRestore
    }, {
      default: () => [A("还原")]
    })]), l(C("el-form"), {
      ref: "formRef",
      model: this.data,
      "label-position": "top",
      class: this.ns.e("content"),
      rules: {
        caption: [{
          required: !0,
          message: "标题不能为空",
          trigger: "blur"
        }]
      }
    }, {
      default: () => [l(C("el-form-item"), {
        label: "标题",
        prop: "caption"
      }, {
        default: () => [l(C("el-input"), {
          modelValue: this.data.caption,
          "onUpdate:modelValue": (t) => this.data.caption = t,
          placeholder: "请输入标题"
        }, null)]
      }), l(Xe, {
        ref: "filterTreeRef",
        customCond: this.customCond,
        filterNodes: this.filterNodes,
        params: this.controller.params,
        context: this.controller.context,
        schemaEntityMap: this.controller.schemaEntityMap,
        filterControllers: this.controller.filterControllers,
        onCustomCondChange: (t) => {
          this.customCond = t;
        }
      }, null)]
    }), l("div", {
      class: this.ns.e("footer")
    }, [l(C("el-button"), {
      type: "text",
      onClick: this.onCancel
    }, {
      default: () => [A("取消")]
    }), l(C("el-button"), {
      type: "primary",
      onClick: this.onConfirm
    }, {
      default: () => [A("确定")]
    })])]);
  }
});
function He(t) {
  return typeof t == "function" || Object.prototype.toString.call(t) === "[object Object]" && !ie(t);
}
const Je = () => l("svg", {
  viewBox: "0 0 1024 1024",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  "p-id": "4437",
  width: "1em",
  height: "1em"
}, [l("path", {
  d: "M512 570.88l196.864 196.8 58.88-58.88L570.752 512l196.864-196.864-58.816-58.88L512 453.248 315.136 256.32l-58.88 58.88L453.248 512l-196.864 196.864 58.88 58.88z",
  fill: "currentColor",
  "p-id": "4438"
}, null)]), Z = /* @__PURE__ */ K({
  name: "IBizOdooSearchBarControl",
  props: {
    /**
     * @description 搜索栏模型数据
     */
    modelData: {
      type: Object,
      required: !0
    },
    /**
     * @description 应用上下文对象
     */
    context: {
      type: Object,
      required: !0
    },
    /**
     * @description 视图参数对象
     * @default {}
     */
    params: {
      type: Object,
      default: () => ({})
    },
    /**
     * @description 部件适配器
     */
    provider: {
      type: Object
    }
  },
  setup() {
    const t = ke((...c) => new qe(...c)), u = ae("control-odoo-search-bar"), {
      zIndex: e
    } = _e(), s = [{
      type: "filter",
      caption: "筛选",
      icon: {
        appId: "",
        cssClass: "fa fa-filter"
      }
    }, {
      type: "group",
      caption: "分组方式",
      icon: {
        appId: "",
        cssClass: "layers-outline"
      }
    }, {
      type: "collect",
      caption: "收藏夹",
      icon: {
        appId: "",
        cssClass: "fa fa-star"
      }
    }], o = {
      zIndex: e.increment()
    }, i = x(!1), r = x(), n = x(""), m = x(), p = x(!1), f = x(!1);
    let h;
    const P = Q(() => {
      const {
        filter: c,
        collect: v,
        group: g
      } = t.state;
      return {
        group: g,
        filter: c,
        collect: v
      };
    }), G = Q(() => t.state.schemaFields.filter((c) => {
      var v;
      return ((v = P.value.group) == null ? void 0 : v.findIndex((g) => g.appDEFieldId.toLowerCase() === c.key)) === -1 && c.description.includes(n.value);
    })), z = Q(() => {
      const {
        selectedFilter: c,
        condop: v,
        selectedCollect: g,
        selectedGroup: T
      } = t.state, N = [];
      if (!c.length && !T.length && !g)
        return N;
      if (c.length && t.state.showFilter) {
        const L = [], B = {}, M = {};
        c.forEach((k) => {
          const j = Object.keys(t.filterORgroup).find((R) => t.filterORgroup[R].includes(k.id)), Y = Object.keys(t.exclusive).find((R) => {
            var re;
            return (re = t.exclusive[R]) == null ? void 0 : re.includes(k.id);
          });
          if (j) {
            const R = M[j] || [];
            R.push(k), M[j] = R;
          } else if (Y) {
            const R = B[Y] || [];
            R.push(k), B[Y] = R;
          } else
            L.push(k);
        }), L.length && N.push({
          type: "filter",
          icon: {
            appId: "",
            cssClass: "fa fa-filter"
          },
          filterType: "FILTER",
          caption: L.map((k) => k.caption).join(" ".concat(se[v], " "))
        }), Object.keys(M).length && Object.keys(M).forEach((k) => {
          N.push({
            type: "filter",
            filterTypeId: k,
            icon: {
              appId: "",
              cssClass: "fa fa-filter"
            },
            filterType: "OR",
            caption: M[k].map((j) => j.caption).join(" ".concat(se.OR, " "))
          });
        }), Object.keys(B).length && Object.keys(B).forEach((k) => {
          N.push({
            type: "filter",
            filterTypeId: k,
            icon: {
              appId: "",
              cssClass: "fa fa-filter"
            },
            filterType: "EXCLUSIVE",
            caption: B[k].map((j) => j.caption).join("")
          });
        });
      }
      return T.length && t.state.showGroup && N.push({
        type: "group",
        icon: {
          appId: "",
          cssClass: "layers-outline"
        },
        caption: T.map((L) => {
          var B;
          return (B = L.dateFormat) != null && B.length ? t.dateFormat.filter((M) => L.dateFormat.includes(M.value)).map((M) => "".concat(L.caption, ": ").concat(M.label)).join(" > ") : L.caption;
        }).join(" > ")
      }), g && t.state.showCollect && N.push({
        type: "collect",
        icon: {
          appId: "",
          cssClass: "fa fa-star"
        },
        caption: g.caption
      }), N;
    }), $ = (c) => {
      var L;
      const {
        selectedGroup: v,
        selectedFilter: g,
        selectedCollect: T
      } = t.state, N = [...v, ...g];
      return T && N.push(T), !!N.find((B) => B.id === c.id) || ((L = c.dateFormat) == null ? void 0 : L.length) > 0;
    }, w = () => {
      h == null || h.pause(), f.value = !1;
    }, F = () => {
      if (h)
        return h.proceed();
      h = Be(r, (c) => {
        c.target.closest(".".concat(u.e("reference"))) || (i.value = !1);
      });
    }, S = (c) => {
      c.stopPropagation(), t.onSearch();
    }, D = async () => {
      const {
        selectedFilter: c,
        selectedGroup: v,
        collectName: g
      } = t.state;
      if (!g)
        return ibiz.message.error("必须输入收藏名称");
      const T = {
        id: te(),
        isCustom: !0,
        filterIds: c.map((N) => N.id),
        groups: v,
        caption: g
      };
      f.value = !1, await t.updateByType("collect", "update", T), t.state.collectName = t.view.model.caption;
    }, q = (c) => {
      c ? h == null || h.pause() : h == null || h.proceed(), c || (n.value = "");
    }, H = async (c) => {
      const v = ibiz.overlay.createModal((T) => ue(Ke, {
        item: c,
        modal: T,
        controller: t
      }), {}, {
        width: "800px",
        height: "auto"
      });
      h == null || h.pause(), v.present();
      const g = await v.onWillDismiss();
      h == null || h.proceed(), g.ok && g.data && t.updateByType("filter", "update", g.data[0]);
    }, a = async (c, v) => {
      h == null || h.pause();
      const g = await ibiz.confirm.warning({
        title: "警告",
        desc: "您确定要删除 ".concat(v.caption, " 吗？删除后不可恢复！")
      });
      h == null || h.proceed(), g && t.updateByType(c, "remove", v);
    }, y = async (c) => {
      const v = t.state.schemaFields.find((g) => g.key === c);
      if (v) {
        const g = {
          isCustom: !0,
          id: te(),
          appDEFieldId: c,
          type: v.type,
          isExpand: !1,
          caption: v.description,
          appCodeListId: v.enumSource
        };
        await t.updateByType("group", "update", g);
      }
    }, b = (c, v) => {
      if (c === "group" && v.type === "date") {
        v.isExpand = !v.isExpand;
        return;
      }
      t.onSearchItemClick(c, v);
    }, O = (c, v) => {
      c.dateFormat || (c.dateFormat = []);
      const g = c.dateFormat.findIndex((L) => L === v);
      g !== -1 ? c.dateFormat.splice(g, 1) : c.dateFormat.push(v);
      const T = c.dateFormat.length > 0, N = t.state.selectedGroup.findIndex((L) => L.id === c.id);
      N !== -1 && !T ? t.state.selectedGroup.splice(N, 1) : N === -1 && T && t.state.selectedGroup.push(c), t.execGroup();
    }, E = (c) => {
      c.target.closest(".".concat(u.em("reference", "suffix"))) ? i.value = !i.value : i.value = !0;
    }, I = (c) => l("div", {
      class: [u.e("search-item"), u.em("search-item", c.type)]
    }, [l("div", {
      class: u.em("search-item", "icon")
    }, [l(C("iBizIcon"), {
      icon: c.icon
    }, null)]), l("div", {
      class: u.em("search-item", "caption"),
      title: c.caption
    }, [c.caption]), l("div", {
      class: u.em("search-item", "remove"),
      onClick: () => t.onClearSelectedByType(c)
    }, [Je()])]), J = () => l("div", {
      ref: m,
      class: [u.e("reference"), u.is("search-focus", p.value)],
      onClick: E
    }, [l("div", {
      class: u.em("reference", "left")
    }, [l(C("el-button"), {
      class: u.em("reference", "prefix"),
      type: "text",
      onClick: (c) => S(c)
    }, {
      default: () => [l(C("iBizIcon"), {
        icon: {
          cssClass: "fa fa-search"
        }
      }, null)]
    }), l("div", {
      class: u.em("reference", "content")
    }, [l("div", {
      class: u.e("search-content")
    }, [z.value.map((c) => I(c)), l(C("el-input"), {
      type: "text",
      placeholder: "搜索...",
      modelValue: t.state.query,
      "onUpdate:modelValue": (c) => t.state.query = c,
      onFocus: () => p.value = !0,
      onBlur: () => p.value = !1,
      onChange: () => t.onSearch()
    }, null)])])]), l(C("el-button"), {
      class: [u.em("reference", "suffix"), u.is("active", i.value)]
    }, {
      default: () => [l(C("ion-icon"), {
        name: i.value ? "chevron-up-outline" : "chevron-down-outline"
      }, null)]
    })]), W = (c) => c === "filter" ? l("div", {
      class: u.em("list", "item"),
      onClick: () => H()
    }, [l("div", {
      title: "添加自定义筛选",
      class: "caption action-caption"
    }, [A("添加自定义筛选")])]) : c === "collect" ? [l("div", {
      class: u.em("list", "item")
    }, [l("div", {
      title: "保存当前搜索",
      class: "caption action-caption",
      onClick: () => {
        f.value = !f.value;
      }
    }, [A("保存当前搜索")]), l("div", {
      class: ["action", "collapse-icon"]
    }, [l(C("ion-icon"), {
      name: f.value ? "chevron-up-outline" : "chevron-down-outline"
    }, null)])]), f.value && l("div", {
      class: u.e("expand-item")
    }, [l("div", {
      class: u.em("expand-item", "form")
    }, [l(C("el-input"), {
      modelValue: t.state.collectName,
      "onUpdate:modelValue": (v) => t.state.collectName = v,
      class: u.em("expand-item", "caption"),
      placeholder: "请输入收藏名称"
    }, null), l("div", {
      class: u.em("expand-item", "btn")
    }, [l(C("el-button"), {
      onClick: () => D()
    }, {
      default: () => [A("保存")]
    })])])])] : l(C("el-dropdown"), {
      trigger: "click",
      class: u.e("dropdown"),
      onCommand: y,
      onVisibleChange: q,
      "popper-class": u.em("dropdown", "popper")
    }, {
      default: () => l("div", {
        class: u.em("list", "item")
      }, [l("div", {
        title: "添加自定义分组",
        class: "caption action-caption"
      }, [A("添加自定义分组")]), l("div", {
        class: ["action", "collapse-icon"]
      }, [l(C("ion-icon"), {
        name: "chevron-down-outline"
      }, null)])]),
      dropdown: () => {
        let v;
        return l("div", {
          class: u.em("dropdown", "popper-content")
        }, [l(C("el-input"), {
          modelValue: n.value,
          "onUpdate:modelValue": (g) => n.value = g
        }, null), l(C("el-dropdown-menu"), null, He(v = G.value.map((g) => l(C("el-dropdown-item"), {
          command: g.key
        }, {
          default: () => [g.description]
        }))) ? v : {
          default: () => [v]
        })]);
      }
    }), ve = (c, v) => {
      const g = [];
      return c === "filter" && g.push(l(C("iBizIcon"), {
        title: "设置",
        class: "action-icon setting-icon",
        icon: {
          cssClass: "fa fa-fw fa-cog"
        },
        onClick: () => H(v)
      }, null)), v.type === "date" && g.push(l("div", {
        class: ["action", "collapse-icon"]
      }, [l(C("ion-icon"), {
        name: v.isExpand ? "chevron-up-outline" : "chevron-down-outline"
      }, null)])), v.isCustom && g.push(l(C("iBizIcon"), {
        title: "删除",
        class: "action-icon remove-icon",
        icon: {
          cssClass: "close-outline"
        },
        onClick: () => a(c, v)
      }, null)), g;
    }, me = (c, v) => v.isExpand && v.type === "date" ? l("div", {
      class: u.e("expand-item")
    }, [l("div", {
      class: u.em("expand-item", "list")
    }, [t.dateFormat.map((g) => {
      var T;
      return l("div", {
        class: ["item", u.is("selected", (T = v.dateFormat) == null ? void 0 : T.includes(g.value))],
        onClick: () => O(v, g.value)
      }, [g.label]);
    })])]) : null, ye = (c, v) => [l("div", {
      class: u.em("list", "item"),
      onClick: () => b(c, v)
    }, [l(C("iBizIcon"), {
      icon: {
        cssClass: "fa fa-check"
      },
      class: ["selected-icon", u.is("selected", $(v))]
    }, null), l("div", {
      title: v.caption,
      class: "caption"
    }, [v.caption]), l("div", {
      class: "action",
      onClick: (g) => g.stopPropagation()
    }, [ve(c, v)])]), me(c, v)];
    return {
      c: t,
      ns: u,
      popperStyle: o,
      dropDownRef: r,
      dropDownVisible: i,
      renderList: (c) => {
        var g;
        const v = s.find((T) => T.type === c);
        if (v)
          return l("div", {
            class: [u.e("list"), u.e("".concat(c, "-list"))]
          }, [l("div", {
            class: u.em("list", "header")
          }, [l(C("iBizIcon"), {
            icon: v.icon,
            class: "icon"
          }, null), l("div", {
            class: "caption"
          }, [l("span", {
            title: v.caption
          }, [v.caption])])]), l("div", {
            class: u.em("list", "content")
          }, [(g = P.value[c]) == null ? void 0 : g.map((T) => [ye(c, T), T.showSeparator && l(C("el-divider"), {
            class: u.em("list", "separator"),
            "border-style": "double"
          }, null)])]), l("div", {
            class: u.em("list", "footer")
          }, [W(c)])]);
      },
      renderDefault: J,
      onPopoverHide: w,
      onPopoverShow: F
    };
  },
  render() {
    return l(C("iBizControlBase"), {
      controller: this.c,
      class: [this.ns.b()]
    }, {
      default: () => [l(C("el-popover"), {
        width: "600",
        trigger: "click",
        visible: this.dropDownVisible,
        onHide: this.onPopoverHide,
        onShow: this.onPopoverShow,
        "popper-style": this.popperStyle,
        "popper-class": this.ns.e("popover")
      }, {
        reference: () => this.renderDefault(),
        default: () => l("div", {
          ref: "dropDownRef",
          class: this.ns.e("content")
        }, [this.c.state.showFilter && this.renderList("filter"), this.c.state.showGroup && this.renderList("group"), this.c.state.showCollect && this.renderList("collect")])
      })]
    });
  }
});
class We {
  constructor() {
    _(this, "component", "IBizOdooSearchBarControl");
  }
}
const Ye = Ge(
  Z,
  function(t) {
    t.component(Z.name, Z), De(
      "CUSTOM_ODOO_SEARCH_BAR",
      () => new We()
    );
  }
), ot = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(t) {
    t.use(Ye);
  }
};
export {
  Ye as IBizOdooSearchBarControl,
  ot as default
};
