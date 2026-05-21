import { IEditorProvider, IEditorContainerController } from '@ibiz-template/runtime';
import { ITextArea } from '@ibiz/model-core';
import { CustomUIActionMessageController } from './custom-uiaction-message.controller';

/**
 * @description 自定义界面行为消息
 * @export
 * @class CustomUIActionMessageProvider
 * @implements {IEditorProvider}
 */
export declare class CustomUIActionMessageProvider implements IEditorProvider {
    formEditor: string;
    gridEditor: string;
    createController(editorModel: ITextArea, parentController: IEditorContainerController): Promise<CustomUIActionMessageController>;
}
