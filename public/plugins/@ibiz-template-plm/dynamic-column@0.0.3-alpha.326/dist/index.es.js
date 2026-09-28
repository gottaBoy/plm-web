import './assets/style.css';
import { GridFieldEditColumnController as I, registerGridColumnProvider as S } from "@ibiz-template/runtime";
import { computed as o, reactive as u, ref as y, onUnmounted as D, defineComponent as P, h as b, resolveComponent as E, nextTick as M } from "vue";
import { isNil as O } from "ramda";
import { listenJSEvent as x, NOOP as R, RuntimeError as k } from "@ibiz-template/core";
import { useClickOutside as z, useNamespace as T } from "@ibiz-template/vue3-util";
function B(e) {
  const a = o(
    () => e.controller.getDynamicController(e.row.data)
  ), t = o(
    () => e.row.editColStates[a.value.fieldName].disabled
  ), l = o(
    () => e.row.editColStates[a.value.fieldName].readonly
  ), n = e.controller.grid, i = o(() => n.state.rowEditOpen), d = () => {
    a.value.grid.editSaveMode === "cell-blur" && a.value.grid.save(e.row.data);
  };
  return {
    gridEditItemProps: u({ stopPropagation: i }),
    editorProps: u({
      disabled: o(() => i.value && t.value),
      readonly: o(() => l.value || !i.value),
      onBlur: d
    })
  };
}
function F(e, a) {
  const t = o(
    () => e.controller.getDynamicController(e.row.data)
  ), l = o(
    () => e.row.editColStates[t.value.fieldName].disabled
  ), n = o(
    () => e.row.editColStates[t.value.fieldName].readonly
  ), i = o(
    () => !!e.row.errors[t.value.fieldName]
  ), d = o(
    () => e.row.editColStates[t.value.fieldName].editable
  ), c = (g) => {
    e.row.editColStates[t.value.fieldName].editable = g;
  }, s = o(
    () => !l.value && !n.value && !i.value
  ), v = o(
    () => i.value || s.value && d.value
  ), w = y(!1);
  let r;
  const h = () => {
    c(!0), r = z(
      a,
      async () => {
        c(!1), r == null || r.stop();
      }
    );
  }, C = () => {
    r == null || r.stop(), ibiz.log.debug("".concat(t.value.fieldName, "属性编辑器focus事件"));
  }, m = () => {
    ibiz.log.debug("".concat(t.value.fieldName, "属性编辑器blur事件")), c(!1), t.value.grid.editSaveMode === "cell-blur" && t.value.grid.save(e.row.data);
  }, f = x(window, "keyup", (g) => {
    g.code === "Escape" && d.value && (c(!1), w.value = !0);
  });
  return D(() => {
    f !== R && f();
  }), {
    gridEditItemProps: u({
      showEditMask: o(() => s.value && !d.value),
      stopPropagation: o(() => s.value || v.value),
      isEscOut: w,
      onMaskClick: h
    }),
    editorProps: u({
      autoFocus: o(() => !i.value),
      disabled: !1,
      readonly: o(() => !v.value),
      onBlur: m,
      onFocus: C
    })
  };
}
function p(e) {
  const a = o(
    () => e.controller.getDynamicController(e.row.data)
  ), t = o(
    () => e.row.editColStates[a.value.fieldName].disabled
  ), l = o(
    () => e.row.editColStates[a.value.fieldName].readonly
  ), n = o(
    () => e.row.editColStates[a.value.fieldName].editable
  );
  return {
    gridEditItemProps: u({ stopPropagation: n }),
    editorProps: u({
      disabled: o(() => n.value && t.value),
      readonly: o(() => l.value || !n.value)
    })
  };
}
const N = P({
  name: "IBizDynamicColumn",
  props: {
    controller: { type: Object, required: !0 },
    row: { type: Object, required: !0 },
    attrs: { type: Object, required: !1 }
  },
  setup(e) {
    const a = T("dynamic-column"), t = y(), l = o(() => e.controller.getDynamicController(e.row.data)), n = () => {
      switch (l.value.grid.editShowMode) {
        case "cell":
          return F(e, t);
        case "row":
          return p(e);
        case "all":
          return B(e);
        default:
          throw new k(ibiz.i18n.t("control.common.noSupportItem", {
            name: l.value.grid.editShowMode
          }));
      }
    }, { gridEditItemProps: i, editorProps: d } = n(), c = async (r, h, C = !1) => {
      if (ibiz.log.debug("".concat(l.value.fieldName, "值变更"), r), i.isEscOut) {
        i.isEscOut = !1;
        const m = e.row.data, f = m[l.value.fieldName];
        m[l.value.fieldName] = null, M(() => {
          m[l.value.fieldName] = f;
        });
        return;
      }
      await l.value.setRowValue(e.row, r, h, C);
    }, s = y(), v = o(() => {
      if (d.readonly)
        return O(s.value) ? l.value.formatValue(e.row.data[l.value.fieldName]) : s.value;
    });
    return {
      c: l,
      ns: a,
      tooltip: v,
      editorProps: d,
      componentRef: t,
      gridEditItemProps: i,
      rowDataChange: c,
      onInfoTextChange: (r) => {
        s.value = r;
      }
    };
  },
  render() {
    var a;
    const e = this.row.data[this.c.fieldName];
    return b(E("iBizGridEditItem"), {
      ref: "componentRef",
      required: !this.c.editItem.allowEmpty,
      error: this.row.errors[this.c.fieldName],
      overflowMode: this.c.grid.overflowMode,
      class: [
        this.ns.b(),
        this.ns.m(this.c.grid.overflowMode),
        (a = this.controller.model.cellSysCss) == null ? void 0 : a.cssName
      ],
      ...this.gridEditItemProps
    }, {
      default: () => [
        this.c.editorProvider && b(E(this.c.editorProvider.gridEditor), {
          class: this.ns.e("editor"),
          value: e,
          data: this.row.data,
          key: this.c.model.id,
          controller: this.c.editor,
          overflowMode: this.c.grid.overflowMode,
          onChange: this.rowDataChange,
          onInfoTextChange: this.onInfoTextChange,
          title: this.tooltip,
          ...this.editorProps,
          ...this.attrs
        })
      ]
    });
  }
});
class q extends I {
  getDynamicController(a) {
    var i;
    const { userParam: t } = this.model;
    if (!(t != null && t.dynamicColumn) || !(t != null && t.condField))
      return this;
    const { dynamicColumn: l, condField: n } = t;
    return a[n] ? (i = this.grid.columns[l]) != null ? i : this : this;
  }
}
class G {
  constructor() {
    this.component = "IBizDynamicColumn";
  }
  async createController(a, t) {
    const l = new q(a, t);
    return await l.init(), l;
  }
}
const U = {
  install(e) {
    e.component(N.name, N), S(
      "GRID_COLRENDER_DYNAMIC_COLUMN",
      () => new G()
    );
  }
};
export {
  U as default
};
