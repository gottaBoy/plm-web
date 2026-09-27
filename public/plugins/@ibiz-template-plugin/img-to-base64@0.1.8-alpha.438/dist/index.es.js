import { registerEditorProvider as j, EditorController as q } from "@ibiz-template/runtime";
import { defineComponent as G, ref as f, computed as N, watch as T, createVNode as c, resolveComponent as v, mergeProps as z } from "vue";
import { getUploadProps as K, getEditorEmits as Q, useNamespace as X, useAutoFocusBlur as Y, useFocusAndBlur as Z } from "@ibiz-template/vue3-util";
import { RuntimeModelError as A } from "@ibiz-template/core";
var ee = Object.defineProperty, ae = (s, o, n) => o in s ? ee(s, o, { enumerable: !0, configurable: !0, writable: !0, value: n }) : s[o] = n, r = (s, o, n) => (ae(s, typeof o != "symbol" ? o + "" : o, n), n);
const ie = /* @__PURE__ */ G({
  name: "ImgToBase64",
  props: K(),
  emits: Q(),
  setup(s, {
    emit: o
  }) {
    const n = X("image-upload"), a = s.controller, l = a.model.editorItems || [], {
      useInFocusAndBlur: w
    } = Y(s, o), m = f([]), h = f(0), p = f(!1), u = f(""), d = f([]), b = ibiz.util.file.getUploadHeaders(), I = f({
      ...b
    }), C = f(""), F = N(() => a.multiple ? 9999 : 1);
    console.log(666), T(() => s.data, (e) => {
      if (e) {
        const i = {
          ...a.editorParams,
          enableNoAccess: a.enableNoAccess
        };
        i.uploadparams && (i.uploadParams = JSON.parse(i.uploadparams));
        const t = ibiz.util.file.calcFileUpDownUrl(a.context, a.params, e, i);
        if (C.value = t.uploadUrl, l.length > 0) {
          const g = l[0].id;
          e[g] ? d.value = JSON.parse(e[g]) : d.value = [];
        }
      }
    }, {
      immediate: !0,
      deep: !0
    });
    const S = (e) => {
      e && (d.value.push({
        name: e.filename,
        id: e.fileid,
        folder: e.folder,
        ...a.transformInfoMap(e, a.infoMap)
      }), l.length > 0 && o("change", JSON.stringify(d.value), l[0].id));
    }, B = (e) => {
      p.value = e;
    }, J = N(() => !!u.value), M = N(() => !!(s.controlParams && s.controlParams.editmode === "hover" && !s.readonly)), {
      componentRef: k
    } = Z(() => o("focus"), () => w()), H = (e, i, t, g) => new Promise((y) => {
      const D = new FileReader();
      D.onload = function(P) {
        var R;
        if (a.imageWidth && a.imageHeight) {
          const E = new Image();
          P.target && P.target.result && (E.src = P.target.result, E.onload = function() {
            const x = document.createElement("canvas"), O = x.getContext("2d");
            x.width = t, x.height = g, O && O.drawImage(E, 0, 0, t, g);
            const $ = x.toDataURL("image/png", 0.9);
            o("change", $), y();
          });
        } else
          o("change", (R = P.target) == null ? void 0 : R.result), y();
      }, e.split(".").pop() === "svg" ? D.readAsText(i) : D.readAsDataURL(i);
    }), W = async (e) => {
      e.status === "ready" && await H(e.name, e.raw, a.imageWidth, a.imageHeight);
    }, L = (e = "") => {
      const i = new DOMParser().parseFromString(e, "image/svg+xml"), t = i.querySelector("parsererror");
      return i.documentElement.tagName === "svg" && !t;
    };
    T(() => s.value, (e) => {
      if (e && L(e)) {
        const i = encodeURIComponent(e);
        u.value = "data:image/svg+xml,".concat(i);
      } else
        u.value = e || "";
    }, {
      immediate: !0
    });
    const V = () => {
      o("change", null), l.length > 0 && o("change", null, l[0].id);
    }, _ = (e, i = "") => {
      const t = document.createElement("a");
      t.href = e, t.download = i, document.body.appendChild(t), t.click(), document.body.removeChild(t);
    }, U = () => {
      if (l.length > 0 && d.value.length > 0) {
        const e = d.value[0], i = {
          ...a.editorParams,
          enableNoAccess: a.enableNoAccess
        };
        i.exportparams && (i.exportParams = JSON.parse(i.exportparams)), i.globaldownloadprifix ? i.globalDownloadPrifix = i.globaldownloadprifix === "true" : i.globalDownloadPrifix = ibiz.config.common.globalDownloadPrifix, e && e.folder && (i.osscat = e.folder);
        const t = ibiz.util.file.calcFileUpDownUrl(a.context, a.params, s.data, i), {
          downloadUrl: g
        } = t;
        return e.url || g.replace("%fileId%", e.id);
      }
      return u.value;
    };
    return {
      ns: n,
      c: a,
      limit: F,
      uploadUrl: C,
      headers: I,
      editorItems: l,
      dialogImageUrl: m,
      dialogVisible: p,
      noUploadIcon: J,
      onRemove: V,
      onDownload: () => {
        if (l.length > 0 && d.value.length > 0) {
          const e = U(), i = d.value[0], t = {
            ...a.editorParams,
            enableNoAccess: a.enableNoAccess
          };
          t.exportparams && (t.exportParams = JSON.parse(t.exportparams)), t.globaldownloadprifix ? t.globalDownloadPrifix = t.globaldownloadprifix === "true" : t.globalDownloadPrifix = ibiz.config.common.globalDownloadPrifix, ibiz.util.file.fileDownload(e, i.name, {
            context: a.context,
            params: a.params,
            data: s.data,
            file: {
              fileId: i.id,
              ...i
            },
            extraParams: t,
            downloadTicketParams: a.downloadTicketParams
          }, void 0, a.enableNoAccess);
        } else
          _(u.value);
      },
      onSuccess: S,
      base64Data: u,
      fileList: d,
      onDialogVisibleChange: B,
      onPreview: () => {
        const e = U();
        m.value = [e], p.value = !0;
      },
      getDownloadUrl: U,
      handleImgToBase64: W,
      componentRef: k,
      showFormDefaultContent: M,
      dialogImageUrlIndex: h
    };
  },
  render() {
    let s = {};
    this.c.imageWidth && this.c.imageHeight && !this.fileList.length && (s = this.ns.cssVarBlock({
      "image-height": "".concat(this.c.imageHeight, "px"),
      "image-width": "".concat(this.c.imageWidth, "px")
    }));
    const o = this.getDownloadUrl();
    return c("div", {
      class: [this.ns.b(), this.disabled ? this.ns.m("disabled") : "", this.readonly ? this.ns.m("readonly") : "", this.readonly && this.c.autoPreview && this.ns.m("autosize"), this.ns.is("show-default", this.showFormDefaultContent)],
      style: s,
      ref: "componentRef"
    }, [c("div", {
      class: this.ns.e("image-upload-list")
    }, [o ? c("div", {
      class: this.ns.e("list-item")
    }, [c("img", {
      src: o
    }, null), c("div", {
      class: this.ns.e("list-item-cover")
    }, [c(v("ion-icon"), {
      class: this.ns.e("preview-icon"),
      onClick: this.onPreview,
      name: "search"
    }, null), c(v("ion-icon"), {
      class: this.ns.e("download-icon"),
      onClick: this.onDownload,
      name: "download"
    }, null), c(v("ion-icon"), {
      class: this.ns.e("remove-icon"),
      onClick: this.onRemove,
      name: "remove"
    }, null)])]) : null]), c(v("el-upload"), z({
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
      default: () => [c(v("ion-icon"), {
        name: "add-outline",
        class: this.ns.e("image-upload-add")
      }, null)]
    }), this.dialogVisible ? c(v("el-image-viewer"), z({
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
class oe extends q {
  constructor() {
    super(...arguments), r(this, "isDrag", !1), r(this, "multiple", !0), r(this, "accept", ""), r(this, "size", 0), r(this, "uploadParams"), r(this, "exportParams"), r(this, "autoPreview", !1), r(this, "imageWidth", 0), r(this, "imageHeight", 0), r(this, "infoMap", ""), r(this, "transformInfoMap", (o = {}, n = "", a = !1) => {
      const l = {};
      return n.split(";").forEach((w) => {
        let [m, h] = w.split(":");
        a && (m = h), m && h && Object.assign(l, { [h]: o[m] });
      }), l;
    });
  }
  async onInit() {
    var o;
    if (await super.onInit(), this.infoMap = ibiz.config.uploadEditor.infoMap, (o = this.model.editorType) != null && o.includes("PICTURE") && (this.accept = "image/*"), ["FILEUPLOADER_ONE", "PICTURE_ONE", "PICTURE_ONE_RAW"].includes(
      this.model.editorType
    ) && (this.multiple = !1), this.editorParams) {
      const {
        isDrag: n,
        multiple: a,
        accept: l,
        size: w,
        infomap: m,
        uploadParams: h,
        exportParams: p,
        autoPreview: u,
        imageWidth: d,
        imageHeight: b
      } = this.editorParams;
      if (d && (this.imageWidth = Number(d)), b && (this.imageHeight = Number(b)), n && (this.isDrag = !!n), u && (this.autoPreview = u), a && (this.multiple = !!a), l && (this.accept = l), w && (this.size = Number(w)), m && (this.infoMap = m), h)
        try {
          this.uploadParams = JSON.parse(h);
        } catch (I) {
          throw new A(
            h,
            ibiz.i18n.t("editor.upload.uploadJsonFormatErr")
          );
        }
      if (p)
        try {
          this.exportParams = JSON.parse(p);
        } catch (I) {
          throw new A(
            p,
            ibiz.i18n.t("editor.upload.exportJsonFormatErr")
          );
        }
    }
  }
}
class te {
  constructor() {
    r(this, "formEditor", "ImgToBase64"), r(this, "gridEditor", "ImgToBase64");
  }
  async createController(o, n) {
    const a = new oe(o, n);
    return await a.init(), a;
  }
}
const de = {
  install(s) {
    s.component("ImgToBase64", ie), j("PICTURE_ONE_TOBASE64", () => new te());
  }
};
export {
  de as default
};
