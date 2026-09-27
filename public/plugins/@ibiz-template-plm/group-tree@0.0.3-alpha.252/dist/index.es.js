import './assets/style.css';
import './assets/style.css';
import { registerControlProvider as me, getControlPanel as ye, TreeController as De, getChildNodeRSs as _e, calcDeCodeNameById as V, handleAllSettled as we, Srfuf as Ie } from "@ibiz-template/runtime";
import { withInstall as Ee, useControlController as xe, useNamespace as te } from "@ibiz-template/vue3-util";
import { defineComponent as be, computed as oe, reactive as Te, ref as A, watch as ae, nextTick as Ce, resolveComponent as D, onMounted as Me, onUnmounted as ke, createVNode as f, withDirectives as Re, resolveDirective as Se, isVNode as Ke, createTextVNode as ne } from "vue";
import { createUUID as ie } from "qx-util";
import { debounce as le } from "lodash-es";
import { RuntimeModelError as de, RuntimeError as F, recursiveIterate as Ae } from "@ibiz-template/core";
import { isNil as se } from "ramda";
var Oe = Object.defineProperty, Be = (e, o, n) => o in e ? Oe(e, o, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[o] = n, O = (e, o, n) => (Be(e, typeof o != "symbol" ? o + "" : o, n), n);
function w(e, o) {
  return o.state.items.find((a) => a._id === e) || o.state.items.find((a) => a._uuid === e);
}
function Fe(e, o) {
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
      const v = o.state.expandedKeys.includes(u.data._id);
      v !== u.expanded && (v ? u.expand() : u.collapse());
    }), o.state.singleSelect ? e.value.setCurrentKey(((d = o.state.selectedData[0]) == null ? void 0 : d._id) || void 0) : p.setCheckedKeys(o.state.selectedData.map((u) => u._id));
  }, s = le(a, 500);
  return { getTreeInstance: n, updateUI: s, triggerNodeExpand: (d) => {
    const p = n(), u = p == null ? void 0 : p.store.nodesMap[d];
    if (u)
      return u.expanded ? (u.collapse(), !1) : (u.expand(), !0);
  } };
}
function Pe(e) {
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
class Le extends De {
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
    var o;
    await super.onCreated();
    const n = ((o = this.view.model.viewLayoutPanel) == null ? void 0 : o.controls) || [];
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
    var o;
    (o = this.model.detreeNodes) == null || o.forEach((n) => {
      if (!n.allowDrop)
        return;
      const a = [];
      _e(this.model, {
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
    nodeKey: o,
    defaultValue: n
  }) {
    const a = this.context.srfreadonly === !0 || this.context.srfreadonly === "true";
    if (!o || o === this.state.editingNodeKey || a)
      return;
    const s = w(o, this), d = this.getNodeModel(s._nodeId);
    d != null && d.allowEditText && (this.state.editingNodeKey = s._id, this.state.editingNodeText = s._text, this.state.editingNodeDefault = n, this.state.newingNodeModel = null, this.state.newingNodeText = null, this.state.newingNodeDefault = null);
  }
  /**
   * 删除指定节点
   * @author ljx
   * @date 2023-12-27 05:46:02
   * @return {*}  {void}
   */
  removeTreeNode(o) {
    if (!o || o === this.state.editingNodeKey)
      return;
    const n = w(o, this), a = {
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
    nodeType: o,
    defaultValue: n = {}
  }) {
    const a = this.getNodeModel(o);
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
  async createDeNodeData(o) {
    const n = ibiz.hub.getApp(this.context.srfappid);
    await Promise.all(
      o.map(async (a) => {
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
    const { textAppDEFieldId: o, id: n } = this.state.newingNodeModel, a = this.state.newingNodeText, s = { _deData: {} };
    Object.assign(s, { _nodeId: n, _text: a }), Object.assign(s._deData, { [o]: a }), this.state.newingNodeDefault && Object.assign(s._deData, this.state.newingNodeDefault), Object.assign(s._deData, { [o]: a }), await this.createDeNodeData([s]), this.state.newingNodeModel = null, this.state.newingNodeText = null, this.state.newingNodeDefault = null;
  }
  /**
   * 修改节点文本
   * @param nodeData 节点数据
   * @param _text 节点文本
   */
  async onModifyTreeNode(o, n) {
    const a = this.getNodeModel(o._nodeId);
    if (!a.allowEditText)
      throw new de(a, "树节点没有配置编辑模式：名称");
    if (o._nodeType !== "DE")
      throw new F("不是实体树节点数据");
    if (o._text !== n) {
      if (o._text = n, this.state.editingNodeDefault) {
        const s = Object.keys(this.state.editingNodeDefault);
        s && s.length > 0 && s.forEach((d) => {
          se(o._deData[d]) && (o._deData[d] = this.state.editingNodeDefault[d]);
        });
      }
      await this.updateDeNodeData([o]);
    }
    this.state.editingNodeKey = null, this.state.editingNodeText = null, this.state.editingNodeDefault = null;
  }
  /**
   * 删除树节点
   * @param args 参数
   * @returns
   */
  async onRemoveTreeNode(o) {
    const { context: n, params: a, data: s } = this.handlerAbilityParams(o), d = this.getNodeModel(s[0]._nodeId);
    if ((o == null ? void 0 : o.silent) !== !0 && !await ibiz.confirm.error({
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
      await we(
        s.map(async (v) => {
          if (v.srfuf !== Ie.CREATE) {
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
      ), (o == null ? void 0 : o.silent) !== !0 && this.actionNotification("REMOVESUCCESS", {
        data: s,
        default: "数据[".concat(s.map((v) => v.srfmajortext).join("、"), "]删除成功!")
      }), p && !(o != null && o.notRefresh) && await this.refresh();
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
  calcAllowDrop(o, n, a) {
    var s, d;
    let p = !0;
    if (Ae(
      { _children: [o] },
      (N) => {
        if (N._id === n._id)
          return p = !1, !0;
      },
      { childrenFields: ["_children"] }
    ), !p)
      return !1;
    const u = this.getNodeModel(o._nodeId), v = this.getNodeModel(n._nodeId);
    if (a === "inner")
      return !!this.findDropNodeRS(
        n._nodeId,
        u.appDataEntityId
      );
    if (u.appDataEntityId !== v.appDataEntityId)
      return !1;
    if (((s = o._parent) == null ? void 0 : s._id) === ((d = n._parent) == null ? void 0 : d._id)) {
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
  async onNodeDrop(o, n, a) {
    var s, d;
    a === "inner" && !n._leaf && n._children === void 0 && await this.expandNodeByKey([n._id]);
    const p = this.getNodeModel(o._nodeId), u = a === "inner" ? n : n._parent, v = a === "inner" || ((s = n._parent) == null ? void 0 : s._id) !== ((d = o._parent) == null ? void 0 : d._id);
    let N = this.getNodeModel(n._nodeId);
    const P = p.appDataEntityId !== N.appDataEntityId;
    let k = !1;
    if (this.getNodeModel(u._nodeId).rootNode && (k = !0), v || k) {
      const I = [];
      for (const m of this.dropNodeRss.values())
        I.push(
          ...m.filter((g) => (
            // 修复子关系情况，根上也存在当前实体数据
            g.minorEntityId === p.appDataEntityId
          ))
        );
      if (k && v)
        I && (I.forEach((m) => {
          o._deData[m.pickupDEFName] = null;
        }), N = this.getNodeModel(p.id));
      else {
        const m = this.findDropNodeRS(
          u._nodeId,
          p.appDataEntityId
        );
        m && (I && I.forEach((g) => {
          o._deData[g.pickupDEFName] = null;
        }), o._deData[m.pickupDEFName] = u._value, m.detreeNodeRSParams && m.detreeNodeRSParams.forEach((g) => {
          var C, T;
          g.name && g.value && (C = o._deData) != null && C.hasOwnProperty(
            g.name.toLowerCase()
          ) && (T = u._deData) != null && T.hasOwnProperty(g.value.toLowerCase()) && (o._deData[g.name.toLowerCase()] = u._deData[g.value.toLowerCase()]);
        }), N = this.getNodeModel(m.childDETreeNodeId));
      }
      this.state.expandedKeys = this.calcExpandedKeys([u]), await this.updateDeNodeData([o]);
    }
    if (a === "inner" || P)
      v && await this.refreshNodeChildren(o, !0), await this.refreshNodeChildren(u, !0);
    else {
      const { moveAppDEActionId: I, appDataEntityId: m, allowOrder: g } = N;
      if (g) {
        if (!I)
          throw new de(
            this.model,
            ibiz.i18n.t("runtime.controller.common.md.noMoveDataCconfig")
          );
        const C = {
          srftargetkey: n.srfkey,
          srfmovetype: a === "prev" ? "MOVEBEFORE" : "MOVEAFTER"
        }, T = ibiz.hub.getApp(this.context.srfappid), B = V(m), R = this.context.clone();
        R[B] = o.srfkey, (await T.deService.exec(
          m,
          I,
          R,
          C
        )).ok && (this.emitDEDataChange("update", o._deData), v && await this.refreshNodeChildren(o, !0), await this.refreshNodeChildren(u));
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
  onDEDataChange(o) {
    var n;
    if (o.triggerKey === this.triggerKey)
      return;
    const a = o.data;
    if (o.subtype === "OBJECTCREATED") {
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
  async afterLoad(o, n) {
    return super.afterLoad(o, n);
  }
  /**
   * 重写节点点击事件
   *
   * @param {ITreeNodeData} nodeData
   * @param {MouseEvent} event
   * @return {*}  {Promise<void>}
   * @memberof GroupTreeController
   */
  async onTreeNodeClick(o, n) {
    var a;
    const s = (a = this.contextMenuInfos[o._nodeId]) == null ? void 0 : a.clickTBUIActionItem;
    if (s)
      return this.doUIAction(
        s.uiactionId,
        o,
        n,
        s.appId
      );
    if (this.state.navigational) {
      const d = this.getNodeModel(o._nodeId);
      if (!(d != null && d.navAppViewId))
        return;
    }
    this.state.singleSelect && !o._disableSelect && this.setSelection([o]), this.state.mdctrlActiveMode === 1 && await this.setActive(o);
  }
  /**
   * 过滤节点
   *
   * @param {string} nodeTag
   * @memberof GroupTreeController
   */
  async changeTreeState(o) {
    o && o === "draft" ? (this.isFilter.value = !0, this.evt.emit("onFilterNode", { nodeTag: o })) : this.resetTreeState();
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
function ze(e) {
  return typeof e == "function" || Object.prototype.toString.call(e) === "[object Object]" && !Ke(e);
}
const U = /* @__PURE__ */ be({
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
    const e = xe((...t) => new Le(...t)), o = oe(() => e.context.srfreadonly === !0 || e.context.srfreadonly === "true"), n = Te({});
    e.evt.on("onCreated", () => {
      e.counter && e.counter.onChange((t) => {
        Object.assign(n, t);
      }, !0);
    });
    const a = te("control-group-tree"), s = te("control-".concat(e.model.controlType.toLowerCase())), d = A(null), p = A(null), u = A(""), v = A(null);
    ae(() => v.value, (t) => {
      t && t.$el.getElementsByTagName("input")[0].focus();
    });
    const N = async () => {
      if (e.state.editingNodeKey)
        if (e.state.editingNodeText) {
          const t = w(e.state.editingNodeKey, e);
          await e.onModifyTreeNode(t, e.state.editingNodeText);
        } else
          e.state.editingNodeKey = null;
      e.state.newingNodeText ? e.onCreateTreeNode() : e.state.newingNodeModel = null;
    }, P = async () => {
      e.state.editingNodeKey && (e.state.editingNodeKey = null), e.state.newingNodeModel && (e.state.newingNodeModel = null, e.state.newingNodeText = "");
    }, {
      updateUI: k,
      triggerNodeExpand: I
    } = Fe(d, e), m = (t) => t.map((i) => ({
      _id: i._id,
      _uuid: i._uuid,
      _leaf: i._leaf,
      _text: i._text
    }));
    e.evt.on("onAfterRefreshParent", (t) => {
      if (d.value) {
        const {
          parentNode: i,
          children: r
        } = t, l = m(r);
        d.value.updateKeyChildren(i._id, l), k();
      }
    }), e.evt.on("onAfterNodeDrop", (t) => {
      t.isChangedParent && (u.value = ie());
    });
    const g = oe(() => e.state.isLoaded ? e.model.rootVisible ? e.state.rootNodes : e.state.rootNodes.reduce((t, i) => i._children ? t.concat(i._children) : t, []) : []);
    ae(g, (t, i) => {
      t !== i && (u.value = ie());
    });
    const C = async (t, i) => {
      let r;
      if (t.level === 0)
        r = g.value, ibiz.log.debug("初始加载");
      else {
        const l = w(t.data._uuid, e);
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
      var t;
      T && await Ce(), e.state.singleSelect ? d.value.setCurrentKey(((t = e.state.selectedData[0]) == null ? void 0 : t._id) || void 0) : d.value.setCheckedKeys(e.state.selectedData.map((i) => i._id));
    });
    const B = (t, i) => {
      const {
        checkedNodes: r
      } = i;
      e.setSelection(r);
    };
    let R = !1;
    const G = (t, i) => {
      var r, l, h;
      if (i.stopPropagation(), !t._disableSelect && !R) {
        if (((r = d.value) == null ? void 0 : r.getCurrentKey()) === t._id && !o.value) {
          const c = (l = d.value) == null ? void 0 : l.getCurrentKey();
          e.updateTreeNode({
            nodeKey: c,
            defaultValue: {}
          });
        }
        if (e.state.singleSelect || (h = d.value) == null || h.setCurrentKey(t._id), e.state.navigational) {
          const c = e.getNodeModel(t._nodeId);
          if (!(c != null && c.navAppViewId)) {
            const E = I(t._id);
            e.onExpandChange(t, E);
          }
        }
        e.onTreeNodeClick(t, i), R = !0, setTimeout(() => {
          R = !1;
        }, 200);
      }
    }, H = (t, i) => {
      i.stopPropagation(), !t._disableSelect && e.onDbTreeNodeClick(t);
    };
    let M;
    e.evt.on("onMounted", () => {
      Object.values(e.contextMenus).length > 0 && (() => import("./vue3-context-menu.umd.es.js").then((t) => t.v))().then((t) => {
        M = t.default, M.default && !M.showContextMenu && (M = M.default);
      });
    });
    const re = D("IBizRawItem"), K = D("IBizIcon"), q = (t, i, r, l) => {
      const h = [];
      return t.forEach((c) => {
        var E, _;
        if (c.itemType === "SEPERATOR") {
          h.push({
            divided: "self"
          });
          return;
        }
        const j = l[c.id];
        if (j && !j.visible || c.actionLevel > 100)
          return;
        let y = {};
        if (c.showCaption && c.caption && (y.label = c.caption), c.sysImage && c.showIcon && (y.icon = f(K, {
          icon: c.sysImage
        }, null)), c.itemType === "DEUIACTION") {
          y.disabled = j.disabled, y.clickClose = !0;
          const {
            uiactionId: x
          } = c;
          x && (y.onClick = () => {
            e.doUIAction(x, i, r, c.appId);
          });
        } else if (c.itemType === "RAWITEM") {
          const {
            rawItem: x
          } = c;
          x && (y.label = f(re, {
            rawItem: c
          }, null));
        } else if (c.itemType === "ITEMS") {
          (E = c.detoolbarItems) != null && E.length && (y.children = q(c.detoolbarItems, i, r, l));
          const x = c;
          if (x.uiactionGroup && x.groupExtractMode) {
            const S = (_ = x.uiactionGroup.uiactionGroupDetails) == null ? void 0 : _.filter((b) => l[b.id].visible).map((b) => {
              const Ne = l[b.id], {
                sysImage: ge
              } = b;
              return {
                label: b.showCaption ? b.caption : void 0,
                icon: b.showIcon ? f(K, {
                  icon: ge
                }, null) : void 0,
                disabled: Ne.disabled,
                clickableWhenHasChildren: !0,
                onClick: () => {
                  M.closeContextMenu(), e.doUIAction(b.uiactionId, i, r, b.appId);
                }
              };
            });
            switch (x.groupExtractMode) {
              case "ITEMS":
                y.children = S;
                break;
              case "ITEMX":
                S && (y = S[0], y.children = S.slice(1));
                break;
              case "ITEM":
              default:
                y = void 0, S && h.push(...S);
                break;
            }
          }
        }
        y && h.push(y);
      }), h;
    }, $ = async (t, i) => {
      i.preventDefault(), i.stopPropagation();
      const r = e.getNodeModel(t._nodeId);
      if (!(r != null && r.decontextMenu))
        return;
      const l = e.contextMenus[r.decontextMenu.id];
      if (!l.model.detoolbarItems)
        return;
      await l.calcButtonState(t._deData || (t.srfkey ? t : void 0), r.appDataEntityId);
      const h = l.state.buttonsState, c = q(l.model.detoolbarItems, t, i, h);
      c.length && M.showContextMenu({
        x: i.x,
        y: i.y,
        customClass: a.b("context-menu"),
        items: c
      });
    }, Q = (t, i) => {
      var r, l;
      if (!((l = (r = t == null ? void 0 : t.decontextMenu) == null ? void 0 : r.detoolbarItems) != null && l.length))
        return;
      const h = e.contextMenuInfos[t.id];
      return h.clickTBUIActionItem && h.onlyOneActionItem ? null : f(D("iBizContextMenuControl"), {
        modelData: t.decontextMenu,
        groupLevelKeys: [50, 100],
        nodeModel: t,
        nodeData: i,
        context: e.context,
        onActionClick: (c, E) => e.doUIAction(c.uiactionId, i, E, c.appId)
      }, null);
    }, L = (t, i) => {
      const r = w(t._uuid, e);
      if (!r)
        throw new F("没有找到_uuid为".concat(t._uuid, "的节点"));
      e.onExpandChange(r, i);
    }, ue = le(() => {
      e.load();
    }, 500), ce = (t) => {
      e.state.query = t, ue();
    }, W = (t, i, r) => {
      const l = w(t.data._uuid, e), h = w(i.data._uuid, e);
      return e.calcAllowDrop(l, h, r);
    }, X = (t) => {
      const i = w(t.data._uuid, e);
      return e.calcAllowDrag(i);
    }, J = (t, i, r) => {
      const l = Pe(r), h = w(t.data._uuid, e), c = w(i.data._uuid, e);
      e.onNodeDrop(h, c, l);
    }, z = (t) => {
      (t.key === "Enter" || t.keyCode === 13) && (t.stopPropagation(), N()), (t.key === "Escape" || t.keyCode === 27) && (t.stopPropagation(), P());
    }, Y = (t) => {
      var i;
      if (t.code === "F2" || t.code === "Enter") {
        const r = (i = d.value) == null ? void 0 : i.getCurrentKey();
        e.updateTreeNode(r);
      }
    }, pe = async () => {
      e.evt.emit("onBack", {}), e.isFilter.value = !1, d.value && d.value.filter("");
    };
    Me(() => {
      var t;
      (t = p.value) == null || t.$el.addEventListener("keydown", Y), e.evt.on("onFilterNode", async (i) => {
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
    }), ke(() => {
      var t;
      (t = p.value) == null || t.$el.removeEventListener("keydown", Y);
    });
    const he = (t, i) => (i._id || "").includes(t), fe = (t) => t._id === "root:draft_parent" ? "draft_parent" : null, Z = (t) => {
      if (t.counterId) {
        const i = n[t.counterId];
        return se(i) || t.counterMode === 1 && i === 0 ? null : f("div", {
          class: a.em("counter", "box")
        }, [f("span", {
          class: a.e("dot")
        }, [ne("·")]), f(D("iBizBadge"), {
          class: a.e("counter"),
          value: i
        }, null)]);
      }
    }, ve = () => e.isFilter.value ? f("div", {
      class: a.b("filter")
    }, [f("div", {
      class: a.be("filter", "header"),
      onClick: pe
    }, [f(D("ion-icon"), {
      name: "arrow-back-outline"
    }, null), ne("返回")])]) : null, ee = (t) => {
      var i, r;
      if (!e.state.newingNodeModel)
        return null;
      const {
        parent_id: l
      } = e.state.newingNodeDefault || {};
      if (l) {
        if (!t)
          return null;
        const {
          _value: h
        } = t || {};
        if (h !== l)
          return null;
      }
      return !l && t ? null : f("div", {
        class: [a.be("node", "newing")]
      }, [(i = e.state.newingNodeModel) != null && i.sysImage ? f(K, {
        class: a.be("node", "icon"),
        icon: (r = e.state.newingNodeModel) == null ? void 0 : r.sysImage
      }, null) : null, f(D("el-input"), {
        modelValue: e.state.newingNodeText,
        "onUpdate:modelValue": (h) => e.state.newingNodeText = h,
        ref: "treeNodeTextInputRef",
        class: a.b("editing-node"),
        onBlur: N,
        onKeydown: (h) => {
          z(h);
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
      findNodeData: w,
      handleEditKeyDown: z,
      onCheck: B,
      onNodeClick: G,
      onNodeDbClick: H,
      onNodeContextmenu: $,
      loadData: C,
      renderContextMenu: Q,
      renderCounter: Z,
      updateNodeExpand: L,
      onInput: ce,
      allowDrop: W,
      allowDrag: X,
      handleDrop: J,
      onNodeTextEditBlur: N,
      renderTree: () => f("div", {
        class: [a.b("content"), a.is("filter", e.isFilter.value)]
      }, [ve(), f("div", {
        class: [a.b("tree-box"), a.is("filter", e.isFilter.value)]
      }, [f(D("el-tree"), {
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
          class: fe
        },
        lazy: !0,
        load: C,
        onCheck: B,
        onNodeExpand: (t) => {
          L(t, !0);
        },
        onNodeCollapse: (t) => {
          L(t, !1);
        },
        draggable: !o.value,
        "allow-drop": W,
        "allow-drag": X,
        onNodeDrop: J,
        "filter-node-method": he
      }, {
        default: ({
          data: t
        }) => {
          var i, r;
          const l = w(t._uuid, e);
          if (!l)
            return null;
          const h = e.getNodeModel(l._nodeId);
          if (e.state.editingNodeKey === l._id && !o.value)
            return f("div", {
              class: [a.b("node"), (i = h.sysCss) == null ? void 0 : i.cssName]
            }, [l._icon ? f(K, {
              class: a.be("node", "icon"),
              icon: l._icon
            }, null) : null, f(D("el-input"), {
              modelValue: e.state.editingNodeText,
              "onUpdate:modelValue": (_) => e.state.editingNodeText = _,
              ref: "treeNodeTextInputRef",
              class: a.b("editing-node"),
              onBlur: () => {
                N();
              },
              onKeydown: (_) => {
                z(_);
              }
            }, null)]);
          const c = ye(h);
          let E;
          return c ? E = f(D("iBizControlShell"), {
            data: l,
            modelData: c,
            context: e.context,
            params: e.params
          }, null) : E = [l._icon ? f(K, {
            class: a.be("node", "icon"),
            icon: l._icon
          }, null) : null, l._textHtml ? f("span", {
            class: a.be("node", "label"),
            innerHTML: l._textHtml
          }, null) : f("span", {
            class: a.be("node", "label")
          }, [l._text])], [f("div", {
            onDblclick: (_) => H(l, _),
            onClick: (_) => G(l, _),
            onContextmenu: (_) => $(l, _),
            class: [a.b("node"), a.is("hidden", Object.is(e.hiddenNodeId, l._nodeId) && !e.isFilter.value), l._leaf ? a.be("node", "item") : a.be("node", "group"), (r = h.sysCss) == null ? void 0 : r.cssName]
          }, [E, Z(h), Q(h, l)]), ee(l)];
        }
      }), ee()])])
    };
  },
  render() {
    const e = {
      searchbar: () => this.c.enableQuickSearch ? f(D("el-input"), {
        "model-value": this.c.state.query,
        class: this.ns.b("quick-search"),
        placeholder: this.c.state.placeHolder,
        onInput: this.onInput
      }, {
        prefix: () => f(D("ion-icon"), {
          class: this.ns.e("search-icon"),
          name: "search"
        }, null)
      }) : null
    };
    this.c.bottomToolbar && (e.toolbar = () => f(D("iBizControlShell"), {
      modelData: this.c.bottomToolbar,
      context: this.c.context,
      params: this.c.params
    }, null));
    const o = this.c.controlPanel ? "tree" : "default";
    return e[o] = () => {
      if (this.c.state.isLoaded && this.treeRefreshKey)
        return this.renderTree();
    }, Re(f(D("iBizControlBase"), {
      ref: "treeviewRef",
      controller: this.c
    }, ze(e) ? e : {
      default: () => [e]
    }), [[Se("loading"), this.c.state.isLoading]]);
  }
});
class je {
  constructor() {
    O(this, "component", "IBizGroupTreeControl");
  }
}
const We = Ee(
  U,
  function(e) {
    e.component(U.name, U), me(
      "TREE_RENDER_GROUP_TREE",
      () => new je()
    );
  }
);
export {
  We as IBizGroupTreeControl,
  We as default
};
