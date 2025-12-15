import { PropType } from 'vue';
import { IModal } from '@ibiz-template/runtime';
import './model-edit-view.scss';
declare const _default: import("vue").DefineComponent<{
    context: {
        type: PropType<import("@ibiz-template/core").IApiContext>;
        default: () => {};
    };
    params: {
        type: PropType<import("@ibiz-template/core").IApiParams>;
        default: () => {};
    };
    modal: {
        type: PropType<IModal>;
    };
    caption: {
        type: StringConstructor;
        default: string;
    };
    codeName: {
        type: StringConstructor;
        required: true;
    };
    readonly: {
        type: BooleanConstructor;
    };
}, {
    ns: import("@ibiz-template/core").Namespace;
    value: import("vue").Ref<string>;
    loading: import("vue").Ref<boolean>;
    loadingText: import("vue").Ref<string>;
    closeView: () => void;
    save: (isClose?: boolean) => Promise<void>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    context: {
        type: PropType<import("@ibiz-template/core").IApiContext>;
        default: () => {};
    };
    params: {
        type: PropType<import("@ibiz-template/core").IApiParams>;
        default: () => {};
    };
    modal: {
        type: PropType<IModal>;
    };
    caption: {
        type: StringConstructor;
        default: string;
    };
    codeName: {
        type: StringConstructor;
        required: true;
    };
    readonly: {
        type: BooleanConstructor;
    };
}>>, {
    context: import("@ibiz-template/core").IApiContext;
    params: import("@ibiz-template/core").IApiParams;
    caption: string;
    readonly: boolean;
}, {}>;
export default _default;
