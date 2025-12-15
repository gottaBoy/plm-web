import { ISearchBar } from '@ibiz/model-core';

/**
 * 搜索栏服务
 *
 * @export
 * @class OdooSearchBarService
 */
export declare class OdooSearchBarService {
    private readonly model;
    private context;
    /**
     * 应用配置服务
     *
     * @type {ConfigService}
     */
    private config;
    /**
     * Creates an instance of OdooSearchBarService.
     * @param {ISearchBar} model
     * @param {IContext} context
     * @memberof OdooSearchBarService
     */
    constructor(model: ISearchBar, context: IContext);
    /**
     * 保存
     *
     * @param {IData} data
     * @return {*}  {Promise<void>}
     * @memberof OdooSearchBarService
     */
    save(data: IData): Promise<void>;
    /**
     * 加载
     *
     * @return {*}  {Promise<IData>}
     * @memberof OdooSearchBarService
     */
    load(): Promise<IData>;
}
