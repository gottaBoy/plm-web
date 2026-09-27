import './assets/style.css';
import './assets/style.css';
import { registerPanelItemProvider as rt, Modal as tt, ViewMode as nt, calcDeCodeNameById as ot, getErrorViewProvider as at, RouteConst as or } from "@ibiz-template/runtime";
import { getCurrentInstance as it, inject as Ke, onUnmounted as Qe, onDeactivated as Fr, onActivated as Nr, defineComponent as Ye, ref as Y, watch as lt, h as Ge, resolveComponent as Ae, createVNode as O, createTextVNode as ct, isVNode as ut, toRaw as ft } from "vue";
import { useNamespace as Br, getNestedRoutePath as ar, NavPosController as pt, route2routePath as Cr, parseRouteViewData as yt, createOverlayView as st, routerCallback as dt, NavPosState as vt } from "@ibiz-template/vue3-util";
import { IBizContext as ue } from "@ibiz-template/core";
import { isEmpty as mt } from "ramda";
/*!
  * vue-router v4.2.5
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */
function ir(r) {
  const e = Array.from(arguments).slice(1);
  console.warn.apply(console, ["[Vue Router warn]: " + r].concat(e));
}
var lr;
(function(r) {
  r.pop = "pop", r.push = "push";
})(lr || (lr = {}));
var cr;
(function(r) {
  r.back = "back", r.forward = "forward", r.unknown = "";
})(cr || (cr = {}));
Symbol(process.env.NODE_ENV !== "production" ? "navigation failure" : "");
var ur;
(function(r) {
  r[r.aborted = 4] = "aborted", r[r.cancelled = 8] = "cancelled", r[r.duplicated = 16] = "duplicated";
})(ur || (ur = {}));
const ht = Symbol(process.env.NODE_ENV !== "production" ? "router view location matched" : "");
Symbol(process.env.NODE_ENV !== "production" ? "router view depth" : "");
const gt = Symbol(process.env.NODE_ENV !== "production" ? "router" : ""), St = Symbol(process.env.NODE_ENV !== "production" ? "route location" : "");
Symbol(process.env.NODE_ENV !== "production" ? "router view location" : "");
function bt(r, e, t) {
  const n = () => {
    r[e].delete(t);
  };
  Qe(n), Fr(n), Nr(() => {
    r[e].add(t);
  }), r[e].add(t);
}
function At(r) {
  if (process.env.NODE_ENV !== "production" && !it()) {
    ir("getCurrentInstance() returned null. onBeforeRouteUpdate() must be called at the top of a setup function");
    return;
  }
  const e = Ke(
    ht,
    // to avoid warning
    {}
  ).value;
  if (!e) {
    process.env.NODE_ENV !== "production" && ir("No active route record was found when calling `onBeforeRouteUpdate()`. Make sure you call this function inside a component child of <router-view>. Maybe you called it inside of App.vue?");
    return;
  }
  bt(e, "updateGuards", r);
}
function Mr() {
  return Ke(gt);
}
function Dr() {
  return Ke(St);
}
function wt(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function Pt(r) {
  if (r.__esModule)
    return r;
  var e = r.default;
  if (typeof e == "function") {
    var t = function n() {
      return this instanceof n ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else
    t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(r).forEach(function(n) {
    var a = Object.getOwnPropertyDescriptor(r, n);
    Object.defineProperty(t, n, a.get ? a : {
      enumerable: !0,
      get: function() {
        return r[n];
      }
    });
  }), t;
}
var Ot = function() {
  if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
    return !1;
  if (typeof Symbol.iterator == "symbol")
    return !0;
  var e = {}, t = Symbol("test"), n = Object(t);
  if (typeof t == "string" || Object.prototype.toString.call(t) !== "[object Symbol]" || Object.prototype.toString.call(n) !== "[object Symbol]")
    return !1;
  var a = 42;
  e[t] = a;
  for (t in e)
    return !1;
  if (typeof Object.keys == "function" && Object.keys(e).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(e).length !== 0)
    return !1;
  var o = Object.getOwnPropertySymbols(e);
  if (o.length !== 1 || o[0] !== t || !Object.prototype.propertyIsEnumerable.call(e, t))
    return !1;
  if (typeof Object.getOwnPropertyDescriptor == "function") {
    var c = Object.getOwnPropertyDescriptor(e, t);
    if (c.value !== a || c.enumerable !== !0)
      return !1;
  }
  return !0;
}, fr = typeof Symbol < "u" && Symbol, Et = Ot, Ur = function() {
  return typeof fr != "function" || typeof Symbol != "function" || typeof fr("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : Et();
}, It = "Function.prototype.bind called on incompatible ", Fe = Array.prototype.slice, xt = Object.prototype.toString, Rt = "[object Function]", $t = function(e) {
  var t = this;
  if (typeof t != "function" || xt.call(t) !== Rt)
    throw new TypeError(It + t);
  for (var n = Fe.call(arguments, 1), a, o = function() {
    if (this instanceof a) {
      var f = t.apply(
        this,
        n.concat(Fe.call(arguments))
      );
      return Object(f) === f ? f : this;
    } else
      return t.apply(
        e,
        n.concat(Fe.call(arguments))
      );
  }, c = Math.max(0, t.length - n.length), i = [], l = 0; l < c; l++)
    i.push("$" + l);
  if (a = Function("binder", "return function (" + i.join(",") + "){ return binder.apply(this,arguments); }")(o), t.prototype) {
    var u = function() {
    };
    u.prototype = t.prototype, a.prototype = new u(), u.prototype = null;
  }
  return a;
}, Ft = $t, $e = Function.prototype.bind || Ft, Nt = $e, _r = Nt.call(Function.call, Object.prototype.hasOwnProperty), v, re = SyntaxError, Tr = Function, X = TypeError, Ne = function(r) {
  try {
    return Tr('"use strict"; return (' + r + ").constructor;")();
  } catch (e) {
  }
}, V = Object.getOwnPropertyDescriptor;
if (V)
  try {
    V({}, "");
  } catch (r) {
    V = null;
  }
var Be = function() {
  throw new X();
}, Bt = V ? function() {
  try {
    return arguments.callee, Be;
  } catch (r) {
    try {
      return V(arguments, "callee").get;
    } catch (e) {
      return Be;
    }
  }
}() : Be, q = Ur(), R = Object.getPrototypeOf || function(r) {
  return r.__proto__;
}, K = {}, Ct = typeof Uint8Array > "u" ? v : R(Uint8Array), W = {
  "%AggregateError%": typeof AggregateError > "u" ? v : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer > "u" ? v : ArrayBuffer,
  "%ArrayIteratorPrototype%": q ? R([][Symbol.iterator]()) : v,
  "%AsyncFromSyncIteratorPrototype%": v,
  "%AsyncFunction%": K,
  "%AsyncGenerator%": K,
  "%AsyncGeneratorFunction%": K,
  "%AsyncIteratorPrototype%": K,
  "%Atomics%": typeof Atomics > "u" ? v : Atomics,
  "%BigInt%": typeof BigInt > "u" ? v : BigInt,
  "%BigInt64Array%": typeof BigInt64Array > "u" ? v : BigInt64Array,
  "%BigUint64Array%": typeof BigUint64Array > "u" ? v : BigUint64Array,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView > "u" ? v : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": Error,
  "%eval%": eval,
  // eslint-disable-line no-eval
  "%EvalError%": EvalError,
  "%Float32Array%": typeof Float32Array > "u" ? v : Float32Array,
  "%Float64Array%": typeof Float64Array > "u" ? v : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? v : FinalizationRegistry,
  "%Function%": Tr,
  "%GeneratorFunction%": K,
  "%Int8Array%": typeof Int8Array > "u" ? v : Int8Array,
  "%Int16Array%": typeof Int16Array > "u" ? v : Int16Array,
  "%Int32Array%": typeof Int32Array > "u" ? v : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": q ? R(R([][Symbol.iterator]())) : v,
  "%JSON%": typeof JSON == "object" ? JSON : v,
  "%Map%": typeof Map > "u" ? v : Map,
  "%MapIteratorPrototype%": typeof Map > "u" || !q ? v : R((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": Object,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise > "u" ? v : Promise,
  "%Proxy%": typeof Proxy > "u" ? v : Proxy,
  "%RangeError%": RangeError,
  "%ReferenceError%": ReferenceError,
  "%Reflect%": typeof Reflect > "u" ? v : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set > "u" ? v : Set,
  "%SetIteratorPrototype%": typeof Set > "u" || !q ? v : R((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? v : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": q ? R(""[Symbol.iterator]()) : v,
  "%Symbol%": q ? Symbol : v,
  "%SyntaxError%": re,
  "%ThrowTypeError%": Bt,
  "%TypedArray%": Ct,
  "%TypeError%": X,
  "%Uint8Array%": typeof Uint8Array > "u" ? v : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? v : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array > "u" ? v : Uint16Array,
  "%Uint32Array%": typeof Uint32Array > "u" ? v : Uint32Array,
  "%URIError%": URIError,
  "%WeakMap%": typeof WeakMap > "u" ? v : WeakMap,
  "%WeakRef%": typeof WeakRef > "u" ? v : WeakRef,
  "%WeakSet%": typeof WeakSet > "u" ? v : WeakSet
};
try {
  null.error;
} catch (r) {
  var Mt = R(R(r));
  W["%Error.prototype%"] = Mt;
}
var Dt = function r(e) {
  var t;
  if (e === "%AsyncFunction%")
    t = Ne("async function () {}");
  else if (e === "%GeneratorFunction%")
    t = Ne("function* () {}");
  else if (e === "%AsyncGeneratorFunction%")
    t = Ne("async function* () {}");
  else if (e === "%AsyncGenerator%") {
    var n = r("%AsyncGeneratorFunction%");
    n && (t = n.prototype);
  } else if (e === "%AsyncIteratorPrototype%") {
    var a = r("%AsyncGenerator%");
    a && (t = R(a.prototype));
  }
  return W[e] = t, t;
}, pr = {
  "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
  "%ArrayPrototype%": ["Array", "prototype"],
  "%ArrayProto_entries%": ["Array", "prototype", "entries"],
  "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
  "%ArrayProto_keys%": ["Array", "prototype", "keys"],
  "%ArrayProto_values%": ["Array", "prototype", "values"],
  "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
  "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
  "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
  "%BooleanPrototype%": ["Boolean", "prototype"],
  "%DataViewPrototype%": ["DataView", "prototype"],
  "%DatePrototype%": ["Date", "prototype"],
  "%ErrorPrototype%": ["Error", "prototype"],
  "%EvalErrorPrototype%": ["EvalError", "prototype"],
  "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
  "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
  "%FunctionPrototype%": ["Function", "prototype"],
  "%Generator%": ["GeneratorFunction", "prototype"],
  "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
  "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
  "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
  "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
  "%JSONParse%": ["JSON", "parse"],
  "%JSONStringify%": ["JSON", "stringify"],
  "%MapPrototype%": ["Map", "prototype"],
  "%NumberPrototype%": ["Number", "prototype"],
  "%ObjectPrototype%": ["Object", "prototype"],
  "%ObjProto_toString%": ["Object", "prototype", "toString"],
  "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
  "%PromisePrototype%": ["Promise", "prototype"],
  "%PromiseProto_then%": ["Promise", "prototype", "then"],
  "%Promise_all%": ["Promise", "all"],
  "%Promise_reject%": ["Promise", "reject"],
  "%Promise_resolve%": ["Promise", "resolve"],
  "%RangeErrorPrototype%": ["RangeError", "prototype"],
  "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
  "%RegExpPrototype%": ["RegExp", "prototype"],
  "%SetPrototype%": ["Set", "prototype"],
  "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
  "%StringPrototype%": ["String", "prototype"],
  "%SymbolPrototype%": ["Symbol", "prototype"],
  "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
  "%TypedArrayPrototype%": ["TypedArray", "prototype"],
  "%TypeErrorPrototype%": ["TypeError", "prototype"],
  "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
  "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
  "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
  "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
  "%URIErrorPrototype%": ["URIError", "prototype"],
  "%WeakMapPrototype%": ["WeakMap", "prototype"],
  "%WeakSetPrototype%": ["WeakSet", "prototype"]
}, de = $e, Pe = _r, Ut = de.call(Function.call, Array.prototype.concat), _t = de.call(Function.apply, Array.prototype.splice), yr = de.call(Function.call, String.prototype.replace), Oe = de.call(Function.call, String.prototype.slice), Tt = de.call(Function.call, RegExp.prototype.exec), kt = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, Vt = /\\(\\)?/g, Wt = function(e) {
  var t = Oe(e, 0, 1), n = Oe(e, -1);
  if (t === "%" && n !== "%")
    throw new re("invalid intrinsic syntax, expected closing `%`");
  if (n === "%" && t !== "%")
    throw new re("invalid intrinsic syntax, expected opening `%`");
  var a = [];
  return yr(e, kt, function(o, c, i, l) {
    a[a.length] = i ? yr(l, Vt, "$1") : c || o;
  }), a;
}, Gt = function(e, t) {
  var n = e, a;
  if (Pe(pr, n) && (a = pr[n], n = "%" + a[0] + "%"), Pe(W, n)) {
    var o = W[n];
    if (o === K && (o = Dt(n)), typeof o > "u" && !t)
      throw new X("intrinsic " + e + " exists, but is not available. Please file an issue!");
    return {
      alias: a,
      name: n,
      value: o
    };
  }
  throw new re("intrinsic " + e + " does not exist!");
}, Lt = function(e, t) {
  if (typeof e != "string" || e.length === 0)
    throw new X("intrinsic name must be a non-empty string");
  if (arguments.length > 1 && typeof t != "boolean")
    throw new X('"allowMissing" argument must be a boolean');
  if (Tt(/^%?[^%]*%?$/, e) === null)
    throw new re("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  var n = Wt(e), a = n.length > 0 ? n[0] : "", o = Gt("%" + a + "%", t), c = o.name, i = o.value, l = !1, u = o.alias;
  u && (a = u[0], _t(n, Ut([0, 1], u)));
  for (var f = 1, y = !0; f < n.length; f += 1) {
    var p = n[f], d = Oe(p, 0, 1), s = Oe(p, -1);
    if ((d === '"' || d === "'" || d === "`" || s === '"' || s === "'" || s === "`") && d !== s)
      throw new re("property names with quotes must have matching quotes");
    if ((p === "constructor" || !y) && (l = !0), a += "." + p, c = "%" + a + "%", Pe(W, c))
      i = W[c];
    else if (i != null) {
      if (!(p in i)) {
        if (!t)
          throw new X("base intrinsic for " + e + " exists, but the property is not available.");
        return;
      }
      if (V && f + 1 >= n.length) {
        var S = V(i, p);
        y = !!S, y && "get" in S && !("originalValue" in S.get) ? i = S.get : i = i[p];
      } else
        y = Pe(i, p), i = i[p];
      y && !l && (W[c] = i);
    }
  }
  return i;
}, m, te = SyntaxError, kr = Function, Z = TypeError, Ce = function(r) {
  try {
    return kr('"use strict"; return (' + r + ").constructor;")();
  } catch (e) {
  }
}, G = Object.getOwnPropertyDescriptor;
if (G)
  try {
    G({}, "");
  } catch (r) {
    G = null;
  }
var Me = function() {
  throw new Z();
}, zt = G ? function() {
  try {
    return arguments.callee, Me;
  } catch (r) {
    try {
      return G(arguments, "callee").get;
    } catch (e) {
      return Me;
    }
  }
}() : Me, J = Ur(), M = Object.getPrototypeOf || function(r) {
  return r.__proto__;
}, Q = {}, jt = typeof Uint8Array > "u" ? m : M(Uint8Array), ee = {
  "%AggregateError%": typeof AggregateError > "u" ? m : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer > "u" ? m : ArrayBuffer,
  "%ArrayIteratorPrototype%": J ? M([][Symbol.iterator]()) : m,
  "%AsyncFromSyncIteratorPrototype%": m,
  "%AsyncFunction%": Q,
  "%AsyncGenerator%": Q,
  "%AsyncGeneratorFunction%": Q,
  "%AsyncIteratorPrototype%": Q,
  "%Atomics%": typeof Atomics > "u" ? m : Atomics,
  "%BigInt%": typeof BigInt > "u" ? m : BigInt,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView > "u" ? m : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": Error,
  "%eval%": eval,
  // eslint-disable-line no-eval
  "%EvalError%": EvalError,
  "%Float32Array%": typeof Float32Array > "u" ? m : Float32Array,
  "%Float64Array%": typeof Float64Array > "u" ? m : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? m : FinalizationRegistry,
  "%Function%": kr,
  "%GeneratorFunction%": Q,
  "%Int8Array%": typeof Int8Array > "u" ? m : Int8Array,
  "%Int16Array%": typeof Int16Array > "u" ? m : Int16Array,
  "%Int32Array%": typeof Int32Array > "u" ? m : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": J ? M(M([][Symbol.iterator]())) : m,
  "%JSON%": typeof JSON == "object" ? JSON : m,
  "%Map%": typeof Map > "u" ? m : Map,
  "%MapIteratorPrototype%": typeof Map > "u" || !J ? m : M((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": Object,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise > "u" ? m : Promise,
  "%Proxy%": typeof Proxy > "u" ? m : Proxy,
  "%RangeError%": RangeError,
  "%ReferenceError%": ReferenceError,
  "%Reflect%": typeof Reflect > "u" ? m : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set > "u" ? m : Set,
  "%SetIteratorPrototype%": typeof Set > "u" || !J ? m : M((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? m : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": J ? M(""[Symbol.iterator]()) : m,
  "%Symbol%": J ? Symbol : m,
  "%SyntaxError%": te,
  "%ThrowTypeError%": zt,
  "%TypedArray%": jt,
  "%TypeError%": Z,
  "%Uint8Array%": typeof Uint8Array > "u" ? m : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? m : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array > "u" ? m : Uint16Array,
  "%Uint32Array%": typeof Uint32Array > "u" ? m : Uint32Array,
  "%URIError%": URIError,
  "%WeakMap%": typeof WeakMap > "u" ? m : WeakMap,
  "%WeakRef%": typeof WeakRef > "u" ? m : WeakRef,
  "%WeakSet%": typeof WeakSet > "u" ? m : WeakSet
}, Ht = function r(e) {
  var t;
  if (e === "%AsyncFunction%")
    t = Ce("async function () {}");
  else if (e === "%GeneratorFunction%")
    t = Ce("function* () {}");
  else if (e === "%AsyncGeneratorFunction%")
    t = Ce("async function* () {}");
  else if (e === "%AsyncGenerator%") {
    var n = r("%AsyncGeneratorFunction%");
    n && (t = n.prototype);
  } else if (e === "%AsyncIteratorPrototype%") {
    var a = r("%AsyncGenerator%");
    a && (t = M(a.prototype));
  }
  return ee[e] = t, t;
}, sr = {
  "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
  "%ArrayPrototype%": ["Array", "prototype"],
  "%ArrayProto_entries%": ["Array", "prototype", "entries"],
  "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
  "%ArrayProto_keys%": ["Array", "prototype", "keys"],
  "%ArrayProto_values%": ["Array", "prototype", "values"],
  "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
  "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
  "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
  "%BooleanPrototype%": ["Boolean", "prototype"],
  "%DataViewPrototype%": ["DataView", "prototype"],
  "%DatePrototype%": ["Date", "prototype"],
  "%ErrorPrototype%": ["Error", "prototype"],
  "%EvalErrorPrototype%": ["EvalError", "prototype"],
  "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
  "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
  "%FunctionPrototype%": ["Function", "prototype"],
  "%Generator%": ["GeneratorFunction", "prototype"],
  "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
  "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
  "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
  "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
  "%JSONParse%": ["JSON", "parse"],
  "%JSONStringify%": ["JSON", "stringify"],
  "%MapPrototype%": ["Map", "prototype"],
  "%NumberPrototype%": ["Number", "prototype"],
  "%ObjectPrototype%": ["Object", "prototype"],
  "%ObjProto_toString%": ["Object", "prototype", "toString"],
  "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
  "%PromisePrototype%": ["Promise", "prototype"],
  "%PromiseProto_then%": ["Promise", "prototype", "then"],
  "%Promise_all%": ["Promise", "all"],
  "%Promise_reject%": ["Promise", "reject"],
  "%Promise_resolve%": ["Promise", "resolve"],
  "%RangeErrorPrototype%": ["RangeError", "prototype"],
  "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
  "%RegExpPrototype%": ["RegExp", "prototype"],
  "%SetPrototype%": ["Set", "prototype"],
  "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
  "%StringPrototype%": ["String", "prototype"],
  "%SymbolPrototype%": ["Symbol", "prototype"],
  "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
  "%TypedArrayPrototype%": ["TypedArray", "prototype"],
  "%TypeErrorPrototype%": ["TypeError", "prototype"],
  "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
  "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
  "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
  "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
  "%URIErrorPrototype%": ["URIError", "prototype"],
  "%WeakMapPrototype%": ["WeakMap", "prototype"],
  "%WeakSetPrototype%": ["WeakSet", "prototype"]
}, ve = $e, Ee = _r, qt = ve.call(Function.call, Array.prototype.concat), Jt = ve.call(Function.apply, Array.prototype.splice), dr = ve.call(Function.call, String.prototype.replace), Ie = ve.call(Function.call, String.prototype.slice), Kt = ve.call(Function.call, RegExp.prototype.exec), Qt = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, Yt = /\\(\\)?/g, Xt = function(e) {
  var t = Ie(e, 0, 1), n = Ie(e, -1);
  if (t === "%" && n !== "%")
    throw new te("invalid intrinsic syntax, expected closing `%`");
  if (n === "%" && t !== "%")
    throw new te("invalid intrinsic syntax, expected opening `%`");
  var a = [];
  return dr(e, Qt, function(o, c, i, l) {
    a[a.length] = i ? dr(l, Yt, "$1") : c || o;
  }), a;
}, Zt = function(e, t) {
  var n = e, a;
  if (Ee(sr, n) && (a = sr[n], n = "%" + a[0] + "%"), Ee(ee, n)) {
    var o = ee[n];
    if (o === Q && (o = Ht(n)), typeof o > "u" && !t)
      throw new Z("intrinsic " + e + " exists, but is not available. Please file an issue!");
    return {
      alias: a,
      name: n,
      value: o
    };
  }
  throw new te("intrinsic " + e + " does not exist!");
}, Vr = function(e, t) {
  if (typeof e != "string" || e.length === 0)
    throw new Z("intrinsic name must be a non-empty string");
  if (arguments.length > 1 && typeof t != "boolean")
    throw new Z('"allowMissing" argument must be a boolean');
  if (Kt(/^%?[^%]*%?$/g, e) === null)
    throw new te("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  var n = Xt(e), a = n.length > 0 ? n[0] : "", o = Zt("%" + a + "%", t), c = o.name, i = o.value, l = !1, u = o.alias;
  u && (a = u[0], Jt(n, qt([0, 1], u)));
  for (var f = 1, y = !0; f < n.length; f += 1) {
    var p = n[f], d = Ie(p, 0, 1), s = Ie(p, -1);
    if ((d === '"' || d === "'" || d === "`" || s === '"' || s === "'" || s === "`") && d !== s)
      throw new te("property names with quotes must have matching quotes");
    if ((p === "constructor" || !y) && (l = !0), a += "." + p, c = "%" + a + "%", Ee(ee, c))
      i = ee[c];
    else if (i != null) {
      if (!(p in i)) {
        if (!t)
          throw new Z("base intrinsic for " + e + " exists, but the property is not available.");
        return;
      }
      if (G && f + 1 >= n.length) {
        var S = G(i, p);
        y = !!S, y && "get" in S && !("originalValue" in S.get) ? i = S.get : i = i[p];
      } else
        y = Ee(i, p), i = i[p];
      y && !l && (ee[c] = i);
    }
  }
  return i;
}, Wr = { exports: {} };
(function(r) {
  var e = $e, t = Vr, n = t("%Function.prototype.apply%"), a = t("%Function.prototype.call%"), o = t("%Reflect.apply%", !0) || e.call(a, n), c = t("%Object.getOwnPropertyDescriptor%", !0), i = t("%Object.defineProperty%", !0), l = t("%Math.max%");
  if (i)
    try {
      i({}, "a", { value: 1 });
    } catch (f) {
      i = null;
    }
  r.exports = function(y) {
    var p = o(e, a, arguments);
    if (c && i) {
      var d = c(p, "length");
      d.configurable && i(
        p,
        "length",
        { value: 1 + l(0, y.length - (arguments.length - 1)) }
      );
    }
    return p;
  };
  var u = function() {
    return o(e, n, arguments);
  };
  i ? i(r.exports, "apply", { value: u }) : r.exports.apply = u;
})(Wr);
var en = Wr.exports, Gr = Vr, Lr = en, rn = Lr(Gr("String.prototype.indexOf")), tn = function(e, t) {
  var n = Gr(e, !!t);
  return typeof n == "function" && rn(e, ".prototype.") > -1 ? Lr(n) : n;
};
const nn = {}, on = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: nn
}, Symbol.toStringTag, { value: "Module" })), an = /* @__PURE__ */ Pt(on);
var Xe = typeof Map == "function" && Map.prototype, De = Object.getOwnPropertyDescriptor && Xe ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null, xe = Xe && De && typeof De.get == "function" ? De.get : null, ln = Xe && Map.prototype.forEach, Ze = typeof Set == "function" && Set.prototype, Ue = Object.getOwnPropertyDescriptor && Ze ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null, Re = Ze && Ue && typeof Ue.get == "function" ? Ue.get : null, cn = Ze && Set.prototype.forEach, un = typeof WeakMap == "function" && WeakMap.prototype, fe = un ? WeakMap.prototype.has : null, fn = typeof WeakSet == "function" && WeakSet.prototype, pe = fn ? WeakSet.prototype.has : null, pn = typeof WeakRef == "function" && WeakRef.prototype, vr = pn ? WeakRef.prototype.deref : null, yn = Boolean.prototype.valueOf, sn = Object.prototype.toString, dn = Function.prototype.toString, vn = String.prototype.match, er = String.prototype.slice, U = String.prototype.replace, mn = String.prototype.toUpperCase, mr = String.prototype.toLowerCase, zr = RegExp.prototype.test, hr = Array.prototype.concat, $ = Array.prototype.join, hn = Array.prototype.slice, gr = Math.floor, Le = typeof BigInt == "function" ? BigInt.prototype.valueOf : null, _e = Object.getOwnPropertySymbols, ze = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Symbol.prototype.toString : null, ne = typeof Symbol == "function" && typeof Symbol.iterator == "object", P = typeof Symbol == "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === ne || "symbol") ? Symbol.toStringTag : null, jr = Object.prototype.propertyIsEnumerable, Sr = (typeof Reflect == "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(r) {
  return r.__proto__;
} : null);
function br(r, e) {
  if (r === 1 / 0 || r === -1 / 0 || r !== r || r && r > -1e3 && r < 1e3 || zr.call(/e/, e))
    return e;
  var t = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
  if (typeof r == "number") {
    var n = r < 0 ? -gr(-r) : gr(r);
    if (n !== r) {
      var a = String(n), o = er.call(e, a.length + 1);
      return U.call(a, t, "$&_") + "." + U.call(U.call(o, /([0-9]{3})/g, "$&_"), /_$/, "");
    }
  }
  return U.call(e, t, "$&_");
}
var je = an, Ar = je.custom, wr = qr(Ar) ? Ar : null, gn = function r(e, t, n, a) {
  var o = t || {};
  if (D(o, "quoteStyle") && o.quoteStyle !== "single" && o.quoteStyle !== "double")
    throw new TypeError('option "quoteStyle" must be "single" or "double"');
  if (D(o, "maxStringLength") && (typeof o.maxStringLength == "number" ? o.maxStringLength < 0 && o.maxStringLength !== 1 / 0 : o.maxStringLength !== null))
    throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
  var c = D(o, "customInspect") ? o.customInspect : !0;
  if (typeof c != "boolean" && c !== "symbol")
    throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
  if (D(o, "indent") && o.indent !== null && o.indent !== "	" && !(parseInt(o.indent, 10) === o.indent && o.indent > 0))
    throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
  if (D(o, "numericSeparator") && typeof o.numericSeparator != "boolean")
    throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
  var i = o.numericSeparator;
  if (typeof e > "u")
    return "undefined";
  if (e === null)
    return "null";
  if (typeof e == "boolean")
    return e ? "true" : "false";
  if (typeof e == "string")
    return Kr(e, o);
  if (typeof e == "number") {
    if (e === 0)
      return 1 / 0 / e > 0 ? "0" : "-0";
    var l = String(e);
    return i ? br(e, l) : l;
  }
  if (typeof e == "bigint") {
    var u = String(e) + "n";
    return i ? br(e, u) : u;
  }
  var f = typeof o.depth > "u" ? 5 : o.depth;
  if (typeof n > "u" && (n = 0), n >= f && f > 0 && typeof e == "object")
    return He(e) ? "[Array]" : "[Object]";
  var y = Un(o, n);
  if (typeof a > "u")
    a = [];
  else if (Jr(a, e) >= 0)
    return "[Circular]";
  function p(F, j, he) {
    if (j && (a = hn.call(a), a.push(j)), he) {
      var H = {
        depth: o.depth
      };
      return D(o, "quoteStyle") && (H.quoteStyle = o.quoteStyle), r(F, H, n + 1, a);
    }
    return r(F, o, n + 1, a);
  }
  if (typeof e == "function" && !Pr(e)) {
    var d = xn(e), s = ge(e, p);
    return "[Function" + (d ? ": " + d : " (anonymous)") + "]" + (s.length > 0 ? " { " + $.call(s, ", ") + " }" : "");
  }
  if (qr(e)) {
    var S = ne ? U.call(String(e), /^(Symbol\(.*\))_[^)]*$/, "$1") : ze.call(e);
    return typeof e == "object" && !ne ? ce(S) : S;
  }
  if (Cn(e)) {
    for (var E = "<" + mr.call(String(e.nodeName)), h = e.attributes || [], g = 0; g < h.length; g++)
      E += " " + h[g].name + "=" + Hr(Sn(h[g].value), "double", o);
    return E += ">", e.childNodes && e.childNodes.length && (E += "..."), E += "</" + mr.call(String(e.nodeName)) + ">", E;
  }
  if (He(e)) {
    if (e.length === 0)
      return "[]";
    var b = ge(e, p);
    return y && !Dn(b) ? "[" + qe(b, y) + "]" : "[ " + $.call(b, ", ") + " ]";
  }
  if (An(e)) {
    var B = ge(e, p);
    return !("cause" in Error.prototype) && "cause" in e && !jr.call(e, "cause") ? "{ [" + String(e) + "] " + $.call(hr.call("[cause]: " + p(e.cause), B), ", ") + " }" : B.length === 0 ? "[" + String(e) + "]" : "{ [" + String(e) + "] " + $.call(B, ", ") + " }";
  }
  if (typeof e == "object" && c) {
    if (wr && typeof e[wr] == "function" && je)
      return je(e, { depth: f - n });
    if (c !== "symbol" && typeof e.inspect == "function")
      return e.inspect();
  }
  if (Rn(e)) {
    var ie = [];
    return ln.call(e, function(F, j) {
      ie.push(p(j, e, !0) + " => " + p(F, e));
    }), Or("Map", xe.call(e), ie, y);
  }
  if (Nn(e)) {
    var me = [];
    return cn.call(e, function(F) {
      me.push(p(F, e));
    }), Or("Set", Re.call(e), me, y);
  }
  if ($n(e))
    return Te("WeakMap");
  if (Bn(e))
    return Te("WeakSet");
  if (Fn(e))
    return Te("WeakRef");
  if (Pn(e))
    return ce(p(Number(e)));
  if (En(e))
    return ce(p(Le.call(e)));
  if (On(e))
    return ce(yn.call(e));
  if (wn(e))
    return ce(p(String(e)));
  if (!bn(e) && !Pr(e)) {
    var T = ge(e, p), C = Sr ? Sr(e) === Object.prototype : e instanceof Object || e.constructor === Object, L = e instanceof Object ? "" : "null prototype", z = !C && P && Object(e) === e && P in e ? er.call(_(e), 8, -1) : L ? "Object" : "", le = C || typeof e.constructor != "function" ? "" : e.constructor.name ? e.constructor.name + " " : "", I = le + (z || L ? "[" + $.call(hr.call([], z || [], L || []), ": ") + "] " : "");
    return T.length === 0 ? I + "{}" : y ? I + "{" + qe(T, y) + "}" : I + "{ " + $.call(T, ", ") + " }";
  }
  return String(e);
};
function Hr(r, e, t) {
  var n = (t.quoteStyle || e) === "double" ? '"' : "'";
  return n + r + n;
}
function Sn(r) {
  return U.call(String(r), /"/g, "&quot;");
}
function He(r) {
  return _(r) === "[object Array]" && (!P || !(typeof r == "object" && P in r));
}
function bn(r) {
  return _(r) === "[object Date]" && (!P || !(typeof r == "object" && P in r));
}
function Pr(r) {
  return _(r) === "[object RegExp]" && (!P || !(typeof r == "object" && P in r));
}
function An(r) {
  return _(r) === "[object Error]" && (!P || !(typeof r == "object" && P in r));
}
function wn(r) {
  return _(r) === "[object String]" && (!P || !(typeof r == "object" && P in r));
}
function Pn(r) {
  return _(r) === "[object Number]" && (!P || !(typeof r == "object" && P in r));
}
function On(r) {
  return _(r) === "[object Boolean]" && (!P || !(typeof r == "object" && P in r));
}
function qr(r) {
  if (ne)
    return r && typeof r == "object" && r instanceof Symbol;
  if (typeof r == "symbol")
    return !0;
  if (!r || typeof r != "object" || !ze)
    return !1;
  try {
    return ze.call(r), !0;
  } catch (e) {
  }
  return !1;
}
function En(r) {
  if (!r || typeof r != "object" || !Le)
    return !1;
  try {
    return Le.call(r), !0;
  } catch (e) {
  }
  return !1;
}
var In = Object.prototype.hasOwnProperty || function(r) {
  return r in this;
};
function D(r, e) {
  return In.call(r, e);
}
function _(r) {
  return sn.call(r);
}
function xn(r) {
  if (r.name)
    return r.name;
  var e = vn.call(dn.call(r), /^function\s*([\w$]+)/);
  return e ? e[1] : null;
}
function Jr(r, e) {
  if (r.indexOf)
    return r.indexOf(e);
  for (var t = 0, n = r.length; t < n; t++)
    if (r[t] === e)
      return t;
  return -1;
}
function Rn(r) {
  if (!xe || !r || typeof r != "object")
    return !1;
  try {
    xe.call(r);
    try {
      Re.call(r);
    } catch (e) {
      return !0;
    }
    return r instanceof Map;
  } catch (e) {
  }
  return !1;
}
function $n(r) {
  if (!fe || !r || typeof r != "object")
    return !1;
  try {
    fe.call(r, fe);
    try {
      pe.call(r, pe);
    } catch (e) {
      return !0;
    }
    return r instanceof WeakMap;
  } catch (e) {
  }
  return !1;
}
function Fn(r) {
  if (!vr || !r || typeof r != "object")
    return !1;
  try {
    return vr.call(r), !0;
  } catch (e) {
  }
  return !1;
}
function Nn(r) {
  if (!Re || !r || typeof r != "object")
    return !1;
  try {
    Re.call(r);
    try {
      xe.call(r);
    } catch (e) {
      return !0;
    }
    return r instanceof Set;
  } catch (e) {
  }
  return !1;
}
function Bn(r) {
  if (!pe || !r || typeof r != "object")
    return !1;
  try {
    pe.call(r, pe);
    try {
      fe.call(r, fe);
    } catch (e) {
      return !0;
    }
    return r instanceof WeakSet;
  } catch (e) {
  }
  return !1;
}
function Cn(r) {
  return !r || typeof r != "object" ? !1 : typeof HTMLElement < "u" && r instanceof HTMLElement ? !0 : typeof r.nodeName == "string" && typeof r.getAttribute == "function";
}
function Kr(r, e) {
  if (r.length > e.maxStringLength) {
    var t = r.length - e.maxStringLength, n = "... " + t + " more character" + (t > 1 ? "s" : "");
    return Kr(er.call(r, 0, e.maxStringLength), e) + n;
  }
  var a = U.call(U.call(r, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, Mn);
  return Hr(a, "single", e);
}
function Mn(r) {
  var e = r.charCodeAt(0), t = {
    8: "b",
    9: "t",
    10: "n",
    12: "f",
    13: "r"
  }[e];
  return t ? "\\" + t : "\\x" + (e < 16 ? "0" : "") + mn.call(e.toString(16));
}
function ce(r) {
  return "Object(" + r + ")";
}
function Te(r) {
  return r + " { ? }";
}
function Or(r, e, t, n) {
  var a = n ? qe(t, n) : $.call(t, ", ");
  return r + " (" + e + ") {" + a + "}";
}
function Dn(r) {
  for (var e = 0; e < r.length; e++)
    if (Jr(r[e], "\n") >= 0)
      return !1;
  return !0;
}
function Un(r, e) {
  var t;
  if (r.indent === "	")
    t = "	";
  else if (typeof r.indent == "number" && r.indent > 0)
    t = $.call(Array(r.indent + 1), " ");
  else
    return null;
  return {
    base: t,
    prev: $.call(Array(e + 1), t)
  };
}
function qe(r, e) {
  if (r.length === 0)
    return "";
  var t = "\n" + e.prev + e.base;
  return t + $.call(r, "," + t) + "\n" + e.prev;
}
function ge(r, e) {
  var t = He(r), n = [];
  if (t) {
    n.length = r.length;
    for (var a = 0; a < r.length; a++)
      n[a] = D(r, a) ? e(r[a], r) : "";
  }
  var o = typeof _e == "function" ? _e(r) : [], c;
  if (ne) {
    c = {};
    for (var i = 0; i < o.length; i++)
      c["$" + o[i]] = o[i];
  }
  for (var l in r)
    D(r, l) && (t && String(Number(l)) === l && l < r.length || ne && c["$" + l] instanceof Symbol || (zr.call(/[^\w$]/, l) ? n.push(e(l, r) + ": " + e(r[l], r)) : n.push(l + ": " + e(r[l], r))));
  if (typeof _e == "function")
    for (var u = 0; u < o.length; u++)
      jr.call(r, o[u]) && n.push("[" + e(o[u]) + "]: " + e(r[o[u]], r));
  return n;
}
var rr = Lt, ae = tn, _n = gn, Tn = rr("%TypeError%"), Se = rr("%WeakMap%", !0), be = rr("%Map%", !0), kn = ae("WeakMap.prototype.get", !0), Vn = ae("WeakMap.prototype.set", !0), Wn = ae("WeakMap.prototype.has", !0), Gn = ae("Map.prototype.get", !0), Ln = ae("Map.prototype.set", !0), zn = ae("Map.prototype.has", !0), tr = function(r, e) {
  for (var t = r, n; (n = t.next) !== null; t = n)
    if (n.key === e)
      return t.next = n.next, n.next = r.next, r.next = n, n;
}, jn = function(r, e) {
  var t = tr(r, e);
  return t && t.value;
}, Hn = function(r, e, t) {
  var n = tr(r, e);
  n ? n.value = t : r.next = {
    // eslint-disable-line no-param-reassign
    key: e,
    next: r.next,
    value: t
  };
}, qn = function(r, e) {
  return !!tr(r, e);
}, Jn = function() {
  var e, t, n, a = {
    assert: function(o) {
      if (!a.has(o))
        throw new Tn("Side channel does not contain " + _n(o));
    },
    get: function(o) {
      if (Se && o && (typeof o == "object" || typeof o == "function")) {
        if (e)
          return kn(e, o);
      } else if (be) {
        if (t)
          return Gn(t, o);
      } else if (n)
        return jn(n, o);
    },
    has: function(o) {
      if (Se && o && (typeof o == "object" || typeof o == "function")) {
        if (e)
          return Wn(e, o);
      } else if (be) {
        if (t)
          return zn(t, o);
      } else if (n)
        return qn(n, o);
      return !1;
    },
    set: function(o, c) {
      Se && o && (typeof o == "object" || typeof o == "function") ? (e || (e = new Se()), Vn(e, o, c)) : be ? (t || (t = new be()), Ln(t, o, c)) : (n || (n = { key: {}, next: null }), Hn(n, o, c));
    }
  };
  return a;
}, Kn = String.prototype.replace, Qn = /%20/g, ke = {
  RFC1738: "RFC1738",
  RFC3986: "RFC3986"
}, nr = {
  default: ke.RFC3986,
  formatters: {
    RFC1738: function(r) {
      return Kn.call(r, Qn, "+");
    },
    RFC3986: function(r) {
      return String(r);
    }
  },
  RFC1738: ke.RFC1738,
  RFC3986: ke.RFC3986
}, Yn = nr, Ve = Object.prototype.hasOwnProperty, k = Array.isArray, x = function() {
  for (var r = [], e = 0; e < 256; ++e)
    r.push("%" + ((e < 16 ? "0" : "") + e.toString(16)).toUpperCase());
  return r;
}(), Xn = function(e) {
  for (; e.length > 1; ) {
    var t = e.pop(), n = t.obj[t.prop];
    if (k(n)) {
      for (var a = [], o = 0; o < n.length; ++o)
        typeof n[o] < "u" && a.push(n[o]);
      t.obj[t.prop] = a;
    }
  }
}, Qr = function(e, t) {
  for (var n = t && t.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, a = 0; a < e.length; ++a)
    typeof e[a] < "u" && (n[a] = e[a]);
  return n;
}, Zn = function r(e, t, n) {
  if (!t)
    return e;
  if (typeof t != "object") {
    if (k(e))
      e.push(t);
    else if (e && typeof e == "object")
      (n && (n.plainObjects || n.allowPrototypes) || !Ve.call(Object.prototype, t)) && (e[t] = !0);
    else
      return [e, t];
    return e;
  }
  if (!e || typeof e != "object")
    return [e].concat(t);
  var a = e;
  return k(e) && !k(t) && (a = Qr(e, n)), k(e) && k(t) ? (t.forEach(function(o, c) {
    if (Ve.call(e, c)) {
      var i = e[c];
      i && typeof i == "object" && o && typeof o == "object" ? e[c] = r(i, o, n) : e.push(o);
    } else
      e[c] = o;
  }), e) : Object.keys(t).reduce(function(o, c) {
    var i = t[c];
    return Ve.call(o, c) ? o[c] = r(o[c], i, n) : o[c] = i, o;
  }, a);
}, eo = function(e, t) {
  return Object.keys(t).reduce(function(n, a) {
    return n[a] = t[a], n;
  }, e);
}, ro = function(r, e, t) {
  var n = r.replace(/\+/g, " ");
  if (t === "iso-8859-1")
    return n.replace(/%[0-9a-f]{2}/gi, unescape);
  try {
    return decodeURIComponent(n);
  } catch (a) {
    return n;
  }
}, to = function(e, t, n, a, o) {
  if (e.length === 0)
    return e;
  var c = e;
  if (typeof e == "symbol" ? c = Symbol.prototype.toString.call(e) : typeof e != "string" && (c = String(e)), n === "iso-8859-1")
    return escape(c).replace(/%u[0-9a-f]{4}/gi, function(f) {
      return "%26%23" + parseInt(f.slice(2), 16) + "%3B";
    });
  for (var i = "", l = 0; l < c.length; ++l) {
    var u = c.charCodeAt(l);
    if (u === 45 || u === 46 || u === 95 || u === 126 || u >= 48 && u <= 57 || u >= 65 && u <= 90 || u >= 97 && u <= 122 || o === Yn.RFC1738 && (u === 40 || u === 41)) {
      i += c.charAt(l);
      continue;
    }
    if (u < 128) {
      i = i + x[u];
      continue;
    }
    if (u < 2048) {
      i = i + (x[192 | u >> 6] + x[128 | u & 63]);
      continue;
    }
    if (u < 55296 || u >= 57344) {
      i = i + (x[224 | u >> 12] + x[128 | u >> 6 & 63] + x[128 | u & 63]);
      continue;
    }
    l += 1, u = 65536 + ((u & 1023) << 10 | c.charCodeAt(l) & 1023), i += x[240 | u >> 18] + x[128 | u >> 12 & 63] + x[128 | u >> 6 & 63] + x[128 | u & 63];
  }
  return i;
}, no = function(e) {
  for (var t = [{ obj: { o: e }, prop: "o" }], n = [], a = 0; a < t.length; ++a)
    for (var o = t[a], c = o.obj[o.prop], i = Object.keys(c), l = 0; l < i.length; ++l) {
      var u = i[l], f = c[u];
      typeof f == "object" && f !== null && n.indexOf(f) === -1 && (t.push({ obj: c, prop: u }), n.push(f));
    }
  return Xn(t), e;
}, oo = function(e) {
  return Object.prototype.toString.call(e) === "[object RegExp]";
}, ao = function(e) {
  return !e || typeof e != "object" ? !1 : !!(e.constructor && e.constructor.isBuffer && e.constructor.isBuffer(e));
}, io = function(e, t) {
  return [].concat(e, t);
}, lo = function(e, t) {
  if (k(e)) {
    for (var n = [], a = 0; a < e.length; a += 1)
      n.push(t(e[a]));
    return n;
  }
  return t(e);
}, Yr = {
  arrayToObject: Qr,
  assign: eo,
  combine: io,
  compact: no,
  decode: ro,
  encode: to,
  isBuffer: ao,
  isRegExp: oo,
  maybeMap: lo,
  merge: Zn
}, Xr = Jn, we = Yr, ye = nr, co = Object.prototype.hasOwnProperty, Er = {
  brackets: function(e) {
    return e + "[]";
  },
  comma: "comma",
  indices: function(e, t) {
    return e + "[" + t + "]";
  },
  repeat: function(e) {
    return e;
  }
}, N = Array.isArray, uo = Array.prototype.push, Zr = function(r, e) {
  uo.apply(r, N(e) ? e : [e]);
}, fo = Date.prototype.toISOString, Ir = ye.default, w = {
  addQueryPrefix: !1,
  allowDots: !1,
  charset: "utf-8",
  charsetSentinel: !1,
  delimiter: "&",
  encode: !0,
  encoder: we.encode,
  encodeValuesOnly: !1,
  format: Ir,
  formatter: ye.formatters[Ir],
  // deprecated
  indices: !1,
  serializeDate: function(e) {
    return fo.call(e);
  },
  skipNulls: !1,
  strictNullHandling: !1
}, po = function(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "symbol" || typeof e == "bigint";
}, We = {}, yo = function r(e, t, n, a, o, c, i, l, u, f, y, p, d, s, S, E) {
  for (var h = e, g = E, b = 0, B = !1; (g = g.get(We)) !== void 0 && !B; ) {
    var ie = g.get(e);
    if (b += 1, typeof ie < "u") {
      if (ie === b)
        throw new RangeError("Cyclic object value");
      B = !0;
    }
    typeof g.get(We) > "u" && (b = 0);
  }
  if (typeof l == "function" ? h = l(t, h) : h instanceof Date ? h = y(h) : n === "comma" && N(h) && (h = we.maybeMap(h, function(H) {
    return H instanceof Date ? y(H) : H;
  })), h === null) {
    if (o)
      return i && !s ? i(t, w.encoder, S, "key", p) : t;
    h = "";
  }
  if (po(h) || we.isBuffer(h)) {
    if (i) {
      var me = s ? t : i(t, w.encoder, S, "key", p);
      return [d(me) + "=" + d(i(h, w.encoder, S, "value", p))];
    }
    return [d(t) + "=" + d(String(h))];
  }
  var T = [];
  if (typeof h > "u")
    return T;
  var C;
  if (n === "comma" && N(h))
    s && i && (h = we.maybeMap(h, i)), C = [{ value: h.length > 0 ? h.join(",") || null : void 0 }];
  else if (N(l))
    C = l;
  else {
    var L = Object.keys(h);
    C = u ? L.sort(u) : L;
  }
  for (var z = a && N(h) && h.length === 1 ? t + "[]" : t, le = 0; le < C.length; ++le) {
    var I = C[le], F = typeof I == "object" && typeof I.value < "u" ? I.value : h[I];
    if (!(c && F === null)) {
      var j = N(h) ? typeof n == "function" ? n(z, I) : z : z + (f ? "." + I : "[" + I + "]");
      E.set(e, b);
      var he = Xr();
      he.set(We, E), Zr(T, r(
        F,
        j,
        n,
        a,
        o,
        c,
        n === "comma" && s && N(h) ? null : i,
        l,
        u,
        f,
        y,
        p,
        d,
        s,
        S,
        he
      ));
    }
  }
  return T;
}, so = function(e) {
  if (!e)
    return w;
  if (e.encoder !== null && typeof e.encoder < "u" && typeof e.encoder != "function")
    throw new TypeError("Encoder has to be a function.");
  var t = e.charset || w.charset;
  if (typeof e.charset < "u" && e.charset !== "utf-8" && e.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var n = ye.default;
  if (typeof e.format < "u") {
    if (!co.call(ye.formatters, e.format))
      throw new TypeError("Unknown format option provided.");
    n = e.format;
  }
  var a = ye.formatters[n], o = w.filter;
  return (typeof e.filter == "function" || N(e.filter)) && (o = e.filter), {
    addQueryPrefix: typeof e.addQueryPrefix == "boolean" ? e.addQueryPrefix : w.addQueryPrefix,
    allowDots: typeof e.allowDots > "u" ? w.allowDots : !!e.allowDots,
    charset: t,
    charsetSentinel: typeof e.charsetSentinel == "boolean" ? e.charsetSentinel : w.charsetSentinel,
    delimiter: typeof e.delimiter > "u" ? w.delimiter : e.delimiter,
    encode: typeof e.encode == "boolean" ? e.encode : w.encode,
    encoder: typeof e.encoder == "function" ? e.encoder : w.encoder,
    encodeValuesOnly: typeof e.encodeValuesOnly == "boolean" ? e.encodeValuesOnly : w.encodeValuesOnly,
    filter: o,
    format: n,
    formatter: a,
    serializeDate: typeof e.serializeDate == "function" ? e.serializeDate : w.serializeDate,
    skipNulls: typeof e.skipNulls == "boolean" ? e.skipNulls : w.skipNulls,
    sort: typeof e.sort == "function" ? e.sort : null,
    strictNullHandling: typeof e.strictNullHandling == "boolean" ? e.strictNullHandling : w.strictNullHandling
  };
}, vo = function(r, e) {
  var t = r, n = so(e), a, o;
  typeof n.filter == "function" ? (o = n.filter, t = o("", t)) : N(n.filter) && (o = n.filter, a = o);
  var c = [];
  if (typeof t != "object" || t === null)
    return "";
  var i;
  e && e.arrayFormat in Er ? i = e.arrayFormat : e && "indices" in e ? i = e.indices ? "indices" : "repeat" : i = "indices";
  var l = Er[i];
  if (e && "commaRoundTrip" in e && typeof e.commaRoundTrip != "boolean")
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  var u = l === "comma" && e && e.commaRoundTrip;
  a || (a = Object.keys(t)), n.sort && a.sort(n.sort);
  for (var f = Xr(), y = 0; y < a.length; ++y) {
    var p = a[y];
    n.skipNulls && t[p] === null || Zr(c, yo(
      t[p],
      p,
      l,
      u,
      n.strictNullHandling,
      n.skipNulls,
      n.encode ? n.encoder : null,
      n.filter,
      n.sort,
      n.allowDots,
      n.serializeDate,
      n.format,
      n.formatter,
      n.encodeValuesOnly,
      n.charset,
      f
    ));
  }
  var d = c.join(n.delimiter), s = n.addQueryPrefix === !0 ? "?" : "";
  return n.charsetSentinel && (n.charset === "iso-8859-1" ? s += "utf8=%26%2310003%3B&" : s += "utf8=%E2%9C%93&"), d.length > 0 ? s + d : "";
}, oe = Yr, Je = Object.prototype.hasOwnProperty, mo = Array.isArray, A = {
  allowDots: !1,
  allowPrototypes: !1,
  allowSparse: !1,
  arrayLimit: 20,
  charset: "utf-8",
  charsetSentinel: !1,
  comma: !1,
  decoder: oe.decode,
  delimiter: "&",
  depth: 5,
  ignoreQueryPrefix: !1,
  interpretNumericEntities: !1,
  parameterLimit: 1e3,
  parseArrays: !0,
  plainObjects: !1,
  strictNullHandling: !1
}, ho = function(r) {
  return r.replace(/&#(\d+);/g, function(e, t) {
    return String.fromCharCode(parseInt(t, 10));
  });
}, et = function(r, e) {
  return r && typeof r == "string" && e.comma && r.indexOf(",") > -1 ? r.split(",") : r;
}, go = "utf8=%26%2310003%3B", So = "utf8=%E2%9C%93", bo = function(e, t) {
  var n = { __proto__: null }, a = t.ignoreQueryPrefix ? e.replace(/^\?/, "") : e, o = t.parameterLimit === 1 / 0 ? void 0 : t.parameterLimit, c = a.split(t.delimiter, o), i = -1, l, u = t.charset;
  if (t.charsetSentinel)
    for (l = 0; l < c.length; ++l)
      c[l].indexOf("utf8=") === 0 && (c[l] === So ? u = "utf-8" : c[l] === go && (u = "iso-8859-1"), i = l, l = c.length);
  for (l = 0; l < c.length; ++l)
    if (l !== i) {
      var f = c[l], y = f.indexOf("]="), p = y === -1 ? f.indexOf("=") : y + 1, d, s;
      p === -1 ? (d = t.decoder(f, A.decoder, u, "key"), s = t.strictNullHandling ? null : "") : (d = t.decoder(f.slice(0, p), A.decoder, u, "key"), s = oe.maybeMap(
        et(f.slice(p + 1), t),
        function(S) {
          return t.decoder(S, A.decoder, u, "value");
        }
      )), s && t.interpretNumericEntities && u === "iso-8859-1" && (s = ho(s)), f.indexOf("[]=") > -1 && (s = mo(s) ? [s] : s), Je.call(n, d) ? n[d] = oe.combine(n[d], s) : n[d] = s;
    }
  return n;
}, Ao = function(r, e, t, n) {
  for (var a = n ? e : et(e, t), o = r.length - 1; o >= 0; --o) {
    var c, i = r[o];
    if (i === "[]" && t.parseArrays)
      c = [].concat(a);
    else {
      c = t.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
      var l = i.charAt(0) === "[" && i.charAt(i.length - 1) === "]" ? i.slice(1, -1) : i, u = parseInt(l, 10);
      !t.parseArrays && l === "" ? c = { 0: a } : !isNaN(u) && i !== l && String(u) === l && u >= 0 && t.parseArrays && u <= t.arrayLimit ? (c = [], c[u] = a) : l !== "__proto__" && (c[l] = a);
    }
    a = c;
  }
  return a;
}, wo = function(e, t, n, a) {
  if (e) {
    var o = n.allowDots ? e.replace(/\.([^.[]+)/g, "[$1]") : e, c = /(\[[^[\]]*])/, i = /(\[[^[\]]*])/g, l = n.depth > 0 && c.exec(o), u = l ? o.slice(0, l.index) : o, f = [];
    if (u) {
      if (!n.plainObjects && Je.call(Object.prototype, u) && !n.allowPrototypes)
        return;
      f.push(u);
    }
    for (var y = 0; n.depth > 0 && (l = i.exec(o)) !== null && y < n.depth; ) {
      if (y += 1, !n.plainObjects && Je.call(Object.prototype, l[1].slice(1, -1)) && !n.allowPrototypes)
        return;
      f.push(l[1]);
    }
    return l && f.push("[" + o.slice(l.index) + "]"), Ao(f, t, n, a);
  }
}, Po = function(e) {
  if (!e)
    return A;
  if (e.decoder !== null && e.decoder !== void 0 && typeof e.decoder != "function")
    throw new TypeError("Decoder has to be a function.");
  if (typeof e.charset < "u" && e.charset !== "utf-8" && e.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var t = typeof e.charset > "u" ? A.charset : e.charset;
  return {
    allowDots: typeof e.allowDots > "u" ? A.allowDots : !!e.allowDots,
    allowPrototypes: typeof e.allowPrototypes == "boolean" ? e.allowPrototypes : A.allowPrototypes,
    allowSparse: typeof e.allowSparse == "boolean" ? e.allowSparse : A.allowSparse,
    arrayLimit: typeof e.arrayLimit == "number" ? e.arrayLimit : A.arrayLimit,
    charset: t,
    charsetSentinel: typeof e.charsetSentinel == "boolean" ? e.charsetSentinel : A.charsetSentinel,
    comma: typeof e.comma == "boolean" ? e.comma : A.comma,
    decoder: typeof e.decoder == "function" ? e.decoder : A.decoder,
    delimiter: typeof e.delimiter == "string" || oe.isRegExp(e.delimiter) ? e.delimiter : A.delimiter,
    // eslint-disable-next-line no-implicit-coercion, no-extra-parens
    depth: typeof e.depth == "number" || e.depth === !1 ? +e.depth : A.depth,
    ignoreQueryPrefix: e.ignoreQueryPrefix === !0,
    interpretNumericEntities: typeof e.interpretNumericEntities == "boolean" ? e.interpretNumericEntities : A.interpretNumericEntities,
    parameterLimit: typeof e.parameterLimit == "number" ? e.parameterLimit : A.parameterLimit,
    parseArrays: e.parseArrays !== !1,
    plainObjects: typeof e.plainObjects == "boolean" ? e.plainObjects : A.plainObjects,
    strictNullHandling: typeof e.strictNullHandling == "boolean" ? e.strictNullHandling : A.strictNullHandling
  };
}, Oo = function(r, e) {
  var t = Po(e);
  if (r === "" || r === null || typeof r > "u")
    return t.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  for (var n = typeof r == "string" ? bo(r, t) : r, a = t.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, o = Object.keys(n), c = 0; c < o.length; ++c) {
    var i = o[c], l = wo(i, n[i], t, typeof r == "string");
    a = oe.merge(a, l, t);
  }
  return t.allowSparse === !0 ? a : oe.compact(a);
}, Eo = vo, Io = Oo, xo = nr, Ro = {
  formats: xo,
  parse: Io,
  stringify: Eo
};
const $o = /* @__PURE__ */ wt(Ro);
var Fo = Object.defineProperty, No = (r, e, t) => e in r ? Fo(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, se = (r, e, t) => (No(r, typeof e != "symbol" ? e + "" : e, t), t);
const Bo = /* @__PURE__ */ Ye({
  name: "IBizBreadcrumb",
  props: {
    items: {
      type: Array,
      required: !0
    }
  },
  emits: {
    click: (r) => !0
  },
  setup(r, {
    emit: e
  }) {
    return {
      ns: Br("breadcrumb"),
      handleClick: (t, n) => {
        t.stopPropagation(), n !== r.items.length - 1 && e("click", r.items[n]);
      }
    };
  },
  render() {
    return O("div", {
      class: this.ns.b()
    }, [this.items.map((r, e) => O("div", {
      class: [this.ns.e("item"), this.ns.is("active", e === this.items.length - 1)]
    }, [O("div", {
      class: this.ns.e("item-content"),
      onClick: (t) => {
        this.handleClick(t, e);
      }
    }, [O("div", {
      class: this.ns.em("item", "text")
    }, [r.caption || ""])]), e !== this.items.length - 1 && O("div", {
      class: this.ns.em("item", "separator")
    }, [ct("/")])]))]);
  }
});
function Co(r) {
  return typeof r == "function" || Object.prototype.toString.call(r) === "[object Object]" && !ut(r);
}
const xr = /* @__PURE__ */ Ye({
  name: "IBizBreadcrumbNavPos",
  props: {
    modelData: {
      type: Object,
      required: !0
    },
    controller: {
      type: Object,
      required: !0
    }
  },
  setup(r) {
    const e = r.controller, t = Br("breadcrumb-nav-pos"), n = (f) => {
      e.onViewCreated(f);
    }, a = Mr(), o = Dr(), c = Y(!1), i = Y(!0), l = Y(!1), u = Y({});
    if (e.setRouter(a), e.routeDepth) {
      const f = ar(o, e.routeDepth);
      lt(() => o.fullPath, () => {
        l.value = o.fullPath.indexOf("/route-modal") !== -1;
        const y = ar(o, e.routeDepth);
        if (f === y && o.matched.length > e.routeDepth) {
          if (o.matched.length === e.routeDepth + 1 && (c.value = !!o.name, c.value))
            return;
          l.value && (u.value = new tt({
            mode: nt.ROUTE,
            routeDepth: o.matched.length
          })), e.onRouteChange(o);
        }
      }, {
        immediate: !0
      });
    }
    return Nr(() => {
      i.value = !0;
    }), Fr(() => {
      i.value = !1;
    }), Qe(() => {
      e.clearBreadcrumb();
    }), {
      ns: t,
      c: e,
      isPresetView: c,
      isActivated: i,
      routeModal: u,
      isModalRoute: l,
      onViewCreated: n
    };
  },
  render() {
    const {
      state: r
    } = this.c, {
      currentKey: e,
      cacheKeys: t,
      navViewMsgs: n,
      cache: a,
      breadcrumb: o
    } = r;
    let c = null;
    const i = e && n[e] ? Ge(Ae("IBizViewShell"), {
      context: n[e].context,
      params: n[e].params,
      key: this.c.ignoreEmbedKey ? void 0 : e,
      viewId: n[e].viewId,
      onCreated: this.onViewCreated
    }) : null;
    return c = a ? O(Ae("keepAlive"), {
      include: t,
      max: 30,
      isKey: !0
    }, Co(i) ? i : {
      default: () => [i]
    }) : i, O("div", {
      class: [this.ns.b(), this.ns.m(this.modelData.id), ...this.controller.containerClass, this.ns.is("show-breadcrumb", this.controller.state.showBreadcrumd)]
    }, [this.controller.state.showBreadcrumd && O("div", {
      class: this.ns.e("header")
    }, [O("div", {
      class: this.ns.em("header", "left")
    }, [O(Bo, {
      items: o,
      onClick: (l) => this.c.handleBreadcrumbSkip(l)
    }, null)]), O("div", {
      class: this.ns.em("header", "right")
    }, [O("div", {
      id: "breadcrumb-nav-pos-searchbar"
    }, null), O("div", {
      id: "breadcrumb-nav-pos-toolbar"
    }, null)])]), c, this.isModalRoute && O(Ae("customModalRouterShell"), {
      modal: this.routeModal
    }, null)]);
  }
});
class Mo extends vt {
  constructor() {
    super(...arguments), se(this, "breadcrumb", []), se(this, "showBreadcrumd", !0), se(this, "routeManualKey", "DEFAULT");
  }
}
var Rr;
class Do extends pt {
  constructor() {
    super(...arguments), se(this, "localStorageKey", "".concat((Rr = this.panel.view.model.codeName) == null ? void 0 : Rr.toLowerCase(), "@breadcrumb-nav-pos"));
  }
  /**
   * 创建导航占位状态对象
   *
   * @protected
   * @return {*}  {BreadcrumbNavPosState}
   * @memberof BreadcrumbNavPosController
   */
  createState() {
    var e;
    return new Mo((e = this.parent) == null ? void 0 : e.state);
  }
  /**
   * 查找指定面包屑
   *
   * @param {string} key 缓存key
   * @return {*}  {(IBreadcrumb | undefined)}
   * @memberof BreadcrumbNavPosController
   */
  findBreadcrumb(e) {
    return this.state.breadcrumb.find((t) => this.calcCacheKey(t) === e);
  }
  /**
   * 初始化
   *
   * @protected
   * @return {*}  {Promise<void>}
   * @memberof BreadcrumbNavPosController
   */
  async onInit() {
    await super.onInit(), this.rawItemParams.show_breadcrumb === "false" && (this.state.showBreadcrumd = !1), this.state.breadcrumb = this.getBreadcrumb();
  }
  /**
   * 根据路由计算面包屑数据
   *
   * @protected
   * @param {Route} route
   * @return {*}  {Promise<void>}
   * @memberof BreadcrumbNavPosController
   */
  async calcBreadcrumbByRoute(e) {
    let { pathNodes: t } = Cr(e);
    t = t.slice(this.routeDepth).filter((n) => n.viewName !== "route-modal"), e.fullPath.indexOf("/route-modal") !== -1 && (this.state.routeManualKey = e.fullPath), this.state.breadcrumb = await Promise.all(
      t.map(async (n, a) => {
        var o;
        const { context: c, params: i, viewName: l } = n, u = await ibiz.hub.config.view.get(l);
        let f = "undefined";
        if (u.appDataEntityId) {
          const p = ot(u.appDataEntityId);
          f = (o = n.context) == null ? void 0 : o[p.toLowerCase()];
        }
        const y = this.calcCacheKey({
          key: f,
          viewId: l
        });
        return this.findBreadcrumb(y) || {
          key: f,
          params: i,
          context: ue.create(
            {
              ...c,
              srfdefaulttoroutedepth: this.routeDepth + 2 + a
            },
            this.panel.context
          ),
          viewId: l
        };
      })
    );
  }
  /**
   * 处理面包屑跳转
   *
   * @param {IBreadcrumb} item
   * @memberof BreadcrumbNavPosController
   */
  handleBreadcrumbSkip(e) {
    e.fullPath && this.router.push(e.fullPath);
  }
  /**
   * 路由变化
   *
   * @param {Route} route
   * @memberof BreadcrumbNavPosController
   */
  async onRouteChange(e) {
    await this.calcBreadcrumbByRoute(e), this.state.breadcrumb.forEach((t) => {
      const n = this.calcCacheKey(t);
      this.state.navViewMsgs[n] = t;
    }), this.curNavViewMsg = this.state.breadcrumb[this.state.breadcrumb.length - 1], super.onRouteChange(e);
  }
  /**
   * 打开视图
   *
   * @param {INavViewMsg} openViewMsg
   * @memberof BreadcrumbNavPosController
   */
  openView(e) {
    e.viewId && super.openView(e);
  }
  /**
   * 视图创建
   *
   * @param {EventBase} event
   * @memberof BreadcrumbNavPosController
   */
  onViewCreated(e) {
    super.onViewCreated(e), this.curNavViewMsg.caption = e.view.model.caption, e.view.evt.on("onViewInfoChange", ({ dataInfo: t }) => {
      this.curNavViewMsg.caption = t;
    }), this.saveBreadcrumb();
  }
  /**
   * 保存面包屑
   *
   * @memberof BreadcrumbNavPosController
   */
  saveBreadcrumb() {
    const e = [];
    this.state.breadcrumb.forEach((t) => {
      var n;
      const a = { ...t };
      a.context = (n = t.context) == null ? void 0 : n.getOwnContext(), e.push(a);
    }), localStorage.setItem(this.localStorageKey, JSON.stringify(e));
  }
  /**
   * 获取面包屑
   *
   * @return {*}  {IBreadcrumb[]}
   * @memberof BreadcrumbNavPosController
   */
  getBreadcrumb() {
    const e = localStorage.getItem(this.localStorageKey);
    try {
      if (e) {
        const t = JSON.parse(e);
        return Array.isArray(t) ? (t.forEach((n) => {
          n.context = ue.create(n.context, this.panel.context);
        }), t) : [];
      }
    } catch (t) {
      ibiz.log.error(t);
    }
    return [];
  }
  /**
   * 清除面包屑
   *
   * @memberof BreadcrumbNavPosController
   */
  clearBreadcrumb() {
    localStorage.removeItem(this.localStorageKey);
  }
}
class Uo {
  constructor() {
    se(this, "component", "IBizBreadcrumbNavPos");
  }
  /**
   * 创建控制器
   *
   * @param {IPanelItem} panelItem
   * @param {PanelController} panel
   * @param {(PanelItemController | undefined)} parent
   * @return {*}  {Promise<IPanelItemNavPosController>}
   * @memberof BreadcrumbNavPosProvider
   */
  async createController(e, t, n) {
    const a = new Do(e, t, n);
    return await a.init(), a;
  }
}
const $r = /* @__PURE__ */ Ye({
  name: "CustomModalRouterShell",
  props: {
    modal: {
      type: Object,
      required: !0
    }
  },
  setup(r) {
    const e = Dr(), t = Mr(), n = Y(!1), a = Y({}), o = [], c = () => {
      if (a.value.context) {
        const {
          context: f
        } = ft(a.value);
        f && f.destroy();
      }
    }, i = r.modal.routeDepth;
    let l = null;
    Qe(() => {
      n.value = !0, l && (l.dismiss(), l = null), c();
    });
    const u = async (f) => {
      var y;
      if (a.value = await yt(f, i, !0), n.value)
        return;
      a.value.context instanceof ue || (a.value.context = ue.create(a.value.context));
      const p = f.params.modalView, d = f.params.modalParams;
      if (d && d !== "-") {
        const g = $o.parse(d, {
          strictNullHandling: !0,
          delimiter: ";"
        });
        if (g.srfnavctx) {
          const b = JSON.parse(decodeURIComponent(g.srfnavctx));
          Object.assign(a.value.context, b), delete g.srfnavctx;
        }
        g.srfnav && (a.value.srfnav = g.srfnav, delete g.srfnav), mt(g) || (a.value.params ? Object.assign(a.value.params, g) : a.value.params = g);
      }
      if (!a.value.context) {
        const g = ue.create({});
        a.value.context = g;
      }
      let s = a.value.viewConfig, S;
      try {
        s || (s = await ibiz.hub.config.view.get(p)), S = st({
          context: a.value.context,
          params: a.value.params,
          viewId: s.id
        });
      } catch (g) {
        const b = at("404");
        b && (typeof b.component == "string" && (S = Ge(Ae(b.component))), S = Ge(b.component));
      }
      const E = {
        width: (s == null ? void 0 : s.width) || "80%",
        height: (s == null ? void 0 : s.height) || "80%",
        footerHide: !0,
        isRouteModal: !0
      };
      l = ibiz.overlay.createModal(S, void 0, E), l.present(), o.push(f.fullPath);
      const h = await l.onWillDismiss();
      if (l = null, n.value === !1) {
        const g = o.indexOf(f.fullPath);
        if (g !== -1 && o.splice(g, 1), (y = window.history.state) != null && y.back)
          t.back();
        else {
          const {
            path: b
          } = f, B = b.indexOf("/".concat(or.ROUTE_MODAL_TAG, "/"));
          t.replace(b.substring(0, B));
        }
        dt.close(t.currentRoute.value.fullPath, h || {
          ok: !1
        });
      }
    };
    return At((f, y) => {
      if (!n.value && o.length > 0 && o.indexOf(y.fullPath) !== -1 && o.indexOf(f.fullPath) === -1) {
        const {
          pathNodes: p
        } = Cr(f), d = p[p.length - 1];
        d && d.viewName === or.ROUTE_MODAL_TAG && u(f);
      }
    }), u(e), {};
  },
  render() {
    return O("div", {
      style: "position: absolute;width: 0;height: 0;"
    }, null);
  }
}), Go = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(r) {
    r.component(xr.name, xr), r.component($r.name, $r), rt(
      "CUSTOM_BREADCRUMB_NAV_POS",
      () => new Uo()
    );
  }
};
export {
  Go as default
};
