import './assets/style.css';
import './assets/style.css';
import { registerControlProvider as K, GridController as X, ScriptFactory as L, Srfuf as O, GridRowState as Y, ControlVO as Z } from "@ibiz-template/runtime";
import { defineComponent as ee, ref as y, onMounted as te, watch as D, onBeforeUnmount as ae, onUnmounted as se, createVNode as m, resolveComponent as C, createTextVNode as R, computed as N, renderSlot as ne, nextTick as oe, isVNode as ie, mergeProps as re, h as le } from "vue";
import { useControlController as ce, useNamespace as de, useUIStore as ue } from "@ibiz-template/vue3-util";
import { RuntimeModelError as me } from "@ibiz-template/core";
import { createUUID as k } from "qx-util";
var pe = Object.defineProperty, he = (e, t, a) => t in e ? pe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, ge = (e, t, a) => (he(e, typeof t != "symbol" ? t + "" : t, a), a);
function fe(e) {
  const t = y();
  let a = !1, i = !1;
  async function n(s, p, h) {
    if (s.srfuf !== O.CREATE)
      if (ibiz.config.grid.editShowMode === "row" && e.model.enableRowEdit) {
        const l = e.findRowState(s);
        l && l.showRowEdit !== !0 && await e.switchRowEdit(l, !0);
      } else
        e.onRowClick(s);
  }
  function d(s) {
    s.srfuf !== O.CREATE && e.onDbRowClick(s);
  }
  function c(s) {
    a || e.setSelection(s);
  }
  D(
    [
      () => t.value,
      () => e.state.isLoaded,
      () => e.state.selectedData
    ],
    ([s, p, h]) => {
      !p || !s || (e.state.singleSelect ? h[0] ? t.value.setCurrentRow(h[0], !0) : t.value.setCurrentRow() : (a = !0, t.value.clearSelection(), h.forEach((l) => t.value.toggleRowSelection(l, !0)), a = !1));
    }
  );
  function r(s) {
    if (i) {
      i = !1;
      return;
    }
    const { prop: p, order: h } = s, l = e.fieldColumns[p].model.appDEFieldId;
    let v;
    h === "ascending" ? v = "asc" : h === "descending" && (v = "desc"), "".concat(l, ",").concat(v) !== e.state.sortQuery && (e.setSort(l, v), e.load());
  }
  function u({ row: s }) {
    let p = "";
    e.state.selectedData.length > 0 && e.state.selectedData.forEach((l) => {
      l === s && (p = "current-row");
    });
    const h = e.findRowState(s);
    return h != null && h.showRowEdit && (p += " editing-row"), s.srfkey && (p += " id-".concat(s.srfkey)), e.enableRowEditOrder && (p += " enable-order"), p;
  }
  function f({
    _row: s,
    column: p,
    _rowIndex: h,
    _columnIndex: l
  }) {
    var v;
    const w = (v = e.model.degridColumns) == null ? void 0 : v.find((_) => _.codeName === p.property);
    return w && w.headerSysCss && w.headerSysCss.cssName ? w.headerSysCss.cssName : "";
  }
  return D(
    () => e.state.sortQuery,
    (s) => {
      if (s) {
        const p = e.state.sortQuery.split(",")[0], h = e.state.sortQuery.split(",")[1];
        if (p && h) {
          const l = h === "desc" ? "descending" : "ascending", v = () => {
            t.value ? oe(() => {
              i = !0, t.value.sort(p, l);
            }) : setTimeout(v, 500);
          };
          v();
        }
      }
    }
  ), {
    tableRef: t,
    onRowClick: n,
    onDbRowClick: d,
    onSelectionChange: c,
    onSortChange: r,
    handleRowClassName: u,
    handleHeaderCellClassName: f
  };
}
function ve(e) {
  function t(n) {
    !n || n === e.state.curPage || (e.state.curPage = n, e.load());
  }
  function a(n) {
    !n || n === e.state.size || (e.state.size = n, e.state.curPage === 1 && e.load());
  }
  function i() {
    e.load();
  }
  return { onPageChange: t, onPageSizeChange: a, onPageRefresh: i };
}
function we(e, t) {
  const a = () => {
    t.data && (e.state.items = t.data, e.state.rows = t.data.map((c) => new Y(new Z(c), e)));
  }, i = N(() => {
    var c;
    const r = Object.values(e.fieldColumns).find(
      (u) => u.model.appDEFieldId === e.model.minorSortAppDEFieldId
    );
    return {
      prop: r == null ? void 0 : r.model.codeName,
      order: ((c = e.model.minorSortDir) == null ? void 0 : c.toLowerCase()) === "desc" ? "descending" : "ascending"
    };
  });
  e.evt.on("onCreated", async () => {
    t.isSimple && (a(), e.state.isLoaded = !0);
  }), D(
    () => t.data,
    () => {
      t.isSimple && a();
    },
    {
      deep: !0
    }
  );
  const n = N(() => {
    const { state: c } = e;
    if (e.model.enableGroup) {
      const r = [];
      return c.groups.forEach((u) => {
        if (!u.children.length)
          return;
        const f = [...u.children], s = f.shift();
        r.push({
          tempsrfkey: (s == null ? void 0 : s.tempsrfkey) || u.caption,
          srfkey: (s == null ? void 0 : s.srfkey) || u.caption,
          isGroupData: !0,
          caption: u.caption,
          first: s,
          children: f
        });
      }), r;
    }
    return c.rows.map((r) => r.data);
  }), d = N(() => {
    if (e.isMultistageHeader)
      return e.model.degridColumns || [];
    const c = [];
    return e.state.columnStates.forEach((r) => {
      var u, f;
      if (r.hidden)
        return;
      const s = ((u = e.fieldColumns[r.key]) == null ? void 0 : u.model) || ((f = e.uaColumns[r.key]) == null ? void 0 : f.model);
      s && c.push(s);
    }), c;
  });
  return { tableData: n, renderColumns: d, defaultSort: i, summaryMethod: ({
    columns: c
  }) => c.map((r, u) => u === 0 ? e.aggTitle : e.state.aggResult[r.property]) };
}
class be extends X {
  /**
   * 重写初始化state class类
   *
   * @protected
   * @memberof BaselineCompareController
   */
  initState() {
    super.initState(), this.state.baseline = "baseline", this.state.compareline = "comparison_baseline", this.state.compareGroup = [], this.state.compareList = [];
  }
  async onCreated() {
    await super.onCreated(), this.controlParams && (this.controlParams.baseline && (this.state.baseline = this.controlParams.baseline), this.controlParams.comparison_baseline && (this.state.compareline = this.controlParams.comparison_baseline)), await this.loadCompareSelectData();
  }
  /**
   * 转化下拉的映射数据
   *
   * @param {IData[]} items
   * @memberof BaselineCompareController
   */
  convertList(t) {
    if (this.controlParams.responsemap) {
      const a = [], i = {
        id: "id",
        name: "name"
      };
      try {
        const n = JSON.parse(this.controlParams.responsemap);
        Object.assign(i, n);
      } catch (n) {
        console.log("转化JSON配置错误");
      }
      t.forEach((n) => {
        a.push(
          Object.assign(n, {
            id: n[i.id],
            name: n[i.name]
          })
        );
      }), this.state.compareList = a;
    } else
      this.state.compareList = t;
  }
  /**
   * 加载对比下拉数据
   *
   * @memberof BaselineCompareController
   */
  async loadCompareSelectData() {
    const t = L.execScriptFn(
      { context: this.context, params: this.params },
      this.controlParams.requesturl,
      { singleRowReturn: !0 }
    ), a = L.execScriptFn(
      { context: this.context, params: this.params },
      this.controlParams.n_owner_id_eq,
      { singleRowReturn: !0 }
    ), i = L.execScriptFn(
      { context: this.context, params: this.params },
      this.controlParams.n_owner_type_eq,
      { singleRowReturn: !0 }
    ), n = {
      method: this.controlParams.requestmethod || "post",
      data: {
        n_owner_id_eq: a,
        n_owner_type_eq: i
      }
    };
    if (t && typeof t == "string") {
      const d = await ibiz.net.request(t, n);
      d && d.data && (Array.isArray(d.data) ? this.convertList(d.data) : this.convertList([d.data]));
    } else
      throw new me(this.model, "请配置数据接口地址");
  }
  /**
   * 部件加载数据行为
   *
   * @author lxm
   * @date 2022-08-19 14:08:50
   */
  async load(t = {}) {
    if (this.state.isSimple)
      return [];
    const a = t.silent === !0;
    a || await this.startLoading();
    try {
      const i = t.isInitialLoad === !0, n = t.isLoadMore === !0;
      i ? this.state.curPage = 1 : n && (this.state.curPage += 1);
      const { context: d } = this.handlerAbilityParams(t), c = await this.getFetchParams(t == null ? void 0 : t.viewParam);
      c[this.state.compareline] || (c[this.state.compareline] = this.params[this.state.baseline]);
      const r = await this.service.fetch(d, c);
      typeof r.total == "number" && (this.state.total = r.total), typeof r.totalPages == "number" && (this.state.totalPages = r.totalPages), n ? this.state.items.push(...r.data) : this.state.items = r.data, await this.afterLoad(t, r.data), this.state.isLoaded = !0, await this._evt.emit("onLoadSuccess", {
        isInitialLoad: i
      });
    } catch (i) {
      throw await this._evt.emit("onLoadError", void 0), this.actionNotification("FETCHERROR", {
        error: i
      }), i;
    } finally {
      a || await this.endLoading();
    }
    return this.state.items.forEach((i, n) => {
      i.srfserialnum = n + 1;
    }), this.actionNotification("FETCHSUCCESS"), this.state.items;
  }
  /**
   * 数据加载完成后对数据进行分组处理
   *
   * @param {MDCtrlLoadParams} args
   * @param {ControlVO[]} items
   * @return {*}  {Promise<ControlVO[]>}
   * @memberof BaselineCompareController
   */
  async afterLoad(t, a) {
    return await super.afterLoad(t, a), this.computeCompareGroup(t, a), a;
  }
  /**
   * 计算比对分组数据,根据属性 principal_id 分为两组
   *
   * @memberof BaselineCompareController
   */
  computeCompareGroup(t, a) {
    var i, n;
    const d = [], c = [], r = ((i = t == null ? void 0 : t.viewParam) == null ? void 0 : i[this.state.baseline]) || this.params[this.state.baseline], u = ((n = t == null ? void 0 : t.viewParam) == null ? void 0 : n[this.state.compareline]) || this.params[this.state.baseline], f = [], s = [];
    a.forEach((l) => {
      r === u ? l.is_latest === "1" ? s.push(l) : f.push(l) : l.principal_id === r ? f.push(l) : s.push(l);
    }), f.forEach((l) => {
      const v = this.diffItms(l.target_id, f, s);
      if (v === "DEL")
        d.push(Object.assign(l, { actionType: v })), c.push(
          Object.assign({}, {
            actionType: v,
            tempsrfkey: k(),
            base_version: r,
            compare_version: u,
            base_target_version_id: l.target_version_id,
            compare_target_version_id: ""
          })
        );
      else {
        const w = s.findIndex((_) => _.target_id === l.target_id);
        this.compareField(l, s[w]) ? (d.push(
          Object.assign(l, {
            actionType: v
          })
        ), c.push(
          Object.assign(s[w], {
            actionType: v,
            base_version: r,
            compare_version: u,
            base_target_version_id: l.target_version_id,
            compare_target_version_id: s[w].target_version_id
          })
        )) : (d.push(
          Object.assign(l, {
            actionType: "UN".concat(v)
          })
        ), c.push(
          Object.assign(s[w], {
            actionType: "UN".concat(v),
            base_version: r,
            compare_version: u,
            base_target_version_id: l.target_version_id,
            compare_target_version_id: s[w].target_version_id
          })
        )), s.splice(w, 1);
      }
    }), s.forEach((l) => {
      d.push(
        Object.assign({}, {
          actionType: "ADD",
          tempsrfkey: k()
        })
      ), c.push(
        Object.assign(l, {
          actionType: "ADD",
          base_version: r,
          compare_version: u
        })
      );
    });
    const p = this.state.compareList.find((l) => l.id === r), h = this.state.compareList.find((l) => l.id === u);
    this.state.compareGroup = [
      {
        name: p == null ? void 0 : p.name,
        id: p == null ? void 0 : p.id,
        data: d
      },
      {
        name: h == null ? void 0 : h.name,
        id: h == null ? void 0 : h.id,
        data: c
      }
    ];
  }
  /**
   * 比较不同，有不同返回true,否则返回false
   *
   * @param {IData} item1
   * @param {IData} item2
   * @return {*}
   * @memberof BaselineCompareController
   */
  compareField(t, a) {
    return t.target_version_id !== a.target_version_id;
  }
  /**
   * 判断当前项在左右两边是否存在，因为遍历的是左边，所以肯定不会出现左边没有而右边存在的情况，不会返回 [ADD]
   *
   * @param {string} id
   * @param {IData[]} leftItems
   * @param {IData[]} rightItesm
   * @return {*}
   * @memberof BaselineCompareController
   */
  diffItms(t, a, i) {
    const n = a.filter((c) => c.target_id === t), d = i.filter((c) => c.target_id === t);
    if (n.length > 0 && d.length > 0)
      return "EDIT";
    if (n.length > 0)
      return "DEL";
  }
}
function Ce(e) {
  return typeof e == "function" || Object.prototype.toString.call(e) === "[object Object]" && !ie(e);
}
function ye(e, t) {
  var a;
  const i = {};
  return (a = e.controlAttributes) == null || a.forEach((n) => {
    n.attrName && n.attrValue && (i[n.attrName] = L.execSingleLine(n.attrValue, {
      ...t
    }));
  }), i;
}
function _e(e, t, a, i) {
  var n;
  const {
    codeName: d,
    width: c
  } = t, r = e.columns[d], u = e.state.columnStates.find((s) => s.key === d), f = r.isAdaptiveColumn || !e.hasAdaptiveColumn && i === a.length - 1 ? "min-width" : "width";
  return m(C("el-table-column"), re({
    label: t.caption,
    prop: d
  }, {
    [f]: c
  }, {
    fixed: u.fixed,
    sortable: t.enableSort ? "custom" : !1,
    align: ((n = t.align) == null ? void 0 : n.toLowerCase()) || "center"
  }), {
    default: ({
      row: s
    }) => {
      let p = s;
      s.isGroupData && (p = s.first);
      const h = e.findRowState(p);
      if (t.columnType === "UAGRIDCOLUMN" && !["EDIT", "UNEDIT"].includes(p.actionType))
        return null;
      if (h) {
        const l = C(e.providers[d].component);
        return le(l, {
          controller: r,
          row: h,
          key: p.tempsrfkey + d,
          attrs: ye(t, {
            ...e.getEventArgs(),
            data: h.data
          })
        });
      }
      return null;
    }
  });
}
function j(e, t, a, i) {
  var n, d;
  if (t.columnType === "GROUPGRIDCOLUMN") {
    const c = ((n = t.degridColumns) == null ? void 0 : n.filter((f) => !f.hideDefault && !f.hiddenDataItem)) || [], {
      width: r
    } = t, u = ((d = t.align) == null ? void 0 : d.toLowerCase()) || "center";
    return m(C("el-table-column"), {
      prop: t.codeName,
      label: t.caption,
      "min-width": r,
      align: u
    }, {
      default: () => c.map((f, s) => j(e, f, a, s))
    });
  }
  return _e(e, t, a, i);
}
const z = /* @__PURE__ */ ee({
  name: "BaselineCompare",
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
    /**
     * 部件行数据默认激活模式
     * - 0 不激活
     * - 1 单击激活
     * - 2 双击激活(默认值)
     *
     * @type {(number | 0 | 1 | 2)}
     */
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
  setup(e, {
    slots: t
  }) {
    const a = ce((...o) => new be(...o)), i = de("baseline-compare"), {
      zIndex: n
    } = ue();
    a.state.zIndex = n.increment();
    const d = y(), c = y(), r = y(), u = y(), f = y([]);
    a.params[a.state.compareline] && (r.value = a.params[a.state.compareline]), a.params[a.state.baseline] && (u.value = a.params[a.state.baseline]);
    const {
      onRowClick: s,
      onDbRowClick: p,
      onSelectionChange: h,
      onSortChange: l,
      handleRowClassName: v,
      handleHeaderCellClassName: w
    } = fe(a), {
      onPageChange: _,
      onPageRefresh: A,
      onPageSizeChange: G
    } = ve(a), B = () => {
      const {
        isLoaded: o
      } = a.state;
      return o ? m(C("iBizNoData"), {
        text: a.model.emptyText,
        emptyTextLanguageRes: a.model.emptyTextLanguageRes
      }, null) : m("div", null, null);
    }, {
      tableData: U,
      renderColumns: T,
      defaultSort: M,
      summaryMethod: F
    } = we(a, e), q = (o, g, b) => b === 0 && o.columnType === "UAGRIDCOLUMN" ? null : t[o.id] ? ne(t, o.id, {
      model: o,
      data: a.state.items
    }) : j(a, o, T.value, g), H = (o) => {
      const g = v({
        row: o.row
      });
      if (o.row && o.row.actionType) {
        const b = "compareline-type-".concat(o.row.actionType.toLowerCase());
        return "".concat(g, " ").concat(b);
      }
      return g;
    }, V = (o) => {
      u.value && o && a.load({
        isInitialLoad: !0,
        viewParam: {
          [a.state.baseline]: u.value,
          [a.state.compareline]: o
        }
      });
    }, Q = () => {
      let o;
      return m(C("el-select"), {
        modelValue: r.value,
        "onUpdate:modelValue": (g) => r.value = g,
        "fit-input-width": !0,
        onChange: V
      }, Ce(o = a.state.compareList.map((g) => m(C("el-option"), {
        value: g.id,
        label: g.name
      }, {
        default: () => [m("div", {
          class: i.e("dropdown-select")
        }, [m("span", null, [g.name]), g.id === u.value ? m("div", {
          class: i.em("dropdown-select", "last")
        }, [R("最新版本")]) : null])]
      }))) ? o : {
        default: () => [o]
      });
    }, W = () => m("div", {
      class: i.e("legen-icon")
    }, [m("div", {
      class: i.em("legen-icon", "add")
    }, [R("新增")]), m("div", {
      class: i.em("legen-icon", "change")
    }, [R("修改")]), m("div", {
      class: i.em("legen-icon", "del")
    }, [R("删除")])]), x = (o) => {
      var g;
      if (o) {
        const b = (g = o.target) == null ? void 0 : g.scrollTop;
        d.value.setScrollTop(b), c.value.setScrollTop(b);
      }
    }, I = (o) => {
      o && o.addEventListener("scroll", x);
    };
    te(async () => {
      setTimeout(() => {
        var o, g, b, S;
        const P = (g = (o = d.value) == null ? void 0 : o.$refs.bodyWrapper.getElementsByClassName("el-scrollbar__wrap")) == null ? void 0 : g[0], E = (S = (b = c.value) == null ? void 0 : b.$refs.bodyWrapper.getElementsByClassName("el-scrollbar__wrap")) == null ? void 0 : S[0];
        I(P), I(E);
      }, 1200);
    }), D(() => a.state.compareList, (o) => {
      o && !r.value && (r.value = u.value), u.value && r.value && o.length > 0 && a.load({
        isInitialLoad: !0,
        viewParam: {
          [a.state.baseline]: u.value,
          [a.state.compareline]: r.value
        }
      });
    }, {
      immediate: !0,
      deep: !0
    });
    const $ = (o) => {
      if (o.column && o.column.type === "index")
        return "baseline-index";
      if (o.column && o.column.property === "uagridcolumn1")
        return "baseline-uaaction";
    }, J = (o) => {
      const g = w({
        _row: o.row,
        _columnIndex: o._columnIndex,
        _rowIndex: o.rowIndex,
        column: o.column
      });
      return o.column && o.column.type === "index" ? "".concat(g, " baseline-header baseline-index") : "".concat(g, " baseline-header");
    };
    return ae(() => {
      var o, g, b, S;
      const P = (g = (o = d.value) == null ? void 0 : o.$refs.bodyWrapper.getElementsByClassName("el-scrollbar__wrap")) == null ? void 0 : g[0], E = (S = (b = c.value) == null ? void 0 : b.$refs.bodyWrapper.getElementsByClassName("el-scrollbar__wrap")) == null ? void 0 : S[0];
      P && P.removeEventListener("scroll", x), E && E.removeEventListener("scroll", x);
    }), se(() => {
      n.decrement();
    }), {
      c: a,
      ns: i,
      curTableRef: d,
      compareTableRef: c,
      tableData: U,
      renderColumns: T,
      CustomCellClass: $,
      renderTableColumn: q,
      onDbRowClick: p,
      onRowClick: s,
      onSelectionChange: h,
      onSortChange: l,
      onPageChange: _,
      onPageSizeChange: G,
      onPageRefresh: A,
      handleRowClassName: v,
      handleHeaderCellClassName: w,
      renderNoData: B,
      summaryMethod: F,
      customHeaderRowClass: J,
      renderSelectCompare: Q,
      renderLegendIcon: W,
      customRowClass: H,
      compareGroup: f,
      defaultSort: M
    };
  },
  render() {
    if (!this.c.state.isCreated)
      return;
    const {
      state: e
    } = this.c, {
      hideHeader: t,
      enablePagingBar: a
    } = this.c.model;
    return m(C("iBizControlBase"), {
      class: [this.ns.is("show-header", !t), this.ns.is("enable-page", a), this.ns.is("enable-group", this.c.model.enableGroup), this.ns.is("single-select", e.singleSelect), this.ns.is("empty", e.items.length === 0), this.ns.is("enable-customized", this.c.model.enableCustomized)],
      controller: this.c
    }, {
      default: () => [m("div", {
        class: [this.ns.b(), this.ns.is("show-page", a)]
      }, [m("div", {
        class: this.ns.e("select")
      }, [m("div", {
        class: this.ns.em("select", "title")
      }, [this.c.view.model.caption]), m("div", {
        class: this.ns.em("select", "right")
      }, [this.renderSelectCompare(), m("span", {
        class: this.ns.em("select", "separate")
      }, [R("|")]), this.renderLegendIcon()])]), m("div", {
        class: this.ns.e("grid")
      }, [e.compareGroup.map((i, n) => m("div", {
        class: [this.ns.em("grid", i.id), this.ns.e("version")]
      }, [m("div", {
        class: this.ns.em("version", "title")
      }, [i.name]), m("div", {
        class: this.ns.em("version", "compare-grid")
      }, [m(C("el-table"), {
        ref: n === 0 ? "curTableRef" : "compareTableRef",
        class: this.ns.e("table"),
        "default-sort": this.defaultSort,
        border: !0,
        "show-header": !t,
        "show-summary": this.c.enableAgg,
        "summary-method": this.summaryMethod,
        "highlight-current-row": e.singleSelect,
        "cell-class-name": this.CustomCellClass,
        "row-class-name": this.customRowClass,
        "header-cell-class-name": this.customHeaderRowClass,
        "row-key": "tempsrfkey",
        data: i.data,
        onRowClick: this.onRowClick,
        onRowDblclick: this.onDbRowClick,
        onSelectionChange: this.onSelectionChange,
        onSortChange: this.onSortChange,
        "tooltip-effect": "light"
      }, {
        empty: this.renderNoData,
        default: () => [n === 0 && m(C("el-table-column"), {
          "class-name": this.ns.e("row-index"),
          label: "#",
          type: "index",
          align: "center",
          width: "55"
        }, null), this.renderColumns.map((d, c) => this.renderTableColumn(d, c, n))]
      }), this.c.model.enableCustomized && !t && n === 1 && m("div", {
        class: this.ns.b("setting-box")
      }, [m(C("iBizGridSetting"), {
        columnStates: e.columnStates,
        controller: this.c
      }, null)])])]))])]), a && m(C("iBizPagination"), {
        total: e.total,
        curPage: e.curPage,
        size: e.size,
        totalPages: e.totalPages,
        onChange: this.onPageChange,
        onPageSizeChange: this.onPageSizeChange,
        onPageRefresh: this.onPageRefresh
      }, null)]
    });
  }
});
class Se {
  constructor() {
    ge(this, "component", "BaselineCompare");
  }
}
const xe = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(e) {
    e.component(z.name, z), K(
      "GRID_RENDER_BASELINECOMPARE",
      () => new Se()
    );
  }
};
export {
  xe as default
};
