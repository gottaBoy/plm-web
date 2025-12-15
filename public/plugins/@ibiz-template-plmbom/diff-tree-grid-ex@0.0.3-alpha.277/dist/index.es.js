import './style.css';
var z = Object.defineProperty;
var O = (e, n, t) => n in e ? z(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[n] = t;
var E = (e, n, t) => (O(e, typeof n != "symbol" ? n + "" : n, t), t);
import { TreeGridExController as j, TreeGridExRowState as F, ScriptFactory as U, registerControlProvider as $ } from "@ibiz-template/runtime";
import { useControlController as L, useControlPopoverzIndex as B, useNamespace as G, hasEmptyPanelRenderer as M, IBizCustomRender as V, withInstall as A } from "@ibiz-template/vue3-util";
import { ref as y, reactive as K, createVNode as C, resolveComponent as g, defineComponent as q, computed as b, watchEffect as H, mergeProps as I, renderSlot as J, h as X, isVNode as Q } from "vue";
import { RuntimeError as v, recursiveIterate as x } from "@ibiz-template/core";
import { createUUID as N } from "qx-util";
import { computePosition as W } from "@floating-ui/dom";
function Y(e, n) {
  let t;
  const o = y(!1), d = y(!1), a = y(), l = K({}), f = (m) => {
    if (!e.value)
      throw new v(ibiz.i18n.t("control.common.citeErrMessage"));
    const _ = e.value.$el;
    let R = ".el-table__row";
    m.data._uuid && (R += '[class*="id-'.concat(m.data._uuid, '"]'));
    const i = _.querySelector(R);
    if (!i)
      throw new v(ibiz.i18n.t("control.common.noDomErrMessage"));
    return i;
  }, c = async (m) => {
    var s;
    const _ = f(m);
    if (d.value = ((s = _.parentNode) == null ? void 0 : s.lastElementChild) === _, !t)
      throw new v(ibiz.i18n.t("control.common.noPopErrMessage"));
    const R = t.$el, {
      x: i,
      y: r
    } = await W(_, R, {
      placement: "bottom"
    });
    Object.assign(l, {
      top: "".concat(r, "px"),
      left: "".concat(i, "px")
    }), a.value = m, setTimeout(() => {
      o.value = !0;
    }, 200);
  }, p = async () => {
    a.value && n.switchRowEdit(a.value, !1, !0);
  }, u = async () => {
    a.value && n.switchRowEdit(a.value, !1, !1);
  }, D = () => [C("div", {
    class: "row-edit-popover__placeholder",
    style: {
      display: d.value ? "block" : "none"
    }
  }, null), C(g("iBizRowEditPopover"), {
    ref: (m) => {
      t = m;
    },
    style: l,
    show: o.value,
    onConfirm: p,
    onCancel: u
  }, null)];
  return n.evt.on("onRowEditChange", (m) => {
    m.row.showRowEdit ? setTimeout(() => {
      c(m.row);
    }, 0) : (a.value = void 0, o.value = !1, Object.assign(l, {
      top: void 0,
      left: void 0
    }));
  }), {
    renderPopover: D
  };
}
class Z extends j {
  constructor() {
    super(...arguments);
    /**
     * 其它树表格关联节点标识集合，该参数有值代表当前为差异表
     *
     * @type {string[]}
     * @memberof DiffTreeGridExController
     */
    E(this, "otherRelIds");
    /**
     * 当前是否为差异表
     *
     * @type {boolean}
     * @memberof DiffTreeGridExController
     */
    E(this, "isDifference", !1);
    /**
     * 与差异表的关联标识，有值为普通表
     *
     * @type {string}
     * @memberof DiffTreeGridExController
     */
    E(this, "diffRelId", "");
    /**
     * 差异数据，由差异表通知过来
     *
     * @type {IDiffTreeGridExNodeData[]}
     * @memberof DiffTreeGridExController
     */
    E(this, "differenceData", []);
    /**
     * 差异表关联的树表格数据，由差异表通知过来
     *
     * @type {IData}
     * @memberof DiffTreeGridExController
     */
    E(this, "diffRows");
    /**
     * 差异表选择数据，由差异表通知过来
     *
     * @type {IData}
     * @memberof DiffTreeGridExController
     */
    E(this, "_diffSelectData", {});
  }
  get diffSelectData() {
    return this._diffSelectData;
  }
  initState() {
    super.initState();
  }
  async onCreated() {
    if (await super.onCreated(), this.controlParams.otherrelids)
      try {
        this.otherRelIds = JSON.parse(this.controlParams.otherrelids), this.isDifference = !0;
      } catch (t) {
        ibiz.log.warn(t);
      }
    this.controlParams.diffrelid && (this.diffRelId = this.controlParams.diffrelid);
  }
  async onMounted() {
    var t, o;
    await super.onMounted(), this.isDifference || ((t = this.view.parentView) == null || t._evt.on(
      "onDiffTreeGridExUpdate".concat(this.diffRelId),
      ({ otherRelRows: d }) => {
        this.diffRows = d, this.handleCommonTreeGrid();
      }
    ), (o = this.view.parentView) == null || o._evt.on(
      "onDiffTreeGridExSetSelect".concat(this.diffRelId),
      ({ selectData: d }) => {
        this._diffSelectData = d;
      }
    ));
  }
  setSelection(t) {
    var d;
    super.setSelection(t);
    const o = {};
    this.isDifference ? (t.forEach((a) => {
      var l;
      (l = this.otherRelIds) == null || l.forEach((f) => {
        var p;
        const c = (p = a._deData) == null ? void 0 : p[f];
        if (c) {
          const u = o[f] || {};
          u[c] = a, o[f] = u;
        }
      });
    }), (d = this.otherRelIds) == null || d.forEach((a) => {
      var l;
      (l = this.view.parentView) == null || l._evt.emit("onDiffTreeGridExSetSelect".concat(a), {
        selectData: o[a]
      });
    })) : t.length === 0 && (this._diffSelectData = {});
  }
  /**
   * loadNodes加载完子数据之后的处理
   * @param {IDiffTreeGridExNodeData[]} nodes 加载回来的子数据
   * @return {*}  {Promise<void>}
   */
  async afterLoadNodes(t) {
    this.state.items = [], x(
      { _children: this.state.rootNodes },
      (o) => {
        var d, a, l, f, c, p;
        this.state.items.push(o), this.state.rows[o._uuid] = new F(o, this), Object.assign(o, {
          _isCreated: !!((d = o._deData) != null && d.difference && ((f = (a = o._deData) == null ? void 0 : (l = a.difference).includes) != null && f.call(l, "only"))),
          _isUpdate: !!((c = o._deData) != null && c.difference && ((p = o._deData) == null ? void 0 : p.difference) === "changed")
        });
      },
      { childrenFields: ["_children"] }
    ), this.state.expandedKeys = this.calcExpandedKeys(t), this.calcSelectDataBySelectKey(), this.isDifference ? this.handleDiffTreeGrid() : this.handleCommonTreeGrid(), await this.updateRows(this.state.rows);
  }
  /**
   * 处理差异树表格显示
   *
   * @memberof DiffTreeGridExController
   */
  handleDiffTreeGrid() {
    var d, a, l;
    this.state.otherRelRows = {};
    const t = ((d = this.state.rootNodes[0]._children) == null ? void 0 : d.findIndex((f) => {
      const c = this.getNodeModel(f._nodeId);
      return (c == null ? void 0 : c.id) === "difference_data";
    })) || -1;
    let o = this.differenceData || [];
    t > -1 && (o = this.state.rootNodes[0]._children[t]._children, (a = this.state.rootNodes[0]._children) == null || a.splice(t, 1)), o.forEach((f) => {
      var c;
      (c = this.otherRelIds) == null || c.forEach((p) => {
        var D;
        const u = (D = f._deData) == null ? void 0 : D[p];
        if (u && this.state.otherRelRows) {
          const m = this.state.otherRelRows[p] || {};
          m[u] = f, this.state.otherRelRows[p] = m;
        }
      });
    }), o.length > 0 && ((l = this.otherRelIds) == null || l.forEach((f) => {
      var c;
      (c = this.view.parentView) == null || c._evt.emit("onDiffTreeGridExUpdate".concat(f), {
        otherRelRows: this.state.otherRelRows[f]
      });
    })), this.differenceData = o;
  }
  /**
   * 处理通用表格差异比对显示
   *
   * @return {*}  {void}
   * @memberof DiffTreeGridExController
   */
  handleCommonTreeGrid() {
    this.diffRows && (x(
      { _children: this.state.rootNodes },
      (t) => {
        var o, d, a, l, f, c, p, u;
        Object.assign(t, {
          _isUpdate: !1,
          _isCreated: !1
        }), (d = this.diffRows) != null && d[(o = t._deData) == null ? void 0 : o.srfkey] && Object.assign(t, {
          _isCreated: !!((f = (l = this.diffRows) == null ? void 0 : l[(a = t._deData) == null ? void 0 : a.srfkey]) != null && f._isCreated),
          _isUpdate: !!((u = (p = this.diffRows) == null ? void 0 : p[(c = t._deData) == null ? void 0 : c.srfkey]) != null && u._isUpdate)
        });
      },
      { childrenFields: ["_children"] }
    ), this.updateUI());
  }
  /**
   * 更新UI
   *
   * @memberof DiffTreeGridExController
   */
  updateUI() {
    this._evt.emit("onAfterRefreshParent", {
      parentNode: {},
      children: []
    });
  }
  /**
   * 关闭差异
   *
   * @return {*}  {Promise<void>}
   * @memberof DiffTreeGridExController
   */
  async closeDiff() {
    x(
      { _children: this.state.rootNodes },
      (t) => {
        Object.assign(t, {
          _isUpdate: !1,
          _isCreated: !1
        });
      },
      { childrenFields: ["_children"] }
    ), this.diffRows = void 0, this._diffSelectData = {}, this.updateUI();
  }
  /**
   * 开启差异
   *
   * @return {*}  {Promise<void>}
   * @memberof DiffTreeGridExController
   */
  async openDiff() {
    this.isDifference ? this.handleDiffTreeGrid() : this.handleCommonTreeGrid();
  }
}
function ee(e) {
  return typeof e == "function" || Object.prototype.toString.call(e) === "[object Object]" && !Q(e);
}
function P(e, n) {
  var o;
  const t = {};
  return (o = e.controlAttributes) == null || o.forEach((d) => {
    d.attrName && d.attrValue && (t[d.attrName] = U.execSingleLine(d.attrValue, {
      ...n
    }));
  }), t;
}
const S = /* @__PURE__ */ q({
  name: "IBizDiffTreeGridExControl",
  props: {
    /**
     * @description 树表格增强模型数据
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
    const e = L((...i) => new Z(...i));
    B(e);
    const n = G("control-".concat(e.model.controlType.toLowerCase())), t = G("control-diff-tree-grid-ex"), o = () => {
      const {
        isLoaded: i
      } = e.state, r = {};
      return M(e) && Object.assign(r, {
        customRender: () => C(V, {
          controller: e
        }, null)
      }), i && C(g("iBizNoData"), {
        text: e.model.emptyText,
        emptyTextLanguageRes: e.model.emptyTextLanguageRes
      }, ee(r) ? r : {
        default: () => [r]
      });
    }, d = b(() => {
      const i = [];
      return e.state.columnStates.forEach((r) => {
        var h, w;
        if (r.hidden)
          return;
        const s = ((h = e.fieldColumns[r.key]) == null ? void 0 : h.model) || ((w = e.uaColumns[r.key]) == null ? void 0 : w.model);
        s && i.push(s);
      }), i;
    }), a = (i, r = !1) => i.map((s) => {
      const h = {
        id: s._id,
        _uuid: s._uuid,
        hasChildren: !s._leaf,
        _deData: s._deData,
        _isCreated: s._isCreated,
        _isUpdate: s._isUpdate,
        _isDifference: e.isDifference
      };
      return !r && !s._leaf && s._children !== void 0 && (h.children = a(s._children)), h;
    }), l = y(N()), f = b(() => e.state.isLoaded ? e.model.rootVisible ? e.state.rootNodes : e.state.rootNodes.reduce((i, r) => {
      var s;
      return r._children ? (Object.assign(r, {
        _children: (s = r._children) == null ? void 0 : s.filter((h) => {
          const w = e.getNodeModel(h._nodeId);
          return (w == null ? void 0 : w.id) !== "difference_data";
        })
      }), i.concat(r._children)) : i;
    }, []) : []), c = b(() => (l.value = N(), f.value.length === 0 ? [] : a(f.value, !0)));
    e.evt.on("onAfterRefreshParent", () => {
      l.value = N();
    });
    const p = async (i, r, s) => {
      let h;
      const w = e.getNodeData(i.id);
      w._children ? h = w._children : h = await e.loadNodes(w), s(a(h));
    }, u = y(), {
      renderPopover: D
    } = Y(u, e), m = async (i, r, s) => {
      const h = e.getNodeData(i.id);
      if (e.editShowMode === "row" && e.model.enableEdit) {
        const w = e.state.rows[h._uuid];
        if (w && w.showRowEdit !== !0)
          await e.switchRowEdit(w, !0);
        else
          throw new v(ibiz.i18n.t("control.treeGridEx.noFoundMessage", {
            id: i.id
          }));
      } else
        e.onTreeNodeClick(h, s);
    };
    function _({
      row: i
    }) {
      var w, T;
      const r = e.getNodeData(i.id);
      if (!r)
        return "";
      let s = "";
      e.state.selectedData.length > 0 ? e.state.selectedData.forEach((k) => {
        k === r && (s = "current-row");
      }) : !e.isDifference && ((T = e.diffSelectData) != null && T[(w = i._deData) == null ? void 0 : w.srfkey]) && (s = "current-row");
      const h = e.getRowState(r._uuid);
      return h != null && h.showRowEdit && (s += " editing-row"), s += " id-".concat(r._uuid), s;
    }
    return H(() => {
      if (u.value) {
        const i = u.value.store.states.treeData.value, {
          expandedKeys: r
        } = e.state;
        Object.keys(i).forEach((s) => {
          if (r.includes(s) !== i[s].expanded) {
            const h = a([e.getNodeData(s)])[0];
            u.value.store.loadOrToggle(h);
          }
        });
      }
    }), {
      c: e,
      ns: n,
      ns2: t,
      tableRef: u,
      elTableData: c,
      renderColumns: d,
      tableRefreshKey: l,
      loadData: p,
      onRowClick: m,
      renderNoData: o,
      renderPopover: D,
      onExpandChange: (i, r) => {
        const s = e.getNodeData(i._uuid);
        if (!s)
          throw new v(ibiz.i18n.t("control.common.noFoundNode", {
            id: i._uuid
          }));
        e.onExpandChange(s, r);
      },
      handleRowClassName: _
    };
  },
  render() {
    const e = (n, t) => {
      var m, _, R;
      if (this.$slots[n.id])
        return J(this.$slots, n.id, {
          model: n,
          data: this.c.state.items
        });
      const {
        codeName: o,
        width: d
      } = n, a = this.c.columns[o], l = this.c.state.columnStates.find((i) => i.key === o), c = a.isAdaptiveColumn || !this.c.hasAdaptiveColumn && t === this.renderColumns.length - 1 ? "min-width" : "width";
      let p = "default";
      const u = (m = this.c.controlParams.expandiconcolumn) == null ? void 0 : m.toLowerCase(), D = this.c.state.columnStates.find((i) => u && i.key.toLowerCase() === u);
      return D && !D.hidden && (p = (o == null ? void 0 : o.toLowerCase()) === u ? "default" : ""), C(g("el-table-column"), I({
        type: p,
        prop: o,
        label: n.caption
      }, {
        [c]: d
      }, {
        fixed: l.fixed,
        sortable: n.enableSort ? "custom" : !1,
        align: ((_ = n.align) == null ? void 0 : _.toLowerCase()) || "center",
        "label-class-name": (R = a.model.headerSysCss) == null ? void 0 : R.cssName
      }), {
        header: ({
          column: i
        }) => C(g("iBizGridColumnHeader"), {
          key: i.property,
          controller: a
        }, null),
        default: ({
          row: i
        }) => {
          const r = this.c.getRowState(i.id);
          if (r) {
            const s = g(this.c.providers[o].component), h = r.data, w = this.c.getNodeModel(h._nodeId);
            return X(s, {
              controller: a,
              row: r,
              key: r.data._uuid + o,
              attrs: P(w, {
                ...this.c.getEventArgs(),
                data: r.data
              })
            });
          }
          return null;
        }
      });
    };
    return C(g("iBizControlNavigation"), {
      controller: this.c
    }, {
      default: () => [C(g("iBizControlBase"), {
        controller: this.c,
        class: [this.ns.b(), this.ns2.b()]
      }, {
        default: () => [this.c.state.isLoaded && C(g("el-table"), I({
          ref: "tableRef",
          key: this.tableRefreshKey,
          class: this.ns.e("table"),
          border: !0,
          "row-key": "id",
          data: this.elTableData,
          "tree-props": {
            children: "children",
            hasChildren: "hasChildren"
          },
          lazy: !0,
          onRowClick: this.onRowClick,
          onExpandChange: this.onExpandChange,
          "row-class-name": this.handleRowClassName,
          load: this.loadData,
          cellStyle: (n) => {
            if (n.row._isCreated)
              return {
                backgroundColor: "#FFD259"
              };
            if (n.row._isUpdate)
              return {
                backgroundColor: "#FFF1CC"
              };
          }
        }, P(this.c.model, {
          ...this.c.getEventArgs()
        })), {
          empty: this.renderNoData,
          default: () => [this.renderColumns.map((n, t) => e(n, t))],
          append: () => this.renderPopover()
        })]
      })]
    });
  }
});
class te {
  constructor() {
    E(this, "component", "IBizDiffTreeGridExControl");
  }
}
const le = A(
  S,
  function(e) {
    e.component(S.name, S), $(
      "TREE_RENDER_DIFF_TREE_GRID_EX",
      () => new te()
    );
  }
);
export {
  le as IBizDiffTreeGridExControl,
  le as default
};
