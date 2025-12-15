import { EditorController, getDeACMode } from '@ibiz-template/runtime';

"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class FormLogicEventScriptEditorController extends EditorController {
  constructor() {
    super(...arguments);
    /**
     * 自填模式
     *
     * @type {IAppDEACMode}
     * @memberof FormLogicEventScriptEditorController
     */
    __publicField(this, "deACMode");
    /**
     * 逻辑服务
     *
     * @type {(IAppDEService | null)}
     * @memberof FormLogicEventScriptEditorController
     */
    __publicField(this, "logicService", null);
    /**
     * 逻辑数据
     *
     * @type {(IData | null)}
     * @memberof FormLogicEventScriptEditorController
     */
    __publicField(this, "logicData", null);
    /**
     * 全局变量
     *
     * @type {string}
     * @memberof FormLogicEventScriptEditorController
     */
    __publicField(this, "globalVariable");
  }
  /**
   * 语言类型
   *
   * @readonly
   * @type {string}
   * @memberof FormLogicEventScriptEditorController
   */
  get language() {
    return "typescript";
  }
  /**
   * 主题
   *
   * @readonly
   * @type {string}
   * @memberof FormLogicEventScriptEditorController
   */
  get theme() {
    return this.editorParams.theme || "vs-dark";
  }
  /**
   * 初始化
   *
   * @protected
   * @return {*}  {Promise<void>}
   * @memberof FormLogicEventScriptEditorController
   */
  async onInit() {
    super.onInit();
    await this.initService();
    await this.loadScriptContent();
    const { appDEACModeId, appDataEntityId, editorParams } = this.model;
    this.globalVariable = editorParams == null ? void 0 : editorParams.GLOBALVARIABLE;
    if (appDEACModeId)
      this.deACMode = await getDeACMode(
        appDEACModeId,
        appDataEntityId,
        this.context.srfappid
      );
  }
  /**
   * 初始化实体服务
   *
   * @protected
   * @return {*}  {Promise<void>}
   * @memberof FormLogicEventScriptEditorController
   */
  async initService() {
    const app = ibiz.hub.getApp(this.context.srfappid);
    const entity = await ibiz.hub.getAppDataEntity(
      "PSDEFDLogic",
      this.context.srfappid
    );
    this.logicService = await app.deService.getService(
      this.context,
      entity.id
    );
  }
  /**
   * 加载脚本内容
   *
   * @return {*}  {(Promise<void>)}
   * @memberof FormLogicEventScriptEditorController
   */
  async loadScriptContent() {
    var _a;
    const result = await ((_a = this.logicService) == null ? void 0 : _a.exec(
      "FetchCurRootItemsByLogicCat",
      this.context,
      {
        logiccat: this.parent.model.userTag
      }
    ));
    if ((result == null ? void 0 : result.ok) && Array.isArray(result.data)) {
      this.logicData = result.data[0];
    }
  }
  /**
   * 保存脚本内容
   *
   * @param {string} scriptCode
   * @return {*}  {Promise<void>}
   * @memberof FormLogicEventScriptEditorController
   */
  async saveScriptContent(scriptCode) {
    var _a, _b;
    const { model, data } = this.parent;
    const item = {
      condvalue: scriptCode,
      logiccat: model.userTag,
      logictype: "SINGLE",
      psdefdlogicid: (_a = this.logicData) == null ? void 0 : _a.srfkey,
      psdeformdetailid: data.psdeformdetailid,
      psdeformdetailname: data.psdeformdetailname
    };
    const result = await ((_b = this.logicService) == null ? void 0 : _b.exec(
      item.psdefdlogicid ? "update" : "create",
      this.context,
      item
    ));
    if ((result == null ? void 0 : result.ok) && result.data) {
      this.logicData = result.data;
    }
  }
}

export { FormLogicEventScriptEditorController };
