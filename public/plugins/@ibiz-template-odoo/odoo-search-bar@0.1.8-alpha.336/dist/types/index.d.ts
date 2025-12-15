import { App } from 'vue';

export declare const IBizOdooSearchBarControl: import('@ibiz-template/vue3-util').TypeWithInstall<import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    modelData: {
        type: import('vue').PropType<import('@ibiz/model-core').ISearchBar>;
        required: true;
    };
    context: {
        type: import('vue').PropType<IContext>;
        required: true;
    };
    params: {
        type: import('vue').PropType<IParams>;
        default: () => {};
    };
    provider: {
        type: import('vue').PropType<import('@ibiz-template/runtime').IControlProvider>;
    };
}>, {
    c: import('./odoo-search-bar.controller').OdooSearchBarController;
    ns: import('@ibiz-template/core').Namespace;
    popperStyle: {
        zIndex: number;
    };
    dropDownRef: import('vue').Ref<HTMLDivElement | undefined, HTMLDivElement | undefined>;
    dropDownVisible: import('vue').Ref<boolean, boolean>;
    renderList: (type: import('./interfaces').SearchItemType) => import("vue/jsx-runtime").JSX.Element | undefined;
    renderDefault: () => import("vue/jsx-runtime").JSX.Element;
    onPopoverHide: () => void;
    onPopoverShow: () => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    modelData: {
        type: import('vue').PropType<import('@ibiz/model-core').ISearchBar>;
        required: true;
    };
    context: {
        type: import('vue').PropType<IContext>;
        required: true;
    };
    params: {
        type: import('vue').PropType<IParams>;
        default: () => {};
    };
    provider: {
        type: import('vue').PropType<import('@ibiz-template/runtime').IControlProvider>;
    };
}>> & Readonly<{}>, {
    params: import('@ibiz-template/core').IApiParams;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>>;
declare const _default: {
    install(app: App): void;
};
export default _default;
