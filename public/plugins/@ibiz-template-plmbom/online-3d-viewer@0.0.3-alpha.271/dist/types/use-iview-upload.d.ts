import { Ref } from 'vue';
import { Online3DViewerController } from './online-3d-viewer.controller';
export interface FileData {
    id: string;
    name: string;
    url?: string | undefined;
    base64?: string | undefined;
    type: 'MODEL' | 'IMAGE' | 'DOCUMENT';
}
/**
 * iview的Upload适配逻辑
 *
 * @author lxm
 * @date 2022-11-17 16:11:12
 * @export
 * @param {IParams} props
 * @param {(_value: string | null) => {}} valueChange
 * @param {Online3DViewerController} c
 * @returns {*}
 */
export declare function useIViewUpload(props: IParams, c: Online3DViewerController): {
    uploadUrl: Ref<string>;
    downloadUrl: Ref<string>;
    headers: Ref<IData>;
    currentType: Ref<string>;
    files: Ref<FileData[]>;
    threeModelList: Ref<FileData[]>;
    imageFiles: Ref<FileData[]>;
    documentList: Ref<FileData[]>;
};
