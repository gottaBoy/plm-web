import { InlineCompletions } from './inline-completions/inline-completions.mjs';
import { CompletionItem } from './completion-item/completion-item.mjs';

"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class CodeModuleCenter {
  /**
   * Creates an instance of CodeModuleCenter.
   * @param {Monaco} monaco
   * @param {IMonaco.editor.IStandaloneCodeEditor} editor
   * @param {IConfig} config
   * @memberof CodeModuleCenter
   */
  constructor(monaco, editor, config) {
    this.monaco = monaco;
    this.editor = editor;
    this.config = config;
    /**
     * 模块
     *
     * @private
     * @type {IData[]}
     * @memberof CodeModuleCenter
     */
    __publicField(this, "modules", []);
    this.initModules();
  }
  /**
   * @description 初始化代码编辑器模块
   * @private
   * @memberof CodeModuleCenter
   */
  initModules() {
    this.modules.push(
      new CompletionItem(this.monaco, this.editor, this.config)
    );
    if (this.config.enableAICompletion) {
      this.modules.push(
        new InlineCompletions(this.monaco, this.editor, this.config)
      );
    }
  }
}

export { CodeModuleCenter };
