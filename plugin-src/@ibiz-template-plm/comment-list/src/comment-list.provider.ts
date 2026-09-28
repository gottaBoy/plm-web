import { CommentListComtroller } from './comment-list.controller';
import type {
  IEditorContainerController,
  IEditorProvider,
} from '@ibiz-template/runtime';
import type { IEditor } from '@ibiz/model-core';

class CommentListProvider implements IEditorProvider {
  component = 'CommentList';
  formEditor = 'CommentList';
  gridEditor = 'CommentList';
  async createController(
    editorModel: IEditor,
    parentController: IEditorContainerController,
  ): Promise<CommentListComtroller> {
    const e = new CommentListComtroller(editorModel, parentController);
    return await e.init(), e;
  }
}

export { CommentListProvider };
