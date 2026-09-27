import type { IEditorContainerController, IEditorProvider } from '@ibiz-template/runtime';
import type { IPicker } from '@ibiz/model-core';
import { PersonelSelectController } from './personel-select-controller';

export class PersonelSelectProvider implements IEditorProvider {
  component = 'PersonelSelect';

  formEditor = 'PersonelSelect';

  gridEditor = 'PersonelSelect';

  async createController(
    editorModel: IPicker,
    parentController: IEditorContainerController,
  ): Promise<PersonelSelectController> {
    const controller = new PersonelSelectController(
      editorModel,
      parentController,
    );
    await controller.init();
    return controller;
  }
}
