import './assets/style.css';
import { registerControlProvider as ye, getControlPanel as De, TreeController as _e, getChildNodeRSs as we, calcDeCodeNameById as V, handleAllSettled as Ie, Srfuf as Ee } from "@ibiz-template/runtime";
import { withInstall as xe, useControlController as be, useNamespace as oe } from "@ibiz-template/vue3-util";
import { defineComponent as Ce, computed as ae, reactive as Te, ref as A, watch as ne, nextTick as Me, resolveComponent as _, onMounted as ke, onUnmounted as Re, createVNode as f, withDirectives as Se, resolveDirective as Ke, isVNode as Ae, createTextVNode as ie } from "vue";
import { createUUID as de } from "qx-util";
import { debounce as se } from "lodash-es";
import { RuntimeModelError as le, RuntimeError as F, recursiveIterate as Oe } from "@ibiz-template/core";
import { isNil as re } from "ramda";
var Be = Object.defineProperty, Fe = (e, t, n) => t in e ? Be(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, O = (e, t, n) => (Fe(e, typeof t != "symbol" ? t + "" : t, n), n);
const Pe = (e) => {
  let t = e;
  const n = /* @__PURE__ */ new Set();
  for (; t && (typeof t == "object" || typeof t == "function") && !n.has(t); ) {
    if (n.add(t), typeof t.showContextMenu == "function")
      return t;
    if (t.default && t.default !== t) {
      t = t.default;
      continue;
    }
    if (t.v && t.v !== t) {
      t = t.v;
      continue;
    }
    break;
  }
};
function I(e, t) {
  return t.state.items.find((a) => a._id === e) || t.state.items.find((a) => a._uuid === e);
}
function Le(e, t) {
  const n = () => {
    const d = e.value;
    if (!d)
      throw new F("找不到el-tree实例对象");
    return d;
  }, a = () => {
    var d;
    const p = e.value;
    if (!p) {
      setTimeout(() => {
        a();
      }, 200);
      return;
    }
    Object.values(p.store.nodesMap).forEach((u) => {
      const v = t.state.expandedKeys.includes(u.data._id);
      v !== u.expanded && (v ? u.expand() : u.collapse());
    }), t.state.singleSelect ? e.value.setCurrentKey(((d = t.state.selectedData[0]) == null ? void 0 : d._id) || void 0) : p.setCheckedKeys(t.state.selectedData.map((u) => u._id));
  }, s = se(a, 500);
  return { getTreeInstance: n, updateUI: s, triggerNodeExpand: (d) => {
    const p = n(), u = p == null ? void 0 : p.store.nodesMap[d];
    if (u)
      return u.expanded ? (u.collapse(), !1) : (u.expand(), !0);
  } };
}
function je(e) {
  switch (e) {
    case "inner":
      return "inner";
    case "before":
      return "prev";
    case "after":
      return "next";
    default:
      throw new F("暂不支持dropType:".concat(e));
  }
}
class ze extends _e {
  constructor() {
    super(...arguments), O(this, "bottomToolbar"), O(this, "hiddenNodeId", ""), O(this, "renderMode", "tree"), O(this, "isFilter", A(!1));
  }
  /**
   * 重新初始化
   *
   * @protected
   * @return {*}  {Promise<void>}
   * @memberof GroupTreeController
   */
  async onCreated() {
    var t;
    await super.onCreated();
    const n = ((t = this.view.model.viewLayoutPanel) == null ? void 0 : t.controls) || [];
    this.bottomToolbar = n.find((s) => s.name === "toolbar");
    const { ctrlParams: a = {} } = this.model.controlParam;
    a.HIDDENNODEID && (this.hiddenNodeId = a.HIDDENNODEID), a.RENDERMODE && (this.renderMode = a.RENDERMODE);
  }
  initState() {
    super.initState(), this.state.newingNodeModel = null, this.state.newingNodeText = null, this.state.newingNodeDefault = null, this.state.editingNodeKey = null, this.state.editingNodeText = null, this.state.editingNodeDefault = null;
  }
  /**
   *  初始化节点拖入关系处理
   */
  initDropNodeRss() {
    var t;
    (t = this.model.detreeNodes) == null || t.forEach((n) => {
      if (!n.allowDrop)
        return;
      const a = [];
      we(this.model, {
        parentId: n.id,
        hasQuery: !1
      }).forEach((s) => {
        var d;
        if ((d = s.parentDER1N) != null && d.pickupDEFName) {
          const p = this.getNodeModel(s.childDETreeNodeId);
          (p == null ? void 0 : p.treeNodeType) === "DE" && p.appDataEntityId && a.push({
            minorEntityId: p.appDataEntityId,
            pickupDEFName: s.parentDER1N.pickupDEFName.toLowerCase(),
            childDETreeNodeId: s.childDETreeNodeId,
            detreeNodeRSParams: s.detreeNodeRSParams
          });
        }
      }), a.length > 0 && this.dropNodeRss.set(n.id, a);
    });
  }
  /**
   * 编辑指定节点的文本
   * @author ljx
   * @date 2023-12-27 05:46:02
   * @return {*}  {void}
   */
  updateTreeNode({
    nodeKey: t,
    defaultValue: n
  }) {
    const a = this.context.srfreadonly === !0 || this.context.srfreadonly === "true";
    if (!t || t === this.state.editingNodeKey || a)
      return;
    const s = I(t, this), d = this.getNodeModel(s._nodeId);
    d != null && d.allowEditText && (this.state.editingNodeKey = s._id, this.state.editingNodeText = s._text, this.state.editingNodeDefault = n, this.state.newingNodeModel = null, this.state.newingNodeText = null, this.state.newingNodeDefault = null);
  }
  /**
   * 删除指定节点
   * @author ljx
   * @date 2023-12-27 05:46:02
   * @return {*}  {void}
   */
  removeTreeNode(t) {
    if (!t || t === this.state.editingNodeKey)
      return;
    const n = I(t, this), a = {
      context: this.context || {},
      params: this.params || {},
      data: [n]
    };
    this.onRemoveTreeNode(a);
  }
  /**
   * 新建树节点
   * @author ljx
   * @date 2023-12-27 05:46:02
   * @return {*}  {void}
   */
  newTreeNode({
    nodeType: t,
    defaultValue: n = {}
  }) {
    const a = this.getNodeModel(t);
    this.state.newingNodeModel = a, this.state.newingNodeDefault = n, this.state.editingNodeKey = null, this.state.editingNodeText = null, this.state.editingNodeDefault = null;
  }
  /**
   * 创建实体节点数据
   * @author ljx
   * @date 2023-12-27 04:19:36
   * @protected
   * @param {ITreeNodeData[]} nodeDatas 节点数据集合
   * @return {*}  {Promise<void>}
   */
  async createDeNodeData(t) {
    const n = ibiz.hub.getApp(this.context.srfappid);
    await Promise.all(
      t.map(async (a) => {
        const s = this.getNodeModel(a._nodeId), d = a._deData, p = this.context.clone(), u = await n.deService.exec(
          s.appDataEntityId,
          "create",
          p,
          d
        );
        this.emitDEDataChange("create", u.data), u.data && this.refresh();
      })
    );
  }
  /**
   * 创建树节点
   * @author ljx
   * @date 2023-12-27 04:32:52
   * @return {*}  {Promise<void>}
   */
  async onCreateTreeNode() {
    const { textAppDEFieldId: t, id: n } = this.state.newingNodeModel, a = this.state.newingNodeText, s = { _deData: {} };
    Object.assign(s, { _nodeId: n, _text: a }), Object.assign(s._deData, { [t]: a }), this.state.newingNodeDefault && Object.assign(s._deData, this.state.newingNodeDefault), Object.assign(s._deData, { [t]: a }), await this.createDeNodeData([s]), this.state.newingNodeModel = null, this.state.newingNodeText = null, this.state.newingNodeDefault = null;
  }
  /**
   * 修改节点文本
   * @param nodeData 节点数据
   * @param _text 节点文本
   */
  async onModifyTreeNode(t, n) {
    const a = this.getNodeModel(t._nodeId);
    if (!a.allowEditText)
      throw new le(a, "树节点没有配置编辑模式：名称");
    if (t._nodeType !== "DE")
      throw new F("不是实体树节点数据");
    if (t._text !== n) {
      if (t._text = n, this.state.editingNodeDefault) {
        const s = Object.keys(this.state.editingNodeDefault);
        s && s.length > 0 && s.forEach((d) => {
          re(t._deData[d]) && (t._deData[d] = this.state.editingNodeDefault[d]);
        });
      }
      await this.updateDeNodeData([t]);
    }
    this.state.editingNodeKey = null, this.state.editingNodeText = null, this.state.editingNodeDefault = null;
  }
  /**
   * 删除树节点
   * @param args 参数
   * @returns
   */
  async onRemoveTreeNode(t) {
    const { context: n, params: a, data: s } = this.handlerAbilityParams(t), d = this.getNodeModel(s[0]._nodeId);
    if ((t == null ? void 0 : t.silent) !== !0 && !await ibiz.confirm.error({
      title: "数据删除",
      desc: "确认删除数据？"
    }))
      return;
    await this._evt.emit("onBeforeRemove", void 0), await this.startLoading();
    let p = !1;
    try {
      const u = V(
        d.appDataEntityId
      );
      await Ie(
        s.map(async (v) => {
          if (v.srfuf !== Ee.CREATE) {
            const N = n.clone();
            N[u] = v.srfkey, await ibiz.hub.getApp(d.appId).deService.exec(
              d.appDataEntityId,
              "remove",
              N,
              a
            ), p = !0;
          }
          this.afterRemove(v);
        })
      ), (t == null ? void 0 : t.silent) !== !0 && this.actionNotification("REMOVESUCCESS", {
        data: s,
        default: "数据[".concat(s.map((v) => v.srfmajortext).join("、"), "]删除成功!")
      }), p && !(t != null && t.notRefresh) && await this.refresh();
    } catch (u) {
      throw await this._evt.emit("onRemoveError", void 0), this.actionNotification("REMOVEERROR", {
        error: u,
        data: s
      }), u;
    } finally {
      await this.endLoading();
    }
    this.state.selectedData = [], await this._evt.emit("onRemoveSuccess", void 0), s.forEach((u) => {
      this.emitDEDataChange("remove", u._deData);
    });
  }
  /**
   * 计算是否允许拖入
   * @param draggingNode
   * @param dropNode
   * @param type
   * @returns
   */
  calcAllowDrop(t, n, a) {
    var s, d;
    let p = !0;
    if (Oe(
      { _children: [t] },
      (N) => {
        if (N._id === n._id)
          return p = !1, !0;
      },
      { childrenFields: ["_children"] }
    ), !p)
      return !1;
    const u = this.getNodeModel(t._nodeId), v = this.getNodeModel(n._nodeId);
    if (a === "inner")
      return !!this.findDropNodeRS(
        n._nodeId,
        u.appDataEntityId
      );
    if (u.appDataEntityId !== v.appDataEntityId)
      return !1;
    if (((s = t._parent) == null ? void 0 : s._id) === ((d = n._parent) == null ? void 0 : d._id)) {
      const N = this.getNodeModel(n._nodeId);
      return (N == null ? void 0 : N.allowOrder) === !0;
    }
    return n._parent ? n._parent && n._parent._id && this.getNodeModel(n._parent._nodeId).rootNode ? !0 : !!this.findDropNodeRS(
      n._parent._nodeId,
      u.appDataEntityId
    ) : !1;
  }
  /**
   * 处理节点拖入事件
   * @param draggingNode
   * @param dropNode
   * @param dropType
   */
  async onNodeDrop(t, n, a) {
    var s, d;
    a === "inner" && !n._leaf && n._children === void 0 && await this.expandNodeByKey([n._id]);
    const p = this.getNodeModel(t._nodeId), u = a === "inner" ? n : n._parent, v = a === "inner" || ((s = n._parent) == null ? void 0 : s._id) !== ((d = t._parent) == null ? void 0 : d._id);
    let N = this.getNodeModel(n._nodeId);
    const P = p.appDataEntityId !== N.appDataEntityId;
    let k = !1;
    if (this.getNodeModel(u._nodeId).rootNode && (k = !0), v || k) {
      const x = [];
      for (const m of this.dropNodeRss.values())
        x.push(
          ...m.filter((g) => (
            // 修复子关系情况，根上也存在当前实体数据
            g.minorEntityId === p.appDataEntityId
          ))
        );
      if (k && v)
        x && (x.forEach((m) => {
          t._deData[m.pickupDEFName] = null;
        }), N = this.getNodeModel(p.id));
      else {
        const m = this.findDropNodeRS(
          u._nodeId,
          p.appDataEntityId
        );
        m && (x && x.forEach((g) => {
          t._deData[g.pickupDEFName] = null;
        }), t._deData[m.pickupDEFName] = u._value, m.detreeNodeRSParams && m.detreeNodeRSParams.forEach((g) => {
          var M, T;
          g.name && g.value && (M = t._deData) != null && M.hasOwnProperty(
            g.name.toLowerCase()
          ) && (T = u._deData) != null && T.hasOwnProperty(g.value.toLowerCase()) && (t._deData[g.name.toLowerCase()] = u._deData[g.value.toLowerCase()]);
        }), N = this.getNodeModel(m.childDETreeNodeId));
      }
      this.state.expandedKeys = this.calcExpandedKeys([u]), await this.updateDeNodeData([t]);
    }
    if (a === "inner" || P)
      v && await this.refreshNodeChildren(t, !0), await this.refreshNodeChildren(u, !0);
    else {
      const { moveAppDEActionId: x, appDataEntityId: m, allowOrder: g } = N;
      if (g) {
        if (!x)
          throw new le(
            this.model,
            ibiz.i18n.t("runtime.controller.common.md.noMoveDataCconfig")
          );
        const M = {
          srftargetkey: n.srfkey,
          srfmovetype: a === "prev" ? "MOVEBEFORE" : "MOVEAFTER"
        }, T = ibiz.hub.getApp(this.context.srfappid), B = V(m), R = this.context.clone();
        R[B] = t.srfkey, (await T.deService.exec(
          m,
          x,
          R,
          M
        )).ok && (this.emitDEDataChange("update", t._deData), v && await this.refreshNodeChildren(t, !0), await this.refreshNodeChildren(u));
      }
    }
    this.state.selectedData = [];
  }
  /**
   * 检测实体数据变更
   *
   * @author tony001
   * @date 2024-03-29 11:03:30
   * @protected
   * @param {IPortalMessage} msg
   * @return {*}  {void}
   */
  onDEDataChange(t) {
    var n;
    if (t.triggerKey === this.triggerKey)
      return;
    const a = t.data;
    if (t.subtype === "OBJECTCREATED") {
      (n = this.model.detreeNodes) != null && n.find((d) => {
        if (d.appDataEntityId) {
          const p = V(d.appDataEntityId);
          if (a.srfdecodename === p)
            return !0;
        }
        return !1;
      }) && this.refresh();
      return;
    }
    const s = this.state.items.find(
      (d) => d._nodeType === "DE" && d._deData && d._deData.srfdecodename === a.srfdecodename && d._deData.srfkey === a.srfkey
    );
    s && this.doNextActive(() => this.refreshNodeChildren(s, !0), {
      key: "refresh".concat(s._id)
    });
  }
  async afterLoad(t, n) {
    return super.afterLoad(t, n);
  }
  /**
   * 重写节点点击事件
   *
   * @param {ITreeNodeData} nodeData
   * @param {MouseEvent} event
   * @return {*}  {Promise<void>}
   * @memberof GroupTreeController
   */
  async onTreeNodeClick(t, n) {
    var a;
    const s = (a = this.contextMenuInfos[t._nodeId]) == null ? void 0 : a.clickTBUIActionItem;
    if (s)
      return this.doUIAction(
        s.uiactionId,
        t,
        n,
        s.appId
      );
    if (this.state.navigational) {
      const d = this.getNodeModel(t._nodeId);
      if (!(d != null && d.navAppViewId))
        return;
    }
    this.state.singleSelect && !t._disableSelect && this.setSelection([t]), this.state.mdctrlActiveMode === 1 && await this.setActive(t);
  }
  /**
   * 过滤节点
   *
   * @param {string} nodeTag
   * @memberof GroupTreeController
   */
  async changeTreeState(t) {
    t && t === "draft" ? (this.isFilter.value = !0, this.evt.emit("onFilterNode", { nodeTag: t })) : this.resetTreeState();
  }
  /**
   *  重置过滤状态
   *
   * @author tony001
   * @date 2024-04-12 15:04:44
   * @param {boolean} state
   */
  resetTreeState() {
    this.isFilter.value && (this.evt.emit("onResetSate", {}), this.isFilter.value = !1);
  }
  /**
   * 重写刷新
   *
   * @author tony001
   * @date 2024-04-12 15:04:53
   * @return {*}  {Promise<void>}
   */
  async refresh() {
    super.refresh(), this.resetTreeState();
  }
}
function Ve(e) {
  return typeof e == "function" || Object.prototype.toString.call(e) === "[object Object]" && !Ae(e);
}
const U = /* @__PURE__ */ Ce({
  name: "IBizGroupTreeControl",
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
    mdctrlActiveMode: {
      type: Number,
      default: void 0
    },
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
    const e = be((...o) => new ze(...o)), t = ae(() => e.context.srfreadonly === !0 || e.context.srfreadonly === "true"), n = Te({});
    e.evt.on("onCreated", () => {
      e.counter && e.counter.onChange((o) => {
        Object.assign(n, o);
      }, !0);
    });
    const a = oe("control-group-tree"), s = oe("control-".concat(e.model.controlType.toLowerCase())), d = A(null), p = A(null), u = A(""), v = A(null);
    ne(() => v.value, (o) => {
      o && o.$el.getElementsByTagName("input")[0].focus();
    });
    const N = async () => {
      if (e.state.editingNodeKey)
        if (e.state.editingNodeText) {
          const o = I(e.state.editingNodeKey, e);
          await e.onModifyTreeNode(o, e.state.editingNodeText);
        } else
          e.state.editingNodeKey = null;
      e.state.newingNodeText ? e.onCreateTreeNode() : e.state.newingNodeModel = null;
    }, P = async () => {
      e.state.editingNodeKey && (e.state.editingNodeKey = null), e.state.newingNodeModel && (e.state.newingNodeModel = null, e.state.newingNodeText = "");
    }, {
      updateUI: k,
      triggerNodeExpand: x
    } = Le(d, e), m = (o) => o.map((i) => ({
      _id: i._id,
      _uuid: i._uuid,
      _leaf: i._leaf,
      _text: i._text
    }));
    e.evt.on("onAfterRefreshParent", (o) => {
      if (d.value) {
        const {
          parentNode: i,
          children: r
        } = o, l = m(r);
        d.value.updateKeyChildren(i._id, l), k();
      }
    }), e.evt.on("onAfterNodeDrop", (o) => {
      o.isChangedParent && (u.value = de());
    });
    const g = ae(() => e.state.isLoaded ? e.model.rootVisible ? e.state.rootNodes : e.state.rootNodes.reduce((o, i) => i._children ? o.concat(i._children) : o, []) : []);
    ne(g, (o, i) => {
      o !== i && (u.value = de());
    });
    const M = async (o, i) => {
      let r;
      if (o.level === 0)
        r = g.value, ibiz.log.debug("初始加载");
      else {
        const l = I(o.data._uuid, e);
        l._children ? (ibiz.log.debug("节点展开加载-本地", l), r = l._children) : (ibiz.log.debug("节点展开加载-远程", l), r = await e.loadNodes(l));
      }
      ibiz.log.debug("给树返回值", r), i(m(r)), k();
    };
    let T = !1;
    e.evt.on("onLoadSuccess", () => {
      T = !0, setTimeout(() => {
        T = !1;
      }, 200);
    }), e.evt.on("onSelectionChange", async () => {
      var o;
      T && await Me(), e.state.singleSelect ? d.value.setCurrentKey(((o = e.state.selectedData[0]) == null ? void 0 : o._id) || void 0) : d.value.setCheckedKeys(e.state.selectedData.map((i) => i._id));
    });
    const B = (o, i) => {
      const {
        checkedNodes: r
      } = i;
      e.setSelection(r);
    };
    let R = !1;
    const G = (o, i) => {
      var r, l, h;
      if (i.stopPropagation(), !o._disableSelect && !R) {
        if (((r = d.value) == null ? void 0 : r.getCurrentKey()) === o._id && !t.value) {
          const c = (l = d.value) == null ? void 0 : l.getCurrentKey();
          e.updateTreeNode({
            nodeKey: c,
            defaultValue: {}
          });
        }
        if (e.state.singleSelect || (h = d.value) == null || h.setCurrentKey(o._id), e.state.navigational) {
          const c = e.getNodeModel(o._nodeId);
          if (!(c != null && c.navAppViewId)) {
            const y = x(o._id);
            e.onExpandChange(o, y);
          }
        }
        e.onTreeNodeClick(o, i), R = !0, setTimeout(() => {
          R = !1;
        }, 200);
      }
    }, H = (o, i) => {
      i.stopPropagation(), !o._disableSelect && e.onDbTreeNodeClick(o);
    };
    let E;
    e.evt.on("onMounted", () => {
      Object.values(e.contextMenus).length > 0 && (() => import("@imengyu/vue3-context-menu"))().then((o) => {
        E = Pe(o);
      });
    });
    const ue = _("IBizRawItem"), K = _("IBizIcon"), q = (o, i, r, l) => {
      const h = [];
      return o.forEach((c) => {
        var y, w;
        if (c.itemType === "SEPERATOR") {
          h.push({
            divided: "self"
          });
          return;
        }
        const z = l[c.id];
        if (z && !z.visible || c.actionLevel > 100)
          return;
        let D = {};
        if (c.showCaption && c.caption && (D.label = c.caption), c.sysImage && c.showIcon && (D.icon = f(K, {
          icon: c.sysImage
        }, null)), c.itemType === "DEUIACTION") {
          D.disabled = z.disabled, D.clickClose = !0;
          const {
            uiactionId: b
          } = c;
          b && (D.onClick = () => {
            e.doUIAction(b, i, r, c.appId);
          });
        } else if (c.itemType === "RAWITEM") {
          const {
            rawItem: b
          } = c;
          b && (D.label = f(ue, {
            rawItem: c
          }, null));
        } else if (c.itemType === "ITEMS") {
          (y = c.detoolbarItems) != null && y.length && (D.children = q(c.detoolbarItems, i, r, l));
          const b = c;
          if (b.uiactionGroup && b.groupExtractMode) {
            const S = (w = b.uiactionGroup.uiactionGroupDetails) == null ? void 0 : w.filter((C) => l[C.id].visible).map((C) => {
              const ge = l[C.id], {
                sysImage: me
              } = C;
              return {
                label: C.showCaption ? C.caption : void 0,
                icon: C.showIcon ? f(K, {
                  icon: me
                }, null) : void 0,
                disabled: ge.disabled,
                clickableWhenHasChildren: !0,
                onClick: () => {
                  var te;
                  (te = E == null ? void 0 : E.closeContextMenu) == null || te.call(E), e.doUIAction(C.uiactionId, i, r, C.appId);
                }
              };
            });
            switch (b.groupExtractMode) {
              case "ITEMS":
                D.children = S;
                break;
              case "ITEMX":
                S && (D = S[0], D.children = S.slice(1));
                break;
              case "ITEM":
              default:
                D = void 0, S && h.push(...S);
                break;
            }
          }
        }
        D && h.push(D);
      }), h;
    }, $ = async (o, i) => {
      var y;
      i.preventDefault(), i.stopPropagation();
      const r = e.getNodeModel(o._nodeId);
      if (!(r != null && r.decontextMenu))
        return;
      const l = e.contextMenus[r.decontextMenu.id];
      if (!l.model.detoolbarItems)
        return;
      await l.calcButtonState(o._deData || (o.srfkey ? o : void 0), r.appDataEntityId);
      const h = l.state.buttonsState, c = q(l.model.detoolbarItems, o, i, h);
      c.length && ((y = E == null ? void 0 : E.showContextMenu) == null || y.call(E, {
        x: i.x,
        y: i.y,
        customClass: a.b("context-menu"),
        items: c
      }));
    }, Q = (o, i) => {
      var r, l;
      if (!((l = (r = o == null ? void 0 : o.decontextMenu) == null ? void 0 : r.detoolbarItems) != null && l.length))
        return;
      const h = e.contextMenuInfos[o.id];
      return h.clickTBUIActionItem && h.onlyOneActionItem ? null : f(_("iBizContextMenuControl"), {
        modelData: o.decontextMenu,
        groupLevelKeys: [50, 100],
        nodeModel: o,
        nodeData: i,
        context: e.context,
        onActionClick: (c, y) => e.doUIAction(c.uiactionId, i, y, c.appId)
      }, null);
    }, L = (o, i) => {
      const r = I(o._uuid, e);
      if (!r)
        throw new F("没有找到_uuid为".concat(o._uuid, "的节点"));
      e.onExpandChange(r, i);
    }, ce = se(() => {
      e.load();
    }, 500), pe = (o) => {
      e.state.query = o, ce();
    }, W = (o, i, r) => {
      const l = I(o.data._uuid, e), h = I(i.data._uuid, e);
      return e.calcAllowDrop(l, h, r);
    }, X = (o) => {
      const i = I(o.data._uuid, e);
      return e.calcAllowDrag(i);
    }, J = (o, i, r) => {
      const l = je(r), h = I(o.data._uuid, e), c = I(i.data._uuid, e);
      e.onNodeDrop(h, c, l);
    }, j = (o) => {
      (o.key === "Enter" || o.keyCode === 13) && (o.stopPropagation(), N()), (o.key === "Escape" || o.keyCode === 27) && (o.stopPropagation(), P());
    }, Y = (o) => {
      var i;
      if (o.code === "F2" || o.code === "Enter") {
        const r = (i = d.value) == null ? void 0 : i.getCurrentKey();
        e.updateTreeNode(r);
      }
    }, he = async () => {
      e.evt.emit("onBack", {}), e.isFilter.value = !1, d.value && d.value.filter("");
    };
    ke(() => {
      var o;
      (o = p.value) == null || o.$el.addEventListener("keydown", Y), e.evt.on("onFilterNode", async (i) => {
        const {
          nodeTag: r
        } = i;
        r && (e.isFilter.value = !0), d.value && d.value.filter("".concat(r, "@"));
      }), e.evt.on("onResetSate", async () => {
        e.evt.emit("onBack", {}), e.isFilter.value = !1, d.value && d.value.filter("");
      }), e.evt.on("onLoadSuccess", () => {
        e.isFilter.value ? e.evt.emit("onFilterNode", {
          nodeTag: "draft"
        }) : e.evt.emit("onResetSate", {});
      });
    }), Re(() => {
      var o;
      (o = p.value) == null || o.$el.removeEventListener("keydown", Y);
    });
    const fe = (o, i) => (i._id || "").includes(o), ve = (o) => o._id === "root:draft_parent" ? "draft_parent" : null, Z = (o) => {
      if (o.counterId) {
        const i = n[o.counterId];
        return re(i) || o.counterMode === 1 && i === 0 ? null : f("div", {
          class: a.em("counter", "box")
        }, [f("span", {
          class: a.e("dot")
        }, [ie("·")]), f(_("iBizBadge"), {
          class: a.e("counter"),
          value: i
        }, null)]);
      }
    }, Ne = () => e.isFilter.value ? f("div", {
      class: a.b("filter")
    }, [f("div", {
      class: a.be("filter", "header"),
      onClick: he
    }, [f(_("ion-icon"), {
      name: "arrow-back-outline"
    }, null), ie("返回")])]) : null, ee = (o) => {
      var i, r;
      if (!e.state.newingNodeModel)
        return null;
      const {
        parent_id: l
      } = e.state.newingNodeDefault || {};
      if (l) {
        if (!o)
          return null;
        const {
          _value: h
        } = o || {};
        if (h !== l)
          return null;
      }
      return !l && o ? null : f("div", {
        class: [a.be("node", "newing")]
      }, [(i = e.state.newingNodeModel) != null && i.sysImage ? f(K, {
        class: a.be("node", "icon"),
        icon: (r = e.state.newingNodeModel) == null ? void 0 : r.sysImage
      }, null) : null, f(_("el-input"), {
        modelValue: e.state.newingNodeText,
        "onUpdate:modelValue": (h) => e.state.newingNodeText = h,
        ref: "treeNodeTextInputRef",
        class: a.b("editing-node"),
        onBlur: N,
        onKeydown: (h) => {
          j(h);
        }
      }, null)]);
    };
    return {
      c: e,
      ns: a,
      treeRef: d,
      treeviewRef: p,
      treeNodeTextInputRef: v,
      treeData: g,
      treeRefreshKey: u,
      findNodeData: I,
      handleEditKeyDown: j,
      onCheck: B,
      onNodeClick: G,
      onNodeDbClick: H,
      onNodeContextmenu: $,
      loadData: M,
      renderContextMenu: Q,
      renderCounter: Z,
      updateNodeExpand: L,
      onInput: pe,
      allowDrop: W,
      allowDrag: X,
      handleDrop: J,
      onNodeTextEditBlur: N,
      renderTree: () => f("div", {
        class: [a.b("content"), a.is("filter", e.isFilter.value)]
      }, [Ne(), f("div", {
        class: [a.b("tree-box"), a.is("filter", e.isFilter.value)]
      }, [f(_("el-tree"), {
        ref: "treeRef",
        key: u.value,
        class: [s.b("tree"), a.is("list-tree", e.renderMode === "listTree")],
        "node-key": "_id",
        "highlight-current": !0,
        "expand-on-click-node": !1,
        "auto-expand-parent": !1,
        "show-checkbox": !e.state.singleSelect,
        "check-strictly": !0,
        "default-expanded-keys": e.state.expandedKeys,
        props: {
          label: "_text",
          children: "_children",
          isLeaf: "_leaf",
          class: ve
        },
        lazy: !0,
        load: M,
        onCheck: B,
        onNodeExpand: (o) => {
          L(o, !0);
        },
        onNodeCollapse: (o) => {
          L(o, !1);
        },
        draggable: !t.value,
        "allow-drop": W,
        "allow-drag": X,
        onNodeDrop: J,
        "filter-node-method": fe
      }, {
        default: ({
          data: o
        }) => {
          var i, r;
          const l = I(o._uuid, e);
          if (!l)
            return null;
          const h = e.getNodeModel(l._nodeId);
          if (e.state.editingNodeKey === l._id && !t.value)
            return f("div", {
              class: [a.b("node"), (i = h.sysCss) == null ? void 0 : i.cssName]
            }, [l._icon ? f(K, {
              class: a.be("node", "icon"),
              icon: l._icon
            }, null) : null, f(_("el-input"), {
              modelValue: e.state.editingNodeText,
              "onUpdate:modelValue": (w) => e.state.editingNodeText = w,
              ref: "treeNodeTextInputRef",
              class: a.b("editing-node"),
              onBlur: () => {
                N();
              },
              onKeydown: (w) => {
                j(w);
              }
            }, null)]);
          const c = De(h);
          let y;
          return c ? y = f(_("iBizControlShell"), {
            data: l,
            modelData: c,
            context: e.context,
            params: e.params
          }, null) : y = [l._icon ? f(K, {
            class: a.be("node", "icon"),
            icon: l._icon
          }, null) : null, l._textHtml ? f("span", {
            class: a.be("node", "label"),
            innerHTML: l._textHtml
          }, null) : f("span", {
            class: a.be("node", "label")
          }, [l._text])], [f("div", {
            onDblclick: (w) => H(l, w),
            onClick: (w) => G(l, w),
            onContextmenu: (w) => $(l, w),
            class: [a.b("node"), a.is("hidden", Object.is(e.hiddenNodeId, l._nodeId) && !e.isFilter.value), l._leaf ? a.be("node", "item") : a.be("node", "group"), (r = h.sysCss) == null ? void 0 : r.cssName]
          }, [y, Z(h), Q(h, l)]), ee(l)];
        }
      }), ee()])])
    };
  },
  render() {
    const e = {
      searchbar: () => this.c.enableQuickSearch ? f(_("el-input"), {
        "model-value": this.c.state.query,
        class: this.ns.b("quick-search"),
        placeholder: this.c.state.placeHolder,
        onInput: this.onInput
      }, {
        prefix: () => f(_("ion-icon"), {
          class: this.ns.e("search-icon"),
          name: "search"
        }, null)
      }) : null
    };
    this.c.bottomToolbar && (e.toolbar = () => f(_("iBizControlShell"), {
      modelData: this.c.bottomToolbar,
      context: this.c.context,
      params: this.c.params
    }, null));
    const t = this.c.controlPanel ? "tree" : "default";
    return e[t] = () => {
      if (this.c.state.isLoaded && this.treeRefreshKey)
        return this.renderTree();
    }, Se(f(_("iBizControlBase"), {
      ref: "treeviewRef",
      controller: this.c
    }, Ve(e) ? e : {
      default: () => [e]
    }), [[Ke("loading"), this.c.state.isLoading]]);
  }
});
class Ue {
  constructor() {
    O(this, "component", "IBizGroupTreeControl");
  }
}
const Je = xe(
  U,
  function(e) {
    e.component(U.name, U), ye(
      "TREE_RENDER_GROUP_TREE",
      () => new Ue()
    );
  }
);
export {
  Je as IBizGroupTreeControl,
  Je as default
};
