import './assets/style.css';
import { registerControlProvider as T, hasSubRoute as P, ControlController as x, Srfuf as V, calcItemVisibleByCounter as N, calcItemVisible as A, OpenAppViewCommand as R, calcNavParams as E, CounterService as k } from "@ibiz-template/runtime";
import { withInstall as M, useControlController as O, useNamespace as j, getNestedRoutePath as I, route2routePath as C, routePath2string as z } from "@ibiz-template/vue3-util";
import { defineComponent as L, reactive as _, onUnmounted as q, watch as D, createVNode as m, resolveComponent as g, createTextVNode as Q, isVNode as U } from "vue";
import { useRouter as F, useRoute as G } from "vue-router";
import { isNil as Z } from "ramda";
var $ = Object.defineProperty, K = (n, t, a) => t in n ? $(n, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : n[t] = a, b = (n, t, a) => (K(n, typeof t != "symbol" ? t + "" : t, a), a);
class W extends x {
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
    return this.getData()[0].srfuf !== V.UPDATE;
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
      var s;
      if ((s = e.children) != null && s.length)
        e.children.forEach((i) => {
          const r = N(i, this.counter);
          r !== void 0 && (i.visible = r);
        }), e.visible = e.children.some((i) => i.visible);
      else {
        const i = N(e, this.counter);
        i !== void 0 && (e.visible = i);
      }
    }), this.state.selectedItem && a) {
      const { visible: e, defaultVisibleItem: s } = this.getItemVisibleState(
        this.state.selectedItem
      );
      !e && s && this.handleSelectChange(s.tag);
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
    return this.state.drBarItems.forEach((s) => {
      if (s.children) {
        e || (e = s.children.find((r) => r.visible));
        const i = s.children.find((r) => r.tag === t);
        i && (a = !!i.visible);
      } else
        !e && s.visible && (e = s), s.tag === t && (a = !!s.visible);
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
    const s = (a = this.getData()) != null && a.length ? this.getData()[0] : void 0, i = await A(
      t,
      this.context,
      this.params,
      this.model.appDataEntityId,
      this.model.appId,
      s
    );
    i !== void 0 && (e = i), t.visible = e;
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
      const s = (e = a.data) == null ? void 0 : e[0];
      this.view.state.srfactiveviewdata = s, s && s.srfreadonly && (this.view.context.srfreadonly = !0), await this.calcDrBarItemsState(), this.doDefaultSelect();
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
        editItemCaption: i,
        editItemCapLanguageRes: r,
        editItemSysImage: l,
        uniqueTag: u
      } = this.model;
      let c = i;
      r && (c = ibiz.i18n.t(
        r.lanResTag,
        i
      )), e.push({
        tag: u,
        caption: c,
        disabled: !1,
        sysImage: l,
        fullPath: this.router.currentRoute.value.fullPath
      }), this.state.defaultItem = u;
    }
    const s = (i) => {
      let r = i.caption;
      i.capLanguageRes && (r = ibiz.i18n.t(i.capLanguageRes.lanResTag, i.caption));
      const { enableMode: l, testAppDELogicId: u, testScriptCode: c, counterMode: p } = i;
      return {
        tag: i.id,
        caption: r,
        sysImage: i.sysImage,
        disabled: !1,
        counterId: i.counterId,
        visible: !1,
        // 默认不显示
        dataAccessAction: i.dataAccessAction || void 0,
        enableMode: l,
        testAppDELogicId: u,
        testScriptCode: c,
        counterMode: p
      };
    };
    a && t && (a.length === 1 ? t.forEach((i) => {
      e.push(s(i));
    }) : a.forEach((i) => {
      var r;
      const l = t.filter(
        (u) => u.dedrbarGroupId === i.id
      );
      if (l.length > 1 || ((r = this.controlParams) == null ? void 0 : r.singleitemgroup) === "true" && l.length === 1) {
        let u = i.caption;
        i.capLanguageRes && (u = ibiz.i18n.t(
          i.capLanguageRes.lanResTag,
          i.caption
        )), e.push({
          tag: i.id,
          caption: u,
          sysImage: i.sysImage,
          visible: !1,
          // 默认不显示
          children: l.map((c) => s(c))
        });
      } else
        l.length === 1 && e.push(s(l[0]));
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
    ibiz.commands.execute(R.TAG, this.viewId, t, a);
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
    const s = (e = this.model.dedrctrlItems) == null ? void 0 : e.find((i) => i.id === t);
    if (s && this.routeItems.includes(t)) {
      const { context: i, params: r } = this.prepareParams(s);
      Object.assign(i, {
        srfdefaulttoroutedepth: this.routeDepth
      }), ibiz.commands.execute(
        R.TAG,
        s.appViewId,
        i,
        r
      );
      return;
    }
    if (s)
      this.setVisible("navPos"), this.openNavPosView(s, a);
    else if (this.setVisible("form"), this.routeDepth) {
      const i = I(
        this.router.currentRoute.value,
        this.routeDepth
      );
      this.router.push(i);
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
    const { navigateContexts: a, navigateParams: e } = t, s = {
      navContexts: a,
      navParams: e
    }, i = {
      context: this.context,
      params: this.params,
      data: this.getData()[0]
    }, { resultContext: r, resultParams: l } = E(s, i), u = Object.assign(this.context.clone(), r), c = { ...this.params, ...l };
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
    const { context: s, params: i } = this.prepareParams(t);
    s.currentSrfNav = t.id, this.state.srfnav = t.id, (e = this.navPos) == null || e.openView({
      key: t.id,
      context: s,
      params: i,
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
    const { drBarItems: s } = this.state;
    let i = ((a = s[0].children) == null ? void 0 : a[0].tag) || s[0].tag;
    if (this.routeDepth && this.state.srfnav && (i = this.state.srfnav), i) {
      const r = !!this.routeDepth && P(this.routeDepth), { visible: l, defaultVisibleItem: u } = this.getItemVisibleState(i);
      !l && u ? (i = u.tag, this.handleSelectChange(i)) : this.handleSelectChange(i, r);
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
      const s = z(e);
      this.counter = await k.getCounterByRef(
        a,
        this.context,
        s ? { srfcustomtag: s, ...this.params } : { ...this.params }
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
const X = () => m("svg", {
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
function tt(n) {
  return typeof n == "function" || Object.prototype.toString.call(n) === "[object Object]" && !U(n);
}
const S = /* @__PURE__ */ L({
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
  setup(n) {
    const t = O((...o) => new W(...o)), a = j("route-drbar-control"), e = F(), s = _({}), i = (o) => {
      Object.assign(s, o);
    };
    t.evt.on("onCreated", () => {
      t.counter && t.counter.onChange(i, !0);
    }), q(() => {
      var o;
      (o = t.counter) == null || o.offChange(i);
    }), t.setRouter(e);
    const r = (o) => {
      t.handleSelectChange(o);
    }, l = G();
    let u = "";
    const c = [];
    D(() => t.state.isCreated, (o, v) => {
      if (n.showMode !== "horizontal") {
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
          if (n.showMode === "horizontal" && o.tag !== t.state.selectedItem) {
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
          }, null), m("span", null, [o.caption]), o.counterId && s[o.counterId] != null && m(g("iBizBadge"), {
            class: a.e("counter"),
            value: s[o.counterId],
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
    let n;
    const {
      isCreated: t,
      drBarItems: a,
      selectedItem: e,
      defaultItem: s,
      isCalculatedPermission: i
    } = this.c.state;
    return m(g("iBizControlBase"), {
      controller: this.c,
      class: this.ns.b()
    }, {
      default: () => {
        var r, l;
        return [t && i && [this.c.enableBack && this.c.viewId && m("div", {
          class: this.ns.b("back-btn"),
          onClick: this.c.handleBack.bind(this.c)
        }, [m("div", {
          class: this.ns.be("back-btn", "icon")
        }, [X()]), m("div", {
          class: this.ns.be("back-btn", "text")
        }, [Q("返回")])]), m(g("el-menu"), {
          class: [this.ns.e("menu"), !((l = (r = a[0]) == null ? void 0 : r.children) != null && l.length) && this.ns.em("menu", "signal")],
          mode: this.showMode,
          "default-active": e || s,
          onSelect: this.handleSelect,
          "default-openeds": this.opens
        }, tt(n = a.map((u) => this.renderMenuItems(u))) ? n : {
          default: () => [n]
        })]];
      }
    });
  }
});
class et {
  constructor() {
    b(this, "component", "IBizRouteDrBarControl");
  }
}
const at = M(S, function(n) {
  n.component(S.name, S), T("CUSTOM_ROUTE_DRBAR", () => new et());
});
class st extends x {
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
      const a = N(t, this.counter);
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
    return this.state.drTabPages.forEach((s) => {
      !e && !s.hidden && (e = s), s.tag === t && (a = !s.hidden);
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
    const s = (a = this.getData()) != null && a.length ? this.getData()[0] : void 0, i = await A(
      t,
      this.context,
      this.params,
      this.model.appDataEntityId,
      this.model.appId,
      s
    );
    i !== void 0 && (e = i), t.hidden = !e;
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
    const t = this.getData()[0].srfuf !== V.UPDATE;
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
      editItemCaption: s,
      editItemCapLanguageRes: i,
      hideEditItem: r,
      editItemSysImage: l,
      uniqueTag: u,
      dedrtabPages: c
    } = this.model, p = [];
    let o = s;
    i && (o = ibiz.i18n.t(i.lanResTag, s)), r ? this.state.defaultName = (c == null ? void 0 : c[0].id) || "" : (p.push({
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
        testAppDELogicId: J,
        testScriptCode: Y,
        counterMode: H
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
        testAppDELogicId: J,
        testScriptCode: Y,
        counterMode: H
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
    const { activeName: s } = this.state, i = (e = this.model.dedrtabPages) == null ? void 0 : e.find(
      (r) => r.id === s
    );
    i ? (this.setVisible("navPos"), this.openNavPosView(i, t, a)) : (this.setVisible("form"), this.routeDepth && this.state.drTabPages[0] && this.router.push(this.state.drTabPages[0].fullPath));
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
    const { navigateContexts: a, navigateParams: e } = t, s = {
      navContexts: a,
      navParams: e
    }, i = {
      context: this.context,
      params: this.params,
      data: this.getData()[0]
    }, { resultContext: r, resultParams: l } = E(s, i), u = Object.assign(this.context.clone(), r, {
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
    var s;
    const { context: i, params: r } = this.prepareParams(t);
    (s = this.navPos) == null || s.openView({
      key: e || t.id,
      context: i,
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
      const s = z(e);
      this.counter = await k.getCounterByRef(
        a,
        this.context,
        s ? { srfcustomtag: s, ...this.params } : { ...this.params }
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
function it(n) {
  return typeof n == "function" || Object.prototype.toString.call(n) === "[object Object]" && !U(n);
}
const B = /* @__PURE__ */ L({
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
    const n = O((...c) => new st(...c)), t = j("route-drtab-control"), a = F(), e = _({}), s = (c) => {
      Object.assign(e, c);
    };
    n.evt.on("onCreated", () => {
      n.counter && n.counter.onChange(s, !0);
    }), q(() => {
      var c;
      (c = n.counter) == null || c.offChange(s);
    }), n.setRouter(a);
    const i = () => {
      n.handleTabChange();
    }, r = (c) => {
      var p, o, v;
      const d = (p = n.model.dedrtabPages) == null ? void 0 : p.find((h) => h.id === c.paneName);
      if (d) {
        const h = (o = C(l).pathNodes[n.routeDepth]) == null ? void 0 : o.viewName, f = (v = d.appViewId) == null ? void 0 : v.split(".")[1];
        if (f && h && f === h)
          return;
      }
      n.state.activeName = c.paneName, n.handleTabChange();
    }, l = G();
    let u = "";
    return n.routeDepth && (u = I(l, n.routeDepth)), D(() => a.currentRoute.value, (c, p) => {
      var o, v;
      if (n.routeDepth && n.navPos) {
        const {
          pathNodes: d
        } = C(c), {
          pathNodes: h
        } = C(p), f = I(p, n.routeDepth + 1), w = I(l, n.routeDepth + 1);
        if (f === w)
          return;
        const y = ((o = d[n.routeDepth + 1]) == null ? void 0 : o.viewName) === "route-modal" || ((v = h[n.routeDepth + 1]) == null ? void 0 : v.viewName) === "route-modal";
        w && !y && n.navPos.openView({
          key: w,
          isRoutePushed: !0,
          context: n.context.clone(),
          params: {
            ...n.params
          }
        });
      }
    }), D(() => l.fullPath, (c, p) => {
      if (c !== p) {
        const o = n.routeDepth;
        if (o && I(l, n.routeDepth) === u) {
          const v = C(l), {
            srfnav: d
          } = v.pathNodes[o - 1], h = !!n.routeDepth && P(n.routeDepth);
          if (d && n.state.activeName && n.state.activeName !== d)
            n.state.activeName = d, n.handleTabChange(h);
          else if (!d) {
            const f = !!n.routeDepth && !P(n.routeDepth);
            (n.state.activeName !== n.state.defaultName || f) && (n.state.activeName = n.state.defaultName, n.handleTabChange(h));
          }
        }
      }
    }, {
      immediate: !0
    }), {
      c: n,
      ns: t,
      counterData: e,
      handleTabChange: i,
      handleTabClick: r
    };
  },
  render() {
    let n;
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
      }, it(n = a.map((s) => {
        const i = s.counterId ? this.counterData[s.counterId] : void 0;
        return s.hidden ? null : m(g("el-tab-pane"), {
          class: this.ns.e("tab-item"),
          label: s.caption + i,
          disabled: s.disabled,
          name: s.tag
        }, {
          label: () => m("span", {
            class: this.ns.b("label")
          }, [m("span", {
            class: this.ns.be("label", "text")
          }, [s.caption]), !Z(i) && m(g("iBizBadge"), {
            class: this.ns.e("counter"),
            value: i,
            counterMode: s.counterMode
          }, null)])
        });
      })) ? n : {
        default: () => [n]
      })]
    });
  }
});
class nt {
  constructor() {
    b(this, "component", "IBizRouteDrTabControl");
  }
}
const ot = M(B, function(n) {
  n.component(B.name, B), T("CUSTOM_ROUTE_DRTAB", () => new nt());
}), dt = {
  install(n) {
    n.use(at), n.use(ot);
  }
};
export {
  dt as default
};
