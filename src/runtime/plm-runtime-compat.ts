import type { IApiNet } from '@ibiz-template/core';
import type { IAppService } from '@ibiz-template/runtime';

export const LEGACY_VIEW_THEME_QUERY_PATH =
  '/view_theme_settings/fetch_cur_user_all';
export const CURRENT_VIEW_THEME_QUERY_PATH =
  '/extension/app_view_themes/fetch_cur_user_all';

/**
 * The shared runtime still uses the legacy theme endpoint. PLM's backend
 * exposes the extension endpoint, so rewrite only this exact request.
 */
export function rewritePlmRuntimeRequestPath(url: string): string {
  return url === LEGACY_VIEW_THEME_QUERY_PATH
    ? CURRENT_VIEW_THEME_QUERY_PATH
    : url;
}

const patchedNets = new WeakSet<object>();

export function installPlmRuntimeCompatibility(app: IAppService): void {
  const net = app?.net;
  if (!net || typeof net.post !== 'function' || patchedNets.has(net)) {
    return;
  }

  const originalPost = net.post;
  const patchedPost: IApiNet['post'] = (url, ...args) =>
    originalPost.call(net, rewritePlmRuntimeRequestPath(url), ...args);

  net.post = patchedPost;
  patchedNets.add(net);
}
