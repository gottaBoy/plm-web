import type { GridController, IGridColumnProvider } from '@ibiz-template/runtime';
import type { IDEGridFieldColumn } from '@ibiz/model-core';
import { DynamicColumnController } from './dynamic-column.controller';

export class DynamicColumnProvider implements IGridColumnProvider {
  component = 'IBizDynamicColumn';

  async createController(
    columnModel: IDEGridFieldColumn,
    grid: GridController,
  ): Promise<DynamicColumnController> {
    const controller = new DynamicColumnController(columnModel, grid);
    await controller.init();
    return controller;
  }
}
