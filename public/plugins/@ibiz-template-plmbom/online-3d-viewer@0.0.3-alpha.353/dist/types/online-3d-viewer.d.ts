import { Ref } from 'vue';
export declare const Online3DViewer: import("vue").DefineComponent<any, {
    ns: any;
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
    currentTitle: import("vue").ComputedRef<any>;
    documentList: Ref<import("./use-iview-upload").FileData[]>;
    imageFiles: Ref<import("./use-iview-upload").FileData[]>;
    threeModelList: Ref<import("./use-iview-upload").FileData[]>;
    calcCurrtypeVisible: (type: 'IMAGE' | 'DOCUMENT' | 'MODEL') => boolean;
    showHeader: Ref<boolean>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, any, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<any>, {} | {
    [x: string]: any;
}, {}>;
