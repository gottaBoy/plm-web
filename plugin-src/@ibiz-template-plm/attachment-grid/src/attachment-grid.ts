import { useControlController, useNamespace } from '@ibiz-template/vue3-util';

import {
  ref,
  createVNode,
  resolveComponent,
  defineComponent,
  createTextVNode,
} from 'vue';

import { AttachGridController } from './attachment-grid.controller';

import {
  useITableEvent,
  usePagination,
  useAppGridBase,
} from './grid-control.util';

import { useRowEditPopover } from './use-row-edit-popover';

import { renderGridColumns } from './grid-column-render';

const AttachmentGridControl = defineComponent({
  name: 'AttachmentGridControl',
  props: {
    modelData: {
      type: Object,
      required: true,
    },
    context: {
      type: Object,
      required: true,
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    provider: {
      type: Object,
    },
    /**
     * 部件行数据默认激活模式
     * - 0 不激活
     * - 1 单击激活
     * - 2 双击激活(默认值)
     *
     * @type {(number | 0 | 1 | 2)}
     */
    mdctrlActiveMode: {
      type: Number,
      default: void 0,
    },
    singleSelect: {
      type: Boolean,
      default: void 0,
    },
    rowEditOpen: {
      type: Boolean,
      default: void 0,
    },
    isSimple: {
      type: Boolean,
      required: false,
    },
    data: {
      type: Array,
      required: false,
    },
    loadDefault: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const controller = useControlController(
        (...w) => new AttachGridController(...w),
      ),
      namespace = useNamespace(
        'control-'.concat(controller.model.controlType.toLowerCase()),
      ),
      {
        tableRef: tableRef,
        onRowClick: onRowClick,
        onDbRowClick: onDbRowClick,
        onSelectionChange: onSelectionChange,
        onSortChange: onSortChange,
        handleRowClassName: handleRowClassName,
        handleHeaderCellClassName: handleHeaderCellClassName,
      } = useITableEvent(controller),
      {
        onPageChange: onPageChange,
        onPageRefresh: onPageRefresh,
        onPageSizeChange: onPageSizeChange,
      } = usePagination(controller),
      renderNoData = () => {
        var k;
        const { isLoaded: w } = controller.state;
        if (w) {
          const b =
            (k = controller.model.controls) == null
              ? void 0
              : k.find(
                  G =>
                    G.name ===
                    ''.concat(controller.model.name, '_quicktoolbar'),
                );
          return b
            ? createVNode(
                resolveComponent('iBizToolbarControl'),
                {
                  modelData: b,
                  context: controller.context,
                  params: controller.params,
                  class: namespace.b('quick-toolbar'),
                },
                null,
              )
            : createVNode(
                resolveComponent('iBizNoData'),
                {
                  text: controller.model.emptyText,
                  emptyTextLanguageRes: controller.model.emptyTextLanguageRes,
                },
                null,
              );
        }
        return null;
      },
      {
        tableData: tableData,
        renderColumns: renderColumns,
        defaultSort: defaultSort,
        summaryMethod: summaryMethod,
      } = useAppGridBase(controller, props),
      { renderPopover: renderPopover } = useRowEditPopover(
        tableRef,
        controller,
      );
    return {
      c: controller,
      ns: namespace,
      tableRef: tableRef,
      tableData: tableData,
      renderColumns: renderColumns,
      onDbRowClick: onDbRowClick,
      onRowClick: onRowClick,
      onSelectionChange: onSelectionChange,
      onSortChange: onSortChange,
      onPageChange: onPageChange,
      onPageSizeChange: onPageSizeChange,
      onPageRefresh: onPageRefresh,
      handleRowClassName: handleRowClassName,
      handleHeaderCellClassName: handleHeaderCellClassName,
      renderNoData: renderNoData,
      summaryMethod: summaryMethod,
      renderPopover: renderPopover,
      defaultSort: defaultSort,
      onColumnStateClick: w => {
        controller.setColumnVisible(w);
      },
      renderBatchToolBar: () => {
        var k;
        const w =
          (k = controller.model.controls) == null
            ? void 0
            : k.find(
                b =>
                  b.name === ''.concat(controller.model.name, '_batchtoolbar'),
              );
        if (!(!w || controller.state.singleSelect))
          return createVNode(
            'div',
            {
              class: [
                namespace.b('batch-toolbar'),
                namespace.is('show', controller.state.selectedData.length > 0),
              ],
            },
            [
              createVNode(
                'div',
                {
                  class: namespace.b('batch-toolbar-content'),
                },
                [
                  createVNode(
                    'div',
                    {
                      class: namespace.b('batch-toolbar-text'),
                    },
                    [
                      createTextVNode('已选中'),
                      controller.state.selectedData.length,
                      createTextVNode('项'),
                    ],
                  ),
                  createVNode(
                    'div',
                    {
                      class: namespace.b('batch-toolbar-separator'),
                    },
                    [createTextVNode('|')],
                  ),
                  createVNode(
                    resolveComponent('iBizToolbarControl'),
                    {
                      modelData: w,
                      context: controller.context,
                      params: controller.params,
                      class: namespace.b('batch-toolbar-items'),
                    },
                    null,
                  ),
                ],
              ),
            ],
          );
      },
    };
  },
  render() {
    if (!this.c.state.isLoaded) return;
    const { state: t } = this.c,
      { hideHeader: e, enablePagingBar: n } = this.c.model;
    return createVNode(
      resolveComponent('iBizControlBase'),
      {
        class: [
          this.ns.is('show-header', !e),
          this.ns.is('enable-page', n),
          this.ns.is('enable-group', this.c.model.enableGroup),
        ],
        controller: this.c,
      },
      {
        default: () => [
          createVNode(
            resolveComponent('el-table'),
            {
              ref: 'tableRef',
              class: [this.ns.e('table'), this.ns.is('attachment', true)],
              'default-sort': this.defaultSort,
              border: true,
              'show-header': !e,
              'show-summary': this.c.enableAgg,
              'summary-method': this.summaryMethod,
              'highlight-current-row': t.singleSelect,
              'row-class-name': this.handleRowClassName,
              'header-cell-class-name': this.handleHeaderCellClassName,
              'row-key': 'tempsrfkey',
              data: this.tableData,
              onRowClick: this.onRowClick,
              onRowDblclick: this.onDbRowClick,
              onSelectionChange: this.onSelectionChange,
              onSortChange: this.onSortChange,
              'tooltip-effect': 'light',
            },
            {
              empty: this.renderNoData,
              default: () => [
                !t.singleSelect &&
                  createVNode(
                    resolveComponent('el-table-column'),
                    {
                      'class-name': this.ns.e('selection'),
                      type: 'selection',
                      width: '55',
                    },
                    null,
                  ),
                this.renderColumns.map((o, i) =>
                  renderGridColumns(this.c, o, this.renderColumns, i),
                ),
              ],
              append: () => this.renderPopover(),
            },
          ),
          n &&
            createVNode(
              resolveComponent('iBizPagination'),
              {
                total: t.total,
                curPage: t.curPage,
                size: t.size,
                onChange: this.onPageChange,
                onPageSizeChange: this.onPageSizeChange,
                onPageRefresh: this.onPageRefresh,
              },
              null,
            ),
          this.c.model.enableCustomized &&
            !e &&
            createVNode(
              'div',
              {
                class: this.ns.b('setting-box'),
              },
              [
                createVNode(
                  resolveComponent('iBizGridSetting'),
                  {
                    columnStates: t.columnStates,
                    controller: this.c,
                  },
                  null,
                ),
              ],
            ),
          this.renderBatchToolBar(),
        ],
      },
    );
  },
});

export { AttachmentGridControl };
