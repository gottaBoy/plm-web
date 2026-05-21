import { IRaw } from '@ibiz/model-core';
import { CodeListItem, EditorController, IOverlayContainer } from '@ibiz-template/runtime';
/**
 * 直接内容(活动)编辑器控制器
 *
 * @export
 * @class RawActivityEditorController
 * @extends {EditorController}
 */
export declare class RawActivityEditorController extends EditorController<IRaw> {
    /**
     * 模态容器
     *
     * @type {(IOverlayContainer | null)}
     * @memberof RawActivityEditorController
     */
    modal: IOverlayContainer | null;
    /**
     * 编辑器实例
     */
    vditor: IData;
    /**
     * @description 图标代码表标识
     * @type {string}
     * @memberof CommentItemRawItemEditorController
     */
    iconCodeListId: string;
    /**
     * @description 代码表数据
     * @type {readonly}
     * @memberof CommentItemRawItemEditorController
     */
    codeListItems: readonly CodeListItem[];
    /**
     * @description 标识map
     * @type {Map<string, string>}
     * @memberof RawActivityEditorController
     */
    tagMap: Map<string, string>;
    /**
     * @description 动态加载脚本
     * @param {string} url
     * @returns {*}  {Promise<IData>}
     * @memberof RawActivityEditorController
     */
    addScript(url: string): Promise<IData>;
    /**
     * @description 动态加载样式
     * @param {string} url
     * @returns {*}  {Promise<IData>}
     * @memberof RawActivityEditorController
     */
    addStyle(url: string): Promise<IData>;
    loadVditor(): Promise<void>;
    protected onInit(): Promise<void>;
    /**
     * 加载代码表
     *
     * @param {string} appCodeListId
     * @return {*}  {(Promise<readonly CodeListItem[]>)}
     * @memberof CommentItemRawItemEditorController
     */
    loadCodeList(appCodeListId: string): Promise<readonly CodeListItem[]>;
    findCodeListItem(codelist: readonly CodeListItem[] | undefined, value: string | number): CodeListItem | undefined;
    spinVditorStyle(html: string): IData;
    spinVditorAddNode(html: string): IData;
    spinVditorRemoveNode(html: string): IData;
    adaptImageStyle(markdown: string): IData[];
    handleHardBreak(html: string): string;
    /**
     * @description ir编辑模式转换dom
     * @param {string} markdown
     * @param {string} value
     * @returns {*}  {string}
     * @memberof VditorController
     */
    spinVditorIRDOM(markdown: string, originSpinVditorIRDOM: Function): string;
    /**
     * @description 绘制完成
     * @memberof VditorController
     */
    renderAfter(): void;
    /**
     * 打开对照模态
     *
     * @param {{ name: string, newValue: string, oldValue: string }} item
     * @return {*}
     * @memberof RawActivityEditorController
     */
    openContrastModal(item: {
        name: string;
        newValue: string;
        oldValue: string;
    }): Promise<IData[]>;
    transformNode(html: string): string;
    spinMarker(markdown: string): string;
    spinMention(markdown: string): string;
}
