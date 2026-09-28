import {
  registerDEMethodProvider,
  type IAppDEService,
  type IDEMethodCreateOptions,
  type IDEMethodProvider,
  type Method,
} from '@ibiz-template/runtime';
import type { IAppDataEntity, IAppDEMethod } from '@ibiz/model-core';
import { ReviewContentSort } from './review-content-sort';

export class DeActionMethodPluginProvider implements IDEMethodProvider {
  create(
    service: IAppDEService,
    entity: IAppDataEntity,
    method: IAppDEMethod,
    options: IDEMethodCreateOptions,
  ): Method {
    return new ReviewContentSort(service, entity, method, options.localMode);
  }
}

export function registerReviewContentSortProvider(): void {
  registerDEMethodProvider(
    'DEMETHOD_REVIEW_CONTENT_SORT',
    () => new DeActionMethodPluginProvider(),
  );
}
