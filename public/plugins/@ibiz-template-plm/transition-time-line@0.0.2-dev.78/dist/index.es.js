import './assets/style.css';
import './assets/style.css';
import { registerControlProvider as nt, CalendarController as rt } from "@ibiz-template/runtime";
import { withInstall as st, useControlController as it, useNamespace as at } from "@ibiz-template/vue3-util";
import { defineComponent as ot, ref as ut, watch as ct, createVNode as _, resolveComponent as F, isVNode as lt, createTextVNode as dt } from "vue";
var ht = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ft(u) {
  return u && u.__esModule && Object.prototype.hasOwnProperty.call(u, "default") ? u.default : u;
}
var Q = { exports: {} };
(function(u, d) {
  (function(h, m) {
    u.exports = m();
  })(ht, function() {
    var h = 1e3, m = 6e4, p = 36e5, b = "millisecond", o = "second", v = "minute", O = "hour", g = "day", T = "week", D = "month", j = "quarter", w = "year", Y = "date", V = "Invalid Date", K = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, X = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, tt = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(s) {
      var n = ["th", "st", "nd", "rd"], t = s % 100;
      return "[" + s + (n[(t - 20) % 10] || n[t] || n[0]) + "]";
    } }, R = function(s, n, t) {
      var r = String(s);
      return !r || r.length >= n ? s : "" + Array(n + 1 - r.length).join(t) + s;
    }, et = { s: R, z: function(s) {
      var n = -s.utcOffset(), t = Math.abs(n), r = Math.floor(t / 60), e = t % 60;
      return (n <= 0 ? "+" : "-") + R(r, 2, "0") + ":" + R(e, 2, "0");
    }, m: function s(n, t) {
      if (n.date() < t.date())
        return -s(t, n);
      var r = 12 * (t.year() - n.year()) + (t.month() - n.month()), e = n.clone().add(r, D), i = t - e < 0, a = n.clone().add(r + (i ? -1 : 1), D);
      return +(-(r + (t - e) / (i ? e - a : a - e)) || 0);
    }, a: function(s) {
      return s < 0 ? Math.ceil(s) || 0 : Math.floor(s);
    }, p: function(s) {
      return { M: D, y: w, w: T, d: g, D: Y, h: O, m: v, s: o, ms: b, Q: j }[s] || String(s || "").toLowerCase().replace(/s$/, "");
    }, u: function(s) {
      return s === void 0;
    } }, P = "en", L = {};
    L[P] = tt;
    var J = "$isDayjsObject", E = function(s) {
      return s instanceof B || !(!s || !s[J]);
    }, A = function s(n, t, r) {
      var e;
      if (!n)
        return P;
      if (typeof n == "string") {
        var i = n.toLowerCase();
        L[i] && (e = i), t && (L[i] = t, e = i);
        var a = n.split("-");
        if (!e && a.length > 1)
          return s(a[0]);
      } else {
        var l = n.name;
        L[l] = n, e = l;
      }
      return !r && e && (P = e), e || !r && P;
    }, $ = function(s, n) {
      if (E(s))
        return s.clone();
      var t = typeof n == "object" ? n : {};
      return t.date = s, t.args = arguments, new B(t);
    }, c = et;
    c.l = A, c.i = E, c.w = function(s, n) {
      return $(s, { locale: n.$L, utc: n.$u, x: n.$x, $offset: n.$offset });
    };
    var B = function() {
      function s(t) {
        this.$L = A(t.locale, null, !0), this.parse(t), this.$x = this.$x || t.x || {}, this[J] = !0;
      }
      var n = s.prototype;
      return n.parse = function(t) {
        this.$d = function(r) {
          var e = r.date, i = r.utc;
          if (e === null)
            return /* @__PURE__ */ new Date(NaN);
          if (c.u(e))
            return /* @__PURE__ */ new Date();
          if (e instanceof Date)
            return new Date(e);
          if (typeof e == "string" && !/Z$/i.test(e)) {
            var a = e.match(K);
            if (a) {
              var l = a[2] - 1 || 0, f = (a[7] || "0").substring(0, 3);
              return i ? new Date(Date.UTC(a[1], l, a[3] || 1, a[4] || 0, a[5] || 0, a[6] || 0, f)) : new Date(a[1], l, a[3] || 1, a[4] || 0, a[5] || 0, a[6] || 0, f);
            }
          }
          return new Date(e);
        }(t), this.init();
      }, n.init = function() {
        var t = this.$d;
        this.$y = t.getFullYear(), this.$M = t.getMonth(), this.$D = t.getDate(), this.$W = t.getDay(), this.$H = t.getHours(), this.$m = t.getMinutes(), this.$s = t.getSeconds(), this.$ms = t.getMilliseconds();
      }, n.$utils = function() {
        return c;
      }, n.isValid = function() {
        return this.$d.toString() !== V;
      }, n.isSame = function(t, r) {
        var e = $(t);
        return this.startOf(r) <= e && e <= this.endOf(r);
      }, n.isAfter = function(t, r) {
        return $(t) < this.startOf(r);
      }, n.isBefore = function(t, r) {
        return this.endOf(r) < $(t);
      }, n.$g = function(t, r, e) {
        return c.u(t) ? this[r] : this.set(e, t);
      }, n.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
      }, n.valueOf = function() {
        return this.$d.getTime();
      }, n.startOf = function(t, r) {
        var e = this, i = !!c.u(r) || r, a = c.p(t), l = function(I, S) {
          var k = c.w(e.$u ? Date.UTC(e.$y, S, I) : new Date(e.$y, S, I), e);
          return i ? k : k.endOf(g);
        }, f = function(I, S) {
          return c.w(e.toDate()[I].apply(e.toDate("s"), (i ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(S)), e);
        }, y = this.$W, M = this.$M, C = this.$D, N = "set" + (this.$u ? "UTC" : "");
        switch (a) {
          case w:
            return i ? l(1, 0) : l(31, 11);
          case D:
            return i ? l(1, M) : l(0, M + 1);
          case T:
            var x = this.$locale().weekStart || 0, H = (y < x ? y + 7 : y) - x;
            return l(i ? C - H : C + (6 - H), M);
          case g:
          case Y:
            return f(N + "Hours", 0);
          case O:
            return f(N + "Minutes", 1);
          case v:
            return f(N + "Seconds", 2);
          case o:
            return f(N + "Milliseconds", 3);
          default:
            return this.clone();
        }
      }, n.endOf = function(t) {
        return this.startOf(t, !1);
      }, n.$set = function(t, r) {
        var e, i = c.p(t), a = "set" + (this.$u ? "UTC" : ""), l = (e = {}, e[g] = a + "Date", e[Y] = a + "Date", e[D] = a + "Month", e[w] = a + "FullYear", e[O] = a + "Hours", e[v] = a + "Minutes", e[o] = a + "Seconds", e[b] = a + "Milliseconds", e)[i], f = i === g ? this.$D + (r - this.$W) : r;
        if (i === D || i === w) {
          var y = this.clone().set(Y, 1);
          y.$d[l](f), y.init(), this.$d = y.set(Y, Math.min(this.$D, y.daysInMonth())).$d;
        } else
          l && this.$d[l](f);
        return this.init(), this;
      }, n.set = function(t, r) {
        return this.clone().$set(t, r);
      }, n.get = function(t) {
        return this[c.p(t)]();
      }, n.add = function(t, r) {
        var e, i = this;
        t = Number(t);
        var a = c.p(r), l = function(M) {
          var C = $(i);
          return c.w(C.date(C.date() + Math.round(M * t)), i);
        };
        if (a === D)
          return this.set(D, this.$M + t);
        if (a === w)
          return this.set(w, this.$y + t);
        if (a === g)
          return l(1);
        if (a === T)
          return l(7);
        var f = (e = {}, e[v] = m, e[O] = p, e[o] = h, e)[a] || 1, y = this.$d.getTime() + t * f;
        return c.w(y, this);
      }, n.subtract = function(t, r) {
        return this.add(-1 * t, r);
      }, n.format = function(t) {
        var r = this, e = this.$locale();
        if (!this.isValid())
          return e.invalidDate || V;
        var i = t || "YYYY-MM-DDTHH:mm:ssZ", a = c.z(this), l = this.$H, f = this.$m, y = this.$M, M = e.weekdays, C = e.months, N = e.meridiem, x = function(S, k, z, W) {
          return S && (S[k] || S(r, i)) || z[k].slice(0, W);
        }, H = function(S) {
          return c.s(l % 12 || 12, S, "0");
        }, I = N || function(S, k, z) {
          var W = S < 12 ? "AM" : "PM";
          return z ? W.toLowerCase() : W;
        };
        return i.replace(X, function(S, k) {
          return k || function(z) {
            switch (z) {
              case "YY":
                return String(r.$y).slice(-2);
              case "YYYY":
                return c.s(r.$y, 4, "0");
              case "M":
                return y + 1;
              case "MM":
                return c.s(y + 1, 2, "0");
              case "MMM":
                return x(e.monthsShort, y, C, 3);
              case "MMMM":
                return x(C, y);
              case "D":
                return r.$D;
              case "DD":
                return c.s(r.$D, 2, "0");
              case "d":
                return String(r.$W);
              case "dd":
                return x(e.weekdaysMin, r.$W, M, 2);
              case "ddd":
                return x(e.weekdaysShort, r.$W, M, 3);
              case "dddd":
                return M[r.$W];
              case "H":
                return String(l);
              case "HH":
                return c.s(l, 2, "0");
              case "h":
                return H(1);
              case "hh":
                return H(2);
              case "a":
                return I(l, f, !0);
              case "A":
                return I(l, f, !1);
              case "m":
                return String(f);
              case "mm":
                return c.s(f, 2, "0");
              case "s":
                return String(r.$s);
              case "ss":
                return c.s(r.$s, 2, "0");
              case "SSS":
                return c.s(r.$ms, 3, "0");
              case "Z":
                return a;
            }
            return null;
          }(S) || a.replace(":", "");
        });
      }, n.utcOffset = function() {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, n.diff = function(t, r, e) {
        var i, a = this, l = c.p(r), f = $(t), y = (f.utcOffset() - this.utcOffset()) * m, M = this - f, C = function() {
          return c.m(a, f);
        };
        switch (l) {
          case w:
            i = C() / 12;
            break;
          case D:
            i = C();
            break;
          case j:
            i = C() / 3;
            break;
          case T:
            i = (M - y) / 6048e5;
            break;
          case g:
            i = (M - y) / 864e5;
            break;
          case O:
            i = M / p;
            break;
          case v:
            i = M / m;
            break;
          case o:
            i = M / h;
            break;
          default:
            i = M;
        }
        return e ? i : c.a(i);
      }, n.daysInMonth = function() {
        return this.endOf(D).$D;
      }, n.$locale = function() {
        return L[this.$L];
      }, n.locale = function(t, r) {
        if (!t)
          return this.$L;
        var e = this.clone(), i = A(t, r, !0);
        return i && (e.$L = i), e;
      }, n.clone = function() {
        return c.w(this.$d, this);
      }, n.toDate = function() {
        return new Date(this.valueOf());
      }, n.toJSON = function() {
        return this.isValid() ? this.toISOString() : null;
      }, n.toISOString = function() {
        return this.$d.toISOString();
      }, n.toString = function() {
        return this.$d.toUTCString();
      }, s;
    }(), Z = B.prototype;
    return $.prototype = Z, [["$ms", b], ["$s", o], ["$m", v], ["$H", O], ["$W", g], ["$M", D], ["$y", w], ["$D", Y]].forEach(function(s) {
      Z[s[1]] = function(n) {
        return this.$g(n, s[0], s[1]);
      };
    }), $.extend = function(s, n) {
      return s.$i || (s(n, B, $), s.$i = !0), $;
    }, $.locale = A, $.isDayjs = E, $.unix = function(s) {
      return $(1e3 * s);
    }, $.en = L[P], $.Ls = L, $.p = {}, $;
  });
})(Q);
var mt = Q.exports;
const q = /* @__PURE__ */ ft(mt);
var pt = Object.defineProperty, $t = (u, d, h) => d in u ? pt(u, d, { enumerable: !0, configurable: !0, writable: !0, value: h }) : u[d] = h, G = (u, d, h) => ($t(u, typeof d != "symbol" ? d + "" : d, h), h);
class yt extends rt {
  constructor() {
    super(...arguments), G(this, "tempMinorSortDir", "asc");
  }
  /**
   * 日历加载
   *
   * @author ljx
   * @date 2024-02-19 01:08:24
   * @param {MDCtrlLoadParams} [args={}]
   * @return {*}  {Promise<IData[][]>}
   * @memberof CalendarController
   */
  async load(d = {}) {
    const h = d.isInitialLoad === !0, { context: m } = this.handlerAbilityParams(d), p = await this.getFetchParams(d == null ? void 0 : d.viewParam);
    await this.startLoading();
    let b;
    try {
      b = await this.service.search(m, p);
    } finally {
      await this.endLoading();
    }
    return await this.afterLoad(d, b), this.state.isLoaded = !0, this.state.items = b, await this.evt.emit("onLoadSuccess", {
      isInitialLoad: h
    }), b;
  }
  /**
   * 获取请求参数
   *
   * @author zk
   * @date 2023-08-09 11:08:35
   * @param {IParams} [extraParams={}]
   * @return {*}  {Promise<IParams>}
   * @memberof CalendarController
   */
  async getFetchParams(d = {}) {
    const { curPage: h, size: m, sortQuery: p, noSort: b } = this.state, o = {
      ...this.params
    };
    if (!b && p && (o.sort = p), o.sort || (o.sort = "update_time,".concat(this.tempMinorSortDir)), await this._evt.emit("onBeforeLoad", void 0), Object.assign(o, {
      ...this.state.searchParams
    }), m && (o.page = h - 1, o.size = m), d && Object.assign(o, d), this.model.calendarStyle !== "TIMELINE") {
      const v = this.getCurSelectDate(o);
      Object.assign(o, v);
    }
    return o;
  }
  /**
   * 设置排序
   * 无参数时设置的是默认排序。
   *
   * @author lxm
   * @date 2022-09-28 13:09:44
   * @param {string} key 排序字段
   * @param {string} order 排序顺序
   */
  setSort(d, h) {
    super.setSort(d, h);
    const { minorSortDir: m } = this.getSortModel();
    m && (this.tempMinorSortDir = m == null ? void 0 : m.toLowerCase());
  }
}
function vt(u) {
  return typeof u == "function" || Object.prototype.toString.call(u) === "[object Object]" && !lt(u);
}
const U = /* @__PURE__ */ ot({
  name: "IBizTransitionTimeLine",
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
    loadDefault: {
      type: Boolean,
      default: !0
    }
  },
  setup() {
    const u = it((...p) => new yt(...p)), d = at("transition-time-line"), h = ut(), m = (p) => {
      h.value && h.value.selectDate(p);
    };
    return ct(() => u.state.selectedDate, (p, b) => {
      const o = q(p).format("YYYY-MM"), v = q(b).format("YYYY-MM");
      o !== v && u.load();
    }), {
      c: u,
      ns: d,
      calendarRef: h,
      selectDate: m,
      calcItemStyle: (p) => ({
        color: p.color,
        backgroundColor: p.bkColor
      }),
      calcCurrent: () => {
        switch (u.tempMinorSortDir) {
          case "asc":
            return u.state.items.length - 1;
          default:
            return 0;
        }
      }
    };
  },
  render() {
    let u;
    const d = (o, v) => {
      const {
        context: O,
        params: g
      } = this.c, T = this.c.state.selectedData.findIndex((w) => w.deData.srfkey === o.deData.srfkey), D = [this.ns.b("item"), this.ns.is("active", T !== -1)], j = this.calcItemStyle(o);
      return _(F("iBizControlShell"), {
        class: D,
        data: o.deData,
        modelData: v,
        context: O,
        params: g,
        style: j,
        onClick: (w) => (w.stopPropagation(), this.c.onRowClick(o)),
        onDblclick: (w) => (w.stopPropagation(), this.c.onDbRowClick(o))
      }, null);
    }, h = (o) => {
      const v = this.c.state.selectedData.findIndex((T) => T.deData.srfkey === o.deData.srfkey), O = [this.ns.b("item"), this.ns.is("active", v !== -1)], g = this.calcItemStyle(o);
      return _("div", {
        class: O,
        key: o.deData.srfkey,
        style: g,
        onClick: () => this.c.onRowClick(o),
        onDblclick: () => this.c.onDbRowClick(o)
      }, [o.text]);
    }, m = () => {
      const {
        isLoaded: o
      } = this.c.state;
      return o && _(F("iBizNoData"), {
        text: this.c.model.emptyText,
        emptyTextLanguageRes: this.c.model.emptyTextLanguageRes
      }, null);
    }, p = () => _("div", {
      class: this.ns.b("timeline-content")
    }, [this.c.state.items.length > 0 ? this.c.state.items.map((o, v) => {
      var O;
      const g = (O = this.c.model.sysCalendarItems) == null ? void 0 : O.find((j) => o.itemType === j.itemType);
      let T;
      const D = this.calcCurrent();
      return v === D && (T = _("div", {
        class: this.ns.be("timeline-content", "current")
      }, [dt("当前")])), g != null && g.layoutPanel ? _("div", {
        class: [this.ns.be("timeline-content", "item-box"), v === D ? "is-current" : ""]
      }, [T, d(o, g.layoutPanel)]) : h(o);
    }) : m()]), b = () => _("div", {
      class: this.ns.b()
    }, [p()]);
    return _(F("iBizControlBase"), {
      controller: this.c
    }, vt(u = b()) ? u : {
      default: () => [u]
    });
  }
});
class gt {
  constructor() {
    G(this, "component", "IBizTransitionTimeLine");
  }
}
const Dt = st(
  U,
  (u) => {
    u.component(U.name, U), nt(
      "CUSTOM_TRANSITION_TIME_LINE",
      () => new gt()
    );
  }
), St = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(u) {
    u.use(Dt);
  }
};
export {
  Dt as IBizTransitionTimeLine,
  St as default
};
