import { IEditorProvider, IEditorContainerController } from '@ibiz-template/runtime';
import { ITextBox } from '@ibiz/model-core';
import { AIParamsController } from './ai-params.controller';

export declare class AIParamsProvider implements IEditorProvider {
    formEditor: string;
    gridEditor: string;
    createController(editorModel: ITextBox, parentController: IEditorContainerController): Promise<AIParamsController>;
}
