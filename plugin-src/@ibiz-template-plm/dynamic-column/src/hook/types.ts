import type { GridRowState } from '@ibiz-template/runtime';
import type { DynamicColumnController } from '../dynamic-column.controller';

export interface DynamicColumnProps {
  readonly row: GridRowState;
  readonly controller: DynamicColumnController;
}

export interface GridEditItemProps {
  stopPropagation: boolean;
  showEditMask?: boolean;
  isEscOut?: boolean;
  onMaskClick?: () => void;
}

export interface EditorProps {
  disabled: boolean;
  readonly: boolean;
  autoFocus?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
}

export interface EditModeBindings {
  gridEditItemProps: GridEditItemProps;
  editorProps: EditorProps;
}
