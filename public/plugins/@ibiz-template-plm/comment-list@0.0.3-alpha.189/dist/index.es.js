import './assets/style.css';
import { EditorController as D, ControllerEvent as O, registerEditorProvider as N } from "@ibiz-template/runtime";
import { defineComponent as S, ref as v, watch as T, onBeforeUnmount as M, createVNode as c, resolveComponent as j } from "vue";
import { getInputProps as z, getEditorEmits as F, useNamespace as U } from "@ibiz-template/vue3-util";
const _ = () => {
  const i = document.documentElement;
  return i ? getComputedStyle(i).getPropertyValue("--ibiz-color-primary") : null;
}, k = (i) => /[\u4e00-\u9fa5]+.*[a-zA-Z]+|[a-zA-Z]+.*[\u4e00-\u9fa5]+/.test(i), Z = (i) => /[\u4E00-\u9FA5]/.test(i), V = (i) => {
  if (!i)
    return "";
  let a = 0;
  for (let p = 0; p < i.length; p++)
    if (Z(i))
      a = i.charCodeAt(p) + ((a << 5) - a), a = a & a;
    else {
      const g = i.charCodeAt(p);
      a += g.toString(16);
    }
  const e = String(a).substring(0, 6);
  let t = parseInt(e.substring(0, 2), 16), n = parseInt(e.substring(2, 4), 16), d = parseInt(e.substring(4, 6), 16);
  t < 0 && (t = 10), n < 0 && (n = 10), d < 0 && (d = 10);
  const l = "#".concat(t.toString(16).padStart(2, "0")).concat(n.toString(16).padStart(2, "0")).concat(d.toString(16).padStart(2, "0")).replaceAll("-", "0");
  return l === "#FFFFFF" && _() || l;
}, C = (i) => {
  if (i && i.toString().length < 2)
    return i;
  if (i && i.toString().length >= 2) {
    if (k(i)) {
      const a = i.split("").find((t) => /[a-zA-Z]/.test(t)) || "", e = i.split("").find((t) => /[\u4E00-\u9FA5]/.test(t)) || "";
      return "".concat(a).concat(e).toLowerCase();
    }
    return /[a-zA-Z]/.test(i) ? i.split("").filter((a) => /[a-zA-Z]/.test(a)).slice(0, 2).join("").toUpperCase() : /[\u4E00-\u9FA5]/.test(i) ? i.split("").filter((a) => /[\u4E00-\u9FA5]/.test(a)).slice(-2).join("") : i.replaceAll(" ", "").substring(0, 2);
  }
}, { value: q, ...R } = z(), x = S({
  name: "CommentList",
  props: {
    ...R,
    value: {
      type: Array,
      default: () => []
    }
  },
  emits: F(),
  setup(i) {
    const a = U("comment-list"), e = i.controller, t = v([]), n = v([]);
    T(
      () => i.value,
      async (s) => {
        if (e.isLocal) {
          t.value = [];
          const o = await e.getLocalTempData();
          if (o) {
            const r = await o.fetchDefault(e.context);
            r.data && Array.isArray(r.data) && (t.value = r.data);
          }
        } else
          s ? Array.isArray(s) ? t.value = [...s] : t.value = [] : t.value = [];
      },
      {
        immediate: !0,
        deep: !0
      }
    );
    const d = (s) => {
      const { eventArg: o } = s;
      if (o) {
        const r = t.value.findIndex((m) => m.id === o);
        r >= 0 && t.value.splice(r, 1);
      }
    }, l = (s) => {
      t.value.push(s.eventArg);
    }, p = (s) => {
      const o = t.value.findIndex((r) => r.id === s.id);
      o > -1 && t.value.splice(o, 1, s);
    };
    e.evt.on("deleteItem", d), e.evt.on("addItem", l), e.evt.on("editreply", p);
    const g = async (s) => {
      e.deleteComment(s);
    }, A = (s) => {
      console.log("头像加载失败"), n.value.push(s);
    }, y = (s) => {
      if (!s)
        return null;
      const o = JSON.parse(s);
      if (o.length === 0)
        return null;
      const { downloadUrl: r } = ibiz.util.file.calcFileUpDownUrl(
        e.context,
        e.params,
        i.data,
        e.editorParams
      ), m = r.replace("%fileId%", o[0].id);
      return c(
        "img",
        {
          src: m,
          onError: () => A(s),
          alt: ""
        },
        null
      );
    }, b = (s) => {
      const o = e.operatorMap.get(s);
      let r, m = s;
      if (o) {
        const { label: h, iconurl: u } = o.data;
        m = h, u ? r = y(u) : r = C(h);
      } else
        r = C(s);
      return c(
        "div",
        {
          class: a.em("item", "avatar")
        },
        [
          c(
            "div",
            {
              class: a.em("item", "img"),
              style: "background-color:".concat(V(m))
            },
            [r]
          ),
          c(
            "div",
            {
              class: a.em("item", "label")
            },
            [m]
          )
        ]
      );
    }, E = (s) => {
      if (!s)
        return;
      const o = s.split(" ");
      if (o.length === 2) {
        const r = o[0].split("-"), m = /* @__PURE__ */ new Date(), h = m.getFullYear() - Number(r[0]), u = m.getMonth() + 1 - Number(r[1]), f = m.getDate() - Number(r[2]);
        if (h === 0) {
          if (u === 0) {
            if (f === 0)
              return "今天 ".concat(s.slice(11, -3));
            if (f === 1)
              return "昨天 ".concat(s.slice(11, -3));
            if (f === 2)
              return "前天 ".concat(s.slice(11, -3));
          }
          return s.slice(5, -3);
        }
        return s.slice(0, -3);
      }
    }, L = (s) => {
      e.updateComment(s);
    }, P = (s) => c(
      "div",
      {
        class: a.e("item")
      },
      [
        c(
          "div",
          {
            class: a.em("item", "header")
          },
          [
            b(s.create_man),
            c(
              "span",
              {
                class: a.em("item", "time")
              },
              [E(s.create_time)]
            ),
            s.create_man === e.context.srfuserid ? c("div", null, [
              c(
                "span",
                {
                  class: a.em("item", "edit"),
                  onClick: () => L(s),
                  title: "编辑"
                },
                [
                  c(
                    "i",
                    {
                      class: "fa fa-edit",
                      "aria-hidden": "true"
                    },
                    null
                  )
                ]
              ),
              c(
                "span",
                {
                  class: a.em("item", "delicon"),
                  onClick: () => g(s),
                  title: "删除"
                },
                [
                  c(
                    "i",
                    {
                      class: "fa fa-trash-o",
                      "aria-hidden": "true"
                    },
                    null
                  )
                ]
              )
            ]) : null
          ]
        ),
        c(
          "div",
          {
            class: a.em("item", "content")
          },
          [
            c(
              "div",
              {
                innerHTML: s.content
              },
              null
            )
          ]
        )
      ]
    ), w = () => t.value.length === 0 ? c(
      j("iBizNoData"),
      {
        class: a.e("nodata")
      },
      null
    ) : c(
      "div",
      {
        class: a.e("list")
      },
      [t.value.map((s) => P(s))]
    ), I = (s) => {
      s.stopPropagation(), s.preventDefault();
    };
    return M(() => {
      e.evt.off("addItem", l), e.evt.off("deleteItem", d), e.evt.off("editreply", p);
    }), {
      ns: a,
      c: e,
      renderList: w,
      stopClick: I
    };
  },
  render() {
    const i = this;
    return c(
      "div",
      {
        class: i.ns.b(),
        onClick: i.stopClick
      },
      [i.renderList()]
    );
  }
});
class B extends D {
  constructor() {
    super(...arguments), this.isLocal = !1, this.operatorMap = /* @__PURE__ */ new Map(), this.evt = new O(() => ({
      context: this.context,
      params: this.params,
      data: [],
      eventArg: "",
      targetName: this.model.name || "",
      view: this.view
    })), this.codeList = void 0, this.extraParams = {}, this.deCodeName = "comment";
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
  async deleteItem(a) {
    var e;
    if (this.isLocal) {
      const t = await this.getLocalTempData();
      if (t) {
        await ((e = t.local) == null ? void 0 : e.delete(this.context, a));
        const n = ibiz.uiDomainManager.get(this.context.srfsessionid);
        n && n.dataChangeCompleted();
      }
    }
    this.evt.emit("deleteItem", {
      eventArg: a
    });
  }
  async getLocalTempData() {
    const { form: a } = this.parent;
    if (a) {
      const { srfappid: e } = this.context, t = e.split("_").pop();
      return await ibiz.hub.getAppDEService(
        e,
        "".concat(t, ".").concat(this.deCodeName),
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
  async addItem(a) {
    if (this.isLocal) {
      const e = await this.getLocalTempData();
      if (e) {
        await e.create(this.context, a);
        const t = ibiz.uiDomainManager.get(this.context.srfsessionid);
        t && t.dataChangeCompleted();
      }
    }
    this.evt.emit("addItem", {
      eventArg: a
    });
  }
  /**
   * 更新项
   *
   * @param {IData} item
   * @return {*}  {Promise<void>}
   * @memberof CommentListComtroller
   */
  async upadteItem(a) {
    if (this.isLocal) {
      const e = await this.getLocalTempData();
      if (e) {
        await e.update(this.context, a);
        const t = ibiz.uiDomainManager.get(this.context.srfsessionid);
        t && t.dataChangeCompleted();
      }
    }
    this.evt.emit("editreply", {
      eventArg: a
    });
  }
  /**
   * 重新编辑评论
   *
   * @param {IData} item
   * @memberof CommentListComtroller
   */
  updateComment(a) {
    const e = this.parent, t = e.panel, n = e.form;
    t ? t.evt.emit("editreply", {
      targetName: "comments",
      context: this.context,
      params: this.params,
      data: [a]
    }) : n && n.evt.emit("editreply", {
      targetName: "comments",
      context: this.context,
      params: this.params,
      data: [a]
    });
  }
  /**
   * 删除评论
   *
   * @param {IData} item
   * @memberof CommentListComtroller
   */
  deleteComment(a) {
    const e = this.parent, t = e.panel, n = e.form;
    t ? t.evt.emit("deletecomment", {
      targetName: "comments",
      context: this.context,
      params: this.params,
      data: [a]
    }) : n && n.evt.emit("deletecomment", {
      targetName: "comments",
      context: this.context,
      params: this.params,
      data: [a]
    });
  }
  handleExtraParams(a) {
    const e = {};
    return Object.keys(this.extraParams).forEach((t) => {
      if (this.extraParams[t].startsWith("%") && this.extraParams[t].endsWith("%")) {
        const n = this.extraParams[t].slice(1, -1);
        Object.prototype.hasOwnProperty.call(this.context, n) ? Object.assign(e, { [t]: this.context[n] }) : Object.prototype.hasOwnProperty.call(this.params, n) ? Object.assign(e, { [t]: this.params[n] }) : Object.prototype.hasOwnProperty.call(a, n) ? Object.assign(e, { [t]: a[n] }) : Object.assign(e, { [t]: null });
      } else
        Object.assign(e, { [t]: this.extraParams[t] });
    }), e;
  }
  /**
   * 发送评论
   *
   * @memberof CommentListComtroller
   */
  sendComment(a, e) {
    const t = this.parent, n = t.panel, d = t.form;
    if (n) {
      const l = this.handleExtraParams(n.inputData);
      Object.assign(l, { value: a }), n.evt.emit("sendcomment", {
        targetName: "comments",
        context: this.context,
        params: this.params,
        data: [l]
      });
    } else if (d) {
      const l = this.handleExtraParams(e);
      Object.assign(l, { value: a }), d.evt.emit("sendcomment", {
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
    const a = await ibiz.hub.getApp(this.context.srfappid);
    let e = [];
    e = await a.codeList.get("SysOperator", this.context, this.params), this.operatorMap = new Map(e.map((t) => [t.value, t]));
  }
}
class H {
  constructor() {
    this.component = "CommentList", this.formEditor = "CommentList", this.gridEditor = "CommentList";
  }
  async createController(a, e) {
    const t = new B(a, e);
    return await t.init(), t;
  }
}
const G = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(i) {
    i.component(x.name, x), N(
      "EDITOR_CUSTOMSTYLE_COMMENT_LIST",
      () => new H()
    );
  }
};
export {
  G as default
};
