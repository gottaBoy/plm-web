import './assets/style.css';
import './assets/style.css';
import { registerControlProvider as A, hasSubRoute as N, ControlController as _, calcItemVisibleByCounter as k, calcItemVisible as z, Srfuf as q, calcNavParams as U, CounterService as H } from "@ibiz-template/runtime";
import { withInstall as K, useControlController as X, useNamespace as F, getNestedRoutePath as E, route2routePath as G } from "@ibiz-template/vue3-util";
import { inject as j, defineComponent as J, ref as S, reactive as Q, watch as W, createVNode as u, resolveComponent as y, createTextVNode as R, isVNode as Y } from "vue";
/*!
  * vue-router v4.2.5
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */
var V;
(function(t) {
  t.pop = "pop", t.push = "push";
})(V || (V = {}));
var O;
(function(t) {
  t.back = "back", t.forward = "forward", t.unknown = "";
})(O || (O = {}));
Symbol(process.env.NODE_ENV !== "production" ? "navigation failure" : "");
var B;
(function(t) {
  t[t.aborted = 4] = "aborted", t[t.cancelled = 8] = "cancelled", t[t.duplicated = 16] = "duplicated";
})(B || (B = {}));
Symbol(process.env.NODE_ENV !== "production" ? "router view location matched" : "");
Symbol(process.env.NODE_ENV !== "production" ? "router view depth" : "");
const Z = Symbol(process.env.NODE_ENV !== "production" ? "router" : ""), $ = Symbol(process.env.NODE_ENV !== "production" ? "route location" : "");
Symbol(process.env.NODE_ENV !== "production" ? "router view location" : "");
function ee() {
  return j(Z);
}
function te() {
  return j($);
}
var ae = Object.defineProperty, se = (t, e, s) => e in t ? ae(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s, C = (t, e, s) => (se(t, typeof e != "symbol" ? e + "" : e, s), s);
class oe {
  constructor() {
    C(this, "component", "IBizTabExpSelect");
  }
}
class ie extends _ {
  constructor() {
    super(...arguments), C(this, "groupTabPages", []), C(this, "counter"), C(this, "router");
  }
  /**
   * 导航占位控制器
   *
   * @readonly
   * @memberof DRTabController
   */
  get navPos() {
    var e;
    return (e = this.view.layoutPanel) == null ? void 0 : e.panelItems.nav_pos;
  }
  /**
   * 表单部件
   *
   * @readonly
   * @memberof DRTabController
   */
  get form() {
    var e;
    return (e = this.view) == null ? void 0 : e.getController("form");
  }
  /**
   * 路由层级
   *
   * @readonly
   * @type {(number | undefined)}
   * @memberof DRTabController
   */
  get routeDepth() {
    return this.view.modal.routeDepth;
  }
  /**
   * 设置 Router 对象
   *
   * @param {Router} router
   * @memberof DRTabController
   */
  setRouter(e) {
    this.router = e;
  }
  /**
   * 获取数据
   *
   * @return {*}  {IData[]}
   * @memberof DRTabController
   */
  getData() {
    var e;
    return ((e = this.form) == null ? void 0 : e.getData()) || [{}];
  }
  /**
   * 初始化state的属性
   *
   * @protected
   * @memberof DRTabController
   */
  initState() {
    super.initState(), this.state.drTabPages = [], this.state.showMore = !1;
  }
  /**
   * 创建完成
   *
   * @return {*}  {Promise<void>}
   * @memberof DRTabController
   */
  async onCreated() {
    await super.onCreated(), await this.initCounter();
  }
  /**
   * 部件参数解析
   *
   * @protected
   * @memberof ControlController
   */
  handleControlParams() {
    super.handleControlParams(), this.controlParams.showmore && (this.state.showMore = this.controlParams.showmore === "true");
  }
  /**
   * 通过计数器数据，计算项状态
   *
   * @author zhanghengfeng
   * @date 2024-05-16 17:05:01
   */
  calcItemStateByCounter() {
    if (this.state.drTabPages.forEach((e) => {
      const s = k(e, this.counter);
      s !== void 0 && (e.hidden = !s);
    }), this.state.activeName) {
      const { visible: e, defaultVisibleItem: s } = this.getItemVisibleState(
        this.state.activeName
      );
      !e && s && (this.state.activeName = s.tag, this.handleTabChange());
    }
  }
  /**
   * 获取对应项的显示状态
   *
   * @author zhanghengfeng
   * @date 2024-05-16 17:05:18
   * @param {string} key
   * @return {*}  {{
   *     visible: boolean;
   *     defaultVisibleItem?: IDRTabPagesState;
   *   }}
   */
  getItemVisibleState(e) {
    let s = !0, o;
    return this.state.drTabPages.forEach((i) => {
      !o && !i.hidden && (o = i), i.tag === e && (s = !i.hidden);
    }), {
      visible: s,
      defaultVisibleItem: o
    };
  }
  /**
   * 计算项权限
   *
   * @author zhanghengfeng
   * @date 2024-05-16 17:05:40
   * @param {IDRTabPagesState} item
   * @return {*}  {Promise<void>}
   */
  async calcPermitted(e) {
    var s;
    let o = !0;
    const i = (s = this.getData()) != null && s.length ? this.getData()[0] : void 0, n = await z(
      e,
      this.context,
      this.params,
      this.model.appDataEntityId,
      this.model.appId,
      i
    );
    n !== void 0 && (o = n), e.hidden = !o;
  }
  /**
   * 计算项状态
   *
   * @author zhanghengfeng
   * @date 2024-05-16 17:05:05
   * @return {*}  {Promise<void>}
   */
  async calcDrTabPagesState() {
    await Promise.all(
      this.state.drTabPages.map(async (e) => {
        await this.calcPermitted(e);
      })
    ), this.calcItemStateByCounter(), this.state.isCalculatedPermission = !0;
  }
  /**
   * 加载完成
   *
   * @return {*}  {Promise<void>}
   * @memberof DRTabController
   */
  async onMounted() {
    await super.onMounted(), this.form && (this.form.evt.on("onLoadSuccess", async (e) => {
      const s = e.data[0];
      this.view.state.srfactiveviewdata = s, Object.prototype.hasOwnProperty.call(s, "srfreadonly") && (this.view.context.srfreadonly = s.srfreadonly), await this.calcDrTabPagesState(), this.handleFormChange();
    }), this.form.evt.on("onLoadDraftSuccess", () => {
      this.handleFormChange();
    }), this.form.evt.on("onSaveSuccess", () => {
      this.handleFormChange();
    })), this.initDRTabPages(), this.form || await this.calcDrTabPagesState();
  }
  /**
   * 处理表单数据变更
   *
   * @memberof DRTabController
   */
  handleFormChange() {
    const e = this.getData()[0].srfuf !== q.UPDATE;
    this.setDRTabPagesState(this.state.drTabPages, e);
  }
  /**
   * 设置关系分页状态
   *
   * @param {IDRTabPagesState[]} drTabPages 关系分页
   * @param {boolean} disabled 禁用状态
   * @memberof DRTabController
   */
  setDRTabPagesState(e, s) {
    e.forEach((o) => {
      o.tag !== this.model.uniqueTag && (o.disabled = s);
    });
  }
  /**
   * 初始化关系分页数据
   *
   * @memberof DRTabController
   */
  initDRTabPages() {
    const {
      editItemCaption: e,
      editItemCapLanguageRes: s,
      hideEditItem: o,
      editItemSysImage: i,
      uniqueTag: n,
      dedrtabPages: c
    } = this.model, h = [], p = [];
    let d = e;
    s && (d = ibiz.i18n.t(s.lanResTag, e)), o ? this.state.defaultName = (c == null ? void 0 : c[0].id) || "" : (h.push({
      tag: n,
      caption: d,
      hidden: !!o,
      disabled: !1,
      sysImage: i,
      fullPath: this.routeDepth ? E(this.router.currentRoute.value, this.routeDepth) : ""
    }), this.state.defaultName = ""), c == null || c.forEach((r) => {
      let b = r.caption;
      r.capLanguageRes && (b = ibiz.i18n.t(r.capLanguageRes.lanResTag, r.caption));
      const {
        enableMode: w,
        dataAccessAction: T,
        testAppDELogicId: D,
        testScriptCode: v,
        counterMode: f
      } = r, a = {
        tag: r.id,
        caption: b,
        sysImage: r.sysImage,
        hidden: !1,
        disabled: !1,
        counterId: r.counterId,
        pid: r.group_name,
        dataAccessAction: T,
        enableMode: w,
        testAppDELogicId: D,
        testScriptCode: v,
        counterMode: f
      };
      if (r.itemTag) {
        Object.assign(a, { pid: r.itemTag });
        const l = p.findIndex(
          (m) => m.tag === r.itemTag
        );
        if (l === -1) {
          const m = {
            tag: r.itemTag,
            caption: r.itemTag,
            children: [a]
          };
          p.push(m);
        } else
          p[l].children.push(a);
      } else
        p.push(a);
      h.push(a);
    }), this.state.drTabPages = h, this.groupTabPages = p, this.view.state.srfnav ? this.state.activeName = this.view.state.srfnav : this.state.activeName = h[0].tag;
    const g = !!this.routeDepth && N(this.routeDepth);
    this.handleTabChange(g);
  }
  /**
   * 处理分页改变
   *
   * @author lxm
   * @date 2023-12-21 05:31:59
   * @param {boolean} [isRoutePushed=false] 是否是路由已经跳转过了
   */
  handleTabChange(e = !1) {
    var s;
    const { activeName: o } = this.state, i = (s = this.model.dedrtabPages) == null ? void 0 : s.find(
      (n) => n.id === o
    );
    i ? (this.setVisible("navPos"), this.openNavPosView(i, e)) : (this.setVisible("form"), this.routeDepth && this.state.drTabPages[0] && this.router.push(this.state.drTabPages[0].fullPath));
  }
  /**
   * 设置显示状态
   *
   * @param {('form' | 'navPos')} ctrlName 显示的部件名称
   * @memberof DRTabController
   */
  setVisible(e) {
    var s;
    const o = (s = this.view.layoutPanel) == null ? void 0 : s.panelItems.view_form;
    e === "form" ? (o && (o.state.visible = !0, o.state.keepAlive = !0), this.navPos && (this.navPos.state.visible = !1, this.navPos.state.keepAlive = !0)) : (o && (o.state.visible = !1, o.state.keepAlive = !0), this.navPos && (this.navPos.state.visible = !0, this.navPos.state.keepAlive = !0));
  }
  /**
   * 准备参数
   *
   * @param {IDEDRCtrlItem} drTabPages 关系分页
   * @return {*}
   * @memberof DRTabController
   */
  prepareParams(e) {
    const { navigateContexts: s, navigateParams: o } = e, i = {
      navContexts: s,
      navParams: o
    }, n = {
      context: this.context,
      params: this.params,
      data: this.getData()[0]
    }, { resultContext: c, resultParams: h } = U(i, n), p = Object.assign(this.context.clone(), c, {
      currentSrfNav: e.id
    }), d = { ...this.params, ...h };
    return { context: p, params: d };
  }
  /**
   * 打开导航占位视图
   *
   * @author lxm
   * @date 2023-12-21 05:40:07
   * @param {IDEDRCtrlItem} drTabPages
   * @param {boolean} [isRoutePushed=false]
   * @return {*}  {Promise<void>}
   */
  async openNavPosView(e, s = !1) {
    var o;
    const { context: i, params: n } = this.prepareParams(e);
    (o = this.navPos) == null || o.openView({
      key: e.id,
      context: i,
      params: n,
      viewId: e.appViewId,
      isRoutePushed: s
    });
  }
  /**
   * 初始化计数器
   * @author lxm
   * @date 2024-01-18 05:12:02
   * @protected
   * @return {*}  {Promise<void>}
   */
  async initCounter() {
    const { appCounterRefs: e } = this.model, s = e == null ? void 0 : e[0];
    s && (this.counter = await H.getCounterByRef(
      s,
      this.context,
      { ...this.params }
    ), this.calcItemStateByCounter = this.calcItemStateByCounter.bind(this), this.counter.onChange(this.calcItemStateByCounter));
  }
  /**
   * 监听组件销毁
   *
   * @author zhanghengfeng
   * @date 2024-04-10 19:04:40
   * @protected
   * @return {*}  {Promise<void>}
   */
  async onDestroyed() {
    await super.onDestroyed(), this.counter && (this.counter.offChange(this.calcItemStateByCounter), this.counter.destroy());
  }
}
const re = () => u("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 1024 1024",
  height: "1em",
  width: "1em"
}, [u("path", {
  d: "M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"
}, null)]);
function ne(t) {
  return typeof t == "function" || Object.prototype.toString.call(t) === "[object Object]" && !Y(t);
}
const I = /* @__PURE__ */ J({
  name: "IBizTabExpSelect",
  props: {
    modelData: {
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
    provider: {
      type: Object
    }
  },
  setup() {
    const t = X((...a) => new ie(...a)), e = F("tab-exp-select"), s = ee(), o = S(), i = S({}), n = S(!1), c = Q({});
    t.groupTabPages.forEach((a) => {
      Object.assign(c, {
        [a.tag]: !1
      });
    }), t.setRouter(s);
    const h = () => {
      t.groupTabPages.forEach((a) => {
        Object.assign(c, {
          [a.tag]: !1
        });
      });
    }, p = (a) => {
      h();
      const l = setTimeout(() => {
        n.value = !1, i.value = {}, t.state.drTabPages.findIndex((m) => m.tag === a.tag) !== -1 && (t.state.activeName = a.tag, t.handleTabChange()), clearTimeout(l);
      }, 100);
    }, d = te();
    let g = "";
    t.routeDepth && (g = E(d, t.routeDepth));
    const r = (a) => {
      i.value = a;
    }, b = () => {
      i.value = {};
    }, w = (a) => i.value.tag && i.value.tag === a.tag, T = (a) => {
      h(), c[a.tag] = !0, c[a.pid] = !0;
    }, D = (a) => {
      c[a.tag] = !1, c[a.pid] = !1;
    };
    W(() => d.fullPath, (a, l) => {
      if (a !== l) {
        const m = t.routeDepth;
        if (m && E(d, t.routeDepth) === g) {
          const L = G(d), {
            srfnav: P
          } = L.pathNodes[m - 1], x = !!t.routeDepth && N(t.routeDepth);
          if (P && t.state.activeName && t.state.activeName !== P)
            t.state.activeName = P, t.handleTabChange(x);
          else if (!P) {
            const M = !!t.routeDepth && !N(t.routeDepth);
            (t.state.activeName !== t.state.defaultName || M) && (t.state.activeName = t.state.defaultName, t.handleTabChange(x));
          }
        }
      }
    }, {
      immediate: !0
    });
    const v = (a) => {
      const l = a.caption ? String(a.caption).length > 10 : !1;
      return u("div", {
        class: [e.be("popper", "item"), e.is("activated", t.state.activeName === a.tag), e.is("secondary-show", w(a))],
        onClick: () => p(a),
        onMouseenter: () => T(a),
        onMouseleave: () => D(a)
      }, [a.sysImage && u(y("iBizIcon"), {
        class: [e.bem("popper", "item", "icon")],
        icon: a.sysImage
      }, null), a.caption && u("span", {
        title: l ? a.caption : "",
        class: [e.bem("popper", "item", "caption")]
      }, [a.caption]), a.children && u("span", {
        class: [e.bem("popper", "item", "left-arrow")]
      }, [re()])]);
    }, f = (a) => u(y("el-popover"), {
      trigger: "hover",
      offset: 0,
      "popper-class": [e.b("popper"), e.b("secondary-popper")],
      placement: "right-start",
      "hide-after": 0,
      visible: c[a.tag],
      "onUpdate:visible": (l) => c[a.tag] = l,
      onShow: () => r(a),
      onHide: () => b()
    }, {
      reference: () => v(a),
      default: () => u("div", {
        class: [e.be("popper", "content"), e.be("popper", "secondary-popper")]
      }, [a.children.map((l) => l.children ? f(l) : v(l))])
    });
    return {
      c: t,
      ns: e,
      controlRef: o,
      renderContent: () => u(y("el-popover"), {
        trigger: "click",
        placement: "bottom-start",
        visible: n.value,
        "onUpdate:visible": (a) => n.value = a,
        "popper-class": e.b("popper"),
        onHide: () => h()
      }, {
        reference: () => u("div", {
          class: e.b("content"),
          onClick: () => n.value === !0
        }, [u("span", {
          class: e.be("content", "hashtag")
        }, [R("#")]), u("span", {
          class: e.be("content", "caption")
        }, [R("维度")])]),
        default: () => u("div", {
          class: e.be("popper", "content")
        }, [t.groupTabPages.map((a) => a.children ? f(a) : v(a))])
      })
    };
  },
  render() {
    let t;
    return u(y("iBizControlBase"), {
      ref: "controlRef",
      controller: this.c,
      class: [this.ns.b()]
    }, ne(t = this.renderContent()) ? t : {
      default: () => [t]
    });
  }
}), ce = K(
  I,
  function(t) {
    t.component(I.name, I), A(
      "CUSTOM_TAB_EXP_SELECT",
      () => new oe()
    );
  }
), pe = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(t) {
    t.use(ce);
  }
};
export {
  ce as IBizTabExpSelectControl,
  pe as default
};
