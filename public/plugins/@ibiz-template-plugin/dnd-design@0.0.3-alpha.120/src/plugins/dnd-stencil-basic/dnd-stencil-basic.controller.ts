import {
  IAppDataEntity,
  ICodeListEditor,
  IDEEditForm,
  IDEFormItem,
} from '@ibiz/model-core';
import { IAppDEService, IDataEntity, getControl } from '@ibiz-template/runtime';
import { IPortalMessage, RuntimeModelError } from '@ibiz-template/core';
import { DndStencilPanelItemController } from '../../panel-items/dnd-stencil/dnd-stencil.controller';

export class DndStencilBasicController extends DndStencilPanelItemController {
  /**
   * 主表单
   *
   * @author zhanghengfeng
   * @date 2025-03-04 19:03:05
   * @protected
   * @type {IDEEditForm}
   */
  protected majorForm!: IDEEditForm;

  /**
   * 主实体
   *
   * @author zhanghengfeng
   * @date 2025-03-04 19:03:14
   * @protected
   * @type {IAppDataEntity}
   */
  protected majorEntity!: IAppDataEntity;

  /**
   * 主服务
   *
   * @author zhanghengfeng
   * @date 2025-03-04 19:03:35
   * @protected
   * @type {IAppDEService}
   */
  protected majorService!: IAppDEService;

  /**
   * 代码表id
   *
   * @author zhanghengfeng
   * @date 2025-03-04 19:03:14
   * @protected
   * @type {string}
   */
  protected appCodeListId?: string;

  /**
   * 移动端代码表id
   *
   * @author zhanghengfeng
   * @date 2025-03-04 19:03:25
   * @protected
   * @type {string}
   */
  protected mobAppCodeListId?: string;

  /**
   * 初始化
   *
   * @author zhanghengfeng
   * @date 2025-03-04 19:03:53
   * @protected
   * @return {*}  {Promise<void>}
   */
  protected async onInit(): Promise<void> {
    await this.initBaseResource();
    await super.onInit();
    this.onDataUpdate = this.onDataUpdate.bind(this);
    ibiz.mc.command.update.on(this.onDataUpdate);
    this.view.evt.on('onStencilUpdate', async () => {
      await this.load();
    });
    this.view.evt.on('onSaveSuccess', async () => {
      await this.load();
    });
    this.view.evt.on('onRefreshView', async () => {
      await this.load();
    });
  }

  /**
   * 初始化基础资源
   *
   * @author zhanghengfeng
   * @date 2025-03-04 19:03:25
   * @protected
   * @return {*}  {Promise<void>}
   */
  protected async initBaseResource(): Promise<void> {
    const app = ibiz.hub.getApp(this.view.model.appId);
    const majorForm = getControl(this.view.model, 'form');
    if (!majorForm) {
      throw new RuntimeModelError(this.view, '未找到 form 表单模型');
    }
    this.majorForm = majorForm;
    this.majorEntity = await ibiz.hub.getAppDataEntity(
      this.majorForm.appDataEntityId!,
      this.view.model.appId,
    );
    this.majorService = await app.deService.getService(
      this.panel.context,
      this.majorForm.appDataEntityId!,
    );
    const pages = this.majorForm.deformPages;
    if (!Array.isArray(pages) || !pages.length) {
      return;
    }
    const page = pages[0];
    const formDetails = page.deformDetails;
    if (!Array.isArray(formDetails)) {
      return;
    }
    const formDetail = formDetails.find(item => item.codeName === 'pc');
    const mobFormDetail = formDetails.find(item => item.codeName === 'mob');
    if (!formDetail || !mobFormDetail) {
      return;
    }
    const formEditor = (formDetail as IDEFormItem).editor as ICodeListEditor;
    if (formEditor) {
      this.appCodeListId = formEditor.appCodeListId;
    }
    const mobFormEditor = (mobFormDetail as IDEFormItem)
      .editor as ICodeListEditor;
    if (mobFormEditor) {
      this.mobAppCodeListId = mobFormEditor.appCodeListId;
    }
  }

  /**
   * 监听数据变化
   *
   * @author zhanghengfeng
   * @date 2025-03-04 19:03:28
   * @protected
   * @param {IPortalMessage} msg
   * @return {*}  {Promise<void>}
   */
  protected async onDataUpdate(msg: IPortalMessage): Promise<void> {
    if (!msg || !msg.data || typeof msg.data !== 'object') {
      return;
    }
    const data = msg.data as IDataEntity;
    if (
      data.srfdecodename === this.majorEntity.codeName &&
      data.srfkey === this.view.state.data?.srfkey
    ) {
      const majorResult = await this.majorService.getTemp(
        this.panel.context,
        this.panel.params,
      );
      if (!majorResult || !majorResult.ok || !majorResult.data) {
        return;
      }
      if (majorResult.data.mobflag === this.view.context.mobflag) {
        return;
      }
      this.view.context.mobflag = majorResult.data.mobflag;
      this.view.evt.emit('onStencilUpdate', undefined);
    }
  }

  /**
   * 加载数据
   *
   * @author zhanghengfeng
   * @date 2025-03-04 21:03:42
   * @return {*}  {Promise<void>}
   */
  async load(): Promise<void> {
    const appCodeListId = this.view.context.mobflag
      ? this.mobAppCodeListId
      : this.appCodeListId;
    if (!appCodeListId) {
      throw new RuntimeModelError(this.model, `未配置素材区代码表`);
    }
    const app = ibiz.hub.getApp(this.model.appId);
    this.codeList = app.codeList.getCodeList(appCodeListId)!;
    if (!this.codeList) {
      throw new RuntimeModelError(this.model, `未配置素材区代码表`);
    }
    this.codeItems = this.codeList.codeItems || [];
    const index = this.codeItems.findIndex(item => {
      if (item.codeItems && item.codeItems.length > 1) {
        return true;
      }
      return false;
    });
    this.enableGroup = index !== -1;
    this.state.items = this.codeItems;
    this.filter();
  }

  /**
   * 销毁方法
   *
   * @author zhanghengfeng
   * @date 2025-03-04 21:03:59
   */
  destroy(): void {
    super.destroy();
    ibiz.mc.command.update.off(this.onDataUpdate);
  }
}
