import { PanelItemController } from '@ibiz-template/runtime';
import { DataInfoTitleState } from './data-info-title.state';

export class DataInfoTitleController extends PanelItemController {
  declare state: DataInfoTitleState;

  protected async onInit(): Promise<void> {
    super.onInit();
    this.state.caption = this.panel.view.state.caption;
    this.panel.view.evt.on('onViewInfoChange', ({ dataInfo }) => {
      this.state.caption = `${this.panel.view.state.caption}${dataInfo ? `-${dataInfo}` : ''}`;
      (ibiz.util as IData).setBrowserTitle?.(this.state.caption);
    });
  }

  protected createState(): DataInfoTitleState {
    return new DataInfoTitleState(this.parent?.state);
  }
}
