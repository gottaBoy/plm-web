import './style.css';
var ve = Object.defineProperty;
var be = (t, s, e) => s in t ? ve(t, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[s] = e;
var k = (t, s, e) => (be(t, typeof s != "symbol" ? s + "" : s, e), e);
import { useUIStore as Se, useNamespace as U, useControlController as J, withInstall as Ee } from "@ibiz-template/vue3-util";
import { Srfuf as L, GridRowState as ee, ControlVO as De, TreeGridController as Re, calcDeCodeNameById as xe, GridNotifyState as Y, GridController as Ne, ScriptFactory as Pe, registerControlProvider as Ge } from "@ibiz-template/runtime";
import { ref as M, computed as T, watch as O, nextTick as $, reactive as Ie, createVNode as y, resolveComponent as R, defineComponent as Te, onMounted as ke, onUnmounted as Le, createTextVNode as F, mergeProps as te, h as Ae } from "vue";
import { toNumber as Oe, isArray as Z } from "lodash-es";
import { isElementSame as Fe, RuntimeError as A, awaitTimeout as $e, mergeDefaultInLeft as Me, RuntimeModelError as ze, recursiveIterate as Be } from "@ibiz-template/core";
import { createUUID as se } from "qx-util";
import { computePosition as _e } from "@floating-ui/dom";
class Ue {
  constructor() {
    k(this, "component", "IBizNumberGridControl");
  }
}
function Qe(t) {
  const s = M(), e = M([]), a = t, o = T(() => t.state.items.map((i) => (i.hasChildren = t.state.items.some(
    (f) => i[a.treeGridValueField] && i[a.treeGridValueField] === f[a.treeGridParentField]
  ), i.children = [], i))), r = T(() => {
    const i = t.state.items.map(
      (f) => f[a.treeGridValueField]
    );
    return o.value.filter(
      (f) => !f[a.treeGridParentField] || !i.includes(f[a.treeGridParentField])
    );
  });
  async function m(i, f, C) {
    if (!(t.model.enableGroup && i.isGroupData) && i.srfuf !== L.CREATE)
      if (t.editShowMode === "row" && t.model.enableRowEdit) {
        const b = t.findRowState(i);
        b && b.showRowEdit !== !0 && await t.switchRowEdit(b, !0);
      } else
        t.onRowClick(i);
  }
  function d(i) {
    t.model.enableGroup && i.isGroupData || i.srfuf !== L.CREATE && t.onDbRowClick(i);
  }
  function g(i) {
    return !!e.value.find(
      (f) => i.tempsrfkey === f.tempsrfkey
    );
  }
  function l() {
    return t.model.enableGroup ? e.value.filter((i) => !i.isGroupData) : [...e.value];
  }
  O(
    [
      () => s.value,
      () => t.state.isLoaded,
      () => t.state.selectedData
    ],
    ([i, f, C]) => {
      !f || !i || (Fe(C, l()) || (e.value = C), t.state.singleSelect && (C[0] ? s.value.setCurrentRow(C[0], !0) : s.value.setCurrentRow()));
    }
  );
  function u(i) {
    const { prop: f, order: C } = i, b = t.fieldColumns[f].model.appDEFieldId;
    let E;
    C === "ascending" ? E = "asc" : C === "descending" && (E = "desc"), "".concat(b, ",").concat(E) !== t.state.sortQuery && (t.setSort(b, E), t.load());
  }
  function h({ row: i }) {
    let f = "";
    return e.value.some(
      (b) => b.tempsrfkey === i.tempsrfkey
    ) && (f = "current-row"), i.srfuf === L.CREATE && (f += " is-create-row"), i.srfkey && (f += " id-".concat(i.srfkey)), f;
  }
  function v({
    _row: i,
    column: f,
    _rowIndex: C,
    _columnIndex: b
  }) {
    var P;
    const E = (P = t.model.degridColumns) == null ? void 0 : P.find((z) => z.codeName === f.property);
    return E && E.headerSysCss && E.headerSysCss.cssName ? E.headerSysCss.cssName : "";
  }
  return O(
    () => t.state.sortQuery,
    (i) => {
      if (i) {
        const f = t.state.sortQuery.split(",")[0], C = t.state.sortQuery.split(",")[1];
        if (f && C) {
          const b = C === "desc" ? "descending" : "ascending", E = () => {
            s.value ? $(() => {
              s.value.sort(f, b);
            }) : setTimeout(E, 500);
          };
          E();
        }
      }
    }
  ), {
    tableRef: s,
    treeGirdData: r,
    treeNodeData: o,
    curSelectedData: e,
    getSelection: l,
    onRowClick: m,
    onDbRowClick: d,
    isSelected: g,
    onSortChange: u,
    handleRowClassName: h,
    handleHeaderCellClassName: v
  };
}
function je(t, s) {
  const { controlParam: e } = s.modelData, a = () => {
    s.data && (t.state.items = s.data, t.state.rows = s.data.map((l) => new ee(new De(l), t)));
  }, o = T(() => {
    var u;
    const l = Object.values(t.fieldColumns).find(
      (h) => h.model.appDEFieldId === t.model.minorSortAppDEFieldId
    );
    return {
      prop: l == null ? void 0 : l.model.codeName,
      order: ((u = t.model.minorSortDir) == null ? void 0 : u.toLowerCase()) === "desc" ? "descending" : "ascending"
    };
  });
  t.evt.on("onCreated", async () => {
    s.isSimple && (a(), t.state.isLoaded = !0);
  }), O(
    () => s.data,
    () => {
      s.isSimple && a();
    },
    {
      deep: !0
    }
  );
  const r = T(() => {
    const { state: l } = t;
    let u = {
      appId: t.context.srfappid,
      cssClass: "cube-outline"
    };
    if (e && e.ctrlParams && e.ctrlParams.GROUPICON && (u.cssClass = e.ctrlParams.GROUPICON), t.model.enableGroup) {
      const h = [];
      return l.groups.forEach((v) => {
        if (!v.children.length)
          return;
        v.groupIcon && (u = v.groupIcon);
        const i = [...v.children], f = se();
        h.push({
          tempsrfkey: f,
          srfkey: f,
          isGroupData: !0,
          caption: v.caption,
          children: i,
          groupIcon: u
        });
      }), h;
    }
    return l.rows.map((h) => h.data);
  }), m = T(() => {
    if (t.isMultistageHeader)
      return t.model.degridColumns || [];
    const l = [];
    return t.state.columnStates.forEach((u) => {
      var v, i;
      if (u.hidden)
        return;
      const h = ((v = t.fieldColumns[u.key]) == null ? void 0 : v.model) || ((i = t.uaColumns[u.key]) == null ? void 0 : i.model);
      h && l.push(h);
    }), l;
  });
  return {
    tableData: r,
    renderColumns: m,
    defaultSort: o,
    summaryMethod: ({
      columns: l
    }) => l.map((u, h) => h === 0 ? t.aggTitle : t.state.aggResult[u.property]),
    headerDragend: (l, u, h) => {
      const { property: v } = h, i = t.columns[v], f = t.state.columnStates.find((C) => C.key === v);
      if (i.isAdaptiveColumn) {
        f && (f.adaptive = !1), i.isAdaptiveColumn = !1, i.model.width = l;
        const C = m.value.findIndex((b) => t.columns[b.codeName].isAdaptiveColumn);
        t.hasAdaptiveColumn = C !== -1;
      }
      f && (f.columnWidth = l, t.saveColumnStates());
    }
  };
}
function Ve(t) {
  function s(o) {
    !o || o === t.state.curPage || (t.state.curPage = o, t.load());
  }
  function e(o) {
    !o || o === t.state.size || (t.state.size = o, t.state.curPage === 1 && t.load());
  }
  function a() {
    t.load();
  }
  return { onPageChange: s, onPageSizeChange: e, onPageRefresh: a };
}
function Ke(t, s) {
  let e;
  const a = M(!1), o = M(), r = Ie({}), m = (h) => {
    if (!t.value)
      throw new A("找不到表格组件引用");
    const v = t.value.$el;
    let i = ".editing-row";
    h.data.srfkey && (i += ".id-".concat(h.data.srfkey));
    const f = v.querySelector(i);
    if (!f)
      throw new A("找不到对应的表格行dom元素");
    return f;
  }, d = async (h) => {
    const v = m(h);
    if (!e)
      throw new A("拿不到pop组件的实例");
    const i = e.$el, {
      x: f,
      y: C
    } = await _e(v, i, {
      placement: "bottom"
    });
    Object.assign(r, {
      top: "".concat(C, "px"),
      left: "".concat(f, "px")
    }), o.value = h, a.value = !0;
  }, g = async () => {
    o.value && s.switchRowEdit(o.value, !1, !0);
  }, l = async () => {
    o.value && s.switchRowEdit(o.value, !1, !1);
  }, u = () => {
    const h = a.value && s.state.rows[s.state.rows.length - 1].showRowEdit;
    return [y("div", {
      class: "row-edit-popover__placeholder",
      style: {
        display: h ? "block" : "none"
      }
    }, null), y(R("iBizRowEditPopover"), {
      ref: (v) => {
        e = v;
      },
      style: r,
      show: a.value,
      onConfirm: g,
      onCancel: l
    }, null)];
  };
  return s.evt.on("onRowEditChange", (h) => {
    h.row.showRowEdit ? setTimeout(() => {
      d(h.row);
    }, 0) : (o.value = void 0, a.value = !1, Object.assign(r, {
      top: void 0,
      left: void 0
    }));
  }), {
    renderPopover: u
  };
}
class He extends Re {
  constructor() {
    super(...arguments);
    /**
     * 是否默认展开所有
     *
     * @type {boolean}
     * @memberof NumberTreeGridController
     */
    k(this, "defaultExpandAll", !1);
    /**
     * 指定展开列下标
     *
     * @type {boolean}
     * @memberof NumberGridController
     */
    k(this, "expandColumnIndex");
  }
  get overflowMode() {
    return "ellipsis";
  }
  initState() {
    super.initState(), this.state.tableKey = "";
    const e = "SHOW_MODE_".concat(this.context.project, "_").concat(this.view.model.codeName), a = localStorage.getItem(e);
    a === "tree" ? this.state.showTreeGrid = !0 : a === "grid" && (this.state.showTreeGrid = !1);
  }
  /**
   * 设置排序
   */
  setSort(e, a) {
    if (!e && !a)
      return;
    let o;
    e && (o = this.fieldIdNameMap.get(e).toLowerCase()), o && a ? this.state.sortQuery = "".concat(o, ",").concat(a) : this.state.sortQuery = "", this.setSortCache();
  }
  /**
   * 设置排序缓存
   */
  setSortCache() {
    this.view && (this.state.sortQuery ? localStorage.setItem(
      "".concat(this.view.model.id, ".").concat(this.model.name, ".sort"),
      this.state.sortQuery
    ) : localStorage.removeItem(
      "".concat(this.view.model.id, ".").concat(this.model.name, ".sort")
    ));
  }
  /**
   * 获取请求过滤参数（整合了视图参数，各种过滤条件，排序，分页）
   */
  async getFetchParams(e) {
    const { curPage: a, size: o, sortQuery: r, noSort: m } = this.state, d = {
      ...this.params
    };
    if (o && (d.page = a - 1, d.size = o), !m)
      if (r)
        d.sort = r;
      else {
        const { minorSortAppDEFieldId: g, minorSortDir: l } = this.getSortModel();
        if (this.view && localStorage.getItem("".concat(this.view.model.id, ".").concat(this.model.name, ".sort")))
          this.state.sortQuery = localStorage.getItem(
            "".concat(this.view.model.id, ".").concat(this.model.name, ".sort")
          );
        else if (g && l) {
          const u = this.fieldIdNameMap.get(g);
          this.state.sortQuery = "".concat(u.toLowerCase(), ",").concat(l.toLowerCase());
        }
        d.sort = this.state.sortQuery, this.setSortCache();
      }
    return await this._evt.emit("onBeforeLoad", { params: {} }), Object.assign(d, {
      ...this.state.searchParams
    }), e && Object.assign(d, e), d;
  }
  /**
   * 切换显示模式
   *
   * @param {IData} param
   * @memberof NumberTreeGridController
   */
  async switchShowMode(e) {
    const { showMode: a } = e;
    a && (a === "tree" ? this.state.showTreeGrid = !0 : a === "grid" && (this.state.showTreeGrid = !1), await this.load());
  }
  /**
   * 初始化方法
   *
   * @protected
   * @return {*}  {Promise<void>}
   * @memberof NumberTreeGridController
   */
  async onCreated() {
    await super.onCreated();
    const { ctrlParams: e = {} } = this.model.controlParam;
    e.DEFAULTEXPANDALL && (this.defaultExpandAll = Object.is(e.DEFAULTEXPANDALL, "TRUE") || Object.is(e.DEFAULTEXPANDALL, "true")), e.GRIDROWACTIVEMODE && (this.state.mdctrlActiveMode = JSON.parse(e.GRIDROWACTIVEMODE)), e.EXPANDCOLUMNINDEX && (this.expandColumnIndex = e.EXPANDCOLUMNINDEX);
  }
  /**
   * 部件加载数据行为
   *
   * @param {MDCtrlLoadParams} [args={}]
   * @return {*}  {Promise<IData[]>}
   * @memberof NumberTreeGridController
   */
  async load(e = {}) {
    if (this.state.isSimple)
      return [];
    const a = e.silent === !0;
    a || await this.startLoading();
    try {
      const o = e.isInitialLoad === !0, r = e.isLoadMore === !0;
      o ? this.state.curPage = 1 : r && (this.state.curPage += 1);
      const { context: m } = this.handlerAbilityParams(e), d = await this.getFetchParams(e == null ? void 0 : e.viewParam);
      d != null && d.hasOwnProperty("srfshowmode") || this.state.showTreeGrid && Object.assign(d, {
        srfshowmode: "tree"
      });
      const g = await this.service.fetch(m, d);
      typeof g.total == "number" && (this.state.total = g.total), typeof g.totalPages == "number" && (this.state.totalPages = g.totalPages), r ? this.state.items.push(...g.data) : this.state.items = g.data, await this.afterLoad(e, g.data), this.state.isLoaded = !0, await this.evt.emit("onLoadSuccess", {
        isInitialLoad: o
      });
    } catch (o) {
      throw await this.evt.emit("onLoadError", void 0), this.actionNotification("FETCHERROR", {
        error: o
      }), o;
    } finally {
      a || await this.endLoading();
    }
    return this.state.items.forEach((o, r) => {
      o.srfserialnum = r + 1;
    }), this.actionNotification("FETCHSUCCESS"), this.state.items;
  }
  /**
   * 部件加载后处理
   *
   * @param {MDCtrlLoadParams} args
   * @param {ControlVO[]} items
   * @return {*}  {Promise<ControlVO[]>}
   * @memberof NumberTreeGridController
   */
  async afterLoad(e, a) {
    return await super.afterLoad(e, a), e.isInitialLoad === !0 && (this.state.tableKey = se()), a;
  }
  /**
   * 保存
   *
   * @param {ControlVO} data
   * @return {*}  {Promise<void>}
   * @memberof NumberTreeGridController
   */
  async save(e) {
    if (this.state.isSimple)
      return;
    const a = e.srfuf === L.CREATE, o = this.findRowState(e);
    if (!o)
      throw new A("行数据不存在");
    if (!o.modified) {
      ibiz.log.debug("值没有发生改变");
      return;
    }
    if (o.processing) {
      await $e(500, this.save.bind(this), [e]);
      return;
    }
    if (!await this.validate(o))
      throw new A("行数据校验不通过，保存取消");
    let m;
    const d = xe(this.model.appDataEntityId), g = this.context.clone();
    g[d] = e.srfkey;
    try {
      m = a ? await this.service.create(g, e) : await this.service.update(g, e);
    } catch (u) {
      throw a && await this.remove({ data: [e], silent: !0 }), await this.evt.emit("onSaveError", void 0), this.actionNotification("".concat(a ? "CREATE" : "UPDATE", "ERROR"), {
        error: u,
        data: o.data
      }), u;
    }
    const l = this.findRowStateIndex(e);
    this.state.items.splice(l, 1, m.data), o.data = m.data, o.oldData = m.data.clone(), o.modified = !1, a && this.evt.emit("onReloadParentNode", { node: m.data }), this.gridStateNotify(o, Y.SAVE), await this.updateRows(this.state.rows), await this.evt.emit("onSaveSuccess", void 0);
  }
  afterRemove(e) {
    const a = this.state.items.findIndex(
      (r) => r.srfkey === e.srfkey
    );
    a !== -1 && this.state.items.splice(a, 1);
    const o = this.findRowStateIndex(e);
    this.state.rows.splice(o, 1), this.state.groups.forEach((r) => {
      if (r.children.length) {
        const m = r.children.findIndex(
          (d) => d.srfkey === e.srfkey
        );
        m !== -1 && r.children.splice(m, 1);
      }
    }), this.evt.emit("onReloadParentNode", { node: e });
  }
  /**
   * @description 新建行
   * @param {MDCtrlLoadParams} [args={}]
   * @returns {*}  {Promise<void>}
   * @memberof NumberTreeGridController
   */
  async newRow(e = {}) {
    if (this.state.rows.some(
      (h) => h.data.srfuf === L.CREATE
    ))
      return;
    const { data: o } = e;
    let r = {};
    o && (r = Array.isArray(o) ? o[0] : o);
    const m = { ...this.params }, d = this.calcDefaultValue(r || {}, !0);
    r.srfDefaultData && Object.assign(d, r.srfDefaultData), Object.assign(m, d);
    let g;
    try {
      g = await this.service.getDraft(this.context, m);
    } catch (h) {
      throw this.actionNotification("GETDRAFTERROR", {
        error: h
      }), h;
    }
    const l = g.data;
    Me(l, d), l[this.treeGridParentField] = r[this.treeGridValueField], r.srfUserData && (l.srfUserData = r.srfUserData), this.state.items.push(l);
    const u = new ee(l, this);
    this.state.rows.push(u), this.gridStateNotify(u, Y.DRAFT), this.evt.emit("onReloadParentNode", { node: l }), this.actionNotification("GETDRAFTSUCCESS", { data: l });
  }
  /**
   * 行单击事件
   *
   * @param {IData} data
   * @return {*}  {Promise<void>}
   * @memberof NumberTreeGridController
   */
  async onRowClick(e) {
    this.state.singleSelect && this.setSelection([e]), this.state.mdctrlActiveMode === 1 && await this.setActive(e);
  }
}
class Xe extends Ne {
  constructor() {
    super(...arguments);
    /**
     * 分组代码表数据项
     *
     * @type {readonly}
     * @memberof NumberGridController
     */
    k(this, "codeListItems");
    /**
     * 是否默认展开所有
     *
     * @type {boolean}
     * @memberof NumberGridController
     */
    k(this, "defaultExpandAll", !1);
  }
  initState() {
    super.initState(), this.state.tableKey = "";
  }
  /**
   * 初始化方法
   *
   * @memberof NumberGridController
   */
  async onCreated() {
    await super.onCreated();
    const { ctrlParams: e = {} } = this.model.controlParam;
    e.DEFAULTEXPANDALL && (this.defaultExpandAll = Object.is(e.DEFAULTEXPANDALL, "TRUE") || Object.is(e.DEFAULTEXPANDALL, "true"));
  }
  /**
   * 设置排序
   */
  setSort(e, a) {
    if (!e && !a)
      return;
    let o;
    e && (o = this.fieldIdNameMap.get(e).toLowerCase()), o && a ? this.state.sortQuery = "".concat(o, ",").concat(a) : this.state.sortQuery = "", this.setSortCache();
  }
  /**
   * 设置排序缓存
   */
  setSortCache() {
    this.view && (this.state.sortQuery ? localStorage.setItem(
      "".concat(this.view.model.id, ".").concat(this.model.name, ".sort"),
      this.state.sortQuery
    ) : localStorage.removeItem(
      "".concat(this.view.model.id, ".").concat(this.model.name, ".sort")
    ));
  }
  /**
   * 获取请求过滤参数（整合了视图参数，各种过滤条件，排序，分页）
   */
  async getFetchParams(e) {
    const { curPage: a, size: o, sortQuery: r, noSort: m } = this.state, d = {
      ...this.params
    };
    if (o && (d.page = a - 1, d.size = o), !m)
      if (r)
        d.sort = r;
      else {
        const { minorSortAppDEFieldId: g, minorSortDir: l } = this.getSortModel();
        if (this.view && localStorage.getItem("".concat(this.view.model.id, ".").concat(this.model.name, ".sort")))
          this.state.sortQuery = localStorage.getItem(
            "".concat(this.view.model.id, ".").concat(this.model.name, ".sort")
          );
        else if (g && l) {
          const u = this.fieldIdNameMap.get(g);
          this.state.sortQuery = "".concat(u.toLowerCase(), ",").concat(l.toLowerCase());
        }
        d.sort = this.state.sortQuery, this.setSortCache();
      }
    return await this._evt.emit("onBeforeLoad", { params: {} }), Object.assign(d, {
      ...this.state.searchParams
    }), e && Object.assign(d, e), d;
  }
  /**
   * 初始化表格分组
   *
   * @protected
   * @return {*}  {Promise<void>}
   * @memberof NumberGridController
   */
  async initGroup() {
    const { groupCodeListId: e, groupMode: a, enableGroup: o } = this.model;
    if (o && a === "CODELIST") {
      if (!e)
        throw new ze(
          this.model,
          "代码表分组模式需要配置代码表"
        );
      const r = ibiz.hub.getApp(this.context.srfappid);
      this.codeListItems = await r.codeList.get(
        e,
        this.context,
        this.params
      );
    }
  }
  /**
   * 计算分组数据
   *
   * @protected
   * @param {IData[]} items
   * @memberof NumberGridController
   */
  calcGroupData(e) {
    const { enableGroup: a, groupMode: o, groupAppDEFieldId: r } = this.model;
    if (a && r) {
      const m = /* @__PURE__ */ new Map(), d = o === "CODELIST", g = r.toLowerCase();
      d && this.codeListItems.forEach((l) => {
        m.set(l.value, []);
      }), e.forEach((l) => {
        const u = l[g];
        !d && !m.has(u) && m.set(u, []), m.has(u) && m.get(u).push(l);
      }), this.state.groups = [], m.forEach((l, u) => {
        var v;
        const h = (v = this.codeListItems) == null ? void 0 : v.find(
          (i) => i.value === u
        );
        this.state.groups.push({
          caption: (h == null ? void 0 : h.text) || "".concat(u || "其他"),
          groupIcon: h == null ? void 0 : h.sysImage,
          key: u,
          children: l
        });
      });
    }
  }
  /**
   * 表格行单击
   *
   * @param {IData} data
   * @return {*}  {Promise<void>}
   * @memberof NumberGridController
   */
  async onRowClick(e) {
    this.state.enableNavView ? this.setSelection([e]) : this.state.singleSelect && this.setSelection([e]), this.setNavData(e), this.state.mdctrlActiveMode === 1 && await this.setActive(e);
  }
}
function qe(t, s) {
  var a;
  const e = {};
  return (a = t.controlAttributes) == null || a.forEach((o) => {
    o.attrName && o.attrValue && (e[o.attrName] = Pe.execSingleLine(o.attrValue, {
      ...s
    }));
  }), e;
}
function We(t, s, e, a) {
  var f;
  const {
    codeName: o
  } = s, r = t.columns[o], m = t.state.columnStates.find((C) => C.key === o), d = e.find((C) => t.columns[C.codeName].isAdaptiveColumn), l = r.isAdaptiveColumn || !d && a === e.length - 1 ? "min-width" : "width";
  let u = "default";
  t != null && t.expandColumnIndex && a < Oe(t == null ? void 0 : t.expandColumnIndex) && (u = "");
  let {
    width: h
  } = s;
  const {
    hideHeader: v
  } = t.model;
  t.model.enableCustomized && !v && h && a === e.length - 1 && (h += 20);
  const i = (m == null ? void 0 : m.columnWidth) || h;
  return y(R("el-table-column"), te({
    label: s.caption,
    prop: o
  }, {
    [l]: i
  }, {
    fixed: m.fixed,
    sortable: s.enableSort ? "custom" : !1,
    align: ((f = s.align) == null ? void 0 : f.toLowerCase()) || "center",
    type: u
  }), {
    default: ({
      row: C
    }) => {
      const b = C;
      if (C.isGroupData)
        return a !== 0 ? null : y("div", {
          class: "group-column"
        }, [y(R("iBizIcon"), {
          class: "group-icon",
          icon: C.groupIcon
        }, null), C.caption]);
      const E = t.findRowState(b);
      if (E) {
        const P = R(t.providers[o].component);
        return Ae(P, {
          controller: r,
          row: E,
          key: b.tempsrfkey + o,
          attrs: qe(s, {
            ...t.getEventArgs(),
            data: E.data
          })
        });
      }
      return y("div", null, null);
    }
  });
}
function oe(t, s, e, a) {
  var o, r;
  if (s.columnType === "GROUPGRIDCOLUMN") {
    const m = ((o = s.degridColumns) == null ? void 0 : o.filter((l) => !l.hideDefault)) || [], {
      width: d
    } = s, g = ((r = s.align) == null ? void 0 : r.toLowerCase()) || "center";
    return y(R("el-table-column"), {
      prop: s.codeName,
      label: s.caption,
      "min-width": d,
      align: g
    }, {
      default: () => m.map((l, u) => oe(t, l, e, u))
    });
  }
  return We(t, s, e, a);
}
const Q = /* @__PURE__ */ Te({
  name: "IBizNumberGridControl",
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
    mdctrlActiveMode: {
      type: Number,
      default: void 0
    },
    singleSelect: {
      type: Boolean,
      default: void 0
    },
    rowEditOpen: {
      type: Boolean,
      default: void 0
    },
    isSimple: {
      type: Boolean,
      required: !1
    },
    data: {
      type: Array,
      required: !1
    },
    loadDefault: {
      type: Boolean,
      default: !0
    }
  },
  setup(t) {
    let s;
    (() => {
      t.modelData.controlType === "TREEGRID" ? s = J((...n) => new He(...n)) : s = J((...n) => new Xe(...n));
    })();
    const a = s, {
      zIndex: o
    } = Se();
    s.state.zIndex = o.increment();
    const r = U("control-grid"), m = T(() => {
      if (t.modelData.controlType === "TREEGRID")
        return U("control-".concat(s.model.controlType.toLowerCase()));
    }), d = U("number-grid"), {
      tableData: g,
      renderColumns: l,
      defaultSort: u,
      summaryMethod: h,
      headerDragend: v
    } = je(s, t), {
      tableRef: i,
      treeGirdData: f,
      treeNodeData: C,
      curSelectedData: b,
      onRowClick: E,
      onDbRowClick: P,
      onSortChange: z,
      isSelected: j,
      getSelection: V,
      handleRowClassName: ae,
      handleHeaderCellClassName: ie
    } = Qe(s), {
      onPageChange: ne,
      onPageRefresh: re,
      onPageSizeChange: le
    } = Ve(s), B = T(() => t.modelData.controlType === "TREEGRID" ? a.state.showTreeGrid : !1), K = (n = 0) => {
      setTimeout(() => {
        if (i.value) {
          const c = i.value.$el.getElementsByClassName("el-table__row");
          let w = 0;
          c.forEach((p) => {
            const D = p.firstChild.getElementsByClassName("ibiz-number-grid__number--caption")[0];
            p.style.display !== "none" && D && (D.innerText = "".concat((s.state.curPage - 1) * s.state.size + (w + 1)), w++);
          });
        }
      }, n);
    }, de = (n, c) => {
      s.expandChange(n, c), K();
    }, H = (n) => {
      const c = n.target, w = s.state.rows.find((p) => p.data.srfuf === L.CREATE);
      w && !c.closest(".is-create-row.el-table__row") && s.remove({
        data: [w.data],
        silent: !0
      });
    };
    ke(() => {
      const {
        controlType: n,
        enableGroup: c
      } = s.model;
      s.evt.on("onLoadSuccess", () => {
        (n === "TREEGRID" || n === "GRID" && c) && K();
      }), document.addEventListener("click", H, !0);
    }), O(() => B.value, (n, c) => {
      n !== c && (b.value = [], s.setSelection([]));
    });
    const ce = () => {
      const n = [...f.value], c = (w) => {
        const p = s.state.items.filter((D) => D[a.treeGridParentField] && w[a.treeGridValueField] === D[a.treeGridParentField]);
        p.length > 0 && (n.push(...p), p.forEach((D) => {
          c(D);
        }));
      };
      return f.value.forEach((w) => {
        c(w);
      }), n;
    }, X = () => {
      let n = [];
      return B.value ? n = ce() : (n = [...g.value], s.model.enableGroup && g.value.forEach((c) => {
        n.push(...c.children);
      })), n;
    }, _ = () => {
      const n = X();
      let c = !1;
      return n.length > 0 && (c = n.filter((p) => !j(p)).length === 0), c;
    }, ue = () => {
      const n = X(), c = b.value.filter((w) => !n.find((p) => p.tempsrfkey === w.tempsrfkey));
      _() || c.push(...n), b.value = c, s.setSelection(V());
    }, he = (n, c) => {
      const {
        controlType: w,
        enableGroup: p
      } = s.model, D = n.findIndex((S) => S.tempsrfkey === c.tempsrfkey);
      D !== -1 ? (n.splice(D, 1), w === "GRID" && p && (Z(c.children) ? c.children.forEach((S) => {
        const x = n.indexOf(S);
        x !== -1 && n.splice(x, 1);
      }) : g.value.forEach((S) => {
        const x = S.children.find((I) => !n.includes(I)), N = n.findIndex((I) => I.tempsrfkey === S.tempsrfkey);
        x && N !== -1 && n.splice(N, 1);
      }))) : (n.push(c), w === "GRID" && p && (Z(c.children) ? c.children.forEach((S) => {
        n.indexOf(S) === -1 && n.push(S);
      }) : g.value.forEach((S) => {
        const x = S.children.find((I) => !n.includes(I)), N = n.findIndex((I) => I.tempsrfkey === S.tempsrfkey);
        !x && N === -1 && n.unshift(S);
      })));
    }, q = (n) => {
      he(b.value, n), s.setSelection(V());
    }, fe = (n, c) => {
      n.stopPropagation(), q(c);
    }, me = () => {
      const {
        expandRowKeys: n,
        selectedData: c,
        singleSelect: w
      } = s.state, p = i.value;
      if (!p || !c.length)
        return;
      const D = p.store.states.treeData.value, G = Object.keys(D).filter((S) => D[S].loaded);
      if (n.length === G.length && n.sort().every((S, x) => S === G.sort()[x])) {
        const S = [], x = c.map((N) => N.srfkey);
        Be({
          children: p.store.states.data.value
        }, (N) => {
          x.includes(N.srfkey) && S.push(N);
        }), $(() => {
          w ? p.setCurrentRow(S[0]) : p.store.states.selection.value = S;
        });
      }
    }, W = (n) => {
      !i.value || !s.state.expandRowKeys.length || (s.state.expandRowKeys.forEach((c) => {
        const w = n.find((p) => p.srfkey === c);
        w && $(() => {
          i.value.store.loadOrToggle(w);
        });
      }), me());
    };
    O(() => i.value, () => {
      s.model.controlType === "TREEGRID" && W(f.value);
    });
    const pe = (n, c, w) => {
      const p = C.value.filter((D) => n[a.treeGridValueField] === D[a.treeGridParentField]);
      n.children = p, w(p), W(p);
    };
    a.evt.on("onReloadParentNode", (n) => {
      const {
        node: c
      } = n, w = C.value.find((p) => c[a.treeGridParentField] && p[a.treeGridValueField] === c[a.treeGridParentField]);
      if (w)
        if (w.hasChildren) {
          const p = i.value.store.states.treeData.value[w.tempsrfkey];
          p && (p.loaded = !1), $(() => {
            i.value.store.loadOrToggle(w);
          });
        } else {
          i.value.toggleRowExpansion(w, !1);
          const p = i.value.store.states.lazyTreeNodeMap.value;
          delete p[w.tempsrfkey];
        }
    });
    const ge = () => {
      var c;
      const {
        isLoaded: n
      } = s.state;
      if (n) {
        const w = (c = s.model.controls) == null ? void 0 : c.find((p) => p.name === "".concat(s.model.name, "_quicktoolbar"));
        return w ? y(R("iBizToolbarControl"), {
          modelData: w,
          context: s.context,
          params: s.params,
          class: r.b("quick-toolbar")
        }, null) : y(R("iBizNoData"), {
          text: s.model.emptyText,
          emptyTextLanguageRes: s.model.emptyTextLanguageRes
        }, null);
      }
      return null;
    }, {
      renderPopover: we
    } = Ke(i, s), Ce = () => {
      var c;
      const n = (c = s.model.controls) == null ? void 0 : c.find((w) => w.name === "".concat(s.model.name, "_batchtoolbar"));
      if (!(!n || s.state.singleSelect))
        return y("div", {
          class: [r.b("batch-toolbar"), d.b("batch-toolbar"), r.is("show", s.showBatchToolbar)]
        }, [y("div", {
          class: r.b("batch-toolbar-content")
        }, [y("div", {
          class: r.b("batch-toolbar-text")
        }, [F("已选中"), s.state.selectedData.length, F("项")]), y("div", {
          class: r.b("batch-toolbar-separator")
        }, [F("|")]), y(R("iBizToolbarControl"), {
          modelData: n,
          context: s.context,
          params: s.params,
          class: r.b("batch-toolbar-items")
        }, null)])]);
    }, ye = () => {
      const n = l.value.length ? "width" : "min-width";
      return y(R("el-table-column"), te({
        "class-name": d.e("first-column")
      }, {
        [n]: 80
      }, {
        align: "center",
        fixed: "left",
        type: "index"
      }), {
        header: () => y("div", {
          class: d.e("number")
        }, [s.state.singleSelect ? y("span", null, [F("序号")]) : y(R("el-checkbox"), {
          size: "large",
          indeterminate: s.state.selectedData.length > 0 && !_(),
          modelValue: _(),
          onChange: () => ue()
        }, null)]),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        default: ({
          row: c,
          column: w,
          $index: p
        }) => {
          const D = (s.state.curPage - 1) * s.state.size + (p + 1);
          return y("div", {
            class: [d.e("number"), d.is("multiple", !s.state.singleSelect), d.is("single", s.state.singleSelect)],
            onClick: (G) => fe(G, c)
          }, [y("span", {
            class: d.em("number", "caption")
          }, [D]), !s.state.singleSelect && y(R("el-checkbox"), {
            size: "large",
            onClick: (G) => G.stopPropagation(),
            class: d.em("number", "checkbox"),
            modelValue: j(c),
            onChange: () => q(c)
          }, null)]);
        }
      });
    };
    return Le(() => {
      o.decrement(), document.removeEventListener("click", H, !0);
    }), {
      c: s,
      ns: r,
      ns2: m,
      ns3: d,
      tableRef: i,
      tableData: g,
      treeGirdData: f,
      showTreeGrid: B,
      renderColumns: l,
      defaultSort: u,
      loadData: pe,
      onDbRowClick: P,
      onRowClick: E,
      onExpandChange: de,
      onSortChange: z,
      onPageChange: ne,
      onPageSizeChange: le,
      onPageRefresh: re,
      handleRowClassName: ae,
      handleHeaderCellClassName: ie,
      renderNoData: ge,
      summaryMethod: h,
      headerDragend: v,
      renderPopover: we,
      renderBatchToolBar: Ce,
      renderFirstColumn: ye
    };
  },
  render() {
    if (!this.c.state.isCreated)
      return;
    const {
      state: t
    } = this.c, {
      hideHeader: s,
      enablePagingBar: e
    } = this.c.model;
    return y(R("iBizControlNavigation"), {
      controller: this.c
    }, {
      default: () => {
        var a;
        return [y(R("iBizControlBase"), {
          class: [this.ns.b(), (a = this.ns2) == null ? void 0 : a.b(), this.ns3.b(), this.ns.is("show-header", !s), this.ns.is("enable-page", e), this.ns.is("enable-group", this.c.model.enableGroup), this.ns.is("single-select", t.singleSelect), this.ns.is("enable-customized", this.c.model.enableCustomized)],
          controller: this.c
        }, {
          default: () => [y(R("el-table"), {
            border: !0,
            ref: "tableRef",
            "row-key": "tempsrfkey",
            class: this.ns.e("table"),
            key: t.tableKey,
            "tooltip-effect": "light",
            "show-header": !s,
            "default-sort": this.defaultSort,
            "show-summary": this.c.enableAgg,
            onRowClick: this.onRowClick,
            onSortChange: this.onSortChange,
            onRowDblclick: this.onDbRowClick,
            "summary-method": this.summaryMethod,
            onExpandChange: this.onExpandChange,
            onHeaderDragend: this.headerDragend,
            "row-class-name": this.handleRowClassName,
            expandRowKeys: this.c.state.expandRowKeys,
            "highlight-current-row": t.singleSelect,
            "header-cell-class-name": this.handleHeaderCellClassName,
            data: this.showTreeGrid ? this.treeGirdData : this.tableData,
            "default-expand-all": this.c.defaultExpandAll,
            "tree-props": {
              children: "children",
              hasChildren: "hasChildren"
            },
            load: this.loadData,
            lazy: this.showTreeGrid
          }, {
            empty: this.renderNoData,
            default: () => [this.renderFirstColumn(), this.renderColumns.map((o, r) => oe(this.c, o, this.renderColumns, r))],
            append: () => this.renderPopover()
          }), e && y(R("iBizPagination"), {
            total: t.total,
            curPage: t.curPage,
            size: t.size,
            totalPages: t.totalPages,
            onChange: this.onPageChange,
            onPageSizeChange: this.onPageSizeChange,
            onPageRefresh: this.onPageRefresh
          }, null), this.c.model.enableCustomized && !s && y("div", {
            class: [this.ns.b("setting-box"), this.ns3.b("setting-box")]
          }, [y(R("iBizGridSetting"), {
            columnStates: t.columnStates,
            controller: this.c
          }, null)]), this.renderBatchToolBar()]
        })];
      }
    });
  }
}), Je = Ee(
  Q,
  (t) => {
    t.component(Q.name, Q), Ge(
      "GRID_RENDER_NUMBER_GRID",
      () => new Ue()
    );
  }
), nt = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(t) {
    t.use(Je);
  }
};
export {
  Je as IBizNumberGridControl,
  nt as default
};
