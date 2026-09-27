import './assets/style.css';
import './assets/style.css';
import { withInstall as L, useNamespace as U, useControlController as B } from "@ibiz-template/vue3-util";
import { registerControlProvider as _, EditFormController as z, ControlVO as k, getFormDetailProvider as x, isFormDataContainer as q, findChildFormDetails as J, ScriptFactory as K, hasDeCodeName as Q, calcDeCodeNameById as H, FormNotifyState as $, calcNavParams as W } from "@ibiz-template/runtime";
import { defineComponent as X, ref as N, watch as M, reactive as Y, h as A, resolveComponent as R, createVNode as r, createTextVNode as C, isVNode as Z } from "vue";
import { clone as I } from "lodash-es";
import { RuntimeModelError as tt } from "@ibiz-template/core";
var et = Object.defineProperty, at = (l, a, e) => a in l ? et(l, a, { enumerable: !0, configurable: !0, writable: !0, value: e }) : l[a] = e, f = (l, a, e) => (at(l, typeof a != "symbol" ? a + "" : a, e), e);
class it {
  constructor() {
    f(this, "component", "IBizFormDataComparison");
  }
}
class st extends z {
  constructor() {
    super(...arguments), f(this, "baseResData", []), f(this, "compareResData", []), f(this, "oldData", new k()), f(this, "versionData", []), f(this, "comparisonArr", {}), f(this, "gridData", []), f(this, "AllGridData", []), f(this, "removeSameGridData", []), f(this, "AlldruipartData", /* @__PURE__ */ new Map()), f(this, "druipartDataSize", 0), f(this, "newDruipartData", {});
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
      a.map(async (i) => {
        const o = await x(i, this.model);
        if (!o)
          return;
        if (e.details[i.id])
          throw new tt(
            i,
            ibiz.i18n.t(
              "runtime.controller.control.form.initializationException",
              {
                id: i.id,
                detailType: i.detailType
              }
            )
          );
        e.providers[i.id] = o;
        const n = await o.createController(
          i,
          e,
          t
        );
        if (e.details[i.id] = n, i.detailType === "FORMITEM") {
          const d = n;
          if (e.formItems.push(d), d.editorProvider) {
            const c = await d.editorProvider.createController(
              d.createEditorModel(),
              d
            );
            d.newEditor = c;
          }
        }
        if (i.detailType === "MDCTRL") {
          e.formMDCtrls.push(n);
          const d = i.id, c = await o.createController(
            { ...i, id: "new_".concat(d) },
            e,
            t
          );
          e.details["new_".concat(d)] = c, console.log("detailController", n, i), e.formMDCtrls.push(c);
        }
        if (q(i))
          return;
        const m = J(i);
        m.length && await this.initDetailControllers(
          m,
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
    var a;
    const { REQUESTMETHOD: e, REQUESTPARAMS: t, REQUESTURL: i, RESPONSEMAP: o } = (a = this.model.controlParam) == null ? void 0 : a.ctrlParams, n = e || "post", m = K.execScriptFn(
      { context: this.context, params: this.params },
      t,
      { singleRowReturn: !0 }
    ), d = await ibiz.net[n](i, {
      n_owner_id_eq: m
    }), c = JSON.parse(o), h = [];
    d.data.forEach((D) => {
      const y = {};
      for (const b in c)
        y[b] = D[c[b]];
      h.push(y);
    }), this.versionData = h;
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
      const t = this.AlldruipartData.get(e), i = t.model.xdataControlName, o = t.getController(i), { compareItem: n, compareViewFieldName: m } = t.context, { version: d } = a.context;
      let c = [];
      if (n) {
        const h = n.split(",");
        o.state.items.forEach((D) => {
          const y = [];
          h.forEach((b) => {
            D[m] && D[m][b] && y.push(D[m][b]);
          }), y.sort(), y.length > 0 && c.push(y.join("."));
        });
      } else
        c = o.state.items;
      c.sort(), a.context.version === "base" ? this.baseResData[a.context.versionItemName] = c : this.compareResData[a.context.versionItemName] = c, this.newDruipartData[a.context.versionItemName] ? Object.assign(this.newDruipartData[a.context.versionItemName], {
        [d]: c
      }) : (this.newDruipartData[a.context.versionItemName] = {}, Object.assign(this.newDruipartData[a.context.versionItemName], {
        [d]: c
      }));
    }
    if (this.druipartDataSize === this.AlldruipartData.size) {
      const t = this.duripartDifference();
      this.calcCategorduriptData(this.AllGridData, t);
      const i = I(this.AllGridData);
      this.removeSameGridData = this.removeSame(i);
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
        const i = this.caleduriptCategory(t.name, e);
        t.category = i;
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
        let i = "";
        if (t.sysPFPluginId) {
          const o = await x(
            t,
            this.model
          );
          o && (i = o.component);
        }
        e.push({
          detailType: t.detailType,
          caption: t.caption,
          name: t.codeName,
          oldItem: t,
          newItem: t,
          component: i
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
        const i = [];
        t.slot.length > 0 && t.slot.forEach((o) => {
          (o.detailType === "FORMITEM" && o.category !== "samed" || o.detailType === "MDCTRL" && o.category !== "samed" || o.detailType === "DRUIPART" && o.category !== "samed") && i.push(o);
        }), i.length > 0 && e.push({
          caption: t.caption,
          detailType: t.detailType,
          slot: i
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
    const t = [], i = [], o = [];
    for (const n in e) {
      const m = a[n], d = e[n];
      this.isFalseyButNotEmpty(m) && !this.isFalseyButNotEmpty(d) && t.push(n);
    }
    for (const n in e) {
      const m = a[n], d = e[n];
      !this.isFalseyButNotEmpty(m) && !this.isFalseyButNotEmpty(d) && this.compareObjectValues(m, d) && i.push(n);
    }
    for (const n in a)
      if (!Object.prototype.hasOwnProperty.call(e, n) || this.isFalseyButNotEmpty(e[n])) {
        const m = a[n];
        this.isFalseyButNotEmpty(m) || o.push(n);
      }
    return {
      added: t,
      modified: i,
      deleted: o
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addPrefixToKeys(a, e) {
    return Object.keys(a).reduce((t, i) => (t[e + i] = a[i], t), {});
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
    let t = "", i = "";
    const { base_version: o, compare_version: n } = this.params;
    if (t = a && a.data && a.data.baseVersion || o, i = a && a.data && a.data.compareVersion || n, this.state.isLoaded = !1, e)
      return this.copy();
    if (!Q(
      this.context,
      H(this.model.appDataEntityId)
    ))
      return this.loadDraft();
    const { context: m, params: d } = this.handlerAbilityParams(a), c = I(d);
    let h, D;
    try {
      await this.startLoading(), await this.evt.emit("onBeforeLoad", { args: c }), h = await this.service.get(
        m,
        Object.assign(c, { srfversionid: t })
      ), console.log("res", h), D = await this.service.get(
        m,
        Object.assign(c, { srfversionid: i })
      );
      const s = this.diffObjects(h.data, D.data);
      this.comparisonArr = s;
    } catch (s) {
      throw await this.evt.emit("onLoadError", { args: s }), this.actionNotification("GETERROR", {
        error: s
      }), s;
    } finally {
      await this.endLoading();
    }
    this.state.modified = !1;
    const y = I(D.data), b = this.addPrefixToKeys(y, "new_");
    this.state.data = { ...h.data, ...b }, this.baseResData = h.data, this.compareResData = D.data, this.oldData = this.data, this.formStateNotify($.LOAD), await this.evt.emit("onLoadSuccess", { args: h.data }), this.actionNotification("GETSUCCESS"), this.state.isLoaded = !0, this.AllGridData = I(this.gridData), this.calcCategoryGridData(this.AllGridData);
    const O = I(this.AllGridData);
    return this.removeSameGridData = this.removeSame(O), this.data;
  }
}
function V(l) {
  return typeof l == "function" || Object.prototype.toString.call(l) === "[object Object]" && !Z(l);
}
const S = /* @__PURE__ */ X({
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
  setup(l) {
    const a = U("form-data-comparison"), e = [], t = B((...s) => new st(...s), {
      excludePropsKeys: ["data"]
    }), i = N(""), o = N(""), n = N(!1), m = N([]), d = N([]), {
      base_version: c,
      compare_version: h
    } = l.params;
    c && (i.value = c), h && (o.value = h), M(() => i.value, () => {
      t.load({
        data: {
          baseVersion: i.value,
          compareVersion: o.value
        }
      });
    }), M(() => o.value, () => {
      t.load({
        data: {
          baseVersion: i.value,
          compareVersion: o.value
        }
      });
    }), l.isSimple && (t.evt.on("onMounted", () => {
      t.setSimpleData(l.data || {});
    }), M(() => l.data, (s) => {
      const p = s || {};
      Object.keys(t.data).find((w) => p[w] !== t.data[w]) && t.setSimpleData(p);
    }, {
      deep: !0
    })), t.evt.on("onCreated", () => {
      Object.keys(t.details).forEach((s) => {
        const p = t.details[s];
        p.state = Y(p.state);
      });
    });
    const D = (s, p, w = !1) => {
      const u = t.formItems.find((g) => g.name === s.codeName);
      let v = "";
      s.codeName && (v = p[s.codeName]);
      let T = null;
      if (u) {
        let g = u.editor;
        w && (g = u.newEditor);
        const E = {
          value: v,
          data: t.data,
          controller: g,
          readonly: !0,
          disabled: !0
        };
        if (u.editorProvider) {
          const P = R(u.editorProvider.formEditor);
          T = A(P, {
            ...E
          });
        }
      }
      return T;
    }, y = (s, p, w, u) => {
      const {
        navigateContexts: v,
        navigateParams: T
      } = s, g = {
        navContexts: v,
        navParams: T
      }, E = {
        context: w,
        params: u,
        data: p
      }, {
        resultContext: P,
        resultParams: F
      } = W(g, E), j = Object.assign(w.clone(), P, {
        currentSrfNav: s.id
      }), G = {
        ...u,
        ...F
      };
      return {
        newContext: j,
        newParams: G
      };
    }, b = (s) => {
      t.calcAlldruipartData(s.context.version, s.context.versionItemName, s.view);
    }, O = (s) => {
      t.setdruipartData(s);
    };
    return {
      baseVersion: i,
      compareVersion: o,
      switchValue: n,
      c: t,
      ns: a,
      gridData: d,
      formItems: e,
      activeNames: m,
      renderEditor: D,
      renderDruipart: (s, p, w) => {
        if (p[s.codeName] && p[s.codeName].length === 0)
          return null;
        const u = t.context.clone(), v = I(p);
        Object.assign(u, v);
        const {
          newContext: T,
          newParams: g
        } = y(s, v, u, {});
        return Object.assign(T, {
          version: w
        }, {
          versionItemName: s.codeName
        }, {
          compareItem: s.userTag2 || ""
        }, {
          compareViewFieldName: s.userTag || ""
        }), A(R("IBizViewShell"), {
          context: T,
          params: g,
          key: s.id,
          viewId: s.appViewId,
          onCreated: b,
          onDataChange: O
        });
      },
      renderMdctrl: (s, p, w, u) => {
        let v = null;
        p === "old" ? v = t.formMDCtrls.find((E) => s.codeName === E.name) : p === "new" && (v = t.formMDCtrls.find((E) => "new_".concat(s.codeName) === E.name));
        const T = I(v);
        let g = "iBizFormMDCtrl";
        return u && (g = u), A(R(g), {
          controller: T,
          modelData: T.model
        });
      }
    };
  },
  render() {
    let l, a, e;
    if (this.c.state.isLoaded)
      this.switchValue ? this.gridData = this.c.removeSameGridData : this.gridData = this.c.AllGridData;
    else
      return null;
    return r("div", {
      class: [this.ns.b()]
    }, [r("div", {
      class: this.ns.e("top-hidesame-content")
    }, [r("div", {
      class: this.ns.e("top-hidesame-content-left")
    }, [C("隐藏相同项 "), r(R("el-switch"), {
      modelValue: this.switchValue,
      "onUpdate:modelValue": (t) => this.switchValue = t
    }, null)]), r("div", {
      class: this.ns.e("top-hidesame-content-right")
    }, [r("div", {
      class: this.ns.e("top-hidesame-content-right-item")
    }, [C("新增"), r("div", {
      class: this.ns.e("top-hidesame-content-right-item-add")
    }, null)]), r("div", {
      class: this.ns.e("top-hidesame-content-right-item")
    }, [C("修改"), r("div", {
      class: this.ns.e("top-hidesame-content-right-item-change")
    }, null)]), r("div", {
      class: this.ns.e("top-hidesame-content-right-item")
    }, [C("删除"), r("div", {
      class: this.ns.e("top-hidesame-content-right-item-delete")
    }, null)])])]), r("div", {
      class: this.ns.e("top-content")
    }, [r("div", {
      class: this.ns.e("top-content-left")
    }, [r("div", {
      class: this.ns.e("top-content-left-attribute")
    }, [C("属性")]), r("div", {
      class: this.ns.e("top-content-left-version")
    }, [C("版本号")])]), r("div", {
      class: [this.ns.e("top-content-choose"), this.baseVersion !== this.compareVersion ? "modified" : ""]
    }, [r(R("el-select"), {
      modelValue: this.baseVersion,
      "onUpdate:modelValue": (t) => this.baseVersion = t,
      size: "large",
      class: this.ns.e("top-content-choose-select")
    }, V(l = this.c.versionData.map((t) => r(R("el-option"), {
      key: t.id,
      label: t.label,
      value: t.id
    }, null))) ? l : {
      default: () => [l]
    })]), r("div", {
      class: [this.ns.e("top-content-choose"), this.baseVersion !== this.compareVersion ? "modified" : ""]
    }, [r(R("el-select"), {
      modelValue: this.compareVersion,
      "onUpdate:modelValue": (t) => this.compareVersion = t,
      size: "large",
      class: this.ns.e("top-content-choose-select")
    }, V(a = this.c.versionData.map((t) => r(R("el-option"), {
      key: t.id,
      label: t.label,
      value: t.id
    }, null))) ? a : {
      default: () => [a]
    })])]), r(R("el-collapse"), {
      modelValue: this.activeNames,
      "onUpdate:modelValue": (t) => this.activeNames = t
    }, V(e = this.gridData.map((t) => {
      if (t.detailType === "FORMITEM")
        return r("div", {
          class: [this.ns.e("mid-content"), t.category]
        }, [r("div", {
          class: this.ns.e("mid-content-left")
        }, [t.caption]), r("div", {
          class: this.ns.e("mid-content-item")
        }, [this.renderEditor(t.oldItem, this.c.baseResData)]), r("div", {
          class: this.ns.e("mid-content-item")
        }, [this.renderEditor(t.newItem, this.c.compareResData)])]);
      if (t.detailType === "GROUPPANEL")
        return r(R("el-collapse-item"), {
          class: this.ns.e("collapse-item"),
          title: t.caption
        }, {
          default: () => [t.slot && t.slot.map((i) => r("div", {
            class: [this.ns.e("mid-content"), "slot", i.category]
          }, [r("div", {
            class: [this.ns.e("mid-content-left"), "slot"]
          }, [i.caption]), r("div", {
            class: this.ns.e("mid-content-item")
          }, [i.detailType === "FORMITEM" && this.renderEditor(i.oldItem, this.c.baseResData), i.detailType === "DRUIPART" && this.renderDruipart(i.oldItem, this.c.baseResData, "base"), i.detailType === "MDCTRL" && this.renderMdctrl(i.oldItem, "old", this.c.baseResData, i.component)]), r("div", {
            class: this.ns.e("mid-content-item")
          }, [i.detailType === "FORMITEM" && this.renderEditor(i.newItem, this.c.compareResData, !0), i.detailType === "DRUIPART" && this.renderDruipart(i.newItem, this.c.compareResData, "compare"), i.detailType === "MDCTRL" && this.renderMdctrl(i.newItem, "new", this.c.compareResData, i.component)])]))]
        });
    })) ? e : {
      default: () => [e]
    })]);
  }
}), ot = L(
  S,
  // eslint-disable-next-line func-names
  function(l) {
    l.component(S.name, S), _(
      "EDITFORM_RENDER_FORM_DATA_COMPARISON",
      () => new it()
    );
  }
), mt = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(l) {
    l.use(ot);
  }
};
export {
  ot as IBizFormDataComparison,
  mt as default
};
