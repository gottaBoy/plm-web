/* eslint-disable no-useless-escape */
/* eslint-disable no-bitwise */
import { calcResPath, convertNavData } from '@ibiz-template/runtime';
import * as IMonaco from 'monaco-editor';
import { createUUID } from 'qx-util';
import { getToken } from '@ibiz-template/core';
import { IAppDataEntity } from '@ibiz/model-core';
import { IConfig, Monaco } from '../../interface';
import { WorkerManager } from './worker-manager';

interface ICompletionContext {
  /**
   * 单词
   *
   * @type {string}
   * @memberof ICompletionContext
   */
  word: string;
  /**
   * 语言标识
   *
   * @type {string}
   * @memberof ICompletionContext
   */
  languageId: string;
  /**
   * 时间戳
   *
   * @type {number}
   * @memberof ICompletionContext
   */
  timestamp: number;
  /**
   * 位置
   *
   * @type {IMonaco.Position}
   * @memberof ICompletionContext
   */
  position: IMonaco.Position;
  /**
   * 当前行
   *
   * @type {string}
   * @memberof ICompletionContext
   */
  line: string;
  /**
   * 当前行上方数据
   *
   * @type {string}
   * @memberof ICompletionContext
   */
  above: string;
  /**
   * 当前行下方数据
   *
   * @type {string}
   * @memberof ICompletionContext
   */
  below: string;
}

/**
 * 内联代码补全
 *
 * @export
 * @class InlineCompletions
 */
export class InlineCompletions {
  /**
   * 是否显示补全提示
   *
   * @private
   * @type {boolean}
   * @memberof InlineCompletions
   */
  private visible: boolean = false;

  /**
   * 唯一标识
   *
   * @private
   * @type {string}
   * @memberof InlineCompletions
   */
  private UUID: string = createUUID();

  /**
   * @description worker 管理器
   * @private
   * @type {WorkerManager}
   * @memberof InlineCompletions
   */
  private workerManager: WorkerManager = new WorkerManager();

  /**
   * @description 应用实体模型
   * @private
   * @type {IAppDataEntity}
   * @memberof InlineCompletions
   */
  private appEntityModel?: IAppDataEntity;

  /**
   * @description 历史数据
   * @private
   * @type {IData[]}
   * @memberof InlineCompletions
   */
  private history: IData[] = [];

  /**
   * @description 语言
   * @private
   * @type {string}
   * @memberof InlineCompletions
   */
  private language: string;

  /**
   * Creates an instance of InlineCompletions.
   * @param {Monaco} monaco
   * @param {IConfig} config
   * @param {monaco.editor.IStandaloneCodeEditor} editor
   * @memberof InlineCompletions
   */
  constructor(
    private monaco: Monaco,
    private editor: IMonaco.editor.IStandaloneCodeEditor,
    private config: IConfig,
  ) {
    this.language = this.editor.getModel()!.getLanguageId();
    this.onInit();
    // 编辑器销毁时销毁worker
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
  private async onInit(): Promise<void> {
    const { model, context } = this.config.controller;
    const { appDataEntityId } = model;
    if (!appDataEntityId) return;
    this.appEntityModel = await ibiz.hub.getAppDataEntity(
      appDataEntityId,
      context.srfappid,
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
  private calcAIPath(isHistories: boolean = false): string | undefined {
    const { deACMode, context } = this.config.controller;
    if (!this.appEntityModel || !deACMode) return;
    const baseUrl = `${window.location.origin}${ibiz.env.baseUrl}/${ibiz.env.appId}`;
    const srfkey = context[this.appEntityModel.codeName!.toLowerCase()];
    const curPath = `/${this.appEntityModel.deapicodeName2}/chatcompletion${
      isHistories ? '/histories' : ''
    }${srfkey ? `/${srfkey}` : ''}`;
    const resPath = calcResPath(context, this.appEntityModel);
    const path = resPath
      ? `/${resPath}${curPath}?srfactag=${deACMode.codeName}`
      : `${curPath}?srfactag=${deACMode.codeName}`;
    return `${baseUrl}${path}`;
  }

  /**
   * @description 初始化历史
   * @private
   * @memberof InlineCompletions
   */
  private async initHistory(): Promise<void> {
    const url = this.calcAIPath(true);
    if (!url) return undefined;
    const headers = this.getRequestHeaders();
    const { inlinecompletionmode } = this.config;
    const body = JSON.stringify({ mode: inlinecompletionmode });
    const result = await this.workerManager.post({
      url,
      body,
      headers,
      enableAbort: false,
    });
    if (result.ok)
      this.history = result.data.filter(item =>
        ['USER', 'ASSISTANT'].includes(item.role),
      );
  }

  /**
   * 注册内联代码补全
   *
   * @private
   * @memberof InlineCompletions
   */
  private registerInlineCompletions(): void {
    (this.editor as IData).__inlineCompletionsId = this.UUID;
    // 添加防抖计时器
    let debounceTimer: number | null = null;
    const disposable = this.monaco.languages.registerInlineCompletionsProvider(
      this.language,
      {
        provideInlineCompletions: async (model, position, context) => {
          this.visible = false;
          // 校验
          if (!this.validate(model, position, context)) return { items: [] };
          this.config.setAILoadingState(true);

          // 清除之前的计时器
          if (debounceTimer) clearTimeout(debounceTimer);

          // 使用防抖
          return new Promise(resolve => {
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
                        position.column,
                      ),
                    },
                  ],
                });
              }
            }, 1000);
          });
        },
        freeInlineCompletions(_completion) {},
      },
    );

    // Tab键处理
    this.editor.addCommand(this.monaco.KeyCode.Tab, async () => {
      // 如果当前显示行内代码补全则自动补全
      if (this.visible) {
        this.editor.trigger(null, 'editor.action.inlineSuggest.commit', {});
        this.visible = false;
      } else {
        // 否则执行默认tab
        this.editor.trigger(null, 'tab', {});
      }
    });

    // Alt + P 触发代码补全
    this.editor.addCommand(
      this.monaco.KeyMod.Alt | this.monaco.KeyCode.KeyP,
      () => {
        this.editor.trigger(
          'keyboard',
          'editor.action.inlineSuggest.trigger',
          {},
        );
      },
    );

    // 编辑器销毁时清理资源
    this.editor.onDidDispose(() => {
      disposable.dispose();
      if (debounceTimer) clearTimeout(debounceTimer);
    });
  }

  /**
   * @description 校验是否需要AI补全
   * @private
   * @param {IMonaco.editor.ITextModel} model
   * @returns {*}  {boolean}
   * @memberof InlineCompletions
   */
  private validate(
    model: IMonaco.editor.ITextModel,
    position: IMonaco.Position,
    context: IMonaco.languages.InlineCompletionContext,
  ): boolean {
    const currentEditor = this.monaco.editor
      .getEditors()
      .find(e => e.getModel() === model);

    if (
      !currentEditor ||
      (currentEditor as IData).__inlineCompletionsId !== this.UUID
    )
      return false;
    const { inlinetriggermode } = this.config;
    // 仅手动触发时拦截自动触发；仅自动触发时拦截手动触发
    if (
      (inlinetriggermode === 'manual' && context.triggerKind === 0) ||
      (inlinetriggermode === 'auto' && context.triggerKind === 1)
    )
      return false;
    // 手动触发的不需要校验
    if (context.triggerKind === 1) return true;
    const lineContent = model.getLineContent(position.lineNumber).trim();
    const languageId = model.getLanguageId();
    // 校验注释行
    if (this.isCommentLine(lineContent, languageId)) return false;
    // 校验空白行
    if (lineContent === '') {
      const prevLineNumber = position.lineNumber - 1;
      if (prevLineNumber >= 1) {
        const prevLineContent = model.getLineContent(prevLineNumber);
        // 空白行上方为注释行才可补全
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
  private isCommentLine(lineContent: string, languageId: string): boolean {
    const trimmedLine = lineContent.trim();
    // 根据配置的语言来判断注释格式
    switch (languageId) {
      case 'javascript':
      case 'typescript':
      case 'java':
      case 'c':
      case 'cpp':
      case 'csharp':
        return (
          trimmedLine.startsWith('//') ||
          trimmedLine.startsWith('/*') ||
          trimmedLine.startsWith('*') ||
          trimmedLine.endsWith('*/')
        );

      case 'python':
      case 'ruby':
      case 'yaml':
        return trimmedLine.startsWith('#');

      case 'html':
      case 'xml':
        return trimmedLine.startsWith('<!--') || trimmedLine.endsWith('-->');

      default:
        // 默认使用 JavaScript 风格的注释判断
        return (
          trimmedLine.startsWith('//') ||
          trimmedLine.startsWith('/*') ||
          trimmedLine.startsWith('*') ||
          trimmedLine.endsWith('*/')
        );
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
  private getLinesValue(
    type: 'Above' | 'Below',
    model: IMonaco.editor.ITextModel,
    position: IMonaco.Position,
    count: number,
  ): string {
    const totalLines = model.getLineCount();
    const startLine =
      type === 'Above'
        ? Math.max(1, position.lineNumber - count)
        : Math.min(totalLines, position.lineNumber + 1);
    const endLine =
      type === 'Above'
        ? Math.max(1, position.lineNumber - 1)
        : Math.min(totalLines, position.lineNumber + count);
    // 没有前一行或者没有后一行时返回空
    if (
      type === 'Above'
        ? position.lineNumber === 1
        : position.lineNumber === totalLines
    )
      return '';
    return model.getValueInRange({
      startLineNumber: startLine,
      startColumn: 1,
      endLineNumber: endLine,
      endColumn: model.getLineMaxColumn(endLine),
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
  private calcContext(
    model: IMonaco.editor.ITextModel,
    position: IMonaco.Position,
  ): ICompletionContext {
    const { abovelines, belowlines } = this.config;
    const line = model.getLineContent(position.lineNumber);
    const token =
      model.getWordAtPosition(position) || model.getWordUntilPosition(position);
    return {
      line,
      position,
      word: token.word,
      timestamp: Date.now(),
      languageId: model.getLanguageId(),
      above: this.getLinesValue('Above', model, position, abovelines),
      below: this.getLinesValue('Below', model, position, belowlines),
    };
  }

  /**
   * 获取请求头
   *
   * @return {*}  {HeadersInit}
   * @memberof InlineCompletions
   */
  getRequestHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      srfsystemid: ibiz.env.dcSystem,
    };
    const token = getToken();
    if (token) {
      headers[`${ibiz.env.tokenHeader}Authorization`] = `${
        ibiz.env.tokenPrefix
      }Bearer ${getToken()}`;
    }
    const { orgData } = ibiz;
    if (orgData?.systemid) headers.srfsystemid = orgData.systemid;
    if (orgData?.orgid) headers.srforgid = orgData.orgid;
    return headers;
  }

  /**
   * @description 构建AI消息
   * @private
   * @param {ICompletionContext} context
   * @returns {*}  {string}
   * @memberof InlineCompletions
   */
  private buildMessages(context: ICompletionContext): IData {
    const { line, above, below, languageId, position } = context;
    const { inlinecompletionmode, abovelines, belowlines, controller } =
      this.config;
    const language = languageId === 'typescript' ? 'javascript' : languageId;
    const aboveContent = `\`\`\`${language} \n ${above} \n \`\`\``;
    const lineContent = `\`\`\`${language} \n ${line} \n \`\`\``;
    const belowContent = `\`\`\`${language} \n ${below} \n \`\`\``;
    const data = {
      line: position.lineNumber,
      pos: position.column - 1,
      code: this.editor.getValue(),
    };
    const param = controller.editorParams.srfappandparam;
    if (param) {
      try {
        const navParams = JSON.parse(param);
        const srfappandparam = convertNavData(
          navParams,
          this.config.data,
          controller.params,
          controller.context,
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
          role: 'USER',
          content: `当前语言：${language}，当前光标所在行代码：\n ${lineContent} \n 光标前${abovelines}行的上文代码: \n ${aboveContent} \n 光标后${belowlines}行的下文代码: \n ${belowContent} \n 光标在当前行的位置：${
            position.column - 1
          }，请基于以上上下文，在光标处提供最合适的代码补全建议。`,
        },
      ],
      mode: inlinecompletionmode,
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
  private async getCompletion(
    model: IMonaco.editor.ITextModel,
    position: IMonaco.Position,
  ): Promise<string | undefined> {
    const context = this.calcContext(model, position);
    const messages = this.buildMessages(context);
    const url = this.calcAIPath();
    if (!url) return undefined;
    const headers = this.getRequestHeaders();
    const result = await this.workerManager.post({
      url,
      headers,
      enableAbort: true,
      body: JSON.stringify(messages),
    });
    if (result.ok) {
      const content = result.data.choices?.[0]?.content;
      // 替换代码块标记
      return content?.replace(/```[\w]*\n?|```$/g, '');
    }
    return undefined;
  }
}
