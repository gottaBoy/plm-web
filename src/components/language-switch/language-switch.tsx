import { defineComponent, computed, PropType, VNode } from 'vue';
import { IPanelItem } from '@ibiz/model-core';
import {
  PanelController,
  PanelItemController,
  registerPanelItemProvider,
} from '@ibiz-template/runtime';
import { normalizePlmLanguage } from '@/locale/model-locale';
import './language-switch.css';

export const PlmLanguageSwitch = defineComponent({
  name: 'PlmLanguageSwitch',
  props: {
    controller: {
      type: Object as PropType<PanelItemController>,
      required: true,
    },
  },
  setup(props) {
    const language = normalizePlmLanguage(ibiz.i18n.getLang());
    const collapsed = computed(() => {
      const { state } = props.controller.panel.view;
      return 'isCollapse' in state && state.isCollapse === true;
    });
    const change = (value: string): void => {
      if ((value === 'zh-CN' || value === 'en') && value !== language) {
        ibiz.i18n.setLang(value);
      }
    };
    return { language, collapsed, change };
  },
  render() {
    return (
      <div
        class={[
          'plm-language-switch',
          ...this.controller.containerClass,
          { 'is-collapsed': this.collapsed },
        ]}
      >
        <el-dropdown
          trigger='click'
          placement={
            this.controller.containerClass.includes('plm-language-login')
              ? 'bottom-end'
              : 'bottom-start'
          }
          popperClass='plm-language-menu'
          onCommand={this.change}
        >
          {{
            default: (): VNode => (
              <button
                type='button'
                class='plm-language-switch__button'
                aria-label='Language / 语言'
                title='Language / 语言'
              >
                <ion-icon name='globe-outline' aria-hidden='true' />
                {!this.collapsed && (
                  <span class='plm-language-switch__label'>
                    {this.language === 'en' ? 'English' : '中文'}
                  </span>
                )}
                <ion-icon
                  class='plm-language-switch__chevron'
                  name='chevron-down-outline'
                  aria-hidden='true'
                />
              </button>
            ),
            dropdown: (): VNode => (
              <el-dropdown-menu>
                <el-dropdown-item
                  command='zh-CN'
                  class={{ 'is-current': this.language === 'zh-CN' }}
                  aria-current={this.language === 'zh-CN' ? 'true' : undefined}
                >
                  <span lang='zh-CN'>中文</span>
                  <ion-icon name='checkmark-outline' aria-hidden='true' />
                </el-dropdown-item>
                <el-dropdown-item
                  command='en'
                  class={{ 'is-current': this.language === 'en' }}
                  aria-current={this.language === 'en' ? 'true' : undefined}
                >
                  <span lang='en'>English</span>
                  <ion-icon name='checkmark-outline' aria-hidden='true' />
                </el-dropdown-item>
              </el-dropdown-menu>
            ),
          }}
        </el-dropdown>
      </div>
    );
  },
});

export function registerLanguageSwitch(): void {
  registerPanelItemProvider('RAWITEM_PLM_LANGUAGE_SWITCH', () => ({
    component: PlmLanguageSwitch.name!,
    async createController(
      model: IPanelItem,
      panel: PanelController,
      parent?: PanelItemController,
    ): Promise<PanelItemController> {
      const controller = new PanelItemController(model, panel, parent);
      await controller.init();
      return controller;
    },
  }));
}
