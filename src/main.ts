import * as Vue from 'vue';
import * as VueRouter from 'vue-router';
// import { IApiAppHubService } from '@ibiz-template/runtime';
// import { AppHooks } from '@ibiz-template/vue3-util';
import { runApp } from '@ibiz-template/vue3-components';
import VueTextFormat from 'vue-text-format';
import gridLayout from 'vue-grid-layout';
import UserRegister from './user-register';
import ComponentsRegister from './components';
import { StaticAuthGuard } from './guard';
import { userRoutes } from './router';
import '@/publish/sys.css';
import './runtime/router-shell.css';
import './runtime/list-toolbar.css';
import './runtime/login-layout.css';
import './runtime/wizard-layout.css';

// AppHooks.appResorceInited.tap((ctx: IApiAppHubService) => {
//   ctx.microAppConfigCenter.registerMicroApps([
//     {
//       name: 'plmcomweb',
//       entry: 'http://localhost:4173',
//       baseUrl: '0887f742467822fadc6d27196587a993__plmweb__plmcomweb',
//       pluginBaseUrl: './plugins',
//     },
//   ]);
// });
async function bootstrap(): Promise<void> {
  // Some host loaders wrap System.resolve in more than one async boundary.
  // System.set only accepts a concrete registry URL, never a Promise.
  const resolveSystemUrl = async (name: string): Promise<string> => {
    const resolved: unknown = System.resolve(name);
    if (typeof resolved === 'string') {
      return resolved;
    }
    if (
      resolved &&
      typeof (resolved as PromiseLike<unknown>).then === 'function'
    ) {
      const unwrapped = await resolved;
      if (typeof unwrapped === 'string') {
        return unwrapped;
      }
    }
    throw new TypeError(`System.resolve(${name}) did not return a URL`);
  };

  if (typeof System !== 'undefined') {
    const [vueUrl, routerUrl] = await Promise.all([
      resolveSystemUrl('vue'),
      resolveSystemUrl('vue-router'),
    ]);
    System.set(vueUrl, Vue);
    System.set(routerUrl, VueRouter);
  }
  runApp([VueTextFormat, gridLayout, ComponentsRegister, UserRegister], {
    getAuthGuard: () => new StaticAuthGuard(),
    userRoutes,
  });
}

bootstrap().catch(error => {
  setTimeout(() => {
    throw error;
  });
});
