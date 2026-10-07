import { registerControlProvider as h, ExpBarControlController as u } from "@ibiz-template/runtime";
import { RuntimeModelError as f, RuntimeError as p } from "@ibiz-template/core";
import { notNilEmpty as c } from "qx-util";
var v = Object.defineProperty, x = (n, t, e) => t in n ? v(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e, l = (n, t, e) => (x(n, typeof t != "symbol" ? t + "" : t, e), e);
class m extends u {
  constructor() {
    super(...arguments), l(this, "defaultExpandedKeys"), l(this, "defaultExpand"), l(this, "navStack", []), l(this, "navKeyName", "_id"), l(this, "navNodeModelIds", []);
  }
  get xDataController() {
    const t = this.view.getController(this.model.xdataControlName);
    if (!t)
      throw new f(
        this.model,
        "无法获取多数据部件[".concat(this.model.xdataControlName, "]控制器")
      );
    return t;
  }
  /**
   * 组件挂载
   *
   * @protected
   * @return {*}  {Promise<void>}
   * @memberof DefaultExpandTreeExpBarController
   */
  async onMounted() {
    super.onMounted(), this.xDataController && this.xDataController.evt.on("onAfterRefreshParent", (t) => {
      this.navDataByStack();
    });
  }
  /**
   * 根据栈数据导航数据
   *
   * @memberof DefaultExpandTreeExpBarController
   */
  navDataByStack() {
    const { items: t } = this.xDataController.state, e = this.navStack.find(
      (a) => t.find((o) => a[this.navKeyName] === o[this.navKeyName])
    );
    if (e) {
      const a = t.find(
        (o) => e[this.navKeyName] === o[this.navKeyName]
      );
      this.xDataController.setActive(a), this.xDataController.setSelection([a]);
    } else {
      const a = t.find((o) => !this.xDataController.model.rootVisible && this.xDataController.state.rootNodes.includes(o) ? !1 : this.defaultExpand ? o._id === this.defaultExpand : this.state.noNeedNavView ? !0 : this.navNodeModelIds.includes(o._nodeId));
      a ? (this.xDataController.setActive(a), this.xDataController.setSelection([a])) : (this.navStack = [], this.xDataController.setSelection([]), this.state.srfnav = "", this._evt.emit("onNavViewChange", {
        navViewMsg: {
          key: "",
          isCache: this.isCache
        }
      }));
    }
  }
  /**
   * 获取指定节点模型
   *
   * @param {string} nodeId
   * @return {*}  {(IDETreeNode | undefined)}
   * @memberof TreeExpBarController
   */
  getNodeModel(t) {
    const { detreeNodes: e } = this.XDataModel;
    let a;
    return e && e.forEach((o) => {
      o.id === t && (a = o);
    }), a;
  }
  /**
   * 多数据激活
   *
   * @author zk
   * @date 2023-05-29 03:05:36
   * @memberof ExpBarControlController
   */
  xDataActive(t) {
    const { nodeData: e } = t;
    super.xDataActive({ ...t, data: [e] });
  }
  /**
   *  获取导航视图
   *
   * @author zk
   * @date 2023-06-29 03:06:41
   * @param {IDETabViewPanel} tabViewPanel
   * @return {*}  {Promise<INavViewMsg>}
   * @memberof TabExpPanelController
   */
  getNavViewMsg(t, e, a) {
    const o = t._id, i = t._deData || t, s = this.getNodeModel(t._nodeId);
    if (!s)
      throw new p("找不到".concat(t._nodeId, "的节点模型"));
    const r = this.prepareParams(s, i, e, a);
    return r.context.currentSrfNav = o, this.state.srfnav = o, {
      key: o,
      viewId: s.navAppViewId,
      isCache: this.isCache,
      ...r
    };
  }
  navByFirstItem() {
    const t = this.xDataController.state.items.find((e) => !this.xDataController.model.rootVisible && this.xDataController.state.rootNodes.includes(e) ? !1 : this.defaultExpand ? e._id === this.defaultExpand : this.state.noNeedNavView ? !0 : this.navNodeModelIds.includes(e._nodeId));
    t && (this.xDataController.setActive(t), this.xDataController.setSelection([t]));
  }
  async onCreated() {
    var t, e;
    if (await super.onCreated(), (e = (t = this.model.controlParam) == null ? void 0 : t.ctrlParams) != null && e.DEFAULT_EXPAND) {
      const o = this.model.controlParam.ctrlParams.DEFAULT_EXPAND;
      this.defaultExpand = this.stringFill(o, this.context, this.params);
    }
    const { detreeNodes: a } = this.XDataModel;
    a == null || a.forEach((o) => {
      o.navAppViewId && this.navNodeModelIds.push(o.id);
    }), this.defaultExpand && (this.defaultExpandedKeys = this.calcExpandKeys(this.defaultExpand, !1)), this.state.srfnav && (this.defaultExpandedKeys = this.calcExpandKeys(this.state.srfnav));
  }
  calcExpandKeys(t, e = !0) {
    const a = [];
    return t.split(":").forEach((o, i) => {
      i === 0 ? a.push(o) : a.push("".concat(a[i - 1], ":").concat(o));
    }), e && a.pop(), a;
  }
  async onRouterChange(t) {
    if (this.state.srfnav !== t.srfnav) {
      const e = this.calcExpandKeys(t.srfnav);
      await this.xDataController.expandNodeByKey(e);
    }
    await super.onRouterChange(t);
  }
  /**
   * 是否显示部件头部
   * @author lxm
   * @date 2023-08-02 07:54:18
   * @protected
   * @return {*}  {boolean}
   */
  calcControlHeaderVisible() {
    const t = !!this.toolbarController;
    if (!t && this.layoutPanel) {
      const e = this.layoutPanel.panelItems.control_toolbar;
      e && (e.state.visible = !1);
    }
    return t || !!(this.model.showTitleBar && this.model.title);
  }
  /**
   * 填充字符串
   *
   * @protected
   * @param {string} str
   * @param {IContext} [context]
   * @param {IParams} [param]
   * @return {*}  {string}
   * @memberof DefaultExpandTreeExpBarController
   */
  stringFill(t, e, a) {
    const o = /\$\{context.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g, i = /\$\{param.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g;
    if (c(t)) {
      if (c(e)) {
        const s = t.match(o);
        s == null || s.forEach((r) => {
          const d = r.slice(10, r.length - 1);
          t = t.replace("${context.".concat(d, "}"), e[d] || "");
        });
      }
      if (c(a)) {
        const s = t.match(i);
        s == null || s.forEach((r) => {
          const d = r.slice(8, r.length - 1);
          t = t.replace("${param.".concat(d, "}"), a[d] || "");
        });
      }
    }
    return t;
  }
}
class C {
  constructor() {
    l(this, "component", "IBizTreeExpBarControl");
  }
  createController(t, e, a, o) {
    return new m(t, e, a, o);
  }
}
const E = () => {
  h(
    "CUSTOM_TREEEXPBAR_DEFAULT_EXPAND",
    () => new C()
  );
}, _ = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars
  install(n) {
    E();
  }
};
export {
  _ as default,
  E as register
};
