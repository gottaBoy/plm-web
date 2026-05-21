import { IEditorContainerController, IEditorProvider } from '@ibiz-template/runtime';
import { IFileUploader } from '@ibiz/model-core';
import { ImgToBase64Controller } from './img-to-base64.controlller';

export declare class ImgToBase64Provider implements IEditorProvider {
    formEditor: string;
    gridEditor: string;
    createController(editorModel: IFileUploader, parentController: IEditorContainerController): Promise<ImgToBase64Controller>;
}
