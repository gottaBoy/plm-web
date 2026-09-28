import { useNamespace } from '@ibiz-template/vue3-util';

import { createVNode, resolveComponent, mergeProps, h } from 'vue';

import { onStopPropagation, onActionClick } from './grid-control.util';

function renderGridColumn(controller, column, columns, columnIndex) {
  var u;
  if (column.hideDefault) return null;
  const { codeName: i, width: c } = column,
    s = controller.columns[i],
    l = controller.state.columnStates.find(h => h.key === i),
    r =
      s.isAdaptiveColumn ||
      (!controller.hasAdaptiveColumn && columnIndex === columns.length - 1)
        ? 'min-width'
        : 'width';
  let d = '';
  return (
    column.columnType === 'UAGRIDCOLUMN' && (d = 'attachment-ua-column'),
    createVNode(
      resolveComponent('el-table-column'),
      mergeProps(
        {
          label: column.caption,
          prop: i,
          'class-name': d,
          'label-class-name': d,
        },
        {
          [r]: c,
        },
        {
          fixed: l.fixed,
          sortable: column.enableSort ? 'custom' : false,
          align:
            ((u = column.align) == null ? void 0 : u.toLowerCase()) || 'center',
        },
      ),
      {
        default: ({ row: h }) => {
          var m, R;
          let f = h;
          h.isGroupData && (f = h.first);
          const p = controller.findRowState(f);
          if (p) {
            if (column.columnType === 'UAGRIDCOLUMN') {
              const E = useNamespace('grid-ua-column'),
                T = useNamespace('attachment-grid'),
                O =
                  ((m = s.model.deuiactionGroup) == null
                    ? void 0
                    : m.uiactionGroupDetails) || [],
                w = O.filter(b => b.actionLevel !== 250),
                k = O.filter(b => b.actionLevel === 250);
              return createVNode(
                'div',
                {
                  class: [
                    E.b(),
                    (R = s.model.cellSysCss) == null ? void 0 : R.cssName,
                  ],
                },
                [
                  k.length &&
                    createVNode(
                      resolveComponent('iBizActionToolbar'),
                      {
                        onDblclick: onStopPropagation,
                        onClick: onStopPropagation,
                        'action-details': k,
                        'actions-state': p.uaColStates[s.model.codeName],
                        popperClass: T.e('popper'),
                        onActionClick: (b, G) => {
                          onActionClick(b, G, s, p);
                        },
                      },
                      null,
                    ),
                  w.length &&
                    createVNode(
                      resolveComponent('iBizActionToolbar'),
                      {
                        onDblclick: onStopPropagation,
                        onClick: onStopPropagation,
                        mode: 'dropdown',
                        caption: '· · ·',
                        'action-details': w,
                        popperClass: T.e('popper'),
                        'actions-state': p.uaColStates[s.model.codeName],
                        onActionClick: (b, G) => {
                          onActionClick(b, G, s, p);
                        },
                      },
                      null,
                    ),
                ],
              );
            }
            const D = resolveComponent(controller.providers[i].component);
            return h(D, {
              controller: s,
              row: p,
              key: f.tempsrfkey + i,
            });
          }
          return null;
        },
      },
    )
  );
}

function renderGridColumns(controller, column, columns, columnIndex) {
  var i, c;
  if (column.columnType === 'GROUPGRIDCOLUMN') {
    const s =
        ((i = column.degridColumns) == null
          ? void 0
          : i.filter(r => !r.hideDefault)) || [],
      { width: l } = column,
      a = ((c = column.align) == null ? void 0 : c.toLowerCase()) || 'center';
    return createVNode(
      resolveComponent('el-table-column'),
      {
        prop: column.codeName,
        label: column.caption,
        'min-width': l,
        align: a,
      },
      {
        default: () =>
          s.map((r, d) => renderGridColumns(controller, r, columns, d)),
      },
    );
  }
  return renderGridColumn(controller, column, columns, columnIndex);
}

export { renderGridColumn, renderGridColumns };
