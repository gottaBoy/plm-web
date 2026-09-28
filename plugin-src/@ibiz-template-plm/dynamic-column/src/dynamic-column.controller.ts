import { GridFieldEditColumnController } from '@ibiz-template/runtime';

export class DynamicColumnController extends GridFieldEditColumnController {
  getDynamicController(data: IData): GridFieldEditColumnController {
    const { userParam } = this.model;
    if (!userParam?.dynamicColumn || !userParam?.condField) {
      return this;
    }
    const { dynamicColumn, condField } = userParam;
    return data[condField]
      ? (this.grid.columns[dynamicColumn] as GridFieldEditColumnController) ?? this
      : this;
  }
}
