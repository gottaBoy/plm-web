import { PanelItemController } from '@ibiz-template/runtime';
import { DataInfoTitleState, IDataInfoTitleState } from './data-info-title.state';
/**
 * 信息标题控制器
 * @export
 * @class DataInfoTitleController
 * @extends {ControlController}
 */
export declare class DataInfoTitleController extends PanelItemController {
    /**
     * 面板项状态
     *
     * @type {DataInfoTitleState}
     */
    state: DataInfoTitleState;
    protected onInit(): Promise<void>;
    /**
     * 创建面板状态对象
     *
     * @protected
     * @return {*}  {IDataInfoTitleState}
     */
    protected createState(): IDataInfoTitleState;
}
