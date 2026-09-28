import './style.css';
import type { App } from 'vue';
import { registerGridColumnProvider } from '@ibiz-template/runtime';
import { DynamicColumn } from './dynamic-column';
import { DynamicColumnProvider } from './dynamic-column.provider';

export default {
  install(app: App): void {
    app.component(DynamicColumn.name!, DynamicColumn);
    registerGridColumnProvider(
      'GRID_COLRENDER_DYNAMIC_COLUMN',
      () => new DynamicColumnProvider(),
    );
  },
};
