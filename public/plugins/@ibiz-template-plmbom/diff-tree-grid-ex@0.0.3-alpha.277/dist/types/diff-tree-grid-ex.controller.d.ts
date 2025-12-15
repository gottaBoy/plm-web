import { IDETreeGridEx } from '@ibiz/model-core';
import { ITreeGridExEvent, ITreeGridExState, ITreeNodeData, TreeGridExController } from '@ibiz-template/runtime';
/**
 * 比对树表格增强树节点数据格式
 * @export
 * @interface IDiffTreeGridExNodeData
 * @extends {ITreeNodeData}
 */
export interface IDiffTreeGridExNodeData extends ITreeNodeData {
    /** 是否新建 */
    _isCreated: boolean;
    /** 是否更新 */
    _isUpdate: boolean;
}
/**
 * 比对树表格增强部件状态
 * @interface IDiffTreeGridExState
 * @extends {ITreeGridExState}
 */
interface IDiffTreeGridExState extends ITreeGridExState {
    /** 其它树表格增强关联节点数据 */
    otherRelRows?: {
        [key: string]: {
            [key: string]: IDiffTreeGridExNodeData;
        };
    };
}
/**
 * 比对树表格（增强）部件控制器
 *
 * @export
 * @class DiffTreeGridExController
 * @extends {TreeGridExController<T, S, E>}
 */
export declare class DiffTreeGridExController<T extends IDETreeGridEx = IDETreeGridEx, S extends IDiffTreeGridExState = IDiffTreeGridExState, E extends ITreeGridExEvent = ITreeGridExEvent> extends TreeGridExController<T, S, E> {
    /**
     * 其它树表格关联节点标识集合，该参数有值代表当前为差异表
     *
     * @type {string[]}
     * @memberof DiffTreeGridExController
     */
    otherRelIds?: string[];
    /**
     * 当前是否为差异表
     *
     * @type {boolean}
     * @memberof DiffTreeGridExController
     */
    isDifference: boolean;
    /**
     * 与差异表的关联标识，有值为普通表
     *
     * @type {string}
     * @memberof DiffTreeGridExController
     */
    diffRelId: string;
    /**
     * 差异数据，由差异表通知过来
     *
     * @type {IDiffTreeGridExNodeData[]}
     * @memberof DiffTreeGridExController
     */
    differenceData: IDiffTreeGridExNodeData[];
    /**
     * 差异表关联的树表格数据，由差异表通知过来
     *
     * @type {IData}
     * @memberof DiffTreeGridExController
     */
    diffRows?: IData;
    /**
     * 差异表选择数据，由差异表通知过来
     *
     * @type {IData}
     * @memberof DiffTreeGridExController
     */
    _diffSelectData: IData;
    get diffSelectData(): IData | void;
    protected initState(): void;
    protected onCreated(): Promise<void>;
    protected onMounted(): Promise<void>;
    setSelection(selection: IDiffTreeGridExNodeData[]): void;
    /**
     * loadNodes加载完子数据之后的处理
     * @param {IDiffTreeGridExNodeData[]} nodes 加载回来的子数据
     * @return {*}  {Promise<void>}
     */
    afterLoadNodes(nodes: IDiffTreeGridExNodeData[]): Promise<void>;
    /**
     * 处理差异树表格显示
     *
     * @memberof DiffTreeGridExController
     */
    handleDiffTreeGrid(): void;
    /**
     * 处理通用表格差异比对显示
     *
     * @return {*}  {void}
     * @memberof DiffTreeGridExController
     */
    handleCommonTreeGrid(): void;
    /**
     * 更新UI
     *
     * @memberof DiffTreeGridExController
     */
    updateUI(): void;
    /**
     * 关闭差异
     *
     * @return {*}  {Promise<void>}
     * @memberof DiffTreeGridExController
     */
    closeDiff(): Promise<void>;
    /**
     * 开启差异
     *
     * @return {*}  {Promise<void>}
     * @memberof DiffTreeGridExController
     */
    openDiff(): Promise<void>;
}
export {};
