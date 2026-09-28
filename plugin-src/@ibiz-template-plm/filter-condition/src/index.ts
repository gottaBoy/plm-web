import './style.css';
import type { App } from 'vue';
import { FilterCondition } from './filter-condition';
import { registerFilterConditionProvider } from './filter-condition.provider';

export { FilterCondition };

export default {
  install(app: App): void {
    app.component(FilterCondition.name!, FilterCondition);
    registerFilterConditionProvider();
  },
};
