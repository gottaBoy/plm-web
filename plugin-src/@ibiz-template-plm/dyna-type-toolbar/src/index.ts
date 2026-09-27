var Z = Object.defineProperty;
var tt = (r, l, o) => l in r ? Z(r, l, { enumerable: !0, configurable: !0, writable: !0, value: o }) : r[l] = o;
var K = (r, l, o) => (tt(r, typeof l != "symbol" ? l + "" : l, o), o);
import { calcAllUIActionDetails as et, ToolbarController as ot, UIActionButtonState as X, getAllUIActionItems as nt, getUIActionById as st, UIActionUtil as rt, registerControlProvider as at } from "@ibiz-template/runtime";
import { defineComponent as lt, ref as it, createVNode as i, resolveComponent as d, isVNode as ut, h as P, createTextVNode as ct } from "vue";
import { recursiveIterate as pt, RuntimeError as dt, showTitle as D } from "@ibiz-template/core";
import { useControlController as bt, useNamespace as V } from "@ibiz-template/vue3-util";
import { convertBtnType as L } from "@ibiz-template/vue3-components";
function k() {
  return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
}
function ft() {
  return "".concat(k() + k(), "-").concat(k(), "-").concat(k(), "-").concat(k(), "-").concat(k()).concat(k()).concat(k());
}
const It = (r, l) => {
  if (l)
    return {
      cssClass: l,
      glyph: "".concat(ft(), "@FontAwesome"),
      appId: r
    };
}, mt = (r, l) => {
  if (l)
    return {
      cssName: l,
      appId: r
    };
};
async function yt(r, l, o) {
  const {
    appId: e,
    detailAppDataEntityId: a,
    detailAppDEDataSetId: p,
    // 文本属性
    textAppDEFieldId: f,
    // 提示值属性
    tipsAppDEFieldId: I,
    // 可见逻辑属性
    visibleScriptAppDEFieldId: C,
    // 图标样式属性
    iconClsAppDEFieldId: A,
    // 样式表属性
    clsAppDEFieldId: N,
    // 按钮样式属性
    buttonStyleAppDEFieldId: x,
    // 行为级别属性
    actionLevelAppDEFieldId: U,
    // 启用逻辑属性
    enableScriptAppDEFieldId: $,
    // 用户标记,用于绑定界面行为标记
    userTag: B,
    // 用户标记2,用于绑定界面行为动态参数数据
    userTag2: F
  } = r, j = [];
  try {
    if (p && a) {
      const z = await ibiz.hub.getApp(e).deService.exec(
        a,
        p,
        l,
        o
      );
      z.ok && Array.isArray(z.data) && z.data.forEach((T) => {
        const O = {
          uiactionId: B,
          caption: T[f],
          tooltip: T[I],
          visibleScriptCode: T[C],
          sysImage: It(e, T[A]),
          sysCss: mt(e, T[N]),
          buttonStyle: T[x],
          actionLevel: T[U],
          enableScriptCode: T[$],
          // 适配显示逻辑
          showCaption: !!T[f],
          showIcon: !!T[A],
          detailType: "DEUIACTION",
          itemType: "DEUIACTION",
          id: T[F],
          appId: e
        };
        O.uiactionId && j.push(O);
      });
    }
  } catch (z) {
    ibiz.log.error(z);
  }
  return j;
}
async function wt(r, l, o) {
  if (r.dynamicMode === 1 && !r.uiactionGroupDetails) {
    const e = await yt(
      r,
      l,
      o
    );
    Object.assign(r, {
      uiactionGroupDetails: e
    });
  } else {
    const e = [];
    if (r != null && r.uiactionGroupDetails) {
      const a = et(
        r.uiactionGroupDetails,
        l,
        o
      );
      e.push(a);
    }
    await Promise.all(e);
  }
  return r;
}
class J extends ot {
  /**
   * 初始化工具栏按钮状态对象
   */
  async initButtonState() {
    const l = [];
    pt(
      this.model,
      (e) => {
        if (this.allToolbarItems.push(e), e.itemType) {
          const p = e, f = new X(
            p.id,
            p.appId,
            p.uiactionId
          );
          this.state.buttonsState.addState(p.id, f);
        }
        if (e.controlLogics)
          for (let p = 0; p < e.controlLogics.length; p++) {
            const f = e.controlLogics[p], I = this.state.buttonsState[e.id];
            if (f.itemName === e.id && f.triggerType === "ITEMVISIBLE" && I) {
              I.visible = !1;
              break;
            }
          }
        const a = e;
        if (a.groupExtractMode && a.uiactionGroup) {
          const p = wt(
            a.uiactionGroup,
            this.context,
            this.params
          );
          l.push(p);
        }
      },
      { childrenFields: ["detoolbarItems"] }
    ), (await Promise.all(l)).forEach((e) => {
      e != null && e.uiactionGroupDetails && nt(e == null ? void 0 : e.uiactionGroupDetails).forEach(
        (a) => {
          const p = new X(
            a.id,
            a.appId,
            a.uiactionId,
            a
          );
          this.state.buttonsState.addState(a.id, p);
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
  async doUIAction(l, o, e = {}) {
    if (l.itemType === "DEUIACTION") {
      const a = l.uiactionId, p = await st(a, l.appId);
      if (!p)
        throw new dt(
          ibiz.i18n.t("runtime.controller.control.toolbar.noFound", {
            actionId: a
          })
        );
      const f = ["SYS", "BACKEND", "WFBACKEND"].includes(p.uiactionMode) && p.showBusyIndicator !== !1 || p.showBusyIndicator === !0;
      f && this.state.buttonsState.setLoading(l.id);
      try {
        const I = await this.getToolbarEventArgs();
        I.context = Object.assign(I.context, {
          srfappid: l.appId,
          srfdynatype: l.id
        }), I.params = Object.assign(e, I.params), await rt.execAndResolved(
          a,
          {
            ...I,
            event: o
          },
          l.appId
        );
      } finally {
        f && this.state.buttonsState.setLoading("");
      }
    }
  }
}
function v(r) {
  return typeof r == "function" || Object.prototype.toString.call(r) === "[object Object]" && !ut(r);
}
const E = (r, l) => {
  var C, A, N, x;
  const o = l && r.counterId ? l.counterData[r.counterId] : void 0, e = r, a = ((C = e.refUIActionGroup) == null ? void 0 : C.name) || ((A = e.refUIActionGroup) == null ? void 0 : A.id) || r.caption, p = r.sysImage, f = [], I = V("toolbar-item");
  return r.showIcon && p && ((N = p.cssClass) != null && N.startsWith("data:image/svg+xml;base64,") || (x = p.cssClass) != null && x.startsWith("data:image/png;base64,") ? f.push(i("span", {
    class: I.b("icon")
  }, [i("img", {
    src: p.cssClass
  }, null)])) : f.push(i("span", {
    class: I.b("icon")
  }, [i(d("iBizIcon"), {
    icon: p
  }, null)]))), r.showCaption && a && f.push(i("span", {
    class: I.b("text")
  }, [a])), o && f.push(i(d("iBizBadge"), {
    class: I.b("counter"),
    value: o,
    counterMode: r.counterMode
  }, null)), f;
}, g = (r) => {
  var l;
  return (l = r == null ? void 0 : r.sysCss) == null ? void 0 : l.cssName;
}, H = /* @__PURE__ */ lt({
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
  setup(r, {
    emit: l
  }) {
    var W;
    const o = bt((...t) => new J(...t)), e = V("control-".concat(o.model.controlType.toLowerCase())), a = V("control-".concat(o.model.controlType.toLowerCase(), "-actions")), p = it("default"), f = (W = o.model.toolbarStyle) == null ? void 0 : W.toLowerCase(), I = (t) => !!(t.detailType === "DEUIACTIONGROUP" && t.refUIActionGroup), C = async (t, s, c) => {
      r.runMode === "RUNTIME" ? await o.onItemClick(t, s, c) : l("click", t);
    }, A = async (t, s, c) => {
      if (r.runMode === "RUNTIME") {
        const m = {};
        Object.assign(m, {
          ...t,
          itemType: t.detailType
        }), await C(m, s, c);
      } else
        l("click", t);
    }, N = (t) => t.map((s) => {
      let c;
      return i("div", {
        key: s.id,
        class: [e.e("item")]
      }, [i(d("el-button"), {
        title: D(s.tooltip),
        size: p.value,
        onClick: (m) => C(s, m)
      }, v(c = E(s, o.state)) ? c : {
        default: () => [c]
      })]);
    }), x = (t, s) => {
      var w, n;
      let c;
      if (t.id !== s.id && I(s))
        return B(s, !0);
      const m = s.uiactionId, S = (w = o.state.buttonsState[s.id]) == null ? void 0 : w.visible, b = o.itemProviders[s.id];
      if (!S)
        return null;
      if (b) {
        const u = d(b.component);
        return P(u, {
          key: s.id,
          class: [e.e("item")],
          item: t,
          controller: o
        });
      }
      const y = (n = s.buttonStyle) == null ? void 0 : n.toLowerCase();
      return m === "exportexcel" || m === "gridview_exportaction" ? i(d("i-biz-export-excel"), {
        class: [e.e("menu-exportexcel"), e.em("item", y), g(s)],
        mode: "menu",
        item: s,
        btnContent: (u) => E(u, o.state),
        size: p.value,
        controller: o,
        onExportExcel: (u, h) => {
          A(s, u, h);
        }
      }, null) : i(d("el-menu-item"), {
        class: [e.is("loading", o.state.buttonsState[s.id].loading), e.em("item", y), g(s)],
        index: "menuitem".concat(s.id),
        disabled: o.state.buttonsState[s.id].disabled,
        title: D(s.caption)
      }, {
        default: () => [i(d("el-button"), {
          loading: o.state.buttonsState[s.id].loading,
          onClick: (u) => {
            s.uiactionId && A(s, u);
          }
        }, v(c = E(s, o.state)) ? c : {
          default: () => [c]
        })]
      });
    }, U = (t, s) => {
      if (o.state.buttonsState[t.id].visible) {
        let c;
        return i(d("el-button"), {
          size: p.value,
          class: g(t),
          type: s || L(t.buttonStyle),
          title: D(t.tooltip || t.caption),
          loading: o.state.buttonsState[t.id].loading,
          disabled: o.state.buttonsState[t.id].disabled,
          onClick: (m) => A(t, m)
        }, v(c = E(t, o.state)) ? c : {
          default: () => [c]
        });
      }
      return null;
    }, $ = (t) => {
      if (o.state.buttonsState[t.id].visible) {
        const {
          disabled: s
        } = o.state.buttonsState[t.id], c = I(t) ? B(t, !1, !0) : U(t);
        return i(d("el-dropdown-item"), {
          class: [a.be("dropdown-popper", "dropdown-item"), a.is("disabled", !!s), e.em("item", L(t.buttonStyle))]
        }, v(c) ? c : {
          default: () => [c]
        });
      }
      return null;
    }, B = (t, s, c = !1) => {
      const {
        uiactionGroup: m,
        refUIActionGroup: S
      } = t, b = (m == null ? void 0 : m.uiactionGroupDetails) || (S == null ? void 0 : S.uiactionGroupDetails);
      if (b) {
        const y = b.length > 0, w = t.buttonStyle || "";
        if (s) {
          const u = o.state.buttonsState[t.id].disabled || b.findIndex((h) => {
            var R;
            return ((R = o.state.buttonsState[h.id]) == null ? void 0 : R.disabled) === !1;
          }) === -1;
          return i(d("el-sub-menu"), {
            class: [e.b("submenu"), e.be("submenu", "groupdetails"), e.em("item", w.toLowerCase()), g(t)],
            index: t.id,
            disabled: u,
            title: D(t.tooltip),
            "popper-class": [e.b("submenu-popper"), e.em("submenu-popper", "groupdetails"), e.bm("submenu-popper", f), e.em("submenu-popper", w.toLowerCase()), e.bm("submenu-popper", g(t)), g(t)]
          }, {
            default: () => b.map((h) => x(t, h)),
            title: () => x(t, t)
          });
        }
        return c ? i(d("el-popover"), {
          "popper-class": [a.b("popper"), a.b("dropdown-popper"), a.bm("dropdown-popper", f), a.em("dropdown-popper", w.toLowerCase()), a.bm("dropdown-popper", g(t))],
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
          reference: () => i(d("el-button"), {
            text: !0,
            size: p.value,
            class: g(t),
            type: L(t.buttonStyle),
            title: D(t.tooltip || t.caption),
            disabled: o.state.buttonsState[t.id].disabled
          }, {
            default: () => [i("div", {
              class: a.be("popper", "reference-btn")
            }, [i("div", {
              class: a.bem("popper", "reference-btn", "content")
            }, [E(t, o.state)]), i("div", {
              class: a.bem("popper", "reference-btn", "chevron")
            }, [i(d("ion-icon"), {
              name: "chevron-forward-outline"
            }, null)])])]
          }),
          default: () => i("div", {
            class: a.be("popper", "wrapper")
          }, [b.map((n) => {
            const u = I(n) ? B(n, !1, !0) : U(n);
            return i("div", {
              class: a.be("popper", "item")
            }, [u]);
          })])
        }) : i(d("el-dropdown"), {
          "popper-class": [a.b("dropdown-popper"), a.bm("dropdown-popper", f), a.em("dropdown-popper", w.toLowerCase()), a.bm("dropdown-popper", g(t))]
        }, {
          default: () => U(t),
          dropdown: () => {
            let n;
            return y && i(d("el-dropdown-menu"), null, v(n = b.map((u) => $(u))) ? n : {
              default: () => [n]
            });
          }
        });
      }
      return null;
    }, F = (t, s) => {
      const c = t[s];
      return c ? I(c) || o.state.buttonsState[c.id].visible ? s : F(t, s + 1) : -1;
    }, j = (t, s) => {
      const {
        uiactionGroup: c
      } = t;
      if (c && c.uiactionGroupDetails) {
        const {
          uiactionGroupDetails: m
        } = c, S = F(m, 0);
        if (S !== -1) {
          const b = m[S], y = m.slice(S + 1).filter((u) => !!o.state.buttonsState[u.id].visible), w = y.length > 0;
          let n = t.buttonStyle || "";
          return s ? (n = b.buttonStyle || "", i(d("el-sub-menu"), {
            class: [e.b("submenu"), e.be("submenu", "groupdetails"), e.em("item", n.toLowerCase()), g(b)],
            index: b.id,
            disabled: o.state.buttonsState[b.id].disabled,
            title: D(b.tooltip),
            "popper-class": [e.b("submenu-popper"), e.be("submenu-popper", "groupdetails"), e.bm("submenu-popper", f), e.em("submenu-popper", n.toLowerCase()), e.bm("submenu-popper", g(b)), g(b)]
          }, {
            default: () => y.map((u) => x(t, u)),
            title: () => x(t, b)
          })) : i(d("el-dropdown"), {
            "split-button": w,
            type: L(n),
            "popper-class": [a.b("dropdown-popper"), a.bm("dropdown-popper", f), a.em("dropdown-popper", n.toLowerCase()), a.bm("dropdown-popper", g(t))]
          }, {
            default: () => I(b) ? B(b, !1) : U(b, L(n)),
            dropdown: () => {
              let u;
              return w && i(d("el-dropdown-menu"), null, v(u = y.map((h) => $(h))) ? u : {
                default: () => [u]
              });
            }
          });
        }
      }
      return null;
    }, z = (t, s) => {
      const {
        uiactionGroup: c
      } = t;
      if (c && c.uiactionGroupDetails) {
        const {
          uiactionGroupDetails: m
        } = c;
        return s ? m.map((S) => x(t, S)) : m.map((S) => {
          const b = I(S) ? B(S, s) : U(S);
          return i("div", {
            class: [a.e("item-deuiaction"), e.em("item", L(S.buttonStyle))]
          }, [b]);
        });
      }
      return null;
    }, T = (t, s = !1) => {
      const {
        groupExtractMode: c
      } = t;
      switch (c) {
        case "ITEMS":
          return B(t, s);
        case "ITEMX":
          return j(t, s);
        case "ITEM":
        default:
          return z(t, s);
      }
    }, O = (t) => {
      const s = t.detoolbarItems || [], c = o.state.buttonsState[t.id].visible, m = o.state.buttonsState[t.id].disabled;
      if (!c)
        return null;
      const S = s.findIndex((n) => {
        var u;
        return (u = o.state.buttonsState[n.id]) == null ? void 0 : u.loading;
      }) !== -1, b = s.findIndex((n) => {
        var u;
        return ((u = o.state.buttonsState[n.id]) == null ? void 0 : u.visible) === !0;
      }) !== -1, y = m || s.findIndex((n) => {
        var u;
        return ((u = o.state.buttonsState[n.id]) == null ? void 0 : u.disabled) === !1;
      }) === -1;
      if (t.uiactionGroup && t.uiactionGroup.uiactionGroupDetails && t.uiactionGroup.uiactionGroupDetails.length > 0)
        return T(t, !0);
      if (!b)
        return null;
      const w = t.buttonStyle || "";
      return i(d("el-sub-menu"), {
        class: [e.b("submenu"), e.em("item", w.toLowerCase()), g(t)],
        index: t.id,
        disabled: y,
        title: D(t.tooltip),
        "popper-class": [e.b("submenu-popper"), e.bm("submenu-popper", f), e.em("submenu-popper", w.toLowerCase()), e.bm("submenu-popper", g(t)), g(t)]
      }, {
        default: () => s.map((n) => {
          var Y, _;
          const u = n.uiactionId, h = (Y = o.state.buttonsState[n.id]) == null ? void 0 : Y.visible, R = o.itemProviders[n.id];
          if (!h)
            return null;
          if (R) {
            const M = d(R.component);
            return P(M, {
              key: n.id,
              class: [e.e("item")],
              item: t,
              controller: o
            });
          }
          if (n.itemType !== "SEPERATOR") {
            if (n.itemType === "RAWITEM")
              return i(d("el-menu-item"), {
                index: "menuitem".concat(n.id),
                title: D(n.tooltip)
              }, {
                default: () => [i(d("iBizRawItem"), {
                  rawItem: n,
                  content: n.rawItem.content,
                  class: e.b("submenu-rawitem"),
                  onClick: (M) => C(n, M)
                }, null)]
              });
            if (n.itemType === "DEUIACTION") {
              let M;
              const q = (_ = n.buttonStyle) == null ? void 0 : _.toLowerCase();
              return u === "exportexcel" || u === "gridview_exportaction" ? i(d("i-biz-export-excel"), {
                class: [e.e("menu-exportexcel"), e.em("item", q), g(n)],
                mode: "menu",
                item: n,
                btnContent: (G) => E(G, o.state),
                size: p.value,
                controller: o,
                onExportExcel: (G, Q) => {
                  C(n, G, Q);
                }
              }, null) : i(d("el-menu-item"), {
                class: [e.is("loading", o.state.buttonsState[n.id].loading), e.em("item", q), g(n)],
                index: "menuitem".concat(n.id),
                disabled: o.state.buttonsState[n.id].disabled,
                title: D(n.tooltip),
                onClick: (G) => C(n, G)
              }, {
                default: () => [i(d("el-button"), {
                  loading: o.state.buttonsState[n.id].loading
                }, v(M = E(n, o.state)) ? M : {
                  default: () => [M]
                })]
              });
            }
            return n.itemType === "ITEMS" ? O(n) : null;
          }
        }),
        title: () => {
          let n;
          return i(d("el-button"), {
            loading: S,
            disabled: y,
            type: L(w)
          }, v(n = E(t, o.state)) ? n : {
            default: () => [n]
          });
        }
      });
    };
    return {
      c: o,
      btnSize: p,
      ns: e,
      toolbarStyle: f,
      handleClick: C,
      renderExtraButtons: N,
      renderToolbarItem: (t) => {
        var S, b;
        const s = t.id, c = (S = o.state.buttonsState[s]) == null ? void 0 : S.visible, m = o.itemProviders[s];
        if (!c)
          return null;
        if (m) {
          const y = d(m.component);
          return P(y, {
            key: s,
            class: [e.e("item")],
            item: t,
            controller: o
          });
        }
        if (t.itemType === "SEPERATOR")
          return o.state.hideSeparator.includes(s) ? null : i("div", {
            key: s,
            class: [e.e("item"), e.e("item-separator")]
          }, [ct("|")]);
        if (t.itemType === "RAWITEM")
          return i("div", {
            key: s,
            class: [e.e("item"), e.e("item-rawitem")]
          }, [i(d("iBizRawItem"), {
            rawItem: t,
            content: t.rawItem.content,
            onClick: (y) => C(t, y)
          }, null)]);
        if (t.itemType === "DEUIACTION") {
          let y;
          const w = t.uiactionId, {
            buttonStyle: n
          } = t;
          return w === "exportexcel" || w === "gridview_exportaction" ? i(d("i-biz-export-excel"), {
            class: [e.e("item"), e.e("item-deuiaction"), e.em("item", n == null ? void 0 : n.toLowerCase()), g(t)],
            item: t,
            btnContent: (u) => E(u, o.state),
            size: p.value,
            controller: o,
            onExportExcel: (u, h) => {
              C(t, u, h);
            }
          }, null) : w === "shortcut" ? i(d("i-biz-short-cut-button"), {
            key: s,
            class: [e.e("item"), e.e("item-deuiaction"), e.em("item", n == null ? void 0 : n.toLowerCase()), g(t)],
            item: t,
            controller: o,
            size: p.value,
            onClick: (u) => C(t, u)
          }, null) : i("div", {
            key: s,
            class: [e.e("item"), e.e("item-deuiaction"), e.em("item", n == null ? void 0 : n.toLowerCase()), g(t), e.is("loading", o.state.buttonsState[s].loading)]
          }, [i(d("el-button"), {
            size: p.value,
            title: D(t.tooltip),
            type: L(n),
            loading: o.state.buttonsState[s].loading,
            disabled: o.state.buttonsState[s].disabled,
            onClick: (u) => C(t, u)
          }, v(y = E(t, o.state)) ? y : {
            default: () => [y]
          })]);
        }
        if (t.itemType === "ITEMS") {
          let y;
          const w = t, n = w.buttonStyle || "";
          if (w.groupExtractMode && w.uiactionGroup) {
            const u = "extract-mode-".concat(((b = w.groupExtractMode) == null ? void 0 : b.toLowerCase()) || "item");
            return i("div", {
              class: [a.b(), a.e(u), a.em("item", n.toLowerCase()), g(t)]
            }, [T(t)]);
          }
          return i(d("el-menu"), {
            mode: "horizontal",
            class: [e.e("menu"), e.em("menu", n.toLowerCase()), g(t)],
            ellipsis: !1,
            "menu-trigger": "hover"
          }, v(y = O(t)) ? y : {
            default: () => [y]
          });
        }
        return null;
      }
    };
  },
  render() {
    var o, e, a;
    const {
      state: r
    } = this.c;
    let l = null;
    return r.isCreated && (l = [
      // 绘制最前方的额外按钮
      ((o = r.extraButtons.before) == null ? void 0 : o.length) > 0 && this.renderExtraButtons(r.extraButtons.before),
      (e = this.modelData.detoolbarItems) == null ? void 0 : e.map((p, f) => {
        var C;
        const I = this.renderToolbarItem(p);
        return (C = r.extraButtons[f]) != null && C.length ? [I, this.renderExtraButtons(r.extraButtons[f])] : I;
      }),
      // 绘制最后方的额外按钮
      ((a = r.extraButtons.after) == null ? void 0 : a.length) > 0 && this.renderExtraButtons(r.extraButtons.after)
    ]), i(d("iBizControlBase"), {
      controller: this.c,
      class: [this.ns.m(r.viewMode.toLowerCase()), this.ns.m(this.toolbarStyle)]
    }, v(l) ? l : {
      default: () => [l]
    });
  }
});
class gt {
  constructor() {
    K(this, "component", "IBizDynaTypeToolbar");
  }
  createController(l, o, e, a) {
    return new J(l, o, e, a);
  }
}
const Et = {
  install(r) {
    r.component(H.name, H), at(
      "TOOLBAR_RENDER_DYNATYPETOOLBAR",
      () => new gt()
    );
  }
};
export {
  Et as default
};
