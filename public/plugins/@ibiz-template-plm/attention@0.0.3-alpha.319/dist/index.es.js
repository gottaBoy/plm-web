import './assets/style.css';
import { useNamespace as ie, getDataPickerProps as dt, getEditorEmits as ut, renderString as ct, withInstall as pt } from "@ibiz-template/vue3-util";
import { EditorController as ht, getDeACMode as mt, UIActionUtil as vt, OpenAppViewCommand as Me, registerEditorProvider as ft } from "@ibiz-template/runtime";
import { clone as le, mergeDeepLeft as gt } from "ramda";
import { defineComponent as se, ref as v, onMounted as Fe, watch as B, createVNode as n, computed as D, onUnmounted as bt, resolveComponent as O, onBeforeUnmount as wt, withDirectives as yt, resolveDirective as Mt, createTextVNode as N, nextTick as Ft, mergeProps as Et, isVNode as It } from "vue";
import { isArray as At } from "lodash-es";
import { RuntimeModelError as ee } from "@ibiz-template/core";
import { notNilEmpty as q } from "qx-util";
class Ct {
  /**
   * 计算选中项绘制个数 多选场景需计算显示人员是否超出
   * @author ljx
   * @date 2024-03-05 02:42:45
   * @param {IData} values 选中项key值集合
   * @returns {number} selRenderNum
   */
  static calcSelItemRenderNum(r, o) {
    let i = 0;
    if (o && (r == null ? void 0 : r.length) > 0) {
      const e = (o == null ? void 0 : o.offsetWidth) || 0, d = window.getComputedStyle(o), p = parseInt(d.marginLeft, 10), f = parseInt(d.marginRight, 10), b = parseInt(d.paddingLeft, 10), w = parseInt(d.paddingRight, 10), F = p + f + b + w, y = 70, E = 33, c = 28, g = 8, U = (c + g) * r.length;
      e - F - y - E - U < 0 && (i = Math.floor((e - F - y - E) / (c + g)), i -= 1);
    }
    return i;
  }
}
const Ot = se({
  name: "VirtualList",
  props: {
    items: {
      //  数据源
      type: Array,
      default: () => []
    },
    itemHeight: {
      //  每行高度
      type: Number,
      default: 36
    },
    showNum: {
      //  可视数量
      type: Number,
      default: 20
    }
  },
  emits: ["scrollEvent"],
  setup(u, { emit: r }) {
    const o = ie("virtual-list-box"), i = v(36), e = v(), d = v([]), p = v(0), f = v(0), b = v(0), w = v(0), F = (c, g) => {
      r("scrollEvent", c, g);
    }, y = () => {
      f.value = Math.floor(w.value / u.itemHeight), b.value = f.value + u.showNum, d.value = u.items.slice(
        f.value,
        b.value
      );
      const c = w.value - w.value % u.itemHeight;
      p.value = c;
    }, E = () => {
      var c;
      w.value = ((c = e.value) == null ? void 0 : c.scrollTop) || 0, y(), F(i.value, w.value);
    };
    return Fe(() => {
      setTimeout(() => {
        scroll();
      }, 1e3);
    }), B(
      () => u.items,
      () => {
        i.value = u.itemHeight * u.items.length, y();
      },
      {
        immediate: !0,
        deep: !0
      }
    ), {
      ns: o,
      contentHeight: i,
      showList: d,
      contentBox: e,
      top: p,
      onScroll: E
    };
  },
  render() {
    return n(
      "div",
      {
        ref: "contentBox",
        class: this.ns.b(),
        onScroll: () => this.onScroll()
      },
      [
        n(
          "div",
          {
            class: this.ns.e("container"),
            style: "height:".concat(this.contentHeight, "px;")
          },
          [
            n(
              "div",
              {
                class: this.ns.e("content"),
                style: "top:".concat(this.top, "px;")
              },
              [
                this.showList.map(
                  (u, r) => n(
                    "div",
                    {
                      key: r,
                      class: this.ns.m("item")
                    },
                    [
                      this.$slots.default ? this.$slots.default({
                        ...u,
                        index: r
                      }) : u.name
                    ]
                  )
                )
              ]
            )
          ]
        )
      ]
    );
  }
}), xt = se({
  name: "IBizFollow",
  props: {
    readonly: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    },
    value: {
      type: String
    },
    codeListId: {
      type: String
    },
    codeListMap: {
      type: Object
    },
    controller: {
      type: Object,
      required: !0
    },
    defaultSelected: {
      type: String
    }
  },
  emits: {
    /** 值变更事件 */
    change: (u, r) => !0,
    /** 失焦事件 */
    blur: (u) => !0,
    /** 聚焦事件 */
    focus: (u) => !0,
    /** 回车事件 */
    enter: (u) => !0,
    /** 信息文本变更事件 */
    infoTextChange: (u) => !0
  },
  setup(u, { emit: r }) {
    const o = ie("follow"), i = u.controller, e = v(), d = v(!1), p = v(!1), f = v(), b = v(!1), w = v(!1), F = v(null), y = v(!1), E = v([]), c = D(() => u.codeListMap || {}), g = D(() => ({})), U = async () => {
      if (b.value = !0, u.codeListId) {
        const m = await ibiz.hub.getApp(i.context.srfappid).codeList.get(
          u.codeListId,
          i.context,
          i.params
        );
        m && m.length > 0 && (E.value = [...m]), d.value = !0;
      }
      b.value = !1;
    }, C = (m) => {
      var I, A;
      F.value = m, (A = (I = c.value) == null ? void 0 : I.FOLLOWED) != null && A.find((P) => String(P) === String(m)) ? w.value = !0 : w.value = !1;
    };
    B(
      () => u.value,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (m, I) => {
        var A;
        let P = m;
        !m && u.codeListMap && (P = ((A = c.value) == null ? void 0 : A.NOTFOLLOWING[0]) || ""), C(P);
      },
      {
        immediate: !0,
        deep: !0
      }
    );
    const z = (m) => {
      m ? p.value = m : setTimeout(() => {
        p.value = m;
      }, 100);
    }, S = D({
      get() {
        var m;
        return (m = u.value) == null ? void 0 : m.toString();
      },
      set(m) {
        r("change", m), z(!1);
      }
    }), R = D(() => {
      const m = Array.isArray(S.value) ? S.value : [S.value], I = E.value, A = [];
      return m.forEach((P) => {
        I.forEach((Z) => {
          Z.value === P && A.push(Z.text);
        });
      }), A.join(",");
    });
    B(
      R,
      (m, I) => {
        m !== I && r("infoTextChange", m);
      },
      {
        immediate: !0
      }
    );
    const L = (m) => E.value.find((I) => I.text === m), K = async (m) => {
      y.value = m, m && !d.value && await U();
    }, j = (m) => {
      F.value = m.value, C(m.value), r("change", m.value);
    }, _ = (m) => {
      var I;
      (m.key === "Escape" || m.keyCode === 27) && (m.stopPropagation(), (I = e.value) == null || I.handleClose());
    };
    return bt(() => {
    }), {
      ns: o,
      curValue: S,
      items: E,
      valueText: R,
      editorRef: f,
      cssVars: g,
      isEditable: p,
      isLoading: b,
      followState: w,
      selectd: F,
      showState: y,
      dropdownRef: e,
      setEditable: z,
      getCodeListItem: L,
      onShowChange: K,
      onItemClick: j,
      handleKeyDown: _
    };
  },
  render() {
    const u = n(
      "div",
      {
        class: [this.ns.e("showcase"), this.showState ? "is-active" : ""]
      },
      [
        n(
          "span",
          {
            class: this.ns.em("showcase", "icon")
          },
          [
            n(
              "svg",
              {
                viewBox: "0 0 16 16",
                xmlns: "http://www.w3.org/2000/svg",
                height: "1em",
                width: "1em",
                focusable: "false"
              },
              [
                n(
                  "g",
                  {
                    id: "follow/with/interest",
                    "stroke-width": "1",
                    "fill-rule": "evenodd"
                  },
                  [
                    n(
                      "path",
                      {
                        d: "M8 3.4c2.823 0 5.04 1.367 7.38 3.637a2.037 2.037 0 0 1 0 2.925C13.04 12.232 10.824 13.6 8 13.6c-2.823 0-5.032-1.364-7.376-3.637a2.037 2.037 0 0 1 0-2.925C2.967 4.764 5.176 3.4 8 3.4zm0 1.2c-2.417 0-4.405 1.228-6.542 3.3a.837.837 0 0 0 0 1.2C3.596 11.173 5.584 12.4 8 12.4s4.413-1.231 6.546-3.3a.837.837 0 0 0 0-1.2C12.412 5.83 10.415 4.6 8 4.6zM8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0-1.2a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6z",
                        id: "attention",
                        fill: "currentColor"
                      },
                      null
                    )
                  ]
                )
              ]
            )
          ]
        ),
        n(
          "span",
          {
            class: this.ns.em("showcase", "text")
          },
          [this.followState ? "已关注" : "未关注"]
        )
      ]
    ), r = n(
      O("el-dropdown"),
      {
        "popper-class": this.ns.b("popover"),
        ref: (o) => {
          this.dropdownRef = o;
        },
        trigger: "click",
        placement: "top-start",
        onVisibleChange: this.onShowChange,
        onKeydown: (o) => {
          this.handleKeyDown(o);
        }
      },
      {
        default: () => u,
        dropdown: () => n(
          O("el-dropdown-menu"),
          {
            class: this.ns.be("popper", "dropdown-menu")
          },
          {
            default: () => this.items.map(
              (o, i) => n(
                O("el-dropdown-item"),
                {
                  onClick: () => this.onItemClick(o)
                },
                {
                  default: () => [
                    n(
                      "div",
                      {
                        class: [
                          this.ns.b("content"),
                          String(this.selectd) === String(o.value) ? "is-active" : ""
                        ]
                      },
                      [
                        n(
                          "div",
                          {
                            class: this.ns.em("item", "text")
                          },
                          [o.text]
                        ),
                        n(
                          "div",
                          {
                            class: this.ns.em("item", "tooltip")
                          },
                          [o.tooltip]
                        )
                      ]
                    ),
                    i === this.items.length - 1 ? null : n(
                      "div",
                      {
                        class: this.ns.em("item", "divider")
                      },
                      [
                        n(
                          O("el-divider"),
                          null,
                          null
                        )
                      ]
                    )
                  ]
                }
              )
            )
          }
        )
      }
    );
    return n(
      "div",
      {
        class: [
          this.ns.b(),
          this.disabled ? this.ns.m("disabled") : "",
          this.readonly ? this.ns.m("readonly") : "",
          this.ns.is("editable", this.isEditable)
        ],
        style: this.cssVars
      },
      [this.readonly ? u : r]
    );
  }
});
function te(u) {
  return typeof u == "function" || Object.prototype.toString.call(u) === "[object Object]" && !It(u);
}
const ae = se({
  name: "IBizAttention",
  props: {
    ...dt(),
    controller: {
      type: Object,
      required: !0
    },
    data: {
      type: Object,
      required: !0
    }
  },
  emits: ut(),
  setup(u, { emit: r, attrs: o }) {
    const i = ie("attention"), e = u.controller, d = v(""), p = v([]), f = v([]), b = v(""), w = v(!1), F = v(!1), y = v(""), E = v([]), c = v("user"), g = v([]), U = v([]), C = v(!1), z = v(!1), S = v(!1), R = v(""), L = v(!1), K = v(), j = v(), _ = v(""), m = v(), I = v([]);
    let A = 0;
    const P = v(295), Z = D(() => u == null ? void 0 : u.readonly), Ee = () => {
      let t = 295;
      if (j.value) {
        const a = j.value.getBoundingClientRect(), l = 16, s = e.enableBottomButton ? 464 : 415, h = s - t, M = a.top < s + l, x = window.innerHeight - a.bottom < s + l;
        if (M && x) {
          const k = a.top - l - h;
          t = Math.max(50, Math.min(Math.floor(k), 295));
        }
      }
      P.value = t;
    }, Ie = D(
      () => !!(u.controlParams && u.controlParams.editmode === "hover")
    ), T = D(() => ct(d.value)), H = v({}), J = /* @__PURE__ */ new Set(), Ae = async (t, a = {}) => {
      if (!(H.value[t] || J.has(t))) {
        J.add(t);
        try {
          const { downloadUrl: l } = ibiz.util.file.calcFileUpDownUrl(
            e.context,
            e.params,
            u.data,
            e.editorParams
          );
          let s = "";
          if (ibiz.config.common.enableDownloadTicket) {
            const h = c.value === "user" ? e.userAuthEntity : e.deptAuthEntity, M = c.value === "user" ? e.userFilterMap.id : e.deptFilterMap.id, x = await ibiz.util.file.getDownloadTicket(
              e.context,
              e.params,
              a,
              {
                fileId: t
              },
              {
                appEntityTag: h,
                dataFieldTag: M
              }
            );
            x != null && x.ticket && (s = l.replace("%fileId%", x.ticket));
          } else
            s = l.replace("%fileId%", t);
          s && (H.value[t] = s);
        } catch (l) {
          ibiz.log.error(l);
        } finally {
          J.delete(t);
        }
      }
    }, Ce = (t) => /^https?:|^http?:|^data:image|(\.png$|\.svg|\.jpg|\.png|\.gif|\.psd|\.tif|\.bmp|\.jpeg)$/.test(
      t
    ), W = (t) => {
      t.preventDefault(), t.stopPropagation();
    }, Y = () => {
      var t;
      const a = [], l = [];
      _.value = "", ((t = g.value) == null ? void 0 : t.length) > 0 && g.value.forEach((s) => {
        a.push(s[e.selfFillMap.user_id]), l.push(s[e.selfFillMap.user_name]), s[e.selfFillMap.user_id] === e.context.srfuserid && (_.value = s[e.attentionTypeField]);
      }), b.value = a == null ? void 0 : a.toString(), d.value = l == null ? void 0 : l.toString();
    }, Oe = (t) => {
      var a, l;
      return (l = (a = e.codeListMap) == null ? void 0 : a.FOLLOWED) == null ? void 0 : l.some((s) => String(s) === String(t));
    }, G = () => {
      const t = b.value.split(e.separator);
      A = Ct.calcSelItemRenderNum(
        t,
        j.value
      ), b.value = "", Y();
    }, ne = (t) => {
      if (t) {
        const a = At(t) ? t : [];
        g.value = [], a.forEach((l) => {
          const s = le(l);
          e.selfFillMap.user_id && e.selfFillMap.user_name && Object.assign(s, {
            id: l[e.selfFillMap.user_id],
            name: l[e.selfFillMap.user_name],
            title: l[e.selfFillMap.user_title],
            [e.attentionTypeField]: l[e.attentionTypeField]
          }), e.objectValueField && (Object.assign(s, {
            ...l[e.objectValueField]
          }), delete s[e.objectValueField]), g.value.push(s);
        });
      } else
        g.value = [];
      U.value = le(g.value);
    };
    B(
      () => u.value,
      (t) => {
        t ? e.valueType === "OBJECT" ? d.value = t ? t[e.objectNameField] : null : e.valueType === "OBJECTS" ? (ne(t), Y()) : d.value = t : (d.value = "", g.value = []), G();
      },
      {
        immediate: !0
      }
    );
    const xe = D(
      () => u.data && u.data[e.valueItem] || void 0
    );
    B(
      xe,
      (t, a) => {
        t !== a && (b.value = t, t === null && (g.value = [], r("change", null)));
      },
      {
        immediate: !0,
        deep: !0
      }
    );
    const re = (t) => {
      t ? F.value = t : setTimeout(() => {
        F.value = t;
      }, 100);
    }, Se = (t) => {
      const a = {}, l = U.value.find((s) => s.id === t.id) || {};
      try {
        const s = e.dynamicMatch(e.fieldMap, {
          item: {
            ...l,
            ...t
          }
        }), h = JSON.parse(s);
        Object.keys(h).forEach((M) => {
          h[M] && Object.assign(a, {
            [M]: h[M]
          });
        });
      } catch (s) {
        ibiz.log.debug("".concat(e.fieldMap, "额外抛值字段映射"));
      }
      return a;
    }, $ = () => {
      if (e.enableBottomButton && !L.value)
        return;
      const t = g.value.map((a) => {
        const l = {};
        return Object.assign(l, {
          [e.selfFillMap.user_id]: a.id,
          [e.selfFillMap.user_name]: a.name,
          [e.selfFillMap.user_title]: a.title,
          [e.attentionTypeField]: a[e.attentionTypeField]
        }), e.fieldMap && Object.assign(l, Se(a)), l;
      });
      r("change", t);
    }, Pe = (t, a) => {
      W(a);
      const l = g.value.findIndex((s) => s.id === t.id);
      if (l > -1 && g.value.splice(l, 1), e.valueItem) {
        const s = g.value.map((h) => h.id);
        r("change", s.join(e.separator), e.valueItem);
      }
      if (e.valueType === "OBJECTS")
        L.value = !0, $(), L.value = !1;
      else {
        const s = g.value.map((h) => h.name);
        r("change", s.join(e.separator));
      }
    }, Te = async (t) => {
      y.value && (c.value === "user" ? p.value.unshift(t) : f.value.unshift(t));
      const a = {};
      if (Object.assign(a, t), c.value === "user") {
        Object.assign(a, {
          [e.userFilterMap.id]: a[e.userFilterMap.id] ? a[e.userFilterMap.id] : a.srfkey,
          [e.userFilterMap.name]: a[e.userFilterMap.name] ? a[e.userFilterMap.name] : a.srfmajortext
        });
        const l = g.value.findIndex(
          (s) => s.id === a[e.userFilterMap.id]
        );
        l < 0 ? g.value.push({
          ...a,
          id: a[e.userFilterMap.id],
          name: a[e.userFilterMap.name],
          [e.attentionTypeField]: e.defaultAttentionValue
        }) : g.value.splice(l, 1);
      } else {
        Object.assign(a, {
          [e.deptFilterMap.id]: a[e.deptFilterMap.id] ? a[e.deptFilterMap.id] : a.srfkey,
          [e.deptFilterMap.name]: a[e.deptFilterMap.name] ? a[e.deptFilterMap.name] : a.srfmajortext
        });
        const l = g.value.findIndex(
          (s) => s.id === a[e.deptFilterMap.id]
        );
        l < 0 ? g.value.push({
          ...a,
          id: a[e.deptFilterMap.id],
          name: a[e.deptFilterMap.name],
          [e.attentionTypeField]: e.defaultAttentionValue
        }) : g.value.splice(l, 1);
      }
      if (e.multiple) {
        if (e.valueItem) {
          const s = g.value.map((h) => h.id);
          r("change", s.join(e.separator), e.valueItem);
        }
        const l = g.value.map((s) => s.name);
        e.valueType === "OBJECTS" ? $() : r("change", l.join(e.separator));
      } else {
        const l = await e.calcFillDataItems([t]);
        if (l.length && l.forEach((s) => {
          r("change", s.value, s.id);
        }), e.valueItem && (c.value === "user" ? r(
          "change",
          a[e.userFilterMap.id],
          e.valueItem
        ) : r(
          "change",
          a[e.deptFilterMap.id],
          e.valueItem
        )), e.valueType === "OBJECT")
          r("change", e.handleObjectParams(a));
        else if (e.valueType === "OBJECTS") {
          const s = {};
          c.value === "user" ? Object.assign(s, {
            id: a[e.userFilterMap.id],
            name: a[e.userFilterMap.name]
          }) : Object.assign(s, {
            id: a[e.deptFilterMap.id],
            name: a[e.deptFilterMap.name]
          }), g.value = [s], $();
        } else
          c.value === "user" ? r("change", t[e.userFilterMap.name]) : r("change", t[e.deptFilterMap.name]);
        S.value = !1;
      }
      e.valueType !== "OBJECTS" && r("blur", t), re(!1);
    }, Le = (t, a) => {
      t.forEach((l) => {
        const s = p.value.findIndex((h) => h[a] === l[a]);
        s > -1 ? p.value.splice(s, 1, l) : p.value.push(l);
      });
    }, V = async (t = !1) => {
      if (y.value)
        return;
      C.value = !0;
      const a = {};
      c.value === "department" ? a.page = e.deptpage : a.page = e.page;
      try {
        const l = await e.loadMore(u.data, c.value, a);
        l && (c.value === "user" ? p.value.length === 0 ? p.value = l.data : Le(l.data, e.userFilterMap.id) : f.value.length === 0 ? f.value = l.data : f.value.push(...l.data));
      } catch (l) {
        C.value = !1;
      }
      C.value = !1;
    }, oe = (t) => {
      const { dataItems: a } = e;
      a != null && a.length && a.forEach((l) => {
        r("change", null, l.id);
      }), e.valueItem && r("change", null, e.valueItem), e.valueType === "OBJECTS" ? r("change", []) : (r("change", null), r("blur", t)), t.stopPropagation(), t.preventDefault();
    }, je = async (t) => {
      if (e.codeListMap) {
        if (Oe(String(t))) {
          const a = g.value.find((l) => {
            var s;
            return l[e.selfFillMap.user_id] === ((s = e.context) == null ? void 0 : s.srfuserid);
          });
          if (a)
            Object.assign(a, {
              [e.attentionTypeField]: t
            });
          else {
            const l = {
              id: e.context.srfuserid,
              name: e.context.srfusername,
              [e.attentionTypeField]: t
            };
            e.currentOperator || await e.initCurrentOperator(u.data), e.currentOperator && Object.assign(l, {
              title: e.currentOperator[e.userFilterMap.title]
            }), g.value.push(l);
          }
        } else {
          const a = g.value.findIndex((l) => {
            var s;
            return l[e.selfFillMap.user_id] === ((s = e.context) == null ? void 0 : s.srfuserid);
          });
          a > -1 && g.value.splice(a, 1);
        }
        Y(), $();
      }
    };
    B(
      T,
      (t, a) => {
        t !== a && e.valueType !== "OBJECTS" && r("infoTextChange", t);
      },
      {
        immediate: !0
      }
    );
    const de = async (t) => {
      C.value = !0;
      try {
        const a = {};
        Object.assign(a, {
          query: t,
          size: 1e3
        });
        const l = await e.getServiceData(
          c.value,
          u.data,
          a
        );
        l && (c.value === "user" ? l.data.forEach((s) => {
          Object.keys(e.userFilterMap).forEach((h) => {
            s[h] = s[e.userFilterMap[h]];
          });
        }) : l.data.forEach((s) => {
          Object.keys(e.deptFilterMap).forEach((h) => {
            s[h] = s[e.deptFilterMap[h]];
          });
        }), E.value = l.data, C.value = !1);
      } catch (a) {
        C.value = !1;
      }
    }, ue = (t) => {
      if (c.value !== t) {
        if (c.value = t, y.value) {
          de(y.value);
          return;
        }
        c.value === "user" && p.value.length === 0 && V(), c.value === "department" && f.value.length === 0 && V();
      }
    }, ke = () => {
      const t = document.documentElement;
      return t ? getComputedStyle(t).getPropertyValue("--ibiz-color-primary") : null;
    }, De = (t) => /[\u4E00-\u9FA5]/.test(t), Ue = (t) => /[\u4e00-\u9fa5]+.*[a-zA-Z]+|[a-zA-Z]+.*[\u4e00-\u9fa5]+/.test(t), X = (t) => {
      if (!t)
        return "";
      let a = 0;
      for (let k = 0; k < t.length; k++)
        if (De(t))
          a = t.charCodeAt(k) + ((a << 5) - a), a = a & a;
        else {
          const ot = t.charCodeAt(k);
          a += ot.toString(16);
        }
      const l = String(a).substring(0, 6);
      let s = parseInt(l.substring(0, 2), 16), h = parseInt(l.substring(2, 4), 16), M = parseInt(l.substring(4, 6), 16);
      s < 0 && (s = 10), h < 0 && (h = 10), M < 0 && (M = 10);
      const x = "#".concat(s.toString(16).padStart(2, "0")).concat(h.toString(16).padStart(2, "0")).concat(M.toString(16).padStart(2, "0"));
      return x === "#FFFFFF" && ke() || x;
    }, Ve = (t) => {
      clearTimeout(m.value), m.value = setTimeout(() => {
        !t && t !== 0 ? V() : de(t), clearTimeout(m.value);
      }, 300);
    }, Ne = (t) => {
      t.forEach((a) => {
        if (a.capLanguageRes && a.capLanguageRes.lanResTag) {
          const l = ibiz.i18n.t(a.capLanguageRes.lanResTag, a.caption);
          Object.assign(a, {
            caption: l
          });
        }
        if (a.tooltipLanguageRes && a.tooltipLanguageRes.lanResTag) {
          const l = ibiz.i18n.t(a.tooltipLanguageRes.lanResTag, a.tooltip);
          Object.assign(a, {
            caption: l
          });
        }
      });
    }, ze = async (t, a) => {
      await e.onActionClick(t, [u.data], a);
    }, Be = (t) => y.value ? E.value : t, ce = () => {
      z.value = !1, H.value = {}, J.clear();
    }, Re = () => {
      L.value = !1, S.value = !1, setTimeout(() => {
        ne(u.value);
      }, 200);
    }, _e = () => {
      L.value = !0, S.value = !1, $(), L.value = !1;
    }, He = () => n(
      O("el-input"),
      {
        class: i.be("select-modal", "search-input"),
        ref: K,
        modelValue: y.value,
        "onUpdate:modelValue": (t) => y.value = t,
        placeholder: "搜索",
        onInput: (t) => Ve(t)
      },
      {
        suffix: () => n(
          "svg",
          {
            viewBox: "0 0 16 16",
            xmlns: "http://www.w3.org/2000/svg",
            height: "1em",
            width: "1em",
            preserveAspectRatio: "xMidYMid meet",
            focusable: "false"
          },
          [
            n(
              "g",
              {
                id: "atwnormal/search",
                "stroke-width": "1",
                "fill-rule": "evenodd"
              },
              [
                n(
                  "path",
                  {
                    d: "M6.751 12.303A5.557 5.557 0 0 1 1.2 6.751C1.2 3.691 3.69 1.2 6.751 1.2a5.558 5.558 0 0 1 5.551 5.551 5.557 5.557 0 0 1-5.551 5.552M6.751 0a6.751 6.751 0 1 0 4.309 11.949l3.855 3.855a.6.6 0 1 0 .849-.849l-3.854-3.853A6.751 6.751 0 0 0 6.751 0",
                    id: "atwFill-1",
                    fill: "currentColor"
                  },
                  null
                )
              ]
            )
          ]
        )
      }
    ), Je = () => n(
      "div",
      {
        class: i.be("select-modal", "select-state")
      },
      [
        n(
          "div",
          {
            class: [
              i.bem(
                "select-modal",
                "select-state",
                "select-slider"
              ),
              i.is("left", c.value === "user"),
              i.is("right", c.value !== "user")
            ]
          },
          null
        ),
        n(
          "div",
          {
            class: i.bem(
              "select-modal",
              "select-state",
              "select-personel"
            ),
            onClick: () => ue("user")
          },
          [N("人员")]
        ),
        n(
          "div",
          {
            class: i.bem(
              "select-modal",
              "select-state",
              "select-department"
            ),
            onClick: () => ue("department")
          },
          [N("部门")]
        )
      ]
    ), $e = (t) => n(
      "div",
      {
        class: i.bem("select-modal", "actions", "item"),
        title: t.tooltip,
        onClick: (a) => ze(t, a)
      },
      [
        t.showIcon && t.sysImage && n(
          O("iBizIcon"),
          {
            icon: t.sysImage
          },
          null
        )
      ]
    ), Ke = () => {
      var t;
      const a = ((t = e.model.uiactionGroup) == null ? void 0 : t.uiactionGroupDetails) || [];
      return Ne(a), n(
        "div",
        {
          class: i.be("select-modal", "actions")
        },
        [a.map((l) => $e(l))]
      );
    }, Ze = () => n(
      "div",
      {
        class: i.be("select-modal", "select")
      },
      [Je(), Ke()]
    ), We = (t) => {
      if (e.multiple) {
        let a = -1;
        return b.value && (a = b.value.split(e.separator).findIndex((l) => l === t)), e.enableBottomButton && (a = g.value.findIndex(
          (l) => (c.value === "user" ? l[e.userFilterMap.id] : l[e.deptFilterMap.id]) === t
        )), a > -1 ? n(
          "div",
          {
            class: i.bem(
              "select-modal",
              "personel-list",
              "icon"
            )
          },
          [
            n(
              "i",
              {
                class: "fa fa-check",
                "aria-hidden": "true"
              },
              null
            )
          ]
        ) : null;
      }
      return b.value === t ? n(
        "div",
        {
          class: i.bem("select-modal", "personel-list", "icon")
        },
        [
          n(
            "i",
            {
              class: "fa fa-check",
              "aria-hidden": "true"
            },
            null
          )
        ]
      ) : null;
    }, qe = (t) => {
      if (t && t.toString().length < 2)
        return t;
      if (t && t.toString().length >= 2) {
        if (Ue(t)) {
          const a = t.split("").find((s) => /[a-zA-Z]/.test(s)) || "", l = t.split("").find((s) => /[\u4E00-\u9FA5]/.test(s)) || "";
          return "".concat(a).concat(l).toLowerCase();
        }
        return /[a-zA-Z]/.test(t) ? t.split("").filter((a) => /[a-zA-Z]/.test(a)).slice(0, 2).join("").toUpperCase() : /[\u4E00-\u9FA5]/.test(t) ? t.split("").filter((a) => /[\u4E00-\u9FA5]/.test(a)).slice(-2).join("") : t.replaceAll(" ", "").substring(0, 2);
      }
    }, Ye = (t) => {
      console.log("头像加载失败"), I.value.push(t);
    }, Ge = (t, a) => {
      if (!t)
        return null;
      let l = "";
      if (Ce(t))
        l = t;
      else {
        let s = [];
        try {
          s = JSON.parse(t);
        } catch (M) {
          console.error("解析头像数据失败", M);
        }
        if (s.length === 0)
          return null;
        const h = s[0].id;
        if (l = H.value[h], !l)
          return Ae(h, a), null;
      }
      return n(
        "img",
        {
          class: i.bem("select-modal", "personel-list", "avatar"),
          src: l,
          onError: () => Ye(t),
          alt: ""
        },
        null
      );
    }, Q = (t, a, l) => {
      const s = l && (c.value === "user" ? l[e.userFilterMap.avatar] : l[e.deptFilterMap.avatar]) || e.getUserPictureUrl(t, a), h = Ge(s, l);
      return s && !I.value.includes(s) && h ? h : qe(a);
    }, pe = (t) => {
      const a = c.value === "user" ? t[e.userFilterMap.name] || t.name : t[e.deptFilterMap.name] || t.name, l = c.value === "user" ? t[e.userFilterMap.id] : t[e.deptFilterMap.id], s = c.value === "user" ? t[e.userFilterMap.title] : t[e.deptFilterMap.title];
      return n(
        "div",
        {
          class: [
            i.bem("select-modal", "personel-list", "item"),
            i.is("selected", b.value === l)
          ],
          onClick: () => Te(t)
        },
        [
          n(
            "div",
            {
              class: i.bem("select-modal", "personel-list", "text")
            },
            [
              n(
                "div",
                {
                  class: i.bem(
                    "select-modal",
                    "personel-list",
                    "text-img"
                  ),
                  style: "background-color:".concat(X(a))
                },
                [Q(l, a, t)]
              ),
              n(
                "div",
                {
                  class: i.bem(
                    "select-modal",
                    "personel-list",
                    "text-label"
                  )
                },
                [a]
              ),
              s && n(
                "div",
                {
                  class: i.bem(
                    "select-modal",
                    "personel-list",
                    "title-label"
                  )
                },
                [s]
              ),
              l === e.context.srfuserid ? n(
                "div",
                {
                  class: i.bem(
                    "select-modal",
                    "personel-list",
                    "myself"
                  )
                },
                [N("我自己")]
              ) : null
            ]
          ),
          We(l)
        ]
      );
    }, Xe = (t, a) => {
      const { context: l, params: s } = e;
      return n(
        O("iBizControlShell"),
        {
          class: i.b("panel-item"),
          data: t,
          modelData: a,
          context: l,
          params: s
        },
        null
      );
    }, Qe = (t, a) => n(
      O("el-popover"),
      {
        target: "hover",
        placement: "right",
        offset: 24,
        width: "auto"
      },
      {
        reference: () => pe(t),
        default: () => Xe(t, a)
      }
    ), et = (t, a) => {
      z.value && (c.value === "user" ? t - a < 305 && (C.value || V()) : t - a < 265 && (C.value || V()));
    }, he = (t) => {
      var a;
      const l = Be(t), s = (a = e.deACMode) == null ? void 0 : a.itemLayoutPanel;
      return n(
        Ot,
        {
          items: l,
          itemHeight: 36,
          class: [
            i.be("select-modal", "personel-list"),
            i.be(
              "select-modal",
              "personel-list-".concat(c.value)
            )
          ],
          onScrollEvent: (h, M) => et(h, M)
        },
        {
          default: (h) => s ? Qe(h, s) : pe(h)
        }
      );
    }, me = (t) => {
      w.value = t;
    }, tt = () => n(
      "div",
      {
        class: i.be("select-modal", "deptpersonel")
      },
      [
        n(
          "div",
          {
            class: i.bem("select-modal", "deptpersonel", "dept")
          },
          [
            n(
              "div",
              {
                class: "collpase-icon"
              },
              [
                w.value ? n(
                  "i",
                  {
                    class: "fa fa-angle-right",
                    "aria-hidden": "true",
                    onClick: () => me(!1)
                  },
                  null
                ) : n(
                  "i",
                  {
                    class: "fa fa-angle-down",
                    "aria-hidden": "true",
                    onClick: () => me(!0)
                  },
                  null
                )
              ]
            ),
            n(
              "svg",
              {
                viewBox: "0 0 16 16",
                xmlns: "http://www.w3.org/2000/svg",
                height: "1em",
                width: "1em",
                preserveAspectRatio: "xMidYMid meet",
                focusable: "false"
              },
              [
                n(
                  "g",
                  {
                    id: "aqf1.Base基础/1.icon图标/2.normal/部门",
                    "stroke-width": "1",
                    "fill-rule": "evenodd"
                  },
                  [
                    n(
                      "path",
                      {
                        d: "M9 1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-.39l-.016 2.138H11.5a2.1 2.1 0 0 1 2.095 1.95l.005.15V11h.4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h.4V9.238a.9.9 0 0 0-.787-.893l-.113-.007h-7a.9.9 0 0 0-.893.787l-.007.113V11H4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h.4V9.238a2.1 2.1 0 0 1 1.95-2.094l.15-.006h2.894L7.41 5H7a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h2zm4.8 11.2h-1.6v1.6h1.6v-1.6zm-10 0H2.2v1.6h1.6v-1.6zm5-10H7.2v1.6h1.6V2.2z",
                        id: "aqf形状结合",
                        fill: "currentColor"
                      },
                      null
                    )
                  ]
                )
              ]
            ),
            n("span", null, [
              "".concat(e.context.srfusername, "的团队")
            ]),
            n("span", null, [N("·")]),
            n("span", null, [e.depttotal])
          ]
        ),
        w.value ? null : n(
          "div",
          {
            class: i.bem(
              "select-modal",
              "deptpersonel",
              "dept-person"
            )
          },
          [he(f.value)]
        )
      ]
    ), at = () => {
      let t, a;
      return n(
        "div",
        {
          class: i.be("select-modal", "bottom")
        },
        [
          n(
            O("el-button"),
            {
              type: "text",
              onClick: Re
            },
            te(t = ibiz.i18n.t("app.cancel")) ? t : {
              default: () => [t]
            }
          ),
          n(
            O("el-button"),
            {
              onClick: _e
            },
            te(a = ibiz.i18n.t("app.confirm")) ? a : {
              default: () => [a]
            }
          )
        ]
      );
    }, ve = () => yt(
      n(
        "div",
        {
          class: i.b("select-modal"),
          onPointerdown: W,
          onPointerup: W,
          onClick: W
        },
        [
          He(),
          Ze(),
          n(
            "div",
            {
              class: i.be("select-modal", "container"),
              style: {
                height: "".concat(P.value, "px")
              }
            },
            [c.value === "user" ? he(p.value) : tt()]
          ),
          e.enableBottomButton && at()
        ]
      ),
      [[Mt("loading"), C.value]]
    ), fe = () => n(
      "div",
      {
        class: i.b("no-select-value")
      },
      [
        n(
          "svg",
          {
            viewBox: "0 0 16 16",
            xmlns: "http://www.w3.org/2000/svg",
            height: "1em",
            width: "1em",
            preserveAspectRatio: "xMidYMid meet",
            focusable: "false"
          },
          [
            n(
              "g",
              {
                id: "azeaction/user-add",
                "stroke-width": "1"
              },
              [
                n(
                  "path",
                  {
                    d: "M7.9.4a4.1 4.1 0 1 1-.265 8.192.593.593 0 0 1-.268.126 6.411 6.411 0 0 0-4.624 3.698A6.375 6.375 0 0 0 2.2 15 .6.6 0 0 1 1 15c0-1.07.222-2.11.645-3.069a7.622 7.622 0 0 1 4.069-3.963A4.1 4.1 0 0 1 7.9.4zm4.6 9.9a.6.6 0 0 1 .592.503l.008.097-.001 1.399 1.401.001a.6.6 0 0 1 .592.503l.008.097a.6.6 0 0 1-.503.592l-.097.008-1.401-.001.001 1.401a.6.6 0 0 1-.503.592l-.097.008a.6.6 0 0 1-.592-.503L11.9 14.9v-1.401l-1.4.001a.6.6 0 0 1-.592-.503L9.9 12.9a.6.6 0 0 1 .503-.592l.097-.008h1.4v-1.4a.6.6 0 0 1 .503-.592l.097-.008zM7.9 1.6a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8z",
                    id: "aze形状结合",
                    fill: "currentColor"
                  },
                  null
                )
              ]
            )
          ]
        ),
        n("span", null, [N("未设置")])
      ]
    ), lt = () => n(
      "div",
      {
        class: i.b("no-select-value")
      },
      [n("span", null, [N("未设置")])]
    ), ge = () => {
      var t, a;
      if (e.multiple) {
        const l = [];
        if (b.value) {
          const h = b.value.split(e.separator), M = T.value.split(e.separator);
          h.forEach((x, k) => {
            l.push({
              id: x,
              name: M[k]
            });
          });
        }
        let s = !1;
        return A > 0 && (s = e.enableBottomButton ? A < ((t = U.value) == null ? void 0 : t.length) : A < ((a = g.value) == null ? void 0 : a.length), l == null || l.splice(A, l == null ? void 0 : l.length)), n(
          "div",
          {
            class: [
              i.b("select-value-multiple"),
              i.is("hidden", s)
            ]
          },
          [
            l == null ? void 0 : l.map((h) => {
              let M;
              return n(
                "div",
                {
                  class: i.be("select-value-multiple", "item")
                },
                [
                  n(
                    "div",
                    {
                      class: [
                        i.be("select-value", "textimg"),
                        i.bem(
                          "select-value-multiple",
                          "item",
                          "textimg"
                        )
                      ],
                      style: "background-color:".concat(
                        X(h.name)
                      )
                    },
                    [
                      n(
                        O("el-tooltip"),
                        {
                          class: "box-item",
                          effect: "dark",
                          content: h.name,
                          placement: "top",
                          offset: 12
                        },
                        te(M = Q(h.id, h.name, h)) ? M : {
                          default: () => [M]
                        }
                      ),
                      u.readonly ? null : n(
                        "div",
                        {
                          class: [
                            i.bem(
                              "select-value-multiple",
                              "item",
                              "close"
                            )
                          ],
                          onClick: (x) => Pe(h, x)
                        },
                        [
                          n(
                            "i",
                            {
                              class: "fa fa-close",
                              "aria-hidden": "true"
                            },
                            null
                          )
                        ]
                      )
                    ]
                  )
                ]
              );
            }),
            s ? n(
              O("el-tooltip"),
              {
                class: i.b("multiple-ellipsis"),
                "popper-class": i.be(
                  "multiple-ellipsis",
                  "popper"
                ),
                effect: "dark",
                content: T.value,
                placement: "top",
                offset: 12
              },
              {
                default: () => [
                  n(
                    "span",
                    {
                      class: i.be(
                        "multiple-ellipsis",
                        "default"
                      )
                    },
                    [N("...")]
                  )
                ]
              }
            ) : null
          ]
        );
      }
    }, be = () => e.multiple ? n(
      "div",
      {
        class: i.b("select-value-multiple")
      },
      [
        n(
          "div",
          {
            class: i.b("select-value"),
            title: "选择人员"
          },
          [
            n(
              "svg",
              {
                viewBox: "0 0 16 16",
                xmlns: "http://www.w3.org/2000/svg",
                height: "1em",
                width: "1em",
                preserveAspectRatio: "xMidYMid meet",
                focusable: "false"
              },
              [
                n(
                  "g",
                  {
                    id: "azeaction/user-add",
                    "stroke-width": "1"
                  },
                  [
                    n(
                      "path",
                      {
                        d: "M7.9.4a4.1 4.1 0 1 1-.265 8.192.593.593 0 0 1-.268.126 6.411 6.411 0 0 0-4.624 3.698A6.375 6.375 0 0 0 2.2 15 .6.6 0 0 1 1 15c0-1.07.222-2.11.645-3.069a7.622 7.622 0 0 1 4.069-3.963A4.1 4.1 0 0 1 7.9.4zm4.6 9.9a.6.6 0 0 1 .592.503l.008.097-.001 1.399 1.401.001a.6.6 0 0 1 .592.503l.008.097a.6.6 0 0 1-.503.592l-.097.008-1.401-.001.001 1.401a.6.6 0 0 1-.503.592l-.097.008a.6.6 0 0 1-.592-.503L11.9 14.9v-1.401l-1.4.001a.6.6 0 0 1-.592-.503L9.9 12.9a.6.6 0 0 1 .503-.592l.097-.008h1.4v-1.4a.6.6 0 0 1 .503-.592l.097-.008zM7.9 1.6a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8z",
                        id: "aze形状结合",
                        fill: "currentColor"
                      },
                      null
                    )
                  ]
                )
              ]
            )
          ]
        )
      ]
    ) : n(
      "div",
      {
        class: i.b("select-value")
      },
      [
        n(
          "div",
          {
            class: i.be("select-value", "textimg"),
            style: "background-color:".concat(
              X(T.value)
            )
          },
          [Q(b.value, T.value)]
        ),
        n(
          "div",
          {
            class: i.be("select-value", "text")
          },
          [
            n(
              "div",
              {
                class: i.bem("select-value", "text", "label")
              },
              [T.value]
            )
          ]
        ),
        u.readonly ? null : n(
          "i",
          {
            class: [
              "fa fa-times-circle",
              i.be("select-value", "close")
            ],
            "aria-hidden": "true",
            onClick: (t) => oe(t)
          },
          null
        )
      ]
    ), we = async () => {
      var t, a;
      z.value = !0;
      const { context: l, params: s } = e.handlePublicParams(
        u.data,
        e.context,
        e.params
      ), h = e.fill(e.userUrl, l, s, u.data).replaceAll("//", "/"), M = e.fill(e.deptUrl, l, s, u.data).replaceAll("//", "/");
      (h !== e.copyUserUrl || M !== e.copyDeptUrl || u.data && u.data.srfkey !== R.value) && (R.value = ((t = u.data) == null ? void 0 : t.srfkey) || "", p.value = [], f.value = [], e.resetState(), V(!0)), await Ft(), (a = K.value) == null || a.focus();
    }, it = () => T.value ? be() : fe(), st = () => T.value ? [ge()] : lt(), nt = () => n(
      O("el-popover"),
      Et(
        {
          visible: S.value,
          "onUpdate:visible": (t) => S.value = t,
          trigger: "click",
          popperClass: i.b("person-select"),
          placement: "top-start",
          width: 320,
          teleported: !0,
          onShow: () => we(),
          onHide: () => ce(),
          onBeforeEnter: () => Ee()
        },
        o
      ),
      {
        reference: () => it(),
        default: () => ve()
      }
    ), rt = () => [ge(), nt()], ye = () => {
      G();
    };
    return Fe(() => {
      j.value && (window == null || window.addEventListener("resize", ye), G());
    }), wt(() => {
      e.resetState(), j.value && (window == null || window.removeEventListener("resize", ye)), H.value = {}, J.clear();
    }), {
      ns: i,
      c: e,
      refValue: b,
      curValue: d,
      valueText: T,
      loading: C,
      items: p,
      isEditable: F,
      showFormDefaultContent: Ie,
      modelVisible: S,
      curAttentionValue: _,
      attentionRef: j,
      readonlyState: Z,
      onClear: oe,
      load: V,
      setEditable: re,
      renderDropModal: ve,
      renderNoSelectValue: fe,
      renderSelectInput: be,
      onPopShow: we,
      onPageHide: ce,
      onAttentionChange: je,
      renderEditContent: rt,
      renderReadonlyContent: st
    };
  },
  render() {
    return n(
      "div",
      {
        ref: "attentionRef",
        class: [
          this.ns.b(),
          this.ns.b("person-value"),
          this.disabled ? this.ns.m("disabled") : "",
          this.readonlyState ? this.ns.m("readonly") : "",
          this.ns.is("editable", this.isEditable),
          this.ns.is("show-default", this.showFormDefaultContent)
        ]
      },
      [
        this.readonlyState ? this.renderReadonlyContent() : this.renderEditContent(),
        n(
          xt,
          {
            disabled: this.disabled,
            value: this.curAttentionValue,
            codeListId: this.c.codeListId,
            codeListMap: this.c.codeListMap,
            defaultSelected: this.c.defaultSelected,
            controller: this.c,
            onChange: this.onAttentionChange
          },
          null
        )
      ]
    );
  }
});
class St extends ht {
  constructor() {
    super(...arguments), this.operatorMap = /* @__PURE__ */ new Map(), this.total = 0, this.currentNumber = -1, this.page = 0, this.deptpage = 0, this.deptcurrentNumber = -1, this.depttotal = 0, this.size = 20, this.multiple = !0, this.separator = ",", this.pickupView = null, this.linkView = null, this.userFilterMap = {
      id: "id",
      name: "name",
      title: "title",
      avatar: ""
    }, this.deptFilterMap = {
      id: "id",
      name: "name",
      title: "title",
      avatar: ""
    }, this.valueItem = "", this.keyName = "srfkey", this.textName = "srfmajortext", this.interfaceName = "", this.sort = "", this.noAC = !1, this.noButton = !1, this.dataItems = [], this.objectIdField = "", this.objectNameField = "", this.objectValueField = "", this.userUrl = "", this.deptUrl = "", this.copyUserUrl = "", this.copyDeptUrl = "", this.userMethod = "post", this.deptMethod = "post", this.contextReg = /\$\{context.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g, this.dataReg = /\$\{data.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g, this.paramsReg = /\$\{params.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g, this.valueType = "OBJECTS", this.codeListId = "", this.attentionTypeField = "type", this.selfFillMap = {
      user_id: "user_id",
      user_name: "name",
      user_title: "title"
    }, this.defaultSelected = "", this.defaultAttentionValue = "", this.enableBottomButton = !1, this.fieldMap = "", this.userAuthEntity = "", this.deptAuthEntity = "";
  }
  async onInit() {
    var r, o, i, e, d, p, f;
    if (super.onInit(), this.initParams(), await this.getOperatorUserList(), this.valueItem = ((r = this.model.valueItemName) == null ? void 0 : r.toLowerCase()) || "", this.model.appDataEntityId && (this.model.appDEDataSetId && (this.interfaceName = this.model.appDEDataSetId), this.model.appDEACModeId && (this.deACMode = await mt(
      this.model.appDEACModeId,
      this.model.appDataEntityId,
      this.context.srfappid
    ), this.deACMode))) {
      const { minorSortAppDEFieldId: w, minorSortDir: F } = this.deACMode;
      w && F && (this.sort = "".concat(w.toLowerCase(), ",").concat(F.toLowerCase())), this.deACMode.textAppDEFieldId && (this.textName = this.deACMode.textAppDEFieldId), this.deACMode.valueAppDEFieldId && (this.keyName = this.deACMode.valueAppDEFieldId), this.deACMode.deacmodeDataItems && (this.dataItems = [], this.deACMode.deacmodeDataItems.forEach((y) => {
        y.id !== "value" && y.id !== "text" && this.dataItems.push(y);
      }));
    }
    const b = [
      "PICKEREX_DROPDOWNVIEW",
      "PICKEREX_DROPDOWNVIEW_LINK",
      "PICKUPVIEW"
    ];
    this.model.editorType && b.includes(this.model.editorType) && this.initPickupViewParams(), this.objectIdField = (i = (o = this.model) == null ? void 0 : o.objectIdField) == null ? "" : i.toLowerCase(), this.objectNameField = (d = (e = this.model) == null ? void 0 : e.objectNameField) == null ? "" : d.toLowerCase(), this.objectValueField = (f = (p = this.model) == null ? void 0 : p.objectValueField) == null ? "" : f.toLowerCase();
  }
  /**
   * 初始化noAc和noButton
   */
  initParams() {
    var r, o, i, e, d, p, f, b, w, F, y, E;
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
    if (this.userUrl = this.editorParams.URL, this.deptUrl = this.editorParams.DEPTURL, this.userMethod = this.editorParams.USERMETHOD || "post", this.deptMethod = this.editorParams.DEPTMETHOD || "post", this.separator = this.editorParams.SEPARATOR || ",", (r = this.editorParams) != null && r.CODELISTID && (this.codeListId = (o = this.editorParams) == null ? void 0 : o.CODELISTID), (i = this.editorParams) != null && i.DEFAULTATNVALUE && (this.defaultAttentionValue = (e = this.editorParams) == null ? void 0 : e.DEFAULTATNVALUE), (d = this.editorParams) != null && d.VALUETYPE && (this.valueType = (p = this.editorParams) == null ? void 0 : p.VALUETYPE), (f = this.editorParams) != null && f.ENABLEBOTTOMBUTTON && (this.enableBottomButton = ((b = this.editorParams) == null ? void 0 : b.ENABLEBOTTOMBUTTON) === "true"), (w = this.editorParams) != null && w.FIELDMAP && (this.fieldMap = (F = this.editorParams) == null ? void 0 : F.FIELDMAP), this.editorParams.userauthentity && (this.userAuthEntity = this.editorParams.userauthentity), this.editorParams.deptauthentity && (this.deptAuthEntity = this.editorParams.deptauthentity), this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, "CODELISTMAP"))
      try {
        const c = JSON.parse(
          (y = this.editorParams) == null ? void 0 : y.CODELISTMAP
        );
        Object.assign(this.codeListMap, c);
      } catch (c) {
        this.codeListMap = { FOLLOWED: [20, 30, 40], NOTFOLLOWING: [10] };
      }
    if (this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, "SELFFILLMAP"))
      try {
        const c = JSON.parse(
          (E = this.editorParams) == null ? void 0 : E.SELFFILLMAP
        );
        Object.assign(this.selfFillMap, c);
      } catch (c) {
        this.selfFillMap = {
          user_id: "user_id",
          user_name: "name",
          user_title: "title"
        };
      }
    if (this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, "USERMAP"))
      try {
        const c = JSON.parse(this.editorParams.USERMAP);
        Object.assign(this.userFilterMap, c);
      } catch (c) {
        this.userFilterMap = {
          id: "id",
          name: "name",
          title: "title",
          avatar: ""
        };
      }
    if (this.editorParams && Object.prototype.hasOwnProperty.call(this.editorParams, "DEPTMAP"))
      try {
        const c = JSON.parse(this.editorParams.DEPTMAP);
        Object.assign(this.deptFilterMap, c);
      } catch (c) {
        this.deptFilterMap = {
          id: "id",
          name: "name",
          title: "title",
          avatar: ""
        };
      }
  }
  /**
   * 初始化选择视图相关参数
   */
  async initPickupViewParams() {
    this.model.pickupAppViewId && (this.pickupView = await ibiz.hub.config.view.get(
      this.model.pickupAppViewId
    ));
  }
  /**
   * 初始化链接视图相关参数
   */
  async initLinkViewParams() {
    this.model.linkAppViewId && (this.linkView = await ibiz.hub.config.view.get(
      this.model.linkAppViewId
    ));
  }
  /**
   * 初始化当前操作者数据
   */
  async initCurrentOperator(r, o = {}) {
    const i = this.context.srfuserid;
    if (!i)
      return;
    const e = await this.getServiceData(
      "department",
      r,
      {},
      {
        ...o,
        page: 0,
        size: 20,
        n_id_eq: i
      }
    );
    e && e.data && e.data.length > 0 && (this.currentOperator = e.data.find(
      (d) => d[this.deptFilterMap.id] === i
    ));
  }
  /**
   * 重置状态
   */
  resetState() {
    this.total = 0, this.currentNumber = -1, this.page = 0, this.deptpage = 0, this.depttotal = 0, this.deptcurrentNumber = -1, this.copyDeptUrl = "", this.copyUserUrl = "";
  }
  /**
   * 加载更多
   */
  async loadMore(r, o, i = {}) {
    if (o === "user" && this.currentNumber < this.total) {
      const e = await this.getServiceData(o, r, i);
      if (e)
        return this.page += 1, this.currentNumber < 0 && (this.currentNumber += 1), this.currentNumber += this.size, this.total = e.total ? Number(e.total) : Number(e.headers["x-total"]), e.data.forEach((d) => {
          Object.keys(this.userFilterMap).forEach((p) => {
            d[p] = d[this.userFilterMap[p]];
          });
        }), e;
    } else if (o === "department" && this.deptcurrentNumber < this.depttotal) {
      const e = await this.getServiceData(o, r, i);
      if (e)
        return this.deptpage += 1, this.deptcurrentNumber < 0 && (this.deptcurrentNumber += 1), this.deptcurrentNumber += this.size, this.depttotal = e.total ? Number(e.total) : Number(e.headers["x-total"]), e.data.forEach((d) => {
          Object.keys(this.deptFilterMap).forEach((p) => {
            d[p] = d[this.deptFilterMap[p]];
          });
        }), e;
    }
  }
  /**
   * 触发界面行为组点击事件
   *
   * @param {IUIActionGroupDetail} detail
   * @param {GridRowState} row
   * @param {MouseEvent} event
   * @return {*}  {Promise<void>}
   * @memberof GridFieldColumnController
   */
  async onActionClick(r, o, i) {
    var d, p;
    const e = r.uiactionId;
    await vt.execAndResolved(
      e,
      {
        context: this.context,
        params: this.params,
        data: o,
        view: (p = (d = this.parent.form) == null ? void 0 : d.ctx) == null ? void 0 : p.view,
        event: i
      },
      r.appId
    );
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
  fill(r, o = {}, i = {}, e = {}) {
    if (q(r)) {
      if (q(o)) {
        const d = r.match(this.contextReg);
        d == null || d.forEach((p) => {
          const f = p.slice(10, p.length - 1);
          r = r.replace(
            "${context.".concat(f, "}"),
            o[f] || ""
          );
        });
      }
      if (q(i)) {
        const d = r.match(this.paramsReg);
        d == null || d.forEach((p) => {
          const f = p.slice(9, p.length - 1);
          r = r.replace(
            "${params.".concat(f, "}"),
            i[f] || ""
          );
        });
      }
      if (q(e)) {
        const d = r.match(this.dataReg);
        d == null || d.forEach((p) => {
          const f = p.slice(7, p.length - 1);
          r = r.replace(
            "${data.".concat(f, "}"),
            e[f] || ""
          );
        });
      }
    }
    return r;
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
  async getServiceData(r, o, i = {}, e) {
    const { context: d, params: p } = this.handlePublicParams(
      o,
      this.context,
      this.params
    ), f = {};
    this.sort && !Object.is(this.sort, "") && Object.assign(f, { sort: this.sort }), Object.assign(f, { size: this.size }), i && Object.assign(f, i);
    const b = e || gt(p, f);
    let w = "";
    const F = this.fill(this.userUrl, d, p, o).replaceAll("//", "/"), y = this.fill(this.deptUrl, d, p, o).replaceAll("//", "/");
    this.copyUserUrl = F, this.copyDeptUrl = y;
    let E = "post";
    const c = {};
    if (r === "user" ? (w = F, E = this.userMethod.toLowerCase(), Object.assign(c, { method: E, data: b })) : (w = y, E = this.deptMethod.toLowerCase(), Object.assign(c, { method: E, params: b })), w)
      return await ibiz.net.request(w, c);
    throw new ee(this.model, "请配置数据接口地址");
  }
  /**
   * 打开数据选择视图
   *
   * @param {IData} data 数据对象
   * @param {IData[]} selectedData 选中项集合
   * @returns {*}  {(Promise<IData[] | undefined>)}
   * @memberof PersonelSelectController
   */
  async openPickUpView(r, o) {
    await this.initPickupViewParams();
    const { context: i, params: e } = this.handlePublicParams(
      r,
      this.context,
      this.params
    );
    if (o && (e.selectedData = o), !this.pickupView)
      throw new ee(this.model, "请配置数据选择视图");
    const d = await ibiz.commands.execute(
      Me.TAG,
      this.pickupView.id,
      i,
      e,
      { openMode: "POPUPMODAL" }
    );
    if (d && d.ok && d.data)
      return d.data;
    ibiz.log.debug("模态取消或关闭异常", d);
  }
  /**
   * 打开数据链接视图
   */
  async openLinkView(r) {
    const o = this.context.clone();
    r[this.valueItem] && (o.srfkey = r[this.valueItem]);
    const { context: i, params: e } = this.handlePublicParams(
      r,
      o,
      this.params
    ), { linkAppViewId: d } = this.model;
    if (!d)
      throw new ee(this.model, "请配置数据链接视图");
    return ibiz.commands.execute(Me.TAG, d, i, e);
  }
  /**
   * 计算回填数据
   *
   * @author lxm
   * @date 2022-10-24 16:10:24
   * @param {IData} data 选中数据
   * @returns {*}  {Promise<Array<{ id: string; value: any }>>}
   */
  async calcFillDataItems(r) {
    return this.deACMode ? this.dataItems.length === 0 ? [] : await Promise.all(
      this.dataItems.map((o) => {
        const i = r.map((e) => e[o.appDEFieldId]).join(this.separator);
        return o.format || o.convertToCodeItemText && o.codeListId || o.customCode, { id: o.id, value: i };
      })
    ) : [];
  }
  /**
   * 处理对象数据类型抛值
   * @param {IData} select
   * @return {*}
   * @author: zhujiamin
   * @Date: 2023-08-22 15:58:56
   */
  handleObjectParams(r) {
    const o = {};
    return this.objectIdField && Object.assign(o, {
      [this.objectIdField]: r[this.keyName]
    }), this.objectNameField && Object.assign(o, {
      [this.objectNameField]: r[this.textName]
    }), this.objectValueField && Object.assign(o, {
      [this.objectValueField]: le(r)
    }), o;
  }
  /**
   * 获取操作用户列表
   *
   * @return {*}  {Promise<void>}
   * @memberof AttentionController
   */
  async getOperatorUserList() {
    const r = await ibiz.hub.getApp(this.context.srfappid);
    let o = [];
    o = await r.codeList.get("SysOperator", this.context, this.params), this.operatorMap = new Map(o.map((i) => [i.value, i]));
  }
  /**
   * 动态匹配${}
   *
   * @param {string} str
   * @param {Record<string, IData>} values
   * @return {*}  {string}
   */
  dynamicMatch(r, o) {
    return r.replace(/\${(.*?)}/g, (i, e) => {
      const [d, p] = e.split("."), f = o[d];
      return f && f[p] || "";
    });
  }
  /**
   * 获取人员头像路径
   *
   * @return {*}  {string}
   * @memberof AttentionController
   */
  getUserPictureUrl(r, o) {
    if (this.operatorMap.size <= 0)
      return "";
    let i = {};
    return this.operatorMap.get(r) ? i = this.operatorMap.get(r) || {} : Array.from(this.operatorMap.entries()).find((e) => {
      const d = e[1] || {};
      return d.text && o && d.text === o ? (i = d, !0) : !1;
    }), i.data && i.data.iconurl ? i.data.iconurl : "";
  }
}
class Pt {
  constructor() {
    this.component = "IBizAttention", this.formEditor = "IBizAttention", this.gridEditor = "IBizAttention";
  }
  async createController(r, o) {
    const i = new St(r, o);
    return await i.init(), i;
  }
}
const Tt = pt(ae, function(u) {
  u.component(ae.name, ae), ft(
    "EDITOR_CUSTOMSTYLE_ATTENTION",
    () => new Pt()
  );
}), zt = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(u) {
    u.use(Tt);
  }
};
export {
  Tt as IBizAttention,
  zt as default
};
