import { Ref } from 'vue';
import { Online3DViewerController } from './online-3d-viewer.controller';
export declare const Online3DViewer: import("vue").DefineComponent<{
    value: StringConstructor;
    controller: import("@ibiz-template/vue3-util").RequiredProp<import("vue").PropType<Online3DViewerController>, undefined, undefined>;
    data: import("@ibiz-template/vue3-util").RequiredProp<import("vue").PropType<import("@ibiz-template/core").IApiData>, undefined, undefined>;
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
}, {
    ns: import("@ibiz-template/core").Namespace;
    loading: Ref<boolean>;
    viewerRef: Ref<HTMLDivElement | null>;
    currentProgress: Ref<number>;
    currentProgressText: string[];
    isModelLoadError: Ref<boolean>;
    currentType: Ref<string>;
    viewerContainerRef: Ref<any>;
    onRefresh: () => void;
    renderLoadingStep: () => JSX.Element;
    renderLoadError: () => JSX.Element;
    renderFileTypeBtns: () => JSX.Element[];
    renderImagePreview: () => JSX.Element | undefined;
    renderDocumentPreview: () => JSX.Element | undefined;
    currentTitle: import("vue").ComputedRef<string>;
    documentList: Ref<import("./use-iview-upload").FileData[]>;
    imageFiles: Ref<import("./use-iview-upload").FileData[]>;
    threeModelList: Ref<import("./use-iview-upload").FileData[]>;
    calcCurrtypeVisible: (type: 'IMAGE' | 'DOCUMENT' | 'MODEL') => boolean;
    showHeader: Ref<boolean>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (_value: unknown, _name?: string | undefined, _ignore?: boolean | undefined) => boolean;
    blur: (_event?: import("@ibiz-template/core").IApiData | undefined) => boolean;
    focus: (_event?: import("@ibiz-template/core").IApiData | undefined) => boolean;
    enter: (_event?: import("@ibiz-template/core").IApiData | undefined) => boolean;
    infoTextChange: (_text: string) => boolean;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    value: StringConstructor;
    controller: import("@ibiz-template/vue3-util").RequiredProp<import("vue").PropType<Online3DViewerController>, undefined, undefined>;
    data: import("@ibiz-template/vue3-util").RequiredProp<import("vue").PropType<import("@ibiz-template/core").IApiData>, undefined, undefined>;
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
}>> & {
    onFocus?: ((_event?: import("@ibiz-template/core").IApiData | undefined) => any) | undefined;
    onBlur?: ((_event?: import("@ibiz-template/core").IApiData | undefined) => any) | undefined;
    onChange?: ((_value: unknown, _name?: string | undefined, _ignore?: boolean | undefined) => any) | undefined;
    onEnter?: ((_event?: import("@ibiz-template/core").IApiData | undefined) => any) | undefined;
    onInfoTextChange?: ((_text: string) => any) | undefined;
}, {
    disabled: boolean;
    readonly: boolean;
    autoFocus: boolean;
}, {}>;
