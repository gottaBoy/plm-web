import {
  CodeListEditorController,
  getEditorProvider,
  getEntitySchema,
} from '@ibiz-template/runtime';
import type { IEditor } from '@ibiz/model-core';
import { TypeToEditor, TypeToOPs } from './utils';
import type { ISchemaField } from './interface';

export class FilterConditionController extends CodeListEditorController {
  jsonSchemaTag = '';
  schemaFields: ISchemaField[] = [];
  schemaFieldMap = new Map<string, ISchemaField>();
  borderMode: 'DEFAULT' | 'BORDER' = 'DEFAULT';

  protected async onInit(): Promise<void> {
    await super.onInit();
    this.jsonSchemaTag = this.editorParams?.JSONSCHEMATAG || '';
    this.borderMode = this.editorParams?.BORDERMODE === 'BORDER'
      ? 'BORDER'
      : 'DEFAULT';
    if (!this.jsonSchemaTag) return;

    const schema = await (getEntitySchema as unknown as (
      tag: string,
      context: IContext,
      params: IParams,
    ) => Promise<IData>)(this.jsonSchemaTag, this.context, { ...this.params });
    if (!schema) return;

    this.schemaFields = this.calcSchemaFieldBySchema(schema);
    this.schemaFields.forEach(field => {
      this.schemaFieldMap.set(field.appDEFieldId, field);
    });
  }

  calcSchemaFieldBySchema(jsonSchema: IData): ISchemaField[] {
    if (!jsonSchema.properties) return [];
    const properties = jsonSchema.properties as Record<string, IData>;
    if (!Object.keys(properties).length) return [];

    return Object.keys(properties).map(appDEFieldId => {
      const property = properties[appDEFieldId];
      let type = 'string';
      switch (property.type) {
        case 'string':
          if (property.format === 'date-time') type = 'date';
          if (property.enumSource) type = 'dropdown';
          break;
        case 'integer':
        case 'number':
          type = 'number';
          break;
        default:
          if (property.$ref) type = 'dataPicker';
          break;
      }
      return {
        type,
        appDEFieldId,
        valueOPs: TypeToOPs[type],
        caption: property.description,
        appDataEntityId: property.$ref?.split('.')[0],
        appCodeListId: property.enumSource,
      };
    });
  }

  getEditor(field: ISchemaField): IEditor {
    const editor = { ...TypeToEditor[field.type] } as IEditor;
    if (field.type === 'dropdown') {
      Object.assign(editor, { appCodeListId: field.appCodeListId });
    }
    if (field.type === 'dataPicker') {
      Object.assign(editor, { appDataEntityId: field.appDataEntityId });
    }
    return editor;
  }
}
