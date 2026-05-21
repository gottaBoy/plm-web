import { EditorController, IInLineAiChatOptions } from '@ibiz-template/runtime';
import { IAppDEACMode, ICode } from '@ibiz/model-core';
import type * as Monaco from 'monaco-editor';
type IMonaco = typeof import('monaco-editor');
/**
 * 代码框编辑器控制器
 *
 * @export
 * @class CodeEditorController
 * @extends {EditorController}
 */
export declare class CodeEditorController extends EditorController<ICode> {
    /**
     * 自填模式
     *
     * @type {IAppDEACMode}
     * @memberof CodeEditorController
     */
    deACMode?: IAppDEACMode;
    /**
     * editor 实例
     *
     * @private
     * @type {Monaco.editor.IStandaloneCodeEditor}
     * @memberof HtmlEditorController
     */
    private editor?;
    /**
     * monaco 实例
     *
     * @private
     * @type {IMonaco}
     * @memberof CodeEditorController
     */
    private monaco?;
    /**
     * editor 当前选区
     *
     * @type {monaco.Selection}
     * @memberof CodeEditorController
     */
    currentSelection?: Monaco.Selection;
    /**
     * AI 聊天自填模式
     *
     * @type {boolean}
     * @memberof CodeEditorController
     */
    chatCompletion: boolean;
    /**
     * 语言类型
     * @author lxm
     * @date 2023-07-21 04:52:16
     * @readonly
     */
    get language(): string;
    /**
     * 主题
     * @author lxm
     * @date 2023-07-21 04:53:37
     * @readonly
     */
    get theme(): string;
    /**
     * @description AI行内聊天框高度
     * @type {number}
     * @memberof CodeEditorController
     */
    inlineAiChatHeight?: number;
    /**
     * @description 隐藏行号
     * @type {boolean}
     * @memberof CodeEditorController
     */
    hideLineNumbers: boolean;
    /**
     * @description 隐藏总览区
     * @type {boolean}
     * @memberof CodeEditorController
     */
    hideMinimap: boolean;
    /**
     * 初始化
     *
     * @protected
     * @return {*}  {Promise<void>}
     * @memberof CodeEditorController
     */
    protected onInit(): Promise<void>;
    /**
     * editor 创建完成
     *
     * @private
     * @param {Monaco.editor.IStandaloneCodeEditor} editor
     */
    onCreated(editor: Monaco.editor.IStandaloneCodeEditor, monaco: IMonaco): void;
    /**
     * 获取选中文本
     * @return {*}  {string} 选中文本
     */
    getSelectionText(): string;
    /**
     * 插入文本
     * @param {string} text 文本
     */
    insertText(text: string): void;
    /**
     * 替换选中文本
     * @param {string} text
     */
    replaceSelectionText(text: string): void;
    /**
     * 恢复选取
     */
    restoreSelection(): void;
    /**
     * 获取内联AI编辑器元素
     */
    getInLineAiEditorElement(): Element;
    /**
     * 获取内联AI编辑器主题
     */
    getInLineAiEditorTheme(): 'light' | 'dark';
    /**
     * 获取内联AI聊天参数
     */
    getInLineAiChatOptions(): IInLineAiChatOptions;
    /**
     * 执行内联AIUI操作
     * @param uiActionId
     * @param appId
     */
    doInLineAIUIAction(uiActionId: string, appId: string): Promise<void>;
}
export {};
