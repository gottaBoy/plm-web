import './assets/style.css';
import { registerEditorProvider as ae, CodeListEditorController as oe, OpenAppViewCommand as ue } from "@ibiz-template/runtime";
import { getSpanProps as de, useNamespace as ce, withInstall as le } from "@ibiz-template/vue3-util";
import { defineComponent as fe, ref as re, watch as he, onUnmounted as me, createVNode as R, createTextVNode as ne, resolveComponent as pe } from "vue";
import { isArray as ge } from "qx-util";
import { isUndefined as ve } from "lodash-es";
import { RuntimeModelError as we } from "@ibiz-template/core";
var ye = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Me(p) {
  return p && p.__esModule && Object.prototype.hasOwnProperty.call(p, "default") ? p.default : p;
}
var se = { exports: {} };
(function(p, m) {
  (function(s, b) {
    p.exports = b();
  })(ye, function() {
    var s = 1e3, b = 6e4, x = 36e5, g = "millisecond", O = "second", M = "minute", _ = "hour", y = "day", W = "week", T = "month", Q = "quarter", j = "year", U = "date", f = "Invalid Date", v = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, D = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, $ = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(u) {
      var n = ["th", "st", "nd", "rd"], t = u % 100;
      return "[" + u + (n[(t - 20) % 10] || n[t] || n[0]) + "]";
    } }, L = function(u, n, t) {
      var i = String(u);
      return !i || i.length >= n ? u : "" + Array(n + 1 - i.length).join(t) + u;
    }, H = { s: L, z: function(u) {
      var n = -u.utcOffset(), t = Math.abs(n), i = Math.floor(t / 60), r = t % 60;
      return (n <= 0 ? "+" : "-") + L(i, 2, "0") + ":" + L(r, 2, "0");
    }, m: function u(n, t) {
      if (n.date() < t.date())
        return -u(t, n);
      var i = 12 * (t.year() - n.year()) + (t.month() - n.month()), r = n.clone().add(i, T), d = t - r < 0, c = n.clone().add(i + (d ? -1 : 1), T);
      return +(-(i + (t - r) / (d ? r - c : c - r)) || 0);
    }, a: function(u) {
      return u < 0 ? Math.ceil(u) || 0 : Math.floor(u);
    }, p: function(u) {
      return { M: T, y: j, w: W, d: y, D: U, h: _, m: M, s: O, ms: g, Q }[u] || String(u || "").toLowerCase().replace(/s$/, "");
    }, u: function(u) {
      return u === void 0;
    } }, N = "en", I = {};
    I[N] = $;
    var e = "$isDayjsObject", l = function(u) {
      return u instanceof S || !(!u || !u[e]);
    }, h = function u(n, t, i) {
      var r;
      if (!n)
        return N;
      if (typeof n == "string") {
        var d = n.toLowerCase();
        I[d] && (r = d), t && (I[d] = t, r = d);
        var c = n.split("-");
        if (!r && c.length > 1)
          return u(c[0]);
      } else {
        var w = n.name;
        I[w] = n, r = w;
      }
      return !i && r && (N = r), r || !i && N;
    }, a = function(u, n) {
      if (l(u))
        return u.clone();
      var t = typeof n == "object" ? n : {};
      return t.date = u, t.args = arguments, new S(t);
    }, o = H;
    o.l = h, o.i = l, o.w = function(u, n) {
      return a(u, { locale: n.$L, utc: n.$u, x: n.$x, $offset: n.$offset });
    };
    var S = function() {
      function u(t) {
        this.$L = h(t.locale, null, !0), this.parse(t), this.$x = this.$x || t.x || {}, this[e] = !0;
      }
      var n = u.prototype;
      return n.parse = function(t) {
        this.$d = function(i) {
          var r = i.date, d = i.utc;
          if (r === null)
            return /* @__PURE__ */ new Date(NaN);
          if (o.u(r))
            return /* @__PURE__ */ new Date();
          if (r instanceof Date)
            return new Date(r);
          if (typeof r == "string" && !/Z$/i.test(r)) {
            var c = r.match(v);
            if (c) {
              var w = c[2] - 1 || 0, C = (c[7] || "0").substring(0, 3);
              return d ? new Date(Date.UTC(c[1], w, c[3] || 1, c[4] || 0, c[5] || 0, c[6] || 0, C)) : new Date(c[1], w, c[3] || 1, c[4] || 0, c[5] || 0, c[6] || 0, C);
            }
          }
          return new Date(r);
        }(t), this.init();
      }, n.init = function() {
        var t = this.$d;
        this.$y = t.getFullYear(), this.$M = t.getMonth(), this.$D = t.getDate(), this.$W = t.getDay(), this.$H = t.getHours(), this.$m = t.getMinutes(), this.$s = t.getSeconds(), this.$ms = t.getMilliseconds();
      }, n.$utils = function() {
        return o;
      }, n.isValid = function() {
        return this.$d.toString() !== f;
      }, n.isSame = function(t, i) {
        var r = a(t);
        return this.startOf(i) <= r && r <= this.endOf(i);
      }, n.isAfter = function(t, i) {
        return a(t) < this.startOf(i);
      }, n.isBefore = function(t, i) {
        return this.endOf(i) < a(t);
      }, n.$g = function(t, i, r) {
        return o.u(t) ? this[i] : this.set(r, t);
      }, n.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
      }, n.valueOf = function() {
        return this.$d.getTime();
      }, n.startOf = function(t, i) {
        var r = this, d = !!o.u(i) || i, c = o.p(t), w = function(z, E) {
          var P = o.w(r.$u ? Date.UTC(r.$y, E, z) : new Date(r.$y, E, z), r);
          return d ? P : P.endOf(y);
        }, C = function(z, E) {
          return o.w(r.toDate()[z].apply(r.toDate("s"), (d ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(E)), r);
        }, Y = this.$W, F = this.$M, k = this.$D, J = "set" + (this.$u ? "UTC" : "");
        switch (c) {
          case j:
            return d ? w(1, 0) : w(31, 11);
          case T:
            return d ? w(1, F) : w(0, F + 1);
          case W:
            var V = this.$locale().weekStart || 0, Z = (Y < V ? Y + 7 : Y) - V;
            return w(d ? k - Z : k + (6 - Z), F);
          case y:
          case U:
            return C(J + "Hours", 0);
          case _:
            return C(J + "Minutes", 1);
          case M:
            return C(J + "Seconds", 2);
          case O:
            return C(J + "Milliseconds", 3);
          default:
            return this.clone();
        }
      }, n.endOf = function(t) {
        return this.startOf(t, !1);
      }, n.$set = function(t, i) {
        var r, d = o.p(t), c = "set" + (this.$u ? "UTC" : ""), w = (r = {}, r[y] = c + "Date", r[U] = c + "Date", r[T] = c + "Month", r[j] = c + "FullYear", r[_] = c + "Hours", r[M] = c + "Minutes", r[O] = c + "Seconds", r[g] = c + "Milliseconds", r)[d], C = d === y ? this.$D + (i - this.$W) : i;
        if (d === T || d === j) {
          var Y = this.clone().set(U, 1);
          Y.$d[w](C), Y.init(), this.$d = Y.set(U, Math.min(this.$D, Y.daysInMonth())).$d;
        } else
          w && this.$d[w](C);
        return this.init(), this;
      }, n.set = function(t, i) {
        return this.clone().$set(t, i);
      }, n.get = function(t) {
        return this[o.p(t)]();
      }, n.add = function(t, i) {
        var r, d = this;
        t = Number(t);
        var c = o.p(i), w = function(F) {
          var k = a(d);
          return o.w(k.date(k.date() + Math.round(F * t)), d);
        };
        if (c === T)
          return this.set(T, this.$M + t);
        if (c === j)
          return this.set(j, this.$y + t);
        if (c === y)
          return w(1);
        if (c === W)
          return w(7);
        var C = (r = {}, r[M] = b, r[_] = x, r[O] = s, r)[c] || 1, Y = this.$d.getTime() + t * C;
        return o.w(Y, this);
      }, n.subtract = function(t, i) {
        return this.add(-1 * t, i);
      }, n.format = function(t) {
        var i = this, r = this.$locale();
        if (!this.isValid())
          return r.invalidDate || f;
        var d = t || "YYYY-MM-DDTHH:mm:ssZ", c = o.z(this), w = this.$H, C = this.$m, Y = this.$M, F = r.weekdays, k = r.months, J = r.meridiem, V = function(E, P, G, q) {
          return E && (E[P] || E(i, d)) || G[P].slice(0, q);
        }, Z = function(E) {
          return o.s(w % 12 || 12, E, "0");
        }, z = J || function(E, P, G) {
          var q = E < 12 ? "AM" : "PM";
          return G ? q.toLowerCase() : q;
        };
        return d.replace(D, function(E, P) {
          return P || function(G) {
            switch (G) {
              case "YY":
                return String(i.$y).slice(-2);
              case "YYYY":
                return o.s(i.$y, 4, "0");
              case "M":
                return Y + 1;
              case "MM":
                return o.s(Y + 1, 2, "0");
              case "MMM":
                return V(r.monthsShort, Y, k, 3);
              case "MMMM":
                return V(k, Y);
              case "D":
                return i.$D;
              case "DD":
                return o.s(i.$D, 2, "0");
              case "d":
                return String(i.$W);
              case "dd":
                return V(r.weekdaysMin, i.$W, F, 2);
              case "ddd":
                return V(r.weekdaysShort, i.$W, F, 3);
              case "dddd":
                return F[i.$W];
              case "H":
                return String(w);
              case "HH":
                return o.s(w, 2, "0");
              case "h":
                return Z(1);
              case "hh":
                return Z(2);
              case "a":
                return z(w, C, !0);
              case "A":
                return z(w, C, !1);
              case "m":
                return String(C);
              case "mm":
                return o.s(C, 2, "0");
              case "s":
                return String(i.$s);
              case "ss":
                return o.s(i.$s, 2, "0");
              case "SSS":
                return o.s(i.$ms, 3, "0");
              case "Z":
                return c;
            }
            return null;
          }(E) || c.replace(":", "");
        });
      }, n.utcOffset = function() {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, n.diff = function(t, i, r) {
        var d, c = this, w = o.p(i), C = a(t), Y = (C.utcOffset() - this.utcOffset()) * b, F = this - C, k = function() {
          return o.m(c, C);
        };
        switch (w) {
          case j:
            d = k() / 12;
            break;
          case T:
            d = k();
            break;
          case Q:
            d = k() / 3;
            break;
          case W:
            d = (F - Y) / 6048e5;
            break;
          case y:
            d = (F - Y) / 864e5;
            break;
          case _:
            d = F / x;
            break;
          case M:
            d = F / b;
            break;
          case O:
            d = F / s;
            break;
          default:
            d = F;
        }
        return r ? d : o.a(d);
      }, n.daysInMonth = function() {
        return this.endOf(T).$D;
      }, n.$locale = function() {
        return I[this.$L];
      }, n.locale = function(t, i) {
        if (!t)
          return this.$L;
        var r = this.clone(), d = h(t, i, !0);
        return d && (r.$L = d), r;
      }, n.clone = function() {
        return o.w(this.$d, this);
      }, n.toDate = function() {
        return new Date(this.valueOf());
      }, n.toJSON = function() {
        return this.isValid() ? this.toISOString() : null;
      }, n.toISOString = function() {
        return this.$d.toISOString();
      }, n.toString = function() {
        return this.$d.toUTCString();
      }, u;
    }(), A = S.prototype;
    return a.prototype = A, [["$ms", g], ["$s", O], ["$m", M], ["$H", _], ["$W", y], ["$M", T], ["$y", j], ["$D", U]].forEach(function(u) {
      A[u[1]] = function(n) {
        return this.$g(n, u[0], u[1]);
      };
    }), a.extend = function(u, n) {
      return u.$i || (u(n, S, a), u.$i = !0), a;
    }, a.locale = h, a.isDayjs = l, a.unix = function(u) {
      return a(1e3 * u);
    }, a.en = I[N], a.Ls = I, a.p = {}, a;
  });
})(se);
var $e = se.exports;
const K = /* @__PURE__ */ Me($e);
var De = Object.defineProperty, Se = (p, m, s) => m in p ? De(p, m, { enumerable: !0, configurable: !0, writable: !0, value: s }) : p[m] = s, B = (p, m, s) => (Se(p, typeof m != "symbol" ? m + "" : m, s), s);
const te = /* @__PURE__ */ fe({
  name: "IBizStageProgressBar",
  props: {
    ...de(),
    value: Array
  },
  setup(p) {
    const m = ce("stage-progress-bar"), s = p.controller, b = re("");
    let x = 0;
    const g = re([]), O = /* @__PURE__ */ new Map(), M = () => s.showMode === "operate" && g.value.length > 0 ? g.value[0][s.isOperateField] === 1 : !1, _ = (e) => {
      e.sort((l, h) => {
        const a = l[s.showConfig.sort] ? Number(l[s.showConfig.sort]) : -1, o = h[s.showConfig.sort] ? Number(h[s.showConfig.sort]) : -1;
        return a - o;
      });
    }, y = (e) => {
      const l = e.findIndex((h) => h[s.isCurrentField] === 1);
      e.forEach((h, a) => O.set(h.id, l !== -1 && l >= a));
    }, W = (e, l) => {
      const h = l[s.dateRange.startField], a = l[s.dateRange.endField], o = K(e);
      if (h && a) {
        const S = K(h), A = K(a);
        return !((o.isAfter(S, "day") || o.isSame(S, "day")) && (o.isBefore(A, "day") || o.isSame(A, "day")));
      }
      if (h) {
        const S = K(h);
        return !(o.isAfter(S, "day") || o.isSame(S, "day"));
      }
      if (a) {
        const S = K(a);
        return !(o.isBefore(S, "day") || o.isSame(S, "day"));
      }
      return !1;
    }, T = (e, l) => {
      var h;
      const a = (h = p.value) == null ? void 0 : h.findIndex((o) => o.id === l.id);
      p.value && !ve(a) && a !== -1 && Object.assign(p.value[a], {
        [s.dateShowConfig.fieldName]: e ? s.dateFormat(e, "YYYY-MM-DD HH:mm:ss") : null
      });
    }, Q = () => {
      if (s.showMode === "operate" && x <= 0) {
        x += 1;
        const e = g.value[1] || {};
        if (!M() && !b.value && p.value) {
          const l = e[s.dateShowConfig.fieldName] || s.dateFormat(/* @__PURE__ */ new Date(), "YYYY-MM-DD HH:mm:ss");
          W(l, e) || (b.value = l, T(b.value, e));
        }
      }
    };
    he(() => p.value, (e) => {
      e && ge(e) && (_(e), y(e), g.value = e, Q());
    }, {
      immediate: !0,
      deep: !0
    });
    const j = (e, l = -1) => e[s.isCurrentField] === 1 && l !== g.value.length - 1 ? {
      border: "2px solid ".concat(e[s.showConfig.color])
    } : {
      backgroundColor: e[s.showConfig.color],
      border: "none"
    }, U = (e) => e[s.isCurrentField] === 1 ? {
      borderBottom: "1px dashed ".concat(e[s.showConfig.color])
    } : {
      borderBottom: "1px solid ".concat(e[s.showConfig.color])
    }, f = (e, l, h) => {
      const a = e[s.showConfig.color];
      if (!O.get(e.id))
        return {};
      switch (l) {
        case "STATE":
          return s.showMode === "default" ? {
            backgroundColor: a
          } : {
            backgroundColor: "transparent",
            border: "1px solid ".concat(a),
            color: a
          };
        case "CENTER":
          return j(e, h);
        case "DATE":
          return s.showMode === "default" ? {
            color: a
          } : {};
        case "LINE":
          return U(e);
        default:
          return {};
      }
    }, v = async (e) => {
      if (e[s.isCurrentField] === 1 || s.showMode === "operate" || p.readonly)
        return;
      const l = g.value.findIndex((o) => o[s.isCurrentField] === 1), h = g.value[l], a = {
        [s.clickStageIdField]: e.id
      };
      h && Object.assign(a, {
        [s.releaseStageIdField]: h.id
      }), (await s.openLinkView(e, a)).ok && s.parent.form.load();
    }, D = (e, l) => {
      T(e, l);
    }, $ = [{
      text: "今天",
      value: () => /* @__PURE__ */ new Date()
    }, {
      text: "明天",
      value: () => {
        const e = /* @__PURE__ */ new Date();
        return e.setTime(e.getTime() + 3600 * 1e3 * 24), e;
      }
    }, {
      text: "下周",
      value: () => {
        const e = /* @__PURE__ */ new Date();
        return e.setTime(e.getTime() + 3600 * 1e3 * 24 * 7), e;
      }
    }], L = () => {
      const e = [], l = M() ? g.value[0] : g.value[1];
      return $.forEach((h, a) => {
        W(h.value(), l) && e.push("button-disable".concat(a + 1));
      }), e;
    }, H = (e) => {
      const l = e[s.dateShowConfig.fieldName];
      if (s.showMode === "default")
        return l ? s.dateFormat(l, s.dateShowConfig.format) : "";
      let h = [R("div", {
        class: m.be("date", "caption")
      }, [ne("日期")]), R("div", {
        class: m.be("date", "time")
      }, [l ? s.dateFormat(l, s.dateShowConfig.format) : ""])];
      return e[s.isOperateField] && (h = [R("div", {
        class: m.be("date", "caption")
      }, [ne("设置日期")]), R(pe("el-date-picker"), {
        modelValue: b.value,
        "onUpdate:modelValue": (a) => b.value = a,
        type: "date",
        class: m.be("date", "time"),
        "popper-class": [m.be("date", "popper"), ...L()],
        placeholder: s.placeHolder,
        shortcuts: $,
        disabled: p.readonly,
        "disabled-date": (a) => W(a, e),
        onChange: (a) => D(a, e)
      }, null)]), R("div", {
        class: [m.b("date")]
      }, [h]);
    }, N = (e, l) => R("div", {
      class: [m.e("item")]
    }, [R("div", {
      class: [m.em("item", "state")],
      style: f(e, "STATE"),
      onClick: () => v(e)
    }, [e[s.showConfig.typeName] || ""]), R("div", {
      class: [m.em("item", "center")],
      style: f(e, "CENTER", l)
    }, null), R("div", {
      class: [m.em("item", "date")],
      style: f(e, "DATE")
    }, [H(e)])]), I = () => g.value.map((e, l) => {
      const h = l < g.value.length - 1;
      return R("div", {
        class: [m.e("item-box")]
      }, [N(e, l), h && R("div", {
        class: [m.em("item-box", "line")],
        style: f(e, "LINE")
      }, null)]);
    });
    return me(() => {
      O.clear();
    }), {
      ns: m,
      c: s,
      items: g,
      renderContent: I,
      isLeftOperate: M
    };
  },
  render() {
    return R("div", {
      class: [this.ns.b(), this.readonly ? this.ns.e("readonly") : "", this.ns.e(this.c.showMode), this.isLeftOperate() ? this.ns.e("left-operate") : ""],
      ref: "editorRef"
    }, [R("div", {
      class: [this.ns.e("scroll")]
    }, [this.renderContent()])]);
  }
});
var be = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ce(p) {
  return p && p.__esModule && Object.prototype.hasOwnProperty.call(p, "default") ? p.default : p;
}
var ie = { exports: {} };
(function(p, m) {
  (function(s, b) {
    p.exports = b();
  })(be, function() {
    var s = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, b = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|YYYY|YY?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, x = /\d\d/, g = /\d\d?/, O = /\d*[^-_:/,()\s\d]+/, M = {}, _ = function(f) {
      return (f = +f) + (f > 68 ? 1900 : 2e3);
    }, y = function(f) {
      return function(v) {
        this[f] = +v;
      };
    }, W = [/[+-]\d\d:?(\d\d)?|Z/, function(f) {
      (this.zone || (this.zone = {})).offset = function(v) {
        if (!v || v === "Z")
          return 0;
        var D = v.match(/([+-]|\d\d)/g), $ = 60 * D[1] + (+D[2] || 0);
        return $ === 0 ? 0 : D[0] === "+" ? -$ : $;
      }(f);
    }], T = function(f) {
      var v = M[f];
      return v && (v.indexOf ? v : v.s.concat(v.f));
    }, Q = function(f, v) {
      var D, $ = M.meridiem;
      if ($) {
        for (var L = 1; L <= 24; L += 1)
          if (f.indexOf($(L, 0, v)) > -1) {
            D = L > 12;
            break;
          }
      } else
        D = f === (v ? "pm" : "PM");
      return D;
    }, j = { A: [O, function(f) {
      this.afternoon = Q(f, !1);
    }], a: [O, function(f) {
      this.afternoon = Q(f, !0);
    }], S: [/\d/, function(f) {
      this.milliseconds = 100 * +f;
    }], SS: [x, function(f) {
      this.milliseconds = 10 * +f;
    }], SSS: [/\d{3}/, function(f) {
      this.milliseconds = +f;
    }], s: [g, y("seconds")], ss: [g, y("seconds")], m: [g, y("minutes")], mm: [g, y("minutes")], H: [g, y("hours")], h: [g, y("hours")], HH: [g, y("hours")], hh: [g, y("hours")], D: [g, y("day")], DD: [x, y("day")], Do: [O, function(f) {
      var v = M.ordinal, D = f.match(/\d+/);
      if (this.day = D[0], v)
        for (var $ = 1; $ <= 31; $ += 1)
          v($).replace(/\[|\]/g, "") === f && (this.day = $);
    }], M: [g, y("month")], MM: [x, y("month")], MMM: [O, function(f) {
      var v = T("months"), D = (T("monthsShort") || v.map(function($) {
        return $.slice(0, 3);
      })).indexOf(f) + 1;
      if (D < 1)
        throw new Error();
      this.month = D % 12 || D;
    }], MMMM: [O, function(f) {
      var v = T("months").indexOf(f) + 1;
      if (v < 1)
        throw new Error();
      this.month = v % 12 || v;
    }], Y: [/[+-]?\d+/, y("year")], YY: [x, function(f) {
      this.year = _(f);
    }], YYYY: [/\d{4}/, y("year")], Z: W, ZZ: W };
    function U(f) {
      var v, D;
      v = f, D = M && M.formats;
      for (var $ = (f = v.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(h, a, o) {
        var S = o && o.toUpperCase();
        return a || D[o] || s[o] || D[S].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(A, u, n) {
          return u || n.slice(1);
        });
      })).match(b), L = $.length, H = 0; H < L; H += 1) {
        var N = $[H], I = j[N], e = I && I[0], l = I && I[1];
        $[H] = l ? { regex: e, parser: l } : N.replace(/^\[|\]$/g, "");
      }
      return function(h) {
        for (var a = {}, o = 0, S = 0; o < L; o += 1) {
          var A = $[o];
          if (typeof A == "string")
            S += A.length;
          else {
            var u = A.regex, n = A.parser, t = h.slice(S), i = u.exec(t)[0];
            n.call(a, i), h = h.replace(i, "");
          }
        }
        return function(r) {
          var d = r.afternoon;
          if (d !== void 0) {
            var c = r.hours;
            d ? c < 12 && (r.hours += 12) : c === 12 && (r.hours = 0), delete r.afternoon;
          }
        }(a), a;
      };
    }
    return function(f, v, D) {
      D.p.customParseFormat = !0, f && f.parseTwoDigitYear && (_ = f.parseTwoDigitYear);
      var $ = v.prototype, L = $.parse;
      $.parse = function(H) {
        var N = H.date, I = H.utc, e = H.args;
        this.$u = I;
        var l = e[1];
        if (typeof l == "string") {
          var h = e[2] === !0, a = e[3] === !0, o = h || a, S = e[2];
          a && (S = e[2]), M = this.$locale(), !h && S && (M = D.Ls[S]), this.$d = function(t, i, r) {
            try {
              if (["x", "X"].indexOf(i) > -1)
                return new Date((i === "X" ? 1e3 : 1) * t);
              var d = U(i)(t), c = d.year, w = d.month, C = d.day, Y = d.hours, F = d.minutes, k = d.seconds, J = d.milliseconds, V = d.zone, Z = /* @__PURE__ */ new Date(), z = C || (c || w ? 1 : Z.getDate()), E = c || Z.getFullYear(), P = 0;
              c && !w || (P = w > 0 ? w - 1 : Z.getMonth());
              var G = Y || 0, q = F || 0, X = k || 0, ee = J || 0;
              return V ? new Date(Date.UTC(E, P, z, G, q, X, ee + 60 * V.offset * 1e3)) : r ? new Date(Date.UTC(E, P, z, G, q, X, ee)) : new Date(E, P, z, G, q, X, ee);
            } catch (Ie) {
              return /* @__PURE__ */ new Date("");
            }
          }(N, l, I), this.init(), S && S !== !0 && (this.$L = this.locale(S).$L), o && N != this.format(l) && (this.$d = /* @__PURE__ */ new Date("")), M = {};
        } else if (l instanceof Array)
          for (var A = l.length, u = 1; u <= A; u += 1) {
            e[1] = l[u - 1];
            var n = D.apply(this, e);
            if (n.isValid()) {
              this.$d = n.$d, this.$L = n.$L, this.init();
              break;
            }
            u === A && (this.$d = /* @__PURE__ */ new Date(""));
          }
        else
          L.call(this, H);
      };
    };
  });
})(ie);
var Oe = ie.exports;
const Ye = /* @__PURE__ */ Ce(Oe);
K.extend(Ye);
class Te extends oe {
  constructor() {
    super(...arguments), B(this, "valueItem", ""), B(this, "releaseStageIdField", "release_stage"), B(this, "clickStageIdField", "click_stage"), B(this, "isCurrentField", "is_current"), B(this, "isOperateField", "target"), B(this, "showConfig", {
      sort: "p_sequence",
      typeName: "pname",
      color: "p_color"
    }), B(this, "dateShowConfig", {
      fieldName: "operated_time",
      format: "YYYY年MM月DD日"
    }), B(this, "dateRange", {
      startField: "",
      endField: ""
    }), B(this, "showMode", "default"), B(this, "codeList");
  }
  async onInit() {
    var m, s;
    super.onInit(), (s = (m = this.model) == null ? void 0 : m.editorItems) != null && s[0] && (this.valueItem = this.model.editorItems[0].id), this.initEditorParams();
  }
  /**
   * 初始化编辑器参数
   */
  initEditorParams() {
    const {
      RELEASESTAGEIDFIELD: m,
      CLICKSTAGEIDFIELD: s,
      DATESHOWCONFIG: b,
      ISCURRENTFIELD: x,
      ISOPERATEFIELD: g,
      SHOWCONFIG: O,
      DATERANGE: M,
      SHOWMODE: _
    } = this.editorParams;
    if (m && (this.releaseStageIdField = m), s && (this.clickStageIdField = s), x && (this.isCurrentField = x), g && (this.isOperateField = g), _ && (this.showMode = _), b)
      try {
        this.dateShowConfig = JSON.parse(b);
      } catch (y) {
        this.dateShowConfig = {};
      }
    if (O)
      try {
        this.showConfig = JSON.parse(O);
      } catch (y) {
        this.showConfig = {};
      }
    if (M)
      try {
        this.dateRange = JSON.parse(M);
      } catch (y) {
        this.dateRange = {};
      }
  }
  /**
   * 打开数据链接视图
   */
  async openLinkView(m, s) {
    const b = this.context.clone();
    m[this.valueItem] && (b.srfkey = m[this.valueItem]);
    const { context: x, params: g } = this.handlePublicParams(
      m,
      b,
      this.params
    ), { linkAppViewId: O } = this.model;
    if (!O)
      throw new we(
        this.model,
        ibiz.i18n.t("editor.common.linkViewConfigErr")
      );
    const M = {};
    return Object.assign(M, g), Object.assign(M, s), ibiz.commands.execute(
      ue.TAG,
      O,
      x,
      M
    );
  }
  /**
   * 日期格式化
   */
  dateFormat(m, s) {
    return K(m).format(s);
  }
}
class Fe {
  constructor() {
    B(this, "formEditor", "IBizStageProgressBar"), B(this, "gridEditor", "IBizStageProgressBar");
  }
  async createController(m, s) {
    const b = new Te(m, s);
    return await b.init(), b;
  }
}
const Ee = le(
  te,
  function(p) {
    p.component(te.name, te), ae(
      "EDITOR_CUSTOMSTYLE_STAGE_PROGRESS_BAR",
      () => new Fe()
    );
  }
), Ne = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(p) {
    p.use(Ee);
  }
};
export {
  Ee as IBizStageProgressBar,
  Ne as default
};
