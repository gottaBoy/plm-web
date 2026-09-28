import { ref, reactive, createVNode, resolveComponent, h } from 'vue';

import { RuntimeError } from '@ibiz-template/core';

import { x, computePosition } from './floating-position';

function useRowEditPopover(tableRef, controller) {
  let n;
  const o = ref(false),
    i = ref(),
    c = reactive({}),
    s = u => {
      if (!tableRef.value) throw new RuntimeError('找不到表格组件引用');
      const h = tableRef.value.$el;
      let f = '.el-table__row';
      u.data.srfkey && (f += '.id-'.concat(u.data.srfkey));
      const p = h.querySelector(f);
      if (!p) throw new RuntimeError('找不到对应的表格行dom元素');
      return p;
    },
    l = async u => {
      const h = s(u);
      if (!n) throw new RuntimeError('拿不到pop组件的实例');
      const f = n.$el,
        { x: p, y: m } = await computePosition(h, f, {
          placement: 'bottom',
        });
      Object.assign(c, {
        top: ''.concat(m, 'px'),
        left: ''.concat(p, 'px'),
      }),
        (i.value = u),
        (o.value = true);
    },
    a = async () => {
      i.value && controller.switchRowEdit(i.value, false, true);
    },
    r = async () => {
      i.value && controller.switchRowEdit(i.value, false, false);
    },
    d = () => {
      const u =
        o.value &&
        controller.state.rows[controller.state.rows.length - 1].showRowEdit;
      return [
        createVNode(
          'div',
          {
            class: 'row-edit-popover__placeholder',
            style: {
              display: u ? 'block' : 'none',
            },
          },
          null,
        ),
        createVNode(
          resolveComponent('iBizRowEditPopover'),
          {
            ref: h => {
              n = h;
            },
            style: c,
            show: o.value,
            onConfirm: a,
            onCancel: r,
          },
          null,
        ),
      ];
    };
  return (
    controller.evt.on('onRowEditChange', u => {
      u.row.showRowEdit
        ? setTimeout(() => {
            l(u.row);
          }, 0)
        : ((i.value = void 0),
          (o.value = false),
          Object.assign(c, {
            top: void 0,
            left: void 0,
          }));
    }),
    {
      renderPopover: d,
    }
  );
}

export { useRowEditPopover };
