import { GridRowState } from '@ibiz-template/runtime';
import { Ref } from 'vue';
import { DynamicColumnController } from '../dynamic-column.controller';
export declare function useRowEdit(props: {
    readonly row: GridRowState;
    readonly controller: DynamicColumnController;
}, _componentRef: Ref<any>): {
    gridEditItemProps: {
        stopPropagation: boolean;
    };
    editorProps: {
        disabled: boolean;
        readonly: boolean;
    };
};
