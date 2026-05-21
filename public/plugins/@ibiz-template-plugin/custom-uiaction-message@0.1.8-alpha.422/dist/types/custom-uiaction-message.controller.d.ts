import { ITextArea } from '@ibiz/model-core';
import { EditorController } from '@ibiz-template/runtime';
import { IUIAction } from './type';

/**
 * @description 自定义界面行为消息
 * @export
 * @class CustomUIActionMessageController
 * @extends {EditorController<ITextArea>}
 */
export declare class CustomUIActionMessageController extends EditorController<ITextArea> {
    /**
     * @description 查询数据
     * @param {IData} data
     * @param {string} [query]
     * @returns {*}  {Promise<IUIAction[]>}
     * @memberof CustomUIActionMessageController
     */
    fetch(data: IData, query?: string): Promise<IUIAction[]>;
}
