import './assets/style.css';
import { useNamespace as U, useControlController as ge, withInstall as we } from "@ibiz-template/vue3-util";
import { GridController as ye, GridRowState as Ce, ControlVO as be, registerControlProvider as ve, ControlType as xe } from "@ibiz-template/runtime";
import { ref as Q, watch as $, computed as F, reactive as Re, createVNode as g, resolveComponent as C, mergeProps as Se, defineComponent as De, createTextVNode as W } from "vue";
import { RuntimeError as j } from "@ibiz-template/core";
class ke extends ye {
  /**
   * 添加附件
   *
   * @memberof AttachGridController
   */
  async addAttachMent(t) {
    const { appDataEntityId: n } = this.model;
    n && (await ibiz.hub.getApp(this.context.srfappid).deService.exec(n, "create", this.context, t), await this.load({ isInitialLoad: !1 }), await this.evt.emit("onSaveSuccess", void 0));
  }
}
function Te(e) {
  function t(i) {
    !i || i === e.state.curPage || (e.state.curPage = i, e.load());
  }
  function n(i) {
    !i || i === e.state.size || (e.state.size = i, e.state.curPage === 1 && e.load());
  }
  function o() {
    e.load();
  }
  return { onPageChange: t, onPageSizeChange: n, onPageRefresh: o };
}
function Ee(e) {
  const t = Q();
  let n = !1;
  async function o(c, d, u) {
    if (ibiz.config.grid.editShowMode === "row" && e.model.enableRowEdit) {
      const h = e.findRowState(c);
      h && h.showRowEdit !== !0 && await e.switchRowEdit(h, !0);
    } else
      e.onRowClick(c);
  }
  function i(c) {
    e.onDbRowClick(c);
  }
  function l(c) {
    n || e.setSelection(c);
  }
  $(
    [
      () => t.value,
      () => e.state.isLoaded,
      () => e.state.selectedData
    ],
    ([c, d, u]) => {
      !d || !c || (e.state.singleSelect ? u[0] ? t.value.setCurrentRow(u[0], !0) : t.value.setCurrentRow() : (n = !0, t.value.clearSelection(), u.forEach((h) => t.value.toggleRowSelection(h, !0)), n = !1));
    }
  );
  function a(c) {
    const { prop: d, order: u } = c, h = e.fieldColumns[d].model.appDEFieldId;
    let f;
    u === "ascending" ? f = "asc" : u === "descending" && (f = "desc"), e.setSort(h, f), e.load();
  }
  function s({ row: c }) {
    let d = "";
    e.state.selectedData.length > 0 && e.state.selectedData.forEach((h) => {
      h === c && (d = "current-row");
    });
    const u = e.findRowState(c);
    return u != null && u.showRowEdit && (d += " editing-row"), c.srfkey && (d += " id-".concat(c.srfkey)), d;
  }
  function r({ _row: c, column: d, _rowIndex: u, _columnIndex: h }) {
    var f;
    const m = (f = e.model.degridColumns) == null ? void 0 : f.find((p) => p.codeName === d.property);
    return m && m.headerSysCss && m.headerSysCss.cssName ? m.headerSysCss.cssName : "";
  }
  return $(
    () => e.state.sortQuery,
    (c) => {
      if (c) {
        const d = e.state.sortQuery.split(",")[0], u = e.state.sortQuery.split(",")[1];
        if (t.value && d && u) {
          const h = u === "desc" ? "descending" : "ascending";
          setTimeout(() => {
            var f;
            (f = t.value) == null || f.sort(d, h);
          });
        }
      }
    }
  ), {
    tableRef: t,
    onRowClick: o,
    onDbRowClick: i,
    onSelectionChange: l,
    onSortChange: a,
    handleRowClassName: s,
    handleHeaderCellClassName: r
  };
}
function Le(e, t) {
  const n = () => {
    t.data && (e.state.items = t.data, e.state.rows = t.data.map(
      (a) => new Ce(new be(a), e)
    ));
  }, o = F(() => {
    var a;
    const s = Object.values(e.fieldColumns).find(
      (r) => r.model.appDEFieldId === e.model.minorSortAppDEFieldId
    );
    return {
      prop: s == null ? void 0 : s.model.codeName,
      order: ((a = e.model.minorSortDir) == null ? void 0 : a.toLowerCase()) === "desc" ? "descending" : "ascending"
    };
  });
  e.evt.on("onCreated", async () => {
    t.isSimple && (n(), e.state.isLoaded = !0);
  }), $(
    () => t.data,
    () => {
      t.isSimple && n();
    },
    {
      deep: !0
    }
  );
  const i = F(() => {
    const { state: a } = e;
    if (e.model.enableGroup) {
      const s = [];
      return a.groups.forEach((r) => {
        if (!r.children.length)
          return;
        const c = [...r.children], d = c.shift();
        s.push({
          srfkey: (d == null ? void 0 : d.srfkey) || r.caption,
          isGroupData: !0,
          caption: r.caption,
          first: d,
          children: c
        });
      }), s;
    }
    return a.rows.map((s) => s.data);
  }), l = F(() => {
    if (e.isMultistageHeader)
      return e.model.degridColumns || [];
    const a = [];
    return e.state.columnStates.forEach((s) => {
      var r, c;
      if (s.hidden)
        return;
      const d = ((r = e.fieldColumns[s.key]) == null ? void 0 : r.model) || ((c = e.uaColumns[s.key]) == null ? void 0 : c.model);
      d && a.push(d);
    }), a;
  });
  return {
    tableData: i,
    renderColumns: l,
    defaultSort: o,
    summaryMethod: ({ columns: a }) => a.map(
      (s, r) => r === 0 ? e.aggTitle : e.state.aggResult[s.property]
    )
  };
}
const M = (e) => {
  e.stopPropagation();
}, K = async (e, t, n, o) => {
  n.grid.setSelection([o.data]), await n.onActionClick(e, o, t);
};
function ie(e) {
  return e.split("-")[0];
}
function Pe(e) {
  return e.split("-")[1];
}
function Ne(e) {
  return e === "x" ? "y" : "x";
}
function Ae(e) {
  return e === "y" ? "height" : "width";
}
function ae(e) {
  return ["top", "bottom"].includes(ie(e)) ? "y" : "x";
}
function Be(e) {
  return Ne(ae(e));
}
function se(e) {
  const { x: t, y: n, width: o, height: i } = e;
  return {
    width: o,
    height: i,
    top: n,
    left: t,
    right: t + o,
    bottom: n + i,
    x: t,
    y: n
  };
}
function Z(e, t, n) {
  let { reference: o, floating: i } = e;
  const l = ae(t), a = Be(t), s = Ae(a), r = ie(t), c = l === "y", d = o.x + o.width / 2 - i.width / 2, u = o.y + o.height / 2 - i.height / 2, h = o[s] / 2 - i[s] / 2;
  let f;
  switch (r) {
    case "top":
      f = {
        x: d,
        y: o.y - i.height
      };
      break;
    case "bottom":
      f = {
        x: d,
        y: o.y + o.height
      };
      break;
    case "right":
      f = {
        x: o.x + o.width,
        y: u
      };
      break;
    case "left":
      f = {
        x: o.x - i.width,
        y: u
      };
      break;
    default:
      f = {
        x: o.x,
        y: o.y
      };
  }
  switch (Pe(t)) {
    case "start":
      f[a] -= h * (n && c ? -1 : 1);
      break;
    case "end":
      f[a] += h * (n && c ? -1 : 1);
      break;
  }
  return f;
}
const Ge = async (e, t, n) => {
  const {
    placement: o = "bottom",
    strategy: i = "absolute",
    middleware: l = [],
    platform: a
  } = n, s = l.filter(Boolean), r = await (a.isRTL == null ? void 0 : a.isRTL(t));
  let c = await a.getElementRects({
    reference: e,
    floating: t,
    strategy: i
  }), { x: d, y: u } = Z(c, o, r), h = o, f = {}, m = 0;
  for (let p = 0; p < s.length; p++) {
    const { name: R, fn: E } = s[p], {
      x: S,
      y: w,
      data: D,
      reset: y
    } = await E({
      x: d,
      y: u,
      initialPlacement: o,
      placement: h,
      strategy: i,
      middlewareData: f,
      rects: c,
      platform: a,
      elements: {
        reference: e,
        floating: t
      }
    });
    d = S != null ? S : d, u = w != null ? w : u, f = {
      ...f,
      [R]: {
        ...f[R],
        ...D
      }
    }, y && m <= 50 && (m++, typeof y == "object" && (y.placement && (h = y.placement), y.rects && (c = y.rects === !0 ? await a.getElementRects({
      reference: e,
      floating: t,
      strategy: i
    }) : y.rects), { x: d, y: u } = Z(c, h, r)), p = -1);
  }
  return {
    x: d,
    y: u,
    placement: h,
    strategy: i,
    middlewareData: f
  };
}, ee = Math.min, G = Math.max, H = Math.round, L = (e) => ({
  x: e,
  y: e
});
function P(e) {
  return le(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function b(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function N(e) {
  var t;
  return (t = (le(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function le(e) {
  return e instanceof Node || e instanceof b(e).Node;
}
function T(e) {
  return e instanceof Element || e instanceof b(e).Element;
}
function x(e) {
  return e instanceof HTMLElement || e instanceof b(e).HTMLElement;
}
function te(e) {
  return typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof b(e).ShadowRoot;
}
function O(e) {
  const { overflow: t, overflowX: n, overflowY: o, display: i } = v(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + o + n) && !["inline", "contents"].includes(i);
}
function ze(e) {
  return ["table", "td", "th"].includes(P(e));
}
function Y(e) {
  const t = J(), n = v(e);
  return n.transform !== "none" || n.perspective !== "none" || (n.containerType ? n.containerType !== "normal" : !1) || !t && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !t && (n.filter ? n.filter !== "none" : !1) || ["transform", "perspective", "filter"].some(
    (o) => (n.willChange || "").includes(o)
  ) || ["paint", "layout", "strict", "content"].some(
    (o) => (n.contain || "").includes(o)
  );
}
function Oe(e) {
  let t = B(e);
  for (; x(t) && !I(t); ) {
    if (Y(t))
      return t;
    t = B(t);
  }
  return null;
}
function J() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function I(e) {
  return ["html", "body", "#document"].includes(P(e));
}
function v(e) {
  return b(e).getComputedStyle(e);
}
function _(e) {
  return T(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.pageXOffset,
    scrollTop: e.pageYOffset
  };
}
function B(e) {
  if (P(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    te(e) && e.host || // Fallback.
    N(e)
  );
  return te(t) ? t.host : t;
}
function re(e) {
  const t = B(e);
  return I(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : x(t) && O(t) ? t : re(t);
}
function X(e, t, n) {
  var o;
  t === void 0 && (t = []), n === void 0 && (n = !0);
  const i = re(e), l = i === ((o = e.ownerDocument) == null ? void 0 : o.body), a = b(i);
  return l ? t.concat(
    a,
    a.visualViewport || [],
    O(i) ? i : [],
    a.frameElement && n ? X(a.frameElement) : []
  ) : t.concat(i, X(i, [], n));
}
function ce(e) {
  const t = v(e);
  let n = parseFloat(t.width) || 0, o = parseFloat(t.height) || 0;
  const i = x(e), l = i ? e.offsetWidth : n, a = i ? e.offsetHeight : o, s = H(n) !== l || H(o) !== a;
  return s && (n = l, o = a), {
    width: n,
    height: o,
    $: s
  };
}
function de(e) {
  return T(e) ? e : e.contextElement;
}
function A(e) {
  const t = de(e);
  if (!x(t))
    return L(1);
  const n = t.getBoundingClientRect(), { width: o, height: i, $: l } = ce(t);
  let a = (l ? H(n.width) : n.width) / o, s = (l ? H(n.height) : n.height) / i;
  return (!a || !Number.isFinite(a)) && (a = 1), (!s || !Number.isFinite(s)) && (s = 1), {
    x: a,
    y: s
  };
}
const Me = /* @__PURE__ */ L(0);
function ue(e) {
  const t = b(e);
  return !J() || !t.visualViewport ? Me : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function He(e, t, n) {
  return t === void 0 && (t = !1), !n || t && n !== b(e) ? !1 : t;
}
function z(e, t, n, o) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const i = e.getBoundingClientRect(), l = de(e);
  let a = L(1);
  t && (o ? T(o) && (a = A(o)) : a = A(e));
  const s = He(l, n, o) ? ue(l) : L(0);
  let r = (i.left + s.x) / a.x, c = (i.top + s.y) / a.y, d = i.width / a.x, u = i.height / a.y;
  if (l) {
    const h = b(l), f = o && T(o) ? b(o) : o;
    let m = h.frameElement;
    for (; m && o && f !== h; ) {
      const p = A(m), R = m.getBoundingClientRect(), E = v(m), S = R.left + (m.clientLeft + parseFloat(E.paddingLeft)) * p.x, w = R.top + (m.clientTop + parseFloat(E.paddingTop)) * p.y;
      r *= p.x, c *= p.y, d *= p.x, u *= p.y, r += S, c += w, m = b(m).frameElement;
    }
  }
  return se({
    width: d,
    height: u,
    x: r,
    y: c
  });
}
function Ie(e) {
  let { rect: t, offsetParent: n, strategy: o } = e;
  const i = x(n), l = N(n);
  if (n === l)
    return t;
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  }, s = L(1);
  const r = L(0);
  if ((i || !i && o !== "fixed") && ((P(n) !== "body" || O(l)) && (a = _(n)), x(n))) {
    const c = z(n);
    s = A(n), r.x = c.x + n.clientLeft, r.y = c.y + n.clientTop;
  }
  return {
    width: t.width * s.x,
    height: t.height * s.y,
    x: t.x * s.x - a.scrollLeft * s.x + r.x,
    y: t.y * s.y - a.scrollTop * s.y + r.y
  };
}
function _e(e) {
  return Array.from(e.getClientRects());
}
function fe(e) {
  return z(N(e)).left + _(e).scrollLeft;
}
function Ve(e) {
  const t = N(e), n = _(e), o = e.ownerDocument.body, i = G(t.scrollWidth, t.clientWidth, o.scrollWidth, o.clientWidth), l = G(t.scrollHeight, t.clientHeight, o.scrollHeight, o.clientHeight);
  let a = -n.scrollLeft + fe(e);
  const s = -n.scrollTop;
  return v(o).direction === "rtl" && (a += G(t.clientWidth, o.clientWidth) - i), {
    width: i,
    height: l,
    x: a,
    y: s
  };
}
function Fe(e, t) {
  const n = b(e), o = N(e), i = n.visualViewport;
  let l = o.clientWidth, a = o.clientHeight, s = 0, r = 0;
  if (i) {
    l = i.width, a = i.height;
    const c = J();
    (!c || c && t === "fixed") && (s = i.offsetLeft, r = i.offsetTop);
  }
  return {
    width: l,
    height: a,
    x: s,
    y: r
  };
}
function We(e, t) {
  const n = z(e, !0, t === "fixed"), o = n.top + e.clientTop, i = n.left + e.clientLeft, l = x(e) ? A(e) : L(1), a = e.clientWidth * l.x, s = e.clientHeight * l.y, r = i * l.x, c = o * l.y;
  return {
    width: a,
    height: s,
    x: r,
    y: c
  };
}
function ne(e, t, n) {
  let o;
  if (t === "viewport")
    o = Fe(e, n);
  else if (t === "document")
    o = Ve(N(e));
  else if (T(t))
    o = We(t, n);
  else {
    const i = ue(e);
    o = {
      ...t,
      x: t.x - i.x,
      y: t.y - i.y
    };
  }
  return se(o);
}
function he(e, t) {
  const n = B(e);
  return n === t || !T(n) || I(n) ? !1 : v(n).position === "fixed" || he(n, t);
}
function je(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let o = X(e, [], !1).filter((s) => T(s) && P(s) !== "body"), i = null;
  const l = v(e).position === "fixed";
  let a = l ? B(e) : e;
  for (; T(a) && !I(a); ) {
    const s = v(a), r = Y(a);
    !r && s.position === "fixed" && (i = null), (l ? !r && !i : !r && s.position === "static" && i && ["absolute", "fixed"].includes(i.position) || O(a) && !r && he(e, a)) ? o = o.filter((c) => c !== a) : i = s, a = B(a);
  }
  return t.set(e, o), o;
}
function qe(e) {
  let { element: t, boundary: n, rootBoundary: o, strategy: i } = e;
  const l = [...n === "clippingAncestors" ? je(t, this._c) : [].concat(n), o], a = l[0], s = l.reduce(
    (r, c) => {
      const d = ne(t, c, i);
      return r.top = G(d.top, r.top), r.right = ee(d.right, r.right), r.bottom = ee(d.bottom, r.bottom), r.left = G(d.left, r.left), r;
    },
    ne(t, a, i)
  );
  return {
    width: s.right - s.left,
    height: s.bottom - s.top,
    x: s.left,
    y: s.top
  };
}
function Ue(e) {
  return ce(e);
}
function Qe(e, t, n) {
  const o = x(t), i = N(t), l = n === "fixed", a = z(e, !0, l, t);
  let s = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const r = L(0);
  if (o || !o && !l)
    if ((P(t) !== "body" || O(i)) && (s = _(t)), o) {
      const c = z(t, !0, l, t);
      r.x = c.x + t.clientLeft, r.y = c.y + t.clientTop;
    } else
      i && (r.x = fe(i));
  return {
    x: a.left + s.scrollLeft - r.x,
    y: a.top + s.scrollTop - r.y,
    width: a.width,
    height: a.height
  };
}
function oe(e, t) {
  return !x(e) || v(e).position === "fixed" ? null : t ? t(e) : e.offsetParent;
}
function me(e, t) {
  const n = b(e);
  if (!x(e))
    return n;
  let o = oe(e, t);
  for (; o && ze(o) && v(o).position === "static"; )
    o = oe(o, t);
  return o && (P(o) === "html" || P(o) === "body" && v(o).position === "static" && !Y(o)) ? n : o || Oe(e) || n;
}
const $e = async function(e) {
  let { reference: t, floating: n, strategy: o } = e;
  const i = this.getOffsetParent || me, l = this.getDimensions;
  return {
    reference: Qe(t, await i(n), o),
    floating: {
      x: 0,
      y: 0,
      ...await l(n)
    }
  };
};
function Xe(e) {
  return v(e).direction === "rtl";
}
const Ye = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Ie,
  getDocumentElement: N,
  getClippingRect: qe,
  getOffsetParent: me,
  getElementRects: $e,
  getClientRects: _e,
  getDimensions: Ue,
  getScale: A,
  isElement: T,
  isRTL: Xe
}, Je = (e, t, n) => {
  const o = /* @__PURE__ */ new Map(), i = {
    platform: Ye,
    ...n
  }, l = {
    ...i.platform,
    _c: o
  };
  return Ge(e, t, {
    ...i,
    platform: l
  });
};
function Ke(e, t) {
  let n;
  const o = Q(!1), i = Q(), l = Re({}), a = (u) => {
    if (!e.value)
      throw new j("找不到表格组件引用");
    const h = e.value.$el;
    let f = ".el-table__row";
    u.data.srfkey && (f += ".id-".concat(u.data.srfkey));
    const m = h.querySelector(f);
    if (!m)
      throw new j("找不到对应的表格行dom元素");
    return m;
  }, s = async (u) => {
    const h = a(u);
    if (!n)
      throw new j("拿不到pop组件的实例");
    const f = n.$el, { x: m, y: p } = await Je(h, f, {
      placement: "bottom"
    });
    Object.assign(l, {
      top: "".concat(p, "px"),
      left: "".concat(m, "px")
    }), i.value = u, o.value = !0;
  }, r = async () => {
    i.value && t.switchRowEdit(i.value, !1, !0);
  }, c = async () => {
    i.value && t.switchRowEdit(i.value, !1, !1);
  }, d = () => {
    const u = o.value && t.state.rows[t.state.rows.length - 1].showRowEdit;
    return [
      g(
        "div",
        {
          class: "row-edit-popover__placeholder",
          style: {
            display: u ? "block" : "none"
          }
        },
        null
      ),
      g(
        C("iBizRowEditPopover"),
        {
          ref: (h) => {
            n = h;
          },
          style: l,
          show: o.value,
          onConfirm: r,
          onCancel: c
        },
        null
      )
    ];
  };
  return t.evt.on("onRowEditChange", (u) => {
    u.row.showRowEdit ? setTimeout(() => {
      s(u.row);
    }, 0) : (i.value = void 0, o.value = !1, Object.assign(l, {
      top: void 0,
      left: void 0
    }));
  }), {
    renderPopover: d
  };
}
function Ze(e, t, n, o) {
  var i;
  if (t.hideDefault)
    return null;
  const { codeName: l, width: a } = t, s = e.columns[l], r = e.state.columnStates.find((u) => u.key === l), c = s.isAdaptiveColumn || !e.hasAdaptiveColumn && o === n.length - 1 ? "min-width" : "width";
  let d = "";
  return t.columnType === "UAGRIDCOLUMN" && (d = "attachment-ua-column"), g(
    C("el-table-column"),
    Se(
      {
        label: t.caption,
        prop: l,
        "class-name": d,
        "label-class-name": d
      },
      {
        [c]: a
      },
      {
        fixed: r.fixed,
        sortable: t.enableSort ? "custom" : !1,
        align: ((i = t.align) == null ? void 0 : i.toLowerCase()) || "center"
      }
    ),
    {
      default: ({ row: u }) => {
        var h, f;
        let m = u;
        u.isGroupData && (m = u.first);
        const p = e.findRowState(m);
        if (p) {
          if (t.columnType === "UAGRIDCOLUMN") {
            const E = U("grid-ua-column"), S = U("attachment-grid"), w = ((h = s.model.deuiactionGroup) == null ? void 0 : h.uiactionGroupDetails) || [], D = w.filter((k) => k.actionLevel !== 250), y = w.filter((k) => k.actionLevel === 250);
            return g(
              "div",
              {
                class: [
                  E.b(),
                  (f = s.model.cellSysCss) == null ? void 0 : f.cssName
                ]
              },
              [
                y.length && g(
                  C("iBizActionToolbar"),
                  {
                    onDblclick: M,
                    onClick: M,
                    "action-details": y,
                    "actions-state": p.uaColStates[s.model.codeName],
                    popperClass: S.e("popper"),
                    onActionClick: (k, V) => {
                      K(k, V, s, p);
                    }
                  },
                  null
                ),
                D.length && g(
                  C("iBizActionToolbar"),
                  {
                    onDblclick: M,
                    onClick: M,
                    mode: "dropdown",
                    caption: "· · ·",
                    "action-details": D,
                    popperClass: S.e("popper"),
                    "actions-state": p.uaColStates[s.model.codeName],
                    onActionClick: (k, V) => {
                      K(k, V, s, p);
                    }
                  },
                  null
                )
              ]
            );
          }
          const R = C(e.providers[l].component);
          return u(R, {
            controller: s,
            row: p,
            key: m.tempsrfkey + l
          });
        }
        return null;
      }
    }
  );
}
function pe(e, t, n, o) {
  var i, l;
  if (t.columnType === "GROUPGRIDCOLUMN") {
    const a = ((i = t.degridColumns) == null ? void 0 : i.filter((c) => !c.hideDefault)) || [], { width: s } = t, r = ((l = t.align) == null ? void 0 : l.toLowerCase()) || "center";
    return g(
      C("el-table-column"),
      {
        prop: t.codeName,
        label: t.caption,
        "min-width": s,
        align: r
      },
      {
        default: () => a.map((c, d) => pe(e, c, n, d))
      }
    );
  }
  return Ze(e, t, n, o);
}
const q = De({
  name: "AttachmentGridControl",
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
  setup(e) {
    const t = ge(
      (...w) => new ke(...w)
    ), n = U(
      "control-".concat(t.model.controlType.toLowerCase())
    ), {
      tableRef: o,
      onRowClick: i,
      onDbRowClick: l,
      onSelectionChange: a,
      onSortChange: s,
      handleRowClassName: r,
      handleHeaderCellClassName: c
    } = Ee(t), {
      onPageChange: d,
      onPageRefresh: u,
      onPageSizeChange: h
    } = Te(t), f = () => {
      var w;
      const { isLoaded: D } = t.state;
      if (D) {
        const y = (w = t.model.controls) == null ? void 0 : w.find(
          (k) => k.name === "".concat(t.model.name, "_quicktoolbar")
        );
        return y ? g(
          C("iBizToolbarControl"),
          {
            modelData: y,
            context: t.context,
            params: t.params,
            class: n.b("quick-toolbar")
          },
          null
        ) : g(
          C("iBizNoData"),
          {
            text: t.model.emptyText,
            emptyTextLanguageRes: t.model.emptyTextLanguageRes
          },
          null
        );
      }
      return null;
    }, {
      tableData: m,
      renderColumns: p,
      defaultSort: R,
      summaryMethod: E
    } = Le(t, e), { renderPopover: S } = Ke(
      o,
      t
    );
    return {
      c: t,
      ns: n,
      tableRef: o,
      tableData: m,
      renderColumns: p,
      onDbRowClick: l,
      onRowClick: i,
      onSelectionChange: a,
      onSortChange: s,
      onPageChange: d,
      onPageSizeChange: h,
      onPageRefresh: u,
      handleRowClassName: r,
      handleHeaderCellClassName: c,
      renderNoData: f,
      summaryMethod: E,
      renderPopover: S,
      defaultSort: R,
      onColumnStateClick: (w) => {
        t.setColumnVisible(w);
      },
      renderBatchToolBar: () => {
        var w;
        const D = (w = t.model.controls) == null ? void 0 : w.find(
          (y) => y.name === "".concat(t.model.name, "_batchtoolbar")
        );
        if (!(!D || t.state.singleSelect))
          return g(
            "div",
            {
              class: [
                n.b("batch-toolbar"),
                n.is("show", t.state.selectedData.length > 0)
              ]
            },
            [
              g(
                "div",
                {
                  class: n.b("batch-toolbar-content")
                },
                [
                  g(
                    "div",
                    {
                      class: n.b("batch-toolbar-text")
                    },
                    [
                      W("已选中"),
                      t.state.selectedData.length,
                      W("项")
                    ]
                  ),
                  g(
                    "div",
                    {
                      class: n.b("batch-toolbar-separator")
                    },
                    [W("|")]
                  ),
                  g(
                    C("iBizToolbarControl"),
                    {
                      modelData: D,
                      context: t.context,
                      params: t.params,
                      class: n.b("batch-toolbar-items")
                    },
                    null
                  )
                ]
              )
            ]
          );
      }
    };
  },
  render() {
    if (!this.c.state.isLoaded)
      return;
    const { state: e } = this.c, { hideHeader: t, enablePagingBar: n } = this.c.model;
    return g(
      C("iBizControlBase"),
      {
        class: [
          this.ns.is("show-header", !t),
          this.ns.is("enable-page", n),
          this.ns.is("enable-group", this.c.model.enableGroup)
        ],
        controller: this.c
      },
      {
        default: () => [
          g(
            C("el-table"),
            {
              ref: "tableRef",
              class: [this.ns.e("table"), this.ns.is("attachment", !0)],
              "default-sort": this.defaultSort,
              border: !0,
              "show-header": !t,
              "show-summary": this.c.enableAgg,
              "summary-method": this.summaryMethod,
              "highlight-current-row": e.singleSelect,
              "row-class-name": this.handleRowClassName,
              "header-cell-class-name": this.handleHeaderCellClassName,
              "row-key": "tempsrfkey",
              data: this.tableData,
              onRowClick: this.onRowClick,
              onRowDblclick: this.onDbRowClick,
              onSelectionChange: this.onSelectionChange,
              onSortChange: this.onSortChange,
              "tooltip-effect": "light"
            },
            {
              empty: this.renderNoData,
              default: () => [
                !e.singleSelect && g(
                  C("el-table-column"),
                  {
                    "class-name": this.ns.e("selection"),
                    type: "selection",
                    width: "55"
                  },
                  null
                ),
                this.renderColumns.map(
                  (o, i) => pe(this.c, o, this.renderColumns, i)
                )
              ],
              append: () => this.renderPopover()
            }
          ),
          n && g(
            C("iBizPagination"),
            {
              total: e.total,
              curPage: e.curPage,
              size: e.size,
              onChange: this.onPageChange,
              onPageSizeChange: this.onPageSizeChange,
              onPageRefresh: this.onPageRefresh
            },
            null
          ),
          this.c.model.enableCustomized && !t && g(
            "div",
            {
              class: this.ns.b("setting-box")
            },
            [
              g(
                C("iBizGridSetting"),
                {
                  columnStates: e.columnStates,
                  controller: this.c
                },
                null
              )
            ]
          ),
          this.renderBatchToolBar()
        ]
      }
    );
  }
});
class et {
  constructor() {
    this.component = "AttachmentGridControl";
  }
}
const tt = we(q, (e) => {
  e.component(q.name, q), ve(
    "".concat(xe.GRID, "_RENDER_ATTACHMENT_GRID"),
    () => new et()
  );
}), st = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(e) {
    e.use(tt);
  }
};
export {
  tt as IBizAttachmentGridControl,
  st as default
};
