import { GridController, IGridColumnProvider } from '@ibiz-template/runtime';
import { IDEGridFieldColumn } from '@ibiz/model-core';
import { DynamicColumnController } from './dynamic-column.controller';
/**
 * @description 动态列适配器
 * @export
 * @class DynamicColumnProvider
 * @implements {IGridColumnProvider}
 */
export declare class DynamicColumnProvider implements IGridColumnProvider {
    component: string;
    createController(columnModel: IDEGridFieldColumn, grid: GridController): Promise<DynamicColumnController>;
}
