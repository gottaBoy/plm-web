import './assets/style.css';
import './assets/style.css';
import { PluginStaticResource as P, registerViewProvider as C, convertNavData as S } from "@ibiz-template/runtime";
import { withInstall as V, useNamespace as D } from "@ibiz-template/vue3-util";
import { defineComponent as E, ref as r, onBeforeMount as I, createVNode as t, createTextVNode as o, resolveComponent as m, h as O, withDirectives as j, resolveDirective as x } from "vue";
import { notNilEmpty as N } from "qx-util";
var z = Object.defineProperty, $ = (a, e, n) => e in a ? z(a, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : a[e] = n, A = (a, e, n) => ($(a, typeof e != "symbol" ? e + "" : e, n), n);
const v = new P(import.meta.url), h = /* @__PURE__ */ E({
  name: "SharedCheckPage",
  props: {
    context: {
      type: Object,
      default: () => {
      }
    },
    params: {
      type: Object,
      default: () => ({})
    },
    modelData: {
      type: Object,
      required: !0
    },
    modal: {
      type: Object
    },
    state: {
      type: Object
    }
  },
  setup(a) {
    const e = D("shared-check-page"), n = r(""), d = r(!1), u = r(""), p = r(!1), i = r(""), k = () => {
      let s = {};
      const l = a.modelData.appViewNavParams;
      return N(l) && (s = S(l, a.params, a.context)), s;
    }, f = async () => {
      if (!u.value.length) {
        i.value = "密码不能为空";
        return;
      }
      p.value = !0;
      const s = k(), l = "".concat(s.check_entity, "/").concat(s.check_key, "/check_access_password");
      try {
        const c = await ibiz.net.post(l, {
          id: s.check_key,
          access_password: u.value
        });
        p.value = !1, c && c.ok && c.data && (c.data.check_access_password === "1" ? n.value = "pass" : i.value = "密码错误");
      } catch (c) {
        p.value = !1;
      }
    }, y = async () => {
      d.value = !0;
      const s = k(), l = "".concat(s.check_entity, "/").concat(s.check_key, "/check_shared");
      try {
        const c = await ibiz.net.get(l);
        if (d.value = !1, c && c.ok && c.data) {
          const {
            effective: g,
            check_access_pwd: w
          } = c.data;
          g === 0 ? n.value = "invalid" : g === 1 && (w === 0 ? n.value = "pass" : w === 1 && (n.value = "checkPwd"));
        }
      } catch (c) {
        d.value = !1;
      }
    }, _ = () => {
      i.value = "";
    }, b = (s) => {
      s && s.code === "Enter" && f();
    };
    return I(async () => {
      y();
    }), {
      ns: e,
      uiState: n,
      loading: d,
      renderInvalid: () => t("div", {
        class: e.e("link-invalid")
      }, [t("div", {
        class: e.e("link-container")
      }, [t("div", {
        class: e.em("link-container", "header")
      }, [t("img", {
        class: e.em("pwd-container", "header-logo"),
        src: "".concat(v.dir("assets/images/share.png"))
      }, null), t("span", null, [o("Wiki")])]), t("div", {
        class: e.em("link-container", "content")
      }, [t("img", {
        class: e.em("link-container", "unlink"),
        src: "".concat(v.dir("assets/images/unlink.png"))
      }, null), t("span", {
        class: e.em("link-container", "tip")
      }, [o("页面共享链接已过期")])])])]),
      renderVerifyPwd: () => t("div", {
        class: e.e("verify-pwd")
      }, [t("div", {
        class: e.e("pwd-container")
      }, [t("div", {
        class: e.em("pwd-container", "header")
      }, [t("img", {
        src: "".concat(v.dir("assets/images/share.png")),
        class: e.em("pwd-container", "header-logo")
      }, null), t("span", null, [o("Wiki")])]), t("div", {
        class: e.em("pwd-container", "content")
      }, [t("p", null, [o("访问密码")]), t(m("el-input"), {
        class: [e.em("pwd-container", "input"), e.is("error", !!i.value.length)],
        placeholder: "请输入密码",
        modelValue: u.value,
        "onUpdate:modelValue": (s) => u.value = s,
        onInput: _,
        onkeydown: b
      }, null), t(m("el-button"), {
        loading: p.value,
        class: e.em("pwd-container", "submit"),
        onClick: f
      }, {
        default: () => [o("确定")]
      }), t("p", {
        class: [e.e("error-msg"), e.is("visible", !!i.value.length)]
      }, [i.value])])])])
    };
  },
  render() {
    let a;
    return this.uiState === "invalid" && (a = this.renderInvalid()), this.uiState === "checkPwd" && (a = this.renderVerifyPwd()), this.uiState === "pass" && (a = O(m("IBizView"), {
      context: this.$props.context,
      params: this.$props.params,
      modelData: this.modelData,
      modal: this.modal,
      ...this.$attrs
    }, this.$slots)), j(t("div", {
      class: this.ns.b()
    }, [a]), [[x("loading"), this.loading]]);
  }
});
class B {
  constructor() {
    A(this, "component", "SharedCheckPage");
  }
}
const U = V(
  h,
  function(a) {
    a.component(h.name, h), C(
      "VIEW_CUSTOM_SHARED_CHECK_PAGE",
      () => new B()
    );
  }
), T = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(a) {
    a.use(U);
  }
};
export {
  U as IBizSharedCheckPage,
  T as default
};
