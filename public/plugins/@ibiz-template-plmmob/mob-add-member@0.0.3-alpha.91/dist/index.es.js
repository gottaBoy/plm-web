import { registerUIActionProvider as O, BackendUIActionProvider as k, OpenAppViewCommand as M } from "@ibiz-template/runtime";
import { RuntimeModelError as T } from "@ibiz-template/core";
import { isArray as b } from "qx-util";
class _ extends k {
  async execAction(e, s) {
    const { context: t, params: x, data: v, event: w, view: D } = s, o = {}, p = e.appDataEntityId, f = e.appDEMethodId;
    if (!p || !f)
      throw new T(
        e,
        ibiz.i18n.t("runtime.uiAction.noEntityOrBehavior")
      );
    const { resultContext: m, resultParams: c, resultData: d } = await this.handleParams(
      e,
      t,
      v,
      x
    ), u = { ...c }, h = e.frontAppViewId;
    if (h) {
      const a = this.handleViewOptionParams(c), i = this.handleSelectedData(D);
      i && i.length && (c.selecteddata = JSON.stringify(i));
      const n = await ibiz.commands.execute(
        M.TAG,
        h,
        m,
        c,
        { event: w, ...a }
      );
      if (!(n != null && n.ok))
        return o.cancel = !0, o;
      if (n != null && n.ok && n.data) {
        d.length === 0 && d.push({});
        const y = n.data.map(
          (r) => {
            var A;
            return ((A = r.getOrigin) == null ? void 0 : A.call(r)) || r._deData || r || {};
          }
        );
        d.forEach((r) => {
          r.srfactionparam = y;
        });
      }
    }
    const E = ibiz.hub.getApp(t == null ? void 0 : t.srfappid), g = d.map((a) => {
      var i;
      return ((i = a.getOrigin) == null ? void 0 : i.call(a)) || a || {};
    }).map((a) => Object.assign(a, u)), I = ["MULTIKEY", "MULTIDATA"].includes(
      e.actionTarget
    ), l = await E.deService.exec(
      p,
      f,
      m,
      I ? g : g[0],
      u
    );
    if (l.ok) {
      const a = this.calcMessage("success", e, s);
      a && ibiz.message.success(a);
    }
    return Object.assign(o, {
      data: b(l.data) ? l.data : [l.data],
      nextContext: m,
      nextParams: u
    }), o;
  }
  /**
   * 组装选中数据
   *
   * @param {IViewController} [view]
   * @return {*}  {IData[]}
   * @memberof AddTestMemberProvider
   */
  handleSelectedData(e) {
    let s = [];
    if (e) {
      const t = e.getController("mdctrl");
      t && (s = t.state.items || []);
    }
    return s.map((t) => ({
      ...t,
      _id: t.user_id || t[t.srfkeyfield],
      srfkey: t.user_id || t[t.srfkeyfield],
      srfmajortext: t.srfmajortext || t[t.srfmajorfield]
    }));
  }
}
const S = {
  install() {
    O(
      "DEUIACTION_ADD_TEST_MEMBER",
      () => new _()
    );
  }
};
export {
  S as default
};
