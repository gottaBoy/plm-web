import { registerEditorProvider as ce, CodeListEditorController as de, ScriptFactory as ne } from "@ibiz-template/runtime";
import { getListBoxProps as he, getEditorEmits as fe, useNamespace as pe, useFocusAndBlur as ve, withInstall as me } from "@ibiz-template/vue3-util";
import { defineComponent as ge, ref as W, computed as ae, watch as be, createVNode as $, resolveComponent as k, isVNode as ye, mergeProps as De } from "vue";
import { isNil as $e, clone as Oe } from "ramda";
var Se = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Me(f) {
  return f && f.__esModule && Object.prototype.hasOwnProperty.call(f, "default") ? f.default : f;
}
var se = { exports: {} };
(function(f, i) {
  (function(a, r) {
    f.exports = r();
  })(Se, function() {
    var a = 1e3, r = 6e4, m = 36e5, v = "millisecond", d = "second", y = "minute", g = "hour", p = "day", O = "week", D = "month", A = "quarter", x = "year", I = "date", V = "Invalid Date", Z = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, E = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, Q = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(h) {
      var o = ["th", "st", "nd", "rd"], n = h % 100;
      return "[" + h + (o[(n - 20) % 10] || o[n] || o[0]) + "]";
    } }, N = function(h, o, n) {
      var l = String(h);
      return !l || l.length >= o ? h : "" + Array(o + 1 - l.length).join(n) + h;
    }, P = { s: N, z: function(h) {
      var o = -h.utcOffset(), n = Math.abs(o), l = Math.floor(n / 60), s = n % 60;
      return (o <= 0 ? "+" : "-") + N(l, 2, "0") + ":" + N(s, 2, "0");
    }, m: function h(o, n) {
      if (o.date() < n.date())
        return -h(n, o);
      var l = 12 * (n.year() - o.year()) + (n.month() - o.month()), s = o.clone().add(l, D), e = n - s < 0, t = o.clone().add(l + (e ? -1 : 1), D);
      return +(-(l + (n - s) / (e ? s - t : t - s)) || 0);
    }, a: function(h) {
      return h < 0 ? Math.ceil(h) || 0 : Math.floor(h);
    }, p: function(h) {
      return { M: D, y: x, w: O, d: p, D: I, h: g, m: y, s: d, ms: v, Q: A }[h] || String(h || "").toLowerCase().replace(/s$/, "");
    }, u: function(h) {
      return h === void 0;
    } }, U = "en", j = {};
    j[U] = Q;
    var q = "$isDayjsObject", z = function(h) {
      return h instanceof F || !(!h || !h[q]);
    }, B = function h(o, n, l) {
      var s;
      if (!o)
        return U;
      if (typeof o == "string") {
        var e = o.toLowerCase();
        j[e] && (s = e), n && (j[e] = n, s = e);
        var t = o.split("-");
        if (!s && t.length > 1)
          return h(t[0]);
      } else {
        var u = o.name;
        j[u] = o, s = u;
      }
      return !l && s && (U = s), s || !l && U;
    }, M = function(h, o) {
      if (z(h))
        return h.clone();
      var n = typeof o == "object" ? o : {};
      return n.date = h, n.args = arguments, new F(n);
    }, b = P;
    b.l = B, b.i = z, b.w = function(h, o) {
      return M(h, { locale: o.$L, utc: o.$u, x: o.$x, $offset: o.$offset });
    };
    var F = function() {
      function h(n) {
        this.$L = B(n.locale, null, !0), this.parse(n), this.$x = this.$x || n.x || {}, this[q] = !0;
      }
      var o = h.prototype;
      return o.parse = function(n) {
        this.$d = function(l) {
          var s = l.date, e = l.utc;
          if (s === null)
            return /* @__PURE__ */ new Date(NaN);
          if (b.u(s))
            return /* @__PURE__ */ new Date();
          if (s instanceof Date)
            return new Date(s);
          if (typeof s == "string" && !/Z$/i.test(s)) {
            var t = s.match(Z);
            if (t) {
              var u = t[2] - 1 || 0, c = (t[7] || "0").substring(0, 3);
              return e ? new Date(Date.UTC(t[1], u, t[3] || 1, t[4] || 0, t[5] || 0, t[6] || 0, c)) : new Date(t[1], u, t[3] || 1, t[4] || 0, t[5] || 0, t[6] || 0, c);
            }
          }
          return new Date(s);
        }(n), this.init();
      }, o.init = function() {
        var n = this.$d;
        this.$y = n.getFullYear(), this.$M = n.getMonth(), this.$D = n.getDate(), this.$W = n.getDay(), this.$H = n.getHours(), this.$m = n.getMinutes(), this.$s = n.getSeconds(), this.$ms = n.getMilliseconds();
      }, o.$utils = function() {
        return b;
      }, o.isValid = function() {
        return this.$d.toString() !== V;
      }, o.isSame = function(n, l) {
        var s = M(n);
        return this.startOf(l) <= s && s <= this.endOf(l);
      }, o.isAfter = function(n, l) {
        return M(n) < this.startOf(l);
      }, o.isBefore = function(n, l) {
        return this.endOf(l) < M(n);
      }, o.$g = function(n, l, s) {
        return b.u(n) ? this[l] : this.set(s, n);
      }, o.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
      }, o.valueOf = function() {
        return this.$d.getTime();
      }, o.startOf = function(n, l) {
        var s = this, e = !!b.u(l) || l, t = b.p(n), u = function(G, L) {
          var R = b.w(s.$u ? Date.UTC(s.$y, L, G) : new Date(s.$y, L, G), s);
          return e ? R : R.endOf(p);
        }, c = function(G, L) {
          return b.w(s.toDate()[G].apply(s.toDate("s"), (e ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(L)), s);
        }, w = this.$W, S = this.$M, C = this.$D, _ = "set" + (this.$u ? "UTC" : "");
        switch (t) {
          case x:
            return e ? u(1, 0) : u(31, 11);
          case D:
            return e ? u(1, S) : u(0, S + 1);
          case O:
            var H = this.$locale().weekStart || 0, J = (w < H ? w + 7 : w) - H;
            return u(e ? C - J : C + (6 - J), S);
          case p:
          case I:
            return c(_ + "Hours", 0);
          case g:
            return c(_ + "Minutes", 1);
          case y:
            return c(_ + "Seconds", 2);
          case d:
            return c(_ + "Milliseconds", 3);
          default:
            return this.clone();
        }
      }, o.endOf = function(n) {
        return this.startOf(n, !1);
      }, o.$set = function(n, l) {
        var s, e = b.p(n), t = "set" + (this.$u ? "UTC" : ""), u = (s = {}, s[p] = t + "Date", s[I] = t + "Date", s[D] = t + "Month", s[x] = t + "FullYear", s[g] = t + "Hours", s[y] = t + "Minutes", s[d] = t + "Seconds", s[v] = t + "Milliseconds", s)[e], c = e === p ? this.$D + (l - this.$W) : l;
        if (e === D || e === x) {
          var w = this.clone().set(I, 1);
          w.$d[u](c), w.init(), this.$d = w.set(I, Math.min(this.$D, w.daysInMonth())).$d;
        } else
          u && this.$d[u](c);
        return this.init(), this;
      }, o.set = function(n, l) {
        return this.clone().$set(n, l);
      }, o.get = function(n) {
        return this[b.p(n)]();
      }, o.add = function(n, l) {
        var s, e = this;
        n = Number(n);
        var t = b.p(l), u = function(S) {
          var C = M(e);
          return b.w(C.date(C.date() + Math.round(S * n)), e);
        };
        if (t === D)
          return this.set(D, this.$M + n);
        if (t === x)
          return this.set(x, this.$y + n);
        if (t === p)
          return u(1);
        if (t === O)
          return u(7);
        var c = (s = {}, s[y] = r, s[g] = m, s[d] = a, s)[t] || 1, w = this.$d.getTime() + n * c;
        return b.w(w, this);
      }, o.subtract = function(n, l) {
        return this.add(-1 * n, l);
      }, o.format = function(n) {
        var l = this, s = this.$locale();
        if (!this.isValid())
          return s.invalidDate || V;
        var e = n || "YYYY-MM-DDTHH:mm:ssZ", t = b.z(this), u = this.$H, c = this.$m, w = this.$M, S = s.weekdays, C = s.months, _ = s.meridiem, H = function(L, R, K, ee) {
          return L && (L[R] || L(l, e)) || K[R].slice(0, ee);
        }, J = function(L) {
          return b.s(u % 12 || 12, L, "0");
        }, G = _ || function(L, R, K) {
          var ee = L < 12 ? "AM" : "PM";
          return K ? ee.toLowerCase() : ee;
        };
        return e.replace(E, function(L, R) {
          return R || function(K) {
            switch (K) {
              case "YY":
                return String(l.$y).slice(-2);
              case "YYYY":
                return b.s(l.$y, 4, "0");
              case "M":
                return w + 1;
              case "MM":
                return b.s(w + 1, 2, "0");
              case "MMM":
                return H(s.monthsShort, w, C, 3);
              case "MMMM":
                return H(C, w);
              case "D":
                return l.$D;
              case "DD":
                return b.s(l.$D, 2, "0");
              case "d":
                return String(l.$W);
              case "dd":
                return H(s.weekdaysMin, l.$W, S, 2);
              case "ddd":
                return H(s.weekdaysShort, l.$W, S, 3);
              case "dddd":
                return S[l.$W];
              case "H":
                return String(u);
              case "HH":
                return b.s(u, 2, "0");
              case "h":
                return J(1);
              case "hh":
                return J(2);
              case "a":
                return G(u, c, !0);
              case "A":
                return G(u, c, !1);
              case "m":
                return String(c);
              case "mm":
                return b.s(c, 2, "0");
              case "s":
                return String(l.$s);
              case "ss":
                return b.s(l.$s, 2, "0");
              case "SSS":
                return b.s(l.$ms, 3, "0");
              case "Z":
                return t;
            }
            return null;
          }(L) || t.replace(":", "");
        });
      }, o.utcOffset = function() {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, o.diff = function(n, l, s) {
        var e, t = this, u = b.p(l), c = M(n), w = (c.utcOffset() - this.utcOffset()) * r, S = this - c, C = function() {
          return b.m(t, c);
        };
        switch (u) {
          case x:
            e = C() / 12;
            break;
          case D:
            e = C();
            break;
          case A:
            e = C() / 3;
            break;
          case O:
            e = (S - w) / 6048e5;
            break;
          case p:
            e = (S - w) / 864e5;
            break;
          case g:
            e = S / m;
            break;
          case y:
            e = S / r;
            break;
          case d:
            e = S / a;
            break;
          default:
            e = S;
        }
        return s ? e : b.a(e);
      }, o.daysInMonth = function() {
        return this.endOf(D).$D;
      }, o.$locale = function() {
        return j[this.$L];
      }, o.locale = function(n, l) {
        if (!n)
          return this.$L;
        var s = this.clone(), e = B(n, l, !0);
        return e && (s.$L = e), s;
      }, o.clone = function() {
        return b.w(this.$d, this);
      }, o.toDate = function() {
        return new Date(this.valueOf());
      }, o.toJSON = function() {
        return this.isValid() ? this.toISOString() : null;
      }, o.toISOString = function() {
        return this.$d.toISOString();
      }, o.toString = function() {
        return this.$d.toUTCString();
      }, h;
    }(), X = F.prototype;
    return M.prototype = X, [["$ms", v], ["$s", d], ["$m", y], ["$H", g], ["$W", p], ["$M", D], ["$y", x], ["$D", I]].forEach(function(h) {
      X[h[1]] = function(o) {
        return this.$g(o, h[0], h[1]);
      };
    }), M.extend = function(h, o) {
      return h.$i || (h(o, F, M), h.$i = !0), M;
    }, M.locale = B, M.isDayjs = z, M.unix = function(h) {
      return M(1e3 * h);
    }, M.en = j[U], M.Ls = j, M.p = {}, M;
  });
})(se);
var we = se.exports;
const Y = /* @__PURE__ */ Me(we);
var Ee = Object.defineProperty, xe = (f, i, a) => i in f ? Ee(f, i, { enumerable: !0, configurable: !0, writable: !0, value: a }) : f[i] = a, T = (f, i, a) => (xe(f, typeof i != "symbol" ? i + "" : i, a), a);
function te(f) {
  return typeof f == "function" || Object.prototype.toString.call(f) === "[object Object]" && !ye(f);
}
const re = /* @__PURE__ */ ge({
  name: "CheckboxListExtend",
  props: he(),
  emits: fe(),
  setup(f, {
    emit: i
  }) {
    const a = pe("checkbox-list-extend"), r = f.controller, m = W(null), v = {
      label: "text",
      children: "children"
    }, {
      codeList: d
    } = r, y = W([]), g = W([]), p = W([]), O = W([]), D = W({});
    (async () => r.loadCodeList(f.data).then((e) => {
      O.value = e, p.value = r.handleCodeListData(e, f.data), Object.is(r.renderMode, "TREE") && Object.is(r.mode, "horizontal") && j(), Object.is(r.renderMode, "BUTTON") && Object.is(r.mode, "vertical") && x(p.value);
      const t = r.getDefaultSelect(p.value, f.data);
      A(t);
    }))();
    const A = (e) => {
      e.length > 0 && P(e);
    }, x = (e) => {
      e.forEach((t) => {
        t.children && (g.value.push(t.value), x(t.children));
      });
    }, I = ae(() => d && d.orMode ? d.orMode.toLowerCase() : "str");
    let V = ",";
    d && d.valueSeparator && (V = d.valueSeparator);
    const Z = (e) => {
      m.value ? m.value.setCheckedKeys(e) : y.value = e;
    }, E = W([]);
    let Q = "";
    const N = ae({
      get() {
        return E.value.join(V);
      },
      set() {
      }
    });
    be(() => f.value, (e) => {
      if ($e(e))
        Z([]), E.value = [];
      else {
        let t = [];
        if (Object.is(I.value, "num") && p) {
          const u = typeof e == "string" ? parseInt(e, 10) : e;
          p.value.forEach((c) => {
            (u & c.value) === c.value && t.push(c.value);
          });
        } else if (Object.is(I.value, "str") && e !== "" && d && typeof e == "string" && (t = e.split(V), d.codeItemValueNumber))
          for (let u = 0, c = t.length; u < c; u++)
            t[u] = Number(t[u]);
        Z(t), E.value = t;
      }
    }, {
      immediate: !0,
      deep: !0
    });
    const P = (e) => {
      e && e.length > 0 ? i("change", e.join(V)) : i("change", r.emptyValue);
    }, U = (e, t) => {
      const u = t.checkedNodes.filter((c) => !c.group).map((c) => c.value);
      P(u);
    }, j = () => {
      p.value.forEach((e) => {
        e.children && Object.assign(D.value, {
          [e.value]: !1,
          ["".concat(e.value, "-all")]: !1
        });
      });
    }, q = (e, t, u) => {
      t.forEach((w) => {
        const {
          value: S
        } = w;
        if (e)
          E.value.includes(S) || E.value.push(S);
        else if (E.value.includes(S)) {
          const C = E.value.findIndex((_) => Object.is(_, S));
          E.value.splice(C, 1);
        }
      });
      const c = r.getDefaultSelect(p.value, f.data);
      c.length > 0 && (E.value.push(...c), E.value = [...new Set(E.value)]), Object.assign(D.value, {
        [u.value]: !1
      }), P(E.value);
    }, z = (e, t, u) => {
      const c = e.length;
      e.length === t.length ? Object.assign(D.value, {
        [u.value]: !1,
        ["".concat(u.value, "-all")]: !0
      }) : Object.assign(D.value, {
        [u.value]: c > 0,
        ["".concat(u.value, "-all")]: !1
      }), P(e);
    }, B = (e) => {
      e && Q !== e ? (Q = e, i("change", e)) : (Q = r.emptyValue, N.value = r.emptyValue, i("change", r.emptyValue));
    }, M = (e) => {
      P(e);
    }, {
      componentRef: b
    } = ve(() => i("focus"), () => i("blur")), F = (e) => e.children ? X(e.children, e) : $(k("el-checkbox"), {
      class: [a.e("check-item")],
      key: e.value,
      disabled: e.disableSelect,
      label: e.value
    }, {
      default: () => [e.sysImage ? $(k("iBizIcon"), {
        icon: e.sysImage
      }, null) : null, e.text]
    }), X = (e, t) => {
      let u;
      return $("div", {
        class: [a.e("check-group")]
      }, [$(k("el-checkbox"), {
        modelValue: D.value["".concat(t.value, "-all")],
        "onUpdate:modelValue": (c) => D.value["".concat(t.value, "-all")] = c,
        disabled: t.disableSelect,
        indeterminate: D.value[t.value],
        onChange: (c) => q(c, e, t)
      }, {
        default: () => [t.text]
      }), $(k("el-checkbox-group"), {
        modelValue: E.value,
        "onUpdate:modelValue": (c) => E.value = c,
        onChange: (c) => z(c, e, t)
      }, te(u = e.map((c) => F(c))) ? u : {
        default: () => [u]
      })]);
    }, h = (e, t) => r.singleSelect ? $(k("el-radio-group"), {
      modelValue: N.value,
      "onUpdate:modelValue": (u) => N.value = u,
      title: t.text,
      onClick: () => B(t.value)
    }, {
      default: () => [$(k("el-radio-button"), {
        key: t.value,
        label: t.value,
        disabled: t.disableSelect
      }, {
        default: () => [t.sysImage ? $(k("iBizIcon"), {
          icon: t.sysImage
        }, null) : null, t.text]
      })]
    }) : $(k("el-checkbox-group"), {
      modelValue: E.value,
      "onUpdate:modelValue": (u) => E.value = u,
      title: t.text,
      onChange: (u) => M(u)
    }, {
      default: () => [$(k("el-checkbox-button"), De(r.editorParams, {
        key: t.value,
        label: t.value,
        disabled: t.disableSelect
      }), {
        default: () => [t.sysImage ? $(k("iBizIcon"), {
          icon: t.sysImage
        }, null) : null, t.text]
      })]
    }), o = (e, t) => t.children ? n(t.children, t) : h(e, t), n = (e, t) => {
      let u;
      return $(k("el-collapse"), {
        modelValue: g.value,
        "onUpdate:modelValue": (c) => g.value = c
      }, {
        default: () => [$(k("el-collapse-item"), {
          title: t.text,
          name: t.value
        }, te(u = e.map((c) => o(e, c))) ? u : {
          default: () => [u]
        })]
      });
    }, l = (e, t) => t.children ? $(k("el-dropdown"), {
      "popper-class": [a.e("button"), a.em("dropdown-menu", "popper")]
    }, {
      default: () => $("span", {
        class: [a.e("dropdown-caption")]
      }, [t.text, $("i", {
        class: ["fa", "fa-angle-down", a.em("dropdown-caption", "icon-right")]
      }, null)]),
      dropdown: () => {
        let u;
        return $(k("el-dropdown-menu"), null, te(u = t.children.map((c) => s(c.children, c))) ? u : {
          default: () => [u]
        });
      }
    }) : h(e, t), s = (e, t) => {
      let u;
      return t.children ? $("div", {
        class: [a.em("dropdown-item", "group")]
      }, [t.children.map((c) => s(t.children, c))]) : $(k("el-dropdown-item"), null, te(u = h(e, t)) ? u : {
        default: () => [u]
      });
    };
    return {
      ns: a,
      c: r,
      editorRef: b,
      items: p,
      treeRef: m,
      selectArray: E,
      treeProps: v,
      defaultCheckedKeys: y,
      onSelectArrayChange: U,
      handleCheckAllChange: q,
      handleCheckChange: z,
      renderCheckItem: F,
      renderCollapseItem: o,
      renderDropdownMenu: l
    };
  },
  render() {
    var f, i;
    return Object.is(this.c.renderMode, "TREE") ? Object.is(this.c.mode, "vertical") ? $("div", {
      class: [this.ns.b(), this.ns.e("tree")],
      ref: "editorRef"
    }, [$(k("el-tree"), {
      ref: "treeRef",
      props: this.treeProps,
      data: this.items,
      "show-checkbox": !0,
      "node-key": "value",
      "default-expand-all": !0,
      "check-on-click-node": !0,
      "expand-on-click-node": !1,
      "default-checked-keys": this.defaultCheckedKeys,
      onCheck: this.onSelectArrayChange
    }, null)]) : $("div", {
      class: [this.ns.b(), this.ns.e("checkbox")]
    }, [this.items.map((a) => this.renderCheckItem(a))]) : this.c.mode === "vertical" ? $("div", {
      class: [this.ns.b(), this.ns.e((f = this.c.renderMode) == null ? void 0 : f.toLowerCase()), this.ns.e("collapse")]
    }, [this.items.map((a) => this.renderCollapseItem(this.items, a))]) : $("div", {
      class: [this.ns.b(), this.ns.e((i = this.c.renderMode) == null ? void 0 : i.toLowerCase()), this.ns.e("dropdown")]
    }, [this.items.map((a) => this.renderDropdownMenu(this.items, a))]);
  }
});
var ie = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function oe(f) {
  return f && f.__esModule && Object.prototype.hasOwnProperty.call(f, "default") ? f.default : f;
}
var ue = { exports: {} };
(function(f, i) {
  (function(a, r) {
    f.exports = r();
  })(ie, function() {
    var a = "month", r = "quarter";
    return function(m, v) {
      var d = v.prototype;
      d.quarter = function(p) {
        return this.$utils().u(p) ? Math.ceil((this.month() + 1) / 3) : this.month(this.month() % 3 + 3 * (p - 1));
      };
      var y = d.add;
      d.add = function(p, O) {
        return p = Number(p), this.$utils().p(O) === r ? this.add(3 * p, a) : y.bind(this)(p, O);
      };
      var g = d.startOf;
      d.startOf = function(p, O) {
        var D = this.$utils(), A = !!D.u(O) || O;
        if (D.p(p) === r) {
          var x = this.quarter() - 1;
          return A ? this.month(3 * x).startOf(a).startOf("day") : this.month(3 * x + 2).endOf(a).endOf("day");
        }
        return g.bind(this)(p, O);
      };
    };
  });
})(ue);
var ke = ue.exports;
const Ce = /* @__PURE__ */ oe(ke);
var le = { exports: {} };
(function(f, i) {
  (function(a, r) {
    f.exports = r();
  })(ie, function() {
    var a = "week", r = "year";
    return function(m, v, d) {
      var y = v.prototype;
      y.week = function(g) {
        if (g === void 0 && (g = null), g !== null)
          return this.add(7 * (g - this.week()), "day");
        var p = this.$locale().yearStart || 1;
        if (this.month() === 11 && this.date() > 25) {
          var O = d(this).startOf(r).add(1, r).date(p), D = d(this).endOf(a);
          if (O.isBefore(D))
            return 1;
        }
        var A = d(this).startOf(r).date(p).startOf(a).subtract(1, "millisecond"), x = this.diff(A, a, !0);
        return x < 0 ? d(this).startOf("week").week() : Math.ceil(x);
      }, y.weeks = function(g) {
        return g === void 0 && (g = null), this.week(g);
      };
    };
  });
})(le);
var Le = le.exports;
const Te = /* @__PURE__ */ oe(Le);
Y.extend(Ce);
Y.extend(Te);
class Ye extends de {
  constructor() {
    super(...arguments), T(this, "groupModel", "NOGROUP"), T(this, "groupField", "value"), T(this, "groupCodeList", []), T(this, "emptyValue", ""), T(this, "loadAfter", ""), T(this, "setDefaultSelect", ""), T(this, "dateSort", ""), T(this, "renderMode", "TREE"), T(this, "mode", "vertical"), T(this, "singleSelect", !1), T(this, "codeList"), T(this, "getDefaultSelect", (i, a) => {
      let r = [];
      return this.setDefaultSelect && (r = ne.execScriptFn(
        {
          items: i,
          context: this.context,
          params: this.params,
          data: a
        },
        this.setDefaultSelect,
        { isAsync: !1 }
      )), r;
    });
  }
  async onInit() {
    if (super.onInit(), this.model.appCodeListId) {
      const i = await ibiz.hub.getApp(this.context.srfappid);
      this.codeList = i.codeList.getCodeList(this.model.appCodeListId);
    }
    this.initEditorParams();
  }
  /**
   * 初始化编辑器参数
   *
   * @protected
   * @memberof CheckboxListExtendController
   */
  initEditorParams() {
    const { editorParams: i } = this.model;
    i && (this.groupModel = i.GROUPMODEL || "NOGROUP", i.GROUPFIELD && (this.groupField = i.GROUPFIELD.toLowerCase()), i.GROUPCODELIST && (this.groupCodeList = JSON.parse(i.GROUPCODELIST)), i.EMPTYVALUE && (this.emptyValue = i.EMPTYVALUE.toLowerCase()), i.RENDERMODE && (this.renderMode = i.RENDERMODE), i.MODE && (this.mode = i.MODE), i.DATESORT && (this.dateSort = i.DATESORT), i.LOADAFTER && (this.loadAfter = i.LOADAFTER), i.SETDEFAULTSELECT && (this.setDefaultSelect = i.SETDEFAULTSELECT), i.SINGLESELECT && (this.singleSelect = i.SINGLESELECT === "true"));
  }
  /**
   * 处理代码表数据
   *
   * @param {readonly} items
   * @param {*} CodeListItem
   * @param {*} []
   * @return {*}
   * @memberof CheckboxListExtendController
   */
  handleCodeListData(i, a) {
    let r = Oe(i);
    switch (this.dateSort && (r = this.handleSort(r)), this.groupModel) {
      case "YEAR":
        r = this.calcYearData(r);
        break;
      case "QUARTER":
        r = this.calcQuarterData(r);
        break;
      case "WEEK":
        r = this.calcWeekData(r);
        break;
      case "MONTH":
        r = this.calcMonthData(r);
        break;
      case "DAY":
        r = this.calcDayData(r);
        break;
      case "CODELIST":
        r = this.calcGroupCodelistData(r);
        break;
      case "FIELD":
        r = this.calcFieldData(r);
        break;
    }
    return this.loadAfter && (r = ne.execScriptFn(
      {
        items: r,
        context: this.context,
        params: this.params,
        data: a
      },
      this.loadAfter,
      { isAsync: !1 }
    )), r;
  }
  /**
   * 处理排序
   *
   * @param {IData[]} result
   * @return {*}
   * @memberof CheckboxListExtendController
   */
  handleSort(i) {
    return Object.is(this.dateSort, "DESC") ? i.sort((a, r) => Y(r.value).unix() - Y(a.value).unix()) : i.sort((a, r) => Y(a.value).unix() - Y(r.value).unix());
  }
  /**
   * 计算年分组数据
   *
   * @param {IData[]} items
   * @return {*}
   * @memberof CheckboxListExtendController
   */
  calcYearData(i) {
    const a = [], r = {};
    return i.forEach((m) => {
      const v = Y(m.value).format("YYYY");
      r[v] || (r[v] = {
        text: v,
        value: v,
        group: !0,
        children: []
      }, a.push(r[v])), r[v].children.push(m);
    }), a;
  }
  /**
   * 计算季度分组数据
   *
   * @param {IData[]} items
   * @return {*}
   * @memberof CheckboxListExtendController
   */
  calcQuarterData(i) {
    const a = [], r = {};
    return i.forEach((m) => {
      const v = Y(m.value), d = v.format("YYYY"), y = this.getQuarterDetail(v.quarter(), d);
      r[d] || (r[d] = {
        text: d,
        value: d,
        group: !0,
        children: []
      }, a.push(r[d]));
      const g = r[d], p = g.children.find(
        (O) => O.value === y
      );
      p ? p.children.push(m) : g.children.push({
        text: y,
        value: y,
        group: !0,
        children: [m]
      });
    }), a;
  }
  /**
   * 计算年周分组数据
   *
   * @param {IData[]} items
   * @return {*}
   * @memberof CheckboxListExtendController
   */
  calcWeekData(i) {
    const a = [], r = {};
    return i.forEach((m) => {
      const v = Y(m.value), d = v.format("YYYY"), y = "".concat(d, "-").concat(v.week());
      r[d] || (r[d] = {
        text: d,
        value: d,
        group: !0,
        children: []
      }, a.push(r[d]));
      const g = r[d], p = g.children.find(
        (O) => O.value === y
      );
      p ? p.children.push(m) : g.children.push({
        text: y,
        value: y,
        group: !0,
        children: [m]
      });
    }), a;
  }
  /**
   * 计算月分组数据
   *
   * @param {IData[]} items
   * @return {*}
   * @memberof CheckboxListExtendController
   */
  calcMonthData(i) {
    const a = [], r = {};
    return i.forEach((m) => {
      const v = Y(m.value), d = v.format("YYYY"), y = v.format("YYYY-MM");
      r[d] || (r[d] = {
        text: d,
        value: d,
        group: !0,
        children: []
      }, a.push(r[d]));
      const g = r[d], p = g.children.find(
        (O) => O.value === y
      );
      p ? p.children.push(m) : g.children.push({
        text: y,
        value: y,
        group: !0,
        children: [m]
      });
    }), a;
  }
  /**
   * 计算天分组数据
   *
   * @param {IData[]} items
   * @memberof CheckboxListExtendController
   */
  calcDayData(i) {
    return i;
  }
  /**
   * 计算代码表分组数据
   *
   * @param {IData[]} items
   * @return {*}
   * @memberof CheckboxListExtendController
   */
  calcGroupCodelistData(i) {
    const a = [];
    if (this.groupCodeList) {
      const r = {};
      i.forEach((m) => {
        const v = m[this.groupField];
        if (!r[v]) {
          const d = this.groupCodeList.find(
            (y) => Object.is(y.value, v)
          );
          d ? r[v] = {
            text: d.text,
            value: d.value,
            group: !0,
            children: []
          } : r[v] = {
            text: m.text,
            value: m.value,
            group: !0,
            children: []
          }, a.push(r[v]);
        }
        r[v].children.push(m);
      });
    } else
      ibiz.message.warning("分组失败，未配置分组代码表数据！");
    return a;
  }
  /**
   * 计算属性分组数据
   *
   * @param {IData[]} items
   * @return {*}
   * @memberof CheckboxListExtendController
   */
  calcFieldData(i) {
    const a = [], r = {};
    return i.forEach((m) => {
      const v = m[this.groupField];
      r[v] || (r[v] = {
        text: v,
        value: v,
        group: !0,
        children: []
      }, a.push(r[v])), r[v].children.push(m);
    }), a;
  }
  /**
   * 获取季度细节
   *
   * @param {number} quarter
   * @param {string} year
   * @return {*}
   * @memberof CheckboxListExtendController
   */
  getQuarterDetail(i, a) {
    switch (i) {
      case 1:
        return "".concat(a, "-01~").concat(a, "-03");
      case 2:
        return "".concat(a, "-04~").concat(a, "-06");
      case 3:
        return "".concat(a, "-07~").concat(a, "-09");
      case 4:
        return "".concat(a, "-10~").concat(a, "-12");
    }
  }
}
class Ie {
  constructor() {
    T(this, "formEditor", "CheckboxListExtend"), T(this, "gridEditor", "CheckboxListExtend");
  }
  async createController(i, a) {
    const r = new Ye(i, a);
    return await r.init(), r;
  }
}
const je = me(
  re,
  function(f) {
    f.component(re.name, re), ce(
      "CHECKBOXLIST_EXTEND",
      () => new Ie()
    );
  }
), Ne = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(f) {
    f.use(je);
  }
};
export {
  je as IBizCheckboxListExtend,
  Ne as default
};
