import { CodeListItem, EditorController } from '@ibiz-template/runtime';
import { ITextBox } from '@ibiz/model-core';

/**
 * @description AI参数控制器
 * @export
 * @class AIParamsController
 * @extends {EditorController<ITextBox>}
 */
export declare class AIParamsController extends EditorController<ITextBox> {
    /**
     * @description AI参数
     * @type {readonly}
     * @memberof AIParamsController
     */
    AIParams: readonly CodeListItem[];
    /**
     * @description 初始化
     * @protected
     * @returns {*}  {Promise<void>}
     * @memberof AIParamsController
     */
    protected onInit(): Promise<void>;
    /**
     * @description 加载代码表
     * @protected
     * @returns {*}  {Promise<void>}
     * @memberof AIParamsController
     */
    protected loadCodeList(): Promise<void>;
}
