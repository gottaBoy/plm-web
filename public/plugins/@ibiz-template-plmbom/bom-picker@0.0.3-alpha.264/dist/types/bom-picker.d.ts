import { Ref } from 'vue';
import { IAppDEUIActionGroupDetail } from '@ibiz/model-core';
import { BomPickerEditorController } from './editor.controller';
export declare const IBizBomPicker: import("vue").DefineComponent<{
    value: (ObjectConstructor | ArrayConstructor | StringConstructor | NumberConstructor)[];
    controller: import("@ibiz-template/vue3-util").RequiredProp<import("vue").PropType<BomPickerEditorController>, undefined, undefined>;
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
    c: BomPickerEditorController;
    items: Ref<import("@ibiz-template/core").IApiData[]>;
    curValue: Ref<string | string[] | null>;
    valueText: import("vue").ComputedRef<string>;
    editorRef: Ref<any>;
    closeCircle: number;
    isEditable: Ref<boolean>;
    isReverse: Ref<boolean>;
    showFormDefaultContent: import("vue").ComputedRef<boolean>;
    onBlur: (e: IData) => void;
    onFocus: (e: IData) => void;
    onClear: () => void;
    onSearch: (_query?: string, cb?: ((_items: IData[]) => void) | undefined) => Promise<void>;
    onACSelect: (item: IData) => Promise<void>;
    handleKeyUp: (e: KeyboardEvent) => void;
    setEditable: (flag: boolean) => void;
    renderEmpty: () => JSX.Element;
    openLinkView: (e: MouseEvent) => Promise<void>;
    openPickUpView: (e: MouseEvent) => Promise<void>;
    renderPrompt: (_item: IData) => JSX.Element;
    renderActionItem: (detail: IAppDEUIActionGroupDetail) => JSX.Element | undefined;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (_value: unknown, _name?: string | undefined, _ignore?: boolean | undefined) => boolean;
    blur: (_event?: import("@ibiz-template/core").IApiData | undefined) => boolean;
    focus: (_event?: import("@ibiz-template/core").IApiData | undefined) => boolean;
    enter: (_event?: import("@ibiz-template/core").IApiData | undefined) => boolean;
    infoTextChange: (_text: string) => boolean;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    value: (ObjectConstructor | ArrayConstructor | StringConstructor | NumberConstructor)[];
    controller: import("@ibiz-template/vue3-util").RequiredProp<import("vue").PropType<BomPickerEditorController>, undefined, undefined>;
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
    onChange?: ((_value: unknown, _name?: string | undefined, _ignore?: boolean | undefined) => any) | undefined;
    onBlur?: ((_event?: import("@ibiz-template/core").IApiData | undefined) => any) | undefined;
    onFocus?: ((_event?: import("@ibiz-template/core").IApiData | undefined) => any) | undefined;
    onEnter?: ((_event?: import("@ibiz-template/core").IApiData | undefined) => any) | undefined;
    onInfoTextChange?: ((_text: string) => any) | undefined;
}, {
    disabled: boolean;
    readonly: boolean;
    autoFocus: boolean;
}, {}>;
