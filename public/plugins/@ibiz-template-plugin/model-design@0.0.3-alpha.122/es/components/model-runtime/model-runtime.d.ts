import { IModal } from '@ibiz-template/runtime';
import { IAppDataEntity } from '@ibiz/model-core';
import { PropType } from 'vue';
import './model-runtime.scss';
declare const _default: import("vue").DefineComponent<{
    title: {
        type: StringConstructor;
    };
    modal: {
        type: PropType<IModal>;
    };
    entity: {
        type: PropType<IAppDataEntity>;
        required: true;
    };
    context: {
        type: PropType<import("@ibiz-template/core").IApiContext>;
        default: () => {};
    };
    params: {
        type: PropType<import("@ibiz-template/core").IApiParams>;
        default: () => {};
    };
}, {
    ns: import("@ibiz-template/core").Namespace;
    url: import("vue").ComputedRef<string>;
    headers: import("vue").ComputedRef<{
        psdevslnsys: any;
        Authorization: string;
        'Content-Type': string;
    }>;
    parentKey: import("vue").ComputedRef<string>;
    configBaseUrl: string;
    onClose: () => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    title: {
        type: StringConstructor;
    };
    modal: {
        type: PropType<IModal>;
    };
    entity: {
        type: PropType<IAppDataEntity>;
        required: true;
    };
    context: {
        type: PropType<import("@ibiz-template/core").IApiContext>;
        default: () => {};
    };
    params: {
        type: PropType<import("@ibiz-template/core").IApiParams>;
        default: () => {};
    };
}>>, {
    context: import("@ibiz-template/core").IApiContext;
    params: import("@ibiz-template/core").IApiParams;
}, {}>;
export default _default;
