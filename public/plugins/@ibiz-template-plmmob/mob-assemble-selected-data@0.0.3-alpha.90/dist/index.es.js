import { registerUIActionProvider as h, FrontUIActionProvider as P, OpenAppViewCommand as E } from "@ibiz-template/runtime";
import { ModelError as k, RuntimeModelError as T, StringUtil as x } from "@ibiz-template/core";
class D extends P {
  async execAction(t, a) {
    const { context: e, params: d, data: c, event: f, noWaitRoute: p, view: w } = a;
    let i = {};
    switch (t.frontProcessType) {
      case "OPENHTMLPAGE": {
        const n = x.fill(t.htmlPageUrl, e, c == null ? void 0 : c[0]);
        window.open(n, "_blank");
        break;
      }
      case "TOP":
      case "WIZARD": {
        const n = t.frontAppViewId;
        if (!n)
          throw new T(
            t,
            ibiz.i18n.t("runtime.uiAction.noConfiguredopenView")
          );
        const { resultContext: u, resultParams: s } = await this.handleParams(
          t,
          e,
          c,
          d
        ), l = this.handleSelectedData(w);
        l && l.length && (s.selecteddata = JSON.stringify(l));
        const A = this.handleViewOptionParams(s), r = await ibiz.commands.execute(
          E.TAG,
          n,
          u,
          s,
          { event: f, noWaitRoute: p, ...A }
        );
        r != null && r.ok || (i.cancel = !0), r != null && r.ok && r.data && (Array.isArray(r.data) ? i.data = r.data.map((o) => {
          var m;
          return typeof o == "object" && (((m = o.getOrigin) == null ? void 0 : m.call(o)) || o._deData) || o;
        }) : i.data = r.data, i.nextContext = u, i.nextParams = { ...d, ...s });
        break;
      }
      case "PRINT":
        await this.executePrint(t, a);
        break;
      case "DATAIMP":
        i = await this.executeDataImport(t, a);
        break;
      case "DATAEXP":
        await this.executeDataExport(t, a);
        break;
      case "OTHER":
        i = await this.doOther(t, a);
        break;
      case "EDITFORM":
        i = await this.openEditForm(t, a);
        break;
      case "QUICKEDIT":
        i = await this.openQuickEdit(t, a);
        break;
      default:
        throw new k(
          t,
          ibiz.i18n.t("runtime.uiAction.frontProcessingModes", {
            frontProcessType: t.frontProcessType
          })
        );
    }
    return i;
  }
  /**
   * 处理选中数据
   *
   * @memberof AssembleSelectedDataProvider
   */
  handleSelectedData(t) {
    let a = [];
    if (t) {
      const e = t.getController("mdctrl");
      e && (a = e.state.items || []);
    }
    return a.map((e) => ({
      srfkey: e.user_id || e[e.srfkeyfield],
      _id: e.user_id || e[e.srfkeyfield],
      // 传给树的时候需要这个字段
      srfmajortext: e[e.srfmajorfield]
    }));
  }
}
const O = {
  install() {
    h(
      "DEUIACTION_ASSEMBLE_SELECTED_DATA",
      () => new D()
    );
  }
};
export {
  O as default
};
