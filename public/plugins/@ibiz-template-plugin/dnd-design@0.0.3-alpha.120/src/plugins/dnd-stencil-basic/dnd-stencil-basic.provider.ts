import {
  IPanelItemController,
  IPanelItemProvider,
  IPanelController,
} from '@ibiz-template/runtime';
import { IPanelItem } from '@ibiz/model-core';
import { DndStencilBasicController } from './dnd-stencil-basic.controller';

export class DndStencilBasicProvider implements IPanelItemProvider {
  component = 'IBizDndStencilPanelItem';

  async createController(
    panelItem: IPanelItem,
    panel: IPanelController,
    parent?: IPanelItemController,
  ): Promise<IPanelItemController> {
    const c = new DndStencilBasicController(panelItem, panel, parent);
    await c.init();
    return c;
  }
}
