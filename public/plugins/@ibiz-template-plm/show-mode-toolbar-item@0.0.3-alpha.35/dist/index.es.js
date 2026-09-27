import './assets/style.css';
import './assets/style.css';
import { withInstall as v, useNamespace as h } from "@ibiz-template/vue3-util";
import { registerToolbarItemProvider as u, ToolbarController as d } from "@ibiz-template/runtime";
import { defineComponent as p, ref as b, createVNode as i, resolveComponent as g } from "vue";
var f = Object.defineProperty, w = (e, t, o) => t in e ? f(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o, I = (e, t, o) => (w(e, typeof t != "symbol" ? t + "" : t, o), o);
const n = /* @__PURE__ */ p({
  name: "IBizShowModeToolbarItem",
  props: {
    item: {
      type: Object,
      required: !0
    },
    controller: {
      type: d,
      required: !0
    }
  },
  setup(e) {
    const t = h("show-mode-toolbar-item"), o = e.controller, a = [{
      icon: {
        htmlStr: '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" height="1em" width="1em" preserveAspectRatio="xMidYMid meet" focusable="false" style="fill: currentcolor;"><g stroke-width="1" fill-rule="evenodd"><path d="M7.353 6.926V4.992H5.937V1h4.158v3.992H8.553v1.934H14.395v4.153h1.479v3.993h-4.158V11.08h1.479V8.125H8.553v2.933h1.542v3.993H5.937v-3.993h1.416V8.126H2.679v2.933h1.479v3.993H0v-3.993h1.479V6.926H7.353zm-.216-4.727v1.594h1.758V2.199H7.137zM1.2 12.26v1.592h1.758v-1.593H1.2zm11.716.02v1.594h1.758V12.28h-1.758zm-5.779-.02v1.592h1.758v-1.593H7.137z"></path></g></svg>'
      },
      text: "树状",
      value: "tree"
    }, {
      icon: {
        cssClass: "fa fa-reorder"
      },
      text: "平铺",
      value: "grid"
    }], c = "SHOW_MODE_".concat(o.context.project, "_").concat(o.view.model.codeName), r = b(a[0].value), l = localStorage.getItem(c);
    return (l === "tree" || l === "grid") && (r.value = l), e.item.sysImage && (a[1].icon = e.item.sysImage), {
      ns: t,
      items: a,
      activeItem: r,
      onClick: async (m, s) => {
        m.stopPropagation(), s.value !== r.value && (r.value = s.value, localStorage.setItem(c, s.value), await o.onItemClick(e.item, m, {
          showMode: s.value
        }));
      }
    };
  },
  render() {
    return i("div", {
      class: this.ns.b()
    }, [i("div", {
      class: this.ns.b("content")
    }, [this.items.map((e) => i("div", {
      class: [this.ns.b("item"), this.ns.is("active", this.activeItem === e.value)],
      title: e.text,
      onClick: (t) => this.onClick(t, e)
    }, [i(g("iBizIcon"), {
      class: this.ns.be("item", "icon"),
      icon: e.icon
    }, null)]))])]);
  }
});
class H {
  constructor() {
    I(this, "component", "IBizShowModeToolbarItem");
  }
}
const M = v(
  n,
  function(e) {
    e.component(n.name, n), u(
      "TOOLBAR_ITEM_SHOW_MODE_TOOLBAR_ITEM",
      () => new H()
    );
  }
), x = {
  install(e) {
    e.use(M);
  }
};
export {
  x as default
};
