import { PropType } from 'vue';
import { IModal } from '@ibiz-template/runtime';
export declare const InsertSelect: import("vue").DefineComponent<{
    modal: {
        type: PropType<IModal>;
        required: true;
    };
    context: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        default: () => void;
    };
    viewParams: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        default: () => void;
    };
    actionParams: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        default: () => void;
    };
}, {
    ns: import("@ibiz-template/core").Namespace;
    mapInsertItems: import("vue").Ref<import("@ibiz-template/core").IApiData>;
    mapCategories: import("vue").Ref<import("@ibiz-template/core").IApiData>;
    searchVal: import("vue").Ref<string>;
    onSelectItem: (item: IData) => Promise<void>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "select"[], "select", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    modal: {
        type: PropType<IModal>;
        required: true;
    };
    context: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        default: () => void;
    };
    viewParams: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        default: () => void;
    };
    actionParams: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        default: () => void;
    };
}>> & {
    onSelect?: ((...args: any[]) => any) | undefined;
}, {
    context: import("@ibiz-template/core").IApiData;
    actionParams: import("@ibiz-template/core").IApiData;
    viewParams: import("@ibiz-template/core").IApiData;
}, {}>;
