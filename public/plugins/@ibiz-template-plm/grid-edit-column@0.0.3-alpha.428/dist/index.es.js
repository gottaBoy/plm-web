import './assets/style.css';
import { withInstall as J, useNamespace as U, useUIStore as fe, useClickOutside as Q } from "@ibiz-template/vue3-util";
import { registerGridColumnProvider as we, registerTreeGridExColumnProvider as Ce, GridRowState as ge, Srfuf as F, TreeGridExFieldColumnController as W, TreeGridExRowState as Z, GridFieldEditColumnController as be, UIActionUtil as ee, SysUIActionTag as K, TreeGridExNodeColumnController as Ee } from "@ibiz-template/runtime";
import { defineComponent as $, ref as I, computed as a, onMounted as te, createVNode as n, resolveComponent as g, h as j, watch as Ie, isVNode as ye, reactive as N } from "vue";
import { isNotNil as oe, isNil as Pe } from "ramda";
import { RuntimeError as ie } from "@ibiz-template/core";
var Te = Object.defineProperty, Le = (e, l, t) => l in e ? Te(e, l, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[l] = t, q = (e, l, t) => (Le(e, typeof l != "symbol" ? l + "" : l, t), t);
function xe(e, l) {
  const t = e.controller, d = a(() => e.row.editColStates[t.fieldName].disabled), u = a(() => e.row.editColStates[t.fieldName].readonly), o = a(() => !!e.row.errors[t.fieldName]), v = a(
    () => e.row.editColStates[t.fieldName].editable
  ), i = (C) => {
    e.row.editColStates[t.fieldName].editable = C;
  }, r = a(() => !d.value && !u.value && !o.value), p = a(() => o.value || r.value && v.value), h = a(() => !p.value), c = !1, w = !0, y = a(() => r.value && !v.value), k = a(() => v.value);
  let L;
  const x = () => {
    i(!0), L = Q(l, async (C) => {
      i(!1), L.stop();
    });
  }, S = () => {
    L && L.stop(), ibiz.log.debug("".concat(t.fieldName, "属性编辑器focus事件"));
  };
  let M = e.row.data[t.fieldName];
  const z = I(!1), m = async () => {
    var C;
    ibiz.log.debug("".concat(t.fieldName, "属性编辑器blur事件")), !(z.value || t.hasDropdown) && (i(!1), ((C = t.model.userParam) == null ? void 0 : C.SAVEMODE) === "BLUR" ? t.grid.save(e.row.data) : e.row.data.srfuf === F.CREATE ? (e.row.modified || t.grid.remove({ data: [e.row.data], silent: !0 }), await t.grid.save(e.row.data)) : t.setRowValue(e.row, M));
  }, b = async () => {
    t.setPickerValue(e.row), z.value = !0, ibiz.log.debug("".concat(t.fieldName, "属性编辑器enter事件")), e.row.data.srfuf === F.CREATE && (e.row.modified || t.grid.remove({ data: [e.row.data], silent: !0 })), await t.grid.save(e.row.data), M = e.row.data[t.fieldName], i(!1), z.value = !1;
  }, T = (C) => {
    C.keyCode === 27 && i(!1);
  }, E = N({
    showEditMask: y,
    stopPropagation: k
  }), R = N({
    autoFocus: w,
    disabled: c,
    readonly: h,
    cellEditable: r,
    onFocus: S,
    onBlur: m,
    onEnter: b,
    onKeydown: T
  });
  return {
    gridEditItemProps: E,
    editorProps: R,
    onMaskClick: x
  };
}
function Se(e, l) {
  const t = e.controller, d = a(() => e.row.editColStates[t.fieldName].disabled), u = a(() => e.row.editColStates[t.fieldName].readonly), o = a(
    () => e.row.editColStates[t.fieldName].editable
  ), v = a(() => u.value || !o.value), i = a(() => o.value && d.value), r = a(() => o.value), p = N({
    stopPropagation: r
  }), h = N({
    disabled: i,
    readonly: v
  });
  return {
    gridEditItemProps: p,
    editorProps: h
  };
}
function ke(e, l) {
  const t = e.controller, d = a(() => e.row.editColStates[t.fieldName].disabled), u = a(() => e.row.editColStates[t.fieldName].readonly), o = a(() => e.controller.grid.state.rowEditOpen), v = a(() => u.value || !o.value), i = a(() => o.value && d.value), r = a(() => o.value), p = () => {
    t.grid.save(e.row.data);
  }, h = N({
    stopPropagation: r
  }), c = N({
    disabled: i,
    readonly: v,
    onBlur: p
  });
  return {
    gridEditItemProps: h,
    editorProps: c
  };
}
class le extends be {
  constructor() {
    super(...arguments), q(this, "userCodeList"), q(this, "hasDropdown", !1), q(this, "curPickerId", "");
  }
  /**
   * 加载用户代码表
   *
   * @param {IData} data
   * @return {*}  {Promise<readonly}
   * @memberof GridEditColumnController
   */
  async loadUserCodeList(l) {
    if (l.codelistTag) {
      const t = ibiz.hub.getApp(this.context.srfappid), d = await t.codeList.get(
        l.codelistTag,
        this.context,
        this.params
      );
      this.userCodeList = t.codeList.getCodeList(l.codelistTag);
      const u = (l.pickerData || "").split(",");
      return this.hasDropdown = !0, d.filter((o) => u.includes(o.id));
    }
    return [];
  }
  /**
   * 设置选中数据
   *
   * @param {IData} data
   * @return {*}  {Promise<readonly}
   * @memberof GridEditColumnController
   */
  setPickerValue(l) {
    const { srfuf: t } = l.data;
    if (t === F.CREATE) {
      const d = l.data.srfUserData;
      d && d.pickerField && (l.data[d.pickerField] = this.curPickerId);
    }
  }
}
const ae = /* @__PURE__ */ $({
  name: "IBizEditColumnActionToolbar",
  props: {
    actionDetails: {
      type: Array,
      required: !0
    },
    actionsState: {
      type: Object,
      required: !0
    },
    caption: String,
    mode: {
      type: String,
      default: "buttons"
    },
    // 分组的行为级别
    groupLevelKeys: {
      type: Array,
      default: () => [50]
    },
    editColums: {
      type: Object,
      required: !0
    },
    showCommonAction: {
      type: Boolean,
      default: !0
    },
    zIndex: Number,
    popperClass: String
  },
  emits: ["saveAll", "actionClick"],
  setup(e, {
    emit: l
  }) {
    var t;
    const d = U("edit-column-action-toolbar"), u = U("edit-column-action-toolbar"), o = I(!1), v = I(!1), i = I(!1), r = I(), p = I(), h = I(!1);
    (t = e.actionDetails) == null || t.forEach((f) => {
      f.capLanguageRes && f.capLanguageRes.lanResTag && (f.caption = ibiz.i18n.t(f.capLanguageRes.lanResTag, f.caption)), f.tooltipLanguageRes && f.tooltipLanguageRes.lanResTag && (f.tooltip = ibiz.i18n.t(f.tooltipLanguageRes.lanResTag, f.tooltip));
    });
    const c = I([]), w = I([]), y = () => {
      w.value = [], c.value = [], e.actionDetails && e.actionDetails.forEach((f) => {
        !e.showCommonAction && f.actionLevel === 200 || (e.groupLevelKeys.findIndex((D) => D === f.actionLevel) !== -1 ? w.value.push(f) : c.value.push(f));
      });
    };
    Ie(() => e.showCommonAction, () => {
      y();
    }, {
      immediate: !0
    });
    const k = (f) => {
      f.stopPropagation(), v.value = !0;
    }, L = () => {
      v.value = !1;
    }, x = () => {
      i.value = !0;
    }, S = () => {
      i.value = !1;
    }, M = () => {
      h.value = !0;
    }, z = () => {
      h.value = !1;
    }, m = () => {
      S(), v.value = !1;
    }, b = async (f, D) => {
      D.stopPropagation(), l("actionClick", f, D);
    }, T = (f) => {
      const {
        actionLevel: D
      } = f;
      return [d.e("item"), d.is("disabled", !1), d.em("item", "level-".concat(D)), d.is("level-".concat(D), !0)];
    }, E = () => {
      i.value || (v.value = !1);
    }, R = (f) => {
      f.stopPropagation(), f.preventDefault();
    };
    let C;
    return {
      ns: d,
      ns2: u,
      actionRef: p,
      childLevelRef: r,
      expandDetails: c,
      groupDetails: w,
      popoverVisible: o,
      topLevelVisible: v,
      handleClick: b,
      openTopLevel: k,
      closeTopLevel: L,
      openChildLevel: x,
      closeChildLevel: S,
      closeAllPopover: m,
      openProcessing: M,
      closeProcessing: z,
      onChildLevelClick: R,
      onTopLevelPopHide: () => {
        C == null || C.stop(), l("saveAll");
      },
      onTopLevelPopShow: () => {
        const f = r.value;
        C = Q(p, () => {
          h.value || E();
        }, {
          ignore: [f]
        });
      },
      calcActionItemClass: T
    };
  },
  render() {
    var e;
    const {
      $slots: l
    } = this, t = () => {
      const i = this.editColums.map((r) => {
        const {
          caption: p
        } = r.model, h = r.model.sysImage || {
          cssClass: "fa fa-bars"
        };
        return n(g("el-popover"), {
          placement: "right-start",
          width: "280",
          teleported: !1,
          offset: 16,
          trigger: "click"
        }, {
          reference: () => n("div", {
            class: this.ns.bem("popper", "action-group", "edit-column")
          }, [n("div", {
            class: this.ns.bem("popper", "action-group", "icon")
          }, [n(g("iBizIcon"), {
            icon: h
          }, null)]), n("span", null, [p])]),
          default: () => n("div", {
            onMouseenter: this.openChildLevel,
            onMouseleave: this.closeChildLevel,
            ref: "childLevelRef",
            onClick: (c) => this.onChildLevelClick(c)
          }, [l.editor && (l == null ? void 0 : l.editor(r))])
        });
      });
      return i.length > 0 ? n("div", {
        class: this.ns.be("popper", "edit-group")
      }, [i]) : null;
    }, d = (i) => n(g("el-divider"), {
      class: this.ns.e("separator"),
      "border-style": "double",
      direction: i ? "vertical" : "horizontal"
    }, null), u = (i, r = !0) => [i.addSeparator && d(r), n(g("el-button"), {
      text: !0,
      size: "small",
      onClick: (p) => this.handleClick(i, p),
      title: i.tooltip,
      disabled: this.actionsState[i.id].disabled,
      class: this.calcActionItemClass(i)
    }, {
      default: () => [n("div", {
        class: [this.ns.em("item", "icon"), this.ns.is("has-caption", i.showCaption && !!i.caption), this.ns.is("has-icon", i.showIcon && !!i.sysImage)]
      }, [i.showIcon && i.sysImage && n(g("iBizIcon"), {
        icon: i.sysImage
      }, null)]), n("div", {
        class: [this.ns.em("item", "label"), this.ns.is("has-caption", i.showCaption && !!i.caption), this.ns.is("has-icon", i.showIcon && !!i.sysImage)]
      }, [i.showCaption ? i.caption : ""])]
    })], o = (i, r = !0) => {
      if (r)
        return i.map((c) => {
          var w;
          return (w = this.actionsState[c.id]) != null && w.visible ? u(c, r) : null;
        });
      let p = null;
      const h = [];
      return i.forEach((c) => {
        c.uiactionId && c.uiactionId.includes("get_editor_column") ? p = t() : this.actionsState[c.id].visible && h.push(u(c, r));
      }), n("div", {
        class: this.ns.be("popper", "action-group"),
        ref: "actionRef"
      }, [p, ...h]);
    }, v = () => {
      if (this.groupDetails.length === 0 || this.groupDetails.findIndex((r) => this.actionsState[r.id].visible === !0) === -1)
        return null;
      const i = this.groupDetails.findIndex((r) => this.actionsState[r.id].disabled === !1) === -1;
      return n(g("el-popover"), {
        width: "280",
        disabled: i,
        placement: "right-start",
        visible: this.topLevelVisible,
        "popper-class": this.ns.b("popper"),
        "popper-style": {
          zIndex: this.zIndex
        },
        onShow: () => {
          this.onTopLevelPopShow();
        },
        onHide: () => {
          this.onTopLevelPopHide();
        }
      }, {
        reference: () => n(g("el-button"), {
          size: "small",
          text: !0,
          disabled: i,
          onClick: this.openTopLevel,
          class: [this.ns.e("item"), this.ns.is("group-button", !0), this.ns.is("expand", this.topLevelVisible)]
        }, {
          icon: () => n(g("ion-icon"), {
            class: this.ns.e("icon"),
            name: "ellipsis-vertical",
            title: ibiz.i18n.t("component.actionToolbar.more")
          }, null)
        }),
        default: () => o(this.groupDetails, !1)
      });
    };
    if ((e = this.actionsState) != null && e.visible)
      return n("div", {
        class: [this.ns.b(), this.ns.m("buttons")],
        onClick: (i) => i.stopPropagation()
      }, [o(this.expandDetails), v()]);
  }
}), re = [
  "TEXTBOX",
  "PASSWORD",
  "TEXTAREA",
  "TEXTAREA_10",
  "NUMBER",
  "SOLIDER",
  "STEPPER"
];
function Re(e) {
  return typeof e == "function" || Object.prototype.toString.call(e) === "[object Object]" && !ye(e);
}
const X = /* @__PURE__ */ $({
  name: "GridEditColumn",
  props: {
    controller: {
      type: le,
      required: !0
    },
    row: {
      type: ge,
      required: !0
    }
  },
  setup(e) {
    var l;
    const t = U("grid-edit-column"), d = I(), u = I(), o = e.controller, v = (l = o.editItem) == null ? void 0 : l.codeName, {
      zIndex: i
    } = e.controller.grid.state, r = I([]), p = I("");
    let h = !1;
    const c = e.row.data.srfUserData;
    (async () => {
      const {
        srfuf: s
      } = e.row.data;
      s === F.CREATE && c && (r.value = await o.loadUserCodeList(c), p.value = c.defaultValue, o.curPickerId = c.defaultValue);
    })();
    const w = a(() => !(o.grid.model.controlType === "TREEGRID" && !o.grid.state.showTreeGrid)), y = () => {
      var s;
      (s = d.value) == null || s.closeAllPopover();
    }, k = async (s, P) => {
      await o.setRowValue(e.row, s, P);
    }, L = () => {
      switch (ibiz.config.grid.editShowMode) {
        case "cell":
          return xe(e, u);
        case "row":
          return Se(e);
        case "all":
          return ke(e);
        default:
          throw new ie("".concat(ibiz.config.grid.editShowMode, "暂未支持"));
      }
    }, {
      gridEditItemProps: x,
      editorProps: S
    } = L(), M = (s) => {
      e.row.editColStates[o.fieldName].editable = s;
    };
    te(() => {
      e.row.data.srfuf === F.CREATE && M(!0);
    });
    const z = (s) => {
      e.controller.hasAction && (s.stopPropagation(), e.controller.triggerAction(e.row, s));
    }, m = (s) => {
      e.controller.isLinkColumn && (s.stopPropagation(), e.controller.openLinkView(e.row, s));
    }, b = a(() => o.getCustomHtml(e.row)), T = Object.values(o.grid.columns).filter((s) => s.enableRowEdit && s.model.id !== o.model.id), E = a(() => e.row.data[e.controller.model.codeName.toLowerCase()]), R = a(() => o.formatValue(E.value)), C = I(void 0), f = (s) => {
      C.value = s;
    }, D = a(() => {
      if (e.controller.grid.overflowMode === "ellipsis" && oe(E.value) && E.value !== "")
        return C.value ? C.value : R.value + (e.controller.model.unitName || "");
    }), B = async (s, P) => {
      var V, A, O, H;
      P.stopPropagation(), (V = d.value) == null || V.openProcessing();
      const G = {
        context: o.context,
        params: o.params,
        data: [e.row.data],
        view: o.grid.view,
        event: P
      }, _ = await ee.exec(s.uiactionId, G, s.appId);
      if ((A = d.value) == null || A.closeProcessing(), _.cancel || y(), _.closeView)
        G.view.modal.ignoreDismissCheck = !0, G.view.closeView({
          ok: !0
        });
      else if (_.refresh)
        switch (_.refreshMode) {
          case 1:
            G.view.callUIAction(K.REFRESH);
            break;
          case 2:
            (O = G.view.parentView) == null || O.callUIAction(K.REFRESH);
            break;
          case 3:
            (H = G.view.getTopView()) == null || H.callUIAction(K.REFRESH);
            break;
        }
    }, se = async (s, P, V) => {
      const A = V || s.editItem.codeName;
      await o.setRowValue(e.row, P, A);
      const O = s.editor.model.editorType;
      re.includes(O) || y();
    }, ne = () => {
      y(), o.grid.saveAll();
    }, de = (s) => {
      var P, V;
      const A = s.editItem.codeName, O = e.row.data[A], H = (P = e.row.editColStates[A]) == null ? void 0 : P.readonly, G = (V = e.row.editColStates[A]) == null ? void 0 : V.disabled;
      return s.editorProvider && j(g(s.editorProvider.gridEditor), {
        class: t.e("editor"),
        value: H ? s.formatValue(O) : O,
        data: e.row.data,
        controller: s.editor,
        overflowMode: o.grid.overflowMode,
        // eslint-disable-next-line no-shadow
        onChange: (_, ve) => se(s, _, ve),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onEnter: (_) => ne(),
        readonly: H,
        disabled: G
      });
    }, ce = (s) => {
      s.stopPropagation(), M(!0);
    }, ue = () => {
      o.grid.saveAll();
    }, he = () => {
      const {
        enableRowEdit: s,
        deuiactionGroup: P
      } = o.model, V = [];
      return s && V.push(n(g("el-button"), {
        text: !0,
        size: "small",
        class: "hover-action",
        onClick: (A) => ce(A),
        title: "编辑"
      }, {
        default: () => [n("svg", {
          viewBox: "0 0 16 16",
          xmlns: "http://www.w3.org/2000/svg",
          height: "1em",
          width: "1em",
          preserveAspectRatio: "xMidYMid meet",
          focusable: "false"
        }, [n("g", {
          id: "aiuaction/edit",
          "stroke-width": "1",
          "fill-rule": "evenodd"
        }, [n("path", {
          d: "M2 8.34L10.71 0 15 4.17 6.538 13H2V8.34zm1.2.512V11.8h2.826l7.283-7.6-2.606-2.533L3.2 8.852zM0 16v-1.2h16V16H0z",
          id: "aiu编辑"
        }, null)])])]
      })), P != null && P.uiactionGroupDetails && V.push(n(ae, {
        ref: "actionToolbarRef",
        class: t.e("toolbar"),
        actionDetails: P == null ? void 0 : P.uiactionGroupDetails,
        actionsState: e.row.uiActionGroupStates[o.model.codeName],
        groupLevelKeys: [50, 100],
        zIndex: i,
        editColums: T,
        showCommonAction: w.value,
        onActionClick: B,
        onSaveAll: ue
      }, {
        editor: (A) => de(A)
      })), V;
    }, pe = (s) => {
      p.value = s.id, o.curPickerId = s.id;
    }, me = async (s) => {
      h = s;
    };
    return {
      ns: t,
      picking: h,
      componentRef: u,
      actionToolbarRef: d,
      fieldName: v,
      gridEditItemProps: x,
      rowDataChange: k,
      editorProps: S,
      onCellClick: z,
      onTextClick: m,
      onInfoTextChange: f,
      onActionClick: B,
      renderActions: he,
      CustomHtml: b,
      fieldValue: E,
      formatValue: R,
      tooltip: D,
      renderPicker: () => {
        if (r.value.length > 0)
          return n(g("el-dropdown"), {
            onVisibleChange: me,
            onCommand: (s) => pe(s)
          }, {
            default: () => n(g("iBizCodeList"), {
              class: t.e("text"),
              codeListItems: r.value,
              codeList: o.userCodeList,
              value: p.value
            }, null),
            dropdown: () => {
              let s;
              return n(g("el-dropdown-menu"), null, Re(s = r.value.map((P) => n(g("el-dropdown-item"), {
                title: P.tooltip,
                command: P
              }, {
                default: () => [n(g("iBizCodeList"), {
                  class: t.e("text"),
                  codeListItems: r.value,
                  codeList: o.userCodeList,
                  value: P.id
                }, null)]
              }))) ? s : {
                default: () => [s]
              });
            }
          });
      }
    };
  },
  render() {
    var e;
    const l = this.controller;
    let t = null;
    l.isCustomCode ? t = n("span", {
      class: this.ns.e("script"),
      innerHTML: this.CustomHtml
    }, null) : l.codeList ? t = n(g("iBizCodeList"), {
      class: this.ns.e("text"),
      codeListItems: l.codeListItems,
      codeList: l.codeList,
      value: this.fieldValue,
      onClick: this.onTextClick,
      onInfoTextChange: this.onInfoTextChange,
      title: this.tooltip
    }, null) : t = n("span", {
      class: this.ns.e("text"),
      title: this.tooltip,
      onClick: this.onTextClick
    }, [this.formatValue, this.fieldValue != null && l.model.unitName]);
    const d = n(g("iBizGridEditItem"), {
      ref: "componentRef",
      required: !l.editItem.allowEmpty,
      error: this.row.errors[this.fieldName],
      overflowMode: this.controller.grid.overflowMode,
      class: this.ns.m("edit-item"),
      ...this.gridEditItemProps
    }, {
      default: () => [l.editorProvider && j(g(l.editorProvider.gridEditor), {
        class: this.ns.e("editor"),
        value: this.row.data[this.fieldName],
        data: this.row.data,
        controller: l.editor,
        overflowMode: l.grid.overflowMode,
        onChange: this.rowDataChange,
        onInfoTextChange: this.onInfoTextChange,
        title: this.tooltip,
        ...this.editorProps
      })]
    });
    return n("div", {
      class: [this.ns.b(), l.clickable(this.row) && this.ns.m("clickable"), this.ns.m(this.controller.grid.overflowMode), (e = this.controller.model.cellSysCss) == null ? void 0 : e.cssName, this.ns.is("has-action", !!l.model.deuiactionGroup)],
      onClick: this.onCellClick
    }, [l.model.enableRowEdit ? n("div", {
      class: this.ns.b("edit-container")
    }, [d, this.renderPicker()]) : n("div", {
      class: this.ns.b("text-container")
    }, [t]), !(l.model.enableRowEdit && !this.editorProps.readonly) && this.editorProps.cellEditable ? n("div", {
      class: this.ns.b("toolbar-container")
    }, [this.renderActions()]) : null]);
  }
});
class Ae {
  constructor() {
    q(this, "component", "GridEditColumn");
  }
  async createController(l, t) {
    const d = new le(l, t);
    return await d.init(), d;
  }
}
function Ne(e, l) {
  const t = e.controller, d = a(() => e.row.editColStates[t.name].disabled), u = a(() => e.row.editColStates[t.name].readonly), o = a(() => !!e.row.errors[t.name]), v = a(() => e.row.editColStates[t.name].editable), i = (E) => {
    e.row.editColStates[t.name].editable = E;
  }, r = a(() => !d.value && !u.value && !o.value), p = a(() => o.value || r.value && v.value), h = a(() => !p.value), c = !1, w = !0, y = a(() => !1), k = a(() => v.value);
  let L = e.row.data[e.controller.name];
  const x = I(!1), S = () => {
    ibiz.log.debug("".concat(t.name, "属性编辑器focus事件"));
  }, M = () => {
    var E, R;
    ibiz.log.debug("".concat(t.name, "属性编辑器blur事件")), !x.value && (i(!1), ((E = t.nodeColumn.userParam) == null ? void 0 : E.SAVEMODE) === "BLUR" ? t.treeGrid.save(e.row.data) : ((R = e.row.data._deData) == null ? void 0 : R.srfuf) === F.CREATE ? t.treeGrid.remove({ data: [e.row.data], silent: !0 }) : t.setRowValue(e.row, L));
  }, z = async () => {
    x.value = !0, await t.treeGrid.save(e.row.data), L = e.row.data[e.controller.name], i(!1), x.value = !1;
  }, m = (E) => {
    E.keyCode === 27 && i(!1);
  }, b = N({
    showEditMask: y,
    stopPropagation: k
  }), T = N({
    autoFocus: w,
    disabled: c,
    readonly: h,
    onBlur: M,
    onFocus: S,
    onEnter: z,
    onKeydown: m
  });
  return {
    gridEditItemProps: b,
    editorProps: T
  };
}
function Me(e, l) {
  const t = e.controller, d = a(() => e.row.editColStates[t.name].disabled), u = a(() => e.row.editColStates[t.name].readonly), o = a(() => e.row.editColStates[t.name].editable), v = a(() => u.value || !o.value), i = a(() => o.value && d.value), r = a(() => o.value), p = N({
    stopPropagation: r
  }), h = N({
    disabled: i,
    readonly: v
  });
  return {
    gridEditItemProps: p,
    editorProps: h
  };
}
function ze(e, l) {
  const t = e.controller, d = a(() => e.row.editColStates[t.name].disabled), u = a(() => e.row.editColStates[t.name].readonly), o = a(() => e.controller.treeGrid.state.rowEditOpen), v = a(() => u.value || !o.value), i = a(() => o.value && d.value), r = a(() => o.value), p = () => {
    t.treeGrid.save(e.row.data);
  }, h = N({
    stopPropagation: r
  }), c = N({
    disabled: i,
    readonly: v,
    onBlur: p
  });
  return {
    gridEditItemProps: h,
    editorProps: c
  };
}
const De = /* @__PURE__ */ $({
  name: "TreeGridExEditColumn",
  props: {
    controller: {
      type: Ee,
      required: !0
    },
    row: {
      type: Z,
      required: !0
    }
  },
  setup(e) {
    const l = a(() => e.row.data[e.controller.name]), t = U("tree-grid-ex-edit-column"), d = I(), u = e.controller, o = async (w, y) => {
      ibiz.log.debug("".concat(u.name, "值变更"), w), await u.setRowValue(e.row, w, y);
    }, v = () => {
      switch (ibiz.config.grid.editShowMode) {
        case "cell":
          return Ne(e);
        case "row":
          return Me(e);
        case "all":
          return ze(e);
        default:
          throw new ie("".concat(ibiz.config.grid.editShowMode, "暂未支持"));
      }
    }, {
      gridEditItemProps: i,
      editorProps: r
    } = v(), p = I(void 0), h = (w) => {
      p.value = w;
    }, c = a(() => {
      if (r.readonly)
        return Pe(p.value) ? u.formatValue(l.value) : p.value;
    });
    return {
      ns: t,
      fieldValue: l,
      componentRef: d,
      tooltip: c,
      rowDataChange: o,
      onInfoTextChange: h,
      gridEditItemProps: i,
      editorProps: r
    };
  },
  render() {
    return n(g("iBizGridEditItem"), {
      ref: "componentRef",
      required: !this.controller.nodeEditItem.allowEmpty,
      overflowMode: this.controller.overflowMode,
      class: [this.ns, this.ns.m(this.controller.overflowMode)],
      ...this.gridEditItemProps
    }, {
      default: () => [this.controller.editorProvider && j(g(this.controller.editorProvider.gridEditor), {
        class: this.ns.e("editor"),
        value: this.fieldValue,
        data: this.row.data,
        controller: this.controller.editor,
        overflowMode: this.controller.overflowMode,
        onChange: this.rowDataChange,
        onInfoTextChange: this.onInfoTextChange,
        title: this.tooltip,
        ...this.editorProps
      })]
    });
  }
}), Y = /* @__PURE__ */ $({
  name: "TreeGridExFieldColumn",
  props: {
    controller: {
      type: W,
      required: !0
    },
    row: {
      type: Z,
      required: !0
    }
  },
  setup(e) {
    const l = U("tree-grid-ex-field-column"), t = U("tree-grid-ex-field-edit-column"), d = fe().zIndex.increment(), u = I(), o = a(() => e.controller.nodeColumnControllerMap.get(e.row.data._nodeId)), v = a(() => e.row.editColStates[o.value.name].editable), i = a(() => e.row.editColStates[o.value.name].readonly), r = (m) => {
      e.row.editColStates[o.value.name].editable = m;
    }, p = (m) => {
      m.stopPropagation(), r(!0);
    };
    te(() => {
      e.row.data.srfuf === F.CREATE && r(!0);
    });
    const h = a(() => e.row.data._nodeType !== "DE" && e.controller.isFirstShowColumn ? e.row.data._text : e.row.data[e.controller.name]), c = I(""), w = (m) => {
      c.value = m;
    }, y = a(() => {
      const m = o.value;
      return m ? m.nodeEditItem ? void 0 : m.codeList ? c.value : m.formatValue(h.value) + (m.unitName || "") : h.value;
    }), k = a(() => {
      if (e.controller.treeGrid.overflowMode === "ellipsis" && oe(h.value) && h.value !== "")
        return y.value;
    }), L = a(() => h.value && o.value && (o.value.isLinkColumn || o.value.hasClickAction)), x = (m) => {
      var b;
      (b = o.value) == null || b.onTextClick(e.row, m);
    }, S = () => {
      var m;
      (m = u.value) == null || m.closeAllPopover();
    }, M = async (m, b) => {
      var T, E, R;
      b.stopPropagation();
      const C = (T = o.value) == null ? void 0 : T.treeGrid;
      if (C) {
        (E = u.value) == null || E.openProcessing();
        const f = C.getEventArgs(), D = C.parseTreeNodeData(e.row.data), B = await ee.exec(m.uiactionId, {
          ...f,
          ...D,
          event: b
        }, m.appId);
        if ((R = u.value) == null || R.closeProcessing(), B.cancel || S(), B.closeView)
          C.view.closeView();
        else if (B.refresh)
          switch (B.refreshMode) {
            case 1:
              C.refreshNodeChildren(e.row.data);
              break;
            case 2:
              C.refreshNodeChildren(e.row.data, !0);
              break;
            case 3:
              C.refresh();
              break;
          }
      }
    }, z = a(() => Object.values(e.controller.treeGrid.columns).filter((m) => {
      var b;
      const T = m.nodeColumnControllerMap.get(e.row.data._nodeId);
      return T.nodeColumn.enableRowEdit && T.nodeColumn.id !== ((b = o.value) == null ? void 0 : b.nodeColumn.id);
    }));
    return {
      ns: l,
      ns2: t,
      zIndex: d,
      nodeColumn: o,
      fieldValue: h,
      showText: y,
      clickable: L,
      tooltip: k,
      editable: v,
      readonly: i,
      editColums: z,
      actionToolbarRef: u,
      onInfoTextChange: w,
      onDataChange: async (m, b, T) => {
        await m.setRowValue(e.row, b, T);
        const E = m.editor.model.editorType;
        re.includes(E) || S();
      },
      editorEnter: async (m, b, T) => {
        await m.setRowValue(e.row, b, T), S();
      },
      onTextClick: x,
      onActionClick: M,
      onOpenEdit: p
    };
  },
  render() {
    var e, l, t, d;
    let u = null;
    const o = (r) => {
      var p, h;
      const c = r.nodeColumnControllerMap.get(this.row.data._nodeId), w = c.name, y = this.row.data[w], k = (p = this.row.editColStates[w]) == null ? void 0 : p.readonly, L = (h = this.row.editColStates[w]) == null ? void 0 : h.disabled;
      return c.editorProvider && j(g(c.editorProvider.gridEditor), {
        class: this.ns.e("editor"),
        value: k ? c.formatValue(y) : y,
        data: this.row.data,
        controller: c.editor,
        overflowMode: c.overflowMode,
        // eslint-disable-next-line no-shadow
        onChange: (x, S) => this.onDataChange(c, x, S || w),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onEnter: (x) => this.editorEnter(c, y, w),
        // 待测试
        readonly: k,
        disabled: L
      });
    };
    (e = this.nodeColumn) != null && e.nodeEditItem ? u = n(De, {
      controller: this.nodeColumn,
      row: this.row
    }, null) : (l = this.nodeColumn) != null && l.codeList ? u = n(g("iBizCodeList"), {
      class: this.ns.e("text"),
      codeListItems: this.nodeColumn.codeListItems,
      codeList: this.nodeColumn.codeList,
      value: this.fieldValue,
      onClick: this.onTextClick,
      onInfoTextChange: this.onInfoTextChange,
      title: this.tooltip
    }, null) : u = n("span", {
      class: this.ns.e("text"),
      title: this.tooltip,
      onClick: this.onTextClick
    }, [this.showText]);
    let v;
    this.$slots.actions ? v = this.$slots.actions() : this.row.columnActionsStates[this.controller.name] && (v = n(ae, {
      ref: "actionToolbarRef",
      class: this.ns.e("toolbar"),
      actionDetails: (t = this.nodeColumn) == null ? void 0 : t.nodeColumn.deuiactionGroup.uiactionGroupDetails,
      actionsState: this.row.columnActionsStates[this.controller.name],
      groupLevelKeys: [50, 100],
      zIndex: this.zIndex,
      editColums: this.editColums,
      onActionClick: this.onActionClick
    }, {
      editor: (r) => o(r)
    }));
    const i = n(g("el-button"), {
      text: !0,
      size: "small",
      class: "hover-action",
      onClick: (r) => this.onOpenEdit(r),
      title: "编辑"
    }, {
      default: () => [n("svg", {
        viewBox: "0 0 16 16",
        xmlns: "http://www.w3.org/2000/svg",
        height: "1em",
        width: "1em",
        preserveAspectRatio: "xMidYMid meet",
        focusable: "false"
      }, [n("g", {
        id: "aiuaction/edit",
        "stroke-width": "1",
        "fill-rule": "evenodd"
      }, [n("path", {
        d: "M2 8.34L10.71 0 15 4.17 6.538 13H2V8.34zm1.2.512V11.8h2.826l7.283-7.6-2.606-2.533L3.2 8.852zM0 16v-1.2h16V16H0z",
        id: "aiu编辑"
      }, null)])])]
    });
    return n("div", {
      class: [this.ns.b(), this.ns2.b(), this.clickable && this.ns.m("clickable"), this.ns.m(this.controller.treeGrid.overflowMode), this.ns2.m(this.controller.treeGrid.overflowMode), (d = this.controller.model.cellSysCss) == null ? void 0 : d.cssName, this.ns2.is("editable", this.editable), this.ns.is("has-action", !!v)]
    }, [n("div", {
      class: this.ns.b("text-container")
    }, [u]), n("div", {
      class: this.ns.b("toolbar-container")
    }, [!this.editable && !this.readonly ? [i, v] : null])]);
  }
});
class Ve {
  constructor() {
    q(this, "component", "TreeGridExFieldColumn");
  }
  async createController(l, t) {
    const d = new W(l, t);
    return await d.init(), d;
  }
}
const Ge = J(
  X,
  function(e) {
    e.component(X.name, X), we(
      "GRID_COLRENDER_COLUMN_ACTION_EDIT",
      () => new Ae()
    );
  }
), Be = J(
  Y,
  function(e) {
    e.component(Y.name, Y), Ce(
      "GRID_COLRENDER_COLUMN_ACTION_EDIT",
      () => new Ve()
    );
  }
), qe = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(e) {
    e.use(Ge), e.use(Be);
  }
};
export {
  Ge as IBizGridEditColumn,
  Be as IBizTreeGridExFieldColumn,
  qe as default
};
