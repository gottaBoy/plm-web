import { ISearchBarFilter } from '@ibiz/model-core';

export type ISchemaField = {
    type: string;
    key: string;
    description: string;
    enumSource?: string;
};
/**
 * 根据json模型计算出过滤项模型
 * @author lxm
 * @date 2024-01-02 10:27:40
 * @export
 * @param {IData} json
 * @param {SearchBarController} c
 * @return {*}  {ISearchBarFilter[]}
 */
export declare function calcFilterModelBySchema(json: IData, appDataEntityId: string, modelAppId: string): Promise<{
    schemaFields: ISchemaField[];
    searchBarFilters: ISearchBarFilter[];
}>;
