import * as IMonaco from 'monaco-editor';
import { IConfig, Monaco } from '../../interface';
/**
 * 内联代码补全
 *
 * @export
 * @class InlineCompletions
 */
export declare class InlineCompletions {
    private monaco;
    private editor;
    private config;
    /**
     * 是否显示补全提示
     *
     * @private
     * @type {boolean}
     * @memberof InlineCompletions
     */
    private visible;
    /**
     * 唯一标识
     *
     * @private
     * @type {string}
     * @memberof InlineCompletions
     */
    private UUID;
    /**
     * @description worker 管理器
     * @private
     * @type {WorkerManager}
     * @memberof InlineCompletions
     */
    private workerManager;
    /**
     * @description 应用实体模型
     * @private
     * @type {IAppDataEntity}
     * @memberof InlineCompletions
     */
    private appEntityModel?;
    /**
     * @description 历史数据
     * @private
     * @type {IData[]}
     * @memberof InlineCompletions
     */
    private history;
    /**
     * @description 语言
     * @private
     * @type {string}
     * @memberof InlineCompletions
     */
    private language;
    /**
     * Creates an instance of InlineCompletions.
     * @param {Monaco} monaco
     * @param {IConfig} config
     * @param {monaco.editor.IStandaloneCodeEditor} editor
     * @memberof InlineCompletions
     */
    constructor(monaco: Monaco, editor: IMonaco.editor.IStandaloneCodeEditor, config: IConfig);
    /**
     * @description 初始化
     * @private
     * @returns {*}  {Promise<void>}
     * @memberof InlineCompletions
     */
    private onInit;
    /**
     * @description 计算AI请求路径
     * @private
     * @param {boolean} [isHistories=false] 是否请求历史数据
     * @returns {*}  {(string | undefined)}
     * @memberof InlineCompletions
     */
    private calcAIPath;
    /**
     * @description 初始化历史
     * @private
     * @memberof InlineCompletions
     */
    private initHistory;
    /**
     * 注册内联代码补全
     *
     * @private
     * @memberof InlineCompletions
     */
    private registerInlineCompletions;
    /**
     * @description 校验是否需要AI补全
     * @private
     * @param {IMonaco.editor.ITextModel} model
     * @returns {*}  {boolean}
     * @memberof InlineCompletions
     */
    private validate;
    /**
     * @description 校验注释行
     * @private
     * @param {string} lineContent 行内容
     * @param {string} languageId 语言
     * @returns {*}  {boolean}
     * @memberof InlineCompletions
     */
    private isCommentLine;
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
    private getLinesValue;
    /**
     * 计算上下文
     *
     * @param {IMonaco.editor.ITextModel} model
     * @param {IMonaco.Position} position
     * @return {*}  {(ICompletionContext)}
     * @memberof InlineCompletions
     */
    private calcContext;
    /**
     * 获取请求头
     *
     * @return {*}  {HeadersInit}
     * @memberof InlineCompletions
     */
    getRequestHeaders(): HeadersInit;
    /**
     * @description 构建AI消息
     * @private
     * @param {ICompletionContext} context
     * @returns {*}  {string}
     * @memberof InlineCompletions
     */
    private buildMessages;
    /**
     * 获取补全
     *
     * @private
     * @param {IMonaco.editor.ITextModel} model
     * @param {IMonaco.Position} position
     * @return {*}  {Promise<string>}
     * @memberof InlineCompletions
     */
    private getCompletion;
}
