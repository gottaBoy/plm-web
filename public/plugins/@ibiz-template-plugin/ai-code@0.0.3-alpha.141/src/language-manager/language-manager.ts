/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GroovyLanguage,
  TypeScriptLanguage,
  GroovyConfiguration,
} from './language';
import { Monaco } from '../interface';

/**
 * @description 语言管理器
 * @export
 * @class LanguageManager
 */
export class LanguageManager {
  /**
   * @description 主题
   * @type {string}
   * @memberof LanguageManager
   */
  theme: string = 'vs-dark-plus';

  /**
   * Creates an instance of LanguageManager.
   * @param {Monaco} monaco
   * @param {string} language
   * @memberof LanguageManager
   */
  constructor(
    private monaco: Monaco,
    private language: string,
  ) {
    this.registerTheme();
    this.registerByLanguage();
  }

  /**
   * 根据语言类型注册
   *
   * @private
   * @memberof CustomTheme
   */
  private registerByLanguage(): void {
    switch (this.language) {
      case 'typescript':
        this.manageTypeScript();
        break;
      case 'groovy':
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
  private registerTheme(): void {
    this.monaco.editor.defineTheme(this.theme, {
      base: 'vs-dark',
      inherit: true,
      rules: [
        // 对象名（青绿色）
        {
          token: 'support.type.object',
          foreground: '4EC9B0',
        },
        // 方法名（浅黄色，斜体）
        {
          token: 'support.function.method',
          foreground: 'DCDCAA',
          fontStyle: 'italic',
        },
        // 属性名（浅蓝色）
        { token: 'support.property', foreground: '9CDCFE' },
        // 点号（白色）
        { token: 'delimiter.method', foreground: 'D4D4D4' },
        // 方括号（白色）
        { token: 'delimiter.array', foreground: 'D4D4D4' },
      ],
      colors: {},
    });
  }

  /**
   * @description 管理TypeScript
   * @private
   * @memberof LanguageManager
   */
  private manageTypeScript(): void {
    // 语法规则
    this.monaco.languages.setMonarchTokensProvider(
      'typescript',
      TypeScriptLanguage,
    );
  }

  /**
   * @description 管理groovy
   * @private
   * @memberof LanguageManager
   */
  private manageGroovy(): void {
    // 注册
    this.monaco.languages.register({ id: 'groovy' });
    // 语言配置
    this.monaco.languages.setLanguageConfiguration(
      'groovy',
      GroovyConfiguration,
    );
    // 语法规则
    this.monaco.languages.setMonarchTokensProvider('groovy', GroovyLanguage);
  }
}
