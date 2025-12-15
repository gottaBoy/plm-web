import './style.css';
var P = Object.defineProperty;
var f = (e, s, t) => s in e ? P(e, s, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[s] = t;
var h = (e, s, t) => (f(e, typeof s != "symbol" ? s + "" : s, t), t);
import { EditorController as w, registerEditorProvider as S } from "@ibiz-template/runtime";
import { defineComponent as x, ref as v, watch as L, createVNode as a, resolveComponent as o } from "vue";
import { getInputProps as N, useNamespace as D } from "@ibiz-template/vue3-util";
import { debounce as V, clone as E } from "@ibiz-template/core";
const y = /* @__PURE__ */ x({
  name: "AIParams",
  props: N(),
  emits: ["change"],
  setup(e, {
    emit: s
  }) {
    const t = D("ai-params"), i = e.controller, m = v(!1), c = v(""), l = v([]);
    L(() => e.value, (n) => {
      c.value = n, b();
    }, {
      immediate: !0
    });
    const d = V(() => {
      s("change", c.value);
    }, 500), b = () => {
      const n = [], p = /<(\w+)>([\s\S]*?)<\/\1>/gi;
      let I = 0, r;
      for (; (r = p.exec(c.value)) !== null; ) {
        if (r.index < I)
          continue;
        I = r.index + r[0].length;
        const A = r[1].toLowerCase();
        let C = r[2];
        C = C.replace(/^\s+/, "").replace(/\s+$/, ""), i.AIParams.some((g) => g.value === A) && n.push({
          paramName: A,
          content: C
        });
      }
      l.value = n;
    }, u = () => {
      c.value = l.value.map((n) => "<".concat(n.paramName, ">\n").concat(n.content, "\n</").concat(n.paramName, ">")).join("\n");
    };
    return {
      c: i,
      ns: t,
      isCustom: m,
      paramStr: c,
      paramArr: l,
      onCopy: (n) => {
        const p = E(l.value[n]);
        l.value.splice(n, 0, p), u(), d();
      },
      onDelete: (n) => {
        l.value.splice(n, 1), u(), d();
      },
      onAddItem: () => {
        l.value.push({
          paramName: i.AIParams[0].value,
          content: ""
        }), u(), d();
      },
      onParamChange: () => {
        u(), d();
      },
      onCustomChange: () => {
        d();
      },
      onSwitchCustom: () => {
        m.value = !m.value;
      }
    };
  },
  render() {
    return a("div", {
      class: this.ns.b()
    }, [this.isCustom ? a("div", {
      class: this.ns.e("custom")
    }, [a(o("el-input"), {
      rows: 6,
      type: "textarea",
      modelValue: this.paramStr,
      "onUpdate:modelValue": (e) => this.paramStr = e,
      disabled: this.disabled,
      readonly: this.readonly,
      onInput: this.onCustomChange
    }, null)]) : a("div", {
      class: this.ns.e("list")
    }, [this.paramArr.map((e, s) => a("div", {
      class: this.ns.e("list-item")
    }, [a(o("el-select"), {
      modelValue: e.paramName,
      "onUpdate:modelValue": (t) => e.paramName = t,
      readonly: this.readonly,
      disabled: this.disabled,
      onChange: this.onParamChange,
      class: this.ns.em("list-item", "param-name")
    }, {
      default: () => this.c.AIParams.map((t) => a(o("el-option"), {
        key: t.value,
        label: t.text,
        value: t.value
      }, null))
    }), a(o("el-input"), {
      rows: 1,
      type: "textarea",
      modelValue: e.content,
      "onUpdate:modelValue": (t) => e.content = t,
      disabled: this.disabled,
      readonly: this.readonly,
      onInput: this.onParamChange,
      class: this.ns.em("list-item", "param-content")
    }, null), a("div", {
      class: this.ns.em("list-item", "actions")
    }, [a(o("el-button"), {
      size: "small",
      title: "删除",
      disabled: this.disabled,
      onClick: () => this.onDelete(s),
      class: this.ns.em("list-item", "close")
    }, {
      default: () => [a(o("ion-icon"), {
        name: "close-outline"
      }, null)]
    }), a(o("el-button"), {
      size: "small",
      title: "拷贝",
      disabled: this.disabled,
      onClick: () => this.onCopy(s),
      class: this.ns.em("list-item", "copy")
    }, {
      default: () => [a(o("ion-icon"), {
        name: "copy-outline"
      }, null)]
    })])]))]), a("div", {
      class: this.ns.e("footer")
    }, [a(o("el-button"), {
      size: "small",
      onClick: this.onSwitchCustom,
      title: this.isCustom ? "关闭自定义" : "开启自定义"
    }, {
      default: () => [this.isCustom ? "关闭自定义" : "开启自定义"]
    }), !this.isCustom && !this.readonly && a(o("el-button"), {
      size: "small",
      title: "添加",
      onClick: this.onAddItem,
      disabled: this.disabled
    }, {
      default: () => [a(o("ion-icon"), {
        name: "add-outline"
      }, null)]
    })])]);
  }
});
class k extends w {
  constructor() {
    super(...arguments);
    /**
     * @description AI参数
     * @type {readonly} 
     * @memberof AIParamsController
     */
    h(this, "AIParams", []);
  }
  /**
   * @description 初始化
   * @protected
   * @returns {*}  {Promise<void>}
   * @memberof AIParamsController
   */
  async onInit() {
    await super.onInit(), await this.loadCodeList();
  }
  /**
   * @description 加载代码表
   * @protected
   * @returns {*}  {Promise<void>}
   * @memberof AIParamsController
   */
  async loadCodeList() {
    const { appId: t } = this.model, { appCodeListId: i } = this.editorParams;
    if (i) {
      const m = await ibiz.hub.getApp(t);
      this.AIParams = await m.codeList.get(
        i,
        this.context,
        this.params
      );
    }
  }
}
class z {
  constructor() {
    h(this, "formEditor", "AIParams");
    h(this, "gridEditor", "AIParams");
  }
  async createController(s, t) {
    const i = new k(s, t);
    return await i.init(), i;
  }
}
const G = {
  install(e) {
    e.component(y.name, y), S(
      "EDITOR_CUSTOMSTYLE_AI_PARAMS",
      () => new z()
    );
  }
};
export {
  G as default
};
