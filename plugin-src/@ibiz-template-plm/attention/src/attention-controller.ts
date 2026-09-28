import {
  EditorController,
  getDeACMode,
  UIActionUtil,
  OpenAppViewCommand,
} from '@ibiz-template/runtime';
import type {
  IAppDEACMode,
  IDEACModeDataItem,
  IPicker,
  IUIActionGroupDetail,
} from '@ibiz/model-core';

import { RuntimeModelError } from '@ibiz-template/core';

import { mergeDeepLeft, clone } from 'ramda';

import { notNilEmpty } from 'qx-util';
import type { IHttpResponse, IViewConfig } from './types';

class AttentionController extends EditorController<IPicker> {
  declare model: IPicker;
  /**
   * 云系统操作者Map
   *
   * @memberof AttentionController
   */
  operatorMap: Map<any, IData> = new Map();
  /**
   * 当前操作者数据
   */
  currentOperator?: IData;
  /**
   * 总数
   */
  total = 0;
  /**
   * 当前人员数量
   */
  currentNumber = -1;
  /**
   * 人员当前页
   */
  page = 0;
  /**
   * 部门人员数据页数
   */
  deptpage = 0;
  /**
   * 当前部门人员数量
   */
  deptcurrentNumber = -1;
  /**
   * 部门人员总数
   */
  depttotal = 0;
  /**
   * 每页数量
   */
  size = 20;
  /**
   * 是否多选
   */
  multiple = true;
  /**
   * 多选时拼接的字符串
   */
  separator = ',';
  /**
   *选择视图相关参数
   */
  pickupView: IViewConfig | null = null;
  /**
   *链接视图相关参数
   */
  linkView: IViewConfig | null = null;
  /**
   * 人员UI转化
   */
  userFilterMap: IData = {
    id: 'id',
    name: 'name',
    title: 'title',
    avatar: '',
  };
  /**
   * 部门人员UI转化
   */
  deptFilterMap: IData = {
    id: 'id',
    name: 'name',
    title: 'title',
    avatar: '',
  };
  /**
   *值项
   */
  valueItem = '';
  /**
   * 主键属性名称
   */
  keyName = 'srfkey';
  /**
   * 主文本属性名称
   */
  textName = 'srfmajortext';
  /**
   * 数据集codeName
   */
  interfaceName = '';
  /**
   * 自填模式sort排序
   */
  sort = '';
  /**
   * 不支持AC（根据编辑器类型得）
   */
  noAC = false;
  /**
   * 不支持按钮（根据编辑器类型得）
   */
  noButton = false;
  /**
   * 实体自填模式模型
   */
  deACMode?: IAppDEACMode;
  /**
   * 自填数据项集合（已排除了value和text)
   */
  dataItems: IDEACModeDataItem[] = [];
  // 对象标识属性
  objectIdField = '';
  // 对象名称属性
  objectNameField = '';
  // 对象值属性
  objectValueField = '';
  // 人员请求地址
  userUrl = '';
  // 部门请求地址
  deptUrl = '';
  // 复制人员请求url,这是用来保证当配置的URL中的动态参数变化后可以刷新当前请求状态
  copyUserUrl = '';
  // 复制部门人员请求url
  copyDeptUrl = '';
  // 人员请求方式
  userMethod = 'post';
  // 部门人员请求方式
  deptMethod = 'post';
  /**
   * 上下文替换正则
   *
   */
  contextReg = /\$\{context.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g;
  /**
   * 数据替换正则
   *
   */
  dataReg = /\$\{data.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g;
  /**
   * 参数替换正则
   *
   */
  paramsReg = /\$\{params.[a-zA-Z_$][a-zA-Z0-9_$]{1,}\}/g;
  /**
   * 值类型
   */
  valueType = 'OBJECTS';
  /**
   * 代码表的代码标识
   *
   */
  codeListId = '';
  /**
   * 代码表值映射
   *
   */
  codeListMap?: Record<string, any[]>;
  /**
   * 关注类型属性
   *
   */
  attentionTypeField = 'type';
  /**
   * 自填充映射
   */
  selfFillMap = {
    user_id: 'user_id',
    user_name: 'name',
    user_title: 'title',
  };
  /**
   * 默认选中项
   *
   */
  defaultSelected = '';
  /**
   * 选中后默认关注值
   *
   */
  defaultAttentionValue = '';
  /**
   * 启用确认按钮
   */
  enableBottomButton = false;
  /**
   * 额外抛值字段映射
   */
  fieldMap = '';
  /**
   * 人员头像文件权限归属实体
   */
  userAuthEntity = '';
  /**
   * 部门头像文件权限归属实体
   */
  deptAuthEntity = '';
  async onInit() {
    var i, e, d, c, f, v, E;
    if (
      (super.onInit(),
      this.initParams(),
      await this.getOperatorUserList(),
      (this.valueItem =
        ((i = this.model.valueItemName) == null ? void 0 : i.toLowerCase()) ||
        ''),
      this.model.appDataEntityId &&
        (this.model.appDEDataSetId &&
          (this.interfaceName = this.model.appDEDataSetId),
        this.model.appDEACModeId &&
          ((this.deACMode = await getDeACMode(
            this.model.appDEACModeId,
            this.model.appDataEntityId,
            this.context.srfappid,
          )),
          this.deACMode)))
    ) {
      const { minorSortAppDEFieldId: F, minorSortDir: w } = this.deACMode;
      F &&
        w &&
        (this.sort = ''.concat(F.toLowerCase(), ',').concat(w.toLowerCase())),
        this.deACMode.textAppDEFieldId &&
          (this.textName = this.deACMode.textAppDEFieldId),
        this.deACMode.valueAppDEFieldId &&
          (this.keyName = this.deACMode.valueAppDEFieldId),
        this.deACMode.deacmodeDataItems &&
          ((this.dataItems = []),
          this.deACMode.deacmodeDataItems.forEach(C => {
            C.id !== 'value' && C.id !== 'text' && this.dataItems.push(C);
          }));
    }
    const r = [
      'PICKEREX_DROPDOWNVIEW',
      'PICKEREX_DROPDOWNVIEW_LINK',
      'PICKUPVIEW',
    ];
    this.model.editorType &&
      r.includes(this.model.editorType) &&
      this.initPickupViewParams(),
      (this.objectIdField =
        (d = (e = this.model) == null ? void 0 : e.objectIdField) == null
          ? ''
          : d.toLowerCase()),
      (this.objectNameField =
        (f = (c = this.model) == null ? void 0 : c.objectNameField) == null
          ? ''
          : f.toLowerCase()),
      (this.objectValueField =
        (E = (v = this.model) == null ? void 0 : v.objectValueField) == null
          ? ''
          : E.toLowerCase());
  }
  /**
   * 初始化noAc和noButton
   */
  initParams() {
    var r, i, e, d, c, f, v, E, F, w, C, g;
    switch (this.model.editorType) {
      case 'PICKEREX_NOAC':
      case 'PICKEREX_NOAC_LINK':
        this.noAC = true;
        break;
      case 'PICKEREX_NOBUTTON':
        this.noButton = true;
        break;
      default:
        (this.noButton = false), (this.noAC = false);
    }
    if (
      ((this.userUrl = this.editorParams.URL),
      (this.deptUrl = this.editorParams.DEPTURL),
      (this.userMethod = this.editorParams.USERMETHOD || 'post'),
      (this.deptMethod = this.editorParams.DEPTMETHOD || 'post'),
      (this.separator = this.editorParams.SEPARATOR || ','),
      (r = this.editorParams) != null &&
        r.CODELISTID &&
        (this.codeListId =
          (i = this.editorParams) == null ? void 0 : i.CODELISTID),
      (e = this.editorParams) != null &&
        e.DEFAULTATNVALUE &&
        (this.defaultAttentionValue =
          (d = this.editorParams) == null ? void 0 : d.DEFAULTATNVALUE),
      (c = this.editorParams) != null &&
        c.VALUETYPE &&
        (this.valueType =
          (f = this.editorParams) == null ? void 0 : f.VALUETYPE),
      (v = this.editorParams) != null &&
        v.ENABLEBOTTOMBUTTON &&
        (this.enableBottomButton =
          ((E = this.editorParams) == null ? void 0 : E.ENABLEBOTTOMBUTTON) ===
          'true'),
      (F = this.editorParams) != null &&
        F.FIELDMAP &&
        (this.fieldMap = (w = this.editorParams) == null ? void 0 : w.FIELDMAP),
      this.editorParams.userauthentity &&
        (this.userAuthEntity = this.editorParams.userauthentity),
      this.editorParams.deptauthentity &&
        (this.deptAuthEntity = this.editorParams.deptauthentity),
      this.editorParams &&
        Object.prototype.hasOwnProperty.call(this.editorParams, 'CODELISTMAP'))
    )
      try {
        const p = JSON.parse(
          (C = this.editorParams) == null ? void 0 : C.CODELISTMAP,
        );
        Object.assign(this.codeListMap, p);
      } catch (p) {
        this.codeListMap = { FOLLOWED: [20, 30, 40], NOTFOLLOWING: [10] };
      }
    if (
      this.editorParams &&
      Object.prototype.hasOwnProperty.call(this.editorParams, 'SELFFILLMAP')
    )
      try {
        const p = JSON.parse(
          (g = this.editorParams) == null ? void 0 : g.SELFFILLMAP,
        );
        Object.assign(this.selfFillMap, p);
      } catch (p) {
        this.selfFillMap = {
          user_id: 'user_id',
          user_name: 'name',
          user_title: 'title',
        };
      }
    if (
      this.editorParams &&
      Object.prototype.hasOwnProperty.call(this.editorParams, 'USERMAP')
    )
      try {
        const p = JSON.parse(this.editorParams.USERMAP);
        Object.assign(this.userFilterMap, p);
      } catch (p) {
        this.userFilterMap = {
          id: 'id',
          name: 'name',
          title: 'title',
          avatar: '',
        };
      }
    if (
      this.editorParams &&
      Object.prototype.hasOwnProperty.call(this.editorParams, 'DEPTMAP')
    )
      try {
        const p = JSON.parse(this.editorParams.DEPTMAP);
        Object.assign(this.deptFilterMap, p);
      } catch (p) {
        this.deptFilterMap = {
          id: 'id',
          name: 'name',
          title: 'title',
          avatar: '',
        };
      }
  }
  /**
   * 初始化选择视图相关参数
   */
  async initPickupViewParams() {
    this.model.pickupAppViewId &&
      (this.pickupView = await ibiz.hub.config.view.get(
        this.model.pickupAppViewId,
      ));
  }
  /**
   * 初始化链接视图相关参数
   */
  async initLinkViewParams() {
    this.model.linkAppViewId &&
      (this.linkView = await ibiz.hub.config.view.get(
        this.model.linkAppViewId,
      ));
  }
  /**
   * 初始化当前操作者数据
   */
  async initCurrentOperator(data: IData, query: IData = {}) {
    const e = this.context.srfuserid;
    if (!e) return;
    const d = await this.getServiceData(
      'department',
      data,
      {},
      {
        ...query,
        page: 0,
        size: 20,
        n_id_eq: e,
      },
    );
    d &&
      d.data &&
      d.data.length > 0 &&
      (this.currentOperator = d.data.find(
        (c: IData) => c[this.deptFilterMap.id] === e,
      ));
  }
  /**
   * 重置状态
   */
  resetState() {
    (this.total = 0),
      (this.currentNumber = -1),
      (this.page = 0),
      (this.deptpage = 0),
      (this.depttotal = 0),
      (this.deptcurrentNumber = -1),
      (this.copyDeptUrl = ''),
      (this.copyUserUrl = '');
  }
  /**
   * 加载更多
   */
  async loadMore(
    data: IData,
    tag: string,
    params: IData = {},
  ): Promise<IHttpResponse<IData[]> | undefined> {
    if (tag === 'user' && this.currentNumber < this.total) {
      const d = await this.getServiceData(tag, data, params);
      if (d)
        return (
          (this.page += 1),
          this.currentNumber < 0 && (this.currentNumber += 1),
          (this.currentNumber += this.size),
          (this.total = d.total
            ? Number(d.total)
            : Number(d.headers['x-total'])),
          d.data.forEach((c: IData) => {
            Object.keys(this.userFilterMap).forEach(f => {
              c[f] = c[this.userFilterMap[f]];
            });
          }),
          d
        );
    } else if (
      tag === 'department' &&
      this.deptcurrentNumber < this.depttotal
    ) {
      const d = await this.getServiceData(tag, data, params);
      if (d)
        return (
          (this.deptpage += 1),
          this.deptcurrentNumber < 0 && (this.deptcurrentNumber += 1),
          (this.deptcurrentNumber += this.size),
          (this.depttotal = d.total
            ? Number(d.total)
            : Number(d.headers['x-total'])),
          d.data.forEach((c: IData) => {
            Object.keys(this.deptFilterMap).forEach(f => {
              c[f] = c[this.deptFilterMap[f]];
            });
          }),
          d
        );
    }
  }
  /**
   * 触发界面行为组点击事件
   *
   * @param {IUIActionGroupDetail} detail
   * @param {GridRowState} row
   * @param {MouseEvent} event
   * @return {*}  {Promise<void>}
   * @memberof GridFieldColumnController
   */
  async onActionClick(
    detail: IUIActionGroupDetail,
    data: IData,
    event: Event,
  ) {
    const d = detail.uiactionId;
    await UIActionUtil.execAndResolved(
      d,
      {
        context: this.context,
        params: this.params,
        data: data,
        view: (this.parent as IData).form?.ctx?.view,
        event: event,
      },
      detail.appId,
    );
  }
  /**
   * 填充字符串中的数据
   *
   * @author chitanda
   * @date 2021-04-23 20:04:17
   * @static
   * @param {string} str
   * @param {*} [context]
   * @param {*} [data]
   * @return {*}  {string}
   */
  fill(
    template: string,
    context: IData = {},
    params: IData = {},
    data: IData = {},
  ): string {
    if (notNilEmpty(template)) {
      if (notNilEmpty(context)) {
        const c = template.match(this.contextReg);
        c == null ||
          c.forEach(f => {
            const v = f.slice(10, f.length - 1);
            template = template.replace(
              '${context.'.concat(v, '}'),
              context[v] || '',
            );
          });
      }
      if (notNilEmpty(params)) {
        const c = template.match(this.paramsReg);
        c == null ||
          c.forEach(f => {
            const v = f.slice(9, f.length - 1);
            template = template.replace(
              '${params.'.concat(v, '}'),
              params[v] || '',
            );
          });
      }
      if (notNilEmpty(data)) {
        const c = template.match(this.dataReg);
        c == null ||
          c.forEach(f => {
            const v = f.slice(7, f.length - 1);
            template = template.replace(
              '${data.'.concat(v, '}'),
              data[v] || '',
            );
          });
      }
    }
    return template;
  }
  /**
   * 加载实体数据集数据
   *
   * @param {string} tag 当前分类 user || department
   * @param {IData} data 表单数据
   * @param {string} query 模糊匹配字符串
   * @returns {*}  {Promise<IHttpResponse<IData[]>>}
   * @memberof PersonelSelectController
   */
  async getServiceData(
    tag: string,
    data: IData,
    query: IData = {},
    customParams?: IData,
  ): Promise<IHttpResponse<IData[]> | undefined> {
    const { context: c, params: f } = this.handlePublicParams(
        data,
        this.context,
        this.params,
      ),
      v = {};
    this.sort &&
      !Object.is(this.sort, '') &&
      Object.assign(v, { sort: this.sort }),
      Object.assign(v, { size: this.size }),
      query && Object.assign(v, query);
    const E = customParams || mergeDeepLeft(f, v);
    let F = '';
    const w = this.fill(this.userUrl, c, f, data).replaceAll('//', '/'),
      C = this.fill(this.deptUrl, c, f, data).replaceAll('//', '/');
    (this.copyUserUrl = w), (this.copyDeptUrl = C);
    let g = 'post';
    const p = {};
    if (
      (tag === 'user'
        ? ((F = w),
          (g = this.userMethod.toLowerCase()),
          Object.assign(p, { method: g, data: E }))
        : ((F = C),
          (g = this.deptMethod.toLowerCase()),
          Object.assign(p, { method: g, params: E })),
      F)
    )
      return await ibiz.net.request(F, p);
    throw new RuntimeModelError(this.model, '请配置数据接口地址');
  }
  /**
   * 打开数据选择视图
   *
   * @param {IData} data 数据对象
   * @param {IData[]} selectedData 选中项集合
   * @returns {*}  {(Promise<IData[] | undefined>)}
   * @memberof PersonelSelectController
   */
  async openPickUpView(data: IData, selectedData?: IData[]) {
    await this.initPickupViewParams();
    const { context: e, params: d } = this.handlePublicParams(
      data,
      this.context,
      this.params,
    );
    if ((selectedData && (d.selectedData = selectedData), !this.pickupView))
      throw new RuntimeModelError(this.model, '请配置数据选择视图');
    const c = (await ibiz.commands.execute(
      OpenAppViewCommand.TAG,
      this.pickupView.id,
      e,
      d,
      { openMode: 'POPUPMODAL' },
    )) as IData;
    if (c && c.ok && c.data) return c.data;
    ibiz.log.debug('模态取消或关闭异常', c);
  }
  /**
   * 打开数据链接视图
   */
  async openLinkView(data: IData) {
    const i = this.context.clone();
    data[this.valueItem] && (i.srfkey = data[this.valueItem]);
    const { context: e, params: d } = this.handlePublicParams(
        data,
        i,
        this.params,
      ),
      { linkAppViewId: c } = this.model;
    if (!c) throw new RuntimeModelError(this.model, '请配置数据链接视图');
    return ibiz.commands.execute(OpenAppViewCommand.TAG, c, e, d);
  }
  /**
   * 计算回填数据
   *
   * @author lxm
   * @date 2022-10-24 16:10:24
   * @param {IData} data 选中数据
   * @returns {*}  {Promise<Array<{ id: string; value: any }>>}
   */
  async calcFillDataItems(data: IData[]) {
    return this.deACMode
      ? this.dataItems.length === 0
        ? []
        : await Promise.all(
            this.dataItems.map((e: IDEACModeDataItem) => {
              const c = data
                .map(f => f[e.appDEFieldId as string])
                .join(this.separator);
              return (
                e.format ||
                  (e.convertToCodeItemText && e.codeListId) ||
                  e.customCode,
                { id: e.id, value: c }
              );
            }),
          )
      : [];
  }
  /**
   * 处理对象数据类型抛值
   * @param {IData} select
   * @return {*}
   * @author: zhujiamin
   * @Date: 2023-08-22 15:58:56
   */
  handleObjectParams(selected: IData) {
    const i: IData = {};
    return (
      this.objectIdField &&
        Object.assign(i, {
          [this.objectIdField]: selected[this.keyName],
        }),
      this.objectNameField &&
        Object.assign(i, {
          [this.objectNameField]: selected[this.textName],
        }),
      this.objectValueField &&
        Object.assign(i, {
          [this.objectValueField]: clone(selected),
        }),
      i
    );
  }
  /**
   * 获取操作用户列表
   *
   * @return {*}  {Promise<void>}
   * @memberof AttentionController
   */
  async getOperatorUserList() {
    const r = await ibiz.hub.getApp(this.context.srfappid);
    let i: readonly IData[] = [];
    (i = await r.codeList.get('SysOperator', this.context, this.params)),
      (this.operatorMap = new Map(i.map(e => [e.value, e])));
  }
  /**
   * 动态匹配${}
   *
   * @param {string} str
   * @param {Record<string, IData>} values
   * @return {*}  {string}
   */
  dynamicMatch(template: string, values: Record<string, IData>) {
    return template.replace(/\${(.*?)}/g, (_e: string, d: string) => {
      const [c, f] = d.split('.'),
        v = values[c];
      return (v && v[f]) || '';
    });
  }
  /**
   * 获取人员头像路径
   *
   * @return {*}  {string}
   * @memberof AttentionController
   */
  getUserPictureUrl(userId: string, userName?: string) {
    if (this.operatorMap.size <= 0) return '';
    let e: IData = {};
    return (
        this.operatorMap.get(userId)
        ? (e = this.operatorMap.get(userId) || {})
        : Array.from(this.operatorMap.entries()).find((d: [any, IData]) => {
            const c: IData = d[1] || {};
            return c.text && userName && c.text === userName
              ? ((e = c), true)
              : false;
          }),
      e.data && e.data.iconurl ? e.data.iconurl : ''
    );
  }
}

export { AttentionController };
