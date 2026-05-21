import { Monaco } from '../interface';
/**
 * @description 语言管理器
 * @export
 * @class LanguageManager
 */
export declare class LanguageManager {
    private monaco;
    private language;
    /**
     * @description 主题
     * @type {string}
     * @memberof LanguageManager
     */
    theme: string;
    /**
     * Creates an instance of LanguageManager.
     * @param {Monaco} monaco
     * @param {string} language
     * @memberof LanguageManager
     */
    constructor(monaco: Monaco, language: string);
    /**
     * 根据语言类型注册
     *
     * @private
     * @memberof CustomTheme
     */
    private registerByLanguage;
    /**
     * @description 注册主题
     * @private
     * @memberof LanguageManager
     */
    private registerTheme;
    /**
     * @description 管理TypeScript
     * @private
     * @memberof LanguageManager
     */
    private manageTypeScript;
    /**
     * @description 管理groovy
     * @private
     * @memberof LanguageManager
     */
    private manageGroovy;
}
