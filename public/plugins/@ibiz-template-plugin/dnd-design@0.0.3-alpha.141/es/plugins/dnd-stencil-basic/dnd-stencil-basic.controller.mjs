import { getControl } from '@ibiz-template/runtime';
import { RuntimeModelError } from '@ibiz-template/core';
import { DndStencilPanelItemController } from '../../panel-items/dnd-stencil/dnd-stencil.controller.mjs';

"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class DndStencilBasicController extends DndStencilPanelItemController {
  constructor() {
    super(...arguments);
    /**
     * 主表单
     *
     * @author zhanghengfeng
     * @date 2025-03-04 19:03:05
     * @protected
     * @type {IDEEditForm}
     */
    __publicField(this, "majorForm");
    /**
     * 主实体
     *
     * @author zhanghengfeng
     * @date 2025-03-04 19:03:14
     * @protected
     * @type {IAppDataEntity}
     */
    __publicField(this, "majorEntity");
    /**
     * 主服务
     *
     * @author zhanghengfeng
     * @date 2025-03-04 19:03:35
     * @protected
     * @type {IAppDEService}
     */
    __publicField(this, "majorService");
    /**
     * 代码表id
     *
     * @author zhanghengfeng
     * @date 2025-03-04 19:03:14
     * @protected
     * @type {string}
     */
    __publicField(this, "appCodeListId");
    /**
     * 移动端代码表id
     *
     * @author zhanghengfeng
     * @date 2025-03-04 19:03:25
     * @protected
     * @type {string}
     */
    __publicField(this, "mobAppCodeListId");
  }
  /**
   * 初始化
   *
   * @author zhanghengfeng
   * @date 2025-03-04 19:03:53
   * @protected
   * @return {*}  {Promise<void>}
   */
  async onInit() {
    await this.initBaseResource();
    await super.onInit();
    this.onDataUpdate = this.onDataUpdate.bind(this);
    ibiz.mc.command.update.on(this.onDataUpdate);
    this.view.evt.on("onStencilUpdate", async () => {
      await this.load();
    });
    this.view.evt.on("onSaveSuccess", async () => {
      await this.load();
    });
    this.view.evt.on("onRefreshView", async () => {
      await this.load();
    });
  }
  /**
   * 初始化基础资源
   *
   * @author zhanghengfeng
   * @date 2025-03-04 19:03:25
   * @protected
   * @return {*}  {Promise<void>}
   */
  async initBaseResource() {
    const app = ibiz.hub.getApp(this.view.model.appId);
    const majorForm = getControl(this.view.model, "form");
    if (!majorForm) {
      throw new RuntimeModelError(this.view, "\u672A\u627E\u5230 form \u8868\u5355\u6A21\u578B");
    }
    this.majorForm = majorForm;
    this.majorEntity = await ibiz.hub.getAppDataEntity(
      this.majorForm.appDataEntityId,
      this.view.model.appId
    );
    this.majorService = await app.deService.getService(
      this.panel.context,
      this.majorForm.appDataEntityId
    );
    const pages = this.majorForm.deformPages;
    if (!Array.isArray(pages) || !pages.length) {
      return;
    }
    const page = pages[0];
    const formDetails = page.deformDetails;
    if (!Array.isArray(formDetails)) {
      return;
    }
    const formDetail = formDetails.find((item) => item.codeName === "pc");
    const mobFormDetail = formDetails.find((item) => item.codeName === "mob");
    if (!formDetail || !mobFormDetail) {
      return;
    }
    const formEditor = formDetail.editor;
    if (formEditor) {
      this.appCodeListId = formEditor.appCodeListId;
    }
    const mobFormEditor = mobFormDetail.editor;
    if (mobFormEditor) {
      this.mobAppCodeListId = mobFormEditor.appCodeListId;
    }
  }
  /**
   * 监听数据变化
   *
   * @author zhanghengfeng
   * @date 2025-03-04 19:03:28
   * @protected
   * @param {IPortalMessage} msg
   * @return {*}  {Promise<void>}
   */
  async onDataUpdate(msg) {
    var _a;
    if (!msg || !msg.data || typeof msg.data !== "object") {
      return;
    }
    const data = msg.data;
    if (data.srfdecodename === this.majorEntity.codeName && data.srfkey === ((_a = this.view.state.data) == null ? void 0 : _a.srfkey)) {
      const majorResult = await this.majorService.getTemp(
        this.panel.context,
        this.panel.params
      );
      if (!majorResult || !majorResult.ok || !majorResult.data) {
        return;
      }
      if (majorResult.data.mobflag === this.view.context.mobflag) {
        return;
      }
      this.view.context.mobflag = majorResult.data.mobflag;
      this.view.evt.emit("onStencilUpdate", void 0);
    }
  }
  /**
   * 加载数据
   *
   * @author zhanghengfeng
   * @date 2025-03-04 21:03:42
   * @return {*}  {Promise<void>}
   */
  async load() {
    const appCodeListId = this.view.context.mobflag ? this.mobAppCodeListId : this.appCodeListId;
    if (!appCodeListId) {
      throw new RuntimeModelError(this.model, "\u672A\u914D\u7F6E\u7D20\u6750\u533A\u4EE3\u7801\u8868");
    }
    const app = ibiz.hub.getApp(this.model.appId);
    this.codeList = app.codeList.getCodeList(appCodeListId);
    if (!this.codeList) {
      throw new RuntimeModelError(this.model, "\u672A\u914D\u7F6E\u7D20\u6750\u533A\u4EE3\u7801\u8868");
    }
    this.codeItems = this.codeList.codeItems || [];
    const index = this.codeItems.findIndex((item) => {
      if (item.codeItems && item.codeItems.length > 1) {
        return true;
      }
      return false;
    });
    this.enableGroup = index !== -1;
    this.state.items = this.codeItems;
    this.filter();
  }
  /**
   * 销毁方法
   *
   * @author zhanghengfeng
   * @date 2025-03-04 21:03:59
   */
  destroy() {
    super.destroy();
    ibiz.mc.command.update.off(this.onDataUpdate);
  }
}

export { DndStencilBasicController };
