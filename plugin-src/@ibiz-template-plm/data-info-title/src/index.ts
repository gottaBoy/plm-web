import './style.css';
import { registerPanelItemProvider } from '@ibiz-template/runtime';
import { withInstall } from '@ibiz-template/vue3-util';
import { DataInfoTitle } from './data-info-title';
import { DataInfoTitleProvider } from './data-info-title.provider';

export const IBizDataInfoTitle = withInstall(DataInfoTitle, app => {
  app.component(DataInfoTitle.name!, DataInfoTitle);
  registerPanelItemProvider(
    'CUSTOM_DATA_INFO_TITLE',
    () => new DataInfoTitleProvider(),
  );
});

export default IBizDataInfoTitle;
