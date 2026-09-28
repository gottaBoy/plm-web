import './assets/style.css';
import { PluginStaticResource as Vn, registerEditorProvider as Se, EditorController as Un, convertNavData as zn, getDeACMode as Hn, UIActionUtil as Nn, ScriptFactory as hs, Srfuf as Bn, OpenAppViewCommand as Pn } from "@ibiz-template/runtime";
import { getEditorEmits as li, useNamespace as ds, useUIStore as ar, useClickOutside as jn, withInstall as Fn } from "@ibiz-template/vue3-util";
import { createUUID as Ht, QXEvent as qn } from "qx-util";
import { clone as ai } from "ramda";
import { RuntimeError as Rr, mergeInLeft as Yn, getToken as Jn } from "@ibiz-template/core";
import { createVNode as p, defineComponent as ci, ref as C, computed as hi, watch as Vt, onMounted as di, onUnmounted as ui, resolveComponent as pt, withDirectives as pi, resolveDirective as gi, createTextVNode as Ot, nextTick as oe } from "vue";
var Wn = Object.defineProperty, Kn = (r, t, e) => t in r ? Wn(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e, b = (r, t, e) => (Kn(r, typeof t != "symbol" ? t + "" : t, e), e);
class De {
  /**
   * 获取主题
   * @returns
   */
  static getThemeVar() {
    const t = document.documentElement;
    return t ? getComputedStyle(t).getPropertyValue("--ibiz-color-primary") : null;
  }
  /**
   * 是否包含中文字符
   * @param inputString
   * @returns
   */
  static isChineseCharacter(t) {
    return /[\u4e00-\u9fa5]/.test(t);
  }
  /**
   * 判断字符串是否同时存在英文和中文
   * @param str
   * @returns
   */
  static hasChineseAndEnglish(t) {
    return /[\u4e00-\u9fa5]+.*[a-zA-Z]+|[a-zA-Z]+.*[\u4e00-\u9fa5]+/.test(t);
  }
  /**
   * 字符串转16进制颜色
   * @param text
   * @returns
   */
  static stringToHexColor(t) {
    if (!t)
      return "";
    let e = 0;
    for (let a = 0; a < t.length; a++)
      if (this.isChineseCharacter(t))
        e = t.charCodeAt(a) + ((e << 5) - e), e = e & e;
      else {
        const d = t.charCodeAt(a);
        e += d.toString(16);
      }
    const s = String(e).substring(0, 6);
    let n = parseInt(s.substring(0, 2), 16), i = parseInt(s.substring(2, 4), 16), o = parseInt(s.substring(4, 6), 16);
    n < 0 && (n = 10), i < 0 && (i = 10), o < 0 && (o = 10);
    const l = "#".concat(n.toString(16).padStart(2, "0")).concat(i.toString(16).padStart(2, "0")).concat(o.toString(16).padStart(2, "0"));
    return l === "#FFFFFF" && this.getThemeVar() || l;
  }
  /**
   * 缩写名字
   * @param text
   * @returns
   */
  static avatarName(t) {
    if (t && t.toString().length < 2)
      return t;
    if (t && t.toString().length >= 2) {
      if (this.hasChineseAndEnglish(t)) {
        const e = t.split("").find((n) => /[a-zA-Z]/.test(n)) || "", s = t.split("").find((n) => /[\u4E00-\u9FA5]/.test(n)) || "";
        return "".concat(e).concat(s).toLowerCase();
      }
      return /[a-zA-Z]/.test(t) ? t.split("").filter((e) => /[a-zA-Z]/.test(e)).slice(0, 2).join("").toUpperCase() : /[\u4E00-\u9FA5]/.test(t) ? t.split("").filter((e) => /[\u4E00-\u9FA5]/.test(e)).slice(-2).join("") : t.replaceAll(" ", "").substring(0, 2);
    }
  }
  /**
   * 解析emoji表情
   *
   * @param {string} value
   * @return {*}  {string}
   */
  static getEmojiCustomHtml(t) {
    return t.replaceAll(/{"emoji":"(.+?)"}/g, (e, s) => {
      const n = decodeURIComponent(atob(s));
      return '<span class="emoji-tag">'.concat(n, "</span>");
    }).replaceAll(
      /<span data-w-e-type="emoji" class='emoji'>(.+?)<\/span>/g,
      (e, s) => {
        const n = decodeURIComponent(atob(s));
        return "<span data-w-e-type=\"emoji\" class='emoji'>".concat(n, "</span>");
      }
    );
  }
}
const Xn = (r, t) => {
  if (!r)
    return null;
  const e = JSON.parse(r);
  if (e.length === 0)
    return null;
  const { downloadUrl: s } = ibiz.util.file.calcFileUpDownUrl(
    t.context,
    t.params,
    t.editorParams
  );
  return s.replace("%fileId%", e[0].id);
}, Vr = (r) => r.replace(/<\?xml(.+?)>/, "").replaceAll("\n", "").replaceAll(/>([\s]*)</g, "><"), Gn = (r = "") => {
  if (typeof r != "string")
    return "TEXT";
  const t = r.trim();
  if (!t)
    return "TEXT";
  const e = t.replaceAll(
    /<span style="(.+?)">(.*?)<\/span>/g,
    (l, a, d) => d
  ), s = /<(?:html|head|body|div|p|br|hr|h[1-6]|ul|ol|li|table|tr|td|a\s|img\s|script|style)[\s>\\/]/i, n = (e.match(s) ? 2 : 0) + (e.includes("</") ? 1 : 0) + (/<[a-z]+\s*\/?>/i.test(e) ? 1 : 0), i = /^(```|#{1,6}\s|>\s|\*\s|\+\s|-\s|\d+\.\s|_{2}[^_]+_{2}|_{1}[^_]+_{1}|`[^`]+`|\[.*?\]\(.*?\)|!\[.*?\]\(.*?\)|\*\*.*\*\*|\*.*\*)/m, o = (e.match(i) ? 2 : 0) + (/\[.*?\]\(.*?\)/.test(e) ? 1 : 0) + // 链接
  (/\*\*.*\*\*/.test(e) ? 1 : 0) + // 加粗
  (/^#{1,6}\s+/m.test(e) ? 1 : 0);
  return n > o ? "HTML" : o > 0 ? "MD" : "TEXT";
}, Qn = (r) => r.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"), Rs = (r) => r.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/'&#39;/g, "'");
class Zn {
  constructor() {
    b(this, "operatorMap", /* @__PURE__ */ new Map()), b(this, "ns"), b(this, "model"), b(this, "context"), b(this, "params"), b(this, "controller"), b(this, "userUrl", ""), b(this, "userFieldMap", {
      id: "id",
      name: "name",
      title: "title"
    }), b(this, "userMethod", "post"), b(this, "editorParams");
  }
  /**
   * 初始化
   *
   * @param {IDomEditor} editor
   * @memberof MenTionController
   */
  async init(t) {
    if (this.ns = t.ns, this.controller = t.controller, this.model = t.model, this.context = t.context, this.params = t.params, this.editorParams = this.model.editorParams, this.editorParams) {
      const { USERURL: e, USERFIELDMAP: s, USERMETHOD: n } = this.editorParams;
      if (e && (this.userUrl = e), s) {
        const i = JSON.parse(s);
        Object.assign(this.userFieldMap, i);
      }
      n && (this.userMethod = n.toLowerCase());
    }
    await this.getOperatorUserList();
  }
  /**
   * @description 绘制完成
   * @memberof MenTionController
   */
  renderAfter() {
  }
  /**
   * 获取云系统操作者
   *
   * @memberof MenTionController
   */
  async getOperatorUserList() {
    const t = await ibiz.hub.getApp(this.context.srfappid);
    let e = [];
    e = await t.codeList.get(
      "SysOperator",
      this.context,
      this.params
    ), this.operatorMap = new Map(
      e.map((s) => [s.value, s])
    );
  }
  /**
   * 转换ui数据
   *
   * @param {IData[]} data
   * @return {*}  {IData[]}
   * @memberof MenTionController
   */
  toUIData(t) {
    return t.map((e) => {
      const s = {};
      return Object.keys(this.userFieldMap).forEach((n) => {
        s[n] = e[this.userFieldMap[n]];
      }), s;
    });
  }
  load(t = {}) {
    const { data: e, query: s } = t, { context: n, params: i } = this.controller.handlePublicParams(
      e,
      this.context,
      this.params
    ), o = hs.execScriptFn(
      { data: e, context: n, params: i },
      this.userUrl,
      {
        singleRowReturn: !0,
        isAsync: !1
      }
    ), l = {
      ...i,
      query: s,
      size: 20,
      page: 0
    };
    return ibiz.net[this.userMethod](o, l);
  }
  /**
   * 获取用户信息
   *
   * @param {IData} data
   * @return {*}  {Promise<IData[]>}
   * @memberof MenTionController
   */
  async getUsers(t = {}) {
    const e = await this.load(t);
    return e.ok ? this.toUIData(e.data).map((s) => {
      const n = s.name, i = De.stringToHexColor(n), o = De.avatarName(n), l = s.title;
      let a = "";
      if (this.operatorMap.has(s.id)) {
        const c = this.operatorMap.get(s.id);
        c.data.iconurl && (a = Xn(c.data.iconurl, {
          context: this.context,
          params: this.params,
          editorParams: this.editorParams
        }) || "");
      }
      const d = a ? '<img src="'.concat(a, '" />') : o;
      return {
        value: '@{"id":"'.concat(s.id, '","name":"').concat(s.name, '"}'),
        html: '<div class="'.concat(this.ns.e("user"), '"><div class="').concat(this.ns.e(
          "user-avatar"
        ), '" style="background: ').concat(i, ';">').concat(d, "</div> ").concat(n, " ").concat(l ? '<div class="'.concat(this.ns.e("user-title"), '">').concat(l, "</div>") : "", "</div>")
      };
    }) : [];
  }
  /**
   * @description ir编辑模式转html
   * @param {string} html
   * @returns {*}  {string}
   * @memberof MarkerController
   */
  VditorIRDOM2HTML(t) {
    const e = /<span contenteditable="false" class="mention" data-id="(.+?)">@(.+?)<\/span>/g;
    return t != null && t.match(e) ? t.replaceAll(e, (s, n, i) => n && i ? '@{"id":"'.concat(n, '","name":"').concat(i, '"}') : s) : t;
  }
  /**
   * @description ir编辑模式转换dom
   * @param {string} markdown
   * @returns {*}  {string}
   * @memberof MenTionController
   */
  spinVditorIRDOM(t) {
    const e = /@{"(user)?id":"(.+?)","name":"(.+?)"}/g, s = this.VditorIRDOM2HTML(t);
    if (s.match(e)) {
      const n = [];
      return { match: !0, markdown: s.replaceAll(
        e,
        (i, o, l, a) => {
          if (l && a) {
            const d = Ht();
            return n.push({
              uuid: d,
              replace: '<span contenteditable="false" class="mention" data-id="'.concat(l, '">@').concat(a, "</span>"),
              text: i
            }), d;
          }
          return i;
        }
      ), replace: n };
    }
    return { match: !1, markdown: t };
  }
}
class $n {
  constructor() {
    b(this, "model"), b(this, "context"), b(this, "params"), b(this, "ns"), b(this, "controller"), b(this, "quoteUrl", ""), b(this, "quoteFieldMap", {
      id: "id",
      name: "name",
      identifier: "show_identifier",
      owner_subtype: "owner_subtype",
      owner_id: "owner_id",
      owner_type: "owner_type",
      recent_parent: "recent_parent"
    }), b(this, "quoteCodelistMap", /* @__PURE__ */ new Map()), b(this, "quoteMethod", "post"), b(this, "quoteParams", {}), b(this, "editorParams"), b(this, "items", []), b(this, "linkViewId", ""), b(this, "codeListMap", {}), b(this, "dataMap", /* @__PURE__ */ new Map());
  }
  /**
   * 初始化
   *
   * @param {IDomEditor} editor
   * @memberof MarkerController
   */
  async init(t) {
    if (this.ns = t.ns, this.controller = t.controller, this.model = t.model, this.context = t.context, this.params = t.params, this.editorParams = this.model.editorParams, this.editorParams) {
      const {
        QUOTEURL: e,
        QUOTEFIELDMAP: s,
        QUOTEMETHOD: n,
        QUOTEPARAMS: i,
        QUOTECODELISTMAP: o,
        LINKVIEWID: l
      } = this.editorParams;
      if (e && (this.quoteUrl = e), s && (this.quoteFieldMap = JSON.parse(s)), n && (this.quoteMethod = n.toLowerCase()), i && (this.quoteParams = JSON.parse(i)), o) {
        const a = JSON.parse(o);
        await this.setCodeListMap(a);
      }
      l && (this.linkViewId = l);
    }
  }
  /**
   * @description 绘制完成
   * @memberof MarkerController
   */
  renderAfter() {
    this.controller.vditor.vditor.element.addEventListener(
      "click",
      (t) => {
        const { className: e } = t.target;
        let s = null;
        if (e === "marker" ? s = t.target : e.includes && e.includes("marker") && (s = t.target.parentElement), s) {
          const n = s.getAttribute("data-id") || "";
          this.handleClick(n);
        }
      }
    );
  }
  // 设置代码表map
  async setCodeListMap(t) {
    for (const e in t) {
      const s = await this.loadCodeList(t[e]);
      s && this.quoteCodelistMap.set(e, s);
    }
  }
  findCodeListItem(t, e) {
    if (t) {
      const s = t.find((n) => n.value == e);
      if (s)
        return s;
      for (let n = 0; n < t.length; n++) {
        const i = this.findCodeListItem(
          t[n].children,
          e
        );
        if (i)
          return i;
      }
    }
  }
  /**
   * 转换ui数据
   *
   * @param {IData[]} data
   * @return {*}  {IData[]}
   * @memberof MarkerController
   */
  toUIData(t) {
    return t.map((e) => {
      const s = {};
      return Object.keys(this.quoteFieldMap).forEach((n) => {
        s[n] = e[this.quoteFieldMap[n]];
      }), s;
    });
  }
  /**
   * 获取提及项信息
   *
   * @param {IData} data
   * @return {*}  {Promise<IData[]>}
   * @memberof MarkerController
   */
  load(t = {}) {
    const { data: e, query: s } = t, { context: n, params: i } = this.controller.handlePublicParams(
      e,
      this.context,
      this.params
    ), o = hs.execScriptFn(
      { data: e, context: n, params: i },
      this.quoteUrl,
      {
        singleRowReturn: !0,
        isAsync: !1
      }
    ), l = {
      ...i,
      query: s,
      size: 20,
      page: 0,
      ...this.quoteParams
    };
    return ibiz.net[this.quoteMethod](o, l);
  }
  /**
   * 加载代码表
   *
   * @param {string} appCodeListId
   * @return {*}  {(Promise<IData | undefined>)}
   * @memberof MarkerController
   */
  async loadCodeList(t) {
    const e = ibiz.hub.getApp(this.context.srfappid), s = e.codeList.getCodeList(t), n = await e.codeList.get(
      t,
      this.context,
      this.params
    );
    return { codeList: s, codeListItems: n };
  }
  /**
   * @description 根据类型获取图标
   * @param {string} type
   * @returns {*}  {string}
   * @memberof MarkerController
   */
  getIconByType(t) {
    const e = this.quoteCodelistMap.get("type"), s = this.findCodeListItem(e.codeListItems, t);
    return s && s.sysImage && s.sysImage.rawContent ? Vr(s.sysImage.rawContent) : "";
  }
  /**
   * 获取用户信息
   *
   * @param {IData} data
   * @return {*}  {Promise<IData[]>}
   * @memberof MenTionController
   */
  async getMarkers(t = {}) {
    const e = await this.load(t);
    return e.ok ? this.toUIData(e.data).map((s) => {
      const n = this.getIconByType(s.owner_subtype);
      return {
        value: '#{"id":"'.concat(s.id, '","name":"').concat(s.name, '","identifier":"').concat(s.identifier, '","owner_id":"').concat(s.owner_id, '","owner_type":"').concat(s.owner_type, '","owner_subtype":"').concat(s.owner_subtype, '","recent_parent":"').concat(s.recent_parent, '"}'),
        html: '<div class="'.concat(this.ns.e("marker"), '">\n          <div class="').concat(this.ns.e("marker-icon"), '">').concat(n, '</div>\n          <div class="').concat(this.ns.e("marker-identifier"), '">').concat(s.identifier, '</div>\n          <div class="').concat(this.ns.e("marker-name"), '" title="').concat(s.name, '">').concat(s.name, "</div>\n          </div>")
      };
    }) : [];
  }
  /**
   * @description ir编辑模式转html
   * @param {string} html
   * @returns {*}  {string}
   * @memberof MarkerController
   */
  VditorIRDOM2HTML(t) {
    const e = /<span contenteditable="false" class="marker" data-id="(.+?)"><span class="marker-icon">((.|[\t\r\f\n\s])*?)<\/span><span class="marker-identifier">(.+?)<\/span><span class="marker-name">(.+?)<\/span><\/span>/g, s = t;
    return s.match(e) ? s.replaceAll(
      e,
      (n, i, o, l, a, d) => {
        if (i && d) {
          const c = this.dataMap.get(i);
          if (c)
            return '#{"id":"'.concat(i, '","name":"').concat(c.name, '","identifier":"').concat(c.identifier, '","owner_id":"').concat(c.owner_id, '","owner_type":"').concat(c.owner_type, '","owner_subtype":"').concat(c.owner_subtype, '","recent_parent":"').concat(c.recent_parent, '"}');
        }
        return n;
      }
    ) : t;
  }
  /**
   * @description ir编辑模式转换dom
   * @param {string} markdown
   * @returns {*}  {string}
   * @memberof MenTionController
   */
  spinVditorIRDOM(t) {
    const e = /#{"id":"(.+?)","name":"(.+?)","identifier":"(.+?)","owner_id":"(.+?)","owner_type":"(.+?)","owner_subtype":"(.+?)","recent_parent":"(.+?)"}/g;
    let s = t;
    if (s = this.VditorIRDOM2HTML(s), s.match(e)) {
      const i = [];
      return { match: !0, markdown: s.replaceAll(
        e,
        (o, l, a, d, c, h, u, g) => {
          var f;
          if (l && a) {
            const y = Ht();
            let w = "";
            if (this.quoteCodelistMap.has("type") && u) {
              const T = this.quoteCodelistMap.get("type"), K = this.findCodeListItem(
                T.codeListItems,
                u
              );
              K && (f = K.sysImage) != null && f.rawContent && (w = Vr(K.sysImage.rawContent));
            }
            this.dataMap.set(l, {
              id: l,
              icon: w,
              name: a,
              identifier: d,
              owner_id: c,
              owner_type: h,
              owner_subtype: u,
              recent_parent: g
            });
            const E = '<span contenteditable="false" class="marker" data-id="'.concat(l, '"><span class="marker-icon">').concat(w, '</span><span class="marker-identifier">').concat(d, '</span><span class="marker-name">').concat(a, "</span></span>");
            return i.push({
              uuid: y,
              replace: E,
              text: o
            }), y;
          }
          return o;
        }
      ), replace: i };
    }
    const n = /#{(".+?":".+?")(,"icon":"((.|[\t\r\f\n\s])+?)")*}/g;
    if (s.match(n)) {
      const i = [];
      return { match: !0, markdown: s.replaceAll(
        n,
        (o, l, a, d) => {
          if (l && d) {
            const c = JSON.parse("{".concat(l, "}"));
            d && (d = Vr(d));
            const h = Ht(), u = { icon: d, ...c };
            this.dataMap.set(u.id, u);
            const { id: g, name: f, identifier: y } = c, w = '<span contenteditable="false" class="marker" data-id="'.concat(g, '"><span class="marker-icon">').concat(d, '</span><span class="marker-identifier">').concat(y, '</span><span class="marker-name">').concat(f, "</span></span>");
            return i.push({
              uuid: h,
              replace: w,
              text: o
            }), h;
          }
          return o;
        }
      ), replace: i };
    }
    return { match: !1, markdown: t };
  }
  /**
   * @description 处理点击事件
   * @param {MouseEvent} event
   * @memberof MarkerController
   */
  handleClick(t) {
    const e = this.context.clone(), s = ai(this.params), n = this.dataMap.get(t);
    if (!n || !n.owner_type)
      return;
    e.srfkey = n.id;
    const i = n.owner_subtype || n.type;
    s.owner_subtype = i, i === "page" ? (s.article_page = n.owner_id, e.article_page = n.owner_id) : (s[i] = n.owner_id, e[i] = n.owner_id), s[n.owner_type] = n.recent_parent, delete n.script, delete n.icon, delete n.id, Object.assign(s, n), n && this.linkViewId && ibiz.commands.execute(
      Pn.TAG,
      this.linkViewId,
      e,
      s
    );
  }
  parseCommentTag(t) {
    let { icon: e } = t;
    const s = JSON.stringify(t);
    if (!t.icon && t.owner_subtype && this.quoteCodelistMap.has("type")) {
      const n = this.quoteCodelistMap.get("type"), i = this.findCodeListItem(
        n.codeListItems,
        t.owner_subtype
      );
      i && i.sysImage && (e = i.sysImage.rawContent || "");
    }
    return "<span markerClick='marker' params='".concat(s, "' class='comment-tag is-click'>").concat(e, " ").concat(t.identifier, " ").concat(t.name, "</span>");
  }
}
const cr = new Vn(import.meta.url);
class us extends Un {
  constructor() {
    super(...arguments), b(this, "deService"), b(this, "deACMode"), b(this, "chatCompletion", !1), b(this, "vditor"), b(this, "inlineAiChatHeight"), b(this, "mentionController", new Zn()), b(this, "markerController", new $n()), b(this, "nodeHardBreak", !0), b(this, "templateActionTag", ""), b(this, "maxHeight", 0), b(this, "minHeight", 48), b(this, "valueItem", ""), b(this, "collapsed", C(!0)), b(this, "formatType", "MD"), b(this, "userAvatar", ""), b(this, "reply", C("")), b(this, "replyScript", ""), b(this, "collaborateKey"), b(this, "enableRealtime", !1), b(this, "domParser", new DOMParser());
  }
  /**
   * 动态加载脚本
   *
   * @return {*}
   * @memberof SheetUtil
   */
  addScript(t) {
    return new Promise((e, s) => {
      const n = document.createElement("script");
      n.src = t, n.onload = e, n.onerror = s, document.head.appendChild(n);
    });
  }
  /**
   * 动态加载样式
   *
   * @return {*}
   * @memberof SheetUtil
   */
  addStyle(t) {
    return new Promise((e, s) => {
      const n = document.createElement("link");
      n.rel = "stylesheet", n.href = t, n.onload = e, n.onerror = s, document.head.appendChild(n);
    });
  }
  /**
   * @description 加载Vditor静态资源
   * @returns {*}
   * @memberof VditorController
   */
  loadVditor() {
    return new Promise((t, e) => {
      const { Vditor: s } = window;
      if (s)
        t();
      else {
        this.ctrl.startLoading();
        const n = [
          this.addStyle(cr.dir("vditor/dist/index.css")),
          this.addScript(cr.dir("vditor/dist/index.js"))
        ];
        Promise.all(n).then(() => {
          t();
        }).catch(() => {
          ibiz.message.error(
            "加载vditor静态资源失败,请确认静态资源是否存在！"
          ), e();
        }).finally(() => {
          this.ctrl.endLoading();
        });
      }
    });
  }
  toBoolean(t) {
    return Object.is("true", t) || t === !0;
  }
  async onInit() {
    var t, e;
    await super.onInit();
    const { model: s } = this;
    s.editorItems && s.editorItems.length > 0 && (this.valueItem = s.editorItems[0].id);
    const n = this.parent;
    n.model.sysPFPluginId && (t = n.model.editor) != null && t.editorParams && Object.keys((e = n.model.editor) == null ? void 0 : e.editorParams).forEach((h) => {
      var u;
      this.editorParams[h] = (u = n.model.editor) == null ? void 0 : u.editorParams[h];
    }), await this.initPlugin(), await this.loadVditor();
    const {
      NODEHARDBREAK: i,
      MAXHEIGHT: o,
      REPLYSCRIPT: l,
      COLLABORATEKEY: a,
      ENABLEREALTIME: d
    } = this.editorParams;
    d && (this.enableRealtime = Object.is(d, "TRUE") || Object.is(d, "true")), a && (this.collaborateKey = zn(
      { collaboratekey: a },
      this.parent.data || {},
      this.params,
      this.context
    ).collaboratekey), l && (this.replyScript = l), i && (this.nodeHardBreak = this.toBoolean(i)), o && (this.maxHeight = Number(o));
    const { inlineaichatheight: c } = this.editorParams;
    if (c && (this.inlineAiChatHeight = Number(c)), s.appDEACModeId && (this.deACMode = await Hn(
      s.appDEACModeId,
      s.appDataEntityId,
      this.context.srfappid
    ), this.deACMode && (this.deACMode.actype === "CHATCOMPLETION" && (this.deService = await ibiz.hub.getApp(s.appId).deService.getService(this.context, s.appDataEntityId), this.chatCompletion = !0), this.deACMode.deuiactionGroup))) {
      const { uiactionGroupDetails: h = [] } = this.deACMode.deuiactionGroup, u = h.find((g) => g.userTag === "template");
      u && (this.templateActionTag = u.uiactionId);
    }
  }
  /**
   * @description 初始化插件
   * @returns {*}  {Promise<void>}
   * @memberof VditorController
   */
  async initPlugin() {
    const t = {
      ns: ds("vditor"),
      model: this.model,
      context: this.context,
      params: this.params,
      controller: this
    };
    await this.mentionController.init(t), await this.markerController.init(t);
  }
  /**
   * @description 绘制完成
   * @memberof VditorController
   */
  renderAfter() {
    this.mentionController.renderAfter(), this.markerController.renderAfter();
    const { lute: t } = this.vditor.vditor;
    if (!t)
      return;
    const e = t.SpinVditorIRDOM;
    t.SpinVditorIRDOM = (c) => this.spinVditorIRDOM(c, e);
    const s = t.SpinVditorSVDOM;
    t.SpinVditorSVDOM = (c) => this.spinVditorIRDOM(
      c,
      s,
      !0
    );
    const n = t.VditorIRDOM2HTML;
    t.VditorIRDOM2HTML = (c) => {
      if (this.formatType === "MD")
        return n(c);
      let h = this.VditorIRDOM2HTML(c);
      const u = this.spinVditorStyle(h, !1);
      u.match && (h = u.html);
      const g = this.adaptImageStyle(h);
      return h = n(h), u.match && u.replace.forEach((f) => {
        h = h.replace(f.uuid, f.replace);
      }), g.length && (h = h.replaceAll(
        /<img src="(.+?)"(.*?)(\/*)>/g,
        (f, y) => {
          const w = g.find((E) => E.url === y);
          return w ? '<img src="'.concat(w.url, '"').concat(w.attr, "/>") : f;
        }
      )), Rs(h);
    };
    const i = t.SpinVditorDOM;
    t.SpinVditorDOM = (c) => this.spinVditorIRDOM(c, i);
    const o = t.VditorIRDOM2Md;
    t.VditorIRDOM2Md = (c) => {
      let h = this.VditorIRDOM2HTML(c);
      const u = this.spinVditorStyle(h, !1);
      u.match && (h = u.html);
      let g = o(h);
      return u.match && u.replace.forEach((f) => {
        g = g.replace(f.uuid, f.replace);
      }), g;
    };
    const l = t.VditorDOM2Md;
    t.VditorDOM2Md = (c) => {
      let h = this.VditorIRDOM2HTML(c);
      const u = this.spinVditorStyle(h, !1);
      u.match && (h = u.html);
      let g = l(h);
      return u.match && u.replace.forEach((f) => {
        g = g.replace(f.uuid, f.replace);
      }), g;
    };
    const a = t.Md2VditorIRDOM;
    t.Md2VditorIRDOM = (c) => {
      let h = this.spinVditorIRDOM(c, a);
      return h = this.transformMDImageWidth(h), h;
    };
    const d = t.Md2VditorDOM;
    t.Md2VditorDOM = (c) => {
      let h = this.spinVditorIRDOM(c, d);
      return h = this.transformMDImageWidth(h), h;
    };
  }
  /**
   * @description vditor 预览模式解析提及用户、提及工作项，用户预览模式切换
   * @param {string} text
   * @returns {*}  {string}
   * @memberof VditorController
   */
  transformHtml(t) {
    let e = Rs(t);
    const s = this.mentionController.spinVditorIRDOM(e);
    s.match && (e = s.markdown, s.replace.forEach((i) => {
      e = e.replace(i.uuid, i.replace);
    }));
    const n = this.markerController.spinVditorIRDOM(e);
    return n.match && (e = n.markdown, n.replace.forEach((i) => {
      e = e.replace(i.uuid, i.replace);
    })), e = this.transformMDImageWidth(e), e;
  }
  /**
   * 获取选中文本
   * @returns 选中文本
   */
  getSelectionText() {
    return this.vditor ? this.vditor.getSelection() : "";
  }
  /**
   * 插入文本
   * @param text 文本
   */
  insertText(t) {
    this.vditor && (this.vditor.insertEmptyBlock("afterend"), this.vditor.insertValue(t));
  }
  /**
   * 替换选中文本
   * @param text 文本
   */
  replaceSelectionText(t) {
    this.vditor && (this.vditor.getSelection() ? (this.vditor.deleteValue(), this.vditor.insertValue(t)) : this.vditor.insertValue(t));
  }
  /**
   * 恢复选区
   */
  restoreSelection() {
    this.vditor;
  }
  /**
   * 获取内联AI编辑器元素
   */
  getInLineAiEditorElement() {
    if (!this.vditor)
      throw new Rr("编辑器未初始化");
    return this.vditor.vditor.element;
  }
  /**
   * 获取内联AI编辑器主题
   */
  getInLineAiEditorTheme() {
    return ibiz.util.theme.getTheme().indexOf("dark") !== -1 ? "dark" : "light";
  }
  /**
   * 获取内联AI参数
   */
  getInLineAiChatOptions() {
    if (!this.vditor)
      throw new Rr("编辑器未初始化");
    const t = this.vditor.getCursorPosition();
    if (!t || !t.left || !t.top)
      throw new Rr("获取选区位置失败");
    const e = this.vditor.vditor.element.getBoundingClientRect();
    return {
      // 编辑器的左侧距离 + 默认padding
      left: e.x + 10,
      // 编辑器的上方距离+选区距离编辑器上方距离
      top: e.y + Number(t.top),
      // 编辑器的宽度 - 左右padding
      width: e.width - 20,
      editorElement: this.getInLineAiEditorElement(),
      editorTheme: this.getInLineAiEditorTheme(),
      height: this.inlineAiChatHeight
    };
  }
  /**
   * 执行内联AIUI操作
   * @param uiActionId
   * @param appId
   */
  async doInLineAIUIAction(t, e) {
    const s = this.ctrl.getEventArgs();
    s.params = ai(s.params);
    const n = this.view.getCtx();
    n.vditor = this, s.params.editor = this, this.editorParams.srfaiappendcurdata && this.editorParams.srfaiappendcurdata === "true" && (s.context.srfaiappendcurdata = !0), await Nn.exec(
      t,
      {
        ...s
      },
      e
    );
  }
  /**
   * @description 兼容图片样式
   * @param {string} markdown
   * @returns {*}  {IData}
   * @memberof VditorController
   */
  adaptImageStyle(t) {
    const e = /<img src="(.+?)"(.*?)(\/*)>/g;
    if (t.match(e)) {
      const s = [];
      return t.replaceAll(e, (n, i, o) => (i && s.push({
        url: i,
        attr: o,
        html: n
      }), n)), s;
    }
    return [];
  }
  /**
   * @description md格式图片支持宽度
   * @param {string} html
   * @returns {*}  {string}
   * @memberof VditorController
   */
  transformMDImageWidth(t) {
    const e = /<img(.+?)\/>/g;
    return t.match(e) ? t.replaceAll(e, (s) => {
      const n = this.domParser.parseFromString(s, "text/html");
      if (n.body) {
        const i = n.body.children[0], [o, l] = i.alt.split("#");
        return l && (i.style.width = l), i.outerHTML;
      }
      return s;
    }) : t;
  }
  /**
   * @description 硬换行解析
   * @memberof VditorController
   */
  handleHardBreak(t) {
    let e = t;
    return this.nodeHardBreak && (e = e.replaceAll(
      /<p data-block="0"><\/p>/g,
      '<p data-block="0"><wbr></p>'
    ), e = e.replaceAll(
      /<p data-block="0">\n<\/p>/g,
      '<p data-block="0"><wbr></p>'
    ), e = e.replaceAll(
      /<p data-block="0"><br><\/p>/g,
      '<p data-block="0"><wbr></p>'
    )), e;
  }
  /**
   * @description 转换vditor样式
   * @param {string} html
   * @returns {*}  {IData}
   * @memberof VditorController
   */
  spinVditorStyle(t, e = !0) {
    const s = /<span style="([^>]+?)">[^span]+?<\/span>/g, n = e ? this.VditorIRDOM2HTML(t) : t;
    if (n.match(s)) {
      const i = [];
      return { match: !0, html: n.replaceAll(s, (o, l) => {
        if (l) {
          const a = Ht();
          return i.push({
            uuid: a,
            replace: o,
            text: '<span style="'.concat(l, '">').concat(Qn(o), "</span>")
          }), a;
        }
        return o;
      }), replace: i };
    }
    return { match: !1, html: t };
  }
  /**
   * @description ir编辑模式转换dom
   * @param {string} markdown
   * @param {string} value
   * @returns {*}  {string}
   * @memberof VditorController
   */
  spinVditorIRDOM(t, e, s = !1) {
    let n = t;
    const i = this.spinVditorStyle(n);
    i.match && (n = i.html), n = this.handleHardBreak(n);
    const o = this.adaptImageStyle(n), l = Ht();
    n = n.replaceAll(/<br>/g, l);
    const a = this.mentionController.spinVditorIRDOM(n);
    a.match && (n = a.markdown);
    const d = this.markerController.spinVditorIRDOM(n);
    d.match && (n = d.markdown);
    let c = e(n);
    return a.match && a.replace.forEach((h) => {
      c = c.replaceAll(h.uuid, s ? h.text : h.replace);
    }), d.match && d.replace.forEach((h) => {
      c = c.replaceAll(h.uuid, s ? h.text : h.replace);
    }), i.match && i.replace.forEach((h) => {
      c = c.replaceAll(h.uuid, s ? h.text : h.replace);
    }), c = c.replaceAll(l, "<br>"), o.length && (c = c.replaceAll(
      /<img src="(.+?)"(.*?)(\/*)>/g,
      (h, u, g) => {
        const f = o.find((y) => y.url === u);
        return f ? '<img src="'.concat(f.url, '"').concat(f.attr, "/>") : h;
      }
    )), c;
  }
  /**
   * @description md格式转html格式
   * @param {string} html
   * @returns {*}  {string}
   * @memberof VditorController
   */
  VditorIRDOM2HTML(t = "") {
    let e = this.mentionController.VditorIRDOM2HTML(t);
    return e = this.markerController.VditorIRDOM2HTML(e), e;
  }
  /**
   * @description 打开链接
   * @param {string} url
   * @memberof VditorController
   */
  openUrl(t) {
    t.startsWith("redirect://tree#") || window.open(t);
  }
  /**
   * @description 获取当前用户头像
   *
   * @memberof VditorController
   */
  async getCurrentUserAvatar() {
    var t, e;
    const s = await ibiz.hub.getApp(this.context.srfappid);
    let n = [];
    if (n = await s.codeList.get(
      "SysOperator",
      this.context,
      this.params
    ), this.context.srfuserid) {
      const i = n.filter((o) => o.value === this.context.srfuserid);
      i && i.length > 0 && (this.userAvatar = ((e = (t = i[0]) == null ? void 0 : t.data) == null ? void 0 : e.iconurl) || "");
    }
  }
  /**
   * 清空评论
   *
   * @memberof VditorController
   */
  clear() {
    this.reply.value = "", this.collapsed.value = !0;
  }
  /**
   * 设置回复
   *
   * @param {IData} data
   * @memberof VditorController
   */
  setReply(t) {
    let e = t.content.replace(/<\/p>\n/g, " </p>");
    e.includes("&") && (e = e.replace(/&reg/g, "&amp;reg").replace(/&copy/g, "&amp;copy").replace(/&trade/g, "&amp;trade")), this.reply.value = De.getEmojiCustomHtml(
      "".concat(t.name, ": ").concat(e)
    ), this.vditor.focus();
  }
  removeReply() {
    this.reply.value = "";
  }
  /**
   * 设置值
   *
   * @param {string} value
   * @memberof VditorController
   */
  async setValue(t) {
    let e = t;
    e.includes("&") && (e = e.replace(/&reg/g, "&amp;reg").replace(/&copy/g, "&amp;copy").replace(/&trade/g, "&amp;trade")), this.vditor.setValue(""), this.vditor.insertValue(e), this.collapsed.value = !1, this.vditor.focus();
  }
  toggleCollapse(t) {
    this.collapsed.value = !t && !this.collapsed.value;
  }
  /**
   * 清除数据（无焦点）
   *
   * @memberof VditorController
   */
  clearValue() {
    var t;
    if ((t = this.vditor) != null && t.vditor) {
      const e = this.vditor.vditor[this.vditor.vditor.currentMode];
      e.element.innerHTML = "";
    }
  }
}
class _e {
  constructor(t) {
    b(this, "formEditor", "IBizVditor"), b(this, "gridEditor", "IBizVditor"), t === "COMMENT" && (this.formEditor = "IBizCommentVditor", this.gridEditor = "IBizCommentVditor");
  }
  async createController(t, e) {
    const s = new us(t, e);
    return await s.init(), s;
  }
}
const fi = [
  "headings",
  "bold",
  "italic",
  "strike",
  "link",
  "color",
  "bg-color",
  "font-size",
  "|",
  "list",
  "ordered-list",
  "check",
  "|",
  "quote",
  "line",
  "code",
  "inline-code",
  "insert-before",
  "insert-after",
  "|",
  "upload",
  "emoji",
  "record",
  "table",
  "|",
  "undo",
  "redo",
  "|",
  "fullscreen",
  "edit-mode",
  "both",
  "export",
  "|",
  "outline"
], to = "<svg\n    viewBox='0 0 16 16'\n    xmlns='http://www.w3.org/2000/svg'\n    height='1em'\n    fill='currentColor'\n    width='1em'\n    preserveAspectRatio='xMidYMid meet'\n    focusable='false'\n  >\n    <g id='aqmaction/max-view' stroke-width='1' fill-rule='evenodd'>\n      <path\n        d='M2.1 1.9v12.2H.9V1.9h1.2zm13 0v12.2h-1.2V1.9h1.2zM6.224 5.075l.848.848-2.375 2.375 2.342 2.342-.848.849L3 8.299l3.224-3.224zm3.5 0l3.19 3.19-3.223 3.224-.849-.849 2.376-2.374-2.343-2.343.849-.848z'\n        id='aqm形状结合'\n      ></path>\n    </g>\n  </svg>", eo = "<svg\n    viewBox='0 0 16 16'\n    xmlns='http://www.w3.org/2000/svg'\n    height='1em'\n    width='1em'\n    fill='currentColor'\n    preserveAspectRatio='xMidYMid meet'\n    focusable='false'\n  >\n    <g id='aqsaction/min-view' stroke-width='1' fill-rule='evenodd'>\n      <path\n        d='M2.1 1.9v12.2H.9V1.9h1.2zm13 0v12.2h-1.2V1.9h1.2zM4.624 5.075l3.19 3.19-3.223 3.224-.849-.849 2.376-2.374-2.343-2.343.849-.848zm7.1 0l.848.848-2.375 2.375 2.342 2.342-.848.849L8.5 8.299l3.224-3.224z'\n        id='aqs形状结合'\n      ></path>\n    </g>\n  </svg>", ro = p("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  fill: "currentColor",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [p("g", {
  id: "awytips/shortcut",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [p("path", {
  d: "M14 2.4a1.6 1.6 0 011.593 1.454L15.6 4v9a1.6 1.6 0 01-1.454 1.593L14 14.6H2a1.6 1.6 0 01-1.593-1.454L.4 13V4a1.6 1.6 0 011.454-1.593L2 2.4h12zm0 1.2H2a.4.4 0 00-.392.32L1.6 4v9a.4.4 0 00.32.392L2 13.4h12a.4.4 0 00.392-.32L14.4 13V4a.4.4 0 00-.4-.4zm-2.985 7.3v1.2H4.95v-1.2h6.065zM6.3 8v1.5H4.8V8h1.5zm2.5 0v1.5H7.3V8h1.5zm2.5 0v1.5H9.8V8h1.5zm1.2-3v1.5H11V5h1.5zM5 5v1.5H3.5V5H5zm2.5 0v1.5H6V5h1.5zM10 5v1.5H8.5V5H10z",
  id: "awy形状结合"
}, null)])]), mi = "\n  <svg\n    xmlns='http://www.w3.org/2000/svg'\n    viewBox='0 0 16 16'\n    preserveAspectRatio='xMidYMid meet'\n    focusable='false'\n  >\n    <g\n      id='aae1.Base基础/1.icon图标/2.normal/ai-star'\n      stroke-width='1'\n      fill-rule='evenodd'\n    >\n      <path\n        d='M5.817 1.53l3.158 8.797h.054v.152l1.443 4.021-1.402.001-1.041-2.982H2.495l-1.03 2.982L0 14.5 4.671 1.533l1.146-.003zm7.86 5.424V14.5h-1.213V6.954h1.212zM5.248 3.549l-2.342 6.778h4.706L5.249 3.55zM13.046 0c.075 0 .147.02.204.071a.318.318 0 01.094.181l.064.273c.097.417.17.727.255.968.084.24.177.4.31.523.134.124.318.218.599.306.281.088.65.166 1.15.265a.358.358 0 01.195.095c.056.057.083.13.083.213a.289.289 0 01-.083.21.362.362 0 01-.197.094c-.528.093-.918.167-1.214.255-.295.088-.485.187-.621.324-.137.138-.23.324-.31.606-.08.283-.145.651-.23 1.147a.329.329 0 01-.093.184.293.293 0 01-.206.075.308.308 0 01-.207-.072.322.322 0 01-.1-.188l-.006-.033c-.085-.486-.149-.845-.228-1.12-.079-.274-.17-.452-.305-.585-.135-.133-.323-.23-.618-.32s-.683-.168-1.21-.273a.353.353 0 01-.2-.096.29.29 0 01-.08-.208c0-.079.023-.153.079-.211a.35.35 0 01.2-.097c.5-.098.869-.176 1.15-.263.282-.087.465-.18.597-.302.132-.12.224-.278.306-.511.082-.236.151-.539.244-.947l.071-.312a.312.312 0 01.102-.183.311.311 0 01.205-.069z'\n        id='aae形状结合'\n      ></path>\n    </g>\n  </svg>\n", vi = p("svg", {
  version: "1.1",
  fill: "CurrentColor",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 1024 1024",
  width: "14",
  height: "14"
}, [p("path", {
  d: "M274.344554 173.673875c16.429399 0 30.950568 8.00526 39.956484 20.338945a34.906655 34.906655 0 0 1 14.660796 15.754537l1.117013 2.815803 210.138065 597.927736c6.795162 19.268474-5.329083 40.817516-27.041022 48.147913-20.641469 6.95806-42.493035-1.419537-50.451753-18.803052l-1.117013-2.815803-54.477653-154.939008H134.997185L80.566074 837.039954c-6.771891 19.268474-29.856826 28.949253-51.568765 21.618855-20.641469-6.981331-32.602816-26.761769-27.925325-45.239025l0.861031-2.908888L212.047809 212.58316c4.025901-11.426112 13.799764-19.477914 25.598214-22.619512 9.029188-10.006575 22.107548-16.289773 36.67526-16.289773z m386.416675 169.460176c21.828295 0 39.723774 10.890876 41.469106 24.713912l0.116356 2.210755v461.652153c0 14.893506-18.616883 26.947938-41.585462 26.947938-21.805024 0-39.700503-10.890876-41.422565-24.737183l-0.162897-2.210755V370.081989c0-14.870235 18.616883-26.924667 41.585462-26.924667z m-389.697901-48.171184L163.620643 600.628812h214.88537l-107.442685-305.665945z m602.163076-206.181978a12.566396 12.566396 0 0 1 8.144887 8.051802l32.509731 99.041817 101.694723 36.07021a12.566396 12.566396 0 0 1-0.791218 23.922695l-99.53051 27.995137-30.857483 97.552467a12.566396 12.566396 0 0 1-23.899423 0.116355l-32.509732-99.018546-98.669479-31.322905a12.566396 12.566396 0 0 1-0.186169-23.876152l97.505924-32.812256 30.834212-97.529195a12.566396 12.566396 0 0 1 15.754537-8.191429zM649.544557 0.513593c2.676177 0.884302 4.770576 3.025243 5.608336 5.724692l18.523798 59.294772 60.970292 20.66474a8.796477 8.796477 0 0 1-0.325796 16.755194l-60.73758 18.058377-19.780438 59.550754a8.796477 8.796477 0 0 1-16.731924-0.162898l-18.523798-59.271501-59.062061-17.825665a8.796477 8.796477 0 0 1-0.395609-16.708653l59.574025-20.943993 19.780438-59.574025a8.796477 8.796477 0 0 1 11.100317-5.561794z",
  fill: "CurrentColor"
}, null)]), Xr = p("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  fill: "CurrentColor",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [p("g", {
  id: "afbeditor/bold",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [p("path", {
  d: "M10.788 6.717c1.796.246 3.143 1.936 3.143 4.05 0 2.285-1.7 4.214-3.713 4.214H3.116V7.823H2.8v-5.47h.325V1h5.479c1.666 0 3.02 1.53 3.02 3.412a3.63 3.63 0 01-.836 2.305zm-.57 7.065c1.34 0 2.514-1.41 2.514-3.015 0-1.616-1.054-2.881-2.399-2.881h-6.78v5.896h6.665zM8.604 6.623c.936 0 1.82-1.075 1.82-2.21 0-1.2-.833-2.213-1.82-2.213H3.553v4.423h5.05z",
  id: "afb形状结合"
}, null), p("path", {
  d: "M3.1 14.981c-.33 0-.6-.322-.6-.717V1.717c0-.395.27-.717.6-.717.33 0 .6.322.6.717v12.547c0 .395-.27.717-.6.717",
  id: "afbFill-1"
}, null)])]), Gr = p("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  fill: "CurrentColor",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [p("g", {
  id: "apceditor/italic",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [p("g", {
  id: "apc文本编辑_倾斜-1.5px-16*16",
  transform: "translate(2 1)"
}, [p("path", {
  d: "M3.646 12.8L6.754 1.2H3.5V0H11v1.2H7.996L4.888 12.8H8V14H.5v-1.2h3.146z",
  id: "apc形状结合"
}, null)])])]), Qr = p("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  fill: "CurrentColor",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [p("g", {
  id: "ayleditor/strike",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [p("path", {
  d: "M6 8.6H.894V7.4H3.5c-.62-.67-1-1.565-1-2.55v-.1A3.75 3.75 0 016.25 1h3.5a3.75 3.75 0 013.742 3.5h-1.204A2.55 2.55 0 009.75 2.2h-3.5A2.55 2.55 0 003.7 4.75v.1A2.55 2.55 0 006.25 7.4h8.85v1.2h-2.6a3.75 3.75 0 01-2.75 6.3h-3.5A3.75 3.75 0 012.503 11h1.201a2.55 2.55 0 002.546 2.7h3.5a2.55 2.55 0 000-5.1h-3.5a2.58 2.58 0 00-.25.012V8.6z",
  id: "ayl形状结合"
}, null)])]), Zr = p("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  fill: "CurrentColor",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [p("g", {
  id: "apveditor/link-insert",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [p("path", {
  d: "M12.253 4.13h-1.2v-1a2.8 2.8 0 00-5.6 0v4a2.8 2.8 0 002.8 2.8v1.2a4 4 0 01-4-4v-4a4 4 0 018 0v1zm-8 8h1.2v1a2.8 2.8 0 005.6 0v-4a2.8 2.8 0 00-2.8-2.8v-1.2a4 4 0 014 4v4a4 4 0 01-8 0v-1z",
  id: "apv形状结合",
  transform: "rotate(46 8.253 8.13)"
}, null)])]), so = "<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'>\n    <path\n      d='M416 221.25V416a48 48 0 01-48 48H144a48 48 0 01-48-48V96a48 48 0 0148-48h98.75a32 32 0 0122.62 9.37l141.26 141.26a32 32 0 019.37 22.62z'\n      fill='none'\n      stroke='currentColor'\n      stroke-linejoin='round'\n      stroke-width='32'\n    />\n    <path\n      d='M256 56v120a32 32 0 0032 32h120M176 288h160M176 368h160'\n      fill='none'\n      stroke='currentColor'\n      stroke-linecap='round'\n      stroke-linejoin='round'\n      stroke-width='32'\n    />\n  </svg>";
p("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  fill: "CurrentColor",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [p("g", {
  id: "ajpaction/edit",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [p("path", {
  d: "M2 8.34L10.71 0 15 4.17 6.538 13H2V8.34zm1.2.512V11.8h2.826l7.283-7.6-2.606-2.533L3.2 8.852zM0 16v-1.2h16V16H0z",
  id: "ajp编辑"
}, null)])]);
p("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  fill: "CurrentColor",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [p("g", {
  id: "aee1.Base基础/1.icon图标/1.-action/expand-arrows",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [p("path", {
  d: "M14.086 2.598v4.526a.6.6 0 101.2 0V1.2a.6.6 0 00-.6-.6L8.76.604a.6.6 0 000 1.2h4.42L9.826 5.007a.6.6 0 10.829.868l3.43-3.277zM1.803 13.292V8.766a.6.6 0 00-1.2 0v5.923a.6.6 0 00.6.6l.007-.002h5.917a.6.6 0 100-1.2H2.708l3.355-3.204a.6.6 0 00-.829-.868l-3.43 3.277z",
  id: "aee形状结合"
}, null)])]);
p("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  fill: "CurrentColor",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [p("g", {
  id: "aif1.Base基础/1.icon图标/1.-action/收起",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [p("path", {
  d: "M10.76 5.126V1.6a.6.6 0 10-1.2 0v4.923a.6.6 0 00.6.599l4.924-.001a.6.6 0 000-1.2h-3.419l3.354-3.204a.6.6 0 10-.829-.868l-3.43 3.277zm-4.836 6.435v3.526a.6.6 0 001.2 0v-4.923a.6.6 0 00-.6-.6l-.007.002H1.6a.6.6 0 100 1.2h3.419L1.664 13.97a.6.6 0 00.829.868l3.431-3.277z",
  id: "aif形状结合"
}, null)])]);
const io = "<svg\n    viewBox='0 0 16 16'\n    xmlns='http://www.w3.org/2000/svg'\n    height='1em'\n    width='1em'\n    fill='CurrentColor'\n    preserveAspectRatio='xMidYMid meet'\n    focusable='false'\n  >\n    <g id='ahhaction/close' stroke-width='1' fill-rule='evenodd'>\n      <path\n        d='M7.456 7.456V-.115h1.2v7.571h7.572v1.2H8.656v7.572h-1.2V8.656H-.115v-1.2h7.571z'\n        id='ahh形状结合'\n        transform='rotate(45 8.056 8.056)'\n      ></path>\n    </g>\n  </svg>", no = p("svg", {
  viewBox: "0 0 1024 1024",
  fill: "CurrentColor"
}, [p("path", {
  d: "M384 64h640v128H384V64z m0 384h640v128H384v-128z m0 384h640v128H384v-128zM0 128a128 128 0 1 1 256 0 128 128 0 0 1-256 0z m0 384a128 128 0 1 1 256 0 128 128 0 0 1-256 0z m0 384a128 128 0 1 1 256 0 128 128 0 0 1-256 0z"
}, null)]), oo = p("svg", {
  viewBox: "0 0 1024 1024",
  fill: "CurrentColor"
}, [p("path", {
  d: "M384 832h640v128H384z m0-384h640v128H384z m0-384h640v128H384zM192 0v256H128V64H64V0zM128 526.016v50.016h128v64H64v-146.016l128-60V384H64v-64h192v146.016zM256 704v320H64v-64h128v-64H64v-64h128v-64H64v-64z"
}, null)]), lo = p("svg", {
  viewBox: "0 0 16 16",
  fill: "CurrentColor"
}, [p("g", {
  id: "ahveditor/color-tt",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [p("path", {
  id: "ahvsecondary-color",
  d: "M1.999 15.011h11.998V13.81H1.999z",
  fill: "#FF0100"
}, null), p("path", {
  d: "M6.034 7.59h4.104L8.086 2.297 6.034 7.59zm-.465 1.2l-1.437 3.707H2.845L7.301 1h1.287l-.001.004h.286l4.454 11.492h-1.288L10.603 8.79H5.569z",
  id: "ahv合并形状"
}, null)])]), ao = p("svg", {
  viewBox: "0 0 1024 1024",
  fill: "CurrentColor"
}, [p("path", {
  d: "M929.28 625.664l-234.496 0.512 24.064-229.888 210.432-0.512c20.992 0 38.4-17.408 38.4-38.4s-17.408-38.4-38.4-38.4H727.04l29.184-275.456c2.048-20.992-13.312-39.936-34.304-41.984-20.992-2.048-39.936 13.312-41.984 34.304L650.24 318.976l-232.448 0.512 29.184-275.456c2.048-20.992-13.312-39.936-34.304-41.984-20.992-2.048-39.936 13.312-41.984 34.304l-29.696 283.648-246.272 0.512c-20.992 0-38.4 17.408-38.4 38.4s17.408 38.4 38.4 38.4l238.08-0.512-24.064 229.888-214.016 0.512c-20.992 0-38.4 17.408-38.4 38.4s17.408 38.4 38.4 38.4l205.824-0.512-29.184 276.992c-2.048 20.992 13.312 39.936 34.304 41.984h4.096c19.456 0 35.84-14.848 37.888-34.304l30.208-285.184 232.448-0.512-29.184 277.504c-2.048 20.992 13.312 39.936 34.304 41.984h4.096c19.456 0 35.84-14.848 38.4-34.304l30.208-285.184 242.688-0.512c20.992 0 38.4-17.408 38.4-38.4-1.536-20.992-18.944-37.888-39.936-37.888z m-544.256 0.512l24.064-229.888 232.448-0.512-24.064 229.888-232.448 0.512z"
}, null)]), co = p("svg", {
  viewBox: "0 0 1024 1024",
  fill: "CurrentColor"
}, [p("path", {
  d: "M23.7 555c0-339.3 247-550 533.8-550 295.6 0 442.8 165.9 442.8 401.6 0 210.8-93.5 361.7-237 361.7-63.6 0-108.5-26.2-137.2-78.6-48.6 51.1-96 79.8-174.6 79.8-116 0-178.4-77.3-178.4-193.3 0-209.5 131-323 251.9-323 64.9 0 102.3 24.9 122.2 68.6l11.2-58.6 114.7 1.2L727 510.1c-7.5 36.2-11.2 63.6-11.2 81.1 0 44.9 22.5 71.1 56.1 71.1 63.6 0 106-89.8 106-243.2 0-205.8-114.7-300.6-323-300.6-220.8 0-405.4 163.4-405.4 436.5 0 238.2 132.2 350.5 390.4 350.5 94.8 0 174.6-12.5 255.7-36.2v109.8c-88.6 26.2-177.1 39.9-263.2 39.9-329.1 0-508.7-168.4-508.7-464z m585-44.9c3.7-20 6.2-39.9 6.2-53.6 0-56.1-15-96-83.6-96-83.6 0-133.5 108.5-133.5 212 0 44.9 13.7 88.6 77.3 88.6 73.7-0.1 114.9-57.4 133.6-151z"
}, null)]), ho = p("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false",
  fill: "CurrentColor"
}, [p("g", {
  id: "axknormal/smile-plus",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [p("path", {
  d: "M14.727 7h1.211A8 8 0 1111.206.668L10.795 1.8A6.8 6.8 0 1014.727 7zm-.226-1h1.247-1.247zM5 8a1 1 0 110-2 1 1 0 010 2zm6.97 1.5a4 4 0 01-7.94 0h1.215a2.8 2.8 0 005.51 0h1.214zM11 8a1 1 0 110-2 1 1 0 010 2zm2.264-5.177V1.459h1.2v1.364h1.364v1.2h-1.364v1.363h-1.2V4.023H11.9v-1.2h1.364z",
  id: "axk形状结合"
}, null)])]), uo = p("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false",
  fill: "CurrentColor"
}, [p("g", {
  id: "ahqeditor/code",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [p("path", {
  d: "M4.875 2.702L1.43 8.032l3.446 5.332-1.008.652L0 8.033l3.867-5.982 1.008.651zm6.25 10.662l3.446-5.33-3.446-5.332 1.008-.651L16 8.033l-3.867 5.983-1.008-.652zM8.852 1.402l1.172.257L7.21 14.53l-1.172-.256L8.852 1.402z",
  id: "ahq形状结合"
}, null)])]), po = p("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 16 16",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false",
  fill: "CurrentColor"
}, [p("g", {
  id: "aae1.Base基础/1.icon图标/2.normal/ai-star",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [p("path", {
  d: "M5.817 1.53l3.158 8.797h.054v.152l1.443 4.021-1.402.001-1.041-2.982H2.495l-1.03 2.982L0 14.5 4.671 1.533l1.146-.003zm7.86 5.424V14.5h-1.213V6.954h1.212zM5.248 3.549l-2.342 6.778h4.706L5.249 3.55zM13.046 0c.075 0 .147.02.204.071a.318.318 0 01.094.181l.064.273c.097.417.17.727.255.968.084.24.177.4.31.523.134.124.318.218.599.306.281.088.65.166 1.15.265a.358.358 0 01.195.095c.056.057.083.13.083.213a.289.289 0 01-.083.21.362.362 0 01-.197.094c-.528.093-.918.167-1.214.255-.295.088-.485.187-.621.324-.137.138-.23.324-.31.606-.08.283-.145.651-.23 1.147a.329.329 0 01-.093.184.293.293 0 01-.206.075.308.308 0 01-.207-.072.322.322 0 01-.1-.188l-.006-.033c-.085-.486-.149-.845-.228-1.12-.079-.274-.17-.452-.305-.585-.135-.133-.323-.23-.618-.32s-.683-.168-1.21-.273a.353.353 0 01-.2-.096.29.29 0 01-.08-.208c0-.079.023-.153.079-.211a.35.35 0 01.2-.097c.5-.098.869-.176 1.15-.263.282-.087.465-.18.597-.302.132-.12.224-.278.306-.511.082-.236.151-.539.244-.947l.071-.312a.312.312 0 01.102-.183.311.311 0 01.205-.069z",
  id: "aae形状结合"
}, null)])]), go = p("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false",
  fill: "CurrentColor"
}, [p("g", {
  id: "ajpaction/edit",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [p("path", {
  d: "M2 8.34L10.71 0 15 4.17 6.538 13H2V8.34zm1.2.512V11.8h2.826l7.283-7.6-2.606-2.533L3.2 8.852zM0 16v-1.2h16V16H0z",
  id: "ajp编辑"
}, null)])]), fo = p("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  fill: "CurrentColor",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [p("g", {
  id: "aee1.Base基础/1.icon图标/1.-action/expand-arrows",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [p("path", {
  d: "M14.086 2.598v4.526a.6.6 0 101.2 0V1.2a.6.6 0 00-.6-.6L8.76.604a.6.6 0 000 1.2h4.42L9.826 5.007a.6.6 0 10.829.868l3.43-3.277zM1.803 13.292V8.766a.6.6 0 00-1.2 0v5.923a.6.6 0 00.6.6l.007-.002h5.917a.6.6 0 100-1.2H2.708l3.355-3.204a.6.6 0 00-.829-.868l-3.43 3.277z",
  id: "aee形状结合"
}, null)])]), mo = p("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "CurrentColor",
  height: "1em",
  width: "1em",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [p("g", {
  id: "aif1.Base基础/1.icon图标/1.-action/收起",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [p("path", {
  d: "M10.76 5.126V1.6a.6.6 0 10-1.2 0v4.923a.6.6 0 00.6.599l4.924-.001a.6.6 0 000-1.2h-3.419l3.354-3.204a.6.6 0 10-.829-.868l-3.43 3.277zm-4.836 6.435v3.526a.6.6 0 001.2 0v-4.923a.6.6 0 00-.6-.6l-.007.002H1.6a.6.6 0 100 1.2h3.419L1.664 13.97a.6.6 0 00.829.868l3.431-3.277z",
  id: "aif形状结合"
}, null)])]), vo = ["👍", "👎", "😕", "👀️", "❤️", "🚀️", "😄", "🎉️"], Vs = /* @__PURE__ */ ci({
  name: "IBizCommentVditor",
  props: {
    value: String,
    controller: us,
    data: Object,
    disabled: Boolean,
    readonly: {
      type: Boolean,
      default: !1
    },
    autoFocus: {
      type: Boolean,
      default: !1
    },
    overflowMode: {
      type: String
    },
    controlParams: {
      type: Object,
      required: !1
    }
  },
  emits: li(),
  setup(r, {
    emit: t,
    slots: e
  }) {
    var s;
    const n = ds("vditor"), i = r.controller, o = "vditor-".concat(Ht()), l = C(), a = C(), d = C(!1), c = C(!1), h = C(""), u = C(!1), g = C(), f = "left", y = C(!1), w = C({}), E = C(""), {
      zIndex: T
    } = ar(), {
      UIStore: K
    } = ar(), X = C(K.theme), z = C(""), H = ibiz.util.file.getUploadHeaders(), wt = C({
      ...H
    });
    let ct = !1;
    const At = C(255), We = C(!1), be = C(!1), ye = C(!1), Pt = C(), Ke = C(""), ee = C([]), bt = C(), {
      editorParams: jt
    } = i;
    jt && jt.enablenoaccess && (ct = ((s = i == null ? void 0 : i.editorParams) == null ? void 0 : s.enablenoaccess) === "true");
    const G = hi(() => {
      let m = "HTML";
      return r.data && r.data[i.valueItem] && (m = r.data[i.valueItem]), m;
    }), xt = (m, I) => {
      const x = {
        ...i.editorParams
      };
      return x.exportparams && (x.exportParams = JSON.parse(x.exportparams)), I && I.folder && (x.osscat = I.folder), ibiz.util.file.calcFileUpDownUrl(i.context, i.params, m, x).downloadUrl;
    };
    let re;
    const Dt = async () => {
      const {
        appDataEntityId: m
      } = i.model;
      if (!m || !i.deACMode)
        return;
      const I = T.increment();
      re = await ibiz.aiChatUtil.getAIChat();
      const {
        containerOptions: x,
        chatOptions: B
      } = await ibiz.aiChatUtil.getEditorExAIChatParams(i.editorParams, i.context, i.params, r.data, i.deACMode, {
        chatInstance: re,
        view: i.view,
        ctrl: i.ctrl
      }), q = await ibiz.aiChatUtil.getAIResourceOptions(i.context, i.params);
      re.create({
        resourceOptions: q,
        containerOptions: {
          zIndex: I,
          ...x
        },
        chatOptions: {
          caption: i.deACMode.logicName,
          context: {
            ...i.context
          },
          params: {
            ...i.params,
            srfactag: i.deACMode.codeName
          },
          appDataEntityId: m,
          ...B,
          action: (L, st) => {
            L === "backfill" && t("change", st.realcontent);
          }
        }
      });
    }, ke = (m, I = !1) => {
      if (!i.vditor || !i.vditor.vditor || !i.vditor.vditor.lute)
        return;
      const x = i.vditor.vditor[i.vditor.vditor.currentMode];
      if (G.value === "HTML")
        x && (!E.value || x.element.innerHTML !== E.value || I) && (i.vditor.setValue(""), i.vditor.insertValue(m));
      else if (!E.value || x.element.innerHTML !== E.value || I) {
        const B = "​";
        let q = m;
        q = q.replaceAll("\n\n", "\n".concat(B, "\n")), i.vditor.setValue(""), i.vditor.insertValue(q);
      }
    }, Ce = () => {
      if (G.value === "MD")
        t("change", i.vditor.getValue());
      else if (G.value === "HTML") {
        let m = i.vditor.getHTML();
        m = i.handleHardBreak(m), t("change", m);
      }
    }, F = async (m, I) => {
      const x = xt(m, I);
      let B = x.replace("%fileId%", I.id);
      const q = I.filename;
      if (ibiz.config.common.enableDownloadTicket) {
        const L = await ibiz.util.file.getDownloadTicket(i.context, i.params, m, {
          fileId: I.id
        }, i.downloadTicketParams);
        if (L && L.ticket)
          return B = x.replace("%fileId%", L.ticket), {
            url: B,
            alt: q
          };
      }
      return {
        url: B,
        alt: q
      };
    }, ht = async (m) => {
      if (Ke.value = m, ee.value = [m], await oe(), Pt.value) {
        const {
          container: I
        } = Pt.value.$refs;
        I && I.children[0].click();
      }
    }, Xe = () => {
      const m = [], {
        QUOTEURL: I,
        USERURL: x
      } = i.editorParams;
      x && m.push({
        key: "@",
        hint: async (L) => {
          d.value = !0;
          try {
            return await i.mentionController.getUsers({
              data: r.data,
              query: L
            });
          } finally {
            d.value = !1;
          }
        }
      }), I && m.push({
        key: "#",
        hint: async (L) => {
          d.value = !0;
          try {
            return await i.markerController.getMarkers({
              data: r.data,
              query: L
            });
          } finally {
            d.value = !1;
          }
        }
      });
      const B = e.editorSwitchMenu ? 128 : 8, q = {
        theme: X.value,
        height: i.maxHeight || i.parent.model.height || At.value,
        placeholder: i.placeHolder,
        cache: {
          enable: !1
        },
        toolbarConfig: {
          pin: !1,
          ellipsis: f === "left",
          offsetWidth: B
        },
        toolbar: [...fi],
        fullscreen: {
          index: T
        },
        preview: {
          maxWidth: 960
        },
        link: {
          click: (L) => {
            const st = L.textContent;
            i.openUrl(st);
          }
        },
        upload: {
          url: z.value,
          // 自定义增加 http  header
          headers: wt.value,
          fieldName: "file",
          filename: (L) => L,
          success: (L, st) => {
            const Lt = JSON.parse(st);
            ibiz.config.common.enableDownloadTicket && Lt.ticket && ibiz.util.file.setDownloadTicket(Lt.id, Lt.ticket), F(r.data || {}, Lt).then((Tt) => {
              const {
                url: Ze,
                alt: Or
              } = Tt;
              i.vditor.insertValue("![".concat(Or, "](").concat(Ze, ")"));
            });
          },
          error: (L) => {
            const st = L || ibiz.i18n.t("util.uploadManager.failed");
            ibiz.message.error(st);
          }
        },
        image: {
          preview: (L) => {
            ht(L.src);
          }
        },
        input: () => {
        },
        focus: () => {
          i.collapsed.value = !1, be.value = !0, t("focus");
        },
        blur: (L) => {
          be.value = !1;
          const st = i.vditor.vditor[i.vditor.vditor.currentMode];
          st && (E.value = st.element.innerHTML);
          const {
            hint: Lt
          } = i.vditor.vditor;
          if (Lt.element.style.display === "none") {
            const Tt = L.trim();
            Tt && Tt !== "<p><br></p>" && Tt !== '<p data-block="0"><wbr></p>' && Tt !== "\n" && Ce();
          }
        },
        select: () => {
          if (!u.value) {
            y.value = !0;
            const L = i.vditor.getCursorPosition();
            w.value = {
              top: "".concat(L.top + 90, "px"),
              left: "".concat(L.left, "px"),
              zIndex: T.zIndex + 2
            };
          }
        },
        unSelect: () => {
          y.value = !1;
        },
        after: () => {
          c.value = !0, u.value && i.vditor.disabled(), i.renderAfter(), r.value && ke(r.value);
        },
        hint: {
          extend: m
        },
        cdn: cr.dir("vditor")
      };
      i.chatCompletion && q.toolbar.unshift({
        name: "AI",
        tipPosition: "n",
        tip: "AI询问",
        className: "vditor-toolbar__ai",
        icon: mi,
        click() {
          Dt();
        }
      }), i.vditor = new window.Vditor(l.value, {
        ...q
      });
    };
    Vt(() => i.collapsed.value, (m) => {
      m && (i.clear(), i.clearValue(), t("change", ""), t("blur"));
    }, {
      immediate: !0
    }), Vt(() => G.value, () => {
      i.formatType = G.value;
    }, {
      immediate: !0
    }), Vt(() => r.value, (m) => {
      m ? (ke(m), h.value = m) : (h.value = "", i.clearValue());
    }, {
      immediate: !0
    }), Vt(() => r.data, (m) => {
      if (m) {
        const I = {
          ...i.editorParams,
          enableNoAccess: ct
        };
        I.uploadparams && (I.uploadParams = JSON.parse(I.uploadparams));
        const x = ibiz.util.file.calcFileUpDownUrl(i.context, i.params, m, I);
        z.value = x.uploadUrl;
      }
    }, {
      immediate: !0,
      deep: !0
    }), di(() => {
      l.value && Xe(), a.value && (bt.value = jn(a, () => {
        var m, I;
        const x = (I = (m = i.vditor) == null ? void 0 : m.getValue()) == null ? void 0 : I.trim();
        (!x || x === "<p><br></p>" || x === '<p data-block="0"><wbr></p>') && (i.collapsed.value = !0);
      }, {
        capture: !0,
        ignore: [l.value]
      }));
    }), ui(() => {
      var m;
      (m = bt.value) == null || m.stop();
    });
    const Er = (m) => {
      m.preventDefault();
      const I = ibiz.inLineAIUtil.calcContextMenus(i.deACMode, (L) => {
        i.doInLineAIUIAction(L, i.model.appId);
      }), x = T.increment(), B = i.vditor.getCursorPosition(), q = i.vditor.vditor.element.getBoundingClientRect();
      ibiz.inLineAIUtil.showContextMenus(
        // 编辑器的左侧距离+选区距离编辑器左侧距离
        q.x + B.left,
        // 编辑器的上方距离+选区距离编辑器上方距离+悬浮工具栏高度
        q.y + B.top + 123,
        I,
        {
          zIndex: x,
          onClose: () => {
            T.decrement();
          }
        }
      );
    }, rt = (m, I) => {
      if (m.preventDefault(), i.vditor && i.vditor.vditor.toolbar) {
        const x = i.vditor.vditor.toolbar.elements || {};
        x[I] && x[I].children[0] && x[I].children[0].click();
      }
    }, Ir = () => {
      var m;
      (m = i.vditor) == null || m.insertValue(" #");
    }, Ft = () => {
      var m;
      (m = i.vditor) == null || m.insertValue(" @");
    }, Ge = () => {
      We.value = !0;
    }, Ar = (m) => /^https?:|^http?:|^data:image|(\.png$|\.svg|\.jpg|\.png|\.gif|\.psd|\.tif|\.bmp|\.jpeg)$/.test(m), Me = () => {
      if (i.userAvatar && !We.value) {
        let x = "";
        if (Ar(i.userAvatar))
          x = i.userAvatar;
        else {
          let B = [];
          try {
            B = JSON.parse(i.userAvatar);
          } catch (L) {
            console.error("解析头像数据失败", L);
          }
          if (B.length === 0)
            return null;
          const {
            downloadUrl: q
          } = ibiz.util.file.calcFileUpDownUrl(i.context, i.params, r.data, i.editorParams);
          x = q.replace("%fileId%", B[0].id);
        }
        return p("div", {
          class: n.be("comment", "avatar-name")
        }, [p("img", {
          src: x,
          alt: "",
          onError: Ge
        }, null)]);
      }
      const m = De.stringToHexColor(i.context.srfusername), I = De.avatarName(i.context.srfusername);
      return i.context.srfusername ? p("div", {
        class: n.be("comment", "avatar-name"),
        style: "background: ".concat(m, ";")
      }, [I]) : p(pt("el-avatar"), {
        class: n.be("comment", "avatar"),
        src: "./assets/images/user-avatar.png"
      }, null);
    }, se = (m) => {
      var I;
      (I = i.vditor) == null || I.insertValue(m);
    }, xr = () => p("div", {
      class: n.be("comment", "footer-toolbar")
    }, [i != null && i.chatCompletion ? p("button", {
      class: {
        "vditor-inline-ai": !0
      },
      title: "AI",
      onClick: Dt
    }, [po]) : null, p(pt("el-popover"), {
      trigger: "hover",
      width: "216px",
      teleported: !1,
      "popper-class": n.be("comment", "font-btn-popover")
    }, {
      reference: () => p("div", {
        class: {
          "vditor-textcss": !0
        }
      }, [lo]),
      default: () => p("div", {
        class: n.be("comment", "font-list")
      }, [p("button", {
        class: {
          "vditor-bold": !0
        },
        title: "加粗",
        onClick: (m) => rt(m, "bold")
      }, [Xr]), p("button", {
        class: {
          "vditor-italic": !0
        },
        title: "斜体",
        onClick: (m) => rt(m, "italic")
      }, [Gr]), p("button", {
        class: {
          "vditor-strike": !0
        },
        title: "删除线",
        onClick: (m) => rt(m, "strike")
      }, [Qr]), p("button", {
        class: {
          "vditor-orderlist": !0
        },
        title: "有序列表",
        onClick: (m) => rt(m, "ordered-list")
      }, [oo]), p("button", {
        class: {
          "vditor-list": !0
        },
        title: "无序列表",
        onClick: (m) => rt(m, "list")
      }, [no]), p("button", {
        class: {
          "vditor-link": !0
        },
        title: "链接",
        onClick: (m) => rt(m, "link")
      }, [Zr])])
    }), p("button", {
      class: {
        "vditor-code": !0
      },
      title: "代码块",
      onClick: (m) => rt(m, "code")
    }, [uo]), p("button", {
      class: {
        "vditor-mentionMember": !0
      },
      title: "提及成员",
      onClick: Ft
    }, [co]), p("button", {
      class: {
        "vditor-mentioning": !0
      },
      title: "提及项",
      onClick: Ir
    }, [ao]), p(pt("el-popover"), {
      visible: ye.value,
      "onUpdate:visible": (m) => ye.value = m,
      width: "160px",
      teleported: !1
    }, {
      default: () => p("div", {
        class: [n.be("comment", "emoji-list"), n.is("disabled", !be.value)]
      }, [vo.map((m) => p("button", {
        class: n.be("comment", "emoji-item"),
        onClick: () => se(m)
      }, [m]))]),
      reference: () => p("button", {
        class: {
          "vditor-emoji": !0
        },
        title: "表情"
      }, [ho])
    })]), Dr = () => {
      if (i.reply.value) {
        const m = hs.execScriptFn({
          value: i.reply.value,
          controller: i
        }, i.replyScript, {
          singleRowReturn: !0,
          isAsync: !1
        });
        return p("div", {
          class: n.b("reply")
        }, [p("div", {
          class: n.be("reply", "content"),
          innerHTML: m
        }, null), p(pt("ion-icon"), {
          name: "close-outline",
          onClick: () => i.removeReply()
        }, null)]);
      }
    }, Qe = (m) => {
      if (Pt.value) {
        const {
          container: I
        } = Pt.value.$refs;
        if (I) {
          const x = I.querySelector(".el-image-viewer__wrapper");
          x == null || x[m]("keydown", Lr);
        }
      }
    }, Lr = async (m) => {
      (m.key === "Escape" || m.keyCode === 27) && (m.stopPropagation(), m.preventDefault(), await oe(), Qe("removeEventListener"), ee.value = []);
    }, Tr = async () => {
      await oe(), Qe("addEventListener");
    };
    return {
      ns: n,
      c: i,
      editorId: o,
      vditorRef: l,
      previewRef: Pt,
      loading: d,
      isInit: c,
      readonlyState: u,
      showHoverToolbar: y,
      hoverToolbarStyle: w,
      editorContentRef: a,
      hoverToolbarRef: g,
      handleInlineAiClick: Er,
      handleToolbarClick: rt,
      renderAvatar: Me,
      renderFooterToolbar: xr,
      renderReply: Dr,
      renderPreview: () => p(pt("el-image"), {
        class: n.e("preview"),
        ref: "previewRef",
        "zoom-rate": 1.1,
        src: Ke.value,
        "preview-src-list": ee.value,
        "hide-on-click-modal": !0,
        onShow: Tr,
        fit: "cover"
      }, null)
    };
  },
  render() {
    var r;
    let t = {};
    return this.c.collapsed.value && (t = this.ns.cssVarBlock({
      height: "".concat(this.controller.minHeight - 16, "px")
    })), p("div", {
      class: [this.ns.b(), this.ns.b("container"), this.ns.b("comment"), this.ns.is("disabled", this.readonlyState), this.ns.is("widescreen", !0), this.ns.is("loading", !this.isInit), this.ns.is("collapse", this.c.collapsed.value)],
      style: t
    }, [this.renderAvatar(), p("div", {
      ref: "editorContentRef",
      class: this.ns.be("comment", "content")
    }, [pi(p("div", {
      id: this.editorId,
      ref: "vditorRef",
      class: ["vditor", this.ns.b()]
    }, null), [[gi("loading"), this.loading]]), this.renderReply(), this.renderFooterToolbar(), this.renderPreview()]), this.showHoverToolbar ? p("div", {
      ref: "hoverToolbarRef",
      style: this.hoverToolbarStyle,
      class: this.ns.e("hover-toolbar")
    }, [(r = this.controller) != null && r.chatCompletion ? p("button", {
      class: "vditor-inline-ai",
      title: "AI",
      onClick: this.handleInlineAiClick
    }, [vi]) : null, p("button", {
      class: "vditor-bold",
      title: "加粗",
      onClick: (e) => this.handleToolbarClick(e, "bold")
    }, [Xr]), p("button", {
      class: "vditor-italic",
      title: "斜体",
      onClick: (e) => this.handleToolbarClick(e, "italic")
    }, [Gr]), p("button", {
      class: "vditor-strike",
      title: "删除线",
      onClick: (e) => this.handleToolbarClick(e, "strike")
    }, [Qr]), p("button", {
      class: "vditor-link",
      title: "链接",
      onClick: (e) => this.handleToolbarClick(e, "link")
    }, [Zr])]) : null]);
  }
}), wo = [
  {
    name: "通用",
    type: "group",
    children: [
      {
        name: "表情",
        shortcut: ": / ⌘ E"
      },
      {
        name: "标题",
        shortcut: "Ctrl H / ⌘ H",
        remark: "参见下文"
      },
      {
        name: "粗体",
        shortcut: "Ctrl B / ⌘ B"
      },
      {
        name: "斜体",
        shortcut: "Ctrl I / ⌘ I"
      },
      {
        name: "删除线",
        shortcut: "Ctrl S / ⌘ S"
      },
      {
        name: "链接",
        shortcut: "Ctrl K / ⌘ K",
        remark: "参见下文"
      },
      {
        name: "无序列表",
        shortcut: "Ctrl L / ⌘ L",
        remark: "参见下文"
      },
      {
        name: "有序列表",
        shortcut: "Ctrl O / ⌘ O",
        remark: "参见下文"
      },
      {
        name: "任务列表",
        shortcut: "Ctrl J / ⌘ J",
        remark: "参见下文"
      },
      {
        name: "引用",
        shortcut: "Ctrl ; / ⌘ ;",
        remark: "参见下文"
      },
      {
        name: "分割线",
        shortcut: "Ctrl Shift H / ⌘ ⇧ H"
      },
      {
        name: "代码块",
        shortcut: "Ctrl U / ⌘ U",
        remark: "参见下文"
      },
      {
        name: "代码",
        shortcut: "Ctrl G / ⌘ G"
      },
      {
        name: "元素前插入空块",
        shortcut: "Ctrl Shift B / ⌘ ⇧ B",
        remark: "wysiwyg & ir 模式"
      },
      {
        name: "元素后插入空块",
        shortcut: "Ctrl Shift E / ⌘ ⇧ E",
        remark: "wysiwyg & ir 模式"
      },
      {
        name: "表格",
        shortcut: "Ctrl M / ⌘ M",
        remark: "参见下文"
      },
      {
        name: "撤销",
        shortcut: "Ctrl Z / ⌘ Z"
      },
      {
        name: "重做",
        shortcut: "Ctrl Y / ⌘ Y"
      },
      {
        name: "隐藏编辑器",
        shortcut: "Ctrl P / ⌘ P",
        remark: "SV 模式"
      },
      {
        name: "全屏",
        shortcut: "Ctrl ' / ⌘ '"
      },
      {
        name: "向上移动块元素",
        shortcut: "Ctrl Shift U / ⌘ ⇧ U",
        remark: "wysiwyg & ir 模式"
      },
      {
        name: "向下移动块元素",
        shortcut: "Ctrl Shift D / ⌘ ⇧ D",
        remark: "wysiwyg & ir 模式"
      },
      {
        name: "移除当前元素",
        shortcut: "Ctrl Shift X / ⌘ ⇧ X",
        remark: "wysiwyg 模式"
      },
      {
        name: "At 用户",
        shortcut: "@"
      },
      {
        name: "错误输入",
        shortcut: "Backspace"
      }
    ]
  },
  {
    name: "标题",
    type: "group",
    children: [
      {
        name: "标题变大",
        shortcut: "Ctrl + / ⌘ +"
      },
      {
        name: "标题变小",
        shortcut: "Ctrl - / ⌘ -"
      },
      {
        name: "H1-H6",
        shortcut: "Ctrl Alt [1 ~ 6] / ⌘ ⌥ [1 ~ 6]"
      },
      {
        name: "弹出菜单",
        shortcut: "Ctrl H / ⌘ H"
      }
    ]
  },
  {
    name: "链接",
    type: "group",
    children: [
      {
        name: "输入框和元素之间切换",
        shortcut: "Alt Enter / ⌥ Enter"
      },
      {
        name: "输入框之间切换",
        shortcut: "Tab"
      }
    ]
  },
  {
    name: "列表",
    type: "group",
    children: [
      {
        name: "缩进",
        shortcut: "Tab 或 Ctrl Shift I / ⌘ ⇧ I",
        remark: "Tab: 光标需位于开头"
      },
      {
        name: "反向缩进",
        shortcut: "Shift Tab / ⇧ Tab "
      },
      {
        name: "完成和待办之间切换",
        shortcut: "Ctrl Shift J / ⌘ ⇧ J",
        remark: "任务列表"
      }
    ]
  },
  {
    name: "引用",
    type: "group",
    children: [
      {
        name: "在顶层引用前插入空块",
        shortcut: "Ctrl Alt Enter / ⌘ ⌥ Enter",
        remark: "wysiwyg 模式"
      },
      {
        name: "在顶层引用后插入空块",
        shortcut: "Alt Enter / ⌥ Enter",
        remark: "wysiwyg 模式"
      },
      {
        name: "引用中插入块元素",
        shortcut: "Ctrl Shift : / ⌘ ⇧ : / >",
        remark: "块元素变为引用 >；内联元素中插入引用"
      },
      {
        name: "引用和块元素之间切换",
        shortcut: "Ctrl ; / ⌘ ;"
      }
    ]
  },
  {
    name: "代码块",
    type: "group",
    children: [
      {
        name: "输入框和代码块之间切换",
        shortcut: "Alt Enter / ⌥ Enter"
      },
      {
        name: "隐藏代码块编辑界面",
        shortcut: "Escape"
      },
      {
        name: "选中所有代码",
        shortcut: "Ctrl A / ⌘ A"
      }
    ]
  },
  {
    name: "表格",
    type: "group",
    children: [
      {
        name: "在上方插入一行",
        shortcut: "Ctrl + / ⌘ ⇧ F"
      },
      {
        name: "在下方插入一行",
        shortcut: "Ctrl + / ⌘ +"
      },
      {
        name: "删除行",
        shortcut: "Ctrl - / ⌘ -"
      },
      {
        name: "在左边插入一列",
        shortcut: "Ctrl Shift + / ⌘ ⇧ G"
      },
      {
        name: "在右边插入一列",
        shortcut: "Ctrl Shift + / ⌘ ⇧ +"
      },
      {
        name: "删除列",
        shortcut: "Ctrl Shift - / ⌘ ⇧ -"
      },
      {
        name: "左对齐",
        shortcut: "Ctrl Shift L / ⌘ ⇧ L"
      },
      {
        name: "居中对齐",
        shortcut: "Ctrl Shift C / ⌘ ⇧ C"
      },
      {
        name: "右对齐",
        shortcut: "Ctrl Shift R / ⌘ ⇧ R"
      },
      {
        name: "光标移动到输入框中",
        shortcut: "Alt Enter / ⌥ Enter"
      },
      {
        name: "输入框之间切换",
        shortcut: "Tab"
      },
      {
        name: " 将光标移动到上一个元素",
        shortcut: "Shift Tab / ⇧ Tab "
      },
      {
        name: "表格光标移动到下一个元素",
        shortcut: "Tab"
      }
    ]
  }
], $ = () => /* @__PURE__ */ new Map(), $r = (r) => {
  const t = $();
  return r.forEach((e, s) => {
    t.set(s, e);
  }), t;
}, _t = (r, t, e) => {
  let s = r.get(t);
  return s === void 0 && r.set(t, s = e()), s;
}, bo = (r, t) => {
  const e = [];
  for (const [s, n] of r)
    e.push(t(n, s));
  return e;
}, yo = (r, t) => {
  for (const [e, s] of r)
    if (t(s, e))
      return !0;
  return !1;
}, Kt = () => /* @__PURE__ */ new Set(), Ur = (r) => r[r.length - 1], ko = (r, t) => {
  for (let e = 0; e < t.length; e++)
    r.push(t[e]);
}, Mt = Array.from, Co = Array.isArray;
class Mo {
  constructor() {
    this._observers = $();
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  on(t, e) {
    return _t(
      this._observers,
      /** @type {string} */
      t,
      Kt
    ).add(e), e;
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  once(t, e) {
    const s = (...n) => {
      this.off(
        t,
        /** @type {any} */
        s
      ), e(...n);
    };
    this.on(
      t,
      /** @type {any} */
      s
    );
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  off(t, e) {
    const s = this._observers.get(t);
    s !== void 0 && (s.delete(e), s.size === 0 && this._observers.delete(t));
  }
  /**
   * Emit a named event. All registered event listeners that listen to the
   * specified name will receive the event.
   *
   * @todo This should catch exceptions
   *
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name The event name.
   * @param {Parameters<EVENTS[NAME]>} args The arguments that are applied to the event listener.
   */
  emit(t, e) {
    return Mt((this._observers.get(t) || $()).values()).forEach((s) => s(...e));
  }
  destroy() {
    this._observers = $();
  }
}
let So = class {
  constructor() {
    this._observers = $();
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  on(r, t) {
    _t(this._observers, r, Kt).add(t);
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  once(r, t) {
    const e = (...s) => {
      this.off(r, e), t(...s);
    };
    this.on(r, e);
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  off(r, t) {
    const e = this._observers.get(r);
    e !== void 0 && (e.delete(t), e.size === 0 && this._observers.delete(r));
  }
  /**
   * Emit a named event. All registered event listeners that listen to the
   * specified name will receive the event.
   *
   * @todo This should catch exceptions
   *
   * @param {N} name The event name.
   * @param {Array<any>} args The arguments that are applied to the event listener.
   */
  emit(r, t) {
    return Mt((this._observers.get(r) || $()).values()).forEach((e) => e(...t));
  }
  destroy() {
    this._observers = $();
  }
};
const St = Math.floor, sr = Math.abs, wi = (r, t) => r < t ? r : t, Zt = (r, t) => r > t ? r : t, bi = (r) => r !== 0 ? r < 0 : 1 / r < 0, Us = 1, zs = 2, zr = 4, Hr = 8, Le = 32, Ct = 64, et = 128, br = 31, ts = 63, Jt = 127, _o = 2147483647, yi = Number.MAX_SAFE_INTEGER, Eo = Number.isInteger || ((r) => typeof r == "number" && isFinite(r) && St(r) === r), Io = (r) => r.toLowerCase(), Ao = /^\s*/g, xo = (r) => r.replace(Ao, ""), Do = /([A-Z])/g, Hs = (r, t) => xo(r.replace(Do, (e) => "".concat(t).concat(Io(e)))), Lo = (r) => {
  const t = unescape(encodeURIComponent(r)), e = t.length, s = new Uint8Array(e);
  for (let n = 0; n < e; n++)
    s[n] = /** @type {number} */
    t.codePointAt(n);
  return s;
}, Te = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), To = (r) => Te.encode(r), Oo = Te ? To : Lo;
let Ee = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
Ee && Ee.decode(new Uint8Array()).length === 1 && (Ee = null);
let Be = class {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
};
const Pe = () => new Be(), Ro = (r) => {
  let t = r.cpos;
  for (let e = 0; e < r.bufs.length; e++)
    t += r.bufs[e].length;
  return t;
}, at = (r) => {
  const t = new Uint8Array(Ro(r));
  let e = 0;
  for (let s = 0; s < r.bufs.length; s++) {
    const n = r.bufs[s];
    t.set(n, e), e += n.length;
  }
  return t.set(new Uint8Array(r.cbuf.buffer, 0, r.cpos), e), t;
}, Vo = (r, t) => {
  const e = r.cbuf.length;
  e - r.cpos < t && (r.bufs.push(new Uint8Array(r.cbuf.buffer, 0, r.cpos)), r.cbuf = new Uint8Array(Zt(e, t) * 2), r.cpos = 0);
}, Y = (r, t) => {
  const e = r.cbuf.length;
  r.cpos === e && (r.bufs.push(r.cbuf), r.cbuf = new Uint8Array(e * 2), r.cpos = 0), r.cbuf[r.cpos++] = t;
}, es = Y, A = (r, t) => {
  for (; t > Jt; )
    Y(r, et | Jt & t), t = St(t / 128);
  Y(r, Jt & t);
}, ps = (r, t) => {
  const e = bi(t);
  for (e && (t = -t), Y(r, (t > ts ? et : 0) | (e ? Ct : 0) | ts & t), t = St(t / 64); t > 0; )
    Y(r, (t > Jt ? et : 0) | Jt & t), t = St(t / 128);
}, rs = new Uint8Array(3e4), Uo = rs.length / 3, zo = (r, t) => {
  if (t.length < Uo) {
    const e = Te.encodeInto(t, rs).written || 0;
    A(r, e);
    for (let s = 0; s < e; s++)
      Y(r, rs[s]);
  } else
    Q(r, Oo(t));
}, Ho = (r, t) => {
  const e = unescape(encodeURIComponent(t)), s = e.length;
  A(r, s);
  for (let n = 0; n < s; n++)
    Y(
      r,
      /** @type {number} */
      e.codePointAt(n)
    );
}, Wt = Te && /** @type {any} */
Te.encodeInto ? zo : Ho, yr = (r, t) => {
  const e = r.cbuf.length, s = r.cpos, n = wi(e - s, t.length), i = t.length - n;
  r.cbuf.set(t.subarray(0, n), s), r.cpos += n, i > 0 && (r.bufs.push(r.cbuf), r.cbuf = new Uint8Array(Zt(e * 2, i)), r.cbuf.set(t.subarray(n)), r.cpos = i);
}, Q = (r, t) => {
  A(r, t.byteLength), yr(r, t);
}, gs = (r, t) => {
  Vo(r, t);
  const e = new DataView(r.cbuf.buffer, r.cpos, t);
  return r.cpos += t, e;
}, No = (r, t) => gs(r, 4).setFloat32(0, t, !1), Bo = (r, t) => gs(r, 8).setFloat64(0, t, !1), Po = (r, t) => (
  /** @type {any} */
  gs(r, 8).setBigInt64(0, t, !1)
), Ns = new DataView(new ArrayBuffer(4)), jo = (r) => (Ns.setFloat32(0, r), Ns.getFloat32(0) === r), Oe = (r, t) => {
  switch (typeof t) {
    case "string":
      Y(r, 119), Wt(r, t);
      break;
    case "number":
      Eo(t) && sr(t) <= _o ? (Y(r, 125), ps(r, t)) : jo(t) ? (Y(r, 124), No(r, t)) : (Y(r, 123), Bo(r, t));
      break;
    case "bigint":
      Y(r, 122), Po(r, t);
      break;
    case "object":
      if (t === null)
        Y(r, 126);
      else if (Co(t)) {
        Y(r, 117), A(r, t.length);
        for (let e = 0; e < t.length; e++)
          Oe(r, t[e]);
      } else if (t instanceof Uint8Array)
        Y(r, 116), Q(r, t);
      else {
        Y(r, 118);
        const e = Object.keys(t);
        A(r, e.length);
        for (let s = 0; s < e.length; s++) {
          const n = e[s];
          Wt(r, n), Oe(r, t[n]);
        }
      }
      break;
    case "boolean":
      Y(r, t ? 120 : 121);
      break;
    default:
      Y(r, 127);
  }
};
class Bs extends Be {
  /**
   * @param {function(Encoder, T):void} writer
   */
  constructor(t) {
    super(), this.w = t, this.s = null, this.count = 0;
  }
  /**
   * @param {T} v
   */
  write(t) {
    this.s === t ? this.count++ : (this.count > 0 && A(this, this.count - 1), this.count = 1, this.w(this, t), this.s = t);
  }
}
const Ps = (r) => {
  r.count > 0 && (ps(r.encoder, r.count === 1 ? r.s : -r.s), r.count > 1 && A(r.encoder, r.count - 2));
};
class ir {
  constructor() {
    this.encoder = new Be(), this.s = 0, this.count = 0;
  }
  /**
   * @param {number} v
   */
  write(t) {
    this.s === t ? this.count++ : (Ps(this), this.count = 1, this.s = t);
  }
  /**
   * Flush the encoded state and transform this to a Uint8Array.
   *
   * Note that this should only be called once.
   */
  toUint8Array() {
    return Ps(this), at(this.encoder);
  }
}
const js = (r) => {
  if (r.count > 0) {
    const t = r.diff * 2 + (r.count === 1 ? 0 : 1);
    ps(r.encoder, t), r.count > 1 && A(r.encoder, r.count - 2);
  }
};
class Nr {
  constructor() {
    this.encoder = new Be(), this.s = 0, this.count = 0, this.diff = 0;
  }
  /**
   * @param {number} v
   */
  write(t) {
    this.diff === t - this.s ? (this.s = t, this.count++) : (js(this), this.count = 1, this.diff = t - this.s, this.s = t);
  }
  /**
   * Flush the encoded state and transform this to a Uint8Array.
   *
   * Note that this should only be called once.
   */
  toUint8Array() {
    return js(this), at(this.encoder);
  }
}
class Fo {
  constructor() {
    this.sarr = [], this.s = "", this.lensE = new ir();
  }
  /**
   * @param {string} string
   */
  write(t) {
    this.s += t, this.s.length > 19 && (this.sarr.push(this.s), this.s = ""), this.lensE.write(t.length);
  }
  toUint8Array() {
    const t = new Be();
    return this.sarr.push(this.s), this.s = "", Wt(t, this.sarr.join("")), yr(t, this.lensE.toUint8Array()), at(t);
  }
}
const Nt = (r) => new Error(r), gt = () => {
  throw Nt("Method unimplemented");
}, ft = () => {
  throw Nt("Unexpected case");
}, ki = Nt("Unexpected end of array"), Ci = Nt("Integer out of Range");
let kr = class {
  /**
   * @param {Uint8Array} uint8Array Binary data to decode
   */
  constructor(r) {
    this.arr = r, this.pos = 0;
  }
};
const $t = (r) => new kr(r), qo = (r) => r.pos !== r.arr.length, Yo = (r, t) => {
  const e = new Uint8Array(r.arr.buffer, r.pos + r.arr.byteOffset, t);
  return r.pos += t, e;
}, Z = (r) => Yo(r, _(r)), de = (r) => r.arr[r.pos++], _ = (r) => {
  let t = 0, e = 1;
  const s = r.arr.length;
  for (; r.pos < s; ) {
    const n = r.arr[r.pos++];
    if (t = t + (n & Jt) * e, e *= 128, n < et)
      return t;
    if (t > yi)
      throw Ci;
  }
  throw ki;
}, fs = (r) => {
  let t = r.arr[r.pos++], e = t & ts, s = 64;
  const n = (t & Ct) > 0 ? -1 : 1;
  if (!(t & et))
    return n * e;
  const i = r.arr.length;
  for (; r.pos < i; ) {
    if (t = r.arr[r.pos++], e = e + (t & Jt) * s, s *= 128, t < et)
      return n * e;
    if (e > yi)
      throw Ci;
  }
  throw ki;
}, Jo = (r) => {
  let t = _(r);
  if (t === 0)
    return "";
  {
    let e = String.fromCodePoint(de(r));
    if (--t < 100)
      for (; t--; )
        e += String.fromCodePoint(de(r));
    else
      for (; t > 0; ) {
        const s = t < 1e4 ? t : 1e4, n = r.arr.subarray(r.pos, r.pos + s);
        r.pos += s, e += String.fromCodePoint.apply(
          null,
          /** @type {any} */
          n
        ), t -= s;
      }
    return decodeURIComponent(escape(e));
  }
}, Wo = (r) => (
  /** @type any */
  Ee.decode(Z(r))
), zt = Ee ? Wo : Jo, ms = (r, t) => {
  const e = new DataView(r.arr.buffer, r.arr.byteOffset + r.pos, t);
  return r.pos += t, e;
}, Ko = (r) => ms(r, 4).getFloat32(0, !1), Xo = (r) => ms(r, 8).getFloat64(0, !1), Go = (r) => (
  /** @type {any} */
  ms(r, 8).getBigInt64(0, !1)
), Qo = [
  (r) => {
  },
  // CASE 127: undefined
  (r) => null,
  // CASE 126: null
  fs,
  // CASE 125: integer
  Ko,
  // CASE 124: float32
  Xo,
  // CASE 123: float64
  Go,
  // CASE 122: bigint
  (r) => !1,
  // CASE 121: boolean (false)
  (r) => !0,
  // CASE 120: boolean (true)
  zt,
  // CASE 119: string
  (r) => {
    const t = _(r), e = {};
    for (let s = 0; s < t; s++) {
      const n = zt(r);
      e[n] = Re(r);
    }
    return e;
  },
  (r) => {
    const t = _(r), e = [];
    for (let s = 0; s < t; s++)
      e.push(Re(r));
    return e;
  },
  Z
  // CASE 116: Uint8Array
], Re = (r) => Qo[127 - de(r)](r);
class Fs extends kr {
  /**
   * @param {Uint8Array} uint8Array
   * @param {function(Decoder):T} reader
   */
  constructor(t, e) {
    super(t), this.reader = e, this.s = null, this.count = 0;
  }
  read() {
    return this.count === 0 && (this.s = this.reader(this), qo(this) ? this.count = _(this) + 1 : this.count = -1), this.count--, /** @type {T} */
    this.s;
  }
}
class nr extends kr {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(t) {
    super(t), this.s = 0, this.count = 0;
  }
  read() {
    if (this.count === 0) {
      this.s = fs(this);
      const t = bi(this.s);
      this.count = 1, t && (this.s = -this.s, this.count = _(this) + 2);
    }
    return this.count--, /** @type {number} */
    this.s;
  }
}
class Br extends kr {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(t) {
    super(t), this.s = 0, this.count = 0, this.diff = 0;
  }
  /**
   * @return {number}
   */
  read() {
    if (this.count === 0) {
      const t = fs(this), e = t & 1;
      this.diff = St(t / 2), this.count = 1, e && (this.count = _(this) + 2);
    }
    return this.s += this.diff, this.count--, this.s;
  }
}
class Zo {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(t) {
    this.decoder = new nr(t), this.str = zt(this.decoder), this.spos = 0;
  }
  /**
   * @return {string}
   */
  read() {
    const t = this.spos + this.decoder.read(), e = this.str.slice(this.spos, t);
    return this.spos = t, e;
  }
}
const $o = crypto.getRandomValues.bind(crypto), Mi = () => $o(new Uint32Array(1))[0], tl = [1e7] + -1e3 + -4e3 + -8e3 + -1e11, el = () => tl.replace(
  /[018]/g,
  /** @param {number} c */
  (r) => (r ^ Mi() & 15 >> r / 4).toString(16)
), hr = Date.now, qs = (r) => (
  /** @type {Promise<T>} */
  new Promise(r)
);
Promise.all.bind(Promise);
const rl = (r) => r === void 0 ? null : r;
let sl = class {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  /**
   * @param {string} key
   * @param {any} newValue
   */
  setItem(r, t) {
    this.map.set(r, t);
  }
  /**
   * @param {string} key
   */
  getItem(r) {
    return this.map.get(r);
  }
}, Si = new sl(), il = !0;
try {
  typeof localStorage < "u" && localStorage && (Si = localStorage, il = !1);
} catch (r) {
}
const nl = Si, ol = Object.assign, _i = Object.keys, ll = (r, t) => {
  for (const e in r)
    t(r[e], e);
}, Ys = (r) => _i(r).length, Js = (r) => _i(r).length, al = (r) => {
  for (const t in r)
    return !1;
  return !0;
}, cl = (r, t) => {
  for (const e in r)
    if (!t(r[e], e))
      return !1;
  return !0;
}, Ei = (r, t) => Object.prototype.hasOwnProperty.call(r, t), hl = (r, t) => r === t || Js(r) === Js(t) && cl(r, (e, s) => (e !== void 0 || Ei(t, s)) && t[s] === e), vs = (r, t, e = 0) => {
  try {
    for (; e < r.length; e++)
      r[e](...t);
  } finally {
    e < r.length && vs(r, t, e + 1);
  }
}, dl = (r) => r, ul = (r, t) => r === t, Ie = (r, t) => {
  if (r == null || t == null)
    return ul(r, t);
  if (r.constructor !== t.constructor)
    return !1;
  if (r === t)
    return !0;
  switch (r.constructor) {
    case ArrayBuffer:
      r = new Uint8Array(r), t = new Uint8Array(t);
    case Uint8Array: {
      if (r.byteLength !== t.byteLength)
        return !1;
      for (let e = 0; e < r.length; e++)
        if (r[e] !== t[e])
          return !1;
      break;
    }
    case Set: {
      if (r.size !== t.size)
        return !1;
      for (const e of r)
        if (!t.has(e))
          return !1;
      break;
    }
    case Map: {
      if (r.size !== t.size)
        return !1;
      for (const e of r.keys())
        if (!t.has(e) || !Ie(r.get(e), t.get(e)))
          return !1;
      break;
    }
    case Object:
      if (Ys(r) !== Ys(t))
        return !1;
      for (const e in r)
        if (!Ei(r, e) || !Ie(r[e], t[e]))
          return !1;
      break;
    case Array:
      if (r.length !== t.length)
        return !1;
      for (let e = 0; e < r.length; e++)
        if (!Ie(r[e], t[e]))
          return !1;
      break;
    default:
      return !1;
  }
  return !0;
}, pl = (r, t) => t.includes(r), Ve = typeof process < "u" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]";
let dt;
const gl = () => {
  if (dt === void 0)
    if (Ve) {
      dt = $();
      const r = process.argv;
      let t = null;
      for (let e = 0; e < r.length; e++) {
        const s = r[e];
        s[0] === "-" ? (t !== null && dt.set(t, ""), t = s) : t !== null && (dt.set(t, s), t = null);
      }
      t !== null && dt.set(t, "");
    } else
      typeof location == "object" ? (dt = $(), (location.search || "?").slice(1).split("&").forEach((r) => {
        if (r.length !== 0) {
          const [t, e] = r.split("=");
          dt.set("--".concat(Hs(t, "-")), e), dt.set("-".concat(Hs(t, "-")), e);
        }
      })) : dt = $();
  return dt;
}, ss = (r) => gl().has(r), is = (r) => rl(Ve ? process.env[r.toUpperCase().replaceAll("-", "_")] : nl.getItem(r)), Ii = (r) => ss("--" + r) || is(r) !== null;
Ii("production");
const fl = Ve && pl(process.env.FORCE_COLOR, ["true", "1", "2"]), ml = fl || !ss("--no-colors") && // @todo deprecate --no-colors
!Ii("no-color") && (!Ve || process.stdout.isTTY) && (!Ve || ss("--color") || is("COLORTERM") !== null || (is("TERM") || "").includes("color")), vl = (r) => new Uint8Array(r), wl = (r) => {
  const t = vl(r.byteLength);
  return t.set(r), t;
};
class bl {
  /**
   * @param {L} left
   * @param {R} right
   */
  constructor(t, e) {
    this.left = t, this.right = e;
  }
}
const kt = (r, t) => new bl(r, t);
typeof DOMParser < "u" && new DOMParser();
const yl = (r) => bo(r, (t, e) => "".concat(e, ":").concat(t, ";")).join(""), Et = Symbol, Ai = Et(), xi = Et(), kl = Et(), Cl = Et(), Ml = Et(), Di = Et(), Sl = Et(), Li = Et(), _l = Et(), El = (r) => {
  var t;
  r.length === 1 && ((t = r[0]) == null ? void 0 : t.constructor) === Function && (r = /** @type {Array<string|Symbol|Object|number>} */
  /** @type {[function]} */
  r[0]());
  const e = [], s = [];
  let n = 0;
  for (; n < r.length; n++) {
    const i = r[n];
    if (i === void 0)
      break;
    if (i.constructor === String || i.constructor === Number)
      e.push(i);
    else if (i.constructor === Object)
      break;
  }
  for (n > 0 && s.push(e.join("")); n < r.length; n++) {
    const i = r[n];
    i instanceof Symbol || s.push(i);
  }
  return s;
}, Il = {
  [Ai]: kt("font-weight", "bold"),
  [xi]: kt("font-weight", "normal"),
  [kl]: kt("color", "blue"),
  [Ml]: kt("color", "green"),
  [Cl]: kt("color", "grey"),
  [Di]: kt("color", "red"),
  [Sl]: kt("color", "purple"),
  [Li]: kt("color", "orange"),
  // not well supported in chrome when debugging node with inspector - TODO: deprecate
  [_l]: kt("color", "black")
}, Al = (r) => {
  var t;
  r.length === 1 && ((t = r[0]) == null ? void 0 : t.constructor) === Function && (r = /** @type {Array<string|Symbol|Object|number>} */
  /** @type {[function]} */
  r[0]());
  const e = [], s = [], n = $();
  let i = [], o = 0;
  for (; o < r.length; o++) {
    const l = r[o], a = Il[l];
    if (a !== void 0)
      n.set(a.left, a.right);
    else {
      if (l === void 0)
        break;
      if (l.constructor === String || l.constructor === Number) {
        const d = yl(n);
        o > 0 || d.length > 0 ? (e.push("%c" + l), s.push(d)) : e.push(l);
      } else
        break;
    }
  }
  for (o > 0 && (i = s, i.unshift(e.join(""))); o < r.length; o++) {
    const l = r[o];
    l instanceof Symbol || i.push(l);
  }
  return i;
}, xl = ml ? Al : El, Dl = (...r) => {
  console.log(...xl(r)), Ll.forEach((t) => t.print(r));
}, Ll = Kt(), Ti = (r) => ({
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator]() {
    return this;
  },
  // @ts-ignore
  next: r
}), Tl = (r, t) => Ti(() => {
  let e;
  do
    e = r.next();
  while (!e.done && !t(e.value));
  return e;
}), Pr = (r, t) => Ti(() => {
  const { done: e, value: s } = r.next();
  return { done: e, value: e ? void 0 : t(s) };
});
class ws {
  /**
   * @param {number} clock
   * @param {number} len
   */
  constructor(t, e) {
    this.clock = t, this.len = e;
  }
}
class je {
  constructor() {
    this.clients = /* @__PURE__ */ new Map();
  }
}
const Oi = (r, t, e) => t.clients.forEach((s, n) => {
  const i = (
    /** @type {Array<GC|Item>} */
    r.doc.store.clients.get(n)
  );
  for (let o = 0; o < s.length; o++) {
    const l = s[o];
    Ji(r, i, l.clock, l.len, e);
  }
}), Ol = (r, t) => {
  let e = 0, s = r.length - 1;
  for (; e <= s; ) {
    const n = St((e + s) / 2), i = r[n], o = i.clock;
    if (o <= t) {
      if (t < o + i.len)
        return n;
      e = n + 1;
    } else
      s = n - 1;
  }
  return null;
}, Ri = (r, t) => {
  const e = r.clients.get(t.client);
  return e !== void 0 && Ol(e, t.clock) !== null;
}, bs = (r) => {
  r.clients.forEach((t) => {
    t.sort((n, i) => n.clock - i.clock);
    let e, s;
    for (e = 1, s = 1; e < t.length; e++) {
      const n = t[s - 1], i = t[e];
      n.clock + n.len >= i.clock ? n.len = Zt(n.len, i.clock + i.len - n.clock) : (s < e && (t[s] = i), s++);
    }
    t.length = s;
  });
}, Rl = (r) => {
  const t = new je();
  for (let e = 0; e < r.length; e++)
    r[e].clients.forEach((s, n) => {
      if (!t.clients.has(n)) {
        const i = s.slice();
        for (let o = e + 1; o < r.length; o++)
          ko(i, r[o].clients.get(n) || []);
        t.clients.set(n, i);
      }
    });
  return bs(t), t;
}, dr = (r, t, e, s) => {
  _t(r.clients, t, () => (
    /** @type {Array<DeleteItem>} */
    []
  )).push(new ws(e, s));
}, Vl = () => new je(), Ul = (r) => {
  const t = Vl();
  return r.clients.forEach((e, s) => {
    const n = [];
    for (let i = 0; i < e.length; i++) {
      const o = e[i];
      if (o.deleted) {
        const l = o.id.clock;
        let a = o.length;
        if (i + 1 < e.length)
          for (let d = e[i + 1]; i + 1 < e.length && d.deleted; d = e[++i + 1])
            a += d.length;
        n.push(new ws(l, a));
      }
    }
    n.length > 0 && t.clients.set(s, n);
  }), t;
}, me = (r, t) => {
  A(r.restEncoder, t.clients.size), Mt(t.clients.entries()).sort((e, s) => s[0] - e[0]).forEach(([e, s]) => {
    r.resetDsCurVal(), A(r.restEncoder, e);
    const n = s.length;
    A(r.restEncoder, n);
    for (let i = 0; i < n; i++) {
      const o = s[i];
      r.writeDsClock(o.clock), r.writeDsLen(o.len);
    }
  });
}, ys = (r) => {
  const t = new je(), e = _(r.restDecoder);
  for (let s = 0; s < e; s++) {
    r.resetDsCurVal();
    const n = _(r.restDecoder), i = _(r.restDecoder);
    if (i > 0) {
      const o = _t(t.clients, n, () => (
        /** @type {Array<DeleteItem>} */
        []
      ));
      for (let l = 0; l < i; l++)
        o.push(new ws(r.readDsClock(), r.readDsLen()));
    }
  }
  return t;
}, Ws = (r, t, e) => {
  const s = new je(), n = _(r.restDecoder);
  for (let i = 0; i < n; i++) {
    r.resetDsCurVal();
    const o = _(r.restDecoder), l = _(r.restDecoder), a = e.clients.get(o) || [], d = J(e, o);
    for (let c = 0; c < l; c++) {
      const h = r.readDsClock(), u = h + r.readDsLen();
      if (h < d) {
        d < u && dr(s, o, d, u - d);
        let g = mt(a, h), f = a[g];
        for (!f.deleted && f.id.clock < h && (a.splice(g + 1, 0, wr(t, f, h - f.id.clock)), g++); g < a.length && (f = a[g++], f.id.clock < u); )
          f.deleted || (u < f.id.clock + f.length && a.splice(g, 0, wr(t, f, u - f.id.clock)), f.delete(t));
      } else
        dr(s, o, h, u - h);
    }
  }
  if (s.clients.size > 0) {
    const i = new Xt();
    return A(i.restEncoder, 0), me(i, s), i.toUint8Array();
  }
  return null;
}, Vi = Mi;
class ve extends Mo {
  /**
   * @param {DocOpts} opts configuration
   */
  constructor({ guid: t = el(), collectionid: e = null, gc: s = !0, gcFilter: n = () => !0, meta: i = null, autoLoad: o = !1, shouldLoad: l = !0 } = {}) {
    super(), this.gc = s, this.gcFilter = n, this.clientID = Vi(), this.guid = t, this.collectionid = e, this.share = /* @__PURE__ */ new Map(), this.store = new qi(), this._transaction = null, this._transactionCleanups = [], this.subdocs = /* @__PURE__ */ new Set(), this._item = null, this.shouldLoad = l, this.autoLoad = o, this.meta = i, this.isLoaded = !1, this.isSynced = !1, this.whenLoaded = qs((d) => {
      this.on("load", () => {
        this.isLoaded = !0, d(this);
      });
    });
    const a = () => qs((d) => {
      const c = (h) => {
        (h === void 0 || h === !0) && (this.off("sync", c), d());
      };
      this.on("sync", c);
    });
    this.on("sync", (d) => {
      d === !1 && this.isSynced && (this.whenSynced = a()), this.isSynced = d === void 0 || d === !0, this.isSynced && !this.isLoaded && this.emit("load", [this]);
    }), this.whenSynced = a();
  }
  /**
   * Notify the parent document that you request to load data into this subdocument (if it is a subdocument).
   *
   * `load()` might be used in the future to request any provider to load the most current data.
   *
   * It is safe to call `load()` multiple times.
   */
  load() {
    const t = this._item;
    t !== null && !this.shouldLoad && V(
      /** @type {any} */
      t.parent.doc,
      (e) => {
        e.subdocsLoaded.add(this);
      },
      null,
      !0
    ), this.shouldLoad = !0;
  }
  getSubdocs() {
    return this.subdocs;
  }
  getSubdocGuids() {
    return new Set(Mt(this.subdocs).map((t) => t.guid));
  }
  /**
   * Changes that happen inside of a transaction are bundled. This means that
   * the observer fires _after_ the transaction is finished and that all changes
   * that happened inside of the transaction are sent as one message to the
   * other peers.
   *
   * @template T
   * @param {function(Transaction):T} f The function that should be executed as a transaction
   * @param {any} [origin] Origin of who started the transaction. Will be stored on transaction.origin
   * @return T
   *
   * @public
   */
  transact(t, e = null) {
    return V(this, t, e);
  }
  /**
   * Define a shared data type.
   *
   * Multiple calls of `ydoc.get(name, TypeConstructor)` yield the same result
   * and do not overwrite each other. I.e.
   * `ydoc.get(name, Y.Array) === ydoc.get(name, Y.Array)`
   *
   * After this method is called, the type is also available on `ydoc.share.get(name)`.
   *
   * *Best Practices:*
   * Define all types right after the Y.Doc instance is created and store them in a separate object.
   * Also use the typed methods `getText(name)`, `getArray(name)`, ..
   *
   * @template {typeof AbstractType<any>} Type
   * @example
   *   const ydoc = new Y.Doc(..)
   *   const appState = {
   *     document: ydoc.getText('document')
   *     comments: ydoc.getArray('comments')
   *   }
   *
   * @param {string} name
   * @param {Type} TypeConstructor The constructor of the type definition. E.g. Y.Text, Y.Array, Y.Map, ...
   * @return {InstanceType<Type>} The created type. Constructed with TypeConstructor
   *
   * @public
   */
  get(t, e = (
    /** @type {any} */
    W
  )) {
    const s = _t(this.share, t, () => {
      const i = new e();
      return i._integrate(this, null), i;
    }), n = s.constructor;
    if (e !== W && n !== e)
      if (n === W) {
        const i = new e();
        i._map = s._map, s._map.forEach(
          /** @param {Item?} n */
          (o) => {
            for (; o !== null; o = o.left)
              o.parent = i;
          }
        ), i._start = s._start;
        for (let o = i._start; o !== null; o = o.right)
          o.parent = i;
        return i._length = s._length, this.share.set(t, i), i._integrate(this, null), /** @type {InstanceType<Type>} */
        i;
      } else
        throw new Error("Type with the name ".concat(t, " has already been defined with a different constructor"));
    return (
      /** @type {InstanceType<Type>} */
      s
    );
  }
  /**
   * @template T
   * @param {string} [name]
   * @return {YArray<T>}
   *
   * @public
   */
  getArray(t = "") {
    return (
      /** @type {YArray<T>} */
      this.get(t, ae)
    );
  }
  /**
   * @param {string} [name]
   * @return {YText}
   *
   * @public
   */
  getText(t = "") {
    return this.get(t, ge);
  }
  /**
   * @template T
   * @param {string} [name]
   * @return {YMap<T>}
   *
   * @public
   */
  getMap(t = "") {
    return (
      /** @type {YMap<T>} */
      this.get(t, pe)
    );
  }
  /**
   * @param {string} [name]
   * @return {YXmlElement}
   *
   * @public
   */
  getXmlElement(t = "") {
    return (
      /** @type {YXmlElement<{[key:string]:string}>} */
      this.get(t, fe)
    );
  }
  /**
   * @param {string} [name]
   * @return {YXmlFragment}
   *
   * @public
   */
  getXmlFragment(t = "") {
    return this.get(t, Gt);
  }
  /**
   * Converts the entire document into a js object, recursively traversing each yjs type
   * Doesn't log types that have not been defined (using ydoc.getType(..)).
   *
   * @deprecated Do not use this method and rather call toJSON directly on the shared types.
   *
   * @return {Object<string, any>}
   */
  toJSON() {
    const t = {};
    return this.share.forEach((e, s) => {
      t[s] = e.toJSON();
    }), t;
  }
  /**
   * Emit `destroy` event and unregister all event handlers.
   */
  destroy() {
    Mt(this.subdocs).forEach((e) => e.destroy());
    const t = this._item;
    if (t !== null) {
      this._item = null;
      const e = (
        /** @type {ContentDoc} */
        t.content
      );
      e.doc = new ve({ guid: this.guid, ...e.opts, shouldLoad: !1 }), e.doc._item = t, V(
        /** @type {any} */
        t.parent.doc,
        (s) => {
          const n = e.doc;
          t.deleted || s.subdocsAdded.add(n), s.subdocsRemoved.add(this);
        },
        null,
        !0
      );
    }
    this.emit("destroyed", [!0]), this.emit("destroy", [this]), super.destroy();
  }
}
class Ui {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(t) {
    this.restDecoder = t;
  }
  resetDsCurVal() {
  }
  /**
   * @return {number}
   */
  readDsClock() {
    return _(this.restDecoder);
  }
  /**
   * @return {number}
   */
  readDsLen() {
    return _(this.restDecoder);
  }
}
class zi extends Ui {
  /**
   * @return {ID}
   */
  readLeftID() {
    return D(_(this.restDecoder), _(this.restDecoder));
  }
  /**
   * @return {ID}
   */
  readRightID() {
    return D(_(this.restDecoder), _(this.restDecoder));
  }
  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient() {
    return _(this.restDecoder);
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo() {
    return de(this.restDecoder);
  }
  /**
   * @return {string}
   */
  readString() {
    return zt(this.restDecoder);
  }
  /**
   * @return {boolean} isKey
   */
  readParentInfo() {
    return _(this.restDecoder) === 1;
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readTypeRef() {
    return _(this.restDecoder);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number} len
   */
  readLen() {
    return _(this.restDecoder);
  }
  /**
   * @return {any}
   */
  readAny() {
    return Re(this.restDecoder);
  }
  /**
   * @return {Uint8Array}
   */
  readBuf() {
    return wl(Z(this.restDecoder));
  }
  /**
   * Legacy implementation uses JSON parse. We use any-decoding in v2.
   *
   * @return {any}
   */
  readJSON() {
    return JSON.parse(zt(this.restDecoder));
  }
  /**
   * @return {string}
   */
  readKey() {
    return zt(this.restDecoder);
  }
}
class zl {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(t) {
    this.dsCurrVal = 0, this.restDecoder = t;
  }
  resetDsCurVal() {
    this.dsCurrVal = 0;
  }
  /**
   * @return {number}
   */
  readDsClock() {
    return this.dsCurrVal += _(this.restDecoder), this.dsCurrVal;
  }
  /**
   * @return {number}
   */
  readDsLen() {
    const t = _(this.restDecoder) + 1;
    return this.dsCurrVal += t, t;
  }
}
class ue extends zl {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(t) {
    super(t), this.keys = [], _(t), this.keyClockDecoder = new Br(Z(t)), this.clientDecoder = new nr(Z(t)), this.leftClockDecoder = new Br(Z(t)), this.rightClockDecoder = new Br(Z(t)), this.infoDecoder = new Fs(Z(t), de), this.stringDecoder = new Zo(Z(t)), this.parentInfoDecoder = new Fs(Z(t), de), this.typeRefDecoder = new nr(Z(t)), this.lenDecoder = new nr(Z(t));
  }
  /**
   * @return {ID}
   */
  readLeftID() {
    return new le(this.clientDecoder.read(), this.leftClockDecoder.read());
  }
  /**
   * @return {ID}
   */
  readRightID() {
    return new le(this.clientDecoder.read(), this.rightClockDecoder.read());
  }
  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient() {
    return this.clientDecoder.read();
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo() {
    return (
      /** @type {number} */
      this.infoDecoder.read()
    );
  }
  /**
   * @return {string}
   */
  readString() {
    return this.stringDecoder.read();
  }
  /**
   * @return {boolean}
   */
  readParentInfo() {
    return this.parentInfoDecoder.read() === 1;
  }
  /**
   * @return {number} An unsigned 8-bit integer
   */
  readTypeRef() {
    return this.typeRefDecoder.read();
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number}
   */
  readLen() {
    return this.lenDecoder.read();
  }
  /**
   * @return {any}
   */
  readAny() {
    return Re(this.restDecoder);
  }
  /**
   * @return {Uint8Array}
   */
  readBuf() {
    return Z(this.restDecoder);
  }
  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @return {any}
   */
  readJSON() {
    return Re(this.restDecoder);
  }
  /**
   * @return {string}
   */
  readKey() {
    const t = this.keyClockDecoder.read();
    if (t < this.keys.length)
      return this.keys[t];
    {
      const e = this.stringDecoder.read();
      return this.keys.push(e), e;
    }
  }
}
class Hi {
  constructor() {
    this.restEncoder = Pe();
  }
  toUint8Array() {
    return at(this.restEncoder);
  }
  resetDsCurVal() {
  }
  /**
   * @param {number} clock
   */
  writeDsClock(t) {
    A(this.restEncoder, t);
  }
  /**
   * @param {number} len
   */
  writeDsLen(t) {
    A(this.restEncoder, t);
  }
}
class Fe extends Hi {
  /**
   * @param {ID} id
   */
  writeLeftID(t) {
    A(this.restEncoder, t.client), A(this.restEncoder, t.clock);
  }
  /**
   * @param {ID} id
   */
  writeRightID(t) {
    A(this.restEncoder, t.client), A(this.restEncoder, t.clock);
  }
  /**
   * Use writeClient and writeClock instead of writeID if possible.
   * @param {number} client
   */
  writeClient(t) {
    A(this.restEncoder, t);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo(t) {
    es(this.restEncoder, t);
  }
  /**
   * @param {string} s
   */
  writeString(t) {
    Wt(this.restEncoder, t);
  }
  /**
   * @param {boolean} isYKey
   */
  writeParentInfo(t) {
    A(this.restEncoder, t ? 1 : 0);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef(t) {
    A(this.restEncoder, t);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen(t) {
    A(this.restEncoder, t);
  }
  /**
   * @param {any} any
   */
  writeAny(t) {
    Oe(this.restEncoder, t);
  }
  /**
   * @param {Uint8Array} buf
   */
  writeBuf(t) {
    Q(this.restEncoder, t);
  }
  /**
   * @param {any} embed
   */
  writeJSON(t) {
    Wt(this.restEncoder, JSON.stringify(t));
  }
  /**
   * @param {string} key
   */
  writeKey(t) {
    Wt(this.restEncoder, t);
  }
}
class Ni {
  constructor() {
    this.restEncoder = Pe(), this.dsCurrVal = 0;
  }
  toUint8Array() {
    return at(this.restEncoder);
  }
  resetDsCurVal() {
    this.dsCurrVal = 0;
  }
  /**
   * @param {number} clock
   */
  writeDsClock(t) {
    const e = t - this.dsCurrVal;
    this.dsCurrVal = t, A(this.restEncoder, e);
  }
  /**
   * @param {number} len
   */
  writeDsLen(t) {
    t === 0 && ft(), A(this.restEncoder, t - 1), this.dsCurrVal += t;
  }
}
class Xt extends Ni {
  constructor() {
    super(), this.keyMap = /* @__PURE__ */ new Map(), this.keyClock = 0, this.keyClockEncoder = new Nr(), this.clientEncoder = new ir(), this.leftClockEncoder = new Nr(), this.rightClockEncoder = new Nr(), this.infoEncoder = new Bs(es), this.stringEncoder = new Fo(), this.parentInfoEncoder = new Bs(es), this.typeRefEncoder = new ir(), this.lenEncoder = new ir();
  }
  toUint8Array() {
    const t = Pe();
    return A(t, 0), Q(t, this.keyClockEncoder.toUint8Array()), Q(t, this.clientEncoder.toUint8Array()), Q(t, this.leftClockEncoder.toUint8Array()), Q(t, this.rightClockEncoder.toUint8Array()), Q(t, at(this.infoEncoder)), Q(t, this.stringEncoder.toUint8Array()), Q(t, at(this.parentInfoEncoder)), Q(t, this.typeRefEncoder.toUint8Array()), Q(t, this.lenEncoder.toUint8Array()), yr(t, at(this.restEncoder)), at(t);
  }
  /**
   * @param {ID} id
   */
  writeLeftID(t) {
    this.clientEncoder.write(t.client), this.leftClockEncoder.write(t.clock);
  }
  /**
   * @param {ID} id
   */
  writeRightID(t) {
    this.clientEncoder.write(t.client), this.rightClockEncoder.write(t.clock);
  }
  /**
   * @param {number} client
   */
  writeClient(t) {
    this.clientEncoder.write(t);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo(t) {
    this.infoEncoder.write(t);
  }
  /**
   * @param {string} s
   */
  writeString(t) {
    this.stringEncoder.write(t);
  }
  /**
   * @param {boolean} isYKey
   */
  writeParentInfo(t) {
    this.parentInfoEncoder.write(t ? 1 : 0);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef(t) {
    this.typeRefEncoder.write(t);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen(t) {
    this.lenEncoder.write(t);
  }
  /**
   * @param {any} any
   */
  writeAny(t) {
    Oe(this.restEncoder, t);
  }
  /**
   * @param {Uint8Array} buf
   */
  writeBuf(t) {
    Q(this.restEncoder, t);
  }
  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @param {any} embed
   */
  writeJSON(t) {
    Oe(this.restEncoder, t);
  }
  /**
   * Property keys are often reused. For example, in y-prosemirror the key `bold` might
   * occur very often. For a 3d application, the key `position` might occur very often.
   *
   * We cache these keys in a Map and refer to them via a unique number.
   *
   * @param {string} key
   */
  writeKey(t) {
    const e = this.keyMap.get(t);
    e === void 0 ? (this.keyClockEncoder.write(this.keyClock++), this.stringEncoder.write(t)) : this.keyClockEncoder.write(e);
  }
}
const Hl = (r, t, e, s) => {
  s = Zt(s, t[0].id.clock);
  const n = mt(t, s);
  A(r.restEncoder, t.length - n), r.writeClient(e), A(r.restEncoder, s);
  const i = t[n];
  i.write(r, s - i.id.clock);
  for (let o = n + 1; o < t.length; o++)
    t[o].write(r, 0);
}, ks = (r, t, e) => {
  const s = /* @__PURE__ */ new Map();
  e.forEach((n, i) => {
    J(t, i) > n && s.set(i, n);
  }), Cr(t).forEach((n, i) => {
    e.has(i) || s.set(i, 0);
  }), A(r.restEncoder, s.size), Mt(s.entries()).sort((n, i) => i[0] - n[0]).forEach(([n, i]) => {
    Hl(
      r,
      /** @type {Array<GC|Item>} */
      t.clients.get(n),
      n,
      i
    );
  });
}, Nl = (r, t) => {
  const e = $(), s = _(r.restDecoder);
  for (let n = 0; n < s; n++) {
    const i = _(r.restDecoder), o = new Array(i), l = r.readClient();
    let a = _(r.restDecoder);
    e.set(l, { i: 0, refs: o });
    for (let d = 0; d < i; d++) {
      const c = r.readInfo();
      switch (br & c) {
        case 0: {
          const h = r.readLen();
          o[d] = new nt(D(l, a), h), a += h;
          break;
        }
        case 10: {
          const h = _(r.restDecoder);
          o[d] = new ot(D(l, a), h), a += h;
          break;
        }
        default: {
          const h = (c & (Ct | et)) === 0, u = new P(
            D(l, a),
            null,
            // left
            (c & et) === et ? r.readLeftID() : null,
            // origin
            null,
            // right
            (c & Ct) === Ct ? r.readRightID() : null,
            // right origin
            h ? r.readParentInfo() ? t.get(r.readString()) : r.readLeftID() : null,
            // parent
            h && (c & Le) === Le ? r.readString() : null,
            // parentSub
            un(r, c)
            // item content
          );
          o[d] = u, a += u.length;
        }
      }
    }
  }
  return e;
}, Bl = (r, t, e) => {
  const s = [];
  let n = Mt(e.keys()).sort((g, f) => g - f);
  if (n.length === 0)
    return null;
  const i = () => {
    if (n.length === 0)
      return null;
    let g = (
      /** @type {{i:number,refs:Array<GC|Item>}} */
      e.get(n[n.length - 1])
    );
    for (; g.refs.length === g.i; )
      if (n.pop(), n.length > 0)
        g = /** @type {{i:number,refs:Array<GC|Item>}} */
        e.get(n[n.length - 1]);
      else
        return null;
    return g;
  };
  let o = i();
  if (o === null)
    return null;
  const l = new qi(), a = /* @__PURE__ */ new Map(), d = (g, f) => {
    const y = a.get(g);
    (y == null || y > f) && a.set(g, f);
  };
  let c = (
    /** @type {any} */
    o.refs[
      /** @type {any} */
      o.i++
    ]
  );
  const h = /* @__PURE__ */ new Map(), u = () => {
    for (const g of s) {
      const f = g.id.client, y = e.get(f);
      y ? (y.i--, l.clients.set(f, y.refs.slice(y.i)), e.delete(f), y.i = 0, y.refs = []) : l.clients.set(f, [g]), n = n.filter((w) => w !== f);
    }
    s.length = 0;
  };
  for (; ; ) {
    if (c.constructor !== ot) {
      const g = _t(h, c.id.client, () => J(t, c.id.client)) - c.id.clock;
      if (g < 0)
        s.push(c), d(c.id.client, c.id.clock - 1), u();
      else {
        const f = c.getMissing(r, t);
        if (f !== null) {
          s.push(c);
          const y = e.get(
            /** @type {number} */
            f
          ) || { refs: [], i: 0 };
          if (y.refs.length === y.i)
            d(
              /** @type {number} */
              f,
              J(t, f)
            ), u();
          else {
            c = y.refs[y.i++];
            continue;
          }
        } else
          (g === 0 || g < c.length) && (c.integrate(r, g), h.set(c.id.client, c.id.clock + c.length));
      }
    }
    if (s.length > 0)
      c = /** @type {GC|Item} */
      s.pop();
    else if (o !== null && o.i < o.refs.length)
      c = /** @type {GC|Item} */
      o.refs[o.i++];
    else {
      if (o = i(), o === null)
        break;
      c = /** @type {GC|Item} */
      o.refs[o.i++];
    }
  }
  if (l.clients.size > 0) {
    const g = new Xt();
    return ks(g, l, /* @__PURE__ */ new Map()), A(g.restEncoder, 0), { missing: a, update: g.toUint8Array() };
  }
  return null;
}, Pl = (r, t) => ks(r, t.doc.store, t.beforeState), jl = (r, t, e, s = new ue(r)) => V(t, (n) => {
  n.local = !1;
  let i = !1;
  const o = n.doc, l = o.store, a = Nl(s, o), d = Bl(n, l, a), c = l.pendingStructs;
  if (c) {
    for (const [u, g] of c.missing)
      if (g < J(l, u)) {
        i = !0;
        break;
      }
    if (d) {
      for (const [u, g] of d.missing) {
        const f = c.missing.get(u);
        (f == null || f > g) && c.missing.set(u, g);
      }
      c.update = ur([c.update, d.update]);
    }
  } else
    l.pendingStructs = d;
  const h = Ws(s, n, l);
  if (l.pendingDs) {
    const u = new ue($t(l.pendingDs));
    _(u.restDecoder);
    const g = Ws(u, n, l);
    h && g ? l.pendingDs = ur([h, g]) : l.pendingDs = h || g;
  } else
    l.pendingDs = h;
  if (i) {
    const u = (
      /** @type {{update: Uint8Array}} */
      l.pendingStructs.update
    );
    l.pendingStructs = null, Bi(n.doc, u);
  }
}, e, !1), Bi = (r, t, e, s = ue) => {
  const n = $t(t);
  jl(n, r, e, new s(n));
}, Fl = (r, t, e) => Bi(r, t, e, zi), ql = (r, t, e = /* @__PURE__ */ new Map()) => {
  ks(r, t.store, e), me(r, Ul(t.store));
}, Yl = (r, t = new Uint8Array([0]), e = new Xt()) => {
  const s = Pi(t);
  ql(e, r, s);
  const n = [e.toUint8Array()];
  if (r.store.pendingDs && n.push(r.store.pendingDs), r.store.pendingStructs && n.push(la(r.store.pendingStructs.update, t)), n.length > 1) {
    if (e.constructor === Fe)
      return na(n.map((i, o) => o === 0 ? i : ca(i)));
    if (e.constructor === Xt)
      return ur(n);
  }
  return n[0];
}, Jl = (r, t) => Yl(r, t, new Fe()), Wl = (r) => {
  const t = /* @__PURE__ */ new Map(), e = _(r.restDecoder);
  for (let s = 0; s < e; s++) {
    const n = _(r.restDecoder), i = _(r.restDecoder);
    t.set(n, i);
  }
  return t;
}, Pi = (r) => Wl(new Ui($t(r))), ji = (r, t) => (A(r.restEncoder, t.size), Mt(t.entries()).sort((e, s) => s[0] - e[0]).forEach(([e, s]) => {
  A(r.restEncoder, e), A(r.restEncoder, s);
}), r), Kl = (r, t) => ji(r, Cr(t.store)), Xl = (r, t = new Ni()) => (r instanceof Map ? ji(t, r) : Kl(t, r), t.toUint8Array()), Gl = (r) => Xl(r, new Hi());
class Ql {
  constructor() {
    this.l = [];
  }
}
const Ks = () => new Ql(), Xs = (r, t) => r.l.push(t), Gs = (r, t) => {
  const e = r.l, s = e.length;
  r.l = e.filter((n) => t !== n), s === r.l.length && console.error("[yjs] Tried to remove event handler that doesn't exist.");
}, Fi = (r, t, e) => vs(r.l, [t, e]);
class le {
  /**
   * @param {number} client client id
   * @param {number} clock unique per client id, continuous number
   */
  constructor(t, e) {
    this.client = t, this.clock = e;
  }
}
const tr = (r, t) => r === t || r !== null && t !== null && r.client === t.client && r.clock === t.clock, D = (r, t) => new le(r, t), Zl = (r) => {
  for (const [t, e] of r.doc.share.entries())
    if (e === r)
      return t;
  throw ft();
}, ie = (r, t) => t === void 0 ? !r.deleted : t.sv.has(r.id.client) && (t.sv.get(r.id.client) || 0) > r.id.clock && !Ri(t.ds, r.id), ns = (r, t) => {
  const e = _t(r.meta, ns, Kt), s = r.doc.store;
  e.has(t) || (t.sv.forEach((n, i) => {
    n < J(s, i) && Bt(r, D(i, n));
  }), Oi(r, t.ds, (n) => {
  }), e.add(t));
};
class qi {
  constructor() {
    this.clients = /* @__PURE__ */ new Map(), this.pendingStructs = null, this.pendingDs = null;
  }
}
const Cr = (r) => {
  const t = /* @__PURE__ */ new Map();
  return r.clients.forEach((e, s) => {
    const n = e[e.length - 1];
    t.set(s, n.id.clock + n.length);
  }), t;
}, J = (r, t) => {
  const e = r.clients.get(t);
  if (e === void 0)
    return 0;
  const s = e[e.length - 1];
  return s.id.clock + s.length;
}, Yi = (r, t) => {
  let e = r.clients.get(t.id.client);
  if (e === void 0)
    e = [], r.clients.set(t.id.client, e);
  else {
    const s = e[e.length - 1];
    if (s.id.clock + s.length !== t.id.clock)
      throw ft();
  }
  e.push(t);
}, mt = (r, t) => {
  let e = 0, s = r.length - 1, n = r[s], i = n.id.clock;
  if (i === t)
    return s;
  let o = St(t / (i + n.length - 1) * s);
  for (; e <= s; ) {
    if (n = r[o], i = n.id.clock, i <= t) {
      if (t < i + n.length)
        return o;
      e = o + 1;
    } else
      s = o - 1;
    o = St((e + s) / 2);
  }
  throw ft();
}, $l = (r, t) => {
  const e = r.clients.get(t.client);
  return e[mt(e, t.clock)];
}, jr = (
  /** @type {function(StructStore,ID):Item} */
  $l
), os = (r, t, e) => {
  const s = mt(t, e), n = t[s];
  return n.id.clock < e && n instanceof P ? (t.splice(s + 1, 0, wr(r, n, e - n.id.clock)), s + 1) : s;
}, Bt = (r, t) => {
  const e = (
    /** @type {Array<Item>} */
    r.doc.store.clients.get(t.client)
  );
  return e[os(r, e, t.clock)];
}, Qs = (r, t, e) => {
  const s = t.clients.get(e.client), n = mt(s, e.clock), i = s[n];
  return e.clock !== i.id.clock + i.length - 1 && i.constructor !== nt && s.splice(n + 1, 0, wr(r, i, e.clock - i.id.clock + 1)), i;
}, ta = (r, t, e) => {
  const s = (
    /** @type {Array<GC|Item>} */
    r.clients.get(t.id.client)
  );
  s[mt(s, t.id.clock)] = e;
}, Ji = (r, t, e, s, n) => {
  if (s === 0)
    return;
  const i = e + s;
  let o = os(r, t, e), l;
  do
    l = t[o++], i < l.id.clock + l.length && os(r, t, i), n(l);
  while (o < t.length && t[o].id.clock < i);
};
class ea {
  /**
   * @param {Doc} doc
   * @param {any} origin
   * @param {boolean} local
   */
  constructor(t, e, s) {
    this.doc = t, this.deleteSet = new je(), this.beforeState = Cr(t.store), this.afterState = /* @__PURE__ */ new Map(), this.changed = /* @__PURE__ */ new Map(), this.changedParentTypes = /* @__PURE__ */ new Map(), this._mergeStructs = [], this.origin = e, this.meta = /* @__PURE__ */ new Map(), this.local = s, this.subdocsAdded = /* @__PURE__ */ new Set(), this.subdocsRemoved = /* @__PURE__ */ new Set(), this.subdocsLoaded = /* @__PURE__ */ new Set(), this._needFormattingCleanup = !1;
  }
}
const Zs = (r, t) => t.deleteSet.clients.size === 0 && !yo(t.afterState, (e, s) => t.beforeState.get(s) !== e) ? !1 : (bs(t.deleteSet), Pl(r, t), me(r, t.deleteSet), !0), $s = (r, t, e) => {
  const s = t._item;
  (s === null || s.id.clock < (r.beforeState.get(s.id.client) || 0) && !s.deleted) && _t(r.changed, t, Kt).add(e);
}, or = (r, t) => {
  let e = r[t], s = r[t - 1], n = t;
  for (; n > 0; e = s, s = r[--n - 1]) {
    if (s.deleted === e.deleted && s.constructor === e.constructor && s.mergeWith(e)) {
      e instanceof P && e.parentSub !== null && /** @type {AbstractType<any>} */
      e.parent._map.get(e.parentSub) === e && e.parent._map.set(
        e.parentSub,
        /** @type {Item} */
        s
      );
      continue;
    }
    break;
  }
  const i = t - n;
  return i && r.splice(t + 1 - i, i), i;
}, ra = (r, t, e) => {
  for (const [s, n] of r.clients.entries()) {
    const i = (
      /** @type {Array<GC|Item>} */
      t.clients.get(s)
    );
    for (let o = n.length - 1; o >= 0; o--) {
      const l = n[o], a = l.clock + l.len;
      for (let d = mt(i, l.clock), c = i[d]; d < i.length && c.id.clock < a; c = i[++d]) {
        const h = i[d];
        if (l.clock + l.len <= h.id.clock)
          break;
        h instanceof P && h.deleted && !h.keep && e(h) && h.gc(t, !1);
      }
    }
  }
}, sa = (r, t) => {
  r.clients.forEach((e, s) => {
    const n = (
      /** @type {Array<GC|Item>} */
      t.clients.get(s)
    );
    for (let i = e.length - 1; i >= 0; i--) {
      const o = e[i], l = wi(n.length - 1, 1 + mt(n, o.clock + o.len - 1));
      for (let a = l, d = n[a]; a > 0 && d.id.clock >= o.clock; d = n[a])
        a -= 1 + or(n, a);
    }
  });
}, Wi = (r, t) => {
  if (t < r.length) {
    const e = r[t], s = e.doc, n = s.store, i = e.deleteSet, o = e._mergeStructs;
    try {
      bs(i), e.afterState = Cr(e.doc.store), s.emit("beforeObserverCalls", [e, s]);
      const l = [];
      e.changed.forEach(
        (a, d) => l.push(() => {
          (d._item === null || !d._item.deleted) && d._callObserver(e, a);
        })
      ), l.push(() => {
        e.changedParentTypes.forEach((a, d) => {
          d._dEH.l.length > 0 && (d._item === null || !d._item.deleted) && (a = a.filter(
            (c) => c.target._item === null || !c.target._item.deleted
          ), a.forEach((c) => {
            c.currentTarget = d, c._path = null;
          }), a.sort((c, h) => c.path.length - h.path.length), Fi(d._dEH, a, e));
        });
      }), l.push(() => s.emit("afterTransaction", [e, s])), vs(l, []), e._needFormattingCleanup && Ma(e);
    } finally {
      s.gc && ra(i, n, s.gcFilter), sa(i, n), e.afterState.forEach((c, h) => {
        const u = e.beforeState.get(h) || 0;
        if (u !== c) {
          const g = (
            /** @type {Array<GC|Item>} */
            n.clients.get(h)
          ), f = Zt(mt(g, u), 1);
          for (let y = g.length - 1; y >= f; )
            y -= 1 + or(g, y);
        }
      });
      for (let c = o.length - 1; c >= 0; c--) {
        const { client: h, clock: u } = o[c].id, g = (
          /** @type {Array<GC|Item>} */
          n.clients.get(h)
        ), f = mt(g, u);
        f + 1 < g.length && or(g, f + 1) > 1 || f > 0 && or(g, f);
      }
      if (!e.local && e.afterState.get(s.clientID) !== e.beforeState.get(s.clientID) && (Dl(Li, Ai, "[yjs] ", xi, Di, "Changed the client-id because another client seems to be using it."), s.clientID = Vi()), s.emit("afterTransactionCleanup", [e, s]), s._observers.has("update")) {
        const c = new Fe();
        Zs(c, e) && s.emit("update", [c.toUint8Array(), e.origin, s, e]);
      }
      if (s._observers.has("updateV2")) {
        const c = new Xt();
        Zs(c, e) && s.emit("updateV2", [c.toUint8Array(), e.origin, s, e]);
      }
      const { subdocsAdded: l, subdocsLoaded: a, subdocsRemoved: d } = e;
      (l.size > 0 || d.size > 0 || a.size > 0) && (l.forEach((c) => {
        c.clientID = s.clientID, c.collectionid == null && (c.collectionid = s.collectionid), s.subdocs.add(c);
      }), d.forEach((c) => s.subdocs.delete(c)), s.emit("subdocs", [{ loaded: a, added: l, removed: d }, s, e]), d.forEach((c) => c.destroy())), r.length <= t + 1 ? (s._transactionCleanups = [], s.emit("afterAllTransactions", [s, r])) : Wi(r, t + 1);
    }
  }
}, V = (r, t, e = null, s = !0) => {
  const n = r._transactionCleanups;
  let i = !1, o = null;
  r._transaction === null && (i = !0, r._transaction = new ea(r, e, s), n.push(r._transaction), n.length === 1 && r.emit("beforeAllTransactions", [r]), r.emit("beforeTransaction", [r._transaction, r]));
  try {
    o = t(r._transaction);
  } finally {
    if (i) {
      const l = r._transaction === n[0];
      r._transaction = null, l && Wi(n, 0);
    }
  }
  return o;
};
function* ia(r) {
  const t = _(r.restDecoder);
  for (let e = 0; e < t; e++) {
    const s = _(r.restDecoder), n = r.readClient();
    let i = _(r.restDecoder);
    for (let o = 0; o < s; o++) {
      const l = r.readInfo();
      if (l === 10) {
        const a = _(r.restDecoder);
        yield new ot(D(n, i), a), i += a;
      } else if (br & l) {
        const a = (l & (Ct | et)) === 0, d = new P(
          D(n, i),
          null,
          // left
          (l & et) === et ? r.readLeftID() : null,
          // origin
          null,
          // right
          (l & Ct) === Ct ? r.readRightID() : null,
          // right origin
          // @ts-ignore Force writing a string here.
          a ? r.readParentInfo() ? r.readString() : r.readLeftID() : null,
          // parent
          a && (l & Le) === Le ? r.readString() : null,
          // parentSub
          un(r, l)
          // item content
        );
        yield d, i += d.length;
      } else {
        const a = r.readLen();
        yield new nt(D(n, i), a), i += a;
      }
    }
  }
}
class Cs {
  /**
   * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
   * @param {boolean} filterSkips
   */
  constructor(t, e) {
    this.gen = ia(t), this.curr = null, this.done = !1, this.filterSkips = e, this.next();
  }
  /**
   * @return {Item | GC | Skip |null}
   */
  next() {
    do
      this.curr = this.gen.next().value || null;
    while (this.filterSkips && this.curr !== null && this.curr.constructor === ot);
    return this.curr;
  }
}
class Ms {
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  constructor(t) {
    this.currClient = 0, this.startClock = 0, this.written = 0, this.encoder = t, this.clientStructs = [];
  }
}
const na = (r) => ur(r, zi, Fe), oa = (r, t) => {
  if (r.constructor === nt) {
    const { client: e, clock: s } = r.id;
    return new nt(D(e, s + t), r.length - t);
  } else if (r.constructor === ot) {
    const { client: e, clock: s } = r.id;
    return new ot(D(e, s + t), r.length - t);
  } else {
    const e = (
      /** @type {Item} */
      r
    ), { client: s, clock: n } = e.id;
    return new P(
      D(s, n + t),
      null,
      D(s, n + t - 1),
      null,
      e.rightOrigin,
      e.parent,
      e.parentSub,
      e.content.splice(t)
    );
  }
}, ur = (r, t = ue, e = Xt) => {
  if (r.length === 1)
    return r[0];
  const s = r.map((c) => new t($t(c)));
  let n = s.map((c) => new Cs(c, !0)), i = null;
  const o = new e(), l = new Ms(o);
  for (; n = n.filter((c) => c.curr !== null), n.sort(
    /** @type {function(any,any):number} */
    (c, h) => {
      if (c.curr.id.client === h.curr.id.client) {
        const u = c.curr.id.clock - h.curr.id.clock;
        return u === 0 ? c.curr.constructor === h.curr.constructor ? 0 : c.curr.constructor === ot ? 1 : -1 : u;
      } else
        return h.curr.id.client - c.curr.id.client;
    }
  ), n.length !== 0; ) {
    const c = n[0], h = (
      /** @type {Item | GC} */
      c.curr.id.client
    );
    if (i !== null) {
      let u = (
        /** @type {Item | GC | null} */
        c.curr
      ), g = !1;
      for (; u !== null && u.id.clock + u.length <= i.struct.id.clock + i.struct.length && u.id.client >= i.struct.id.client; )
        u = c.next(), g = !0;
      if (u === null || // current decoder is empty
      u.id.client !== h || // check whether there is another decoder that has has updates from `firstClient`
      g && u.id.clock > i.struct.id.clock + i.struct.length)
        continue;
      if (h !== i.struct.id.client)
        Rt(l, i.struct, i.offset), i = { struct: u, offset: 0 }, c.next();
      else if (i.struct.id.clock + i.struct.length < u.id.clock)
        if (i.struct.constructor === ot)
          i.struct.length = u.id.clock + u.length - i.struct.id.clock;
        else {
          Rt(l, i.struct, i.offset);
          const f = u.id.clock - i.struct.id.clock - i.struct.length;
          i = { struct: new ot(D(h, i.struct.id.clock + i.struct.length), f), offset: 0 };
        }
      else {
        const f = i.struct.id.clock + i.struct.length - u.id.clock;
        f > 0 && (i.struct.constructor === ot ? i.struct.length -= f : u = oa(u, f)), i.struct.mergeWith(
          /** @type {any} */
          u
        ) || (Rt(l, i.struct, i.offset), i = { struct: u, offset: 0 }, c.next());
      }
    } else
      i = { struct: (
        /** @type {Item | GC} */
        c.curr
      ), offset: 0 }, c.next();
    for (let u = c.curr; u !== null && u.id.client === h && u.id.clock === i.struct.id.clock + i.struct.length && u.constructor !== ot; u = c.next())
      Rt(l, i.struct, i.offset), i = { struct: u, offset: 0 };
  }
  i !== null && (Rt(l, i.struct, i.offset), i = null), Ss(l);
  const a = s.map((c) => ys(c)), d = Rl(a);
  return me(o, d), o.toUint8Array();
}, la = (r, t, e = ue, s = Xt) => {
  const n = Pi(t), i = new s(), o = new Ms(i), l = new e($t(r)), a = new Cs(l, !1);
  for (; a.curr; ) {
    const c = a.curr, h = c.id.client, u = n.get(h) || 0;
    if (a.curr.constructor === ot) {
      a.next();
      continue;
    }
    if (c.id.clock + c.length > u)
      for (Rt(o, c, Zt(u - c.id.clock, 0)), a.next(); a.curr && a.curr.id.client === h; )
        Rt(o, a.curr, 0), a.next();
    else
      for (; a.curr && a.curr.id.client === h && a.curr.id.clock + a.curr.length <= u; )
        a.next();
  }
  Ss(o);
  const d = ys(l);
  return me(i, d), i.toUint8Array();
}, Ki = (r) => {
  r.written > 0 && (r.clientStructs.push({ written: r.written, restEncoder: at(r.encoder.restEncoder) }), r.encoder.restEncoder = Pe(), r.written = 0);
}, Rt = (r, t, e) => {
  r.written > 0 && r.currClient !== t.id.client && Ki(r), r.written === 0 && (r.currClient = t.id.client, r.encoder.writeClient(t.id.client), A(r.encoder.restEncoder, t.id.clock + e)), t.write(r.encoder, e), r.written++;
}, Ss = (r) => {
  Ki(r);
  const t = r.encoder.restEncoder;
  A(t, r.clientStructs.length);
  for (let e = 0; e < r.clientStructs.length; e++) {
    const s = r.clientStructs[e];
    A(t, s.written), yr(t, s.restEncoder);
  }
}, aa = (r, t, e, s) => {
  const n = new e($t(r)), i = new Cs(n, !1), o = new s(), l = new Ms(o);
  for (let d = i.curr; d !== null; d = i.next())
    Rt(l, t(d), 0);
  Ss(l);
  const a = ys(n);
  return me(o, a), o.toUint8Array();
}, ca = (r) => aa(r, dl, ue, Fe), ti = "You must not compute changes after the event-handler fired.";
class Mr {
  /**
   * @param {T} target The changed type.
   * @param {Transaction} transaction
   */
  constructor(t, e) {
    this.target = t, this.currentTarget = t, this.transaction = e, this._changes = null, this._keys = null, this._delta = null, this._path = null;
  }
  /**
   * Computes the path from `y` to the changed type.
   *
   * @todo v14 should standardize on path: Array<{parent, index}> because that is easier to work with.
   *
   * The following property holds:
   * @example
   *   let type = y
   *   event.path.forEach(dir => {
   *     type = type.get(dir)
   *   })
   *   type === event.target // => true
   */
  get path() {
    return this._path || (this._path = ha(this.currentTarget, this.target));
  }
  /**
   * Check if a struct is deleted by this event.
   *
   * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
   *
   * @param {AbstractStruct} struct
   * @return {boolean}
   */
  deletes(t) {
    return Ri(this.transaction.deleteSet, t.id);
  }
  /**
   * @type {Map<string, { action: 'add' | 'update' | 'delete', oldValue: any, newValue: any }>}
   */
  get keys() {
    if (this._keys === null) {
      if (this.transaction.doc._transactionCleanups.length === 0)
        throw Nt(ti);
      const t = /* @__PURE__ */ new Map(), e = this.target;
      this.transaction.changed.get(e).forEach((s) => {
        if (s !== null) {
          const n = (
            /** @type {Item} */
            e._map.get(s)
          );
          let i, o;
          if (this.adds(n)) {
            let l = n.left;
            for (; l !== null && this.adds(l); )
              l = l.left;
            if (this.deletes(n))
              if (l !== null && this.deletes(l))
                i = "delete", o = Ur(l.content.getContent());
              else
                return;
            else
              l !== null && this.deletes(l) ? (i = "update", o = Ur(l.content.getContent())) : (i = "add", o = void 0);
          } else if (this.deletes(n))
            i = "delete", o = Ur(
              /** @type {Item} */
              n.content.getContent()
            );
          else
            return;
          t.set(s, { action: i, oldValue: o });
        }
      }), this._keys = t;
    }
    return this._keys;
  }
  /**
   * This is a computed property. Note that this can only be safely computed during the
   * event call. Computing this property after other changes happened might result in
   * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
   * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
   *
   * @type {Array<{insert?: string | Array<any> | object | AbstractType<any>, retain?: number, delete?: number, attributes?: Object<string, any>}>}
   */
  get delta() {
    return this.changes.delta;
  }
  /**
   * Check if a struct is added by this event.
   *
   * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
   *
   * @param {AbstractStruct} struct
   * @return {boolean}
   */
  adds(t) {
    return t.id.clock >= (this.transaction.beforeState.get(t.id.client) || 0);
  }
  /**
   * This is a computed property. Note that this can only be safely computed during the
   * event call. Computing this property after other changes happened might result in
   * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
   * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
   *
   * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
   */
  get changes() {
    let t = this._changes;
    if (t === null) {
      if (this.transaction.doc._transactionCleanups.length === 0)
        throw Nt(ti);
      const e = this.target, s = Kt(), n = Kt(), i = [];
      if (t = {
        added: s,
        deleted: n,
        delta: i,
        keys: this.keys
      }, /** @type Set<string|null> */
      this.transaction.changed.get(e).has(null)) {
        let o = null;
        const l = () => {
          o && i.push(o);
        };
        for (let a = e._start; a !== null; a = a.right)
          a.deleted ? this.deletes(a) && !this.adds(a) && ((o === null || o.delete === void 0) && (l(), o = { delete: 0 }), o.delete += a.length, n.add(a)) : this.adds(a) ? ((o === null || o.insert === void 0) && (l(), o = { insert: [] }), o.insert = o.insert.concat(a.content.getContent()), s.add(a)) : ((o === null || o.retain === void 0) && (l(), o = { retain: 0 }), o.retain += a.length);
        o !== null && o.retain === void 0 && l();
      }
      this._changes = t;
    }
    return (
      /** @type {any} */
      t
    );
  }
}
const ha = (r, t) => {
  const e = [];
  for (; t._item !== null && t !== r; ) {
    if (t._item.parentSub !== null)
      e.unshift(t._item.parentSub);
    else {
      let s = 0, n = (
        /** @type {AbstractType<any>} */
        t._item.parent._start
      );
      for (; n !== t._item && n !== null; )
        !n.deleted && n.countable && (s += n.length), n = n.right;
      e.unshift(s);
    }
    t = /** @type {AbstractType<any>} */
    t._item.parent;
  }
  return e;
}, Xi = 80;
let _s = 0;
class da {
  /**
   * @param {Item} p
   * @param {number} index
   */
  constructor(t, e) {
    t.marker = !0, this.p = t, this.index = e, this.timestamp = _s++;
  }
}
const ua = (r) => {
  r.timestamp = _s++;
}, Gi = (r, t, e) => {
  r.p.marker = !1, r.p = t, t.marker = !0, r.index = e, r.timestamp = _s++;
}, pa = (r, t, e) => {
  if (r.length >= Xi) {
    const s = r.reduce((n, i) => n.timestamp < i.timestamp ? n : i);
    return Gi(s, t, e), s;
  } else {
    const s = new da(t, e);
    return r.push(s), s;
  }
}, Sr = (r, t) => {
  if (r._start === null || t === 0 || r._searchMarker === null)
    return null;
  const e = r._searchMarker.length === 0 ? null : r._searchMarker.reduce((i, o) => sr(t - i.index) < sr(t - o.index) ? i : o);
  let s = r._start, n = 0;
  for (e !== null && (s = e.p, n = e.index, ua(e)); s.right !== null && n < t; ) {
    if (!s.deleted && s.countable) {
      if (t < n + s.length)
        break;
      n += s.length;
    }
    s = s.right;
  }
  for (; s.left !== null && n > t; )
    s = s.left, !s.deleted && s.countable && (n -= s.length);
  for (; s.left !== null && s.left.id.client === s.id.client && s.left.id.clock + s.left.length === s.id.clock; )
    s = s.left, !s.deleted && s.countable && (n -= s.length);
  return e !== null && sr(e.index - n) < /** @type {YText|YArray<any>} */
  s.parent.length / Xi ? (Gi(e, s, n), e) : pa(r._searchMarker, s, n);
}, Ue = (r, t, e) => {
  for (let s = r.length - 1; s >= 0; s--) {
    const n = r[s];
    if (e > 0) {
      let i = n.p;
      for (i.marker = !1; i && (i.deleted || !i.countable); )
        i = i.left, i && !i.deleted && i.countable && (n.index -= i.length);
      if (i === null || i.marker === !0) {
        r.splice(s, 1);
        continue;
      }
      n.p = i, i.marker = !0;
    }
    (t < n.index || e > 0 && t === n.index) && (n.index = Zt(t, n.index + e));
  }
}, _r = (r, t, e) => {
  const s = r, n = t.changedParentTypes;
  for (; _t(n, r, () => []).push(e), r._item !== null; )
    r = /** @type {AbstractType<any>} */
    r._item.parent;
  Fi(s._eH, e, t);
};
class W {
  constructor() {
    this._item = null, this._map = /* @__PURE__ */ new Map(), this._start = null, this.doc = null, this._length = 0, this._eH = Ks(), this._dEH = Ks(), this._searchMarker = null;
  }
  /**
   * @return {AbstractType<any>|null}
   */
  get parent() {
    return this._item ? (
      /** @type {AbstractType<any>} */
      this._item.parent
    ) : null;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item|null} item
   */
  _integrate(t, e) {
    this.doc = t, this._item = e;
  }
  /**
   * @return {AbstractType<EventType>}
   */
  _copy() {
    throw gt();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {AbstractType<EventType>}
   */
  clone() {
    throw gt();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} _encoder
   */
  _write(t) {
  }
  /**
   * The first non-deleted item
   */
  get _first() {
    let t = this._start;
    for (; t !== null && t.deleted; )
      t = t.right;
    return t;
  }
  /**
   * Creates YEvent and calls all type observers.
   * Must be implemented by each type.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} _parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(t, e) {
    !t.local && this._searchMarker && (this._searchMarker.length = 0);
  }
  /**
   * Observe all events that are created on this type.
   *
   * @param {function(EventType, Transaction):void} f Observer function
   */
  observe(t) {
    Xs(this._eH, t);
  }
  /**
   * Observe all events that are created by this type and its children.
   *
   * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
   */
  observeDeep(t) {
    Xs(this._dEH, t);
  }
  /**
   * Unregister an observer function.
   *
   * @param {function(EventType,Transaction):void} f Observer function
   */
  unobserve(t) {
    Gs(this._eH, t);
  }
  /**
   * Unregister an observer function.
   *
   * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
   */
  unobserveDeep(t) {
    Gs(this._dEH, t);
  }
  /**
   * @abstract
   * @return {any}
   */
  toJSON() {
  }
}
const Qi = (r, t, e) => {
  t < 0 && (t = r._length + t), e < 0 && (e = r._length + e);
  let s = e - t;
  const n = [];
  let i = r._start;
  for (; i !== null && s > 0; ) {
    if (i.countable && !i.deleted) {
      const o = i.content.getContent();
      if (o.length <= t)
        t -= o.length;
      else {
        for (let l = t; l < o.length && s > 0; l++)
          n.push(o[l]), s--;
        t = 0;
      }
    }
    i = i.right;
  }
  return n;
}, Zi = (r) => {
  const t = [];
  let e = r._start;
  for (; e !== null; ) {
    if (e.countable && !e.deleted) {
      const s = e.content.getContent();
      for (let n = 0; n < s.length; n++)
        t.push(s[n]);
    }
    e = e.right;
  }
  return t;
}, ze = (r, t) => {
  let e = 0, s = r._start;
  for (; s !== null; ) {
    if (s.countable && !s.deleted) {
      const n = s.content.getContent();
      for (let i = 0; i < n.length; i++)
        t(n[i], e++, r);
    }
    s = s.right;
  }
}, $i = (r, t) => {
  const e = [];
  return ze(r, (s, n) => {
    e.push(t(s, n, r));
  }), e;
}, ga = (r) => {
  let t = r._start, e = null, s = 0;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next: () => {
      if (e === null) {
        for (; t !== null && t.deleted; )
          t = t.right;
        if (t === null)
          return {
            done: !0,
            value: void 0
          };
        e = t.content.getContent(), s = 0, t = t.right;
      }
      const n = e[s++];
      return e.length <= s && (e = null), {
        done: !1,
        value: n
      };
    }
  };
}, tn = (r, t) => {
  const e = Sr(r, t);
  let s = r._start;
  for (e !== null && (s = e.p, t -= e.index); s !== null; s = s.right)
    if (!s.deleted && s.countable) {
      if (t < s.length)
        return s.content.getContent()[t];
      t -= s.length;
    }
}, pr = (r, t, e, s) => {
  let n = e;
  const i = r.doc, o = i.clientID, l = i.store, a = e === null ? t._start : e.right;
  let d = [];
  const c = () => {
    d.length > 0 && (n = new P(D(o, J(l, o)), n, n && n.lastId, a, a && a.id, t, null, new Qt(d)), n.integrate(r, 0), d = []);
  };
  s.forEach((h) => {
    if (h === null)
      d.push(h);
    else
      switch (h.constructor) {
        case Number:
        case Object:
        case Boolean:
        case Array:
        case String:
          d.push(h);
          break;
        default:
          switch (c(), h.constructor) {
            case Uint8Array:
            case ArrayBuffer:
              n = new P(D(o, J(l, o)), n, n && n.lastId, a, a && a.id, t, null, new qe(new Uint8Array(
                /** @type {Uint8Array} */
                h
              ))), n.integrate(r, 0);
              break;
            case ve:
              n = new P(D(o, J(l, o)), n, n && n.lastId, a, a && a.id, t, null, new Ye(
                /** @type {Doc} */
                h
              )), n.integrate(r, 0);
              break;
            default:
              if (h instanceof W)
                n = new P(D(o, J(l, o)), n, n && n.lastId, a, a && a.id, t, null, new It(h)), n.integrate(r, 0);
              else
                throw new Error("Unexpected content type in insert operation");
          }
      }
  }), c();
}, en = () => Nt("Length exceeded!"), rn = (r, t, e, s) => {
  if (e > t._length)
    throw en();
  if (e === 0)
    return t._searchMarker && Ue(t._searchMarker, e, s.length), pr(r, t, null, s);
  const n = e, i = Sr(t, e);
  let o = t._start;
  for (i !== null && (o = i.p, e -= i.index, e === 0 && (o = o.prev, e += o && o.countable && !o.deleted ? o.length : 0)); o !== null; o = o.right)
    if (!o.deleted && o.countable) {
      if (e <= o.length) {
        e < o.length && Bt(r, D(o.id.client, o.id.clock + e));
        break;
      }
      e -= o.length;
    }
  return t._searchMarker && Ue(t._searchMarker, n, s.length), pr(r, t, o, s);
}, fa = (r, t, e) => {
  let s = (t._searchMarker || []).reduce((n, i) => i.index > n.index ? i : n, { index: 0, p: t._start }).p;
  if (s)
    for (; s.right; )
      s = s.right;
  return pr(r, t, s, e);
}, sn = (r, t, e, s) => {
  if (s === 0)
    return;
  const n = e, i = s, o = Sr(t, e);
  let l = t._start;
  for (o !== null && (l = o.p, e -= o.index); l !== null && e > 0; l = l.right)
    !l.deleted && l.countable && (e < l.length && Bt(r, D(l.id.client, l.id.clock + e)), e -= l.length);
  for (; s > 0 && l !== null; )
    l.deleted || (s < l.length && Bt(r, D(l.id.client, l.id.clock + s)), l.delete(r), s -= l.length), l = l.right;
  if (s > 0)
    throw en();
  t._searchMarker && Ue(
    t._searchMarker,
    n,
    -i + s
    /* in case we remove the above exception */
  );
}, gr = (r, t, e) => {
  const s = t._map.get(e);
  s !== void 0 && s.delete(r);
}, Es = (r, t, e, s) => {
  const n = t._map.get(e) || null, i = r.doc, o = i.clientID;
  let l;
  if (s == null)
    l = new Qt([s]);
  else
    switch (s.constructor) {
      case Number:
      case Object:
      case Boolean:
      case Array:
      case String:
        l = new Qt([s]);
        break;
      case Uint8Array:
        l = new qe(
          /** @type {Uint8Array} */
          s
        );
        break;
      case ve:
        l = new Ye(
          /** @type {Doc} */
          s
        );
        break;
      default:
        if (s instanceof W)
          l = new It(s);
        else
          throw new Error("Unexpected content type");
    }
  new P(D(o, J(i.store, o)), n, n && n.lastId, null, null, t, e, l).integrate(r, 0);
}, Is = (r, t) => {
  const e = r._map.get(t);
  return e !== void 0 && !e.deleted ? e.content.getContent()[e.length - 1] : void 0;
}, nn = (r) => {
  const t = {};
  return r._map.forEach((e, s) => {
    e.deleted || (t[s] = e.content.getContent()[e.length - 1]);
  }), t;
}, on = (r, t) => {
  const e = r._map.get(t);
  return e !== void 0 && !e.deleted;
}, ma = (r, t) => {
  const e = {};
  return r._map.forEach((s, n) => {
    let i = s;
    for (; i !== null && (!t.sv.has(i.id.client) || i.id.clock >= (t.sv.get(i.id.client) || 0)); )
      i = i.left;
    i !== null && ie(i, t) && (e[n] = i.content.getContent()[i.length - 1]);
  }), e;
}, er = (r) => Tl(
  r.entries(),
  /** @param {any} entry */
  (t) => !t[1].deleted
);
class va extends Mr {
}
class ae extends W {
  constructor() {
    super(), this._prelimContent = [], this._searchMarker = [];
  }
  /**
   * Construct a new YArray containing the specified items.
   * @template {Object<string,any>|Array<any>|number|null|string|Uint8Array} T
   * @param {Array<T>} items
   * @return {YArray<T>}
   */
  static from(t) {
    const e = new ae();
    return e.push(t), e;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(t, e) {
    super._integrate(t, e), this.insert(
      0,
      /** @type {Array<any>} */
      this._prelimContent
    ), this._prelimContent = null;
  }
  /**
   * @return {YArray<T>}
   */
  _copy() {
    return new ae();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YArray<T>}
   */
  clone() {
    const t = new ae();
    return t.insert(0, this.toArray().map(
      (e) => e instanceof W ? (
        /** @type {typeof el} */
        e.clone()
      ) : e
    )), t;
  }
  get length() {
    return this._prelimContent === null ? this._length : this._prelimContent.length;
  }
  /**
   * Creates YArrayEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(t, e) {
    super._callObserver(t, e), _r(this, t, new va(this, t));
  }
  /**
   * Inserts new content at an index.
   *
   * Important: This function expects an array of content. Not just a content
   * object. The reason for this "weirdness" is that inserting several elements
   * is very efficient when it is done as a single operation.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  yarray.insert(0, ['a'])
   *  // Insert numbers 1, 2 at position 1
   *  yarray.insert(1, [1, 2])
   *
   * @param {number} index The index to insert content at.
   * @param {Array<T>} content The array of content
   */
  insert(t, e) {
    this.doc !== null ? V(this.doc, (s) => {
      rn(
        s,
        this,
        t,
        /** @type {any} */
        e
      );
    }) : this._prelimContent.splice(t, 0, ...e);
  }
  /**
   * Appends content to this YArray.
   *
   * @param {Array<T>} content Array of content to append.
   *
   * @todo Use the following implementation in all types.
   */
  push(t) {
    this.doc !== null ? V(this.doc, (e) => {
      fa(
        e,
        this,
        /** @type {any} */
        t
      );
    }) : this._prelimContent.push(...t);
  }
  /**
   * Prepends content to this YArray.
   *
   * @param {Array<T>} content Array of content to prepend.
   */
  unshift(t) {
    this.insert(0, t);
  }
  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} length The number of elements to remove. Defaults to 1.
   */
  delete(t, e = 1) {
    this.doc !== null ? V(this.doc, (s) => {
      sn(s, this, t, e);
    }) : this._prelimContent.splice(t, e);
  }
  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {T}
   */
  get(t) {
    return tn(this, t);
  }
  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<T>}
   */
  toArray() {
    return Zi(this);
  }
  /**
   * Returns a portion of this YArray into a JavaScript Array selected
   * from start to end (end not included).
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<T>}
   */
  slice(t = 0, e = this.length) {
    return Qi(this, t, e);
  }
  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Array<any>}
   */
  toJSON() {
    return this.map((t) => t instanceof W ? t.toJSON() : t);
  }
  /**
   * Returns an Array with the result of calling a provided function on every
   * element of this YArray.
   *
   * @template M
   * @param {function(T,number,YArray<T>):M} f Function that produces an element of the new Array
   * @return {Array<M>} A new array with each element being the result of the
   *                 callback function
   */
  map(t) {
    return $i(
      this,
      /** @type {any} */
      t
    );
  }
  /**
   * Executes a provided function once on every element of this YArray.
   *
   * @param {function(T,number,YArray<T>):void} f A function to execute on every element of this YArray.
   */
  forEach(t) {
    ze(this, t);
  }
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator]() {
    return ga(this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(t) {
    t.writeTypeRef(Pa);
  }
}
const wa = (r) => new ae();
class ba extends Mr {
  /**
   * @param {YMap<T>} ymap The YArray that changed.
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed.
   */
  constructor(t, e, s) {
    super(t, e), this.keysChanged = s;
  }
}
class pe extends W {
  /**
   *
   * @param {Iterable<readonly [string, any]>=} entries - an optional iterable to initialize the YMap
   */
  constructor(t) {
    super(), this._prelimContent = null, t === void 0 ? this._prelimContent = /* @__PURE__ */ new Map() : this._prelimContent = new Map(t);
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(t, e) {
    super._integrate(t, e), this._prelimContent.forEach((s, n) => {
      this.set(n, s);
    }), this._prelimContent = null;
  }
  /**
   * @return {YMap<MapType>}
   */
  _copy() {
    return new pe();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YMap<MapType>}
   */
  clone() {
    const t = new pe();
    return this.forEach((e, s) => {
      t.set(s, e instanceof W ? (
        /** @type {typeof value} */
        e.clone()
      ) : e);
    }), t;
  }
  /**
   * Creates YMapEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(t, e) {
    _r(this, t, new ba(this, t, e));
  }
  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Object<string,any>}
   */
  toJSON() {
    const t = {};
    return this._map.forEach((e, s) => {
      if (!e.deleted) {
        const n = e.content.getContent()[e.length - 1];
        t[s] = n instanceof W ? n.toJSON() : n;
      }
    }), t;
  }
  /**
   * Returns the size of the YMap (count of key/value pairs)
   *
   * @return {number}
   */
  get size() {
    return [...er(this._map)].length;
  }
  /**
   * Returns the keys for each element in the YMap Type.
   *
   * @return {IterableIterator<string>}
   */
  keys() {
    return Pr(
      er(this._map),
      /** @param {any} v */
      (t) => t[0]
    );
  }
  /**
   * Returns the values for each element in the YMap Type.
   *
   * @return {IterableIterator<MapType>}
   */
  values() {
    return Pr(
      er(this._map),
      /** @param {any} v */
      (t) => t[1].content.getContent()[t[1].length - 1]
    );
  }
  /**
   * Returns an Iterator of [key, value] pairs
   *
   * @return {IterableIterator<[string, MapType]>}
   */
  entries() {
    return Pr(
      er(this._map),
      /** @param {any} v */
      (t) => (
        /** @type {any} */
        [t[0], t[1].content.getContent()[t[1].length - 1]]
      )
    );
  }
  /**
   * Executes a provided function on once on every key-value pair.
   *
   * @param {function(MapType,string,YMap<MapType>):void} f A function to execute on every element of this YArray.
   */
  forEach(t) {
    this._map.forEach((e, s) => {
      e.deleted || t(e.content.getContent()[e.length - 1], s, this);
    });
  }
  /**
   * Returns an Iterator of [key, value] pairs
   *
   * @return {IterableIterator<[string, MapType]>}
   */
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * Remove a specified element from this YMap.
   *
   * @param {string} key The key of the element to remove.
   */
  delete(t) {
    this.doc !== null ? V(this.doc, (e) => {
      gr(e, this, t);
    }) : this._prelimContent.delete(t);
  }
  /**
   * Adds or updates an element with a specified key and value.
   * @template {MapType} VAL
   *
   * @param {string} key The key of the element to add to this YMap
   * @param {VAL} value The value of the element to add
   * @return {VAL}
   */
  set(t, e) {
    return this.doc !== null ? V(this.doc, (s) => {
      Es(
        s,
        this,
        t,
        /** @type {any} */
        e
      );
    }) : this._prelimContent.set(t, e), e;
  }
  /**
   * Returns a specified element from this YMap.
   *
   * @param {string} key
   * @return {MapType|undefined}
   */
  get(t) {
    return (
      /** @type {any} */
      Is(this, t)
    );
  }
  /**
   * Returns a boolean indicating whether the specified key exists or not.
   *
   * @param {string} key The key to test.
   * @return {boolean}
   */
  has(t) {
    return on(this, t);
  }
  /**
   * Removes all elements from this YMap.
   */
  clear() {
    this.doc !== null ? V(this.doc, (t) => {
      this.forEach(function(e, s, n) {
        gr(t, n, s);
      });
    }) : this._prelimContent.clear();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(t) {
    t.writeTypeRef(ja);
  }
}
const ya = (r) => new pe(), Ut = (r, t) => r === t || typeof r == "object" && typeof t == "object" && r && t && hl(r, t);
class ls {
  /**
   * @param {Item|null} left
   * @param {Item|null} right
   * @param {number} index
   * @param {Map<string,any>} currentAttributes
   */
  constructor(t, e, s, n) {
    this.left = t, this.right = e, this.index = s, this.currentAttributes = n;
  }
  /**
   * Only call this if you know that this.right is defined
   */
  forward() {
    switch (this.right === null && ft(), this.right.content.constructor) {
      case j:
        this.right.deleted || we(
          this.currentAttributes,
          /** @type {ContentFormat} */
          this.right.content
        );
        break;
      default:
        this.right.deleted || (this.index += this.right.length);
        break;
    }
    this.left = this.right, this.right = this.right.right;
  }
}
const ei = (r, t, e) => {
  for (; t.right !== null && e > 0; ) {
    switch (t.right.content.constructor) {
      case j:
        t.right.deleted || we(
          t.currentAttributes,
          /** @type {ContentFormat} */
          t.right.content
        );
        break;
      default:
        t.right.deleted || (e < t.right.length && Bt(r, D(t.right.id.client, t.right.id.clock + e)), t.index += t.right.length, e -= t.right.length);
        break;
    }
    t.left = t.right, t.right = t.right.right;
  }
  return t;
}, rr = (r, t, e, s) => {
  const n = /* @__PURE__ */ new Map(), i = s ? Sr(t, e) : null;
  if (i) {
    const o = new ls(i.p.left, i.p, i.index, n);
    return ei(r, o, e - i.index);
  } else {
    const o = new ls(null, t._start, 0, n);
    return ei(r, o, e);
  }
}, ln = (r, t, e, s) => {
  for (; e.right !== null && (e.right.deleted === !0 || e.right.content.constructor === j && Ut(
    s.get(
      /** @type {ContentFormat} */
      e.right.content.key
    ),
    /** @type {ContentFormat} */
    e.right.content.value
  )); )
    e.right.deleted || s.delete(
      /** @type {ContentFormat} */
      e.right.content.key
    ), e.forward();
  const n = r.doc, i = n.clientID;
  s.forEach((o, l) => {
    const a = e.left, d = e.right, c = new P(D(i, J(n.store, i)), a, a && a.lastId, d, d && d.id, t, null, new j(l, o));
    c.integrate(r, 0), e.right = c, e.forward();
  });
}, we = (r, t) => {
  const { key: e, value: s } = t;
  s === null ? r.delete(e) : r.set(e, s);
}, an = (r, t) => {
  for (var e; r.right !== null && (r.right.deleted || r.right.content.constructor === j && Ut(
    (e = t[
      /** @type {ContentFormat} */
      r.right.content.key
    ]) != null ? e : null,
    /** @type {ContentFormat} */
    r.right.content.value
  )); )
    r.forward();
}, cn = (r, t, e, s) => {
  var n;
  const i = r.doc, o = i.clientID, l = /* @__PURE__ */ new Map();
  for (const a in s) {
    const d = s[a], c = (n = e.currentAttributes.get(a)) != null ? n : null;
    if (!Ut(c, d)) {
      l.set(a, c);
      const { left: h, right: u } = e;
      e.right = new P(D(o, J(i.store, o)), h, h && h.lastId, u, u && u.id, t, null, new j(a, d)), e.right.integrate(r, 0), e.forward();
    }
  }
  return l;
}, Fr = (r, t, e, s, n) => {
  e.currentAttributes.forEach((u, g) => {
    n[g] === void 0 && (n[g] = null);
  });
  const i = r.doc, o = i.clientID;
  an(e, n);
  const l = cn(r, t, e, n), a = s.constructor === String ? new vt(
    /** @type {string} */
    s
  ) : s instanceof W ? new It(s) : new te(s);
  let { left: d, right: c, index: h } = e;
  t._searchMarker && Ue(t._searchMarker, e.index, a.getLength()), c = new P(D(o, J(i.store, o)), d, d && d.lastId, c, c && c.id, t, null, a), c.integrate(r, 0), e.right = c, e.index = h, e.forward(), ln(r, t, e, l);
}, ri = (r, t, e, s, n) => {
  const i = r.doc, o = i.clientID;
  an(e, n);
  const l = cn(r, t, e, n);
  t:
    for (; e.right !== null && (s > 0 || l.size > 0 && (e.right.deleted || e.right.content.constructor === j)); ) {
      if (!e.right.deleted)
        switch (e.right.content.constructor) {
          case j: {
            const { key: a, value: d } = (
              /** @type {ContentFormat} */
              e.right.content
            ), c = n[a];
            if (c !== void 0) {
              if (Ut(c, d))
                l.delete(a);
              else {
                if (s === 0)
                  break t;
                l.set(a, d);
              }
              e.right.delete(r);
            } else
              e.currentAttributes.set(a, d);
            break;
          }
          default:
            s < e.right.length && Bt(r, D(e.right.id.client, e.right.id.clock + s)), s -= e.right.length;
            break;
        }
      e.forward();
    }
  if (s > 0) {
    let a = "";
    for (; s > 0; s--)
      a += "\n";
    e.right = new P(D(o, J(i.store, o)), e.left, e.left && e.left.lastId, e.right, e.right && e.right.id, t, null, new vt(a)), e.right.integrate(r, 0), e.forward();
  }
  ln(r, t, e, l);
}, hn = (r, t, e, s, n) => {
  var i, o;
  let l = t;
  const a = $();
  for (; l && (!l.countable || l.deleted); ) {
    if (!l.deleted && l.content.constructor === j) {
      const h = (
        /** @type {ContentFormat} */
        l.content
      );
      a.set(h.key, h);
    }
    l = l.right;
  }
  let d = 0, c = !1;
  for (; t !== l; ) {
    if (e === t && (c = !0), !t.deleted) {
      const h = t.content;
      switch (h.constructor) {
        case j: {
          const { key: u, value: g } = (
            /** @type {ContentFormat} */
            h
          ), f = (i = s.get(u)) != null ? i : null;
          (a.get(u) !== h || f === g) && (t.delete(r), d++, !c && ((o = n.get(u)) != null ? o : null) === g && f !== g && (f === null ? n.delete(u) : n.set(u, f))), !c && !t.deleted && we(
            n,
            /** @type {ContentFormat} */
            h
          );
          break;
        }
      }
    }
    t = /** @type {Item} */
    t.right;
  }
  return d;
}, ka = (r, t) => {
  for (; t && t.right && (t.right.deleted || !t.right.countable); )
    t = t.right;
  const e = /* @__PURE__ */ new Set();
  for (; t && (t.deleted || !t.countable); ) {
    if (!t.deleted && t.content.constructor === j) {
      const s = (
        /** @type {ContentFormat} */
        t.content.key
      );
      e.has(s) ? t.delete(r) : e.add(s);
    }
    t = t.left;
  }
}, Ca = (r) => {
  let t = 0;
  return V(
    /** @type {Doc} */
    r.doc,
    (e) => {
      let s = (
        /** @type {Item} */
        r._start
      ), n = r._start, i = $();
      const o = $r(i);
      for (; n; ) {
        if (n.deleted === !1)
          switch (n.content.constructor) {
            case j:
              we(
                o,
                /** @type {ContentFormat} */
                n.content
              );
              break;
            default:
              t += hn(e, s, n, i, o), i = $r(o), s = n;
              break;
          }
        n = n.right;
      }
    }
  ), t;
}, Ma = (r) => {
  const t = /* @__PURE__ */ new Set(), e = r.doc;
  for (const [s, n] of r.afterState.entries()) {
    const i = r.beforeState.get(s) || 0;
    n !== i && Ji(
      r,
      /** @type {Array<Item|GC>} */
      e.store.clients.get(s),
      i,
      n,
      (o) => {
        !o.deleted && /** @type {Item} */
        o.content.constructor === j && o.constructor !== nt && t.add(
          /** @type {any} */
          o.parent
        );
      }
    );
  }
  V(e, (s) => {
    Oi(r, r.deleteSet, (n) => {
      if (n instanceof nt || !/** @type {YText} */
      n.parent._hasFormatting || t.has(
        /** @type {YText} */
        n.parent
      ))
        return;
      const i = (
        /** @type {YText} */
        n.parent
      );
      n.content.constructor === j ? t.add(i) : ka(s, n);
    });
    for (const n of t)
      Ca(n);
  });
}, si = (r, t, e) => {
  const s = e, n = $r(t.currentAttributes), i = t.right;
  for (; e > 0 && t.right !== null; ) {
    if (t.right.deleted === !1)
      switch (t.right.content.constructor) {
        case It:
        case te:
        case vt:
          e < t.right.length && Bt(r, D(t.right.id.client, t.right.id.clock + e)), e -= t.right.length, t.right.delete(r);
          break;
      }
    t.forward();
  }
  i && hn(r, i, t.right, n, t.currentAttributes);
  const o = (
    /** @type {AbstractType<any>} */
    /** @type {Item} */
    (t.left || t.right).parent
  );
  return o._searchMarker && Ue(o._searchMarker, t.index, -s + e), t;
};
class Sa extends Mr {
  /**
   * @param {YText} ytext
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed
   */
  constructor(t, e, s) {
    super(t, e), this.childListChanged = !1, this.keysChanged = /* @__PURE__ */ new Set(), s.forEach((n) => {
      n === null ? this.childListChanged = !0 : this.keysChanged.add(n);
    });
  }
  /**
   * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
   */
  get changes() {
    if (this._changes === null) {
      const t = {
        keys: this.keys,
        delta: this.delta,
        added: /* @__PURE__ */ new Set(),
        deleted: /* @__PURE__ */ new Set()
      };
      this._changes = t;
    }
    return (
      /** @type {any} */
      this._changes
    );
  }
  /**
   * Compute the changes in the delta format.
   * A {@link https://quilljs.com/docs/delta/|Quill Delta}) that represents the changes on the document.
   *
   * @type {Array<{insert?:string|object|AbstractType<any>, delete?:number, retain?:number, attributes?: Object<string,any>}>}
   *
   * @public
   */
  get delta() {
    if (this._delta === null) {
      const t = (
        /** @type {Doc} */
        this.target.doc
      ), e = [];
      V(t, (s) => {
        var n, i, o;
        const l = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
        let d = this.target._start, c = null;
        const h = {};
        let u = "", g = 0, f = 0;
        const y = () => {
          if (c !== null) {
            let w = null;
            switch (c) {
              case "delete":
                f > 0 && (w = { delete: f }), f = 0;
                break;
              case "insert":
                (typeof u == "object" || u.length > 0) && (w = { insert: u }, l.size > 0 && (w.attributes = {}, l.forEach((E, T) => {
                  E !== null && (w.attributes[T] = E);
                }))), u = "";
                break;
              case "retain":
                g > 0 && (w = { retain: g }, al(h) || (w.attributes = ol({}, h))), g = 0;
                break;
            }
            w && e.push(w), c = null;
          }
        };
        for (; d !== null; ) {
          switch (d.content.constructor) {
            case It:
            case te:
              this.adds(d) ? this.deletes(d) || (y(), c = "insert", u = d.content.getContent()[0], y()) : this.deletes(d) ? (c !== "delete" && (y(), c = "delete"), f += 1) : d.deleted || (c !== "retain" && (y(), c = "retain"), g += 1);
              break;
            case vt:
              this.adds(d) ? this.deletes(d) || (c !== "insert" && (y(), c = "insert"), u += /** @type {ContentString} */
              d.content.str) : this.deletes(d) ? (c !== "delete" && (y(), c = "delete"), f += d.length) : d.deleted || (c !== "retain" && (y(), c = "retain"), g += d.length);
              break;
            case j: {
              const { key: w, value: E } = (
                /** @type {ContentFormat} */
                d.content
              );
              if (this.adds(d)) {
                if (!this.deletes(d)) {
                  const T = (n = l.get(w)) != null ? n : null;
                  Ut(T, E) ? E !== null && d.delete(s) : (c === "retain" && y(), Ut(E, (i = a.get(w)) != null ? i : null) ? delete h[w] : h[w] = E);
                }
              } else if (this.deletes(d)) {
                a.set(w, E);
                const T = (o = l.get(w)) != null ? o : null;
                Ut(T, E) || (c === "retain" && y(), h[w] = T);
              } else if (!d.deleted) {
                a.set(w, E);
                const T = h[w];
                T !== void 0 && (Ut(T, E) ? T !== null && d.delete(s) : (c === "retain" && y(), E === null ? delete h[w] : h[w] = E));
              }
              d.deleted || (c === "insert" && y(), we(
                l,
                /** @type {ContentFormat} */
                d.content
              ));
              break;
            }
          }
          d = d.right;
        }
        for (y(); e.length > 0; ) {
          const w = e[e.length - 1];
          if (w.retain !== void 0 && w.attributes === void 0)
            e.pop();
          else
            break;
        }
      }), this._delta = e;
    }
    return (
      /** @type {any} */
      this._delta
    );
  }
}
class ge extends W {
  /**
   * @param {String} [string] The initial value of the YText.
   */
  constructor(t) {
    super(), this._pending = t !== void 0 ? [() => this.insert(0, t)] : [], this._searchMarker = [], this._hasFormatting = !1;
  }
  /**
   * Number of characters of this text type.
   *
   * @type {number}
   */
  get length() {
    return this._length;
  }
  /**
   * @param {Doc} y
   * @param {Item} item
   */
  _integrate(t, e) {
    super._integrate(t, e);
    try {
      this._pending.forEach((s) => s());
    } catch (s) {
      console.error(s);
    }
    this._pending = null;
  }
  _copy() {
    return new ge();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YText}
   */
  clone() {
    const t = new ge();
    return t.applyDelta(this.toDelta()), t;
  }
  /**
   * Creates YTextEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(t, e) {
    super._callObserver(t, e);
    const s = new Sa(this, t, e);
    _r(this, t, s), !t.local && this._hasFormatting && (t._needFormattingCleanup = !0);
  }
  /**
   * Returns the unformatted string representation of this YText type.
   *
   * @public
   */
  toString() {
    let t = "", e = this._start;
    for (; e !== null; )
      !e.deleted && e.countable && e.content.constructor === vt && (t += /** @type {ContentString} */
      e.content.str), e = e.right;
    return t;
  }
  /**
   * Returns the unformatted string representation of this YText type.
   *
   * @return {string}
   * @public
   */
  toJSON() {
    return this.toString();
  }
  /**
   * Apply a {@link Delta} on this shared YText type.
   *
   * @param {any} delta The changes to apply on this element.
   * @param {object}  opts
   * @param {boolean} [opts.sanitize] Sanitize input delta. Removes ending newlines if set to true.
   *
   *
   * @public
   */
  applyDelta(t, { sanitize: e = !0 } = {}) {
    this.doc !== null ? V(this.doc, (s) => {
      const n = new ls(null, this._start, 0, /* @__PURE__ */ new Map());
      for (let i = 0; i < t.length; i++) {
        const o = t[i];
        if (o.insert !== void 0) {
          const l = !e && typeof o.insert == "string" && i === t.length - 1 && n.right === null && o.insert.slice(-1) === "\n" ? o.insert.slice(0, -1) : o.insert;
          (typeof l != "string" || l.length > 0) && Fr(s, this, n, l, o.attributes || {});
        } else
          o.retain !== void 0 ? ri(s, this, n, o.retain, o.attributes || {}) : o.delete !== void 0 && si(s, n, o.delete);
      }
    }) : this._pending.push(() => this.applyDelta(t));
  }
  /**
   * Returns the Delta representation of this YText type.
   *
   * @param {Snapshot} [snapshot]
   * @param {Snapshot} [prevSnapshot]
   * @param {function('removed' | 'added', ID):any} [computeYChange]
   * @return {any} The Delta representation of this type.
   *
   * @public
   */
  toDelta(t, e, s) {
    const n = [], i = /* @__PURE__ */ new Map(), o = (
      /** @type {Doc} */
      this.doc
    );
    let l = "", a = this._start;
    function d() {
      if (l.length > 0) {
        const h = {};
        let u = !1;
        i.forEach((f, y) => {
          u = !0, h[y] = f;
        });
        const g = { insert: l };
        u && (g.attributes = h), n.push(g), l = "";
      }
    }
    const c = () => {
      for (; a !== null; ) {
        if (ie(a, t) || e !== void 0 && ie(a, e))
          switch (a.content.constructor) {
            case vt: {
              const h = i.get("ychange");
              t !== void 0 && !ie(a, t) ? (h === void 0 || h.user !== a.id.client || h.type !== "removed") && (d(), i.set("ychange", s ? s("removed", a.id) : { type: "removed" })) : e !== void 0 && !ie(a, e) ? (h === void 0 || h.user !== a.id.client || h.type !== "added") && (d(), i.set("ychange", s ? s("added", a.id) : { type: "added" })) : h !== void 0 && (d(), i.delete("ychange")), l += /** @type {ContentString} */
              a.content.str;
              break;
            }
            case It:
            case te: {
              d();
              const h = {
                insert: a.content.getContent()[0]
              };
              if (i.size > 0) {
                const u = (
                  /** @type {Object<string,any>} */
                  {}
                );
                h.attributes = u, i.forEach((g, f) => {
                  u[f] = g;
                });
              }
              n.push(h);
              break;
            }
            case j:
              ie(a, t) && (d(), we(
                i,
                /** @type {ContentFormat} */
                a.content
              ));
              break;
          }
        a = a.right;
      }
      d();
    };
    return t || e ? V(o, (h) => {
      t && ns(h, t), e && ns(h, e), c();
    }, "cleanup") : c(), n;
  }
  /**
   * Insert text at a given index.
   *
   * @param {number} index The index at which to start inserting.
   * @param {String} text The text to insert at the specified position.
   * @param {TextAttributes} [attributes] Optionally define some formatting
   *                                    information to apply on the inserted
   *                                    Text.
   * @public
   */
  insert(t, e, s) {
    if (e.length <= 0)
      return;
    const n = this.doc;
    n !== null ? V(n, (i) => {
      const o = rr(i, this, t, !s);
      s || (s = {}, o.currentAttributes.forEach((l, a) => {
        s[a] = l;
      })), Fr(i, this, o, e, s);
    }) : this._pending.push(() => this.insert(t, e, s));
  }
  /**
   * Inserts an embed at a index.
   *
   * @param {number} index The index to insert the embed at.
   * @param {Object | AbstractType<any>} embed The Object that represents the embed.
   * @param {TextAttributes} [attributes] Attribute information to apply on the
   *                                    embed
   *
   * @public
   */
  insertEmbed(t, e, s) {
    const n = this.doc;
    n !== null ? V(n, (i) => {
      const o = rr(i, this, t, !s);
      Fr(i, this, o, e, s || {});
    }) : this._pending.push(() => this.insertEmbed(t, e, s || {}));
  }
  /**
   * Deletes text starting from an index.
   *
   * @param {number} index Index at which to start deleting.
   * @param {number} length The number of characters to remove. Defaults to 1.
   *
   * @public
   */
  delete(t, e) {
    if (e === 0)
      return;
    const s = this.doc;
    s !== null ? V(s, (n) => {
      si(n, rr(n, this, t, !0), e);
    }) : this._pending.push(() => this.delete(t, e));
  }
  /**
   * Assigns properties to a range of text.
   *
   * @param {number} index The position where to start formatting.
   * @param {number} length The amount of characters to assign properties to.
   * @param {TextAttributes} attributes Attribute information to apply on the
   *                                    text.
   *
   * @public
   */
  format(t, e, s) {
    if (e === 0)
      return;
    const n = this.doc;
    n !== null ? V(n, (i) => {
      const o = rr(i, this, t, !1);
      o.right !== null && ri(i, this, o, e, s);
    }) : this._pending.push(() => this.format(t, e, s));
  }
  /**
   * Removes an attribute.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that is to be removed.
   *
   * @public
   */
  removeAttribute(t) {
    this.doc !== null ? V(this.doc, (e) => {
      gr(e, this, t);
    }) : this._pending.push(() => this.removeAttribute(t));
  }
  /**
   * Sets or updates an attribute.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that is to be set.
   * @param {any} attributeValue The attribute value that is to be set.
   *
   * @public
   */
  setAttribute(t, e) {
    this.doc !== null ? V(this.doc, (s) => {
      Es(s, this, t, e);
    }) : this._pending.push(() => this.setAttribute(t, e));
  }
  /**
   * Returns an attribute value that belongs to the attribute name.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that identifies the
   *                               queried value.
   * @return {any} The queried attribute value.
   *
   * @public
   */
  getAttribute(t) {
    return (
      /** @type {any} */
      Is(this, t)
    );
  }
  /**
   * Returns all attribute name/value pairs in a JSON Object.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @return {Object<string, any>} A JSON Object that describes the attributes.
   *
   * @public
   */
  getAttributes() {
    return nn(this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(t) {
    t.writeTypeRef(Fa);
  }
}
const _a = (r) => new ge();
class qr {
  /**
   * @param {YXmlFragment | YXmlElement} root
   * @param {function(AbstractType<any>):boolean} [f]
   */
  constructor(t, e = () => !0) {
    this._filter = e, this._root = t, this._currentNode = /** @type {Item} */
    t._start, this._firstCall = !0;
  }
  [Symbol.iterator]() {
    return this;
  }
  /**
   * Get the next node.
   *
   * @return {IteratorResult<YXmlElement|YXmlText|YXmlHook>} The next node.
   *
   * @public
   */
  next() {
    let t = this._currentNode, e = t && t.content && /** @type {any} */
    t.content.type;
    if (t !== null && (!this._firstCall || t.deleted || !this._filter(e)))
      do
        if (e = /** @type {any} */
        t.content.type, !t.deleted && (e.constructor === fe || e.constructor === Gt) && e._start !== null)
          t = e._start;
        else
          for (; t !== null; )
            if (t.right !== null) {
              t = t.right;
              break;
            } else
              t.parent === this._root ? t = null : t = /** @type {AbstractType<any>} */
              t.parent._item;
      while (t !== null && (t.deleted || !this._filter(
        /** @type {ContentType} */
        t.content.type
      )));
    return this._firstCall = !1, t === null ? { value: void 0, done: !0 } : (this._currentNode = t, { value: (
      /** @type {any} */
      t.content.type
    ), done: !1 });
  }
}
class Gt extends W {
  constructor() {
    super(), this._prelimContent = [];
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get firstChild() {
    const t = this._first;
    return t ? t.content.getContent()[0] : null;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(t, e) {
    super._integrate(t, e), this.insert(
      0,
      /** @type {Array<any>} */
      this._prelimContent
    ), this._prelimContent = null;
  }
  _copy() {
    return new Gt();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlFragment}
   */
  clone() {
    const t = new Gt();
    return t.insert(0, this.toArray().map((e) => e instanceof W ? e.clone() : e)), t;
  }
  get length() {
    return this._prelimContent === null ? this._length : this._prelimContent.length;
  }
  /**
   * Create a subtree of childNodes.
   *
   * @example
   * const walker = elem.createTreeWalker(dom => dom.nodeName === 'div')
   * for (let node in walker) {
   *   // `node` is a div node
   *   nop(node)
   * }
   *
   * @param {function(AbstractType<any>):boolean} filter Function that is called on each child element and
   *                          returns a Boolean indicating whether the child
   *                          is to be included in the subtree.
   * @return {YXmlTreeWalker} A subtree and a position within it.
   *
   * @public
   */
  createTreeWalker(t) {
    return new qr(this, t);
  }
  /**
   * Returns the first YXmlElement that matches the query.
   * Similar to DOM's {@link querySelector}.
   *
   * Query support:
   *   - tagname
   * TODO:
   *   - id
   *   - attribute
   *
   * @param {CSS_Selector} query The query on the children.
   * @return {YXmlElement|YXmlText|YXmlHook|null} The first element that matches the query or null.
   *
   * @public
   */
  querySelector(t) {
    t = t.toUpperCase();
    const e = new qr(this, (s) => s.nodeName && s.nodeName.toUpperCase() === t).next();
    return e.done ? null : e.value;
  }
  /**
   * Returns all YXmlElements that match the query.
   * Similar to Dom's {@link querySelectorAll}.
   *
   * @todo Does not yet support all queries. Currently only query by tagName.
   *
   * @param {CSS_Selector} query The query on the children
   * @return {Array<YXmlElement|YXmlText|YXmlHook|null>} The elements that match this query.
   *
   * @public
   */
  querySelectorAll(t) {
    return t = t.toUpperCase(), Mt(new qr(this, (e) => e.nodeName && e.nodeName.toUpperCase() === t));
  }
  /**
   * Creates YXmlEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(t, e) {
    _r(this, t, new Aa(this, e, t));
  }
  /**
   * Get the string representation of all the children of this YXmlFragment.
   *
   * @return {string} The string representation of all children.
   */
  toString() {
    return $i(this, (t) => t.toString()).join("");
  }
  /**
   * @return {string}
   */
  toJSON() {
    return this.toString();
  }
  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(t = document, e = {}, s) {
    const n = t.createDocumentFragment();
    return s !== void 0 && s._createAssociation(n, this), ze(this, (i) => {
      n.insertBefore(i.toDOM(t, e, s), null);
    }), n;
  }
  /**
   * Inserts new content at an index.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  xml.insert(0, [new Y.XmlText('text')])
   *
   * @param {number} index The index to insert content at
   * @param {Array<YXmlElement|YXmlText>} content The array of content
   */
  insert(t, e) {
    this.doc !== null ? V(this.doc, (s) => {
      rn(s, this, t, e);
    }) : this._prelimContent.splice(t, 0, ...e);
  }
  /**
   * Inserts new content at an index.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  xml.insert(0, [new Y.XmlText('text')])
   *
   * @param {null|Item|YXmlElement|YXmlText} ref The index to insert content at
   * @param {Array<YXmlElement|YXmlText>} content The array of content
   */
  insertAfter(t, e) {
    if (this.doc !== null)
      V(this.doc, (s) => {
        const n = t && t instanceof W ? t._item : t;
        pr(s, this, n, e);
      });
    else {
      const s = (
        /** @type {Array<any>} */
        this._prelimContent
      ), n = t === null ? 0 : s.findIndex((i) => i === t) + 1;
      if (n === 0 && t !== null)
        throw Nt("Reference item not found");
      s.splice(n, 0, ...e);
    }
  }
  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} [length=1] The number of elements to remove. Defaults to 1.
   */
  delete(t, e = 1) {
    this.doc !== null ? V(this.doc, (s) => {
      sn(s, this, t, e);
    }) : this._prelimContent.splice(t, e);
  }
  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<YXmlElement|YXmlText|YXmlHook>}
   */
  toArray() {
    return Zi(this);
  }
  /**
   * Appends content to this YArray.
   *
   * @param {Array<YXmlElement|YXmlText>} content Array of content to append.
   */
  push(t) {
    this.insert(this.length, t);
  }
  /**
   * Prepends content to this YArray.
   *
   * @param {Array<YXmlElement|YXmlText>} content Array of content to prepend.
   */
  unshift(t) {
    this.insert(0, t);
  }
  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {YXmlElement|YXmlText}
   */
  get(t) {
    return tn(this, t);
  }
  /**
   * Returns a portion of this YXmlFragment into a JavaScript Array selected
   * from start to end (end not included).
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<YXmlElement|YXmlText>}
   */
  slice(t = 0, e = this.length) {
    return Qi(this, t, e);
  }
  /**
   * Executes a provided function on once on every child element.
   *
   * @param {function(YXmlElement|YXmlText,number, typeof self):void} f A function to execute on every element of this YArray.
   */
  forEach(t) {
    ze(this, t);
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write(t) {
    t.writeTypeRef(Ya);
  }
}
const Ea = (r) => new Gt();
class fe extends Gt {
  constructor(t = "UNDEFINED") {
    super(), this.nodeName = t, this._prelimAttrs = /* @__PURE__ */ new Map();
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get nextSibling() {
    const t = this._item ? this._item.next : null;
    return t ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      t.content.type
    ) : null;
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get prevSibling() {
    const t = this._item ? this._item.prev : null;
    return t ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      t.content.type
    ) : null;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(t, e) {
    super._integrate(t, e), /** @type {Map<string, any>} */
    this._prelimAttrs.forEach((s, n) => {
      this.setAttribute(n, s);
    }), this._prelimAttrs = null;
  }
  /**
   * Creates an Item with the same effect as this Item (without position effect)
   *
   * @return {YXmlElement}
   */
  _copy() {
    return new fe(this.nodeName);
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlElement<KV>}
   */
  clone() {
    const t = new fe(this.nodeName), e = this.getAttributes();
    return ll(e, (s, n) => {
      typeof s == "string" && t.setAttribute(n, s);
    }), t.insert(0, this.toArray().map((s) => s instanceof W ? s.clone() : s)), t;
  }
  /**
   * Returns the XML serialization of this YXmlElement.
   * The attributes are ordered by attribute-name, so you can easily use this
   * method to compare YXmlElements
   *
   * @return {string} The string representation of this type.
   *
   * @public
   */
  toString() {
    const t = this.getAttributes(), e = [], s = [];
    for (const l in t)
      s.push(l);
    s.sort();
    const n = s.length;
    for (let l = 0; l < n; l++) {
      const a = s[l];
      e.push(a + '="' + t[a] + '"');
    }
    const i = this.nodeName.toLocaleLowerCase(), o = e.length > 0 ? " " + e.join(" ") : "";
    return "<".concat(i).concat(o, ">").concat(super.toString(), "</").concat(i, ">");
  }
  /**
   * Removes an attribute from this YXmlElement.
   *
   * @param {string} attributeName The attribute name that is to be removed.
   *
   * @public
   */
  removeAttribute(t) {
    this.doc !== null ? V(this.doc, (e) => {
      gr(e, this, t);
    }) : this._prelimAttrs.delete(t);
  }
  /**
   * Sets or updates an attribute.
   *
   * @template {keyof KV & string} KEY
   *
   * @param {KEY} attributeName The attribute name that is to be set.
   * @param {KV[KEY]} attributeValue The attribute value that is to be set.
   *
   * @public
   */
  setAttribute(t, e) {
    this.doc !== null ? V(this.doc, (s) => {
      Es(s, this, t, e);
    }) : this._prelimAttrs.set(t, e);
  }
  /**
   * Returns an attribute value that belongs to the attribute name.
   *
   * @template {keyof KV & string} KEY
   *
   * @param {KEY} attributeName The attribute name that identifies the
   *                               queried value.
   * @return {KV[KEY]|undefined} The queried attribute value.
   *
   * @public
   */
  getAttribute(t) {
    return (
      /** @type {any} */
      Is(this, t)
    );
  }
  /**
   * Returns whether an attribute exists
   *
   * @param {string} attributeName The attribute name to check for existence.
   * @return {boolean} whether the attribute exists.
   *
   * @public
   */
  hasAttribute(t) {
    return (
      /** @type {any} */
      on(this, t)
    );
  }
  /**
   * Returns all attribute name/value pairs in a JSON Object.
   *
   * @param {Snapshot} [snapshot]
   * @return {{ [Key in Extract<keyof KV,string>]?: KV[Key]}} A JSON Object that describes the attributes.
   *
   * @public
   */
  getAttributes(t) {
    return (
      /** @type {any} */
      t ? ma(this, t) : nn(this)
    );
  }
  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(t = document, e = {}, s) {
    const n = t.createElement(this.nodeName), i = this.getAttributes();
    for (const o in i) {
      const l = i[o];
      typeof l == "string" && n.setAttribute(o, l);
    }
    return ze(this, (o) => {
      n.appendChild(o.toDOM(t, e, s));
    }), s !== void 0 && s._createAssociation(n, this), n;
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write(t) {
    t.writeTypeRef(qa), t.writeKey(this.nodeName);
  }
}
const Ia = (r) => new fe(r.readKey());
class Aa extends Mr {
  /**
   * @param {YXmlElement|YXmlText|YXmlFragment} target The target on which the event is created.
   * @param {Set<string|null>} subs The set of changed attributes. `null` is included if the
   *                   child list changed.
   * @param {Transaction} transaction The transaction instance with wich the
   *                                  change was created.
   */
  constructor(t, e, s) {
    super(t, s), this.childListChanged = !1, this.attributesChanged = /* @__PURE__ */ new Set(), e.forEach((n) => {
      n === null ? this.childListChanged = !0 : this.attributesChanged.add(n);
    });
  }
}
class fr extends pe {
  /**
   * @param {string} hookName nodeName of the Dom Node.
   */
  constructor(t) {
    super(), this.hookName = t;
  }
  /**
   * Creates an Item with the same effect as this Item (without position effect)
   */
  _copy() {
    return new fr(this.hookName);
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlHook}
   */
  clone() {
    const t = new fr(this.hookName);
    return this.forEach((e, s) => {
      t.set(s, e);
    }), t;
  }
  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object.<string, any>} [hooks] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type
   * @return {Element} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(t = document, e = {}, s) {
    const n = e[this.hookName];
    let i;
    return n !== void 0 ? i = n.createDom(this) : i = document.createElement(this.hookName), i.setAttribute("data-yjs-hook", this.hookName), s !== void 0 && s._createAssociation(i, this), i;
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write(t) {
    t.writeTypeRef(Ja), t.writeKey(this.hookName);
  }
}
const xa = (r) => new fr(r.readKey());
class mr extends ge {
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get nextSibling() {
    const t = this._item ? this._item.next : null;
    return t ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      t.content.type
    ) : null;
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get prevSibling() {
    const t = this._item ? this._item.prev : null;
    return t ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      t.content.type
    ) : null;
  }
  _copy() {
    return new mr();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlText}
   */
  clone() {
    const t = new mr();
    return t.applyDelta(this.toDelta()), t;
  }
  /**
   * Creates a Dom Element that mirrors this YXmlText.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Text} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(t = document, e, s) {
    const n = t.createTextNode(this.toString());
    return s !== void 0 && s._createAssociation(n, this), n;
  }
  toString() {
    return this.toDelta().map((t) => {
      const e = [];
      for (const n in t.attributes) {
        const i = [];
        for (const o in t.attributes[n])
          i.push({ key: o, value: t.attributes[n][o] });
        i.sort((o, l) => o.key < l.key ? -1 : 1), e.push({ nodeName: n, attrs: i });
      }
      e.sort((n, i) => n.nodeName < i.nodeName ? -1 : 1);
      let s = "";
      for (let n = 0; n < e.length; n++) {
        const i = e[n];
        s += "<".concat(i.nodeName);
        for (let o = 0; o < i.attrs.length; o++) {
          const l = i.attrs[o];
          s += " ".concat(l.key, '="').concat(l.value, '"');
        }
        s += ">";
      }
      s += t.insert;
      for (let n = e.length - 1; n >= 0; n--)
        s += "</".concat(e[n].nodeName, ">");
      return s;
    }).join("");
  }
  /**
   * @return {string}
   */
  toJSON() {
    return this.toString();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(t) {
    t.writeTypeRef(Wa);
  }
}
const Da = (r) => new mr();
class As {
  /**
   * @param {ID} id
   * @param {number} length
   */
  constructor(t, e) {
    this.id = t, this.length = e;
  }
  /**
   * @type {boolean}
   */
  get deleted() {
    throw gt();
  }
  /**
   * Merge this struct with the item to the right.
   * This method is already assuming that `this.id.clock + this.length === this.id.clock`.
   * Also this method does *not* remove right from StructStore!
   * @param {AbstractStruct} right
   * @return {boolean} wether this merged with right
   */
  mergeWith(t) {
    return !1;
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   * @param {number} offset
   * @param {number} encodingRef
   */
  write(t, e, s) {
    throw gt();
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(t, e) {
    throw gt();
  }
}
const La = 0;
class nt extends As {
  get deleted() {
    return !0;
  }
  delete() {
  }
  /**
   * @param {GC} right
   * @return {boolean}
   */
  mergeWith(t) {
    return this.constructor !== t.constructor ? !1 : (this.length += t.length, !0);
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(t, e) {
    e > 0 && (this.id.clock += e, this.length -= e), Yi(t.doc.store, this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, e) {
    t.writeInfo(La), t.writeLen(this.length - e);
  }
  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(t, e) {
    return null;
  }
}
class qe {
  /**
   * @param {Uint8Array} content
   */
  constructor(t) {
    this.content = t;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.content];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentBinary}
   */
  copy() {
    return new qe(this.content);
  }
  /**
   * @param {number} offset
   * @return {ContentBinary}
   */
  splice(t) {
    throw gt();
  }
  /**
   * @param {ContentBinary} right
   * @return {boolean}
   */
  mergeWith(t) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(t, e) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(t) {
  }
  /**
   * @param {StructStore} store
   */
  gc(t) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, e) {
    t.writeBuf(this.content);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 3;
  }
}
const Ta = (r) => new qe(r.readBuf());
class He {
  /**
   * @param {number} len
   */
  constructor(t) {
    this.len = t;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.len;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !1;
  }
  /**
   * @return {ContentDeleted}
   */
  copy() {
    return new He(this.len);
  }
  /**
   * @param {number} offset
   * @return {ContentDeleted}
   */
  splice(t) {
    const e = new He(this.len - t);
    return this.len = t, e;
  }
  /**
   * @param {ContentDeleted} right
   * @return {boolean}
   */
  mergeWith(t) {
    return this.len += t.len, !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(t, e) {
    dr(t.deleteSet, e.id.client, e.id.clock, this.len), e.markDeleted();
  }
  /**
   * @param {Transaction} transaction
   */
  delete(t) {
  }
  /**
   * @param {StructStore} store
   */
  gc(t) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, e) {
    t.writeLen(this.len - e);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 1;
  }
}
const Oa = (r) => new He(r.readLen()), dn = (r, t) => new ve({ guid: r, ...t, shouldLoad: t.shouldLoad || t.autoLoad || !1 });
class Ye {
  /**
   * @param {Doc} doc
   */
  constructor(t) {
    t._item && console.error("This document was already integrated as a sub-document. You should create a second instance instead with the same guid."), this.doc = t;
    const e = {};
    this.opts = e, t.gc || (e.gc = !1), t.autoLoad && (e.autoLoad = !0), t.meta !== null && (e.meta = t.meta);
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.doc];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentDoc}
   */
  copy() {
    return new Ye(dn(this.doc.guid, this.opts));
  }
  /**
   * @param {number} offset
   * @return {ContentDoc}
   */
  splice(t) {
    throw gt();
  }
  /**
   * @param {ContentDoc} right
   * @return {boolean}
   */
  mergeWith(t) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(t, e) {
    this.doc._item = e, t.subdocsAdded.add(this.doc), this.doc.shouldLoad && t.subdocsLoaded.add(this.doc);
  }
  /**
   * @param {Transaction} transaction
   */
  delete(t) {
    t.subdocsAdded.has(this.doc) ? t.subdocsAdded.delete(this.doc) : t.subdocsRemoved.add(this.doc);
  }
  /**
   * @param {StructStore} store
   */
  gc(t) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, e) {
    t.writeString(this.doc.guid), t.writeAny(this.opts);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 9;
  }
}
const Ra = (r) => new Ye(dn(r.readString(), r.readAny()));
class te {
  /**
   * @param {Object} embed
   */
  constructor(t) {
    this.embed = t;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.embed];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentEmbed}
   */
  copy() {
    return new te(this.embed);
  }
  /**
   * @param {number} offset
   * @return {ContentEmbed}
   */
  splice(t) {
    throw gt();
  }
  /**
   * @param {ContentEmbed} right
   * @return {boolean}
   */
  mergeWith(t) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(t, e) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(t) {
  }
  /**
   * @param {StructStore} store
   */
  gc(t) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, e) {
    t.writeJSON(this.embed);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 5;
  }
}
const Va = (r) => new te(r.readJSON());
class j {
  /**
   * @param {string} key
   * @param {Object} value
   */
  constructor(t, e) {
    this.key = t, this.value = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !1;
  }
  /**
   * @return {ContentFormat}
   */
  copy() {
    return new j(this.key, this.value);
  }
  /**
   * @param {number} _offset
   * @return {ContentFormat}
   */
  splice(t) {
    throw gt();
  }
  /**
   * @param {ContentFormat} _right
   * @return {boolean}
   */
  mergeWith(t) {
    return !1;
  }
  /**
   * @param {Transaction} _transaction
   * @param {Item} item
   */
  integrate(t, e) {
    const s = (
      /** @type {YText} */
      e.parent
    );
    s._searchMarker = null, s._hasFormatting = !0;
  }
  /**
   * @param {Transaction} transaction
   */
  delete(t) {
  }
  /**
   * @param {StructStore} store
   */
  gc(t) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, e) {
    t.writeKey(this.key), t.writeJSON(this.value);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 6;
  }
}
const Ua = (r) => new j(r.readKey(), r.readJSON());
class vr {
  /**
   * @param {Array<any>} arr
   */
  constructor(t) {
    this.arr = t;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.arr.length;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return this.arr;
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentJSON}
   */
  copy() {
    return new vr(this.arr);
  }
  /**
   * @param {number} offset
   * @return {ContentJSON}
   */
  splice(t) {
    const e = new vr(this.arr.slice(t));
    return this.arr = this.arr.slice(0, t), e;
  }
  /**
   * @param {ContentJSON} right
   * @return {boolean}
   */
  mergeWith(t) {
    return this.arr = this.arr.concat(t.arr), !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(t, e) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(t) {
  }
  /**
   * @param {StructStore} store
   */
  gc(t) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, e) {
    const s = this.arr.length;
    t.writeLen(s - e);
    for (let n = e; n < s; n++) {
      const i = this.arr[n];
      t.writeString(i === void 0 ? "undefined" : JSON.stringify(i));
    }
  }
  /**
   * @return {number}
   */
  getRef() {
    return 2;
  }
}
const za = (r) => {
  const t = r.readLen(), e = [];
  for (let s = 0; s < t; s++) {
    const n = r.readString();
    n === "undefined" ? e.push(void 0) : e.push(JSON.parse(n));
  }
  return new vr(e);
};
class Qt {
  /**
   * @param {Array<any>} arr
   */
  constructor(t) {
    this.arr = t;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.arr.length;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return this.arr;
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentAny}
   */
  copy() {
    return new Qt(this.arr);
  }
  /**
   * @param {number} offset
   * @return {ContentAny}
   */
  splice(t) {
    const e = new Qt(this.arr.slice(t));
    return this.arr = this.arr.slice(0, t), e;
  }
  /**
   * @param {ContentAny} right
   * @return {boolean}
   */
  mergeWith(t) {
    return this.arr = this.arr.concat(t.arr), !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(t, e) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(t) {
  }
  /**
   * @param {StructStore} store
   */
  gc(t) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, e) {
    const s = this.arr.length;
    t.writeLen(s - e);
    for (let n = e; n < s; n++) {
      const i = this.arr[n];
      t.writeAny(i);
    }
  }
  /**
   * @return {number}
   */
  getRef() {
    return 8;
  }
}
const Ha = (r) => {
  const t = r.readLen(), e = [];
  for (let s = 0; s < t; s++)
    e.push(r.readAny());
  return new Qt(e);
};
class vt {
  /**
   * @param {string} str
   */
  constructor(t) {
    this.str = t;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.str.length;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return this.str.split("");
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentString}
   */
  copy() {
    return new vt(this.str);
  }
  /**
   * @param {number} offset
   * @return {ContentString}
   */
  splice(t) {
    const e = new vt(this.str.slice(t));
    this.str = this.str.slice(0, t);
    const s = this.str.charCodeAt(t - 1);
    return s >= 55296 && s <= 56319 && (this.str = this.str.slice(0, t - 1) + "�", e.str = "�" + e.str.slice(1)), e;
  }
  /**
   * @param {ContentString} right
   * @return {boolean}
   */
  mergeWith(t) {
    return this.str += t.str, !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(t, e) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(t) {
  }
  /**
   * @param {StructStore} store
   */
  gc(t) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, e) {
    t.writeString(e === 0 ? this.str : this.str.slice(e));
  }
  /**
   * @return {number}
   */
  getRef() {
    return 4;
  }
}
const Na = (r) => new vt(r.readString()), Ba = [
  wa,
  ya,
  _a,
  Ia,
  Ea,
  xa,
  Da
], Pa = 0, ja = 1, Fa = 2, qa = 3, Ya = 4, Ja = 5, Wa = 6;
class It {
  /**
   * @param {AbstractType<any>} type
   */
  constructor(t) {
    this.type = t;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.type];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentType}
   */
  copy() {
    return new It(this.type._copy());
  }
  /**
   * @param {number} offset
   * @return {ContentType}
   */
  splice(t) {
    throw gt();
  }
  /**
   * @param {ContentType} right
   * @return {boolean}
   */
  mergeWith(t) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(t, e) {
    this.type._integrate(t.doc, e);
  }
  /**
   * @param {Transaction} transaction
   */
  delete(t) {
    let e = this.type._start;
    for (; e !== null; )
      e.deleted ? e.id.clock < (t.beforeState.get(e.id.client) || 0) && t._mergeStructs.push(e) : e.delete(t), e = e.right;
    this.type._map.forEach((s) => {
      s.deleted ? s.id.clock < (t.beforeState.get(s.id.client) || 0) && t._mergeStructs.push(s) : s.delete(t);
    }), t.changed.delete(this.type);
  }
  /**
   * @param {StructStore} store
   */
  gc(t) {
    let e = this.type._start;
    for (; e !== null; )
      e.gc(t, !0), e = e.right;
    this.type._start = null, this.type._map.forEach(
      /** @param {Item | null} item */
      (s) => {
        for (; s !== null; )
          s.gc(t, !0), s = s.left;
      }
    ), this.type._map = /* @__PURE__ */ new Map();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, e) {
    this.type._write(t);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 7;
  }
}
const Ka = (r) => new It(Ba[r.readTypeRef()](r)), wr = (r, t, e) => {
  const { client: s, clock: n } = t.id, i = new P(
    D(s, n + e),
    t,
    D(s, n + e - 1),
    t.right,
    t.rightOrigin,
    t.parent,
    t.parentSub,
    t.content.splice(e)
  );
  return t.deleted && i.markDeleted(), t.keep && (i.keep = !0), t.redone !== null && (i.redone = D(t.redone.client, t.redone.clock + e)), t.right = i, i.right !== null && (i.right.left = i), r._mergeStructs.push(i), i.parentSub !== null && i.right === null && i.parent._map.set(i.parentSub, i), t.length = e, i;
};
class P extends As {
  /**
   * @param {ID} id
   * @param {Item | null} left
   * @param {ID | null} origin
   * @param {Item | null} right
   * @param {ID | null} rightOrigin
   * @param {AbstractType<any>|ID|null} parent Is a type if integrated, is null if it is possible to copy parent from left or right, is ID before integration to search for it.
   * @param {string | null} parentSub
   * @param {AbstractContent} content
   */
  constructor(t, e, s, n, i, o, l, a) {
    super(t, a.getLength()), this.origin = s, this.left = e, this.right = n, this.rightOrigin = i, this.parent = o, this.parentSub = l, this.redone = null, this.content = a, this.info = this.content.isCountable() ? zs : 0;
  }
  /**
   * This is used to mark the item as an indexed fast-search marker
   *
   * @type {boolean}
   */
  set marker(t) {
    (this.info & Hr) > 0 !== t && (this.info ^= Hr);
  }
  get marker() {
    return (this.info & Hr) > 0;
  }
  /**
   * If true, do not garbage collect this Item.
   */
  get keep() {
    return (this.info & Us) > 0;
  }
  set keep(t) {
    this.keep !== t && (this.info ^= Us);
  }
  get countable() {
    return (this.info & zs) > 0;
  }
  /**
   * Whether this item was deleted or not.
   * @type {Boolean}
   */
  get deleted() {
    return (this.info & zr) > 0;
  }
  set deleted(t) {
    this.deleted !== t && (this.info ^= zr);
  }
  markDeleted() {
    this.info |= zr;
  }
  /**
   * Return the creator clientID of the missing op or define missing items and return null.
   *
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(t, e) {
    if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= J(e, this.origin.client))
      return this.origin.client;
    if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= J(e, this.rightOrigin.client))
      return this.rightOrigin.client;
    if (this.parent && this.parent.constructor === le && this.id.client !== this.parent.client && this.parent.clock >= J(e, this.parent.client))
      return this.parent.client;
    if (this.origin && (this.left = Qs(t, e, this.origin), this.origin = this.left.lastId), this.rightOrigin && (this.right = Bt(t, this.rightOrigin), this.rightOrigin = this.right.id), this.left && this.left.constructor === nt || this.right && this.right.constructor === nt)
      this.parent = null;
    else if (!this.parent)
      this.left && this.left.constructor === P && (this.parent = this.left.parent, this.parentSub = this.left.parentSub), this.right && this.right.constructor === P && (this.parent = this.right.parent, this.parentSub = this.right.parentSub);
    else if (this.parent.constructor === le) {
      const s = jr(e, this.parent);
      s.constructor === nt ? this.parent = null : this.parent = /** @type {ContentType} */
      s.content.type;
    }
    return null;
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(t, e) {
    if (e > 0 && (this.id.clock += e, this.left = Qs(t, t.doc.store, D(this.id.client, this.id.clock - 1)), this.origin = this.left.lastId, this.content = this.content.splice(e), this.length -= e), this.parent) {
      if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
        let s = this.left, n;
        if (s !== null)
          n = s.right;
        else if (this.parentSub !== null)
          for (n = /** @type {AbstractType<any>} */
          this.parent._map.get(this.parentSub) || null; n !== null && n.left !== null; )
            n = n.left;
        else
          n = /** @type {AbstractType<any>} */
          this.parent._start;
        const i = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
        for (; n !== null && n !== this.right; ) {
          if (o.add(n), i.add(n), tr(this.origin, n.origin)) {
            if (n.id.client < this.id.client)
              s = n, i.clear();
            else if (tr(this.rightOrigin, n.rightOrigin))
              break;
          } else if (n.origin !== null && o.has(jr(t.doc.store, n.origin)))
            i.has(jr(t.doc.store, n.origin)) || (s = n, i.clear());
          else
            break;
          n = n.right;
        }
        this.left = s;
      }
      if (this.left !== null) {
        const s = this.left.right;
        this.right = s, this.left.right = this;
      } else {
        let s;
        if (this.parentSub !== null)
          for (s = /** @type {AbstractType<any>} */
          this.parent._map.get(this.parentSub) || null; s !== null && s.left !== null; )
            s = s.left;
        else
          s = /** @type {AbstractType<any>} */
          this.parent._start, this.parent._start = this;
        this.right = s;
      }
      this.right !== null ? this.right.left = this : this.parentSub !== null && (this.parent._map.set(this.parentSub, this), this.left !== null && this.left.delete(t)), this.parentSub === null && this.countable && !this.deleted && (this.parent._length += this.length), Yi(t.doc.store, this), this.content.integrate(t, this), $s(
        t,
        /** @type {AbstractType<any>} */
        this.parent,
        this.parentSub
      ), /** @type {AbstractType<any>} */
      (this.parent._item !== null && /** @type {AbstractType<any>} */
      this.parent._item.deleted || this.parentSub !== null && this.right !== null) && this.delete(t);
    } else
      new nt(this.id, this.length).integrate(t, 0);
  }
  /**
   * Returns the next non-deleted item
   */
  get next() {
    let t = this.right;
    for (; t !== null && t.deleted; )
      t = t.right;
    return t;
  }
  /**
   * Returns the previous non-deleted item
   */
  get prev() {
    let t = this.left;
    for (; t !== null && t.deleted; )
      t = t.left;
    return t;
  }
  /**
   * Computes the last content address of this Item.
   */
  get lastId() {
    return this.length === 1 ? this.id : D(this.id.client, this.id.clock + this.length - 1);
  }
  /**
   * Try to merge two items
   *
   * @param {Item} right
   * @return {boolean}
   */
  mergeWith(t) {
    if (this.constructor === t.constructor && tr(t.origin, this.lastId) && this.right === t && tr(this.rightOrigin, t.rightOrigin) && this.id.client === t.id.client && this.id.clock + this.length === t.id.clock && this.deleted === t.deleted && this.redone === null && t.redone === null && this.content.constructor === t.content.constructor && this.content.mergeWith(t.content)) {
      const e = (
        /** @type {AbstractType<any>} */
        this.parent._searchMarker
      );
      return e && e.forEach((s) => {
        s.p === t && (s.p = this, !this.deleted && this.countable && (s.index -= this.length));
      }), t.keep && (this.keep = !0), this.right = t.right, this.right !== null && (this.right.left = this), this.length += t.length, !0;
    }
    return !1;
  }
  /**
   * Mark this Item as deleted.
   *
   * @param {Transaction} transaction
   */
  delete(t) {
    if (!this.deleted) {
      const e = (
        /** @type {AbstractType<any>} */
        this.parent
      );
      this.countable && this.parentSub === null && (e._length -= this.length), this.markDeleted(), dr(t.deleteSet, this.id.client, this.id.clock, this.length), $s(t, e, this.parentSub), this.content.delete(t);
    }
  }
  /**
   * @param {StructStore} store
   * @param {boolean} parentGCd
   */
  gc(t, e) {
    if (!this.deleted)
      throw ft();
    this.content.gc(t), e ? ta(t, this, new nt(this.id, this.length)) : this.content = new He(this.length);
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   * @param {number} offset
   */
  write(t, e) {
    const s = e > 0 ? D(this.id.client, this.id.clock + e - 1) : this.origin, n = this.rightOrigin, i = this.parentSub, o = this.content.getRef() & br | (s === null ? 0 : et) | // origin is defined
    (n === null ? 0 : Ct) | // right origin is defined
    (i === null ? 0 : Le);
    if (t.writeInfo(o), s !== null && t.writeLeftID(s), n !== null && t.writeRightID(n), s === null && n === null) {
      const l = (
        /** @type {AbstractType<any>} */
        this.parent
      );
      if (l._item !== void 0) {
        const a = l._item;
        if (a === null) {
          const d = Zl(l);
          t.writeParentInfo(!0), t.writeString(d);
        } else
          t.writeParentInfo(!1), t.writeLeftID(a.id);
      } else
        l.constructor === String ? (t.writeParentInfo(!0), t.writeString(l)) : l.constructor === le ? (t.writeParentInfo(!1), t.writeLeftID(l)) : ft();
      i !== null && t.writeString(i);
    }
    this.content.write(t, e);
  }
}
const un = (r, t) => Xa[t & br](r), Xa = [
  () => {
    ft();
  },
  // GC is not ItemContent
  Oa,
  // 1
  za,
  // 2
  Ta,
  // 3
  Na,
  // 4
  Va,
  // 5
  Ua,
  // 6
  Ka,
  // 7
  Ha,
  // 8
  Ra,
  // 9
  () => {
    ft();
  }
  // 10 - Skip is not ItemContent
], Ga = 10;
class ot extends As {
  get deleted() {
    return !0;
  }
  delete() {
  }
  /**
   * @param {Skip} right
   * @return {boolean}
   */
  mergeWith(t) {
    return this.constructor !== t.constructor ? !1 : (this.length += t.length, !0);
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(t, e) {
    ft();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, e) {
    t.writeInfo(Ga), A(t.restEncoder, this.length - e);
  }
  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(t, e) {
    return null;
  }
}
const pn = (
  /** @type {any} */
  typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : {}
), gn = "__ $YJS$ __";
pn[gn] === !0 && console.error("Yjs was already imported. This breaks constructor checks and will lead to issues! - https://github.com/yjs/yjs/issues/438");
pn[gn] = !0;
class Qa {
  /**
   * Creates an instance of CollaborateService.
   * @author tony001
   * @date 2024-08-06 11:08:59
   * @param {string} id
   * @param {string} mqttTopic
   * @param {string} token
   * @param {string} appId
   */
  constructor(t, e, s, n) {
    b(this, "collaborateUrl", "/portal/collaborate"), b(this, "readyState"), b(this, "evt", new qn()), b(this, "client"), b(this, "options", {
      // 超时时间
      connectTimeout: 6e3,
      // 认证信息
      clientId: Ht(),
      username: "",
      password: "",
      // 心跳时间
      keepalive: 60,
      clean: !0
    }), this.id = t, this.mqttTopic = e, this.token = s, this.appId = n, this.options.username = e, this.options.password = s, this.readyState = 0;
  }
  /**
   * 发送消息
   *
   * @author tony001
   * @date 2024-08-06 11:08:40
   * @param {(string | ArrayBufferLike | Blob | ArrayBufferView)} data
   */
  send(t) {
    ibiz.net.post("".concat(this.collaborateUrl, "/ROOM/").concat(this.id), { data: t });
  }
  /**
   * mqtt 连接
   *
   * @author tony001
   * @date 2024-08-05 19:08:17
   * @return {*}  {Promise<void>}
   */
  async connect() {
    const t = await import("./mqtt.min-c50220fb.es.js").then((n) => n.m), e = t.default ? t.default : t, { location: s } = window;
    this.client = e.connect(
      "ws://".concat(s.host).concat(ibiz.env.baseUrl, "/").concat(this.appId).concat(ibiz.env.mqttUrl),
      this.options
    ), this.client.on("connect", () => {
      this.client.subscribe(this.mqttTopic, (n) => {
        n || console.log("订阅成功", this.mqttTopic);
      }), this.readyState = 1, this.evt.emit("connect"), ibiz.log.debug("collaborate connect");
    }), this.client.on("error", (n) => {
      this.readyState = 3, this.evt.emit("error", n), ibiz.log.debug("collaborate error");
    }), this.client.on("message", (n, i) => {
      const o = JSON.parse(i.toString());
      o && o.data && o.data.data && o.data.data.data && this.evt.emit(
        "message",
        new Uint8Array(Object.values(o.data.data.data))
      ), ibiz.log.debug("collaborate message");
    }), this.client.on("reconnect", () => {
      this.readyState = 0, this.evt.emit("reconnect");
    }), this.client.on("close", () => {
      this.readyState = 3, this.evt.emit("close"), ibiz.log.debug("collaborate close");
    });
  }
  /**
   * 结束 mqtt 连接
   *
   * @author tony001
   * @date 2024-08-05 19:08:02
   */
  close() {
    var t;
    (t = this.client) == null || t.end(), this.evt.reset();
  }
}
const ce = () => /* @__PURE__ */ new Map(), fn = (r, t, e) => {
  let s = r.get(t);
  return s === void 0 && r.set(t, s = e()), s;
}, Za = String.fromCharCode, $a = (r) => r.toLowerCase(), tc = /^\s*/g, ec = (r) => r.replace(tc, ""), rc = /([A-Z])/g, ii = (r, t) => ec(r.replace(rc, (e) => "".concat(t).concat($a(e))));
typeof TextEncoder < "u" && new TextEncoder();
let Yr = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
Yr && Yr.decode(new Uint8Array()).length === 1 && (Yr = null);
const sc = (r) => r === void 0 ? null : r;
class ic {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  /**
   * @param {string} key
   * @param {any} newValue
   */
  setItem(t, e) {
    this.map.set(t, e);
  }
  /**
   * @param {string} key
   */
  getItem(t) {
    return this.map.get(t);
  }
}
let mn = new ic(), vn = !0;
try {
  typeof localStorage < "u" && (mn = localStorage, vn = !1);
} catch (r) {
}
const wn = mn, nc = (r) => vn || addEventListener(
  "storage",
  /** @type {any} */
  r
), Ne = typeof process < "u" && process.release && /node|io\.js/.test(process.release.name), bn = typeof window < "u" && !Ne;
let ut;
const oc = () => {
  if (ut === void 0)
    if (Ne) {
      ut = ce();
      const r = process.argv;
      let t = null;
      for (let e = 0; e < r.length; e++) {
        const s = r[e];
        s[0] === "-" ? (t !== null && ut.set(t, ""), t = s) : t !== null && (ut.set(t, s), t = null);
      }
      t !== null && ut.set(t, "");
    } else
      typeof location == "object" ? (ut = ce(), (location.search || "?").slice(1).split("&").forEach((r) => {
        if (r.length !== 0) {
          const [t, e] = r.split("=");
          ut.set("--".concat(ii(t, "-")), e), ut.set("-".concat(ii(t, "-")), e);
        }
      })) : ut = ce();
  return ut;
}, lc = (r) => oc().has(r), ac = (r) => sc(Ne ? process.env[r.toUpperCase()] : wn.getItem(r)), cc = (r) => lc("--" + r) || ac(r) !== null;
cc("production");
const hc = Math.floor, yn = (r, t) => r < t ? r : t, dc = (r, t) => r > t ? r : t, uc = Math.pow, kn = 128, lr = 127, pc = Number.MAX_SAFE_INTEGER;
class gc {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
}
const lt = () => new gc(), xs = (r) => {
  let t = r.cpos;
  for (let e = 0; e < r.bufs.length; e++)
    t += r.bufs[e].length;
  return t;
}, it = (r) => {
  const t = new Uint8Array(xs(r));
  let e = 0;
  for (let s = 0; s < r.bufs.length; s++) {
    const n = r.bufs[s];
    t.set(n, e), e += n.length;
  }
  return t.set(Mn(r.cbuf.buffer, 0, r.cpos), e), t;
}, ni = (r, t) => {
  const e = r.cbuf.length;
  r.cpos === e && (r.bufs.push(r.cbuf), r.cbuf = new Uint8Array(e * 2), r.cpos = 0), r.cbuf[r.cpos++] = t;
}, tt = (r, t) => {
  for (; t > lr; )
    ni(r, kn | lr & t), t = hc(t / 128);
  ni(r, lr & t);
}, fc = new Uint8Array(3e4);
fc.length / 3;
const mc = (r, t) => {
  const e = r.cbuf.length, s = r.cpos, n = yn(e - s, t.length), i = t.length - n;
  r.cbuf.set(t.subarray(0, n), s), r.cpos += n, i > 0 && (r.bufs.push(r.cbuf), r.cbuf = new Uint8Array(dc(e * 2, i)), r.cbuf.set(t.subarray(n)), r.cpos = i);
}, Ae = (r, t) => {
  tt(r, t.byteLength), mc(r, t);
};
class vc {
  /**
   * @param {Uint8Array} uint8Array Binary data to decode
   */
  constructor(t) {
    this.arr = t, this.pos = 0;
  }
}
const wc = (r) => new vc(r), bc = (r, t) => {
  const e = Mn(r.arr.buffer, r.pos + r.arr.byteOffset, t);
  return r.pos += t, e;
}, yc = (r) => bc(r, Cn(r)), Cn = (r) => {
  let t = 0, e = 1;
  for (; ; ) {
    const s = r.arr[r.pos++];
    if (t = t + (s & lr) * e, e *= 128, s < kn)
      return t;
    if (t > pc)
      throw new Error("Integer out of range!");
  }
}, kc = (r) => new Uint8Array(r), Mn = (r, t, e) => new Uint8Array(r, t, e), Cc = (r) => new Uint8Array(r), Mc = (r) => {
  let t = "";
  for (let e = 0; e < r.byteLength; e++)
    t += Za(r[e]);
  return btoa(t);
}, Sc = (r) => Buffer.from(r.buffer, r.byteOffset, r.byteLength).toString("base64"), _c = (r) => {
  const t = atob(r), e = kc(t.length);
  for (let s = 0; s < t.length; s++)
    e[s] = t.charCodeAt(s);
  return e;
}, Ec = (r) => {
  const t = Buffer.from(r, "base64");
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}, Ic = bn ? Mc : Sc, Ac = bn ? _c : Ec, xc = /* @__PURE__ */ new Map();
class Dc {
  /**
   * @param {string} room
   */
  constructor(t) {
    this.room = t, this.onmessage = null, nc((e) => e.key === t && this.onmessage !== null && this.onmessage({ data: Ac(e.newValue || "") }));
  }
  /**
   * @param {ArrayBuffer} buf
   */
  postMessage(t) {
    wn.setItem(this.room, Ic(Cc(t)));
  }
}
const Lc = typeof BroadcastChannel > "u" ? Dc : BroadcastChannel, Ds = (r) => fn(xc, r, () => {
  const t = /* @__PURE__ */ new Set(), e = new Lc(r);
  return e.onmessage = (s) => t.forEach((n) => n(s.data, "broadcastchannel")), {
    bc: e,
    subs: t
  };
}), Tc = (r, t) => Ds(r).subs.add(t), Oc = (r, t) => Ds(r).subs.delete(t), ne = (r, t, e = null) => {
  const s = Ds(r);
  s.bc.postMessage(t), s.subs.forEach((n) => n(t, e));
}, as = Date.now, Sn = 0, Ls = 1, _n = 2, cs = (r, t) => {
  A(r, Sn);
  const e = Gl(t);
  Q(r, e);
}, En = (r, t, e) => {
  A(r, Ls), Q(r, Jl(t, e));
}, Rc = (r, t, e) => En(t, e, Z(r)), In = (r, t, e) => {
  try {
    Fl(t, Z(r), e);
  } catch (s) {
    console.error("Caught error while handling a Yjs update", s);
  }
}, Vc = (r, t) => {
  A(r, _n), Q(r, t);
}, Uc = In, zc = (r, t, e, s) => {
  const n = _(r);
  switch (n) {
    case Sn:
      Rc(r, t, e);
      break;
    case Ls:
      In(r, e, s);
      break;
    case _n:
      Uc(r, e, s);
      break;
    default:
      throw new Error("Unknown message type");
  }
  return n;
}, Hc = 0, Nc = (r, t, e) => {
  switch (_(r)) {
    case Hc:
      e(t, zt(r));
  }
}, Jr = 3e4;
class Bc extends So {
  /**
   * @param {Y.Doc} doc
   */
  constructor(t) {
    super(), this.doc = t, this.clientID = t.clientID, this.states = /* @__PURE__ */ new Map(), this.meta = /* @__PURE__ */ new Map(), this._checkInterval = /** @type {any} */
    setInterval(() => {
      const e = hr();
      this.getLocalState() !== null && Jr / 2 <= e - /** @type {{lastUpdated:number}} */
      this.meta.get(this.clientID).lastUpdated && this.setLocalState(this.getLocalState());
      const s = [];
      this.meta.forEach((n, i) => {
        i !== this.clientID && Jr <= e - n.lastUpdated && this.states.has(i) && s.push(i);
      }), s.length > 0 && Ts(this, s, "timeout");
    }, St(Jr / 10)), t.on("destroy", () => {
      this.destroy();
    }), this.setLocalState({});
  }
  destroy() {
    this.emit("destroy", [this]), this.setLocalState(null), super.destroy(), clearInterval(this._checkInterval);
  }
  /**
   * @return {Object<string,any>|null}
   */
  getLocalState() {
    return this.states.get(this.clientID) || null;
  }
  /**
   * @param {Object<string,any>|null} state
   */
  setLocalState(t) {
    const e = this.clientID, s = this.meta.get(e), n = s === void 0 ? 0 : s.clock + 1, i = this.states.get(e);
    t === null ? this.states.delete(e) : this.states.set(e, t), this.meta.set(e, {
      clock: n,
      lastUpdated: hr()
    });
    const o = [], l = [], a = [], d = [];
    t === null ? d.push(e) : i == null ? t != null && o.push(e) : (l.push(e), Ie(i, t) || a.push(e)), (o.length > 0 || a.length > 0 || d.length > 0) && this.emit("change", [{ added: o, updated: a, removed: d }, "local"]), this.emit("update", [{ added: o, updated: l, removed: d }, "local"]);
  }
  /**
   * @param {string} field
   * @param {any} value
   */
  setLocalStateField(t, e) {
    const s = this.getLocalState();
    s !== null && this.setLocalState({
      ...s,
      [t]: e
    });
  }
  /**
   * @return {Map<number,Object<string,any>>}
   */
  getStates() {
    return this.states;
  }
}
const Ts = (r, t, e) => {
  const s = [];
  for (let n = 0; n < t.length; n++) {
    const i = t[n];
    if (r.states.has(i)) {
      if (r.states.delete(i), i === r.clientID) {
        const o = (
          /** @type {MetaClientState} */
          r.meta.get(i)
        );
        r.meta.set(i, {
          clock: o.clock + 1,
          lastUpdated: hr()
        });
      }
      s.push(i);
    }
  }
  s.length > 0 && (r.emit("change", [{ added: [], updated: [], removed: s }, e]), r.emit("update", [{ added: [], updated: [], removed: s }, e]));
}, xe = (r, t, e = r.states) => {
  const s = t.length, n = Pe();
  A(n, s);
  for (let i = 0; i < s; i++) {
    const o = t[i], l = e.get(o) || null, a = (
      /** @type {MetaClientState} */
      r.meta.get(o).clock
    );
    A(n, o), A(n, a), Wt(n, JSON.stringify(l));
  }
  return at(n);
}, Pc = (r, t, e) => {
  const s = $t(t), n = hr(), i = [], o = [], l = [], a = [], d = _(s);
  for (let c = 0; c < d; c++) {
    const h = _(s);
    let u = _(s);
    const g = JSON.parse(zt(s)), f = r.meta.get(h), y = r.states.get(h), w = f === void 0 ? 0 : f.clock;
    (w < u || w === u && g === null && r.states.has(h)) && (g === null ? h === r.clientID && r.getLocalState() != null ? u++ : r.states.delete(h) : r.states.set(h, g), r.meta.set(h, {
      clock: u,
      lastUpdated: n
    }), f === void 0 && g !== null ? i.push(h) : f !== void 0 && g === null ? a.push(h) : g !== null && (Ie(g, y) || l.push(h), o.push(h)));
  }
  (i.length > 0 || l.length > 0 || a.length > 0) && r.emit("change", [{
    added: i,
    updated: l,
    removed: a
  }, e]), (i.length > 0 || o.length > 0 || a.length > 0) && r.emit("update", [{
    added: i,
    updated: o,
    removed: a
  }, e]);
}, jc = () => /* @__PURE__ */ new Set(), Fc = Array.from;
class qc {
  constructor() {
    this._observers = ce();
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  on(t, e) {
    fn(this._observers, t, jc).add(e);
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  once(t, e) {
    const s = (...n) => {
      this.off(t, s), e(...n);
    };
    this.on(t, s);
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  off(t, e) {
    const s = this._observers.get(t);
    s !== void 0 && (s.delete(e), s.size === 0 && this._observers.delete(t));
  }
  /**
   * Emit a named event. All registered event listeners that listen to the
   * specified name will receive the event.
   *
   * @todo This should catch exceptions
   *
   * @param {N} name The event name.
   * @param {Array<any>} args The arguments that are applied to the event listener.
   */
  emit(t, e) {
    return Fc((this._observers.get(t) || ce()).values()).forEach((s) => s(...e));
  }
  destroy() {
    this._observers = ce();
  }
}
const Yc = (r, t) => {
  const e = [];
  for (const s in r)
    e.push(t(r[s], s));
  return e;
}, Jc = (r) => Yc(r, (t, e) => "".concat(encodeURIComponent(e), "=").concat(encodeURIComponent(t))).join("&"), Yt = 0, An = 3, he = 1, Wc = 2, Je = [];
Je[Yt] = (r, t, e, s, n) => {
  tt(r, Yt);
  const i = zc(
    t,
    r,
    e.doc,
    e
  );
  s && i === Ls && !e.synced && (e.synced = !0);
};
Je[An] = (r, t, e, s, n) => {
  tt(r, he), Ae(
    r,
    xe(
      e.awareness,
      Array.from(e.awareness.getStates().keys())
    )
  );
};
Je[he] = (r, t, e, s, n) => {
  Pc(
    e.awareness,
    yc(t),
    e
  );
};
Je[Wc] = (r, t, e, s, n) => {
  Nc(
    t,
    e.doc,
    (i, o) => Kc(e, o)
  );
};
const oi = 3e4, Kc = (r, t) => console.warn("Permission denied to access ".concat(r.url, ".\n").concat(t)), xn = (r, t, e) => {
  const s = wc(t), n = lt(), i = Cn(s), o = r.messageHandlers[i];
  return (
    /** @type {any} */
    o ? o(n, s, r, e, i) : console.error("Unable to compute message"), n
  );
}, Dn = (r) => {
  if (r.shouldConnect && r.ws === null) {
    const t = r._WS;
    r.ws = t, r.wsconnecting = !0, r.wsconnected = !1, r.synced = !1, t.evt.on("message", (e) => {
      r.wsLastMessageReceived = as();
      const s = xn(r, e, !0);
      xs(s) > 1 && t.send(it(s));
    }), t.evt.on("error", (e) => {
      r.emit("connection-error", [e, r]);
    }), t.evt.on("close", (e) => {
      r.emit("connection-close", [e, r]), r.ws = null, r.wsconnecting = !1, r.wsconnected ? (r.wsconnected = !1, r.synced = !1, Ts(
        r.awareness,
        Array.from(r.awareness.getStates().keys()).filter(
          (s) => s !== r.doc.clientID
        ),
        r
      ), r.emit("status", [
        {
          status: "disconnected"
        }
      ])) : r.wsUnsuccessfulReconnects++, setTimeout(
        Dn,
        yn(
          uc(2, r.wsUnsuccessfulReconnects) * 100,
          r.maxBackoffTime
        ),
        r
      );
    }), t.evt.on("connect", () => {
      r.wsLastMessageReceived = as(), r.wsconnecting = !1, r.wsconnected = !0, r.wsUnsuccessfulReconnects = 0, r.emit("status", [
        {
          status: "connected"
        }
      ]);
      const e = lt();
      if (tt(e, Yt), cs(e, r.doc), t.send(it(e)), r.awareness.getLocalState() !== null) {
        const s = lt();
        tt(s, he), Ae(
          s,
          xe(r.awareness, [
            r.doc.clientID
          ])
        ), t.send(it(s));
      }
    }), r.emit("status", [
      {
        status: "connecting"
      }
    ]);
  }
}, Wr = (r, t) => {
  const e = r.ws;
  r.wsconnected && e && e.readyState === 1 && e.send(t), r.bcconnected && ne(r.bcChannel, t, r);
};
class Xc extends qc {
  /**
   * @param {string} serverUrl
   * @param {string} roomname
   * @param {Y.Doc} doc
   * @param {object} opts
   * @param {boolean} [opts.connect]
   * @param {awarenessProtocol.Awareness} [opts.awareness]
   * @param {Object<string,string>} [opts.params] specify url parameters
   * @param {Array<string>} [opts.protocols] specify websocket protocols
   * @param {typeof Object} [opts.WebSocketPolyfill] Optionall provide a Object polyfill
   * @param {number} [opts.resyncInterval] Request server state every `resyncInterval` milliseconds
   * @param {number} [opts.maxBackoffTime] Maximum amount of time to wait before trying to reconnect (we try to reconnect using exponential backoff)
   * @param {boolean} [opts.disableBc] Disable cross-tab BroadcastChannel communication
   */
  constructor(t, e, s, {
    connect: n = !0,
    awareness: i = new Bc(s),
    params: o = {},
    protocols: l = [],
    WebSocketPolyfill: a,
    resyncInterval: d = -1,
    maxBackoffTime: c = 2500,
    disableBc: h = !1
  } = {}) {
    for (super(); t[t.length - 1] === "/"; )
      t = t.slice(0, t.length - 1);
    this.serverUrl = t, this.bcChannel = t + "/" + e, this.maxBackoffTime = c, this.params = o, this.protocols = l, this.roomname = e, this.doc = s, this._WS = a, this.awareness = i, this.wsconnected = !1, this.wsconnecting = !1, this.bcconnected = !1, this.disableBc = h, this.wsUnsuccessfulReconnects = 0, this.messageHandlers = Je.slice(), this._synced = !1, this.ws = null, this.wsLastMessageReceived = 0, this.shouldConnect = n, this._resyncInterval = 0, d > 0 && (this._resyncInterval = /** @type {any} */
    setInterval(() => {
      if (this.ws && this.ws.readyState === 1) {
        const u = lt();
        tt(u, Yt), cs(u, s), this.ws.send(it(u));
      }
    }, d)), this._bcSubscriber = (u, g) => {
      if (g !== this) {
        const f = xn(this, new Uint8Array(u), !1);
        xs(f) > 1 && ne(this.bcChannel, it(f), this);
      }
    }, this._updateHandler = (u, g) => {
      if (g !== this) {
        const f = lt();
        tt(f, Yt), Vc(f, u), Wr(this, it(f));
      }
    }, this.doc.on("update", this._updateHandler), this._awarenessUpdateHandler = ({ added: u, updated: g, removed: f }, y) => {
      const w = u.concat(g).concat(f), E = lt();
      tt(E, he), Ae(
        E,
        xe(i, w)
      ), Wr(this, it(E));
    }, this._exitHandler = () => {
      Ts(
        this.awareness,
        [s.clientID],
        "app closed"
      );
    }, Ne && typeof process < "u" && process.on("exit", this._exitHandler), i.on("update", this._awarenessUpdateHandler), this._checkInterval = /** @type {any} */
    setInterval(() => {
      this.wsconnected && oi < as() - this.wsLastMessageReceived && this.ws.close();
    }, oi / 10), n && this.connect();
  }
  get url() {
    const t = Jc(this.params);
    return this.serverUrl + "/" + this.roomname + (t.length === 0 ? "" : "?" + t);
  }
  /**
   * @type {boolean}
   */
  get synced() {
    return this._synced;
  }
  set synced(t) {
    this._synced !== t && (this._synced = t, this.emit("synced", [t]), this.emit("sync", [t]));
  }
  destroy() {
    this._resyncInterval !== 0 && clearInterval(this._resyncInterval), clearInterval(this._checkInterval), this.disconnect(), Ne && typeof process < "u" && process.off("exit", this._exitHandler), this.awareness.off("update", this._awarenessUpdateHandler), this.doc.off("update", this._updateHandler), super.destroy();
  }
  connectBc() {
    if (this.disableBc)
      return;
    this.bcconnected || (Tc(this.bcChannel, this._bcSubscriber), this.bcconnected = !0);
    const t = lt();
    tt(t, Yt), cs(t, this.doc), ne(this.bcChannel, it(t), this);
    const e = lt();
    tt(e, Yt), En(e, this.doc), ne(this.bcChannel, it(e), this);
    const s = lt();
    tt(s, An), ne(
      this.bcChannel,
      it(s),
      this
    );
    const n = lt();
    tt(n, he), Ae(
      n,
      xe(this.awareness, [
        this.doc.clientID
      ])
    ), ne(
      this.bcChannel,
      it(n),
      this
    );
  }
  disconnectBc() {
    const t = lt();
    tt(t, he), Ae(
      t,
      xe(
        this.awareness,
        [this.doc.clientID],
        /* @__PURE__ */ new Map()
      )
    ), Wr(this, it(t)), this.bcconnected && (Oc(this.bcChannel, this._bcSubscriber), this.bcconnected = !1);
  }
  disconnect() {
    this.shouldConnect = !1, this.disconnectBc(), this.ws !== null && this.ws.close();
  }
  connect() {
    this.shouldConnect = !0, !this.wsconnected && this.ws === null && (Dn(this), this.connectBc());
  }
}
class Gc {
  /**
   * Creates an instance of CollaborateRoom.
   * @author tony001
   * @date 2024-08-05 18:08:36
   * @param {string} id
   * @param {IData} doc
   */
  constructor(t, e, s, n) {
    b(this, "id"), b(this, "name"), b(this, "doc"), b(this, "context"), b(this, "params"), b(this, "connectionProvider"), this.context = t, this.params = e, this.id = s, this.doc = n;
    const i = ibiz.appData.mqtttopic.split("/");
    this.name = "/".concat(i[1], "/collaborate/ROOM/").concat(this.id);
  }
  /**
   * 创建当前实例
   *
   * @author tony001
   * @date 2024-08-06 10:08:20
   * @return {*}  {Promise<void>}
   */
  async created() {
    const t = ibiz.hub.getApp(this.context.srfappid).model.appId || ibiz.env.appId, e = "ws://".concat(window.location.host).concat(ibiz.env.baseUrl, "/").concat(t).concat(ibiz.env.mqttUrl), s = new Qa(
      this.id,
      this.name,
      Jn(),
      t
    );
    await s.connect(), this.connectionProvider = new Xc(
      e,
      this.name,
      this.doc,
      { WebSocketPolyfill: s, resyncInterval: 5e3 }
    );
  }
  /**
   * 销毁当前实例
   *
   * @author tony001
   * @date 2024-08-06 10:08:08
   * @return {*}  {Promise<void>}
   */
  async destroy() {
    var t;
    (t = this.connectionProvider) == null || t.destroy();
  }
}
class Qc {
  constructor() {
    b(this, "collaborateMap", /* @__PURE__ */ new Map());
  }
  /**
   * 获取应用标识
   *
   * @author tony001
   * @date 2024-08-06 14:08:27
   * @protected
   * @param {IContext} context
   * @return {*}  {string}
   */
  getAppId(t) {
    return ibiz.hub.getApp(t.srfappid).model.appId || ibiz.env.appId;
  }
  /**
   * 创建协同房间
   *
   * @author tony001
   * @date 2024-08-06 14:08:37
   * @param {IContext} context 上下文
   * @param {IParams} params 视图参数
   * @param {string} id 业务数据主键
   * @param {IData} doc 文档实例对象
   * @return {*}  {Promise<CollaborateRoom>}
   */
  async create(t, e, s, n) {
    const i = new Gc(t, e, s, n);
    await i.created();
    const o = this.getAppId(t);
    return this.collaborateMap.has(o) || this.collaborateMap.set(o, /* @__PURE__ */ new Map()), this.collaborateMap.get(o).set(i.id, i), i;
  }
  /**
   * 获取协同房间
   *
   * @author tony001
   * @date 2024-08-06 10:08:17
   * @param {IContext} context 上下文
   * @param {IParams} params 视图参数
   * @param {string} id 业务数据主键
   * @return {*}  {Promise<CollaborateRoom>}
   */
  async get(t, e, s) {
    const n = this.getAppId(t);
    if (!this.collaborateMap.has(n))
      throw new Error(
        ibiz.i18n.t("runtime.utils.collaborateManager.invalidCollaborateRoom", {
          id: s
        })
      );
    const i = this.collaborateMap.get(n);
    if (i && i.has(s))
      return i.get(s);
    throw new Error(
      ibiz.i18n.t("runtime.utils.collaborateManager.invalidCollaborateRoom", {
        id: s
      })
    );
  }
  /**
   * 销毁协同房间
   *
   * @author tony001
   * @date 2024-08-06 10:08:08
   * @param {IContext} context 上下文
   * @param {IParams} params 视图参数
   * @param {string} id 业务数据主键
   * @return {*}  {Promise<void>}
   */
  async destroy(t, e, s) {
    const n = this.getAppId(t);
    if (this.collaborateMap.has(n)) {
      const i = this.collaborateMap.get(n);
      i && i.has(s) && (i.get(s).destroy(), i.delete(s));
    }
  }
}
class Zc {
  constructor(t) {
    b(this, "config"), b(this, "yDoc", null), b(this, "collaborateRoom", null), b(this, "contentChangeDebounceTimer", null), b(this, "isYjsInitiatedUpdate", !1), b(this, "collaborateManager", null), b(this, "scrollTimer"), this.config = {
      enableCursorSync: !0,
      editorId: "vditor-bridge-".concat(Date.now()),
      userInfo: {
        id: t.context.srfuserid || "user-".concat(Date.now()),
        name: t.context.srfusername || "匿名用户",
        color: "#".concat(Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"))
      },
      ...t
    }, this.config.enableCursorSync && (this.collaborateManager = new Qc(), this.initYjsDoc(), this.bindVditorContentChange());
  }
  /**
   * 当前用户信息（包含name，光标状态等信息）
   *
   * @readonly
   * @type {IData}
   * @memberof VditorYjsBridge
   */
  get userState() {
    return {
      user: this.config.userInfo,
      cursor: this.calcCursorRealPosition()
    };
  }
  /**
   * 当前房间所有用户信息
   *
   * @readonly
   * @type {IData[]}
   * @memberof VditorYjsBridge
   */
  get allUsers() {
    return this.yDoc ? this.yDoc.getMap("vditor-data").get("users") : [];
  }
  /**
   * 初始化 Yjs 文档
   */
  initYjsDoc() {
    this.yDoc = new ve();
    const t = this.yDoc.getMap("vditor-data");
    t.observe((e) => {
      const s = e.changes.keys;
      this.handleCollabDataChange(s, t);
    });
  }
  /**
   * 绑定 Vditor 内容变更监听
   */
  bindVditorContentChange() {
    if (!this.config.vditor)
      return;
    const t = this.config.vditor.vditor.ir.element || this.config.vditor.vditor.element;
    t.addEventListener(
      "input",
      this.vditorContentChangeListener.bind(this)
    ), t.addEventListener("blur", this.vditorBlurListener.bind(this)), t.addEventListener(
      "paste",
      this.vditorContentChangeListener.bind(this)
    ), t.addEventListener(
      "click",
      this.updateLocalCursorState.bind(this)
    );
  }
  /**
   * 初始化协同房间（连接 MQTT 同步服务）
   */
  async init() {
    if (this.config.enableCursorSync) {
      if (!this.collaborateManager || !this.yDoc)
        throw new Error("协同依赖初始化失败，无法创建房间");
      try {
        this.collaborateRoom = await this.collaborateManager.create(
          this.config.context,
          this.config.params,
          this.config.roomName,
          this.yDoc
        ), this.collaborateRoom.connectionProvider.on("status", (t) => {
          t === "connected" && setTimeout(() => {
            this.updateLocalCursorState(), this.allUsers.length > 1 ? this.syncYjsToVditor() : this.syncVditorToYjs(!0);
          }, 1e3);
        }), this.bindEditorScroll();
      } catch (t) {
        throw console.error("[VditorYjsBridge] 协同房间连接失败：", t), t;
      }
    }
  }
  /**
   * 处理 Yjs 数据变更
   *
   * @private
   * @param {Map<string, IData>} changedKeys
   * @param {Y.Map<any>} collabAllData
   * @memberof VditorYjsBridge
   */
  handleCollabDataChange(t, e) {
    if (t.has("content") && this.syncYjsToVditor(), t.has("users")) {
      const s = e.get("users");
      this.renderRemoteCursors(s);
    }
  }
  /**
   * vdito 内容变更
   *
   * @private
   * @return {*}  {void}
   * @memberof VditorYjsBridge
   */
  vditorContentChangeListener() {
    this.isYjsInitiatedUpdate || (this.contentChangeDebounceTimer && clearTimeout(this.contentChangeDebounceTimer), this.contentChangeDebounceTimer = setTimeout(() => {
      this.syncVditorToYjs(), this.updateLocalCursorState();
    }, 300));
  }
  /**
   * 计算光标在编辑器中的相对位置以及对应的选区数据
   *
   * @return {*}  {({
   *     cursorOffset: number | null;
   *     selection: IData | null;
   *   })}
   * @memberof VditorYjsBridge
   */
  calcCursorRealPosition() {
    const t = this.calcVditorSelection(this.config.vditor.vditor);
    let e = this.getcursorOffset(this.config.vditor.vditor);
    return !e && e !== 0 && t && (e = t.start), { cursorOffset: e, selection: t };
  }
  /**
   * 更新用户光标状态和编辑内容
   *
   * @memberof VditorYjsBridge
   */
  updateOtherClient() {
    this.config.enableCursorSync && this.vditorContentChangeListener();
  }
  /**
   * 获取 Vditor 选区的字符偏移 + 坐标数据（用于跨端传输）
   * @param {Vditor} vditor Vditor 实例
   * @returns {IData|null} 包含字符偏移、坐标、文本等信息
   */
  calcVditorSelection(t) {
    var e;
    const s = t.element.querySelector(".vditor-content"), n = window.getSelection();
    if (!(n != null && n.rangeCount) || !(s != null && s.contains(n.anchorNode)))
      return null;
    const i = n.getRangeAt(0), o = document.createRange();
    o.selectNodeContents(s), o.setEnd(i.startContainer, i.startOffset);
    const l = o.toString().length;
    o.setEnd(i.endContainer, i.endOffset);
    const a = o.toString().length;
    return {
      start: l,
      end: a,
      userId: (e = this.config.userInfo) == null ? void 0 : e.id
      // 用于区分不同用户
    };
  }
  /**
   * 获取无选区时的焦点字符偏移量
   *
   * @param {VditorInstance} vditor
   * @return {*}  {(number | null)}
   * @memberof VditorYjsBridge
   */
  getcursorOffset(t) {
    const e = t.element.querySelector(".vditor-content"), s = window.getSelection();
    if (!(s != null && s.rangeCount) || !(e != null && e.contains(s.anchorNode)))
      return null;
    const n = s.getRangeAt(0);
    if (!n.collapsed)
      return null;
    const i = document.createRange();
    return i.selectNodeContents(e), i.setEnd(n.startContainer, n.startOffset), i.toString().length;
  }
  /**
   * 绘制多个用户光标选区遮罩
   *
   * @param {VditorInstance} vditor
   * @param {(IData | null)} selectionData
   * @return {*}  {void}
   * @memberof VditorYjsBridge
   */
  renderMultiSegmentMask(t, e) {
    if (!e)
      return;
    const { start: s, end: n, userId: i = "default" } = e, o = t.element.querySelector(".vditor-content");
    if (!o)
      return;
    const l = o.textContent;
    if (o.querySelectorAll(
      ".selection-mask-".concat(i)
    ).forEach((c) => c.remove()), s < 0 || n > l.length || s >= n)
      return;
    getComputedStyle(o).position === "static" && (o.style.position = "relative");
    let a = 0;
    function d(c) {
      if (c.nodeType !== Node.TEXT_NODE) {
        Array.from(c.childNodes).forEach((z) => d(z));
        return;
      }
      const h = c.textContent.length, u = a, g = a + h, f = Math.max(s, u), y = Math.min(n, g);
      if (f >= y) {
        a = g;
        return;
      }
      const w = f - u, E = y - u, T = document.createRange();
      try {
        T.setStart(c, w), T.setEnd(c, E);
      } catch (z) {
        a = g;
        return;
      }
      const K = T.getClientRects(), X = o.getBoundingClientRect();
      Array.from(K).forEach((z) => {
        if (z.width <= 0 || z.height <= 0)
          return;
        const H = document.createElement("div");
        H.className = "selection-mask selection-mask-".concat(i), Object.assign(H.style, {
          left: "".concat(z.left - X.left, "px"),
          // 字符实际左坐标
          top: "".concat(z.top - X.top, "px"),
          // 字符实际上坐标
          width: "".concat(z.width, "px"),
          // 字符区间实际宽度（非整行）
          height: "".concat(z.height, "px")
          // 字符行高
        }), o.appendChild(H);
      }), a = g;
    }
    d(o);
  }
  /**
   * 绘制单个用户光标
   *
   * @param {VditorInstance} vditor
   * @param {IData} user
   * @return {*}  {void}
   * @memberof VditorYjsBridge
   */
  rendercursorFocus(t, e) {
    const { cursorOffset: s } = e.cursor, n = e.user.id, i = t.element.querySelector(".vditor-content");
    if (!i)
      return;
    const o = i.textContent, l = i.querySelector(".cursor-mask-".concat(n));
    if (l && l.remove(), s < 0 || s > o.length)
      return;
    getComputedStyle(i).position === "static" && (i.style.position = "relative");
    let a = 0, d = null, c = 0;
    function h(E) {
      if (d || E.nodeType !== Node.TEXT_NODE) {
        Array.from(E.childNodes).forEach((z) => h(z));
        return;
      }
      const T = E.textContent, K = a, X = a + T.length;
      if (s <= X) {
        d = E, c = s - K;
        return;
      }
      a = X;
    }
    if (h(i), !d)
      return;
    const u = document.createRange();
    u.setStart(d, c), u.collapse(!0);
    const g = u.getBoundingClientRect(), f = i.getBoundingClientRect(), y = document.createElement("div");
    y.className = "vditor-cursor-item cursor-mask-".concat(n), Object.assign(y.style, {
      left: "".concat(g.left - f.left, "px"),
      top: "".concat(g.top - f.top, "px"),
      height: "".concat(g.height, "px"),
      // 行高
      backgroundColor: e.user.color
    });
    const w = document.createElement("span");
    w.classList.add("vditor-cursor-label"), w.style.backgroundColor = e.user.color, w.textContent = e.user.name, y.appendChild(w), i.appendChild(y);
  }
  /**
   * 清除所有遮罩(包括选中与光标)
   *
   * @param {*} vditor
   */
  clearAllSelectionMasks(t) {
    const e = t.element.querySelector(".vditor-content"), s = e == null ? void 0 : e.querySelectorAll(".selection-mask");
    s == null || s.forEach((i) => i.remove());
    const n = e == null ? void 0 : e.querySelectorAll(".vditor-cursor-item");
    n == null || n.forEach((i) => i.remove());
  }
  /**
   * 同步 Vditor 内容到 Yjs
   *
   * @param {boolean} [isInit=false] 是否为初始化同步（强制覆盖）
   * @return {*}  {void}
   * @memberof VditorYjsBridge
   */
  syncVditorToYjs(t = !1) {
    if (!(!this.config.vditor || !this.yDoc || this.isYjsInitiatedUpdate && !t || !this.config.enableCursorSync))
      try {
        const e = this.config.vditor.getValue() || "";
        this.yDoc.getMap("vditor-data").set("content", e);
      } catch (e) {
        console.error("[VditorYjsBridge] 同步 Vditor 到 Yjs 失败：", e);
      }
  }
  /**
   * 同步 Yjs 内容到 Vditor（Yjs 文档变更时触发）
   *
   * @private
   * @return {*}  {void}
   * @memberof VditorYjsBridge
   */
  syncYjsToVditor() {
    if (!(!this.config.vditor || !this.yDoc))
      try {
        this.isYjsInitiatedUpdate = !0;
        const t = this.yDoc.getMap("vditor-data").get("content") || "";
        if (this.config.vditor.getValue() !== t) {
          const e = this.calcCursorRealPosition();
          this.config.vditor.setValue(t), this.restoreVditorFocus(this.config.vditor.vditor, e);
        }
        setTimeout(() => {
          this.isYjsInitiatedUpdate = !1;
        }, 100);
      } catch (t) {
        console.error("[VditorYjsBridge] 同步 Yjs 到 Vditor 失败：", t), this.isYjsInitiatedUpdate = !1;
      }
  }
  /**
   * 恢复 Vditor 焦点
   *
   * @param {VditorInstance} vditor
   * @param {{
   *       cursorOffset: number;
   *       start?: number;
   *       end?: number;
   *     }} focusData
   * @return {*}  {void}
   * @memberof VditorYjsBridge
   */
  restoreVditorFocus(t, e) {
    if (!e)
      return;
    const s = t.element.querySelector(".vditor-content");
    if (!s)
      return;
    const n = s.textContent || "", { cursorOffset: i } = e;
    if (i === null || i < 0 || i > n.length)
      return;
    let o = 0, l = null, a = 0;
    const d = (u) => {
      if (l || u.nodeType !== Node.TEXT_NODE) {
        Array.from(u.childNodes).forEach((E) => d(E));
        return;
      }
      const g = u, f = g.textContent || "", y = o, w = o + f.length;
      if (i <= w) {
        l = g, a = i - y;
        return;
      }
      o = w;
    };
    if (d(s), !l)
      return;
    const c = document.createRange(), h = window.getSelection();
    if (e.selection) {
      const { start: u, end: g } = e.selection;
      if (u !== void 0 && g !== void 0) {
        let f = null, y = 0, w = null, E = 0;
        o = 0;
        const T = (K) => {
          if (K.nodeType !== Node.TEXT_NODE) {
            Array.from(K.childNodes).forEach(
              (ct) => T(ct)
            );
            return;
          }
          const X = K, z = X.textContent || "", H = o, wt = o + z.length;
          !f && u >= H && u <= wt && (f = X, y = u - H), !w && g >= H && g <= wt && (w = X, E = g - H), o = wt;
        };
        T(s), f && w && (c.setStart(f, y), c.setEnd(w, E));
      } else
        c.setStart(l, a), c.collapse(!0);
    }
    h.removeAllRanges(), h.addRange(c), this.config.vditor.focus();
  }
  /**
   * 渲染远程用户光标
   *
   * @private
   * @param {IData[]} [items=[]]
   * @return {*}  {void}
   * @memberof VditorYjsBridge
   */
  renderRemoteCursors(t = []) {
    if (!this.config.vditor || !t.length) {
      this.clearAllSelectionMasks(this.config.vditor.vditor);
      return;
    }
    t.forEach((e) => {
      !e.user || !e.cursor || e.user.id === this.userState.user.id || (this.renderMultiSegmentMask(
        this.config.vditor.vditor,
        e.cursor.selection
      ), this.rendercursorFocus(this.config.vditor.vditor, e));
    });
  }
  /**
   * 处理编辑器滚动事件
   *
   * @private
   * @memberof VditorYjsBridge
   */
  handleVditorScroll() {
    clearTimeout(this.scrollTimer), this.scrollTimer = setTimeout(() => {
      this.renderRemoteCursors(this.allUsers);
    }, 20);
  }
  /**
   * 绑定编辑器滚动事件，动态设置远程信息
   *
   * @private
   * @memberof VditorYjsBridge
   */
  bindEditorScroll() {
    const t = this.config.vditor.vditor.ir.element;
    t && t.addEventListener(
      "scroll",
      this.handleVditorScroll.bind(this)
    );
  }
  /**
   * 更新本地用户光标状态
   */
  updateLocalCursorState() {
    var t;
    if (!(!this.config.enableCursorSync || !this.config.vditor))
      try {
        const e = (t = this.yDoc) == null ? void 0 : t.getMap("vditor-data");
        if (!e)
          return;
        let s = e.get("users");
        s || (s = []);
        const n = s == null ? void 0 : s.findIndex(
          (i) => {
            var o;
            return i.user.id === ((o = this.config.userInfo) == null ? void 0 : o.id);
          }
        );
        !n && n !== 0 || n === -1 ? s.push(this.userState) : s[n] = this.userState, e.set("users", s);
      } catch (e) {
        console.error("[VditorYjsBridge] 更新本地光标状态失败：", e);
      }
  }
  /**
   * 失焦时移除当前用户光标
   *
   * @memberof VditorYjsBridge
   */
  vditorBlurListener() {
    var t;
    if (!(!this.config.enableCursorSync || !this.config.vditor))
      try {
        const e = (t = this.yDoc) == null ? void 0 : t.getMap("vditor-data");
        if (!e)
          return;
        let s = e.get("users");
        s || (s = []);
        const n = s == null ? void 0 : s.findIndex(
          (i) => {
            var o;
            return i.user.id === ((o = this.config.userInfo) == null ? void 0 : o.id);
          }
        );
        n >= 0 && s.splice(n, 1), e.set("users", s);
      } catch (e) {
        console.error(" 移除失焦光标失败", e);
      }
  }
  /**
   * 销毁桥接实例（释放资源）
   */
  async destroy() {
    var t;
    if (this.contentChangeDebounceTimer && (clearTimeout(this.contentChangeDebounceTimer), this.contentChangeDebounceTimer = null), this.vditorContentChangeListener && this.config.vditor) {
      const e = this.config.vditor.vditor.ir.element || this.config.vditor.vditor.element;
      e.removeEventListener(
        "input",
        this.vditorContentChangeListener.bind(this)
      ), e.removeEventListener(
        "blur",
        this.vditorBlurListener.bind(this)
      ), e.removeEventListener(
        "paste",
        this.updateLocalCursorState.bind(this)
      ), e.removeEventListener(
        "click",
        this.updateLocalCursorState.bind(this)
      ), e.removeEventListener(
        "scroll",
        this.handleVditorScroll.bind(this)
      );
    }
    this.config.enableCursorSync && this.clearAllSelectionMasks(this.config.vditor.vditor), this.collaborateRoom && (await ((t = this.collaborateManager) == null ? void 0 : t.destroy(
      this.config.context,
      this.config.params,
      this.config.roomName
    )), this.collaborateRoom = null), this.yDoc && (this.yDoc.destroy(), this.yDoc = null), console.log(
      "[VditorYjsBridge] 桥接实例已销毁，房间：".concat(this.config.roomName)
    );
  }
}
const Kr = /* @__PURE__ */ ci({
  name: "IBizVditor",
  props: {
    value: String,
    controller: us,
    data: Object,
    disabled: Boolean,
    readonly: {
      type: Boolean,
      default: !1
    },
    autoFocus: {
      type: Boolean,
      default: !1
    },
    overflowMode: {
      type: String
    },
    controlParams: {
      type: Object,
      required: !1
    }
  },
  emits: li(),
  setup(r, {
    emit: t,
    slots: e
  }) {
    var s;
    const n = ds("vditor"), i = r.controller, o = "vditor-".concat(Ht()), l = C(), a = C(!1), d = C(!1), c = C(""), h = C(!1), u = C(!0), g = C(!1), f = C(!0), y = C(!1), w = C(!0), E = C(!1), T = C(!1);
    let K = "left";
    const X = C(!1), z = C(!1), H = C(null), wt = C({}), ct = C(""), {
      zIndex: At
    } = ar(), {
      UIStore: We
    } = ar(), be = C(We.theme), ye = C(""), Pt = ibiz.util.file.getUploadHeaders(), Ke = C({
      ...Pt
    });
    let ee = !1;
    const bt = C(!1), jt = C(!1), G = C(!1), xt = C(null), re = C(!1), Dt = C(), ke = C(""), Ce = C([]), {
      editorParams: F
    } = i;
    F && (F.enablenoaccess && (ee = ((s = i == null ? void 0 : i.editorParams) == null ? void 0 : s.enablenoaccess) === "true"), F.enableEdit && (h.value = !0, bt.value = i.toBoolean(F.enableEdit)), F.enableFullScreen && (jt.value = i.toBoolean(F.enableFullScreen)), F.WIDESCREENMODE && (u.value = i.toBoolean(F.WIDESCREENMODE)), F.ENABLESHORTCUT && (f.value = i.toBoolean(F.ENABLESHORTCUT)), F.SHOWWIDESCREEN && (g.value = i.toBoolean(F.SHOWWIDESCREEN)), F.SHOWOUTLINE && (T.value = i.toBoolean(F.SHOWOUTLINE)), F.TOOLBARALIGN && (K = F.TOOLBARALIGN)), r.readonly && (h.value = !0);
    const ht = hi(() => {
      let v = "MD";
      return r.data && r.data[i.valueItem] && (v = r.data[i.valueItem]), v;
    }), Xe = () => {
      var v, k, S;
      if (!re.value || !i.vditor)
        return;
      let O = ((v = r.data) == null ? void 0 : v.srfuf) === Bn.CREATE ? "draft" : (k = r.data) == null ? void 0 : k.srfkey;
      (S = i.params) != null && S.srfmarkopendatakey && (O = i.params.srfmarkopendatakey), i.collaborateKey && (O = i.collaborateKey), xt.value = new Zc({
        vditor: i.vditor,
        context: i.context,
        params: i.params,
        enableCursorSync: i.enableRealtime,
        roomName: O,
        editorId: o
      }), xt.value.init();
    };
    Vt(() => {
      var v;
      return (v = i.parent.form) == null ? void 0 : v.state.isLoaded;
    }, (v) => {
      v && (re.value = !0, Xe());
    }, {
      immediate: !0
    });
    const Er = (v, k) => {
      const S = {
        ...i.editorParams
      };
      return S.exportparams && (S.exportParams = JSON.parse(S.exportparams)), k && k.folder && (S.osscat = k.folder), ibiz.util.file.calcFileUpDownUrl(i.context, i.params, v, S).downloadUrl;
    };
    let rt;
    const Ir = async () => {
      const {
        appDataEntityId: v
      } = i.model;
      if (!v || !i.deACMode)
        return;
      const k = At.increment();
      rt = await ibiz.aiChatUtil.getAIChat();
      const {
        containerOptions: S,
        chatOptions: O
      } = await ibiz.aiChatUtil.getEditorExAIChatParams(i.editorParams, i.context, i.params, r.data, i.deACMode, {
        chatInstance: rt,
        view: i.view,
        ctrl: i.ctrl
      }), R = await ibiz.aiChatUtil.getAIResourceOptions(i.context, i.params);
      rt.create({
        resourceOptions: R,
        containerOptions: {
          zIndex: k,
          ...S
        },
        chatOptions: {
          caption: i.deACMode.logicName,
          context: {
            ...i.context
          },
          params: {
            ...i.params,
            srfactag: i.deACMode.codeName
          },
          appDataEntityId: v,
          ...O,
          action: (M, U) => {
            M === "backfill" && t("change", U.realcontent);
          }
        }
      });
    }, Ft = async () => {
      const v = i.vditor.vditor[i.vditor.vditor.currentMode];
      i.maxHeight && v && (E.value = v.element.scrollHeight > v.element.offsetHeight && v.element.scrollHeight > i.maxHeight);
    }, Ge = (v) => {
      v.element.querySelectorAll("img").forEach((k) => {
        k.addEventListener("load", () => {
          Ft();
        });
      });
    }, Ar = async (v) => {
      if (ke.value = v, Ce.value = [v], await oe(), Dt.value) {
        const {
          container: k
        } = Dt.value.$refs;
        k && k.children[0].click();
      }
    }, Me = (v, k = !1) => {
      if (!i.vditor || !i.vditor.vditor || !i.vditor.vditor.lute)
        return;
      const S = Gn(v);
      let O = ht.value;
      S !== "TEXT" && (O = S);
      let R = v;
      r.readonly && R.includes("&") && (R = R.replace(/&reg/g, "&amp;reg").replace(/&copy/g, "&amp;copy").replace(/&trade/g, "&amp;trade"));
      const M = i.vditor.vditor[i.vditor.vditor.currentMode];
      O === "HTML" ? M && (!ct.value || M.element.innerHTML !== ct.value || k) && (i.vditor.setValue(""), i.vditor.insertValue(R), i.vditor.vditor.outline.render(i.vditor.vditor), Ge(M), Ft()) : (!ct.value || M.element.innerHTML !== ct.value || k) && (i.vditor.setValue(R), Ge(M), Ft());
    }, se = () => {
      if (ht.value === "MD")
        t("change", i.vditor.getValue());
      else if (ht.value === "HTML") {
        let v = i.vditor.getHTML();
        v = i.handleHardBreak(v), t("change", v);
      }
    }, xr = () => {
      const {
        vditor: v
      } = i.vditor, {
        outline: k
      } = v;
      if (k.element) {
        const S = k.element.querySelector(".vditor-outline__title");
        if (S) {
          const O = document.createElement("span");
          O.innerHTML = io, O.addEventListener("click", () => {
            k.toggle(i.vditor.vditor, !1);
          }), S.appendChild(O);
        }
      }
    }, Dr = () => {
      if (h.value || !g.value)
        return;
      const {
        vditor: v
      } = i.vditor, k = (R) => {
        const M = document.createElement("div");
        M.classList.add(n.e("custom-toolbar"));
        const U = document.createElement("div");
        U.innerHTML = to, U.title = "宽屏模式", U.classList.add("widescreen"), U.addEventListener("click", () => {
          u.value = !0;
        });
        const N = document.createElement("div");
        N.innerHTML = eo, N.title = "标准模式", N.classList.add("collapse"), N.addEventListener("click", () => {
          u.value = !1;
        }), M.appendChild(U), M.appendChild(N), R.prepend(M);
      }, S = v.element.querySelector(".vditor-ir");
      S && k(S);
      const O = v.element.querySelector(".vditor-wysiwyg");
      O && k(O);
    }, Qe = async (v, k) => {
      const S = Er(v, k);
      let O = S.replace("%fileId%", k.id);
      const R = k.filename;
      if (ibiz.config.common.enableDownloadTicket) {
        const M = await ibiz.util.file.getDownloadTicket(i.context, i.params, v, {
          fileId: k.id
        }, i.downloadTicketParams);
        if (M && M.ticket)
          return O = S.replace("%fileId%", M.ticket), {
            url: O,
            alt: R
          };
      }
      return {
        url: O,
        alt: R
      };
    }, Lr = () => {
      const v = [], {
        QUOTEURL: k,
        USERURL: S
      } = i.editorParams;
      S && v.push({
        key: "@",
        hint: async (M) => {
          a.value = !0;
          try {
            return await i.mentionController.getUsers({
              data: r.data,
              query: M
            });
          } finally {
            a.value = !1;
          }
        }
      }), k && v.push({
        key: "#",
        hint: async (M) => {
          a.value = !0;
          try {
            return await i.markerController.getMarkers({
              data: r.data,
              query: M
            });
          } finally {
            a.value = !1;
          }
        }
      });
      const O = e.editorSwitchMenu ? 128 : 8, R = {
        theme: be.value,
        height: i.maxHeight || i.parent.model.height || 600,
        placeholder: i.placeHolder,
        cache: {
          enable: !1
        },
        toolbarConfig: {
          pin: !1,
          ellipsis: K === "left",
          offsetWidth: O
        },
        toolbar: [...fi],
        fullscreen: {
          index: At
        },
        preview: {
          maxWidth: 960,
          transform: (M) => i.transformHtml(M)
        },
        link: {
          click: (M) => {
            const U = M.textContent;
            i.openUrl(U);
          }
        },
        upload: {
          url: ye.value,
          // 自定义增加 http  header
          headers: Ke.value,
          fieldName: "file",
          filename: (M) => M,
          success: (M, U) => {
            const N = JSON.parse(U);
            ibiz.config.common.enableDownloadTicket && N.ticket && ibiz.util.file.setDownloadTicket(N.id, N.ticket), Qe(r.data || {}, N).then((qt) => {
              var yt;
              const {
                url: $e,
                alt: Rn
              } = qt;
              i.vditor.insertValue("![".concat(Rn, "](").concat($e, ")")), (yt = xt.value) == null || yt.syncVditorToYjs();
            });
          },
          error: (M) => {
            const U = M || ibiz.i18n.t("util.uploadManager.failed");
            ibiz.message.error(U);
          }
        },
        image: {
          preview: (M) => {
            Ar(M.src);
          }
        },
        input: () => {
          Ft();
        },
        focus: () => {
          t("focus");
        },
        imageFocus: (M) => {
          if (!h.value) {
            H.value = M, z.value = !0;
            const U = i.vditor.vditor[i.vditor.vditor.currentMode], {
              scrollTop: N
            } = U.element;
            wt.value = {
              top: "".concat(M.offsetTop - N + 56 - 40, "px"),
              left: "".concat(M.offsetLeft, "px"),
              zIndex: At.zIndex + 2
            };
          }
        },
        renderAfter: () => {
          Ft();
        },
        blur: () => {
          t("blur");
          const M = i.vditor.vditor[i.vditor.vditor.currentMode];
          M && (ct.value = M.element.innerHTML);
          const {
            hint: U
          } = i.vditor.vditor;
          U.element.style.display === "none" && !bt.value && se();
          let N = "";
          ht.value === "MD" ? N = i.vditor.getValue() : ht.value === "HTML" && (N = i.vditor.getHTML(), N = i.handleHardBreak(N)), c.value = N;
          let qt = !1;
          const yt = i.vditor.getEditorRange();
          if (yt) {
            const $e = yt.startContainer;
            $e.nodeType === 1 && $e.getAttribute("data-type") === "img" && (qt = !0);
          }
          z.value = qt;
        },
        select: () => {
          var M;
          if (!h.value) {
            X.value = !0;
            const U = i.vditor.getCursorPosition();
            wt.value = {
              top: "".concat(U.top + 90, "px"),
              left: "".concat(U.left, "px"),
              zIndex: At.zIndex + 2
            }, (M = xt.value) == null || M.updateOtherClient();
          }
        },
        unSelect: () => {
          var M;
          X.value = !1;
          let U = !1;
          const N = getSelection();
          if (!h.value && N && N.rangeCount > 0) {
            const qt = (M = getSelection()) == null ? void 0 : M.getRangeAt(0);
            if (qt) {
              const yt = qt.startContainer;
              yt && yt.nodeType !== 3 && yt.getAttribute("data-type") === "img" && (U = !0);
            }
          }
          z.value = U;
        },
        fullScreen: () => {
          G.value = !0;
        },
        unFullScreen: () => {
          G.value = !1;
        },
        after: () => {
          d.value = !0, h.value && i.vditor.disabled(), xr(), Dr(), i.renderAfter(), r.value && Me(r.value), Xe();
        },
        hint: {
          extend: v
        },
        cdn: cr.dir("vditor")
      };
      if (i.templateActionTag && (R.toolbar.unshift("|"), R.toolbar.unshift({
        name: "template",
        tipPosition: "n",
        tip: "模板",
        className: "vditor-toolbar__template",
        icon: so,
        click() {
          i.doInLineAIUIAction(i.templateActionTag, i.context.srfappid).then(() => {
            se();
          });
        }
      })), jt.value) {
        const M = R.toolbar.indexOf("fullscreen");
        M !== -1 && R.toolbar.splice(M, 1);
      }
      i.chatCompletion && (R.toolbar.unshift("|"), R.toolbar.unshift({
        name: "AI",
        tipPosition: "n",
        tip: "AI询问",
        className: "vditor-toolbar__ai",
        icon: mi,
        click() {
          Ir();
        }
      })), Yn(R, {
        outline: {
          enable: T.value,
          position: "right"
        }
      }), i.vditor = new window.Vditor(l.value, {
        ...R
      });
    };
    Vt(() => r.value, (v) => {
      if (v)
        Me(v), c.value = v;
      else if (c.value = "", i.vditor) {
        const k = i.vditor.vditor[i.vditor.vditor.currentMode];
        k.element.innerHTML = "";
      }
    }, {
      immediate: !0
    }), Vt(() => r.data, (v) => {
      if (v) {
        const k = {
          ...i.editorParams,
          enableNoAccess: ee
        };
        k.uploadparams && (k.uploadParams = JSON.parse(k.uploadparams));
        const S = ibiz.util.file.calcFileUpDownUrl(i.context, i.params, v, k);
        ye.value = S.uploadUrl;
      }
    }, {
      immediate: !0,
      deep: !0
    }), Vt(() => ht.value, () => {
      i.formatType = ht.value;
    }, {
      immediate: !0
    }), di(() => {
      l.value && Lr();
    }), ui(() => {
      xt.value && xt.value.destroy();
    });
    const Tr = (v) => {
      v.preventDefault();
      const k = ibiz.inLineAIUtil.calcContextMenus(i.deACMode, (M) => {
        i.doInLineAIUIAction(M, i.model.appId);
      }), S = At.increment(), O = i.vditor.getCursorPosition(), R = i.vditor.vditor.element.getBoundingClientRect();
      ibiz.inLineAIUtil.showContextMenus(
        // 编辑器的左侧距离+选区距离编辑器左侧距离
        R.x + O.left,
        // 编辑器的上方距离+选区距离编辑器上方距离+悬浮工具栏高度
        R.y + O.top + 123,
        k,
        {
          zIndex: S,
          onClose: () => {
            At.decrement();
          }
        }
      );
    }, m = (v, k) => {
      if (v.preventDefault(), i.vditor && i.vditor.vditor.toolbar) {
        const S = i.vditor.vditor.toolbar.elements || {};
        S[k] && S[k].children[0] && S[k].children[0].click();
      }
    }, I = (v, k) => {
      if (v.preventDefault(), !H.value)
        return;
      z.value = !1;
      const S = H.value.parentElement, O = S == null ? void 0 : S.children[2];
      if (k === "remove")
        S && S.remove();
      else if (k === "100")
        H.value.removeAttribute("style"), H.value.alt = H.value.alt.split("#")[0], O && (O.textContent = H.value.alt);
      else {
        H.value.style.width = "".concat(k, "%");
        const R = H.value.alt.split("#")[0];
        H.value.alt = "".concat(R, "#").concat(k, "%"), O && (O.textContent = H.value.alt);
      }
      se();
    }, x = (v) => {
      const k = v.shortcut.split("/");
      return p("div", {
        class: n.e("shortcut-mark")
      }, [k.map((S) => p("div", {
        class: n.e("shortcut-mark-item")
      }, [S]))]);
    }, B = (v) => v.map((k) => k.type === "group" ? p("div", {
      class: n.e("shortcut-group")
    }, [p("span", null, [k.name]), B(k.children)]) : p("div", {
      class: n.e("shortcut")
    }, [p("span", null, [k.name]), x(k)])), q = () => !E.value || !h.value ? null : w.value ? p("div", {
      class: n.e("toggle"),
      onClick: () => {
        w.value = !w.value;
      }
    }, [Ot("展开更多 "), p(pt("ion-icon"), {
      name: "arrow-down-outline"
    }, null)]) : p("div", {
      class: n.e("toggle"),
      onClick: () => {
        w.value = !w.value;
      }
    }, [Ot("收起更多 "), p(pt("ion-icon"), {
      name: "arrow-up-outline"
    }, null)]), L = () => {
      if (h.value = !h.value, !h.value)
        i.vditor.enable(), w.value = !0;
      else {
        const v = i.vditor.vditor[i.vditor.vditor.currentMode];
        v && v.element.scroll(0, 0), i.vditor.disabled();
      }
    }, st = () => {
      var v;
      let {
        value: k
      } = r;
      ht.value === "HTML" && (k = (v = r.value) == null ? void 0 : v.replace(/<p data-block="0">​<\/p>$/g, "")), k !== c.value ? ibiz.confirm.warning({
        title: "确认取消",
        desc: "确定要取消编辑吗？取消编辑将无法保存修改的内容，且不能找回。"
      }).then((S) => {
        S && (r.value ? (Me(r.value, !0), c.value = r.value) : c.value = "", L());
      }) : L();
    }, Lt = () => {
      h.value = !0;
      const v = i.vditor.vditor[i.vditor.vditor.currentMode];
      v && v.element.scroll(0, 0), i.vditor.disabled(), se(), G.value && (G.value = !1);
    }, Tt = () => bt.value && !h.value ? p("div", {
      class: [n.b("footer"), {
        [n.b("footer-dialog")]: G.value
      }]
    }, [p("div", {
      class: n.be("footer", "cancel"),
      onClick: () => st()
    }, [Ot("取消")]), p("div", {
      class: n.be("footer", "save"),
      onClick: () => Lt()
    }, [Ot("保存")])]) : null, Ze = () => {
      G.value = !G.value, X.value = !1;
      const {
        vditor: v
      } = i.vditor, {
        outline: k
      } = v;
      k.toggle(i.vditor.vditor, G.value);
    }, Or = () => jt.value ? G.value ? p("span", {
      title: "退出全屏",
      onClick: () => Ze()
    }, [mo]) : p("span", {
      title: "全屏查看",
      onClick: () => Ze()
    }, [fo]) : null, Ln = () => bt.value || jt.value ? p("div", {
      class: n.e("header-toolbar")
    }, [bt.value && h.value ? p("span", {
      title: "编辑",
      onClick: () => L()
    }, [go]) : null, Or()]) : null, Os = (v) => {
      if (Dt.value) {
        const {
          container: k
        } = Dt.value.$refs;
        if (k) {
          const S = k.querySelector(".el-image-viewer__wrapper");
          S == null || S[v]("keydown", Tn);
        }
      }
    }, Tn = async (v) => {
      (v.key === "Escape" || v.keyCode === 27) && (v.stopPropagation(), v.preventDefault(), await oe(), Os("removeEventListener"), Ce.value = []);
    }, On = async () => {
      await oe(), Os("addEventListener");
    };
    return {
      ns: n,
      editorId: o,
      vditorRef: l,
      previewRef: Dt,
      loading: a,
      isInit: d,
      collapse: w,
      widescreenMode: u,
      enableEdit: bt,
      readonlyState: h,
      isFullScreen: G,
      showShortcut: y,
      enableShortcut: f,
      showHoverToolbar: X,
      showImageToolbar: z,
      hoverToolbarStyle: wt,
      handleInlineAiClick: Tr,
      handleToolbarClick: m,
      handleImageToolbarClick: I,
      renderShortcut: B,
      renderToggle: q,
      renderFooter: Tt,
      renderHeaderToolbar: Ln,
      renderPreview: () => p(pt("el-image"), {
        class: n.e("preview"),
        ref: "previewRef",
        "zoom-rate": 1.1,
        src: ke.value,
        "preview-src-list": Ce.value,
        "hide-on-click-modal": !0,
        onShow: On,
        fit: "cover"
      }, null)
    };
  },
  render() {
    var r;
    let t = {};
    return this.collapse && this.controller.maxHeight && (t = this.ns.cssVarBlock({
      "max-height": "".concat(this.controller.maxHeight, "px")
    })), p("div", {
      class: [this.ns.b("container"), this.ns.is("enable-edit", this.enableEdit), this.ns.is("fullScreen", this.isFullScreen), this.ns.is("disabled", this.readonlyState), this.ns.is("readonly", this.readonly), this.ns.is("widescreen", !this.readonlyState && this.widescreenMode), this.ns.is("loading", !this.isInit)],
      style: t
    }, [this.renderHeaderToolbar(), pi(p("div", {
      id: this.editorId,
      ref: "vditorRef",
      class: ["vditor", this.ns.b()]
    }, null), [[gi("loading"), this.loading]]), this.renderToggle(), this.renderFooter(), this.renderPreview(), !this.readonlyState && this.enableShortcut ? p("div", {
      class: this.ns.e("shortcut-icon"),
      onClick: () => {
        this.showShortcut = !0;
      }
    }, [ro]) : null, p("div", {
      class: [this.ns.e("slider"), this.ns.is("show", this.showShortcut)]
    }, [p("div", {
      class: this.ns.e("slider-header")
    }, [p("div", {
      class: this.ns.e("slider-title")
    }, [Ot("快捷键")]), p(pt("ion-icon"), {
      name: "close-outline",
      onClick: () => {
        this.showShortcut = !1;
      }
    }, null)]), p("div", {
      class: this.ns.e("slider-content")
    }, [this.renderShortcut(wo)])]), this.showHoverToolbar ? p("div", {
      style: this.hoverToolbarStyle,
      class: this.ns.e("hover-toolbar")
    }, [(r = this.controller) != null && r.chatCompletion ? p("button", {
      class: "vditor-inline-ai",
      title: "AI",
      onClick: this.handleInlineAiClick
    }, [vi]) : null, p("button", {
      class: "vditor-bold",
      title: "加粗",
      onClick: (e) => this.handleToolbarClick(e, "bold")
    }, [Xr]), p("button", {
      class: "vditor-italic",
      title: "斜体",
      onClick: (e) => this.handleToolbarClick(e, "italic")
    }, [Gr]), p("button", {
      class: "vditor-strike",
      title: "删除线",
      onClick: (e) => this.handleToolbarClick(e, "strike")
    }, [Qr]), p("button", {
      class: "vditor-link",
      title: "链接",
      onClick: (e) => this.handleToolbarClick(e, "link")
    }, [Zr])]) : null, this.showImageToolbar ? p("div", {
      style: this.hoverToolbarStyle,
      class: this.ns.e("hover-toolbar")
    }, [p("button", {
      onClick: (e) => this.handleImageToolbarClick(e, "30")
    }, [Ot("30%")]), p("button", {
      onClick: (e) => this.handleImageToolbarClick(e, "50")
    }, [Ot("50%")]), p("button", {
      onClick: (e) => this.handleImageToolbarClick(e, "100")
    }, [Ot("100%")]), p("button", {
      title: "删除图片",
      onClick: (e) => this.handleImageToolbarClick(e, "remove")
    }, [p(pt("ion-icon"), {
      name: "trash-outline"
    }, null)])]) : null, this.$slots.editorSwitchMenu ? this.$slots.editorSwitchMenu() : null]);
  }
}), $c = Fn(Kr, function(r) {
  r.component(Kr.name, Kr), r.component(Vs.name, Vs), Se("HTMLEDITOR_VDITOR", () => new _e()), Se(
    "HTMLEDITOR_VDITOR_COMMENT_WIKI",
    () => new _e("COMMENT")
  ), Se(
    "HTMLEDITOR_VDITOR_COMMENT_LIBARAY",
    () => new _e("COMMENT")
  ), Se(
    "HTMLEDITOR_VDITOR_COMMENT_PROJECT",
    () => new _e("COMMENT")
  ), Se(
    "HTMLEDITOR_VDITOR_COMMENT_PRODUCT",
    () => new _e("COMMENT")
  );
}), oh = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(r) {
    r.use($c);
  }
};
export {
  $c as IBizVditorComment,
  oh as default
};
