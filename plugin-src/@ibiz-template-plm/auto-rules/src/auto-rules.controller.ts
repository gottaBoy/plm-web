import { CodeListEditorController } from '@ibiz-template/runtime';

import { RuntimeModelError } from '@ibiz-template/core';
import type { CodeListItem } from '@ibiz-template/runtime';

class AutoRulesController extends CodeListEditorController {
  /**
   * [属性确定,文本项,允许空] 自定义仿真数据
   *
   * @static
   * @memberof AutoRulesController
   */
  allowEmptyText = [
    { text: '从任何到任何', value: JSON.stringify(['', '']) },
    {
      text: '从有值到空值',
      value: JSON.stringify(['', null]),
    },
    {
      text: '从空值到有值',
      value: JSON.stringify([null, '']),
    },
  ];
  async onInit() {
    super.onInit();
  }
  // 加载自定义配置的下拉代码表
  async loadCustomCodeList(
    tag: string | undefined,
    data: IData,
  ): Promise<readonly CodeListItem[]> {
    const { context: p, params: S } = this.handlePublicParams(
      data,
      this.context,
      this.params,
    );
    if (tag) {
      const g = await ibiz.hub.getApp(this.context.srfappid);
      return g.codeList.get(`${g.model.id}.${tag}`, p, S);
    }
    throw new RuntimeModelError(
      this.model,
      ibiz.i18n.t('runtime.controller.common.editor.editorNoConfigured', {
        editorType: this.model.editorType,
      }),
    );
  }
}

export { AutoRulesController };
