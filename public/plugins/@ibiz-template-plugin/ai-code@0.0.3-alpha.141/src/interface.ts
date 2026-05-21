import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { IAIToolbarItem } from './util';
import { CodeEditorController } from './code-editor.controller';

export type Monaco = typeof monacoEditor;

/**
 * 配置
 *
 * @export
 * @interface IConfig
 */
export interface IConfig {
  /**
   * 数据
   *
   * @type {IData}
   * @memberof IConfig
   */
  data: IData;
  /**
   * 额外库文件名称
   *
   * @type {string}
   * @memberof IConfig
   */
  libName: string;
  /**
   * @description 是否启用AI补全
   * @type {boolean}
   * @memberof IConfig
   */
  enableAICompletion: boolean;
  /**
   * @description 行内补全模式
   * @type {string}
   * @memberof IConfig
   */
  inlinecompletionmode?: string;
  /**
   * @description 行内补全触发模式
   * @type {('manual' | 'auto' | 'all')}
   * @memberof IConfig
   */
  inlinetriggermode: 'manual' | 'auto' | 'all';
  /**
   * 全局变量映射
   *
   * @type {string}
   * @memberof IConfig
   */
  globalVariable?: string;
  /**
   * @description 设置AI加载状态
   * @memberof IConfig
   */
  setAILoadingState: (state: boolean) => void;
  /**
   * @description 行内补全光标前行数
   * @type {number}
   * @memberof IConfig
   */
  abovelines: number;
  /**
   * @description 行内补全光标后行数
   * @type {number}
   * @memberof IConfig
   */
  belowlines: number;
  /**
   * @description 补全项行为
   * @type {IAIToolbarItem[]}
   * @memberof IConfig
   */
  functionToolbarItems: IAIToolbarItem[];
  /**
   * @description 控制器
   * @type {CodeEditorController}
   * @memberof IConfig
   */
  controller: CodeEditorController;
}
