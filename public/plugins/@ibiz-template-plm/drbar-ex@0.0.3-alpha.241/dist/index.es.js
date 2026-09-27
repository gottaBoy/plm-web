import { registerControlProvider as X, ControlController as J, Srfuf as Q, calcItemVisibleByCounter as O, calcItemVisible as Y, calcNavParams as Z, hasSubRoute as _, CounterService as F } from "@ibiz-template/runtime";
import { withInstall as tt, route2routePath as w, routePath2string as E, useControlController as et, useNamespace as st, getNestedRoutePath as k, onRouteChange as at } from "@ibiz-template/vue3-util";
import { inject as j, defineComponent as ot, ref as N, reactive as rt, onUnmounted as G, watch as V, createVNode as u, resolveComponent as b, computed as it, watchEffect as nt } from "vue";
/*!
  * vue-router v4.2.5
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */
var z;
(function(a) {
  a.pop = "pop", a.push = "push";
})(z || (z = {}));
var L;
(function(a) {
  a.back = "back", a.forward = "forward", a.unknown = "";
})(L || (L = {}));
Symbol(process.env.NODE_ENV !== "production" ? "navigation failure" : "");
var A;
(function(a) {
  a[a.aborted = 4] = "aborted", a[a.cancelled = 8] = "cancelled", a[a.duplicated = 16] = "duplicated";
})(A || (A = {}));
Symbol(process.env.NODE_ENV !== "production" ? "router view location matched" : "");
Symbol(process.env.NODE_ENV !== "production" ? "router view depth" : "");
const lt = Symbol(process.env.NODE_ENV !== "production" ? "router" : ""), ct = Symbol(process.env.NODE_ENV !== "production" ? "route location" : "");
Symbol(process.env.NODE_ENV !== "production" ? "router view location" : "");
function ut() {
  return j(lt);
}
function q() {
  return j(ct);
}
var ht = Object.defineProperty, dt = (a, t, r) => t in a ? ht(a, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : a[t] = r, P = (a, t, r) => (dt(a, typeof t != "symbol" ? t + "" : t, r), r);
class pt extends J {
  constructor() {
    super(...arguments), P(this, "router"), P(this, "storagePrefix", "DR_BAR_SELECTED_ITEM"), P(this, "counter");
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
    return this.getData()[0].srfuf !== Q.UPDATE;
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
    this.router = t;
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
  calcItemStateByCounter(t, r = !0) {
    if (this.state.activated && (this.state.drBarItems.forEach((e) => {
      var o;
      if ((o = e.children) != null && o.length)
        e.children.forEach((s) => {
          const i = O(s, this.counter);
          i !== void 0 && (s.visible = i);
        }), e.visible = e.children.some((s) => s.visible);
      else {
        const s = O(e, this.counter);
        s !== void 0 && (e.visible = s);
      }
    }), this.state.selectedItem && r)) {
      const { visible: e, defaultVisibleItem: o } = this.getItemVisibleState(
        this.state.selectedItem
      );
      !e && o && this.handleSelectChange(o.tag);
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
    let r = !0, e;
    return this.state.drBarItems.forEach((o) => {
      if (o.children) {
        e || (e = o.children.find((i) => i.visible));
        const s = o.children.find((i) => i.tag === t);
        s && (r = !!s.visible);
      } else
        !e && o.visible && (e = o), o.tag === t && (r = !!o.visible);
    }), {
      visible: r,
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
    var r;
    let e = !0;
    const o = (r = this.getData()) != null && r.length ? this.getData()[0] : void 0, s = await Y(
      t,
      this.context,
      this.params,
      this.model.appDataEntityId,
      this.model.appId,
      o
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
        var r;
        (r = t.children) != null && r.length ? (await Promise.all(
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
      var r;
      const e = (r = t.data) == null ? void 0 : r[0];
      this.view.state.srfactiveviewdata = e, e && e.srfreadonly && (this.view.context.srfreadonly = !0), await this.calcDrBarItemsState(), this.doDefaultSelect();
    }) : await this.calcDrBarItemsState(), this.form.state.isLoaded && this.doDefaultSelect();
  }
  /**
   * 初始化关系项数据
   *
   * @memberof DRBarExController
   */
  initDRBarItems() {
    const { dedrctrlItems: t, dedrbarGroups: r } = this.model, e = [];
    r && t && r.forEach((o) => {
      const s = t.filter(
        (i) => i.dedrbarGroupId === o.id
      );
      if (s.length > 0) {
        let i = o.caption;
        o.capLanguageRes && (i = ibiz.i18n.t(
          o.capLanguageRes.lanResTag,
          o.caption
        ));
        const {
          enableMode: n,
          dataAccessAction: h,
          testAppDELogicId: l,
          testScriptCode: v,
          counterId: g,
          counterMode: c
        } = s[0] || {};
        e.push({
          tag: o.id,
          caption: i,
          sysImage: o.sysImage,
          visible: !1,
          enableMode: n,
          dataAccessAction: h,
          testAppDELogicId: l,
          testScriptCode: v,
          counterId: g,
          counterMode: c
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
  handleSelectChange(t, r = !1) {
    var e;
    if (!this.state.drBarItems.find((i) => i.tag === t))
      return;
    const o = (e = this.model.dedrctrlItems) == null ? void 0 : e.find(
      (i) => i.dedrbarGroupId === t
    );
    o ? (this.setVisible("navPos"), this.openNavPosView(o, r)) : (this.setVisible("form"), this.routeDepth && this.router.push(this.state.drBarItems[0].fullPath)), this.state.selectedItem = t, this.state.defaultItem = t;
    const s = this.context.srfuserid;
    if (s) {
      const i = w(this.router.currentRoute.value);
      if (this.routeDepth && i.pathNodes[this.routeDepth - 2]) {
        i.pathNodes = i.pathNodes.slice(0, this.routeDepth - 1);
        const n = E(i).split("/");
        n && n.length && localStorage.setItem(
          "".concat(this.storagePrefix, "_").concat(s, "_").concat(n[n.length - 1]),
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
    var r;
    if (this.state.hideEditItem)
      return;
    const e = (r = this.view.layoutPanel) == null ? void 0 : r.panelItems.view_form;
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
    const { navigateContexts: r, navigateParams: e } = t, o = {
      navContexts: r,
      navParams: e
    }, s = {
      context: this.context,
      params: this.params,
      data: this.getData()[0]
    }, { resultContext: i, resultParams: n } = Z(o, s), h = Object.assign(this.context.clone(), i), l = { ...this.params, ...n };
    return { context: h, params: l };
  }
  /**
   * 打开导航占位视图
   *
   * @param {IDEDRBarItem} drBarItem 关系项
   * @memberof DRBarExController
   */
  async openNavPosView(t, r = !1) {
    var e;
    const { context: o, params: s } = this.prepareParams(t);
    Object.assign(o, {
      srfdefaulttoroutedepth: this.routeDepth + 1
    }), o.currentSrfNav = t.dedrbarGroupId, this.state.srfnav = t.dedrbarGroupId, (e = this.navPos) == null || e.openView({
      key: t.id,
      context: o,
      params: s,
      viewId: t.appViewId,
      isRoutePushed: r
    });
  }
  /**
   * 处理第一次的默认选中
   * @author lxm
   * @date 2023-12-11 05:38:30
   * @return {*}  {void}
   */
  doDefaultSelect() {
    var t;
    if (!this.state.hideEditItem && !this.state.srfnav)
      return;
    if (this.isCreate) {
      this.state.defaultItem = this.model.uniqueTag;
      return;
    }
    const { drBarItems: r } = this.state;
    let e = ((t = r[0].children) == null ? void 0 : t[0].tag) || r[0].tag;
    const o = this.context.srfuserid;
    if (o) {
      const i = w(this.router.currentRoute.value);
      if (this.routeDepth && i.pathNodes[this.routeDepth - 2]) {
        i.pathNodes = i.pathNodes.slice(0, this.routeDepth - 1);
        const n = E(i).split("/");
        if (n && n.length) {
          const h = localStorage.getItem(
            "".concat(this.storagePrefix, "_").concat(o, "_").concat(n[n.length - 1])
          );
          h && (e = h);
        }
      }
    }
    const s = w(this.router.currentRoute.value);
    if (this.routeDepth && s.pathNodes[this.routeDepth - 1]) {
      const i = s.pathNodes[this.routeDepth - 1];
      i && i.srfnav && (e = i.srfnav);
    }
    if (e) {
      if (this.state.selectedItem && this.state.selectedItem === e)
        return;
      const i = !!this.routeDepth && _(this.routeDepth), { visible: n, defaultVisibleItem: h } = this.getItemVisibleState(e);
      !n && h ? (e = h.tag, this.handleSelectChange(e)) : this.handleSelectChange(e, i), this.state.defaultItem = e;
    }
  }
  /**
   * 路由变更处理回调
   * @param {{ srfnav?: string; path: string }} info 当前系统的路由的从一级到最后一级的所有路径。
   */
  async onRouterChange(t) {
    if (this.state.srfnav !== t.srfnav && t.srfnav) {
      this.state.srfnav = t.srfnav;
      const r = !!this.routeDepth && _(this.routeDepth);
      this.handleSelectChange(t.srfnav, r), this.force(() => {
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
    const { appCounterRefs: t } = this.model, r = t == null ? void 0 : t[0];
    if (r) {
      const e = w(this.router.currentRoute.value);
      this.routeDepth && (e.pathNodes = e.pathNodes.slice(0, this.routeDepth - 1));
      const o = E(e);
      this.counter = await F.getCounterByRef(
        r,
        this.context,
        o ? { srfcustomtag: o, ...this.params } : { ...this.params }
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
const S = "ibiz";
function mt(a, t, r) {
  let e = null, o = 0;
  const s = N([]), i = N([]), n = it(() => a.state.drBarItems.find(
    (c) => c.tag === a.state.defaultItem
  )), h = (c, m = {}) => {
    let d = 0;
    const p = document.createElement("div"), f = document.createElement("div");
    return f.innerHTML = c, Object.assign(f.style, m), Object.assign(p.style, {
      width: "auto",
      position: "absolute",
      left: "-9999px"
    }), p.appendChild(f), document.body.appendChild(p), d = p.offsetWidth, document.body.removeChild(p), d;
  }, l = () => {
    const { drBarItems: c, showMore: m, defaultItem: d } = a.state;
    if (!t.value || !m || c.length === 0) {
      s.value = c, i.value = [];
      return;
    }
    let p = !1;
    const f = t.value.$el.offsetWidth;
    let D = 0;
    s.value = [], i.value = [], c.forEach((I, M) => {
      if (I.visible) {
        const T = I.caption || "", C = I.counterId ? r[I.counterId] : null, B = "var(--".concat(S, "-font-size-header-6)");
        if (C != null && !(!C && C !== 0) && !(I.counterMode === 1 && C <= 0)) {
          const $ = {
            marginLeft: "var(--".concat(S, "-spacing-tight)"),
            padding: "0 var(--".concat(S, "-spacing-extra-tight)"),
            minWidth: "20px",
            fontSize: "var(--".concat(S, "-font-size-small)")
          }, H = h(String(C), $);
          D += H;
        }
        const K = h(T, {
          padding: M === 0 ? "0 20px 0 0" : "0 20px",
          fontSize: B
        });
        D += K;
        const U = {
          padding: "0 0 0 20px",
          fontSize: B
        };
        let y = h("^", {
          minWidth: "16px",
          fontSize: B
        });
        y = y > 16 ? y : 16;
        let x = "更多";
        !p && n.value && (x = n.value.caption || x);
        const W = h("".concat(x, " "), U) + y;
        M === c.length - 1 && D < f ? s.value.push(I) : D + W > f ? i.value.push(I) : (s.value.push(I), p || (p = I.tag === d));
      }
    });
  }, v = () => {
    if (window.ResizeObserver) {
      const c = t.value.$el;
      c && (e = new ResizeObserver((m) => {
        const { width: d } = m[0].contentRect;
        d !== o && (l(), o = d);
      }), e.observe(c));
    }
  };
  V(
    () => a.state.drBarItems,
    () => {
      l();
    },
    { deep: !0 }
  ), V(
    () => a.state.defaultItem,
    () => {
      l();
    }
  );
  const g = nt(() => {
    t.value && v();
  });
  return G(() => {
    e && e.disconnect(), g();
  }), { visibleItems: s, moreItems: i };
}
function ft(a) {
  const t = a.view.modal.routeDepth;
  if (t) {
    const r = q();
    let e;
    at(({
      currentKey: o,
      fullPath: s
    }) => {
      if (!e)
        e = o;
      else if (e === o) {
        const i = w(r), {
          srfnav: n
        } = i.pathNodes[t - 1];
        a.onRouterChange({
          srfnav: n || "",
          path: s
        });
      }
    }, t);
  }
}
const R = /* @__PURE__ */ ot({
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
    const a = et((...l) => new pt(...l)), t = st("control-".concat(a.model.controlType.toLowerCase(), "-ex")), r = ut(), e = N(), o = rt({}), {
      visibleItems: s,
      moreItems: i
    } = mt(a, e, o), n = (l) => {
      Object.assign(o, l);
    };
    a.evt.on("onCreated", () => {
      a.counter && a.counter.onChange(n, !0);
    }), G(() => {
      var l;
      (l = a.counter) == null || l.offChange(n);
    }), a.setRouter(r);
    const h = q();
    return ft(a), V(() => r.currentRoute.value, (l, v) => {
      var g, c;
      if (a.routeDepth && a.navPos) {
        const {
          pathNodes: m
        } = w(l), {
          pathNodes: d
        } = w(v), p = k(v, a.routeDepth + 1), f = k(h, a.routeDepth + 1);
        if (p === f)
          return;
        const D = ((g = m[a.routeDepth + 1]) == null ? void 0 : g.viewName) === "route-modal" || ((c = d[a.routeDepth + 1]) == null ? void 0 : c.viewName) === "route-modal";
        f && !D && a.navPos.openView({
          key: f,
          isRoutePushed: !1,
          context: a.context.clone(),
          params: {
            ...a.params
          }
        });
      }
    }), {
      c: a,
      ns: t,
      moreItems: i,
      controlRef: e,
      visibleItems: s,
      counterData: o,
      handleSelect: (l) => {
        var v, g, c;
        if (!a.state.drBarItems.find((d) => d.tag === l))
          return;
        const m = (v = a.model.dedrctrlItems) == null ? void 0 : v.find((d) => d.dedrbarGroupId === l);
        if (m) {
          const d = (g = w(h).pathNodes[a.routeDepth]) == null ? void 0 : g.viewName, p = (c = m.appViewId) == null ? void 0 : c.split(".")[1];
          if (p && d && p === d)
            return;
        }
        a.handleSelectChange(l);
      }
    };
  },
  render() {
    const {
      isCreated: a,
      defaultItem: t,
      isCalculatedPermission: r
    } = this.c.state, e = this.moreItems.find((s) => s.tag === t) || {}, o = u(b("el-dropdown"), {
      trigger: "click",
      class: this.ns.b("more-dropdown"),
      "popper-class": this.ns.b("more-dropdown-popper")
    }, {
      default: () => u("div", {
        class: this.ns.be("more-dropdown", "link"),
        onClick: (s) => s.stopPropagation()
      }, [u("span", null, [e.caption ? "".concat(e.caption, " ") : "更多 "]), u("svg", {
        viewBox: "0 0 16 16",
        xmlns: "http://www.w3.org/2000/svg",
        height: "1em",
        width: "1em"
      }, [u("g", {
        "stroke-width": "1",
        "fill-rule": "evenodd"
      }, [u("path", {
        d: "M7.978 11.997l-.005.006L2.3 6.33l.83-.831 4.848 4.848L12.826 5.5l.83.83-5.673 5.673-.005-.006z"
      }, null)])])]),
      dropdown: () => u(b("el-dropdown-menu"), null, {
        default: () => this.moreItems.map((s) => u(b("el-dropdown-item"), {
          class: [t === s.tag ? this.ns.be("more-dropdown-popper", "current") : ""],
          onClick: () => this.handleSelect(s.tag)
        }, {
          default: () => [u("span", {
            class: [this.ns.be("more-dropdown-popper", "label")]
          }, [u("span", {
            class: this.ns.bem("more-dropdown-popper", "label", "text"),
            title: s.caption || ""
          }, [s.caption || ""]), s.counterId && this.counterData[s.counterId] != null && u(b("iBizBadge"), {
            class: this.ns.bem("more-dropdown-popper", "label", "counter"),
            value: this.counterData[s.counterId],
            counterMode: s.counterMode
          }, null)])]
        }))
      })
    });
    return u(b("iBizControlBase"), {
      ref: "controlRef",
      controller: this.c,
      class: [this.ns.b(), this.ns.is("more", this.c.state.showMore), this.moreItems.length > 0 ? this.ns.b("more") : ""]
    }, {
      default: () => [a && r && !!t && u(b("el-tabs"), {
        modelValue: t,
        onTabClick: (s, i) => {
          this.handleSelect(s.paneName);
        }
      }, {
        default: () => [this.visibleItems.map((s) => {
          if (s.visible)
            return u(b("el-tab-pane"), {
              label: s.caption,
              name: s.tag
            }, {
              label: () => u("span", {
                class: this.ns.b("pane-label")
              }, [u("span", {
                class: this.ns.be("pane-label", "text")
              }, [s.caption || ""]), s.counterId && this.counterData[s.counterId] != null && u(b("iBizBadge"), {
                class: this.ns.be("pane-label", "counter"),
                value: this.counterData[s.counterId],
                counterMode: s.counterMode
              }, null)])
            });
        }), this.moreItems.length > 0 && u(b("el-tab-pane"), {
          label: "",
          name: e.tag
        }, {
          label: () => o
        })]
      })]
    });
  }
});
class vt {
  constructor() {
    P(this, "component", "IBizDRBarExControl");
  }
}
const gt = tt(
  R,
  function(a) {
    a.component(R.name, R), X("CUSTOM_DRBAR_EX", () => new vt());
  }
), Dt = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(a) {
    a.use(gt);
  }
};
export {
  pt as DRBarExController,
  gt as IBizDRBarExControl,
  Dt as default
};
