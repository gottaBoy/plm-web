import './assets/style.css';
import './assets/style.css';
import { defineComponent as P, ref as h, watch as x, createVNode as n, resolveComponent as m } from "vue";
import { getDropdownProps as B, getEditorEmits as T, useNamespace as z } from "@ibiz-template/vue3-util";
import { registerEditorProvider as L, CodeListEditorController as O } from "@ibiz-template/runtime";
var M = Object.defineProperty, N = (t, r, s) => r in t ? M(t, r, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[r] = s, g = (t, r, s) => (N(t, typeof r != "symbol" ? r + "" : r, s), s);
const C = /* @__PURE__ */ P({
  name: "IBizTreePicker",
  props: B(),
  emits: T(),
  setup(t, {
    emit: r
  }) {
    const s = z("tree-picker"), o = t.controller, v = h(!1), c = h([]), d = h(), p = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), f = (e, i) => {
      e.length && e.forEach((a) => {
        p.set(a.value, a), u.set(a.value, i), a.children && f(a.children, a);
      });
    }, k = (e, i) => !e.children || !e.children.length ? !0 : e.children.every((a) => i.includes("".concat(a.value))), b = (e, i) => {
      if (e.children && e.children.forEach((a) => {
        b(a, i);
      }), !k(e, i)) {
        const a = i.indexOf("".concat(e.value));
        a !== -1 && i.splice(a, 1);
      }
    }, y = () => {
      const e = [];
      typeof t.value == "string" && e.push(...t.value.split(",").filter(Boolean)), e.map((i) => p.get(i)).filter(Boolean).forEach((i) => {
        b(i, e);
      }), d.value && d.value.setCheckedKeys(e);
    };
    x(() => t.value, async () => {
      v.value || (c.value = await o.loadCodeList(t.data), f(c.value || []), v.value = !0), y();
    }, {
      immediate: !0
    });
    const E = (e) => u.get(e.value) ? [...E(u.get(e.value)), e] : [e];
    return {
      ns: s,
      c: o,
      tree: d,
      codeListItems: c,
      handleCheck: (e, i) => {
        const a = /* @__PURE__ */ new Map();
        (i.checkedNodes || []).forEach((I) => {
          E(I).forEach((l) => {
            l && l.value && !a.has(l.value) && a.set(l.value, l);
          });
        });
        const w = [...a.keys()].join(",");
        r("change", w);
      }
    };
  },
  render() {
    return n("div", {
      class: [this.ns.b(), this.disabled && this.ns.m("disabled")]
    }, [n(m("el-tree"), {
      ref: "tree",
      data: this.codeListItems,
      "show-checkbox": !0,
      "node-key": "value",
      props: {
        label: "text",
        children: "children",
        disabled: () => this.disabled ? "value" : ""
      },
      onCheck: this.handleCheck
    }, {
      default: ({
        data: t
      }) => {
        var r;
        return n("div", {
          class: this.ns.b("item")
        }, [(r = t.sysImage) != null && r.imagePath ? n(m("iBizIcon"), {
          class: this.ns.be("item", "icon"),
          icon: t.sysImage
        }, null) : n(m("iBizIcon"), {
          class: this.ns.be("item", "icon"),
          icon: {
            cssClass: "fa fa-file-text-o"
          }
        }, null), n("span", {
          class: this.ns.be("item", "text")
        }, [t.text || ""])]);
      }
    })]);
  }
});
class R {
  constructor() {
    g(this, "formEditor", "IBizTreePicker"), g(this, "gridEditor", "IBizTreePicker");
  }
  async createController(r, s) {
    const o = new O(r, s);
    return await o.init(), o;
  }
}
const K = {
  install(t) {
    t.component(C.name, C), L(
      "EDITOR_CUSTOMSTYLE_TREE_PICKER",
      () => new R()
    );
  }
};
export {
  K as default
};
