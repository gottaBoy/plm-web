import { registerUIActionProvider as m, FrontUIActionProvider as f, getPlatformType as w, PlatformType as b } from "@ibiz-template/runtime";
import { RuntimeError as n, downloadFileFromBlob as p } from "@ibiz-template/core";
var h = Object.defineProperty, y = (r, o, e) => o in r ? h(r, o, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[o] = e, F = (r, o, e) => (y(r, typeof o != "symbol" ? o + "" : o, e), e);
class U extends f {
  constructor() {
    super(...arguments), F(this, "downloadUrl", "".concat(ibiz.env.downloadFileUrl, "/%fileId%"));
  }
  async execAction(o, e) {
    const { context: l, params: a, data: i } = e, { resultContext: d, resultParams: t, resultData: s } = await this.handleParams(
      o,
      l,
      i,
      a
    );
    if (!t.fileid)
      return ibiz.log.error("未配置文件id"), {};
    const c = ibiz.util.file.calcFileUpDownUrl(
      d,
      t,
      s
    );
    this.downloadUrl = c.downloadUrl;
    const u = this.downloadUrl.replace("%fileId%", t.fileid);
    return this.fileDownload({ url: u, name: t.filename || "下载文件" }), {};
  }
  /**
   * 请求url获取文件流，并用JS触发文件下载
   *
   * @author lxm
   * @date 2022-11-17 14:11:09
   * @param {string} url
   * @param {IData} file
   */
  fileDownload(o) {
    if (w() === b.DINGTALK) {
      this.downloadFileFromBlob(o);
      return;
    }
    ibiz.net.request(o.url, {
      method: "get",
      responseType: "blob",
      baseURL: ""
      // 已经有baseURL了，这里无需再写
    }).then((e) => {
      if (e.status !== 200)
        throw new n("下载文件失败");
      if (e.data) {
        const l = o.name;
        p(e.data, l);
      } else
        throw new n("文件流数据不存在");
    });
  }
  /**
   * 适配钉钉文件下载，钉钉移动端下载需跳转到浏览器
   *
   * @param {string} url
   * @param {IData} file
   */
  downloadFileFromBlob(o) {
    const e = document.createElement("a");
    e.href = "".concat(o.url), e.target = "_blank", e.download = "download", e.style.display = "inline", document.body.appendChild(e), e.click(), document.body.removeChild(e);
  }
}
function v() {
  m(
    "DEUIACTION_FILE_DOWNLOAD",
    () => new U()
  );
}
const g = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install() {
    v();
  }
};
export {
  g as default,
  v as registerFileDownloadProvider
};
