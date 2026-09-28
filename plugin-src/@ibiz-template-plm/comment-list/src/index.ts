import './style.css';

import { registerEditorProvider } from '@ibiz-template/runtime';

import { CommentList } from './comment-list';

import { CommentListProvider } from './comment-list.provider';

const CommentListPlugin = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(n) {
    n.component(CommentList.name, CommentList),
      registerEditorProvider(
        'EDITOR_CUSTOMSTYLE_COMMENT_LIST',
        () => new CommentListProvider(),
      );
  },
};

export { CommentListPlugin as default };
