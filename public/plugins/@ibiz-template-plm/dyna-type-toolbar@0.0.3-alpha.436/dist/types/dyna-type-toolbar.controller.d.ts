import { IDEToolbarItem } from '@ibiz/model-core';
import { ToolbarController } from '@ibiz-template/runtime';
export declare class DynaTypeToolbarController extends ToolbarController {
    /**
     * 初始化工具栏按钮状态对象
     */
    protected initButtonState(): Promise<void>;
    /**
     * 执行按钮的界面行为（如果按钮存在界面行为的话）
     *
     * @protected
     * @param {IDEToolbarItem} item 工具栏项
     * @param {MouseEvent} event 鼠标事件
     * @param {IData} [param] 界面行为参数（界面行为点击自定义按钮可能需要传参数到行为去，标准行为忽略此参数）
     * @return {*}  {Promise<void>}
     * @memberof ToolbarController
     */
    protected doUIAction(item: IDEToolbarItem, event: MouseEvent, param?: IData): Promise<void>;
}
