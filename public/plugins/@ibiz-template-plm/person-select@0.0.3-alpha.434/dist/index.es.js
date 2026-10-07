import './assets/style.css';
import { EditorController as Ne, getDeACMode as Ce, UIActionUtil as Me, OpenAppViewCommand as he, registerEditorProvider as xe } from "@ibiz-template/runtime";
import { useNamespace as x, getDataPickerProps as Oe, getEditorEmits as Fe, renderString as De, withInstall as Ue } from "@ibiz-template/vue3-util";
import { defineComponent as pe, ref as h, onMounted as me, watch as L, createVNode as o, computed as Le, nextTick as je, onBeforeUnmount as Ve, resolveComponent as _, createTextVNode as y } from "vue";
import { isArray as ke } from "lodash-es";
import { clone as fe, mergeDeepLeft as Re } from "ramda";
import { RuntimeModelError as $ } from "@ibiz-template/core";
import { notNilEmpty as U } from "qx-util";
class Be {
  /**
   * 计算多选场景下可绘制的选中项数量。
   */
  static calcSelItemRenderNum(i, t) {
    let a = -1;
    if (t && (i == null ? void 0 : i.length) > 0) {
      const e = (t == null ? void 0 : t.offsetWidth) || 0, l = window.getComputedStyle(t), u = parseInt(l.marginLeft, 10), n = parseInt(l.marginRight, 10), p = parseInt(l.paddingLeft, 10), I = parseInt(l.paddingRight, 10), f = u + n + p + I, g = 32, v = 8, b = (g + v) * i.length;
      e - f - b < 0 && (a = Math.floor((e - f) / (g + v)), a = Math.max(a - 1, 0));
    }
    return a;
  }
}
const ze = /* @__PURE__ */ pe({
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
    emit: i
  }) {
    const t = x("virtual-list"), a = h(36), e = h(), l = h([]), u = h(0);
    let n = 0, p = 0, I = 0;
    const f = () => {
      p = Math.floor(n / r.itemHeight), I = p + r.showNum, l.value = r.items.slice(p, I), u.value = n - n % r.itemHeight;
    }, g = () => {
      n = e.value.scrollTop, f(), i("scrollEvent", a.value, n);
    };
    return me(() => {
      setTimeout(() => {
        f();
      }, 1e3);
    }), L(() => r.items, () => {
      a.value = r.itemHeight * r.items.length, f();
    }, {
      immediate: !0,
      deep: !0
    }), {
      ns: t,
      contentHeight: a,
      showList: l,
      contentBox: e,
      top: u,
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
    }, [this.showList.map((r, i) => o("div", {
      key: i,
      class: this.ns.m("item")
    }, [this.$slots.default ? this.$slots.default({
      ...r,
      index: i
    }) : r.name]))])])]);
  }
}), H = /* @__PURE__ */ pe({
  name: "PersonelSelect",
  props: {
    ...Oe(),
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
  emits: Fe(),
  setup(r, {
    emit: i
  }) {
    const t = x("picker-dropdown"), a = x("personel-select"), e = r.controller, l = e.valueType === "OBJECTS" && (r.overflowMode === "ellipsis" || !!e.defaultAttentionValue), u = h(""), n = h([]), p = h([]), I = h(null), f = h(""), g = h(!1);
    h(!1);
    const v = h(""), b = h([]), O = h("user"), W = h([]), j = h(!1);
    h(!1), h(!1);
    const K = h(!1);
    h("");
    const ve = h(), V = h();
    let N;
    const ge = h(), S = h(0);
    let C;
    const k = h(295), be = Le(() => !!(r.controlParams && r.controlParams.editmode === "hover")), F = () => {
      let s = 295;
      if (V.value) {
        const d = V.value.getBoundingClientRect(), w = 16, P = e.enableBottomButton ? 464 : 415, c = P - s, m = d.top < P + w, E = window.innerHeight - d.bottom < P + w;
        if (m && E) {
          const T = window.innerHeight - d.bottom - w - c;
          s = Math.max(50, Math.min(Math.floor(T), 295));
        }
      }
      k.value = s;
    }, we = (s) => /^https?:|^data:image|(\.png$|\.svg|\.jpg|\.png|\.gif|\.psd|\.tif|\.bmp|\.jpeg)$/.test(s), R = (s) => {
      const d = [], w = [];
      W.value = [];
      const P = (c) => {
        var ie, se, ae, le, oe, re, ne, de, ce;
        if (typeof c != "object" || c === null) {
          const Ae = d.length, D = String((se = (ie = r.data) == null ? void 0 : ie[e.valueItem]) != null ? se : "").split(e.separator)[Ae] || String(c), ue = e.isAddSymbol && D.startsWith("'") && D.endsWith("'") ? D.slice(1, -1) : D;
          return {
            id: ue,
            name: String(c),
            [e.keyName]: ue,
            [e.textName]: String(c)
          };
        }
        const m = c, E = e.valueType === "OBJECT" || e.valueType === "OBJECTS", T = fe(E && e.objectValueField && m[e.objectValueField] ? m[e.objectValueField] : m), G = E && e.objectIdField ? e.objectIdField : (ae = e.selfFillMap) == null ? void 0 : ae.user_id, Q = E && e.objectNameField ? e.objectNameField : (le = e.selfFillMap) == null ? void 0 : le.user_name, ee = (re = (oe = G && m[G]) != null ? oe : T.id) != null ? re : T[e.keyName], te = (de = (ne = Q && m[Q]) != null ? ne : T.name) != null ? de : T[e.textName];
        Object.assign(T, {
          id: ee,
          name: te,
          [e.keyName]: ee,
          [e.textName]: te
        });
        const z = (ce = e.selfFillMap) == null ? void 0 : ce.user_title;
        return z && m[z] !== void 0 && (T.title = m[z]), T;
      };
      ke(s) ? s.forEach((c) => {
        const m = P(c);
        m && (d.push(m), w.push(String(m.id)));
      }) : s != null && s !== "" && (e.multiple && typeof s == "string" ? s.split(e.separator) : [s]).forEach((m) => {
        const E = P(m);
        E && (d.push(E), w.push(String(E.id)));
      }), p.value = d, b.value = w, f.value = d.map((c) => c.name).join(e.separator);
    }, A = async (s = !1) => {
      s && (e.resetState(), n.value = []), g.value = !0;
      try {
        const d = await e.loadMore(r.data, O.value, v.value ? {
          query: v.value
        } : {});
        d != null && d.data && (n.value = s ? d.data : n.value.concat(d.data));
      } finally {
        g.value = !1;
      }
    }, X = (s) => {
      s.stopPropagation(), e.dataItems.forEach((d) => i("change", null, d.id)), e.valueItem && i("change", null, e.valueItem), i("change", null), i("infoTextChange", ""), R(null), j.value = !1, M(!1);
    }, q = async (s) => {
      if (e.multiple) {
        const c = b.value.findIndex((m) => m === String(s.id));
        c >= 0 ? (b.value.splice(c, 1), p.value.splice(c, 1)) : (b.value.push(String(s.id)), p.value.push(s));
      } else
        p.value = [s], b.value = [String(s.id)];
      const d = p.value;
      if ((await e.calcFillDataItems(d)).forEach((c) => i("change", c.value, c.id)), e.valueItem) {
        const c = d.map((E) => E.id);
        let m = e.multiple ? c.join(e.separator) : c[0];
        e.multiple && e.isAddSymbol && (m = c.map((E) => "'".concat(E, "'")).join(e.separator)), i("change", m, e.valueItem);
      }
      f.value = d.map((c) => c.name).join(e.separator);
      let P = f.value;
      e.valueType === "OBJECTS" ? P = d.map((c) => e.handleObjectParams(c)) : e.valueType === "OBJECT" && (P = e.handleObjectParams(s)), i("change", P), i("infoTextChange", f.value), e.multiple || (j.value = !1, M(!1));
    }, Ee = async () => {
      M(!0), e.isShowTab && !W.value.length && e.defaultSelCurUser && await e.initCurrentOperator(r.data, {}), n.value.length || await A(!0);
    }, Pe = () => {
      v.value = "", M(!1);
    }, M = (s) => {
      K.value = s, i(s ? "focus" : "blur");
    }, ye = (s) => {
      r.disabled && s.stopPropagation();
    }, J = () => {
      C && window.clearTimeout(C), C = window.setTimeout(() => {
        S.value = Be.calcSelItemRenderNum(b.value, ge.value);
      }, 500);
    };
    L([() => r.value, () => {
      var s;
      return (s = r.data) == null ? void 0 : s[e.valueItem];
    }], ([s]) => {
      R(s), u.value = s ? String(s) : "", J();
    }, {
      immediate: !0,
      deep: !0
    }), L(v, () => {
      N && window.clearTimeout(N), N = window.setTimeout(() => {
        A(!0);
      }, 500);
    }), L(b, () => {
      J();
    }), me(() => {
      je(() => {
        R(r.value);
      }), window.addEventListener("resize", F), F();
    }), Ve(() => {
      window.removeEventListener("resize", F), N && window.clearTimeout(N), C && window.clearTimeout(C);
    });
    const B = (s) => {
      var w;
      const d = e.getUserPictureUrl(s[e.keyName], s[e.textName]);
      return d && we(d) ? o("img", {
        class: t.e("list-avatar"),
        src: d
      }, null) : o("span", null, [(w = s.name) == null ? void 0 : w.slice(0, 1)]);
    }, Ie = (s, d) => o("div", {
      class: t.e("multiple-item")
    }, [o("div", {
      class: t.e("multiple-item-textimg")
    }, [B(s), e.isShowNameText() && o("span", null, [s.name])]), !r.disabled && !r.readonly && o("span", {
      class: t.e("multiple-item-close"),
      onClick: (w) => {
        w.stopPropagation(), q(s);
      }
    }, [y("×")])]), Te = () => {
      if (!e.multiple)
        return o("div", {
          class: t.e("select-value")
        }, [o("div", {
          class: t.e("select-value-textimg")
        }, [p.value.length ? B(p.value[0]) : o("span", null, [y("+")])]), e.isShowNameText() && o("div", {
          class: t.e("select-value-text")
        }, [De(f.value)]), !r.disabled && !r.readonly && p.value.length ? o("span", {
          class: t.e("select-value-close"),
          onClick: X
        }, [y("×")]) : null]);
      const s = S.value >= 0 && l ? p.value.slice(0, S.value) : p.value;
      return o("div", {
        class: [t.e("select-value-multiple"), l && S.value >= 0 ? t.e("select-value-multiple-hidden") : ""]
      }, [s.map(Ie), l && S.value >= 0 && p.value.length > S.value && o("div", {
        class: a.e("multiple-ellipsis-default")
      }, [y("…")])]);
    }, Z = (s = !1) => s ? o("div", null, [y("暂无数据")]) : o("div", {
      class: t.e("no-select-value")
    }, [o("span", null, [y("+")])]), Se = () => g.value ? o("div", {
      class: t.e("loadmore")
    }, [y("加载中...")]) : n.value.length ? o(ze, {
      items: n.value,
      itemHeight: 36,
      showNum: 20,
      onScrollEvent: async (s, d) => {
        s - d - k.value < 40 && await A(!1);
      }
    }, {
      default: (s) => o("div", {
        class: [t.e("personel-list-item"), b.value.includes(String(s.id)) ? "is-selected" : ""],
        onClick: () => q(s)
      }, [o("div", {
        class: t.e("personel-list-text")
      }, [o("div", {
        class: t.e("personel-list-text-img")
      }, [B(s)]), o("span", null, [s.name]), s.title && o("span", {
        class: t.e("personel-list-title-label")
      }, [s.title])])])
    }) : Z(!0), Y = () => {
      const s = _("ElInput");
      return o(s, {
        modelValue: v.value,
        "onUpdate:modelValue": (d) => {
          v.value = d;
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
      refValue: u,
      curValue: I,
      valueText: f,
      isEditable: K,
      popoverRef: ve,
      modelVisible: j,
      personelSelRef: V,
      showFormDefaultContent: be,
      load: A,
      onClear: X,
      onPopShow: Ee,
      onPageHide: Pe,
      calcHeight: F,
      handleClick: ye,
      setEditable: M,
      renderDropModal: () => {
        const s = _("ElPopover");
        return o("div", {
          class: t.e("select-modal"),
          style: "height:".concat(k.value, "px;")
        }, [o("div", {
          class: [t.e("select"), e.isShowTab ? "" : t.is("no-solider-tab")]
        }, [e.isShowTab && o("div", {
          class: t.e("select-state")
        }, [o("div", {
          class: [t.e("select-state-select-slider"), O.value === "user" ? "is-left" : "is-right"]
        }, null), o("div", {
          class: t.e("select-state-select-personel"),
          onClick: () => {
            O.value = "user", A(!0);
          }
        }, [y("人员")]), o("div", {
          class: t.e("select-state-select-department"),
          onClick: () => {
            O.value = "department", A(!0);
          }
        }, [y("部门")])])]), o("div", {
          class: t.e("select-modal-search-input")
        }, [Y()]), o("div", {
          class: [t.e("personel-list-user"), e.isShowTab ? "" : t.is("no-solider-tab")]
        }, [Se()]), e.enableBottomButton && o("div", {
          class: t.e("select-modal-bottom")
        }, [o(s, null, {
          default: () => [y("确定")]
        })])]);
      },
      renderReadState: Te,
      renderSelectInput: Y,
      renderNoSelectValue: Z
    };
  },
  render() {
    const r = _("ElPopover"), i = x("picker-dropdown"), t = x("personel-select"), a = o(r, {
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
class _e extends Ne {
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
    var t, a, e, l;
    if (await super.onInit(), this.initDefaultAttribute(), this.valueItem = ((t = this.model.valueItemName) == null ? void 0 : t.toLowerCase()) || "", this.initParams(), await this.getOperatorUserList(), this.model.appDataEntityId && (this.model.appDEDataSetId && (this.interfaceName = this.model.appDEDataSetId), this.model.appDEACModeId && (this.deACMode = await Ce(
      this.model.appDEACModeId,
      this.model.appDataEntityId,
      this.context.srfappid
    )), this.deACMode)) {
      const { minorSortAppDEFieldId: u, minorSortDir: n } = this.deACMode;
      u && n && (this.sort = "".concat(u.toLowerCase(), ",").concat(n.toLowerCase())), this.deACMode.textAppDEFieldId && (this.textName = this.deACMode.textAppDEFieldId), this.deACMode.valueAppDEFieldId && (this.keyName = this.deACMode.valueAppDEFieldId), this.deACMode.deacmodeDataItems && (this.dataItems = [], this.deACMode.deacmodeDataItems.forEach((p) => {
        p.id !== "value" && p.id !== "text" && this.dataItems.push(p);
      }));
    }
    const i = [
      "PICKEREX_DROPDOWNVIEW",
      "PICKEREX_DROPDOWNVIEW_LINK",
      "PICKUPVIEW"
    ];
    this.model.editorType && i.includes(this.model.editorType) && this.initPickupViewParams(), this.objectIdField = (a = this.model.objectIdField) == null ? void 0 : a.toLowerCase(), this.objectNameField = (e = this.model.objectNameField) == null ? void 0 : e.toLowerCase(), this.objectValueField = (l = this.model.objectValueField) == null ? void 0 : l.toLowerCase();
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
      (l) => l[this.deptFilterMap.id] === a
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
    const e = i.uiactionId, l = this.parent;
    let u = {};
    l.form ? u = l.form.ctx.view : l.grid && (u = l.grid.ctx.view), await Me.execAndResolved(
      e,
      {
        context: this.context,
        params: this.params,
        data: t,
        view: u,
        event: a
      },
      i.appId
    );
  }
  fill(i = "", t, a, e) {
    if (U(i)) {
      if (U(t)) {
        const l = i.match(this.contextReg);
        l == null || l.forEach((u) => {
          const n = u.slice(10, u.length - 1);
          i = i.replace("${context.".concat(n, "}"), t[n] || "");
        });
      }
      if (U(a)) {
        const l = i.match(this.paramsReg);
        l == null || l.forEach((u) => {
          const n = u.slice(9, u.length - 1);
          i = i.replace("${params.".concat(n, "}"), a[n] || "");
        });
      }
      if (U(e)) {
        const l = i.match(this.dataReg);
        l == null || l.forEach((u) => {
          const n = u.slice(7, u.length - 1);
          i = i.replace("${data.".concat(n, "}"), e[n] || "");
        });
      }
    }
    return i;
  }
  async getServiceData(i, t, a, e) {
    const { context: l, params: u } = this.handlePublicParams(
      t,
      this.context,
      this.params
    ), n = {};
    this.sort && !Object.is(this.sort, "") && Object.assign(n, { sort: this.sort }), Object.assign(n, { size: this.size }), a && Object.assign(n, a);
    const p = e || Re(u, n), I = this.fill(this.userUrl, l, u, t).replaceAll(
      "//",
      "/"
    ), f = this.fill(this.deptUrl, l, u, t).replaceAll(
      "//",
      "/"
    );
    this.copyUserUrl = I, this.copyDeptUrl = f;
    let g = "", v = "post";
    const b = {};
    if (i === "user" ? (g = I, v = this.userMethod.toLowerCase()) : (g = f, v = this.deptMethod.toLowerCase()), v === "get" ? Object.assign(b, { method: v, params: p }) : Object.assign(b, { method: v, data: p }), g)
      return await ibiz.net.request(g, b);
    throw new $(this.model, "请配置数据接口地址");
  }
  async openPickUpView(i, t) {
    await this.initPickupViewParams();
    const { context: a, params: e } = this.handlePublicParams(
      i,
      this.context,
      this.params
    );
    if (t && (e.selectedData = t), !this.pickupView)
      throw new $(this.model, "请配置数据选择视图");
    const l = await ibiz.commands.execute(
      he.TAG,
      this.pickupView.id,
      a,
      e,
      { openMode: "POPUPMODAL" }
    );
    if (l && l.ok && l.data)
      return l.data;
    ibiz.log.debug("模态取消或关闭异常", l);
  }
  async openLinkView(i) {
    const t = this.context.clone();
    i[this.valueItem] && (t.srfkey = i[this.valueItem]);
    const { context: a, params: e } = this.handlePublicParams(
      i,
      t,
      this.params
    ), { linkAppViewId: l } = this.model;
    if (!l)
      throw new $(this.model, "请配置数据链接视图");
    return ibiz.commands.execute(
      he.TAG,
      l,
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
      [this.objectValueField]: fe(i)
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
      const l = e[1] || {};
      return l.text && t && l.text === t ? (a = l, !0) : !1;
    }), a.data && a.data.iconurl ? a.data.iconurl : "";
  }
}
class $e {
  constructor() {
    this.component = "PersonelSelect", this.formEditor = "PersonelSelect", this.gridEditor = "PersonelSelect";
  }
  async createController(i, t) {
    const a = new _e(
      i,
      t
    );
    return await a.init(), a;
  }
}
const He = Ue(H, (r) => {
  r.component(H.name, H), xe(
    "EDITOR_CUSTOMSTYLE_PERSON_SELECT",
    () => new $e()
  );
}), et = {
  install(r) {
    r.use(He);
  }
};
export {
  He as IBizPersonelSelect,
  et as default
};
