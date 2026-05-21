import { EditorController } from '@ibiz-template/runtime';
import { IFileUploader } from '@ibiz/model-core';

/**
 * 图片文件格式转换编辑器控制器
 * @return {*}
 */
export declare class PictureFileFormatConverterController extends EditorController<IFileUploader> {
    protected onInit(): Promise<void>;
}
