import { IAppDEUIAction } from '@ibiz/model-core';
import { IChatMessage } from '@ibiz-template/core';
import { IAiChatParam, IUIActionResult, IUILogicParams, UIActionProviderBase } from '@ibiz-template/runtime';

export declare class AIAssistantUIActionProvider extends UIActionProviderBase {
    /**
     * 界面行为执行入口，处理公共逻辑
     * @param {IAppDEUIAction} action
     * @param {IUILogicParams} params
     * @return {*}  {Promise<IUIActionResult>}
     */
    exec(action: IAppDEUIAction, args: IUILogicParams): Promise<IUIActionResult>;
    /**
     * 执行具体界面行为
     * @param action
     * @param args
     * @returns
     */
    execAction(action: IAppDEUIAction, args: IUILogicParams): Promise<IUIActionResult>;
    /**
     * 根据 value 查找 key
     * @param map
     * @param value
     * @returns
     */
    private getKeyByValueFromMap;
    /**
     * 打开AI聊天框
     *
     * @protected
     * @param {IAppDEUIAction} action
     * @param {IUILogicParams} args
     * @return {*}  {Promise<IUIActionResult>}
     * @memberof AIAssistantUIActionProvider
     */
    protected openAiChat(action: IAppDEUIAction, args: IUILogicParams): Promise<IUIActionResult>;
    /**
     * 打开AI聊天
     *
     * @param {IAiChatParam} chartParams
     * @return {*}  {Promise<IChatMessage[]>}
     * @memberof AppUtil
     */
    openAiChatContainer(chartParams: IAiChatParam): Promise<IChatMessage[]>;
}
