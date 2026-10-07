import './assets/style.css';
import { registerControlProvider as W, ControlController as K, Srfuf as $, calcItemVisibleByCounter as z, calcItemVisible as H, calcNavParams as X, hasSubRoute as k, CounterService as F } from "@ibiz-template/runtime";
import { withInstall as J, route2routePath as C, routePath2string as x, useControlController as Q, useNamespace as Y, getNestedRoutePath as A, onRouteChange as Z } from "@ibiz-template/vue3-util";
import { defineComponent as tt, ref as N, reactive as et, onUnmounted as L, watch as M, createVNode as m, resolveComponent as b, computed as st, watchEffect as at } from "vue";
import { useRouter as it, useRoute as O } from "vue-router";
var ot = Object.defineProperty, rt = (n, t, a) => t in n ? ot(n, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : n[t] = a, S = (n, t, a) => (rt(n, typeof t != "symbol" ? t + "" : t, a), a);
class nt extends K {
  constructor() {
    super(...arguments), S(this, "router"), S(this, "storagePrefix", "DR_BAR_SELECTED_ITEM"), S(this, "counter");
  }
  /**
   * 导航占位控制器
   *
   * @readonly
   * @memberof DRBarExController
   */
  get navPos() {
    var t;
    return (t = this.view.layoutPanel) == null ? void 0 : t.panelItems.nav_pos;
  }
  /**
   * 表单部件
   *
   * @readonly
   * @memberof DRBarExController
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
    return this.getData()[0].srfuf !== $.UPDATE;
  }
  /**
   * 获取数据
   *
   * @return {*}  {IData[]}
   * @memberof DRBarExController
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
    var a;
    this.router = t, this.state.isCreated && !this.counter && ((a = this.model.appCounterRefs) != null && a[0]) && this.initCounter();
  }
  /**
   * 路由层级
   *
   * @readonly
   * @type {(number | undefined)}
   * @memberof DRBarExController
   */
  get routeDepth() {
    return this.view.modal.routeDepth;
  }
  /**
   * 初始化state的属性
   *
   * @protected
   * @memberof DRBarExController
   */
  initState() {
    super.initState(), this.state.drBarItems = [], this.state.srfnav = "", this.state.hideEditItem = !!this.model.hideEditItem, this.state.showMore = !1;
  }
  /**
   * 创建完成
   *
   * @return {*}  {Promise<void>}
   * @memberof DRBarExController
   */
  async onCreated() {
    await super.onCreated(), this.initDRBarItems(), await this.initCounter();
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
   * @date 2024-05-20 11:05:21
   * @param {IData} [_data]
   * @param {boolean} [reset=true]
   */
  calcItemStateByCounter(t, a = !0) {
    if (this.state.activated && (this.state.drBarItems.forEach((e) => {
      var i;
      if ((i = e.children) != null && i.length)
        e.children.forEach((s) => {
          const o = z(s, this.counter);
          o !== void 0 && (s.visible = o);
        }), e.visible = e.children.some((s) => s.visible);
      else {
        const s = z(e, this.counter);
        s !== void 0 && (e.visible = s);
      }
    }), this.state.selectedItem && a)) {
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
   * @date 2024-05-20 11:05:41
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
        e || (e = i.children.find((o) => o.visible));
        const s = i.children.find((o) => o.tag === t);
        s && (a = !!s.visible);
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
   * @author zhanghengfeng
   * @date 2024-05-20 11:05:54
   * @param {IDRBarItemsState} item
   * @return {*}  {Promise<void>}
   */
  async calcPermitted(t) {
    var a;
    let e = !0;
    const i = (a = this.getData()) != null && a.length ? this.getData()[0] : void 0, s = await H(
      t,
      this.context,
      this.params,
      this.model.appDataEntityId,
      this.model.appId,
      i
    );
    s !== void 0 && (e = s), t.visible = e;
  }
  /**
   * 计算是否展示
   *
   * @author zhanghengfeng
   * @date 2024-05-20 11:05:59
   * @return {*}  {Promise<void>}
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
   * @memberof DRBarExController
   */
  async onMounted() {
    await super.onMounted(), this.form ? this.form.evt.on("onLoadSuccess", async (t) => {
      var a;
      const e = (a = t.data) == null ? void 0 : a[0];
      this.view.state.srfactiveviewdata = e, e && e.srfreadonly && (this.view.context.srfreadonly = !0), await this.calcDrBarItemsState(), this.doDefaultSelect();
    }) : await this.calcDrBarItemsState(), this.form.state.isLoaded && this.doDefaultSelect();
  }
  /**
   * 初始化关系项数据
   *
   * @memberof DRBarExController
   */
  initDRBarItems() {
    const { dedrctrlItems: t, dedrbarGroups: a } = this.model, e = [];
    a && t && a.forEach((i) => {
      const s = t.filter(
        (o) => o.dedrbarGroupId === i.id
      );
      if (s.length > 0) {
        let o = i.caption;
        i.capLanguageRes && (o = ibiz.i18n.t(
          i.capLanguageRes.lanResTag,
          i.caption
        ));
        const {
          enableMode: h,
          dataAccessAction: d,
          testAppDELogicId: l,
          testScriptCode: r,
          counterId: c,
          counterMode: u
        } = s[0] || {};
        e.push({
          tag: i.id,
          caption: o,
          sysImage: i.sysImage,
          visible: !1,
          enableMode: h,
          dataAccessAction: d,
          testAppDELogicId: l,
          testScriptCode: r,
          counterId: c,
          counterMode: u
        });
      }
    }), this.state.drBarItems = e;
  }
  /**
   * 处理选中改变
   *
   * @param {string} key
   * @memberof DRBarExController
   */
  handleSelectChange(t, a = !1) {
    var h, d, l;
    var e;
    if (!this.state.drBarItems.find((r) => r.tag === t))
      return;
    const i = (e = this.model.dedrctrlItems) == null ? void 0 : e.find(
      (r) => r.dedrbarGroupId === t
    );
    i ? (this.setVisible("navPos"), this.openNavPosView(i, a)) : (this.setVisible("form"), this.routeDepth && ((h = this.router) == null || h.push(this.state.drBarItems[0].fullPath))), this.state.selectedItem = t, this.state.defaultItem = t;
    const s = this.context.srfuserid, o = (l = (d = this.router) == null ? void 0 : d.currentRoute) == null ? void 0 : l.value;
    if (s && o) {
      const r = C(o);
      if (this.routeDepth && r.pathNodes[this.routeDepth - 2]) {
        r.pathNodes = r.pathNodes.slice(0, this.routeDepth - 1);
        const c = x(r).split("/");
        c && c.length && localStorage.setItem(
          "".concat(this.storagePrefix, "_").concat(s, "_").concat(c[c.length - 1]),
          t
        );
      }
    }
  }
  /**
   * 设置显示状态
   *
   * @param {('form' | 'navPos')} ctrlName 显示的部件名称
   * @memberof DRBarExController
   */
  setVisible(t) {
    var a;
    if (this.state.hideEditItem)
      return;
    const e = (a = this.view.layoutPanel) == null ? void 0 : a.panelItems.view_form;
    t === "form" ? (e && (e.state.visible = !0, e.state.keepAlive = !0), this.navPos && (this.navPos.state.visible = !1, this.navPos.state.keepAlive = !0)) : (e && (e.state.visible = !1, e.state.keepAlive = !0), this.navPos && (this.navPos.state.visible = !0, this.navPos.state.keepAlive = !0));
  }
  /**
   * 准备参数
   *
   * @param {IDEDRBarItem} drBarItem 关系项
   * @return {*}
   * @memberof DRBarExController
   */
  prepareParams(t) {
    const { navigateContexts: a, navigateParams: e } = t, i = {
      navContexts: a,
      navParams: e
    }, s = {
      context: this.context,
      params: this.params,
      data: this.getData()[0]
    }, { resultContext: o, resultParams: h } = X(i, s), d = Object.assign(this.context.clone(), o), l = { ...this.params, ...h };
    return { context: d, params: l };
  }
  /**
   * 打开导航占位视图
   *
   * @param {IDEDRBarItem} drBarItem 关系项
   * @memberof DRBarExController
   */
  async openNavPosView(t, a = !1) {
    var e;
    const { context: i, params: s } = this.prepareParams(t);
    Object.assign(i, {
      srfdefaulttoroutedepth: this.routeDepth + 1
    }), i.currentSrfNav = t.dedrbarGroupId, this.state.srfnav = t.dedrbarGroupId, (e = this.navPos) == null || e.openView({
      key: t.id,
      context: i,
      params: s,
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
    var h, d;
    var t;
    if (!this.state.hideEditItem && !this.state.srfnav)
      return;
    if (this.isCreate) {
      this.state.defaultItem = this.model.uniqueTag;
      return;
    }
    const { drBarItems: a } = this.state;
    let e = ((t = a[0].children) == null ? void 0 : t[0].tag) || a[0].tag;
    const i = this.context.srfuserid, s = (d = (h = this.router) == null ? void 0 : h.currentRoute) == null ? void 0 : d.value;
    if (i && s) {
      const l = C(s);
      if (this.routeDepth && l.pathNodes[this.routeDepth - 2]) {
        l.pathNodes = l.pathNodes.slice(0, this.routeDepth - 1);
        const r = x(l).split("/");
        if (r && r.length) {
          const c = localStorage.getItem(
            "".concat(this.storagePrefix, "_").concat(i, "_").concat(r[r.length - 1])
          );
          c && (e = c);
        }
      }
    }
    const o = s ? C(s) : void 0;
    if (o && this.routeDepth && o.pathNodes[this.routeDepth - 1]) {
      const l = o.pathNodes[this.routeDepth - 1];
      l && l.srfnav && (e = l.srfnav);
    }
    if (e) {
      if (this.state.selectedItem && this.state.selectedItem === e)
        return;
      const l = !!this.routeDepth && k(this.routeDepth), { visible: r, defaultVisibleItem: c } = this.getItemVisibleState(e);
      !r && c ? (e = c.tag, this.handleSelectChange(e)) : this.handleSelectChange(e, l), this.state.defaultItem = e;
    }
  }
  /**
   * 路由变更处理回调
   * @param {{ srfnav?: string; path: string }} info 当前系统的路由的从一级到最后一级的所有路径。
   */
  async onRouterChange(t) {
    if (this.state.srfnav !== t.srfnav && t.srfnav) {
      this.state.srfnav = t.srfnav;
      const a = !!this.routeDepth && k(this.routeDepth);
      this.handleSelectChange(t.srfnav, a), this.force(() => {
        this.state.defaultItem = t.srfnav;
      });
    }
  }
  /**
   * 初始化计数器
   *
   * @author zhanghengfeng
   * @date 2024-05-20 11:05:28
   * @protected
   * @return {*}  {Promise<void>}
   */
  async initCounter() {
    var i, s;
    const { appCounterRefs: t } = this.model, a = t == null ? void 0 : t[0], e = (s = (i = this.router) == null ? void 0 : i.currentRoute) == null ? void 0 : s.value;
    if (a && e) {
      const o = C(e);
      this.routeDepth && (o.pathNodes = o.pathNodes.slice(0, this.routeDepth - 1));
      const h = x(o);
      this.counter = await F.getCounterByRef(
        a,
        this.context,
        h ? { srfcustomtag: h, ...this.params } : { ...this.params }
      ), this.calcItemStateByCounter = this.calcItemStateByCounter.bind(this), this.counter.onChange(this.calcItemStateByCounter);
    }
  }
  /**
   * 监听组件销毁
   *
   * @author zhanghengfeng
   * @date 2024-05-20 11:05:37
   * @protected
   * @return {*}  {Promise<void>}
   */
  async onDestroyed() {
    await super.onDestroyed(), this.counter && (this.counter.offChange(this.calcItemStateByCounter), this.counter.destroy());
  }
}
const P = "ibiz";
function lt(n, t, a) {
  let e = null, i = 0;
  const s = N([]), o = N([]), h = st(() => n.state.drBarItems.find(
    (u) => u.tag === n.state.defaultItem
  )), d = (u, v = {}) => {
    let f = 0;
    const p = document.createElement("div"), g = document.createElement("div");
    return g.innerHTML = u, Object.assign(g.style, v), Object.assign(p.style, {
      width: "auto",
      position: "absolute",
      left: "-9999px"
    }), p.appendChild(g), document.body.appendChild(p), f = p.offsetWidth, document.body.removeChild(p), f;
  }, l = () => {
    const { drBarItems: u, showMore: v, defaultItem: f } = n.state;
    if (!t.value || !v || u.length === 0) {
      s.value = u, o.value = [];
      return;
    }
    let p = !1;
    const g = t.value.$el.offsetWidth;
    let w = 0;
    s.value = [], o.value = [], u.forEach((I, V) => {
      if (I.visible) {
        const _ = I.caption || "", D = I.counterId ? a[I.counterId] : null, B = "var(--".concat(P, "-font-size-header-6)");
        if (D != null && !(!D && D !== 0) && !(I.counterMode === 1 && D <= 0)) {
          const q = {
            marginLeft: "var(--".concat(P, "-spacing-tight)"),
            padding: "0 var(--".concat(P, "-spacing-extra-tight)"),
            minWidth: "20px",
            fontSize: "var(--".concat(P, "-font-size-small)")
          }, U = d(String(D), q);
          w += U;
        }
        const j = d(_, {
          padding: V === 0 ? "0 20px 0 0" : "0 20px",
          fontSize: B
        });
        w += j;
        const T = {
          padding: "0 0 0 20px",
          fontSize: B
        };
        let y = d("^", {
          minWidth: "16px",
          fontSize: B
        });
        y = y > 16 ? y : 16;
        let R = "更多";
        !p && h.value && (R = h.value.caption || R);
        const G = d("".concat(R, " "), T) + y;
        V === u.length - 1 && w < g ? s.value.push(I) : w + G > g ? o.value.push(I) : (s.value.push(I), p || (p = I.tag === f));
      }
    });
  }, r = () => {
    if (window.ResizeObserver) {
      const u = t.value.$el;
      u && (e = new ResizeObserver((v) => {
        const { width: f } = v[0].contentRect;
        f !== i && (l(), i = f);
      }), e.observe(u));
    }
  };
  M(
    () => n.state.drBarItems,
    () => {
      l();
    },
    { deep: !0 }
  ), M(
    () => n.state.defaultItem,
    () => {
      l();
    }
  );
  const c = at(() => {
    t.value && r();
  });
  return L(() => {
    e && e.disconnect(), c();
  }), { visibleItems: s, moreItems: o };
}
function ct(n) {
  const t = n.view.modal.routeDepth;
  if (t) {
    const a = O();
    if (!a)
      return;
    let e;
    Z(({
      currentKey: i,
      fullPath: s
    }) => {
      if (!e)
        e = i;
      else if (e === i) {
        const o = C(a), {
          srfnav: h
        } = o.pathNodes[t - 1];
        n.onRouterChange({
          srfnav: h || "",
          path: s
        });
      }
    }, t);
  }
}
const E = /* @__PURE__ */ tt({
  name: "IBizDRBarExControl",
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
  setup() {
    const n = it(), t = Q((...r) => {
      const c = new nt(...r);
      return c.setRouter(n), c;
    });
    t.setRouter(n);
    const a = Y("control-".concat(t.model.controlType.toLowerCase(), "-ex")), e = N(), i = et({}), {
      visibleItems: s,
      moreItems: o
    } = lt(t, e, i), h = (r) => {
      Object.assign(i, r);
    };
    t.evt.on("onCreated", () => {
      t.counter && t.counter.onChange(h, !0);
    }), L(() => {
      var r;
      (r = t.counter) == null || r.offChange(h);
    });
    const d = O(), l = n == null ? void 0 : n.currentRoute;
    return ct(t), l && M(() => l.value, (r, c) => {
      var u, v;
      if (t.routeDepth && t.navPos && r && c) {
        const {
          pathNodes: f
        } = C(r), {
          pathNodes: p
        } = C(c), g = A(c, t.routeDepth + 1), w = A(d, t.routeDepth + 1);
        if (g === w)
          return;
        const I = ((u = f[t.routeDepth + 1]) == null ? void 0 : u.viewName) === "route-modal" || ((v = p[t.routeDepth + 1]) == null ? void 0 : v.viewName) === "route-modal";
        w && !I && t.navPos.openView({
          key: w,
          isRoutePushed: !1,
          context: t.context.clone(),
          params: {
            ...t.params
          }
        });
      }
    }), {
      c: t,
      ns: a,
      moreItems: o,
      controlRef: e,
      visibleItems: s,
      counterData: i,
      handleSelect: (r) => {
        var c, u, v;
        if (!t.state.drBarItems.find((p) => p.tag === r))
          return;
        const f = (c = t.model.dedrctrlItems) == null ? void 0 : c.find((p) => p.dedrbarGroupId === r);
        if (f) {
          const p = d ? (u = C(d).pathNodes[t.routeDepth]) == null ? void 0 : u.viewName : void 0, g = (v = f.appViewId) == null ? void 0 : v.split(".")[1];
          if (g && p && g === p)
            return;
        }
        t.handleSelectChange(r);
      }
    };
  },
  render() {
    const {
      isCreated: n,
      defaultItem: t,
      isCalculatedPermission: a
    } = this.c.state, e = this.moreItems.find((s) => s.tag === t) || {}, i = m(b("el-dropdown"), {
      trigger: "click",
      class: this.ns.b("more-dropdown"),
      "popper-class": this.ns.b("more-dropdown-popper")
    }, {
      default: () => m("div", {
        class: this.ns.be("more-dropdown", "link"),
        onClick: (s) => s.stopPropagation()
      }, [m("span", null, [e.caption ? "".concat(e.caption, " ") : "更多 "]), m("svg", {
        viewBox: "0 0 16 16",
        xmlns: "http://www.w3.org/2000/svg",
        height: "1em",
        width: "1em"
      }, [m("g", {
        "stroke-width": "1",
        "fill-rule": "evenodd"
      }, [m("path", {
        d: "M7.978 11.997l-.005.006L2.3 6.33l.83-.831 4.848 4.848L12.826 5.5l.83.83-5.673 5.673-.005-.006z"
      }, null)])])]),
      dropdown: () => m(b("el-dropdown-menu"), null, {
        default: () => this.moreItems.map((s) => m(b("el-dropdown-item"), {
          class: [t === s.tag ? this.ns.be("more-dropdown-popper", "current") : ""],
          onClick: () => this.handleSelect(s.tag)
        }, {
          default: () => [m("span", {
            class: [this.ns.be("more-dropdown-popper", "label")]
          }, [m("span", {
            class: this.ns.bem("more-dropdown-popper", "label", "text"),
            title: s.caption || ""
          }, [s.caption || ""]), s.counterId && this.counterData[s.counterId] != null && m(b("iBizBadge"), {
            class: this.ns.bem("more-dropdown-popper", "label", "counter"),
            value: this.counterData[s.counterId],
            counterMode: s.counterMode
          }, null)])]
        }))
      })
    });
    return m(b("iBizControlBase"), {
      ref: "controlRef",
      controller: this.c,
      class: [this.ns.b(), this.ns.is("more", this.c.state.showMore), this.moreItems.length > 0 ? this.ns.b("more") : ""]
    }, {
      default: () => [n && a && !!t && m(b("el-tabs"), {
        modelValue: t,
        onTabClick: (s, o) => {
          this.handleSelect(s.paneName);
        }
      }, {
        default: () => [this.visibleItems.map((s) => {
          if (s.visible)
            return m(b("el-tab-pane"), {
              label: s.caption,
              name: s.tag
            }, {
              label: () => m("span", {
                class: this.ns.b("pane-label")
              }, [m("span", {
                class: this.ns.be("pane-label", "text")
              }, [s.caption || ""]), s.counterId && this.counterData[s.counterId] != null && m(b("iBizBadge"), {
                class: this.ns.be("pane-label", "counter"),
                value: this.counterData[s.counterId],
                counterMode: s.counterMode
              }, null)])
            });
        }), this.moreItems.length > 0 && m(b("el-tab-pane"), {
          label: "",
          name: e.tag
        }, {
          label: () => i
        })]
      })]
    });
  }
});
class ht {
  constructor() {
    S(this, "component", "IBizDRBarExControl");
  }
}
const ut = J(
  E,
  function(n) {
    n.component(E.name, E), W("CUSTOM_DRBAR_EX", () => new ht());
  }
), vt = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(n) {
    n.use(ut);
  }
};
export {
  nt as DRBarExController,
  ut as IBizDRBarExControl,
  vt as default
};
