import { IEditorProvider, IEditorContainerController } from '@ibiz-template/runtime';
import { IFileUploader } from '@ibiz/model-core';
import { Online3DViewerController } from './online-3d-viewer.controller';
export declare class Online3DViewerProvider implements IEditorProvider {
    formEditor: string;
    gridEditor: string;
    createController(editorModel: IFileUploader, parentController: IEditorContainerController): Promise<Online3DViewerController>;
}
