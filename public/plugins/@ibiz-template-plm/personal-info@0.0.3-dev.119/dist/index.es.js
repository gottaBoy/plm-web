import './assets/style.css';
import { registerEditorProvider as ot, CodeListEditorController as ut, OpenAppViewCommand as ct } from "@ibiz-template/runtime";
import { getSpanProps as lt, useNamespace as dt, useFocusAndBlur as ft, withInstall as ht } from "@ibiz-template/vue3-util";
import { defineComponent as mt, ref as nt, watch as rt, computed as st, createVNode as K } from "vue";
import { isNil as pt } from "ramda";
import { DataTypes as vt, RuntimeModelError as $t, RuntimeError as gt } from "@ibiz-template/core";
var Mt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function yt(f) {
  return f && f.__esModule && Object.prototype.hasOwnProperty.call(f, "default") ? f.default : f;
}
var it = { exports: {} };
(function(f, y) {
  (function(v, M) {
    f.exports = M();
  })(Mt, function() {
    var v = 1e3, M = 6e4, h = 36e5, S = "millisecond", F = "second", Y = "minute", _ = "hour", A = "day", R = "week", N = "month", X = "quarter", j = "year", Z = "date", d = "Invalid Date", m = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, b = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, w = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(a) {
      var r = ["th", "st", "nd", "rd"], t = a % 100;
      return "[" + a + (r[(t - 20) % 10] || r[t] || r[0]) + "]";
    } }, E = function(a, r, t) {
      var s = String(a);
      return !s || s.length >= r ? a : "" + Array(r + 1 - s.length).join(t) + a;
    }, n = { s: E, z: function(a) {
      var r = -a.utcOffset(), t = Math.abs(r), s = Math.floor(t / 60), e = t % 60;
      return (r <= 0 ? "+" : "-") + E(s, 2, "0") + ":" + E(e, 2, "0");
    }, m: function a(r, t) {
      if (r.date() < t.date())
        return -a(t, r);
      var s = 12 * (t.year() - r.year()) + (t.month() - r.month()), e = r.clone().add(s, N), o = t - e < 0, u = r.clone().add(s + (o ? -1 : 1), N);
      return +(-(s + (t - e) / (o ? e - u : u - e)) || 0);
    }, a: function(a) {
      return a < 0 ? Math.ceil(a) || 0 : Math.floor(a);
    }, p: function(a) {
      return { M: N, y: j, w: R, d: A, D: Z, h: _, m: Y, s: F, ms: S, Q: X }[a] || String(a || "").toLowerCase().replace(/s$/, "");
    }, u: function(a) {
      return a === void 0;
    } }, l = "en", $ = {};
    $[l] = w;
    var c = "$isDayjsObject", D = function(a) {
      return a instanceof x || !(!a || !a[c]);
    }, T = function a(r, t, s) {
      var e;
      if (!r)
        return l;
      if (typeof r == "string") {
        var o = r.toLowerCase();
        $[o] && (e = o), t && ($[o] = t, e = o);
        var u = r.split("-");
        if (!e && u.length > 1)
          return a(u[0]);
      } else {
        var g = r.name;
        $[g] = r, e = g;
      }
      return !s && e && (l = e), e || !s && l;
    }, p = function(a, r) {
      if (D(a))
        return a.clone();
      var t = typeof r == "object" ? r : {};
      return t.date = a, t.args = arguments, new x(t);
    }, i = n;
    i.l = T, i.i = D, i.w = function(a, r) {
      return p(a, { locale: r.$L, utc: r.$u, x: r.$x, $offset: r.$offset });
    };
    var x = function() {
      function a(t) {
        this.$L = T(t.locale, null, !0), this.parse(t), this.$x = this.$x || t.x || {}, this[c] = !0;
      }
      var r = a.prototype;
      return r.parse = function(t) {
        this.$d = function(s) {
          var e = s.date, o = s.utc;
          if (e === null)
            return /* @__PURE__ */ new Date(NaN);
          if (i.u(e))
            return /* @__PURE__ */ new Date();
          if (e instanceof Date)
            return new Date(e);
          if (typeof e == "string" && !/Z$/i.test(e)) {
            var u = e.match(m);
            if (u) {
              var g = u[2] - 1 || 0, O = (u[7] || "0").substring(0, 3);
              return o ? new Date(Date.UTC(u[1], g, u[3] || 1, u[4] || 0, u[5] || 0, u[6] || 0, O)) : new Date(u[1], g, u[3] || 1, u[4] || 0, u[5] || 0, u[6] || 0, O);
            }
          }
          return new Date(e);
        }(t), this.init();
      }, r.init = function() {
        var t = this.$d;
        this.$y = t.getFullYear(), this.$M = t.getMonth(), this.$D = t.getDate(), this.$W = t.getDay(), this.$H = t.getHours(), this.$m = t.getMinutes(), this.$s = t.getSeconds(), this.$ms = t.getMilliseconds();
      }, r.$utils = function() {
        return i;
      }, r.isValid = function() {
        return this.$d.toString() !== d;
      }, r.isSame = function(t, s) {
        var e = p(t);
        return this.startOf(s) <= e && e <= this.endOf(s);
      }, r.isAfter = function(t, s) {
        return p(t) < this.startOf(s);
      }, r.isBefore = function(t, s) {
        return this.endOf(s) < p(t);
      }, r.$g = function(t, s, e) {
        return i.u(t) ? this[s] : this.set(e, t);
      }, r.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
      }, r.valueOf = function() {
        return this.$d.getTime();
      }, r.startOf = function(t, s) {
        var e = this, o = !!i.u(s) || s, u = i.p(t), g = function(U, I) {
          var z = i.w(e.$u ? Date.UTC(e.$y, I, U) : new Date(e.$y, I, U), e);
          return o ? z : z.endOf(A);
        }, O = function(U, I) {
          return i.w(e.toDate()[U].apply(e.toDate("s"), (o ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(I)), e);
        }, L = this.$W, C = this.$M, P = this.$D, W = "set" + (this.$u ? "UTC" : "");
        switch (u) {
          case j:
            return o ? g(1, 0) : g(31, 11);
          case N:
            return o ? g(1, C) : g(0, C + 1);
          case R:
            var H = this.$locale().weekStart || 0, V = (L < H ? L + 7 : L) - H;
            return g(o ? P - V : P + (6 - V), C);
          case A:
          case Z:
            return O(W + "Hours", 0);
          case _:
            return O(W + "Minutes", 1);
          case Y:
            return O(W + "Seconds", 2);
          case F:
            return O(W + "Milliseconds", 3);
          default:
            return this.clone();
        }
      }, r.endOf = function(t) {
        return this.startOf(t, !1);
      }, r.$set = function(t, s) {
        var e, o = i.p(t), u = "set" + (this.$u ? "UTC" : ""), g = (e = {}, e[A] = u + "Date", e[Z] = u + "Date", e[N] = u + "Month", e[j] = u + "FullYear", e[_] = u + "Hours", e[Y] = u + "Minutes", e[F] = u + "Seconds", e[S] = u + "Milliseconds", e)[o], O = o === A ? this.$D + (s - this.$W) : s;
        if (o === N || o === j) {
          var L = this.clone().set(Z, 1);
          L.$d[g](O), L.init(), this.$d = L.set(Z, Math.min(this.$D, L.daysInMonth())).$d;
        } else
          g && this.$d[g](O);
        return this.init(), this;
      }, r.set = function(t, s) {
        return this.clone().$set(t, s);
      }, r.get = function(t) {
        return this[i.p(t)]();
      }, r.add = function(t, s) {
        var e, o = this;
        t = Number(t);
        var u = i.p(s), g = function(C) {
          var P = p(o);
          return i.w(P.date(P.date() + Math.round(C * t)), o);
        };
        if (u === N)
          return this.set(N, this.$M + t);
        if (u === j)
          return this.set(j, this.$y + t);
        if (u === A)
          return g(1);
        if (u === R)
          return g(7);
        var O = (e = {}, e[Y] = M, e[_] = h, e[F] = v, e)[u] || 1, L = this.$d.getTime() + t * O;
        return i.w(L, this);
      }, r.subtract = function(t, s) {
        return this.add(-1 * t, s);
      }, r.format = function(t) {
        var s = this, e = this.$locale();
        if (!this.isValid())
          return e.invalidDate || d;
        var o = t || "YYYY-MM-DDTHH:mm:ssZ", u = i.z(this), g = this.$H, O = this.$m, L = this.$M, C = e.weekdays, P = e.months, W = e.meridiem, H = function(I, z, B, J) {
          return I && (I[z] || I(s, o)) || B[z].slice(0, J);
        }, V = function(I) {
          return i.s(g % 12 || 12, I, "0");
        }, U = W || function(I, z, B) {
          var J = I < 12 ? "AM" : "PM";
          return B ? J.toLowerCase() : J;
        };
        return o.replace(b, function(I, z) {
          return z || function(B) {
            switch (B) {
              case "YY":
                return String(s.$y).slice(-2);
              case "YYYY":
                return i.s(s.$y, 4, "0");
              case "M":
                return L + 1;
              case "MM":
                return i.s(L + 1, 2, "0");
              case "MMM":
                return H(e.monthsShort, L, P, 3);
              case "MMMM":
                return H(P, L);
              case "D":
                return s.$D;
              case "DD":
                return i.s(s.$D, 2, "0");
              case "d":
                return String(s.$W);
              case "dd":
                return H(e.weekdaysMin, s.$W, C, 2);
              case "ddd":
                return H(e.weekdaysShort, s.$W, C, 3);
              case "dddd":
                return C[s.$W];
              case "H":
                return String(g);
              case "HH":
                return i.s(g, 2, "0");
              case "h":
                return V(1);
              case "hh":
                return V(2);
              case "a":
                return U(g, O, !0);
              case "A":
                return U(g, O, !1);
              case "m":
                return String(O);
              case "mm":
                return i.s(O, 2, "0");
              case "s":
                return String(s.$s);
              case "ss":
                return i.s(s.$s, 2, "0");
              case "SSS":
                return i.s(s.$ms, 3, "0");
              case "Z":
                return u;
            }
            return null;
          }(I) || u.replace(":", "");
        });
      }, r.utcOffset = function() {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, r.diff = function(t, s, e) {
        var o, u = this, g = i.p(s), O = p(t), L = (O.utcOffset() - this.utcOffset()) * M, C = this - O, P = function() {
          return i.m(u, O);
        };
        switch (g) {
          case j:
            o = P() / 12;
            break;
          case N:
            o = P();
            break;
          case X:
            o = P() / 3;
            break;
          case R:
            o = (C - L) / 6048e5;
            break;
          case A:
            o = (C - L) / 864e5;
            break;
          case _:
            o = C / h;
            break;
          case Y:
            o = C / M;
            break;
          case F:
            o = C / v;
            break;
          default:
            o = C;
        }
        return e ? o : i.a(o);
      }, r.daysInMonth = function() {
        return this.endOf(N).$D;
      }, r.$locale = function() {
        return $[this.$L];
      }, r.locale = function(t, s) {
        if (!t)
          return this.$L;
        var e = this.clone(), o = T(t, s, !0);
        return o && (e.$L = o), e;
      }, r.clone = function() {
        return i.w(this.$d, this);
      }, r.toDate = function() {
        return new Date(this.valueOf());
      }, r.toJSON = function() {
        return this.isValid() ? this.toISOString() : null;
      }, r.toISOString = function() {
        return this.$d.toISOString();
      }, r.toString = function() {
        return this.$d.toUTCString();
      }, a;
    }(), k = x.prototype;
    return p.prototype = k, [["$ms", S], ["$s", F], ["$m", Y], ["$H", _], ["$W", A], ["$M", N], ["$y", j], ["$D", Z]].forEach(function(a) {
      k[a[1]] = function(r) {
        return this.$g(r, a[0], a[1]);
      };
    }), p.extend = function(a, r) {
      return a.$i || (a(r, x, p), a.$i = !0), p;
    }, p.locale = T, p.isDayjs = D, p.unix = function(a) {
      return p(1e3 * a);
    }, p.en = $[l], p.Ls = $, p.p = {}, p;
  });
})(it);
var wt = it.exports;
const Q = /* @__PURE__ */ yt(wt);
var bt = Object.defineProperty, Dt = (f, y, v) => y in f ? bt(f, y, { enumerable: !0, configurable: !0, writable: !0, value: v }) : f[y] = v, q = (f, y, v) => (Dt(f, typeof y != "symbol" ? y + "" : y, v), v), St = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function At(f) {
  return f && f.__esModule && Object.prototype.hasOwnProperty.call(f, "default") ? f.default : f;
}
var at = { exports: {} };
(function(f, y) {
  (function(v, M) {
    f.exports = M();
  })(St, function() {
    var v = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, M = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|YYYY|YY?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, h = /\d\d/, S = /\d\d?/, F = /\d*[^-_:/,()\s\d]+/, Y = {}, _ = function(d) {
      return (d = +d) + (d > 68 ? 1900 : 2e3);
    }, A = function(d) {
      return function(m) {
        this[d] = +m;
      };
    }, R = [/[+-]\d\d:?(\d\d)?|Z/, function(d) {
      (this.zone || (this.zone = {})).offset = function(m) {
        if (!m || m === "Z")
          return 0;
        var b = m.match(/([+-]|\d\d)/g), w = 60 * b[1] + (+b[2] || 0);
        return w === 0 ? 0 : b[0] === "+" ? -w : w;
      }(d);
    }], N = function(d) {
      var m = Y[d];
      return m && (m.indexOf ? m : m.s.concat(m.f));
    }, X = function(d, m) {
      var b, w = Y.meridiem;
      if (w) {
        for (var E = 1; E <= 24; E += 1)
          if (d.indexOf(w(E, 0, m)) > -1) {
            b = E > 12;
            break;
          }
      } else
        b = d === (m ? "pm" : "PM");
      return b;
    }, j = { A: [F, function(d) {
      this.afternoon = X(d, !1);
    }], a: [F, function(d) {
      this.afternoon = X(d, !0);
    }], S: [/\d/, function(d) {
      this.milliseconds = 100 * +d;
    }], SS: [h, function(d) {
      this.milliseconds = 10 * +d;
    }], SSS: [/\d{3}/, function(d) {
      this.milliseconds = +d;
    }], s: [S, A("seconds")], ss: [S, A("seconds")], m: [S, A("minutes")], mm: [S, A("minutes")], H: [S, A("hours")], h: [S, A("hours")], HH: [S, A("hours")], hh: [S, A("hours")], D: [S, A("day")], DD: [h, A("day")], Do: [F, function(d) {
      var m = Y.ordinal, b = d.match(/\d+/);
      if (this.day = b[0], m)
        for (var w = 1; w <= 31; w += 1)
          m(w).replace(/\[|\]/g, "") === d && (this.day = w);
    }], M: [S, A("month")], MM: [h, A("month")], MMM: [F, function(d) {
      var m = N("months"), b = (N("monthsShort") || m.map(function(w) {
        return w.slice(0, 3);
      })).indexOf(d) + 1;
      if (b < 1)
        throw new Error();
      this.month = b % 12 || b;
    }], MMMM: [F, function(d) {
      var m = N("months").indexOf(d) + 1;
      if (m < 1)
        throw new Error();
      this.month = m % 12 || m;
    }], Y: [/[+-]?\d+/, A("year")], YY: [h, function(d) {
      this.year = _(d);
    }], YYYY: [/\d{4}/, A("year")], Z: R, ZZ: R };
    function Z(d) {
      var m, b;
      m = d, b = Y && Y.formats;
      for (var w = (d = m.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(T, p, i) {
        var x = i && i.toUpperCase();
        return p || b[i] || v[i] || b[x].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(k, a, r) {
          return a || r.slice(1);
        });
      })).match(M), E = w.length, n = 0; n < E; n += 1) {
        var l = w[n], $ = j[l], c = $ && $[0], D = $ && $[1];
        w[n] = D ? { regex: c, parser: D } : l.replace(/^\[|\]$/g, "");
      }
      return function(T) {
        for (var p = {}, i = 0, x = 0; i < E; i += 1) {
          var k = w[i];
          if (typeof k == "string")
            x += k.length;
          else {
            var a = k.regex, r = k.parser, t = T.slice(x), s = a.exec(t)[0];
            r.call(p, s), T = T.replace(s, "");
          }
        }
        return function(e) {
          var o = e.afternoon;
          if (o !== void 0) {
            var u = e.hours;
            o ? u < 12 && (e.hours += 12) : u === 12 && (e.hours = 0), delete e.afternoon;
          }
        }(p), p;
      };
    }
    return function(d, m, b) {
      b.p.customParseFormat = !0, d && d.parseTwoDigitYear && (_ = d.parseTwoDigitYear);
      var w = m.prototype, E = w.parse;
      w.parse = function(n) {
        var l = n.date, $ = n.utc, c = n.args;
        this.$u = $;
        var D = c[1];
        if (typeof D == "string") {
          var T = c[2] === !0, p = c[3] === !0, i = T || p, x = c[2];
          p && (x = c[2]), Y = this.$locale(), !T && x && (Y = b.Ls[x]), this.$d = function(t, s, e) {
            try {
              if (["x", "X"].indexOf(s) > -1)
                return new Date((s === "X" ? 1e3 : 1) * t);
              var o = Z(s)(t), u = o.year, g = o.month, O = o.day, L = o.hours, C = o.minutes, P = o.seconds, W = o.milliseconds, H = o.zone, V = /* @__PURE__ */ new Date(), U = O || (u || g ? 1 : V.getDate()), I = u || V.getFullYear(), z = 0;
              u && !g || (z = g > 0 ? g - 1 : V.getMonth());
              var B = L || 0, J = C || 0, G = P || 0, tt = W || 0;
              return H ? new Date(Date.UTC(I, z, U, B, J, G, tt + 60 * H.offset * 1e3)) : e ? new Date(Date.UTC(I, z, U, B, J, G, tt)) : new Date(I, z, U, B, J, G, tt);
            } catch (It) {
              return /* @__PURE__ */ new Date("");
            }
          }(l, D, $), this.init(), x && x !== !0 && (this.$L = this.locale(x).$L), i && l != this.format(D) && (this.$d = /* @__PURE__ */ new Date("")), Y = {};
        } else if (D instanceof Array)
          for (var k = D.length, a = 1; a <= k; a += 1) {
            c[1] = D[a - 1];
            var r = b.apply(this, c);
            if (r.isValid()) {
              this.$d = r.$d, this.$L = r.$L, this.init();
              break;
            }
            a === k && (this.$d = /* @__PURE__ */ new Date(""));
          }
        else
          E.call(this, n);
      };
    };
  });
})(at);
var xt = at.exports;
const Ot = /* @__PURE__ */ At(xt);
Q.extend(Ot);
function Lt(f, y) {
  return f === y ? !1 : Q(f, y, !0).isValid();
}
const et = /* @__PURE__ */ mt({
  name: "IBizPersonalInfo",
  props: lt(),
  setup(f, {
    emit: y
  }) {
    var v;
    const M = dt("personal-info"), h = f.controller, S = nt(""), F = h.codeList, Y = h.model.textSeparator || ((v = h.editorParams) == null ? void 0 : v.TEXTSEPARATOR) || ",", _ = nt([]);
    F && rt(() => f.data, (n) => {
      h.loadCodeList(n).then((l) => {
        _.value = l;
      });
    }, {
      immediate: !0,
      deep: !0
    });
    const {
      componentRef: A
    } = ft(() => y("focus"), () => y("blur")), R = st(() => !!(f.controlParams && f.controlParams.editmode === "hover")), N = () => {
      const n = document.documentElement;
      return n ? getComputedStyle(n).getPropertyValue("--ibiz-color-primary") : null;
    }, X = (n) => /[\u4E00-\u9FA5]/.test(n), j = (n) => /[\u4e00-\u9fa5]+.*[a-zA-Z]+|[a-zA-Z]+.*[\u4e00-\u9fa5]+/.test(n), Z = (n) => {
      if (!n)
        return "";
      let l = 0;
      for (let i = 0; i < n.length; i++)
        if (X(n))
          l = n.charCodeAt(i) + ((l << 5) - l), l = l & l;
        else {
          const x = n.charCodeAt(i);
          l += x.toString(16);
        }
      const $ = String(l).substring(0, 6);
      let c = parseInt($.substring(0, 2), 16), D = parseInt($.substring(2, 4), 16), T = parseInt($.substring(4, 6), 16);
      c < 0 && (c = 10), D < 0 && (D = 10), T < 0 && (T = 10);
      const p = "#".concat(c.toString(16).padStart(2, "0")).concat(D.toString(16).padStart(2, "0")).concat(T.toString(16).padStart(2, "0"));
      return p === "#FFFFFF" && N() || p;
    }, d = (n) => {
      if (n && n.toString().length < 2)
        return n;
      if (n && n.toString().length >= 2) {
        if (j(n)) {
          const l = n.split("").find((c) => /[a-zA-Z]/.test(c)) || "", $ = n.split("").find((c) => /[\u4E00-\u9FA5]/.test(c)) || "";
          return "".concat(l).concat($).toLowerCase();
        }
        return /[a-zA-Z]/.test(n) ? n.split("").filter((l) => /[a-zA-Z]/.test(l)).slice(0, 2).join("").toUpperCase() : /[\u4E00-\u9FA5]/.test(n) ? n.split("").filter((l) => /[\u4E00-\u9FA5]/.test(l)).slice(-2).join("") : n.replaceAll(" ", "").substring(0, 2);
      }
    }, m = (n, l) => {
      if (n) {
        const $ = n.find((c) => c.value == l);
        if ($)
          return $;
        for (let c = 0; c < n.length; c++) {
          const D = m(n[c].children, l);
          if (D)
            return D;
        }
      }
    }, b = (n) => {
      var l;
      if (n && (l = n.data) != null && l.iconurl)
        return n.data.iconurl;
    };
    rt(() => f.value, (n, l) => {
      var $;
      if (n !== l) {
        if (pt(n)) {
          S.value = "";
          return;
        }
        let c = "";
        const {
          valueFormat: D,
          dataType: T,
          unitName: p
        } = h.parent;
        if (h.model.valueType === "SIMPLES")
          c = n.join(Y);
        else if (h.model.valueType === "OBJECT")
          c = n[h.model.objectNameField ? h.model.objectNameField : "srfmajortext"];
        else if (h.model.valueType === "OBJECTS") {
          const i = [];
          n.forEach((x) => {
            i.push(x[h.model.objectNameField ? h.model.objectNameField : "srfmajortext"]);
          }), c = i.join(Y);
        } else if (h.model.editorType === "ADDRESSPICKUP")
          try {
            const i = [];
            JSON.parse(n).forEach((x) => {
              i.push(x[h.model.objectNameField ? h.model.objectNameField : "srfmajortext"]);
            }), c = i.join(Y);
          } catch (i) {
            ibiz.log.error("标签地址选择器的值不符合JSON格式".concat(n));
          }
        else if (D)
          try {
            if (T != null && vt.isDate(T))
              c = Q(n).format(D);
            else {
              const i = Q(n).format(D);
              Lt(c, D) ? c = i : c = ibiz.util.text.format("".concat(n), D);
            }
          } catch (i) {
            c = "".concat(n), ibiz.log.error("".concat(n, " 值格式化错误"));
          }
        else
          c = "".concat(n);
        if (p && (c += p), h.codeList && (($ = _.value) == null ? void 0 : $.length) > 0) {
          const i = _.value, x = m(i, c);
          c = (x == null ? void 0 : x.text) || c;
        }
        S.value = c;
      }
    }, {
      immediate: !0
    });
    const w = st(() => {
      var n;
      let l = S.value;
      if (h.codeList && ((n = _.value) == null ? void 0 : n.length) > 0) {
        const $ = _.value, c = m($, l);
        l = (c == null ? void 0 : c.text) || l;
      }
      return l;
    }), E = () => {
      if (f.value) {
        const n = m(_.value, f.value);
        if (n && b(n)) {
          const l = b(n), $ = JSON.parse(l), c = ibiz.util.file.calcFileUpDownUrl(h.context, h.params).downloadUrl.replace("%fileId%", $[0].id);
          return K("img", {
            class: M.bem("content", "head-sculpture", "avatar-icon"),
            src: c,
            alt: ""
          }, null);
        }
      }
      return d(w.value) || "";
    };
    return {
      ns: M,
      c: h,
      text: S,
      editorRef: A,
      showFormDefaultContent: R,
      renderContent: () => {
        const n = S.value;
        if (!n)
          return "- - -";
        const l = h.parseAvatar(n);
        return l ? K("div", {
          class: M.b("content")
        }, [K("div", {
          class: M.be("content", "head-sculpture")
        }, [K("img", {
          src: l
        }, null)])]) : K("div", {
          class: M.b("content")
        }, [K("div", {
          class: M.be("content", "head-sculpture"),
          style: "background-color:".concat(Z(w.value))
        }, [E()]), h.isShowNameText() ? K("div", {
          class: M.be("content", "tip")
        }, [w.value]) : null]);
      }
    };
  },
  render() {
    return K("div", {
      class: [this.ns.b(), this.readonly ? this.ns.m("readonly") : "", this.ns.is("show-default", this.showFormDefaultContent)],
      ref: "editorRef"
    }, [this.renderContent()]);
  }
});
class Yt extends ut {
  constructor() {
    super(...arguments), q(this, "valueItem", ""), q(this, "codeList"), q(this, "enableAvatar", !1), q(this, "showNameText", !0), q(this, "operatorMap", /* @__PURE__ */ new Map());
  }
  async onInit() {
    var y, v;
    if (super.onInit(), (v = (y = this.model) == null ? void 0 : y.editorItems) != null && v[0] && (this.valueItem = this.model.editorItems[0].id), this.model.appCodeListId) {
      const S = await ibiz.hub.getApp(this.context.srfappid);
      this.codeList = S.codeList.getCodeList(this.model.appCodeListId);
    }
    const { ENABLEAVATAR: M, SHOWNAMETEXT: h } = this.editorParams;
    M && (this.enableAvatar = this.toBoolean(M)), h && (this.showNameText = this.toBoolean(h));
  }
  /**
   * 打开数据链接视图
   */
  async openLinkView(y) {
    const v = this.context.clone();
    y[this.valueItem] && (v.srfkey = y[this.valueItem]);
    const { context: M, params: h } = this.handlePublicParams(
      y,
      v,
      this.params
    ), { linkAppViewId: S } = this.model;
    if (!S)
      throw new $t(this.model, "请配置数据链接视图");
    return ibiz.commands.execute(
      ct.TAG,
      S,
      M,
      h
    );
  }
  /**
   * 判断是否显示姓名文字
   *
   * @return {*}  {boolean}
   * @memberof PersonalInfoEditorController
   */
  isShowNameText() {
    return this.showNameText;
  }
  /**
   * 解析头像数据
   *
   * @param {string} avatar
   * @return {*}
   * @memberof PersonalInfoEditorController
   */
  parseAvatar(y) {
    if (this.enableAvatar)
      try {
        const v = JSON.parse(y);
        if (v) {
          const M = Array.isArray(v) ? v[0] : v;
          return ibiz.util.file.calcFileUpDownUrl(
            this.context,
            this.params
          ).downloadUrl.replace("%fileId%", M.id);
        }
      } catch (v) {
        throw new gt("头像数据解析异常");
      }
  }
  /**
   * 获取操作用户列表
   *
   * @memberof PersonalInfoEditorController
   */
  async getOperatorUserList() {
    const y = await ibiz.hub.getApp(this.context.srfappid);
    let v = [];
    v = await y.codeList.get(
      "SysOperator",
      this.context,
      this.params
    ), this.operatorMap = new Map(
      v.map((M) => [M.value, M])
    );
  }
}
class Tt {
  constructor() {
    q(this, "formEditor", "IBizPersonalInfo"), q(this, "gridEditor", "IBizPersonalInfo");
  }
  async createController(y, v) {
    const M = new Yt(y, v);
    return await M.init(), M;
  }
}
const Ct = ht(et, (f) => {
  f.component(et.name, et), ot(
    "EDITOR_CUSTOMSTYLE_PERSONNEL_INFO",
    () => new Tt()
  );
}), zt = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(f) {
    f.use(Ct);
  }
};
export {
  Ct as IBizPersonalInfo,
  zt as default
};
