import './assets/style.css';
import { PluginStaticResource as H, registerEditorProvider as N, EditorController as U, ScriptFactory as J, PanelItemEventName as B, OpenAppViewCommand as K } from "@ibiz-template/runtime";
import { getRawProps as $, getEditorEmits as W, useNamespace as G, withInstall as X } from "@ibiz-template/vue3-util";
import { defineComponent as Y, ref as w, computed as A, watch as O, createVNode as C, resolveComponent as x, nextTick as I } from "vue";
import { clone as Q } from "ramda";
var Z = Object.defineProperty, ee = (n, e, t) => e in n ? Z(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t, v = (n, e, t) => (ee(n, typeof e != "symbol" ? e + "" : e, t), t);
const L = new H(import.meta.url), b = /* @__PURE__ */ Y({
  name: "CommentItemRawItem",
  props: $(),
  emits: {
    ...W(),
    /** 点击事件 */
    click: (n, e) => !0
  },
  setup(n) {
    var e, t, r, o, c, p;
    const d = G("raw"), a = n.controller, m = a.model, u = w(""), _ = w(""), f = w(), g = w(), E = w([]), S = w(!0);
    let P = "TEXT", y = "";
    m.contentType && (P = m.contentType), (e = m.editorParams) != null && e.contenttype && (P = (t = m.editorParams) == null ? void 0 : t.contenttype), (r = m.editorParams) != null && r.escaped && (S.value = ((o = m.editorParams) == null ? void 0 : o.escaped) === "true"), (c = m.editorParams) != null && c.template && (y = m.editorParams.template.replaceAll("//n", "\n")), (p = m.editorParams) != null && p.TEMPLATE && (y = m.editorParams.TEMPLATE.replaceAll("//n", "\n"));
    const D = A(() => !!(n.controlParams && n.controlParams.editmode === "hover")), M = (i) => i.replaceAll(/{"emoji":"(.+?)"}/g, (s, l) => {
      const h = decodeURIComponent(atob(l));
      return '<span class="emoji-tag">'.concat(h, "</span>");
    }).replaceAll(/<span data-w-e-type="emoji" class='emoji'>(.+?)<\/span>/g, (s, l) => {
      const h = decodeURIComponent(atob(l));
      return "<span data-w-e-type=\"emoji\" class='emoji'>".concat(h, "</span>");
    });
    O(() => n.value, async (i, s) => {
      if (i !== s) {
        if ((typeof i == "string" || typeof i == "number") && (u.value = i), y && i) {
          let l = null;
          if (typeof i == "string")
            try {
              l = JSON.parse(i);
            } catch (h) {
              ibiz.log.error("JSON字符串转换错误");
            }
          u.value = await ibiz.util.hbs.render(y, l || i);
        }
        u.value = M(u.value ? "".concat(u.value) : "");
      }
    }, {
      immediate: !0
    });
    const k = A(() => a.scriptCode ? n.controller.getPanelItemCustomHtml(a.scriptCode, {
      content: u.value
    }) : ""), j = async (i) => {
      if (_.value = i, E.value = [i], await I(), f.value) {
        const {
          container: s
        } = f.value.$refs;
        s && s.children[0].click();
      }
    }, z = async () => {
      if (await I(), g.value) {
        g.value.querySelectorAll("img").forEach((s) => {
          s.onclick = (l) => {
            const h = l.target;
            h && j(h.src);
          };
        });
        const {
          Vditor: i
        } = window;
        g.value.querySelectorAll('[class^="language-"], [class*=" language-"]').forEach((s) => {
          i.preview(s, s.outerHTML, {
            cdn: L.dir("vditor")
          });
        });
      }
    }, T = (i) => {
      if (f.value) {
        const {
          container: s
        } = f.value.$refs;
        if (s) {
          const l = s.querySelector(".el-image-viewer__wrapper");
          l == null || l[i]("keydown", R);
        }
      }
    }, R = async (i) => {
      (i.key === "Escape" || i.keyCode === 27) && (i.stopPropagation(), i.preventDefault(), await I(), T("removeEventListener"), E.value = []);
    }, q = async () => {
      await I(), T("addEventListener");
    }, F = (i) => {
      i.stopPropagation(), i.preventDefault(), a.handleClick(i);
    };
    return O(() => k, () => {
      z();
    }, {
      immediate: !0
    }), {
      ns: d,
      c: a,
      rawRef: g,
      previewRef: f,
      content: u,
      previewUrl: _,
      type: P,
      template: y,
      htmlCode: k,
      showFormDefaultContent: D,
      previewSrcList: E,
      onShow: q,
      handleKeyPress: R,
      handleClick: F,
      escaped: S
    };
  },
  render() {
    let n = this.htmlCode || "";
    return this.htmlCode && this.escaped && n.includes("&") && (n = n.replace(/&reg/g, "&amp;reg").replace(/&copy/g, "&amp;copy").replace(/&trade/g, "&amp;trade").replace(/&quot;/g, '"')), this.c.model.id === "pcontent" && (n = n.replace(/<\/p>\n/g, " </p>")), C("div", {
      class: ["vditor", this.ns.b(), this.ns.is("comment-item", !0), this.disabled ? this.ns.m("disabled") : "", this.readonly ? this.ns.m("readonly") : "", this.ns.is("show-default", this.showFormDefaultContent)]
    }, [this.htmlCode ? C("div", {
      ref: "rawRef",
      onClick: this.handleClick,
      class: [this.ns.e("script"), "vditor-reset"],
      innerHTML: n
    }, null) : this.content && C(x("iBizRawItem"), {
      class: this.ns.b("content"),
      content: this.content,
      type: this.type
    }, null), C(x("el-image"), {
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
class te extends U {
  constructor() {
    super(...arguments), v(this, "scriptCode", ""), v(this, "linkViewId", "plmweb.recent_redirect_view"), v(this, "iconCodeListId", "plmweb.base__recent_visite"), v(this, "codeListItems", []);
  }
  /**
   * 动态加载样式
   *
   * @return {*}
   * @memberof CommentItemRawItemEditorController
   */
  addStyle(e) {
    return new Promise((t, r) => {
      const o = document.createElement("link");
      o.rel = "stylesheet", o.href = e, o.onload = t, o.onerror = r, document.head.appendChild(o);
    });
  }
  /**
   * 动态加载脚本
   *
   * @return {*}
   * @memberof SheetUtil
   */
  addScript(e) {
    return new Promise((t, r) => {
      const o = document.createElement("script");
      o.src = e, o.onload = t, o.onerror = r, document.head.appendChild(o);
    });
  }
  /**
   * @description 化妆vditor样式资源
   * @returns {*}  {Promise<void>}
   * @memberof RawEditorController
   */
  loadVditor() {
    return new Promise((e, t) => {
      const { Vditor: r } = window;
      if (r)
        e();
      else {
        const o = [
          this.addStyle(L.dir("vditor/dist/index.css")),
          this.addScript(L.dir("vditor/dist/index.js"))
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
    const { SCRIPTCODE: e, LINKVIEWID: t, ICONCODELISTID: r } = this.editorParams;
    e && (this.scriptCode = e), t && (this.linkViewId = t), r && (this.iconCodeListId = r), this.codeListItems = await this.loadCodeList(this.iconCodeListId);
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
      return J.execScriptFn(
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
      const r = e.find((o) => o.value == t);
      if (r)
        return r;
      for (let o = 0; o < e.length; o++) {
        const c = this.findCodeListItem(
          e[o].children,
          t
        );
        if (c)
          return c;
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
      const r = this.findCodeListItem(
        this.codeListItems,
        e.owner_subtype
      );
      r && r.sysImage && (t = r.sysImage.rawContent || "");
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
      panelItemEventName: B.CLICK,
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
    const { classList: t, dataset: r } = e.target, o = e.target;
    if (t && t.contains("comment-tag")) {
      const c = r.value || "", p = this.context.clone(), d = Q(this.params), a = JSON.parse(c);
      if (!a.owner_type)
        return;
      p.srfkey = a.id, a.owner_subtype === "page" ? d.article_page = a.owner_id : d[a.owner_subtype] = a.owner_id, d[a.owner_type] = a.recent_parent, delete a.script, delete a.icon, delete a.id, Object.assign(d, a), a && this.linkViewId && ibiz.commands.execute(
        K.TAG,
        this.linkViewId,
        p,
        d
      );
    } else if (o.tagName === "SPAN" && o.classList.contains("vditor-ir__link")) {
      e.stopPropagation(), e.preventDefault();
      const c = o.parentElement, p = c == null ? void 0 : c.querySelector(".vditor-ir__marker--link");
      if (p) {
        const d = p.textContent;
        d && window.open(d, "_blank");
      }
    }
  }
}
class V {
  constructor() {
    v(this, "formEditor", "CommentItemRawItem"), v(this, "gridEditor", "CommentItemRawItem");
  }
  async createController(e, t) {
    const r = new te(
      e,
      t
    );
    return await r.init(), r;
  }
}
const ie = X(
  b,
  function(n) {
    n.component(b.name, b), N(
      "RAW_COMMENT_ITEM",
      () => new V()
    ), N(
      "EDITOR_CUSTOMSTYLE_COMMENT_ITEM",
      () => new V()
    );
  }
), se = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(n) {
    n.use(ie);
  }
};
export {
  ie as IBizCommentItemRawItem,
  se as default
};
