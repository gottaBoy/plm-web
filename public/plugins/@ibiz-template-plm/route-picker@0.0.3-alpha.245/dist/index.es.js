import './assets/style.css';
import { registerEditorProvider as Z, EditorController as $, ButtonContainerState as ee, getDeACMode as te, calcDeCodeNameById as ae, UIActionButtonState as ie, UIActionUtil as oe, openRedirectView as se } from "@ibiz-template/runtime";
import { getDataPickerProps as ne, getEditorEmits as re, useNamespace as le, getNestedRoutePath as de, renderString as ue, withInstall as ce, parseRouteViewData as he, route2routePath as K, routePath2string as B } from "@ibiz-template/vue3-util";
import { listenJSEvent as pe, NOOP as U, RuntimeModelError as me, IBizContext as F } from "@ibiz-template/core";
import { mergeDeepLeft as ve } from "ramda";
import { defineComponent as fe, ref as D, computed as z, watch as M, onMounted as ye, onBeforeUnmount as Ee, onActivated as Ce, createVNode as c, resolveComponent as f } from "vue";
import { useRoute as we, useRouter as ge } from "vue-router";
import { isUndefined as De } from "lodash-es";
var Ie = Object.defineProperty, Ae = (r, i, o) => i in r ? Ie(r, i, { enumerable: !0, configurable: !0, writable: !0, value: o }) : r[i] = o, h = (r, i, o) => (Ae(r, typeof i != "symbol" ? i + "" : i, o), o);
class xe extends $ {
  constructor() {
    super(...arguments), h(this, "keyName", "srfkey"), h(this, "textName", "srfmajortext"), h(this, "interfaceName", ""), h(this, "sort", ""), h(this, "deACMode"), h(this, "dataItems", []), h(this, "groupActionState", new ee()), h(this, "suffix", ""), h(this, "enablesearch", !1), h(this, "enableCache", !1), h(this, "immediate", !1), h(this, "routeKey", ""), h(this, "valueMode", "ROUTECHANGE"), h(this, "itemLayoutPanel");
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
    var i;
    return (i = this.parent.panel.model.appViewRefs) == null ? void 0 : i.find(
      (o) => o.name === "REDIRECT"
    );
  }
  async onInit() {
    if (super.onInit(), this.model.appDataEntityId) {
      if (this.model.appDEDataSetId && (this.interfaceName = this.model.appDEDataSetId), this.model.appDEACModeId && (this.deACMode = await te(
        this.model.appDEACModeId,
        this.model.appDataEntityId,
        this.context.srfappid
      ), this.deACMode)) {
        const { minorSortAppDEFieldId: o, minorSortDir: e } = this.deACMode;
        o && e && (this.sort = "".concat(o.toLowerCase(), ",").concat(e.toLowerCase())), this.deACMode.textAppDEFieldId && (this.textName = this.deACMode.textAppDEFieldId), this.deACMode.valueAppDEFieldId && (this.keyName = this.deACMode.valueAppDEFieldId), this.deACMode.deacmodeDataItems && (this.dataItems = [], this.deACMode.deacmodeDataItems.forEach(
          (l) => {
            l.id !== "value" && l.id !== "text" && this.dataItems.push(l);
          }
        )), this.deACMode.itemLayoutPanel && (this.itemLayoutPanel = this.deACMode.itemLayoutPanel);
      }
      this.routeKey = ae(this.model.appDataEntityId);
    }
    if (this.model.uiactionGroup) {
      const o = this.model.uiactionGroup.uiactionGroupDetails || [];
      o.length > 0 && (o.forEach((e) => {
        const l = e.uiactionId;
        if (l) {
          const m = new ie(
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
    const { editorParams: i } = this.model;
    i && (i.ROUTEKEY && (this.routeKey = i.ROUTEKEY), i.SUFFIX && (this.suffix = i.SUFFIX), i.MODE && (this.valueMode = i.MODE), i.ENABLESEARCH && (this.enablesearch = Object.is(i.ENABLESEARCH, "true") || Object.is(i.ENABLESEARCH, "TRUE")), i.ENABLECACHE && (this.enableCache = Object.is(i.ENABLECACHE, "true") || Object.is(i.ENABLECACHE, "TRUE")), i.IMMEDIATE && (this.immediate = Object.is(i.IMMEDIATE, "true") || Object.is(i.IMMEDIATE, "TRUE")));
  }
  /**
   * 加载实体数据集数据
   *
   * @param {string} query 模糊匹配字符串
   * @param {IData} data 表单数据
   * @returns {*}  {Promise<IHttpResponse<IData[]>>}
   * @memberof RoutePickerController
   */
  async getServiceData(i, o) {
    const { context: e, params: l } = this.handlePublicParams(
      o,
      this.context,
      this.params
    ), m = {};
    this.sort && !Object.is(this.sort, "") && Object.assign(m, { sort: this.sort }), i && Object.assign(m, { query: i }), Object.assign(m, { size: 1e3 });
    const v = ve(l, m);
    if (this.interfaceName)
      return await ibiz.hub.getApp(this.context.srfappid).deService.exec(
        this.model.appDataEntityId,
        this.interfaceName,
        e,
        v
      );
    throw new me(this.model, "请配置实体和实体数据集");
  }
  /**
   * 计算回填数据
   *
   * @author lxm
   * @date 2022-10-24 16:10:24
   * @param {IData} data 选中数据
   * @returns {*}  {Promise<Array<{ id: string; value: any }>>}
   */
  async calcFillDataItems(i) {
    return this.deACMode ? this.dataItems.length === 0 ? [] : await Promise.all(
      this.dataItems.map((o) => {
        const e = i[o.appDEFieldId];
        return o.format || o.convertToCodeItemText && o.codeListId || o.customCode, { id: o.id, value: e };
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
  async onActionClick(i, o) {
    const e = i.uiactionId;
    Object.assign(this.context, {
      srfdefaulttoroutedepth: this.parent.panel.view.modal.routeDepth
    }), await oe.execAndResolved(
      e,
      {
        context: this.context,
        params: this.params,
        data: [],
        view: this.parent.panel.view,
        event: o
      },
      i.appId
    );
  }
  /**
   * 获取路由主信息
   *
   * @param {RouteLocationNormalizedLoaded} route
   * @return {*}
   * @memberof RoutePickerController
   */
  async getRouteKey(i, o, e = !1) {
    let l = (await he(i, this.routeDepth)).context[this.routeKey];
    return !l && e && (l = o[0].srfkey), l;
  }
}
class Ne {
  constructor() {
    h(this, "formEditor"), h(this, "gridEditor"), this.formEditor = "RoutePicker", this.gridEditor = "RoutePicker";
  }
  async createController(i, o) {
    const e = new xe(i, o);
    return await e.init(), e;
  }
}
const R = /* @__PURE__ */ fe({
  name: "RoutePicker",
  props: ne(),
  emits: re(),
  setup(r, {
    emit: i
  }) {
    const o = le("route-picker"), e = r.controller, l = we(), m = ge(), v = D(""), y = D({}), p = D({}), d = D([]), g = D("");
    let A = "", x = !1;
    const S = () => {
      y.value = d.value.find((t) => t[e.textName] === v.value) || {};
    }, E = z(() => {
      var t, a, s;
      return (s = (a = (t = p.value) == null ? void 0 : t.popperRef) == null ? void 0 : a.popperRef) == null ? void 0 : s.contentRef;
    });
    M(() => r.value, (t) => {
      var a;
      (t || t === null) && (v.value = t, t === null && (v.value = "")), S(), (a = ibiz.util) == null || a.setBrowserTitle(v.value);
    }, {
      immediate: !0
    });
    const P = (t = 0) => {
      if (E.value) {
        const a = E.value.querySelector(".ibiz-route-picker__dropdown-list"), s = d.value.findIndex((u) => u[e.keyName] === y.value[e.keyName]);
        a && s > -1 && setTimeout(() => {
          const u = a.offsetHeight, n = Math.floor(u / 38);
          s + 1 > n ? a.scrollTop = 38 * (s + 1 - n) : a.scrollTop = 0;
        }, t);
      }
    };
    M(() => y.value, () => {
      P();
    });
    const O = () => {
      var t, a, s;
      p.value && (t = p.value) != null && t.popperRef && ((s = (a = p.value) == null ? void 0 : a.popperRef) == null || s.hide());
    }, H = () => {
      g.value || I(g.value);
    }, G = (t) => {
      var a;
      t.keyCode === 13 && (t.stopPropagation(), t.preventDefault(), I(g.value)), ((t == null ? void 0 : t.keyCode) === 38 || (t == null ? void 0 : t.keyCode) === 40) && ((a = t.target) == null || a.blur());
    }, T = (t) => {
      (t.keyCode === 13 || t.keyCode === 32) && (t.stopPropagation(), t.preventDefault());
    };
    let N = U;
    ye(() => {
      const t = de(l, e.routeDepth);
      A = t.substring(0, t.lastIndexOf("/")), N = pe(window, "keyup", (a) => {
        x && (a.keyCode === 27 && O(), a.keyCode === 40 ? b("down") : a.keyCode === 38 ? b("up") : a.keyCode === 13 && b("enter"));
      }), p.value && (p.value.triggerKeys = []), E.value && E.value.addEventListener("keydown", T, !0);
    }), Ee(() => {
      N !== U && N(), E.value && E.value.removeEventListener("keydown", T);
    });
    const b = (t) => {
      if (d.value.length === 0)
        return;
      let a = d.value.findIndex((s) => s[e.keyName] === y.value[e.keyName]);
      switch (t) {
        case "up":
          a--, (a === -1 || a === -2) && (a = d.value.length - 1), y.value = d.value[a];
          break;
        case "down":
          a++, a === d.value.length && (a = 0), y.value = d.value[a];
          break;
        case "enter":
          a >= 0 && C(d.value[a], !1);
          break;
      }
    }, q = async (t, a = !1) => {
      const s = t[e.keyName];
      if (await e.getRouteKey(l, d.value) === s)
        return;
      let u = l.fullPath;
      if (e.valueMode && e.valueMode === "ROUTECHANGE") {
        if (e.RedirectViewModel) {
          const w = await ibiz.hub.getAppView(e.RedirectViewModel.refAppViewId), j = {
            srfsessionid: e.context.srfsessionid,
            srfappid: e.context.srfappid
          };
          Object.keys(e.context).forEach((k) => {
            k !== "srfreadonly" && (j[k] = e.context[k]);
          });
          const W = F.create({
            [e.routeKey]: s
          }, j);
          return se(w, W, e.params, {});
        }
        const n = K(l);
        n.pathNodes[e.routeDepth - 2].context[e.routeKey] = s, n.pathNodes.splice(e.routeDepth), n.pathNodes[e.routeDepth - 1] && n.pathNodes[e.routeDepth - 1].srfnav && delete n.pathNodes[e.routeDepth - 1].srfnav, u = B(n);
      } else {
        const n = K(l), w = n.pathNodes[e.routeDepth - 1];
        De(w.context) && Object.assign(n.pathNodes[e.routeDepth - 1], {
          context: F.create()
        }), n.pathNodes[e.routeDepth - 1].context[e.routeKey] = s, u = B(n);
      }
      a ? m.replace({
        path: u
      }) : ibiz.openView.push(u);
    }, X = (t) => {
      e.enableCache && localStorage.setItem("routePick-".concat(e.context.srfuserid, "-").concat(A), t.id || t.srfkey);
    }, _ = () => {
      if (e.enableCache) {
        const t = localStorage.getItem("routePick-".concat(e.context.srfuserid, "-").concat(A));
        return d.value.find((a) => a.id === t || a.srfkey === t);
      }
    }, C = async (t, a, s = !1) => {
      O();
      const u = await e.calcFillDataItems(t);
      u.length && u.forEach((w) => {
        i("change", w.value, w.id);
      });
      const n = {};
      Object.assign(n, t), Object.assign(n, {
        [e.keyName]: n[e.keyName] ? n[e.keyName] : n.srfkey,
        [e.textName]: n[e.textName] ? n[e.textName] : n.srfmajortext
      }), i("change", t[e.textName]), X(t), !(a && e.valueMode && e.valueMode === "CONTEXTCHANGE" && e.immediate === !1) && q(t, s);
    }, I = async (t, a) => {
      if (e.model.appDataEntityId) {
        let s = "";
        t !== r.value && (s = t.trim());
        const u = await e.getServiceData(s, r.data);
        u && (d.value = u.data, a && a instanceof Function && a(d.value));
      }
    }, V = z(() => ue(v.value));
    M(V, (t, a) => {
      t !== a && i("infoTextChange", t);
    }, {
      immediate: !0
    });
    const L = async () => {
      const t = await e.getServiceData("", r.data);
      if (t) {
        d.value = t.data;
        const a = await e.getRouteKey(l, d.value, !0), s = d.value.find((n) => n[e.keyName] === a), u = _();
        u ? C(u, !1, !0) : s && C(s, !0);
      }
    };
    e.enableCache && L(), e.currentView.evt.on("onMounted", () => {
      e.enableCache || L();
    }), Ce(async () => {
      const t = await e.getRouteKey(l, d.value, !0), a = d.value.find((s) => s[e.keyName] === t);
      a && C(a, !1);
    });
    const Y = (t) => {
      x = t, x ? (I(""), P(300)) : (g.value = "", S());
    }, J = (t) => {
      C(t, !1);
    }, Q = () => {
      p.value && p.value.handleClose();
    };
    return {
      ns: o,
      c: e,
      dropDown: p,
      curValue: v,
      curSelect: y,
      valueText: V,
      items: d,
      query: g,
      onACSelect: C,
      onSearch: I,
      onKeyup: G,
      onInput: H,
      onVisibleChange: Y,
      onCommand: J,
      renderGroupAction: () => {
        const {
          uiactionGroup: t
        } = e.model;
        if (t)
          return c("div", {
            class: o.e("group-action")
          }, [c(f("iBizActionToolbar"), {
            class: o.be("group", "header-actions"),
            actionDetails: t.uiactionGroupDetails,
            "actions-state": e.groupActionState,
            onActionClick: (a, s) => {
              e.onActionClick(a, s), Q();
            }
          }, null)]);
      },
      renderPanelItemLayout: (t, a) => {
        const {
          context: s,
          params: u
        } = e;
        return c(f("iBizControlShell"), {
          data: t,
          modelData: a,
          context: s,
          params: u
        }, null);
      }
    };
  },
  render() {
    return c("div", {
      class: [this.ns.b(), this.ns.m("route"), this.disabled ? this.ns.m("disabled") : ""]
    }, [c("div", {
      class: [this.ns.e("dropdown")]
    }, [c(f("el-dropdown"), {
      trigger: "click",
      ref: "dropDown",
      "popper-class": this.ns.em("dropdown", "transfer"),
      onVisibleChange: this.onVisibleChange,
      onCommand: this.onCommand
    }, {
      default: () => c("div", null, [c("span", {
        class: this.ns.em("dropdown", "cur-text"),
        title: this.curValue || ""
      }, [this.curValue]), c(f("ion-icon"), {
        name: this.c.suffix
      }, null)]),
      dropdown: () => {
        var r;
        return c("div", null, [this.c.enablesearch && c(f("el-input"), {
          modelValue: this.query,
          "onUpdate:modelValue": (i) => this.query = i,
          placeholder: "搜索",
          onKeyup: this.onKeyup,
          onInput: this.onInput
        }, null), c("div", {
          class: this.ns.e("dropdown-list")
        }, [((r = this.items) == null ? void 0 : r.length) > 0 ? this.items.map((i) => c(f("el-dropdown-item"), {
          class: [this.ns.e("dropdown-item"), this.ns.is("active", i[this.c.textName] === this.curValue), this.ns.is("hover", i[this.c.keyName] === this.curSelect[this.c.keyName])],
          id: i[this.c.keyName],
          title: i[this.c.textName],
          command: i
        }, {
          default: () => [this.c.itemLayoutPanel ? this.renderPanelItemLayout(i, this.c.itemLayoutPanel) : c("span", {
            class: this.ns.em("dropdown-item", "text")
          }, [i[this.c.textName]])]
        })) : c(f("el-dropdown-item"), {
          class: this.ns.e("no-data")
        }, {
          default: () => [c(f("iBizNoData"), {
            text: "暂无数据"
          }, null)]
        })]), this.renderGroupAction()]);
      }
    })])]);
  }
}), be = ce(R, function(r) {
  r.component(R.name, R), Z("PICKER_ROUTE", () => new Ne());
}), Ve = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(r) {
    r.use(be);
  }
};
export {
  be as IBizRoutePicker,
  Ve as default
};
