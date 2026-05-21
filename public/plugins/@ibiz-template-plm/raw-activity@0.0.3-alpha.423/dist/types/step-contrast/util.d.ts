/**
 * 封装字符串比对方法
 *
 * @memberof Util
 */
export declare class Util {
    /**
     * diff-match-patch 实例
     *
     * @memberof Util
     */
    dmp: IParams;
    /**
     * 比对标签的集合
     *
     * @memberof Util
     */
    tagMap: IParams;
    /**
     * unicode初始值
     *
     * @memberof Util
     */
    unicodeRangeStart: number;
    /**
     * 标签集合的长度
     *
     * @memberof Util
     */
    mapLength: number;
    constructor();
    init(): void;
    parseHTML(html: string): HTMLElement;
    isSameNode(a: any, b: any): boolean;
    markInsert(node: any): void;
    markDelete(node: any): void;
    diffChildren(oldParent: any, newParent: any): void;
    diffTextNode(oldNode: any, newNode: any): void;
    diffDOM(oldNode: any, newNode: any): void;
    /**
     * 字符串比对方法
     *
     * @param {string} oldValue 旧值
     * @param {string} newValue 新值
     * @returns {string} 比对结果字符串
     * @memberof Util
     */
    doDiff(oldValue: string, newValue: string): IData;
}
/**
 * 返回 'HTML' | 'MD' | 'TEXT'
 * 准确率 90%+，无依赖，适合浏览器/Node
 */
export declare const detectFormat: (str?: string) => string;
export declare const formatSvg: (svg: string) => string;
export declare const unEscapeHtml: (str: string) => string;
