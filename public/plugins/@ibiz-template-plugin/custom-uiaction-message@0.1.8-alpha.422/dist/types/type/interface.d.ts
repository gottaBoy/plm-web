import { MessageType } from './constant';

export interface IMessageData {
    /**
     * @description 界面行为标识
     * @type {string}
     * @memberof IMessageData
     */
    actionid?: string;
    /**
     * @description 应用标识
     * @type {string}
     * @memberof IMessageData
     */
    appid?: string;
    /**
     * @description 自定义用户提问消息文本
     * @type {string}
     * @memberof IMessageData
     */
    content?: string;
}
export interface IMessageMetaData {
    /**
     * @description 界面显示文本
     * @type {string}
     * @memberof IMessageMetaData
     */
    content_name?: string;
    /**
     * @description 扩展应用上下文参数
     * @type {string}
     * @memberof IMessageMetaData
     */
    action_context?: string;
}
export interface IUIActionMessage {
    /**
     * @description 类型
     * @type {MessageType}
     * @memberof IUIActionMessage
     */
    type: MessageType;
    /**
     * @description 数据
     * @type {string}
     * @memberof IUIActionMessage
     */
    data: IMessageData;
    /**
     * @description 元数据
     * @type {string}
     * @memberof IUIActionMessage
     */
    metadata: IMessageMetaData;
}
export interface IUIAction {
    /**
     * @description 类型
     * @type {('empty' | 'data')}
     * @memberof IUIAction
     */
    type: 'empty' | 'data';
    /**
     * @description 行为标识
     * @type {string}
     * @memberof IUIAction
     */
    value: string;
    /**
     * @description 行为名称
     * @type {string}
     * @memberof IUIAction
     */
    label: string;
}
