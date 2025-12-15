import { App } from 'vue';
export declare const IBizNumberGridControl: import("@ibiz-template/vue3-util").TypeWithInstall<import("vue").DefineComponent<{
    modelData: {
        type: import("vue").PropType<import("@ibiz/model-core").IDEGrid>;
        required: true;
    };
    context: {
        type: import("vue").PropType<import("@ibiz-template/core").IApiContext>;
        required: true;
    };
    params: {
        type: import("vue").PropType<import("@ibiz-template/core").IApiParams>;
        default: () => {};
    };
    provider: {
        type: import("vue").PropType<import("@ibiz-template/runtime").IControlProvider>;
    };
    mdctrlActiveMode: {
        type: NumberConstructor;
        default: undefined;
    };
    singleSelect: {
        type: BooleanConstructor;
        default: undefined;
    };
    rowEditOpen: {
        type: BooleanConstructor;
        default: undefined;
    };
    isSimple: {
        type: BooleanConstructor;
        required: false;
    };
    data: {
        type: {
            (arrayLength: number): import("@ibiz-template/core").IApiData[];
            (...items: import("@ibiz-template/core").IApiData[]): import("@ibiz-template/core").IApiData[];
            new (arrayLength: number): import("@ibiz-template/core").IApiData[];
            new (...items: import("@ibiz-template/core").IApiData[]): import("@ibiz-template/core").IApiData[];
            isArray(arg: any): arg is any[];
            readonly prototype: any[];
            from<T>(arrayLike: ArrayLike<T>): T[];
            from<T_1, U>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U, thisArg?: any): U[];
            from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
            from<T_3, U_1>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_1, thisArg?: any): U_1[];
            of<T_4>(...items: T_4[]): T_4[];
            readonly [Symbol.species]: ArrayConstructor;
        };
        required: false;
    };
    loadDefault: {
        type: BooleanConstructor;
        default: boolean;
    };
}, {
    c: import("./tree-grid.controller").NumberTreeGridController | import("./grid.controller").NumberGridController;
    ns: import("@ibiz-template/core").Namespace;
    ns2: import("vue").ComputedRef<import("@ibiz-template/core").Namespace | undefined>;
    ns3: import("@ibiz-template/core").Namespace;
    tableRef: import("vue").Ref<import("@ibiz-template/core").IApiData | undefined>;
    tableData: import("vue").Ref<import("@ibiz-template/core").IApiData[]>;
    treeGirdData: import("vue").Ref<import("@ibiz-template/core").IApiData[]>;
    showTreeGrid: import("vue").ComputedRef<boolean>;
    renderColumns: import("vue").Ref<import("@ibiz/model-core").IDEGridColumn[]>;
    defaultSort: import("vue").Ref<import("@ibiz-template/core").IApiData>;
    loadData: (tree: import("@ibiz-template/core").IApiData, treeNode: unknown, resolve: (nodes: import("@ibiz-template/core").IApiData[]) => void) => void;
    onDbRowClick: (data: import("@ibiz-template/runtime").ControlVO) => void;
    onRowClick: (data: import("@ibiz-template/runtime").ControlVO, _column: import("@ibiz-template/core").IApiData, event: MouseEvent) => Promise<void>;
    onExpandChange: (row: import("@ibiz-template/core").IApiData, state: boolean) => void;
    onSortChange: (opts: {
        _column: import("@ibiz-template/core").IApiData;
        prop: string;
        order: "ascending" | "descending";
    }) => void;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    onPageRefresh: () => void;
    handleRowClassName: ({ row }: {
        row: import("@ibiz-template/core").IApiData;
    }) => string;
    handleHeaderCellClassName: ({ _row, column, _rowIndex, _columnIndex, }: {
        _row: import("@ibiz-template/core").IApiData;
        column: import("@ibiz-template/core").IApiData;
        _rowIndex: number;
        _columnIndex: number;
    }) => string;
    renderNoData: () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | null;
    summaryMethod: ({ columns, }: {
        columns: import("element-plus/es/components/table/src/table-column/defaults").TableColumnCtx<import("@ibiz-template/core").IApiData>[];
        data: import("@ibiz-template/core").IApiData[];
    }) => string[];
    headerDragend: (newWidth: number, oldWidth: number, column: import("@ibiz-template/core").IApiData) => void;
    renderPopover: () => JSX.Element[];
    renderBatchToolBar: () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | undefined;
    renderFirstColumn: () => JSX.Element;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    modelData: {
        type: import("vue").PropType<import("@ibiz/model-core").IDEGrid>;
        required: true;
    };
    context: {
        type: import("vue").PropType<import("@ibiz-template/core").IApiContext>;
        required: true;
    };
    params: {
        type: import("vue").PropType<import("@ibiz-template/core").IApiParams>;
        default: () => {};
    };
    provider: {
        type: import("vue").PropType<import("@ibiz-template/runtime").IControlProvider>;
    };
    mdctrlActiveMode: {
        type: NumberConstructor;
        default: undefined;
    };
    singleSelect: {
        type: BooleanConstructor;
        default: undefined;
    };
    rowEditOpen: {
        type: BooleanConstructor;
        default: undefined;
    };
    isSimple: {
        type: BooleanConstructor;
        required: false;
    };
    data: {
        type: {
            (arrayLength: number): import("@ibiz-template/core").IApiData[];
            (...items: import("@ibiz-template/core").IApiData[]): import("@ibiz-template/core").IApiData[];
            new (arrayLength: number): import("@ibiz-template/core").IApiData[];
            new (...items: import("@ibiz-template/core").IApiData[]): import("@ibiz-template/core").IApiData[];
            isArray(arg: any): arg is any[];
            readonly prototype: any[];
            from<T>(arrayLike: ArrayLike<T>): T[];
            from<T_1, U>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U, thisArg?: any): U[];
            from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
            from<T_3, U_1>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_1, thisArg?: any): U_1[];
            of<T_4>(...items: T_4[]): T_4[];
            readonly [Symbol.species]: ArrayConstructor;
        };
        required: false;
    };
    loadDefault: {
        type: BooleanConstructor;
        default: boolean;
    };
}>>, {
    params: import("@ibiz-template/core").IApiParams;
    mdctrlActiveMode: number;
    singleSelect: boolean;
    rowEditOpen: boolean;
    isSimple: boolean;
    loadDefault: boolean;
}, {}>>;
declare const _default: {
    install(app: App): void;
};
export default _default;
