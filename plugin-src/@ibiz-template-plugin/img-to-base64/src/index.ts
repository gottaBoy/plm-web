import './style.css';

var K = Object.defineProperty;
var V = (t, s, n) => s in t ? K(t, s, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[s] = n;
var c = (t, s, n) => (V(t, typeof s != "symbol" ? s + "" : s, n), n);
import { EditorController as j, registerEditorProvider as q } from "@ibiz-template/runtime";
import { defineComponent as Q, ref as f, computed as C, watch as R, createVNode as u, resolveComponent as v, mergeProps as S } from "vue";
import { getUploadProps as X, getEditorEmits as Y, useNamespace as Z, useAutoFocusBlur as ee, useFocusAndBlur as oe } from "@ibiz-template/vue3-util";
import { RuntimeModelError as A } from "@ibiz-template/core";
const ae = /* @__PURE__ */ Q({
  name: "ImgToBase64",
  props: X(),
  emits: Y(),
  setup(t, {
    emit: s
  }) {
    const n = Z("image-upload"), o = t.controller, l = o.model.editorItems || [], {
      useInFocusAndBlur: h
    } = ee(t, s), p = f([]), w = f(0), m = f(!1), r = f(""), d = f([]), P = ibiz.util.file.getUploadHeaders(), b = f({
      ...P
    }), x = f(""), O = C(() => o.multiple ? 9999 : 1);
    console.log(666), R(() => t.data, (e) => {
      if (e) {
        const a = {
          ...o.editorParams,
          enableNoAccess: o.enableNoAccess
        };
        a.uploadparams && (a.uploadParams = JSON.parse(a.uploadparams));
        const i = ibiz.util.file.calcFileUpDownUrl(o.context, o.params, e, a);
        if (x.value = i.uploadUrl, l.length > 0) {
          const g = l[0].id;
          e[g] ? d.value = JSON.parse(e[g]) : d.value = [];
        }
      }
    }, {
      immediate: !0,
      deep: !0
    });
    const z = (e) => {
      e && (d.value.push({
        name: e.filename,
        id: e.fileid,
        folder: e.folder,
        ...o.transformInfoMap(e, o.infoMap)
      }), l.length > 0 && s("change", JSON.stringify(d.value), l[0].id));
    }, F = (e) => {
      m.value = e;
    }, k = C(() => !!r.value), H = C(() => !!(t.controlParams && t.controlParams.editmode === "hover" && !t.readonly)), {
      componentRef: J
    } = oe(() => s("focus"), () => h()), M = (e, a, i, g) => new Promise((y) => {
      const E = new FileReader();
      E.onload = function(I) {
        var T;
        if (o.imageWidth && o.imageHeight) {
          const N = new Image();
          I.target && I.target.result && (N.src = I.target.result, N.onload = function() {
            const D = document.createElement("canvas"), B = D.getContext("2d");
            D.width = i, D.height = g, B && B.drawImage(N, 0, 0, i, g);
            const G = D.toDataURL("image/png", 0.9);
            s("change", G), y();
          });
        } else
          s("change", (T = I.target) == null ? void 0 : T.result), y();
      }, e.split(".").pop() === "svg" ? E.readAsText(a) : E.readAsDataURL(a);
    }), W = async (e) => {
      e.status === "ready" && await M(e.name, e.raw, o.imageWidth, o.imageHeight);
    }, L = (e = "") => {
      const i = new DOMParser().parseFromString(e, "image/svg+xml"), g = i.querySelector("parsererror");
      return i.documentElement.tagName === "svg" && !g;
    };
    R(() => t.value, (e) => {
      if (e && L(e)) {
        const a = encodeURIComponent(e);
        r.value = "data:image/svg+xml,".concat(a);
      } else
        r.value = e || "";
    }, {
      immediate: !0
    });
    const _ = () => {
      s("change", null), l.length > 0 && s("change", null, l[0].id);
    }, $ = (e, a = "") => {
      const i = document.createElement("a");
      i.href = e, i.download = a, document.body.appendChild(i), i.click(), document.body.removeChild(i);
    }, U = () => {
      if (l.length > 0 && d.value.length > 0) {
        const e = d.value[0], a = {
          ...o.editorParams,
          enableNoAccess: o.enableNoAccess
        };
        a.exportparams && (a.exportParams = JSON.parse(a.exportparams)), a.globaldownloadprifix ? a.globalDownloadPrifix = a.globaldownloadprifix === "true" : a.globalDownloadPrifix = ibiz.config.common.globalDownloadPrifix, e && e.folder && (a.osscat = e.folder);
        const i = ibiz.util.file.calcFileUpDownUrl(o.context, o.params, t.data, a), {
          downloadUrl: g
        } = i;
        return e.url || g.replace("%fileId%", e.id);
      }
      return r.value;
    };
    return {
      ns: n,
      c: o,
      limit: O,
      uploadUrl: x,
      headers: b,
      editorItems: l,
      dialogImageUrl: p,
      dialogVisible: m,
      noUploadIcon: k,
      onRemove: _,
      onDownload: () => {
        if (l.length > 0 && d.value.length > 0) {
          const e = U(), a = d.value[0], i = {
            ...o.editorParams,
            enableNoAccess: o.enableNoAccess
          };
          i.exportparams && (i.exportParams = JSON.parse(i.exportparams)), i.globaldownloadprifix ? i.globalDownloadPrifix = i.globaldownloadprifix === "true" : i.globalDownloadPrifix = ibiz.config.common.globalDownloadPrifix, ibiz.util.file.fileDownload(e, a.name, {
            context: o.context,
            params: o.params,
            data: t.data,
            file: {
              fileId: a.id,
              ...a
            },
            extraParams: i,
            downloadTicketParams: o.downloadTicketParams
          }, void 0, o.enableNoAccess);
        } else
          $(r.value);
      },
      onSuccess: z,
      base64Data: r,
      fileList: d,
      onDialogVisibleChange: F,
      onPreview: () => {
        const e = U();
        p.value = [e], m.value = !0;
      },
      getDownloadUrl: U,
      handleImgToBase64: W,
      componentRef: J,
      showFormDefaultContent: H,
      dialogImageUrlIndex: w
    };
  },
  render() {
    let t = {};
    this.c.imageWidth && this.c.imageHeight && !this.fileList.length && (t = this.ns.cssVarBlock({
      "image-height": "".concat(this.c.imageHeight, "px"),
      "image-width": "".concat(this.c.imageWidth, "px")
    }));
    const s = this.getDownloadUrl();
    return u("div", {
      class: [this.ns.b(), this.disabled ? this.ns.m("disabled") : "", this.readonly ? this.ns.m("readonly") : "", this.readonly && this.c.autoPreview && this.ns.m("autosize"), this.ns.is("show-default", this.showFormDefaultContent)],
      style: t,
      ref: "componentRef"
    }, [u("div", {
      class: this.ns.e("image-upload-list")
    }, [s ? u("div", {
      class: this.ns.e("list-item")
    }, [u("img", {
      src: s
    }, null), u("div", {
      class: this.ns.e("list-item-cover")
    }, [u(v("ion-icon"), {
      class: this.ns.e("preview-icon"),
      onClick: this.onPreview,
      name: "search"
    }, null), u(v("ion-icon"), {
      class: this.ns.e("download-icon"),
      onClick: this.onDownload,
      name: "download"
    }, null), u(v("ion-icon"), {
      class: this.ns.e("remove-icon"),
      onClick: this.onRemove,
      name: "remove"
    }, null)])]) : null]), u(v("el-upload"), S({
      ref: "imageUpload",
      class: [this.ns.b("icon"), this.ns.is("not-show", this.noUploadIcon)],
      action: this.uploadUrl,
      headers: this.headers,
      "auto-upload": this.editorItems.length > 0,
      disabled: this.disabled,
      multiple: !1,
      "show-file-list": !1,
      accept: this.c.accept,
      "list-type": "picture-card",
      onRemove: this.onRemove,
      onPreview: this.onDownload,
      onSuccess: this.onSuccess,
      onChange: this.handleImgToBase64
    }, this.$attrs), {
      default: () => [u(v("ion-icon"), {
        name: "add-outline",
        class: this.ns.e("image-upload-add")
      }, null)]
    }), this.dialogVisible ? u(v("el-image-viewer"), S({
      onClose: () => this.onDialogVisibleChange(!1),
      "url-list": this.dialogImageUrl,
      "hide-on-click-modal": !0,
      "close-on-press-escape": !0,
      teleported: !0,
      "z-index": 9999,
      "initial-index": this.dialogImageUrlIndex
    }, this.$attrs), null) : null]);
  }
});
class ie extends j {
  constructor() {
    super(...arguments);
    /**
     * 是否支持拖拽
     */
    c(this, "isDrag", !1);
    /**
     * 是否多选
     */
    c(this, "multiple", !0);
    /**
     * 接受上传的文件类型
     */
    c(this, "accept", "");
    /**
     * 上传的文件大小
     *
     * @type {number}
     * @memberof ImgToBase64Controller
     */
    c(this, "size", 0);
    /**
     * 上传参数
     */
    c(this, "uploadParams");
    /**
     * 下载参数
     */
    c(this, "exportParams");
    /**
     * 自适应预览
     * 只读状态下且配置了编辑器参数autoPreview ，加载完图片后自动调整大小达到预览态，且禁用图片hover工具栏
     *
     * @type {boolean}
     * @memberof ImgToBase64Controller
     */
    c(this, "autoPreview", !1);
    /**
     * @description 图片宽度
     * @type {number}
     * @memberof ImgToBase64Controller
     */
    c(this, "imageWidth", 0);
    /**
     * @description 图片高度
     * @type {number}
     * @memberof ImgToBase64Controller
     */
    c(this, "imageHeight", 0);
    /**
     * 上传文件信息的映射规则字符串，格式为"源键:目标键;源键2:目标键2"
     */
    c(this, "infoMap", "");
    /**
     * 根据配置的映射关系转换对象属性
     * 将源对象的指定属性，按照映射规则映射到新对象的目标属性
     *
     * @param {IData} [_data={}] - 源数据对象，包含需要被映射的原始属性
     * @param {string} [infoMap=''] - 映射规则字符串，格式为"源键:目标键;源键2:目标键2"
     * @param {boolean} [isEmit=false] - 是否为抛值时处理，抛值时将源键替换为目标键
     * @returns {IData} 转换后的新对象，仅包含映射规则中定义的属性
     *
     * @example
     * // isEmit=false
     * // 源对象：{ filesize:'10000', fileext:'.gif', folder:'file' };
     * // 映射规则：'filesize:size;fileext:ext;folder:folder';
     * // 转换结果: { size:'10000', ext:'.gif', folder:'file' }
     *
     * // isEmit=true
     * // 源对象：{ filesize:'10000', fileext:'.gif', folder:'file' };
     * // 映射规则：'filesize:size;fileext:ext;folder:folder';
     * // 转换结果: { size:undefined, ext:undefined, folder:'file' }
     */
    c(this, "transformInfoMap", (n = {}, o = "", l = !1) => {
      const h = {};
      return o.split(";").forEach((w) => {
        let [m, r] = w.split(":");
        l && (m = r), m && r && Object.assign(h, { [r]: n[m] });
      }), h;
    });
  }
  async onInit() {
    var n;
    if (await super.onInit(), this.infoMap = ibiz.config.uploadEditor.infoMap, (n = this.model.editorType) != null && n.includes("PICTURE") && (this.accept = "image/*"), ["FILEUPLOADER_ONE", "PICTURE_ONE", "PICTURE_ONE_RAW"].includes(
      this.model.editorType
    ) && (this.multiple = !1), this.editorParams) {
      const {
        isDrag: o,
        multiple: l,
        accept: h,
        size: p,
        infomap: w,
        uploadParams: m,
        exportParams: r,
        autoPreview: d,
        imageWidth: P,
        imageHeight: b
      } = this.editorParams;
      if (P && (this.imageWidth = Number(P)), b && (this.imageHeight = Number(b)), o && (this.isDrag = !!o), d && (this.autoPreview = d), l && (this.multiple = !!l), h && (this.accept = h), p && (this.size = Number(p)), w && (this.infoMap = w), m)
        try {
          this.uploadParams = JSON.parse(m);
        } catch (x) {
          throw new A(
            m,
            ibiz.i18n.t("editor.upload.uploadJsonFormatErr")
          );
        }
      if (r)
        try {
          this.exportParams = JSON.parse(r);
        } catch (x) {
          throw new A(
            r,
            ibiz.i18n.t("editor.upload.exportJsonFormatErr")
          );
        }
    }
  }
}
class te {
  constructor() {
    c(this, "formEditor", "ImgToBase64");
    c(this, "gridEditor", "ImgToBase64");
  }
  async createController(s, n) {
    const o = new ie(s, n);
    return await o.init(), o;
  }
}
const ue = {
  install(t) {
    t.component("ImgToBase64", ae), q("PICTURE_ONE_TOBASE64", () => new te());
  }
};
export {
  ue as default
};
