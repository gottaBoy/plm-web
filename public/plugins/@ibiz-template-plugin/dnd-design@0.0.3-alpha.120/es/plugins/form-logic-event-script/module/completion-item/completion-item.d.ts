import * as IMonaco from 'monaco-editor';
import { IConfig, Monaco } from '../interface';
/**
 * 完成项补全
 *
 * @export
 * @class CompletionItem
 */
export declare class CompletionItem {
    private monaco;
    private editor;
    private config;
    /**
     * Creates an instance of CompletionItem.
     * @param {Monaco} monaco
     * @param {IMonaco.editor.IStandaloneCodeEditor} editor
     * @param {IConfig} config
     * @memberof CompletionItem
     */
    constructor(monaco: Monaco, editor: IMonaco.editor.IStandaloneCodeEditor, config: IConfig);
    /**
     * 根据语言类型注册
     *
     * @private
     * @return {*}  {Promise<void>}
     * @memberof CompletionItem
     */
    private registerByLanguage;
    /**
     * 注册TypeScript完成项补全提示
     * - 通过额外库添加
     * @private
     * @return {*}  {Promise<void>}
     * @memberof CompletionItem
     */
    private registerTypeScript;
    /**
     * 获取TypeScript当前全局变量
     *
     * @private
     * @return {*}  {string}
     * @memberof CompletionItem
     */
    private getTypeScriptVariable;
}
