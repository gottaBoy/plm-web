import './assets/style.css';
import { registerGridColumnProvider as _, GridRowState as k, GridFieldEditColumnController as F } from "@ibiz-template/runtime";
import { withInstall as L, useNamespace as B, useClickOutside as G } from "@ibiz-template/vue3-util";
import { defineComponent as O, ref as P, computed as i, createVNode as s, resolveComponent as V, isVNode as j, reactive as p } from "vue";
import { RuntimeError as q } from "@ibiz-template/core";
import { isNil as D } from "ramda";
import { isArray as H, isUndefined as U } from "lodash-es";
var A = Object.defineProperty, T = (e, r, o) => r in e ? A(e, r, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[r] = o, h = (e, r, o) => (T(e, typeof r != "symbol" ? r + "" : r, o), o);
function W(e, r) {
  const o = e.controller, l = i(() => e.row.editColStates[o.fieldName].disabled), w = i(() => e.row.editColStates[o.fieldName].readonly), a = i(() => !!e.row.errors[o.fieldName]), d = i(
    () => e.row.editColStates[o.fieldName].editable
  ), u = (t) => {
    e.row.editColStates[o.fieldName].editable = t;
  }, c = i(() => !l.value && !w.value && !a.value), v = i(() => a.value || c.value && d.value), m = i(() => !v.value), f = !1, N = i(() => !a.value), R = i(() => c.value && !d.value), b = i(() => c.value || v.value);
  let g;
  const y = () => {
    u(!0), g = G(r, async (t) => {
      u(!1), g.stop();
    });
  }, C = () => {
    g && g.stop(), ibiz.log.debug("".concat(o.fieldName, "属性编辑器focus事件"));
  }, S = () => {
    ibiz.log.debug("".concat(o.fieldName, "属性编辑器blur事件")), u(!1), ibiz.config.grid.editSaveMode === "cell-blur" && o.grid.save(e.row.data);
  }, z = p({
    showEditMask: R,
    stopPropagation: b,
    onMaskClick: y
  }), E = p({
    autoFocus: N,
    disabled: f,
    readonly: m,
    onBlur: S,
    onFocus: C
  });
  return {
    gridEditItemProps: z,
    editorProps: E
  };
}
function J(e, r) {
  const o = e.controller, l = i(() => e.row.editColStates[o.fieldName].disabled), w = i(() => e.row.editColStates[o.fieldName].readonly), a = i(
    () => e.row.editColStates[o.fieldName].editable
  ), d = i(() => w.value || !a.value), u = i(() => a.value && l.value), c = i(() => a.value), v = p({
    stopPropagation: c
  }), m = p({
    disabled: u,
    readonly: d
  });
  return {
    gridEditItemProps: v,
    editorProps: m
  };
}
function K(e, r) {
  const o = e.controller, l = i(() => e.row.editColStates[o.fieldName].disabled), w = i(() => e.row.editColStates[o.fieldName].readonly), a = i(() => e.controller.grid.state.rowEditOpen), d = i(() => w.value || !a.value), u = i(() => a.value && l.value), c = i(() => a.value), v = () => {
    o.grid.save(e.row.data);
  }, m = p({
    stopPropagation: c
  }), f = p({
    disabled: u,
    readonly: d,
    onBlur: v
  });
  return {
    gridEditItemProps: m,
    editorProps: f
  };
}
class x extends F {
  constructor() {
    super(...arguments), h(this, "isReviewedField", "whether_review"), h(this, "finalResultsField", "final_stage_results"), h(this, "reviewStageField", "stage_id"), h(this, "reviewResultField", "result_state");
  }
}
function Q(e) {
  return typeof e == "function" || Object.prototype.toString.call(e) === "[object Object]" && !j(e);
}
const X = () => s("svg", {
  class: "icon",
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  focusable: "false"
}, [s("g", {
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [s("g", {
  transform: "translate(.9 .5)",
  "fill-rule": "nonzero"
}, [s("path", {
  d: "M13.6 13.9a.6.6 0 0 1 0 1.2H.6a.6.6 0 0 1 0-1.2h13zM7.065 0c2.232 0 4.043 1.8 4.043 4.017 0 1.468-.789 2.75-1.97 3.45a.934.934 0 0 0-.361.738c0 .48.364.878.836.932l.11.006c.017 0 .034.005.049.01h3.006c.415 0 .755.339.755.751v2.248c0 .412-.34.75-.755.75H1.355a.755.755 0 0 1-.755-.75V9.904c0-.412.34-.75.755-.75h3.223a.935.935 0 1 0 .418-1.684 4.012 4.012 0 0 1-1.973-3.45C3.023 1.8 4.832 0 7.065 0zm0 1.2a2.83 2.83 0 0 0-2.842 2.82c0 .933.463 1.788 1.22 2.311L5.7 6.5a2.134 2.134 0 0 1-.955 3.843l-.168.012-2.778-.001v1.349h10.533v-1.349H9.527l-.062-.026-.045-.005a2.142 2.142 0 0 1-1.838-1.964l-.005-.153c0-.665.307-1.279.82-1.681l.129-.089a2.804 2.804 0 0 0 1.382-2.418c0-1.553-1.272-2.817-2.843-2.817z"
}, null)])])]), Y = () => s("svg", {
  class: "icon",
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  focusable: "false"
}, [s("g", {
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [s("path", {
  d: "M0 8c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8zm7.097.758L5.199 6.905l-.978 1.001 2.9 2.833 4.563-4.685-1.003-.977-3.584 3.68z"
}, null)])]), Z = () => s("svg", {
  class: "icon",
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  focusable: "false"
}, [s("g", {
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [s("path", {
  d: "M0 8c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8zm9.005.021l1.777-1.793-.994-.986-1.769 1.784L6.28 5.27l-.995.985 1.75 1.767-1.766 1.782.995.985 1.756-1.772 1.702 1.718.995-.985L9.005 8.02z"
}, null)])]), $ = () => s("svg", {
  class: "icon",
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  focusable: "false"
}, [s("g", {
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [s("path", {
  d: "M7.978 11.498l-.005.005L2.3 5.831 3.13 5l4.848 4.848L12.826 5l.83.831-5.673 5.672-.005-.005z",
  transform: "rotate(-90 7.978 8.252)"
}, null)])]), I = /* @__PURE__ */ O({
  name: "IBizGridReviewResultsColumn",
  props: {
    controller: {
      type: x,
      required: !0
    },
    row: {
      type: k,
      required: !0
    },
    attrs: {
      type: Object,
      required: !1
    }
  },
  setup(e) {
    const r = B("grid-review-results-column"), o = P(), l = e.controller, w = i(() => l.context.curstage_id), a = i(() => e.row.data[l.finalResultsField]), d = i(() => {
      const t = e.row.data[l.fieldName];
      return H(t) ? t : [];
    }), u = async (t, n) => {
      ibiz.log.debug("".concat(l.fieldName, "值变更"), t), await l.setRowValue(e.row, t, n);
    }, c = () => {
      switch (ibiz.config.grid.editShowMode) {
        case "cell":
          return W(e, o);
        case "row":
          return J(e);
        case "all":
          return K(e);
        default:
          throw new q(ibiz.i18n.t("control.common.noSupportItem", {
            name: ibiz.config.grid.editShowMode
          }));
      }
    }, {
      gridEditItemProps: v,
      editorProps: m
    } = c(), f = P(void 0), N = (t) => {
      f.value = t;
    }, R = i(() => {
      if (m.readonly) {
        if (D(f.value)) {
          const t = e.row.data[l.fieldName];
          return l.formatValue(t);
        }
        return f.value;
      }
    }), b = (t) => t[l.isReviewedField] === "1" && l.context.cur_reviewer_id === l.context.srfuserid && l.context._parent.curstage_state === "20", g = (t) => {
      var n;
      return l.codeList ? ((n = l.codeList.codeItems) == null ? void 0 : n.find((M) => String(M.value) === String(t[l.reviewResultField]))) || {} : {};
    }, y = (t) => {
      t.stopPropagation(), e.controller.triggerAction(e.row, t);
    }, C = (t) => {
      const {
        color: n
      } = g(t);
      return s("div", {
        class: [r.b("block")],
        style: {
          background: n
        }
      }, null);
    }, S = () => {
      const t = String(a.value) === "1";
      return s("div", {
        class: [r.b("final-result"), r.is("fail", !t)]
      }, [t ? Y() : Z()]);
    }, z = (t = {}) => {
      const {
        text: n
      } = g(t);
      return s("div", {
        class: [r.b("single-stage-results")]
      }, [b(t) && Number(t[l.reviewResultField]) < 3 ? X() : C(t), s("span", {
        class: r.be("single-stage-results", "caption")
      }, [n])]);
    }, E = () => {
      var t;
      return s("div", {
        class: [r.b("stage-results")]
      }, [(t = d.value) == null ? void 0 : t.map((n) => C(n)), U(a.value) ? "" : S()]);
    };
    return {
      ns: r,
      c: l,
      componentRef: o,
      tooltip: R,
      rowDataChange: u,
      onInfoTextChange: N,
      gridEditItemProps: v,
      editorProps: m,
      renderContent: () => {
        if (d.value.length === 0)
          return "---";
        const t = d.value.find((n) => n[l.reviewStageField] === w.value);
        return t && !b(t) && Number(t[l.reviewResultField]) < 3 ? "---" : s("div", {
          class: [r.b("content")],
          onClick: y
        }, [t ? z(t) : E(), s("div", {
          class: r.be("content", "icon")
        }, [$()])]);
      }
    };
  },
  render() {
    var e;
    let r;
    return s(V("iBizGridEditItem"), {
      ref: "componentRef",
      required: !this.c.editItem.allowEmpty,
      error: this.row.errors[this.c.fieldName],
      overflowMode: this.controller.grid.overflowMode,
      class: [this.ns, this.ns.m(this.c.grid.overflowMode), (e = this.controller.model.cellSysCss) == null ? void 0 : e.cssName],
      ...this.gridEditItemProps,
      showEditMask: !1
    }, Q(r = this.renderContent()) ? r : {
      default: () => [r]
    });
  }
});
class ee {
  constructor() {
    h(this, "component", "IBizGridReviewResultsColumn");
  }
  async createController(r, o) {
    const l = new x(r, o);
    return await l.init(), l;
  }
}
const ae = L(
  I,
  function(e) {
    e.component(I.name, I), _(
      "GRID_COLRENDER_COLUMN_REVIEW_RESULTS",
      () => new ee()
    );
  }
);
export {
  ae as IBizGridReviewResultsColumn,
  ae as default
};
