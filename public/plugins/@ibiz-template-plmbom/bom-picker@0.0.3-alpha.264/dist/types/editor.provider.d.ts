import { IEditorContainerController, IEditorProvider } from '@ibiz-template/runtime';
import { IPicker } from '@ibiz/model-core';
import { BomPickerEditorController } from './editor.controller';
export declare class BomPickerEditorProvider implements IEditorProvider {
    formEditor: string;
    gridEditor: string;
    constructor();
    createController(editorModel: IPicker, parentController: IEditorContainerController): Promise<BomPickerEditorController>;
}
