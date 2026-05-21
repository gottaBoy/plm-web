/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DEMainViewEngine,
  EditFormController,
  IAppDEService,
  IDataEntity,
  SysUIActionTag,
  ViewController,
  ViewMode,
  getControl,
} from '@ibiz-template/runtime';
import { IDEEditForm } from '@ibiz/model-core';
import { RuntimeModelError } from '@ibiz-template/core';
import { NavPosController } from '@ibiz-template/vue3-util';
import { createUUID } from 'qx-util';
import { DndDesignViewController } from './dnd-design-view.controller';
import { IDndDesignPanelItemController } from '../../interface';
import { modelStateUtil } from '../../utils';

/**
 * dnd 设计视图引擎
 *
 * @author chitanda
 * @date 2023-11-11 17:11:39
 * @export
 * @class DndDesignViewEngine
 * @extends {ViewEngineBase}
 */
export class DndDesignViewEngine extends DEMainViewEngine {
  protected declare view: DndDesignViewController;

  /**
   * 主数据表单(主要用于主数据加载相关接口模型)
   *
   * @author chitanda
   * @date 2023-11-16 17:11:08
   * @protected
   * @type {IDEEditForm}
   */
  protected form!: IDEEditForm;

  /**
   * 属性区导航占位控制器
   *
   * @author chitanda
   * @date 2023-11-22 12:11:07
   * @protected
   * @type {NavPosController}
   */
  protected navPos!: NavPosController;

  /**
   * 主数据表单服务
   *
   * @author chitanda
   * @date 2023-11-16 17:11:13
   * @protected
   * @type {IAppDEService}
   */
  protected service!: IAppDEService;

  /**
   * 当前激活属性视图
   *
   * @author zhanghengfeng
   * @date 2025-02-27 22:02:01
   * @protected
   * @type {ViewController}
   */
  protected activePropertyView?: ViewController;

  /**
   * 是否正在等待计时器
   *
   * @author zhanghengfeng
   * @date 2025-02-27 22:02:33
   * @protected
   * @type {boolean}
   */
  protected isWait: boolean = false;

  /**
   * 获取数据
   *
   * @author zhanghengfeng
   * @date 2025-02-27 22:02:50
   * @return {*}  {IData[]}
   */
  getData(): IData[] {
    return [this.view.state.data];
  }

  /**
   * 初始化标记打开数据相关逻辑
   *
   * @author zhanghengfeng
   * @date 2025-02-27 22:02:04
   * @protected
   * @return {*}  {void}
   */
  protected initMarkOpenData(): void {
    if (
      !this.coopPos ||
      ![ViewMode.ROUTE, ViewMode.ROUTE_MODAL].includes(this.view.modal.mode)
    ) {
      return;
    }
    this.markModes = [
      'OPENDATA',
      'EDITDATA',
      'DISPLAYOPPERSON',
      'NOTICERELOAD',
    ];
    this.coopPos.initMessageModes(this.markModes);
    this.doActions = [];
    this.doActions.push('EDIT', 'VIEW', 'UPDATE', 'CLOSE');
    this.view.evt.on('onUpdateAccessState', async () => {
      this.sendViewDataAction();
    });
    this.doMarkDataAction();
  }

  /**
   * 发送编辑行为
   *
   * @author zhanghengfeng
   * @date 2025-02-27 22:02:50
   * @protected
   * @return {*}  {void}
   */
  protected sendEditAction(): void {
    if (this.isWait) {
      return;
    }
    const data = this.getData()[0];
    if (!data) {
      return;
    }
    this.isWait = true;
    this.sendMarkDataAction('EDIT', data.srfkey);
    setTimeout(
      () => {
        this.isWait = false;
      },
      1000 * 60 * 5,
    );
  }

  /**
   * 执行标记数据行为
   *
   * @author zhanghengfeng
   * @date 2025-02-27 22:02:22
   * @protected
   */
  protected doMarkDataAction(): void {
    super.doMarkDataAction();
    if (this.doActions.includes('VIEW')) {
      this.view.evt.on('onMounted', () => this.sendViewDataAction());
    }
    if (this.doActions.includes('EDIT')) {
      const uiDomain = ibiz.uiDomainManager.get(this.view.context.srfsessionid);
      uiDomain?.evt?.on('stateChange', ({ state, isTrusted }) => {
        if (state && isTrusted) {
          this.sendEditAction();
        }
      });
    }
    if (this.doActions.includes('UPDATE')) {
      this.view.evt.on('onSaveSuccess', () => {
        const data = this.getData()[0];
        if (!data) {
          return;
        }
        this.sendMarkDataAction('UPDATE', data.srfkey);
      });
    }
  }

  /**
   * 刷新
   *
   * @author zhanghengfeng
   * @date 2025-02-27 22:02:10
   * @protected
   * @return {*}  {Promise<void>}
   */
  protected async refresh(): Promise<void> {
    await this.refreshView();
  }

  /**
   * 初始化属性视图
   *
   * @author zhanghengfeng
   * @date 2025-02-27 22:02:44
   * @protected
   */
  protected initPropertyView(): void {
    this.view.layoutPanel?.evt?.on('onPresetPanelItemEvent', (event: IData) => {
      if (!event) {
        return;
      }
      const { panelItemEventName, panelItemName, presetParams } = event;
      if (
        panelItemName === 'nav_pos' &&
        panelItemEventName === 'onViewCreated' &&
        presetParams
      ) {
        this.activePropertyView = presetParams.view;
        this.activePropertyView?.evt.on('onDeactivated', () => {
          const propertyForm = presetParams.view?.getController('form') as
            | EditFormController
            | undefined;
          if (propertyForm) {
            propertyForm.formItems.forEach(item => {
              item.state.error = null;
            });
          }
        });
        this.activePropertyView?.evt.on('onActivated', () => {
          this.activePropertyView = presetParams.view;
        });
      }
    });
  }

  /**
   * 初始化tab导航
   *
   * @author zhanghengfeng
   * @date 2025-02-11 18:02:37
   * @protected
   * @return {*}  {void}
   */
  protected initNavTab(): void {
    const parentView = this.view.parentView;
    if (!parentView) {
      return;
    }
    const panelItems = parentView.layoutPanel?.panelItems;
    if (!panelItems || !panelItems.nav_pos_index) {
      return;
    }
    const navPosIndex = panelItems.nav_pos_index as any;
    if (navPosIndex.navTabs && navPosIndex.state?.currentKey) {
      const key = navPosIndex.state.currentKey;
      const viewKey = `${this.view.model.codeName}-${this.view.id}`;
      navPosIndex.navTabs.updateViewInfo?.(key, {
        viewKey,
        caption: this.view.model.caption,
        sysImage: this.view.model.sysImage,
      });
    }
  }

  async onCreated(): Promise<void> {
    (this.view as IData).model = {
      ...(this.view as IData).model,
      showDataInfoBar: true,
    };
    await super.onCreated();
    this.initNavTab();
    // 初始化主表单相关
    {
      const form = getControl(this.view.model, 'form') as IDEEditForm;
      if (!form) {
        throw new RuntimeModelError(this.view, '未找到主数据表单模型');
      }
      this.form = form;
      const app = ibiz.hub.getApp(this.view.model.appId);
      this.service = await app.deService.getService(
        this.view.context,
        this.form.appDataEntityId!,
      );
    }
    this.onSelect = this.onSelect.bind(this);
    // 订阅视图级选中事件
    this.view.select.on(this.onSelect);
    this.view.modal.hooks.shouldDismiss.tapPromise(async context => {
      const uiDomain = ibiz.uiDomainManager.get(this.view.context.srfsessionid);
      if (uiDomain?.dataModification === true && context.allowClose == null) {
        const isAllow = await ibiz.confirm.error({
          title: '关闭提醒',
          desc: '数据已经修改，确定要关闭？',
        });
        if (!isAllow) {
          context.allowClose = false;
        } else {
          context.allowClose = true;
        }
      }
    });
    await this.load();
    // 合入应用实体标识
    const data = this.view.state.data;
    if (data && data.psdeid) {
      this.view.context.psdataentity = data.psdeid;
    }
  }

  protected onSelect(data: IData | null | undefined): void {
    this.onActive(data!);
  }

  async onMounted(): Promise<void> {
    await super.onMounted();
    // 初始化工具栏状态
    this.toolbar?.calcButtonState(
      this.view.state.data,
      this.form.appDataEntityId,
    );
    this.navPos = this.view.layoutPanel!.panelItems.nav_pos as NavPosController;
    this.activeRoot();
    this.initPropertyView();
    this.view.evt.emit('onViewInfoChange', {
      dataInfo: this.view.state.data.srfmajortext || '',
    });
  }

  async onDestroyed(): Promise<void> {
    await super.onDestroyed();
    this.view.select.off(this.onSelect);
  }

  /**
   * 激活根节点
   *
   * @author zhanghengfeng
   * @date 2024-12-30 21:12:50
   * @protected
   * @param {boolean} [forceRefresh=false]
   */
  protected activeRoot(forceRefresh: boolean = false): void {
    this.view.state.data.forceRefresh = forceRefresh;
    this.view.select.set(this.view.state.data);
  }

  protected async load(isInitialLoad: boolean = true): Promise<IData | null> {
    try {
      this.view.startLoading();
      const action = isInitialLoad ? 'get' : 'getTemp';
      const res = await this.service[action](
        this.view.context,
        this.view.params,
      );
      this.service.local.add(this.view.context, res.data as IDataEntity);
      this.view.state.data = res.data as IDataEntity;
      this.view.context.mobflag = res.data?.mobflag;
      return res.data;
    } finally {
      this.view.endLoading();
    }
  }

  protected async save(): Promise<IData | null | undefined> {
    try {
      const propertyForm = this.activePropertyView?.getController('form') as
        | EditFormController
        | undefined;
      if (propertyForm) {
        const isValid = await propertyForm.validate();
        if (!isValid) {
          ibiz.message.error('请检查表单填写！');
          return;
        }
      }
      this.view.startLoading();
      const data = this.service.local.get(
        this.view.context,
        this.view.state.data.srfkey,
      );
      // eslint-disable-next-line no-restricted-syntax
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const val = data[key];
          if (typeof val === 'object' && val !== null) {
            data[key] = undefined;
          }
        }
      }
      const res = await this.service.update(this.view.context, data!);
      this.service.local.add(this.view.context, res.data as IDataEntity);
      this.view.state.data = res.data as IDataEntity;
      this.view.context.mobflag = res.data?.mobflag;
      ibiz.message.success(
        `${this.view.state.data.srfmajortext || ''}保存成功!`,
      );
      await this.view.evt.emit('onSaveSuccess', undefined);
      this.activeRoot();
      this.view.evt.emit('onViewInfoChange', {
        dataInfo: this.view.state.data.srfmajortext || '',
      });
      this.toolbar?.calcButtonState(
        this.view.state.data,
        this.form.appDataEntityId,
      );
      return res.data;
    } finally {
      this.view.endLoading();
    }
  }

  async call(key: string, args?: IData): Promise<IData | null | undefined> {
    if (key === SysUIActionTag.SAVE) {
      return this.save();
    }
    if (key === 'onActive' && args) {
      this.onActive(args);
      return undefined;
    }
    if (key === 'onActiveRoot') {
      this.activeRoot();
      return undefined;
    }
    if (key === 'Refresh') {
      this.refreshView(args);
      return undefined;
    }
    return super.call(key as any, args);
  }

  /**
   * 刷新视图
   *
   * @author zhanghengfeng
   * @date 2024-12-30 21:12:35
   * @protected
   * @return {*}  {Promise<void>}
   */
  protected async refreshView(args?: IData): Promise<void> {
    const { ignoreLoad = false } = args || {};
    // 仅当需要加载数据时才执行加载
    if (!ignoreLoad) {
      await this.load();
    } else {
      await this.load(false);
    }
    this.activeRoot(true);
    this.view.evt.emit('onRefreshView', undefined);
    this.view.evt.emit('onViewInfoChange', {
      dataInfo: this.view.state.data?.srfmajortext || '',
    });
  }

  /**
   * 设置激活数据
   *
   * @description 主要控制右侧属性视图的显示
   * @author chitanda
   * @date 2023-11-22 12:11:36
   * @protected
   * @param {IData} data
   */
  protected onActive(data: IData): void {
    const { forceRefresh } = data;
    delete data.forceRefresh;
    const refs = this.view.model.appViewRefs;
    if (refs) {
      const type = data.srftype ? data.srftype.toUpperCase() : null;
      const ref = refs.find(
        item =>
          item.name ===
          `EDITDATA:${data.srfdecodename.toUpperCase()}${
            type ? `:${type}` : ''
          }`,
      );
      if (ref) {
        const context = this.view.context.clone();
        context[data.srfdecodename.toLowerCase()] = data.srfkey;
        delete context.srfrunmode;
        const dndDesignController = this.view.layoutPanel?.panelItems
          .dnd_design_panel_item as IDndDesignPanelItemController;
        const modelState = dndDesignController
          ? dndDesignController.getModelState(data as IDataEntity)
          : 0;
        if (!modelStateUtil.isEnableUpdate(modelState)) {
          context.srfreadonly = true;
        }
        const navViewMsg = {
          key: forceRefresh ? createUUID() : data.srfkey,
          viewId: ref.refAppViewId,
          context,
        };

        const cacheKey = (this.navPos as any).calcCacheKey(navViewMsg);
        if (this.navPos.state.navViewMsgs[cacheKey]) {
          Object.assign(this.navPos.state.navViewMsgs[cacheKey], { context });
        }
        this.navPos.openView(navViewMsg);
      } else {
        throw new RuntimeModelError(
          this.view.model,
          `未匹配到对应[${data.srftype}]的属性编辑视图`,
        );
      }
    }
  }
}
