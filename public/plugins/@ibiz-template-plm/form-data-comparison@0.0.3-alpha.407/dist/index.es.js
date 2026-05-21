import './style.css';
var j = Object.defineProperty;
var B = (d, m, a) => m in d ? j(d, m, { enumerable: !0, configurable: !0, writable: !0, value: a }) : d[m] = a;
var y = (d, m, a) => (B(d, typeof m != "symbol" ? m + "" : m, a), a);
import { useNamespace as z, useControlController as k, withInstall as $ } from "@ibiz-template/vue3-util";
import { EditFormController as q, ControlVO as J, getFormDetailProvider as G, isFormDataContainer as Q, findChildFormDetails as K, ScriptFactory as H, hasDeCodeName as W, calcDeCodeNameById as X, FormNotifyState as Y, calcNavParams as Z, registerControlProvider as ee } from "@ibiz-template/runtime";
import { defineComponent as te, ref as b, watch as M, reactive as ae, createVNode as i, createTextVNode as N, resolveComponent as E, isVNode as se, h as O } from "vue";
import { clone as P } from "lodash-es";
import { RuntimeModelError as oe } from "@ibiz-template/core";
class ie {
  constructor() {
    y(this, "component", "IBizFormDataComparison");
  }
}
class re extends q {
  constructor() {
    super(...arguments);
    /**
     *   基础数据
     *
     * @author fangZhiHao
     * @date 2024-04-26 17:04:49
     * @type {IData}
     */
    y(this, "baseResData", []);
    /**
     *   对比数据
     *
     * @author fangZhiHao
     * @date 2024-04-26 17:04:49
     * @type {IData}
     */
    y(this, "compareResData", []);
    /**
     * 表单旧数据
     *
     * @author zk
     * @date 2023-12-20 11:12:43
     * @protected
     * @type {IData}
     * @memberof FormController
     */
    y(this, "oldData", new J());
    /**
     * version数据
     *
     * @author fangZhiHao
     * @date 2024-04-26 16:04:37
     * @type {IData[]}
     */
    y(this, "versionData", []);
    /**
     *  对比数据
     *
     * @author fangZhiHao
     * @date 2024-04-26 16:04:37
     * @type {IData[]}
     */
    y(this, "comparisonArr", {});
    /**
     *  基础表格数据
     *
     * @author fangZhiHao
     * @date 2024-05-06 11:05:57
     * @type {IData[]}
     */
    y(this, "gridData", []);
    /**
     *  展示完全数据
     *
     * @author fangZhiHao
     * @date 2024-05-06 11:05:04
     * @type {IData[]}
     */
    y(this, "AllGridData", []);
    /**
     *  去除相同数据
     *
     * @author fangZhiHao
     * @date 2024-05-06 11:05:15
     * @type {IData[]}
     */
    y(this, "removeSameGridData", []);
    /**
     *  关系界面数据
     *
     * @author fangZhiHao
     * @date 2024-04-30 10:04:33
     * @type {IData}
     */
    y(this, "AlldruipartData", /* @__PURE__ */ new Map());
    /**
     *  关系界面数据长度
     *
     * @author fangZhiHao
     * @date 2024-05-06 11:05:56
     * @type {number}
     */
    y(this, "druipartDataSize", 0);
    /**
     *   关系界面实际数据
     *
     * @author fangZhiHao
     * @date 2024-05-06 11:05:13
     * @type {IData}
     */
    y(this, "newDruipartData", {});
  }
  async onMounted() {
    await super.onMounted(), await this.getVersion(), this.model.deformPages && this.model.deformPages[0].deformDetails && await this.calcGridData(this.model.deformPages[0].deformDetails), !this.state.isSimple && this.state.loadDefault && this.load();
  }
  /**
   * 初始化表单成员控制器
   *
   * @author lxm
   * @date 2022-08-24 21:08:48
   * @protected
   */
  async initDetailControllers(a = this.model.deformPages, e = this, t = void 0) {
    await Promise.all(
      a.map(async (s) => {
        const r = await G(s, this.model);
        if (!r)
          return;
        if (e.details[s.id])
          throw new oe(
            s,
            ibiz.i18n.t(
              "runtime.controller.control.form.initializationException",
              {
                id: s.id,
                detailType: s.detailType
              }
            )
          );
        e.providers[s.id] = r;
        const n = await r.createController(
          s,
          e,
          t
        );
        if (e.details[s.id] = n, s.detailType === "FORMITEM") {
          const l = n;
          if (e.formItems.push(l), l.editorProvider) {
            const c = await l.editorProvider.createController(
              l.createEditorModel(),
              l
            );
            l.newEditor = c;
          }
        }
        if (s.detailType === "MDCTRL") {
          e.formMDCtrls.push(n);
          const l = s.id, c = await r.createController(
            { ...s, id: "new_".concat(l) },
            e,
            t
          );
          e.details["new_".concat(l)] = c, console.log("detailController", n, s), e.formMDCtrls.push(c);
        }
        if (Q(s))
          return;
        const p = K(s);
        p.length && await this.initDetailControllers(
          p,
          e,
          n
        );
      })
    );
  }
  /**
   *   获取版本数据
   *
   * @author fangZhiHao
   * @date 2024-05-06 11:05:24
   */
  async getVersion() {
    var g;
    const { REQUESTMETHOD: a, REQUESTPARAMS: e, REQUESTURL: t, RESPONSEMAP: s } = (g = this.model.controlParam) == null ? void 0 : g.ctrlParams, r = a || "post", n = H.execScriptFn(
      { context: this.context, params: this.params },
      e,
      { singleRowReturn: !0 }
    ), p = await ibiz.net[r](t, {
      n_owner_id_eq: n
    }), l = JSON.parse(s), c = [];
    p.data.forEach((f) => {
      const D = {};
      for (const R in l)
        D[R] = f[l[R]];
      c.push(D);
    }), this.versionData = c;
  }
  /**
   *  设置关系界面数据
   *
   * @author fangZhiHao
   * @date 2024-04-30 10:04:15
   * @param {string} version
   * @param {string} name
   * @param {IData} data
   */
  calcAlldruipartData(a, e, t) {
    this.AlldruipartData.set("".concat(a).concat(e), t);
  }
  /**
   *  设置关系界面数据
   *
   * @author fangZhiHao
   * @date 2024-05-06 11:05:38
   * @param {DataChangeEvent} args
   */
  setdruipartData(a) {
    const e = "".concat(a.context.version).concat(a.context.versionItemName);
    if (this.AlldruipartData.get(e)) {
      this.druipartDataSize += 1;
      const t = this.AlldruipartData.get(e), s = t.model.xdataControlName, r = t.getController(s), { compareItem: n, compareViewFieldName: p } = t.context, { version: l } = a.context;
      let c = [];
      if (n) {
        const g = n.split(",");
        r.state.items.forEach((f) => {
          const D = [];
          g.forEach((R) => {
            f[p] && f[p][R] && D.push(f[p][R]);
          }), D.sort(), D.length > 0 && c.push(D.join("."));
        });
      } else
        c = r.state.items;
      c.sort(), a.context.version === "base" ? this.baseResData[a.context.versionItemName] = c : this.compareResData[a.context.versionItemName] = c, this.newDruipartData[a.context.versionItemName] ? Object.assign(this.newDruipartData[a.context.versionItemName], {
        [l]: c
      }) : (this.newDruipartData[a.context.versionItemName] = {}, Object.assign(this.newDruipartData[a.context.versionItemName], {
        [l]: c
      }));
    }
    if (this.druipartDataSize === this.AlldruipartData.size) {
      const t = this.duripartDifference();
      this.calcCategorduriptData(this.AllGridData, t);
      const s = P(this.AllGridData);
      this.removeSameGridData = this.removeSame(s);
    }
  }
  /**
   * 计算关系界面的差异
   *
   * @author fangZhiHao
   * @date 2024-05-06 11:05:15
   * @return {*}
   */
  duripartDifference() {
    const a = {}, e = {};
    for (const t in this.newDruipartData)
      Object.prototype.hasOwnProperty.call(this.newDruipartData, t) && (a[t] = this.newDruipartData[t].base, e[t] = this.newDruipartData[t].compare);
    return this.diffObjects(a, e);
  }
  /**
   *  计算duriput样式
   *
   * @author fangZhiHao
   * @date 2024-04-26 18:04:56
   * @param {IData[]} data
   */
  calcCategorduriptData(a, e) {
    a.forEach((t) => {
      if (t.detailType === "DRUIPART") {
        const s = this.caleduriptCategory(t.name, e);
        t.category = s;
      }
      t.detailType === "GROUPPANEL" && t.slot.length > 0 && this.calcCategorduriptData(t.slot, e);
    });
  }
  /**
   *  计算关系界面差异
   *
   * @author fangZhiHao
   * @date 2024-05-06 11:05:45
   * @param {string} codeName
   * @param {IData} result
   * @return {*}
   */
  caleduriptCategory(a, e) {
    return e.added.includes(a) ? "added" : e.modified.includes(a) ? "modified" : e.deleted.includes(a) ? "deleted" : "samed";
  }
  /**
   *  计算属性类别
   *
   * @author fangZhiHao
   * @date 2024-04-26 18:04:42
   * @param {string} codeName
   * @return {*}
   */
  caleCategory(a) {
    return this.comparisonArr.added.includes(a) ? "added" : this.comparisonArr.modified.includes(a) ? "modified" : this.comparisonArr.deleted.includes(a) ? "deleted" : "samed";
  }
  /**
   *  计算表单分组
   *
   * @author fangZhiHao
   * @date 2024-04-26 18:04:07
   * @param {IDEFormDetail[]} data
   * @return {*}
   */
  calcGroupPanel(a) {
    const e = [];
    return a.forEach(async (t) => {
      if (t.hidden !== !0 && (t.detailType === "FORMITEM" && e.push({
        detailType: t.detailType,
        caption: t.caption,
        name: t.codeName,
        oldItem: t,
        newItem: t
      }), t.detailType === "DRUIPART" && e.push({
        detailType: t.detailType,
        caption: t.caption,
        name: t.codeName,
        oldItem: t,
        newItem: t
      }), t.detailType === "MDCTRL")) {
        let s = "";
        if (t.sysPFPluginId) {
          const r = await G(
            t,
            this.model
          );
          r && (s = r.component);
        }
        e.push({
          detailType: t.detailType,
          caption: t.caption,
          name: t.codeName,
          oldItem: t,
          newItem: t,
          component: s
        });
      }
    }), e;
  }
  /**
   *  计算表格
   *
   * @author fangZhiHao
   * @date 2024-04-26 18:04:07
   * @param {IDEFormDetail[]} data
   * @return {*}
   */
  calcGridData(a) {
    a.forEach(async (e) => {
      if (e.hidden !== !0) {
        if (e.detailType === "FORMITEM" && this.gridData.push({
          detailType: e.detailType,
          caption: e.caption,
          name: e.codeName,
          oldItem: e,
          newItem: e
        }), e.detailType === "GROUPPANEL") {
          let t = null;
          e.deformDetails && (t = await this.calcGroupPanel(e.deformDetails)), this.gridData.push({
            detailType: e.detailType,
            caption: e.caption,
            slot: t
          });
        }
        e.detailType === "DRUIPART" && this.gridData.push({
          detailType: e.detailType,
          caption: e.caption,
          name: e.codeName,
          oldItem: e,
          newItem: e
        });
      }
    });
  }
  /**
   *  计算类别样式
   *
   * @author fangZhiHao
   * @date 2024-04-26 18:04:56
   * @param {IData[]} data
   */
  calcCategoryGridData(a) {
    a.forEach((e) => {
      if (e.detailType === "FORMITEM") {
        const t = this.caleCategory(e.name);
        e.category = t;
      }
      if (e.detailType === "GROUPPANEL" && e.slot.length > 0 && this.calcCategoryGridData(e.slot), e.detailType === "MDCTRL") {
        const t = this.caleCategory(e.name);
        e.category = t;
      }
    });
  }
  /**
   *  去除相同项
   *
   * @author fangZhiHao
   * @date 2024-04-26 18:04:56
   * @param {IData[]} data
   */
  removeSame(a) {
    const e = [];
    return a.forEach((t) => {
      if (t.detailType === "FORMITEM" && t.category !== "samed" && e.push(t), t.detailType === "GROUPPANEL") {
        const s = [];
        t.slot.length > 0 && t.slot.forEach((r) => {
          (r.detailType === "FORMITEM" && r.category !== "samed" || r.detailType === "MDCTRL" && r.category !== "samed" || r.detailType === "DRUIPART" && r.category !== "samed") && s.push(r);
        }), s.length > 0 && e.push({
          caption: t.caption,
          detailType: t.detailType,
          slot: s
        });
      }
    }), e;
  }
  isFalseyButNotEmpty(a) {
    return a == null || typeof a == "string" && a === "" || Array.isArray(a) && a.length === 0 || typeof a == "object" && Object.keys(a).length === 0;
  }
  compareObjectValues(a, e) {
    return JSON.stringify(a) !== JSON.stringify(e);
  }
  /**
   *  判断两个对象的差异
   *  新增属性：在新对象中存在属性且属性值不能是falsey值（数字 0，布尔值 false 除外），不为空数组，不为空对象，且该属性在旧对象中不存在或其值为falsey值、空数组、空对象。
   *  修改属性：在新旧对象中都存在，且新旧值均不为falsey值（数字 0，布尔值 false 除外）、空对象、空数组，且值发生了变化。注意，对于引用对象，使用JSON.stringify进行字符串化对比。
   *  删除属性：在旧对象中存在且其值不是falsey值、空数组、空对象，但在新对象中不存在或其值为falsey值、空数组、空对象。
   *
   * @author fangZhiHao
   * @date 2024-04-26 13:04:59
   * @param {IData} oldObj
   * @param {IData} newObj
   * @return {*}
   */
  diffObjects(a, e) {
    const t = [], s = [], r = [];
    for (const n in e) {
      const p = a[n], l = e[n];
      this.isFalseyButNotEmpty(p) && !this.isFalseyButNotEmpty(l) && t.push(n);
    }
    for (const n in e) {
      const p = a[n], l = e[n];
      !this.isFalseyButNotEmpty(p) && !this.isFalseyButNotEmpty(l) && this.compareObjectValues(p, l) && s.push(n);
    }
    for (const n in a)
      if (!Object.prototype.hasOwnProperty.call(e, n) || this.isFalseyButNotEmpty(e[n])) {
        const p = a[n];
        this.isFalseyButNotEmpty(p) || r.push(n);
      }
    return {
      added: t,
      modified: s,
      deleted: r
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addPrefixToKeys(a, e) {
    return Object.keys(a).reduce((t, s) => (t[e + s] = a[s], t), {});
  }
  /**
   * 部件加载数据行为
   *
   * @author lxm
   * @date 2022-08-19 14:08:50
   */
  async load(a) {
    this.druipartDataSize = 0, this.newDruipartData = {}, this.AlldruipartData = /* @__PURE__ */ new Map();
    const e = this.params.srfcopymode;
    let t = "", s = "";
    const { base_version: r, compare_version: n } = this.params;
    if (t = a && a.data && a.data.baseVersion || r, s = a && a.data && a.data.compareVersion || n, this.state.isLoaded = !1, e)
      return this.copy();
    if (!W(
      this.context,
      X(this.model.appDataEntityId)
    ))
      return this.loadDraft();
    const { context: l, params: c } = this.handlerAbilityParams(a), g = P(c);
    let f, D;
    try {
      await this.startLoading(), await this.evt.emit("onBeforeLoad", { args: g }), f = await this.service.get(
        l,
        Object.assign(g, { srfversionid: t })
      ), console.log("res", f), D = await this.service.get(
        l,
        Object.assign(g, { srfversionid: s })
      );
      const o = this.diffObjects(f.data, D.data);
      this.comparisonArr = o;
    } catch (o) {
      throw await this.evt.emit("onLoadError", { args: o }), this.actionNotification("GETERROR", {
        error: o
      }), o;
    } finally {
      await this.endLoading();
    }
    this.state.modified = !1;
    const R = P(D.data), S = this.addPrefixToKeys(R, "new_");
    this.state.data = { ...f.data, ...S }, this.baseResData = f.data, this.compareResData = D.data, this.oldData = this.data, this.formStateNotify(Y.LOAD), await this.evt.emit("onLoadSuccess", { args: f.data }), this.actionNotification("GETSUCCESS"), this.state.isLoaded = !0, this.AllGridData = P(this.gridData), this.calcCategoryGridData(this.AllGridData);
    const F = P(this.AllGridData);
    return this.removeSameGridData = this.removeSame(F), this.data;
  }
}
function x(d) {
  return typeof d == "function" || Object.prototype.toString.call(d) === "[object Object]" && !se(d);
}
const A = /* @__PURE__ */ te({
  name: "IBizFormDataComparison",
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
    isSimple: {
      type: Boolean,
      required: !1
    },
    data: {
      type: Object,
      required: !1
    },
    loadDefault: {
      type: Boolean,
      default: !0
    }
  },
  setup(d) {
    const m = z("form-data-comparison"), a = [], e = k((...o) => new re(...o), {
      excludePropsKeys: ["data"]
    }), t = b(""), s = b(""), r = b(!1), n = b([]), p = b([]), {
      base_version: l,
      compare_version: c
    } = d.params;
    l && (t.value = l), c && (s.value = c), M(() => t.value, () => {
      e.load({
        data: {
          baseVersion: t.value,
          compareVersion: s.value
        }
      });
    }), M(() => s.value, () => {
      e.load({
        data: {
          baseVersion: t.value,
          compareVersion: s.value
        }
      });
    }), d.isSimple && (e.evt.on("onMounted", () => {
      e.setSimpleData(d.data || {});
    }), M(() => d.data, (o) => {
      const u = o || {};
      Object.keys(e.data).find((h) => u[h] !== e.data[h]) && e.setSimpleData(u);
    }, {
      deep: !0
    })), e.evt.on("onCreated", () => {
      Object.keys(e.details).forEach((u) => {
        const v = e.details[u];
        v.state = ae(v.state);
      });
    });
    const g = (o, u, v = !1) => {
      const h = e.formItems.find((w) => w.name === o.codeName);
      let T = "";
      o.codeName && (T = u[o.codeName]);
      let C = null;
      if (h) {
        let w = h.editor;
        v && (w = h.newEditor);
        const I = {
          value: T,
          data: e.data,
          controller: w,
          readonly: !0,
          disabled: !0
        };
        if (h.editorProvider) {
          const V = E(h.editorProvider.formEditor);
          C = O(V, {
            ...I
          });
        }
      }
      return C;
    }, f = (o, u, v, h) => {
      const {
        navigateContexts: T,
        navigateParams: C
      } = o, w = {
        navContexts: T,
        navParams: C
      }, I = {
        context: v,
        params: h,
        data: u
      }, {
        resultContext: V,
        resultParams: L
      } = Z(w, I), _ = Object.assign(v.clone(), V, {
        currentSrfNav: o.id
      }), U = {
        ...h,
        ...L
      };
      return {
        newContext: _,
        newParams: U
      };
    }, D = (o) => {
      e.calcAlldruipartData(o.context.version, o.context.versionItemName, o.view);
    }, R = (o) => {
      e.setdruipartData(o);
    };
    return {
      baseVersion: t,
      compareVersion: s,
      switchValue: r,
      c: e,
      ns: m,
      gridData: p,
      formItems: a,
      activeNames: n,
      renderEditor: g,
      renderDruipart: (o, u, v) => {
        if (u[o.codeName] && u[o.codeName].length === 0)
          return null;
        const h = e.context.clone(), T = P(u);
        Object.assign(h, T);
        const {
          newContext: C,
          newParams: w
        } = f(o, T, h, {});
        return Object.assign(C, {
          version: v
        }, {
          versionItemName: o.codeName
        }, {
          compareItem: o.userTag2 || ""
        }, {
          compareViewFieldName: o.userTag || ""
        }), O(E("IBizViewShell"), {
          context: C,
          params: w,
          key: o.id,
          viewId: o.appViewId,
          onCreated: D,
          onDataChange: R
        });
      },
      renderMdctrl: (o, u, v, h) => {
        let T = null;
        u === "old" ? T = e.formMDCtrls.find((I) => o.codeName === I.name) : u === "new" && (T = e.formMDCtrls.find((I) => "new_".concat(o.codeName) === I.name));
        const C = P(T);
        let w = "iBizFormMDCtrl";
        return h && (w = h), O(E(w), {
          controller: C,
          modelData: C.model
        });
      }
    };
  },
  render() {
    let d, m, a;
    if (this.c.state.isLoaded)
      this.switchValue ? this.gridData = this.c.removeSameGridData : this.gridData = this.c.AllGridData;
    else
      return null;
    return i("div", {
      class: [this.ns.b()]
    }, [i("div", {
      class: this.ns.e("top-hidesame-content")
    }, [i("div", {
      class: this.ns.e("top-hidesame-content-left")
    }, [N("隐藏相同项 "), i(E("el-switch"), {
      modelValue: this.switchValue,
      "onUpdate:modelValue": (e) => this.switchValue = e
    }, null)]), i("div", {
      class: this.ns.e("top-hidesame-content-right")
    }, [i("div", {
      class: this.ns.e("top-hidesame-content-right-item")
    }, [N("新增"), i("div", {
      class: this.ns.e("top-hidesame-content-right-item-add")
    }, null)]), i("div", {
      class: this.ns.e("top-hidesame-content-right-item")
    }, [N("修改"), i("div", {
      class: this.ns.e("top-hidesame-content-right-item-change")
    }, null)]), i("div", {
      class: this.ns.e("top-hidesame-content-right-item")
    }, [N("删除"), i("div", {
      class: this.ns.e("top-hidesame-content-right-item-delete")
    }, null)])])]), i("div", {
      class: this.ns.e("top-content")
    }, [i("div", {
      class: this.ns.e("top-content-left")
    }, [i("div", {
      class: this.ns.e("top-content-left-attribute")
    }, [N("属性")]), i("div", {
      class: this.ns.e("top-content-left-version")
    }, [N("版本号")])]), i("div", {
      class: [this.ns.e("top-content-choose"), this.baseVersion !== this.compareVersion ? "modified" : ""]
    }, [i(E("el-select"), {
      modelValue: this.baseVersion,
      "onUpdate:modelValue": (e) => this.baseVersion = e,
      size: "large",
      class: this.ns.e("top-content-choose-select")
    }, x(d = this.c.versionData.map((e) => i(E("el-option"), {
      key: e.id,
      label: e.label,
      value: e.id
    }, null))) ? d : {
      default: () => [d]
    })]), i("div", {
      class: [this.ns.e("top-content-choose"), this.baseVersion !== this.compareVersion ? "modified" : ""]
    }, [i(E("el-select"), {
      modelValue: this.compareVersion,
      "onUpdate:modelValue": (e) => this.compareVersion = e,
      size: "large",
      class: this.ns.e("top-content-choose-select")
    }, x(m = this.c.versionData.map((e) => i(E("el-option"), {
      key: e.id,
      label: e.label,
      value: e.id
    }, null))) ? m : {
      default: () => [m]
    })])]), i(E("el-collapse"), {
      modelValue: this.activeNames,
      "onUpdate:modelValue": (e) => this.activeNames = e
    }, x(a = this.gridData.map((e) => {
      if (e.detailType === "FORMITEM")
        return i("div", {
          class: [this.ns.e("mid-content"), e.category]
        }, [i("div", {
          class: this.ns.e("mid-content-left")
        }, [e.caption]), i("div", {
          class: this.ns.e("mid-content-item")
        }, [this.renderEditor(e.oldItem, this.c.baseResData)]), i("div", {
          class: this.ns.e("mid-content-item")
        }, [this.renderEditor(e.newItem, this.c.compareResData)])]);
      if (e.detailType === "GROUPPANEL")
        return i(E("el-collapse-item"), {
          class: this.ns.e("collapse-item"),
          title: e.caption
        }, {
          default: () => [e.slot && e.slot.map((t) => i("div", {
            class: [this.ns.e("mid-content"), "slot", t.category]
          }, [i("div", {
            class: [this.ns.e("mid-content-left"), "slot"]
          }, [t.caption]), i("div", {
            class: this.ns.e("mid-content-item")
          }, [t.detailType === "FORMITEM" && this.renderEditor(t.oldItem, this.c.baseResData), t.detailType === "DRUIPART" && this.renderDruipart(t.oldItem, this.c.baseResData, "base"), t.detailType === "MDCTRL" && this.renderMdctrl(t.oldItem, "old", this.c.baseResData, t.component)]), i("div", {
            class: this.ns.e("mid-content-item")
          }, [t.detailType === "FORMITEM" && this.renderEditor(t.newItem, this.c.compareResData, !0), t.detailType === "DRUIPART" && this.renderDruipart(t.newItem, this.c.compareResData, "compare"), t.detailType === "MDCTRL" && this.renderMdctrl(t.newItem, "new", this.c.compareResData, t.component)])]))]
        });
    })) ? a : {
      default: () => [a]
    })]);
  }
}), ne = $(
  A,
  // eslint-disable-next-line func-names
  function(d) {
    d.component(A.name, A), ee(
      "EDITFORM_RENDER_FORM_DATA_COMPARISON",
      () => new ie()
    );
  }
), me = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(d) {
    d.use(ne);
  }
};
export {
  ne as IBizFormDataComparison,
  me as default
};
