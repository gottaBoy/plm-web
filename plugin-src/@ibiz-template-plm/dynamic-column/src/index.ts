import './style.css';
var k = Object.defineProperty;
var z = (e, n, t) => n in e ? k(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[n] = t;
var D = (e, n, t) => (z(e, typeof n != "symbol" ? n + "" : n, t), t);
import { GridFieldEditColumnController as B, registerGridColumnProvider as F } from "@ibiz-template/runtime";
import { computed as o, reactive as f, ref as N, onUnmounted as _, defineComponent as T, createVNode as q, resolveComponent as S, h as G, nextTick as V } from "vue";
import { isNil as j } from "ramda";
import { useClickOutside as p, useNamespace as A } from "@ibiz-template/vue3-util";
import { listenJSEvent as U, NOOP as I, RuntimeError as $ } from "@ibiz-template/core";
function L(e, n) {
  const t = o(() => e.controller.getDynamicController(e.row.data)), r = o(() => e.row.editColStates[t.value.fieldName].disabled), u = o(() => e.row.editColStates[t.value.fieldName].readonly), l = o(() => e.controller.grid.state.rowEditOpen), a = o(() => u.value || !l.value), d = o(() => l.value && r.value), i = o(() => l.value), c = () => {
    t.value.grid.editSaveMode === "cell-blur" && t.value.grid.save(e.row.data);
  }, v = f({
    stopPropagation: i
  }), s = f({
    disabled: d,
    readonly: a,
    onBlur: c
  });
  return {
    gridEditItemProps: v,
    editorProps: s
  };
}
function J(e, n) {
  const t = o(() => e.controller.getDynamicController(e.row.data)), r = o(() => e.row.editColStates[t.value.fieldName].disabled), u = o(() => e.row.editColStates[t.value.fieldName].readonly), l = o(() => !!e.row.errors[t.value.fieldName]), a = o(
    () => e.row.editColStates[t.value.fieldName].editable
  ), d = (w) => {
    e.row.editColStates[t.value.fieldName].editable = w;
  }, i = o(() => !r.value && !u.value && !l.value), c = o(() => l.value || i.value && a.value), v = o(() => !c.value), s = !1, h = o(() => !l.value), C = o(() => i.value && !a.value), y = o(() => i.value || c.value);
  let m;
  const g = () => {
    d(!0), m = p(n, async (w) => {
      d(!1), m.stop();
    });
  }, P = () => {
    m && m.stop(), ibiz.log.debug("".concat(t.value.fieldName, "属性编辑器focus事件"));
  }, M = () => {
    ibiz.log.debug("".concat(t.value.fieldName, "属性编辑器blur事件")), d(!1), t.value.grid.editSaveMode === "cell-blur" && t.value.grid.save(e.row.data);
  };
  let b = I;
  const E = N(!1);
  b = U(window, "keyup", (w) => {
    w.code === "Escape" && a.value && (d(!1), E.value = !0);
  }), _(() => {
    b !== I && b();
  });
  const R = f({
    showEditMask: C,
    stopPropagation: y,
    isEscOut: E,
    onMaskClick: g
  }), x = f({
    autoFocus: h,
    disabled: s,
    readonly: v,
    onBlur: M,
    onFocus: P
  });
  return {
    gridEditItemProps: R,
    editorProps: x
  };
}
function K(e, n) {
  const t = o(() => e.controller.getDynamicController(e.row.data)), r = o(() => e.row.editColStates[t.value.fieldName].disabled), u = o(() => e.row.editColStates[t.value.fieldName].readonly), l = o(
    () => e.row.editColStates[t.value.fieldName].editable
  ), a = o(() => u.value || !l.value), d = o(() => l.value && r.value), i = o(() => l.value), c = f({
    stopPropagation: i
  }), v = f({
    disabled: d,
    readonly: a
  });
  return {
    gridEditItemProps: c,
    editorProps: v
  };
}
const O = /* @__PURE__ */ T({
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
    const n = A("dynamic-column"), t = N(), r = o(() => e.controller.getDynamicController(e.row.data)), u = () => {
      switch (r.value.grid.editShowMode) {
        case "cell":
          return J(e, t);
        case "row":
          return K(e);
        case "all":
          return L(e);
        default:
          throw new $(ibiz.i18n.t("control.common.noSupportItem", {
            name: r.value.grid.editShowMode
          }));
      }
    }, {
      gridEditItemProps: l,
      editorProps: a
    } = u(), d = async (s, h, C = !1) => {
      ibiz.log.debug("".concat(r.value.fieldName, "值变更"), s);
      const {
        isEscOut: y
      } = l;
      if (y) {
        l.isEscOut = !1;
        const m = e.row.data, g = m[r.value.fieldName];
        m[r.value.fieldName] = null, V(() => {
          m[r.value.fieldName] = g;
        });
        return;
      }
      await r.value.setRowValue(e.row, s, h, C);
    }, i = N(void 0), c = (s) => {
      i.value = s;
    }, v = o(() => {
      if (a.readonly) {
        if (j(i.value)) {
          const s = e.row.data[r.value.fieldName];
          return r.value.formatValue(s);
        }
        return i.value;
      }
    });
    return {
      c: r,
      ns: n,
      tooltip: v,
      editorProps: a,
      componentRef: t,
      gridEditItemProps: l,
      rowDataChange: d,
      onInfoTextChange: c
    };
  },
  render() {
    var n;
    const e = this.row.data[this.c.fieldName];
    return q(S("iBizGridEditItem"), {
      ref: "componentRef",
      required: !this.c.editItem.allowEmpty,
      error: this.row.errors[this.c.fieldName],
      overflowMode: this.c.grid.overflowMode,
      class: [this.ns.b(), this.ns.m(this.c.grid.overflowMode), (n = this.controller.model.cellSysCss) == null ? void 0 : n.cssName],
      ...this.gridEditItemProps
    }, {
      default: () => [this.c.editorProvider && G(S(this.c.editorProvider.gridEditor), {
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
      })]
    });
  }
});
class Y extends B {
  /**
   * @description 返回动态列控制器
   * @param {IData} data
   * @returns {*}  {GridColumnController}
   * @memberof DynamicColumnController
   */
  getDynamicController(n) {
    var l;
    const { userParam: t } = this.model;
    if (!(t != null && t.dynamicColumn) || !(t != null && t.condField))
      return this;
    const { dynamicColumn: r, condField: u } = t;
    return n[u] ? (l = this.grid.columns[r]) != null ? l : this : this;
  }
}
class H {
  constructor() {
    D(this, "component", "IBizDynamicColumn");
  }
  async createController(n, t) {
    const r = new Y(n, t);
    return await r.init(), r;
  }
}
const oe = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(e) {
    e.component(O.name, O), F(
      "GRID_COLRENDER_DYNAMIC_COLUMN",
      () => new H()
    );
  }
};
export {
  oe as default
};
