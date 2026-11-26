import { RuntimeModelError } from '@ibiz-template/core';
import { notNilEmpty } from 'qx-util';
import { clone, mergeDeepLeft } from 'ramda';
import {
  EditorController,
  getDeACMode,
  OpenAppViewCommand,
  UIActionUtil,
} from '@ibiz-template/runtime';
import type {
  IAppDEACMode,
  IDEACModeDataItem,
  IPicker,
  IUIActionGroupDetail,
} from '@ibiz/model-core';
import type { IHttpResponse, IViewConfig } from './types';
import { personSelectText } from './personel-select.locale';

/**
 * Source recovered from the published ESM bundle.
 * The original repository source was not included in the plugin package.
 */
export class PersonelSelectController extends EditorController<IPicker> {
  declare model: IPicker;

  operatorMap: Map<any, any> = new Map();

  currentOperator?: IData;

  total = 0;

  currentNumber = -1;

  page = 0;

  deptpage = 0;

  deptcurrentNumber = -1;

  depttotal = 0;

  private userLoad?: Promise<IHttpResponse | undefined>;

  private deptLoad?: Promise<IHttpResponse | undefined>;

  private userLoadVersion = 0;

  private deptLoadVersion = 0;

  size = 20;

  multiple = false;

  isAddSymbol = false;

  separator = ',';

  pickupView: IViewConfig | null = null;

  linkView: IViewConfig | null = null;

  userFilterMap: IData = {
    id: 'id',
    name: 'name',
    title: 'title',
    avatar: '',
  };

  deptFilterMap: IData = {
    id: 'id',
    name: 'name',
    title: 'title',
    avatar: '',
  };

  isShowTab = true;

  valueItem = '';

  keyName = 'srfkey';

  textName = 'srfmajortext';

  interfaceName = '';

  sort?: string;

  noAC = false;

  noButton = false;

  deACMode?: IAppDEACMode;

  dataItems: IDEACModeDataItem[] = [];

  objectIdField?: string;

  objectNameField?: string;

  objectValueField?: string;

  userUrl = '';

  deptUrl = '';

  copyUserUrl = '';

  copyDeptUrl = '';

  userMethod: 'get' | 'post' = 'post';

  deptMethod: 'get' | 'post' = 'post';

  contextReg = /\$\{context.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g;

  dataReg = /\$\{data.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g;

  paramsReg = /\$\{params.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g;

  defaultSelCurUser = false;

  valueType = 'OBJECTS';

  attentionTypeField = 'type';

  selfFillMap: IData = {
    user_id: 'user_id',
    user_name: 'name',
    user_title: 'title',
  };

  sysOperatorCodeListTag = '';

  defaultAttentionValue = '';

  showNameText = true;

  showNameTip = false;

  suffix = '';

  clearFilter = false;

  userAuthEntity = '';

  deptAuthEntity = '';

  enableBottomButton = false;

  protected async onInit(): Promise<void> {
    await super.onInit();
    this.initDefaultAttribute();
    this.valueItem = this.model.valueItemName?.toLowerCase() || '';
    this.initParams();
    await this.getOperatorUserList();

    if (this.model.appDataEntityId) {
      if (this.model.appDEDataSetId) {
        this.interfaceName = this.model.appDEDataSetId;
      }
      if (this.model.appDEACModeId) {
        this.deACMode = await getDeACMode(
          this.model.appDEACModeId,
          this.model.appDataEntityId,
          this.context.srfappid,
        );
      }
      if (this.deACMode) {
        const { minorSortAppDEFieldId, minorSortDir } = this.deACMode;
        if (minorSortAppDEFieldId && minorSortDir) {
          this.sort = `${minorSortAppDEFieldId.toLowerCase()},${minorSortDir.toLowerCase()}`;
        }
        if (this.deACMode.textAppDEFieldId) {
          this.textName = this.deACMode.textAppDEFieldId;
        }
        if (this.deACMode.valueAppDEFieldId) {
          this.keyName = this.deACMode.valueAppDEFieldId;
        }
        if (this.deACMode.deacmodeDataItems) {
          this.dataItems = [];
          this.deACMode.deacmodeDataItems.forEach(item => {
            if (item.id !== 'value' && item.id !== 'text') {
              this.dataItems.push(item);
            }
          });
        }
      }
    }

    const pickupTypes = [
      'PICKEREX_DROPDOWNVIEW',
      'PICKEREX_DROPDOWNVIEW_LINK',
      'PICKUPVIEW',
    ];
    if (this.model.editorType && pickupTypes.includes(this.model.editorType)) {
      this.initPickupViewParams();
    }
    this.objectIdField = this.model.objectIdField?.toLowerCase();
    this.objectNameField = this.model.objectNameField?.toLowerCase();
    this.objectValueField = this.model.objectValueField?.toLowerCase();
  }

  initDefaultAttribute(): void {
    if (this.model.valueType) {
      this.valueType = this.model.valueType;
    }
  }

  initParams(): void {
    switch (this.model.editorType) {
      case 'PICKEREX_NOAC':
      case 'PICKEREX_NOAC_LINK':
        this.noAC = true;
        break;
      case 'PICKEREX_NOBUTTON':
        this.noButton = true;
        break;
      default:
        this.noButton = false;
        this.noAC = false;
        break;
    }

    this.userUrl = this.editorParams.URL;
    this.deptUrl = this.editorParams.DEPTURL;
    this.userMethod = this.editorParams.USERMETHOD || 'post';
    this.deptMethod = this.editorParams.DEPTMETHOD || 'post';
    this.sysOperatorCodeListTag =
      this.editorParams.sysoperatorcodelisttag || 'SysOperator';
    this.multiple = this.editorParams.MULTIPLE === 'true';
    this.defaultSelCurUser =
      this.editorParams.DEFAULTSELCURUSER === 'true';
    this.separator = this.editorParams.SEPARATOR || ',';
    this.isAddSymbol =
      this.editorParams.ISADDSYMBOL === 'true' && this.multiple === true;
    this.isShowTab = this.editorParams.ISSHOWTAB !== 'false';
    this.suffix = this.editorParams.SUFFIX;
    this.clearFilter = this.editorParams.CLEARFILTER === 'true';
    if (this.editorParams.VALUETYPE) {
      this.valueType = this.editorParams.VALUETYPE;
    }
    if (this.editorParams.DEFAULTATNVALUE) {
      this.defaultAttentionValue = this.editorParams.DEFAULTATNVALUE;
    }
    if (this.editorParams.VALUEITEMNAME) {
      this.valueItem = this.editorParams.VALUEITEMNAME;
    }
    if (this.editorParams.userauthentity) {
      this.userAuthEntity = this.editorParams.userauthentity;
    }
    if (this.editorParams.deptauthentity) {
      this.deptAuthEntity = this.editorParams.deptauthentity;
    }
    if (this.editorParams.ENABLEBOTTOMBUTTON) {
      this.enableBottomButton =
        this.editorParams.ENABLEBOTTOMBUTTON === 'true';
    }

    this.parseObjectParam('SELFFILLMAP', value => {
      Object.assign(this.selfFillMap, value);
    });
    this.parseObjectParam('USERMAP', value => {
      Object.assign(this.userFilterMap, value);
    }, () => {
      this.userFilterMap = {
        id: 'id',
        name: 'name',
        title: 'title',
        avatar: '',
      };
    });
    this.parseObjectParam('DEPTMAP', value => {
      Object.assign(this.deptFilterMap, value);
    }, () => {
      this.deptFilterMap = {
        id: 'id',
        name: 'name',
        title: 'title',
        avatar: '',
      };
    });

    if (this.editorParams.SHOWNAMETEXT) {
      this.showNameText = this.toBoolean(this.editorParams.SHOWNAMETEXT);
    }
    if (this.editorParams.SHOWNAMETIP) {
      this.showNameTip = this.toBoolean(this.editorParams.SHOWNAMETIP);
    }
  }

  protected parseObjectParam(
    key: string,
    onSuccess: (value: IData) => void,
    onError?: () => void,
  ): void {
    if (
      this.editorParams &&
      Object.prototype.hasOwnProperty.call(this.editorParams, key)
    ) {
      try {
        onSuccess(JSON.parse(this.editorParams[key]));
      } catch (error) {
        ibiz.log.error(error);
        if (!onError) return;
        onError();
      }
    }
  }

  async initPickupViewParams(): Promise<void> {
    if (this.model.pickupAppViewId) {
      this.pickupView = await ibiz.hub.config.view.get(
        this.model.pickupAppViewId,
      );
    }
  }

  async initLinkViewParams(): Promise<void> {
    if (this.model.linkAppViewId) {
      this.linkView = await ibiz.hub.config.view.get(
        this.model.linkAppViewId,
      );
    }
  }

  async initCurrentOperator(data: IData, context: IParams): Promise<void> {
    const userId = this.context.srfuserid;
    if (!userId) return;
    const res = await this.getServiceData(
      'department',
      data,
      {},
      {
        ...context,
        page: 0,
        size: 20,
        n_id_eq: userId,
      },
    );
    if (res && res.data && res.data.length > 0) {
      this.currentOperator = res.data.find(
        item => item[this.deptFilterMap.id] === userId,
      );
    }
  }

  resetState(): void {
    this.resetUserState();
    this.resetDeptState();
  }

  resetUserState(): void {
    this.userLoadVersion += 1;
    this.userLoad = undefined;
    this.total = 0;
    this.currentNumber = -1;
    this.page = 0;
    this.copyUserUrl = '';
  }

  resetDeptState(): void {
    this.deptLoadVersion += 1;
    this.deptLoad = undefined;
    this.deptpage = 0;
    this.depttotal = 0;
    this.deptcurrentNumber = -1;
    this.copyDeptUrl = '';
  }

  async loadMore(
    data: IData,
    tag: 'user' | 'department',
    params: IParams = {},
  ): Promise<IHttpResponse | undefined> {
    const isUser = tag === 'user';
    const pending = isUser ? this.userLoad : this.deptLoad;
    if (pending) return pending;
    const hasMore = isUser
      ? this.currentNumber < this.total
      : this.deptcurrentNumber < this.depttotal;
    if (!hasMore) return undefined;
    const version = isUser ? this.userLoadVersion : this.deptLoadVersion;
    const request = this.getServiceData(tag, data, params).then(res => {
      // Reset searches and tab changes must not advance the new list's page.
      if (!res || version !== (isUser ? this.userLoadVersion : this.deptLoadVersion)) {
        return undefined;
      }
      if (isUser) {
        this.page += 1;
        if (this.currentNumber < 0) this.currentNumber += 1;
        this.currentNumber += this.size;
        this.total =
          (res.total ? Number(res.total) : Number(res.headers['x-total'])) || 0;
        this.applyFilterMap(res.data, this.userFilterMap);
      } else {
        this.deptpage += 1;
        if (this.deptcurrentNumber < 0) this.deptcurrentNumber += 1;
        this.deptcurrentNumber += this.size;
        this.depttotal =
          (res.total ? Number(res.total) : Number(res.headers['x-total'])) || 0;
        this.applyFilterMap(res.data, this.deptFilterMap);
      }
      return res;
    });
    if (isUser) this.userLoad = request;
    else this.deptLoad = request;
    try {
      return await request;
    } finally {
      if (isUser && this.userLoad === request) this.userLoad = undefined;
      if (!isUser && this.deptLoad === request) this.deptLoad = undefined;
    }
  }

  protected applyFilterMap(items: IData[], filterMap: IData): void {
    items.forEach(item => {
      Object.keys(filterMap).forEach(key => {
        item[key] = item[filterMap[key]];
      });
    });
  }

  async onActionClick(
    detail: IUIActionGroupDetail,
    row: IData,
    event: MouseEvent,
  ): Promise<void> {
    const actionId = detail.uiactionId;
    const parent = this.parent as any;
    let view: any = {};
    if (parent.form) {
      view = parent.form.ctx.view;
    } else if (parent.grid) {
      view = parent.grid.ctx.view;
    }
    await UIActionUtil.execAndResolved(
      actionId,
      {
        context: this.context,
        params: this.params,
        data: row as unknown as IData[],
        view,
        event,
      },
      detail.appId,
    );
  }

  fill(
    str = '',
    context?: IParams,
    params?: IParams,
    data?: IData,
  ): string {
    if (notNilEmpty(str)) {
      if (notNilEmpty(context)) {
        const contextMatches = str.match(this.contextReg);
        contextMatches?.forEach(match => {
          const key = match.slice(10, match.length - 1);
          str = str.replace(`\${context.${key}}`, context[key] || '');
        });
      }
      if (notNilEmpty(params)) {
        const paramMatches = str.match(this.paramsReg);
        paramMatches?.forEach(match => {
          const key = match.slice(9, match.length - 1);
          str = str.replace(`\${params.${key}}`, params[key] || '');
        });
      }
      if (notNilEmpty(data)) {
        const dataMatches = str.match(this.dataReg);
        dataMatches?.forEach(match => {
          const key = match.slice(7, match.length - 1);
          str = str.replace(`\${data.${key}}`, data[key] || '');
        });
      }
    }
    return str;
  }

  async getServiceData(
    tag: 'user' | 'department',
    data: IData,
    query: IParams,
    params?: IParams,
  ): Promise<IHttpResponse> {
    const { context, params: publicParams } = this.handlePublicParams(
      data,
      this.context,
      this.params,
    );
    const requestParams: IParams = {};
    if (this.sort && !Object.is(this.sort, '')) {
      Object.assign(requestParams, { sort: this.sort });
    }
    Object.assign(requestParams, {
      page: tag === 'user' ? this.page : this.deptpage,
      size: this.size,
    });
    if (query) Object.assign(requestParams, query);
    const finalParams =
      params && Object.keys(params).length > 0
        ? params
        : mergeDeepLeft(publicParams, requestParams);

    const userUrl = this.fill(this.userUrl, context, publicParams, data).replaceAll(
      '//',
      '/',
    );
    const deptUrl = this.fill(this.deptUrl, context, publicParams, data).replaceAll(
      '//',
      '/',
    );
    this.copyUserUrl = userUrl;
    this.copyDeptUrl = deptUrl;

    let url = '';
    let method: string = 'post';
    const config: IData = {};
    if (tag === 'user') {
      url = userUrl;
      method = this.userMethod.toLowerCase();
    } else {
      url = deptUrl;
      method = this.deptMethod.toLowerCase();
    }
    if (method === 'get') {
      Object.assign(config, { method, params: finalParams });
    } else {
      Object.assign(config, { method, data: finalParams });
    }

    if (url) {
    return await ibiz.net.request(url, config) as IHttpResponse;
    }
    throw new RuntimeModelError(this.model, personSelectText('Configure a data interface URL', '请配置数据接口地址'));
  }

  async openPickUpView(
    data: IData,
    selectedData?: IData[],
  ): Promise<IData[] | undefined> {
    await this.initPickupViewParams();
    const { context, params } = this.handlePublicParams(
      data,
      this.context,
      this.params,
    );
    if (selectedData) {
      params.selectedData = selectedData;
    }
    if (!this.pickupView) {
      throw new RuntimeModelError(this.model, personSelectText('Configure a data selection view', '请配置数据选择视图'));
    }
    const result = (await ibiz.commands.execute(
      OpenAppViewCommand.TAG,
      this.pickupView.id,
      context,
      params,
      { openMode: 'POPUPMODAL' },
    )) as IHttpResponse;
    if (result && result.ok && result.data) {
      return result.data;
    }
    ibiz.log.debug('模态取消或关闭异常', result);
    return undefined;
  }

  async openLinkView(data: IData): Promise<unknown> {
    const context = this.context.clone();
    if (data[this.valueItem]) {
      context.srfkey = data[this.valueItem];
    }
    const { context: newContext, params } = this.handlePublicParams(
      data,
      context,
      this.params,
    );
    const { linkAppViewId } = this.model;
    if (!linkAppViewId) {
      throw new RuntimeModelError(this.model, personSelectText('Configure a data link view', '请配置数据链接视图'));
    }
    return ibiz.commands.execute(
      OpenAppViewCommand.TAG,
      linkAppViewId,
      newContext,
      params,
    );
  }

  async calcFillDataItems(
    selectedData: IData[],
  ): Promise<Array<{ id: string; value: any }>> {
    if (!this.deACMode) return [];
    if (this.dataItems.length === 0) return [];
    return await Promise.all(
      this.dataItems.map(item => {
        const value = selectedData
          .map(data => data[item.appDEFieldId])
          .join(this.separator);
        return {
          id: item.id,
          value,
        };
      }),
    );
  }

  handleObjectParams(select: IData): IData {
    const result: IData = {};
    if (this.objectIdField) {
      Object.assign(result, {
        [this.objectIdField]: select[this.keyName],
      });
    }
    if (this.objectNameField) {
      Object.assign(result, {
        [this.objectNameField]: select[this.textName],
      });
    }
    if (this.objectValueField) {
      Object.assign(result, {
        [this.objectValueField]: clone(select),
      });
    }
    return result;
  }

  async getOperatorUserList(): Promise<void> {
    const app = await ibiz.hub.getApp(this.context.srfappid);
    const items = await app.codeList.get(
      this.sysOperatorCodeListTag,
      this.context,
      this.params,
    );
    this.operatorMap = new Map(
      (items as readonly any[]).map(item => [item.value, item]),
    );
  }

  isShowNameText(): boolean {
    return this.showNameText;
  }

  isShowNameTip(): boolean {
    return this.showNameTip;
  }

  getUserPictureUrl(value: string, text?: string): string {
    if (this.operatorMap.size <= 0) return '';
    let operator: IData = {};
    if (this.operatorMap.get(value)) {
      operator = this.operatorMap.get(value);
    } else {
      Array.from(this.operatorMap.entries()).find(entry => {
        const item = entry[1] || {};
        if (item.text && text && item.text === text) {
          operator = item;
          return true;
        }
        return false;
      });
    }
    return operator.data && operator.data.iconurl
      ? operator.data.iconurl
      : '';
  }
}
