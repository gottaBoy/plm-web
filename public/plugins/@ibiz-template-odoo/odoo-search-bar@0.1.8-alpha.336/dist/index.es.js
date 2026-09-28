import './assets/style.css';
import { ValueOP as u, registerControlProvider as ge, ControlController as be, convertNavData as Ce, getEntitySchema as Ie, ItemsValueOPs as Oe, isSimpleItems as Ee, SearchBarFilterSimpleItemsController as Se, SearchBarFilterController as Te, SearchBarFilterItemsController as Fe, ScriptFactory as Pe, ConfigService as we, SearchCondEx2filterNode as Ne, calcSearchConds as Le } from "@ibiz-template/runtime";
import { withInstall as xe, useControlController as ke, useNamespace as ie, useUIStore as _e, useClickOutside as De } from "@ibiz-template/vue3-util";
import { defineComponent as H, ref as N, computed as V, createVNode as i, resolveComponent as y, createTextVNode as R, isVNode as se, h as ce, reactive as Be, watch as Z } from "vue";
import { createUUID as ee, clearAll as Ge } from "qx-util";
import { isString as de } from "lodash-es";
import { clone as M, recursiveIterate as ue, isElementSame as je } from "@ibiz-template/core";
var Re = Object.defineProperty, Ue = (l, e, t) => e in l ? Re(l, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : l[e] = t, B = (l, e, t) => (Ue(l, typeof e != "symbol" ? e + "" : e, t), t), te = /* @__PURE__ */ ((l) => (l.OR = "或", l.AND = "与", l))(te || {});
const pe = /\$\{[^}]*\}/, he = [
  u.IS_NULL,
  u.IS_NOT_NULL,
  u.EXISTS,
  u.NOT_EXISTS
];
class Me {
  /**
   * Creates an instance of OdooSearchBarService.
   * @param {ISearchBar} model
   * @param {IContext} context
   * @memberof OdooSearchBarService
   */
  constructor(e, t) {
    B(this, "config");
    var d, n;
    this.model = e, this.context = t, this.config = new we(
      e.appId,
      "searchbar",
      "".concat(t.srfuserid, "_").concat(((d = this.model.appDataEntityId) == null ? void 0 : d.toLowerCase()) || "app", "_").concat((n = this.model.codeName) == null ? void 0 : n.toLowerCase())
    );
  }
  /**
   * 保存
   *
   * @param {IData} data
   * @return {*}  {Promise<void>}
   * @memberof OdooSearchBarService
   */
  async save(e) {
    await this.config.save(e);
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
const X = "", le = {
  string: [
    u.EQ,
    u.NOT_EQ,
    u.IS_NULL,
    u.IS_NOT_NULL,
    u.USER_LIKE,
    u.LIKE,
    u.LIFT_LIKE,
    u.RIGHT_LIKE
  ],
  number: [
    u.EQ,
    u.GT,
    u.GT_AND_EQ,
    u.LT,
    u.LT_AND_EQ,
    u.NOT_EQ,
    u.IS_NULL,
    u.IS_NOT_NULL,
    u.IN,
    u.NOT_IN
  ],
  date: [
    u.EQ,
    u.GT,
    u.GT_AND_EQ,
    u.LT,
    u.LT_AND_EQ,
    u.NOT_EQ,
    u.IS_NULL,
    u.IS_NOT_NULL,
    u.IN,
    u.NOT_IN
  ]
}, K = {};
function ze() {
  Object.keys(le).forEach((l) => {
    le[l].forEach((e) => {
      if (he.includes(e))
        return;
      const t = "".concat(l, "_").concat(e);
      K[t] || (l === "date" && ![u.IN, u.NOT_IN].includes(e) ? K[t] = {
        appId: X,
        editorType: "DATEPICKER",
        id: t
      } : K[t] = {
        appId: X,
        editorType: "TEXTBOX",
        id: t
      });
    });
  });
}
ze();
function Ae(l, e) {
  return l.enumSource ? {
    appId: X,
    editorType: "DROPDOWNLIST",
    singleSelect: !0,
    valueType: "SIMPLE",
    appCodeListId: l.enumSource,
    id: "".concat(l.key, "_").concat(e)
  } : K["".concat(l.type, "_").concat(e)];
}
async function qe(l, e, t) {
  var d;
  const n = [], s = [];
  if (!l.properties)
    return { schemaFields: n, searchBarFilters: s };
  const { properties: c } = l;
  if (!(Object.keys(c).length > 0))
    return { schemaFields: n, searchBarFilters: s };
  const p = {};
  return (d = (await ibiz.hub.getAppDataEntity(
    e,
    t
  )).appDEFields) == null || d.forEach((o) => {
    p[o.codeName.toLowerCase()] = o.id;
  }), ibiz.util.jsonSchema.sortProperties(Object.entries(c)).map((o) => o[0]).forEach((o) => {
    let f;
    switch (c[o].type) {
      case "string":
        f = "string", ["date", "date-time", "time"].includes(c[o].format) && (f = "date");
        break;
      case "integer":
      case "number":
        f = "number";
        break;
      default:
        ibiz.log.error(
          ibiz.i18n.t("runtime.controller.control.grid.unsupported", {
            type: c[o].type
          })
        );
        return;
    }
    f && n.push({
      key: o,
      type: f,
      description: c[o].description,
      enumSource: c[o].enumSource
    });
  }), n.forEach((o) => {
    const f = le[o.type];
    if (!f) {
      ibiz.log.error(
        ibiz.i18n.t("runtime.controller.control.grid.unsupported", {
          type: ""
        }),
        o.type
      );
      return;
    }
    f.forEach((I) => {
      o && s.push({
        appId: X,
        appDEFieldId: p[o.key],
        id: o.key,
        caption: o.description,
        defsearchMode: {
          appId: X,
          valueOP: I
        },
        editor: Ae(o, I)
      });
    });
  }), { schemaFields: n, searchBarFilters: s };
}
class Qe extends be {
  constructor() {
    super(...arguments), B(this, "placeHolder", ""), B(this, "service"), B(this, "filterControllers", []), B(this, "schemaEntityMap", /* @__PURE__ */ new Map()), B(this, "exclusive", {}), B(this, "filterORgroup", {}), B(this, "hasDefaultSelect", !1), B(this, "dateFormat", [
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
    this.service = new Me(this.model, this.context), await super.onCreated(), await this.initFiltersByJsonSchema(), await this.initSearchBarFilters(), await this.initSearchBar(), this.initFilterByUserParam();
  }
  /**
   * @description 通过用户参数初始化过滤配置
   * @private
   * @memberof OdooSearchBarController
   */
  initFilterByUserParam() {
    const { searchBarGroups: e } = this.model;
    !e || !e.length || e.forEach((t) => {
      var d, n;
      if ((d = t.userParam) != null && d.exclusive) {
        const s = this.exclusive[t.userParam.exclusive] || [];
        s.push(t.id), this.exclusive[t.userParam.exclusive] = s;
      }
      if ((n = t.userParam) != null && n.filterorgroup) {
        const s = this.filterORgroup[t.userParam.filterorgroup] || [];
        s.push(t.id), this.filterORgroup[t.userParam.filterorgroup] = s;
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
    const { properties: t } = e;
    if (!(Object.keys(t).length > 0))
      return;
    const d = /* @__PURE__ */ new Map();
    Object.keys(t).forEach((n) => {
      var s, c;
      d.set(n, (c = (s = t[n]) == null ? void 0 : s.$ref) == null ? void 0 : c.split(".")[0]);
    }), this.schemaEntityMap = d;
  }
  /**
   * @description 通过JsonSchema初始化过滤项模型
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async initFiltersByJsonSchema() {
    var e;
    const t = Ce(
      JSON.parse(this.controlParams.jsonschemaparams || "{}"),
      this.params,
      this.context
    );
    Object.assign(t, this.params);
    const d = await Ie(
      this.model.appDataEntityId,
      this.context,
      t
    );
    if (!d)
      return;
    this.initSchemaEntityMap(d);
    const { schemaFields: n, searchBarFilters: s } = await qe(
      d,
      this.model.appDataEntityId,
      this.model.appId
    );
    this.state.schemaFields = n;
    const c = [];
    (e = this.model.searchBarFilters) == null || e.forEach((p) => {
      s.findIndex(
        (o) => {
          var f;
          return o.appDEFieldId === p.appDEFieldId && ((f = p.defsearchMode) != null && f.valueOP ? o.defsearchMode.valueOP === p.defsearchMode.valueOP : !0);
        }
      ) === -1 && c.push(p);
    }), s.length && (this.model = M(this.model), this.model.searchBarFilters = c.concat(...s));
  }
  /**
   * @description 初始化过滤项控制器
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async initSearchBarFilters() {
    const { searchBarFilters: e, appDataEntityId: t } = this.model;
    if (!e || !e.length)
      return;
    const d = await ibiz.hub.getAppDataEntity(
      t,
      this.context.srfappid
    ), n = /* @__PURE__ */ new Map();
    e.forEach((s) => {
      var c;
      if ((c = s.defsearchMode) != null && c.valueOP && Oe.includes(s.defsearchMode.valueOP)) {
        if (Ee(s)) {
          this.filterControllers.push(
            new Se(
              s,
              d,
              this.context,
              this.params
            )
          );
          return;
        }
        const o = "".concat(s.appDEFieldId, "_").concat(s.defsearchMode.valueOP);
        n.has(o) || n.set(o, []), n.get(o).push(s);
        return;
      }
      const p = new Te(
        s,
        d,
        this.context,
        this.params
      );
      this.filterControllers.push(p);
    }), n.size > 0 && n.forEach((s) => {
      const c = new Fe(
        s,
        d,
        this.context,
        this.params
      );
      this.filterControllers.push(c);
    }), await Promise.all(
      this.filterControllers.map((s) => s.init())
    );
  }
  /**
   * @description 初始化搜索栏
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async initSearchBar() {
    var e;
    const { searchBarGroups: t, controlParam: d } = this.model;
    t && t.length && (this.state.filter = t.map((p) => {
      var o;
      const f = {
        id: p.id,
        isShow: !0,
        searchconds: [],
        isCustom: !1,
        isChange: !1,
        caption: p.caption,
        showSeparator: p.addSeparator === !0
      };
      if (p.data)
        try {
          const I = JSON.parse(p.data);
          (o = I.theme_model) != null && o.searchconds && (f.searchconds = I.theme_model.searchconds), f.isShow = I.valid_flag === "1";
        } catch (I) {
          ibiz.log.error(
            ibiz.i18n.t("runtime.controller.control.searchBar.JSONFormat", {
              data: p.data
            }),
            I
          );
        }
      return f;
    }));
    const n = (e = d == null ? void 0 : d.ctrlParams) == null ? void 0 : e.DEFAULTGROUP;
    n && n.split(",").forEach((p) => {
      const o = this.state.schemaFields.find(
        (f) => p.toLowerCase() === f.key.toLowerCase()
      );
      o && this.state.group.push({
        id: o.key,
        isCustom: !1,
        type: o.type,
        appDEFieldId: o.key,
        caption: o.description,
        appCodeListId: o.enumSource
      });
    });
    const s = await this.service.load();
    if (s) {
      const { filter: p, collect: o, group: f } = s;
      p != null && p.length && p.forEach((I) => {
        const O = this.state.filter.findIndex((_) => _.id === I.id);
        O === -1 ? this.state.filter.push({ ...I, isCustom: !0 }) : this.state.filter.splice(O, 1, I);
      }), o != null && o.length && (this.state.collect = o), f != null && f.length && this.state.group.push(...f);
    }
    const c = t == null ? void 0 : t.find(
      (p) => p.defaultGroup
    );
    if (c) {
      this.hasDefaultSelect = !0;
      const p = this.state.filter.find((o) => o.id === c.id);
      this.handleFilterClick(p);
    }
  }
  /**
   * @description 根据标识获取指定预置项的搜索分组数据
   * @param {string} id
   * @returns {*}  {ISearchCondGroup[]}
   * @memberof OdooSearchBarController
   */
  getSearchCondsById(e) {
    var t;
    let d = [];
    const { searchBarGroups: n } = this.model, s = n == null ? void 0 : n.find((c) => c.id === e);
    if (s) {
      if (s.data)
        try {
          const c = JSON.parse(s.data);
          (t = c.theme_model) != null && t.searchconds && (d = c.theme_model.searchconds);
        } catch (c) {
          ibiz.log.error(
            ibiz.i18n.t("runtime.controller.control.searchBar.JSONFormat", {
              data: s.data
            }),
            c
          );
        }
      return {
        searchconds: d,
        caption: s.caption
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
          (t) => !this.filterORgroup[e.filterTypeId].includes(t.id)
        ) : e.filterType === "EXCLUSIVE" && e.filterTypeId ? this.state.selectedFilter = this.state.selectedFilter.filter(
          (t) => !this.exclusive[e.filterTypeId].includes(t.id)
        ) : this.state.selectedFilter = this.state.selectedFilter.filter(
          (t) => {
            const d = Object.keys(this.filterORgroup).some(
              (s) => this.filterORgroup[s].includes(t.id)
            ), n = Object.values(this.exclusive).some(
              (s) => s.includes(t.id)
            );
            return !!(d || n);
          }
        ), await this.onSearch();
        break;
      case "collect":
        this.state.selectedCollect = void 0, await this.onSearch();
        break;
      case "group":
        this.state.selectedGroup.forEach((t) => {
          t.dateFormat = [], t.isExpand = !1;
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
  async updateByType(e, t, d) {
    switch (e) {
      case "filter":
        await this.handleFilterUpdate(t, d);
        break;
      case "collect":
        await this.handleCollectUpdate(t, d);
        break;
      case "group":
        await this.handleGroupUpdate(t, d);
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
  async handleFilterUpdate(e, t) {
    const { selectedFilter: d, filter: n } = this.state;
    let s = n.findIndex((c) => c.id === t.id);
    e === "update" ? s !== -1 ? n.splice(s, 1, t) : n.push(t) : s !== -1 && (n.splice(s, 1), s = d.findIndex((c) => c.id === t.id), s !== -1 && await this.handleFilterClick(t)), await this.save();
  }
  /**
   * @description 处理收藏更新
   * @private
   * @param {('update' | 'remove')} actionName
   * @param {ICollectItem} item
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async handleCollectUpdate(e, t) {
    const { collect: d, selectedCollect: n } = this.state, s = d.findIndex((c) => c.id === t.id);
    e === "update" && s === -1 ? (d.push(t), this.state.selectedFilter = [], this.state.selectedGroup = [], await this.handleCollect(t)) : s !== -1 && (d.splice(s, 1), (n == null ? void 0 : n.id) === t.id && await this.handleCollect(t)), await this.save();
  }
  /**
   * @description 处理分组更新
   * @private
   * @param {('update' | 'remove')} actionName
   * @param {IGroupItem} item
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async handleGroupUpdate(e, t) {
    const { group: d, selectedGroup: n } = this.state;
    let s = d.findIndex((c) => c.id === t.id);
    e === "update" && s === -1 ? (d.push(t), t.type !== "date" && this.handleGroupClick(t)) : s !== -1 && (d.splice(s, 1), s = n.findIndex((c) => c.id === t.id), s !== -1 && this.handleGroupClick(t)), await this.save();
  }
  /**
   * @description 搜索项点击
   * @param {SearchItemType} type 数据类型
   * @param {(IFilterItem | IGroupItem | ICollectItem)} item 数据项
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async onSearchItemClick(e, t) {
    switch (e) {
      case "filter":
        this.handleFilterClick(t);
        break;
      case "collect":
        this.handleCollect(t);
        break;
      case "group":
        this.handleGroupClick(t);
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
    const { singleSelect: t } = this.state, d = this.state.selectedFilter.findIndex(
      (n) => n.id === e.id
    );
    if (t)
      this.state.selectedFilter = d !== -1 ? [] : [e];
    else {
      d !== -1 ? this.state.selectedFilter.splice(d, 1) : this.state.selectedFilter.push(e);
      const n = Object.values(this.exclusive).find(
        (s) => s.includes(e.id)
      );
      n != null && n.length && (this.state.selectedFilter = this.state.selectedFilter.filter((s) => n.includes(s.id) ? e.id === s.id : !0));
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
    const { selectedGroup: t } = this.state, d = t.findIndex((n) => n.id === e.id);
    d !== -1 ? t.splice(d, 1) : t.push(e), this.execGroup();
  }
  /**
   * @description 执行分组
   * @memberof OdooSearchBarController
   */
  execGroup() {
    var e, t, d;
    if (!this.xdataControl)
      return;
    const { selectedGroup: n, selectedCollect: s } = this.state, c = M(n);
    (e = s == null ? void 0 : s.groups) != null && e.length && s.groups.forEach((o) => {
      const f = n.findIndex((I) => I.id === o.id);
      f !== -1 ? c.splice(f, 1, o) : c.push(o);
    });
    const p = c.map((o) => ({
      groupFieldId: o.appDEFieldId,
      groupCodeListId: o.appCodeListId,
      dateFormat: this.dateFormat.filter((f) => {
        var I;
        return (I = o.dateFormat) == null ? void 0 : I.includes(f.value);
      }).map((f) => f.value)
    }));
    (d = (t = this.xdataControl).execGroup) == null || d.call(t, p);
  }
  /**
   * @description 处理收藏点击
   * @private
   * @param {ICollectItem} item
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async handleCollect(e) {
    const { selectedCollect: t } = this.state;
    if ((t == null ? void 0 : t.id) !== e.id) {
      this.state.selectedCollect = e;
      const { filterIds: d, groups: n } = e;
      d.length && await this.onSearch(), n.length && this.execGroup();
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
    const { selectedFilter: e, selectedCollect: t, filter: d } = this.state, n = e.map((o) => ({ ...M(o) }));
    t && d.filter((o) => t.filterIds.includes(o.id)).forEach((o) => n.push({ ...M(o) }));
    const s = [], { grouped: c, ungrouped: p } = n.reduce(
      (o, f) => {
        var I;
        const O = Object.keys(this.filterORgroup).find(
          (_) => this.filterORgroup[_].includes(f.id)
        );
        return O ? (o.grouped[O] = o.grouped[O] || {
          condtype: "GROUP",
          condop: "OR",
          searchconds: []
        }, (I = o.grouped[O].searchconds) == null || I.push(...f.searchconds)) : o.ungrouped.push(...f.searchconds), o;
      },
      { grouped: {}, ungrouped: [] }
    );
    return s.push(...p), Object.keys(c).length && s.push(...Object.values(c)), ue(
      { searchconds: s },
      (o) => {
        o.condtype === "DEFIELD" && de(o.value) && pe.test(o.value) && (o.value = Pe.execSingleLine("`".concat(o.value, "`"), {
          ...this.getEventArgs()
        }));
      },
      {
        childrenFields: ["searchconds"]
      }
    ), s.length ? [
      {
        condtype: "GROUP",
        condop: this.state.condop,
        searchconds: s
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
    const t = this.calcFilters();
    return t && (e.searchconds = t), e;
  }
  /**
   * @description 保存
   * @private
   * @returns {*}  {Promise<void>}
   * @memberof OdooSearchBarController
   */
  async save() {
    const { filter: e, collect: t, group: d } = this.state, n = d.filter((c) => c.isCustom).map((c) => ({
      id: c.id,
      type: c.type,
      caption: c.caption,
      isCustom: c.isCustom,
      appDEFieldId: c.appDEFieldId,
      appCodeListId: c.appCodeListId
    })), s = e.filter((c) => c.isCustom || c.isChange);
    await this.service.save({
      collect: t,
      filter: s,
      group: n
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
function Ve(l) {
  return typeof l == "function" || Object.prototype.toString.call(l) === "[object Object]" && !se(l);
}
const oe = [{
  valueOP: u.EQ,
  label: "等于(=)"
}, {
  valueOP: u.NOT_EQ,
  label: "不等于(<>)"
}, {
  valueOP: u.GT,
  label: "大于(>)"
}, {
  valueOP: u.GT_AND_EQ,
  label: "大于等于(>=)"
}, {
  valueOP: u.LT,
  label: "小于(<)"
}, {
  valueOP: u.LT_AND_EQ,
  label: "小于等于(<=)"
}, {
  valueOP: u.IS_NULL,
  label: "值为空(Nil)"
}, {
  valueOP: u.IS_NOT_NULL,
  label: "值不为空(NotNil)"
}, {
  valueOP: u.IN,
  label: "值在范围中(In)"
}, {
  valueOP: u.NOT_IN,
  label: "值不在范围中(NotIn)"
}, {
  valueOP: u.LIKE,
  label: "文本包含(%)"
}, {
  valueOP: u.LIFT_LIKE,
  label: "文本左包含(%#)"
}, {
  valueOP: u.RIGHT_LIKE,
  label: "文本右包含(#%)"
}, {
  valueOP: u.EXISTS,
  label: "存在(EXISTS)"
}, {
  valueOP: u.NOT_EXISTS,
  label: "不存在(NOTEXISTS)"
}], re = /* @__PURE__ */ H({
  name: "IBizFilterModeSelect",
  props: {
    value: String,
    modes: Array,
    disabled: Boolean
  },
  emits: {
    change: (l) => !0
  },
  setup(l, {
    emit: e
  }) {
    return {
      availableModes: V(() => {
        var t;
        return (t = l.modes) != null && t.length ? oe.filter((d) => l.modes.includes(d.valueOP)) : oe;
      }),
      onChange: (t) => {
        e("change", t);
      }
    };
  },
  render() {
    let l;
    return i(y("el-select"), {
      "model-value": this.value,
      disabled: this.disabled,
      teleported: !0,
      onChange: (e) => {
        this.onChange(e);
      }
    }, Ve(l = this.availableModes.map((e) => i(y("el-option"), {
      key: e.valueOP,
      value: e.valueOP,
      label: e.label
    }, null))) ? l : {
      default: () => [l]
    });
  }
});
function ne(l) {
  return typeof l == "function" || Object.prototype.toString.call(l) === "[object Object]" && !se(l);
}
const Xe = [{
  valueOP: u.EQ,
  label: "等于(=)"
}, {
  valueOP: u.NOT_EQ,
  label: "不等于(<>)"
}, {
  valueOP: u.GT,
  label: "大于(>)"
}, {
  valueOP: u.GT_AND_EQ,
  label: "大于等于(>=)"
}, {
  valueOP: u.LT,
  label: "小于(<)"
}, {
  valueOP: u.LT_AND_EQ,
  label: "小于等于(<=)"
}, {
  valueOP: u.IS_NULL,
  label: "值为空(Nil)"
}, {
  valueOP: u.IS_NOT_NULL,
  label: "值不为空(NotNil)"
}, {
  valueOP: u.IN,
  label: "值在范围中(In)"
}, {
  valueOP: u.NOT_IN,
  label: "值不在范围中(NotIn)"
}, {
  valueOP: u.LIKE,
  label: "文本包含(%)"
}, {
  valueOP: u.LIFT_LIKE,
  label: "文本左包含(%#)"
}, {
  valueOP: u.RIGHT_LIKE,
  label: "文本右包含(#%)"
}, {
  valueOP: u.EXISTS,
  label: "存在(EXISTS)"
}, {
  valueOP: u.NOT_EXISTS,
  label: "不存在(NOTEXISTS)"
}], Ke = /* @__PURE__ */ H({
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
  setup(l, {
    emit: e
  }) {
    const t = ie("search-item-filter-tree"), d = V(() => l.filterNodes), n = (a) => {
      if (a.nodeType === "ITEMS" && a.simple) {
        const g = a.children[0];
        return l.filterControllers.find((E) => {
          if (E.type === "SIMPLE_ITEMS") {
            const C = E;
            if (C.fieldName === a.field && C.valueOP === a.valueOP && C.subFieldName === g.field && C.subValueOP === g.valueOP)
              return !0;
          }
          return !1;
        });
      }
      const {
        field: m,
        valueOP: b
      } = a;
      return l.filterControllers.find((g) => g.type === "SIMPLE_ITEMS" ? !1 : g.fieldName === m ? g.valueOP ? g.valueOP === b : !0 : !1);
    }, s = [];
    l.filterControllers.forEach((a) => {
      let m = s.find((b) => b.name === a.key);
      a.hidden || (m === void 0 && (m = {
        name: a.key,
        fieldName: a.fieldName,
        label: a.label,
        valueOPs: []
      }, a.type === "SIMPLE_ITEMS" && (m.simpleFilterC = a), s.push(m)), a.valueOP ? m.valueOPs.push(a.valueOP) : m.valueOPs = Xe.map((b) => b.valueOP));
    });
    const c = N([]);
    s.forEach(async (a) => {
      var m, b;
      const g = l.filterControllers.find((E) => E.key === a.name);
      g && c.value.push({
        appDEFieldId: a.fieldName,
        caption: a.label,
        valueOPs: a.valueOPs,
        appDataEntityId: l.schemaEntityMap.get(a.fieldName),
        appDataEntityFullTag: (m = g.appDataEntity) == null ? void 0 : m.defullTag,
        appCodeListId: (b = g.model.editor) == null ? void 0 : b.appCodeListId
      });
    });
    const p = N(), o = N(l.filterMode || "default"), f = N(""), I = (a) => {
      f.value = a, e("customCondChange", f.value);
    };
    Z(() => l.customCond, () => {
      f.value = l.customCond;
    }, {
      immediate: !0
    });
    const O = (a, m = s) => {
      if (!a)
        return;
      const b = m.find((g) => g.name === a);
      if (b)
        return b.valueOPs;
    }, _ = (a, m, b = s) => {
      const g = b.find((E) => E.name === m);
      if (!g) {
        ibiz.log.error("allFields找不到属性标识为".concat(m, "的"));
        return;
      }
      if (Ge(a), g.simpleFilterC) {
        g.simpleFilterC.addSimpleFilterNode(a);
        return;
      }
      a.nodeType = "FIELD", a.field = g.fieldName;
    }, z = (a, m) => {
      a.valueOP = m, a.value = null, ["EXISTS", "NOTEXISTS"].includes(m) ? Object.assign(a, {
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
    }, A = (a, m) => {
      a.logicType = m;
    }, q = (a) => {
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
    }, P = (a) => {
      a.children.push({
        nodeType: "FIELD",
        field: null,
        valueOP: null,
        value: null
      });
    }, F = (a, m) => {
      if (m.noEditor || a.valueOP && he.includes(a.valueOP))
        return null;
      let b = null;
      if (m.editorProvider) {
        const {
          data: g,
          value: E
        } = m.calcEditorProps(a), C = y(m.editorProvider.formEditor);
        b = ce(C, {
          key: m.editor.model.id,
          value: E,
          controller: m.editor,
          disabled: a.disabled,
          data: g,
          onChange: (J, $) => {
            m.onEditorChange(a, J, $);
          }
        });
      } else
        b = i(y("not-supported-editor"), {
          modelData: m.model.editor
        }, null);
      return i("div", {
        class: t.e("editor")
      }, [b]);
    }, S = (a, m) => {
      if (a.hidden)
        return;
      let b = s;
      m && (b = m.allFields);
      const g = O(a.field, b);
      let E = null;
      if (a.field && a.valueOP)
        if (m) {
          const C = m.getSubFilterController(a.field, a.valueOP);
          E = F(a, C);
        } else {
          const C = n(a);
          C && !["EXISTS", "NOTEXISTS"].includes(C.valueOP) && (E = F(a, C));
        }
      return i("div", {
        class: t.b("item")
      }, [i(y("el-select"), {
        disabled: a.disabled,
        "model-value": a.field,
        teleported: !0,
        filterable: !0,
        class: t.e("field-select"),
        onChange: (C) => {
          _(a, C, b);
        }
      }, {
        default: () => [b == null ? void 0 : b.map((C) => i(y("el-option"), {
          key: C.name,
          value: C.name,
          label: C.label
        }, null))]
      }), g && g.length > 0 && i(re, {
        disabled: a.disabled,
        class: t.e("mode-select"),
        value: a.valueOP,
        modes: g,
        onChange: (C) => {
          z(a, C);
        }
      }, null), E]);
    };
    let x = (a) => i("div", null, null);
    const Q = (a, m, b) => {
      if (!a.hidden)
        return a.nodeType === "ITEMS" ? x(a) : i("div", {
          class: t.b("group")
        }, [i("div", {
          class: t.be("group", "actions")
        }, [i(y("el-button"), {
          text: !0,
          type: "primary",
          onClick: () => {
            if (o.value === "pql") {
              o.value = "default";
              return;
            }
            q(a);
          }
        }, {
          default: () => [o.value === "pql" ? "切换组" : "添加组"]
        }), i(y("el-button"), {
          text: !0,
          onClick: () => {
            if (o.value === "pql") {
              o.value = "default";
              return;
            }
            P(a);
          }
        }, {
          default: () => [o.value === "pql" ? "切换项" : "添加项"]
        }), b && i(y("el-button"), {
          text: !0,
          onClick: () => {
            o.value = "pql";
          }
        }, {
          default: () => [R("添加PQL")]
        }), i(y("el-select"), {
          "model-value": a.logicType,
          teleported: !1,
          class: t.be("group", "logic-type"),
          onChange: (g) => {
            o.value = "default", A(a, g);
          }
        }, {
          default: () => [i(y("el-option"), {
            key: "AND",
            value: "AND",
            label: "AND"
          }, null), i(y("el-option"), {
            key: "OR",
            value: "OR",
            label: "OR"
          }, null)]
        })]), o.value === "pql" && i("div", {
          class: t.be("group", "editor")
        }, [i(y("iBizPqlEditor"), {
          ref: "pqlEditor",
          value: f.value,
          fields: c.value,
          context: l.context,
          params: l.params,
          onChange: I
        }, null)]), o.value !== "pql" && i("div", {
          class: t.be("group", "list")
        }, [a.children.length > 0 && a.children.map((g, E) => {
          const C = g.nodeType === "FIELD" ? S(g, m) : Q(g, m);
          return C ? i("div", {
            class: t.be("group", "list-item")
          }, [i("div", {
            class: t.be("group", "list-item-left")
          }, [a.logicType]), C, i(y("iBizIcon"), {
            class: t.be("group", "list-item-right"),
            onClick: () => {
              a.children.splice(E, 1);
            },
            icon: {
              cssClass: "trash"
            }
          }, null)]) : null;
        })])]);
    };
    return x = (a) => {
      let m;
      const b = n(a);
      if (b) {
        if (a.simple) {
          let g;
          const E = a.children[0];
          return E ? [i(y("el-select"), {
            disabled: E.disabled,
            "model-value": b.key,
            teleported: !0,
            filterable: !0,
            class: t.e("field-select"),
            onChange: (C) => {
              _(a, C);
            }
          }, ne(g = s.map((C) => i(y("el-option"), {
            key: C.name,
            value: C.name,
            label: C.label
          }, null))) ? g : {
            default: () => [g]
          }), i(re, {
            disabled: !0,
            class: t.e("mode-select"),
            value: E.valueOP,
            modes: [E.valueOP]
          }, null), F(E, b)] : void 0;
        }
        return i("div", {
          class: (t.b("group"), t.bm("group", "items"))
        }, [i("div", {
          class: t.be("group", "actions")
        }, [S(a), i(y("el-button"), {
          text: !0,
          onClick: () => {
            P(a);
          }
        }, ne(m = ibiz.i18n.t("control.searchBar.filterTree.addItem")) ? m : {
          default: () => [m]
        })]), i("div", {
          class: t.be("group", "list")
        }, [a.children.length > 0 && a.children.map((g, E) => {
          const C = g.nodeType === "FIELD" ? S(g, b) : Q(g, b);
          return i("div", {
            class: t.be("group", "list-item")
          }, [i("div", {
            class: t.be("group", "list-item-left")
          }, [R("AND")]), C, i(y("iBizIcon"), {
            class: t.be("group", "list-item-right"),
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
      ns: t,
      UiFilterNodes: d,
      currentCustomCond: f,
      verify: () => {
        var a, m;
        let b = !0;
        return o.value === "pql" && p.value && ((m = (a = p.value).verify) != null && m.call(a) || (b = !1)), b;
      },
      renderFilterGroup: Q,
      renderFilterItem: S
    };
  },
  render() {
    return i("div", {
      class: [this.ns.b()]
    }, [this.UiFilterNodes.length > 0 && this.UiFilterNodes.map((l) => l.nodeType === "FIELD" ? this.renderFilterItem(l) : this.renderFilterGroup(l, void 0, !0))]);
  }
}), He = /* @__PURE__ */ H({
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
  setup(l) {
    const e = ie("control-odoo-search-bar-modal"), t = N(), d = N(), n = N([]), s = N(""), c = N(!1), p = Be(M(l.item) || {
      id: ee(),
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
    }), o = l.controller.getSearchCondsById(p.id), f = N(!p.isCustom && !!o && (o.caption !== p.caption || je(!p.searchconds || !p.searchconds.length ? [{
      condtype: "GROUP",
      condop: "AND",
      searchconds: []
    }] : o.searchconds, p.searchconds)));
    Z(() => p.caption, () => {
      !p.isCustom && o && (f.value = p.caption !== o.caption);
    }), Z(() => n.value, () => {
      !p.isCustom && o && c.value && (f.value = !0);
    }, {
      deep: !0
    });
    const I = () => {
      var P;
      if (c.value = !1, (!p.searchconds || !p.searchconds.length) && (p.searchconds = [{
        condtype: "GROUP",
        condop: "AND",
        searchconds: []
      }]), n.value = p.searchconds.map((F) => Ne(F)), n.value.length) {
        const {
          children: F
        } = n.value[0];
        if (Array.isArray(F)) {
          const S = F.findIndex((x) => x.nodeType === "CUSTOM" && x.customType === "PQL");
          if (S !== -1) {
            const x = F.splice(S, 1);
            s.value = ((P = x[0]) == null ? void 0 : P.customCond) || "";
          }
        }
        ue(n.value[0], (S) => {
          S.nodeType === "FIELD" && S.field && S.valueOP && de(S.value) && pe.test(S.value) && (S.disabled = !0);
        });
      }
      setTimeout(() => {
        c.value = !0;
      });
    }, O = (P) => {
      if (!s.value)
        return;
      P[0] || (P[0] = {
        nodeType: "GROUP",
        logicType: "AND",
        children: []
      });
      const F = P[0];
      Array.isArray(F.children) || (F.children = []);
      const S = F.children.find((x) => x.nodeType === "CUSTOM" && x.customType === "PQL");
      S ? S.customCond = s.value : F.children.push({
        nodeType: "CUSTOM",
        customType: "PQL",
        customCond: s.value
      });
    }, _ = async () => {
      var P, F;
      let S = (P = t.value) == null ? void 0 : P.verify();
      try {
        await ((F = d.value) == null ? void 0 : F.validate());
      } catch (x) {
        S = !1;
      }
      return S;
    }, z = async () => {
      if (!await _())
        return;
      const P = M(n.value);
      O(P), p.searchconds = Le(P), p.isCustom || (p.isChange = f.value), l.modal.dismiss({
        ok: !0,
        data: [p]
      });
    }, A = () => {
      l.modal.dismiss({
        ok: !1
      });
    }, q = async () => {
      await ibiz.confirm.warning({
        title: "警告",
        desc: "您确定要还原该筛选条件吗？还原后不可恢复！"
      }) && (Object.assign(p, M(o)), I(), f.value = !0);
    };
    return I(), {
      ns: e,
      data: p,
      isInit: c,
      formRef: d,
      customCond: s,
      showRestore: f,
      filterNodes: n,
      filterTreeRef: t,
      onCancel: A,
      onConfirm: z,
      onRestore: q
    };
  },
  render() {
    return i("div", {
      class: this.ns.b()
    }, [i("div", {
      class: this.ns.e("header")
    }, [i("div", null, [this.item ? "变更筛选" : "添加自定义筛选"]), this.showRestore && i(y("el-button"), {
      type: "primary",
      onClick: this.onRestore
    }, {
      default: () => [R("还原")]
    })]), i(y("el-form"), {
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
      default: () => [i(y("el-form-item"), {
        label: "标题",
        prop: "caption"
      }, {
        default: () => [i(y("el-input"), {
          modelValue: this.data.caption,
          "onUpdate:modelValue": (l) => this.data.caption = l,
          placeholder: "请输入标题"
        }, null)]
      }), i(Ke, {
        ref: "filterTreeRef",
        customCond: this.customCond,
        filterNodes: this.filterNodes,
        params: this.controller.params,
        context: this.controller.context,
        schemaEntityMap: this.controller.schemaEntityMap,
        filterControllers: this.controller.filterControllers,
        onCustomCondChange: (l) => {
          this.customCond = l;
        }
      }, null)]
    }), i("div", {
      class: this.ns.e("footer")
    }, [i(y("el-button"), {
      type: "text",
      onClick: this.onCancel
    }, {
      default: () => [R("取消")]
    }), i(y("el-button"), {
      type: "primary",
      onClick: this.onConfirm
    }, {
      default: () => [R("确定")]
    })])]);
  }
});
function Je(l) {
  return typeof l == "function" || Object.prototype.toString.call(l) === "[object Object]" && !se(l);
}
const $e = () => i("svg", {
  viewBox: "0 0 1024 1024",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  "p-id": "4437",
  width: "1em",
  height: "1em"
}, [i("path", {
  d: "M512 570.88l196.864 196.8 58.88-58.88L570.752 512l196.864-196.864-58.816-58.88L512 453.248 315.136 256.32l-58.88 58.88L453.248 512l-196.864 196.864 58.88 58.88z",
  fill: "currentColor",
  "p-id": "4438"
}, null)]), Y = /* @__PURE__ */ H({
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
    const l = ke((...r) => new Qe(...r)), e = ie("control-odoo-search-bar"), {
      zIndex: t
    } = _e(), d = [{
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
    }], n = {
      zIndex: t.increment()
    }, s = N(!1), c = N(), p = N(""), o = N(), f = N(!1), I = N(!1);
    let O;
    const _ = V(() => {
      const {
        filter: r,
        collect: h,
        group: v
      } = l.state;
      return {
        group: v,
        filter: r,
        collect: h
      };
    }), z = V(() => l.state.schemaFields.filter((r) => {
      var h;
      return ((h = _.value.group) == null ? void 0 : h.findIndex((v) => v.appDEFieldId.toLowerCase() === r.key)) === -1 && r.description.includes(p.value);
    })), A = V(() => {
      const {
        selectedFilter: r,
        condop: h,
        selectedCollect: v,
        selectedGroup: T
      } = l.state, w = [];
      if (!r.length && !T.length && !v)
        return w;
      if (r.length && l.state.showFilter) {
        const L = [], D = {}, G = {};
        r.forEach((k) => {
          const U = Object.keys(l.filterORgroup).find((j) => l.filterORgroup[j].includes(k.id)), W = Object.keys(l.exclusive).find((j) => {
            var ae;
            return (ae = l.exclusive[j]) == null ? void 0 : ae.includes(k.id);
          });
          if (U) {
            const j = G[U] || [];
            j.push(k), G[U] = j;
          } else if (W) {
            const j = D[W] || [];
            j.push(k), D[W] = j;
          } else
            L.push(k);
        }), L.length && w.push({
          type: "filter",
          icon: {
            appId: "",
            cssClass: "fa fa-filter"
          },
          filterType: "FILTER",
          caption: L.map((k) => k.caption).join(" ".concat(te[h], " "))
        }), Object.keys(G).length && Object.keys(G).forEach((k) => {
          w.push({
            type: "filter",
            filterTypeId: k,
            icon: {
              appId: "",
              cssClass: "fa fa-filter"
            },
            filterType: "OR",
            caption: G[k].map((U) => U.caption).join(" ".concat(te.OR, " "))
          });
        }), Object.keys(D).length && Object.keys(D).forEach((k) => {
          w.push({
            type: "filter",
            filterTypeId: k,
            icon: {
              appId: "",
              cssClass: "fa fa-filter"
            },
            filterType: "EXCLUSIVE",
            caption: D[k].map((U) => U.caption).join("")
          });
        });
      }
      return T.length && l.state.showGroup && w.push({
        type: "group",
        icon: {
          appId: "",
          cssClass: "layers-outline"
        },
        caption: T.map((L) => {
          var D;
          return (D = L.dateFormat) != null && D.length ? l.dateFormat.filter((G) => L.dateFormat.includes(G.value)).map((G) => "".concat(L.caption, ": ").concat(G.label)).join(" > ") : L.caption;
        }).join(" > ")
      }), v && l.state.showCollect && w.push({
        type: "collect",
        icon: {
          appId: "",
          cssClass: "fa fa-star"
        },
        caption: v.caption
      }), w;
    }), q = (r) => {
      var h;
      const {
        selectedGroup: v,
        selectedFilter: T,
        selectedCollect: w
      } = l.state, L = [...v, ...T];
      return w && L.push(w), !!L.find((D) => D.id === r.id) || ((h = r.dateFormat) == null ? void 0 : h.length) > 0;
    }, P = () => {
      O == null || O.pause(), I.value = !1;
    }, F = () => {
      if (O)
        return O.proceed();
      O = De(c, (r) => {
        r.target.closest(".".concat(e.e("reference"))) || (s.value = !1);
      });
    }, S = (r) => {
      r.stopPropagation(), l.onSearch();
    }, x = async () => {
      const {
        selectedFilter: r,
        selectedGroup: h,
        collectName: v
      } = l.state;
      if (!v)
        return ibiz.message.error("必须输入收藏名称");
      const T = {
        id: ee(),
        isCustom: !0,
        filterIds: r.map((w) => w.id),
        groups: h,
        caption: v
      };
      I.value = !1, await l.updateByType("collect", "update", T), l.state.collectName = l.view.model.caption;
    }, Q = (r) => {
      r ? O == null || O.pause() : O == null || O.proceed(), r || (p.value = "");
    }, a = async (r) => {
      const h = ibiz.overlay.createModal((T) => ce(He, {
        item: r,
        modal: T,
        controller: l
      }), {}, {
        width: "800px",
        height: "auto"
      });
      O == null || O.pause(), h.present();
      const v = await h.onWillDismiss();
      O == null || O.proceed(), v.ok && v.data && l.updateByType("filter", "update", v.data[0]);
    }, m = async (r, h) => {
      O == null || O.pause();
      const v = await ibiz.confirm.warning({
        title: "警告",
        desc: "您确定要删除 ".concat(h.caption, " 吗？删除后不可恢复！")
      });
      O == null || O.proceed(), v && l.updateByType(r, "remove", h);
    }, b = async (r) => {
      const h = l.state.schemaFields.find((v) => v.key === r);
      if (h) {
        const v = {
          isCustom: !0,
          id: ee(),
          appDEFieldId: r,
          type: h.type,
          isExpand: !1,
          caption: h.description,
          appCodeListId: h.enumSource
        };
        await l.updateByType("group", "update", v);
      }
    }, g = (r, h) => {
      if (r === "group" && h.type === "date") {
        h.isExpand = !h.isExpand;
        return;
      }
      l.onSearchItemClick(r, h);
    }, E = (r, h) => {
      r.dateFormat || (r.dateFormat = []);
      const v = r.dateFormat.findIndex((L) => L === h);
      v !== -1 ? r.dateFormat.splice(v, 1) : r.dateFormat.push(h);
      const T = r.dateFormat.length > 0, w = l.state.selectedGroup.findIndex((L) => L.id === r.id);
      w !== -1 && !T ? l.state.selectedGroup.splice(w, 1) : w === -1 && T && l.state.selectedGroup.push(r), l.execGroup();
    }, C = (r) => {
      r.target.closest(".".concat(e.em("reference", "suffix"))) ? s.value = !s.value : s.value = !0;
    }, J = (r) => i("div", {
      class: [e.e("search-item"), e.em("search-item", r.type)]
    }, [i("div", {
      class: e.em("search-item", "icon")
    }, [i(y("iBizIcon"), {
      icon: r.icon
    }, null)]), i("div", {
      class: e.em("search-item", "caption"),
      title: r.caption
    }, [r.caption]), i("div", {
      class: e.em("search-item", "remove"),
      onClick: () => l.onClearSelectedByType(r)
    }, [$e()])]), $ = () => i("div", {
      ref: o,
      class: [e.e("reference"), e.is("search-focus", f.value)],
      onClick: C
    }, [i("div", {
      class: e.em("reference", "left")
    }, [i(y("el-button"), {
      class: e.em("reference", "prefix"),
      type: "text",
      onClick: (r) => S(r)
    }, {
      default: () => [i(y("iBizIcon"), {
        icon: {
          cssClass: "fa fa-search"
        }
      }, null)]
    }), i("div", {
      class: e.em("reference", "content")
    }, [i("div", {
      class: e.e("search-content")
    }, [A.value.map((r) => J(r)), i(y("el-input"), {
      type: "text",
      placeholder: "搜索...",
      modelValue: l.state.query,
      "onUpdate:modelValue": (r) => l.state.query = r,
      onFocus: () => f.value = !0,
      onBlur: () => f.value = !1,
      onChange: () => l.onSearch()
    }, null)])])]), i(y("el-button"), {
      class: [e.em("reference", "suffix"), e.is("active", s.value)]
    }, {
      default: () => [i(y("ion-icon"), {
        name: s.value ? "chevron-up-outline" : "chevron-down-outline"
      }, null)]
    })]), fe = (r) => r === "filter" ? i("div", {
      class: e.em("list", "item"),
      onClick: () => a()
    }, [i("div", {
      title: "添加自定义筛选",
      class: "caption action-caption"
    }, [R("添加自定义筛选")])]) : r === "collect" ? [i("div", {
      class: e.em("list", "item")
    }, [i("div", {
      title: "保存当前搜索",
      class: "caption action-caption",
      onClick: () => {
        I.value = !I.value;
      }
    }, [R("保存当前搜索")]), i("div", {
      class: ["action", "collapse-icon"]
    }, [i(y("ion-icon"), {
      name: I.value ? "chevron-up-outline" : "chevron-down-outline"
    }, null)])]), I.value && i("div", {
      class: e.e("expand-item")
    }, [i("div", {
      class: e.em("expand-item", "form")
    }, [i(y("el-input"), {
      modelValue: l.state.collectName,
      "onUpdate:modelValue": (h) => l.state.collectName = h,
      class: e.em("expand-item", "caption"),
      placeholder: "请输入收藏名称"
    }, null), i("div", {
      class: e.em("expand-item", "btn")
    }, [i(y("el-button"), {
      onClick: () => x()
    }, {
      default: () => [R("保存")]
    })])])])] : i(y("el-dropdown"), {
      trigger: "click",
      class: e.e("dropdown"),
      onCommand: b,
      onVisibleChange: Q,
      "popper-class": e.em("dropdown", "popper")
    }, {
      default: () => i("div", {
        class: e.em("list", "item")
      }, [i("div", {
        title: "添加自定义分组",
        class: "caption action-caption"
      }, [R("添加自定义分组")]), i("div", {
        class: ["action", "collapse-icon"]
      }, [i(y("ion-icon"), {
        name: "chevron-down-outline"
      }, null)])]),
      dropdown: () => {
        let h;
        return i("div", {
          class: e.em("dropdown", "popper-content")
        }, [i(y("el-input"), {
          modelValue: p.value,
          "onUpdate:modelValue": (v) => p.value = v
        }, null), i(y("el-dropdown-menu"), null, Je(h = z.value.map((v) => i(y("el-dropdown-item"), {
          command: v.key
        }, {
          default: () => [v.description]
        }))) ? h : {
          default: () => [h]
        })]);
      }
    }), me = (r, h) => {
      const v = [];
      return r === "filter" && v.push(i(y("iBizIcon"), {
        title: "设置",
        class: "action-icon setting-icon",
        icon: {
          cssClass: "fa fa-fw fa-cog"
        },
        onClick: () => a(h)
      }, null)), h.type === "date" && v.push(i("div", {
        class: ["action", "collapse-icon"]
      }, [i(y("ion-icon"), {
        name: h.isExpand ? "chevron-up-outline" : "chevron-down-outline"
      }, null)])), h.isCustom && v.push(i(y("iBizIcon"), {
        title: "删除",
        class: "action-icon remove-icon",
        icon: {
          cssClass: "close-outline"
        },
        onClick: () => m(r, h)
      }, null)), v;
    }, ve = (r, h) => h.isExpand && h.type === "date" ? i("div", {
      class: e.e("expand-item")
    }, [i("div", {
      class: e.em("expand-item", "list")
    }, [l.dateFormat.map((v) => {
      var T;
      return i("div", {
        class: ["item", e.is("selected", (T = h.dateFormat) == null ? void 0 : T.includes(v.value))],
        onClick: () => E(h, v.value)
      }, [v.label]);
    })])]) : null, ye = (r, h) => [i("div", {
      class: e.em("list", "item"),
      onClick: () => g(r, h)
    }, [i(y("iBizIcon"), {
      icon: {
        cssClass: "fa fa-check"
      },
      class: ["selected-icon", e.is("selected", q(h))]
    }, null), i("div", {
      title: h.caption,
      class: "caption"
    }, [h.caption]), i("div", {
      class: "action",
      onClick: (v) => v.stopPropagation()
    }, [me(r, h)])]), ve(r, h)];
    return {
      c: l,
      ns: e,
      popperStyle: n,
      dropDownRef: c,
      dropDownVisible: s,
      renderList: (r) => {
        var h;
        const v = d.find((T) => T.type === r);
        if (v)
          return i("div", {
            class: [e.e("list"), e.e("".concat(r, "-list"))]
          }, [i("div", {
            class: e.em("list", "header")
          }, [i(y("iBizIcon"), {
            icon: v.icon,
            class: "icon"
          }, null), i("div", {
            class: "caption"
          }, [i("span", {
            title: v.caption
          }, [v.caption])])]), i("div", {
            class: e.em("list", "content")
          }, [(h = _.value[r]) == null ? void 0 : h.map((T) => [ye(r, T), T.showSeparator && i(y("el-divider"), {
            class: e.em("list", "separator"),
            "border-style": "double"
          }, null)])]), i("div", {
            class: e.em("list", "footer")
          }, [fe(r)])]);
      },
      renderDefault: $,
      onPopoverHide: P,
      onPopoverShow: F
    };
  },
  render() {
    return i(y("iBizControlBase"), {
      controller: this.c,
      class: [this.ns.b()]
    }, {
      default: () => [i(y("el-popover"), {
        width: "600",
        trigger: "click",
        visible: this.dropDownVisible,
        onHide: this.onPopoverHide,
        onShow: this.onPopoverShow,
        "popper-style": this.popperStyle,
        "popper-class": this.ns.e("popover")
      }, {
        reference: () => this.renderDefault(),
        default: () => i("div", {
          ref: "dropDownRef",
          class: this.ns.e("content")
        }, [this.c.state.showFilter && this.renderList("filter"), this.c.state.showGroup && this.renderList("group"), this.c.state.showCollect && this.renderList("collect")])
      })]
    });
  }
});
class We {
  constructor() {
    B(this, "component", "IBizOdooSearchBarControl");
  }
}
const Ye = xe(
  Y,
  function(l) {
    l.component(Y.name, Y), ge(
      "CUSTOM_ODOO_SEARCH_BAR",
      () => new We()
    );
  }
), at = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(l) {
    l.use(Ye);
  }
};
export {
  Ye as IBizOdooSearchBarControl,
  at as default
};
