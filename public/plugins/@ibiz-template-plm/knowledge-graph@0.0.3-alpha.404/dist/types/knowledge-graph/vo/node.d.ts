import { TreeDataSetNodeData } from '@ibiz-template/runtime';
export declare class Node {
    /**
     * @description 标识
     * @type {string}
     * @memberof Node
     */
    id: string;
    /**
     * @description 数据
     * @type {Record<string, unknown>}
     * @memberof Node
     */
    data?: Record<string, unknown>;
    [key: string]: unknown;
    constructor(data: TreeDataSetNodeData);
}
