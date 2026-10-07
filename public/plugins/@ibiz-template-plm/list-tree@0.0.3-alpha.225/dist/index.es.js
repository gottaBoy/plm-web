import './assets/style.css';
import { registerControlProvider as ne, TreeController as oe, getControlPanel as ae } from "@ibiz-template/runtime";
import { withInstall as le, useControlController as ie, useNamespace as se } from "@ibiz-template/vue3-util";
import { defineComponent as de, ref as I, reactive as re, watch as z, computed as ce, nextTick as ue, resolveComponent as b, onMounted as pe, onUnmounted as he, createVNode as p, createTextVNode as fe, withDirectives as ve, resolveDirective as me, isVNode as ge } from "vue";
import { createUUID as O } from "qx-util";
import { debounce as j } from "lodash-es";
import { RuntimeError as M } from "@ibiz-template/core";
import { isNil as be, clone as xe } from "ramda";
var ye = Object.defineProperty, Ie = (t, o, c) => o in t ? ye(t, o, { enumerable: !0, configurable: !0, writable: !0, value: c }) : t[o] = c, _e = (t, o, c) => (Ie(t, typeof o != "symbol" ? o + "" : o, c), c);
const Ce = (t) => {
  let o = t;
  const c = /* @__PURE__ */ new Set();
  for (; o && (typeof o == "object" || typeof o == "function") && !c.has(o); ) {
    if (c.add(o), typeof o.showContextMenu == "function")
      return o;
    if (o.default && o.default !== o) {
      o = o.default;
      continue;
    }
    if (o.v && o.v !== o) {
      o = o.v;
      continue;
    }
    break;
  }
};
class Ne extends oe {
  /**
   * 树节点点击事件
   *
   * @param {ITreeNodeData} nodeData
   * @returns {*}  {Promise<void>}
   * @memberof ListTreeController
   */
  async onTreeNodeClick(o, c) {
    var u;
    const d = this.getNodeData(o._id);
    if (!d)
      return;
    this.setNavData(d);
    const i = (u = this.contextMenuInfos[d._nodeId]) == null ? void 0 : u.clickTBUIActionItem;
    if (i)
      return this.doUIAction(
        i.uiactionId,
        d,
        c,
        i.appId
      );
    if (this.state.navigational) {
      const r = this.getNodeModel(d._nodeId);
      if (!(r != null && r.navAppViewId))
        return;
    }
    if (this.state.singleSelect && !d._disableSelect) {
      const { selectedData: r } = this.state, f = r.filter((h) => h._id !== d._id);
      f.length === r.length ? this.setSelection(
        this.state.singleSelect ? [d] : r.concat([d])
      ) : this.setSelection(f);
    }
    this.state.mdctrlActiveMode === 1 && await this.setActive(d);
  }
}
function x(t, o) {
  return o.state.items.find((u) => u._id === t) || o.state.items.find((u) => u._uuid === t);
}
function we(t, o) {
  const c = () => {
    const i = t.value;
    if (!i)
      throw new M("找不到el-tree实例对象");
    return i;
  }, u = () => {
    var i;
    const r = t.value;
    if (!r) {
      setTimeout(() => {
        u();
      }, 200);
      return;
    }
    Object.values(r.store.nodesMap).forEach((f) => {
      const h = o.state.expandedKeys.includes(f.data._id);
      h !== f.expanded && (h ? f.expand() : f.collapse());
    }), o.state.singleSelect ? t.value.setCurrentKey(((i = o.state.selectedData[0]) == null ? void 0 : i._id) || void 0) : r.setCheckedKeys(o.state.selectedData.map((f) => f._id));
  }, d = j(u, 500);
  return { getTreeInstance: c, updateUI: d, triggerNodeExpand: (i) => {
    const r = c().store.nodesMap[i];
    if (r)
      return r.expanded ? (r.collapse(), !1) : (r.expand(), !0);
  } };
}
function Te(t) {
  switch (t) {
    case "inner":
      return "inner";
    case "before":
      return "prev";
    case "after":
      return "next";
    default:
      throw new M("暂不支持dropType:".concat(t));
  }
}
function De(t) {
  return typeof t == "function" || Object.prototype.toString.call(t) === "[object Object]" && !ge(t);
}
const E = /* @__PURE__ */ de({
  name: "IBizListTreeControl",
  props: {
    modelData: {
      type: Object,
      required: !0
    },
    context: {
      type: Object,
      required: !0
    },
    params: {
      type: Object,
      default: () => ({})
    },
    provider: {
      type: Object
    },
    /**
     * 部件行数据默认激活模式
     * - 0 不激活
     * - 1 单击激活
     * - 2 双击激活(默认值)
     *
     * @type {(number | 0 | 1 | 2)}
     */
    mdctrlActiveMode: {
      type: Number,
      default: void 0
    },
    /**
     * 是否为单选
     * - true 单选
     * - false 多选
     *
     * @type {(Boolean)}
     */
    singleSelect: {
      type: Boolean,
      default: void 0
    },
    navigational: {
      type: Boolean,
      default: void 0
    },
    defaultExpandedKeys: {
      type: Array
    },
    loadDefault: {
      type: Boolean,
      default: !0
    }
  },
  setup() {
    const t = ie((...e) => new Ne(...e)), o = I(!1), c = re({});
    t.evt.on("onCreated", () => {
      t.counter && t.counter.onChange((e) => {
        Object.assign(c, e);
      }, !0), t.controlParams.cascadeselect && (o.value = !0);
    });
    const u = se("control-".concat(t.model.controlType.toLowerCase())), d = I(null), i = I(null), r = I(""), f = I(null), h = I(null), v = I(null);
    z(() => f.value, (e) => {
      e && e.$el.getElementsByTagName("input")[0].focus();
    });
    const w = (e) => {
      var n;
      if (e._disableSelect)
        return !1;
      const a = t.getNodeModel(e._nodeId), l = (n = t.contextMenuInfos[e._nodeId]) == null ? void 0 : n.clickTBUIActionItem;
      return !!(a != null && a.navAppViewId || l || e != null && e._children);
    }, S = () => {
      var e;
      const n = (e = d.value) == null ? void 0 : e.getCurrentKey();
      if (!n || n === h.value)
        return;
      const a = x(n, t), l = t.getNodeModel(a._nodeId);
      l != null && l.allowEditText && (h.value = n);
    }, U = async () => {
      if (h.value)
        if (v.value) {
          const e = x(h.value, t);
          await t.modifyNodeText(e, v.value), h.value = null, v.value = null;
        } else
          h.value = null;
    }, {
      updateUI: A,
      triggerNodeExpand: P
    } = we(d, t), B = (e) => e.map((n) => ({
      _id: n._id,
      _uuid: n._uuid,
      _leaf: n._leaf,
      _text: n._text,
      _disableSelect: n._disableSelect
    }));
    t.evt.on("onAfterRefreshParent", (e) => {
      if (d.value) {
        const {
          parentNode: n,
          children: a
        } = e, l = B(a);
        d.value.updateKeyChildren(n._id, l), A();
      }
    }), t.evt.on("onAfterNodeDrop", (e) => {
      e.isChangedParent && (r.value = O());
    });
    const T = ce(() => t.state.isLoaded ? t.model.rootVisible ? t.state.rootNodes : t.state.rootNodes.reduce((e, n) => n._children ? e.concat(n._children) : e, []) : []);
    z(T, (e, n) => {
      e !== n && (r.value = O());
    });
    const V = async (e, n) => {
      let a;
      if (e.level === 0)
        a = T.value, ibiz.log.debug("初始加载");
      else {
        const l = x(e.data._uuid, t);
        l._children ? (ibiz.log.debug("节点展开加载-本地", l), a = l._children) : (ibiz.log.debug("节点展开加载-远程", l), a = await t.loadNodes(l));
      }
      ibiz.log.debug("给树返回值", a), n(B(a)), A();
    };
    let D = !1;
    t.evt.on("onLoadSuccess", () => {
      D = !0, setTimeout(() => {
        D = !1;
      }, 200);
    }), t.evt.on("onSelectionChange", async () => {
      var e;
      D && await ue(), t.state.singleSelect ? d.value.setCurrentKey(((e = t.state.selectedData[0]) == null ? void 0 : e._id) || void 0) : d.value.setCheckedKeys(t.state.selectedData.map((n) => n._id));
    });
    const q = (e, n) => {
      const {
        checkedNodes: a
      } = n;
      t.setSelection(a);
    };
    let k = !1;
    const H = (e, n) => {
      var a, l;
      if (n.stopPropagation(), !(k || !w(e))) {
        if (((a = d.value) == null ? void 0 : a.getCurrentKey()) === e._id && S(), t.state.singleSelect || (l = d.value) == null || l.setCurrentKey(e._id), t.state.navigational) {
          const m = t.getNodeModel(e._nodeId);
          if (!(m != null && m.navAppViewId)) {
            const s = P(e._id);
            t.onExpandChange(e, s);
          }
        }
        t.onTreeNodeClick(e, n), k = !0, setTimeout(() => {
          k = !1;
        }, 200);
      }
    }, $ = (e, n) => {
      n.stopPropagation(), w(e) && t.onDbTreeNodeClick(e);
    };
    let N;
    t.evt.on("onMounted", () => {
      Object.values(t.contextMenus).length > 0 && (() => import("@imengyu/vue3-context-menu"))().then((e) => {
        N = Ce(e);
      });
    });
    const R = (e, n) => {
      const a = [];
      return e == null || e.forEach((l) => {
        (n === "nodeItem" && l.actionLevel === 250 || n === "popper" && l.actionLevel < 200) && a.push(l);
      }), a;
    }, F = b("IBizRawItem"), Q = b("IBizIcon"), K = (e, n, a, l) => {
      const m = [];
      return e.forEach((s) => {
        var y;
        if (s.itemType === "SEPERATOR") {
          m.push({
            divided: "self"
          });
          return;
        }
        const _ = l[s.id];
        if (_ && !_.visible)
          return;
        const g = {};
        if (s.showCaption && s.caption && (g.label = s.caption), s.sysImage && s.showIcon && (g.icon = p(Q, {
          icon: s.sysImage
        }, null)), s.itemType === "DEUIACTION") {
          g.disabled = _.disabled, g.clickClose = !0;
          const {
            uiactionId: C
          } = s;
          C && (g.onClick = () => {
            t.doUIAction(C, n, a, s.appId);
          });
        } else if (s.itemType === "RAWITEM") {
          const {
            rawItem: C
          } = s;
          C && (g.label = p(F, {
            rawItem: s
          }, null));
        } else
          s.itemType === "ITEMS" && (y = s.detoolbarItems) != null && y.length && (g.children = K(s.detoolbarItems, n, a, l));
        m.push(g);
      }), m;
    }, W = async (e, n) => {
      n.preventDefault(), n.stopPropagation();
      const a = t.getNodeModel(e._nodeId);
      if (!(a != null && a.decontextMenu))
        return;
      const l = t.contextMenus[a.decontextMenu.id];
      if (!l.model.detoolbarItems)
        return;
      await l.calcButtonState(e._deData || (e.srfkey ? e : void 0), a.appDataEntityId);
      const m = l.state.buttonsState, s = R(l.model.detoolbarItems, "popper"), y = K(s, e, n, m);
      y.length && (N == null || N.showContextMenu({
        x: n.x,
        y: n.y,
        customClass: u.b("context-menu"),
        items: y
      }));
    }, G = (e, n) => {
      var a, l, m;
      if (!((l = (a = e == null ? void 0 : e.decontextMenu) == null ? void 0 : a.detoolbarItems) != null && l.length))
        return;
      const s = t.contextMenuInfos[e.id];
      if (s.clickTBUIActionItem && s.onlyOneActionItem)
        return null;
      const y = {
        detoolbarItems: R((m = e == null ? void 0 : e.decontextMenu) == null ? void 0 : m.detoolbarItems, "nodeItem")
      }, _ = xe(e);
      return Object.assign(_.decontextMenu, y), p(b("iBizContextMenuControl"), {
        modelData: y,
        groupLevelKeys: [50, 100],
        nodeModel: _,
        nodeData: n,
        context: t.context,
        onActionClick: (g, C) => t.doUIAction(g.uiactionId, n, C, g.appId)
      }, null);
    }, J = (e, n) => {
      const a = x(e._uuid, t);
      if (!a)
        throw new M("没有找到_uuid为".concat(e._uuid, "的节点"));
      t.onExpandChange(a, n);
    }, X = j(() => {
      t.load();
    }, 500), Y = (e) => {
      t.state.query = e, X();
    }, Z = (e, n, a) => {
      const l = x(e.data._uuid, t), m = x(n.data._uuid, t);
      return t.calcAllowDrop(l, m, a);
    }, ee = (e) => {
      const n = x(e.data._uuid, t);
      return t.calcAllowDrag(n);
    }, te = (e, n, a) => {
      const l = Te(a), m = x(e.data._uuid, t), s = x(n.data._uuid, t);
      t.onNodeDrop(m, s, l);
    }, L = (e) => {
      (e.code === "F2" || e.code === "Enter") && S();
    };
    return pe(() => {
      var e;
      (e = i.value) == null || e.$el.addEventListener("keydown", L);
    }), he(() => {
      var e;
      (e = i.value) == null || e.$el.removeEventListener("keydown", L);
    }), {
      c: t,
      ns: u,
      treeRef: d,
      treeviewRef: i,
      treeNodeTextInputRef: f,
      treeData: T,
      treeRefreshKey: r,
      editingNodeKey: h,
      editingNodeText: v,
      cascadeSelect: o,
      findNodeData: x,
      onCheck: q,
      onNodeClick: H,
      onNodeDbClick: $,
      onNodeContextmenu: W,
      loadData: V,
      renderContextMenu: G,
      renderCounter: (e) => {
        if (e.counterId) {
          const n = c[e.counterId];
          return be(n) || e.counterMode === 1 && n === 0 ? null : p("div", {
            class: u.b("counter")
          }, [p("span", {
            class: u.be("counter", "dot")
          }, [fe("·")]), p(b("iBizBadge"), {
            value: n
          }, null)]);
        }
      },
      updateNodeExpand: J,
      onInput: Y,
      allowDrop: Z,
      allowDrag: ee,
      handleDrop: te,
      onNodeTextEditBlur: U,
      calcNodeAbility: w
    };
  },
  render() {
    const t = {
      searchbar: () => this.c.enableQuickSearch ? p(b("el-input"), {
        "model-value": this.c.state.query,
        class: [this.ns.b("quick-search"), this.ns.b("quick-search")],
        placeholder: this.c.state.placeHolder,
        onInput: this.onInput
      }, {
        prefix: () => p(b("ion-icon"), {
          class: this.ns.e("search-icon"),
          name: "search"
        }, null)
      }) : null
    }, o = this.c.controlPanel ? "tree" : "default";
    return t[o] = () => {
      if (this.c.state.isLoaded && this.treeRefreshKey)
        return p(b("el-tree"), {
          ref: "treeRef",
          class: [this.ns.b("tree"), this.ns.is("list", !0)],
          key: this.treeRefreshKey,
          "node-key": "_id",
          "highlight-current": !0,
          "expand-on-click-node": !1,
          "auto-expand-parent": !1,
          "show-checkbox": !this.c.state.singleSelect,
          "check-strictly": !this.cascadeSelect,
          "default-expanded-keys": this.c.state.expandedKeys,
          props: {
            label: "_text",
            children: "_children",
            isLeaf: "_leaf",
            disabled: "_disableSelect"
          },
          lazy: !0,
          load: this.loadData,
          onCheck: this.onCheck,
          onNodeExpand: (c) => {
            this.updateNodeExpand(c, !0);
          },
          onNodeCollapse: (c) => {
            this.updateNodeExpand(c, !1);
          },
          draggable: !0,
          "allow-drop": this.allowDrop,
          "allow-drag": this.allowDrag,
          onNodeDrop: this.handleDrop
        }, {
          default: ({
            data: c
          }) => {
            var u, d;
            const i = this.findNodeData(c._uuid, this.c);
            if (!i)
              return null;
            const r = this.c.getNodeModel(i._nodeId);
            if (this.editingNodeKey === i._id)
              return p("div", {
                class: [this.ns.b("node"), (u = r.sysCss) == null ? void 0 : u.cssName]
              }, [p(b("el-input"), {
                modelValue: this.editingNodeText,
                "onUpdate:modelValue": (v) => this.editingNodeText = v,
                ref: "treeNodeTextInputRef",
                class: this.ns.b("editing-node"),
                onBlur: () => {
                  this.onNodeTextEditBlur();
                },
                onKeydown: (v) => {
                  v.stopPropagation(), v.code === "Enter" && this.onNodeTextEditBlur();
                }
              }, null)]);
            const f = ae(r);
            let h;
            return f ? h = p(b("iBizControlShell"), {
              data: i,
              modelData: f,
              context: this.c.context,
              params: this.c.params
            }, null) : h = [i._icon ? p(b("iBizIcon"), {
              class: this.ns.be("node", "icon"),
              icon: i._icon
            }, null) : null, i._textHtml ? p("span", {
              class: this.ns.be("node", "label"),
              innerHTML: i._textHtml
            }, null) : p("span", {
              class: this.ns.be("node", "label")
            }, [i._text])], p("div", {
              onDblclick: (v) => this.onNodeDbClick(i, v),
              onClick: (v) => this.onNodeClick(i, v),
              onContextmenu: (v) => this.onNodeContextmenu(i, v),
              class: [this.ns.b("node"), this.calcNodeAbility(i) ? "" : this.ns.bm("node", "disabled"), i._leaf ? this.ns.be("node", "item") : this.ns.be("node", "group"), (d = r.sysCss) == null ? void 0 : d.cssName]
            }, [h, this.renderCounter(r), this.renderContextMenu(r, i)]);
          }
        });
    }, ve(p(b("iBizControlBase"), {
      ref: "treeviewRef",
      controller: this.c
    }, De(t) ? t : {
      default: () => [t]
    }), [[me("loading"), this.c.state.isLoading]]);
  }
});
class ke {
  constructor() {
    _e(this, "component", "IBizListTreeControl");
  }
}
const Ee = le(
  E,
  function(t) {
    t.component(E.name, E), ne(
      "TREE_RENDER_LIST_TREE",
      () => new ke()
    );
  }
), ze = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(t) {
    t.use(Ee);
  }
};
export {
  Ee as IBizListTreeControl,
  ze as default
};
