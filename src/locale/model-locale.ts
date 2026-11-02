import english from './en.json';

export type PlmLanguage = 'zh-CN' | 'en';
const labels: Record<string, string> = english;
export const displayKeys = new Set([
  'caption',
  'text',
  'title',
  'emptyText',
  'tooltip',
  'placeHolder',
  'placeholder',
  'editorPlaceHolder',
  'excelCaption',
  'editItemCaption',
  'lnname',
  'nextCaption',
  'prevCaption',
  'finishCaption',
  'cancelCaption',
  'ruleInfo',
]);

export function normalizePlmLanguage(
  language: string | null | undefined,
): PlmLanguage {
  return /^en(?:[-_]|$)/i.test(language || '') ? 'en' : 'zh-CN';
}

export function translatePlmLabel(value: string, language: string): string {
  return normalizePlmLanguage(language) === 'en' &&
    Object.prototype.hasOwnProperty.call(labels, value)
    ? labels[value]
    : value;
}

/** Translate declared UI metadata, never identifiers, scripts or business records. */
export function localizePlmModel<T>(model: T, language: string): T {
  if (Array.isArray(model)) {
    return model.map(item => localizePlmModel(item, language)) as T;
  }
  if (!model || typeof model !== 'object') return model;
  const result: Record<string, unknown> = {};
  Object.entries(model).forEach(([key, value]) => {
    let translated = value;
    if (displayKeys.has(key) && typeof value === 'string') {
      translated = translatePlmLabel(value, language);
    } else if (key === 'appDEFields' && Array.isArray(value)) {
      translated = value.map(field => {
        const localized = localizePlmModel(field, language);
        if (field && typeof field.logicName === 'string') {
          localized.logicName = translatePlmLabel(field.logicName, language);
        }
        return localized;
      });
    } else if (typeof value === 'object') {
      translated = localizePlmModel(value, language);
    }
    Object.defineProperty(result, key, {
      value: translated,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  });
  return result as T;
}

export function languagePanelItem(login = false): IData {
  return {
    id: 'plm_language_switch',
    itemType: 'RAWITEM',
    itemStyle: 'DEFAULT',
    rawItem: {
      id: 'plm_language_switch',
      predefinedType: 'PLM_LANGUAGE_SWITCH',
    },
    layoutPos: {
      layout: 'FLEX',
      shrink: 0,
      height: 36,
      heightMode: 'PX',
      widthMode: 'FULL',
    },
    sysCss: { cssName: login ? 'plm-language-login' : 'plm-language-sidebar' },
  };
}

export function addPlmLanguageControl<
  T extends { codeName?: string; viewLayoutPanel?: IData },
>(model: T): T {
  const roots = model.viewLayoutPanel?.rootPanelItems;
  if (!Array.isArray(roots)) return model;
  const addAfter = (items: IData[], target: string): boolean => {
    if (items.some(item => item.id === 'plm_language_switch')) return true;
    const index = items.findIndex(item => item.id === target);
    if (index !== -1) {
      items.splice(
        index + 1,
        0,
        languagePanelItem(model.codeName === 'apploginview'),
      );
      return true;
    }
    return items.some(
      item =>
        Array.isArray(item.panelItems) && addAfter(item.panelItems, target),
    );
  };
  if (model.codeName === 'app_index_view') addAfter(roots, 'auth_userinfo');
  if (model.codeName === 'apploginview') addAfter(roots, 'container_4');
  return model;
}
