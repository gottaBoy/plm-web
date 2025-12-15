import { Ref } from 'vue';
export declare const CommentItemRawItem: import("vue").DefineComponent<any, {
    ns: import("@ibiz-template/core").Namespace;
    c: any;
    rawRef: Ref<any>;
    previewRef: Ref<any>;
    content: Ref<string | number | undefined>;
    previewUrl: Ref<string>;
    type: string;
    template: string;
    htmlCode: import("vue").ComputedRef<any>;
    showFormDefaultContent: import("vue").ComputedRef<boolean>;
    previewSrcList: Ref<string[] | []>;
    onShow: () => Promise<void>;
    handleKeyPress: (event: KeyboardEvent) => Promise<void>;
    handleClick: (event: MouseEvent) => void;
    escaped: Ref<boolean>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, any, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<any>, {} | {
    [x: string]: any;
}, {}>;
