import { PropType } from 'vue';
import { IPanelButton } from '@ibiz/model-core';
import { AIAssistantButtonController } from './ai-assistant-button.controller';

/**
 * AI面板按钮
 * @primary
 * @description 面板中最常见的按钮组件，支持配置界面行为、界面逻辑等，同时支持权限配置是否显示、是否禁用。
 */
export declare const AIAssistantButton: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    /**
     * @description 面板项模型数据
     */
    modelData: {
        type: PropType<IPanelButton>;
        required: true;
    };
    /**
     * @description 面板项控制器
     */
    controller: {
        type: typeof AIAssistantButtonController;
        required: true;
    };
}>, {
    ns: any;
    btnRef: import('vue').Ref<any, any>;
    state: import('./ai-assistant-button.state').AIAssistantState;
    sysImage: import('@ibiz/model-core').ISysImage | undefined;
    tooltip: string;
    tempStyle: import('vue').Ref<string, string>;
    adsorption: import('vue').Ref<string, string>;
    positionStyle: import('vue').Ref<any, any>;
    handleButtonClick: (event: MouseEvent) => Promise<void>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    /**
     * @description 面板项模型数据
     */
    modelData: {
        type: PropType<IPanelButton>;
        required: true;
    };
    /**
     * @description 面板项控制器
     */
    controller: {
        type: typeof AIAssistantButtonController;
        required: true;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export default AIAssistantButton;
