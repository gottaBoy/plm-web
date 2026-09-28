import './assets/style.css';
import { PanelItemController as J, registerPanelItemProvider as $, UIActionUtil as Q } from "@ibiz-template/runtime";
import { defineComponent as X, ref as p, computed as R, createVNode as o, resolveComponent as r } from "vue";
import { useNamespace as Z } from "@ibiz-template/vue3-util";
var ee = Object.defineProperty, te = (a, t, i) => t in a ? ee(a, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : a[t] = i, V = (a, t, i) => (te(a, typeof t != "symbol" ? t + "" : t, i), i);
class D extends J {
  /**
   * Creates an instance of KanbanOperateController.
   * @param {IPanelButton} model
   * @param {PanelController} panel
   * @param {PanelItemController} [parent]
   * @memberof KanbanOperateController
   */
  constructor(t, i, l) {
    super(t, i, l), V(this, "actionModel", {});
  }
  /**
   * 父容器数据对象数据
   * @author lxm
   * @date 2023-07-15 01:33:58
   * @readonly
   * @type {IData}
   */
  get data() {
    return this.panel.inputData || this.dataParent.data;
  }
  get uaState() {
    const t = this.panel.ctx.controllersMap.get("kanban").state.uaState || {};
    return t ? t[this.data.srfkey] : {};
  }
  /**
   * 初始化
   *
   * @return {*}  {Promise<void>}
   * @memberof KanbanOperateController
   */
  async onInit() {
    await super.onInit();
    const t = this.panel.view, i = this.model.userTag || "OPERATE", l = t.getController("kanban");
    if (l) {
      const { dedataViewItems: u = [] } = l.model;
      this.actionModel = u.find(
        (b) => Object.is(b.name, i)
      );
    }
  }
}
const T = /* @__PURE__ */ X({
  name: "IBizKanbanOperate",
  props: {
    modelData: {
      type: Object,
      required: !0
    },
    controller: {
      type: D,
      required: !0
    }
  },
  setup(a) {
    const t = Z("panel-button"), i = a.controller, l = p(), u = p(), b = p(), S = p(), g = p(!1), v = p(!1), {
      caption: M,
      captionItemName: N,
      renderMode: k,
      showCaption: A,
      sysImage: O,
      codeName: K,
      itemStyle: x,
      tooltip: z,
      buttonCssStyle: y
    } = a.modelData, {
      panel: d
    } = a.controller, E = p("");
    y && (E.value = y);
    const L = R(() => N && d.data ? d.data[N.toLowerCase()] : M);
    let I = !1;
    Object.is(k, "LINK") && (I = !0);
    const P = R(() => {
      if (Object.is(k, "LINK"))
        return null;
      switch (x) {
        case "PRIMARY":
          return "primary";
        case "SUCCESS":
          return "success";
        case "INFO":
          return "info";
        case "WARNING":
          return "warning";
        case "DANGER":
          return "danger";
        case "INVERSE":
          return "info";
        default:
          return null;
      }
    }), h = (n) => {
      const e = i.uaState[n.id];
      return !!(e && e.disabled === !1 && e.visible === !0);
    }, j = () => {
      const {
        actionModel: n
      } = i, e = [], s = [], c = [];
      if (n && n.deuiactionGroup) {
        const {
          uiactionGroupDetails: f
        } = n.deuiactionGroup;
        f.forEach((m) => {
          m.actionLevel === 250 ? e.push(m) : m.actionLevel === 200 ? s.push(m) : c.push(m);
        });
      }
      return {
        deActions: c,
        useActions: s,
        keyActions: e
      };
    }, G = (n, e, s) => {
      const c = {
        ...e
      };
      if (s) {
        const f = s.querySelector(".".concat(n.id));
        f && (c.target = f);
      }
      return c;
    }, C = async (n, e, s) => {
      e.stopPropagation(), v.value = !0;
      const c = {
        context: d.context,
        params: d.params,
        data: [d.inputData],
        view: d.view,
        event: G(n, e, s)
      };
      await Q.execAndResolved(n.uiactionId, c, n.appId), v.value = !1;
    }, B = async (n) => {
      a.controller.onClick();
    }, w = (n) => {
      const {
        actionLevel: e
      } = n;
      return [n.id, t.e("item"), t.is("disabled", !1), t.em("item", "level-".concat(e))];
    }, U = (n) => n.length === 0 ? null : o("div", {
      class: t.be("poper-content", "keyaction")
    }, [n.map((e) => o(r("el-button"), {
      class: [t.bem("poper-content", "keyaction", "action"), ...w(e), {
        "no-access": !h(e)
      }],
      text: !0,
      size: "small",
      onClick: (s) => C(e, s, null),
      title: e.tooltip || e.caption
    }, {
      default: () => [e.showIcon && e.sysImage ? o(r("iBizIcon"), {
        icon: e.sysImage
      }, null) : o(r("iBizIcon"), {
        icon: "fa fa-save"
      }, null)]
    }))]), q = (n) => n.length === 0 ? null : o("div", {
      class: t.be("poper-content", "deaction"),
      ref: b
    }, [n.map((e) => h(e) ? o("div", {
      class: [t.bem("poper-content", "deaction", "action"), ...w(e), {
        "no-access": !h(e)
      }],
      onClick: (s) => C(e, s, b.value),
      title: e.tooltip || e.caption
    }, [e.showIcon && e.sysImage ? o(r("iBizIcon"), {
      icon: e.sysImage
    }, null) : o("i", {
      class: "ibiz-icon fa fa-ravelry",
      "aria-hidden": "true"
    }, null), o("span", {
      class: t.bem("poper-content", "deaction", "action-text")
    }, [e.showCaption ? e.capLanguageRes ? ibiz.i18n.t(e.capLanguageRes.lanResTag, e.caption) : e.caption : ""])]) : null)]), _ = (n) => n.length === 0 ? null : o("div", {
      class: t.be("poper-content", "useaction"),
      ref: S
    }, [n.map((e) => o("div", {
      class: [t.bem("poper-content", "useaction", "action"), ...w(e), {
        "no-access": !h(e)
      }],
      onClick: (s) => C(e, s, S.value),
      title: e.tooltip || e.caption
    }, [e.showIcon && e.sysImage ? o(r("iBizIcon"), {
      icon: e.sysImage
    }, null) : o("i", {
      class: "ibiz-icon fa fa-ravelry",
      "aria-hidden": "true"
    }, null), o("span", {
      class: t.bem("poper-content", "useaction", "action-text")
    }, [e.showCaption ? e.capLanguageRes ? ibiz.i18n.t(e.capLanguageRes.lanResTag, e.caption) : e.caption : ""])]))]), F = () => {
      const {
        keyActions: n,
        useActions: e,
        deActions: s
      } = j();
      return o("div", {
        class: t.b("poper-content")
      }, [U(n), _(e), q(s)]);
    }, W = () => o("div", null, [o(r("el-tooltip"), {
      popperClass: t.b("title"),
      effect: "dark",
      content: z,
      placement: "top",
      "show-arrow": !0
    }, {
      default: () => [o(r("el-button"), {
        ref: "buttonRef",
        type: P.value,
        text: I,
        onClick: B
      }, {
        default: () => [o("div", {
          class: t.b("content")
        }, [o(r("iBizIcon"), {
          class: t.bm("content", "icon"),
          icon: O
        }, null), A ? o("span", {
          class: t.bm("content", "caption")
        }, [L]) : ""])]
      })]
    })]), Y = (n) => {
      n.stopPropagation(), n.preventDefault();
    }, H = R({
      get() {
        return g.value || v.value;
      },
      set(n) {
        g.value = n;
      }
    });
    return {
      ns: t,
      isText: I,
      captionText: L,
      buttonType: P,
      showCaption: A,
      sysImage: O,
      codeName: K,
      tooltip: z,
      handleButtonClick: B,
      buttonCssStyle: y,
      tempStyle: E,
      itemStyle: x,
      buttonRef: l,
      popoverRef: u,
      popoverRefVisible: g,
      renderPoperContent: F,
      renderBtn: W,
      stopEvent: Y,
      processing: v,
      isVisible: H
    };
  },
  render() {
    return o("div", {
      class: [this.ns.b(), this.ns.m(this.codeName), this.itemStyle && this.ns.m(this.itemStyle.toLowerCase()), this.ns.is("show-popover", this.isVisible), ...this.controller.containerClass],
      onClick: this.stopEvent,
      style: this.tempStyle
    }, [o(r("el-popover"), {
      ref: "popoverRef",
      visible: this.isVisible,
      "onUpdate:visible": (a) => this.isVisible = a,
      popperClass: [this.ns.b("one-popover")],
      width: 278,
      placement: "right-start",
      trigger: "click"
    }, {
      reference: () => this.renderBtn(),
      default: () => this.renderPoperContent()
    })]);
  }
});
class ne {
  constructor() {
    V(this, "component", "IBizKanbanOperate");
  }
  async createController(t, i, l) {
    const u = new D(t, i, l);
    return await u.init(), u;
  }
}
const ie = {
  install(a) {
    a.component(T.name, T), $(
      "FORM_USERCONTROL_KANBAN_OPERATE",
      () => new ne()
    );
  }
};
export {
  D as KanbanOperateController,
  ie as default
};
