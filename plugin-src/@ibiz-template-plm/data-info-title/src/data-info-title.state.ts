import { PanelItemState, type IPanelItemState } from '@ibiz-template/runtime';

export interface IDataInfoTitleState extends IPanelItemState {
  caption: string;
}

export class DataInfoTitleState extends PanelItemState {
  caption = '';
}
