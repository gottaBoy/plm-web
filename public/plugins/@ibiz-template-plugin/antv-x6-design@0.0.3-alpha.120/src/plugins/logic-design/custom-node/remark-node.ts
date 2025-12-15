/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node, Shape } from '@antv/x6';
import { Namespace } from '@ibiz-template/core';

/**
 * @description 备注节点
 * @export
 * @class RemarkNode
 * @extends {Shape.HTML}
 */
export class RemarkNode extends Shape.HTML {
  /**
   * @description 输入数量
   * @type {number}
   * @memberof RemarkNode
   */
  inputNum: number = 0;

  /**
   * @description 输出数量
   * @type {number}
   * @memberof RemarkNode
   */
  outputNum: number = 0;

  /**
   * @description 是否为编辑状态
   * @private
   * @type {boolean}
   * @memberof RemarkNode
   */
  private isEditable: boolean = false;

  constructor(metadata: Node.Metadata = {}) {
    const data = metadata.data || {};
    const nodeSize = {
      width: data.width || 240,
      height: data.height || 120,
    };
    super({
      ...nodeSize,
      // 初始数据
      data: {
        ...data,
      },
      attrs: {
        foreignObject: nodeSize,
      },
      // 标记为备注节点
      shape: 'remark-node',
      ...metadata,
    });

    this.setupEvents();
  }

  /**
   * @description 初始化事件监听
   * @private
   * @memberof RemarkNode
   */
  private setupEvents() {
    this.on('selected', (): void => {
      // 选中时使内容可编辑
      this.setNodeEditable(true);
    });
    this.on('unselected', (): void => {
      // 取消选中时使内容不可编辑
      this.setNodeEditable(false);
    });
    this.on('resizing', (size: { width: number; height: number }): void => {
      this.setAttrs({
        foreignObject: size,
      });
    });
  }

  get markup() {
    const ns = new Namespace('logic-node');
    const data = this.getData();

    return {
      tagName: 'foreignObject',
      selector: 'foreignObject',
      children: [
        {
          ns: 'http://www.w3.org/1999/xhtml',
          tagName: 'div',
          className: `${ns.b('text-container')}`,
          selector: 'container',
          style: { width: '100%', height: '100%' },
          children: [
            {
              tagName: 'textarea',
              selector: 'textarea',
              className: ns.b('remark'),
              textContent: data.memo,
              attrs: {
                id: this.id, // 添加唯一ID
              },
            },
          ],
        },
      ],
    };
  }

  /**
   * @description 保存备注
   * @private
   * @memberof RemarkNode
   */
  private saveMome() {
    const contentEl = document.getElementById(this.id);
    if (contentEl) {
      this.setData(
        {
          ...this.getData(),
          memo: (contentEl as HTMLTextAreaElement).value,
        },
        { silent: true },
      );
      this.model?.graph.trigger('node:change:mome', { node: this });
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
  translate(dx: number, dy: number, options?: any) {
    // 编辑状态下禁止移动
    if (this.isEditable) return this;
    return super.translate(dx, dy, options);
  }

  /**
   * @description 设置节点是否可移动
   * @private
   * @param {boolean} editable
   * @memberof RemarkNode
   */
  private setMovable(editable: boolean): void {
    this.isEditable = editable;
    this.setAttrs({
      textarea: {
        style: {
          'cursor': editable ? 'text' : 'move',
        },
      },
    });
    this.setProp('movable', !editable);
  }

  /**
   * @description 监听键盘事件
   * @private
   * @param {KeyboardEvent} e
   * @memberof RemarkNode
   */
  private listerKeyboardEvent(e: KeyboardEvent): void {
    // 阻止复制，粘贴，剪切，回车冒泡 防止执行异常
    if (
      e.key === 'Enter' ||
      ((e.ctrlKey || e.metaKey) &&
        (e.key === 'c' || e.key === 'v' || e.key === 'x'))
    ) {
      e.stopPropagation();
    }
  }

  /**
   * @description 设置节点编辑状态
   * @private
   * @param {boolean} editable
   * @memberof RemarkNode
   */
  private setNodeEditable(editable: boolean): void {
    const contentEl = document.getElementById(this.id);
    if (contentEl) {
      this.setMovable(editable);
      if (editable) {
        // 可编辑时添加事件监听
        contentEl.focus();
        contentEl.addEventListener('blur', this.saveMome.bind(this));
        contentEl.addEventListener(
          'keydown',
          this.listerKeyboardEvent.bind(this),
        );
      } else {
        // 不可编辑时移除事件监听
        contentEl.removeEventListener('blur', this.saveMome.bind(this));
        contentEl.removeEventListener(
          'keydown',
          this.listerKeyboardEvent.bind(this),
        );
      }
    }
  }
}
