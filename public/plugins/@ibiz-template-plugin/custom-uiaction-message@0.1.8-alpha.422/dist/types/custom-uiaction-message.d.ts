import { IUIAction, MessageType, IUIActionMessage } from './type';
import { CustomUIActionMessageController } from './custom-uiaction-message.controller';

export declare const CustomUIActionMessage: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    value: (StringConstructor | NumberConstructor)[];
    controller: import('@ibiz-template/vue3-util').RequiredProp<import('vue').PropType<CustomUIActionMessageController>, undefined, undefined>;
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
    c: CustomUIActionMessageController;
    ns: import('@ibiz-template/core').Namespace;
    msgStr: import('vue').Ref<string, string>;
    msgArr: import('vue').Ref<{
        type: MessageType;
        data: {
            actionid?: string | undefined;
            appid?: string | undefined;
            content?: string | undefined;
        };
        metadata: {
            content_name?: string | undefined;
            action_context?: string | undefined;
        };
    }[], IUIActionMessage[] | {
        type: MessageType;
        data: {
            actionid?: string | undefined;
            appid?: string | undefined;
            content?: string | undefined;
        };
        metadata: {
            content_name?: string | undefined;
            action_context?: string | undefined;
        };
    }[]>;
    isLegal: import('vue').Ref<boolean, boolean>;
    showCustom: import('vue').Ref<boolean, boolean>;
    onAdd: (type: MessageType) => void;
    onDelete: (index: number) => void;
    onSearch: (query?: string) => Promise<IUIAction[]>;
    onItemChange: () => void;
    onSwitchCustom: () => void;
    onCustomChange: () => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (_value: unknown, _name?: string, _ignore?: boolean) => boolean;
    blur: (_event?: IData) => boolean;
    focus: (_event?: IData) => boolean;
    enter: (_event?: IData) => boolean;
    infoTextChange: (_text: string) => boolean;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    value: (StringConstructor | NumberConstructor)[];
    controller: import('@ibiz-template/vue3-util').RequiredProp<import('vue').PropType<CustomUIActionMessageController>, undefined, undefined>;
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
