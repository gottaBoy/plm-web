import './assets/style.css';
import { registerGridColumnProvider as H, GridRowState as $, GridFieldEditColumnController as J, getDeACMode as K } from "@ibiz-template/runtime";
import { withInstall as Q, useNamespace as W, useClickOutside as X } from "@ibiz-template/vue3-util";
import { defineComponent as Z, ref as g, computed as r, createVNode as s, resolveComponent as N, isVNode as ee, reactive as b } from "vue";
import { RuntimeModelError as te, RuntimeError as oe } from "@ibiz-template/core";
import { isNil as ae, mergeDeepLeft as ie } from "ramda";
var re = Object.defineProperty, de = (e, o, i) => o in e ? re(e, o, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[o] = i, u = (e, o, i) => (de(e, typeof o != "symbol" ? o + "" : o, i), i);
function le(e, o) {
  const i = e.controller, t = r(() => e.row.editColStates[i.fieldName].disabled), n = r(() => e.row.editColStates[i.fieldName].readonly), d = r(() => !!e.row.errors[i.fieldName]), p = r(
    () => e.row.editColStates[i.fieldName].editable
  ), m = (I) => {
    e.row.editColStates[i.fieldName].editable = I;
  }, c = r(() => !t.value && !n.value && !d.value), f = r(() => d.value || c.value && p.value), h = r(() => !f.value), M = !1, y = r(() => !d.value), E = r(() => c.value && !p.value), x = r(() => c.value || f.value);
  let w;
  const C = () => {
    m(!0), w = X(o, async (I) => {
      m(!1), w.stop();
    });
  }, D = () => {
    w && w.stop(), ibiz.log.debug("".concat(i.fieldName, "属性编辑器focus事件"));
  }, P = () => {
    ibiz.log.debug("".concat(i.fieldName, "属性编辑器blur事件")), m(!1), ibiz.config.grid.editSaveMode === "cell-blur" && i.grid.save(e.row.data);
  }, S = b({
    showEditMask: E,
    stopPropagation: x,
    onMaskClick: C
  }), A = b({
    autoFocus: y,
    disabled: M,
    readonly: h,
    onBlur: P,
    onFocus: D
  });
  return {
    gridEditItemProps: S,
    editorProps: A
  };
}
function se(e, o) {
  const i = e.controller, t = r(() => e.row.editColStates[i.fieldName].disabled), n = r(() => e.row.editColStates[i.fieldName].readonly), d = r(
    () => e.row.editColStates[i.fieldName].editable
  ), p = r(() => n.value || !d.value), m = r(() => d.value && t.value), c = r(() => d.value), f = b({
    stopPropagation: c
  }), h = b({
    disabled: m,
    readonly: p
  });
  return {
    gridEditItemProps: f,
    editorProps: h
  };
}
function ne(e, o) {
  const i = e.controller, t = r(() => e.row.editColStates[i.fieldName].disabled), n = r(() => e.row.editColStates[i.fieldName].readonly), d = r(() => e.controller.grid.state.rowEditOpen), p = r(() => n.value || !d.value), m = r(() => d.value && t.value), c = r(() => d.value), f = () => {
    i.grid.save(e.row.data);
  }, h = b({
    stopPropagation: c
  }), M = b({
    disabled: m,
    readonly: p,
    onBlur: f
  });
  return {
    gridEditItemProps: h,
    editorProps: M
  };
}
class V extends J {
  constructor() {
    super(...arguments), u(this, "leftMapField", "from"), u(this, "rightMapField", "to"), u(this, "listMapField", "srflistmapfield"), u(this, "keyName", "srfkey"), u(this, "textName", "srfmajortext"), u(this, "interfaceName", ""), u(this, "sort", ""), u(this, "deACMode"), u(this, "dataItems", []), u(this, "editorModel", {}), u(this, "editorReadonly", !1);
  }
  /**
   * 初始化方法，生成表格编辑项控制器
   *
   * @protected
   * @returns {*}  {Promise<void>}
   */
  async onInit() {
    await super.onInit();
    const { enableRowEdit: o } = this.model;
    if (o && (this.editorModel = this.editItem.editor || {}, this.initParams(), this.editorModel.appDataEntityId && (this.editorModel.appDEDataSetId && (this.interfaceName = this.editorModel.appDEDataSetId), this.editorModel.appDEACModeId && (this.deACMode = await K(
      this.editorModel.appDEACModeId,
      this.editorModel.appDataEntityId,
      this.context.srfappid
    ), this.deACMode)))) {
      const { minorSortAppDEFieldId: i, minorSortDir: t } = this.deACMode;
      i && t && (this.sort = "".concat(i.toLowerCase(), ",").concat(t.toLowerCase())), this.deACMode.textAppDEFieldId && (this.textName = this.deACMode.textAppDEFieldId), this.deACMode.valueAppDEFieldId && (this.keyName = this.deACMode.valueAppDEFieldId), this.deACMode.deacmodeDataItems && (this.dataItems = [], this.deACMode.deacmodeDataItems.forEach(
        (n) => {
          n.id !== "value" && n.id !== "text" && this.dataItems.push(n);
        }
      ));
    }
  }
  /**
   * 初始化编辑器参数
   *
   * @protected
   * @returns {*}  {void}
   */
  initParams() {
    this.editorModel.editorParams && this.editorModel.editorParams.readonly && (this.editorReadonly = Object.is(
      "true",
      this.editorModel.editorParams.readonly
    ));
  }
  /**
   * 加载实体数据集数据
   *
   * @param {IData} data 表单数据
   * @param {IParams} tempParam 临时视图参数
   * @returns {*}  {Promise<IHttpResponse<IData[]>>}
   */
  async getServiceData(o, i) {
    const { context: t, params: n } = this.handlePublicParams(
      o,
      this.context,
      this.params
    ), d = {};
    this.sort && !Object.is(this.sort, "") && Object.assign(d, { sort: this.sort }), i && Object.assign(d, i), Object.assign(d, {
      size: 1e3
    });
    const p = ie(n, d);
    if (this.interfaceName)
      return await ibiz.hub.getApp(this.context.srfappid).deService.exec(
        this.editorModel.appDataEntityId,
        this.interfaceName,
        t,
        p
      );
    throw new te(this.model, "请配置实体和实体数据集");
  }
}
function j(e) {
  return typeof e == "function" || Object.prototype.toString.call(e) === "[object Object]" && !ee(e);
}
const O = /* @__PURE__ */ Z({
  name: "IBizGridChangeVersionColumn",
  props: {
    controller: {
      type: V,
      required: !0
    },
    row: {
      type: $,
      required: !0
    },
    attrs: {
      type: Object,
      required: !1
    }
  },
  setup(e) {
    const o = W("grid-change-version-column"), i = g(), t = e.controller, n = g([]), d = g(!1), p = g(!1), m = g(!1), c = r(() => e.row.data[t.fieldName] || []), f = (a, l) => (a || []).findIndex((v) => v[t.listMapField] === l), h = r(() => f(e.row.data[t.fieldName], t.leftMapField)), M = r(() => f(e.row.data[t.fieldName], t.rightMapField)), y = async (a, l) => {
      ibiz.log.debug("".concat(t.fieldName, "值变更"), a), await t.setRowValue(e.row, a, l);
    }, E = () => {
      switch (ibiz.config.grid.editShowMode) {
        case "cell":
          return le(e, i);
        case "row":
          return se(e);
        case "all":
          return ne(e);
        default:
          throw new oe("".concat(ibiz.config.grid.editShowMode, "暂未支持"));
      }
    }, {
      gridEditItemProps: x,
      editorProps: w
    } = E(), C = g(void 0), D = (a) => {
      C.value = a;
    }, P = r(() => {
      if (w.readonly) {
        if (ae(C.value)) {
          const a = e.row.data[t.fieldName];
          return t.formatValue(a);
        }
        return C.value;
      }
    }), S = () => s(N("iBizNoData"), {
      text: "暂无数据"
    }, null), A = (a) => {
      t.editorReadonly || a.stopPropagation();
    }, I = async (a, l) => {
      const v = [...c.value];
      v[h.value] = a, Object.assign(v[h.value], {
        ...a,
        [t.listMapField]: t.leftMapField
      }), await y(v, t.fieldName), e.controller.triggerAction(e.row, l);
    }, B = async () => {
      if (m.value = !0, t.editorModel.appDataEntityId) {
        const a = c.value[h.value], l = await t.getServiceData(a, {});
        l && (n.value = l.data, p.value = !0), m.value = !1;
      }
    }, G = (a) => {
      d.value = a, !p.value && a && B();
    }, R = (a, l) => s("div", {
      title: l ? a : "",
      class: [o.b("span-item")]
    }, [a]), L = (a) => {
      const l = a ? a[t.textName] : "", v = l.length > 3;
      return s(N("el-dropdown"), {
        trigger: "click",
        placement: "bottom-start",
        loading: m.value,
        "popper-class": [o.b("dropdown-popper")],
        onVisibleChange: G
      }, {
        default: () => s("div", {
          class: [o.b("dropdown"), o.is("dropdown-expand", d.value)]
        }, [R(l, v), s("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 1024 1024",
          width: "1em",
          height: "1em",
          class: [o.be("dropdown", "icon"), o.is("dropdown-icon-expand", d.value)],
          "data-v-2b52e528": ""
        }, [s("path", {
          d: "M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"
        }, null)])]),
        dropdown: () => s(N("el-dropdown-menu"), null, {
          default: () => n.value.length > 0 ? n.value.map((F) => {
            let z;
            const k = F[t.textName] || "", U = k.length > 16;
            return s(N("el-dropdown-item"), {
              class: [F[t.keyName] === a[t.keyName] ? o.be("dropdown-popper", "active") : ""],
              onClick: (Y) => I(F, Y)
            }, j(z = R(k, U)) ? z : {
              default: () => [z]
            });
          }) : S()
        })
      });
    }, q = (a) => s("div", {
      class: o.be("content", "left")
    }, [L(a)]), _ = () => s("div", {
      class: o.be("content", "center")
    }, [s("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false"
    }, [s("g", {
      "stroke-width": "1",
      "fill-rule": "evenodd"
    }, [s("path", {
      d: "M7.3 4.403l-2.789 2.98a.7.7 0 0 1-1.022-.956L7.45 2.194a.698.698 0 0 1 1.085-.067l3.97 4.323a.7.7 0 1 1-1.031.947L8.7 4.375v8.892c0 .456-.309.833-.7.833-.392 0-.7-.377-.7-.833V4.403z",
      transform: "rotate(90 7.995 8)"
    }, null)])])]), T = (a) => {
      const l = a ? a[t.textName] : "", v = l.length > 9;
      return s("div", {
        class: o.be("content", "right")
      }, [R(l, v)]);
    };
    return {
      ns: o,
      c: t,
      componentRef: i,
      tooltip: P,
      rowDataChange: y,
      onInfoTextChange: D,
      gridEditItemProps: x,
      renderContent: () => {
        const a = c.value[h.value], l = c.value[M.value];
        return s("div", {
          class: [o.b("content"), t.editorReadonly ? o.bm("content", "editor-readonly") : ""],
          onClick: A
        }, [a && q(a), a && l && _(), l && T(l)]);
      }
    };
  },
  render() {
    var e;
    let o;
    return s(N("iBizGridEditItem"), {
      ref: "componentRef",
      required: !this.c.editItem.allowEmpty,
      error: this.row.errors[this.c.fieldName],
      overflowMode: this.controller.grid.overflowMode,
      class: [this.ns, this.ns.m(this.c.grid.overflowMode), (e = this.controller.model.cellSysCss) == null ? void 0 : e.cssName],
      ...this.gridEditItemProps,
      showEditMask: !1
    }, j(o = this.renderContent()) ? o : {
      default: () => [o]
    });
  }
});
class ce {
  constructor() {
    u(this, "component", "IBizGridChangeVersionColumn");
  }
  async createController(o, i) {
    const t = new V(o, i);
    return await t.init(), t;
  }
}
const ve = Q(
  O,
  function(e) {
    e.component(O.name, O), H(
      "GRID_COLRENDER_COLUMN_CHANGE_VERSION",
      () => new ce()
    );
  }
);
export {
  ve as IBizGridChangeVersionColumn,
  ve as default
};
