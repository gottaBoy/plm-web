import { IDEUIActionGroup, IAppDEUIActionGroupDetail } from '@ibiz/model-core';
export declare function createUUID(): string;
/**
 * @description 计算单个动态界面行为组项数据
 * @export
 * @param {IData} refUIActionGroup
 * @param {IContext} context
 * @param {IParams} params
 * @returns {*}  {Promise<IAppDEUIActionGroupDetail[]>}
 */
export declare function calcDyUiactionGroup(refUIActionGroup: IData, context: IContext, params: IParams): Promise<IAppDEUIActionGroupDetail[]>;
/**
 * @description 处理界面行为组，动态界面行为组需请求数据并生成成员项模型
 * @export
 * @param {IDEUIActionGroup} uiactionGroup
 * @param {IContext} context
 * @param {IParams} params
 * @returns {*}  {Promise<IDEUIActionGroup>}
 */
export declare function calcDynaUIActionGroup(uiactionGroup: IDEUIActionGroup, context: IContext, params: IParams): Promise<IDEUIActionGroup>;
