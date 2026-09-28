import './assets/style.css';
import { registerPanelItemProvider as U, PanelItemController as k, UIActionButtonState as R, UIActionUtil as E, PanelItemState as L } from "@ibiz-template/runtime";
import { withInstall as V, useNamespace as W } from "@ibiz-template/vue3-util";
import { defineComponent as _, ref as u, onMounted as j, createVNode as o, resolveComponent as Z } from "vue";
import { showTitle as q } from "@ibiz-template/core";
var F = Object.defineProperty, H = (e, t, n) => t in e ? F(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, I = (e, t, n) => (H(e, typeof t != "symbol" ? t + "" : t, n), n);
class J extends L {
  constructor() {
    super(...arguments), I(this, "uiActionState");
  }
}
class C extends k {
  /**
   * Creates an instance of AIAssistantButtonController.
   * @param {IPanelButton} model
   * @param {PanelController} panel
   * @param {PanelItemController} [parent]
   * @memberof AIAssistantButtonController
   */
  constructor(t, n, a) {
    super(t, n, a), I(this, "customizedAlign", "RIGHTEND"), this.state.uiActionState = this.createUIActionState();
  }
  createState() {
    var t;
    return new J((t = this.parent) == null ? void 0 : t.state);
  }
  /**
   * @description 父容器数据对象数据
   * @readonly
   * @type {IData}
   * @memberof AIAssistantButtonController
   */
  get data() {
    return this.dataParent.data;
  }
  /**
   * 初始化
   *
   * @return {*}  {Promise<void>}
   * @memberof AIAssistantButtonController
   */
  async onInit() {
    await super.onInit(), this.updateButtonState(), await this.initPluginParams();
  }
  /**
   * 初始化插件参数
   * @returns
   */
  async initPluginParams() {
    const t = await ibiz.hub.getAppAsync(this.model.appId);
    if (t && t.model.appPFPluginRefs) {
      const n = t.model.appPFPluginRefs.find(
        (a) => a.pluginCode === "AI_ASSISTANT_BUTTON"
      );
      if (!n)
        return;
      n.pluginParams && n.pluginParams.customizedalign && (this.customizedAlign = n.pluginParams.customizedalign);
    }
  }
  /**
   * 创建界面行为状态对象
   *
   * @protected
   * @return {*}  {AIAssistantState}
   * @memberof AIAssistantButtonController
   */
  createUIActionState() {
    const { uiactionId: t, name: n } = this.model;
    return new R(
      n,
      this.panel.context.srfappid,
      t
    );
  }
  /**
   * 面板数据变更通知(由面板控制器调用)
   *
   * @param {string[]} names
   * @memberof AIAssistantButtonController
   */
  async dataChangeNotify(t) {
    await this.updateButtonState(), super.dataChangeNotify(t);
  }
  /**
   * 面板状态变更通知
   *
   * @param {PanelNotifyState} _state
   * @memberof AIAssistantButtonController
   */
  async panelStateNotify(t) {
    await this.updateButtonState(), super.panelStateNotify(t);
  }
  /**
   * 更新按钮权限状态
   *
   * @memberof AIAssistantButtonController
   */
  async updateButtonState() {
    await this.state.uiActionState.update(
      this.panel.context,
      this.data,
      this.panel.model.appDataEntityId
    );
  }
  /**
   * 行为点击
   * - 在行为参数中传递panelDataParent(面板项数据父容器标识)
   * @param {MouseEvent} event
   * @return {*}  {Promise<void>}
   * @memberof AIAssistantButtonController
   */
  async onActionClick(t) {
    var n;
    const { uiactionId: a, actionType: r } = this.model;
    if (r === "NONE")
      return;
    t.stopPropagation(), t.preventDefault();
    const c = await ibiz.aiChatUtil.getAIChat();
    if (c.container) {
      (n = c.close) == null || n.call(c);
      return;
    }
    await E.execAndResolved(
      a,
      {
        context: this.panel.context,
        params: {
          panelDataParent: this.dataParent.model.id,
          ...this.panel.params
        },
        data: [this.data],
        view: this.panel.view,
        event: t,
        noWaitRoute: !0,
        ctrl: this.panel
      },
      this.model.appId
    );
  }
  /**
   * @description 计算项显示
   * @param {IData} data
   * @returns {*}  {void}
   * @memberof AIAssistantButtonController
   */
  calcItemVisible(t) {
    if (this.state.uiActionState.visible === !1) {
      this.state.visible = !1;
      return;
    }
    super.calcItemVisible(t);
  }
  /**
   * @description 计算项启用
   * @param {IData} data
   * @returns {*}  {void}
   * @memberof AIAssistantButtonController
   */
  calcItemDisabled(t) {
    if (this.state.uiActionState.disabled === !0) {
      this.state.disabled = !0;
      return;
    }
    super.calcItemDisabled(t);
  }
}
function G(e) {
  return e.x >= 0 && e.x <= 1 && e.y >= 0 && e.y <= 1;
}
function X(e, t, n, a) {
  const r = e / window.innerWidth, c = t / window.innerHeight, p = Math.max(0, Math.min(r, 1 - n)), m = Math.max(0, Math.min(c, 1 - a));
  return { x: p, y: m };
}
const Y = () => o("svg", {
  viewBox: "0 0 1024 1024",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg"
}, [o("path", {
  d: "M481.0752 263.3728l50.9952 1.024 1.8432-105.8816-50.9952-0.8192z"
}, null), o("path", {
  d: "M486.441426 180.895362a66.56 66.56 0 1 0 42.091944-126.290153 66.56 66.56 0 1 0-42.091944 126.290153Z"
}, null), o("path", {
  d: "M138.8544 664.3712c-52.8384 0-95.8464-43.008-95.8464-95.8464s43.008-95.8464 95.8464-95.8464M880.0256 472.6784c52.8384 0 95.8464 43.008 95.8464 95.8464s-43.008 95.8464-95.8464 95.8464"
}, null), o("path", {
  d: "M507.4944 220.5696c-220.16 0-398.7456 162.816-398.7456 363.7248s178.5856 363.7248 398.7456 363.7248 398.7456-162.816 398.7456-363.7248-178.5856-363.7248-398.7456-363.7248z m0 559.9232c-166.2976 0-301.2608-100.5568-301.2608-224.4608s134.9632-224.4608 301.2608-224.4608S808.7552 432.128 808.7552 556.032 673.792 780.4928 507.4944 780.4928z"
}, null), o("path", {
  d: "M319.6928 556.032a47.9232 38.912 90 1 0 77.824 0 47.9232 38.912 90 1 0-77.824 0Z"
}, null), o("path", {
  d: "M617.472 556.032a47.9232 38.912 90 1 0 77.824 0 47.9232 38.912 90 1 0-77.824 0Z"
}, null)]), w = /* @__PURE__ */ _({
  name: "IBizAIAssistantButton",
  props: {
    /**
     * @description 面板项模型数据
     */
    modelData: {
      type: Object,
      required: !0
    },
    /**
     * @description 面板项控制器
     */
    controller: {
      type: C,
      required: !0
    }
  },
  setup(e) {
    const t = W("ai-assistant-button"), {
      sysImage: n,
      buttonCssStyle: a,
      tooltip: r = "AI助手"
    } = e.modelData, {
      state: c
    } = e.controller, p = u("");
    a && (p.value = a);
    const m = "ai-assistant-button-position-style", f = u(), s = u(), S = u(), A = u(!1), d = u(""), b = () => {
      if (!s.value)
        return;
      const i = f.value.offsetWidth || 56, l = window.innerWidth, h = 20, y = s.value.x * l + i, g = l - y;
      s.value.x * l <= h ? d.value = "adsorption-left" : g <= h && (d.value = "adsorption-right");
    }, x = () => {
      s.value && (S.value = {
        [t.cssVarBlockName("position-drag-left")]: "".concat(s.value.x * 100, "%"),
        [t.cssVarBlockName("position-drag-top")]: "".concat(s.value.y * 100, "%")
      }, localStorage.setItem(m, JSON.stringify(s.value)));
    }, N = () => {
      const i = f.value;
      i && (i.onmousedown = (l) => {
        document.body.style.userSelect = "none";
        const h = l.clientX - i.offsetLeft, y = l.clientY - i.offsetTop, g = Date.now(), P = (v) => {
          d.value && (d.value = "");
          const M = 56 / window.innerWidth, T = 56 / window.innerHeight, {
            x: D,
            y: O
          } = X(v.clientX - h, v.clientY - y, M, T);
          s.value = {
            x: D,
            y: O
          }, requestAnimationFrame(() => {
            x();
          });
        }, B = () => {
          const v = Date.now();
          A.value = v - g > 300, b(), document.body.style.userSelect = "", document.removeEventListener("mousemove", P), document.removeEventListener("mouseup", B);
        };
        document.addEventListener("mousemove", P), document.addEventListener("mouseup", B);
      });
    }, z = async (i) => {
      A.value || (await e.controller.onActionClick(i), e.controller.onClick(i));
    };
    return j(() => {
      const i = localStorage.getItem(m);
      if (i) {
        const l = JSON.parse(i);
        s.value = {}, G(l) && Object.assign(s.value, l);
      }
      x(), N(), b();
    }), {
      ns: t,
      btnRef: f,
      state: c,
      sysImage: n,
      tooltip: r,
      tempStyle: p,
      adsorption: d,
      positionStyle: S,
      handleButtonClick: z
    };
  },
  render() {
    if (this.state.visible) {
      const e = this.controller.customizedAlign.toLocaleLowerCase();
      return o("div", {
        ref: "btnRef",
        class: [this.ns.b(), this.ns.is(e, !!e), this.ns.is("drag", !!this.positionStyle), this.ns.is(this.adsorption, !!this.adsorption), this.tempStyle, ...this.controller.containerClass],
        style: this.positionStyle,
        title: q(this.tooltip),
        onClick: this.handleButtonClick
      }, [o("div", {
        class: this.ns.e("content")
      }, [this.sysImage ? o(Z("iBizIcon"), {
        class: this.ns.em("content", "icon"),
        icon: this.sysImage
      }, null) : Y()])]);
    }
    return null;
  }
});
class $ {
  constructor() {
    I(this, "component", "IBizAIAssistantButton");
  }
  async createController(t, n, a) {
    const r = new C(t, n, a);
    return await r.init(), r;
  }
}
const nt = V(
  w,
  function(e) {
    e.component(w.name, w), U(
      "CUSTOM_AI_ASSISTANT_BUTTON",
      () => new $()
    );
  }
);
export {
  nt as IBizAssistantButton,
  nt as default
};
