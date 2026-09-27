import './assets/style.css';
import './assets/style.css';
import { registerEditorProvider as I, EditorController as N, ControllerEvent as S } from "@ibiz-template/runtime";
import { defineComponent as j, ref as x, watch as M, onBeforeUnmount as z, createVNode as c, resolveComponent as F } from "vue";
import { getInputProps as T, getEditorEmits as U, useNamespace as k } from "@ibiz-template/vue3-util";
var _ = Object.defineProperty, Z = (i, t, e) => t in i ? _(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e, d = (i, t, e) => (Z(i, typeof t != "symbol" ? t + "" : t, e), e);
const B = () => {
  const i = document.documentElement;
  return i ? getComputedStyle(i).getPropertyValue("--ibiz-color-primary") : null;
}, R = (i) => /[\u4e00-\u9fa5]+.*[a-zA-Z]+|[a-zA-Z]+.*[\u4e00-\u9fa5]+/.test(i), W = (i) => /[\u4E00-\u9FA5]/.test(i), Y = (i) => {
  if (!i)
    return "";
  let t = 0;
  for (let p = 0; p < i.length; p++)
    if (W(i))
      t = i.charCodeAt(p) + ((t << 5) - t), t = t & t;
    else {
      const g = i.charCodeAt(p);
      t += g.toString(16);
    }
  const e = String(t).substring(0, 6);
  let a = parseInt(e.substring(0, 2), 16), n = parseInt(e.substring(2, 4), 16), l = parseInt(e.substring(4, 6), 16);
  a < 0 && (a = 10), n < 0 && (n = 10), l < 0 && (l = 10);
  const u = "#".concat(a.toString(16).padStart(2, "0")).concat(n.toString(16).padStart(2, "0")).concat(l.toString(16).padStart(2, "0")).replaceAll("-", "0");
  return u === "#FFFFFF" && B() || u;
}, b = (i) => {
  if (i && i.toString().length < 2)
    return i;
  if (i && i.toString().length >= 2) {
    if (R(i)) {
      const t = i.split("").find((a) => /[a-zA-Z]/.test(a)) || "", e = i.split("").find((a) => /[\u4E00-\u9FA5]/.test(a)) || "";
      return "".concat(t).concat(e).toLowerCase();
    }
    return /[a-zA-Z]/.test(i) ? i.split("").filter((t) => /[a-zA-Z]/.test(t)).slice(0, 2).join("").toUpperCase() : /[\u4E00-\u9FA5]/.test(i) ? i.split("").filter((t) => /[\u4E00-\u9FA5]/.test(t)).slice(-2).join("") : i.replaceAll(" ", "").substring(0, 2);
  }
}, C = /* @__PURE__ */ j({
  name: "CommentList",
  props: {
    ...T(),
    value: {
      type: Array,
      default: () => []
    }
  },
  emits: U(),
  setup(i) {
    const t = k("comment-list"), e = i.controller, a = x([]), n = x([]);
    M(() => i.value, async (s) => {
      if (e.isLocal) {
        a.value = [];
        const o = await e.getLocalTempData();
        if (o) {
          const r = await o.fetchDefault(e.context);
          r.data && Array.isArray(r.data) && (a.value = r.data);
        }
      } else
        s ? Array.isArray(s) ? a.value = [...s] : a.value = [] : a.value = [];
    }, {
      immediate: !0,
      deep: !0
    });
    const l = (s) => {
      const {
        eventArg: o
      } = s;
      if (o) {
        const r = a.value.findIndex((m) => m.id === o);
        r >= 0 && a.value.splice(r, 1);
      }
    }, u = (s) => {
      a.value.push(s.eventArg);
    }, p = (s) => {
      const o = a.value.findIndex((r) => r.id === s.id);
      o > -1 && a.value.splice(o, 1, s);
    };
    e.evt.on("deleteItem", l), e.evt.on("addItem", u), e.evt.on("editreply", p);
    const g = async (s) => {
      e.deleteComment(s);
    }, y = (s) => {
      console.log("头像加载失败"), n.value.push(s);
    }, w = (s) => {
      if (!s)
        return null;
      const o = JSON.parse(s);
      if (o.length === 0)
        return null;
      const {
        downloadUrl: r
      } = ibiz.util.file.calcFileUpDownUrl(e.context, e.params, i.data, e.editorParams), m = r.replace("%fileId%", o[0].id);
      return c("img", {
        src: m,
        onError: () => y(s),
        alt: ""
      }, null);
    }, A = (s) => {
      const o = e.operatorMap.get(s);
      let r, m = s;
      if (o) {
        const {
          label: h,
          iconurl: f
        } = o.data;
        m = h, f ? r = w(f) : r = b(h);
      } else
        r = b(s);
      return c("div", {
        class: t.em("item", "avatar")
      }, [c("div", {
        class: t.em("item", "img"),
        style: "background-color:".concat(Y(m))
      }, [r]), c("div", {
        class: t.em("item", "label")
      }, [m])]);
    }, P = (s) => {
      const o = s.split(" ");
      if (o.length === 2) {
        const r = o[0].split("-"), m = /* @__PURE__ */ new Date(), h = m.getFullYear() - Number(r[0]), f = m.getMonth() + 1 - Number(r[1]), v = m.getDate() - Number(r[2]);
        if (h === 0) {
          if (f === 0) {
            if (v === 0)
              return "今天 ".concat(s.slice(11, -3));
            if (v === 1)
              return "昨天 ".concat(s.slice(11, -3));
            if (v === 2)
              return "前天 ".concat(s.slice(11, -3));
          }
          return s.slice(5, -3);
        }
        return s.slice(0, -3);
      }
    }, E = (s) => {
      e.updateComment(s);
    }, L = (s) => c("div", {
      class: t.e("item")
    }, [c("div", {
      class: t.em("item", "header")
    }, [A(s.create_man), c("span", {
      class: t.em("item", "time")
    }, [P(s.create_time)]), s.create_man === e.context.srfuserid ? c("div", null, [c("span", {
      class: t.em("item", "edit"),
      onClick: () => E(s),
      title: "编辑"
    }, [c("i", {
      class: "fa fa-edit",
      "aria-hidden": "true"
    }, null)]), c("span", {
      class: t.em("item", "delicon"),
      onClick: () => g(s),
      title: "删除"
    }, [c("i", {
      class: "fa fa-trash-o",
      "aria-hidden": "true"
    }, null)])]) : null]), c("div", {
      class: t.em("item", "content")
    }, [c("div", {
      innerHTML: s.content
    }, null)])]), O = () => a.value.length === 0 ? c(F("iBizNoData"), {
      class: t.e("nodata")
    }, null) : c("div", {
      class: t.e("list")
    }, [a.value.map((s) => L(s))]), D = (s) => {
      s.stopPropagation(), s.preventDefault();
    };
    return z(() => {
      e.evt.off("addItem", u), e.evt.off("deleteItem", l), e.evt.off("editreply", p);
    }), {
      ns: t,
      c: e,
      renderList: O,
      stopClick: D
    };
  },
  render() {
    return c("div", {
      class: this.ns.b(),
      onClick: this.stopClick
    }, [this.renderList()]);
  }
});
class H extends N {
  constructor() {
    super(...arguments), d(this, "isLocal", !1), d(this, "operatorMap", /* @__PURE__ */ new Map()), d(this, "evt", new S(
      () => ({
        context: this.context,
        params: this.params,
        data: [],
        eventArg: "",
        targetName: this.model.name,
        view: this.parent.view
      })
    )), d(this, "codeList"), d(this, "extraParams", {}), d(this, "deCodeName", "comment");
  }
  async onInit() {
    super.onInit(), await this.getOperatorUserList(), this.editorParams && this.editorParams.PID && Object.assign(this.extraParams, { pid: this.editorParams.PID }), this.editorParams && this.editorParams.ISLOCAL === "TRUE" && (this.isLocal = !0), this.editorParams && this.editorParams.DECODENAME && (this.deCodeName = this.editorParams.DECODENAME);
  }
  /**
   * 删除项
   *
   * @param {string} key
   * @memberof CommentListComtroller
   */
  async deleteItem(t) {
    var e;
    if (this.isLocal) {
      const a = await this.getLocalTempData();
      if (a) {
        await ((e = a.local) == null ? void 0 : e.delete(this.context, t));
        const n = ibiz.uiDomainManager.get(this.context.srfsessionid);
        n && n.dataChangeCompleted();
      }
    }
    this.evt.emit("deleteItem", {
      eventArg: t
    });
  }
  async getLocalTempData() {
    const { form: t } = this.parent;
    if (t) {
      const { srfappid: e } = this.context, a = e.split("_").pop();
      return await ibiz.hub.getAppDEService(
        e,
        "".concat(a, ".").concat(this.deCodeName),
        this.context
      );
    }
  }
  /**
   * 添加项
   *
   * @param {IData} item
   * @memberof CommentListComtroller
   */
  async addItem(t) {
    if (this.isLocal) {
      const e = await this.getLocalTempData();
      if (e) {
        await e.create(this.context, t);
        const a = ibiz.uiDomainManager.get(this.context.srfsessionid);
        a && a.dataChangeCompleted();
      }
    }
    this.evt.emit("addItem", {
      eventArg: t
    });
  }
  /**
   * 更新项
   *
   * @param {IData} item
   * @return {*}  {Promise<void>}
   * @memberof CommentListComtroller
   */
  async upadteItem(t) {
    if (this.isLocal) {
      const e = await this.getLocalTempData();
      if (e) {
        await e.update(this.context, t);
        const a = ibiz.uiDomainManager.get(this.context.srfsessionid);
        a && a.dataChangeCompleted();
      }
    }
    this.evt.emit("editreply", {
      eventArg: t
    });
  }
  /**
   * 重新编辑评论
   *
   * @param {IData} item
   * @memberof CommentListComtroller
   */
  updateComment(t) {
    const e = this.parent.panel, a = this.parent.form;
    e ? e.evt.emit("editreply", {
      targetName: "comments",
      context: this.context,
      params: this.params,
      data: [t]
    }) : a && a.evt.emit("editreply", {
      targetName: "comments",
      context: this.context,
      params: this.params,
      data: [t]
    });
  }
  /**
   * 删除评论
   *
   * @param {IData} item
   * @memberof CommentListComtroller
   */
  deleteComment(t) {
    const e = this.parent.panel, a = this.parent.form;
    e ? e.evt.emit("deletecomment", {
      targetName: "comments",
      context: this.context,
      params: this.params,
      data: [t]
    }) : a && a.evt.emit("deletecomment", {
      targetName: "comments",
      context: this.context,
      params: this.params,
      data: [t]
    });
  }
  handleExtraParams(t) {
    const e = {};
    return Object.keys(this.extraParams).forEach((a) => {
      if (this.extraParams[a].startsWith("%") && this.extraParams[a].endsWith("%")) {
        const n = this.extraParams[a].slice(1, -1);
        Object.prototype.hasOwnProperty.call(this.context, n) ? Object.assign(e, { [a]: this.context[n] }) : Object.prototype.hasOwnProperty.call(this.params, n) ? Object.assign(e, { [a]: this.params[n] }) : Object.prototype.hasOwnProperty.call(t, n) ? Object.assign(e, { [a]: t[n] }) : Object.assign(e, { [a]: null });
      } else
        Object.assign(e, { [a]: this.extraParams[a] });
    }), e;
  }
  /**
   * 发送评论
   *
   * @memberof CommentListComtroller
   */
  sendComment(t, e) {
    const a = this.parent.panel, n = this.parent.form;
    if (a) {
      const l = this.handleExtraParams(a.inputData);
      Object.assign(l, { value: t }), a.evt.emit("sendcomment", {
        targetName: "comments",
        context: this.context,
        params: this.params,
        data: [l]
      });
    } else if (n) {
      const l = this.handleExtraParams(e);
      Object.assign(l, { value: t }), n.evt.emit("sendcomment", {
        targetName: "comments",
        context: this.context,
        params: this.params,
        data: [l]
      });
    }
  }
  /**
   * 获取操作用户列表
   *
   * @memberof PersonelSelectController
   */
  async getOperatorUserList() {
    const t = await ibiz.hub.getApp(this.context.srfappid);
    let e = [];
    e = await t.codeList.get(
      "SysOperator",
      this.context,
      this.params
    ), this.operatorMap = new Map(
      e.map((a) => [a.value, a])
    );
  }
}
class J {
  constructor() {
    d(this, "component", "CommentList"), d(this, "formEditor", "CommentList"), d(this, "gridEditor", "CommentList");
  }
  async createController(t, e) {
    const a = new H(t, e);
    return await a.init(), a;
  }
}
const G = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(i) {
    i.component(C.name, C), I(
      "EDITOR_CUSTOMSTYLE_COMMENT_LIST",
      () => new J()
    );
  }
};
export {
  G as default
};
