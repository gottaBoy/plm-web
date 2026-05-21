/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-syntax */
import { createUUID } from 'qx-util';
import {
  convertNavData,
  DEMainViewEngine,
  getControl,
  IAppDEService,
  IDataEntity,
  SysUIActionTag,
  ViewController,
  ViewMode,
} from '@ibiz-template/runtime';
import { IAppView, IDEEditForm } from '@ibiz/model-core';
import { NavPosController } from '@ibiz-template/vue3-util';
import { HttpError, RuntimeModelError } from '@ibiz-template/core';
import { DesignViewControllerBase } from './design-view-base.controller';
import { IDesignViewEvent, IDesignViewState } from '../../interface';

export class DesignViewEngineBase extends DEMainViewEngine {
  /**
   * 视图控制器
   *
   * @author tony001
   * @date 2024-09-10 10:09:14
   * @protected
   * @type {DesignViewControllerBase<
   *     IAppView,
   *     IDesignViewState,
   *     IDesignViewEvent
   *   >}
   */
  protected declare view: DesignViewControllerBase<
    IAppView,
    IDesignViewState,
    IDesignViewEvent
  >;

  /**
   * 主数据表单(主要用于主数据加载相关接口模型)
   *
   * @author tony001
   * @date 2024-09-10 10:09:59
   * @protected
   * @type {IDEEditForm}
   */
  protected form!: IDEEditForm;

  /**
   * 主数据表单服务
   *
   * @author tony001
   * @date 2024-09-10 10:09:30
   * @protected
   * @type {IAppDEService}
   */
  protected service!: IAppDEService;

  /**
   * 属性区导航占位控制器
   *
   * @author tony001
   * @date 2024-09-10 10:09:08
   * @protected
   * @type {NavPosController}
   */
  protected navPos!: NavPosController;

  /**
   * 当前激活属性视图
   *
   * @author tony001
   * @date 2024-09-10 10:09:48
   * @protected
   * @type {ViewController}
   */
  protected activePropertyView!: ViewController;

  /**
   * 是否正在等待计时器
   *
   * @author zhanghengfeng
   * @date 2025-02-27 22:02:12
   * @protected
   * @type {boolean}
   */
  protected isWait: boolean = false;

  /**
   * 获取数据
   *
   * @author zhanghengfeng
   * @date 2025-02-27 22:02:33
   * @return {*}  {IData[]}
   */
  getData(): IData[] {
    return [this.view.state.data];
  }

  /**
   * 初始化标记打开数据相关逻辑
   *
   * @author zhanghengfeng
   * @date 2025-02-27 22:02:48
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
   * @date 2025-02-27 22:02:37
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
   * @date 2025-02-27 22:02:05
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
      this.view.evt.on('onEditAction', () => {
        this.sendEditAction();
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
   * @date 2025-02-27 22:02:33
   * @protected
   * @return {*}  {Promise<void>}
   */
  protected async refresh(): Promise<void> {
    await this.refreshView();
  }

  /**
   * 初始化tab导航
   *
   * @author zhanghengfeng
   * @date 2025-02-11 18:02:19
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

  /**
   * 视图初始化
   *
   * @author tony001
   * @date 2024-09-10 10:09:10
   * @return {*}  {Promise<void>}
   */
  async onCreated(): Promise<void> {
    await super.onCreated();
    (this.view as IData).model = {
      ...(this.view as IData).model,
      showDataInfoBar: true,
    };
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
    // 订阅视图级选中事件
    this.onSelect = this.onSelect.bind(this);
    this.view.select.on(this.onSelect);
    // 视图关闭校验
    this.initViewShouldDismissHook();
    // 加载数据
    const result = await this.load();
    // 初始化完成
    this.view.evt.emit('onInitedSuccess', {
      data: result,
    });
    // 初始化自定义参数
    this.initCustomParams();
  }

  /**
   * 视图挂载
   *
   * @author tony001
   * @date 2024-09-10 11:09:22
   * @return {*}  {Promise<void>}
   */
  async onMounted(): Promise<void> {
    await super.onMounted();
    // 初始化工具栏状态
    this.toolbar?.calcButtonState(
      this.view.state.data,
      this.form.appDataEntityId,
    );
    this.navPos = this.view.layoutPanel!.panelItems.nav_pos as NavPosController;
    // 激活根节点
    this.activeRoot();
    // 初始化属性视图
    this.initPropertyView();
    this.view.evt.emit('onViewInfoChange', {
      dataInfo: this.view.state.data.srfmajortext || '',
    });
  }

  /**
   * 初始化视图hook
   *
   * @author tony001
   * @date 2024-09-10 11:09:37
   * @protected
   */
  protected initViewShouldDismissHook(): void {
    this.view.modal.hooks.shouldDismiss.tapPromise(async context => {
      const uiDomain = ibiz.uiDomainManager.get(this.view.context.srfsessionid);
      if (
        uiDomain &&
        uiDomain.dataModification === true &&
        context.allowClose == null
      ) {
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
  }

  /**
   * 初始化自定义参数
   *
   * @protected
   * @memberof DesignViewEngineBase
   */
  protected initCustomParams(): void {}

  /**
   * 初始化属性视图
   *
   * @author tony001
   * @date 2024-09-10 11:09:01
   * @protected
   */
  protected initPropertyView(): void {
    (this.view.layoutPanel?.evt as any).on(
      'onPresetPanelItemEvent',
      (event: IData) => {
        const { panelItemEventName, panelItemName, presetParams } =
          event as IData;
        if (
          panelItemName === 'nav_pos' &&
          panelItemEventName === 'onViewCreated'
        ) {
          this.activePropertyView = presetParams?.view;
        }
      },
    );
  }

  /**
   * 选中数据
   *
   * @author tony001
   * @date 2024-09-10 11:09:22
   * @protected
   * @param {(IData | undefined | null)} data
   */
  protected onSelect(data: IData | undefined | null): void {
    if (data) {
      this.onActive(data);
    }
  }

  /**
   * 激活根节点
   *
   * @author tony001
   * @date 2024-12-30 16:12:09
   * @protected
   * @param {boolean} [forceRefresh=false] 是否强刷
   */
  protected activeRoot(forceRefresh: boolean = false): void {
    this.view.select.set({
      id: this.view.state.data.srfkey!,
      label: this.view.state.data.srfmajortext!,
      type: '',
      data: this.view.state.data,
      forceRefresh,
    });
  }

  /**
   * 加载数据
   *
   * @author tony001
   * @date 2025-03-27 15:03:40
   * @protected
   * @param {boolean} [isInitialLoad=true]
   * @return {*}  {(Promise<IData | null>)}
   */
  protected async load(isInitialLoad: boolean = true): Promise<IData | null> {
    try {
      this.view.startLoading();
      const action = isInitialLoad ? 'get' : 'getTemp';
      const res = await this.service[action](
        this.view.context,
        this.view.params,
      );
      if (res.ok && res.data) {
        this.service.local.add(this.view.context, res.data as IDataEntity);
        this.view.state.data = res.data as IDataEntity;
        return res.data;
      }
      return null;
    } catch (error) {
      if (error instanceof HttpError) {
        error.tag = this.view.context.srfviewid;
      }
      throw error;
    } finally {
      this.view.endLoading();
    }
  }

  /**
   * 保存数据
   *
   * @author tony001
   * @date 2024-09-10 11:09:06
   * @protected
   * @return {*}  {(Promise<IData | null>)}
   */
  protected async save(): Promise<IData | null> {
    try {
      this.view.startLoading();
      const majorResult = await this.service.getTemp(this.view.context);
      if (majorResult.ok && majorResult.data) {
        const majorData = majorResult.data;
        for (const key in majorData) {
          if (Object.prototype.hasOwnProperty.call(majorData, key)) {
            const val = majorData[key];
            if (typeof val === 'object' && val !== null) {
              majorData[key] = undefined;
            }
          }
        }
        const res = await this.service.update(this.view.context, majorData);
        if (res.ok && res.data) {
          this.service.local.add(this.view.context, res.data as IDataEntity);
          this.view.state.data = res.data as IDataEntity;
          this.view.evt.emit('onViewInfoChange', {
            dataInfo: this.view.state.data.srfmajortext || '',
          });
          this.view.evt.emit('onSaveSuccess', undefined);
          ibiz.message.success(`${this.view.state.data.srfmajortext}保存成功!`);
          return res.data;
        }
      }
      return null;
    } catch (error) {
      if (error instanceof HttpError) {
        error.tag = this.view.context.srfviewid;
      }
      throw error;
    } finally {
      this.view.endLoading();
    }
  }

  /**
   * 视图能力调用
   *
   * @author tony001
   * @date 2024-09-10 11:09:29
   * @param {string} key
   * @param {IData} [args]
   * @return {*}  {(Promise<IData | null | undefined>)}
   */
  async call(key: string, args?: IData): Promise<IData | null | undefined> {
    if (key === SysUIActionTag.SAVE) {
      return this.save();
    }
    if (key === 'onActive') {
      this.view.select.set(args as IData);
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
   * @author tony001
   * @date 2024-12-30 16:12:12
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
   * 激活数据（主要控制右侧属性视图的显示）
   *
   * @author tony001
   * @date 2024-09-10 11:09:57
   * @protected
   * @param {IData} data
   * @return {*}  {Promise<void>}
   */
  protected async onActive(data: IData): Promise<void> {
    const { forceRefresh } = data;
    const deName = data.data.srfdecodename;
    const refs = this.view.model.viewLayoutPanel!.appViewRefs;
    if (refs) {
      const type = data.type ? data.type.toUpperCase() : null;
      const ref = refs.find((item: IData) => {
        return (
          item.name ===
          `EDITDATA:${deName.toUpperCase()}${type ? `:${type}` : ''}`
        );
      });
      if (ref) {
        const context = this.view.context.clone();
        context[deName.toLowerCase()] = data.id;
        delete context.srfrunmode;
        const { navigateContexts } = ref;
        Object.assign(
          context,
          convertNavData(navigateContexts, data.data, context),
        );
        this.navPos.openView({
          key: forceRefresh ? createUUID() : data.id,
          viewId: ref.refAppViewId,
          context,
        });
      }
    }
  }
}
