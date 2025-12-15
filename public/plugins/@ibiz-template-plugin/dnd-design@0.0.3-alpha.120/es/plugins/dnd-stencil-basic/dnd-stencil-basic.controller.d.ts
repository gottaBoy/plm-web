import { IAppDataEntity, IDEEditForm } from '@ibiz/model-core';
import { IAppDEService } from '@ibiz-template/runtime';
import { IPortalMessage } from '@ibiz-template/core';
import { DndStencilPanelItemController } from '../../panel-items/dnd-stencil/dnd-stencil.controller';
export declare class DndStencilBasicController extends DndStencilPanelItemController {
    /**
     * 主表单
     *
     * @author zhanghengfeng
     * @date 2025-03-04 19:03:05
     * @protected
     * @type {IDEEditForm}
     */
    protected majorForm: IDEEditForm;
    /**
     * 主实体
     *
     * @author zhanghengfeng
     * @date 2025-03-04 19:03:14
     * @protected
     * @type {IAppDataEntity}
     */
    protected majorEntity: IAppDataEntity;
    /**
     * 主服务
     *
     * @author zhanghengfeng
     * @date 2025-03-04 19:03:35
     * @protected
     * @type {IAppDEService}
     */
    protected majorService: IAppDEService;
    /**
     * 代码表id
     *
     * @author zhanghengfeng
     * @date 2025-03-04 19:03:14
     * @protected
     * @type {string}
     */
    protected appCodeListId?: string;
    /**
     * 移动端代码表id
     *
     * @author zhanghengfeng
     * @date 2025-03-04 19:03:25
     * @protected
     * @type {string}
     */
    protected mobAppCodeListId?: string;
    /**
     * 初始化
     *
     * @author zhanghengfeng
     * @date 2025-03-04 19:03:53
     * @protected
     * @return {*}  {Promise<void>}
     */
    protected onInit(): Promise<void>;
    /**
     * 初始化基础资源
     *
     * @author zhanghengfeng
     * @date 2025-03-04 19:03:25
     * @protected
     * @return {*}  {Promise<void>}
     */
    protected initBaseResource(): Promise<void>;
    /**
     * 监听数据变化
     *
     * @author zhanghengfeng
     * @date 2025-03-04 19:03:28
     * @protected
     * @param {IPortalMessage} msg
     * @return {*}  {Promise<void>}
     */
    protected onDataUpdate(msg: IPortalMessage): Promise<void>;
    /**
     * 加载数据
     *
     * @author zhanghengfeng
     * @date 2025-03-04 21:03:42
     * @return {*}  {Promise<void>}
     */
    load(): Promise<void>;
    /**
     * 销毁方法
     *
     * @author zhanghengfeng
     * @date 2025-03-04 21:03:59
     */
    destroy(): void;
}
