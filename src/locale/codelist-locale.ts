import type { IAppService } from '@ibiz-template/runtime';
import type { IAppCodeList } from '@ibiz/model-core';
import { normalizePlmLanguage, translatePlmLabel } from './model-locale';

const installed = new WeakSet<object>();

/** Localize only model-defined main-state labels, not users or custom options. */
export function installPlmCodeListLocale(
  service: IAppService['codeList'],
  getLanguage: () => string,
): void {
  if (installed.has(service)) return;
  const models = new Map<string, IAppCodeList>();
  const setCodeList = service.setCodeList;
  const get = service.get;
  // eslint-disable-next-line no-param-reassign
  service.setCodeList = (model: IAppCodeList): void => {
    [model.id, model.codeName].forEach(tag => {
      if (tag) models.set(tag, model);
    });
    setCodeList.call(service, model);
  };
  // eslint-disable-next-line no-param-reassign
  service.get = async (
    ...args: Parameters<typeof get>
  ): Promise<Awaited<ReturnType<typeof get>>> => {
    const items = await get.apply(service, args);
    const model = models.get(args[0]);
    const language = getLanguage();
    if (
      normalizePlmLanguage(language) !== 'en' ||
      model?.codeListType !== 'DYNAMIC' ||
      model.predefinedType !== 'DEMAINSTATE' ||
      !model.codeItems?.length
    ) {
      return items;
    }
    return items.map(item => {
      const definition = model.codeItems!.find(
        entry =>
          entry.value === item.value &&
          typeof entry.text === 'string' &&
          typeof item.text === 'string' &&
          translatePlmLabel(entry.text, language) ===
            translatePlmLabel(item.text, language),
      );
      return definition
        ? { ...item, text: translatePlmLabel(item.text, language) }
        : item;
    });
  };
  installed.add(service);
}
