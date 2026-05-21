import { MenuItem } from '@imengyu/vue3-context-menu';
import { IDEToolbarItem } from '@ibiz/model-core';
import { ITreeNodeData, IButtonContainerState } from '@ibiz-template/runtime';
import { KnowledgeGraphController } from './knowledge-graph.controller';
export declare function useContextMenu(c: KnowledgeGraphController): {
    calcContextMenuItems: (items: IDEToolbarItem[], nodeData: ITreeNodeData, menuState: IButtonContainerState, ContextMenu: IData) => MenuItem[];
};
