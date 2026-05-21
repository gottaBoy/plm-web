import { IEditorContainerController, IEditorProvider } from '@ibiz-template/runtime';
import { IFileUploader } from '@ibiz/model-core';
import { PictureFileFormatConverterController } from './picture-file-format-converter.controller';

/**
 * 图片文件格式转换编辑器适配器
 * @export
 * @class PictureFileFormatConverterProvider
 * @implements {IEditorProvider}
 */
export declare class PictureFileFormatConverterProvider implements IEditorProvider {
    formEditor: string;
    gridEditor: string;
    createController(editorModel: IFileUploader, parentController: IEditorContainerController): Promise<PictureFileFormatConverterController>;
}
