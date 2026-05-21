import { PropType, VNode } from 'vue';
import { IDEToolbar, IDEToolbarItem } from '@ibiz/model-core';
import { IControlProvider, IExtraButton } from '@ibiz-template/runtime';
import { DynaTypeToolbarController } from './dyna-type-toolbar.controller';
export declare const DynaTypeToolbar: import("vue").DefineComponent<{
    /**
     * @description 工具栏模型数据
     */
    modelData: {
        type: PropType<IDEToolbar>;
        required: true;
    };
    /**
     * @description 绘制模式
     */
    runMode: {
        type: PropType<"DESIGN" | "RUNTIME">;
        default: string;
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
     * @description 是否手动计算按钮状态,即工具栏自身默认不计算权限
     * @default false
     */
    manualCalcButtonState: {
        type: BooleanConstructor;
        default: boolean;
    };
}, {
    c: DynaTypeToolbarController;
    btnSize: import("vue").Ref<string>;
    ns: import("@ibiz-template/core").Namespace;
    toolbarStyle: string | undefined;
    handleClick: (item: IDEToolbarItem, event: MouseEvent, params?: IData) => Promise<void>;
    renderExtraButtons: (extraButtons: IExtraButton[]) => VNode[];
    renderToolbarItem: (item: IDEToolbarItem) => VNode | null;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "click"[], "click", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * @description 工具栏模型数据
     */
    modelData: {
        type: PropType<IDEToolbar>;
        required: true;
    };
    /**
     * @description 绘制模式
     */
    runMode: {
        type: PropType<"DESIGN" | "RUNTIME">;
        default: string;
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
     * @description 是否手动计算按钮状态,即工具栏自身默认不计算权限
     * @default false
     */
    manualCalcButtonState: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onClick?: ((...args: any[]) => any) | undefined;
}, {
    params: import("@ibiz-template/core").IApiParams;
    runMode: "DESIGN" | "RUNTIME";
    manualCalcButtonState: boolean;
}, {}>;
