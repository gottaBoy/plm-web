import { GridRowState } from '@ibiz-template/runtime';
import { Ref } from 'vue';
import { DynamicColumnController } from '../dynamic-column.controller';
export declare function useCellEdit(props: {
    readonly row: GridRowState;
    readonly controller: DynamicColumnController;
}, componentRef: Ref<any>): {
    gridEditItemProps: {
        showEditMask: boolean;
        stopPropagation: boolean;
        isEscOut: boolean;
        onMaskClick: () => void;
    };
    editorProps: {
        autoFocus: boolean;
        disabled: boolean;
        readonly: boolean;
        onBlur: () => void;
        onFocus: () => void;
    };
};
