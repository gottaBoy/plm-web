import { computed, reactive } from 'vue';
import type { DynamicColumnProps, EditModeBindings } from './types';

export function useAllEdit(props: DynamicColumnProps): EditModeBindings {
  const controller = computed(() =>
    props.controller.getDynamicController(props.row.data),
  );
  const disabled = computed(
    () => props.row.editColStates[controller.value.fieldName].disabled,
  );
  const readonly = computed(
    () => props.row.editColStates[controller.value.fieldName].readonly,
  );
  const grid = props.controller.grid as IData;
  const rowEditOpen = computed(() => grid.state.rowEditOpen);

  const onBlur = (): void => {
    if ((controller.value.grid as IData).editSaveMode === 'cell-blur') {
      (controller.value.grid as IData).save(props.row.data);
    }
  };

  return {
    gridEditItemProps: reactive({ stopPropagation: rowEditOpen }),
    editorProps: reactive({
      disabled: computed(() => rowEditOpen.value && disabled.value),
      readonly: computed(() => readonly.value || !rowEditOpen.value),
      onBlur,
    }),
  };
}
