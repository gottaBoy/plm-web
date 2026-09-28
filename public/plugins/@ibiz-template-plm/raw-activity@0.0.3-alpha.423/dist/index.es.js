import './assets/style.css';
import { getRawProps, getEditorEmits, useNamespace, withInstall } from "@ibiz-template/vue3-util";
import { PluginStaticResource, registerEditorProvider, EditorController } from "@ibiz-template/runtime";
import { defineComponent, ref, computed, watch, onMounted, createVNode, h, createTextVNode } from "vue";
import { isArray } from "lodash-es";
import { createUUID } from "qx-util";
const style = "";
var O = Object.defineProperty, L = (N, l, g) => l in N ? O(N, l, { enumerable: !0, configurable: !0, writable: !0, value: g }) : N[l] = g, P = (N, l, g) => (L(N, typeof l != "symbol" ? l + "" : l, g), g);
const resource = new PluginStaticResource(import.meta.url), RawActivity = /* @__PURE__ */ defineComponent({
  name: "RawActivity",
  props: getRawProps(),
  emits: getEditorEmits(),
  setup(props) {
    var M, o, u, p;
    const ns = useNamespace("raw"), ns2 = useNamespace("raw-activity"), c = props.controller, editorModel = c.model, vditorRef = ref(), vditorId = "vditor-".concat(createUUID()), content = ref("");
    let type = "TEXT", template = "";
    editorModel.contentType && (type = editorModel.contentType), (M = editorModel.editorParams) != null && M.contenttype && (type = (o = editorModel.editorParams) == null ? void 0 : o.contenttype), (u = editorModel.editorParams) != null && u.template && (template = editorModel.editorParams.template.replaceAll("//n", "\n")), (p = editorModel.editorParams) != null && p.TEMPLATE && (template = editorModel.editorParams.TEMPLATE.replaceAll("//n", "\n"));
    const showFormDefaultContent = computed(() => !!(props.controlParams && props.controlParams.editmode === "hover"));
    watch(() => props.value, async (N, l) => {
      if (N !== l && ((typeof N == "string" || typeof N == "number") && (content.value = N), template && N)) {
        let g = [];
        if (typeof N == "string")
          try {
            g = JSON.parse(N), g.forEach((b) => {
              if (b.dataauditdetailname === "TAGS") {
                if (b.newvalue) {
                  const v = JSON.parse(b.newvalue);
                  isArray(v) && (b.newvalue = v.map((t) => t.name).join(","));
                }
                if (b.oldvalue) {
                  const v = JSON.parse(b.oldvalue);
                  isArray(v) && (b.oldvalue = v.map((t) => t.name).join(","));
                }
              }
            });
          } catch (b) {
            ibiz.log.error("JSON字符串转换错误");
          }
        content.value = await ibiz.util.hbs.render(template, g || N);
      }
    }, {
      immediate: !0
    });
    const handleClick = async (e) => {
      const clickValue = e.target.getAttribute("click");
      if (clickValue)
        try {
          eval(clickValue);
        } catch (N) {
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
      onClick: (N) => {
        handleClick(N);
      }
    }, null) : createVNode("span", {
      class: ns2.e("text")
    }, [content.value]), onContrast = (N) => {
      try {
        const l = JSON.parse(props.value);
        if (l) {
          const g = l.find((b) => b.dataauditdetailname === N);
          if (g) {
            const b = {
              name: N,
              oldValue: g.oldvalue,
              newValue: g.newvalue
            };
            c.tagMap.clear(), c.openContrastModal(b);
          }
        }
      } catch (l) {
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
(function(N) {
  var l = function() {
    this.Diff_Timeout = 1, this.Diff_EditCost = 4, this.Match_Threshold = 0.5, this.Match_Distance = 1e3, this.Patch_DeleteThreshold = 0.5, this.Patch_Margin = 4, this.Match_MaxBits = 32;
  }, g = -1, b = 1, v = 0;
  l.Diff = function(t, n) {
    return [t, n];
  }, l.prototype.diff_main = function(t, n, a, r) {
    typeof r > "u" && (this.Diff_Timeout <= 0 ? r = Number.MAX_VALUE : r = (/* @__PURE__ */ new Date()).getTime() + this.Diff_Timeout * 1e3);
    var i = r;
    if (t == null || n == null)
      throw new Error("Null input. (diff_main)");
    if (t == n)
      return t ? [new l.Diff(v, t)] : [];
    typeof a > "u" && (a = !0);
    var s = a, f = this.diff_commonPrefix(t, n), m = t.substring(0, f);
    t = t.substring(f), n = n.substring(f), f = this.diff_commonSuffix(t, n);
    var d = t.substring(t.length - f);
    t = t.substring(0, t.length - f), n = n.substring(0, n.length - f);
    var _ = this.diff_compute_(t, n, s, i);
    return m && _.unshift(new l.Diff(v, m)), d && _.push(new l.Diff(v, d)), this.diff_cleanupMerge(_), _;
  }, l.prototype.diff_compute_ = function(t, n, a, r) {
    var i;
    if (!t)
      return [new l.Diff(b, n)];
    if (!n)
      return [new l.Diff(g, t)];
    var s = t.length > n.length ? t : n, f = t.length > n.length ? n : t, m = s.indexOf(f);
    if (m != -1)
      return i = [
        new l.Diff(b, s.substring(0, m)),
        new l.Diff(v, f),
        new l.Diff(
          b,
          s.substring(m + f.length)
        )
      ], t.length > n.length && (i[0][0] = i[2][0] = g), i;
    if (f.length == 1)
      return [
        new l.Diff(g, t),
        new l.Diff(b, n)
      ];
    var d = this.diff_halfMatch_(t, n);
    if (d) {
      var _ = d[0], w = d[1], y = d[2], x = d[3], D = d[4], C = this.diff_main(_, y, a, r), E = this.diff_main(w, x, a, r);
      return C.concat(
        [new l.Diff(v, D)],
        E
      );
    }
    return a && t.length > 100 && n.length > 100 ? this.diff_lineMode_(t, n, r) : this.diff_bisect_(t, n, r);
  }, l.prototype.diff_lineMode_ = function(t, n, a) {
    var r = this.diff_linesToChars_(t, n);
    t = r.chars1, n = r.chars2;
    var i = r.lineArray, s = this.diff_main(t, n, !1, a);
    this.diff_charsToLines_(s, i), this.diff_cleanupSemantic(s), s.push(new l.Diff(v, ""));
    for (var f = 0, m = 0, d = 0, _ = "", w = ""; f < s.length; ) {
      switch (s[f][0]) {
        case b:
          d++, w += s[f][1];
          break;
        case g:
          m++, _ += s[f][1];
          break;
        case v:
          if (m >= 1 && d >= 1) {
            s.splice(
              f - m - d,
              m + d
            ), f = f - m - d;
            for (var y = this.diff_main(_, w, !1, a), x = y.length - 1; x >= 0; x--)
              s.splice(f, 0, y[x]);
            f = f + y.length;
          }
          d = 0, m = 0, _ = "", w = "";
          break;
      }
      f++;
    }
    return s.pop(), s;
  }, l.prototype.diff_bisect_ = function(t, n, a) {
    for (var r = t.length, i = n.length, s = Math.ceil((r + i) / 2), f = s, m = 2 * s, d = new Array(m), _ = new Array(m), w = 0; w < m; w++)
      d[w] = -1, _[w] = -1;
    d[f + 1] = 0, _[f + 1] = 0;
    for (var y = r - i, x = y % 2 != 0, D = 0, C = 0, E = 0, I = 0, S = 0; S < s && !((/* @__PURE__ */ new Date()).getTime() > a); S++) {
      for (var T = -S + D; T <= S - C; T += 2) {
        var k = f + T, A;
        T == -S || T != S && d[k - 1] < d[k + 1] ? A = d[k + 1] : A = d[k - 1] + 1;
        for (var j = A - T; A < r && j < i && t.charAt(A) == n.charAt(j); )
          A++, j++;
        if (d[k] = A, A > r)
          C += 2;
        else if (j > i)
          D += 2;
        else if (x) {
          var R = f + y - T;
          if (R >= 0 && R < m && _[R] != -1) {
            var V = r - _[R];
            if (A >= V)
              return this.diff_bisectSplit_(t, n, A, j, a);
          }
        }
      }
      for (var U = -S + E; U <= S - I; U += 2) {
        var R = f + U, V;
        U == -S || U != S && _[R - 1] < _[R + 1] ? V = _[R + 1] : V = _[R - 1] + 1;
        for (var F = V - U; V < r && F < i && t.charAt(r - V - 1) == n.charAt(i - F - 1); )
          V++, F++;
        if (_[R] = V, V > r)
          I += 2;
        else if (F > i)
          E += 2;
        else if (!x) {
          var k = f + y - U;
          if (k >= 0 && k < m && d[k] != -1) {
            var A = d[k], j = f + A - k;
            if (V = r - V, A >= V)
              return this.diff_bisectSplit_(t, n, A, j, a);
          }
        }
      }
    }
    return [
      new l.Diff(g, t),
      new l.Diff(b, n)
    ];
  }, l.prototype.diff_bisectSplit_ = function(t, n, a, r, i) {
    var s = t.substring(0, a), f = n.substring(0, r), m = t.substring(a), d = n.substring(r), _ = this.diff_main(s, f, !1, i), w = this.diff_main(m, d, !1, i);
    return _.concat(w);
  }, l.prototype.diff_linesToChars_ = function(t, n) {
    var a = [], r = {};
    a[0] = "";
    function i(d) {
      for (var _ = "", w = 0, y = -1, x = a.length; y < d.length - 1; ) {
        y = d.indexOf("\n", w), y == -1 && (y = d.length - 1);
        var D = d.substring(w, y + 1);
        (r.hasOwnProperty ? r.hasOwnProperty(D) : r[D] !== void 0) ? _ += String.fromCharCode(r[D]) : (x == s && (D = d.substring(w), y = d.length), _ += String.fromCharCode(x), r[D] = x, a[x++] = D), w = y + 1;
      }
      return _;
    }
    var s = 4e4, f = i(t);
    s = 65535;
    var m = i(n);
    return { chars1: f, chars2: m, lineArray: a };
  }, l.prototype.diff_charsToLines_ = function(t, n) {
    for (var a = 0; a < t.length; a++) {
      for (var r = t[a][1], i = [], s = 0; s < r.length; s++)
        i[s] = n[r.charCodeAt(s)];
      t[a][1] = i.join("");
    }
  }, l.prototype.diff_commonPrefix = function(t, n) {
    if (!t || !n || t.charAt(0) != n.charAt(0))
      return 0;
    for (var a = 0, r = Math.min(t.length, n.length), i = r, s = 0; a < i; )
      t.substring(s, i) == n.substring(s, i) ? (a = i, s = a) : r = i, i = Math.floor((r - a) / 2 + a);
    return i;
  }, l.prototype.diff_commonSuffix = function(t, n) {
    if (!t || !n || t.charAt(t.length - 1) != n.charAt(n.length - 1))
      return 0;
    for (var a = 0, r = Math.min(t.length, n.length), i = r, s = 0; a < i; )
      t.substring(t.length - i, t.length - s) == n.substring(n.length - i, n.length - s) ? (a = i, s = a) : r = i, i = Math.floor((r - a) / 2 + a);
    return i;
  }, l.prototype.diff_commonOverlap_ = function(t, n) {
    var a = t.length, r = n.length;
    if (a == 0 || r == 0)
      return 0;
    a > r ? t = t.substring(a - r) : a < r && (n = n.substring(0, a));
    var i = Math.min(a, r);
    if (t == n)
      return i;
    for (var s = 0, f = 1; ; ) {
      var m = t.substring(i - f), d = n.indexOf(m);
      if (d == -1)
        return s;
      f += d, (d == 0 || t.substring(i - f) == n.substring(0, f)) && (s = f, f++);
    }
  }, l.prototype.diff_halfMatch_ = function(t, n) {
    if (this.Diff_Timeout <= 0)
      return null;
    var a = t.length > n.length ? t : n, r = t.length > n.length ? n : t;
    if (a.length < 4 || r.length * 2 < a.length)
      return null;
    var i = this;
    function s(C, E, I) {
      for (var S = C.substring(I, I + Math.floor(C.length / 4)), T = -1, k = "", A, j, R, V; (T = E.indexOf(S, T + 1)) != -1; ) {
        var U = i.diff_commonPrefix(
          C.substring(I),
          E.substring(T)
        ), F = i.diff_commonSuffix(
          C.substring(0, I),
          E.substring(0, T)
        );
        k.length < F + U && (k = E.substring(T - F, T) + E.substring(T, T + U), A = C.substring(0, I - F), j = C.substring(I + U), R = E.substring(0, T - F), V = E.substring(T + U));
      }
      return k.length * 2 >= C.length ? [
        A,
        j,
        R,
        V,
        k
      ] : null;
    }
    var f = s(
      a,
      r,
      Math.ceil(a.length / 4)
    ), m = s(
      a,
      r,
      Math.ceil(a.length / 2)
    ), d;
    if (!f && !m)
      return null;
    m ? f ? d = f[4].length > m[4].length ? f : m : d = m : d = f;
    var _, w, y, x;
    t.length > n.length ? (_ = d[0], w = d[1], y = d[2], x = d[3]) : (y = d[0], x = d[1], _ = d[2], w = d[3]);
    var D = d[4];
    return [_, w, y, x, D];
  }, l.prototype.diff_cleanupSemantic = function(t) {
    for (var n = !1, a = [], r = 0, i = null, s = 0, f = 0, m = 0, d = 0, _ = 0; s < t.length; )
      t[s][0] == v ? (a[r++] = s, f = d, m = _, d = 0, _ = 0, i = t[s][1]) : (t[s][0] == b ? d += t[s][1].length : _ += t[s][1].length, i && i.length <= Math.max(f, m) && i.length <= Math.max(
        d,
        _
      ) && (t.splice(
        a[r - 1],
        0,
        new l.Diff(g, i)
      ), t[a[r - 1] + 1][0] = b, r--, r--, s = r > 0 ? a[r - 1] : -1, f = 0, m = 0, d = 0, _ = 0, i = null, n = !0)), s++;
    for (n && this.diff_cleanupMerge(t), this.diff_cleanupSemanticLossless(t), s = 1; s < t.length; ) {
      if (t[s - 1][0] == g && t[s][0] == b) {
        var w = t[s - 1][1], y = t[s][1], x = this.diff_commonOverlap_(w, y), D = this.diff_commonOverlap_(y, w);
        x >= D ? (x >= w.length / 2 || x >= y.length / 2) && (t.splice(s, 0, new l.Diff(
          v,
          y.substring(0, x)
        )), t[s - 1][1] = w.substring(0, w.length - x), t[s + 1][1] = y.substring(x), s++) : (D >= w.length / 2 || D >= y.length / 2) && (t.splice(s, 0, new l.Diff(
          v,
          w.substring(0, D)
        )), t[s - 1][0] = b, t[s - 1][1] = y.substring(0, y.length - D), t[s + 1][0] = g, t[s + 1][1] = w.substring(D), s++), s++;
      }
      s++;
    }
  }, l.prototype.diff_cleanupSemanticLossless = function(t) {
    function n(D, C) {
      if (!D || !C)
        return 6;
      var E = D.charAt(D.length - 1), I = C.charAt(0), S = E.match(l.nonAlphaNumericRegex_), T = I.match(l.nonAlphaNumericRegex_), k = S && E.match(l.whitespaceRegex_), A = T && I.match(l.whitespaceRegex_), j = k && E.match(l.linebreakRegex_), R = A && I.match(l.linebreakRegex_), V = j && D.match(l.blanklineEndRegex_), U = R && C.match(l.blanklineStartRegex_);
      return V || U ? 5 : j || R ? 4 : S && !k && A ? 3 : k || A ? 2 : S || T ? 1 : 0;
    }
    for (var a = 1; a < t.length - 1; ) {
      if (t[a - 1][0] == v && t[a + 1][0] == v) {
        var r = t[a - 1][1], i = t[a][1], s = t[a + 1][1], f = this.diff_commonSuffix(r, i);
        if (f) {
          var m = i.substring(i.length - f);
          r = r.substring(0, r.length - f), i = m + i.substring(0, i.length - f), s = m + s;
        }
        for (var d = r, _ = i, w = s, y = n(r, i) + n(i, s); i.charAt(0) === s.charAt(0); ) {
          r += i.charAt(0), i = i.substring(1) + s.charAt(0), s = s.substring(1);
          var x = n(r, i) + n(i, s);
          x >= y && (y = x, d = r, _ = i, w = s);
        }
        t[a - 1][1] != d && (d ? t[a - 1][1] = d : (t.splice(a - 1, 1), a--), t[a][1] = _, w ? t[a + 1][1] = w : (t.splice(a + 1, 1), a--));
      }
      a++;
    }
  }, l.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/, l.whitespaceRegex_ = /\s/, l.linebreakRegex_ = /[\r\n]/, l.blanklineEndRegex_ = /\n\r?\n$/, l.blanklineStartRegex_ = /^\r?\n\r?\n/, l.prototype.diff_cleanupEfficiency = function(t) {
    for (var n = !1, a = [], r = 0, i = null, s = 0, f = !1, m = !1, d = !1, _ = !1; s < t.length; )
      t[s][0] == v ? (t[s][1].length < this.Diff_EditCost && (d || _) ? (a[r++] = s, f = d, m = _, i = t[s][1]) : (r = 0, i = null), d = _ = !1) : (t[s][0] == g ? _ = !0 : d = !0, i && (f && m && d && _ || i.length < this.Diff_EditCost / 2 && f + m + d + _ == 3) && (t.splice(
        a[r - 1],
        0,
        new l.Diff(g, i)
      ), t[a[r - 1] + 1][0] = b, r--, i = null, f && m ? (d = _ = !0, r = 0) : (r--, s = r > 0 ? a[r - 1] : -1, d = _ = !1), n = !0)), s++;
    n && this.diff_cleanupMerge(t);
  }, l.prototype.diff_cleanupMerge = function(t) {
    t.push(new l.Diff(v, ""));
    for (var n = 0, a = 0, r = 0, i = "", s = "", f; n < t.length; )
      switch (t[n][0]) {
        case b:
          r++, s += t[n][1], n++;
          break;
        case g:
          a++, i += t[n][1], n++;
          break;
        case v:
          a + r > 1 ? (a !== 0 && r !== 0 && (f = this.diff_commonPrefix(s, i), f !== 0 && (n - a - r > 0 && t[n - a - r - 1][0] == v ? t[n - a - r - 1][1] += s.substring(0, f) : (t.splice(0, 0, new l.Diff(
            v,
            s.substring(0, f)
          )), n++), s = s.substring(f), i = i.substring(f)), f = this.diff_commonSuffix(s, i), f !== 0 && (t[n][1] = s.substring(s.length - f) + t[n][1], s = s.substring(0, s.length - f), i = i.substring(0, i.length - f))), n -= a + r, t.splice(n, a + r), i.length && (t.splice(
            n,
            0,
            new l.Diff(g, i)
          ), n++), s.length && (t.splice(
            n,
            0,
            new l.Diff(b, s)
          ), n++), n++) : n !== 0 && t[n - 1][0] == v ? (t[n - 1][1] += t[n][1], t.splice(n, 1)) : n++, r = 0, a = 0, i = "", s = "";
          break;
      }
    t[t.length - 1][1] === "" && t.pop();
    var m = !1;
    for (n = 1; n < t.length - 1; )
      t[n - 1][0] == v && t[n + 1][0] == v && (t[n][1].substring(t[n][1].length - t[n - 1][1].length) == t[n - 1][1] ? (t[n][1] = t[n - 1][1] + t[n][1].substring(0, t[n][1].length - t[n - 1][1].length), t[n + 1][1] = t[n - 1][1] + t[n + 1][1], t.splice(n - 1, 1), m = !0) : t[n][1].substring(0, t[n + 1][1].length) == t[n + 1][1] && (t[n - 1][1] += t[n + 1][1], t[n][1] = t[n][1].substring(t[n + 1][1].length) + t[n + 1][1], t.splice(n + 1, 1), m = !0)), n++;
    m && this.diff_cleanupMerge(t);
  }, l.prototype.diff_xIndex = function(t, n) {
    var a = 0, r = 0, i = 0, s = 0, f;
    for (f = 0; f < t.length && (t[f][0] !== b && (a += t[f][1].length), t[f][0] !== g && (r += t[f][1].length), !(a > n)); f++)
      i = a, s = r;
    return t.length != f && t[f][0] === g ? s : s + (n - i);
  }, l.prototype.diff_prettyHtml = function(t) {
    for (var n = [], a = /&/g, r = /</g, i = />/g, s = /\n/g, f = 0; f < t.length; f++) {
      var m = t[f][0], d = t[f][1], _ = d.replace(a, "&amp;").replace(r, "&lt;").replace(i, "&gt;").replace(s, "&para;<br>");
      switch (m) {
        case b:
          n[f] = '<ins style="background:#e6ffe6;">' + _ + "</ins>";
          break;
        case g:
          n[f] = '<del style="background:#ffe6e6;">' + _ + "</del>";
          break;
        case v:
          n[f] = "<span>" + _ + "</span>";
          break;
      }
    }
    return n.join("");
  }, l.prototype.diff_text1 = function(t) {
    for (var n = [], a = 0; a < t.length; a++)
      t[a][0] !== b && (n[a] = t[a][1]);
    return n.join("");
  }, l.prototype.diff_text2 = function(t) {
    for (var n = [], a = 0; a < t.length; a++)
      t[a][0] !== g && (n[a] = t[a][1]);
    return n.join("");
  }, l.prototype.diff_levenshtein = function(t) {
    for (var n = 0, a = 0, r = 0, i = 0; i < t.length; i++) {
      var s = t[i][0], f = t[i][1];
      switch (s) {
        case b:
          a += f.length;
          break;
        case g:
          r += f.length;
          break;
        case v:
          n += Math.max(a, r), a = 0, r = 0;
          break;
      }
    }
    return n += Math.max(a, r), n;
  }, l.prototype.diff_toDelta = function(t) {
    for (var n = [], a = 0; a < t.length; a++)
      switch (t[a][0]) {
        case b:
          n[a] = "+" + encodeURI(t[a][1]);
          break;
        case g:
          n[a] = "-" + t[a][1].length;
          break;
        case v:
          n[a] = "=" + t[a][1].length;
          break;
      }
    return n.join("	").replace(/%20/g, " ");
  }, l.prototype.diff_fromDelta = function(t, n) {
    for (var a = [], r = 0, i = 0, s = n.split(/\t/g), f = 0; f < s.length; f++) {
      var m = s[f].substring(1);
      switch (s[f].charAt(0)) {
        case "+":
          try {
            a[r++] = new l.Diff(b, decodeURI(m));
          } catch (w) {
            throw new Error("Illegal escape in diff_fromDelta: " + m);
          }
          break;
        case "-":
        case "=":
          var d = parseInt(m, 10);
          if (isNaN(d) || d < 0)
            throw new Error("Invalid number in diff_fromDelta: " + m);
          var _ = t.substring(i, i += d);
          s[f].charAt(0) == "=" ? a[r++] = new l.Diff(v, _) : a[r++] = new l.Diff(g, _);
          break;
        default:
          if (s[f])
            throw new Error("Invalid diff operation in diff_fromDelta: " + s[f]);
      }
    }
    if (i != t.length)
      throw new Error("Delta length (" + i + ") does not equal source text length (" + t.length + ").");
    return a;
  }, l.prototype.match_main = function(t, n, a) {
    if (t == null || n == null || a == null)
      throw new Error("Null input. (match_main)");
    return a = Math.max(0, Math.min(a, t.length)), t == n ? 0 : t.length ? t.substring(a, a + n.length) == n ? a : this.match_bitap_(t, n, a) : -1;
  }, l.prototype.match_bitap_ = function(t, n, a) {
    if (n.length > this.Match_MaxBits)
      throw new Error("Pattern too long for this browser.");
    var r = this.match_alphabet_(n), i = this;
    function s(A, j) {
      var R = A / n.length, V = Math.abs(a - j);
      return i.Match_Distance ? R + V / i.Match_Distance : V ? 1 : R;
    }
    var f = this.Match_Threshold, m = t.indexOf(n, a);
    m != -1 && (f = Math.min(s(0, m), f), m = t.lastIndexOf(n, a + n.length), m != -1 && (f = Math.min(s(0, m), f)));
    var d = 1 << n.length - 1;
    m = -1;
    for (var _, w, y = n.length + t.length, x, D = 0; D < n.length; D++) {
      for (_ = 0, w = y; _ < w; )
        s(D, a + w) <= f ? _ = w : y = w, w = Math.floor((y - _) / 2 + _);
      y = w;
      var C = Math.max(1, a - w + 1), E = Math.min(a + w, t.length) + n.length, I = Array(E + 2);
      I[E + 1] = (1 << D) - 1;
      for (var S = E; S >= C; S--) {
        var T = r[t.charAt(S - 1)];
        if (D === 0 ? I[S] = (I[S + 1] << 1 | 1) & T : I[S] = (I[S + 1] << 1 | 1) & T | ((x[S + 1] | x[S]) << 1 | 1) | x[S + 1], I[S] & d) {
          var k = s(D, S - 1);
          if (k <= f)
            if (f = k, m = S - 1, m > a)
              C = Math.max(1, 2 * a - m);
            else
              break;
        }
      }
      if (s(D + 1, a) > f)
        break;
      x = I;
    }
    return m;
  }, l.prototype.match_alphabet_ = function(t) {
    for (var n = {}, a = 0; a < t.length; a++)
      n[t.charAt(a)] = 0;
    for (var a = 0; a < t.length; a++)
      n[t.charAt(a)] |= 1 << t.length - a - 1;
    return n;
  }, l.prototype.patch_addContext_ = function(t, n) {
    if (n.length != 0) {
      if (t.start2 === null)
        throw Error("patch not initialized");
      for (var a = n.substring(t.start2, t.start2 + t.length1), r = 0; n.indexOf(a) != n.lastIndexOf(a) && a.length < this.Match_MaxBits - this.Patch_Margin - this.Patch_Margin; )
        r += this.Patch_Margin, a = n.substring(
          t.start2 - r,
          t.start2 + t.length1 + r
        );
      r += this.Patch_Margin;
      var i = n.substring(t.start2 - r, t.start2);
      i && t.diffs.unshift(new l.Diff(v, i));
      var s = n.substring(
        t.start2 + t.length1,
        t.start2 + t.length1 + r
      );
      s && t.diffs.push(new l.Diff(v, s)), t.start1 -= i.length, t.start2 -= i.length, t.length1 += i.length + s.length, t.length2 += i.length + s.length;
    }
  }, l.prototype.patch_make = function(t, n, a) {
    var r, i;
    if (typeof t == "string" && typeof n == "string" && typeof a > "u")
      r = /** @type {string} */
      t, i = this.diff_main(
        r,
        /** @type {string} */
        n,
        !0
      ), i.length > 2 && (this.diff_cleanupSemantic(i), this.diff_cleanupEfficiency(i));
    else if (t && typeof t == "object" && typeof n > "u" && typeof a > "u")
      i = /** @type {!Array.<!diff_match_patch.Diff>} */
      t, r = this.diff_text1(i);
    else if (typeof t == "string" && n && typeof n == "object" && typeof a > "u")
      r = /** @type {string} */
      t, i = /** @type {!Array.<!diff_match_patch.Diff>} */
      n;
    else if (typeof t == "string" && typeof n == "string" && a && typeof a == "object")
      r = /** @type {string} */
      t, i = /** @type {!Array.<!diff_match_patch.Diff>} */
      a;
    else
      throw new Error("Unknown call format to patch_make.");
    if (i.length === 0)
      return [];
    for (var s = [], f = new l.patch_obj(), m = 0, d = 0, _ = 0, w = r, y = r, x = 0; x < i.length; x++) {
      var D = i[x][0], C = i[x][1];
      switch (!m && D !== v && (f.start1 = d, f.start2 = _), D) {
        case b:
          f.diffs[m++] = i[x], f.length2 += C.length, y = y.substring(0, _) + C + y.substring(_);
          break;
        case g:
          f.length1 += C.length, f.diffs[m++] = i[x], y = y.substring(0, _) + y.substring(_ + C.length);
          break;
        case v:
          C.length <= 2 * this.Patch_Margin && m && i.length != x + 1 ? (f.diffs[m++] = i[x], f.length1 += C.length, f.length2 += C.length) : C.length >= 2 * this.Patch_Margin && m && (this.patch_addContext_(f, w), s.push(f), f = new l.patch_obj(), m = 0, w = y, d = _);
          break;
      }
      D !== b && (d += C.length), D !== g && (_ += C.length);
    }
    return m && (this.patch_addContext_(f, w), s.push(f)), s;
  }, l.prototype.patch_deepCopy = function(t) {
    for (var n = [], a = 0; a < t.length; a++) {
      var r = t[a], i = new l.patch_obj();
      i.diffs = [];
      for (var s = 0; s < r.diffs.length; s++)
        i.diffs[s] = new l.Diff(r.diffs[s][0], r.diffs[s][1]);
      i.start1 = r.start1, i.start2 = r.start2, i.length1 = r.length1, i.length2 = r.length2, n[a] = i;
    }
    return n;
  }, l.prototype.patch_apply = function(t, n) {
    if (t.length == 0)
      return [n, []];
    t = this.patch_deepCopy(t);
    var a = this.patch_addPadding(t);
    n = a + n + a, this.patch_splitMax(t);
    for (var r = 0, i = [], s = 0; s < t.length; s++) {
      var f = t[s].start2 + r, m = this.diff_text1(t[s].diffs), d, _ = -1;
      if (m.length > this.Match_MaxBits ? (d = this.match_main(
        n,
        m.substring(0, this.Match_MaxBits),
        f
      ), d != -1 && (_ = this.match_main(
        n,
        m.substring(m.length - this.Match_MaxBits),
        f + m.length - this.Match_MaxBits
      ), (_ == -1 || d >= _) && (d = -1))) : d = this.match_main(n, m, f), d == -1)
        i[s] = !1, r -= t[s].length2 - t[s].length1;
      else {
        i[s] = !0, r = d - f;
        var w;
        if (_ == -1 ? w = n.substring(d, d + m.length) : w = n.substring(d, _ + this.Match_MaxBits), m == w)
          n = n.substring(0, d) + this.diff_text2(t[s].diffs) + n.substring(d + m.length);
        else {
          var y = this.diff_main(m, w, !1);
          if (m.length > this.Match_MaxBits && this.diff_levenshtein(y) / m.length > this.Patch_DeleteThreshold)
            i[s] = !1;
          else {
            this.diff_cleanupSemanticLossless(y);
            for (var x = 0, D, C = 0; C < t[s].diffs.length; C++) {
              var E = t[s].diffs[C];
              E[0] !== v && (D = this.diff_xIndex(y, x)), E[0] === b ? n = n.substring(0, d + D) + E[1] + n.substring(d + D) : E[0] === g && (n = n.substring(0, d + D) + n.substring(d + this.diff_xIndex(
                y,
                x + E[1].length
              ))), E[0] !== g && (x += E[1].length);
            }
          }
        }
      }
    }
    return n = n.substring(a.length, n.length - a.length), [n, i];
  }, l.prototype.patch_addPadding = function(t) {
    for (var n = this.Patch_Margin, a = "", r = 1; r <= n; r++)
      a += String.fromCharCode(r);
    for (var r = 0; r < t.length; r++)
      t[r].start1 += n, t[r].start2 += n;
    var i = t[0], s = i.diffs;
    if (s.length == 0 || s[0][0] != v)
      s.unshift(new l.Diff(v, a)), i.start1 -= n, i.start2 -= n, i.length1 += n, i.length2 += n;
    else if (n > s[0][1].length) {
      var f = n - s[0][1].length;
      s[0][1] = a.substring(s[0][1].length) + s[0][1], i.start1 -= f, i.start2 -= f, i.length1 += f, i.length2 += f;
    }
    if (i = t[t.length - 1], s = i.diffs, s.length == 0 || s[s.length - 1][0] != v)
      s.push(new l.Diff(v, a)), i.length1 += n, i.length2 += n;
    else if (n > s[s.length - 1][1].length) {
      var f = n - s[s.length - 1][1].length;
      s[s.length - 1][1] += a.substring(0, f), i.length1 += f, i.length2 += f;
    }
    return a;
  }, l.prototype.patch_splitMax = function(t) {
    for (var n = this.Match_MaxBits, a = 0; a < t.length; a++)
      if (!(t[a].length1 <= n)) {
        var r = t[a];
        t.splice(a--, 1);
        for (var i = r.start1, s = r.start2, f = ""; r.diffs.length !== 0; ) {
          var m = new l.patch_obj(), d = !0;
          for (m.start1 = i - f.length, m.start2 = s - f.length, f !== "" && (m.length1 = m.length2 = f.length, m.diffs.push(new l.Diff(v, f))); r.diffs.length !== 0 && m.length1 < n - this.Patch_Margin; ) {
            var _ = r.diffs[0][0], w = r.diffs[0][1];
            _ === b ? (m.length2 += w.length, s += w.length, m.diffs.push(r.diffs.shift()), d = !1) : _ === g && m.diffs.length == 1 && m.diffs[0][0] == v && w.length > 2 * n ? (m.length1 += w.length, i += w.length, d = !1, m.diffs.push(new l.Diff(_, w)), r.diffs.shift()) : (w = w.substring(
              0,
              n - m.length1 - this.Patch_Margin
            ), m.length1 += w.length, i += w.length, _ === v ? (m.length2 += w.length, s += w.length) : d = !1, m.diffs.push(new l.Diff(_, w)), w == r.diffs[0][1] ? r.diffs.shift() : r.diffs[0][1] = r.diffs[0][1].substring(w.length));
          }
          f = this.diff_text2(m.diffs), f = f.substring(f.length - this.Patch_Margin);
          var y = this.diff_text1(r.diffs).substring(0, this.Patch_Margin);
          y !== "" && (m.length1 += y.length, m.length2 += y.length, m.diffs.length !== 0 && m.diffs[m.diffs.length - 1][0] === v ? m.diffs[m.diffs.length - 1][1] += y : m.diffs.push(new l.Diff(v, y))), d || t.splice(++a, 0, m);
        }
      }
  }, l.prototype.patch_toText = function(t) {
    for (var n = [], a = 0; a < t.length; a++)
      n[a] = t[a];
    return n.join("");
  }, l.prototype.patch_fromText = function(t) {
    var n = [];
    if (!t)
      return n;
    for (var a = t.split("\n"), r = 0, i = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/; r < a.length; ) {
      var s = a[r].match(i);
      if (!s)
        throw new Error("Invalid patch string: " + a[r]);
      var f = new l.patch_obj();
      for (n.push(f), f.start1 = parseInt(s[1], 10), s[2] === "" ? (f.start1--, f.length1 = 1) : s[2] == "0" ? f.length1 = 0 : (f.start1--, f.length1 = parseInt(s[2], 10)), f.start2 = parseInt(s[3], 10), s[4] === "" ? (f.start2--, f.length2 = 1) : s[4] == "0" ? f.length2 = 0 : (f.start2--, f.length2 = parseInt(s[4], 10)), r++; r < a.length; ) {
        var m = a[r].charAt(0);
        try {
          var d = decodeURI(a[r].substring(1));
        } catch (_) {
          throw new Error("Illegal escape in patch_fromText: " + d);
        }
        if (m == "-")
          f.diffs.push(new l.Diff(g, d));
        else if (m == "+")
          f.diffs.push(new l.Diff(b, d));
        else if (m == " ")
          f.diffs.push(new l.Diff(v, d));
        else {
          if (m == "@")
            break;
          if (m !== "")
            throw new Error('Invalid patch mode "' + m + '" in: ' + d);
        }
        r++;
      }
    }
    return n;
  }, l.patch_obj = function() {
    this.diffs = [], this.start1 = null, this.start2 = null, this.length1 = 0, this.length2 = 0;
  }, l.patch_obj.prototype.toString = function() {
    var t, n;
    this.length1 === 0 ? t = this.start1 + ",0" : this.length1 == 1 ? t = this.start1 + 1 : t = this.start1 + 1 + "," + this.length1, this.length2 === 0 ? n = this.start2 + ",0" : this.length2 == 1 ? n = this.start2 + 1 : n = this.start2 + 1 + "," + this.length2;
    for (var a = ["@@ -" + t + " +" + n + " @@\n"], r, i = 0; i < this.diffs.length; i++) {
      switch (this.diffs[i][0]) {
        case b:
          r = "+";
          break;
        case g:
          r = "-";
          break;
        case v:
          r = " ";
          break;
      }
      a[i + 1] = r + encodeURI(this.diffs[i][1]) + "\n";
    }
    return a.join("").replace(/%20/g, " ");
  }, N.exports = l, N.exports.diff_match_patch = l, N.exports.DIFF_DELETE = g, N.exports.DIFF_INSERT = b, N.exports.DIFF_EQUAL = v;
})(diffMatchPatch);
var diffMatchPatchExports = diffMatchPatch.exports;
class Util {
  constructor() {
    P(this, "dmp"), P(this, "tagMap", {}), P(this, "unicodeRangeStart", 57344), P(this, "mapLength", 0), this.init();
  }
  init() {
    this.dmp = new diffMatchPatchExports.diff_match_patch();
  }
  parseHTML(l) {
    return new DOMParser().parseFromString(l, "text/html").body;
  }
  isSameNode(l, g) {
    return !l || !g || l.nodeType !== g.nodeType ? !1 : l.nodeType === Node.TEXT_NODE ? !0 : l.tagName === g.tagName;
  }
  markInsert(l) {
    const g = document.createElement("span");
    g.className = "add-text", g.appendChild(l.cloneNode(!0)), l.replaceWith(g);
  }
  markDelete(l) {
    const g = document.createElement("span");
    g.className = "remove-text", g.appendChild(l.cloneNode(!0)), l.replaceWith(g);
  }
  diffChildren(l, g) {
    const b = Array.from(l.childNodes), v = Array.from(g.childNodes);
    let t = 0, n = 0;
    for (; t < b.length || n < v.length; ) {
      const a = b[t], r = v[n];
      if (!a && r) {
        this.markInsert(r), n++;
        continue;
      }
      if (a && !r) {
        this.markDelete(a), t++;
        continue;
      }
      this.isSameNode(a, r) ? (this.diffDOM(a, r), t++, n++) : (this.markInsert(r), n++);
    }
  }
  diffTextNode(l, g) {
    const b = l.textContent, v = g.textContent;
    if (b === v)
      return;
    const t = this.dmp.diff_main(b, v);
    this.dmp.diff_cleanupSemantic(t);
    const n = document.createDocumentFragment();
    t.forEach(([a, r]) => {
      if (r) {
        if (a === diffMatchPatchExports.diff_match_patch.DIFF_EQUAL && n.appendChild(document.createTextNode(r)), a === diffMatchPatchExports.diff_match_patch.DIFF_INSERT) {
          const i = document.createElement("span");
          i.className = "add-text", i.textContent = r, n.appendChild(i);
        }
        if (a === diffMatchPatchExports.diff_match_patch.DIFF_DELETE) {
          const i = document.createElement("span");
          i.className = "remove-text", i.textContent = r, n.appendChild(i);
        }
      }
    }), g.parentNode.replaceChild(n, g);
  }
  diffDOM(l, g) {
    if (!l && g) {
      this.markInsert(g);
      return;
    }
    if (l && !g) {
      this.markDelete(l);
      return;
    }
    if (!this.isSameNode(l, g)) {
      this.markDelete(l), this.markInsert(g);
      return;
    }
    if (l.nodeType === Node.TEXT_NODE && g.nodeType === Node.TEXT_NODE) {
      this.diffTextNode(l, g);
      return;
    }
    g.tagName === "PRE" || g.tagName === "CODE" || this.diffChildren(l, g);
  }
  /**
   * 字符串比对方法
   *
   * @param {string} oldValue 旧值
   * @param {string} newValue 新值
   * @returns {string} 比对结果字符串
   * @memberof Util
   */
  doDiff(l, g) {
    const b = this.parseHTML(l), v = this.parseHTML(g);
    return this.diffDOM(b, v), { newValue: v.innerHTML, oldValue: b.innerHTML };
  }
}
const detectFormat = (N = "") => {
  if (typeof N != "string")
    return "TEXT";
  const l = N.trim();
  if (!l)
    return "TEXT";
  const g = l.replaceAll(
    /<span style="(.+?)">(.*?)<\/span>/g,
    (a, r, i) => i
  ), b = /<(?:html|head|body|div|p|br|hr|h[1-6]|ul|ol|li|table|tr|td|a\s|img\s|script|style)[\s>\\/]/i, v = (g.match(b) ? 2 : 0) + (g.includes("</") ? 1 : 0) + (/<[a-z]+\s*\/?>/i.test(g) ? 1 : 0), t = /^(```|#{1,6}\s|>\s|\*\s|\+\s|-\s|\d+\.\s|_{2}[^_]+_{2}|_{1}[^_]+_{1}|`[^`]+`|\[.*?\]\(.*?\)|!\[.*?\]\(.*?\)|\*\*.*\*\*|\*.*\*)/m, n = (g.match(t) ? 2 : 0) + (/\[.*?\]\(.*?\)/.test(g) ? 1 : 0) + // 链接
  (/\*\*.*\*\*/.test(g) ? 1 : 0) + // 加粗
  (/^#{1,6}\s+/m.test(g) ? 1 : 0);
  return v > n ? "HTML" : n > 0 ? "MD" : "TEXT";
}, formatSvg = (N) => N.replace(/<\?xml(.+?)>/, "").replaceAll("\n", "").replaceAll(/>([\s]*)</g, "><"), unEscapeHtml = (N) => N.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/'&#39;/g, "'"), StepContrast = /* @__PURE__ */ defineComponent({
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
  setup(N) {
    const l = useNamespace("contrast-modal"), g = new Util(), b = N.controller, v = computed(() => {
      let d = N.item.oldValue;
      return N.item.name === "STEPS" && d && (d = JSON.parse(d)), d;
    }), t = computed(() => {
      let d = N.item.newValue;
      return N.item.name === "STEPS" && d && (d = JSON.parse(d)), d;
    }), n = ref({}), a = () => {
      const d = detectFormat(v.value) === "MD" ? b.vditor.vditor.lute.SpinVditorIRDOM(v.value) : v.value, _ = detectFormat(t.value) === "MD" ? b.vditor.vditor.lute.SpinVditorIRDOM(t.value) : t.value;
      return g.doDiff(d || "", _ || "");
    };
    watch(() => [v.value, t.value], () => {
      n.value = a();
    }, {
      immediate: !0
    });
    const r = computed(() => {
      const d = [];
      let _ = 0, w = 0;
      return isArray(v.value) && v.value.forEach((y, x) => {
        y.is_group || !x || !y.group_id ? (_++, w = 0, d.push("".concat(_))) : (w++, d.push("".concat(_, ".").concat(w)));
      }), d;
    }), i = computed(() => {
      const d = [];
      let _ = 0, w = 0;
      return isArray(t.value) && t.value.forEach((y, x) => {
        y.is_group || !x || !y.group_id ? (_++, w = 0, d.push("".concat(_))) : (w++, d.push("".concat(_, ".").concat(w)));
      }), d;
    }), s = (d) => (d === "oldValue" ? v.value : t.value).map((_, w) => createVNode("tr", null, [createVNode("td", {
      class: "number-column"
    }, [d === "oldValue" ? r.value[w] : i.value[w]]), createVNode("td", {
      class: "description-column",
      colspan: _.is_group ? 2 : 1
    }, [_.is_group ? _.name : _.description]), !_.is_group && createVNode("td", {
      class: "expected-column"
    }, [_.expected_value])])), f = (d) => createVNode("table", {
      class: "steps-table"
    }, [createVNode("tr", {
      class: "table-header"
    }, [createVNode("td", {
      class: "number-column"
    }, [createTextVNode("#")]), createVNode("td", {
      class: "description-column"
    }, [createTextVNode("步骤描述")]), createVNode("td", {
      class: "expected-column"
    }, [createTextVNode("预期结果")])]), s(d)]), m = (d) => {
      const _ = b.transformNode(n.value[d]);
      return createVNode("div", {
        class: "html vditor-reset",
        innerHTML: _
      }, null);
    };
    return {
      ns: l,
      renderContainer: (d) => createVNode("div", {
        class: l.e("container")
      }, [N.item.name === "STEPS" ? f(d) : m(d)])
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
    super(...arguments), P(this, "modal", null), P(this, "vditor"), P(this, "iconCodeListId", "plmweb.base__recent_visite"), P(this, "codeListItems", []), P(this, "tagMap", /* @__PURE__ */ new Map());
  }
  /**
   * @description 动态加载脚本
   * @param {string} url
   * @returns {*}  {Promise<IData>}
   * @memberof RawActivityEditorController
   */
  addScript(l) {
    return new Promise((g, b) => {
      const v = document.createElement("script");
      v.src = l, v.onload = g, v.onerror = b, document.head.appendChild(v);
    });
  }
  /**
   * @description 动态加载样式
   * @param {string} url
   * @returns {*}  {Promise<IData>}
   * @memberof RawActivityEditorController
   */
  addStyle(l) {
    return new Promise((g, b) => {
      const v = document.createElement("link");
      v.rel = "stylesheet", v.href = l, v.onload = g, v.onerror = b, document.head.appendChild(v);
    });
  }
  loadVditor() {
    return new Promise((l, g) => {
      const { Vditor: b } = window;
      if (b)
        l();
      else {
        const v = [
          this.addStyle(resource.dir("vditor/dist/index.css")),
          this.addScript(resource.dir("vditor/dist/index.js"))
        ];
        Promise.all(v).then(() => {
          l();
        }).catch(() => {
          ibiz.message.error(
            "加载vditor静态资源失败,请确认静态资源是否存在！"
          ), g();
        });
      }
    });
  }
  async onInit() {
    await super.onInit(), await this.loadVditor();
    const { ICONCODELISTID: l } = this.editorParams;
    l && (this.iconCodeListId = l), this.codeListItems = await this.loadCodeList(this.iconCodeListId);
  }
  /**
   * 加载代码表
   *
   * @param {string} appCodeListId
   * @return {*}  {(Promise<readonly CodeListItem[]>)}
   * @memberof CommentItemRawItemEditorController
   */
  async loadCodeList(l) {
    return await ibiz.hub.getApp().codeList.get(
      l,
      this.context,
      this.params
    );
  }
  findCodeListItem(l, g) {
    if (l) {
      const b = l.find((v) => v.value == g);
      if (b)
        return b;
      for (let v = 0; v < l.length; v++) {
        const t = this.findCodeListItem(
          l[v].children,
          g
        );
        if (t)
          return t;
      }
    }
  }
  spinVditorStyle(l) {
    const g = /<span style="([^>]+?)">(.*?)<\/span>/g, b = l;
    if (b.match(g)) {
      const v = [];
      return { match: !0, html: b.replaceAll(g, (t, n) => {
        if (n) {
          const a = createUUID();
          return v.push({
            uuid: a,
            replace: t
          }), a;
        }
        return t;
      }), replace: v };
    }
    return { match: !1, html: l };
  }
  spinVditorAddNode(l) {
    const g = /<span class='add-text'>(.+?)<\/span>/g, b = l;
    if (b.match(g)) {
      const v = [];
      return { match: !0, html: b.replaceAll(g, (t, n) => {
        if (n) {
          const a = createUUID();
          return v.push({
            uuid: a,
            replace: t
          }), a;
        }
        return t;
      }), replace: v };
    }
    return { match: !1, html: l };
  }
  spinVditorRemoveNode(l) {
    const g = /<span class='remove-text'>(.+?)<\/span>/g, b = l;
    if (b.match(g)) {
      const v = [];
      return { match: !0, html: b.replaceAll(g, (t, n) => {
        if (n) {
          const a = createUUID();
          return v.push({
            uuid: a,
            replace: t
          }), a;
        }
        return t;
      }), replace: v };
    }
    return { match: !1, html: l };
  }
  adaptImageStyle(l) {
    const g = /<img src="(.+?)"(.*?)(\/*)>/g;
    if (l.match(g)) {
      const b = [];
      return l.replaceAll(g, (v, t, n) => (t && b.push({
        url: t,
        attr: n,
        html: v
      }), v)), b;
    }
    return [];
  }
  handleHardBreak(l) {
    let g = l;
    return g = g.replaceAll(
      /<p data-block="0"><\/p>/g,
      '<p data-block="0"><wbr></p>'
    ), g = g.replaceAll(
      /<p data-block="0">\n<\/p>/g,
      '<p data-block="0"><wbr></p>'
    ), g = g.replaceAll(
      /<p data-block="0"><br><\/p>/g,
      '<p data-block="0"><wbr></p>'
    ), g;
  }
  /**
   * @description ir编辑模式转换dom
   * @param {string} markdown
   * @param {string} value
   * @returns {*}  {string}
   * @memberof VditorController
   */
  spinVditorIRDOM(l, g) {
    let b = l;
    const v = this.spinVditorStyle(b);
    v.match && (b = v.html);
    const t = this.spinVditorAddNode(b);
    t.match && (b = t.html);
    const n = this.spinVditorAddNode(b);
    n.match && (b = n.html), b = this.handleHardBreak(b);
    const a = this.adaptImageStyle(b);
    let r = g(b);
    return v.match && v.replace.forEach((i) => {
      r = r.replaceAll(i.uuid, i.replace);
    }), t.match && t.replace.forEach((i) => {
      r = r.replaceAll(i.uuid, i.replace);
    }), n.match && n.replace.forEach((i) => {
      r = r.replaceAll(i.uuid, i.replace);
    }), a.length && (r = r.replaceAll(
      /<img src="(.+?)"(.*?)(\/*)>/g,
      (i, s) => {
        const f = a.find((m) => m.url === s);
        return f ? '<img src="'.concat(f.url, '"').concat(f.attr, "/>") : i;
      }
    )), r;
  }
  /**
   * @description 绘制完成
   * @memberof VditorController
   */
  renderAfter() {
    const { lute: l } = this.vditor.vditor, g = l.SpinVditorIRDOM;
    l.SpinVditorIRDOM = (b) => this.spinVditorIRDOM(b, g);
  }
  /**
   * 打开对照模态
   *
   * @param {{ name: string, newValue: string, oldValue: string }} item
   * @return {*}
   * @memberof RawActivityEditorController
   */
  async openContrastModal(l) {
    return this.modal = ibiz.overlay.createModal(
      (g) => h(StepContrast, {
        item: l,
        modal: g,
        controller: this
      }),
      void 0,
      { width: "90%", height: "90%" }
    ), await this.modal.present(), (await this.modal.onWillDismiss()).data || [];
  }
  transformNode(l) {
    let g = unEscapeHtml(l);
    return g = this.spinMarker(g), g = this.spinMention(g), g;
  }
  spinMarker(l) {
    const g = /#{"id":"(.+?)","name":"(.+?)","identifier":"(.+?)","owner_id":"(.+?)","owner_type":"(.+?)","owner_subtype":"(.+?)","recent_parent":"(.+?)"}/g, b = l;
    if (b.match(g))
      return b.replaceAll(
        g,
        (t, n, a, r, i, s, f) => {
          var m;
          if (n && a) {
            let d = f, _ = r, w = a;
            if (t.includes("remove-text")) {
              const x = t.replaceAll(/<span class="remove-text">(.+?)<\/span>/g, "$1").replaceAll(/<span class="add-text">(.+?)<\/span>/g, ""), D = JSON.parse(x.slice(1)), C = t.replaceAll(/<span class="remove-text">(.+?)<\/span>/g, "").replaceAll(/<span class="add-text">(.+?)<\/span>/g, "$1"), E = JSON.parse(C.slice(1));
              d = E.owner_subtype, _ = '<span class="remove-text">'.concat(D.identifier, '</span><span class="add-text">').concat(E.identifier, "</span>"), w = '<span class="remove-text">'.concat(D.name, '</span><span class="add-text">').concat(E.name, "</span>");
            }
            let y = "";
            if (d) {
              const x = this.findCodeListItem(this.codeListItems, d);
              x && (m = x.sysImage) != null && m.rawContent && (y = formatSvg(x.sysImage.rawContent));
            }
            return '<span contenteditable="false" class="marker"><span class="marker-icon">'.concat(y, '</span><span class="marker-identifier">').concat(_, '</span><span class="marker-name">').concat(w, "</span></span>");
          }
          return t;
        }
      );
    const v = /#{(".+?":".+?")(,"icon":"((.|[\t\r\f\n\s])+?)")*}/g;
    return b.match(v) ? b.replaceAll(
      v,
      (t, n, a, r) => {
        if (n && r) {
          const i = JSON.parse("{".concat(n, "}")), { name: s, identifier: f } = i;
          return r && (r = formatSvg(r)), '<span contenteditable="false" class="marker"><span class="marker-icon">'.concat(r, '</span><span class="marker-identifier">').concat(f, '</span><span class="marker-name">').concat(s, "</span></span>");
        }
        return t;
      }
    ) : l;
  }
  spinMention(l) {
    const g = /@{"(user)?id":"(.+?)","name":"(.+?)"}/g;
    return l.match(g) ? l.replaceAll(
      g,
      (b, v, t, n) => t && n ? '<span contenteditable="false" class="mention">@'.concat(n, "</span>") : b
    ) : l;
  }
}
class RawActivityEditorProvider {
  constructor() {
    P(this, "formEditor", "RawActivity"), P(this, "gridEditor", "RawActivity");
  }
  async createController(l, g) {
    const b = new RawActivityEditorController(l, g);
    return await b.init(), b;
  }
}
const IBizRawActivity = withInstall(RawActivity, (N) => {
  N.component(RawActivity.name, RawActivity), registerEditorProvider(
    "EDITOR_CUSTOMSTYLE_RAW_ACTIVITY",
    () => new RawActivityEditorProvider()
  );
}), index = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(N) {
    N.use(IBizRawActivity);
  }
};
export {
  IBizRawActivity,
  index as default
};
