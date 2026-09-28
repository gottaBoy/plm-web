import {
  computed,
  defineComponent,
  h,
  nextTick,
  ref,
  resolveComponent,
  type PropType,
} from 'vue';
import { isNil } from 'ramda';
import { RuntimeError } from '@ibiz-template/core';
import { useNamespace } from '@ibiz-template/vue3-util';
import type { GridRowState } from '@ibiz-template/runtime';
import { DynamicColumnController } from './dynamic-column.controller';
import { useAllEdit, useCellEdit, useRowEdit } from './hook';
import type { EditModeBindings } from './hook/types';

export const DynamicColumn = defineComponent({
  name: 'IBizDynamicColumn',
  props: {
    controller: { type: Object as PropType<DynamicColumnController>, required: true },
    row: { type: Object as PropType<GridRowState>, required: true },
    attrs: { type: Object as PropType<IData>, required: false },
  },
  setup(props) {
    const ns = useNamespace('dynamic-column');
    const componentRef = ref();
    const controller = computed(() => props.controller.getDynamicController(props.row.data));
    const selectEditMode = (): EditModeBindings => {
      switch ((controller.value.grid as IData).editShowMode) {
        case 'cell': return useCellEdit(props, componentRef);
        case 'row': return useRowEdit(props);
        case 'all': return useAllEdit(props);
        default:
          throw new RuntimeError(ibiz.i18n.t('control.common.noSupportItem', {
            name: (controller.value.grid as IData).editShowMode,
          }));
      }
    };
    const { gridEditItemProps, editorProps } = selectEditMode();
    const rowDataChange = async (
      value: unknown,
      name?: string,
      ignore = false,
    ): Promise<void> => {
      ibiz.log.debug(`${controller.value.fieldName}值变更`, value);
      if (gridEditItemProps.isEscOut) {
        gridEditItemProps.isEscOut = false;
        const data = props.row.data;
        const previousValue = data[controller.value.fieldName];
        data[controller.value.fieldName] = null;
        nextTick(() => {
          data[controller.value.fieldName] = previousValue;
        });
        return;
      }
      await (controller.value.setRowValue as unknown as (
        row: GridRowState,
        value: unknown,
        name?: string,
        ignore?: boolean,
      ) => Promise<void>)(props.row, value, name, ignore);
    };
    const infoText = ref<string>();
    const tooltip = computed(() => {
      if (editorProps.readonly) {
        return isNil(infoText.value)
          ? controller.value.formatValue(props.row.data[controller.value.fieldName])
          : infoText.value;
      }
    });
    const onInfoTextChange = (text: string): void => {
      infoText.value = text;
    };
    return {
      c: controller,
      ns,
      tooltip,
      editorProps,
      componentRef,
      gridEditItemProps,
      rowDataChange,
      onInfoTextChange,
    };
  },
  render() {
    const value = this.row.data[this.c.fieldName];
    return h(resolveComponent('iBizGridEditItem'), {
      ref: 'componentRef',
      required: !this.c.editItem.allowEmpty,
      error: this.row.errors[this.c.fieldName],
      overflowMode: this.c.grid.overflowMode,
      class: [
        this.ns.b(),
        this.ns.m(this.c.grid.overflowMode),
        this.controller.model.cellSysCss?.cssName,
      ],
      ...this.gridEditItemProps,
    }, {
      default: () => [
        this.c.editorProvider && h(resolveComponent(this.c.editorProvider.gridEditor), {
          class: this.ns.e('editor'),
          value,
          data: this.row.data,
          key: this.c.model.id,
          controller: this.c.editor,
          overflowMode: this.c.grid.overflowMode,
          onChange: this.rowDataChange,
          onInfoTextChange: this.onInfoTextChange,
          title: this.tooltip,
          ...this.editorProps,
          ...this.attrs,
        }),
      ],
    });
  },
});
