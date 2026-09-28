import { AttentionController } from './attention-controller';
import type {
  IEditorContainerController,
  IEditorProvider,
} from '@ibiz-template/runtime';
import type { IPicker } from '@ibiz/model-core';

class AttentionProvider implements IEditorProvider {
  component = 'IBizAttention';
  formEditor = 'IBizAttention';
  gridEditor = 'IBizAttention';
  async createController(
    editorModel: IPicker,
    parentController: IEditorContainerController,
  ): Promise<AttentionController> {
    const i = new AttentionController(editorModel, parentController);
    await i.init();
    return i;
  }
}

export { AttentionProvider };
