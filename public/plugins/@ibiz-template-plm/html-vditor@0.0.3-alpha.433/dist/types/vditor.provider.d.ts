import { IEditorContainerController, IEditorProvider } from '@ibiz-template/runtime';
import { IHtml } from '@ibiz/model-core';
import { VditorController } from './vditor.controller';
/**
 * @description Vditor编辑器
 * @export
 * @class VditorProvider
 * @implements {IEditorProvider}
 */
export declare class VditorProvider implements IEditorProvider {
    formEditor: string;
    gridEditor: string;
    constructor(type?: string);
    createController(editorModel: IHtml, parentController: IEditorContainerController): Promise<VditorController>;
}
