import { h } from 'vue';

// Embedded floating-position implementation from the upstream bundle.
// Kept isolated to preserve its positioning behavior without adding dependencies.

function rt(t) {
  return t.split('-')[0];
}

function Ot(t) {
  return t.split('-')[1];
}

function Gt(t) {
  return t === 'x' ? 'y' : 'x';
}

function Mt(t) {
  return t === 'y' ? 'height' : 'width';
}

function lt(t) {
  return ['top', 'bottom'].includes(rt(t)) ? 'y' : 'x';
}

function zt(t) {
  return Gt(lt(t));
}

function at(t) {
  const { x: e, y: n, width: o, height: i } = t;
  return {
    width: o,
    height: i,
    top: n,
    left: e,
    right: e + o,
    bottom: n + i,
    x: e,
    y: n,
  };
}

function et(t, e, n) {
  let { reference: o, floating: i } = t;
  const c = lt(e),
    s = zt(e),
    l = Mt(s),
    a = rt(e),
    r = c === 'y',
    d = o.x + o.width / 2 - i.width / 2,
    u = o.y + o.height / 2 - i.height / 2,
    h = o[l] / 2 - i[l] / 2;
  let f;
  switch (a) {
    case 'top':
      f = {
        x: d,
        y: o.y - i.height,
      };
      break;
    case 'bottom':
      f = {
        x: d,
        y: o.y + o.height,
      };
      break;
    case 'right':
      f = {
        x: o.x + o.width,
        y: u,
      };
      break;
    case 'left':
      f = {
        x: o.x - i.width,
        y: u,
      };
      break;
    default:
      f = {
        x: o.x,
        y: o.y,
      };
  }
  switch (Ot(e)) {
    case 'start':
      f[s] -= h * (n && r ? -1 : 1);
      break;
    case 'end':
      f[s] += h * (n && r ? -1 : 1);
      break;
  }
  return f;
}

const _t = async (t, e, n) => {
  const {
      placement: o = 'bottom',
      strategy: i = 'absolute',
      middleware: c = [],
      platform: s,
    } = n,
    l = c.filter(Boolean),
    a = await (s.isRTL == null ? void 0 : s.isRTL(e));
  let r = await s.getElementRects({
      reference: t,
      floating: e,
      strategy: i,
    }),
    { x: d, y: u } = et(r, o, a),
    h = o,
    f = {},
    p = 0;
  for (let m = 0; m < l.length; m++) {
    const { name: R, fn: D } = l[m],
      {
        x: E,
        y: T,
        data: O,
        reset: w,
      } = await D({
        x: d,
        y: u,
        initialPlacement: o,
        placement: h,
        strategy: i,
        middlewareData: f,
        rects: r,
        platform: s,
        elements: {
          reference: t,
          floating: e,
        },
      });
    (d = E != null ? E : d),
      (u = T != null ? T : u),
      (f = {
        ...f,
        [R]: {
          ...f[R],
          ...O,
        },
      }),
      w &&
        p <= 50 &&
        (p++,
        typeof w == 'object' &&
          (w.placement && (h = w.placement),
          w.rects &&
            (r =
              w.rects === true
                ? await s.getElementRects({
                    reference: t,
                    floating: e,
                    strategy: i,
                  })
                : w.rects),
          ({ x: d, y: u } = et(r, h, a))),
        (m = -1));
  }
  return {
    x: d,
    y: u,
    placement: h,
    strategy: i,
    middlewareData: f,
  };
};

const nt = Math.min;

const M = Math.max;

const H = Math.round;

const N = t => ({
  x: t,
  y: t,
});

function A(t) {
  return ct(t) ? (t.nodeName || '').toLowerCase() : '#document';
}

function C(t) {
  var e;
  return (
    (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) ||
    window
  );
}

function L(t) {
  var e;
  return (e = (ct(t) ? t.ownerDocument : t.document) || window.document) == null
    ? void 0
    : e.documentElement;
}

function ct(t) {
  return t instanceof Node || t instanceof C(t).Node;
}

function S(t) {
  return t instanceof Element || t instanceof C(t).Element;
}

function v(t) {
  return t instanceof HTMLElement || t instanceof C(t).HTMLElement;
}

function ot(t) {
  return typeof ShadowRoot > 'u'
    ? false
    : t instanceof ShadowRoot || t instanceof C(t).ShadowRoot;
}

function _(t) {
  const { overflow: e, overflowX: n, overflowY: o, display: i } = x(t);
  return (
    /auto|scroll|overlay|hidden|clip/.test(e + o + n) &&
    !['inline', 'contents'].includes(i)
  );
}

function Ft(t) {
  return ['table', 'td', 'th'].includes(A(t));
}

function K(t) {
  const e = J(),
    n = x(t);
  return (
    n.transform !== 'none' ||
    n.perspective !== 'none' ||
    (n.containerType ? n.containerType !== 'normal' : false) ||
    (!e && (n.backdropFilter ? n.backdropFilter !== 'none' : false)) ||
    (!e && (n.filter ? n.filter !== 'none' : false)) ||
    ['transform', 'perspective', 'filter'].some(o =>
      (n.willChange || '').includes(o),
    ) ||
    ['paint', 'layout', 'strict', 'content'].some(o =>
      (n.contain || '').includes(o),
    )
  );
}

function Ht(t) {
  let e = P(t);
  for (; v(e) && !I(e); ) {
    if (K(e)) return e;
    e = P(e);
  }
  return null;
}

function J() {
  return typeof CSS > 'u' || !CSS.supports
    ? false
    : CSS.supports('-webkit-backdrop-filter', 'none');
}

function I(t) {
  return ['html', 'body', '#document'].includes(A(t));
}

function x(t) {
  return C(t).getComputedStyle(t);
}

function V(t) {
  return S(t)
    ? {
        scrollLeft: t.scrollLeft,
        scrollTop: t.scrollTop,
      }
    : {
        scrollLeft: t.pageXOffset,
        scrollTop: t.pageYOffset,
      };
}

function P(t) {
  if (A(t) === 'html') return t;
  const e =
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    (ot(t) && t.host) || // Fallback.
    L(t);
  return ot(e) ? e.host : e;
}

function ut(t) {
  const e = P(t);
  return I(e)
    ? t.ownerDocument
      ? t.ownerDocument.body
      : t.body
    : v(e) && _(e)
    ? e
    : ut(e);
}

function Q(t, e, n) {
  var o;
  e === void 0 && (e = []), n === void 0 && (n = true);
  const i = ut(t),
    c = i === ((o = t.ownerDocument) == null ? void 0 : o.body),
    s = C(i);
  return c
    ? e.concat(
        s,
        s.visualViewport || [],
        _(i) ? i : [],
        s.frameElement && n ? Q(s.frameElement) : [],
      )
    : e.concat(i, Q(i, [], n));
}

function dt(t) {
  const e = x(t);
  let n = parseFloat(e.width) || 0,
    o = parseFloat(e.height) || 0;
  const i = v(t),
    c = i ? t.offsetWidth : n,
    s = i ? t.offsetHeight : o,
    l = H(n) !== c || H(o) !== s;
  return (
    l && ((n = c), (o = s)),
    {
      width: n,
      height: o,
      $: l,
    }
  );
}

function ft(t) {
  return S(t) ? t : t.contextElement;
}

function B(t) {
  const e = ft(t);
  if (!v(e)) return N(1);
  const n = e.getBoundingClientRect(),
    { width: o, height: i, $: c } = dt(e);
  let s = (c ? H(n.width) : n.width) / o,
    l = (c ? H(n.height) : n.height) / i;
  return (
    (!s || !Number.isFinite(s)) && (s = 1),
    (!l || !Number.isFinite(l)) && (l = 1),
    {
      x: s,
      y: l,
    }
  );
}

const It = /* @__PURE__ */ N(0);

function ht(t) {
  const e = C(t);
  return !J() || !e.visualViewport
    ? It
    : {
        x: e.visualViewport.offsetLeft,
        y: e.visualViewport.offsetTop,
      };
}

function Vt(t, e, n) {
  return e === void 0 && (e = false), !n || (e && n !== C(t)) ? false : e;
}

function z(t, e, n, o) {
  e === void 0 && (e = false), n === void 0 && (n = false);
  const i = t.getBoundingClientRect(),
    c = ft(t);
  let s = N(1);
  e && (o ? S(o) && (s = B(o)) : (s = B(t)));
  const l = Vt(c, n, o) ? ht(c) : N(0);
  let a = (i.left + l.x) / s.x,
    r = (i.top + l.y) / s.y,
    d = i.width / s.x,
    u = i.height / s.y;
  if (c) {
    const h = C(c),
      f = o && S(o) ? C(o) : o;
    let p = h.frameElement;
    for (; p && o && f !== h; ) {
      const m = B(p),
        R = p.getBoundingClientRect(),
        D = x(p),
        E = R.left + (p.clientLeft + parseFloat(D.paddingLeft)) * m.x,
        T = R.top + (p.clientTop + parseFloat(D.paddingTop)) * m.y;
      (a *= m.x),
        (r *= m.y),
        (d *= m.x),
        (u *= m.y),
        (a += E),
        (r += T),
        (p = C(p).frameElement);
    }
  }
  return at({
    width: d,
    height: u,
    x: a,
    y: r,
  });
}

function Wt(t) {
  let { rect: e, offsetParent: n, strategy: o } = t;
  const i = v(n),
    c = L(n);
  if (n === c) return e;
  let s = {
      scrollLeft: 0,
      scrollTop: 0,
    },
    l = N(1);
  const a = N(0);
  if (
    (i || (!i && o !== 'fixed')) &&
    ((A(n) !== 'body' || _(c)) && (s = V(n)), v(n))
  ) {
    const r = z(n);
    (l = B(n)), (a.x = r.x + n.clientLeft), (a.y = r.y + n.clientTop);
  }
  return {
    width: e.width * l.x,
    height: e.height * l.y,
    x: e.x * l.x - s.scrollLeft * l.x + a.x,
    y: e.y * l.y - s.scrollTop * l.y + a.y,
  };
}

function $t(t) {
  return Array.from(t.getClientRects());
}

function pt(t) {
  return z(L(t)).left + V(t).scrollLeft;
}

function jt(t) {
  const e = L(t),
    n = V(t),
    o = t.ownerDocument.body,
    i = M(e.scrollWidth, e.clientWidth, o.scrollWidth, o.clientWidth),
    c = M(e.scrollHeight, e.clientHeight, o.scrollHeight, o.clientHeight);
  let s = -n.scrollLeft + pt(t);
  const l = -n.scrollTop;
  return (
    x(o).direction === 'rtl' && (s += M(e.clientWidth, o.clientWidth) - i),
    {
      width: i,
      height: c,
      x: s,
      y: l,
    }
  );
}

function qt(t, e) {
  const n = C(t),
    o = L(t),
    i = n.visualViewport;
  let c = o.clientWidth,
    s = o.clientHeight,
    l = 0,
    a = 0;
  if (i) {
    (c = i.width), (s = i.height);
    const r = J();
    (!r || (r && e === 'fixed')) && ((l = i.offsetLeft), (a = i.offsetTop));
  }
  return {
    width: c,
    height: s,
    x: l,
    y: a,
  };
}

function Ut(t, e) {
  const n = z(t, true, e === 'fixed'),
    o = n.top + t.clientTop,
    i = n.left + t.clientLeft,
    c = v(t) ? B(t) : N(1),
    s = t.clientWidth * c.x,
    l = t.clientHeight * c.y,
    a = i * c.x,
    r = o * c.y;
  return {
    width: s,
    height: l,
    x: a,
    y: r,
  };
}

function it(t, e, n) {
  let o;
  if (e === 'viewport') o = qt(t, n);
  else if (e === 'document') o = jt(L(t));
  else if (S(e)) o = Ut(e, n);
  else {
    const i = ht(t);
    o = {
      ...e,
      x: e.x - i.x,
      y: e.y - i.y,
    };
  }
  return at(o);
}

function mt(t, e) {
  const n = P(t);
  return n === e || !S(n) || I(n)
    ? false
    : x(n).position === 'fixed' || mt(n, e);
}

function Xt(t, e) {
  const n = e.get(t);
  if (n) return n;
  let o = Q(t, [], false).filter(l => S(l) && A(l) !== 'body'),
    i = null;
  const c = x(t).position === 'fixed';
  let s = c ? P(t) : t;
  for (; S(s) && !I(s); ) {
    const l = x(s),
      a = K(s);
    !a && l.position === 'fixed' && (i = null),
      (
        c
          ? !a && !i
          : (!a &&
              l.position === 'static' &&
              !!i &&
              ['absolute', 'fixed'].includes(i.position)) ||
            (_(s) && !a && mt(t, s))
      )
        ? (o = o.filter(d => d !== s))
        : (i = l),
      (s = P(s));
  }
  return e.set(t, o), o;
}

function Yt(t) {
  let { element: e, boundary: n, rootBoundary: o, strategy: i } = t;
  const s = [...(n === 'clippingAncestors' ? Xt(e, this._c) : [].concat(n)), o],
    l = s[0],
    a = s.reduce(
      (r, d) => {
        const u = it(e, d, i);
        return (
          (r.top = M(u.top, r.top)),
          (r.right = nt(u.right, r.right)),
          (r.bottom = nt(u.bottom, r.bottom)),
          (r.left = M(u.left, r.left)),
          r
        );
      },
      it(e, l, i),
    );
  return {
    width: a.right - a.left,
    height: a.bottom - a.top,
    x: a.left,
    y: a.top,
  };
}

function Qt(t) {
  return dt(t);
}

function Kt(t, e, n) {
  const o = v(e),
    i = L(e),
    c = n === 'fixed',
    s = z(t, true, c, e);
  let l = {
    scrollLeft: 0,
    scrollTop: 0,
  };
  const a = N(0);
  if (o || (!o && !c))
    if (((A(e) !== 'body' || _(i)) && (l = V(e)), o)) {
      const r = z(e, true, c, e);
      (a.x = r.x + e.clientLeft), (a.y = r.y + e.clientTop);
    } else i && (a.x = pt(i));
  return {
    x: s.left + l.scrollLeft - a.x,
    y: s.top + l.scrollTop - a.y,
    width: s.width,
    height: s.height,
  };
}

function st(t, e) {
  return !v(t) || x(t).position === 'fixed' ? null : e ? e(t) : t.offsetParent;
}

function gt(t, e) {
  const n = C(t);
  if (!v(t)) return n;
  let o = st(t, e);
  for (; o && Ft(o) && x(o).position === 'static'; ) o = st(o, e);
  return o &&
    (A(o) === 'html' ||
      (A(o) === 'body' && x(o).position === 'static' && !K(o)))
    ? n
    : o || Ht(t) || n;
}

const Jt = async function (t) {
  let { reference: e, floating: n, strategy: o } = t;
  const i = this.getOffsetParent || gt,
    c = this.getDimensions;
  return {
    reference: Kt(e, await i(n), o),
    floating: {
      x: 0,
      y: 0,
      ...(await c(n)),
    },
  };
};

function Zt(t) {
  return x(t).direction === 'rtl';
}

const te = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Wt,
  getDocumentElement: L,
  getClippingRect: Yt,
  getOffsetParent: gt,
  getElementRects: Jt,
  getClientRects: $t,
  getDimensions: Qt,
  getScale: B,
  isElement: S,
  isRTL: Zt,
};

const computePosition = (t, e, n) => {
  const o = /* @__PURE__ */ new Map(),
    i = {
      platform: te,
      ...n,
    },
    c = {
      ...i.platform,
      _c: o,
    };
  return _t(t, e, {
    ...i,
    platform: c,
  });
};

export {
  rt,
  Ot,
  Gt,
  Mt,
  lt,
  zt,
  at,
  et,
  _t,
  nt,
  M,
  H,
  N,
  A,
  C,
  L,
  ct,
  S,
  v,
  ot,
  _,
  Ft,
  K,
  Ht,
  J,
  I,
  x,
  V,
  P,
  ut,
  Q,
  dt,
  ft,
  B,
  It,
  ht,
  Vt,
  z,
  Wt,
  $t,
  pt,
  jt,
  qt,
  Ut,
  it,
  mt,
  Xt,
  Yt,
  Qt,
  Kt,
  st,
  gt,
  Jt,
  Zt,
  te,
  computePosition,
};
