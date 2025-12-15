import { PropType } from 'vue';
import { IModal } from '@ibiz-template/runtime';
import { UploadFile } from 'element-plus';
export declare const UploadCustom: import("vue").DefineComponent<{
    modal: {
        type: PropType<IModal>;
        required: true;
    };
    context: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        default: () => void;
    };
    viewParams: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        default: () => void;
    };
    actionParams: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        default: () => void;
    };
    accept: {
        type: StringConstructor;
        default: string;
    };
}, {
    ns: import("@ibiz-template/core").Namespace;
    files: import("vue").Ref<{
        id: string;
        name: string;
        url?: string | undefined;
    }[]>;
    limit: import("vue").ComputedRef<1 | 9999>;
    uploadUrl: import("vue").Ref<string>;
    headers: import("vue").Ref<import("@ibiz-template/core").IApiData>;
    uploadRef: import("vue").Ref<any>;
    getUploadMessage: (type: string) => string;
    onError: (...args: import("@ibiz-template/core").IApiData[]) => never;
    onRemove: (file: import("@ibiz-template/core").IApiData) => void;
    onItemRemove: (file: import("@ibiz-template/core").IApiData) => void;
    onSuccess: (response: import("@ibiz-template/core").IApiData, uploadFile: UploadFile) => void;
    beforeUpload: (rawFile: import("element-plus").UploadRawFile) => boolean;
    onConfirm: () => void;
    onCancel: () => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    modal: {
        type: PropType<IModal>;
        required: true;
    };
    context: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        default: () => void;
    };
    viewParams: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        default: () => void;
    };
    actionParams: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        default: () => void;
    };
    accept: {
        type: StringConstructor;
        default: string;
    };
}>>, {
    context: import("@ibiz-template/core").IApiData;
    accept: string;
    actionParams: import("@ibiz-template/core").IApiData;
    viewParams: import("@ibiz-template/core").IApiData;
}, {}>;
