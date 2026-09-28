import { GridRowState, ControlVO } from '@ibiz-template/runtime';

import { ref, watch, computed, h } from 'vue';

function usePagination(controller) {
  function e(i) {
    !i ||
      i === controller.state.curPage ||
      ((controller.state.curPage = i), controller.load());
  }
  function n(i) {
    !i ||
      i === controller.state.size ||
      ((controller.state.size = i),
      controller.state.curPage === 1 && controller.load());
  }
  function o() {
    controller.load();
  }
  return { onPageChange: e, onPageSizeChange: n, onPageRefresh: o };
}

function useITableEvent(controller) {
  const e = ref();
  let n = false;
  async function o(r, d, u) {
    if (
      ibiz.config.grid.editShowMode === 'row' &&
      controller.model.enableRowEdit
    ) {
      const h = controller.findRowState(r);
      h && h.showRowEdit !== true && (await controller.switchRowEdit(h, true));
    } else controller.onRowClick(r);
  }
  function i(r) {
    controller.onDbRowClick(r);
  }
  function c(r) {
    n || controller.setSelection(r);
  }
  watch(
    [
      () => e.value,
      () => controller.state.isLoaded,
      () => controller.state.selectedData,
    ],
    ([r, d, u]) => {
      !d ||
        !r ||
        (controller.state.singleSelect
          ? u[0]
            ? e.value.setCurrentRow(u[0], true)
            : e.value.setCurrentRow()
          : ((n = true),
            e.value.clearSelection(),
            u.forEach(h => e.value.toggleRowSelection(h, true)),
            (n = false)));
    },
  );
  function s(r) {
    const { prop: d, order: u } = r,
      h = controller.fieldColumns[d].model.appDEFieldId;
    let f;
    u === 'ascending' ? (f = 'asc') : u === 'descending' && (f = 'desc'),
      controller.setSort(h, f),
      controller.load();
  }
  function l({ row: r }) {
    let d = '';
    controller.state.selectedData.length > 0 &&
      controller.state.selectedData.forEach(h => {
        h === r && (d = 'current-row');
      });
    const u = controller.findRowState(r);
    return (
      u != null && u.showRowEdit && (d += ' editing-row'),
      r.srfkey && (d += ' id-'.concat(r.srfkey)),
      d
    );
  }
  function a({ _row: r, column: d, _rowIndex: u, _columnIndex: h }) {
    var p;
    const f =
      (p = controller.model.degridColumns) == null
        ? void 0
        : p.find(m => m.codeName === d.property);
    return f && f.headerSysCss && f.headerSysCss.cssName
      ? f.headerSysCss.cssName
      : '';
  }
  return (
    watch(
      () => controller.state.sortQuery,
      r => {
        if (r) {
          const d = controller.state.sortQuery.split(',')[0],
            u = controller.state.sortQuery.split(',')[1];
          if (e.value && d && u) {
            const h = u === 'desc' ? 'descending' : 'ascending';
            setTimeout(() => {
              var f;
              (f = e.value) == null || f.sort(d, h);
            });
          }
        }
      },
    ),
    {
      tableRef: e,
      onRowClick: o,
      onDbRowClick: i,
      onSelectionChange: c,
      onSortChange: s,
      handleRowClassName: l,
      handleHeaderCellClassName: a,
    }
  );
}

function useAppGridBase(controller, props) {
  const n = () => {
      props.data &&
        ((controller.state.items = props.data),
        (controller.state.rows = props.data.map(
          l => new GridRowState(new ControlVO(l), controller),
        )));
    },
    o = computed(() => {
      var a;
      const l = Object.values(controller.fieldColumns).find(
        r => r.model.appDEFieldId === controller.model.minorSortAppDEFieldId,
      );
      return {
        prop: l == null ? void 0 : l.model.codeName,
        order:
          ((a = controller.model.minorSortDir) == null
            ? void 0
            : a.toLowerCase()) === 'desc'
            ? 'descending'
            : 'ascending',
      };
    });
  controller.evt.on('onCreated', async () => {
    props.isSimple && (n(), (controller.state.isLoaded = true));
  }),
    watch(
      () => props.data,
      () => {
        props.isSimple && n();
      },
      {
        deep: true,
      },
    );
  const i = computed(() => {
      const { state: l } = controller;
      if (controller.model.enableGroup) {
        const a = [];
        return (
          l.groups.forEach(r => {
            if (!r.children.length) return;
            const d = [...r.children],
              u = d.shift();
            a.push({
              srfkey: (u == null ? void 0 : u.srfkey) || r.caption,
              isGroupData: true,
              caption: r.caption,
              first: u,
              children: d,
            });
          }),
          a
        );
      }
      return l.rows.map(a => a.data);
    }),
    c = computed(() => {
      if (controller.isMultistageHeader)
        return controller.model.degridColumns || [];
      const l = [];
      return (
        controller.state.columnStates.forEach(a => {
          var d, u;
          if (a.hidden) return;
          const r =
            ((d = controller.fieldColumns[a.key]) == null ? void 0 : d.model) ||
            ((u = controller.uaColumns[a.key]) == null ? void 0 : u.model);
          r && l.push(r);
        }),
        l
      );
    });
  return {
    tableData: i,
    renderColumns: c,
    defaultSort: o,
    summaryMethod: ({ columns: l }) =>
      l.map((a, r) =>
        r === 0 ? controller.aggTitle : controller.state.aggResult[a.property],
      ),
  };
}

const onStopPropagation = event => {
  event.stopPropagation();
};

const onActionClick = async (t, e, n, o) => {
  n.grid.setSelection([o.data]), await n.onActionClick(t, o, e);
};

export {
  usePagination,
  useITableEvent,
  useAppGridBase,
  onStopPropagation,
  onActionClick,
};
