import './assets/style.css';
import { registerControlProvider as O, hasSubRoute as N, ControlController as j, calcItemVisibleByCounter as M, calcItemVisible as A, Srfuf as L, calcNavParams as k, CounterService as z } from "@ibiz-template/runtime";
import { withInstall as _, useControlController as q, useNamespace as F, getNestedRoutePath as x, route2routePath as U } from "@ibiz-template/vue3-util";
import { defineComponent as H, ref as D, reactive as X, watch as G, createVNode as h, resolveComponent as C, createTextVNode as B, isVNode as J } from "vue";
import { useRouter as K, useRoute as Q } from "vue-router";
var W = Object.defineProperty, Y = (a, e, s) => e in a ? W(a, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : a[e] = s, y = (a, e, s) => (Y(a, typeof e != "symbol" ? e + "" : e, s), s);
class Z {
  constructor() {
    y(this, "component", "IBizTabExpSelect");
  }
}
class $ extends j {
  constructor() {
    super(...arguments), y(this, "groupTabPages", []), y(this, "counter"), y(this, "router");
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
      const s = M(e, this.counter);
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
    let s = !0, i;
    return this.state.drTabPages.forEach((o) => {
      !i && !o.hidden && (i = o), o.tag === e && (s = !o.hidden);
    }), {
      visible: s,
      defaultVisibleItem: i
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
    let i = !0;
    const o = (s = this.getData()) != null && s.length ? this.getData()[0] : void 0, n = await A(
      e,
      this.context,
      this.params,
      this.model.appDataEntityId,
      this.model.appId,
      o
    );
    n !== void 0 && (i = n), e.hidden = !i;
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
    const e = this.getData()[0].srfuf !== L.UPDATE;
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
    e.forEach((i) => {
      i.tag !== this.model.uniqueTag && (i.disabled = s);
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
      hideEditItem: i,
      editItemSysImage: o,
      uniqueTag: n,
      dedrtabPages: l
    } = this.model, u = [], p = [];
    let d = e;
    s && (d = ibiz.i18n.t(s.lanResTag, e)), i ? this.state.defaultName = (l == null ? void 0 : l[0].id) || "" : (u.push({
      tag: n,
      caption: d,
      hidden: !!i,
      disabled: !1,
      sysImage: o,
      fullPath: this.routeDepth ? x(this.router.currentRoute.value, this.routeDepth) : ""
    }), this.state.defaultName = ""), l == null || l.forEach((r) => {
      let f = r.caption;
      r.capLanguageRes && (f = ibiz.i18n.t(r.capLanguageRes.lanResTag, r.caption));
      const {
        enableMode: T,
        dataAccessAction: w,
        testAppDELogicId: I,
        testScriptCode: g,
        counterMode: b
      } = r, t = {
        tag: r.id,
        caption: f,
        sysImage: r.sysImage,
        hidden: !1,
        disabled: !1,
        counterId: r.counterId,
        pid: r.group_name,
        dataAccessAction: w,
        enableMode: T,
        testAppDELogicId: I,
        testScriptCode: g,
        counterMode: b
      };
      if (r.itemTag) {
        Object.assign(t, { pid: r.itemTag });
        const c = p.findIndex(
          (m) => m.tag === r.itemTag
        );
        if (c === -1) {
          const m = {
            tag: r.itemTag,
            caption: r.itemTag,
            children: [t]
          };
          p.push(m);
        } else
          p[c].children.push(t);
      } else
        p.push(t);
      u.push(t);
    }), this.state.drTabPages = u, this.groupTabPages = p, this.view.state.srfnav ? this.state.activeName = this.view.state.srfnav : this.state.activeName = u[0].tag;
    const v = !!this.routeDepth && N(this.routeDepth);
    this.handleTabChange(v);
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
    const { activeName: i } = this.state, o = (s = this.model.dedrtabPages) == null ? void 0 : s.find(
      (n) => n.id === i
    );
    o ? (this.setVisible("navPos"), this.openNavPosView(o, e)) : (this.setVisible("form"), this.routeDepth && this.state.drTabPages[0] && this.router.push(this.state.drTabPages[0].fullPath));
  }
  /**
   * 设置显示状态
   *
   * @param {('form' | 'navPos')} ctrlName 显示的部件名称
   * @memberof DRTabController
   */
  setVisible(e) {
    var s;
    const i = (s = this.view.layoutPanel) == null ? void 0 : s.panelItems.view_form;
    e === "form" ? (i && (i.state.visible = !0, i.state.keepAlive = !0), this.navPos && (this.navPos.state.visible = !1, this.navPos.state.keepAlive = !0)) : (i && (i.state.visible = !1, i.state.keepAlive = !0), this.navPos && (this.navPos.state.visible = !0, this.navPos.state.keepAlive = !0));
  }
  /**
   * 准备参数
   *
   * @param {IDEDRCtrlItem} drTabPages 关系分页
   * @return {*}
   * @memberof DRTabController
   */
  prepareParams(e) {
    const { navigateContexts: s, navigateParams: i } = e, o = {
      navContexts: s,
      navParams: i
    }, n = {
      context: this.context,
      params: this.params,
      data: this.getData()[0]
    }, { resultContext: l, resultParams: u } = k(o, n), p = Object.assign(this.context.clone(), l, {
      currentSrfNav: e.id
    }), d = { ...this.params, ...u };
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
    var i;
    const { context: o, params: n } = this.prepareParams(e);
    (i = this.navPos) == null || i.openView({
      key: e.id,
      context: o,
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
    s && (this.counter = await z.getCounterByRef(
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
const ee = () => h("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 1024 1024",
  height: "1em",
  width: "1em"
}, [h("path", {
  d: "M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"
}, null)]);
function te(a) {
  return typeof a == "function" || Object.prototype.toString.call(a) === "[object Object]" && !J(a);
}
const S = /* @__PURE__ */ H({
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
    const a = q((...t) => new $(...t)), e = F("tab-exp-select"), s = K(), i = D(), o = D({}), n = D(!1), l = X({});
    a.groupTabPages.forEach((t) => {
      Object.assign(l, {
        [t.tag]: !1
      });
    }), a.setRouter(s);
    const u = () => {
      a.groupTabPages.forEach((t) => {
        Object.assign(l, {
          [t.tag]: !1
        });
      });
    }, p = (t) => {
      u();
      const c = setTimeout(() => {
        n.value = !1, o.value = {}, a.state.drTabPages.findIndex((m) => m.tag === t.tag) !== -1 && (a.state.activeName = t.tag, a.handleTabChange()), clearTimeout(c);
      }, 100);
    }, d = Q();
    let v = "";
    a.routeDepth && (v = x(d, a.routeDepth));
    const r = (t) => {
      o.value = t;
    }, f = () => {
      o.value = {};
    }, T = (t) => o.value.tag && o.value.tag === t.tag, w = (t) => {
      u(), l[t.tag] = !0, l[t.pid] = !0;
    }, I = (t) => {
      l[t.tag] = !1, l[t.pid] = !1;
    };
    G(() => d.fullPath, (t, c) => {
      if (t !== c) {
        const m = a.routeDepth;
        if (m && x(d, a.routeDepth) === v) {
          const E = U(d), {
            srfnav: P
          } = E.pathNodes[m - 1], R = !!a.routeDepth && N(a.routeDepth);
          if (P && a.state.activeName && a.state.activeName !== P)
            a.state.activeName = P, a.handleTabChange(R);
          else if (!P) {
            const V = !!a.routeDepth && !N(a.routeDepth);
            (a.state.activeName !== a.state.defaultName || V) && (a.state.activeName = a.state.defaultName, a.handleTabChange(R));
          }
        }
      }
    }, {
      immediate: !0
    });
    const g = (t) => {
      const c = t.caption ? String(t.caption).length > 10 : !1;
      return h("div", {
        class: [e.be("popper", "item"), e.is("activated", a.state.activeName === t.tag), e.is("secondary-show", T(t))],
        onClick: () => p(t),
        onMouseenter: () => w(t),
        onMouseleave: () => I(t)
      }, [t.sysImage && h(C("iBizIcon"), {
        class: [e.bem("popper", "item", "icon")],
        icon: t.sysImage
      }, null), t.caption && h("span", {
        title: c ? t.caption : "",
        class: [e.bem("popper", "item", "caption")]
      }, [t.caption]), t.children && h("span", {
        class: [e.bem("popper", "item", "left-arrow")]
      }, [ee()])]);
    }, b = (t) => h(C("el-popover"), {
      trigger: "hover",
      offset: 0,
      "popper-class": [e.b("popper"), e.b("secondary-popper")],
      placement: "right-start",
      "hide-after": 0,
      visible: l[t.tag],
      "onUpdate:visible": (c) => l[t.tag] = c,
      onShow: () => r(t),
      onHide: () => f()
    }, {
      reference: () => g(t),
      default: () => h("div", {
        class: [e.be("popper", "content"), e.be("popper", "secondary-popper")]
      }, [t.children.map((c) => c.children ? b(c) : g(c))])
    });
    return {
      c: a,
      ns: e,
      controlRef: i,
      renderContent: () => h(C("el-popover"), {
        trigger: "click",
        placement: "bottom-start",
        visible: n.value,
        "onUpdate:visible": (t) => n.value = t,
        "popper-class": e.b("popper"),
        onHide: () => u()
      }, {
        reference: () => h("div", {
          class: e.b("content"),
          onClick: () => n.value === !0
        }, [h("span", {
          class: e.be("content", "hashtag")
        }, [B("#")]), h("span", {
          class: e.be("content", "caption")
        }, [B("维度")])]),
        default: () => h("div", {
          class: e.be("popper", "content")
        }, [a.groupTabPages.map((t) => t.children ? b(t) : g(t))])
      })
    };
  },
  render() {
    let a;
    return h(C("iBizControlBase"), {
      ref: "controlRef",
      controller: this.c,
      class: [this.ns.b()]
    }, te(a = this.renderContent()) ? a : {
      default: () => [a]
    });
  }
}), ae = _(
  S,
  function(a) {
    a.component(S.name, S), O(
      "CUSTOM_TAB_EXP_SELECT",
      () => new Z()
    );
  }
), ne = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(a) {
    a.use(ae);
  }
};
export {
  ae as IBizTabExpSelectControl,
  ne as default
};
