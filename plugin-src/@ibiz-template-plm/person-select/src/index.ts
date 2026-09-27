import type { App } from 'vue';
import { registerEditorProvider } from '@ibiz-template/runtime';
import { withInstall } from '@ibiz-template/vue3-util';
import { PersonelSelect } from './personel-select';
import { PersonelSelectProvider } from './provider';
import './assets/styles/style.css';

export const IBizPersonelSelect = withInstall(PersonelSelect, (app: App) => {
  app.component(PersonelSelect.name, PersonelSelect);
  registerEditorProvider(
    'EDITOR_CUSTOMSTYLE_PERSON_SELECT',
    () => new PersonelSelectProvider(),
  );
});

export default {
  install(app: App): void {
    app.use(IBizPersonelSelect);
  },
};
