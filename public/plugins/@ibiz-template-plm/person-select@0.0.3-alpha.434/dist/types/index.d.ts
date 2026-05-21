import { App } from 'vue';
export declare const IBizPersonelSelect: import("@ibiz-template/vue3-util").TypeWithInstall<import("vue").DefineComponent<{
    value: (ObjectConstructor | NumberConstructor | ArrayConstructor | StringConstructor)[];
    controller: import("@ibiz-template/vue3-util").RequiredProp<import("vue").PropType<import("./personel-select-controller").PersonelSelectController>, undefined, undefined>;
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
    c: import("./personel-select-controller").PersonelSelectController;
    ns: import("@ibiz-template/core").Namespace;
    ns2: import("@ibiz-template/core").Namespace;
    items: import("vue").Ref<import("@ibiz-template/core").IApiData[]>;
    loading: import("vue").Ref<boolean>;
    refValue: import("vue").Ref<string>;
    curValue: import("vue").Ref<string | null>;
    valueText: import("vue").ComputedRef<string>;
    isEditable: import("vue").Ref<boolean>;
    popoverRef: import("vue").Ref<any>;
    modelVisible: import("vue").Ref<boolean>;
    personelSelRef: import("vue").Ref<HTMLElement | undefined>;
    showFormDefaultContent: import("vue").ComputedRef<boolean>;
    load: (tag?: boolean) => Promise<void>;
    onClear: (e: Event) => void;
    onPopShow: () => Promise<void>;
    onPageHide: () => void;
    calcHeight: () => void;
    handleClick: (e: MouseEvent) => void;
    setEditable: (flag: boolean) => void;
    renderDropModal: () => JSX.Element;
    renderReadState: () => JSX.Element;
    renderSelectInput: () => JSX.Element;
    renderNoSelectValue: (empty?: boolean) => JSX.Element;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (_value: unknown, _name?: string | undefined, _ignore?: boolean | undefined) => boolean;
    blur: (_event?: import("@ibiz-template/core").IApiData | undefined) => boolean;
    focus: (_event?: import("@ibiz-template/core").IApiData | undefined) => boolean;
    enter: (_event?: import("@ibiz-template/core").IApiData | undefined) => boolean;
    infoTextChange: (_text: string) => boolean;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    value: (ObjectConstructor | NumberConstructor | ArrayConstructor | StringConstructor)[];
    controller: import("@ibiz-template/vue3-util").RequiredProp<import("vue").PropType<import("./personel-select-controller").PersonelSelectController>, undefined, undefined>;
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
}, {}>>;
declare const _default: {
    install(app: App): void;
};
export default _default;
