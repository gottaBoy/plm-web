import {
  ControllerEvent,
  EditorController,
  type CodeListItem,
  type IComponentEvent,
} from '@ibiz-template/runtime';

type CommentListEvent = IComponentEvent & {
  deleteItem: { event: IData; emitArgs: IData };
  addItem: { event: IData; emitArgs: IData };
  editreply: { event: IData; emitArgs: IData };
};

class CommentListComtroller extends EditorController {
  /**
   * 是否走本地模式
   *
   * @type {boolean}
   * @memberof CommentListComtroller
   */
  isLocal = false;
  /**
   * 用户列表
   *
   * @memberof CommentListComtroller
   */
  operatorMap = new Map<string | number, CodeListItem>();
  evt: ControllerEvent<CommentListEvent> = new ControllerEvent(() => ({
    context: this.context,
    params: this.params,
    data: [],
    eventArg: '',
    targetName: this.model.name || '',
    view: this.view,
  }));
  /**
   * 代码表模型
   * @return {*}
   * @author: zhujiamin
   * @Date: 2023-05-24 10:55:50
   */
  codeList = undefined;
  extraParams = {};
  /**
   * 实体codeName
   * @type {string}
   */
  deCodeName = 'comment';
  async onInit() {
    super.onInit(),
      await this.getOperatorUserList(),
      this.editorParams &&
        this.editorParams.PID &&
        Object.assign(this.extraParams, { pid: this.editorParams.PID }),
      this.editorParams &&
        this.editorParams.ISLOCAL === 'TRUE' &&
        (this.isLocal = true),
      this.editorParams &&
        this.editorParams.DECODENAME &&
        (this.deCodeName = this.editorParams.DECODENAME);
  }
  /**
   * 删除项
   *
   * @param {string} key
   * @memberof CommentListComtroller
   */
  async deleteItem(id) {
    var e;
    if (this.isLocal) {
      const a = await this.getLocalTempData();
      if (a) {
        await ((e = a.local) == null ? void 0 : e.delete(this.context, id));
        const i = ibiz.uiDomainManager.get(this.context.srfsessionid);
        i && i.dataChangeCompleted();
      }
    }
    this.evt.emit('deleteItem', {
      eventArg: id,
    });
  }
  async getLocalTempData() {
    const { form: t } = this.parent as IData;
    if (t) {
      const { srfappid: e } = this.context,
        a = e.split('_').pop();
      return await ibiz.hub.getAppDEService(
        e,
        ''.concat(a, '.').concat(this.deCodeName),
        this.context,
      );
    }
  }
  /**
   * 添加项
   *
   * @param {IData} item
   * @memberof CommentListComtroller
   */
  async addItem(item) {
    if (this.isLocal) {
      const e = await this.getLocalTempData();
      if (e) {
        await e.create(this.context, item);
        const a = ibiz.uiDomainManager.get(this.context.srfsessionid);
        a && a.dataChangeCompleted();
      }
    }
    this.evt.emit('addItem', {
      eventArg: item,
    });
  }
  /**
   * 更新项
   *
   * @param {IData} item
   * @return {*}  {Promise<void>}
   * @memberof CommentListComtroller
   */
  async upadteItem(item) {
    if (this.isLocal) {
      const e = await this.getLocalTempData();
      if (e) {
        await e.update(this.context, item);
        const a = ibiz.uiDomainManager.get(this.context.srfsessionid);
        a && a.dataChangeCompleted();
      }
    }
    this.evt.emit('editreply', {
      eventArg: item,
    });
  }
  /**
   * 重新编辑评论
   *
   * @param {IData} item
   * @memberof CommentListComtroller
   */
  updateComment(item) {
    const parent = this.parent as IData;
    const e = parent.panel,
      a = parent.form;
    e
      ? e.evt.emit('editreply', {
          targetName: 'comments',
          context: this.context,
          params: this.params,
          data: [item],
        })
      : a &&
        a.evt.emit('editreply', {
          targetName: 'comments',
          context: this.context,
          params: this.params,
          data: [item],
        });
  }
  /**
   * 删除评论
   *
   * @param {IData} item
   * @memberof CommentListComtroller
   */
  deleteComment(item) {
    const parent = this.parent as IData;
    const e = parent.panel,
      a = parent.form;
    e
      ? e.evt.emit('deletecomment', {
          targetName: 'comments',
          context: this.context,
          params: this.params,
          data: [item],
        })
      : a &&
        a.evt.emit('deletecomment', {
          targetName: 'comments',
          context: this.context,
          params: this.params,
          data: [item],
        });
  }
  handleExtraParams(data) {
    const e = {};
    return (
      Object.keys(this.extraParams).forEach(a => {
        if (
          this.extraParams[a].startsWith('%') &&
          this.extraParams[a].endsWith('%')
        ) {
          const i = this.extraParams[a].slice(1, -1);
          Object.prototype.hasOwnProperty.call(this.context, i)
            ? Object.assign(e, { [a]: this.context[i] })
            : Object.prototype.hasOwnProperty.call(this.params, i)
            ? Object.assign(e, { [a]: this.params[i] })
            : Object.prototype.hasOwnProperty.call(data, i)
            ? Object.assign(e, { [a]: data[i] })
            : Object.assign(e, { [a]: null });
        } else Object.assign(e, { [a]: this.extraParams[a] });
      }),
      e
    );
  }
  /**
   * 发送评论
   *
   * @memberof CommentListComtroller
   */
  sendComment(value, data) {
    const parent = this.parent as IData;
    const a = parent.panel,
      i = parent.form;
    if (a) {
      const m = this.handleExtraParams(a.inputData);
      Object.assign(m, { value: value }),
        a.evt.emit('sendcomment', {
          targetName: 'comments',
          context: this.context,
          params: this.params,
          data: [m],
        });
    } else if (i) {
      const m = this.handleExtraParams(data);
      Object.assign(m, { value: value }),
        i.evt.emit('sendcomment', {
          targetName: 'comments',
          context: this.context,
          params: this.params,
          data: [m],
        });
    }
  }
  /**
   * 获取操作用户列表
   *
   * @memberof PersonelSelectController
   */
  async getOperatorUserList() {
    const t = await ibiz.hub.getApp(this.context.srfappid);
    let e: readonly CodeListItem[] = [];
    (e = await t.codeList.get('SysOperator', this.context, this.params)),
      (this.operatorMap = new Map(e.map(a => [a.value, a])));
  }
}

export { CommentListComtroller };
