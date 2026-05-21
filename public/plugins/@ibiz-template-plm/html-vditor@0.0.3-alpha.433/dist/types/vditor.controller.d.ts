import { EditorController, IAppDEService, IInLineAiChatOptions } from '@ibiz-template/runtime';
import { IAppDEACMode, IHtml } from '@ibiz/model-core';
import { Ref } from 'vue';
import { MenTionController } from './mention/mention-controller';
import { MarkerController } from './marker/marker-controller';
export declare class VditorController extends EditorController<IHtml> {
    /**
     * 应用实体服务
     *
     * @type {IAppDEService}
     * @memberof HtmlCommentController
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
     * AI 聊天自填模式
     *
     * @author chitanda
     * @date 2023-10-12 10:10:37
     * @type {boolean}
     */
    chatCompletion: boolean;
    /**
     * 编辑器实例
     */
    vditor: IData;
    /**
     * @description AI行内聊天框高度
     * @type {number}
     * @memberof HtmlCommentController
     */
    inlineAiChatHeight?: number;
    /**
     * @description 提及用户控制器
     * @memberof VditorController
     */
    mentionController: MenTionController;
    /**
     * @description 提及工作项控制器
     * @memberof VditorController
     */
    markerController: MarkerController;
    /**
     * @description 是否硬换行模式
     * @type {boolean}
     * @memberof VditorController
     */
    nodeHardBreak: boolean;
    /**
     * @description 查看模板行为标识
     * @type {string}
     * @memberof VditorController
     */
    templateActionTag: string;
    /**
     * 最大高度
     *
     * @type {number}
     * @memberof VditorController
     */
    maxHeight: number;
    /**
     * 最小高度
     *
     * @type {number}
     * @memberof VditorController
     */
    minHeight: number;
    /**
     *值项
     */
    valueItem: string;
    collapsed: Ref<boolean>;
    /**
     * @description 值格式
     * @type {(string)}
     * @memberof VditorController
     */
    formatType: string;
    /**
     * 用户头像数据
     *
     * @type {string}
     * @memberof VditorController
     */
    userAvatar: string;
    /**
     * 回复
     *
     * @type {string}
     * @memberof HtmlCommentController
     */
    reply: Ref<string>;
    /**
     * 回复脚本
     *
     * @type {string}
     * @memberof HtmlCommentController
     */
    replyScript: string;
    /**
     * 协同编辑key
     *
     * @type {(string | undefined)}
     * @memberof VditorController
     */
    collaborateKey: string | undefined;
    /**
     * 实时编辑（协同编辑）
     */
    enableRealtime: boolean;
    /**
     * @description dom解析器
     * @memberof VditorController
     */
    domParser: DOMParser;
    /**
     * 动态加载脚本
     *
     * @return {*}
     * @memberof SheetUtil
     */
    addScript(url: string): Promise<IData>;
    /**
     * 动态加载样式
     *
     * @return {*}
     * @memberof SheetUtil
     */
    addStyle(url: string): Promise<IData>;
    /**
     * @description 加载Vditor静态资源
     * @returns {*}
     * @memberof VditorController
     */
    loadVditor(): Promise<void>;
    toBoolean(value: string | boolean): boolean;
    protected onInit(): Promise<void>;
    /**
     * @description 初始化插件
     * @returns {*}  {Promise<void>}
     * @memberof VditorController
     */
    initPlugin(): Promise<void>;
    /**
     * @description 绘制完成
     * @memberof VditorController
     */
    renderAfter(): void;
    /**
     * @description vditor 预览模式解析提及用户、提及工作项，用户预览模式切换
     * @param {string} text
     * @returns {*}  {string}
     * @memberof VditorController
     */
    transformHtml(text: string): string;
    /**
     * 获取选中文本
     * @returns 选中文本
     */
    getSelectionText(): string;
    /**
     * 插入文本
     * @param text 文本
     */
    insertText(text: string): void;
    /**
     * 替换选中文本
     * @param text 文本
     */
    replaceSelectionText(text: string): void;
    /**
     * 恢复选区
     */
    restoreSelection(): void;
    /**
     * 获取内联AI编辑器元素
     */
    getInLineAiEditorElement(): Element;
    /**
     * 获取内联AI编辑器主题
     */
    getInLineAiEditorTheme(): 'light' | 'dark';
    /**
     * 获取内联AI参数
     */
    getInLineAiChatOptions(): IInLineAiChatOptions;
    /**
     * 执行内联AIUI操作
     * @param uiActionId
     * @param appId
     */
    doInLineAIUIAction(uiActionId: string, appId: string): Promise<void>;
    /**
     * @description 兼容图片样式
     * @param {string} markdown
     * @returns {*}  {IData}
     * @memberof VditorController
     */
    adaptImageStyle(markdown: string): IData[];
    /**
     * @description md格式图片支持宽度
     * @param {string} html
     * @returns {*}  {string}
     * @memberof VditorController
     */
    transformMDImageWidth(html: string): string;
    /**
     * @description 硬换行解析
     * @memberof VditorController
     */
    handleHardBreak(html: string): string;
    /**
     * @description 转换vditor样式
     * @param {string} html
     * @returns {*}  {IData}
     * @memberof VditorController
     */
    spinVditorStyle(html: string, needTransform?: boolean): IData;
    /**
     * @description ir编辑模式转换dom
     * @param {string} markdown
     * @param {string} value
     * @returns {*}  {string}
     * @memberof VditorController
     */
    spinVditorIRDOM(markdown: string, originSpinVditorIRDOM: Function, text?: boolean): string;
    /**
     * @description md格式转html格式
     * @param {string} html
     * @returns {*}  {string}
     * @memberof VditorController
     */
    VditorIRDOM2HTML(html?: string): string;
    /**
     * @description 打开链接
     * @param {string} url
     * @memberof VditorController
     */
    openUrl(href: string): void;
    /**
     * @description 获取当前用户头像
     *
     * @memberof VditorController
     */
    getCurrentUserAvatar(): Promise<void>;
    /**
     * 清空评论
     *
     * @memberof VditorController
     */
    clear(): void;
    /**
     * 设置回复
     *
     * @param {IData} data
     * @memberof VditorController
     */
    setReply(data: IData): void;
    removeReply(): void;
    /**
     * 设置值
     *
     * @param {string} value
     * @memberof VditorController
     */
    setValue(value: string): Promise<void>;
    toggleCollapse(open?: boolean): void;
    /**
     * 清除数据（无焦点）
     *
     * @memberof VditorController
     */
    clearValue(): void;
}
