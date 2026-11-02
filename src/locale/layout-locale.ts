import type { IAppView } from '@ibiz/model-core';
import { localizePlmModel, normalizePlmLanguage } from './model-locale';

const installed = new WeakSet<object>();

/** Default layouts are filled after the application model loader has run. */
export function installPlmLayoutLocale(
  layoutPanel: { fill: (model: IAppView) => IAppView },
  getAppId: () => string,
  getLanguage: () => string,
): void {
  if (installed.has(layoutPanel)) return;
  const originalFill = layoutPanel.fill;
  // eslint-disable-next-line no-param-reassign
  layoutPanel.fill = (model: IAppView): IAppView => {
    const filled = originalFill.call(layoutPanel, model);
    const language = getLanguage();
    const appId = getAppId();
    if (
      !appId ||
      filled.appId !== appId ||
      normalizePlmLanguage(language) !== 'en' ||
      !filled.viewLayoutPanel
    ) {
      return filled;
    }
    return {
      ...filled,
      viewLayoutPanel: localizePlmModel(filled.viewLayoutPanel, language),
    };
  };
  installed.add(layoutPanel);
}
