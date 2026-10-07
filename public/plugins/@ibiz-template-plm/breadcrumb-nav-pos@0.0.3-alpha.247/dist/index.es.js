import './assets/style.css';
import { registerPanelItemProvider as Jr, Modal as Kr, ViewMode as Qr, RouteConst as tr, calcDeCodeNameById as Yr, getErrorViewProvider as Xr } from "@ibiz-template/runtime";
import { defineComponent as Ke, ref as Y, watch as Zr, onActivated as et, onDeactivated as rt, onUnmounted as Or, h as Ve, resolveComponent as Ae, createVNode as O, createTextVNode as tt, isVNode as nt, toRaw as ot } from "vue";
import { useNamespace as Er, getNestedRoutePath as nr, route2routePath as Ir, NavPosController as at, parseRouteViewData as it, createOverlayView as lt, routerCallback as ct, NavPosState as ut } from "@ibiz-template/vue3-util";
import { useRouter as xr, useRoute as Rr, onBeforeRouteUpdate as ft } from "vue-router";
import { IBizContext as ue } from "@ibiz-template/core";
import { isEmpty as pt } from "ramda";
function yt(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function st(r) {
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
var dt = function() {
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
}, or = typeof Symbol < "u" && Symbol, vt = dt, Fr = function() {
  return typeof or != "function" || typeof Symbol != "function" || typeof or("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : vt();
}, mt = "Function.prototype.bind called on incompatible ", $e = Array.prototype.slice, ht = Object.prototype.toString, gt = "[object Function]", St = function(e) {
  var t = this;
  if (typeof t != "function" || ht.call(t) !== gt)
    throw new TypeError(mt + t);
  for (var n = $e.call(arguments, 1), a, o = function() {
    if (this instanceof a) {
      var f = t.apply(
        this,
        n.concat($e.call(arguments))
      );
      return Object(f) === f ? f : this;
    } else
      return t.apply(
        e,
        n.concat($e.call(arguments))
      );
  }, c = Math.max(0, t.length - n.length), i = [], l = 0; l < c; l++)
    i.push("$" + l);
  if (a = Function("binder", "return function (" + i.join(",") + "){ return binder.apply(this,arguments); }")(o), t.prototype) {
    var u = function() {
    };
    u.prototype = t.prototype, a.prototype = new u(), u.prototype = null;
  }
  return a;
}, bt = St, Fe = Function.prototype.bind || bt, At = Fe, $r = At.call(Function.call, Object.prototype.hasOwnProperty), v, re = SyntaxError, Nr = Function, X = TypeError, Ne = function(r) {
  try {
    return Nr('"use strict"; return (' + r + ").constructor;")();
  } catch (e) {
  }
}, W = Object.getOwnPropertyDescriptor;
if (W)
  try {
    W({}, "");
  } catch (r) {
    W = null;
  }
var Be = function() {
  throw new X();
}, Pt = W ? function() {
  try {
    return arguments.callee, Be;
  } catch (r) {
    try {
      return W(arguments, "callee").get;
    } catch (e) {
      return Be;
    }
  }
}() : Be, q = Fr(), R = Object.getPrototypeOf || function(r) {
  return r.__proto__;
}, K = {}, wt = typeof Uint8Array > "u" ? v : R(Uint8Array), G = {
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
  "%Function%": Nr,
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
  "%ThrowTypeError%": Pt,
  "%TypedArray%": wt,
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
  var Ot = R(R(r));
  G["%Error.prototype%"] = Ot;
}
var Et = function r(e) {
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
  return G[e] = t, t;
}, ar = {
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
}, de = Fe, we = $r, It = de.call(Function.call, Array.prototype.concat), xt = de.call(Function.apply, Array.prototype.splice), ir = de.call(Function.call, String.prototype.replace), Oe = de.call(Function.call, String.prototype.slice), Rt = de.call(Function.call, RegExp.prototype.exec), Ft = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, $t = /\\(\\)?/g, Nt = function(e) {
  var t = Oe(e, 0, 1), n = Oe(e, -1);
  if (t === "%" && n !== "%")
    throw new re("invalid intrinsic syntax, expected closing `%`");
  if (n === "%" && t !== "%")
    throw new re("invalid intrinsic syntax, expected opening `%`");
  var a = [];
  return ir(e, Ft, function(o, c, i, l) {
    a[a.length] = i ? ir(l, $t, "$1") : c || o;
  }), a;
}, Bt = function(e, t) {
  var n = e, a;
  if (we(ar, n) && (a = ar[n], n = "%" + a[0] + "%"), we(G, n)) {
    var o = G[n];
    if (o === K && (o = Et(n)), typeof o > "u" && !t)
      throw new X("intrinsic " + e + " exists, but is not available. Please file an issue!");
    return {
      alias: a,
      name: n,
      value: o
    };
  }
  throw new re("intrinsic " + e + " does not exist!");
}, Ct = function(e, t) {
  if (typeof e != "string" || e.length === 0)
    throw new X("intrinsic name must be a non-empty string");
  if (arguments.length > 1 && typeof t != "boolean")
    throw new X('"allowMissing" argument must be a boolean');
  if (Rt(/^%?[^%]*%?$/, e) === null)
    throw new re("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  var n = Nt(e), a = n.length > 0 ? n[0] : "", o = Bt("%" + a + "%", t), c = o.name, i = o.value, l = !1, u = o.alias;
  u && (a = u[0], xt(n, It([0, 1], u)));
  for (var f = 1, y = !0; f < n.length; f += 1) {
    var p = n[f], d = Oe(p, 0, 1), s = Oe(p, -1);
    if ((d === '"' || d === "'" || d === "`" || s === '"' || s === "'" || s === "`") && d !== s)
      throw new re("property names with quotes must have matching quotes");
    if ((p === "constructor" || !y) && (l = !0), a += "." + p, c = "%" + a + "%", we(G, c))
      i = G[c];
    else if (i != null) {
      if (!(p in i)) {
        if (!t)
          throw new X("base intrinsic for " + e + " exists, but the property is not available.");
        return;
      }
      if (W && f + 1 >= n.length) {
        var S = W(i, p);
        y = !!S, y && "get" in S && !("originalValue" in S.get) ? i = S.get : i = i[p];
      } else
        y = we(i, p), i = i[p];
      y && !l && (G[c] = i);
    }
  }
  return i;
}, m, te = SyntaxError, Br = Function, Z = TypeError, Ce = function(r) {
  try {
    return Br('"use strict"; return (' + r + ").constructor;")();
  } catch (e) {
  }
}, V = Object.getOwnPropertyDescriptor;
if (V)
  try {
    V({}, "");
  } catch (r) {
    V = null;
  }
var Me = function() {
  throw new Z();
}, Mt = V ? function() {
  try {
    return arguments.callee, Me;
  } catch (r) {
    try {
      return V(arguments, "callee").get;
    } catch (e) {
      return Me;
    }
  }
}() : Me, J = Fr(), M = Object.getPrototypeOf || function(r) {
  return r.__proto__;
}, Q = {}, Ut = typeof Uint8Array > "u" ? m : M(Uint8Array), ee = {
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
  "%Function%": Br,
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
  "%ThrowTypeError%": Mt,
  "%TypedArray%": Ut,
  "%TypeError%": Z,
  "%Uint8Array%": typeof Uint8Array > "u" ? m : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? m : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array > "u" ? m : Uint16Array,
  "%Uint32Array%": typeof Uint32Array > "u" ? m : Uint32Array,
  "%URIError%": URIError,
  "%WeakMap%": typeof WeakMap > "u" ? m : WeakMap,
  "%WeakRef%": typeof WeakRef > "u" ? m : WeakRef,
  "%WeakSet%": typeof WeakSet > "u" ? m : WeakSet
}, Dt = function r(e) {
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
}, lr = {
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
}, ve = Fe, Ee = $r, Tt = ve.call(Function.call, Array.prototype.concat), _t = ve.call(Function.apply, Array.prototype.splice), cr = ve.call(Function.call, String.prototype.replace), Ie = ve.call(Function.call, String.prototype.slice), kt = ve.call(Function.call, RegExp.prototype.exec), Wt = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, Gt = /\\(\\)?/g, Vt = function(e) {
  var t = Ie(e, 0, 1), n = Ie(e, -1);
  if (t === "%" && n !== "%")
    throw new te("invalid intrinsic syntax, expected closing `%`");
  if (n === "%" && t !== "%")
    throw new te("invalid intrinsic syntax, expected opening `%`");
  var a = [];
  return cr(e, Wt, function(o, c, i, l) {
    a[a.length] = i ? cr(l, Gt, "$1") : c || o;
  }), a;
}, Lt = function(e, t) {
  var n = e, a;
  if (Ee(lr, n) && (a = lr[n], n = "%" + a[0] + "%"), Ee(ee, n)) {
    var o = ee[n];
    if (o === Q && (o = Dt(n)), typeof o > "u" && !t)
      throw new Z("intrinsic " + e + " exists, but is not available. Please file an issue!");
    return {
      alias: a,
      name: n,
      value: o
    };
  }
  throw new te("intrinsic " + e + " does not exist!");
}, Cr = function(e, t) {
  if (typeof e != "string" || e.length === 0)
    throw new Z("intrinsic name must be a non-empty string");
  if (arguments.length > 1 && typeof t != "boolean")
    throw new Z('"allowMissing" argument must be a boolean');
  if (kt(/^%?[^%]*%?$/g, e) === null)
    throw new te("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  var n = Vt(e), a = n.length > 0 ? n[0] : "", o = Lt("%" + a + "%", t), c = o.name, i = o.value, l = !1, u = o.alias;
  u && (a = u[0], _t(n, Tt([0, 1], u)));
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
      if (V && f + 1 >= n.length) {
        var S = V(i, p);
        y = !!S, y && "get" in S && !("originalValue" in S.get) ? i = S.get : i = i[p];
      } else
        y = Ee(i, p), i = i[p];
      y && !l && (ee[c] = i);
    }
  }
  return i;
}, Mr = { exports: {} };
(function(r) {
  var e = Fe, t = Cr, n = t("%Function.prototype.apply%"), a = t("%Function.prototype.call%"), o = t("%Reflect.apply%", !0) || e.call(a, n), c = t("%Object.getOwnPropertyDescriptor%", !0), i = t("%Object.defineProperty%", !0), l = t("%Math.max%");
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
})(Mr);
var zt = Mr.exports, Ur = Cr, Dr = zt, jt = Dr(Ur("String.prototype.indexOf")), Ht = function(e, t) {
  var n = Ur(e, !!t);
  return typeof n == "function" && jt(e, ".prototype.") > -1 ? Dr(n) : n;
};
const qt = {}, Jt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: qt
}, Symbol.toStringTag, { value: "Module" })), Kt = /* @__PURE__ */ st(Jt);
var Qe = typeof Map == "function" && Map.prototype, Ue = Object.getOwnPropertyDescriptor && Qe ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null, xe = Qe && Ue && typeof Ue.get == "function" ? Ue.get : null, Qt = Qe && Map.prototype.forEach, Ye = typeof Set == "function" && Set.prototype, De = Object.getOwnPropertyDescriptor && Ye ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null, Re = Ye && De && typeof De.get == "function" ? De.get : null, Yt = Ye && Set.prototype.forEach, Xt = typeof WeakMap == "function" && WeakMap.prototype, fe = Xt ? WeakMap.prototype.has : null, Zt = typeof WeakSet == "function" && WeakSet.prototype, pe = Zt ? WeakSet.prototype.has : null, en = typeof WeakRef == "function" && WeakRef.prototype, ur = en ? WeakRef.prototype.deref : null, rn = Boolean.prototype.valueOf, tn = Object.prototype.toString, nn = Function.prototype.toString, on = String.prototype.match, Xe = String.prototype.slice, D = String.prototype.replace, an = String.prototype.toUpperCase, fr = String.prototype.toLowerCase, Tr = RegExp.prototype.test, pr = Array.prototype.concat, F = Array.prototype.join, ln = Array.prototype.slice, yr = Math.floor, Le = typeof BigInt == "function" ? BigInt.prototype.valueOf : null, Te = Object.getOwnPropertySymbols, ze = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Symbol.prototype.toString : null, ne = typeof Symbol == "function" && typeof Symbol.iterator == "object", w = typeof Symbol == "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === ne || "symbol") ? Symbol.toStringTag : null, _r = Object.prototype.propertyIsEnumerable, sr = (typeof Reflect == "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(r) {
  return r.__proto__;
} : null);
function dr(r, e) {
  if (r === 1 / 0 || r === -1 / 0 || r !== r || r && r > -1e3 && r < 1e3 || Tr.call(/e/, e))
    return e;
  var t = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
  if (typeof r == "number") {
    var n = r < 0 ? -yr(-r) : yr(r);
    if (n !== r) {
      var a = String(n), o = Xe.call(e, a.length + 1);
      return D.call(a, t, "$&_") + "." + D.call(D.call(o, /([0-9]{3})/g, "$&_"), /_$/, "");
    }
  }
  return D.call(e, t, "$&_");
}
var je = Kt, vr = je.custom, mr = Wr(vr) ? vr : null, cn = function r(e, t, n, a) {
  var o = t || {};
  if (U(o, "quoteStyle") && o.quoteStyle !== "single" && o.quoteStyle !== "double")
    throw new TypeError('option "quoteStyle" must be "single" or "double"');
  if (U(o, "maxStringLength") && (typeof o.maxStringLength == "number" ? o.maxStringLength < 0 && o.maxStringLength !== 1 / 0 : o.maxStringLength !== null))
    throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
  var c = U(o, "customInspect") ? o.customInspect : !0;
  if (typeof c != "boolean" && c !== "symbol")
    throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
  if (U(o, "indent") && o.indent !== null && o.indent !== "	" && !(parseInt(o.indent, 10) === o.indent && o.indent > 0))
    throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
  if (U(o, "numericSeparator") && typeof o.numericSeparator != "boolean")
    throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
  var i = o.numericSeparator;
  if (typeof e > "u")
    return "undefined";
  if (e === null)
    return "null";
  if (typeof e == "boolean")
    return e ? "true" : "false";
  if (typeof e == "string")
    return Vr(e, o);
  if (typeof e == "number") {
    if (e === 0)
      return 1 / 0 / e > 0 ? "0" : "-0";
    var l = String(e);
    return i ? dr(e, l) : l;
  }
  if (typeof e == "bigint") {
    var u = String(e) + "n";
    return i ? dr(e, u) : u;
  }
  var f = typeof o.depth > "u" ? 5 : o.depth;
  if (typeof n > "u" && (n = 0), n >= f && f > 0 && typeof e == "object")
    return He(e) ? "[Array]" : "[Object]";
  var y = In(o, n);
  if (typeof a > "u")
    a = [];
  else if (Gr(a, e) >= 0)
    return "[Circular]";
  function p($, j, he) {
    if (j && (a = ln.call(a), a.push(j)), he) {
      var H = {
        depth: o.depth
      };
      return U(o, "quoteStyle") && (H.quoteStyle = o.quoteStyle), r($, H, n + 1, a);
    }
    return r($, o, n + 1, a);
  }
  if (typeof e == "function" && !hr(e)) {
    var d = hn(e), s = ge(e, p);
    return "[Function" + (d ? ": " + d : " (anonymous)") + "]" + (s.length > 0 ? " { " + F.call(s, ", ") + " }" : "");
  }
  if (Wr(e)) {
    var S = ne ? D.call(String(e), /^(Symbol\(.*\))_[^)]*$/, "$1") : ze.call(e);
    return typeof e == "object" && !ne ? ce(S) : S;
  }
  if (wn(e)) {
    for (var E = "<" + fr.call(String(e.nodeName)), h = e.attributes || [], g = 0; g < h.length; g++)
      E += " " + h[g].name + "=" + kr(un(h[g].value), "double", o);
    return E += ">", e.childNodes && e.childNodes.length && (E += "..."), E += "</" + fr.call(String(e.nodeName)) + ">", E;
  }
  if (He(e)) {
    if (e.length === 0)
      return "[]";
    var b = ge(e, p);
    return y && !En(b) ? "[" + qe(b, y) + "]" : "[ " + F.call(b, ", ") + " ]";
  }
  if (pn(e)) {
    var B = ge(e, p);
    return !("cause" in Error.prototype) && "cause" in e && !_r.call(e, "cause") ? "{ [" + String(e) + "] " + F.call(pr.call("[cause]: " + p(e.cause), B), ", ") + " }" : B.length === 0 ? "[" + String(e) + "]" : "{ [" + String(e) + "] " + F.call(B, ", ") + " }";
  }
  if (typeof e == "object" && c) {
    if (mr && typeof e[mr] == "function" && je)
      return je(e, { depth: f - n });
    if (c !== "symbol" && typeof e.inspect == "function")
      return e.inspect();
  }
  if (gn(e)) {
    var ie = [];
    return Qt.call(e, function($, j) {
      ie.push(p(j, e, !0) + " => " + p($, e));
    }), gr("Map", xe.call(e), ie, y);
  }
  if (An(e)) {
    var me = [];
    return Yt.call(e, function($) {
      me.push(p($, e));
    }), gr("Set", Re.call(e), me, y);
  }
  if (Sn(e))
    return _e("WeakMap");
  if (Pn(e))
    return _e("WeakSet");
  if (bn(e))
    return _e("WeakRef");
  if (sn(e))
    return ce(p(Number(e)));
  if (vn(e))
    return ce(p(Le.call(e)));
  if (dn(e))
    return ce(rn.call(e));
  if (yn(e))
    return ce(p(String(e)));
  if (!fn(e) && !hr(e)) {
    var _ = ge(e, p), C = sr ? sr(e) === Object.prototype : e instanceof Object || e.constructor === Object, L = e instanceof Object ? "" : "null prototype", z = !C && w && Object(e) === e && w in e ? Xe.call(T(e), 8, -1) : L ? "Object" : "", le = C || typeof e.constructor != "function" ? "" : e.constructor.name ? e.constructor.name + " " : "", I = le + (z || L ? "[" + F.call(pr.call([], z || [], L || []), ": ") + "] " : "");
    return _.length === 0 ? I + "{}" : y ? I + "{" + qe(_, y) + "}" : I + "{ " + F.call(_, ", ") + " }";
  }
  return String(e);
};
function kr(r, e, t) {
  var n = (t.quoteStyle || e) === "double" ? '"' : "'";
  return n + r + n;
}
function un(r) {
  return D.call(String(r), /"/g, "&quot;");
}
function He(r) {
  return T(r) === "[object Array]" && (!w || !(typeof r == "object" && w in r));
}
function fn(r) {
  return T(r) === "[object Date]" && (!w || !(typeof r == "object" && w in r));
}
function hr(r) {
  return T(r) === "[object RegExp]" && (!w || !(typeof r == "object" && w in r));
}
function pn(r) {
  return T(r) === "[object Error]" && (!w || !(typeof r == "object" && w in r));
}
function yn(r) {
  return T(r) === "[object String]" && (!w || !(typeof r == "object" && w in r));
}
function sn(r) {
  return T(r) === "[object Number]" && (!w || !(typeof r == "object" && w in r));
}
function dn(r) {
  return T(r) === "[object Boolean]" && (!w || !(typeof r == "object" && w in r));
}
function Wr(r) {
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
function vn(r) {
  if (!r || typeof r != "object" || !Le)
    return !1;
  try {
    return Le.call(r), !0;
  } catch (e) {
  }
  return !1;
}
var mn = Object.prototype.hasOwnProperty || function(r) {
  return r in this;
};
function U(r, e) {
  return mn.call(r, e);
}
function T(r) {
  return tn.call(r);
}
function hn(r) {
  if (r.name)
    return r.name;
  var e = on.call(nn.call(r), /^function\s*([\w$]+)/);
  return e ? e[1] : null;
}
function Gr(r, e) {
  if (r.indexOf)
    return r.indexOf(e);
  for (var t = 0, n = r.length; t < n; t++)
    if (r[t] === e)
      return t;
  return -1;
}
function gn(r) {
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
function Sn(r) {
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
function bn(r) {
  if (!ur || !r || typeof r != "object")
    return !1;
  try {
    return ur.call(r), !0;
  } catch (e) {
  }
  return !1;
}
function An(r) {
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
function Pn(r) {
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
function wn(r) {
  return !r || typeof r != "object" ? !1 : typeof HTMLElement < "u" && r instanceof HTMLElement ? !0 : typeof r.nodeName == "string" && typeof r.getAttribute == "function";
}
function Vr(r, e) {
  if (r.length > e.maxStringLength) {
    var t = r.length - e.maxStringLength, n = "... " + t + " more character" + (t > 1 ? "s" : "");
    return Vr(Xe.call(r, 0, e.maxStringLength), e) + n;
  }
  var a = D.call(D.call(r, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, On);
  return kr(a, "single", e);
}
function On(r) {
  var e = r.charCodeAt(0), t = {
    8: "b",
    9: "t",
    10: "n",
    12: "f",
    13: "r"
  }[e];
  return t ? "\\" + t : "\\x" + (e < 16 ? "0" : "") + an.call(e.toString(16));
}
function ce(r) {
  return "Object(" + r + ")";
}
function _e(r) {
  return r + " { ? }";
}
function gr(r, e, t, n) {
  var a = n ? qe(t, n) : F.call(t, ", ");
  return r + " (" + e + ") {" + a + "}";
}
function En(r) {
  for (var e = 0; e < r.length; e++)
    if (Gr(r[e], "\n") >= 0)
      return !1;
  return !0;
}
function In(r, e) {
  var t;
  if (r.indent === "	")
    t = "	";
  else if (typeof r.indent == "number" && r.indent > 0)
    t = F.call(Array(r.indent + 1), " ");
  else
    return null;
  return {
    base: t,
    prev: F.call(Array(e + 1), t)
  };
}
function qe(r, e) {
  if (r.length === 0)
    return "";
  var t = "\n" + e.prev + e.base;
  return t + F.call(r, "," + t) + "\n" + e.prev;
}
function ge(r, e) {
  var t = He(r), n = [];
  if (t) {
    n.length = r.length;
    for (var a = 0; a < r.length; a++)
      n[a] = U(r, a) ? e(r[a], r) : "";
  }
  var o = typeof Te == "function" ? Te(r) : [], c;
  if (ne) {
    c = {};
    for (var i = 0; i < o.length; i++)
      c["$" + o[i]] = o[i];
  }
  for (var l in r)
    U(r, l) && (t && String(Number(l)) === l && l < r.length || ne && c["$" + l] instanceof Symbol || (Tr.call(/[^\w$]/, l) ? n.push(e(l, r) + ": " + e(r[l], r)) : n.push(l + ": " + e(r[l], r))));
  if (typeof Te == "function")
    for (var u = 0; u < o.length; u++)
      _r.call(r, o[u]) && n.push("[" + e(o[u]) + "]: " + e(r[o[u]], r));
  return n;
}
var Ze = Ct, ae = Ht, xn = cn, Rn = Ze("%TypeError%"), Se = Ze("%WeakMap%", !0), be = Ze("%Map%", !0), Fn = ae("WeakMap.prototype.get", !0), $n = ae("WeakMap.prototype.set", !0), Nn = ae("WeakMap.prototype.has", !0), Bn = ae("Map.prototype.get", !0), Cn = ae("Map.prototype.set", !0), Mn = ae("Map.prototype.has", !0), er = function(r, e) {
  for (var t = r, n; (n = t.next) !== null; t = n)
    if (n.key === e)
      return t.next = n.next, n.next = r.next, r.next = n, n;
}, Un = function(r, e) {
  var t = er(r, e);
  return t && t.value;
}, Dn = function(r, e, t) {
  var n = er(r, e);
  n ? n.value = t : r.next = {
    // eslint-disable-line no-param-reassign
    key: e,
    next: r.next,
    value: t
  };
}, Tn = function(r, e) {
  return !!er(r, e);
}, _n = function() {
  var e, t, n, a = {
    assert: function(o) {
      if (!a.has(o))
        throw new Rn("Side channel does not contain " + xn(o));
    },
    get: function(o) {
      if (Se && o && (typeof o == "object" || typeof o == "function")) {
        if (e)
          return Fn(e, o);
      } else if (be) {
        if (t)
          return Bn(t, o);
      } else if (n)
        return Un(n, o);
    },
    has: function(o) {
      if (Se && o && (typeof o == "object" || typeof o == "function")) {
        if (e)
          return Nn(e, o);
      } else if (be) {
        if (t)
          return Mn(t, o);
      } else if (n)
        return Tn(n, o);
      return !1;
    },
    set: function(o, c) {
      Se && o && (typeof o == "object" || typeof o == "function") ? (e || (e = new Se()), $n(e, o, c)) : be ? (t || (t = new be()), Cn(t, o, c)) : (n || (n = { key: {}, next: null }), Dn(n, o, c));
    }
  };
  return a;
}, kn = String.prototype.replace, Wn = /%20/g, ke = {
  RFC1738: "RFC1738",
  RFC3986: "RFC3986"
}, rr = {
  default: ke.RFC3986,
  formatters: {
    RFC1738: function(r) {
      return kn.call(r, Wn, "+");
    },
    RFC3986: function(r) {
      return String(r);
    }
  },
  RFC1738: ke.RFC1738,
  RFC3986: ke.RFC3986
}, Gn = rr, We = Object.prototype.hasOwnProperty, k = Array.isArray, x = function() {
  for (var r = [], e = 0; e < 256; ++e)
    r.push("%" + ((e < 16 ? "0" : "") + e.toString(16)).toUpperCase());
  return r;
}(), Vn = function(e) {
  for (; e.length > 1; ) {
    var t = e.pop(), n = t.obj[t.prop];
    if (k(n)) {
      for (var a = [], o = 0; o < n.length; ++o)
        typeof n[o] < "u" && a.push(n[o]);
      t.obj[t.prop] = a;
    }
  }
}, Lr = function(e, t) {
  for (var n = t && t.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, a = 0; a < e.length; ++a)
    typeof e[a] < "u" && (n[a] = e[a]);
  return n;
}, Ln = function r(e, t, n) {
  if (!t)
    return e;
  if (typeof t != "object") {
    if (k(e))
      e.push(t);
    else if (e && typeof e == "object")
      (n && (n.plainObjects || n.allowPrototypes) || !We.call(Object.prototype, t)) && (e[t] = !0);
    else
      return [e, t];
    return e;
  }
  if (!e || typeof e != "object")
    return [e].concat(t);
  var a = e;
  return k(e) && !k(t) && (a = Lr(e, n)), k(e) && k(t) ? (t.forEach(function(o, c) {
    if (We.call(e, c)) {
      var i = e[c];
      i && typeof i == "object" && o && typeof o == "object" ? e[c] = r(i, o, n) : e.push(o);
    } else
      e[c] = o;
  }), e) : Object.keys(t).reduce(function(o, c) {
    var i = t[c];
    return We.call(o, c) ? o[c] = r(o[c], i, n) : o[c] = i, o;
  }, a);
}, zn = function(e, t) {
  return Object.keys(t).reduce(function(n, a) {
    return n[a] = t[a], n;
  }, e);
}, jn = function(r, e, t) {
  var n = r.replace(/\+/g, " ");
  if (t === "iso-8859-1")
    return n.replace(/%[0-9a-f]{2}/gi, unescape);
  try {
    return decodeURIComponent(n);
  } catch (a) {
    return n;
  }
}, Hn = function(e, t, n, a, o) {
  if (e.length === 0)
    return e;
  var c = e;
  if (typeof e == "symbol" ? c = Symbol.prototype.toString.call(e) : typeof e != "string" && (c = String(e)), n === "iso-8859-1")
    return escape(c).replace(/%u[0-9a-f]{4}/gi, function(f) {
      return "%26%23" + parseInt(f.slice(2), 16) + "%3B";
    });
  for (var i = "", l = 0; l < c.length; ++l) {
    var u = c.charCodeAt(l);
    if (u === 45 || u === 46 || u === 95 || u === 126 || u >= 48 && u <= 57 || u >= 65 && u <= 90 || u >= 97 && u <= 122 || o === Gn.RFC1738 && (u === 40 || u === 41)) {
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
}, qn = function(e) {
  for (var t = [{ obj: { o: e }, prop: "o" }], n = [], a = 0; a < t.length; ++a)
    for (var o = t[a], c = o.obj[o.prop], i = Object.keys(c), l = 0; l < i.length; ++l) {
      var u = i[l], f = c[u];
      typeof f == "object" && f !== null && n.indexOf(f) === -1 && (t.push({ obj: c, prop: u }), n.push(f));
    }
  return Vn(t), e;
}, Jn = function(e) {
  return Object.prototype.toString.call(e) === "[object RegExp]";
}, Kn = function(e) {
  return !e || typeof e != "object" ? !1 : !!(e.constructor && e.constructor.isBuffer && e.constructor.isBuffer(e));
}, Qn = function(e, t) {
  return [].concat(e, t);
}, Yn = function(e, t) {
  if (k(e)) {
    for (var n = [], a = 0; a < e.length; a += 1)
      n.push(t(e[a]));
    return n;
  }
  return t(e);
}, zr = {
  arrayToObject: Lr,
  assign: zn,
  combine: Qn,
  compact: qn,
  decode: jn,
  encode: Hn,
  isBuffer: Kn,
  isRegExp: Jn,
  maybeMap: Yn,
  merge: Ln
}, jr = _n, Pe = zr, ye = rr, Xn = Object.prototype.hasOwnProperty, Sr = {
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
}, N = Array.isArray, Zn = Array.prototype.push, Hr = function(r, e) {
  Zn.apply(r, N(e) ? e : [e]);
}, eo = Date.prototype.toISOString, br = ye.default, P = {
  addQueryPrefix: !1,
  allowDots: !1,
  charset: "utf-8",
  charsetSentinel: !1,
  delimiter: "&",
  encode: !0,
  encoder: Pe.encode,
  encodeValuesOnly: !1,
  format: br,
  formatter: ye.formatters[br],
  // deprecated
  indices: !1,
  serializeDate: function(e) {
    return eo.call(e);
  },
  skipNulls: !1,
  strictNullHandling: !1
}, ro = function(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "symbol" || typeof e == "bigint";
}, Ge = {}, to = function r(e, t, n, a, o, c, i, l, u, f, y, p, d, s, S, E) {
  for (var h = e, g = E, b = 0, B = !1; (g = g.get(Ge)) !== void 0 && !B; ) {
    var ie = g.get(e);
    if (b += 1, typeof ie < "u") {
      if (ie === b)
        throw new RangeError("Cyclic object value");
      B = !0;
    }
    typeof g.get(Ge) > "u" && (b = 0);
  }
  if (typeof l == "function" ? h = l(t, h) : h instanceof Date ? h = y(h) : n === "comma" && N(h) && (h = Pe.maybeMap(h, function(H) {
    return H instanceof Date ? y(H) : H;
  })), h === null) {
    if (o)
      return i && !s ? i(t, P.encoder, S, "key", p) : t;
    h = "";
  }
  if (ro(h) || Pe.isBuffer(h)) {
    if (i) {
      var me = s ? t : i(t, P.encoder, S, "key", p);
      return [d(me) + "=" + d(i(h, P.encoder, S, "value", p))];
    }
    return [d(t) + "=" + d(String(h))];
  }
  var _ = [];
  if (typeof h > "u")
    return _;
  var C;
  if (n === "comma" && N(h))
    s && i && (h = Pe.maybeMap(h, i)), C = [{ value: h.length > 0 ? h.join(",") || null : void 0 }];
  else if (N(l))
    C = l;
  else {
    var L = Object.keys(h);
    C = u ? L.sort(u) : L;
  }
  for (var z = a && N(h) && h.length === 1 ? t + "[]" : t, le = 0; le < C.length; ++le) {
    var I = C[le], $ = typeof I == "object" && typeof I.value < "u" ? I.value : h[I];
    if (!(c && $ === null)) {
      var j = N(h) ? typeof n == "function" ? n(z, I) : z : z + (f ? "." + I : "[" + I + "]");
      E.set(e, b);
      var he = jr();
      he.set(Ge, E), Hr(_, r(
        $,
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
  return _;
}, no = function(e) {
  if (!e)
    return P;
  if (e.encoder !== null && typeof e.encoder < "u" && typeof e.encoder != "function")
    throw new TypeError("Encoder has to be a function.");
  var t = e.charset || P.charset;
  if (typeof e.charset < "u" && e.charset !== "utf-8" && e.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var n = ye.default;
  if (typeof e.format < "u") {
    if (!Xn.call(ye.formatters, e.format))
      throw new TypeError("Unknown format option provided.");
    n = e.format;
  }
  var a = ye.formatters[n], o = P.filter;
  return (typeof e.filter == "function" || N(e.filter)) && (o = e.filter), {
    addQueryPrefix: typeof e.addQueryPrefix == "boolean" ? e.addQueryPrefix : P.addQueryPrefix,
    allowDots: typeof e.allowDots > "u" ? P.allowDots : !!e.allowDots,
    charset: t,
    charsetSentinel: typeof e.charsetSentinel == "boolean" ? e.charsetSentinel : P.charsetSentinel,
    delimiter: typeof e.delimiter > "u" ? P.delimiter : e.delimiter,
    encode: typeof e.encode == "boolean" ? e.encode : P.encode,
    encoder: typeof e.encoder == "function" ? e.encoder : P.encoder,
    encodeValuesOnly: typeof e.encodeValuesOnly == "boolean" ? e.encodeValuesOnly : P.encodeValuesOnly,
    filter: o,
    format: n,
    formatter: a,
    serializeDate: typeof e.serializeDate == "function" ? e.serializeDate : P.serializeDate,
    skipNulls: typeof e.skipNulls == "boolean" ? e.skipNulls : P.skipNulls,
    sort: typeof e.sort == "function" ? e.sort : null,
    strictNullHandling: typeof e.strictNullHandling == "boolean" ? e.strictNullHandling : P.strictNullHandling
  };
}, oo = function(r, e) {
  var t = r, n = no(e), a, o;
  typeof n.filter == "function" ? (o = n.filter, t = o("", t)) : N(n.filter) && (o = n.filter, a = o);
  var c = [];
  if (typeof t != "object" || t === null)
    return "";
  var i;
  e && e.arrayFormat in Sr ? i = e.arrayFormat : e && "indices" in e ? i = e.indices ? "indices" : "repeat" : i = "indices";
  var l = Sr[i];
  if (e && "commaRoundTrip" in e && typeof e.commaRoundTrip != "boolean")
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  var u = l === "comma" && e && e.commaRoundTrip;
  a || (a = Object.keys(t)), n.sort && a.sort(n.sort);
  for (var f = jr(), y = 0; y < a.length; ++y) {
    var p = a[y];
    n.skipNulls && t[p] === null || Hr(c, to(
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
}, oe = zr, Je = Object.prototype.hasOwnProperty, ao = Array.isArray, A = {
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
}, io = function(r) {
  return r.replace(/&#(\d+);/g, function(e, t) {
    return String.fromCharCode(parseInt(t, 10));
  });
}, qr = function(r, e) {
  return r && typeof r == "string" && e.comma && r.indexOf(",") > -1 ? r.split(",") : r;
}, lo = "utf8=%26%2310003%3B", co = "utf8=%E2%9C%93", uo = function(e, t) {
  var n = { __proto__: null }, a = t.ignoreQueryPrefix ? e.replace(/^\?/, "") : e, o = t.parameterLimit === 1 / 0 ? void 0 : t.parameterLimit, c = a.split(t.delimiter, o), i = -1, l, u = t.charset;
  if (t.charsetSentinel)
    for (l = 0; l < c.length; ++l)
      c[l].indexOf("utf8=") === 0 && (c[l] === co ? u = "utf-8" : c[l] === lo && (u = "iso-8859-1"), i = l, l = c.length);
  for (l = 0; l < c.length; ++l)
    if (l !== i) {
      var f = c[l], y = f.indexOf("]="), p = y === -1 ? f.indexOf("=") : y + 1, d, s;
      p === -1 ? (d = t.decoder(f, A.decoder, u, "key"), s = t.strictNullHandling ? null : "") : (d = t.decoder(f.slice(0, p), A.decoder, u, "key"), s = oe.maybeMap(
        qr(f.slice(p + 1), t),
        function(S) {
          return t.decoder(S, A.decoder, u, "value");
        }
      )), s && t.interpretNumericEntities && u === "iso-8859-1" && (s = io(s)), f.indexOf("[]=") > -1 && (s = ao(s) ? [s] : s), Je.call(n, d) ? n[d] = oe.combine(n[d], s) : n[d] = s;
    }
  return n;
}, fo = function(r, e, t, n) {
  for (var a = n ? e : qr(e, t), o = r.length - 1; o >= 0; --o) {
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
}, po = function(e, t, n, a) {
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
    return l && f.push("[" + o.slice(l.index) + "]"), fo(f, t, n, a);
  }
}, yo = function(e) {
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
}, so = function(r, e) {
  var t = yo(e);
  if (r === "" || r === null || typeof r > "u")
    return t.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  for (var n = typeof r == "string" ? uo(r, t) : r, a = t.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, o = Object.keys(n), c = 0; c < o.length; ++c) {
    var i = o[c], l = po(i, n[i], t, typeof r == "string");
    a = oe.merge(a, l, t);
  }
  return t.allowSparse === !0 ? a : oe.compact(a);
}, vo = oo, mo = so, ho = rr, go = {
  formats: ho,
  parse: mo,
  stringify: vo
};
const So = /* @__PURE__ */ yt(go);
var bo = Object.defineProperty, Ao = (r, e, t) => e in r ? bo(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, se = (r, e, t) => (Ao(r, typeof e != "symbol" ? e + "" : e, t), t);
const Po = /* @__PURE__ */ Ke({
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
      ns: Er("breadcrumb"),
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
    }, [tt("/")])]))]);
  }
});
function wo(r) {
  return typeof r == "function" || Object.prototype.toString.call(r) === "[object Object]" && !nt(r);
}
const Ar = /* @__PURE__ */ Ke({
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
    const e = r.controller, t = Er("breadcrumb-nav-pos"), n = (f) => {
      e.onViewCreated(f);
    }, a = xr(), o = Rr(), c = Y(!1), i = Y(!0), l = Y(!1), u = Y({});
    if (e.setRouter(a), e.routeDepth) {
      const f = nr(o, e.routeDepth);
      Zr(() => o.fullPath, () => {
        l.value = o.fullPath.indexOf("/route-modal") !== -1;
        const y = nr(o, e.routeDepth);
        if (f === y && o.matched.length > e.routeDepth) {
          if (o.matched.length === e.routeDepth + 1 && (c.value = !!o.name, c.value))
            return;
          l.value && (u.value = new Kr({
            mode: Qr.ROUTE,
            routeDepth: o.matched.length
          })), e.onRouteChange(o);
        }
      }, {
        immediate: !0
      });
    }
    return et(() => {
      i.value = !0;
    }), rt(() => {
      i.value = !1;
    }), Or(() => {
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
    const i = e && n[e] ? Ve(Ae("IBizViewShell"), {
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
    }, wo(i) ? i : {
      default: () => [i]
    }) : i, O("div", {
      class: [this.ns.b(), this.ns.m(this.modelData.id), ...this.controller.containerClass, this.ns.is("show-breadcrumb", this.controller.state.showBreadcrumd)]
    }, [this.controller.state.showBreadcrumd && O("div", {
      class: this.ns.e("header")
    }, [O("div", {
      class: this.ns.em("header", "left")
    }, [O(Po, {
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
class Oo extends ut {
  constructor() {
    super(...arguments), se(this, "breadcrumb", []), se(this, "showBreadcrumd", !0), se(this, "routeManualKey", "DEFAULT");
  }
}
var Pr;
class Eo extends at {
  constructor() {
    super(...arguments), se(this, "localStorageKey", "".concat((Pr = this.panel.view.model.codeName) == null ? void 0 : Pr.toLowerCase(), "@breadcrumb-nav-pos"));
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
    return new Oo((e = this.parent) == null ? void 0 : e.state);
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
    let { pathNodes: t } = Ir(e);
    t = t.slice(this.routeDepth).filter((n) => n.viewName !== "route-modal"), e.fullPath.indexOf("/route-modal") !== -1 && (this.state.routeManualKey = e.fullPath), this.state.breadcrumb = await Promise.all(
      t.map(async (n, a) => {
        var o;
        const { context: c, params: i, viewName: l } = n, u = await ibiz.hub.config.view.get(l);
        let f = "undefined";
        if (u.appDataEntityId) {
          const p = Yr(u.appDataEntityId);
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
class Io {
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
    const a = new Eo(e, t, n);
    return await a.init(), a;
  }
}
const wr = /* @__PURE__ */ Ke({
  name: "CustomModalRouterShell",
  props: {
    modal: {
      type: Object,
      required: !0
    }
  },
  setup(r) {
    const e = Rr(), t = xr(), n = Y(!1), a = Y({}), o = [], c = () => {
      if (a.value.context) {
        const {
          context: f
        } = ot(a.value);
        f && f.destroy();
      }
    }, i = r.modal.routeDepth;
    let l = null;
    Or(() => {
      n.value = !0, l && (l.dismiss(), l = null), c();
    });
    const u = async (f) => {
      var y;
      if (a.value = await it(f, i, !0), n.value)
        return;
      a.value.context instanceof ue || (a.value.context = ue.create(a.value.context));
      const p = f.params.modalView, d = f.params.modalParams;
      if (d && d !== "-") {
        const g = So.parse(d, {
          strictNullHandling: !0,
          delimiter: ";"
        });
        if (g.srfnavctx) {
          const b = JSON.parse(decodeURIComponent(g.srfnavctx));
          Object.assign(a.value.context, b), delete g.srfnavctx;
        }
        g.srfnav && (a.value.srfnav = g.srfnav, delete g.srfnav), pt(g) || (a.value.params ? Object.assign(a.value.params, g) : a.value.params = g);
      }
      if (!a.value.context) {
        const g = ue.create({});
        a.value.context = g;
      }
      let s = a.value.viewConfig, S;
      try {
        s || (s = await ibiz.hub.config.view.get(p)), S = lt({
          context: a.value.context,
          params: a.value.params,
          viewId: s.id
        });
      } catch (g) {
        const b = Xr("404");
        b && (typeof b.component == "string" && (S = Ve(Ae(b.component))), S = Ve(b.component));
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
          } = f, B = b.indexOf("/".concat(tr.ROUTE_MODAL_TAG, "/"));
          t.replace(b.substring(0, B));
        }
        ct.close(t.currentRoute.value.fullPath, h || {
          ok: !1
        });
      }
    };
    return ft((f, y) => {
      if (!n.value && o.length > 0 && o.indexOf(y.fullPath) !== -1 && o.indexOf(f.fullPath) === -1) {
        const {
          pathNodes: p
        } = Ir(f), d = p[p.length - 1];
        d && d.viewName === tr.ROUTE_MODAL_TAG && u(f);
      }
    }), u(e), {};
  },
  render() {
    return O("div", {
      style: "position: absolute;width: 0;height: 0;"
    }, null);
  }
}), Co = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(r) {
    r.component(Ar.name, Ar), r.component(wr.name, wr), Jr(
      "CUSTOM_BREADCRUMB_NAV_POS",
      () => new Io()
    );
  }
};
export {
  Co as default
};
