import { registerUIActionProvider as f, UIActionProviderBase as m, convertNavData as l, formatMultiData as d } from "@ibiz-template/runtime";
class w extends m {
  async execAction(e, s) {
    const { context: a, params: r, data: n } = s, { resultParams: t } = await this.handleParams(
      e,
      a,
      n,
      r
    );
    return this.validate(t) ? await this.changePass(t) ? {
      refresh: !0,
      refreshMode: e.refreshMode
    } : { refresh: !1 } : { refresh: !1 };
  }
  async changePass(e) {
    try {
      return await ibiz.net.post("/uaa/changepwd", {
        oldPwd: e.oldpassword,
        newPwd: e.newpassword
      }), ibiz.message.success("修改密码成功"), !0;
    } catch (s) {
      return ibiz.message.error("修改密码失败,".concat(s.message || "")), !1;
    }
  }
  validate(e) {
    const { newpassword: s, oldpassword: a, surepassword: r } = e;
    return s ? a ? r ? a === s ? (ibiz.message.error("新密码不能与旧密码一致"), !1) : s !== r ? (ibiz.message.error("两次密码不一致"), !1) : !0 : (ibiz.message.error("确认密码不能为空"), !1) : (ibiz.message.error("新密码不能为空"), !1) : (ibiz.message.error("原密码不能为空"), !1);
  }
  async handleParams(e, s, a, r) {
    const n = [], t = s.clone(), i = [...e.navigateContexts || []], o = ["MULTIKEY", "MULTIDATA"].includes(e.actionTarget) && a.length > 0, g = l(
      i,
      o ? d(i, a) : a[0] || {},
      r,
      s
    );
    Object.assign(t, g);
    const c = e.navigateParams, u = l(
      c,
      o ? d(c, a) : a[0] || {},
      r,
      t
    );
    return { resultContext: t, resultData: n, resultParams: u };
  }
}
function h() {
  f(
    "DEUIACTION_CHANGE_PASSWORD",
    () => new w()
  );
}
const p = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install() {
    h();
  }
};
export {
  p as default,
  h as registerChangePasswordProvider
};
