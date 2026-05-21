import { DEMainViewEngine, IAppDEService, ViewController } from '@ibiz-template/runtime';
import { IDEEditForm } from '@ibiz/model-core';
import { NavPosController } from '@ibiz-template/vue3-util';
import { DndDesignViewController } from './dnd-design-view.controller';
/**
 * dnd 设计视图引擎
 *
 * @author chitanda
 * @date 2023-11-11 17:11:39
 * @export
 * @class DndDesignViewEngine
 * @extends {ViewEngineBase}
 */
export declare class DndDesignViewEngine extends DEMainViewEngine {
    protected view: DndDesignViewController;
    /**
     * 主数据表单(主要用于主数据加载相关接口模型)
     *
     * @author chitanda
     * @date 2023-11-16 17:11:08
     * @protected
     * @type {IDEEditForm}
     */
    protected form: IDEEditForm;
    /**
     * 属性区导航占位控制器
     *
     * @author chitanda
     * @date 2023-11-22 12:11:07
     * @protected
     * @type {NavPosController}
     */
    protected navPos: NavPosController;
    /**
     * 主数据表单服务
     *
     * @author chitanda
     * @date 2023-11-16 17:11:13
     * @protected
     * @type {IAppDEService}
     */
    protected service: IAppDEService;
    /**
     * 当前激活属性视图
     *
     * @author zhanghengfeng
     * @date 2025-02-27 22:02:01
     * @protected
     * @type {ViewController}
     */
    protected activePropertyView?: ViewController;
    /**
     * 是否正在等待计时器
     *
     * @author zhanghengfeng
     * @date 2025-02-27 22:02:33
     * @protected
     * @type {boolean}
     */
    protected isWait: boolean;
    /**
     * 获取数据
     *
     * @author zhanghengfeng
     * @date 2025-02-27 22:02:50
     * @return {*}  {IData[]}
     */
    getData(): IData[];
    /**
     * 初始化标记打开数据相关逻辑
     *
     * @author zhanghengfeng
     * @date 2025-02-27 22:02:04
     * @protected
     * @return {*}  {void}
     */
    protected initMarkOpenData(): void;
    /**
     * 发送编辑行为
     *
     * @author zhanghengfeng
     * @date 2025-02-27 22:02:50
     * @protected
     * @return {*}  {void}
     */
    protected sendEditAction(): void;
    /**
     * 执行标记数据行为
     *
     * @author zhanghengfeng
     * @date 2025-02-27 22:02:22
     * @protected
     */
    protected doMarkDataAction(): void;
    /**
     * 刷新
     *
     * @author zhanghengfeng
     * @date 2025-02-27 22:02:10
     * @protected
     * @return {*}  {Promise<void>}
     */
    protected refresh(): Promise<void>;
    /**
     * 初始化属性视图
     *
     * @author zhanghengfeng
     * @date 2025-02-27 22:02:44
     * @protected
     */
    protected initPropertyView(): void;
    /**
     * 初始化tab导航
     *
     * @author zhanghengfeng
     * @date 2025-02-11 18:02:37
     * @protected
     * @return {*}  {void}
     */
    protected initNavTab(): void;
    onCreated(): Promise<void>;
    protected onSelect(data: IData | null | undefined): void;
    onMounted(): Promise<void>;
    onDestroyed(): Promise<void>;
    /**
     * 激活根节点
     *
     * @author zhanghengfeng
     * @date 2024-12-30 21:12:50
     * @protected
     * @param {boolean} [forceRefresh=false]
     */
    protected activeRoot(forceRefresh?: boolean): void;
    protected load(isInitialLoad?: boolean): Promise<IData | null>;
    protected save(): Promise<IData | null | undefined>;
    call(key: string, args?: IData): Promise<IData | null | undefined>;
    /**
     * 刷新视图
     *
     * @author zhanghengfeng
     * @date 2024-12-30 21:12:35
     * @protected
     * @return {*}  {Promise<void>}
     */
    protected refreshView(args?: IData): Promise<void>;
    /**
     * 设置激活数据
     *
     * @description 主要控制右侧属性视图的显示
     * @author chitanda
     * @date 2023-11-22 12:11:36
     * @protected
     * @param {IData} data
     */
    protected onActive(data: IData): void;
}
