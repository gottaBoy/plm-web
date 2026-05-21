import { DEService, IDataEntity } from '@ibiz-template/runtime';
import { IAppDataEntity, ICodeItem } from '@ibiz/model-core';
import { IHttpResponse } from '@ibiz-template/core';
/**
 * 表单项服务对象
 *
 * @author chitanda
 * @date 2023-12-23 18:12:50
 * @export
 * @class PSDEFDLogicService
 * @extends {DEService}
 */
export declare class PSDEFDLogicService extends DEService {
    /**
     * 类型代码表
     * @author lxm
     * @date 2023-12-27 05:06:47
     * @protected
     * @type {ICodeItem[]}
     */
    protected typeCodeItems: ICodeItem[];
    constructor(srfSessionId: string, model: IAppDataEntity);
    protected newEntity(data: IData | IDataEntity): IDataEntity;
    /**
     * @description 填充默认数据
     * @protected
     * @param {IContext} context
     * @param {(IData | IData[])} params
     * @returns {*}  {Promise<void>}
     * @memberof PSDEFDLogicService
     */
    protected fillDefault(context: IContext, params: IData | IData[]): Promise<void>;
    /**
     * @description 执行服务方法
     * @param {string} id
     * @param {IContext} context
     * @param {(IData | IData[])} [params]
     * @param {IParams} [params2]
     * @param {IData} [header]
     * @returns {*}  {Promise<IHttpResponse<IData>>}
     * @memberof PSDEFDLogicService
     */
    exec(id: string, context: IContext, params?: IData | IData[], params2?: IParams, header?: IData): Promise<IHttpResponse<IData>>;
}
