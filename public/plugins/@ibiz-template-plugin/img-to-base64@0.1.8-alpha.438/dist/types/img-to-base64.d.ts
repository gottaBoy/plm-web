import { Ref } from 'vue';
import { ImgToBase64Controller } from './img-to-base64.controlller';

export declare const ImgToBase64: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    value: StringConstructor;
    controller: import('@ibiz-template/vue3-util').RequiredProp<import('vue').PropType<ImgToBase64Controller>, undefined, undefined>;
    data: import('@ibiz-template/vue3-util').RequiredProp<import('vue').PropType<import('@ibiz-template/core').IApiData>, undefined, undefined>;
    disabled: {
        type: BooleanConstructor;
    };
    readonly: {
        type: BooleanConstructor;
        default: boolean;
    };
    autoFocus: {
        type: BooleanConstructor;
        default: boolean;
    };
    overflowMode: {
        type: StringConstructor;
    };
    controlParams: {
        type: ObjectConstructor;
        required: boolean;
    };
}>, {
    ns: import('@ibiz-template/core').Namespace;
    c: ImgToBase64Controller;
    limit: import('vue').ComputedRef<1 | 9999>;
    uploadUrl: Ref<string, string>;
    headers: Ref<import('@ibiz-template/core').IApiData, import('@ibiz-template/core').IApiData>;
    editorItems: import('@ibiz/model-core').IEditorItem[];
    dialogImageUrl: Ref<string[], string[]>;
    dialogVisible: Ref<boolean, boolean>;
    noUploadIcon: import('vue').ComputedRef<boolean>;
    onRemove: () => void;
    onDownload: () => void;
    onSuccess: (response: IData) => void;
    base64Data: Ref<string, string>;
    fileList: Ref<import('@ibiz-template/core').IApiData[], import('@ibiz-template/core').IApiData[]>;
    onDialogVisibleChange: (value: boolean) => void;
    onPreview: () => void;
    getDownloadUrl: () => any;
    handleImgToBase64: (event: IData) => Promise<void>;
    componentRef: Ref<any, any>;
    showFormDefaultContent: import('vue').ComputedRef<boolean>;
    dialogImageUrlIndex: Ref<number, number>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (_value: unknown, _name?: string, _ignore?: boolean) => boolean;
    blur: (_event?: IData) => boolean;
    focus: (_event?: IData) => boolean;
    enter: (_event?: IData) => boolean;
    infoTextChange: (_text: string) => boolean;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    value: StringConstructor;
    controller: import('@ibiz-template/vue3-util').RequiredProp<import('vue').PropType<ImgToBase64Controller>, undefined, undefined>;
    data: import('@ibiz-template/vue3-util').RequiredProp<import('vue').PropType<import('@ibiz-template/core').IApiData>, undefined, undefined>;
    disabled: {
        type: BooleanConstructor;
    };
    readonly: {
        type: BooleanConstructor;
        default: boolean;
    };
    autoFocus: {
        type: BooleanConstructor;
        default: boolean;
    };
    overflowMode: {
        type: StringConstructor;
    };
    controlParams: {
        type: ObjectConstructor;
        required: boolean;
    };
}>> & Readonly<{
    onChange?: ((_value: unknown, _name?: string | undefined, _ignore?: boolean | undefined) => any) | undefined;
    onBlur?: ((_event?: import('@ibiz-template/core').IApiData | undefined) => any) | undefined;
    onFocus?: ((_event?: import('@ibiz-template/core').IApiData | undefined) => any) | undefined;
    onEnter?: ((_event?: import('@ibiz-template/core').IApiData | undefined) => any) | undefined;
    onInfoTextChange?: ((_text: string) => any) | undefined;
}>, {
    disabled: boolean;
    readonly: boolean;
    autoFocus: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
