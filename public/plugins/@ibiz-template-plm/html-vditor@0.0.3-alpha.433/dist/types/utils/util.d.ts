export declare const getAvatarDownloadUrl: (avatarUrl: string, option: IData) => string | null;
export declare const formatSvg: (svg: string) => string;
/**
 * 返回 'HTML' | 'MD' | 'TEXT'
 * 准确率 90%+，无依赖，适合浏览器/Node
 */
export declare const detectFormat: (str?: string) => string;
export declare const escapeHtml: (str: string) => string;
export declare const unEscapeHtml: (str: string) => string;
