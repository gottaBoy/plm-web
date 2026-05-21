import { IPanelItemProvider, PanelController, PanelItemController } from '@ibiz-template/runtime';
import { IPanelItem } from '@ibiz/model-core';
import { DataInfoTitleController } from './data-info-title.controller';
/**
 * 信息标题适配器
 * @export
 * @class DataInfoTitleProvider
 * @implements {IControlProvider}
 */
export declare class DataInfoTitleProvider implements IPanelItemProvider {
    component: string;
    createController(panelItem: IPanelItem, panel: PanelController, parent: PanelItemController | undefined): Promise<DataInfoTitleController>;
}
