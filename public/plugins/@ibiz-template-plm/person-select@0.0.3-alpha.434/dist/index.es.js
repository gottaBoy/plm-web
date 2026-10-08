import './assets/style.css';
import { EditorController as Ce, getDeACMode as Me, UIActionUtil as Le, OpenAppViewCommand as pe, registerEditorProvider as Oe } from "@ibiz-template/runtime";
import { useNamespace as O, getDataPickerProps as xe, getEditorEmits as Ve, renderString as Fe, withInstall as Ue } from "@ibiz-template/vue3-util";
import { defineComponent as me, ref as p, onMounted as fe, watch as D, createVNode as l, computed as De, nextTick as je, onBeforeUnmount as ke, resolveComponent as $, createTextVNode as I } from "vue";
import { isArray as Re } from "lodash-es";
import { clone as ve, mergeDeepLeft as Be } from "ramda";
import { RuntimeModelError as H } from "@ibiz-template/core";
import { notNilEmpty as U } from "qx-util";
class ze {
  /**
   * 计算多选场景下可绘制的选中项数量。
   */
  static calcSelItemRenderNum(t, i) {
    let a = -1;
    if (i && (t == null ? void 0 : t.length) > 0) {
      const e = (i == null ? void 0 : i.offsetWidth) || 0, o = window.getComputedStyle(i), h = parseInt(o.marginLeft, 10), n = parseInt(o.marginRight, 10), c = parseInt(o.paddingLeft, 10), m = parseInt(o.paddingRight, 10), v = h + n + c + m, b = 32, w = 8, E = (b + w) * t.length;
      e - v - E < 0 && (a = Math.floor((e - v) / (b + w)), a = Math.max(a - 1, 0));
    }
    return a;
  }
}
const _e = /* @__PURE__ */ me({
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
  setup(r, {
    emit: t
  }) {
    const i = O("virtual-list"), a = p(36), e = p(), o = p([]), h = p(0);
    let n = 0, c = 0, m = 0;
    const v = () => {
      c = Math.floor(n / r.itemHeight), m = c + r.showNum, o.value = r.items.slice(c, m), h.value = n - n % r.itemHeight;
    }, b = () => {
      n = e.value.scrollTop, v(), t("scrollEvent", a.value, n);
    };
    return fe(() => {
      setTimeout(() => {
        v();
      }, 1e3);
    }), D(() => r.items, () => {
      a.value = r.itemHeight * r.items.length, v();
    }, {
      immediate: !0,
      deep: !0
    }), {
      ns: i,
      contentHeight: a,
      showList: o,
      contentBox: e,
      top: h,
      onScroll: b
    };
  },
  render() {
    return l("div", {
      ref: "contentBox",
      class: this.ns.b(),
      onScroll: () => this.onScroll()
    }, [l("div", {
      class: this.ns.e("container"),
      style: "height:".concat(this.contentHeight, "px;")
    }, [l("div", {
      class: this.ns.e("content"),
      style: "top:".concat(this.top, "px;")
    }, [this.showList.map((r, t) => l("div", {
      key: t,
      class: this.ns.m("item")
    }, [this.$slots.default ? this.$slots.default({
      ...r,
      index: t
    }) : r.name]))])])]);
  }
}), W = /* @__PURE__ */ me({
  name: "PersonelSelect",
  props: {
    ...xe(),
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
  emits: Ve(),
  setup(r, {
    emit: t
  }) {
    const i = O("picker-dropdown"), a = O("personel-select"), e = r.controller, o = e.valueType === "OBJECTS" && (r.overflowMode === "ellipsis" || !!e.defaultAttentionValue), h = p(""), n = p([]), c = p([]), m = p(null), v = p(""), b = p(!1);
    p(!1);
    const w = p(""), E = p([]), N = p("user"), q = p([]), j = p(!1);
    p(!1), p(!1);
    const K = p(!1);
    p("");
    const ge = p(), k = p();
    let C;
    const be = p(), S = p(0);
    let M;
    const R = p(295);
    let x = 0;
    const we = De(() => !!(r.controlParams && r.controlParams.editmode === "hover")), V = () => {
      let s = 295;
      if (k.value) {
        const u = k.value.getBoundingClientRect(), g = 16, P = e.enableBottomButton ? 464 : 415, d = P - s, f = u.top < P + g, y = window.innerHeight - u.bottom < P + g;
        if (f && y) {
          const T = window.innerHeight - u.bottom - g - d;
          s = Math.max(50, Math.min(Math.floor(T), 295));
        }
      }
      R.value = s;
    }, Ee = (s) => /^https?:|^data:image|(\.png$|\.svg|\.jpg|\.png|\.gif|\.psd|\.tif|\.bmp|\.jpeg)$/.test(s), B = (s) => {
      const u = [], g = [];
      q.value = [];
      const P = (d) => {
        var se, ae, oe, le, re, ne, de, ce, he;
        if (typeof d != "object" || d === null) {
          const Ne = u.length, F = String((ae = (se = r.data) == null ? void 0 : se[e.valueItem]) != null ? ae : "").split(e.separator)[Ne] || String(d), ue = e.isAddSymbol && F.startsWith("'") && F.endsWith("'") ? F.slice(1, -1) : F;
          return {
            id: ue,
            name: String(d),
            [e.keyName]: ue,
            [e.textName]: String(d)
          };
        }
        const f = d, y = e.valueType === "OBJECT" || e.valueType === "OBJECTS", T = ve(y && e.objectValueField && f[e.objectValueField] ? f[e.objectValueField] : f), Q = y && e.objectIdField ? e.objectIdField : (oe = e.selfFillMap) == null ? void 0 : oe.user_id, ee = y && e.objectNameField ? e.objectNameField : (le = e.selfFillMap) == null ? void 0 : le.user_name, te = (ne = (re = Q && f[Q]) != null ? re : T.id) != null ? ne : T[e.keyName], ie = (ce = (de = ee && f[ee]) != null ? de : T.name) != null ? ce : T[e.textName];
        Object.assign(T, {
          id: te,
          name: ie,
          [e.keyName]: te,
          [e.textName]: ie
        });
        const _ = (he = e.selfFillMap) == null ? void 0 : he.user_title;
        return _ && f[_] !== void 0 && (T.title = f[_]), T;
      };
      Re(s) ? s.forEach((d) => {
        const f = P(d);
        f && (u.push(f), g.push(String(f.id)));
      }) : s != null && s !== "" && (e.multiple && typeof s == "string" ? s.split(e.separator) : [s]).forEach((f) => {
        const y = P(f);
        y && (u.push(y), g.push(String(y.id)));
      }), c.value = u, E.value = g, v.value = u.map((d) => d.name).join(e.separator);
    }, A = async (s = !1) => {
      if (b.value && !s)
        return;
      s && (x += 1, e.resetState(), n.value = []);
      const u = x, g = N.value, P = w.value;
      b.value = !0;
      try {
        const d = await e.loadMore(r.data, g, P ? {
          query: P
        } : {});
        d != null && d.data && u === x && g === N.value && P === w.value && (n.value = s ? d.data : n.value.concat(d.data));
      } finally {
        u === x && (b.value = !1);
      }
    }, X = (s) => {
      s.stopPropagation(), e.dataItems.forEach((u) => t("change", null, u.id)), e.valueItem && t("change", null, e.valueItem), t("change", null), t("infoTextChange", ""), B(null), j.value = !1, L(!1);
    }, J = async (s) => {
      if (e.multiple) {
        const d = E.value.findIndex((f) => f === String(s.id));
        d >= 0 ? (E.value.splice(d, 1), c.value.splice(d, 1)) : (E.value.push(String(s.id)), c.value.push(s));
      } else
        c.value = [s], E.value = [String(s.id)];
      const u = c.value;
      if ((await e.calcFillDataItems(u)).forEach((d) => t("change", d.value, d.id)), e.valueItem) {
        const d = u.map((y) => y.id);
        let f = e.multiple ? d.join(e.separator) : d[0];
        e.multiple && e.isAddSymbol && (f = d.map((y) => "'".concat(y, "'")).join(e.separator)), t("change", f, e.valueItem);
      }
      v.value = u.map((d) => d.name).join(e.separator);
      let P = v.value;
      e.valueType === "OBJECTS" ? P = u.map((d) => e.handleObjectParams(d)) : e.valueType === "OBJECT" && (P = e.handleObjectParams(s)), t("change", P), t("infoTextChange", v.value), e.multiple || (j.value = !1, L(!1));
    }, Pe = async () => {
      L(!0), e.isShowTab && !q.value.length && e.defaultSelCurUser && await e.initCurrentOperator(r.data, {}), n.value.length || await A(!0);
    }, ye = () => {
      w.value = "", L(!1);
    }, L = (s) => {
      K.value = s, t(s ? "focus" : "blur");
    }, Ie = (s) => {
      r.disabled && s.stopPropagation();
    }, Z = () => {
      M && window.clearTimeout(M), M = window.setTimeout(() => {
        S.value = ze.calcSelItemRenderNum(E.value, be.value);
      }, 500);
    };
    D([() => r.value, () => {
      var s;
      return (s = r.data) == null ? void 0 : s[e.valueItem];
    }], ([s]) => {
      B(s), h.value = s ? String(s) : "", Z();
    }, {
      immediate: !0,
      deep: !0
    }), D(w, () => {
      C && window.clearTimeout(C), C = window.setTimeout(() => {
        A(!0);
      }, 500);
    }), D(E, () => {
      Z();
    }), fe(() => {
      je(() => {
        B(r.value);
      }), window.addEventListener("resize", V), V();
    }), ke(() => {
      window.removeEventListener("resize", V), C && window.clearTimeout(C), M && window.clearTimeout(M);
    });
    const z = (s) => {
      var g;
      const u = e.getUserPictureUrl(s[e.keyName], s[e.textName]);
      return u && Ee(u) ? l("img", {
        class: i.e("list-avatar"),
        src: u
      }, null) : l("span", null, [(g = s.name) == null ? void 0 : g.slice(0, 1)]);
    }, Te = (s, u) => l("div", {
      class: i.e("multiple-item")
    }, [l("div", {
      class: i.e("multiple-item-textimg")
    }, [z(s), e.isShowNameText() && l("span", null, [s.name])]), !r.disabled && !r.readonly && l("span", {
      class: i.e("multiple-item-close"),
      onClick: (g) => {
        g.stopPropagation(), J(s);
      }
    }, [I("×")])]), Se = () => {
      if (!e.multiple)
        return l("div", {
          class: i.e("select-value")
        }, [l("div", {
          class: i.e("select-value-textimg")
        }, [c.value.length ? z(c.value[0]) : l("span", null, [I("+")])]), e.isShowNameText() && l("div", {
          class: i.e("select-value-text")
        }, [Fe(v.value)]), !r.disabled && !r.readonly && c.value.length ? l("span", {
          class: i.e("select-value-close"),
          onClick: X
        }, [I("×")]) : null]);
      const s = S.value >= 0 && o ? c.value.slice(0, S.value) : c.value;
      return l("div", {
        class: [i.e("select-value-multiple"), o && S.value >= 0 ? i.e("select-value-multiple-hidden") : ""]
      }, [s.map(Te), o && S.value >= 0 && c.value.length > S.value && l("div", {
        class: a.e("multiple-ellipsis-default")
      }, [I("…")])]);
    }, Y = (s = !1) => s ? l("div", null, [I("暂无数据")]) : l("div", {
      class: i.e("no-select-value")
    }, [l("span", null, [I("+")])]), Ae = () => b.value ? l("div", {
      class: i.e("loadmore")
    }, [I("加载中...")]) : n.value.length ? l(_e, {
      items: n.value,
      itemHeight: 36,
      showNum: 20,
      onScrollEvent: async (s, u) => {
        s - u - R.value < 40 && await A(!1);
      }
    }, {
      default: (s) => l("div", {
        class: [i.e("personel-list-item"), E.value.includes(String(s.id)) ? "is-selected" : ""],
        onClick: () => J(s)
      }, [l("div", {
        class: i.e("personel-list-text")
      }, [l("div", {
        class: i.e("personel-list-text-img")
      }, [z(s)]), l("span", null, [s.name]), s.title && l("span", {
        class: i.e("personel-list-title-label")
      }, [s.title])])])
    }) : Y(!0), G = () => {
      const s = $("ElInput");
      return l(s, {
        modelValue: w.value,
        "onUpdate:modelValue": (u) => {
          w.value = u;
        },
        placeholder: "搜索",
        clearable: !0
      }, null);
    };
    return {
      c: e,
      ns: i,
      ns2: a,
      items: n,
      loading: b,
      refValue: h,
      curValue: m,
      valueText: v,
      isEditable: K,
      popoverRef: ge,
      modelVisible: j,
      personelSelRef: k,
      showFormDefaultContent: we,
      load: A,
      onClear: X,
      onPopShow: Pe,
      onPageHide: ye,
      calcHeight: V,
      handleClick: Ie,
      setEditable: L,
      renderDropModal: () => {
        const s = $("ElPopover");
        return l("div", {
          class: i.e("select-modal"),
          style: "height:".concat(R.value, "px;")
        }, [l("div", {
          class: [i.e("select"), e.isShowTab ? "" : i.is("no-solider-tab")]
        }, [e.isShowTab && l("div", {
          class: i.e("select-state")
        }, [l("div", {
          class: [i.e("select-state-select-slider"), N.value === "user" ? "is-left" : "is-right"]
        }, null), l("div", {
          class: i.e("select-state-select-personel"),
          onClick: () => {
            N.value = "user", A(!0);
          }
        }, [I("人员")]), l("div", {
          class: i.e("select-state-select-department"),
          onClick: () => {
            N.value = "department", A(!0);
          }
        }, [I("部门")])])]), l("div", {
          class: i.e("select-modal-search-input")
        }, [G()]), l("div", {
          class: [i.e("personel-list-user"), e.isShowTab ? "" : i.is("no-solider-tab")]
        }, [Ae()]), e.enableBottomButton && l("div", {
          class: i.e("select-modal-bottom")
        }, [l(s, null, {
          default: () => [I("确定")]
        })])]);
      },
      renderReadState: Se,
      renderSelectInput: G,
      renderNoSelectValue: Y
    };
  },
  render() {
    const r = $("ElPopover"), t = O("picker-dropdown"), i = O("personel-select"), a = l(r, {
      ref: "popoverRef",
      visible: this.modelVisible,
      "onUpdate:visible": (e) => {
        this.modelVisible = e;
      },
      trigger: "click",
      popperClass: t.b("person-select"),
      width: 320,
      teleported: !0,
      onShow: () => void this.onPopShow(),
      onHide: () => this.onPageHide(),
      onBeforeEnter: () => this.calcHeight()
    }, {
      reference: () => this.renderReadState(),
      default: () => this.renderDropModal()
    });
    return l("div", {
      ref: "personelSelRef",
      class: [t.b(), i.b(), t.b("person-value"), this.disabled ? t.m("disabled") : "", this.readonly ? t.m("readonly") : "", this.c.isShowNameText() ? "" : t.m("only-icon"), t.is("editable", this.isEditable), t.is("show-default", this.showFormDefaultContent), i.is("multiple", this.c.multiple)],
      onClick: this.handleClick
    }, [this.readonly || this.disabled ? this.renderReadState() : a]);
  }
});
class $e extends Ce {
  constructor() {
    super(...arguments), this.operatorMap = /* @__PURE__ */ new Map(), this.total = 0, this.currentNumber = -1, this.page = 0, this.deptpage = 0, this.deptcurrentNumber = -1, this.depttotal = 0, this.userLoadVersion = 0, this.deptLoadVersion = 0, this.size = 20, this.multiple = !1, this.isAddSymbol = !1, this.separator = ",", this.pickupView = null, this.linkView = null, this.userFilterMap = {
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
    var i, a, e, o;
    if (await super.onInit(), this.initDefaultAttribute(), this.valueItem = ((i = this.model.valueItemName) == null ? void 0 : i.toLowerCase()) || "", this.initParams(), await this.getOperatorUserList(), this.model.appDataEntityId && (this.model.appDEDataSetId && (this.interfaceName = this.model.appDEDataSetId), this.model.appDEACModeId && (this.deACMode = await Me(
      this.model.appDEACModeId,
      this.model.appDataEntityId,
      this.context.srfappid
    )), this.deACMode)) {
      const { minorSortAppDEFieldId: h, minorSortDir: n } = this.deACMode;
      h && n && (this.sort = "".concat(h.toLowerCase(), ",").concat(n.toLowerCase())), this.deACMode.textAppDEFieldId && (this.textName = this.deACMode.textAppDEFieldId), this.deACMode.valueAppDEFieldId && (this.keyName = this.deACMode.valueAppDEFieldId), this.deACMode.deacmodeDataItems && (this.dataItems = [], this.deACMode.deacmodeDataItems.forEach((c) => {
        c.id !== "value" && c.id !== "text" && this.dataItems.push(c);
      }));
    }
    const t = [
      "PICKEREX_DROPDOWNVIEW",
      "PICKEREX_DROPDOWNVIEW_LINK",
      "PICKUPVIEW"
    ];
    this.model.editorType && t.includes(this.model.editorType) && this.initPickupViewParams(), this.objectIdField = (a = this.model.objectIdField) == null ? void 0 : a.toLowerCase(), this.objectNameField = (e = this.model.objectNameField) == null ? void 0 : e.toLowerCase(), this.objectValueField = (o = this.model.objectValueField) == null ? void 0 : o.toLowerCase();
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
    this.userUrl = this.editorParams.URL, this.deptUrl = this.editorParams.DEPTURL, this.userMethod = this.editorParams.USERMETHOD || "post", this.deptMethod = this.editorParams.DEPTMETHOD || "post", this.sysOperatorCodeListTag = this.editorParams.sysoperatorcodelisttag || "SysOperator", this.multiple = this.editorParams.MULTIPLE === "true", this.defaultSelCurUser = this.editorParams.DEFAULTSELCURUSER === "true", this.separator = this.editorParams.SEPARATOR || ",", this.isAddSymbol = this.editorParams.ISADDSYMBOL === "true" && this.multiple === !0, this.isShowTab = this.editorParams.ISSHOWTAB !== "false", this.suffix = this.editorParams.SUFFIX, this.clearFilter = this.editorParams.CLEARFILTER === "true", this.editorParams.VALUETYPE && (this.valueType = this.editorParams.VALUETYPE), this.editorParams.DEFAULTATNVALUE && (this.defaultAttentionValue = this.editorParams.DEFAULTATNVALUE), this.editorParams.VALUEITEMNAME && (this.valueItem = this.editorParams.VALUEITEMNAME), this.editorParams.userauthentity && (this.userAuthEntity = this.editorParams.userauthentity), this.editorParams.deptauthentity && (this.deptAuthEntity = this.editorParams.deptauthentity), this.editorParams.ENABLEBOTTOMBUTTON && (this.enableBottomButton = this.editorParams.ENABLEBOTTOMBUTTON === "true"), this.parseObjectParam("SELFFILLMAP", (t) => {
      Object.assign(this.selfFillMap, t);
    }), this.parseObjectParam("USERMAP", (t) => {
      Object.assign(this.userFilterMap, t);
    }, () => {
      this.userFilterMap = {
        id: "id",
        name: "name",
        title: "title",
        avatar: ""
      };
    }), this.parseObjectParam("DEPTMAP", (t) => {
      Object.assign(this.deptFilterMap, t);
    }, () => {
      this.deptFilterMap = {
        id: "id",
        name: "name",
        title: "title",
        avatar: ""
      };
    }), this.editorParams.SHOWNAMETEXT && (this.showNameText = this.toBoolean(this.editorParams.SHOWNAMETEXT)), this.editorParams.SHOWNAMETIP && (this.showNameTip = this.toBoolean(this.editorParams.SHOWNAMETIP));
  }
  parseObjectParam(t, i, a) {
    if (this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, t))
      try {
        i(JSON.parse(this.editorParams[t]));
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
  async initCurrentOperator(t, i) {
    const a = this.context.srfuserid;
    if (!a)
      return;
    const e = await this.getServiceData(
      "department",
      t,
      {},
      {
        ...i,
        page: 0,
        size: 20,
        n_id_eq: a
      }
    );
    e && e.data && e.data.length > 0 && (this.currentOperator = e.data.find(
      (o) => o[this.deptFilterMap.id] === a
    ));
  }
  resetState() {
    this.resetUserState(), this.resetDeptState();
  }
  resetUserState() {
    this.userLoadVersion += 1, this.userLoad = void 0, this.total = 0, this.currentNumber = -1, this.page = 0, this.copyUserUrl = "";
  }
  resetDeptState() {
    this.deptLoadVersion += 1, this.deptLoad = void 0, this.deptpage = 0, this.depttotal = 0, this.deptcurrentNumber = -1, this.copyDeptUrl = "";
  }
  async loadMore(t, i, a = {}) {
    const e = i === "user", o = e ? this.userLoad : this.deptLoad;
    if (o)
      return o;
    if (!(e ? this.currentNumber < this.total : this.deptcurrentNumber < this.depttotal))
      return;
    const n = e ? this.userLoadVersion : this.deptLoadVersion, c = this.getServiceData(i, t, a).then((m) => {
      if (!(!m || n !== (e ? this.userLoadVersion : this.deptLoadVersion)))
        return e ? (this.page += 1, this.currentNumber < 0 && (this.currentNumber += 1), this.currentNumber += this.size, this.total = (m.total ? Number(m.total) : Number(m.headers["x-total"])) || 0, this.applyFilterMap(m.data, this.userFilterMap)) : (this.deptpage += 1, this.deptcurrentNumber < 0 && (this.deptcurrentNumber += 1), this.deptcurrentNumber += this.size, this.depttotal = (m.total ? Number(m.total) : Number(m.headers["x-total"])) || 0, this.applyFilterMap(m.data, this.deptFilterMap)), m;
    });
    e ? this.userLoad = c : this.deptLoad = c;
    try {
      return await c;
    } finally {
      e && this.userLoad === c && (this.userLoad = void 0), !e && this.deptLoad === c && (this.deptLoad = void 0);
    }
  }
  applyFilterMap(t, i) {
    t.forEach((a) => {
      Object.keys(i).forEach((e) => {
        a[e] = a[i[e]];
      });
    });
  }
  async onActionClick(t, i, a) {
    const e = t.uiactionId, o = this.parent;
    let h = {};
    o.form ? h = o.form.ctx.view : o.grid && (h = o.grid.ctx.view), await Le.execAndResolved(
      e,
      {
        context: this.context,
        params: this.params,
        data: i,
        view: h,
        event: a
      },
      t.appId
    );
  }
  fill(t = "", i, a, e) {
    if (U(t)) {
      if (U(i)) {
        const o = t.match(this.contextReg);
        o == null || o.forEach((h) => {
          const n = h.slice(10, h.length - 1);
          t = t.replace("${context.".concat(n, "}"), i[n] || "");
        });
      }
      if (U(a)) {
        const o = t.match(this.paramsReg);
        o == null || o.forEach((h) => {
          const n = h.slice(9, h.length - 1);
          t = t.replace("${params.".concat(n, "}"), a[n] || "");
        });
      }
      if (U(e)) {
        const o = t.match(this.dataReg);
        o == null || o.forEach((h) => {
          const n = h.slice(7, h.length - 1);
          t = t.replace("${data.".concat(n, "}"), e[n] || "");
        });
      }
    }
    return t;
  }
  async getServiceData(t, i, a, e) {
    const { context: o, params: h } = this.handlePublicParams(
      i,
      this.context,
      this.params
    ), n = {};
    this.sort && !Object.is(this.sort, "") && Object.assign(n, { sort: this.sort }), Object.assign(n, {
      page: t === "user" ? this.page : this.deptpage,
      size: this.size
    }), a && Object.assign(n, a);
    const c = e && Object.keys(e).length > 0 ? e : Be(h, n), m = this.fill(this.userUrl, o, h, i).replaceAll(
      "//",
      "/"
    ), v = this.fill(this.deptUrl, o, h, i).replaceAll(
      "//",
      "/"
    );
    this.copyUserUrl = m, this.copyDeptUrl = v;
    let b = "", w = "post";
    const E = {};
    if (t === "user" ? (b = m, w = this.userMethod.toLowerCase()) : (b = v, w = this.deptMethod.toLowerCase()), w === "get" ? Object.assign(E, { method: w, params: c }) : Object.assign(E, { method: w, data: c }), b)
      return await ibiz.net.request(b, E);
    throw new H(this.model, "请配置数据接口地址");
  }
  async openPickUpView(t, i) {
    await this.initPickupViewParams();
    const { context: a, params: e } = this.handlePublicParams(
      t,
      this.context,
      this.params
    );
    if (i && (e.selectedData = i), !this.pickupView)
      throw new H(this.model, "请配置数据选择视图");
    const o = await ibiz.commands.execute(
      pe.TAG,
      this.pickupView.id,
      a,
      e,
      { openMode: "POPUPMODAL" }
    );
    if (o && o.ok && o.data)
      return o.data;
    ibiz.log.debug("模态取消或关闭异常", o);
  }
  async openLinkView(t) {
    const i = this.context.clone();
    t[this.valueItem] && (i.srfkey = t[this.valueItem]);
    const { context: a, params: e } = this.handlePublicParams(
      t,
      i,
      this.params
    ), { linkAppViewId: o } = this.model;
    if (!o)
      throw new H(this.model, "请配置数据链接视图");
    return ibiz.commands.execute(
      pe.TAG,
      o,
      a,
      e
    );
  }
  async calcFillDataItems(t) {
    return this.deACMode ? this.dataItems.length === 0 ? [] : await Promise.all(
      this.dataItems.map((i) => {
        const a = t.map((e) => e[i.appDEFieldId]).join(this.separator);
        return {
          id: i.id,
          value: a
        };
      })
    ) : [];
  }
  handleObjectParams(t) {
    const i = {};
    return this.objectIdField && Object.assign(i, {
      [this.objectIdField]: t[this.keyName]
    }), this.objectNameField && Object.assign(i, {
      [this.objectNameField]: t[this.textName]
    }), this.objectValueField && Object.assign(i, {
      [this.objectValueField]: ve(t)
    }), i;
  }
  async getOperatorUserList() {
    const i = await (await ibiz.hub.getApp(this.context.srfappid)).codeList.get(
      this.sysOperatorCodeListTag,
      this.context,
      this.params
    );
    this.operatorMap = new Map(
      i.map((a) => [a.value, a])
    );
  }
  isShowNameText() {
    return this.showNameText;
  }
  isShowNameTip() {
    return this.showNameTip;
  }
  getUserPictureUrl(t, i) {
    if (this.operatorMap.size <= 0)
      return "";
    let a = {};
    return this.operatorMap.get(t) ? a = this.operatorMap.get(t) : Array.from(this.operatorMap.entries()).find((e) => {
      const o = e[1] || {};
      return o.text && i && o.text === i ? (a = o, !0) : !1;
    }), a.data && a.data.iconurl ? a.data.iconurl : "";
  }
}
class He {
  constructor() {
    this.component = "PersonelSelect", this.formEditor = "PersonelSelect", this.gridEditor = "PersonelSelect";
  }
  async createController(t, i) {
    const a = new $e(
      t,
      i
    );
    return await a.init(), a;
  }
}
const We = Ue(W, (r) => {
  r.component(W.name, W), Oe(
    "EDITOR_CUSTOMSTYLE_PERSON_SELECT",
    () => new He()
  );
}), tt = {
  install(r) {
    r.use(We);
  }
};
export {
  We as IBizPersonelSelect,
  tt as default
};
