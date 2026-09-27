import './assets/style.css';
import './assets/style.css';
import { withInstall as Je, useControlController as me, useUIStore as Ze, useNamespace as se } from "@ibiz-template/vue3-util";
import { registerControlProvider as et, TreeGridController as tt, Srfuf as V, calcDeCodeNameById as ot, GridNotifyState as pe, GridRowState as xe, GridController as nt, ControlVO as st, ScriptFactory as it } from "@ibiz-template/runtime";
import { defineComponent as at, computed as M, onMounted as rt, watch as Q, nextTick as Y, onUnmounted as lt, createVNode as C, resolveComponent as S, ref as J, reactive as ct, createTextVNode as q, mergeProps as Ee, h as dt } from "vue";
import { toNumber as ut, isArray as ge } from "lodash-es";
import { isElementSame as ht, RuntimeError as j, awaitTimeout as ft, mergeDefaultInLeft as mt, RuntimeModelError as pt, recursiveIterate as gt } from "@ibiz-template/core";
import { createUUID as Re } from "qx-util";
const we = Math.min, H = Math.max, Z = Math.round, F = (t) => ({
  x: t,
  y: t
});
function Se(t) {
  return t.split("-")[0];
}
function wt(t) {
  return t.split("-")[1];
}
function yt(t) {
  return t === "x" ? "y" : "x";
}
function vt(t) {
  return t === "y" ? "height" : "width";
}
function De(t) {
  return ["top", "bottom"].includes(Se(t)) ? "y" : "x";
}
function Ct(t) {
  return yt(De(t));
}
function Te(t) {
  return {
    ...t,
    top: t.y,
    left: t.x,
    right: t.x + t.width,
    bottom: t.y + t.height
  };
}
function ye(t, e, o) {
  let {
    reference: n,
    floating: s
  } = t;
  const r = De(e), i = Ct(e), a = vt(i), l = Se(e), c = r === "y", g = n.x + n.width / 2 - s.width / 2, f = n.y + n.height / 2 - s.height / 2, p = n[a] / 2 - s[a] / 2;
  let d;
  switch (l) {
    case "top":
      d = {
        x: g,
        y: n.y - s.height
      };
      break;
    case "bottom":
      d = {
        x: g,
        y: n.y + n.height
      };
      break;
    case "right":
      d = {
        x: n.x + n.width,
        y: f
      };
      break;
    case "left":
      d = {
        x: n.x - s.width,
        y: f
      };
      break;
    default:
      d = {
        x: n.x,
        y: n.y
      };
  }
  switch (wt(e)) {
    case "start":
      d[i] -= p * (o && c ? -1 : 1);
      break;
    case "end":
      d[i] += p * (o && c ? -1 : 1);
      break;
  }
  return d;
}
const bt = async (t, e, o) => {
  const {
    placement: n = "bottom",
    strategy: s = "absolute",
    middleware: r = [],
    platform: i
  } = o, a = r.filter(Boolean), l = await (i.isRTL == null ? void 0 : i.isRTL(e));
  let c = await i.getElementRects({
    reference: t,
    floating: e,
    strategy: s
  }), {
    x: g,
    y: f
  } = ye(c, n, l), p = n, d = {}, h = 0;
  for (let w = 0; w < a.length; w++) {
    const {
      name: b,
      fn: E
    } = a[w], {
      x: P,
      y: A,
      data: $,
      reset: k
    } = await E({
      x: g,
      y: f,
      initialPlacement: n,
      placement: p,
      strategy: s,
      middlewareData: d,
      rects: c,
      platform: i,
      elements: {
        reference: t,
        floating: e
      }
    });
    if (g = P != null ? P : g, f = A != null ? A : f, d = {
      ...d,
      [b]: {
        ...d[b],
        ...$
      }
    }, k && h <= 50) {
      h++, typeof k == "object" && (k.placement && (p = k.placement), k.rects && (c = k.rects === !0 ? await i.getElementRects({
        reference: t,
        floating: e,
        strategy: s
      }) : k.rects), {
        x: g,
        y: f
      } = ye(c, p, l)), w = -1;
      continue;
    }
  }
  return {
    x: g,
    y: f,
    placement: p,
    strategy: s,
    middlewareData: d
  };
};
function B(t) {
  return Ne(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function T(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function z(t) {
  var e;
  return (e = (Ne(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function Ne(t) {
  return t instanceof Node || t instanceof T(t).Node;
}
function G(t) {
  return t instanceof Element || t instanceof T(t).Element;
}
function I(t) {
  return t instanceof HTMLElement || t instanceof T(t).HTMLElement;
}
function ve(t) {
  return typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof T(t).ShadowRoot;
}
function K(t) {
  const {
    overflow: e,
    overflowX: o,
    overflowY: n,
    display: s
  } = L(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + n + o) && !["inline", "contents"].includes(s);
}
function xt(t) {
  return ["table", "td", "th"].includes(B(t));
}
function re(t) {
  const e = le(), o = L(t);
  return o.transform !== "none" || o.perspective !== "none" || (o.containerType ? o.containerType !== "normal" : !1) || !e && (o.backdropFilter ? o.backdropFilter !== "none" : !1) || !e && (o.filter ? o.filter !== "none" : !1) || ["transform", "perspective", "filter"].some((n) => (o.willChange || "").includes(n)) || ["paint", "layout", "strict", "content"].some((n) => (o.contain || "").includes(n));
}
function Et(t) {
  let e = U(t);
  for (; I(e) && !ee(e); ) {
    if (re(e))
      return e;
    e = U(e);
  }
  return null;
}
function le() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function ee(t) {
  return ["html", "body", "#document"].includes(B(t));
}
function L(t) {
  return T(t).getComputedStyle(t);
}
function te(t) {
  return G(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.pageXOffset,
    scrollTop: t.pageYOffset
  };
}
function U(t) {
  if (B(t) === "html")
    return t;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    ve(t) && t.host || // Fallback.
    z(t)
  );
  return ve(e) ? e.host : e;
}
function Le(t) {
  const e = U(t);
  return ee(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : I(e) && K(e) ? e : Le(e);
}
function ae(t, e, o) {
  var n;
  e === void 0 && (e = []), o === void 0 && (o = !0);
  const s = Le(t), r = s === ((n = t.ownerDocument) == null ? void 0 : n.body), i = T(s);
  return r ? e.concat(i, i.visualViewport || [], K(s) ? s : [], i.frameElement && o ? ae(i.frameElement) : []) : e.concat(s, ae(s, [], o));
}
function Pe(t) {
  const e = L(t);
  let o = parseFloat(e.width) || 0, n = parseFloat(e.height) || 0;
  const s = I(t), r = s ? t.offsetWidth : o, i = s ? t.offsetHeight : n, a = Z(o) !== r || Z(n) !== i;
  return a && (o = r, n = i), {
    width: o,
    height: n,
    $: a
  };
}
function Ie(t) {
  return G(t) ? t : t.contextElement;
}
function _(t) {
  const e = Ie(t);
  if (!I(e))
    return F(1);
  const o = e.getBoundingClientRect(), {
    width: n,
    height: s,
    $: r
  } = Pe(e);
  let i = (r ? Z(o.width) : o.width) / n, a = (r ? Z(o.height) : o.height) / s;
  return (!i || !Number.isFinite(i)) && (i = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: i,
    y: a
  };
}
const Rt = /* @__PURE__ */ F(0);
function Ae(t) {
  const e = T(t);
  return !le() || !e.visualViewport ? Rt : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function St(t, e, o) {
  return e === void 0 && (e = !1), !o || e && o !== T(t) ? !1 : e;
}
function W(t, e, o, n) {
  e === void 0 && (e = !1), o === void 0 && (o = !1);
  const s = t.getBoundingClientRect(), r = Ie(t);
  let i = F(1);
  e && (n ? G(n) && (i = _(n)) : i = _(t));
  const a = St(r, o, n) ? Ae(r) : F(0);
  let l = (s.left + a.x) / i.x, c = (s.top + a.y) / i.y, g = s.width / i.x, f = s.height / i.y;
  if (r) {
    const p = T(r), d = n && G(n) ? T(n) : n;
    let h = p.frameElement;
    for (; h && n && d !== p; ) {
      const w = _(h), b = h.getBoundingClientRect(), E = L(h), P = b.left + (h.clientLeft + parseFloat(E.paddingLeft)) * w.x, A = b.top + (h.clientTop + parseFloat(E.paddingTop)) * w.y;
      l *= w.x, c *= w.y, g *= w.x, f *= w.y, l += P, c += A, h = T(h).frameElement;
    }
  }
  return Te({
    width: g,
    height: f,
    x: l,
    y: c
  });
}
function Dt(t) {
  let {
    rect: e,
    offsetParent: o,
    strategy: n
  } = t;
  const s = I(o), r = z(o);
  if (o === r)
    return e;
  let i = {
    scrollLeft: 0,
    scrollTop: 0
  }, a = F(1);
  const l = F(0);
  if ((s || !s && n !== "fixed") && ((B(o) !== "body" || K(r)) && (i = te(o)), I(o))) {
    const c = W(o);
    a = _(o), l.x = c.x + o.clientLeft, l.y = c.y + o.clientTop;
  }
  return {
    width: e.width * a.x,
    height: e.height * a.y,
    x: e.x * a.x - i.scrollLeft * a.x + l.x,
    y: e.y * a.y - i.scrollTop * a.y + l.y
  };
}
function Tt(t) {
  return Array.from(t.getClientRects());
}
function ke(t) {
  return W(z(t)).left + te(t).scrollLeft;
}
function Nt(t) {
  const e = z(t), o = te(t), n = t.ownerDocument.body, s = H(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), r = H(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight);
  let i = -o.scrollLeft + ke(t);
  const a = -o.scrollTop;
  return L(n).direction === "rtl" && (i += H(e.clientWidth, n.clientWidth) - s), {
    width: s,
    height: r,
    x: i,
    y: a
  };
}
function Lt(t, e) {
  const o = T(t), n = z(t), s = o.visualViewport;
  let r = n.clientWidth, i = n.clientHeight, a = 0, l = 0;
  if (s) {
    r = s.width, i = s.height;
    const c = le();
    (!c || c && e === "fixed") && (a = s.offsetLeft, l = s.offsetTop);
  }
  return {
    width: r,
    height: i,
    x: a,
    y: l
  };
}
function Pt(t, e) {
  const o = W(t, !0, e === "fixed"), n = o.top + t.clientTop, s = o.left + t.clientLeft, r = I(t) ? _(t) : F(1), i = t.clientWidth * r.x, a = t.clientHeight * r.y, l = s * r.x, c = n * r.y;
  return {
    width: i,
    height: a,
    x: l,
    y: c
  };
}
function Ce(t, e, o) {
  let n;
  if (e === "viewport")
    n = Lt(t, o);
  else if (e === "document")
    n = Nt(z(t));
  else if (G(e))
    n = Pt(e, o);
  else {
    const s = Ae(t);
    n = {
      ...e,
      x: e.x - s.x,
      y: e.y - s.y
    };
  }
  return Te(n);
}
function Ge(t, e) {
  const o = U(t);
  return o === e || !G(o) || ee(o) ? !1 : L(o).position === "fixed" || Ge(o, e);
}
function It(t, e) {
  const o = e.get(t);
  if (o)
    return o;
  let n = ae(t, [], !1).filter((a) => G(a) && B(a) !== "body"), s = null;
  const r = L(t).position === "fixed";
  let i = r ? U(t) : t;
  for (; G(i) && !ee(i); ) {
    const a = L(i), l = re(i);
    !l && a.position === "fixed" && (s = null), (r ? !l && !s : !l && a.position === "static" && !!s && ["absolute", "fixed"].includes(s.position) || K(i) && !l && Ge(t, i)) ? n = n.filter((g) => g !== i) : s = a, i = U(i);
  }
  return e.set(t, n), n;
}
function At(t) {
  let {
    element: e,
    boundary: o,
    rootBoundary: n,
    strategy: s
  } = t;
  const i = [...o === "clippingAncestors" ? It(e, this._c) : [].concat(o), n], a = i[0], l = i.reduce((c, g) => {
    const f = Ce(e, g, s);
    return c.top = H(f.top, c.top), c.right = we(f.right, c.right), c.bottom = we(f.bottom, c.bottom), c.left = H(f.left, c.left), c;
  }, Ce(e, a, s));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function kt(t) {
  return Pe(t);
}
function Gt(t, e, o) {
  const n = I(e), s = z(e), r = o === "fixed", i = W(t, !0, r, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = F(0);
  if (n || !n && !r)
    if ((B(e) !== "body" || K(s)) && (a = te(e)), n) {
      const c = W(e, !0, r, e);
      l.x = c.x + e.clientLeft, l.y = c.y + e.clientTop;
    } else
      s && (l.x = ke(s));
  return {
    x: i.left + a.scrollLeft - l.x,
    y: i.top + a.scrollTop - l.y,
    width: i.width,
    height: i.height
  };
}
function be(t, e) {
  return !I(t) || L(t).position === "fixed" ? null : e ? e(t) : t.offsetParent;
}
function Oe(t, e) {
  const o = T(t);
  if (!I(t))
    return o;
  let n = be(t, e);
  for (; n && xt(n) && L(n).position === "static"; )
    n = be(n, e);
  return n && (B(n) === "html" || B(n) === "body" && L(n).position === "static" && !re(n)) ? o : n || Et(t) || o;
}
const Ot = async function(t) {
  let {
    reference: e,
    floating: o,
    strategy: n
  } = t;
  const s = this.getOffsetParent || Oe, r = this.getDimensions;
  return {
    reference: Gt(e, await s(o), n),
    floating: {
      x: 0,
      y: 0,
      ...await r(o)
    }
  };
};
function Ft(t) {
  return L(t).direction === "rtl";
}
const Bt = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Dt,
  getDocumentElement: z,
  getClippingRect: At,
  getOffsetParent: Oe,
  getElementRects: Ot,
  getClientRects: Tt,
  getDimensions: kt,
  getScale: _,
  isElement: G,
  isRTL: Ft
}, zt = (t, e, o) => {
  const n = /* @__PURE__ */ new Map(), s = {
    platform: Bt,
    ...o
  }, r = {
    ...s.platform,
    _c: n
  };
  return bt(t, e, {
    ...s,
    platform: r
  });
};
var Mt = Object.defineProperty, Vt = (t, e, o) => e in t ? Mt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: o }) : t[e] = o, X = (t, e, o) => (Vt(t, typeof e != "symbol" ? e + "" : e, o), o);
class _t {
  constructor() {
    X(this, "component", "IBizNumberGridControl");
  }
}
function Ut(t) {
  const e = J(), o = J([]), n = t, s = M(() => t.state.items.map((d) => (d.hasChildren = t.state.items.some(
    (h) => d[n.treeGridValueField] && d[n.treeGridValueField] === h[n.treeGridParentField]
  ), d.children = [], d))), r = M(() => {
    const d = t.state.items.map(
      (h) => h[n.treeGridValueField]
    );
    return s.value.filter(
      (h) => !h[n.treeGridParentField] || !d.includes(h[n.treeGridParentField])
    );
  });
  async function i(d, h, w) {
    if (!(t.model.enableGroup && d.isGroupData) && d.srfuf !== V.CREATE)
      if (t.editShowMode === "row" && t.model.enableRowEdit) {
        const b = t.findRowState(d);
        b && b.showRowEdit !== !0 && await t.switchRowEdit(b, !0);
      } else
        t.onRowClick(d);
  }
  function a(d) {
    t.model.enableGroup && d.isGroupData || d.srfuf !== V.CREATE && t.onDbRowClick(d);
  }
  function l(d) {
    return !!o.value.find(
      (h) => d.tempsrfkey === h.tempsrfkey
    );
  }
  function c() {
    return t.model.enableGroup ? o.value.filter((d) => !d.isGroupData) : [...o.value];
  }
  Q(
    [
      () => e.value,
      () => t.state.isLoaded,
      () => t.state.selectedData
    ],
    ([d, h, w]) => {
      !h || !d || (ht(w, c()) || (o.value = w), t.state.singleSelect && (w[0] ? e.value.setCurrentRow(w[0], !0) : e.value.setCurrentRow()));
    }
  );
  function g(d) {
    const { prop: h, order: w } = d, b = t.fieldColumns[h].model.appDEFieldId;
    let E;
    w === "ascending" ? E = "asc" : w === "descending" && (E = "desc"), "".concat(b, ",").concat(E) !== t.state.sortQuery && (t.setSort(b, E), t.load());
  }
  function f({ row: d }) {
    let h = "";
    return o.value.some(
      (w) => w.tempsrfkey === d.tempsrfkey
    ) && (h = "current-row"), d.srfuf === V.CREATE && (h += " is-create-row"), d.srfkey && (h += " id-".concat(d.srfkey)), h;
  }
  function p({
    _row: d,
    column: h,
    _rowIndex: w,
    _columnIndex: b
  }) {
    var E;
    const P = (E = t.model.degridColumns) == null ? void 0 : E.find((A) => A.codeName === h.property);
    return P && P.headerSysCss && P.headerSysCss.cssName ? P.headerSysCss.cssName : "";
  }
  return Q(
    () => t.state.sortQuery,
    (d) => {
      if (d) {
        const h = t.state.sortQuery.split(",")[0], w = t.state.sortQuery.split(",")[1];
        if (h && w) {
          const b = w === "desc" ? "descending" : "ascending", E = () => {
            e.value ? Y(() => {
              e.value.sort(h, b);
            }) : setTimeout(E, 500);
          };
          E();
        }
      }
    }
  ), {
    tableRef: e,
    treeGirdData: r,
    treeNodeData: s,
    curSelectedData: o,
    getSelection: c,
    onRowClick: i,
    onDbRowClick: a,
    isSelected: l,
    onSortChange: g,
    handleRowClassName: f,
    handleHeaderCellClassName: p
  };
}
function jt(t, e) {
  const { controlParam: o } = e.modelData, n = () => {
    e.data && (t.state.items = e.data, t.state.rows = e.data.map((a) => new xe(new st(a), t)));
  }, s = M(() => {
    var a;
    const l = Object.values(t.fieldColumns).find(
      (c) => c.model.appDEFieldId === t.model.minorSortAppDEFieldId
    );
    return {
      prop: l == null ? void 0 : l.model.codeName,
      order: ((a = t.model.minorSortDir) == null ? void 0 : a.toLowerCase()) === "desc" ? "descending" : "ascending"
    };
  });
  t.evt.on("onCreated", async () => {
    e.isSimple && (n(), t.state.isLoaded = !0);
  }), Q(
    () => e.data,
    () => {
      e.isSimple && n();
    },
    {
      deep: !0
    }
  );
  const r = M(() => {
    const { state: a } = t;
    let l = {
      appId: t.context.srfappid,
      cssClass: "cube-outline"
    };
    if (o && o.ctrlParams && o.ctrlParams.GROUPICON && (l.cssClass = o.ctrlParams.GROUPICON), t.model.enableGroup) {
      const c = [];
      return a.groups.forEach((g) => {
        if (!g.children.length)
          return;
        g.groupIcon && (l = g.groupIcon);
        const f = [...g.children], p = Re();
        c.push({
          tempsrfkey: p,
          srfkey: p,
          isGroupData: !0,
          caption: g.caption,
          children: f,
          groupIcon: l
        });
      }), c;
    }
    return a.rows.map((c) => c.data);
  }), i = M(() => {
    if (t.isMultistageHeader)
      return t.model.degridColumns || [];
    const a = [];
    return t.state.columnStates.forEach((l) => {
      var c, g;
      if (l.hidden)
        return;
      const f = ((c = t.fieldColumns[l.key]) == null ? void 0 : c.model) || ((g = t.uaColumns[l.key]) == null ? void 0 : g.model);
      f && a.push(f);
    }), a;
  });
  return {
    tableData: r,
    renderColumns: i,
    defaultSort: s,
    summaryMethod: ({
      columns: a
    }) => a.map((l, c) => c === 0 ? t.aggTitle : t.state.aggResult[l.property]),
    headerDragend: (a, l, c) => {
      const { property: g } = c, f = t.columns[g], p = t.state.columnStates.find((d) => d.key === g);
      if (f.isAdaptiveColumn) {
        p && (p.adaptive = !1), f.isAdaptiveColumn = !1, f.model.width = a;
        const d = i.value.findIndex((h) => t.columns[h.codeName].isAdaptiveColumn);
        t.hasAdaptiveColumn = d !== -1;
      }
      p && (p.columnWidth = a, t.saveColumnStates());
    }
  };
}
function Ht(t) {
  function e(s) {
    !s || s === t.state.curPage || (t.state.curPage = s, t.load());
  }
  function o(s) {
    !s || s === t.state.size || (t.state.size = s, t.state.curPage === 1 && t.load());
  }
  function n() {
    t.load();
  }
  return { onPageChange: e, onPageSizeChange: o, onPageRefresh: n };
}
function Qt(t, e) {
  let o;
  const n = J(!1), s = J(), r = ct({}), i = (f) => {
    if (!t.value)
      throw new j("找不到表格组件引用");
    const p = t.value.$el;
    let d = ".editing-row";
    f.data.srfkey && (d += ".id-".concat(f.data.srfkey));
    const h = p.querySelector(d);
    if (!h)
      throw new j("找不到对应的表格行dom元素");
    return h;
  }, a = async (f) => {
    const p = i(f);
    if (!o)
      throw new j("拿不到pop组件的实例");
    const d = o.$el, {
      x: h,
      y: w
    } = await zt(p, d, {
      placement: "bottom"
    });
    Object.assign(r, {
      top: "".concat(w, "px"),
      left: "".concat(h, "px")
    }), s.value = f, n.value = !0;
  }, l = async () => {
    s.value && e.switchRowEdit(s.value, !1, !0);
  }, c = async () => {
    s.value && e.switchRowEdit(s.value, !1, !1);
  }, g = () => {
    const f = n.value && e.state.rows[e.state.rows.length - 1].showRowEdit;
    return [C("div", {
      class: "row-edit-popover__placeholder",
      style: {
        display: f ? "block" : "none"
      }
    }, null), C(S("iBizRowEditPopover"), {
      ref: (p) => {
        o = p;
      },
      style: r,
      show: n.value,
      onConfirm: l,
      onCancel: c
    }, null)];
  };
  return e.evt.on("onRowEditChange", (f) => {
    f.row.showRowEdit ? setTimeout(() => {
      a(f.row);
    }, 0) : (s.value = void 0, n.value = !1, Object.assign(r, {
      top: void 0,
      left: void 0
    }));
  }), {
    renderPopover: g
  };
}
class Wt extends tt {
  constructor() {
    super(...arguments), X(this, "defaultExpandAll", !1), X(this, "expandColumnIndex");
  }
  get overflowMode() {
    return "ellipsis";
  }
  initState() {
    super.initState(), this.state.tableKey = "";
    const e = "SHOW_MODE_".concat(this.context.project, "_").concat(this.view.model.codeName), o = localStorage.getItem(e);
    o === "tree" ? this.state.showTreeGrid = !0 : o === "grid" && (this.state.showTreeGrid = !1);
  }
  /**
   * 设置排序
   */
  setSort(e, o) {
    if (!e && !o)
      return;
    let n;
    e && (n = this.fieldIdNameMap.get(e).toLowerCase()), n && o ? this.state.sortQuery = "".concat(n, ",").concat(o) : this.state.sortQuery = "", this.setSortCache();
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
    const { curPage: o, size: n, sortQuery: s, noSort: r } = this.state, i = {
      ...this.params
    };
    if (n && (i.page = o - 1, i.size = n), !r)
      if (s)
        i.sort = s;
      else {
        const { minorSortAppDEFieldId: a, minorSortDir: l } = this.getSortModel();
        if (this.view && localStorage.getItem("".concat(this.view.model.id, ".").concat(this.model.name, ".sort")))
          this.state.sortQuery = localStorage.getItem(
            "".concat(this.view.model.id, ".").concat(this.model.name, ".sort")
          );
        else if (a && l) {
          const c = this.fieldIdNameMap.get(a);
          this.state.sortQuery = "".concat(c.toLowerCase(), ",").concat(l.toLowerCase());
        }
        i.sort = this.state.sortQuery, this.setSortCache();
      }
    return await this._evt.emit("onBeforeLoad", { params: {} }), Object.assign(i, {
      ...this.state.searchParams
    }), e && Object.assign(i, e), i;
  }
  /**
   * 切换显示模式
   *
   * @param {IData} param
   * @memberof NumberTreeGridController
   */
  async switchShowMode(e) {
    const { showMode: o } = e;
    o && (o === "tree" ? this.state.showTreeGrid = !0 : o === "grid" && (this.state.showTreeGrid = !1), await this.load());
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
    const o = e.silent === !0;
    o || await this.startLoading();
    try {
      const n = e.isInitialLoad === !0, s = e.isLoadMore === !0;
      n ? this.state.curPage = 1 : s && (this.state.curPage += 1);
      const { context: r } = this.handlerAbilityParams(e), i = await this.getFetchParams(e == null ? void 0 : e.viewParam);
      i != null && i.hasOwnProperty("srfshowmode") || this.state.showTreeGrid && Object.assign(i, {
        srfshowmode: "tree"
      });
      const a = await this.service.fetch(r, i);
      typeof a.total == "number" && (this.state.total = a.total), typeof a.totalPages == "number" && (this.state.totalPages = a.totalPages), s ? this.state.items.push(...a.data) : this.state.items = a.data, await this.afterLoad(e, a.data), this.state.isLoaded = !0, await this.evt.emit("onLoadSuccess", {
        isInitialLoad: n
      });
    } catch (n) {
      throw await this.evt.emit("onLoadError", void 0), this.actionNotification("FETCHERROR", {
        error: n
      }), n;
    } finally {
      o || await this.endLoading();
    }
    return this.state.items.forEach((n, s) => {
      n.srfserialnum = s + 1;
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
  async afterLoad(e, o) {
    return await super.afterLoad(e, o), e.isInitialLoad === !0 && (this.state.tableKey = Re()), o;
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
    const o = e.srfuf === V.CREATE, n = this.findRowState(e);
    if (!n)
      throw new j("行数据不存在");
    if (!n.modified) {
      ibiz.log.debug("值没有发生改变");
      return;
    }
    if (n.processing) {
      await ft(500, this.save.bind(this), [e]);
      return;
    }
    if (!await this.validate(n))
      throw new j("行数据校验不通过，保存取消");
    let s;
    const r = ot(this.model.appDataEntityId), i = this.context.clone();
    i[r] = e.srfkey;
    try {
      s = o ? await this.service.create(i, e) : await this.service.update(i, e);
    } catch (l) {
      throw o && await this.remove({ data: [e], silent: !0 }), await this.evt.emit("onSaveError", void 0), this.actionNotification("".concat(o ? "CREATE" : "UPDATE", "ERROR"), {
        error: l,
        data: n.data
      }), l;
    }
    const a = this.findRowStateIndex(e);
    this.state.items.splice(a, 1, s.data), n.data = s.data, n.oldData = s.data.clone(), n.modified = !1, o && this.evt.emit("onReloadParentNode", { node: s.data }), this.gridStateNotify(n, pe.SAVE), await this.updateRows(this.state.rows), await this.evt.emit("onSaveSuccess", void 0);
  }
  afterRemove(e) {
    const o = this.state.items.findIndex(
      (s) => s.srfkey === e.srfkey
    );
    o !== -1 && this.state.items.splice(o, 1);
    const n = this.findRowStateIndex(e);
    this.state.rows.splice(n, 1), this.state.groups.forEach((s) => {
      if (s.children.length) {
        const r = s.children.findIndex(
          (i) => i.srfkey === e.srfkey
        );
        r !== -1 && s.children.splice(r, 1);
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
      (c) => c.data.srfuf === V.CREATE
    ))
      return;
    const { data: o } = e;
    let n = {};
    o && (n = Array.isArray(o) ? o[0] : o);
    const s = { ...this.params }, r = this.calcDefaultValue(n || {}, !0);
    n.srfDefaultData && Object.assign(r, n.srfDefaultData), Object.assign(s, r);
    let i;
    try {
      i = await this.service.getDraft(this.context, s);
    } catch (c) {
      throw this.actionNotification("GETDRAFTERROR", {
        error: c
      }), c;
    }
    const a = i.data;
    mt(a, r), a[this.treeGridParentField] = n[this.treeGridValueField], n.srfUserData && (a.srfUserData = n.srfUserData), this.state.items.push(a);
    const l = new xe(a, this);
    this.state.rows.push(l), this.gridStateNotify(l, pe.DRAFT), this.evt.emit("onReloadParentNode", { node: a }), this.actionNotification("GETDRAFTSUCCESS", { data: a });
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
class Xt extends nt {
  constructor() {
    super(...arguments), X(this, "codeListItems"), X(this, "defaultExpandAll", !1);
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
  setSort(e, o) {
    if (!e && !o)
      return;
    let n;
    e && (n = this.fieldIdNameMap.get(e).toLowerCase()), n && o ? this.state.sortQuery = "".concat(n, ",").concat(o) : this.state.sortQuery = "", this.setSortCache();
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
    const { curPage: o, size: n, sortQuery: s, noSort: r } = this.state, i = {
      ...this.params
    };
    if (n && (i.page = o - 1, i.size = n), !r)
      if (s)
        i.sort = s;
      else {
        const { minorSortAppDEFieldId: a, minorSortDir: l } = this.getSortModel();
        if (this.view && localStorage.getItem("".concat(this.view.model.id, ".").concat(this.model.name, ".sort")))
          this.state.sortQuery = localStorage.getItem(
            "".concat(this.view.model.id, ".").concat(this.model.name, ".sort")
          );
        else if (a && l) {
          const c = this.fieldIdNameMap.get(a);
          this.state.sortQuery = "".concat(c.toLowerCase(), ",").concat(l.toLowerCase());
        }
        i.sort = this.state.sortQuery, this.setSortCache();
      }
    return await this._evt.emit("onBeforeLoad", { params: {} }), Object.assign(i, {
      ...this.state.searchParams
    }), e && Object.assign(i, e), i;
  }
  /**
   * 初始化表格分组
   *
   * @protected
   * @return {*}  {Promise<void>}
   * @memberof NumberGridController
   */
  async initGroup() {
    const { groupCodeListId: e, groupMode: o, enableGroup: n } = this.model;
    if (n && o === "CODELIST") {
      if (!e)
        throw new pt(
          this.model,
          "代码表分组模式需要配置代码表"
        );
      const s = ibiz.hub.getApp(this.context.srfappid);
      this.codeListItems = await s.codeList.get(
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
    const { enableGroup: o, groupMode: n, groupAppDEFieldId: s } = this.model;
    if (o && s) {
      const r = /* @__PURE__ */ new Map(), i = n === "CODELIST", a = s.toLowerCase();
      i && this.codeListItems.forEach((l) => {
        r.set(l.value, []);
      }), e.forEach((l) => {
        const c = l[a];
        !i && !r.has(c) && r.set(c, []), r.has(c) && r.get(c).push(l);
      }), this.state.groups = [], r.forEach((l, c) => {
        var g;
        const f = (g = this.codeListItems) == null ? void 0 : g.find(
          (p) => p.value === c
        );
        this.state.groups.push({
          caption: (f == null ? void 0 : f.text) || "".concat(c || "其他"),
          groupIcon: f == null ? void 0 : f.sysImage,
          key: c,
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
function Kt(t, e) {
  var o;
  const n = {};
  return (o = t.controlAttributes) == null || o.forEach((s) => {
    s.attrName && s.attrValue && (n[s.attrName] = it.execSingleLine(s.attrValue, {
      ...e
    }));
  }), n;
}
function $t(t, e, o, n) {
  var s;
  const {
    codeName: r
  } = e, i = t.columns[r], a = t.state.columnStates.find((h) => h.key === r), l = o.find((h) => t.columns[h.codeName].isAdaptiveColumn), c = i.isAdaptiveColumn || !l && n === o.length - 1 ? "min-width" : "width";
  let g = "default";
  t != null && t.expandColumnIndex && n < ut(t == null ? void 0 : t.expandColumnIndex) && (g = "");
  let {
    width: f
  } = e;
  const {
    hideHeader: p
  } = t.model;
  t.model.enableCustomized && !p && f && n === o.length - 1 && (f += 20);
  const d = (a == null ? void 0 : a.columnWidth) || f;
  return C(S("el-table-column"), Ee({
    label: e.caption,
    prop: r
  }, {
    [c]: d
  }, {
    fixed: a.fixed,
    sortable: e.enableSort ? "custom" : !1,
    align: ((s = e.align) == null ? void 0 : s.toLowerCase()) || "center",
    type: g
  }), {
    default: ({
      row: h
    }) => {
      const w = h;
      if (h.isGroupData)
        return n !== 0 ? null : C("div", {
          class: "group-column"
        }, [C(S("iBizIcon"), {
          class: "group-icon",
          icon: h.groupIcon
        }, null), h.caption]);
      const b = t.findRowState(w);
      if (b) {
        const E = S(t.providers[r].component);
        return dt(E, {
          controller: i,
          row: b,
          key: w.tempsrfkey + r,
          attrs: Kt(e, {
            ...t.getEventArgs(),
            data: b.data
          })
        });
      }
      return C("div", null, null);
    }
  });
}
function Fe(t, e, o, n) {
  var s, r;
  if (e.columnType === "GROUPGRIDCOLUMN") {
    const i = ((s = e.degridColumns) == null ? void 0 : s.filter((c) => !c.hideDefault)) || [], {
      width: a
    } = e, l = ((r = e.align) == null ? void 0 : r.toLowerCase()) || "center";
    return C(S("el-table-column"), {
      prop: e.codeName,
      label: e.caption,
      "min-width": a,
      align: l
    }, {
      default: () => i.map((c, g) => Fe(t, c, o, g))
    });
  }
  return $t(t, e, o, n);
}
const ie = /* @__PURE__ */ at({
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
    let e;
    t.modelData.controlType === "TREEGRID" ? e = me((...u) => new Wt(...u)) : e = me((...u) => new Xt(...u));
    const o = e, {
      zIndex: n
    } = Ze();
    e.state.zIndex = n.increment();
    const s = se("control-grid"), r = M(() => {
      if (t.modelData.controlType === "TREEGRID")
        return se("control-".concat(e.model.controlType.toLowerCase()));
    }), i = se("number-grid"), {
      tableData: a,
      renderColumns: l,
      defaultSort: c,
      summaryMethod: g,
      headerDragend: f
    } = jt(e, t), {
      tableRef: p,
      treeGirdData: d,
      treeNodeData: h,
      curSelectedData: w,
      onRowClick: b,
      onDbRowClick: E,
      onSortChange: P,
      isSelected: A,
      getSelection: $,
      handleRowClassName: k,
      handleHeaderCellClassName: Be
    } = Ut(e), {
      onPageChange: ze,
      onPageRefresh: Me,
      onPageSizeChange: Ve
    } = Ht(e), oe = M(() => t.modelData.controlType === "TREEGRID" ? o.state.showTreeGrid : !1), ce = (u = 0) => {
      setTimeout(() => {
        if (p.value) {
          const m = p.value.$el.getElementsByClassName("el-table__row");
          let y = 0;
          m.forEach((v) => {
            const R = v.firstChild.getElementsByClassName("ibiz-number-grid__number--caption")[0];
            v.style.display !== "none" && R && (R.innerText = "".concat((e.state.curPage - 1) * e.state.size + (y + 1)), y++);
          });
        }
      }, u);
    }, _e = (u, m) => {
      e.expandChange(u, m), ce();
    }, de = (u) => {
      const m = u.target, y = e.state.rows.find((v) => v.data.srfuf === V.CREATE);
      y && !m.closest(".is-create-row.el-table__row") && e.remove({
        data: [y.data],
        silent: !0
      });
    };
    rt(() => {
      const {
        controlType: u,
        enableGroup: m
      } = e.model;
      e.evt.on("onLoadSuccess", () => {
        (u === "TREEGRID" || u === "GRID" && m) && ce();
      }), document.addEventListener("click", de, !0);
    }), Q(() => oe.value, (u, m) => {
      u !== m && (w.value = [], e.setSelection([]));
    });
    const Ue = () => {
      const u = [...d.value], m = (y) => {
        const v = e.state.items.filter((R) => R[o.treeGridParentField] && y[o.treeGridValueField] === R[o.treeGridParentField]);
        v.length > 0 && (u.push(...v), v.forEach((R) => {
          m(R);
        }));
      };
      return d.value.forEach((y) => {
        m(y);
      }), u;
    }, ue = () => {
      let u = [];
      return oe.value ? u = Ue() : (u = [...a.value], e.model.enableGroup && a.value.forEach((m) => {
        u.push(...m.children);
      })), u;
    }, ne = () => {
      const u = ue();
      let m = !1;
      return u.length > 0 && (m = u.filter((y) => !A(y)).length === 0), m;
    }, je = () => {
      const u = ue(), m = w.value.filter((y) => !u.find((v) => v.tempsrfkey === y.tempsrfkey));
      ne() || m.push(...u), w.value = m, e.setSelection($());
    }, He = (u, m) => {
      const {
        controlType: y,
        enableGroup: v
      } = e.model, R = u.findIndex((x) => x.tempsrfkey === m.tempsrfkey);
      R !== -1 ? (u.splice(R, 1), y === "GRID" && v && (ge(m.children) ? m.children.forEach((x) => {
        const D = u.indexOf(x);
        D !== -1 && u.splice(D, 1);
      }) : a.value.forEach((x) => {
        const D = x.children.find((N) => !u.includes(N)), O = u.findIndex((N) => N.tempsrfkey === x.tempsrfkey);
        D && O !== -1 && u.splice(O, 1);
      }))) : (u.push(m), y === "GRID" && v && (ge(m.children) ? m.children.forEach((x) => {
        u.indexOf(x) === -1 && u.push(x);
      }) : a.value.forEach((x) => {
        const D = x.children.find((N) => !u.includes(N)), O = u.findIndex((N) => N.tempsrfkey === x.tempsrfkey);
        !D && O === -1 && u.unshift(x);
      })));
    }, he = (u) => {
      He(w.value, u), e.setSelection($());
    }, Qe = (u, m) => {
      u.stopPropagation(), he(m);
    }, We = () => {
      const {
        expandRowKeys: u,
        selectedData: m,
        singleSelect: y
      } = e.state, v = p.value;
      if (!v || !m.length)
        return;
      const R = v.store.states.treeData.value, x = Object.keys(R).filter((D) => R[D].loaded);
      if (u.length === x.length && u.sort().every((D, O) => D === x.sort()[O])) {
        const D = [], O = m.map((N) => N.srfkey);
        gt({
          children: v.store.states.data.value
        }, (N) => {
          O.includes(N.srfkey) && D.push(N);
        }), Y(() => {
          y ? v.setCurrentRow(D[0]) : v.store.states.selection.value = D;
        });
      }
    }, fe = (u) => {
      !p.value || !e.state.expandRowKeys.length || (e.state.expandRowKeys.forEach((m) => {
        const y = u.find((v) => v.srfkey === m);
        y && Y(() => {
          p.value.store.loadOrToggle(y);
        });
      }), We());
    };
    Q(() => p.value, () => {
      e.model.controlType === "TREEGRID" && fe(d.value);
    });
    const Xe = (u, m, y) => {
      const v = h.value.filter((R) => u[o.treeGridValueField] === R[o.treeGridParentField]);
      u.children = v, y(v), fe(v);
    };
    o.evt.on("onReloadParentNode", (u) => {
      const {
        node: m
      } = u, y = h.value.find((v) => m[o.treeGridParentField] && v[o.treeGridValueField] === m[o.treeGridParentField]);
      if (y)
        if (y.hasChildren) {
          const v = p.value.store.states.treeData.value[y.tempsrfkey];
          v && (v.loaded = !1), Y(() => {
            p.value.store.loadOrToggle(y);
          });
        } else {
          p.value.toggleRowExpansion(y, !1);
          const v = p.value.store.states.lazyTreeNodeMap.value;
          delete v[y.tempsrfkey];
        }
    });
    const Ke = () => {
      var u;
      const {
        isLoaded: m
      } = e.state;
      if (m) {
        const y = (u = e.model.controls) == null ? void 0 : u.find((v) => v.name === "".concat(e.model.name, "_quicktoolbar"));
        return y ? C(S("iBizToolbarControl"), {
          modelData: y,
          context: e.context,
          params: e.params,
          class: s.b("quick-toolbar")
        }, null) : C(S("iBizNoData"), {
          text: e.model.emptyText,
          emptyTextLanguageRes: e.model.emptyTextLanguageRes
        }, null);
      }
      return null;
    }, {
      renderPopover: $e
    } = Qt(p, e), qe = () => {
      var u;
      const m = (u = e.model.controls) == null ? void 0 : u.find((y) => y.name === "".concat(e.model.name, "_batchtoolbar"));
      if (!(!m || e.state.singleSelect))
        return C("div", {
          class: [s.b("batch-toolbar"), i.b("batch-toolbar"), s.is("show", e.showBatchToolbar)]
        }, [C("div", {
          class: s.b("batch-toolbar-content")
        }, [C("div", {
          class: s.b("batch-toolbar-text")
        }, [q("已选中"), e.state.selectedData.length, q("项")]), C("div", {
          class: s.b("batch-toolbar-separator")
        }, [q("|")]), C(S("iBizToolbarControl"), {
          modelData: m,
          context: e.context,
          params: e.params,
          class: s.b("batch-toolbar-items")
        }, null)])]);
    }, Ye = () => {
      const u = l.value.length ? "width" : "min-width";
      return C(S("el-table-column"), Ee({
        "class-name": i.e("first-column")
      }, {
        [u]: 80
      }, {
        align: "center",
        fixed: "left",
        type: "index"
      }), {
        header: () => C("div", {
          class: i.e("number")
        }, [e.state.singleSelect ? C("span", null, [q("序号")]) : C(S("el-checkbox"), {
          size: "large",
          indeterminate: e.state.selectedData.length > 0 && !ne(),
          modelValue: ne(),
          onChange: () => je()
        }, null)]),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        default: ({
          row: m,
          column: y,
          $index: v
        }) => {
          const R = (e.state.curPage - 1) * e.state.size + (v + 1);
          return C("div", {
            class: [i.e("number"), i.is("multiple", !e.state.singleSelect), i.is("single", e.state.singleSelect)],
            onClick: (x) => Qe(x, m)
          }, [C("span", {
            class: i.em("number", "caption")
          }, [R]), !e.state.singleSelect && C(S("el-checkbox"), {
            size: "large",
            onClick: (x) => x.stopPropagation(),
            class: i.em("number", "checkbox"),
            modelValue: A(m),
            onChange: () => he(m)
          }, null)]);
        }
      });
    };
    return lt(() => {
      n.decrement(), document.removeEventListener("click", de, !0);
    }), {
      c: e,
      ns: s,
      ns2: r,
      ns3: i,
      tableRef: p,
      tableData: a,
      treeGirdData: d,
      showTreeGrid: oe,
      renderColumns: l,
      defaultSort: c,
      loadData: Xe,
      onDbRowClick: E,
      onRowClick: b,
      onExpandChange: _e,
      onSortChange: P,
      onPageChange: ze,
      onPageSizeChange: Ve,
      onPageRefresh: Me,
      handleRowClassName: k,
      handleHeaderCellClassName: Be,
      renderNoData: Ke,
      summaryMethod: g,
      headerDragend: f,
      renderPopover: $e,
      renderBatchToolBar: qe,
      renderFirstColumn: Ye
    };
  },
  render() {
    if (!this.c.state.isCreated)
      return;
    const {
      state: t
    } = this.c, {
      hideHeader: e,
      enablePagingBar: o
    } = this.c.model;
    return C(S("iBizControlNavigation"), {
      controller: this.c
    }, {
      default: () => {
        var n;
        return [C(S("iBizControlBase"), {
          class: [this.ns.b(), (n = this.ns2) == null ? void 0 : n.b(), this.ns3.b(), this.ns.is("show-header", !e), this.ns.is("enable-page", o), this.ns.is("enable-group", this.c.model.enableGroup), this.ns.is("single-select", t.singleSelect), this.ns.is("enable-customized", this.c.model.enableCustomized)],
          controller: this.c
        }, {
          default: () => [C(S("el-table"), {
            border: !0,
            ref: "tableRef",
            "row-key": "tempsrfkey",
            class: this.ns.e("table"),
            key: t.tableKey,
            "tooltip-effect": "light",
            "show-header": !e,
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
            default: () => [this.renderFirstColumn(), this.renderColumns.map((s, r) => Fe(this.c, s, this.renderColumns, r))],
            append: () => this.renderPopover()
          }), o && C(S("iBizPagination"), {
            total: t.total,
            curPage: t.curPage,
            size: t.size,
            totalPages: t.totalPages,
            onChange: this.onPageChange,
            onPageSizeChange: this.onPageSizeChange,
            onPageRefresh: this.onPageRefresh
          }, null), this.c.model.enableCustomized && !e && C("div", {
            class: [this.ns.b("setting-box"), this.ns3.b("setting-box")]
          }, [C(S("iBizGridSetting"), {
            columnStates: t.columnStates,
            controller: this.c
          }, null)]), this.renderBatchToolBar()]
        })];
      }
    });
  }
}), qt = Je(
  ie,
  (t) => {
    t.component(ie.name, ie), et(
      "GRID_RENDER_NUMBER_GRID",
      () => new _t()
    );
  }
), no = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(t) {
    t.use(qt);
  }
};
export {
  qt as IBizNumberGridControl,
  no as default
};
