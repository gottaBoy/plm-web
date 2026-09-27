export class Util {
  /**
   * 计算多选场景下可绘制的选中项数量。
   */
  static calcSelItemRenderNum(values: IData, el: HTMLElement): number {
    let renderNum = -1;
    if (el && values?.length > 0) {
      const width = el?.offsetWidth || 0;
      const style = window.getComputedStyle(el);
      const marginLeft = parseInt(style.marginLeft, 10);
      const marginRight = parseInt(style.marginRight, 10);
      const paddingLeft = parseInt(style.paddingLeft, 10);
      const paddingRight = parseInt(style.paddingRight, 10);
      const padding = marginLeft + marginRight + paddingLeft + paddingRight;
      const itemWidth = 32;
      const itemGap = 8;
      const requiredWidth = (itemWidth + itemGap) * values.length;
      if (width - padding - requiredWidth < 0) {
        renderNum = Math.floor((width - padding) / (itemWidth + itemGap));
        renderNum = Math.max(renderNum - 1, 0);
      }
    }
    return renderNum;
  }
}
