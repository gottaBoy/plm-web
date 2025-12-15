import { ISearchBar, ISysImage } from '@ibiz/model-core';
import { IControlState, ISearchBarEvent, IViewController, ISearchCondGroup, IApiSearchBarState, IControlController, IApiSearchBarController } from '@ibiz-template/runtime';
import { ISchemaField } from './entity-schema';

export declare enum CondopLabel {
    'OR' = "\u6216",
    'AND' = "\u4E0E"
}
export type SearchItemType = 'filter' | 'collect' | 'group';
export declare const ScriptValueRegex: RegExp;
/** 不需要编辑器的OP */
export declare const ExcludeOPs: readonly string[];
/**
 * 搜索项接口
 *
 * @export
 * @interface ISearchItem
 */
export interface ISearchItem {
    /**
     * @description 标题
     * @type {string}
     * @memberof ISearchItem
     */
    caption: string;
    /**
     * @description 搜索项类型
     * @type {SearchItemType}
     * @memberof ISearchItem
     */
    type: SearchItemType;
    /**
     * @description 图标
     * @type {ISysImage}
     * @memberof ISearchItem
     */
    icon: ISysImage;
    /**
     * @description 过滤条件类型
     * @type {('FILTER' | 'OR' | 'EXCLUSIVE')}
     * @memberof ISearchItem
     */
    filterType?: 'FILTER' | 'OR' | 'EXCLUSIVE';
    /**
     * @description 过滤类型标识
     * @type {string}
     * @memberof ISearchItem
     */
    filterTypeId?: string;
}
/**
 * @description 过滤项接口
 * @export
 * @interface IFilterItem
 */
export interface IFilterItem {
    /**
     * @description 唯一标识
     * @type {string}
     * @memberof IFilterItem
     */
    id: string;
    /**
     * @description 标题
     * @type {string}
     * @memberof IFilterItem
     */
    caption: string;
    /**
     * @description 是否显示分隔栏
     * @type {boolean}
     * @memberof IFilterItem
     */
    showSeparator: boolean;
    /**
     * @description 过滤条件数据
     * @type {ISearchCondGroup}
     * @memberof IFilterItem
     */
    searchconds: ISearchCondGroup[];
    /**
     * @description 是否显示
     * @type {boolean}
     * @memberof IFilterItem
     */
    isShow: boolean;
    /**
     * @description 是否为自定义筛选
     * @type {boolean}
     * @memberof IFilterItem
     */
    isCustom: boolean;
    /**
     * @description 是否发生改变
     * @type {boolean}
     * @memberof IFilterItem
     */
    isChange: boolean;
}
/**
 * 分组项接口
 *
 * @export
 * @interface IGroupItem
 */
export interface IGroupItem {
    /**
     * @description 唯一标识
     * @type {string}
     * @memberof IGroupItem
     */
    id: string;
    /**
     * @description 标题
     * @type {string}
     * @memberof IGroupItem
     */
    caption: string;
    /**
     * @description 分组应用实体属性标识
     * @type {string}
     * @memberof IGroupItem
     */
    appDEFieldId: string;
    /**
     * @description 分组属性类型
     * @type {string}
     * @memberof IGroupItem
     */
    type: string;
    /**
     * @description 是否为自定义分组
     * @type {boolean}
     * @memberof IGroupItem
     */
    isCustom: boolean;
    /**
     * @description 分组代码表标识
     * @type {string}
     * @memberof IGroupItem
     */
    appCodeListId?: string;
    /**
     * @description 日期分组格式
     * @type {string[]}
     * @memberof IGroupItem
     */
    dateFormat?: string[];
    /**
     * @description 是否展开
     * @type {boolean}
     * @memberof IGroupItem
     */
    isExpand?: boolean;
}
/**
 * 收藏项接口
 *
 * @export
 * @interface ICollectItem
 */
export interface ICollectItem {
    /**
     * @description 唯一标识
     * @type {string}
     * @memberof ICollectItem
     */
    id: string;
    /**
     * @description 标题
     * @type {string}
     * @memberof ICollectItem
     */
    caption: string;
    /**
     * @description 收藏的过滤项标识集合
     * @type {string[]}
     * @memberof ICollectItem
     */
    filterIds: string[];
    /**
     * @description 收藏的分组
     * @type {IGroupItem[]}
     * @memberof ICollectItem
     */
    groups: IGroupItem[];
    /**
     * @description 是否为自定义
     * @type {boolean}
     * @memberof ICollectItem
     */
    isCustom: boolean;
}
/**
 * @description 搜索栏状态接口
 * @export
 * @interface IOdooSearchBarState
 * @extends {IControlState}
 * @extends {IApiSearchBarState}
 */
export interface IOdooSearchBarState extends IControlState, IApiSearchBarState {
    /**
     * @description 是否是单项选择
     * @type {boolean}
     * @default true
     * @memberof IOdooSearchBarState
     */
    singleSelect: boolean;
    /**
     * @description 快速搜索值
     * @type {string}
     * @memberof IOdooSearchBarState
     */
    query: string;
    /**
     * @description 过滤数据集
     * @type {IFilterItem[]}
     * @memberof IOdooSearchBarState
     */
    filter: IFilterItem[];
    /**
     * @description 收藏数据集
     * @type {ICollectItem[]}
     * @memberof IOdooSearchBarState
     */
    collect: ICollectItem[];
    /**
     * @description 多数据部件分组
     * @type {IGroupItem[]}
     * @memberof IOdooSearchBarState
     */
    group: IGroupItem[];
    /**
     * @description 选中的过滤数据集
     * @type {IFilterItem[]}
     * @memberof IOdooSearchBarState
     */
    selectedFilter: IFilterItem[];
    /**
     * @description 选中的收藏数据
     * @type {ICollectItem}
     * @memberof IOdooSearchBarState
     */
    selectedCollect?: ICollectItem;
    /**
     * @description 选中的分组数据集
     * @type {IGroupItem[]}
     * @memberof IOdooSearchBarState
     */
    selectedGroup: IGroupItem[];
    /**
     * @description 多选条件
     * @type {('OR' | 'AND')}
     * @memberof IOdooSearchBarState
     */
    condop: 'OR' | 'AND';
    /**
     * @description 新建收藏名称
     * @type {string}
     * @memberof IOdooSearchBarState
     */
    collectName: string;
    /**
     * @description schema属性集合
     * @type {ISchemaField[]}
     * @memberof IOdooSearchBarState
     */
    schemaFields: ISchemaField[];
    /**
     * @description 显示过滤
     * @type {boolean}
     * @memberof IOdooSearchBarState
     */
    showFilter: boolean;
    /**
     * @description 显示分组
     * @type {boolean}
     * @memberof IOdooSearchBarState
     */
    showGroup: boolean;
    /**
     * @description 显示收藏
     * @type {boolean}
     * @memberof IOdooSearchBarState
     */
    showCollect: boolean;
}
/**
 * @description 搜索栏控制器接口
 * @export
 * @interface IOdooSearchBarController
 * @extends {IControlController<ISearchBar, IOdooSearchBarState, ISearchBarEvent>}
 * @extends {IApiSearchBarController<ISearchBar, IOdooSearchBarState>}
 */
export interface IOdooSearchBarController extends IControlController<ISearchBar, IOdooSearchBarState, ISearchBarEvent>, IApiSearchBarController<ISearchBar, IOdooSearchBarState> {
    /**
     * @description 视图控制器
     * @type {IViewController}
     * @memberof IOdooSearchBarController
     */
    view: IViewController;
}
