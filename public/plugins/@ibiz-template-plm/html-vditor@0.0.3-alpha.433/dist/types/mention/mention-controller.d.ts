import { Namespace } from '@ibiz-template/core';
import { IEditor } from '@ibiz/model-core';
import { VditorController } from '../vditor.controller';
/**
 * 用户列表适配器
 *
 * @export
 * @class MenTionController
 * @extends {EditorController}
 */
export declare class MenTionController {
    /**
     *云系统操作者Map
     *
     * @memberof MenTionController
     */
    operatorMap: Map<any, any>;
    /**
     * @description css 命名空间
     * @type {Namespace}
     * @memberof MenTionController
     */
    ns: Namespace;
    /**
     * 模型
     *
     * @type {IEditor}
     * @memberof MenTionController
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
     * @description 编辑器控制器
     * @type {VditorController}
     * @memberof MenTionController
     */
    controller: VditorController;
    /**
     * 用户请求url
     *
     * @type {string}
     * @memberof MenTionController
     */
    userUrl: string;
    /**
     * 人员UI转化
     */
    userFieldMap: IData;
    /**
     * 请求方法
     *
     * @type {('post' | 'get')}
     * @memberof MenTionController
     */
    userMethod: 'post' | 'get';
    /**
     * 编辑器参数
     *
     * @type {IData}
     * @memberof MenTionController
     */
    editorParams: IData | undefined;
    /**
     * 初始化
     *
     * @param {IDomEditor} editor
     * @memberof MenTionController
     */
    init(option: IData): Promise<void>;
    /**
     * @description 绘制完成
     * @memberof MenTionController
     */
    renderAfter(): void;
    /**
     * 获取云系统操作者
     *
     * @memberof MenTionController
     */
    getOperatorUserList(): Promise<void>;
    /**
     * 转换ui数据
     *
     * @param {IData[]} data
     * @return {*}  {IData[]}
     * @memberof MenTionController
     */
    toUIData(data: IData[]): IData[];
    load(args?: IData): Promise<IData>;
    /**
     * 获取用户信息
     *
     * @param {IData} data
     * @return {*}  {Promise<IData[]>}
     * @memberof MenTionController
     */
    getUsers(args?: IData): Promise<IData[]>;
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
}
