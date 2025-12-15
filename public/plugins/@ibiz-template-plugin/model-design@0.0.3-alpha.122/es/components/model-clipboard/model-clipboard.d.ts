import { IModal } from '@ibiz-template/runtime';
import { PropType } from 'vue';
import './model-clipboard.scss';
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
    type: {
        type: PropType<"default" | "advanced">;
        default: string;
    };
}, {
    ns: import("@ibiz-template/core").Namespace;
    controller: import("../../controller/model-clipboard-controller/model-clipboard-controller").ModelClipboardController;
    removeAll: () => Promise<void>;
    close: () => void;
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
    type: {
        type: PropType<"default" | "advanced">;
        default: string;
    };
}>>, {
    context: import("@ibiz-template/core").IApiContext;
    params: import("@ibiz-template/core").IApiParams;
    type: "default" | "advanced";
}, {}>;
export default _default;
