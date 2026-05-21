import { Node, Shape } from '@antv/x6';
/**
 * @description 备注节点
 * @export
 * @class RemarkNode
 * @extends {Shape.HTML}
 */
export declare class RemarkNode extends Shape.HTML {
    /**
     * @description 输入数量
     * @type {number}
     * @memberof RemarkNode
     */
    inputNum: number;
    /**
     * @description 输出数量
     * @type {number}
     * @memberof RemarkNode
     */
    outputNum: number;
    /**
     * @description 是否为编辑状态
     * @private
     * @type {boolean}
     * @memberof RemarkNode
     */
    private isEditable;
    constructor(metadata?: Node.Metadata);
    /**
     * @description 初始化事件监听
     * @private
     * @memberof RemarkNode
     */
    private setupEvents;
    get markup(): {
        tagName: string;
        selector: string;
        children: {
            ns: string;
            tagName: string;
            className: string;
            selector: string;
            style: {
                width: string;
                height: string;
            };
            children: {
                tagName: string;
                selector: string;
                className: string;
                textContent: any;
                attrs: {
                    id: string;
                };
            }[];
        }[];
    };
    /**
     * @description 保存备注
     * @private
     * @memberof RemarkNode
     */
    private saveMome;
    /**
     * @description 重写移动方法，在编辑状态下禁止移动
     * @param {number} dx
     * @param {number} dy
     * @param {*} [options]
     * @returns {*}
     * @memberof RemarkNode
     */
    translate(dx: number, dy: number, options?: any): this;
    /**
     * @description 设置节点是否可移动
     * @private
     * @param {boolean} editable
     * @memberof RemarkNode
     */
    private setMovable;
    /**
     * @description 监听键盘事件
     * @private
     * @param {KeyboardEvent} e
     * @memberof RemarkNode
     */
    private listerKeyboardEvent;
    /**
     * @description 设置节点编辑状态
     * @private
     * @param {boolean} editable
     * @memberof RemarkNode
     */
    private setNodeEditable;
}
