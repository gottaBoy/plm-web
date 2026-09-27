import './assets/style.css';
import './assets/style.css';
import { registerControlProvider as R, ControlType as B, ListController as T } from "@ibiz-template/runtime";
import { withInstall as k, useControlController as O, useNamespace as I } from "@ibiz-template/vue3-util";
import { defineComponent as S, computed as j, createVNode as o, resolveComponent as c, isVNode as V, withDirectives as N, resolveDirective as M, createTextVNode as y } from "vue";
import { isArray as U, isNil as _ } from "lodash-es";
import { RuntimeError as q } from "@ibiz-template/core";
var Z = Object.defineProperty, Y = (a, t, e) => t in a ? Z(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e, d = (a, t, e) => (Y(a, typeof t != "symbol" ? t + "" : t, e), e);
function H(a) {
  function t(n) {
    !n || n === a.state.curPage || (a.state.curPage = n, a.load());
  }
  function e(n) {
    !n || n === a.state.size || (a.state.size = n, a.state.curPage === 1 && a.load());
  }
  function i() {
    a.load();
  }
  return { onPageChange: t, onPageSizeChange: e, onPageRefresh: i };
}
const h = class {
  /**
   * 获取主题色
   *
   * @static
   * @return {*}
   * @memberof Util
   */
  static getThemeVar() {
    const t = document.documentElement;
    return t ? getComputedStyle(t).getPropertyValue("--ibiz-color-primary") : null;
  }
  /**
   * 是否为中文字符串
   *
   * @static
   * @param {string} char
   * @return {*}
   * @memberof Util
   */
  static isChineseChart(t) {
    return /[\u4E00-\u9FA5]/.test(t);
  }
  /**
   * 是否同时存在英文和中文
   *
   * @static
   * @param {string} str
   * @return {*}
   * @memberof Util
   */
  static hasChineseAndEnglish(t) {
    return /[\u4e00-\u9fa5]+.*[a-zA-Z]+|[a-zA-Z]+.*[\u4e00-\u9fa5]+/.test(t);
  }
  /**
   * 计算图片文字
   *
   * @static
   * @param {string} textVal
   * @return {*}
   * @memberof Util
   */
  static calcTextPhoto(t) {
    if (t && t.toString().length < 2)
      return t;
    if (t && t.toString().length >= 2) {
      if (this.hasChineseAndEnglish(t)) {
        const e = t.split("").find((n) => /[a-zA-Z]/.test(n)) || "", i = t.split("").find((n) => /[\u4E00-\u9FA5]/.test(n)) || "";
        return "".concat(e).concat(i).toLowerCase();
      }
      return /[a-zA-Z]/.test(t) ? t.split("").filter((e) => /[a-zA-Z]/.test(e)).slice(0, 2).join("").toUpperCase() : /[\u4E00-\u9FA5]/.test(t) ? t.split("").filter((e) => /[\u4E00-\u9FA5]/.test(e)).slice(-2).join("") : t.replaceAll(" ", "").substring(0, 2);
    }
  }
};
d(h, "calcColorPhoto", (a) => {
  if (!a)
    return "";
  let t = 0;
  for (let u = 0; u < a.length; u++)
    if (h.isChineseChart(a))
      t = a.charCodeAt(u) + ((t << 5) - t), t = t & t;
    else {
      const g = a.charCodeAt(u);
      t += g.toString(16);
    }
  const e = String(t).substring(0, 6);
  let i = parseInt(e.substring(0, 2), 16), n = parseInt(e.substring(2, 4), 16), p = parseInt(e.substring(4, 6), 16);
  i < 0 && (i = 10), n < 0 && (n = 10), p < 0 && (p = 10);
  const m = "#".concat(i.toString(16).padStart(2, "0")).concat(n.toString(16).padStart(2, "0")).concat(p.toString(16).padStart(2, "0"));
  return m === "#FFFFFF" && h.getThemeVar() || m;
});
let P = h;
const J = /* @__PURE__ */ S({
  name: "Avatar",
  props: {
    label: {
      type: String,
      required: !0
    },
    img: {
      type: String
    },
    readOnly: {
      type: Boolean,
      default: !1
    }
  },
  setup(a) {
    const t = I("custom-avatar");
    return {
      ns: t,
      renderAvatar: () => a.img ? o("img", {
        class: t.e("user-avatar"),
        src: a.img
      }, null) : o("div", {
        class: t.e("default-avatar"),
        style: "background-color: ".concat(P.calcColorPhoto(a.label))
      }, [P.calcTextPhoto(a.label)])
    };
  },
  render() {
    return o("div", {
      class: this.ns.b()
    }, [this.renderAvatar()]);
  }
});
class W extends T {
  constructor() {
    super(...arguments), d(this, "operatorMap", /* @__PURE__ */ new Map()), d(this, "avatarField", "iconurl"), d(this, "userIdField", "submitter_id"), d(this, "revTypeField", "reviewer_type"), d(this, "userInfo");
  }
  async onCreated() {
    await super.onCreated(), this.initCtrlParams(), await this.getOperatorUserList();
    const t = this.params[this.userIdField];
    if (this.operatorMap.size > 0 && t) {
      const e = this.operatorMap.get(t);
      e && e.data && e.data[this.avatarField] && (this.userInfo = e.data, Object.assign(this.userInfo, {
        avatar: this.parseAvatar(e.data[this.avatarField])
      }));
    }
  }
  /**
   * 初始化部件控件参数
   *
   * @memberof ReviewListController
   */
  initCtrlParams() {
    const { ctrlParams: t = {} } = this.model.controlParam;
    t.USERIDFIELD && (this.userIdField = t.USERIDFIELD), t.AVATARFIELD && (this.avatarField = t.AVATARFIELD), t.REVTYPEFIELD && (this.revTypeField = t.REVTYPEFIELD);
  }
  /**
   * 解析头像数据
   *
   * @param {string} avatar
   * @return {string | undefined}
   * @memberof ReviewListController
   */
  parseAvatar(t) {
    try {
      const e = JSON.parse(t);
      if (e) {
        const i = U(e) ? e[0] : e;
        return ibiz.util.file.calcFileUpDownUrl(
          this.context,
          this.params
        ).downloadUrl.replace("%fileId%", i.id);
      }
    } catch (e) {
      throw new q("头像数据解析异常");
    }
  }
  /**
   * 获取操作用户列表
   *
   * @memberof ReviewListController
   */
  async getOperatorUserList() {
    const t = await ibiz.hub.getApp(this.context.srfappid);
    let e = [];
    e = await t.codeList.get(
      "SysOperator",
      this.context,
      this.params
    ), this.operatorMap = new Map(
      e.map((i) => [i.value, i])
    );
  }
}
function z(a) {
  return typeof a == "function" || Object.prototype.toString.call(a) === "[object Object]" && !V(a);
}
const G = () => o("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  focusable: "false",
  fill: "rgb(255, 117, 117)"
}, [o("g", {
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [o("path", {
  d: "M0 8c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8zm6-3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H6z"
}, null)])]), K = () => o("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  focusable: "false"
}, [o("g", {
  id: "arrtips/play-circle-fill",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [o("path", {
  d: "M0 8c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8zm11.26.432a.5.5 0 0 0 0-.864l-4.508-2.63A.5.5 0 0 0 6 5.372v5.258a.5.5 0 0 0 .752.432l4.508-2.63z"
}, null)])]), v = /* @__PURE__ */ S({
  name: "IBizReviewListControl",
  props: {
    modelData: {
      type: Object,
      required: !0
    },
    context: {
      type: Object,
      required: !0
    },
    params: {
      type: Object,
      default: () => ({})
    },
    provider: {
      type: Object
    },
    /**
     * 部件行数据默认激活模式
     * - 0 不激活
     * - 1 单击激活
     * - 2 双击激活(默认值)
     *
     * @type {(number | 0 | 1 | 2)}
     */
    mdctrlActiveMode: {
      type: Number,
      default: void 0
    },
    /**
     * 是否为单选
     * - true 单选
     * - false 多选
     *
     * @type {(Boolean)}
     */
    singleSelect: {
      type: Boolean,
      default: void 0
    },
    isSimple: {
      type: Boolean,
      required: !1
    },
    loadDefault: {
      type: Boolean,
      default: !0
    }
  },
  setup(a) {
    const t = O((...s) => new W(...s)), e = I("control-review-".concat(t.model.controlType.toLowerCase())), {
      onPageChange: i,
      onPageRefresh: n,
      onPageSizeChange: p
    } = H(t), m = j(() => t.model.enablePagingBar === !0 ? !0 : t.state.items.length >= t.state.total || t.state.isLoading || t.state.total <= t.state.size), u = () => o("div", {
      class: e.b("custom-item")
    }, [o("div", {
      class: e.be("custom-item", "icon")
    }, [K()]), o("div", {
      class: e.be("custom-item", "caption")
    }, [y("提交评审")]), o("div", {
      class: e.be("custom-item", "avatar")
    }, [t.userInfo ? o(J, {
      label: t.userInfo.text,
      img: t.userInfo.avatar,
      readOnly: !0
    }, null) : ""])]), g = () => o("div", {
      class: [e.b("custom-item"), e.is("last-item", !0)]
    }, [o("div", {
      class: e.be("custom-item", "icon")
    }, [G()]), o("div", {
      class: e.be("custom-item", "caption")
    }, [y("完成评审")])]), b = () => o("div", {
      class: e.b("dropdown-arrow"),
      style: ""
    }, [o("div", {
      class: e.be("dropdown-arrow", "vertical-line")
    }, null), o("div", {
      class: e.be("dropdown-arrow", "arrow-down")
    }, null)]), C = (s, r) => {
      const {
        context: l,
        params: f
      } = t, F = t.state.selectedData.findIndex((E) => E.srfkey === s.srfkey), L = [e.b("item"), e.is("active", F !== -1)];
      return o(c("iBizControlShell"), {
        class: L,
        data: s,
        modelData: r,
        context: l,
        params: f,
        onClick: () => t.onRowClick(s),
        onDblclick: () => t.onDbRowClick(s)
      }, null);
    }, w = (s) => {
      const r = t.state.selectedData.findIndex((f) => f.srfkey === s.srfkey), l = [e.b("item"), e.is("active", r !== -1)];
      return o("div", {
        class: l,
        key: s.srfkey,
        onClick: () => t.onRowClick(s),
        onDblclick: () => t.onDbRowClick(s)
      }, ["".concat(_(s.srfmajortext) ? "" : s.srfmajortext)]);
    }, A = (s) => {
      const r = a.modelData.itemLayoutPanel;
      return o(c("el-collapse-item"), {
        title: s.caption,
        class: e.be("group-content", "item")
      }, {
        default: () => [s.children.length > 0 ? s.children.map((l) => r ? C(l, r) : w(l)) : o("div", {
          class: e.bem("group-content", "item", "empty")
        }, [ibiz.i18n.t("app.noData")])]
      });
    }, D = () => {
      if (t.model.enableGroup && !t.state.isSimple)
        return o(c("el-collapse"), {
          class: [e.b("group-content"), e.b("content")]
        }, {
          default: () => {
            var r;
            return [(r = t.state.groups) == null ? void 0 : r.map((l) => o("div", {
              class: [e.b("scroll-item")]
            }, [A(l)]))];
          }
        });
      const s = a.modelData.itemLayoutPanel;
      return N(o("div", {
        class: [e.b("scroll"), e.b("content")],
        "infinite-scroll-distance": 10,
        "infinite-scroll-disabled": m.value
      }, [u(), b(), t.state.items.map((r) => o("div", {
        class: [e.b("scroll-item")]
      }, [s ? C(r, s) : w(r), b()])), g()]), [[M("infinite-scroll"), () => t.loadMore()]]);
    }, x = () => {
      var s;
      const r = (s = t.model.controls) == null ? void 0 : s.find((l) => l.name === "".concat(t.model.name, "_quicktoolbar"));
      if (r)
        return o(c("iBizToolbarControl"), {
          modelData: r,
          context: t.context,
          params: t.params
        }, null);
    };
    return {
      c: t,
      ns: e,
      renderListContent: D,
      renderNoData: () => {
        let s;
        const {
          isLoaded: r
        } = t.state;
        if (r)
          return r && o(c("iBizNoData"), {
            class: e.b("content"),
            text: t.model.emptyText,
            emptyTextLanguageRes: t.model.emptyTextLanguageRes
          }, z(s = x()) ? s : {
            default: () => [s]
          });
      },
      renderBatchToolBar: () => {
        var s;
        const r = (s = t.model.controls) == null ? void 0 : s.find((l) => l.name === "".concat(t.model.name, "_batchtoolbar"));
        if (r)
          return o("div", {
            class: e.b("batchtoolbar")
          }, [o(c("iBizToolbarControl"), {
            modelData: r,
            context: t.context,
            params: t.params
          }, null)]);
      },
      onPageChange: i,
      onPageRefresh: n,
      onPageSizeChange: p
    };
  },
  render() {
    const {
      enablePagingBar: a
    } = this.c.model;
    let t = null;
    return this.c.state.isCreated && (t = [this.c.state.items.length > 0 ? this.renderListContent() : this.renderNoData(), this.renderBatchToolBar(), a ? o(c("iBizPagination"), {
      class: this.ns.e("pagination"),
      total: this.c.state.total,
      curPage: this.c.state.curPage,
      size: this.c.state.size,
      totalPages: this.c.state.totalPages,
      onChange: this.onPageChange,
      onPageSizeChange: this.onPageSizeChange,
      onPageRefresh: this.onPageRefresh
    }, null) : null]), o(c("iBizControlBase"), {
      class: [this.ns.is("enable-page", !!a)],
      controller: this.c
    }, z(t) ? t : {
      default: () => [t]
    });
  }
});
class Q {
  constructor() {
    d(this, "component", "IBizReviewListControl");
  }
}
const X = k(
  v,
  function(a) {
    a.component(v.name, v), R(
      "".concat(B.LIST, "_RENDER_REVIEW_LIST"),
      () => new Q()
    );
  }
), rt = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(a) {
    a.use(X);
  }
};
export {
  X as IBizReviewListControl,
  rt as default
};
