import './assets/style.css';
import './assets/style.css';
import { PluginStaticResource as _e, registerEditorProvider as Be, EditorController as $e, getDeACMode as We } from "@ibiz-template/runtime";
import { defineComponent as oe, ref as u, computed as Ye, onBeforeMount as Ze, watch as ne, onMounted as de, nextTick as Ke, onUnmounted as qe, createVNode as a, resolveComponent as I, isVNode as Xe, createTextVNode as k } from "vue";
import { getDataPickerProps as Je, getEditorEmits as Ge, useNamespace as me, useClickOutside as Qe } from "@ibiz-template/vue3-util";
import { RuntimeModelError as ie } from "@ibiz-template/core";
import { mergeDeepLeft as le } from "ramda";
import { notNilEmpty as R } from "qx-util";
var et = Object.defineProperty, tt = (r, i, l) => i in r ? et(r, i, { enumerable: !0, configurable: !0, writable: !0, value: l }) : r[i] = l, n = (r, i, l) => (tt(r, typeof i != "symbol" ? i + "" : i, l), l);
const at = /* @__PURE__ */ oe({
  name: "VirtualList",
  props: {
    items: {
      // 数据源
      type: Array,
      default: () => []
    },
    itemHeight: {
      // 每行高度
      type: Number,
      default: 36
    },
    showNum: {
      // 可视数量
      type: Number,
      default: 20
    }
  },
  emits: ["scrollEvent"],
  setup(r, {
    emit: i
  }) {
    const l = me("team-select-virtual-list"), s = u(36), h = u(), d = u([]), c = u(0), p = u(0), g = u(0), f = u(0), E = () => {
      p.value = Math.floor(f.value / r.itemHeight), g.value = p.value + r.showNum, d.value = r.items.slice(p.value, g.value);
      const v = f.value - f.value % r.itemHeight;
      c.value = v;
    }, y = () => {
      f.value = h.value.scrollTop, E(), w(s.value, f.value);
    }, w = (v, M) => {
      i("scrollEvent", v, M);
    };
    return de(() => {
      setTimeout(() => {
        scroll();
      }, 1e3);
    }), ne(() => r.items, () => {
      s.value = r.itemHeight * r.items.length, E();
    }, {
      immediate: !0,
      deep: !0
    }), {
      ns: l,
      contentHeight: s,
      showList: d,
      contentBox: h,
      top: c,
      onScroll: y
    };
  },
  render() {
    return a("div", {
      ref: "contentBox",
      class: this.ns.b(),
      onScroll: () => this.onScroll()
    }, [a("div", {
      class: this.ns.e("container"),
      style: "height:".concat(this.contentHeight, "px;")
    }, [a("div", {
      class: this.ns.e("content"),
      style: "top:".concat(this.top, "px;")
    }, [this.showList.map((r, i) => a("div", {
      key: i,
      class: this.ns.m("item")
    }, [this.$slots.default ? this.$slots.default({
      ...r,
      // eslint-disable-next-line object-shorthand
      index: i
    }) : r.name]))])])]);
  }
}), j = new _e(import.meta.url);
function st(r) {
  return typeof r == "function" || Object.prototype.toString.call(r) === "[object Object]" && !Xe(r);
}
const re = /* @__PURE__ */ oe({
  name: "TeamSelect",
  props: Je(),
  emits: Ge(),
  setup(r, {
    emit: i
  }) {
    const l = me("team-select"), s = r.controller, h = [{
      name: "成员",
      label: "member"
    }, {
      name: "部门",
      label: "department"
    }, {
      name: "团队",
      label: "team"
    }], d = u({
      member: !1,
      department: !1,
      team: !1
    }), c = () => a("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false"
    }, [a("g", {
      id: "azvnormal/user-bold",
      "stroke-width": "1",
      "fill-rule": "evenodd"
    }, [a("path", {
      d: "M8 .828a4.172 4.172 0 0 1 2.548 7.476A6.696 6.696 0 0 1 14.7 14.5a.7.7 0 0 1-1.4 0 5.3 5.3 0 0 0-10.595-.222L2.7 14.5a.7.7 0 0 1-1.4 0l.006-.279a6.7 6.7 0 0 1 4.146-5.92A4.172 4.172 0 0 1 8 .828zm0 1.344a2.828 2.828 0 0 0-.326 5.637 6.797 6.797 0 0 1 .651-.002A2.828 2.828 0 0 0 8 2.172z",
      id: "azv形状结合"
    }, null)])]), p = () => a("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false"
    }, [a("g", {
      id: "aqo1.Base基础/1.icon图标/2.normal/部门",
      "stroke-width": "1",
      "fill-rule": "evenodd"
    }, [a("path", {
      d: "M9 1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-.39l-.016 2.138H11.5a2.1 2.1 0 0 1 2.095 1.95l.005.15V11h.4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h.4V9.238a.9.9 0 0 0-.787-.893l-.113-.007h-7a.9.9 0 0 0-.893.787l-.007.113V11H4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h.4V9.238a2.1 2.1 0 0 1 1.95-2.094l.15-.006h2.894L7.41 5H7a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h2zm4.8 11.2h-1.6v1.6h1.6v-1.6zm-10 0H2.2v1.6h1.6v-1.6zm5-10H7.2v1.6h1.6V2.2z",
      id: "aqo形状结合"
    }, null)])]), g = () => a("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false"
    }, [a("g", {
      id: "azznormal/user-group",
      "stroke-width": "1",
      "fill-rule": "evenodd"
    }, [a("path", {
      d: "M8.2 8.85a5.602 5.602 0 0 1 3.399 5.04.6.6 0 1 1-1.19.11H10.4a4.4 4.4 0 0 0-8.8-.06l.003.06a.6.6 0 0 1-1.2 0H.4c0-2.311 1.4-4.296 3.4-5.15a3.6 3.6 0 1 1 4.402 0zM6 8.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8zm4.5 1.2V8.4a1.9 1.9 0 0 0 0-3.8V3.4a3.1 3.1 0 0 1 2.048 5.428A5.104 5.104 0 0 1 15.576 13h-.016a.6.6 0 1 1-1.198-.048A3.9 3.9 0 0 0 10.5 9.6zM6.632 13H5.424h1.208z",
      id: "azz形状结合"
    }, null)])]), f = (e) => {
      if (e === "member")
        return c();
      if (e === "department")
        return p();
      if (e === "team")
        return g();
    }, E = () => a("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false"
    }, [a("g", {
      id: "abbnavigation/angle-right",
      "stroke-width": "1",
      "fill-rule": "evenodd"
    }, [a("path", {
      d: "M7.978 11.498l-.005.005L2.3 5.831 3.13 5l4.848 4.848L12.826 5l.83.831-5.673 5.672-.005-.005z",
      id: "abb形状结合",
      transform: "rotate(-90 7.978 8.252)"
    }, null)])]), y = () => a("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false"
    }, [a("g", {
      id: "azznormal/user-group",
      "stroke-width": "1",
      "fill-rule": "evenodd"
    }, [a("path", {
      d: "M8.2 8.85a5.602 5.602 0 0 1 3.399 5.04.6.6 0 1 1-1.19.11H10.4a4.4 4.4 0 0 0-8.8-.06l.003.06a.6.6 0 0 1-1.2 0H.4c0-2.311 1.4-4.296 3.4-5.15a3.6 3.6 0 1 1 4.402 0zM6 8.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8zm4.5 1.2V8.4a1.9 1.9 0 0 0 0-3.8V3.4a3.1 3.1 0 0 1 2.048 5.428A5.104 5.104 0 0 1 15.576 13h-.016a.6.6 0 1 1-1.198-.048A3.9 3.9 0 0 0 10.5 9.6zM6.632 13H5.424h1.208z",
      id: "azz形状结合"
    }, null)])]), w = () => a("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false"
    }, [a("g", {
      id: "agwtips/close-circle-bold-fill",
      "stroke-width": "1",
      "fill-rule": "evenodd"
    }, [a("path", {
      d: "M0 8c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8zm6.296.064l-2.298 2.298 1.768 1.768 2.298-2.298 2.298 2.298 1.768-1.768-2.298-2.298 2.298-2.298-1.768-1.768-2.298 2.298-2.298-2.298-1.768 1.768 2.298 2.298z",
      id: "agw形状结合"
    }, null)])]), v = u("member"), M = u(!1), H = u(!1), he = u(""), S = u([]), C = u([]), D = u([]), O = u(/* @__PURE__ */ new Map()), T = u(/* @__PURE__ */ new Map()), ce = u(), A = u(), K = u(!1), ue = u(), N = u(""), _ = u([]), B = u([]), $ = u(), P = u(null);
    let z;
    const q = u([]), pe = Ye(() => !!(r.controlParams && r.controlParams.editmode === "hover" && !r.readonly)), ve = () => {
      const e = document.documentElement;
      return e ? getComputedStyle(e).getPropertyValue("--ibiz-color-primary") : null;
    }, ge = (e) => /[\u4E00-\u9FA5]/.test(e), fe = (e) => /[\u4e00-\u9fa5]+.*[a-zA-Z]+|[a-zA-Z]+.*[\u4e00-\u9fa5]+/.test(e), X = (e) => {
      if (!e)
        return "";
      let t = 0;
      for (let L = 0; L < e.length; L++)
        if (ge(e))
          t = e.charCodeAt(L) + ((t << 5) - t), t = t & t;
        else {
          const He = e.charCodeAt(L);
          t += He.toString(16);
        }
      const o = String(t).substring(0, 6);
      let m = parseInt(o.substring(0, 2), 16), b = parseInt(o.substring(2, 4), 16), x = parseInt(o.substring(4, 6), 16);
      m < 0 && (m = 10), b < 0 && (b = 10), x < 0 && (x = 10);
      const se = "#".concat(m.toString(16).padStart(2, "0")).concat(b.toString(16).padStart(2, "0")).concat(x.toString(16).padStart(2, "0"));
      return se === "#FFFFFF" && ve() || se;
    }, be = (e) => {
      if (e && e.toString().length < 2)
        return e;
      if (e && e.toString().length >= 2) {
        if (fe(e)) {
          const t = e.split("").find((m) => /[a-zA-Z]/.test(m)) || "", o = e.split("").find((m) => /[\u4E00-\u9FA5]/.test(m)) || "";
          return "".concat(t).concat(o).toLowerCase();
        }
        return /[a-zA-Z]/.test(e) ? e.split("").filter((t) => /[a-zA-Z]/.test(t)).slice(0, 2).join("").toUpperCase() : /[\u4E00-\u9FA5]/.test(e) ? e.split("").filter((t) => /[\u4E00-\u9FA5]/.test(t)).slice(-2).join("") : e.replaceAll(" ", "").substring(0, 2);
      }
    }, we = (e) => {
      var t;
      return ((t = P.value) == null ? void 0 : t.id) === e ? a("div", {
        class: l.bem("select-modal", "personel-list", "icon")
      }, [a("i", {
        class: "fa fa-check",
        "aria-hidden": "true"
      }, null)]) : null;
    }, Me = (e) => {
      console.log("头像加载失败"), q.value.push(e);
    }, Ee = (e) => {
      if (!e)
        return null;
      const t = JSON.parse(e);
      if (t.length === 0)
        return null;
      const {
        downloadUrl: o
      } = ibiz.util.file.calcFileUpDownUrl(s.context, s.params, r.data, s.editorParams), m = o.replace("%fileId%", t[0].id);
      return a("img", {
        class: l.bem("select-modal", "personel-list", "avatar"),
        src: m,
        onError: () => Me(e),
        alt: ""
      }, null);
    }, J = (e, t) => s.operatorMap && s.operatorMap.get(e) && s.operatorMap.get(e).data.iconurl && !q.value.includes(s.operatorMap.get(e).data.iconurl) ? Ee(s.operatorMap.get(e).data.iconurl) : be(t), W = async (e, t, o = !1) => {
      if (e.preventDefault(), e.stopPropagation(), console.log("选中数据", t), d.value.team = !1, d.value.department = !1, d.value.member = !1, o) {
        const m = T.value.get(t.id);
        m.value = !0, i("change", t.id, s.valueItem), i("change", t.name), s.teamValueItem && i("change", 30, s.teamValueItem);
      } else
        G(), v.value === "member" || v.value === "team" ? i("change", t[s.userFilterMap.id], s.valueItem) : i("change", t[s.deptFilterMap.id], s.valueItem), v.value === "member" || v.value === "team" ? i("change", t[s.userFilterMap.name]) : i("change", t[s.deptFilterMap.name]), s.teamValueItem && i("change", 20, s.teamValueItem);
      N.value = "", A.value.handleClose();
    };
    Ze(async () => {
      await ae();
      const e = Z(r.data[s.valueItem]);
      e === "team" ? P.value = {
        dataType: "team",
        name: r.value
      } : e === "member" && (P.value = {
        name: r.value,
        [s.userFilterMap.id]: r.data[s.valueItem],
        [s.deptFilterMap.id]: r.data[s.valueItem]
      });
    });
    const G = () => {
      Array.from(T.value.keys()).forEach((e) => {
        const t = T.value.get(e);
        t && (t.value = !1);
      });
    }, Q = (e = !1) => {
      N.value = "", d.value.team = !1, d.value.department = !1, d.value.member = !1, G(), i("change", null, s.valueItem), i("change", null);
    }, F = (e, t = !0, o = !0) => {
      const m = v.value === "member" || v.value === "team" ? e[s.userFilterMap.name] || e.name : e[s.deptFilterMap.name] || e.name, b = v.value === "member" || v.value === "team" ? e[s.userFilterMap.id] : e[s.deptFilterMap.id];
      return a("div", {
        class: [
          l.bem("select-modal", "personel-list", "item"),
          o ? "isShowPadding" : ""
          // ns.is('selected', selectedPersonnel.value?.id === userid),
        ],
        onClick: (x) => W(x, e)
      }, [a("div", {
        class: l.bem("select-modal", "personel-list", "text")
      }, [a("div", {
        class: l.bem("select-modal", "personel-list", "text-img"),
        style: "background-color:".concat(X(m))
      }, [J(b, m)]), a("div", {
        class: l.bem("select-modal", "personel-list", "text-label")
      }, [m]), t && b === s.context.srfuserid ? a("div", {
        class: l.bem("select-modal", "personel-list", "myself")
      }, [k("我自己")]) : null]), t && we(b)]);
    }, Ae = (e) => {
      const t = O.value.get(e.id);
      return a("div", {
        class: [
          l.bem("select-modal", "personel-list", "item-team")
          // ns.is('selected', refValue.value === userid),
        ],
        onClick: (o) => W(o, e, !0)
      }, [a("img", {
        src: "".concat(j.dir("assets/images/svg/user-group-avatar.svg")),
        style: "margin-right:6px",
        alt: ""
      }, null), e.name, t && " · ", t && t.length]);
    }, ye = (e, t) => {
      const {
        context: o,
        params: m
      } = s;
      return a(I("iBizControlShell"), {
        class: l.b("panel-item"),
        data: e,
        modelData: t,
        context: o,
        params: m
      }, null);
    }, Pe = (e, t) => {
      const o = u();
      return a(I("el-popover"), {
        ref: o,
        target: "hover",
        placement: "right",
        offset: 24,
        width: "auto"
      }, {
        reference: () => F(e),
        default: () => ye(e, t)
      });
    }, ee = (e) => {
      var t;
      const o = e, m = (t = s.deACMode) == null ? void 0 : t.itemLayoutPanel;
      return a(at, {
        items: o,
        itemHeight: 36,
        class: [
          l.be("select-modal", "personel-list"),
          l.be("select-modal", "personel-list-".concat(v.value))
          // ns.is('no-solider-tab', !c.isShowTab && actions.length > 0),
        ]
      }, {
        default: (b) => m ? Pe(b, m) : F(b, !0)
      });
    }, Ie = (e, t) => {
      e.forEach((o) => {
        const m = S.value.findIndex((b) => b[t] === o[t]);
        m > -1 ? S.value.splice(m, 1, o) : S.value.push(o);
      });
    }, Se = async (e = !1) => {
      M.value = !0;
      const t = {};
      t.page = s.page;
      try {
        const o = await s.loadMore(r.data, "member", t);
        o && (S.value.length === 0 ? S.value = o.data : Ie(o.data, s.userFilterMap.id));
      } catch (o) {
        M.value = !1;
      }
      M.value = !1;
    }, Te = async (e = !1) => {
      M.value = !0;
      const t = {};
      t.page = s.deptpage;
      try {
        const o = await s.loadMore(r.data, "department", t);
        o && (C.value.length === 0 ? C.value = o.data : C.value.push(...o.data));
      } catch (o) {
        M.value = !1;
      }
      M.value = !1;
    }, xe = async (e) => {
      if (e !== "team")
        return;
      M.value = !0;
      const t = {};
      try {
        const o = await s.loadMore(r.data, "team", t);
        o && (D.value = o == null ? void 0 : o.data, D.value.forEach((m) => {
          if (T.value.get(m.id) === void 0) {
            const b = u(!1);
            T.value.set(m.id, b);
          }
        }));
      } catch (o) {
        M.value = !1;
      }
      M.value = !1;
    }, Ce = async (e, t) => {
      const o = {}, m = await s.loadTeamMember(r.data, t.id, o);
      O.value.get(t.id) || m && O.value.set(t.id, m.data), A.value.handleOpen();
    }, De = (e) => {
      Array.from(T.value.keys()).filter((t) => t !== e).forEach((t) => {
        const o = T.value.get(t);
        o && (o.value = !1);
      });
    }, Oe = async (e, t) => {
      e.preventDefault(), e.stopPropagation(), T.value.get(t.id).value ? Q(!0) : (await W(e, t, !0), De(t.id)), d.value.team = !1, d.value.department = !1, d.value.member = !1, A.value.handleClose();
    }, Y = async (e) => {
      v.value = e, v.value === "member" && S.value.length === 0 && (s.resetUserState(), await Se()), v.value === "department" && C.value.length === 0 && (s.resetDeptState(), await Te()), await xe(e);
    }, te = (e, t) => {
      e.stopPropagation(), H.value = t, A.value.handleOpen();
    }, Fe = () => a("div", {
      class: l.be("select-modal", "deptpersonel"),
      onClick: () => {
        A.value.handleOpen();
      }
    }, [a("div", {
      class: l.bem("select-modal", "deptpersonel", "dept")
    }, [a("div", {
      class: "collpase-icon"
    }, [H.value ? a("i", {
      class: "fa fa-angle-right",
      "aria-hidden": "true",
      onClick: (e) => te(e, !1)
    }, null) : a("i", {
      class: "fa fa-angle-down",
      "aria-hidden": "true",
      onClick: (e) => te(e, !0)
    }, null)]), a("img", {
      src: "".concat(j.dir("assets/images/svg/org.svg"))
    }, null), a("span", null, ["".concat(s.context.srfusername, "的团队")]), a("span", null, [k("·")]), a("span", null, [s.depttotal])]), H.value ? null : a("div", {
      class: l.bem("select-modal", "deptpersonel", "dept-person")
    }, [ee(C.value)])]), Ue = async (e) => {
      M.value = !0, _.value = [], B.value = [];
      try {
        const t = {};
        Object.assign(t, {
          query: e,
          size: 1e3
        });
        const o = await s.getServiceData("member", r.data, t), m = await s.getServiceData("team", r.data, t);
        o && (o.data.forEach((b) => {
          Object.keys(s.userFilterMap).forEach((x) => {
            b[x] = b[s.userFilterMap[x]];
          });
        }), _.value = o.data, M.value = !1), m && (B.value = m.data);
      } catch (t) {
        M.value = !1;
      }
      A.value.handleOpen();
    }, Ne = (e) => {
      clearTimeout($.value), $.value = setTimeout(() => {
        e && Ue(e), clearTimeout($.value);
      }, 300);
    }, ze = () => a(I("el-collapse"), {
      class: l.e("collapse")
    }, {
      default: () => [D.value.length === 0 ? a("div", {
        class: l.e("no-team")
      }, [k("暂无团队")]) : D.value.map((e) => {
        const t = O.value.get(e.id), o = T.value.get(e.id);
        return a(I("el-collapse-item"), {
          class: l.e("collapse-item"),
          name: e.id,
          title: e.caption,
          onClick: (m) => Ce(m, e)
        }, {
          default: () => a("div", null, [t && t.length > 0 ? t.map((m) => F(m, !0)) : a("div", {
            class: l.e("noteamItem")
          }, [k("暂无人员")])]),
          title: () => a("div", {
            class: l.e("collapse-item-checkbox-wrapper")
          }, [a(I("el-checkbox"), {
            class: l.e("collapse-item-checkbox"),
            size: "large",
            modelValue: o.value,
            "onUpdate:modelValue": (m) => o.value = m,
            onClick: (m) => Oe(m, e)
          }, null), a("img", {
            src: "".concat(j.dir("assets/images/svg/user-group-avatar.svg")),
            style: "margin-right:6px",
            alt: ""
          }, null), e.name, t && " · ", t && t.length])
        });
      })]
    }), Ve = (e) => e === "department" ? Fe() : e === "member" ? ee(S.value) : e === "team" ? ze() : a("div", null, [e]), Le = () => !N.value && P.value ? P.value.dataType === "team" ? a("div", {
      class: l.e("personnel-team")
    }, [a("div", {
      class: l.e("personnel-team-svg")
    }, [y()]), a("div", null, [P.value.name])]) : F(P.value, !1, !1) : null, ke = (e) => {
      A.value && A.value.$el && (V.value = A.value.$el.clientWidth), K.value = e;
    }, ae = async () => {
      r.readonly || r.disabled || (await Y("member"), await Y("department"), await Y("team"), v.value = "member");
    }, Re = (e, t) => {
      e.stopPropagation(), v.value = t.label, d.value[t.label] = !d.value[t.label], ["member", "department", "team"].filter((o) => o !== t.label).forEach((o) => {
        d.value[o] = !1;
      });
    }, U = u(), je = u(), Z = (e) => D.value.findIndex((t) => t.id === e) >= 0 ? "team" : S.value.findIndex((t) => t.id === e) >= 0 ? "member" : "";
    ne(() => r.value, (e) => {
      (e || e === null || e === void 0) && (e ? Z(r.data[s.valueItem]) === "team" ? P.value = {
        dataType: "team",
        name: e
      } : P.value = {
        name: e,
        [s.userFilterMap.id]: r.data[s.valueItem],
        [s.deptFilterMap.id]: r.data[s.valueItem]
      } : P.value = null);
    }, {
      immediate: !0
    });
    const V = u(0);
    return de(() => {
      U.value && (z = Qe(U, async (e) => {
        if (U.value && !U.value.contains(e.target)) {
          let t = [];
          e.target && e.target.className && typeof e.target.className == "string" && (t = e.target.className.split(" ")), t.findIndex((o) => o === "ibiz-team-select__popover-item") === -1 && (d.value.team = !1, d.value.department = !1, d.value.member = !1);
        }
      })), V.value = A.value.$el.clientWidth;
    }), Ke(() => {
      V.value = A.value.$el.clientWidth;
    }), qe(() => {
      z && z.stop && z.stop();
    }), {
      ns: l,
      c: s,
      curValue: he,
      items: S,
      dropDownItem: h,
      numberSvg: c,
      departmentSvg: p,
      teamSvg: g,
      renderItemSvg: f,
      rightArrowSvg: E,
      deleteSvg: w,
      renderItemContent: Ve,
      showFormDefaultContent: pe,
      searchValue: N,
      handleSearch: Ne,
      romateData: _,
      renderPersonItem: F,
      selectedPersonnel: P,
      searchRef: ce,
      visibleChange: ke,
      dropdownRef: A,
      dropdownClick: ae,
      popoverRef: ue,
      teamMenberItems: O,
      renderPersonnel: Le,
      renderTeamItem: Ae,
      dropDownItemVisible: d,
      dropdownItemClick: Re,
      romateTeamData: B,
      dropdownVisible: K,
      pxx: U,
      dropdownMenu: je,
      handleFocus: (e) => {
        d.value.team = !1, d.value.department = !1, d.value.member = !1;
      },
      clearSelect: Q,
      readOnlyItem: () => r.value ? Z(r.data[s.valueItem]) === "team" ? a("div", {
        class: l.e("personnel-team")
      }, [a("div", {
        class: l.e("personnel-team-svg")
      }, [y()]), a("div", null, [r.value])]) : a("div", {
        class: l.bem("select-modal", "personel-list", "text")
      }, [a("div", {
        class: l.bem("select-modal", "personel-list", "text-img"),
        style: "background-color:".concat(X(r.value))
      }, [J(r.data[s.valueItem], r.value)]), a("div", {
        class: l.bem("select-modal", "personel-list", "text-label")
      }, [r.value])]) : "未设置",
      width: V
    };
  },
  render() {
    return a("div", {
      class: [this.ns.b()]
    }, [this.$props.readonly || this.$props.disabled ? this.readOnlyItem() : a(I("el-dropdown"), {
      class: [this.ns.e("dropdown")],
      ref: "dropdownRef",
      "popper-class": this.ns.e("popover"),
      onVisibleChange: this.visibleChange,
      trigger: "click",
      "hide-on-click": !0
    }, {
      default: () => a("div", {
        class: [this.ns.e("dropdown-input")]
      }, [a(I("el-input"), {
        class: [this.ns.e("search-input"), this.searchValue || this.selectedPersonnel ? "hasValue" : ""],
        ref: "searchRef",
        modelValue: this.searchValue,
        "onUpdate:modelValue": (r) => this.searchValue = r,
        placeholder: this.selectedPersonnel ? "" : "选择评审人",
        onInput: (r) => this.handleSearch(r),
        onFocus: this.handleFocus
      }, {
        suffix: () => a("div", {
          class: [this.ns.e("dropdown-input-suffix")]
        }, [a("img", {
          class: [this.ns.e("search-arrow"), this.dropdownVisible ? "isopen" : ""],
          src: "".concat(j.dir("assets/images/svg/arrow.svg")),
          alt: ""
        }, null), a("div", {
          class: [this.ns.e("search-delete")],
          onClick: (r) => {
            r.stopPropagation(), this.clearSelect();
          }
        }, [this.deleteSvg()])]),
        prefix: () => a("div", {
          class: [this.ns.e("dropdown-input-prefix"), this.dropdownVisible ? "dark" : ""]
        }, [this.renderPersonnel()])
      })]),
      dropdown: () => {
        let r;
        return this.searchValue ? a(I("el-dropdown-menu"), null, {
          default: () => [this.romateData.length > 0 && this.dropDownItem.map((i) => {
            if (i.label === "member")
              return a("div", {
                class: this.ns.e("popover-item"),
                style: this.width ? "width:".concat(this.width, "px") : "pointer-events: none;"
              }, [a("div", {
                class: this.ns.e("popover-item-center")
              }, [a("div", {
                class: this.ns.e("popover-item-name")
              }, [i.name])])]);
          }), this.romateData.map((i) => a("div", {
            class: this.ns.e("search-romate-item")
          }, [this.renderPersonItem(i, !1, !1)])), this.romateTeamData.length > 0 && this.dropDownItem.map((i) => {
            if (i.label === "team")
              return a("div", {
                class: this.ns.e("popover-item"),
                style: this.width ? "width:".concat(this.width, "px") : "pointer-events: none;"
              }, [a("div", {
                class: this.ns.e("popover-item-center")
              }, [a("div", {
                class: this.ns.e("popover-item-name")
              }, [i.name])])]);
          }), this.romateTeamData.map((i) => a("div", {
            class: this.ns.e("search-romate-item")
          }, [this.renderTeamItem(i)]))]
        }) : a(I("el-dropdown-menu"), null, st(r = this.dropDownItem.map((i) => a(I("el-popover"), {
          trigger: "click",
          placement: "right",
          width: "380",
          "show-after": 100,
          "popper-class": [this.ns.e("popover-content"), i.label],
          ref: "popoverRef",
          "popper-options": {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [110, -10]
                }
              },
              // 设置偏移量
              {
                name: "preventOverflow",
                options: {
                  padding: 5
                }
              }
              // 防止溢出时的设置
            ]
          },
          visible: this.dropDownItemVisible[i.label]
        }, {
          reference: () => a("div", {
            class: this.ns.e("popover-item"),
            style: this.width ? "width:".concat(this.width, "px") : "",
            onClick: (l) => this.dropdownItemClick(l, i),
            ref: "dropdownMenu"
          }, [a("div", {
            class: this.ns.e("popover-item-center")
          }, [a("div", {
            class: this.ns.e("popover-item-left")
          }, [this.renderItemSvg(i.label)]), a("div", {
            class: this.ns.e("popover-item-name")
          }, [i.name])]), a("div", {
            class: this.ns.e("popover-item-right")
          }, [this.rightArrowSvg()])]),
          default: () => a("div", {
            onClick: (l) => {
              this.dropdownRef.handleOpen();
            },
            class: [this.ns.e("popover-item-content"), i.label],
            ref: "pxx"
          }, [this.renderItemContent(i.label)])
        }))) ? r : {
          default: () => [r]
        });
      }
    })]);
  }
});
class it extends $e {
  constructor() {
    super(...arguments), n(this, "operatorMap", /* @__PURE__ */ new Map()), n(this, "total", 0), n(this, "currentNumber", -1), n(this, "page", 0), n(this, "deptpage", 0), n(this, "deptcurrentNumber", -1), n(this, "depttotal", 0), n(this, "size", 20), n(this, "multiple", !1), n(this, "isAddSymbol", !1), n(this, "separator", ","), n(this, "pickupView", null), n(this, "linkView", null), n(this, "userFilterMap", {
      id: "id",
      name: "name"
    }), n(this, "deptFilterMap", {
      id: "id",
      name: "name"
    }), n(this, "isShowTab", !0), n(this, "valueItem", ""), n(this, "keyName", "srfkey"), n(this, "textName", "srfmajortext"), n(this, "interfaceName", ""), n(this, "sort", ""), n(this, "noAC", !1), n(this, "noButton", !1), n(this, "deACMode"), n(this, "dataItems", []), n(this, "objectIdField", ""), n(this, "objectNameField", ""), n(this, "objectValueField", ""), n(this, "userUrl", ""), n(this, "deptUrl", ""), n(this, "teamUrl", ""), n(this, "teamMemberUrl", ""), n(this, "teamValueItem", ""), n(this, "copyUserUrl", ""), n(this, "copyDeptUrl", ""), n(this, "copyTeamUrl", ""), n(this, "copyTeamMemberUrl", ""), n(this, "userMethod", "post"), n(this, "deptMethod", "post"), n(this, "teamMethod", "post"), n(this, "teamMemberMethod", "post"), n(this, "contextReg", /\$\{context.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g), n(this, "dataReg", /\$\{data.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g), n(this, "paramsReg", /\$\{params.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g), n(this, "defaultSelCurUser", !1), n(this, "valueType", "OBJECTS"), n(this, "attentionTypeField", "type"), n(this, "selfFillMap", {}), n(this, "defaultAttentionValue", ""), n(this, "showNameText", !0), n(this, "showNameTip", !1);
  }
  async onInit() {
    var i, l, s, h;
    if (super.onInit(), this.initDefaultAttribute(), this.valueItem = ((i = this.model.valueItemName) == null ? void 0 : i.toLowerCase()) || "", this.initParams(), await this.getOperatorUserList(), this.model.appDataEntityId && (this.model.appDEDataSetId && (this.interfaceName = this.model.appDEDataSetId), this.model.appDEACModeId && (this.deACMode = await We(
      this.model.appDEACModeId,
      this.model.appDataEntityId,
      this.context.srfappid
    ), this.deACMode))) {
      const { minorSortAppDEFieldId: c, minorSortDir: p } = this.deACMode;
      c && p && (this.sort = "".concat(c.toLowerCase(), ",").concat(p.toLowerCase())), this.deACMode.textAppDEFieldId && (this.textName = this.deACMode.textAppDEFieldId), this.deACMode.valueAppDEFieldId && (this.keyName = this.deACMode.valueAppDEFieldId), this.deACMode.deacmodeDataItems && (this.dataItems = [], this.deACMode.deacmodeDataItems.forEach(
        (g) => {
          g.id !== "value" && g.id !== "text" && this.dataItems.push(g);
        }
      ));
    }
    const d = [
      "PICKEREX_DROPDOWNVIEW",
      "PICKEREX_DROPDOWNVIEW_LINK",
      "PICKUPVIEW"
    ];
    this.model.editorType && d.includes(this.model.editorType), this.objectIdField = (l = this.model.objectIdField) == null ? void 0 : l.toLowerCase(), this.objectNameField = (s = this.model.objectNameField) == null ? void 0 : s.toLowerCase(), this.objectValueField = (h = this.model.objectValueField) == null ? void 0 : h.toLowerCase();
  }
  /**
   * 初始化字段默认属性
   */
  initDefaultAttribute() {
    this.model.valueType && (this.valueType = this.model.valueType);
  }
  /**
   * 初始化noAc和noButton
   */
  initParams() {
    var i, l, s, h, d, c, p, g;
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
    }
    if (this.userUrl = this.editorParams.URL, this.deptUrl = this.editorParams.DEPTURL, this.teamUrl = this.editorParams.TEAMURL, this.teamMemberUrl = this.editorParams.TEAMMEMBERURL, this.userMethod = this.editorParams.USERMETHOD || "post", this.deptMethod = this.editorParams.DEPTMETHOD || "post", this.teamMethod = this.editorParams.TEAMMETHOD || "post", this.teamMemberMethod = this.editorParams.TEAMMEMBERURL || "post", this.teamValueItem = (i = this.editorParams) == null ? void 0 : i.TEAMTYPEFIELD, this.multiple = this.editorParams.MULTIPLE === "true", this.defaultSelCurUser = this.editorParams.DEFAULTSELCURUSER === "true", this.separator = this.editorParams.SEPARATOR || ",", this.isAddSymbol = this.editorParams.ISADDSYMBOL === "true" && this.multiple === !0, this.isShowTab = this.editorParams.ISSHOWTAB !== "false", (l = this.editorParams) != null && l.VALUETYPE && (this.valueType = (s = this.editorParams) == null ? void 0 : s.VALUETYPE), (h = this.editorParams) != null && h.DEFAULTATNVALUE && (this.defaultAttentionValue = (d = this.editorParams) == null ? void 0 : d.DEFAULTATNVALUE), (c = this.editorParams) != null && c.VALUEITEMNAME && (this.valueItem = (p = this.editorParams) == null ? void 0 : p.VALUEITEMNAME), this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, "SELFFILLMAP"))
      try {
        const f = JSON.parse((g = this.editorParams) == null ? void 0 : g.SELFFILLMAP);
        Object.assign(this.selfFillMap, f);
      } catch (f) {
        this.selfFillMap = {};
      }
    if (this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, "USERMAP"))
      try {
        const f = JSON.parse(this.editorParams.USERMAP);
        Object.assign(this.userFilterMap, f);
      } catch (f) {
        this.userFilterMap = {
          id: "id",
          name: "name"
        };
      }
    if (this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, "DEPTMAP"))
      try {
        const f = JSON.parse(this.editorParams.DEPTMAP);
        Object.assign(this.deptFilterMap, f);
      } catch (f) {
        this.deptFilterMap = {
          id: "id",
          name: "name"
        };
      }
    this.editorParams.SHOWNAMETEXT && (this.showNameText = this.toBoolean(this.editorParams.SHOWNAMETEXT)), this.editorParams.SHOWNAMETIP && (this.showNameTip = this.toBoolean(this.editorParams.SHOWNAMETIP));
  }
  /**
   * 重置状态
   */
  resetState() {
    this.resetUserState(), this.resetDeptState();
  }
  /**
   * 重置全部人员分类的状态
   */
  resetUserState() {
    this.total = 0, this.currentNumber = -1, this.page = 0, this.copyUserUrl = "";
  }
  /**
   * 重置部门人员分类的状态
   */
  resetDeptState() {
    this.deptpage = 0, this.depttotal = 0, this.deptcurrentNumber = -1, this.copyDeptUrl = "";
  }
  /**
   * 加载更多
   */
  async loadMore(i, l, s = {}) {
    if (l === "member") {
      const h = await this.getServiceData(l, i, s);
      if (h)
        return this.page += 1, this.currentNumber < 0 && (this.currentNumber += 1), this.currentNumber += this.size, this.total = h.total ? Number(h.total) : Number(h.headers["x-total"]), h.data.forEach((d) => {
          Object.keys(this.userFilterMap).forEach((c) => {
            d[c] = d[this.userFilterMap[c]];
          });
        }), h;
    } else if (l === "department" && this.deptcurrentNumber < this.depttotal) {
      const h = await this.getServiceData(l, i, s);
      if (h)
        return this.deptpage += 1, this.deptcurrentNumber < 0 && (this.deptcurrentNumber += 1), this.deptcurrentNumber += this.size, this.depttotal = h.total ? Number(h.total) : Number(h.headers["x-total"]), h.data.forEach((d) => {
          Object.keys(this.deptFilterMap).forEach((c) => {
            d[c] = d[this.deptFilterMap[c]];
          });
        }), h;
    } else if (l === "team")
      return await this.getServiceData(l, i, s);
  }
  async getServiceDataTeamMember(i, l, s) {
    const { context: h, params: d } = this.handlePublicParams(
      l,
      this.context,
      this.params
    ), c = {
      n_owner_type_eq: "GROUP",
      n_owner_id_eq: i
    };
    this.sort && !Object.is(this.sort, "") && Object.assign(c, { sort: this.sort }), Object.assign(c, { size: this.size }), s && Object.assign(c, s);
    const p = le(d, c);
    let g = "";
    const f = this.fill(
      this.teamMemberUrl,
      h,
      { ...d, teamid: i },
      l
    ).replaceAll("//", "/");
    this.copyTeamMemberUrl = f;
    let E = "post";
    const y = {};
    if (g = f, E = this.teamMethod.toLowerCase(), E === "get" ? Object.assign(y, { method: E, params: p }) : Object.assign(y, { method: E, data: p }), g)
      return await ibiz.net.request(g, y);
    throw new ie(this.model, "请配置数据接口地址");
  }
  /**
   * 团队成员
   */
  async loadTeamMember(i, l, s = {}) {
    const h = await this.getServiceDataTeamMember(l, i, s);
    if (h)
      return h;
  }
  /**
   * 填充字符串中的数据
   *
   * @author chitanda
   * @date 2021-04-23 20:04:17
   * @static
   * @param {string} str
   * @param {*} [context]
   * @param {*} [data]
   * @return {*}  {string}
   */
  fill(i = "", l, s, h) {
    if (R(i)) {
      if (R(l)) {
        const d = i.match(this.contextReg);
        d == null || d.forEach((c) => {
          const p = c.slice(10, c.length - 1);
          i = i.replace("${context.".concat(p, "}"), l[p] || "");
        });
      }
      if (R(s)) {
        const d = i.match(this.paramsReg);
        d == null || d.forEach((c) => {
          const p = c.slice(9, c.length - 1);
          i = i.replace("${params.".concat(p, "}"), s[p] || "");
        });
      }
      if (R(h)) {
        const d = i.match(this.dataReg);
        d == null || d.forEach((c) => {
          const p = c.slice(7, c.length - 1);
          i = i.replace("${data.".concat(p, "}"), h[p] || "");
        });
      }
    }
    return i;
  }
  /**
   * 加载实体数据集数据
   *
   * @param {string} tag 当前分类 user || department
   * @param {IData} data 表单数据
   * @param {string} query 模糊匹配字符串
   * @returns {*}  {Promise<IHttpResponse<IData[]>>}
   * @memberof PersonelSelectController
   */
  async getServiceData(i, l, s) {
    const { context: h, params: d } = this.handlePublicParams(
      l,
      this.context,
      this.params
    ), c = {};
    this.sort && !Object.is(this.sort, "") && Object.assign(c, { sort: this.sort }), Object.assign(c, { size: this.size }), s && Object.assign(c, s);
    const p = le(d, c);
    let g = "";
    const f = this.fill(this.userUrl, h, d, l).replaceAll(
      "//",
      "/"
    ), E = this.fill(this.deptUrl, h, d, l).replaceAll(
      "//",
      "/"
    ), y = this.fill(this.teamUrl, h, d, l).replaceAll(
      "//",
      "/"
    );
    this.copyUserUrl = f, this.copyDeptUrl = E, this.copyTeamUrl = y;
    let w = "post";
    const v = {};
    if (i === "member" ? (g = f, w = this.userMethod.toLowerCase(), w === "get" ? Object.assign(v, { method: w, params: p }) : Object.assign(v, { method: w, data: p })) : i === "department" ? (g = E, w = this.deptMethod.toLowerCase(), w === "get" ? Object.assign(v, { method: w, params: p }) : Object.assign(v, { method: w, data: p })) : i === "team" && (g = y, w = this.teamMethod.toLowerCase(), w === "get" ? Object.assign(v, { method: w, params: p }) : Object.assign(v, { method: w, data: p })), g)
      return await ibiz.net.request(g, v);
    throw new ie(this.model, "请配置数据接口地址");
  }
  /**
   * 获取操作用户列表
   *
   * @memberof PersonelSelectController
   */
  async getOperatorUserList() {
    const i = await ibiz.hub.getApp(this.context.srfappid);
    let l = [];
    l = await i.codeList.get(
      "SysOperator",
      this.context,
      this.params
    ), this.operatorMap = new Map(
      l.map((s) => [s.value, s])
    );
  }
}
class lt {
  constructor() {
    n(this, "formEditor", "TeamSelect"), n(this, "gridEditor", "TeamSelect");
  }
  async createController(i, l) {
    const s = new it(i, l);
    return await s.init(), s;
  }
}
const ct = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(r) {
    r.component(re.name, re), Be(
      "EDITOR_CUSTOMSTYLE_TEAM_SELECT",
      () => new lt()
    );
  }
};
export {
  ct as default
};
