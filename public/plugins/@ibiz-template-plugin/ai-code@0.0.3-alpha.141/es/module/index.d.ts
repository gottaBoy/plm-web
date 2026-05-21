import * as IMonaco from 'monaco-editor';
import { IConfig, Monaco } from '../interface';
/**
 * 代码编辑器模块中心
 *
 * @export
 * @class CodeModuleCenter
 */
export declare class CodeModuleCenter {
    private monaco;
    private editor;
    private config;
    /**
     * 模块
     *
     * @private
     * @type {IData[]}
     * @memberof CodeModuleCenter
     */
    private modules;
    /**
     * Creates an instance of CodeModuleCenter.
     * @param {Monaco} monaco
     * @param {IMonaco.editor.IStandaloneCodeEditor} editor
     * @param {IConfig} config
     * @memberof CodeModuleCenter
     */
    constructor(monaco: Monaco, editor: IMonaco.editor.IStandaloneCodeEditor, config: IConfig);
    /**
     * @description 初始化代码编辑器模块
     * @private
     * @memberof CodeModuleCenter
     */
    private initModules;
}
