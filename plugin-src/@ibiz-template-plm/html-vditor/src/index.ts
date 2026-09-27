import './style.css';
var Hi = Object.defineProperty;
var $i = (n, t, e) => t in n ? Hi(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var y = (n, t, e) => ($i(n, typeof t != "symbol" ? t + "" : t, e), e);
import { ScriptFactory as ds, OpenAppViewCommand as Bi, PluginStaticResource as zi, EditorController as Ni, convertNavData as Fi, getDeACMode as Pi, UIActionUtil as ji, Srfuf as Yi, registerEditorProvider as Me } from "@ibiz-template/runtime";
import { useNamespace as us, getEditorEmits as ur, useUIStore as an, useClickOutside as qi, withInstall as Ji } from "@ibiz-template/vue3-util";
import { createUUID as Ht, QXEvent as Wi } from "qx-util";
import { clone as fr } from "ramda";
import { RuntimeError as Rn, getToken as Gi, mergeInLeft as Ki } from "@ibiz-template/core";
import { ref as k, createVNode as f, defineComponent as gr, computed as pr, watch as Vt, onMounted as mr, onUnmounted as wr, withDirectives as vr, resolveDirective as br, resolveComponent as gt, nextTick as ie, createTextVNode as xt } from "vue";
class Te {
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
    for (let c = 0; c < t.length; c++)
      if (this.isChineseCharacter(t))
        e = t.charCodeAt(c) + ((e << 5) - e), e = e & e;
      else {
        const h = t.charCodeAt(c);
        e += h.toString(16);
      }
    const s = String(e).substring(0, 6);
    let r = parseInt(s.substring(0, 2), 16), i = parseInt(s.substring(2, 4), 16), o = parseInt(s.substring(4, 6), 16);
    r < 0 && (r = 10), i < 0 && (i = 10), o < 0 && (o = 10);
    const l = "#".concat(r.toString(16).padStart(2, "0")).concat(i.toString(16).padStart(2, "0")).concat(o.toString(16).padStart(2, "0"));
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
        const i = t.split("").find((l) => /[a-zA-Z]/.test(l)) || "", o = t.split("").find((l) => /[\u4E00-\u9FA5]/.test(l)) || "";
        return "".concat(i).concat(o).toLowerCase();
      }
      return /[a-zA-Z]/.test(t) ? t.split("").filter((i) => /[a-zA-Z]/.test(i)).slice(0, 2).join("").toUpperCase() : /[\u4E00-\u9FA5]/.test(t) ? t.split("").filter((i) => /[\u4E00-\u9FA5]/.test(i)).slice(-2).join("") : t.replaceAll(" ", "").substring(0, 2);
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
      const r = decodeURIComponent(atob(s));
      return '<span class="emoji-tag">'.concat(r, "</span>");
    }).replaceAll(
      /<span data-w-e-type="emoji" class='emoji'>(.+?)<\/span>/g,
      (e, s) => {
        const r = decodeURIComponent(atob(s));
        return "<span data-w-e-type=\"emoji\" class='emoji'>".concat(r, "</span>");
      }
    );
  }
}
const Xi = (n, t) => {
  if (!n)
    return null;
  const e = JSON.parse(n);
  if (e.length === 0)
    return null;
  const { downloadUrl: s } = ibiz.util.file.calcFileUpDownUrl(
    t.context,
    t.params,
    t.editorParams
  );
  return s.replace("%fileId%", e[0].id);
}, Un = (n) => n.replace(/<\?xml(.+?)>/, "").replaceAll("\n", "").replaceAll(/>([\s]*)</g, "><"), Zi = (n = "") => {
  if (typeof n != "string")
    return "TEXT";
  const t = n.trim();
  if (!t)
    return "TEXT";
  const e = t.replaceAll(
    /<span style="(.+?)">(.*?)<\/span>/g,
    (l, c, h) => h
  ), s = /<(?:html|head|body|div|p|br|hr|h[1-6]|ul|ol|li|table|tr|td|a\s|img\s|script|style)[\s>\\/]/i, r = (e.match(s) ? 2 : 0) + (e.includes("</") ? 1 : 0) + (/<[a-z]+\s*\/?>/i.test(e) ? 1 : 0), i = /^(```|#{1,6}\s|>\s|\*\s|\+\s|-\s|\d+\.\s|_{2}[^_]+_{2}|_{1}[^_]+_{1}|`[^`]+`|\[.*?\]\(.*?\)|!\[.*?\]\(.*?\)|\*\*.*\*\*|\*.*\*)/m, o = (e.match(i) ? 2 : 0) + (/\[.*?\]\(.*?\)/.test(e) ? 1 : 0) + // 链接
  (/\*\*.*\*\*/.test(e) ? 1 : 0) + // 加粗
  (/^#{1,6}\s+/m.test(e) ? 1 : 0);
  return r > o ? "HTML" : o > 0 ? "MD" : "TEXT";
}, Qi = (n) => n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"), Hs = (n) => n.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/'&#39;/g, "'");
class to {
  constructor() {
    /**
     *云系统操作者Map
     *
     * @memberof MenTionController
     */
    y(this, "operatorMap", /* @__PURE__ */ new Map());
    /**
     * @description css 命名空间
     * @type {Namespace}
     * @memberof MenTionController
     */
    y(this, "ns");
    /**
     * 模型
     *
     * @type {IEditor}
     * @memberof MenTionController
     */
    y(this, "model");
    /**
     * 上下文
     *
     * @type {IContext}
     */
    y(this, "context");
    /**
     * 视图参数
     *
     * @type {IParams}
     */
    y(this, "params");
    /**
     * @description 编辑器控制器
     * @type {VditorController}
     * @memberof MenTionController
     */
    y(this, "controller");
    /**
     * 用户请求url
     *
     * @type {string}
     * @memberof MenTionController
     */
    y(this, "userUrl", "");
    /**
     * 人员UI转化
     */
    y(this, "userFieldMap", {
      id: "id",
      name: "name",
      title: "title"
    });
    /**
     * 请求方法
     *
     * @type {('post' | 'get')}
     * @memberof MenTionController
     */
    y(this, "userMethod", "post");
    /**
     * 编辑器参数
     *
     * @type {IData}
     * @memberof MenTionController
     */
    y(this, "editorParams");
  }
  /**
   * 初始化
   *
   * @param {IDomEditor} editor
   * @memberof MenTionController
   */
  async init(t) {
    if (this.ns = t.ns, this.controller = t.controller, this.model = t.model, this.context = t.context, this.params = t.params, this.editorParams = this.model.editorParams, this.editorParams) {
      const { USERURL: e, USERFIELDMAP: s, USERMETHOD: r } = this.editorParams;
      if (e && (this.userUrl = e), s) {
        const i = JSON.parse(s);
        Object.assign(this.userFieldMap, i);
      }
      r && (this.userMethod = r.toLowerCase());
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
      return Object.keys(this.userFieldMap).forEach((r) => {
        s[r] = e[this.userFieldMap[r]];
      }), s;
    });
  }
  load(t = {}) {
    const { data: e, query: s } = t, { context: r, params: i } = this.controller.handlePublicParams(
      e,
      this.context,
      this.params
    ), o = ds.execScriptFn(
      { data: e, context: r, params: i },
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
    return e.ok ? this.toUIData(e.data).map((r) => {
      const i = r.name, o = Te.stringToHexColor(i), l = Te.avatarName(i), c = r.title;
      let h = "";
      if (this.operatorMap.has(r.id)) {
        const u = this.operatorMap.get(r.id);
        u.data.iconurl && (h = Xi(u.data.iconurl, {
          context: this.context,
          params: this.params,
          editorParams: this.editorParams
        }) || "");
      }
      const a = h ? '<img src="'.concat(h, '" />') : l;
      return {
        value: '@{"id":"'.concat(r.id, '","name":"').concat(r.name, '"}'),
        html: '<div class="'.concat(this.ns.e("user"), '"><div class="').concat(this.ns.e(
          "user-avatar"
        ), '" style="background: ').concat(o, ';">').concat(a, "</div> ").concat(i, " ").concat(c ? '<div class="'.concat(this.ns.e("user-title"), '">').concat(c, "</div>") : "", "</div>")
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
    return t != null && t.match(e) ? t.replaceAll(e, (s, r, i) => r && i ? '@{"id":"'.concat(r, '","name":"').concat(i, '"}') : s) : t;
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
      const r = [];
      return { match: !0, markdown: s.replaceAll(
        e,
        (o, l, c, h) => {
          if (c && h) {
            const a = Ht();
            return r.push({
              uuid: a,
              replace: '<span contenteditable="false" class="mention" data-id="'.concat(c, '">@').concat(h, "</span>"),
              text: o
            }), a;
          }
          return o;
        }
      ), replace: r };
    }
    return { match: !1, markdown: t };
  }
}
class eo {
  constructor() {
    /**
     * 模型
     *
     * @type {IEditor}
     * @memberof MarkerController
     */
    y(this, "model");
    /**
     * 上下文
     *
     * @type {IContext}
     */
    y(this, "context");
    /**
     * 视图参数
     *
     * @type {IParams}
     */
    y(this, "params");
    /**
     * @description css 命名空间
     * @type {Namespace}
     * @memberof MenTionController
     */
    y(this, "ns");
    /**
     * @description 编辑器控制器
     * @type {VditorController}
     * @memberof MenTionController
     */
    y(this, "controller");
    /**
     * 引用请求url
     *
     * @type {string}
     * @memberof MarkerController
     */
    y(this, "quoteUrl", "");
    /**
     * 引用UI转化
     */
    y(this, "quoteFieldMap", {
      id: "id",
      name: "name",
      identifier: "show_identifier",
      owner_subtype: "owner_subtype",
      owner_id: "owner_id",
      owner_type: "owner_type",
      recent_parent: "recent_parent"
    });
    /**
     * 代码表map
     *
     * @type {IData}
     * @memberof MarkerController
     */
    y(this, "quoteCodelistMap", /* @__PURE__ */ new Map());
    /**
     * 请求方法
     *
     * @type {('post' | 'get')}
     * @memberof MarkerController
     */
    y(this, "quoteMethod", "post");
    /**
     * 请求参数
     *
     * @type {IData}
     * @memberof MarkerController
     */
    y(this, "quoteParams", {});
    /**
     * 编辑器参数
     *
     * @type {IData}
     * @memberof MarkerController
     */
    y(this, "editorParams");
    /**
     * 用户数据
     *
     * @type {IData[]}
     * @memberof MarkerController
     */
    y(this, "items", []);
    /**
     * @description 提及项链接视图id
     * @type {string}
     * @memberof HtmlCommentController
     */
    y(this, "linkViewId", "");
    /**
     * @description 代码表对象
     * @type {IData}
     * @memberof MarkerController
     */
    y(this, "codeListMap", {});
    /**
     * @description 数据map
     * @type {Map<string, IData>}
     * @memberof MarkerController
     */
    y(this, "dataMap", /* @__PURE__ */ new Map());
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
        QUOTEMETHOD: r,
        QUOTEPARAMS: i,
        QUOTECODELISTMAP: o,
        LINKVIEWID: l
      } = this.editorParams;
      if (e && (this.quoteUrl = e), s && (this.quoteFieldMap = JSON.parse(s)), r && (this.quoteMethod = r.toLowerCase()), i && (this.quoteParams = JSON.parse(i)), o) {
        const c = JSON.parse(o);
        await this.setCodeListMap(c);
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
          const r = s.getAttribute("data-id") || "";
          this.handleClick(r);
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
      const s = t.find((r) => r.value == e);
      if (s)
        return s;
      for (let r = 0; r < t.length; r++) {
        const i = this.findCodeListItem(
          t[r].children,
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
      return Object.keys(this.quoteFieldMap).forEach((r) => {
        s[r] = e[this.quoteFieldMap[r]];
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
    const { data: e, query: s } = t, { context: r, params: i } = this.controller.handlePublicParams(
      e,
      this.context,
      this.params
    ), o = ds.execScriptFn(
      { data: e, context: r, params: i },
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
    const e = ibiz.hub.getApp(this.context.srfappid), s = e.codeList.getCodeList(t), r = await e.codeList.get(
      t,
      this.context,
      this.params
    );
    return { codeList: s, codeListItems: r };
  }
  /**
   * @description 根据类型获取图标
   * @param {string} type
   * @returns {*}  {string}
   * @memberof MarkerController
   */
  getIconByType(t) {
    const e = this.quoteCodelistMap.get("type"), s = this.findCodeListItem(e.codeListItems, t);
    return s && s.sysImage && s.sysImage.rawContent ? Un(s.sysImage.rawContent) : "";
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
    return e.ok ? this.toUIData(e.data).map((r) => {
      const i = this.getIconByType(r.owner_subtype);
      return {
        value: '#{"id":"'.concat(r.id, '","name":"').concat(r.name, '","identifier":"').concat(r.identifier, '","owner_id":"').concat(r.owner_id, '","owner_type":"').concat(r.owner_type, '","owner_subtype":"').concat(r.owner_subtype, '","recent_parent":"').concat(r.recent_parent, '"}'),
        html: '<div class="'.concat(this.ns.e("marker"), '">\n          <div class="').concat(this.ns.e("marker-icon"), '">').concat(i, '</div>\n          <div class="').concat(this.ns.e("marker-identifier"), '">').concat(r.identifier, '</div>\n          <div class="').concat(this.ns.e("marker-name"), '" title="').concat(r.name, '">').concat(r.name, "</div>\n          </div>")
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
      (r, i, o, l, c, h) => {
        if (i && h) {
          const a = this.dataMap.get(i);
          if (a)
            return '#{"id":"'.concat(i, '","name":"').concat(a.name, '","identifier":"').concat(a.identifier, '","owner_id":"').concat(a.owner_id, '","owner_type":"').concat(a.owner_type, '","owner_subtype":"').concat(a.owner_subtype, '","recent_parent":"').concat(a.recent_parent, '"}');
        }
        return r;
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
        (l, c, h, a, u, d, g, p) => {
          var v;
          if (c && h) {
            const b = Ht();
            let S = "";
            if (this.quoteCodelistMap.has("type") && g) {
              const G = this.quoteCodelistMap.get("type"), H = this.findCodeListItem(
                G.codeListItems,
                g
              );
              H && ((v = H.sysImage) != null && v.rawContent) && (S = Un(H.sysImage.rawContent));
            }
            this.dataMap.set(c, {
              id: c,
              icon: S,
              name: h,
              identifier: a,
              owner_id: u,
              owner_type: d,
              owner_subtype: g,
              recent_parent: p
            });
            const V = '<span contenteditable="false" class="marker" data-id="'.concat(c, '"><span class="marker-icon">').concat(S, '</span><span class="marker-identifier">').concat(a, '</span><span class="marker-name">').concat(h, "</span></span>");
            return i.push({
              uuid: b,
              replace: V,
              text: l
            }), b;
          }
          return l;
        }
      ), replace: i };
    }
    const r = /#{(".+?":".+?")(,"icon":"((.|[\t\r\f\n\s])+?)")*}/g;
    if (s.match(r)) {
      const i = [];
      return { match: !0, markdown: s.replaceAll(
        r,
        (l, c, h, a) => {
          if (c && a) {
            const u = JSON.parse("{".concat(c, "}"));
            a && (a = Un(a));
            const d = Ht(), g = { icon: a, ...u };
            this.dataMap.set(g.id, g);
            const { id: p, name: v, identifier: b } = u, S = '<span contenteditable="false" class="marker" data-id="'.concat(p, '"><span class="marker-icon">').concat(a, '</span><span class="marker-identifier">').concat(b, '</span><span class="marker-name">').concat(v, "</span></span>");
            return i.push({
              uuid: d,
              replace: S,
              text: l
            }), d;
          }
          return l;
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
    const e = this.context.clone(), s = fr(this.params), r = this.dataMap.get(t);
    if (!r || !r.owner_type)
      return;
    e.srfkey = r.id;
    const i = r.owner_subtype || r.type;
    s.owner_subtype = i, i === "page" ? (s.article_page = r.owner_id, e.article_page = r.owner_id) : (s[i] = r.owner_id, e[i] = r.owner_id), s[r.owner_type] = r.recent_parent, delete r.script, delete r.icon, delete r.id, Object.assign(s, r), r && this.linkViewId && ibiz.commands.execute(
      Bi.TAG,
      this.linkViewId,
      e,
      s
    );
  }
  parseCommentTag(t) {
    let { icon: e } = t;
    const s = JSON.stringify(t);
    if (!t.icon && t.owner_subtype && this.quoteCodelistMap.has("type")) {
      const r = this.quoteCodelistMap.get("type"), i = this.findCodeListItem(
        r.codeListItems,
        t.owner_subtype
      );
      i && i.sysImage && (e = i.sysImage.rawContent || "");
    }
    return "<span markerClick='marker' params='".concat(s, "' class='comment-tag is-click'>").concat(e, " ").concat(t.identifier, " ").concat(t.name, "</span>");
  }
}
const hn = new zi(import.meta.url);
class fs extends Ni {
  constructor() {
    super(...arguments);
    /**
     * 应用实体服务
     *
     * @type {IAppDEService}
     * @memberof HtmlCommentController
     */
    y(this, "deService");
    /**
     * 自填模式
     *
     * @author chitanda
     * @date 2023-10-12 10:10:52
     * @type {IAppDEACMode}
     */
    y(this, "deACMode");
    /**
     * AI 聊天自填模式
     *
     * @author chitanda
     * @date 2023-10-12 10:10:37
     * @type {boolean}
     */
    y(this, "chatCompletion", !1);
    /**
     * 编辑器实例
     */
    y(this, "vditor");
    /**
     * @description AI行内聊天框高度
     * @type {number}
     * @memberof HtmlCommentController
     */
    y(this, "inlineAiChatHeight");
    /**
     * @description 提及用户控制器
     * @memberof VditorController
     */
    y(this, "mentionController", new to());
    /**
     * @description 提及工作项控制器
     * @memberof VditorController
     */
    y(this, "markerController", new eo());
    /**
     * @description 是否硬换行模式
     * @type {boolean}
     * @memberof VditorController
     */
    y(this, "nodeHardBreak", !0);
    /**
     * @description 查看模板行为标识
     * @type {string}
     * @memberof VditorController
     */
    y(this, "templateActionTag", "");
    /**
     * 最大高度
     *
     * @type {number}
     * @memberof VditorController
     */
    y(this, "maxHeight", 0);
    /**
     * 最小高度
     *
     * @type {number}
     * @memberof VditorController
     */
    y(this, "minHeight", 48);
    /**
     *值项
     */
    y(this, "valueItem", "");
    // 是否折叠
    y(this, "collapsed", k(!0));
    /**
     * @description 值格式
     * @type {(string)}
     * @memberof VditorController
     */
    y(this, "formatType", "MD");
    /**
     * 用户头像数据
     *
     * @type {string}
     * @memberof VditorController
     */
    y(this, "userAvatar", "");
    /**
     * 回复
     *
     * @type {string}
     * @memberof HtmlCommentController
     */
    y(this, "reply", k(""));
    /**
     * 回复脚本
     *
     * @type {string}
     * @memberof HtmlCommentController
     */
    y(this, "replyScript", "");
    /**
     * 协同编辑key
     *
     * @type {(string | undefined)}
     * @memberof VditorController
     */
    y(this, "collaborateKey");
    /**
     * 实时编辑（协同编辑）
     */
    y(this, "enableRealtime", !1);
    /**
     * @description dom解析器
     * @memberof VditorController
     */
    y(this, "domParser", new DOMParser());
  }
  /**
   * 动态加载脚本
   *
   * @return {*}
   * @memberof SheetUtil
   */
  addScript(e) {
    return new Promise((s, r) => {
      const i = document.createElement("script");
      i.src = e, i.onload = s, i.onerror = r, document.head.appendChild(i);
    });
  }
  /**
   * 动态加载样式
   *
   * @return {*}
   * @memberof SheetUtil
   */
  addStyle(e) {
    return new Promise((s, r) => {
      const i = document.createElement("link");
      i.rel = "stylesheet", i.href = e, i.onload = s, i.onerror = r, document.head.appendChild(i);
    });
  }
  /**
   * @description 加载Vditor静态资源
   * @returns {*}
   * @memberof VditorController
   */
  loadVditor() {
    return new Promise((e, s) => {
      const { Vditor: r } = window;
      if (r)
        e();
      else {
        this.ctrl.startLoading();
        const i = [
          this.addStyle(hn.dir("vditor/dist/index.css")),
          this.addScript(hn.dir("vditor/dist/index.js"))
        ];
        Promise.all(i).then(() => {
          e();
        }).catch(() => {
          ibiz.message.error(
            "加载vditor静态资源失败,请确认静态资源是否存在！"
          ), s();
        }).finally(() => {
          this.ctrl.endLoading();
        });
      }
    });
  }
  toBoolean(e) {
    return Object.is("true", e) || e === !0;
  }
  async onInit() {
    var a, u;
    await super.onInit();
    const { model: e } = this;
    e.editorItems && e.editorItems.length > 0 && (this.valueItem = e.editorItems[0].id);
    const s = this.parent;
    s.model.sysPFPluginId && ((a = s.model.editor) != null && a.editorParams) && Object.keys((u = s.model.editor) == null ? void 0 : u.editorParams).forEach((d) => {
      var g;
      this.editorParams[d] = (g = s.model.editor) == null ? void 0 : g.editorParams[d];
    }), await this.initPlugin(), await this.loadVditor();
    const {
      NODEHARDBREAK: r,
      MAXHEIGHT: i,
      REPLYSCRIPT: o,
      COLLABORATEKEY: l,
      ENABLEREALTIME: c
    } = this.editorParams;
    c && (this.enableRealtime = Object.is(c, "TRUE") || Object.is(c, "true")), l && (this.collaborateKey = Fi(
      { collaboratekey: l },
      this.parent.data || {},
      this.params,
      this.context
    ).collaboratekey), o && (this.replyScript = o), r && (this.nodeHardBreak = this.toBoolean(r)), i && (this.maxHeight = Number(i));
    const { inlineaichatheight: h } = this.editorParams;
    if (h && (this.inlineAiChatHeight = Number(h)), e.appDEACModeId && (this.deACMode = await Pi(
      e.appDEACModeId,
      e.appDataEntityId,
      this.context.srfappid
    ), this.deACMode && (this.deACMode.actype === "CHATCOMPLETION" && (this.deService = await ibiz.hub.getApp(e.appId).deService.getService(this.context, e.appDataEntityId), this.chatCompletion = !0), this.deACMode.deuiactionGroup))) {
      const { uiactionGroupDetails: d = [] } = this.deACMode.deuiactionGroup, g = d.find((p) => p.userTag === "template");
      g && (this.templateActionTag = g.uiactionId);
    }
  }
  /**
   * @description 初始化插件
   * @returns {*}  {Promise<void>}
   * @memberof VditorController
   */
  async initPlugin() {
    const s = {
      ns: us("vditor"),
      model: this.model,
      context: this.context,
      params: this.params,
      controller: this
    };
    await this.mentionController.init(s), await this.markerController.init(s);
  }
  /**
   * @description 绘制完成
   * @memberof VditorController
   */
  renderAfter() {
    this.mentionController.renderAfter(), this.markerController.renderAfter();
    const { lute: e } = this.vditor.vditor;
    if (!e)
      return;
    const s = e.SpinVditorIRDOM;
    e.SpinVditorIRDOM = (u) => this.spinVditorIRDOM(u, s);
    const r = e.SpinVditorSVDOM;
    e.SpinVditorSVDOM = (u) => this.spinVditorIRDOM(
      u,
      r,
      !0
    );
    const i = e.VditorIRDOM2HTML;
    e.VditorIRDOM2HTML = (u) => {
      if (this.formatType === "MD")
        return i(u);
      let d = this.VditorIRDOM2HTML(u);
      const g = this.spinVditorStyle(d, !1);
      g.match && (d = g.html);
      const p = this.adaptImageStyle(d);
      return d = i(d), g.match && g.replace.forEach((v) => {
        d = d.replace(v.uuid, v.replace);
      }), p.length && (d = d.replaceAll(
        /<img src="(.+?)"(.*?)(\/*)>/g,
        (v, b) => {
          const S = p.find((V) => V.url === b);
          return S ? '<img src="'.concat(S.url, '"').concat(S.attr, "/>") : v;
        }
      )), Hs(d);
    };
    const o = e.SpinVditorDOM;
    e.SpinVditorDOM = (u) => this.spinVditorIRDOM(u, o);
    const l = e.VditorIRDOM2Md;
    e.VditorIRDOM2Md = (u) => {
      let d = this.VditorIRDOM2HTML(u);
      const g = this.spinVditorStyle(d, !1);
      g.match && (d = g.html);
      let p = l(d);
      return g.match && g.replace.forEach((v) => {
        p = p.replace(v.uuid, v.replace);
      }), p;
    };
    const c = e.VditorDOM2Md;
    e.VditorDOM2Md = (u) => {
      let d = this.VditorIRDOM2HTML(u);
      const g = this.spinVditorStyle(d, !1);
      g.match && (d = g.html);
      let p = c(d);
      return g.match && g.replace.forEach((v) => {
        p = p.replace(v.uuid, v.replace);
      }), p;
    };
    const h = e.Md2VditorIRDOM;
    e.Md2VditorIRDOM = (u) => {
      let d = this.spinVditorIRDOM(u, h);
      return d = this.transformMDImageWidth(d), d;
    };
    const a = e.Md2VditorDOM;
    e.Md2VditorDOM = (u) => {
      let d = this.spinVditorIRDOM(u, a);
      return d = this.transformMDImageWidth(d), d;
    };
  }
  /**
   * @description vditor 预览模式解析提及用户、提及工作项，用户预览模式切换
   * @param {string} text
   * @returns {*}  {string}
   * @memberof VditorController
   */
  transformHtml(e) {
    let s = Hs(e);
    const r = this.mentionController.spinVditorIRDOM(s);
    r.match && (s = r.markdown, r.replace.forEach((o) => {
      s = s.replace(o.uuid, o.replace);
    }));
    const i = this.markerController.spinVditorIRDOM(s);
    return i.match && (s = i.markdown, i.replace.forEach((o) => {
      s = s.replace(o.uuid, o.replace);
    })), s = this.transformMDImageWidth(s), s;
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
  insertText(e) {
    this.vditor && (this.vditor.insertEmptyBlock("afterend"), this.vditor.insertValue(e));
  }
  /**
   * 替换选中文本
   * @param text 文本
   */
  replaceSelectionText(e) {
    this.vditor && (this.vditor.getSelection() ? (this.vditor.deleteValue(), this.vditor.insertValue(e)) : this.vditor.insertValue(e));
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
      throw new Rn("编辑器未初始化");
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
      throw new Rn("编辑器未初始化");
    const e = this.vditor.getCursorPosition();
    if (!e || !e.left || !e.top)
      throw new Rn("获取选区位置失败");
    const s = this.vditor.vditor.element.getBoundingClientRect();
    return {
      // 编辑器的左侧距离 + 默认padding
      left: s.x + 10,
      // 编辑器的上方距离+选区距离编辑器上方距离
      top: s.y + Number(e.top),
      // 编辑器的宽度 - 左右padding
      width: s.width - 20,
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
  async doInLineAIUIAction(e, s) {
    const r = this.ctrl.getEventArgs();
    r.params = fr(r.params);
    const i = this.view.getCtx();
    i.vditor = this, r.params.editor = this, this.editorParams.srfaiappendcurdata && this.editorParams.srfaiappendcurdata === "true" && (r.context.srfaiappendcurdata = !0), await ji.exec(
      e,
      {
        ...r
      },
      s
    );
  }
  /**
   * @description 兼容图片样式
   * @param {string} markdown
   * @returns {*}  {IData}
   * @memberof VditorController
   */
  adaptImageStyle(e) {
    const s = /<img src="(.+?)"(.*?)(\/*)>/g;
    if (e.match(s)) {
      const r = [];
      return e.replaceAll(s, (i, o, l) => (o && r.push({
        url: o,
        attr: l,
        html: i
      }), i)), r;
    }
    return [];
  }
  /**
   * @description md格式图片支持宽度
   * @param {string} html
   * @returns {*}  {string}
   * @memberof VditorController
   */
  transformMDImageWidth(e) {
    const s = /<img(.+?)\/>/g;
    return e.match(s) ? e.replaceAll(s, (r) => {
      const i = this.domParser.parseFromString(r, "text/html");
      if (i.body) {
        const o = i.body.children[0], [l, c] = o.alt.split("#");
        return c && (o.style.width = c), o.outerHTML;
      }
      return r;
    }) : e;
  }
  /**
   * @description 硬换行解析
   * @memberof VditorController
   */
  handleHardBreak(e) {
    let s = e;
    return this.nodeHardBreak && (s = s.replaceAll(
      /<p data-block="0"><\/p>/g,
      '<p data-block="0"><wbr></p>'
    ), s = s.replaceAll(
      /<p data-block="0">\n<\/p>/g,
      '<p data-block="0"><wbr></p>'
    ), s = s.replaceAll(
      /<p data-block="0"><br><\/p>/g,
      '<p data-block="0"><wbr></p>'
    )), s;
  }
  /**
   * @description 转换vditor样式
   * @param {string} html
   * @returns {*}  {IData}
   * @memberof VditorController
   */
  spinVditorStyle(e, s = !0) {
    const r = /<span style="([^>]+?)">[^span]+?<\/span>/g, i = s ? this.VditorIRDOM2HTML(e) : e;
    if (i.match(r)) {
      const o = [];
      return { match: !0, html: i.replaceAll(r, (c, h) => {
        if (h) {
          const a = Ht();
          return o.push({
            uuid: a,
            replace: c,
            text: '<span style="'.concat(h, '">').concat(Qi(c), "</span>")
          }), a;
        }
        return c;
      }), replace: o };
    }
    return { match: !1, html: e };
  }
  /**
   * @description ir编辑模式转换dom
   * @param {string} markdown
   * @param {string} value
   * @returns {*}  {string}
   * @memberof VditorController
   */
  spinVditorIRDOM(e, s, r = !1) {
    let i = e;
    const o = this.spinVditorStyle(i);
    o.match && (i = o.html), i = this.handleHardBreak(i);
    const l = this.adaptImageStyle(i), c = Ht();
    i = i.replaceAll(/<br>/g, c);
    const h = this.mentionController.spinVditorIRDOM(i);
    h.match && (i = h.markdown);
    const a = this.markerController.spinVditorIRDOM(i);
    a.match && (i = a.markdown);
    let u = s(i);
    return h.match && h.replace.forEach((d) => {
      u = u.replaceAll(d.uuid, r ? d.text : d.replace);
    }), a.match && a.replace.forEach((d) => {
      u = u.replaceAll(d.uuid, r ? d.text : d.replace);
    }), o.match && o.replace.forEach((d) => {
      u = u.replaceAll(d.uuid, r ? d.text : d.replace);
    }), u = u.replaceAll(c, "<br>"), l.length && (u = u.replaceAll(
      /<img src="(.+?)"(.*?)(\/*)>/g,
      (d, g, p) => {
        const v = l.find((b) => b.url === g);
        return v ? '<img src="'.concat(v.url, '"').concat(v.attr, "/>") : d;
      }
    )), u;
  }
  /**
   * @description md格式转html格式
   * @param {string} html
   * @returns {*}  {string}
   * @memberof VditorController
   */
  VditorIRDOM2HTML(e = "") {
    let s = this.mentionController.VditorIRDOM2HTML(e);
    return s = this.markerController.VditorIRDOM2HTML(s), s;
  }
  /**
   * @description 打开链接
   * @param {string} url
   * @memberof VditorController
   */
  openUrl(e) {
    e.startsWith("redirect://tree#") || window.open(e);
  }
  /**
   * @description 获取当前用户头像
   *
   * @memberof VditorController
   */
  async getCurrentUserAvatar() {
    var r, i;
    const e = await ibiz.hub.getApp(this.context.srfappid);
    let s = [];
    if (s = await e.codeList.get(
      "SysOperator",
      this.context,
      this.params
    ), this.context.srfuserid) {
      const o = s.filter((l) => l.value === this.context.srfuserid);
      o && o.length > 0 && (this.userAvatar = ((i = (r = o[0]) == null ? void 0 : r.data) == null ? void 0 : i.iconurl) || "");
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
  setReply(e) {
    let s = e.content.replace(/<\/p>\n/g, " </p>");
    s.includes("&") && (s = s.replace(/&reg/g, "&amp;reg").replace(/&copy/g, "&amp;copy").replace(/&trade/g, "&amp;trade")), this.reply.value = Te.getEmojiCustomHtml(
      "".concat(e.name, ": ").concat(s)
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
  async setValue(e) {
    let s = e;
    s.includes("&") && (s = s.replace(/&reg/g, "&amp;reg").replace(/&copy/g, "&amp;copy").replace(/&trade/g, "&amp;trade")), this.vditor.setValue(""), this.vditor.insertValue(s), this.collapsed.value = !1, this.vditor.focus();
  }
  toggleCollapse(e) {
    this.collapsed.value = !e && !this.collapsed.value;
  }
  /**
   * 清除数据（无焦点）
   *
   * @memberof VditorController
   */
  clearValue() {
    var e;
    if ((e = this.vditor) != null && e.vditor) {
      const s = this.vditor.vditor[this.vditor.vditor.currentMode];
      s.element.innerHTML = "";
    }
  }
}
class Ee {
  constructor(t) {
    y(this, "formEditor", "IBizVditor");
    y(this, "gridEditor", "IBizVditor");
    t === "COMMENT" && (this.formEditor = "IBizCommentVditor", this.gridEditor = "IBizCommentVditor");
  }
  async createController(t, e) {
    const s = new fs(t, e);
    return await s.init(), s;
  }
}
const yr = [
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
], no = "<svg\n    viewBox='0 0 16 16'\n    xmlns='http://www.w3.org/2000/svg'\n    height='1em'\n    fill='currentColor'\n    width='1em'\n    preserveAspectRatio='xMidYMid meet'\n    focusable='false'\n  >\n    <g id='aqmaction/max-view' stroke-width='1' fill-rule='evenodd'>\n      <path\n        d='M2.1 1.9v12.2H.9V1.9h1.2zm13 0v12.2h-1.2V1.9h1.2zM6.224 5.075l.848.848-2.375 2.375 2.342 2.342-.848.849L3 8.299l3.224-3.224zm3.5 0l3.19 3.19-3.223 3.224-.849-.849 2.376-2.374-2.343-2.343.849-.848z'\n        id='aqm形状结合'\n      ></path>\n    </g>\n  </svg>", so = "<svg\n    viewBox='0 0 16 16'\n    xmlns='http://www.w3.org/2000/svg'\n    height='1em'\n    width='1em'\n    fill='currentColor'\n    preserveAspectRatio='xMidYMid meet'\n    focusable='false'\n  >\n    <g id='aqsaction/min-view' stroke-width='1' fill-rule='evenodd'>\n      <path\n        d='M2.1 1.9v12.2H.9V1.9h1.2zm13 0v12.2h-1.2V1.9h1.2zM4.624 5.075l3.19 3.19-3.223 3.224-.849-.849 2.376-2.374-2.343-2.343.849-.848zm7.1 0l.848.848-2.375 2.375 2.342 2.342-.848.849L8.5 8.299l3.224-3.224z'\n        id='aqs形状结合'\n      ></path>\n    </g>\n  </svg>", ro = f("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  fill: "currentColor",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [f("g", {
  id: "awytips/shortcut",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [f("path", {
  d: "M14 2.4a1.6 1.6 0 011.593 1.454L15.6 4v9a1.6 1.6 0 01-1.454 1.593L14 14.6H2a1.6 1.6 0 01-1.593-1.454L.4 13V4a1.6 1.6 0 011.454-1.593L2 2.4h12zm0 1.2H2a.4.4 0 00-.392.32L1.6 4v9a.4.4 0 00.32.392L2 13.4h12a.4.4 0 00.392-.32L14.4 13V4a.4.4 0 00-.4-.4zm-2.985 7.3v1.2H4.95v-1.2h6.065zM6.3 8v1.5H4.8V8h1.5zm2.5 0v1.5H7.3V8h1.5zm2.5 0v1.5H9.8V8h1.5zm1.2-3v1.5H11V5h1.5zM5 5v1.5H3.5V5H5zm2.5 0v1.5H6V5h1.5zM10 5v1.5H8.5V5H10z",
  id: "awy形状结合"
}, null)])]), Cr = "\n  <svg\n    xmlns='http://www.w3.org/2000/svg'\n    viewBox='0 0 16 16'\n    preserveAspectRatio='xMidYMid meet'\n    focusable='false'\n  >\n    <g\n      id='aae1.Base基础/1.icon图标/2.normal/ai-star'\n      stroke-width='1'\n      fill-rule='evenodd'\n    >\n      <path\n        d='M5.817 1.53l3.158 8.797h.054v.152l1.443 4.021-1.402.001-1.041-2.982H2.495l-1.03 2.982L0 14.5 4.671 1.533l1.146-.003zm7.86 5.424V14.5h-1.213V6.954h1.212zM5.248 3.549l-2.342 6.778h4.706L5.249 3.55zM13.046 0c.075 0 .147.02.204.071a.318.318 0 01.094.181l.064.273c.097.417.17.727.255.968.084.24.177.4.31.523.134.124.318.218.599.306.281.088.65.166 1.15.265a.358.358 0 01.195.095c.056.057.083.13.083.213a.289.289 0 01-.083.21.362.362 0 01-.197.094c-.528.093-.918.167-1.214.255-.295.088-.485.187-.621.324-.137.138-.23.324-.31.606-.08.283-.145.651-.23 1.147a.329.329 0 01-.093.184.293.293 0 01-.206.075.308.308 0 01-.207-.072.322.322 0 01-.1-.188l-.006-.033c-.085-.486-.149-.845-.228-1.12-.079-.274-.17-.452-.305-.585-.135-.133-.323-.23-.618-.32s-.683-.168-1.21-.273a.353.353 0 01-.2-.096.29.29 0 01-.08-.208c0-.079.023-.153.079-.211a.35.35 0 01.2-.097c.5-.098.869-.176 1.15-.263.282-.087.465-.18.597-.302.132-.12.224-.278.306-.511.082-.236.151-.539.244-.947l.071-.312a.312.312 0 01.102-.183.311.311 0 01.205-.069z'\n        id='aae形状结合'\n      ></path>\n    </g>\n  </svg>\n", kr = f("svg", {
  version: "1.1",
  fill: "CurrentColor",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 1024 1024",
  width: "14",
  height: "14"
}, [f("path", {
  d: "M274.344554 173.673875c16.429399 0 30.950568 8.00526 39.956484 20.338945a34.906655 34.906655 0 0 1 14.660796 15.754537l1.117013 2.815803 210.138065 597.927736c6.795162 19.268474-5.329083 40.817516-27.041022 48.147913-20.641469 6.95806-42.493035-1.419537-50.451753-18.803052l-1.117013-2.815803-54.477653-154.939008H134.997185L80.566074 837.039954c-6.771891 19.268474-29.856826 28.949253-51.568765 21.618855-20.641469-6.981331-32.602816-26.761769-27.925325-45.239025l0.861031-2.908888L212.047809 212.58316c4.025901-11.426112 13.799764-19.477914 25.598214-22.619512 9.029188-10.006575 22.107548-16.289773 36.67526-16.289773z m386.416675 169.460176c21.828295 0 39.723774 10.890876 41.469106 24.713912l0.116356 2.210755v461.652153c0 14.893506-18.616883 26.947938-41.585462 26.947938-21.805024 0-39.700503-10.890876-41.422565-24.737183l-0.162897-2.210755V370.081989c0-14.870235 18.616883-26.924667 41.585462-26.924667z m-389.697901-48.171184L163.620643 600.628812h214.88537l-107.442685-305.665945z m602.163076-206.181978a12.566396 12.566396 0 0 1 8.144887 8.051802l32.509731 99.041817 101.694723 36.07021a12.566396 12.566396 0 0 1-0.791218 23.922695l-99.53051 27.995137-30.857483 97.552467a12.566396 12.566396 0 0 1-23.899423 0.116355l-32.509732-99.018546-98.669479-31.322905a12.566396 12.566396 0 0 1-0.186169-23.876152l97.505924-32.812256 30.834212-97.529195a12.566396 12.566396 0 0 1 15.754537-8.191429zM649.544557 0.513593c2.676177 0.884302 4.770576 3.025243 5.608336 5.724692l18.523798 59.294772 60.970292 20.66474a8.796477 8.796477 0 0 1-0.325796 16.755194l-60.73758 18.058377-19.780438 59.550754a8.796477 8.796477 0 0 1-16.731924-0.162898l-18.523798-59.271501-59.062061-17.825665a8.796477 8.796477 0 0 1-0.395609-16.708653l59.574025-20.943993 19.780438-59.574025a8.796477 8.796477 0 0 1 11.100317-5.561794z",
  fill: "CurrentColor"
}, null)]), Kn = f("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  fill: "CurrentColor",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [f("g", {
  id: "afbeditor/bold",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [f("path", {
  d: "M10.788 6.717c1.796.246 3.143 1.936 3.143 4.05 0 2.285-1.7 4.214-3.713 4.214H3.116V7.823H2.8v-5.47h.325V1h5.479c1.666 0 3.02 1.53 3.02 3.412a3.63 3.63 0 01-.836 2.305zm-.57 7.065c1.34 0 2.514-1.41 2.514-3.015 0-1.616-1.054-2.881-2.399-2.881h-6.78v5.896h6.665zM8.604 6.623c.936 0 1.82-1.075 1.82-2.21 0-1.2-.833-2.213-1.82-2.213H3.553v4.423h5.05z",
  id: "afb形状结合"
}, null), f("path", {
  d: "M3.1 14.981c-.33 0-.6-.322-.6-.717V1.717c0-.395.27-.717.6-.717.33 0 .6.322.6.717v12.547c0 .395-.27.717-.6.717",
  id: "afbFill-1"
}, null)])]), Xn = f("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  fill: "CurrentColor",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [f("g", {
  id: "apceditor/italic",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [f("g", {
  id: "apc文本编辑_倾斜-1.5px-16*16",
  transform: "translate(2 1)"
}, [f("path", {
  d: "M3.646 12.8L6.754 1.2H3.5V0H11v1.2H7.996L4.888 12.8H8V14H.5v-1.2h3.146z",
  id: "apc形状结合"
}, null)])])]), Zn = f("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  fill: "CurrentColor",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [f("g", {
  id: "ayleditor/strike",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [f("path", {
  d: "M6 8.6H.894V7.4H3.5c-.62-.67-1-1.565-1-2.55v-.1A3.75 3.75 0 016.25 1h3.5a3.75 3.75 0 013.742 3.5h-1.204A2.55 2.55 0 009.75 2.2h-3.5A2.55 2.55 0 003.7 4.75v.1A2.55 2.55 0 006.25 7.4h8.85v1.2h-2.6a3.75 3.75 0 01-2.75 6.3h-3.5A3.75 3.75 0 012.503 11h1.201a2.55 2.55 0 002.546 2.7h3.5a2.55 2.55 0 000-5.1h-3.5a2.58 2.58 0 00-.25.012V8.6z",
  id: "ayl形状结合"
}, null)])]), Qn = f("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  fill: "CurrentColor",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [f("g", {
  id: "apveditor/link-insert",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [f("path", {
  d: "M12.253 4.13h-1.2v-1a2.8 2.8 0 00-5.6 0v4a2.8 2.8 0 002.8 2.8v1.2a4 4 0 01-4-4v-4a4 4 0 018 0v1zm-8 8h1.2v1a2.8 2.8 0 005.6 0v-4a2.8 2.8 0 00-2.8-2.8v-1.2a4 4 0 014 4v4a4 4 0 01-8 0v-1z",
  id: "apv形状结合",
  transform: "rotate(46 8.253 8.13)"
}, null)])]), io = "<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'>\n    <path\n      d='M416 221.25V416a48 48 0 01-48 48H144a48 48 0 01-48-48V96a48 48 0 0148-48h98.75a32 32 0 0122.62 9.37l141.26 141.26a32 32 0 019.37 22.62z'\n      fill='none'\n      stroke='currentColor'\n      stroke-linejoin='round'\n      stroke-width='32'\n    />\n    <path\n      d='M256 56v120a32 32 0 0032 32h120M176 288h160M176 368h160'\n      fill='none'\n      stroke='currentColor'\n      stroke-linecap='round'\n      stroke-linejoin='round'\n      stroke-width='32'\n    />\n  </svg>";
f("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  fill: "CurrentColor",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [f("g", {
  id: "ajpaction/edit",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [f("path", {
  d: "M2 8.34L10.71 0 15 4.17 6.538 13H2V8.34zm1.2.512V11.8h2.826l7.283-7.6-2.606-2.533L3.2 8.852zM0 16v-1.2h16V16H0z",
  id: "ajp编辑"
}, null)])]);
f("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  fill: "CurrentColor",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [f("g", {
  id: "aee1.Base基础/1.icon图标/1.-action/expand-arrows",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [f("path", {
  d: "M14.086 2.598v4.526a.6.6 0 101.2 0V1.2a.6.6 0 00-.6-.6L8.76.604a.6.6 0 000 1.2h4.42L9.826 5.007a.6.6 0 10.829.868l3.43-3.277zM1.803 13.292V8.766a.6.6 0 00-1.2 0v5.923a.6.6 0 00.6.6l.007-.002h5.917a.6.6 0 100-1.2H2.708l3.355-3.204a.6.6 0 00-.829-.868l-3.43 3.277z",
  id: "aee形状结合"
}, null)])]);
f("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  fill: "CurrentColor",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [f("g", {
  id: "aif1.Base基础/1.icon图标/1.-action/收起",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [f("path", {
  d: "M10.76 5.126V1.6a.6.6 0 10-1.2 0v4.923a.6.6 0 00.6.599l4.924-.001a.6.6 0 000-1.2h-3.419l3.354-3.204a.6.6 0 10-.829-.868l-3.43 3.277zm-4.836 6.435v3.526a.6.6 0 001.2 0v-4.923a.6.6 0 00-.6-.6l-.007.002H1.6a.6.6 0 100 1.2h3.419L1.664 13.97a.6.6 0 00.829.868l3.431-3.277z",
  id: "aif形状结合"
}, null)])]);
const oo = "<svg\n    viewBox='0 0 16 16'\n    xmlns='http://www.w3.org/2000/svg'\n    height='1em'\n    width='1em'\n    fill='CurrentColor'\n    preserveAspectRatio='xMidYMid meet'\n    focusable='false'\n  >\n    <g id='ahhaction/close' stroke-width='1' fill-rule='evenodd'>\n      <path\n        d='M7.456 7.456V-.115h1.2v7.571h7.572v1.2H8.656v7.572h-1.2V8.656H-.115v-1.2h7.571z'\n        id='ahh形状结合'\n        transform='rotate(45 8.056 8.056)'\n      ></path>\n    </g>\n  </svg>", lo = f("svg", {
  viewBox: "0 0 1024 1024",
  fill: "CurrentColor"
}, [f("path", {
  d: "M384 64h640v128H384V64z m0 384h640v128H384v-128z m0 384h640v128H384v-128zM0 128a128 128 0 1 1 256 0 128 128 0 0 1-256 0z m0 384a128 128 0 1 1 256 0 128 128 0 0 1-256 0z m0 384a128 128 0 1 1 256 0 128 128 0 0 1-256 0z"
}, null)]), co = f("svg", {
  viewBox: "0 0 1024 1024",
  fill: "CurrentColor"
}, [f("path", {
  d: "M384 832h640v128H384z m0-384h640v128H384z m0-384h640v128H384zM192 0v256H128V64H64V0zM128 526.016v50.016h128v64H64v-146.016l128-60V384H64v-64h192v146.016zM256 704v320H64v-64h128v-64H64v-64h128v-64H64v-64z"
}, null)]), ao = f("svg", {
  viewBox: "0 0 16 16",
  fill: "CurrentColor"
}, [f("g", {
  id: "ahveditor/color-tt",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [f("path", {
  id: "ahvsecondary-color",
  d: "M1.999 15.011h11.998V13.81H1.999z",
  fill: "#FF0100"
}, null), f("path", {
  d: "M6.034 7.59h4.104L8.086 2.297 6.034 7.59zm-.465 1.2l-1.437 3.707H2.845L7.301 1h1.287l-.001.004h.286l4.454 11.492h-1.288L10.603 8.79H5.569z",
  id: "ahv合并形状"
}, null)])]), ho = f("svg", {
  viewBox: "0 0 1024 1024",
  fill: "CurrentColor"
}, [f("path", {
  d: "M929.28 625.664l-234.496 0.512 24.064-229.888 210.432-0.512c20.992 0 38.4-17.408 38.4-38.4s-17.408-38.4-38.4-38.4H727.04l29.184-275.456c2.048-20.992-13.312-39.936-34.304-41.984-20.992-2.048-39.936 13.312-41.984 34.304L650.24 318.976l-232.448 0.512 29.184-275.456c2.048-20.992-13.312-39.936-34.304-41.984-20.992-2.048-39.936 13.312-41.984 34.304l-29.696 283.648-246.272 0.512c-20.992 0-38.4 17.408-38.4 38.4s17.408 38.4 38.4 38.4l238.08-0.512-24.064 229.888-214.016 0.512c-20.992 0-38.4 17.408-38.4 38.4s17.408 38.4 38.4 38.4l205.824-0.512-29.184 276.992c-2.048 20.992 13.312 39.936 34.304 41.984h4.096c19.456 0 35.84-14.848 37.888-34.304l30.208-285.184 232.448-0.512-29.184 277.504c-2.048 20.992 13.312 39.936 34.304 41.984h4.096c19.456 0 35.84-14.848 38.4-34.304l30.208-285.184 242.688-0.512c20.992 0 38.4-17.408 38.4-38.4-1.536-20.992-18.944-37.888-39.936-37.888z m-544.256 0.512l24.064-229.888 232.448-0.512-24.064 229.888-232.448 0.512z"
}, null)]), uo = f("svg", {
  viewBox: "0 0 1024 1024",
  fill: "CurrentColor"
}, [f("path", {
  d: "M23.7 555c0-339.3 247-550 533.8-550 295.6 0 442.8 165.9 442.8 401.6 0 210.8-93.5 361.7-237 361.7-63.6 0-108.5-26.2-137.2-78.6-48.6 51.1-96 79.8-174.6 79.8-116 0-178.4-77.3-178.4-193.3 0-209.5 131-323 251.9-323 64.9 0 102.3 24.9 122.2 68.6l11.2-58.6 114.7 1.2L727 510.1c-7.5 36.2-11.2 63.6-11.2 81.1 0 44.9 22.5 71.1 56.1 71.1 63.6 0 106-89.8 106-243.2 0-205.8-114.7-300.6-323-300.6-220.8 0-405.4 163.4-405.4 436.5 0 238.2 132.2 350.5 390.4 350.5 94.8 0 174.6-12.5 255.7-36.2v109.8c-88.6 26.2-177.1 39.9-263.2 39.9-329.1 0-508.7-168.4-508.7-464z m585-44.9c3.7-20 6.2-39.9 6.2-53.6 0-56.1-15-96-83.6-96-83.6 0-133.5 108.5-133.5 212 0 44.9 13.7 88.6 77.3 88.6 73.7-0.1 114.9-57.4 133.6-151z"
}, null)]), fo = f("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false",
  fill: "CurrentColor"
}, [f("g", {
  id: "axknormal/smile-plus",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [f("path", {
  d: "M14.727 7h1.211A8 8 0 1111.206.668L10.795 1.8A6.8 6.8 0 1014.727 7zm-.226-1h1.247-1.247zM5 8a1 1 0 110-2 1 1 0 010 2zm6.97 1.5a4 4 0 01-7.94 0h1.215a2.8 2.8 0 005.51 0h1.214zM11 8a1 1 0 110-2 1 1 0 010 2zm2.264-5.177V1.459h1.2v1.364h1.364v1.2h-1.364v1.363h-1.2V4.023H11.9v-1.2h1.364z",
  id: "axk形状结合"
}, null)])]), go = f("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false",
  fill: "CurrentColor"
}, [f("g", {
  id: "ahqeditor/code",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [f("path", {
  d: "M4.875 2.702L1.43 8.032l3.446 5.332-1.008.652L0 8.033l3.867-5.982 1.008.651zm6.25 10.662l3.446-5.33-3.446-5.332 1.008-.651L16 8.033l-3.867 5.983-1.008-.652zM8.852 1.402l1.172.257L7.21 14.53l-1.172-.256L8.852 1.402z",
  id: "ahq形状结合"
}, null)])]), po = f("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 16 16",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false",
  fill: "CurrentColor"
}, [f("g", {
  id: "aae1.Base基础/1.icon图标/2.normal/ai-star",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [f("path", {
  d: "M5.817 1.53l3.158 8.797h.054v.152l1.443 4.021-1.402.001-1.041-2.982H2.495l-1.03 2.982L0 14.5 4.671 1.533l1.146-.003zm7.86 5.424V14.5h-1.213V6.954h1.212zM5.248 3.549l-2.342 6.778h4.706L5.249 3.55zM13.046 0c.075 0 .147.02.204.071a.318.318 0 01.094.181l.064.273c.097.417.17.727.255.968.084.24.177.4.31.523.134.124.318.218.599.306.281.088.65.166 1.15.265a.358.358 0 01.195.095c.056.057.083.13.083.213a.289.289 0 01-.083.21.362.362 0 01-.197.094c-.528.093-.918.167-1.214.255-.295.088-.485.187-.621.324-.137.138-.23.324-.31.606-.08.283-.145.651-.23 1.147a.329.329 0 01-.093.184.293.293 0 01-.206.075.308.308 0 01-.207-.072.322.322 0 01-.1-.188l-.006-.033c-.085-.486-.149-.845-.228-1.12-.079-.274-.17-.452-.305-.585-.135-.133-.323-.23-.618-.32s-.683-.168-1.21-.273a.353.353 0 01-.2-.096.29.29 0 01-.08-.208c0-.079.023-.153.079-.211a.35.35 0 01.2-.097c.5-.098.869-.176 1.15-.263.282-.087.465-.18.597-.302.132-.12.224-.278.306-.511.082-.236.151-.539.244-.947l.071-.312a.312.312 0 01.102-.183.311.311 0 01.205-.069z",
  id: "aae形状结合"
}, null)])]), mo = f("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false",
  fill: "CurrentColor"
}, [f("g", {
  id: "ajpaction/edit",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [f("path", {
  d: "M2 8.34L10.71 0 15 4.17 6.538 13H2V8.34zm1.2.512V11.8h2.826l7.283-7.6-2.606-2.533L3.2 8.852zM0 16v-1.2h16V16H0z",
  id: "ajp编辑"
}, null)])]), wo = f("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  fill: "CurrentColor",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [f("g", {
  id: "aee1.Base基础/1.icon图标/1.-action/expand-arrows",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [f("path", {
  d: "M14.086 2.598v4.526a.6.6 0 101.2 0V1.2a.6.6 0 00-.6-.6L8.76.604a.6.6 0 000 1.2h4.42L9.826 5.007a.6.6 0 10.829.868l3.43-3.277zM1.803 13.292V8.766a.6.6 0 00-1.2 0v5.923a.6.6 0 00.6.6l.007-.002h5.917a.6.6 0 100-1.2H2.708l3.355-3.204a.6.6 0 00-.829-.868l-3.43 3.277z",
  id: "aee形状结合"
}, null)])]), vo = f("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "CurrentColor",
  height: "1em",
  width: "1em",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false"
}, [f("g", {
  id: "aif1.Base基础/1.icon图标/1.-action/收起",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [f("path", {
  d: "M10.76 5.126V1.6a.6.6 0 10-1.2 0v4.923a.6.6 0 00.6.599l4.924-.001a.6.6 0 000-1.2h-3.419l3.354-3.204a.6.6 0 10-.829-.868l-3.43 3.277zm-4.836 6.435v3.526a.6.6 0 001.2 0v-4.923a.6.6 0 00-.6-.6l-.007.002H1.6a.6.6 0 100 1.2h3.419L1.664 13.97a.6.6 0 00.829.868l3.431-3.277z",
  id: "aif形状结合"
}, null)])]), bo = ["👍", "👎", "😕", "👀️", "❤️", "🚀️", "😄", "🎉️"], $s = /* @__PURE__ */ gr({
  name: "IBizCommentVditor",
  props: {
    value: String,
    controller: fs,
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
  emits: ur(),
  setup(n, {
    emit: t,
    slots: e
  }) {
    var Ze;
    const s = us("vditor"), r = n.controller, i = "vditor-".concat(Ht()), o = k(), l = k(), c = k(!1), h = k(!1), a = k(""), u = k(!1), d = k(), g = "left", p = k(!1), v = k({}), b = k(""), {
      zIndex: S
    } = an(), {
      UIStore: V
    } = an(), G = k(V.theme), H = k(""), N = ibiz.util.file.getUploadHeaders(), nt = k({
      ...N
    });
    let $ = !1;
    const Q = k(255), Je = k(!1), ve = k(!1), be = k(!1), zt = k(), We = k(""), te = k([]), bt = k(), {
      editorParams: Nt
    } = r;
    Nt && Nt.enablenoaccess && ($ = ((Ze = r == null ? void 0 : r.editorParams) == null ? void 0 : Ze.enablenoaccess) === "true");
    const K = pr(() => {
      let m = "HTML";
      return n.data && n.data[r.valueItem] && (m = n.data[r.valueItem]), m;
    }), Dt = (m, I) => {
      const _ = {
        ...r.editorParams
      };
      return _.exportparams && (_.exportParams = JSON.parse(_.exportparams)), I && I.folder && (_.osscat = I.folder), ibiz.util.file.calcFileUpDownUrl(r.context, r.params, m, _).downloadUrl;
    };
    let ee;
    const _t = async () => {
      const {
        appDataEntityId: m
      } = r.model;
      if (!m || !r.deACMode)
        return;
      const I = S.increment();
      ee = await ibiz.aiChatUtil.getAIChat();
      const {
        containerOptions: _,
        chatOptions: B
      } = await ibiz.aiChatUtil.getEditorExAIChatParams(r.editorParams, r.context, r.params, n.data, r.deACMode, {
        chatInstance: ee,
        view: r.view,
        ctrl: r.ctrl
      }), Y = await ibiz.aiChatUtil.getAIResourceOptions(r.context, r.params);
      ee.create({
        resourceOptions: Y,
        containerOptions: {
          zIndex: I,
          ..._
        },
        chatOptions: {
          caption: r.deACMode.logicName,
          context: {
            ...r.context
          },
          params: {
            ...r.params,
            srfactag: r.deACMode.codeName
          },
          appDataEntityId: m,
          ...B,
          action: (L, tt) => {
            L === "backfill" && t("change", tt.realcontent);
          }
        }
      });
    }, ye = (m, I = !1) => {
      if (!r.vditor || !r.vditor.vditor || !r.vditor.vditor.lute)
        return;
      const _ = r.vditor.vditor[r.vditor.vditor.currentMode];
      if (K.value === "HTML")
        _ && (!b.value || _.element.innerHTML !== b.value || I) && (r.vditor.setValue(""), r.vditor.insertValue(m));
      else if (!b.value || _.element.innerHTML !== b.value || I) {
        const B = "​";
        let Y = m;
        Y = Y.replaceAll("\n\n", "\n".concat(B, "\n")), r.vditor.setValue(""), r.vditor.insertValue(Y);
      }
    }, Ce = () => {
      if (K.value === "MD")
        t("change", r.vditor.getValue());
      else if (K.value === "HTML") {
        let m = r.vditor.getHTML();
        m = r.handleHardBreak(m), t("change", m);
      }
    }, j = async (m, I) => {
      const _ = Dt(m, I);
      let B = _.replace("%fileId%", I.id);
      const Y = I.filename;
      if (ibiz.config.common.enableDownloadTicket) {
        const L = await ibiz.util.file.getDownloadTicket(r.context, r.params, m, {
          fileId: I.id
        }, r.downloadTicketParams);
        if (L && L.ticket)
          return B = _.replace("%fileId%", L.ticket), {
            url: B,
            alt: Y
          };
      }
      return {
        url: B,
        alt: Y
      };
    }, dt = async (m) => {
      if (We.value = m, te.value = [m], await ie(), zt.value) {
        const {
          container: I
        } = zt.value.$refs;
        I && I.children[0].click();
      }
    }, Ge = () => {
      const m = [], {
        QUOTEURL: I,
        USERURL: _
      } = r.editorParams;
      _ && m.push({
        key: "@",
        hint: async (L) => {
          c.value = !0;
          try {
            return await r.mentionController.getUsers({
              data: n.data,
              query: L
            });
          } finally {
            c.value = !1;
          }
        }
      }), I && m.push({
        key: "#",
        hint: async (L) => {
          c.value = !0;
          try {
            return await r.markerController.getMarkers({
              data: n.data,
              query: L
            });
          } finally {
            c.value = !1;
          }
        }
      });
      const B = e.editorSwitchMenu ? 128 : 8, Y = {
        theme: G.value,
        height: r.maxHeight || r.parent.model.height || Q.value,
        placeholder: r.placeHolder,
        cache: {
          enable: !1
        },
        toolbarConfig: {
          pin: !1,
          ellipsis: g === "left",
          offsetWidth: B
        },
        toolbar: [...yr],
        fullscreen: {
          index: S
        },
        preview: {
          maxWidth: 960
        },
        link: {
          click: (L) => {
            const tt = L.textContent;
            r.openUrl(tt);
          }
        },
        upload: {
          url: H.value,
          // 自定义增加 http  header
          headers: nt.value,
          fieldName: "file",
          filename: (L) => L,
          success: (L, tt) => {
            const yt = JSON.parse(tt);
            ibiz.config.common.enableDownloadTicket && yt.ticket && ibiz.util.file.setDownloadTicket(yt.id, yt.ticket), j(n.data || {}, yt).then((Tt) => {
              const {
                url: Vn,
                alt: Qe
              } = Tt;
              r.vditor.insertValue("![".concat(Qe, "](").concat(Vn, ")"));
            });
          },
          error: (L) => {
            const tt = L || ibiz.i18n.t("util.uploadManager.failed");
            ibiz.message.error(tt);
          }
        },
        image: {
          preview: (L) => {
            dt(L.src);
          }
        },
        input: () => {
        },
        focus: () => {
          r.collapsed.value = !1, ve.value = !0, t("focus");
        },
        blur: (L) => {
          ve.value = !1;
          const tt = r.vditor.vditor[r.vditor.vditor.currentMode];
          tt && (b.value = tt.element.innerHTML);
          const {
            hint: yt
          } = r.vditor.vditor;
          if (yt.element.style.display === "none") {
            const Tt = L.trim();
            Tt && Tt !== "<p><br></p>" && Tt !== '<p data-block="0"><wbr></p>' && Tt !== "\n" && Ce();
          }
        },
        select: () => {
          if (!u.value) {
            p.value = !0;
            const L = r.vditor.getCursorPosition();
            v.value = {
              top: "".concat(L.top + 90, "px"),
              left: "".concat(L.left, "px"),
              zIndex: S.zIndex + 2
            };
          }
        },
        unSelect: () => {
          p.value = !1;
        },
        after: () => {
          h.value = !0, u.value && r.vditor.disabled(), r.renderAfter(), n.value && ye(n.value);
        },
        hint: {
          extend: m
        },
        cdn: hn.dir("vditor")
      };
      r.chatCompletion && Y.toolbar.unshift({
        name: "AI",
        tipPosition: "n",
        tip: "AI询问",
        className: "vditor-toolbar__ai",
        icon: Cr,
        click() {
          _t();
        }
      }), r.vditor = new window.Vditor(o.value, {
        ...Y
      });
    };
    Vt(() => r.collapsed.value, (m) => {
      m && (r.clear(), r.clearValue(), t("change", ""), t("blur"));
    }, {
      immediate: !0
    }), Vt(() => K.value, () => {
      r.formatType = K.value;
    }, {
      immediate: !0
    }), Vt(() => n.value, (m) => {
      m ? (ye(m), a.value = m) : (a.value = "", r.clearValue());
    }, {
      immediate: !0
    }), Vt(() => n.data, (m) => {
      if (m) {
        const I = {
          ...r.editorParams,
          enableNoAccess: $
        };
        I.uploadparams && (I.uploadParams = JSON.parse(I.uploadparams));
        const _ = ibiz.util.file.calcFileUpDownUrl(r.context, r.params, m, I);
        H.value = _.uploadUrl;
      }
    }, {
      immediate: !0,
      deep: !0
    }), mr(() => {
      o.value && Ge(), l.value && (bt.value = qi(l, () => {
        var I, _;
        const m = (_ = (I = r.vditor) == null ? void 0 : I.getValue()) == null ? void 0 : _.trim();
        (!m || m === "<p><br></p>" || m === '<p data-block="0"><wbr></p>') && (r.collapsed.value = !0);
      }, {
        capture: !0,
        ignore: [o.value]
      }));
    }), wr(() => {
      var m;
      (m = bt.value) == null || m.stop();
    });
    const An = (m) => {
      m.preventDefault();
      const I = ibiz.inLineAIUtil.calcContextMenus(r.deACMode, (L) => {
        r.doInLineAIUIAction(L, r.model.appId);
      }), _ = S.increment(), B = r.vditor.getCursorPosition(), Y = r.vditor.vditor.element.getBoundingClientRect();
      ibiz.inLineAIUtil.showContextMenus(
        // 编辑器的左侧距离+选区距离编辑器左侧距离
        Y.x + B.left,
        // 编辑器的上方距离+选区距离编辑器上方距离+悬浮工具栏高度
        Y.y + B.top + 123,
        I,
        {
          zIndex: _,
          onClose: () => {
            S.decrement();
          }
        }
      );
    }, it = (m, I) => {
      if (m.preventDefault(), r.vditor && r.vditor.vditor.toolbar) {
        const _ = r.vditor.vditor.toolbar.elements || {};
        _[I] && _[I].children[0] && _[I].children[0].click();
      }
    }, Dn = () => {
      var m;
      (m = r.vditor) == null || m.insertValue(" #");
    }, Ft = () => {
      var m;
      (m = r.vditor) == null || m.insertValue(" @");
    }, Ke = () => {
      Je.value = !0;
    }, _n = (m) => /^https?:|^http?:|^data:image|(\.png$|\.svg|\.jpg|\.png|\.gif|\.psd|\.tif|\.bmp|\.jpeg)$/.test(m), ke = () => {
      if (r.userAvatar && !Je.value) {
        let _ = "";
        if (_n(r.userAvatar))
          _ = r.userAvatar;
        else {
          let B = [];
          try {
            B = JSON.parse(r.userAvatar);
          } catch (L) {
            console.error("解析头像数据失败", L);
          }
          if (B.length === 0)
            return null;
          const {
            downloadUrl: Y
          } = ibiz.util.file.calcFileUpDownUrl(r.context, r.params, n.data, r.editorParams);
          _ = Y.replace("%fileId%", B[0].id);
        }
        return f("div", {
          class: s.be("comment", "avatar-name")
        }, [f("img", {
          src: _,
          alt: "",
          onError: Ke
        }, null)]);
      }
      const m = Te.stringToHexColor(r.context.srfusername), I = Te.avatarName(r.context.srfusername);
      return r.context.srfusername ? f("div", {
        class: s.be("comment", "avatar-name"),
        style: "background: ".concat(m, ";")
      }, [I]) : f(gt("el-avatar"), {
        class: s.be("comment", "avatar"),
        src: "./assets/images/user-avatar.png"
      }, null);
    }, ne = (m) => {
      var I;
      (I = r.vditor) == null || I.insertValue(m);
    }, Tn = () => f("div", {
      class: s.be("comment", "footer-toolbar")
    }, [r != null && r.chatCompletion ? f("button", {
      class: {
        "vditor-inline-ai": !0
      },
      title: "AI",
      onClick: _t
    }, [po]) : null, f(gt("el-popover"), {
      trigger: "hover",
      width: "216px",
      teleported: !1,
      "popper-class": s.be("comment", "font-btn-popover")
    }, {
      reference: () => f("div", {
        class: {
          "vditor-textcss": !0
        }
      }, [ao]),
      default: () => f("div", {
        class: s.be("comment", "font-list")
      }, [f("button", {
        class: {
          "vditor-bold": !0
        },
        title: "加粗",
        onClick: (m) => it(m, "bold")
      }, [Kn]), f("button", {
        class: {
          "vditor-italic": !0
        },
        title: "斜体",
        onClick: (m) => it(m, "italic")
      }, [Xn]), f("button", {
        class: {
          "vditor-strike": !0
        },
        title: "删除线",
        onClick: (m) => it(m, "strike")
      }, [Zn]), f("button", {
        class: {
          "vditor-orderlist": !0
        },
        title: "有序列表",
        onClick: (m) => it(m, "ordered-list")
      }, [co]), f("button", {
        class: {
          "vditor-list": !0
        },
        title: "无序列表",
        onClick: (m) => it(m, "list")
      }, [lo]), f("button", {
        class: {
          "vditor-link": !0
        },
        title: "链接",
        onClick: (m) => it(m, "link")
      }, [Qn])])
    }), f("button", {
      class: {
        "vditor-code": !0
      },
      title: "代码块",
      onClick: (m) => it(m, "code")
    }, [go]), f("button", {
      class: {
        "vditor-mentionMember": !0
      },
      title: "提及成员",
      onClick: Ft
    }, [uo]), f("button", {
      class: {
        "vditor-mentioning": !0
      },
      title: "提及项",
      onClick: Dn
    }, [ho]), f(gt("el-popover"), {
      visible: be.value,
      "onUpdate:visible": (m) => be.value = m,
      width: "160px",
      teleported: !1
    }, {
      default: () => f("div", {
        class: [s.be("comment", "emoji-list"), s.is("disabled", !ve.value)]
      }, [bo.map((m) => f("button", {
        class: s.be("comment", "emoji-item"),
        onClick: () => ne(m)
      }, [m]))]),
      reference: () => f("button", {
        class: {
          "vditor-emoji": !0
        },
        title: "表情"
      }, [fo])
    })]), Ln = () => {
      if (r.reply.value) {
        const m = ds.execScriptFn({
          value: r.reply.value,
          controller: r
        }, r.replyScript, {
          singleRowReturn: !0,
          isAsync: !1
        });
        return f("div", {
          class: s.b("reply")
        }, [f("div", {
          class: s.be("reply", "content"),
          innerHTML: m
        }, null), f(gt("ion-icon"), {
          name: "close-outline",
          onClick: () => r.removeReply()
        }, null)]);
      }
    }, Xe = (m) => {
      if (zt.value) {
        const {
          container: I
        } = zt.value.$refs;
        if (I) {
          const _ = I.querySelector(".el-image-viewer__wrapper");
          _ == null || _[m]("keydown", xn);
        }
      }
    }, xn = async (m) => {
      (m.key === "Escape" || m.keyCode === 27) && (m.stopPropagation(), m.preventDefault(), await ie(), Xe("removeEventListener"), te.value = []);
    }, On = async () => {
      await ie(), Xe("addEventListener");
    };
    return {
      ns: s,
      c: r,
      editorId: i,
      vditorRef: o,
      previewRef: zt,
      loading: c,
      isInit: h,
      readonlyState: u,
      showHoverToolbar: p,
      hoverToolbarStyle: v,
      editorContentRef: l,
      hoverToolbarRef: d,
      handleInlineAiClick: An,
      handleToolbarClick: it,
      renderAvatar: ke,
      renderFooterToolbar: Tn,
      renderReply: Ln,
      renderPreview: () => f(gt("el-image"), {
        class: s.e("preview"),
        ref: "previewRef",
        "zoom-rate": 1.1,
        src: We.value,
        "preview-src-list": te.value,
        "hide-on-click-modal": !0,
        onShow: On,
        fit: "cover"
      }, null)
    };
  },
  render() {
    var t;
    let n = {};
    return this.c.collapsed.value && (n = this.ns.cssVarBlock({
      height: "".concat(this.controller.minHeight - 16, "px")
    })), f("div", {
      class: [this.ns.b(), this.ns.b("container"), this.ns.b("comment"), this.ns.is("disabled", this.readonlyState), this.ns.is("widescreen", !0), this.ns.is("loading", !this.isInit), this.ns.is("collapse", this.c.collapsed.value)],
      style: n
    }, [this.renderAvatar(), f("div", {
      ref: "editorContentRef",
      class: this.ns.be("comment", "content")
    }, [vr(f("div", {
      id: this.editorId,
      ref: "vditorRef",
      class: ["vditor", this.ns.b()]
    }, null), [[br("loading"), this.loading]]), this.renderReply(), this.renderFooterToolbar(), this.renderPreview()]), this.showHoverToolbar ? f("div", {
      ref: "hoverToolbarRef",
      style: this.hoverToolbarStyle,
      class: this.ns.e("hover-toolbar")
    }, [(t = this.controller) != null && t.chatCompletion ? f("button", {
      class: "vditor-inline-ai",
      title: "AI",
      onClick: this.handleInlineAiClick
    }, [kr]) : null, f("button", {
      class: "vditor-bold",
      title: "加粗",
      onClick: (e) => this.handleToolbarClick(e, "bold")
    }, [Kn]), f("button", {
      class: "vditor-italic",
      title: "斜体",
      onClick: (e) => this.handleToolbarClick(e, "italic")
    }, [Xn]), f("button", {
      class: "vditor-strike",
      title: "删除线",
      onClick: (e) => this.handleToolbarClick(e, "strike")
    }, [Zn]), f("button", {
      class: "vditor-link",
      title: "链接",
      onClick: (e) => this.handleToolbarClick(e, "link")
    }, [Qn])]) : null]);
  }
});
const yo = [
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
], et = () => /* @__PURE__ */ new Map(), ts = (n) => {
  const t = et();
  return n.forEach((e, s) => {
    t.set(s, e);
  }), t;
}, Et = (n, t, e) => {
  let s = n.get(t);
  return s === void 0 && n.set(t, s = e()), s;
}, Co = (n, t) => {
  const e = [];
  for (const [s, r] of n)
    e.push(t(r, s));
  return e;
}, ko = (n, t) => {
  for (const [e, s] of n)
    if (t(s, e))
      return !0;
  return !1;
}, Jt = () => /* @__PURE__ */ new Set(), Hn = (n) => n[n.length - 1], So = (n, t) => {
  for (let e = 0; e < t.length; e++)
    n.push(t[e]);
}, St = Array.from, Mo = Array.isArray;
class Eo {
  constructor() {
    this._observers = et();
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  on(t, e) {
    return Et(
      this._observers,
      /** @type {string} */
      t,
      Jt
    ).add(e), e;
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  once(t, e) {
    const s = (...r) => {
      this.off(
        t,
        /** @type {any} */
        s
      ), e(...r);
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
    return St((this._observers.get(t) || et()).values()).forEach((s) => s(...e));
  }
  destroy() {
    this._observers = et();
  }
}
let Io = class {
  constructor() {
    this._observers = et();
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  on(t, e) {
    Et(this._observers, t, Jt).add(e);
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  once(t, e) {
    const s = (...r) => {
      this.off(t, s), e(...r);
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
    return St((this._observers.get(t) || et()).values()).forEach((s) => s(...e));
  }
  destroy() {
    this._observers = et();
  }
};
const Mt = Math.floor, sn = Math.abs, Sr = (n, t) => n < t ? n : t, Xt = (n, t) => n > t ? n : t, Mr = (n) => n !== 0 ? n < 0 : 1 / n < 0, Bs = 1, zs = 2, $n = 4, Bn = 8, Le = 32, kt = 64, rt = 128, yn = 31, es = 63, Yt = 127, Ao = 2147483647, Er = Number.MAX_SAFE_INTEGER, Do = Number.isInteger || ((n) => typeof n == "number" && isFinite(n) && Mt(n) === n), _o = (n) => n.toLowerCase(), To = /^\s*/g, Lo = (n) => n.replace(To, ""), xo = /([A-Z])/g, Ns = (n, t) => Lo(n.replace(xo, (e) => "".concat(t).concat(_o(e)))), Oo = (n) => {
  const t = unescape(encodeURIComponent(n)), e = t.length, s = new Uint8Array(e);
  for (let r = 0; r < e; r++)
    s[r] = /** @type {number} */
    t.codePointAt(r);
  return s;
}, xe = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), Vo = (n) => xe.encode(n), Ro = xe ? Vo : Oo;
let Ie = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
Ie && Ie.decode(new Uint8Array()).length === 1 && (Ie = null);
let ze = class {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
};
const Ne = () => new ze(), Uo = (n) => {
  let t = n.cpos;
  for (let e = 0; e < n.bufs.length; e++)
    t += n.bufs[e].length;
  return t;
}, ht = (n) => {
  const t = new Uint8Array(Uo(n));
  let e = 0;
  for (let s = 0; s < n.bufs.length; s++) {
    const r = n.bufs[s];
    t.set(r, e), e += r.length;
  }
  return t.set(new Uint8Array(n.cbuf.buffer, 0, n.cpos), e), t;
}, Ho = (n, t) => {
  const e = n.cbuf.length;
  e - n.cpos < t && (n.bufs.push(new Uint8Array(n.cbuf.buffer, 0, n.cpos)), n.cbuf = new Uint8Array(Xt(e, t) * 2), n.cpos = 0);
}, q = (n, t) => {
  const e = n.cbuf.length;
  n.cpos === e && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(e * 2), n.cpos = 0), n.cbuf[n.cpos++] = t;
}, ns = q, D = (n, t) => {
  for (; t > Yt; )
    q(n, rt | Yt & t), t = Mt(t / 128);
  q(n, Yt & t);
}, gs = (n, t) => {
  const e = Mr(t);
  for (e && (t = -t), q(n, (t > es ? rt : 0) | (e ? kt : 0) | es & t), t = Mt(t / 64); t > 0; )
    q(n, (t > Yt ? rt : 0) | Yt & t), t = Mt(t / 128);
}, ss = new Uint8Array(3e4), $o = ss.length / 3, Bo = (n, t) => {
  if (t.length < $o) {
    const e = xe.encodeInto(t, ss).written || 0;
    D(n, e);
    for (let s = 0; s < e; s++)
      q(n, ss[s]);
  } else
    X(n, Ro(t));
}, zo = (n, t) => {
  const e = unescape(encodeURIComponent(t)), s = e.length;
  D(n, s);
  for (let r = 0; r < s; r++)
    q(
      n,
      /** @type {number} */
      e.codePointAt(r)
    );
}, qt = xe && /** @type {any} */
xe.encodeInto ? Bo : zo, Cn = (n, t) => {
  const e = n.cbuf.length, s = n.cpos, r = Sr(e - s, t.length), i = t.length - r;
  n.cbuf.set(t.subarray(0, r), s), n.cpos += r, i > 0 && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(Xt(e * 2, i)), n.cbuf.set(t.subarray(r)), n.cpos = i);
}, X = (n, t) => {
  D(n, t.byteLength), Cn(n, t);
}, ps = (n, t) => {
  Ho(n, t);
  const e = new DataView(n.cbuf.buffer, n.cpos, t);
  return n.cpos += t, e;
}, No = (n, t) => ps(n, 4).setFloat32(0, t, !1), Fo = (n, t) => ps(n, 8).setFloat64(0, t, !1), Po = (n, t) => (
  /** @type {any} */
  ps(n, 8).setBigInt64(0, t, !1)
), Fs = new DataView(new ArrayBuffer(4)), jo = (n) => (Fs.setFloat32(0, n), Fs.getFloat32(0) === n), Oe = (n, t) => {
  switch (typeof t) {
    case "string":
      q(n, 119), qt(n, t);
      break;
    case "number":
      Do(t) && sn(t) <= Ao ? (q(n, 125), gs(n, t)) : jo(t) ? (q(n, 124), No(n, t)) : (q(n, 123), Fo(n, t));
      break;
    case "bigint":
      q(n, 122), Po(n, t);
      break;
    case "object":
      if (t === null)
        q(n, 126);
      else if (Mo(t)) {
        q(n, 117), D(n, t.length);
        for (let e = 0; e < t.length; e++)
          Oe(n, t[e]);
      } else if (t instanceof Uint8Array)
        q(n, 116), X(n, t);
      else {
        q(n, 118);
        const e = Object.keys(t);
        D(n, e.length);
        for (let s = 0; s < e.length; s++) {
          const r = e[s];
          qt(n, r), Oe(n, t[r]);
        }
      }
      break;
    case "boolean":
      q(n, t ? 120 : 121);
      break;
    default:
      q(n, 127);
  }
};
class Ps extends ze {
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
    this.s === t ? this.count++ : (this.count > 0 && D(this, this.count - 1), this.count = 1, this.w(this, t), this.s = t);
  }
}
const js = (n) => {
  n.count > 0 && (gs(n.encoder, n.count === 1 ? n.s : -n.s), n.count > 1 && D(n.encoder, n.count - 2));
};
class rn {
  constructor() {
    this.encoder = new ze(), this.s = 0, this.count = 0;
  }
  /**
   * @param {number} v
   */
  write(t) {
    this.s === t ? this.count++ : (js(this), this.count = 1, this.s = t);
  }
  /**
   * Flush the encoded state and transform this to a Uint8Array.
   *
   * Note that this should only be called once.
   */
  toUint8Array() {
    return js(this), ht(this.encoder);
  }
}
const Ys = (n) => {
  if (n.count > 0) {
    const t = n.diff * 2 + (n.count === 1 ? 0 : 1);
    gs(n.encoder, t), n.count > 1 && D(n.encoder, n.count - 2);
  }
};
class zn {
  constructor() {
    this.encoder = new ze(), this.s = 0, this.count = 0, this.diff = 0;
  }
  /**
   * @param {number} v
   */
  write(t) {
    this.diff === t - this.s ? (this.s = t, this.count++) : (Ys(this), this.count = 1, this.diff = t - this.s, this.s = t);
  }
  /**
   * Flush the encoded state and transform this to a Uint8Array.
   *
   * Note that this should only be called once.
   */
  toUint8Array() {
    return Ys(this), ht(this.encoder);
  }
}
class Yo {
  constructor() {
    this.sarr = [], this.s = "", this.lensE = new rn();
  }
  /**
   * @param {string} string
   */
  write(t) {
    this.s += t, this.s.length > 19 && (this.sarr.push(this.s), this.s = ""), this.lensE.write(t.length);
  }
  toUint8Array() {
    const t = new ze();
    return this.sarr.push(this.s), this.s = "", qt(t, this.sarr.join("")), Cn(t, this.lensE.toUint8Array()), ht(t);
  }
}
const $t = (n) => new Error(n), pt = () => {
  throw $t("Method unimplemented");
}, mt = () => {
  throw $t("Unexpected case");
}, Ir = $t("Unexpected end of array"), Ar = $t("Integer out of Range");
let kn = class {
  /**
   * @param {Uint8Array} uint8Array Binary data to decode
   */
  constructor(t) {
    this.arr = t, this.pos = 0;
  }
};
const Zt = (n) => new kn(n), qo = (n) => n.pos !== n.arr.length, Jo = (n, t) => {
  const e = new Uint8Array(n.arr.buffer, n.pos + n.arr.byteOffset, t);
  return n.pos += t, e;
}, Z = (n) => Jo(n, A(n)), he = (n) => n.arr[n.pos++], A = (n) => {
  let t = 0, e = 1;
  const s = n.arr.length;
  for (; n.pos < s; ) {
    const r = n.arr[n.pos++];
    if (t = t + (r & Yt) * e, e *= 128, r < rt)
      return t;
    if (t > Er)
      throw Ar;
  }
  throw Ir;
}, ms = (n) => {
  let t = n.arr[n.pos++], e = t & es, s = 64;
  const r = (t & kt) > 0 ? -1 : 1;
  if (!(t & rt))
    return r * e;
  const i = n.arr.length;
  for (; n.pos < i; ) {
    if (t = n.arr[n.pos++], e = e + (t & Yt) * s, s *= 128, t < rt)
      return r * e;
    if (e > Er)
      throw Ar;
  }
  throw Ir;
}, Wo = (n) => {
  let t = A(n);
  if (t === 0)
    return "";
  {
    let e = String.fromCodePoint(he(n));
    if (--t < 100)
      for (; t--; )
        e += String.fromCodePoint(he(n));
    else
      for (; t > 0; ) {
        const s = t < 1e4 ? t : 1e4, r = n.arr.subarray(n.pos, n.pos + s);
        n.pos += s, e += String.fromCodePoint.apply(
          null,
          /** @type {any} */
          r
        ), t -= s;
      }
    return decodeURIComponent(escape(e));
  }
}, Go = (n) => (
  /** @type any */
  Ie.decode(Z(n))
), Ut = Ie ? Go : Wo, ws = (n, t) => {
  const e = new DataView(n.arr.buffer, n.arr.byteOffset + n.pos, t);
  return n.pos += t, e;
}, Ko = (n) => ws(n, 4).getFloat32(0, !1), Xo = (n) => ws(n, 8).getFloat64(0, !1), Zo = (n) => (
  /** @type {any} */
  ws(n, 8).getBigInt64(0, !1)
), Qo = [
  (n) => {
  },
  // CASE 127: undefined
  (n) => null,
  // CASE 126: null
  ms,
  // CASE 125: integer
  Ko,
  // CASE 124: float32
  Xo,
  // CASE 123: float64
  Zo,
  // CASE 122: bigint
  (n) => !1,
  // CASE 121: boolean (false)
  (n) => !0,
  // CASE 120: boolean (true)
  Ut,
  // CASE 119: string
  (n) => {
    const t = A(n), e = {};
    for (let s = 0; s < t; s++) {
      const r = Ut(n);
      e[r] = Ve(n);
    }
    return e;
  },
  (n) => {
    const t = A(n), e = [];
    for (let s = 0; s < t; s++)
      e.push(Ve(n));
    return e;
  },
  Z
  // CASE 116: Uint8Array
], Ve = (n) => Qo[127 - he(n)](n);
class qs extends kn {
  /**
   * @param {Uint8Array} uint8Array
   * @param {function(Decoder):T} reader
   */
  constructor(t, e) {
    super(t), this.reader = e, this.s = null, this.count = 0;
  }
  read() {
    return this.count === 0 && (this.s = this.reader(this), qo(this) ? this.count = A(this) + 1 : this.count = -1), this.count--, /** @type {T} */
    this.s;
  }
}
class on extends kn {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(t) {
    super(t), this.s = 0, this.count = 0;
  }
  read() {
    if (this.count === 0) {
      this.s = ms(this);
      const t = Mr(this.s);
      this.count = 1, t && (this.s = -this.s, this.count = A(this) + 2);
    }
    return this.count--, /** @type {number} */
    this.s;
  }
}
class Nn extends kn {
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
      const t = ms(this), e = t & 1;
      this.diff = Mt(t / 2), this.count = 1, e && (this.count = A(this) + 2);
    }
    return this.s += this.diff, this.count--, this.s;
  }
}
class tl {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(t) {
    this.decoder = new on(t), this.str = Ut(this.decoder), this.spos = 0;
  }
  /**
   * @return {string}
   */
  read() {
    const t = this.spos + this.decoder.read(), e = this.str.slice(this.spos, t);
    return this.spos = t, e;
  }
}
const el = crypto.getRandomValues.bind(crypto), Dr = () => el(new Uint32Array(1))[0], nl = [1e7] + -1e3 + -4e3 + -8e3 + -1e11, sl = () => nl.replace(
  /[018]/g,
  /** @param {number} c */
  (n) => (n ^ Dr() & 15 >> n / 4).toString(16)
), dn = Date.now, Js = (n) => (
  /** @type {Promise<T>} */
  new Promise(n)
);
Promise.all.bind(Promise);
const Ws = (n) => n === void 0 ? null : n;
let rl = class {
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
}, _r = new rl(), il = !0;
try {
  typeof localStorage < "u" && localStorage && (_r = localStorage, il = !1);
} catch (n) {
}
const ol = _r, ll = Object.assign, Tr = Object.keys, cl = (n, t) => {
  for (const e in n)
    t(n[e], e);
}, Gs = (n) => Tr(n).length, Ks = (n) => Tr(n).length, al = (n) => {
  for (const t in n)
    return !1;
  return !0;
}, hl = (n, t) => {
  for (const e in n)
    if (!t(n[e], e))
      return !1;
  return !0;
}, Lr = (n, t) => Object.prototype.hasOwnProperty.call(n, t), dl = (n, t) => n === t || Ks(n) === Ks(t) && hl(n, (e, s) => (e !== void 0 || Lr(t, s)) && t[s] === e), vs = (n, t, e = 0) => {
  try {
    for (; e < n.length; e++)
      n[e](...t);
  } finally {
    e < n.length && vs(n, t, e + 1);
  }
}, ul = (n) => n, fl = (n, t) => n === t, Ae = (n, t) => {
  if (n == null || t == null)
    return fl(n, t);
  if (n.constructor !== t.constructor)
    return !1;
  if (n === t)
    return !0;
  switch (n.constructor) {
    case ArrayBuffer:
      n = new Uint8Array(n), t = new Uint8Array(t);
    case Uint8Array: {
      if (n.byteLength !== t.byteLength)
        return !1;
      for (let e = 0; e < n.length; e++)
        if (n[e] !== t[e])
          return !1;
      break;
    }
    case Set: {
      if (n.size !== t.size)
        return !1;
      for (const e of n)
        if (!t.has(e))
          return !1;
      break;
    }
    case Map: {
      if (n.size !== t.size)
        return !1;
      for (const e of n.keys())
        if (!t.has(e) || !Ae(n.get(e), t.get(e)))
          return !1;
      break;
    }
    case Object:
      if (Gs(n) !== Gs(t))
        return !1;
      for (const e in n)
        if (!Lr(n, e) || !Ae(n[e], t[e]))
          return !1;
      break;
    case Array:
      if (n.length !== t.length)
        return !1;
      for (let e = 0; e < n.length; e++)
        if (!Ae(n[e], t[e]))
          return !1;
      break;
    default:
      return !1;
  }
  return !0;
}, gl = (n, t) => t.includes(n), Re = typeof process < "u" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]";
let ut;
const pl = () => {
  if (ut === void 0)
    if (Re) {
      ut = et();
      const n = process.argv;
      let t = null;
      for (let e = 0; e < n.length; e++) {
        const s = n[e];
        s[0] === "-" ? (t !== null && ut.set(t, ""), t = s) : t !== null && (ut.set(t, s), t = null);
      }
      t !== null && ut.set(t, "");
    } else
      typeof location == "object" ? (ut = et(), (location.search || "?").slice(1).split("&").forEach((n) => {
        if (n.length !== 0) {
          const [t, e] = n.split("=");
          ut.set("--".concat(Ns(t, "-")), e), ut.set("-".concat(Ns(t, "-")), e);
        }
      })) : ut = et();
  return ut;
}, rs = (n) => pl().has(n), is = (n) => Ws(Re ? process.env[n.toUpperCase().replaceAll("-", "_")] : ol.getItem(n)), xr = (n) => rs("--" + n) || is(n) !== null;
xr("production");
const ml = Re && gl(process.env.FORCE_COLOR, ["true", "1", "2"]), wl = ml || !rs("--no-colors") && // @todo deprecate --no-colors
!xr("no-color") && (!Re || process.stdout.isTTY) && (!Re || rs("--color") || is("COLORTERM") !== null || (is("TERM") || "").includes("color")), vl = (n) => new Uint8Array(n), bl = (n) => {
  const t = vl(n.byteLength);
  return t.set(n), t;
};
class yl {
  /**
   * @param {L} left
   * @param {R} right
   */
  constructor(t, e) {
    this.left = t, this.right = e;
  }
}
const Ct = (n, t) => new yl(n, t);
typeof DOMParser < "u" && new DOMParser();
const Cl = (n) => Co(n, (t, e) => "".concat(e, ":").concat(t, ";")).join(""), It = Symbol, Or = It(), Vr = It(), kl = It(), Sl = It(), Ml = It(), Rr = It(), El = It(), Ur = It(), Il = It(), Al = (n) => {
  var r;
  n.length === 1 && ((r = n[0]) == null ? void 0 : r.constructor) === Function && (n = /** @type {Array<string|Symbol|Object|number>} */
  /** @type {[function]} */
  n[0]());
  const t = [], e = [];
  let s = 0;
  for (; s < n.length; s++) {
    const i = n[s];
    if (i === void 0)
      break;
    if (i.constructor === String || i.constructor === Number)
      t.push(i);
    else if (i.constructor === Object)
      break;
  }
  for (s > 0 && e.push(t.join("")); s < n.length; s++) {
    const i = n[s];
    i instanceof Symbol || e.push(i);
  }
  return e;
}, Dl = {
  [Or]: Ct("font-weight", "bold"),
  [Vr]: Ct("font-weight", "normal"),
  [kl]: Ct("color", "blue"),
  [Ml]: Ct("color", "green"),
  [Sl]: Ct("color", "grey"),
  [Rr]: Ct("color", "red"),
  [El]: Ct("color", "purple"),
  [Ur]: Ct("color", "orange"),
  // not well supported in chrome when debugging node with inspector - TODO: deprecate
  [Il]: Ct("color", "black")
}, _l = (n) => {
  var o;
  n.length === 1 && ((o = n[0]) == null ? void 0 : o.constructor) === Function && (n = /** @type {Array<string|Symbol|Object|number>} */
  /** @type {[function]} */
  n[0]());
  const t = [], e = [], s = et();
  let r = [], i = 0;
  for (; i < n.length; i++) {
    const l = n[i], c = Dl[l];
    if (c !== void 0)
      s.set(c.left, c.right);
    else {
      if (l === void 0)
        break;
      if (l.constructor === String || l.constructor === Number) {
        const h = Cl(s);
        i > 0 || h.length > 0 ? (t.push("%c" + l), e.push(h)) : t.push(l);
      } else
        break;
    }
  }
  for (i > 0 && (r = e, r.unshift(t.join(""))); i < n.length; i++) {
    const l = n[i];
    l instanceof Symbol || r.push(l);
  }
  return r;
}, Tl = wl ? _l : Al, Ll = (...n) => {
  console.log(...Tl(n)), xl.forEach((t) => t.print(n));
}, xl = Jt(), Hr = (n) => ({
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator]() {
    return this;
  },
  // @ts-ignore
  next: n
}), Ol = (n, t) => Hr(() => {
  let e;
  do
    e = n.next();
  while (!e.done && !t(e.value));
  return e;
}), Fn = (n, t) => Hr(() => {
  const { done: e, value: s } = n.next();
  return { done: e, value: e ? void 0 : t(s) };
});
class bs {
  /**
   * @param {number} clock
   * @param {number} len
   */
  constructor(t, e) {
    this.clock = t, this.len = e;
  }
}
class Fe {
  constructor() {
    this.clients = /* @__PURE__ */ new Map();
  }
}
const $r = (n, t, e) => t.clients.forEach((s, r) => {
  const i = (
    /** @type {Array<GC|Item>} */
    n.doc.store.clients.get(r)
  );
  for (let o = 0; o < s.length; o++) {
    const l = s[o];
    Xr(n, i, l.clock, l.len, e);
  }
}), Vl = (n, t) => {
  let e = 0, s = n.length - 1;
  for (; e <= s; ) {
    const r = Mt((e + s) / 2), i = n[r], o = i.clock;
    if (o <= t) {
      if (t < o + i.len)
        return r;
      e = r + 1;
    } else
      s = r - 1;
  }
  return null;
}, Br = (n, t) => {
  const e = n.clients.get(t.client);
  return e !== void 0 && Vl(e, t.clock) !== null;
}, ys = (n) => {
  n.clients.forEach((t) => {
    t.sort((r, i) => r.clock - i.clock);
    let e, s;
    for (e = 1, s = 1; e < t.length; e++) {
      const r = t[s - 1], i = t[e];
      r.clock + r.len >= i.clock ? r.len = Xt(r.len, i.clock + i.len - r.clock) : (s < e && (t[s] = i), s++);
    }
    t.length = s;
  });
}, Rl = (n) => {
  const t = new Fe();
  for (let e = 0; e < n.length; e++)
    n[e].clients.forEach((s, r) => {
      if (!t.clients.has(r)) {
        const i = s.slice();
        for (let o = e + 1; o < n.length; o++)
          So(i, n[o].clients.get(r) || []);
        t.clients.set(r, i);
      }
    });
  return ys(t), t;
}, un = (n, t, e, s) => {
  Et(n.clients, t, () => (
    /** @type {Array<DeleteItem>} */
    []
  )).push(new bs(e, s));
}, Ul = () => new Fe(), Hl = (n) => {
  const t = Ul();
  return n.clients.forEach((e, s) => {
    const r = [];
    for (let i = 0; i < e.length; i++) {
      const o = e[i];
      if (o.deleted) {
        const l = o.id.clock;
        let c = o.length;
        if (i + 1 < e.length)
          for (let h = e[i + 1]; i + 1 < e.length && h.deleted; h = e[++i + 1])
            c += h.length;
        r.push(new bs(l, c));
      }
    }
    r.length > 0 && t.clients.set(s, r);
  }), t;
}, pe = (n, t) => {
  D(n.restEncoder, t.clients.size), St(t.clients.entries()).sort((e, s) => s[0] - e[0]).forEach(([e, s]) => {
    n.resetDsCurVal(), D(n.restEncoder, e);
    const r = s.length;
    D(n.restEncoder, r);
    for (let i = 0; i < r; i++) {
      const o = s[i];
      n.writeDsClock(o.clock), n.writeDsLen(o.len);
    }
  });
}, Cs = (n) => {
  const t = new Fe(), e = A(n.restDecoder);
  for (let s = 0; s < e; s++) {
    n.resetDsCurVal();
    const r = A(n.restDecoder), i = A(n.restDecoder);
    if (i > 0) {
      const o = Et(t.clients, r, () => (
        /** @type {Array<DeleteItem>} */
        []
      ));
      for (let l = 0; l < i; l++)
        o.push(new bs(n.readDsClock(), n.readDsLen()));
    }
  }
  return t;
}, Xs = (n, t, e) => {
  const s = new Fe(), r = A(n.restDecoder);
  for (let i = 0; i < r; i++) {
    n.resetDsCurVal();
    const o = A(n.restDecoder), l = A(n.restDecoder), c = e.clients.get(o) || [], h = J(e, o);
    for (let a = 0; a < l; a++) {
      const u = n.readDsClock(), d = u + n.readDsLen();
      if (u < h) {
        h < d && un(s, o, h, d - h);
        let g = wt(c, u), p = c[g];
        for (!p.deleted && p.id.clock < u && (c.splice(g + 1, 0, bn(t, p, u - p.id.clock)), g++); g < c.length && (p = c[g++], p.id.clock < d); )
          p.deleted || (d < p.id.clock + p.length && c.splice(g, 0, bn(t, p, d - p.id.clock)), p.delete(t));
      } else
        un(s, o, u, d - u);
    }
  }
  if (s.clients.size > 0) {
    const i = new Wt();
    return D(i.restEncoder, 0), pe(i, s), i.toUint8Array();
  }
  return null;
}, zr = Dr;
class me extends Eo {
  /**
   * @param {DocOpts} opts configuration
   */
  constructor({ guid: t = sl(), collectionid: e = null, gc: s = !0, gcFilter: r = () => !0, meta: i = null, autoLoad: o = !1, shouldLoad: l = !0 } = {}) {
    super(), this.gc = s, this.gcFilter = r, this.clientID = zr(), this.guid = t, this.collectionid = e, this.share = /* @__PURE__ */ new Map(), this.store = new Gr(), this._transaction = null, this._transactionCleanups = [], this.subdocs = /* @__PURE__ */ new Set(), this._item = null, this.shouldLoad = l, this.autoLoad = o, this.meta = i, this.isLoaded = !1, this.isSynced = !1, this.whenLoaded = Js((h) => {
      this.on("load", () => {
        this.isLoaded = !0, h(this);
      });
    });
    const c = () => Js((h) => {
      const a = (u) => {
        (u === void 0 || u === !0) && (this.off("sync", a), h());
      };
      this.on("sync", a);
    });
    this.on("sync", (h) => {
      h === !1 && this.isSynced && (this.whenSynced = c()), this.isSynced = h === void 0 || h === !0, this.isSynced && !this.isLoaded && this.emit("load", [this]);
    }), this.whenSynced = c();
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
    t !== null && !this.shouldLoad && R(
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
    return new Set(St(this.subdocs).map((t) => t.guid));
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
    return R(this, t, e);
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
    const s = Et(this.share, t, () => {
      const i = new e();
      return i._integrate(this, null), i;
    }), r = s.constructor;
    if (e !== W && r !== e)
      if (r === W) {
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
      this.get(t, le)
    );
  }
  /**
   * @param {string} [name]
   * @return {YText}
   *
   * @public
   */
  getText(t = "") {
    return this.get(t, fe);
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
      this.get(t, ue)
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
      this.get(t, ge)
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
    St(this.subdocs).forEach((e) => e.destroy());
    const t = this._item;
    if (t !== null) {
      this._item = null;
      const e = (
        /** @type {ContentDoc} */
        t.content
      );
      e.doc = new me({ guid: this.guid, ...e.opts, shouldLoad: !1 }), e.doc._item = t, R(
        /** @type {any} */
        t.parent.doc,
        (s) => {
          const r = e.doc;
          t.deleted || s.subdocsAdded.add(r), s.subdocsRemoved.add(this);
        },
        null,
        !0
      );
    }
    this.emit("destroyed", [!0]), this.emit("destroy", [this]), super.destroy();
  }
}
class Nr {
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
    return A(this.restDecoder);
  }
  /**
   * @return {number}
   */
  readDsLen() {
    return A(this.restDecoder);
  }
}
class Fr extends Nr {
  /**
   * @return {ID}
   */
  readLeftID() {
    return T(A(this.restDecoder), A(this.restDecoder));
  }
  /**
   * @return {ID}
   */
  readRightID() {
    return T(A(this.restDecoder), A(this.restDecoder));
  }
  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient() {
    return A(this.restDecoder);
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo() {
    return he(this.restDecoder);
  }
  /**
   * @return {string}
   */
  readString() {
    return Ut(this.restDecoder);
  }
  /**
   * @return {boolean} isKey
   */
  readParentInfo() {
    return A(this.restDecoder) === 1;
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readTypeRef() {
    return A(this.restDecoder);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number} len
   */
  readLen() {
    return A(this.restDecoder);
  }
  /**
   * @return {any}
   */
  readAny() {
    return Ve(this.restDecoder);
  }
  /**
   * @return {Uint8Array}
   */
  readBuf() {
    return bl(Z(this.restDecoder));
  }
  /**
   * Legacy implementation uses JSON parse. We use any-decoding in v2.
   *
   * @return {any}
   */
  readJSON() {
    return JSON.parse(Ut(this.restDecoder));
  }
  /**
   * @return {string}
   */
  readKey() {
    return Ut(this.restDecoder);
  }
}
class $l {
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
    return this.dsCurrVal += A(this.restDecoder), this.dsCurrVal;
  }
  /**
   * @return {number}
   */
  readDsLen() {
    const t = A(this.restDecoder) + 1;
    return this.dsCurrVal += t, t;
  }
}
class de extends $l {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(t) {
    super(t), this.keys = [], A(t), this.keyClockDecoder = new Nn(Z(t)), this.clientDecoder = new on(Z(t)), this.leftClockDecoder = new Nn(Z(t)), this.rightClockDecoder = new Nn(Z(t)), this.infoDecoder = new qs(Z(t), he), this.stringDecoder = new tl(Z(t)), this.parentInfoDecoder = new qs(Z(t), he), this.typeRefDecoder = new on(Z(t)), this.lenDecoder = new on(Z(t));
  }
  /**
   * @return {ID}
   */
  readLeftID() {
    return new oe(this.clientDecoder.read(), this.leftClockDecoder.read());
  }
  /**
   * @return {ID}
   */
  readRightID() {
    return new oe(this.clientDecoder.read(), this.rightClockDecoder.read());
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
    return Ve(this.restDecoder);
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
    return Ve(this.restDecoder);
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
class Pr {
  constructor() {
    this.restEncoder = Ne();
  }
  toUint8Array() {
    return ht(this.restEncoder);
  }
  resetDsCurVal() {
  }
  /**
   * @param {number} clock
   */
  writeDsClock(t) {
    D(this.restEncoder, t);
  }
  /**
   * @param {number} len
   */
  writeDsLen(t) {
    D(this.restEncoder, t);
  }
}
class Pe extends Pr {
  /**
   * @param {ID} id
   */
  writeLeftID(t) {
    D(this.restEncoder, t.client), D(this.restEncoder, t.clock);
  }
  /**
   * @param {ID} id
   */
  writeRightID(t) {
    D(this.restEncoder, t.client), D(this.restEncoder, t.clock);
  }
  /**
   * Use writeClient and writeClock instead of writeID if possible.
   * @param {number} client
   */
  writeClient(t) {
    D(this.restEncoder, t);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo(t) {
    ns(this.restEncoder, t);
  }
  /**
   * @param {string} s
   */
  writeString(t) {
    qt(this.restEncoder, t);
  }
  /**
   * @param {boolean} isYKey
   */
  writeParentInfo(t) {
    D(this.restEncoder, t ? 1 : 0);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef(t) {
    D(this.restEncoder, t);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen(t) {
    D(this.restEncoder, t);
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
    X(this.restEncoder, t);
  }
  /**
   * @param {any} embed
   */
  writeJSON(t) {
    qt(this.restEncoder, JSON.stringify(t));
  }
  /**
   * @param {string} key
   */
  writeKey(t) {
    qt(this.restEncoder, t);
  }
}
class jr {
  constructor() {
    this.restEncoder = Ne(), this.dsCurrVal = 0;
  }
  toUint8Array() {
    return ht(this.restEncoder);
  }
  resetDsCurVal() {
    this.dsCurrVal = 0;
  }
  /**
   * @param {number} clock
   */
  writeDsClock(t) {
    const e = t - this.dsCurrVal;
    this.dsCurrVal = t, D(this.restEncoder, e);
  }
  /**
   * @param {number} len
   */
  writeDsLen(t) {
    t === 0 && mt(), D(this.restEncoder, t - 1), this.dsCurrVal += t;
  }
}
class Wt extends jr {
  constructor() {
    super(), this.keyMap = /* @__PURE__ */ new Map(), this.keyClock = 0, this.keyClockEncoder = new zn(), this.clientEncoder = new rn(), this.leftClockEncoder = new zn(), this.rightClockEncoder = new zn(), this.infoEncoder = new Ps(ns), this.stringEncoder = new Yo(), this.parentInfoEncoder = new Ps(ns), this.typeRefEncoder = new rn(), this.lenEncoder = new rn();
  }
  toUint8Array() {
    const t = Ne();
    return D(t, 0), X(t, this.keyClockEncoder.toUint8Array()), X(t, this.clientEncoder.toUint8Array()), X(t, this.leftClockEncoder.toUint8Array()), X(t, this.rightClockEncoder.toUint8Array()), X(t, ht(this.infoEncoder)), X(t, this.stringEncoder.toUint8Array()), X(t, ht(this.parentInfoEncoder)), X(t, this.typeRefEncoder.toUint8Array()), X(t, this.lenEncoder.toUint8Array()), Cn(t, ht(this.restEncoder)), ht(t);
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
    X(this.restEncoder, t);
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
const Bl = (n, t, e, s) => {
  s = Xt(s, t[0].id.clock);
  const r = wt(t, s);
  D(n.restEncoder, t.length - r), n.writeClient(e), D(n.restEncoder, s);
  const i = t[r];
  i.write(n, s - i.id.clock);
  for (let o = r + 1; o < t.length; o++)
    t[o].write(n, 0);
}, ks = (n, t, e) => {
  const s = /* @__PURE__ */ new Map();
  e.forEach((r, i) => {
    J(t, i) > r && s.set(i, r);
  }), Sn(t).forEach((r, i) => {
    e.has(i) || s.set(i, 0);
  }), D(n.restEncoder, s.size), St(s.entries()).sort((r, i) => i[0] - r[0]).forEach(([r, i]) => {
    Bl(
      n,
      /** @type {Array<GC|Item>} */
      t.clients.get(r),
      r,
      i
    );
  });
}, zl = (n, t) => {
  const e = et(), s = A(n.restDecoder);
  for (let r = 0; r < s; r++) {
    const i = A(n.restDecoder), o = new Array(i), l = n.readClient();
    let c = A(n.restDecoder);
    e.set(l, { i: 0, refs: o });
    for (let h = 0; h < i; h++) {
      const a = n.readInfo();
      switch (yn & a) {
        case 0: {
          const u = n.readLen();
          o[h] = new lt(T(l, c), u), c += u;
          break;
        }
        case 10: {
          const u = A(n.restDecoder);
          o[h] = new ct(T(l, c), u), c += u;
          break;
        }
        default: {
          const u = (a & (kt | rt)) === 0, d = new F(
            T(l, c),
            null,
            // left
            (a & rt) === rt ? n.readLeftID() : null,
            // origin
            null,
            // right
            (a & kt) === kt ? n.readRightID() : null,
            // right origin
            u ? n.readParentInfo() ? t.get(n.readString()) : n.readLeftID() : null,
            // parent
            u && (a & Le) === Le ? n.readString() : null,
            // parentSub
            mi(n, a)
            // item content
          );
          o[h] = d, c += d.length;
        }
      }
    }
  }
  return e;
}, Nl = (n, t, e) => {
  const s = [];
  let r = St(e.keys()).sort((g, p) => g - p);
  if (r.length === 0)
    return null;
  const i = () => {
    if (r.length === 0)
      return null;
    let g = (
      /** @type {{i:number,refs:Array<GC|Item>}} */
      e.get(r[r.length - 1])
    );
    for (; g.refs.length === g.i; )
      if (r.pop(), r.length > 0)
        g = /** @type {{i:number,refs:Array<GC|Item>}} */
        e.get(r[r.length - 1]);
      else
        return null;
    return g;
  };
  let o = i();
  if (o === null)
    return null;
  const l = new Gr(), c = /* @__PURE__ */ new Map(), h = (g, p) => {
    const v = c.get(g);
    (v == null || v > p) && c.set(g, p);
  };
  let a = (
    /** @type {any} */
    o.refs[
      /** @type {any} */
      o.i++
    ]
  );
  const u = /* @__PURE__ */ new Map(), d = () => {
    for (const g of s) {
      const p = g.id.client, v = e.get(p);
      v ? (v.i--, l.clients.set(p, v.refs.slice(v.i)), e.delete(p), v.i = 0, v.refs = []) : l.clients.set(p, [g]), r = r.filter((b) => b !== p);
    }
    s.length = 0;
  };
  for (; ; ) {
    if (a.constructor !== ct) {
      const p = Et(u, a.id.client, () => J(t, a.id.client)) - a.id.clock;
      if (p < 0)
        s.push(a), h(a.id.client, a.id.clock - 1), d();
      else {
        const v = a.getMissing(n, t);
        if (v !== null) {
          s.push(a);
          const b = e.get(
            /** @type {number} */
            v
          ) || { refs: [], i: 0 };
          if (b.refs.length === b.i)
            h(
              /** @type {number} */
              v,
              J(t, v)
            ), d();
          else {
            a = b.refs[b.i++];
            continue;
          }
        } else
          (p === 0 || p < a.length) && (a.integrate(n, p), u.set(a.id.client, a.id.clock + a.length));
      }
    }
    if (s.length > 0)
      a = /** @type {GC|Item} */
      s.pop();
    else if (o !== null && o.i < o.refs.length)
      a = /** @type {GC|Item} */
      o.refs[o.i++];
    else {
      if (o = i(), o === null)
        break;
      a = /** @type {GC|Item} */
      o.refs[o.i++];
    }
  }
  if (l.clients.size > 0) {
    const g = new Wt();
    return ks(g, l, /* @__PURE__ */ new Map()), D(g.restEncoder, 0), { missing: c, update: g.toUint8Array() };
  }
  return null;
}, Fl = (n, t) => ks(n, t.doc.store, t.beforeState), Pl = (n, t, e, s = new de(n)) => R(t, (r) => {
  r.local = !1;
  let i = !1;
  const o = r.doc, l = o.store, c = zl(s, o), h = Nl(r, l, c), a = l.pendingStructs;
  if (a) {
    for (const [d, g] of a.missing)
      if (g < J(l, d)) {
        i = !0;
        break;
      }
    if (h) {
      for (const [d, g] of h.missing) {
        const p = a.missing.get(d);
        (p == null || p > g) && a.missing.set(d, g);
      }
      a.update = fn([a.update, h.update]);
    }
  } else
    l.pendingStructs = h;
  const u = Xs(s, r, l);
  if (l.pendingDs) {
    const d = new de(Zt(l.pendingDs));
    A(d.restDecoder);
    const g = Xs(d, r, l);
    u && g ? l.pendingDs = fn([u, g]) : l.pendingDs = u || g;
  } else
    l.pendingDs = u;
  if (i) {
    const d = (
      /** @type {{update: Uint8Array}} */
      l.pendingStructs.update
    );
    l.pendingStructs = null, Yr(r.doc, d);
  }
}, e, !1), Yr = (n, t, e, s = de) => {
  const r = Zt(t);
  Pl(r, n, e, new s(r));
}, jl = (n, t, e) => Yr(n, t, e, Fr), Yl = (n, t, e = /* @__PURE__ */ new Map()) => {
  ks(n, t.store, e), pe(n, Hl(t.store));
}, ql = (n, t = new Uint8Array([0]), e = new Wt()) => {
  const s = qr(t);
  Yl(e, n, s);
  const r = [e.toUint8Array()];
  if (n.store.pendingDs && r.push(n.store.pendingDs), n.store.pendingStructs && r.push(cc(n.store.pendingStructs.update, t)), r.length > 1) {
    if (e.constructor === Pe)
      return oc(r.map((i, o) => o === 0 ? i : hc(i)));
    if (e.constructor === Wt)
      return fn(r);
  }
  return r[0];
}, Jl = (n, t) => ql(n, t, new Pe()), Wl = (n) => {
  const t = /* @__PURE__ */ new Map(), e = A(n.restDecoder);
  for (let s = 0; s < e; s++) {
    const r = A(n.restDecoder), i = A(n.restDecoder);
    t.set(r, i);
  }
  return t;
}, qr = (n) => Wl(new Nr(Zt(n))), Jr = (n, t) => (D(n.restEncoder, t.size), St(t.entries()).sort((e, s) => s[0] - e[0]).forEach(([e, s]) => {
  D(n.restEncoder, e), D(n.restEncoder, s);
}), n), Gl = (n, t) => Jr(n, Sn(t.store)), Kl = (n, t = new jr()) => (n instanceof Map ? Jr(t, n) : Gl(t, n), t.toUint8Array()), Xl = (n) => Kl(n, new Pr());
class Zl {
  constructor() {
    this.l = [];
  }
}
const Zs = () => new Zl(), Qs = (n, t) => n.l.push(t), tr = (n, t) => {
  const e = n.l, s = e.length;
  n.l = e.filter((r) => t !== r), s === n.l.length && console.error("[yjs] Tried to remove event handler that doesn't exist.");
}, Wr = (n, t, e) => vs(n.l, [t, e]);
class oe {
  /**
   * @param {number} client client id
   * @param {number} clock unique per client id, continuous number
   */
  constructor(t, e) {
    this.client = t, this.clock = e;
  }
}
const tn = (n, t) => n === t || n !== null && t !== null && n.client === t.client && n.clock === t.clock, T = (n, t) => new oe(n, t), Ql = (n) => {
  for (const [t, e] of n.doc.share.entries())
    if (e === n)
      return t;
  throw mt();
}, se = (n, t) => t === void 0 ? !n.deleted : t.sv.has(n.id.client) && (t.sv.get(n.id.client) || 0) > n.id.clock && !Br(t.ds, n.id), os = (n, t) => {
  const e = Et(n.meta, os, Jt), s = n.doc.store;
  e.has(t) || (t.sv.forEach((r, i) => {
    r < J(s, i) && Bt(n, T(i, r));
  }), $r(n, t.ds, (r) => {
  }), e.add(t));
};
class Gr {
  constructor() {
    this.clients = /* @__PURE__ */ new Map(), this.pendingStructs = null, this.pendingDs = null;
  }
}
const Sn = (n) => {
  const t = /* @__PURE__ */ new Map();
  return n.clients.forEach((e, s) => {
    const r = e[e.length - 1];
    t.set(s, r.id.clock + r.length);
  }), t;
}, J = (n, t) => {
  const e = n.clients.get(t);
  if (e === void 0)
    return 0;
  const s = e[e.length - 1];
  return s.id.clock + s.length;
}, Kr = (n, t) => {
  let e = n.clients.get(t.id.client);
  if (e === void 0)
    e = [], n.clients.set(t.id.client, e);
  else {
    const s = e[e.length - 1];
    if (s.id.clock + s.length !== t.id.clock)
      throw mt();
  }
  e.push(t);
}, wt = (n, t) => {
  let e = 0, s = n.length - 1, r = n[s], i = r.id.clock;
  if (i === t)
    return s;
  let o = Mt(t / (i + r.length - 1) * s);
  for (; e <= s; ) {
    if (r = n[o], i = r.id.clock, i <= t) {
      if (t < i + r.length)
        return o;
      e = o + 1;
    } else
      s = o - 1;
    o = Mt((e + s) / 2);
  }
  throw mt();
}, tc = (n, t) => {
  const e = n.clients.get(t.client);
  return e[wt(e, t.clock)];
}, Pn = (
  /** @type {function(StructStore,ID):Item} */
  tc
), ls = (n, t, e) => {
  const s = wt(t, e), r = t[s];
  return r.id.clock < e && r instanceof F ? (t.splice(s + 1, 0, bn(n, r, e - r.id.clock)), s + 1) : s;
}, Bt = (n, t) => {
  const e = (
    /** @type {Array<Item>} */
    n.doc.store.clients.get(t.client)
  );
  return e[ls(n, e, t.clock)];
}, er = (n, t, e) => {
  const s = t.clients.get(e.client), r = wt(s, e.clock), i = s[r];
  return e.clock !== i.id.clock + i.length - 1 && i.constructor !== lt && s.splice(r + 1, 0, bn(n, i, e.clock - i.id.clock + 1)), i;
}, ec = (n, t, e) => {
  const s = (
    /** @type {Array<GC|Item>} */
    n.clients.get(t.id.client)
  );
  s[wt(s, t.id.clock)] = e;
}, Xr = (n, t, e, s, r) => {
  if (s === 0)
    return;
  const i = e + s;
  let o = ls(n, t, e), l;
  do
    l = t[o++], i < l.id.clock + l.length && ls(n, t, i), r(l);
  while (o < t.length && t[o].id.clock < i);
};
class nc {
  /**
   * @param {Doc} doc
   * @param {any} origin
   * @param {boolean} local
   */
  constructor(t, e, s) {
    this.doc = t, this.deleteSet = new Fe(), this.beforeState = Sn(t.store), this.afterState = /* @__PURE__ */ new Map(), this.changed = /* @__PURE__ */ new Map(), this.changedParentTypes = /* @__PURE__ */ new Map(), this._mergeStructs = [], this.origin = e, this.meta = /* @__PURE__ */ new Map(), this.local = s, this.subdocsAdded = /* @__PURE__ */ new Set(), this.subdocsRemoved = /* @__PURE__ */ new Set(), this.subdocsLoaded = /* @__PURE__ */ new Set(), this._needFormattingCleanup = !1;
  }
}
const nr = (n, t) => t.deleteSet.clients.size === 0 && !ko(t.afterState, (e, s) => t.beforeState.get(s) !== e) ? !1 : (ys(t.deleteSet), Fl(n, t), pe(n, t.deleteSet), !0), sr = (n, t, e) => {
  const s = t._item;
  (s === null || s.id.clock < (n.beforeState.get(s.id.client) || 0) && !s.deleted) && Et(n.changed, t, Jt).add(e);
}, ln = (n, t) => {
  let e = n[t], s = n[t - 1], r = t;
  for (; r > 0; e = s, s = n[--r - 1]) {
    if (s.deleted === e.deleted && s.constructor === e.constructor && s.mergeWith(e)) {
      e instanceof F && e.parentSub !== null && /** @type {AbstractType<any>} */
      e.parent._map.get(e.parentSub) === e && e.parent._map.set(
        e.parentSub,
        /** @type {Item} */
        s
      );
      continue;
    }
    break;
  }
  const i = t - r;
  return i && n.splice(t + 1 - i, i), i;
}, sc = (n, t, e) => {
  for (const [s, r] of n.clients.entries()) {
    const i = (
      /** @type {Array<GC|Item>} */
      t.clients.get(s)
    );
    for (let o = r.length - 1; o >= 0; o--) {
      const l = r[o], c = l.clock + l.len;
      for (let h = wt(i, l.clock), a = i[h]; h < i.length && a.id.clock < c; a = i[++h]) {
        const u = i[h];
        if (l.clock + l.len <= u.id.clock)
          break;
        u instanceof F && u.deleted && !u.keep && e(u) && u.gc(t, !1);
      }
    }
  }
}, rc = (n, t) => {
  n.clients.forEach((e, s) => {
    const r = (
      /** @type {Array<GC|Item>} */
      t.clients.get(s)
    );
    for (let i = e.length - 1; i >= 0; i--) {
      const o = e[i], l = Sr(r.length - 1, 1 + wt(r, o.clock + o.len - 1));
      for (let c = l, h = r[c]; c > 0 && h.id.clock >= o.clock; h = r[c])
        c -= 1 + ln(r, c);
    }
  });
}, Zr = (n, t) => {
  if (t < n.length) {
    const e = n[t], s = e.doc, r = s.store, i = e.deleteSet, o = e._mergeStructs;
    try {
      ys(i), e.afterState = Sn(e.doc.store), s.emit("beforeObserverCalls", [e, s]);
      const l = [];
      e.changed.forEach(
        (c, h) => l.push(() => {
          (h._item === null || !h._item.deleted) && h._callObserver(e, c);
        })
      ), l.push(() => {
        e.changedParentTypes.forEach((c, h) => {
          h._dEH.l.length > 0 && (h._item === null || !h._item.deleted) && (c = c.filter(
            (a) => a.target._item === null || !a.target._item.deleted
          ), c.forEach((a) => {
            a.currentTarget = h, a._path = null;
          }), c.sort((a, u) => a.path.length - u.path.length), Wr(h._dEH, c, e));
        });
      }), l.push(() => s.emit("afterTransaction", [e, s])), vs(l, []), e._needFormattingCleanup && Mc(e);
    } finally {
      s.gc && sc(i, r, s.gcFilter), rc(i, r), e.afterState.forEach((a, u) => {
        const d = e.beforeState.get(u) || 0;
        if (d !== a) {
          const g = (
            /** @type {Array<GC|Item>} */
            r.clients.get(u)
          ), p = Xt(wt(g, d), 1);
          for (let v = g.length - 1; v >= p; )
            v -= 1 + ln(g, v);
        }
      });
      for (let a = o.length - 1; a >= 0; a--) {
        const { client: u, clock: d } = o[a].id, g = (
          /** @type {Array<GC|Item>} */
          r.clients.get(u)
        ), p = wt(g, d);
        p + 1 < g.length && ln(g, p + 1) > 1 || p > 0 && ln(g, p);
      }
      if (!e.local && e.afterState.get(s.clientID) !== e.beforeState.get(s.clientID) && (Ll(Ur, Or, "[yjs] ", Vr, Rr, "Changed the client-id because another client seems to be using it."), s.clientID = zr()), s.emit("afterTransactionCleanup", [e, s]), s._observers.has("update")) {
        const a = new Pe();
        nr(a, e) && s.emit("update", [a.toUint8Array(), e.origin, s, e]);
      }
      if (s._observers.has("updateV2")) {
        const a = new Wt();
        nr(a, e) && s.emit("updateV2", [a.toUint8Array(), e.origin, s, e]);
      }
      const { subdocsAdded: l, subdocsLoaded: c, subdocsRemoved: h } = e;
      (l.size > 0 || h.size > 0 || c.size > 0) && (l.forEach((a) => {
        a.clientID = s.clientID, a.collectionid == null && (a.collectionid = s.collectionid), s.subdocs.add(a);
      }), h.forEach((a) => s.subdocs.delete(a)), s.emit("subdocs", [{ loaded: c, added: l, removed: h }, s, e]), h.forEach((a) => a.destroy())), n.length <= t + 1 ? (s._transactionCleanups = [], s.emit("afterAllTransactions", [s, n])) : Zr(n, t + 1);
    }
  }
}, R = (n, t, e = null, s = !0) => {
  const r = n._transactionCleanups;
  let i = !1, o = null;
  n._transaction === null && (i = !0, n._transaction = new nc(n, e, s), r.push(n._transaction), r.length === 1 && n.emit("beforeAllTransactions", [n]), n.emit("beforeTransaction", [n._transaction, n]));
  try {
    o = t(n._transaction);
  } finally {
    if (i) {
      const l = n._transaction === r[0];
      n._transaction = null, l && Zr(r, 0);
    }
  }
  return o;
};
function* ic(n) {
  const t = A(n.restDecoder);
  for (let e = 0; e < t; e++) {
    const s = A(n.restDecoder), r = n.readClient();
    let i = A(n.restDecoder);
    for (let o = 0; o < s; o++) {
      const l = n.readInfo();
      if (l === 10) {
        const c = A(n.restDecoder);
        yield new ct(T(r, i), c), i += c;
      } else if (yn & l) {
        const c = (l & (kt | rt)) === 0, h = new F(
          T(r, i),
          null,
          // left
          (l & rt) === rt ? n.readLeftID() : null,
          // origin
          null,
          // right
          (l & kt) === kt ? n.readRightID() : null,
          // right origin
          // @ts-ignore Force writing a string here.
          c ? n.readParentInfo() ? n.readString() : n.readLeftID() : null,
          // parent
          c && (l & Le) === Le ? n.readString() : null,
          // parentSub
          mi(n, l)
          // item content
        );
        yield h, i += h.length;
      } else {
        const c = n.readLen();
        yield new lt(T(r, i), c), i += c;
      }
    }
  }
}
class Ss {
  /**
   * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
   * @param {boolean} filterSkips
   */
  constructor(t, e) {
    this.gen = ic(t), this.curr = null, this.done = !1, this.filterSkips = e, this.next();
  }
  /**
   * @return {Item | GC | Skip |null}
   */
  next() {
    do
      this.curr = this.gen.next().value || null;
    while (this.filterSkips && this.curr !== null && this.curr.constructor === ct);
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
const oc = (n) => fn(n, Fr, Pe), lc = (n, t) => {
  if (n.constructor === lt) {
    const { client: e, clock: s } = n.id;
    return new lt(T(e, s + t), n.length - t);
  } else if (n.constructor === ct) {
    const { client: e, clock: s } = n.id;
    return new ct(T(e, s + t), n.length - t);
  } else {
    const e = (
      /** @type {Item} */
      n
    ), { client: s, clock: r } = e.id;
    return new F(
      T(s, r + t),
      null,
      T(s, r + t - 1),
      null,
      e.rightOrigin,
      e.parent,
      e.parentSub,
      e.content.splice(t)
    );
  }
}, fn = (n, t = de, e = Wt) => {
  if (n.length === 1)
    return n[0];
  const s = n.map((a) => new t(Zt(a)));
  let r = s.map((a) => new Ss(a, !0)), i = null;
  const o = new e(), l = new Ms(o);
  for (; r = r.filter((d) => d.curr !== null), r.sort(
    /** @type {function(any,any):number} */
    (d, g) => {
      if (d.curr.id.client === g.curr.id.client) {
        const p = d.curr.id.clock - g.curr.id.clock;
        return p === 0 ? d.curr.constructor === g.curr.constructor ? 0 : d.curr.constructor === ct ? 1 : -1 : p;
      } else
        return g.curr.id.client - d.curr.id.client;
    }
  ), r.length !== 0; ) {
    const a = r[0], u = (
      /** @type {Item | GC} */
      a.curr.id.client
    );
    if (i !== null) {
      let d = (
        /** @type {Item | GC | null} */
        a.curr
      ), g = !1;
      for (; d !== null && d.id.clock + d.length <= i.struct.id.clock + i.struct.length && d.id.client >= i.struct.id.client; )
        d = a.next(), g = !0;
      if (d === null || // current decoder is empty
      d.id.client !== u || // check whether there is another decoder that has has updates from `firstClient`
      g && d.id.clock > i.struct.id.clock + i.struct.length)
        continue;
      if (u !== i.struct.id.client)
        Ot(l, i.struct, i.offset), i = { struct: d, offset: 0 }, a.next();
      else if (i.struct.id.clock + i.struct.length < d.id.clock)
        if (i.struct.constructor === ct)
          i.struct.length = d.id.clock + d.length - i.struct.id.clock;
        else {
          Ot(l, i.struct, i.offset);
          const p = d.id.clock - i.struct.id.clock - i.struct.length;
          i = { struct: new ct(T(u, i.struct.id.clock + i.struct.length), p), offset: 0 };
        }
      else {
        const p = i.struct.id.clock + i.struct.length - d.id.clock;
        p > 0 && (i.struct.constructor === ct ? i.struct.length -= p : d = lc(d, p)), i.struct.mergeWith(
          /** @type {any} */
          d
        ) || (Ot(l, i.struct, i.offset), i = { struct: d, offset: 0 }, a.next());
      }
    } else
      i = { struct: (
        /** @type {Item | GC} */
        a.curr
      ), offset: 0 }, a.next();
    for (let d = a.curr; d !== null && d.id.client === u && d.id.clock === i.struct.id.clock + i.struct.length && d.constructor !== ct; d = a.next())
      Ot(l, i.struct, i.offset), i = { struct: d, offset: 0 };
  }
  i !== null && (Ot(l, i.struct, i.offset), i = null), Es(l);
  const c = s.map((a) => Cs(a)), h = Rl(c);
  return pe(o, h), o.toUint8Array();
}, cc = (n, t, e = de, s = Wt) => {
  const r = qr(t), i = new s(), o = new Ms(i), l = new e(Zt(n)), c = new Ss(l, !1);
  for (; c.curr; ) {
    const a = c.curr, u = a.id.client, d = r.get(u) || 0;
    if (c.curr.constructor === ct) {
      c.next();
      continue;
    }
    if (a.id.clock + a.length > d)
      for (Ot(o, a, Xt(d - a.id.clock, 0)), c.next(); c.curr && c.curr.id.client === u; )
        Ot(o, c.curr, 0), c.next();
    else
      for (; c.curr && c.curr.id.client === u && c.curr.id.clock + c.curr.length <= d; )
        c.next();
  }
  Es(o);
  const h = Cs(l);
  return pe(i, h), i.toUint8Array();
}, Qr = (n) => {
  n.written > 0 && (n.clientStructs.push({ written: n.written, restEncoder: ht(n.encoder.restEncoder) }), n.encoder.restEncoder = Ne(), n.written = 0);
}, Ot = (n, t, e) => {
  n.written > 0 && n.currClient !== t.id.client && Qr(n), n.written === 0 && (n.currClient = t.id.client, n.encoder.writeClient(t.id.client), D(n.encoder.restEncoder, t.id.clock + e)), t.write(n.encoder, e), n.written++;
}, Es = (n) => {
  Qr(n);
  const t = n.encoder.restEncoder;
  D(t, n.clientStructs.length);
  for (let e = 0; e < n.clientStructs.length; e++) {
    const s = n.clientStructs[e];
    D(t, s.written), Cn(t, s.restEncoder);
  }
}, ac = (n, t, e, s) => {
  const r = new e(Zt(n)), i = new Ss(r, !1), o = new s(), l = new Ms(o);
  for (let h = i.curr; h !== null; h = i.next())
    Ot(l, t(h), 0);
  Es(l);
  const c = Cs(r);
  return pe(o, c), o.toUint8Array();
}, hc = (n) => ac(n, ul, de, Pe), rr = "You must not compute changes after the event-handler fired.";
class Mn {
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
    return this._path || (this._path = dc(this.currentTarget, this.target));
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
    return Br(this.transaction.deleteSet, t.id);
  }
  /**
   * @type {Map<string, { action: 'add' | 'update' | 'delete', oldValue: any, newValue: any }>}
   */
  get keys() {
    if (this._keys === null) {
      if (this.transaction.doc._transactionCleanups.length === 0)
        throw $t(rr);
      const t = /* @__PURE__ */ new Map(), e = this.target;
      /** @type Set<string|null> */
      this.transaction.changed.get(e).forEach((r) => {
        if (r !== null) {
          const i = (
            /** @type {Item} */
            e._map.get(r)
          );
          let o, l;
          if (this.adds(i)) {
            let c = i.left;
            for (; c !== null && this.adds(c); )
              c = c.left;
            if (this.deletes(i))
              if (c !== null && this.deletes(c))
                o = "delete", l = Hn(c.content.getContent());
              else
                return;
            else
              c !== null && this.deletes(c) ? (o = "update", l = Hn(c.content.getContent())) : (o = "add", l = void 0);
          } else if (this.deletes(i))
            o = "delete", l = Hn(
              /** @type {Item} */
              i.content.getContent()
            );
          else
            return;
          t.set(r, { action: o, oldValue: l });
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
        throw $t(rr);
      const e = this.target, s = Jt(), r = Jt(), i = [];
      if (t = {
        added: s,
        deleted: r,
        delta: i,
        keys: this.keys
      }, /** @type Set<string|null> */
      this.transaction.changed.get(e).has(null)) {
        let l = null;
        const c = () => {
          l && i.push(l);
        };
        for (let h = e._start; h !== null; h = h.right)
          h.deleted ? this.deletes(h) && !this.adds(h) && ((l === null || l.delete === void 0) && (c(), l = { delete: 0 }), l.delete += h.length, r.add(h)) : this.adds(h) ? ((l === null || l.insert === void 0) && (c(), l = { insert: [] }), l.insert = l.insert.concat(h.content.getContent()), s.add(h)) : ((l === null || l.retain === void 0) && (c(), l = { retain: 0 }), l.retain += h.length);
        l !== null && l.retain === void 0 && c();
      }
      this._changes = t;
    }
    return (
      /** @type {any} */
      t
    );
  }
}
const dc = (n, t) => {
  const e = [];
  for (; t._item !== null && t !== n; ) {
    if (t._item.parentSub !== null)
      e.unshift(t._item.parentSub);
    else {
      let s = 0, r = (
        /** @type {AbstractType<any>} */
        t._item.parent._start
      );
      for (; r !== t._item && r !== null; )
        !r.deleted && r.countable && (s += r.length), r = r.right;
      e.unshift(s);
    }
    t = /** @type {AbstractType<any>} */
    t._item.parent;
  }
  return e;
}, ti = 80;
let Is = 0;
class uc {
  /**
   * @param {Item} p
   * @param {number} index
   */
  constructor(t, e) {
    t.marker = !0, this.p = t, this.index = e, this.timestamp = Is++;
  }
}
const fc = (n) => {
  n.timestamp = Is++;
}, ei = (n, t, e) => {
  n.p.marker = !1, n.p = t, t.marker = !0, n.index = e, n.timestamp = Is++;
}, gc = (n, t, e) => {
  if (n.length >= ti) {
    const s = n.reduce((r, i) => r.timestamp < i.timestamp ? r : i);
    return ei(s, t, e), s;
  } else {
    const s = new uc(t, e);
    return n.push(s), s;
  }
}, En = (n, t) => {
  if (n._start === null || t === 0 || n._searchMarker === null)
    return null;
  const e = n._searchMarker.length === 0 ? null : n._searchMarker.reduce((i, o) => sn(t - i.index) < sn(t - o.index) ? i : o);
  let s = n._start, r = 0;
  for (e !== null && (s = e.p, r = e.index, fc(e)); s.right !== null && r < t; ) {
    if (!s.deleted && s.countable) {
      if (t < r + s.length)
        break;
      r += s.length;
    }
    s = s.right;
  }
  for (; s.left !== null && r > t; )
    s = s.left, !s.deleted && s.countable && (r -= s.length);
  for (; s.left !== null && s.left.id.client === s.id.client && s.left.id.clock + s.left.length === s.id.clock; )
    s = s.left, !s.deleted && s.countable && (r -= s.length);
  return e !== null && sn(e.index - r) < /** @type {YText|YArray<any>} */
  s.parent.length / ti ? (ei(e, s, r), e) : gc(n._searchMarker, s, r);
}, Ue = (n, t, e) => {
  for (let s = n.length - 1; s >= 0; s--) {
    const r = n[s];
    if (e > 0) {
      let i = r.p;
      for (i.marker = !1; i && (i.deleted || !i.countable); )
        i = i.left, i && !i.deleted && i.countable && (r.index -= i.length);
      if (i === null || i.marker === !0) {
        n.splice(s, 1);
        continue;
      }
      r.p = i, i.marker = !0;
    }
    (t < r.index || e > 0 && t === r.index) && (r.index = Xt(t, r.index + e));
  }
}, In = (n, t, e) => {
  const s = n, r = t.changedParentTypes;
  for (; Et(r, n, () => []).push(e), n._item !== null; )
    n = /** @type {AbstractType<any>} */
    n._item.parent;
  Wr(s._eH, e, t);
};
class W {
  constructor() {
    this._item = null, this._map = /* @__PURE__ */ new Map(), this._start = null, this.doc = null, this._length = 0, this._eH = Zs(), this._dEH = Zs(), this._searchMarker = null;
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
    throw pt();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {AbstractType<EventType>}
   */
  clone() {
    throw pt();
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
    Qs(this._eH, t);
  }
  /**
   * Observe all events that are created by this type and its children.
   *
   * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
   */
  observeDeep(t) {
    Qs(this._dEH, t);
  }
  /**
   * Unregister an observer function.
   *
   * @param {function(EventType,Transaction):void} f Observer function
   */
  unobserve(t) {
    tr(this._eH, t);
  }
  /**
   * Unregister an observer function.
   *
   * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
   */
  unobserveDeep(t) {
    tr(this._dEH, t);
  }
  /**
   * @abstract
   * @return {any}
   */
  toJSON() {
  }
}
const ni = (n, t, e) => {
  t < 0 && (t = n._length + t), e < 0 && (e = n._length + e);
  let s = e - t;
  const r = [];
  let i = n._start;
  for (; i !== null && s > 0; ) {
    if (i.countable && !i.deleted) {
      const o = i.content.getContent();
      if (o.length <= t)
        t -= o.length;
      else {
        for (let l = t; l < o.length && s > 0; l++)
          r.push(o[l]), s--;
        t = 0;
      }
    }
    i = i.right;
  }
  return r;
}, si = (n) => {
  const t = [];
  let e = n._start;
  for (; e !== null; ) {
    if (e.countable && !e.deleted) {
      const s = e.content.getContent();
      for (let r = 0; r < s.length; r++)
        t.push(s[r]);
    }
    e = e.right;
  }
  return t;
}, He = (n, t) => {
  let e = 0, s = n._start;
  for (; s !== null; ) {
    if (s.countable && !s.deleted) {
      const r = s.content.getContent();
      for (let i = 0; i < r.length; i++)
        t(r[i], e++, n);
    }
    s = s.right;
  }
}, ri = (n, t) => {
  const e = [];
  return He(n, (s, r) => {
    e.push(t(s, r, n));
  }), e;
}, pc = (n) => {
  let t = n._start, e = null, s = 0;
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
      const r = e[s++];
      return e.length <= s && (e = null), {
        done: !1,
        value: r
      };
    }
  };
}, ii = (n, t) => {
  const e = En(n, t);
  let s = n._start;
  for (e !== null && (s = e.p, t -= e.index); s !== null; s = s.right)
    if (!s.deleted && s.countable) {
      if (t < s.length)
        return s.content.getContent()[t];
      t -= s.length;
    }
}, gn = (n, t, e, s) => {
  let r = e;
  const i = n.doc, o = i.clientID, l = i.store, c = e === null ? t._start : e.right;
  let h = [];
  const a = () => {
    h.length > 0 && (r = new F(T(o, J(l, o)), r, r && r.lastId, c, c && c.id, t, null, new Kt(h)), r.integrate(n, 0), h = []);
  };
  s.forEach((u) => {
    if (u === null)
      h.push(u);
    else
      switch (u.constructor) {
        case Number:
        case Object:
        case Boolean:
        case Array:
        case String:
          h.push(u);
          break;
        default:
          switch (a(), u.constructor) {
            case Uint8Array:
            case ArrayBuffer:
              r = new F(T(o, J(l, o)), r, r && r.lastId, c, c && c.id, t, null, new je(new Uint8Array(
                /** @type {Uint8Array} */
                u
              ))), r.integrate(n, 0);
              break;
            case me:
              r = new F(T(o, J(l, o)), r, r && r.lastId, c, c && c.id, t, null, new Ye(
                /** @type {Doc} */
                u
              )), r.integrate(n, 0);
              break;
            default:
              if (u instanceof W)
                r = new F(T(o, J(l, o)), r, r && r.lastId, c, c && c.id, t, null, new At(u)), r.integrate(n, 0);
              else
                throw new Error("Unexpected content type in insert operation");
          }
      }
  }), a();
}, oi = () => $t("Length exceeded!"), li = (n, t, e, s) => {
  if (e > t._length)
    throw oi();
  if (e === 0)
    return t._searchMarker && Ue(t._searchMarker, e, s.length), gn(n, t, null, s);
  const r = e, i = En(t, e);
  let o = t._start;
  for (i !== null && (o = i.p, e -= i.index, e === 0 && (o = o.prev, e += o && o.countable && !o.deleted ? o.length : 0)); o !== null; o = o.right)
    if (!o.deleted && o.countable) {
      if (e <= o.length) {
        e < o.length && Bt(n, T(o.id.client, o.id.clock + e));
        break;
      }
      e -= o.length;
    }
  return t._searchMarker && Ue(t._searchMarker, r, s.length), gn(n, t, o, s);
}, mc = (n, t, e) => {
  let r = (t._searchMarker || []).reduce((i, o) => o.index > i.index ? o : i, { index: 0, p: t._start }).p;
  if (r)
    for (; r.right; )
      r = r.right;
  return gn(n, t, r, e);
}, ci = (n, t, e, s) => {
  if (s === 0)
    return;
  const r = e, i = s, o = En(t, e);
  let l = t._start;
  for (o !== null && (l = o.p, e -= o.index); l !== null && e > 0; l = l.right)
    !l.deleted && l.countable && (e < l.length && Bt(n, T(l.id.client, l.id.clock + e)), e -= l.length);
  for (; s > 0 && l !== null; )
    l.deleted || (s < l.length && Bt(n, T(l.id.client, l.id.clock + s)), l.delete(n), s -= l.length), l = l.right;
  if (s > 0)
    throw oi();
  t._searchMarker && Ue(
    t._searchMarker,
    r,
    -i + s
    /* in case we remove the above exception */
  );
}, pn = (n, t, e) => {
  const s = t._map.get(e);
  s !== void 0 && s.delete(n);
}, As = (n, t, e, s) => {
  const r = t._map.get(e) || null, i = n.doc, o = i.clientID;
  let l;
  if (s == null)
    l = new Kt([s]);
  else
    switch (s.constructor) {
      case Number:
      case Object:
      case Boolean:
      case Array:
      case String:
        l = new Kt([s]);
        break;
      case Uint8Array:
        l = new je(
          /** @type {Uint8Array} */
          s
        );
        break;
      case me:
        l = new Ye(
          /** @type {Doc} */
          s
        );
        break;
      default:
        if (s instanceof W)
          l = new At(s);
        else
          throw new Error("Unexpected content type");
    }
  new F(T(o, J(i.store, o)), r, r && r.lastId, null, null, t, e, l).integrate(n, 0);
}, Ds = (n, t) => {
  const e = n._map.get(t);
  return e !== void 0 && !e.deleted ? e.content.getContent()[e.length - 1] : void 0;
}, ai = (n) => {
  const t = {};
  return n._map.forEach((e, s) => {
    e.deleted || (t[s] = e.content.getContent()[e.length - 1]);
  }), t;
}, hi = (n, t) => {
  const e = n._map.get(t);
  return e !== void 0 && !e.deleted;
}, wc = (n, t) => {
  const e = {};
  return n._map.forEach((s, r) => {
    let i = s;
    for (; i !== null && (!t.sv.has(i.id.client) || i.id.clock >= (t.sv.get(i.id.client) || 0)); )
      i = i.left;
    i !== null && se(i, t) && (e[r] = i.content.getContent()[i.length - 1]);
  }), e;
}, en = (n) => Ol(
  n.entries(),
  /** @param {any} entry */
  (t) => !t[1].deleted
);
class vc extends Mn {
}
class le extends W {
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
    const e = new le();
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
    return new le();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YArray<T>}
   */
  clone() {
    const t = new le();
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
    super._callObserver(t, e), In(this, t, new vc(this, t));
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
    this.doc !== null ? R(this.doc, (s) => {
      li(
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
    this.doc !== null ? R(this.doc, (e) => {
      mc(
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
    this.doc !== null ? R(this.doc, (s) => {
      ci(s, this, t, e);
    }) : this._prelimContent.splice(t, e);
  }
  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {T}
   */
  get(t) {
    return ii(this, t);
  }
  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<T>}
   */
  toArray() {
    return si(this);
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
    return ni(this, t, e);
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
    return ri(
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
    He(this, t);
  }
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator]() {
    return pc(this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(t) {
    t.writeTypeRef(Fc);
  }
}
const bc = (n) => new le();
class yc extends Mn {
  /**
   * @param {YMap<T>} ymap The YArray that changed.
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed.
   */
  constructor(t, e, s) {
    super(t, e), this.keysChanged = s;
  }
}
class ue extends W {
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
    super._integrate(t, e), this._prelimContent.forEach((s, r) => {
      this.set(r, s);
    }), this._prelimContent = null;
  }
  /**
   * @return {YMap<MapType>}
   */
  _copy() {
    return new ue();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YMap<MapType>}
   */
  clone() {
    const t = new ue();
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
    In(this, t, new yc(this, t, e));
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
        const r = e.content.getContent()[e.length - 1];
        t[s] = r instanceof W ? r.toJSON() : r;
      }
    }), t;
  }
  /**
   * Returns the size of the YMap (count of key/value pairs)
   *
   * @return {number}
   */
  get size() {
    return [...en(this._map)].length;
  }
  /**
   * Returns the keys for each element in the YMap Type.
   *
   * @return {IterableIterator<string>}
   */
  keys() {
    return Fn(
      en(this._map),
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
    return Fn(
      en(this._map),
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
    return Fn(
      en(this._map),
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
    this.doc !== null ? R(this.doc, (e) => {
      pn(e, this, t);
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
    return this.doc !== null ? R(this.doc, (s) => {
      As(
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
      Ds(this, t)
    );
  }
  /**
   * Returns a boolean indicating whether the specified key exists or not.
   *
   * @param {string} key The key to test.
   * @return {boolean}
   */
  has(t) {
    return hi(this, t);
  }
  /**
   * Removes all elements from this YMap.
   */
  clear() {
    this.doc !== null ? R(this.doc, (t) => {
      this.forEach(function(e, s, r) {
        pn(t, r, s);
      });
    }) : this._prelimContent.clear();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(t) {
    t.writeTypeRef(Pc);
  }
}
const Cc = (n) => new ue(), Rt = (n, t) => n === t || typeof n == "object" && typeof t == "object" && n && t && dl(n, t);
class cs {
  /**
   * @param {Item|null} left
   * @param {Item|null} right
   * @param {number} index
   * @param {Map<string,any>} currentAttributes
   */
  constructor(t, e, s, r) {
    this.left = t, this.right = e, this.index = s, this.currentAttributes = r;
  }
  /**
   * Only call this if you know that this.right is defined
   */
  forward() {
    switch (this.right === null && mt(), this.right.content.constructor) {
      case P:
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
const ir = (n, t, e) => {
  for (; t.right !== null && e > 0; ) {
    switch (t.right.content.constructor) {
      case P:
        t.right.deleted || we(
          t.currentAttributes,
          /** @type {ContentFormat} */
          t.right.content
        );
        break;
      default:
        t.right.deleted || (e < t.right.length && Bt(n, T(t.right.id.client, t.right.id.clock + e)), t.index += t.right.length, e -= t.right.length);
        break;
    }
    t.left = t.right, t.right = t.right.right;
  }
  return t;
}, nn = (n, t, e, s) => {
  const r = /* @__PURE__ */ new Map(), i = s ? En(t, e) : null;
  if (i) {
    const o = new cs(i.p.left, i.p, i.index, r);
    return ir(n, o, e - i.index);
  } else {
    const o = new cs(null, t._start, 0, r);
    return ir(n, o, e);
  }
}, di = (n, t, e, s) => {
  for (; e.right !== null && (e.right.deleted === !0 || e.right.content.constructor === P && Rt(
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
  const r = n.doc, i = r.clientID;
  s.forEach((o, l) => {
    const c = e.left, h = e.right, a = new F(T(i, J(r.store, i)), c, c && c.lastId, h, h && h.id, t, null, new P(l, o));
    a.integrate(n, 0), e.right = a, e.forward();
  });
}, we = (n, t) => {
  const { key: e, value: s } = t;
  s === null ? n.delete(e) : n.set(e, s);
}, ui = (n, t) => {
  var e;
  for (; n.right !== null; ) {
    if (!(n.right.deleted || n.right.content.constructor === P && Rt(
      (e = t[
        /** @type {ContentFormat} */
        n.right.content.key
      ]) != null ? e : null,
      /** @type {ContentFormat} */
      n.right.content.value
    )))
      break;
    n.forward();
  }
}, fi = (n, t, e, s) => {
  var l;
  const r = n.doc, i = r.clientID, o = /* @__PURE__ */ new Map();
  for (const c in s) {
    const h = s[c], a = (l = e.currentAttributes.get(c)) != null ? l : null;
    if (!Rt(a, h)) {
      o.set(c, a);
      const { left: u, right: d } = e;
      e.right = new F(T(i, J(r.store, i)), u, u && u.lastId, d, d && d.id, t, null, new P(c, h)), e.right.integrate(n, 0), e.forward();
    }
  }
  return o;
}, jn = (n, t, e, s, r) => {
  e.currentAttributes.forEach((d, g) => {
    r[g] === void 0 && (r[g] = null);
  });
  const i = n.doc, o = i.clientID;
  ui(e, r);
  const l = fi(n, t, e, r), c = s.constructor === String ? new vt(
    /** @type {string} */
    s
  ) : s instanceof W ? new At(s) : new Qt(s);
  let { left: h, right: a, index: u } = e;
  t._searchMarker && Ue(t._searchMarker, e.index, c.getLength()), a = new F(T(o, J(i.store, o)), h, h && h.lastId, a, a && a.id, t, null, c), a.integrate(n, 0), e.right = a, e.index = u, e.forward(), di(n, t, e, l);
}, or = (n, t, e, s, r) => {
  const i = n.doc, o = i.clientID;
  ui(e, r);
  const l = fi(n, t, e, r);
  t:
    for (; e.right !== null && (s > 0 || l.size > 0 && (e.right.deleted || e.right.content.constructor === P)); ) {
      if (!e.right.deleted)
        switch (e.right.content.constructor) {
          case P: {
            const { key: c, value: h } = (
              /** @type {ContentFormat} */
              e.right.content
            ), a = r[c];
            if (a !== void 0) {
              if (Rt(a, h))
                l.delete(c);
              else {
                if (s === 0)
                  break t;
                l.set(c, h);
              }
              e.right.delete(n);
            } else
              e.currentAttributes.set(c, h);
            break;
          }
          default:
            s < e.right.length && Bt(n, T(e.right.id.client, e.right.id.clock + s)), s -= e.right.length;
            break;
        }
      e.forward();
    }
  if (s > 0) {
    let c = "";
    for (; s > 0; s--)
      c += "\n";
    e.right = new F(T(o, J(i.store, o)), e.left, e.left && e.left.lastId, e.right, e.right && e.right.id, t, null, new vt(c)), e.right.integrate(n, 0), e.forward();
  }
  di(n, t, e, l);
}, gi = (n, t, e, s, r) => {
  var h, a;
  let i = t;
  const o = et();
  for (; i && (!i.countable || i.deleted); ) {
    if (!i.deleted && i.content.constructor === P) {
      const u = (
        /** @type {ContentFormat} */
        i.content
      );
      o.set(u.key, u);
    }
    i = i.right;
  }
  let l = 0, c = !1;
  for (; t !== i; ) {
    if (e === t && (c = !0), !t.deleted) {
      const u = t.content;
      switch (u.constructor) {
        case P: {
          const { key: d, value: g } = (
            /** @type {ContentFormat} */
            u
          ), p = (h = s.get(d)) != null ? h : null;
          (o.get(d) !== u || p === g) && (t.delete(n), l++, !c && ((a = r.get(d)) != null ? a : null) === g && p !== g && (p === null ? r.delete(d) : r.set(d, p))), !c && !t.deleted && we(
            r,
            /** @type {ContentFormat} */
            u
          );
          break;
        }
      }
    }
    t = /** @type {Item} */
    t.right;
  }
  return l;
}, kc = (n, t) => {
  for (; t && t.right && (t.right.deleted || !t.right.countable); )
    t = t.right;
  const e = /* @__PURE__ */ new Set();
  for (; t && (t.deleted || !t.countable); ) {
    if (!t.deleted && t.content.constructor === P) {
      const s = (
        /** @type {ContentFormat} */
        t.content.key
      );
      e.has(s) ? t.delete(n) : e.add(s);
    }
    t = t.left;
  }
}, Sc = (n) => {
  let t = 0;
  return R(
    /** @type {Doc} */
    n.doc,
    (e) => {
      let s = (
        /** @type {Item} */
        n._start
      ), r = n._start, i = et();
      const o = ts(i);
      for (; r; ) {
        if (r.deleted === !1)
          switch (r.content.constructor) {
            case P:
              we(
                o,
                /** @type {ContentFormat} */
                r.content
              );
              break;
            default:
              t += gi(e, s, r, i, o), i = ts(o), s = r;
              break;
          }
        r = r.right;
      }
    }
  ), t;
}, Mc = (n) => {
  const t = /* @__PURE__ */ new Set(), e = n.doc;
  for (const [s, r] of n.afterState.entries()) {
    const i = n.beforeState.get(s) || 0;
    r !== i && Xr(
      n,
      /** @type {Array<Item|GC>} */
      e.store.clients.get(s),
      i,
      r,
      (o) => {
        !o.deleted && /** @type {Item} */
        o.content.constructor === P && o.constructor !== lt && t.add(
          /** @type {any} */
          o.parent
        );
      }
    );
  }
  R(e, (s) => {
    $r(n, n.deleteSet, (r) => {
      if (r instanceof lt || !/** @type {YText} */
      r.parent._hasFormatting || t.has(
        /** @type {YText} */
        r.parent
      ))
        return;
      const i = (
        /** @type {YText} */
        r.parent
      );
      r.content.constructor === P ? t.add(i) : kc(s, r);
    });
    for (const r of t)
      Sc(r);
  });
}, lr = (n, t, e) => {
  const s = e, r = ts(t.currentAttributes), i = t.right;
  for (; e > 0 && t.right !== null; ) {
    if (t.right.deleted === !1)
      switch (t.right.content.constructor) {
        case At:
        case Qt:
        case vt:
          e < t.right.length && Bt(n, T(t.right.id.client, t.right.id.clock + e)), e -= t.right.length, t.right.delete(n);
          break;
      }
    t.forward();
  }
  i && gi(n, i, t.right, r, t.currentAttributes);
  const o = (
    /** @type {AbstractType<any>} */
    /** @type {Item} */
    (t.left || t.right).parent
  );
  return o._searchMarker && Ue(o._searchMarker, t.index, -s + e), t;
};
class Ec extends Mn {
  /**
   * @param {YText} ytext
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed
   */
  constructor(t, e, s) {
    super(t, e), this.childListChanged = !1, this.keysChanged = /* @__PURE__ */ new Set(), s.forEach((r) => {
      r === null ? this.childListChanged = !0 : this.keysChanged.add(r);
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
      R(t, (s) => {
        var g, p, v;
        const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
        let o = this.target._start, l = null;
        const c = {};
        let h = "", a = 0, u = 0;
        const d = () => {
          if (l !== null) {
            let b = null;
            switch (l) {
              case "delete":
                u > 0 && (b = { delete: u }), u = 0;
                break;
              case "insert":
                (typeof h == "object" || h.length > 0) && (b = { insert: h }, r.size > 0 && (b.attributes = {}, r.forEach((S, V) => {
                  S !== null && (b.attributes[V] = S);
                }))), h = "";
                break;
              case "retain":
                a > 0 && (b = { retain: a }, al(c) || (b.attributes = ll({}, c))), a = 0;
                break;
            }
            b && e.push(b), l = null;
          }
        };
        for (; o !== null; ) {
          switch (o.content.constructor) {
            case At:
            case Qt:
              this.adds(o) ? this.deletes(o) || (d(), l = "insert", h = o.content.getContent()[0], d()) : this.deletes(o) ? (l !== "delete" && (d(), l = "delete"), u += 1) : o.deleted || (l !== "retain" && (d(), l = "retain"), a += 1);
              break;
            case vt:
              this.adds(o) ? this.deletes(o) || (l !== "insert" && (d(), l = "insert"), h += /** @type {ContentString} */
              o.content.str) : this.deletes(o) ? (l !== "delete" && (d(), l = "delete"), u += o.length) : o.deleted || (l !== "retain" && (d(), l = "retain"), a += o.length);
              break;
            case P: {
              const { key: b, value: S } = (
                /** @type {ContentFormat} */
                o.content
              );
              if (this.adds(o)) {
                if (!this.deletes(o)) {
                  const V = (g = r.get(b)) != null ? g : null;
                  Rt(V, S) ? S !== null && o.delete(s) : (l === "retain" && d(), Rt(S, (p = i.get(b)) != null ? p : null) ? delete c[b] : c[b] = S);
                }
              } else if (this.deletes(o)) {
                i.set(b, S);
                const V = (v = r.get(b)) != null ? v : null;
                Rt(V, S) || (l === "retain" && d(), c[b] = V);
              } else if (!o.deleted) {
                i.set(b, S);
                const V = c[b];
                V !== void 0 && (Rt(V, S) ? V !== null && o.delete(s) : (l === "retain" && d(), S === null ? delete c[b] : c[b] = S));
              }
              o.deleted || (l === "insert" && d(), we(
                r,
                /** @type {ContentFormat} */
                o.content
              ));
              break;
            }
          }
          o = o.right;
        }
        for (d(); e.length > 0; ) {
          const b = e[e.length - 1];
          if (b.retain !== void 0 && b.attributes === void 0)
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
class fe extends W {
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
    return new fe();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YText}
   */
  clone() {
    const t = new fe();
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
    const s = new Ec(this, t, e);
    In(this, t, s), !t.local && this._hasFormatting && (t._needFormattingCleanup = !0);
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
    this.doc !== null ? R(this.doc, (s) => {
      const r = new cs(null, this._start, 0, /* @__PURE__ */ new Map());
      for (let i = 0; i < t.length; i++) {
        const o = t[i];
        if (o.insert !== void 0) {
          const l = !e && typeof o.insert == "string" && i === t.length - 1 && r.right === null && o.insert.slice(-1) === "\n" ? o.insert.slice(0, -1) : o.insert;
          (typeof l != "string" || l.length > 0) && jn(s, this, r, l, o.attributes || {});
        } else
          o.retain !== void 0 ? or(s, this, r, o.retain, o.attributes || {}) : o.delete !== void 0 && lr(s, r, o.delete);
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
    const r = [], i = /* @__PURE__ */ new Map(), o = (
      /** @type {Doc} */
      this.doc
    );
    let l = "", c = this._start;
    function h() {
      if (l.length > 0) {
        const u = {};
        let d = !1;
        i.forEach((p, v) => {
          d = !0, u[v] = p;
        });
        const g = { insert: l };
        d && (g.attributes = u), r.push(g), l = "";
      }
    }
    const a = () => {
      for (; c !== null; ) {
        if (se(c, t) || e !== void 0 && se(c, e))
          switch (c.content.constructor) {
            case vt: {
              const u = i.get("ychange");
              t !== void 0 && !se(c, t) ? (u === void 0 || u.user !== c.id.client || u.type !== "removed") && (h(), i.set("ychange", s ? s("removed", c.id) : { type: "removed" })) : e !== void 0 && !se(c, e) ? (u === void 0 || u.user !== c.id.client || u.type !== "added") && (h(), i.set("ychange", s ? s("added", c.id) : { type: "added" })) : u !== void 0 && (h(), i.delete("ychange")), l += /** @type {ContentString} */
              c.content.str;
              break;
            }
            case At:
            case Qt: {
              h();
              const u = {
                insert: c.content.getContent()[0]
              };
              if (i.size > 0) {
                const d = (
                  /** @type {Object<string,any>} */
                  {}
                );
                u.attributes = d, i.forEach((g, p) => {
                  d[p] = g;
                });
              }
              r.push(u);
              break;
            }
            case P:
              se(c, t) && (h(), we(
                i,
                /** @type {ContentFormat} */
                c.content
              ));
              break;
          }
        c = c.right;
      }
      h();
    };
    return t || e ? R(o, (u) => {
      t && os(u, t), e && os(u, e), a();
    }, "cleanup") : a(), r;
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
    const r = this.doc;
    r !== null ? R(r, (i) => {
      const o = nn(i, this, t, !s);
      s || (s = {}, o.currentAttributes.forEach((l, c) => {
        s[c] = l;
      })), jn(i, this, o, e, s);
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
    const r = this.doc;
    r !== null ? R(r, (i) => {
      const o = nn(i, this, t, !s);
      jn(i, this, o, e, s || {});
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
    s !== null ? R(s, (r) => {
      lr(r, nn(r, this, t, !0), e);
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
    const r = this.doc;
    r !== null ? R(r, (i) => {
      const o = nn(i, this, t, !1);
      o.right !== null && or(i, this, o, e, s);
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
    this.doc !== null ? R(this.doc, (e) => {
      pn(e, this, t);
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
    this.doc !== null ? R(this.doc, (s) => {
      As(s, this, t, e);
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
      Ds(this, t)
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
    return ai(this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(t) {
    t.writeTypeRef(jc);
  }
}
const Ic = (n) => new fe();
class Yn {
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
        t.content.type, !t.deleted && (e.constructor === ge || e.constructor === Gt) && e._start !== null)
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
    return new Yn(this, t);
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
    const s = new Yn(this, (r) => r.nodeName && r.nodeName.toUpperCase() === t).next();
    return s.done ? null : s.value;
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
    return t = t.toUpperCase(), St(new Yn(this, (e) => e.nodeName && e.nodeName.toUpperCase() === t));
  }
  /**
   * Creates YXmlEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(t, e) {
    In(this, t, new _c(this, e, t));
  }
  /**
   * Get the string representation of all the children of this YXmlFragment.
   *
   * @return {string} The string representation of all children.
   */
  toString() {
    return ri(this, (t) => t.toString()).join("");
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
    const r = t.createDocumentFragment();
    return s !== void 0 && s._createAssociation(r, this), He(this, (i) => {
      r.insertBefore(i.toDOM(t, e, s), null);
    }), r;
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
    this.doc !== null ? R(this.doc, (s) => {
      li(s, this, t, e);
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
      R(this.doc, (s) => {
        const r = t && t instanceof W ? t._item : t;
        gn(s, this, r, e);
      });
    else {
      const s = (
        /** @type {Array<any>} */
        this._prelimContent
      ), r = t === null ? 0 : s.findIndex((i) => i === t) + 1;
      if (r === 0 && t !== null)
        throw $t("Reference item not found");
      s.splice(r, 0, ...e);
    }
  }
  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} [length=1] The number of elements to remove. Defaults to 1.
   */
  delete(t, e = 1) {
    this.doc !== null ? R(this.doc, (s) => {
      ci(s, this, t, e);
    }) : this._prelimContent.splice(t, e);
  }
  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<YXmlElement|YXmlText|YXmlHook>}
   */
  toArray() {
    return si(this);
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
    return ii(this, t);
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
    return ni(this, t, e);
  }
  /**
   * Executes a provided function on once on every child element.
   *
   * @param {function(YXmlElement|YXmlText,number, typeof self):void} f A function to execute on every element of this YArray.
   */
  forEach(t) {
    He(this, t);
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
    t.writeTypeRef(qc);
  }
}
const Ac = (n) => new Gt();
class ge extends Gt {
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
    this._prelimAttrs.forEach((s, r) => {
      this.setAttribute(r, s);
    }), this._prelimAttrs = null;
  }
  /**
   * Creates an Item with the same effect as this Item (without position effect)
   *
   * @return {YXmlElement}
   */
  _copy() {
    return new ge(this.nodeName);
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlElement<KV>}
   */
  clone() {
    const t = new ge(this.nodeName), e = this.getAttributes();
    return cl(e, (s, r) => {
      typeof s == "string" && t.setAttribute(r, s);
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
    const r = s.length;
    for (let l = 0; l < r; l++) {
      const c = s[l];
      e.push(c + '="' + t[c] + '"');
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
    this.doc !== null ? R(this.doc, (e) => {
      pn(e, this, t);
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
    this.doc !== null ? R(this.doc, (s) => {
      As(s, this, t, e);
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
      Ds(this, t)
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
      hi(this, t)
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
      t ? wc(this, t) : ai(this)
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
    const r = t.createElement(this.nodeName), i = this.getAttributes();
    for (const o in i) {
      const l = i[o];
      typeof l == "string" && r.setAttribute(o, l);
    }
    return He(this, (o) => {
      r.appendChild(o.toDOM(t, e, s));
    }), s !== void 0 && s._createAssociation(r, this), r;
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
    t.writeTypeRef(Yc), t.writeKey(this.nodeName);
  }
}
const Dc = (n) => new ge(n.readKey());
class _c extends Mn {
  /**
   * @param {YXmlElement|YXmlText|YXmlFragment} target The target on which the event is created.
   * @param {Set<string|null>} subs The set of changed attributes. `null` is included if the
   *                   child list changed.
   * @param {Transaction} transaction The transaction instance with wich the
   *                                  change was created.
   */
  constructor(t, e, s) {
    super(t, s), this.childListChanged = !1, this.attributesChanged = /* @__PURE__ */ new Set(), e.forEach((r) => {
      r === null ? this.childListChanged = !0 : this.attributesChanged.add(r);
    });
  }
}
class mn extends ue {
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
    return new mn(this.hookName);
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlHook}
   */
  clone() {
    const t = new mn(this.hookName);
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
    const r = e[this.hookName];
    let i;
    return r !== void 0 ? i = r.createDom(this) : i = document.createElement(this.hookName), i.setAttribute("data-yjs-hook", this.hookName), s !== void 0 && s._createAssociation(i, this), i;
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
    t.writeTypeRef(Jc), t.writeKey(this.hookName);
  }
}
const Tc = (n) => new mn(n.readKey());
class wn extends fe {
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
    return new wn();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlText}
   */
  clone() {
    const t = new wn();
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
    const r = t.createTextNode(this.toString());
    return s !== void 0 && s._createAssociation(r, this), r;
  }
  toString() {
    return this.toDelta().map((t) => {
      const e = [];
      for (const r in t.attributes) {
        const i = [];
        for (const o in t.attributes[r])
          i.push({ key: o, value: t.attributes[r][o] });
        i.sort((o, l) => o.key < l.key ? -1 : 1), e.push({ nodeName: r, attrs: i });
      }
      e.sort((r, i) => r.nodeName < i.nodeName ? -1 : 1);
      let s = "";
      for (let r = 0; r < e.length; r++) {
        const i = e[r];
        s += "<".concat(i.nodeName);
        for (let o = 0; o < i.attrs.length; o++) {
          const l = i.attrs[o];
          s += " ".concat(l.key, '="').concat(l.value, '"');
        }
        s += ">";
      }
      s += t.insert;
      for (let r = e.length - 1; r >= 0; r--)
        s += "</".concat(e[r].nodeName, ">");
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
    t.writeTypeRef(Wc);
  }
}
const Lc = (n) => new wn();
class _s {
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
    throw pt();
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
    throw pt();
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(t, e) {
    throw pt();
  }
}
const xc = 0;
class lt extends _s {
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
    e > 0 && (this.id.clock += e, this.length -= e), Kr(t.doc.store, this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, e) {
    t.writeInfo(xc), t.writeLen(this.length - e);
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
class je {
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
    return new je(this.content);
  }
  /**
   * @param {number} offset
   * @return {ContentBinary}
   */
  splice(t) {
    throw pt();
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
const Oc = (n) => new je(n.readBuf());
class $e {
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
    return new $e(this.len);
  }
  /**
   * @param {number} offset
   * @return {ContentDeleted}
   */
  splice(t) {
    const e = new $e(this.len - t);
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
    un(t.deleteSet, e.id.client, e.id.clock, this.len), e.markDeleted();
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
const Vc = (n) => new $e(n.readLen()), pi = (n, t) => new me({ guid: n, ...t, shouldLoad: t.shouldLoad || t.autoLoad || !1 });
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
    return new Ye(pi(this.doc.guid, this.opts));
  }
  /**
   * @param {number} offset
   * @return {ContentDoc}
   */
  splice(t) {
    throw pt();
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
const Rc = (n) => new Ye(pi(n.readString(), n.readAny()));
class Qt {
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
    return new Qt(this.embed);
  }
  /**
   * @param {number} offset
   * @return {ContentEmbed}
   */
  splice(t) {
    throw pt();
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
const Uc = (n) => new Qt(n.readJSON());
class P {
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
    return new P(this.key, this.value);
  }
  /**
   * @param {number} _offset
   * @return {ContentFormat}
   */
  splice(t) {
    throw pt();
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
const Hc = (n) => new P(n.readKey(), n.readJSON());
class vn {
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
    return new vn(this.arr);
  }
  /**
   * @param {number} offset
   * @return {ContentJSON}
   */
  splice(t) {
    const e = new vn(this.arr.slice(t));
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
    for (let r = e; r < s; r++) {
      const i = this.arr[r];
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
const $c = (n) => {
  const t = n.readLen(), e = [];
  for (let s = 0; s < t; s++) {
    const r = n.readString();
    r === "undefined" ? e.push(void 0) : e.push(JSON.parse(r));
  }
  return new vn(e);
};
class Kt {
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
    return new Kt(this.arr);
  }
  /**
   * @param {number} offset
   * @return {ContentAny}
   */
  splice(t) {
    const e = new Kt(this.arr.slice(t));
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
    for (let r = e; r < s; r++) {
      const i = this.arr[r];
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
const Bc = (n) => {
  const t = n.readLen(), e = [];
  for (let s = 0; s < t; s++)
    e.push(n.readAny());
  return new Kt(e);
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
const zc = (n) => new vt(n.readString()), Nc = [
  bc,
  Cc,
  Ic,
  Dc,
  Ac,
  Tc,
  Lc
], Fc = 0, Pc = 1, jc = 2, Yc = 3, qc = 4, Jc = 5, Wc = 6;
class At {
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
    return new At(this.type._copy());
  }
  /**
   * @param {number} offset
   * @return {ContentType}
   */
  splice(t) {
    throw pt();
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
const Gc = (n) => new At(Nc[n.readTypeRef()](n)), bn = (n, t, e) => {
  const { client: s, clock: r } = t.id, i = new F(
    T(s, r + e),
    t,
    T(s, r + e - 1),
    t.right,
    t.rightOrigin,
    t.parent,
    t.parentSub,
    t.content.splice(e)
  );
  return t.deleted && i.markDeleted(), t.keep && (i.keep = !0), t.redone !== null && (i.redone = T(t.redone.client, t.redone.clock + e)), t.right = i, i.right !== null && (i.right.left = i), n._mergeStructs.push(i), i.parentSub !== null && i.right === null && i.parent._map.set(i.parentSub, i), t.length = e, i;
};
class F extends _s {
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
  constructor(t, e, s, r, i, o, l, c) {
    super(t, c.getLength()), this.origin = s, this.left = e, this.right = r, this.rightOrigin = i, this.parent = o, this.parentSub = l, this.redone = null, this.content = c, this.info = this.content.isCountable() ? zs : 0;
  }
  /**
   * This is used to mark the item as an indexed fast-search marker
   *
   * @type {boolean}
   */
  set marker(t) {
    (this.info & Bn) > 0 !== t && (this.info ^= Bn);
  }
  get marker() {
    return (this.info & Bn) > 0;
  }
  /**
   * If true, do not garbage collect this Item.
   */
  get keep() {
    return (this.info & Bs) > 0;
  }
  set keep(t) {
    this.keep !== t && (this.info ^= Bs);
  }
  get countable() {
    return (this.info & zs) > 0;
  }
  /**
   * Whether this item was deleted or not.
   * @type {Boolean}
   */
  get deleted() {
    return (this.info & $n) > 0;
  }
  set deleted(t) {
    this.deleted !== t && (this.info ^= $n);
  }
  markDeleted() {
    this.info |= $n;
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
    if (this.parent && this.parent.constructor === oe && this.id.client !== this.parent.client && this.parent.clock >= J(e, this.parent.client))
      return this.parent.client;
    if (this.origin && (this.left = er(t, e, this.origin), this.origin = this.left.lastId), this.rightOrigin && (this.right = Bt(t, this.rightOrigin), this.rightOrigin = this.right.id), this.left && this.left.constructor === lt || this.right && this.right.constructor === lt)
      this.parent = null;
    else if (!this.parent)
      this.left && this.left.constructor === F && (this.parent = this.left.parent, this.parentSub = this.left.parentSub), this.right && this.right.constructor === F && (this.parent = this.right.parent, this.parentSub = this.right.parentSub);
    else if (this.parent.constructor === oe) {
      const s = Pn(e, this.parent);
      s.constructor === lt ? this.parent = null : this.parent = /** @type {ContentType} */
      s.content.type;
    }
    return null;
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(t, e) {
    if (e > 0 && (this.id.clock += e, this.left = er(t, t.doc.store, T(this.id.client, this.id.clock - 1)), this.origin = this.left.lastId, this.content = this.content.splice(e), this.length -= e), this.parent) {
      if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
        let s = this.left, r;
        if (s !== null)
          r = s.right;
        else if (this.parentSub !== null)
          for (r = /** @type {AbstractType<any>} */
          this.parent._map.get(this.parentSub) || null; r !== null && r.left !== null; )
            r = r.left;
        else
          r = /** @type {AbstractType<any>} */
          this.parent._start;
        const i = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
        for (; r !== null && r !== this.right; ) {
          if (o.add(r), i.add(r), tn(this.origin, r.origin)) {
            if (r.id.client < this.id.client)
              s = r, i.clear();
            else if (tn(this.rightOrigin, r.rightOrigin))
              break;
          } else if (r.origin !== null && o.has(Pn(t.doc.store, r.origin)))
            i.has(Pn(t.doc.store, r.origin)) || (s = r, i.clear());
          else
            break;
          r = r.right;
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
      this.right !== null ? this.right.left = this : this.parentSub !== null && (this.parent._map.set(this.parentSub, this), this.left !== null && this.left.delete(t)), this.parentSub === null && this.countable && !this.deleted && (this.parent._length += this.length), Kr(t.doc.store, this), this.content.integrate(t, this), sr(
        t,
        /** @type {AbstractType<any>} */
        this.parent,
        this.parentSub
      ), /** @type {AbstractType<any>} */
      (this.parent._item !== null && /** @type {AbstractType<any>} */
      this.parent._item.deleted || this.parentSub !== null && this.right !== null) && this.delete(t);
    } else
      new lt(this.id, this.length).integrate(t, 0);
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
    return this.length === 1 ? this.id : T(this.id.client, this.id.clock + this.length - 1);
  }
  /**
   * Try to merge two items
   *
   * @param {Item} right
   * @return {boolean}
   */
  mergeWith(t) {
    if (this.constructor === t.constructor && tn(t.origin, this.lastId) && this.right === t && tn(this.rightOrigin, t.rightOrigin) && this.id.client === t.id.client && this.id.clock + this.length === t.id.clock && this.deleted === t.deleted && this.redone === null && t.redone === null && this.content.constructor === t.content.constructor && this.content.mergeWith(t.content)) {
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
      this.countable && this.parentSub === null && (e._length -= this.length), this.markDeleted(), un(t.deleteSet, this.id.client, this.id.clock, this.length), sr(t, e, this.parentSub), this.content.delete(t);
    }
  }
  /**
   * @param {StructStore} store
   * @param {boolean} parentGCd
   */
  gc(t, e) {
    if (!this.deleted)
      throw mt();
    this.content.gc(t), e ? ec(t, this, new lt(this.id, this.length)) : this.content = new $e(this.length);
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
    const s = e > 0 ? T(this.id.client, this.id.clock + e - 1) : this.origin, r = this.rightOrigin, i = this.parentSub, o = this.content.getRef() & yn | (s === null ? 0 : rt) | // origin is defined
    (r === null ? 0 : kt) | // right origin is defined
    (i === null ? 0 : Le);
    if (t.writeInfo(o), s !== null && t.writeLeftID(s), r !== null && t.writeRightID(r), s === null && r === null) {
      const l = (
        /** @type {AbstractType<any>} */
        this.parent
      );
      if (l._item !== void 0) {
        const c = l._item;
        if (c === null) {
          const h = Ql(l);
          t.writeParentInfo(!0), t.writeString(h);
        } else
          t.writeParentInfo(!1), t.writeLeftID(c.id);
      } else
        l.constructor === String ? (t.writeParentInfo(!0), t.writeString(l)) : l.constructor === oe ? (t.writeParentInfo(!1), t.writeLeftID(l)) : mt();
      i !== null && t.writeString(i);
    }
    this.content.write(t, e);
  }
}
const mi = (n, t) => Kc[t & yn](n), Kc = [
  () => {
    mt();
  },
  // GC is not ItemContent
  Vc,
  // 1
  $c,
  // 2
  Oc,
  // 3
  zc,
  // 4
  Uc,
  // 5
  Hc,
  // 6
  Gc,
  // 7
  Bc,
  // 8
  Rc,
  // 9
  () => {
    mt();
  }
  // 10 - Skip is not ItemContent
], Xc = 10;
class ct extends _s {
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
    mt();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, e) {
    t.writeInfo(Xc), D(t.restEncoder, this.length - e);
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
const wi = (
  /** @type {any} */
  typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : {}
), vi = "__ $YJS$ __";
wi[vi] === !0 && console.error("Yjs was already imported. This breaks constructor checks and will lead to issues! - https://github.com/yjs/yjs/issues/438");
wi[vi] = !0;
class Zc {
  /**
   * Creates an instance of CollaborateService.
   * @author tony001
   * @date 2024-08-06 11:08:59
   * @param {string} id
   * @param {string} mqttTopic
   * @param {string} token
   * @param {string} appId
   */
  constructor(t, e, s, r) {
    /**
     * 发送消息
     *
     * @author tony001
     * @date 2024-08-06 11:08:00
     * @protected
     */
    y(this, "collaborateUrl", "/portal/collaborate");
    /**
     * 连接状态
     *
     * @author tony001
     * @date 2024-08-06 11:08:20
     * @protected
     * @type {number}
     */
    y(this, "readyState");
    /**
     * 事件对象
     *
     * @author tony001
     * @date 2024-08-05 19:08:09
     */
    y(this, "evt", new Wi());
    /**
     * mqtt 连接实例
     *
     * @author tony001
     * @date 2024-08-05 19:08:52
     * @type {MqttClient}
     */
    y(this, "client");
    /**
     * 连接选项
     *
     * @author tony001
     * @date 2024-08-05 19:08:06
     * @protected
     * @type {IClientOptions}
     */
    y(this, "options", {
      // 超时时间
      connectTimeout: 6e3,
      // 认证信息
      clientId: Ht(),
      username: "",
      password: "",
      // 心跳时间
      keepalive: 60,
      clean: !0
    });
    this.id = t, this.mqttTopic = e, this.token = s, this.appId = r, this.options.username = e, this.options.password = s, this.readyState = 0;
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
    const t = await import("./mqtt.min-c50220fb.js").then((r) => r.m), e = t.default ? t.default : t, { location: s } = window;
    this.client = e.connect(
      "ws://".concat(s.host).concat(ibiz.env.baseUrl, "/").concat(this.appId).concat(ibiz.env.mqttUrl),
      this.options
    ), this.client.on("connect", () => {
      this.client.subscribe(this.mqttTopic, (r) => {
        r || console.log("订阅成功", this.mqttTopic);
      }), this.readyState = 1, this.evt.emit("connect"), ibiz.log.debug("collaborate connect");
    }), this.client.on("error", (r) => {
      this.readyState = 3, this.evt.emit("error", r), ibiz.log.debug("collaborate error");
    }), this.client.on("message", (r, i) => {
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
const ce = () => /* @__PURE__ */ new Map(), bi = (n, t, e) => {
  let s = n.get(t);
  return s === void 0 && n.set(t, s = e()), s;
}, Qc = String.fromCharCode, ta = (n) => n.toLowerCase(), ea = /^\s*/g, na = (n) => n.replace(ea, ""), sa = /([A-Z])/g, cr = (n, t) => na(n.replace(sa, (e) => "".concat(t).concat(ta(e))));
typeof TextEncoder < "u" && new TextEncoder();
let qn = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
qn && qn.decode(new Uint8Array()).length === 1 && (qn = null);
const ar = (n) => n === void 0 ? null : n;
class ra {
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
let yi = new ra(), Ci = !0;
try {
  typeof localStorage < "u" && (yi = localStorage, Ci = !1);
} catch (n) {
}
const ki = yi, ia = (n) => Ci || addEventListener(
  "storage",
  /** @type {any} */
  n
), Be = typeof process < "u" && process.release && /node|io\.js/.test(process.release.name), Si = typeof window < "u" && !Be;
let ft;
const oa = () => {
  if (ft === void 0)
    if (Be) {
      ft = ce();
      const n = process.argv;
      let t = null;
      for (let e = 0; e < n.length; e++) {
        const s = n[e];
        s[0] === "-" ? (t !== null && ft.set(t, ""), t = s) : t !== null && (ft.set(t, s), t = null);
      }
      t !== null && ft.set(t, "");
    } else
      typeof location == "object" ? (ft = ce(), (location.search || "?").slice(1).split("&").forEach((n) => {
        if (n.length !== 0) {
          const [t, e] = n.split("=");
          ft.set("--".concat(cr(t, "-")), e), ft.set("-".concat(cr(t, "-")), e);
        }
      })) : ft = ce();
  return ft;
}, la = (n) => oa().has(n), ca = (n) => ar(Be ? process.env[n.toUpperCase()] : ki.getItem(n)), aa = (n) => la("--" + n) || ca(n) !== null;
aa("production");
const ha = Math.floor, Mi = (n, t) => n < t ? n : t, da = (n, t) => n > t ? n : t, ua = Math.pow, Ei = 128, cn = 127, fa = Number.MAX_SAFE_INTEGER;
class ga {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
}
const at = () => new ga(), Ts = (n) => {
  let t = n.cpos;
  for (let e = 0; e < n.bufs.length; e++)
    t += n.bufs[e].length;
  return t;
}, ot = (n) => {
  const t = new Uint8Array(Ts(n));
  let e = 0;
  for (let s = 0; s < n.bufs.length; s++) {
    const r = n.bufs[s];
    t.set(r, e), e += r.length;
  }
  return t.set(Ai(n.cbuf.buffer, 0, n.cpos), e), t;
}, hr = (n, t) => {
  const e = n.cbuf.length;
  n.cpos === e && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(e * 2), n.cpos = 0), n.cbuf[n.cpos++] = t;
}, st = (n, t) => {
  for (; t > cn; )
    hr(n, Ei | cn & t), t = ha(t / 128);
  hr(n, cn & t);
}, pa = new Uint8Array(3e4);
pa.length / 3;
const ma = (n, t) => {
  const e = n.cbuf.length, s = n.cpos, r = Mi(e - s, t.length), i = t.length - r;
  n.cbuf.set(t.subarray(0, r), s), n.cpos += r, i > 0 && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(da(e * 2, i)), n.cbuf.set(t.subarray(r)), n.cpos = i);
}, De = (n, t) => {
  st(n, t.byteLength), ma(n, t);
};
class wa {
  /**
   * @param {Uint8Array} uint8Array Binary data to decode
   */
  constructor(t) {
    this.arr = t, this.pos = 0;
  }
}
const va = (n) => new wa(n), ba = (n, t) => {
  const e = Ai(n.arr.buffer, n.pos + n.arr.byteOffset, t);
  return n.pos += t, e;
}, ya = (n) => ba(n, Ii(n)), Ii = (n) => {
  let t = 0, e = 1;
  for (; ; ) {
    const s = n.arr[n.pos++];
    if (t = t + (s & cn) * e, e *= 128, s < Ei)
      return t;
    if (t > fa)
      throw new Error("Integer out of range!");
  }
}, Ca = (n) => new Uint8Array(n), Ai = (n, t, e) => new Uint8Array(n, t, e), ka = (n) => new Uint8Array(n), Sa = (n) => {
  let t = "";
  for (let e = 0; e < n.byteLength; e++)
    t += Qc(n[e]);
  return btoa(t);
}, Ma = (n) => Buffer.from(n.buffer, n.byteOffset, n.byteLength).toString("base64"), Ea = (n) => {
  const t = atob(n), e = Ca(t.length);
  for (let s = 0; s < t.length; s++)
    e[s] = t.charCodeAt(s);
  return e;
}, Ia = (n) => {
  const t = Buffer.from(n, "base64");
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}, Aa = Si ? Sa : Ma, Da = Si ? Ea : Ia, _a = /* @__PURE__ */ new Map();
class Ta {
  /**
   * @param {string} room
   */
  constructor(t) {
    this.room = t, this.onmessage = null, ia((e) => e.key === t && this.onmessage !== null && this.onmessage({ data: Da(e.newValue || "") }));
  }
  /**
   * @param {ArrayBuffer} buf
   */
  postMessage(t) {
    ki.setItem(this.room, Aa(ka(t)));
  }
}
const La = typeof BroadcastChannel > "u" ? Ta : BroadcastChannel, Ls = (n) => bi(_a, n, () => {
  const t = /* @__PURE__ */ new Set(), e = new La(n);
  return e.onmessage = (s) => t.forEach((r) => r(s.data, "broadcastchannel")), {
    bc: e,
    subs: t
  };
}), xa = (n, t) => Ls(n).subs.add(t), Oa = (n, t) => Ls(n).subs.delete(t), re = (n, t, e = null) => {
  const s = Ls(n);
  s.bc.postMessage(t), s.subs.forEach((r) => r(t, e));
}, as = Date.now, Di = 0, xs = 1, _i = 2, hs = (n, t) => {
  D(n, Di);
  const e = Xl(t);
  X(n, e);
}, Ti = (n, t, e) => {
  D(n, xs), X(n, Jl(t, e));
}, Va = (n, t, e) => Ti(t, e, Z(n)), Li = (n, t, e) => {
  try {
    jl(t, Z(n), e);
  } catch (s) {
    console.error("Caught error while handling a Yjs update", s);
  }
}, Ra = (n, t) => {
  D(n, _i), X(n, t);
}, Ua = Li, Ha = (n, t, e, s) => {
  const r = A(n);
  switch (r) {
    case Di:
      Va(n, t, e);
      break;
    case xs:
      Li(n, e, s);
      break;
    case _i:
      Ua(n, e, s);
      break;
    default:
      throw new Error("Unknown message type");
  }
  return r;
}, $a = 0, Ba = (n, t, e) => {
  switch (A(n)) {
    case $a:
      e(t, Ut(n));
  }
}, Jn = 3e4;
class za extends Io {
  /**
   * @param {Y.Doc} doc
   */
  constructor(t) {
    super(), this.doc = t, this.clientID = t.clientID, this.states = /* @__PURE__ */ new Map(), this.meta = /* @__PURE__ */ new Map(), this._checkInterval = /** @type {any} */
    setInterval(() => {
      const e = dn();
      this.getLocalState() !== null && Jn / 2 <= e - /** @type {{lastUpdated:number}} */
      this.meta.get(this.clientID).lastUpdated && this.setLocalState(this.getLocalState());
      const s = [];
      this.meta.forEach((r, i) => {
        i !== this.clientID && Jn <= e - r.lastUpdated && this.states.has(i) && s.push(i);
      }), s.length > 0 && Os(this, s, "timeout");
    }, Mt(Jn / 10)), t.on("destroy", () => {
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
    const e = this.clientID, s = this.meta.get(e), r = s === void 0 ? 0 : s.clock + 1, i = this.states.get(e);
    t === null ? this.states.delete(e) : this.states.set(e, t), this.meta.set(e, {
      clock: r,
      lastUpdated: dn()
    });
    const o = [], l = [], c = [], h = [];
    t === null ? h.push(e) : i == null ? t != null && o.push(e) : (l.push(e), Ae(i, t) || c.push(e)), (o.length > 0 || c.length > 0 || h.length > 0) && this.emit("change", [{ added: o, updated: c, removed: h }, "local"]), this.emit("update", [{ added: o, updated: l, removed: h }, "local"]);
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
const Os = (n, t, e) => {
  const s = [];
  for (let r = 0; r < t.length; r++) {
    const i = t[r];
    if (n.states.has(i)) {
      if (n.states.delete(i), i === n.clientID) {
        const o = (
          /** @type {MetaClientState} */
          n.meta.get(i)
        );
        n.meta.set(i, {
          clock: o.clock + 1,
          lastUpdated: dn()
        });
      }
      s.push(i);
    }
  }
  s.length > 0 && (n.emit("change", [{ added: [], updated: [], removed: s }, e]), n.emit("update", [{ added: [], updated: [], removed: s }, e]));
}, _e = (n, t, e = n.states) => {
  const s = t.length, r = Ne();
  D(r, s);
  for (let i = 0; i < s; i++) {
    const o = t[i], l = e.get(o) || null, c = (
      /** @type {MetaClientState} */
      n.meta.get(o).clock
    );
    D(r, o), D(r, c), qt(r, JSON.stringify(l));
  }
  return ht(r);
}, Na = (n, t, e) => {
  const s = Zt(t), r = dn(), i = [], o = [], l = [], c = [], h = A(s);
  for (let a = 0; a < h; a++) {
    const u = A(s);
    let d = A(s);
    const g = JSON.parse(Ut(s)), p = n.meta.get(u), v = n.states.get(u), b = p === void 0 ? 0 : p.clock;
    (b < d || b === d && g === null && n.states.has(u)) && (g === null ? u === n.clientID && n.getLocalState() != null ? d++ : n.states.delete(u) : n.states.set(u, g), n.meta.set(u, {
      clock: d,
      lastUpdated: r
    }), p === void 0 && g !== null ? i.push(u) : p !== void 0 && g === null ? c.push(u) : g !== null && (Ae(g, v) || l.push(u), o.push(u)));
  }
  (i.length > 0 || l.length > 0 || c.length > 0) && n.emit("change", [{
    added: i,
    updated: l,
    removed: c
  }, e]), (i.length > 0 || o.length > 0 || c.length > 0) && n.emit("update", [{
    added: i,
    updated: o,
    removed: c
  }, e]);
}, Fa = () => /* @__PURE__ */ new Set(), Pa = Array.from;
class ja {
  constructor() {
    this._observers = ce();
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  on(t, e) {
    bi(this._observers, t, Fa).add(e);
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  once(t, e) {
    const s = (...r) => {
      this.off(t, s), e(...r);
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
    return Pa((this._observers.get(t) || ce()).values()).forEach((s) => s(...e));
  }
  destroy() {
    this._observers = ce();
  }
}
const Ya = (n, t) => {
  const e = [];
  for (const s in n)
    e.push(t(n[s], s));
  return e;
}, qa = (n) => Ya(n, (t, e) => "".concat(encodeURIComponent(e), "=").concat(encodeURIComponent(t))).join("&"), jt = 0, xi = 3, ae = 1, Ja = 2, qe = [];
qe[jt] = (n, t, e, s, r) => {
  st(n, jt);
  const i = Ha(
    t,
    n,
    e.doc,
    e
  );
  s && i === xs && !e.synced && (e.synced = !0);
};
qe[xi] = (n, t, e, s, r) => {
  st(n, ae), De(
    n,
    _e(
      e.awareness,
      Array.from(e.awareness.getStates().keys())
    )
  );
};
qe[ae] = (n, t, e, s, r) => {
  Na(
    e.awareness,
    ya(t),
    e
  );
};
qe[Ja] = (n, t, e, s, r) => {
  Ba(
    t,
    e.doc,
    (i, o) => Wa(e, o)
  );
};
const dr = 3e4, Wa = (n, t) => console.warn("Permission denied to access ".concat(n.url, ".\n").concat(t)), Oi = (n, t, e) => {
  const s = va(t), r = at(), i = Ii(s), o = n.messageHandlers[i];
  return /** @type {any} */ o ? o(r, s, n, e, i) : console.error("Unable to compute message"), r;
}, Vi = (n) => {
  if (n.shouldConnect && n.ws === null) {
    const t = n._WS;
    n.ws = t, n.wsconnecting = !0, n.wsconnected = !1, n.synced = !1, t.evt.on("message", (e) => {
      n.wsLastMessageReceived = as();
      const s = Oi(n, e, !0);
      Ts(s) > 1 && t.send(ot(s));
    }), t.evt.on("error", (e) => {
      n.emit("connection-error", [e, n]);
    }), t.evt.on("close", (e) => {
      n.emit("connection-close", [e, n]), n.ws = null, n.wsconnecting = !1, n.wsconnected ? (n.wsconnected = !1, n.synced = !1, Os(
        n.awareness,
        Array.from(n.awareness.getStates().keys()).filter(
          (s) => s !== n.doc.clientID
        ),
        n
      ), n.emit("status", [
        {
          status: "disconnected"
        }
      ])) : n.wsUnsuccessfulReconnects++, setTimeout(
        Vi,
        Mi(
          ua(2, n.wsUnsuccessfulReconnects) * 100,
          n.maxBackoffTime
        ),
        n
      );
    }), t.evt.on("connect", () => {
      n.wsLastMessageReceived = as(), n.wsconnecting = !1, n.wsconnected = !0, n.wsUnsuccessfulReconnects = 0, n.emit("status", [
        {
          status: "connected"
        }
      ]);
      const e = at();
      if (st(e, jt), hs(e, n.doc), t.send(ot(e)), n.awareness.getLocalState() !== null) {
        const s = at();
        st(s, ae), De(
          s,
          _e(n.awareness, [
            n.doc.clientID
          ])
        ), t.send(ot(s));
      }
    }), n.emit("status", [
      {
        status: "connecting"
      }
    ]);
  }
}, Wn = (n, t) => {
  const e = n.ws;
  n.wsconnected && e && e.readyState === 1 && e.send(t), n.bcconnected && re(n.bcChannel, t, n);
};
class Ga extends ja {
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
    connect: r = !0,
    awareness: i = new za(s),
    params: o = {},
    protocols: l = [],
    WebSocketPolyfill: c,
    resyncInterval: h = -1,
    maxBackoffTime: a = 2500,
    disableBc: u = !1
  } = {}) {
    for (super(); t[t.length - 1] === "/"; )
      t = t.slice(0, t.length - 1);
    this.serverUrl = t, this.bcChannel = t + "/" + e, this.maxBackoffTime = a, this.params = o, this.protocols = l, this.roomname = e, this.doc = s, this._WS = c, this.awareness = i, this.wsconnected = !1, this.wsconnecting = !1, this.bcconnected = !1, this.disableBc = u, this.wsUnsuccessfulReconnects = 0, this.messageHandlers = qe.slice(), this._synced = !1, this.ws = null, this.wsLastMessageReceived = 0, this.shouldConnect = r, this._resyncInterval = 0, h > 0 && (this._resyncInterval = /** @type {any} */
    setInterval(() => {
      if (this.ws && this.ws.readyState === 1) {
        const d = at();
        st(d, jt), hs(d, s), this.ws.send(ot(d));
      }
    }, h)), this._bcSubscriber = (d, g) => {
      if (g !== this) {
        const p = Oi(this, new Uint8Array(d), !1);
        Ts(p) > 1 && re(this.bcChannel, ot(p), this);
      }
    }, this._updateHandler = (d, g) => {
      if (g !== this) {
        const p = at();
        st(p, jt), Ra(p, d), Wn(this, ot(p));
      }
    }, this.doc.on("update", this._updateHandler), this._awarenessUpdateHandler = ({ added: d, updated: g, removed: p }, v) => {
      const b = d.concat(g).concat(p), S = at();
      st(S, ae), De(
        S,
        _e(i, b)
      ), Wn(this, ot(S));
    }, this._exitHandler = () => {
      Os(
        this.awareness,
        [s.clientID],
        "app closed"
      );
    }, Be && typeof process < "u" && process.on("exit", this._exitHandler), i.on("update", this._awarenessUpdateHandler), this._checkInterval = /** @type {any} */
    setInterval(() => {
      this.wsconnected && dr < as() - this.wsLastMessageReceived && this.ws.close();
    }, dr / 10), r && this.connect();
  }
  get url() {
    const t = qa(this.params);
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
    this._resyncInterval !== 0 && clearInterval(this._resyncInterval), clearInterval(this._checkInterval), this.disconnect(), Be && typeof process < "u" && process.off("exit", this._exitHandler), this.awareness.off("update", this._awarenessUpdateHandler), this.doc.off("update", this._updateHandler), super.destroy();
  }
  connectBc() {
    if (this.disableBc)
      return;
    this.bcconnected || (xa(this.bcChannel, this._bcSubscriber), this.bcconnected = !0);
    const t = at();
    st(t, jt), hs(t, this.doc), re(this.bcChannel, ot(t), this);
    const e = at();
    st(e, jt), Ti(e, this.doc), re(this.bcChannel, ot(e), this);
    const s = at();
    st(s, xi), re(
      this.bcChannel,
      ot(s),
      this
    );
    const r = at();
    st(r, ae), De(
      r,
      _e(this.awareness, [
        this.doc.clientID
      ])
    ), re(
      this.bcChannel,
      ot(r),
      this
    );
  }
  disconnectBc() {
    const t = at();
    st(t, ae), De(
      t,
      _e(
        this.awareness,
        [this.doc.clientID],
        /* @__PURE__ */ new Map()
      )
    ), Wn(this, ot(t)), this.bcconnected && (Oa(this.bcChannel, this._bcSubscriber), this.bcconnected = !1);
  }
  disconnect() {
    this.shouldConnect = !1, this.disconnectBc(), this.ws !== null && this.ws.close();
  }
  connect() {
    this.shouldConnect = !0, !this.wsconnected && this.ws === null && (Vi(this), this.connectBc());
  }
}
class Ka {
  /**
   * Creates an instance of CollaborateRoom.
   * @author tony001
   * @date 2024-08-05 18:08:36
   * @param {string} id
   * @param {IData} doc
   */
  constructor(t, e, s, r) {
    /**
     * 唯一标识
     *
     * @author tony001
     * @date 2024-08-05 18:08:19
     * @type {string}
     */
    y(this, "id");
    /**
     * 房间名称
     *
     * @author tony001
     * @date 2024-08-06 10:08:25
     * @type {string}
     */
    y(this, "name");
    /**
     * 文档实例
     *
     * @author tony001
     * @date 2024-08-05 18:08:59
     * @type {Y.Doc}
     */
    y(this, "doc");
    /**
     * 上下文
     *
     * @author tony001
     * @date 2024-08-06 10:08:29
     * @type {IContext}
     */
    y(this, "context");
    /**
     * 视图参数
     *
     * @author tony001
     * @date 2024-08-06 10:08:34
     * @type {IParams}
     */
    y(this, "params");
    /**
     * 连接提供者
     *
     * @author tony001
     * @date 2024-08-05 18:08:04
     * @type {*}
     */
    y(this, "connectionProvider");
    this.context = t, this.params = e, this.id = s, this.doc = r;
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
    const e = ibiz.hub.getApp(this.context.srfappid).model.appId || ibiz.env.appId, s = "ws://".concat(window.location.host).concat(ibiz.env.baseUrl, "/").concat(e).concat(ibiz.env.mqttUrl), r = new Zc(
      this.id,
      this.name,
      Gi(),
      e
    );
    await r.connect(), this.connectionProvider = new Ga(
      s,
      this.name,
      this.doc,
      { WebSocketPolyfill: r, resyncInterval: 5e3 }
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
class Xa {
  constructor() {
    /**
     * 协同房间缓存实例
     *
     * @author tony001
     * @date 2024-08-06 14:08:38
     * @protected
     * @type {Map<string, Map<string, CollaborateRoom>>}
     */
    y(this, "collaborateMap", /* @__PURE__ */ new Map());
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
  async create(t, e, s, r) {
    const i = new Ka(t, e, s, r);
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
    const r = this.getAppId(t);
    if (!this.collaborateMap.has(r))
      throw new Error(
        ibiz.i18n.t("runtime.utils.collaborateManager.invalidCollaborateRoom", {
          id: s
        })
      );
    const i = this.collaborateMap.get(r);
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
    const r = this.getAppId(t);
    if (this.collaborateMap.has(r)) {
      const i = this.collaborateMap.get(r);
      i && i.has(s) && (i.get(s).destroy(), i.delete(s));
    }
  }
}
class Za {
  constructor(t) {
    // 配置项
    y(this, "config");
    // Yjs 文档实例
    y(this, "yDoc", null);
    // 协同房间实例
    y(this, "collaborateRoom", null);
    // 内容变更防抖动计时器
    y(this, "contentChangeDebounceTimer", null);
    // 是否为 Yjs 触发的内容更新（防止循环覆盖）
    y(this, "isYjsInitiatedUpdate", !1);
    // 协同管理器实例
    y(this, "collaborateManager", null);
    // 滚动定时器
    y(this, "scrollTimer");
    this.config = {
      enableCursorSync: !0,
      editorId: "vditor-bridge-".concat(Date.now()),
      userInfo: {
        id: t.context.srfuserid || "user-".concat(Date.now()),
        name: t.context.srfusername || "匿名用户",
        color: "#".concat(Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"))
      },
      ...t
    }, this.config.enableCursorSync && (this.collaborateManager = new Xa(), this.initYjsDoc(), this.bindVditorContentChange());
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
    this.yDoc = new me();
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
    var c;
    const e = t.element.querySelector(".vditor-content"), s = window.getSelection();
    if (!(s != null && s.rangeCount) || !(e != null && e.contains(s.anchorNode)))
      return null;
    const r = s.getRangeAt(0), i = document.createRange();
    i.selectNodeContents(e), i.setEnd(r.startContainer, r.startOffset);
    const o = i.toString().length;
    i.setEnd(r.endContainer, r.endOffset);
    const l = i.toString().length;
    return {
      start: o,
      end: l,
      userId: (c = this.config.userInfo) == null ? void 0 : c.id
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
    const r = s.getRangeAt(0);
    if (!r.collapsed)
      return null;
    const i = document.createRange();
    return i.selectNodeContents(e), i.setEnd(r.startContainer, r.startOffset), i.toString().length;
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
    const { start: s, end: r, userId: i = "default" } = e, o = t.element.querySelector(".vditor-content");
    if (!o)
      return;
    const l = o.textContent;
    if (o.querySelectorAll(
      ".selection-mask-".concat(i)
    ).forEach((u) => u.remove()), s < 0 || r > l.length || s >= r)
      return;
    getComputedStyle(o).position === "static" && (o.style.position = "relative");
    let h = 0;
    function a(u) {
      if (u.nodeType !== Node.TEXT_NODE) {
        Array.from(u.childNodes).forEach(($) => a($));
        return;
      }
      const g = u.textContent.length, p = h, v = h + g, b = Math.max(s, p), S = Math.min(r, v);
      if (b >= S) {
        h = v;
        return;
      }
      const V = b - p, G = S - p, H = document.createRange();
      try {
        H.setStart(u, V), H.setEnd(u, G);
      } catch ($) {
        h = v;
        return;
      }
      const N = H.getClientRects(), nt = o.getBoundingClientRect();
      Array.from(N).forEach(($) => {
        if ($.width <= 0 || $.height <= 0)
          return;
        const Q = document.createElement("div");
        Q.className = "selection-mask selection-mask-".concat(i), Object.assign(Q.style, {
          left: "".concat($.left - nt.left, "px"),
          // 字符实际左坐标
          top: "".concat($.top - nt.top, "px"),
          // 字符实际上坐标
          width: "".concat($.width, "px"),
          // 字符区间实际宽度（非整行）
          height: "".concat($.height, "px")
          // 字符行高
        }), o.appendChild(Q);
      }), h = v;
    }
    a(o);
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
    const { cursorOffset: s } = e.cursor, r = e.user.id, i = t.element.querySelector(".vditor-content");
    if (!i)
      return;
    const o = i.textContent, l = i.querySelector(".cursor-mask-".concat(r));
    if (l && l.remove(), s < 0 || s > o.length)
      return;
    getComputedStyle(i).position === "static" && (i.style.position = "relative");
    let c = 0, h = null, a = 0;
    function u(S) {
      if (h || S.nodeType !== Node.TEXT_NODE) {
        Array.from(S.childNodes).forEach((N) => u(N));
        return;
      }
      const V = S.textContent, G = c, H = c + V.length;
      if (s <= H) {
        h = S, a = s - G;
        return;
      }
      c = H;
    }
    if (u(i), !h)
      return;
    const d = document.createRange();
    d.setStart(h, a), d.collapse(!0);
    const g = d.getBoundingClientRect(), p = i.getBoundingClientRect(), v = document.createElement("div");
    v.className = "vditor-cursor-item cursor-mask-".concat(r), Object.assign(v.style, {
      left: "".concat(g.left - p.left, "px"),
      top: "".concat(g.top - p.top, "px"),
      height: "".concat(g.height, "px"),
      // 行高
      backgroundColor: e.user.color
    });
    const b = document.createElement("span");
    b.classList.add("vditor-cursor-label"), b.style.backgroundColor = e.user.color, b.textContent = e.user.name, v.appendChild(b), i.appendChild(v);
  }
  /**
   * 清除所有遮罩(包括选中与光标)
   *
   * @param {*} vditor
   */
  clearAllSelectionMasks(t) {
    const e = t.element.querySelector(".vditor-content"), s = e == null ? void 0 : e.querySelectorAll(".selection-mask");
    s == null || s.forEach((i) => i.remove());
    const r = e == null ? void 0 : e.querySelectorAll(".vditor-cursor-item");
    r == null || r.forEach((i) => i.remove());
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
        const e = this.yDoc.getMap("vditor-data").get("content") || "";
        if (this.config.vditor.getValue() !== e) {
          const s = this.calcCursorRealPosition();
          this.config.vditor.setValue(e), this.restoreVditorFocus(this.config.vditor.vditor, s);
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
    const r = s.textContent || "", { cursorOffset: i } = e;
    if (i === null || i < 0 || i > r.length)
      return;
    let o = 0, l = null, c = 0;
    const h = (d) => {
      if (l || d.nodeType !== Node.TEXT_NODE) {
        Array.from(d.childNodes).forEach((S) => h(S));
        return;
      }
      const g = d, p = g.textContent || "", v = o, b = o + p.length;
      if (i <= b) {
        l = g, c = i - v;
        return;
      }
      o = b;
    };
    if (h(s), !l)
      return;
    const a = document.createRange(), u = window.getSelection();
    if (e.selection) {
      const { start: d, end: g } = e.selection;
      if (d !== void 0 && g !== void 0) {
        let p = null, v = 0, b = null, S = 0;
        o = 0;
        const V = (G) => {
          if (G.nodeType !== Node.TEXT_NODE) {
            Array.from(G.childNodes).forEach(
              (Q) => V(Q)
            );
            return;
          }
          const H = G, N = H.textContent || "", nt = o, $ = o + N.length;
          !p && d >= nt && d <= $ && (p = H, v = d - nt), !b && g >= nt && g <= $ && (b = H, S = g - nt), o = $;
        };
        V(s), p && b && (a.setStart(p, v), a.setEnd(b, S));
      } else
        a.setStart(l, c), a.collapse(!0);
    }
    u.removeAllRanges(), u.addRange(a), this.config.vditor.focus();
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
        const r = s == null ? void 0 : s.findIndex(
          (i) => {
            var o;
            return i.user.id === ((o = this.config.userInfo) == null ? void 0 : o.id);
          }
        );
        !r && r !== 0 || r === -1 ? s.push(this.userState) : s[r] = this.userState, e.set("users", s);
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
        const r = s == null ? void 0 : s.findIndex(
          (i) => {
            var o;
            return i.user.id === ((o = this.config.userInfo) == null ? void 0 : o.id);
          }
        );
        r >= 0 && s.splice(r, 1), e.set("users", s);
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
const Gn = /* @__PURE__ */ gr({
  name: "IBizVditor",
  props: {
    value: String,
    controller: fs,
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
  emits: ur(),
  setup(n, {
    emit: t,
    slots: e
  }) {
    var Rs;
    const s = us("vditor"), r = n.controller, i = "vditor-".concat(Ht()), o = k(), l = k(!1), c = k(!1), h = k(""), a = k(!1), u = k(!0), d = k(!1), g = k(!0), p = k(!1), v = k(!0), b = k(!1), S = k(!1);
    let V = "left";
    const G = k(!1), H = k(!1), N = k(null), nt = k({}), $ = k(""), {
      zIndex: Q
    } = an(), {
      UIStore: Je
    } = an(), ve = k(Je.theme), be = k(""), zt = ibiz.util.file.getUploadHeaders(), We = k({
      ...zt
    });
    let te = !1;
    const bt = k(!1), Nt = k(!1), K = k(!1), Dt = k(null), ee = k(!1), _t = k(), ye = k(""), Ce = k([]), {
      editorParams: j
    } = r;
    j && (j.enablenoaccess && (te = ((Rs = r == null ? void 0 : r.editorParams) == null ? void 0 : Rs.enablenoaccess) === "true"), j.enableEdit && (a.value = !0, bt.value = r.toBoolean(j.enableEdit)), j.enableFullScreen && (Nt.value = r.toBoolean(j.enableFullScreen)), j.WIDESCREENMODE && (u.value = r.toBoolean(j.WIDESCREENMODE)), j.ENABLESHORTCUT && (g.value = r.toBoolean(j.ENABLESHORTCUT)), j.SHOWWIDESCREEN && (d.value = r.toBoolean(j.SHOWWIDESCREEN)), j.SHOWOUTLINE && (S.value = r.toBoolean(j.SHOWOUTLINE)), j.TOOLBARALIGN && (V = j.TOOLBARALIGN)), n.readonly && (a.value = !0);
    const dt = pr(() => {
      let w = "MD";
      return n.data && n.data[r.valueItem] && (w = n.data[r.valueItem]), w;
    }), Ge = () => {
      var E, x, O;
      if (!ee.value || !r.vditor)
        return;
      let C = ((E = n.data) == null ? void 0 : E.srfuf) === Yi.CREATE ? "draft" : (x = n.data) == null ? void 0 : x.srfkey;
      (O = r.params) != null && O.srfmarkopendatakey && (C = r.params.srfmarkopendatakey), r.collaborateKey && (C = r.collaborateKey), Dt.value = new Za({
        vditor: r.vditor,
        context: r.context,
        params: r.params,
        enableCursorSync: r.enableRealtime,
        roomName: C,
        editorId: i
      }), Dt.value.init();
    };
    Vt(() => {
      var w;
      return (w = r.parent.form) == null ? void 0 : w.state.isLoaded;
    }, (w) => {
      w && (ee.value = !0, Ge());
    }, {
      immediate: !0
    });
    const An = (w, C) => {
      const E = {
        ...r.editorParams
      };
      return E.exportparams && (E.exportParams = JSON.parse(E.exportparams)), C && C.folder && (E.osscat = C.folder), ibiz.util.file.calcFileUpDownUrl(r.context, r.params, w, E).downloadUrl;
    };
    let it;
    const Dn = async () => {
      const {
        appDataEntityId: w
      } = r.model;
      if (!w || !r.deACMode)
        return;
      const C = Q.increment();
      it = await ibiz.aiChatUtil.getAIChat();
      const {
        containerOptions: E,
        chatOptions: x
      } = await ibiz.aiChatUtil.getEditorExAIChatParams(r.editorParams, r.context, r.params, n.data, r.deACMode, {
        chatInstance: it,
        view: r.view,
        ctrl: r.ctrl
      }), O = await ibiz.aiChatUtil.getAIResourceOptions(r.context, r.params);
      it.create({
        resourceOptions: O,
        containerOptions: {
          zIndex: C,
          ...E
        },
        chatOptions: {
          caption: r.deACMode.logicName,
          context: {
            ...r.context
          },
          params: {
            ...r.params,
            srfactag: r.deACMode.codeName
          },
          appDataEntityId: w,
          ...x,
          action: (M, U) => {
            M === "backfill" && t("change", U.realcontent);
          }
        }
      });
    }, Ft = async () => {
      const w = r.vditor.vditor[r.vditor.vditor.currentMode];
      r.maxHeight && w && (b.value = w.element.scrollHeight > w.element.offsetHeight && w.element.scrollHeight > r.maxHeight);
    }, Ke = (w) => {
      w.element.querySelectorAll("img").forEach((C) => {
        C.addEventListener("load", () => {
          Ft();
        });
      });
    }, _n = async (w) => {
      if (ye.value = w, Ce.value = [w], await ie(), _t.value) {
        const {
          container: C
        } = _t.value.$refs;
        C && C.children[0].click();
      }
    }, ke = (w, C = !1) => {
      if (!r.vditor || !r.vditor.vditor || !r.vditor.vditor.lute)
        return;
      const E = Zi(w);
      let x = dt.value;
      E !== "TEXT" && (x = E);
      let O = w;
      n.readonly && O.includes("&") && (O = O.replace(/&reg/g, "&amp;reg").replace(/&copy/g, "&amp;copy").replace(/&trade/g, "&amp;trade"));
      const M = r.vditor.vditor[r.vditor.vditor.currentMode];
      x === "HTML" ? M && (!$.value || M.element.innerHTML !== $.value || C) && (r.vditor.setValue(""), r.vditor.insertValue(O), r.vditor.vditor.outline.render(r.vditor.vditor), Ke(M), Ft()) : (!$.value || M.element.innerHTML !== $.value || C) && (r.vditor.setValue(O), Ke(M), Ft());
    }, ne = () => {
      if (dt.value === "MD")
        t("change", r.vditor.getValue());
      else if (dt.value === "HTML") {
        let w = r.vditor.getHTML();
        w = r.handleHardBreak(w), t("change", w);
      }
    }, Tn = () => {
      const {
        vditor: w
      } = r.vditor, {
        outline: C
      } = w;
      if (C.element) {
        const E = C.element.querySelector(".vditor-outline__title");
        if (E) {
          const x = document.createElement("span");
          x.innerHTML = oo, x.addEventListener("click", () => {
            C.toggle(r.vditor.vditor, !1);
          }), E.appendChild(x);
        }
      }
    }, Ln = () => {
      if (a.value || !d.value)
        return;
      const {
        vditor: w
      } = r.vditor, C = (O) => {
        const M = document.createElement("div");
        M.classList.add(s.e("custom-toolbar"));
        const U = document.createElement("div");
        U.innerHTML = no, U.title = "宽屏模式", U.classList.add("widescreen"), U.addEventListener("click", () => {
          u.value = !0;
        });
        const z = document.createElement("div");
        z.innerHTML = so, z.title = "标准模式", z.classList.add("collapse"), z.addEventListener("click", () => {
          u.value = !1;
        }), M.appendChild(U), M.appendChild(z), O.prepend(M);
      }, E = w.element.querySelector(".vditor-ir");
      E && C(E);
      const x = w.element.querySelector(".vditor-wysiwyg");
      x && C(x);
    }, Xe = async (w, C) => {
      const E = An(w, C);
      let x = E.replace("%fileId%", C.id);
      const O = C.filename;
      if (ibiz.config.common.enableDownloadTicket) {
        const M = await ibiz.util.file.getDownloadTicket(r.context, r.params, w, {
          fileId: C.id
        }, r.downloadTicketParams);
        if (M && M.ticket)
          return x = E.replace("%fileId%", M.ticket), {
            url: x,
            alt: O
          };
      }
      return {
        url: x,
        alt: O
      };
    }, xn = () => {
      const w = [], {
        QUOTEURL: C,
        USERURL: E
      } = r.editorParams;
      E && w.push({
        key: "@",
        hint: async (M) => {
          l.value = !0;
          try {
            return await r.mentionController.getUsers({
              data: n.data,
              query: M
            });
          } finally {
            l.value = !1;
          }
        }
      }), C && w.push({
        key: "#",
        hint: async (M) => {
          l.value = !0;
          try {
            return await r.markerController.getMarkers({
              data: n.data,
              query: M
            });
          } finally {
            l.value = !1;
          }
        }
      });
      const x = e.editorSwitchMenu ? 128 : 8, O = {
        theme: ve.value,
        height: r.maxHeight || r.parent.model.height || 600,
        placeholder: r.placeHolder,
        cache: {
          enable: !1
        },
        toolbarConfig: {
          pin: !1,
          ellipsis: V === "left",
          offsetWidth: x
        },
        toolbar: [...yr],
        fullscreen: {
          index: Q
        },
        preview: {
          maxWidth: 960,
          transform: (M) => r.transformHtml(M)
        },
        link: {
          click: (M) => {
            const U = M.textContent;
            r.openUrl(U);
          }
        },
        upload: {
          url: be.value,
          // 自定义增加 http  header
          headers: We.value,
          fieldName: "file",
          filename: (M) => M,
          success: (M, U) => {
            const z = JSON.parse(U);
            ibiz.config.common.enableDownloadTicket && z.ticket && ibiz.util.file.setDownloadTicket(z.id, z.ticket), Xe(n.data || {}, z).then((Pt) => {
              var Us;
              const {
                url: Lt,
                alt: Se
              } = Pt;
              r.vditor.insertValue("![".concat(Se, "](").concat(Lt, ")")), (Us = Dt.value) == null || Us.syncVditorToYjs();
            });
          },
          error: (M) => {
            const U = M || ibiz.i18n.t("util.uploadManager.failed");
            ibiz.message.error(U);
          }
        },
        image: {
          preview: (M) => {
            _n(M.src);
          }
        },
        input: () => {
          Ft();
        },
        focus: () => {
          t("focus");
        },
        imageFocus: (M) => {
          if (!a.value) {
            N.value = M, H.value = !0;
            const U = r.vditor.vditor[r.vditor.vditor.currentMode], {
              scrollTop: z
            } = U.element;
            nt.value = {
              top: "".concat(M.offsetTop - z + 56 - 40, "px"),
              left: "".concat(M.offsetLeft, "px"),
              zIndex: Q.zIndex + 2
            };
          }
        },
        renderAfter: () => {
          Ft();
        },
        blur: () => {
          t("blur");
          const M = r.vditor.vditor[r.vditor.vditor.currentMode];
          M && ($.value = M.element.innerHTML);
          const {
            hint: U
          } = r.vditor.vditor;
          U.element.style.display === "none" && !bt.value && ne();
          let z = "";
          dt.value === "MD" ? z = r.vditor.getValue() : dt.value === "HTML" && (z = r.vditor.getHTML(), z = r.handleHardBreak(z)), h.value = z;
          let Pt = !1;
          const Lt = r.vditor.getEditorRange();
          if (Lt) {
            const Se = Lt.startContainer;
            Se.nodeType === 1 && Se.getAttribute("data-type") === "img" && (Pt = !0);
          }
          H.value = Pt;
        },
        select: () => {
          var M;
          if (!a.value) {
            G.value = !0;
            const U = r.vditor.getCursorPosition();
            nt.value = {
              top: "".concat(U.top + 90, "px"),
              left: "".concat(U.left, "px"),
              zIndex: Q.zIndex + 2
            }, (M = Dt.value) == null || M.updateOtherClient();
          }
        },
        unSelect: () => {
          var z;
          G.value = !1;
          let M = !1;
          const U = getSelection();
          if (!a.value && U && U.rangeCount > 0) {
            const Pt = (z = getSelection()) == null ? void 0 : z.getRangeAt(0);
            if (Pt) {
              const Lt = Pt.startContainer;
              Lt && Lt.nodeType !== 3 && Lt.getAttribute("data-type") === "img" && (M = !0);
            }
          }
          H.value = M;
        },
        fullScreen: () => {
          K.value = !0;
        },
        unFullScreen: () => {
          K.value = !1;
        },
        after: () => {
          c.value = !0, a.value && r.vditor.disabled(), Tn(), Ln(), r.renderAfter(), n.value && ke(n.value), Ge();
        },
        hint: {
          extend: w
        },
        cdn: hn.dir("vditor")
      };
      if (r.templateActionTag && (O.toolbar.unshift("|"), O.toolbar.unshift({
        name: "template",
        tipPosition: "n",
        tip: "模板",
        className: "vditor-toolbar__template",
        icon: io,
        click() {
          r.doInLineAIUIAction(r.templateActionTag, r.context.srfappid).then(() => {
            ne();
          });
        }
      })), Nt.value) {
        const M = O.toolbar.indexOf("fullscreen");
        M !== -1 && O.toolbar.splice(M, 1);
      }
      r.chatCompletion && (O.toolbar.unshift("|"), O.toolbar.unshift({
        name: "AI",
        tipPosition: "n",
        tip: "AI询问",
        className: "vditor-toolbar__ai",
        icon: Cr,
        click() {
          Dn();
        }
      })), Ki(O, {
        outline: {
          enable: S.value,
          position: "right"
        }
      }), r.vditor = new window.Vditor(o.value, {
        ...O
      });
    };
    Vt(() => n.value, (w) => {
      if (w)
        ke(w), h.value = w;
      else if (h.value = "", r.vditor) {
        const C = r.vditor.vditor[r.vditor.vditor.currentMode];
        C.element.innerHTML = "";
      }
    }, {
      immediate: !0
    }), Vt(() => n.data, (w) => {
      if (w) {
        const C = {
          ...r.editorParams,
          enableNoAccess: te
        };
        C.uploadparams && (C.uploadParams = JSON.parse(C.uploadparams));
        const E = ibiz.util.file.calcFileUpDownUrl(r.context, r.params, w, C);
        be.value = E.uploadUrl;
      }
    }, {
      immediate: !0,
      deep: !0
    }), Vt(() => dt.value, () => {
      r.formatType = dt.value;
    }, {
      immediate: !0
    }), mr(() => {
      o.value && xn();
    }), wr(() => {
      Dt.value && Dt.value.destroy();
    });
    const On = (w) => {
      w.preventDefault();
      const C = ibiz.inLineAIUtil.calcContextMenus(r.deACMode, (M) => {
        r.doInLineAIUIAction(M, r.model.appId);
      }), E = Q.increment(), x = r.vditor.getCursorPosition(), O = r.vditor.vditor.element.getBoundingClientRect();
      ibiz.inLineAIUtil.showContextMenus(
        // 编辑器的左侧距离+选区距离编辑器左侧距离
        O.x + x.left,
        // 编辑器的上方距离+选区距离编辑器上方距离+悬浮工具栏高度
        O.y + x.top + 123,
        C,
        {
          zIndex: E,
          onClose: () => {
            Q.decrement();
          }
        }
      );
    }, Vs = (w, C) => {
      if (w.preventDefault(), r.vditor && r.vditor.vditor.toolbar) {
        const E = r.vditor.vditor.toolbar.elements || {};
        E[C] && E[C].children[0] && E[C].children[0].click();
      }
    }, Ze = (w, C) => {
      if (w.preventDefault(), !N.value)
        return;
      H.value = !1;
      const E = N.value.parentElement, x = E == null ? void 0 : E.children[2];
      if (C === "remove")
        E && E.remove();
      else if (C === "100")
        N.value.removeAttribute("style"), N.value.alt = N.value.alt.split("#")[0], x && (x.textContent = N.value.alt);
      else {
        N.value.style.width = "".concat(C, "%");
        const O = N.value.alt.split("#")[0];
        N.value.alt = "".concat(O, "#").concat(C, "%"), x && (x.textContent = N.value.alt);
      }
      ne();
    }, m = (w) => {
      const C = w.shortcut.split("/");
      return f("div", {
        class: s.e("shortcut-mark")
      }, [C.map((E) => f("div", {
        class: s.e("shortcut-mark-item")
      }, [E]))]);
    }, I = (w) => w.map((C) => C.type === "group" ? f("div", {
      class: s.e("shortcut-group")
    }, [f("span", null, [C.name]), I(C.children)]) : f("div", {
      class: s.e("shortcut")
    }, [f("span", null, [C.name]), m(C)])), _ = () => !b.value || !a.value ? null : v.value ? f("div", {
      class: s.e("toggle"),
      onClick: () => {
        v.value = !v.value;
      }
    }, [xt("展开更多 "), f(gt("ion-icon"), {
      name: "arrow-down-outline"
    }, null)]) : f("div", {
      class: s.e("toggle"),
      onClick: () => {
        v.value = !v.value;
      }
    }, [xt("收起更多 "), f(gt("ion-icon"), {
      name: "arrow-up-outline"
    }, null)]), B = () => {
      if (a.value = !a.value, !a.value)
        r.vditor.enable(), v.value = !0;
      else {
        const w = r.vditor.vditor[r.vditor.vditor.currentMode];
        w && w.element.scroll(0, 0), r.vditor.disabled();
      }
    }, Y = () => {
      var C;
      let {
        value: w
      } = n;
      dt.value === "HTML" && (w = (C = n.value) == null ? void 0 : C.replace(/<p data-block="0">​<\/p>$/g, "")), w !== h.value ? ibiz.confirm.warning({
        title: "确认取消",
        desc: "确定要取消编辑吗？取消编辑将无法保存修改的内容，且不能找回。"
      }).then((E) => {
        E && (n.value ? (ke(n.value, !0), h.value = n.value) : h.value = "", B());
      }) : B();
    }, L = () => {
      a.value = !0;
      const w = r.vditor.vditor[r.vditor.vditor.currentMode];
      w && w.element.scroll(0, 0), r.vditor.disabled(), ne(), K.value && (K.value = !1);
    }, tt = () => bt.value && !a.value ? f("div", {
      class: [s.b("footer"), {
        [s.b("footer-dialog")]: K.value
      }]
    }, [f("div", {
      class: s.be("footer", "cancel"),
      onClick: () => Y()
    }, [xt("取消")]), f("div", {
      class: s.be("footer", "save"),
      onClick: () => L()
    }, [xt("保存")])]) : null, yt = () => {
      K.value = !K.value, G.value = !1;
      const {
        vditor: w
      } = r.vditor, {
        outline: C
      } = w;
      C.toggle(r.vditor.vditor, K.value);
    }, Tt = () => Nt.value ? K.value ? f("span", {
      title: "退出全屏",
      onClick: () => yt()
    }, [vo]) : f("span", {
      title: "全屏查看",
      onClick: () => yt()
    }, [wo]) : null, Vn = () => bt.value || Nt.value ? f("div", {
      class: s.e("header-toolbar")
    }, [bt.value && a.value ? f("span", {
      title: "编辑",
      onClick: () => B()
    }, [mo]) : null, Tt()]) : null, Qe = (w) => {
      if (_t.value) {
        const {
          container: C
        } = _t.value.$refs;
        if (C) {
          const E = C.querySelector(".el-image-viewer__wrapper");
          E == null || E[w]("keydown", Ri);
        }
      }
    }, Ri = async (w) => {
      (w.key === "Escape" || w.keyCode === 27) && (w.stopPropagation(), w.preventDefault(), await ie(), Qe("removeEventListener"), Ce.value = []);
    }, Ui = async () => {
      await ie(), Qe("addEventListener");
    };
    return {
      ns: s,
      editorId: i,
      vditorRef: o,
      previewRef: _t,
      loading: l,
      isInit: c,
      collapse: v,
      widescreenMode: u,
      enableEdit: bt,
      readonlyState: a,
      isFullScreen: K,
      showShortcut: p,
      enableShortcut: g,
      showHoverToolbar: G,
      showImageToolbar: H,
      hoverToolbarStyle: nt,
      handleInlineAiClick: On,
      handleToolbarClick: Vs,
      handleImageToolbarClick: Ze,
      renderShortcut: I,
      renderToggle: _,
      renderFooter: tt,
      renderHeaderToolbar: Vn,
      renderPreview: () => f(gt("el-image"), {
        class: s.e("preview"),
        ref: "previewRef",
        "zoom-rate": 1.1,
        src: ye.value,
        "preview-src-list": Ce.value,
        "hide-on-click-modal": !0,
        onShow: Ui,
        fit: "cover"
      }, null)
    };
  },
  render() {
    var t;
    let n = {};
    return this.collapse && this.controller.maxHeight && (n = this.ns.cssVarBlock({
      "max-height": "".concat(this.controller.maxHeight, "px")
    })), f("div", {
      class: [this.ns.b("container"), this.ns.is("enable-edit", this.enableEdit), this.ns.is("fullScreen", this.isFullScreen), this.ns.is("disabled", this.readonlyState), this.ns.is("readonly", this.readonly), this.ns.is("widescreen", !this.readonlyState && this.widescreenMode), this.ns.is("loading", !this.isInit)],
      style: n
    }, [this.renderHeaderToolbar(), vr(f("div", {
      id: this.editorId,
      ref: "vditorRef",
      class: ["vditor", this.ns.b()]
    }, null), [[br("loading"), this.loading]]), this.renderToggle(), this.renderFooter(), this.renderPreview(), !this.readonlyState && this.enableShortcut ? f("div", {
      class: this.ns.e("shortcut-icon"),
      onClick: () => {
        this.showShortcut = !0;
      }
    }, [ro]) : null, f("div", {
      class: [this.ns.e("slider"), this.ns.is("show", this.showShortcut)]
    }, [f("div", {
      class: this.ns.e("slider-header")
    }, [f("div", {
      class: this.ns.e("slider-title")
    }, [xt("快捷键")]), f(gt("ion-icon"), {
      name: "close-outline",
      onClick: () => {
        this.showShortcut = !1;
      }
    }, null)]), f("div", {
      class: this.ns.e("slider-content")
    }, [this.renderShortcut(yo)])]), this.showHoverToolbar ? f("div", {
      style: this.hoverToolbarStyle,
      class: this.ns.e("hover-toolbar")
    }, [(t = this.controller) != null && t.chatCompletion ? f("button", {
      class: "vditor-inline-ai",
      title: "AI",
      onClick: this.handleInlineAiClick
    }, [kr]) : null, f("button", {
      class: "vditor-bold",
      title: "加粗",
      onClick: (e) => this.handleToolbarClick(e, "bold")
    }, [Kn]), f("button", {
      class: "vditor-italic",
      title: "斜体",
      onClick: (e) => this.handleToolbarClick(e, "italic")
    }, [Xn]), f("button", {
      class: "vditor-strike",
      title: "删除线",
      onClick: (e) => this.handleToolbarClick(e, "strike")
    }, [Zn]), f("button", {
      class: "vditor-link",
      title: "链接",
      onClick: (e) => this.handleToolbarClick(e, "link")
    }, [Qn])]) : null, this.showImageToolbar ? f("div", {
      style: this.hoverToolbarStyle,
      class: this.ns.e("hover-toolbar")
    }, [f("button", {
      onClick: (e) => this.handleImageToolbarClick(e, "30")
    }, [xt("30%")]), f("button", {
      onClick: (e) => this.handleImageToolbarClick(e, "50")
    }, [xt("50%")]), f("button", {
      onClick: (e) => this.handleImageToolbarClick(e, "100")
    }, [xt("100%")]), f("button", {
      title: "删除图片",
      onClick: (e) => this.handleImageToolbarClick(e, "remove")
    }, [f(gt("ion-icon"), {
      name: "trash-outline"
    }, null)])]) : null, this.$slots.editorSwitchMenu ? this.$slots.editorSwitchMenu() : null]);
  }
}), Qa = Ji(Gn, function(n) {
  n.component(Gn.name, Gn), n.component($s.name, $s), Me("HTMLEDITOR_VDITOR", () => new Ee()), Me(
    "HTMLEDITOR_VDITOR_COMMENT_WIKI",
    () => new Ee("COMMENT")
  ), Me(
    "HTMLEDITOR_VDITOR_COMMENT_LIBARAY",
    () => new Ee("COMMENT")
  ), Me(
    "HTMLEDITOR_VDITOR_COMMENT_PROJECT",
    () => new Ee("COMMENT")
  ), Me(
    "HTMLEDITOR_VDITOR_COMMENT_PRODUCT",
    () => new Ee("COMMENT")
  );
}), uh = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(n) {
    n.use(Qa);
  }
};
export {
  Qa as IBizVditorComment,
  uh as default
};
