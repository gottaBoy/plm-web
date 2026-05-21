import { calcResPath, convertNavData } from '@ibiz-template/runtime';
import { createUUID } from 'qx-util';
import { getToken } from '@ibiz-template/core';
import { WorkerManager } from './worker-manager.mjs';

"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class InlineCompletions {
  /**
   * Creates an instance of InlineCompletions.
   * @param {Monaco} monaco
   * @param {IConfig} config
   * @param {monaco.editor.IStandaloneCodeEditor} editor
   * @memberof InlineCompletions
   */
  constructor(monaco, editor, config) {
    this.monaco = monaco;
    this.editor = editor;
    this.config = config;
    /**
     * 是否显示补全提示
     *
     * @private
     * @type {boolean}
     * @memberof InlineCompletions
     */
    __publicField(this, "visible", false);
    /**
     * 唯一标识
     *
     * @private
     * @type {string}
     * @memberof InlineCompletions
     */
    __publicField(this, "UUID", createUUID());
    /**
     * @description worker 管理器
     * @private
     * @type {WorkerManager}
     * @memberof InlineCompletions
     */
    __publicField(this, "workerManager", new WorkerManager());
    /**
     * @description 应用实体模型
     * @private
     * @type {IAppDataEntity}
     * @memberof InlineCompletions
     */
    __publicField(this, "appEntityModel");
    /**
     * @description 历史数据
     * @private
     * @type {IData[]}
     * @memberof InlineCompletions
     */
    __publicField(this, "history", []);
    /**
     * @description 语言
     * @private
     * @type {string}
     * @memberof InlineCompletions
     */
    __publicField(this, "language");
    this.language = this.editor.getModel().getLanguageId();
    this.onInit();
    this.editor.onDidDispose(() => {
      this.workerManager.destroy();
    });
  }
  /**
   * @description 初始化
   * @private
   * @returns {*}  {Promise<void>}
   * @memberof InlineCompletions
   */
  async onInit() {
    const { model, context } = this.config.controller;
    const { appDataEntityId } = model;
    if (!appDataEntityId)
      return;
    this.appEntityModel = await ibiz.hub.getAppDataEntity(
      appDataEntityId,
      context.srfappid
    );
    this.registerInlineCompletions();
    await this.initHistory();
  }
  /**
   * @description 计算AI请求路径
   * @private
   * @param {boolean} [isHistories=false] 是否请求历史数据
   * @returns {*}  {(string | undefined)}
   * @memberof InlineCompletions
   */
  calcAIPath(isHistories = false) {
    const { deACMode, context } = this.config.controller;
    if (!this.appEntityModel || !deACMode)
      return;
    const baseUrl = "".concat(window.location.origin).concat(ibiz.env.baseUrl, "/").concat(ibiz.env.appId);
    const srfkey = context[this.appEntityModel.codeName.toLowerCase()];
    const curPath = "/".concat(this.appEntityModel.deapicodeName2, "/chatcompletion").concat(isHistories ? "/histories" : "").concat(srfkey ? "/".concat(srfkey) : "");
    const resPath = calcResPath(context, this.appEntityModel);
    const path = resPath ? "/".concat(resPath).concat(curPath, "?srfactag=").concat(deACMode.codeName) : "".concat(curPath, "?srfactag=").concat(deACMode.codeName);
    return "".concat(baseUrl).concat(path);
  }
  /**
   * @description 初始化历史
   * @private
   * @memberof InlineCompletions
   */
  async initHistory() {
    const url = this.calcAIPath(true);
    if (!url)
      return void 0;
    const headers = this.getRequestHeaders();
    const { inlinecompletionmode } = this.config;
    const body = JSON.stringify({ mode: inlinecompletionmode });
    const result = await this.workerManager.post({
      url,
      body,
      headers,
      enableAbort: false
    });
    if (result.ok)
      this.history = result.data.filter(
        (item) => ["USER", "ASSISTANT"].includes(item.role)
      );
  }
  /**
   * 注册内联代码补全
   *
   * @private
   * @memberof InlineCompletions
   */
  registerInlineCompletions() {
    this.editor.__inlineCompletionsId = this.UUID;
    let debounceTimer = null;
    const disposable = this.monaco.languages.registerInlineCompletionsProvider(
      this.language,
      {
        provideInlineCompletions: async (model, position, context) => {
          this.visible = false;
          if (!this.validate(model, position, context))
            return { items: [] };
          this.config.setAILoadingState(true);
          if (debounceTimer)
            clearTimeout(debounceTimer);
          return new Promise((resolve) => {
            debounceTimer = window.setTimeout(async () => {
              const completion = await this.getCompletion(model, position);
              this.config.setAILoadingState(false);
              if (!completion) {
                resolve({ items: [] });
              } else {
                this.visible = true;
                resolve({
                  items: [
                    {
                      insertText: completion,
                      range: new this.monaco.Range(
                        position.lineNumber,
                        position.column,
                        position.lineNumber,
                        position.column
                      )
                    }
                  ]
                });
              }
            }, 1e3);
          });
        },
        freeInlineCompletions(_completion) {
        }
      }
    );
    this.editor.addCommand(this.monaco.KeyCode.Tab, async () => {
      if (this.visible) {
        this.editor.trigger(null, "editor.action.inlineSuggest.commit", {});
        this.visible = false;
      } else {
        this.editor.trigger(null, "tab", {});
      }
    });
    this.editor.addCommand(
      this.monaco.KeyMod.Alt | this.monaco.KeyCode.KeyP,
      () => {
        this.editor.trigger(
          "keyboard",
          "editor.action.inlineSuggest.trigger",
          {}
        );
      }
    );
    this.editor.onDidDispose(() => {
      disposable.dispose();
      if (debounceTimer)
        clearTimeout(debounceTimer);
    });
  }
  /**
   * @description 校验是否需要AI补全
   * @private
   * @param {IMonaco.editor.ITextModel} model
   * @returns {*}  {boolean}
   * @memberof InlineCompletions
   */
  validate(model, position, context) {
    const currentEditor = this.monaco.editor.getEditors().find((e) => e.getModel() === model);
    if (!currentEditor || currentEditor.__inlineCompletionsId !== this.UUID)
      return false;
    const { inlinetriggermode } = this.config;
    if (inlinetriggermode === "manual" && context.triggerKind === 0 || inlinetriggermode === "auto" && context.triggerKind === 1)
      return false;
    if (context.triggerKind === 1)
      return true;
    const lineContent = model.getLineContent(position.lineNumber).trim();
    const languageId = model.getLanguageId();
    if (this.isCommentLine(lineContent, languageId))
      return false;
    if (lineContent === "") {
      const prevLineNumber = position.lineNumber - 1;
      if (prevLineNumber >= 1) {
        const prevLineContent = model.getLineContent(prevLineNumber);
        return this.isCommentLine(prevLineContent, languageId);
      }
      return false;
    }
    return true;
  }
  /**
   * @description 校验注释行
   * @private
   * @param {string} lineContent 行内容
   * @param {string} languageId 语言
   * @returns {*}  {boolean}
   * @memberof InlineCompletions
   */
  isCommentLine(lineContent, languageId) {
    const trimmedLine = lineContent.trim();
    switch (languageId) {
      case "javascript":
      case "typescript":
      case "java":
      case "c":
      case "cpp":
      case "csharp":
        return trimmedLine.startsWith("//") || trimmedLine.startsWith("/*") || trimmedLine.startsWith("*") || trimmedLine.endsWith("*/");
      case "python":
      case "ruby":
      case "yaml":
        return trimmedLine.startsWith("#");
      case "html":
      case "xml":
        return trimmedLine.startsWith("<!--") || trimmedLine.endsWith("-->");
      default:
        return trimmedLine.startsWith("//") || trimmedLine.startsWith("/*") || trimmedLine.startsWith("*") || trimmedLine.endsWith("*/");
    }
  }
  /**
   * 获取指定位置前后行数据
   *
   * @private
   * @param {('Above' | 'Below')} type 获取数据类型（上方 | 下方）
   * @param {IMonaco.editor.ITextModel} model 编辑器模型
   * @param {IMonaco.Position} position 光标位置
   * @param {number} count 行数量
   * @return {*}  {string}
   * @memberof InlineCompletions
   */
  getLinesValue(type, model, position, count) {
    const totalLines = model.getLineCount();
    const startLine = type === "Above" ? Math.max(1, position.lineNumber - count) : Math.min(totalLines, position.lineNumber + 1);
    const endLine = type === "Above" ? Math.max(1, position.lineNumber - 1) : Math.min(totalLines, position.lineNumber + count);
    if (type === "Above" ? position.lineNumber === 1 : position.lineNumber === totalLines)
      return "";
    return model.getValueInRange({
      startLineNumber: startLine,
      startColumn: 1,
      endLineNumber: endLine,
      endColumn: model.getLineMaxColumn(endLine)
    });
  }
  /**
   * 计算上下文
   *
   * @param {IMonaco.editor.ITextModel} model
   * @param {IMonaco.Position} position
   * @return {*}  {(ICompletionContext)}
   * @memberof InlineCompletions
   */
  calcContext(model, position) {
    const { abovelines, belowlines } = this.config;
    const line = model.getLineContent(position.lineNumber);
    const token = model.getWordAtPosition(position) || model.getWordUntilPosition(position);
    return {
      line,
      position,
      word: token.word,
      timestamp: Date.now(),
      languageId: model.getLanguageId(),
      above: this.getLinesValue("Above", model, position, abovelines),
      below: this.getLinesValue("Below", model, position, belowlines)
    };
  }
  /**
   * 获取请求头
   *
   * @return {*}  {HeadersInit}
   * @memberof InlineCompletions
   */
  getRequestHeaders() {
    const headers = {
      "Content-Type": "application/json",
      srfsystemid: ibiz.env.dcSystem
    };
    const token = getToken();
    if (token) {
      headers["".concat(ibiz.env.tokenHeader, "Authorization")] = "".concat(ibiz.env.tokenPrefix, "Bearer ").concat(getToken());
    }
    const { orgData } = ibiz;
    if (orgData == null ? void 0 : orgData.systemid)
      headers.srfsystemid = orgData.systemid;
    if (orgData == null ? void 0 : orgData.orgid)
      headers.srforgid = orgData.orgid;
    return headers;
  }
  /**
   * @description 构建AI消息
   * @private
   * @param {ICompletionContext} context
   * @returns {*}  {string}
   * @memberof InlineCompletions
   */
  buildMessages(context) {
    const { line, above, below, languageId, position } = context;
    const { inlinecompletionmode, abovelines, belowlines, controller } = this.config;
    const language = languageId === "typescript" ? "javascript" : languageId;
    const aboveContent = "```".concat(language, " \n ").concat(above, " \n ```");
    const lineContent = "```".concat(language, " \n ").concat(line, " \n ```");
    const belowContent = "```".concat(language, " \n ").concat(below, " \n ```");
    const data = {
      line: position.lineNumber,
      pos: position.column - 1,
      code: this.editor.getValue()
    };
    const param = controller.editorParams.srfappandparam;
    if (param) {
      try {
        const navParams = JSON.parse(param);
        const srfappandparam = convertNavData(
          navParams,
          this.config.data,
          controller.params,
          controller.context
        );
        Object.assign(data, { srfappandparam });
      } catch (error) {
        ibiz.log.error(error);
      }
    }
    return {
      messages: [
        ...this.history,
        {
          data,
          role: "USER",
          content: "\u5F53\u524D\u8BED\u8A00\uFF1A".concat(language, "\uFF0C\u5F53\u524D\u5149\u6807\u6240\u5728\u884C\u4EE3\u7801\uFF1A\n ").concat(lineContent, " \n \u5149\u6807\u524D").concat(abovelines, "\u884C\u7684\u4E0A\u6587\u4EE3\u7801: \n ").concat(aboveContent, " \n \u5149\u6807\u540E").concat(belowlines, "\u884C\u7684\u4E0B\u6587\u4EE3\u7801: \n ").concat(belowContent, " \n \u5149\u6807\u5728\u5F53\u524D\u884C\u7684\u4F4D\u7F6E\uFF1A").concat(position.column - 1, "\uFF0C\u8BF7\u57FA\u4E8E\u4EE5\u4E0A\u4E0A\u4E0B\u6587\uFF0C\u5728\u5149\u6807\u5904\u63D0\u4F9B\u6700\u5408\u9002\u7684\u4EE3\u7801\u8865\u5168\u5EFA\u8BAE\u3002")
        }
      ],
      mode: inlinecompletionmode
    };
  }
  /**
   * 获取补全
   *
   * @private
   * @param {IMonaco.editor.ITextModel} model
   * @param {IMonaco.Position} position
   * @return {*}  {Promise<string>}
   * @memberof InlineCompletions
   */
  async getCompletion(model, position) {
    var _a, _b;
    const context = this.calcContext(model, position);
    const messages = this.buildMessages(context);
    const url = this.calcAIPath();
    if (!url)
      return void 0;
    const headers = this.getRequestHeaders();
    const result = await this.workerManager.post({
      url,
      headers,
      enableAbort: true,
      body: JSON.stringify(messages)
    });
    if (result.ok) {
      const content = (_b = (_a = result.data.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.content;
      return content == null ? void 0 : content.replace(/```[\w]*\n?|```$/g, "");
    }
    return void 0;
  }
}

export { InlineCompletions };
