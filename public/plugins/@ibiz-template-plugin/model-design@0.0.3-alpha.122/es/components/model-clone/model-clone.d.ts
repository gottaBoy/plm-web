import { IDEEditForm } from '@ibiz/model-core';
import { IModal, EventBase } from '@ibiz-template/runtime';
import { PropType } from 'vue';
import { IModelData } from '../../interface';
import './model-clone.scss';
declare const _default: import("vue").DefineComponent<{
    item: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        required: true;
    };
    modal: {
        type: PropType<IModal>;
        required: true;
    };
    params: {
        type: PropType<import("@ibiz-template/core").IApiParams>;
        default: () => {};
    };
    modelData: {
        type: PropType<IDEEditForm>;
        required: true;
    };
    context: {
        type: PropType<import("@ibiz-template/core").IApiContext>;
        default: () => {};
    };
}, {
    ns: import("@ibiz-template/core").Namespace;
    data: import("vue").Ref<IModelData | undefined>;
    isLoaded: import("vue").Ref<boolean>;
    onCancel: () => void;
    onConfirm: () => Promise<boolean>;
    onFormDataChange: (event: EventBase) => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    item: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        required: true;
    };
    modal: {
        type: PropType<IModal>;
        required: true;
    };
    params: {
        type: PropType<import("@ibiz-template/core").IApiParams>;
        default: () => {};
    };
    modelData: {
        type: PropType<IDEEditForm>;
        required: true;
    };
    context: {
        type: PropType<import("@ibiz-template/core").IApiContext>;
        default: () => {};
    };
}>>, {
    context: import("@ibiz-template/core").IApiContext;
    params: import("@ibiz-template/core").IApiParams;
}, {}>;
export default _default;
