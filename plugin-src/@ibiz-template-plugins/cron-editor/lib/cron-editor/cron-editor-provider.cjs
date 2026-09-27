'use strict';

var cronEditor_controller = require('./cron-editor.controller.cjs');

"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class CronEditorProvider {
  constructor() {
    __publicField(this, "formEditor", "IBizCronEditor");
    __publicField(this, "gridEditor", "IBizCronEditor");
  }
  async createController(editorModel, parentController) {
    const c = new cronEditor_controller.CronEditorController(editorModel, parentController);
    await c.init();
    return c;
  }
}

exports.CronEditorProvider = CronEditorProvider;
