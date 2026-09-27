'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');
var vue3Util = require('@ibiz-template/vue3-util');
var lodashEs = require('lodash-es');
require('./cron-editor.css');

"use strict";
var CronEditor = /* @__PURE__ */ vue.defineComponent({
  name: "IBizCronEditor",
  props: vue3Util.getInputProps(),
  emits: vue3Util.getEditorEmits(),
  setup(props, {
    emit
  }) {
    const c = props.controller;
    const ns = vue3Util.useNamespace("cron-editor");
    const cronPopover = vue.ref(false);
    const currentVal = vue.ref("");
    vue.watch(() => props.value, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        if (newVal == null) {
          currentVal.value = "";
        } else {
          currentVal.value = newVal.toString();
        }
      }
    }, {
      immediate: true
    });
    const changeCron = (val) => {
      if (typeof val !== "string")
        return false;
      currentVal.value = val;
      emit("change", val);
    };
    const closeCron = () => {
      cronPopover.value = false;
    };
    const changeButton = () => {
      cronPopover.value = !cronPopover.value;
    };
    const debounceChange = lodashEs.debounce((val) => {
      emit("change", val);
    }, 300, {
      leading: true
    });
    const handleChange = (val) => {
      debounceChange(val);
    };
    return {
      c,
      ns,
      changeCron,
      closeCron,
      changeButton,
      cronPopover,
      currentVal,
      handleChange
    };
  },
  render() {
    let content = null;
    if (this.readonly) {
      content = vue.createVNode("span", null, [this.currentVal]);
    } else {
      content = vue.createVNode(vue.resolveComponent("el-input"), {
        "modelValue": this.currentVal,
        "onUpdate:modelValue": ($event) => this.currentVal = $event,
        "disabled": this.c.model.disabled,
        "onInput": this.handleChange,
        "placeholder": this.c.placeHolder
      }, {
        append: () => vue.createVNode(vue.resolveComponent("el-popover"), {
          "visible": this.cronPopover,
          "width": "700px",
          "trigger": "click"
        }, {
          reference: () => vue.createVNode(vue.resolveComponent("el-button"), {
            "onClick": this.changeButton,
            "disabled": this.c.model.disabled
          }, {
            default: () => [vue.createTextVNode("\u8BBE\u7F6E")]
          }),
          default: () => vue.createVNode(vue.resolveComponent("noVue3Cron"), {
            "cronValue": this.currentVal,
            "onChange": this.changeCron,
            "onClose": this.closeCron,
            "maxHeight": "400px",
            "i18n": "cn"
          }, null)
        })
      });
    }
    return vue.createVNode("div", {
      "class": [this.ns.b(), this.readonly ? this.ns.m("readonly") : ""]
    }, [content]);
  }
});

exports.default = CronEditor;
