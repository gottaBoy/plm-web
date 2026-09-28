import { AutoRulesController } from './auto-rules.controller';
import type {
  IEditorContainerController,
  IEditorProvider,
} from '@ibiz-template/runtime';
import type { IEditor } from '@ibiz/model-core';

class AutoRulesProvider implements IEditorProvider {
  formEditor = 'AutoRules';
  gridEditor = 'AutoRules';
  async createController(
    editorModel: IEditor,
    parentController: IEditorContainerController,
  ): Promise<AutoRulesController> {
    const controller = new AutoRulesController(editorModel, parentController);
    await controller.init();
    return controller;
  }
}

export { AutoRulesProvider };
