import '../../../node_modules/.pnpm/@antv_x6@2.18.1/node_modules/@antv/x6/es/index.mjs';
import { Namespace } from '@ibiz-template/core';
import { HTML } from '../../../node_modules/.pnpm/@antv_x6@2.18.1/node_modules/@antv/x6/es/shape/html.mjs';

"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class RemarkNode extends HTML {
  constructor(metadata = {}) {
    const data = metadata.data || {};
    const nodeSize = {
      width: data.width || 240,
      height: data.height || 120
    };
    super({
      ...nodeSize,
      // 初始数据
      data: {
        ...data
      },
      attrs: {
        foreignObject: nodeSize
      },
      // 标记为备注节点
      shape: "remark-node",
      ...metadata
    });
    /**
     * @description 输入数量
     * @type {number}
     * @memberof RemarkNode
     */
    __publicField(this, "inputNum", 0);
    /**
     * @description 输出数量
     * @type {number}
     * @memberof RemarkNode
     */
    __publicField(this, "outputNum", 0);
    /**
     * @description 是否为编辑状态
     * @private
     * @type {boolean}
     * @memberof RemarkNode
     */
    __publicField(this, "isEditable", false);
    this.setupEvents();
  }
  /**
   * @description 初始化事件监听
   * @private
   * @memberof RemarkNode
   */
  setupEvents() {
    this.on("selected", () => {
      this.setNodeEditable(true);
    });
    this.on("unselected", () => {
      this.setNodeEditable(false);
    });
    this.on("resizing", (size) => {
      this.setAttrs({
        foreignObject: size
      });
    });
  }
  get markup() {
    const ns = new Namespace("logic-node");
    const data = this.getData();
    return {
      tagName: "foreignObject",
      selector: "foreignObject",
      children: [
        {
          ns: "http://www.w3.org/1999/xhtml",
          tagName: "div",
          className: "".concat(ns.b("text-container")),
          selector: "container",
          style: { width: "100%", height: "100%" },
          children: [
            {
              tagName: "textarea",
              selector: "textarea",
              className: ns.b("remark"),
              textContent: data.memo,
              attrs: {
                id: this.id
                // 添加唯一ID
              }
            }
          ]
        }
      ]
    };
  }
  /**
   * @description 保存备注
   * @private
   * @memberof RemarkNode
   */
  saveMome() {
    var _a;
    const contentEl = document.getElementById(this.id);
    if (contentEl) {
      this.setData(
        {
          ...this.getData(),
          memo: contentEl.value
        },
        { silent: true }
      );
      (_a = this.model) == null ? void 0 : _a.graph.trigger("node:change:mome", { node: this });
    }
  }
  /**
   * @description 重写移动方法，在编辑状态下禁止移动
   * @param {number} dx
   * @param {number} dy
   * @param {*} [options]
   * @returns {*}
   * @memberof RemarkNode
   */
  translate(dx, dy, options) {
    if (this.isEditable)
      return this;
    return super.translate(dx, dy, options);
  }
  /**
   * @description 设置节点是否可移动
   * @private
   * @param {boolean} editable
   * @memberof RemarkNode
   */
  setMovable(editable) {
    this.isEditable = editable;
    this.setAttrs({
      textarea: {
        style: {
          cursor: editable ? "text" : "move"
        }
      }
    });
    this.setProp("movable", !editable);
  }
  /**
   * @description 监听键盘事件
   * @private
   * @param {KeyboardEvent} e
   * @memberof RemarkNode
   */
  listerKeyboardEvent(e) {
    if (e.key === "Enter" || (e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "v" || e.key === "x")) {
      e.stopPropagation();
    }
  }
  /**
   * @description 设置节点编辑状态
   * @private
   * @param {boolean} editable
   * @memberof RemarkNode
   */
  setNodeEditable(editable) {
    const contentEl = document.getElementById(this.id);
    if (contentEl) {
      this.setMovable(editable);
      if (editable) {
        contentEl.focus();
        contentEl.addEventListener("blur", this.saveMome.bind(this));
        contentEl.addEventListener(
          "keydown",
          this.listerKeyboardEvent.bind(this)
        );
      } else {
        contentEl.removeEventListener("blur", this.saveMome.bind(this));
        contentEl.removeEventListener(
          "keydown",
          this.listerKeyboardEvent.bind(this)
        );
      }
    }
  }
}

export { RemarkNode };
