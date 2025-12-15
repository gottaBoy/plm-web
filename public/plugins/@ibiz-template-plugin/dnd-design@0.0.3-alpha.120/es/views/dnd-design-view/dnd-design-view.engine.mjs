import { DEMainViewEngine, ViewMode, getControl, SysUIActionTag } from '@ibiz-template/runtime';
import { RuntimeModelError } from '@ibiz-template/core';
import { createUUID } from 'qx-util';
import '../../utils/index.mjs';
import { modelStateUtil } from '../../utils/model-state-util/model-state-util.mjs';

"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class DndDesignViewEngine extends DEMainViewEngine {
  constructor() {
    super(...arguments);
    /**
     * 主数据表单(主要用于主数据加载相关接口模型)
     *
     * @author chitanda
     * @date 2023-11-16 17:11:08
     * @protected
     * @type {IDEEditForm}
     */
    __publicField(this, "form");
    /**
     * 属性区导航占位控制器
     *
     * @author chitanda
     * @date 2023-11-22 12:11:07
     * @protected
     * @type {NavPosController}
     */
    __publicField(this, "navPos");
    /**
     * 主数据表单服务
     *
     * @author chitanda
     * @date 2023-11-16 17:11:13
     * @protected
     * @type {IAppDEService}
     */
    __publicField(this, "service");
    /**
     * 当前激活属性视图
     *
     * @author zhanghengfeng
     * @date 2025-02-27 22:02:01
     * @protected
     * @type {ViewController}
     */
    __publicField(this, "activePropertyView");
    /**
     * 是否正在等待计时器
     *
     * @author zhanghengfeng
     * @date 2025-02-27 22:02:33
     * @protected
     * @type {boolean}
     */
    __publicField(this, "isWait", false);
  }
  /**
   * 获取数据
   *
   * @author zhanghengfeng
   * @date 2025-02-27 22:02:50
   * @return {*}  {IData[]}
   */
  getData() {
    return [this.view.state.data];
  }
  /**
   * 初始化标记打开数据相关逻辑
   *
   * @author zhanghengfeng
   * @date 2025-02-27 22:02:04
   * @protected
   * @return {*}  {void}
   */
  initMarkOpenData() {
    if (!this.coopPos || ![ViewMode.ROUTE, ViewMode.ROUTE_MODAL].includes(this.view.modal.mode)) {
      return;
    }
    this.markModes = [
      "OPENDATA",
      "EDITDATA",
      "DISPLAYOPPERSON",
      "NOTICERELOAD"
    ];
    this.coopPos.initMessageModes(this.markModes);
    this.doActions = [];
    this.doActions.push("EDIT", "VIEW", "UPDATE", "CLOSE");
    this.view.evt.on("onUpdateAccessState", async () => {
      this.sendViewDataAction();
    });
    this.doMarkDataAction();
  }
  /**
   * 发送编辑行为
   *
   * @author zhanghengfeng
   * @date 2025-02-27 22:02:50
   * @protected
   * @return {*}  {void}
   */
  sendEditAction() {
    if (this.isWait) {
      return;
    }
    const data = this.getData()[0];
    if (!data) {
      return;
    }
    this.isWait = true;
    this.sendMarkDataAction("EDIT", data.srfkey);
    setTimeout(
      () => {
        this.isWait = false;
      },
      1e3 * 60 * 5
    );
  }
  /**
   * 执行标记数据行为
   *
   * @author zhanghengfeng
   * @date 2025-02-27 22:02:22
   * @protected
   */
  doMarkDataAction() {
    var _a;
    super.doMarkDataAction();
    if (this.doActions.includes("VIEW")) {
      this.view.evt.on("onMounted", () => this.sendViewDataAction());
    }
    if (this.doActions.includes("EDIT")) {
      const uiDomain = ibiz.uiDomainManager.get(this.view.context.srfsessionid);
      (_a = uiDomain == null ? void 0 : uiDomain.evt) == null ? void 0 : _a.on("stateChange", ({ state, isTrusted }) => {
        if (state && isTrusted) {
          this.sendEditAction();
        }
      });
    }
    if (this.doActions.includes("UPDATE")) {
      this.view.evt.on("onSaveSuccess", () => {
        const data = this.getData()[0];
        if (!data) {
          return;
        }
        this.sendMarkDataAction("UPDATE", data.srfkey);
      });
    }
  }
  /**
   * 刷新
   *
   * @author zhanghengfeng
   * @date 2025-02-27 22:02:10
   * @protected
   * @return {*}  {Promise<void>}
   */
  async refresh() {
    await this.refreshView();
  }
  /**
   * 初始化属性视图
   *
   * @author zhanghengfeng
   * @date 2025-02-27 22:02:44
   * @protected
   */
  initPropertyView() {
    var _a, _b;
    (_b = (_a = this.view.layoutPanel) == null ? void 0 : _a.evt) == null ? void 0 : _b.on("onPresetPanelItemEvent", (event) => {
      if (!event) {
        return;
      }
      const { panelItemEventName, panelItemName, presetParams } = event;
      if (panelItemName === "nav_pos" && panelItemEventName === "onViewCreated" && presetParams) {
        this.activePropertyView = presetParams.view;
      }
    });
  }
  /**
   * 初始化tab导航
   *
   * @author zhanghengfeng
   * @date 2025-02-11 18:02:37
   * @protected
   * @return {*}  {void}
   */
  initNavTab() {
    var _a, _b, _c, _d;
    const parentView = this.view.parentView;
    if (!parentView) {
      return;
    }
    const panelItems = (_a = parentView.layoutPanel) == null ? void 0 : _a.panelItems;
    if (!panelItems || !panelItems.nav_pos_index) {
      return;
    }
    const navPosIndex = panelItems.nav_pos_index;
    if (navPosIndex.navTabs && ((_b = navPosIndex.state) == null ? void 0 : _b.currentKey)) {
      const key = navPosIndex.state.currentKey;
      const viewKey = "".concat(this.view.model.codeName, "-").concat(this.view.id);
      (_d = (_c = navPosIndex.navTabs).updateViewInfo) == null ? void 0 : _d.call(_c, key, {
        viewKey,
        caption: this.view.model.caption,
        sysImage: this.view.model.sysImage
      });
    }
  }
  async onCreated() {
    this.view.model = {
      ...this.view.model,
      showDataInfoBar: true
    };
    await super.onCreated();
    this.initNavTab();
    {
      const form = getControl(this.view.model, "form");
      if (!form) {
        throw new RuntimeModelError(this.view, "\u672A\u627E\u5230\u4E3B\u6570\u636E\u8868\u5355\u6A21\u578B");
      }
      this.form = form;
      const app = ibiz.hub.getApp(this.view.model.appId);
      this.service = await app.deService.getService(
        this.view.context,
        this.form.appDataEntityId
      );
    }
    this.onSelect = this.onSelect.bind(this);
    this.view.select.on(this.onSelect);
    this.view.modal.hooks.shouldDismiss.tapPromise(async (context) => {
      const uiDomain = ibiz.uiDomainManager.get(this.view.context.srfsessionid);
      if ((uiDomain == null ? void 0 : uiDomain.dataModification) === true && context.allowClose == null) {
        const isAllow = await ibiz.confirm.error({
          title: "\u5173\u95ED\u63D0\u9192",
          desc: "\u6570\u636E\u5DF2\u7ECF\u4FEE\u6539\uFF0C\u786E\u5B9A\u8981\u5173\u95ED\uFF1F"
        });
        if (!isAllow) {
          context.allowClose = false;
        } else {
          context.allowClose = true;
        }
      }
    });
    await this.load();
    const data = this.view.state.data;
    if (data && data.psdeid) {
      this.view.context.psdataentity = data.psdeid;
    }
  }
  onSelect(data) {
    this.onActive(data);
  }
  async onMounted() {
    var _a;
    await super.onMounted();
    (_a = this.toolbar) == null ? void 0 : _a.calcButtonState(
      this.view.state.data,
      this.form.appDataEntityId
    );
    this.navPos = this.view.layoutPanel.panelItems.nav_pos;
    this.activeRoot();
    this.initPropertyView();
    this.view.evt.emit("onViewInfoChange", {
      dataInfo: this.view.state.data.srfmajortext || ""
    });
  }
  async onDestroyed() {
    await super.onDestroyed();
    this.view.select.off(this.onSelect);
  }
  /**
   * 激活根节点
   *
   * @author zhanghengfeng
   * @date 2024-12-30 21:12:50
   * @protected
   * @param {boolean} [forceRefresh=false]
   */
  activeRoot(forceRefresh = false) {
    this.view.state.data.forceRefresh = forceRefresh;
    this.view.select.set(this.view.state.data);
  }
  async load(isInitialLoad = true) {
    var _a;
    try {
      this.view.startLoading();
      const action = isInitialLoad ? "get" : "getTemp";
      const res = await this.service[action](
        this.view.context,
        this.view.params
      );
      this.service.local.add(this.view.context, res.data);
      this.view.state.data = res.data;
      this.view.context.mobflag = (_a = res.data) == null ? void 0 : _a.mobflag;
      return res.data;
    } finally {
      this.view.endLoading();
    }
  }
  async save() {
    var _a, _b;
    try {
      this.view.startLoading();
      const data = this.service.local.get(
        this.view.context,
        this.view.state.data.srfkey
      );
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const val = data[key];
          if (typeof val === "object" && val !== null) {
            data[key] = void 0;
          }
        }
      }
      const res = await this.service.update(this.view.context, data);
      this.service.local.add(this.view.context, res.data);
      this.view.state.data = res.data;
      this.view.context.mobflag = (_a = res.data) == null ? void 0 : _a.mobflag;
      ibiz.message.success(
        "".concat(this.view.state.data.srfmajortext || "", "\u4FDD\u5B58\u6210\u529F!")
      );
      await this.view.evt.emit("onSaveSuccess", void 0);
      this.activeRoot();
      this.view.evt.emit("onViewInfoChange", {
        dataInfo: this.view.state.data.srfmajortext || ""
      });
      (_b = this.toolbar) == null ? void 0 : _b.calcButtonState(
        this.view.state.data,
        this.form.appDataEntityId
      );
      return res.data;
    } finally {
      this.view.endLoading();
    }
  }
  async call(key, args) {
    if (key === SysUIActionTag.SAVE) {
      return this.save();
    }
    if (key === "onActive" && args) {
      this.onActive(args);
      return void 0;
    }
    if (key === "onActiveRoot") {
      this.activeRoot();
      return void 0;
    }
    if (key === "Refresh") {
      this.refreshView(args);
      return void 0;
    }
    return super.call(key, args);
  }
  /**
   * 刷新视图
   *
   * @author zhanghengfeng
   * @date 2024-12-30 21:12:35
   * @protected
   * @return {*}  {Promise<void>}
   */
  async refreshView(args) {
    var _a;
    const { ignoreLoad = false } = args || {};
    if (!ignoreLoad) {
      await this.load();
    } else {
      await this.load(false);
    }
    this.activeRoot(true);
    this.view.evt.emit("onRefreshView", void 0);
    this.view.evt.emit("onViewInfoChange", {
      dataInfo: ((_a = this.view.state.data) == null ? void 0 : _a.srfmajortext) || ""
    });
  }
  /**
   * 设置激活数据
   *
   * @description 主要控制右侧属性视图的显示
   * @author chitanda
   * @date 2023-11-22 12:11:36
   * @protected
   * @param {IData} data
   */
  onActive(data) {
    var _a;
    const { forceRefresh } = data;
    delete data.forceRefresh;
    const refs = this.view.model.appViewRefs;
    if (refs) {
      const type = data.srftype ? data.srftype.toUpperCase() : null;
      const ref = refs.find(
        (item) => item.name === "EDITDATA:".concat(data.srfdecodename.toUpperCase()).concat(type ? ":".concat(type) : "")
      );
      if (ref) {
        const context = this.view.context.clone();
        context[data.srfdecodename.toLowerCase()] = data.srfkey;
        delete context.srfrunmode;
        const dndDesignController = (_a = this.view.layoutPanel) == null ? void 0 : _a.panelItems.dnd_design_panel_item;
        const modelState = dndDesignController ? dndDesignController.getModelState(data) : 0;
        if (!modelStateUtil.isEnableUpdate(modelState)) {
          context.srfreadonly = true;
        }
        const navViewMsg = {
          key: forceRefresh ? createUUID() : data.srfkey,
          viewId: ref.refAppViewId,
          context
        };
        const cacheKey = this.navPos.calcCacheKey(navViewMsg);
        if (this.navPos.state.navViewMsgs[cacheKey]) {
          Object.assign(this.navPos.state.navViewMsgs[cacheKey], { context });
        }
        this.navPos.openView(navViewMsg);
      } else {
        throw new RuntimeModelError(
          this.view.model,
          "\u672A\u5339\u914D\u5230\u5BF9\u5E94[".concat(data.srftype, "]\u7684\u5C5E\u6027\u7F16\u8F91\u89C6\u56FE")
        );
      }
    }
  }
}

export { DndDesignViewEngine };
