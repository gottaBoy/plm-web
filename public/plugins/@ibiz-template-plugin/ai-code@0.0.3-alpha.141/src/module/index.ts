/* eslint-disable no-shadow */
import * as IMonaco from 'monaco-editor';
import { InlineCompletions } from './inline-completions/inline-completions';
import { IConfig, Monaco } from '../interface';
import { CompletionItem } from './completion-item/completion-item';

/**
 * 代码编辑器模块中心
 *
 * @export
 * @class CodeModuleCenter
 */
export class CodeModuleCenter {
  /**
   * 模块
   *
   * @private
   * @type {IData[]}
   * @memberof CodeModuleCenter
   */
  private modules: IData[] = [];

  /**
   * Creates an instance of CodeModuleCenter.
   * @param {Monaco} monaco
   * @param {IMonaco.editor.IStandaloneCodeEditor} editor
   * @param {IConfig} config
   * @memberof CodeModuleCenter
   */
  constructor(
    private monaco: Monaco,
    private editor: IMonaco.editor.IStandaloneCodeEditor,
    private config: IConfig,
  ) {
    this.initModules();
  }

  /**
   * @description 初始化代码编辑器模块
   * @private
   * @memberof CodeModuleCenter
   */
  private initModules(): void {
    // 添加完成项补全模块
    this.modules.push(
      new CompletionItem(this.monaco, this.editor, this.config),
    );
    if (this.config.enableAICompletion) {
      // 添加内联代码补全模块
      this.modules.push(
        new InlineCompletions(this.monaco, this.editor, this.config),
      );
    }
  }
}
