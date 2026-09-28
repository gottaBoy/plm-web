import type { HttpResponse } from '@ibiz-template/core';
import { FetchMethod, type IDataEntity } from '@ibiz-template/runtime';

export class ReviewContentSort extends FetchMethod {
  async exec(
    context: IContext,
    params?: IData | IData[],
    params2?: IParams,
    header?: IData,
  ): Promise<HttpResponse<IDataEntity[]>> {
    const response = await super.exec(context, params, params2, header);
    response.data.sort((left, right) =>
      left.test_case && right.test_case
        ? left.test_case.identifier.localeCompare(right.test_case.identifier)
        : -1,
    );
    return response;
  }
}
