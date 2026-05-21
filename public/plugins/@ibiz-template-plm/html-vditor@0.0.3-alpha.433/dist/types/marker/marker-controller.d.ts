import { CodeListItem } from '@ibiz-template/runtime';
import { IEditor } from '@ibiz/model-core';
import { Namespace } from '@ibiz-template/core';
import { VditorController } from '../vditor.controller';
/**
 * 用户列表适配器
 *
 * @export
 * @class MarkerController
 * @extends {EditorController}
 */
export declare class MarkerController {
    /**
     * 模型
     *
     * @type {IEditor}
     * @memberof MarkerController
     */
    model: IEditor;
    /**
     * 上下文
     *
     * @type {IContext}
     */
    context: IContext;
    /**
     * 视图参数
     *
     * @type {IParams}
     */
    params: IParams;
    /**
     * @description css 命名空间
     * @type {Namespace}
     * @memberof MenTionController
     */
    ns: Namespace;
    /**
     * @description 编辑器控制器
     * @type {VditorController}
     * @memberof MenTionController
     */
    controller: VditorController;
    /**
     * 引用请求url
     *
     * @type {string}
     * @memberof MarkerController
     */
    quoteUrl: string;
    /**
     * 引用UI转化
     */
    quoteFieldMap: IData;
    /**
     * 代码表map
     *
     * @type {IData}
     * @memberof MarkerController
     */
    quoteCodelistMap: Map<string, IData>;
    /**
     * 请求方法
     *
     * @type {('post' | 'get')}
     * @memberof MarkerController
     */
    quoteMethod: 'post' | 'get';
    /**
     * 请求参数
     *
     * @type {IData}
     * @memberof MarkerController
     */
    quoteParams: IData;
    /**
     * 编辑器参数
     *
     * @type {IData}
     * @memberof MarkerController
     */
    editorParams: IData | undefined;
    /**
     * 用户数据
     *
     * @type {IData[]}
     * @memberof MarkerController
     */
    items: IData[];
    /**
     * @description 提及项链接视图id
     * @type {string}
     * @memberof HtmlCommentController
     */
    linkViewId: string;
    /**
     * @description 代码表对象
     * @type {IData}
     * @memberof MarkerController
     */
    codeListMap: IData;
    /**
     * @description 数据map
     * @type {Map<string, IData>}
     * @memberof MarkerController
     */
    dataMap: Map<string, IData>;
    /**
     * 初始化
     *
     * @param {IDomEditor} editor
     * @memberof MarkerController
     */
    init(option: IData): Promise<void>;
    /**
     * @description 绘制完成
     * @memberof MarkerController
     */
    renderAfter(): void;
    setCodeListMap(items: IData): Promise<void>;
    findCodeListItem(codelist: CodeListItem[] | undefined, value: string | number): CodeListItem | undefined;
    /**
     * 转换ui数据
     *
     * @param {IData[]} data
     * @return {*}  {IData[]}
     * @memberof MarkerController
     */
    toUIData(data: IData[]): IData[];
    /**
     * 获取提及项信息
     *
     * @param {IData} data
     * @return {*}  {Promise<IData[]>}
     * @memberof MarkerController
     */
    load(args?: IData): Promise<IData>;
    /**
     * 加载代码表
     *
     * @param {string} appCodeListId
     * @return {*}  {(Promise<IData | undefined>)}
     * @memberof MarkerController
     */
    loadCodeList(appCodeListId: string): Promise<IData | undefined>;
    /**
     * @description 根据类型获取图标
     * @param {string} type
     * @returns {*}  {string}
     * @memberof MarkerController
     */
    getIconByType(type: string): string;
    /**
     * 获取用户信息
     *
     * @param {IData} data
     * @return {*}  {Promise<IData[]>}
     * @memberof MenTionController
     */
    getMarkers(args?: IData): Promise<IData[]>;
    /**
     * @description ir编辑模式转html
     * @param {string} html
     * @returns {*}  {string}
     * @memberof MarkerController
     */
    VditorIRDOM2HTML(html: string): string;
    /**
     * @description ir编辑模式转换dom
     * @param {string} markdown
     * @returns {*}  {string}
     * @memberof MenTionController
     */
    spinVditorIRDOM(markdown: string): IData;
    /**
     * @description 处理点击事件
     * @param {MouseEvent} event
     * @memberof MarkerController
     */
    handleClick(id: string): void;
    parseCommentTag(data: IData): string;
}
