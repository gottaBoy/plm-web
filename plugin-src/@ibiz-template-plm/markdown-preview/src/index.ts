import './style.css';
var Ne = Object.defineProperty;
var Oe = (n, c, t) => c in n ? Ne(n, c, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[c] = t;
var m = (n, c, t) => (Oe(n, typeof c != "symbol" ? c + "" : c, t), t);
import { EditorController as Ue, getDeACMode as $e, UIActionUtil as Re, OpenAppViewCommand as Fe, registerEditorProvider as _e } from "@ibiz-template/runtime";
import { getMarkDownProps as Be, getEditorEmits as He, useNamespace as Ve, useUIStore as Je, withInstall as qe } from "@ibiz-template/vue3-util";
import { ref as w, onBeforeUnmount as we, createVNode as g, resolveComponent as We, nextTick as $, defineComponent as Ke, watch as U, onMounted as je, onUnmounted as Ge } from "vue";
import { createUUID as Xe } from "qx-util";
import Qe from "cherry-markdown";
import { RuntimeModelError as me } from "@ibiz-template/core";
import { clone as fe } from "ramda";
function ge(n, c) {
  return !!(n && n.nodeType === 1 && n.nodeName === c);
}
function Ye(n) {
  let c = n;
  for (; c; ) {
    if (c.classList.contains("cherry-previewer"))
      return null;
    const t = c.parentElement;
    if (ge(c, "svg") && t && t.dataset.type === "mermaid")
      return c;
    c = c.parentElement;
  }
  return null;
}
function Ze(n) {
  const c = n.cloneNode(!0), t = n.width.baseVal.value || n.clientWidth, o = n.height.baseVal.value || n.clientHeight;
  c.setAttribute("width", t), c.setAttribute("height", o), c.style.backgroundColor = "white";
  const e = new XMLSerializer().serializeToString(c), s = btoa(unescape(encodeURIComponent(e)));
  return "data:image/svg+xml;base64,".concat(s);
}
function et(n) {
  const c = w(""), t = w([]), o = w();
  let e = null;
  const s = async (d) => {
    var u;
    if (c.value = d, t.value = [d], await $(), o.value) {
      const {
        container: f
      } = o.value.$refs;
      f && ((u = f.children[0]) == null || u.click());
    }
  }, i = (d) => {
    (d.key === "Escape" || d.keyCode === 27) && (d.stopPropagation(), d.preventDefault(), t.value = [], p());
  }, h = async () => {
    var f;
    await $();
    const d = (f = o.value) == null ? void 0 : f.$refs.container;
    if (!d)
      return;
    const u = d.querySelector(".el-image-viewer__wrapper");
    u == null || u.addEventListener("keydown", i);
  }, p = () => {
    var f;
    const d = (f = o.value) == null ? void 0 : f.$refs.container;
    if (!d)
      return;
    const u = d.querySelector(".el-image-viewer__wrapper");
    u == null || u.removeEventListener("keydown", i);
  }, x = (d) => {
    const u = d == null ? void 0 : d.target;
    if (ge(u, "IMG") && u) {
      s(u.src);
      return;
    }
    const f = Ye(u);
    f && s(Ze(f));
  }, C = () => g(We("el-image"), {
    class: n.e("img-preview"),
    ref: o,
    "zoom-rate": 1.1,
    src: c.value,
    "preview-src-list": t.value,
    "hide-on-click-modal": !0,
    onShow: h,
    fit: "cover"
  }, null), y = (d) => {
    var u, f;
    e = ((f = (u = d == null ? void 0 : d.previewer) == null ? void 0 : u.previewerBubble) == null ? void 0 : f.previewerDom) || null, e == null || e.addEventListener("click", x);
  };
  return we(() => {
    e && (e.removeEventListener("click", x), e = null), p();
  }), {
    renderImgPreview: C,
    onMDEditorCreated: y
  };
}
const tt = (n) => n.replaceAll("&quot;", '"').replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("\\n", "").replaceAll(/>([\s]*)</g, "><"), pe = (n) => n.replace(/<\?xml(.+?)>/, "").replaceAll("\n", "").replaceAll(/>([\s]*)</g, "><");
const J = /* @__PURE__ */ Ke({
  name: "MarkDownPreview",
  props: Be(),
  emits: He(),
  setup(n, {
    emit: c,
    slots: t
  }) {
    var oe, ne, se, ae, le, ce;
    const o = Ve("markdown"), e = n.controller, s = w("");
    let i = null;
    const h = Xe(), {
      onMDEditorCreated: p,
      renderImgPreview: x
    } = et(o), C = ibiz.util.file.getUploadHeaders(), y = w({
      ...C
    }), d = w(""), u = ((oe = e == null ? void 0 : e.editorParams) == null ? void 0 : oe.customTheme) || ((ne = e == null ? void 0 : e.editorParams) == null ? void 0 : ne.customtheme), f = ((se = e == null ? void 0 : e.editorParams) == null ? void 0 : se.enablenoaccess) === "true", {
      UIStore: R
    } = Je(), I = w(u || R.theme), S = w(!1);
    let E = "default";
    e && ((ae = e.editorParams) != null && ae.showmode) && (E = e.editorParams.showmode);
    const k = w(!1), P = w("editOnly");
    let T = null, L = null, q = 0;
    const F = w({}), W = w({}), _ = w("pure");
    let M = !1, K = !1;
    (le = e == null ? void 0 : e.editorParams) != null && le.disabledirectory && (K = e.editorParams.disabledirectory === "true");
    let j = "absolute";
    (ce = e == null ? void 0 : e.editorParams) != null && ce.tocpos && (j = e.editorParams.tocpos === "fixed" ? "fixed" : "absolute"), U(() => n.data, (r) => {
      if (r && e) {
        const l = {
          ...e.editorParams,
          enableNoAccess: f
        };
        l.uploadparams && (l.uploadParams = JSON.parse(l.uploadparams));
        const a = ibiz.util.file.calcFileUpDownUrl(e.context, e.params, r, l);
        d.value = a.uploadUrl;
      }
    }, {
      immediate: !0,
      deep: !0
    });
    const v = w(), ve = (r, l) => {
      if (!e)
        return "";
      const a = {
        ...e.editorParams,
        enableNoAccess: f
      };
      return a.exportparams && (a.exportParams = JSON.parse(a.exportparams)), a.globaldownloadprifix ? a.globalDownloadPrifix = a.globaldownloadprifix === "true" : a.globalDownloadPrifix = ibiz.config.common.globalDownloadPrifix, l && l.folder && (a.osscat = l.folder), ibiz.util.file.calcFileUpDownUrl(e.context, e.params, r, a).downloadUrl;
    }, be = async (r, l) => {
      const a = await ibiz.util.file.fileUpload(d.value, r, y.value), b = ve(n.data || {}, a.fileid);
      let A = b.replace("%fileId%", a.fileid);
      if (ibiz.config.common.enableDownloadTicket && e && e.editorParams && !f) {
        const D = await ibiz.util.file.getDownloadTicket(e.context, e.params, n.data || {}, {
          fileId: a.fileid
        }, e.downloadTicketParams);
        D && D.ticket && (A = b.replace("%fileId%", D.ticket), l(A));
      } else
        l(A);
    }, Ce = () => i == null ? void 0 : i.getHtml(), z = () => i == null ? void 0 : i.getMarkdown(), B = (r) => {
      M = !0, i == null || i.setMarkdown(r, !0);
    };
    U(() => n.value, (r, l) => {
      r !== l && (r ? s.value = e.transformMarkdown(r) : s.value = "");
    }, {
      immediate: !0
    }), U(s, (r, l) => {
      const a = z();
      r !== l && a !== r && B(r);
    });
    const ye = (r) => {
      console.log(r, "afterChange"), E !== "manual" && (c("change", z(), e == null ? void 0 : e.model.id, M), M = !1);
    }, Ie = (r, l) => (console.log("beforeImageMounted", r, l), {
      [r]: l
    }), G = (r, l = "") => {
      const a = document.createElement(r);
      return a.className = l, a;
    }, H = (r) => G("i", "ch-icon ch-icon-".concat(r)), X = o.e("fullscreen"), Q = (r) => {
      for (; r.firstChild; )
        r.removeChild(r.firstChild);
    }, V = () => {
      if (i && v.value) {
        const {
          parentElement: r
        } = i.editor.options.editorDom;
        if (!r)
          return {};
        const l = r.classList, a = v.value.querySelector(".".concat(X));
        return a ? {
          parentElement: r,
          cherryClass: l,
          fullscreenNode: a
        } : {};
      }
      return {};
    }, ke = () => {
      const {
        parentElement: r,
        cherryClass: l,
        fullscreenNode: a
      } = V();
      r && l && a && (Q(a), a.appendChild(H("minscreen")), l.add("fullscreen"), a.title = ibiz.i18n.t("editor.common.minimize"), r.setAttribute("tabindex", "-1"), $(() => r == null ? void 0 : r.focus()));
    }, Y = () => {
      const {
        parentElement: r,
        cherryClass: l,
        fullscreenNode: a
      } = V();
      r && l && a && (Q(a), a.appendChild(H("fullscreen")), a.title = ibiz.i18n.t("editor.common.fullscreen"), l.remove("fullscreen"), r == null || r.blur(), r.setAttribute("tabindex", "-1"));
    }, Z = () => {
      const {
        cherryClass: r
      } = V();
      return r == null ? void 0 : r.contains("fullscreen");
    }, ee = () => {
      i && v.value && (Z() ? (Y(), i.toggleToc(_.value), k.value = !1) : (ke(), _.value = i.toc.model, i.toggleToc("full"), k.value = !0));
    }, te = (r) => {
      r.stopPropagation(), r.key === "Escape" && (r.preventDefault(), Z() && (Y(), i.toggleToc(_.value), k.value = !1));
    }, Pe = () => {
      (n.disabled || n.readonly || E === "manual") && (P.value = "previewOnly"), $(() => {
        var N, de, ue;
        const r = ["bold", "italic", "underline", "strikethrough", "sub", "sup", "|", "size", "color"], l = ["bold", "italic", "underline", "strikethrough", "|", "color", "header", "|", "list", "image", {
          insert: ["link", "hr", "br", "code", "formula", "toc", "table", "line-table", "bar-table"]
        }, "settings", "togglePreview"];
        e && e.chatCompletion && (l.unshift("AIChart"), r.unshift("AI")), i = new Qe({
          id: h,
          value: s.value,
          previewer: {
            enablePreviewerBubble: !(n.disabled || n.readonly)
          },
          themeSettings: {
            // 目前应用的主题
            mainTheme: I.value,
            // 目前应用的代码块主题
            codeBlockTheme: I.value
          },
          fileUpload: be,
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
            defaultModel: P.value,
            codemirror: {
              // 是否自动focus 默认为true
              autofocus: !1
            }
          },
          toolbars: {
            toolbar: l,
            bubble: r,
            float: ["h1", "h2", "h3", "|", "checklist", "quote", "quickTable", "code"],
            // 定义侧边栏，默认为空
            sidebar: ["theme", "copy"],
            // 定义顶部右侧工具栏，默认为空
            toolbarRight: [],
            // 目录
            toc: !K && {
              updateLocationHash: !1,
              // 要不要更新URL的hash
              defaultModel: "pure",
              // pure: 精简模式/缩略模式，只有一排小点； full: 完整模式，会展示所有标题
              showAutoNumber: !0,
              // 是否显示自增序号
              position: j,
              // 悬浮目录的悬浮方式。当滚动条在cherry内部时，用absolute；当滚动条在cherry外部时，用fixed
              cssText: ""
              // 自定义样式
            }
          },
          callback: {
            afterChange: ye,
            beforeImageMounted: Ie
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
        }), i.toggleToc("pure");
        const a = i.engine.makeHtml(s.value);
        i.previewer.update(a), (de = (N = i.toc) == null ? void 0 : N.updateTocList) == null || de.call(N), i.setTheme(I.value), u && (i.setTheme(u), i.setCodeBlockTheme(u));
        const b = G("span", "".concat(X, " cherry-toolbar-button"));
        b.title = ibiz.i18n.t("editor.common.fullscreen"), b.onclick = ee, b.appendChild(H("fullscreen"));
        const A = n.disabled ? i.editor.options.editorDom.parentElement : (ue = i.editor.options.editorDom.parentElement) == null ? void 0 : ue.querySelector(".cherry-toolbar>.toolbar-right");
        if (A == null || A.appendChild(b), e == null || e.setMDEditor(i), p(i), t.editorSwitchMenu && window.ResizeObserver && v.value) {
          const O = v.value.querySelector(".cherry-toolbar");
          O && (L = new ResizeObserver((Le) => {
            var he;
            const ze = (he = Le[0]) == null ? void 0 : he.contentRect.height;
            W.value = o.cssVarBlock({
              "toolbar-height": "".concat(ze, "px")
            });
          }), L.observe(O));
        }
        const D = i == null ? void 0 : i.wrapperDom;
        D && D.addEventListener("click", (O) => {
          e.handleClick(O);
        });
      });
    };
    U(() => R.theme, (r) => {
      I.value = u || r, i == null || i.setTheme(I.value), i == null || i.setCodeBlockTheme(I.value);
    });
    const Ae = () => {
      if (window.ResizeObserver && v.value) {
        const r = {
          width: v.value.offsetWidth ? "".concat(v.value.offsetWidth, "px") : "100%"
        };
        e && typeof e.parent.model.height == "number" && Object.assign(r, {
          height: "".concat(e.parent.model.height, "px")
        }), F.value = o.cssVarBlock(r), T = new ResizeObserver((l) => {
          const {
            width: a
          } = l[0].contentRect;
          if (a !== q) {
            const b = {
              width: "".concat(l[0].contentRect.width, "px")
            };
            e && typeof e.parent.model.height == "number" && Object.assign(b, {
              height: "".concat(e.parent.model.height, "px")
            }), F.value = o.cssVarBlock(b), q = a;
          }
        }), T.observe(v.value);
      }
    }, Ee = () => {
      S.value = !0, P.value = "editOnly", i == null || i.switchModel(P.value);
    }, ie = () => {
      S.value = !1, P.value = "previewOnly", i == null || i.switchModel(P.value);
    }, De = () => {
      B(s.value), ie();
    }, xe = () => {
      c("change", z(), e == null ? void 0 : e.model.id, M), M = !1, ie();
    }, re = () => {
      const r = document.getElementById(h);
      r == null || r.focus();
    }, Se = () => {
      if (E === "manual" && !S.value)
        return g("div", {
          onClick: re,
          class: [o.e("header"), o.is("fullscreen", k.value)]
        }, [!n.disabled && !n.readonly && g("div", {
          class: o.em("header", "edit"),
          onClick: Ee,
          title: ibiz.i18n.t("editor.markdown.edit")
        }, [g("i", {
          class: "fa fa-edit",
          "aria-hidden": "true"
        }, null)]), g("div", {
          class: o.em("header", "full"),
          onClick: ee
        }, [k.value ? g("i", {
          class: "fa fa-compress",
          "aria-hidden": "true",
          title: ibiz.i18n.t("editor.html.reduce")
        }, null) : g("i", {
          class: "fa fa-expand",
          "aria-hidden": "true",
          title: ibiz.i18n.t("editor.common.fullscreen")
        }, null)])]);
    }, Me = () => {
      if (E === "manual" && S.value && !n.disabled && !n.readonly)
        return g("div", {
          onClick: re,
          class: [o.e("footer"), o.is("fullscreen", k.value)]
        }, [g("div", {
          class: o.em("footer", "cancel"),
          onClick: De
        }, [ibiz.i18n.t("editor.common.cancel")]), g("div", {
          class: o.em("footer", "save"),
          onClick: xe
        }, [ibiz.i18n.t("editor.common.confirm")])]);
    }, Te = () => {
      var r;
      return g("div", {
        class: [o.b("menu"), o.is("fullscreen", k.value)],
        style: W.value
      }, [(r = t.editorSwitchMenu) == null ? void 0 : r.call(t)]);
    };
    return je(() => {
      var r;
      Pe(), Ae(), (r = v.value) == null || r.addEventListener("keydown", te.bind(this));
    }), we(() => {
      var r;
      (r = v.value) == null || r.removeEventListener("keydown", te.bind(this));
    }), Ge(() => {
      i = null, T && T.disconnect(), L && L.disconnect();
    }), {
      ns: o,
      currentVal: s,
      id: h,
      editor: i,
      markDownBox: v,
      headers: y,
      theme: I,
      UIStore: R,
      defaultModel: P,
      cssVars: F,
      isEditing: S,
      showmode: E,
      getCherryHtml: Ce,
      getCherryContent: z,
      setCherryContent: B,
      renderHeader: Se,
      renderFooter: Me,
      renderImgPreview: x,
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
class it extends Ue {
  constructor() {
    super(...arguments);
    /**
     * 上传参数
     */
    m(this, "uploadParams");
    /**
     * 下载参数
     */
    m(this, "exportParams");
    /**
     * 应用实体服务
     *
     * @author chitanda
     * @date 2023-10-12 14:10:41
     * @type {IAppDEService}
     */
    m(this, "deService");
    /**
     * 自填模式
     *
     * @author chitanda
     * @date 2023-10-12 10:10:52
     * @type {IAppDEACMode}
     */
    m(this, "deACMode");
    /**
     * 自填模式对应主键属性名称
     *
     * @author chitanda
     * @date 2023-10-12 10:10:58
     * @type {string}
     */
    m(this, "keyName", "srfkey");
    /**
     * 自填模式对应主文本属性名称
     *
     * @author chitanda
     * @date 2023-10-12 10:10:02
     * @type {string}
     */
    m(this, "textName", "srfmajortext");
    /**
     * 自填模式排序模式，默认升序
     *
     * @author chitanda
     * @date 2023-10-12 10:10:29
     * @type {string}
     */
    m(this, "sort", "asc");
    /**
     * 自填数据项集合（已排除了value和text)
     *
     * @author chitanda
     * @date 2023-10-12 10:10:23
     * @type {IDEACModeDataItem[]}
     */
    m(this, "dataItems", []);
    /**
     * AI 聊天自填模式
     *
     * @author chitanda
     * @date 2023-10-12 10:10:37
     * @type {boolean}
     */
    m(this, "chatCompletion", !1);
    /**
     * 编辑器实例
     *
     * @type {IData}
     * @memberof MarkDownPreviewController
     */
    m(this, "mdeditor", null);
    /**
     * 选区位置缓存
     *
     * @type {(IData | null)}
     * @memberof MarkDownPreviewController
     */
    m(this, "selectionAreaPosition", null);
    /**
     * 选区方向  true表示正向，从左到右；false表示反向，从右到左
     *
     * @type {boolean}
     * @memberof MarkDownPreviewController
     */
    m(this, "selectionDirection", !0);
    /**
     * 当前编辑器使用主题
     *
     * @type {string}
     * @memberof MarkDownPreviewController
     */
    m(this, "currentEditorTheme", "light");
    /**
     * AI行内聊天框高度
     *
     * @type {number}
     * @memberof MarkDownPreviewController
     */
    m(this, "inlineAiChatHeight");
    /**
     * @description 链接视图id
     * @type {string}
     * @memberof RawEditorController
     */
    m(this, "linkViewId", "plmweb.recent_redirect_view");
    /**
     * @description 图标代码表标识
     * @type {string}
     * @memberof CommentItemRawItemEditorController
     */
    m(this, "iconCodeListId", "plmweb.base__recent_visite");
    /**
     * @description 代码表数据
     * @type {readonly}
     * @memberof CommentItemRawItemEditorController
     */
    m(this, "codeListItems", []);
  }
  async onInit() {
    if (await super.onInit(), this.style.height || (this.style.height = "600px"), this.editorParams) {
      const { uploadparams: s, exportparams: i, inlineaichatheight: h } = this.editorParams;
      if (s)
        try {
          this.uploadParams = JSON.parse(s);
        } catch (p) {
          throw new me(
            s,
            ibiz.i18n.t("editor.markdown.uploadJsonFormatErr")
          );
        }
      if (i)
        try {
          this.exportParams = JSON.parse(i);
        } catch (p) {
          throw new me(
            i,
            ibiz.i18n.t("editor.markdown.exportJsonFormatErr")
          );
        }
      h && (this.inlineAiChatHeight = Number(h));
    }
    const { model: t } = this;
    if (t.appDEACModeId && (this.deACMode = await $e(
      t.appDEACModeId,
      t.appDataEntityId,
      this.context.srfappid
    ), this.deACMode)) {
      if (this.deACMode.actype === "AUTOCOMPLETE") {
        const { minorSortAppDEFieldId: s, minorSortDir: i } = this.deACMode;
        s && i && (this.sort = "".concat(s.toLowerCase(), ",").concat(i.toLowerCase())), this.deACMode.textAppDEFieldId && (this.textName = this.deACMode.textAppDEFieldId), this.deACMode.valueAppDEFieldId && (this.keyName = this.deACMode.valueAppDEFieldId), this.deACMode.deacmodeDataItems && (this.dataItems = [], this.deACMode.deacmodeDataItems.forEach(
          (h) => {
            h.id !== "value" && h.id !== "text" && this.dataItems.push(h);
          }
        ));
      }
      this.deACMode.actype === "CHATCOMPLETION" && (this.deService = await ibiz.hub.getApp(t.appId).deService.getService(this.context, t.appDataEntityId), this.chatCompletion = !0);
    }
    const { LINKVIEWID: o, ICONCODELISTID: e } = this.editorParams;
    o && (this.linkViewId = o), e && (this.iconCodeListId = e), this.codeListItems = await this.loadCodeList(this.iconCodeListId);
  }
  /**
   * 加载代码表
   *
   * @param {string} appCodeListId
   * @return {*}  {(Promise<readonly CodeListItem[]>)}
   * @memberof CommentItemRawItemEditorController
   */
  async loadCodeList(t) {
    return await ibiz.hub.getApp(this.context.srfappid).codeList.get(
      t,
      this.context,
      this.params
    );
  }
  findCodeListItem(t, o) {
    if (t) {
      const e = t.find((s) => s.value == o);
      if (e)
        return e;
      for (let s = 0; s < t.length; s++) {
        const i = this.findCodeListItem(
          t[s].children,
          o
        );
        if (i)
          return i;
      }
    }
  }
  /**
   * 设置编辑器实例
   *
   * @param {IData} mdeditor
   * @memberof MarkDownPreviewController
   */
  setMDEditor(t) {
    this.mdeditor = t;
  }
  /**
   * 设置保存当前选区位置
   *
   * @param {IData} start
   * @param {IData} end
   * @memberof MarkDownPreviewController
   */
  setCursorPos(t, o) {
    this.selectionAreaPosition = { start: t, end: o };
  }
  /**
   * 设置当前编辑器的主题
   *
   * @param {string} theme
   * @memberof MarkDownPreviewController
   */
  setCurrentEditorTheme(t) {
    this.currentEditorTheme = t;
  }
  /**
   * 设置当前选区方向
   *
   * @param {boolean} direction
   * @memberof MarkDownPreviewController
   */
  setSelectionDirection(t) {
    this.selectionDirection = t;
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
    var t;
    return (t = this.mdeditor) == null ? void 0 : t.editor.editor.getSelection();
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
  isPositionBefore(t, o) {
    return t.line < o.line ? !0 : t.line > o.line ? !1 : t.ch < o.ch;
  }
  /**
   * 插入文本
   *
   * @param {string} text
   * @memberof MarkDownPreviewController
   */
  insertText(t) {
    var o, e, s;
    if (this.selectionAreaPosition) {
      const { start: i, end: h } = this.selectionAreaPosition, p = "\n".concat(t, "\n");
      if (!!(i.line === h.line && i.ch === h.ch)) {
        (o = this.mdeditor) == null || o.editor.editor.replaceSelection(p);
        return;
      }
      let C;
      if (this.selectionDirection ? C = h : C = i, (e = this.mdeditor) == null || e.editor.editor.setCursor(C), (s = this.mdeditor) == null || s.editor.editor.replaceSelection(p), this.selectionDirection === !1) {
        const y = (p.match(/\n/g) || []).length;
        this.selectionAreaPosition.start.line += y, this.selectionAreaPosition.end.line += y, this.selectionAreaPosition.end.ch -= this.selectionAreaPosition.start.ch, this.selectionAreaPosition.start.ch = 0;
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
  replaceSelectionText(t) {
    var o;
    (o = this.mdeditor) == null || o.editor.editor.replaceSelection(t);
  }
  /**
   * 恢复选区
   *
   * @memberof MarkDownPreviewController
   */
  restoreSelection() {
    var t, o, e;
    (e = this.mdeditor) == null || e.editor.editor.setSelection(
      (t = this.selectionAreaPosition) == null ? void 0 : t.start,
      (o = this.selectionAreaPosition) == null ? void 0 : o.end
    );
  }
  /**
   * 获取内联AI参数
   *
   * @return {*}  {IData}
   * @memberof MarkDownPreviewController
   */
  getInLineAiChatOptions() {
    var e, s, i, h, p;
    const t = (e = this.mdeditor) == null ? void 0 : e.wrapperDom.getBoundingClientRect();
    (s = this.mdeditor) != null && s.bubble.visible || (i = this.mdeditor) == null || i.bubble.showBubble();
    const o = (h = this.mdeditor) == null ? void 0 : h.bubble.bubbleDom.getBoundingClientRect();
    return {
      // 编辑器的左侧距离 + 10px
      left: t.left + 10,
      // 浮动工具栏的顶部距离位置
      top: o.top,
      // 编辑器的宽度 - 右侧工具栏的宽度(38px) - 左侧边距（10px）- 右侧边距（10px）
      width: t.width - 58,
      editorElement: (p = this.mdeditor) == null ? void 0 : p.wrapperDom,
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
    var t;
    return (t = this.mdeditor) == null ? void 0 : t.wrapperDom;
  }
  /**
   *  执行内联AIUI操作
   *
   * @param {string} _uiAction
   * @param {string} _appId
   * @return {*}  {Promise<void>}
   * @memberof MarkDownPreviewController
   */
  async doInLineAIUIAction(t, o) {
    const e = this.ctrl.getEventArgs();
    e.params = fe(e.params), e.params.editor = this, this.editorParams.srfaiappendcurdata && this.editorParams.srfaiappendcurdata === "true" && (e.context.srfaiappendcurdata = !0), await Re.exec(
      t,
      {
        ...e
      },
      o
    );
  }
  parseCommentTag(t) {
    let { icon: o } = t;
    const e = JSON.stringify(t);
    if (!t.icon && t.owner_subtype && this.codeListItems.length) {
      const s = this.findCodeListItem(
        this.codeListItems,
        t.owner_subtype
      );
      s && s.sysImage && (o = s.sysImage.rawContent || ""), o = tt(o), o = pe(o);
    }
    return "<span data-value='".concat(e, "' class='comment-tag is-click'>").concat(o, " ").concat(t.identifier, " ").concat(t.name, "</span>");
  }
  /**
   * @description 转换markdown
   * @param {string} markdown
   * @returns {*}  {string}
   * @memberof MarkDownPreviewController
   */
  transformMarkdown(t) {
    return t.replace(
      /@{[^,]*,"name":"(.*?)"}/g,
      "<span class='comment-tag'>@$1</span>"
    ).replace(
      /#{(".+?":".+?")(,"icon":"((.|[\t\r\f\n\s])+?)")*}/g,
      (o, e, s, i) => {
        const h = JSON.parse("{".concat(e, "}"));
        i && (i = pe(i));
        const p = { icon: i, ...h };
        return this.parseCommentTag(p);
      }
    );
  }
  handleClick(t) {
    const o = t.target.getAttribute("data-value");
    if (!o) {
      t.stopPropagation();
      return;
    }
    const e = JSON.parse(o);
    if (!e.owner_type)
      return;
    const s = this.context.clone(), i = fe(this.params);
    s.srfkey = e.id, e.owner_subtype === "page" ? i.article_page = e.owner_id : i[e.owner_subtype] = e.owner_id, i[e.owner_type] = e.recent_parent, delete e.script, delete e.icon, delete e.id, Object.assign(i, e), e && this.linkViewId && ibiz.commands.execute(
      Fe.TAG,
      this.linkViewId,
      s,
      i
    );
  }
}
class rt {
  constructor() {
    m(this, "formEditor", "MarkDownPreview");
    m(this, "gridEditor", "MarkDownPreview");
  }
  async createController(c, t) {
    const o = new it(c, t);
    return await o.init(), o;
  }
}
const ot = qe(
  J,
  function(n) {
    n.component(J.name, J), _e(
      "MARKDOWN_PREVIEW",
      () => new rt()
    );
  }
), mt = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(n) {
    n.use(ot);
  }
};
export {
  ot as IbizMarkDownPreview,
  mt as default
};
