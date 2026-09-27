import './style.css';
var O = Object.defineProperty;
var L = (M, o, u) => o in M ? O(M, o, { enumerable: !0, configurable: !0, writable: !0, value: u }) : M[o] = u;
var P = (M, o, u) => (L(M, typeof o != "symbol" ? o + "" : o, u), u);
import { getRawProps, getEditorEmits, useNamespace, withInstall } from "@ibiz-template/vue3-util";
import { PluginStaticResource, EditorController, registerEditorProvider } from "@ibiz-template/runtime";
import { defineComponent, ref, computed, watch, onMounted, createVNode, createTextVNode, h } from "vue";
import { isArray } from "lodash-es";
import { createUUID } from "qx-util";
const resource = new PluginStaticResource(import.meta.url), rawActivity = "", RawActivity = /* @__PURE__ */ defineComponent({
  name: "RawActivity",
  props: getRawProps(),
  emits: getEditorEmits(),
  setup(props) {
    var M, o, u, p;
    const ns = useNamespace("raw"), ns2 = useNamespace("raw-activity"), c = props.controller, editorModel = c.model, vditorRef = ref(), vditorId = "vditor-".concat(createUUID()), content = ref("");
    let type = "TEXT", template = "";
    editorModel.contentType && (type = editorModel.contentType), (M = editorModel.editorParams) != null && M.contenttype && (type = (o = editorModel.editorParams) == null ? void 0 : o.contenttype), (u = editorModel.editorParams) != null && u.template && (template = editorModel.editorParams.template.replaceAll("//n", "\n")), (p = editorModel.editorParams) != null && p.TEMPLATE && (template = editorModel.editorParams.TEMPLATE.replaceAll("//n", "\n"));
    const showFormDefaultContent = computed(() => !!(props.controlParams && props.controlParams.editmode === "hover"));
    watch(() => props.value, async (d, r) => {
      if (d !== r && ((typeof d == "string" || typeof d == "number") && (content.value = d), template && d)) {
        let t = [];
        if (typeof d == "string")
          try {
            t = JSON.parse(d), t.forEach((n) => {
              if (n.dataauditdetailname === "TAGS") {
                if (n.newvalue) {
                  const s = JSON.parse(n.newvalue);
                  isArray(s) && (n.newvalue = s.map((a) => a.name).join(","));
                }
                if (n.oldvalue) {
                  const s = JSON.parse(n.oldvalue);
                  isArray(s) && (n.oldvalue = s.map((a) => a.name).join(","));
                }
              }
            });
          } catch (n) {
            ibiz.log.error("JSON字符串转换错误");
          }
        content.value = await ibiz.util.hbs.render(template, t || d);
      }
    }, {
      immediate: !0
    });
    const handleClick = async (e) => {
      const clickValue = e.target.getAttribute("click");
      if (clickValue)
        try {
          eval(clickValue);
        } catch (d) {
          ibiz.log.error("".concat(clickValue, " 脚本执行错误"));
        }
    }, initVditor = () => {
      c.vditor = new window.Vditor(vditorRef.value, {
        cache: {
          enable: !1
        },
        after: () => {
          c.renderAfter();
        },
        cdn: resource.dir("vditor")
      });
    };
    onMounted(() => {
      vditorRef.value && initVditor();
    });
    const renderContent = () => type === "HTML" ? createVNode("div", {
      class: ns2.e("paragraph"),
      innerHTML: content.value,
      onClick: (d) => {
        handleClick(d);
      }
    }, null) : createVNode("span", {
      class: ns2.e("text")
    }, [content.value]), onContrast = (d) => {
      try {
        const r = JSON.parse(props.value);
        if (r) {
          const t = r.find((n) => n.dataauditdetailname === d);
          if (t) {
            const n = {
              name: d,
              oldValue: t.oldvalue,
              newValue: t.newvalue
            };
            c.tagMap.clear(), c.openContrastModal(n);
          }
        }
      } catch (r) {
        ibiz.log.error("JSON字符串转换错误");
      }
    };
    return {
      ns,
      ns2,
      vditorId,
      vditorRef,
      onContrast,
      renderContent,
      showFormDefaultContent
    };
  },
  render() {
    return createVNode("div", {
      class: [this.ns.b(), this.ns2.b(), this.disabled ? this.ns.m("disabled") : "", this.readonly ? this.ns.m("readonly") : "", this.ns.is("show-default", this.showFormDefaultContent)]
    }, [this.renderContent(), createVNode("div", {
      class: [this.vditorId],
      ref: "vditorRef"
    }, null)]);
  }
});
var diffMatchPatch = { exports: {} };
(function(M) {
  var o = function() {
    this.Diff_Timeout = 1, this.Diff_EditCost = 4, this.Match_Threshold = 0.5, this.Match_Distance = 1e3, this.Patch_DeleteThreshold = 0.5, this.Patch_Margin = 4, this.Match_MaxBits = 32;
  }, u = -1, p = 1, d = 0;
  o.Diff = function(r, t) {
    return [r, t];
  }, o.prototype.diff_main = function(r, t, n, s) {
    typeof s > "u" && (this.Diff_Timeout <= 0 ? s = Number.MAX_VALUE : s = (/* @__PURE__ */ new Date()).getTime() + this.Diff_Timeout * 1e3);
    var a = s;
    if (r == null || t == null)
      throw new Error("Null input. (diff_main)");
    if (r == t)
      return r ? [new o.Diff(d, r)] : [];
    typeof n > "u" && (n = !0);
    var i = n, l = this.diff_commonPrefix(r, t), f = r.substring(0, l);
    r = r.substring(l), t = t.substring(l), l = this.diff_commonSuffix(r, t);
    var g = r.substring(r.length - l);
    r = r.substring(0, r.length - l), t = t.substring(0, t.length - l);
    var v = this.diff_compute_(r, t, i, a);
    return f && v.unshift(new o.Diff(d, f)), g && v.push(new o.Diff(d, g)), this.diff_cleanupMerge(v), v;
  }, o.prototype.diff_compute_ = function(r, t, n, s) {
    var a;
    if (!r)
      return [new o.Diff(p, t)];
    if (!t)
      return [new o.Diff(u, r)];
    var i = r.length > t.length ? r : t, l = r.length > t.length ? t : r, f = i.indexOf(l);
    if (f != -1)
      return a = [
        new o.Diff(p, i.substring(0, f)),
        new o.Diff(d, l),
        new o.Diff(
          p,
          i.substring(f + l.length)
        )
      ], r.length > t.length && (a[0][0] = a[2][0] = u), a;
    if (l.length == 1)
      return [
        new o.Diff(u, r),
        new o.Diff(p, t)
      ];
    var g = this.diff_halfMatch_(r, t);
    if (g) {
      var v = g[0], m = g[1], _ = g[2], b = g[3], w = g[4], D = this.diff_main(v, _, n, s), y = this.diff_main(m, b, n, s);
      return D.concat(
        [new o.Diff(d, w)],
        y
      );
    }
    return n && r.length > 100 && t.length > 100 ? this.diff_lineMode_(r, t, s) : this.diff_bisect_(r, t, s);
  }, o.prototype.diff_lineMode_ = function(r, t, n) {
    var s = this.diff_linesToChars_(r, t);
    r = s.chars1, t = s.chars2;
    var a = s.lineArray, i = this.diff_main(r, t, !1, n);
    this.diff_charsToLines_(i, a), this.diff_cleanupSemantic(i), i.push(new o.Diff(d, ""));
    for (var l = 0, f = 0, g = 0, v = "", m = ""; l < i.length; ) {
      switch (i[l][0]) {
        case p:
          g++, m += i[l][1];
          break;
        case u:
          f++, v += i[l][1];
          break;
        case d:
          if (f >= 1 && g >= 1) {
            i.splice(
              l - f - g,
              f + g
            ), l = l - f - g;
            for (var _ = this.diff_main(v, m, !1, n), b = _.length - 1; b >= 0; b--)
              i.splice(l, 0, _[b]);
            l = l + _.length;
          }
          g = 0, f = 0, v = "", m = "";
          break;
      }
      l++;
    }
    return i.pop(), i;
  }, o.prototype.diff_bisect_ = function(r, t, n) {
    for (var s = r.length, a = t.length, i = Math.ceil((s + a) / 2), l = i, f = 2 * i, g = new Array(f), v = new Array(f), m = 0; m < f; m++)
      g[m] = -1, v[m] = -1;
    g[l + 1] = 0, v[l + 1] = 0;
    for (var _ = s - a, b = _ % 2 != 0, w = 0, D = 0, y = 0, I = 0, A = 0; A < i && !((/* @__PURE__ */ new Date()).getTime() > n); A++) {
      for (var E = -A + w; E <= A - D; E += 2) {
        var T = l + E, N;
        E == -A || E != A && g[T - 1] < g[T + 1] ? N = g[T + 1] : N = g[T - 1] + 1;
        for (var k = N - E; N < s && k < a && r.charAt(N) == t.charAt(k); )
          N++, k++;
        if (g[T] = N, N > s)
          D += 2;
        else if (k > a)
          w += 2;
        else if (b) {
          var C = l + _ - E;
          if (C >= 0 && C < f && v[C] != -1) {
            var S = s - v[C];
            if (N >= S)
              return this.diff_bisectSplit_(r, t, N, k, n);
          }
        }
      }
      for (var V = -A + y; V <= A - I; V += 2) {
        var C = l + V, S;
        V == -A || V != A && v[C - 1] < v[C + 1] ? S = v[C + 1] : S = v[C - 1] + 1;
        for (var R = S - V; S < s && R < a && r.charAt(s - S - 1) == t.charAt(a - R - 1); )
          S++, R++;
        if (v[C] = S, S > s)
          I += 2;
        else if (R > a)
          y += 2;
        else if (!b) {
          var T = l + _ - V;
          if (T >= 0 && T < f && g[T] != -1) {
            var N = g[T], k = l + N - T;
            if (S = s - S, N >= S)
              return this.diff_bisectSplit_(r, t, N, k, n);
          }
        }
      }
    }
    return [
      new o.Diff(u, r),
      new o.Diff(p, t)
    ];
  }, o.prototype.diff_bisectSplit_ = function(r, t, n, s, a) {
    var i = r.substring(0, n), l = t.substring(0, s), f = r.substring(n), g = t.substring(s), v = this.diff_main(i, l, !1, a), m = this.diff_main(f, g, !1, a);
    return v.concat(m);
  }, o.prototype.diff_linesToChars_ = function(r, t) {
    var n = [], s = {};
    n[0] = "";
    function a(g) {
      for (var v = "", m = 0, _ = -1, b = n.length; _ < g.length - 1; ) {
        _ = g.indexOf("\n", m), _ == -1 && (_ = g.length - 1);
        var w = g.substring(m, _ + 1);
        (s.hasOwnProperty ? s.hasOwnProperty(w) : s[w] !== void 0) ? v += String.fromCharCode(s[w]) : (b == i && (w = g.substring(m), _ = g.length), v += String.fromCharCode(b), s[w] = b, n[b++] = w), m = _ + 1;
      }
      return v;
    }
    var i = 4e4, l = a(r);
    i = 65535;
    var f = a(t);
    return { chars1: l, chars2: f, lineArray: n };
  }, o.prototype.diff_charsToLines_ = function(r, t) {
    for (var n = 0; n < r.length; n++) {
      for (var s = r[n][1], a = [], i = 0; i < s.length; i++)
        a[i] = t[s.charCodeAt(i)];
      r[n][1] = a.join("");
    }
  }, o.prototype.diff_commonPrefix = function(r, t) {
    if (!r || !t || r.charAt(0) != t.charAt(0))
      return 0;
    for (var n = 0, s = Math.min(r.length, t.length), a = s, i = 0; n < a; )
      r.substring(i, a) == t.substring(i, a) ? (n = a, i = n) : s = a, a = Math.floor((s - n) / 2 + n);
    return a;
  }, o.prototype.diff_commonSuffix = function(r, t) {
    if (!r || !t || r.charAt(r.length - 1) != t.charAt(t.length - 1))
      return 0;
    for (var n = 0, s = Math.min(r.length, t.length), a = s, i = 0; n < a; )
      r.substring(r.length - a, r.length - i) == t.substring(t.length - a, t.length - i) ? (n = a, i = n) : s = a, a = Math.floor((s - n) / 2 + n);
    return a;
  }, o.prototype.diff_commonOverlap_ = function(r, t) {
    var n = r.length, s = t.length;
    if (n == 0 || s == 0)
      return 0;
    n > s ? r = r.substring(n - s) : n < s && (t = t.substring(0, n));
    var a = Math.min(n, s);
    if (r == t)
      return a;
    for (var i = 0, l = 1; ; ) {
      var f = r.substring(a - l), g = t.indexOf(f);
      if (g == -1)
        return i;
      l += g, (g == 0 || r.substring(a - l) == t.substring(0, l)) && (i = l, l++);
    }
  }, o.prototype.diff_halfMatch_ = function(r, t) {
    if (this.Diff_Timeout <= 0)
      return null;
    var n = r.length > t.length ? r : t, s = r.length > t.length ? t : r;
    if (n.length < 4 || s.length * 2 < n.length)
      return null;
    var a = this;
    function i(D, y, I) {
      for (var A = D.substring(I, I + Math.floor(D.length / 4)), E = -1, T = "", N, k, C, S; (E = y.indexOf(A, E + 1)) != -1; ) {
        var V = a.diff_commonPrefix(
          D.substring(I),
          y.substring(E)
        ), R = a.diff_commonSuffix(
          D.substring(0, I),
          y.substring(0, E)
        );
        T.length < R + V && (T = y.substring(E - R, E) + y.substring(E, E + V), N = D.substring(0, I - R), k = D.substring(I + V), C = y.substring(0, E - R), S = y.substring(E + V));
      }
      return T.length * 2 >= D.length ? [
        N,
        k,
        C,
        S,
        T
      ] : null;
    }
    var l = i(
      n,
      s,
      Math.ceil(n.length / 4)
    ), f = i(
      n,
      s,
      Math.ceil(n.length / 2)
    ), g;
    if (!l && !f)
      return null;
    f ? l ? g = l[4].length > f[4].length ? l : f : g = f : g = l;
    var v, m, _, b;
    r.length > t.length ? (v = g[0], m = g[1], _ = g[2], b = g[3]) : (_ = g[0], b = g[1], v = g[2], m = g[3]);
    var w = g[4];
    return [v, m, _, b, w];
  }, o.prototype.diff_cleanupSemantic = function(r) {
    for (var t = !1, n = [], s = 0, a = null, i = 0, l = 0, f = 0, g = 0, v = 0; i < r.length; )
      r[i][0] == d ? (n[s++] = i, l = g, f = v, g = 0, v = 0, a = r[i][1]) : (r[i][0] == p ? g += r[i][1].length : v += r[i][1].length, a && a.length <= Math.max(l, f) && a.length <= Math.max(
        g,
        v
      ) && (r.splice(
        n[s - 1],
        0,
        new o.Diff(u, a)
      ), r[n[s - 1] + 1][0] = p, s--, s--, i = s > 0 ? n[s - 1] : -1, l = 0, f = 0, g = 0, v = 0, a = null, t = !0)), i++;
    for (t && this.diff_cleanupMerge(r), this.diff_cleanupSemanticLossless(r), i = 1; i < r.length; ) {
      if (r[i - 1][0] == u && r[i][0] == p) {
        var m = r[i - 1][1], _ = r[i][1], b = this.diff_commonOverlap_(m, _), w = this.diff_commonOverlap_(_, m);
        b >= w ? (b >= m.length / 2 || b >= _.length / 2) && (r.splice(i, 0, new o.Diff(
          d,
          _.substring(0, b)
        )), r[i - 1][1] = m.substring(0, m.length - b), r[i + 1][1] = _.substring(b), i++) : (w >= m.length / 2 || w >= _.length / 2) && (r.splice(i, 0, new o.Diff(
          d,
          m.substring(0, w)
        )), r[i - 1][0] = p, r[i - 1][1] = _.substring(0, _.length - w), r[i + 1][0] = u, r[i + 1][1] = m.substring(w), i++), i++;
      }
      i++;
    }
  }, o.prototype.diff_cleanupSemanticLossless = function(r) {
    function t(w, D) {
      if (!w || !D)
        return 6;
      var y = w.charAt(w.length - 1), I = D.charAt(0), A = y.match(o.nonAlphaNumericRegex_), E = I.match(o.nonAlphaNumericRegex_), T = A && y.match(o.whitespaceRegex_), N = E && I.match(o.whitespaceRegex_), k = T && y.match(o.linebreakRegex_), C = N && I.match(o.linebreakRegex_), S = k && w.match(o.blanklineEndRegex_), V = C && D.match(o.blanklineStartRegex_);
      return S || V ? 5 : k || C ? 4 : A && !T && N ? 3 : T || N ? 2 : A || E ? 1 : 0;
    }
    for (var n = 1; n < r.length - 1; ) {
      if (r[n - 1][0] == d && r[n + 1][0] == d) {
        var s = r[n - 1][1], a = r[n][1], i = r[n + 1][1], l = this.diff_commonSuffix(s, a);
        if (l) {
          var f = a.substring(a.length - l);
          s = s.substring(0, s.length - l), a = f + a.substring(0, a.length - l), i = f + i;
        }
        for (var g = s, v = a, m = i, _ = t(s, a) + t(a, i); a.charAt(0) === i.charAt(0); ) {
          s += a.charAt(0), a = a.substring(1) + i.charAt(0), i = i.substring(1);
          var b = t(s, a) + t(a, i);
          b >= _ && (_ = b, g = s, v = a, m = i);
        }
        r[n - 1][1] != g && (g ? r[n - 1][1] = g : (r.splice(n - 1, 1), n--), r[n][1] = v, m ? r[n + 1][1] = m : (r.splice(n + 1, 1), n--));
      }
      n++;
    }
  }, o.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/, o.whitespaceRegex_ = /\s/, o.linebreakRegex_ = /[\r\n]/, o.blanklineEndRegex_ = /\n\r?\n$/, o.blanklineStartRegex_ = /^\r?\n\r?\n/, o.prototype.diff_cleanupEfficiency = function(r) {
    for (var t = !1, n = [], s = 0, a = null, i = 0, l = !1, f = !1, g = !1, v = !1; i < r.length; )
      r[i][0] == d ? (r[i][1].length < this.Diff_EditCost && (g || v) ? (n[s++] = i, l = g, f = v, a = r[i][1]) : (s = 0, a = null), g = v = !1) : (r[i][0] == u ? v = !0 : g = !0, a && (l && f && g && v || a.length < this.Diff_EditCost / 2 && l + f + g + v == 3) && (r.splice(
        n[s - 1],
        0,
        new o.Diff(u, a)
      ), r[n[s - 1] + 1][0] = p, s--, a = null, l && f ? (g = v = !0, s = 0) : (s--, i = s > 0 ? n[s - 1] : -1, g = v = !1), t = !0)), i++;
    t && this.diff_cleanupMerge(r);
  }, o.prototype.diff_cleanupMerge = function(r) {
    r.push(new o.Diff(d, ""));
    for (var t = 0, n = 0, s = 0, a = "", i = "", l; t < r.length; )
      switch (r[t][0]) {
        case p:
          s++, i += r[t][1], t++;
          break;
        case u:
          n++, a += r[t][1], t++;
          break;
        case d:
          n + s > 1 ? (n !== 0 && s !== 0 && (l = this.diff_commonPrefix(i, a), l !== 0 && (t - n - s > 0 && r[t - n - s - 1][0] == d ? r[t - n - s - 1][1] += i.substring(0, l) : (r.splice(0, 0, new o.Diff(
            d,
            i.substring(0, l)
          )), t++), i = i.substring(l), a = a.substring(l)), l = this.diff_commonSuffix(i, a), l !== 0 && (r[t][1] = i.substring(i.length - l) + r[t][1], i = i.substring(0, i.length - l), a = a.substring(0, a.length - l))), t -= n + s, r.splice(t, n + s), a.length && (r.splice(
            t,
            0,
            new o.Diff(u, a)
          ), t++), i.length && (r.splice(
            t,
            0,
            new o.Diff(p, i)
          ), t++), t++) : t !== 0 && r[t - 1][0] == d ? (r[t - 1][1] += r[t][1], r.splice(t, 1)) : t++, s = 0, n = 0, a = "", i = "";
          break;
      }
    r[r.length - 1][1] === "" && r.pop();
    var f = !1;
    for (t = 1; t < r.length - 1; )
      r[t - 1][0] == d && r[t + 1][0] == d && (r[t][1].substring(r[t][1].length - r[t - 1][1].length) == r[t - 1][1] ? (r[t][1] = r[t - 1][1] + r[t][1].substring(0, r[t][1].length - r[t - 1][1].length), r[t + 1][1] = r[t - 1][1] + r[t + 1][1], r.splice(t - 1, 1), f = !0) : r[t][1].substring(0, r[t + 1][1].length) == r[t + 1][1] && (r[t - 1][1] += r[t + 1][1], r[t][1] = r[t][1].substring(r[t + 1][1].length) + r[t + 1][1], r.splice(t + 1, 1), f = !0)), t++;
    f && this.diff_cleanupMerge(r);
  }, o.prototype.diff_xIndex = function(r, t) {
    var n = 0, s = 0, a = 0, i = 0, l;
    for (l = 0; l < r.length && (r[l][0] !== p && (n += r[l][1].length), r[l][0] !== u && (s += r[l][1].length), !(n > t)); l++)
      a = n, i = s;
    return r.length != l && r[l][0] === u ? i : i + (t - a);
  }, o.prototype.diff_prettyHtml = function(r) {
    for (var t = [], n = /&/g, s = /</g, a = />/g, i = /\n/g, l = 0; l < r.length; l++) {
      var f = r[l][0], g = r[l][1], v = g.replace(n, "&amp;").replace(s, "&lt;").replace(a, "&gt;").replace(i, "&para;<br>");
      switch (f) {
        case p:
          t[l] = '<ins style="background:#e6ffe6;">' + v + "</ins>";
          break;
        case u:
          t[l] = '<del style="background:#ffe6e6;">' + v + "</del>";
          break;
        case d:
          t[l] = "<span>" + v + "</span>";
          break;
      }
    }
    return t.join("");
  }, o.prototype.diff_text1 = function(r) {
    for (var t = [], n = 0; n < r.length; n++)
      r[n][0] !== p && (t[n] = r[n][1]);
    return t.join("");
  }, o.prototype.diff_text2 = function(r) {
    for (var t = [], n = 0; n < r.length; n++)
      r[n][0] !== u && (t[n] = r[n][1]);
    return t.join("");
  }, o.prototype.diff_levenshtein = function(r) {
    for (var t = 0, n = 0, s = 0, a = 0; a < r.length; a++) {
      var i = r[a][0], l = r[a][1];
      switch (i) {
        case p:
          n += l.length;
          break;
        case u:
          s += l.length;
          break;
        case d:
          t += Math.max(n, s), n = 0, s = 0;
          break;
      }
    }
    return t += Math.max(n, s), t;
  }, o.prototype.diff_toDelta = function(r) {
    for (var t = [], n = 0; n < r.length; n++)
      switch (r[n][0]) {
        case p:
          t[n] = "+" + encodeURI(r[n][1]);
          break;
        case u:
          t[n] = "-" + r[n][1].length;
          break;
        case d:
          t[n] = "=" + r[n][1].length;
          break;
      }
    return t.join("	").replace(/%20/g, " ");
  }, o.prototype.diff_fromDelta = function(r, t) {
    for (var n = [], s = 0, a = 0, i = t.split(/\t/g), l = 0; l < i.length; l++) {
      var f = i[l].substring(1);
      switch (i[l].charAt(0)) {
        case "+":
          try {
            n[s++] = new o.Diff(p, decodeURI(f));
          } catch (m) {
            throw new Error("Illegal escape in diff_fromDelta: " + f);
          }
          break;
        case "-":
        case "=":
          var g = parseInt(f, 10);
          if (isNaN(g) || g < 0)
            throw new Error("Invalid number in diff_fromDelta: " + f);
          var v = r.substring(a, a += g);
          i[l].charAt(0) == "=" ? n[s++] = new o.Diff(d, v) : n[s++] = new o.Diff(u, v);
          break;
        default:
          if (i[l])
            throw new Error("Invalid diff operation in diff_fromDelta: " + i[l]);
      }
    }
    if (a != r.length)
      throw new Error("Delta length (" + a + ") does not equal source text length (" + r.length + ").");
    return n;
  }, o.prototype.match_main = function(r, t, n) {
    if (r == null || t == null || n == null)
      throw new Error("Null input. (match_main)");
    return n = Math.max(0, Math.min(n, r.length)), r == t ? 0 : r.length ? r.substring(n, n + t.length) == t ? n : this.match_bitap_(r, t, n) : -1;
  }, o.prototype.match_bitap_ = function(r, t, n) {
    if (t.length > this.Match_MaxBits)
      throw new Error("Pattern too long for this browser.");
    var s = this.match_alphabet_(t), a = this;
    function i(N, k) {
      var C = N / t.length, S = Math.abs(n - k);
      return a.Match_Distance ? C + S / a.Match_Distance : S ? 1 : C;
    }
    var l = this.Match_Threshold, f = r.indexOf(t, n);
    f != -1 && (l = Math.min(i(0, f), l), f = r.lastIndexOf(t, n + t.length), f != -1 && (l = Math.min(i(0, f), l)));
    var g = 1 << t.length - 1;
    f = -1;
    for (var v, m, _ = t.length + r.length, b, w = 0; w < t.length; w++) {
      for (v = 0, m = _; v < m; )
        i(w, n + m) <= l ? v = m : _ = m, m = Math.floor((_ - v) / 2 + v);
      _ = m;
      var D = Math.max(1, n - m + 1), y = Math.min(n + m, r.length) + t.length, I = Array(y + 2);
      I[y + 1] = (1 << w) - 1;
      for (var A = y; A >= D; A--) {
        var E = s[r.charAt(A - 1)];
        if (w === 0 ? I[A] = (I[A + 1] << 1 | 1) & E : I[A] = (I[A + 1] << 1 | 1) & E | ((b[A + 1] | b[A]) << 1 | 1) | b[A + 1], I[A] & g) {
          var T = i(w, A - 1);
          if (T <= l)
            if (l = T, f = A - 1, f > n)
              D = Math.max(1, 2 * n - f);
            else
              break;
        }
      }
      if (i(w + 1, n) > l)
        break;
      b = I;
    }
    return f;
  }, o.prototype.match_alphabet_ = function(r) {
    for (var t = {}, n = 0; n < r.length; n++)
      t[r.charAt(n)] = 0;
    for (var n = 0; n < r.length; n++)
      t[r.charAt(n)] |= 1 << r.length - n - 1;
    return t;
  }, o.prototype.patch_addContext_ = function(r, t) {
    if (t.length != 0) {
      if (r.start2 === null)
        throw Error("patch not initialized");
      for (var n = t.substring(r.start2, r.start2 + r.length1), s = 0; t.indexOf(n) != t.lastIndexOf(n) && n.length < this.Match_MaxBits - this.Patch_Margin - this.Patch_Margin; )
        s += this.Patch_Margin, n = t.substring(
          r.start2 - s,
          r.start2 + r.length1 + s
        );
      s += this.Patch_Margin;
      var a = t.substring(r.start2 - s, r.start2);
      a && r.diffs.unshift(new o.Diff(d, a));
      var i = t.substring(
        r.start2 + r.length1,
        r.start2 + r.length1 + s
      );
      i && r.diffs.push(new o.Diff(d, i)), r.start1 -= a.length, r.start2 -= a.length, r.length1 += a.length + i.length, r.length2 += a.length + i.length;
    }
  }, o.prototype.patch_make = function(r, t, n) {
    var s, a;
    if (typeof r == "string" && typeof t == "string" && typeof n > "u")
      s = /** @type {string} */
      r, a = this.diff_main(
        s,
        /** @type {string} */
        t,
        !0
      ), a.length > 2 && (this.diff_cleanupSemantic(a), this.diff_cleanupEfficiency(a));
    else if (r && typeof r == "object" && typeof t > "u" && typeof n > "u")
      a = /** @type {!Array.<!diff_match_patch.Diff>} */
      r, s = this.diff_text1(a);
    else if (typeof r == "string" && t && typeof t == "object" && typeof n > "u")
      s = /** @type {string} */
      r, a = /** @type {!Array.<!diff_match_patch.Diff>} */
      t;
    else if (typeof r == "string" && typeof t == "string" && n && typeof n == "object")
      s = /** @type {string} */
      r, a = /** @type {!Array.<!diff_match_patch.Diff>} */
      n;
    else
      throw new Error("Unknown call format to patch_make.");
    if (a.length === 0)
      return [];
    for (var i = [], l = new o.patch_obj(), f = 0, g = 0, v = 0, m = s, _ = s, b = 0; b < a.length; b++) {
      var w = a[b][0], D = a[b][1];
      switch (!f && w !== d && (l.start1 = g, l.start2 = v), w) {
        case p:
          l.diffs[f++] = a[b], l.length2 += D.length, _ = _.substring(0, v) + D + _.substring(v);
          break;
        case u:
          l.length1 += D.length, l.diffs[f++] = a[b], _ = _.substring(0, v) + _.substring(v + D.length);
          break;
        case d:
          D.length <= 2 * this.Patch_Margin && f && a.length != b + 1 ? (l.diffs[f++] = a[b], l.length1 += D.length, l.length2 += D.length) : D.length >= 2 * this.Patch_Margin && f && (this.patch_addContext_(l, m), i.push(l), l = new o.patch_obj(), f = 0, m = _, g = v);
          break;
      }
      w !== p && (g += D.length), w !== u && (v += D.length);
    }
    return f && (this.patch_addContext_(l, m), i.push(l)), i;
  }, o.prototype.patch_deepCopy = function(r) {
    for (var t = [], n = 0; n < r.length; n++) {
      var s = r[n], a = new o.patch_obj();
      a.diffs = [];
      for (var i = 0; i < s.diffs.length; i++)
        a.diffs[i] = new o.Diff(s.diffs[i][0], s.diffs[i][1]);
      a.start1 = s.start1, a.start2 = s.start2, a.length1 = s.length1, a.length2 = s.length2, t[n] = a;
    }
    return t;
  }, o.prototype.patch_apply = function(r, t) {
    if (r.length == 0)
      return [t, []];
    r = this.patch_deepCopy(r);
    var n = this.patch_addPadding(r);
    t = n + t + n, this.patch_splitMax(r);
    for (var s = 0, a = [], i = 0; i < r.length; i++) {
      var l = r[i].start2 + s, f = this.diff_text1(r[i].diffs), g, v = -1;
      if (f.length > this.Match_MaxBits ? (g = this.match_main(
        t,
        f.substring(0, this.Match_MaxBits),
        l
      ), g != -1 && (v = this.match_main(
        t,
        f.substring(f.length - this.Match_MaxBits),
        l + f.length - this.Match_MaxBits
      ), (v == -1 || g >= v) && (g = -1))) : g = this.match_main(t, f, l), g == -1)
        a[i] = !1, s -= r[i].length2 - r[i].length1;
      else {
        a[i] = !0, s = g - l;
        var m;
        if (v == -1 ? m = t.substring(g, g + f.length) : m = t.substring(g, v + this.Match_MaxBits), f == m)
          t = t.substring(0, g) + this.diff_text2(r[i].diffs) + t.substring(g + f.length);
        else {
          var _ = this.diff_main(f, m, !1);
          if (f.length > this.Match_MaxBits && this.diff_levenshtein(_) / f.length > this.Patch_DeleteThreshold)
            a[i] = !1;
          else {
            this.diff_cleanupSemanticLossless(_);
            for (var b = 0, w, D = 0; D < r[i].diffs.length; D++) {
              var y = r[i].diffs[D];
              y[0] !== d && (w = this.diff_xIndex(_, b)), y[0] === p ? t = t.substring(0, g + w) + y[1] + t.substring(g + w) : y[0] === u && (t = t.substring(0, g + w) + t.substring(g + this.diff_xIndex(
                _,
                b + y[1].length
              ))), y[0] !== u && (b += y[1].length);
            }
          }
        }
      }
    }
    return t = t.substring(n.length, t.length - n.length), [t, a];
  }, o.prototype.patch_addPadding = function(r) {
    for (var t = this.Patch_Margin, n = "", s = 1; s <= t; s++)
      n += String.fromCharCode(s);
    for (var s = 0; s < r.length; s++)
      r[s].start1 += t, r[s].start2 += t;
    var a = r[0], i = a.diffs;
    if (i.length == 0 || i[0][0] != d)
      i.unshift(new o.Diff(d, n)), a.start1 -= t, a.start2 -= t, a.length1 += t, a.length2 += t;
    else if (t > i[0][1].length) {
      var l = t - i[0][1].length;
      i[0][1] = n.substring(i[0][1].length) + i[0][1], a.start1 -= l, a.start2 -= l, a.length1 += l, a.length2 += l;
    }
    if (a = r[r.length - 1], i = a.diffs, i.length == 0 || i[i.length - 1][0] != d)
      i.push(new o.Diff(d, n)), a.length1 += t, a.length2 += t;
    else if (t > i[i.length - 1][1].length) {
      var l = t - i[i.length - 1][1].length;
      i[i.length - 1][1] += n.substring(0, l), a.length1 += l, a.length2 += l;
    }
    return n;
  }, o.prototype.patch_splitMax = function(r) {
    for (var t = this.Match_MaxBits, n = 0; n < r.length; n++)
      if (!(r[n].length1 <= t)) {
        var s = r[n];
        r.splice(n--, 1);
        for (var a = s.start1, i = s.start2, l = ""; s.diffs.length !== 0; ) {
          var f = new o.patch_obj(), g = !0;
          for (f.start1 = a - l.length, f.start2 = i - l.length, l !== "" && (f.length1 = f.length2 = l.length, f.diffs.push(new o.Diff(d, l))); s.diffs.length !== 0 && f.length1 < t - this.Patch_Margin; ) {
            var v = s.diffs[0][0], m = s.diffs[0][1];
            v === p ? (f.length2 += m.length, i += m.length, f.diffs.push(s.diffs.shift()), g = !1) : v === u && f.diffs.length == 1 && f.diffs[0][0] == d && m.length > 2 * t ? (f.length1 += m.length, a += m.length, g = !1, f.diffs.push(new o.Diff(v, m)), s.diffs.shift()) : (m = m.substring(
              0,
              t - f.length1 - this.Patch_Margin
            ), f.length1 += m.length, a += m.length, v === d ? (f.length2 += m.length, i += m.length) : g = !1, f.diffs.push(new o.Diff(v, m)), m == s.diffs[0][1] ? s.diffs.shift() : s.diffs[0][1] = s.diffs[0][1].substring(m.length));
          }
          l = this.diff_text2(f.diffs), l = l.substring(l.length - this.Patch_Margin);
          var _ = this.diff_text1(s.diffs).substring(0, this.Patch_Margin);
          _ !== "" && (f.length1 += _.length, f.length2 += _.length, f.diffs.length !== 0 && f.diffs[f.diffs.length - 1][0] === d ? f.diffs[f.diffs.length - 1][1] += _ : f.diffs.push(new o.Diff(d, _))), g || r.splice(++n, 0, f);
        }
      }
  }, o.prototype.patch_toText = function(r) {
    for (var t = [], n = 0; n < r.length; n++)
      t[n] = r[n];
    return t.join("");
  }, o.prototype.patch_fromText = function(r) {
    var t = [];
    if (!r)
      return t;
    for (var n = r.split("\n"), s = 0, a = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/; s < n.length; ) {
      var i = n[s].match(a);
      if (!i)
        throw new Error("Invalid patch string: " + n[s]);
      var l = new o.patch_obj();
      for (t.push(l), l.start1 = parseInt(i[1], 10), i[2] === "" ? (l.start1--, l.length1 = 1) : i[2] == "0" ? l.length1 = 0 : (l.start1--, l.length1 = parseInt(i[2], 10)), l.start2 = parseInt(i[3], 10), i[4] === "" ? (l.start2--, l.length2 = 1) : i[4] == "0" ? l.length2 = 0 : (l.start2--, l.length2 = parseInt(i[4], 10)), s++; s < n.length; ) {
        var f = n[s].charAt(0);
        try {
          var g = decodeURI(n[s].substring(1));
        } catch (v) {
          throw new Error("Illegal escape in patch_fromText: " + g);
        }
        if (f == "-")
          l.diffs.push(new o.Diff(u, g));
        else if (f == "+")
          l.diffs.push(new o.Diff(p, g));
        else if (f == " ")
          l.diffs.push(new o.Diff(d, g));
        else {
          if (f == "@")
            break;
          if (f !== "")
            throw new Error('Invalid patch mode "' + f + '" in: ' + g);
        }
        s++;
      }
    }
    return t;
  }, o.patch_obj = function() {
    this.diffs = [], this.start1 = null, this.start2 = null, this.length1 = 0, this.length2 = 0;
  }, o.patch_obj.prototype.toString = function() {
    var r, t;
    this.length1 === 0 ? r = this.start1 + ",0" : this.length1 == 1 ? r = this.start1 + 1 : r = this.start1 + 1 + "," + this.length1, this.length2 === 0 ? t = this.start2 + ",0" : this.length2 == 1 ? t = this.start2 + 1 : t = this.start2 + 1 + "," + this.length2;
    for (var n = ["@@ -" + r + " +" + t + " @@\n"], s, a = 0; a < this.diffs.length; a++) {
      switch (this.diffs[a][0]) {
        case p:
          s = "+";
          break;
        case u:
          s = "-";
          break;
        case d:
          s = " ";
          break;
      }
      n[a + 1] = s + encodeURI(this.diffs[a][1]) + "\n";
    }
    return n.join("").replace(/%20/g, " ");
  }, M.exports = o, M.exports.diff_match_patch = o, M.exports.DIFF_DELETE = u, M.exports.DIFF_INSERT = p, M.exports.DIFF_EQUAL = d;
})(diffMatchPatch);
var diffMatchPatchExports = diffMatchPatch.exports;
class Util {
  constructor() {
    /**
     * diff-match-patch 实例
     *
     * @memberof Util
     */
    P(this, "dmp");
    /**
     * 比对标签的集合
     *
     * @memberof Util
     */
    P(this, "tagMap", {});
    /**
     * unicode初始值
     *
     * @memberof Util
     */
    P(this, "unicodeRangeStart", 57344);
    /**
     * 标签集合的长度
     *
     * @memberof Util
     */
    P(this, "mapLength", 0);
    this.init();
  }
  init() {
    this.dmp = new diffMatchPatchExports.diff_match_patch();
  }
  parseHTML(o) {
    return new DOMParser().parseFromString(o, "text/html").body;
  }
  isSameNode(o, u) {
    return !o || !u || o.nodeType !== u.nodeType ? !1 : o.nodeType === Node.TEXT_NODE ? !0 : o.tagName === u.tagName;
  }
  markInsert(o) {
    const u = document.createElement("span");
    u.className = "add-text", u.appendChild(o.cloneNode(!0)), o.replaceWith(u);
  }
  markDelete(o) {
    const u = document.createElement("span");
    u.className = "remove-text", u.appendChild(o.cloneNode(!0)), o.replaceWith(u);
  }
  diffChildren(o, u) {
    const p = Array.from(o.childNodes), d = Array.from(u.childNodes);
    let r = 0, t = 0;
    for (; r < p.length || t < d.length; ) {
      const n = p[r], s = d[t];
      if (!n && s) {
        this.markInsert(s), t++;
        continue;
      }
      if (n && !s) {
        this.markDelete(n), r++;
        continue;
      }
      this.isSameNode(n, s) ? (this.diffDOM(n, s), r++, t++) : (this.markInsert(s), t++);
    }
  }
  diffTextNode(o, u) {
    const p = o.textContent, d = u.textContent;
    if (p === d)
      return;
    const r = this.dmp.diff_main(p, d);
    this.dmp.diff_cleanupSemantic(r);
    const t = document.createDocumentFragment();
    r.forEach(([n, s]) => {
      if (s) {
        if (n === diffMatchPatchExports.diff_match_patch.DIFF_EQUAL && t.appendChild(document.createTextNode(s)), n === diffMatchPatchExports.diff_match_patch.DIFF_INSERT) {
          const a = document.createElement("span");
          a.className = "add-text", a.textContent = s, t.appendChild(a);
        }
        if (n === diffMatchPatchExports.diff_match_patch.DIFF_DELETE) {
          const a = document.createElement("span");
          a.className = "remove-text", a.textContent = s, t.appendChild(a);
        }
      }
    }), u.parentNode.replaceChild(t, u);
  }
  diffDOM(o, u) {
    if (!o && u) {
      this.markInsert(u);
      return;
    }
    if (o && !u) {
      this.markDelete(o);
      return;
    }
    if (!this.isSameNode(o, u)) {
      this.markDelete(o), this.markInsert(u);
      return;
    }
    if (o.nodeType === Node.TEXT_NODE && u.nodeType === Node.TEXT_NODE) {
      this.diffTextNode(o, u);
      return;
    }
    u.tagName === "PRE" || u.tagName === "CODE" || this.diffChildren(o, u);
  }
  /**
   * 字符串比对方法
   *
   * @param {string} oldValue 旧值
   * @param {string} newValue 新值
   * @returns {string} 比对结果字符串
   * @memberof Util
   */
  doDiff(o, u) {
    const p = this.parseHTML(o), d = this.parseHTML(u);
    return this.diffDOM(p, d), { newValue: d.innerHTML, oldValue: p.innerHTML };
  }
}
const detectFormat = (M = "") => {
  if (typeof M != "string")
    return "TEXT";
  const o = M.trim();
  if (!o)
    return "TEXT";
  const u = o.replaceAll(
    /<span style="(.+?)">(.*?)<\/span>/g,
    (n, s, a) => a
  ), p = /<(?:html|head|body|div|p|br|hr|h[1-6]|ul|ol|li|table|tr|td|a\s|img\s|script|style)[\s>\\/]/i, d = (u.match(p) ? 2 : 0) + (u.includes("</") ? 1 : 0) + (/<[a-z]+\s*\/?>/i.test(u) ? 1 : 0), r = /^(```|#{1,6}\s|>\s|\*\s|\+\s|-\s|\d+\.\s|_{2}[^_]+_{2}|_{1}[^_]+_{1}|`[^`]+`|\[.*?\]\(.*?\)|!\[.*?\]\(.*?\)|\*\*.*\*\*|\*.*\*)/m, t = (u.match(r) ? 2 : 0) + (/\[.*?\]\(.*?\)/.test(u) ? 1 : 0) + // 链接
  (/\*\*.*\*\*/.test(u) ? 1 : 0) + // 加粗
  (/^#{1,6}\s+/m.test(u) ? 1 : 0);
  return d > t ? "HTML" : t > 0 ? "MD" : "TEXT";
}, formatSvg = (M) => M.replace(/<\?xml(.+?)>/, "").replaceAll("\n", "").replaceAll(/>([\s]*)</g, "><"), unEscapeHtml = (M) => M.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/'&#39;/g, "'"), stepContrast = "", StepContrast = /* @__PURE__ */ defineComponent({
  name: "StepContrast",
  props: {
    item: {
      type: Object,
      required: !0
    },
    controller: {
      type: Object,
      required: !0
    },
    modal: {
      type: Object
    }
  },
  setup(M) {
    const o = useNamespace("contrast-modal"), u = new Util(), p = M.controller, d = computed(() => {
      let v = M.item.oldValue;
      return M.item.name === "STEPS" && v && (v = JSON.parse(v)), v;
    }), r = computed(() => {
      let v = M.item.newValue;
      return M.item.name === "STEPS" && v && (v = JSON.parse(v)), v;
    }), t = ref({}), n = () => {
      const m = detectFormat(d.value) === "MD" ? p.vditor.vditor.lute.SpinVditorIRDOM(d.value) : d.value, b = detectFormat(r.value) === "MD" ? p.vditor.vditor.lute.SpinVditorIRDOM(r.value) : r.value;
      return u.doDiff(m || "", b || "");
    };
    watch(() => [d.value, r.value], () => {
      t.value = n();
    }, {
      immediate: !0
    });
    const s = computed(() => {
      const v = [];
      let m = 0, _ = 0;
      return isArray(d.value) && d.value.forEach((b, w) => {
        b.is_group || !w || !b.group_id ? (m++, _ = 0, v.push("".concat(m))) : (_++, v.push("".concat(m, ".").concat(_)));
      }), v;
    }), a = computed(() => {
      const v = [];
      let m = 0, _ = 0;
      return isArray(r.value) && r.value.forEach((b, w) => {
        b.is_group || !w || !b.group_id ? (m++, _ = 0, v.push("".concat(m))) : (_++, v.push("".concat(m, ".").concat(_)));
      }), v;
    }), i = (v) => (v === "oldValue" ? d.value : r.value).map((_, b) => createVNode("tr", null, [createVNode("td", {
      class: "number-column"
    }, [v === "oldValue" ? s.value[b] : a.value[b]]), createVNode("td", {
      class: "description-column",
      colspan: _.is_group ? 2 : 1
    }, [_.is_group ? _.name : _.description]), !_.is_group && createVNode("td", {
      class: "expected-column"
    }, [_.expected_value])])), l = (v) => createVNode("table", {
      class: "steps-table"
    }, [createVNode("tr", {
      class: "table-header"
    }, [createVNode("td", {
      class: "number-column"
    }, [createTextVNode("#")]), createVNode("td", {
      class: "description-column"
    }, [createTextVNode("步骤描述")]), createVNode("td", {
      class: "expected-column"
    }, [createTextVNode("预期结果")])]), i(v)]), f = (v) => {
      const m = p.transformNode(t.value[v]);
      return createVNode("div", {
        class: "html vditor-reset",
        innerHTML: m
      }, null);
    };
    return {
      ns: o,
      renderContainer: (v) => createVNode("div", {
        class: o.e("container")
      }, [M.item.name === "STEPS" ? l(v) : f(v)])
    };
  },
  render() {
    return createVNode("div", {
      class: [this.ns.b(), this.ns.e("".concat(this.item.name.toLowerCase()))]
    }, [createVNode("div", {
      class: this.ns.e("modal-title")
    }, [createTextVNode("变更对比")]), createVNode("div", {
      class: this.ns.e("modal-content")
    }, [createVNode("div", {
      class: this.ns.m("change-content")
    }, [createVNode("div", {
      class: "before-change"
    }, [createVNode("span", null, [createTextVNode("变更前")])]), this.renderContainer("oldValue")]), createVNode("div", {
      class: this.ns.m("change-content")
    }, [createVNode("div", {
      class: "after-change"
    }, [createVNode("span", null, [createTextVNode("变更后")]), this.item.name !== "STEPS" && createVNode("span", {
      class: "inserted"
    }, [createTextVNode("新增 "), createVNode("span", {
      class: "add state"
    }, null), createTextVNode("删除 "), createVNode("span", {
      class: "remove state"
    }, null)])]), this.renderContainer("newValue")])])]);
  }
});
class RawActivityEditorController extends EditorController {
  constructor() {
    super(...arguments);
    /**
     * 模态容器
     *
     * @type {(IOverlayContainer | null)}
     * @memberof RawActivityEditorController
     */
    P(this, "modal", null);
    /**
     * 编辑器实例
     */
    P(this, "vditor");
    /**
     * @description 图标代码表标识
     * @type {string}
     * @memberof CommentItemRawItemEditorController
     */
    P(this, "iconCodeListId", "plmweb.base__recent_visite");
    /**
     * @description 代码表数据
     * @type {readonly}
     * @memberof CommentItemRawItemEditorController
     */
    P(this, "codeListItems", []);
    /**
     * @description 标识map
     * @type {Map<string, string>}
     * @memberof RawActivityEditorController
     */
    P(this, "tagMap", /* @__PURE__ */ new Map());
  }
  /**
   * @description 动态加载脚本
   * @param {string} url
   * @returns {*}  {Promise<IData>}
   * @memberof RawActivityEditorController
   */
  addScript(u) {
    return new Promise((p, d) => {
      const r = document.createElement("script");
      r.src = u, r.onload = p, r.onerror = d, document.head.appendChild(r);
    });
  }
  /**
   * @description 动态加载样式
   * @param {string} url
   * @returns {*}  {Promise<IData>}
   * @memberof RawActivityEditorController
   */
  addStyle(u) {
    return new Promise((p, d) => {
      const r = document.createElement("link");
      r.rel = "stylesheet", r.href = u, r.onload = p, r.onerror = d, document.head.appendChild(r);
    });
  }
  loadVditor() {
    return new Promise((u, p) => {
      const { Vditor: d } = window;
      if (d)
        u();
      else {
        const r = [
          this.addStyle(resource.dir("vditor/dist/index.css")),
          this.addScript(resource.dir("vditor/dist/index.js"))
        ];
        Promise.all(r).then(() => {
          u();
        }).catch(() => {
          ibiz.message.error(
            "加载vditor静态资源失败,请确认静态资源是否存在！"
          ), p();
        });
      }
    });
  }
  async onInit() {
    await super.onInit(), await this.loadVditor();
    const { ICONCODELISTID: u } = this.editorParams;
    u && (this.iconCodeListId = u), this.codeListItems = await this.loadCodeList(this.iconCodeListId);
  }
  /**
   * 加载代码表
   *
   * @param {string} appCodeListId
   * @return {*}  {(Promise<readonly CodeListItem[]>)}
   * @memberof CommentItemRawItemEditorController
   */
  async loadCodeList(u) {
    return await ibiz.hub.getApp().codeList.get(
      u,
      this.context,
      this.params
    );
  }
  findCodeListItem(u, p) {
    if (u) {
      const d = u.find((r) => r.value == p);
      if (d)
        return d;
      for (let r = 0; r < u.length; r++) {
        const t = this.findCodeListItem(
          u[r].children,
          p
        );
        if (t)
          return t;
      }
    }
  }
  spinVditorStyle(u) {
    const p = /<span style="([^>]+?)">(.*?)<\/span>/g, d = u;
    if (d.match(p)) {
      const r = [];
      return { match: !0, html: d.replaceAll(p, (n, s) => {
        if (s) {
          const a = createUUID();
          return r.push({
            uuid: a,
            replace: n
          }), a;
        }
        return n;
      }), replace: r };
    }
    return { match: !1, html: u };
  }
  spinVditorAddNode(u) {
    const p = /<span class='add-text'>(.+?)<\/span>/g, d = u;
    if (d.match(p)) {
      const r = [];
      return { match: !0, html: d.replaceAll(p, (n, s) => {
        if (s) {
          const a = createUUID();
          return r.push({
            uuid: a,
            replace: n
          }), a;
        }
        return n;
      }), replace: r };
    }
    return { match: !1, html: u };
  }
  spinVditorRemoveNode(u) {
    const p = /<span class='remove-text'>(.+?)<\/span>/g, d = u;
    if (d.match(p)) {
      const r = [];
      return { match: !0, html: d.replaceAll(p, (n, s) => {
        if (s) {
          const a = createUUID();
          return r.push({
            uuid: a,
            replace: n
          }), a;
        }
        return n;
      }), replace: r };
    }
    return { match: !1, html: u };
  }
  adaptImageStyle(u) {
    const p = /<img src="(.+?)"(.*?)(\/*)>/g;
    if (u.match(p)) {
      const d = [];
      return u.replaceAll(p, (r, t, n) => (t && d.push({
        url: t,
        attr: n,
        html: r
      }), r)), d;
    }
    return [];
  }
  handleHardBreak(u) {
    let p = u;
    return p = p.replaceAll(
      /<p data-block="0"><\/p>/g,
      '<p data-block="0"><wbr></p>'
    ), p = p.replaceAll(
      /<p data-block="0">\n<\/p>/g,
      '<p data-block="0"><wbr></p>'
    ), p = p.replaceAll(
      /<p data-block="0"><br><\/p>/g,
      '<p data-block="0"><wbr></p>'
    ), p;
  }
  /**
   * @description ir编辑模式转换dom
   * @param {string} markdown
   * @param {string} value
   * @returns {*}  {string}
   * @memberof VditorController
   */
  spinVditorIRDOM(u, p) {
    let d = u;
    const r = this.spinVditorStyle(d);
    r.match && (d = r.html);
    const t = this.spinVditorAddNode(d);
    t.match && (d = t.html);
    const n = this.spinVditorAddNode(d);
    n.match && (d = n.html), d = this.handleHardBreak(d);
    const s = this.adaptImageStyle(d);
    let a = p(d);
    return r.match && r.replace.forEach((i) => {
      a = a.replaceAll(i.uuid, i.replace);
    }), t.match && t.replace.forEach((i) => {
      a = a.replaceAll(i.uuid, i.replace);
    }), n.match && n.replace.forEach((i) => {
      a = a.replaceAll(i.uuid, i.replace);
    }), s.length && (a = a.replaceAll(
      /<img src="(.+?)"(.*?)(\/*)>/g,
      (i, l) => {
        const f = s.find((g) => g.url === l);
        return f ? '<img src="'.concat(f.url, '"').concat(f.attr, "/>") : i;
      }
    )), a;
  }
  /**
   * @description 绘制完成
   * @memberof VditorController
   */
  renderAfter() {
    const { lute: u } = this.vditor.vditor, p = u.SpinVditorIRDOM;
    u.SpinVditorIRDOM = (d) => this.spinVditorIRDOM(d, p);
  }
  /**
   * 打开对照模态
   *
   * @param {{ name: string, newValue: string, oldValue: string }} item
   * @return {*}
   * @memberof RawActivityEditorController
   */
  async openContrastModal(u) {
    return this.modal = ibiz.overlay.createModal(
      (d) => h(StepContrast, {
        item: u,
        modal: d,
        controller: this
      }),
      void 0,
      { width: "90%", height: "90%" }
    ), await this.modal.present(), (await this.modal.onWillDismiss()).data || [];
  }
  transformNode(u) {
    let p = unEscapeHtml(u);
    return p = this.spinMarker(p), p = this.spinMention(p), p;
  }
  spinMarker(u) {
    const p = /#{"id":"(.+?)","name":"(.+?)","identifier":"(.+?)","owner_id":"(.+?)","owner_type":"(.+?)","owner_subtype":"(.+?)","recent_parent":"(.+?)"}/g, d = u;
    if (d.match(p))
      return d.replaceAll(
        p,
        (n, s, a, i, l, f, g) => {
          var v;
          if (s && a) {
            let m = g, _ = i, b = a;
            if (n.includes("remove-text")) {
              const y = n.replaceAll(/<span class="remove-text">(.+?)<\/span>/g, "$1").replaceAll(/<span class="add-text">(.+?)<\/span>/g, ""), I = JSON.parse(y.slice(1)), A = n.replaceAll(/<span class="remove-text">(.+?)<\/span>/g, "").replaceAll(/<span class="add-text">(.+?)<\/span>/g, "$1"), E = JSON.parse(A.slice(1));
              m = E.owner_subtype, _ = '<span class="remove-text">'.concat(I.identifier, '</span><span class="add-text">').concat(E.identifier, "</span>"), b = '<span class="remove-text">'.concat(I.name, '</span><span class="add-text">').concat(E.name, "</span>");
            }
            let w = "";
            if (m) {
              const y = this.findCodeListItem(this.codeListItems, m);
              y && ((v = y.sysImage) != null && v.rawContent) && (w = formatSvg(y.sysImage.rawContent));
            }
            return '<span contenteditable="false" class="marker"><span class="marker-icon">'.concat(w, '</span><span class="marker-identifier">').concat(_, '</span><span class="marker-name">').concat(b, "</span></span>");
          }
          return n;
        }
      );
    const r = /#{(".+?":".+?")(,"icon":"((.|[\t\r\f\n\s])+?)")*}/g;
    return d.match(r) ? d.replaceAll(
      r,
      (n, s, a, i) => {
        if (s && i) {
          const l = JSON.parse("{".concat(s, "}")), { name: f, identifier: g } = l;
          return i && (i = formatSvg(i)), '<span contenteditable="false" class="marker"><span class="marker-icon">'.concat(i, '</span><span class="marker-identifier">').concat(g, '</span><span class="marker-name">').concat(f, "</span></span>");
        }
        return n;
      }
    ) : u;
  }
  spinMention(u) {
    const p = /@{"(user)?id":"(.+?)","name":"(.+?)"}/g;
    return u.match(p) ? u.replaceAll(
      p,
      (r, t, n, s) => n && s ? '<span contenteditable="false" class="mention">@'.concat(s, "</span>") : r
    ) : u;
  }
}
class RawActivityEditorProvider {
  constructor() {
    P(this, "formEditor", "RawActivity");
    P(this, "gridEditor", "RawActivity");
  }
  async createController(o, u) {
    const p = new RawActivityEditorController(o, u);
    return await p.init(), p;
  }
}
const IBizRawActivity = withInstall(RawActivity, (M) => {
  M.component(RawActivity.name, RawActivity), registerEditorProvider(
    "EDITOR_CUSTOMSTYLE_RAW_ACTIVITY",
    () => new RawActivityEditorProvider()
  );
}), index = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(M) {
    M.use(IBizRawActivity);
  }
};
export {
  IBizRawActivity,
  index as default
};
