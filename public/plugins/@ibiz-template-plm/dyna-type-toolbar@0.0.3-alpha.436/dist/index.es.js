import { registerControlProvider as Z, ToolbarController as Q, UIActionButtonState as K, getAllUIActionItems as ee, getUIActionById as te, UIActionUtil as oe, calcAllUIActionDetails as ie } from "@ibiz-template/runtime";
import { defineComponent as ne, ref as ae, resolveComponent as m, h as P, createVNode as s, createTextVNode as re, isVNode as se } from "vue";
import { showTitle as T, recursiveIterate as le, RuntimeError as ue } from "@ibiz-template/core";
import { useControlController as de, useNamespace as W } from "@ibiz-template/vue3-util";
import { convertBtnType as G } from "@ibiz-template/vue3-components";
var pe = Object.defineProperty, ce = (a, l, p) => l in a ? pe(a, l, { enumerable: !0, configurable: !0, writable: !0, value: p }) : a[l] = p, me = (a, l, p) => (ce(a, typeof l != "symbol" ? l + "" : l, p), p);
function z() {
  return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
}
function be() {
  return "".concat(z() + z(), "-").concat(z(), "-").concat(z(), "-").concat(z(), "-").concat(z()).concat(z()).concat(z());
}
const fe = (a, l) => {
  if (l)
    return {
      cssClass: l,
      glyph: "".concat(be(), "@FontAwesome"),
      appId: a
    };
}, Ie = (a, l) => {
  if (l)
    return {
      cssName: l,
      appId: a
    };
};
async function ve(a, l, p) {
  const {
    appId: t,
    detailAppDataEntityId: o,
    detailAppDEDataSetId: u,
    // 文本属性
    textAppDEFieldId: f,
    // 提示值属性
    tipsAppDEFieldId: w,
    // 可见逻辑属性
    visibleScriptAppDEFieldId: C,
    // 图标样式属性
    iconClsAppDEFieldId: g,
    // 样式表属性
    clsAppDEFieldId: x,
    // 按钮样式属性
    buttonStyleAppDEFieldId: B,
    // 行为级别属性
    actionLevelAppDEFieldId: M,
    // 启用逻辑属性
    enableScriptAppDEFieldId: O,
    // 用户标记,用于绑定界面行为标记
    userTag: F,
    // 用户标记2,用于绑定界面行为动态参数数据
    userTag2: L
  } = a, U = [];
  try {
    if (u && o) {
      const k = await ibiz.hub.getApp(t).deService.exec(
        o,
        u,
        l,
        p
      );
      k.ok && Array.isArray(k.data) && k.data.forEach((h) => {
        const R = {
          uiactionId: F,
          caption: h[f],
          tooltip: h[w],
          visibleScriptCode: h[C],
          sysImage: fe(t, h[g]),
          sysCss: Ie(t, h[x]),
          buttonStyle: h[B],
          actionLevel: h[M],
          enableScriptCode: h[O],
          // 适配显示逻辑
          showCaption: !!h[f],
          showIcon: !!h[g],
          detailType: "DEUIACTION",
          itemType: "DEUIACTION",
          id: h[L],
          appId: t
        };
        R.uiactionId && U.push(R);
      });
    }
  } catch (k) {
    ibiz.log.error(k);
  }
  return U;
}
async function ye(a, l, p) {
  if (a.dynamicMode === 1 && !a.uiactionGroupDetails) {
    const t = await ve(
      a,
      l,
      p
    );
    Object.assign(a, {
      uiactionGroupDetails: t
    });
  } else {
    const t = [];
    if (a != null && a.uiactionGroupDetails) {
      const o = ie(
        a.uiactionGroupDetails,
        l,
        p
      );
      t.push(o);
    }
    await Promise.all(t);
  }
  return a;
}
class H extends Q {
  /**
   * 初始化工具栏按钮状态对象
   */
  async initButtonState() {
    const l = [];
    le(
      this.model,
      (p) => {
        if (this.allToolbarItems.push(p), p.itemType) {
          const o = p, u = new K(
            o.id,
            o.appId,
            o.uiactionId
          );
          this.state.buttonsState.addState(o.id, u);
        }
        if (p.controlLogics)
          for (let o = 0; o < p.controlLogics.length; o++) {
            const u = p.controlLogics[o], f = this.state.buttonsState[p.id];
            if (u.itemName === p.id && u.triggerType === "ITEMVISIBLE" && f) {
              f.visible = !1;
              break;
            }
          }
        const t = p;
        if (t.groupExtractMode && t.uiactionGroup) {
          const o = ye(
            t.uiactionGroup,
            this.context,
            this.params
          );
          l.push(o);
        }
      },
      { childrenFields: ["detoolbarItems"] }
    ), (await Promise.all(l)).forEach((p) => {
      p != null && p.uiactionGroupDetails && ee(p == null ? void 0 : p.uiactionGroupDetails).forEach(
        (t) => {
          const o = new K(
            t.id,
            t.appId,
            t.uiactionId,
            t
          );
          this.state.buttonsState.addState(t.id, o);
        }
      );
    });
  }
  /**
   * 执行按钮的界面行为（如果按钮存在界面行为的话）
   *
   * @protected
   * @param {IDEToolbarItem} item 工具栏项
   * @param {MouseEvent} event 鼠标事件
   * @param {IData} [param] 界面行为参数（界面行为点击自定义按钮可能需要传参数到行为去，标准行为忽略此参数）
   * @return {*}  {Promise<void>}
   * @memberof ToolbarController
   */
  async doUIAction(l, p, t = {}) {
    if (l.itemType === "DEUIACTION") {
      const o = l.uiactionId, u = await te(o, l.appId);
      if (!u)
        throw new ue(
          ibiz.i18n.t("runtime.controller.control.toolbar.noFound", {
            actionId: o
          })
        );
      const f = ["SYS", "BACKEND", "WFBACKEND"].includes(u.uiactionMode) && u.showBusyIndicator !== !1 || u.showBusyIndicator === !0;
      f && this.state.buttonsState.setLoading(l.id);
      try {
        const w = await this.getToolbarEventArgs();
        w.context = Object.assign(w.context, {
          srfappid: l.appId,
          srfdynatype: l.id
        }), w.params = Object.assign(t, w.params), await oe.execAndResolved(
          o,
          {
            ...w,
            event: p
          },
          l.appId
        );
      } finally {
        f && this.state.buttonsState.setLoading("");
      }
    }
  }
}
function A(a) {
  return typeof a == "function" || Object.prototype.toString.call(a) === "[object Object]" && !se(a);
}
const D = (a, l) => {
  var p, t, o, u;
  const f = l && a.counterId ? l.counterData[a.counterId] : void 0, w = a, C = ((p = w.refUIActionGroup) == null ? void 0 : p.name) || ((t = w.refUIActionGroup) == null ? void 0 : t.id) || a.caption, g = a.sysImage, x = [], B = W("toolbar-item");
  return a.showIcon && g && ((o = g.cssClass) != null && o.startsWith("data:image/svg+xml;base64,") || (u = g.cssClass) != null && u.startsWith("data:image/png;base64,") ? x.push(s("span", {
    class: B.b("icon")
  }, [s("img", {
    src: g.cssClass
  }, null)])) : x.push(s("span", {
    class: B.b("icon")
  }, [s(m("iBizIcon"), {
    icon: g
  }, null)]))), a.showCaption && C && x.push(s("span", {
    class: B.b("text")
  }, [C])), f && x.push(s(m("iBizBadge"), {
    class: B.b("counter"),
    value: f,
    counterMode: a.counterMode
  }, null)), x;
}, v = (a) => {
  var l;
  return (l = a == null ? void 0 : a.sysCss) == null ? void 0 : l.cssName;
}, $ = /* @__PURE__ */ ne({
  name: "IBizDynaTypeToolbar",
  props: {
    /**
     * @description 工具栏模型数据
     */
    modelData: {
      type: Object,
      required: !0
    },
    /**
     * @description 绘制模式
     */
    runMode: {
      type: String,
      default: "RUNTIME"
    },
    /**
     * @description 应用上下文对象
     */
    context: {
      type: Object,
      required: !0
    },
    /**
     * @description 视图参数对象
     * @default {}
     */
    params: {
      type: Object,
      default: () => ({})
    },
    /**
     * @description 部件适配器
     */
    provider: {
      type: Object
    },
    /**
     * @description 是否手动计算按钮状态,即工具栏自身默认不计算权限
     * @default false
     */
    manualCalcButtonState: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["click"],
  setup(a, {
    emit: l
  }) {
    var p;
    const t = de((...e) => new H(...e)), o = W("control-".concat(t.model.controlType.toLowerCase())), u = W("control-".concat(t.model.controlType.toLowerCase(), "-actions")), f = ae("default"), w = (p = t.model.toolbarStyle) == null ? void 0 : p.toLowerCase(), C = (e) => !!(e.detailType === "DEUIACTIONGROUP" && e.refUIActionGroup), g = async (e, n, d) => {
      a.runMode === "RUNTIME" ? await t.onItemClick(e, n, d) : l("click", e);
    }, x = async (e, n, d) => {
      if (a.runMode === "RUNTIME") {
        const c = {};
        Object.assign(c, {
          ...e,
          itemType: e.detailType
        }), await g(c, n, d);
      } else
        l("click", e);
    }, B = (e) => e.map((n) => {
      let d;
      return s("div", {
        key: n.id,
        class: [o.e("item")]
      }, [s(m("el-button"), {
        title: T(n.tooltip),
        size: f.value,
        onClick: (c) => g(n, c)
      }, A(d = D(n, t.state)) ? d : {
        default: () => [d]
      })]);
    }), M = (e, n) => {
      var d, c;
      let S;
      if (e.id !== n.id && C(n))
        return L(n, !0);
      const b = n.uiactionId, y = (d = t.state.buttonsState[n.id]) == null ? void 0 : d.visible, I = t.itemProviders[n.id];
      if (!y)
        return null;
      if (I) {
        const r = m(I.component);
        return P(r, {
          key: n.id,
          class: [o.e("item")],
          item: e,
          controller: t
        });
      }
      const i = (c = n.buttonStyle) == null ? void 0 : c.toLowerCase();
      return b === "exportexcel" || b === "gridview_exportaction" ? s(m("i-biz-export-excel"), {
        class: [o.e("menu-exportexcel"), o.em("item", i), v(n)],
        mode: "menu",
        item: n,
        btnContent: (r) => D(r, t.state),
        size: f.value,
        controller: t,
        onExportExcel: (r, E) => {
          x(n, r, E);
        }
      }, null) : s(m("el-menu-item"), {
        class: [o.is("loading", t.state.buttonsState[n.id].loading), o.em("item", i), v(n)],
        index: "menuitem".concat(n.id),
        disabled: t.state.buttonsState[n.id].disabled,
        title: T(n.caption)
      }, {
        default: () => [s(m("el-button"), {
          loading: t.state.buttonsState[n.id].loading,
          onClick: (r) => {
            n.uiactionId && x(n, r);
          }
        }, A(S = D(n, t.state)) ? S : {
          default: () => [S]
        })]
      });
    }, O = (e, n) => {
      if (t.state.buttonsState[e.id].visible) {
        let d;
        return s(m("el-button"), {
          size: f.value,
          class: v(e),
          type: n || G(e.buttonStyle),
          title: T(e.tooltip || e.caption),
          loading: t.state.buttonsState[e.id].loading,
          disabled: t.state.buttonsState[e.id].disabled,
          onClick: (c) => x(e, c)
        }, A(d = D(e, t.state)) ? d : {
          default: () => [d]
        });
      }
      return null;
    }, F = (e) => {
      if (t.state.buttonsState[e.id].visible) {
        const {
          disabled: n
        } = t.state.buttonsState[e.id], d = C(e) ? L(e, !1, !0) : O(e);
        return s(m("el-dropdown-item"), {
          class: [u.be("dropdown-popper", "dropdown-item"), u.is("disabled", !!n), o.em("item", G(e.buttonStyle))]
        }, A(d) ? d : {
          default: () => [d]
        });
      }
      return null;
    }, L = (e, n, d = !1) => {
      const {
        uiactionGroup: c,
        refUIActionGroup: S
      } = e, b = (c == null ? void 0 : c.uiactionGroupDetails) || (S == null ? void 0 : S.uiactionGroupDetails);
      if (b) {
        const y = b.length > 0, I = e.buttonStyle || "";
        if (n) {
          const i = t.state.buttonsState[e.id].disabled || b.findIndex((r) => {
            var E;
            return ((E = t.state.buttonsState[r.id]) == null ? void 0 : E.disabled) === !1;
          }) === -1;
          return s(m("el-sub-menu"), {
            class: [o.b("submenu"), o.be("submenu", "groupdetails"), o.em("item", I.toLowerCase()), v(e)],
            index: e.id,
            disabled: i,
            title: T(e.tooltip),
            "popper-class": [o.b("submenu-popper"), o.em("submenu-popper", "groupdetails"), o.bm("submenu-popper", w), o.em("submenu-popper", I.toLowerCase()), o.bm("submenu-popper", v(e)), v(e)]
          }, {
            default: () => b.map((r) => M(e, r)),
            title: () => M(e, e)
          });
        }
        return d ? s(m("el-popover"), {
          "popper-class": [u.b("popper"), u.b("dropdown-popper"), u.bm("dropdown-popper", w), u.em("dropdown-popper", I.toLowerCase()), u.bm("dropdown-popper", v(e))],
          placement: "right-start",
          teleported: !1,
          "popper-options": {
            modifiers: [{
              name: "offset",
              options: {
                offset: [0, 4]
              }
            }]
          }
        }, {
          reference: () => s(m("el-button"), {
            text: !0,
            size: f.value,
            class: v(e),
            type: G(e.buttonStyle),
            title: T(e.tooltip || e.caption),
            disabled: t.state.buttonsState[e.id].disabled
          }, {
            default: () => [s("div", {
              class: u.be("popper", "reference-btn")
            }, [s("div", {
              class: u.bem("popper", "reference-btn", "content")
            }, [D(e, t.state)]), s("div", {
              class: u.bem("popper", "reference-btn", "chevron")
            }, [s(m("ion-icon"), {
              name: "chevron-forward-outline"
            }, null)])])]
          }),
          default: () => s("div", {
            class: u.be("popper", "wrapper")
          }, [b.map((i) => {
            const r = C(i) ? L(i, !1, !0) : O(i);
            return s("div", {
              class: u.be("popper", "item")
            }, [r]);
          })])
        }) : s(m("el-dropdown"), {
          "popper-class": [u.b("dropdown-popper"), u.bm("dropdown-popper", w), u.em("dropdown-popper", I.toLowerCase()), u.bm("dropdown-popper", v(e))]
        }, {
          default: () => O(e),
          dropdown: () => {
            let i;
            return y && s(m("el-dropdown-menu"), null, A(i = b.map((r) => F(r))) ? i : {
              default: () => [i]
            });
          }
        });
      }
      return null;
    }, U = (e, n) => {
      const d = e[n];
      return d ? C(d) || t.state.buttonsState[d.id].visible ? n : U(e, n + 1) : -1;
    }, k = (e, n) => {
      const {
        uiactionGroup: d
      } = e;
      if (d && d.uiactionGroupDetails) {
        const {
          uiactionGroupDetails: c
        } = d, S = U(c, 0);
        if (S !== -1) {
          const b = c[S], y = c.slice(S + 1).filter((r) => !!t.state.buttonsState[r.id].visible), I = y.length > 0;
          let i = e.buttonStyle || "";
          return n ? (i = b.buttonStyle || "", s(m("el-sub-menu"), {
            class: [o.b("submenu"), o.be("submenu", "groupdetails"), o.em("item", i.toLowerCase()), v(b)],
            index: b.id,
            disabled: t.state.buttonsState[b.id].disabled,
            title: T(b.tooltip),
            "popper-class": [o.b("submenu-popper"), o.be("submenu-popper", "groupdetails"), o.bm("submenu-popper", w), o.em("submenu-popper", i.toLowerCase()), o.bm("submenu-popper", v(b)), v(b)]
          }, {
            default: () => y.map((r) => M(e, r)),
            title: () => M(e, b)
          })) : s(m("el-dropdown"), {
            "split-button": I,
            type: G(i),
            "popper-class": [u.b("dropdown-popper"), u.bm("dropdown-popper", w), u.em("dropdown-popper", i.toLowerCase()), u.bm("dropdown-popper", v(e))]
          }, {
            default: () => C(b) ? L(b, !1) : O(b, G(i)),
            dropdown: () => {
              let r;
              return I && s(m("el-dropdown-menu"), null, A(r = y.map((E) => F(E))) ? r : {
                default: () => [r]
              });
            }
          });
        }
      }
      return null;
    }, h = (e, n) => {
      const {
        uiactionGroup: d
      } = e;
      if (d && d.uiactionGroupDetails) {
        const {
          uiactionGroupDetails: c
        } = d;
        return n ? c.map((S) => M(e, S)) : c.map((S) => {
          const b = C(S) ? L(S, n) : O(S);
          return s("div", {
            class: [u.e("item-deuiaction"), o.em("item", G(S.buttonStyle))]
          }, [b]);
        });
      }
      return null;
    }, R = (e, n = !1) => {
      const {
        groupExtractMode: d
      } = e;
      switch (d) {
        case "ITEMS":
          return L(e, n);
        case "ITEMX":
          return k(e, n);
        case "ITEM":
        default:
          return h(e, n);
      }
    }, _ = (e) => {
      const n = e.detoolbarItems || [], d = t.state.buttonsState[e.id].visible, c = t.state.buttonsState[e.id].disabled;
      if (!d)
        return null;
      const S = n.findIndex((i) => {
        var r;
        return (r = t.state.buttonsState[i.id]) == null ? void 0 : r.loading;
      }) !== -1, b = n.findIndex((i) => {
        var r;
        return ((r = t.state.buttonsState[i.id]) == null ? void 0 : r.visible) === !0;
      }) !== -1, y = c || n.findIndex((i) => {
        var r;
        return ((r = t.state.buttonsState[i.id]) == null ? void 0 : r.disabled) === !1;
      }) === -1;
      if (e.uiactionGroup && e.uiactionGroup.uiactionGroupDetails && e.uiactionGroup.uiactionGroupDetails.length > 0)
        return R(e, !0);
      if (!b)
        return null;
      const I = e.buttonStyle || "";
      return s(m("el-sub-menu"), {
        class: [o.b("submenu"), o.em("item", I.toLowerCase()), v(e)],
        index: e.id,
        disabled: y,
        title: T(e.tooltip),
        "popper-class": [o.b("submenu-popper"), o.bm("submenu-popper", w), o.em("submenu-popper", I.toLowerCase()), o.bm("submenu-popper", v(e)), v(e)]
      }, {
        default: () => n.map((i) => {
          var r, E;
          const V = i.uiactionId, J = (r = t.state.buttonsState[i.id]) == null ? void 0 : r.visible, Y = t.itemProviders[i.id];
          if (!J)
            return null;
          if (Y) {
            const N = m(Y.component);
            return P(N, {
              key: i.id,
              class: [o.e("item")],
              item: e,
              controller: t
            });
          }
          if (i.itemType !== "SEPERATOR") {
            if (i.itemType === "RAWITEM")
              return s(m("el-menu-item"), {
                index: "menuitem".concat(i.id),
                title: T(i.tooltip)
              }, {
                default: () => [s(m("iBizRawItem"), {
                  rawItem: i,
                  content: i.rawItem.content,
                  class: o.b("submenu-rawitem"),
                  onClick: (N) => g(i, N)
                }, null)]
              });
            if (i.itemType === "DEUIACTION") {
              let N;
              const q = (E = i.buttonStyle) == null ? void 0 : E.toLowerCase();
              return V === "exportexcel" || V === "gridview_exportaction" ? s(m("i-biz-export-excel"), {
                class: [o.e("menu-exportexcel"), o.em("item", q), v(i)],
                mode: "menu",
                item: i,
                btnContent: (j) => D(j, t.state),
                size: f.value,
                controller: t,
                onExportExcel: (j, X) => {
                  g(i, j, X);
                }
              }, null) : s(m("el-menu-item"), {
                class: [o.is("loading", t.state.buttonsState[i.id].loading), o.em("item", q), v(i)],
                index: "menuitem".concat(i.id),
                disabled: t.state.buttonsState[i.id].disabled,
                title: T(i.tooltip),
                onClick: (j) => g(i, j)
              }, {
                default: () => [s(m("el-button"), {
                  loading: t.state.buttonsState[i.id].loading
                }, A(N = D(i, t.state)) ? N : {
                  default: () => [N]
                })]
              });
            }
            return i.itemType === "ITEMS" ? _(i) : null;
          }
        }),
        title: () => {
          let i;
          return s(m("el-button"), {
            loading: S,
            disabled: y,
            type: G(I)
          }, A(i = D(e, t.state)) ? i : {
            default: () => [i]
          });
        }
      });
    };
    return {
      c: t,
      btnSize: f,
      ns: o,
      toolbarStyle: w,
      handleClick: g,
      renderExtraButtons: B,
      renderToolbarItem: (e) => {
        var n, d;
        const c = e.id, S = (n = t.state.buttonsState[c]) == null ? void 0 : n.visible, b = t.itemProviders[c];
        if (!S)
          return null;
        if (b) {
          const y = m(b.component);
          return P(y, {
            key: c,
            class: [o.e("item")],
            item: e,
            controller: t
          });
        }
        if (e.itemType === "SEPERATOR")
          return t.state.hideSeparator.includes(c) ? null : s("div", {
            key: c,
            class: [o.e("item"), o.e("item-separator")]
          }, [re("|")]);
        if (e.itemType === "RAWITEM")
          return s("div", {
            key: c,
            class: [o.e("item"), o.e("item-rawitem")]
          }, [s(m("iBizRawItem"), {
            rawItem: e,
            content: e.rawItem.content,
            onClick: (y) => g(e, y)
          }, null)]);
        if (e.itemType === "DEUIACTION") {
          let y;
          const I = e.uiactionId, {
            buttonStyle: i
          } = e;
          return I === "exportexcel" || I === "gridview_exportaction" ? s(m("i-biz-export-excel"), {
            class: [o.e("item"), o.e("item-deuiaction"), o.em("item", i == null ? void 0 : i.toLowerCase()), v(e)],
            item: e,
            btnContent: (r) => D(r, t.state),
            size: f.value,
            controller: t,
            onExportExcel: (r, E) => {
              g(e, r, E);
            }
          }, null) : I === "shortcut" ? s(m("i-biz-short-cut-button"), {
            key: c,
            class: [o.e("item"), o.e("item-deuiaction"), o.em("item", i == null ? void 0 : i.toLowerCase()), v(e)],
            item: e,
            controller: t,
            size: f.value,
            onClick: (r) => g(e, r)
          }, null) : s("div", {
            key: c,
            class: [o.e("item"), o.e("item-deuiaction"), o.em("item", i == null ? void 0 : i.toLowerCase()), v(e), o.is("loading", t.state.buttonsState[c].loading)]
          }, [s(m("el-button"), {
            size: f.value,
            title: T(e.tooltip),
            type: G(i),
            loading: t.state.buttonsState[c].loading,
            disabled: t.state.buttonsState[c].disabled,
            onClick: (r) => g(e, r)
          }, A(y = D(e, t.state)) ? y : {
            default: () => [y]
          })]);
        }
        if (e.itemType === "ITEMS") {
          let y;
          const I = e, i = I.buttonStyle || "";
          if (I.groupExtractMode && I.uiactionGroup) {
            const r = "extract-mode-".concat(((d = I.groupExtractMode) == null ? void 0 : d.toLowerCase()) || "item");
            return s("div", {
              class: [u.b(), u.e(r), u.em("item", i.toLowerCase()), v(e)]
            }, [R(e)]);
          }
          return s(m("el-menu"), {
            mode: "horizontal",
            class: [o.e("menu"), o.em("menu", i.toLowerCase()), v(e)],
            ellipsis: !1,
            "menu-trigger": "hover"
          }, A(y = _(e)) ? y : {
            default: () => [y]
          });
        }
        return null;
      }
    };
  },
  render() {
    var a, l, p;
    const {
      state: t
    } = this.c;
    let o = null;
    return t.isCreated && (o = [
      // 绘制最前方的额外按钮
      ((a = t.extraButtons.before) == null ? void 0 : a.length) > 0 && this.renderExtraButtons(t.extraButtons.before),
      (l = this.modelData.detoolbarItems) == null ? void 0 : l.map((u, f) => {
        var w;
        const C = this.renderToolbarItem(u);
        return (w = t.extraButtons[f]) != null && w.length ? [C, this.renderExtraButtons(t.extraButtons[f])] : C;
      }),
      // 绘制最后方的额外按钮
      ((p = t.extraButtons.after) == null ? void 0 : p.length) > 0 && this.renderExtraButtons(t.extraButtons.after)
    ]), s(m("iBizControlBase"), {
      controller: this.c,
      class: [this.ns.m(t.viewMode.toLowerCase()), this.ns.m(this.toolbarStyle)]
    }, A(o) ? o : {
      default: () => [o]
    });
  }
});
class we {
  constructor() {
    me(this, "component", "IBizDynaTypeToolbar");
  }
  createController(l, p, t, o) {
    return new H(l, p, t, o);
  }
}
const Ee = {
  install(a) {
    a.component($.name, $), Z(
      "TOOLBAR_RENDER_DYNATYPETOOLBAR",
      () => new we()
    );
  }
};
export {
  Ee as default
};
