import { PropType } from 'vue';
import { IModelTreeNodeData } from './interface';
import './model-tree.scss';
declare const _default: import("vue").DefineComponent<{
    context: {
        type: PropType<import("@ibiz-template/core").IApiContext>;
        default: () => {};
    };
    params: {
        type: PropType<import("@ibiz-template/core").IApiParams>;
        default: () => {};
    };
    modelStr: {
        type: StringConstructor;
        required: true;
    };
}, {
    ns: import("@ibiz-template/core").Namespace;
    UUID: import("vue").Ref<string>;
    expandedKeys: import("vue").Ref<string[]>;
    load: (item: IData, callback: (_nodes: IModelTreeNodeData[]) => void) => Promise<void>;
    renderEditor: (data: IModelTreeNodeData) => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | undefined;
    onExpandChange: (id: string, isExpand: boolean) => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (_value: string) => true;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    context: {
        type: PropType<import("@ibiz-template/core").IApiContext>;
        default: () => {};
    };
    params: {
        type: PropType<import("@ibiz-template/core").IApiParams>;
        default: () => {};
    };
    modelStr: {
        type: StringConstructor;
        required: true;
    };
}>> & {
    onChange?: ((_value: string) => any) | undefined;
}, {
    context: import("@ibiz-template/core").IApiContext;
    params: import("@ibiz-template/core").IApiParams;
}, {}>;
export default _default;
