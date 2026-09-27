import { withInstall as G, useNamespace as D, useClickOutside as M } from "@ibiz-template/vue3-util";
import { registerGridColumnProvider as z, GridRowState as A, GridFieldEditColumnController as F, ScriptFactory as g } from "@ibiz-template/runtime";
import { defineComponent as T, ref as S, computed as i, createVNode as B, resolveComponent as b, h as V, reactive as f } from "vue";
import { RuntimeError as j } from "@ibiz-template/core";
import { isNil as q } from "ramda";
var L = Object.defineProperty, k = (e, o, t) => o in e ? L(e, o, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[o] = t, h = (e, o, t) => (k(e, typeof o != "symbol" ? o + "" : o, t), t);
function J(e, o) {
  const t = e.controller, r = i(() => e.row.editColStates[t.fieldName].disabled), u = i(() => e.row.editColStates[t.fieldName].readonly), a = i(() => !!e.row.errors[t.fieldName]), d = i(
    () => e.row.editColStates[t.fieldName].editable
  ), l = (w) => {
    e.row.editColStates[t.fieldName].editable = w;
  }, s = i(() => !r.value && !u.value && !a.value), c = i(() => a.value || s.value && d.value), p = i(() => !c.value), n = !1, C = i(() => !a.value), N = i(() => s.value && !d.value), I = i(() => s.value || c.value);
  let m;
  const y = () => {
    l(!0), m = M(o, async (w) => {
      l(!1), m.stop();
    });
  }, P = () => {
    m && m.stop(), ibiz.log.debug("".concat(t.fieldName, "属性编辑器focus事件"));
  }, R = () => {
    ibiz.log.debug("".concat(t.fieldName, "属性编辑器blur事件")), l(!1), ibiz.config.grid.editSaveMode === "cell-blur" && t.enableSave && t.grid.save(e.row.data);
  }, O = f({
    showEditMask: N,
    stopPropagation: I,
    onMaskClick: y
  }), x = f({
    autoFocus: C,
    disabled: n,
    readonly: p,
    onBlur: R,
    onFocus: P
  });
  return {
    gridEditItemProps: O,
    editorProps: x
  };
}
function _(e, o) {
  const t = e.controller, r = i(() => e.row.editColStates[t.fieldName].disabled), u = i(() => e.row.editColStates[t.fieldName].readonly), a = i(
    () => e.row.editColStates[t.fieldName].editable
  ), d = i(() => u.value || !a.value), l = i(() => a.value && r.value), s = i(() => a.value), c = f({
    stopPropagation: s
  }), p = f({
    disabled: l,
    readonly: d
  });
  return {
    gridEditItemProps: c,
    editorProps: p
  };
}
function H(e, o) {
  const t = e.controller, r = i(() => e.row.editColStates[t.fieldName].disabled), u = i(() => e.row.editColStates[t.fieldName].readonly), a = i(() => e.controller.grid.state.rowEditOpen), d = i(() => u.value || !a.value), l = i(() => a.value && r.value), s = i(() => a.value), c = () => {
    t.enableSave && t.grid.save(e.row.data);
  }, p = f({
    stopPropagation: s
  }), n = f({
    disabled: l,
    readonly: d,
    onBlur: c
  });
  return {
    gridEditItemProps: p,
    editorProps: n
  };
}
class E extends F {
  constructor() {
    super(...arguments), h(this, "initScriptCode", ""), h(this, "changeScriptCode", ""), h(this, "enableSave", !0);
  }
  /**
   * 初始化方法，生成表格编辑项控制器
   *
   * @protected
   * @return {*}  {Promise<void>}
   * @memberof GridJsCodeColumnController
   */
  async onInit() {
    await super.onInit();
    const { editorParams: o } = this.editor;
    o.INITSCRIPTCODE && (this.initScriptCode = o.INITSCRIPTCODE), o.CHANGESCRIPTCODE && (this.changeScriptCode = o.CHANGESCRIPTCODE), o.ENABLESAVE && (this.enableSave = Object.is(o.ENABLESAVE, "true") || Object.is(o.ENABLESAVE, "TRUE"));
  }
  /**
   * 执行初始化脚本
   *
   * @public
   * @return {*}  {Promise<void>}
   * @memberof GridJsCodeColumnController
   */
  async execInitScriptFn(o) {
    this.initScriptCode && g.execScriptFn({ data: o.data }, this.initScriptCode, {
      singleRowReturn: !1,
      isAsync: !1
    });
  }
  /**
   * 执行数据改变脚本
   *
   * @param {GridRowState} row
   * @param {string} name
   * @param {unknown} value
   * @return {*}  {Promise<void>}
   * @memberof GridJsCodeColumnController
   */
  async execChangeScriptFn(o, t, r) {
    g.execScriptFn(
      { data: o.data, name: t, value: r },
      this.initScriptCode,
      { singleRowReturn: !0, isAsync: !0 }
    );
  }
  /**
   * 重写setRowValue
   *
   * @param {GridRowState} row
   * @param {unknown} value
   * @param {string} [name]
   * @return {*}  {Promise<void>}
   * @memberof GridJsCodeColumnController
   */
  async setRowValue(o, t, r) {
    r = r || this.fieldName, this.changeScriptCode && await this.execChangeScriptFn(o, r, t), await this.grid.setRowValue(o, r, t);
  }
}
const v = /* @__PURE__ */ T({
  name: "IBizGridJsCodeColumn",
  props: {
    controller: {
      type: E,
      required: !0
    },
    row: {
      type: A,
      required: !0
    },
    attrs: {
      type: Object,
      required: !1
    }
  },
  setup(e) {
    const o = D("grid-field-edit-column"), t = S(), r = e.controller;
    r.execInitScriptFn(e.row);
    const u = async (n, C) => {
      ibiz.log.debug("".concat(r.fieldName, "值变更"), n), await r.setRowValue(e.row, n, C);
    }, a = () => {
      switch (ibiz.config.grid.editShowMode) {
        case "cell":
          return J(e, t);
        case "row":
          return _(e);
        case "all":
          return H(e);
        default:
          throw new j("".concat(ibiz.config.grid.editShowMode, "暂未支持"));
      }
    }, {
      gridEditItemProps: d,
      editorProps: l
    } = a(), s = S(void 0), c = (n) => {
      s.value = n;
    }, p = i(() => {
      if (l.readonly) {
        if (q(s.value)) {
          const n = e.row.data[r.fieldName];
          return r.formatValue(n);
        }
        return s.value;
      }
    });
    return {
      ns: o,
      c: r,
      componentRef: t,
      tooltip: p,
      rowDataChange: u,
      onInfoTextChange: c,
      gridEditItemProps: d,
      editorProps: l
    };
  },
  render() {
    var e;
    const o = this.row.data[this.c.fieldName];
    return B(b("iBizGridEditItem"), {
      ref: "componentRef",
      required: !this.c.editItem.allowEmpty,
      error: this.row.errors[this.c.fieldName],
      overflowMode: this.controller.grid.overflowMode,
      class: [this.ns, this.ns.m(this.c.grid.overflowMode), (e = this.controller.model.cellSysCss) == null ? void 0 : e.cssName],
      ...this.gridEditItemProps
    }, {
      default: () => [this.c.editorProvider && V(b(this.c.editorProvider.gridEditor), {
        class: this.ns.e("editor"),
        value: o,
        data: this.row.data,
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
class U {
  constructor() {
    h(this, "component", "IBizGridJsCodeColumn");
  }
  async createController(o, t) {
    const r = new E(o, t);
    return await r.init(), r;
  }
}
const $ = G(
  v,
  function(e) {
    e.component(v.name, v), z(
      "GRID_COLRENDER_JSCODE_GRID_COLUMN",
      () => new U()
    );
  }
), Z = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(e) {
    e.use($);
  }
};
export {
  $ as IBizGridJsCodeColumn,
  Z as default
};
