import { PropType } from 'vue';
export declare const InsertItemList: import("vue").DefineComponent<{
    data: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        required: true;
    };
    filter: {
        type: StringConstructor;
        default: string;
    };
    categories: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        required: true;
        default: () => void;
    };
    hasSearch: {
        type: BooleanConstructor;
    };
}, {
    ns: import("@ibiz-template/core").Namespace;
    InsertItemsRef: import("vue").Ref<import("@ibiz-template/core").IApiData>;
    dataFilteredByCategory: import("vue").ComputedRef<import("@ibiz-template/core").IApiData>;
    onSelect: (insertItem: IData) => void;
    renderListInsertItems: (params: IData) => JSX.Element | string;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("data" | "select")[], "data" | "select", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    data: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        required: true;
    };
    filter: {
        type: StringConstructor;
        default: string;
    };
    categories: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        required: true;
        default: () => void;
    };
    hasSearch: {
        type: BooleanConstructor;
    };
}>> & {
    onSelect?: ((...args: any[]) => any) | undefined;
    onData?: ((...args: any[]) => any) | undefined;
}, {
    filter: string;
    categories: import("@ibiz-template/core").IApiData;
    hasSearch: boolean;
}, {}>;
