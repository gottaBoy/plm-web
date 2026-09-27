import { withInstall as B, useControlController as z, useNamespace as G } from "@ibiz-template/vue3-util";
import { registerControlProvider as R, ControlType as w, GridController as A } from "@ibiz-template/runtime";
import { defineComponent as N, ref as k, watch as P, computed as S, createVNode as i, resolveComponent as d } from "vue";
import { createUUID as I } from "qx-util";
var L = Object.defineProperty, O = (e, a, s) => a in e ? L(e, a, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[a] = s, j = (e, a, s) => (O(e, typeof a != "symbol" ? a + "" : a, s), s);
class E extends A {
  /**
   * 简单列表控制器
   *
   * @readonly
   * @type {IListController}
   * @memberof CheckboxGridController
   */
  get simpleList() {
    var a;
    return (a = this.view.parentView) == null ? void 0 : a.getController("simplelist");
  }
  initState() {
    super.initState(), this.state.enableSelectAll = !1;
  }
  /**
   * @description 处理刷新模式（重写）
   * - 保留选中数据
   * @protected
   * @param {MDCtrlLoadParams} args
   * @memberof CheckboxGridController
   */
  handleRefreshMode(a) {
  }
  /**
   * 部件参数解析
   *
   * @protected
   * @memberof ControlController
   */
  handleControlParams() {
    super.handleControlParams(), this.controlParams.enableselectall && (this.state.enableSelectAll = this.controlParams.enableselectall === "true");
  }
  /**
   * 处理选中数据
   *
   * @param {string[]} selects 选中数据
   * @memberof CheckboxGridController
   */
  handleSelection(a) {
    const { items: s, selectedData: n } = this.state, o = n.filter(
      (h) => !s.find((m) => m.srfkey === h.srfkey)
    ), f = s.filter(
      (h) => a.includes(h.srfkey)
    );
    o.push(...f), this.setSelection(o), this.handlePushSimpleListItems();
  }
  /**
   * 处理添加简单列表数据
   *
   * @protected
   * @memberof CheckboxGridController
   */
  handlePushSimpleListItems() {
    var a;
    const { selectedData: s } = this.state, n = [...s];
    (a = this.simpleList) == null || a.setData(n);
  }
}
const v = /* @__PURE__ */ N({
  name: "CheckboxGrid",
  props: {
    modelData: {
      type: Object,
      required: !0
    },
    context: {
      type: Object,
      required: !0
    },
    params: {
      type: Object,
      default: () => ({})
    },
    provider: {
      type: Object
    },
    mdctrlActiveMode: {
      type: Number,
      default: void 0
    },
    singleSelect: {
      type: Boolean,
      default: void 0
    },
    rowEditOpen: {
      type: Boolean,
      default: void 0
    },
    isSimple: {
      type: Boolean,
      required: !1
    },
    data: {
      type: Array,
      required: !1
    },
    loadDefault: {
      type: Boolean,
      default: !0
    }
  },
  setup() {
    const e = z((...t) => new E(...t)), a = G("checkbox-grid"), s = k([]), n = {
      srfkey: I(),
      caption: "全选"
    }, o = k(!1);
    P(() => e.state.selectedData, (t) => {
      s.value = t.map((l) => l.srfkey), e.state.enableSelectAll && g(s.value) && s.value.unshift(n.srfkey);
    });
    const f = (t) => {
      !t || t === e.state.curPage || (e.state.curPage = t, e.load());
    }, h = (t) => {
      !t || t === e.state.size || (e.state.size = t, e.state.curPage !== 1 && (e.state.curPage = 1), e.load());
    }, m = () => {
      e.load();
    }, u = S(() => {
      const {
        state: t
      } = e;
      if (e.model.enableGroup) {
        const l = [];
        return t.groups.forEach((r) => {
          if (!r.children.length)
            return [];
          const p = [...r.children], c = p.shift();
          l.push({
            srfkey: (c == null ? void 0 : c.srfkey) || r.caption,
            isGroupData: !0,
            caption: r.caption,
            first: c,
            children: p
          });
        }), l;
      }
      return t.rows.map((l) => l.data);
    }), y = S(() => {
      if (e.isMultistageHeader)
        return e.model.degridColumns || [];
      const t = [];
      return e.state.columnStates.forEach((l) => {
        var r, p;
        if (l.hidden)
          return;
        const c = ((r = e.fieldColumns[l.key]) == null ? void 0 : r.model) || ((p = e.uaColumns[l.key]) == null ? void 0 : p.model);
        c && t.push(c);
      }), t;
    });
    e.state.enableSelectAll && P(() => u.value, () => {
      const t = s.value.filter((l) => l !== n.srfkey);
      if (o.value = g(t), !o.value) {
        s.value = t;
        return;
      }
      s.value.unshift(n.srfkey);
    });
    const g = (t) => u.value.length > 0 && t.length > 0 && u.value.every((l) => t.includes(l.srfkey)), b = (t) => {
      o.value = t;
      let l = [];
      t && (l = u.value.map((r) => r.srfkey)), e.handleSelection(l);
    }, D = (t) => {
      const l = t.filter((r) => r !== n.srfkey);
      if (e.state.enableSelectAll) {
        if (g(l)) {
          b(!o.value);
          return;
        }
        o.value = !1;
      }
      e.handleSelection(l);
    }, x = (t) => {
      t.preventDefault(), t.stopPropagation(), b(!o.value);
    }, C = () => {
      const {
        isLoaded: t
      } = e.state;
      return t && i(d("iBizNoData"), {
        text: e.model.emptyText,
        emptyTextLanguageRes: e.model.emptyTextLanguageRes
      }, null);
    };
    return {
      c: e,
      ns: a,
      onPageChange: f,
      onPageSizeChange: h,
      onPageRefresh: m,
      renderNoData: C,
      renderContent: () => u.value.length > 0 ? i(d("el-checkbox-group"), {
        modelValue: s.value,
        "onUpdate:modelValue": (t) => s.value = t,
        onChange: (t) => D(t)
      }, {
        default: () => [[e.state.enableSelectAll && i(d("el-checkbox"), {
          label: n.srfkey,
          checked: o.value,
          onClick: x
        }, {
          default: () => [i("span", {
            class: a.em("content", "item"),
            title: n.caption
          }, [n.caption])]
        }), u.value.map((t) => i(d("el-checkbox"), {
          label: t.srfkey
        }, {
          default: () => [i("span", {
            class: a.em("content", "item"),
            title: t[y.value[0].codeName]
          }, [t[y.value[0].codeName]])]
        }))]]
      }) : C()
    };
  },
  render() {
    if (!this.c.state.isCreated)
      return;
    const {
      state: e
    } = this.c, {
      enablePagingBar: a
    } = this.c.model;
    return i(d("iBizControlBase"), {
      class: [this.ns.is("enable-page", a), this.ns.is("enable-group", this.c.model.enableGroup), this.ns.b()],
      controller: this.c
    }, {
      default: () => [i("div", {
        class: this.ns.e("content")
      }, [this.renderContent()]), a && i(d("iBizPagination"), {
        total: e.total,
        curPage: e.curPage,
        size: e.size,
        onChange: this.onPageChange,
        onPageSizeChange: this.onPageSizeChange,
        onPageRefresh: this.onPageRefresh
      }, null)]
    });
  }
});
class q {
  constructor() {
    j(this, "component", "CheckboxGrid");
  }
}
const M = B(v, (e) => {
  e.component(v.name, v), R(
    "".concat(w.GRID, "_RENDER_CHECKBOX_GRID"),
    () => new q()
  );
}), H = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(e) {
    e.use(M);
  }
};
export {
  M as IBizCheckboxGrid,
  H as default
};
