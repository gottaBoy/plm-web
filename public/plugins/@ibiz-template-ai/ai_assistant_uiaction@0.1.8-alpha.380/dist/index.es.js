import { registerUIActionProvider as z, UIActionProviderBase as P, execUILogic as A, getDeACMode as D, calcDeCodeNameById as N, ControlVO as U } from "@ibiz-template/runtime";
import { RuntimeModelError as g, ModelError as M, RuntimeError as I } from "@ibiz-template/core";
import { useUIStore as T } from "@ibiz-template/vue3-util";
class R extends P {
  /**
   * 界面行为执行入口，处理公共逻辑
   * @param {IAppDEUIAction} action
   * @param {IUILogicParams} params
   * @return {*}  {Promise<IUIActionResult>}
   */
  async exec(e, i) {
    const t = {
      refresh: e.reloadData,
      refreshMode: e.refreshMode,
      closeView: e.closeEditView
    }, { context: u, params: h, data: r, view: c } = i;
    e.closeEditView && (c.state.isClosing = !0);
    const { appDEUILogicId: n, appDataEntityId: s, uilogicAttachMode: f } = e;
    if (f === "REPLACE") {
      if (!n)
        throw new g(
          e,
          ibiz.i18n.t("runtime.logicScheduler.executor.noConfiguredLogic")
        );
      return await A(n, s, i), t;
    }
    if (!await this.isConfirm(e, i))
      return t.cancel = !0, this.returnError(t, c);
    const p = await this.execAction(e, i), { presetParams: a } = await this.handleParams(
      e,
      u,
      r,
      h
    );
    if (a.ignoredirtycheck === "true" && (c.modal.ignoreDismissCheck = !0), Object.assign(t, p), t.cancel === !0)
      return this.returnError(t, c);
    if (e.uilogicAttachMode === "AFTER") {
      if (!n)
        throw new g(
          e,
          ibiz.i18n.t("runtime.logicScheduler.executor.noConfiguredLogic")
        );
      await A(
        n,
        s,
        this.mergeArgsByResult(i, t)
      );
    }
    const d = this.mergeArgsByResult(i, t);
    if (e.closeEditView)
      this.doNextAction(e, d, e.appId);
    else {
      const o = await this.doNextAction(
        e,
        d,
        e.appId
      );
      if (o && (Object.keys(o).forEach((l) => {
        o[l] !== void 0 && (t[l] = o[l]);
      }), o.cancel === !0))
        return this.returnError(t, c);
    }
    return t;
  }
  /**
   * 执行具体界面行为
   * @param action
   * @param args
   * @returns
   */
  async execAction(e, i) {
    let t = {};
    switch (e.frontProcessType) {
      case "CHAT":
        t = await this.openAiChat(e, i);
        break;
      default:
        throw new M(
          e,
          ibiz.i18n.t("runtime.uiAction.frontProcessingModes", {
            frontProcessType: e.frontProcessType
          })
        );
    }
    return t;
  }
  /**
   * 根据 value 查找 key
   * @param map
   * @param value
   * @returns
   */
  getKeyByValueFromMap(e, i) {
    for (const [t, u] of e.entries())
      if (u === i)
        return t;
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
  async openAiChat(e, i) {
    var t, u;
    if (!ibiz.env.enableAI)
      throw new I(ibiz.i18n.t("runtime.uiAction.noEnableAI"));
    const { appDEACModeId: h, appDataEntityId: r, appId: c } = e, { resultContext: n, resultParams: s } = await this.handleParams(
      e,
      i.context,
      i.data,
      i.params
    ), f = Object.assign(n, { srfappid: c });
    if (!r || !h)
      throw new I(ibiz.i18n.t("runtime.uiAction.noEntityOrAcMode"));
    let p, a, d = {}, o = ibiz.appUtil.route2routeObject();
    if (o && o.pathNodes.length > 0 && (p = (t = o.pathNodes.pop()) == null ? void 0 : t.viewName, p === "route-modal" && (o = ibiz.appUtil.route2routeObject(!0), p = (u = o.pathNodes.pop()) == null ? void 0 : u.viewName)), p && (a = await ibiz.appUtil.viewCacheCenter.get(p)), a && a.state.srfactiveviewdata) {
      const l = a.state.srfactiveviewdata;
      if (d = l instanceof U ? l.getOrigin() : l, Object.assign(f, a.context), d && !s.srfaiagentscope) {
        const m = await ibiz.hub.getAppAsync(a.model.appId);
        if (m) {
          const w = this.getKeyByValueFromMap(
            m.deName2DeCodeName,
            d.srfdecodename
          );
          w && (s.srfaiagentscope = w);
        }
      }
    }
    return { data: await this.openAiChatContainer({
      appDEACModeId: h,
      appDataEntityId: r,
      context: f,
      view: a,
      ctrl: void 0,
      params: s,
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
  async openAiChatContainer(e) {
    const {
      data: i,
      view: t,
      ctrl: u,
      params: h,
      context: r,
      appDEACModeId: c,
      appDataEntityId: n
    } = e, s = await D(
      c,
      n,
      r.srfappid
    );
    if (!s)
      return Promise.resolve([]);
    const f = await ibiz.aiChatUtil.getAIChat(), p = N(n);
    let a = "".concat(n, "@").concat(c, "@");
    a += r[p] ? r[p] : "default";
    const d = ibiz.aiChatUtil.getChatSessionId("TOPIC", a), o = "新会话", l = { ...h, srfactag: s.codeName }, { zIndex: m } = T(), w = m.increment(), { containerOptions: b, topicOptions: E, chatOptions: y } = await ibiz.aiChatUtil.getUIActionExAIChatParams(
      r,
      h,
      i,
      s,
      { chatInstance: f, view: t, ctrl: u }
    ), v = await ibiz.aiChatUtil.getAIResourceOptions(
      r,
      h
    );
    return new Promise((x) => {
      f.create({
        mode: "TOPIC",
        resourceOptions: v,
        containerOptions: {
          zIndex: w,
          enableBackFill: !1,
          ...b
        },
        topicOptions: {
          appid: ibiz.env.appId,
          id: a,
          caption: o,
          url: window.location.hash.substring(1),
          type: r.srftopicpath || "default",
          ...E
        },
        chatOptions: {
          caption: s.logicName,
          context: { ...r },
          params: l,
          appDataEntityId: n,
          sessionid: d,
          // 扩展参数
          ...y,
          closed: (V, j, O) => {
            x(O);
          }
        }
      });
    });
  }
}
const k = {
  install(C) {
    z(
      "DEUIACTION_AI_ASSISTANT_UI_ACTION",
      () => new R()
    );
  }
};
export {
  k as default
};
