import type { IDatePicker, IDropDownList, IEditor, IPicker } from '@ibiz/model-core';
import { ValueOP } from '@ibiz-template/runtime';

export const TypeToOPs: Record<string, ValueOP[]> = {
  string: [
    ValueOP.EQ, ValueOP.NOT_EQ, ValueOP.IS_NULL, ValueOP.IS_NOT_NULL,
    ValueOP.USER_LIKE, ValueOP.LIKE, ValueOP.LIFT_LIKE, ValueOP.RIGHT_LIKE,
  ],
  number: [
    ValueOP.EQ, ValueOP.GT, ValueOP.GT_AND_EQ, ValueOP.LT, ValueOP.LT_AND_EQ,
    ValueOP.NOT_EQ, ValueOP.IS_NULL, ValueOP.IS_NOT_NULL, ValueOP.IN, ValueOP.NOT_IN,
  ],
  date: [
    ValueOP.EQ, ValueOP.GT, ValueOP.GT_AND_EQ, ValueOP.LT, ValueOP.LT_AND_EQ,
    ValueOP.NOT_EQ, ValueOP.IS_NULL, ValueOP.IS_NOT_NULL, ValueOP.IN, ValueOP.NOT_IN,
  ],
  dropdown: [
    ValueOP.EQ, ValueOP.NOT_EQ, ValueOP.IS_NULL, ValueOP.IS_NOT_NULL,
    ValueOP.IN, ValueOP.NOT_IN,
  ],
  dataPicker: [
    ValueOP.EQ, ValueOP.NOT_EQ, ValueOP.IS_NULL, ValueOP.IS_NOT_NULL,
    ValueOP.IN, ValueOP.NOT_IN,
  ],
};

export const ExcludeOPs = [
  ValueOP.IS_NULL,
  ValueOP.IS_NOT_NULL,
  ValueOP.EXISTS,
  ValueOP.NOT_EXISTS,
];

export const TypeToEditor: Record<string, IEditor | IDropDownList | IPicker | IDatePicker> = {
  string: { appId: '', editorType: 'TEXTBOX' },
  number: { appId: '', editorType: 'NUMBER' },
  date: { appId: '', editorType: 'DATEPICKEREX', dateTimeFormat: 'YYYY-MM-DD' },
  dropdown: {
    appId: '', valueType: 'SIMPLE', editorType: 'MDROPDOWNLIST', appCodeListId: '',
    editorParams: { overflowMode: 'ellipsis' },
  },
  dataPicker: {
    appId: '', editorType: 'ADDRESSPICKUP', appDEDataSetId: 'fetchdefault',
    objectIdField: 'srfkey', objectNameField: 'srfmajortext', valueType: 'OBJECTS',
    editorParams: { overflowMode: 'ellipsis' },
  },
};

export const FilterModes = [
  { valueOP: ValueOP.EQ, label: '等于(=)' },
  { valueOP: ValueOP.NOT_EQ, label: '不等于(<>)' },
  { valueOP: ValueOP.GT, label: '大于(>)' },
  { valueOP: ValueOP.GT_AND_EQ, label: '大于等于(>=)' },
  { valueOP: ValueOP.LT, label: '小于(<)' },
  { valueOP: ValueOP.LT_AND_EQ, label: '小于等于(<=)' },
  { valueOP: ValueOP.IS_NULL, label: '值为空(Nil)' },
  { valueOP: ValueOP.IS_NOT_NULL, label: '值不为空(NotNil)' },
  { valueOP: ValueOP.IN, label: '值在范围中(In)' },
  { valueOP: ValueOP.NOT_IN, label: '值不在范围中(NotIn)' },
  { valueOP: ValueOP.LIKE, label: '文本包含(%)' },
  { valueOP: ValueOP.LIFT_LIKE, label: '文本左包含(%#)' },
  { valueOP: ValueOP.RIGHT_LIKE, label: '文本右包含(#%)' },
  { valueOP: ValueOP.EXISTS, label: '存在(EXISTS)' },
  { valueOP: ValueOP.NOT_EXISTS, label: '不存在(NOTEXISTS)' },
];
