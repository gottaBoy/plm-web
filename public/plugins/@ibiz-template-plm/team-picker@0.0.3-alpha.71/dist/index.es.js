import './assets/style.css';
import { registerEditorProvider as G, EditorController as H, getDeACMode as q } from "@ibiz-template/runtime";
import { defineComponent as Y, ref as g, computed as J, watch as K, onMounted as W, onBeforeUnmount as $, createVNode as i, resolveComponent as D, createTextVNode as h } from "vue";
import { getDataPickerProps as Q, getEditorEmits as X, useNamespace as ee } from "@ibiz-template/vue3-util";
import { createUUID as te } from "qx-util";
import { RuntimeModelError as ae } from "@ibiz-template/core";
import { mergeDeepLeft as se } from "ramda";
var ie = Object.defineProperty, re = (r, o, t) => o in r ? ie(r, o, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[o] = t, n = (r, o, t) => (re(r, typeof o != "symbol" ? o + "" : o, t), t);
const L = /* @__PURE__ */ Y({
  name: "TeamPicker",
  props: Q(),
  emits: X(),
  setup(r, {
    emit: o
  }) {
    const t = ee("team-picker"), s = r.controller, c = g(""), l = g([]), d = g(!1), p = te();
    let v = !1;
    const M = g(), F = J(() => !!(r.controlParams && r.controlParams.editmode === "hover" && !r.readonly)), z = () => {
      const e = document.documentElement;
      return e ? getComputedStyle(e).getPropertyValue("--ibiz-color-primary") : null;
    }, P = (e) => /[\u4E00-\u9FA5]/.test(e), O = (e) => /[\u4e00-\u9fa5]+.*[a-zA-Z]+|[a-zA-Z]+.*[\u4e00-\u9fa5]+/.test(e), j = (e) => {
      if (!e)
        return "";
      let a = 0;
      for (let f = 0; f < e.length; f++)
        if (P(e))
          a = e.charCodeAt(f) + ((a << 5) - a), a = a & a;
        else {
          const B = e.charCodeAt(f);
          a += B.toString(16);
        }
      const m = String(a).substring(0, 6);
      let u = parseInt(m.substring(0, 2), 16), y = parseInt(m.substring(2, 4), 16), b = parseInt(m.substring(4, 6), 16);
      u < 0 && (u = 10), y < 0 && (y = 10), b < 0 && (b = 10);
      const S = "#".concat(u.toString(16).padStart(2, "0")).concat(y.toString(16).padStart(2, "0")).concat(b.toString(16).padStart(2, "0"));
      return S === "#FFFFFF" && z() || S;
    }, N = (e) => {
      if (e && e.toString().length < 2)
        return e;
      if (e && e.toString().length >= 2) {
        if (O(e)) {
          const a = e.split("").find((u) => /[a-zA-Z]/.test(u)) || "", m = e.split("").find((u) => /[\u4E00-\u9FA5]/.test(u)) || "";
          return "".concat(a).concat(m).toLowerCase();
        }
        return /[a-zA-Z]/.test(e) ? e.split("").filter((a) => /[a-zA-Z]/.test(a)).slice(0, 2).join("").toUpperCase() : /[\u4E00-\u9FA5]/.test(e) ? e.split("").filter((a) => /[\u4E00-\u9FA5]/.test(a)).slice(-2).join("") : e.replaceAll(" ", "").substring(0, 2);
      }
    }, I = () => {
      const e = l.value.find((a) => a.id === c.value);
      if (e) {
        const a = s.fillMap[e.type];
        o("change", a), s.valueItem && o("change", e.id, s.valueItem);
      }
    }, C = (e) => {
      c.value = e.id, d.value = !1, I();
    }, x = (e) => {
      if (e.avatar) {
        const m = JSON.parse(e.avatar), u = ibiz.util.file.calcFileUpDownUrl(s.context, s.params).downloadUrl.replace("%fileId%", m[0].id);
        return i("img", {
          class: t.em("item", "img-avatar"),
          src: u,
          alt: ""
        }, null);
      }
      const a = e.name;
      return i("div", {
        class: t.em("item", "text-avatar"),
        style: "background-color:".concat(j(a))
      }, [N(a)]);
    }, k = (e) => i("div", {
      class: t.e("item"),
      onClick: () => C(e)
    }, [i("svg", {
      class: t.em("item", "org-icon"),
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false",
      fill: "currentColor"
    }, [i("g", {
      id: "aqm画板",
      "stroke-width": "1",
      "fill-rule": "evenodd"
    }, [i("path", {
      d: "M11.838 0c6.538 0 11.838 5.373 11.838 12s-5.3 12-11.838 12C5.3 24 0 18.627 0 12S5.3 0 11.838 0zM13 4h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1l.41-.001-.016 2.139H8.5l-.15.006a2.1 2.1 0 0 0-1.95 2.094V14H6a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-.4v-1.762l.007-.113a.9.9 0 0 1 .893-.787h7l.113.007a.9.9 0 0 1 .787.893V14H16a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-.4v-1.762l-.005-.15a2.1 2.1 0 0 0-2.095-1.95h-2.906l.016-2.139L13 8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm4.8 11.2v1.6h-1.6v-1.6h1.6zm-10 0v1.6H6.2v-1.6h1.6zm5-10v1.6h-1.6V5.2h1.6z",
      id: "aqm形状结合"
    }, null)])]), i("div", {
      class: t.em("item", "content")
    }, [i("span", {
      class: t.em("item", "type")
    }, [h("组织")]), i("span", {
      class: t.em("item", "type-divide")
    }, [h("/")]), i("span", {
      class: t.em("item", "orgname"),
      title: e.name
    }, [e.name])])]), _ = (e) => i("div", {
      class: t.e("item"),
      onClick: () => C(e)
    }, [i("div", {
      class: t.em("item", "text-icon")
    }, [x(e)]), i("div", {
      class: t.em("item", "content")
    }, [i("span", {
      class: t.em("item", "type")
    }, [h("个人")]), i("span", {
      class: t.em("item", "type-divide")
    }, [h("/")]), i("span", {
      class: t.em("item", "personname"),
      title: e.name
    }, [e.name])])]), R = (e) => i("div", {
      class: t.e("item"),
      onClick: () => C(e)
    }, [e.avatar ? i("div", {
      class: t.em("item", "text-icon")
    }, [x(e)]) : i("svg", {
      class: t.em("item", "team-icon"),
      viewBox: "0 0 16 16",
      version: "1.1",
      height: "1em",
      width: "1em",
      xmlns: "http://www.w3.org/2000/svg",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false",
      fill: "currentColor"
    }, [i("title", null, [h("normal/user-group-avatar@1x")]), i("g", {
      id: "团队",
      "stroke-width": "1",
      "fill-rule": "evenodd"
    }, [i("path", {
      d: "M8,0 C12.418278,-8.11624501e-16 16,3.581722 16,8 C16,12.418278 12.418278,16 8,16 C3.581722,16 5.41083001e-16,12.418278 0,8 C-5.41083001e-16,3.581722 3.581722,8.11624501e-16 8,0 Z M6.94814892,4.5 C5.8297723,4.5 4.92314892,5.40662338 4.92314892,6.525 C4.92314892,7.17754041 5.23179842,7.75799186 5.71074948,8.1273513 C4.58627683,8.60821226 3.79861678,9.72458136 3.80000182,11.025 C3.80000182,11.2113961 3.95110572,11.3625 4.13750182,11.3625 L4.20551985,11.3556432 C4.3593129,11.3241726 4.47500182,11.1880966 4.47500182,11.025 L4.473,11.01 L4.47841342,10.8622681 C4.55871908,9.62501422 5.54816314,8.63557016 6.78541699,8.5552645 L6.942,8.549 L6.96130368,8.55003422 C8.32215601,8.55711636 9.42316527,9.66248284 9.42824334,11.025 C9.42824334,11.2113961 9.57934724,11.3625 9.76574334,11.3625 C9.95213944,11.3625 10.1032433,11.2113961 10.1032433,11.025 L10.0963865,10.956982 L10.0931624,10.8462507 C10.0247081,9.62255373 9.25778371,8.58538265 8.18522666,8.12832813 C8.66449942,7.75799186 8.97314892,7.17754041 8.97314892,6.525 C8.97314892,5.40662338 8.06652554,4.5 6.94814892,4.5 Z M9.47939892,5.0625 L9.47939892,5.7375 C10.0696532,5.7375 10.5481489,6.21599567 10.5481489,6.80625 C10.5481489,7.39650433 10.0696532,7.875 9.47939892,7.875 L9.47939892,8.55 C10.5880137,8.55 11.5045613,9.37233726 11.651361,10.4406322 L11.6509718,10.4569843 C11.6509718,10.6433804 11.8020757,10.7944843 11.9884718,10.7944843 C12.1728418,10.7944843 12.3226827,10.6466474 12.3344785,10.4618968 C12.2317937,9.40890588 11.5598087,8.52274877 10.6305547,8.11605224 C10.9938747,7.79648694 11.2231489,7.3281434 11.2231489,6.80625 C11.2231489,5.84320347 10.4424455,5.0625 9.47939892,5.0625 Z M6.94814892,5.175 C7.69373333,5.175 8.29814892,5.77941559 8.29814892,6.525 C8.29814892,7.26653599 7.7002793,7.86843205 6.96028162,7.87494661 L6.943,7.875 L6.81813491,7.86882008 C6.13354819,7.80340381 5.59814892,7.22672651 5.59814892,6.525 C5.59814892,5.77941559 6.20256451,5.175 6.94814892,5.175 Z",
      id: "normal/user-group-circle-fill"
    }, null)])]), i("div", {
      class: t.em("item", "content")
    }, [i("span", {
      class: t.em("item", "type")
    }, [h("团队")]), i("span", {
      class: t.em("item", "type-divide")
    }, [h("/")]), i("span", {
      class: t.em("item", "personname"),
      title: e.name
    }, [e.name])])]), w = (e) => e.type === "organization" ? k(e) : e.type === "user" ? _(e) : R(e);
    K(() => r.value, () => {
      if (s.valueItem) {
        const e = r.data[s.valueItem];
        c.value = e;
      }
    }, {
      immediate: !0
    });
    const U = async () => {
      let e = null;
      (r.readonly || r.disabled) && (e = "fetch_reader");
      const a = await s.getServiceData("", r.data, e);
      a && a.data && (l.value = a.data.map((m) => ({
        ...m,
        type: "user_group"
      })));
    }, V = () => {
      if (!r.value || !r.data[s.valueItem])
        return null;
      const e = {};
      if (Object.keys(s.fillMap).some((a) => {
        if (s.fillMap[a] === r.value)
          return e.type = a, !0;
      }), e.type === "user") {
        const a = s.operatorMap.get(r.data[s.valueItem]);
        a && Object.assign(e, a, {
          name: a.text,
          avatar: a.data.iconurl
        });
      } else {
        const a = l.value.find((m) => m.id === r.data[s.valueItem]);
        a && Object.assign(e, a);
      }
      return i("div", {
        class: t.em("item", "readonly")
      }, [w(e)]);
    }, A = (e) => {
      v = e;
    }, Z = () => {
      if (!c.value)
        return;
      const e = l.value.find((a) => a.id === c.value);
      if (e)
        return w(e);
    }, T = () => {
      var e;
      return i("div", {
        class: t.e("select")
      }, [i(D("el-popover"), {
        trigger: "click",
        visible: d.value,
        "onUpdate:visible": (a) => d.value = a,
        width: (e = M.value) == null ? void 0 : e.offsetWidth
      }, {
        reference: () => i("div", {
          id: p,
          class: [t.em("select", "input"), t.is("focus", d.value)],
          ref: M
        }, [i("div", {
          class: t.em("select", "input-content")
        }, [Z()]), i("div", {
          class: t.em("select", "input-icon")
        }, [i(D("el-icon"), {
          class: t.is("reverse", d.value)
        }, {
          default: () => [i("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
          }, [i("path", {
            fill: "currentColor",
            d: "M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"
          }, null)])]
        })])]),
        default: () => i("div", {
          class: t.em("select", "list"),
          onMouseenter: () => A(!0),
          onMouseleave: () => A(!1)
        }, [l.value.map((a) => w(a))])
      })]);
    }, E = (e) => {
      e.target && e.target.id === p || v || (d.value = !1);
    };
    return W(async () => {
      if (await U(), (s.hasORG_M || r.readonly || r.disabled) && l.value.unshift({
        type: "organization",
        id: s.context.srforgid,
        name: s.context.srforgname
      }), s.showPerson && !r.readonly && !r.disabled && l.value.push({
        type: "user",
        id: s.context.srfpersonid,
        name: s.context.srfpersonname,
        avatar: s.context.avatar
      }), !r.value && !r.readonly && !r.disabled && l.value && l.value.length > 0) {
        if (s.params && s.params.srfdefaulttype) {
          const e = l.value.filter((a) => a.type === s.params.srfdefaulttype);
          e.length > 0 ? c.value = e[0].id : c.value = l.value[0].id;
        } else
          c.value = l.value[0].id;
        I();
      }
      window.addEventListener("pointerdown", E);
    }), $(() => {
      window.removeEventListener("pointerdown", E);
    }), {
      c: s,
      ns: t,
      renderSelect: T,
      renderReadOnlyState: V,
      showFormDefaultContent: F
    };
  },
  render() {
    return i("div", {
      class: [this.ns.b(), this.readonly || this.disabled ? this.ns.m("readonly") : "", this.ns.is("show-default", this.showFormDefaultContent)]
    }, [this.readonly || this.disabled ? this.renderReadOnlyState() : this.renderSelect()]);
  }
});
class oe extends H {
  constructor() {
    super(...arguments), n(this, "hasORG_M", !1), n(this, "showPerson", !1), n(this, "fillMap", {
      user: "user",
      user_group: "user_group",
      organization: "organization"
    }), n(this, "sort", ""), n(this, "interfaceName", ""), n(this, "valueItem", ""), n(this, "deACMode"), n(this, "keyName", "srfkey"), n(this, "textName", "srfmajortext"), n(this, "dataItems", []), n(this, "objectIdField", ""), n(this, "objectNameField", ""), n(this, "objectValueField", ""), n(this, "operatorMap", /* @__PURE__ */ new Map());
  }
  async onInit() {
    var o, t, s, c;
    super.onInit(), this.valueItem = ((o = this.model.valueItemName) == null ? void 0 : o.toLowerCase()) || "";
    const l = await ibiz.hub.getApp(this.context.srfappid);
    if (this.hasORG_M = l.authority.calcByResCode("ORG_M"), this.model.appDataEntityId && (this.model.appDEDataSetId && (this.interfaceName = this.model.appDEDataSetId), this.model.appDEACModeId && (this.deACMode = await q(
      this.model.appDEACModeId,
      this.model.appDataEntityId,
      this.context.srfappid
    ), this.deACMode))) {
      const { minorSortAppDEFieldId: d, minorSortDir: p } = this.deACMode;
      d && p && (this.sort = "".concat(d.toLowerCase(), ",").concat(p.toLowerCase())), this.deACMode.textAppDEFieldId && (this.textName = this.deACMode.textAppDEFieldId), this.deACMode.valueAppDEFieldId && (this.keyName = this.deACMode.valueAppDEFieldId), this.deACMode.deacmodeDataItems && (this.dataItems = [], this.deACMode.deacmodeDataItems.forEach(
        (v) => {
          v.id !== "value" && v.id !== "text" && this.dataItems.push(v);
        }
      ));
    }
    if (this.objectIdField = (t = this.model.objectIdField) == null ? void 0 : t.toLowerCase(), this.objectNameField = (s = this.model.objectNameField) == null ? void 0 : s.toLowerCase(), this.objectValueField = (c = this.model.objectValueField) == null ? void 0 : c.toLowerCase(), this.editorParams && this.editorParams.enablePerson && (this.showPerson = this.editorParams.enablePerson === "true"), this.editorParams && this.editorParams.fillMap)
      try {
        this.fillMap = JSON.parse(this.editorParams.fillMap);
      } catch (d) {
        this.fillMap = {
          user: "user",
          user_group: "user_group",
          organization: "organization"
        };
      }
    await this.getOperatorUserList();
  }
  /**
   * 加载实体数据集数据
   *
   * @param {string} query 模糊匹配字符串
   * @param {IData} data 表单数据
   * @returns {*}  {Promise<IHttpResponse<IData[]>>}
   * @memberof TeamPickerController
   */
  async getServiceData(o, t, s) {
    const { context: c, params: l } = this.handlePublicParams(
      t,
      this.context,
      this.params
    ), d = {};
    this.sort && !Object.is(this.sort, "") && Object.assign(d, { sort: this.sort }), o && Object.assign(d, { query: o }), Object.assign(d, { size: 1e3 });
    const p = se(l, d);
    if (s)
      return await ibiz.hub.getApp(this.context.srfappid).deService.exec(
        this.model.appDataEntityId,
        s,
        c,
        p
      );
    if (this.interfaceName)
      return await ibiz.hub.getApp(this.context.srfappid).deService.exec(
        this.model.appDataEntityId,
        this.interfaceName,
        c,
        p
      );
    throw new ae(this.model, "请配置实体和实体数据集");
  }
  /**
   * 获取操作用户列表
   *
   * @memberof PersonelSelectController
   */
  async getOperatorUserList() {
    const o = await ibiz.hub.getApp(this.context.srfappid);
    let t = [];
    t = await o.codeList.get(
      "SysOperator",
      this.context,
      this.params
    ), this.operatorMap = new Map(
      t.map((s) => [s.value, s])
    );
  }
}
class le {
  constructor() {
    n(this, "formEditor", "TeamPicker"), n(this, "gridEditor", "TeamPicker");
  }
  async createController(o, t) {
    const s = new oe(o, t);
    return await s.init(), s;
  }
}
const he = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(r) {
    r.component(L.name, L), G(
      "EDITOR_CUSTOMSTYLE_TEAM_PICKER",
      () => new le()
    );
  }
};
export {
  he as default
};
