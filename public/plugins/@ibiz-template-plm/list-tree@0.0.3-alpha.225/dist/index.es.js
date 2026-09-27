import './assets/style.css';
import './assets/style.css';
import { registerControlProvider as ne, TreeController as oe, getControlPanel as ae } from "@ibiz-template/runtime";
import { withInstall as le, useControlController as ie, useNamespace as se } from "@ibiz-template/vue3-util";
import { defineComponent as de, ref as y, reactive as re, watch as z, computed as ce, nextTick as ue, resolveComponent as b, onMounted as pe, onUnmounted as he, createVNode as p, createTextVNode as fe, withDirectives as ve, resolveDirective as me, isVNode as ge } from "vue";
import { createUUID as O } from "qx-util";
import { debounce as j } from "lodash-es";
import { RuntimeError as M } from "@ibiz-template/core";
import { isNil as be, clone as xe } from "ramda";
var Ie = Object.defineProperty, ye = (t, r, c) => r in t ? Ie(t, r, { enumerable: !0, configurable: !0, writable: !0, value: c }) : t[r] = c, _e = (t, r, c) => (ye(t, typeof r != "symbol" ? r + "" : r, c), c);
class Ce extends oe {
  /**
   * 树节点点击事件
   *
   * @param {ITreeNodeData} nodeData
   * @returns {*}  {Promise<void>}
   * @memberof ListTreeController
   */
  async onTreeNodeClick(r, c) {
    var u;
    const s = this.getNodeData(r._id);
    if (!s)
      return;
    this.setNavData(s);
    const l = (u = this.contextMenuInfos[s._nodeId]) == null ? void 0 : u.clickTBUIActionItem;
    if (l)
      return this.doUIAction(
        l.uiactionId,
        s,
        c,
        l.appId
      );
    if (this.state.navigational) {
      const d = this.getNodeModel(s._nodeId);
      if (!(d != null && d.navAppViewId))
        return;
    }
    if (this.state.singleSelect && !s._disableSelect) {
      const { selectedData: d } = this.state, f = d.filter((h) => h._id !== s._id);
      f.length === d.length ? this.setSelection(
        this.state.singleSelect ? [s] : d.concat([s])
      ) : this.setSelection(f);
    }
    this.state.mdctrlActiveMode === 1 && await this.setActive(s);
  }
}
function x(t, r) {
  return r.state.items.find((u) => u._id === t) || r.state.items.find((u) => u._uuid === t);
}
function Ne(t, r) {
  const c = () => {
    const l = t.value;
    if (!l)
      throw new M("找不到el-tree实例对象");
    return l;
  }, u = () => {
    var l;
    const d = t.value;
    if (!d) {
      setTimeout(() => {
        u();
      }, 200);
      return;
    }
    Object.values(d.store.nodesMap).forEach((f) => {
      const h = r.state.expandedKeys.includes(f.data._id);
      h !== f.expanded && (h ? f.expand() : f.collapse());
    }), r.state.singleSelect ? t.value.setCurrentKey(((l = r.state.selectedData[0]) == null ? void 0 : l._id) || void 0) : d.setCheckedKeys(r.state.selectedData.map((f) => f._id));
  }, s = j(u, 500);
  return { getTreeInstance: c, updateUI: s, triggerNodeExpand: (l) => {
    const d = c().store.nodesMap[l];
    if (d)
      return d.expanded ? (d.collapse(), !1) : (d.expand(), !0);
  } };
}
function we(t) {
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
function Te(t) {
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
    const t = ie((...e) => new Ce(...e)), r = y(!1), c = re({});
    t.evt.on("onCreated", () => {
      t.counter && t.counter.onChange((e) => {
        Object.assign(c, e);
      }, !0), t.controlParams.cascadeselect && (r.value = !0);
    });
    const u = se("control-".concat(t.model.controlType.toLowerCase())), s = y(null), l = y(null), d = y(""), f = y(null), h = y(null), v = y(null);
    z(() => f.value, (e) => {
      e && e.$el.getElementsByTagName("input")[0].focus();
    });
    const w = (e) => {
      var n;
      if (e._disableSelect)
        return !1;
      const o = t.getNodeModel(e._nodeId), a = (n = t.contextMenuInfos[e._nodeId]) == null ? void 0 : n.clickTBUIActionItem;
      return !!(o != null && o.navAppViewId || a || e != null && e._children);
    }, S = () => {
      var e;
      const n = (e = s.value) == null ? void 0 : e.getCurrentKey();
      if (!n || n === h.value)
        return;
      const o = x(n, t), a = t.getNodeModel(o._nodeId);
      a != null && a.allowEditText && (h.value = n);
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
    } = Ne(s, t), B = (e) => e.map((n) => ({
      _id: n._id,
      _uuid: n._uuid,
      _leaf: n._leaf,
      _text: n._text,
      _disableSelect: n._disableSelect
    }));
    t.evt.on("onAfterRefreshParent", (e) => {
      if (s.value) {
        const {
          parentNode: n,
          children: o
        } = e, a = B(o);
        s.value.updateKeyChildren(n._id, a), A();
      }
    }), t.evt.on("onAfterNodeDrop", (e) => {
      e.isChangedParent && (d.value = O());
    });
    const T = ce(() => t.state.isLoaded ? t.model.rootVisible ? t.state.rootNodes : t.state.rootNodes.reduce((e, n) => n._children ? e.concat(n._children) : e, []) : []);
    z(T, (e, n) => {
      e !== n && (d.value = O());
    });
    const V = async (e, n) => {
      let o;
      if (e.level === 0)
        o = T.value, ibiz.log.debug("初始加载");
      else {
        const a = x(e.data._uuid, t);
        a._children ? (ibiz.log.debug("节点展开加载-本地", a), o = a._children) : (ibiz.log.debug("节点展开加载-远程", a), o = await t.loadNodes(a));
      }
      ibiz.log.debug("给树返回值", o), n(B(o)), A();
    };
    let D = !1;
    t.evt.on("onLoadSuccess", () => {
      D = !0, setTimeout(() => {
        D = !1;
      }, 200);
    }), t.evt.on("onSelectionChange", async () => {
      var e;
      D && await ue(), t.state.singleSelect ? s.value.setCurrentKey(((e = t.state.selectedData[0]) == null ? void 0 : e._id) || void 0) : s.value.setCheckedKeys(t.state.selectedData.map((n) => n._id));
    });
    const q = (e, n) => {
      const {
        checkedNodes: o
      } = n;
      t.setSelection(o);
    };
    let k = !1;
    const H = (e, n) => {
      var o, a;
      if (n.stopPropagation(), !(k || !w(e))) {
        if (((o = s.value) == null ? void 0 : o.getCurrentKey()) === e._id && S(), t.state.singleSelect || (a = s.value) == null || a.setCurrentKey(e._id), t.state.navigational) {
          const m = t.getNodeModel(e._nodeId);
          if (!(m != null && m.navAppViewId)) {
            const i = P(e._id);
            t.onExpandChange(e, i);
          }
        }
        t.onTreeNodeClick(e, n), k = !0, setTimeout(() => {
          k = !1;
        }, 200);
      }
    }, $ = (e, n) => {
      n.stopPropagation(), w(e) && t.onDbTreeNodeClick(e);
    };
    let _;
    t.evt.on("onMounted", () => {
      Object.values(t.contextMenus).length > 0 && (() => import("./vue3-context-menu.umd.es.js").then((e) => e.v))().then((e) => {
        _ = e.default, _.default && !_.showContextMenu && (_ = _.default);
      });
    });
    const R = (e, n) => {
      const o = [];
      return e == null || e.forEach((a) => {
        (n === "nodeItem" && a.actionLevel === 250 || n === "popper" && a.actionLevel < 200) && o.push(a);
      }), o;
    }, F = b("IBizRawItem"), Q = b("IBizIcon"), K = (e, n, o, a) => {
      const m = [];
      return e.forEach((i) => {
        var I;
        if (i.itemType === "SEPERATOR") {
          m.push({
            divided: "self"
          });
          return;
        }
        const C = a[i.id];
        if (C && !C.visible)
          return;
        const g = {};
        if (i.showCaption && i.caption && (g.label = i.caption), i.sysImage && i.showIcon && (g.icon = p(Q, {
          icon: i.sysImage
        }, null)), i.itemType === "DEUIACTION") {
          g.disabled = C.disabled, g.clickClose = !0;
          const {
            uiactionId: N
          } = i;
          N && (g.onClick = () => {
            t.doUIAction(N, n, o, i.appId);
          });
        } else if (i.itemType === "RAWITEM") {
          const {
            rawItem: N
          } = i;
          N && (g.label = p(F, {
            rawItem: i
          }, null));
        } else
          i.itemType === "ITEMS" && (I = i.detoolbarItems) != null && I.length && (g.children = K(i.detoolbarItems, n, o, a));
        m.push(g);
      }), m;
    }, W = async (e, n) => {
      n.preventDefault(), n.stopPropagation();
      const o = t.getNodeModel(e._nodeId);
      if (!(o != null && o.decontextMenu))
        return;
      const a = t.contextMenus[o.decontextMenu.id];
      if (!a.model.detoolbarItems)
        return;
      await a.calcButtonState(e._deData || (e.srfkey ? e : void 0), o.appDataEntityId);
      const m = a.state.buttonsState, i = R(a.model.detoolbarItems, "popper"), I = K(i, e, n, m);
      I.length && _.showContextMenu({
        x: n.x,
        y: n.y,
        customClass: u.b("context-menu"),
        items: I
      });
    }, G = (e, n) => {
      var o, a, m;
      if (!((a = (o = e == null ? void 0 : e.decontextMenu) == null ? void 0 : o.detoolbarItems) != null && a.length))
        return;
      const i = t.contextMenuInfos[e.id];
      if (i.clickTBUIActionItem && i.onlyOneActionItem)
        return null;
      const I = {
        detoolbarItems: R((m = e == null ? void 0 : e.decontextMenu) == null ? void 0 : m.detoolbarItems, "nodeItem")
      }, C = xe(e);
      return Object.assign(C.decontextMenu, I), p(b("iBizContextMenuControl"), {
        modelData: I,
        groupLevelKeys: [50, 100],
        nodeModel: C,
        nodeData: n,
        context: t.context,
        onActionClick: (g, N) => t.doUIAction(g.uiactionId, n, N, g.appId)
      }, null);
    }, J = (e, n) => {
      const o = x(e._uuid, t);
      if (!o)
        throw new M("没有找到_uuid为".concat(e._uuid, "的节点"));
      t.onExpandChange(o, n);
    }, X = j(() => {
      t.load();
    }, 500), Y = (e) => {
      t.state.query = e, X();
    }, Z = (e, n, o) => {
      const a = x(e.data._uuid, t), m = x(n.data._uuid, t);
      return t.calcAllowDrop(a, m, o);
    }, ee = (e) => {
      const n = x(e.data._uuid, t);
      return t.calcAllowDrag(n);
    }, te = (e, n, o) => {
      const a = we(o), m = x(e.data._uuid, t), i = x(n.data._uuid, t);
      t.onNodeDrop(m, i, a);
    }, L = (e) => {
      (e.code === "F2" || e.code === "Enter") && S();
    };
    return pe(() => {
      var e;
      (e = l.value) == null || e.$el.addEventListener("keydown", L);
    }), he(() => {
      var e;
      (e = l.value) == null || e.$el.removeEventListener("keydown", L);
    }), {
      c: t,
      ns: u,
      treeRef: s,
      treeviewRef: l,
      treeNodeTextInputRef: f,
      treeData: T,
      treeRefreshKey: d,
      editingNodeKey: h,
      editingNodeText: v,
      cascadeSelect: r,
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
    }, r = this.c.controlPanel ? "tree" : "default";
    return t[r] = () => {
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
            var u, s;
            const l = this.findNodeData(c._uuid, this.c);
            if (!l)
              return null;
            const d = this.c.getNodeModel(l._nodeId);
            if (this.editingNodeKey === l._id)
              return p("div", {
                class: [this.ns.b("node"), (u = d.sysCss) == null ? void 0 : u.cssName]
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
            const f = ae(d);
            let h;
            return f ? h = p(b("iBizControlShell"), {
              data: l,
              modelData: f,
              context: this.c.context,
              params: this.c.params
            }, null) : h = [l._icon ? p(b("iBizIcon"), {
              class: this.ns.be("node", "icon"),
              icon: l._icon
            }, null) : null, l._textHtml ? p("span", {
              class: this.ns.be("node", "label"),
              innerHTML: l._textHtml
            }, null) : p("span", {
              class: this.ns.be("node", "label")
            }, [l._text])], p("div", {
              onDblclick: (v) => this.onNodeDbClick(l, v),
              onClick: (v) => this.onNodeClick(l, v),
              onContextmenu: (v) => this.onNodeContextmenu(l, v),
              class: [this.ns.b("node"), this.calcNodeAbility(l) ? "" : this.ns.bm("node", "disabled"), l._leaf ? this.ns.be("node", "item") : this.ns.be("node", "group"), (s = d.sysCss) == null ? void 0 : s.cssName]
            }, [h, this.renderCounter(d), this.renderContextMenu(d, l)]);
          }
        });
    }, ve(p(b("iBizControlBase"), {
      ref: "treeviewRef",
      controller: this.c
    }, Te(t) ? t : {
      default: () => [t]
    }), [[me("loading"), this.c.state.isLoading]]);
  }
});
class De {
  constructor() {
    _e(this, "component", "IBizListTreeControl");
  }
}
const ke = le(
  E,
  function(t) {
    t.component(E.name, E), ne(
      "TREE_RENDER_LIST_TREE",
      () => new De()
    );
  }
), Le = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(t) {
    t.use(ke);
  }
};
export {
  ke as IBizListTreeControl,
  Le as default
};
