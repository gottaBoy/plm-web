import { computed, onUnmounted, reactive, ref, type Ref } from 'vue';
import { listenJSEvent, NOOP } from '@ibiz-template/core';
import { useClickOutside } from '@ibiz-template/vue3-util';
import type { DynamicColumnProps, EditModeBindings } from './types';

export function useCellEdit(
  props: DynamicColumnProps,
  componentRef: Ref,
): EditModeBindings {
  const controller = computed(() =>
    props.controller.getDynamicController(props.row.data),
  );
  const disabled = computed(
    () => props.row.editColStates[controller.value.fieldName].disabled,
  );
  const readonly = computed(
    () => props.row.editColStates[controller.value.fieldName].readonly,
  );
  const hasError = computed(
    () => !!props.row.errors[controller.value.fieldName],
  );
  const editable = computed(
    () => props.row.editColStates[controller.value.fieldName].editable,
  );
  const setEditable = (value: boolean): void => {
    props.row.editColStates[controller.value.fieldName].editable = value;
  };
  const canEdit = computed(
    () => !disabled.value && !readonly.value && !hasError.value,
  );
  const editorActive = computed(
    () => hasError.value || (canEdit.value && editable.value),
  );
  const isEscOut = ref(false);
  let outsideListener: ReturnType<typeof useClickOutside> | undefined;

  const onMaskClick = (): void => {
    setEditable(true);
    outsideListener = useClickOutside(
      componentRef as unknown as Parameters<typeof useClickOutside>[0],
      async () => {
        setEditable(false);
        outsideListener?.stop();
      },
    );
  };
  const onFocus = (): void => {
    outsideListener?.stop();
    ibiz.log.debug(`${controller.value.fieldName}属性编辑器focus事件`);
  };
  const onBlur = (): void => {
    ibiz.log.debug(`${controller.value.fieldName}属性编辑器blur事件`);
    setEditable(false);
    if ((controller.value.grid as IData).editSaveMode === 'cell-blur') {
      (controller.value.grid as IData).save(props.row.data);
    }
  };

  const stopKeyup = listenJSEvent(window, 'keyup', event => {
    if (event.code === 'Escape' && editable.value) {
      setEditable(false);
      isEscOut.value = true;
    }
  });
  onUnmounted(() => {
    if (stopKeyup !== NOOP) stopKeyup();
  });

  return {
    gridEditItemProps: reactive({
      showEditMask: computed(() => canEdit.value && !editable.value),
      stopPropagation: computed(() => canEdit.value || editorActive.value),
      isEscOut,
      onMaskClick,
    }),
    editorProps: reactive({
      autoFocus: computed(() => !hasError.value),
      disabled: false,
      readonly: computed(() => !editorActive.value),
      onBlur,
      onFocus,
    }),
  };
}
