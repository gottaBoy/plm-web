import { ISearchBar } from '@ibiz/model-core';
import { PropType } from 'vue';
import { IControlProvider } from '@ibiz-template/runtime';
import { OdooSearchBarController } from './odoo-search-bar.controller';
import { SearchItemType } from './interfaces';

export declare const OdooSearchBarControl: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    /**
     * @description 搜索栏模型数据
     */
    modelData: {
        type: PropType<ISearchBar>;
        required: true;
    };
    /**
     * @description 应用上下文对象
     */
    context: {
        type: PropType<IContext>;
        required: true;
    };
    /**
     * @description 视图参数对象
     * @default {}
     */
    params: {
        type: PropType<IParams>;
        default: () => {};
    };
    /**
     * @description 部件适配器
     */
    provider: {
        type: PropType<IControlProvider>;
    };
}>, {
    c: OdooSearchBarController;
    ns: import('@ibiz-template/core').Namespace;
    popperStyle: {
        zIndex: number;
    };
    dropDownRef: import('vue').Ref<HTMLDivElement | undefined, HTMLDivElement | undefined>;
    dropDownVisible: import('vue').Ref<boolean, boolean>;
    renderList: (type: SearchItemType) => import("vue/jsx-runtime").JSX.Element | undefined;
    renderDefault: () => import("vue/jsx-runtime").JSX.Element;
    onPopoverHide: () => void;
    onPopoverShow: () => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    /**
     * @description 搜索栏模型数据
     */
    modelData: {
        type: PropType<ISearchBar>;
        required: true;
    };
    /**
     * @description 应用上下文对象
     */
    context: {
        type: PropType<IContext>;
        required: true;
    };
    /**
     * @description 视图参数对象
     * @default {}
     */
    params: {
        type: PropType<IParams>;
        default: () => {};
    };
    /**
     * @description 部件适配器
     */
    provider: {
        type: PropType<IControlProvider>;
    };
}>> & Readonly<{}>, {
    params: import('@ibiz-template/core').IApiParams;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
