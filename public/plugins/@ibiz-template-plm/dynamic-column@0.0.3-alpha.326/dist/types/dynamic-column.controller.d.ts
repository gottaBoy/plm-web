import { GridFieldEditColumnController } from '@ibiz-template/runtime';
/**
 * @description 动态列控制器
 * @export
 * @class DynamicColumnController
 * @extends {GridFieldEditColumnController}
 */
export declare class DynamicColumnController extends GridFieldEditColumnController {
    /**
     * @description 返回动态列控制器
     * @param {IData} data
     * @returns {*}  {GridColumnController}
     * @memberof DynamicColumnController
     */
    getDynamicController(data: IData): GridFieldEditColumnController;
}
