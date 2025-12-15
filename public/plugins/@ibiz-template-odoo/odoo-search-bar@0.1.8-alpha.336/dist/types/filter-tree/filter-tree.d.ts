import { IFilterNode, IFilterNodeGroup, IFilterNodeField, IFilterNodeItems, SearchBarFilterController, SearchBarFilterItemsController } from '@ibiz-template/runtime';
import { PropType } from 'vue';

export declare const FilterTreeControl: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    filterControllers: {
        type: PropType<SearchBarFilterController[]>;
        required: true;
    };
    filterNodes: {
        type: PropType<IFilterNode[]>;
        required: true;
    };
    filterMode: {
        type: PropType<"default" | "pql">;
        default: string;
    };
    customCond: {
        type: StringConstructor;
        default: string;
    };
    context: {
        type: PropType<IContext>;
    };
    params: {
        type: PropType<IParams>;
    };
    schemaEntityMap: {
        type: PropType<Map<string, string | undefined>>;
        default: () => Map<any, any>;
    };
}>, {
    ns: import('@ibiz-template/core').Namespace;
    UiFilterNodes: import('vue').ComputedRef<IFilterNode[]>;
    currentCustomCond: import('vue').Ref<string, string>;
    verify: () => boolean;
    renderFilterGroup: (node: IFilterNodeGroup | IFilterNodeItems, itemsC?: SearchBarFilterItemsController, root?: boolean) => any;
    renderFilterItem: (node: IFilterNodeField, itemsC?: SearchBarFilterItemsController) => import("vue/jsx-runtime").JSX.Element | undefined;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, ("change" | "confirm" | "cancel" | "customCondChange")[], "change" | "confirm" | "cancel" | "customCondChange", import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    filterControllers: {
        type: PropType<SearchBarFilterController[]>;
        required: true;
    };
    filterNodes: {
        type: PropType<IFilterNode[]>;
        required: true;
    };
    filterMode: {
        type: PropType<"default" | "pql">;
        default: string;
    };
    customCond: {
        type: StringConstructor;
        default: string;
    };
    context: {
        type: PropType<IContext>;
    };
    params: {
        type: PropType<IParams>;
    };
    schemaEntityMap: {
        type: PropType<Map<string, string | undefined>>;
        default: () => Map<any, any>;
    };
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
    onConfirm?: ((...args: any[]) => any) | undefined;
    onCancel?: ((...args: any[]) => any) | undefined;
    onCustomCondChange?: ((...args: any[]) => any) | undefined;
}>, {
    filterMode: "default" | "pql";
    customCond: string;
    schemaEntityMap: Map<string, string | undefined>;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
