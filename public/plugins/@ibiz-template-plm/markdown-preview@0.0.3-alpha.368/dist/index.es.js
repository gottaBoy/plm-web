import './assets/style.css';
import { registerEditorProvider as Oe, EditorController as Ne, getDeACMode as Ue, UIActionUtil as _e, OpenAppViewCommand as Be } from "@ibiz-template/runtime";
import { getMarkDownProps as Ve, getEditorEmits as Re, useNamespace as He, useUIStore as Fe, withInstall as Je } from "@ibiz-template/vue3-util";
import { defineComponent as qe, ref as b, watch as _, onMounted as We, onBeforeUnmount as pe, onUnmounted as je, createVNode as g, nextTick as B, resolveComponent as $e } from "vue";
import { createUUID as Ge } from "qx-util";
import Ke from "cherry-markdown";
import { RuntimeModelError as ue } from "@ibiz-template/core";
import { clone as he } from "ramda";
var Qe = Object.defineProperty, Xe = (n, e, i) => e in n ? Qe(n, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : n[e] = i, p = (n, e, i) => (Xe(n, typeof e != "symbol" ? e + "" : e, i), i);
function ve(n, e) {
  return !!(n && n.nodeType === 1 && n.nodeName === e);
}
function Ye(n) {
  let e = n;
  for (; e; ) {
    if (e.classList.contains("cherry-previewer"))
      return null;
    const i = e.parentElement;
    if (ve(e, "svg") && i && i.dataset.type === "mermaid")
      return e;
    e = e.parentElement;
  }
  return null;
}
function Ze(n) {
  const e = n.cloneNode(!0), i = n.width.baseVal.value || n.clientWidth, r = n.height.baseVal.value || n.clientHeight;
  e.setAttribute("width", i), e.setAttribute("height", r), e.style.backgroundColor = "white";
  const s = new XMLSerializer().serializeToString(e), d = btoa(unescape(encodeURIComponent(s)));
  return "data:image/svg+xml;base64,".concat(d);
}
function et(n) {
  const e = b(""), i = b([]), r = b();
  let s = null;
  const d = async (o) => {
    var m;
    if (e.value = o, i.value = [o], await B(), r.value) {
      const {
        container: v
      } = r.value.$refs;
      v && ((m = v.children[0]) == null || m.click());
    }
  }, h = (o) => {
    (o.key === "Escape" || o.keyCode === 27) && (o.stopPropagation(), o.preventDefault(), i.value = [], C());
  }, f = async () => {
    var o;
    await B();
    const m = (o = r.value) == null ? void 0 : o.$refs.container;
    if (!m)
      return;
    const v = m.querySelector(".el-image-viewer__wrapper");
    v == null || v.addEventListener("keydown", h);
  }, C = () => {
    var o;
    const m = (o = r.value) == null ? void 0 : o.$refs.container;
    if (!m)
      return;
    const v = m.querySelector(".el-image-viewer__wrapper");
    v == null || v.removeEventListener("keydown", h);
  }, u = (o) => {
    const m = o == null ? void 0 : o.target;
    if (ve(m, "IMG") && m) {
      d(m.src);
      return;
    }
    const v = Ye(m);
    v && d(Ze(v));
  }, l = () => g($e("el-image"), {
    class: n.e("img-preview"),
    ref: r,
    "zoom-rate": 1.1,
    src: e.value,
    "preview-src-list": i.value,
    "hide-on-click-modal": !0,
    onShow: f,
    fit: "cover"
  }, null), y = (o) => {
    var m, v;
    s = ((v = (m = o == null ? void 0 : o.previewer) == null ? void 0 : m.previewerBubble) == null ? void 0 : v.previewerDom) || null, s == null || s.addEventListener("click", u);
  };
  return pe(() => {
    s && (s.removeEventListener("click", u), s = null), C();
  }), {
    renderImgPreview: l,
    onMDEditorCreated: y
  };
}
const tt = (n) => n.replaceAll("&quot;", '"').replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("\\n", "").replaceAll(/>([\s]*)</g, "><"), me = (n) => n.replace(/<\?xml(.+?)>/, "").replaceAll("\n", "").replaceAll(/>([\s]*)</g, "><"), j = /* @__PURE__ */ qe({
  name: "MarkDownPreview",
  props: Ve(),
  emits: Re(),
  setup(n, {
    emit: e,
    slots: i
  }) {
    var r, s, d, h, f, C;
    const u = He("markdown"), l = n.controller, y = b("");
    let o = null;
    const m = Ge(), {
      onMDEditorCreated: v,
      renderImgPreview: fe
    } = et(u), be = ibiz.util.file.getUploadHeaders(), $ = b({
      ...be
    }), G = b(""), D = ((r = l == null ? void 0 : l.editorParams) == null ? void 0 : r.customTheme) || ((s = l == null ? void 0 : l.editorParams) == null ? void 0 : s.customtheme), V = ((d = l == null ? void 0 : l.editorParams) == null ? void 0 : d.enablenoaccess) === "true", {
      UIStore: R
    } = Fe(), I = b(D || R.theme), M = b(!1);
    let P = "default";
    l && (h = l.editorParams) != null && h.showmode && (P = l.editorParams.showmode);
    const A = b(!1), E = b("editOnly");
    let L = null, z = null, K = 0;
    const H = b({}), Q = b({}), F = b("pure");
    let S = !1, X = !1;
    (f = l == null ? void 0 : l.editorParams) != null && f.disabledirectory && (X = l.editorParams.disabledirectory === "true");
    let Y = "absolute";
    (C = l == null ? void 0 : l.editorParams) != null && C.tocpos && (Y = l.editorParams.tocpos === "fixed" ? "fixed" : "absolute"), _(() => n.data, (t) => {
      if (t && l) {
        const c = {
          ...l.editorParams,
          enableNoAccess: V
        };
        c.uploadparams && (c.uploadParams = JSON.parse(c.uploadparams));
        const a = ibiz.util.file.calcFileUpDownUrl(l.context, l.params, t, c);
        G.value = a.uploadUrl;
      }
    }, {
      immediate: !0,
      deep: !0
    });
    const w = b(), ge = (t, c) => {
      if (!l)
        return "";
      const a = {
        ...l.editorParams,
        enableNoAccess: V
      };
      return a.exportparams && (a.exportParams = JSON.parse(a.exportparams)), a.globaldownloadprifix ? a.globalDownloadPrifix = a.globaldownloadprifix === "true" : a.globalDownloadPrifix = ibiz.config.common.globalDownloadPrifix, c && c.folder && (a.osscat = c.folder), ibiz.util.file.calcFileUpDownUrl(l.context, l.params, t, a).downloadUrl;
    }, we = async (t, c) => {
      const a = await ibiz.util.file.fileUpload(G.value, t, $.value), k = ge(n.data || {}, a.fileid);
      let x = k.replace("%fileId%", a.fileid);
      if (ibiz.config.common.enableDownloadTicket && l && l.editorParams && !V) {
        const T = await ibiz.util.file.getDownloadTicket(l.context, l.params, n.data || {}, {
          fileId: a.fileid
        }, l.downloadTicketParams);
        T && T.ticket && (x = k.replace("%fileId%", T.ticket), c(x));
      } else
        c(x);
    }, Ce = () => o == null ? void 0 : o.getHtml(), O = () => o == null ? void 0 : o.getMarkdown(), J = (t) => {
      S = !0, o == null || o.setMarkdown(t, !0);
    };
    _(() => n.value, (t, c) => {
      t !== c && (t ? y.value = l.transformMarkdown(t) : y.value = "");
    }, {
      immediate: !0
    }), _(y, (t, c) => {
      const a = O();
      t !== c && a !== t && J(t);
    });
    const ye = (t) => {
      console.log(t, "afterChange"), P !== "manual" && (e("change", O(), l == null ? void 0 : l.model.id, S), S = !1);
    }, ke = (t, c) => (console.log("beforeImageMounted", t, c), {
      [t]: c
    }), Z = (t, c = "") => {
      const a = document.createElement(t);
      return a.className = c, a;
    }, q = (t) => Z("i", "ch-icon ch-icon-".concat(t)), ee = u.e("fullscreen"), te = (t) => {
      for (; t.firstChild; )
        t.removeChild(t.firstChild);
    }, W = () => {
      if (o && w.value) {
        const {
          parentElement: t
        } = o.editor.options.editorDom;
        if (!t)
          return {};
        const c = t.classList, a = w.value.querySelector(".".concat(ee));
        return a ? {
          parentElement: t,
          cherryClass: c,
          fullscreenNode: a
        } : {};
      }
      return {};
    }, Ie = () => {
      const {
        parentElement: t,
        cherryClass: c,
        fullscreenNode: a
      } = W();
      t && c && a && (te(a), a.appendChild(q("minscreen")), c.add("fullscreen"), a.title = ibiz.i18n.t("editor.common.minimize"), t.setAttribute("tabindex", "-1"), B(() => t == null ? void 0 : t.focus()));
    }, ie = () => {
      const {
        parentElement: t,
        cherryClass: c,
        fullscreenNode: a
      } = W();
      t && c && a && (te(a), a.appendChild(q("fullscreen")), a.title = ibiz.i18n.t("editor.common.fullscreen"), c.remove("fullscreen"), t == null || t.blur(), t.setAttribute("tabindex", "-1"));
    }, oe = () => {
      const {
        cherryClass: t
      } = W();
      return t == null ? void 0 : t.contains("fullscreen");
    }, re = () => {
      o && w.value && (oe() ? (ie(), o.toggleToc(F.value), A.value = !1) : (Ie(), F.value = o.toc.model, o.toggleToc("full"), A.value = !0));
    }, ne = (t) => {
      t.stopPropagation(), t.key === "Escape" && (t.preventDefault(), oe() && (ie(), o.toggleToc(F.value), A.value = !1));
    }, Ae = () => {
      (n.disabled || n.readonly || P === "manual") && (E.value = "previewOnly"), B(() => {
        var t, c, a;
        const k = ["bold", "italic", "underline", "strikethrough", "sub", "sup", "|", "size", "color"], x = ["bold", "italic", "underline", "strikethrough", "|", "color", "header", "|", "list", "image", {
          insert: ["link", "hr", "br", "code", "formula", "toc", "table", "line-table", "bar-table"]
        }, "settings", "togglePreview"];
        l && l.chatCompletion && (x.unshift("AIChart"), k.unshift("AI")), o = new Ke({
          id: m,
          value: y.value,
          previewer: {
            enablePreviewerBubble: !(n.disabled || n.readonly)
          },
          themeSettings: {
            // 目前应用的主题
            mainTheme: I.value,
            // 目前应用的代码块主题
            codeBlockTheme: I.value
          },
          fileUpload: we,
          emoji: {
            useUnicode: !0
          },
          header: {
            anchorStyle: "autonumber"
          },
          editor: {
            // 编辑器的高度，默认100%，如果挂载点存在内联设置的height则以内联样式为主
            height: "100%",
            // defaultModel 编辑器初始化后的默认模式，一共有三种模式：1、双栏编辑预览模式；2、纯编辑模式；3、预览模式
            // edit&preview: 双栏编辑预览模式
            // editOnly: 纯编辑模式（没有预览，可通过toolbar切换成双栏或预览模式）
            // previewOnly: 预览模式（没有编辑框，toolbar只显示“返回编辑”按钮，可通过toolbar切换成编辑模式）
            defaultModel: E.value,
            codemirror: {
              // 是否自动focus 默认为true
              autofocus: !1
            }
          },
          toolbars: {
            toolbar: x,
            bubble: k,
            float: ["h1", "h2", "h3", "|", "checklist", "quote", "quickTable", "code"],
            // 定义侧边栏，默认为空
            sidebar: ["theme", "copy"],
            // 定义顶部右侧工具栏，默认为空
            toolbarRight: [],
            // 目录
            toc: !X && {
              updateLocationHash: !1,
              // 要不要更新URL的hash
              defaultModel: "pure",
              // pure: 精简模式/缩略模式，只有一排小点； full: 完整模式，会展示所有标题
              showAutoNumber: !0,
              // 是否显示自增序号
              position: Y,
              // 悬浮目录的悬浮方式。当滚动条在cherry内部时，用absolute；当滚动条在cherry外部时，用fixed
              cssText: ""
              // 自定义样式
            }
          },
          callback: {
            afterChange: ye,
            beforeImageMounted: ke
          },
          engine: {
            syntax: {
              table: {
                enableChart: !1,
                externals: ["echarts"]
              }
            },
            global: {
              htmlWhiteList: "svg|g|title|rect|path",
              htmlAttrWhiteList: "data-value"
            }
          }
        }), o.toggleToc("pure");
        const T = o.engine.makeHtml(y.value);
        o.previewer.update(T), (c = (t = o.toc) == null ? void 0 : t.updateTocList) == null || c.call(t), o.setTheme(I.value), D && (o.setTheme(D), o.setCodeBlockTheme(D));
        const N = Z("span", "".concat(ee, " cherry-toolbar-button"));
        N.title = ibiz.i18n.t("editor.common.fullscreen"), N.onclick = re, N.appendChild(q("fullscreen"));
        const se = n.disabled ? o.editor.options.editorDom.parentElement : (a = o.editor.options.editorDom.parentElement) == null ? void 0 : a.querySelector(".cherry-toolbar>.toolbar-right");
        if (se == null || se.appendChild(N), l == null || l.setMDEditor(o), v(o), i.editorSwitchMenu && window.ResizeObserver && w.value) {
          const U = w.value.querySelector(".cherry-toolbar");
          U && (z = new ResizeObserver((Le) => {
            var ce;
            const ze = (ce = Le[0]) == null ? void 0 : ce.contentRect.height;
            Q.value = u.cssVarBlock({
              "toolbar-height": "".concat(ze, "px")
            });
          }), z.observe(U));
        }
        const de = o == null ? void 0 : o.wrapperDom;
        de && de.addEventListener("click", (U) => {
          l.handleClick(U);
        });
      });
    };
    _(() => R.theme, (t) => {
      I.value = D || t, o == null || o.setTheme(I.value), o == null || o.setCodeBlockTheme(I.value);
    });
    const Ee = () => {
      if (window.ResizeObserver && w.value) {
        const t = {
          width: w.value.offsetWidth ? "".concat(w.value.offsetWidth, "px") : "100%"
        };
        l && typeof l.parent.model.height == "number" && Object.assign(t, {
          height: "".concat(l.parent.model.height, "px")
        }), H.value = u.cssVarBlock(t), L = new ResizeObserver((c) => {
          const {
            width: a
          } = c[0].contentRect;
          if (a !== K) {
            const k = {
              width: "".concat(c[0].contentRect.width, "px")
            };
            l && typeof l.parent.model.height == "number" && Object.assign(k, {
              height: "".concat(l.parent.model.height, "px")
            }), H.value = u.cssVarBlock(k), K = a;
          }
        }), L.observe(w.value);
      }
    }, Pe = () => {
      M.value = !0, E.value = "editOnly", o == null || o.switchModel(E.value);
    }, le = () => {
      M.value = !1, E.value = "previewOnly", o == null || o.switchModel(E.value);
    }, xe = () => {
      J(y.value), le();
    }, De = () => {
      e("change", O(), l == null ? void 0 : l.model.id, S), S = !1, le();
    }, ae = () => {
      const t = document.getElementById(m);
      t == null || t.focus();
    }, Me = () => {
      if (P === "manual" && !M.value)
        return g("div", {
          onClick: ae,
          class: [u.e("header"), u.is("fullscreen", A.value)]
        }, [!n.disabled && !n.readonly && g("div", {
          class: u.em("header", "edit"),
          onClick: Pe,
          title: ibiz.i18n.t("editor.markdown.edit")
        }, [g("i", {
          class: "fa fa-edit",
          "aria-hidden": "true"
        }, null)]), g("div", {
          class: u.em("header", "full"),
          onClick: re
        }, [A.value ? g("i", {
          class: "fa fa-compress",
          "aria-hidden": "true",
          title: ibiz.i18n.t("editor.html.reduce")
        }, null) : g("i", {
          class: "fa fa-expand",
          "aria-hidden": "true",
          title: ibiz.i18n.t("editor.common.fullscreen")
        }, null)])]);
    }, Se = () => {
      if (P === "manual" && M.value && !n.disabled && !n.readonly)
        return g("div", {
          onClick: ae,
          class: [u.e("footer"), u.is("fullscreen", A.value)]
        }, [g("div", {
          class: u.em("footer", "cancel"),
          onClick: xe
        }, [ibiz.i18n.t("editor.common.cancel")]), g("div", {
          class: u.em("footer", "save"),
          onClick: De
        }, [ibiz.i18n.t("editor.common.confirm")])]);
    }, Te = () => {
      var t;
      return g("div", {
        class: [u.b("menu"), u.is("fullscreen", A.value)],
        style: Q.value
      }, [(t = i.editorSwitchMenu) == null ? void 0 : t.call(i)]);
    };
    return We(() => {
      var t;
      Ae(), Ee(), (t = w.value) == null || t.addEventListener("keydown", ne.bind(this));
    }), pe(() => {
      var t;
      (t = w.value) == null || t.removeEventListener("keydown", ne.bind(this));
    }), je(() => {
      o = null, L && L.disconnect(), z && z.disconnect();
    }), {
      ns: u,
      currentVal: y,
      id: m,
      editor: o,
      markDownBox: w,
      headers: $,
      theme: I,
      UIStore: R,
      defaultModel: E,
      cssVars: H,
      isEditing: M,
      showmode: P,
      getCherryHtml: Ce,
      getCherryContent: O,
      setCherryContent: J,
      renderHeader: Me,
      renderFooter: Se,
      renderImgPreview: fe,
      renderEditorSwitchMenu: Te
    };
  },
  render() {
    const n = !!this.$slots.editorSwitchMenu;
    return g("div", {
      ref: "markDownBox",
      class: [this.ns.b(), this.ns.is("preview", !0), this.ns.is("disabled", this.disabled), this.ns.is("manual", this.showmode === "manual"), this.ns.is("editing", this.isEditing), this.ns.is("show-editor-switch-menu", n)]
    }, [n ? this.renderEditorSwitchMenu() : null, this.renderHeader(), this.renderFooter(), this.renderImgPreview(), g("div", {
      tabindex: "-1",
      id: this.id,
      style: this.cssVars,
      class: [this.ns.b("cherry"), this.ns.m(this.UIStore.theme === "dark" ? "dark" : "light")]
    }, null)]);
  }
});
class it extends Ne {
  constructor() {
    super(...arguments), p(this, "uploadParams"), p(this, "exportParams"), p(this, "deService"), p(this, "deACMode"), p(this, "keyName", "srfkey"), p(this, "textName", "srfmajortext"), p(this, "sort", "asc"), p(this, "dataItems", []), p(this, "chatCompletion", !1), p(this, "mdeditor", null), p(this, "selectionAreaPosition", null), p(this, "selectionDirection", !0), p(this, "currentEditorTheme", "light"), p(this, "inlineAiChatHeight"), p(this, "linkViewId", "plmweb.recent_redirect_view"), p(this, "iconCodeListId", "plmweb.base__recent_visite"), p(this, "codeListItems", []);
  }
  async onInit() {
    if (await super.onInit(), this.style.height || (this.style.height = "600px"), this.editorParams) {
      const { uploadparams: s, exportparams: d, inlineaichatheight: h } = this.editorParams;
      if (s)
        try {
          this.uploadParams = JSON.parse(s);
        } catch (f) {
          throw new ue(
            s,
            ibiz.i18n.t("editor.markdown.uploadJsonFormatErr")
          );
        }
      if (d)
        try {
          this.exportParams = JSON.parse(d);
        } catch (f) {
          throw new ue(
            d,
            ibiz.i18n.t("editor.markdown.exportJsonFormatErr")
          );
        }
      h && (this.inlineAiChatHeight = Number(h));
    }
    const { model: e } = this;
    if (e.appDEACModeId && (this.deACMode = await Ue(
      e.appDEACModeId,
      e.appDataEntityId,
      this.context.srfappid
    ), this.deACMode)) {
      if (this.deACMode.actype === "AUTOCOMPLETE") {
        const { minorSortAppDEFieldId: s, minorSortDir: d } = this.deACMode;
        s && d && (this.sort = "".concat(s.toLowerCase(), ",").concat(d.toLowerCase())), this.deACMode.textAppDEFieldId && (this.textName = this.deACMode.textAppDEFieldId), this.deACMode.valueAppDEFieldId && (this.keyName = this.deACMode.valueAppDEFieldId), this.deACMode.deacmodeDataItems && (this.dataItems = [], this.deACMode.deacmodeDataItems.forEach(
          (h) => {
            h.id !== "value" && h.id !== "text" && this.dataItems.push(h);
          }
        ));
      }
      this.deACMode.actype === "CHATCOMPLETION" && (this.deService = await ibiz.hub.getApp(e.appId).deService.getService(this.context, e.appDataEntityId), this.chatCompletion = !0);
    }
    const { LINKVIEWID: i, ICONCODELISTID: r } = this.editorParams;
    i && (this.linkViewId = i), r && (this.iconCodeListId = r), this.codeListItems = await this.loadCodeList(this.iconCodeListId);
  }
  /**
   * 加载代码表
   *
   * @param {string} appCodeListId
   * @return {*}  {(Promise<readonly CodeListItem[]>)}
   * @memberof CommentItemRawItemEditorController
   */
  async loadCodeList(e) {
    return await ibiz.hub.getApp(this.context.srfappid).codeList.get(
      e,
      this.context,
      this.params
    );
  }
  findCodeListItem(e, i) {
    if (e) {
      const r = e.find((s) => s.value == i);
      if (r)
        return r;
      for (let s = 0; s < e.length; s++) {
        const d = this.findCodeListItem(
          e[s].children,
          i
        );
        if (d)
          return d;
      }
    }
  }
  /**
   * 设置编辑器实例
   *
   * @param {IData} mdeditor
   * @memberof MarkDownPreviewController
   */
  setMDEditor(e) {
    this.mdeditor = e;
  }
  /**
   * 设置保存当前选区位置
   *
   * @param {IData} start
   * @param {IData} end
   * @memberof MarkDownPreviewController
   */
  setCursorPos(e, i) {
    this.selectionAreaPosition = { start: e, end: i };
  }
  /**
   * 设置当前编辑器的主题
   *
   * @param {string} theme
   * @memberof MarkDownPreviewController
   */
  setCurrentEditorTheme(e) {
    this.currentEditorTheme = e;
  }
  /**
   * 设置当前选区方向
   *
   * @param {boolean} direction
   * @memberof MarkDownPreviewController
   */
  setSelectionDirection(e) {
    this.selectionDirection = e;
  }
  /**
   * 获取当前主题
   *
   * @return {*}  {('light' | 'dark')}
   * @memberof MarkDownPreviewController
   */
  getCurrentTheme() {
    return this.currentEditorTheme === "dark" ? "dark" : "light";
  }
  /**
   * 获取选中文本
   *
   * @return {*}  {string}
   * @memberof MarkDownPreviewController
   */
  getSelectionText() {
    var e;
    return (e = this.mdeditor) == null ? void 0 : e.editor.editor.getSelection();
  }
  /**
   * 获取内联AI编辑器主题
   *
   * @return {*}  {('light' | 'dark')}
   * @memberof MarkDownPreviewController
   */
  getInLineAiEditorTheme() {
    return this.getCurrentTheme();
  }
  /**
   * 判断选区方向
   *
   * @param {IData} posA
   * @param {IData} posB
   * @return {*}  {boolean}
   * @memberof MarkDownPreviewController
   */
  isPositionBefore(e, i) {
    return e.line < i.line ? !0 : e.line > i.line ? !1 : e.ch < i.ch;
  }
  /**
   * 插入文本
   *
   * @param {string} text
   * @memberof MarkDownPreviewController
   */
  insertText(e) {
    var i, r, s;
    if (this.selectionAreaPosition) {
      const { start: d, end: h } = this.selectionAreaPosition, f = "\n".concat(e, "\n");
      if (d.line === h.line && d.ch === h.ch) {
        (i = this.mdeditor) == null || i.editor.editor.replaceSelection(f);
        return;
      }
      let C;
      if (this.selectionDirection ? C = h : C = d, (r = this.mdeditor) == null || r.editor.editor.setCursor(C), (s = this.mdeditor) == null || s.editor.editor.replaceSelection(f), this.selectionDirection === !1) {
        const u = (f.match(/\n/g) || []).length;
        this.selectionAreaPosition.start.line += u, this.selectionAreaPosition.end.line += u, this.selectionAreaPosition.end.ch -= this.selectionAreaPosition.start.ch, this.selectionAreaPosition.start.ch = 0;
      }
      this.restoreSelection();
    }
  }
  /**
   * 替换选中文本
   *
   * @param {string} text
   * @memberof MarkDownPreviewController
   */
  replaceSelectionText(e) {
    var i;
    (i = this.mdeditor) == null || i.editor.editor.replaceSelection(e);
  }
  /**
   * 恢复选区
   *
   * @memberof MarkDownPreviewController
   */
  restoreSelection() {
    var e, i, r;
    (r = this.mdeditor) == null || r.editor.editor.setSelection(
      (e = this.selectionAreaPosition) == null ? void 0 : e.start,
      (i = this.selectionAreaPosition) == null ? void 0 : i.end
    );
  }
  /**
   * 获取内联AI参数
   *
   * @return {*}  {IData}
   * @memberof MarkDownPreviewController
   */
  getInLineAiChatOptions() {
    var e, i, r, s, d;
    const h = (e = this.mdeditor) == null ? void 0 : e.wrapperDom.getBoundingClientRect();
    (i = this.mdeditor) != null && i.bubble.visible || (r = this.mdeditor) == null || r.bubble.showBubble();
    const f = (s = this.mdeditor) == null ? void 0 : s.bubble.bubbleDom.getBoundingClientRect();
    return {
      // 编辑器的左侧距离 + 10px
      left: h.left + 10,
      // 浮动工具栏的顶部距离位置
      top: f.top,
      // 编辑器的宽度 - 右侧工具栏的宽度(38px) - 左侧边距（10px）- 右侧边距（10px）
      width: h.width - 58,
      editorElement: (d = this.mdeditor) == null ? void 0 : d.wrapperDom,
      editorTheme: this.getCurrentTheme(),
      height: this.inlineAiChatHeight
    };
  }
  /**
   * 返回内联AI编辑器元素
   *
   * @return {*}  {Element}
   * @memberof MarkDownPreviewController
   */
  getInLineAiEditorElement() {
    var e;
    return (e = this.mdeditor) == null ? void 0 : e.wrapperDom;
  }
  /**
   *  执行内联AIUI操作
   *
   * @param {string} _uiAction
   * @param {string} _appId
   * @return {*}  {Promise<void>}
   * @memberof MarkDownPreviewController
   */
  async doInLineAIUIAction(e, i) {
    const r = this.ctrl.getEventArgs();
    r.params = he(r.params), r.params.editor = this, this.editorParams.srfaiappendcurdata && this.editorParams.srfaiappendcurdata === "true" && (r.context.srfaiappendcurdata = !0), await _e.exec(
      e,
      {
        ...r
      },
      i
    );
  }
  parseCommentTag(e) {
    let { icon: i } = e;
    const r = JSON.stringify(e);
    if (!e.icon && e.owner_subtype && this.codeListItems.length) {
      const s = this.findCodeListItem(
        this.codeListItems,
        e.owner_subtype
      );
      s && s.sysImage && (i = s.sysImage.rawContent || ""), i = tt(i), i = me(i);
    }
    return "<span data-value='".concat(r, "' class='comment-tag is-click'>").concat(i, " ").concat(e.identifier, " ").concat(e.name, "</span>");
  }
  /**
   * @description 转换markdown
   * @param {string} markdown
   * @returns {*}  {string}
   * @memberof MarkDownPreviewController
   */
  transformMarkdown(e) {
    return e.replace(
      /@{[^,]*,"name":"(.*?)"}/g,
      "<span class='comment-tag'>@$1</span>"
    ).replace(
      /#{(".+?":".+?")(,"icon":"((.|[\t\r\f\n\s])+?)")*}/g,
      (i, r, s, d) => {
        const h = JSON.parse("{".concat(r, "}"));
        d && (d = me(d));
        const f = { icon: d, ...h };
        return this.parseCommentTag(f);
      }
    );
  }
  handleClick(e) {
    const i = e.target.getAttribute("data-value");
    if (!i) {
      e.stopPropagation();
      return;
    }
    const r = JSON.parse(i);
    if (!r.owner_type)
      return;
    const s = this.context.clone(), d = he(this.params);
    s.srfkey = r.id, r.owner_subtype === "page" ? d.article_page = r.owner_id : d[r.owner_subtype] = r.owner_id, d[r.owner_type] = r.recent_parent, delete r.script, delete r.icon, delete r.id, Object.assign(d, r), r && this.linkViewId && ibiz.commands.execute(
      Be.TAG,
      this.linkViewId,
      s,
      d
    );
  }
}
class ot {
  constructor() {
    p(this, "formEditor", "MarkDownPreview"), p(this, "gridEditor", "MarkDownPreview");
  }
  async createController(e, i) {
    const r = new it(e, i);
    return await r.init(), r;
  }
}
const rt = Je(
  j,
  function(n) {
    n.component(j.name, j), Oe(
      "MARKDOWN_PREVIEW",
      () => new ot()
    );
  }
), ht = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(n) {
    n.use(rt);
  }
};
export {
  rt as IbizMarkDownPreview,
  ht as default
};
