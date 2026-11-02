import { App } from 'vue';
import { provideGlobalConfig } from 'element-plus';
import elementEnglish from 'element-plus/dist/locale/en.mjs';
import elementChinese from 'element-plus/dist/locale/zh-cn.mjs';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { ViewEngineBase } from '@ibiz-template/runtime';
import { IBizViewShell } from './view-shell/view-shell';
import { IBizSpecialView } from './special-view/special-view';
import {
  PlmLanguageSwitch,
  registerLanguageSwitch,
} from './language-switch/language-switch';
import { normalizePlmLanguage } from '@/locale/model-locale';

export { IBizViewShell };

export default {
  install(v: App): void {
    const language = normalizePlmLanguage(ibiz.i18n.getLang());
    dayjs.locale(language === 'en' ? 'en' : 'zh-cn');
    provideGlobalConfig(
      {
        locale: language === 'en' ? elementEnglish : elementChinese,
      },
      v,
      true,
    );
    v.component(IBizViewShell.name!, IBizViewShell);
    v.component(IBizSpecialView.name!, IBizSpecialView);
    v.component(PlmLanguageSwitch.name!, PlmLanguageSwitch);
    registerLanguageSwitch();
    ibiz.engine.register(
      'VIEW_HtmlView',
      (view: unknown) => new ViewEngineBase(view as never),
    );
  },
};
