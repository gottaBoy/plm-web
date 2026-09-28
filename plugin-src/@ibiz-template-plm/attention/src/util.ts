class AttentionUtil {
  /**
   * 计算选中项绘制个数 多选场景需计算显示人员是否超出
   * @author ljx
   * @date 2024-03-05 02:42:45
   * @param {IData} values 选中项key值集合
   * @returns {number} selRenderNum
   */
  static calcSelItemRenderNum(values: string[], element?: HTMLElement) {
    let i = 0;
    if (element && (values == null ? void 0 : values.length) > 0) {
      const e = (element == null ? void 0 : element.offsetWidth) || 0,
        d = window.getComputedStyle(element),
        c = parseInt(d.marginLeft, 10),
        f = parseInt(d.marginRight, 10),
        v = parseInt(d.paddingLeft, 10),
        E = parseInt(d.paddingRight, 10),
        F = c + f + v + E,
        w = 70,
        C = 33,
        g = 28,
        p = 8,
        j = (g + p) * values.length;
      e - F - w - C - j < 0 &&
        ((i = Math.floor((e - F - w - C) / (g + p))), (i -= 1));
    }
    return i;
  }
}

export { AttentionUtil };
