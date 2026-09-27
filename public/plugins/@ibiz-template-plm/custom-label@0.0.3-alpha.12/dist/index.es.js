import { registerControlProvider as p, ChartController as u } from "@ibiz-template/runtime";
var d = Object.defineProperty, x = (r, t, e) => t in r ? d(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e, b = (r, t, e) => (x(r, typeof t != "symbol" ? t + "" : t, e), e);
class g extends u {
  /**
   * 根据数据计算最终的options
   * 并刷新echarts
   * @author lxm
   * @date 2023-06-07 09:58:00
   * @param {IData[]} [data=this.state.items]
   */
  async calcOptions(t = this.state.items) {
    this.options = await this.generator.calcOptionsByData(
      t,
      this.context,
      this.params
    );
    const e = this.handleTotalData(this.options);
    this.customLabel(this.options, e), this.updateChart();
  }
  /**
   * 自定义label
   * @param options 图表数据
   * @param totalMap 分组数据
   */
  customLabel(t, e) {
    t && Array.isArray(t.xAxis) && t.xAxis.length > 0 && (t.xAxis[0].axisLabel || (t.xAxis[0].axisLabel = {}), Object.assign(t.xAxis[0].axisLabel, {
      formatter: function(a, n) {
        const s = e[a] || 0;
        return "".concat(a, "(").concat(s, ")");
      }
    }));
  }
  /**
   * 计算分组后的数据
   * @param options
   * @returns
   */
  handleTotalData(t) {
    const e = {};
    return t && t.series && t.series.forEach((a) => {
      const n = a.name;
      a.data && a.type === "bar" && a.data.forEach((s) => {
        var i;
        const l = s[0], o = (i = this.chart) == null ? void 0 : i.getOption();
        let h = {};
        if (o && o.legend && Array.isArray(o.legend) && o.legend.length > 0 && (h = o.legend[0].selected), Object.prototype.hasOwnProperty.call(h, n) && h[n] === !1)
          return;
        let c = s[1];
        isNaN(c) && (c = 0), e[l] || e[l] === 0 ? e[l] += c : e[l] = c;
      });
    }), e;
  }
  /**
   * 重写初始化方法，增加监听点击图例的方法
   * @date 2023-06-07 09:37:05
   * @param {HTMLElement} dom
   */
  initChart(t) {
    var e;
    super.initChart(t);
    const a = this;
    (e = this.chart) == null || e.on("legendselectchanged", function(n) {
      var s;
      const i = a.handleTotalData(a.options || {});
      a.customLabel(a.options || {}, i), (s = a.chart) == null || s.setOption(a.options || {});
    });
  }
}
class f {
  constructor() {
    b(this, "component", "IBizChartControl");
  }
  createController(t, e, a, n) {
    return new g(t, e, a, n);
  }
}
const y = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars
  install(r) {
    p(
      "CHART_RENDER_CUSTOM_LABEL",
      () => new f()
    );
  }
};
export {
  y as default
};
