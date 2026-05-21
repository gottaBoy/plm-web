import './style.css';
var M = Object.defineProperty;
var R = (e, t, r) => t in e ? M(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var p = (e, t, r) => (R(e, typeof t != "symbol" ? t + "" : t, r), r);
import { FormMDCtrlController as k, FormMDCtrlRepeaterController as z, FormMDCtrlFormController as A, FormMDCtrlMDController as E, ControlVO as T, registerFormDetailProvider as B } from "@ibiz-template/runtime";
import { useNamespace as F, useController as y, withInstall as S } from "@ibiz-template/vue3-util";
import { defineComponent as w, createVNode as o, resolveComponent as m, computed as D } from "vue";
import { ModelError as x } from "@ibiz-template/core";
import b from "vuedraggable";
const C = /* @__PURE__ */ w({
  name: "IBizFormMDCtrlPlugin",
  props: {
    modelData: {
      type: Object,
      required: !0
    },
    controller: {
      type: k,
      required: !0
    }
  },
  setup(e) {
    const t = F("form--plugin");
    y(e.controller);
    const r = e.controller, n = r.model.showCaption && !!r.model.caption, l = n || r.model.uiactionGroup;
    return {
      c: r,
      ns: t,
      hasCaption: n,
      hasHeader: l,
      onActionClick: async (h, d) => {
        await e.controller.onActionClick(h, d);
      }
    };
  },
  render() {
    const {
      model: e
    } = this.c;
    let t;
    switch (e.contentType) {
      case "GRID":
      case "LIST":
      case "DATAVIEW":
        t = o(m("iBizFormMDCtrlMD"), {
          controller: this.c
        }, null);
        break;
      case "FORM":
        t = o(m("iBizFormMDCtrlForm"), {
          controller: this.c
        }, null);
        break;
      case "REPEATER":
        t = o(m("iBizRepeaterForm"), {
          controller: this.c
        }, null);
        break;
      default:
        o("div", null, [ibiz.i18n.t("app.noSupport")]);
        break;
    }
    return o("div", {
      class: [this.ns.b(), this.ns.m(this.modelData.codeName), ...this.controller.containerClass, this.hasCaption ? this.ns.m("show-caption") : ""]
    }, [this.hasHeader && o("div", {
      class: this.ns.b("header")
    }, [o("div", {
      class: this.ns.e("title")
    }, [this.hasCaption ? this.c.model.caption : ""]), e.uiactionGroup && o(m("iBizActionToolbar"), {
      class: this.ns.e("toolbar"),
      "action-details": e.uiactionGroup.uiactionGroupDetails,
      "actions-state": this.controller.state.actionGroupState,
      onActionClick: this.onActionClick
    }, null)]), t]);
  }
});
class P {
  constructor() {
    p(this, "component", "IBizFormMDCtrlPlugin");
  }
  async createController(t, r, n) {
    let l;
    switch (t.contentType) {
      case "LIST":
      case "GRID":
      case "DATAVIEW":
        l = new E(t, r, n);
        break;
      case "FORM":
        l = new A(t, r, n);
        break;
      case "REPEATER":
        l = new z(t, r, n);
        break;
      default:
        throw new x(
          t,
          "".concat(ibiz.i18n.t("control.form.formMDctrl.errorMessage", {
            contentType: t.contentType
          }))
        );
    }
    return await l.init(), l;
  }
}
const f = /* @__PURE__ */ w({
  name: "IBizRepeaterForm",
  components: {
    draggable: b
  },
  props: {
    controller: {
      type: z,
      required: !0
    }
  },
  setup(e) {
    const t = F("repeater-form"), r = t.be("item", "icon-drag"), n = D(() => [...e.controller.value || []]), l = D(() => e.controller.enableSort), g = (c) => {
      if (e.controller.isSingleData)
        return;
      const {
        moved: a
      } = c, s = a.oldIndex, u = a.newIndex, i = [...e.controller.value], I = i.splice(s, 1)[0];
      i.splice(u, 0, I), e.controller.setValue(i);
    }, h = () => o("div", {
      class: [r]
    }, [o("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      height: "1em",
      width: "1em",
      preserveAspectRatio: "xMidYMid meet",
      focusable: "false"
    }, [o("g", {
      "stroke-width": "1",
      "fill-rule": "evenodd"
    }, [o("g", {
      transform: "translate(5 1)",
      "fill-rule": "nonzero"
    }, [o("path", {
      d: "M1 2a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM1 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-4 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-4 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
    }, null)])])])]), d = (c, a) => {
      const s = a.data[0], u = s instanceof T ? s.getOrigin() : {
        ...s
      }, i = [...e.controller.value];
      i[c] = u, e.controller.setValue(i);
    }, v = (c, a) => {
      e.controller.setRepeaterController("".concat(c), a.ctrl);
    };
    return {
      ns: t,
      dragClssName: r,
      dragItems: n,
      enableSort: l,
      handleDragChange: g,
      onFormDataChange: d,
      onCreated: v,
      renderItem: (c, a) => o("div", {
        class: t.b("item")
      }, [l.value && h(), o("div", {
        class: t.b("item-content")
      }, [o(m("iBizControlShell"), {
        context: e.controller.context,
        params: e.controller.params,
        modelData: e.controller.repeatedForm,
        isSimple: !0,
        data: c,
        onFormDataChange: (s) => d(a, s),
        onCreated: (s) => v(a, s)
      }, null)]), o("div", {
        class: t.b("item-toolbar")
      }, [e.controller.enableDelete && o("div", {
        class: t.be("item-toolbar", "remove-btn"),
        title: "删除",
        onClick: () => e.controller.remove(a)
      }, [o("svg", {
        viewBox: "0 0 16 16"
      }, [o("g", null, [o("path", {
        "fill-opacity": ".01",
        fill: "currentColor",
        d: "M0 0h16v16H0z"
      }, null), o("path", {
        d: "M12.48 4.967a.5.5 0 0 1 .498.452l.002.048v7.214c0 .954-.86 1.694-1.9 1.729l-.076.001H5.232c-1.048 0-1.933-.717-1.975-1.66l-.002-.07V5.467a.5.5 0 0 1 .998-.048l.002.048v7.214c0 .366.388.703.913.729l.064.001h5.772c.536 0 .944-.323.974-.686l.002-.044V5.467a.5.5 0 0 1 .5-.5zm-5.68.996a.5.5 0 0 1 .497.452l.002.048v4.244a.5.5 0 0 1-.997.048l-.003-.048V6.463a.5.5 0 0 1 .5-.5zm2.83 0a.5.5 0 0 1 .497.452l.003.048v4.244a.5.5 0 0 1-.998.048l-.002-.048V6.463a.5.5 0 0 1 .5-.5zm.426-4.374c.66 0 1.201.52 1.235 1.173l.002.066v.45h2.196a.5.5 0 0 1 .048.997l-.048.002H2.51a.5.5 0 0 1-.048-.997l.048-.003h2.432v-.45c0-.661.519-1.202 1.171-1.236l.066-.002h3.876zm0 1H6.18c-.12 0-.22.09-.235.206l-.002.033v.45h4.35v-.45a.24.24 0 0 0-.205-.237l-.032-.002z",
        fill: "currentColor"
      }, null)])])])])])
    };
  },
  render() {
    const e = this.controller.value || [];
    let t;
    return e != null && e.length && (t = this.enableSort ? o(b, {
      ref: "container",
      class: [this.ns.e("drag")],
      chosenClass: this.ns.is("drag-chosen", !0),
      list: this.dragItems,
      itemKey: "id",
      handle: ".".concat(this.dragClssName),
      onChange: this.handleDragChange
    }, {
      item: ({
        element: r,
        index: n
      }) => this.renderItem(r, n)
    }) : e.map((r, n) => this.renderItem(r, n))), o("div", {
      class: this.ns.b()
    }, [t]);
  }
}), V = S(C, function(e) {
  e.component(C.name, C), e.component(f.name, f), B(
    "FORM_USERCONTROL_REPEATER_FORM",
    () => new P()
  );
}), $ = {
  install(e) {
    e.use(V);
  }
};
export {
  $ as default
};
