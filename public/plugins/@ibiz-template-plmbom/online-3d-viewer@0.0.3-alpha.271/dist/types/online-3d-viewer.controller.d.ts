import { EditorController } from '@ibiz-template/runtime';
import { IFileUploader } from '@ibiz/model-core';
export declare class Online3DViewerController extends EditorController<IFileUploader> {
    /**
     * 上传参数
     */
    uploadParams?: IParams;
    /**
     * 下载参数
     */
    exportParams?: IParams;
    protected onInit(): Promise<void>;
    getCurrentWindowInfo(url: IData): string;
    calcPreviewUrl(file: IData): string | undefined;
}
