import './assets/style.css';
import { EditorController as he, getDeACMode as ue, UIActionUtil as pe, OpenAppViewCommand as J, registerEditorProvider as me } from "@ibiz-template/runtime";
import { useNamespace as N, getDataPickerProps as fe, getEditorEmits as ve, renderString as ge, withInstall as be } from "@ibiz-template/vue3-util";
import { defineComponent as Z, ref as u, onMounted as Y, watch as D, createVNode as o, computed as we, nextTick as Ee, onBeforeUnmount as Pe, resolveComponent as k, createTextVNode as P } from "vue";
import { isArray as ye } from "lodash-es";
import { clone as G, mergeDeepLeft as Te } from "ramda";
import { RuntimeModelError as j } from "@ibiz-template/core";
import { notNilEmpty as U } from "qx-util";
class Se {
  /**
   * 计算多选场景下可绘制的选中项数量。
   */
  static calcSelItemRenderNum(i, t) {
    let a = -1;
    if (t && (i == null ? void 0 : i.length) > 0) {
      const e = (t == null ? void 0 : t.offsetWidth) || 0, r = window.getComputedStyle(t), d = parseInt(r.marginLeft, 10), n = parseInt(r.marginRight, 10), h = parseInt(r.paddingLeft, 10), y = parseInt(r.paddingRight, 10), b = d + n + h + y, g = 32, v = 8, w = (g + v) * i.length;
      e - b - w < 0 && (a = Math.floor((e - b) / (g + v)), a = Math.max(a - 1, 0));
    }
    return a;
  }
}
const Ae = /* @__PURE__ */ Z({
  name: "VirtualList",
  props: {
    items: {
      type: Array,
      default: () => []
    },
    itemHeight: {
      type: Number,
      default: 36
    },
    showNum: {
      type: Number,
      default: 20
    }
  },
  emits: ["scrollEvent"],
  setup(l, {
    emit: i
  }) {
    const t = N("virtual-list"), a = u(36), e = u(), r = u([]), d = u(0);
    let n = 0, h = 0, y = 0;
    const b = () => {
      h = Math.floor(n / l.itemHeight), y = h + l.showNum, r.value = l.items.slice(h, y), d.value = n - n % l.itemHeight;
    }, g = () => {
      n = e.value.scrollTop, b(), i("scrollEvent", a.value, n);
    };
    return Y(() => {
      setTimeout(() => {
        b();
      }, 1e3);
    }), D(() => l.items, () => {
      a.value = l.itemHeight * l.items.length, b();
    }, {
      immediate: !0,
      deep: !0
    }), {
      ns: t,
      contentHeight: a,
      showList: r,
      contentBox: e,
      top: d,
      onScroll: g
    };
  },
  render() {
    return o("div", {
      ref: "contentBox",
      class: this.ns.b(),
      onScroll: () => this.onScroll()
    }, [o("div", {
      class: this.ns.e("container"),
      style: "height:".concat(this.contentHeight, "px;")
    }, [o("div", {
      class: this.ns.e("content"),
      style: "top:".concat(this.top, "px;")
    }, [this.showList.map((l, i) => o("div", {
      key: i,
      class: this.ns.m("item")
    }, [this.$slots.default ? this.$slots.default({
      ...l,
      index: i
    }) : l.name]))])])]);
  }
}), R = /* @__PURE__ */ Z({
  name: "PersonelSelect",
  props: {
    ...fe(),
    controller: {
      type: Object,
      required: !0
    },
    data: {
      type: Object,
      required: !0
    },
    disabled: {
      type: Boolean
    },
    readonly: {
      type: Boolean,
      default: !1
    },
    autoFocus: {
      type: Boolean,
      default: !1
    },
    overflowMode: {
      type: String
    },
    controlParams: {
      type: Object,
      required: !0
    }
  },
  emits: ve(),
  setup(l, {
    emit: i
  }) {
    const t = N("picker-dropdown"), a = N("personel-select"), e = l.controller, r = e.valueType === "OBJECTS" && (l.overflowMode === "ellipsis" || !!e.defaultAttentionValue), d = u(""), n = u([]), h = u([]), y = u(null), b = u(""), g = u(!1);
    u(!1);
    const v = u(""), w = u([]), C = u("user"), B = u([]), Q = u(!1);
    u(!1), u(!1);
    const _ = u(!1);
    u("");
    const ee = u(), L = u();
    let A;
    const te = u(), T = u(0);
    let I;
    const F = u(295), ie = we(() => !!(l.controlParams && l.controlParams.editmode === "hover")), M = () => {
      let s = 295;
      if (L.value) {
        const c = L.value.getBoundingClientRect(), f = 16, E = e.enableBottomButton ? 464 : 415, m = E - s, p = c.top < E + f, O = window.innerHeight - c.bottom < E + f;
        if (p && O) {
          const x = window.innerHeight - c.bottom - f - m;
          s = Math.max(50, Math.min(Math.floor(x), 295));
        }
      }
      F.value = s;
    }, se = (s) => /^https?:|^data:image|(\.png$|\.svg|\.jpg|\.png|\.gif|\.psd|\.tif|\.bmp|\.jpeg)$/.test(s), z = (s) => {
      const c = [], f = [];
      B.value = [];
      const E = (m) => {
        var O, x, q;
        const p = G(m);
        return (O = e.selfFillMap) != null && O.user_id && ((x = e.selfFillMap) != null && x.user_name) && Object.assign(p, {
          id: m[e.selfFillMap.user_id],
          name: m[e.selfFillMap.user_name]
        }), (q = e.selfFillMap) != null && q.user_title && Object.assign(p, {
          title: m[e.selfFillMap.user_title]
        }), p;
      };
      if (ye(s))
        s.forEach((m) => {
          const p = E(m);
          p && (c.push(p), f.push(String(p.id)));
        });
      else if (s != null && s !== "") {
        const m = E(s);
        m && (c.push(m), f.push(String(m.id)));
      }
      h.value = c, w.value = f, b.value = c.map((m) => m.name).join(",");
    }, S = async (s = !1) => {
      s && (e.resetState(), n.value = []), g.value = !0;
      try {
        const c = await e.loadMore(l.data, C.value, v.value ? {
          query: v.value
        } : {});
        c != null && c.data && (n.value = s ? c.data : n.value.concat(c.data));
      } finally {
        g.value = !1;
      }
    }, $ = (s) => {
      s.stopPropagation(), i("change", null, e.name), i("infoTextChange", "");
    }, H = (s) => {
      if (e.multiple) {
        const f = w.value.findIndex((p) => p === String(s.id));
        f >= 0 ? (w.value.splice(f, 1), h.value.splice(f, 1)) : (w.value.push(String(s.id)), h.value.push(s));
        let E = h.value.map((p) => p[e.keyName]);
        e.valueType === "OBJECTS" && (E = h.value.map((p) => e.handleObjectParams(p)));
        let m = E;
        e.valueType !== "OBJECTS" && (m = E.join(e.separator), e.isAddSymbol && (m = E.map((p) => "'".concat(p, "'")).join(e.separator))), i("change", m, e.name), i("infoTextChange", h.value.map((p) => p.name).join(","));
        return;
      }
      let c = s[e.keyName];
      e.valueType === "OBJECTS" && (c = e.handleObjectParams(s)), i("change", c, e.name), i("infoTextChange", s.name);
    }, ae = async () => {
      e.isShowTab && !B.value.length && e.defaultSelCurUser && await e.initCurrentOperator(l.data, {}), n.value.length || await S(!0);
    }, re = () => {
      v.value = "";
    }, oe = (s) => {
      _.value = s, i(s ? "focus" : "blur");
    }, le = (s) => {
      l.disabled && s.stopPropagation();
    }, W = () => {
      I && window.clearTimeout(I), I = window.setTimeout(() => {
        T.value = Se.calcSelItemRenderNum(w.value, te.value);
      }, 500);
    };
    D(() => l.value, (s) => {
      z(s), d.value = s ? String(s) : "", W();
    }, {
      immediate: !0,
      deep: !0
    }), D(v, () => {
      A && window.clearTimeout(A), A = window.setTimeout(() => {
        S(!0);
      }, 500);
    }), D(w, () => {
      W();
    }), Y(() => {
      Ee(() => {
        z(l.value);
      }), window.addEventListener("resize", M), M();
    }), Pe(() => {
      window.removeEventListener("resize", M), A && window.clearTimeout(A), I && window.clearTimeout(I);
    });
    const V = (s) => {
      var f;
      const c = e.getUserPictureUrl(s[e.keyName], s[e.textName]);
      return c && se(c) ? o("img", {
        class: t.e("list-avatar"),
        src: c
      }, null) : o("span", null, [(f = s.name) == null ? void 0 : f.slice(0, 1)]);
    }, ne = (s, c) => o("div", {
      class: t.e("multiple-item")
    }, [o("div", {
      class: t.e("multiple-item-textimg")
    }, [V(s), e.isShowNameText() && o("span", null, [s.name])]), !l.disabled && !l.readonly && o("span", {
      class: t.e("multiple-item-close"),
      onClick: (f) => {
        f.stopPropagation(), H(s);
      }
    }, [P("×")])]), de = () => {
      if (!e.multiple)
        return o("div", {
          class: t.e("select-value")
        }, [o("div", {
          class: t.e("select-value-textimg")
        }, [h.value.length ? V(h.value[0]) : o("span", null, [P("+")])]), e.isShowNameText() && o("div", {
          class: t.e("select-value-text")
        }, [ge(b.value)]), !l.disabled && !l.readonly && h.value.length ? o("span", {
          class: t.e("select-value-close"),
          onClick: $
        }, [P("×")]) : null]);
      const s = T.value >= 0 && r ? h.value.slice(0, T.value) : h.value;
      return o("div", {
        class: [t.e("select-value-multiple"), r && T.value >= 0 ? t.e("select-value-multiple-hidden") : ""]
      }, [s.map(ne), r && T.value >= 0 && h.value.length > T.value && o("div", {
        class: a.e("multiple-ellipsis-default")
      }, [P("…")])]);
    }, K = (s = !1) => s ? o("div", null, [P("暂无数据")]) : o("div", {
      class: t.e("no-select-value")
    }, [o("span", null, [P("+")])]), ce = () => g.value ? o("div", {
      class: t.e("loadmore")
    }, [P("加载中...")]) : n.value.length ? o(Ae, {
      items: n.value,
      itemHeight: 36,
      showNum: 20,
      onScrollEvent: async (s, c) => {
        s - c - F.value < 40 && await S(!1);
      }
    }, {
      default: (s) => o("div", {
        class: [t.e("personel-list-item"), w.value.includes(String(s.id)) ? "is-selected" : ""],
        onClick: () => H(s)
      }, [o("div", {
        class: t.e("personel-list-text")
      }, [o("div", {
        class: t.e("personel-list-text-img")
      }, [V(s)]), o("span", null, [s.name]), s.title && o("span", {
        class: t.e("personel-list-title-label")
      }, [s.title])])])
    }) : K(!0), X = () => {
      const s = k("ElInput");
      return o(s, {
        modelValue: v.value,
        "onUpdate:modelValue": (c) => {
          v.value = c;
        },
        placeholder: "搜索",
        clearable: !0
      }, null);
    };
    return {
      c: e,
      ns: t,
      ns2: a,
      items: n,
      loading: g,
      refValue: d,
      curValue: y,
      valueText: b,
      isEditable: _,
      popoverRef: ee,
      modelVisible: Q,
      personelSelRef: L,
      showFormDefaultContent: ie,
      load: S,
      onClear: $,
      onPopShow: ae,
      onPageHide: re,
      calcHeight: M,
      handleClick: le,
      setEditable: oe,
      renderDropModal: () => {
        const s = k("ElPopover");
        return o("div", {
          class: t.e("select-modal"),
          style: "height:".concat(F.value, "px;")
        }, [o("div", {
          class: [t.e("select"), e.isShowTab ? "" : t.is("no-solider-tab")]
        }, [e.isShowTab && o("div", {
          class: t.e("select-state")
        }, [o("div", {
          class: [t.e("select-state-select-slider"), C.value === "user" ? "is-left" : "is-right"]
        }, null), o("div", {
          class: t.e("select-state-select-personel"),
          onClick: () => {
            C.value = "user", S(!0);
          }
        }, [P("人员")]), o("div", {
          class: t.e("select-state-select-department"),
          onClick: () => {
            C.value = "department", S(!0);
          }
        }, [P("部门")])])]), o("div", {
          class: t.e("select-modal-search-input")
        }, [X()]), o("div", {
          class: [t.e("personel-list-user"), e.isShowTab ? "" : t.is("no-solider-tab")]
        }, [ce()]), e.enableBottomButton && o("div", {
          class: t.e("select-modal-bottom")
        }, [o(s, null, {
          default: () => [P("确定")]
        })])]);
      },
      renderReadState: de,
      renderSelectInput: X,
      renderNoSelectValue: K
    };
  },
  render() {
    const l = k("ElPopover"), i = N("picker-dropdown"), t = N("personel-select"), a = o(l, {
      ref: "popoverRef",
      visible: this.modelVisible,
      "onUpdate:visible": (e) => {
        this.modelVisible = e;
      },
      trigger: "click",
      popperClass: i.b("person-select"),
      width: 320,
      teleported: !0,
      onShow: () => void this.onPopShow(),
      onHide: () => this.onPageHide(),
      onBeforeEnter: () => this.calcHeight()
    }, {
      reference: () => this.renderReadState(),
      default: () => this.renderDropModal()
    });
    return o("div", {
      ref: "personelSelRef",
      class: [i.b(), t.b(), i.b("person-value"), this.disabled ? i.m("disabled") : "", this.readonly ? i.m("readonly") : "", this.c.isShowNameText() ? "" : i.m("only-icon"), i.is("editable", this.isEditable), i.is("show-default", this.showFormDefaultContent), t.is("multiple", this.c.multiple)],
      onClick: this.handleClick
    }, [this.readonly || this.disabled ? this.renderReadState() : a]);
  }
});
class Ie extends he {
  constructor() {
    super(...arguments), this.operatorMap = /* @__PURE__ */ new Map(), this.total = 0, this.currentNumber = -1, this.page = 0, this.deptpage = 0, this.deptcurrentNumber = -1, this.depttotal = 0, this.size = 20, this.multiple = !1, this.isAddSymbol = !1, this.separator = ",", this.pickupView = null, this.linkView = null, this.userFilterMap = {
      id: "id",
      name: "name",
      title: "title",
      avatar: ""
    }, this.deptFilterMap = {
      id: "id",
      name: "name",
      title: "title",
      avatar: ""
    }, this.isShowTab = !0, this.valueItem = "", this.keyName = "srfkey", this.textName = "srfmajortext", this.interfaceName = "", this.noAC = !1, this.noButton = !1, this.dataItems = [], this.userUrl = "", this.deptUrl = "", this.copyUserUrl = "", this.copyDeptUrl = "", this.userMethod = "post", this.deptMethod = "post", this.contextReg = /\$\{context.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g, this.dataReg = /\$\{data.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g, this.paramsReg = /\$\{params.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g, this.defaultSelCurUser = !1, this.valueType = "OBJECTS", this.attentionTypeField = "type", this.selfFillMap = {
      user_id: "user_id",
      user_name: "name",
      user_title: "title"
    }, this.sysOperatorCodeListTag = "", this.defaultAttentionValue = "", this.showNameText = !0, this.showNameTip = !1, this.suffix = "", this.clearFilter = !1, this.userAuthEntity = "", this.deptAuthEntity = "", this.enableBottomButton = !1;
  }
  async onInit() {
    var t, a, e, r;
    if (await super.onInit(), this.initDefaultAttribute(), this.valueItem = ((t = this.model.valueItemName) == null ? void 0 : t.toLowerCase()) || "", this.initParams(), await this.getOperatorUserList(), this.model.appDataEntityId && (this.model.appDEDataSetId && (this.interfaceName = this.model.appDEDataSetId), this.model.appDEACModeId && (this.deACMode = await ue(
      this.model.appDEACModeId,
      this.model.appDataEntityId,
      this.context.srfappid
    )), this.deACMode)) {
      const { minorSortAppDEFieldId: d, minorSortDir: n } = this.deACMode;
      d && n && (this.sort = "".concat(d.toLowerCase(), ",").concat(n.toLowerCase())), this.deACMode.textAppDEFieldId && (this.textName = this.deACMode.textAppDEFieldId), this.deACMode.valueAppDEFieldId && (this.keyName = this.deACMode.valueAppDEFieldId), this.deACMode.deacmodeDataItems && (this.dataItems = [], this.deACMode.deacmodeDataItems.forEach((h) => {
        h.id !== "value" && h.id !== "text" && this.dataItems.push(h);
      }));
    }
    const i = [
      "PICKEREX_DROPDOWNVIEW",
      "PICKEREX_DROPDOWNVIEW_LINK",
      "PICKUPVIEW"
    ];
    this.model.editorType && i.includes(this.model.editorType) && this.initPickupViewParams(), this.objectIdField = (a = this.model.objectIdField) == null ? void 0 : a.toLowerCase(), this.objectNameField = (e = this.model.objectNameField) == null ? void 0 : e.toLowerCase(), this.objectValueField = (r = this.model.objectValueField) == null ? void 0 : r.toLowerCase();
  }
  initDefaultAttribute() {
    this.model.valueType && (this.valueType = this.model.valueType);
  }
  initParams() {
    switch (this.model.editorType) {
      case "PICKEREX_NOAC":
      case "PICKEREX_NOAC_LINK":
        this.noAC = !0;
        break;
      case "PICKEREX_NOBUTTON":
        this.noButton = !0;
        break;
      default:
        this.noButton = !1, this.noAC = !1;
        break;
    }
    this.userUrl = this.editorParams.URL, this.deptUrl = this.editorParams.DEPTURL, this.userMethod = this.editorParams.USERMETHOD || "post", this.deptMethod = this.editorParams.DEPTMETHOD || "post", this.sysOperatorCodeListTag = this.editorParams.sysoperatorcodelisttag || "SysOperator", this.multiple = this.editorParams.MULTIPLE === "true", this.defaultSelCurUser = this.editorParams.DEFAULTSELCURUSER === "true", this.separator = this.editorParams.SEPARATOR || ",", this.isAddSymbol = this.editorParams.ISADDSYMBOL === "true" && this.multiple === !0, this.isShowTab = this.editorParams.ISSHOWTAB !== "false", this.suffix = this.editorParams.SUFFIX, this.clearFilter = this.editorParams.CLEARFILTER === "true", this.editorParams.VALUETYPE && (this.valueType = this.editorParams.VALUETYPE), this.editorParams.DEFAULTATNVALUE && (this.defaultAttentionValue = this.editorParams.DEFAULTATNVALUE), this.editorParams.VALUEITEMNAME && (this.valueItem = this.editorParams.VALUEITEMNAME), this.editorParams.userauthentity && (this.userAuthEntity = this.editorParams.userauthentity), this.editorParams.deptauthentity && (this.deptAuthEntity = this.editorParams.deptauthentity), this.editorParams.ENABLEBOTTOMBUTTON && (this.enableBottomButton = this.editorParams.ENABLEBOTTOMBUTTON === "true"), this.parseObjectParam("SELFFILLMAP", (i) => {
      Object.assign(this.selfFillMap, i);
    }), this.parseObjectParam("USERMAP", (i) => {
      Object.assign(this.userFilterMap, i);
    }, () => {
      this.userFilterMap = {
        id: "id",
        name: "name",
        title: "title",
        avatar: ""
      };
    }), this.parseObjectParam("DEPTMAP", (i) => {
      Object.assign(this.deptFilterMap, i);
    }, () => {
      this.deptFilterMap = {
        id: "id",
        name: "name",
        title: "title",
        avatar: ""
      };
    }), this.editorParams.SHOWNAMETEXT && (this.showNameText = this.toBoolean(this.editorParams.SHOWNAMETEXT)), this.editorParams.SHOWNAMETIP && (this.showNameTip = this.toBoolean(this.editorParams.SHOWNAMETIP));
  }
  parseObjectParam(i, t, a) {
    if (this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, i))
      try {
        t(JSON.parse(this.editorParams[i]));
      } catch (e) {
        if (ibiz.log.error(e), !a)
          return;
        a();
      }
  }
  async initPickupViewParams() {
    this.model.pickupAppViewId && (this.pickupView = await ibiz.hub.config.view.get(
      this.model.pickupAppViewId
    ));
  }
  async initLinkViewParams() {
    this.model.linkAppViewId && (this.linkView = await ibiz.hub.config.view.get(
      this.model.linkAppViewId
    ));
  }
  async initCurrentOperator(i, t) {
    const a = this.context.srfuserid;
    if (!a)
      return;
    const e = await this.getServiceData(
      "department",
      i,
      {},
      {
        ...t,
        page: 0,
        size: 20,
        n_id_eq: a
      }
    );
    e && e.data && e.data.length > 0 && (this.currentOperator = e.data.find(
      (r) => r[this.deptFilterMap.id] === a
    ));
  }
  resetState() {
    this.resetUserState(), this.resetDeptState();
  }
  resetUserState() {
    this.total = 0, this.currentNumber = -1, this.page = 0, this.copyUserUrl = "";
  }
  resetDeptState() {
    this.deptpage = 0, this.depttotal = 0, this.deptcurrentNumber = -1, this.copyDeptUrl = "";
  }
  async loadMore(i, t, a = {}) {
    if (t === "user" && this.currentNumber < this.total) {
      const e = await this.getServiceData(t, i, a);
      return e ? (this.page += 1, this.currentNumber < 0 && (this.currentNumber += 1), this.currentNumber += this.size, this.total = (e.total ? Number(e.total) : Number(e.headers["x-total"])) || 0, this.applyFilterMap(e.data, this.userFilterMap), e) : void 0;
    }
    if (t === "department" && this.deptcurrentNumber < this.depttotal) {
      const e = await this.getServiceData(t, i, a);
      return e ? (this.deptpage += 1, this.deptcurrentNumber < 0 && (this.deptcurrentNumber += 1), this.deptcurrentNumber += this.size, this.depttotal = (e.total ? Number(e.total) : Number(e.headers["x-total"])) || 0, this.applyFilterMap(e.data, this.deptFilterMap), e) : void 0;
    }
  }
  applyFilterMap(i, t) {
    i.forEach((a) => {
      Object.keys(t).forEach((e) => {
        a[e] = a[t[e]];
      });
    });
  }
  async onActionClick(i, t, a) {
    const e = i.uiactionId, r = this.parent;
    let d = {};
    r.form ? d = r.form.ctx.view : r.grid && (d = r.grid.ctx.view), await pe.execAndResolved(
      e,
      {
        context: this.context,
        params: this.params,
        data: t,
        view: d,
        event: a
      },
      i.appId
    );
  }
  fill(i = "", t, a, e) {
    if (U(i)) {
      if (U(t)) {
        const r = i.match(this.contextReg);
        r == null || r.forEach((d) => {
          const n = d.slice(10, d.length - 1);
          i = i.replace("${context.".concat(n, "}"), t[n] || "");
        });
      }
      if (U(a)) {
        const r = i.match(this.paramsReg);
        r == null || r.forEach((d) => {
          const n = d.slice(9, d.length - 1);
          i = i.replace("${params.".concat(n, "}"), a[n] || "");
        });
      }
      if (U(e)) {
        const r = i.match(this.dataReg);
        r == null || r.forEach((d) => {
          const n = d.slice(7, d.length - 1);
          i = i.replace("${data.".concat(n, "}"), e[n] || "");
        });
      }
    }
    return i;
  }
  async getServiceData(i, t, a, e) {
    const { context: r, params: d } = this.handlePublicParams(
      t,
      this.context,
      this.params
    ), n = {};
    this.sort && !Object.is(this.sort, "") && Object.assign(n, { sort: this.sort }), Object.assign(n, { size: this.size }), a && Object.assign(n, a);
    const h = e || Te(d, n), y = this.fill(this.userUrl, r, d, t).replaceAll(
      "//",
      "/"
    ), b = this.fill(this.deptUrl, r, d, t).replaceAll(
      "//",
      "/"
    );
    this.copyUserUrl = y, this.copyDeptUrl = b;
    let g = "", v = "post";
    const w = {};
    if (i === "user" ? (g = y, v = this.userMethod.toLowerCase()) : (g = b, v = this.deptMethod.toLowerCase()), v === "get" ? Object.assign(w, { method: v, params: h }) : Object.assign(w, { method: v, data: h }), g)
      return await ibiz.net.request(g, w);
    throw new j(this.model, "请配置数据接口地址");
  }
  async openPickUpView(i, t) {
    await this.initPickupViewParams();
    const { context: a, params: e } = this.handlePublicParams(
      i,
      this.context,
      this.params
    );
    if (t && (e.selectedData = t), !this.pickupView)
      throw new j(this.model, "请配置数据选择视图");
    const r = await ibiz.commands.execute(
      J.TAG,
      this.pickupView.id,
      a,
      e,
      { openMode: "POPUPMODAL" }
    );
    if (r && r.ok && r.data)
      return r.data;
    ibiz.log.debug("模态取消或关闭异常", r);
  }
  async openLinkView(i) {
    const t = this.context.clone();
    i[this.valueItem] && (t.srfkey = i[this.valueItem]);
    const { context: a, params: e } = this.handlePublicParams(
      i,
      t,
      this.params
    ), { linkAppViewId: r } = this.model;
    if (!r)
      throw new j(this.model, "请配置数据链接视图");
    return ibiz.commands.execute(
      J.TAG,
      r,
      a,
      e
    );
  }
  async calcFillDataItems(i) {
    return this.deACMode ? this.dataItems.length === 0 ? [] : await Promise.all(
      this.dataItems.map((t) => {
        const a = i.map((e) => e[t.appDEFieldId]).join(this.separator);
        return {
          id: t.id,
          value: a
        };
      })
    ) : [];
  }
  handleObjectParams(i) {
    const t = {};
    return this.objectIdField && Object.assign(t, {
      [this.objectIdField]: i[this.keyName]
    }), this.objectNameField && Object.assign(t, {
      [this.objectNameField]: i[this.textName]
    }), this.objectValueField && Object.assign(t, {
      [this.objectValueField]: G(i)
    }), t;
  }
  async getOperatorUserList() {
    const t = await (await ibiz.hub.getApp(this.context.srfappid)).codeList.get(
      this.sysOperatorCodeListTag,
      this.context,
      this.params
    );
    this.operatorMap = new Map(
      t.map((a) => [a.value, a])
    );
  }
  isShowNameText() {
    return this.showNameText;
  }
  isShowNameTip() {
    return this.showNameTip;
  }
  getUserPictureUrl(i, t) {
    if (this.operatorMap.size <= 0)
      return "";
    let a = {};
    return this.operatorMap.get(i) ? a = this.operatorMap.get(i) : Array.from(this.operatorMap.entries()).find((e) => {
      const r = e[1] || {};
      return r.text && t && r.text === t ? (a = r, !0) : !1;
    }), a.data && a.data.iconurl ? a.data.iconurl : "";
  }
}
class Ne {
  constructor() {
    this.component = "PersonelSelect", this.formEditor = "PersonelSelect", this.gridEditor = "PersonelSelect";
  }
  async createController(i, t) {
    const a = new Ie(
      i,
      t
    );
    return await a.init(), a;
  }
}
const Ce = be(R, (l) => {
  l.component(R.name, R), me(
    "EDITOR_CUSTOMSTYLE_PERSON_SELECT",
    () => new Ne()
  );
}), ke = {
  install(l) {
    l.use(Ce);
  }
};
export {
  Ce as IBizPersonelSelect,
  ke as default
};
