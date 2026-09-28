import './assets/style.css';
import { registerControlProvider as k, hasSubRoute as P, ControlController as A, Srfuf as E, calcItemVisibleByCounter as R, calcItemVisible as M, OpenAppViewCommand as N, calcNavParams as O, CounterService as j } from "@ibiz-template/runtime";
import { withInstall as z, useControlController as L, useNamespace as _, getNestedRoutePath as I, route2routePath as C, routePath2string as q } from "@ibiz-template/vue3-util";
import { inject as U, defineComponent as G, reactive as J, onUnmounted as K, watch as D, createVNode as m, resolveComponent as g, createTextVNode as W, isVNode as Y } from "vue";
import { isNil as X } from "ramda";
/*!
  * vue-router v4.2.5
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */
var T;
(function(s) {
  s.pop = "pop", s.push = "push";
})(T || (T = {}));
var x;
(function(s) {
  s.back = "back", s.forward = "forward", s.unknown = "";
})(x || (x = {}));
var V;
(function(s) {
  s[s.aborted = 4] = "aborted", s[s.cancelled = 8] = "cancelled", s[s.duplicated = 16] = "duplicated";
})(V || (V = {}));
const tt = Symbol(""), et = Symbol("");
function F() {
  return U(tt);
}
function H() {
  return U(et);
}
var at = Object.defineProperty, st = (s, t, a) => t in s ? at(s, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : s[t] = a, b = (s, t, a) => (st(s, typeof t != "symbol" ? t + "" : t, a), a);
class it extends A {
  constructor() {
    super(...arguments), b(this, "counter"), b(this, "router"), b(this, "routeItems", []), b(this, "enableBack", !1), b(this, "viewId", "");
  }
  /**
   * 导航占位控制器
   *
   * @readonly
   * @memberof DRBarController
   */
  get navPos() {
    var t;
    return (t = this.view.layoutPanel) == null ? void 0 : t.panelItems.nav_pos;
  }
  /**
   * 导航视图容器控制器
   * @return {*}
   * @author: zhujiamin
   * @Date: 2024-01-25 16:03:00
   */
  get viewNavPos() {
    var t;
    return (t = this.view.layoutPanel) == null ? void 0 : t.panelItems.view_nav_pos;
  }
  /**
   * 表单部件
   *
   * @readonly
   * @memberof DRBarController
   */
  get form() {
    var t;
    return (t = this.view) == null ? void 0 : t.getController("form");
  }
  /**
   * 是否是新建
   * @author lxm
   * @date 2023-12-11 06:32:04
   * @readonly
   * @type {boolean}
   */
  get isCreate() {
    return this.getData()[0].srfuf !== E.UPDATE;
  }
  /**
   * 获取数据
   *
   * @return {*}  {IData[]}
   * @memberof DRBarController
   */
  getData() {
    var t;
    return ((t = this.form) == null ? void 0 : t.getData()) || [{}];
  }
  /**
   * 设置 Router 对象
   *
   * @param {Router} router
   * @memberof DRTabController
   */
  setRouter(t) {
    this.router = t;
  }
  /**
   * 路由层级
   *
   * @readonly
   * @type {(number | undefined)}
   * @memberof DRBarController
   */
  get routeDepth() {
    return this.view.modal.routeDepth;
  }
  /**
   * 初始化state的属性
   *
   * @protected
   * @memberof DRBarController
   */
  initState() {
    super.initState(), this.state.drBarItems = [], this.state.srfnav = "", this.state.hideEditItem = !!this.model.hideEditItem;
  }
  /**
   * 创建完成
   *
   * @return {*}  {Promise<void>}
   * @memberof DRBarController
   */
  async onCreated() {
    await super.onCreated(), this.initDRBarItems(), this.controlParams.route_items && (this.routeItems = JSON.parse(this.controlParams.route_items)), this.controlParams.enable_back && (this.enableBack = !!JSON.parse(this.controlParams.enable_back)), this.controlParams.view_id && (this.viewId = this.controlParams.view_id), await this.initCounter();
  }
  /**
   * 通过计数器数据，计算项状态
   *
   * @author zhanghengfeng
   * @date 2024-05-16 18:05:14
   * @param {IData} [_data]
   * @param {boolean} [reset=true]
   */
  calcItemStateByCounter(t, a = !0) {
    if (this.state.drBarItems.forEach((e) => {
      var i;
      if ((i = e.children) != null && i.length)
        e.children.forEach((n) => {
          const r = R(n, this.counter);
          r !== void 0 && (n.visible = r);
        }), e.visible = e.children.some((n) => n.visible);
      else {
        const n = R(e, this.counter);
        n !== void 0 && (e.visible = n);
      }
    }), this.state.selectedItem && a) {
      const { visible: e, defaultVisibleItem: i } = this.getItemVisibleState(
        this.state.selectedItem
      );
      !e && i && this.handleSelectChange(i.tag);
    }
  }
  /**
   * 获取对应项的显示状态
   *
   * @author zhanghengfeng
   * @date 2024-05-16 17:05:15
   * @param {string} key
   * @return {*}  {{
   *     visible: boolean;
   *     defaultVisibleItem?: IDRBarItemsState;
   *   }}
   */
  getItemVisibleState(t) {
    let a = !0, e;
    return this.state.drBarItems.forEach((i) => {
      if (i.children) {
        e || (e = i.children.find((r) => r.visible));
        const n = i.children.find((r) => r.tag === t);
        n && (a = !!n.visible);
      } else
        !e && i.visible && (e = i), i.tag === t && (a = !!i.visible);
    }), {
      visible: a,
      defaultVisibleItem: e
    };
  }
  /**
   * 计算关系界面组权限
   *
   * @param {IDRBarItemsState} item 关系组成员
   * @memberof DRBarController
   */
  async calcPermitted(t) {
    var a;
    let e = !0;
    const i = (a = this.getData()) != null && a.length ? this.getData()[0] : void 0, n = await M(
      t,
      this.context,
      this.params,
      this.model.appDataEntityId,
      this.model.appId,
      i
    );
    n !== void 0 && (e = n), t.visible = e;
  }
  /**
   * 计算是否展示
   *
   * @param {IData} item 关系组成员
   * @memberof DRBarController
   */
  async calcDrBarItemsState() {
    await Promise.all(
      this.state.drBarItems.map(async (t) => {
        var a;
        (a = t.children) != null && a.length ? (await Promise.all(
          t.children.map(async (e) => {
            await this.calcPermitted(e);
          })
        ), t.visible = t.children.some((e) => e.visible)) : await this.calcPermitted(t);
      })
    ), this.calcItemStateByCounter({}, !1), this.state.isCalculatedPermission = !0;
  }
  /**
   * 加载完成
   *
   * @return {*}  {Promise<void>}
   * @memberof DRBarController
   */
  async onMounted() {
    var t;
    await super.onMounted(), this.form ? (this.form.evt.on("onLoadSuccess", async (a) => {
      var e;
      const i = (e = a.data) == null ? void 0 : e[0];
      this.view.state.srfactiveviewdata = i, i && i.srfreadonly && (this.view.context.srfreadonly = !0), await this.calcDrBarItemsState(), this.doDefaultSelect();
    }), this.form.evt.on("onLoadDraftSuccess", async () => {
      await this.calcDrBarItemsState(), this.doDefaultSelect();
    })) : (await this.calcDrBarItemsState(), this.doDefaultSelect()), (t = this.form) != null && t.state.isLoaded && this.doDefaultSelect();
  }
  /**
   * 处理表单数据变更
   *
   * @memberof DRBarController
   */
  handleFormChange() {
    const t = this.isCreate;
    this.setDRBarItemsState(this.state.drBarItems, t);
  }
  /**
   * 设置关系项状态
   *
   * @param {IDRBarItemsState[]} drBarItems 关系项
   * @param {boolean} disabled 禁用状态
   * @memberof DRBarController
   */
  setDRBarItemsState(t, a) {
    t.forEach((e) => {
      e.tag !== this.model.uniqueTag && (e.disabled = a), e.children && this.setDRBarItemsState(e.children, a);
    });
  }
  /**
   * 初始化关系项数据
   *
   * @memberof DRBarController
   */
  initDRBarItems() {
    const { dedrctrlItems: t, dedrbarGroups: a } = this.model, e = [];
    if (!this.state.hideEditItem) {
      const {
        editItemCaption: n,
        editItemCapLanguageRes: r,
        editItemSysImage: l,
        uniqueTag: u
      } = this.model;
      let c = n;
      r && (c = ibiz.i18n.t(
        r.lanResTag,
        n
      )), e.push({
        tag: u,
        caption: c,
        disabled: !1,
        sysImage: l,
        fullPath: this.router.currentRoute.value.fullPath
      }), this.state.defaultItem = u;
    }
    const i = (n) => {
      let r = n.caption;
      n.capLanguageRes && (r = ibiz.i18n.t(n.capLanguageRes.lanResTag, n.caption));
      const { enableMode: l, testAppDELogicId: u, testScriptCode: c, counterMode: p } = n;
      return {
        tag: n.id,
        caption: r,
        sysImage: n.sysImage,
        disabled: !1,
        counterId: n.counterId,
        visible: !1,
        // 默认不显示
        dataAccessAction: n.dataAccessAction || void 0,
        enableMode: l,
        testAppDELogicId: u,
        testScriptCode: c,
        counterMode: p
      };
    };
    a && t && (a.length === 1 ? t.forEach((n) => {
      e.push(i(n));
    }) : a.forEach((n) => {
      var r;
      const l = t.filter(
        (u) => u.dedrbarGroupId === n.id
      );
      if (l.length > 1 || ((r = this.controlParams) == null ? void 0 : r.singleitemgroup) === "true" && l.length === 1) {
        let u = n.caption;
        n.capLanguageRes && (u = ibiz.i18n.t(
          n.capLanguageRes.lanResTag,
          n.caption
        )), e.push({
          tag: n.id,
          caption: u,
          sysImage: n.sysImage,
          visible: !1,
          // 默认不显示
          children: l.map((c) => i(c))
        });
      } else
        l.length === 1 && e.push(i(l[0]));
    })), this.state.drBarItems = e;
  }
  /**
   * 处理返回按钮点击
   *
   * @param {string} key
   * @memberof DRBarController
   */
  handleBack() {
    if (!this.viewId)
      return;
    const t = this.context.clone(), a = { ...this.params };
    ibiz.commands.execute(N.TAG, this.viewId, t, a);
  }
  /**
   * 处理选中改变
   *
   * @param {string} key
   * @memberof DRBarController
   */
  handleSelectChange(t = this.state.defaultItem, a = !1) {
    var e;
    if (this.state.selectedItem === t)
      return;
    const i = (e = this.model.dedrctrlItems) == null ? void 0 : e.find((n) => n.id === t);
    if (i && this.routeItems.includes(t)) {
      const { context: n, params: r } = this.prepareParams(i);
      Object.assign(n, {
        srfdefaulttoroutedepth: this.routeDepth
      }), ibiz.commands.execute(
        N.TAG,
        i.appViewId,
        n,
        r
      );
      return;
    }
    if (i)
      this.setVisible("navPos"), this.openNavPosView(i, a);
    else if (this.setVisible("form"), this.routeDepth) {
      const n = I(
        this.router.currentRoute.value,
        this.routeDepth
      );
      this.router.push(n);
    }
    this.state.selectedItem = t;
  }
  /**
   * 设置显示状态
   *
   * @param {('form' | 'navPos')} ctrlName 显示的部件名称
   * @memberof DRBarController
   */
  setVisible(t) {
    var a;
    if (this.state.hideEditItem)
      return;
    const e = (a = this.view.layoutPanel) == null ? void 0 : a.panelItems.view_form;
    t === "form" ? (e && (e.state.visible = !0, e.state.keepAlive = !0), this.viewNavPos && (this.viewNavPos.state.visible = !1, this.viewNavPos.state.keepAlive = !0)) : (e && (e.state.visible = !1, e.state.keepAlive = !0), this.viewNavPos && (this.viewNavPos.state.visible = !0, this.viewNavPos.state.keepAlive = !0));
  }
  /**
   * 准备参数
   *
   * @param {IDEDRBarItem} drBarItem 关系项
   * @return {*}
   * @memberof DRBarController
   */
  prepareParams(t) {
    const { navigateContexts: a, navigateParams: e } = t, i = {
      navContexts: a,
      navParams: e
    }, n = {
      context: this.context,
      params: this.params,
      data: this.getData()[0]
    }, { resultContext: r, resultParams: l } = O(i, n), u = Object.assign(this.context.clone(), r), c = { ...this.params, ...l };
    return { context: u, params: c };
  }
  /**
   * 打开导航占位视图
   *
   * @param {IDEDRBarItem} drBarItem 关系项
   * @memberof DRBarController
   */
  async openNavPosView(t, a = !1) {
    var e;
    const { context: i, params: n } = this.prepareParams(t);
    i.currentSrfNav = t.id, this.state.srfnav = t.id, (e = this.navPos) == null || e.openView({
      key: t.id,
      context: i,
      params: n,
      viewId: t.appViewId,
      isRoutePushed: a
    });
  }
  /**
   * 处理第一次的默认选中
   * @author lxm
   * @date 2023-12-11 05:38:30
   * @return {*}  {void}
   */
  doDefaultSelect() {
    var t, a;
    const e = (t = this.view.layoutPanel) == null ? void 0 : t.panelItems.view_form;
    if (e && (e.state.visible = !1, e.state.keepAlive = !1), !this.state.hideEditItem && !this.state.srfnav) {
      this.setVisible("form");
      return;
    }
    if (this.isCreate && !this.state.hideEditItem) {
      this.state.defaultItem = this.model.uniqueTag;
      return;
    }
    const { drBarItems: i } = this.state;
    let n = ((a = i[0].children) == null ? void 0 : a[0].tag) || i[0].tag;
    if (this.routeDepth && this.state.srfnav && (n = this.state.srfnav), n) {
      const r = !!this.routeDepth && P(this.routeDepth), { visible: l, defaultVisibleItem: u } = this.getItemVisibleState(n);
      !l && u ? (n = u.tag, this.handleSelectChange(n)) : this.handleSelectChange(n, r);
    }
  }
  /**
   * 初始化计数器
   * @author lxm
   * @date 2024-01-18 05:12:02
   * @protected
   * @return {*}  {Promise<void>}
   */
  async initCounter() {
    const { appCounterRefs: t } = this.model, a = t == null ? void 0 : t[0];
    if (a) {
      const e = C(this.router.currentRoute.value);
      this.routeDepth && (e.pathNodes = e.pathNodes.slice(0, this.routeDepth - 1));
      const i = q(e);
      this.counter = await j.getCounterByRef(
        a,
        this.context,
        i ? { srfcustomtag: i, ...this.params } : { ...this.params }
      ), this.calcItemStateByCounter = this.calcItemStateByCounter.bind(this), this.counter.onChange(this.calcItemStateByCounter);
    }
  }
  /**
   * 监听组件销毁
   *
   * @author zhanghengfeng
   * @date 2024-04-10 19:04:43
   * @protected
   * @return {*}  {Promise<void>}
   */
  async onDestroyed() {
    await super.onDestroyed(), this.counter && (this.counter.offChange(this.calcItemStateByCounter), this.counter.destroy());
  }
}
const nt = () => m("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false",
  style: "fill: currentColor;"
}, [m("g", {
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [m("path", {
  d: "M7.4 4.15L4.438 7.315a.6.6 0 0 1-.876-.82l3.97-4.243a.598.598 0 0 1 .93-.057l3.97 4.323a.6.6 0 1 1-.885.812L8.6 4.118v9.149c0 .404-.269.733-.6.733-.332 0-.6-.329-.6-.733V4.15z",
  transform: "rotate(-90 7.995 8)"
}, null)])]);
function ot(s) {
  return typeof s == "function" || Object.prototype.toString.call(s) === "[object Object]" && !Y(s);
}
const S = /* @__PURE__ */ G({
  name: "IBizRouteDrBarControl",
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
    },
    srfnav: {
      type: String,
      required: !1
    },
    showMode: {
      type: String,
      default: "vertical"
    },
    hideEditItem: {
      type: Boolean,
      default: void 0
    }
  },
  setup(s) {
    const t = L((...o) => new it(...o)), a = _("route-drbar-control"), e = F(), i = J({}), n = (o) => {
      Object.assign(i, o);
    };
    t.evt.on("onCreated", () => {
      t.counter && t.counter.onChange(n, !0);
    }), K(() => {
      var o;
      (o = t.counter) == null || o.offChange(n);
    }), t.setRouter(e);
    const r = (o) => {
      t.handleSelectChange(o);
    }, l = H();
    let u = "";
    const c = [];
    D(() => t.state.isCreated, (o, v) => {
      if (s.showMode !== "horizontal") {
        const {
          drBarItems: d
        } = t.state;
        d.forEach((h) => {
          c.push(h.tag);
        });
      }
    }), t.routeDepth && (u = I(l, t.routeDepth)), D(() => l.fullPath, (o, v) => {
      if (o !== v) {
        const d = t.routeDepth;
        if (d && I(l, t.routeDepth) === u) {
          const h = C(l), {
            srfnav: f
          } = h.pathNodes[d - 1];
          t.handleSelectChange(f);
        }
      }
    }, {
      immediate: !0
    });
    const p = (o) => {
      if (o.visible) {
        if (o.children) {
          let v = "";
          if (s.showMode === "horizontal" && o.tag !== t.state.selectedItem) {
            const d = o.children.find((h) => h.tag === t.state.selectedItem);
            d && (v = "-".concat(d.caption));
          }
          return m(g("el-sub-menu"), {
            class: a.b("group"),
            index: o.tag,
            disabled: o.disabled
          }, {
            default: () => o.children.map((d) => p(d)),
            title: () => [m(g("iBizIcon"), {
              class: a.e("icon"),
              icon: o.sysImage
            }, null), m("span", null, [o.caption, v])]
          });
        }
        return m(g("el-menu-item"), {
          class: a.e("item"),
          index: o.tag,
          disabled: o.disabled
        }, {
          default: () => [m(g("iBizIcon"), {
            class: a.e("icon"),
            icon: o.sysImage
          }, null), m("span", null, [o.caption]), o.counterId && i[o.counterId] != null && m(g("iBizBadge"), {
            class: a.e("counter"),
            value: i[o.counterId],
            counterMode: o.counterMode
          }, null)]
        });
      }
    };
    return {
      c: t,
      ns: a,
      handleSelect: r,
      renderMenuItems: p,
      opens: c
    };
  },
  render() {
    let s;
    const {
      isCreated: t,
      drBarItems: a,
      selectedItem: e,
      defaultItem: i,
      isCalculatedPermission: n
    } = this.c.state;
    return m(g("iBizControlBase"), {
      controller: this.c,
      class: this.ns.b()
    }, {
      default: () => {
        var r, l;
        return [t && n && [this.c.enableBack && this.c.viewId && m("div", {
          class: this.ns.b("back-btn"),
          onClick: this.c.handleBack.bind(this.c)
        }, [m("div", {
          class: this.ns.be("back-btn", "icon")
        }, [nt()]), m("div", {
          class: this.ns.be("back-btn", "text")
        }, [W("返回")])]), m(g("el-menu"), {
          class: [this.ns.e("menu"), !((l = (r = a[0]) == null ? void 0 : r.children) != null && l.length) && this.ns.em("menu", "signal")],
          mode: this.showMode,
          "default-active": e || i,
          onSelect: this.handleSelect,
          "default-openeds": this.opens
        }, ot(s = a.map((u) => this.renderMenuItems(u))) ? s : {
          default: () => [s]
        })]];
      }
    });
  }
});
class rt {
  constructor() {
    b(this, "component", "IBizRouteDrBarControl");
  }
}
const lt = z(S, function(s) {
  s.component(S.name, S), k("CUSTOM_ROUTE_DRBAR", () => new rt());
});
class ct extends A {
  constructor() {
    super(...arguments), b(this, "counter"), b(this, "router");
  }
  /**
   * 导航占位控制器
   *
   * @readonly
   * @memberof DRTabController
   */
  get navPos() {
    var t;
    return (t = this.view.layoutPanel) == null ? void 0 : t.panelItems.nav_pos;
  }
  /**
   * 表单部件
   *
   * @readonly
   * @memberof DRTabController
   */
  get form() {
    var t;
    return (t = this.view) == null ? void 0 : t.getController("form");
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
  setRouter(t) {
    this.router = t;
  }
  /**
   * 获取数据
   *
   * @return {*}  {IData[]}
   * @memberof DRTabController
   */
  getData() {
    var t;
    return ((t = this.form) == null ? void 0 : t.getData()) || [{}];
  }
  /**
   * 初始化state的属性
   *
   * @protected
   * @memberof DRTabController
   */
  initState() {
    super.initState(), this.state.drTabPages = [];
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
   * 通过计数器数据，计算项状态
   *
   * @author zhanghengfeng
   * @date 2024-05-16 17:05:01
   */
  calcItemStateByCounter() {
    if (this.state.drTabPages.forEach((t) => {
      const a = R(t, this.counter);
      a !== void 0 && (t.hidden = !a);
    }), this.state.activeName) {
      const { visible: t, defaultVisibleItem: a } = this.getItemVisibleState(
        this.state.activeName
      );
      !t && a && (this.state.activeName = a.tag, this.handleTabChange());
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
  getItemVisibleState(t) {
    let a = !0, e;
    return this.state.drTabPages.forEach((i) => {
      !e && !i.hidden && (e = i), i.tag === t && (a = !i.hidden);
    }), {
      visible: a,
      defaultVisibleItem: e
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
  async calcPermitted(t) {
    var a;
    let e = !0;
    const i = (a = this.getData()) != null && a.length ? this.getData()[0] : void 0, n = await M(
      t,
      this.context,
      this.params,
      this.model.appDataEntityId,
      this.model.appId,
      i
    );
    n !== void 0 && (e = n), t.hidden = !e;
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
      this.state.drTabPages.map(async (t) => {
        await this.calcPermitted(t);
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
    await super.onMounted(), this.form && (this.form.evt.on("onLoadSuccess", async (t) => {
      var a;
      const e = (a = t.data) == null ? void 0 : a[0];
      this.view.state.srfactiveviewdata = e, e && e.srfreadonly && (this.view.context.srfreadonly = !0), await this.calcDrTabPagesState(), this.handleFormChange();
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
    const t = this.getData()[0].srfuf !== E.UPDATE;
    this.setDRTabPagesState(this.state.drTabPages, t);
  }
  /**
   * 设置关系分页状态
   *
   * @param {IDRTabPagesState[]} drTabPages 关系分页
   * @param {boolean} disabled 禁用状态
   * @memberof DRTabController
   */
  setDRTabPagesState(t, a) {
    t.forEach((e) => {
      e.tag !== this.model.uniqueTag && (e.disabled = a);
    });
  }
  /**
   * 初始化关系分页数据
   *
   * @memberof DRTabController
   */
  initDRTabPages() {
    var t, a, e;
    const {
      editItemCaption: i,
      editItemCapLanguageRes: n,
      hideEditItem: r,
      editItemSysImage: l,
      uniqueTag: u,
      dedrtabPages: c
    } = this.model, p = [];
    let o = i;
    n && (o = ibiz.i18n.t(n.lanResTag, i)), r ? this.state.defaultName = (c == null ? void 0 : c[0].id) || "" : (p.push({
      tag: u,
      caption: o,
      hidden: !!r,
      disabled: !1,
      sysImage: l,
      fullPath: this.routeDepth ? I(this.router.currentRoute.value, this.routeDepth) : ""
    }), this.state.defaultName = ""), c == null || c.forEach((h) => {
      let f = h.caption;
      h.capLanguageRes && (f = ibiz.i18n.t(h.capLanguageRes.lanResTag, h.caption));
      const {
        enableMode: w,
        dataAccessAction: y,
        testAppDELogicId: Q,
        testScriptCode: Z,
        counterMode: $
      } = h;
      p.push({
        tag: h.id,
        caption: f,
        sysImage: h.sysImage,
        hidden: !1,
        disabled: !1,
        counterId: h.counterId,
        dataAccessAction: y,
        enableMode: w,
        testAppDELogicId: Q,
        testScriptCode: Z,
        counterMode: $
      });
    }), this.state.drTabPages = p, this.view.state.srfnav ? this.state.activeName = this.view.state.srfnav : this.state.activeName = p[0].tag;
    const v = !!this.routeDepth && P(this.routeDepth), d = (t = this.model.dedrtabPages) == null ? void 0 : t.find(
      (h) => h.id === this.state.activeName
    );
    if (d) {
      const h = (a = C(this.router.currentRoute.value).pathNodes[this.routeDepth]) == null ? void 0 : a.viewName, f = (e = d.appViewId) == null ? void 0 : e.split(".")[1];
      if (f && h && f !== h) {
        const w = I(
          this.router.currentRoute.value,
          this.routeDepth + 1
        );
        this.handleTabChange(v, w);
        return;
      }
    }
    this.handleTabChange(v);
  }
  /**
   * 处理分页改变
   *
   * @author lxm
   * @date 2023-12-21 05:31:59
   * @param {boolean} [isRoutePushed=false] 是否是路由已经跳转过了
   */
  handleTabChange(t = !1, a) {
    var e;
    const { activeName: i } = this.state, n = (e = this.model.dedrtabPages) == null ? void 0 : e.find(
      (r) => r.id === i
    );
    n ? (this.setVisible("navPos"), this.openNavPosView(n, t, a)) : (this.setVisible("form"), this.routeDepth && this.state.drTabPages[0] && this.router.push(this.state.drTabPages[0].fullPath));
  }
  /**
   * 设置显示状态
   *
   * @param {('form' | 'navPos')} ctrlName 显示的部件名称
   * @memberof DRTabController
   */
  setVisible(t) {
    var a;
    const e = (a = this.view.layoutPanel) == null ? void 0 : a.panelItems.view_form;
    t === "form" ? (e && (e.state.visible = !0, e.state.keepAlive = !0), this.navPos && (this.navPos.state.visible = !1, this.navPos.state.keepAlive = !0)) : (e && (e.state.visible = !1, e.state.keepAlive = !0), this.navPos && (this.navPos.state.visible = !0, this.navPos.state.keepAlive = !0));
  }
  /**
   * 准备参数
   *
   * @param {IDEDRCtrlItem} drTabPages 关系分页
   * @return {*}
   * @memberof DRTabController
   */
  prepareParams(t) {
    const { navigateContexts: a, navigateParams: e } = t, i = {
      navContexts: a,
      navParams: e
    }, n = {
      context: this.context,
      params: this.params,
      data: this.getData()[0]
    }, { resultContext: r, resultParams: l } = O(i, n), u = Object.assign(this.context.clone(), r, {
      currentSrfNav: t.id
    }), c = { ...this.params, ...l };
    return { context: u, params: c };
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
  async openNavPosView(t, a = !1, e) {
    var i;
    const { context: n, params: r } = this.prepareParams(t);
    (i = this.navPos) == null || i.openView({
      key: e || t.id,
      context: n,
      params: r,
      viewId: t.appViewId,
      isRoutePushed: a
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
    const { appCounterRefs: t } = this.model, a = t == null ? void 0 : t[0];
    if (a) {
      const e = C(this.router.currentRoute.value);
      this.routeDepth && (e.pathNodes = e.pathNodes.slice(0, this.routeDepth - 1));
      const i = q(e);
      this.counter = await j.getCounterByRef(
        a,
        this.context,
        i ? { srfcustomtag: i, ...this.params } : { ...this.params }
      ), this.calcItemStateByCounter = this.calcItemStateByCounter.bind(this), this.counter.onChange(this.calcItemStateByCounter);
    }
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
function ht(s) {
  return typeof s == "function" || Object.prototype.toString.call(s) === "[object Object]" && !Y(s);
}
const B = /* @__PURE__ */ G({
  name: "IBizRouteDrTabControl",
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
    const s = L((...c) => new ct(...c)), t = _("route-drtab-control"), a = F(), e = J({}), i = (c) => {
      Object.assign(e, c);
    };
    s.evt.on("onCreated", () => {
      s.counter && s.counter.onChange(i, !0);
    }), K(() => {
      var c;
      (c = s.counter) == null || c.offChange(i);
    }), s.setRouter(a);
    const n = () => {
      s.handleTabChange();
    }, r = (c) => {
      var p, o, v;
      const d = (p = s.model.dedrtabPages) == null ? void 0 : p.find((h) => h.id === c.paneName);
      if (d) {
        const h = (o = C(l).pathNodes[s.routeDepth]) == null ? void 0 : o.viewName, f = (v = d.appViewId) == null ? void 0 : v.split(".")[1];
        if (f && h && f === h)
          return;
      }
      s.state.activeName = c.paneName, s.handleTabChange();
    }, l = H();
    let u = "";
    return s.routeDepth && (u = I(l, s.routeDepth)), D(() => a.currentRoute.value, (c, p) => {
      var o, v;
      if (s.routeDepth && s.navPos) {
        const {
          pathNodes: d
        } = C(c), {
          pathNodes: h
        } = C(p), f = I(p, s.routeDepth + 1), w = I(l, s.routeDepth + 1);
        if (f === w)
          return;
        const y = ((o = d[s.routeDepth + 1]) == null ? void 0 : o.viewName) === "route-modal" || ((v = h[s.routeDepth + 1]) == null ? void 0 : v.viewName) === "route-modal";
        w && !y && s.navPos.openView({
          key: w,
          isRoutePushed: !0,
          context: s.context.clone(),
          params: {
            ...s.params
          }
        });
      }
    }), D(() => l.fullPath, (c, p) => {
      if (c !== p) {
        const o = s.routeDepth;
        if (o && I(l, s.routeDepth) === u) {
          const v = C(l), {
            srfnav: d
          } = v.pathNodes[o - 1], h = !!s.routeDepth && P(s.routeDepth);
          if (d && s.state.activeName && s.state.activeName !== d)
            s.state.activeName = d, s.handleTabChange(h);
          else if (!d) {
            const f = !!s.routeDepth && !P(s.routeDepth);
            (s.state.activeName !== s.state.defaultName || f) && (s.state.activeName = s.state.defaultName, s.handleTabChange(h));
          }
        }
      }
    }, {
      immediate: !0
    }), {
      c: s,
      ns: t,
      counterData: e,
      handleTabChange: n,
      handleTabClick: r
    };
  },
  render() {
    let s;
    const {
      isCreated: t,
      drTabPages: a,
      isCalculatedPermission: e
    } = this.c.state;
    return m(g("iBizControlBase"), {
      controller: this.c,
      class: this.ns.b()
    }, {
      default: () => [t && e && m(g("el-tabs"), {
        modelValue: this.c.state.activeName,
        onTabClick: this.handleTabClick
      }, ht(s = a.map((i) => {
        const n = i.counterId ? this.counterData[i.counterId] : void 0;
        return i.hidden ? null : m(g("el-tab-pane"), {
          class: this.ns.e("tab-item"),
          label: i.caption + n,
          disabled: i.disabled,
          name: i.tag
        }, {
          label: () => m("span", {
            class: this.ns.b("label")
          }, [m("span", {
            class: this.ns.be("label", "text")
          }, [i.caption]), !X(n) && m(g("iBizBadge"), {
            class: this.ns.e("counter"),
            value: n,
            counterMode: i.counterMode
          }, null)])
        });
      })) ? s : {
        default: () => [s]
      })]
    });
  }
});
class ut {
  constructor() {
    b(this, "component", "IBizRouteDrTabControl");
  }
}
const dt = z(B, function(s) {
  s.component(B.name, B), k("CUSTOM_ROUTE_DRTAB", () => new ut());
}), gt = {
  install(s) {
    s.use(lt), s.use(dt);
  }
};
export {
  gt as default
};
