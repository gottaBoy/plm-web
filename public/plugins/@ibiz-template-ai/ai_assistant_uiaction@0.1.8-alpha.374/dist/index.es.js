import { UIActionProviderBase as z, execUILogic as w, ControlVO as N, getDeACMode as U, calcDeCodeNameById as M, registerUIActionProvider as D } from "@ibiz-template/runtime";
import { RuntimeModelError as I, ModelError as T, RuntimeError as C } from "@ibiz-template/core";
import { useUIStore as R } from "@ibiz-template/vue3-util";
class V extends z {
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
    }, { context: p, params: l, data: a, view: o } = i;
    t.closeEditView && (o.state.isClosing = !0);
    const { appDEUILogicId: r, appDataEntityId: s, uilogicAttachMode: n } = t;
    if (n === "REPLACE") {
      if (!r)
        throw new I(
          t,
          ibiz.i18n.t("runtime.logicScheduler.executor.noConfiguredLogic")
        );
      return await w(r, s, i), e;
    }
    if (!await this.isConfirm(t, i))
      return e.cancel = !0, this.returnError(e, o);
    const u = await this.execAction(t, i), { presetParams: h } = await this.handleParams(
      t,
      p,
      a,
      l
    );
    if (h.ignoredirtycheck === "true" && (o.modal.ignoreDismissCheck = !0), Object.assign(e, u), e.cancel === !0)
      return this.returnError(e, o);
    if (t.uilogicAttachMode === "AFTER") {
      if (!r)
        throw new I(
          t,
          ibiz.i18n.t("runtime.logicScheduler.executor.noConfiguredLogic")
        );
      await w(
        r,
        s,
        this.mergeArgsByResult(i, e)
      );
    }
    const f = this.mergeArgsByResult(i, e);
    if (t.closeEditView)
      this.doNextAction(t, f, t.appId);
    else {
      const c = await this.doNextAction(
        t,
        f,
        t.appId
      );
      if (c && (Object.keys(c).forEach((d) => {
        c[d] !== void 0 && (e[d] = c[d]);
      }), c.cancel === !0))
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
        throw new T(
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
    for (const [e, p] of t.entries())
      if (p === i)
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
    var c;
    if (!ibiz.env.enableAI)
      throw new C(ibiz.i18n.t("runtime.uiAction.noEnableAI"));
    const { appDEACModeId: e, appDataEntityId: p, appId: l } = t, { resultContext: a, resultParams: o } = await this.handleParams(
      t,
      i.context,
      i.data,
      i.params
    ), r = Object.assign(a, { srfappid: l });
    if (!p || !e)
      throw new C(ibiz.i18n.t("runtime.uiAction.noEntityOrAcMode"));
    let s, n, u = {};
    const h = ibiz.appUtil.route2routeObject();
    if (h && h.pathNodes.length > 0 && (s = (c = h.pathNodes.pop()) == null ? void 0 : c.viewName), s && (n = await ibiz.appUtil.viewCacheCenter.get(s)), n && n.state.srfactiveviewdata) {
      const d = n.state.srfactiveviewdata;
      if (u = d instanceof N ? d.getOrigin() : d, Object.assign(r, n.context), u && !o.srfaiagentscope) {
        const m = await ibiz.hub.getAppAsync(n.model.appId);
        if (m) {
          const A = this.getKeyByValueFromMap(
            m.deName2DeCodeName,
            u.srfdecodename
          );
          A && (o.srfaiagentscope = A);
        }
      }
    }
    return { data: await this.openAiChatContainer({
      appDEACModeId: e,
      appDataEntityId: p,
      context: r,
      view: n,
      ctrl: void 0,
      params: o,
      data: u
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
      ctrl: p,
      params: l,
      context: a,
      appDEACModeId: o,
      appDataEntityId: r
    } = t, s = await U(
      o,
      r,
      a.srfappid
    );
    if (!s)
      return Promise.resolve([]);
    const n = await ibiz.aiChatUtil.getAIChat(), u = [], h = M(r);
    let f = "".concat(r, "@").concat(o, "@");
    f += a[h] ? a[h] : "default";
    const c = ibiz.aiChatUtil.getChatSessionId("TOPIC", f), d = "新会话", m = { ...l, srfactag: s.codeName }, { zIndex: A } = R(), b = A.increment(), { containerOptions: x, topicOptions: E, chatOptions: v } = await ibiz.aiChatUtil.getUIActionExAIChatParams(
      a,
      l,
      i,
      s,
      { chatInstance: n, view: e, ctrl: p }
    ), y = await ibiz.aiChatUtil.getAIResourceOptions(
      a,
      l
    ), O = ibiz.aiChatUtil.getAIChatMode("UIACTION", a, l);
    return new Promise((P) => {
      n.create({
        mode: O,
        resourceOptions: y,
        containerOptions: {
          zIndex: b,
          enableBackFill: !1,
          ...x
        },
        topicOptions: {
          appid: ibiz.env.appId,
          id: f,
          caption: d,
          url: window.location.hash.substring(1),
          type: a.srftopicpath || "default",
          ...E
        },
        chatOptions: {
          caption: s.logicName,
          context: { ...a },
          params: m,
          appDataEntityId: r,
          sessionid: c,
          // 扩展参数
          ...v,
          closed: () => {
            P(u);
          }
        }
      });
    });
  }
}
const _ = {
  install(g) {
    D(
      "DEUIACTION_AI_ASSISTANT_UI_ACTION",
      () => new V()
    );
  }
};
export {
  _ as default
};
