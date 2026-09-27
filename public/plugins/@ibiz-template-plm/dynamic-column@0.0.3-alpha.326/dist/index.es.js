import './assets/style.css';
import './assets/style.css';
import { registerGridColumnProvider as k, GridFieldEditColumnController as z } from "@ibiz-template/runtime";
import { defineComponent as R, ref as b, computed as o, createVNode as x, resolveComponent as P, h as B, nextTick as F, reactive as f, onUnmounted as j } from "vue";
import { isNil as q } from "ramda";
import { useNamespace as G, useClickOutside as T } from "@ibiz-template/vue3-util";
import { RuntimeError as L, listenJSEvent as V, NOOP as E } from "@ibiz-template/core";
var _ = Object.defineProperty, J = (e, l, t) => l in e ? _(e, l, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[l] = t, U = (e, l, t) => (J(e, typeof l != "symbol" ? l + "" : l, t), t);
function Y(e, l) {
  const t = o(() => e.controller.getDynamicController(e.row.data)), r = o(() => e.row.editColStates[t.value.fieldName].disabled), u = o(() => e.row.editColStates[t.value.fieldName].readonly), a = o(() => e.controller.grid.state.rowEditOpen), d = o(() => u.value || !a.value), n = o(() => a.value && r.value), i = o(() => a.value), c = () => {
    t.value.grid.editSaveMode === "cell-blur" && t.value.grid.save(e.row.data);
  }, v = f({
    stopPropagation: i
  }), s = f({
    disabled: n,
    readonly: d,
    onBlur: c
  });
  return {
    gridEditItemProps: v,
    editorProps: s
  };
}
function A(e, l) {
  const t = o(() => e.controller.getDynamicController(e.row.data)), r = o(() => e.row.editColStates[t.value.fieldName].disabled), u = o(() => e.row.editColStates[t.value.fieldName].readonly), a = o(() => !!e.row.errors[t.value.fieldName]), d = o(
    () => e.row.editColStates[t.value.fieldName].editable
  ), n = (p) => {
    e.row.editColStates[t.value.fieldName].editable = p;
  }, i = o(() => !r.value && !u.value && !a.value), c = o(() => a.value || i.value && d.value), v = o(() => !c.value), s = !1, w = o(() => !a.value), g = o(() => i.value && !d.value), h = o(() => i.value || c.value);
  let m;
  const C = () => {
    n(!0), m = T(l, async (p) => {
      n(!1), m.stop();
    });
  }, S = () => {
    m && m.stop(), ibiz.log.debug("".concat(t.value.fieldName, "属性编辑器focus事件"));
  }, M = () => {
    ibiz.log.debug("".concat(t.value.fieldName, "属性编辑器blur事件")), n(!1), t.value.grid.editSaveMode === "cell-blur" && t.value.grid.save(e.row.data);
  };
  let y = E;
  const N = b(!1);
  y = V(window, "keyup", (p) => {
    p.code === "Escape" && d.value && (n(!1), N.value = !0);
  }), j(() => {
    y !== E && y();
  });
  const O = f({
    showEditMask: g,
    stopPropagation: h,
    isEscOut: N,
    onMaskClick: C
  }), D = f({
    autoFocus: w,
    disabled: s,
    readonly: v,
    onBlur: M,
    onFocus: S
  });
  return {
    gridEditItemProps: O,
    editorProps: D
  };
}
function H(e, l) {
  const t = o(() => e.controller.getDynamicController(e.row.data)), r = o(() => e.row.editColStates[t.value.fieldName].disabled), u = o(() => e.row.editColStates[t.value.fieldName].readonly), a = o(
    () => e.row.editColStates[t.value.fieldName].editable
  ), d = o(() => u.value || !a.value), n = o(() => a.value && r.value), i = o(() => a.value), c = f({
    stopPropagation: i
  }), v = f({
    disabled: n,
    readonly: d
  });
  return {
    gridEditItemProps: c,
    editorProps: v
  };
}
const I = /* @__PURE__ */ R({
  name: "IBizDynamicColumn",
  props: {
    controller: {
      type: Object,
      required: !0
    },
    row: {
      type: Object,
      required: !0
    },
    attrs: {
      type: Object,
      required: !1
    }
  },
  setup(e) {
    const l = G("dynamic-column"), t = b(), r = o(() => e.controller.getDynamicController(e.row.data)), u = () => {
      switch (r.value.grid.editShowMode) {
        case "cell":
          return A(e, t);
        case "row":
          return H(e);
        case "all":
          return Y(e);
        default:
          throw new L(ibiz.i18n.t("control.common.noSupportItem", {
            name: r.value.grid.editShowMode
          }));
      }
    }, {
      gridEditItemProps: a,
      editorProps: d
    } = u(), n = async (s, w, g = !1) => {
      ibiz.log.debug("".concat(r.value.fieldName, "值变更"), s);
      const {
        isEscOut: h
      } = a;
      if (h) {
        a.isEscOut = !1;
        const m = e.row.data, C = m[r.value.fieldName];
        m[r.value.fieldName] = null, F(() => {
          m[r.value.fieldName] = C;
        });
        return;
      }
      await r.value.setRowValue(e.row, s, w, g);
    }, i = b(void 0), c = (s) => {
      i.value = s;
    }, v = o(() => {
      if (d.readonly) {
        if (q(i.value)) {
          const s = e.row.data[r.value.fieldName];
          return r.value.formatValue(s);
        }
        return i.value;
      }
    });
    return {
      c: r,
      ns: l,
      tooltip: v,
      editorProps: d,
      componentRef: t,
      gridEditItemProps: a,
      rowDataChange: n,
      onInfoTextChange: c
    };
  },
  render() {
    var e;
    const l = this.row.data[this.c.fieldName];
    return x(P("iBizGridEditItem"), {
      ref: "componentRef",
      required: !this.c.editItem.allowEmpty,
      error: this.row.errors[this.c.fieldName],
      overflowMode: this.c.grid.overflowMode,
      class: [this.ns.b(), this.ns.m(this.c.grid.overflowMode), (e = this.controller.model.cellSysCss) == null ? void 0 : e.cssName],
      ...this.gridEditItemProps
    }, {
      default: () => [this.c.editorProvider && B(P(this.c.editorProvider.gridEditor), {
        class: this.ns.e("editor"),
        value: l,
        data: this.row.data,
        key: this.c.model.id,
        controller: this.c.editor,
        overflowMode: this.c.grid.overflowMode,
        onChange: this.rowDataChange,
        onInfoTextChange: this.onInfoTextChange,
        title: this.tooltip,
        ...this.editorProps,
        ...this.attrs
      })]
    });
  }
});
class K extends z {
  /**
   * @description 返回动态列控制器
   * @param {IData} data
   * @returns {*}  {GridColumnController}
   * @memberof DynamicColumnController
   */
  getDynamicController(l) {
    var t;
    const { userParam: r } = this.model;
    if (!(r != null && r.dynamicColumn) || !(r != null && r.condField))
      return this;
    const { dynamicColumn: u, condField: a } = r;
    return l[a] ? (t = this.grid.columns[u]) != null ? t : this : this;
  }
}
class Q {
  constructor() {
    U(this, "component", "IBizDynamicColumn");
  }
  async createController(l, t) {
    const r = new K(l, t);
    return await r.init(), r;
  }
}
const te = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(e) {
    e.component(I.name, I), k(
      "GRID_COLRENDER_DYNAMIC_COLUMN",
      () => new Q()
    );
  }
};
export {
  te as default
};
