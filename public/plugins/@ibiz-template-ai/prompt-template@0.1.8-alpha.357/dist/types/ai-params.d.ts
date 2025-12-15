import { AIParamsController } from './ai-params.controller';

interface IAIParam {
    /**
     * @description 参数名
     * @type {string}
     * @memberof IAIParam
     */
    paramName: string;
    /**
     * @description 内容
     * @type {string}
     * @memberof IAIParam
     */
    content: string;
}
export declare const AIParams: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    value: (StringConstructor | NumberConstructor)[];
    controller: import('@ibiz-template/vue3-util').RequiredProp<import('vue').PropType<AIParamsController>, undefined, undefined>;
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
    c: AIParamsController;
    ns: import('@ibiz-template/core').Namespace;
    isCustom: import('vue').Ref<boolean, boolean>;
    paramStr: import('vue').Ref<string, string>;
    paramArr: import('vue').Ref<{
        paramName: string;
        content: string;
    }[], IAIParam[] | {
        paramName: string;
        content: string;
    }[]>;
    onCopy: (index: number) => void;
    onDelete: (index: number) => void;
    onAddItem: () => void;
    onParamChange: () => void;
    onCustomChange: () => void;
    onSwitchCustom: () => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, "change"[], "change", import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    value: (StringConstructor | NumberConstructor)[];
    controller: import('@ibiz-template/vue3-util').RequiredProp<import('vue').PropType<AIParamsController>, undefined, undefined>;
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
    onChange?: ((...args: any[]) => any) | undefined;
}>, {
    disabled: boolean;
    readonly: boolean;
    autoFocus: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export {};
