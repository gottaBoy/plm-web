import { Ref } from 'vue';
export declare const Attention: import("vue").DefineComponent<any, {
    ns: any;
    c: any;
    refValue: Ref<string>;
    curValue: Ref<string | null>;
    valueText: import("vue").ComputedRef<any>;
    loading: Ref<boolean>;
    items: Ref<IData[]>;
    isEditable: Ref<boolean>;
    showFormDefaultContent: import("vue").ComputedRef<boolean>;
    modelVisible: Ref<boolean>;
    curAttentionValue: Ref<string>;
    attentionRef: Ref<HTMLElement | undefined>;
    readonlyState: import("vue").ComputedRef<any>;
    onClear: (e: Event) => void;
    load: (tag?: boolean) => Promise<void>;
    setEditable: (flag: boolean) => void;
    renderDropModal: () => JSX.Element;
    renderNoSelectValue: () => JSX.Element;
    renderSelectInput: () => JSX.Element;
    onPopShow: () => Promise<void>;
    onPageHide: () => void;
    onAttentionChange: (value: string | undefined) => Promise<void>;
    renderEditContent: () => IData;
    renderReadonlyContent: () => JSX.Element | IData;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, any, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<any>, {} | {
    [x: string]: any;
}, {}>;
