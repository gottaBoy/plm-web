import { IAppDEACMode } from '@ibiz/model-core';
export type IAIToolbarItem = {
    appId: string;
    id: string | undefined;
    label: string | undefined;
    title: string | undefined;
    icon: IData;
};
/**
 * 通过Ac计算Ai工具栏
 *
 * @export
 * @param {IAppDEACMode} deACMode
 * @param {IAiUIActionParams} args
 * @return {*}  {{
 *   contentToolbarItems: IData[];
 *   footerToolbarItems: IData[];
 * }}
 */
export declare function calcAiToolbarItemsByAc(deACMode: IAppDEACMode): {
    contentToolbarItems: IAIToolbarItem[];
    footerToolbarItems: IAIToolbarItem[];
    questionToolbarItems: IAIToolbarItem[];
    otherToolbarItems: IAIToolbarItem[];
};
