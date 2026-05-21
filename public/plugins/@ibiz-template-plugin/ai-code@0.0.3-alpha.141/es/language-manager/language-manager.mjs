import './language/index.mjs';
import { TypeScriptLanguage } from './language/typescript.mjs';
import { GroovyConfiguration, GroovyLanguage } from './language/groovy.mjs';

"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class LanguageManager {
  /**
   * Creates an instance of LanguageManager.
   * @param {Monaco} monaco
   * @param {string} language
   * @memberof LanguageManager
   */
  constructor(monaco, language) {
    this.monaco = monaco;
    this.language = language;
    /**
     * @description 主题
     * @type {string}
     * @memberof LanguageManager
     */
    __publicField(this, "theme", "vs-dark-plus");
    this.registerTheme();
    this.registerByLanguage();
  }
  /**
   * 根据语言类型注册
   *
   * @private
   * @memberof CustomTheme
   */
  registerByLanguage() {
    switch (this.language) {
      case "typescript":
        this.manageTypeScript();
        break;
      case "groovy":
        this.manageGroovy();
        break;
      default:
        break;
    }
  }
  /**
   * @description 注册主题
   * @private
   * @memberof LanguageManager
   */
  registerTheme() {
    this.monaco.editor.defineTheme(this.theme, {
      base: "vs-dark",
      inherit: true,
      rules: [
        // 对象名（青绿色）
        {
          token: "support.type.object",
          foreground: "4EC9B0"
        },
        // 方法名（浅黄色，斜体）
        {
          token: "support.function.method",
          foreground: "DCDCAA",
          fontStyle: "italic"
        },
        // 属性名（浅蓝色）
        { token: "support.property", foreground: "9CDCFE" },
        // 点号（白色）
        { token: "delimiter.method", foreground: "D4D4D4" },
        // 方括号（白色）
        { token: "delimiter.array", foreground: "D4D4D4" }
      ],
      colors: {}
    });
  }
  /**
   * @description 管理TypeScript
   * @private
   * @memberof LanguageManager
   */
  manageTypeScript() {
    this.monaco.languages.setMonarchTokensProvider(
      "typescript",
      TypeScriptLanguage
    );
  }
  /**
   * @description 管理groovy
   * @private
   * @memberof LanguageManager
   */
  manageGroovy() {
    this.monaco.languages.register({ id: "groovy" });
    this.monaco.languages.setLanguageConfiguration(
      "groovy",
      GroovyConfiguration
    );
    this.monaco.languages.setMonarchTokensProvider("groovy", GroovyLanguage);
  }
}

export { LanguageManager };
