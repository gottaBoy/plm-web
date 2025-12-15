import { PropType } from 'vue';
export declare const EmojiItem: import("vue").DefineComponent<{
    emoji: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        required: true;
        default: () => void;
    };
    size: {
        type: NumberConstructor;
        required: true;
    };
    withBorder: {
        type: BooleanConstructor;
        required: true;
    };
}, {
    ns: import("@ibiz-template/core").Namespace;
    styleSize: import("vue").ComputedRef<{
        fontSize: string;
        lineHeight: string;
        height: string;
        width: string;
    }>;
    onClick: () => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "click"[], "click", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    emoji: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        required: true;
        default: () => void;
    };
    size: {
        type: NumberConstructor;
        required: true;
    };
    withBorder: {
        type: BooleanConstructor;
        required: true;
    };
}>> & {
    onClick?: ((...args: any[]) => any) | undefined;
}, {
    emoji: import("@ibiz-template/core").IApiData;
}, {}>;
