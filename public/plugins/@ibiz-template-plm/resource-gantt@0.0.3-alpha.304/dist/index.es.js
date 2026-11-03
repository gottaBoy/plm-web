import './assets/style.css';
import { registerPanelItemProvider as Ee, registerControlProvider as nt, GanttController as ot, calcDeCodeNameById as Te, Srfuf as st, TreeGridExNotifyState as it, isValueChange as rt, GanttService as lt, getChildNodeRSs as fe, handleAllSettled as Oe, getTreeNode as ke, getRootNode as dt, GanttDataSetNodeData as ct, TreeGridExFieldColumnController as ut, TreeGridExRowState as Re } from "@ibiz-template/runtime";
import { withInstall as be, useNamespace as te, useControlController as ht, useUIStore as pt, PanelRawItemController as Ae } from "@ibiz-template/vue3-util";
import { defineComponent as re, ref as V, computed as X, createVNode as l, onMounted as Ce, resolveComponent as z, watch as De, getCurrentInstance as ft, withDirectives as mt, resolveDirective as gt, h as yt, createTextVNode as vt, isVNode as wt } from "vue";
import { createUUID as Dt } from "qx-util";
import { isObject as bt } from "lodash-es";
import { RuntimeError as Ne, awaitTimeout as Ct, ModelError as _t } from "@ibiz-template/core";
import { isNotNil as xt } from "ramda";
var St = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function It(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var Ve = { exports: {} };
(function(a, t) {
  (function(e, o) {
    a.exports = o();
  })(St, function() {
    var e = 1e3, o = 6e4, s = 36e5, n = "millisecond", i = "second", r = "minute", d = "hour", u = "day", f = "week", h = "month", g = "quarter", I = "year", S = "date", D = "Invalid Date", T = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, P = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, W = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(M) {
      var p = ["th", "st", "nd", "rd"], m = M % 100;
      return "[" + M + (p[(m - 20) % 10] || p[m] || p[0]) + "]";
    } }, U = function(M, p, m) {
      var _ = String(M);
      return !_ || _.length >= p ? M : "" + Array(p + 1 - _.length).join(m) + M;
    }, Y = { s: U, z: function(M) {
      var p = -M.utcOffset(), m = Math.abs(p), _ = Math.floor(m / 60), y = m % 60;
      return (p <= 0 ? "+" : "-") + U(_, 2, "0") + ":" + U(y, 2, "0");
    }, m: function M(p, m) {
      if (p.date() < m.date())
        return -M(m, p);
      var _ = 12 * (m.year() - p.year()) + (m.month() - p.month()), y = p.clone().add(_, h), $ = m - y < 0, L = p.clone().add(_ + ($ ? -1 : 1), h);
      return +(-(_ + (m - y) / ($ ? y - L : L - y)) || 0);
    }, a: function(M) {
      return M < 0 ? Math.ceil(M) || 0 : Math.floor(M);
    }, p: function(M) {
      return { M: h, y: I, w: f, d: u, D: S, h: d, m: r, s: i, ms: n, Q: g }[M] || String(M || "").toLowerCase().replace(/s$/, "");
    }, u: function(M) {
      return M === void 0;
    } }, B = "en", x = {};
    x[B] = W;
    var b = "$isDayjsObject", O = function(M) {
      return M instanceof q || !(!M || !M[b]);
    }, R = function M(p, m, _) {
      var y;
      if (!p)
        return B;
      if (typeof p == "string") {
        var $ = p.toLowerCase();
        x[$] && (y = $), m && (x[$] = m, y = $);
        var L = p.split("-");
        if (!y && L.length > 1)
          return M(L[0]);
      } else {
        var A = p.name;
        x[A] = p, y = A;
      }
      return !_ && y && (B = y), y || !_ && B;
    }, k = function(M, p) {
      if (O(M))
        return M.clone();
      var m = typeof p == "object" ? p : {};
      return m.date = M, m.args = arguments, new q(m);
    }, v = Y;
    v.l = R, v.i = O, v.w = function(M, p) {
      return k(M, { locale: p.$L, utc: p.$u, x: p.$x, $offset: p.$offset });
    };
    var q = function() {
      function M(m) {
        this.$L = R(m.locale, null, !0), this.parse(m), this.$x = this.$x || m.x || {}, this[b] = !0;
      }
      var p = M.prototype;
      return p.parse = function(m) {
        this.$d = function(_) {
          var y = _.date, $ = _.utc;
          if (y === null)
            return /* @__PURE__ */ new Date(NaN);
          if (v.u(y))
            return /* @__PURE__ */ new Date();
          if (y instanceof Date)
            return new Date(y);
          if (typeof y == "string" && !/Z$/i.test(y)) {
            var L = y.match(T);
            if (L) {
              var A = L[2] - 1 || 0, F = (L[7] || "0").substring(0, 3);
              return $ ? new Date(Date.UTC(L[1], A, L[3] || 1, L[4] || 0, L[5] || 0, L[6] || 0, F)) : new Date(L[1], A, L[3] || 1, L[4] || 0, L[5] || 0, L[6] || 0, F);
            }
          }
          return new Date(y);
        }(m), this.init();
      }, p.init = function() {
        var m = this.$d;
        this.$y = m.getFullYear(), this.$M = m.getMonth(), this.$D = m.getDate(), this.$W = m.getDay(), this.$H = m.getHours(), this.$m = m.getMinutes(), this.$s = m.getSeconds(), this.$ms = m.getMilliseconds();
      }, p.$utils = function() {
        return v;
      }, p.isValid = function() {
        return this.$d.toString() !== D;
      }, p.isSame = function(m, _) {
        var y = k(m);
        return this.startOf(_) <= y && y <= this.endOf(_);
      }, p.isAfter = function(m, _) {
        return k(m) < this.startOf(_);
      }, p.isBefore = function(m, _) {
        return this.endOf(_) < k(m);
      }, p.$g = function(m, _, y) {
        return v.u(m) ? this[_] : this.set(y, m);
      }, p.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
      }, p.valueOf = function() {
        return this.$d.getTime();
      }, p.startOf = function(m, _) {
        var y = this, $ = !!v.u(_) || _, L = v.p(m), A = function(ae, J) {
          var ne = v.w(y.$u ? Date.UTC(y.$y, J, ae) : new Date(y.$y, J, ae), y);
          return $ ? ne : ne.endOf(u);
        }, F = function(ae, J) {
          return v.w(y.toDate()[ae].apply(y.toDate("s"), ($ ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(J)), y);
        }, H = this.$W, K = this.$M, Z = this.$D, se = "set" + (this.$u ? "UTC" : "");
        switch (L) {
          case I:
            return $ ? A(1, 0) : A(31, 11);
          case h:
            return $ ? A(1, K) : A(0, K + 1);
          case f:
            var ie = this.$locale().weekStart || 0, le = (H < ie ? H + 7 : H) - ie;
            return A($ ? Z - le : Z + (6 - le), K);
          case u:
          case S:
            return F(se + "Hours", 0);
          case d:
            return F(se + "Minutes", 1);
          case r:
            return F(se + "Seconds", 2);
          case i:
            return F(se + "Milliseconds", 3);
          default:
            return this.clone();
        }
      }, p.endOf = function(m) {
        return this.startOf(m, !1);
      }, p.$set = function(m, _) {
        var y, $ = v.p(m), L = "set" + (this.$u ? "UTC" : ""), A = (y = {}, y[u] = L + "Date", y[S] = L + "Date", y[h] = L + "Month", y[I] = L + "FullYear", y[d] = L + "Hours", y[r] = L + "Minutes", y[i] = L + "Seconds", y[n] = L + "Milliseconds", y)[$], F = $ === u ? this.$D + (_ - this.$W) : _;
        if ($ === h || $ === I) {
          var H = this.clone().set(S, 1);
          H.$d[A](F), H.init(), this.$d = H.set(S, Math.min(this.$D, H.daysInMonth())).$d;
        } else
          A && this.$d[A](F);
        return this.init(), this;
      }, p.set = function(m, _) {
        return this.clone().$set(m, _);
      }, p.get = function(m) {
        return this[v.p(m)]();
      }, p.add = function(m, _) {
        var y, $ = this;
        m = Number(m);
        var L = v.p(_), A = function(K) {
          var Z = k($);
          return v.w(Z.date(Z.date() + Math.round(K * m)), $);
        };
        if (L === h)
          return this.set(h, this.$M + m);
        if (L === I)
          return this.set(I, this.$y + m);
        if (L === u)
          return A(1);
        if (L === f)
          return A(7);
        var F = (y = {}, y[r] = o, y[d] = s, y[i] = e, y)[L] || 1, H = this.$d.getTime() + m * F;
        return v.w(H, this);
      }, p.subtract = function(m, _) {
        return this.add(-1 * m, _);
      }, p.format = function(m) {
        var _ = this, y = this.$locale();
        if (!this.isValid())
          return y.invalidDate || D;
        var $ = m || "YYYY-MM-DDTHH:mm:ssZ", L = v.z(this), A = this.$H, F = this.$m, H = this.$M, K = y.weekdays, Z = y.months, se = y.meridiem, ie = function(J, ne, de, ue) {
          return J && (J[ne] || J(_, $)) || de[ne].slice(0, ue);
        }, le = function(J) {
          return v.s(A % 12 || 12, J, "0");
        }, ae = se || function(J, ne, de) {
          var ue = J < 12 ? "AM" : "PM";
          return de ? ue.toLowerCase() : ue;
        };
        return $.replace(P, function(J, ne) {
          return ne || function(de) {
            switch (de) {
              case "YY":
                return String(_.$y).slice(-2);
              case "YYYY":
                return v.s(_.$y, 4, "0");
              case "M":
                return H + 1;
              case "MM":
                return v.s(H + 1, 2, "0");
              case "MMM":
                return ie(y.monthsShort, H, Z, 3);
              case "MMMM":
                return ie(Z, H);
              case "D":
                return _.$D;
              case "DD":
                return v.s(_.$D, 2, "0");
              case "d":
                return String(_.$W);
              case "dd":
                return ie(y.weekdaysMin, _.$W, K, 2);
              case "ddd":
                return ie(y.weekdaysShort, _.$W, K, 3);
              case "dddd":
                return K[_.$W];
              case "H":
                return String(A);
              case "HH":
                return v.s(A, 2, "0");
              case "h":
                return le(1);
              case "hh":
                return le(2);
              case "a":
                return ae(A, F, !0);
              case "A":
                return ae(A, F, !1);
              case "m":
                return String(F);
              case "mm":
                return v.s(F, 2, "0");
              case "s":
                return String(_.$s);
              case "ss":
                return v.s(_.$s, 2, "0");
              case "SSS":
                return v.s(_.$ms, 3, "0");
              case "Z":
                return L;
            }
            return null;
          }(J) || L.replace(":", "");
        });
      }, p.utcOffset = function() {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, p.diff = function(m, _, y) {
        var $, L = this, A = v.p(_), F = k(m), H = (F.utcOffset() - this.utcOffset()) * o, K = this - F, Z = function() {
          return v.m(L, F);
        };
        switch (A) {
          case I:
            $ = Z() / 12;
            break;
          case h:
            $ = Z();
            break;
          case g:
            $ = Z() / 3;
            break;
          case f:
            $ = (K - H) / 6048e5;
            break;
          case u:
            $ = (K - H) / 864e5;
            break;
          case d:
            $ = K / s;
            break;
          case r:
            $ = K / o;
            break;
          case i:
            $ = K / e;
            break;
          default:
            $ = K;
        }
        return y ? $ : v.a($);
      }, p.daysInMonth = function() {
        return this.endOf(h).$D;
      }, p.$locale = function() {
        return x[this.$L];
      }, p.locale = function(m, _) {
        if (!m)
          return this.$L;
        var y = this.clone(), $ = R(m, _, !0);
        return $ && (y.$L = $), y;
      }, p.clone = function() {
        return v.w(this.$d, this);
      }, p.toDate = function() {
        return new Date(this.valueOf());
      }, p.toJSON = function() {
        return this.isValid() ? this.toISOString() : null;
      }, p.toISOString = function() {
        return this.$d.toISOString();
      }, p.toString = function() {
        return this.$d.toUTCString();
      }, M;
    }(), G = q.prototype;
    return k.prototype = G, [["$ms", n], ["$s", i], ["$m", r], ["$H", d], ["$W", u], ["$M", h], ["$y", I], ["$D", S]].forEach(function(M) {
      G[M[1]] = function(p) {
        return this.$g(p, M[0], M[1]);
      };
    }), k.extend = function(M, p) {
      return M.$i || (M(p, q, k), M.$i = !0), k;
    }, k.locale = R, k.isDayjs = O, k.unix = function(M) {
      return k(1e3 * M);
    }, k.en = x[B], k.Ls = x, k.p = {}, k;
  });
})(Ve);
var Mt = Ve.exports;
const w = /* @__PURE__ */ It(Mt);
var Tt = Object.defineProperty, Ot = (a, t, e) => t in a ? Tt(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e, me = (a, t, e) => (Ot(a, typeof t != "symbol" ? t + "" : t, e), e);
const kt = (a) => {
  let t = a;
  const e = /* @__PURE__ */ new Set();
  for (; t && (typeof t == "object" || typeof t == "function") && !e.has(t); ) {
    if (e.add(t), typeof t.showContextMenu == "function")
      return t;
    if (t.default && t.default !== t) {
      t = t.default;
      continue;
    }
    if (t.v && t.v !== t) {
      t = t.v;
      continue;
    }
    break;
  }
  throw new Error("ResourceGantt: context-menu runtime has no showContextMenu export");
};
function Nt(a, t, e) {
  const o = w(a), s = w(t), n = w(e);
  if (!(o instanceof w) || !(s instanceof w) || !(n instanceof w))
    throw new Error("All arguments must be dayjs objects");
  return o.isAfter(s) && o.isBefore(n) || o.isSame(s) || o.isSame(n);
}
const $t = (a) => {
  if (/^en(?:[-_]|$)/i.test(ibiz.i18n.getLang()))
    return w(a).locale("en").format("ddd");
  const t = new Date(a), e = w(t).day();
  return [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六"
  ][e];
}, Lt = (a, t) => w(a).format(t), Et = (a) => {
  const t = new Date(a), e = w(t), o = w();
  return e.isSame(o, "day");
}, Rt = (a, t, e) => w(a).isSame(w(t), e), _e = (a, t) => a.replace(/\${(.*?)}/g, (e, o) => {
  const [s, n] = o.split("."), i = t[s] || "";
  return bt(i) ? i[n] ? i[n] : "" : i;
}), xe = (a, t) => {
  const e = w(a).day();
  return t.includes(e);
}, $e = (a, t) => {
  let e = [], o = 0;
  const s = _e(
    t,
    a.data && a.data._deData ? a.data._deData : {}
  );
  let n = {};
  try {
    n = JSON.parse(s);
  } catch (i) {
    n = {};
  }
  return n.weekdays && (e = n.weekdays.split(",").map((i) => Number(i))), n.dayCapacityVal && (o = Number(n.dayCapacityVal)), Object.assign(n, { weekdays: e, dayCapacity: o }), n;
}, ze = (a, t, e) => (a.isAfter(t) || a.isSame(t)) && (a.isBefore(e) || a.isSame(e)), Be = (a, t) => {
  const e = Math.floor(a / t * 10) / 10, o = Math.round((a - e * t) * 10) / 10, s = new Array(t).fill(e);
  let n = 0;
  for (let i = 0; n < o; i++)
    s[i] = Math.round((s[i] + 0.1) * 10) / 10, n = Math.round((n + 0.1) * 10) / 10;
  return s;
};
function je(a) {
  return a.getBoundingClientRect().top;
}
function Pe(a) {
  const t = a.getBoundingClientRect(), e = window.innerHeight || document.documentElement.clientHeight, o = t.top + t.height;
  return e - o;
}
const Ye = (a, t = []) => {
  const e = w(a).startOf("day");
  return t.filter((o) => {
    const s = o._beginDataItemValue ? w(o._beginDataItemValue).startOf("day") : null, n = o._endDataItemValue ? w(o._endDataItemValue).startOf("day") : null;
    return s && n && s.isAfter(n) ? !1 : !s && n && e.isSame(n, "day") || s && !n && e.isSame(s, "day") || s && n && Nt(e, s, n);
  }).length;
}, qe = (a, t, e) => {
  const o = new Date(a), s = new Date(t), n = [];
  for (let i = new Date(o); i <= s; i.setDate(i.getDate() + 1))
    xe(i, e) && n.push(new Date(i));
  return n;
}, Fe = (a, t, e = [], o = "") => {
  let s = 0;
  const n = w(t).startOf("day");
  return e.filter(
    (i) => ze(
      n,
      w(i._beginDataItemValue).startOf("day"),
      w(i._endDataItemValue).startOf("day")
    )
  ).forEach((i) => {
    const r = w(i._beginDataItemValue).startOf("day"), d = w(i._endDataItemValue).startOf("day"), u = qe(
      new Date(r.format("YYYY-MM-DD")),
      new Date(d.format("YYYY-MM-DD")),
      a
    ), f = u.length, h = i._deData[o] ? Number(i._deData[o]) : 0;
    if (f > 0 && h > 0) {
      const g = Be(h, f), I = u.findIndex(
        (D) => w(D).startOf("day").isSame(n)
      ), S = I !== -1 ? g[I] : 0;
      s = Math.round((s + S) * 10) / 10;
    }
  }), s;
}, We = (a, t, e = [], o = "") => {
  let s = 0;
  const n = w(t).startOf("day"), i = w(/* @__PURE__ */ new Date()).startOf("day");
  return n.isBefore(i) ? 0 : (e.filter(
    (r) => ze(
      n,
      w(r._beginDataItemValue).startOf("day"),
      w(r._endDataItemValue).startOf("day")
    )
  ).forEach((r) => {
    let d = w(r._beginDataItemValue).startOf("day");
    const u = w(r._endDataItemValue).startOf("day");
    d.isBefore(i) && (d = i);
    const f = qe(
      new Date(d.format("YYYY-MM-DD")),
      new Date(u.format("YYYY-MM-DD")),
      a
    ), h = f.length, g = r._deData[o] ? Number(r._deData[o]) : 0;
    if (h > 0 && g > 0) {
      const I = Be(g, h), S = f.findIndex(
        (T) => w(T).startOf("day").isSame(n)
      ), D = S !== -1 ? I[S] : 0;
      s = Math.round((s + D) * 10) / 10;
    }
  }), s);
}, At = /* @__PURE__ */ re({
  name: "TopLevelCell",
  props: {
    cellData: {
      type: Object,
      required: !0,
      default: () => {
      }
    },
    showText: {
      type: Boolean,
      required: !0,
      default: !0
    },
    capacityConfig: {
      type: Object,
      default: () => {
      }
    }
  },
  emits: ["cellClick"],
  setup(a, {
    emit: t
  }) {
    const e = te("top-level-cell"), o = (d) => {
      d.stopPropagation(), t("cellClick", a.cellData);
    }, s = (d, u, f = 100) => {
      const h = d / u * f, g = f - h;
      return "polygon(0px ".concat(g, "%, 100% ").concat(g, "%, 100% ").concat(f, "%, 0px ").concat(f, "%)");
    }, n = (d, u) => {
      const f = {};
      return d < u && Object.assign(f, {
        "clip-path": s(d, u)
      }), f;
    }, i = (d, u) => {
      let f = [];
      return d === 0 ? [] : (d > u && (f = [e.em("caption", "exceed")]), d === u && (f = [e.em("caption", "saturation")]), d < u && (f = [e.em("caption", "standard")]), f);
    }, r = () => {
      const {
        column: d,
        row: u
      } = a.cellData;
      switch (a.capacityConfig.calcType) {
        case "WORKITEMCOUNT":
          return Ye(d.date, u.data._children);
        case "ESTIMATEDWORKLOAD":
          return Fe(a.capacityConfig.weekdays, d.date, u.data._children, a.capacityConfig.fieldName);
        case "REMAININGWORKLOAD":
          return We(a.capacityConfig.weekdays, d.date, u.data._children, a.capacityConfig.fieldName);
      }
    };
    return {
      ns: e,
      renderContent: () => {
        const {
          column: d
        } = a.cellData;
        if (!d)
          return "";
        const u = r() || 0, f = n(u, a.capacityConfig.dayCapacity), h = i(u, a.capacityConfig.dayCapacity);
        return l("div", {
          class: [e.e("caption"), ...h],
          onClick: (g) => o(g)
        }, [a.showText ? l("span", {
          class: [e.em("caption", "text")]
        }, [String(u)]) : "", l("div", {
          class: [e.em("caption", "bkg")],
          style: f
        }, null)]);
      }
    };
  },
  render() {
    return l("div", {
      class: this.ns.b()
    }, [this.renderContent()]);
  }
});
class Vt extends lt {
  /**
   * 通过节点类型加载节点数据
   *
   * @author tony001
   * @date 2023-12-11 18:12:35
   * @protected
   * @param {IDETreeNode} nodeModel
   * @param {(IDETreeNodeRS | undefined)} nodeRS
   * @param {(ITreeNodeData | undefined)} parentNodeData
   * @param {ResourceGanttFetchOpts} opts
   * @return {*}  {Promise<IGanttNodeData[]>}
   */
  async fetchNodeDatasByType(t, e, o, s) {
    const n = fe(this.model, {
      parentId: t.id,
      hasQuery: s.hasQuery
    }).length === 0, i = { ...s, leaf: n };
    let r = [];
    if (!o && !this.model.rootVisible)
      r = [await this.getStaticGanttNodeData(
        t,
        e,
        o,
        i
      )];
    else
      switch (t.treeNodeType) {
        case "STATIC":
          r = [await this.getStaticGanttNodeData(
            t,
            e,
            o,
            i
          )];
          break;
        case "DE":
          r = await this.getDEGanttNodeDatas(
            t,
            e,
            o,
            i
          );
          break;
        case "CODELIST":
          r = await this.getCodeListGanttNodeDatas(
            t,
            e,
            o,
            i
          );
          break;
        default:
          throw new _t(
            t,
            ibiz.i18n.t("runtime.controller.control.gantt.noSupport", {
              treeNodeType: t.treeNodeType
            })
          );
      }
    const { expandFirstOnly: d, expanded: u, rootNode: f } = t, h = f && !this.model.rootVisible;
    if (!n)
      if (o && !o._parent) {
        r = await Promise.all(r);
        const g = await this.fetchAllChildNodes(r, s);
        r.forEach(async (I) => {
          const S = await this.fetchCustomChildNodes(
            I,
            s,
            g || []
          );
          I._children = S;
        });
      } else
        await Promise.all(
          r.map(async (g, I) => {
            if (u && // 全展开合只展开首节点expanded都为true
            (!d || d && I === 0) || h) {
              const S = await this.fetchChildNodes(
                g,
                s
              );
              g._children = S;
            }
          })
        );
    return r == null || r.forEach((g) => {
      g._beginDataItemValue || (g._beginDataItemValue = g._endDataItemValue), g._endDataItemValue || (g._endDataItemValue = g._beginDataItemValue), g._endDataItemValue && (g._endDataItemValue = "".concat(g._endDataItemValue, " 23:59:59"));
    }), r = this.groupSort(r || [], s.groupField), r;
  }
  /**
   * 获取自定义
   *
   * @param {(IGanttNodeData | undefined)} parentNodeData
   * @param {ResourceGanttFetchOpts} opts
   * @param {(IGanttNodeData[])} allChildrenNodes
   */
  fetchCustomChildNodes(t, e, o) {
    let s = [];
    if (t && o.length > 0) {
      const { hasQuery: n } = e, i = fe(this.model, {
        parentId: t._nodeId,
        hasQuery: n
      })[0], { parentFilter: r } = i || {};
      o.forEach((d) => {
        r && d._deData && t._value === d._deData[r] && (d._parent = t, s.push(d));
      });
    }
    return s == null || s.forEach((n) => {
      n._beginDataItemValue || (n._beginDataItemValue = n._endDataItemValue), n._endDataItemValue || (n._endDataItemValue = n._beginDataItemValue), n._endDataItemValue && (n._endDataItemValue = "".concat(n._endDataItemValue, " 23:59:59"));
    }), s = this.groupSort(
      s || [],
      e.groupField
    ), s;
  }
  /**
   * 获取子节点数据
   *
   * @param {(IGanttNodeData | undefined)} parentNodeData
   * @param {ResourceGanttFetchOpts} opts
   * @return {*}  {(Promise<IGanttNodeData[] | undefined>)}
   */
  async fetchChildNodes(t, e) {
    const { hasQuery: o } = e;
    let s = [];
    if (t) {
      const n = fe(this.model, {
        parentId: t._nodeId,
        hasQuery: o
      });
      if (n.length === 0)
        return;
      (await Oe(
        n.map(async (i) => {
          const r = ke(
            this.model,
            i.childDETreeNodeId
          );
          return this.fetchNodeDatasByType(
            r,
            i,
            t,
            e
          );
        }),
        !1
      )).forEach((i) => {
        s.push(...i);
      });
    } else {
      const n = dt(this.model);
      s = await this.fetchNodeDatasByType(
        n,
        void 0,
        void 0,
        e
      );
    }
    return s;
  }
  /**
   * 分组排序
   *
   * @param {(IGanttNodeData[] | undefined)} parentNodeData
   * @param {string} groupField
   */
  groupSort(t, e) {
    const o = {};
    let s = 0;
    return t.forEach((n) => {
      const i = n._deData && n._deData[e] ? n._deData[e] : "";
      i in o || (o[i] = s, s += 1);
    }), t.sort((n, i) => {
      const r = n._deData && n._deData[e] ? o[n._deData[e]] : -1, d = i._deData && i._deData[e] ? o[i._deData[e]] : -1;
      return r - d;
    }), t;
  }
  /**
   * 获取过滤项集合
   *
   * @param {(IGanttNodeData[])} parentNodeDatas
   */
  getFilterNodes(t) {
    const e = [];
    return t.forEach((o) => {
      o._value && e.push(o._value);
    }), e.join(",");
  }
  /**
   * 获取所有子节点数据
   *
   * @param {(IGanttNodeData[])} parentNodeDatas
   * @param {ResourceGanttFetchOpts} opts
   * @return {*}  {(Promise<IGanttNodeData[] | undefined>)}
   */
  async fetchAllChildNodes(t, e) {
    const { hasQuery: o } = e, s = [], n = { ...t[0] }, i = fe(this.model, {
      parentId: n._nodeId,
      hasQuery: o
    });
    return i.length === 0 ? void 0 : ((await Oe(
      i.map(async (r) => {
        const d = ke(
          this.model,
          r.childDETreeNodeId
        );
        r.parentFilter && Object.assign(n, {
          _value: this.getFilterNodes(t)
        });
        const u = fe(this.model, {
          parentId: d.id,
          hasQuery: e.hasQuery
        }).length === 0, f = { ...e, leaf: u };
        return this.getCustomDEGanttNodeDatas(
          d,
          r,
          n,
          f
        );
      }),
      !1
    )).forEach((r) => {
      s.push(...r);
    }), s);
  }
  /**
   * 获取实体数据集数据
   *
   * @protected
   * @param {IDETreeDataSetNode} nodeModel
   * @param {(IDETreeNodeRS | undefined)} nodeRS
   * @param {(IGanttNodeData | undefined)} parentNodeData
   * @param {TreeFetchOpts} opts
   * @return {*}  {Promise<IGanttNodeData[]>}
   */
  async getCustomDEGanttNodeDatas(t, e, o, s) {
    const { appDEDataSetId: n, appDataEntityId: i } = t, { context: r, params: d, navContext: u, navParams: f } = e ? this.getNodeRSFilterParams(e, o, s) : {
      context: s.context,
      params: s.params,
      navContext: {},
      navParams: {}
    };
    d.size = t.maxSize || 1e3, t.sortAppDEFieldId && Object.assign(d, {
      sort: "".concat(t.sortAppDEFieldId.toLowerCase(), ",").concat(t.sortDir ? t.sortDir.toLowerCase() : "asc")
    });
    const h = e ? e.parentFilter : "";
    h && d["n_".concat(h.toLowerCase(), "_eq")] && (Object.assign(d, {
      ["n_".concat(h.toLowerCase(), "_in")]: d["n_".concat(h.toLowerCase(), "_eq")]
    }), delete d["n_".concat(h.toLowerCase(), "_eq")]);
    const g = await this.app.deService.exec(
      i,
      n,
      r,
      d
    );
    return g.data.length ? g.data.map((I, S) => {
      const D = this.calcExpand(t, S);
      return new ct(this.model, t, o, {
        data: I,
        leaf: !!s.leaf,
        navContext: u,
        navParams: f,
        defaultExpand: D
      });
    }) : [];
  }
}
class ge extends ot {
  constructor() {
    super(...arguments), me(this, "isInitialLoad", !0);
  }
  get _evt() {
    return this.evt;
  }
  /**
   * 初始化对应类型的部件服务
   *
   * @protected
   * @return {*}  {Promise<void>}
   * @memberof GanttController
   */
  async initService() {
    this.service = new Vt(this.model), await this.service.init(this.context);
  }
  initState() {
    super.initState(), this.state.showCapacity = !0, this.state.onlyTopNodes = !1, this.state.showWeekdays = [], this.state.capacityConfig = JSON.stringify({
      calcType: "WORKITEMCOUNT",
      fieldName: "",
      weekdays: "${weekday}",
      dayCapacityVal: "${day_capacity.work_item_count}"
    }), this.state.sliderDraggable = !0, this.state.sliderShowContent = '"${show_identifier}  ${title}"', this.state.groupConfig = { groupField: "project_id" }, this.state.contextMap = JSON.stringify({
      project: "${project_id}"
    }), this.state.sliderLimit = !0, this.state.expandAll = !1, this.calcDataRange();
  }
  /**
   * 部件参数解析
   *
   * @protected
   * @memberof ControlController
   */
  handleControlParams() {
    if (super.handleControlParams(), this.controlParams.sliderdraggable && (this.state.sliderDraggable = this.controlParams.sliderdraggable === "true"), this.controlParams.slidershowcontent && (this.state.sliderShowContent = this.controlParams.slidershowcontent), this.controlParams.groupconfig)
      try {
        this.state.groupConfig = JSON.parse(this.controlParams.groupconfig);
      } catch (t) {
        this.state.groupConfig = {};
      }
    this.controlParams.sliderlimit && (this.state.sliderLimit = this.controlParams.sliderlimit === "true"), this.controlParams.expandall && (this.state.expandAll = this.controlParams.expandall === "true"), this.controlParams.contextmap && (this.state.contextMap = this.controlParams.contextmap);
  }
  /**
   * 设置时间范围
   *
   * @memberof ResourceGanttController
   */
  setDateRange(t) {
    this.state.dateRange = t;
  }
  /**
   * 设置容量数值显示
   *
   * @memberof ResourceGanttController
   */
  showCapacityChange(t) {
    this.state.showCapacity = t;
  }
  /**
   * 全屏切换
   *
   * @memberof ResourceGanttController
   */
  fullscreenChange() {
    this._evt.emit("onFullscreenChange", {});
  }
  /**
   * 不显示周六及周天
   *
   * @memberof ResourceGanttController
   */
  noWeekendDays(t) {
    t ? this.state.showWeekdays = [1, 2, 3, 4, 5] : this.state.showWeekdays = [0, 1, 2, 3, 4, 5, 6];
  }
  /**
   * 容量计算切换
   *
   * @memberof ResourceGanttController
   */
  capacityCalcChange(t) {
    this.state.capacityConfig = JSON.stringify(t);
  }
  /**
   * 仅显示顶部节点
   *
   * @memberof ResourceGanttController
   */
  onlyTopNodesChange(t) {
    this.state.onlyTopNodes = t;
  }
  /**
   * 计算时间范围
   */
  calcDataRange() {
    const t = this.view.getController("searchform");
    if (t) {
      const { data: e } = t.state;
      this.state.dateRange = {
        start: e.n_date_scope_gtandeq,
        end: e.n_date_scope_ltandeq
      };
    } else {
      const e = /* @__PURE__ */ new Date();
      this.state.dateRange = {
        start: w(e.getTime() - 6048e5).format("YYYY-MM-DD"),
        end: w(e).format("YYYY-MM-DD")
      };
    }
  }
  /**
   * 根据节点id获取节点数据
   *
   * @param {string} key
   * @return {*}  {IData[]}
   * @memberof ResourceGanttController
   */
  getNodeDataByNodeId(t) {
    return this.state.items.filter((e) => e._nodeId === t).map((e) => {
      let o = {};
      return e._deData && (o = { ...e._deData, srfkey: e._deData.srfkey }), o;
    });
  }
  /**
   * 部件加载
   *
   * @param {MDCtrlLoadParams} [args={}]
   * @return {*}  {Promise<ITreeNodeData[]>}
   * @memberof ResourceGanttController
   */
  async load(t = {}) {
    return this.calcDataRange(), this.isInitialLoad = t.isInitialLoad === !0, super.load(t);
  }
  /**
   * 加载子节点数据
   *
   * @param {(ITreeNodeData | undefined)} parentNode
   * @returns {*}
   * @memberof TreeController
   */
  async loadNodes(t) {
    const e = await this.getFetchParams(), o = !!e.query;
    this.state.isLoading = !this.isInitialLoad;
    let s;
    try {
      s = await this.service.fetchChildNodes(t, {
        context: this.context.clone(),
        params: e,
        hasQuery: o,
        groupField: this.state.groupConfig.groupField,
        defaultExpandedKeys: this.state.expandedKeys
      }) || [];
    } finally {
      this.state.isLoading = !1;
    }
    return t ? t._children = s : this.state.rootNodes = s, await this.afterLoadNodes(s), s;
  }
  /**
   * 开始加载
   *
   * @return {*}  {Promise<void>}
   */
  async startLoading() {
    this.ctx.startLoading();
  }
  /**
   * 打开编辑数据视图
   *
   * @param {IGanttNodeData} item
   * @memberof GanttController
   */
  async openData({
    data: t,
    context: e,
    params: o
  }) {
    var s, n;
    const i = t[0], r = this.getNodeModel(i._nodeId), { appDataEntityId: d } = r, u = Te(d);
    e[u.toLowerCase()] = (s = i._deData) == null ? void 0 : s.srfkey;
    const f = await ((n = this.viewScheduler) == null ? void 0 : n.triggerCustom(
      "".concat(r.id.toLowerCase(), "_opendata"),
      {
        context: e,
        params: o,
        data: t,
        event: void 0,
        view: this.view,
        ctrl: this
      }
    ));
    if (f === -1)
      throw new Error(
        ibiz.i18n.t("runtime.controller.control.calendar.missingViewLogic", {
          itemType: r.id.toLowerCase()
        })
      );
    return {
      cancel: !f.ok
    };
  }
  /**
   * 保存
   *
   * @param {IGanttNodeData} nodeData
   * @return {*}  {Promise<void>}
   * @memberof GanttController
   */
  async save(t) {
    if (this.state.isSimple) {
      ibiz.log.debug(ibiz.i18n.t("runtime.controller.common.md.simpleMode"));
      return;
    }
    if (t._nodeType !== "DE")
      throw new Ne(
        ibiz.i18n.t("runtime.controller.control.gantt.nonentity")
      );
    const e = this.state.rows[t._uuid];
    if (!e)
      throw new Ne(
        ibiz.i18n.t("runtime.controller.common.md.rowData")
      );
    if (!e.modified) {
      ibiz.log.debug(ibiz.i18n.t("runtime.controller.common.md.noChange"));
      return;
    }
    if (e.processing) {
      await Ct(500, this.save.bind(this), [t]);
      return;
    }
    const o = this.getNodeModel(t._nodeId), { appDataEntityId: s } = o, n = t._deData.srfuf === st.CREATE, i = Te(s), r = this.context.clone();
    r[i] = t._deData.srfkey;
    const d = _e(this.state.contextMap, t._deData || {}) || "{}";
    Object.assign(r, JSON.parse(d));
    const u = ibiz.hub.getApp(this.context.srfappid);
    let f;
    try {
      f = await u.deService.exec(
        s,
        n ? "create" : "update",
        r,
        t._deData
      );
    } catch (h) {
      throw await this.evt.emit("onSaveError", void 0), this.actionNotification("".concat(n ? "CREATE" : "UPDATE", "ERROR"), {
        error: h,
        data: e.data
      }), h;
    }
    e.data._deData = f.data, e.modified = !1, this.gridStateNotify(e, it.SAVE), await this.evt.emit("onSaveSuccess", void 0);
  }
  /**
   * 设置行属性的值
   *
   * @param {TreeGridExRowState} row
   * @param {string} name
   * @param {unknown} value
   * @return {*}  {Promise<void>}
   * @memberof GanttController
   */
  async setRowValue(t, e, o) {
    const { beginDataItemName: s, endDataItemName: n } = this.model;
    if (!(Object.prototype.hasOwnProperty.call(t.data, e) && !rt(t.data[e], o)) && !((e === s || e === n) && Rt(t.data[e], o, "day"))) {
      t.data[e] = o, e === s ? t.data._beginDataItemValue = o : e === n && (t.data._endDataItemValue = o), t.modified = !0, t.processing = !0;
      try {
        await this.dataChangeNotify(t, [e]);
      } finally {
        t.processing = !1;
      }
    }
  }
}
const zt = /* @__PURE__ */ re({
  name: "TotalProgress",
  props: {
    row: {
      type: Re,
      required: !0
    },
    controller: {
      type: ge,
      required: !0
    },
    capacityConfig: {
      type: Object,
      required: !0,
      default: () => {
      }
    },
    dateRange: {
      type: Object,
      required: !0,
      default: () => {
      }
    }
  },
  setup(a) {
    const t = te("total-progress"), e = V(0), o = V(0), s = X(() => e.value / o.value * 100), n = (d, u, f) => {
      switch (d.calcType) {
        case "WORKITEMCOUNT":
          return Ye(u, f);
        case "ESTIMATEDWORKLOAD":
          return Fe(d.weekdays, u, f, d.fieldName);
        case "REMAININGWORKLOAD":
          return We(d.weekdays, u, f, d.fieldName);
        default:
          return 0;
      }
    }, i = (d, u, f) => {
      const {
        start: h,
        end: g
      } = f;
      let I = 0, S = 0, D = 0;
      if (u.length > 0) {
        const T = new Date(h);
        for (; T <= new Date(g); ) {
          if (xe(T, a.capacityConfig.weekdays)) {
            I += 1;
            const P = n(d, T, u);
            S = Math.round((S + P) * 10) / 10;
          }
          T.setDate(T.getDate() + 1);
        }
        D = I * d.dayCapacity;
      }
      return {
        numerator: S,
        denominator: D
      };
    }, r = () => {
      const d = i(a.capacityConfig, a.row.data._children || [], a.dateRange);
      e.value = d.numerator, o.value = d.denominator;
    };
    return Ce(() => {
      r(), a.controller._evt.on("onSliderMove", () => {
        r();
      });
    }), {
      ns: t,
      numerator: e,
      denominator: o,
      percentage: s
    };
  },
  render() {
    return l("div", {
      class: this.ns.b()
    }, [l("span", {
      class: this.ns.e("caption")
    }, [this.numerator, vt(" / "), this.denominator]), l(z("el-progress"), {
      percentage: this.percentage
    }, null)]);
  }
}), Bt = /* @__PURE__ */ re({
  name: "IBizResourceGanttExFieldColumn",
  props: {
    controller: {
      type: ut,
      required: !0
    },
    gantt: {
      type: ge,
      required: !0
    },
    row: {
      type: Re,
      required: !0
    },
    parentRow: {
      type: Object
    },
    column: {
      type: Object
    },
    capacityConfig: {
      type: Object,
      required: !0,
      default: () => {
      }
    },
    groupConfig: {
      type: Object,
      required: !0,
      default: () => {
      }
    },
    ganttPosition: {
      type: Object,
      required: !0,
      default: () => {
      }
    },
    virtualTableVal: {
      type: Array,
      default: () => []
    },
    dateRange: {
      type: Object,
      required: !0,
      default: () => {
      }
    },
    level: {
      type: Number,
      default: 0
    },
    isTopFirstIndex: {
      type: Boolean,
      default: !1
    }
  },
  setup(a) {
    const t = te("tree-grid-ex-field-column"), e = te("resource-gantt-ex-field-column"), o = V(), s = V({}), n = X(() => a.controller.nodeColumnControllerMap.get(a.row.data._nodeId)), i = X(() => a.row.data._nodeType !== "DE" && a.controller.isFirstShowColumn ? a.row.data._text : a.row.data[a.controller.name]), r = V(""), d = (x) => {
      r.value = x;
    }, u = X(() => {
      const x = n.value;
      return x ? x.nodeEditItem ? void 0 : x.codeList ? r.value : x.formatValue(i.value) + (x.unitName || "") : i.value;
    }), f = X(() => {
      if (a.controller.treeGrid.overflowMode === "ellipsis" && xt(i.value) && i.value !== "")
        return u.value;
    }), h = X(() => i.value && n.value && (n.value.isLinkColumn || n.value.hasClickAction)), g = (x) => {
      var b;
      (b = n.value) == null || b.onTextClick(a.row, x);
    }, I = async (x, b) => {
      var O;
      await ((O = n.value) == null ? void 0 : O.onActionClick(x, a.row, b));
    }, S = (x) => a.virtualTableVal.find((b) => b.data._id === x), D = (x, b, O) => {
      const {
        data: R
      } = x;
      if (R && R._children && R._children.length > 1) {
        const k = R._children.find((v) => b.data && v._deData && b.data._deData && v._deData[O.groupField] === b.data._deData[O.groupField]);
        if (k && !S(k._id)) {
          const v = a.virtualTableVal.find((q) => b.data && q.data._deData && b.data._deData && q.data._deData[O.groupField] === b.data._deData[O.groupField]);
          return v && b.data._id === v.data._id;
        }
        return k && b.data._id === k._id;
      }
      return !1;
    }, T = (x, b, O) => {
      const {
        data: R
      } = x;
      if (R && R._children && R._children.length > 1) {
        const k = R._children.findIndex((v) => b.data && v._deData && b.data._deData && v._deData[O.groupField] === b.data._deData[O.groupField] && b.data._id === v._id);
        if (k !== -1 && D(x, b, a.groupConfig))
          return R._children.slice(k).reduce((v, q) => b.data && q._deData && b.data._deData && q._deData[O.groupField] === b.data._deData[O.groupField] ? v + 1 : v, 0);
      }
      return 0;
    }, P = (x, b, O) => {
      const {
        data: R
      } = x;
      return R && R._children && R._children.length > 1 ? R._children.reduce((k, v) => b.data && v._deData && b.data._deData && v._deData[O.groupField] === b.data._deData[O.groupField] ? k + 1 : k, 0) : 0;
    };
    function W(x, b) {
      let O = x;
      for (; O && O.nodeType === 1; ) {
        if (O.classList.contains(b))
          return O;
        O = O.parentNode;
      }
      return null;
    }
    const U = () => {
      if (s.value = {}, o.value) {
        const x = W(o.value, "xg-table-row");
        if (x) {
          const {
            ganttPosition: b
          } = a, O = 46;
          let R = je(x), k = Pe(x);
          R < b.top + O && (R = b.top + O), k < b.bottom && (k = b.bottom);
          const v = ((window.innerHeight || document.documentElement.clientHeight) - R - k) / 2 + R - O / 2;
          v > R && (s.value = {
            position: "fixed",
            top: "".concat(v, "px")
          });
        }
      }
    }, Y = X(() => {
      let x = "";
      const {
        parentRow: b,
        row: O,
        level: R
      } = a;
      return R > 1 && b && P(b, O, a.groupConfig) > 1 && (x = D(b, O, a.groupConfig) ? "first-index" : "no-first-index"), x;
    }), B = X(() => {
      const x = {}, {
        level: b,
        parentRow: O,
        row: R
      } = a;
      if (b && b > 1 && O && O.data._children && O.data._children.length > 1) {
        const k = T(O, R, a.groupConfig);
        if (k > 1) {
          const v = 46 * k - 20;
          Object.assign(x, {
            height: "".concat(v, "px")
          }), U();
        }
      }
      return x;
    });
    return {
      ns: t,
      ns2: e,
      nodeColumn: n,
      fieldValue: i,
      showText: u,
      clickable: h,
      tooltip: f,
      calcMergeClass: Y,
      calcMergeStyle: B,
      columnRef: o,
      contentStyle: s,
      onInfoTextChange: d,
      onTextClick: g,
      onActionClick: I
    };
  },
  render() {
    var a, t, e, o, s, n, i;
    let r = null;
    (a = this.nodeColumn) != null && a.nodeEditItem ? r = l(z("iBizTreeGridExEditColumn"), {
      controller: this.nodeColumn,
      row: this.row
    }, null) : (t = this.nodeColumn) != null && t.codeList ? r = l(z("iBizCodeList"), {
      class: this.ns.e("text"),
      codeListItems: this.nodeColumn.codeListItems,
      codeList: this.nodeColumn.codeList,
      value: this.fieldValue,
      onClick: this.onTextClick,
      onInfoTextChange: this.onInfoTextChange,
      title: this.tooltip
    }, null) : r = l("span", {
      class: [this.ns.e("text"), this.ns2.e("text")],
      title: this.tooltip,
      onClick: this.onTextClick,
      style: this.contentStyle
    }, [this.showText]);
    let d;
    this.$slots.actions ? d = this.$slots.actions() : this.row.columnActionsStates[this.controller.name] && (d = l(Kt, {
      class: this.ns.e("toolbar"),
      actionDetails: (e = this.nodeColumn) == null ? void 0 : e.nodeColumn.deuiactionGroup.uiactionGroupDetails,
      actionsState: this.row.columnActionsStates[this.controller.name],
      mode: "dropdown",
      popperClass: this.ns2.b("popper"),
      groupLevelKeys: [],
      onActionClick: this.onActionClick
    }, null));
    let u = null;
    return this.level === 1 && (u = l(zt, {
      row: this.row,
      controller: this.gantt,
      capacityConfig: this.capacityConfig,
      dateRange: this.dateRange
    }, null)), l("div", {
      ref: "columnRef",
      class: [this.ns.b(), this.ns2.b(), this.clickable && this.ns.m("clickable"), this.ns.m(this.controller.treeGrid.overflowMode), (o = this.controller.model.cellSysCss) == null ? void 0 : o.cssName, this.ns.is("has-action", !!d), (s = this.row) != null && s.data._children && ((i = (n = this.row) == null ? void 0 : n.data._children) == null ? void 0 : i.length) === 0 ? "no-children" : "", this.isTopFirstIndex ? "top-first-index" : "", this.calcMergeClass],
      style: this.calcMergeStyle
    }, [l("div", {
      class: [this.ns.b("text-container"), this.ns2.b("text-container")]
    }, [r]), d, u]);
  }
}), Le = () => l("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  focusable: "false"
}, [l("g", {
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [l("path", {
  d: "M6.751 12.303A5.557 5.557 0 0 1 1.2 6.751C1.2 3.691 3.69 1.2 6.751 1.2a5.558 5.558 0 0 1 5.551 5.551 5.557 5.557 0 0 1-5.551 5.552M6.751 0a6.751 6.751 0 1 0 4.309 11.949l3.855 3.855a.6.6 0 1 0 .849-.849l-3.854-3.853A6.751 6.751 0 0 0 6.751 0"
}, null)])]), jt = () => l("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  focusable: "false"
}, [l("g", {
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [l("g", {
  transform: "translate(3.347 1.67)"
}, [l("path", {
  d: "M8.31 4.544l-3.858-3.01L.757 4.537 0 3.606 4.435 0l4.613 3.598-.738.946zM.778 7.934l3.805 3.077L8.33 8.074l.74.944-4.497 3.528-4.55-3.679.755-.933z"
}, null)])])]), Pt = () => l("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  focusable: "false"
}, [l("g", {
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [l("g", {
  transform: "translate(3.347 1.67)"
}, [l("path", {
  d: "M.738 0l3.858 3.01L8.291.008l.757.93-4.435 3.606L0 .946.738 0zM8.31 12.544l-3.858-3.01-3.695 3.003L0 11.606 4.435 8l4.613 3.598-.738.946z"
}, null)])])]), Yt = () => l("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 1024 1024",
  height: "1em",
  width: "1em",
  "data-v-6fbb019e": ""
}, [l("path", {
  fill: "currentColor",
  d: "M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
}, null)]), qt = () => l("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em"
}, [l("g", {
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [l("path", {
  d: "M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm0-1.2A6.8 6.8 0 1 0 8 1.2a6.8 6.8 0 0 0 0 13.6zm.017-10V8.42H11.7v1.2H6.817V4.8h1.2z"
}, null)])]), Ft = () => l("svg", {
  viewBox: "0 0 16 16",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em"
}, [l("g", {
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [l("path", {
  d: "M13.9940802,1 L13.9940802,2.2 L13.2624694,2.20103326 C12.93604,4.83947485 11.5126604,7.09238002 9.63519201,7.94035881 C11.5358297,8.8013205 12.9480925,11.1932677 13.2658805,13.8999459 L13.9940802,13.9 L13.9940802,15.1 L2.00217741,15.1 L2.00217741,13.9 L2.73926874,13.9002831 C3.07603558,11.2316386 4.55055745,8.86884631 6.45182913,7.97728733 C4.5311544,7.16123279 3.06895466,4.87984542 2.73753056,2.20103326 L2.00217741,2.2 L2.00217741,1 L13.9940802,1 Z M8.09238129,8.79975967 C6.27968763,8.79975967 4.50087608,10.8991568 4.003456,13.5719701 L3.95733333,13.85 L12.0513333,13.85 L12.0453334,13.8079643 C11.6544503,11.0697148 10.0166737,8.92538307 8.2486894,8.80508513 L8.09238129,8.79975967 Z M12.0446667,2.25 L3.95366667,2.25 L3.96063026,2.29291849 C4.36564997,4.94375371 6.02387547,6.97732036 7.834965,7.09464882 L8,7.1 C9.81589788,7.1 11.5127277,5.15179966 11.9963879,2.54700205 L12.0446667,2.25 Z"
}, null)])]), Wt = () => l("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em"
}, [l("g", {
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [l("path", {
  d: "M12.777 13.107V3.88a.621.621 0 0 0-.621-.62h-.76v.216a.977.977 0 0 1-.975.978h-4.9a.978.978 0 0 1-.977-.978v-.216H3.82a.62.62 0 0 0-.62.62v9.226c0 .341.278.62.62.62h8.336a.621.621 0 0 0 .62-.62zM5.744 3.255h4.453V2.2H5.744v1.054zm6.412-1.194c1.004 0 1.82.817 1.82 1.82v9.226a1.821 1.821 0 0 1-1.82 1.819H3.82A1.822 1.822 0 0 1 2 13.105V3.88c0-1.002.817-1.82 1.82-1.82h.724v-.084c0-.538.438-.976.977-.976h4.9c.538 0 .975.438.975.976v.085h.76zm-1.77 4.782a.6.6 0 0 1 .833.863l-3.688 3.562c-.002.003-.002.006-.005.009a.601.601 0 0 1-.849-.004L4.748 9.326a.599.599 0 1 1 .852-.844l1.511 1.524 3.274-3.163z"
}, null)])]), Gt = () => l("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em"
}, [l("g", {
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [l("path", {
  d: "M6.012 11.201L1.313 6.832l-.817.879 5.54 5.15 9.304-9.163-.842-.855z"
}, null)])]), Ht = /* @__PURE__ */ re({
  name: "ResourceGanttColumnHead",
  props: {
    controller: {
      type: ge,
      required: !0,
      default: () => {
      }
    },
    model: {
      type: Object,
      required: !0,
      default: () => {
      }
    },
    expandAll: {
      type: Boolean,
      required: !0,
      default: !1
    },
    titleData: {
      type: Object,
      required: !0,
      default: () => {
      }
    }
  },
  emits: ["expandAllChange", "headSearch"],
  setup(a, {
    emit: t
  }) {
    const e = a.controller, o = te("resource-gantt-column-head"), s = V(!1), n = V(!1), i = V(""), r = X(() => a.titleData.label);
    De(() => a.expandAll, (T) => {
      s.value = T;
    }, {
      immediate: !0
    });
    const d = () => {
      s.value = !s.value, t("expandAllChange", s.value);
    }, u = () => {
      t("headSearch", i.value);
    }, f = (T) => {
      T.preventDefault(), T.stopPropagation(), i.value = "", n.value = !1, t("headSearch", "");
    }, h = (T, P) => {
      P.stopPropagation(), n.value = !0;
    }, g = async (T, P) => {
      await a.controller.doUIAction(T.uiactionId, {}, P, T.appId);
    }, I = (T) => {
      T.preventDefault(), T.stopPropagation();
    }, S = () => l(z("el-input"), {
      modelValue: i.value,
      "onUpdate:modelValue": (T) => i.value = T,
      class: o.b("search"),
      onInput: u,
      placeholder: "搜索成员"
    }, {
      prefix: () => l(Le, null, null),
      suffix: () => l(z("el-button"), {
        class: o.be("search", "suffix"),
        onClick: f
      }, {
        default: () => [l(Yt, null, null)]
      })
    }), D = () => {
      var T, P;
      const W = e.getNodeModel("root"), U = e.state.selectedData;
      if (!((P = (T = W == null ? void 0 : W.decontextMenu) == null ? void 0 : T.detoolbarItems) != null && P.length))
        return;
      const Y = e.contextMenuInfos[W.id];
      return Y.clickTBUIActionItem && Y.onlyOneActionItem ? null : l(z("iBizContextMenuControl"), {
        modelData: W.decontextMenu,
        groupLevelKeys: [50],
        nodeModel: W,
        nodeData: U,
        context: e.context,
        onActionClick: (B, x) => g(B, x)
      }, null);
    };
    return {
      c: e,
      ns: o,
      label: r,
      isHeadSearch: n,
      expand: s,
      renderHeadSearch: S,
      onColumnHeadClick: I,
      onExpandAllChange: d,
      renderContent: () => n.value ? S() : l("div", {
        class: o.b("box")
      }, [l("div", {
        class: o.be("box", "left")
      }, [l(z("el-button"), {
        class: o.bem("box", "left", "icon"),
        title: s.value ? "全部收起" : "全部展开",
        onClick: d
      }, {
        default: () => [s.value ? l(Pt, null, null) : l(jt, null, null)]
      }), l("div", {
        class: o.bem("box", "left", "caption")
      }, [r.value])]), l("div", {
        class: o.be("box", "right")
      }, [l(z("el-button"), {
        size: "small",
        title: "搜索成员",
        class: [o.e("item")],
        onClick: (T) => h("search_personal", T)
      }, {
        icon: () => l("div", {
          class: o.e("icon")
        }, [l(Le, null, null)])
      }), D()])])
    };
  },
  render() {
    return l("div", {
      class: this.ns.b()
    }, [this.renderContent()]);
  }
});
function Ut(a) {
  return typeof a == "function" || Object.prototype.toString.call(a) === "[object Object]" && !wt(a);
}
const Kt = /* @__PURE__ */ re({
  name: "IBizResourceActionToolbar",
  props: {
    actionDetails: {
      type: Array,
      required: !0
    },
    actionsState: {
      type: Object,
      required: !0
    },
    caption: String,
    mode: {
      type: String,
      default: "buttons"
    },
    // 分组的行为级别
    groupLevelKeys: {
      type: Object,
      default: [50]
    },
    zIndex: {
      type: Number
    },
    popperClass: String
  },
  emits: ["actionClick"],
  setup(a, {
    emit: t
  }) {
    var e;
    const o = te("action-toolbar"), s = te("resource-action-toolbar"), n = V(), i = V(!1), r = V(!1);
    (e = a.actionDetails) == null || e.forEach((D) => {
      D.capLanguageRes && D.capLanguageRes.lanResTag && (D.caption = ibiz.i18n.t(D.capLanguageRes.lanResTag, D.caption)), D.tooltipLanguageRes && D.tooltipLanguageRes.lanResTag && (D.tooltip = ibiz.i18n.t(D.tooltipLanguageRes.lanResTag, D.tooltip));
    });
    const d = (D) => {
      r.value = D;
    }, u = async (D, T) => {
      T.stopPropagation(), a.mode === "buttons" ? i.value = !1 : n.value && n.value.handleClose(), t("actionClick", D, T);
    }, f = V([]), h = V([]);
    a.actionDetails && a.actionDetails.forEach((D) => {
      a.groupLevelKeys.findIndex((T) => T === D.actionLevel) !== -1 ? h.value.push(D) : f.value.push(D);
    });
    const g = V(), I = (D) => {
      const {
        actionLevel: T
      } = D;
      return [o.e("item"), o.is("disabled", !1), o.em("item", "level-".concat(T))];
    }, S = a.zIndex;
    return {
      ns: o,
      ns2: s,
      dropdownRef: n,
      popoverIndex: S,
      expandDetails: f,
      groupDetails: h,
      groupButtonRef: g,
      popoverVisible: i,
      dropdownVisible: r,
      handleClick: u,
      calcActionItemClass: I,
      onVisibleChange: d
    };
  },
  render() {
    var a;
    const t = this.actionDetails || [], e = (n) => l(z("el-divider"), {
      class: this.ns.e("separator"),
      "border-style": "double",
      direction: n ? "vertical" : "horizontal"
    }, null), o = (n, i = !0) => n.map((r) => this.actionsState[r.id].visible ? [r.addSeparator && e(i), l(z("el-button"), {
      text: !0,
      size: "small",
      onClick: (d) => this.handleClick(r, d),
      title: r.tooltip,
      disabled: this.actionsState[r.id].disabled,
      class: this.calcActionItemClass(r)
    }, {
      default: () => [l("div", {
        class: this.ns.em("item", "icon")
      }, [r.showIcon && r.sysImage && l(z("iBizIcon"), {
        icon: r.sysImage
      }, null)]), l("div", {
        class: this.ns.em("item", "label")
      }, [r.showCaption ? r.caption : ""])]
    })] : null), s = () => {
      let n;
      if (this.groupDetails.length === 0 || this.groupDetails.findIndex((r) => this.actionsState[r.id].visible === !0) === -1)
        return null;
      const i = this.groupDetails.findIndex((r) => this.actionsState[r.id].disabled === !1) === -1;
      return [l(z("el-button"), {
        size: "small",
        text: !0,
        disabled: i,
        ref: "groupButtonRef",
        class: [this.ns.e("item"), this.ns.is("expand", this.popoverVisible)]
      }, {
        icon: () => l(z("ion-icon"), {
          class: this.ns.e("icon"),
          name: "ellipsis-vertical-outline",
          title: ibiz.i18n.t("component.actionToolbar.more")
        }, null)
      }), l(z("el-popover"), {
        placement: "bottom-start",
        "virtual-ref": this.groupButtonRef,
        trigger: "click",
        visible: this.popoverVisible,
        "onUpdate:visible": (r) => this.popoverVisible = r,
        "popper-class": this.ns.e("popover"),
        "virtual-triggering": !0,
        "popper-style": "z-index:".concat(this.popoverIndex)
      }, Ut(n = o(this.groupDetails, !1)) ? n : {
        default: () => [n]
      })];
    };
    if ((a = this.actionsState) != null && a.visible)
      return this.mode === "buttons" ? l("div", {
        class: [this.ns.b(), this.ns.m("buttons")],
        onClick: (n) => n.stopPropagation()
      }, [o(this.expandDetails), s()]) : l(z("el-dropdown"), {
        ref: "dropdownRef",
        onCommand: (n) => this.handleClick(n, new MouseEvent("click")),
        trigger: "click",
        class: [this.ns.b(), this.ns.m("dropdown"), this.dropdownVisible ? this.ns2.e("open") : ""],
        placement: "bottom-start",
        "popper-class": this.popperClass,
        onVisibleChange: this.onVisibleChange
      }, {
        default: () => l("span", {
          class: this.ns.e("caption")
        }, [this.caption, l(z("ion-icon"), {
          class: this.ns.e("caption-icon"),
          name: "ellipsis-vertical-outline"
        }, null)]),
        dropdown: () => l(z("el-dropdown-menu"), null, {
          default: () => [t.length > 0 && t.map((n) => this.actionsState[n.id].visible ? l(z("el-dropdown-item"), {
            class: [this.ns.e("item"), this.ns.is("disabled", !1)],
            title: n.tooltip,
            disabled: this.actionsState[n.id].disabled,
            command: n
          }, {
            default: () => [n.showIcon && n.sysImage && l(z("iBizIcon"), {
              icon: n.sysImage
            }, null), n.showCaption ? n.caption : ""]
          }) : null)]
        })
      });
  }
});
let Ge = class extends Ae {
};
const ye = /* @__PURE__ */ re({
  name: "IBizPanelResourceState",
  props: {
    modelData: {
      type: Object,
      required: !0
    },
    controller: {
      type: Ge,
      required: !0
    }
  },
  setup(a) {
    const t = te("panel-rawitem"), e = te("panel-resource-state"), o = V(""), s = [{
      tag: "standard",
      name: "标准"
    }, {
      tag: "saturation",
      name: "饱和"
    }, {
      tag: "exceed",
      name: "超出"
    }], {
      rawItem: n
    } = a.modelData;
    n && n.cssStyle && (o.value = n.cssStyle);
    const i = X(() => {
      const {
        id: r
      } = a.modelData, d = [t.b(), e.b(), t.m(r)];
      return d.push(...a.controller.containerClass), d;
    });
    return {
      ns: t,
      classArr: i,
      tempStyle: o,
      renderContent: () => s.map((r) => l("div", {
        class: [e.e("content"), e.e(r.tag)]
      }, [l("div", {
        class: [e.em("content", "star")]
      }, null), l("div", {
        class: e.em("content", "caption")
      }, [r.name])]))
    };
  },
  render() {
    if (this.controller.state.visible)
      return l("div", {
        class: this.classArr,
        style: this.tempStyle,
        onClick: () => {
          this.controller.onClick();
        }
      }, [this.renderContent()]);
  }
});
let Qt = class {
  constructor() {
    me(this, "component", "IBizPanelResourceState");
  }
  async createController(a, t, e) {
    const o = new Ge(a, t, e);
    return await o.init(), o;
  }
};
const Jt = be(
  ye,
  function(a) {
    a.component(ye.name, ye), Ee("CUSTOM_RESOURCE_STATE", () => new Qt());
  }
);
class He extends Ae {
}
const ve = /* @__PURE__ */ re({
  name: "IBizResourceDropdownList",
  props: {
    modelData: {
      type: Object,
      required: !0
    },
    controller: {
      type: He,
      required: !0
    }
  },
  setup(a) {
    const t = te("dropdown"), e = te("resource-dropdown-list"), o = a.controller, s = V(""), n = V({}), i = V([]), r = [{
      label: "容量计算"
    }, {
      calcType: "WORKITEMCOUNT",
      weekdays: "${weekday}",
      dayCapacityVal: "${day_capacity.work_item_count}",
      label: "工作项数量",
      icon: Wt
    }, {
      calcType: "ESTIMATEDWORKLOAD",
      weekdays: "${weekday}",
      dayCapacityVal: "${day_capacity.estimated_workload}",
      fieldName: "estimated_workload",
      label: "预估工时",
      icon: qt
    }, {
      calcType: "REMAININGWORKLOAD",
      weekdays: "${weekday}",
      dayCapacityVal: "${day_capacity.remaining_workload}",
      fieldName: "remaining_workload",
      label: "剩余工时",
      icon: Ft
    }], {
      rawItem: d
    } = a.modelData;
    d && d.cssStyle && (s.value = d.cssStyle);
    const u = X(() => {
      const {
        id: h
      } = a.modelData, g = [t.b(), e.b(), t.m(h)];
      return g.push(...a.controller.containerClass), g;
    });
    Ce(() => {
      i.value = r, n.value = r[1];
    });
    const f = (h) => {
      n.value = h;
      const g = {};
      Object.assign(g, h), delete g.icon, a.controller.panel.panelItems && a.controller.panel.panelItems.gantt && a.controller.panel.panelItems.gantt.control.capacityCalcChange(g);
    };
    return {
      ns: t,
      ns2: e,
      c: o,
      curValue: n,
      items: i,
      classArr: u,
      tempStyle: s,
      handleItemClick: f,
      renderContent: () => l(z("el-dropdown"), {
        trigger: "click",
        class: e.b("dropdown"),
        "popper-class": e.b("dropdown-popper")
      }, {
        default: () => l("span", {
          class: e.be("dropdown", "content")
        }, [n.value.icon && l("span", {
          class: e.bem("dropdown", "content", "icon")
        }, [n.value.icon()]), l("span", {
          class: e.bem("dropdown", "content", "text")
        }, [n.value.label])]),
        dropdown: () => l(z("el-dropdown-menu"), null, {
          default: () => i.value.map((h) => l(z("el-dropdown-item"), {
            onClick: () => f(h)
          }, {
            default: () => [l("div", {
              class: e.be("dropdown-popper", "content")
            }, [h.icon && l("span", {
              class: e.bem("dropdown-popper", "content", "icon")
            }, [h.icon()]), l("span", {
              class: e.bem("dropdown-popper", "content", "text")
            }, [h.label]), n.value.calcType === h.calcType && l("span", {
              class: e.bem("dropdown-popper", "content", "correct")
            }, [Gt()])])]
          }))
        })
      })
    };
  },
  render() {
    return l("div", {
      class: this.classArr,
      style: this.tempStyle
    }, [this.renderContent()]);
  }
});
class Zt {
  constructor() {
    me(this, "component", "IBizResourceDropdownList");
  }
  async createController(t, e, o) {
    const s = new He(t, e, o);
    return await s.init(), s;
  }
}
const Xt = be(
  ve,
  function(a) {
    a.component(ve.name, ve), Ee(
      "CUSTOM_RESOURCE_DROPDOWN_LIST",
      () => new Zt()
    );
  }
);
function ea() {
  const a = V(!1), t = (u) => {
    const { startDate: f, endDate: h, dateRange: g, sliderLimit: I } = u;
    let S = w(f.date), D = w(h.date);
    const T = D.diff(S, "hour");
    if (S.diff(S.startOf("day"), "hour") < 12) {
      if (S = S.startOf("day"), D = D.subtract(1, "day").startOf("day"), I && g) {
        const P = w(g.end).startOf("day").add(1, "day").subtract(1, "second"), W = w(g.start).startOf("day");
        (w(h.date).isAfter(P) || w(h.date).isSame(P)) && (D = P), (w(f.date).isBefore(W) || w(f.date).isSame(W)) && (S = W);
      }
      T === 24 && (D = S);
    } else
      D = D.startOf("day"), S = S.add(1, "day").startOf("day"), T === 24 && (S = D);
    return D = D.add(1, "day").startOf("day").subtract(1, "second"), { start: S, end: D };
  }, e = (u) => {
    const { startDate: f, endDate: h } = u;
    let g = w(f.date), I = w(h.date);
    return g = g.startOf("day"), I = I.startOf("day").add(1, "day").subtract(1, "second"), { start: g, end: I };
  }, o = (u, f) => ({
    curDate: w(u),
    rangeStart: w(f.start).startOf("day"),
    rangeEnd: w(f.end).startOf("day").add(1, "day").subtract(1, "second")
  }), s = (u, f) => {
    const { startDate: h, endDate: g } = u, I = h.clone(), S = g.clone();
    let D;
    a.value ? D = t(u) : D = e(u), a.value = !1, I.setDate(w(D.start)), S.setDate(w(D.end)), f({
      startDate: I,
      endDate: S,
      unit: "hour"
    });
  }, n = (u, f) => {
    const {
      x: h,
      type: g,
      startDate: I,
      endDate: S,
      sliderLimit: D,
      dateRange: T,
      ganttColumnWidth: P,
      currentMillisecond: W
    } = u;
    let U;
    a.value = !0;
    const Y = I.getOffset(h / P * W).clone();
    g === "resize" && (a.value = !1);
    let B = 0;
    if (D && T) {
      const { rangeStart: x, rangeEnd: b } = o(I.date, T), O = S.getOffset(
        h / P * W
      ), R = w(S.date), k = w(I.date);
      let v = w(Y.date), q = w(O.date);
      if (g === "resize") {
        const G = R.subtract(1, "day").add(1, "second");
        v.isAfter(G) && (Y.setDate(G.toDate()), v = w(Y.date)), v.isAfter(b.startOf("day")) && (Y.setDate(b.startOf("day").toDate()), v = w(Y.date));
      } else {
        if (k.isBefore(x.add(1, "day"), "day") && R.isAfter(b.subtract(1, "day"), "day"))
          return h;
        q.isAfter(b) && (O.setDate(b.toDate()), q = w(O.date));
        const G = R.diff(k, "second"), M = q.diff(v, "second"), p = q.subtract(G, "second");
        B = q.add(1, "second").valueOf() - p.valueOf(), M > 0 && M <= G && p.isAfter(x) && (Y.setDate(p.toDate()), v = w(Y.date));
      }
      v.isBefore(x) && Y.setDate(x.toDate());
    }
    return (Y.compareTo(S.getOffset(-864e5)) === "r" || B > 0) && g !== "resize" && (U = Y.getOffset(B > 0 ? B : 864e5)), f({
      startDate: Y,
      endDate: U,
      unit: "hour"
    }), h;
  }, i = (u, f) => {
    const {
      x: h,
      type: g,
      startDate: I,
      endDate: S,
      sliderLimit: D,
      dateRange: T,
      ganttColumnWidth: P,
      currentMillisecond: W
    } = u;
    a.value = !0;
    let U = 0, Y;
    const B = S.getOffset(h / P * W).clone();
    if (g === "resize" && (a.value = !1), D && T) {
      const { rangeStart: x, rangeEnd: b } = o(S.date, T), O = I.getOffset(
        h / P * W
      ), R = w(I.date), k = w(S.date);
      let v = w(B.date);
      const q = w(O.date);
      if (g === "resize") {
        const G = R.add(1, "day").subtract(1, "second");
        v.isBefore(G) && (B.setDate(G), v = w(B.date)), v.isBefore(
          x.startOf("day").add(1, "day").subtract(1, "second")
        ) && (B.setDate(
          x.startOf("day").add(1, "day").subtract(1, "second").toDate()
        ), v = w(B.date));
      } else {
        if (R.isBefore(x.add(1, "day"), "day") && k.isAfter(b.subtract(1, "day"), "day") || q.isBefore(x))
          return h;
        const G = k.diff(R, "second"), M = v.diff(q, "second"), p = q.add(G + 1, "second");
        U = p.valueOf() - q.valueOf(), M > 0 && M <= G && p.isBefore(b) && (B.setDate(p), v = w(B.date));
      }
      v.isAfter(b) && B.setDate(b);
    }
    return B.compareTo(I.getOffset(864e5)) === "l" && g !== "resize" && (Y = B.getOffset(U > 0 ? -U : -864e5)), f({
      startDate: Y,
      endDate: B,
      unit: "hour"
    }), h;
  };
  function r(u) {
    const { startDate: f, ganttHeader: h, currentMillisecond: g, ganttColumnWidth: I } = u;
    return f.intervalTo(h.start) / g * I;
  }
  function d(u) {
    const { startDate: f, endDate: h, currentMillisecond: g, ganttColumnWidth: I } = u;
    return h.intervalTo(f) / g * I;
  }
  return {
    handleEmitMove: s,
    handleSetStart: n,
    handleSetEnd: i,
    handleSliderLeft: r,
    handleSliderWidth: d
  };
}
const we = /* @__PURE__ */ re({
  name: "IBizResourceGanttControl",
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
    loadDefault: {
      type: Boolean,
      default: !0
    },
    mdctrlActiveMode: {
      type: Number,
      default: void 0
    },
    singleSelect: {
      type: Boolean,
      default: void 0
    }
  },
  setup(a) {
    var t;
    const e = ht((...c) => new ge(...c)), o = V(), s = V(), n = V(!1), i = te("control-".concat(e.model.controlType.toLowerCase())), r = te("control-resource-gantt"), d = V(), u = V(!0), {
      handleEmitMove: f,
      handleSetStart: h,
      handleSetEnd: g,
      handleSliderLeft: I,
      handleSliderWidth: S
    } = ea(), D = V();
    D.value = Dt();
    const T = z("IBizRawItem"), P = z("IBizIcon");
    let W = !1;
    const U = V({
      top: 0,
      bottom: 0
    }), Y = V([]), B = () => {
      var c, C, E;
      if (Object.assign(U.value, {
        top: 0,
        bottom: 0
      }), s.value && (c = s.value) != null && c.$el) {
        const N = je((C = s.value) == null ? void 0 : C.$el), Q = Pe((E = s.value) == null ? void 0 : E.$el);
        Object.assign(U.value, {
          top: N,
          bottom: Q
        });
      }
    }, x = (c) => {
      Y.value = c, B();
    }, b = [], O = ["blue", "light-blue", "blue-cyan", "pink", "purple", "violet", "indigo", "cyan", "teal", "green", "light-green", "lime", "yellow", "amber", "orange", "grey", "sky-blue"], R = V(!1), k = () => {
      if (s.value) {
        const {
          $el: c
        } = s.value, C = c.querySelector(".xg-gantt-container"), E = c.querySelector(".xg-gantt-body"), N = C.offsetWidth, Q = E.offsetWidth;
        return N === Q;
      }
      return !1;
    }, v = new ResizeObserver(() => {
      s.value && s.value.$el.offsetWidth !== 0 && (R.value = k());
    });
    De(s, (c) => {
      if (c && c.$el) {
        const C = c.$el.querySelector(".xg-gantt-body");
        v.observe(C);
      }
    });
    const q = (t = ft()) == null ? void 0 : t.appContext.app;
    Ce(() => {
      (() => import("@ibiz-template-plugin/gantt"))().then((c) => {
        const C = c.default;
        q == null || q.use(C), n.value = !0;
      });
    });
    const G = (c) => {
      const C = document.documentElement;
      return getComputedStyle(C).getPropertyValue(c);
    }, {
      UIStore: M
    } = pt(), p = V({}), m = V({}), _ = () => {
      var c, C;
      return {
        primaryColor: ((c = e.state.ganttStyle) == null ? void 0 : c.primaryColor) || G("--ibiz-color-bg-0"),
        textColor: ((C = e.state.ganttStyle) == null ? void 0 : C.textColor) || G("--ibiz-color-text-2"),
        bgColor: G("--ibiz-color-bg-1"),
        weekendColor: G("--ibiz-color-fill-2"),
        todayColor: G("--ibiz-color-primary-light-active"),
        borderColor: G("--ibiz-color-border")
      };
    }, y = () => {
      var c;
      const C = {};
      return (c = e.model.detreeNodes) == null || c.forEach((E, N) => {
        const Q = N % O.length;
        C[E.id] = "rgba(".concat(G("--ibiz-".concat(O[Q], "-0")), ", 1)");
      }), C;
    };
    De(() => M.theme, () => {
      p.value = _(), m.value = y();
    }, {
      immediate: !0
    });
    const $ = () => {
      var c;
      let C = e.state.rootNodes;
      return e.model.rootVisible || (C = ((c = e.state.rootNodes[0]) == null ? void 0 : c._children) || []), C.map((E) => {
        const N = {};
        return Object.assign(N, E), N._children && (N._children = null), N;
      });
    }, L = X(() => e.state.isLoaded ? e.state.isLoading : !1), A = X(() => {
      var c, C;
      return e.state.onlyTopNodes ? $() : e.model.rootVisible ? e.state.rootNodes : (C = (c = e.state.rootNodes[0]) == null ? void 0 : c._children) == null ? void 0 : C.filter((E) => !d.value || E.name.includes(d.value));
    }), F = X(() => {
      const c = [];
      return e.state.columnStates.forEach((C) => {
        var E;
        const N = (E = e.columns[C.key]) == null ? void 0 : E.model;
        !C.hidden && N && c.push(N);
      }), c;
    }), H = X(() => ibiz.i18n.getLang().toLowerCase()), K = (c, C) => {
      if (c)
        b.push(C);
      else {
        const E = b.findIndex((N) => N._id === C._id);
        E > -1 && b.splice(E, 1);
      }
      e.setSelection(b);
    }, Z = (c, C) => {
      if (W || u.value) {
        u.value = !1;
        return;
      }
      e.onTreeNodeClick(c, C), W = !0, setTimeout(() => {
        W = !1;
      }, 200);
    }, se = (c) => {
      e.onDbTreeNodeClick(c);
    }, ie = (c) => {
      e.onExpandChange(c, !0), c && !c._children && e.refreshNodeChildren(c);
    }, le = (c) => {
      e.onExpandChange(c, !1);
    };
    e.evt.on("onNewRow", (c) => {
      if (o.value) {
        const C = c.row.data;
        o.value.setExpand(C);
      }
    });
    const ae = () => {
      var c;
      (c = o.value) == null || c.fullscreenChange();
    };
    e._evt.on("onFullscreenChange", (c) => {
      ae();
    });
    const J = (c) => {
      d.value = c;
    }, ne = (c) => {
      e.state.expandAll = c;
    }, de = (c) => {
      console.log("抛值内容", c);
    }, ue = (c) => {
      var C;
      const E = (C = c[0]) == null ? void 0 : C.row, N = {
        begin: E._beginDataItemValue ? w(E._beginDataItemValue).format("YYYY-MM-DD HH:mm:ss") : void 0,
        end: E._endDataItemValue ? w(E._endDataItemValue).format("YYYY-MM-DD HH:mm:ss") : void 0
      };
      u.value = !0, e._evt.emit("onSliderMove", E), e.modifyNodeTime(E, N);
    }, Se = (c, C, E, N) => {
      const Q = [];
      return c.forEach((j) => {
        var pe;
        if (j.itemType === "SEPERATOR") {
          Q.push({
            divided: "self"
          });
          return;
        }
        const he = N[j.id];
        if (he && !he.visible)
          return;
        const ee = {};
        if (j.showCaption && j.caption && (ee.label = j.caption), j.sysImage && j.showIcon && (ee.icon = l(P, {
          icon: j.sysImage
        }, null)), j.itemType === "DEUIACTION") {
          ee.disabled = he.disabled, ee.clickClose = !0;
          const {
            uiactionId: oe
          } = j;
          oe && (ee.onClick = () => {
            e.doUIAction(oe, C, E, j.appId);
          });
        } else if (j.itemType === "RAWITEM") {
          const {
            rawItem: oe
          } = j;
          oe && (ee.label = l(T, {
            rawItem: j
          }, null));
        } else
          j.itemType === "ITEMS" && (pe = j.detoolbarItems) != null && pe.length && (ee.children = Se(j.detoolbarItems, C, E, N));
        Q.push(ee);
      }), Q;
    };
    let Ie;
    e.evt.on("onMounted", () => {
      Object.values(e.contextMenus).length > 0 && (() => import("@imengyu/vue3-context-menu"))().then((c) => {
        Ie = kt(c);
      });
    });
    const Ue = async (c, C) => {
      C.stopPropagation(), C.preventDefault();
      const E = e.getNodeModel(c._nodeId);
      if (!(E != null && E.decontextMenu))
        return;
      const N = e.contextMenus[E.decontextMenu.id];
      if (!N.model.detoolbarItems)
        return;
      await N.calcButtonState(c._deData || (c.srfkey ? c : void 0), E.appDataEntityId);
      const Q = N.state.buttonsState, j = Se(N.model.detoolbarItems, c, C, Q);
      j.length && Ie.showContextMenu({
        x: C.x,
        y: C.y,
        customClass: i.b("context-menu"),
        items: j
      });
    }, Ke = () => {
      const {
        isLoaded: c
      } = e.state;
      return c && l(z("iBizNoData"), {
        text: e.model.emptyText,
        emptyTextLanguageRes: e.model.emptyTextLanguageRes
      }, null);
    }, Qe = (c, C) => {
      const {
        caption: E,
        codeName: N,
        width: Q,
        headerSysCss: j,
        align: pe
      } = c, he = e.columns[N];
      return l(z("x-gantt-column"), {
        label: E,
        prop: N,
        width: Q && Q > 30 ? Q : 30,
        center: (pe == null ? void 0 : pe.toLowerCase()) === "center"
      }, {
        title: (ee) => {
          const {
            label: oe
          } = ee;
          return N === "name" ? l(Ht, {
            key: N,
            model: c,
            controller: e,
            titleData: ee,
            expandAll: e.state.expandAll,
            class: j == null ? void 0 : j.cssName,
            onExpandAllChange: ne,
            onHeadSearch: J
          }, null) : l("div", {
            class: j == null ? void 0 : j.cssName
          }, [oe]);
        },
        default: (ee) => {
          const {
            row: oe,
            column: Ze,
            level: Xe
          } = ee, ce = e.getRowState(oe._id);
          if (ce) {
            if (N === "name") {
              const tt = $e(ce, e.state.capacityConfig);
              let Me;
              oe._parent && (Me = e.getRowState(oe._parent._id));
              const at = A.value && A.value[0] ? A.value[0]._id === ce.data._id : !1;
              return B(), l(Bt, {
                controller: he,
                gantt: e,
                capacityConfig: tt,
                dateRange: e.state.dateRange,
                groupConfig: e.state.groupConfig,
                row: ce,
                parentRow: Me,
                column: Ze,
                level: Xe,
                isTopFirstIndex: at,
                key: ce.data._uuid + N,
                ganttPosition: U.value,
                virtualTableVal: Y.value
              }, null);
            }
            const et = z(e.providers[N].component);
            return yt(et, {
              controller: he,
              row: ce,
              key: ce.data._uuid + N
            });
          }
          return null;
        }
      });
    }, Je = () => l(z("x-gantt-slider"), {
      "allow-link": !1,
      move: e.state.sliderDraggable,
      "resize-left": e.state.sliderDraggable,
      "resize-right": e.state.sliderDraggable,
      "move-by-unit": !0,
      "slider-limit": e.state.sliderLimit,
      "emit-move": f,
      "set-start": h,
      "set-end": g,
      "slider-left": I,
      "slider-width": S
    }, {
      content: ({
        row: c,
        level: C,
        left: E
      }) => {
        if (C !== 1) {
          const N = _e(e.state.sliderShowContent, c._deData || {}).replace(/^"(.*?)"$/, "$1"), Q = E < 0 ? "".concat(-E, "px") : "";
          return l("div", {
            class: [i.e("slider"), r.e("slider")],
            style: {
              background: m.value[c._nodeId]
            },
            onClick: (j) => Z(c, j),
            onDblclick: () => se(c),
            onContextmenu: (j) => Ue(c, j)
          }, [N && l("div", {
            class: r.em("slider", "caption"),
            style: {
              marginLeft: Q
            },
            title: N,
            innerHTML: N
          }, null)]);
        }
      }
    });
    return {
      c: e,
      ns: i,
      ns2: r,
      fullscreenChange: ae,
      ganttRef: o,
      ganttBoxRef: s,
      isInited: n,
      ganttId: D,
      data: A,
      locale: H,
      columns: F,
      onCheck: K,
      loading: L,
      ganttStyle: p,
      isGanttWidthEq: R,
      onNodeClick: Z,
      onNodeDbClick: se,
      onNodeExpand: ie,
      onNodeCollapse: le,
      renderContent: () => {
        const c = F.value.map((E, N) => Qe(E)), C = Je();
        return [...c, C];
      },
      renderGanttCell: (c) => {
        if (c.level === 1) {
          const C = e.getRowState(c.row._id) || {}, E = $e(C, e.state.capacityConfig);
          if (xe(c.column.date, E.weekdays)) {
            const N = {};
            return Object.assign(N, {
              ...c,
              row: C
            }), l(At, {
              cellData: N,
              showText: e.state.showCapacity,
              capacityConfig: E,
              onCellClick: de
            }, null);
          }
        }
      },
      renderGanttTitle: (c) => {
        const {
          column: C
        } = c, E = $t(C.date), N = Lt(C.date, "MM/DD");
        return l("div", {
          class: [i.b("column-title"), Et(C.date) ? i.be("column-title", "today") : ""]
        }, [l("div", {
          class: i.be("column-title", "top")
        }, [E]), l("div", {
          class: i.be("column-title", "bottom")
        }, [N])]);
      },
      onSliderMove: ue,
      renderNoData: Ke,
      onVirtualTableChange: x
    };
  },
  render() {
    var a;
    return this.isInited ? mt(l(z("iBizControlBase"), {
      ref: "ganttBoxRef",
      controller: this.c,
      class: [this.ns.b(), this.ns2.b(), (a = this.data) != null && a.length ? "" : this.ns.m("empty"), this.ns.is("gantt-width-eq", this.isGanttWidthEq)]
    }, {
      default: () => [l(z("x-gantt"), {
        ref: "ganttRef",
        id: this.ganttId,
        "data-id": "_id",
        data: this.data,
        "row-height": 46,
        "show-expand": !0,
        "expand-all": this.c.state.expandAll,
        "start-key": "_beginDataItemValue",
        "end-key": "_endDataItemValue",
        children: "_children",
        leaf: "_leaf",
        dateRange: this.c.state.dateRange,
        showWeekdays: this.c.state.showWeekdays,
        locale: this.locale,
        "header-height": 46,
        showCheckbox: !this.c.state.singleSelect,
        showToday: !1,
        showWeekend: !1,
        onNodeExpand: this.onNodeExpand,
        onNodeCollapse: this.onNodeCollapse,
        onRowClick: this.onNodeClick,
        onRowDblClick: this.onNodeDbClick,
        onRowChecked: this.onCheck,
        onMoveSlider: this.onSliderMove,
        onVirtualTableChange: this.onVirtualTableChange,
        primaryColor: this.ganttStyle.primaryColor,
        headerStyle: {
          textColor: this.ganttStyle.textColor
        },
        borderColor: this.ganttStyle.borderColor,
        bodyStyle: {
          todayColor: this.ganttStyle.todayColor,
          weekendColor: this.ganttStyle.weekendColor,
          bgColor: this.ganttStyle.bgColor,
          selectColor: this.ganttStyle.weekendColor
        }
      }, {
        default: () => this.renderContent(),
        ganttCell: (t) => this.renderGanttCell(t),
        ganttTitle: (t) => this.renderGanttTitle(t),
        empty: () => this.renderNoData()
      })]
    }), [[gt("loading"), this.loading]]) : null;
  }
});
class ta {
  constructor() {
    me(this, "component", "IBizResourceGanttControl");
  }
}
const aa = be(
  we,
  function(a) {
    a.component(we.name, we), nt(
      "TREE_RENDER_RESOURCE_GANTT",
      () => new ta()
    );
  }
), ca = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(a) {
    a.use(aa), a.use(Jt), a.use(Xt);
  }
};
export {
  aa as IBizResourceGanttControl,
  ca as default
};
