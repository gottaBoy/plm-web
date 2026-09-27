import './style.css';
var U = Object.defineProperty;
var R = (e, n, t) => n in e ? U(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[n] = t;
var g = (e, n, t) => (R(e, typeof n != "symbol" ? n + "" : n, t), t);
import { PanelItemState as k, PanelItemController as E, UIActionButtonState as W, UIActionUtil as L, registerPanelItemProvider as _ } from "@ibiz-template/runtime";
import { useNamespace as H, withInstall as V } from "@ibiz-template/vue3-util";
import { defineComponent as X, ref as d, onMounted as Y, createVNode as l, resolveComponent as q } from "vue";
import { showTitle as F } from "@ibiz-template/core";
class Z extends k {
  constructor() {
    super(...arguments);
    /**
     * @description 界面行为状态
     * @type {UIActionButtonState}
     * @memberof AIAssistantState
     */
    g(this, "uiActionState");
  }
}
class x extends E {
  /**
   * Creates an instance of AIAssistantButtonController.
   * @param {IPanelButton} model
   * @param {PanelController} panel
   * @param {PanelItemController} [parent]
   * @memberof AIAssistantButtonController
   */
  constructor(t, i, s) {
    super(t, i, s);
    /**
     * @description 自定义对齐方式
     * @memberof AIAssistantButtonController
     */
    g(this, "customizedAlign", "RIGHTEND");
    this.state.uiActionState = this.createUIActionState();
  }
  createState() {
    var t;
    return new Z((t = this.parent) == null ? void 0 : t.state);
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
      const i = t.model.appPFPluginRefs.find(
        (s) => s.pluginCode === "AI_ASSISTANT_BUTTON"
      );
      if (!i)
        return;
      i.pluginParams && i.pluginParams.customizedalign && (this.customizedAlign = i.pluginParams.customizedalign);
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
    const { uiactionId: t, name: i } = this.model;
    return new W(
      i,
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
    var u;
    const { uiactionId: i, actionType: s } = this.model;
    if (s === "NONE")
      return;
    t.stopPropagation(), t.preventDefault();
    const r = await ibiz.aiChatUtil.getAIChat();
    if (r.container) {
      (u = r.close) == null || u.call(r);
      return;
    }
    await L.execAndResolved(
      i,
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
function j(e) {
  return e.x >= 0 && e.x <= 1 && e.y >= 0 && e.y <= 1;
}
function J(e, n, t, i) {
  const s = e / window.innerWidth, r = n / window.innerHeight, u = Math.max(0, Math.min(s, 1 - t)), m = Math.max(0, Math.min(r, 1 - i));
  return { x: u, y: m };
}
const $ = () => l("svg", {
  viewBox: "0 0 1024 1024",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg"
}, [l("path", {
  d: "M481.0752 263.3728l50.9952 1.024 1.8432-105.8816-50.9952-0.8192z"
}, null), l("path", {
  d: "M486.441426 180.895362a66.56 66.56 0 1 0 42.091944-126.290153 66.56 66.56 0 1 0-42.091944 126.290153Z"
}, null), l("path", {
  d: "M138.8544 664.3712c-52.8384 0-95.8464-43.008-95.8464-95.8464s43.008-95.8464 95.8464-95.8464M880.0256 472.6784c52.8384 0 95.8464 43.008 95.8464 95.8464s-43.008 95.8464-95.8464 95.8464"
}, null), l("path", {
  d: "M507.4944 220.5696c-220.16 0-398.7456 162.816-398.7456 363.7248s178.5856 363.7248 398.7456 363.7248 398.7456-162.816 398.7456-363.7248-178.5856-363.7248-398.7456-363.7248z m0 559.9232c-166.2976 0-301.2608-100.5568-301.2608-224.4608s134.9632-224.4608 301.2608-224.4608S808.7552 432.128 808.7552 556.032 673.792 780.4928 507.4944 780.4928z"
}, null), l("path", {
  d: "M319.6928 556.032a47.9232 38.912 90 1 0 77.824 0 47.9232 38.912 90 1 0-77.824 0Z"
}, null), l("path", {
  d: "M617.472 556.032a47.9232 38.912 90 1 0 77.824 0 47.9232 38.912 90 1 0-77.824 0Z"
}, null)]), w = /* @__PURE__ */ X({
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
      type: x,
      required: !0
    }
  },
  setup(e) {
    const n = H("ai-assistant-button"), {
      sysImage: t,
      buttonCssStyle: i,
      tooltip: s = "AI助手"
    } = e.modelData, {
      state: r
    } = e.controller, u = d("");
    i && (u.value = i);
    const m = "ai-assistant-button-position-style", I = d(), o = d(), S = d(), y = d(!1), p = d(""), B = () => {
      if (!o.value)
        return;
      const a = I.value.offsetWidth || 56, c = window.innerWidth, h = 20, v = o.value.x * c + a, A = c - v;
      o.value.x * c <= h ? p.value = "adsorption-left" : A <= h && (p.value = "adsorption-right");
    }, b = () => {
      o.value && (S.value = {
        [n.cssVarBlockName("position-drag-left")]: "".concat(o.value.x * 100, "%"),
        [n.cssVarBlockName("position-drag-top")]: "".concat(o.value.y * 100, "%")
      }, localStorage.setItem(m, JSON.stringify(o.value)));
    }, N = () => {
      const a = I.value;
      a && (a.onmousedown = (c) => {
        document.body.style.userSelect = "none";
        const h = c.clientX - a.offsetLeft, v = c.clientY - a.offsetTop, A = Date.now(), C = (f) => {
          p.value && (p.value = "");
          const z = 56 / window.innerWidth, T = 56 / window.innerHeight, {
            x: D,
            y: O
          } = J(f.clientX - h, f.clientY - v, z, T);
          o.value = {
            x: D,
            y: O
          }, requestAnimationFrame(() => {
            b();
          });
        }, P = () => {
          const f = Date.now();
          y.value = f - A > 300, B(), document.body.style.userSelect = "", document.removeEventListener("mousemove", C), document.removeEventListener("mouseup", P);
        };
        document.addEventListener("mousemove", C), document.addEventListener("mouseup", P);
      });
    }, M = async (a) => {
      y.value || (await e.controller.onActionClick(a), e.controller.onClick(a));
    };
    return Y(() => {
      const a = localStorage.getItem(m);
      if (a) {
        const c = JSON.parse(a);
        o.value = {}, j(c) && Object.assign(o.value, c);
      }
      b(), N(), B();
    }), {
      ns: n,
      btnRef: I,
      state: r,
      sysImage: t,
      tooltip: s,
      tempStyle: u,
      adsorption: p,
      positionStyle: S,
      handleButtonClick: M
    };
  },
  render() {
    if (this.state.visible) {
      const e = this.controller.customizedAlign.toLocaleLowerCase();
      return l("div", {
        ref: "btnRef",
        class: [this.ns.b(), this.ns.is(e, !!e), this.ns.is("drag", !!this.positionStyle), this.ns.is(this.adsorption, !!this.adsorption), this.tempStyle, ...this.controller.containerClass],
        style: this.positionStyle,
        title: F(this.tooltip),
        onClick: this.handleButtonClick
      }, [l("div", {
        class: this.ns.e("content")
      }, [this.sysImage ? l(q("iBizIcon"), {
        class: this.ns.em("content", "icon"),
        icon: this.sysImage
      }, null) : $()])]);
    }
    return null;
  }
});
class G {
  constructor() {
    g(this, "component", "IBizAIAssistantButton");
  }
  async createController(n, t, i) {
    const s = new x(n, t, i);
    return await s.init(), s;
  }
}
const it = V(
  w,
  function(e) {
    e.component(w.name, w), _(
      "CUSTOM_AI_ASSISTANT_BUTTON",
      () => new G()
    );
  }
);
export {
  it as IBizAssistantButton,
  it as default
};
