import { PropType } from 'vue';
import { IModal, IFilterNode } from '@ibiz-template/runtime';
import { IFilterItem } from '../interfaces';
import { OdooSearchBarController } from '../odoo-search-bar.controller';

export declare const Modal: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    item: {
        type: PropType<IFilterItem>;
    };
    modal: {
        type: PropType<IModal>;
        required: true;
    };
    controller: {
        type: PropType<OdooSearchBarController>;
        required: true;
    };
}>, {
    ns: import('@ibiz-template/core').Namespace;
    data: {
        id: string;
        caption: string;
        showSeparator: boolean;
        searchconds: {
            condtype: "GROUP";
            condop: "AND" | "OR";
            notmode?: boolean | undefined;
            searchconds?: (/*elided*/ any | {
                condtype: "DEFIELD";
                condop: import('@ibiz-template/runtime').ValueOP;
                value: unknown;
                fieldname: string;
            } | {
                condtype: "ITEMS";
                condop: import('@ibiz-template/runtime').ITEMS_COND_OP;
                fieldname: string;
                searchconds?: (/*elided*/ any | {
                    condtype: "DEFIELD";
                    condop: import('@ibiz-template/runtime').ValueOP;
                    value: unknown;
                    fieldname: string;
                } | /*elided*/ any | {
                    condtype: "CUSTOM";
                    customtype: "PQL" | string;
                    customcond: string;
                })[] | undefined;
            } | {
                condtype: "CUSTOM";
                customtype: "PQL" | string;
                customcond: string;
            })[] | undefined;
        }[];
        isShow: boolean;
        isCustom: boolean;
        isChange: boolean;
    };
    isInit: import('vue').Ref<boolean, boolean>;
    formRef: import('vue').Ref<any, any>;
    customCond: import('vue').Ref<string, string>;
    showRestore: import('vue').Ref<boolean, boolean>;
    filterNodes: import('vue').Ref<({
        nodeType: "GROUP";
        logicType: "AND" | "OR";
        notMode?: boolean | undefined;
        hidden?: boolean | undefined;
        children: (/*elided*/ any | {
            nodeType: "FIELD";
            field: string | null;
            value: unknown | null;
            valueOP: import('@ibiz-template/runtime').ValueOP | null;
            disabled?: boolean | undefined;
            hidden?: boolean | undefined;
            valueItem?: unknown;
        } | {
            nodeType: "ITEMS";
            field: string | null;
            valueOP: import('@ibiz-template/runtime').ITEMS_COND_OP | null;
            hidden?: boolean | undefined;
            simple?: boolean | undefined;
            children: (/*elided*/ any | {
                nodeType: "FIELD";
                field: string | null;
                value: unknown | null;
                valueOP: import('@ibiz-template/runtime').ValueOP | null;
                disabled?: boolean | undefined;
                hidden?: boolean | undefined;
                valueItem?: unknown;
            } | /*elided*/ any | {
                nodeType: "CUSTOM";
                customType: "PQL" | string;
                customCond: string;
                hidden?: boolean | undefined;
            })[];
        } | {
            nodeType: "CUSTOM";
            customType: "PQL" | string;
            customCond: string;
            hidden?: boolean | undefined;
        })[];
    } | {
        nodeType: "FIELD";
        field: string | null;
        value: unknown | null;
        valueOP: import('@ibiz-template/runtime').ValueOP | null;
        disabled?: boolean | undefined;
        hidden?: boolean | undefined;
        valueItem?: unknown;
    } | {
        nodeType: "ITEMS";
        field: string | null;
        valueOP: import('@ibiz-template/runtime').ITEMS_COND_OP | null;
        hidden?: boolean | undefined;
        simple?: boolean | undefined;
        children: ({
            nodeType: "GROUP";
            logicType: "AND" | "OR";
            notMode?: boolean | undefined;
            hidden?: boolean | undefined;
            children: (/*elided*/ any | {
                nodeType: "FIELD";
                field: string | null;
                value: unknown | null;
                valueOP: import('@ibiz-template/runtime').ValueOP | null;
                disabled?: boolean | undefined;
                hidden?: boolean | undefined;
                valueItem?: unknown;
            } | /*elided*/ any | {
                nodeType: "CUSTOM";
                customType: "PQL" | string;
                customCond: string;
                hidden?: boolean | undefined;
            })[];
        } | {
            nodeType: "FIELD";
            field: string | null;
            value: unknown | null;
            valueOP: import('@ibiz-template/runtime').ValueOP | null;
            disabled?: boolean | undefined;
            hidden?: boolean | undefined;
            valueItem?: unknown;
        } | /*elided*/ any | {
            nodeType: "CUSTOM";
            customType: "PQL" | string;
            customCond: string;
            hidden?: boolean | undefined;
        })[];
    } | {
        nodeType: "CUSTOM";
        customType: "PQL" | string;
        customCond: string;
        hidden?: boolean | undefined;
    })[], IFilterNode[] | ({
        nodeType: "GROUP";
        logicType: "AND" | "OR";
        notMode?: boolean | undefined;
        hidden?: boolean | undefined;
        children: (/*elided*/ any | {
            nodeType: "FIELD";
            field: string | null;
            value: unknown | null;
            valueOP: import('@ibiz-template/runtime').ValueOP | null;
            disabled?: boolean | undefined;
            hidden?: boolean | undefined;
            valueItem?: unknown;
        } | {
            nodeType: "ITEMS";
            field: string | null;
            valueOP: import('@ibiz-template/runtime').ITEMS_COND_OP | null;
            hidden?: boolean | undefined;
            simple?: boolean | undefined;
            children: (/*elided*/ any | {
                nodeType: "FIELD";
                field: string | null;
                value: unknown | null;
                valueOP: import('@ibiz-template/runtime').ValueOP | null;
                disabled?: boolean | undefined;
                hidden?: boolean | undefined;
                valueItem?: unknown;
            } | /*elided*/ any | {
                nodeType: "CUSTOM";
                customType: "PQL" | string;
                customCond: string;
                hidden?: boolean | undefined;
            })[];
        } | {
            nodeType: "CUSTOM";
            customType: "PQL" | string;
            customCond: string;
            hidden?: boolean | undefined;
        })[];
    } | {
        nodeType: "FIELD";
        field: string | null;
        value: unknown | null;
        valueOP: import('@ibiz-template/runtime').ValueOP | null;
        disabled?: boolean | undefined;
        hidden?: boolean | undefined;
        valueItem?: unknown;
    } | {
        nodeType: "ITEMS";
        field: string | null;
        valueOP: import('@ibiz-template/runtime').ITEMS_COND_OP | null;
        hidden?: boolean | undefined;
        simple?: boolean | undefined;
        children: ({
            nodeType: "GROUP";
            logicType: "AND" | "OR";
            notMode?: boolean | undefined;
            hidden?: boolean | undefined;
            children: (/*elided*/ any | {
                nodeType: "FIELD";
                field: string | null;
                value: unknown | null;
                valueOP: import('@ibiz-template/runtime').ValueOP | null;
                disabled?: boolean | undefined;
                hidden?: boolean | undefined;
                valueItem?: unknown;
            } | /*elided*/ any | {
                nodeType: "CUSTOM";
                customType: "PQL" | string;
                customCond: string;
                hidden?: boolean | undefined;
            })[];
        } | {
            nodeType: "FIELD";
            field: string | null;
            value: unknown | null;
            valueOP: import('@ibiz-template/runtime').ValueOP | null;
            disabled?: boolean | undefined;
            hidden?: boolean | undefined;
            valueItem?: unknown;
        } | /*elided*/ any | {
            nodeType: "CUSTOM";
            customType: "PQL" | string;
            customCond: string;
            hidden?: boolean | undefined;
        })[];
    } | {
        nodeType: "CUSTOM";
        customType: "PQL" | string;
        customCond: string;
        hidden?: boolean | undefined;
    })[]>;
    filterTreeRef: import('vue').Ref<any, any>;
    onCancel: () => void;
    onConfirm: () => Promise<void>;
    onRestore: () => Promise<void>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    item: {
        type: PropType<IFilterItem>;
    };
    modal: {
        type: PropType<IModal>;
        required: true;
    };
    controller: {
        type: PropType<OdooSearchBarController>;
        required: true;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
