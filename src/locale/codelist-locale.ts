import type { IAppService } from '@ibiz-template/runtime';
import type { IAppCodeList } from '@ibiz/model-core';
import { normalizePlmLanguage, translatePlmLabel } from './model-locale';

const installed = new WeakSet<object>();

/** Localize exact model-defined dynamic options, never people or custom labels. */
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
        ? Object.create(Object.getPrototypeOf(item), {
            ...Object.getOwnPropertyDescriptors(item),
            text: {
              value: translatePlmLabel(item.text, language),
              enumerable: true,
              configurable: true,
              writable: true,
            },
          })
        : item;
    });
  };
  installed.add(service);
}
