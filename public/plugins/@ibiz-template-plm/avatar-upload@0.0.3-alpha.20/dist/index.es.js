import './assets/style.css';
import { PluginStaticResource as Pn, registerEditorProvider as Nn, EditorController as Xn } from "@ibiz-template/runtime";
import { defineComponent as Jn, ref as G, watch as re, createVNode as m, resolveComponent as ZA, mergeProps as Hr, createTextVNode as RA, computed as Yn, nextTick as Er } from "vue";
import { getUploadProps as Wn, getEditorEmits as Zn, useNamespace as _n } from "@ibiz-template/vue3-util";
import { CoreConst as qn, HttpError as jn, RuntimeModelError as Ir } from "@ibiz-template/core";
import { getCookie as zn } from "qx-util";
var $n = Object.defineProperty, As = (e, A, r) => A in e ? $n(e, A, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[A] = r, bA = (e, A, r) => (As(e, typeof A != "symbol" ? A + "" : A, r), r);
const es = new Pn(import.meta.url);
function ts(e, A, r) {
  const t = G([]), B = G({
    Authorization: "Bearer ".concat(zn(qn.TOKEN))
  }), n = G(""), s = G(""), o = {
    count: 0,
    cacheFiles: []
    // iview上传过程中不能改default-file-list,所以需要缓存
  };
  re(
    () => e.value,
    (w) => {
      t.value = w ? JSON.parse(w) : [];
    },
    { immediate: !0 }
  ), re(
    () => e.data,
    (w) => {
      if (w) {
        const p = ibiz.util.file.calcFileUpDownUrl(
          r.context,
          r.params,
          w,
          r.editorParams
        );
        n.value = p.uploadUrl, s.value = p.downloadUrl;
      }
    },
    { immediate: !0, deep: !0 }
  ), re(
    t,
    (w) => {
      w != null && w.length && s.value && w.forEach((p) => {
        p.url = p.url || s.value.replace("%fileId%", p.id);
      });
    },
    { immediate: !0 }
  ), re(
    s,
    (w) => {
      w && t.value.length && t.value.forEach((p) => {
        p.url = s.value.replace("%fileId%", p.id);
      });
    },
    { immediate: !0 }
  );
  const i = () => {
    const w = [...t.value, ...o.cacheFiles], p = w.length > 0 ? JSON.stringify(w.map((F) => ({ name: F.name, id: F.id }))) : null;
    o.cacheFiles = [], A(p);
  }, a = () => {
    o.count += 1;
  }, c = (w) => {
    w && (o.cacheFiles.push({
      name: w.filename,
      id: w.fileid
    }), o.count -= 1, o.count === 0 && i());
  }, l = (...w) => {
    const p = w[0];
    throw o.count -= 1, new jn({
      response: { data: JSON.parse(p.message), status: p.status }
    });
  }, g = (w) => {
    if (e.disabled)
      return;
    const p = t.value.findIndex((F) => F.id === w.id);
    p !== -1 && t.value.splice(p, 1), i();
  }, C = (w) => {
    const p = w.url || s.value.replace("%fileId%", w.id);
    ibiz.util.file.fileDownload(p, w.name);
  }, u = Yn(() => r.multiple ? 9999 : 1);
  return {
    uploadUrl: n,
    downloadUrl: s,
    headers: B,
    files: t,
    limit: u,
    onDownload: C,
    onError: l,
    onRemove: g,
    onSuccess: c,
    beforeUpload: a
  };
}
const yr = /* @__PURE__ */ Jn({
  name: "AvatarUpload",
  props: Wn(),
  emits: Zn(),
  setup(e, {
    emit: A
  }) {
    const r = _n("avatar-upload"), t = e.controller, B = G(!1), n = G(), s = G(), o = G(), i = G(), a = G(), c = G(), l = G(!1), g = G(), C = G(), u = G(), w = G(0), p = G(0), F = G(), Q = G({
      r: t.cutShape === "DEFAULT" ? 100 : 107.14,
      x: 150,
      y: 150,
      oldx: 150,
      oldy: 150
    }), L = G(""), I = G(!1);
    let H = 0;
    const U = G([]), v = G(""), y = G(1), E = es.dir("assets/images/user-avatar.png"), {
      uploadUrl: V,
      downloadUrl: Y,
      headers: z,
      files: b,
      limit: N,
      onDownload: gA,
      onError: _,
      onRemove: q,
      onSuccess: dA,
      beforeUpload: BA
    } = ts(e, (f) => {
      v.value = f;
    }, t), aA = async () => {
      await Er();
      const {
        width: f,
        height: K
      } = n.value.getBoundingClientRect(), x = (300 - f) / 2, M = (300 - K) / 2;
      n.value ? x > M ? Q.value.r = f / 3 : Q.value.r = K / 3 : Q.value.r = 60, Q.value.x = 150, Q.value.y = 150, Q.value.oldx = 150, Q.value.oldy = 150;
    }, wA = () => {
      B.value = !1, U.value.forEach((f) => {
        f.raw && URL.revokeObjectURL(f.raw);
      }), H = 0, y.value = 1, aA();
    }, uA = (f) => {
      if (!f)
        return;
      U.value = [], U.value.push({
        name: f.filename,
        id: f.fileid
      });
      const K = JSON.stringify(U.value.map((x) => ({
        name: x.name,
        id: x.id
      })));
      v.value = K, I.value && (A("change", v.value), I.value = !1, wA());
    }, cA = (f) => {
      B.value = !0, uA(f);
    }, fA = (f) => {
      if (f.status === "ready")
        if (["image/jpeg", "image/png", "image/jpg"].includes(f.raw.type))
          I.value || (B.value = !0), U.value = [f];
        else
          throw new Error("请选择图片类型文件");
    };
    re(U, (f) => {
      f != null && f.length && Y.value && f.forEach((K) => {
        K.id ? K.url = K.url || Y.value.replace("%fileId%", K.id) : K.raw && (K.url = URL.createObjectURL(K.raw));
      });
    }, {
      immediate: !0
    });
    const nA = (f, K, x = !1) => {
      f.length > 0 && (x && (B.value = !1), K && K.length > 0 && K[0].raw && URL.revokeObjectURL(K[0].raw), a.value.clearFiles(), Er(() => {
        a.value.handleStart(f[0]), x && a.value.submit();
      }));
    }, KA = async (f = !1) => {
      const K = await t.createCropImageUrl(F.value, Q.value.x, Q.value.y, Q.value.r);
      if (K && (L.value = K, f)) {
        const x = t.dataURLtoBlob(K), M = new File([x], "cropimg.png", {
          type: x.type
        });
        nA([M], U.value, f);
      }
    }, VA = async () => {
      I.value = !0, KA(!0);
    }, bn = () => m("div", {
      class: r.em("upload-dialog", "footer")
    }, [m(ZA("el-button"), {
      type: "text",
      class: "cancel",
      onClick: wA
    }, {
      default: () => [RA("取消")]
    }), m(ZA("el-button"), {
      type: "primary",
      class: "comfire",
      onClick: VA,
      loading: I.value
    }, {
      default: () => [RA("确认")]
    })]), fr = (f, K) => {
      if (t.cutShape === "DEFAULT") {
        const {
          width: x,
          height: M
        } = n.value.getBoundingClientRect(), YA = (300 - x) / 2, WA = (300 - M) / 2, UA = K / Q.value.r, pA = x * UA, HA = M * UA, ae = -(Q.value.x - Q.value.r - YA) * UA, kn = -(Q.value.y - Q.value.r - WA) * UA;
        f.style.width = "".concat(pA, "px"), f.style.height = "".concat(HA, "px"), f.style.transform = "translate(".concat(ae, "px,").concat(kn, "px)");
      } else
        f.style.width = "".concat(K * 2, "px"), f.style.height = "".concat(K * 2, "px");
    }, Dn = (f, K) => {
      f.style.transformOrigin = "".concat(K, "px ").concat(K, "px"), f.style.scale = y.value;
    }, be = (f, K) => {
      if (t.cutShape === "DEFAULT") {
        const {
          width: x,
          height: M
        } = n.value.getBoundingClientRect(), YA = (300 - x / y.value) / 2, WA = (300 - M / y.value) / 2, UA = K / Q.value.r, pA = -(Q.value.x - Q.value.r - YA) * UA, HA = -(Q.value.y - Q.value.r - WA) * UA;
        Dn(f, K), f.style.transform = "translate(".concat(pA, "px,").concat(HA, "px)");
      } else {
        300 - (Q.value.x + Q.value.r);
        const x = Q.value.x - Q.value.r;
        if (K === 60) {
          let M = (43 - x) / 2.5;
          M < -17.14 && (M = -17.14), f.style.transform = "translateX(".concat(M, "px"), f.style.scale = y.value;
        }
        if (K === 18) {
          let M = (43 - x) / 8.3;
          M < -5.16 && (M = -5.16), f.style.transform = "translateX(".concat(M, "px");
        }
        f.style.scale = y.value;
      }
    }, xn = async () => {
      if (y.value = 1, H = 0, await aA(), t.cutShape === "DEFAULT") {
        const f = "circle(".concat(Q.value.r, "px at ").concat(Q.value.x, "px ").concat(Q.value.y, "px)");
        F.value.style.clipPath = f;
      } else {
        const f = "inset(0  ".concat(300 - (Q.value.x + Q.value.r), "px 0 ").concat(Q.value.x - Q.value.r, "px)");
        F.value.style.clipPath = f;
      }
      fr(o.value, 60), fr(i.value, 18);
    }, Sn = () => {
      l.value = !1;
    }, pr = () => {
      const {
        width: f,
        height: K
      } = n.value.getBoundingClientRect(), x = (300 - f) / 2, M = (300 - K) / 2;
      Q.value.x < x + Q.value.r ? Q.value.x = x + Q.value.r : Q.value.x > 300 - Q.value.r - x && (Q.value.x = f - Q.value.r + x), Q.value.y < M + Q.value.r ? Q.value.y = M + Q.value.r : Q.value.y > 300 - Q.value.r - M && (Q.value.y = K + M - Q.value.r);
    }, Mn = (f) => {
      if (l.value && y.value === 1 && f && f.target && g.value) {
        const {
          width: K,
          height: x
        } = n.value.getBoundingClientRect(), {
          pageX: M,
          pageY: YA
        } = f, WA = (300 - K) / 2, UA = (300 - x) / 2, pA = w.value - M, HA = p.value - YA;
        if (Q.value.x - pA >= WA + Q.value.r && Q.value.x - pA >= Q.value.r && Q.value.x - pA <= 300 - Q.value.r - WA && Q.value.x - pA <= 300 - Q.value.r && (Q.value.oldx = Q.value.x, Q.value.x -= pA), Q.value.y - HA >= UA + Q.value.r && Q.value.y - HA >= Q.value.r && Q.value.y - HA <= 300 - Q.value.r - UA && Q.value.y - HA <= 300 - Q.value.r && (Q.value.oldy = Q.value.y, Q.value.y -= HA), pr(), t.cutShape === "DEFAULT") {
          const ae = "circle(".concat(Q.value.r, "px at ").concat(Q.value.x, "px ").concat(Q.value.y, "px)");
          F.value.style.clipPath = ae;
        } else {
          const ae = "inset(0  ".concat(300 - (Q.value.x + Q.value.r), "px 0 ").concat(Q.value.x - Q.value.r, "px)");
          F.value.style.clipPath = ae;
        }
        w.value = M, p.value = YA, be(o.value, 60), be(i.value, 18);
      }
    }, Tn = (f) => {
      f.stopPropagation(), f.preventDefault();
      const {
        pageX: K,
        pageY: x
      } = f;
      w.value = K, p.value = x, l.value = !0;
    }, On = () => {
      l.value = !1;
    }, Gn = (f) => {
      [n.value, s.value].forEach((K) => {
        const {
          width: x,
          height: M
        } = K.getBoundingClientRect();
        K.style.transformOrigin = "".concat(Q.value.x - (300 - x / f) / 2, "px ").concat(Q.value.y - (300 - M / f) / 2, "px"), K.style.scale = f;
      }), pr(), be(o.value, 60), be(i.value, 18);
    }, Vn = () => {
      g.value && (H += 1, g.value.style.transform = "rotate(".concat(H * 90, "deg)"), C.value.style.transform = "rotate(".concat(H * 90, "deg)"), u.value.style.transform = "rotate(".concat(H * 90, "deg)"));
    }, Rn = (f) => {
      f.stopPropagation(), f.preventDefault(), A("change", "");
    };
    return re(() => y.value, (f) => {
      Gn(f);
    }), {
      ns: r,
      c: t,
      size: y,
      uploadUrl: V,
      headers: z,
      files: b,
      limit: N,
      dialogVisible: B,
      tempFiles: U,
      uploadTag: I,
      defaultAvatar: E,
      previewImgContainer: g,
      upload1: a,
      upload2: c,
      topImgRef: n,
      croparea: F,
      bottomImgRef: s,
      cropImgPreviewUrl: L,
      largePreviewImgref: o,
      smallPreviewImgref: i,
      smallPreviewImgContainer: u,
      largePreviewImgContainer: C,
      overturn: Vn,
      onDownload: gA,
      onError: _,
      onRemove: q,
      onSuccess: dA,
      beforeUpload: BA,
      openDialog: cA,
      renderFooter: bn,
      overlimit: nA,
      onTempSuccess: uA,
      mouseMove: Mn,
      mouseUp: On,
      mouseDown: Tn,
      mouseOut: Sn,
      imgload: xn,
      onChange: fA,
      onDelete: Rn
    };
  },
  render() {
    return m("div", {
      class: this.ns.b(),
      title: "仅支持JPEG,JPG,PNG类型文件"
    }, [m("div", {
      class: [this.ns.e("avatar-preview"), this.ns.is("is-rect", this.c.cutShape === "IDRECT")]
    }, [this.files && this.files.length > 0 ? m("img", {
      src: this.files[0].url,
      alt: ""
    }, null) : m("img", {
      src: this.defaultAvatar,
      alt: ""
    }, null), m("div", {
      class: this.ns.em("avatar-preview", "upicon")
    }, [m(ZA("el-upload"), Hr({
      ref: "upload1",
      "file-list": this.tempFiles,
      action: this.uploadUrl,
      headers: this.headers,
      multiple: !1,
      "auto-upload": !1,
      limit: 1,
      "show-file-list": !1,
      accept: "images/*",
      "on-change": this.onChange,
      "on-exceed": this.overlimit,
      onSuccess: this.openDialog
    }, this.$attrs), {
      trigger: () => m("div", {
        class: this.ns.em("avatar-preview", "avatar-action")
      }, [m("i", {
        class: "fa fa-camera change-avatar",
        "aria-hidden": "true"
      }, null), this.files && this.files.length > 0 ? m("i", {
        class: "fa fa-trash",
        "aria-hidden": "true",
        onClick: this.onDelete
      }, null) : null])
    })])]), m(ZA("el-dialog"), {
      modelValue: this.dialogVisible,
      "onUpdate:modelValue": (e) => this.dialogVisible = e,
      title: "上传头像",
      class: this.ns.e("upload-dialog"),
      width: 660
    }, {
      default: () => m("div", {
        class: this.ns.em("upload-dialog", "content")
      }, [m("div", {
        class: this.ns.em("upload-dialog", "content-left")
      }, [m("div", {
        class: this.ns.em("upload-dialog", "content-left-img")
      }, [this.tempFiles && this.tempFiles.length > 0 ? m("div", {
        class: "img-container",
        ref: "previewImgContainer"
      }, [m("div", {
        class: "img-bottom-container"
      }, [m("img", {
        ref: "bottomImgRef",
        class: "img-bottom",
        src: this.tempFiles[0].url,
        alt: ""
      }, null)]), m("div", {
        class: "img-modal"
      }, null), m("div", {
        class: "img-croparea",
        ref: "croparea",
        onMousemove: this.mouseMove,
        onMousedown: this.mouseDown,
        onMouseup: this.mouseUp,
        onMouseout: this.mouseOut
      }, [m("img", {
        ref: "topImgRef",
        class: "img-top",
        src: this.tempFiles[0].url,
        onLoad: this.imgload
      }, null)])]) : null]), m("div", {
        class: this.ns.em("upload-dialog", "content-left-slider")
      }, [m(ZA("el-slider"), {
        modelValue: this.size,
        "onUpdate:modelValue": (e) => this.size = e,
        max: 2,
        min: 1,
        step: 0.1
      }, null), m("div", {
        class: this.ns.em("upload-dialog", "overturn"),
        onClick: this.overturn
      }, [m("svg", {
        viewBox: "0 0 16 16",
        xmlns: "http://www.w3.org/2000/svg",
        height: "1em",
        width: "1em",
        preserveAspectRatio: "xMidYMid meet",
        focusable: "false",
        fill: "currentColor"
      }, [m("g", {
        id: "atsnormal/rotate-right",
        "stroke-width": "1",
        "fill-rule": "evenodd"
      }, [m("g", {
        id: "ats编组",
        transform: "translate(.954 .346)",
        "fill-rule": "nonzero"
      }, [m("path", {
        d: "M12.5 5.761a1.7 1.7 0 0 1 1.694 1.553l.006.147v6.093a1.7 1.7 0 0 1-1.553 1.694l-.147.006H5.164a1.7 1.7 0 0 1-1.694-1.553l-.006-.147V7.461a1.7 1.7 0 0 1 1.553-1.694l.147-.006H12.5zm0 1.2H5.164a.5.5 0 0 0-.492.41l-.008.09v6.093a.5.5 0 0 0 .41.492l.09.008H12.5a.5.5 0 0 0 .492-.41l.008-.09V7.461a.5.5 0 0 0-.5-.5zM7.288 0a.33.33 0 0 1 .202.07l2.05 1.598a.33.33 0 0 1-.003.523l-2.05 1.55a.33.33 0 0 1-.53-.263v-.951l-2.175-.006C2.518 2.507 1.37 3.725 1.2 6.399A.6.6 0 1 1 0 6.323c.21-3.277 1.852-5.02 4.788-5.002l2.168.009v-1a.33.33 0 0 1 .33-.33z",
        id: "ats形状结合"
      }, null)])])])])]), m("div", {
        class: this.ns.em("upload-dialog", "content-left-action")
      }, [m(ZA("el-upload"), Hr({
        ref: "upload2",
        "file-list": this.files,
        action: this.uploadUrl,
        headers: this.headers,
        multiple: !1,
        limit: 1,
        "on-exceed": this.overlimit,
        "on-change": this.onChange,
        "show-file-list": !1,
        accept: "images/*",
        "auto-upload": !1,
        onSuccess: this.onTempSuccess,
        onError: this.onError
      }, this.$attrs), {
        trigger: () => m("span", {
          class: "upload-action"
        }, [m("i", {
          class: "fa fa-upload",
          "aria-hidden": "true"
        }, null), m("span", {
          class: "upload-avatar"
        }, [RA("上传头像")])])
      }), m("span", {
        class: "img-tip"
      }, [RA("最佳尺寸 120 x 120 像素")])])]), m("div", {
        class: this.ns.em("upload-dialog", "content-right")
      }, [m("div", {
        class: this.ns.em("upload-dialog", "content-right-tip")
      }, [RA("预览")]), m("div", {
        class: this.ns.em("upload-dialog", "content-right-large-preview")
      }, [m("div", {
        class: [this.ns.em("upload-dialog", "preview-container--large"), this.ns.is("is-rect", this.c.cutShape === "IDRECT")],
        ref: "largePreviewImgContainer"
      }, [this.tempFiles && this.tempFiles.length > 0 ? m("img", {
        ref: "largePreviewImgref",
        src: this.tempFiles[0].url,
        alt: ""
      }, null) : null]), m("div", {
        class: "size-tip"
      }, [RA("120 x 120")])]), m("div", {
        class: this.ns.em("upload-dialog", "content-right-small-preview")
      }, [m("div", {
        class: [this.ns.em("upload-dialog", "preview-container--small"), this.ns.is("is-rect", this.c.cutShape === "IDRECT")],
        ref: "smallPreviewImgContainer"
      }, [this.tempFiles && this.tempFiles.length > 0 ? m("img", {
        ref: "smallPreviewImgref",
        src: this.tempFiles[0].url,
        alt: ""
      }, null) : null]), m("div", {
        class: "size-tip"
      }, [RA("36 x 36")])])])]),
      footer: () => this.renderFooter()
    })]);
  }
});
/*!
 * html2canvas 1.4.1 <https://html2canvas.hertzen.com>
 * Copyright (c) 2022 Niklas von Hertzen <https://hertzen.com>
 * Released under MIT License
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Jt = function(e, A) {
  return Jt = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, t) {
    r.__proto__ = t;
  } || function(r, t) {
    for (var B in t)
      Object.prototype.hasOwnProperty.call(t, B) && (r[B] = t[B]);
  }, Jt(e, A);
};
function QA(e, A) {
  if (typeof A != "function" && A !== null)
    throw new TypeError("Class extends value " + String(A) + " is not a constructor or null");
  Jt(e, A);
  function r() {
    this.constructor = e;
  }
  e.prototype = A === null ? Object.create(A) : (r.prototype = A.prototype, new r());
}
var Yt = function() {
  return Yt = Object.assign || function(e) {
    for (var A, r = 1, t = arguments.length; r < t; r++) {
      A = arguments[r];
      for (var B in A)
        Object.prototype.hasOwnProperty.call(A, B) && (e[B] = A[B]);
    }
    return e;
  }, Yt.apply(this, arguments);
};
function AA(e, A, r, t) {
  function B(n) {
    return n instanceof r ? n : new r(function(s) {
      s(n);
    });
  }
  return new (r || (r = Promise))(function(n, s) {
    function o(c) {
      try {
        a(t.next(c));
      } catch (l) {
        s(l);
      }
    }
    function i(c) {
      try {
        a(t.throw(c));
      } catch (l) {
        s(l);
      }
    }
    function a(c) {
      c.done ? n(c.value) : B(c.value).then(o, i);
    }
    a((t = t.apply(e, A || [])).next());
  });
}
function j(e, A) {
  var r = { label: 0, sent: function() {
    if (n[0] & 1)
      throw n[1];
    return n[1];
  }, trys: [], ops: [] }, t, B, n, s;
  return s = { next: o(0), throw: o(1), return: o(2) }, typeof Symbol == "function" && (s[Symbol.iterator] = function() {
    return this;
  }), s;
  function o(a) {
    return function(c) {
      return i([a, c]);
    };
  }
  function i(a) {
    if (t)
      throw new TypeError("Generator is already executing.");
    for (; r; )
      try {
        if (t = 1, B && (n = a[0] & 2 ? B.return : a[0] ? B.throw || ((n = B.return) && n.call(B), 0) : B.next) && !(n = n.call(B, a[1])).done)
          return n;
        switch (B = 0, n && (a = [a[0] & 2, n.value]), a[0]) {
          case 0:
          case 1:
            n = a;
            break;
          case 4:
            return r.label++, { value: a[1], done: !1 };
          case 5:
            r.label++, B = a[1], a = [0];
            continue;
          case 7:
            a = r.ops.pop(), r.trys.pop();
            continue;
          default:
            if (n = r.trys, !(n = n.length > 0 && n[n.length - 1]) && (a[0] === 6 || a[0] === 2)) {
              r = 0;
              continue;
            }
            if (a[0] === 3 && (!n || a[1] > n[0] && a[1] < n[3])) {
              r.label = a[1];
              break;
            }
            if (a[0] === 6 && r.label < n[1]) {
              r.label = n[1], n = a;
              break;
            }
            if (n && r.label < n[2]) {
              r.label = n[2], r.ops.push(a);
              break;
            }
            n[2] && r.ops.pop(), r.trys.pop();
            continue;
        }
        a = A.call(e, r);
      } catch (c) {
        a = [6, c], B = 0;
      } finally {
        t = n = 0;
      }
    if (a[0] & 5)
      throw a[1];
    return { value: a[0] ? a[1] : void 0, done: !0 };
  }
}
function De(e, A, r) {
  if (r || arguments.length === 2)
    for (var t = 0, B = A.length, n; t < B; t++)
      (n || !(t in A)) && (n || (n = Array.prototype.slice.call(A, 0, t)), n[t] = A[t]);
  return e.concat(n || A);
}
var mA = (
  /** @class */
  function() {
    function e(A, r, t, B) {
      this.left = A, this.top = r, this.width = t, this.height = B;
    }
    return e.prototype.add = function(A, r, t, B) {
      return new e(this.left + A, this.top + r, this.width + t, this.height + B);
    }, e.fromClientRect = function(A, r) {
      return new e(r.left + A.windowBounds.left, r.top + A.windowBounds.top, r.width, r.height);
    }, e.fromDOMRectList = function(A, r) {
      var t = Array.from(r).find(function(B) {
        return B.width !== 0;
      });
      return t ? new e(t.left + A.windowBounds.left, t.top + A.windowBounds.top, t.width, t.height) : e.EMPTY;
    }, e.EMPTY = new e(0, 0, 0, 0), e;
  }()
), ut = function(e, A) {
  return mA.fromClientRect(e, A.getBoundingClientRect());
}, rs = function(e) {
  var A = e.body, r = e.documentElement;
  if (!A || !r)
    throw new Error("Unable to get document size");
  var t = Math.max(Math.max(A.scrollWidth, r.scrollWidth), Math.max(A.offsetWidth, r.offsetWidth), Math.max(A.clientWidth, r.clientWidth)), B = Math.max(Math.max(A.scrollHeight, r.scrollHeight), Math.max(A.offsetHeight, r.offsetHeight), Math.max(A.clientHeight, r.clientHeight));
  return new mA(0, 0, t, B);
}, Ut = function(e) {
  for (var A = [], r = 0, t = e.length; r < t; ) {
    var B = e.charCodeAt(r++);
    if (B >= 55296 && B <= 56319 && r < t) {
      var n = e.charCodeAt(r++);
      (n & 64512) === 56320 ? A.push(((B & 1023) << 10) + (n & 1023) + 65536) : (A.push(B), r--);
    } else
      A.push(B);
  }
  return A;
}, k = function() {
  for (var e = [], A = 0; A < arguments.length; A++)
    e[A] = arguments[A];
  if (String.fromCodePoint)
    return String.fromCodePoint.apply(String, e);
  var r = e.length;
  if (!r)
    return "";
  for (var t = [], B = -1, n = ""; ++B < r; ) {
    var s = e[B];
    s <= 65535 ? t.push(s) : (s -= 65536, t.push((s >> 10) + 55296, s % 1024 + 56320)), (B + 1 === r || t.length > 16384) && (n += String.fromCharCode.apply(String, t), t.length = 0);
  }
  return n;
}, mr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Bs = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var xe = 0; xe < mr.length; xe++)
  Bs[mr.charCodeAt(xe)] = xe;
var Kr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", we = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Se = 0; Se < Kr.length; Se++)
  we[Kr.charCodeAt(Se)] = Se;
var ns = function(e) {
  var A = e.length * 0.75, r = e.length, t, B = 0, n, s, o, i;
  e[e.length - 1] === "=" && (A--, e[e.length - 2] === "=" && A--);
  var a = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(A) : new Array(A), c = Array.isArray(a) ? a : new Uint8Array(a);
  for (t = 0; t < r; t += 4)
    n = we[e.charCodeAt(t)], s = we[e.charCodeAt(t + 1)], o = we[e.charCodeAt(t + 2)], i = we[e.charCodeAt(t + 3)], c[B++] = n << 2 | s >> 4, c[B++] = (s & 15) << 4 | o >> 2, c[B++] = (o & 3) << 6 | i & 63;
  return a;
}, ss = function(e) {
  for (var A = e.length, r = [], t = 0; t < A; t += 2)
    r.push(e[t + 1] << 8 | e[t]);
  return r;
}, os = function(e) {
  for (var A = e.length, r = [], t = 0; t < A; t += 4)
    r.push(e[t + 3] << 24 | e[t + 2] << 16 | e[t + 1] << 8 | e[t]);
  return r;
}, XA = 5, wr = 6 + 5, It = 2, is = wr - XA, mB = 65536 >> XA, as = 1 << XA, yt = as - 1, cs = 1024 >> XA, ls = mB + cs, Qs = ls, gs = 32, ws = Qs + gs, us = 65536 >> wr, Us = 1 << is, Cs = Us - 1, vr = function(e, A, r) {
  return e.slice ? e.slice(A, r) : new Uint16Array(Array.prototype.slice.call(e, A, r));
}, Fs = function(e, A, r) {
  return e.slice ? e.slice(A, r) : new Uint32Array(Array.prototype.slice.call(e, A, r));
}, hs = function(e, A) {
  var r = ns(e), t = Array.isArray(r) ? os(r) : new Uint32Array(r), B = Array.isArray(r) ? ss(r) : new Uint16Array(r), n = 24, s = vr(B, n / 2, t[4] / 2), o = t[5] === 2 ? vr(B, (n + t[4]) / 2) : Fs(t, Math.ceil((n + t[4]) / 4));
  return new ds(t[0], t[1], t[2], t[3], s, o);
}, ds = (
  /** @class */
  function() {
    function e(A, r, t, B, n, s) {
      this.initialValue = A, this.errorValue = r, this.highStart = t, this.highValueIndex = B, this.index = n, this.data = s;
    }
    return e.prototype.get = function(A) {
      var r;
      if (A >= 0) {
        if (A < 55296 || A > 56319 && A <= 65535)
          return r = this.index[A >> XA], r = (r << It) + (A & yt), this.data[r];
        if (A <= 65535)
          return r = this.index[mB + (A - 55296 >> XA)], r = (r << It) + (A & yt), this.data[r];
        if (A < this.highStart)
          return r = ws - us + (A >> wr), r = this.index[r], r += A >> XA & Cs, r = this.index[r], r = (r << It) + (A & yt), this.data[r];
        if (A <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, e;
  }()
), Lr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", fs = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Me = 0; Me < Lr.length; Me++)
  fs[Lr.charCodeAt(Me)] = Me;
var ps = "KwAAAAAAAAAACA4AUD0AADAgAAACAAAAAAAIABAAGABAAEgAUABYAGAAaABgAGgAYgBqAF8AZwBgAGgAcQB5AHUAfQCFAI0AlQCdAKIAqgCyALoAYABoAGAAaABgAGgAwgDKAGAAaADGAM4A0wDbAOEA6QDxAPkAAQEJAQ8BFwF1AH0AHAEkASwBNAE6AUIBQQFJAVEBWQFhAWgBcAF4ATAAgAGGAY4BlQGXAZ8BpwGvAbUBvQHFAc0B0wHbAeMB6wHxAfkBAQIJAvEBEQIZAiECKQIxAjgCQAJGAk4CVgJeAmQCbAJ0AnwCgQKJApECmQKgAqgCsAK4ArwCxAIwAMwC0wLbAjAA4wLrAvMC+AIAAwcDDwMwABcDHQMlAy0DNQN1AD0DQQNJA0kDSQNRA1EDVwNZA1kDdQB1AGEDdQBpA20DdQN1AHsDdQCBA4kDkQN1AHUAmQOhA3UAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AKYDrgN1AHUAtgO+A8YDzgPWAxcD3gPjA+sD8wN1AHUA+wMDBAkEdQANBBUEHQQlBCoEFwMyBDgEYABABBcDSARQBFgEYARoBDAAcAQzAXgEgASIBJAEdQCXBHUAnwSnBK4EtgS6BMIEyAR1AHUAdQB1AHUAdQCVANAEYABgAGAAYABgAGAAYABgANgEYADcBOQEYADsBPQE/AQEBQwFFAUcBSQFLAU0BWQEPAVEBUsFUwVbBWAAYgVgAGoFcgV6BYIFigWRBWAAmQWfBaYFYABgAGAAYABgAKoFYACxBbAFuQW6BcEFwQXHBcEFwQXPBdMF2wXjBeoF8gX6BQIGCgYSBhoGIgYqBjIGOgZgAD4GRgZMBmAAUwZaBmAAYABgAGAAYABgAGAAYABgAGAAYABgAGIGYABpBnAGYABgAGAAYABgAGAAYABgAGAAYAB4Bn8GhQZgAGAAYAB1AHcDFQSLBmAAYABgAJMGdQA9A3UAmwajBqsGqwaVALMGuwbDBjAAywbSBtIG1QbSBtIG0gbSBtIG0gbdBuMG6wbzBvsGAwcLBxMHAwcbByMHJwcsBywHMQcsB9IGOAdAB0gHTgfSBkgHVgfSBtIG0gbSBtIG0gbSBtIG0gbSBiwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdgAGAALAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdbB2MHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB2kH0gZwB64EdQB1AHUAdQB1AHUAdQB1AHUHfQdgAIUHjQd1AHUAlQedB2AAYAClB6sHYACzB7YHvgfGB3UAzgfWBzMB3gfmB1EB7gf1B/0HlQENAQUIDQh1ABUIHQglCBcDLQg1CD0IRQhNCEEDUwh1AHUAdQBbCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIcAh3CHoIMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIgggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAALAcsBywHLAcsBywHLAcsBywHLAcsB4oILAcsB44I0gaWCJ4Ipgh1AHUAqgiyCHUAdQB1AHUAdQB1AHUAdQB1AHUAtwh8AXUAvwh1AMUIyQjRCNkI4AjoCHUAdQB1AO4I9gj+CAYJDgkTCS0HGwkjCYIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiAAIAAAAFAAYABgAGIAXwBgAHEAdQBFAJUAogCyAKAAYABgAEIA4ABGANMA4QDxAMEBDwE1AFwBLAE6AQEBUQF4QkhCmEKoQrhCgAHIQsAB0MLAAcABwAHAAeDC6ABoAHDCwMMAAcABwAHAAdDDGMMAAcAB6MM4wwjDWMNow3jDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEjDqABWw6bDqABpg6gAaABoAHcDvwOPA+gAaABfA/8DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DpcPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB9cPKwkyCToJMAB1AHUAdQBCCUoJTQl1AFUJXAljCWcJawkwADAAMAAwAHMJdQB2CX4JdQCECYoJjgmWCXUAngkwAGAAYABxAHUApgn3A64JtAl1ALkJdQDACTAAMAAwADAAdQB1AHUAdQB1AHUAdQB1AHUAowYNBMUIMAAwADAAMADICcsJ0wnZCRUE4QkwAOkJ8An4CTAAMAB1AAAKvwh1AAgKDwoXCh8KdQAwACcKLgp1ADYKqAmICT4KRgowADAAdQB1AE4KMAB1AFYKdQBeCnUAZQowADAAMAAwADAAMAAwADAAMAAVBHUAbQowADAAdQC5CXUKMAAwAHwBxAijBogEMgF9CoQKiASMCpQKmgqIBKIKqgquCogEDQG2Cr4KxgrLCjAAMADTCtsKCgHjCusK8Qr5CgELMAAwADAAMAB1AIsECQsRC3UANAEZCzAAMAAwADAAMAB1ACELKQswAHUANAExCzkLdQBBC0kLMABRC1kLMAAwADAAMAAwADAAdQBhCzAAMAAwAGAAYABpC3ELdwt/CzAAMACHC4sLkwubC58Lpwt1AK4Ltgt1APsDMAAwADAAMAAwADAAMAAwAL4LwwvLC9IL1wvdCzAAMADlC+kL8Qv5C/8LSQswADAAMAAwADAAMAAwADAAMAAHDDAAMAAwADAAMAAODBYMHgx1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1ACYMMAAwADAAdQB1AHUALgx1AHUAdQB1AHUAdQA2DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AD4MdQBGDHUAdQB1AHUAdQB1AEkMdQB1AHUAdQB1AFAMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQBYDHUAdQB1AF8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUA+wMVBGcMMAAwAHwBbwx1AHcMfwyHDI8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAYABgAJcMMAAwADAAdQB1AJ8MlQClDDAAMACtDCwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB7UMLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AA0EMAC9DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAsBywHLAcsBywHLAcsBywHLQcwAMEMyAwsBywHLAcsBywHLAcsBywHLAcsBywHzAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1ANQM2QzhDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMABgAGAAYABgAGAAYABgAOkMYADxDGAA+AwADQYNYABhCWAAYAAODTAAMAAwADAAFg1gAGAAHg37AzAAMAAwADAAYABgACYNYAAsDTQNPA1gAEMNPg1LDWAAYABgAGAAYABgAGAAYABgAGAAUg1aDYsGVglhDV0NcQBnDW0NdQ15DWAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAlQCBDZUAiA2PDZcNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAnw2nDTAAMAAwADAAMAAwAHUArw23DTAAMAAwADAAMAAwADAAMAAwADAAMAB1AL8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQDHDTAAYABgAM8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA1w11ANwNMAAwAD0B5A0wADAAMAAwADAAMADsDfQN/A0EDgwOFA4wABsOMAAwADAAMAAwADAAMAAwANIG0gbSBtIG0gbSBtIG0gYjDigOwQUuDsEFMw7SBjoO0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGQg5KDlIOVg7SBtIGXg5lDm0OdQ7SBtIGfQ6EDooOjQ6UDtIGmg6hDtIG0gaoDqwO0ga0DrwO0gZgAGAAYADEDmAAYAAkBtIGzA5gANIOYADaDokO0gbSBt8O5w7SBu8O0gb1DvwO0gZgAGAAxA7SBtIG0gbSBtIGYABgAGAAYAAED2AAsAUMD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHJA8sBywHLAcsBywHLAccDywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywPLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAc0D9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHPA/SBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gYUD0QPlQCVAJUAMAAwADAAMACVAJUAlQCVAJUAlQCVAEwPMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA//8EAAQABAAEAAQABAAEAAQABAANAAMAAQABAAIABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACgATABcAHgAbABoAHgAXABYAEgAeABsAGAAPABgAHABLAEsASwBLAEsASwBLAEsASwBLABgAGAAeAB4AHgATAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAGwASAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWAA0AEQAeAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAFAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJABYAGgAbABsAGwAeAB0AHQAeAE8AFwAeAA0AHgAeABoAGwBPAE8ADgBQAB0AHQAdAE8ATwAXAE8ATwBPABYAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwBWAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsABAAbABsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEAA0ADQBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABABQACsAKwArACsAKwArACsAKwAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUAAaABoAUABQAFAAUABQAEwAHgAbAFAAHgAEACsAKwAEAAQABAArAFAAUABQAFAAUABQACsAKwArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQACsAUABQACsAKwAEACsABAAEAAQABAAEACsAKwArACsABAAEACsAKwAEAAQABAArACsAKwAEACsAKwArACsAKwArACsAUABQAFAAUAArAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAAQABABQAFAAUAAEAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAArACsAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AGwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAKwArACsAKwArAAQABAAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAAQAUAArAFAAUABQAFAAUABQACsAKwArAFAAUABQACsAUABQAFAAUAArACsAKwBQAFAAKwBQACsAUABQACsAKwArAFAAUAArACsAKwBQAFAAUAArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAArACsAKwAEAAQABAArAAQABAAEAAQAKwArAFAAKwArACsAKwArACsABAArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAHgAeAB4AHgAeAB4AGwAeACsAKwArACsAKwAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAUABQAFAAKwArACsAKwArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwAOAFAAUABQAFAAUABQAFAAHgBQAAQABAAEAA4AUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAKwArAAQAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAKwArACsAKwArACsAUAArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAXABcAFwAXABcACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAXAArAFwAXABcAFwAXABcAFwAXABcAFwAKgBcAFwAKgAqACoAKgAqACoAKgAqACoAXAArACsAXABcAFwAXABcACsAXAArACoAKgAqACoAKgAqACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwBcAFwAXABcAFAADgAOAA4ADgAeAA4ADgAJAA4ADgANAAkAEwATABMAEwATAAkAHgATAB4AHgAeAAQABAAeAB4AHgAeAB4AHgBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAADQAEAB4ABAAeAAQAFgARABYAEQAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAAQABAAEAAQADQAEAAQAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAA0ADQAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeACsAHgAeAA4ADgANAA4AHgAeAB4AHgAeAAkACQArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgBcAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4AHgAeAB4AXABcAFwAXABcAFwAKgAqACoAKgBcAFwAXABcACoAKgAqAFwAKgAqACoAXABcACoAKgAqACoAKgAqACoAXABcAFwAKgAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwAKgBLAEsASwBLAEsASwBLAEsASwBLACoAKgAqACoAKgAqAFAAUABQAFAAUABQACsAUAArACsAKwArACsAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAKwBQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsABAAEAAQAHgANAB4AHgAeAB4AHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUAArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWABEAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAANAA0AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUAArAAQABAArACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAA0ADQAVAFwADQAeAA0AGwBcACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwAeAB4AEwATAA0ADQAOAB4AEwATAB4ABAAEAAQACQArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAHgArACsAKwATABMASwBLAEsASwBLAEsASwBLAEsASwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAXABcAFwAXABcACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXAArACsAKwAqACoAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsAHgAeAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKwArAAQASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACoAKgAqACoAKgAqACoAXAAqACoAKgAqACoAKgArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABABQAFAAUABQAFAAUABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgANAA0ADQANAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwAeAB4AHgAeAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArAA0ADQANAA0ADQBLAEsASwBLAEsASwBLAEsASwBLACsAKwArAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUAAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAAQAUABQAFAAUABQAFAABABQAFAABAAEAAQAUAArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQACsAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQACsAKwAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQACsAHgAeAB4AHgAeAB4AHgAOAB4AKwANAA0ADQANAA0ADQANAAkADQANAA0ACAAEAAsABAAEAA0ACQANAA0ADAAdAB0AHgAXABcAFgAXABcAFwAWABcAHQAdAB4AHgAUABQAFAANAAEAAQAEAAQABAAEAAQACQAaABoAGgAaABoAGgAaABoAHgAXABcAHQAVABUAHgAeAB4AHgAeAB4AGAAWABEAFQAVABUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ADQAeAA0ADQANAA0AHgANAA0ADQAHAB4AHgAeAB4AKwAEAAQABAAEAAQABAAEAAQABAAEAFAAUAArACsATwBQAFAAUABQAFAAHgAeAB4AFgARAE8AUABPAE8ATwBPAFAAUABQAFAAUAAeAB4AHgAWABEAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArABsAGwAbABsAGwAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGgAbABsAGwAbABoAGwAbABoAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAFAAGgAeAB0AHgBQAB4AGgAeAB4AHgAeAB4AHgAeAB4AHgBPAB4AUAAbAB4AHgBQAFAAUABQAFAAHgAeAB4AHQAdAB4AUAAeAFAAHgBQAB4AUABPAFAAUAAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgBQAFAAUABQAE8ATwBQAFAAUABQAFAATwBQAFAATwBQAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAUABQAFAATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABPAB4AHgArACsAKwArAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAdAB4AHgAeAB0AHQAeAB4AHQAeAB4AHgAdAB4AHQAbABsAHgAdAB4AHgAeAB4AHQAeAB4AHQAdAB0AHQAeAB4AHQAeAB0AHgAdAB0AHQAdAB0AHQAeAB0AHgAeAB4AHgAeAB0AHQAdAB0AHgAeAB4AHgAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB0AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAdAB0AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHQAdAB0AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHQAdAB4AHgAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AJQAlAB0AHQAlAB4AJQAlACUAIAAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAeAB0AJQAdAB0AHgAdAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAdAB0AHQAdACUAHgAlACUAJQAdACUAJQAdAB0AHQAlACUAHQAdACUAHQAdACUAJQAlAB4AHQAeAB4AHgAeAB0AHQAlAB0AHQAdAB0AHQAdACUAJQAlACUAJQAdACUAJQAgACUAHQAdACUAJQAlACUAJQAlACUAJQAeAB4AHgAlACUAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AFwAXABcAFwAXABcAHgATABMAJQAeAB4AHgAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARABYAEQAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANAA0AHgANAB4ADQANAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwAlACUAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACsAKwArACsAKwArACsAKwArACsAKwArAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBPAE8ATwBPAE8ATwBPAE8AJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeAAQAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUABQAAQAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAUABQAFAAUABQAAQABAAEACsABAAEACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAKwBQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAA0ADQANAA0ADQANAA0ADQAeACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAArACsAKwArAFAAUABQAFAAUAANAA0ADQANAA0ADQAUACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQANAA0ADQANAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAANACsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAB4AHgAeAB4AHgArACsAKwArACsAKwAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANAFAABAAEAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAEAAQABAAEAB4ABAAEAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsABAAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLAA0ADQArAB4ABABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUAAeAFAAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAAEAAQADgANAA0AEwATAB4AHgAeAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAFAAUABQAFAABAAEACsAKwAEAA0ADQAeAFAAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcAFwADQANAA0AKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQAKwAEAAQAKwArAAQABAAEAAQAUAAEAFAABAAEAA0ADQANACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABABQAA4AUAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANAFAADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAaABoAGgAaAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAJAAkACQAJAAkACQAJABYAEQArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AHgAeACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAARwBHABUARwAJACsAKwArACsAKwArACsAKwArACsAKwAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAKwArACsAKwArACsAKwArACsAKwArACsAKwBRAFEAUQBRACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAHgAEAAQADQAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAeAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQAHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAKwArAFAAKwArAFAAUAArACsAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAHgAeAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeACsAKwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4ABAAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAHgAeAA0ADQANAA0AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArAAQABAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwBQAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArABsAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAB4AHgAeAB4ABAAEAAQABAAEAAQABABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArABYAFgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAGgBQAFAAUAAaAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUAArACsAKwArACsAKwBQACsAKwArACsAUAArAFAAKwBQACsAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUAArAFAAKwBQACsAUAArAFAAUAArAFAAKwArAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAKwBQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeACUAJQAlAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAHgAlACUAJQAlACUAIAAgACAAJQAlACAAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACEAIQAhACEAIQAlACUAIAAgACUAJQAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAlACUAJQAlACAAIAAgACUAIAAgACAAJQAlACUAJQAlACUAJQAgACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAlAB4AJQAeACUAJQAlACUAJQAgACUAJQAlACUAHgAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACAAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABcAFwAXABUAFQAVAB4AHgAeAB4AJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAgACUAJQAgACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAIAAgACUAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACAAIAAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACAAIAAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAA==", br = 50, Hs = 1, KB = 2, vB = 3, Es = 4, Is = 5, Dr = 7, LB = 8, xr = 9, xA = 10, Wt = 11, Sr = 12, Zt = 13, ys = 14, ue = 15, _t = 16, Te = 17, ce = 18, ms = 19, Mr = 20, qt = 21, le = 22, mt = 23, _A = 24, rA = 25, Ue = 26, Ce = 27, qA = 28, Ks = 29, Be = 30, vs = 31, Oe = 32, Ge = 33, jt = 34, zt = 35, $t = 36, ye = 37, Ar = 38, et = 39, tt = 40, Kt = 41, bB = 42, Ls = 43, bs = [9001, 65288], DB = "!", $ = "×", Ve = "÷", er = hs(ps), EA = [Be, $t], tr = [Hs, KB, vB, Is], xB = [xA, LB], Tr = [Ce, Ue], Ds = tr.concat(xB), Or = [Ar, et, tt, jt, zt], xs = [ue, Zt], Ss = function(e, A) {
  A === void 0 && (A = "strict");
  var r = [], t = [], B = [];
  return e.forEach(function(n, s) {
    var o = er.get(n);
    if (o > br ? (B.push(!0), o -= br) : B.push(!1), ["normal", "auto", "loose"].indexOf(A) !== -1 && [8208, 8211, 12316, 12448].indexOf(n) !== -1)
      return t.push(s), r.push(_t);
    if (o === Es || o === Wt) {
      if (s === 0)
        return t.push(s), r.push(Be);
      var i = r[s - 1];
      return Ds.indexOf(i) === -1 ? (t.push(t[s - 1]), r.push(i)) : (t.push(s), r.push(Be));
    }
    if (t.push(s), o === vs)
      return r.push(A === "strict" ? qt : ye);
    if (o === bB || o === Ks)
      return r.push(Be);
    if (o === Ls)
      return n >= 131072 && n <= 196605 || n >= 196608 && n <= 262141 ? r.push(ye) : r.push(Be);
    r.push(o);
  }), [t, r, B];
}, vt = function(e, A, r, t) {
  var B = t[r];
  if (Array.isArray(e) ? e.indexOf(B) !== -1 : e === B)
    for (var n = r; n <= t.length; ) {
      n++;
      var s = t[n];
      if (s === A)
        return !0;
      if (s !== xA)
        break;
    }
  if (B === xA)
    for (var n = r; n > 0; ) {
      n--;
      var o = t[n];
      if (Array.isArray(e) ? e.indexOf(o) !== -1 : e === o)
        for (var i = r; i <= t.length; ) {
          i++;
          var s = t[i];
          if (s === A)
            return !0;
          if (s !== xA)
            break;
        }
      if (o !== xA)
        break;
    }
  return !1;
}, Gr = function(e, A) {
  for (var r = e; r >= 0; ) {
    var t = A[r];
    if (t === xA)
      r--;
    else
      return t;
  }
  return 0;
}, Ms = function(e, A, r, t, B) {
  if (r[t] === 0)
    return $;
  var n = t - 1;
  if (Array.isArray(B) && B[n] === !0)
    return $;
  var s = n - 1, o = n + 1, i = A[n], a = s >= 0 ? A[s] : 0, c = A[o];
  if (i === KB && c === vB)
    return $;
  if (tr.indexOf(i) !== -1)
    return DB;
  if (tr.indexOf(c) !== -1 || xB.indexOf(c) !== -1)
    return $;
  if (Gr(n, A) === LB)
    return Ve;
  if (er.get(e[n]) === Wt || (i === Oe || i === Ge) && er.get(e[o]) === Wt || i === Dr || c === Dr || i === xr || [xA, Zt, ue].indexOf(i) === -1 && c === xr || [Te, ce, ms, _A, qA].indexOf(c) !== -1 || Gr(n, A) === le || vt(mt, le, n, A) || vt([Te, ce], qt, n, A) || vt(Sr, Sr, n, A))
    return $;
  if (i === xA)
    return Ve;
  if (i === mt || c === mt)
    return $;
  if (c === _t || i === _t)
    return Ve;
  if ([Zt, ue, qt].indexOf(c) !== -1 || i === ys || a === $t && xs.indexOf(i) !== -1 || i === qA && c === $t || c === Mr || EA.indexOf(c) !== -1 && i === rA || EA.indexOf(i) !== -1 && c === rA || i === Ce && [ye, Oe, Ge].indexOf(c) !== -1 || [ye, Oe, Ge].indexOf(i) !== -1 && c === Ue || EA.indexOf(i) !== -1 && Tr.indexOf(c) !== -1 || Tr.indexOf(i) !== -1 && EA.indexOf(c) !== -1 || // (PR | PO) × ( OP | HY )? NU
  [Ce, Ue].indexOf(i) !== -1 && (c === rA || [le, ue].indexOf(c) !== -1 && A[o + 1] === rA) || // ( OP | HY ) × NU
  [le, ue].indexOf(i) !== -1 && c === rA || // NU ×	(NU | SY | IS)
  i === rA && [rA, qA, _A].indexOf(c) !== -1)
    return $;
  if ([rA, qA, _A, Te, ce].indexOf(c) !== -1)
    for (var l = n; l >= 0; ) {
      var g = A[l];
      if (g === rA)
        return $;
      if ([qA, _A].indexOf(g) !== -1)
        l--;
      else
        break;
    }
  if ([Ce, Ue].indexOf(c) !== -1)
    for (var l = [Te, ce].indexOf(i) !== -1 ? s : n; l >= 0; ) {
      var g = A[l];
      if (g === rA)
        return $;
      if ([qA, _A].indexOf(g) !== -1)
        l--;
      else
        break;
    }
  if (Ar === i && [Ar, et, jt, zt].indexOf(c) !== -1 || [et, jt].indexOf(i) !== -1 && [et, tt].indexOf(c) !== -1 || [tt, zt].indexOf(i) !== -1 && c === tt || Or.indexOf(i) !== -1 && [Mr, Ue].indexOf(c) !== -1 || Or.indexOf(c) !== -1 && i === Ce || EA.indexOf(i) !== -1 && EA.indexOf(c) !== -1 || i === _A && EA.indexOf(c) !== -1 || EA.concat(rA).indexOf(i) !== -1 && c === le && bs.indexOf(e[o]) === -1 || EA.concat(rA).indexOf(c) !== -1 && i === ce)
    return $;
  if (i === Kt && c === Kt) {
    for (var C = r[n], u = 1; C > 0 && (C--, A[C] === Kt); )
      u++;
    if (u % 2 !== 0)
      return $;
  }
  return i === Oe && c === Ge ? $ : Ve;
}, Ts = function(e, A) {
  A || (A = { lineBreak: "normal", wordBreak: "normal" });
  var r = Ss(e, A.lineBreak), t = r[0], B = r[1], n = r[2];
  (A.wordBreak === "break-all" || A.wordBreak === "break-word") && (B = B.map(function(o) {
    return [rA, Be, bB].indexOf(o) !== -1 ? ye : o;
  }));
  var s = A.wordBreak === "keep-all" ? n.map(function(o, i) {
    return o && e[i] >= 19968 && e[i] <= 40959;
  }) : void 0;
  return [t, B, s];
}, Os = (
  /** @class */
  function() {
    function e(A, r, t, B) {
      this.codePoints = A, this.required = r === DB, this.start = t, this.end = B;
    }
    return e.prototype.slice = function() {
      return k.apply(void 0, this.codePoints.slice(this.start, this.end));
    }, e;
  }()
), Gs = function(e, A) {
  var r = Ut(e), t = Ts(r, A), B = t[0], n = t[1], s = t[2], o = r.length, i = 0, a = 0;
  return {
    next: function() {
      if (a >= o)
        return { done: !0, value: null };
      for (var c = $; a < o && (c = Ms(r, n, B, ++a, s)) === $; )
        ;
      if (c !== $ || a === o) {
        var l = new Os(r, c, i, a);
        return i = a, { value: l, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, Vs = 1, Rs = 2, ve = 4, Vr = 8, nt = 10, Rr = 47, fe = 92, ks = 9, Ps = 32, Re = 34, Qe = 61, Ns = 35, Xs = 36, Js = 37, ke = 39, Pe = 40, ge = 41, Ys = 95, tA = 45, Ws = 33, Zs = 60, _s = 62, qs = 64, js = 91, zs = 93, $s = 61, Ao = 123, Ne = 63, eo = 125, kr = 124, to = 126, ro = 128, Pr = 65533, Lt = 42, PA = 43, Bo = 44, no = 58, so = 59, me = 46, oo = 0, io = 8, ao = 11, co = 14, lo = 31, Qo = 127, CA = -1, SB = 48, MB = 97, TB = 101, go = 102, wo = 117, uo = 122, OB = 65, GB = 69, VB = 70, Uo = 85, Co = 90, eA = function(e) {
  return e >= SB && e <= 57;
}, Fo = function(e) {
  return e >= 55296 && e <= 57343;
}, jA = function(e) {
  return eA(e) || e >= OB && e <= VB || e >= MB && e <= go;
}, ho = function(e) {
  return e >= MB && e <= uo;
}, fo = function(e) {
  return e >= OB && e <= Co;
}, po = function(e) {
  return ho(e) || fo(e);
}, Ho = function(e) {
  return e >= ro;
}, Xe = function(e) {
  return e === nt || e === ks || e === Ps;
}, st = function(e) {
  return po(e) || Ho(e) || e === Ys;
}, Nr = function(e) {
  return st(e) || eA(e) || e === tA;
}, Eo = function(e) {
  return e >= oo && e <= io || e === ao || e >= co && e <= lo || e === Qo;
}, DA = function(e, A) {
  return e !== fe ? !1 : A !== nt;
}, Je = function(e, A, r) {
  return e === tA ? st(A) || DA(A, r) : st(e) ? !0 : !!(e === fe && DA(e, A));
}, bt = function(e, A, r) {
  return e === PA || e === tA ? eA(A) ? !0 : A === me && eA(r) : eA(e === me ? A : e);
}, Io = function(e) {
  var A = 0, r = 1;
  (e[A] === PA || e[A] === tA) && (e[A] === tA && (r = -1), A++);
  for (var t = []; eA(e[A]); )
    t.push(e[A++]);
  var B = t.length ? parseInt(k.apply(void 0, t), 10) : 0;
  e[A] === me && A++;
  for (var n = []; eA(e[A]); )
    n.push(e[A++]);
  var s = n.length, o = s ? parseInt(k.apply(void 0, n), 10) : 0;
  (e[A] === GB || e[A] === TB) && A++;
  var i = 1;
  (e[A] === PA || e[A] === tA) && (e[A] === tA && (i = -1), A++);
  for (var a = []; eA(e[A]); )
    a.push(e[A++]);
  var c = a.length ? parseInt(k.apply(void 0, a), 10) : 0;
  return r * (B + o * Math.pow(10, -s)) * Math.pow(10, i * c);
}, yo = {
  type: 2
  /* LEFT_PARENTHESIS_TOKEN */
}, mo = {
  type: 3
  /* RIGHT_PARENTHESIS_TOKEN */
}, Ko = {
  type: 4
  /* COMMA_TOKEN */
}, vo = {
  type: 13
  /* SUFFIX_MATCH_TOKEN */
}, Lo = {
  type: 8
  /* PREFIX_MATCH_TOKEN */
}, bo = {
  type: 21
  /* COLUMN_TOKEN */
}, Do = {
  type: 9
  /* DASH_MATCH_TOKEN */
}, xo = {
  type: 10
  /* INCLUDE_MATCH_TOKEN */
}, So = {
  type: 11
  /* LEFT_CURLY_BRACKET_TOKEN */
}, Mo = {
  type: 12
  /* RIGHT_CURLY_BRACKET_TOKEN */
}, To = {
  type: 14
  /* SUBSTRING_MATCH_TOKEN */
}, Ye = {
  type: 23
  /* BAD_URL_TOKEN */
}, Oo = {
  type: 1
  /* BAD_STRING_TOKEN */
}, Go = {
  type: 25
  /* CDO_TOKEN */
}, Vo = {
  type: 24
  /* CDC_TOKEN */
}, Ro = {
  type: 26
  /* COLON_TOKEN */
}, ko = {
  type: 27
  /* SEMICOLON_TOKEN */
}, Po = {
  type: 28
  /* LEFT_SQUARE_BRACKET_TOKEN */
}, No = {
  type: 29
  /* RIGHT_SQUARE_BRACKET_TOKEN */
}, Xo = {
  type: 31
  /* WHITESPACE_TOKEN */
}, rr = {
  type: 32
  /* EOF_TOKEN */
}, RB = (
  /** @class */
  function() {
    function e() {
      this._value = [];
    }
    return e.prototype.write = function(A) {
      this._value = this._value.concat(Ut(A));
    }, e.prototype.read = function() {
      for (var A = [], r = this.consumeToken(); r !== rr; )
        A.push(r), r = this.consumeToken();
      return A;
    }, e.prototype.consumeToken = function() {
      var A = this.consumeCodePoint();
      switch (A) {
        case Re:
          return this.consumeStringToken(Re);
        case Ns:
          var r = this.peekCodePoint(0), t = this.peekCodePoint(1), B = this.peekCodePoint(2);
          if (Nr(r) || DA(t, B)) {
            var n = Je(r, t, B) ? Rs : Vs, s = this.consumeName();
            return { type: 5, value: s, flags: n };
          }
          break;
        case Xs:
          if (this.peekCodePoint(0) === Qe)
            return this.consumeCodePoint(), vo;
          break;
        case ke:
          return this.consumeStringToken(ke);
        case Pe:
          return yo;
        case ge:
          return mo;
        case Lt:
          if (this.peekCodePoint(0) === Qe)
            return this.consumeCodePoint(), To;
          break;
        case PA:
          if (bt(A, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(A), this.consumeNumericToken();
          break;
        case Bo:
          return Ko;
        case tA:
          var o = A, i = this.peekCodePoint(0), a = this.peekCodePoint(1);
          if (bt(o, i, a))
            return this.reconsumeCodePoint(A), this.consumeNumericToken();
          if (Je(o, i, a))
            return this.reconsumeCodePoint(A), this.consumeIdentLikeToken();
          if (i === tA && a === _s)
            return this.consumeCodePoint(), this.consumeCodePoint(), Vo;
          break;
        case me:
          if (bt(A, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(A), this.consumeNumericToken();
          break;
        case Rr:
          if (this.peekCodePoint(0) === Lt)
            for (this.consumeCodePoint(); ; ) {
              var c = this.consumeCodePoint();
              if (c === Lt && (c = this.consumeCodePoint(), c === Rr))
                return this.consumeToken();
              if (c === CA)
                return this.consumeToken();
            }
          break;
        case no:
          return Ro;
        case so:
          return ko;
        case Zs:
          if (this.peekCodePoint(0) === Ws && this.peekCodePoint(1) === tA && this.peekCodePoint(2) === tA)
            return this.consumeCodePoint(), this.consumeCodePoint(), Go;
          break;
        case qs:
          var l = this.peekCodePoint(0), g = this.peekCodePoint(1), C = this.peekCodePoint(2);
          if (Je(l, g, C)) {
            var s = this.consumeName();
            return { type: 7, value: s };
          }
          break;
        case js:
          return Po;
        case fe:
          if (DA(A, this.peekCodePoint(0)))
            return this.reconsumeCodePoint(A), this.consumeIdentLikeToken();
          break;
        case zs:
          return No;
        case $s:
          if (this.peekCodePoint(0) === Qe)
            return this.consumeCodePoint(), Lo;
          break;
        case Ao:
          return So;
        case eo:
          return Mo;
        case wo:
        case Uo:
          var u = this.peekCodePoint(0), w = this.peekCodePoint(1);
          return u === PA && (jA(w) || w === Ne) && (this.consumeCodePoint(), this.consumeUnicodeRangeToken()), this.reconsumeCodePoint(A), this.consumeIdentLikeToken();
        case kr:
          if (this.peekCodePoint(0) === Qe)
            return this.consumeCodePoint(), Do;
          if (this.peekCodePoint(0) === kr)
            return this.consumeCodePoint(), bo;
          break;
        case to:
          if (this.peekCodePoint(0) === Qe)
            return this.consumeCodePoint(), xo;
          break;
        case CA:
          return rr;
      }
      return Xe(A) ? (this.consumeWhiteSpace(), Xo) : eA(A) ? (this.reconsumeCodePoint(A), this.consumeNumericToken()) : st(A) ? (this.reconsumeCodePoint(A), this.consumeIdentLikeToken()) : { type: 6, value: k(A) };
    }, e.prototype.consumeCodePoint = function() {
      var A = this._value.shift();
      return typeof A > "u" ? -1 : A;
    }, e.prototype.reconsumeCodePoint = function(A) {
      this._value.unshift(A);
    }, e.prototype.peekCodePoint = function(A) {
      return A >= this._value.length ? -1 : this._value[A];
    }, e.prototype.consumeUnicodeRangeToken = function() {
      for (var A = [], r = this.consumeCodePoint(); jA(r) && A.length < 6; )
        A.push(r), r = this.consumeCodePoint();
      for (var t = !1; r === Ne && A.length < 6; )
        A.push(r), r = this.consumeCodePoint(), t = !0;
      if (t) {
        var B = parseInt(k.apply(void 0, A.map(function(i) {
          return i === Ne ? SB : i;
        })), 16), n = parseInt(k.apply(void 0, A.map(function(i) {
          return i === Ne ? VB : i;
        })), 16);
        return { type: 30, start: B, end: n };
      }
      var s = parseInt(k.apply(void 0, A), 16);
      if (this.peekCodePoint(0) === tA && jA(this.peekCodePoint(1))) {
        this.consumeCodePoint(), r = this.consumeCodePoint();
        for (var o = []; jA(r) && o.length < 6; )
          o.push(r), r = this.consumeCodePoint();
        var n = parseInt(k.apply(void 0, o), 16);
        return { type: 30, start: s, end: n };
      } else
        return { type: 30, start: s, end: s };
    }, e.prototype.consumeIdentLikeToken = function() {
      var A = this.consumeName();
      return A.toLowerCase() === "url" && this.peekCodePoint(0) === Pe ? (this.consumeCodePoint(), this.consumeUrlToken()) : this.peekCodePoint(0) === Pe ? (this.consumeCodePoint(), { type: 19, value: A }) : { type: 20, value: A };
    }, e.prototype.consumeUrlToken = function() {
      var A = [];
      if (this.consumeWhiteSpace(), this.peekCodePoint(0) === CA)
        return { type: 22, value: "" };
      var r = this.peekCodePoint(0);
      if (r === ke || r === Re) {
        var t = this.consumeStringToken(this.consumeCodePoint());
        return t.type === 0 && (this.consumeWhiteSpace(), this.peekCodePoint(0) === CA || this.peekCodePoint(0) === ge) ? (this.consumeCodePoint(), { type: 22, value: t.value }) : (this.consumeBadUrlRemnants(), Ye);
      }
      for (; ; ) {
        var B = this.consumeCodePoint();
        if (B === CA || B === ge)
          return { type: 22, value: k.apply(void 0, A) };
        if (Xe(B))
          return this.consumeWhiteSpace(), this.peekCodePoint(0) === CA || this.peekCodePoint(0) === ge ? (this.consumeCodePoint(), { type: 22, value: k.apply(void 0, A) }) : (this.consumeBadUrlRemnants(), Ye);
        if (B === Re || B === ke || B === Pe || Eo(B))
          return this.consumeBadUrlRemnants(), Ye;
        if (B === fe)
          if (DA(B, this.peekCodePoint(0)))
            A.push(this.consumeEscapedCodePoint());
          else
            return this.consumeBadUrlRemnants(), Ye;
        else
          A.push(B);
      }
    }, e.prototype.consumeWhiteSpace = function() {
      for (; Xe(this.peekCodePoint(0)); )
        this.consumeCodePoint();
    }, e.prototype.consumeBadUrlRemnants = function() {
      for (; ; ) {
        var A = this.consumeCodePoint();
        if (A === ge || A === CA)
          return;
        DA(A, this.peekCodePoint(0)) && this.consumeEscapedCodePoint();
      }
    }, e.prototype.consumeStringSlice = function(A) {
      for (var r = 5e4, t = ""; A > 0; ) {
        var B = Math.min(r, A);
        t += k.apply(void 0, this._value.splice(0, B)), A -= B;
      }
      return this._value.shift(), t;
    }, e.prototype.consumeStringToken = function(A) {
      var r = "", t = 0;
      do {
        var B = this._value[t];
        if (B === CA || B === void 0 || B === A)
          return r += this.consumeStringSlice(t), { type: 0, value: r };
        if (B === nt)
          return this._value.splice(0, t), Oo;
        if (B === fe) {
          var n = this._value[t + 1];
          n !== CA && n !== void 0 && (n === nt ? (r += this.consumeStringSlice(t), t = -1, this._value.shift()) : DA(B, n) && (r += this.consumeStringSlice(t), r += k(this.consumeEscapedCodePoint()), t = -1));
        }
        t++;
      } while (!0);
    }, e.prototype.consumeNumber = function() {
      var A = [], r = ve, t = this.peekCodePoint(0);
      for ((t === PA || t === tA) && A.push(this.consumeCodePoint()); eA(this.peekCodePoint(0)); )
        A.push(this.consumeCodePoint());
      t = this.peekCodePoint(0);
      var B = this.peekCodePoint(1);
      if (t === me && eA(B))
        for (A.push(this.consumeCodePoint(), this.consumeCodePoint()), r = Vr; eA(this.peekCodePoint(0)); )
          A.push(this.consumeCodePoint());
      t = this.peekCodePoint(0), B = this.peekCodePoint(1);
      var n = this.peekCodePoint(2);
      if ((t === GB || t === TB) && ((B === PA || B === tA) && eA(n) || eA(B)))
        for (A.push(this.consumeCodePoint(), this.consumeCodePoint()), r = Vr; eA(this.peekCodePoint(0)); )
          A.push(this.consumeCodePoint());
      return [Io(A), r];
    }, e.prototype.consumeNumericToken = function() {
      var A = this.consumeNumber(), r = A[0], t = A[1], B = this.peekCodePoint(0), n = this.peekCodePoint(1), s = this.peekCodePoint(2);
      if (Je(B, n, s)) {
        var o = this.consumeName();
        return { type: 15, number: r, flags: t, unit: o };
      }
      return B === Js ? (this.consumeCodePoint(), { type: 16, number: r, flags: t }) : { type: 17, number: r, flags: t };
    }, e.prototype.consumeEscapedCodePoint = function() {
      var A = this.consumeCodePoint();
      if (jA(A)) {
        for (var r = k(A); jA(this.peekCodePoint(0)) && r.length < 6; )
          r += k(this.consumeCodePoint());
        Xe(this.peekCodePoint(0)) && this.consumeCodePoint();
        var t = parseInt(r, 16);
        return t === 0 || Fo(t) || t > 1114111 ? Pr : t;
      }
      return A === CA ? Pr : A;
    }, e.prototype.consumeName = function() {
      for (var A = ""; ; ) {
        var r = this.consumeCodePoint();
        if (Nr(r))
          A += k(r);
        else if (DA(r, this.peekCodePoint(0)))
          A += k(this.consumeEscapedCodePoint());
        else
          return this.reconsumeCodePoint(r), A;
      }
    }, e;
  }()
), kB = (
  /** @class */
  function() {
    function e(A) {
      this._tokens = A;
    }
    return e.create = function(A) {
      var r = new RB();
      return r.write(A), new e(r.read());
    }, e.parseValue = function(A) {
      return e.create(A).parseComponentValue();
    }, e.parseValues = function(A) {
      return e.create(A).parseComponentValues();
    }, e.prototype.parseComponentValue = function() {
      for (var A = this.consumeToken(); A.type === 31; )
        A = this.consumeToken();
      if (A.type === 32)
        throw new SyntaxError("Error parsing CSS component value, unexpected EOF");
      this.reconsumeToken(A);
      var r = this.consumeComponentValue();
      do
        A = this.consumeToken();
      while (A.type === 31);
      if (A.type === 32)
        return r;
      throw new SyntaxError("Error parsing CSS component value, multiple values found when expecting only one");
    }, e.prototype.parseComponentValues = function() {
      for (var A = []; ; ) {
        var r = this.consumeComponentValue();
        if (r.type === 32)
          return A;
        A.push(r), A.push();
      }
    }, e.prototype.consumeComponentValue = function() {
      var A = this.consumeToken();
      switch (A.type) {
        case 11:
        case 28:
        case 2:
          return this.consumeSimpleBlock(A.type);
        case 19:
          return this.consumeFunction(A);
      }
      return A;
    }, e.prototype.consumeSimpleBlock = function(A) {
      for (var r = { type: A, values: [] }, t = this.consumeToken(); ; ) {
        if (t.type === 32 || Yo(t, A))
          return r;
        this.reconsumeToken(t), r.values.push(this.consumeComponentValue()), t = this.consumeToken();
      }
    }, e.prototype.consumeFunction = function(A) {
      for (var r = {
        name: A.value,
        values: [],
        type: 18
        /* FUNCTION */
      }; ; ) {
        var t = this.consumeToken();
        if (t.type === 32 || t.type === 3)
          return r;
        this.reconsumeToken(t), r.values.push(this.consumeComponentValue());
      }
    }, e.prototype.consumeToken = function() {
      var A = this._tokens.shift();
      return typeof A > "u" ? rr : A;
    }, e.prototype.reconsumeToken = function(A) {
      this._tokens.unshift(A);
    }, e;
  }()
), Le = function(e) {
  return e.type === 15;
}, ie = function(e) {
  return e.type === 17;
}, S = function(e) {
  return e.type === 20;
}, Jo = function(e) {
  return e.type === 0;
}, Br = function(e, A) {
  return S(e) && e.value === A;
}, PB = function(e) {
  return e.type !== 31;
}, oe = function(e) {
  return e.type !== 31 && e.type !== 4;
}, FA = function(e) {
  var A = [], r = [];
  return e.forEach(function(t) {
    if (t.type === 4) {
      if (r.length === 0)
        throw new Error("Error parsing function args, zero tokens for arg");
      A.push(r), r = [];
      return;
    }
    t.type !== 31 && r.push(t);
  }), r.length && A.push(r), A;
}, Yo = function(e, A) {
  return A === 11 && e.type === 12 || A === 28 && e.type === 29 ? !0 : A === 2 && e.type === 3;
}, GA = function(e) {
  return e.type === 17 || e.type === 15;
}, P = function(e) {
  return e.type === 16 || GA(e);
}, NB = function(e) {
  return e.length > 1 ? [e[0], e[1]] : [e[0]];
}, Z = {
  type: 17,
  number: 0,
  flags: ve
}, ur = {
  type: 16,
  number: 50,
  flags: ve
}, SA = {
  type: 16,
  number: 100,
  flags: ve
}, Fe = function(e, A, r) {
  var t = e[0], B = e[1];
  return [T(t, A), T(typeof B < "u" ? B : t, r)];
}, T = function(e, A) {
  if (e.type === 16)
    return e.number / 100 * A;
  if (Le(e))
    switch (e.unit) {
      case "rem":
      case "em":
        return 16 * e.number;
      case "px":
      default:
        return e.number;
    }
  return e.number;
}, XB = "deg", JB = "grad", YB = "rad", WB = "turn", Ct = {
  name: "angle",
  parse: function(e, A) {
    if (A.type === 15)
      switch (A.unit) {
        case XB:
          return Math.PI * A.number / 180;
        case JB:
          return Math.PI / 200 * A.number;
        case YB:
          return A.number;
        case WB:
          return Math.PI * 2 * A.number;
      }
    throw new Error("Unsupported angle type");
  }
}, ZB = function(e) {
  return e.type === 15 && (e.unit === XB || e.unit === JB || e.unit === YB || e.unit === WB);
}, _B = function(e) {
  var A = e.filter(S).map(function(r) {
    return r.value;
  }).join(" ");
  switch (A) {
    case "to bottom right":
    case "to right bottom":
    case "left top":
    case "top left":
      return [Z, Z];
    case "to top":
    case "bottom":
      return oA(0);
    case "to bottom left":
    case "to left bottom":
    case "right top":
    case "top right":
      return [Z, SA];
    case "to right":
    case "left":
      return oA(90);
    case "to top left":
    case "to left top":
    case "right bottom":
    case "bottom right":
      return [SA, SA];
    case "to bottom":
    case "top":
      return oA(180);
    case "to top right":
    case "to right top":
    case "left bottom":
    case "bottom left":
      return [SA, Z];
    case "to left":
    case "right":
      return oA(270);
  }
  return 0;
}, oA = function(e) {
  return Math.PI * e / 180;
}, TA = {
  name: "color",
  parse: function(e, A) {
    if (A.type === 18) {
      var r = Wo[A.name];
      if (typeof r > "u")
        throw new Error('Attempting to parse an unsupported color function "' + A.name + '"');
      return r(e, A.values);
    }
    if (A.type === 5) {
      if (A.value.length === 3) {
        var t = A.value.substring(0, 1), B = A.value.substring(1, 2), n = A.value.substring(2, 3);
        return MA(parseInt(t + t, 16), parseInt(B + B, 16), parseInt(n + n, 16), 1);
      }
      if (A.value.length === 4) {
        var t = A.value.substring(0, 1), B = A.value.substring(1, 2), n = A.value.substring(2, 3), s = A.value.substring(3, 4);
        return MA(parseInt(t + t, 16), parseInt(B + B, 16), parseInt(n + n, 16), parseInt(s + s, 16) / 255);
      }
      if (A.value.length === 6) {
        var t = A.value.substring(0, 2), B = A.value.substring(2, 4), n = A.value.substring(4, 6);
        return MA(parseInt(t, 16), parseInt(B, 16), parseInt(n, 16), 1);
      }
      if (A.value.length === 8) {
        var t = A.value.substring(0, 2), B = A.value.substring(2, 4), n = A.value.substring(4, 6), s = A.value.substring(6, 8);
        return MA(parseInt(t, 16), parseInt(B, 16), parseInt(n, 16), parseInt(s, 16) / 255);
      }
    }
    if (A.type === 20) {
      var o = yA[A.value.toUpperCase()];
      if (typeof o < "u")
        return o;
    }
    return yA.TRANSPARENT;
  }
}, OA = function(e) {
  return (255 & e) === 0;
}, J = function(e) {
  var A = 255 & e, r = 255 & e >> 8, t = 255 & e >> 16, B = 255 & e >> 24;
  return A < 255 ? "rgba(" + B + "," + t + "," + r + "," + A / 255 + ")" : "rgb(" + B + "," + t + "," + r + ")";
}, MA = function(e, A, r, t) {
  return (e << 24 | A << 16 | r << 8 | Math.round(t * 255) << 0) >>> 0;
}, Xr = function(e, A) {
  if (e.type === 17)
    return e.number;
  if (e.type === 16) {
    var r = A === 3 ? 1 : 255;
    return A === 3 ? e.number / 100 * r : Math.round(e.number / 100 * r);
  }
  return 0;
}, Jr = function(e, A) {
  var r = A.filter(oe);
  if (r.length === 3) {
    var t = r.map(Xr), B = t[0], n = t[1], s = t[2];
    return MA(B, n, s, 1);
  }
  if (r.length === 4) {
    var o = r.map(Xr), B = o[0], n = o[1], s = o[2], i = o[3];
    return MA(B, n, s, i);
  }
  return 0;
};
function Dt(e, A, r) {
  return r < 0 && (r += 1), r >= 1 && (r -= 1), r < 1 / 6 ? (A - e) * r * 6 + e : r < 1 / 2 ? A : r < 2 / 3 ? (A - e) * 6 * (2 / 3 - r) + e : e;
}
var Yr = function(e, A) {
  var r = A.filter(oe), t = r[0], B = r[1], n = r[2], s = r[3], o = (t.type === 17 ? oA(t.number) : Ct.parse(e, t)) / (Math.PI * 2), i = P(B) ? B.number / 100 : 0, a = P(n) ? n.number / 100 : 0, c = typeof s < "u" && P(s) ? T(s, 1) : 1;
  if (i === 0)
    return MA(a * 255, a * 255, a * 255, 1);
  var l = a <= 0.5 ? a * (i + 1) : a + i - a * i, g = a * 2 - l, C = Dt(g, l, o + 1 / 3), u = Dt(g, l, o), w = Dt(g, l, o - 1 / 3);
  return MA(C * 255, u * 255, w * 255, c);
}, Wo = {
  hsl: Yr,
  hsla: Yr,
  rgb: Jr,
  rgba: Jr
}, pe = function(e, A) {
  return TA.parse(e, kB.create(A).parseComponentValue());
}, yA = {
  ALICEBLUE: 4042850303,
  ANTIQUEWHITE: 4209760255,
  AQUA: 16777215,
  AQUAMARINE: 2147472639,
  AZURE: 4043309055,
  BEIGE: 4126530815,
  BISQUE: 4293182719,
  BLACK: 255,
  BLANCHEDALMOND: 4293643775,
  BLUE: 65535,
  BLUEVIOLET: 2318131967,
  BROWN: 2771004159,
  BURLYWOOD: 3736635391,
  CADETBLUE: 1604231423,
  CHARTREUSE: 2147418367,
  CHOCOLATE: 3530104575,
  CORAL: 4286533887,
  CORNFLOWERBLUE: 1687547391,
  CORNSILK: 4294499583,
  CRIMSON: 3692313855,
  CYAN: 16777215,
  DARKBLUE: 35839,
  DARKCYAN: 9145343,
  DARKGOLDENROD: 3095837695,
  DARKGRAY: 2846468607,
  DARKGREEN: 6553855,
  DARKGREY: 2846468607,
  DARKKHAKI: 3182914559,
  DARKMAGENTA: 2332068863,
  DARKOLIVEGREEN: 1433087999,
  DARKORANGE: 4287365375,
  DARKORCHID: 2570243327,
  DARKRED: 2332033279,
  DARKSALMON: 3918953215,
  DARKSEAGREEN: 2411499519,
  DARKSLATEBLUE: 1211993087,
  DARKSLATEGRAY: 793726975,
  DARKSLATEGREY: 793726975,
  DARKTURQUOISE: 13554175,
  DARKVIOLET: 2483082239,
  DEEPPINK: 4279538687,
  DEEPSKYBLUE: 12582911,
  DIMGRAY: 1768516095,
  DIMGREY: 1768516095,
  DODGERBLUE: 512819199,
  FIREBRICK: 2988581631,
  FLORALWHITE: 4294635775,
  FORESTGREEN: 579543807,
  FUCHSIA: 4278255615,
  GAINSBORO: 3705462015,
  GHOSTWHITE: 4177068031,
  GOLD: 4292280575,
  GOLDENROD: 3668254975,
  GRAY: 2155905279,
  GREEN: 8388863,
  GREENYELLOW: 2919182335,
  GREY: 2155905279,
  HONEYDEW: 4043305215,
  HOTPINK: 4285117695,
  INDIANRED: 3445382399,
  INDIGO: 1258324735,
  IVORY: 4294963455,
  KHAKI: 4041641215,
  LAVENDER: 3873897215,
  LAVENDERBLUSH: 4293981695,
  LAWNGREEN: 2096890111,
  LEMONCHIFFON: 4294626815,
  LIGHTBLUE: 2916673279,
  LIGHTCORAL: 4034953471,
  LIGHTCYAN: 3774873599,
  LIGHTGOLDENRODYELLOW: 4210742015,
  LIGHTGRAY: 3553874943,
  LIGHTGREEN: 2431553791,
  LIGHTGREY: 3553874943,
  LIGHTPINK: 4290167295,
  LIGHTSALMON: 4288707327,
  LIGHTSEAGREEN: 548580095,
  LIGHTSKYBLUE: 2278488831,
  LIGHTSLATEGRAY: 2005441023,
  LIGHTSLATEGREY: 2005441023,
  LIGHTSTEELBLUE: 2965692159,
  LIGHTYELLOW: 4294959359,
  LIME: 16711935,
  LIMEGREEN: 852308735,
  LINEN: 4210091775,
  MAGENTA: 4278255615,
  MAROON: 2147483903,
  MEDIUMAQUAMARINE: 1724754687,
  MEDIUMBLUE: 52735,
  MEDIUMORCHID: 3126187007,
  MEDIUMPURPLE: 2473647103,
  MEDIUMSEAGREEN: 1018393087,
  MEDIUMSLATEBLUE: 2070474495,
  MEDIUMSPRINGGREEN: 16423679,
  MEDIUMTURQUOISE: 1221709055,
  MEDIUMVIOLETRED: 3340076543,
  MIDNIGHTBLUE: 421097727,
  MINTCREAM: 4127193855,
  MISTYROSE: 4293190143,
  MOCCASIN: 4293178879,
  NAVAJOWHITE: 4292783615,
  NAVY: 33023,
  OLDLACE: 4260751103,
  OLIVE: 2155872511,
  OLIVEDRAB: 1804477439,
  ORANGE: 4289003775,
  ORANGERED: 4282712319,
  ORCHID: 3664828159,
  PALEGOLDENROD: 4008225535,
  PALEGREEN: 2566625535,
  PALETURQUOISE: 2951671551,
  PALEVIOLETRED: 3681588223,
  PAPAYAWHIP: 4293907967,
  PEACHPUFF: 4292524543,
  PERU: 3448061951,
  PINK: 4290825215,
  PLUM: 3718307327,
  POWDERBLUE: 2967529215,
  PURPLE: 2147516671,
  REBECCAPURPLE: 1714657791,
  RED: 4278190335,
  ROSYBROWN: 3163525119,
  ROYALBLUE: 1097458175,
  SADDLEBROWN: 2336560127,
  SALMON: 4202722047,
  SANDYBROWN: 4104413439,
  SEAGREEN: 780883967,
  SEASHELL: 4294307583,
  SIENNA: 2689740287,
  SILVER: 3233857791,
  SKYBLUE: 2278484991,
  SLATEBLUE: 1784335871,
  SLATEGRAY: 1887473919,
  SLATEGREY: 1887473919,
  SNOW: 4294638335,
  SPRINGGREEN: 16744447,
  STEELBLUE: 1182971135,
  TAN: 3535047935,
  TEAL: 8421631,
  THISTLE: 3636451583,
  TOMATO: 4284696575,
  TRANSPARENT: 0,
  TURQUOISE: 1088475391,
  VIOLET: 4001558271,
  WHEAT: 4125012991,
  WHITE: 4294967295,
  WHITESMOKE: 4126537215,
  YELLOW: 4294902015,
  YELLOWGREEN: 2597139199
}, Zo = {
  name: "background-clip",
  initialValue: "border-box",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    return A.map(function(r) {
      if (S(r))
        switch (r.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
      return 0;
    });
  }
}, _o = {
  name: "background-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, Ft = function(e, A) {
  var r = TA.parse(e, A[0]), t = A[1];
  return t && P(t) ? { color: r, stop: t } : { color: r, stop: null };
}, Wr = function(e, A) {
  var r = e[0], t = e[e.length - 1];
  r.stop === null && (r.stop = Z), t.stop === null && (t.stop = SA);
  for (var B = [], n = 0, s = 0; s < e.length; s++) {
    var o = e[s].stop;
    if (o !== null) {
      var i = T(o, A);
      i > n ? B.push(i) : B.push(n), n = i;
    } else
      B.push(null);
  }
  for (var a = null, s = 0; s < B.length; s++) {
    var c = B[s];
    if (c === null)
      a === null && (a = s);
    else if (a !== null) {
      for (var l = s - a, g = B[a - 1], C = (c - g) / (l + 1), u = 1; u <= l; u++)
        B[a + u - 1] = C * u;
      a = null;
    }
  }
  return e.map(function(w, p) {
    var F = w.color;
    return { color: F, stop: Math.max(Math.min(1, B[p] / A), 0) };
  });
}, qo = function(e, A, r) {
  var t = A / 2, B = r / 2, n = T(e[0], A) - t, s = B - T(e[1], r);
  return (Math.atan2(s, n) + Math.PI * 2) % (Math.PI * 2);
}, jo = function(e, A, r) {
  var t = typeof e == "number" ? e : qo(e, A, r), B = Math.abs(A * Math.sin(t)) + Math.abs(r * Math.cos(t)), n = A / 2, s = r / 2, o = B / 2, i = Math.sin(t - Math.PI / 2) * o, a = Math.cos(t - Math.PI / 2) * o;
  return [B, n - a, n + a, s - i, s + i];
}, lA = function(e, A) {
  return Math.sqrt(e * e + A * A);
}, Zr = function(e, A, r, t, B) {
  var n = [
    [0, 0],
    [0, A],
    [e, 0],
    [e, A]
  ];
  return n.reduce(function(s, o) {
    var i = o[0], a = o[1], c = lA(r - i, t - a);
    return (B ? c < s.optimumDistance : c > s.optimumDistance) ? {
      optimumCorner: o,
      optimumDistance: c
    } : s;
  }, {
    optimumDistance: B ? 1 / 0 : -1 / 0,
    optimumCorner: null
  }).optimumCorner;
}, zo = function(e, A, r, t, B) {
  var n = 0, s = 0;
  switch (e.size) {
    case 0:
      e.shape === 0 ? n = s = Math.min(Math.abs(A), Math.abs(A - t), Math.abs(r), Math.abs(r - B)) : e.shape === 1 && (n = Math.min(Math.abs(A), Math.abs(A - t)), s = Math.min(Math.abs(r), Math.abs(r - B)));
      break;
    case 2:
      if (e.shape === 0)
        n = s = Math.min(lA(A, r), lA(A, r - B), lA(A - t, r), lA(A - t, r - B));
      else if (e.shape === 1) {
        var o = Math.min(Math.abs(r), Math.abs(r - B)) / Math.min(Math.abs(A), Math.abs(A - t)), i = Zr(t, B, A, r, !0), a = i[0], c = i[1];
        n = lA(a - A, (c - r) / o), s = o * n;
      }
      break;
    case 1:
      e.shape === 0 ? n = s = Math.max(Math.abs(A), Math.abs(A - t), Math.abs(r), Math.abs(r - B)) : e.shape === 1 && (n = Math.max(Math.abs(A), Math.abs(A - t)), s = Math.max(Math.abs(r), Math.abs(r - B)));
      break;
    case 3:
      if (e.shape === 0)
        n = s = Math.max(lA(A, r), lA(A, r - B), lA(A - t, r), lA(A - t, r - B));
      else if (e.shape === 1) {
        var o = Math.max(Math.abs(r), Math.abs(r - B)) / Math.max(Math.abs(A), Math.abs(A - t)), l = Zr(t, B, A, r, !1), a = l[0], c = l[1];
        n = lA(a - A, (c - r) / o), s = o * n;
      }
      break;
  }
  return Array.isArray(e.size) && (n = T(e.size[0], t), s = e.size.length === 2 ? T(e.size[1], B) : n), [n, s];
}, $o = function(e, A) {
  var r = oA(180), t = [];
  return FA(A).forEach(function(B, n) {
    if (n === 0) {
      var s = B[0];
      if (s.type === 20 && s.value === "to") {
        r = _B(B);
        return;
      } else if (ZB(s)) {
        r = Ct.parse(e, s);
        return;
      }
    }
    var o = Ft(e, B);
    t.push(o);
  }), {
    angle: r,
    stops: t,
    type: 1
    /* LINEAR_GRADIENT */
  };
}, We = function(e, A) {
  var r = oA(180), t = [];
  return FA(A).forEach(function(B, n) {
    if (n === 0) {
      var s = B[0];
      if (s.type === 20 && ["top", "left", "right", "bottom"].indexOf(s.value) !== -1) {
        r = _B(B);
        return;
      } else if (ZB(s)) {
        r = (Ct.parse(e, s) + oA(270)) % oA(360);
        return;
      }
    }
    var o = Ft(e, B);
    t.push(o);
  }), {
    angle: r,
    stops: t,
    type: 1
    /* LINEAR_GRADIENT */
  };
}, Ai = function(e, A) {
  var r = oA(180), t = [], B = 1, n = 0, s = 3, o = [];
  return FA(A).forEach(function(i, a) {
    var c = i[0];
    if (a === 0) {
      if (S(c) && c.value === "linear") {
        B = 1;
        return;
      } else if (S(c) && c.value === "radial") {
        B = 2;
        return;
      }
    }
    if (c.type === 18) {
      if (c.name === "from") {
        var l = TA.parse(e, c.values[0]);
        t.push({ stop: Z, color: l });
      } else if (c.name === "to") {
        var l = TA.parse(e, c.values[0]);
        t.push({ stop: SA, color: l });
      } else if (c.name === "color-stop") {
        var g = c.values.filter(oe);
        if (g.length === 2) {
          var l = TA.parse(e, g[1]), C = g[0];
          ie(C) && t.push({
            stop: { type: 16, number: C.number * 100, flags: C.flags },
            color: l
          });
        }
      }
    }
  }), B === 1 ? {
    angle: (r + oA(180)) % oA(360),
    stops: t,
    type: B
  } : { size: s, shape: n, stops: t, position: o, type: B };
}, qB = "closest-side", jB = "farthest-side", zB = "closest-corner", $B = "farthest-corner", An = "circle", en = "ellipse", tn = "cover", rn = "contain", ei = function(e, A) {
  var r = 0, t = 3, B = [], n = [];
  return FA(A).forEach(function(s, o) {
    var i = !0;
    if (o === 0) {
      var a = !1;
      i = s.reduce(function(l, g) {
        if (a)
          if (S(g))
            switch (g.value) {
              case "center":
                return n.push(ur), l;
              case "top":
              case "left":
                return n.push(Z), l;
              case "right":
              case "bottom":
                return n.push(SA), l;
            }
          else
            (P(g) || GA(g)) && n.push(g);
        else if (S(g))
          switch (g.value) {
            case An:
              return r = 0, !1;
            case en:
              return r = 1, !1;
            case "at":
              return a = !0, !1;
            case qB:
              return t = 0, !1;
            case tn:
            case jB:
              return t = 1, !1;
            case rn:
            case zB:
              return t = 2, !1;
            case $B:
              return t = 3, !1;
          }
        else if (GA(g) || P(g))
          return Array.isArray(t) || (t = []), t.push(g), !1;
        return l;
      }, i);
    }
    if (i) {
      var c = Ft(e, s);
      B.push(c);
    }
  }), {
    size: t,
    shape: r,
    stops: B,
    position: n,
    type: 2
    /* RADIAL_GRADIENT */
  };
}, Ze = function(e, A) {
  var r = 0, t = 3, B = [], n = [];
  return FA(A).forEach(function(s, o) {
    var i = !0;
    if (o === 0 ? i = s.reduce(function(c, l) {
      if (S(l))
        switch (l.value) {
          case "center":
            return n.push(ur), !1;
          case "top":
          case "left":
            return n.push(Z), !1;
          case "right":
          case "bottom":
            return n.push(SA), !1;
        }
      else if (P(l) || GA(l))
        return n.push(l), !1;
      return c;
    }, i) : o === 1 && (i = s.reduce(function(c, l) {
      if (S(l))
        switch (l.value) {
          case An:
            return r = 0, !1;
          case en:
            return r = 1, !1;
          case rn:
          case qB:
            return t = 0, !1;
          case jB:
            return t = 1, !1;
          case zB:
            return t = 2, !1;
          case tn:
          case $B:
            return t = 3, !1;
        }
      else if (GA(l) || P(l))
        return Array.isArray(t) || (t = []), t.push(l), !1;
      return c;
    }, i)), i) {
      var a = Ft(e, s);
      B.push(a);
    }
  }), {
    size: t,
    shape: r,
    stops: B,
    position: n,
    type: 2
    /* RADIAL_GRADIENT */
  };
}, ti = function(e) {
  return e.type === 1;
}, ri = function(e) {
  return e.type === 2;
}, Ur = {
  name: "image",
  parse: function(e, A) {
    if (A.type === 22) {
      var r = {
        url: A.value,
        type: 0
        /* URL */
      };
      return e.cache.addImage(A.value), r;
    }
    if (A.type === 18) {
      var t = Bn[A.name];
      if (typeof t > "u")
        throw new Error('Attempting to parse an unsupported image function "' + A.name + '"');
      return t(e, A.values);
    }
    throw new Error("Unsupported image type " + A.type);
  }
};
function Bi(e) {
  return !(e.type === 20 && e.value === "none") && (e.type !== 18 || !!Bn[e.name]);
}
var Bn = {
  "linear-gradient": $o,
  "-moz-linear-gradient": We,
  "-ms-linear-gradient": We,
  "-o-linear-gradient": We,
  "-webkit-linear-gradient": We,
  "radial-gradient": ei,
  "-moz-radial-gradient": Ze,
  "-ms-radial-gradient": Ze,
  "-o-radial-gradient": Ze,
  "-webkit-radial-gradient": Ze,
  "-webkit-gradient": Ai
}, ni = {
  name: "background-image",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(e, A) {
    if (A.length === 0)
      return [];
    var r = A[0];
    return r.type === 20 && r.value === "none" ? [] : A.filter(function(t) {
      return oe(t) && Bi(t);
    }).map(function(t) {
      return Ur.parse(e, t);
    });
  }
}, si = {
  name: "background-origin",
  initialValue: "border-box",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    return A.map(function(r) {
      if (S(r))
        switch (r.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
      return 0;
    });
  }
}, oi = {
  name: "background-position",
  initialValue: "0% 0%",
  type: 1,
  prefix: !1,
  parse: function(e, A) {
    return FA(A).map(function(r) {
      return r.filter(P);
    }).map(NB);
  }
}, ii = {
  name: "background-repeat",
  initialValue: "repeat",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    return FA(A).map(function(r) {
      return r.filter(S).map(function(t) {
        return t.value;
      }).join(" ");
    }).map(ai);
  }
}, ai = function(e) {
  switch (e) {
    case "no-repeat":
      return 1;
    case "repeat-x":
    case "repeat no-repeat":
      return 2;
    case "repeat-y":
    case "no-repeat repeat":
      return 3;
    case "repeat":
    default:
      return 0;
  }
}, se;
(function(e) {
  e.AUTO = "auto", e.CONTAIN = "contain", e.COVER = "cover";
})(se || (se = {}));
var ci = {
  name: "background-size",
  initialValue: "0",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    return FA(A).map(function(r) {
      return r.filter(li);
    });
  }
}, li = function(e) {
  return S(e) || P(e);
}, ht = function(e) {
  return {
    name: "border-" + e + "-color",
    initialValue: "transparent",
    prefix: !1,
    type: 3,
    format: "color"
  };
}, Qi = ht("top"), gi = ht("right"), wi = ht("bottom"), ui = ht("left"), dt = function(e) {
  return {
    name: "border-radius-" + e,
    initialValue: "0 0",
    prefix: !1,
    type: 1,
    parse: function(A, r) {
      return NB(r.filter(P));
    }
  };
}, Ui = dt("top-left"), Ci = dt("top-right"), Fi = dt("bottom-right"), hi = dt("bottom-left"), ft = function(e) {
  return {
    name: "border-" + e + "-style",
    initialValue: "solid",
    prefix: !1,
    type: 2,
    parse: function(A, r) {
      switch (r) {
        case "none":
          return 0;
        case "dashed":
          return 2;
        case "dotted":
          return 3;
        case "double":
          return 4;
      }
      return 1;
    }
  };
}, di = ft("top"), fi = ft("right"), pi = ft("bottom"), Hi = ft("left"), pt = function(e) {
  return {
    name: "border-" + e + "-width",
    initialValue: "0",
    type: 0,
    prefix: !1,
    parse: function(A, r) {
      return Le(r) ? r.number : 0;
    }
  };
}, Ei = pt("top"), Ii = pt("right"), yi = pt("bottom"), mi = pt("left"), Ki = {
  name: "color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, vi = {
  name: "direction",
  initialValue: "ltr",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "rtl":
        return 1;
      case "ltr":
      default:
        return 0;
    }
  }
}, Li = {
  name: "display",
  initialValue: "inline-block",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    return A.filter(S).reduce(
      function(r, t) {
        return r | bi(t.value);
      },
      0
      /* NONE */
    );
  }
}, bi = function(e) {
  switch (e) {
    case "block":
    case "-webkit-box":
      return 2;
    case "inline":
      return 4;
    case "run-in":
      return 8;
    case "flow":
      return 16;
    case "flow-root":
      return 32;
    case "table":
      return 64;
    case "flex":
    case "-webkit-flex":
      return 128;
    case "grid":
    case "-ms-grid":
      return 256;
    case "ruby":
      return 512;
    case "subgrid":
      return 1024;
    case "list-item":
      return 2048;
    case "table-row-group":
      return 4096;
    case "table-header-group":
      return 8192;
    case "table-footer-group":
      return 16384;
    case "table-row":
      return 32768;
    case "table-cell":
      return 65536;
    case "table-column-group":
      return 131072;
    case "table-column":
      return 262144;
    case "table-caption":
      return 524288;
    case "ruby-base":
      return 1048576;
    case "ruby-text":
      return 2097152;
    case "ruby-base-container":
      return 4194304;
    case "ruby-text-container":
      return 8388608;
    case "contents":
      return 16777216;
    case "inline-block":
      return 33554432;
    case "inline-list-item":
      return 67108864;
    case "inline-table":
      return 134217728;
    case "inline-flex":
      return 268435456;
    case "inline-grid":
      return 536870912;
  }
  return 0;
}, Di = {
  name: "float",
  initialValue: "none",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "left":
        return 1;
      case "right":
        return 2;
      case "inline-start":
        return 3;
      case "inline-end":
        return 4;
    }
    return 0;
  }
}, xi = {
  name: "letter-spacing",
  initialValue: "0",
  prefix: !1,
  type: 0,
  parse: function(e, A) {
    return A.type === 20 && A.value === "normal" ? 0 : A.type === 17 || A.type === 15 ? A.number : 0;
  }
}, ot;
(function(e) {
  e.NORMAL = "normal", e.STRICT = "strict";
})(ot || (ot = {}));
var Si = {
  name: "line-break",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "strict":
        return ot.STRICT;
      case "normal":
      default:
        return ot.NORMAL;
    }
  }
}, Mi = {
  name: "line-height",
  initialValue: "normal",
  prefix: !1,
  type: 4
  /* TOKEN_VALUE */
}, _r = function(e, A) {
  return S(e) && e.value === "normal" ? 1.2 * A : e.type === 17 ? A * e.number : P(e) ? T(e, A) : A;
}, Ti = {
  name: "list-style-image",
  initialValue: "none",
  type: 0,
  prefix: !1,
  parse: function(e, A) {
    return A.type === 20 && A.value === "none" ? null : Ur.parse(e, A);
  }
}, Oi = {
  name: "list-style-position",
  initialValue: "outside",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "inside":
        return 0;
      case "outside":
      default:
        return 1;
    }
  }
}, nr = {
  name: "list-style-type",
  initialValue: "none",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "disc":
        return 0;
      case "circle":
        return 1;
      case "square":
        return 2;
      case "decimal":
        return 3;
      case "cjk-decimal":
        return 4;
      case "decimal-leading-zero":
        return 5;
      case "lower-roman":
        return 6;
      case "upper-roman":
        return 7;
      case "lower-greek":
        return 8;
      case "lower-alpha":
        return 9;
      case "upper-alpha":
        return 10;
      case "arabic-indic":
        return 11;
      case "armenian":
        return 12;
      case "bengali":
        return 13;
      case "cambodian":
        return 14;
      case "cjk-earthly-branch":
        return 15;
      case "cjk-heavenly-stem":
        return 16;
      case "cjk-ideographic":
        return 17;
      case "devanagari":
        return 18;
      case "ethiopic-numeric":
        return 19;
      case "georgian":
        return 20;
      case "gujarati":
        return 21;
      case "gurmukhi":
        return 22;
      case "hebrew":
        return 22;
      case "hiragana":
        return 23;
      case "hiragana-iroha":
        return 24;
      case "japanese-formal":
        return 25;
      case "japanese-informal":
        return 26;
      case "kannada":
        return 27;
      case "katakana":
        return 28;
      case "katakana-iroha":
        return 29;
      case "khmer":
        return 30;
      case "korean-hangul-formal":
        return 31;
      case "korean-hanja-formal":
        return 32;
      case "korean-hanja-informal":
        return 33;
      case "lao":
        return 34;
      case "lower-armenian":
        return 35;
      case "malayalam":
        return 36;
      case "mongolian":
        return 37;
      case "myanmar":
        return 38;
      case "oriya":
        return 39;
      case "persian":
        return 40;
      case "simp-chinese-formal":
        return 41;
      case "simp-chinese-informal":
        return 42;
      case "tamil":
        return 43;
      case "telugu":
        return 44;
      case "thai":
        return 45;
      case "tibetan":
        return 46;
      case "trad-chinese-formal":
        return 47;
      case "trad-chinese-informal":
        return 48;
      case "upper-armenian":
        return 49;
      case "disclosure-open":
        return 50;
      case "disclosure-closed":
        return 51;
      case "none":
      default:
        return -1;
    }
  }
}, Ht = function(e) {
  return {
    name: "margin-" + e,
    initialValue: "0",
    prefix: !1,
    type: 4
    /* TOKEN_VALUE */
  };
}, Gi = Ht("top"), Vi = Ht("right"), Ri = Ht("bottom"), ki = Ht("left"), Pi = {
  name: "overflow",
  initialValue: "visible",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    return A.filter(S).map(function(r) {
      switch (r.value) {
        case "hidden":
          return 1;
        case "scroll":
          return 2;
        case "clip":
          return 3;
        case "auto":
          return 4;
        case "visible":
        default:
          return 0;
      }
    });
  }
}, Ni = {
  name: "overflow-wrap",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "break-word":
        return "break-word";
      case "normal":
      default:
        return "normal";
    }
  }
}, Et = function(e) {
  return {
    name: "padding-" + e,
    initialValue: "0",
    prefix: !1,
    type: 3,
    format: "length-percentage"
  };
}, Xi = Et("top"), Ji = Et("right"), Yi = Et("bottom"), Wi = Et("left"), Zi = {
  name: "text-align",
  initialValue: "left",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "right":
        return 2;
      case "center":
      case "justify":
        return 1;
      case "left":
      default:
        return 0;
    }
  }
}, _i = {
  name: "position",
  initialValue: "static",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "relative":
        return 1;
      case "absolute":
        return 2;
      case "fixed":
        return 3;
      case "sticky":
        return 4;
    }
    return 0;
  }
}, qi = {
  name: "text-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(e, A) {
    return A.length === 1 && Br(A[0], "none") ? [] : FA(A).map(function(r) {
      for (var t = {
        color: yA.TRANSPARENT,
        offsetX: Z,
        offsetY: Z,
        blur: Z
      }, B = 0, n = 0; n < r.length; n++) {
        var s = r[n];
        GA(s) ? (B === 0 ? t.offsetX = s : B === 1 ? t.offsetY = s : t.blur = s, B++) : t.color = TA.parse(e, s);
      }
      return t;
    });
  }
}, ji = {
  name: "text-transform",
  initialValue: "none",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "uppercase":
        return 2;
      case "lowercase":
        return 1;
      case "capitalize":
        return 3;
    }
    return 0;
  }
}, zi = {
  name: "transform",
  initialValue: "none",
  prefix: !0,
  type: 0,
  parse: function(e, A) {
    if (A.type === 20 && A.value === "none")
      return null;
    if (A.type === 18) {
      var r = ea[A.name];
      if (typeof r > "u")
        throw new Error('Attempting to parse an unsupported transform function "' + A.name + '"');
      return r(A.values);
    }
    return null;
  }
}, $i = function(e) {
  var A = e.filter(function(r) {
    return r.type === 17;
  }).map(function(r) {
    return r.number;
  });
  return A.length === 6 ? A : null;
}, Aa = function(e) {
  var A = e.filter(function(i) {
    return i.type === 17;
  }).map(function(i) {
    return i.number;
  }), r = A[0], t = A[1];
  A[2], A[3];
  var B = A[4], n = A[5];
  A[6], A[7], A[8], A[9], A[10], A[11];
  var s = A[12], o = A[13];
  return A[14], A[15], A.length === 16 ? [r, t, B, n, s, o] : null;
}, ea = {
  matrix: $i,
  matrix3d: Aa
}, qr = {
  type: 16,
  number: 50,
  flags: ve
}, ta = [qr, qr], ra = {
  name: "transform-origin",
  initialValue: "50% 50%",
  prefix: !0,
  type: 1,
  parse: function(e, A) {
    var r = A.filter(P);
    return r.length !== 2 ? ta : [r[0], r[1]];
  }
}, Ba = {
  name: "visible",
  initialValue: "none",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "hidden":
        return 1;
      case "collapse":
        return 2;
      case "visible":
      default:
        return 0;
    }
  }
}, He;
(function(e) {
  e.NORMAL = "normal", e.BREAK_ALL = "break-all", e.KEEP_ALL = "keep-all";
})(He || (He = {}));
var na = {
  name: "word-break",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "break-all":
        return He.BREAK_ALL;
      case "keep-all":
        return He.KEEP_ALL;
      case "normal":
      default:
        return He.NORMAL;
    }
  }
}, sa = {
  name: "z-index",
  initialValue: "auto",
  prefix: !1,
  type: 0,
  parse: function(e, A) {
    if (A.type === 20)
      return { auto: !0, order: 0 };
    if (ie(A))
      return { auto: !1, order: A.number };
    throw new Error("Invalid z-index number parsed");
  }
}, nn = {
  name: "time",
  parse: function(e, A) {
    if (A.type === 15)
      switch (A.unit.toLowerCase()) {
        case "s":
          return 1e3 * A.number;
        case "ms":
          return A.number;
      }
    throw new Error("Unsupported time type");
  }
}, oa = {
  name: "opacity",
  initialValue: "1",
  type: 0,
  prefix: !1,
  parse: function(e, A) {
    return ie(A) ? A.number : 1;
  }
}, ia = {
  name: "text-decoration-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, aa = {
  name: "text-decoration-line",
  initialValue: "none",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    return A.filter(S).map(function(r) {
      switch (r.value) {
        case "underline":
          return 1;
        case "overline":
          return 2;
        case "line-through":
          return 3;
        case "none":
          return 4;
      }
      return 0;
    }).filter(function(r) {
      return r !== 0;
    });
  }
}, ca = {
  name: "font-family",
  initialValue: "",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    var r = [], t = [];
    return A.forEach(function(B) {
      switch (B.type) {
        case 20:
        case 0:
          r.push(B.value);
          break;
        case 17:
          r.push(B.number.toString());
          break;
        case 4:
          t.push(r.join(" ")), r.length = 0;
          break;
      }
    }), r.length && t.push(r.join(" ")), t.map(function(B) {
      return B.indexOf(" ") === -1 ? B : "'" + B + "'";
    });
  }
}, la = {
  name: "font-size",
  initialValue: "0",
  prefix: !1,
  type: 3,
  format: "length"
}, Qa = {
  name: "font-weight",
  initialValue: "normal",
  type: 0,
  prefix: !1,
  parse: function(e, A) {
    if (ie(A))
      return A.number;
    if (S(A))
      switch (A.value) {
        case "bold":
          return 700;
        case "normal":
        default:
          return 400;
      }
    return 400;
  }
}, ga = {
  name: "font-variant",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(e, A) {
    return A.filter(S).map(function(r) {
      return r.value;
    });
  }
}, wa = {
  name: "font-style",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(e, A) {
    switch (A) {
      case "oblique":
        return "oblique";
      case "italic":
        return "italic";
      case "normal":
      default:
        return "normal";
    }
  }
}, X = function(e, A) {
  return (e & A) !== 0;
}, ua = {
  name: "content",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(e, A) {
    if (A.length === 0)
      return [];
    var r = A[0];
    return r.type === 20 && r.value === "none" ? [] : A;
  }
}, Ua = {
  name: "counter-increment",
  initialValue: "none",
  prefix: !0,
  type: 1,
  parse: function(e, A) {
    if (A.length === 0)
      return null;
    var r = A[0];
    if (r.type === 20 && r.value === "none")
      return null;
    for (var t = [], B = A.filter(PB), n = 0; n < B.length; n++) {
      var s = B[n], o = B[n + 1];
      if (s.type === 20) {
        var i = o && ie(o) ? o.number : 1;
        t.push({ counter: s.value, increment: i });
      }
    }
    return t;
  }
}, Ca = {
  name: "counter-reset",
  initialValue: "none",
  prefix: !0,
  type: 1,
  parse: function(e, A) {
    if (A.length === 0)
      return [];
    for (var r = [], t = A.filter(PB), B = 0; B < t.length; B++) {
      var n = t[B], s = t[B + 1];
      if (S(n) && n.value !== "none") {
        var o = s && ie(s) ? s.number : 0;
        r.push({ counter: n.value, reset: o });
      }
    }
    return r;
  }
}, Fa = {
  name: "duration",
  initialValue: "0s",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    return A.filter(Le).map(function(r) {
      return nn.parse(e, r);
    });
  }
}, ha = {
  name: "quotes",
  initialValue: "none",
  prefix: !0,
  type: 1,
  parse: function(e, A) {
    if (A.length === 0)
      return null;
    var r = A[0];
    if (r.type === 20 && r.value === "none")
      return null;
    var t = [], B = A.filter(Jo);
    if (B.length % 2 !== 0)
      return null;
    for (var n = 0; n < B.length; n += 2) {
      var s = B[n].value, o = B[n + 1].value;
      t.push({ open: s, close: o });
    }
    return t;
  }
}, jr = function(e, A, r) {
  if (!e)
    return "";
  var t = e[Math.min(A, e.length - 1)];
  return t ? r ? t.open : t.close : "";
}, da = {
  name: "box-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(e, A) {
    return A.length === 1 && Br(A[0], "none") ? [] : FA(A).map(function(r) {
      for (var t = {
        color: 255,
        offsetX: Z,
        offsetY: Z,
        blur: Z,
        spread: Z,
        inset: !1
      }, B = 0, n = 0; n < r.length; n++) {
        var s = r[n];
        Br(s, "inset") ? t.inset = !0 : GA(s) ? (B === 0 ? t.offsetX = s : B === 1 ? t.offsetY = s : B === 2 ? t.blur = s : t.spread = s, B++) : t.color = TA.parse(e, s);
      }
      return t;
    });
  }
}, fa = {
  name: "paint-order",
  initialValue: "normal",
  prefix: !1,
  type: 1,
  parse: function(e, A) {
    var r = [
      0,
      1,
      2
      /* MARKERS */
    ], t = [];
    return A.filter(S).forEach(function(B) {
      switch (B.value) {
        case "stroke":
          t.push(
            1
            /* STROKE */
          );
          break;
        case "fill":
          t.push(
            0
            /* FILL */
          );
          break;
        case "markers":
          t.push(
            2
            /* MARKERS */
          );
          break;
      }
    }), r.forEach(function(B) {
      t.indexOf(B) === -1 && t.push(B);
    }), t;
  }
}, pa = {
  name: "-webkit-text-stroke-color",
  initialValue: "currentcolor",
  prefix: !1,
  type: 3,
  format: "color"
}, Ha = {
  name: "-webkit-text-stroke-width",
  initialValue: "0",
  type: 0,
  prefix: !1,
  parse: function(e, A) {
    return Le(A) ? A.number : 0;
  }
}, Ea = (
  /** @class */
  function() {
    function e(A, r) {
      var t, B;
      this.animationDuration = d(A, Fa, r.animationDuration), this.backgroundClip = d(A, Zo, r.backgroundClip), this.backgroundColor = d(A, _o, r.backgroundColor), this.backgroundImage = d(A, ni, r.backgroundImage), this.backgroundOrigin = d(A, si, r.backgroundOrigin), this.backgroundPosition = d(A, oi, r.backgroundPosition), this.backgroundRepeat = d(A, ii, r.backgroundRepeat), this.backgroundSize = d(A, ci, r.backgroundSize), this.borderTopColor = d(A, Qi, r.borderTopColor), this.borderRightColor = d(A, gi, r.borderRightColor), this.borderBottomColor = d(A, wi, r.borderBottomColor), this.borderLeftColor = d(A, ui, r.borderLeftColor), this.borderTopLeftRadius = d(A, Ui, r.borderTopLeftRadius), this.borderTopRightRadius = d(A, Ci, r.borderTopRightRadius), this.borderBottomRightRadius = d(A, Fi, r.borderBottomRightRadius), this.borderBottomLeftRadius = d(A, hi, r.borderBottomLeftRadius), this.borderTopStyle = d(A, di, r.borderTopStyle), this.borderRightStyle = d(A, fi, r.borderRightStyle), this.borderBottomStyle = d(A, pi, r.borderBottomStyle), this.borderLeftStyle = d(A, Hi, r.borderLeftStyle), this.borderTopWidth = d(A, Ei, r.borderTopWidth), this.borderRightWidth = d(A, Ii, r.borderRightWidth), this.borderBottomWidth = d(A, yi, r.borderBottomWidth), this.borderLeftWidth = d(A, mi, r.borderLeftWidth), this.boxShadow = d(A, da, r.boxShadow), this.color = d(A, Ki, r.color), this.direction = d(A, vi, r.direction), this.display = d(A, Li, r.display), this.float = d(A, Di, r.cssFloat), this.fontFamily = d(A, ca, r.fontFamily), this.fontSize = d(A, la, r.fontSize), this.fontStyle = d(A, wa, r.fontStyle), this.fontVariant = d(A, ga, r.fontVariant), this.fontWeight = d(A, Qa, r.fontWeight), this.letterSpacing = d(A, xi, r.letterSpacing), this.lineBreak = d(A, Si, r.lineBreak), this.lineHeight = d(A, Mi, r.lineHeight), this.listStyleImage = d(A, Ti, r.listStyleImage), this.listStylePosition = d(A, Oi, r.listStylePosition), this.listStyleType = d(A, nr, r.listStyleType), this.marginTop = d(A, Gi, r.marginTop), this.marginRight = d(A, Vi, r.marginRight), this.marginBottom = d(A, Ri, r.marginBottom), this.marginLeft = d(A, ki, r.marginLeft), this.opacity = d(A, oa, r.opacity);
      var n = d(A, Pi, r.overflow);
      this.overflowX = n[0], this.overflowY = n[n.length > 1 ? 1 : 0], this.overflowWrap = d(A, Ni, r.overflowWrap), this.paddingTop = d(A, Xi, r.paddingTop), this.paddingRight = d(A, Ji, r.paddingRight), this.paddingBottom = d(A, Yi, r.paddingBottom), this.paddingLeft = d(A, Wi, r.paddingLeft), this.paintOrder = d(A, fa, r.paintOrder), this.position = d(A, _i, r.position), this.textAlign = d(A, Zi, r.textAlign), this.textDecorationColor = d(A, ia, (t = r.textDecorationColor) !== null && t !== void 0 ? t : r.color), this.textDecorationLine = d(A, aa, (B = r.textDecorationLine) !== null && B !== void 0 ? B : r.textDecoration), this.textShadow = d(A, qi, r.textShadow), this.textTransform = d(A, ji, r.textTransform), this.transform = d(A, zi, r.transform), this.transformOrigin = d(A, ra, r.transformOrigin), this.visibility = d(A, Ba, r.visibility), this.webkitTextStrokeColor = d(A, pa, r.webkitTextStrokeColor), this.webkitTextStrokeWidth = d(A, Ha, r.webkitTextStrokeWidth), this.wordBreak = d(A, na, r.wordBreak), this.zIndex = d(A, sa, r.zIndex);
    }
    return e.prototype.isVisible = function() {
      return this.display > 0 && this.opacity > 0 && this.visibility === 0;
    }, e.prototype.isTransparent = function() {
      return OA(this.backgroundColor);
    }, e.prototype.isTransformed = function() {
      return this.transform !== null;
    }, e.prototype.isPositioned = function() {
      return this.position !== 0;
    }, e.prototype.isPositionedWithZIndex = function() {
      return this.isPositioned() && !this.zIndex.auto;
    }, e.prototype.isFloating = function() {
      return this.float !== 0;
    }, e.prototype.isInlineLevel = function() {
      return X(
        this.display,
        4
        /* INLINE */
      ) || X(
        this.display,
        33554432
        /* INLINE_BLOCK */
      ) || X(
        this.display,
        268435456
        /* INLINE_FLEX */
      ) || X(
        this.display,
        536870912
        /* INLINE_GRID */
      ) || X(
        this.display,
        67108864
        /* INLINE_LIST_ITEM */
      ) || X(
        this.display,
        134217728
        /* INLINE_TABLE */
      );
    }, e;
  }()
), Ia = (
  /** @class */
  function() {
    function e(A, r) {
      this.content = d(A, ua, r.content), this.quotes = d(A, ha, r.quotes);
    }
    return e;
  }()
), zr = (
  /** @class */
  function() {
    function e(A, r) {
      this.counterIncrement = d(A, Ua, r.counterIncrement), this.counterReset = d(A, Ca, r.counterReset);
    }
    return e;
  }()
), d = function(e, A, r) {
  var t = new RB(), B = r !== null && typeof r < "u" ? r.toString() : A.initialValue;
  t.write(B);
  var n = new kB(t.read());
  switch (A.type) {
    case 2:
      var s = n.parseComponentValue();
      return A.parse(e, S(s) ? s.value : A.initialValue);
    case 0:
      return A.parse(e, n.parseComponentValue());
    case 1:
      return A.parse(e, n.parseComponentValues());
    case 4:
      return n.parseComponentValue();
    case 3:
      switch (A.format) {
        case "angle":
          return Ct.parse(e, n.parseComponentValue());
        case "color":
          return TA.parse(e, n.parseComponentValue());
        case "image":
          return Ur.parse(e, n.parseComponentValue());
        case "length":
          var o = n.parseComponentValue();
          return GA(o) ? o : Z;
        case "length-percentage":
          var i = n.parseComponentValue();
          return P(i) ? i : Z;
        case "time":
          return nn.parse(e, n.parseComponentValue());
      }
      break;
  }
}, ya = "data-html2canvas-debug", ma = function(e) {
  var A = e.getAttribute(ya);
  switch (A) {
    case "all":
      return 1;
    case "clone":
      return 2;
    case "parse":
      return 3;
    case "render":
      return 4;
    default:
      return 0;
  }
}, sr = function(e, A) {
  var r = ma(e);
  return r === 1 || A === r;
}, hA = (
  /** @class */
  function() {
    function e(A, r) {
      if (this.context = A, this.textNodes = [], this.elements = [], this.flags = 0, sr(
        r,
        3
        /* PARSE */
      ))
        debugger;
      this.styles = new Ea(A, window.getComputedStyle(r, null)), ar(r) && (this.styles.animationDuration.some(function(t) {
        return t > 0;
      }) && (r.style.animationDuration = "0s"), this.styles.transform !== null && (r.style.transform = "none")), this.bounds = ut(this.context, r), sr(
        r,
        4
        /* RENDER */
      ) && (this.flags |= 16);
    }
    return e;
  }()
), Ka = "AAAAAAAAAAAAEA4AGBkAAFAaAAACAAAAAAAIABAAGAAwADgACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAQABIAEQATAAIABAACAAQAAgAEAAIABAAVABcAAgAEAAIABAACAAQAGAAaABwAHgAgACIAI4AlgAIABAAmwCjAKgAsAC2AL4AvQDFAMoA0gBPAVYBWgEIAAgACACMANoAYgFkAWwBdAF8AX0BhQGNAZUBlgGeAaMBlQGWAasBswF8AbsBwwF0AcsBYwHTAQgA2wG/AOMBdAF8AekB8QF0AfkB+wHiAHQBfAEIAAMC5gQIAAsCEgIIAAgAFgIeAggAIgIpAggAMQI5AkACygEIAAgASAJQAlgCYAIIAAgACAAKBQoFCgUTBRMFGQUrBSsFCAAIAAgACAAIAAgACAAIAAgACABdAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABoAmgCrwGvAQgAbgJ2AggAHgEIAAgACADnAXsCCAAIAAgAgwIIAAgACAAIAAgACACKAggAkQKZAggAPADJAAgAoQKkAqwCsgK6AsICCADJAggA0AIIAAgACAAIANYC3gIIAAgACAAIAAgACABAAOYCCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAkASoB+QIEAAgACAA8AEMCCABCBQgACABJBVAFCAAIAAgACAAIAAgACAAIAAgACABTBVoFCAAIAFoFCABfBWUFCAAIAAgACAAIAAgAbQUIAAgACAAIAAgACABzBXsFfQWFBYoFigWKBZEFigWKBYoFmAWfBaYFrgWxBbkFCAAIAAgACAAIAAgACAAIAAgACAAIAMEFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAMgFCADQBQgACAAIAAgACAAIAAgACAAIAAgACAAIAO4CCAAIAAgAiQAIAAgACABAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAD0AggACAD8AggACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIANYFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAMDvwAIAAgAJAIIAAgACAAIAAgACAAIAAgACwMTAwgACAB9BOsEGwMjAwgAKwMyAwsFYgE3A/MEPwMIAEUDTQNRAwgAWQOsAGEDCAAIAAgACAAIAAgACABpAzQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFIQUoBSwFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABtAwgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABMAEwACAAIAAgACAAIABgACAAIAAgACAC/AAgACAAyAQgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACAAIAAwAAgACAAIAAgACAAIAAgACAAIAAAARABIAAgACAAIABQASAAIAAgAIABwAEAAjgCIABsAqAC2AL0AigDQAtwC+IJIQqVAZUBWQqVAZUBlQGVAZUBlQGrC5UBlQGVAZUBlQGVAZUBlQGVAXsKlQGVAbAK6wsrDGUMpQzlDJUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAfAKAAuZA64AtwCJALoC6ADwAAgAuACgA/oEpgO6AqsD+AAIAAgAswMIAAgACAAIAIkAuwP5AfsBwwPLAwgACAAIAAgACADRA9kDCAAIAOED6QMIAAgACAAIAAgACADuA/YDCAAIAP4DyQAIAAgABgQIAAgAXQAOBAgACAAIAAgACAAIABMECAAIAAgACAAIAAgACAD8AAQBCAAIAAgAGgQiBCoECAExBAgAEAEIAAgACAAIAAgACAAIAAgACAAIAAgACAA4BAgACABABEYECAAIAAgATAQYAQgAVAQIAAgACAAIAAgACAAIAAgACAAIAFoECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAOQEIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAB+BAcACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAEABhgSMBAgACAAIAAgAlAQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAwAEAAQABAADAAMAAwADAAQABAAEAAQABAAEAAQABHATAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAdQMIAAgACAAIAAgACAAIAMkACAAIAAgAfQMIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACFA4kDCAAIAAgACAAIAOcBCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAIcDCAAIAAgACAAIAAgACAAIAAgACAAIAJEDCAAIAAgACADFAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABgBAgAZgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAbAQCBXIECAAIAHkECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABAAJwEQACjBKoEsgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAC6BMIECAAIAAgACAAIAAgACABmBAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAxwQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAGYECAAIAAgAzgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBd0FXwUIAOIF6gXxBYoF3gT5BQAGCAaKBYoFigWKBYoFigWKBYoFigWKBYoFigXWBIoFigWKBYoFigWKBYoFigWKBYsFEAaKBYoFigWKBYoFigWKBRQGCACKBYoFigWKBQgACAAIANEECAAIABgGigUgBggAJgYIAC4GMwaKBYoF0wQ3Bj4GigWKBYoFigWKBYoFigWKBYoFigWKBYoFigUIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWLBf///////wQABAAEAAQABAAEAAQABAAEAAQAAwAEAAQAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAQADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUAAAAFAAUAAAAFAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAQAAAAUABQAFAAUABQAFAAAAAAAFAAUAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAFAAUAAQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAAABwAHAAcAAAAHAAcABwAFAAEAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAcABwAFAAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAQABAAAAAAAAAAAAAAAFAAUABQAFAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAHAAcAAAAHAAcAAAAAAAUABQAHAAUAAQAHAAEABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwABAAUABQAFAAUAAAAAAAAAAAAAAAEAAQABAAEAAQABAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABQANAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAABQAHAAUABQAFAAAAAAAAAAcABQAFAAUABQAFAAQABAAEAAQABAAEAAQABAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUAAAAFAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAUAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAcABwAFAAcABwAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUABwAHAAUABQAFAAUAAAAAAAcABwAAAAAABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAAAAAAAAAAABQAFAAAAAAAFAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAFAAUABQAFAAUAAAAFAAUABwAAAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABwAFAAUABQAFAAAAAAAHAAcAAAAAAAcABwAFAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAAAAAAAAAHAAcABwAAAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAUABQAFAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAHAAcABQAHAAcAAAAFAAcABwAAAAcABwAFAAUAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAFAAcABwAFAAUABQAAAAUAAAAHAAcABwAHAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAHAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAUAAAAFAAUAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABwAFAAUABQAFAAUABQAAAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABQAFAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAFAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAHAAUABQAFAAUABQAFAAUABwAHAAcABwAHAAcABwAHAAUABwAHAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABwAHAAcABwAFAAUABwAHAAcAAAAAAAAAAAAHAAcABQAHAAcABwAHAAcABwAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAUABQAFAAUABQAFAAUAAAAFAAAABQAAAAAABQAFAAUABQAFAAUABQAFAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAUABQAFAAUABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABwAFAAcABwAHAAcABwAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAUABQAFAAUABwAHAAUABQAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABQAFAAcABwAHAAUABwAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAcABQAFAAUABQAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAAAAAABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAAAAAAAAAFAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAUABQAHAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAFAAUABQAFAAcABwAFAAUABwAHAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAcABwAFAAUABwAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABQAAAAAABQAFAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAcABwAAAAAAAAAAAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAcABwAFAAcABwAAAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAFAAUABQAAAAUABQAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABwAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAHAAcABQAHAAUABQAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAAABwAHAAAAAAAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAFAAUABwAFAAcABwAFAAcABQAFAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAAAAAABwAHAAcABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAFAAcABwAFAAUABQAFAAUABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAUABQAFAAcABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABQAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAAAAAAFAAUABwAHAAcABwAFAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAHAAUABQAFAAUABQAFAAUABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAABQAAAAUABQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAHAAcAAAAFAAUAAAAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABQAFAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAABQAFAAUABQAFAAUABQAAAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAFAAUABQAFAAUADgAOAA4ADgAOAA4ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAMAAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAAAAAAAAAAAAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAAAAAAAAAAAAsADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwACwAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAADgAOAA4AAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAAAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4AAAAOAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAAAAAAAAAAAA4AAAAOAAAAAAAAAAAADgAOAA4AAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAA=", $r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", he = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var _e = 0; _e < $r.length; _e++)
  he[$r.charCodeAt(_e)] = _e;
var va = function(e) {
  var A = e.length * 0.75, r = e.length, t, B = 0, n, s, o, i;
  e[e.length - 1] === "=" && (A--, e[e.length - 2] === "=" && A--);
  var a = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(A) : new Array(A), c = Array.isArray(a) ? a : new Uint8Array(a);
  for (t = 0; t < r; t += 4)
    n = he[e.charCodeAt(t)], s = he[e.charCodeAt(t + 1)], o = he[e.charCodeAt(t + 2)], i = he[e.charCodeAt(t + 3)], c[B++] = n << 2 | s >> 4, c[B++] = (s & 15) << 4 | o >> 2, c[B++] = (o & 3) << 6 | i & 63;
  return a;
}, La = function(e) {
  for (var A = e.length, r = [], t = 0; t < A; t += 2)
    r.push(e[t + 1] << 8 | e[t]);
  return r;
}, ba = function(e) {
  for (var A = e.length, r = [], t = 0; t < A; t += 4)
    r.push(e[t + 3] << 24 | e[t + 2] << 16 | e[t + 1] << 8 | e[t]);
  return r;
}, JA = 5, Cr = 6 + 5, xt = 2, Da = Cr - JA, sn = 65536 >> JA, xa = 1 << JA, St = xa - 1, Sa = 1024 >> JA, Ma = sn + Sa, Ta = Ma, Oa = 32, Ga = Ta + Oa, Va = 65536 >> Cr, Ra = 1 << Da, ka = Ra - 1, AB = function(e, A, r) {
  return e.slice ? e.slice(A, r) : new Uint16Array(Array.prototype.slice.call(e, A, r));
}, Pa = function(e, A, r) {
  return e.slice ? e.slice(A, r) : new Uint32Array(Array.prototype.slice.call(e, A, r));
}, Na = function(e, A) {
  var r = va(e), t = Array.isArray(r) ? ba(r) : new Uint32Array(r), B = Array.isArray(r) ? La(r) : new Uint16Array(r), n = 24, s = AB(B, n / 2, t[4] / 2), o = t[5] === 2 ? AB(B, (n + t[4]) / 2) : Pa(t, Math.ceil((n + t[4]) / 4));
  return new Xa(t[0], t[1], t[2], t[3], s, o);
}, Xa = (
  /** @class */
  function() {
    function e(A, r, t, B, n, s) {
      this.initialValue = A, this.errorValue = r, this.highStart = t, this.highValueIndex = B, this.index = n, this.data = s;
    }
    return e.prototype.get = function(A) {
      var r;
      if (A >= 0) {
        if (A < 55296 || A > 56319 && A <= 65535)
          return r = this.index[A >> JA], r = (r << xt) + (A & St), this.data[r];
        if (A <= 65535)
          return r = this.index[sn + (A - 55296 >> JA)], r = (r << xt) + (A & St), this.data[r];
        if (A < this.highStart)
          return r = Ga - Va + (A >> Cr), r = this.index[r], r += A >> JA & ka, r = this.index[r], r = (r << xt) + (A & St), this.data[r];
        if (A <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, e;
  }()
), eB = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Ja = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var qe = 0; qe < eB.length; qe++)
  Ja[eB.charCodeAt(qe)] = qe;
var Ya = 1, Mt = 2, Tt = 3, tB = 4, rB = 5, Wa = 7, BB = 8, Ot = 9, Gt = 10, nB = 11, sB = 12, oB = 13, iB = 14, Vt = 15, Za = function(e) {
  for (var A = [], r = 0, t = e.length; r < t; ) {
    var B = e.charCodeAt(r++);
    if (B >= 55296 && B <= 56319 && r < t) {
      var n = e.charCodeAt(r++);
      (n & 64512) === 56320 ? A.push(((B & 1023) << 10) + (n & 1023) + 65536) : (A.push(B), r--);
    } else
      A.push(B);
  }
  return A;
}, _a = function() {
  for (var e = [], A = 0; A < arguments.length; A++)
    e[A] = arguments[A];
  if (String.fromCodePoint)
    return String.fromCodePoint.apply(String, e);
  var r = e.length;
  if (!r)
    return "";
  for (var t = [], B = -1, n = ""; ++B < r; ) {
    var s = e[B];
    s <= 65535 ? t.push(s) : (s -= 65536, t.push((s >> 10) + 55296, s % 1024 + 56320)), (B + 1 === r || t.length > 16384) && (n += String.fromCharCode.apply(String, t), t.length = 0);
  }
  return n;
}, qa = Na(Ka), NA = "×", aB = "÷", ja = function(e) {
  return qa.get(e);
}, za = function(e, A, r) {
  var t = r - 2, B = A[t], n = A[r - 1], s = A[r];
  if (n === Mt && s === Tt)
    return NA;
  if (n === Mt || n === Tt || n === tB || s === Mt || s === Tt || s === tB)
    return aB;
  if (n === BB && [BB, Ot, nB, sB].indexOf(s) !== -1 || (n === nB || n === Ot) && (s === Ot || s === Gt) || (n === sB || n === Gt) && s === Gt || s === oB || s === rB || s === Wa || n === Ya)
    return NA;
  if (n === oB && s === iB) {
    for (; B === rB; )
      B = A[--t];
    if (B === iB)
      return NA;
  }
  if (n === Vt && s === Vt) {
    for (var o = 0; B === Vt; )
      o++, B = A[--t];
    if (o % 2 === 0)
      return NA;
  }
  return aB;
}, $a = function(e) {
  var A = Za(e), r = A.length, t = 0, B = 0, n = A.map(ja);
  return {
    next: function() {
      if (t >= r)
        return { done: !0, value: null };
      for (var s = NA; t < r && (s = za(A, n, ++t)) === NA; )
        ;
      if (s !== NA || t === r) {
        var o = _a.apply(null, A.slice(B, t));
        return B = t, { value: o, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, Ac = function(e) {
  for (var A = $a(e), r = [], t; !(t = A.next()).done; )
    t.value && r.push(t.value.slice());
  return r;
}, ec = function(e) {
  var A = 123;
  if (e.createRange) {
    var r = e.createRange();
    if (r.getBoundingClientRect) {
      var t = e.createElement("boundtest");
      t.style.height = A + "px", t.style.display = "block", e.body.appendChild(t), r.selectNode(t);
      var B = r.getBoundingClientRect(), n = Math.round(B.height);
      if (e.body.removeChild(t), n === A)
        return !0;
    }
  }
  return !1;
}, tc = function(e) {
  var A = e.createElement("boundtest");
  A.style.width = "50px", A.style.display = "block", A.style.fontSize = "12px", A.style.letterSpacing = "0px", A.style.wordSpacing = "0px", e.body.appendChild(A);
  var r = e.createRange();
  A.innerHTML = typeof "".repeat == "function" ? "&#128104;".repeat(10) : "";
  var t = A.firstChild, B = Ut(t.data).map(function(i) {
    return k(i);
  }), n = 0, s = {}, o = B.every(function(i, a) {
    r.setStart(t, n), r.setEnd(t, n + i.length);
    var c = r.getBoundingClientRect();
    n += i.length;
    var l = c.x > s.x || c.y > s.y;
    return s = c, a === 0 ? !0 : l;
  });
  return e.body.removeChild(A), o;
}, rc = function() {
  return typeof new Image().crossOrigin < "u";
}, Bc = function() {
  return typeof new XMLHttpRequest().responseType == "string";
}, nc = function(e) {
  var A = new Image(), r = e.createElement("canvas"), t = r.getContext("2d");
  if (!t)
    return !1;
  A.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";
  try {
    t.drawImage(A, 0, 0), r.toDataURL();
  } catch (B) {
    return !1;
  }
  return !0;
}, cB = function(e) {
  return e[0] === 0 && e[1] === 255 && e[2] === 0 && e[3] === 255;
}, sc = function(e) {
  var A = e.createElement("canvas"), r = 100;
  A.width = r, A.height = r;
  var t = A.getContext("2d");
  if (!t)
    return Promise.reject(!1);
  t.fillStyle = "rgb(0, 255, 0)", t.fillRect(0, 0, r, r);
  var B = new Image(), n = A.toDataURL();
  B.src = n;
  var s = or(r, r, 0, 0, B);
  return t.fillStyle = "red", t.fillRect(0, 0, r, r), lB(s).then(function(o) {
    t.drawImage(o, 0, 0);
    var i = t.getImageData(0, 0, r, r).data;
    t.fillStyle = "red", t.fillRect(0, 0, r, r);
    var a = e.createElement("div");
    return a.style.backgroundImage = "url(" + n + ")", a.style.height = r + "px", cB(i) ? lB(or(r, r, 0, 0, a)) : Promise.reject(!1);
  }).then(function(o) {
    return t.drawImage(o, 0, 0), cB(t.getImageData(0, 0, r, r).data);
  }).catch(function() {
    return !1;
  });
}, or = function(e, A, r, t, B) {
  var n = "http://www.w3.org/2000/svg", s = document.createElementNS(n, "svg"), o = document.createElementNS(n, "foreignObject");
  return s.setAttributeNS(null, "width", e.toString()), s.setAttributeNS(null, "height", A.toString()), o.setAttributeNS(null, "width", "100%"), o.setAttributeNS(null, "height", "100%"), o.setAttributeNS(null, "x", r.toString()), o.setAttributeNS(null, "y", t.toString()), o.setAttributeNS(null, "externalResourcesRequired", "true"), s.appendChild(o), o.appendChild(B), s;
}, lB = function(e) {
  return new Promise(function(A, r) {
    var t = new Image();
    t.onload = function() {
      return A(t);
    }, t.onerror = r, t.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(e));
  });
}, W = {
  get SUPPORT_RANGE_BOUNDS() {
    var e = ec(document);
    return Object.defineProperty(W, "SUPPORT_RANGE_BOUNDS", { value: e }), e;
  },
  get SUPPORT_WORD_BREAKING() {
    var e = W.SUPPORT_RANGE_BOUNDS && tc(document);
    return Object.defineProperty(W, "SUPPORT_WORD_BREAKING", { value: e }), e;
  },
  get SUPPORT_SVG_DRAWING() {
    var e = nc(document);
    return Object.defineProperty(W, "SUPPORT_SVG_DRAWING", { value: e }), e;
  },
  get SUPPORT_FOREIGNOBJECT_DRAWING() {
    var e = typeof Array.from == "function" && typeof window.fetch == "function" ? sc(document) : Promise.resolve(!1);
    return Object.defineProperty(W, "SUPPORT_FOREIGNOBJECT_DRAWING", { value: e }), e;
  },
  get SUPPORT_CORS_IMAGES() {
    var e = rc();
    return Object.defineProperty(W, "SUPPORT_CORS_IMAGES", { value: e }), e;
  },
  get SUPPORT_RESPONSE_TYPE() {
    var e = Bc();
    return Object.defineProperty(W, "SUPPORT_RESPONSE_TYPE", { value: e }), e;
  },
  get SUPPORT_CORS_XHR() {
    var e = "withCredentials" in new XMLHttpRequest();
    return Object.defineProperty(W, "SUPPORT_CORS_XHR", { value: e }), e;
  },
  get SUPPORT_NATIVE_TEXT_SEGMENTATION() {
    var e = !!(typeof Intl < "u" && Intl.Segmenter);
    return Object.defineProperty(W, "SUPPORT_NATIVE_TEXT_SEGMENTATION", { value: e }), e;
  }
}, Ee = (
  /** @class */
  function() {
    function e(A, r) {
      this.text = A, this.bounds = r;
    }
    return e;
  }()
), oc = function(e, A, r, t) {
  var B = cc(A, r), n = [], s = 0;
  return B.forEach(function(o) {
    if (r.textDecorationLine.length || o.trim().length > 0)
      if (W.SUPPORT_RANGE_BOUNDS) {
        var i = QB(t, s, o.length).getClientRects();
        if (i.length > 1) {
          var a = Fr(o), c = 0;
          a.forEach(function(g) {
            n.push(new Ee(g, mA.fromDOMRectList(e, QB(t, c + s, g.length).getClientRects()))), c += g.length;
          });
        } else
          n.push(new Ee(o, mA.fromDOMRectList(e, i)));
      } else {
        var l = t.splitText(o.length);
        n.push(new Ee(o, ic(e, t))), t = l;
      }
    else
      W.SUPPORT_RANGE_BOUNDS || (t = t.splitText(o.length));
    s += o.length;
  }), n;
}, ic = function(e, A) {
  var r = A.ownerDocument;
  if (r) {
    var t = r.createElement("html2canvaswrapper");
    t.appendChild(A.cloneNode(!0));
    var B = A.parentNode;
    if (B) {
      B.replaceChild(t, A);
      var n = ut(e, t);
      return t.firstChild && B.replaceChild(t.firstChild, t), n;
    }
  }
  return mA.EMPTY;
}, QB = function(e, A, r) {
  var t = e.ownerDocument;
  if (!t)
    throw new Error("Node has no owner document");
  var B = t.createRange();
  return B.setStart(e, A), B.setEnd(e, A + r), B;
}, Fr = function(e) {
  if (W.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var A = new Intl.Segmenter(void 0, { granularity: "grapheme" });
    return Array.from(A.segment(e)).map(function(r) {
      return r.segment;
    });
  }
  return Ac(e);
}, ac = function(e, A) {
  if (W.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var r = new Intl.Segmenter(void 0, {
      granularity: "word"
    });
    return Array.from(r.segment(e)).map(function(t) {
      return t.segment;
    });
  }
  return Qc(e, A);
}, cc = function(e, A) {
  return A.letterSpacing !== 0 ? Fr(e) : ac(e, A);
}, lc = [32, 160, 4961, 65792, 65793, 4153, 4241], Qc = function(e, A) {
  for (var r = Gs(e, {
    lineBreak: A.lineBreak,
    wordBreak: A.overflowWrap === "break-word" ? "break-word" : A.wordBreak
  }), t = [], B, n = function() {
    if (B.value) {
      var s = B.value.slice(), o = Ut(s), i = "";
      o.forEach(function(a) {
        lc.indexOf(a) === -1 ? i += k(a) : (i.length && t.push(i), t.push(k(a)), i = "");
      }), i.length && t.push(i);
    }
  }; !(B = r.next()).done; )
    n();
  return t;
}, gc = (
  /** @class */
  function() {
    function e(A, r, t) {
      this.text = wc(r.data, t.textTransform), this.textBounds = oc(A, this.text, t, r);
    }
    return e;
  }()
), wc = function(e, A) {
  switch (A) {
    case 1:
      return e.toLowerCase();
    case 3:
      return e.replace(uc, Uc);
    case 2:
      return e.toUpperCase();
    default:
      return e;
  }
}, uc = /(^|\s|:|-|\(|\))([a-z])/g, Uc = function(e, A, r) {
  return e.length > 0 ? A + r.toUpperCase() : e;
}, on = (
  /** @class */
  function(e) {
    QA(A, e);
    function A(r, t) {
      var B = e.call(this, r, t) || this;
      return B.src = t.currentSrc || t.src, B.intrinsicWidth = t.naturalWidth, B.intrinsicHeight = t.naturalHeight, B.context.cache.addImage(B.src), B;
    }
    return A;
  }(hA)
), an = (
  /** @class */
  function(e) {
    QA(A, e);
    function A(r, t) {
      var B = e.call(this, r, t) || this;
      return B.canvas = t, B.intrinsicWidth = t.width, B.intrinsicHeight = t.height, B;
    }
    return A;
  }(hA)
), cn = (
  /** @class */
  function(e) {
    QA(A, e);
    function A(r, t) {
      var B = e.call(this, r, t) || this, n = new XMLSerializer(), s = ut(r, t);
      return t.setAttribute("width", s.width + "px"), t.setAttribute("height", s.height + "px"), B.svg = "data:image/svg+xml," + encodeURIComponent(n.serializeToString(t)), B.intrinsicWidth = t.width.baseVal.value, B.intrinsicHeight = t.height.baseVal.value, B.context.cache.addImage(B.svg), B;
    }
    return A;
  }(hA)
), ln = (
  /** @class */
  function(e) {
    QA(A, e);
    function A(r, t) {
      var B = e.call(this, r, t) || this;
      return B.value = t.value, B;
    }
    return A;
  }(hA)
), ir = (
  /** @class */
  function(e) {
    QA(A, e);
    function A(r, t) {
      var B = e.call(this, r, t) || this;
      return B.start = t.start, B.reversed = typeof t.reversed == "boolean" && t.reversed === !0, B;
    }
    return A;
  }(hA)
), Cc = [
  {
    type: 15,
    flags: 0,
    unit: "px",
    number: 3
  }
], Fc = [
  {
    type: 16,
    flags: 0,
    number: 50
  }
], hc = function(e) {
  return e.width > e.height ? new mA(e.left + (e.width - e.height) / 2, e.top, e.height, e.height) : e.width < e.height ? new mA(e.left, e.top + (e.height - e.width) / 2, e.width, e.width) : e;
}, dc = function(e) {
  var A = e.type === fc ? new Array(e.value.length + 1).join("•") : e.value;
  return A.length === 0 ? e.placeholder || "" : A;
}, it = "checkbox", at = "radio", fc = "password", gB = 707406591, hr = (
  /** @class */
  function(e) {
    QA(A, e);
    function A(r, t) {
      var B = e.call(this, r, t) || this;
      switch (B.type = t.type.toLowerCase(), B.checked = t.checked, B.value = dc(t), (B.type === it || B.type === at) && (B.styles.backgroundColor = 3739148031, B.styles.borderTopColor = B.styles.borderRightColor = B.styles.borderBottomColor = B.styles.borderLeftColor = 2779096575, B.styles.borderTopWidth = B.styles.borderRightWidth = B.styles.borderBottomWidth = B.styles.borderLeftWidth = 1, B.styles.borderTopStyle = B.styles.borderRightStyle = B.styles.borderBottomStyle = B.styles.borderLeftStyle = 1, B.styles.backgroundClip = [
        0
        /* BORDER_BOX */
      ], B.styles.backgroundOrigin = [
        0
        /* BORDER_BOX */
      ], B.bounds = hc(B.bounds)), B.type) {
        case it:
          B.styles.borderTopRightRadius = B.styles.borderTopLeftRadius = B.styles.borderBottomRightRadius = B.styles.borderBottomLeftRadius = Cc;
          break;
        case at:
          B.styles.borderTopRightRadius = B.styles.borderTopLeftRadius = B.styles.borderBottomRightRadius = B.styles.borderBottomLeftRadius = Fc;
          break;
      }
      return B;
    }
    return A;
  }(hA)
), Qn = (
  /** @class */
  function(e) {
    QA(A, e);
    function A(r, t) {
      var B = e.call(this, r, t) || this, n = t.options[t.selectedIndex || 0];
      return B.value = n && n.text || "", B;
    }
    return A;
  }(hA)
), gn = (
  /** @class */
  function(e) {
    QA(A, e);
    function A(r, t) {
      var B = e.call(this, r, t) || this;
      return B.value = t.value, B;
    }
    return A;
  }(hA)
), wn = (
  /** @class */
  function(e) {
    QA(A, e);
    function A(r, t) {
      var B = e.call(this, r, t) || this;
      B.src = t.src, B.width = parseInt(t.width, 10) || 0, B.height = parseInt(t.height, 10) || 0, B.backgroundColor = B.styles.backgroundColor;
      try {
        if (t.contentWindow && t.contentWindow.document && t.contentWindow.document.documentElement) {
          B.tree = Un(r, t.contentWindow.document.documentElement);
          var n = t.contentWindow.document.documentElement ? pe(r, getComputedStyle(t.contentWindow.document.documentElement).backgroundColor) : yA.TRANSPARENT, s = t.contentWindow.document.body ? pe(r, getComputedStyle(t.contentWindow.document.body).backgroundColor) : yA.TRANSPARENT;
          B.backgroundColor = OA(n) ? OA(s) ? B.styles.backgroundColor : s : n;
        }
      } catch (o) {
      }
      return B;
    }
    return A;
  }(hA)
), pc = ["OL", "UL", "MENU"], rt = function(e, A, r, t) {
  for (var B = A.firstChild, n = void 0; B; B = n)
    if (n = B.nextSibling, Cn(B) && B.data.trim().length > 0)
      r.textNodes.push(new gc(e, B, r.styles));
    else if (ne(B))
      if (fn(B) && B.assignedNodes)
        B.assignedNodes().forEach(function(o) {
          return rt(e, o, r, t);
        });
      else {
        var s = un(e, B);
        s.styles.isVisible() && (Hc(B, s, t) ? s.flags |= 4 : Ec(s.styles) && (s.flags |= 2), pc.indexOf(B.tagName) !== -1 && (s.flags |= 8), r.elements.push(s), B.slot, B.shadowRoot ? rt(e, B.shadowRoot, s, t) : !ct(B) && !Fn(B) && !lt(B) && rt(e, B, s, t));
      }
}, un = function(e, A) {
  return cr(A) ? new on(e, A) : hn(A) ? new an(e, A) : Fn(A) ? new cn(e, A) : Ic(A) ? new ln(e, A) : yc(A) ? new ir(e, A) : mc(A) ? new hr(e, A) : lt(A) ? new Qn(e, A) : ct(A) ? new gn(e, A) : dn(A) ? new wn(e, A) : new hA(e, A);
}, Un = function(e, A) {
  var r = un(e, A);
  return r.flags |= 4, rt(e, A, r, r), r;
}, Hc = function(e, A, r) {
  return A.styles.isPositionedWithZIndex() || A.styles.opacity < 1 || A.styles.isTransformed() || dr(e) && r.styles.isTransparent();
}, Ec = function(e) {
  return e.isPositioned() || e.isFloating();
}, Cn = function(e) {
  return e.nodeType === Node.TEXT_NODE;
}, ne = function(e) {
  return e.nodeType === Node.ELEMENT_NODE;
}, ar = function(e) {
  return ne(e) && typeof e.style < "u" && !Bt(e);
}, Bt = function(e) {
  return typeof e.className == "object";
}, Ic = function(e) {
  return e.tagName === "LI";
}, yc = function(e) {
  return e.tagName === "OL";
}, mc = function(e) {
  return e.tagName === "INPUT";
}, Kc = function(e) {
  return e.tagName === "HTML";
}, Fn = function(e) {
  return e.tagName === "svg";
}, dr = function(e) {
  return e.tagName === "BODY";
}, hn = function(e) {
  return e.tagName === "CANVAS";
}, wB = function(e) {
  return e.tagName === "VIDEO";
}, cr = function(e) {
  return e.tagName === "IMG";
}, dn = function(e) {
  return e.tagName === "IFRAME";
}, uB = function(e) {
  return e.tagName === "STYLE";
}, vc = function(e) {
  return e.tagName === "SCRIPT";
}, ct = function(e) {
  return e.tagName === "TEXTAREA";
}, lt = function(e) {
  return e.tagName === "SELECT";
}, fn = function(e) {
  return e.tagName === "SLOT";
}, UB = function(e) {
  return e.tagName.indexOf("-") > 0;
}, Lc = (
  /** @class */
  function() {
    function e() {
      this.counters = {};
    }
    return e.prototype.getCounterValue = function(A) {
      var r = this.counters[A];
      return r && r.length ? r[r.length - 1] : 1;
    }, e.prototype.getCounterValues = function(A) {
      var r = this.counters[A];
      return r || [];
    }, e.prototype.pop = function(A) {
      var r = this;
      A.forEach(function(t) {
        return r.counters[t].pop();
      });
    }, e.prototype.parse = function(A) {
      var r = this, t = A.counterIncrement, B = A.counterReset, n = !0;
      t !== null && t.forEach(function(o) {
        var i = r.counters[o.counter];
        i && o.increment !== 0 && (n = !1, i.length || i.push(1), i[Math.max(0, i.length - 1)] += o.increment);
      });
      var s = [];
      return n && B.forEach(function(o) {
        var i = r.counters[o.counter];
        s.push(o.counter), i || (i = r.counters[o.counter] = []), i.push(o.reset);
      }), s;
    }, e;
  }()
), CB = {
  integers: [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
  values: ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
}, FB = {
  integers: [
    9e3,
    8e3,
    7e3,
    6e3,
    5e3,
    4e3,
    3e3,
    2e3,
    1e3,
    900,
    800,
    700,
    600,
    500,
    400,
    300,
    200,
    100,
    90,
    80,
    70,
    60,
    50,
    40,
    30,
    20,
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1
  ],
  values: [
    "Ք",
    "Փ",
    "Ւ",
    "Ց",
    "Ր",
    "Տ",
    "Վ",
    "Ս",
    "Ռ",
    "Ջ",
    "Պ",
    "Չ",
    "Ո",
    "Շ",
    "Ն",
    "Յ",
    "Մ",
    "Ճ",
    "Ղ",
    "Ձ",
    "Հ",
    "Կ",
    "Ծ",
    "Խ",
    "Լ",
    "Ի",
    "Ժ",
    "Թ",
    "Ը",
    "Է",
    "Զ",
    "Ե",
    "Դ",
    "Գ",
    "Բ",
    "Ա"
  ]
}, bc = {
  integers: [
    1e4,
    9e3,
    8e3,
    7e3,
    6e3,
    5e3,
    4e3,
    3e3,
    2e3,
    1e3,
    400,
    300,
    200,
    100,
    90,
    80,
    70,
    60,
    50,
    40,
    30,
    20,
    19,
    18,
    17,
    16,
    15,
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1
  ],
  values: [
    "י׳",
    "ט׳",
    "ח׳",
    "ז׳",
    "ו׳",
    "ה׳",
    "ד׳",
    "ג׳",
    "ב׳",
    "א׳",
    "ת",
    "ש",
    "ר",
    "ק",
    "צ",
    "פ",
    "ע",
    "ס",
    "נ",
    "מ",
    "ל",
    "כ",
    "יט",
    "יח",
    "יז",
    "טז",
    "טו",
    "י",
    "ט",
    "ח",
    "ז",
    "ו",
    "ה",
    "ד",
    "ג",
    "ב",
    "א"
  ]
}, Dc = {
  integers: [
    1e4,
    9e3,
    8e3,
    7e3,
    6e3,
    5e3,
    4e3,
    3e3,
    2e3,
    1e3,
    900,
    800,
    700,
    600,
    500,
    400,
    300,
    200,
    100,
    90,
    80,
    70,
    60,
    50,
    40,
    30,
    20,
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1
  ],
  values: [
    "ჵ",
    "ჰ",
    "ჯ",
    "ჴ",
    "ხ",
    "ჭ",
    "წ",
    "ძ",
    "ც",
    "ჩ",
    "შ",
    "ყ",
    "ღ",
    "ქ",
    "ფ",
    "ჳ",
    "ტ",
    "ს",
    "რ",
    "ჟ",
    "პ",
    "ო",
    "ჲ",
    "ნ",
    "მ",
    "ლ",
    "კ",
    "ი",
    "თ",
    "ჱ",
    "ზ",
    "ვ",
    "ე",
    "დ",
    "გ",
    "ბ",
    "ა"
  ]
}, zA = function(e, A, r, t, B, n) {
  return e < A || e > r ? Ke(e, B, n.length > 0) : t.integers.reduce(function(s, o, i) {
    for (; e >= o; )
      e -= o, s += t.values[i];
    return s;
  }, "") + n;
}, pn = function(e, A, r, t) {
  var B = "";
  do
    r || e--, B = t(e) + B, e /= A;
  while (e * A >= A);
  return B;
}, R = function(e, A, r, t, B) {
  var n = r - A + 1;
  return (e < 0 ? "-" : "") + (pn(Math.abs(e), n, t, function(s) {
    return k(Math.floor(s % n) + A);
  }) + B);
}, kA = function(e, A, r) {
  r === void 0 && (r = ". ");
  var t = A.length;
  return pn(Math.abs(e), t, !1, function(B) {
    return A[Math.floor(B % t)];
  }) + r;
}, ee = 1, vA = 2, LA = 4, de = 8, IA = function(e, A, r, t, B, n) {
  if (e < -9999 || e > 9999)
    return Ke(e, 4, B.length > 0);
  var s = Math.abs(e), o = B;
  if (s === 0)
    return A[0] + o;
  for (var i = 0; s > 0 && i <= 4; i++) {
    var a = s % 10;
    a === 0 && X(n, ee) && o !== "" ? o = A[a] + o : a > 1 || a === 1 && i === 0 || a === 1 && i === 1 && X(n, vA) || a === 1 && i === 1 && X(n, LA) && e > 100 || a === 1 && i > 1 && X(n, de) ? o = A[a] + (i > 0 ? r[i - 1] : "") + o : a === 1 && i > 0 && (o = r[i - 1] + o), s = Math.floor(s / 10);
  }
  return (e < 0 ? t : "") + o;
}, hB = "十百千萬", dB = "拾佰仟萬", fB = "マイナス", Rt = "마이너스", Ke = function(e, A, r) {
  var t = r ? ". " : "", B = r ? "、" : "", n = r ? ", " : "", s = r ? " " : "";
  switch (A) {
    case 0:
      return "•" + s;
    case 1:
      return "◦" + s;
    case 2:
      return "◾" + s;
    case 5:
      var o = R(e, 48, 57, !0, t);
      return o.length < 4 ? "0" + o : o;
    case 4:
      return kA(e, "〇一二三四五六七八九", B);
    case 6:
      return zA(e, 1, 3999, CB, 3, t).toLowerCase();
    case 7:
      return zA(e, 1, 3999, CB, 3, t);
    case 8:
      return R(e, 945, 969, !1, t);
    case 9:
      return R(e, 97, 122, !1, t);
    case 10:
      return R(e, 65, 90, !1, t);
    case 11:
      return R(e, 1632, 1641, !0, t);
    case 12:
    case 49:
      return zA(e, 1, 9999, FB, 3, t);
    case 35:
      return zA(e, 1, 9999, FB, 3, t).toLowerCase();
    case 13:
      return R(e, 2534, 2543, !0, t);
    case 14:
    case 30:
      return R(e, 6112, 6121, !0, t);
    case 15:
      return kA(e, "子丑寅卯辰巳午未申酉戌亥", B);
    case 16:
      return kA(e, "甲乙丙丁戊己庚辛壬癸", B);
    case 17:
    case 48:
      return IA(e, "零一二三四五六七八九", hB, "負", B, vA | LA | de);
    case 47:
      return IA(e, "零壹貳參肆伍陸柒捌玖", dB, "負", B, ee | vA | LA | de);
    case 42:
      return IA(e, "零一二三四五六七八九", hB, "负", B, vA | LA | de);
    case 41:
      return IA(e, "零壹贰叁肆伍陆柒捌玖", dB, "负", B, ee | vA | LA | de);
    case 26:
      return IA(e, "〇一二三四五六七八九", "十百千万", fB, B, 0);
    case 25:
      return IA(e, "零壱弐参四伍六七八九", "拾百千万", fB, B, ee | vA | LA);
    case 31:
      return IA(e, "영일이삼사오육칠팔구", "십백천만", Rt, n, ee | vA | LA);
    case 33:
      return IA(e, "零一二三四五六七八九", "十百千萬", Rt, n, 0);
    case 32:
      return IA(e, "零壹貳參四五六七八九", "拾百千", Rt, n, ee | vA | LA);
    case 18:
      return R(e, 2406, 2415, !0, t);
    case 20:
      return zA(e, 1, 19999, Dc, 3, t);
    case 21:
      return R(e, 2790, 2799, !0, t);
    case 22:
      return R(e, 2662, 2671, !0, t);
    case 22:
      return zA(e, 1, 10999, bc, 3, t);
    case 23:
      return kA(e, "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");
    case 24:
      return kA(e, "いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");
    case 27:
      return R(e, 3302, 3311, !0, t);
    case 28:
      return kA(e, "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン", B);
    case 29:
      return kA(e, "イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス", B);
    case 34:
      return R(e, 3792, 3801, !0, t);
    case 37:
      return R(e, 6160, 6169, !0, t);
    case 38:
      return R(e, 4160, 4169, !0, t);
    case 39:
      return R(e, 2918, 2927, !0, t);
    case 40:
      return R(e, 1776, 1785, !0, t);
    case 43:
      return R(e, 3046, 3055, !0, t);
    case 44:
      return R(e, 3174, 3183, !0, t);
    case 45:
      return R(e, 3664, 3673, !0, t);
    case 46:
      return R(e, 3872, 3881, !0, t);
    case 3:
    default:
      return R(e, 48, 57, !0, t);
  }
}, Hn = "data-html2canvas-ignore", pB = (
  /** @class */
  function() {
    function e(A, r, t) {
      if (this.context = A, this.options = t, this.scrolledElements = [], this.referenceElement = r, this.counters = new Lc(), this.quoteDepth = 0, !r.ownerDocument)
        throw new Error("Cloned element does not have an owner document");
      this.documentElement = this.cloneNode(r.ownerDocument.documentElement, !1);
    }
    return e.prototype.toIFrame = function(A, r) {
      var t = this, B = xc(A, r);
      if (!B.contentWindow)
        return Promise.reject("Unable to find iframe window");
      var n = A.defaultView.pageXOffset, s = A.defaultView.pageYOffset, o = B.contentWindow, i = o.document, a = Tc(B).then(function() {
        return AA(t, void 0, void 0, function() {
          var c, l;
          return j(this, function(g) {
            switch (g.label) {
              case 0:
                return this.scrolledElements.forEach(Rc), o && (o.scrollTo(r.left, r.top), /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && (o.scrollY !== r.top || o.scrollX !== r.left) && (this.context.logger.warn("Unable to restore scroll position for cloned document"), this.context.windowBounds = this.context.windowBounds.add(o.scrollX - r.left, o.scrollY - r.top, 0, 0))), c = this.options.onclone, l = this.clonedReferenceElement, typeof l > "u" ? [2, Promise.reject("Error finding the " + this.referenceElement.nodeName + " in the cloned document")] : i.fonts && i.fonts.ready ? [4, i.fonts.ready] : [3, 2];
              case 1:
                g.sent(), g.label = 2;
              case 2:
                return /(AppleWebKit)/g.test(navigator.userAgent) ? [4, Mc(i)] : [3, 4];
              case 3:
                g.sent(), g.label = 4;
              case 4:
                return typeof c == "function" ? [2, Promise.resolve().then(function() {
                  return c(i, l);
                }).then(function() {
                  return B;
                })] : [2, B];
            }
          });
        });
      });
      return i.open(), i.write(Gc(document.doctype) + "<html></html>"), Vc(this.referenceElement.ownerDocument, n, s), i.replaceChild(i.adoptNode(this.documentElement), i.documentElement), i.close(), a;
    }, e.prototype.createElementClone = function(A) {
      if (sr(
        A,
        2
        /* CLONE */
      ))
        debugger;
      if (hn(A))
        return this.createCanvasClone(A);
      if (wB(A))
        return this.createVideoClone(A);
      if (uB(A))
        return this.createStyleClone(A);
      var r = A.cloneNode(!1);
      return cr(r) && (cr(A) && A.currentSrc && A.currentSrc !== A.src && (r.src = A.currentSrc, r.srcset = ""), r.loading === "lazy" && (r.loading = "eager")), UB(r) ? this.createCustomElementClone(r) : r;
    }, e.prototype.createCustomElementClone = function(A) {
      var r = document.createElement("html2canvascustomelement");
      return kt(A.style, r), r;
    }, e.prototype.createStyleClone = function(A) {
      try {
        var r = A.sheet;
        if (r && r.cssRules) {
          var t = [].slice.call(r.cssRules, 0).reduce(function(n, s) {
            return s && typeof s.cssText == "string" ? n + s.cssText : n;
          }, ""), B = A.cloneNode(!1);
          return B.textContent = t, B;
        }
      } catch (n) {
        if (this.context.logger.error("Unable to access cssRules property", n), n.name !== "SecurityError")
          throw n;
      }
      return A.cloneNode(!1);
    }, e.prototype.createCanvasClone = function(A) {
      var r;
      if (this.options.inlineImages && A.ownerDocument) {
        var t = A.ownerDocument.createElement("img");
        try {
          return t.src = A.toDataURL(), t;
        } catch (a) {
          this.context.logger.info("Unable to inline canvas contents, canvas is tainted", A);
        }
      }
      var B = A.cloneNode(!1);
      try {
        B.width = A.width, B.height = A.height;
        var n = A.getContext("2d"), s = B.getContext("2d");
        if (s)
          if (!this.options.allowTaint && n)
            s.putImageData(n.getImageData(0, 0, A.width, A.height), 0, 0);
          else {
            var o = (r = A.getContext("webgl2")) !== null && r !== void 0 ? r : A.getContext("webgl");
            if (o) {
              var i = o.getContextAttributes();
              (i == null ? void 0 : i.preserveDrawingBuffer) === !1 && this.context.logger.warn("Unable to clone WebGL context as it has preserveDrawingBuffer=false", A);
            }
            s.drawImage(A, 0, 0);
          }
        return B;
      } catch (a) {
        this.context.logger.info("Unable to clone canvas as it is tainted", A);
      }
      return B;
    }, e.prototype.createVideoClone = function(A) {
      var r = A.ownerDocument.createElement("canvas");
      r.width = A.offsetWidth, r.height = A.offsetHeight;
      var t = r.getContext("2d");
      try {
        return t && (t.drawImage(A, 0, 0, r.width, r.height), this.options.allowTaint || t.getImageData(0, 0, r.width, r.height)), r;
      } catch (n) {
        this.context.logger.info("Unable to clone video as it is tainted", A);
      }
      var B = A.ownerDocument.createElement("canvas");
      return B.width = A.offsetWidth, B.height = A.offsetHeight, B;
    }, e.prototype.appendChildNode = function(A, r, t) {
      (!ne(r) || !vc(r) && !r.hasAttribute(Hn) && (typeof this.options.ignoreElements != "function" || !this.options.ignoreElements(r))) && (!this.options.copyStyles || !ne(r) || !uB(r)) && A.appendChild(this.cloneNode(r, t));
    }, e.prototype.cloneChildNodes = function(A, r, t) {
      for (var B = this, n = A.shadowRoot ? A.shadowRoot.firstChild : A.firstChild; n; n = n.nextSibling)
        if (ne(n) && fn(n) && typeof n.assignedNodes == "function") {
          var s = n.assignedNodes();
          s.length && s.forEach(function(o) {
            return B.appendChildNode(r, o, t);
          });
        } else
          this.appendChildNode(r, n, t);
    }, e.prototype.cloneNode = function(A, r) {
      if (Cn(A))
        return document.createTextNode(A.data);
      if (!A.ownerDocument)
        return A.cloneNode(!1);
      var t = A.ownerDocument.defaultView;
      if (t && ne(A) && (ar(A) || Bt(A))) {
        var B = this.createElementClone(A);
        B.style.transitionProperty = "none";
        var n = t.getComputedStyle(A), s = t.getComputedStyle(A, ":before"), o = t.getComputedStyle(A, ":after");
        this.referenceElement === A && ar(B) && (this.clonedReferenceElement = B), dr(B) && Nc(B);
        var i = this.counters.parse(new zr(this.context, n)), a = this.resolvePseudoContent(A, B, s, Ie.BEFORE);
        UB(A) && (r = !0), wB(A) || this.cloneChildNodes(A, B, r), a && B.insertBefore(a, B.firstChild);
        var c = this.resolvePseudoContent(A, B, o, Ie.AFTER);
        return c && B.appendChild(c), this.counters.pop(i), (n && (this.options.copyStyles || Bt(A)) && !dn(A) || r) && kt(n, B), (A.scrollTop !== 0 || A.scrollLeft !== 0) && this.scrolledElements.push([B, A.scrollLeft, A.scrollTop]), (ct(A) || lt(A)) && (ct(B) || lt(B)) && (B.value = A.value), B;
      }
      return A.cloneNode(!1);
    }, e.prototype.resolvePseudoContent = function(A, r, t, B) {
      var n = this;
      if (t) {
        var s = t.content, o = r.ownerDocument;
        if (!(!o || !s || s === "none" || s === "-moz-alt-content" || t.display === "none")) {
          this.counters.parse(new zr(this.context, t));
          var i = new Ia(this.context, t), a = o.createElement("html2canvaspseudoelement");
          kt(t, a), i.content.forEach(function(l) {
            if (l.type === 0)
              a.appendChild(o.createTextNode(l.value));
            else if (l.type === 22) {
              var g = o.createElement("img");
              g.src = l.value, g.style.opacity = "1", a.appendChild(g);
            } else if (l.type === 18) {
              if (l.name === "attr") {
                var C = l.values.filter(S);
                C.length && a.appendChild(o.createTextNode(A.getAttribute(C[0].value) || ""));
              } else if (l.name === "counter") {
                var u = l.values.filter(oe), w = u[0], p = u[1];
                if (w && S(w)) {
                  var F = n.counters.getCounterValue(w.value), Q = p && S(p) ? nr.parse(n.context, p.value) : 3;
                  a.appendChild(o.createTextNode(Ke(F, Q, !1)));
                }
              } else if (l.name === "counters") {
                var L = l.values.filter(oe), w = L[0], I = L[1], p = L[2];
                if (w && S(w)) {
                  var H = n.counters.getCounterValues(w.value), U = p && S(p) ? nr.parse(n.context, p.value) : 3, v = I && I.type === 0 ? I.value : "", y = H.map(function(Y) {
                    return Ke(Y, U, !1);
                  }).join(v);
                  a.appendChild(o.createTextNode(y));
                }
              }
            } else if (l.type === 20)
              switch (l.value) {
                case "open-quote":
                  a.appendChild(o.createTextNode(jr(i.quotes, n.quoteDepth++, !0)));
                  break;
                case "close-quote":
                  a.appendChild(o.createTextNode(jr(i.quotes, --n.quoteDepth, !1)));
                  break;
                default:
                  a.appendChild(o.createTextNode(l.value));
              }
          }), a.className = lr + " " + Qr;
          var c = B === Ie.BEFORE ? " " + lr : " " + Qr;
          return Bt(r) ? r.className.baseValue += c : r.className += c, a;
        }
      }
    }, e.destroy = function(A) {
      return A.parentNode ? (A.parentNode.removeChild(A), !0) : !1;
    }, e;
  }()
), Ie;
(function(e) {
  e[e.BEFORE = 0] = "BEFORE", e[e.AFTER = 1] = "AFTER";
})(Ie || (Ie = {}));
var xc = function(e, A) {
  var r = e.createElement("iframe");
  return r.className = "html2canvas-container", r.style.visibility = "hidden", r.style.position = "fixed", r.style.left = "-10000px", r.style.top = "0px", r.style.border = "0", r.width = A.width.toString(), r.height = A.height.toString(), r.scrolling = "no", r.setAttribute(Hn, "true"), e.body.appendChild(r), r;
}, Sc = function(e) {
  return new Promise(function(A) {
    if (e.complete) {
      A();
      return;
    }
    if (!e.src) {
      A();
      return;
    }
    e.onload = A, e.onerror = A;
  });
}, Mc = function(e) {
  return Promise.all([].slice.call(e.images, 0).map(Sc));
}, Tc = function(e) {
  return new Promise(function(A, r) {
    var t = e.contentWindow;
    if (!t)
      return r("No window assigned for iframe");
    var B = t.document;
    t.onload = e.onload = function() {
      t.onload = e.onload = null;
      var n = setInterval(function() {
        B.body.childNodes.length > 0 && B.readyState === "complete" && (clearInterval(n), A(e));
      }, 50);
    };
  });
}, Oc = [
  "all",
  "d",
  "content"
  // Safari shows pseudoelements if content is set
], kt = function(e, A) {
  for (var r = e.length - 1; r >= 0; r--) {
    var t = e.item(r);
    Oc.indexOf(t) === -1 && A.style.setProperty(t, e.getPropertyValue(t));
  }
  return A;
}, Gc = function(e) {
  var A = "";
  return e && (A += "<!DOCTYPE ", e.name && (A += e.name), e.internalSubset && (A += e.internalSubset), e.publicId && (A += '"' + e.publicId + '"'), e.systemId && (A += '"' + e.systemId + '"'), A += ">"), A;
}, Vc = function(e, A, r) {
  e && e.defaultView && (A !== e.defaultView.pageXOffset || r !== e.defaultView.pageYOffset) && e.defaultView.scrollTo(A, r);
}, Rc = function(e) {
  var A = e[0], r = e[1], t = e[2];
  A.scrollLeft = r, A.scrollTop = t;
}, kc = ":before", Pc = ":after", lr = "___html2canvas___pseudoelement_before", Qr = "___html2canvas___pseudoelement_after", HB = '{\n    content: "" !important;\n    display: none !important;\n}', Nc = function(e) {
  Xc(e, "." + lr + kc + HB + "\n         ." + Qr + Pc + HB);
}, Xc = function(e, A) {
  var r = e.ownerDocument;
  if (r) {
    var t = r.createElement("style");
    t.textContent = A, e.appendChild(t);
  }
}, En = (
  /** @class */
  function() {
    function e() {
    }
    return e.getOrigin = function(A) {
      var r = e._link;
      return r ? (r.href = A, r.href = r.href, r.protocol + r.hostname + r.port) : "about:blank";
    }, e.isSameOrigin = function(A) {
      return e.getOrigin(A) === e._origin;
    }, e.setContext = function(A) {
      e._link = A.document.createElement("a"), e._origin = e.getOrigin(A.location.href);
    }, e._origin = "about:blank", e;
  }()
), Jc = (
  /** @class */
  function() {
    function e(A, r) {
      this.context = A, this._options = r, this._cache = {};
    }
    return e.prototype.addImage = function(A) {
      var r = Promise.resolve();
      return this.has(A) || (Nt(A) || _c(A)) && (this._cache[A] = this.loadImage(A)).catch(function() {
      }), r;
    }, e.prototype.match = function(A) {
      return this._cache[A];
    }, e.prototype.loadImage = function(A) {
      return AA(this, void 0, void 0, function() {
        var r, t, B, n, s = this;
        return j(this, function(o) {
          switch (o.label) {
            case 0:
              return r = En.isSameOrigin(A), t = !Pt(A) && this._options.useCORS === !0 && W.SUPPORT_CORS_IMAGES && !r, B = !Pt(A) && !r && !Nt(A) && typeof this._options.proxy == "string" && W.SUPPORT_CORS_XHR && !t, !r && this._options.allowTaint === !1 && !Pt(A) && !Nt(A) && !B && !t ? [
                2
                /*return*/
              ] : (n = A, B ? [4, this.proxy(n)] : [3, 2]);
            case 1:
              n = o.sent(), o.label = 2;
            case 2:
              return this.context.logger.debug("Added image " + A.substring(0, 256)), [4, new Promise(function(i, a) {
                var c = new Image();
                c.onload = function() {
                  return i(c);
                }, c.onerror = a, (qc(n) || t) && (c.crossOrigin = "anonymous"), c.src = n, c.complete === !0 && setTimeout(function() {
                  return i(c);
                }, 500), s._options.imageTimeout > 0 && setTimeout(function() {
                  return a("Timed out (" + s._options.imageTimeout + "ms) loading image");
                }, s._options.imageTimeout);
              })];
            case 3:
              return [2, o.sent()];
          }
        });
      });
    }, e.prototype.has = function(A) {
      return typeof this._cache[A] < "u";
    }, e.prototype.keys = function() {
      return Promise.resolve(Object.keys(this._cache));
    }, e.prototype.proxy = function(A) {
      var r = this, t = this._options.proxy;
      if (!t)
        throw new Error("No proxy defined");
      var B = A.substring(0, 256);
      return new Promise(function(n, s) {
        var o = W.SUPPORT_RESPONSE_TYPE ? "blob" : "text", i = new XMLHttpRequest();
        i.onload = function() {
          if (i.status === 200)
            if (o === "text")
              n(i.response);
            else {
              var l = new FileReader();
              l.addEventListener("load", function() {
                return n(l.result);
              }, !1), l.addEventListener("error", function(g) {
                return s(g);
              }, !1), l.readAsDataURL(i.response);
            }
          else
            s("Failed to proxy resource " + B + " with status code " + i.status);
        }, i.onerror = s;
        var a = t.indexOf("?") > -1 ? "&" : "?";
        if (i.open("GET", "" + t + a + "url=" + encodeURIComponent(A) + "&responseType=" + o), o !== "text" && i instanceof XMLHttpRequest && (i.responseType = o), r._options.imageTimeout) {
          var c = r._options.imageTimeout;
          i.timeout = c, i.ontimeout = function() {
            return s("Timed out (" + c + "ms) proxying " + B);
          };
        }
        i.send();
      });
    }, e;
  }()
), Yc = /^data:image\/svg\+xml/i, Wc = /^data:image\/.*;base64,/i, Zc = /^data:image\/.*/i, _c = function(e) {
  return W.SUPPORT_SVG_DRAWING || !jc(e);
}, Pt = function(e) {
  return Zc.test(e);
}, qc = function(e) {
  return Wc.test(e);
}, Nt = function(e) {
  return e.substr(0, 4) === "blob";
}, jc = function(e) {
  return e.substr(-3).toLowerCase() === "svg" || Yc.test(e);
}, h = (
  /** @class */
  function() {
    function e(A, r) {
      this.type = 0, this.x = A, this.y = r;
    }
    return e.prototype.add = function(A, r) {
      return new e(this.x + A, this.y + r);
    }, e;
  }()
), $A = function(e, A, r) {
  return new h(e.x + (A.x - e.x) * r, e.y + (A.y - e.y) * r);
}, je = (
  /** @class */
  function() {
    function e(A, r, t, B) {
      this.type = 1, this.start = A, this.startControl = r, this.endControl = t, this.end = B;
    }
    return e.prototype.subdivide = function(A, r) {
      var t = $A(this.start, this.startControl, A), B = $A(this.startControl, this.endControl, A), n = $A(this.endControl, this.end, A), s = $A(t, B, A), o = $A(B, n, A), i = $A(s, o, A);
      return r ? new e(this.start, t, s, i) : new e(i, o, n, this.end);
    }, e.prototype.add = function(A, r) {
      return new e(this.start.add(A, r), this.startControl.add(A, r), this.endControl.add(A, r), this.end.add(A, r));
    }, e.prototype.reverse = function() {
      return new e(this.end, this.endControl, this.startControl, this.start);
    }, e;
  }()
), sA = function(e) {
  return e.type === 1;
}, zc = (
  /** @class */
  function() {
    function e(A) {
      var r = A.styles, t = A.bounds, B = Fe(r.borderTopLeftRadius, t.width, t.height), n = B[0], s = B[1], o = Fe(r.borderTopRightRadius, t.width, t.height), i = o[0], a = o[1], c = Fe(r.borderBottomRightRadius, t.width, t.height), l = c[0], g = c[1], C = Fe(r.borderBottomLeftRadius, t.width, t.height), u = C[0], w = C[1], p = [];
      p.push((n + i) / t.width), p.push((u + l) / t.width), p.push((s + w) / t.height), p.push((a + g) / t.height);
      var F = Math.max.apply(Math, p);
      F > 1 && (n /= F, s /= F, i /= F, a /= F, l /= F, g /= F, u /= F, w /= F);
      var Q = t.width - i, L = t.height - g, I = t.width - l, H = t.height - w, U = r.borderTopWidth, v = r.borderRightWidth, y = r.borderBottomWidth, E = r.borderLeftWidth, V = T(r.paddingTop, A.bounds.width), Y = T(r.paddingRight, A.bounds.width), z = T(r.paddingBottom, A.bounds.width), b = T(r.paddingLeft, A.bounds.width);
      this.topLeftBorderDoubleOuterBox = n > 0 || s > 0 ? O(t.left + E / 3, t.top + U / 3, n - E / 3, s - U / 3, D.TOP_LEFT) : new h(t.left + E / 3, t.top + U / 3), this.topRightBorderDoubleOuterBox = n > 0 || s > 0 ? O(t.left + Q, t.top + U / 3, i - v / 3, a - U / 3, D.TOP_RIGHT) : new h(t.left + t.width - v / 3, t.top + U / 3), this.bottomRightBorderDoubleOuterBox = l > 0 || g > 0 ? O(t.left + I, t.top + L, l - v / 3, g - y / 3, D.BOTTOM_RIGHT) : new h(t.left + t.width - v / 3, t.top + t.height - y / 3), this.bottomLeftBorderDoubleOuterBox = u > 0 || w > 0 ? O(t.left + E / 3, t.top + H, u - E / 3, w - y / 3, D.BOTTOM_LEFT) : new h(t.left + E / 3, t.top + t.height - y / 3), this.topLeftBorderDoubleInnerBox = n > 0 || s > 0 ? O(t.left + E * 2 / 3, t.top + U * 2 / 3, n - E * 2 / 3, s - U * 2 / 3, D.TOP_LEFT) : new h(t.left + E * 2 / 3, t.top + U * 2 / 3), this.topRightBorderDoubleInnerBox = n > 0 || s > 0 ? O(t.left + Q, t.top + U * 2 / 3, i - v * 2 / 3, a - U * 2 / 3, D.TOP_RIGHT) : new h(t.left + t.width - v * 2 / 3, t.top + U * 2 / 3), this.bottomRightBorderDoubleInnerBox = l > 0 || g > 0 ? O(t.left + I, t.top + L, l - v * 2 / 3, g - y * 2 / 3, D.BOTTOM_RIGHT) : new h(t.left + t.width - v * 2 / 3, t.top + t.height - y * 2 / 3), this.bottomLeftBorderDoubleInnerBox = u > 0 || w > 0 ? O(t.left + E * 2 / 3, t.top + H, u - E * 2 / 3, w - y * 2 / 3, D.BOTTOM_LEFT) : new h(t.left + E * 2 / 3, t.top + t.height - y * 2 / 3), this.topLeftBorderStroke = n > 0 || s > 0 ? O(t.left + E / 2, t.top + U / 2, n - E / 2, s - U / 2, D.TOP_LEFT) : new h(t.left + E / 2, t.top + U / 2), this.topRightBorderStroke = n > 0 || s > 0 ? O(t.left + Q, t.top + U / 2, i - v / 2, a - U / 2, D.TOP_RIGHT) : new h(t.left + t.width - v / 2, t.top + U / 2), this.bottomRightBorderStroke = l > 0 || g > 0 ? O(t.left + I, t.top + L, l - v / 2, g - y / 2, D.BOTTOM_RIGHT) : new h(t.left + t.width - v / 2, t.top + t.height - y / 2), this.bottomLeftBorderStroke = u > 0 || w > 0 ? O(t.left + E / 2, t.top + H, u - E / 2, w - y / 2, D.BOTTOM_LEFT) : new h(t.left + E / 2, t.top + t.height - y / 2), this.topLeftBorderBox = n > 0 || s > 0 ? O(t.left, t.top, n, s, D.TOP_LEFT) : new h(t.left, t.top), this.topRightBorderBox = i > 0 || a > 0 ? O(t.left + Q, t.top, i, a, D.TOP_RIGHT) : new h(t.left + t.width, t.top), this.bottomRightBorderBox = l > 0 || g > 0 ? O(t.left + I, t.top + L, l, g, D.BOTTOM_RIGHT) : new h(t.left + t.width, t.top + t.height), this.bottomLeftBorderBox = u > 0 || w > 0 ? O(t.left, t.top + H, u, w, D.BOTTOM_LEFT) : new h(t.left, t.top + t.height), this.topLeftPaddingBox = n > 0 || s > 0 ? O(t.left + E, t.top + U, Math.max(0, n - E), Math.max(0, s - U), D.TOP_LEFT) : new h(t.left + E, t.top + U), this.topRightPaddingBox = i > 0 || a > 0 ? O(t.left + Math.min(Q, t.width - v), t.top + U, Q > t.width + v ? 0 : Math.max(0, i - v), Math.max(0, a - U), D.TOP_RIGHT) : new h(t.left + t.width - v, t.top + U), this.bottomRightPaddingBox = l > 0 || g > 0 ? O(t.left + Math.min(I, t.width - E), t.top + Math.min(L, t.height - y), Math.max(0, l - v), Math.max(0, g - y), D.BOTTOM_RIGHT) : new h(t.left + t.width - v, t.top + t.height - y), this.bottomLeftPaddingBox = u > 0 || w > 0 ? O(t.left + E, t.top + Math.min(H, t.height - y), Math.max(0, u - E), Math.max(0, w - y), D.BOTTOM_LEFT) : new h(t.left + E, t.top + t.height - y), this.topLeftContentBox = n > 0 || s > 0 ? O(t.left + E + b, t.top + U + V, Math.max(0, n - (E + b)), Math.max(0, s - (U + V)), D.TOP_LEFT) : new h(t.left + E + b, t.top + U + V), this.topRightContentBox = i > 0 || a > 0 ? O(t.left + Math.min(Q, t.width + E + b), t.top + U + V, Q > t.width + E + b ? 0 : i - E + b, a - (U + V), D.TOP_RIGHT) : new h(t.left + t.width - (v + Y), t.top + U + V), this.bottomRightContentBox = l > 0 || g > 0 ? O(t.left + Math.min(I, t.width - (E + b)), t.top + Math.min(L, t.height + U + V), Math.max(0, l - (v + Y)), g - (y + z), D.BOTTOM_RIGHT) : new h(t.left + t.width - (v + Y), t.top + t.height - (y + z)), this.bottomLeftContentBox = u > 0 || w > 0 ? O(t.left + E + b, t.top + H, Math.max(0, u - (E + b)), w - (y + z), D.BOTTOM_LEFT) : new h(t.left + E + b, t.top + t.height - (y + z));
    }
    return e;
  }()
), D;
(function(e) {
  e[e.TOP_LEFT = 0] = "TOP_LEFT", e[e.TOP_RIGHT = 1] = "TOP_RIGHT", e[e.BOTTOM_RIGHT = 2] = "BOTTOM_RIGHT", e[e.BOTTOM_LEFT = 3] = "BOTTOM_LEFT";
})(D || (D = {}));
var O = function(e, A, r, t, B) {
  var n = 4 * ((Math.sqrt(2) - 1) / 3), s = r * n, o = t * n, i = e + r, a = A + t;
  switch (B) {
    case D.TOP_LEFT:
      return new je(new h(e, a), new h(e, a - o), new h(i - s, A), new h(i, A));
    case D.TOP_RIGHT:
      return new je(new h(e, A), new h(e + s, A), new h(i, a - o), new h(i, a));
    case D.BOTTOM_RIGHT:
      return new je(new h(i, A), new h(i, A + o), new h(e + s, a), new h(e, a));
    case D.BOTTOM_LEFT:
    default:
      return new je(new h(i, a), new h(i - s, a), new h(e, A + o), new h(e, A));
  }
}, Qt = function(e) {
  return [e.topLeftBorderBox, e.topRightBorderBox, e.bottomRightBorderBox, e.bottomLeftBorderBox];
}, $c = function(e) {
  return [
    e.topLeftContentBox,
    e.topRightContentBox,
    e.bottomRightContentBox,
    e.bottomLeftContentBox
  ];
}, gt = function(e) {
  return [
    e.topLeftPaddingBox,
    e.topRightPaddingBox,
    e.bottomRightPaddingBox,
    e.bottomLeftPaddingBox
  ];
}, Al = (
  /** @class */
  function() {
    function e(A, r, t) {
      this.offsetX = A, this.offsetY = r, this.matrix = t, this.type = 0, this.target = 6;
    }
    return e;
  }()
), ze = (
  /** @class */
  function() {
    function e(A, r) {
      this.path = A, this.target = r, this.type = 1;
    }
    return e;
  }()
), el = (
  /** @class */
  function() {
    function e(A) {
      this.opacity = A, this.type = 2, this.target = 6;
    }
    return e;
  }()
), tl = function(e) {
  return e.type === 0;
}, In = function(e) {
  return e.type === 1;
}, rl = function(e) {
  return e.type === 2;
}, EB = function(e, A) {
  return e.length === A.length ? e.some(function(r, t) {
    return r === A[t];
  }) : !1;
}, Bl = function(e, A, r, t, B) {
  return e.map(function(n, s) {
    switch (s) {
      case 0:
        return n.add(A, r);
      case 1:
        return n.add(A + t, r);
      case 2:
        return n.add(A + t, r + B);
      case 3:
        return n.add(A, r + B);
    }
    return n;
  });
}, yn = (
  /** @class */
  function() {
    function e(A) {
      this.element = A, this.inlineLevel = [], this.nonInlineLevel = [], this.negativeZIndex = [], this.zeroOrAutoZIndexOrTransformedOrOpacity = [], this.positiveZIndex = [], this.nonPositionedFloats = [], this.nonPositionedInlineLevel = [];
    }
    return e;
  }()
), mn = (
  /** @class */
  function() {
    function e(A, r) {
      if (this.container = A, this.parent = r, this.effects = [], this.curves = new zc(this.container), this.container.styles.opacity < 1 && this.effects.push(new el(this.container.styles.opacity)), this.container.styles.transform !== null) {
        var t = this.container.bounds.left + this.container.styles.transformOrigin[0].number, B = this.container.bounds.top + this.container.styles.transformOrigin[1].number, n = this.container.styles.transform;
        this.effects.push(new Al(t, B, n));
      }
      if (this.container.styles.overflowX !== 0) {
        var s = Qt(this.curves), o = gt(this.curves);
        EB(s, o) ? this.effects.push(new ze(
          s,
          6
          /* CONTENT */
        )) : (this.effects.push(new ze(
          s,
          2
          /* BACKGROUND_BORDERS */
        )), this.effects.push(new ze(
          o,
          4
          /* CONTENT */
        )));
      }
    }
    return e.prototype.getEffects = function(A) {
      for (var r = [
        2,
        3
        /* FIXED */
      ].indexOf(this.container.styles.position) === -1, t = this.parent, B = this.effects.slice(0); t; ) {
        var n = t.effects.filter(function(i) {
          return !In(i);
        });
        if (r || t.container.styles.position !== 0 || !t.parent) {
          if (B.unshift.apply(B, n), r = [
            2,
            3
            /* FIXED */
          ].indexOf(t.container.styles.position) === -1, t.container.styles.overflowX !== 0) {
            var s = Qt(t.curves), o = gt(t.curves);
            EB(s, o) || B.unshift(new ze(
              o,
              6
              /* CONTENT */
            ));
          }
        } else
          B.unshift.apply(B, n);
        t = t.parent;
      }
      return B.filter(function(i) {
        return X(i.target, A);
      });
    }, e;
  }()
), gr = function(e, A, r, t) {
  e.container.elements.forEach(function(B) {
    var n = X(
      B.flags,
      4
      /* CREATES_REAL_STACKING_CONTEXT */
    ), s = X(
      B.flags,
      2
      /* CREATES_STACKING_CONTEXT */
    ), o = new mn(B, e);
    X(
      B.styles.display,
      2048
      /* LIST_ITEM */
    ) && t.push(o);
    var i = X(
      B.flags,
      8
      /* IS_LIST_OWNER */
    ) ? [] : t;
    if (n || s) {
      var a = n || B.styles.isPositioned() ? r : A, c = new yn(o);
      if (B.styles.isPositioned() || B.styles.opacity < 1 || B.styles.isTransformed()) {
        var l = B.styles.zIndex.order;
        if (l < 0) {
          var g = 0;
          a.negativeZIndex.some(function(u, w) {
            return l > u.element.container.styles.zIndex.order ? (g = w, !1) : g > 0;
          }), a.negativeZIndex.splice(g, 0, c);
        } else if (l > 0) {
          var C = 0;
          a.positiveZIndex.some(function(u, w) {
            return l >= u.element.container.styles.zIndex.order ? (C = w + 1, !1) : C > 0;
          }), a.positiveZIndex.splice(C, 0, c);
        } else
          a.zeroOrAutoZIndexOrTransformedOrOpacity.push(c);
      } else
        B.styles.isFloating() ? a.nonPositionedFloats.push(c) : a.nonPositionedInlineLevel.push(c);
      gr(o, c, n ? c : r, i);
    } else
      B.styles.isInlineLevel() ? A.inlineLevel.push(o) : A.nonInlineLevel.push(o), gr(o, A, r, i);
    X(
      B.flags,
      8
      /* IS_LIST_OWNER */
    ) && Kn(B, i);
  });
}, Kn = function(e, A) {
  for (var r = e instanceof ir ? e.start : 1, t = e instanceof ir ? e.reversed : !1, B = 0; B < A.length; B++) {
    var n = A[B];
    n.container instanceof ln && typeof n.container.value == "number" && n.container.value !== 0 && (r = n.container.value), n.listValue = Ke(r, n.container.styles.listStyleType, !0), r += t ? -1 : 1;
  }
}, nl = function(e) {
  var A = new mn(e, null), r = new yn(A), t = [];
  return gr(A, r, r, t), Kn(A.container, t), r;
}, IB = function(e, A) {
  switch (A) {
    case 0:
      return iA(e.topLeftBorderBox, e.topLeftPaddingBox, e.topRightBorderBox, e.topRightPaddingBox);
    case 1:
      return iA(e.topRightBorderBox, e.topRightPaddingBox, e.bottomRightBorderBox, e.bottomRightPaddingBox);
    case 2:
      return iA(e.bottomRightBorderBox, e.bottomRightPaddingBox, e.bottomLeftBorderBox, e.bottomLeftPaddingBox);
    case 3:
    default:
      return iA(e.bottomLeftBorderBox, e.bottomLeftPaddingBox, e.topLeftBorderBox, e.topLeftPaddingBox);
  }
}, sl = function(e, A) {
  switch (A) {
    case 0:
      return iA(e.topLeftBorderBox, e.topLeftBorderDoubleOuterBox, e.topRightBorderBox, e.topRightBorderDoubleOuterBox);
    case 1:
      return iA(e.topRightBorderBox, e.topRightBorderDoubleOuterBox, e.bottomRightBorderBox, e.bottomRightBorderDoubleOuterBox);
    case 2:
      return iA(e.bottomRightBorderBox, e.bottomRightBorderDoubleOuterBox, e.bottomLeftBorderBox, e.bottomLeftBorderDoubleOuterBox);
    case 3:
    default:
      return iA(e.bottomLeftBorderBox, e.bottomLeftBorderDoubleOuterBox, e.topLeftBorderBox, e.topLeftBorderDoubleOuterBox);
  }
}, ol = function(e, A) {
  switch (A) {
    case 0:
      return iA(e.topLeftBorderDoubleInnerBox, e.topLeftPaddingBox, e.topRightBorderDoubleInnerBox, e.topRightPaddingBox);
    case 1:
      return iA(e.topRightBorderDoubleInnerBox, e.topRightPaddingBox, e.bottomRightBorderDoubleInnerBox, e.bottomRightPaddingBox);
    case 2:
      return iA(e.bottomRightBorderDoubleInnerBox, e.bottomRightPaddingBox, e.bottomLeftBorderDoubleInnerBox, e.bottomLeftPaddingBox);
    case 3:
    default:
      return iA(e.bottomLeftBorderDoubleInnerBox, e.bottomLeftPaddingBox, e.topLeftBorderDoubleInnerBox, e.topLeftPaddingBox);
  }
}, il = function(e, A) {
  switch (A) {
    case 0:
      return $e(e.topLeftBorderStroke, e.topRightBorderStroke);
    case 1:
      return $e(e.topRightBorderStroke, e.bottomRightBorderStroke);
    case 2:
      return $e(e.bottomRightBorderStroke, e.bottomLeftBorderStroke);
    case 3:
    default:
      return $e(e.bottomLeftBorderStroke, e.topLeftBorderStroke);
  }
}, $e = function(e, A) {
  var r = [];
  return sA(e) ? r.push(e.subdivide(0.5, !1)) : r.push(e), sA(A) ? r.push(A.subdivide(0.5, !0)) : r.push(A), r;
}, iA = function(e, A, r, t) {
  var B = [];
  return sA(e) ? B.push(e.subdivide(0.5, !1)) : B.push(e), sA(r) ? B.push(r.subdivide(0.5, !0)) : B.push(r), sA(t) ? B.push(t.subdivide(0.5, !0).reverse()) : B.push(t), sA(A) ? B.push(A.subdivide(0.5, !1).reverse()) : B.push(A), B;
}, vn = function(e) {
  var A = e.bounds, r = e.styles;
  return A.add(r.borderLeftWidth, r.borderTopWidth, -(r.borderRightWidth + r.borderLeftWidth), -(r.borderTopWidth + r.borderBottomWidth));
}, wt = function(e) {
  var A = e.styles, r = e.bounds, t = T(A.paddingLeft, r.width), B = T(A.paddingRight, r.width), n = T(A.paddingTop, r.width), s = T(A.paddingBottom, r.width);
  return r.add(t + A.borderLeftWidth, n + A.borderTopWidth, -(A.borderRightWidth + A.borderLeftWidth + t + B), -(A.borderTopWidth + A.borderBottomWidth + n + s));
}, al = function(e, A) {
  return e === 0 ? A.bounds : e === 2 ? wt(A) : vn(A);
}, cl = function(e, A) {
  return e === 0 ? A.bounds : e === 2 ? wt(A) : vn(A);
}, Xt = function(e, A, r) {
  var t = al(te(e.styles.backgroundOrigin, A), e), B = cl(te(e.styles.backgroundClip, A), e), n = ll(te(e.styles.backgroundSize, A), r, t), s = n[0], o = n[1], i = Fe(te(e.styles.backgroundPosition, A), t.width - s, t.height - o), a = Ql(te(e.styles.backgroundRepeat, A), i, n, t, B), c = Math.round(t.left + i[0]), l = Math.round(t.top + i[1]);
  return [a, c, l, s, o];
}, Ae = function(e) {
  return S(e) && e.value === se.AUTO;
}, At = function(e) {
  return typeof e == "number";
}, ll = function(e, A, r) {
  var t = A[0], B = A[1], n = A[2], s = e[0], o = e[1];
  if (!s)
    return [0, 0];
  if (P(s) && o && P(o))
    return [T(s, r.width), T(o, r.height)];
  var i = At(n);
  if (S(s) && (s.value === se.CONTAIN || s.value === se.COVER)) {
    if (At(n)) {
      var a = r.width / r.height;
      return a < n != (s.value === se.COVER) ? [r.width, r.width / n] : [r.height * n, r.height];
    }
    return [r.width, r.height];
  }
  var c = At(t), l = At(B), g = c || l;
  if (Ae(s) && (!o || Ae(o))) {
    if (c && l)
      return [t, B];
    if (!i && !g)
      return [r.width, r.height];
    if (g && i) {
      var C = c ? t : B * n, u = l ? B : t / n;
      return [C, u];
    }
    var w = c ? t : r.width, p = l ? B : r.height;
    return [w, p];
  }
  if (i) {
    var F = 0, Q = 0;
    return P(s) ? F = T(s, r.width) : P(o) && (Q = T(o, r.height)), Ae(s) ? F = Q * n : (!o || Ae(o)) && (Q = F / n), [F, Q];
  }
  var L = null, I = null;
  if (P(s) ? L = T(s, r.width) : o && P(o) && (I = T(o, r.height)), L !== null && (!o || Ae(o)) && (I = c && l ? L / t * B : r.height), I !== null && Ae(s) && (L = c && l ? I / B * t : r.width), L !== null && I !== null)
    return [L, I];
  throw new Error("Unable to calculate background-size for element");
}, te = function(e, A) {
  var r = e[A];
  return typeof r > "u" ? e[0] : r;
}, Ql = function(e, A, r, t, B) {
  var n = A[0], s = A[1], o = r[0], i = r[1];
  switch (e) {
    case 2:
      return [
        new h(Math.round(t.left), Math.round(t.top + s)),
        new h(Math.round(t.left + t.width), Math.round(t.top + s)),
        new h(Math.round(t.left + t.width), Math.round(i + t.top + s)),
        new h(Math.round(t.left), Math.round(i + t.top + s))
      ];
    case 3:
      return [
        new h(Math.round(t.left + n), Math.round(t.top)),
        new h(Math.round(t.left + n + o), Math.round(t.top)),
        new h(Math.round(t.left + n + o), Math.round(t.height + t.top)),
        new h(Math.round(t.left + n), Math.round(t.height + t.top))
      ];
    case 1:
      return [
        new h(Math.round(t.left + n), Math.round(t.top + s)),
        new h(Math.round(t.left + n + o), Math.round(t.top + s)),
        new h(Math.round(t.left + n + o), Math.round(t.top + s + i)),
        new h(Math.round(t.left + n), Math.round(t.top + s + i))
      ];
    default:
      return [
        new h(Math.round(B.left), Math.round(B.top)),
        new h(Math.round(B.left + B.width), Math.round(B.top)),
        new h(Math.round(B.left + B.width), Math.round(B.height + B.top)),
        new h(Math.round(B.left), Math.round(B.height + B.top))
      ];
  }
}, gl = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", yB = "Hidden Text", wl = (
  /** @class */
  function() {
    function e(A) {
      this._data = {}, this._document = A;
    }
    return e.prototype.parseMetrics = function(A, r) {
      var t = this._document.createElement("div"), B = this._document.createElement("img"), n = this._document.createElement("span"), s = this._document.body;
      t.style.visibility = "hidden", t.style.fontFamily = A, t.style.fontSize = r, t.style.margin = "0", t.style.padding = "0", t.style.whiteSpace = "nowrap", s.appendChild(t), B.src = gl, B.width = 1, B.height = 1, B.style.margin = "0", B.style.padding = "0", B.style.verticalAlign = "baseline", n.style.fontFamily = A, n.style.fontSize = r, n.style.margin = "0", n.style.padding = "0", n.appendChild(this._document.createTextNode(yB)), t.appendChild(n), t.appendChild(B);
      var o = B.offsetTop - n.offsetTop + 2;
      t.removeChild(n), t.appendChild(this._document.createTextNode(yB)), t.style.lineHeight = "normal", B.style.verticalAlign = "super";
      var i = B.offsetTop - t.offsetTop + 2;
      return s.removeChild(t), { baseline: o, middle: i };
    }, e.prototype.getMetrics = function(A, r) {
      var t = A + " " + r;
      return typeof this._data[t] > "u" && (this._data[t] = this.parseMetrics(A, r)), this._data[t];
    }, e;
  }()
), Ln = (
  /** @class */
  function() {
    function e(A, r) {
      this.context = A, this.options = r;
    }
    return e;
  }()
), ul = 1e4, Ul = (
  /** @class */
  function(e) {
    QA(A, e);
    function A(r, t) {
      var B = e.call(this, r, t) || this;
      return B._activeEffects = [], B.canvas = t.canvas ? t.canvas : document.createElement("canvas"), B.ctx = B.canvas.getContext("2d"), t.canvas || (B.canvas.width = Math.floor(t.width * t.scale), B.canvas.height = Math.floor(t.height * t.scale), B.canvas.style.width = t.width + "px", B.canvas.style.height = t.height + "px"), B.fontMetrics = new wl(document), B.ctx.scale(B.options.scale, B.options.scale), B.ctx.translate(-t.x, -t.y), B.ctx.textBaseline = "bottom", B._activeEffects = [], B.context.logger.debug("Canvas renderer initialized (" + t.width + "x" + t.height + ") with scale " + t.scale), B;
    }
    return A.prototype.applyEffects = function(r) {
      for (var t = this; this._activeEffects.length; )
        this.popEffect();
      r.forEach(function(B) {
        return t.applyEffect(B);
      });
    }, A.prototype.applyEffect = function(r) {
      this.ctx.save(), rl(r) && (this.ctx.globalAlpha = r.opacity), tl(r) && (this.ctx.translate(r.offsetX, r.offsetY), this.ctx.transform(r.matrix[0], r.matrix[1], r.matrix[2], r.matrix[3], r.matrix[4], r.matrix[5]), this.ctx.translate(-r.offsetX, -r.offsetY)), In(r) && (this.path(r.path), this.ctx.clip()), this._activeEffects.push(r);
    }, A.prototype.popEffect = function() {
      this._activeEffects.pop(), this.ctx.restore();
    }, A.prototype.renderStack = function(r) {
      return AA(this, void 0, void 0, function() {
        var t;
        return j(this, function(B) {
          switch (B.label) {
            case 0:
              return t = r.element.container.styles, t.isVisible() ? [4, this.renderStackContent(r)] : [3, 2];
            case 1:
              B.sent(), B.label = 2;
            case 2:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, A.prototype.renderNode = function(r) {
      return AA(this, void 0, void 0, function() {
        return j(this, function(t) {
          switch (t.label) {
            case 0:
              if (X(
                r.container.flags,
                16
                /* DEBUG_RENDER */
              ))
                debugger;
              return r.container.styles.isVisible() ? [4, this.renderNodeBackgroundAndBorders(r)] : [3, 3];
            case 1:
              return t.sent(), [4, this.renderNodeContent(r)];
            case 2:
              t.sent(), t.label = 3;
            case 3:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, A.prototype.renderTextWithLetterSpacing = function(r, t, B) {
      var n = this;
      if (t === 0)
        this.ctx.fillText(r.text, r.bounds.left, r.bounds.top + B);
      else {
        var s = Fr(r.text);
        s.reduce(function(o, i) {
          return n.ctx.fillText(i, o, r.bounds.top + B), o + n.ctx.measureText(i).width;
        }, r.bounds.left);
      }
    }, A.prototype.createFontStyle = function(r) {
      var t = r.fontVariant.filter(function(s) {
        return s === "normal" || s === "small-caps";
      }).join(""), B = fl(r.fontFamily).join(", "), n = Le(r.fontSize) ? "" + r.fontSize.number + r.fontSize.unit : r.fontSize.number + "px";
      return [
        [r.fontStyle, t, r.fontWeight, n, B].join(" "),
        B,
        n
      ];
    }, A.prototype.renderTextNode = function(r, t) {
      return AA(this, void 0, void 0, function() {
        var B, n, s, o, i, a, c, l, g = this;
        return j(this, function(C) {
          return B = this.createFontStyle(t), n = B[0], s = B[1], o = B[2], this.ctx.font = n, this.ctx.direction = t.direction === 1 ? "rtl" : "ltr", this.ctx.textAlign = "left", this.ctx.textBaseline = "alphabetic", i = this.fontMetrics.getMetrics(s, o), a = i.baseline, c = i.middle, l = t.paintOrder, r.textBounds.forEach(function(u) {
            l.forEach(function(w) {
              switch (w) {
                case 0:
                  g.ctx.fillStyle = J(t.color), g.renderTextWithLetterSpacing(u, t.letterSpacing, a);
                  var p = t.textShadow;
                  p.length && u.text.trim().length && (p.slice(0).reverse().forEach(function(F) {
                    g.ctx.shadowColor = J(F.color), g.ctx.shadowOffsetX = F.offsetX.number * g.options.scale, g.ctx.shadowOffsetY = F.offsetY.number * g.options.scale, g.ctx.shadowBlur = F.blur.number, g.renderTextWithLetterSpacing(u, t.letterSpacing, a);
                  }), g.ctx.shadowColor = "", g.ctx.shadowOffsetX = 0, g.ctx.shadowOffsetY = 0, g.ctx.shadowBlur = 0), t.textDecorationLine.length && (g.ctx.fillStyle = J(t.textDecorationColor || t.color), t.textDecorationLine.forEach(function(F) {
                    switch (F) {
                      case 1:
                        g.ctx.fillRect(u.bounds.left, Math.round(u.bounds.top + a), u.bounds.width, 1);
                        break;
                      case 2:
                        g.ctx.fillRect(u.bounds.left, Math.round(u.bounds.top), u.bounds.width, 1);
                        break;
                      case 3:
                        g.ctx.fillRect(u.bounds.left, Math.ceil(u.bounds.top + c), u.bounds.width, 1);
                        break;
                    }
                  }));
                  break;
                case 1:
                  t.webkitTextStrokeWidth && u.text.trim().length && (g.ctx.strokeStyle = J(t.webkitTextStrokeColor), g.ctx.lineWidth = t.webkitTextStrokeWidth, g.ctx.lineJoin = window.chrome ? "miter" : "round", g.ctx.strokeText(u.text, u.bounds.left, u.bounds.top + a)), g.ctx.strokeStyle = "", g.ctx.lineWidth = 0, g.ctx.lineJoin = "miter";
                  break;
              }
            });
          }), [
            2
            /*return*/
          ];
        });
      });
    }, A.prototype.renderReplacedElement = function(r, t, B) {
      if (B && r.intrinsicWidth > 0 && r.intrinsicHeight > 0) {
        var n = wt(r), s = gt(t);
        this.path(s), this.ctx.save(), this.ctx.clip(), this.ctx.drawImage(B, 0, 0, r.intrinsicWidth, r.intrinsicHeight, n.left, n.top, n.width, n.height), this.ctx.restore();
      }
    }, A.prototype.renderNodeContent = function(r) {
      return AA(this, void 0, void 0, function() {
        var t, B, n, s, o, i, Q, Q, a, c, l, g, I, C, u, H, w, p, F, Q, L, I, H;
        return j(this, function(U) {
          switch (U.label) {
            case 0:
              this.applyEffects(r.getEffects(
                4
                /* CONTENT */
              )), t = r.container, B = r.curves, n = t.styles, s = 0, o = t.textNodes, U.label = 1;
            case 1:
              return s < o.length ? (i = o[s], [4, this.renderTextNode(i, n)]) : [3, 4];
            case 2:
              U.sent(), U.label = 3;
            case 3:
              return s++, [3, 1];
            case 4:
              if (!(t instanceof on))
                return [3, 8];
              U.label = 5;
            case 5:
              return U.trys.push([5, 7, , 8]), [4, this.context.cache.match(t.src)];
            case 6:
              return Q = U.sent(), this.renderReplacedElement(t, B, Q), [3, 8];
            case 7:
              return U.sent(), this.context.logger.error("Error loading image " + t.src), [3, 8];
            case 8:
              if (t instanceof an && this.renderReplacedElement(t, B, t.canvas), !(t instanceof cn))
                return [3, 12];
              U.label = 9;
            case 9:
              return U.trys.push([9, 11, , 12]), [4, this.context.cache.match(t.svg)];
            case 10:
              return Q = U.sent(), this.renderReplacedElement(t, B, Q), [3, 12];
            case 11:
              return U.sent(), this.context.logger.error("Error loading svg " + t.svg.substring(0, 255)), [3, 12];
            case 12:
              return t instanceof wn && t.tree ? (a = new A(this.context, {
                scale: this.options.scale,
                backgroundColor: t.backgroundColor,
                x: 0,
                y: 0,
                width: t.width,
                height: t.height
              }), [4, a.render(t.tree)]) : [3, 14];
            case 13:
              c = U.sent(), t.width && t.height && this.ctx.drawImage(c, 0, 0, t.width, t.height, t.bounds.left, t.bounds.top, t.bounds.width, t.bounds.height), U.label = 14;
            case 14:
              if (t instanceof hr && (l = Math.min(t.bounds.width, t.bounds.height), t.type === it ? t.checked && (this.ctx.save(), this.path([
                new h(t.bounds.left + l * 0.39363, t.bounds.top + l * 0.79),
                new h(t.bounds.left + l * 0.16, t.bounds.top + l * 0.5549),
                new h(t.bounds.left + l * 0.27347, t.bounds.top + l * 0.44071),
                new h(t.bounds.left + l * 0.39694, t.bounds.top + l * 0.5649),
                new h(t.bounds.left + l * 0.72983, t.bounds.top + l * 0.23),
                new h(t.bounds.left + l * 0.84, t.bounds.top + l * 0.34085),
                new h(t.bounds.left + l * 0.39363, t.bounds.top + l * 0.79)
              ]), this.ctx.fillStyle = J(gB), this.ctx.fill(), this.ctx.restore()) : t.type === at && t.checked && (this.ctx.save(), this.ctx.beginPath(), this.ctx.arc(t.bounds.left + l / 2, t.bounds.top + l / 2, l / 4, 0, Math.PI * 2, !0), this.ctx.fillStyle = J(gB), this.ctx.fill(), this.ctx.restore())), Cl(t) && t.value.length) {
                switch (g = this.createFontStyle(n), I = g[0], C = g[1], u = this.fontMetrics.getMetrics(I, C).baseline, this.ctx.font = I, this.ctx.fillStyle = J(n.color), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = hl(t.styles.textAlign), H = wt(t), w = 0, t.styles.textAlign) {
                  case 1:
                    w += H.width / 2;
                    break;
                  case 2:
                    w += H.width;
                    break;
                }
                p = H.add(w, 0, 0, -H.height / 2 + 1), this.ctx.save(), this.path([
                  new h(H.left, H.top),
                  new h(H.left + H.width, H.top),
                  new h(H.left + H.width, H.top + H.height),
                  new h(H.left, H.top + H.height)
                ]), this.ctx.clip(), this.renderTextWithLetterSpacing(new Ee(t.value, p), n.letterSpacing, u), this.ctx.restore(), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = "left";
              }
              if (!X(
                t.styles.display,
                2048
                /* LIST_ITEM */
              ))
                return [3, 20];
              if (t.styles.listStyleImage === null)
                return [3, 19];
              if (F = t.styles.listStyleImage, F.type !== 0)
                return [3, 18];
              Q = void 0, L = F.url, U.label = 15;
            case 15:
              return U.trys.push([15, 17, , 18]), [4, this.context.cache.match(L)];
            case 16:
              return Q = U.sent(), this.ctx.drawImage(Q, t.bounds.left - (Q.width + 10), t.bounds.top), [3, 18];
            case 17:
              return U.sent(), this.context.logger.error("Error loading list-style-image " + L), [3, 18];
            case 18:
              return [3, 20];
            case 19:
              r.listValue && t.styles.listStyleType !== -1 && (I = this.createFontStyle(n)[0], this.ctx.font = I, this.ctx.fillStyle = J(n.color), this.ctx.textBaseline = "middle", this.ctx.textAlign = "right", H = new mA(t.bounds.left, t.bounds.top + T(t.styles.paddingTop, t.bounds.width), t.bounds.width, _r(n.lineHeight, n.fontSize.number) / 2 + 1), this.renderTextWithLetterSpacing(new Ee(r.listValue, H), n.letterSpacing, _r(n.lineHeight, n.fontSize.number) / 2 + 2), this.ctx.textBaseline = "bottom", this.ctx.textAlign = "left"), U.label = 20;
            case 20:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, A.prototype.renderStackContent = function(r) {
      return AA(this, void 0, void 0, function() {
        var t, B, F, n, s, F, o, i, F, a, c, F, l, g, F, C, u, F, w, p, F;
        return j(this, function(Q) {
          switch (Q.label) {
            case 0:
              if (X(
                r.element.container.flags,
                16
                /* DEBUG_RENDER */
              ))
                debugger;
              return [4, this.renderNodeBackgroundAndBorders(r.element)];
            case 1:
              Q.sent(), t = 0, B = r.negativeZIndex, Q.label = 2;
            case 2:
              return t < B.length ? (F = B[t], [4, this.renderStack(F)]) : [3, 5];
            case 3:
              Q.sent(), Q.label = 4;
            case 4:
              return t++, [3, 2];
            case 5:
              return [4, this.renderNodeContent(r.element)];
            case 6:
              Q.sent(), n = 0, s = r.nonInlineLevel, Q.label = 7;
            case 7:
              return n < s.length ? (F = s[n], [4, this.renderNode(F)]) : [3, 10];
            case 8:
              Q.sent(), Q.label = 9;
            case 9:
              return n++, [3, 7];
            case 10:
              o = 0, i = r.nonPositionedFloats, Q.label = 11;
            case 11:
              return o < i.length ? (F = i[o], [4, this.renderStack(F)]) : [3, 14];
            case 12:
              Q.sent(), Q.label = 13;
            case 13:
              return o++, [3, 11];
            case 14:
              a = 0, c = r.nonPositionedInlineLevel, Q.label = 15;
            case 15:
              return a < c.length ? (F = c[a], [4, this.renderStack(F)]) : [3, 18];
            case 16:
              Q.sent(), Q.label = 17;
            case 17:
              return a++, [3, 15];
            case 18:
              l = 0, g = r.inlineLevel, Q.label = 19;
            case 19:
              return l < g.length ? (F = g[l], [4, this.renderNode(F)]) : [3, 22];
            case 20:
              Q.sent(), Q.label = 21;
            case 21:
              return l++, [3, 19];
            case 22:
              C = 0, u = r.zeroOrAutoZIndexOrTransformedOrOpacity, Q.label = 23;
            case 23:
              return C < u.length ? (F = u[C], [4, this.renderStack(F)]) : [3, 26];
            case 24:
              Q.sent(), Q.label = 25;
            case 25:
              return C++, [3, 23];
            case 26:
              w = 0, p = r.positiveZIndex, Q.label = 27;
            case 27:
              return w < p.length ? (F = p[w], [4, this.renderStack(F)]) : [3, 30];
            case 28:
              Q.sent(), Q.label = 29;
            case 29:
              return w++, [3, 27];
            case 30:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, A.prototype.mask = function(r) {
      this.ctx.beginPath(), this.ctx.moveTo(0, 0), this.ctx.lineTo(this.canvas.width, 0), this.ctx.lineTo(this.canvas.width, this.canvas.height), this.ctx.lineTo(0, this.canvas.height), this.ctx.lineTo(0, 0), this.formatPath(r.slice(0).reverse()), this.ctx.closePath();
    }, A.prototype.path = function(r) {
      this.ctx.beginPath(), this.formatPath(r), this.ctx.closePath();
    }, A.prototype.formatPath = function(r) {
      var t = this;
      r.forEach(function(B, n) {
        var s = sA(B) ? B.start : B;
        n === 0 ? t.ctx.moveTo(s.x, s.y) : t.ctx.lineTo(s.x, s.y), sA(B) && t.ctx.bezierCurveTo(B.startControl.x, B.startControl.y, B.endControl.x, B.endControl.y, B.end.x, B.end.y);
      });
    }, A.prototype.renderRepeat = function(r, t, B, n) {
      this.path(r), this.ctx.fillStyle = t, this.ctx.translate(B, n), this.ctx.fill(), this.ctx.translate(-B, -n);
    }, A.prototype.resizeImage = function(r, t, B) {
      var n;
      if (r.width === t && r.height === B)
        return r;
      var s = (n = this.canvas.ownerDocument) !== null && n !== void 0 ? n : document, o = s.createElement("canvas");
      o.width = Math.max(1, t), o.height = Math.max(1, B);
      var i = o.getContext("2d");
      return i.drawImage(r, 0, 0, r.width, r.height, 0, 0, t, B), o;
    }, A.prototype.renderBackgroundImage = function(r) {
      return AA(this, void 0, void 0, function() {
        var t, B, n, s, o, i;
        return j(this, function(a) {
          switch (a.label) {
            case 0:
              t = r.styles.backgroundImage.length - 1, B = function(c) {
                var l, g, C, V, _, q, b, N, y, u, V, _, q, b, N, w, p, F, Q, L, I, H, U, v, y, E, V, Y, z, b, N, gA, _, q, dA, BA, aA, wA, uA, cA, fA, nA;
                return j(this, function(KA) {
                  switch (KA.label) {
                    case 0:
                      if (c.type !== 0)
                        return [3, 5];
                      l = void 0, g = c.url, KA.label = 1;
                    case 1:
                      return KA.trys.push([1, 3, , 4]), [4, n.context.cache.match(g)];
                    case 2:
                      return l = KA.sent(), [3, 4];
                    case 3:
                      return KA.sent(), n.context.logger.error("Error loading background-image " + g), [3, 4];
                    case 4:
                      return l && (C = Xt(r, t, [
                        l.width,
                        l.height,
                        l.width / l.height
                      ]), V = C[0], _ = C[1], q = C[2], b = C[3], N = C[4], y = n.ctx.createPattern(n.resizeImage(l, b, N), "repeat"), n.renderRepeat(V, y, _, q)), [3, 6];
                    case 5:
                      ti(c) ? (u = Xt(r, t, [null, null, null]), V = u[0], _ = u[1], q = u[2], b = u[3], N = u[4], w = jo(c.angle, b, N), p = w[0], F = w[1], Q = w[2], L = w[3], I = w[4], H = document.createElement("canvas"), H.width = b, H.height = N, U = H.getContext("2d"), v = U.createLinearGradient(F, L, Q, I), Wr(c.stops, p).forEach(function(VA) {
                        return v.addColorStop(VA.stop, J(VA.color));
                      }), U.fillStyle = v, U.fillRect(0, 0, b, N), b > 0 && N > 0 && (y = n.ctx.createPattern(H, "repeat"), n.renderRepeat(V, y, _, q))) : ri(c) && (E = Xt(r, t, [
                        null,
                        null,
                        null
                      ]), V = E[0], Y = E[1], z = E[2], b = E[3], N = E[4], gA = c.position.length === 0 ? [ur] : c.position, _ = T(gA[0], b), q = T(gA[gA.length - 1], N), dA = zo(c, _, q, b, N), BA = dA[0], aA = dA[1], BA > 0 && aA > 0 && (wA = n.ctx.createRadialGradient(Y + _, z + q, 0, Y + _, z + q, BA), Wr(c.stops, BA * 2).forEach(function(VA) {
                        return wA.addColorStop(VA.stop, J(VA.color));
                      }), n.path(V), n.ctx.fillStyle = wA, BA !== aA ? (uA = r.bounds.left + 0.5 * r.bounds.width, cA = r.bounds.top + 0.5 * r.bounds.height, fA = aA / BA, nA = 1 / fA, n.ctx.save(), n.ctx.translate(uA, cA), n.ctx.transform(1, 0, 0, fA, 0, 0), n.ctx.translate(-uA, -cA), n.ctx.fillRect(Y, nA * (z - cA) + cA, b, N * nA), n.ctx.restore()) : n.ctx.fill())), KA.label = 6;
                    case 6:
                      return t--, [
                        2
                        /*return*/
                      ];
                  }
                });
              }, n = this, s = 0, o = r.styles.backgroundImage.slice(0).reverse(), a.label = 1;
            case 1:
              return s < o.length ? (i = o[s], [5, B(i)]) : [3, 4];
            case 2:
              a.sent(), a.label = 3;
            case 3:
              return s++, [3, 1];
            case 4:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, A.prototype.renderSolidBorder = function(r, t, B) {
      return AA(this, void 0, void 0, function() {
        return j(this, function(n) {
          return this.path(IB(B, t)), this.ctx.fillStyle = J(r), this.ctx.fill(), [
            2
            /*return*/
          ];
        });
      });
    }, A.prototype.renderDoubleBorder = function(r, t, B, n) {
      return AA(this, void 0, void 0, function() {
        var s, o;
        return j(this, function(i) {
          switch (i.label) {
            case 0:
              return t < 3 ? [4, this.renderSolidBorder(r, B, n)] : [3, 2];
            case 1:
              return i.sent(), [
                2
                /*return*/
              ];
            case 2:
              return s = sl(n, B), this.path(s), this.ctx.fillStyle = J(r), this.ctx.fill(), o = ol(n, B), this.path(o), this.ctx.fill(), [
                2
                /*return*/
              ];
          }
        });
      });
    }, A.prototype.renderNodeBackgroundAndBorders = function(r) {
      return AA(this, void 0, void 0, function() {
        var t, B, n, s, o, i, a, c, l = this;
        return j(this, function(g) {
          switch (g.label) {
            case 0:
              return this.applyEffects(r.getEffects(
                2
                /* BACKGROUND_BORDERS */
              )), t = r.container.styles, B = !OA(t.backgroundColor) || t.backgroundImage.length, n = [
                { style: t.borderTopStyle, color: t.borderTopColor, width: t.borderTopWidth },
                { style: t.borderRightStyle, color: t.borderRightColor, width: t.borderRightWidth },
                { style: t.borderBottomStyle, color: t.borderBottomColor, width: t.borderBottomWidth },
                { style: t.borderLeftStyle, color: t.borderLeftColor, width: t.borderLeftWidth }
              ], s = Fl(te(t.backgroundClip, 0), r.curves), B || t.boxShadow.length ? (this.ctx.save(), this.path(s), this.ctx.clip(), OA(t.backgroundColor) || (this.ctx.fillStyle = J(t.backgroundColor), this.ctx.fill()), [4, this.renderBackgroundImage(r.container)]) : [3, 2];
            case 1:
              g.sent(), this.ctx.restore(), t.boxShadow.slice(0).reverse().forEach(function(C) {
                l.ctx.save();
                var u = Qt(r.curves), w = C.inset ? 0 : ul, p = Bl(u, -w + (C.inset ? 1 : -1) * C.spread.number, (C.inset ? 1 : -1) * C.spread.number, C.spread.number * (C.inset ? -2 : 2), C.spread.number * (C.inset ? -2 : 2));
                C.inset ? (l.path(u), l.ctx.clip(), l.mask(p)) : (l.mask(u), l.ctx.clip(), l.path(p)), l.ctx.shadowOffsetX = C.offsetX.number + w, l.ctx.shadowOffsetY = C.offsetY.number, l.ctx.shadowColor = J(C.color), l.ctx.shadowBlur = C.blur.number, l.ctx.fillStyle = C.inset ? J(C.color) : "rgba(0,0,0,1)", l.ctx.fill(), l.ctx.restore();
              }), g.label = 2;
            case 2:
              o = 0, i = 0, a = n, g.label = 3;
            case 3:
              return i < a.length ? (c = a[i], c.style !== 0 && !OA(c.color) && c.width > 0 ? c.style !== 2 ? [3, 5] : [4, this.renderDashedDottedBorder(
                c.color,
                c.width,
                o,
                r.curves,
                2
                /* DASHED */
              )] : [3, 11]) : [3, 13];
            case 4:
              return g.sent(), [3, 11];
            case 5:
              return c.style !== 3 ? [3, 7] : [4, this.renderDashedDottedBorder(
                c.color,
                c.width,
                o,
                r.curves,
                3
                /* DOTTED */
              )];
            case 6:
              return g.sent(), [3, 11];
            case 7:
              return c.style !== 4 ? [3, 9] : [4, this.renderDoubleBorder(c.color, c.width, o, r.curves)];
            case 8:
              return g.sent(), [3, 11];
            case 9:
              return [4, this.renderSolidBorder(c.color, o, r.curves)];
            case 10:
              g.sent(), g.label = 11;
            case 11:
              o++, g.label = 12;
            case 12:
              return i++, [3, 3];
            case 13:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, A.prototype.renderDashedDottedBorder = function(r, t, B, n, s) {
      return AA(this, void 0, void 0, function() {
        var o, i, a, c, l, g, C, u, w, p, F, Q, L, I, H, U, H, U;
        return j(this, function(v) {
          return this.ctx.save(), o = il(n, B), i = IB(n, B), s === 2 && (this.path(i), this.ctx.clip()), sA(i[0]) ? (a = i[0].start.x, c = i[0].start.y) : (a = i[0].x, c = i[0].y), sA(i[1]) ? (l = i[1].end.x, g = i[1].end.y) : (l = i[1].x, g = i[1].y), B === 0 || B === 2 ? C = Math.abs(a - l) : C = Math.abs(c - g), this.ctx.beginPath(), s === 3 ? this.formatPath(o) : this.formatPath(i.slice(0, 2)), u = t < 3 ? t * 3 : t * 2, w = t < 3 ? t * 2 : t, s === 3 && (u = t, w = t), p = !0, C <= u * 2 ? p = !1 : C <= u * 2 + w ? (F = C / (2 * u + w), u *= F, w *= F) : (Q = Math.floor((C + w) / (u + w)), L = (C - Q * u) / (Q - 1), I = (C - (Q + 1) * u) / Q, w = I <= 0 || Math.abs(w - L) < Math.abs(w - I) ? L : I), p && (s === 3 ? this.ctx.setLineDash([0, u + w]) : this.ctx.setLineDash([u, w])), s === 3 ? (this.ctx.lineCap = "round", this.ctx.lineWidth = t) : this.ctx.lineWidth = t * 2 + 1.1, this.ctx.strokeStyle = J(r), this.ctx.stroke(), this.ctx.setLineDash([]), s === 2 && (sA(i[0]) && (H = i[3], U = i[0], this.ctx.beginPath(), this.formatPath([new h(H.end.x, H.end.y), new h(U.start.x, U.start.y)]), this.ctx.stroke()), sA(i[1]) && (H = i[1], U = i[2], this.ctx.beginPath(), this.formatPath([new h(H.end.x, H.end.y), new h(U.start.x, U.start.y)]), this.ctx.stroke())), this.ctx.restore(), [
            2
            /*return*/
          ];
        });
      });
    }, A.prototype.render = function(r) {
      return AA(this, void 0, void 0, function() {
        var t;
        return j(this, function(B) {
          switch (B.label) {
            case 0:
              return this.options.backgroundColor && (this.ctx.fillStyle = J(this.options.backgroundColor), this.ctx.fillRect(this.options.x, this.options.y, this.options.width, this.options.height)), t = nl(r), [4, this.renderStack(t)];
            case 1:
              return B.sent(), this.applyEffects([]), [2, this.canvas];
          }
        });
      });
    }, A;
  }(Ln)
), Cl = function(e) {
  return e instanceof gn || e instanceof Qn ? !0 : e instanceof hr && e.type !== at && e.type !== it;
}, Fl = function(e, A) {
  switch (e) {
    case 0:
      return Qt(A);
    case 2:
      return $c(A);
    case 1:
    default:
      return gt(A);
  }
}, hl = function(e) {
  switch (e) {
    case 1:
      return "center";
    case 2:
      return "right";
    case 0:
    default:
      return "left";
  }
}, dl = ["-apple-system", "system-ui"], fl = function(e) {
  return /iPhone OS 15_(0|1)/.test(window.navigator.userAgent) ? e.filter(function(A) {
    return dl.indexOf(A) === -1;
  }) : e;
}, pl = (
  /** @class */
  function(e) {
    QA(A, e);
    function A(r, t) {
      var B = e.call(this, r, t) || this;
      return B.canvas = t.canvas ? t.canvas : document.createElement("canvas"), B.ctx = B.canvas.getContext("2d"), B.options = t, B.canvas.width = Math.floor(t.width * t.scale), B.canvas.height = Math.floor(t.height * t.scale), B.canvas.style.width = t.width + "px", B.canvas.style.height = t.height + "px", B.ctx.scale(B.options.scale, B.options.scale), B.ctx.translate(-t.x, -t.y), B.context.logger.debug("EXPERIMENTAL ForeignObject renderer initialized (" + t.width + "x" + t.height + " at " + t.x + "," + t.y + ") with scale " + t.scale), B;
    }
    return A.prototype.render = function(r) {
      return AA(this, void 0, void 0, function() {
        var t, B;
        return j(this, function(n) {
          switch (n.label) {
            case 0:
              return t = or(this.options.width * this.options.scale, this.options.height * this.options.scale, this.options.scale, this.options.scale, r), [4, Hl(t)];
            case 1:
              return B = n.sent(), this.options.backgroundColor && (this.ctx.fillStyle = J(this.options.backgroundColor), this.ctx.fillRect(0, 0, this.options.width * this.options.scale, this.options.height * this.options.scale)), this.ctx.drawImage(B, -this.options.x * this.options.scale, -this.options.y * this.options.scale), [2, this.canvas];
          }
        });
      });
    }, A;
  }(Ln)
), Hl = function(e) {
  return new Promise(function(A, r) {
    var t = new Image();
    t.onload = function() {
      A(t);
    }, t.onerror = r, t.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(e));
  });
}, El = (
  /** @class */
  function() {
    function e(A) {
      var r = A.id, t = A.enabled;
      this.id = r, this.enabled = t, this.start = Date.now();
    }
    return e.prototype.debug = function() {
      for (var A = [], r = 0; r < arguments.length; r++)
        A[r] = arguments[r];
      this.enabled && (typeof window < "u" && window.console && typeof console.debug == "function" ? console.debug.apply(console, De([this.id, this.getTime() + "ms"], A)) : this.info.apply(this, A));
    }, e.prototype.getTime = function() {
      return Date.now() - this.start;
    }, e.prototype.info = function() {
      for (var A = [], r = 0; r < arguments.length; r++)
        A[r] = arguments[r];
      this.enabled && typeof window < "u" && window.console && typeof console.info == "function" && console.info.apply(console, De([this.id, this.getTime() + "ms"], A));
    }, e.prototype.warn = function() {
      for (var A = [], r = 0; r < arguments.length; r++)
        A[r] = arguments[r];
      this.enabled && (typeof window < "u" && window.console && typeof console.warn == "function" ? console.warn.apply(console, De([this.id, this.getTime() + "ms"], A)) : this.info.apply(this, A));
    }, e.prototype.error = function() {
      for (var A = [], r = 0; r < arguments.length; r++)
        A[r] = arguments[r];
      this.enabled && (typeof window < "u" && window.console && typeof console.error == "function" ? console.error.apply(console, De([this.id, this.getTime() + "ms"], A)) : this.info.apply(this, A));
    }, e.instances = {}, e;
  }()
), Il = (
  /** @class */
  function() {
    function e(A, r) {
      var t;
      this.windowBounds = r, this.instanceName = "#" + e.instanceCount++, this.logger = new El({ id: this.instanceName, enabled: A.logging }), this.cache = (t = A.cache) !== null && t !== void 0 ? t : new Jc(this, A);
    }
    return e.instanceCount = 1, e;
  }()
), yl = function(e, A) {
  return A === void 0 && (A = {}), ml(e, A);
};
typeof window < "u" && En.setContext(window);
var ml = function(e, A) {
  return AA(void 0, void 0, void 0, function() {
    var r, t, B, n, s, o, i, a, c, l, g, C, u, w, p, F, Q, L, I, H, v, U, v, y, E, V, Y, z, b, N, gA, _, q, dA, BA, aA, wA, uA, cA, fA;
    return j(this, function(nA) {
      switch (nA.label) {
        case 0:
          if (!e || typeof e != "object")
            return [2, Promise.reject("Invalid element provided as first argument")];
          if (r = e.ownerDocument, !r)
            throw new Error("Element is not attached to a Document");
          if (t = r.defaultView, !t)
            throw new Error("Document is not attached to a Window");
          return B = {
            allowTaint: (y = A.allowTaint) !== null && y !== void 0 ? y : !1,
            imageTimeout: (E = A.imageTimeout) !== null && E !== void 0 ? E : 15e3,
            proxy: A.proxy,
            useCORS: (V = A.useCORS) !== null && V !== void 0 ? V : !1
          }, n = Yt({ logging: (Y = A.logging) !== null && Y !== void 0 ? Y : !0, cache: A.cache }, B), s = {
            windowWidth: (z = A.windowWidth) !== null && z !== void 0 ? z : t.innerWidth,
            windowHeight: (b = A.windowHeight) !== null && b !== void 0 ? b : t.innerHeight,
            scrollX: (N = A.scrollX) !== null && N !== void 0 ? N : t.pageXOffset,
            scrollY: (gA = A.scrollY) !== null && gA !== void 0 ? gA : t.pageYOffset
          }, o = new mA(s.scrollX, s.scrollY, s.windowWidth, s.windowHeight), i = new Il(n, o), a = (_ = A.foreignObjectRendering) !== null && _ !== void 0 ? _ : !1, c = {
            allowTaint: (q = A.allowTaint) !== null && q !== void 0 ? q : !1,
            onclone: A.onclone,
            ignoreElements: A.ignoreElements,
            inlineImages: a,
            copyStyles: a
          }, i.logger.debug("Starting document clone with size " + o.width + "x" + o.height + " scrolled to " + -o.left + "," + -o.top), l = new pB(i, e, c), g = l.clonedReferenceElement, g ? [4, l.toIFrame(r, o)] : [2, Promise.reject("Unable to find element in cloned iframe")];
        case 1:
          return C = nA.sent(), u = dr(g) || Kc(g) ? rs(g.ownerDocument) : ut(i, g), w = u.width, p = u.height, F = u.left, Q = u.top, L = Kl(i, g, A.backgroundColor), I = {
            canvas: A.canvas,
            backgroundColor: L,
            scale: (BA = (dA = A.scale) !== null && dA !== void 0 ? dA : t.devicePixelRatio) !== null && BA !== void 0 ? BA : 1,
            x: ((aA = A.x) !== null && aA !== void 0 ? aA : 0) + F,
            y: ((wA = A.y) !== null && wA !== void 0 ? wA : 0) + Q,
            width: (uA = A.width) !== null && uA !== void 0 ? uA : Math.ceil(w),
            height: (cA = A.height) !== null && cA !== void 0 ? cA : Math.ceil(p)
          }, a ? (i.logger.debug("Document cloned, using foreign object rendering"), v = new pl(i, I), [4, v.render(g)]) : [3, 3];
        case 2:
          return H = nA.sent(), [3, 5];
        case 3:
          return i.logger.debug("Document cloned, element located at " + F + "," + Q + " with size " + w + "x" + p + " using computed rendering"), i.logger.debug("Starting DOM parsing"), U = Un(i, g), L === U.styles.backgroundColor && (U.styles.backgroundColor = yA.TRANSPARENT), i.logger.debug("Starting renderer for element at " + I.x + "," + I.y + " with size " + I.width + "x" + I.height), v = new Ul(i, I), [4, v.render(U)];
        case 4:
          H = nA.sent(), nA.label = 5;
        case 5:
          return (!((fA = A.removeContainer) !== null && fA !== void 0) || fA) && (pB.destroy(C) || i.logger.error("Cannot detach cloned iframe as it is not in the DOM anymore")), i.logger.debug("Finished rendering"), [2, H];
      }
    });
  });
}, Kl = function(e, A, r) {
  var t = A.ownerDocument, B = t.documentElement ? pe(e, getComputedStyle(t.documentElement).backgroundColor) : yA.TRANSPARENT, n = t.body ? pe(e, getComputedStyle(t.body).backgroundColor) : yA.TRANSPARENT, s = typeof r == "string" ? pe(e, r) : r === null ? yA.TRANSPARENT : 4294967295;
  return A === t.documentElement ? OA(B) ? OA(n) ? s : n : B : s;
};
class vl extends Xn {
  constructor() {
    super(...arguments), bA(this, "isDrag", !1), bA(this, "multiple", !1), bA(this, "accept", "images/*"), bA(this, "uploadParams"), bA(this, "exportParams"), bA(this, "cutShape", "DEFAULT");
  }
  async onInit() {
    if (await super.onInit(), this.editorParams) {
      const { isDrag: A, accept: r, uploadParams: t, exportParams: B, cutShape: n } = this.editorParams;
      if (n && (this.cutShape = n), A && (this.isDrag = !!A), r && (this.accept = r), t)
        try {
          this.uploadParams = JSON.parse(t);
        } catch (s) {
          throw new Ir(
            t,
            "配置uploadParams没有按标准JSON格式"
          );
        }
      if (B)
        try {
          this.exportParams = JSON.parse(B);
        } catch (s) {
          throw new Ir(
            B,
            "配置exportParams没有按标准JSON格式"
          );
        }
    }
  }
  /**
   * 创建指定区域的截图并转为URL
   *
   * @param {HTMLElement} croparea
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   * @return {*}
   * @memberof AvatarUploadController
   */
  async createCropImageUrl(A, r, t, B) {
    let n, s, o, i;
    this.cutShape === "DEFAULT" ? (n = r - B, s = t - B, o = B * 2, i = B * 2) : (n = r - B, s = 0, o = B * 2, i = 300);
    const a = await yl(A, {
      x: n,
      // 指定截取区域的左上角 x 坐标
      y: s,
      // 指定截取区域的左上角 y 坐标
      width: o,
      // 指定截取区域的宽度
      height: i
      // 指定截取区域的高度
    });
    if (a) {
      if (this.cutShape === "IDRECT")
        return a.toDataURL("image/png");
      const c = document.createElement("canvas"), l = c.getContext("2d");
      if (c.width = o, c.height = i, l)
        return l.beginPath(), l.arc(B, B, B, 0, Math.PI * 2), l.closePath(), l.clip(), l.drawImage(a, 0, 0), c.toDataURL("image/png");
    }
  }
  /**
   *将数据 URL 转换为 Blob 对象
   *
   * @param {string} dataURL
   * @return {*}
   * @memberof AvatarUploadController
   */
  dataURLtoBlob(A) {
    const r = atob(A.split(",")[1]), t = A.split(",")[0].split(":")[1].split(";")[0], B = new ArrayBuffer(r.length), n = new Uint8Array(B);
    for (let s = 0; s < r.length; s++)
      n[s] = r.charCodeAt(s);
    return new Blob([B], { type: t });
  }
}
class Ll {
  constructor() {
    bA(this, "formEditor", "AvatarUpload"), bA(this, "gridEditor", "AvatarUpload");
  }
  async createController(A, r) {
    const t = new vl(A, r);
    return await t.init(), t;
  }
}
const Tl = {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  install(e) {
    e.component(yr.name, yr), Nn(
      "EDITOR_CUSTOMSTYLE_AVATAR_UPLOAD",
      () => new Ll()
    );
  }
};
export {
  Tl as default
};
