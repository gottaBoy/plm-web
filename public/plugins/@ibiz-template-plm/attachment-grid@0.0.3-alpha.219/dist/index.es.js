import './assets/style.css';
import './assets/style.css';
import { withInstall as ge, useControlController as we, useNamespace as U } from "@ibiz-template/vue3-util";
import { registerControlProvider as ye, ControlType as be, GridController as Ce, GridRowState as ve, ControlVO as xe } from "@ibiz-template/runtime";
import { defineComponent as Re, createVNode as g, createTextVNode as V, resolveComponent as b, ref as Q, watch as X, computed as j, reactive as Se, mergeProps as De, h as ke } from "vue";
import { RuntimeError as W } from "@ibiz-template/core";
var Te = Object.defineProperty, Ee = (e, t, o) => t in e ? Te(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o, Le = (e, t, o) => (Ee(e, typeof t != "symbol" ? t + "" : t, o), o);
function Pe(e) {
  function t(l) {
    !l || l === e.state.curPage || (e.state.curPage = l, e.load());
  }
  function o(l) {
    !l || l === e.state.size || (e.state.size = l, e.state.curPage === 1 && e.load());
  }
  function n() {
    e.load();
  }
  return { onPageChange: t, onPageSizeChange: o, onPageRefresh: n };
}
function Ne(e) {
  const t = Q();
  let o = !1;
  async function n(c, u, d) {
    if (ibiz.config.grid.editShowMode === "row" && e.model.enableRowEdit) {
      const h = e.findRowState(c);
      h && h.showRowEdit !== !0 && await e.switchRowEdit(h, !0);
    } else
      e.onRowClick(c);
  }
  function l(c) {
    e.onDbRowClick(c);
  }
  function r(c) {
    o || e.setSelection(c);
  }
  X(
    [
      () => t.value,
      () => e.state.isLoaded,
      () => e.state.selectedData
    ],
    ([c, u, d]) => {
      !u || !c || (e.state.singleSelect ? d[0] ? t.value.setCurrentRow(d[0], !0) : t.value.setCurrentRow() : (o = !0, t.value.clearSelection(), d.forEach((h) => t.value.toggleRowSelection(h, !0)), o = !1));
    }
  );
  function i(c) {
    const { prop: u, order: d } = c, h = e.fieldColumns[u].model.appDEFieldId;
    let f;
    d === "ascending" ? f = "asc" : d === "descending" && (f = "desc"), e.setSort(h, f), e.load();
  }
  function a({ row: c }) {
    let u = "";
    e.state.selectedData.length > 0 && e.state.selectedData.forEach((h) => {
      h === c && (u = "current-row");
    });
    const d = e.findRowState(c);
    return d != null && d.showRowEdit && (u += " editing-row"), c.srfkey && (u += " id-".concat(c.srfkey)), u;
  }
  function s({
    _row: c,
    column: u,
    _rowIndex: d,
    _columnIndex: h
  }) {
    var f;
    const m = (f = e.model.degridColumns) == null ? void 0 : f.find((p) => p.codeName === u.property);
    return m && m.headerSysCss && m.headerSysCss.cssName ? m.headerSysCss.cssName : "";
  }
  return X(
    () => e.state.sortQuery,
    (c) => {
      if (c) {
        const u = e.state.sortQuery.split(",")[0], d = e.state.sortQuery.split(",")[1];
        if (t.value && u && d) {
          const h = d === "desc" ? "descending" : "ascending";
          setTimeout(() => {
            var f;
            (f = t.value) == null || f.sort(u, h);
          });
        }
      }
    }
  ), {
    tableRef: t,
    onRowClick: n,
    onDbRowClick: l,
    onSelectionChange: r,
    onSortChange: i,
    handleRowClassName: a,
    handleHeaderCellClassName: s
  };
}
function Be(e, t) {
  const o = () => {
    t.data && (e.state.items = t.data, e.state.rows = t.data.map((i) => new ve(new xe(i), e)));
  }, n = j(() => {
    var i;
    const a = Object.values(e.fieldColumns).find(
      (s) => s.model.appDEFieldId === e.model.minorSortAppDEFieldId
    );
    return {
      prop: a == null ? void 0 : a.model.codeName,
      order: ((i = e.model.minorSortDir) == null ? void 0 : i.toLowerCase()) === "desc" ? "descending" : "ascending"
    };
  });
  e.evt.on("onCreated", async () => {
    t.isSimple && (o(), e.state.isLoaded = !0);
  }), X(
    () => t.data,
    () => {
      t.isSimple && o();
    },
    {
      deep: !0
    }
  );
  const l = j(() => {
    const { state: i } = e;
    if (e.model.enableGroup) {
      const a = [];
      return i.groups.forEach((s) => {
        if (!s.children.length)
          return;
        const c = [...s.children], u = c.shift();
        a.push({
          srfkey: (u == null ? void 0 : u.srfkey) || s.caption,
          isGroupData: !0,
          caption: s.caption,
          first: u,
          children: c
        });
      }), a;
    }
    return i.rows.map((a) => a.data);
  }), r = j(() => {
    if (e.isMultistageHeader)
      return e.model.degridColumns || [];
    const i = [];
    return e.state.columnStates.forEach((a) => {
      var s, c;
      if (a.hidden)
        return;
      const u = ((s = e.fieldColumns[a.key]) == null ? void 0 : s.model) || ((c = e.uaColumns[a.key]) == null ? void 0 : c.model);
      u && i.push(u);
    }), i;
  });
  return { tableData: l, renderColumns: r, defaultSort: n, summaryMethod: ({
    columns: i
  }) => i.map((a, s) => s === 0 ? e.aggTitle : e.state.aggResult[a.property]) };
}
const G = (e) => {
  e.stopPropagation();
}, K = async (e, t, o, n) => {
  o.grid.setSelection([n.data]), await o.onActionClick(e, n, t);
};
function le(e) {
  return e.split("-")[0];
}
function ze(e) {
  return e.split("-")[1];
}
function Ae(e) {
  return e === "x" ? "y" : "x";
}
function Oe(e) {
  return e === "y" ? "height" : "width";
}
function ie(e) {
  return ["top", "bottom"].includes(le(e)) ? "y" : "x";
}
function Me(e) {
  return Ae(ie(e));
}
function ae(e) {
  const {
    x: t,
    y: o,
    width: n,
    height: l
  } = e;
  return {
    width: n,
    height: l,
    top: o,
    left: t,
    right: t + n,
    bottom: o + l,
    x: t,
    y: o
  };
}
function Z(e, t, o) {
  let {
    reference: n,
    floating: l
  } = e;
  const r = ie(t), i = Me(t), a = Oe(i), s = le(t), c = r === "y", u = n.x + n.width / 2 - l.width / 2, d = n.y + n.height / 2 - l.height / 2, h = n[a] / 2 - l[a] / 2;
  let f;
  switch (s) {
    case "top":
      f = {
        x: u,
        y: n.y - l.height
      };
      break;
    case "bottom":
      f = {
        x: u,
        y: n.y + n.height
      };
      break;
    case "right":
      f = {
        x: n.x + n.width,
        y: d
      };
      break;
    case "left":
      f = {
        x: n.x - l.width,
        y: d
      };
      break;
    default:
      f = {
        x: n.x,
        y: n.y
      };
  }
  switch (ze(t)) {
    case "start":
      f[i] -= h * (o && c ? -1 : 1);
      break;
    case "end":
      f[i] += h * (o && c ? -1 : 1);
      break;
  }
  return f;
}
const Ge = async (e, t, o) => {
  const {
    placement: n = "bottom",
    strategy: l = "absolute",
    middleware: r = [],
    platform: i
  } = o, a = r.filter(Boolean), s = await (i.isRTL == null ? void 0 : i.isRTL(t));
  let c = await i.getElementRects({
    reference: e,
    floating: t,
    strategy: l
  }), {
    x: u,
    y: d
  } = Z(c, n, s), h = n, f = {}, m = 0;
  for (let p = 0; p < a.length; p++) {
    const {
      name: R,
      fn: E
    } = a[p], {
      x: S,
      y: w,
      data: D,
      reset: y
    } = await E({
      x: u,
      y: d,
      initialPlacement: n,
      placement: h,
      strategy: l,
      middlewareData: f,
      rects: c,
      platform: i,
      elements: {
        reference: e,
        floating: t
      }
    });
    u = S != null ? S : u, d = w != null ? w : d, f = {
      ...f,
      [R]: {
        ...f[R],
        ...D
      }
    }, y && m <= 50 && (m++, typeof y == "object" && (y.placement && (h = y.placement), y.rects && (c = y.rects === !0 ? await i.getElementRects({
      reference: e,
      floating: t,
      strategy: l
    }) : y.rects), {
      x: u,
      y: d
    } = Z(c, h, s)), p = -1);
  }
  return {
    x: u,
    y: d,
    placement: h,
    strategy: l,
    middlewareData: f
  };
}, ee = Math.min, A = Math.max, H = Math.round, L = (e) => ({
  x: e,
  y: e
});
function P(e) {
  return re(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function C(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function N(e) {
  var t;
  return (t = (re(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function re(e) {
  return e instanceof Node || e instanceof C(e).Node;
}
function T(e) {
  return e instanceof Element || e instanceof C(e).Element;
}
function x(e) {
  return e instanceof HTMLElement || e instanceof C(e).HTMLElement;
}
function te(e) {
  return typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof C(e).ShadowRoot;
}
function M(e) {
  const {
    overflow: t,
    overflowX: o,
    overflowY: n,
    display: l
  } = v(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + n + o) && !["inline", "contents"].includes(l);
}
function He(e) {
  return ["table", "td", "th"].includes(P(e));
}
function $(e) {
  const t = J(), o = v(e);
  return o.transform !== "none" || o.perspective !== "none" || (o.containerType ? o.containerType !== "normal" : !1) || !t && (o.backdropFilter ? o.backdropFilter !== "none" : !1) || !t && (o.filter ? o.filter !== "none" : !1) || ["transform", "perspective", "filter"].some((n) => (o.willChange || "").includes(n)) || ["paint", "layout", "strict", "content"].some((n) => (o.contain || "").includes(n));
}
function Ie(e) {
  let t = z(e);
  for (; x(t) && !I(t); ) {
    if ($(t))
      return t;
    t = z(t);
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
  return C(e).getComputedStyle(e);
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
function z(e) {
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
function se(e) {
  const t = z(e);
  return I(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : x(t) && M(t) ? t : se(t);
}
function Y(e, t, o) {
  var n;
  t === void 0 && (t = []), o === void 0 && (o = !0);
  const l = se(e), r = l === ((n = e.ownerDocument) == null ? void 0 : n.body), i = C(l);
  return r ? t.concat(i, i.visualViewport || [], M(l) ? l : [], i.frameElement && o ? Y(i.frameElement) : []) : t.concat(l, Y(l, [], o));
}
function ce(e) {
  const t = v(e);
  let o = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0;
  const l = x(e), r = l ? e.offsetWidth : o, i = l ? e.offsetHeight : n, a = H(o) !== r || H(n) !== i;
  return a && (o = r, n = i), {
    width: o,
    height: n,
    $: a
  };
}
function ue(e) {
  return T(e) ? e : e.contextElement;
}
function B(e) {
  const t = ue(e);
  if (!x(t))
    return L(1);
  const o = t.getBoundingClientRect(), {
    width: n,
    height: l,
    $: r
  } = ce(t);
  let i = (r ? H(o.width) : o.width) / n, a = (r ? H(o.height) : o.height) / l;
  return (!i || !Number.isFinite(i)) && (i = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: i,
    y: a
  };
}
const _e = /* @__PURE__ */ L(0);
function de(e) {
  const t = C(e);
  return !J() || !t.visualViewport ? _e : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Fe(e, t, o) {
  return t === void 0 && (t = !1), !o || t && o !== C(e) ? !1 : t;
}
function O(e, t, o, n) {
  t === void 0 && (t = !1), o === void 0 && (o = !1);
  const l = e.getBoundingClientRect(), r = ue(e);
  let i = L(1);
  t && (n ? T(n) && (i = B(n)) : i = B(e));
  const a = Fe(r, o, n) ? de(r) : L(0);
  let s = (l.left + a.x) / i.x, c = (l.top + a.y) / i.y, u = l.width / i.x, d = l.height / i.y;
  if (r) {
    const h = C(r), f = n && T(n) ? C(n) : n;
    let m = h.frameElement;
    for (; m && n && f !== h; ) {
      const p = B(m), R = m.getBoundingClientRect(), E = v(m), S = R.left + (m.clientLeft + parseFloat(E.paddingLeft)) * p.x, w = R.top + (m.clientTop + parseFloat(E.paddingTop)) * p.y;
      s *= p.x, c *= p.y, u *= p.x, d *= p.y, s += S, c += w, m = C(m).frameElement;
    }
  }
  return ae({
    width: u,
    height: d,
    x: s,
    y: c
  });
}
function Ve(e) {
  let {
    rect: t,
    offsetParent: o,
    strategy: n
  } = e;
  const l = x(o), r = N(o);
  if (o === r)
    return t;
  let i = {
    scrollLeft: 0,
    scrollTop: 0
  }, a = L(1);
  const s = L(0);
  if ((l || !l && n !== "fixed") && ((P(o) !== "body" || M(r)) && (i = _(o)), x(o))) {
    const c = O(o);
    a = B(o), s.x = c.x + o.clientLeft, s.y = c.y + o.clientTop;
  }
  return {
    width: t.width * a.x,
    height: t.height * a.y,
    x: t.x * a.x - i.scrollLeft * a.x + s.x,
    y: t.y * a.y - i.scrollTop * a.y + s.y
  };
}
function je(e) {
  return Array.from(e.getClientRects());
}
function fe(e) {
  return O(N(e)).left + _(e).scrollLeft;
}
function We(e) {
  const t = N(e), o = _(e), n = e.ownerDocument.body, l = A(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth), r = A(t.scrollHeight, t.clientHeight, n.scrollHeight, n.clientHeight);
  let i = -o.scrollLeft + fe(e);
  const a = -o.scrollTop;
  return v(n).direction === "rtl" && (i += A(t.clientWidth, n.clientWidth) - l), {
    width: l,
    height: r,
    x: i,
    y: a
  };
}
function qe(e, t) {
  const o = C(e), n = N(e), l = o.visualViewport;
  let r = n.clientWidth, i = n.clientHeight, a = 0, s = 0;
  if (l) {
    r = l.width, i = l.height;
    const c = J();
    (!c || c && t === "fixed") && (a = l.offsetLeft, s = l.offsetTop);
  }
  return {
    width: r,
    height: i,
    x: a,
    y: s
  };
}
function Ue(e, t) {
  const o = O(e, !0, t === "fixed"), n = o.top + e.clientTop, l = o.left + e.clientLeft, r = x(e) ? B(e) : L(1), i = e.clientWidth * r.x, a = e.clientHeight * r.y, s = l * r.x, c = n * r.y;
  return {
    width: i,
    height: a,
    x: s,
    y: c
  };
}
function oe(e, t, o) {
  let n;
  if (t === "viewport")
    n = qe(e, o);
  else if (t === "document")
    n = We(N(e));
  else if (T(t))
    n = Ue(t, o);
  else {
    const l = de(e);
    n = {
      ...t,
      x: t.x - l.x,
      y: t.y - l.y
    };
  }
  return ae(n);
}
function he(e, t) {
  const o = z(e);
  return o === t || !T(o) || I(o) ? !1 : v(o).position === "fixed" || he(o, t);
}
function Qe(e, t) {
  const o = t.get(e);
  if (o)
    return o;
  let n = Y(e, [], !1).filter((a) => T(a) && P(a) !== "body"), l = null;
  const r = v(e).position === "fixed";
  let i = r ? z(e) : e;
  for (; T(i) && !I(i); ) {
    const a = v(i), s = $(i);
    !s && a.position === "fixed" && (l = null), (r ? !s && !l : !s && a.position === "static" && l && ["absolute", "fixed"].includes(l.position) || M(i) && !s && he(e, i)) ? n = n.filter((c) => c !== i) : l = a, i = z(i);
  }
  return t.set(e, n), n;
}
function Xe(e) {
  let {
    element: t,
    boundary: o,
    rootBoundary: n,
    strategy: l
  } = e;
  const r = [...o === "clippingAncestors" ? Qe(t, this._c) : [].concat(o), n], i = r[0], a = r.reduce((s, c) => {
    const u = oe(t, c, l);
    return s.top = A(u.top, s.top), s.right = ee(u.right, s.right), s.bottom = ee(u.bottom, s.bottom), s.left = A(u.left, s.left), s;
  }, oe(t, i, l));
  return {
    width: a.right - a.left,
    height: a.bottom - a.top,
    x: a.left,
    y: a.top
  };
}
function Ye(e) {
  return ce(e);
}
function $e(e, t, o) {
  const n = x(t), l = N(t), r = o === "fixed", i = O(e, !0, r, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const s = L(0);
  if (n || !n && !r)
    if ((P(t) !== "body" || M(l)) && (a = _(t)), n) {
      const c = O(t, !0, r, t);
      s.x = c.x + t.clientLeft, s.y = c.y + t.clientTop;
    } else
      l && (s.x = fe(l));
  return {
    x: i.left + a.scrollLeft - s.x,
    y: i.top + a.scrollTop - s.y,
    width: i.width,
    height: i.height
  };
}
function ne(e, t) {
  return !x(e) || v(e).position === "fixed" ? null : t ? t(e) : e.offsetParent;
}
function me(e, t) {
  const o = C(e);
  if (!x(e))
    return o;
  let n = ne(e, t);
  for (; n && He(n) && v(n).position === "static"; )
    n = ne(n, t);
  return n && (P(n) === "html" || P(n) === "body" && v(n).position === "static" && !$(n)) ? o : n || Ie(e) || o;
}
const Je = async function(e) {
  let {
    reference: t,
    floating: o,
    strategy: n
  } = e;
  const l = this.getOffsetParent || me, r = this.getDimensions;
  return {
    reference: $e(t, await l(o), n),
    floating: {
      x: 0,
      y: 0,
      ...await r(o)
    }
  };
};
function Ke(e) {
  return v(e).direction === "rtl";
}
const Ze = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Ve,
  getDocumentElement: N,
  getClippingRect: Xe,
  getOffsetParent: me,
  getElementRects: Je,
  getClientRects: je,
  getDimensions: Ye,
  getScale: B,
  isElement: T,
  isRTL: Ke
}, et = (e, t, o) => {
  const n = /* @__PURE__ */ new Map(), l = {
    platform: Ze,
    ...o
  }, r = {
    ...l.platform,
    _c: n
  };
  return Ge(e, t, {
    ...l,
    platform: r
  });
};
function tt(e, t) {
  let o;
  const n = Q(!1), l = Q(), r = Se({}), i = (d) => {
    if (!e.value)
      throw new W("找不到表格组件引用");
    const h = e.value.$el;
    let f = ".el-table__row";
    d.data.srfkey && (f += ".id-".concat(d.data.srfkey));
    const m = h.querySelector(f);
    if (!m)
      throw new W("找不到对应的表格行dom元素");
    return m;
  }, a = async (d) => {
    const h = i(d);
    if (!o)
      throw new W("拿不到pop组件的实例");
    const f = o.$el, {
      x: m,
      y: p
    } = await et(h, f, {
      placement: "bottom"
    });
    Object.assign(r, {
      top: "".concat(p, "px"),
      left: "".concat(m, "px")
    }), l.value = d, n.value = !0;
  }, s = async () => {
    l.value && t.switchRowEdit(l.value, !1, !0);
  }, c = async () => {
    l.value && t.switchRowEdit(l.value, !1, !1);
  }, u = () => {
    const d = n.value && t.state.rows[t.state.rows.length - 1].showRowEdit;
    return [g("div", {
      class: "row-edit-popover__placeholder",
      style: {
        display: d ? "block" : "none"
      }
    }, null), g(b("iBizRowEditPopover"), {
      ref: (h) => {
        o = h;
      },
      style: r,
      show: n.value,
      onConfirm: s,
      onCancel: c
    }, null)];
  };
  return t.evt.on("onRowEditChange", (d) => {
    d.row.showRowEdit ? setTimeout(() => {
      a(d.row);
    }, 0) : (l.value = void 0, n.value = !1, Object.assign(r, {
      top: void 0,
      left: void 0
    }));
  }), {
    renderPopover: u
  };
}
class ot extends Ce {
  /**
   * 添加附件
   *
   * @memberof AttachGridController
   */
  async addAttachMent(t) {
    const { appDataEntityId: o } = this.model;
    o && (await ibiz.hub.getApp(this.context.srfappid).deService.exec(o, "create", this.context, t), await this.load({ isInitialLoad: !1 }), await this.evt.emit("onSaveSuccess", void 0));
  }
}
function nt(e, t, o, n) {
  var l;
  if (t.hideDefault)
    return null;
  const {
    codeName: r,
    width: i
  } = t, a = e.columns[r], s = e.state.columnStates.find((d) => d.key === r), c = a.isAdaptiveColumn || !e.hasAdaptiveColumn && n === o.length - 1 ? "min-width" : "width";
  let u = "";
  return t.columnType === "UAGRIDCOLUMN" && (u = "attachment-ua-column"), g(b("el-table-column"), De({
    label: t.caption,
    prop: r,
    "class-name": u,
    "label-class-name": u
  }, {
    [c]: i
  }, {
    fixed: s.fixed,
    sortable: t.enableSort ? "custom" : !1,
    align: ((l = t.align) == null ? void 0 : l.toLowerCase()) || "center"
  }), {
    default: ({
      row: d
    }) => {
      var h, f;
      let m = d;
      d.isGroupData && (m = d.first);
      const p = e.findRowState(m);
      if (p) {
        if (t.columnType === "UAGRIDCOLUMN") {
          const E = U("grid-ua-column"), S = U("attachment-grid"), w = ((h = a.model.deuiactionGroup) == null ? void 0 : h.uiactionGroupDetails) || [], D = w.filter((k) => k.actionLevel !== 250), y = w.filter((k) => k.actionLevel === 250);
          return g("div", {
            class: [E.b(), (f = a.model.cellSysCss) == null ? void 0 : f.cssName]
          }, [y.length && g(b("iBizActionToolbar"), {
            onDblclick: G,
            onClick: G,
            "action-details": y,
            "actions-state": p.uaColStates[a.model.codeName],
            popperClass: S.e("popper"),
            onActionClick: (k, F) => {
              K(k, F, a, p);
            }
          }, null), D.length && g(b("iBizActionToolbar"), {
            onDblclick: G,
            onClick: G,
            mode: "dropdown",
            caption: "· · ·",
            "action-details": D,
            popperClass: S.e("popper"),
            "actions-state": p.uaColStates[a.model.codeName],
            onActionClick: (k, F) => {
              K(k, F, a, p);
            }
          }, null)]);
        }
        const R = b(e.providers[r].component);
        return ke(R, {
          controller: a,
          row: p,
          key: m.tempsrfkey + r
        });
      }
      return null;
    }
  });
}
function pe(e, t, o, n) {
  var l, r;
  if (t.columnType === "GROUPGRIDCOLUMN") {
    const i = ((l = t.degridColumns) == null ? void 0 : l.filter((c) => !c.hideDefault)) || [], {
      width: a
    } = t, s = ((r = t.align) == null ? void 0 : r.toLowerCase()) || "center";
    return g(b("el-table-column"), {
      prop: t.codeName,
      label: t.caption,
      "min-width": a,
      align: s
    }, {
      default: () => i.map((c, u) => pe(e, c, o, u))
    });
  }
  return nt(e, t, o, n);
}
const q = /* @__PURE__ */ Re({
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
    const t = we((...w) => new ot(...w)), o = U("control-".concat(t.model.controlType.toLowerCase())), {
      tableRef: n,
      onRowClick: l,
      onDbRowClick: r,
      onSelectionChange: i,
      onSortChange: a,
      handleRowClassName: s,
      handleHeaderCellClassName: c
    } = Ne(t), {
      onPageChange: u,
      onPageRefresh: d,
      onPageSizeChange: h
    } = Pe(t), f = () => {
      var w;
      const {
        isLoaded: D
      } = t.state;
      if (D) {
        const y = (w = t.model.controls) == null ? void 0 : w.find((k) => k.name === "".concat(t.model.name, "_quicktoolbar"));
        return y ? g(b("iBizToolbarControl"), {
          modelData: y,
          context: t.context,
          params: t.params,
          class: o.b("quick-toolbar")
        }, null) : g(b("iBizNoData"), {
          text: t.model.emptyText,
          emptyTextLanguageRes: t.model.emptyTextLanguageRes
        }, null);
      }
      return null;
    }, {
      tableData: m,
      renderColumns: p,
      defaultSort: R,
      summaryMethod: E
    } = Be(t, e), {
      renderPopover: S
    } = tt(n, t);
    return {
      c: t,
      ns: o,
      tableRef: n,
      tableData: m,
      renderColumns: p,
      onDbRowClick: r,
      onRowClick: l,
      onSelectionChange: i,
      onSortChange: a,
      onPageChange: u,
      onPageSizeChange: h,
      onPageRefresh: d,
      handleRowClassName: s,
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
        const D = (w = t.model.controls) == null ? void 0 : w.find((y) => y.name === "".concat(t.model.name, "_batchtoolbar"));
        if (!(!D || t.state.singleSelect))
          return g("div", {
            class: [o.b("batch-toolbar"), o.is("show", t.state.selectedData.length > 0)]
          }, [g("div", {
            class: o.b("batch-toolbar-content")
          }, [g("div", {
            class: o.b("batch-toolbar-text")
          }, [V("已选中"), t.state.selectedData.length, V("项")]), g("div", {
            class: o.b("batch-toolbar-separator")
          }, [V("|")]), g(b("iBizToolbarControl"), {
            modelData: D,
            context: t.context,
            params: t.params,
            class: o.b("batch-toolbar-items")
          }, null)])]);
      }
    };
  },
  render() {
    if (!this.c.state.isLoaded)
      return;
    const {
      state: e
    } = this.c, {
      hideHeader: t,
      enablePagingBar: o
    } = this.c.model;
    return g(b("iBizControlBase"), {
      class: [this.ns.is("show-header", !t), this.ns.is("enable-page", o), this.ns.is("enable-group", this.c.model.enableGroup)],
      controller: this.c
    }, {
      default: () => [g(b("el-table"), {
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
      }, {
        empty: this.renderNoData,
        default: () => [!e.singleSelect && g(b("el-table-column"), {
          "class-name": this.ns.e("selection"),
          type: "selection",
          width: "55"
        }, null), this.renderColumns.map((n, l) => pe(this.c, n, this.renderColumns, l))],
        append: () => this.renderPopover()
      }), o && g(b("iBizPagination"), {
        total: e.total,
        curPage: e.curPage,
        size: e.size,
        onChange: this.onPageChange,
        onPageSizeChange: this.onPageSizeChange,
        onPageRefresh: this.onPageRefresh
      }, null), this.c.model.enableCustomized && !t && g("div", {
        class: this.ns.b("setting-box")
      }, [g(b("iBizGridSetting"), {
        columnStates: e.columnStates,
        controller: this.c
      }, null)]), this.renderBatchToolBar()]
    });
  }
});
class lt {
  constructor() {
    Le(this, "component", "AttachmentGridControl");
  }
}
const it = ge(
  q,
  (e) => {
    e.component(q.name, q), ye(
      "".concat(be.GRID, "_RENDER_ATTACHMENT_GRID"),
      () => new lt()
    );
  }
), ut = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(e) {
    e.use(it);
  }
};
export {
  it as IBizAttachmentGridControl,
  ut as default
};
