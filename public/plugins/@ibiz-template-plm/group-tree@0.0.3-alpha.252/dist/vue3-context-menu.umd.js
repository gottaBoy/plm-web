import vt from "vue";
function ht(A, q) {
  for (var H = 0; H < q.length; H++) {
    const e = q[H];
    if (typeof e != "string" && !Array.isArray(e)) {
      for (const N in e)
        if (N !== "default" && !(N in A)) {
          const Y = Object.getOwnPropertyDescriptor(e, N);
          Y && Object.defineProperty(A, N, Y.get ? Y : {
            enumerable: !0,
            get: () => e[N]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(A, Symbol.toStringTag, { value: "Module" }));
}
var Ct = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function kt(A) {
  return A && A.__esModule && Object.prototype.hasOwnProperty.call(A, "default") ? A.default : A;
}
var se = { exports: {} };
(function(A, q) {
  (function(H, e) {
    e(q, vt);
  })(Ct, function(H, e) {
    let N = null;
    function Y() {
      return N !== null;
    }
    function We(t) {
      N && de(), N = t;
    }
    function ce(t) {
      t === N && (N = null);
    }
    function de() {
      N && (N.closeMenu(), N = null);
    }
    const L = { defaultDirection: "br", defaultMinWidth: 100, defaultMaxWidth: 600, defaultZindex: 100, defaultAdjustPadding: { x: 0, y: 10 } };
    function $(t, n) {
      let a = t.offsetTop;
      return t.offsetParent != null && t.offsetParent != n && (a -= t.offsetParent.scrollTop, a += $(t.offsetParent, n)), a;
    }
    function D(t, n) {
      let a = t.offsetLeft;
      return t.offsetParent != null && t.offsetParent != n && (a -= t.offsetParent.scrollLeft, a += D(t.offsetParent, n)), a;
    }
    function Ie(t, n, a, s) {
      return { x: D(t, s) + n, y: $(t, s) + a };
    }
    const oe = "mx-menu-default-container", Oe = "mx-menu-container-";
    let Ee = 0;
    function me(t) {
      const { getContainer: n, zIndex: a } = t;
      if (n) {
        const m = typeof n == "function" ? n() : n;
        if (m) {
          let p = m.getAttribute("id");
          return p || (p = Oe + Ee++, m.setAttribute("id", p)), { eleId: p, container: m, isNew: !1 };
        }
      }
      let s = document.getElementById(oe);
      return s || (s = document.createElement("div"), s.setAttribute("id", oe), s.setAttribute("class", "mx-menu-ghost-host fullscreen"), document.body.appendChild(s)), s.style.zIndex = (a == null ? void 0 : a.toString()) || L.defaultZindex.toString(), { eleId: oe, container: s, isNew: !0 };
    }
    function Ne(t) {
      return typeof t == "number" ? "".concat(t, "px") : t;
    }
    const T = e.defineComponent({ props: { vnode: { type: null }, data: { type: null, default: null } }, setup(t) {
      const { vnode: n, data: a } = e.toRefs(t);
      return () => typeof n.value == "function" ? n.value(a.value) : n.value;
    } }), U = (t, n) => {
      const a = t.__vccOpts || t;
      for (const [s, m] of n)
        a[s] = m;
      return a;
    }, je = {}, Re = { class: "mx-checked-mark", "aria-hidden": "true", viewBox: "0 0 1024 1024" }, Ve = [e.createElementVNode("path", { d: "M129.3,428.6L52,512l345,372.5l575-620.8l-69.5-75L400.4,718.2L129.3,428.6z" }, null, -1)];
    function He(t, n) {
      return e.openBlock(), e.createElementBlock("svg", Re, Ve);
    }
    const Fe = U(je, [["render", He]]), Ae = {}, Le = { class: "mx-right-arrow", "aria-hidden": "true", viewBox: "0 0 1024 1024" }, Te = [e.createElementVNode("path", { d: "M307.018 49.445c11.517 0 23.032 4.394 31.819 13.18L756.404 480.18c8.439 8.438 13.181 19.885 13.181 31.82s-4.741 23.38-13.181 31.82L338.838 961.376c-17.574 17.573-46.065 17.573-63.64-0.001-17.573-17.573-17.573-46.065 0.001-63.64L660.944 512 275.198 126.265c-17.574-17.573-17.574-46.066-0.001-63.64C283.985 53.839 295.501 49.445 307.018 49.445z" }, null, -1)];
    function _e(t, n) {
      return e.openBlock(), e.createElementBlock("svg", Le, Te);
    }
    const fe = U(Ae, [["render", _e]]), ze = { class: "mx-item-row" }, $e = ["xlink:href"], De = { key: 1, class: "label" }, Ke = { class: "mx-item-row" }, Ye = { class: "mx-shortcut" }, J = e.defineComponent({ __name: "ContextMenuItem", props: { disabled: { type: Boolean, default: !1 }, hidden: { type: Boolean, default: !1 }, customRender: { type: Function, default: null }, customClass: { type: String, default: "" }, clickHandler: { type: Function, default: null }, label: { type: [String, Object, Function], default: "" }, icon: { type: [String, Object, Function], default: "" }, iconFontClass: { type: String, default: "iconfont" }, checked: { type: Boolean, default: !1 }, shortcut: { type: String, default: "" }, svgIcon: { type: String, default: "" }, svgProps: { type: Object, default: null }, preserveIconWidth: { type: Boolean, default: !0 }, showRightArrow: { type: Boolean, default: !1 }, hasChildren: { type: Boolean, default: !1 }, clickClose: { type: Boolean, default: !0 }, clickableWhenHasChildren: { type: Boolean, default: !1 }, rawMenuItem: { type: Object, default: void 0 } }, emits: ["click", "subMenuOpen", "subMenuClose"], setup(t, { expose: n, emit: a }) {
      const s = t, m = a, { clickHandler: p, clickClose: r, clickableWhenHasChildren: B, disabled: k, hidden: c, label: P, icon: o, iconFontClass: w, showRightArrow: W, shortcut: S, hasChildren: v } = e.toRefs(s), h = e.ref(!1), d = e.ref(!1), i = e.ref(), f = e.inject("globalOptions"), x = e.inject("globalHasSlot"), l = e.inject("globalRenderSlot"), y = e.inject("globalCloseMenu"), M = e.inject("menuContext"), I = { showSubMenu: () => h.value ? (M.markActiveMenuItem(I, !0), !0) : v.value ? (F(), !0) : !1, isDisabledOrHidden: () => k.value || c.value, getElement: () => i.value, focus: () => d.value = !0, blur: () => d.value = !1, click: R };
      e.onMounted(() => {
        M.isMenuItemDataCollectedFlag() ? e.nextTick(() => {
          let C = 0;
          const V = M.getElement();
          if (V) {
            let _ = 0;
            for (let g = 0; g < V.children.length; g++) {
              const z = V.children[g];
              if (z.getAttribute("data-type") === "ContextMenuItem") {
                if (z === i.value) {
                  C = _;
                  break;
                }
                _++;
              }
            }
          }
          M.addChildMenuItem(I, C);
        }) : M.addChildMenuItem(I);
      }), e.onBeforeUnmount(() => {
        M.removeChildMenuItem(I);
      });
      function R(C) {
        if (!k.value) {
          if (C) {
            const V = C.target;
            if (V.classList.contains("mx-context-no-clickable") || f.value.ignoreClickClassName && V.classList.contains(f.value.ignoreClickClassName))
              return;
            if (f.value.clickCloseClassName && V.classList.contains(f.value.clickCloseClassName)) {
              C.stopPropagation(), y(s.rawMenuItem);
              return;
            }
          }
          v.value ? B.value ? (typeof p.value == "function" && p.value(C), m("click", C)) : h.value || F() : (typeof p.value == "function" && p.value(C), m("click", C), r.value && y(s.rawMenuItem));
        }
      }
      function F(C) {
        d.value = !1, M.checkCloseOtherSubMenuTimeOut() || M.closeOtherSubMenu(), k.value || (M.markActiveMenuItem(I), v.value && (C || M.markThisOpenedByKeyBoard(), M.addOpenedSubMenu(() => {
          d.value = !1, h.value = !1, m("subMenuClose");
        }), h.value = !0, m("subMenuOpen")));
      }
      function j() {
        return { disabled: k.value, label: P.value, icon: o.value, iconFontClass: w.value, showRightArrow: W.value, clickClose: r.value, clickableWhenHasChildren: B.value, shortcut: S.value, theme: f.value.theme, isOpen: h, hasChildren: v, onClick: R, onMouseEnter: F, closeMenu: y };
      }
      return n({ showSubMenu: h, keyBoardFocusMenu: d }), (C, V) => e.unref(c) ? e.createCommentVNode("", !0) : (e.openBlock(), e.createElementBlock("div", { key: 0, class: "mx-context-menu-item-wrapper", ref_key: "menuItemRef", ref: i, "data-type": "ContextMenuItem" }, [e.unref(x)("itemRender") ? (e.openBlock(), e.createBlock(e.unref(T), { key: 0, vnode: () => e.unref(l)("itemRender", j()) }, null, 8, ["vnode"])) : t.customRender ? (e.openBlock(), e.createBlock(e.unref(T), { key: 1, vnode: t.customRender, data: j() }, null, 8, ["vnode", "data"])) : (e.openBlock(), e.createElementBlock("div", { key: 2, class: e.normalizeClass(["mx-context-menu-item", e.unref(k) ? "disabled" : "", d.value ? "keyboard-focus" : "", t.customClass ? " " + t.customClass : "", h.value ? "open" : ""]), onClick: R, onMouseenter: F }, [e.renderSlot(C.$slots, "default", {}, () => [e.createElementVNode("div", ze, [e.createElementVNode("div", { class: e.normalizeClass(["mx-icon-placeholder", t.preserveIconWidth ? "preserve-width" : ""]) }, [e.renderSlot(C.$slots, "icon", {}, () => [e.unref(x)("itemIconRender") ? (e.openBlock(), e.createBlock(e.unref(T), { key: 0, vnode: () => e.unref(l)("itemIconRender", j()) }, null, 8, ["vnode"])) : typeof t.svgIcon == "string" && t.svgIcon ? (e.openBlock(), e.createElementBlock("svg", e.mergeProps({ key: 1, class: "icon svg" }, t.svgProps), [e.createElementVNode("use", { "xlink:href": t.svgIcon }, null, 8, $e)], 16)) : typeof e.unref(o) != "string" ? (e.openBlock(), e.createBlock(e.unref(T), { key: 2, vnode: e.unref(o), data: e.unref(o) }, null, 8, ["vnode", "data"])) : typeof e.unref(o) == "string" && e.unref(o) !== "" ? (e.openBlock(), e.createElementBlock("i", { key: 3, class: e.normalizeClass(e.unref(o) + " icon " + e.unref(w) + " " + e.unref(f).iconFontClass) }, null, 2)) : e.createCommentVNode("", !0)]), t.checked ? e.renderSlot(C.$slots, "check", { key: 0 }, () => [e.unref(x)("itemCheckRender") ? (e.openBlock(), e.createBlock(e.unref(T), { key: 0, vnode: () => e.unref(l)("itemCheckRender", j()) }, null, 8, ["vnode"])) : e.createCommentVNode("", !0), e.createVNode(Fe)]) : e.createCommentVNode("", !0)], 2), e.renderSlot(C.$slots, "label", {}, () => [e.unref(x)("itemLabelRender") ? (e.openBlock(), e.createBlock(e.unref(T), { key: 0, vnode: () => e.unref(l)("itemLabelRender", j()) }, null, 8, ["vnode"])) : typeof e.unref(P) == "string" ? (e.openBlock(), e.createElementBlock("span", De, e.toDisplayString(e.unref(P)), 1)) : (e.openBlock(), e.createBlock(e.unref(T), { key: 2, vnode: e.unref(P), data: e.unref(P) }, null, 8, ["vnode", "data"]))])]), e.createElementVNode("div", Ke, [e.unref(S) ? e.renderSlot(C.$slots, "shortcut", { key: 0 }, () => [e.unref(x)("itemShortcutRender") ? (e.openBlock(), e.createBlock(e.unref(T), { key: 0, vnode: () => e.unref(l)("itemShortcutRender", j()) }, null, 8, ["vnode"])) : e.createCommentVNode("", !0), e.createElementVNode("span", Ye, e.toDisplayString(e.unref(S)), 1)]) : e.createCommentVNode("", !0), e.unref(W) ? e.renderSlot(C.$slots, "rightArrow", { key: 1 }, () => [e.unref(x)("itemRightArrowRender") ? (e.openBlock(), e.createBlock(e.unref(T), { key: 0, vnode: () => e.unref(l)("itemRightArrowRender", j()) }, null, 8, ["vnode"])) : e.createCommentVNode("", !0), e.createVNode(fe)]) : e.createCommentVNode("", !0)])])], 34)), e.unref(f).menuTransitionProps ? (e.openBlock(), e.createBlock(e.Transition, e.normalizeProps(e.mergeProps({ key: 3 }, e.unref(f).menuTransitionProps)), { default: e.withCtx(() => [h.value ? e.renderSlot(C.$slots, "submenu", { key: 0 }) : e.createCommentVNode("", !0)]), _: 3 }, 16)) : h.value ? e.renderSlot(C.$slots, "submenu", { key: 4 }) : e.createCommentVNode("", !0)], 512));
    } }), Ue = e.defineComponent({ name: "ContextMenuSperator", components: { VNodeRender: T }, setup() {
      const t = e.inject("globalHasSlot"), n = e.inject("globalRenderSlot");
      return { globalHasSlot: t, globalRenderSlot: n };
    } }), Ge = { key: 1, class: "mx-context-menu-item-sperator mx-context-no-clickable" };
    function Xe(t, n, a, s, m, p) {
      const r = e.resolveComponent("VNodeRender");
      return t.globalHasSlot("separatorRender") ? (e.openBlock(), e.createBlock(r, { key: 0, vnode: () => t.globalRenderSlot("separatorRender", {}) }, null, 8, ["vnode"])) : (e.openBlock(), e.createElementBlock("div", Ge));
    }
    const Q = U(Ue, [["render", Xe]]), Ze = e.defineComponent({ name: "ContextSubMenu", components: { ContextMenuItem: J, ContextMenuSeparator: Q, ContextMenuIconRight: fe }, props: { items: { type: Object, default: null }, maxWidth: { type: [String, Number], default: 0 }, minWidth: { type: [String, Number], default: 0 }, adjustPosition: { type: Boolean, default: !0 }, direction: { type: String, default: "br" } }, setup(t) {
      const n = e.inject("menuContext"), a = e.inject("globalOptions"), s = e.inject("globalHasSlot"), m = e.inject("globalRenderSlot"), { zIndex: p, getParentWidth: r, getParentHeight: B } = n, { adjustPosition: k } = e.toRefs(t), c = e.ref(), P = e.ref(), o = e.ref(), w = [], W = e.inject("globalSetCurrentSubMenu"), S = [];
      let v = null, h = 0;
      function d() {
        v && v.blur();
      }
      function i(u, b) {
        if (u) {
          for (let O = b !== void 0 ? b : 0; O < S.length; O++)
            if (!S[O].isDisabledOrHidden()) {
              f(O);
              break;
            }
        } else
          for (let O = b !== void 0 ? b : S.length - 1; O >= 0; O--)
            if (!S[O].isDisabledOrHidden()) {
              f(O);
              break;
            }
      }
      function f(u) {
        if (v && d(), u !== void 0 && (v = S[Math.max(0, Math.min(u, S.length - 1))]), !!v && (v.focus(), _.value)) {
          const b = v.getElement();
          b && (R.value = Math.min(Math.max(-F.value, -b.offsetTop - b.offsetHeight + z.value), 0));
        }
      }
      function x() {
        W(l);
      }
      const l = { isTopLevel: () => n.getParentContext() === null, closeSelfAndActiveParent: () => {
        const u = I.getParentContext();
        if (u) {
          u.closeOtherSubMenu();
          const b = u.getSubMenuInstanceContext();
          if (b)
            return b.focusCurrentItem(), !0;
        }
        return !1;
      }, closeCurrentSubMenu: () => {
        var u;
        return (u = I.getParentContext()) == null ? void 0 : u.closeOtherSubMenu();
      }, moveCurrentItemFirst: () => i(!0), moveCurrentItemLast: () => i(!1), moveCurrentItemDown: () => i(!0, v ? S.indexOf(v) + 1 : 0), moveCurrentItemUp: () => i(!1, v ? S.indexOf(v) - 1 : 0), focusCurrentItem: () => f(), openCurrentItemSubMenu: () => v ? v == null ? void 0 : v.showSubMenu() : !1, triggerCurrentItemClick: (u) => v == null ? void 0 : v.click(u) };
      let y = !1, M = !1;
      const I = { zIndex: p + 1, container: n.container, adjustPadding: a.value.adjustPadding || L.defaultAdjustPadding, getParentWidth: () => {
        var u;
        return ((u = c.value) == null ? void 0 : u.offsetWidth) || 0;
      }, getParentHeight: () => {
        var u;
        return ((u = c.value) == null ? void 0 : u.offsetHeight) || 0;
      }, getParentX: () => g.value.x, getParentY: () => g.value.y, getParentAbsX: () => c.value ? D(c.value, n.container) : 0, getParentAbsY: () => c.value ? $(c.value, n.container) : 0, getPositon: () => [0, 0], addOpenedSubMenu(u) {
        w.push(u);
      }, closeOtherSubMenu() {
        w.forEach((u) => u()), w.splice(0, w.length), W(l);
      }, checkCloseOtherSubMenuTimeOut() {
        return h ? (clearTimeout(h), h = 0, !0) : !1;
      }, closeOtherSubMenuWithTimeOut() {
        h = setTimeout(() => {
          h = 0, this.closeOtherSubMenu();
        }, 200);
      }, addChildMenuItem: (u, b) => {
        b === void 0 ? S.push(u) : S.splice(b, 0, u);
      }, removeChildMenuItem: (u) => {
        S.splice(S.indexOf(u), 1);
      }, markActiveMenuItem: (u, b = !1) => {
        d(), v = u, b && f();
      }, markThisOpenedByKeyBoard: () => {
        y = !0;
      }, isOpenedByKeyBoardFlag: () => y ? (y = !1, !0) : !1, isMenuItemDataCollectedFlag: () => M, getElement: () => c.value || null, getParentContext: () => n, getSubMenuInstanceContext: () => l };
      e.provide("menuContext", I);
      const R = e.ref(0), F = e.ref(0);
      function j(u) {
        u ? R.value = Math.min(Math.max(R.value - 50, -F.value), 0) : R.value = Math.min(R.value + 50, 0);
      }
      function C(u) {
        u.preventDefault(), u.stopPropagation(), j(u.deltaY > 0);
      }
      function V(u) {
        a.value.mouseScroll && (u.preventDefault(), u.stopPropagation(), j(u.deltaY > 0));
      }
      const _ = e.ref(!1), g = e.ref({ x: 0, y: 0 }), z = e.ref(0);
      return e.onMounted(() => {
        var b, O, ke, xe;
        const u = n.getPositon();
        g.value = { x: (O = (b = u[0]) != null ? b : a.value.xOffset) != null ? O : 0, y: (xe = (ke = u[1]) != null ? ke : a.value.yOffset) != null ? xe : 0 }, W(l), e.nextTick(() => {
          var ye, Me, Se, Be;
          var ge, be;
          const E = c.value;
          if (E && P.value) {
            const { container: K } = n, re = (ye = r == null ? void 0 : r()) != null ? ye : 0, ct = (Me = B == null ? void 0 : B()) != null ? Me : 0, te = typeof n.adjustPadding == "number" ? n.adjustPadding : (Se = (ge = n.adjustPadding) == null ? void 0 : ge.x) != null ? Se : 0, ne = typeof n.adjustPadding == "number" ? n.adjustPadding : (Be = (be = n.adjustPadding) == null ? void 0 : be.y) != null ? Be : 0, G = ct > 0 ? ne : 0, dt = document.documentElement.scrollHeight, mt = document.documentElement.scrollWidth, ft = Math.min(mt, K.offsetWidth), ue = Math.min(dt, K.offsetHeight);
            let ae = D(E, K), ie = $(E, K);
            t.direction.includes("l") ? g.value.x -= E.offsetWidth + te : t.direction.includes("r") ? g.value.x += re + te : (g.value.x += re / 2, g.value.x -= (E.offsetWidth + te) / 2), t.direction.includes("t") ? g.value.y -= E.offsetHeight + ne * 2 : t.direction.includes("b") ? g.value.y -= ne : g.value.y -= (E.offsetHeight + ne) / 2, k.value && e.nextTick(() => {
              ae = D(E, K), ie = $(E, K);
              const pt = ae + E.offsetWidth - ft, we = ie + E.offsetHeight + G * 2 - ue;
              if (_.value = we > 0, F.value = E.offsetHeight - ue + G * 2, pt > 0) {
                const X = re + E.offsetWidth - te, Z = ae;
                X > Z ? g.value.x -= Z : g.value.x -= X;
              }
              if (_.value) {
                const X = we, Z = ie;
                X > Z ? g.value.y -= Z - G : g.value.y -= X - G, z.value = ue - G * 2;
              } else
                z.value = 0;
            });
          }
          E == null || E.focus({ preventScroll: !0 }), n.isOpenedByKeyBoardFlag() && i(!0), M = !0;
        });
      }), { menu: c, scroll: P, options: a, zIndex: p, constOptions: L, scrollValue: R, upScrollButton: o, overflow: _, position: g, scrollHeight: F, maxHeight: z, globalHasSlot: s, globalRenderSlot: m, onScroll: j, onSubMenuBodyClick: x, onMouseWhell: V, onMouseWhellMx: C, solveNumberOrStringSize: Ne };
    } }), qe = { key: 0, class: "mx-context-menu-updown placeholder" }, Je = { key: 1, class: "mx-context-menu-updown placeholder" }, Qe = { class: "mx-context-menu-scroll", ref: "scroll" };
    function et(t, n, a, s, m, p) {
      var P;
      const r = e.resolveComponent("ContextMenuSeparator"), B = e.resolveComponent("ContextSubMenu", !0), k = e.resolveComponent("ContextMenuItem"), c = e.resolveComponent("ContextMenuIconRight");
      return e.openBlock(), e.createElementBlock("div", { class: e.normalizeClass(["mx-context-menu", t.options.customClass ? t.options.customClass : "", (P = t.options.theme) != null ? P : ""]), style: e.normalizeStyle({ maxWidth: t.maxWidth ? t.solveNumberOrStringSize(t.maxWidth) : "".concat(t.constOptions.defaultMaxWidth, "px"), minWidth: t.minWidth ? t.solveNumberOrStringSize(t.minWidth) : "".concat(t.constOptions.defaultMinWidth, "px"), maxHeight: t.overflow && t.maxHeight > 0 ? "".concat(t.maxHeight, "px") : void 0, zIndex: t.zIndex, left: "".concat(t.position.x, "px"), top: "".concat(t.position.y, "px") }), "data-type": "ContextSubMenu", onClick: n[4] || (n[4] = (...o) => t.onSubMenuBodyClick && t.onSubMenuBodyClick(...o)), onWheel: n[5] || (n[5] = (...o) => t.onMouseWhell && t.onMouseWhell(...o)) }, [e.createElementVNode("div", { class: e.normalizeClass(["mx-context-menu-items"]), ref: "menu", style: e.normalizeStyle({ top: "".concat(t.scrollValue, "px") }) }, [e.renderSlot(t.$slots, "default", {}, () => [t.overflow && t.options.updownButtonSpaceholder ? (e.openBlock(), e.createElementBlock("div", qe)) : e.createCommentVNode("", !0), (e.openBlock(!0), e.createElementBlock(e.Fragment, null, e.renderList(t.items, (o, w) => (e.openBlock(), e.createElementBlock(e.Fragment, { key: w }, [o.hidden !== !0 && o.divided === "up" ? (e.openBlock(), e.createBlock(r, { key: 0 })) : e.createCommentVNode("", !0), o.hidden !== !0 && o.divided === "self" ? (e.openBlock(), e.createBlock(r, { key: 1 })) : (e.openBlock(), e.createBlock(k, { key: 2, clickHandler: o.onClick ? (W) => o.onClick(W) : void 0, disabled: o.disabled, hidden: o.hidden, icon: o.icon, iconFontClass: o.iconFontClass, svgIcon: o.svgIcon, svgProps: o.svgProps, label: o.label, customRender: o.customRender, customClass: o.customClass, checked: o.checked, shortcut: o.shortcut, clickClose: o.clickClose, clickableWhenHasChildren: o.clickableWhenHasChildren, preserveIconWidth: o.preserveIconWidth !== void 0 ? o.preserveIconWidth : t.options.preserveIconWidth, showRightArrow: o.children && o.children.length > 0, hasChildren: o.children && o.children.length > 0, rawMenuItem: o, onSubMenuOpen: o.onSubMenuOpen, onSubMenuClose: o.onSubMenuClose }, e.createSlots({ _: 2 }, [o.children && o.children.length > 0 ? { name: "submenu", fn: e.withCtx(() => [e.createVNode(B, { items: o.children, maxWidth: o.maxWidth, minWidth: o.minWidth, adjustPosition: o.adjustSubMenuPosition !== void 0 ? o.adjustSubMenuPosition : t.options.adjustPosition, direction: o.direction !== void 0 ? o.direction : t.options.direction }, null, 8, ["items", "maxWidth", "minWidth", "adjustPosition", "direction"])]), key: "0" } : void 0]), 1032, ["clickHandler", "disabled", "hidden", "icon", "iconFontClass", "svgIcon", "svgProps", "label", "customRender", "customClass", "checked", "shortcut", "clickClose", "clickableWhenHasChildren", "preserveIconWidth", "showRightArrow", "hasChildren", "rawMenuItem", "onSubMenuOpen", "onSubMenuClose"])), o.hidden !== !0 && (o.divided === "down" || o.divided === !0) ? (e.openBlock(), e.createBlock(r, { key: 3 })) : e.createCommentVNode("", !0)], 64))), 128)), t.overflow && t.options.updownButtonSpaceholder ? (e.openBlock(), e.createElementBlock("div", Je)) : e.createCommentVNode("", !0)])], 4), e.createElementVNode("div", Qe, [e.withDirectives(e.createElementVNode("div", { ref: "upScrollButton", class: e.normalizeClass("mx-context-menu-updown mx-context-no-clickable up" + (t.overflow && t.scrollValue < 0 ? "" : " disabled")), onClick: n[0] || (n[0] = (o) => t.onScroll(!1)), onWheel: n[1] || (n[1] = (...o) => t.onMouseWhellMx && t.onMouseWhellMx(...o)) }, [e.createVNode(c)], 34), [[e.vShow, t.overflow]]), e.withDirectives(e.createElementVNode("div", { class: e.normalizeClass("mx-context-menu-updown mx-context-no-clickable down" + (t.overflow && t.scrollValue > -t.scrollHeight ? "" : " disabled")), onClick: n[2] || (n[2] = (o) => t.onScroll(!0)), onWheel: n[3] || (n[3] = (...o) => t.onMouseWhellMx && t.onMouseWhellMx(...o)) }, [e.createVNode(c)], 34), [[e.vShow, t.overflow]])], 512)], 38);
    }
    const ee = U(Ze, [["render", et]]), tt = { class: "mx-menu-ghost-host" }, pe = e.defineComponent({ __name: "ContextSubMenuWrapper", props: { options: { type: Object, default: null }, show: { type: Object, default: null }, container: { type: Object, default: null }, isFullScreenContainer: { type: Boolean, default: !0 } }, emits: ["close", "closeAnimFinished"], setup(t, { expose: n, emit: a }) {
      const s = t, m = a, p = e.useSlots(), { options: r, show: B, container: k } = e.toRefs(s);
      e.onMounted(() => {
        B.value && o();
      }), e.onBeforeUnmount(() => {
        v();
      }), e.watch(B, (l) => {
        l ? o() : (ce(c), v());
      });
      const c = { closeMenu: w, isClosed: W };
      let P = !1;
      function o() {
        S(), We(c);
      }
      function w(l) {
        P = !0, m("close", l), r.value.menuTransitionProps || m("closeAnimFinished"), ce(c);
      }
      function W() {
        return P;
      }
      function S() {
        setTimeout(() => {
          document.addEventListener("click", f, !0), document.addEventListener("contextmenu", f, !0), document.addEventListener("scroll", i, !0), !s.isFullScreenContainer && k.value && k.value.addEventListener("scroll", i, !0), r.value.keyboardControl !== !1 && document.addEventListener("keydown", d);
        }, 50);
      }
      function v() {
        document.removeEventListener("contextmenu", f, !0), document.removeEventListener("click", f, !0), document.removeEventListener("scroll", i, !0), !s.isFullScreenContainer && k.value && k.value.removeEventListener("scroll", i, !0), r.value.keyboardControl !== !1 && document.removeEventListener("keydown", d);
      }
      const h = e.ref();
      e.provide("globalSetCurrentSubMenu", (l) => h.value = l);
      function d(l) {
        var y, M, I, R, F, j, C, V, _, g, z, u, b;
        let O = !0;
        switch (l.key) {
          case "Escape": {
            ((y = h.value) == null ? void 0 : y.isTopLevel()) === !1 ? (M = h.value) == null || M.closeCurrentSubMenu() : w();
            break;
          }
          case "ArrowDown":
            (I = h.value) == null || I.moveCurrentItemDown();
            break;
          case "ArrowUp":
            (R = h.value) == null || R.moveCurrentItemUp();
            break;
          case "Home":
            (F = h.value) == null || F.moveCurrentItemFirst();
            break;
          case "End":
            (j = h.value) == null || j.moveCurrentItemLast();
            break;
          case "ArrowLeft": {
            (C = h.value) != null && C.closeSelfAndActiveParent() || (_ = (V = r.value).onKeyFocusMoveLeft) == null || _.call(V);
            break;
          }
          case "ArrowRight":
            (g = h.value) != null && g.openCurrentItemSubMenu() || (u = (z = r.value).onKeyFocusMoveRight) == null || u.call(z);
            break;
          case "Enter":
            (b = h.value) == null || b.triggerCurrentItemClick(l);
            break;
          default:
            O = !1;
            break;
        }
        O && h.value && (l.stopPropagation(), l.preventDefault());
      }
      function i() {
        r.value.closeWhenScroll !== !1 && w();
      }
      function f(l) {
        x(l.target, l);
      }
      function x(l, y) {
        for (var M, I; l; ) {
          if (l.classList && l.classList.contains("mx-menu-host"))
            return;
          l = l.parentNode;
        }
        r.value.clickCloseOnOutside !== !1 ? (v(), w()) : (I = (M = r.value).onClickOnOutside) == null || I.call(M, y);
      }
      return e.provide("globalOptions", r), e.provide("globalCloseMenu", w), e.provide("globalIsFullScreenContainer", s.isFullScreenContainer), e.provide("globalHasSlot", (l) => p[l] !== void 0), e.provide("globalRenderSlot", (l, y) => e.renderSlot(p, l, { ...y }, () => [e.h("span", "Render slot failed")], !1)), e.provide("menuContext", { zIndex: r.value.zIndex || L.defaultZindex, container: k.value, adjustPadding: { x: 0, y: 0 }, getParentAbsY: () => r.value.x, getParentAbsX: () => r.value.y, getParentX: () => 0, getParentY: () => 0, getParentWidth: () => 0, getParentHeight: () => 0, getPositon: () => [r.value.x, r.value.y], closeOtherSubMenuWithTimeOut: () => {
      }, checkCloseOtherSubMenuTimeOut: () => !1, addOpenedSubMenu: () => {
      }, closeOtherSubMenu: () => {
      }, getParentContext: () => null, getSubMenuInstanceContext: () => null, getElement: () => null, addChildMenuItem: () => {
      }, removeChildMenuItem: () => {
      }, markActiveMenuItem: () => {
      }, markThisOpenedByKeyBoard: () => {
      }, isOpenedByKeyBoardFlag: () => !1, isMenuItemDataCollectedFlag: () => !1 }), n(c), (l, y) => (e.openBlock(), e.createElementBlock("div", tt, [e.unref(r).menuTransitionProps ? (e.openBlock(), e.createBlock(e.Transition, e.mergeProps({ key: 0, appear: "" }, e.unref(r).menuTransitionProps, { onAfterLeave: y[0] || (y[0] = (M) => m("closeAnimFinished")) }), { default: e.withCtx(() => [e.unref(B) ? (e.openBlock(), e.createBlock(ee, { key: 0, class: "mx-menu-host", items: e.unref(r).items, adjustPosition: e.unref(r).adjustPosition, maxWidth: e.unref(r).maxWidth || e.unref(L).defaultMaxWidth, minWidth: e.unref(r).minWidth || e.unref(L).defaultMinWidth, direction: e.unref(r).direction || e.unref(L).defaultDirection }, { default: e.withCtx(() => [e.renderSlot(l.$slots, "default")]), _: 3 }, 8, ["items", "adjustPosition", "maxWidth", "minWidth", "direction"])) : e.createCommentVNode("", !0)]), _: 3 }, 16)) : e.unref(B) ? (e.openBlock(), e.createBlock(ee, { key: 1, class: "mx-menu-host", items: e.unref(r).items, adjustPosition: e.unref(r).adjustPosition, maxWidth: e.unref(r).maxWidth || e.unref(L).defaultMaxWidth, minWidth: e.unref(r).minWidth || e.unref(L).defaultMinWidth, direction: e.unref(r).direction || e.unref(L).defaultDirection }, { default: e.withCtx(() => [e.renderSlot(l.$slots, "default")]), _: 3 }, 8, ["items", "adjustPosition", "maxWidth", "minWidth", "direction"])) : e.createCommentVNode("", !0)]));
    } }), ve = e.defineComponent({ name: "ContextMenu", emits: ["update:show", "close"], props: { options: { type: Object, default: null }, show: { type: Boolean, default: !1 } }, setup(t, n) {
      const { options: a, show: s } = e.toRefs(t);
      return n.expose({ closeMenu: () => n.emit("update:show", !1), isClosed: () => !s.value }), () => {
        const { isNew: m, container: p, eleId: r } = me(a.value);
        return [e.h(e.Teleport, { to: "#".concat(r) }, [e.h(pe, { options: a, show: s, container: p, isFullScreenContainer: !m, onClose: (B) => {
          var k, c;
          n.emit("update:show", !1), n.emit("close"), (c = (k = a.value).onClose) == null || c.call(k, B);
        } }, n.slots)])];
      };
    } }), he = e.defineComponent({ name: "ContextMenuGroup", props: { disabled: { type: Boolean, default: !1 }, hidden: { type: Boolean, default: !1 }, clickHandler: { type: Function, default: null }, label: { type: String, default: "" }, icon: { type: String, default: "" }, iconFontClass: { type: String, default: "iconfont" }, checked: { type: Boolean, default: !1 }, shortcut: { type: String, default: "" }, svgIcon: { type: String, default: "" }, svgProps: { type: Object, default: null }, preserveIconWidth: { type: Boolean, default: !0 }, showRightArrow: { type: Boolean, default: !1 }, clickClose: { type: Boolean, default: !0 }, adjustSubMenuPosition: { type: Boolean, default: void 0 }, maxWidth: { type: [String, Number], default: 0 }, minWidth: { type: [String, Number], default: 0 } }, setup(t, n) {
      const a = e.inject("globalOptions"), { adjustSubMenuPosition: s, maxWidth: m, minWidth: p } = e.toRefs(t), r = typeof s.value < "u" ? s.value : a.value.adjustPosition;
      return () => e.h(J, { ...t, showRightArrow: !0, maxWidth: void 0, minWidth: void 0, adjustSubMenuPosition: void 0, hasChildren: typeof n.slots.default !== void 0 }, n.slots.default ? { submenu: () => e.h(ee, { maxWidth: m.value, minWidth: p.value, adjustPosition: r }, { default: n.slots.default }) } : void 0);
    } });
    function nt(t, n, a, s) {
      const m = e.ref(!0), p = e.h(pe, { options: t, show: m, container: n, isFullScreenContainer: !a, onCloseAnimFinished: () => {
        e.render(null, n);
      }, onClose: (r) => {
        var B;
        (B = t.onClose) == null || B.call(t, r), m.value = !1;
      } }, s);
      return e.render(p, n), p.component;
    }
    function Ce(t, n) {
      const a = me(t);
      return nt(t, a.container, a.isNew, n).exposed;
    }
    const le = { install(t) {
      t.config.globalProperties.$contextmenu = Ce, t.component("ContextMenu", ve), t.component("ContextMenuItem", J), t.component("ContextMenuGroup", he), t.component("ContextMenuSperator", Q), t.component("ContextMenuSeparator", Q), t.component("ContextSubMenu", ee);
    }, showContextMenu(t, n) {
      return Ce(t, n);
    }, isAnyContextMenuOpen() {
      return Y();
    }, closeContextMenu: de, transformMenuPosition: Ie }, ot = {}, lt = { class: "mx-menu-bar-icon-menu", viewBox: "0 0 1024 1024", version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "200", height: "200" }, rt = [e.createElementVNode("path", { d: "M133.310936 296.552327l757.206115 0c19.781623 0 35.950949-16.169326 35.950949-35.950949 0-19.781623-15.997312-35.950949-35.950949-35.950949L133.310936 224.650428c-19.781623 0-35.950949 16.169326-35.950949 35.950949C97.359987 280.383 113.529313 296.552327 133.310936 296.552327z" }, null, -1), e.createElementVNode("path", { d: "M890.51705 476.135058 133.310936 476.135058c-19.781623 0-35.950949 16.169326-35.950949 35.950949 0 19.781623 16.169326 35.950949 35.950949 35.950949l757.206115 0c19.781623 0 35.950949-16.169326 35.950949-35.950949C926.467999 492.304384 910.298673 476.135058 890.51705 476.135058z" }, null, -1), e.createElementVNode("path", { d: "M890.51705 727.447673 133.310936 727.447673c-19.781623 0-35.950949 15.997312-35.950949 35.950949s16.169326 35.950949 35.950949 35.950949l757.206115 0c19.781623 0 35.950949-15.997312 35.950949-35.950949S910.298673 727.447673 890.51705 727.447673z" }, null, -1)];
    function ut(t, n) {
      return e.openBlock(), e.createElementBlock("svg", lt, rt);
    }
    const at = U(ot, [["render", ut]]), it = ["onClick", "onMouseenter"], st = e.defineComponent({ __name: "MenuBar", props: { options: { type: Object, default: null } }, setup(t) {
      const n = t, a = e.ref(), s = e.ref(!1), m = e.ref([]), p = e.ref(null);
      function r() {
        s.value = !0;
      }
      function B() {
        s.value = !1;
      }
      e.onMounted(() => {
        m.value = n.options.items || [];
      }), e.watch(() => n.options, () => {
        m.value = n.options.items || [];
      });
      let k = null, c = -1;
      function P() {
        c < m.value.length - 1 ? c++ : c = 0, W(c, m.value[c]);
      }
      function o() {
        c > 0 ? c-- : c = m.value.length - 1, W(c, m.value[c]);
      }
      function w(d) {
        var l;
        const i = (l = n.options.barPopDirection) != null ? l : "bl";
        let f = 0, x = 0;
        return i.startsWith("b") ? x = $(d) + d.offsetHeight : i.startsWith("t") ? x = $(d) : x = $(d) + d.offsetHeight / 2, i.endsWith("l") ? f = D(d) : i.startsWith("r") ? f = D(d) + d.offsetWidth : f = D(d) + d.offsetWidth / 2, { x: f, y: x };
      }
      function W(d, i) {
        var f;
        if (c = d, !i.children)
          return;
        k && (k.closeMenu(), k = null, s.value = !0), p.value = i;
        const x = (f = a.value) == null ? void 0 : f.children[d];
        if (x) {
          const { x: l, y } = w(x);
          k = le.showContextMenu({ ...n.options, items: i.children, x: l, y, onKeyFocusMoveLeft() {
            o();
          }, onKeyFocusMoveRight() {
            P();
          }, onClose() {
            p.value == i && (s.value = !1, p.value = null);
          } });
        }
      }
      function S() {
        c = 0;
        const d = a.value;
        if (d) {
          const { x: i, y: f } = w(d);
          k = le.showContextMenu({ ...n.options, x: i, y: f });
        }
      }
      function v(d, i) {
        i ? (s.value = !0, W(d, i), i.onClick && (i.clickableWhenHasChildren === !0 && i.children && i.children.length > 0 || !i.children || i.children.length === 0) && i.onClick()) : S();
      }
      function h(d, i) {
        s.value && W(d, i);
      }
      return (d, i) => {
        var f;
        return e.openBlock(), e.createElementBlock("div", { class: e.normalizeClass(["mx-menu-bar", (f = t.options.theme) != null ? f : "", t.options.mini ? "mini" : ""]), onFocus: r, onBlur: B }, [e.renderSlot(d.$slots, "prefix"), t.options.mini ? (e.openBlock(), e.createElementBlock("div", { key: 0, ref_key: "menuBarContent", ref: a, class: "mx-menu-bar-content" }, [e.createElementVNode("div", { class: "mx-menu-bar-item", onClick: i[0] || (i[0] = (x) => v(0, null)) }, [e.createVNode(at)])], 512)) : (e.openBlock(), e.createElementBlock("div", { key: 1, ref_key: "menuBarContent", ref: a, class: "mx-menu-bar-content" }, [(e.openBlock(!0), e.createElementBlock(e.Fragment, null, e.renderList(m.value, (x, l) => (e.openBlock(), e.createElementBlock("div", { key: l, class: e.normalizeClass(["mx-menu-bar-item", x == p.value ? "active" : ""]), onClick: (y) => v(l, x), onMouseenter: (y) => h(l, x) }, e.toDisplayString(x.label), 43, it))), 128))], 512)), e.renderSlot(d.$slots, "suffix")], 34);
      };
    } });
    H.ContextMenu = ve, H.ContextMenuGroup = he, H.ContextMenuItem = J, H.ContextMenuSeparator = Q, H.MenuBar = st, H.default = le, Object.defineProperties(H, { __esModule: { value: !0 }, [Symbol.toStringTag]: { value: "Module" } });
  });
})(se, se.exports);
var Pe = se.exports;
const xt = /* @__PURE__ */ kt(Pe), bt = /* @__PURE__ */ ht({
  __proto__: null,
  default: xt
}, [Pe]);
export {
  bt as v
};
