import type { IEditorController, IEditorProvider, ValueOP } from '@ibiz-template/runtime';
import type { IEditor } from '@ibiz/model-core';

export interface ISchemaField {
  type: string;
  appDEFieldId: string;
  valueOPs: ValueOP[];
  caption: string;
  appCodeListId?: string;
  appDataEntityId?: string;
}

export interface IFilterCondition {
  key: string;
  connection: string;
  field: string;
  valueOP: string;
  value?: unknown;
  editor?: IEditorController<IEditor>;
  editorProvider?: IEditorProvider;
}
