import './style.css';
var B = Object.defineProperty;
var F = (n, c, e) => c in n ? B(n, c, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[c] = e;
var h = (n, c, e) => (F(n, typeof c != "symbol" ? c + "" : c, e), e);
import { PluginStaticResource as J, EditorController as K, ScriptFactory as W, PanelItemEventName as G, OpenAppViewCommand as X, registerEditorProvider as N } from "@ibiz-template/runtime";
import { getRawProps as Y, getEditorEmits as Q, useNamespace as Z, withInstall as ee } from "@ibiz-template/vue3-util";
import { defineComponent as te, ref as f, computed as A, watch as O, createVNode as I, resolveComponent as M, nextTick as C } from "vue";
import { clone as ie } from "ramda";
const y = new J(import.meta.url), v = /* @__PURE__ */ te({
  name: "CommentItemRawItem",
  props: Y(),
  emits: {
    ...Q(),
    /** 点击事件 */
    click: (n, c) => !0
  },
  setup(n) {
    var k, _, S, b, R, T;
    const c = Z("raw"), e = n.controller, t = e.model, i = f(""), o = f(""), a = f(), p = f(), l = f([]), r = f(!0);
    let g = "TEXT", w = "";
    t.contentType && (g = t.contentType), (k = t.editorParams) != null && k.contenttype && (g = (_ = t.editorParams) == null ? void 0 : _.contenttype), (S = t.editorParams) != null && S.escaped && (r.value = ((b = t.editorParams) == null ? void 0 : b.escaped) === "true"), (R = t.editorParams) != null && R.template && (w = t.editorParams.template.replaceAll("//n", "\n")), (T = t.editorParams) != null && T.TEMPLATE && (w = t.editorParams.TEMPLATE.replaceAll("//n", "\n"));
    const D = A(() => !!(n.controlParams && n.controlParams.editmode === "hover")), $ = (s) => s.replaceAll(/{"emoji":"(.+?)"}/g, (m, d) => {
      const u = decodeURIComponent(atob(d));
      return '<span class="emoji-tag">'.concat(u, "</span>");
    }).replaceAll(/<span data-w-e-type="emoji" class='emoji'>(.+?)<\/span>/g, (m, d) => {
      const u = decodeURIComponent(atob(d));
      return "<span data-w-e-type=\"emoji\" class='emoji'>".concat(u, "</span>");
    });
    O(() => n.value, async (s, m) => {
      if (s !== m) {
        if ((typeof s == "string" || typeof s == "number") && (i.value = s), w && s) {
          let d = null;
          if (typeof s == "string")
            try {
              d = JSON.parse(s);
            } catch (u) {
              ibiz.log.error("JSON字符串转换错误");
            }
          i.value = await ibiz.util.hbs.render(w, d || s);
        }
        i.value = $(i.value ? "".concat(i.value) : "");
      }
    }, {
      immediate: !0
    });
    const E = A(() => e.scriptCode ? n.controller.getPanelItemCustomHtml(e.scriptCode, {
      content: i.value
    }) : ""), z = async (s) => {
      if (o.value = s, l.value = [s], await C(), a.value) {
        const {
          container: m
        } = a.value.$refs;
        m && m.children[0].click();
      }
    }, H = async () => {
      if (await C(), p.value) {
        p.value.querySelectorAll("img").forEach((u) => {
          u.onclick = (U) => {
            const x = U.target;
            x && z(x.src);
          };
        });
        const {
          Vditor: m
        } = window;
        p.value.querySelectorAll('[class^="language-"], [class*=" language-"]').forEach((u) => {
          m.preview(u, u.outerHTML, {
            cdn: y.dir("vditor")
          });
        });
      }
    }, P = (s) => {
      if (a.value) {
        const {
          container: m
        } = a.value.$refs;
        if (m) {
          const d = m.querySelector(".el-image-viewer__wrapper");
          d == null || d[s]("keydown", L);
        }
      }
    }, L = async (s) => {
      (s.key === "Escape" || s.keyCode === 27) && (s.stopPropagation(), s.preventDefault(), await C(), P("removeEventListener"), l.value = []);
    }, V = async () => {
      await C(), P("addEventListener");
    }, q = (s) => {
      s.stopPropagation(), s.preventDefault(), e.handleClick(s);
    };
    return O(() => E, () => {
      H();
    }, {
      immediate: !0
    }), {
      ns: c,
      c: e,
      rawRef: p,
      previewRef: a,
      content: i,
      previewUrl: o,
      type: g,
      template: w,
      htmlCode: E,
      showFormDefaultContent: D,
      previewSrcList: l,
      onShow: V,
      handleKeyPress: L,
      handleClick: q,
      escaped: r
    };
  },
  render() {
    let n = this.htmlCode || "";
    return this.htmlCode && this.escaped && n.includes("&") && (n = n.replace(/&reg/g, "&amp;reg").replace(/&copy/g, "&amp;copy").replace(/&trade/g, "&amp;trade").replace(/&quot;/g, '"')), this.c.model.id === "pcontent" && (n = n.replace(/<\/p>\n/g, " </p>")), I("div", {
      class: ["vditor", this.ns.b(), this.ns.is("comment-item", !0), this.disabled ? this.ns.m("disabled") : "", this.readonly ? this.ns.m("readonly") : "", this.ns.is("show-default", this.showFormDefaultContent)]
    }, [this.htmlCode ? I("div", {
      ref: "rawRef",
      onClick: this.handleClick,
      class: [this.ns.e("script"), "vditor-reset"],
      innerHTML: n
    }, null) : this.content && I(M("iBizRawItem"), {
      class: this.ns.b("content"),
      content: this.content,
      type: this.type
    }, null), I(M("el-image"), {
      class: this.ns.e("preview"),
      ref: "previewRef",
      "zoom-rate": 1.1,
      src: this.previewUrl,
      "preview-src-list": this.previewSrcList,
      "hide-on-click-modal": !0,
      onShow: this.onShow,
      fit: "cover"
    }, null)]);
  }
});
class ne extends K {
  constructor() {
    super(...arguments);
    /**
     * 绘制器脚本代码
     *
     * @type {string}
     * @memberof CommentItemRawItemEditorController
     */
    h(this, "scriptCode", "");
    /**
     * @description 链接视图id
     * @type {string}
     * @memberof CommentItemRawItemEditorController
     */
    h(this, "linkViewId", "plmweb.recent_redirect_view");
    /**
     * @description 图标代码表标识
     * @type {string}
     * @memberof CommentItemRawItemEditorController
     */
    h(this, "iconCodeListId", "plmweb.base__recent_visite");
    /**
     * @description 代码表数据
     * @type {readonly}
     * @memberof CommentItemRawItemEditorController
     */
    h(this, "codeListItems", []);
  }
  /**
   * 动态加载样式
   *
   * @return {*}
   * @memberof CommentItemRawItemEditorController
   */
  addStyle(e) {
    return new Promise((t, i) => {
      const o = document.createElement("link");
      o.rel = "stylesheet", o.href = e, o.onload = t, o.onerror = i, document.head.appendChild(o);
    });
  }
  /**
   * 动态加载脚本
   *
   * @return {*}
   * @memberof SheetUtil
   */
  addScript(e) {
    return new Promise((t, i) => {
      const o = document.createElement("script");
      o.src = e, o.onload = t, o.onerror = i, document.head.appendChild(o);
    });
  }
  /**
   * @description 化妆vditor样式资源
   * @returns {*}  {Promise<void>}
   * @memberof RawEditorController
   */
  loadVditor() {
    return new Promise((e, t) => {
      const { Vditor: i } = window;
      if (i)
        e();
      else {
        const o = [
          this.addStyle(y.dir("vditor/dist/index.css")),
          this.addScript(y.dir("vditor/dist/index.js"))
        ];
        Promise.all(o).then(() => {
          e();
        }).catch(() => {
          ibiz.message.error(
            "加载vditor静态资源失败,请确认静态资源是否存在！"
          ), t();
        });
      }
    });
  }
  async onInit() {
    await super.onInit(), await this.loadVditor();
    const { SCRIPTCODE: e, LINKVIEWID: t, ICONCODELISTID: i } = this.editorParams;
    e && (this.scriptCode = e), t && (this.linkViewId = t), i && (this.iconCodeListId = i), this.codeListItems = await this.loadCodeList(this.iconCodeListId);
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
  /**
   * 获取面板绘制器自定义html
   *
   * @param {string} controlRenders
   * @param {(IData | undefined)} data
   * @return {*}  {(string | undefined)}
   * @memberof CommentItemRawItemEditorController
   */
  getPanelItemCustomHtml(e, t) {
    if (e)
      return W.execScriptFn(
        { data: t || {}, controller: this },
        e,
        {
          singleRowReturn: !0,
          isAsync: !1
        }
      );
  }
  findCodeListItem(e, t) {
    if (e) {
      const i = e.find((o) => o.value == t);
      if (i)
        return i;
      for (let o = 0; o < e.length; o++) {
        const a = this.findCodeListItem(
          e[o].children,
          t
        );
        if (a)
          return a;
      }
    }
  }
  /**
   * @description 解析评论节点
   * @param {IData} data
   * @return {*}
   * @memberof CommentItemRawItemEditorController
   */
  parseCommentTag(e) {
    let { icon: t } = e;
    if (!e.icon && e.owner_subtype && this.codeListItems.length) {
      const i = this.findCodeListItem(
        this.codeListItems,
        e.owner_subtype
      );
      i && i.sysImage && (t = i.sysImage.rawContent || "");
    }
    return "<span class='comment-tag' data-value='".concat(JSON.stringify(
      e
    ), "'>").concat(t, " ").concat(e.identifier, " ").concat(e.name, "</span>");
  }
  /**
   * @description 点击事件
   * @param {MouseEvent} event
   * @memberof CommentItemRawItemEditorController
   */
  onClick(e) {
    const { panel: t } = this.parent;
    t && t.evt.emit("onPanelItemEvent", {
      panelItemName: this.model.id,
      panelItemEventName: G.CLICK,
      event: e
    });
  }
  /**
   * @description 处理点击事件
   * @param {MouseEvent} event
   * @return {*}  {void}
   * @memberof CommentItemRawItemEditorController
   */
  handleClick(e) {
    const { classList: t, dataset: i } = e.target, o = e.target;
    if (t && t.contains("comment-tag")) {
      const a = i.value || "", p = this.context.clone(), l = ie(this.params), r = JSON.parse(a);
      if (!r.owner_type)
        return;
      p.srfkey = r.id, r.owner_subtype === "page" ? l.article_page = r.owner_id : l[r.owner_subtype] = r.owner_id, l[r.owner_type] = r.recent_parent, delete r.script, delete r.icon, delete r.id, Object.assign(l, r), r && this.linkViewId && ibiz.commands.execute(
        X.TAG,
        this.linkViewId,
        p,
        l
      );
    } else if (o.tagName === "SPAN" && o.classList.contains("vditor-ir__link")) {
      e.stopPropagation(), e.preventDefault();
      const a = o.parentElement, p = a == null ? void 0 : a.querySelector(".vditor-ir__marker--link");
      if (p) {
        const l = p.textContent;
        l && window.open(l, "_blank");
      }
    }
  }
}
class j {
  constructor() {
    h(this, "formEditor", "CommentItemRawItem");
    h(this, "gridEditor", "CommentItemRawItem");
  }
  async createController(c, e) {
    const t = new ne(
      c,
      e
    );
    return await t.init(), t;
  }
}
const oe = ee(
  v,
  function(n) {
    n.component(v.name, v), N(
      "RAW_COMMENT_ITEM",
      () => new j()
    ), N(
      "EDITOR_CUSTOMSTYLE_COMMENT_ITEM",
      () => new j()
    );
  }
), me = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(n) {
    n.use(oe);
  }
};
export {
  oe as IBizCommentItemRawItem,
  me as default
};
