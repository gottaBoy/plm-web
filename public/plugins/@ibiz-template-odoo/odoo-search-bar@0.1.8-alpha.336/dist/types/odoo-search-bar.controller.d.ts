import { ISearchBar } from '@ibiz/model-core';
import { ISearchBarEvent, ISearchCondGroup, ControlController, MDControlController, SearchBarFilterController } from '@ibiz-template/runtime';
import { IGroupItem, IFilterItem, ISearchItem, ICollectItem, SearchItemType, IOdooSearchBarState, IOdooSearchBarController } from './interfaces';
import { OdooSearchBarService } from './odoo-search-bar.service';

/**
 * 搜索栏控制器
 * @export
 * @class OdooSearchBarController
 * @extends {ControlController}
 */
export declare class OdooSearchBarController extends ControlController<ISearchBar, IOdooSearchBarState, ISearchBarEvent> implements IOdooSearchBarController {
    /**
     * @description 快速搜索占位符（根据属性计算出来的快速搜索占位符）
     * @memberof OdooSearchBarController
     */
    placeHolder: string;
    /**
     * @description 搜索栏服务
     * @type {OdooSearchBarService}
     * @memberof OdooSearchBarController
     */
    service: OdooSearchBarService;
    /**
     * @description 过滤项控制器
     * @type {SearchBarFilterController[]}
     * @memberof OdooSearchBarController
     */
    filterControllers: SearchBarFilterController[];
    /**
     * @description schema实体映射map
     * @type {(Map<string, string | undefined>)}
     * @memberof OdooSearchBarController
     */
    schemaEntityMap: Map<string, string | undefined>;
    /**
     * @description 互斥过滤项
     * @type {{ [key: string]: string[] }}
     * @memberof OdooSearchBarController
     */
    exclusive: {
        [key: string]: string[];
    };
    /**
     * @description OR关系组
     * @type {{ [key: string]: string[] }}
     * @memberof OdooSearchBarController
     */
    filterORgroup: {
        [key: string]: string[];
    };
    /**
     * @description 是否有默认选中
     * @memberof OdooSearchBarController
     */
    hasDefaultSelect: boolean;
    /**
     * 数据部件控制器（多数据）
     * @readonly
     * @type {MDControlController}
     */
    get xdataControl(): MDControlController | undefined;
    /**
     * @description 时间格式化
     * @memberof OdooSearchBarController
     */
    dateFormat: {
        label: string;
        value: string;
    }[];
    /**
     * @description 初始化UI状态
     * @protected
     * @memberof OdooSearchBarController
     */
    protected initState(): void;
    /**
     * @description 生命周期-创建完成
     * @protected
     * @returns {*}  {Promise<void>}
     * @memberof OdooSearchBarController
     */
    protected onCreated(): Promise<void>;
    /**
     * @description 通过用户参数初始化过滤配置
     * @private
     * @memberof OdooSearchBarController
     */
    private initFilterByUserParam;
    /**
     * @description 初始化schema实体映射map
     * @private
     * @param {IData} json
     * @returns {*}  {void}
     * @memberof OdooSearchBarController
     */
    private initSchemaEntityMap;
    /**
     * @description 通过JsonSchema初始化过滤项模型
     * @returns {*}  {Promise<void>}
     * @memberof OdooSearchBarController
     */
    initFiltersByJsonSchema(): Promise<void>;
    /**
     * @description 初始化过滤项控制器
     * @returns {*}  {Promise<void>}
     * @memberof OdooSearchBarController
     */
    initSearchBarFilters(): Promise<void>;
    /**
     * @description 初始化搜索栏
     * @returns {*}  {Promise<void>}
     * @memberof OdooSearchBarController
     */
    initSearchBar(): Promise<void>;
    /**
     * @description 根据标识获取指定预置项的搜索分组数据
     * @param {string} id
     * @returns {*}  {ISearchCondGroup[]}
     * @memberof OdooSearchBarController
     */
    getSearchCondsById(id: string): {
        searchconds: ISearchCondGroup[];
        caption: string;
    } | undefined;
    /**
     * 根据类型清空选中数据
     *
     * @param {SearchItemType} item
     * @return {*}  {Promise<void>}
     * @memberof OdooSearchBarController
     */
    onClearSelectedByType(item: ISearchItem): Promise<void>;
    /**
     * @description 根据类型更新数据
     * @param {SearchItemType} type
     * @param {('update' | 'remove')} actionName
     * @param {(IFilterItem | IGroupItem | ICollectItem)} item
     * @returns {*}  {Promise<void>}
     * @memberof OdooSearchBarController
     */
    updateByType(type: SearchItemType, actionName: 'update' | 'remove', item: IFilterItem | IGroupItem | ICollectItem): Promise<void>;
    /**
     * @description 处理过滤值更新
     * @private
     * @param {('update' | 'remove')} actionName
     * @param {IFilterItem} item
     * @returns {*}  {Promise<void>}
     * @memberof OdooSearchBarController
     */
    private handleFilterUpdate;
    /**
     * @description 处理收藏更新
     * @private
     * @param {('update' | 'remove')} actionName
     * @param {ICollectItem} item
     * @returns {*}  {Promise<void>}
     * @memberof OdooSearchBarController
     */
    private handleCollectUpdate;
    /**
     * @description 处理分组更新
     * @private
     * @param {('update' | 'remove')} actionName
     * @param {IGroupItem} item
     * @returns {*}  {Promise<void>}
     * @memberof OdooSearchBarController
     */
    private handleGroupUpdate;
    /**
     * @description 搜索项点击
     * @param {SearchItemType} type 数据类型
     * @param {(IFilterItem | IGroupItem | ICollectItem)} item 数据项
     * @returns {*}  {Promise<void>}
     * @memberof OdooSearchBarController
     */
    onSearchItemClick(type: SearchItemType, item: IFilterItem | IGroupItem | ICollectItem): Promise<void>;
    /**
     * @description 处理过滤点击
     * @private
     * @param {IFilterItem} item
     * @returns {*}  {Promise<void>}
     * @memberof OdooSearchBarController
     */
    private handleFilterClick;
    /**
     * @description 处理分组点击
     * @private
     * @param {IGroupItem} item
     * @memberof OdooSearchBarController
     */
    private handleGroupClick;
    /**
     * @description 执行分组
     * @memberof OdooSearchBarController
     */
    execGroup(): void;
    /**
     * @description 处理收藏点击
     * @private
     * @param {ICollectItem} item
     * @returns {*}  {Promise<void>}
     * @memberof OdooSearchBarController
     */
    private handleCollect;
    /**
     * @description 计算过滤项参数
     * @private
     * @returns {*}  {(ISearchCondGroup[] | undefined)}
     * @memberof OdooSearchBarController
     */
    private calcFilters;
    /**
     * @description 获取搜索栏的过滤参数（包括快速搜索，快速分组和过滤器的参数）
     * @returns {*}  {IParams}
     * @memberof OdooSearchBarController
     */
    getFilterParams(): IParams;
    /**
     * @description 保存
     * @private
     * @returns {*}  {Promise<void>}
     * @memberof OdooSearchBarController
     */
    private save;
    /**
     * @description 搜索
     * @returns {*}  {Promise<void>}
     * @memberof OdooSearchBarController
     */
    onSearch(): Promise<void>;
    /**
     * @description 重置
     * @returns {*}  {Promise<void>}
     * @memberof OdooSearchBarController
     */
    resetFilter(): Promise<void>;
}
