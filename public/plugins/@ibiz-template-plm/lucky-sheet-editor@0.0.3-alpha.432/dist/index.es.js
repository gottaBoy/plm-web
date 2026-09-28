import './assets/style.css';
import { PluginStaticResource as P, registerEditorProvider as B, EditorController as J } from "@ibiz-template/runtime";
import { getInputProps as V, getEditorEmits as F, useNamespace as U, withInstall as W } from "@ibiz-template/vue3-util";
import { createVNode as c, defineComponent as Y, ref as v, watch as q, onMounted as G, onBeforeUnmount as K, withDirectives as $, resolveDirective as Q } from "vue";
import { createUUID as X } from "qx-util";
var Z = Object.defineProperty, _ = (a, e, t) => e in a ? Z(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t, D = (a, e, t) => (_(a, typeof e != "symbol" ? e + "" : e, t), t);
class ee extends J {
}
class te {
  constructor() {
    D(this, "formEditor", "IBizLuckySheet"), D(this, "gridEditor", "IBizLuckySheet");
  }
  async createController(e, t) {
    const s = new ee(e, t);
    return await s.init(), s;
  }
}
const k = new P(import.meta.url);
class l {
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
      const i = document.createElement("script");
      i.src = e, i.onload = t, i.onerror = s, document.head.appendChild(i);
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
      const i = document.createElement("link");
      i.rel = "stylesheet", i.href = e, i.onload = t, i.onerror = s, document.head.appendChild(i);
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
        const s = [
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
        Promise.all(s).then(() => {
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
    return t && (e = t.getSheetData().map((s) => s.map((i) => i ? i.v : null))), e;
  }
  /**
   * @description 设置工作表配置
   * @param {*} config
   * @memberof SheetUtil
   */
  static setConfig(e, t = !1) {
    const s = this.getLuckySheet();
    if (t) {
      const i = Object.assign(s.getConfig(), e);
      s.setConfig(i);
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
  static setCellValue(e, t, s, i = !1) {
    const u = this.getLuckySheet();
    u && u.setCellValue(e, t, s, { isRefresh: i });
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
      const t = l.getTotalRow(), s = l.getTotalColumn();
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
    const i = document.querySelector(e);
    i && i.addEventListener(t, s);
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
    const { row: s, column: i } = e, u = this.getSheetData();
    if (u)
      for (let o = s[0]; o <= s[1]; o++)
        u[o].forEach((d, y) => {
          y >= i[0] && y <= i[1] && d && (Object.assign(d, { bg: t }), this.setCellValue(
            o,
            y,
            d,
            o === s[1] && y === i[1]
          ));
        });
  }
}
function se(a) {
  return { all: a = a || /* @__PURE__ */ new Map(), on: function(e, t) {
    var s = a.get(e);
    s ? s.push(t) : a.set(e, [t]);
  }, off: function(e, t) {
    var s = a.get(e);
    s && (t ? s.splice(s.indexOf(t) >>> 0, 1) : a.set(e, []));
  }, emit: function(e, t) {
    var s = a.get(e);
    s && s.slice().map(function(i) {
      i(t);
    }), (s = a.get("*")) && s.slice().map(function(i) {
      i(e, t);
    });
  } };
}
const A = se(), ae = c("svg", {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg",
  height: "1em",
  width: "1em",
  preserveAspectRatio: "xMidYMid meet",
  focusable: "false",
  fill: "CurrentColor"
}, [c("g", {
  id: "ajpaction/edit",
  "stroke-width": "1",
  "fill-rule": "evenodd"
}, [c("path", {
  d: "M2 8.34L10.71 0 15 4.17 6.538 13H2V8.34zm1.2.512V11.8h2.826l7.283-7.6-2.606-2.533L3.2 8.852zM0 16v-1.2h16V16H0z",
  id: "ajp编辑"
}, null)])]), b = /* @__PURE__ */ Y({
  name: "IBizLuckySheet",
  props: V(),
  emits: F(),
  setup(a, {
    emit: e
  }) {
    var t;
    const s = a.controller, i = U("lucky-sheet-editor"), u = v(!0), o = v(""), d = "lucky-sheet-editor-".concat(X()), y = JSON.stringify([{
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
    }]), p = v(!1);
    let h = "default";
    s && (t = s.editorParams) != null && t.showmode && (h = s.editorParams.showmode);
    const H = ((n, f) => {
      let m = 0, g;
      return (...w) => {
        const S = Date.now();
        S - m >= f ? (m = S, n.apply(this, w)) : (clearTimeout(g), g = setTimeout(() => {
          m = S, n.apply(this, w);
        }, f - (S - m)));
      };
    })(() => {
      if (a.readonly || a.disabled || h === "manual")
        return;
      const n = l.getLuckySheet().getAllSheets();
      o.value = JSON.stringify(n), e("change", o.value);
    }, 1e3), r = {
      container: d,
      // 设定DOM容器的id
      lang: "zh",
      // 设定表格语言showtoolbar: false,
      data: [],
      hook: {},
      allowEdit: !a.readonly && !a.disabled && h !== "manual",
      // 是否允许编辑
      showtoolbar: !a.readonly && !a.disabled && h !== "manual",
      // 工具栏在只读或禁用下不显示
      enableAddRow: !a.readonly && !a.disabled && h !== "manual",
      // 允许增加行
      enableAddCol: !a.readonly && !a.disabled && h !== "manual"
      // 允许增加列
    }, C = v(!1), T = () => {
      l.loadLuckySheet().then(() => {
        Object.assign(r, {
          data: JSON.parse(o.value)
        }), l.create(r), u.value = !1, C.value = !0;
      }).catch(() => {
      });
    }, z = () => {
      l.addHook(r, {
        cellRenderAfter: () => {
          H();
        }
      });
    }, E = () => {
      u.value = !0, z(), T();
    };
    q(() => a.value, (n, f) => {
      if (n !== f) {
        const m = o.value;
        if (n ? o.value = n : o.value = y, o.value !== m && C.value) {
          const g = l.getLuckySheet();
          g && (g.destroy(), Object.assign(r, {
            data: JSON.parse(o.value)
          }), l.create(r));
        }
        if (a.readonly || a.disabled) {
          const g = l.getLuckySheet();
          if (g) {
            const w = g.getLuckysheetfile(), S = JSON.parse(o.value);
            w.length > 0 && w.forEach((R) => {
              var O;
              const j = S.find((L) => L.name === R.name);
              j && ((O = j.data) == null || O.forEach((L, M) => {
                R.data[M] = L;
              }));
            }), g.luckysheetrefreshgrid();
          }
        }
      } else
        n === void 0 && f === void 0 && (o.value = y);
    }, {
      immediate: !0
    }), G(() => {
      window.luckySheetList || (window.luckySheetList = []);
      const n = window.luckySheetList;
      n.push(d), A.on("luckysheet", () => {
        n && n.length > 0 && n[n.length - 1] === d && E();
      });
    }), K(() => {
      const n = window.luckySheetList.indexOf(d);
      n > -1 && window.luckySheetList.splice(n, 1), A.emit("luckysheet");
    }), E();
    const x = () => {
      const n = l.getLuckySheet();
      n && (n.destroy(), Object.assign(r, {
        allowEdit: !0,
        showtoolbar: !0,
        enableAddRow: !0,
        enableAddCol: !0,
        data: JSON.parse(o.value)
      }), l.create(r)), p.value = !0;
    }, I = () => {
      const n = l.getLuckySheet();
      n && (n.destroy(), Object.assign(r, {
        allowEdit: !1,
        showtoolbar: !1,
        enableAddRow: !1,
        enableAddCol: !1,
        data: JSON.parse(o.value)
      }), l.create(r)), p.value = !1;
    }, N = () => {
      const n = l.getLuckySheet();
      if (n) {
        const f = n.getAllSheets();
        o.value = JSON.stringify(f), e("change", o.value), n.destroy(), Object.assign(r, {
          allowEdit: !1,
          showtoolbar: !1,
          enableAddRow: !1,
          enableAddCol: !1,
          data: f
        }), l.create(r);
      }
      p.value = !1;
    };
    return {
      c: s,
      ns: i,
      uuid: d,
      loading: u,
      isEditing: p,
      showmode: h,
      renderHeader: () => {
        if (h === "manual" && !a.disabled && !a.readonly)
          return c("div", {
            class: i.b("header")
          }, [c("div", {
            class: i.be("header", "edit"),
            onClick: x,
            title: ibiz.i18n.t("app.edit")
          }, [ae])]);
      },
      renderFooter: () => {
        if (h === "manual" && !a.disabled && !a.readonly)
          return c("div", {
            class: i.b("footer")
          }, [c("div", {
            class: i.be("footer", "cancel"),
            onClick: I
          }, [ibiz.i18n.t("editor.common.cancel")]), c("div", {
            class: i.be("footer", "save"),
            onClick: N
          }, [ibiz.i18n.t("editor.common.confirm")])]);
      }
    };
  },
  render() {
    return c("div", {
      class: [this.ns.b("container"), this.ns.is("manual", this.showmode === "manual"), this.ns.is("editing", this.isEditing), this.ns.is("loading", this.loading), this.ns.is("readonly", this.readonly), this.ns.is("disabled", this.disabled)]
    }, [this.renderHeader(), $(c("div", {
      class: this.ns.b(),
      id: this.uuid
    }, null), [[Q("loading"), this.loading]]), this.renderFooter()]);
  }
}), ie = W(b, function(a) {
  a.component(b.name, b), B(
    "EDITOR_CUSTOMSTYLE_LUCKYSHEET",
    () => new te()
  );
}), ce = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(a) {
    a.use(ie);
  }
};
export {
  ie as IBizLuckySheet,
  ce as default
};
