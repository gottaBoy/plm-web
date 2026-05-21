import { PropType } from 'vue';
import { IUIAction, IUIActionMessage } from '../type';

export declare const CustomMessage: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    item: {
        type: PropType<IUIActionMessage>;
        required: true;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    readonly: {
        type: BooleanConstructor;
        default: boolean;
    };
    search: {
        type: PropType<(query: string) => Promise<IUIAction[]>>;
        required: true;
    };
}>, {
    ns: import('@ibiz-template/core').Namespace;
    renderContent: () => import("vue/jsx-runtime").JSX.Element | undefined;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, ("delete" | "change")[], "delete" | "change", import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    item: {
        type: PropType<IUIActionMessage>;
        required: true;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    readonly: {
        type: BooleanConstructor;
        default: boolean;
    };
    search: {
        type: PropType<(query: string) => Promise<IUIAction[]>>;
        required: true;
    };
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
    onDelete?: ((...args: any[]) => any) | undefined;
}>, {
    disabled: boolean;
    readonly: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
