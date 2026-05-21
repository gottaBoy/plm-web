export declare const genUUID: () => string;
export declare const getSearch: (key: string, link?: string) => string;
export declare const looseJsonParse: (text: string) => any;
/**
 * @description 函数防抖
 * @export
 * @param {((...args: unknown[]) => void | Promise<void>)} func 要执行的函数
 * @param {number} wait 延迟时间（毫秒）
 * @param {boolean} [immediate] 是否立即执行
 * @returns {*}  {(...args: unknown[]) => void} 包装后的防抖函数
 */
export declare function debounce(func: (...args: unknown[]) => void | Promise<void>, wait: number, immediate?: boolean): (...args: unknown[]) => void;
/**
 * @description 节流函数，限制函数在指定时间间隔内只能执行一次
 * @export
 * @param {((...args: unknown[]) => void | Promise<void>)} fn 要执行的函数
 * @param {number} wait 节流时间间隔（毫秒）
 * @returns {*}  {(...args: unknown[]) => void} 包装后的节流函数
 */
export declare function throttle(fn: (...args: unknown[]) => void | Promise<void>, wait: number): (...args: unknown[]) => void;
