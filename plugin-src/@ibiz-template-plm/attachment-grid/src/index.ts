import './style.css';

import { withInstall } from '@ibiz-template/vue3-util';

import { registerControlProvider, ControlType } from '@ibiz-template/runtime';

import { AttachmentGridControl } from './attachment-grid';

import { AttachmentGridProvider } from './attachment-grid.provider';

const IBizAttachmentGridControl = withInstall(AttachmentGridControl, t => {
  t.component(AttachmentGridControl.name, AttachmentGridControl),
    registerControlProvider(
      ''.concat(ControlType.GRID, '_RENDER_ATTACHMENT_GRID'),
      () => new AttachmentGridProvider(),
    );
});

const AttachmentGridPlugin = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(t) {
    t.use(IBizAttachmentGridControl);
  },
};

export {
  IBizAttachmentGridControl as IBizAttachmentGridControl,
  AttachmentGridPlugin as default,
};
