import { PanelController, PanelItemController, PanelNotifyState, UIActionButtonState, ViewLayoutPanelController } from '@ibiz-template/runtime';
import { IPanelButton } from '@ibiz/model-core';
import { AIAssistantState } from './ai-assistant-button.state';

/**
 * AI面板按钮控制器
 *
 * @export
 * @class AIAssistantButtonController
 * @extends {PanelItemController<IAIAssistant>}
 */
export declare class AIAssistantButtonController extends PanelItemController<IPanelButton> {
    state: AIAssistantState;
    protected createState(): AIAssistantState;
    /**
     * @description 面板控制器
     * @type {ViewLayoutPanelController}
     * @memberof AIAssistantButtonController
     */
    panel: ViewLayoutPanelController;
    /**
     * @description 父容器数据对象数据
     * @readonly
     * @type {IData}
     * @memberof AIAssistantButtonController
     */
    get data(): IData;
    /**
     * @description 自定义对齐方式
     * @memberof AIAssistantButtonController
     */
    customizedAlign: string;
    /**
     * Creates an instance of AIAssistantButtonController.
     * @param {IPanelButton} model
     * @param {PanelController} panel
     * @param {PanelItemController} [parent]
     * @memberof AIAssistantButtonController
     */
    constructor(model: IPanelButton, panel: PanelController, parent?: PanelItemController);
    /**
     * 初始化
     *
     * @return {*}  {Promise<void>}
     * @memberof AIAssistantButtonController
     */
    onInit(): Promise<void>;
    /**
     * 初始化插件参数
     * @returns
     */
    protected initPluginParams(): Promise<void>;
    /**
     * 创建界面行为状态对象
     *
     * @protected
     * @return {*}  {AIAssistantState}
     * @memberof AIAssistantButtonController
     */
    protected createUIActionState(): UIActionButtonState;
    /**
     * 面板数据变更通知(由面板控制器调用)
     *
     * @param {string[]} names
     * @memberof AIAssistantButtonController
     */
    dataChangeNotify(names: string[]): Promise<void>;
    /**
     * 面板状态变更通知
     *
     * @param {PanelNotifyState} _state
     * @memberof AIAssistantButtonController
     */
    panelStateNotify(_state: PanelNotifyState): Promise<void>;
    /**
     * 更新按钮权限状态
     *
     * @memberof AIAssistantButtonController
     */
    updateButtonState(): Promise<void>;
    /**
     * 行为点击
     * - 在行为参数中传递panelDataParent(面板项数据父容器标识)
     * @param {MouseEvent} event
     * @return {*}  {Promise<void>}
     * @memberof AIAssistantButtonController
     */
    onActionClick(event: MouseEvent): Promise<void>;
    /**
     * @description 计算项显示
     * @param {IData} data
     * @returns {*}  {void}
     * @memberof AIAssistantButtonController
     */
    calcItemVisible(data: IData): void;
    /**
     * @description 计算项启用
     * @param {IData} data
     * @returns {*}  {void}
     * @memberof AIAssistantButtonController
     */
    calcItemDisabled(data: IData): void;
}
