import './assets/style.css';
import './assets/style.css';
import { withInstall as O, useNamespace as h } from "@ibiz-template/vue3-util";
import { registerPanelItemProvider as S, PanelItemController as V } from "@ibiz-template/runtime";
import { inject as y, defineComponent as p, ref as P, onBeforeUnmount as T, createVNode as r, h as C, resolveComponent as c, createTextVNode as U } from "vue";
import { NOOP as f, listenJSEvent as x, RuntimeError as N } from "@ibiz-template/core";
import { isArray as v } from "lodash-es";
/*!
  * vue-router v4.2.5
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */
var g;
(function(s) {
  s.pop = "pop", s.push = "push";
})(g || (g = {}));
var w;
(function(s) {
  s.back = "back", s.forward = "forward", s.unknown = "";
})(w || (w = {}));
Symbol(process.env.NODE_ENV !== "production" ? "navigation failure" : "");
var b;
(function(s) {
  s[s.aborted = 4] = "aborted", s[s.cancelled = 8] = "cancelled", s[s.duplicated = 16] = "duplicated";
})(b || (b = {}));
Symbol(process.env.NODE_ENV !== "production" ? "router view location matched" : "");
Symbol(process.env.NODE_ENV !== "production" ? "router view depth" : "");
const z = Symbol(process.env.NODE_ENV !== "production" ? "router" : "");
Symbol(process.env.NODE_ENV !== "production" ? "route location" : "");
Symbol(process.env.NODE_ENV !== "production" ? "router view location" : "");
function D() {
  return y(z);
}
var L = Object.defineProperty, j = (s, t, e) => t in s ? L(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e, a = (s, t, e) => (j(s, typeof t != "symbol" ? t + "" : t, e), e);
const u = class {
  /**
   * 获取主题色
   *
   * @static
   * @return {*}
   * @memberof Util
   */
  static getThemeVar() {
    const t = document.documentElement;
    return t ? getComputedStyle(t).getPropertyValue("--ibiz-color-primary") : null;
  }
  /**
   * 是否为中文字符串
   *
   * @static
   * @param {string} char
   * @return {*}
   * @memberof Util
   */
  static isChineseChart(t) {
    return /[\u4E00-\u9FA5]/.test(t);
  }
  /**
   * 是否同时存在英文和中文
   *
   * @static
   * @param {string} str
   * @return {*}
   * @memberof Util
   */
  static hasChineseAndEnglish(t) {
    return /[\u4e00-\u9fa5]+.*[a-zA-Z]+|[a-zA-Z]+.*[\u4e00-\u9fa5]+/.test(t);
  }
  /**
   * 计算图片文字
   *
   * @static
   * @param {string} textVal
   * @return {*}
   * @memberof Util
   */
  static calcTextPhoto(t) {
    if (t && t.toString().length < 2)
      return t;
    if (t && t.toString().length >= 2) {
      if (this.hasChineseAndEnglish(t)) {
        const e = t.split("").find((o) => /[a-zA-Z]/.test(o)) || "", n = t.split("").find((o) => /[\u4E00-\u9FA5]/.test(o)) || "";
        return "".concat(e).concat(n).toLowerCase();
      }
      return /[a-zA-Z]/.test(t) ? t.split("").filter((e) => /[a-zA-Z]/.test(e)).slice(0, 2).join("").toUpperCase() : /[\u4E00-\u9FA5]/.test(t) ? t.split("").filter((e) => /[\u4E00-\u9FA5]/.test(e)).slice(-2).join("") : t.replaceAll(" ", "").substring(0, 2);
    }
  }
};
a(u, "calcColorPhoto", (s) => {
  if (!s)
    return "";
  let t = 0;
  for (let l = 0; l < s.length; l++)
    if (u.isChineseChart(s))
      t = s.charCodeAt(l) + ((t << 5) - t), t = t & t;
    else {
      const F = s.charCodeAt(l);
      t += F.toString(16);
    }
  const e = String(t).substring(0, 6);
  let n = parseInt(e.substring(0, 2), 16), o = parseInt(e.substring(2, 4), 16), i = parseInt(e.substring(4, 6), 16);
  n < 0 && (n = 10), o < 0 && (o = 10), i < 0 && (i = 10);
  const m = "#".concat(n.toString(16).padStart(2, "0")).concat(o.toString(16).padStart(2, "0")).concat(i.toString(16).padStart(2, "0"));
  return m === "#FFFFFF" && u.getThemeVar() || m;
});
let I = u;
const A = /* @__PURE__ */ p({
  name: "Avatar",
  props: {
    label: {
      type: String,
      required: !0
    },
    img: {
      type: String
    },
    readOnly: {
      type: Boolean,
      default: !1
    }
  },
  setup(s) {
    const t = h("custom-avatar");
    return {
      ns: t,
      renderAvatar: () => s.img ? r("img", {
        class: t.e("user-avatar"),
        src: s.img
      }, null) : r("div", {
        class: t.e("default-avatar"),
        style: "background-color: ".concat(I.calcColorPhoto(s.label))
      }, [I.calcTextPhoto(s.label)])
    };
  },
  render() {
    return r("div", {
      class: this.ns.b()
    }, [this.renderAvatar()]);
  }
}), R = /* @__PURE__ */ p({
  name: "UserInfoPopover",
  props: {
    controller: {
      type: Object,
      required: !0
    },
    context: {
      type: Object,
      required: !0
    },
    params: {
      type: Object,
      default: () => ({})
    },
    viewId: {
      type: String
    },
    modal: {
      type: Object
    }
  },
  setup(s) {
    const t = h("user-info-popover"), e = s.controller, n = () => [r("div", {
      class: t.e("header")
    }, [r("img", {
      src: "./assets/images/login-header.png"
    }, null)]), r("div", {
      class: t.e("content")
    }, [r("div", {
      class: t.em("content", "avatar-container")
    }, [r(A, {
      class: t.em("content", "avatar"),
      label: e.userInfo.srfusername,
      img: e.userInfo.avatar
    }, null)]), r("div", {
      class: t.em("content", "info")
    }, [r("div", {
      class: "user-name"
    }, [e.userInfo.srfusername]), r("div", {
      class: "description"
    }, [e.userInfo.srfpersonname])])]), r(c("el-divider"), {
      class: t.e("divider"),
      "content-position": "center"
    }, null), r("div", {
      class: t.e("footer")
    }, [r(c("el-button"), {
      class: t.e("log-out"),
      onClick: () => e.onLogOut(),
      text: !0
    }, {
      default: () => [r(c("iBizIcon"), {
        class: t.em("log-out", "icon"),
        icon: {
          cssClass: "fa fa-sign-out"
        }
      }, null), r("span", {
        class: t.em("log-out", "text")
      }, [U("退出登录")])]
    })])];
    return {
      ns: t,
      renderContent: () => s.viewId ? C(c("IBizViewShell"), {
        context: s.context,
        params: s.params,
        viewId: s.viewId,
        modal: s.modal
      }) : n()
    };
  },
  render() {
    return r("div", {
      class: [this.ns.b()]
    }, [this.renderContent()]);
  }
});
class E extends V {
  constructor() {
    super(...arguments), a(this, "navViewName", ""), a(this, "avatarField", ""), a(this, "titlField", ""), a(this, "subTitleField", ""), a(this, "router"), a(this, "overlay", null), a(this, "ctx", y("ctx", void 0)), a(this, "userInfoView"), a(this, "userInfo"), a(this, "cleanup", f);
  }
  /**
   * 是否折叠
   *
   * @readonly
   * @memberof CustomUserInfoController
   */
  get isCollapse() {
    return this.panel.view.state.isCollapse;
  }
  /**
   * 菜单方向
   *
   * @readonly
   * @memberof CustomUserInfoController
   */
  get menuAlign() {
    var t;
    return (t = this.ctx) != null && t.view && this.ctx.view.model.mainMenuAlign || "LEFT";
  }
  /**
   * 初始化
   *
   * @protected
   * @return {*}  {Promise<void>}
   * @memberof CustomUserInfoController
   */
  async onInit() {
    var t;
    await super.onInit(), this.initRawItemParams();
    try {
      const e = ((t = ibiz.appData) == null ? void 0 : t.context) || {}, { srfusername: n = "游客", srfpersonname: o } = e;
      this.userInfo = { srfusername: n, srfpersonname: o }, this.avatarField && e[this.avatarField] && Object.assign(this.userInfo, {
        avatar: this.parseAvatar(e[this.avatarField])
      }), this.titlField && e[this.titlField] && Object.assign(this.userInfo, {
        srfusername: e[this.titlField]
      }), this.subTitleField && e[this.subTitleField] && Object.assign(this.userInfo, {
        srfpersonname: e[this.subTitleField]
      }), this.userInfoView = await ibiz.hub.config.view.get(this.navViewName);
    } catch (e) {
      ibiz.log.error(e);
    }
    this.cleanup = x(window, "keydown", (e) => {
      var n;
      e.keyCode === 27 && ((n = this.overlay) == null || n.dismiss());
    });
  }
  /**
   * 解析头像数据
   *
   * @param {string} avatar
   * @return {*}
   * @memberof CustomUserInfoController
   */
  parseAvatar(t) {
    try {
      const e = JSON.parse(t);
      if (e) {
        const n = v(e) ? e[0] : e;
        return ibiz.util.file.calcFileUpDownUrl(
          this.panel.context,
          this.panel.params
        ).downloadUrl.replace("%fileId%", n.id);
      }
    } catch (e) {
      throw new N("头像数据解析异常");
    }
  }
  /**
   * 初始化面板项高级参数
   *
   * @memberof CustomUserInfoController
   */
  initRawItemParams() {
    var t;
    const e = (t = this.model) == null ? void 0 : t.rawItem;
    v(e == null ? void 0 : e.rawItemParams) && (e == null || e.rawItemParams.forEach((n) => {
      const { key: o, value: i } = n;
      o === "NAVVIEWNAME" && (this.navViewName = i), o === "AVATAR" && (this.avatarField = i.toLowerCase()), o === "TITLE" && (this.titlField = i.toLowerCase()), o === "SUBTITLE" && (this.subTitleField = i.toLowerCase());
    }));
  }
  /**
   * 设置路由对象
   *
   * @param {Router} router
   * @memberof CustomUserInfoController
   */
  setRouter(t) {
    this.router = t;
  }
  /**
   * 登出
   *
   * @memberof CustomUserInfoController
   */
  async onLogOut() {
    var t;
    (t = this.overlay) == null || t.dismiss(), await ibiz.confirm.info({
      title: "退出登录",
      desc: "您确定要退出登录吗？"
    }) && await ibiz.hub.controller.logout() && (await this.router.push(
      "/login?ru=".concat(encodeURIComponent(
        window.location.hash.replace("#/", "/")
      ))
    ), ibiz.util.showAppLoading(), window.location.reload());
  }
  /**
   * 打开用户信息Popover
   *
   * @param {EventTarget} target
   * @memberof CustomUserInfoController
   */
  async openUserInfoPopover(t) {
    var e, n;
    return this.overlay = ibiz.overlay.createPopover(
      (o) => {
        var i;
        return C(R, {
          context: this.panel.context.clone(),
          params: this.panel.params,
          modal: o,
          controller: this,
          viewId: (i = this.userInfoView) == null ? void 0 : i.id
        });
      },
      void 0,
      {
        placement: this.menuAlign === "LEFT" ? "right-start" : "bottom",
        autoClose: !0,
        noArrow: !0,
        width: ((e = this.userInfoView) == null ? void 0 : e.width) || 320,
        height: (n = this.userInfoView) == null ? void 0 : n.height
      }
    ), await this.overlay.present(t), await this.overlay.onWillDismiss();
  }
  onDestroyed() {
    var t;
    this.cleanup !== f && this.cleanup(), (t = this.overlay) == null || t.dismiss();
  }
}
const d = /* @__PURE__ */ p({
  name: "CustomUserInfo",
  props: {
    modelData: {
      type: Object,
      required: !0
    },
    controller: {
      type: E,
      required: !0
    }
  },
  setup(s) {
    const t = h("custom-user-info"), e = s.controller, n = P({}), o = D();
    e.setRouter(o);
    const i = () => {
      e.openUserInfoPopover(n.value);
    };
    return T(() => {
      e.onDestroyed();
    }), {
      c: e,
      ns: t,
      userInfo: n,
      onOpenUserInfoPopover: i
    };
  },
  render() {
    return r("div", {
      ref: "userInfo",
      class: [this.ns.b(), this.ns.m(this.modelData.id), ...this.c.containerClass, this.ns.is("left", this.c.menuAlign === "LEFT"), this.ns.is("top", this.c.menuAlign === "TOP"), this.ns.is("collapse", this.c.isCollapse)],
      onClick: this.onOpenUserInfoPopover
    }, [r(A, {
      class: this.ns.e("avatar"),
      label: this.c.userInfo.srfusername,
      img: this.c.userInfo.avatar,
      readOnly: !0
    }, null), !this.c.isCollapse && r("div", {
      class: this.ns.e("info")
    }, [r("div", {
      class: this.ns.em("info", "user-name")
    }, [this.c.userInfo.srfusername]), this.c.menuAlign === "LEFT" && r("div", {
      class: this.ns.em("info", "description")
    }, [this.c.userInfo.srfpersonname])])]);
  }
});
class k {
  constructor() {
    a(this, "component", "CustomUserInfo");
  }
  async createController(t, e, n) {
    const o = new E(t, e, n);
    return await o.init(), o;
  }
}
const _ = O(
  d,
  function(s) {
    s.component(d.name, d), S(
      "CUSTOM_CUSTOM_AUTH_USERINFO",
      () => new k()
    );
  }
), H = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(s) {
    s.use(_);
  }
};
export {
  _ as IBizCustomUserInfo,
  H as default
};
