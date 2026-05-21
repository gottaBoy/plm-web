import { CodeEditorController } from '../code-editor.controller';
import './monaco-editor.scss';
export declare const IBizAICode: import("vue").DefineComponent<{
    value: StringConstructor;
    language: {
        type: StringConstructor;
    };
    theme: {
        type: StringConstructor;
    };
    controller: import("@ibiz-template/vue3-util").RequiredProp<import("vue").PropType<CodeEditorController>, undefined, undefined>;
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
    isLoading: import("vue").Ref<boolean>;
    currentVal: import("vue").Ref<string>;
    codeEditBox: import("vue").Ref<any>;
    isFullScreen: import("vue").Ref<boolean>;
    hasEnableEdit: import("vue").Ref<boolean>;
    readonlyState: import("vue").Ref<boolean>;
    isTSFileLoading: import("vue").Ref<boolean>;
    textTBRef: import("vue").Ref<any>;
    renderFooter: () => import("vue/jsx-runtime").JSX.Element | null;
    renderCodeContent: () => import("vue/jsx-runtime").JSX.Element;
    renderHeaderToolbar: () => import("vue/jsx-runtime").JSX.Element | null;
    renderTextEditorToolbar: () => import("vue/jsx-runtime").JSX.Element | null;
    changeFullScreenState: () => Promise<void>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (_value: unknown, _name?: string | undefined, _ignore?: boolean | undefined) => boolean;
    blur: (_event?: import("@ibiz-template/core").IApiData | undefined) => boolean;
    focus: (_event?: import("@ibiz-template/core").IApiData | undefined) => boolean;
    enter: (_event?: import("@ibiz-template/core").IApiData | undefined) => boolean;
    infoTextChange: (_text: string) => boolean;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    value: StringConstructor;
    language: {
        type: StringConstructor;
    };
    theme: {
        type: StringConstructor;
    };
    controller: import("@ibiz-template/vue3-util").RequiredProp<import("vue").PropType<CodeEditorController>, undefined, undefined>;
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
    readonly: boolean;
    disabled: boolean;
    autoFocus: boolean;
}, {}>;
