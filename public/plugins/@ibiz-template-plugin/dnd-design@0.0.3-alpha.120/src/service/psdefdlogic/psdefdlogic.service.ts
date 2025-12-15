import { DEService, IDataEntity } from '@ibiz-template/runtime';
import { IAppDataEntity, ICodeItem } from '@ibiz/model-core';
import { IHttpResponse } from '@ibiz-template/core';
import { generateOrderValue } from 'qx-util';
import { PSDEFDLogic } from '../../entity';

/**
 * 表单项服务对象
 *
 * @author chitanda
 * @date 2023-12-23 18:12:50
 * @export
 * @class PSDEFDLogicService
 * @extends {DEService}
 */
export class PSDEFDLogicService extends DEService {
  /**
   * 类型代码表
   * @author lxm
   * @date 2023-12-27 05:06:47
   * @protected
   * @type {ICodeItem[]}
   */
  protected typeCodeItems: ICodeItem[];

  constructor(srfSessionId: string, model: IAppDataEntity) {
    super(srfSessionId, model);
    const app = ibiz.hub.getApp(model.appId);
    this.typeCodeItems = app.codeList.getCodeList(
      'Config__FDLogicType',
    )!.codeItems!;
  }

  protected newEntity(data: IData | IDataEntity): IDataEntity {
    if (data instanceof PSDEFDLogic) {
      return data.clone();
    }
    return new PSDEFDLogic(this.model, data, this.typeCodeItems);
  }

  /**
   * @description 填充默认数据
   * @protected
   * @param {IContext} context
   * @param {(IData | IData[])} params
   * @returns {*}  {Promise<void>}
   * @memberof PSDEFDLogicService
   */
  protected async fillDefault(
    context: IContext,
    params: IData | IData[],
  ): Promise<void> {
    const res = await this.fetchDefault(context);
    if (res && res.ok && Array.isArray(res.data)) {
      const orderValue = Math.max(
        ...res.data.map(item => item.ordervalue || 0),
        0,
      );
      const items = Array.isArray(params) ? params : [params];
      items.forEach((item, i) => {
        if (item.ordervalue == null) {
          item.ordervalue = orderValue + generateOrderValue(i);
        }
      });
    }
  }

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
  async exec(
    id: string,
    context: IContext,
    params?: IData | IData[],
    params2?: IParams,
    header?: IData,
  ): Promise<IHttpResponse<IData>> {
    if (id === 'create' && params) {
      await this.fillDefault(context, params);
    }
    return super.exec(id, context, params, params2, header);
  }
}
