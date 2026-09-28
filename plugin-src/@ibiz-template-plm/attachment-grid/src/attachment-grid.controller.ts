import { GridController } from '@ibiz-template/runtime';

class AttachGridController extends GridController {
  /**
   * 添加附件
   *
   * @memberof AttachGridController
   */
  async addAttachMent(attachments) {
    const { appDataEntityId: n } = this.model;
    n &&
      (await ibiz.hub
        .getApp(this.context.srfappid)
        .deService.exec(n, 'create', this.context, attachments),
      await this.load({ isInitialLoad: false }),
      await this.evt.emit('onSaveSuccess', void 0));
  }
}

export { AttachGridController };
