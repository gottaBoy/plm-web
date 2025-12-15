import { DEService } from '@ibiz-template/runtime';
import { generateOrderValue } from 'qx-util';
import '../../entity/index.mjs';
import { PSDEFDLogic } from '../../entity/psdefdlogic/psdefdlogic.mjs';

"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class PSDEFDLogicService extends DEService {
  constructor(srfSessionId, model) {
    super(srfSessionId, model);
    /**
     * 类型代码表
     * @author lxm
     * @date 2023-12-27 05:06:47
     * @protected
     * @type {ICodeItem[]}
     */
    __publicField(this, "typeCodeItems");
    const app = ibiz.hub.getApp(model.appId);
    this.typeCodeItems = app.codeList.getCodeList(
      "Config__FDLogicType"
    ).codeItems;
  }
  newEntity(data) {
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
  async fillDefault(context, params) {
    const res = await this.fetchDefault(context);
    if (res && res.ok && Array.isArray(res.data)) {
      const orderValue = Math.max(
        ...res.data.map((item) => item.ordervalue || 0),
        0
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
  async exec(id, context, params, params2, header) {
    if (id === "create" && params) {
      await this.fillDefault(context, params);
    }
    return super.exec(id, context, params, params2, header);
  }
}

export { PSDEFDLogicService };
