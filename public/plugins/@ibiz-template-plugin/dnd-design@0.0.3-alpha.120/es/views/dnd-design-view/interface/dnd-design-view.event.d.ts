import { PartialWithObject } from '@ibiz-template/core';
import { EventBase, IViewEvent } from '@ibiz-template/runtime';
export interface DndDesignViewEvent extends IViewEvent {
    /**
     * 保存成功事件
     *
     * @author zhanghengfeng
     * @date 2024-01-04 18:01:46
     * @type {{
     *     event: EventBase;
     *     emitArgs: undefined;
     *   }}
     */
    onSaveSuccess: {
        event: EventBase;
        emitArgs: undefined;
    };
    /**
     * 素材搜索事件
     *
     * @author zhanghengfeng
     * @date 2024-01-11 19:01:54
     * @type {{
     *     event: EventBase;
     *     emitArgs: PartialWithObject<EventBase, EventBase>;
     *   }}
     */
    onStencilSearch: {
        event: EventBase;
        emitArgs: PartialWithObject<EventBase, EventBase>;
    };
    /**
     * 刷新视图
     *
     * @author zhanghengfeng
     * @date 2024-12-30 21:12:03
     * @type {{
     *     event: EventBase;
     *     emitArgs: undefined;
     *   }}
     */
    onRefreshView: {
        event: EventBase;
        emitArgs: undefined;
    };
    /**
     * 素材添加事件
     *
     * @author zhanghengfeng
     * @date 2025-02-12 22:02:55
     * @type {({
     *     event: EventBase & { stencil: IData };
     *     emitArgs: { stencil: IData };
     *   })}
     */
    onStencilAdd: {
        event: EventBase & {
            stencil: IData;
        };
        emitArgs: {
            stencil: IData;
        };
    };
    /**
     * 预览状态变更事件
     *
     * @author zhanghengfeng
     * @date 2025-02-14 20:02:27
     * @type {({
     *     event: EventBase & { isPreview: boolean };
     *     emitArgs: { isPreview: boolean };
     *   })}
     */
    onPreviewStateChange: {
        event: EventBase & {
            isPreview: boolean;
        };
        emitArgs: {
            isPreview: boolean;
        };
    };
    /**
     * 更新成功
     *
     * @author zhanghengfeng
     * @date 2025-02-27 22:02:28
     * @type {{
     *     event: EventBase;
     *     emitArgs: undefined;
     *   }}
     */
    onUpdateSuccess: {
        event: EventBase;
        emitArgs: undefined;
    };
    /**
     * 删除成功
     *
     * @author zhanghengfeng
     * @date 2025-02-27 22:02:37
     * @type {{
     *     event: EventBase;
     *     emitArgs: undefined;
     *   }}
     */
    onRemoveSuccess: {
        event: EventBase;
        emitArgs: undefined;
    };
    /**
     * 创建成功
     *
     * @author zhanghengfeng
     * @date 2025-02-27 22:02:50
     * @type {{
     *     event: EventBase;
     *     emitArgs: undefined;
     *   }}
     */
    onCreateSuccess: {
        event: EventBase;
        emitArgs: undefined;
    };
    /**
     * 素材更新事件
     *
     * @author zhanghengfeng
     * @date 2025-03-04 21:03:18
     * @type {{
     *     event: EventBase;
     *     emitArgs: undefined;
     *   }}
     */
    onStencilUpdate: {
        event: EventBase;
        emitArgs: undefined;
    };
}
