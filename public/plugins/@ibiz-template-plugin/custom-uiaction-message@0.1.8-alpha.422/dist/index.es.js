import './style.css';
var O = Object.defineProperty;
var D = (t, l, n) => l in t ? O(t, l, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[l] = n;
var w = (t, l, n) => (D(t, typeof l != "symbol" ? l + "" : l, n), n);
import { EditorController as k, registerEditorProvider as z } from "@ibiz-template/runtime";
import { createVNode as e, createTextVNode as y, defineComponent as B, ref as v, resolveComponent as u, watch as N, isVNode as _ } from "vue";
import { useNamespace as I, getInputProps as U, getEditorEmits as Z } from "@ibiz-template/vue3-util";
var h = /* @__PURE__ */ ((t) => (t.ACTION = "action", t.RAW = "raw", t))(h || {});
const T = [
  { value: "action", label: "界面行为" },
  { value: "raw", label: "输入建议" }
], V = e("svg", {
  width: "20",
  height: "20",
  viewBox: "0 0 40 40",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg"
}, [e("title", null, [y("行为上下文")]), e("g", {
  id: "行为上下文",
  stroke: "none",
  "stroke-width": "1",
  fill: "none",
  "fill-rule": "evenodd"
}, [e("g", {
  id: "视图布局面板",
  fill: "#000000",
  "fill-rule": "nonzero",
  opacity: "0"
}, [e("rect", {
  id: "矩形",
  x: "0",
  y: "0",
  width: "40",
  height: "40"
}, null)]), e("g", {
  id: "CTX",
  transform: "translate(20.500000, 20.500000) rotate(-360.000000) translate(-20.500000, -20.500000) translate(8.000000, 15.000000)",
  fill: "#FAAD14",
  "fill-rule": "nonzero"
}, [e("path", {
  d: "M4.70310766,11 C6.03496115,11 7.13096559,10.4557292 7.9772475,9.43880208 L6.89511654,8.12109375 C6.34017758,8.73697917 5.64650388,9.16666667 4.77247503,9.16666667 C3.14927858,9.16666667 2.09489456,7.77734375 2.09489456,5.47135417 C2.09489456,3.19401042 3.26026637,1.81901042 4.81409545,1.81901042 C5.59100999,1.81901042 6.18756937,2.19140625 6.7008879,2.70703125 L7.78301887,1.36067708 C7.11709212,0.64453125 6.07658158,0 4.77247503,0 C2.17813541,0 0,2.04817708 0,5.54296875 C0,9.08072917 2.10876804,11 4.70310766,11 Z",
  id: "路径"
}, null), e("polygon", {
  id: "路径",
  points: "11.445616 10.7994792 13.4988901 10.7994792 13.4988901 1.96223958 16.4123196 1.96223958 16.4123196 0.200520833 8.55993341 0.200520833 8.55993341 1.96223958 11.445616 1.96223958"
}, null), e("path", {
  d: "M16.6897891,10.7994792 L18.8679245,10.7994792 L19.963929,8.45052083 C20.2136515,7.90625 20.4495006,7.34765625 20.7130966,6.703125 L20.7685905,6.703125 C21.0738069,7.34765625 21.3096559,7.90625 21.5732519,8.45052083 L22.7247503,10.7994792 L25,10.7994792 L22.1143174,5.42838542 L24.8196448,0.200520833 L22.6553829,0.200520833 L21.6842397,2.37760417 C21.4622642,2.87890625 21.254162,3.39453125 21.0044395,4.05338542 L20.9350721,4.05338542 C20.6298557,3.39453125 20.4078801,2.87890625 20.1720311,2.37760417 L19.145394,0.200520833 L16.8701443,0.200520833 L19.5754717,5.328125 L16.6897891,10.7994792 Z",
  id: "路径"
}, null)])])]), j = e("svg", {
  width: "40px",
  height: "40px",
  viewBox: "0 0 40 40",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg"
}, [e("title", null, [y("输入建议")]), e("defs", null, [e("path", {
  d: "M32.92,6 C33.517375,6 34,6.482625 34,7.08 L34,21.579 L33.9270413,21.5780794 L31.57,21.578 L31.57,15.18 L16.18,15.18 L16.18,30.57 L22.673134,30.5710367 C22.7571752,30.5757111 22.8418317,30.5780794 22.9270413,30.5780794 L33.9270413,30.5780794 C33.9516081,30.5780794 33.9761288,30.5778826 34.0006022,30.5774903 L34,31.92 C34,32.517375 33.517375,33 32.92,33 L8.08,33 C7.482625,33 7,32.517375 7,31.92 L7,7.08 C7,6.482625 7.482625,6 8.08,6 Z M14.02,8.43 L9.43,8.43 L9.43,30.57 L14.02,30.57 L14.02,8.43 Z M31.57,8.43 L16.18,8.43 L16.18,13.02 L31.57,13.02 L31.57,8.43 Z",
  id: "raw-path-1"
}, null)]), e("g", {
  id: "输入建议",
  stroke: "none",
  "stroke-width": "1",
  fill: "none",
  "fill-rule": "evenodd"
}, [e("g", {
  id: "视图布局面板"
}, [e("rect", {
  id: "矩形",
  fill: "#000000",
  "fill-rule": "nonzero",
  opacity: "0",
  x: "0",
  y: "0",
  width: "40",
  height: "40"
}, null), e("mask", {
  id: "raw-mask-2",
  fill: "white"
}, [e("use", {
  "xlink:href": "#raw-path-1"
}, null)]), e("use", {
  id: "形状结合",
  fill: "#666666",
  "fill-rule": "nonzero",
  "xlink:href": "#raw-path-1"
}, null)]), e("g", {
  id: "Param",
  transform: "translate(19.000000, 23.000000)",
  fill: "#666666",
  "fill-rule": "nonzero"
}, [e("path", {
  d: "M0,6 L0.833020638,6 L0.833020638,3.86756757 L1.3902439,3.86756757 C2.28517824,3.86756757 3,3.25135135 3,1.88108108 C3,0.462162162 2.29080675,0 1.36772983,0 L0,0 L0,6 Z M0.833020638,2.91891892 L0.833020638,0.948648649 L1.30581614,0.948648649 C1.87992495,0.948648649 2.18386492,1.18378378 2.18386492,1.88108108 C2.18386492,2.57027027 1.90806754,2.91891892 1.33395872,2.91891892 L0.833020638,2.91891892 Z",
  id: "形状"
}, null), e("path", {
  d: "M3.70788913,6 C3.98081023,6 4.2196162,5.72789116 4.42857143,5.3707483 L4.44136461,5.3707483 L4.48827292,5.88095238 L5,5.88095238 L5,3.10034014 C5,1.72278912 4.68869936,1 4.08315565,1 C3.70788913,1 3.36673774,1.28061224 3.08528785,1.6292517 L3.31130064,2.45408163 C3.53304904,2.19897959 3.74626866,2.00340136 3.96801706,2.00340136 C4.26226013,2.00340136 4.36460554,2.36054422 4.37313433,2.82823129 C3.41364606,3.03231293 3,3.56802721 3,4.58843537 C3,5.3962585 3.28144989,6 3.70788913,6 Z M3.91257996,5.02210884 C3.72921109,5.02210884 3.59701493,4.86054422 3.59701493,4.48639456 C3.59701493,4.06122449 3.79317697,3.74659864 4.37313433,3.59353741 L4.37313433,4.55442177 C4.2238806,4.85204082 4.09168443,5.02210884 3.91257996,5.02210884 Z",
  id: "形状"
}, null), e("path", {
  d: "M6,6 L6.81337047,6 L6.81337047,3.09059233 C6.99164345,2.38501742 7.28690808,2.13240418 7.53203343,2.13240418 C7.66016713,2.13240418 7.74930362,2.15853659 7.8551532,2.21080139 L8,1.10452962 C7.90529248,1.04355401 7.80501393,1 7.63231198,1 C7.3091922,1 6.97493036,1.34843206 6.74651811,1.98432056 L6.72423398,1.98432056 L6.66852368,1.12195122 L6,1.12195122 L6,6 Z",
  id: "路径"
}, null), e("path", {
  d: "M8.70788913,6 C8.98081023,6 9.2196162,5.72789116 9.42857143,5.3707483 L9.44136461,5.3707483 L9.48827292,5.88095238 L10,5.88095238 L10,3.10034014 C10,1.72278912 9.68869936,1 9.08315565,1 C8.70788913,1 8.36673774,1.28061224 8.08528785,1.6292517 L8.31130064,2.45408163 C8.53304904,2.19897959 8.74626866,2.00340136 8.96801706,2.00340136 C9.26226013,2.00340136 9.36460554,2.36054422 9.37313433,2.82823129 C8.41364606,3.03231293 8,3.56802721 8,4.58843537 C8,5.3962585 8.28144989,6 8.70788913,6 Z M8.91257996,5.02210884 C8.72921109,5.02210884 8.59701493,4.86054422 8.59701493,4.48639456 C8.59701493,4.06122449 8.79317697,3.74659864 9.37313433,3.59353741 L9.37313433,4.55442177 C9.2238806,4.85204082 9.09168443,5.02210884 8.91257996,5.02210884 Z",
  id: "形状"
}, null), e("path", {
  d: "M11,6 L11.7192118,6 L11.7192118,2.64634146 C11.9162562,2.2804878 12.0935961,2.09756098 12.2512315,2.09756098 C12.5123153,2.09756098 12.635468,2.36759582 12.635468,3.11672474 L12.635468,6 L13.3596059,6 L13.3596059,2.64634146 C13.5566502,2.2804878 13.7339901,2.09756098 13.8916256,2.09756098 C14.1527094,2.09756098 14.2758621,2.36759582 14.2758621,3.11672474 L14.2758621,6 L15,6 L15,2.95993031 C15,1.73170732 14.729064,1 14.1428571,1 C13.7832512,1 13.5172414,1.38327526 13.2660099,1.85365854 C13.1330049,1.31358885 12.9014778,1 12.5073892,1 C12.1477833,1 11.8916256,1.34843206 11.6600985,1.77526132 L11.6403941,1.77526132 L11.591133,1.12195122 L11,1.12195122 L11,6 Z",
  id: "路径"
}, null)])])]), R = e("svg", {
  width: "20",
  height: "20",
  viewBox: "0 0 40 40",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg"
}, [e("title", null, [y("界面行为")]), e("g", {
  id: "参数",
  stroke: "none",
  "stroke-width": "1",
  fill: "none",
  "fill-rule": "evenodd"
}, [e("g", {
  id: "双向参数"
}, [e("rect", {
  id: "矩形",
  x: "0",
  y: "0",
  width: "40",
  height: "40"
}, null), e("path", {
  d: "M26.1610984,11.4285714 C26.9951695,11.4285714 27.7875967,11.7930364 28.3304029,12.4263104 L35.0903618,20.3129291 C35.6406325,20.9549115 35.6406325,21.9022314 35.0903618,22.5442138 L28.3304029,30.4308325 C27.7875967,31.0641065 26.9951695,31.4285714 26.1610984,31.4285714 L12.1991093,31.4285714 C11.3650382,31.4285714 10.572611,31.0641065 10.0298047,30.4308325 L3.26984582,22.5442138 C2.7195752,21.9022314 2.7195752,20.9549115 3.26984582,20.3129291 L10.0298047,12.4263104 C10.572611,11.7930364 11.3650382,11.4285714 12.1991093,11.4285714 L26.1610984,11.4285714 Z",
  id: "路径",
  fill: "#8C8C8C",
  "fill-rule": "nonzero"
}, null), e("path", {
  d: "M26.1610984,11.4285714 L10.0298047,30.4308325 L3.26984582,22.5442138 C2.7195752,21.9022314 2.7195752,20.9549115 3.26984582,20.3129291 L10.0298047,12.4263104 C10.572611,11.7930364 11.3650382,11.4285714 12.1991093,11.4285714 L26.1610984,11.4285714 Z",
  id: "路径",
  fill: "#B4B4B4",
  "fill-rule": "nonzero"
}, null)])])]);
const P = /* @__PURE__ */ B({
  name: "CustomMessage",
  props: {
    item: {
      type: Object,
      required: !0
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    readonly: {
      type: Boolean,
      default: !1
    },
    search: {
      type: Function,
      required: !0
    }
  },
  emits: ["delete", "change"],
  setup(t, {
    emit: l
  }) {
    const n = I("custom-message"), o = v(t.item.metadata.content_name), L = (a) => {
      Object.assign(t.item.data, {
        content: a
      }), l("change");
    }, c = (a) => {
      Object.assign(t.item.data, {
        actionid: a.value
      }), Object.assign(t.item.metadata, {
        content_name: a.label
      }), l("change");
    }, r = () => {
      var a;
      o.value = t.item.metadata.content_name, Object.assign(t.item.metadata, {
        action_context: (a = t.item.metadata.action_context) == null ? void 0 : a.replaceAll("\n", "")
      });
    }, s = async (a, m) => {
      const p = await t.search(a);
      m(p);
    }, g = () => e("div", {
      class: n.e("content")
    }, [e("div", {
      class: n.e("icon")
    }, [R]), e(u("el-autocomplete"), {
      clearable: !0,
      "value-key": "label",
      "fit-input-width": !0,
      disabled: t.disabled,
      readonly: t.readonly,
      modelValue: o.value,
      "onUpdate:modelValue": (a) => o.value = a,
      class: n.em("content", "value"),
      onBlur: r,
      onSelect: c,
      fetchSuggestions: s
    }, {
      default: ({
        item: a
      }) => a.type === "empty" ? e(u("iBizNoData"), {
        class: n.e("empty"),
        onClick: (m) => m.stopPropagation()
      }, null) : e("div", {
        class: n.e("suggestion"),
        title: a.label
      }, [a.label])
    }), e(u("el-popover"), {
      width: 200,
      placement: "top",
      trigger: "click",
      popperClass: n.e("popper"),
      disabled: t.disabled
    }, {
      reference: () => e("div", {
        class: [n.e("icon"), n.em("icon", "context")]
      }, [V]),
      default: () => e(u("el-input"), {
        type: "textarea",
        onBlur: r,
        autosize: {
          minRows: 3
        },
        placeholder: "扩展应用上下文参数，格式如：abc:123;cde:456",
        modelValue: t.item.metadata.action_context,
        "onUpdate:modelValue": (a) => t.item.metadata.action_context = a
      }, null)
    })]), C = () => e("div", {
      class: n.e("content")
    }, [e("div", {
      class: n.e("icon")
    }, [j]), e(u("el-input"), {
      disabled: t.disabled,
      readonly: t.readonly,
      class: n.em("content", "value"),
      modelValue: t.item.metadata.content_name,
      "onUpdate:modelValue": (a) => t.item.metadata.content_name = a,
      onChange: L
    }, null)]);
    return {
      ns: n,
      renderContent: () => {
        switch (t.item.type) {
          case h.ACTION:
            return g();
          case h.RAW:
            return C();
        }
      }
    };
  },
  render() {
    return e("div", {
      class: this.ns.b()
    }, [this.renderContent(), e("div", {
      class: this.ns.e("actions")
    }, [e(u("ion-icon"), {
      title: "删除",
      name: "close-outline",
      class: [this.ns.e("icon"), this.ns.em("icon", "delete")],
      onClick: () => this.$emit("delete")
    }, null)])]);
  }
});
function W(t) {
  return typeof t == "function" || Object.prototype.toString.call(t) === "[object Object]" && !_(t);
}
const M = /* @__PURE__ */ B({
  name: "CustomUIActionMessage",
  props: U(),
  emits: Z(),
  setup(t, {
    emit: l
  }) {
    const n = I("custom-uiaction-message"), o = t.controller, L = v(!0), c = v(!1), r = v(""), s = v([]), g = (i) => {
      s.value = i.filter((d) => {
        var A, b, E, F, S, x;
        return [h.ACTION, h.RAW].includes(d.type) ? ((b = (A = d.metadata) == null ? void 0 : A.content_name) == null ? void 0 : b.trim()) ? d.type === h.ACTION ? !!((F = (E = d.data) == null ? void 0 : E.actionid) != null && F.trim()) : !!((x = (S = d.data) == null ? void 0 : S.content) != null && x.trim()) : !1 : !0;
      }), r.value = JSON.stringify(s.value, null, 2);
    }, C = () => {
      let i;
      try {
        const d = JSON.parse(r.value);
        Array.isArray(d) && (i = d);
      } catch (d) {
        ibiz.log.error(d);
      } finally {
        L.value = i ? !i.some((d) => ![h.ACTION, h.RAW].includes(d.type)) : !1, i && g(i), L.value || (c.value = !0);
      }
    };
    N(() => t.value, () => {
      r.value = t.value || "", C();
    });
    const f = () => {
      c.value = !c.value, c.value ? g(s.value) : C();
    }, a = (i) => {
      s.value.push({
        type: i,
        data: {},
        metadata: {}
      });
    }, m = () => {
      g(s.value), l("change", r.value);
    };
    return {
      c: o,
      ns: n,
      msgStr: r,
      msgArr: s,
      isLegal: L,
      showCustom: c,
      onAdd: a,
      onDelete: (i) => {
        s.value.splice(i, 1), m();
      },
      onSearch: (i) => o.fetch(t.data, i),
      onItemChange: m,
      onSwitchCustom: f,
      onCustomChange: () => {
        C(), l("change", r.value);
      }
    };
  },
  render() {
    return e("div", {
      class: this.ns.b()
    }, [this.showCustom ? e(u("el-input"), {
      rows: 6,
      type: "textarea",
      modelValue: this.msgStr,
      "onUpdate:modelValue": (t) => this.msgStr = t,
      disabled: this.disabled,
      readonly: this.readonly,
      class: this.ns.e("custom"),
      onChange: this.onCustomChange
    }, null) : e("div", {
      class: this.ns.e("content")
    }, [this.msgArr.map((t, l) => e(P, {
      item: t,
      disabled: this.disabled,
      readonly: this.readonly,
      search: this.onSearch,
      onChange: this.onItemChange,
      onDelete: () => this.onDelete(l)
    }, null))]), e("div", {
      class: this.ns.e("footer")
    }, [e(u("el-button"), {
      size: "small",
      disabled: this.disabled || !this.isLegal,
      title: this.isLegal ? this.showCustom ? "关闭自定义" : "开启自定义" : "有未知类型数据，不可关闭自定义模式",
      onClick: this.onSwitchCustom
    }, {
      default: () => [this.showCustom ? "关闭自定义" : "开启自定义"]
    }), !this.showCustom && !this.readonly && e(u("el-dropdown"), {
      size: "small",
      trigger: "click",
      onCommand: this.onAdd
    }, {
      default: () => e(u("el-button"), {
        size: "small",
        title: "添加"
      }, {
        default: () => [e(u("ion-icon"), {
          name: "add-outline"
        }, null)]
      }),
      dropdown: () => {
        let t;
        return e(u("el-dropdown-menu"), null, W(t = T.map((l) => e(u("el-dropdown-item"), {
          command: l.value
        }, {
          default: () => [l.label]
        }))) ? t : {
          default: () => [t]
        });
      }
    })])]);
  }
});
class $ extends k {
  /**
   * @description 查询数据
   * @param {IData} data
   * @param {string} [query]
   * @returns {*}  {Promise<IUIAction[]>}
   * @memberof CustomUIActionMessageController
   */
  async fetch(l, n) {
    let o = [
      {
        type: "empty",
        value: "empty",
        label: "暂无数据"
      }
    ];
    const { appId: L, appDataEntityId: c, appDEDataSetId: r } = this.model;
    if (!c || !r)
      return o;
    try {
      const s = ibiz.hub.getApp(L), { context: g, params: C } = this.handlePublicParams(
        l,
        this.context,
        this.params
      );
      Object.assign(C, { size: 1e3 }), n && Object.assign(C, { query: n });
      const f = await s.deService.exec(
        c,
        r,
        g,
        C
      );
      f.ok && Array.isArray(f.data) && f.data.length && (o = f.data.map((a) => {
        var m, p;
        return {
          type: "data",
          label: a.caption,
          value: "".concat((m = a.codename) == null ? void 0 : m.toLowerCase(), "@").concat((p = a.psdename) == null ? void 0 : p.toLowerCase())
        };
      }));
    } catch (s) {
      ibiz.log.error(s);
    }
    return o;
  }
}
class J {
  constructor() {
    w(this, "formEditor", "CustomUIActionMessage");
    w(this, "gridEditor", "CustomUIActionMessage");
  }
  async createController(l, n) {
    const o = new $(
      l,
      n
    );
    return await o.init(), o;
  }
}
const e1 = {
  install(t) {
    t.component(M.name, M), z(
      "EDITOR_CUSTOMSTYLE_CUSTOM_UIACTION_MESSAGE",
      () => new J()
    );
  }
};
export {
  e1 as default
};
