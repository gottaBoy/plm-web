import './assets/style.css';
import { registerEditorProvider as ae, EditorController as oe, ButtonContainerState as ie, getDeACMode as se, calcDeCodeNameById as ne, UIActionButtonState as re, UIActionUtil as le, openRedirectView as de } from "@ibiz-template/runtime";
import { getDataPickerProps as ue, getEditorEmits as ce, useNamespace as he, getNestedRoutePath as pe, renderString as me, withInstall as fe, parseRouteViewData as ve, route2routePath as T, routePath2string as B } from "@ibiz-template/vue3-util";
import { listenJSEvent as ye, NOOP as U, RuntimeModelError as Ee, IBizContext as z } from "@ibiz-template/core";
import { mergeDeepLeft as Ce } from "ramda";
import { inject as X, defineComponent as we, ref as b, computed as H, watch as M, onMounted as Ie, onBeforeUnmount as be, onActivated as De, createVNode as c, resolveComponent as y } from "vue";
import { isUndefined as Ae } from "lodash-es";
/*!
  * vue-router v4.2.5
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */
var G;
(function(i) {
  i.pop = "pop", i.push = "push";
})(G || (G = {}));
var F;
(function(i) {
  i.back = "back", i.forward = "forward", i.unknown = "";
})(F || (F = {}));
var q;
(function(i) {
  i[i.aborted = 4] = "aborted", i[i.cancelled = 8] = "cancelled", i[i.duplicated = 16] = "duplicated";
})(q || (q = {}));
const ge = Symbol(""), xe = Symbol("");
function ke() {
  return X(ge);
}
function Ne() {
  return X(xe);
}
var Me = Object.defineProperty, Re = (i, a, s) => a in i ? Me(i, a, { enumerable: !0, configurable: !0, writable: !0, value: s }) : i[a] = s, h = (i, a, s) => (Re(i, typeof a != "symbol" ? a + "" : a, s), s);
class Se extends oe {
  constructor() {
    super(...arguments), h(this, "keyName", "srfkey"), h(this, "textName", "srfmajortext"), h(this, "interfaceName", ""), h(this, "sort", ""), h(this, "deACMode"), h(this, "dataItems", []), h(this, "groupActionState", new ie()), h(this, "suffix", ""), h(this, "enablesearch", !1), h(this, "enableCache", !1), h(this, "immediate", !1), h(this, "routeKey", ""), h(this, "valueMode", "ROUTECHANGE"), h(this, "itemLayoutPanel");
  }
  /**
   * 当前视图
   *
   * @readonly
   * @type {(number)}
   * @memberof RoutePickerController
   */
  get currentView() {
    return this.parent.panel.view;
  }
  /**
   * 当前路由视图的层级
   *
   * @readonly
   * @type {(number)}
   * @memberof RoutePickerController
   */
  get routeDepth() {
    return this.parent.panel.view.modal.routeDepth;
  }
  /**
   * 当前视图重定向引用
   * @readonly
   * @type {(IData | undefined)}
   * @memberof RoutePickerController
   */
  get RedirectViewModel() {
    var a;
    return (a = this.parent.panel.model.appViewRefs) == null ? void 0 : a.find(
      (s) => s.name === "REDIRECT"
    );
  }
  async onInit() {
    if (super.onInit(), this.model.appDataEntityId) {
      if (this.model.appDEDataSetId && (this.interfaceName = this.model.appDEDataSetId), this.model.appDEACModeId && (this.deACMode = await se(
        this.model.appDEACModeId,
        this.model.appDataEntityId,
        this.context.srfappid
      ), this.deACMode)) {
        const { minorSortAppDEFieldId: s, minorSortDir: e } = this.deACMode;
        s && e && (this.sort = "".concat(s.toLowerCase(), ",").concat(e.toLowerCase())), this.deACMode.textAppDEFieldId && (this.textName = this.deACMode.textAppDEFieldId), this.deACMode.valueAppDEFieldId && (this.keyName = this.deACMode.valueAppDEFieldId), this.deACMode.deacmodeDataItems && (this.dataItems = [], this.deACMode.deacmodeDataItems.forEach(
          (l) => {
            l.id !== "value" && l.id !== "text" && this.dataItems.push(l);
          }
        )), this.deACMode.itemLayoutPanel && (this.itemLayoutPanel = this.deACMode.itemLayoutPanel);
      }
      this.routeKey = ne(this.model.appDataEntityId);
    }
    if (this.model.uiactionGroup) {
      const s = this.model.uiactionGroup.uiactionGroupDetails || [];
      s.length > 0 && (s.forEach((e) => {
        const l = e.uiactionId;
        if (l) {
          const m = new re(
            e.id,
            this.context.srfappid,
            l
          );
          this.groupActionState.addState(e.id, m);
        }
      }), await this.groupActionState.update(
        this.context,
        void 0,
        this.model.appDataEntityId
      ));
    }
    const { editorParams: a } = this.model;
    a && (a.ROUTEKEY && (this.routeKey = a.ROUTEKEY), a.SUFFIX && (this.suffix = a.SUFFIX), a.MODE && (this.valueMode = a.MODE), a.ENABLESEARCH && (this.enablesearch = Object.is(a.ENABLESEARCH, "true") || Object.is(a.ENABLESEARCH, "TRUE")), a.ENABLECACHE && (this.enableCache = Object.is(a.ENABLECACHE, "true") || Object.is(a.ENABLECACHE, "TRUE")), a.IMMEDIATE && (this.immediate = Object.is(a.IMMEDIATE, "true") || Object.is(a.IMMEDIATE, "TRUE")));
  }
  /**
   * 加载实体数据集数据
   *
   * @param {string} query 模糊匹配字符串
   * @param {IData} data 表单数据
   * @returns {*}  {Promise<IHttpResponse<IData[]>>}
   * @memberof RoutePickerController
   */
  async getServiceData(a, s) {
    const { context: e, params: l } = this.handlePublicParams(
      s,
      this.context,
      this.params
    ), m = {};
    this.sort && !Object.is(this.sort, "") && Object.assign(m, { sort: this.sort }), a && Object.assign(m, { query: a }), Object.assign(m, { size: 1e3 });
    const f = Ce(l, m);
    if (this.interfaceName)
      return await ibiz.hub.getApp(this.context.srfappid).deService.exec(
        this.model.appDataEntityId,
        this.interfaceName,
        e,
        f
      );
    throw new Ee(this.model, "请配置实体和实体数据集");
  }
  /**
   * 计算回填数据
   *
   * @author lxm
   * @date 2022-10-24 16:10:24
   * @param {IData} data 选中数据
   * @returns {*}  {Promise<Array<{ id: string; value: any }>>}
   */
  async calcFillDataItems(a) {
    return this.deACMode ? this.dataItems.length === 0 ? [] : await Promise.all(
      this.dataItems.map((s) => {
        const e = a[s.appDEFieldId];
        return s.format || s.convertToCodeItemText && s.codeListId || s.customCode, { id: s.id, value: e };
      })
    ) : [];
  }
  /**
   * 分组行为项点击
   *
   * @param {IUIActionGroupDetail} detail
   * @param {MouseEvent} event
   * @return {*}  {Promise<void>}
   * @memberof RoutePickerController
   */
  async onActionClick(a, s) {
    const e = a.uiactionId;
    Object.assign(this.context, {
      srfdefaulttoroutedepth: this.parent.panel.view.modal.routeDepth
    }), await le.execAndResolved(
      e,
      {
        context: this.context,
        params: this.params,
        data: [],
        view: this.parent.panel.view,
        event: s
      },
      a.appId
    );
  }
  /**
   * 获取路由主信息
   *
   * @param {RouteLocationNormalizedLoaded} route
   * @return {*}
   * @memberof RoutePickerController
   */
  async getRouteKey(a, s, e = !1) {
    let l = (await ve(a, this.routeDepth)).context[this.routeKey];
    return !l && e && (l = s[0].srfkey), l;
  }
}
class Pe {
  constructor() {
    h(this, "formEditor"), h(this, "gridEditor"), this.formEditor = "RoutePicker", this.gridEditor = "RoutePicker";
  }
  async createController(a, s) {
    const e = new Se(a, s);
    return await e.init(), e;
  }
}
const R = /* @__PURE__ */ we({
  name: "RoutePicker",
  props: ue(),
  emits: ce(),
  setup(i, {
    emit: a
  }) {
    const s = he("route-picker"), e = i.controller, l = Ne(), m = ke(), f = b(""), v = b({}), p = b({}), u = b([]), I = b("");
    let A = "", g = !1;
    const S = () => {
      v.value = u.value.find((t) => t[e.textName] === f.value) || {};
    }, E = H(() => {
      var t, o, n;
      return (n = (o = (t = p.value) == null ? void 0 : t.popperRef) == null ? void 0 : o.popperRef) == null ? void 0 : n.contentRef;
    });
    M(() => i.value, (t) => {
      var o;
      (t || t === null) && (f.value = t, t === null && (f.value = "")), S(), (o = ibiz.util) == null || o.setBrowserTitle(f.value);
    }, {
      immediate: !0
    });
    const P = (t = 0) => {
      if (E.value) {
        const o = E.value.querySelector(".ibiz-route-picker__dropdown-list"), n = u.value.findIndex((d) => d[e.keyName] === v.value[e.keyName]);
        o && n > -1 && setTimeout(() => {
          const d = o.offsetHeight, r = Math.floor(d / 38);
          n + 1 > r ? o.scrollTop = 38 * (n + 1 - r) : o.scrollTop = 0;
        }, t);
      }
    };
    M(() => v.value, () => {
      P();
    });
    const O = () => {
      var t, o, n;
      p.value && (t = p.value) != null && t.popperRef && ((n = (o = p.value) == null ? void 0 : o.popperRef) == null || n.hide());
    }, _ = () => {
      I.value || D(I.value);
    }, Y = (t) => {
      var o;
      t.keyCode === 13 && (t.stopPropagation(), t.preventDefault(), D(I.value)), ((t == null ? void 0 : t.keyCode) === 38 || (t == null ? void 0 : t.keyCode) === 40) && ((o = t.target) == null || o.blur());
    }, L = (t) => {
      (t.keyCode === 13 || t.keyCode === 32) && (t.stopPropagation(), t.preventDefault());
    };
    let x = U;
    Ie(() => {
      const t = pe(l, e.routeDepth);
      A = t.substring(0, t.lastIndexOf("/")), x = ye(window, "keyup", (o) => {
        g && (o.keyCode === 27 && O(), o.keyCode === 40 ? k("down") : o.keyCode === 38 ? k("up") : o.keyCode === 13 && k("enter"));
      }), p.value && (p.value.triggerKeys = []), E.value && E.value.addEventListener("keydown", L, !0);
    }), be(() => {
      x !== U && x(), E.value && E.value.removeEventListener("keydown", L);
    });
    const k = (t) => {
      let o = u.value.findIndex((n) => n[e.keyName] === v.value[e.keyName]);
      switch (t) {
        case "up":
          o--, (o === -1 || o === -2) && (o = u.value.length - 1), v.value = u.value[o];
          break;
        case "down":
          o++, o === u.value.length && (o = 0), v.value = u.value[o];
          break;
        case "enter":
          C(v.value, !1);
          break;
      }
    }, J = async (t, o = !1) => {
      const n = t[e.keyName];
      if (await e.getRouteKey(l, u.value) === n)
        return;
      let d = l.fullPath;
      if (e.valueMode && e.valueMode === "ROUTECHANGE") {
        if (e.RedirectViewModel) {
          const w = await ibiz.hub.getAppView(e.RedirectViewModel.refAppViewId), j = {
            srfsessionid: e.context.srfsessionid,
            srfappid: e.context.srfappid
          };
          Object.keys(e.context).forEach((N) => {
            N !== "srfreadonly" && (j[N] = e.context[N]);
          });
          const te = z.create({
            [e.routeKey]: n
          }, j);
          return de(w, te, e.params, {});
        }
        const r = T(l);
        r.pathNodes[e.routeDepth - 2].context[e.routeKey] = n, r.pathNodes.splice(e.routeDepth), r.pathNodes[e.routeDepth - 1] && r.pathNodes[e.routeDepth - 1].srfnav && delete r.pathNodes[e.routeDepth - 1].srfnav, d = B(r);
      } else {
        const r = T(l), w = r.pathNodes[e.routeDepth - 1];
        Ae(w.context) && Object.assign(r.pathNodes[e.routeDepth - 1], {
          context: z.create()
        }), r.pathNodes[e.routeDepth - 1].context[e.routeKey] = n, d = B(r);
      }
      o ? m.replace({
        path: d
      }) : ibiz.openView.push(d);
    }, Q = (t) => {
      e.enableCache && localStorage.setItem("routePick-".concat(e.context.srfuserid, "-").concat(A), t.id || t.srfkey);
    }, W = () => {
      if (e.enableCache) {
        const t = localStorage.getItem("routePick-".concat(e.context.srfuserid, "-").concat(A));
        return u.value.find((o) => o.id === t || o.srfkey === t);
      }
    }, C = async (t, o, n = !1) => {
      O();
      const d = await e.calcFillDataItems(t);
      d.length && d.forEach((w) => {
        a("change", w.value, w.id);
      });
      const r = {};
      Object.assign(r, t), Object.assign(r, {
        [e.keyName]: r[e.keyName] ? r[e.keyName] : r.srfkey,
        [e.textName]: r[e.textName] ? r[e.textName] : r.srfmajortext
      }), a("change", t[e.textName]), Q(t), !(o && e.valueMode && e.valueMode === "CONTEXTCHANGE" && e.immediate === !1) && J(t, n);
    }, D = async (t, o) => {
      if (e.model.appDataEntityId) {
        let n = "";
        t !== i.value && (n = t.trim());
        const d = await e.getServiceData(n, i.data);
        d && (u.value = d.data, o && o instanceof Function && o(u.value));
      }
    }, V = H(() => me(f.value));
    M(V, (t, o) => {
      t !== o && a("infoTextChange", t);
    }, {
      immediate: !0
    });
    const K = async () => {
      const t = await e.getServiceData("", i.data);
      if (t) {
        u.value = t.data;
        const o = await e.getRouteKey(l, u.value, !0), n = u.value.find((r) => r[e.keyName] === o), d = W();
        d ? C(d, !1, !0) : n && C(n, !0);
      }
    };
    e.enableCache && K(), e.currentView.evt.on("onMounted", () => {
      e.enableCache || K();
    }), De(async () => {
      const t = await e.getRouteKey(l, u.value, !0), o = u.value.find((n) => n[e.keyName] === t);
      o && C(o, !1);
    });
    const Z = (t) => {
      g = t, g ? (D(""), P(300)) : (I.value = "", S());
    }, $ = (t) => {
      C(t, !1);
    }, ee = () => {
      p.value && p.value.handleClose();
    };
    return {
      ns: s,
      c: e,
      dropDown: p,
      curValue: f,
      curSelect: v,
      valueText: V,
      items: u,
      query: I,
      onACSelect: C,
      onSearch: D,
      onKeyup: Y,
      onInput: _,
      onVisibleChange: Z,
      onCommand: $,
      renderGroupAction: () => {
        const {
          uiactionGroup: t
        } = e.model;
        if (t)
          return c("div", {
            class: s.e("group-action")
          }, [c(y("iBizActionToolbar"), {
            class: s.be("group", "header-actions"),
            actionDetails: t.uiactionGroupDetails,
            "actions-state": e.groupActionState,
            onActionClick: (o, n) => {
              e.onActionClick(o, n), ee();
            }
          }, null)]);
      },
      renderPanelItemLayout: (t, o) => {
        const {
          context: n,
          params: d
        } = e;
        return c(y("iBizControlShell"), {
          data: t,
          modelData: o,
          context: n,
          params: d
        }, null);
      }
    };
  },
  render() {
    return c("div", {
      class: [this.ns.b(), this.ns.m("route"), this.disabled ? this.ns.m("disabled") : ""]
    }, [c("div", {
      class: [this.ns.e("dropdown")]
    }, [c(y("el-dropdown"), {
      trigger: "click",
      ref: "dropDown",
      "popper-class": this.ns.em("dropdown", "transfer"),
      onVisibleChange: this.onVisibleChange,
      onCommand: this.onCommand
    }, {
      default: () => c("div", null, [c("span", {
        class: this.ns.em("dropdown", "cur-text"),
        title: this.curValue || ""
      }, [this.curValue]), c(y("ion-icon"), {
        name: this.c.suffix
      }, null)]),
      dropdown: () => {
        var i;
        return c("div", null, [this.c.enablesearch && c(y("el-input"), {
          modelValue: this.query,
          "onUpdate:modelValue": (a) => this.query = a,
          placeholder: "搜索",
          onKeyup: this.onKeyup,
          onInput: this.onInput
        }, null), c("div", {
          class: this.ns.e("dropdown-list")
        }, [((i = this.items) == null ? void 0 : i.length) > 0 ? this.items.map((a) => c(y("el-dropdown-item"), {
          class: [this.ns.e("dropdown-item"), this.ns.is("active", a[this.c.textName] === this.curValue), this.ns.is("hover", a[this.c.keyName] === this.curSelect[this.c.keyName])],
          id: a[this.c.keyName],
          title: a[this.c.textName],
          command: a
        }, {
          default: () => [this.c.itemLayoutPanel ? this.renderPanelItemLayout(a, this.c.itemLayoutPanel) : c("span", {
            class: this.ns.em("dropdown-item", "text")
          }, [a[this.c.textName]])]
        })) : c(y("el-dropdown-item"), {
          class: this.ns.e("no-data")
        }, {
          default: () => [c(y("iBizNoData"), {
            text: "暂无数据"
          }, null)]
        })]), this.renderGroupAction()]);
      }
    })])]);
  }
}), Oe = fe(R, function(i) {
  i.component(R.name, R), ae("PICKER_ROUTE", () => new Pe());
}), Ue = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(i) {
    i.use(Oe);
  }
};
export {
  Oe as IBizRoutePicker,
  Ue as default
};
