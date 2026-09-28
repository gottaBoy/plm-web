import {
  registerEditorProvider,
  type IEditorContainerController,
  type IEditorProvider,
} from '@ibiz-template/runtime';
import type { ITextBox as ITextBoxModel } from '@ibiz/model-core';
import { FilterConditionController } from './filter-condition.controller';

export class FilterConditionProvider implements IEditorProvider {
  formEditor = 'IBizFilterCondition';
  gridEditor = 'IBizFilterCondition';

  async createController(
    editorModel: ITextBoxModel,
    parentController: IEditorContainerController,
  ): Promise<FilterConditionController> {
    const controller = new FilterConditionController(editorModel, parentController);
    await controller.init();
    return controller;
  }
}

export function registerFilterConditionProvider(): void {
  registerEditorProvider(
    'EDITOR_CUSTOMSTYLE_FILTER_CONDITION',
    () => new FilterConditionProvider(),
  );
}
