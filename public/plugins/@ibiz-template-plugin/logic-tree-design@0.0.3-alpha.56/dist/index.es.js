import './assets/style.css';
import { UIActionProviderBase as J, TreeService as X, TreeController as Y, UIActionUtil as Z, getControlPanel as ee, registerControlProvider as te, registerUIActionProvider as se } from "@ibiz-template/runtime";
import { RuntimeModelError as $, RuntimeError as R } from "@ibiz-template/core";
import { isArray as ne, createUUID as j } from "qx-util";
import { defineComponent as F, ref as I, createVNode as f, createTextVNode as oe, resolveComponent as x, watch as U, computed as ae, nextTick as ie, onMounted as re, onUnmounted as le, withDirectives as ce, resolveDirective as de, isVNode as ue } from "vue";
import { useNamespace as V, useControlController as fe, withInstall as he } from "@ibiz-template/vue3-util";
import { debounce as H, isNil as q } from "lodash-es";
const pe = /* @__PURE__ */ F({
  name: "IBizCodeListSelect",
  props: {
    codeListId: {
      type: String,
      required: !0
    },
    context: {
      type: Object,
      required: !0
    },
    params: {
      type: Object
    }
  },
  emits: ["select"],
  setup(e, {
    emit: t
  }) {
    const n = V("codelist-select"), r = I();
    return ibiz.hub.getApp(e.context.srfappid).codeList.get(e.codeListId, e.context, e.params).then((d) => {
      r.value = d;
    }), {
      ns: n,
      codeListItems: r,
      onSelect: (d) => {
        t("select", d);
      }
    };
  },
  render() {
    var e;
    return f("div", {
      class: [this.ns.b()]
    }, [f("div", {
      class: [this.ns.e("header")]
    }, [oe("新建")]), f("div", {
      class: [this.ns.e("items")]
    }, [(e = this.codeListItems) == null ? void 0 : e.map((t) => f("div", {
      class: [this.ns.b("item")],
      onClick: () => this.onSelect(t)
    }, [t.sysImage && f(x("iBizIcon"), {
      class: [this.ns.be("item", "icon")],
      icon: t.sysImage
    }, null), f("div", {
      class: [this.ns.be("item", "text")]
    }, [t.text])]))])]);
  }
});
class _e extends J {
  async execAction(t, n) {
    const { context: r, params: o, data: d, event: i } = n, u = {}, l = t.appDataEntityId, m = t.appDEMethodId;
    if (!l || !m)
      throw new $(t, "未配置实体或实体行为");
    const h = r.clone(), C = t.userTag;
    if (C) {
      let v = null;
      const b = ibiz.overlay.createPopover(
        pe,
        {
          codeListId: C,
          context: h,
          params: o,
          onSelect: (T) => {
            v = T, b.dismiss();
          }
        },
        {
          autoClose: !0,
          placement: "right",
          noArrow: !0
        }
      );
      if (b.present(i.target), await b.onWillDismiss(), !v)
        return { cancel: !0 };
      h.srfselectedtype = v.value;
    }
    //! 处理参数，需要配置srfselectedtype的转换,才能在视图参数里有对应的参数
    const { resultContext: N, resultParams: k } = await this.handleParams(
      t,
      h,
      d,
      o
    ), D = { ...k }, _ = await ibiz.hub.getApp(h == null ? void 0 : h.srfappid).deService.exec(
      l,
      m,
      N,
      D
    );
    if (_.ok) {
      const v = this.calcMessage("success", t, n);
      v && ibiz.message.success(v);
    }
    return Object.assign(u, {
      data: ne(_.data) ? _.data : [_.data],
      nextContext: N,
      nextParams: D,
      toSelectSrfkey: _.data.srfkey
    }), u;
  }
}
function g(e, t) {
  const n = t.state.items.find((r) => r._id === e);
  return n || t.state.items.find((r) => r._uuid === e);
}
function me(e, t) {
  const n = () => {
    const i = e.value;
    if (!i)
      throw new R("找不到el-tree实例对象");
    return i;
  }, r = () => {
    var u;
    const i = e.value;
    if (!i) {
      setTimeout(() => {
        r();
      }, 200);
      return;
    }
    Object.values(i.store.nodesMap).forEach((l) => {
      const m = t.state.expandedKeys.includes(l.data._id);
      m !== l.expanded && (m ? l.expand() : l.collapse());
    }), t.state.singleSelect ? e.value.setCurrentKey(((u = t.state.selectedData[0]) == null ? void 0 : u._id) || void 0) : i.setCheckedKeys(t.state.selectedData.map((l) => l._id));
  }, o = H(r, 500);
  return { getTreeInstance: n, updateUI: o, triggerNodeExpand: (i) => {
    const l = n().store.nodesMap[i];
    if (l)
      return l.expanded ? (l.collapse(), !1) : (l.expand(), !0);
  } };
}
function ye(e) {
  switch (e) {
    case "inner":
      return "inner";
    case "before":
      return "prev";
    case "after":
      return "next";
    default:
      throw new R("暂不支持dropType:".concat(e));
  }
}
class ve extends X {
  getNodeRSFilterParams(t, n, r) {
    const o = super.getNodeRSFilterParams(t, n, r), d = /^n_.*_eq$/;
    return Object.keys(o.navParams).forEach((i) => {
      d.test(i) && delete o.navParams[i];
    }), Object.keys(o.params).forEach((i) => {
      d.test(i) && delete o.params[i];
    }), o;
  }
}
class ge extends Y {
  constructor() {
    super(...arguments), this.toSelectSrfkey = "";
  }
  async initService() {
    this.service = new ve(this.model), await this.service.init(this.context);
  }
  /**
   * @description 设置下一步选中数据
   * @memberof LogicTreeDesignTreeController
   */
  setToSelectData() {
    if (!this.toSelectSrfkey)
      return;
    const t = this.state.items.find(
      (n) => n.srfkey === this.toSelectSrfkey
    );
    t && (this.onTreeNodeClick(t, {}), this.toSelectSrfkey = "");
  }
  async onCreated() {
    var t;
    (t = this.model.detreeNodes) == null || t.forEach((n) => {
      n.rootNode && (n.allowDrop = !0);
    }), await super.onCreated();
  }
  async afterLoad(t, n) {
    return this.setToSelectData(), n;
  }
  /**
   * 当数据放生变更时，若为当前应用实体数据。则多数据部件进行刷新
   *
   * @author chitanda
   * @date 2023-09-13 17:09:04
   * @protected
   * @param {IData} msg
   */
  onDataChange(t) {
    if (t.data && t.data.srfdecodename === this.dataEntity.codeName && this.state.activated) {
      const n = this.state.items.find(
        (r) => r.srfkey === t.data.srfkey
      );
      n && (n._deData = t.data);
    }
  }
  calcAllowDrop(t, n, r) {
    const o = r === "inner" ? n : n._parent;
    return o != null && o._deData && !q(o._deData.srfallowdrop) ? o._deData.srfallowdrop : super.calcAllowDrop(t, n, r);
  }
  async onNodeDrop(t, n, r) {
    var k, D, L;
    r === "inner" && !n._leaf && n._children === void 0 && await this.expandNodeByKey([n._id]);
    const o = [], d = this.getNodeModel(t._nodeId), i = r === "inner" ? n : n._parent, u = (n == null ? void 0 : n._id) !== ((k = t._parent) == null ? void 0 : k._id);
    let l = this.getNodeModel(n._nodeId);
    if (r === "inner" || ((D = n._parent) == null ? void 0 : D._id) !== ((L = t._parent) == null ? void 0 : L._id)) {
      const _ = this.findDropNodeRS(
        i._nodeId,
        d.appDataEntityId
      );
      _ && (t._deData[_.pickupDEFName] = q(
        i._value
      ) ? null : i._value, o.push(t), l = this.getNodeModel(_.childDETreeNodeId));
    }
    const m = t._parent._children;
    if (m.splice(m.indexOf(t), 1), r === "inner")
      n._children || (n._children = [], n._leaf = !0, this.state.expandedKeys.push(n._id)), n._children.push(t);
    else {
      let _ = i._children.indexOf(n);
      r === "next" && (_ += 1), i._children.splice(_, 0, t);
    }
    (r === "inner" || u) && (t._parent = i, t._nodeId = l.id, this.state.expandedKeys = this.calcExpandedKeys([i]));
    const { sortAppDEFieldId: h, sortDir: C, allowOrder: N } = l;
    if (N === !0) {
      if (!h)
        throw new $(l, "缺少配置排序属性");
      const _ = h.toLowerCase(), v = C === "ASC", b = [...i._children];
      v || b.reverse();
      const T = (y) => y + (100 - y % 100), P = (y) => y[_] || 0;
      let w;
      b.forEach((y, K) => {
        const S = y._deData;
        w === void 0 ? y === t && (K === 0 ? w = 100 : w = T(P(b[K - 1]._deData)), S[_] = w, o.indexOf(y) === -1 && o.push(y)) : (w >= P(S) && (S[_] = T(w), o.push(y)), w = P(S));
      });
    }
    await this.updateDeNodeData(o), this._evt.emit("onAfterNodeDrop", { isChangedParent: u });
  }
  /**
   * 删除强制静默，其他不变
   * @author lxm
   * @date 2023-12-27 03:32:36
   * @param {MDCtrlRemoveParams} [args]
   * @return {*}  {Promise<void>}
   */
  remove(t) {
    const n = t || {};
    return n.silent = !0, super.remove(t);
  }
  /**
   * 执行界面行为
   *
   * @author chitanda
   * @date 2023-12-07 15:12:26
   * @param {string} uiActionId
   * @param {ITreeNodeData} nodeData
   * @param {MouseEvent} event
   * @param {string} appId
   * @return {*}  {Promise<void>}
   */
  async doUIAction(t, n, r, o) {
    const d = this.getEventArgs(), i = this.parseTreeNodeData(n), u = await Z.exec(
      t,
      {
        ...d,
        ...i,
        event: r
      },
      o
    );
    if (u.closeView)
      this.view.closeView();
    else if (u.refresh)
      switch (u.refreshMode) {
        case 1:
          await this.refreshNodeChildren(n);
          break;
        case 2:
          await this.refreshNodeChildren(n, !0);
          break;
        case 3:
          await this.refresh();
          break;
      }
    const { toSelectSrfkey: l } = u;
    l && (this.toSelectSrfkey = l, this.setToSelectData());
  }
}
function xe(e) {
  return typeof e == "function" || Object.prototype.toString.call(e) === "[object Object]" && !ue(e);
}
const z = /* @__PURE__ */ F({
  name: "IBizLogicTreeDesignTree",
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
    const e = fe((...s) => new ge(...s)), t = V("logic-tree-design-tree"), n = I(null), r = I(null), o = I(""), d = I(null), i = I(null), u = I(null);
    U(() => d.value, (s) => {
      s && s.$el.getElementsByTagName("input")[0].focus();
    });
    const l = () => {
      var p;
      const s = (p = n.value) == null ? void 0 : p.getCurrentKey();
      if (!s || s === i.value)
        return;
      const a = g(s, e), c = e.getNodeModel(a._nodeId);
      c != null && c.allowEditText && (i.value = s);
    }, m = async () => {
      if (i.value)
        if (u.value) {
          const s = g(i.value, e);
          await e.modifyNodeText(s, u.value), i.value = null, u.value = null;
        } else
          i.value = null;
    }, {
      updateUI: h
    } = me(n, e), C = (s) => s.map((a) => ({
      _id: a._id,
      _uuid: a._uuid,
      // 子节点或者，非子节点但是已经加载过子且子是空的
      _leaf: a._leaf || a._children && a._children.length === 0,
      _text: a._text
    }));
    e.evt.on("onAfterRefreshParent", (s) => {
      if (n.value) {
        const {
          parentNode: a,
          children: c
        } = s, p = C(c);
        n.value.updateKeyChildren(a._id, p), h();
      }
    }), e.evt.on("onAfterNodeDrop", (s) => {
      s.isChangedParent && (o.value = j());
    });
    const N = ae(() => e.state.isLoaded ? e.model.rootVisible ? e.state.rootNodes : e.state.rootNodes.reduce((s, a) => a._children ? s.concat(a._children) : s, []) : []);
    U(N, (s, a) => {
      s !== a && (o.value = j());
    });
    const k = async (s, a) => {
      let c;
      if (s.level === 0)
        c = N.value, ibiz.log.debug("初始加载");
      else {
        const p = g(s.data._uuid, e);
        if (!p)
          return;
        p._children ? (ibiz.log.debug("节点展开加载-本地", p), c = p._children) : (ibiz.log.debug("节点展开加载-远程", p), c = await e.loadNodes(p));
      }
      ibiz.log.debug("给树返回值", c), a(C(c)), h();
    };
    let D = !1;
    e.evt.on("onLoadSuccess", () => {
      D = !0, setTimeout(() => {
        D = !1;
      }, 200);
    }), e.evt.on("onSelectionChange", async () => {
      var s;
      D && await ie(), e.state.singleSelect ? n.value.setCurrentKey(((s = e.state.selectedData[0]) == null ? void 0 : s._id) || void 0) : n.value.setCheckedKeys(e.state.selectedData.map((a) => a._id));
    });
    const L = (s, a) => {
      const {
        checkedNodes: c
      } = a;
      e.setSelection(c);
    };
    let _ = !1;
    const v = (s, a) => {
      var c, p;
      a.stopPropagation(), !_ && (((c = n.value) == null ? void 0 : c.getCurrentKey()) === s._id && l(), e.state.singleSelect || (p = n.value) == null || p.setCurrentKey(s._id), e.onTreeNodeClick(s, a), _ = !0, setTimeout(() => {
        _ = !1;
      }, 200));
    }, b = (s, a) => {
      a.stopPropagation(), e.onDbTreeNodeClick(s);
    }, T = x("IBizIcon"), P = (s, a) => {
      var p, E, B;
      if (!((E = (p = s == null ? void 0 : s.decontextMenu) == null ? void 0 : p.detoolbarItems) != null && E.length))
        return;
      const c = (B = a._deData) == null ? void 0 : B.srftype;
      return f("div", {
        class: t.b("context-menu")
      }, [s.decontextMenu.detoolbarItems.map((A) => A.userTag && c && c !== A.userTag || e.context.srfreadonly === !0 || e.context.srfreadonly === "true" ? null : f(x("el-button"), {
        text: !0,
        size: "small",
        onClick: (O) => {
          O.stopPropagation(), e.doUIAction(A.uiactionId, a, O, A.appId);
        },
        title: A.tooltip
      }, {
        default: () => [f(T, {
          icon: A.sysImage
        }, null)]
      }))]);
    }, w = (s, a) => {
      const c = g(s._uuid, e);
      if (!c)
        throw new R("没有找到_uuid为".concat(s._uuid, "的节点"));
      e.onExpandChange(c, a);
    }, y = H(() => {
      e.load();
    }, 500), K = (s) => {
      e.state.query = s, y();
    }, S = (s, a, c) => {
      const p = g(s.data._uuid, e), E = g(a.data._uuid, e);
      return e.calcAllowDrop(p, E, c);
    }, Q = (s) => {
      const a = g(s.data._uuid, e);
      return e.calcAllowDrag(a);
    }, G = (s, a, c) => {
      const p = ye(c), E = g(s.data._uuid, e), B = g(a.data._uuid, e);
      e.onNodeDrop(E, B, p);
    }, M = (s) => {
      (s.code === "F2" || s.code === "Enter") && l();
    };
    return re(() => {
      var s;
      (s = r.value) == null || s.$el.addEventListener("keydown", M);
    }), le(() => {
      var s;
      (s = r.value) == null || s.$el.removeEventListener("keydown", M);
    }), {
      c: e,
      ns: t,
      treeRef: n,
      treeviewRef: r,
      treeNodeTextInputRef: d,
      treeData: N,
      treeRefreshKey: o,
      editingNodeKey: i,
      editingNodeText: u,
      findNodeData: g,
      onCheck: L,
      onNodeClick: v,
      onNodeDbClick: b,
      loadData: k,
      renderContextMenu: P,
      updateNodeExpand: w,
      onInput: K,
      allowDrop: S,
      allowDrag: Q,
      handleDrop: G,
      onNodeTextEditBlur: m,
      renderDeNode: (s) => {
        const a = s._deData;
        return [a.srficon && f(T, {
          class: t.be("node", "icon"),
          icon: a.srficon
        }, null), f("span", {
          title: a.srfmajortext,
          class: t.be("node", "label")
        }, [a.srfmajortext])];
      }
    };
  },
  render() {
    const e = {
      searchbar: () => this.c.enableQuickSearch ? f(x("el-input"), {
        "model-value": this.c.state.query,
        class: [this.ns.b("quick-search"), this.ns.b("quick-search")],
        placeholder: this.c.state.placeHolder,
        onInput: this.onInput
      }, {
        prefix: () => f(x("ion-icon"), {
          class: this.ns.e("search-icon"),
          name: "search"
        }, null)
      }) : null
    }, t = this.c.controlPanel ? "tree" : "default", n = this.c.context.srfreadonly === !0 || this.c.context.srfreadonly === "true";
    return e[t] = () => {
      if (this.c.state.isLoaded && this.treeRefreshKey)
        return f(x("el-tree"), {
          ref: "treeRef",
          key: this.treeRefreshKey,
          "node-key": "_id",
          "highlight-current": !0,
          "expand-on-click-node": !1,
          "auto-expand-parent": !1,
          "show-checkbox": !this.c.state.singleSelect,
          "check-strictly": !0,
          "default-expanded-keys": this.c.state.expandedKeys,
          props: {
            label: "_text",
            children: "_children",
            isLeaf: "_leaf"
          },
          lazy: !0,
          load: this.loadData,
          onCheck: this.onCheck,
          onNodeExpand: (r) => {
            this.updateNodeExpand(r, !0);
          },
          onNodeCollapse: (r) => {
            this.updateNodeExpand(r, !1);
          },
          draggable: !n,
          "allow-drop": this.allowDrop,
          "allow-drag": this.allowDrag,
          onNodeDrop: this.handleDrop
        }, {
          default: ({
            data: r
          }) => {
            var l, m;
            const o = this.findNodeData(r._uuid, this.c);
            if (!o)
              return null;
            const d = this.c.getNodeModel(o._nodeId);
            if (this.editingNodeKey === o._id)
              return f("div", {
                class: [this.ns.b("node"), (l = d.sysCss) == null ? void 0 : l.cssName]
              }, [f(x("el-input"), {
                modelValue: this.editingNodeText,
                "onUpdate:modelValue": (h) => this.editingNodeText = h,
                ref: "treeNodeTextInputRef",
                class: this.ns.b("editing-node"),
                onBlur: () => {
                  this.onNodeTextEditBlur();
                },
                onKeydown: (h) => {
                  h.stopPropagation(), h.code === "Enter" && this.onNodeTextEditBlur();
                }
              }, null)]);
            const i = ee(d);
            let u;
            return i ? u = f(x("iBizControlShell"), {
              data: o,
              modelData: i,
              context: this.c.context,
              params: this.c.params
            }, null) : d.treeNodeType === "DE" ? u = this.renderDeNode(o) : u = [o._icon ? f(x("iBizIcon"), {
              class: this.ns.be("node", "icon"),
              icon: o._icon
            }, null) : null, o._textHtml ? f("span", {
              class: this.ns.be("node", "label"),
              innerHTML: o._textHtml
            }, null) : f("span", {
              class: this.ns.be("node", "label")
            }, [o._text])], f("div", {
              onDblclick: (h) => this.onNodeDbClick(o, h),
              onClick: (h) => this.onNodeClick(o, h),
              class: [this.ns.b("node"), (m = d.sysCss) == null ? void 0 : m.cssName, d.rootNode ? this.ns.bm("node", "root") : ""]
            }, [u, this.renderContextMenu(d, o)]);
          }
        });
    }, ce(f(x("iBizControlBase"), {
      ref: "treeviewRef",
      controller: this.c
    }, xe(e) ? e : {
      default: () => [e]
    }), [[de("loading"), this.c.state.isLoading]]);
  }
});
class De {
  constructor() {
    this.component = "IBizLogicTreeDesignTree";
  }
}
const W = "LogicTreeDesign", be = he(
  z,
  function(e) {
    e.component(z.name, z), te(
      "TREE_RENDER_".concat(W, "_Tree"),
      () => new De()
    );
  }
), Ee = {
  install(e) {
    const t = new _e();
    se(
      "DEUIACTION_".concat(W, "_AddLogic"),
      () => t
    ), e.use(be);
  }
};
export {
  Ee as default
};
