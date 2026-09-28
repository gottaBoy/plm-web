import type {
  IPanelItemProvider,
  PanelController,
  PanelItemController,
} from '@ibiz-template/runtime';
import type { IPanelItem } from '@ibiz/model-core';
import { DataInfoTitleController } from './data-info-title.controller';

export class DataInfoTitleProvider implements IPanelItemProvider {
  component = 'IBizDataInfoTitle';

  async createController(
    panelItem: IPanelItem,
    panel: PanelController,
    parent: PanelItemController | undefined,
  ): Promise<DataInfoTitleController> {
    const controller = new DataInfoTitleController(panelItem, panel, parent);
    await controller.init();
    return controller;
  }
}
