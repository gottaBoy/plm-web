import { IPanelItemProvider, PanelController, PanelItemController } from '@ibiz-template/runtime';
import { IPanelItem } from '@ibiz/model-core';
import { AIAssistantButtonController } from './ai-assistant-button.controller';

/**
 * AI面板按钮适配器
 *
 * @export
 * @class AIAssistantButtonProvider
 * @implements {IPanelItemProvider}
 */
export declare class AIAssistantButtonProvider implements IPanelItemProvider {
    component: string;
    createController(panelItem: IPanelItem, panel: PanelController, parent: PanelItemController | undefined): Promise<AIAssistantButtonController>;
}
