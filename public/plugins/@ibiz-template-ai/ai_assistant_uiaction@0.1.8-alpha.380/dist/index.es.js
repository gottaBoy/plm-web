import { UIActionProviderBase as P, execUILogic as I, ControlVO as N, getDeACMode as z, calcDeCodeNameById as U, registerUIActionProvider as D } from "@ibiz-template/runtime";
import { RuntimeModelError as C, ModelError as M, RuntimeError as g } from "@ibiz-template/core";
import { useUIStore as T } from "@ibiz-template/vue3-util";
class R extends P {
  /**
   * 界面行为执行入口，处理公共逻辑
   * @param {IAppDEUIAction} action
   * @param {IUILogicParams} params
   * @return {*}  {Promise<IUIActionResult>}
   */
  async exec(t, i) {
    const e = {
      refresh: t.reloadData,
      refreshMode: t.refreshMode,
      closeView: t.closeEditView
    }, { context: l, params: h, data: s, view: o } = i;
    t.closeEditView && (o.state.isClosing = !0);
    const { appDEUILogicId: r, appDataEntityId: a, uilogicAttachMode: n } = t;
    if (n === "REPLACE") {
      if (!r)
        throw new C(
          t,
          ibiz.i18n.t("runtime.logicScheduler.executor.noConfiguredLogic")
        );
      return await I(r, a, i), e;
    }
    if (!await this.isConfirm(t, i))
      return e.cancel = !0, this.returnError(e, o);
    const d = await this.execAction(t, i), { presetParams: c } = await this.handleParams(
      t,
      l,
      s,
      h
    );
    if (c.ignoredirtycheck === "true" && (o.modal.ignoreDismissCheck = !0), Object.assign(e, d), e.cancel === !0)
      return this.returnError(e, o);
    if (t.uilogicAttachMode === "AFTER") {
      if (!r)
        throw new C(
          t,
          ibiz.i18n.t("runtime.logicScheduler.executor.noConfiguredLogic")
        );
      await I(
        r,
        a,
        this.mergeArgsByResult(i, e)
      );
    }
    const f = this.mergeArgsByResult(i, e);
    if (t.closeEditView)
      this.doNextAction(t, f, t.appId);
    else {
      const p = await this.doNextAction(
        t,
        f,
        t.appId
      );
      if (p && (Object.keys(p).forEach((u) => {
        p[u] !== void 0 && (e[u] = p[u]);
      }), p.cancel === !0))
        return this.returnError(e, o);
    }
    return e;
  }
  /**
   * 执行具体界面行为
   * @param action
   * @param args
   * @returns
   */
  async execAction(t, i) {
    let e = {};
    switch (t.frontProcessType) {
      case "CHAT":
        e = await this.openAiChat(t, i);
        break;
      default:
        throw new M(
          t,
          ibiz.i18n.t("runtime.uiAction.frontProcessingModes", {
            frontProcessType: t.frontProcessType
          })
        );
    }
    return e;
  }
  /**
   * 根据 value 查找 key
   * @param map
   * @param value
   * @returns
   */
  getKeyByValueFromMap(t, i) {
    for (const [e, l] of t.entries())
      if (l === i)
        return e;
  }
  /**
   * 打开AI聊天框
   *
   * @protected
   * @param {IAppDEUIAction} action
   * @param {IUILogicParams} args
   * @return {*}  {Promise<IUIActionResult>}
   * @memberof AIAssistantUIActionProvider
   */
  async openAiChat(t, i) {
    var p, u;
    if (!ibiz.env.enableAI)
      throw new g(ibiz.i18n.t("runtime.uiAction.noEnableAI"));
    const { appDEACModeId: e, appDataEntityId: l, appId: h } = t, { resultContext: s, resultParams: o } = await this.handleParams(
      t,
      i.context,
      i.data,
      i.params
    ), r = Object.assign(s, { srfappid: h });
    if (!l || !e)
      throw new g(ibiz.i18n.t("runtime.uiAction.noEntityOrAcMode"));
    let a, n, d = {}, c = ibiz.appUtil.route2routeObject();
    if (c && c.pathNodes.length > 0 && (a = (p = c.pathNodes.pop()) == null ? void 0 : p.viewName, a === "route-modal" && (c = ibiz.appUtil.route2routeObject(!0), a = (u = c.pathNodes.pop()) == null ? void 0 : u.viewName)), a && (n = await ibiz.appUtil.viewCacheCenter.get(a)), n && n.state.srfactiveviewdata) {
      const m = n.state.srfactiveviewdata;
      if (d = m instanceof N ? m.getOrigin() : m, Object.assign(r, n.context), d && !o.srfaiagentscope) {
        const w = await ibiz.hub.getAppAsync(n.model.appId);
        if (w) {
          const A = this.getKeyByValueFromMap(
            w.deName2DeCodeName,
            d.srfdecodename
          );
          A && (o.srfaiagentscope = A);
        }
      }
    }
    return { data: await this.openAiChatContainer({
      appDEACModeId: e,
      appDataEntityId: l,
      context: r,
      view: n,
      ctrl: void 0,
      params: o,
      data: d
    }) };
  }
  /**
   * 打开AI聊天
   *
   * @param {IAiChatParam} chartParams
   * @return {*}  {Promise<IChatMessage[]>}
   * @memberof AppUtil
   */
  async openAiChatContainer(t) {
    const {
      data: i,
      view: e,
      ctrl: l,
      params: h,
      context: s,
      appDEACModeId: o,
      appDataEntityId: r
    } = t, a = await z(
      o,
      r,
      s.srfappid
    );
    if (!a)
      return Promise.resolve([]);
    const n = await ibiz.aiChatUtil.getAIChat(), d = U(r);
    let c = "".concat(r, "@").concat(o, "@");
    c += s[d] ? s[d] : "default";
    const f = ibiz.aiChatUtil.getChatSessionId("TOPIC", c), p = "新会话", u = { ...h, srfactag: a.codeName }, { zIndex: m } = T(), w = m.increment(), { containerOptions: A, topicOptions: x, chatOptions: E } = await ibiz.aiChatUtil.getUIActionExAIChatParams(
      s,
      h,
      i,
      a,
      { chatInstance: n, view: e, ctrl: l }
    ), v = await ibiz.aiChatUtil.getAIResourceOptions(
      s,
      h
    );
    return new Promise((y) => {
      n.create({
        mode: "TOPIC",
        resourceOptions: v,
        containerOptions: {
          zIndex: w,
          enableBackFill: !1,
          ...A
        },
        topicOptions: {
          appid: ibiz.env.appId,
          id: c,
          caption: p,
          url: window.location.hash.substring(1),
          type: s.srftopicpath || "default",
          ...x
        },
        chatOptions: {
          caption: a.logicName,
          context: { ...s },
          params: u,
          appDataEntityId: r,
          sessionid: f,
          // 扩展参数
          ...E,
          closed: (V, j, O) => {
            y(O);
          }
        }
      });
    });
  }
}
const L = {
  install(b) {
    D(
      "DEUIACTION_AI_ASSISTANT_UI_ACTION",
      () => new R()
    );
  }
};
export {
  L as default
};
