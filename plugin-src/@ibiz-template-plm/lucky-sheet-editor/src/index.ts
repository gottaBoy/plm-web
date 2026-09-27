import './style.css';
var B = Object.defineProperty;
var M = (i, e, t) => e in i ? B(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var C = (i, e, t) => (M(i, typeof e != "symbol" ? e + "" : e, t), t);
import { EditorController as F, PluginStaticResource as J, registerEditorProvider as V } from "@ibiz-template/runtime";
import { getInputProps as U, getEditorEmits as W, useNamespace as Y, withInstall as $ } from "@ibiz-template/vue3-util";
import { createVNode as d, defineComponent as G, ref as w, watch as q, onMounted as K, onBeforeUnmount as _, withDirectives as Q, resolveDirective as X } from "vue";
import { createUUID as Z } from "qx-util";
class ee extends F {
}
class te {
  constructor() {
    C(this, "formEditor", "IBizLuckySheet");
    C(this, "gridEditor", "IBizLuckySheet");
  }
  async createController(e, t) {
    const s = new ee(e, t);
    return await s.init(), s;
  }
}
const k = new J(import.meta.url);
class o {
  /**
   * @description 获取Luckysheet对象
   * @static
   * @return {*}  {*}
   * @memberof SheetUtil
   */
  static getLuckySheet() {
    return window.luckysheet;
  }
  /**
   * 动态加载脚本
   *
   * @static
   * @return {*}
   * @memberof SheetUtil
   */
  static loadScript(e) {
    return new Promise((t, s) => {
      const a = document.createElement("script");
      a.src = e, a.onload = t, a.onerror = s, document.head.appendChild(a);
    });
  }
  /**
   * 动态加载样式
   *
   * @static
   * @return {*}
   * @memberof SheetUtil
   */
  static loadStyle(e) {
    return new Promise((t, s) => {
      const a = document.createElement("link");
      a.rel = "stylesheet", a.href = e, a.onload = t, a.onerror = s, document.head.appendChild(a);
    });
  }
  /**
   * 加载LuckySheet
   *
   * @static
   * @return {*}
   * @memberof SheetUtil
   */
  static loadLuckySheet() {
    return new Promise((e, t) => {
      if (this.getLuckySheet())
        e();
      else {
        const a = [
          this.loadStyle(
            k.dir("assets/luckysheet/plugins/css/pluginsCss.css")
          ),
          this.loadStyle(k.dir("assets/luckysheet/plugins/plugins.css")),
          this.loadStyle(k.dir("assets/luckysheet/css/luckysheet.css")),
          this.loadStyle(
            k.dir("assets/luckysheet/assets/iconfont/iconfont.css")
          ),
          this.loadScript(
            k.dir("assets/luckysheet/plugins/js/plugin.js")
          ),
          this.loadScript(k.dir("assets/luckysheet/luckysheet.umd.js"))
        ];
        Promise.all(a).then(() => {
          e();
        }).catch(() => {
          ibiz.message.error(
            "加载luckySheet静态资源失败,请确认静态资源是否存在！"
          ), t();
        });
      }
    });
  }
  /**
   * 更新Luckysheet
   *
   * @static
   * @memberof SheetUtil
   */
  static updateSheet() {
    const e = this.getLuckySheet(), t = this.getSheetData();
    e && t && e.updataSheet(t);
  }
  /**
   * @description 获取Luckysheet当前工作表
   * @return {*}
   * @memberof SheetUtil
   */
  static getSheet() {
    return window.luckysheet.getSheet();
  }
  /**
   * @description 创建luckysheet
   * @static
   * @param {*} options luckysheet配置
   * @memberof SheetUtil
   */
  static create(e) {
    const t = this.getLuckySheet();
    t && e && t.create(e);
  }
  /**
   * 初始化分页器
   *
   * @static
   * @param {*} config
   * @memberof SheetUtil
   */
  static pagerInit(e) {
    const t = this.getLuckySheet();
    t && t.pagerInit(e);
  }
  /**
   * 退出编辑模式
   *
   * @static
   * @return {*}
   * @memberof SheetUtil
   */
  static exitEditMode() {
    const e = this.getLuckySheet();
    if (e)
      return e.exitEditMode();
  }
  /**
   * @description 销毁
   * @static
   * @memberof SheetUtil
   */
  static destroy() {
    const e = this.getLuckySheet();
    e && e.destroy();
  }
  /**
   * @description 刷新
   * @static
   * @memberof SheetUtil
   */
  static refresh() {
    const e = this.getLuckySheet();
    e && e.refresh();
  }
  /**
   * @description 撤销
   * @static
   * @memberof SheetUtil
   */
  static undo() {
    const e = this.getLuckySheet();
    e && e.undo();
  }
  /**
   * @description 获取报表数据
   * @static
   * @memberof SheetUtil
   */
  static getSheetData() {
    const e = this.getLuckySheet();
    if (e)
      return e.getSheetData();
  }
  /**
   * @description 获取报表索引
   * @static
   * @memberof SheetUtil
   */
  static getSheetIndex(e) {
    const t = this.getLuckySheet();
    if (t)
      return t;
  }
  /**
   * @description 获取报表索引
   * @static
   * @memberof SheetUtil
   */
  static transToCellData(e) {
    const t = this.getLuckySheet();
    if (t)
      return t.transToCellData(e);
  }
  /**
   * 获取表格数据
   *
   * @static
   * @return {*}
   * @memberof SheetUtil
   */
  static getGridData() {
    let e = [];
    const t = this.getLuckySheet();
    return t && (e = t.getSheetData().map((a) => a.map((c) => c ? c.v : null))), e;
  }
  /**
   * @description 设置工作表配置
   * @param {*} config
   * @memberof SheetUtil
   */
  static setConfig(e, t = !1) {
    const s = this.getLuckySheet();
    if (t) {
      const a = Object.assign(s.getConfig(), e);
      s.setConfig(a);
    } else
      s.setConfig(e);
  }
  /**
   * @description 获取当前工作表配置
   * @static
   * @return {*}
   * @memberof SheetUtil
   */
  static getConfig() {
    const e = this.getLuckySheet();
    if (e)
      return e.getConfig();
  }
  /**
   * 设置单元格值
   *
   * @static
   * @param {number} row 行
   * @param {number} col 列
   * @param {*} value 单元格值
   * @param {boolean} [isRefresh=false] 是否刷新界面；默认为true；用于多个单元格赋值时候控制节流，前面单元格赋值的时候应设置为 false，最后一个单元格赋值时设置为true
   * @memberof SheetUtil
   */
  static setCellValue(e, t, s, a = !1) {
    const c = this.getLuckySheet();
    c && c.setCellValue(e, t, s, { isRefresh: a });
  }
  /**
   * @description 指定工作表选区是否高亮
   * @static
   * @param {*} range 选区
   * @param {*} [opt] 配置 { show: boolean, order: number, success: Function }
   * @memberof SheetUtil
   */
  static setRangeShow(e, t) {
    const s = this.getLuckySheet();
    s && s.setRangeShow(e, t);
  }
  /**
   * @description 获取列宽度
   * @static
   * @param {IParams[]} columnInfo 列下标数组
   * @param {*} [opt]
   * @memberof SheetUtil
   */
  static getColumnWidth(e, t) {
    const s = this.getLuckySheet();
    if (s && e.length > 0)
      return s.getColumnWidth(e, t);
  }
  /**
   * @description 获取行高度
   * @static
   * @param {IParams[]} rowInfo 行下标数组
   * @param {*} [opt]
   * @memberof SheetUtil
   */
  static getRowHeight(e, t) {
    const s = this.getLuckySheet();
    if (s && e.length > 0)
      return s.getRowHeight(e, t);
  }
  /**
   * @description 获取默认行高
   * @static
   * @memberof SheetUtil
   */
  static getDefaultRowHeight() {
    const e = this.getLuckySheet();
    return e ? e.getDefaultRowHeight() : 20;
  }
  /**
   * @description 清空所有
   * @static
   * @memberof SheetUtil
   */
  static clearAll() {
    const e = this.getLuckySheet();
    if (e) {
      const t = o.getTotalRow(), s = o.getTotalColumn();
      e.clearRange({
        range: { row: [0, t - 1], column: [0, s - 1] }
      });
    }
  }
  /**
   * @description 获取元素
   * @static
   * @param {string} tag 元素标识
   * @return {*}
   * @memberof SheetUtil
   */
  static getElement(e) {
    return window.$("".concat(e));
  }
  /**
   * 设置列
   *
   * @param {IParams} sheetOps
   * @param {IParams} columnOpt
   * @memberof SheetUtil
   */
  static setColumn(e, t) {
    const s = e.data[0];
    Object.assign(s, t);
  }
  /**
   * 设置头部单元格数据
   *
   * @param {IParams} sheetOps
   * @param {IParams[]} headers
   * @memberof SheetUtil
   */
  static setHeaderCell(e, t) {
    const { data: s } = e.data[0];
    s[0] = t;
  }
  /**
   * 添加钩子
   *
   * @static
   * @param {*} config
   * @param {*} hook
   * @memberof SheetUtil
   */
  static addHook(e, t) {
    Object.assign(e.hook, t);
  }
  /**
   * 添加自定义事件
   *
   * @static
   * @param {string} tag
   * @param {string} action
   * @param {*} callback
   * @memberof SheetUtil
   */
  static addCustomEvent(e, t, s) {
    const a = document.querySelector(e);
    a && a.addEventListener(t, s);
  }
  /**
   * 获取总列数
   *
   * @static
   * @memberof SheetUtil
   */
  static getTotalColumn() {
    let e = 60;
    const t = this.getLuckySheet();
    if (t) {
      const s = t.getSheetData();
      s && s[0] && (e = s[0].length);
    }
    return e;
  }
  /**
   * 获取总行数
   *
   * @static
   * @return {*}
   * @memberof SheetUtil
   */
  static getTotalRow() {
    let e = 85;
    const t = this.getLuckySheet();
    if (t) {
      const s = t.getSheetData();
      s && (e = s.length);
    }
    return e;
  }
  /**
   * 获取对应类型数据
   *
   * @static
   * @param {*} value
   * @param {string} type
   * @memberof SheetUtil
   */
  static getValueByType(e, t) {
    if (!e)
      return e;
    switch (t) {
      case "string":
        return e.toString();
      case "number":
        return Number(e);
      case "boolean":
        return !!e;
      default:
        return e;
    }
  }
  /**
   * 设置筛选范围
   *
   * @static
   * @memberof SheetUtil
   */
  static setRangeFilter(e, t) {
    const s = this.getLuckySheet();
    s && s.setRangeFilter("open", {
      range: { row: [0, e], column: [0, t] }
    });
  }
  /**
   * 获取sheet文件
   *
   * @static
   * @return {*}
   * @memberof SheetUtil
   */
  static getLuckysheetFile() {
    const e = this.getLuckySheet();
    if (e)
      return e.getLuckysheetfile()[0];
  }
  /**
   * @description 插入行
   * @static
   * @param {number} index
   * @return {*}
   * @memberof SheetUtil
   */
  static insertRow(e) {
    const t = this.getLuckySheet();
    if (t)
      return t.insertRow(e);
  }
  /**
   * @description 删除行
   * @static
   * @param {number} start
   * @param {number} end
   * @memberof SheetUtil
   */
  static deleteRow(e, t) {
    const s = this.getLuckySheet();
    if (s)
      return s.deleteRow(e, t);
  }
  /**
   * @description 设置行背景
   * @static
   * @memberof SheetUtil
   */
  static setRangeBg(e, t) {
    const { row: s, column: a } = e, c = this.getSheetData();
    if (c)
      for (let r = s[0]; r <= s[1]; r++)
        c[r].forEach((y, l) => {
          l >= a[0] && l <= a[1] && y && (Object.assign(y, { bg: t }), this.setCellValue(
            r,
            l,
            y,
            r === s[1] && l === a[1]
          ));
        });
  }
}
function se(i) {
  return { all: i = i || /* @__PURE__ */ new Map(), on: function(e, t) {
    var s = i.get(e);
    s ? s.push(t) : i.set(e, [t]);
  }, off: function(e, t) {
    var s = i.get(e);
    s && (t ? s.splice(s.indexOf(t) >>> 0, 1) : i.set(e, []));
  }, emit: function(e, t) {
    var s = i.get(e);
    s && s.slice().map(function(a) {
      a(t);
    }), (s = i.get("*")) && s.slice().map(function(a) {
      a(e, t);
    });
  } };
}
const j = se(), ie = d("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false",
  fill: "CurrentColor"
}, [d("g", {
  id: "ajpaction/edit",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [d("path", {
  d: "M2 8.34L10.71 0 15 4.17 6.538 13H2V8.34zm1.2.512V11.8h2.826l7.283-7.6-2.606-2.533L3.2 8.852zM0 16v-1.2h16V16H0z",
  id: "ajp编辑"
}, null)])]), v = /* @__PURE__ */ G({
  name: "IBizLuckySheet",
  props: U(),
  emits: W(),
  setup(i, {
    emit: e
  }) {
    var R;
    const t = i.controller, s = Y("lucky-sheet-editor"), a = w(!0), c = w(""), r = "lucky-sheet-editor-".concat(Z()), L = JSON.stringify([{
      name: "sheet1",
      // 工作表名称
      color: "",
      // 工作表颜色
      index: 0,
      // 工作表索引
      status: 1,
      // 激活状态
      order: 0,
      // 工作表的下标
      hide: 0,
      // 是否隐藏
      row: 50,
      // 行数
      column: 20,
      // 列数
      defaultRowHeight: 19,
      // 自定义行高
      defaultColWidth: 73,
      // 自定义列宽
      celldata: []
    }]), y = w(!1);
    let l = "default";
    t && ((R = t.editorParams) != null && R.showmode) && (l = t.editorParams.showmode);
    const x = ((n, h) => {
      let f = 0, g;
      return (...m) => {
        const S = Date.now();
        S - f >= h ? (f = S, n.apply(this, m)) : (clearTimeout(g), g = setTimeout(() => {
          f = S, n.apply(this, m);
        }, h - (S - f)));
      };
    })(() => {
      if (i.readonly || i.disabled || l === "manual")
        return;
      const h = o.getLuckySheet().getAllSheets();
      c.value = JSON.stringify(h), e("change", c.value);
    }, 1e3), u = {
      container: r,
      // 设定DOM容器的id
      lang: "zh",
      // 设定表格语言showtoolbar: false,
      data: [],
      hook: {},
      allowEdit: !i.readonly && !i.disabled && l !== "manual",
      // 是否允许编辑
      showtoolbar: !i.readonly && !i.disabled && l !== "manual",
      // 工具栏在只读或禁用下不显示
      enableAddRow: !i.readonly && !i.disabled && l !== "manual",
      // 允许增加行
      enableAddCol: !i.readonly && !i.disabled && l !== "manual"
      // 允许增加列
    }, E = w(!1), A = () => {
      o.loadLuckySheet().then(() => {
        Object.assign(u, {
          data: JSON.parse(c.value)
        }), o.create(u), a.value = !1, E.value = !0;
      }).catch(() => {
      });
    }, T = () => {
      o.addHook(u, {
        cellRenderAfter: () => {
          x();
        }
      });
    }, p = () => {
      a.value = !0, T(), A();
    };
    q(() => i.value, (n, h) => {
      if (n !== h) {
        const f = c.value;
        if (n ? c.value = n : c.value = L, c.value !== f && E.value) {
          const g = o.getLuckySheet();
          g && (g.destroy(), Object.assign(u, {
            data: JSON.parse(c.value)
          }), o.create(u));
        }
        if (i.readonly || i.disabled) {
          const g = o.getLuckySheet();
          if (g) {
            const m = g.getLuckysheetfile(), S = JSON.parse(c.value);
            m.length > 0 && m.forEach((D) => {
              var H;
              const O = S.find((b) => b.name === D.name);
              O && ((H = O.data) == null || H.forEach((b, P) => {
                D.data[P] = b;
              }));
            }), g.luckysheetrefreshgrid();
          }
        }
      } else
        n === void 0 && h === void 0 && (c.value = L);
    }, {
      immediate: !0
    }), K(() => {
      window.luckySheetList || (window.luckySheetList = []);
      const n = window.luckySheetList;
      n.push(r), j.on("luckysheet", () => {
        n && n.length > 0 && n[n.length - 1] === r && p();
      });
    }), _(() => {
      const n = window.luckySheetList.indexOf(r);
      n > -1 && window.luckySheetList.splice(n, 1), j.emit("luckysheet");
    }), p();
    const z = () => {
      const n = o.getLuckySheet();
      n && (n.destroy(), Object.assign(u, {
        allowEdit: !0,
        showtoolbar: !0,
        enableAddRow: !0,
        enableAddCol: !0,
        data: JSON.parse(c.value)
      }), o.create(u)), y.value = !0;
    }, N = () => {
      const n = o.getLuckySheet();
      n && (n.destroy(), Object.assign(u, {
        allowEdit: !1,
        showtoolbar: !1,
        enableAddRow: !1,
        enableAddCol: !1,
        data: JSON.parse(c.value)
      }), o.create(u)), y.value = !1;
    }, I = () => {
      const n = o.getLuckySheet();
      if (n) {
        const h = n.getAllSheets();
        c.value = JSON.stringify(h), e("change", c.value), n.destroy(), Object.assign(u, {
          allowEdit: !1,
          showtoolbar: !1,
          enableAddRow: !1,
          enableAddCol: !1,
          data: h
        }), o.create(u);
      }
      y.value = !1;
    };
    return {
      c: t,
      ns: s,
      uuid: r,
      loading: a,
      isEditing: y,
      showmode: l,
      renderHeader: () => {
        if (l === "manual" && !i.disabled && !i.readonly)
          return d("div", {
            class: s.b("header")
          }, [d("div", {
            class: s.be("header", "edit"),
            onClick: z,
            title: ibiz.i18n.t("app.edit")
          }, [ie])]);
      },
      renderFooter: () => {
        if (l === "manual" && !i.disabled && !i.readonly)
          return d("div", {
            class: s.b("footer")
          }, [d("div", {
            class: s.be("footer", "cancel"),
            onClick: N
          }, [ibiz.i18n.t("editor.common.cancel")]), d("div", {
            class: s.be("footer", "save"),
            onClick: I
          }, [ibiz.i18n.t("editor.common.confirm")])]);
      }
    };
  },
  render() {
    return d("div", {
      class: [this.ns.b("container"), this.ns.is("manual", this.showmode === "manual"), this.ns.is("editing", this.isEditing), this.ns.is("loading", this.loading), this.ns.is("readonly", this.readonly), this.ns.is("disabled", this.disabled)]
    }, [this.renderHeader(), Q(d("div", {
      class: this.ns.b(),
      id: this.uuid
    }, null), [[X("loading"), this.loading]]), this.renderFooter()]);
  }
}), ae = $(v, function(i) {
  i.component(v.name, v), V(
    "EDITOR_CUSTOMSTYLE_LUCKYSHEET",
    () => new te()
  );
}), ye = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(i) {
    i.use(ae);
  }
};
export {
  ae as IBizLuckySheet,
  ye as default
};
