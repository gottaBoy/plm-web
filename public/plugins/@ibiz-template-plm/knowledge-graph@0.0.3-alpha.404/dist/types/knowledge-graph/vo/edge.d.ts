import { TreeDataSetNodeData } from '@ibiz-template/runtime';
export declare class Edge {
    /**
     * @description 标识
     * @type {string}
     * @memberof Edge
     */
    id: string;
    /**
     * @description 源节点标识
     * @type {string}
     * @memberof Edge
     */
    source: string;
    /**
     * @description 目标节点标识
     * @type {string}
     * @memberof Edge
     */
    target: string;
    /**
     * @description 数据
     * @type {Record<string, unknown>}
     * @memberof Edge
     */
    data?: Record<string, unknown>;
    [key: string]: unknown;
    constructor(data: TreeDataSetNodeData, sourceField: string, targetField: string);
}
