import { IDETree } from '@ibiz/model-core';
import { PropType } from 'vue';
import { ITreeNodeData, IControlProvider } from '@ibiz-template/runtime';
import { KnowledgeGraphController } from './knowledge-graph.controller';
export declare const KnowledgeGraph: import("vue").DefineComponent<{
    /**
     * @description 树模型数据
     */
    modelData: {
        type: PropType<IDETree>;
        required: true;
    };
    /**
     * @description 应用上下文对象
     */
    context: {
        type: PropType<import("@ibiz-template/core").IApiContext>;
        required: true;
    };
    /**
     * @description 视图参数对象
     * @default {}
     */
    params: {
        type: PropType<import("@ibiz-template/core").IApiParams>;
        default: () => {};
    };
    /**
     * @description 部件适配器
     */
    provider: {
        type: PropType<IControlProvider>;
    };
    /**
     * @description 树节点默认激活模式，值为0:不激活，值为1：单击激活，值为2：双击激活
     */
    mdctrlActiveMode: {
        type: NumberConstructor;
        default: undefined;
    };
    /**
     * @description 是否单选
     */
    singleSelect: {
        type: BooleanConstructor;
        default: undefined;
    };
    /**
     * @description 是否是导航的
     */
    navigational: {
        type: BooleanConstructor;
        default: undefined;
    };
    /**
     * @description 默认展开节点集合
     */
    defaultExpandedKeys: {
        type: PropType<string[]>;
    };
    /**
     * @description 是否默认加载数据
     * @default true
     */
    loadDefault: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * @description 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
     * @default true
     */
    checkStrictly: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * @description 是否是简单模式
     * @default false
     */
    isSimple: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * @description 简单模式下传入的数据
     */
    data: {
        type: {
            (arrayLength: number): ITreeNodeData[];
            (...items: ITreeNodeData[]): ITreeNodeData[];
            new (arrayLength: number): ITreeNodeData[];
            new (...items: ITreeNodeData[]): ITreeNodeData[];
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
}, {
    c: KnowledgeGraphController;
    ns: import("@ibiz-template/core").Namespace;
    graphContainer: import("vue").Ref<HTMLDivElement | undefined>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * @description 树模型数据
     */
    modelData: {
        type: PropType<IDETree>;
        required: true;
    };
    /**
     * @description 应用上下文对象
     */
    context: {
        type: PropType<import("@ibiz-template/core").IApiContext>;
        required: true;
    };
    /**
     * @description 视图参数对象
     * @default {}
     */
    params: {
        type: PropType<import("@ibiz-template/core").IApiParams>;
        default: () => {};
    };
    /**
     * @description 部件适配器
     */
    provider: {
        type: PropType<IControlProvider>;
    };
    /**
     * @description 树节点默认激活模式，值为0:不激活，值为1：单击激活，值为2：双击激活
     */
    mdctrlActiveMode: {
        type: NumberConstructor;
        default: undefined;
    };
    /**
     * @description 是否单选
     */
    singleSelect: {
        type: BooleanConstructor;
        default: undefined;
    };
    /**
     * @description 是否是导航的
     */
    navigational: {
        type: BooleanConstructor;
        default: undefined;
    };
    /**
     * @description 默认展开节点集合
     */
    defaultExpandedKeys: {
        type: PropType<string[]>;
    };
    /**
     * @description 是否默认加载数据
     * @default true
     */
    loadDefault: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * @description 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
     * @default true
     */
    checkStrictly: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * @description 是否是简单模式
     * @default false
     */
    isSimple: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * @description 简单模式下传入的数据
     */
    data: {
        type: {
            (arrayLength: number): ITreeNodeData[];
            (...items: ITreeNodeData[]): ITreeNodeData[];
            new (arrayLength: number): ITreeNodeData[];
            new (...items: ITreeNodeData[]): ITreeNodeData[];
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
}>>, {
    params: import("@ibiz-template/core").IApiParams;
    mdctrlActiveMode: number;
    singleSelect: boolean;
    navigational: boolean;
    loadDefault: boolean;
    checkStrictly: boolean;
    isSimple: boolean;
}, {}>;
