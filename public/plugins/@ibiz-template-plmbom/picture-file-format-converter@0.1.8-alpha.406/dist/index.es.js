import './style.css';
var T = Object.defineProperty;
var x = (t, i, n) => i in t ? T(t, i, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[i] = n;
var v = (t, i, n) => (x(t, typeof i != "symbol" ? i + "" : i, n), n);
import { EditorController as y, registerEditorProvider as z } from "@ibiz-template/runtime";
import { getUploadProps as A, getEditorEmits as R, useNamespace as B, withInstall as b } from "@ibiz-template/vue3-util";
import { defineComponent as L, ref as g, watch as M, createVNode as l, resolveComponent as E } from "vue";
class N extends y {
  async onInit() {
    await super.onInit();
  }
}
class _ {
  constructor() {
    v(this, "formEditor", "IBizPictureFileFormatConverter");
    v(this, "gridEditor", "IBizPictureFileFormatConverter");
  }
  async createController(i, n) {
    const u = new N(
      i,
      n
    );
    return await u.init(), u;
  }
}
const h = /* @__PURE__ */ L({
  name: "IBizPictureFileFormatConverter",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: A(),
  emits: R(),
  setup(t, {
    emit: i
  }) {
    const n = B("picture-file-format-converter"), u = t.controller, m = g(), w = 5;
    let p = "image/svg+xml,image/png";
    const F = g([]), c = g("");
    u.editorParams && u.editorParams.accept && (p = u.editorParams.accept), M(() => t.value, (e) => {
      e && e !== c.value && (c.value = e);
    });
    const C = (e) => {
      i("change", e);
    }, P = (e) => {
      const s = e.split(",").map((r) => r.trim()).filter(Boolean), a = {
        "image/svg+xml": [".svg"],
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/gif": [".gif"]
        // 可根据需要扩展更多格式映射
      }, o = [];
      return s.forEach((r) => {
        a[r] && o.push(...a[r]);
      }), {
        mimeTypes: s,
        extList: o
      };
    }, I = (e) => {
      const {
        mimeTypes: s,
        extList: a
      } = P(p), o = s.includes(e.type), r = e.name.toLowerCase(), d = a.some((U) => r.endsWith(U));
      return !(!(o || d) || e.size / 1024 / 1024 > w);
    };
    return {
      ns: n,
      accept: p,
      base64Url: c,
      fileInputRef: m,
      handleFileUpload: () => {
        c.value || m.value.click();
      },
      handleFileChange: (e) => {
        const s = e.target, {
          files: a
        } = s;
        if (!a || a.length === 0)
          return;
        const o = a[0];
        if (!I(o)) {
          s.value = "";
          return;
        }
        F.value = [o];
        const r = new FileReader();
        r.onload = (d) => {
          var f;
          c.value = (f = d.target) == null ? void 0 : f.result, C(c.value);
        }, r.onerror = () => {
          ibiz.log.error("图片转换Base64失败，请重试！"), s.value = "";
        }, r.readAsDataURL(o);
      },
      clearFile: (e) => {
        e.stopPropagation(), e.preventDefault(), F.value = [], c.value = "", m.value.value = "", C("");
      }
    };
  },
  render() {
    return l("div", {
      class: [this.ns.b(), this.ns.is("selected", !!this.base64Url)]
    }, [l("div", {
      class: [this.ns.e("wrapper")],
      onClick: this.handleFileUpload
    }, [l("div", {
      class: this.ns.e("preview-area")
    }, [this.base64Url ? [l("img", {
      class: this.ns.em("preview-area", "img"),
      src: this.base64Url,
      alt: "上传预览图"
    }, null), l("div", {
      class: this.ns.em("preview-area", "modal")
    }, [l(E("ion-icon"), {
      name: "remove-outline",
      class: this.ns.em("preview-area", "remove-icon"),
      title: "删除图片",
      onClick: this.clearFile
    }, null)])] : l(E("ion-icon"), {
      name: "add-outline",
      title: "上传图片",
      class: this.ns.em("preview-area", "add-icon")
    }, null)]), l("input", {
      ref: "fileInputRef",
      class: this.ns.e("file-input"),
      type: "file",
      accept: this.accept,
      onChange: this.handleFileChange
    }, null)])]);
  }
}), j = b(
  h,
  function(t) {
    t.component(h.name, h), z(
      "PICTURE_PICTURE_FILE_FORMAT_CONVERTER",
      () => new _()
    );
  }
), H = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(t) {
    t.use(j);
  }
};
export {
  j as IBizPictureFileFormatConverter,
  H as default
};
