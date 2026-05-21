/**
 * @description 消息类型
 * @export
 * @enum {number}
 */
export declare enum MessageType {
    /**
     * 界面行为
     */
    ACTION = "action",
    /**
     * 输入建议
     */
    RAW = "raw"
}
/**
 * 消息选择
 */
export declare const MessageSelect: {
    value: MessageType;
    label: string;
}[];
