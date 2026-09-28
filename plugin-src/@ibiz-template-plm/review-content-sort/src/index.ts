import type { Plugin } from 'vue';
import { registerReviewContentSortProvider } from './review-content-sort.provider';

export { registerReviewContentSortProvider };

const plugin: Plugin = {
  install() {
    registerReviewContentSortProvider();
  },
};

export default plugin;
