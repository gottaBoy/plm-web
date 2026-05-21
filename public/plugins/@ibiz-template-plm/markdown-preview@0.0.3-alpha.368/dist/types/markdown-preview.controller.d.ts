import { CodeListItem, EditorController, IAppDEService, IInLineAIEditor, IInLineAiChatOptions } from '@ibiz-template/runtime';
import { IAppDEACMode, IDEACModeDataItem, IMarkdown } from '@ibiz/model-core';
/**
 * MarkDown编辑器控制器
 *
 * @export
 * @class MarkDownPreviewController
 * @extends {EditorController}
 */
export declare class MarkDownPreviewController extends EditorController<IMarkdown> implements IInLineAIEditor {
    /**
     * 上传参数
     */
    uploadParams?: IParams;
    /**
     * 下载参数
     */
    exportParams?: IParams;
    /**
     * 应用实体服务
     *
     * @author chitanda
     * @date 2023-10-12 14:10:41
     * @type {IAppDEService}
     */
    deService?: IAppDEService;
    /**
     * 自填模式
     *
     * @author chitanda
     * @date 2023-10-12 10:10:52
     * @type {IAppDEACMode}
     */
    deACMode?: IAppDEACMode;
    /**
     * 自填模式对应主键属性名称
     *
     * @author chitanda
     * @date 2023-10-12 10:10:58
     * @type {string}
     */
    keyName: string;
    /**
     * 自填模式对应主文本属性名称
     *
     * @author chitanda
     * @date 2023-10-12 10:10:02
     * @type {string}
     */
    textName: string;
    /**
     * 自填模式排序模式，默认升序
     *
     * @author chitanda
     * @date 2023-10-12 10:10:29
     * @type {string}
     */
    sort: string;
    /**
     * 自填数据项集合（已排除了value和text)
     *
     * @author chitanda
     * @date 2023-10-12 10:10:23
     * @type {IDEACModeDataItem[]}
     */
    dataItems: IDEACModeDataItem[];
    /**
     * AI 聊天自填模式
     *
     * @author chitanda
     * @date 2023-10-12 10:10:37
     * @type {boolean}
     */
    chatCompletion: boolean;
    /**
     * 编辑器实例
     *
     * @type {IData}
     * @memberof MarkDownPreviewController
     */
    mdeditor: IData | null;
    /**
     * 选区位置缓存
     *
     * @type {(IData | null)}
     * @memberof MarkDownPreviewController
     */
    selectionAreaPosition: IData | null;
    /**
     * 选区方向  true表示正向，从左到右；false表示反向，从右到左
     *
     * @type {boolean}
     * @memberof MarkDownPreviewController
     */
    selectionDirection: boolean;
    /**
     * 当前编辑器使用主题
     *
     * @type {string}
     * @memberof MarkDownPreviewController
     */
    currentEditorTheme: string;
    /**
     * AI行内聊天框高度
     *
     * @type {number}
     * @memberof MarkDownPreviewController
     */
    inlineAiChatHeight?: number;
    /**
     * @description 链接视图id
     * @type {string}
     * @memberof RawEditorController
     */
    linkViewId: string;
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
    /**
     * 设置编辑器实例
     *
     * @param {IData} mdeditor
     * @memberof MarkDownPreviewController
     */
    setMDEditor(mdeditor: IData): void;
    /**
     * 设置保存当前选区位置
     *
     * @param {IData} start
     * @param {IData} end
     * @memberof MarkDownPreviewController
     */
    setCursorPos(start: IData, end: IData): void;
    /**
     * 设置当前编辑器的主题
     *
     * @param {string} theme
     * @memberof MarkDownPreviewController
     */
    setCurrentEditorTheme(theme: string): void;
    /**
     * 设置当前选区方向
     *
     * @param {boolean} direction
     * @memberof MarkDownPreviewController
     */
    setSelectionDirection(direction: boolean): void;
    /**
     * 获取当前主题
     *
     * @return {*}  {('light' | 'dark')}
     * @memberof MarkDownPreviewController
     */
    getCurrentTheme(): 'light' | 'dark';
    /**
     * 获取选中文本
     *
     * @return {*}  {string}
     * @memberof MarkDownPreviewController
     */
    getSelectionText(): string;
    /**
     * 获取内联AI编辑器主题
     *
     * @return {*}  {('light' | 'dark')}
     * @memberof MarkDownPreviewController
     */
    getInLineAiEditorTheme(): 'light' | 'dark';
    /**
     * 判断选区方向
     *
     * @param {IData} posA
     * @param {IData} posB
     * @return {*}  {boolean}
     * @memberof MarkDownPreviewController
     */
    isPositionBefore(posA: IData, posB: IData): boolean;
    /**
     * 插入文本
     *
     * @param {string} text
     * @memberof MarkDownPreviewController
     */
    insertText(text: string): void;
    /**
     * 替换选中文本
     *
     * @param {string} text
     * @memberof MarkDownPreviewController
     */
    replaceSelectionText(text: string): void;
    /**
     * 恢复选区
     *
     * @memberof MarkDownPreviewController
     */
    restoreSelection(): void;
    /**
     * 获取内联AI参数
     *
     * @return {*}  {IData}
     * @memberof MarkDownPreviewController
     */
    getInLineAiChatOptions(): IInLineAiChatOptions;
    /**
     * 返回内联AI编辑器元素
     *
     * @return {*}  {Element}
     * @memberof MarkDownPreviewController
     */
    getInLineAiEditorElement(): Element;
    /**
     *  执行内联AIUI操作
     *
     * @param {string} _uiAction
     * @param {string} _appId
     * @return {*}  {Promise<void>}
     * @memberof MarkDownPreviewController
     */
    doInLineAIUIAction(uiActionId: string, appId: string): Promise<void>;
    parseCommentTag(data: IData): string;
    /**
     * @description 转换markdown
     * @param {string} markdown
     * @returns {*}  {string}
     * @memberof MarkDownPreviewController
     */
    transformMarkdown(markdown: string): string;
    handleClick(e: MouseEvent): void;
}
