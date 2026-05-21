import { ITreeNodeData, TreeController } from '@ibiz-template/runtime';
import { Graph } from '@antv/g6';
import { Node, Edge } from './vo';
export declare class KnowledgeGraphController extends TreeController {
    /**
     * @description 画布对象
     * @type {Graph}
     * @memberof KnowledgeGraphController
     */
    graph?: Graph;
    /**
     * @description 节点列表
     * @type {Node[]}
     * @memberof KnowledgeGraphController
     */
    nodes: Node[];
    /**
     * @description 连线列表
     * @type {Edge[]}
     * @memberof KnowledgeGraphController
     */
    edges: Edge[];
    /**
     * @description 加载参数
     * @type {IParams}
     * @memberof KnowledgeGraphController
     */
    loadParams: IParams;
    /**
     * @description 源节点标识属性
     * @type {string}
     * @memberof KnowledgeGraphController
     */
    sourceField: string;
    /**
     * @description 目标节点标识属性
     * @type {string}
     * @memberof KnowledgeGraphController
     */
    targetField: string;
    /**
     * @description 节点颜色列表
     * @type {string[]}
     * @memberof KnowledgeGraphController
     */
    colorList: string[];
    /**
     * @description 节点图标代码表标识
     * @type {string}
     * @memberof KnowledgeGraphController
     */
    iconCodeList: string;
    /**
     * @description 节点数据映射表
     * @type {Map<string, ITreeNodeData>}
     * @memberof KnowledgeGraphController
     */
    nodeDataMap: Map<string, ITreeNodeData>;
    /**
     * @description 节点图标映射表
     * @type {Map<string, string>}
     * @memberof KnowledgeGraphController
     */
    iconMap: Map<string, string>;
    /**
     * @description 挂载容器
     * @private
     * @type {HTMLElement}
     * @memberof KnowledgeGraphController
     */
    private container?;
    /**
     * @description 画布配置
     * @private
     * @type {GraphOptions}
     * @memberof KnowledgeGraphController
     */
    private options;
    /**
     * @description 生命周期
     * @protected
     * @returns {*}  {Promise<void>}
     * @memberof KnowledgeGraphController
     */
    protected onCreated(): Promise<void>;
    /**
     * @description 初始化画布
     * @param {HTMLElement} container 画布容器
     * @memberof KnowledgeGraphController
     */
    initGraph(container: HTMLElement): void;
    /**
     * @description 初始化节点图标映射表
     * @param {Set<string>} iconTypes 显示的节点图标类型
     * @return {*}  {Promise<void>}
     * @memberof KnowledgeGraphController
     */
    initIconMap(iconTypes: Set<string>): Promise<void>;
    /**
     * @description 加载节点后处理
     * @param {ITreeNodeData[]} nodes
     * @memberof KnowledgeGraphController
     */
    afterLoadNodes(nodes: ITreeNodeData[]): Promise<void>;
    /**
     * @description 隐藏元素
     * @param {(string | string[])} id
     * @param {('node' | 'edge')} [_type='node']
     * @returns {*}  {Promise<void>}
     * @memberof KnowledgeGraphController
     */
    hiddenElement(id: string | string[], _type?: 'node' | 'edge'): Promise<void>;
    /**
     * @description 高亮元素
     * @param {string | string[]} id 元素id
     * @param {('node' | 'edge')} [_type='node'] 元素类型
     * @memberof KnowledgeGraphController
     */
    highlightElement(id: string | string[], _type?: 'node' | 'edge'): Promise<void>;
    /**
     * @description 淡化元素
     * @param {string | string[]} id 元素id
     * @param {('node' | 'edge')} [_type='node'] 元素类型
     * @memberof KnowledgeGraphController
     */
    fadeElement(id: string | string[], _type?: 'node' | 'edge'): Promise<void>;
    /**
     * @description 清除元素高亮和淡化状态
     * @param {string | string[]} id 元素id
     * @param {('node' | 'edge')} [_type='node'] 元素类型
     * @memberof KnowledgeGraphController
     */
    clearElementState(id: string | string[], _type?: 'node' | 'edge'): Promise<void>;
    /**
     * @description 导出图片
     * @param {{ nodes?: string[], edges?: string[] }} [params] 导出指定元素，未指定时默认导出所有
     * @returns {*}  {Promise<void>}
     * @memberof KnowledgeGraphController
     */
    exportImage(params?: {
        nodes?: string[];
        edges?: string[];
    }): Promise<void>;
    /**
     * @description 重置
     * @memberof KnowledgeGraphController
     */
    reset(): Promise<void>;
    /**
     * @description 刷新画布
     * @param {IParams} [params={}] 刷新参数
     * @return {*}  {Promise<void>}
     * @memberof KnowledgeGraphController
     */
    reload(params?: IParams): Promise<void>;
}
