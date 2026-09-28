import { computed, reactive } from 'vue';
import type { DynamicColumnProps, EditModeBindings } from './types';

export function useRowEdit(props: DynamicColumnProps): EditModeBindings {
  const controller = computed(() =>
    props.controller.getDynamicController(props.row.data),
  );
  const disabled = computed(
    () => props.row.editColStates[controller.value.fieldName].disabled,
  );
  const readonly = computed(
    () => props.row.editColStates[controller.value.fieldName].readonly,
  );
  const editable = computed(
    () => props.row.editColStates[controller.value.fieldName].editable,
  );

  return {
    gridEditItemProps: reactive({ stopPropagation: editable }),
    editorProps: reactive({
      disabled: computed(() => editable.value && disabled.value),
      readonly: computed(() => readonly.value || !editable.value),
    }),
  };
}
