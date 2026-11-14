var e = (e, t) => () => (
  t || (e((t = { exports: {} }).exports, t, t.exports), (e = null)),
  t.exports
);
(function () {
  let e = document.createElement(`link`).relList;
  if (e && e.supports && e.supports(`modulepreload`)) return;
  for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) n(e);
  new MutationObserver((e) => {
    for (let t of e)
      if (t.type === `childList`)
        for (let e of t.addedNodes)
          e.tagName === `LINK` && e.rel === `modulepreload` && n(e);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(e) {
    let t = {};
    return (
      e.integrity && (t.integrity = e.integrity),
      e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
      (t.credentials =
        e.crossOrigin === `use-credentials`
          ? `include`
          : e.crossOrigin === `anonymous`
            ? `omit`
            : `same-origin`),
      t
    );
  }
  function n(e) {
    if (e.ep) return;
    e.ep = !0;
    let n = t(e);
    fetch(e.href, n);
  }
})();
var t = e((e) => {
    function t(e, t) {
      var n = e.length;
      e.push(t);
      a: for (; 0 < n;) {
        var r = (n - 1) >>> 1,
          a = e[r];
        if (0 < i(a, t)) ((e[r] = t), (e[n] = a), (n = r));
        else break a;
      }
    }
    function n(e) {
      return e.length === 0 ? null : e[0];
    }
    function r(e) {
      if (e.length === 0) return null;
      var t = e[0],
        n = e.pop();
      if (n !== t) {
        e[0] = n;
        a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
          var s = 2 * (r + 1) - 1,
            c = e[s],
            l = s + 1,
            u = e[l];
          if (0 > i(c, n))
            l < a && 0 > i(u, c)
              ? ((e[r] = u), (e[l] = n), (r = l))
              : ((e[r] = c), (e[s] = n), (r = s));
          else if (l < a && 0 > i(u, n)) ((e[r] = u), (e[l] = n), (r = l));
          else break a;
        }
      }
      return t;
    }
    function i(e, t) {
      var n = e.sortIndex - t.sortIndex;
      return n === 0 ? e.id - t.id : n;
    }
    if (
      ((e.unstable_now = void 0),
      typeof performance == `object` && typeof performance.now == `function`)
    ) {
      var a = performance;
      e.unstable_now = function () {
        return a.now();
      };
    } else {
      var o = Date,
        s = o.now();
      e.unstable_now = function () {
        return o.now() - s;
      };
    }
    var c = [],
      l = [],
      u = 1,
      d = null,
      f = 3,
      p = !1,
      m = !1,
      h = !1,
      g = !1,
      _ = typeof setTimeout == `function` ? setTimeout : null,
      v = typeof clearTimeout == `function` ? clearTimeout : null,
      y = typeof setImmediate < `u` ? setImmediate : null;
    function b(e) {
      for (var i = n(l); i !== null;) {
        if (i.callback === null) r(l);
        else if (i.startTime <= e)
          (r(l), (i.sortIndex = i.expirationTime), t(c, i));
        else break;
        i = n(l);
      }
    }
    function x(e) {
      if (((h = !1), b(e), !m)) {
        if (n(c) !== null) ((m = !0), S || ((S = !0), O()));
        else {
          var t = n(l);
          t !== null && j(x, t.startTime - e);
        }
      }
    }
    var S = !1,
      C = -1,
      w = 5,
      T = -1;
    function E() {
      return g ? !0 : !(e.unstable_now() - T < w);
    }
    function D() {
      if (((g = !1), S)) {
        var t = e.unstable_now();
        T = t;
        var i = !0;
        try {
          a: {
            ((m = !1), h && ((h = !1), v(C), (C = -1)), (p = !0));
            var a = f;
            try {
              b: {
                for (
                  b(t), d = n(c);
                  d !== null && !(d.expirationTime > t && E());
                ) {
                  var o = d.callback;
                  if (typeof o == `function`) {
                    ((d.callback = null), (f = d.priorityLevel));
                    var s = o(d.expirationTime <= t);
                    if (((t = e.unstable_now()), typeof s == `function`)) {
                      ((d.callback = s), b(t), (i = !0));
                      break b;
                    }
                    (d === n(c) && r(c), b(t));
                  } else r(c);
                  d = n(c);
                }
                if (d !== null) i = !0;
                else {
                  var u = n(l);
                  (u !== null && j(x, u.startTime - t), (i = !1));
                }
              }
              break a;
            } finally {
              ((d = null), (f = a), (p = !1));
            }
            i = void 0;
          }
        } finally {
          i ? O() : (S = !1);
        }
      }
    }
    var O;
    if (typeof y == `function`)
      O = function () {
        y(D);
      };
    else if (typeof MessageChannel < `u`) {
      var k = new MessageChannel(),
        A = k.port2;
      ((k.port1.onmessage = D),
        (O = function () {
          A.postMessage(null);
        }));
    } else
      O = function () {
        _(D, 0);
      };
    function j(t, n) {
      C = _(function () {
        t(e.unstable_now());
      }, n);
    }
    ((e.unstable_IdlePriority = 5),
      (e.unstable_ImmediatePriority = 1),
      (e.unstable_LowPriority = 4),
      (e.unstable_NormalPriority = 3),
      (e.unstable_Profiling = null),
      (e.unstable_UserBlockingPriority = 2),
      (e.unstable_cancelCallback = function (e) {
        e.callback = null;
      }),
      (e.unstable_forceFrameRate = function (e) {
        0 > e || 125 < e
          ? console.error(
              `forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`,
            )
          : (w = 0 < e ? Math.floor(1e3 / e) : 5);
      }),
      (e.unstable_getCurrentPriorityLevel = function () {
        return f;
      }),
      (e.unstable_next = function (e) {
        switch (f) {
          case 1:
          case 2:
          case 3:
            var t = 3;
            break;
          default:
            t = f;
        }
        var n = f;
        f = t;
        try {
          return e();
        } finally {
          f = n;
        }
      }),
      (e.unstable_requestPaint = function () {
        g = !0;
      }),
      (e.unstable_runWithPriority = function (e, t) {
        switch (e) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            e = 3;
        }
        var n = f;
        f = e;
        try {
          return t();
        } finally {
          f = n;
        }
      }),
      (e.unstable_scheduleCallback = function (r, i, a) {
        var o = e.unstable_now();
        switch (
          (typeof a == `object` && a
            ? ((a = a.delay), (a = typeof a == `number` && 0 < a ? o + a : o))
            : (a = o),
          r)
        ) {
          case 1:
            var s = -1;
            break;
          case 2:
            s = 250;
            break;
          case 5:
            s = 1073741823;
            break;
          case 4:
            s = 1e4;
            break;
          default:
            s = 5e3;
        }
        return (
          (s = a + s),
          (r = {
            id: u++,
            callback: i,
            priorityLevel: r,
            startTime: a,
            expirationTime: s,
            sortIndex: -1,
          }),
          a > o
            ? ((r.sortIndex = a),
              t(l, r),
              n(c) === null &&
                r === n(l) &&
                (h ? (v(C), (C = -1)) : (h = !0), j(x, a - o)))
            : ((r.sortIndex = s),
              t(c, r),
              m || p || ((m = !0), S || ((S = !0), O()))),
          r
        );
      }),
      (e.unstable_shouldYield = E),
      (e.unstable_wrapCallback = function (e) {
        var t = f;
        return function () {
          var n = f;
          f = t;
          try {
            return e.apply(this, arguments);
          } finally {
            f = n;
          }
        };
      }));
  }),
  n = e((e, n) => {
    n.exports = t();
  }),
  r = e((e) => {
    var t = Symbol.for(`react.transitional.element`),
      n = Symbol.for(`react.portal`),
      r = Symbol.for(`react.fragment`),
      i = Symbol.for(`react.strict_mode`),
      a = Symbol.for(`react.profiler`),
      o = Symbol.for(`react.consumer`),
      s = Symbol.for(`react.context`),
      c = Symbol.for(`react.forward_ref`),
      l = Symbol.for(`react.suspense`),
      u = Symbol.for(`react.memo`),
      d = Symbol.for(`react.lazy`),
      f = Symbol.for(`react.activity`),
      p = Symbol.for(`react.view_transition`),
      m = Symbol.iterator;
    function h(e) {
      return typeof e != `object` || !e
        ? null
        : ((e = (m && e[m]) || e[`@@iterator`]),
          typeof e == `function` ? e : null);
    }
    var g = {
        isMounted: function () {
          return !1;
        },
        enqueueForceUpdate: function () {},
        enqueueReplaceState: function () {},
        enqueueSetState: function () {},
      },
      _ = Object.assign,
      v = {};
    function y(e, t, n) {
      ((this.props = e),
        (this.context = t),
        (this.refs = v),
        (this.updater = n || g));
    }
    ((y.prototype.isReactComponent = {}),
      (y.prototype.setState = function (e, t) {
        if (typeof e != `object` && typeof e != `function` && e != null)
          throw Error(
            `takes an object of state variables to update or a function which returns an object of state variables.`,
          );
        this.updater.enqueueSetState(this, e, t, `setState`);
      }),
      (y.prototype.forceUpdate = function (e) {
        this.updater.enqueueForceUpdate(this, e, `forceUpdate`);
      }));
    function b() {}
    b.prototype = y.prototype;
    function x(e, t, n) {
      ((this.props = e),
        (this.context = t),
        (this.refs = v),
        (this.updater = n || g));
    }
    var S = (x.prototype = new b());
    ((S.constructor = x), _(S, y.prototype), (S.isPureReactComponent = !0));
    var C = Array.isArray;
    function w() {}
    var T = { H: null, A: null, T: null, S: null },
      E = Object.prototype.hasOwnProperty;
    function D(e, n, r) {
      var i = r.ref;
      return {
        $$typeof: t,
        type: e,
        key: n,
        ref: i === void 0 ? null : i,
        props: r,
      };
    }
    function O(e, t) {
      return D(e.type, t, e.props);
    }
    function k(e) {
      return typeof e == `object` && !!e && e.$$typeof === t;
    }
    function A(e) {
      var t = { "=": `=0`, ":": `=2` };
      return (
        `$` +
        e.replace(/[=:]/g, function (e) {
          return t[e];
        })
      );
    }
    var j = /\/+/g;
    function M(e, t) {
      return typeof e == `object` && e && e.key != null
        ? A(`` + e.key)
        : t.toString(36);
    }
    function N(e) {
      switch (e.status) {
        case `fulfilled`:
          return e.value;
        case `rejected`:
          throw e.reason;
        default:
          switch (
            (typeof e.status == `string`
              ? e.then(w, w)
              : ((e.status = `pending`),
                e.then(
                  function (t) {
                    e.status === `pending` &&
                      ((e.status = `fulfilled`), (e.value = t));
                  },
                  function (t) {
                    e.status === `pending` &&
                      ((e.status = `rejected`), (e.reason = t));
                  },
                )),
            e.status)
          ) {
            case `fulfilled`:
              return e.value;
            case `rejected`:
              throw e.reason;
          }
      }
      throw e;
    }
    function P(e, r, i, a, o) {
      var s = typeof e;
      (s === `undefined` || s === `boolean`) && (e = null);
      var c = !1;
      if (e === null) c = !0;
      else
        switch (s) {
          case `bigint`:
          case `string`:
          case `number`:
            c = !0;
            break;
          case `object`:
            switch (e.$$typeof) {
              case t:
              case n:
                c = !0;
                break;
              case d:
                return ((c = e._init), P(c(e._payload), r, i, a, o));
            }
        }
      if (c)
        return (
          (o = o(e)),
          (c = a === `` ? `.` + M(e, 0) : a),
          C(o)
            ? ((i = ``),
              c != null && (i = c.replace(j, `$&/`) + `/`),
              P(o, r, i, ``, function (e) {
                return e;
              }))
            : o != null &&
              (k(o) &&
                (o = O(
                  o,
                  i +
                    (o.key == null || (e && e.key === o.key)
                      ? ``
                      : (`` + o.key).replace(j, `$&/`) + `/`) +
                    c,
                )),
              r.push(o)),
          1
        );
      c = 0;
      var l = a === `` ? `.` : a + `:`;
      if (C(e))
        for (var u = 0; u < e.length; u++)
          ((a = e[u]), (s = l + M(a, u)), (c += P(a, r, i, s, o)));
      else if (((u = h(e)), typeof u == `function`))
        for (e = u.call(e), u = 0; !(a = e.next()).done;)
          ((a = a.value), (s = l + M(a, u++)), (c += P(a, r, i, s, o)));
      else if (s === `object`) {
        if (typeof e.then == `function`) return P(N(e), r, i, a, o);
        throw (
          (r = String(e)),
          Error(
            `Objects are not valid as a React child (found: ` +
              (r === `[object Object]`
                ? `object with keys {` + Object.keys(e).join(`, `) + `}`
                : r) +
              `). If you meant to render a collection of children, use an array instead.`,
          )
        );
      }
      return c;
    }
    function F(e, t, n) {
      if (e == null) return e;
      var r = [],
        i = 0;
      return (
        P(e, r, ``, ``, function (e) {
          return t.call(n, e, i++);
        }),
        r
      );
    }
    function ee(e) {
      if (e._status === -1) {
        var t = e._result,
          n = t();
        (n.then(
          function (t) {
            (e._status === 0 || e._status === -1) &&
              ((e._status = 1),
              (e._result = t),
              n.status === void 0 && ((n.status = `fulfilled`), (n.value = t)));
          },
          function (t) {
            (e._status === 0 || e._status === -1) &&
              ((e._status = 2),
              (e._result = t),
              n.status === void 0 && ((n.status = `rejected`), (n.reason = t)));
          },
        ),
          e._status === -1 && ((e._status = 0), (e._result = n)));
      }
      if (e._status === 1) return e._result.default;
      throw e._result;
    }
    var te =
      typeof reportError == `function`
        ? reportError
        : function (e) {
            if (
              typeof window == `object` &&
              typeof window.ErrorEvent == `function`
            ) {
              var t = new window.ErrorEvent(`error`, {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof e == `object` && e && typeof e.message == `string`
                    ? String(e.message)
                    : String(e),
                error: e,
              });
              if (!window.dispatchEvent(t)) return;
            } else if (
              typeof process == `object` &&
              typeof process.emit == `function`
            ) {
              process.emit(`uncaughtException`, e);
              return;
            }
            console.error(e);
          };
    function ne(e) {
      var t = T.T,
        n = {};
      ((n.types = t === null ? null : t.types), (T.T = n));
      try {
        var r = e(),
          i = T.S;
        (i !== null && i(n, r),
          typeof r == `object` &&
            r &&
            typeof r.then == `function` &&
            r.then(w, te));
      } catch (e) {
        te(e);
      } finally {
        (t !== null && n.types !== null && (t.types = n.types), (T.T = t));
      }
    }
    function re(e) {
      var t = T.T;
      if (t !== null) {
        var n = t.types;
        n === null ? (t.types = [e]) : n.indexOf(e) === -1 && n.push(e);
      } else ne(re.bind(null, e));
    }
    var I = {
      map: F,
      forEach: function (e, t, n) {
        F(
          e,
          function () {
            t.apply(this, arguments);
          },
          n,
        );
      },
      count: function (e) {
        var t = 0;
        return (
          F(e, function () {
            t++;
          }),
          t
        );
      },
      toArray: function (e) {
        return (
          F(e, function (e) {
            return e;
          }) || []
        );
      },
      only: function (e) {
        if (!k(e))
          throw Error(
            `React.Children.only expected to receive a single React element child.`,
          );
        return e;
      },
    };
    ((e.Activity = f),
      (e.Children = I),
      (e.Component = y),
      (e.Fragment = r),
      (e.Profiler = a),
      (e.PureComponent = x),
      (e.StrictMode = i),
      (e.Suspense = l),
      (e.ViewTransition = p),
      (e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = T),
      (e.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function (e) {
          return T.H.useMemoCache(e);
        },
      }),
      (e.addTransitionType = re),
      (e.cache = function (e) {
        return function () {
          return e.apply(null, arguments);
        };
      }),
      (e.cacheSignal = function () {
        return null;
      }),
      (e.cloneElement = function (e, t, n) {
        if (e == null)
          throw Error(
            `The argument must be a React element, but you passed ` + e + `.`,
          );
        var r = _({}, e.props),
          i = e.key;
        if (t != null)
          for (a in (t.key !== void 0 && (i = `` + t.key), t))
            !E.call(t, a) ||
              a === `key` ||
              a === `__self` ||
              a === `__source` ||
              (a === `ref` && t.ref === void 0) ||
              (r[a] = t[a]);
        var a = arguments.length - 2;
        if (a === 1) r.children = n;
        else if (1 < a) {
          for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
          r.children = o;
        }
        return D(e.type, i, r);
      }),
      (e.createContext = function (e) {
        return (
          (e = {
            $$typeof: s,
            _currentValue: e,
            _currentValue2: e,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
          }),
          (e.Provider = e),
          (e.Consumer = { $$typeof: o, _context: e }),
          e
        );
      }),
      (e.createElement = function (e, t, n) {
        var r,
          i = {},
          a = null;
        if (t != null)
          for (r in (t.key !== void 0 && (a = `` + t.key), t))
            E.call(t, r) &&
              r !== `key` &&
              r !== `__self` &&
              r !== `__source` &&
              (i[r] = t[r]);
        var o = arguments.length - 2;
        if (o === 1) i.children = n;
        else if (1 < o) {
          for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
          i.children = s;
        }
        if (e && e.defaultProps)
          for (r in ((o = e.defaultProps), o)) i[r] === void 0 && (i[r] = o[r]);
        return D(e, a, i);
      }),
      (e.createRef = function () {
        return { current: null };
      }),
      (e.forwardRef = function (e) {
        return { $$typeof: c, render: e };
      }),
      (e.isValidElement = k),
      (e.lazy = function (e) {
        return {
          $$typeof: d,
          _payload: { _status: -1, _result: e },
          _init: ee,
        };
      }),
      (e.memo = function (e, t) {
        return { $$typeof: u, type: e, compare: t === void 0 ? null : t };
      }),
      (e.startTransition = ne),
      (e.unstable_useCacheRefresh = function () {
        return T.H.useCacheRefresh();
      }),
      (e.use = function (e) {
        return T.H.use(e);
      }),
      (e.useActionState = function (e, t, n) {
        return T.H.useActionState(e, t, n);
      }),
      (e.useCallback = function (e, t) {
        return T.H.useCallback(e, t);
      }),
      (e.useContext = function (e) {
        return T.H.useContext(e);
      }),
      (e.useDebugValue = function () {}),
      (e.useDeferredValue = function (e, t) {
        return T.H.useDeferredValue(e, t);
      }),
      (e.useEffect = function (e, t) {
        return T.H.useEffect(e, t);
      }),
      (e.useEffectEvent = function (e) {
        return T.H.useEffectEvent(e);
      }),
      (e.useId = function () {
        return T.H.useId();
      }),
      (e.useImperativeHandle = function (e, t, n) {
        return T.H.useImperativeHandle(e, t, n);
      }),
      (e.useInsertionEffect = function (e, t) {
        return T.H.useInsertionEffect(e, t);
      }),
      (e.useLayoutEffect = function (e, t) {
        return T.H.useLayoutEffect(e, t);
      }),
      (e.useMemo = function (e, t) {
        return T.H.useMemo(e, t);
      }),
      (e.useOptimistic = function (e, t) {
        return T.H.useOptimistic(e, t);
      }),
      (e.useReducer = function (e, t, n) {
        return T.H.useReducer(e, t, n);
      }),
      (e.useRef = function (e) {
        return T.H.useRef(e);
      }),
      (e.useState = function (e) {
        return T.H.useState(e);
      }),
      (e.useSyncExternalStore = function (e, t, n) {
        return T.H.useSyncExternalStore(e, t, n);
      }),
      (e.useTransition = function () {
        return T.H.useTransition();
      }),
      (e.version = `19.3.1`));
  }),
  i = e((e, t) => {
    t.exports = r();
  }),
  a = e((e) => {
    var t = i();
    function n(e) {
      var t = `https://react.dev/errors/` + e;
      if (1 < arguments.length) {
        t += `?args[]=` + encodeURIComponent(arguments[1]);
        for (var n = 2; n < arguments.length; n++)
          t += `&args[]=` + encodeURIComponent(arguments[n]);
      }
      return (
        `Minified React error #` +
        e +
        `; visit ` +
        t +
        ` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`
      );
    }
    function r() {}
    var a = {
        d: {
          f: r,
          r: function () {
            throw Error(n(522));
          },
          D: r,
          C: r,
          L: r,
          m: r,
          X: r,
          S: r,
          M: r,
        },
        p: 0,
        findDOMNode: null,
      },
      o = Symbol.for(`react.portal`),
      s = Symbol.for(`react.recoverable`),
      c = Symbol.for(`react.optimistic_key`);
    function l(e, t, n) {
      var r =
        3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      return {
        $$typeof: o,
        key: r == null ? null : r === c ? c : `` + r,
        children: e,
        containerInfo: t,
        implementation: n,
      };
    }
    var u = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function d(e, t) {
      if (e === `font`) return ``;
      if (typeof t == `string`) return t === `use-credentials` ? t : ``;
    }
    ((e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = a),
      (e.browser = function (e) {
        return { $$typeof: s, _reason: e };
      }),
      (e.createPortal = function (e, t) {
        var r =
          2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
        if (!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11))
          throw Error(n(299));
        return l(e, t, null, r);
      }),
      (e.flushSync = function (e) {
        var t = u.T,
          n = a.p;
        try {
          if (((u.T = null), (a.p = 2), e)) return e();
        } finally {
          ((u.T = t), (a.p = n), a.d.f());
        }
      }),
      (e.preconnect = function (e, t) {
        typeof e == `string` &&
          (t
            ? ((t = t.crossOrigin),
              (t =
                typeof t == `string`
                  ? t === `use-credentials`
                    ? t
                    : ``
                  : void 0))
            : (t = null),
          a.d.C(e, t));
      }),
      (e.prefetchDNS = function (e) {
        typeof e == `string` && a.d.D(e);
      }),
      (e.preinit = function (e, t) {
        if (typeof e == `string` && t && typeof t.as == `string`) {
          var n = t.as,
            r = d(n, t.crossOrigin),
            i = typeof t.integrity == `string` ? t.integrity : void 0,
            o = typeof t.fetchPriority == `string` ? t.fetchPriority : void 0;
          n === `style`
            ? a.d.S(
                e,
                typeof t.precedence == `string` ? t.precedence : void 0,
                { crossOrigin: r, integrity: i, fetchPriority: o },
              )
            : n === `script` &&
              a.d.X(e, {
                crossOrigin: r,
                integrity: i,
                fetchPriority: o,
                nonce: typeof t.nonce == `string` ? t.nonce : void 0,
              });
        }
      }),
      (e.preinitModule = function (e, t) {
        if (typeof e == `string`) {
          if (typeof t == `object` && t) {
            if (t.as == null || t.as === `script`) {
              var n = d(t.as, t.crossOrigin);
              a.d.M(e, {
                crossOrigin: n,
                integrity:
                  typeof t.integrity == `string` ? t.integrity : void 0,
                nonce: typeof t.nonce == `string` ? t.nonce : void 0,
                fetchPriority:
                  typeof t.fetchPriority == `string` ? t.fetchPriority : void 0,
              });
            }
          } else t ?? a.d.M(e);
        }
      }),
      (e.preload = function (e, t) {
        if (
          typeof e == `string` &&
          typeof t == `object` &&
          t &&
          typeof t.as == `string`
        ) {
          var n = t.as,
            r = d(n, t.crossOrigin);
          a.d.L(e, n, {
            crossOrigin: r,
            integrity: typeof t.integrity == `string` ? t.integrity : void 0,
            nonce: typeof t.nonce == `string` ? t.nonce : void 0,
            type: typeof t.type == `string` ? t.type : void 0,
            fetchPriority:
              typeof t.fetchPriority == `string` ? t.fetchPriority : void 0,
            referrerPolicy:
              typeof t.referrerPolicy == `string` ? t.referrerPolicy : void 0,
            imageSrcSet:
              typeof t.imageSrcSet == `string` ? t.imageSrcSet : void 0,
            imageSizes: typeof t.imageSizes == `string` ? t.imageSizes : void 0,
            media: typeof t.media == `string` ? t.media : void 0,
          });
        }
      }),
      (e.preloadModule = function (e, t) {
        if (typeof e == `string`) {
          if (t) {
            var n = d(t.as, t.crossOrigin);
            a.d.m(e, {
              as: typeof t.as == `string` && t.as !== `script` ? t.as : void 0,
              crossOrigin: n,
              integrity: typeof t.integrity == `string` ? t.integrity : void 0,
              nonce: typeof t.nonce == `string` ? t.nonce : void 0,
              fetchPriority:
                typeof t.fetchPriority == `string` ? t.fetchPriority : void 0,
            });
          } else a.d.m(e);
        }
      }),
      (e.requestFormReset = function (e) {
        a.d.r(e);
      }),
      (e.unstable_batchedUpdates = function (e, t) {
        return e(t);
      }),
      (e.useFormState = function (e, t, n) {
        return u.H.useFormState(e, t, n);
      }),
      (e.useFormStatus = function () {
        return u.H.useHostTransitionStatus();
      }),
      (e.version = `19.3.1`));
  }),
  o = e((e, t) => {
    function n() {
      if (
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < `u` &&
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == `function`
      )
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
        } catch (e) {
          console.error(e);
        }
    }
    (n(), (t.exports = a()));
  }),
  s = e((e) => {
    var t = n(),
      r = i(),
      a = o();
    function s(e) {
      var t = `https://react.dev/errors/` + e;
      if (1 < arguments.length) {
        t += `?args[]=` + encodeURIComponent(arguments[1]);
        for (var n = 2; n < arguments.length; n++)
          t += `&args[]=` + encodeURIComponent(arguments[n]);
      }
      return (
        `Minified React error #` +
        e +
        `; visit ` +
        t +
        ` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`
      );
    }
    function c(e) {
      return !(
        !e ||
        (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11)
      );
    }
    function l(e) {
      for (var t = e, n = t; n && !n.alternate;)
        ((t = n), t.flags & 4098 && (e = t.return), (n = t.return));
      for (; t.return;) t = t.return;
      return t.tag === 3 ? e : null;
    }
    function u(e) {
      if (e.tag === 13) {
        var t = e.memoizedState;
        if (
          (t === null &&
            ((e = e.alternate), e !== null && (t = e.memoizedState)),
          t !== null)
        )
          return t.dehydrated;
      }
      return null;
    }
    function d(e) {
      if (e.tag === 31) {
        var t = e.memoizedState;
        if (
          (t === null &&
            ((e = e.alternate), e !== null && (t = e.memoizedState)),
          t !== null)
        )
          return t.dehydrated;
      }
      return null;
    }
    function f(e) {
      if (l(e) !== e) throw Error(s(188));
    }
    function p(e) {
      var t = e.alternate;
      if (!t) {
        if (((t = l(e)), t === null)) throw Error(s(188));
        return t === e ? e : null;
      }
      for (var n = e, r = t; ;) {
        var i = n.return;
        if (i === null) break;
        var a = i.alternate;
        if (a === null) {
          if (((r = i.return), r !== null)) {
            n = r;
            continue;
          }
          break;
        }
        if (i.child === a.child) {
          for (a = i.child; a;) {
            if (a === n) return (f(i), e);
            if (a === r) return (f(i), t);
            a = a.sibling;
          }
          throw Error(s(188));
        }
        if (n.return !== r.return) ((n = i), (r = a));
        else {
          for (var o = !1, c = i.child; c;) {
            if (c === n) {
              ((o = !0), (n = i), (r = a));
              break;
            }
            if (c === r) {
              ((o = !0), (r = i), (n = a));
              break;
            }
            c = c.sibling;
          }
          if (!o) {
            for (c = a.child; c;) {
              if (c === n) {
                ((o = !0), (n = a), (r = i));
                break;
              }
              if (c === r) {
                ((o = !0), (r = a), (n = i));
                break;
              }
              c = c.sibling;
            }
            if (!o) throw Error(s(189));
          }
        }
        if (n.alternate !== r) throw Error(s(190));
      }
      if (n.tag !== 3) throw Error(s(188));
      return n.stateNode.current === n ? e : t;
    }
    function m(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e;
      for (e = e.child; e !== null;) {
        if (((t = m(e)), t !== null)) return t;
        e = e.sibling;
      }
      return null;
    }
    function h(e, t, n, r, i, a) {
      for (; e !== null;) {
        if (
          ((e.tag === 5 || e.tag === 27 || e.tag === 6) && n(e, r, i, a)) ||
          ((e.tag !== 22 || e.memoizedState === null) &&
            (t || (e.tag !== 5 && e.tag !== 27)) &&
            h(e.child, t, n, r, i, a))
        )
          return !0;
        e = e.sibling;
      }
      return !1;
    }
    function g(e) {
      for (e = e.return; e !== null;) {
        if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
        e = e.return;
      }
      return null;
    }
    function _(e) {
      var t = !1;
      for (
        e = e.return;
        e !== null &&
        (e.tag === 4 && (t = !0), e.tag !== 3 && e.tag !== 5 && e.tag !== 27);
      )
        e = e.return;
      return t;
    }
    function v(e) {
      var t = [null, null],
        n = g(e);
      return (n === null || y(t, e, n.child, { foundSelf: !1 }), t);
    }
    function y(e, t, n, r) {
      for (; n !== null;) {
        if (n === t) r.foundSelf = !0;
        else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
          if (r.foundSelf) return ((e[1] = n), !0);
          e[0] = n;
        } else if (
          (n.tag !== 22 || n.memoizedState === null) &&
          y(e, t, n.child, r)
        )
          return !0;
        n = n.sibling;
      }
      return !1;
    }
    function b(e) {
      switch (e.tag) {
        case 5:
        case 27:
        case 6:
          return e.stateNode;
        case 3:
          return e.stateNode.containerInfo;
        default:
          throw Error(s(559));
      }
    }
    var x = null,
      S = null;
    function C(e, t, n) {
      return e === n || (e === t && ((x = e), !0));
    }
    function w(e, t, n) {
      return e === n ? ((S = e), !1) : e === t && (S !== null && (x = e), !0);
    }
    function T(e) {
      if (e === null) return null;
      do e = e === null ? null : e.return;
      while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
      return e || null;
    }
    function E(e, t, n) {
      for (var r = 0, i = e; i; i = n(i)) r++;
      i = 0;
      for (var a = t; a; a = n(a)) i++;
      for (; 0 < r - i;) ((e = n(e)), r--);
      for (; 0 < i - r;) ((t = n(t)), i--);
      for (; r--;) {
        if (e === t || (t !== null && e === t.alternate)) return e;
        ((e = n(e)), (t = n(t)));
      }
      return null;
    }
    var D = Object.assign,
      O = Symbol.for(`react.element`),
      k = Symbol.for(`react.transitional.element`),
      A = Symbol.for(`react.portal`),
      j = Symbol.for(`react.fragment`),
      M = Symbol.for(`react.strict_mode`),
      N = Symbol.for(`react.profiler`),
      P = Symbol.for(`react.consumer`),
      F = Symbol.for(`react.context`),
      ee = Symbol.for(`react.forward_ref`),
      te = Symbol.for(`react.suspense`),
      ne = Symbol.for(`react.suspense_list`),
      re = Symbol.for(`react.memo`),
      I = Symbol.for(`react.lazy`),
      L = Symbol.for(`react.activity`),
      ie = Symbol.for(`react.legacy_hidden`),
      ae = Symbol.for(`react.memo_cache_sentinel`),
      oe = Symbol.for(`react.view_transition`),
      se = Symbol.for(`react.recoverable`),
      ce = Symbol.iterator;
    function R(e) {
      return typeof e != `object` || !e
        ? null
        : ((e = (ce && e[ce]) || e[`@@iterator`]),
          typeof e == `function` ? e : null);
    }
    var le = Symbol.for(`react.client.reference`);
    function ue(e) {
      if (e == null) return null;
      if (typeof e == `function`)
        return e.$$typeof === le ? null : e.displayName || e.name || null;
      if (typeof e == `string`) return e;
      switch (e) {
        case j:
          return `Fragment`;
        case N:
          return `Profiler`;
        case M:
          return `StrictMode`;
        case te:
          return `Suspense`;
        case ne:
          return `SuspenseList`;
        case L:
          return `Activity`;
        case oe:
          return `ViewTransition`;
      }
      if (typeof e == `object`)
        switch (e.$$typeof) {
          case A:
            return `Portal`;
          case F:
            return e.displayName || `Context`;
          case P:
            return (e._context.displayName || `Context`) + `.Consumer`;
          case ee:
            var t = e.render;
            return (
              (e = e.displayName),
              (e ||=
                ((e = t.displayName || t.name || ``),
                e === `` ? `ForwardRef` : `ForwardRef(` + e + `)`)),
              e
            );
          case re:
            return (
              (t = e.displayName || null),
              t === null ? ue(e.type) || `Memo` : t
            );
          case I:
            ((t = e._payload), (e = e._init));
            try {
              return ue(e(t));
            } catch {}
        }
      return null;
    }
    var z = Array.isArray,
      B = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      V = a.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      de = { pending: !1, data: null, method: null, action: null },
      fe = [],
      pe = -1;
    function me(e) {
      return { current: e };
    }
    function he(e) {
      0 > pe || ((e.current = fe[pe]), (fe[pe] = null), pe--);
    }
    function ge(e, t) {
      (pe++, (fe[pe] = e.current), (e.current = t));
    }
    var H = me(null),
      U = me(null),
      _e = me(null),
      ve = me(null);
    function ye(e, t) {
      switch ((ge(_e, t), ge(U, e), ge(H, null), t.nodeType)) {
        case 9:
        case 11:
          e = (e = t.documentElement) && (e = e.namespaceURI) ? up(e) : 0;
          break;
        default:
          if (((e = t.tagName), (t = t.namespaceURI)))
            ((t = up(t)), (e = dp(t, e)));
          else
            switch (e) {
              case `svg`:
                e = 1;
                break;
              case `math`:
                e = 2;
                break;
              default:
                e = 0;
            }
      }
      (he(H), ge(H, e));
    }
    function be() {
      (he(H), he(U), he(_e));
    }
    function xe(e) {
      var t = e.memoizedState;
      (t !== null && ((sh._currentValue = t.memoizedState), ge(ve, e)),
        (t = H.current));
      var n = dp(t, e.type);
      t !== n && (ge(U, e), ge(H, n));
    }
    function W(e) {
      (U.current === e && (he(H), he(U)),
        ve.current === e && (he(ve), (sh._currentValue = de)));
    }
    var Se, Ce;
    function we(e) {
      if (Se === void 0)
        try {
          throw Error();
        } catch (e) {
          var t = e.stack.trim().match(/\n( *(at )?)/);
          ((Se = (t && t[1]) || ``),
            (Ce =
              -1 <
              e.stack.indexOf(`
    at`)
                ? ` (<anonymous>)`
                : -1 < e.stack.indexOf(`@`)
                  ? `@unknown:0:0`
                  : ``));
        }
      return (
        `
` +
        Se +
        e +
        Ce
      );
    }
    var Te = !1;
    function Ee(e, t) {
      if (!e || Te) return ``;
      Te = !0;
      var n = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var r = {
          DetermineComponentFrameRoot: function () {
            try {
              if (t) {
                var n = function () {
                  throw Error();
                };
                if (
                  (Object.defineProperty(n.prototype, "props", {
                    set: function () {
                      throw Error();
                    },
                  }),
                  typeof Reflect == `object` && Reflect.construct)
                ) {
                  try {
                    Reflect.construct(n, []);
                  } catch (e) {
                    var r = e;
                  }
                  Reflect.construct(e, [], n);
                } else {
                  try {
                    n.call();
                  } catch (e) {
                    r = e;
                  }
                  n = !1;
                  try {
                    var i = Object.getOwnPropertyDescriptor(
                      e.prototype,
                      `props`,
                    );
                    (Object.defineProperty(e.prototype, "props", {
                      configurable: !0,
                      set: function () {
                        throw Error();
                      },
                    }),
                      (n = !0),
                      new e());
                  } finally {
                    n &&
                      (i === void 0
                        ? delete e.prototype.props
                        : Object.defineProperty(e.prototype, "props", i));
                  }
                }
              } else {
                try {
                  throw Error();
                } catch (e) {
                  r = e;
                }
                (n = e()) &&
                  typeof n.catch == `function` &&
                  n.catch(function () {});
              }
            } catch (e) {
              if (e && r && typeof e.stack == `string`)
                return [e.stack, r.stack];
            }
            return [null, null];
          },
        };
        r.DetermineComponentFrameRoot.displayName = `DetermineComponentFrameRoot`;
        var i = Object.getOwnPropertyDescriptor(
          r.DetermineComponentFrameRoot,
          `name`,
        );
        i &&
          i.configurable &&
          Object.defineProperty(r.DetermineComponentFrameRoot, "name", {
            value: `DetermineComponentFrameRoot`,
          });
        var a = r.DetermineComponentFrameRoot(),
          o = a[0],
          s = a[1];
        if (o && s) {
          var c = o.split(`
`),
            l = s.split(`
`);
          for (
            i = r = 0;
            r < c.length && !c[r].includes(`DetermineComponentFrameRoot`);
          )
            r++;
          for (; i < l.length && !l[i].includes(`DetermineComponentFrameRoot`);)
            i++;
          if (r === c.length || i === l.length)
            for (
              r = c.length - 1, i = l.length - 1;
              1 <= r && 0 <= i && c[r] !== l[i];
            )
              i--;
          for (; 1 <= r && 0 <= i; r--, i--)
            if (c[r] !== l[i]) {
              if (r !== 1 || i !== 1)
                do
                  if ((r--, i--, 0 > i || c[r] !== l[i])) {
                    var u =
                      `
` + c[r].replace(` at new `, ` at `);
                    return (
                      e.displayName &&
                        u.includes(`<anonymous>`) &&
                        (u = u.replace(`<anonymous>`, e.displayName)),
                      u
                    );
                  }
                while (1 <= r && 0 <= i);
              break;
            }
        }
      } finally {
        ((Te = !1), (Error.prepareStackTrace = n));
      }
      return (n = e ? e.displayName || e.name : ``) ? we(n) : ``;
    }
    function De(e, t) {
      switch (e.tag) {
        case 26:
        case 27:
        case 5:
          return we(e.type);
        case 16:
          return we(`Lazy`);
        case 13:
          return e.child !== t && t !== null
            ? we(`Suspense Fallback`)
            : we(`Suspense`);
        case 19:
          return we(`SuspenseList`);
        case 0:
        case 15:
          return Ee(e.type, !1);
        case 11:
          return Ee(e.type.render, !1);
        case 1:
          return Ee(e.type, !0);
        case 31:
          return we(`Activity`);
        case 30:
          return we(`ViewTransition`);
        default:
          return ``;
      }
    }
    function Oe(e) {
      try {
        var t = ``,
          n = null;
        do ((t += De(e, n)), (n = e), (e = e.return));
        while (e);
        return t;
      } catch (e) {
        return (
          `
Error generating stack: ` +
          e.message +
          `
` +
          e.stack
        );
      }
    }
    var ke = Object.prototype.hasOwnProperty,
      Ae = t.unstable_scheduleCallback,
      je = t.unstable_cancelCallback,
      Me = t.unstable_shouldYield,
      Ne = t.unstable_requestPaint,
      Pe = t.unstable_now,
      Fe = t.unstable_getCurrentPriorityLevel,
      Ie = t.unstable_ImmediatePriority,
      Le = t.unstable_UserBlockingPriority,
      Re = t.unstable_NormalPriority,
      ze = t.unstable_LowPriority,
      Be = t.unstable_IdlePriority,
      Ve = t.log,
      He = t.unstable_setDisableYieldValue,
      Ue = null,
      We = null;
    function Ge(e) {
      if (
        (typeof Ve == `function` && He(e),
        We && typeof We.setStrictMode == `function`)
      )
        try {
          We.setStrictMode(Ue, e);
        } catch {}
    }
    var Ke = Math.clz32 ? Math.clz32 : Ye,
      qe = Math.log,
      Je = Math.LN2;
    function Ye(e) {
      return ((e >>>= 0), e === 0 ? 32 : (31 - ((qe(e) / Je) | 0)) | 0);
    }
    var Xe = 256,
      Ze = 262144,
      Qe = 4194304;
    function $e(e) {
      var t = e & 42;
      if (t !== 0) return t;
      switch (e & -e) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
          return 64;
        case 128:
          return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
          return e & -e;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return e & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return e & 62914560;
        case 67108864:
          return 67108864;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 0;
        default:
          return e;
      }
    }
    function et(e, t, n) {
      var r = e.pendingLanes;
      if (r === 0) return 0;
      var i = 0,
        a = e.suspendedLanes,
        o = e.pingedLanes;
      e = e.warmLanes;
      var s = r & 134217727;
      return (
        s === 0
          ? ((s = r & ~a),
            s === 0
              ? o === 0
                ? n || ((n = r & ~e), n !== 0 && (i = $e(n)))
                : (i = $e(o))
              : (i = $e(s)))
          : ((r = s & ~a),
            r === 0
              ? ((o &= s),
                o === 0
                  ? n || ((n = s & ~e), n !== 0 && (i = $e(n)))
                  : (i = $e(o)))
              : (i = $e(r))),
        i === 0
          ? 0
          : t !== 0 &&
              t !== i &&
              (t & a) === 0 &&
              ((a = i & -i), (n = t & -t), a >= n || (a === 32 && n & 4194048))
            ? t
            : i
      );
    }
    function tt(e, t) {
      return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
    }
    function nt(e, t) {
      t & 8 && (t |= t & 32);
      var n = e.entangledLanes;
      if (n !== 0)
        for (e = e.entanglements, n &= t; 0 < n;) {
          var r = 31 - Ke(n),
            i = 1 << r;
          ((t |= e[r]), (n &= ~i));
        }
      return t;
    }
    function rt(e, t) {
      switch (e) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
          return t + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return t + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function it() {
      var e = Qe;
      return ((Qe <<= 1), !(Qe & 62914560) && (Qe = 4194304), e);
    }
    function at(e) {
      for (var t = [], n = 0; 31 > n; n++) t.push(e);
      return t;
    }
    function ot(e, t) {
      ((e.pendingLanes |= t),
        t !== 268435456 &&
          ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0)));
    }
    function st(e, t, n, r, i, a) {
      var o = e.pendingLanes;
      ((e.pendingLanes = n),
        (e.suspendedLanes = 0),
        (e.pingedLanes = 0),
        (e.warmLanes = 0),
        (e.expiredLanes &= n),
        (e.entangledLanes &= n),
        (e.errorRecoveryDisabledLanes &= n),
        (e.shellSuspendCounter = 0));
      var s = e.entanglements,
        c = e.expirationTimes,
        l = e.hiddenUpdates;
      for (n = o & ~n; 0 < n;) {
        var u = 31 - Ke(n),
          d = 1 << u;
        ((s[u] = 0), (c[u] = -1));
        var f = l[u];
        if (f !== null)
          for (l[u] = null, u = 0; u < f.length; u++) {
            var p = f[u];
            p !== null && (p.lane &= -536870913);
          }
        n &= ~d;
      }
      (r !== 0 && ct(e, r, 0),
        a !== 0 &&
          i === 0 &&
          e.tag !== 0 &&
          (e.suspendedLanes |= a & ~(o & ~t)));
    }
    function ct(e, t, n) {
      ((e.pendingLanes |= t), (e.suspendedLanes &= ~t));
      var r = 31 - Ke(t);
      ((e.entangledLanes |= t),
        (e.entanglements[r] = e.entanglements[r] | 1073741824 | (n & 261930)));
    }
    function lt(e, t) {
      var n = (e.entangledLanes |= t);
      for (e = e.entanglements; n;) {
        var r = 31 - Ke(n),
          i = 1 << r;
        ((i & t) | (e[r] & t) && (e[r] |= t), (n &= ~i));
      }
    }
    function ut(e, t) {
      var n = t & -t;
      return (
        (n = n & 42 ? 1 : dt(n)),
        (n & (e.suspendedLanes | t)) === 0 ? n : 0
      );
    }
    function dt(e) {
      switch (e) {
        case 2:
          e = 1;
          break;
        case 8:
          e = 4;
          break;
        case 32:
          e = 16;
          break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          e = 128;
          break;
        case 268435456:
          e = 134217728;
          break;
        default:
          e = 0;
      }
      return e;
    }
    function ft(e) {
      return (
        (e &= -e),
        2 < e ? (8 < e ? (e & 134217727 ? 32 : 268435456) : 8) : 2
      );
    }
    function pt() {
      var e = V.p;
      return e === 0 ? ((e = window.event), e === void 0 ? 32 : Ch(e.type)) : e;
    }
    function mt(e, t) {
      var n = V.p;
      try {
        return ((V.p = e), t());
      } finally {
        V.p = n;
      }
    }
    var ht = Math.random().toString(36).slice(2),
      gt = `__reactFiber$` + ht,
      _t = `__reactProps$` + ht,
      vt = `__reactContainer$` + ht,
      yt = `__reactEvents$` + ht,
      bt = `__reactListeners$` + ht,
      xt = `__reactHandles$` + ht,
      St = `__reactResources$` + ht,
      Ct = `__reactMarker$` + ht,
      wt = `__reactLoad$` + ht;
    function Tt(e) {
      (delete e[gt], delete e[_t], delete e[bt], delete e[xt]);
    }
    function Et(e) {
      var t;
      if ((t = e[gt])) return t;
      for (var n = e.parentNode; n;) {
        if ((t = n[vt] || n[gt])) {
          if (
            ((n = t.alternate),
            t.child !== null || (n !== null && n.child !== null))
          )
            for (e = fm(e); e !== null;) {
              if ((n = e[gt])) return n;
              e = fm(e);
            }
          return t;
        }
        ((e = n), (n = e.parentNode));
      }
      return null;
    }
    function Dt(e) {
      if ((e = e[gt] || e[vt])) {
        var t = e.tag;
        if (
          t === 5 ||
          t === 6 ||
          t === 13 ||
          t === 31 ||
          t === 26 ||
          t === 27 ||
          t === 3
        )
          return e;
      }
      return null;
    }
    function Ot(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
      throw Error(s(33));
    }
    function kt(e) {
      var t = e[St];
      return (
        (t ||= e[St] =
          { hoistableStyles: new Map(), hoistableScripts: new Map() }),
        t
      );
    }
    function At(e) {
      e[Ct] = !0;
    }
    function jt(e) {
      e[wt] = void 0;
    }
    var Mt = new Set(),
      Nt = {};
    function Pt(e, t) {
      (Ft(e, t), Ft(e + `Capture`, t));
    }
    function Ft(e, t) {
      for (Nt[e] = t, e = 0; e < t.length; e++) Mt.add(t[e]);
    }
    var It = RegExp(
        `^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`,
      ),
      Lt = {},
      Rt = {};
    function zt(e) {
      return ke.call(Rt, e)
        ? !0
        : ke.call(Lt, e)
          ? !1
          : It.test(e)
            ? (Rt[e] = !0)
            : ((Lt[e] = !0), !1);
    }
    var Bt = !1;
    function Vt() {
      var e = Bt;
      return ((Bt = !1), e);
    }
    function Ht(e, t, n) {
      if (zt(t)) {
        if (n === null) e.removeAttribute(t);
        else {
          switch (typeof n) {
            case `undefined`:
            case `function`:
            case `symbol`:
              e.removeAttribute(t);
              return;
            case `boolean`:
              var r = t.toLowerCase().slice(0, 5);
              if (r !== `data-` && r !== `aria-`) {
                e.removeAttribute(t);
                return;
              }
          }
          e.setAttribute(t, n);
        }
      }
    }
    function Ut(e, t, n) {
      if (n === null) e.removeAttribute(t);
      else {
        switch (typeof n) {
          case `undefined`:
          case `function`:
          case `symbol`:
          case `boolean`:
            e.removeAttribute(t);
            return;
        }
        e.setAttribute(t, n);
      }
    }
    function Wt(e, t, n, r) {
      if (r === null) e.removeAttribute(n);
      else {
        switch (typeof r) {
          case `undefined`:
          case `function`:
          case `symbol`:
          case `boolean`:
            e.removeAttribute(n);
            return;
        }
        e.setAttributeNS(t, n, r);
      }
    }
    function Gt(e) {
      switch (typeof e) {
        case `bigint`:
        case `boolean`:
        case `number`:
        case `string`:
        case `undefined`:
          return e;
        case `object`:
          return e;
        default:
          return ``;
      }
    }
    function Kt(e) {
      var t = e.type;
      return (
        (e = e.nodeName) &&
        e.toLowerCase() === `input` &&
        (t === `checkbox` || t === `radio`)
      );
    }
    function qt(e, t, n) {
      var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      if (
        !e.hasOwnProperty(t) &&
        r !== void 0 &&
        typeof r.get == `function` &&
        typeof r.set == `function`
      ) {
        var i = r.get,
          a = r.set;
        return (
          Object.defineProperty(e, t, {
            configurable: !0,
            get: function () {
              return i.call(this);
            },
            set: function (e) {
              ((n = `` + e), a.call(this, e));
            },
          }),
          Object.defineProperty(e, t, { enumerable: r.enumerable }),
          {
            getValue: function () {
              return n;
            },
            setValue: function (e) {
              n = `` + e;
            },
            stopTracking: function () {
              ((e._valueTracker = null), delete e[t]);
            },
          }
        );
      }
    }
    function Jt(e) {
      if (!e._valueTracker) {
        var t = Kt(e) ? `checked` : `value`;
        e._valueTracker = qt(e, t, `` + e[t]);
      }
    }
    function Yt(e) {
      if (!e) return !1;
      var t = e._valueTracker;
      if (!t) return !0;
      var n = t.getValue(),
        r = ``;
      return (
        e && (r = Kt(e) ? (e.checked ? `true` : `false`) : e.value),
        (e = r),
        e !== n && (t.setValue(e), !0)
      );
    }
    var Xt = /[\n"\\]/g;
    function Zt(e) {
      return e.replace(Xt, function (e) {
        return `\\` + e.charCodeAt(0).toString(16) + ` `;
      });
    }
    function Qt(e, t, n, r, i, a, o, s) {
      ((e.name = ``),
        o != null &&
        typeof o != `function` &&
        typeof o != `symbol` &&
        typeof o != `boolean`
          ? (e.type = o)
          : e.removeAttribute(`type`),
        t == null
          ? (o !== `submit` && o !== `reset`) || e.removeAttribute(`value`)
          : o === `number`
            ? ((t === 0 && e.value === ``) || e.value != t) &&
              (e.value = `` + Gt(t))
            : e.value !== `` + Gt(t) && (e.value = `` + Gt(t)),
        t == null
          ? n == null
            ? r != null && e.removeAttribute(`value`)
            : en(e, Gt(n))
          : o === `number` && e.value == t
            ? en(e, Gt(e.value))
            : en(e, Gt(t)),
        i == null && a != null && (e.defaultChecked = !!a),
        i != null &&
          (e.checked = i && typeof i != `function` && typeof i != `symbol`),
        s != null &&
        typeof s != `function` &&
        typeof s != `symbol` &&
        typeof s != `boolean`
          ? (e.name = `` + Gt(s))
          : e.removeAttribute(`name`));
    }
    function $t(e, t, n, r, i, a, o, s) {
      if (
        (a != null &&
          typeof a != `function` &&
          typeof a != `symbol` &&
          typeof a != `boolean` &&
          (e.type = a),
        t != null || n != null)
      ) {
        if (!((a !== `submit` && a !== `reset`) || t != null)) {
          Jt(e);
          return;
        }
        ((n = n == null ? `` : `` + Gt(n)),
          (t = t == null ? n : `` + Gt(t)),
          s || t === e.value || (e.value = t),
          (e.defaultValue = t));
      }
      ((r ??= i),
        (r = typeof r != `function` && typeof r != `symbol` && !!r),
        (e.checked = s ? e.checked : !!r),
        (e.defaultChecked = !!r),
        o != null &&
          typeof o != `function` &&
          typeof o != `symbol` &&
          typeof o != `boolean` &&
          (e.name = o),
        Jt(e));
    }
    function en(e, t) {
      e.defaultValue !== `` + t && (e.defaultValue = `` + t);
    }
    function tn(e, t, n, r) {
      if (((e = e.options), t)) {
        t = {};
        for (var i = 0; i < n.length; i++) t[`$` + n[i]] = !0;
        for (n = 0; n < e.length; n++)
          ((i = t.hasOwnProperty(`$` + e[n].value)),
            e[n].selected !== i && (e[n].selected = i),
            i && r && (e[n].defaultSelected = !0));
      } else {
        for (n = `` + Gt(n), t = null, i = 0; i < e.length; i++) {
          if (e[i].value === n) {
            ((e[i].selected = !0), r && (e[i].defaultSelected = !0));
            return;
          }
          t !== null || e[i].disabled || (t = e[i]);
        }
        t !== null && (t.selected = !0);
      }
    }
    function nn(e, t, n) {
      t != null && ((t = `` + Gt(t)), t !== e.value && (e.value = t), n == null)
        ? e.defaultValue !== t && (e.defaultValue = t)
        : (e.defaultValue = n == null ? `` : `` + Gt(n));
    }
    function rn(e, t, n, r) {
      if (t == null) {
        if (r != null) {
          if (n != null) throw Error(s(92));
          if (z(r)) {
            if (1 < r.length) throw Error(s(93));
            r = r[0];
          }
          n = r;
        }
        ((n ??= ``), (t = n));
      }
      ((n = Gt(t)),
        (e.defaultValue = n),
        (r = e.textContent),
        r === n && r !== `` && r !== null && (e.value = r),
        Jt(e));
    }
    function an(e, t) {
      if (t) {
        var n = e.firstChild;
        if (n && n === e.lastChild && n.nodeType === 3) {
          n.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }
    var on = new Set(
      `animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(
        ` `,
      ),
    );
    function sn(e, t, n) {
      var r = t.indexOf(`--`) === 0;
      n == null || typeof n == `boolean` || n === ``
        ? r
          ? e.setProperty(t, ``)
          : t === `float`
            ? (e.cssFloat = ``)
            : (e[t] = ``)
        : r
          ? e.setProperty(t, n)
          : typeof n != `number` || n === 0 || on.has(t)
            ? t === `float`
              ? (e.cssFloat = n)
              : (e[t] = (`` + n).trim())
            : (e[t] = n + `px`);
    }
    function cn(e, t, n) {
      if (t != null && typeof t != `object`) throw Error(s(62));
      if (((e = e.style), n != null)) {
        for (var r in n)
          !n.hasOwnProperty(r) ||
            (t != null && t.hasOwnProperty(r)) ||
            (r.indexOf(`--`) === 0
              ? e.setProperty(r, ``)
              : r === `float`
                ? (e.cssFloat = ``)
                : (e[r] = ``),
            (Bt = !0));
        for (var i in t)
          ((r = t[i]),
            t.hasOwnProperty(i) && n[i] !== r && (sn(e, i, r), (Bt = !0)));
      } else for (var a in t) t.hasOwnProperty(a) && sn(e, a, t[a]);
    }
    function ln(e) {
      if (e.indexOf(`-`) === -1) return !1;
      switch (e) {
        case `annotation-xml`:
        case `color-profile`:
        case `font-face`:
        case `font-face-src`:
        case `font-face-uri`:
        case `font-face-format`:
        case `font-face-name`:
        case `missing-glyph`:
          return !1;
        default:
          return !0;
      }
    }
    var un = new Map([
        [`acceptCharset`, `accept-charset`],
        [`htmlFor`, `for`],
        [`httpEquiv`, `http-equiv`],
        [`crossOrigin`, `crossorigin`],
        [`accentHeight`, `accent-height`],
        [`alignmentBaseline`, `alignment-baseline`],
        [`arabicForm`, `arabic-form`],
        [`baselineShift`, `baseline-shift`],
        [`capHeight`, `cap-height`],
        [`clipPath`, `clip-path`],
        [`clipRule`, `clip-rule`],
        [`colorInterpolation`, `color-interpolation`],
        [`colorInterpolationFilters`, `color-interpolation-filters`],
        [`colorProfile`, `color-profile`],
        [`colorRendering`, `color-rendering`],
        [`dominantBaseline`, `dominant-baseline`],
        [`enableBackground`, `enable-background`],
        [`fillOpacity`, `fill-opacity`],
        [`fillRule`, `fill-rule`],
        [`floodColor`, `flood-color`],
        [`floodOpacity`, `flood-opacity`],
        [`fontFamily`, `font-family`],
        [`fontSize`, `font-size`],
        [`fontSizeAdjust`, `font-size-adjust`],
        [`fontStretch`, `font-stretch`],
        [`fontStyle`, `font-style`],
        [`fontVariant`, `font-variant`],
        [`fontWeight`, `font-weight`],
        [`glyphName`, `glyph-name`],
        [`glyphOrientationHorizontal`, `glyph-orientation-horizontal`],
        [`glyphOrientationVertical`, `glyph-orientation-vertical`],
        [`horizAdvX`, `horiz-adv-x`],
        [`horizOriginX`, `horiz-origin-x`],
        [`imageRendering`, `image-rendering`],
        [`letterSpacing`, `letter-spacing`],
        [`lightingColor`, `lighting-color`],
        [`markerEnd`, `marker-end`],
        [`markerMid`, `marker-mid`],
        [`markerStart`, `marker-start`],
        [`maskType`, `mask-type`],
        [`overlinePosition`, `overline-position`],
        [`overlineThickness`, `overline-thickness`],
        [`paintOrder`, `paint-order`],
        [`panose-1`, `panose-1`],
        [`pointerEvents`, `pointer-events`],
        [`renderingIntent`, `rendering-intent`],
        [`shapeRendering`, `shape-rendering`],
        [`stopColor`, `stop-color`],
        [`stopOpacity`, `stop-opacity`],
        [`strikethroughPosition`, `strikethrough-position`],
        [`strikethroughThickness`, `strikethrough-thickness`],
        [`strokeDasharray`, `stroke-dasharray`],
        [`strokeDashoffset`, `stroke-dashoffset`],
        [`strokeLinecap`, `stroke-linecap`],
        [`strokeLinejoin`, `stroke-linejoin`],
        [`strokeMiterlimit`, `stroke-miterlimit`],
        [`strokeOpacity`, `stroke-opacity`],
        [`strokeWidth`, `stroke-width`],
        [`textAnchor`, `text-anchor`],
        [`textDecoration`, `text-decoration`],
        [`textRendering`, `text-rendering`],
        [`transformOrigin`, `transform-origin`],
        [`underlinePosition`, `underline-position`],
        [`underlineThickness`, `underline-thickness`],
        [`unicodeBidi`, `unicode-bidi`],
        [`unicodeRange`, `unicode-range`],
        [`unitsPerEm`, `units-per-em`],
        [`vAlphabetic`, `v-alphabetic`],
        [`vHanging`, `v-hanging`],
        [`vIdeographic`, `v-ideographic`],
        [`vMathematical`, `v-mathematical`],
        [`vectorEffect`, `vector-effect`],
        [`vertAdvY`, `vert-adv-y`],
        [`vertOriginX`, `vert-origin-x`],
        [`vertOriginY`, `vert-origin-y`],
        [`wordSpacing`, `word-spacing`],
        [`writingMode`, `writing-mode`],
        [`xmlnsXlink`, `xmlns:xlink`],
        [`xHeight`, `x-height`],
      ]),
      dn =
        /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function fn(e) {
      return dn.test(`` + e)
        ? `javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`
        : e;
    }
    function pn() {}
    var mn = null;
    function hn(e) {
      return (
        (e = e.target || e.srcElement || window),
        e.correspondingUseElement && (e = e.correspondingUseElement),
        e.nodeType === 3 ? e.parentNode : e
      );
    }
    var gn = null,
      G = null;
    function _n(e) {
      var t = Dt(e);
      if (t && (e = t.stateNode)) {
        var n = e[_t] || null;
        a: switch (((e = t.stateNode), t.type)) {
          case `input`:
            if (
              (Qt(
                e,
                n.value,
                n.defaultValue,
                n.defaultValue,
                n.checked,
                n.defaultChecked,
                n.type,
                n.name,
              ),
              (t = n.name),
              n.type === `radio` && t != null)
            ) {
              for (n = e; n.parentNode;) n = n.parentNode;
              for (
                n = n.querySelectorAll(
                  `input[name="` + Zt(`` + t) + `"][type="radio"]`,
                ),
                  t = 0;
                t < n.length;
                t++
              ) {
                var r = n[t];
                if (r !== e && r.form === e.form) {
                  var i = r[_t] || null;
                  if (!i) throw Error(s(90));
                  Qt(
                    r,
                    i.value,
                    i.defaultValue,
                    i.defaultValue,
                    i.checked,
                    i.defaultChecked,
                    i.type,
                    i.name,
                  );
                }
              }
              for (t = 0; t < n.length; t++)
                ((r = n[t]), r.form === e.form && Yt(r));
            }
            break a;
          case `textarea`:
            nn(e, n.value, n.defaultValue);
            break a;
          case `select`:
            ((t = n.value), t != null && tn(e, !!n.multiple, t, !1));
        }
      }
    }
    var vn = !1;
    function yn(e, t, n) {
      if (vn) return e(t, n);
      vn = !0;
      try {
        return e(t);
      } finally {
        if (
          ((vn = !1),
          (gn !== null || G !== null) &&
            (Id(), gn && ((t = gn), (e = G), (G = gn = null), _n(t), e)))
        )
          for (t = 0; t < e.length; t++) _n(e[t]);
      }
    }
    function bn(e, t) {
      var n = e.stateNode;
      if (n === null) return null;
      var r = n[_t] || null;
      if (r === null) return null;
      n = r[t];
      a: switch (t) {
        case `onClick`:
        case `onClickCapture`:
        case `onDoubleClick`:
        case `onDoubleClickCapture`:
        case `onMouseDown`:
        case `onMouseDownCapture`:
        case `onMouseMove`:
        case `onMouseMoveCapture`:
        case `onMouseUp`:
        case `onMouseUpCapture`:
        case `onMouseEnter`:
          ((r = !r.disabled) ||
            ((e = e.type),
            (r =
              e !== `button` &&
              e !== `input` &&
              e !== `select` &&
              e !== `textarea`)),
            (e = !r));
          break a;
        default:
          e = !1;
      }
      if (e) return null;
      if (n && typeof n != `function`) throw Error(s(231, t, typeof n));
      return n;
    }
    var xn =
        typeof window < `u` &&
        window.document !== void 0 &&
        window.document.createElement !== void 0,
      Sn = !1;
    if (xn)
      try {
        var Cn = {};
        (Object.defineProperty(Cn, "passive", {
          get: function () {
            Sn = !0;
          },
        }),
          window.addEventListener(`test`, Cn, Cn),
          window.removeEventListener(`test`, Cn, Cn));
      } catch {
        Sn = !1;
      }
    var wn = null,
      Tn = null,
      En = null;
    function Dn() {
      if (En) return En;
      var e,
        t = Tn,
        n = t.length,
        r,
        i = `value` in wn ? wn.value : wn.textContent,
        a = i.length;
      for (e = 0; e < n && t[e] === i[e]; e++);
      var o = n - e;
      for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
      return (En = i.slice(e, 1 < r ? 1 - r : void 0));
    }
    function On(e) {
      var t = e.keyCode;
      return (
        `charCode` in e
          ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
          : (e = t),
        e === 10 && (e = 13),
        32 <= e || e === 13 ? e : 0
      );
    }
    function kn() {
      return !0;
    }
    function An() {
      return !1;
    }
    function jn(e) {
      function t(t, n, r, i, a) {
        for (var o in ((this._reactName = t),
        (this._targetInst = r),
        (this.type = n),
        (this.nativeEvent = i),
        (this.target = a),
        (this.currentTarget = null),
        e))
          e.hasOwnProperty(o) && ((t = e[o]), (this[o] = t ? t(i) : i[o]));
        return (
          (this.isDefaultPrevented = (
            i.defaultPrevented == null
              ? !1 === i.returnValue
              : i.defaultPrevented
          )
            ? kn
            : An),
          (this.isPropagationStopped = An),
          this
        );
      }
      return (
        D(t.prototype, {
          preventDefault: function () {
            this.defaultPrevented = !0;
            var e = this.nativeEvent;
            e &&
              (e.preventDefault
                ? e.preventDefault()
                : typeof e.returnValue != `unknown` && (e.returnValue = !1),
              (this.isDefaultPrevented = kn));
          },
          stopPropagation: function () {
            var e = this.nativeEvent;
            e &&
              (e.stopPropagation
                ? e.stopPropagation()
                : typeof e.cancelBubble != `unknown` && (e.cancelBubble = !0),
              (this.isPropagationStopped = kn));
          },
          persist: function () {},
          isPersistent: kn,
        }),
        t
      );
    }
    var Mn = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function (e) {
          return e.timeStamp || Date.now();
        },
        defaultPrevented: 0,
        isTrusted: 0,
      },
      Nn = jn(Mn),
      Pn = D({}, Mn, { view: 0, detail: 0 }),
      Fn = jn(Pn),
      In,
      Ln,
      Rn,
      zn = D({}, Pn, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: Xn,
        button: 0,
        buttons: 0,
        relatedTarget: function (e) {
          return e.relatedTarget === void 0
            ? e.fromElement === e.srcElement
              ? e.toElement
              : e.fromElement
            : e.relatedTarget;
        },
        movementX: function (e) {
          return `movementX` in e
            ? e.movementX
            : (e !== Rn &&
                (Rn && e.type === `mousemove`
                  ? ((In = e.screenX - Rn.screenX),
                    (Ln = e.screenY - Rn.screenY))
                  : (Ln = In = 0),
                (Rn = e)),
              In);
        },
        movementY: function (e) {
          return `movementY` in e ? e.movementY : Ln;
        },
      }),
      Bn = jn(zn),
      Vn = jn(D({}, zn, { dataTransfer: 0 })),
      Hn = jn(D({}, Pn, { relatedTarget: 0 })),
      Un = jn(
        D({}, Mn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
      ),
      Wn = jn(
        D({}, Mn, {
          clipboardData: function (e) {
            return `clipboardData` in e
              ? e.clipboardData
              : window.clipboardData;
          },
        }),
      ),
      Gn = jn(D({}, Mn, { data: 0 })),
      Kn = {
        Esc: `Escape`,
        Spacebar: ` `,
        Left: `ArrowLeft`,
        Up: `ArrowUp`,
        Right: `ArrowRight`,
        Down: `ArrowDown`,
        Del: `Delete`,
        Win: `OS`,
        Menu: `ContextMenu`,
        Apps: `ContextMenu`,
        Scroll: `ScrollLock`,
        MozPrintableKey: `Unidentified`,
      },
      qn = {
        8: `Backspace`,
        9: `Tab`,
        12: `Clear`,
        13: `Enter`,
        16: `Shift`,
        17: `Control`,
        18: `Alt`,
        19: `Pause`,
        20: `CapsLock`,
        27: `Escape`,
        32: ` `,
        33: `PageUp`,
        34: `PageDown`,
        35: `End`,
        36: `Home`,
        37: `ArrowLeft`,
        38: `ArrowUp`,
        39: `ArrowRight`,
        40: `ArrowDown`,
        45: `Insert`,
        46: `Delete`,
        112: `F1`,
        113: `F2`,
        114: `F3`,
        115: `F4`,
        116: `F5`,
        117: `F6`,
        118: `F7`,
        119: `F8`,
        120: `F9`,
        121: `F10`,
        122: `F11`,
        123: `F12`,
        144: `NumLock`,
        145: `ScrollLock`,
        224: `Meta`,
      },
      Jn = {
        Alt: `altKey`,
        Control: `ctrlKey`,
        Meta: `metaKey`,
        Shift: `shiftKey`,
      };
    function Yn(e) {
      var t = this.nativeEvent;
      return t.getModifierState
        ? t.getModifierState(e)
        : (e = Jn[e])
          ? !!t[e]
          : !1;
    }
    function Xn() {
      return Yn;
    }
    var Zn = jn(
        D({}, Pn, {
          key: function (e) {
            if (e.key) {
              var t = Kn[e.key] || e.key;
              if (t !== `Unidentified`) return t;
            }
            return e.type === `keypress`
              ? ((e = On(e)), e === 13 ? `Enter` : String.fromCharCode(e))
              : e.type === `keydown` || e.type === `keyup`
                ? qn[e.keyCode] || `Unidentified`
                : ``;
          },
          code: 0,
          location: 0,
          ctrlKey: 0,
          shiftKey: 0,
          altKey: 0,
          metaKey: 0,
          repeat: 0,
          locale: 0,
          getModifierState: Xn,
          charCode: function (e) {
            return e.type === `keypress` ? On(e) : 0;
          },
          keyCode: function (e) {
            return e.type === `keydown` || e.type === `keyup` ? e.keyCode : 0;
          },
          which: function (e) {
            return e.type === `keypress`
              ? On(e)
              : e.type === `keydown` || e.type === `keyup`
                ? e.keyCode
                : 0;
          },
        }),
      ),
      Qn = jn(
        D({}, zn, {
          pointerId: 0,
          width: 0,
          height: 0,
          pressure: 0,
          tangentialPressure: 0,
          tiltX: 0,
          tiltY: 0,
          twist: 0,
          pointerType: 0,
          isPrimary: 0,
        }),
      ),
      $n = jn(D({}, Mn, { submitter: 0 })),
      er = jn(
        D({}, Pn, {
          touches: 0,
          targetTouches: 0,
          changedTouches: 0,
          altKey: 0,
          metaKey: 0,
          ctrlKey: 0,
          shiftKey: 0,
          getModifierState: Xn,
        }),
      ),
      tr = jn(D({}, Mn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 })),
      nr = jn(
        D({}, zn, {
          deltaX: function (e) {
            return `deltaX` in e
              ? e.deltaX
              : `wheelDeltaX` in e
                ? -e.wheelDeltaX
                : 0;
          },
          deltaY: function (e) {
            return `deltaY` in e
              ? e.deltaY
              : `wheelDeltaY` in e
                ? -e.wheelDeltaY
                : `wheelDelta` in e
                  ? -e.wheelDelta
                  : 0;
          },
          deltaZ: 0,
          deltaMode: 0,
        }),
      ),
      rr = jn(D({}, Mn, { newState: 0, oldState: 0, source: 0 })),
      ir = [9, 13, 27, 32],
      ar = xn && `CompositionEvent` in window,
      or = null;
    xn && `documentMode` in document && (or = document.documentMode);
    var sr = xn && `TextEvent` in window && !or,
      cr = xn && (!ar || (or && 8 < or && 11 >= or)),
      lr = ` `,
      ur = !1;
    function dr(e, t) {
      switch (e) {
        case `keyup`:
          return ir.indexOf(t.keyCode) !== -1;
        case `keydown`:
          return t.keyCode !== 229;
        case `keypress`:
        case `mousedown`:
        case `focusout`:
          return !0;
        default:
          return !1;
      }
    }
    function fr(e) {
      return (
        (e = e.detail),
        typeof e == `object` && `data` in e ? e.data : null
      );
    }
    var pr = !1;
    function mr(e, t) {
      switch (e) {
        case `compositionend`:
          return fr(t);
        case `keypress`:
          return t.which === 32 ? ((ur = !0), lr) : null;
        case `textInput`:
          return ((e = t.data), e === lr && ur ? null : e);
        default:
          return null;
      }
    }
    function hr(e, t) {
      if (pr)
        return e === `compositionend` || (!ar && dr(e, t))
          ? ((e = Dn()), (En = Tn = wn = null), (pr = !1), e)
          : null;
      switch (e) {
        case `paste`:
          return null;
        case `keypress`:
          if (
            !(t.ctrlKey || t.altKey || t.metaKey) ||
            (t.ctrlKey && t.altKey)
          ) {
            if (t.char && 1 < t.char.length) return t.char;
            if (t.which) return String.fromCharCode(t.which);
          }
          return null;
        case `compositionend`:
          return cr && t.locale !== `ko` ? null : t.data;
        default:
          return null;
      }
    }
    var gr = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0,
    };
    function _r(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === `input` ? !!gr[e.type] : t === `textarea`;
    }
    function vr(e, t, n, r) {
      (gn ? (G ? G.push(r) : (G = [r])) : (gn = r),
        (t = qf(t, `onChange`)),
        0 < t.length &&
          ((n = new Nn(`onChange`, `change`, null, n, r)),
          e.push({ event: n, listeners: t })));
    }
    var yr = null,
      br = null;
    function xr(e) {
      zf(e, 0);
    }
    function Sr(e) {
      if (Yt(Ot(e))) return e;
    }
    function Cr(e, t) {
      if (e === `change`) return t;
    }
    var wr = !1;
    if (xn) {
      var Tr;
      if (xn) {
        var Er = `oninput` in document;
        if (!Er) {
          var Dr = document.createElement(`div`);
          (Dr.setAttribute(`oninput`, `return;`),
            (Er = typeof Dr.oninput == `function`));
        }
        Tr = Er;
      } else Tr = !1;
      wr = Tr && (!document.documentMode || 9 < document.documentMode);
    }
    function Or() {
      yr && (yr.detachEvent(`onpropertychange`, kr), (br = yr = null));
    }
    function kr(e) {
      if (e.propertyName === `value` && Sr(br)) {
        var t = [];
        (vr(t, br, e, hn(e)), yn(xr, t));
      }
    }
    function Ar(e, t, n) {
      e === `focusin`
        ? (Or(), (yr = t), (br = n), yr.attachEvent(`onpropertychange`, kr))
        : e === `focusout` && Or();
    }
    function jr(e) {
      if (e === `selectionchange` || e === `keyup` || e === `keydown`)
        return Sr(br);
    }
    function Mr(e, t) {
      if (e === `click`) return Sr(t);
    }
    function Nr(e, t) {
      if (e === `input` || e === `change`) return Sr(t);
    }
    function Pr(e, t) {
      return (e === t && (e !== 0 || 1 / e == 1 / t)) || (e !== e && t !== t);
    }
    var Fr = typeof Object.is == `function` ? Object.is : Pr;
    function Ir(e, t) {
      if (Fr(e, t)) return !0;
      if (typeof e != `object` || !e || typeof t != `object` || !t) return !1;
      var n = Object.keys(e),
        r = Object.keys(t);
      if (n.length !== r.length) return !1;
      for (r = 0; r < n.length; r++) {
        var i = n[r];
        if (!ke.call(t, i) || !Fr(e[i], t[i])) return !1;
      }
      return !0;
    }
    function Lr(e) {
      if (((e ||= typeof document < `u` ? document : void 0), e === void 0))
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    function Rr(e) {
      for (; e && e.firstChild;) e = e.firstChild;
      return e;
    }
    function zr(e, t) {
      var n = Rr(e);
      e = 0;
      for (var r; n;) {
        if (n.nodeType === 3) {
          if (((r = e + n.textContent.length), e <= t && r >= t))
            return { node: n, offset: t - e };
          e = r;
        }
        a: {
          for (; n;) {
            if (n.nextSibling) {
              n = n.nextSibling;
              break a;
            }
            n = n.parentNode;
          }
          n = void 0;
        }
        n = Rr(n);
      }
    }
    function Br(e, t) {
      return e && t
        ? e === t
          ? !0
          : e && e.nodeType === 3
            ? !1
            : t && t.nodeType === 3
              ? Br(e, t.parentNode)
              : `contains` in e
                ? e.contains(t)
                : e.compareDocumentPosition
                  ? !!(e.compareDocumentPosition(t) & 16)
                  : !1
        : !1;
    }
    function Vr(e) {
      e =
        e != null &&
        e.ownerDocument != null &&
        e.ownerDocument.defaultView != null
          ? e.ownerDocument.defaultView
          : window;
      for (var t = Lr(e.document); t instanceof e.HTMLIFrameElement;) {
        try {
          var n = typeof t.contentWindow.location.href == `string`;
        } catch {
          n = !1;
        }
        if (n) e = t.contentWindow;
        else break;
        t = Lr(e.document);
      }
      return t;
    }
    function Hr(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return (
        t &&
        ((t === `input` &&
          (e.type === `text` ||
            e.type === `search` ||
            e.type === `tel` ||
            e.type === `url` ||
            e.type === `password`)) ||
          t === `textarea` ||
          e.contentEditable === `true`)
      );
    }
    var Ur = xn && `documentMode` in document && 11 >= document.documentMode,
      Wr = null,
      Gr = null,
      Kr = null,
      qr = !1;
    function Jr(e, t, n) {
      var r =
        n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
      qr ||
        Wr == null ||
        Wr !== Lr(r) ||
        ((r = Wr),
        `selectionStart` in r && Hr(r)
          ? (r = { start: r.selectionStart, end: r.selectionEnd })
          : ((r = (
              (r.ownerDocument && r.ownerDocument.defaultView) ||
              window
            ).getSelection()),
            (r = {
              anchorNode: r.anchorNode,
              anchorOffset: r.anchorOffset,
              focusNode: r.focusNode,
              focusOffset: r.focusOffset,
            })),
        (Kr && Ir(Kr, r)) ||
          ((Kr = r),
          (r = qf(Gr, `onSelect`)),
          0 < r.length &&
            ((t = new Nn(`onSelect`, `select`, null, t, n)),
            e.push({ event: t, listeners: r }),
            (t.target = Wr))));
    }
    function Yr(e, t) {
      var n = {};
      return (
        (n[e.toLowerCase()] = t.toLowerCase()),
        (n[`Webkit` + e] = `webkit` + t),
        (n[`Moz` + e] = `moz` + t),
        n
      );
    }
    var Xr = {
        animationend: Yr(`Animation`, `AnimationEnd`),
        animationiteration: Yr(`Animation`, `AnimationIteration`),
        animationstart: Yr(`Animation`, `AnimationStart`),
        transitionrun: Yr(`Transition`, `TransitionRun`),
        transitionstart: Yr(`Transition`, `TransitionStart`),
        transitioncancel: Yr(`Transition`, `TransitionCancel`),
        transitionend: Yr(`Transition`, `TransitionEnd`),
      },
      Zr = {},
      Qr = {};
    xn &&
      ((Qr = document.createElement(`div`).style),
      `AnimationEvent` in window ||
        (delete Xr.animationend.animation,
        delete Xr.animationiteration.animation,
        delete Xr.animationstart.animation),
      `TransitionEvent` in window || delete Xr.transitionend.transition);
    function $r(e) {
      if (Zr[e]) return Zr[e];
      if (!Xr[e]) return e;
      var t = Xr[e],
        n;
      for (n in t) if (t.hasOwnProperty(n) && n in Qr) return (Zr[e] = t[n]);
      return e;
    }
    var ei = $r(`animationend`),
      ti = $r(`animationiteration`),
      ni = $r(`animationstart`),
      ri = $r(`transitionrun`),
      ii = $r(`transitionstart`),
      ai = $r(`transitioncancel`),
      oi = $r(`transitionend`),
      si = new Map(),
      ci =
        `abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(
          ` `,
        );
    ci.push(`scrollEnd`);
    function li(e, t) {
      (si.set(e, t), Pt(t, [e]));
    }
    var ui = 0;
    function di(e, t) {
      if (e.name != null && e.name !== `auto`) return e.name;
      if (t.autoName !== null) return t.autoName;
      e = _d.identifierPrefix;
      var n = ui++;
      return ((e = `_` + e + `t_` + n.toString(32) + `_`), (t.autoName = e));
    }
    function fi(e) {
      if (e == null || typeof e == `string`) return e;
      var t = null,
        n = Td;
      if (n !== null)
        for (var r = 0; r < n.length; r++) {
          var i = e[n[r]];
          if (i != null) {
            if (i === `none`) return `none`;
            t = t == null ? i : t + (` ` + i);
          }
        }
      return t ?? e.default;
    }
    function pi(e, t) {
      return (
        (e = fi(e)),
        (t = fi(t)),
        t == null ? (e === `auto` ? null : e) : t === `auto` ? null : t
      );
    }
    var mi =
        typeof reportError == `function`
          ? reportError
          : function (e) {
              if (
                typeof window == `object` &&
                typeof window.ErrorEvent == `function`
              ) {
                var t = new window.ErrorEvent(`error`, {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    typeof e == `object` && e && typeof e.message == `string`
                      ? String(e.message)
                      : String(e),
                  error: e,
                });
                if (!window.dispatchEvent(t)) return;
              } else if (
                typeof process == `object` &&
                typeof process.emit == `function`
              ) {
                process.emit(`uncaughtException`, e);
                return;
              }
              console.error(e);
            },
      hi = [],
      gi = 0,
      _i = 0;
    function vi() {
      for (var e = gi, t = (_i = gi = 0); t < e;) {
        var n = hi[t];
        hi[t++] = null;
        var r = hi[t];
        hi[t++] = null;
        var i = hi[t];
        hi[t++] = null;
        var a = hi[t];
        if (((hi[t++] = null), r !== null && i !== null)) {
          var o = r.pending;
          (o === null ? (i.next = i) : ((i.next = o.next), (o.next = i)),
            (r.pending = i));
        }
        a !== 0 && Si(n, i, a);
      }
    }
    function yi(e, t, n, r) {
      ((hi[gi++] = e),
        (hi[gi++] = t),
        (hi[gi++] = n),
        (hi[gi++] = r),
        (_i |= r),
        (e.lanes |= r),
        (e = e.alternate),
        e !== null && (e.lanes |= r));
    }
    function bi(e, t, n, r) {
      return (yi(e, t, n, r), Ci(e));
    }
    function xi(e, t) {
      return (yi(e, null, null, t), Ci(e));
    }
    function Si(e, t, n) {
      e.lanes |= n;
      var r = e.alternate;
      r !== null && (r.lanes |= n);
      for (var i = !1, a = e.return; a !== null;)
        ((a.childLanes |= n),
          (r = a.alternate),
          r !== null && (r.childLanes |= n),
          a.tag === 22 &&
            ((e = a.stateNode), e === null || e._visibility & 1 || (i = !0)),
          (e = a),
          (a = a.return));
      return e.tag === 3
        ? ((a = e.stateNode),
          i &&
            t !== null &&
            ((i = 31 - Ke(n)),
            (e = a.hiddenUpdates),
            (r = e[i]),
            r === null ? (e[i] = [t]) : r.push(t),
            (t.lane = n | 536870912)),
          a)
        : null;
    }
    function Ci(e) {
      if (50 < Ed) throw ((Ed = 0), (Dd = null), Error(s(185)));
      for (var t = e.return; t !== null;) ((e = t), (t = e.return));
      return e.tag === 3 ? e.stateNode : null;
    }
    var wi = {};
    function Ti(e, t, n, r) {
      ((this.tag = e),
        (this.key = n),
        (this.sibling =
          this.child =
          this.return =
          this.stateNode =
          this.type =
          this.elementType =
            null),
        (this.index = 0),
        (this.refCleanup = this.ref = null),
        (this.pendingProps = t),
        (this.dependencies =
          this.memoizedState =
          this.updateQueue =
          this.memoizedProps =
            null),
        (this.mode = r),
        (this.subtreeFlags = this.flags = 0),
        (this.deletions = null),
        (this.childLanes = this.lanes = 0),
        (this.alternate = null));
    }
    function Ei(e, t, n, r) {
      return new Ti(e, t, n, r);
    }
    function Di(e) {
      return ((e = e.prototype), !(!e || !e.isReactComponent));
    }
    function Oi(e, t) {
      var n = e.alternate;
      return (
        n === null
          ? ((n = Ei(e.tag, t, e.key, e.mode)),
            (n.elementType = e.elementType),
            (n.type = e.type),
            (n.stateNode = e.stateNode),
            (n.alternate = e),
            (e.alternate = n))
          : ((n.pendingProps = t),
            (n.type = e.type),
            (n.flags = 0),
            (n.subtreeFlags = 0),
            (n.deletions = null)),
        (n.flags = e.flags & 1206910976),
        (n.childLanes = e.childLanes),
        (n.lanes = e.lanes),
        (n.child = e.child),
        (n.memoizedProps = e.memoizedProps),
        (n.memoizedState = e.memoizedState),
        (n.updateQueue = e.updateQueue),
        (t = e.dependencies),
        (n.dependencies =
          t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
        (n.sibling = e.sibling),
        (n.index = e.index),
        (n.ref = e.ref),
        (n.refCleanup = e.refCleanup),
        n
      );
    }
    function ki(e, t) {
      e.flags &= 1206910978;
      var n = e.alternate;
      return (
        n === null
          ? ((e.childLanes = 0),
            (e.lanes = t),
            (e.child = null),
            (e.subtreeFlags = 0),
            (e.memoizedProps = null),
            (e.memoizedState = null),
            (e.updateQueue = null),
            (e.dependencies = null),
            (e.stateNode = null))
          : ((e.childLanes = n.childLanes),
            (e.lanes = n.lanes),
            (e.child = n.child),
            (e.subtreeFlags = 0),
            (e.deletions = null),
            (e.memoizedProps = n.memoizedProps),
            (e.memoizedState = n.memoizedState),
            (e.updateQueue = n.updateQueue),
            (e.type = n.type),
            (t = n.dependencies),
            (e.dependencies =
              t === null
                ? null
                : { lanes: t.lanes, firstContext: t.firstContext })),
        e
      );
    }
    function Ai(e, t, n, r, i, a) {
      var o = 0;
      if (((r = e), typeof r == `function`)) Di(r) && (o = 1);
      else if (typeof r == `string`)
        o = qm(e, n, H.current)
          ? 26
          : e === `html` || e === `head` || e === `body`
            ? 27
            : 5;
      else
        a: switch (r) {
          case L:
            return (
              (e = Ei(31, n, t, i)),
              (e.elementType = L),
              (e.lanes = a),
              e
            );
          case j:
            return ji(n.children, i, a, t);
          case M:
            ((o = 8), (i |= 24));
            break;
          case N:
            return (
              (e = Ei(12, n, t, i | 2)),
              (e.elementType = N),
              (e.lanes = a),
              e
            );
          case te:
            return (
              (e = Ei(13, n, t, i)),
              (e.elementType = te),
              (e.lanes = a),
              e
            );
          case ne:
            return (
              (e = Ei(19, n, t, i)),
              (e.elementType = ne),
              (e.lanes = a),
              e
            );
          case ie:
          case oe:
            return (
              (e = i | 32),
              (e = Ei(30, n, t, e)),
              (e.elementType = oe),
              (e.lanes = a),
              (e.stateNode = {
                autoName: null,
                paired: null,
                clones: null,
                ref: null,
              }),
              e
            );
          default:
            if (typeof r == `object` && r)
              switch (r.$$typeof) {
                case F:
                  o = 10;
                  break a;
                case P:
                  o = 9;
                  break a;
                case ee:
                  o = 11;
                  break a;
                case re:
                  o = 14;
                  break a;
                case I:
                  ((o = 16), (r = null));
                  break a;
              }
            ((o = 29),
              (n = Error(s(130, e === null ? `null` : typeof e, ``))),
              (r = null));
        }
      return (
        (t = Ei(o, n, t, i)),
        (t.elementType = e),
        (t.type = r),
        (t.lanes = a),
        t
      );
    }
    function ji(e, t, n, r) {
      return ((e = Ei(7, e, r, t)), (e.lanes = n), e);
    }
    function Mi(e, t, n) {
      return ((e = Ei(6, e, null, t)), (e.lanes = n), e);
    }
    function Ni(e) {
      var t = Ei(18, null, null, 0);
      return ((t.stateNode = e), t);
    }
    function Pi(e, t, n) {
      return (
        (t = Ei(4, e.children === null ? [] : e.children, e.key, t)),
        (t.lanes = n),
        (t.stateNode = {
          containerInfo: e.containerInfo,
          pendingChildren: null,
          implementation: e.implementation,
        }),
        t
      );
    }
    var Fi = new WeakMap();
    function Ii(e, t) {
      if (typeof e == `object` && e) {
        var n = Fi.get(e);
        return n === void 0
          ? ((t = { value: e, source: t, stack: Oe(t) }), Fi.set(e, t), t)
          : n;
      }
      return { value: e, source: t, stack: Oe(t) };
    }
    var Li = [],
      Ri = 0,
      zi = null,
      Bi = 0,
      Vi = [],
      Hi = 0,
      Ui = null,
      Wi = 1,
      Gi = ``;
    function Ki(e, t) {
      ((Li[Ri++] = Bi), (Li[Ri++] = zi), (zi = e), (Bi = t));
    }
    function qi(e, t, n) {
      ((Vi[Hi++] = Wi), (Vi[Hi++] = Gi), (Vi[Hi++] = Ui), (Ui = e));
      var r = Wi;
      e = Gi;
      var i = 32 - Ke(r) - 1;
      ((r &= ~(1 << i)), (n += 1));
      var a = 32 - Ke(t) + i;
      if (30 < a) {
        var o = i - (i % 5);
        ((a = (r & ((1 << o) - 1)).toString(32)),
          (r >>= o),
          (i -= o),
          (Wi = (1 << (32 - Ke(t) + i)) | (n << i) | r),
          (Gi = a + e));
      } else ((Wi = (1 << a) | (n << i) | r), (Gi = e));
    }
    function Ji(e) {
      e.return !== null && (Ki(e, 1), qi(e, 1, 0));
    }
    function Yi(e) {
      for (; e === zi;)
        ((zi = Li[--Ri]), (Li[Ri] = null), (Bi = Li[--Ri]), (Li[Ri] = null));
      for (; e === Ui;)
        ((Ui = Vi[--Hi]),
          (Vi[Hi] = null),
          (Gi = Vi[--Hi]),
          (Vi[Hi] = null),
          (Wi = Vi[--Hi]),
          (Vi[Hi] = null));
    }
    function Xi(e, t) {
      ((Vi[Hi++] = Wi),
        (Vi[Hi++] = Gi),
        (Vi[Hi++] = Ui),
        (Wi = t.id),
        (Gi = t.overflow),
        (Ui = e));
    }
    var Zi = null,
      Qi = null,
      K = !1,
      $i = null,
      ea = !1,
      ta = Error(s(519));
    function na(e) {
      throw (
        sa(
          Ii(
            Error(
              s(
                418,
                1 < arguments.length && arguments[1] !== void 0 && arguments[1]
                  ? `text`
                  : `HTML`,
                ``,
              ),
            ),
            e,
          ),
        ),
        ta
      );
    }
    function ra(e) {
      var t = e.stateNode,
        n = e.type,
        r = e.memoizedProps;
      switch (((t[gt] = e), (t[_t] = r), n)) {
        case `dialog`:
          (Bf(`cancel`, t), Bf(`close`, t));
          break;
        case `iframe`:
        case `object`:
        case `embed`:
          Bf(`load`, t);
          break;
        case `video`:
        case `audio`:
          for (n = 0; n < Lf.length; n++) Bf(Lf[n], t);
          break;
        case `source`:
          Bf(`error`, t);
          break;
        case `img`:
        case `image`:
        case `link`:
          (Bf(`error`, t), Bf(`load`, t));
          break;
        case `details`:
          Bf(`toggle`, t);
          break;
        case `input`:
          (Bf(`invalid`, t),
            $t(
              t,
              r.value,
              r.defaultValue,
              r.checked,
              r.defaultChecked,
              r.type,
              r.name,
              !0,
            ));
          break;
        case `select`:
          Bf(`invalid`, t);
          break;
        case `textarea`:
          (Bf(`invalid`, t), rn(t, r.value, r.defaultValue, r.children));
      }
      ((n = r.children),
        (typeof n != `string` &&
          typeof n != `number` &&
          typeof n != `bigint`) ||
        t.textContent === `` + n ||
        !0 === r.suppressHydrationWarning ||
        $f(t.textContent, n)
          ? (r.popover != null && (Bf(`beforetoggle`, t), Bf(`toggle`, t)),
            r.onScroll != null && Bf(`scroll`, t),
            r.onScrollEnd != null && Bf(`scrollend`, t),
            r.onClick != null && (t.onclick = pn),
            (t = !0))
          : (t = !1),
        t || na(e, !0));
    }
    function ia(e) {
      for (Zi = e.return; Zi;)
        switch (Zi.tag) {
          case 5:
          case 31:
          case 13:
            ea = !1;
            return;
          case 27:
          case 3:
            ea = !0;
            return;
          default:
            Zi = Zi.return;
        }
    }
    function q(e) {
      if (e !== Zi) return !1;
      if (!K) return (ia(e), (K = !0), !1);
      var t = e.tag,
        n;
      if (
        ((n = t !== 3 && t !== 27) &&
          ((n = t === 5) &&
            ((n = e.type),
            (n =
              n === `form` || n === `button` || pp(e.type, e.memoizedProps))),
          (n = !n)),
        n && Qi && na(e),
        ia(e),
        t === 13)
      ) {
        if (((e = e.memoizedState), (e = e === null ? null : e.dehydrated), !e))
          throw Error(s(317));
        Qi = dm(e);
      } else if (t === 31) {
        if (((e = e.memoizedState), (e = e === null ? null : e.dehydrated), !e))
          throw Error(s(317));
        Qi = dm(e);
      } else
        t === 27
          ? ((t = Qi),
            Sp(e.type) ? ((e = um), (um = null), (Qi = e)) : (Qi = t))
          : (Qi = Zi ? lm(e.stateNode.nextSibling) : null);
      return !0;
    }
    function aa() {
      ((Qi = Zi = null), (K = !1));
    }
    function oa() {
      var e = $i;
      return (
        e !== null &&
          (ld === null ? (ld = e) : ld.push.apply(ld, e), ($i = null)),
        e
      );
    }
    function sa(e) {
      $i === null ? ($i = [e]) : $i.push(e);
    }
    var ca = me(null),
      la = null,
      ua = null;
    function da(e, t, n) {
      (ge(ca, t._currentValue), (t._currentValue = n));
    }
    function fa(e) {
      ((e._currentValue = ca.current), he(ca));
    }
    function pa(e, t, n) {
      for (; e !== null;) {
        var r = e.alternate;
        if (
          ((e.childLanes & t) === t
            ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t)
            : ((e.childLanes |= t), r !== null && (r.childLanes |= t)),
          e === n)
        )
          break;
        e = e.return;
      }
    }
    function ma(e, t, n, r) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null;) {
        var a = i.dependencies;
        if (a !== null) {
          var o = i.child;
          a = a.firstContext;
          a: for (; a !== null;) {
            var c = a;
            a = i;
            for (var l = 0; l < t.length; l++)
              if (c.context === t[l]) {
                ((a.lanes |= n),
                  (c = a.alternate),
                  c !== null && (c.lanes |= n),
                  pa(a.return, n, e),
                  r || (o = null));
                break a;
              }
            a = c.next;
          }
        } else if (i.tag === 18) {
          if (((o = i.return), o === null)) throw Error(s(341));
          ((o.lanes |= n),
            (a = o.alternate),
            a !== null && (a.lanes |= n),
            pa(o, n, e),
            (o = null));
        } else
          i.tag === 13 &&
          i.memoizedState !== null &&
          i.memoizedState.dehydrated === null
            ? ((i.lanes |= n),
              (o = i.alternate),
              o !== null && (o.lanes |= n),
              pa(i.return, n, e),
              (o = i.child),
              (o = o === null ? null : o.sibling))
            : (o = i.child);
        if (o !== null) o.return = i;
        else
          for (o = i; o !== null;) {
            if (o === e) {
              o = null;
              break;
            }
            if (((i = o.sibling), i !== null)) {
              ((i.return = o.return), (o = i));
              break;
            }
            o = o.return;
          }
        i = o;
      }
    }
    function ha(e, t, n, r) {
      e = null;
      for (var i = t, a = !1; i !== null;) {
        if (!a) {
          if (i.flags & 524288) a = !0;
          else if (i.flags & 262144) break;
        }
        if (i.tag === 10) {
          var o = i.alternate;
          if (o === null) throw Error(s(387));
          if (((o = o.memoizedProps), o !== null)) {
            var c = i.type;
            Fr(i.pendingProps.value, o.value) ||
              (e === null ? (e = [c]) : e.push(c));
          }
        } else if (i === ve.current) {
          if (((o = i.alternate), o === null)) throw Error(s(387));
          o.memoizedState.memoizedState !== i.memoizedState.memoizedState &&
            (e === null ? (e = [sh]) : e.push(sh));
        }
        i = i.return;
      }
      return (e !== null && ma(t, e, n, r), (t.flags |= 262144), e !== null);
    }
    function ga(e) {
      for (e = e.firstContext; e !== null;) {
        if (!Fr(e.context._currentValue, e.memoizedValue)) return !0;
        e = e.next;
      }
      return !1;
    }
    function _a(e) {
      ((la = e),
        (ua = null),
        (e = e.dependencies),
        e !== null && (e.firstContext = null));
    }
    function va(e) {
      return ba(la, e);
    }
    function ya(e, t) {
      return (la === null && _a(e), ba(e, t));
    }
    function ba(e, t) {
      var n = t._currentValue;
      if (((t = { context: t, memoizedValue: n, next: null }), ua === null)) {
        if (e === null) throw Error(s(308));
        ((ua = t),
          (e.dependencies = { lanes: 0, firstContext: t }),
          (e.flags |= 524288));
      } else ua = ua.next = t;
      return n;
    }
    var xa =
        typeof AbortController < `u`
          ? AbortController
          : function () {
              var e = [],
                t = (this.signal = {
                  aborted: !1,
                  addEventListener: function (t, n) {
                    e.push(n);
                  },
                });
              this.abort = function () {
                ((t.aborted = !0),
                  e.forEach(function (e) {
                    return e();
                  }));
              };
            },
      Sa = t.unstable_scheduleCallback,
      Ca = t.unstable_NormalPriority,
      wa = {
        $$typeof: F,
        Consumer: null,
        Provider: null,
        _currentValue: null,
        _currentValue2: null,
        _threadCount: 0,
      };
    function Ta() {
      return { controller: new xa(), data: new Map(), refCount: 0 };
    }
    function Ea(e) {
      (e.refCount--,
        e.refCount === 0 &&
          Sa(Ca, function () {
            e.controller.abort();
          }));
    }
    function Da(e, t) {
      if (e.pendingLanes & 4194048) {
        var n = e.transitionTypes;
        for (
          n === null && (n = e.transitionTypes = []), e = 0;
          e < t.length;
          e++
        ) {
          var r = t[e];
          n.indexOf(r) === -1 && n.push(r);
        }
      }
    }
    var J = null;
    function Oa(e) {
      var t = e.transitionTypes;
      return ((e.transitionTypes = null), t);
    }
    var Y = null,
      ka = 0,
      Aa = 0,
      ja = null;
    function Ma(e, t) {
      if (Y === null) {
        var n = (Y = []);
        ((ka = 0),
          (Aa = Mf()),
          (ja = {
            status: `pending`,
            value: void 0,
            then: function (e) {
              n.push(e);
            },
          }));
      }
      return (ka++, t.then(Na, Na), t);
    }
    function Na() {
      if (--ka === 0 && ((J = null), Y !== null)) {
        ja !== null && (ja.status = `fulfilled`);
        var e = Y;
        ((Y = null), (Aa = 0), (ja = null));
        for (var t = 0; t < e.length; t++) (0, e[t])();
      }
    }
    function Pa(e, t) {
      var n = [],
        r = {
          status: `pending`,
          value: null,
          reason: null,
          then: function (e) {
            n.push(e);
          },
        };
      return (
        e.then(
          function () {
            ((r.status = `fulfilled`), (r.value = t));
            for (var e = 0; e < n.length; e++) (0, n[e])(t);
          },
          function (e) {
            for (r.status = `rejected`, r.reason = e, e = 0; e < n.length; e++)
              (0, n[e])(void 0);
          },
        ),
        r
      );
    }
    var Fa = B.S;
    B.S = function (e, t) {
      if (
        ((fd = Pe()),
        typeof t == `object` && t && typeof t.then == `function` && Ma(e, t),
        J !== null)
      )
        for (var n = vf; n !== null;) (Da(n, J), (n = n.next));
      if (((n = e.types), n !== null)) {
        for (var r = vf; r !== null;) (Da(r, n), (r = r.next));
        if (Aa !== 0) {
          ((r = J), r === null && (r = J = []));
          for (var i = 0; i < n.length; i++) {
            var a = n[i];
            r.indexOf(a) === -1 && r.push(a);
          }
        }
      }
      Fa !== null && Fa(e, t);
    };
    var Ia = me(null);
    function La() {
      var e = Ia.current;
      return e === null ? qu.pooledCache : e;
    }
    function Ra(e, t) {
      t === null ? ge(Ia, Ia.current) : ge(Ia, t.pool);
    }
    function za() {
      var e = La();
      return e === null ? null : { parent: wa._currentValue, pool: e };
    }
    var Ba = Error(s(460)),
      Va = Error(s(474)),
      Ha = Error(s(542)),
      Ua = { then: function () {} };
    function Wa(e) {
      return ((e = e.status), e === `fulfilled` || e === `rejected`);
    }
    function Ga(e, t, n) {
      switch (
        ((n = e[n]),
        n === void 0 ? e.push(t) : n !== t && (t.then(pn, pn), (t = n)),
        t.status)
      ) {
        case `fulfilled`:
          return t.value;
        case `rejected`:
          throw (
            (e = t.reason),
            Ya(e),
            e === void 0 && !(`reason` in t) ? Error(s(600)) : e
          );
        default:
          if (typeof t.status == `string`) t.then(pn, pn);
          else {
            if (((e = qu), e !== null && 100 < e.shellSuspendCounter))
              throw Error(s(482));
            ((e = t),
              (e.status = `pending`),
              e.then(
                function (e) {
                  if (t.status === `pending`) {
                    var n = t;
                    ((n.status = `fulfilled`), (n.value = e));
                  }
                },
                function (e) {
                  if (t.status === `pending`) {
                    var n = t;
                    ((n.status = `rejected`), (n.reason = e));
                  }
                },
              ));
          }
          switch (t.status) {
            case `fulfilled`:
              return t.value;
            case `rejected`:
              throw ((e = t.reason), Ya(e), e);
          }
          throw ((qa = t), Ba);
      }
    }
    function Ka(e) {
      try {
        var t = e._init;
        return t(e._payload);
      } catch (e) {
        throw typeof e == `object` && e && typeof e.then == `function`
          ? ((qa = e), Ba)
          : e;
      }
    }
    var qa = null;
    function Ja() {
      if (qa === null) throw Error(s(459));
      var e = qa;
      return ((qa = null), e);
    }
    function Ya(e) {
      if (e === Ba || e === Ha) throw Error(s(483));
    }
    var Xa = null,
      Za = 0;
    function Qa(e) {
      var t = Za;
      return ((Za += 1), Xa === null && (Xa = []), Ga(Xa, e, t));
    }
    function $a(e, t) {
      ((t = t.props.ref), (e.ref = t === void 0 ? null : t));
    }
    function eo(e, t) {
      throw t.$$typeof === O
        ? Error(s(525))
        : ((e = Object.prototype.toString.call(t)),
          Error(
            s(
              31,
              e === `[object Object]`
                ? `object with keys {` + Object.keys(t).join(`, `) + `}`
                : e,
            ),
          ));
    }
    function to(e) {
      function t(t, n) {
        if (e) {
          var r = t.deletions;
          r === null ? ((t.deletions = [n]), (t.flags |= 16)) : r.push(n);
        }
      }
      function n(n, r) {
        if (!e) return null;
        for (; r !== null;) (t(n, r), (r = r.sibling));
        return null;
      }
      function r(e) {
        for (var t = new Map(); e !== null;)
          (e.key === null ? t.set(e.index, e) : t.set(e.key, e),
            (e = e.sibling));
        return t;
      }
      function i(e, t) {
        return ((e = Oi(e, t)), (e.index = 0), (e.sibling = null), e);
      }
      function a(t, n, r) {
        return (
          (t.index = r),
          e
            ? ((r = t.alternate),
              r === null
                ? ((t.flags |= 134217730), n)
                : ((r = r.index), r < n ? ((t.flags |= 2), n) : r))
            : ((t.flags |= 1048576), n)
        );
      }
      function o(t) {
        return (e && t.alternate === null && (t.flags |= 134217730), t);
      }
      function c(e, t, n, r) {
        return t === null || t.tag !== 6
          ? ((t = Mi(n, e.mode, r)), (t.return = e), t)
          : ((t = i(t, n)), (t.return = e), t);
      }
      function l(e, t, n, r) {
        var a = n.type;
        return a === j
          ? ((e = d(e, t, n.props.children, r, n.key)), $a(e, n), e)
          : t !== null &&
              (t.elementType === a ||
                (typeof a == `object` &&
                  a &&
                  a.$$typeof === I &&
                  Ka(a) === t.type))
            ? ((t = i(t, n.props)), $a(t, n), (t.return = e), t)
            : ((t = Ai(n.type, n.key, n.props, null, e.mode, r)),
              $a(t, n),
              (t.return = e),
              t);
      }
      function u(e, t, n, r) {
        return t === null ||
          t.tag !== 4 ||
          t.stateNode.containerInfo !== n.containerInfo ||
          t.stateNode.implementation !== n.implementation
          ? ((t = Pi(n, e.mode, r)), (t.return = e), t)
          : ((t = i(t, n.children || [])), (t.return = e), t);
      }
      function d(e, t, n, r, a) {
        return t === null || t.tag !== 7
          ? ((t = ji(n, e.mode, r, a)), (t.return = e), t)
          : ((t = i(t, n)), (t.return = e), t);
      }
      function f(e, t, n) {
        if (
          (typeof t == `string` && t !== ``) ||
          typeof t == `number` ||
          typeof t == `bigint`
        )
          return ((t = Mi(`` + t, e.mode, n)), (t.return = e), t);
        if (typeof t == `object` && t) {
          switch (t.$$typeof) {
            case k:
              return (
                (n = Ai(t.type, t.key, t.props, null, e.mode, n)),
                $a(n, t),
                (n.return = e),
                n
              );
            case A:
              return ((t = Pi(t, e.mode, n)), (t.return = e), t);
            case I:
              return ((t = Ka(t)), f(e, t, n));
          }
          if (z(t) || R(t))
            return ((t = ji(t, e.mode, n, null)), (t.return = e), t);
          if (typeof t.then == `function`) return f(e, Qa(t), n);
          if (t.$$typeof === F) return f(e, ya(e, t), n);
          eo(e, t);
        }
        return null;
      }
      function p(e, t, n, r) {
        var i = t === null ? null : t.key;
        if (
          (typeof n == `string` && n !== ``) ||
          typeof n == `number` ||
          typeof n == `bigint`
        )
          return i === null ? c(e, t, `` + n, r) : null;
        if (typeof n == `object` && n) {
          switch (n.$$typeof) {
            case k:
              return n.key === i ? l(e, t, n, r) : null;
            case A:
              return n.key === i ? u(e, t, n, r) : null;
            case I:
              return ((n = Ka(n)), p(e, t, n, r));
          }
          if (z(n) || R(n)) return i === null ? d(e, t, n, r, null) : null;
          if (typeof n.then == `function`) return p(e, t, Qa(n), r);
          if (n.$$typeof === F) return p(e, t, ya(e, n), r);
          eo(e, n);
        }
        return null;
      }
      function m(e, t, n, r, i) {
        if (
          (typeof r == `string` && r !== ``) ||
          typeof r == `number` ||
          typeof r == `bigint`
        )
          return ((e = e.get(n) || null), c(t, e, `` + r, i));
        if (typeof r == `object` && r) {
          switch (r.$$typeof) {
            case k:
              return (
                (e = e.get(r.key === null ? n : r.key) || null),
                l(t, e, r, i)
              );
            case A:
              return (
                (e = e.get(r.key === null ? n : r.key) || null),
                u(t, e, r, i)
              );
            case I:
              return ((r = Ka(r)), m(e, t, n, r, i));
          }
          if (z(r) || R(r))
            return ((e = e.get(n) || null), d(t, e, r, i, null));
          if (typeof r.then == `function`) return m(e, t, n, Qa(r), i);
          if (r.$$typeof === F) return m(e, t, n, ya(t, r), i);
          eo(t, r);
        }
        return null;
      }
      function h(i, o, s, c) {
        for (
          var l = null, u = null, d = o, h = (o = 0), g = null;
          d !== null && h < s.length;
          h++
        ) {
          d.index > h ? ((g = d), (d = null)) : (g = d.sibling);
          var _ = p(i, d, s[h], c);
          if (_ === null) {
            d === null && (d = g);
            break;
          }
          (e && d && _.alternate === null && t(i, d),
            (o = a(_, o, h)),
            u === null ? (l = _) : (u.sibling = _),
            (u = _),
            (d = g));
        }
        if (h === s.length) return (n(i, d), K && Ki(i, h), l);
        if (d === null) {
          for (; h < s.length; h++)
            ((d = f(i, s[h], c)),
              d !== null &&
                ((o = a(d, o, h)),
                u === null ? (l = d) : (u.sibling = d),
                (u = d)));
          return (K && Ki(i, h), l);
        }
        for (d = r(d); h < s.length; h++)
          ((g = m(d, i, h, s[h], c)),
            g !== null &&
              (e &&
                ((_ = g.alternate),
                _ !== null && d.delete(_.key === null ? h : _.key)),
              (o = a(g, o, h)),
              u === null ? (l = g) : (u.sibling = g),
              (u = g)));
        return (
          e &&
            d.forEach(function (e) {
              return t(i, e);
            }),
          K && Ki(i, h),
          l
        );
      }
      function g(i, o, c, l) {
        if (c == null) throw Error(s(151));
        for (
          var u = null, d = null, h = o, g = (o = 0), _ = null, v = c.next();
          h !== null && !v.done;
          g++, v = c.next()
        ) {
          h.index > g ? ((_ = h), (h = null)) : (_ = h.sibling);
          var y = p(i, h, v.value, l);
          if (y === null) {
            h === null && (h = _);
            break;
          }
          (e && h && y.alternate === null && t(i, h),
            (o = a(y, o, g)),
            d === null ? (u = y) : (d.sibling = y),
            (d = y),
            (h = _));
        }
        if (v.done) return (n(i, h), K && Ki(i, g), u);
        if (h === null) {
          for (; !v.done; g++, v = c.next())
            ((v = f(i, v.value, l)),
              v !== null &&
                ((o = a(v, o, g)),
                d === null ? (u = v) : (d.sibling = v),
                (d = v)));
          return (K && Ki(i, g), u);
        }
        for (h = r(h); !v.done; g++, v = c.next())
          ((v = m(h, i, g, v.value, l)),
            v !== null &&
              (e &&
                ((_ = v.alternate),
                _ !== null && h.delete(_.key === null ? g : _.key)),
              (o = a(v, o, g)),
              d === null ? (u = v) : (d.sibling = v),
              (d = v)));
        return (
          e &&
            h.forEach(function (e) {
              return t(i, e);
            }),
          K && Ki(i, g),
          u
        );
      }
      function _(e, r, a, c) {
        if (
          (typeof a == `object` &&
            a &&
            a.type === j &&
            a.key === null &&
            a.props.ref === void 0 &&
            (a = a.props.children),
          typeof a == `object` && a)
        ) {
          switch (a.$$typeof) {
            case k:
              a: {
                for (var l = a.key; r !== null;) {
                  if (r.key === l) {
                    if (((l = a.type), l === j)) {
                      if (r.tag === 7) {
                        (n(e, r.sibling),
                          (c = i(r, a.props.children)),
                          $a(c, a),
                          (c.return = e),
                          (e = c));
                        break a;
                      }
                    } else if (
                      r.elementType === l ||
                      (typeof l == `object` &&
                        l &&
                        l.$$typeof === I &&
                        Ka(l) === r.type)
                    ) {
                      (n(e, r.sibling),
                        (c = i(r, a.props)),
                        $a(c, a),
                        (c.return = e),
                        (e = c));
                      break a;
                    }
                    n(e, r);
                    break;
                  }
                  (t(e, r), (r = r.sibling));
                }
                a.type === j
                  ? ((c = ji(a.props.children, e.mode, c, a.key)),
                    $a(c, a),
                    (c.return = e),
                    (e = c))
                  : ((c = Ai(a.type, a.key, a.props, null, e.mode, c)),
                    $a(c, a),
                    (c.return = e),
                    (e = c));
              }
              return o(e);
            case A:
              a: {
                for (l = a.key; r !== null;) {
                  if (r.key === l) {
                    if (
                      r.tag === 4 &&
                      r.stateNode.containerInfo === a.containerInfo &&
                      r.stateNode.implementation === a.implementation
                    ) {
                      (n(e, r.sibling),
                        (c = i(r, a.children || [])),
                        (c.return = e),
                        (e = c));
                      break a;
                    }
                    n(e, r);
                    break;
                  }
                  (t(e, r), (r = r.sibling));
                }
                ((c = Pi(a, e.mode, c)), (c.return = e), (e = c));
              }
              return o(e);
            case I:
              return ((a = Ka(a)), _(e, r, a, c));
          }
          if (z(a)) return h(e, r, a, c);
          if (R(a)) {
            if (((l = R(a)), typeof l != `function`)) throw Error(s(150));
            return ((a = l.call(a)), g(e, r, a, c));
          }
          if (typeof a.then == `function`) return _(e, r, Qa(a), c);
          if (a.$$typeof === F) return _(e, r, ya(e, a), c);
          eo(e, a);
        }
        return (typeof a == `string` && a !== ``) ||
          typeof a == `number` ||
          typeof a == `bigint`
          ? ((a = `` + a),
            r !== null && r.tag === 6
              ? (n(e, r.sibling), (c = i(r, a)), (c.return = e), (e = c))
              : (n(e, r), (c = Mi(a, e.mode, c)), (c.return = e), (e = c)),
            o(e))
          : n(e, r);
      }
      return function (e, t, n, r) {
        try {
          Za = 0;
          var i = _(e, t, n, r);
          return ((Xa = null), i);
        } catch (t) {
          if (t === Ba || t === Ha) throw t;
          var a = Ei(29, t, null, e.mode);
          return ((a.lanes = r), (a.return = e), a);
        }
      };
    }
    var no = to(!0),
      ro = to(!1),
      io = !1;
    function ao(e) {
      e.updateQueue = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, lanes: 0, hiddenCallbacks: null },
        callbacks: null,
      };
    }
    function oo(e, t) {
      ((e = e.updateQueue),
        t.updateQueue === e &&
          (t.updateQueue = {
            baseState: e.baseState,
            firstBaseUpdate: e.firstBaseUpdate,
            lastBaseUpdate: e.lastBaseUpdate,
            shared: e.shared,
            callbacks: null,
          }));
    }
    function so(e) {
      return { lane: e, tag: 0, payload: null, callback: null, next: null };
    }
    function co(e, t, n) {
      var r = e.updateQueue;
      if (r === null) return null;
      if (((r = r.shared), Ku & 2)) {
        var i = r.pending;
        return (
          i === null ? (t.next = t) : ((t.next = i.next), (i.next = t)),
          (r.pending = t),
          (t = Ci(e)),
          Si(e, null, n),
          t
        );
      }
      return (yi(e, r, t, n), Ci(e));
    }
    function lo(e, t, n) {
      if (((t = t.updateQueue), t !== null && ((t = t.shared), n & 4194048))) {
        var r = t.lanes;
        ((r &= e.pendingLanes), (n |= r), (t.lanes = n), lt(e, n));
      }
    }
    function uo(e, t) {
      var n = e.updateQueue,
        r = e.alternate;
      if (r !== null && ((r = r.updateQueue), n === r)) {
        var i = null,
          a = null;
        if (((n = n.firstBaseUpdate), n !== null)) {
          do {
            var o = {
              lane: n.lane,
              tag: n.tag,
              payload: n.payload,
              callback: null,
              next: null,
            };
            (a === null ? (i = a = o) : (a = a.next = o), (n = n.next));
          } while (n !== null);
          a === null ? (i = a = t) : (a = a.next = t);
        } else i = a = t;
        ((n = {
          baseState: r.baseState,
          firstBaseUpdate: i,
          lastBaseUpdate: a,
          shared: r.shared,
          callbacks: r.callbacks,
        }),
          (e.updateQueue = n));
      } else
        ((e = n.lastBaseUpdate),
          e === null ? (n.firstBaseUpdate = t) : (e.next = t),
          (n.lastBaseUpdate = t));
    }
    var fo = !1;
    function po() {
      if (fo) {
        var e = ja;
        if (e !== null) throw e;
      }
    }
    function mo(e, t, n, r) {
      fo = !1;
      var i = e.updateQueue;
      io = !1;
      var a = i.firstBaseUpdate,
        o = i.lastBaseUpdate,
        s = i.shared.pending;
      if (s !== null) {
        i.shared.pending = null;
        var c = s,
          l = c.next;
        ((c.next = null), o === null ? (a = l) : (o.next = l), (o = c));
        var u = e.alternate;
        u !== null &&
          ((u = u.updateQueue),
          (s = u.lastBaseUpdate),
          s !== o &&
            (s === null ? (u.firstBaseUpdate = l) : (s.next = l),
            (u.lastBaseUpdate = c)));
      }
      if (a !== null) {
        var d = i.baseState;
        ((o = 0), (u = l = c = null), (s = a));
        do {
          var f = s.lane & -536870913,
            p = f !== s.lane;
          if (p ? (Yu & f) === f : (r & f) === f) {
            (f !== 0 && f === Aa && (fo = !0),
              u !== null &&
                (u = u.next =
                  {
                    lane: 0,
                    tag: s.tag,
                    payload: s.payload,
                    callback: null,
                    next: null,
                  }));
            a: {
              var m = e,
                h = s;
              f = t;
              var g = n;
              switch (h.tag) {
                case 1:
                  if (((m = h.payload), typeof m == `function`)) {
                    d = m.call(g, d, f);
                    break a;
                  }
                  d = m;
                  break a;
                case 3:
                  m.flags = (m.flags & -65537) | 128;
                case 0:
                  if (
                    ((m = h.payload),
                    (f = typeof m == `function` ? m.call(g, d, f) : m),
                    f == null)
                  )
                    break a;
                  d = D({}, d, f);
                  break a;
                case 2:
                  io = !0;
              }
            }
            ((f = s.callback),
              f !== null &&
                ((e.flags |= 64),
                p && (e.flags |= 8192),
                (p = i.callbacks),
                p === null ? (i.callbacks = [f]) : p.push(f)));
          } else
            ((p = {
              lane: f,
              tag: s.tag,
              payload: s.payload,
              callback: s.callback,
              next: null,
            }),
              u === null ? ((l = u = p), (c = d)) : (u = u.next = p),
              (o |= f));
          if (((s = s.next), s === null)) {
            if (((s = i.shared.pending), s === null)) break;
            ((p = s),
              (s = p.next),
              (p.next = null),
              (i.lastBaseUpdate = p),
              (i.shared.pending = null));
          }
        } while (1);
        (u === null && (c = d),
          (i.baseState = c),
          (i.firstBaseUpdate = l),
          (i.lastBaseUpdate = u),
          a === null && (i.shared.lanes = 0),
          (rd |= o),
          (e.lanes = o),
          (e.memoizedState = d));
      }
    }
    function ho(e, t) {
      if (typeof e != `function`) throw Error(s(191, e));
      e.call(t);
    }
    function go(e, t) {
      var n = e.callbacks;
      if (n !== null)
        for (e.callbacks = null, e = 0; e < n.length; e++) ho(n[e], t);
    }
    var _o = me(null),
      vo = me(0);
    function yo(e, t) {
      ((e = td), ge(vo, e), ge(_o, t), (td = e | t.baseLanes));
    }
    function bo() {
      (ge(vo, td), ge(_o, _o.current));
    }
    function xo() {
      ((td = vo.current), he(_o), he(vo));
    }
    var So = me(null),
      Co = null;
    function wo(e) {
      var t = e.alternate;
      (ge(ko, ko.current & 1),
        ge(So, e),
        Co === null &&
          (t === null || _o.current !== null || t.memoizedState !== null) &&
          (Co = e));
    }
    function To(e) {
      (ge(ko, ko.current), ge(So, e), Co === null && (Co = e));
    }
    function Eo(e) {
      e.tag === 22
        ? (ge(ko, ko.current), ge(So, e), Co === null && (Co = e))
        : Do();
    }
    function Do() {
      (ge(ko, ko.current), ge(So, So.current));
    }
    function Oo(e) {
      (he(So), Co === e && (Co = null), he(ko));
    }
    var ko = me(0);
    function Ao(e, t) {
      (ge(So, So.current), ge(ko, t));
    }
    function jo(e) {
      (he(ko), he(So), Co === e && (Co = null));
    }
    function Mo(e) {
      for (var t = e; t !== null;) {
        if (t.tag === 13) {
          var n = t.memoizedState;
          if (n !== null && ((n = n.dehydrated), n === null || om(n) || sm(n)))
            return t;
        } else if (
          t.tag === 19 &&
          t.memoizedProps.revealOrder !== `independent`
        ) {
          if (t.flags & 128) return t;
        } else if (t.child !== null) {
          ((t.child.return = t), (t = t.child));
          continue;
        }
        if (t === e) break;
        for (; t.sibling === null;) {
          if (t.return === null || t.return === e) return null;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
      return null;
    }
    var No = 0,
      X = null,
      Po = null,
      Fo = null,
      Io = !1,
      Lo = !1,
      Ro = !1,
      zo = 0,
      Bo = 0,
      Vo = null,
      Ho = 0;
    function Uo() {
      throw Error(s(321));
    }
    function Wo(e, t) {
      if (t === null) return !1;
      for (var n = 0; n < t.length && n < e.length; n++)
        if (!Fr(e[n], t[n])) return !1;
      return !0;
    }
    function Go(e, t, n, r, i, a) {
      return (
        (No = a),
        (X = t),
        (t.memoizedState = null),
        (t.updateQueue = null),
        (t.lanes = 0),
        (B.H = e === null || e.memoizedState === null ? oc : sc),
        (Ro = !1),
        (a = n(r, i)),
        (Ro = !1),
        Lo && (a = qo(t, n, r, i)),
        Ko(e),
        a
      );
    }
    function Ko(e) {
      B.H = ac;
      var t = Po !== null && Po.next !== null;
      if (((No = 0), (Fo = Po = X = null), (Io = !1), (Bo = 0), (Vo = null), t))
        throw Error(s(300));
      e === null ||
        Cc ||
        ((e = e.dependencies), e !== null && ga(e) && (Cc = !0));
    }
    function qo(e, t, n, r) {
      X = e;
      var i = 0;
      do {
        if ((Lo && (Vo = null), (Bo = 0), (Lo = !1), 25 <= i))
          throw Error(s(301));
        if (((i += 1), (Fo = Po = null), e.updateQueue != null)) {
          var a = e.updateQueue;
          ((a.lastEffect = null),
            (a.events = null),
            (a.stores = null),
            a.memoCache != null && (a.memoCache.index = 0));
        }
        ((B.H = cc), (a = t(n, r)));
      } while (Lo);
      return a;
    }
    function Jo() {
      var e = B.H,
        t = e.useState()[0];
      return (
        (t = typeof t.then == `function` ? ts(t) : t),
        (e = e.useState()[0]),
        (Po === null ? null : Po.memoizedState) !== e && (X.flags |= 1024),
        t
      );
    }
    function Yo() {
      var e = zo !== 0;
      return ((zo = 0), e);
    }
    function Xo(e, t, n) {
      ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~n));
    }
    function Zo(e) {
      if (Io) {
        for (e = e.memoizedState; e !== null;) {
          var t = e.queue;
          (t !== null && (t.pending = null), (e = e.next));
        }
        Io = !1;
      }
      ((No = 0), (Fo = Po = X = null), (Lo = !1), (Bo = zo = 0), (Vo = null));
    }
    function Qo() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null,
      };
      return (
        Fo === null ? (X.memoizedState = Fo = e) : (Fo = Fo.next = e),
        Fo
      );
    }
    function $o() {
      if (Po === null) {
        var e = X.alternate;
        e = e === null ? null : e.memoizedState;
      } else e = Po.next;
      var t = Fo === null ? X.memoizedState : Fo.next;
      if (t !== null) ((Fo = t), (Po = e));
      else {
        if (e === null)
          throw X.alternate === null ? Error(s(467)) : Error(s(310));
        ((Po = e),
          (e = {
            memoizedState: Po.memoizedState,
            baseState: Po.baseState,
            baseQueue: Po.baseQueue,
            queue: Po.queue,
            next: null,
          }),
          Fo === null ? (X.memoizedState = Fo = e) : (Fo = Fo.next = e));
      }
      return Fo;
    }
    function es() {
      return { lastEffect: null, events: null, stores: null, memoCache: null };
    }
    function ts(e) {
      var t = Bo;
      return (
        (Bo += 1),
        Vo === null && (Vo = []),
        (e = Ga(Vo, e, t)),
        (t = X),
        (Fo === null ? t.memoizedState : Fo.next) === null &&
          ((t = t.alternate),
          (B.H = t === null || t.memoizedState === null ? oc : sc)),
        e
      );
    }
    function ns(e) {
      if (typeof e == `object` && e) {
        if (typeof e.then == `function`) return ts(e);
        if (e.$$typeof === se) return;
        if (e.$$typeof === F) return va(e);
      }
      throw Error(s(438, String(e)));
    }
    function rs(e) {
      var t = null,
        n = X.updateQueue;
      if ((n !== null && (t = n.memoCache), t == null)) {
        var r = X.alternate;
        r !== null &&
          ((r = r.updateQueue),
          r !== null &&
            ((r = r.memoCache),
            r != null &&
              (t = {
                data: r.data.map(function (e) {
                  return e.slice();
                }),
                index: 0,
              })));
      }
      if (
        ((t ??= { data: [], index: 0 }),
        n === null && ((n = es()), (X.updateQueue = n)),
        (n.memoCache = t),
        (n = t.data[t.index]),
        n === void 0)
      )
        for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = ae;
      return (t.index++, n);
    }
    function is(e, t) {
      return typeof t == `function` ? t(e) : t;
    }
    function as(e) {
      return os($o(), Po, e);
    }
    function os(e, t, n) {
      var r = e.queue;
      if (r === null) throw Error(s(311));
      r.lastRenderedReducer = n;
      var i = e.baseQueue,
        a = r.pending;
      if (a !== null) {
        if (i !== null) {
          var o = i.next;
          ((i.next = a.next), (a.next = o));
        }
        ((t.baseQueue = i = a), (r.pending = null));
      }
      if (((a = e.baseState), i === null)) e.memoizedState = a;
      else {
        t = i.next;
        var c = (o = null),
          l = null,
          u = t,
          d = !1;
        do {
          var f = u.lane & -536870913;
          if (f === u.lane ? (No & f) === f : (Yu & f) === f) {
            var p = u.revertLane;
            if (p === 0)
              (l !== null &&
                (l = l.next =
                  {
                    lane: 0,
                    revertLane: 0,
                    gesture: null,
                    action: u.action,
                    hasEagerState: u.hasEagerState,
                    eagerState: u.eagerState,
                    next: null,
                  }),
                f === Aa && (d = !0));
            else if ((No & p) === p) {
              ((u = u.next), p === Aa && (d = !0));
              continue;
            } else
              ((f = {
                lane: 0,
                revertLane: u.revertLane,
                gesture: null,
                action: u.action,
                hasEagerState: u.hasEagerState,
                eagerState: u.eagerState,
                next: null,
              }),
                l === null ? ((c = l = f), (o = a)) : (l = l.next = f),
                (X.lanes |= p),
                (rd |= p));
            ((f = u.action),
              Ro && n(a, f),
              (a = u.hasEagerState ? u.eagerState : n(a, f)));
          } else
            ((p = {
              lane: f,
              revertLane: u.revertLane,
              gesture: u.gesture,
              action: u.action,
              hasEagerState: u.hasEagerState,
              eagerState: u.eagerState,
              next: null,
            }),
              l === null ? ((c = l = p), (o = a)) : (l = l.next = p),
              (X.lanes |= f),
              (rd |= f));
          u = u.next;
        } while (u !== null && u !== t);
        if (
          (l === null ? (o = a) : (l.next = c),
          !Fr(a, e.memoizedState) && ((Cc = !0), d && ((n = ja), n !== null)))
        )
          throw n;
        ((e.memoizedState = a),
          (e.baseState = o),
          (e.baseQueue = l),
          (r.lastRenderedState = a));
      }
      return (i === null && (r.lanes = 0), [e.memoizedState, r.dispatch]);
    }
    function ss(e) {
      var t = $o(),
        n = t.queue;
      if (n === null) throw Error(s(311));
      n.lastRenderedReducer = e;
      var r = n.dispatch,
        i = n.pending,
        a = t.memoizedState;
      if (i !== null) {
        n.pending = null;
        var o = (i = i.next);
        do ((a = e(a, o.action)), (o = o.next));
        while (o !== i);
        (Fr(a, t.memoizedState) || (Cc = !0),
          (t.memoizedState = a),
          t.baseQueue === null && (t.baseState = a),
          (n.lastRenderedState = a));
      }
      return [a, r];
    }
    function cs(e, t, n) {
      var r = X,
        i = $o(),
        a = K;
      if (a) {
        if (n === void 0) throw Error(s(407));
        n = n();
      } else n = t();
      var o = !Fr((Po || i).memoizedState, n);
      if (
        (o && ((i.memoizedState = n), (Cc = !0)),
        (i = i.queue),
        Ms(ds.bind(null, r, i, e), [e]),
        (e =
          i.getSnapshot !== t ||
          o ||
          (Fo !== null && !!(Fo.memoizedState.tag & 1))),
        Ds(e ? 9 : 8, { destroy: void 0 }, us.bind(null, r, i, n, t), null),
        e)
      ) {
        if (((r.flags |= 2048), qu === null)) throw Error(s(349));
        a || No & 127 || ls(r, t, n);
      }
      return n;
    }
    function ls(e, t, n) {
      ((e.flags |= 16384),
        (e = { getSnapshot: t, value: n }),
        (t = X.updateQueue),
        t === null
          ? ((t = es()), (X.updateQueue = t), (t.stores = [e]))
          : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
    }
    function us(e, t, n, r) {
      ((t.value = n), (t.getSnapshot = r), fs(t) && ps(e));
    }
    function ds(e, t, n) {
      return n(function () {
        fs(t) && ps(e);
      });
    }
    function fs(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var n = t();
        return !Fr(e, n);
      } catch {
        return !0;
      }
    }
    function ps(e) {
      var t = xi(e, 2);
      t !== null && jd(t, e, 2);
    }
    function Z(e) {
      var t = Qo();
      if (typeof e == `function`) {
        var n = e;
        if (((e = n()), Ro)) {
          Ge(!0);
          try {
            n();
          } finally {
            Ge(!1);
          }
        }
      }
      return (
        (t.memoizedState = t.baseState = e),
        (t.queue = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: is,
          lastRenderedState: e,
        }),
        t
      );
    }
    function ms(e, t, n, r) {
      return ((e.baseState = n), os(e, Po, typeof r == `function` ? r : is));
    }
    function hs(e, t, n, r, i) {
      if (nc(e)) throw Error(s(485));
      if (((e = t.action), e !== null)) {
        var a = {
          payload: i,
          action: e,
          next: null,
          isTransition: !0,
          status: `pending`,
          value: null,
          reason: null,
          listeners: [],
          then: function (e) {
            a.listeners.push(e);
          },
        };
        (B.T === null ? (a.isTransition = !1) : n(!0),
          r(a),
          (n = t.pending),
          n === null
            ? ((a.next = t.pending = a), gs(t, a))
            : ((a.next = n.next), (t.pending = n.next = a)));
      }
    }
    function gs(e, t) {
      var n = t.action,
        r = t.payload,
        i = e.state;
      if (t.isTransition) {
        var a = B.T,
          o = {};
        ((o.types = a === null ? null : a.types), (B.T = o));
        try {
          var s = n(i, r),
            c = B.S;
          (c !== null && c(o, s), _s(e, t, s));
        } catch (n) {
          ys(e, t, n);
        } finally {
          (a !== null && o.types !== null && (a.types = o.types), (B.T = a));
        }
      } else
        try {
          ((a = n(i, r)), _s(e, t, a));
        } catch (n) {
          ys(e, t, n);
        }
    }
    function _s(e, t, n) {
      typeof n == `object` && n && typeof n.then == `function`
        ? n.then(
            function (n) {
              vs(e, t, n);
            },
            function (n) {
              return ys(e, t, n);
            },
          )
        : vs(e, t, n);
    }
    function vs(e, t, n) {
      ((t.status = `fulfilled`),
        (t.value = n),
        bs(t),
        (e.state = n),
        (t = e.pending),
        t !== null &&
          ((n = t.next),
          n === t
            ? (e.pending = null)
            : ((n = n.next), (t.next = n), gs(e, n))));
    }
    function ys(e, t, n) {
      var r = e.pending;
      if (((e.pending = null), r !== null)) {
        r = r.next;
        do ((t.status = `rejected`), (t.reason = n), bs(t), (t = t.next));
        while (t !== r);
      }
      e.action = null;
    }
    function bs(e) {
      e = e.listeners;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
    function xs(e, t) {
      return t;
    }
    function Ss(e, t) {
      if (K) {
        var n = qu.formState;
        if (n !== null) {
          a: {
            var r = X;
            if (K) {
              if (Qi) {
                b: {
                  for (var i = Qi, a = ea; i.nodeType !== 8;)
                    if (!a || ((i = lm(i.nextSibling)), i === null)) {
                      i = null;
                      break b;
                    }
                  ((a = i.data), (i = a === `F!` || a === `F` ? i : null));
                }
                if (i) {
                  ((Qi = lm(i.nextSibling)), (r = i.data === `F!`));
                  break a;
                }
              }
              na(r);
            }
            r = !1;
          }
          r && (t = n[0]);
        }
      }
      return (
        (n = Qo()),
        (n.memoizedState = n.baseState = t),
        (r = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: xs,
          lastRenderedState: t,
        }),
        (n.queue = r),
        (n = ec.bind(null, X, r)),
        (r.dispatch = n),
        (r = Z(!1)),
        (a = tc.bind(null, X, !1, r.queue)),
        (r = Qo()),
        (i = { state: t, dispatch: null, action: e, pending: null }),
        (r.queue = i),
        (n = hs.bind(null, X, i, a, n)),
        (i.dispatch = n),
        (r.memoizedState = e),
        [t, n, !1]
      );
    }
    function Cs(e) {
      return ws($o(), Po, e);
    }
    function ws(e, t, n) {
      if (
        ((t = os(e, t, xs)[0]),
        (e = as(is)[0]),
        typeof t == `object` && t && typeof t.then == `function`)
      )
        try {
          var r = ts(t);
        } catch (e) {
          throw e === Ba ? Ha : e;
        }
      else r = t;
      t = $o();
      var i = t.queue,
        a = i.dispatch;
      return (
        n !== t.memoizedState &&
          ((X.flags |= 2048),
          Ds(9, { destroy: void 0 }, Ts.bind(null, i, n), null)),
        [r, a, e]
      );
    }
    function Ts(e, t) {
      e.action = t;
    }
    function Es(e) {
      var t = $o(),
        n = Po;
      if (n !== null) return ws(t, n, e);
      ($o(), (t = t.memoizedState), (n = $o()));
      var r = n.queue.dispatch;
      return ((n.memoizedState = e), [t, r, !1]);
    }
    function Ds(e, t, n, r) {
      return (
        (e = { tag: e, create: n, deps: r, inst: t, next: null }),
        (t = X.updateQueue),
        t === null && ((t = es()), (X.updateQueue = t)),
        (n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e)),
        e
      );
    }
    function Os() {
      return $o().memoizedState;
    }
    function ks(e, t, n, r) {
      var i = Qo();
      ((X.flags |= e),
        (i.memoizedState = Ds(
          1 | t,
          { destroy: void 0 },
          n,
          r === void 0 ? null : r,
        )));
    }
    function As(e, t, n, r) {
      var i = $o();
      r = r === void 0 ? null : r;
      var a = i.memoizedState.inst;
      Po !== null && r !== null && Wo(r, Po.memoizedState.deps)
        ? (i.memoizedState = Ds(t, a, n, r))
        : ((X.flags |= e), (i.memoizedState = Ds(1 | t, a, n, r)));
    }
    function js(e, t) {
      ks(8390656, 8, e, t);
    }
    function Ms(e, t) {
      As(2048, 8, e, t);
    }
    function Ns(e) {
      X.flags |= 4;
      var t = X.updateQueue;
      if (t === null) ((t = es()), (X.updateQueue = t), (t.events = [e]));
      else {
        var n = t.events;
        n === null ? (t.events = [e]) : n.push(e);
      }
    }
    function Ps(e) {
      var t = $o().memoizedState;
      return (
        Ns({ ref: t, nextImpl: e }),
        function () {
          if (Ku & 2) throw Error(s(440));
          return t.impl.apply(void 0, arguments);
        }
      );
    }
    function Fs(e, t) {
      return As(4, 2, e, t);
    }
    function Is(e, t) {
      return As(4, 4, e, t);
    }
    function Ls(e, t) {
      if (typeof t == `function`) {
        e = e();
        var n = t(e);
        return function () {
          typeof n == `function` ? n() : t(null);
        };
      }
      if (t != null)
        return (
          (e = e()),
          (t.current = e),
          function () {
            t.current = null;
          }
        );
    }
    function Rs(e, t, n) {
      ((n = n == null ? null : n.concat([e])),
        As(4, 4, Ls.bind(null, t, e), n));
    }
    function zs() {}
    function Bs(e, t) {
      var n = $o();
      t = t === void 0 ? null : t;
      var r = n.memoizedState;
      return t !== null && Wo(t, r[1]) ? r[0] : ((n.memoizedState = [e, t]), e);
    }
    function Vs(e, t) {
      var n = $o();
      t = t === void 0 ? null : t;
      var r = n.memoizedState;
      if (t !== null && Wo(t, r[1])) return r[0];
      if (((r = e()), Ro)) {
        Ge(!0);
        try {
          e();
        } finally {
          Ge(!1);
        }
      }
      return ((n.memoizedState = [r, t]), r);
    }
    function Hs(e, t, n) {
      return n === void 0 || (No & 1073741824 && !(Yu & 261930))
        ? (e.memoizedState = t)
        : ((e.memoizedState = n), (e = kd()), (X.lanes |= e), (rd |= e), n);
    }
    function Us(e, t, n, r) {
      return Fr(n, t)
        ? n
        : _o.current === null
          ? !(No & 106) || (No & 1073741824 && !(Yu & 261930))
            ? ((Cc = !0), (e.memoizedState = n))
            : ((e = kd()), (X.lanes |= e), (rd |= e), t)
          : ((e = Hs(e, n, r)), Fr(e, t) || (Cc = !0), e);
    }
    function Ws(e, t, n, r, i) {
      var a = V.p;
      V.p = a !== 0 && 8 > a ? a : 8;
      var o = B.T,
        s = {};
      ((s.types = o === null ? null : o.types), (B.T = s), tc(e, !1, t, n));
      try {
        var c = i(),
          l = B.S;
        (l !== null && l(s, c),
          typeof c == `object` && c && typeof c.then == `function`
            ? Q(e, t, Pa(c, r), Od(e))
            : Q(e, t, r, Od(e)));
      } catch (n) {
        Q(e, t, { then: function () {}, status: `rejected`, reason: n }, Od());
      } finally {
        ((V.p = a),
          o !== null && s.types !== null && (o.types = s.types),
          (B.T = o));
      }
    }
    function Gs() {}
    function Ks(e, t, n, r) {
      if (e.tag !== 5) throw Error(s(476));
      var i = qs(e).queue;
      Ws(
        e,
        i,
        t,
        de,
        n === null
          ? Gs
          : function () {
              return (Js(e), n(r));
            },
      );
    }
    function qs(e) {
      var t = e.memoizedState;
      if (t !== null) return t;
      t = {
        memoizedState: de,
        baseState: de,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: is,
          lastRenderedState: de,
        },
        next: null,
      };
      var n = {};
      return (
        (t.next = {
          memoizedState: n,
          baseState: n,
          baseQueue: null,
          queue: {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: is,
            lastRenderedState: n,
          },
          next: null,
        }),
        (e.memoizedState = t),
        (e = e.alternate),
        e !== null && (e.memoizedState = t),
        t
      );
    }
    function Js(e) {
      var t = qs(e);
      (t.next === null && (t = e.alternate.memoizedState),
        Q(e, t.next.queue, {}, Od()));
    }
    function Ys() {
      return va(sh);
    }
    function Xs() {
      return $o().memoizedState;
    }
    function Zs() {
      return $o().memoizedState;
    }
    function Qs(e) {
      for (var t = e.return; t !== null;) {
        switch (t.tag) {
          case 24:
          case 3:
            var n = Od();
            e = so(n);
            var r = co(t, e, n);
            (r !== null && (jd(r, t, n), lo(r, t, n)),
              (t = { cache: Ta() }),
              (e.payload = t));
            return;
        }
        t = t.return;
      }
    }
    function $s(e, t, n) {
      var r = Od();
      ((n = {
        lane: r,
        revertLane: 0,
        gesture: null,
        action: n,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
        nc(e)
          ? rc(t, n)
          : ((n = bi(e, t, n, r)), n !== null && (jd(n, e, r), ic(n, t, r))));
    }
    function ec(e, t, n) {
      Q(e, t, n, Od());
    }
    function Q(e, t, n, r) {
      var i = {
        lane: r,
        revertLane: 0,
        gesture: null,
        action: n,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      };
      if (nc(e)) rc(t, i);
      else {
        var a = e.alternate;
        if (
          e.lanes === 0 &&
          (a === null || a.lanes === 0) &&
          ((a = t.lastRenderedReducer), a !== null)
        )
          try {
            var o = t.lastRenderedState,
              s = a(o, n);
            if (((i.hasEagerState = !0), (i.eagerState = s), Fr(s, o)))
              return (yi(e, t, i, 0), qu === null && vi(), !1);
          } catch {}
        if (((n = bi(e, t, i, r)), n !== null))
          return (jd(n, e, r), ic(n, t, r), !0);
      }
      return !1;
    }
    function tc(e, t, n, r) {
      if (
        ((r = {
          lane: 2,
          revertLane: Mf(),
          gesture: null,
          action: r,
          hasEagerState: !1,
          eagerState: null,
          next: null,
        }),
        nc(e))
      ) {
        if (t) throw Error(s(479));
      } else ((t = bi(e, n, r, 2)), t !== null && jd(t, e, 2));
    }
    function nc(e) {
      var t = e.alternate;
      return e === X || (t !== null && t === X);
    }
    function rc(e, t) {
      Lo = Io = !0;
      var n = e.pending;
      (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
        (e.pending = t));
    }
    function ic(e, t, n) {
      if (n & 4194048) {
        var r = t.lanes;
        ((r &= e.pendingLanes), (n |= r), (t.lanes = n), lt(e, n));
      }
    }
    var ac = {
        readContext: va,
        use: ns,
        useCallback: Uo,
        useContext: Uo,
        useEffect: Uo,
        useImperativeHandle: Uo,
        useLayoutEffect: Uo,
        useInsertionEffect: Uo,
        useMemo: Uo,
        useReducer: Uo,
        useRef: Uo,
        useState: Uo,
        useDebugValue: Uo,
        useDeferredValue: Uo,
        useTransition: Uo,
        useSyncExternalStore: Uo,
        useId: Uo,
        useHostTransitionStatus: Uo,
        useFormState: Uo,
        useActionState: Uo,
        useOptimistic: Uo,
        useMemoCache: Uo,
        useCacheRefresh: Uo,
        useEffectEvent: Uo,
      },
      oc = {
        readContext: va,
        use: ns,
        useCallback: function (e, t) {
          return ((Qo().memoizedState = [e, t === void 0 ? null : t]), e);
        },
        useContext: va,
        useEffect: js,
        useImperativeHandle: function (e, t, n) {
          ((n = n == null ? null : n.concat([e])),
            ks(4194308, 4, Ls.bind(null, t, e), n));
        },
        useLayoutEffect: function (e, t) {
          return ks(4194308, 4, e, t);
        },
        useInsertionEffect: function (e, t) {
          ks(4, 2, e, t);
        },
        useMemo: function (e, t) {
          var n = Qo();
          t = t === void 0 ? null : t;
          var r = e();
          if (Ro) {
            Ge(!0);
            try {
              e();
            } finally {
              Ge(!1);
            }
          }
          return ((n.memoizedState = [r, t]), r);
        },
        useReducer: function (e, t, n) {
          var r = Qo();
          if (n !== void 0) {
            var i = n(t);
            if (Ro) {
              Ge(!0);
              try {
                n(t);
              } finally {
                Ge(!1);
              }
            }
          } else i = t;
          return (
            (r.memoizedState = r.baseState = i),
            (e = {
              pending: null,
              lanes: 0,
              dispatch: null,
              lastRenderedReducer: e,
              lastRenderedState: i,
            }),
            (r.queue = e),
            (e = e.dispatch = $s.bind(null, X, e)),
            [r.memoizedState, e]
          );
        },
        useRef: function (e) {
          var t = Qo();
          return ((e = { current: e }), (t.memoizedState = e));
        },
        useState: function (e) {
          e = Z(e);
          var t = e.queue,
            n = ec.bind(null, X, t);
          return ((t.dispatch = n), [e.memoizedState, n]);
        },
        useDebugValue: zs,
        useDeferredValue: function (e, t) {
          return Hs(Qo(), e, t);
        },
        useTransition: function () {
          var e = Z(!1);
          return (
            (e = Ws.bind(null, X, e.queue, !0, !1)),
            (Qo().memoizedState = e),
            [!1, e]
          );
        },
        useSyncExternalStore: function (e, t, n) {
          var r = X,
            i = Qo();
          if (K) {
            if (n === void 0) throw Error(s(407));
            n = n();
          } else {
            if (((n = t()), qu === null)) throw Error(s(349));
            Yu & 127 || ls(r, t, n);
          }
          i.memoizedState = n;
          var a = { value: n, getSnapshot: t };
          return (
            (i.queue = a),
            js(ds.bind(null, r, a, e), [e]),
            (r.flags |= 2048),
            Ds(9, { destroy: void 0 }, us.bind(null, r, a, n, t), null),
            n
          );
        },
        useId: function () {
          var e = Qo(),
            t = qu.identifierPrefix;
          if (K) {
            var n = Gi,
              r = Wi;
            ((n = (r & ~(1 << (32 - Ke(r) - 1))).toString(32) + n),
              (t = `_` + t + `R_` + n),
              (n = zo++),
              0 < n && (t += `H` + n.toString(32)),
              (t += `_`));
          } else ((n = Ho++), (t = `_` + t + `r_` + n.toString(32) + `_`));
          return (e.memoizedState = t);
        },
        useHostTransitionStatus: Ys,
        useFormState: Ss,
        useActionState: Ss,
        useOptimistic: function (e) {
          var t = Qo();
          t.memoizedState = t.baseState = e;
          var n = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: null,
            lastRenderedState: null,
          };
          return (
            (t.queue = n),
            (t = tc.bind(null, X, !0, n)),
            (n.dispatch = t),
            [e, t]
          );
        },
        useMemoCache: rs,
        useCacheRefresh: function () {
          return (Qo().memoizedState = Qs.bind(null, X));
        },
        useEffectEvent: function (e) {
          var t = Qo(),
            n = { impl: e };
          return (
            (t.memoizedState = n),
            function () {
              if (Ku & 2) throw Error(s(440));
              return n.impl.apply(void 0, arguments);
            }
          );
        },
      },
      sc = {
        readContext: va,
        use: ns,
        useCallback: Bs,
        useContext: va,
        useEffect: Ms,
        useImperativeHandle: Rs,
        useInsertionEffect: Fs,
        useLayoutEffect: Is,
        useMemo: Vs,
        useReducer: as,
        useRef: Os,
        useState: function () {
          return as(is);
        },
        useDebugValue: zs,
        useDeferredValue: function (e, t) {
          return Us($o(), Po.memoizedState, e, t);
        },
        useTransition: function () {
          var e = as(is)[0],
            t = $o().memoizedState;
          return [typeof e == `boolean` ? e : ts(e), t];
        },
        useSyncExternalStore: cs,
        useId: Xs,
        useHostTransitionStatus: Ys,
        useFormState: Cs,
        useActionState: Cs,
        useOptimistic: function (e, t) {
          return ms($o(), Po, e, t);
        },
        useMemoCache: rs,
        useCacheRefresh: Zs,
        useEffectEvent: Ps,
      },
      cc = {
        readContext: va,
        use: ns,
        useCallback: Bs,
        useContext: va,
        useEffect: Ms,
        useImperativeHandle: Rs,
        useInsertionEffect: Fs,
        useLayoutEffect: Is,
        useMemo: Vs,
        useReducer: ss,
        useRef: Os,
        useState: function () {
          return ss(is);
        },
        useDebugValue: zs,
        useDeferredValue: function (e, t) {
          var n = $o();
          return Po === null ? Hs(n, e, t) : Us(n, Po.memoizedState, e, t);
        },
        useTransition: function () {
          var e = ss(is)[0],
            t = $o().memoizedState;
          return [typeof e == `boolean` ? e : ts(e), t];
        },
        useSyncExternalStore: cs,
        useId: Xs,
        useHostTransitionStatus: Ys,
        useFormState: Es,
        useActionState: Es,
        useOptimistic: function (e, t) {
          var n = $o();
          return Po === null
            ? ((n.baseState = e), [e, n.queue.dispatch])
            : ms(n, Po, e, t);
        },
        useMemoCache: rs,
        useCacheRefresh: Zs,
        useEffectEvent: Ps,
      };
    function lc(e, t, n, r) {
      ((t = e.memoizedState),
        (n = n(r, t)),
        (n = n == null ? t : D({}, t, n)),
        (e.memoizedState = n),
        e.lanes === 0 && (e.updateQueue.baseState = n));
    }
    var uc = {
      enqueueSetState: function (e, t, n) {
        e = e._reactInternals;
        var r = Od(),
          i = so(r);
        ((i.payload = t),
          n != null && (i.callback = n),
          (t = co(e, i, r)),
          t !== null && (jd(t, e, r), lo(t, e, r)));
      },
      enqueueReplaceState: function (e, t, n) {
        e = e._reactInternals;
        var r = Od(),
          i = so(r);
        ((i.tag = 1),
          (i.payload = t),
          n != null && (i.callback = n),
          (t = co(e, i, r)),
          t !== null && (jd(t, e, r), lo(t, e, r)));
      },
      enqueueForceUpdate: function (e, t) {
        e = e._reactInternals;
        var n = Od(),
          r = so(n);
        ((r.tag = 2),
          t != null && (r.callback = t),
          (t = co(e, r, n)),
          t !== null && (jd(t, e, n), lo(t, e, n)));
      },
    };
    function $(e, t, n, r, i, a, o) {
      return (
        (e = e.stateNode),
        typeof e.shouldComponentUpdate == `function`
          ? e.shouldComponentUpdate(r, a, o)
          : t.prototype && t.prototype.isPureReactComponent
            ? !Ir(n, r) || !Ir(i, a)
            : !0
      );
    }
    function dc(e, t, n, r) {
      ((e = t.state),
        typeof t.componentWillReceiveProps == `function` &&
          t.componentWillReceiveProps(n, r),
        typeof t.UNSAFE_componentWillReceiveProps == `function` &&
          t.UNSAFE_componentWillReceiveProps(n, r),
        t.state !== e && uc.enqueueReplaceState(t, t.state, null));
    }
    function fc(e, t) {
      var n = t;
      if (`ref` in t) for (var r in ((n = {}), t)) r !== `ref` && (n[r] = t[r]);
      if ((e = e.defaultProps))
        for (var i in (n === t && (n = D({}, n)), e))
          n[i] === void 0 && (n[i] = e[i]);
      return n;
    }
    function pc(e) {
      mi(e);
    }
    function mc(e) {
      console.error(e);
    }
    function hc(e) {
      mi(e);
    }
    function gc(e, t) {
      try {
        var n = e.onUncaughtError;
        n(t.value, { componentStack: t.stack });
      } catch (e) {
        setTimeout(function () {
          throw e;
        });
      }
    }
    function _c(e, t, n) {
      try {
        var r = e.onCaughtError;
        r(n.value, {
          componentStack: n.stack,
          errorBoundary: t.tag === 1 ? t.stateNode : null,
        });
      } catch (e) {
        setTimeout(function () {
          throw e;
        });
      }
    }
    function vc(e, t, n) {
      return (
        (n = so(n)),
        (n.tag = 3),
        (n.payload = { element: null }),
        (n.callback = function () {
          gc(e, t);
        }),
        n
      );
    }
    function yc(e) {
      return ((e = so(e)), (e.tag = 3), e);
    }
    function bc(e, t, n, r) {
      var i = n.type.getDerivedStateFromError;
      if (typeof i == `function`) {
        var a = r.value;
        ((e.payload = function () {
          return i(a);
        }),
          (e.callback = function () {
            _c(t, n, r);
          }));
      }
      var o = n.stateNode;
      o !== null &&
        typeof o.componentDidCatch == `function` &&
        (e.callback = function () {
          (_c(t, n, r),
            typeof i != `function` &&
              (hd === null ? (hd = new Set([this])) : hd.add(this)));
          var e = r.stack;
          this.componentDidCatch(r.value, {
            componentStack: e === null ? `` : e,
          });
        });
    }
    function xc(e, t, n, r, i) {
      if (
        ((n.flags |= 32768),
        typeof r == `object` && r && typeof r.then == `function`)
      ) {
        if (
          ((t = n.alternate),
          t !== null && ha(t, n, i, !0),
          (n = So.current),
          n !== null)
        ) {
          switch (n.tag) {
            case 31:
            case 13:
            case 19:
              return (
                Co === null
                  ? Ud()
                  : n.alternate === null && nd === 0 && (nd = 3),
                (n.flags &= -257),
                (n.flags |= 65536),
                (n.lanes = i),
                r === Ua
                  ? (n.flags |= 16384)
                  : ((t = n.updateQueue),
                    t === null ? (n.updateQueue = new Set([r])) : t.add(r),
                    ff(e, r, i)),
                !1
              );
            case 22:
              return (
                (n.flags |= 65536),
                r === Ua
                  ? (n.flags |= 16384)
                  : ((t = n.updateQueue),
                    t === null
                      ? ((t = {
                          transitions: null,
                          markerInstances: null,
                          retryQueue: new Set([r]),
                        }),
                        (n.updateQueue = t))
                      : ((n = t.retryQueue),
                        n === null ? (t.retryQueue = new Set([r])) : n.add(r)),
                    ff(e, r, i)),
                !1
              );
          }
          throw Error(s(435, n.tag));
        }
        return (ff(e, r, i), Ud(), !1);
      }
      if (K)
        return (
          (t = So.current),
          t === null
            ? (r !== ta && ((t = Error(s(423), { cause: r })), sa(Ii(t, n))),
              (e = e.current.alternate),
              (e.flags |= 65536),
              (i &= -i),
              (e.lanes |= i),
              (r = Ii(r, n)),
              (i = vc(e.stateNode, r, i)),
              uo(e, i),
              nd !== 4 && (nd = 2))
            : (!(t.flags & 65536) && (t.flags |= 256),
              (t.flags |= 65536),
              (t.lanes = i),
              r !== ta && ((e = Error(s(422), { cause: r })), sa(Ii(e, n)))),
          !1
        );
      var a = Error(s(520), { cause: r });
      if (
        ((a = Ii(a, n)),
        cd === null ? (cd = [a]) : cd.push(a),
        nd !== 4 && (nd = 2),
        t === null)
      )
        return !0;
      ((r = Ii(r, n)), (n = t));
      do {
        switch (n.tag) {
          case 3:
            return (
              (n.flags |= 65536),
              (e = i & -i),
              (n.lanes |= e),
              (e = vc(n.stateNode, r, e)),
              uo(n, e),
              !1
            );
          case 1:
            if (
              ((t = n.type),
              (a = n.stateNode),
              !(n.flags & 128) &&
                (typeof t.getDerivedStateFromError == `function` ||
                  (a !== null &&
                    typeof a.componentDidCatch == `function` &&
                    (hd === null || !hd.has(a)))))
            )
              return (
                (n.flags |= 65536),
                (i &= -i),
                (n.lanes |= i),
                (i = yc(i)),
                bc(i, e, n, r),
                uo(n, i),
                !1
              );
            break;
          case 22:
            if (n.memoizedState !== null) return ((n.flags |= 65536), !1);
        }
        n = n.return;
      } while (n !== null);
      return !1;
    }
    var Sc = Error(s(461)),
      Cc = !1;
    function wc(e, t, n, r) {
      t.child = e === null ? ro(t, null, n, r) : no(t, e.child, n, r);
    }
    function Tc(e, t, n, r, i) {
      n = n.render;
      var a = t.ref;
      if (`ref` in r) {
        var o = {};
        for (var s in r) s !== `ref` && (o[s] = r[s]);
      } else o = r;
      return (
        _a(t),
        (r = Go(e, t, n, o, a, i)),
        (s = Yo()),
        e !== null && !Cc
          ? (Xo(e, t, i), $c(e, t, i))
          : (K && s && Ji(t), (t.flags |= 1), wc(e, t, r, i), t.child)
      );
    }
    function Ec(e, t, n, r, i) {
      if (e === null) {
        var a = n.type;
        return typeof a == `function` &&
          !Di(a) &&
          a.defaultProps === void 0 &&
          n.compare === null
          ? ((t.tag = 15), (t.type = a), Dc(e, t, a, r, i))
          : ((e = Ai(n.type, null, r, t, t.mode, i)),
            (e.ref = t.ref),
            (e.return = t),
            (t.child = e));
      }
      if (((a = e.child), !el(e, i))) {
        var o = a.memoizedProps;
        if (
          ((n = n.compare),
          (n = n === null ? Ir : n),
          n(o, r) && e.ref === t.ref)
        )
          return $c(e, t, i);
      }
      return (
        (t.flags |= 1),
        (e = Oi(a, r)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e)
      );
    }
    function Dc(e, t, n, r, i) {
      if (e !== null) {
        var a = e.memoizedProps;
        if (Ir(a, r) && e.ref === t.ref) {
          if (((Cc = !1), (t.pendingProps = r = a), el(e, i)))
            e.flags & 131072 && (Cc = !0);
          else return ((t.lanes = e.lanes), $c(e, t, i));
        }
      }
      return Fc(e, t, n, r, i);
    }
    function Oc(e, t, n, r) {
      var i = r.children,
        a = e === null ? null : e.memoizedState;
      if (
        (e === null &&
          t.stateNode === null &&
          (t.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        r.mode === `hidden`)
      ) {
        if (t.flags & 128) {
          if (((a = a === null ? n : a.baseLanes | n), e !== null)) {
            for (r = t.child = e.child, i = 0; r !== null;)
              ((i = i | r.lanes | r.childLanes), (r = r.sibling));
            r = i & ~a;
          } else ((r = 0), (t.child = null));
          return Ac(e, t, a, n, r);
        }
        if (n & 536870912)
          ((t.memoizedState = { baseLanes: 0, cachePool: null }),
            e !== null && Ra(t, a === null ? null : a.cachePool),
            a === null ? bo() : yo(t, a),
            Eo(t));
        else
          return (
            (r = t.lanes = 536870912),
            Ac(e, t, a === null ? n : a.baseLanes | n, n, r)
          );
      } else
        a === null
          ? (e !== null && Ra(t, null), bo(), Do())
          : (Ra(t, a.cachePool), yo(t, a), Do(), (t.memoizedState = null));
      return (wc(e, t, i, n), t.child);
    }
    function kc(e, t) {
      return (
        (e !== null && e.tag === 22) ||
          t.stateNode !== null ||
          (t.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        t.sibling
      );
    }
    function Ac(e, t, n, r, i) {
      var a = La();
      return (
        (a = a === null ? null : { parent: wa._currentValue, pool: a }),
        (t.memoizedState = { baseLanes: n, cachePool: a }),
        e !== null && Ra(t, null),
        bo(),
        Eo(t),
        e !== null && ha(e, t, r, !0),
        (t.childLanes = i),
        null
      );
    }
    function jc(e, t) {
      return (
        (t = Wc({ mode: t.mode, children: t.children }, e.mode)),
        (t.ref = e.ref),
        (e.child = t),
        (t.return = e),
        t
      );
    }
    function Mc(e, t, n) {
      return (
        no(t, e.child, null, n),
        (e = jc(t, t.pendingProps)),
        (e.flags |= 2),
        Oo(t),
        (t.memoizedState = null),
        e
      );
    }
    function Nc(e, t, n) {
      var r = t.pendingProps,
        i = !!(t.flags & 128);
      if (((t.flags &= -129), e === null)) {
        if (K) {
          if (r.mode === `hidden`)
            return (
              (e = jc(t, r)),
              (t.lanes = 536870912),
              (e.memoizedState = { baseLanes: 0, cachePool: null }),
              kc(null, e)
            );
          if (
            (To(t),
            (e = Qi)
              ? ((e = am(e, ea)),
                (e = e !== null && e.data === `&` ? e : null),
                e !== null &&
                  ((t.memoizedState = {
                    dehydrated: e,
                    treeContext: Ui === null ? null : { id: Wi, overflow: Gi },
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (n = Ni(e)),
                  (n.return = t),
                  (t.child = n),
                  (Zi = t),
                  (Qi = null)))
              : (e = null),
            e === null)
          )
            throw na(t);
          return ((t.lanes = 536870912), null);
        }
        return jc(t, r);
      }
      var a = e.memoizedState;
      if (a !== null) {
        var o = a.dehydrated;
        if ((To(t), i)) {
          if (t.flags & 256) ((t.flags &= -257), (t = Mc(e, t, n)));
          else if (t.memoizedState !== null)
            ((t.child = e.child), (t.flags |= 128), (t = null));
          else throw Error(s(558));
        } else if (
          (Cc || ha(e, t, n, !1), (i = (n & e.childLanes) !== 0), Cc || i)
        ) {
          if (_o.current === null) {
            if (
              ((r = qu),
              r !== null && ((o = ut(r, n)), o !== 0 && o !== a.retryLane))
            )
              throw ((a.retryLane = o), xi(e, o), jd(r, e, o), Sc);
            Ud();
          }
          t = Mc(e, t, n);
        } else
          ((e = a.treeContext),
            (Qi = lm(o.nextSibling)),
            (Zi = t),
            (K = !0),
            ($i = null),
            (ea = !1),
            e !== null && Xi(t, e),
            (t = jc(t, r)),
            (t.flags |= 134221824));
        return t;
      }
      return (
        (e = Oi(e.child, { mode: r.mode, children: r.children })),
        (e.ref = t.ref),
        (t.child = e),
        (e.return = t),
        e
      );
    }
    function Pc(e, t) {
      var n = t.ref;
      if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
      else {
        if (typeof n != `function` && typeof n != `object`) throw Error(s(284));
        (e === null || e.ref !== n) && (t.flags |= 4194816);
      }
    }
    function Fc(e, t, n, r, i) {
      return (
        _a(t),
        (n = Go(e, t, n, r, void 0, i)),
        (r = Yo()),
        e !== null && !Cc
          ? (Xo(e, t, i), $c(e, t, i))
          : (K && r && Ji(t), (t.flags |= 1), wc(e, t, n, i), t.child)
      );
    }
    function Ic(e, t, n, r, i, a) {
      return (
        _a(t),
        (t.updateQueue = null),
        (n = qo(t, r, n, i)),
        Ko(e),
        (r = Yo()),
        e !== null && !Cc
          ? (Xo(e, t, a), $c(e, t, a))
          : (K && r && Ji(t), (t.flags |= 1), wc(e, t, n, a), t.child)
      );
    }
    function Lc(e, t, n, r, i) {
      if ((_a(t), t.stateNode === null)) {
        var a = wi,
          o = n.contextType;
        (typeof o == `object` && o && (a = va(o)),
          (a = new n(r, a)),
          (t.memoizedState =
            a.state !== null && a.state !== void 0 ? a.state : null),
          (a.updater = uc),
          (t.stateNode = a),
          (a._reactInternals = t),
          (a = t.stateNode),
          (a.props = r),
          (a.state = t.memoizedState),
          (a.refs = {}),
          ao(t),
          (o = n.contextType),
          (a.context = typeof o == `object` && o ? va(o) : wi),
          (a.state = t.memoizedState),
          (o = n.getDerivedStateFromProps),
          typeof o == `function` &&
            (lc(t, n, o, r), (a.state = t.memoizedState)),
          typeof n.getDerivedStateFromProps == `function` ||
            typeof a.getSnapshotBeforeUpdate == `function` ||
            (typeof a.UNSAFE_componentWillMount != `function` &&
              typeof a.componentWillMount != `function`) ||
            ((o = a.state),
            typeof a.componentWillMount == `function` && a.componentWillMount(),
            typeof a.UNSAFE_componentWillMount == `function` &&
              a.UNSAFE_componentWillMount(),
            o !== a.state && uc.enqueueReplaceState(a, a.state, null),
            mo(t, r, a, i),
            po(),
            (a.state = t.memoizedState)),
          typeof a.componentDidMount == `function` && (t.flags |= 4194308),
          (r = !0));
      } else if (e === null) {
        a = t.stateNode;
        var s = t.memoizedProps,
          c = fc(n, s);
        a.props = c;
        var l = a.context,
          u = n.contextType;
        ((o = wi), typeof u == `object` && u && (o = va(u)));
        var d = n.getDerivedStateFromProps;
        ((u =
          typeof d == `function` ||
          typeof a.getSnapshotBeforeUpdate == `function`),
          (s = t.pendingProps !== s),
          u ||
            (typeof a.UNSAFE_componentWillReceiveProps != `function` &&
              typeof a.componentWillReceiveProps != `function`) ||
            ((s || l !== o) && dc(t, a, r, o)),
          (io = !1));
        var f = t.memoizedState;
        ((a.state = f),
          mo(t, r, a, i),
          po(),
          (l = t.memoizedState),
          s || f !== l || io
            ? (typeof d == `function` &&
                (lc(t, n, d, r), (l = t.memoizedState)),
              (c = io || $(t, n, c, r, f, l, o))
                ? (u ||
                    (typeof a.UNSAFE_componentWillMount != `function` &&
                      typeof a.componentWillMount != `function`) ||
                    (typeof a.componentWillMount == `function` &&
                      a.componentWillMount(),
                    typeof a.UNSAFE_componentWillMount == `function` &&
                      a.UNSAFE_componentWillMount()),
                  typeof a.componentDidMount == `function` &&
                    (t.flags |= 4194308))
                : (typeof a.componentDidMount == `function` &&
                    (t.flags |= 4194308),
                  (t.memoizedProps = r),
                  (t.memoizedState = l)),
              (a.props = r),
              (a.state = l),
              (a.context = o),
              (r = c))
            : (typeof a.componentDidMount == `function` && (t.flags |= 4194308),
              (r = !1)));
      } else {
        ((a = t.stateNode),
          oo(e, t),
          (o = t.memoizedProps),
          (u = fc(n, o)),
          (a.props = u),
          (d = t.pendingProps),
          (f = a.context),
          (l = n.contextType),
          (c = wi),
          typeof l == `object` && l && (c = va(l)),
          (s = n.getDerivedStateFromProps),
          (l =
            typeof s == `function` ||
            typeof a.getSnapshotBeforeUpdate == `function`) ||
            (typeof a.UNSAFE_componentWillReceiveProps != `function` &&
              typeof a.componentWillReceiveProps != `function`) ||
            ((o !== d || f !== c) && dc(t, a, r, c)),
          (io = !1),
          (f = t.memoizedState),
          (a.state = f),
          mo(t, r, a, i),
          po());
        var p = t.memoizedState;
        o !== d ||
        f !== p ||
        io ||
        (e !== null && e.dependencies !== null && ga(e.dependencies))
          ? (typeof s == `function` && (lc(t, n, s, r), (p = t.memoizedState)),
            (u =
              io ||
              $(t, n, u, r, f, p, c) ||
              (e !== null && e.dependencies !== null && ga(e.dependencies)))
              ? (l ||
                  (typeof a.UNSAFE_componentWillUpdate != `function` &&
                    typeof a.componentWillUpdate != `function`) ||
                  (typeof a.componentWillUpdate == `function` &&
                    a.componentWillUpdate(r, p, c),
                  typeof a.UNSAFE_componentWillUpdate == `function` &&
                    a.UNSAFE_componentWillUpdate(r, p, c)),
                typeof a.componentDidUpdate == `function` && (t.flags |= 4),
                typeof a.getSnapshotBeforeUpdate == `function` &&
                  (t.flags |= 1024))
              : (typeof a.componentDidUpdate != `function` ||
                  (o === e.memoizedProps && f === e.memoizedState) ||
                  (t.flags |= 4),
                typeof a.getSnapshotBeforeUpdate != `function` ||
                  (o === e.memoizedProps && f === e.memoizedState) ||
                  (t.flags |= 1024),
                (t.memoizedProps = r),
                (t.memoizedState = p)),
            (a.props = r),
            (a.state = p),
            (a.context = c),
            (r = u))
          : (typeof a.componentDidUpdate != `function` ||
              (o === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 4),
            typeof a.getSnapshotBeforeUpdate != `function` ||
              (o === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 1024),
            (r = !1));
      }
      return (
        (a = r),
        Pc(e, t),
        (r = !!(t.flags & 128)),
        a || r
          ? ((a = t.stateNode),
            (n =
              r && typeof n.getDerivedStateFromError != `function`
                ? null
                : a.render()),
            (t.flags |= 1),
            e !== null && r
              ? ((t.child = no(t, e.child, null, i)),
                (t.child = no(t, null, n, i)))
              : wc(e, t, n, i),
            (t.memoizedState = a.state),
            (e = t.child))
          : (e = $c(e, t, i)),
        e
      );
    }
    function Rc(e, t, n, r) {
      return (aa(), (t.flags |= 256), wc(e, t, n, r), t.child);
    }
    var zc = {
      dehydrated: null,
      treeContext: null,
      retryLane: 0,
      hydrationErrors: null,
    };
    function Bc(e) {
      return { baseLanes: e, cachePool: za() };
    }
    function Vc(e, t, n) {
      return ((e = e === null ? 0 : e.childLanes & ~n), t && (e |= od), e);
    }
    function Hc(e, t, n) {
      var r = t.pendingProps,
        i = !1,
        a = !!(t.flags & 128),
        o;
      if (
        ((o = a) ||
          (o =
            e !== null && e.memoizedState === null ? !1 : !!(ko.current & 2)),
        o && ((i = !0), (t.flags &= -129)),
        (o = !!(t.flags & 32)),
        (t.flags &= -33),
        e === null)
      ) {
        if (K) {
          if (
            (i ? wo(t) : Do(),
            (e = Qi)
              ? ((e = am(e, ea)),
                (e = e !== null && e.data !== `&` ? e : null),
                e !== null &&
                  ((t.memoizedState = {
                    dehydrated: e,
                    treeContext: Ui === null ? null : { id: Wi, overflow: Gi },
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (n = Ni(e)),
                  (n.return = t),
                  (t.child = n),
                  (Zi = t),
                  (Qi = null)))
              : (e = null),
            e === null)
          )
            throw na(t);
          return ((t.lanes = sm(e) ? 32 : 536870912), null);
        }
        return (
          (a = r.children),
          (r = r.fallback),
          i
            ? (Do(),
              (i = t.mode),
              (a = Wc({ mode: `hidden`, children: a }, i)),
              (r = ji(r, i, n, null)),
              (a.return = t),
              (r.return = t),
              (a.sibling = r),
              (t.child = a),
              (r = t.child),
              (r.memoizedState = Bc(n)),
              (r.childLanes = Vc(e, o, n)),
              (t.memoizedState = zc),
              kc(null, r))
            : (wo(t), Uc(t, a))
        );
      }
      var s = e.memoizedState;
      if (s !== null) {
        var c = s.dehydrated;
        if (c !== null) return Kc(e, t, a, o, r, c, s, n);
      }
      return i
        ? (Do(),
          (i = r.fallback),
          (a = t.mode),
          (s = e.child),
          (c = s.sibling),
          (r = Oi(s, { mode: `hidden`, children: r.children })),
          (r.subtreeFlags = s.subtreeFlags & 1206910976),
          c === null
            ? ((i = ji(i, a, n, null)), (i.flags |= 2))
            : (i = Oi(c, i)),
          (i.return = t),
          (r.return = t),
          (r.sibling = i),
          (t.child = r),
          kc(null, r),
          (r = t.child),
          (i = e.child.memoizedState),
          i === null
            ? (i = Bc(n))
            : ((a = i.cachePool),
              a === null
                ? (a = za())
                : ((s = wa._currentValue),
                  (a = a.parent === s ? a : { parent: s, pool: s })),
              (i = { baseLanes: i.baseLanes | n, cachePool: a })),
          (r.memoizedState = i),
          (r.childLanes = Vc(e, o, n)),
          (t.memoizedState = zc),
          kc(e.child, r))
        : (wo(t),
          (n = e.child),
          (e = n.sibling),
          (n = Oi(n, { mode: `visible`, children: r.children })),
          (n.return = t),
          (n.sibling = null),
          e !== null &&
            ((o = t.deletions),
            o === null ? ((t.deletions = [e]), (t.flags |= 16)) : o.push(e)),
          (t.child = n),
          (t.memoizedState = null),
          n);
    }
    function Uc(e, t) {
      return (
        (t = Wc({ mode: `visible`, children: t }, e.mode)),
        (t.return = e),
        (e.child = t)
      );
    }
    function Wc(e, t) {
      return ((e = Ei(22, e, null, t)), (e.lanes = 0), e);
    }
    function Gc(e, t, n) {
      return (
        no(t, e.child, null, n),
        (e = Uc(t, t.pendingProps.children)),
        (e.flags |= 2),
        (t.memoizedState = null),
        e
      );
    }
    function Kc(e, t, n, r, i, a, o, c) {
      if (n)
        return t.flags & 256
          ? (wo(t), (t.flags &= -257), Gc(e, t, c))
          : t.memoizedState === null
            ? (Do(),
              (a = i.fallback),
              (o = t.mode),
              (i = Wc({ mode: `visible`, children: i.children }, o)),
              (a = ji(a, o, c, null)),
              (a.flags |= 2),
              (i.return = t),
              (a.return = t),
              (i.sibling = a),
              (t.child = i),
              no(t, e.child, null, c),
              (i = t.child),
              (i.memoizedState = Bc(c)),
              (i.childLanes = Vc(e, r, c)),
              (t.memoizedState = zc),
              kc(null, i))
            : (Do(), (t.child = e.child), (t.flags |= 128), null);
      if ((wo(t), sm(a))) {
        if (((r = a.nextSibling && a.nextSibling.dataset), r)) var l = r.dgst;
        return (
          (r = l),
          r !== `` &&
            ((i = Error(s(419))),
            (i.stack = ``),
            (i.digest = r),
            sa({ value: i, source: null, stack: null })),
          Gc(e, t, c)
        );
      }
      if ((Cc || ha(e, t, c, !1), (r = (c & e.childLanes) !== 0), Cc || r)) {
        if (_o.current !== null) return Gc(e, t, c);
        if (
          ((r = qu),
          r !== null && ((i = ut(r, c)), i !== 0 && i !== o.retryLane))
        )
          throw ((o.retryLane = i), xi(e, i), jd(r, e, i), Sc);
        return (om(a) || Ud(), Gc(e, t, c));
      }
      return om(a)
        ? ((t.flags |= 192), (t.child = e.child), null)
        : ((e = o.treeContext),
          (Qi = lm(a.nextSibling)),
          (Zi = t),
          (K = !0),
          ($i = null),
          (ea = !1),
          e !== null && Xi(t, e),
          (t = Uc(t, i.children)),
          (t.flags |= 134221824),
          t);
    }
    function qc(e, t, n) {
      e.lanes |= t;
      var r = e.alternate;
      (r !== null && (r.lanes |= t), pa(e.return, t, n));
    }
    function Jc(e) {
      for (var t = null; e !== null;) {
        var n = e.alternate;
        (n !== null && Mo(n) === null && (t = e), (e = e.sibling));
      }
      return t;
    }
    function Yc(e, t, n, r, i, a) {
      var o = e.memoizedState;
      o === null
        ? (e.memoizedState = {
            isBackwards: t,
            rendering: null,
            renderingStartTime: 0,
            last: r,
            tail: n,
            tailMode: i,
            treeForkCount: a,
          })
        : ((o.isBackwards = t),
          (o.rendering = null),
          (o.renderingStartTime = 0),
          (o.last = r),
          (o.tail = n),
          (o.tailMode = i),
          (o.treeForkCount = a));
    }
    function Xc(e) {
      var t = e.child;
      for (e.child = null; t !== null;) {
        var n = t.sibling;
        ((t.sibling = e.child), (e.child = t), (t = n));
      }
    }
    function Zc(e, t, n) {
      var r = t.pendingProps,
        i = r.revealOrder,
        a = r.tail;
      r = r.children;
      var o = ko.current;
      if (t.flags & 128) return (Ao(t, o), null);
      var s = !!(o & 2);
      if (
        (s ? ((o = (o & 1) | 2), (t.flags |= 128)) : (o &= 1),
        Ao(t, o),
        i === `backwards` && e !== null
          ? (Xc(e), wc(e, t, r, n), Xc(e))
          : wc(e, t, r, n),
        (r = K ? Bi : 0),
        !s && e !== null && e.flags & 128)
      )
        a: for (e = t.child; e !== null;) {
          if (e.tag === 13) e.memoizedState !== null && qc(e, n, t);
          else if (e.tag === 19) qc(e, n, t);
          else if (e.child !== null) {
            ((e.child.return = e), (e = e.child));
            continue;
          }
          if (e === t) break a;
          for (; e.sibling === null;) {
            if (e.return === null || e.return === t) break a;
            e = e.return;
          }
          ((e.sibling.return = e.return), (e = e.sibling));
        }
      switch (i) {
        case `backwards`:
          ((n = Jc(t.child)),
            n === null
              ? ((i = t.child), (t.child = null))
              : ((i = n.sibling), (n.sibling = null), Xc(t)),
            Yc(t, !0, i, null, a, r));
          break;
        case `unstable_legacy-backwards`:
          for (n = null, i = t.child, t.child = null; i !== null;) {
            if (((e = i.alternate), e !== null && Mo(e) === null)) {
              t.child = i;
              break;
            }
            ((e = i.sibling), (i.sibling = n), (n = i), (i = e));
          }
          Yc(t, !0, n, null, a, r);
          break;
        case `together`:
          Yc(t, !1, null, null, void 0, r);
          break;
        case `independent`:
          t.memoizedState = null;
          break;
        default:
          ((n = Jc(t.child)),
            n === null
              ? ((i = t.child), (t.child = null))
              : ((i = n.sibling), (n.sibling = null)),
            Yc(t, !1, i, n, a, r));
      }
      return t.child;
    }
    function Qc(e, t, n) {
      var r = t.pendingProps;
      return (da(t, t.type, r.value), wc(e, t, r.children, n), t.child);
    }
    function $c(e, t, n) {
      if (
        (e !== null && (t.dependencies = e.dependencies),
        (rd |= t.lanes),
        (n & t.childLanes) === 0)
      ) {
        if (e !== null) {
          if ((ha(e, t, n, !1), (n & t.childLanes) === 0)) return null;
        } else return null;
      }
      if (e !== null && t.child !== e.child) throw Error(s(153));
      if (t.child !== null) {
        for (
          e = t.child, n = Oi(e, e.pendingProps), t.child = n, n.return = t;
          e.sibling !== null;
        )
          ((e = e.sibling),
            (n = n.sibling = Oi(e, e.pendingProps)),
            (n.return = t));
        n.sibling = null;
      }
      return t.child;
    }
    function el(e, t) {
      return (
        (e.lanes & t) !== 0 || ((e = e.dependencies), !!(e !== null && ga(e)))
      );
    }
    function tl(e, t, n) {
      switch (t.tag) {
        case 3:
          (ye(t, t.stateNode.containerInfo),
            da(t, wa, e.memoizedState.cache),
            aa());
          break;
        case 27:
        case 5:
          xe(t);
          break;
        case 4:
          ye(t, t.stateNode.containerInfo);
          break;
        case 10:
          da(t, t.type, t.memoizedProps.value);
          break;
        case 31:
          if (t.memoizedState !== null) return ((t.flags |= 128), To(t), null);
          break;
        case 13:
          var r = t.memoizedState;
          if (r !== null) {
            if (r.dehydrated !== null) return (wo(t), (t.flags |= 128), null);
            r = ha(e, t, n, !1);
            var i = t.child.childLanes;
            return r || (n & i) !== 0
              ? Hc(e, t, n)
              : (wo(t), (e = $c(e, t, n)), e === null ? null : e.sibling);
          }
          wo(t);
          break;
        case 19:
          if (t.flags & 128) return Zc(e, t, n);
          if (
            ((i = !!(e.flags & 128)),
            (r = (n & t.childLanes) !== 0),
            (r ||= (ha(e, t, n, !1), (n & t.childLanes) !== 0)),
            i)
          ) {
            if (r) return Zc(e, t, n);
            t.flags |= 128;
          }
          if (
            ((i = t.memoizedState),
            i !== null &&
              ((i.rendering = null), (i.tail = null), (i.lastEffect = null)),
            Ao(t, ko.current),
            r)
          )
            break;
          return null;
        case 22:
          return ((t.lanes = 0), Oc(e, t, n, t.pendingProps));
        case 24:
          da(t, wa, e.memoizedState.cache);
      }
      return $c(e, t, n);
    }
    function nl(e, t, n) {
      if (e !== null) {
        if (e.memoizedProps !== t.pendingProps) Cc = !0;
        else {
          if (!el(e, n) && !(t.flags & 128)) return ((Cc = !1), tl(e, t, n));
          Cc = !!(e.flags & 131072);
        }
      } else ((Cc = !1), K && t.flags & 1048576 && qi(t, Bi, t.index));
      switch (((t.lanes = 0), t.tag)) {
        case 16:
          a: {
            var r = t.pendingProps;
            if (((e = Ka(t.elementType)), (t.type = e), typeof e == `function`))
              Di(e)
                ? ((r = fc(e, r)), (t.tag = 1), (t = Lc(null, t, e, r, n)))
                : ((t.tag = 0), (t = Fc(null, t, e, r, n)));
            else {
              if (e != null) {
                var i = e.$$typeof;
                if (i === ee) {
                  ((t.tag = 11), (t = Tc(null, t, e, r, n)));
                  break a;
                }
                if (i === re) {
                  ((t.tag = 14), (t = Ec(null, t, e, r, n)));
                  break a;
                }
                if (i === F) {
                  ((t.tag = 10), (t.type = e), (t = Qc(null, t, n)));
                  break a;
                }
              }
              throw ((t = ue(e) || e), Error(s(306, t, ``)));
            }
          }
          return t;
        case 0:
          return Fc(e, t, t.type, t.pendingProps, n);
        case 1:
          return ((r = t.type), (i = fc(r, t.pendingProps)), Lc(e, t, r, i, n));
        case 3:
          a: {
            if ((ye(t, t.stateNode.containerInfo), e === null))
              throw Error(s(387));
            r = t.pendingProps;
            var a = t.memoizedState;
            ((i = a.element), oo(e, t), mo(t, r, null, n));
            var o = t.memoizedState;
            if (
              ((r = o.cache),
              da(t, wa, r),
              r !== a.cache && ma(t, [wa], n, !0),
              po(),
              (r = o.element),
              a.isDehydrated)
            ) {
              if (
                ((a = { element: r, isDehydrated: !1, cache: o.cache }),
                (t.updateQueue.baseState = a),
                (t.memoizedState = a),
                t.flags & 256)
              ) {
                t = Rc(e, t, r, n);
                break a;
              }
              if (r !== i) {
                ((i = Ii(Error(s(424)), t)), sa(i), (t = Rc(e, t, r, n)));
                break a;
              }
              switch (((e = t.stateNode.containerInfo), e.nodeType)) {
                case 9:
                  e = e.body;
                  break;
                default:
                  e = e.nodeName === `HTML` ? e.ownerDocument.body : e;
              }
              for (
                Qi = lm(e.firstChild),
                  Zi = t,
                  K = !0,
                  $i = null,
                  ea = !0,
                  n = ro(t, null, r, n),
                  t.child = n;
                n;
              )
                ((n.flags = (n.flags & -3) | 134221824), (n = n.sibling));
            } else {
              if ((aa(), r === i)) {
                t = $c(e, t, n);
                break a;
              }
              wc(e, t, r, n);
            }
            t = t.child;
          }
          return t;
        case 26:
          return (
            Pc(e, t),
            e === null
              ? (n = Nm(t.type, null, t.pendingProps, null))
                ? (t.memoizedState = n)
                : K || (t.stateNode = fp(t.type, t.pendingProps, _e.current, t))
              : (t.memoizedState = Nm(
                  t.type,
                  e.memoizedProps,
                  t.pendingProps,
                  e.memoizedState,
                )),
            null
          );
        case 27:
          return (
            xe(t),
            e === null &&
              K &&
              ((r = t.stateNode = hm(t.type, t.pendingProps, _e.current)),
              (Zi = t),
              (ea = !0),
              (i = Qi),
              Sp(t.type) ? ((um = i), (Qi = lm(r.firstChild))) : (Qi = i)),
            wc(e, t, t.pendingProps.children, n),
            Pc(e, t),
            e === null && (t.flags |= 4194304),
            t.child
          );
        case 5:
          return (
            e === null &&
              K &&
              ((i = r = Qi) &&
                ((r = rm(r, t.type, t.pendingProps, ea)),
                r === null
                  ? (i = !1)
                  : ((t.stateNode = r),
                    (Zi = t),
                    (Qi = lm(r.firstChild)),
                    (ea = !1),
                    (i = !0))),
              i || na(t)),
            xe(t),
            (i = t.type),
            (a = t.pendingProps),
            (o = e === null ? null : e.memoizedProps),
            (r = a.children),
            pp(i, a) ? (r = null) : o !== null && pp(i, o) && (t.flags |= 32),
            t.memoizedState !== null &&
              ((i = Go(e, t, Jo, null, null, n)), (sh._currentValue = i)),
            Pc(e, t),
            wc(e, t, r, n),
            t.child
          );
        case 6:
          return (
            e === null &&
              K &&
              ((e = n = Qi) &&
                ((n = im(n, t.pendingProps, ea)),
                n === null
                  ? (e = !1)
                  : ((t.stateNode = n), (Zi = t), (Qi = null), (e = !0))),
              e || na(t)),
            null
          );
        case 13:
          return Hc(e, t, n);
        case 4:
          return (
            ye(t, t.stateNode.containerInfo),
            (r = t.pendingProps),
            e === null ? (t.child = no(t, null, r, n)) : wc(e, t, r, n),
            t.child
          );
        case 11:
          return Tc(e, t, t.type, t.pendingProps, n);
        case 7:
          return ((r = t.pendingProps), Pc(e, t), wc(e, t, r, n), t.child);
        case 8:
          return (wc(e, t, t.pendingProps.children, n), t.child);
        case 12:
          return (wc(e, t, t.pendingProps.children, n), t.child);
        case 10:
          return Qc(e, t, n);
        case 9:
          return (
            (i = t.type._context),
            (r = t.pendingProps.children),
            _a(t),
            (i = va(i)),
            (r = r(i)),
            (t.flags |= 1),
            wc(e, t, r, n),
            t.child
          );
        case 14:
          return Ec(e, t, t.type, t.pendingProps, n);
        case 15:
          return Dc(e, t, t.type, t.pendingProps, n);
        case 19:
          return Zc(e, t, n);
        case 31:
          return Nc(e, t, n);
        case 22:
          return Oc(e, t, n, t.pendingProps);
        case 24:
          return (
            _a(t),
            (r = va(wa)),
            e === null
              ? ((i = La()),
                i === null &&
                  ((i = qu),
                  (a = Ta()),
                  (i.pooledCache = a),
                  a.refCount++,
                  a !== null && (i.pooledCacheLanes |= n),
                  (i = a)),
                (t.memoizedState = { parent: r, cache: i }),
                ao(t),
                da(t, wa, i))
              : ((e.lanes & n) !== 0 && (oo(e, t), mo(t, null, null, n), po()),
                (i = e.memoizedState),
                (a = t.memoizedState),
                i.parent === r
                  ? ((r = a.cache),
                    da(t, wa, r),
                    r !== i.cache && ma(t, [wa], n, !0))
                  : ((i = { parent: r, cache: r }),
                    (t.memoizedState = i),
                    t.lanes === 0 &&
                      (t.memoizedState = t.updateQueue.baseState = i),
                    da(t, wa, r))),
            wc(e, t, t.pendingProps.children, n),
            t.child
          );
        case 30:
          return (
            t.stateNode === null &&
              (t.stateNode = {
                autoName: null,
                paired: null,
                clones: null,
                ref: null,
              }),
            (r = t.pendingProps),
            r.name != null && r.name !== `auto`
              ? (t.flags |= e === null ? 18882560 : 18874368)
              : K && Ji(t),
            e !== null && e.memoizedProps.name !== r.name
              ? (t.flags |= 4194816)
              : Pc(e, t),
            wc(e, t, r.children, n),
            t.child
          );
        case 29:
          throw t.pendingProps;
      }
      throw Error(s(156, t.tag));
    }
    function rl(e) {
      e.flags |= 4;
    }
    function il(e, t, n, r, i) {
      var a;
      if (
        ((a = !!(e.mode & 32)) &&
          (a =
            n === null
              ? Jm(t, r)
              : Jm(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)),
        a)
      ) {
        if (((e.flags |= 16777216), (i & 335544128) === i)) {
          if (e.stateNode.complete) e.flags |= 8192;
          else if (Bd()) e.flags |= 8192;
          else throw ((qa = Ua), Va);
        }
      } else e.flags &= -16777217;
    }
    function al(e, t) {
      if (t.type !== `stylesheet` || t.state.loading & 4) e.flags &= -16777217;
      else if (((e.flags |= 16777216), !Ym(t))) {
        if (Bd()) e.flags |= 8192;
        else throw ((qa = Ua), Va);
      }
    }
    function ol(e, t) {
      (t !== null && (e.flags |= 4),
        e.flags & 16384 &&
          ((t = e.tag === 22 ? 536870912 : it()), (e.lanes |= t), (sd |= t)));
    }
    function sl(e, t) {
      if (!K)
        switch (e.tailMode) {
          case `visible`:
            break;
          case `collapsed`:
            for (var n = e.tail, r = null; n !== null;)
              (n.alternate !== null && (r = n), (n = n.sibling));
            r === null
              ? t || e.tail === null
                ? (e.tail = null)
                : (e.tail.sibling = null)
              : (r.sibling = null);
            break;
          default:
            for (t = e.tail, n = null; t !== null;)
              (t.alternate !== null && (n = t), (t = t.sibling));
            n === null ? (e.tail = null) : (n.sibling = null);
        }
    }
    function cl(e) {
      var t = e.alternate !== null && e.alternate.child === e.child,
        n = 0,
        r = 0;
      if (t)
        for (var i = e.child; i !== null;)
          ((n |= i.lanes | i.childLanes),
            (r |= i.subtreeFlags & 1206910976),
            (r |= i.flags & 1206910976),
            (i.return = e),
            (i = i.sibling));
      else
        for (i = e.child; i !== null;)
          ((n |= i.lanes | i.childLanes),
            (r |= i.subtreeFlags),
            (r |= i.flags),
            (i.return = e),
            (i = i.sibling));
      return ((e.subtreeFlags |= r), (e.childLanes = n), t);
    }
    function ll(e, t, n) {
      var r = t.pendingProps;
      switch ((Yi(t), t.tag)) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return (cl(t), null);
        case 1:
          return (cl(t), null);
        case 3:
          return (
            (n = t.stateNode),
            (r = null),
            e !== null && (r = e.memoizedState.cache),
            t.memoizedState.cache !== r && (t.flags |= 2048),
            fa(wa),
            be(),
            n.pendingContext &&
              ((n.context = n.pendingContext), (n.pendingContext = null)),
            (e === null || e.child === null) &&
              (q(t)
                ? rl(t)
                : e === null ||
                  (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
                  ((t.flags |= 1024), oa())),
            cl(t),
            null
          );
        case 26:
          var i = t.type,
            a = t.memoizedState;
          return (
            e === null
              ? (rl(t),
                a === null ? (cl(t), il(t, i, null, r, n)) : (cl(t), al(t, a)))
              : a
                ? a === e.memoizedState
                  ? (cl(t), (t.flags &= -16777217))
                  : (rl(t), cl(t), al(t, a))
                : ((e = e.memoizedProps),
                  e !== r && rl(t),
                  cl(t),
                  il(t, i, e, r, n)),
            null
          );
        case 27:
          if (
            (W(t),
            (n = _e.current),
            (i = t.type),
            e !== null && t.stateNode != null)
          )
            e.memoizedProps !== r && rl(t);
          else {
            if (!r) {
              if (t.stateNode === null) throw Error(s(166));
              return (cl(t), (t.subtreeFlags &= -33554433), null);
            }
            ((e = H.current),
              q(t) ? ra(t, e) : ((e = hm(i, r, n)), (t.stateNode = e), rl(t)));
          }
          return (cl(t), (t.subtreeFlags &= -33554433), null);
        case 5:
          if ((W(t), (i = t.type), e !== null && t.stateNode != null))
            e.memoizedProps !== r && rl(t);
          else {
            if (!r) {
              if (t.stateNode === null) throw Error(s(166));
              return (cl(t), (t.subtreeFlags &= -33554433), null);
            }
            if (((a = H.current), q(t))) ra(t, a);
            else {
              var o = lp(_e.current);
              switch (a) {
                case 1:
                  a = o.createElementNS(`http://www.w3.org/2000/svg`, i);
                  break;
                case 2:
                  a = o.createElementNS(
                    `http://www.w3.org/1998/Math/MathML`,
                    i,
                  );
                  break;
                default:
                  switch (i) {
                    case `svg`:
                      a = o.createElementNS(`http://www.w3.org/2000/svg`, i);
                      break;
                    case `math`:
                      a = o.createElementNS(
                        `http://www.w3.org/1998/Math/MathML`,
                        i,
                      );
                      break;
                    case `script`:
                      ((a = o.createElement(`div`)),
                        (a.innerHTML = `<script><\/script>`),
                        (a = a.removeChild(a.firstChild)));
                      break;
                    case `select`:
                      ((a =
                        typeof r.is == `string`
                          ? o.createElement(`select`, { is: r.is })
                          : o.createElement(`select`)),
                        r.multiple
                          ? (a.multiple = !0)
                          : r.size && (a.size = r.size));
                      break;
                    default:
                      a =
                        typeof r.is == `string`
                          ? o.createElement(i, { is: r.is })
                          : o.createElement(i);
                  }
              }
              ((a[gt] = t), (a[_t] = r));
              a: for (o = t.child; o !== null;) {
                if (o.tag === 5 || o.tag === 6) a.appendChild(o.stateNode);
                else if (o.tag !== 4 && o.tag !== 27 && o.child !== null) {
                  ((o.child.return = o), (o = o.child));
                  continue;
                }
                if (o === t) break a;
                for (; o.sibling === null;) {
                  if (o.return === null || o.return === t) break a;
                  o = o.return;
                }
                ((o.sibling.return = o.return), (o = o.sibling));
              }
              t.stateNode = a;
              a: switch ((np(a, i, r), i)) {
                case `button`:
                case `input`:
                case `select`:
                case `textarea`:
                  r = !!r.autoFocus;
                  break a;
                case `img`:
                  r = !0;
                  break a;
                default:
                  r = !1;
              }
              r && rl(t);
            }
          }
          return (
            cl(t),
            (t.subtreeFlags &= -33554433),
            il(
              t,
              t.type,
              e === null ? null : e.memoizedProps,
              t.pendingProps,
              n,
            ),
            null
          );
        case 6:
          if (e && t.stateNode != null) e.memoizedProps !== r && rl(t);
          else {
            if (typeof r != `string` && t.stateNode === null)
              throw Error(s(166));
            if (((e = _e.current), q(t))) {
              if (
                ((e = t.stateNode),
                (n = t.memoizedProps),
                (r = null),
                (i = Zi),
                i !== null)
              )
                switch (i.tag) {
                  case 27:
                  case 5:
                    r = i.memoizedProps;
                }
              ((e[gt] = t),
                (e = !!(
                  e.nodeValue === n ||
                  (r !== null && !0 === r.suppressHydrationWarning) ||
                  $f(e.nodeValue, n)
                )),
                e || na(t, !0));
            } else
              ((e = lp(e).createTextNode(r)), (e[gt] = t), (t.stateNode = e));
          }
          return (cl(t), null);
        case 31:
          if (((n = t.memoizedState), e === null || e.memoizedState !== null)) {
            if (((r = q(t)), n !== null)) {
              if (e === null) {
                if (!r) throw Error(s(318));
                if (
                  ((e = t.memoizedState),
                  (e = e === null ? null : e.dehydrated),
                  !e)
                )
                  throw Error(s(557));
                e[gt] = t;
              } else
                (aa(),
                  !(t.flags & 128) && (t.memoizedState = null),
                  (t.flags |= 4));
              (cl(t), (e = !1));
            } else
              ((n = oa()),
                e !== null &&
                  e.memoizedState !== null &&
                  (e.memoizedState.hydrationErrors = n),
                (e = !0));
            if (!e) return t.flags & 256 ? (Oo(t), t) : (Oo(t), null);
            if (t.flags & 128) throw Error(s(558));
          }
          return (cl(t), null);
        case 13:
          if (
            ((r = t.memoizedState),
            e === null ||
              (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
          ) {
            if (((i = q(t)), r !== null && r.dehydrated !== null)) {
              if (e === null) {
                if (!i) throw Error(s(318));
                if (
                  ((i = t.memoizedState),
                  (i = i === null ? null : i.dehydrated),
                  !i)
                )
                  throw Error(s(317));
                i[gt] = t;
              } else
                (aa(),
                  !(t.flags & 128) && (t.memoizedState = null),
                  (t.flags |= 4));
              (cl(t), (i = !1));
            } else
              ((i = oa()),
                e !== null &&
                  e.memoizedState !== null &&
                  (e.memoizedState.hydrationErrors = i),
                (i = !0));
            if (!i) return t.flags & 256 ? (Oo(t), t) : (Oo(t), null);
          }
          return (
            Oo(t),
            t.flags & 128
              ? ((t.lanes = n), t)
              : ((n = r !== null),
                (e = e !== null && e.memoizedState !== null),
                n &&
                  ((r = t.child),
                  (i = null),
                  r.alternate !== null &&
                    r.alternate.memoizedState !== null &&
                    r.alternate.memoizedState.cachePool !== null &&
                    (i = r.alternate.memoizedState.cachePool.pool),
                  (a = null),
                  r.memoizedState !== null &&
                    r.memoizedState.cachePool !== null &&
                    (a = r.memoizedState.cachePool.pool),
                  a !== i && (r.flags |= 2048)),
                n !== e && n && (t.child.flags |= 8192),
                ol(t, t.updateQueue),
                cl(t),
                null)
          );
        case 4:
          return (
            be(),
            e === null && Uf(t.stateNode.containerInfo),
            (t.flags |= 67108864),
            cl(t),
            null
          );
        case 10:
          return (fa(t.type), cl(t), null);
        case 19:
          if ((jo(t), (r = t.memoizedState), r === null)) return (cl(t), null);
          if (((i = !!(t.flags & 128)), (a = r.rendering), a === null)) {
            if (i) sl(r, !1);
            else {
              if (nd !== 0 || (e !== null && e.flags & 128))
                for (e = t.child; e !== null;) {
                  if (((a = Mo(e)), a !== null)) {
                    for (
                      t.flags |= 128,
                        sl(r, !1),
                        e = a.updateQueue,
                        t.updateQueue = e,
                        ol(t, e),
                        t.subtreeFlags = 0,
                        e = n,
                        n = t.child;
                      n !== null;
                    )
                      (ki(n, e), (n = n.sibling));
                    return (
                      Ao(t, (ko.current & 1) | 2),
                      K && Ki(t, r.treeForkCount),
                      t.child
                    );
                  }
                  e = e.sibling;
                }
              r.tail !== null &&
                Pe() > pd &&
                ((t.flags |= 128), (i = !0), sl(r, !1), (t.lanes = 4194304));
            }
          } else {
            if (!i) {
              if (((e = Mo(a)), e !== null)) {
                if (
                  ((t.flags |= 128),
                  (i = !0),
                  (e = e.updateQueue),
                  (t.updateQueue = e),
                  ol(t, e),
                  sl(r, !0),
                  r.tail === null &&
                    r.tailMode !== `collapsed` &&
                    r.tailMode !== `visible` &&
                    !a.alternate &&
                    !K)
                )
                  return (cl(t), null);
              } else
                2 * Pe() - r.renderingStartTime > pd &&
                  n !== 536870912 &&
                  ((t.flags |= 128), (i = !0), sl(r, !1), (t.lanes = 4194304));
            }
            r.isBackwards
              ? ((a.sibling = t.child), (t.child = a))
              : ((e = r.last),
                e === null ? (t.child = a) : (e.sibling = a),
                (r.last = a));
          }
          if (r.tail !== null) {
            e = r.tail;
            a: {
              for (n = e; n !== null;) {
                if (n.alternate !== null) {
                  n = !1;
                  break a;
                }
                n = n.sibling;
              }
              n = !0;
            }
            return (
              (r.rendering = e),
              (r.tail = e.sibling),
              (r.renderingStartTime = Pe()),
              (e.sibling = null),
              (a = ko.current),
              (a = i ? (a & 1) | 2 : a & 1),
              r.tailMode === `visible` || r.tailMode === `collapsed` || !n || K
                ? Ao(t, a)
                : ((n = a), ge(So, t), ge(ko, n), Co === null && (Co = t)),
              K && Ki(t, r.treeForkCount),
              e
            );
          }
          return (cl(t), null);
        case 22:
        case 23:
          return (
            Oo(t),
            xo(),
            (r = t.memoizedState !== null),
            e === null
              ? r && (t.flags |= 8192)
              : (e.memoizedState !== null) !== r && (t.flags |= 8192),
            r
              ? n & 536870912 &&
                !(t.flags & 128) &&
                (cl(t), t.subtreeFlags & 6 && (t.flags |= 8192))
              : cl(t),
            (n = t.updateQueue),
            n !== null && ol(t, n.retryQueue),
            (n = null),
            e !== null &&
              e.memoizedState !== null &&
              e.memoizedState.cachePool !== null &&
              (n = e.memoizedState.cachePool.pool),
            (r = null),
            t.memoizedState !== null &&
              t.memoizedState.cachePool !== null &&
              (r = t.memoizedState.cachePool.pool),
            r !== n && (t.flags |= 2048),
            e !== null && he(Ia),
            null
          );
        case 24:
          return (
            (n = null),
            e !== null && (n = e.memoizedState.cache),
            t.memoizedState.cache !== n && (t.flags |= 2048),
            fa(wa),
            cl(t),
            null
          );
        case 25:
          return null;
        case 30:
          return ((t.flags |= 33554432), cl(t), null);
      }
      throw Error(s(156, t.tag));
    }
    function ul(e, t) {
      switch ((Yi(t), t.tag)) {
        case 1:
          return (
            (e = t.flags),
            e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 3:
          return (
            fa(wa),
            be(),
            (e = t.flags),
            e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 26:
        case 27:
        case 5:
          return (W(t), null);
        case 31:
          if (t.memoizedState !== null) {
            if ((Oo(t), t.alternate === null)) throw Error(s(340));
            aa();
          }
          return (
            (e = t.flags),
            e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 13:
          if (
            (Oo(t), (e = t.memoizedState), e !== null && e.dehydrated !== null)
          ) {
            if (t.alternate === null) throw Error(s(340));
            aa();
          }
          return (
            (e = t.flags),
            e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 19:
          return (
            jo(t),
            (e = t.flags),
            e & 65536
              ? ((t.flags = (e & -65537) | 128),
                (e = t.memoizedState),
                e !== null && ((e.rendering = null), (e.tail = null)),
                (t.flags |= 4),
                t)
              : null
          );
        case 4:
          return (be(), null);
        case 10:
          return (fa(t.type), null);
        case 22:
        case 23:
          return (
            Oo(t),
            xo(),
            e !== null && he(Ia),
            (e = t.flags),
            e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 24:
          return (fa(wa), null);
        case 25:
          return null;
        default:
          return null;
      }
    }
    function dl(e, t) {
      switch ((Yi(t), t.tag)) {
        case 3:
          (fa(wa), be());
          break;
        case 26:
        case 27:
        case 5:
          W(t);
          break;
        case 4:
          be();
          break;
        case 31:
          t.memoizedState !== null && Oo(t);
          break;
        case 13:
          Oo(t);
          break;
        case 19:
          jo(t);
          break;
        case 10:
          fa(t.type);
          break;
        case 22:
        case 23:
          (Oo(t), xo(), e !== null && he(Ia));
          break;
        case 24:
          fa(wa);
      }
    }
    function fl(e, t) {
      try {
        var n = t.updateQueue,
          r = n === null ? null : n.lastEffect;
        if (r !== null) {
          var i = r.next;
          n = i;
          do {
            if ((n.tag & e) === e) {
              r = void 0;
              var a = n.create,
                o = n.inst;
              ((r = a()), (o.destroy = r));
            }
            n = n.next;
          } while (n !== i);
        }
      } catch (e) {
        df(t, t.return, e);
      }
    }
    function pl(e, t, n) {
      try {
        var r = t.updateQueue,
          i = r === null ? null : r.lastEffect;
        if (i !== null) {
          var a = i.next;
          r = a;
          do {
            if ((r.tag & e) === e) {
              var o = r.inst,
                s = o.destroy;
              if (s !== void 0) {
                ((o.destroy = void 0), (i = t));
                var c = n,
                  l = s;
                try {
                  l();
                } catch (e) {
                  df(i, c, e);
                }
              }
            }
            r = r.next;
          } while (r !== a);
        }
      } catch (e) {
        df(t, t.return, e);
      }
    }
    function ml(e) {
      var t = e.updateQueue;
      if (t !== null) {
        var n = e.stateNode;
        try {
          go(t, n);
        } catch (t) {
          df(e, e.return, t);
        }
      }
    }
    function hl(e, t, n) {
      ((n.props = fc(e.type, e.memoizedProps)), (n.state = e.memoizedState));
      try {
        n.componentWillUnmount();
      } catch (n) {
        df(e, t, n);
      }
    }
    function gl(e, t) {
      try {
        var n = e.ref;
        if (n !== null) {
          switch (e.tag) {
            case 26:
            case 27:
            case 5:
              var r = e.stateNode;
              break;
            case 30:
              var i = e.stateNode,
                a = di(e.memoizedProps, i);
              ((i.ref === null || i.ref.name !== a) && (i.ref = Pp(a)),
                (r = i.ref));
              break;
            case 7:
              if (e.stateNode === null) {
                var o = new Fp(e);
                (h(e.child, !1, Qp, o, void 0, void 0), (e.stateNode = o));
              }
              r = e.stateNode;
              break;
            default:
              r = e.stateNode;
          }
          typeof n == `function` ? (e.refCleanup = n(r)) : (n.current = r);
        }
      } catch (n) {
        df(e, t, n);
      }
    }
    function _l(e, t) {
      var n = e.ref,
        r = e.refCleanup;
      if (n !== null) {
        if (typeof r == `function`)
          try {
            r();
          } catch (n) {
            df(e, t, n);
          } finally {
            ((e.refCleanup = null),
              (e = e.alternate),
              e != null && (e.refCleanup = null));
          }
        else if (typeof n == `function`)
          try {
            n(null);
          } catch (n) {
            df(e, t, n);
          }
        else n.current = null;
      }
    }
    function vl(e, t) {
      if (
        (e.tag === 5 || e.tag === 27 || e.tag === 6) &&
        e.alternate === null &&
        t !== null
      )
        for (var n = 0; n < t.length; n++) em(e.stateNode, t[n]);
    }
    function yl(e) {
      for (
        var t = e.return;
        t !== null && (Sl(t) && em(e.stateNode, t.stateNode), !xl(t));
      )
        t = t.return;
    }
    function bl(e) {
      for (
        var t = e.return;
        t !== null && (Sl(t) && tm(e.stateNode, t.stateNode), !xl(t));
      )
        t = t.return;
    }
    function xl(e) {
      return e.tag === 5 || e.tag === 3 || e.tag === 27;
    }
    function Sl(e) {
      return e && e.tag === 7 && e.stateNode !== null;
    }
    function Cl(e) {
      var t = e.type,
        n = e.memoizedProps,
        r = e.stateNode;
      try {
        a: switch (t) {
          case `button`:
          case `input`:
          case `select`:
          case `textarea`:
            n.autoFocus && r.focus();
            break a;
          case `img`:
            n.src ? (r.src = n.src) : n.srcSet && (r.srcset = n.srcSet);
        }
      } catch (t) {
        df(e, e.return, t);
      }
    }
    function wl(e, t, n) {
      try {
        var r = e.stateNode;
        (ip(r, e.type, n, t), (r[_t] = t));
      } catch (t) {
        df(e, e.return, t);
      }
    }
    function Tl(e) {
      return (
        e.tag === 5 ||
        e.tag === 3 ||
        e.tag === 26 ||
        (e.tag === 27 && Sp(e.type)) ||
        e.tag === 4
      );
    }
    function El(e) {
      a: for (;;) {
        for (; e.sibling === null;) {
          if (e.return === null || Tl(e.return)) return null;
          e = e.return;
        }
        for (
          e.sibling.return = e.return, e = e.sibling;
          e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
        ) {
          if (
            (e.tag === 27 && Sp(e.type)) ||
            e.flags & 2 ||
            e.child === null ||
            e.tag === 4
          )
            continue a;
          ((e.child.return = e), (e = e.child));
        }
        if (!(e.flags & 2)) return e.stateNode;
      }
    }
    function Dl(e, t, n, r) {
      var i = e.tag;
      if (i === 5 || i === 6)
        ((i = e.stateNode),
          t
            ? (n.nodeType === 9
                ? n.body
                : n.nodeName === `HTML`
                  ? n.ownerDocument.body
                  : n
              ).insertBefore(i, t)
            : ((t =
                n.nodeType === 9
                  ? n.body
                  : n.nodeName === `HTML`
                    ? n.ownerDocument.body
                    : n),
              t.appendChild(i),
              (n = n._reactRootContainer),
              n != null || t.onclick !== null || (t.onclick = pn)),
          vl(e, r),
          (Bt = !0));
      else if (
        i !== 4 &&
        (i === 27 &&
          (vl(e, r), (r = null), Sp(e.type) && ((n = e.stateNode), (t = null))),
        (e = e.child),
        e !== null)
      )
        for (Dl(e, t, n, r), e = e.sibling; e !== null;)
          (Dl(e, t, n, r), (e = e.sibling));
    }
    function Ol(e, t, n, r) {
      var i = e.tag;
      if (i === 5 || i === 6)
        ((i = e.stateNode),
          t ? n.insertBefore(i, t) : n.appendChild(i),
          vl(e, r),
          (Bt = !0));
      else if (
        i !== 4 &&
        (i === 27 && (vl(e, r), (r = null), Sp(e.type) && (n = e.stateNode)),
        (e = e.child),
        e !== null)
      )
        for (Ol(e, t, n, r), e = e.sibling; e !== null;)
          (Ol(e, t, n, r), (e = e.sibling));
    }
    function kl(e) {
      var t = e.stateNode,
        n = e.memoizedProps;
      try {
        for (var r = e.type, i = t.attributes; i.length;)
          t.removeAttributeNode(i[0]);
        (np(t, r, n), (t[gt] = e), (t[_t] = n));
      } catch (t) {
        df(e, e.return, t);
      }
    }
    var Al = !1,
      jl = null;
    function Ml(e) {
      (e.tag === 30 || e.subtreeFlags & 33554432) && (Al = !0);
    }
    var Nl = null;
    function Pl() {
      var e = Nl;
      return ((Nl = null), e);
    }
    var Fl = 0;
    function Il(e, t, n, r, i) {
      return ((Fl = 0), Ll(e.child, t, n, r, i));
    }
    function Ll(e, t, n, r, i) {
      for (var a = !1; e !== null;) {
        if (e.tag === 5) {
          var o = e.stateNode;
          if (r !== null) {
            var s = Op(o);
            (r.push(s), s.view && (a = !0));
          } else a || (Op(o).view && (a = !0));
          ((Al = !0), Tp(o, Fl === 0 ? t : t + `_` + Fl, n), Fl++);
        } else
          (e.tag === 22 && e.memoizedState !== null) ||
            (e.tag === 30 && i) ||
            (Ll(e.child, t, n, r, i) && (a = !0));
        e = e.sibling;
      }
      return a;
    }
    function Rl(e, t) {
      for (; e !== null;)
        (e.tag === 5
          ? Ep(e.stateNode, e.memoizedProps)
          : (e.tag === 22 && e.memoizedState !== null) ||
            (e.tag === 30 && t) ||
            Rl(e.child, t),
          (e = e.sibling));
    }
    function zl(e) {
      if (e.subtreeFlags & 18874368)
        for (e = e.child; e !== null;) {
          if (
            (e.tag !== 22 || e.memoizedState === null) &&
            (zl(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)
          ) {
            var t = e.memoizedProps;
            if (t.name == null || t.name === `auto`) throw Error(s(544));
            var n = t.name;
            ((t = pi(t.default, t.share)),
              t !== `none` && (Il(e, n, t, null, !1) || Rl(e.child, !1)));
          }
          e = e.sibling;
        }
    }
    function Bl(e, t) {
      if (e.tag === 30) {
        var n = e.stateNode,
          r = e.memoizedProps,
          i = di(r, n),
          a = pi(r.default, n.paired ? r.share : r.enter);
        a === `none`
          ? zl(e)
          : Il(e, i, a, null, !1)
            ? (zl(e), n.paired || t || Ad(e, r.onEnter))
            : Rl(e.child, !1);
      } else if (e.subtreeFlags & 33554432)
        for (e = e.child; e !== null;) (Bl(e, t), (e = e.sibling));
      else zl(e);
    }
    function Vl(e) {
      if (jl !== null && jl.size !== 0) {
        var t = jl;
        if (e.subtreeFlags & 18874368)
          for (e = e.child; e !== null;) {
            if (e.tag !== 22 || e.memoizedState === null) {
              if (e.tag === 30 && e.flags & 18874368) {
                var n = e.memoizedProps,
                  r = n.name;
                if (r != null && r !== `auto`) {
                  var i = t.get(r);
                  if (i !== void 0) {
                    var a = pi(n.default, n.share);
                    if (
                      (a !== `none` &&
                        (Il(e, r, a, null, !1)
                          ? ((a = e.stateNode),
                            (i.paired = a),
                            (a.paired = i),
                            Ad(e, n.onShare))
                          : Rl(e.child, !1)),
                      t.delete(r),
                      t.size === 0)
                    )
                      break;
                  }
                }
              }
              Vl(e);
            }
            e = e.sibling;
          }
      }
    }
    function Hl(e) {
      if (e.tag === 30) {
        var t = e.memoizedProps,
          n = di(t, e.stateNode),
          r = jl === null ? void 0 : jl.get(n),
          i = pi(t.default, r === void 0 ? t.exit : t.share);
        (i !== `none` &&
          (Il(e, n, i, null, !1)
            ? r === void 0
              ? Ad(e, t.onExit)
              : ((i = e.stateNode),
                (r.paired = i),
                (i.paired = r),
                jl.delete(n),
                Ad(e, t.onShare))
            : Rl(e.child, !1)),
          jl !== null && Vl(e));
      } else if (e.subtreeFlags & 33554432)
        for (e = e.child; e !== null;) (Hl(e), (e = e.sibling));
      else jl !== null && Vl(e);
    }
    function Ul(e) {
      for (e = e.child; e !== null;) {
        if (e.tag === 30) {
          var t = e.memoizedProps,
            n = di(t, e.stateNode);
          ((t = pi(t.default, t.update)),
            (e.flags &= -5),
            t !== `none` && Il(e, n, t, (e.memoizedState = []), !1));
        } else e.subtreeFlags & 33554432 && Ul(e);
        e = e.sibling;
      }
    }
    function Wl(e) {
      if (e.subtreeFlags & 18874368)
        for (e = e.child; e !== null;) {
          if (e.tag !== 22 || e.memoizedState === null) {
            if (e.tag === 30 && e.flags & 18874368) {
              var t = e.stateNode;
              t.paired !== null && ((t.paired = null), Rl(e.child, !1));
            }
            Wl(e);
          }
          e = e.sibling;
        }
    }
    function Gl(e) {
      if (e.tag === 30) ((e.stateNode.paired = null), Rl(e.child, !1), Wl(e));
      else if (e.subtreeFlags & 33554432)
        for (e = e.child; e !== null;) (Gl(e), (e = e.sibling));
      else Wl(e);
    }
    function Kl(e) {
      for (e = e.child; e !== null;)
        (e.tag === 30 ? Rl(e.child, !1) : e.subtreeFlags & 33554432 && Kl(e),
          (e = e.sibling));
    }
    function ql(e, t, n, r, i, a, o) {
      for (var s = !1; t !== null;) {
        if (t.tag === 5) {
          var c = t.stateNode;
          if (a !== null && Fl < a.length) {
            var l = a[Fl],
              u = Op(c);
            (l.view || u.view) && (s = !0);
            var d;
            if ((d = !(e.flags & 4))) {
              if (u.clip) d = !0;
              else {
                d = l.rect;
                var f = u.rect;
                d =
                  d.y !== f.y ||
                  d.x !== f.x ||
                  d.height !== f.height ||
                  d.width !== f.width;
              }
            }
            (d && (e.flags |= 4),
              u.abs
                ? (u = !l.abs)
                : ((l = l.rect),
                  (u = u.rect),
                  (u = l.height !== u.height || l.width !== u.width)),
              u && (e.flags |= 32));
          } else e.flags |= 32;
          (e.flags & 4 && Tp(c, Fl === 0 ? n : n + `_` + Fl, i),
            (s && e.flags & 4) ||
              (Nl === null && (Nl = []),
              Nl.push(c, Fl === 0 ? r : r + `_` + Fl, t.memoizedProps)),
            Fl++);
        } else
          (t.tag !== 22 || t.memoizedState === null) &&
            (t.tag === 30 && o
              ? (e.flags |= t.flags & 32)
              : ql(e, t.child, n, r, i, a, o) && (s = !0));
        t = t.sibling;
      }
      return s;
    }
    function Jl(e, t) {
      for (e = e.child; e !== null;) {
        if (e.tag === 30) {
          var n = e.memoizedProps,
            r = e.stateNode,
            i = di(n, r),
            a = pi(n.default, n.update);
          if (t) {
            r = r.clones;
            var o = r === null ? null : r.map(kp);
          } else ((o = e.memoizedState), (e.memoizedState = null));
          r = e;
          var s = e.child;
          ((Fl = 0),
            (i = ql(r, s, i, i, a, o, !1)),
            e.flags & 4 && i && (t || Ad(e, n.onUpdate)));
        } else e.subtreeFlags & 33554432 && Jl(e, t);
        e = e.sibling;
      }
    }
    var Yl = !1,
      Xl = !1,
      Zl = !1,
      Ql = !1,
      $l = typeof WeakSet == `function` ? WeakSet : Set,
      eu = null,
      tu = !1,
      nu = !1,
      ru = !1,
      iu = !1;
    function au(e, t, n) {
      if (((e = e.containerInfo), (sp = gh), (e = Vr(e)), Hr(e))) {
        if (`selectionStart` in e)
          var r = { start: e.selectionStart, end: e.selectionEnd };
        else
          a: {
            r = ((r = e.ownerDocument) && r.defaultView) || window;
            var i = r.getSelection && r.getSelection();
            if (i && i.rangeCount !== 0) {
              r = i.anchorNode;
              var a = i.anchorOffset,
                o = i.focusNode;
              i = i.focusOffset;
              try {
                (r.nodeType, o.nodeType);
              } catch {
                r = null;
                break a;
              }
              var s = 0,
                c = -1,
                l = -1,
                u = 0,
                d = 0,
                f = e,
                p = null;
              b: for (;;) {
                for (
                  var m;
                  f !== r || (a !== 0 && f.nodeType !== 3) || (c = s + a),
                    f !== o || (i !== 0 && f.nodeType !== 3) || (l = s + i),
                    f.nodeType === 3 && (s += f.nodeValue.length),
                    (m = f.firstChild) !== null;
                )
                  ((p = f), (f = m));
                for (;;) {
                  if (f === e) break b;
                  if (
                    (p === r && ++u === a && (c = s),
                    p === o && ++d === i && (l = s),
                    (m = f.nextSibling) !== null)
                  )
                    break;
                  ((f = p), (p = f.parentNode));
                }
                f = m;
              }
              r = c === -1 || l === -1 ? null : { start: c, end: l };
            } else r = null;
          }
        r ||= { start: 0, end: 0 };
      } else r = null;
      for (
        cp = { focusedElem: e, selectionRange: r },
          gh = !1,
          n = (n & 335544064) === n,
          eu = t,
          t = n ? 9270 : 1024;
        eu !== null;
      ) {
        if (((e = eu), n && ((r = e.deletions), r !== null)))
          for (a = 0; a < r.length; a++) n && Hl(r[a]);
        if (e.alternate === null && e.flags & 2) (n && Ml(e), ou(n));
        else {
          if (e.tag === 22) {
            if (((r = e.alternate), e.memoizedState !== null)) {
              (r !== null && r.memoizedState === null && n && Hl(r), ou(n));
              continue;
            }
            if (r !== null && r.memoizedState !== null) {
              (n && Ml(e), ou(n));
              continue;
            }
          }
          ((r = e.child),
            (e.subtreeFlags & t) !== 0 && r !== null
              ? ((r.return = e), (eu = r))
              : (n && Ul(e), ou(n)));
        }
      }
      jl = null;
    }
    function ou(e) {
      for (; eu !== null;) {
        var t = eu,
          n = e,
          r = t.alternate,
          i = t.flags;
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (i & 1024 && r !== null) {
              ((n = void 0), (i = r.memoizedProps), (r = r.memoizedState));
              var a = t.stateNode;
              try {
                var o = fc(t.type, i);
                ((n = a.getSnapshotBeforeUpdate(o, r)),
                  (a.__reactInternalSnapshotBeforeUpdate = n));
              } catch (e) {
                df(t, t.return, e);
              }
            }
            break;
          case 3:
            if (i & 1024) {
              if (((r = t.stateNode.containerInfo), (n = r.nodeType), n === 9))
                nm(r);
              else if (n === 1)
                switch (r.nodeName) {
                  case `HEAD`:
                  case `HTML`:
                  case `BODY`:
                    nm(r);
                    break;
                  default:
                    r.textContent = ``;
                }
            }
            break;
          case 5:
          case 26:
          case 27:
          case 6:
          case 4:
          case 17:
            break;
          case 30:
            n &&
              r !== null &&
              ((n = di(r.memoizedProps, r.stateNode)),
              (i = t.memoizedProps),
              (i = pi(i.default, i.update)),
              i !== `none` && Il(r, n, i, (r.memoizedState = []), !0));
            break;
          default:
            if (i & 1024) throw Error(s(163));
        }
        if (((r = t.sibling), r !== null)) {
          ((r.return = t.return), (eu = r));
          break;
        }
        eu = t.return;
      }
    }
    function su(e, t, n) {
      var r = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          (Du(e, n), r & 4 && fl(5, n));
          break;
        case 1:
          if ((Du(e, n), r & 4)) {
            if (((e = n.stateNode), t === null))
              try {
                e.componentDidMount();
              } catch (e) {
                df(n, n.return, e);
              }
            else {
              var i = fc(n.type, t.memoizedProps);
              t = t.memoizedState;
              try {
                e.componentDidUpdate(
                  i,
                  t,
                  e.__reactInternalSnapshotBeforeUpdate,
                );
              } catch (e) {
                df(n, n.return, e);
              }
            }
          }
          (r & 64 && ml(n), r & 512 && gl(n, n.return));
          break;
        case 3:
          if ((Du(e, n), r & 64 && ((e = n.updateQueue), e !== null))) {
            if (((t = null), n.child !== null))
              switch (n.child.tag) {
                case 27:
                case 5:
                  t = n.child.stateNode;
                  break;
                case 1:
                  t = n.child.stateNode;
              }
            try {
              go(e, t);
            } catch (e) {
              df(n, n.return, e);
            }
          }
          break;
        case 27:
          t === null && r & 4 && kl(n);
        case 26:
        case 5:
          (Du(e, n), t === null && r & 4 && Cl(n), r & 512 && gl(n, n.return));
          break;
        case 12:
          Du(e, n);
          break;
        case 31:
          (Du(e, n), r & 4 && gu(e, n));
          break;
        case 13:
          (Du(e, n),
            r & 4 && _u(e, n),
            r & 64 &&
              ((e = n.memoizedState),
              e !== null &&
                ((e = e.dehydrated),
                e !== null && ((n = hf.bind(null, n)), cm(e, n)))));
          break;
        case 22:
          if (((r = n.memoizedState !== null || Yl), !r)) {
            var a = (t !== null && t.memoizedState !== null) || Xl;
            ((t = Yl),
              (i = Xl),
              (Yl = r),
              (Xl = a) && !i
                ? ((r = 2), n.subtreeFlags & 8772 && (r |= 1), ku(e, n, r))
                : Du(e, n),
              (Yl = t),
              (Xl = i));
          }
          break;
        case 30:
          (Du(e, n), r & 512 && gl(n, n.return));
          break;
        case 7:
          r & 512 && gl(n, n.return);
        default:
          Du(e, n);
      }
    }
    function cu(e, t) {
      for (e = e.child; e !== null;) (lu(e, t), (e = e.sibling));
    }
    function lu(e, t) {
      switch (e.tag) {
        case 5:
        case 26:
          try {
            var n = e.stateNode;
            if (t) {
              var r = n.style;
              typeof r.setProperty == `function`
                ? r.setProperty(`display`, `none`, `important`)
                : (r.display = `none`);
            } else {
              var i = e.stateNode,
                a = e.memoizedProps.style,
                o = a != null && a.hasOwnProperty(`display`) ? a.display : null;
              i.style.display =
                o == null || typeof o == `boolean` ? `` : (`` + o).trim();
            }
          } catch (t) {
            df(e, e.return, t);
          }
          uu(e, t);
          break;
        case 6:
          try {
            ((e.stateNode.nodeValue = t ? `` : e.memoizedProps), (Bt = !0));
          } catch (t) {
            df(e, e.return, t);
          }
          break;
        case 18:
          try {
            var s = e.stateNode;
            t ? wp(s, !0) : wp(e.stateNode, !1);
          } catch (t) {
            df(e, e.return, t);
          }
          break;
        case 22:
        case 23:
          e.memoizedState === null && cu(e, t);
          break;
        default:
          cu(e, t);
      }
    }
    function uu(e, t) {
      if (e.subtreeFlags & 67108864)
        for (e = e.child; e !== null;) {
          a: {
            var n = e,
              r = t;
            switch (n.tag) {
              case 4:
                lu(n, r);
                break a;
              case 22:
                n.memoizedState === null && uu(n, r);
                break a;
              default:
                uu(n, r);
            }
          }
          e = e.sibling;
        }
    }
    function du(e) {
      var t = e.alternate;
      (t !== null && ((e.alternate = null), du(t)),
        (e.child = null),
        (e.deletions = null),
        (e.sibling = null),
        e.tag === 5 && ((t = e.stateNode), t !== null && Tt(t)),
        (e.stateNode = null),
        (e.return = null),
        (e.dependencies = null),
        (e.memoizedProps = null),
        (e.memoizedState = null),
        (e.pendingProps = null),
        (e.stateNode = null),
        (e.updateQueue = null));
    }
    var fu = null,
      pu = !1;
    function mu(e, t, n) {
      for (n = n.child; n !== null;) (hu(e, t, n), (n = n.sibling));
    }
    function hu(e, t, n) {
      if (We && typeof We.onCommitFiberUnmount == `function`)
        try {
          We.onCommitFiberUnmount(Ue, n);
        } catch {}
      switch (n.tag) {
        case 26:
          (Xl || _l(n, t),
            mu(e, t, n),
            n.memoizedState
              ? n.memoizedState.count--
              : n.stateNode &&
                !Xl &&
                ((n = n.stateNode), n.parentNode.removeChild(n)));
          break;
        case 27:
          (Xl || _l(n, t), bl(n));
          var r = fu,
            i = pu;
          (Sp(n.type) && ((fu = n.stateNode), (pu = !1)),
            mu(e, t, n),
            gm(n.stateNode, n.type, n.memoizedProps),
            (fu = r),
            (pu = i));
          break;
        case 5:
          (Xl || _l(n, t), bl(n));
        case 6:
          if (
            (n.tag === 6 && bl(n),
            (r = fu),
            (i = pu),
            (fu = null),
            mu(e, t, n),
            (fu = r),
            (pu = i),
            fu !== null)
          ) {
            if (pu)
              try {
                ((fu.nodeType === 9
                  ? fu.body
                  : fu.nodeName === `HTML`
                    ? fu.ownerDocument.body
                    : fu
                ).removeChild(n.stateNode),
                  (Bt = !0));
              } catch (e) {
                df(n, t, e);
              }
            else
              try {
                (fu.removeChild(n.stateNode), (Bt = !0));
              } catch (e) {
                df(n, t, e);
              }
          }
          break;
        case 18:
          fu !== null &&
            (pu
              ? ((e = fu),
                Cp(
                  e.nodeType === 9
                    ? e.body
                    : e.nodeName === `HTML`
                      ? e.ownerDocument.body
                      : e,
                  n.stateNode,
                ),
                Hh(e))
              : Cp(fu, n.stateNode));
          break;
        case 4:
          ((r = fu),
            (i = pu),
            (fu = n.stateNode.containerInfo),
            (pu = !0),
            mu(e, t, n),
            (fu = r),
            (pu = i));
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          (pl(2, n, t), Xl || pl(4, n, t), mu(e, t, n));
          break;
        case 1:
          (Xl ||
            (_l(n, t),
            (r = n.stateNode),
            typeof r.componentWillUnmount == `function` && hl(n, t, r)),
            mu(e, t, n));
          break;
        case 21:
          mu(e, t, n);
          break;
        case 22:
          ((Xl = (r = Xl) || n.memoizedState !== null), mu(e, t, n), (Xl = r));
          break;
        case 30:
          (_l(n, t), mu(e, t, n));
          break;
        case 7:
          (Xl || _l(n, t), mu(e, t, n));
          break;
        default:
          mu(e, t, n);
      }
    }
    function gu(e, t) {
      if (
        t.memoizedState === null &&
        ((e = t.alternate), e !== null && ((e = e.memoizedState), e !== null))
      ) {
        e = e.dehydrated;
        try {
          Hh(e);
        } catch (e) {
          df(t, t.return, e);
        }
      }
    }
    function _u(e, t) {
      if (
        t.memoizedState === null &&
        ((e = t.alternate),
        e !== null &&
          ((e = e.memoizedState),
          e !== null && ((e = e.dehydrated), e !== null)))
      )
        try {
          Hh(e);
        } catch (e) {
          df(t, t.return, e);
        }
    }
    function vu(e) {
      switch (e.tag) {
        case 31:
        case 13:
        case 19:
          var t = e.stateNode;
          return (t === null && (t = e.stateNode = new $l()), t);
        case 22:
          return (
            (e = e.stateNode),
            (t = e._retryCache),
            t === null && (t = e._retryCache = new $l()),
            t
          );
        default:
          throw Error(s(435, e.tag));
      }
    }
    function yu(e, t) {
      var n = vu(e);
      t.forEach(function (t) {
        if (!n.has(t)) {
          n.add(t);
          var r = gf.bind(null, e, t);
          t.then(r, r);
        }
      });
    }
    function bu(e, t, n) {
      var r = t.deletions;
      if (r !== null)
        for (var i = 0; i < r.length; i++) {
          var a = r[i],
            o = e,
            c = t,
            l = c;
          a: for (; l !== null;) {
            switch (l.tag) {
              case 27:
                if (Sp(l.type)) {
                  ((fu = l.stateNode), (pu = !1));
                  break a;
                }
                break;
              case 5:
                ((fu = l.stateNode), (pu = !1));
                break a;
              case 3:
              case 4:
                ((fu = l.stateNode.containerInfo), (pu = !0));
                break a;
            }
            l = l.return;
          }
          if (fu === null) throw Error(s(160));
          (hu(o, c, a),
            (fu = null),
            (pu = !1),
            (o = a.alternate),
            o !== null && (o.return = null),
            (a.return = null));
        }
      if (t.subtreeFlags & 13886)
        for (t = t.child; t !== null;) (Su(t, e, n), (t = t.sibling));
    }
    var xu = null;
    function Su(e, t, n) {
      var r = e.alternate,
        i = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          if (
            i & 4 &&
            ((r = e.updateQueue),
            (r = r === null ? null : r.events),
            r !== null)
          )
            for (var a = 0; a < r.length; a++) {
              var o = r[a];
              o.ref.impl = o.nextImpl;
            }
          (bu(t, e, n),
            Cu(e),
            i & 4 && (pl(3, e, e.return), fl(3, e), pl(5, e, e.return)));
          break;
        case 1:
          (bu(t, e, n),
            Cu(e),
            i & 512 && (Xl || r === null || _l(r, r.return)),
            i & 64 &&
              Yl &&
              ((e = e.updateQueue),
              e !== null &&
                ((t = e.callbacks),
                t !== null &&
                  ((n = e.shared.hiddenCallbacks),
                  (e.shared.hiddenCallbacks = n === null ? t : n.concat(t))))));
          break;
        case 26:
          if (
            ((a = xu),
            bu(t, e, n),
            Cu(e),
            i & 512 && (Xl || r === null || _l(r, r.return)),
            i & 4)
          ) {
            if (
              ((i = r === null ? null : r.memoizedState),
              (n = e.memoizedState),
              r === null)
            ) {
              if (n === null) {
                if (e.stateNode === null) {
                  if (Yl)
                    e.stateNode = fp(
                      e.type,
                      e.memoizedProps,
                      t.containerInfo,
                      e,
                    );
                  else {
                    a: {
                      ((t = e.type),
                        (n = e.memoizedProps),
                        (i = a.ownerDocument || a));
                      b: switch (t) {
                        case `title`:
                          ((r = i.getElementsByTagName(`title`)[0]),
                            (!r ||
                              r[Ct] ||
                              r[gt] ||
                              r.namespaceURI === `http://www.w3.org/2000/svg` ||
                              r.hasAttribute(`itemprop`)) &&
                              ((r = i.createElement(t)),
                              i.head.insertBefore(
                                r,
                                i.querySelector(`head > title`),
                              )),
                            np(r, t, n),
                            (r[gt] = e),
                            At(r),
                            (t = r));
                          break a;
                        case `link`:
                          if (
                            (a = Gm(`link`, `href`, i).get(t + (n.href || ``)))
                          ) {
                            for (o = 0; o < a.length; o++)
                              if (
                                ((r = a[o]),
                                r.getAttribute(`href`) ===
                                  (n.href == null || n.href === ``
                                    ? null
                                    : n.href) &&
                                  r.getAttribute(`rel`) ===
                                    (n.rel == null ? null : n.rel) &&
                                  r.getAttribute(`title`) ===
                                    (n.title == null ? null : n.title) &&
                                  r.getAttribute(`crossorigin`) ===
                                    (n.crossOrigin == null
                                      ? null
                                      : n.crossOrigin))
                              ) {
                                a.splice(o, 1);
                                break b;
                              }
                          }
                          ((r = i.createElement(t)),
                            np(r, t, n),
                            i.head.appendChild(r));
                          break;
                        case `meta`:
                          if (
                            (a = Gm(`meta`, `content`, i).get(
                              t + (n.content || ``),
                            ))
                          ) {
                            for (o = 0; o < a.length; o++)
                              if (
                                ((r = a[o]),
                                r.getAttribute(`content`) ===
                                  (n.content == null ? null : `` + n.content) &&
                                  r.getAttribute(`name`) ===
                                    (n.name == null ? null : n.name) &&
                                  r.getAttribute(`property`) ===
                                    (n.property == null ? null : n.property) &&
                                  r.getAttribute(`http-equiv`) ===
                                    (n.httpEquiv == null
                                      ? null
                                      : n.httpEquiv) &&
                                  r.getAttribute(`charset`) ===
                                    (n.charSet == null ? null : n.charSet))
                              ) {
                                a.splice(o, 1);
                                break b;
                              }
                          }
                          ((r = i.createElement(t)),
                            np(r, t, n),
                            i.head.appendChild(r));
                          break;
                        default:
                          throw Error(s(468, t));
                      }
                      ((r[gt] = e), At(r), (t = r));
                    }
                    e.stateNode = t;
                  }
                } else Yl || Km(a, e.type, e.stateNode);
              } else e.stateNode = Bm(a, n, e.memoizedProps);
            } else
              i === n
                ? n === null &&
                  e.stateNode !== null &&
                  wl(e, e.memoizedProps, r.memoizedProps)
                : (i === null
                    ? ((t = r.stateNode),
                      t === null || Xl || t.parentNode.removeChild(t))
                    : i.count--,
                  n === null
                    ? Yl || Km(a, e.type, e.stateNode)
                    : Bm(a, n, e.memoizedProps));
          }
          break;
        case 27:
          (bu(t, e, n),
            Cu(e),
            i & 512 && (Xl || r === null || _l(r, r.return)),
            r !== null && i & 4 && wl(e, e.memoizedProps, r.memoizedProps));
          break;
        case 5:
          if (
            ((a = Zl),
            (Zl = !1),
            bu(t, e, n),
            (Zl = a),
            Cu(e),
            i & 512 && (Xl || r === null || _l(r, r.return)),
            e.flags & 32)
          ) {
            t = e.stateNode;
            try {
              (an(t, ``), (Bt = !0));
            } catch (t) {
              df(e, e.return, t);
            }
          }
          (i & 4 &&
            e.stateNode != null &&
            ((t = e.memoizedProps), wl(e, t, r === null ? t : r.memoizedProps)),
            i & 1024 && (Ql = !0));
          break;
        case 6:
          if ((bu(t, e, n), Cu(e), i & 4)) {
            if (e.stateNode === null) throw Error(s(162));
            ((t = e.memoizedProps), (n = e.stateNode));
            try {
              ((n.nodeValue = t), (Bt = !0));
            } catch (t) {
              df(e, e.return, t);
            }
          }
          break;
        case 3:
          if (
            ((Bt = !1),
            (Wm = null),
            (a = xu),
            (xu = bm(t.containerInfo)),
            bu(t, e, n),
            (xu = a),
            Cu(e),
            i & 4 && r !== null && r.memoizedState.isDehydrated)
          )
            try {
              Hh(t.containerInfo);
            } catch (t) {
              df(e, e.return, t);
            }
          (Ql && ((Ql = !1), wu(e)), (Bt = !1));
          break;
        case 4:
          ((i = Zl),
            (Zl = Yl),
            (r = Vt()),
            (a = xu),
            (xu = bm(e.stateNode.containerInfo)),
            bu(t, e, n),
            Cu(e),
            (xu = a),
            Bt && nu && (ru = !0),
            (Bt = r),
            (Zl = i));
          break;
        case 12:
          (bu(t, e, n), Cu(e));
          break;
        case 31:
          (bu(t, e, n),
            Cu(e),
            i & 4 &&
              ((t = e.updateQueue),
              t !== null && ((e.updateQueue = null), yu(e, t))));
          break;
        case 13:
          (bu(t, e, n),
            Cu(e),
            e.child.flags & 8192 &&
              (e.memoizedState !== null) !=
                (r !== null && r.memoizedState !== null) &&
              (dd = Pe()),
            i & 4 &&
              ((t = e.updateQueue),
              t !== null && ((e.updateQueue = null), yu(e, t))));
          break;
        case 22:
          ((a = e.memoizedState !== null),
            (o = r !== null && r.memoizedState !== null));
          var c = Yl,
            l = Xl,
            u = Zl;
          ((Yl = c || a),
            (Zl = u || a),
            (Xl = l || o),
            bu(t, e, n),
            (Xl = l),
            (Zl = u),
            (Yl = c),
            Cu(e),
            i & 8192 &&
              ((t = e.stateNode),
              (t._visibility = a ? t._visibility & -2 : t._visibility | 1),
              !a ||
                r === null ||
                o ||
                Yl ||
                Xl ||
                ((t = o || Xl),
                (n = Yl),
                (r = Xl),
                (Yl = a || Yl),
                (Xl = t),
                Ou(e, 2),
                (Yl = n),
                (Xl = r)),
              (!a && Zl) || cu(e, a)),
            i & 4 &&
              ((t = e.updateQueue),
              t !== null &&
                ((n = t.retryQueue),
                n !== null && ((t.retryQueue = null), yu(e, n)))));
          break;
        case 19:
          (bu(t, e, n),
            Cu(e),
            i & 4 &&
              ((t = e.updateQueue),
              t !== null && ((e.updateQueue = null), yu(e, t))));
          break;
        case 30:
          (i & 512 && (Xl || r === null || _l(r, r.return)),
            (i = Vt()),
            (a = nu),
            (o = (n & 335544064) === n),
            (c = e.memoizedProps),
            (nu = o && pi(c.default, c.update) !== `none`),
            bu(t, e, n),
            Cu(e),
            o && r !== null && Bt && (e.flags |= 4),
            (nu = a),
            (Bt = i));
          break;
        case 21:
          break;
        case 7:
          (i & 512 && (Xl || r === null || _l(r, r.return)),
            r && r.stateNode !== null && (r.stateNode._fragmentFiber = e));
        default:
          (bu(t, e, n), Cu(e));
      }
    }
    function Cu(e) {
      var t = e.flags;
      if (t & 2) {
        try {
          for (var n, r = e.return; r !== null;) {
            if (Tl(r)) {
              n = r;
              break;
            }
            r = r.return;
          }
          r = null;
          for (var i = e.return; i !== null;) {
            if (Sl(i)) {
              var a = i.stateNode;
              r === null ? (r = [a]) : r.push(a);
            }
            if (xl(i)) break;
            i = i.return;
          }
          var o = r;
          if (n == null) throw Error(s(160));
          switch (n.tag) {
            case 27:
              var c = n.stateNode;
              Ol(e, El(e), c, o);
              break;
            case 5:
              var l = n.stateNode;
              (n.flags & 32 && (an(l, ``), (n.flags &= -33)),
                Ol(e, El(e), l, o));
              break;
            case 3:
            case 4:
              var u = n.stateNode.containerInfo;
              Dl(e, El(e), u, o);
              break;
            default:
              throw Error(s(161));
          }
        } catch (t) {
          df(e, e.return, t);
        }
        e.flags &= -3;
      }
      t & 4096 && (e.flags &= -4097);
    }
    function wu(e) {
      if (e.subtreeFlags & 1024)
        for (e = e.child; e !== null;) {
          var t = e;
          (wu(t),
            t.tag === 5 &&
              t.flags & 1024 &&
              ((t = t.stateNode), (gh = !0), t.reset(), (gh = !1)),
            (e = e.sibling));
        }
    }
    function Tu(e, t) {
      if (t.subtreeFlags & 9270)
        for (t = t.child; t !== null;) (Eu(t, e), (t = t.sibling));
      else Jl(t, !1);
    }
    function Eu(e, t) {
      var n = e.alternate;
      if (n === null) Bl(e, !1);
      else
        switch (e.tag) {
          case 3:
            if (((iu = tu = !1), Pl(), Tu(t, e), !tu && !ru)) {
              if (((e = Nl), e !== null))
                for (var r = 0; r < e.length; r += 3) {
                  n = e[r];
                  var i = e[r + 1];
                  (Ep(n, e[r + 2]),
                    (n = n.ownerDocument.documentElement),
                    n !== null &&
                      n.animate(
                        { opacity: [0, 0], pointerEvents: [`none`, `none`] },
                        {
                          duration: 0,
                          fill: `forwards`,
                          pseudoElement: `::view-transition-group(` + i + `)`,
                        },
                      ));
                }
              ((e = t.containerInfo),
                (e =
                  e.nodeType === 9
                    ? e.documentElement
                    : e.ownerDocument.documentElement),
                e !== null &&
                  e.style.viewTransitionName === `` &&
                  ((e.style.viewTransitionName = `none`),
                  e.animate(
                    { opacity: [0, 0], pointerEvents: [`none`, `none`] },
                    {
                      duration: 0,
                      fill: `forwards`,
                      pseudoElement: `::view-transition-group(root)`,
                    },
                  ),
                  e.animate(
                    { width: [0, 0], height: [0, 0] },
                    {
                      duration: 0,
                      fill: `forwards`,
                      pseudoElement: `::view-transition`,
                    },
                  )),
                (iu = !0));
            }
            Nl = null;
            break;
          case 5:
            Tu(t, e);
            break;
          case 4:
            ((r = tu), (tu = !1), Tu(t, e), tu && (ru = !0), (tu = r));
            break;
          case 22:
            e.memoizedState === null &&
              (n.memoizedState === null ? Tu(t, e) : Bl(e, !1));
            break;
          case 30:
            ((r = tu), (i = Pl()), (tu = !1), Tu(t, e), tu && (e.flags |= 4));
            var a = e.memoizedProps,
              o = e.stateNode;
            ((t = di(a, o)), (o = di(n.memoizedProps, o)));
            var s = pi(a.default, a.update);
            (s === `none`
              ? (t = !1)
              : ((a = n.memoizedState),
                (n.memoizedState = null),
                (n = e.child),
                (Fl = 0),
                (t = ql(e, n, t, o, s, a, !0)),
                Fl !== (a === null ? 0 : a.length) && (e.flags |= 32)),
              e.flags & 4 && t
                ? (Ad(e, e.memoizedProps.onUpdate), (Nl = i))
                : i !== null && (i.push.apply(i, Nl), (Nl = i)),
              (tu = e.flags & 32 ? !0 : r));
            break;
          default:
            Tu(t, e);
        }
    }
    function Du(e, t) {
      if (t.subtreeFlags & 8772)
        for (t = t.child; t !== null;) (su(e, t.alternate, t), (t = t.sibling));
    }
    function Ou(e, t) {
      for (e = e.child; e !== null;) {
        var n = e,
          r = t;
        switch (n.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            (pl(4, n, n.return), Ou(n, r));
            break;
          case 1:
            _l(n, n.return);
            var i = n.stateNode;
            (typeof i.componentWillUnmount == `function` && hl(n, n.return, i),
              Ou(n, r));
            break;
          case 27:
            r & 2 && gm(n.stateNode, n.type, n.memoizedProps);
          case 5:
            (_l(n, n.return), (n.tag !== 5 && n.tag !== 27) || bl(n), Ou(n, r));
            break;
          case 6:
            bl(n);
            break;
          case 26:
            (_l(n, n.return),
              (i = n.stateNode),
              n.memoizedState !== null ||
                i === null ||
                Xl ||
                i.parentNode.removeChild(i),
              Ou(n, r));
            break;
          case 22:
            n.memoizedState === null && Ou(n, r);
            break;
          case 30:
            (_l(n, n.return), Ou(n, r));
            break;
          case 7:
            _l(n, n.return);
          default:
            Ou(n, r);
        }
        e = e.sibling;
      }
    }
    function ku(e, t, n) {
      for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
        var r = t.alternate,
          i = e,
          a = t,
          o = a.flags,
          s = !!(n & 1);
        switch (a.tag) {
          case 0:
          case 11:
          case 15:
            (ku(i, a, n), fl(4, a));
            break;
          case 1:
            if (
              (ku(i, a, n),
              (r = a),
              (i = r.stateNode),
              typeof i.componentDidMount == `function`)
            )
              try {
                i.componentDidMount();
              } catch (e) {
                df(r, r.return, e);
              }
            if (((r = a), (i = r.updateQueue), i !== null)) {
              var c = r.stateNode;
              try {
                var l = i.shared.hiddenCallbacks;
                if (l !== null)
                  for (
                    i.shared.hiddenCallbacks = null, i = 0;
                    i < l.length;
                    i++
                  )
                    ho(l[i], c);
              } catch (e) {
                df(r, r.return, e);
              }
            }
            (s && o & 64 && ml(a), gl(a, a.return));
            break;
          case 27:
            n & 2 && kl(a);
          case 5:
            ((a.tag !== 5 && a.tag !== 27) || yl(a),
              ku(i, a, n),
              s && r === null && o & 4 && Cl(a),
              gl(a, a.return));
            break;
          case 6:
            yl(a);
            break;
          case 26:
            ((c = a.stateNode),
              a.memoizedState !== null ||
                c === null ||
                Yl ||
                Km(bm(c.ownerDocument), a.type, c),
              ku(i, a, n),
              s && r === null && o & 4 && Cl(a),
              gl(a, a.return));
            break;
          case 12:
            ku(i, a, n);
            break;
          case 31:
            (ku(i, a, n), s && o & 4 && gu(i, a));
            break;
          case 13:
            (ku(i, a, n), s && o & 4 && _u(i, a));
            break;
          case 22:
            (a.memoizedState === null && ku(i, a, n), gl(a, a.return));
            break;
          case 30:
            (ku(i, a, n), gl(a, a.return));
            break;
          case 7:
            gl(a, a.return);
          default:
            ku(i, a, n);
        }
        t = t.sibling;
      }
    }
    function Au(e, t) {
      var n = null;
      (e !== null &&
        e.memoizedState !== null &&
        e.memoizedState.cachePool !== null &&
        (n = e.memoizedState.cachePool.pool),
        (e = null),
        t.memoizedState !== null &&
          t.memoizedState.cachePool !== null &&
          (e = t.memoizedState.cachePool.pool),
        e !== n && (e != null && e.refCount++, n != null && Ea(n)));
    }
    function ju(e, t) {
      ((e = null),
        t.alternate !== null && (e = t.alternate.memoizedState.cache),
        (t = t.memoizedState.cache),
        t !== e && (t.refCount++, e != null && Ea(e)));
    }
    function Mu(e, t, n, r) {
      var i = (n & 335544064) === n;
      if (t.subtreeFlags & (i ? 10262 : 10256))
        for (t = t.child; t !== null;) (Nu(e, t, n, r), (t = t.sibling));
      else i && Kl(t);
    }
    function Nu(e, t, n, r) {
      var i = (n & 335544064) === n;
      i &&
        t.alternate === null &&
        t.return !== null &&
        t.return.alternate !== null &&
        Gl(t);
      var a = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          (Mu(e, t, n, r), a & 2048 && fl(9, t));
          break;
        case 1:
          Mu(e, t, n, r);
          break;
        case 3:
          (Mu(e, t, n, r),
            i &&
              iu &&
              ((e = e.containerInfo),
              (e =
                e.nodeType === 9
                  ? e.body
                  : e.nodeName === `HTML`
                    ? e.ownerDocument.body
                    : e),
              e.style.viewTransitionName === `root` &&
                (e.style.viewTransitionName = ``),
              (e = e.ownerDocument.documentElement),
              e !== null &&
                e.style.viewTransitionName === `none` &&
                (e.style.viewTransitionName = ``)),
            a & 2048 &&
              ((a = null),
              t.alternate !== null && (a = t.alternate.memoizedState.cache),
              (t = t.memoizedState.cache),
              t !== a && (t.refCount++, a != null && Ea(a))));
          break;
        case 12:
          if (a & 2048) {
            (Mu(e, t, n, r), (a = t.stateNode));
            try {
              var o = t.memoizedProps,
                s = o.id,
                c = o.onPostCommit;
              typeof c == `function` &&
                c(
                  s,
                  t.alternate === null ? `mount` : `update`,
                  a.passiveEffectDuration,
                  -0,
                );
            } catch (e) {
              df(t, t.return, e);
            }
          } else Mu(e, t, n, r);
          break;
        case 31:
          Mu(e, t, n, r);
          break;
        case 13:
          Mu(e, t, n, r);
          break;
        case 23:
          break;
        case 22:
          ((o = t.stateNode),
            (s = t.alternate),
            t.memoizedState === null
              ? (i && s !== null && s.memoizedState !== null && Gl(t),
                o._visibility & 2
                  ? Mu(e, t, n, r)
                  : ((o._visibility |= 2),
                    Pu(e, t, n, r, !!(t.subtreeFlags & 10256) || !1)))
              : (i && s !== null && s.memoizedState === null && Gl(s),
                o._visibility & 2 ? Mu(e, t, n, r) : Fu(e, t)),
            a & 2048 && Au(s, t));
          break;
        case 24:
          (Mu(e, t, n, r), a & 2048 && ju(t.alternate, t));
          break;
        case 30:
          (i &&
            ((a = t.alternate),
            a !== null && (Rl(a.child, !0), Rl(t.child, !0))),
            Mu(e, t, n, r));
          break;
        default:
          Mu(e, t, n, r);
      }
    }
    function Pu(e, t, n, r, i) {
      for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
        var a = e,
          o = t,
          s = n,
          c = r,
          l = o.flags;
        switch (o.tag) {
          case 0:
          case 11:
          case 15:
            (Pu(a, o, s, c, i), fl(8, o));
            break;
          case 23:
            break;
          case 22:
            var u = o.stateNode;
            (o.memoizedState === null
              ? ((u._visibility |= 2), Pu(a, o, s, c, i))
              : u._visibility & 2
                ? Pu(a, o, s, c, i)
                : Fu(a, o),
              i && l & 2048 && Au(o.alternate, o));
            break;
          case 24:
            (Pu(a, o, s, c, i), i && l & 2048 && ju(o.alternate, o));
            break;
          default:
            Pu(a, o, s, c, i);
        }
        t = t.sibling;
      }
    }
    function Fu(e, t) {
      if (t.subtreeFlags & 10256)
        for (t = t.child; t !== null;) {
          var n = e,
            r = t,
            i = r.flags;
          switch (r.tag) {
            case 22:
              (Fu(n, r), i & 2048 && Au(r.alternate, r));
              break;
            case 24:
              (Fu(n, r), i & 2048 && ju(r.alternate, r));
              break;
            default:
              Fu(n, r);
          }
          t = t.sibling;
        }
    }
    var Iu = 8192;
    function Lu(e, t, n) {
      if (e.subtreeFlags & Iu)
        for (e = e.child; e !== null;) (Ru(e, t, n), (e = e.sibling));
    }
    function Ru(e, t, n) {
      switch (e.tag) {
        case 26:
          (Lu(e, t, n),
            e.flags & Iu &&
              (e.memoizedState === null
                ? ((e = e.stateNode), (t & 335544128) === t && Zm(n, e))
                : Qm(n, xu, e.memoizedState, e.memoizedProps)));
          break;
        case 5:
          (Lu(e, t, n),
            e.flags & Iu &&
              ((e = e.stateNode), (t & 335544128) === t && Zm(n, e)));
          break;
        case 3:
        case 4:
          var r = xu;
          ((xu = bm(e.stateNode.containerInfo)), Lu(e, t, n), (xu = r));
          break;
        case 22:
          e.memoizedState === null &&
            ((r = e.alternate),
            r !== null && r.memoizedState !== null
              ? ((r = Iu), (Iu = 16777216), Lu(e, t, n), (Iu = r))
              : Lu(e, t, n));
          break;
        case 30:
          if (
            (e.flags & Iu) !== 0 &&
            ((r = e.memoizedProps.name), r != null && r !== `auto`)
          ) {
            var i = e.stateNode;
            ((i.paired = null), jl === null && (jl = new Map()), jl.set(r, i));
          }
          Lu(e, t, n);
          break;
        default:
          Lu(e, t, n);
      }
    }
    function zu(e) {
      var t = e.alternate;
      if (t !== null && ((e = t.child), e !== null)) {
        t.child = null;
        do ((t = e.sibling), (e.sibling = null), (e = t));
        while (e !== null);
      }
    }
    function Bu(e) {
      var t = e.deletions;
      if (e.flags & 16) {
        if (t !== null)
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            ((eu = r), Uu(r, e));
          }
        zu(e);
      }
      if (e.subtreeFlags & 10256)
        for (e = e.child; e !== null;) (Vu(e), (e = e.sibling));
    }
    function Vu(e) {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          (Bu(e), e.flags & 2048 && pl(9, e, e.return));
          break;
        case 3:
          Bu(e);
          break;
        case 12:
          Bu(e);
          break;
        case 22:
          var t = e.stateNode;
          e.memoizedState !== null &&
          t._visibility & 2 &&
          (e.return === null || e.return.tag !== 13)
            ? ((t._visibility &= -3), Hu(e))
            : Bu(e);
          break;
        default:
          Bu(e);
      }
    }
    function Hu(e) {
      var t = e.deletions;
      if (e.flags & 16) {
        if (t !== null)
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            ((eu = r), Uu(r, e));
          }
        zu(e);
      }
      for (e = e.child; e !== null;) {
        switch (((t = e), t.tag)) {
          case 0:
          case 11:
          case 15:
            (pl(8, t, t.return), Hu(t));
            break;
          case 22:
            ((n = t.stateNode),
              n._visibility & 2 && ((n._visibility &= -3), Hu(t)));
            break;
          default:
            Hu(t);
        }
        e = e.sibling;
      }
    }
    function Uu(e, t) {
      for (; eu !== null;) {
        var n = eu;
        switch (n.tag) {
          case 0:
          case 11:
          case 15:
            pl(8, n, t);
            break;
          case 23:
          case 22:
            if (
              n.memoizedState !== null &&
              n.memoizedState.cachePool !== null
            ) {
              var r = n.memoizedState.cachePool.pool;
              r != null && r.refCount++;
            }
            break;
          case 24:
            Ea(n.memoizedState.cache);
        }
        if (((r = n.child), r !== null)) ((r.return = n), (eu = r));
        else
          a: for (n = e; eu !== null;) {
            r = eu;
            var i = r.sibling,
              a = r.return;
            if ((du(r), r === n)) {
              eu = null;
              break a;
            }
            if (i !== null) {
              ((i.return = a), (eu = i));
              break a;
            }
            eu = a;
          }
      }
    }
    var Wu = {
        getCacheForType: function (e) {
          var t = va(wa),
            n = t.data.get(e);
          return (n === void 0 && ((n = e()), t.data.set(e, n)), n);
        },
        cacheSignal: function () {
          return va(wa).controller.signal;
        },
      },
      Gu = typeof WeakMap == `function` ? WeakMap : Map,
      Ku = 0,
      qu = null,
      Ju = null,
      Yu = 0,
      Xu = 0,
      Zu = null,
      Qu = !1,
      $u = !1,
      ed = !1,
      td = 0,
      nd = 0,
      rd = 0,
      id = 0,
      ad = 0,
      od = 0,
      sd = 0,
      cd = null,
      ld = null,
      ud = !1,
      dd = 0,
      fd = 0,
      pd = 1 / 0,
      md = null,
      hd = null,
      gd = 0,
      _d = null,
      vd = null,
      yd = 0,
      bd = 0,
      xd = null,
      Sd = null,
      Cd = null,
      wd = null,
      Td = null,
      Ed = 0,
      Dd = null;
    function Od() {
      return Ku & 2 && Yu !== 0 ? Yu & -Yu : B.T === null ? pt() : Mf();
    }
    function kd() {
      if (od === 0) {
        if (!(Yu & 536870912) || K) {
          var e = Ze;
          ((Ze <<= 1), !(Ze & 3932160) && (Ze = 262144), (od = e));
        } else od = 536870912;
      }
      return ((e = So.current), e !== null && (e.flags |= 32), od);
    }
    function Ad(e, t) {
      if (t != null) {
        var n = e.stateNode,
          r = n.ref;
        (r === null && (r = n.ref = Pp(di(e.memoizedProps, n))),
          wd === null && (wd = []),
          wd.push(t.bind(null, r)));
      }
    }
    function jd(e, t, n) {
      (((e === qu && (Xu === 2 || Xu === 9)) ||
        e.cancelPendingCommit !== null) &&
        (Rd(e, 0), Fd(e, Yu, od, !1)),
        ot(e, n),
        (Ku & 2 && e === qu) ||
          (e === qu && (!(Ku & 2) && (id |= n), nd === 4 && Fd(e, Yu, od, !1)),
          wf(e)));
    }
    function Md(e, t, n) {
      if (Ku & 6) throw Error(s(327));
      var r = (!n && !(t & 127) && (t & e.expiredLanes) === 0) || tt(e, t),
        i = r ? Kd(e, t) : Wd(e, t, !0),
        a = r;
      do {
        if (i === 0) {
          $u && !r && Fd(e, t, 0, !1);
          break;
        }
        if (((n = e.current.alternate), a && !Pd(n)))
          ((i = Wd(e, t, !1)), (a = !1));
        else {
          if (i === 2) {
            if (((a = t), e.errorRecoveryDisabledLanes & a)) var o = 0;
            else
              ((o = e.pendingLanes & -536870913),
                (o = o === 0 ? (o & 536870912 ? 536870912 : 0) : o));
            if (o !== 0) {
              t = o;
              a: {
                var c = e;
                i = cd;
                var l = c.current.memoizedState.isDehydrated;
                if (
                  (l && (Rd(c, o).flags |= 256),
                  (o = Wd(c, o, !1)),
                  o !== 2 && o !== 6)
                ) {
                  if (ed && !l) {
                    ((c.errorRecoveryDisabledLanes |= a), (id |= a), (i = 4));
                    break a;
                  }
                  ((a = ld),
                    (ld = i),
                    a !== null &&
                      (ld === null ? (ld = a) : ld.push.apply(ld, a)));
                }
                i = o;
              }
              if (((a = !1), i !== 2)) continue;
            }
          }
          if (i === 1) {
            (Rd(e, 0), Fd(e, t, 0, !0));
            break;
          }
          a: {
            switch (((r = e), (a = i), a)) {
              case 0:
              case 1:
                throw Error(s(345));
              case 4:
                if ((t & 4194048) !== t && (t & 62914560) !== t) break;
              case 6:
                Fd(r, t, od, !Qu);
                break a;
              case 2:
                ld = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(s(329));
            }
            if ((t & 62914560) === t && ((i = dd + 300 - Pe()), 10 < i)) {
              if ((Fd(r, t, od, !Qu), et(r, 0, !0) !== 0)) break a;
              ((yd = t),
                (r.timeoutHandle = gp(
                  Nd.bind(
                    null,
                    r,
                    n,
                    ld,
                    md,
                    ud,
                    t,
                    od,
                    id,
                    sd,
                    Qu,
                    a,
                    `Throttled`,
                    -0,
                    0,
                  ),
                  i,
                )));
              break a;
            }
            Nd(r, n, ld, md, ud, t, od, id, sd, Qu, a, null, -0, 0);
          }
          break;
        }
      } while (1);
      wf(e);
    }
    function Nd(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
      e.timeoutHandle = -1;
      var m = t.subtreeFlags,
        h = (a & 335544064) === a;
      ((d = null),
        (h || m & 8192 || (m & 16785408) == 16785408) &&
        ((d = {
          stylesheets: null,
          count: 0,
          imgCount: 0,
          imgBytes: 0,
          suspenseyImages: [],
          waitingForImages: !0,
          waitingForViewTransition: !1,
          unsuspend: pn,
        }),
        (jl = null),
        Ru(t, a, d),
        h &&
          ((m = d),
          (h = e.containerInfo),
          (h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition),
          h != null &&
            (m.count++,
            (m.waitingForViewTransition = !0),
            (m = nh.bind(m)),
            h.finished.then(m, m))),
        (m =
          (a & 62914560) === a
            ? dd - Pe()
            : (a & 4194048) === a
              ? fd - Pe()
              : 0),
        (m = eh(d, m)),
        m !== null)
          ? ((yd = a),
            (e.cancelPendingCommit = m(
              $d.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p),
            )),
            Fd(e, a, o, !l))
          : $d(e, t, a, n, r, i, o, s, c, l, u, d));
    }
    function Pd(e) {
      for (var t = e; ;) {
        var n = t.tag;
        if (
          (n === 0 || n === 11 || n === 15) &&
          t.flags & 16384 &&
          ((n = t.updateQueue), n !== null && ((n = n.stores), n !== null))
        )
          for (var r = 0; r < n.length; r++) {
            var i = n[r],
              a = i.getSnapshot;
            i = i.value;
            try {
              if (!Fr(a(), i)) return !1;
            } catch {
              return !1;
            }
          }
        if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
          ((n.return = t), (t = n));
        else {
          if (t === e) break;
          for (; t.sibling === null;) {
            if (t.return === null || t.return === e) return !0;
            t = t.return;
          }
          ((t.sibling.return = t.return), (t = t.sibling));
        }
      }
      return !0;
    }
    function Fd(e, t, n, r) {
      ((t = nt(e, t)),
        (t &= ~ad),
        (t &= ~id),
        (e.suspendedLanes |= t),
        (e.pingedLanes &= ~t),
        r && (e.warmLanes |= t),
        (r = e.expirationTimes));
      for (var i = t; 0 < i;) {
        var a = 31 - Ke(i),
          o = 1 << a;
        ((r[a] = -1), (i &= ~o));
      }
      n !== 0 && ct(e, n, t);
    }
    function Id() {
      return Ku & 6 ? !0 : (Tf(0, !1), !1);
    }
    function Ld() {
      if (Ju !== null) {
        if (Xu === 0) var e = Ju.return;
        else
          ((e = Ju), (ua = la = null), Zo(e), (Xa = null), (Za = 0), (e = Ju));
        for (; e !== null;) (dl(e.alternate, e), (e = e.return));
        Ju = null;
      }
    }
    function Rd(e, t) {
      var n = e.timeoutHandle;
      return (
        n !== -1 && ((e.timeoutHandle = -1), _p(n)),
        (n = e.cancelPendingCommit),
        n !== null && ((e.cancelPendingCommit = null), n()),
        (yd = 0),
        Ld(),
        (qu = e),
        (Ju = n = Oi(e.current, null)),
        (Yu = t),
        (Xu = 0),
        (Zu = null),
        (Qu = !1),
        ($u = tt(e, t)),
        (ed = !1),
        (sd = od = ad = id = rd = nd = 0),
        (ld = cd = null),
        (ud = !1),
        (td = nt(e, t)),
        vi(),
        n
      );
    }
    function zd(e, t) {
      ((X = null),
        (B.H = ac),
        t === Ba || t === Ha
          ? ((t = Ja()), (Xu = 3))
          : t === Va
            ? ((t = Ja()), (Xu = 4))
            : (Xu =
                t === Sc
                  ? 8
                  : typeof t == `object` && t && typeof t.then == `function`
                    ? 6
                    : 1),
        (Zu = t),
        Ju === null && ((nd = 1), gc(e, Ii(t, e.current))));
    }
    function Bd() {
      var e = So.current;
      return e === null
        ? !0
        : (Yu & 4194048) === Yu
          ? Co === null
          : (Yu & 62914560) === Yu || Yu & 536870912
            ? e === Co
            : !1;
    }
    function Vd() {
      var e = B.H;
      return ((B.H = ac), e === null ? ac : e);
    }
    function Hd() {
      var e = B.A;
      return ((B.A = Wu), e);
    }
    function Ud() {
      ((nd = 4),
        Qu || ((Yu & 4194048) !== Yu && So.current !== null) || ($u = !0),
        (!(rd & 134217727) && !(id & 134217727)) ||
          qu === null ||
          Fd(qu, Yu, od, !1));
    }
    function Wd(e, t, n) {
      var r = Ku;
      Ku |= 2;
      var i = Vd(),
        a = Hd();
      ((qu !== e || Yu !== t) && ((md = null), Rd(e, t)), (t = !1));
      var o = nd;
      a: do
        try {
          if (Xu !== 0 && Ju !== null) {
            var s = Ju,
              c = Zu;
            switch (Xu) {
              case 8:
                (Ld(), (o = 6));
                break a;
              case 3:
              case 2:
              case 9:
              case 6:
                So.current === null && (t = !0);
                var l = Xu;
                if (((Xu = 0), (Zu = null), Xd(e, s, c, l), n && $u)) {
                  o = 0;
                  break a;
                }
                break;
              default:
                ((l = Xu), (Xu = 0), (Zu = null), Xd(e, s, c, l));
            }
          }
          (Gd(), (o = nd));
          break;
        } catch (t) {
          zd(e, t);
        }
      while (1);
      return (
        t && e.shellSuspendCounter++,
        (ua = la = null),
        (Ku = r),
        (B.H = i),
        (B.A = a),
        Ju === null && ((qu = null), (Yu = 0), vi()),
        o
      );
    }
    function Gd() {
      for (; Ju !== null;) Jd(Ju);
    }
    function Kd(e, t) {
      var n = Ku;
      Ku |= 2;
      var r = Vd(),
        i = Hd();
      qu !== e || Yu !== t
        ? ((md = null), (pd = Pe() + 500), Rd(e, t))
        : ($u = tt(e, t));
      a: do
        try {
          if (Xu !== 0 && Ju !== null) {
            t = Ju;
            var a = Zu;
            b: switch (Xu) {
              case 1:
                ((Xu = 0), (Zu = null), Xd(e, t, a, 1));
                break;
              case 2:
              case 9:
                if (Wa(a)) {
                  ((Xu = 0), (Zu = null), Yd(t));
                  break;
                }
                ((t = function () {
                  ((Xu !== 2 && Xu !== 9) || qu !== e || (Xu = 7), wf(e));
                }),
                  a.then(t, t));
                break a;
              case 3:
                Xu = 7;
                break a;
              case 4:
                Xu = 5;
                break a;
              case 7:
                Wa(a)
                  ? ((Xu = 0), (Zu = null), Yd(t))
                  : ((Xu = 0), (Zu = null), Xd(e, t, a, 7));
                break;
              case 5:
                var o = null;
                switch (Ju.tag) {
                  case 26:
                    o = Ju.memoizedState;
                  case 5:
                  case 27:
                    var c = Ju;
                    if (o ? Ym(o) : c.stateNode.complete) {
                      ((Xu = 0), (Zu = null));
                      var l = c.sibling;
                      if (l !== null) Ju = l;
                      else {
                        var u = c.return;
                        u === null ? (Ju = null) : ((Ju = u), Zd(u));
                      }
                      break b;
                    }
                }
                ((Xu = 0), (Zu = null), Xd(e, t, a, 5));
                break;
              case 6:
                ((Xu = 0), (Zu = null), Xd(e, t, a, 6));
                break;
              case 8:
                (Ld(), (nd = 6));
                break a;
              default:
                throw Error(s(462));
            }
          }
          qd();
          break;
        } catch (t) {
          zd(e, t);
        }
      while (1);
      return (
        (ua = la = null),
        (B.H = r),
        (B.A = i),
        (Ku = n),
        Ju === null ? ((qu = null), (Yu = 0), vi(), nd) : 0
      );
    }
    function qd() {
      for (; Ju !== null && !Me();) Jd(Ju);
    }
    function Jd(e) {
      var t = nl(e.alternate, e, td);
      ((e.memoizedProps = e.pendingProps), t === null ? Zd(e) : (Ju = t));
    }
    function Yd(e) {
      var t = e,
        n = t.alternate;
      switch (t.tag) {
        case 15:
        case 0:
          t = Ic(n, t, t.pendingProps, t.type, void 0, Yu);
          break;
        case 11:
          t = Ic(n, t, t.pendingProps, t.type.render, t.ref, Yu);
          break;
        case 5:
          Zo(t);
          var r = t;
          r === Zi &&
            (K
              ? (ia(r),
                r.tag === 5 && r.stateNode != null && (Qi = r.stateNode))
              : (ia(r), (K = !0)));
        default:
          (dl(n, t), (t = Ju = ki(t, td)), (t = nl(n, t, td)));
      }
      ((e.memoizedProps = e.pendingProps), t === null ? Zd(e) : (Ju = t));
    }
    function Xd(e, t, n, r) {
      ((ua = la = null), Zo(t), (Xa = null), (Za = 0));
      var i = t.return;
      try {
        if (xc(e, i, t, n, Yu)) {
          ((nd = 1), gc(e, Ii(n, e.current)), (Ju = null));
          return;
        }
      } catch (t) {
        if (i !== null) throw ((Ju = i), t);
        ((nd = 1), gc(e, Ii(n, e.current)), (Ju = null));
        return;
      }
      t.flags & 32768
        ? (K || r === 1
            ? (e = !0)
            : $u || Yu & 536870912
              ? (e = !1)
              : ((Qu = e = !0),
                (r === 2 || r === 9 || r === 3 || r === 6) &&
                  ((r = So.current),
                  r !== null && r.tag === 13 && (r.flags |= 16384))),
          Qd(t, e))
        : Zd(t);
    }
    function Zd(e) {
      var t = e;
      do {
        if (t.flags & 32768) {
          Qd(t, Qu);
          return;
        }
        e = t.return;
        var n = ll(t.alternate, t, td);
        if (n !== null) {
          Ju = n;
          return;
        }
        if (((t = t.sibling), t !== null)) {
          Ju = t;
          return;
        }
        Ju = t = e;
      } while (t !== null);
      nd === 0 && (nd = 5);
    }
    function Qd(e, t) {
      do {
        var n = ul(e.alternate, e);
        if (n !== null) {
          ((n.flags &= 32767), (Ju = n));
          return;
        }
        if (
          ((n = e.return),
          n !== null &&
            ((n.flags |= 32768), (n.subtreeFlags = 0), (n.deletions = null)),
          !t && ((e = e.sibling), e !== null))
        ) {
          Ju = e;
          return;
        }
        Ju = e = n;
      } while (e !== null);
      ((nd = 6), (Ju = null));
    }
    function $d(e, t, n, r, i, a, o, c, l, u, d, f) {
      e.cancelPendingCommit = null;
      do cf();
      while (gd !== 0);
      if (Ku & 6) throw Error(s(327));
      if (t !== null) {
        if (t === e.current) throw Error(s(177));
        (e === qu && ((Ju = qu = null), (Yu = 0)),
          (vd = t),
          (_d = e),
          (yd = n),
          (xd = i),
          (Sd = r),
          ef(e, t, n, o, c, l, f));
      }
    }
    function ef(e, t, n, r, i, a, o) {
      var s = t.lanes | t.childLanes;
      if (
        ((bd = s),
        (s |= _i),
        st(e, n, s, r, i, a),
        (wd = null),
        (n & 335544064) === n
          ? ((Td = Oa(e)), (r = 10262))
          : ((Td = null), (r = 10256)),
        (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0
          ? ((e.callbackNode = null),
            (e.callbackPriority = 0),
            _f(Re, function () {
              return (lf(), null);
            }))
          : ((e.callbackNode = null), (e.callbackPriority = 0)),
        (Al = !1),
        (r = !!(t.flags & 13878)),
        t.subtreeFlags & 13878 || r)
      ) {
        ((r = B.T), (B.T = null), (i = V.p), (V.p = 2), (a = Ku), (Ku |= 4));
        try {
          au(e, t, n);
        } finally {
          ((Ku = a), (V.p = i), (B.T = r));
        }
      }
      ((gd = 1),
        Al
          ? (Cd = Mp(
              o,
              e.containerInfo,
              Td,
              rf,
              af,
              nf,
              of,
              lf,
              tf,
              null,
              null,
            ))
          : (rf(), af(), of()));
    }
    function tf(e) {
      if (gd !== 0) {
        var t = _d.onRecoverableError;
        t(e, { componentStack: null });
      }
    }
    function nf() {
      gd === 3 && ((gd = 0), Eu(vd, _d), (gd = 4));
    }
    function rf() {
      if (gd === 1) {
        gd = 0;
        var e = _d,
          t = vd,
          n = yd,
          r = !!(t.flags & 13878);
        if (t.subtreeFlags & 13878 || r) {
          ((r = B.T), (B.T = null));
          var i = V.p;
          V.p = 2;
          var a = Ku;
          Ku |= 4;
          try {
            ((nu = ru = !1), Su(t, e, n), (n = cp));
            var o = Vr(e.containerInfo),
              s = n.focusedElem,
              c = n.selectionRange;
            if (
              o !== s &&
              s &&
              s.ownerDocument &&
              Br(s.ownerDocument.documentElement, s)
            ) {
              if (c !== null && Hr(s)) {
                var l = c.start,
                  u = c.end;
                if ((u === void 0 && (u = l), `selectionStart` in s))
                  ((s.selectionStart = l),
                    (s.selectionEnd = Math.min(u, s.value.length)));
                else {
                  var d = s.ownerDocument || document,
                    f = (d && d.defaultView) || window;
                  if (f.getSelection) {
                    var p = f.getSelection(),
                      m = s.textContent.length,
                      h = Math.min(c.start, m),
                      g = c.end === void 0 ? h : Math.min(c.end, m);
                    !p.extend && h > g && ((o = g), (g = h), (h = o));
                    var _ = zr(s, h),
                      v = zr(s, g);
                    if (
                      _ &&
                      v &&
                      (p.rangeCount !== 1 ||
                        p.anchorNode !== _.node ||
                        p.anchorOffset !== _.offset ||
                        p.focusNode !== v.node ||
                        p.focusOffset !== v.offset)
                    ) {
                      var y = d.createRange();
                      (y.setStart(_.node, _.offset),
                        p.removeAllRanges(),
                        h > g
                          ? (p.addRange(y), p.extend(v.node, v.offset))
                          : (y.setEnd(v.node, v.offset), p.addRange(y)));
                    }
                  }
                }
              }
              for (d = [], p = s; (p = p.parentNode);)
                p.nodeType === 1 &&
                  d.push({ element: p, left: p.scrollLeft, top: p.scrollTop });
              for (
                typeof s.focus == `function` && s.focus(), s = 0;
                s < d.length;
                s++
              ) {
                var b = d[s];
                ((b.element.scrollLeft = b.left),
                  (b.element.scrollTop = b.top));
              }
            }
            ((gh = !!sp), (cp = sp = null));
          } finally {
            ((Ku = a), (V.p = i), (B.T = r));
          }
        }
        ((e.current = t), (gd = 2));
      }
    }
    function af() {
      if (gd === 2) {
        gd = 0;
        var e = _d,
          t = vd,
          n = !!(t.flags & 8772);
        if (t.subtreeFlags & 8772 || n) {
          ((n = B.T), (B.T = null));
          var r = V.p;
          V.p = 2;
          var i = Ku;
          Ku |= 4;
          try {
            su(e, t.alternate, t);
          } finally {
            ((Ku = i), (V.p = r), (B.T = n));
          }
        }
        gd = 3;
      }
    }
    function of() {
      if (gd === 4 || gd === 3) {
        gd = 0;
        var e = Cd;
        ((Cd = null), Ne());
        var t = _d,
          n = vd,
          r = yd,
          i = Sd,
          a = (r & 335544064) === r ? 10262 : 10256;
        if (
          ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0
            ? (gd = 5)
            : ((gd = 0), (vd = _d = null), sf(t, t.pendingLanes)),
          (a = t.pendingLanes),
          a === 0 && (hd = null),
          ft(r),
          (n = n.stateNode),
          We && typeof We.onCommitFiberRoot == `function`)
        )
          try {
            We.onCommitFiberRoot(Ue, n, void 0, (n.current.flags & 128) == 128);
          } catch {}
        if (i !== null) {
          ((n = B.T), (a = V.p), (V.p = 2), (B.T = null));
          try {
            for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
              var c = i[s];
              o(c.value, { componentStack: c.stack });
            }
          } finally {
            ((B.T = n), (V.p = a));
          }
        }
        if (
          ((i = wd),
          (o = Td),
          (Td = null),
          i !== null && ((wd = null), o === null && (o = []), e !== null))
        )
          for (c = 0; c < i.length; c++)
            ((n = (0, i[c])(o)), n !== void 0 && e.finished.finally(n));
        (yd & 3 && cf(),
          wf(t),
          (a = t.pendingLanes),
          r & 261930 && a & 42
            ? t === Dd
              ? Ed++
              : ((Ed = 0), (Dd = t))
            : ((Ed = 0), (Dd = null)),
          Tf(0, !1));
      }
    }
    function sf(e, t) {
      (e.pooledCacheLanes &= t) === 0 &&
        ((t = e.pooledCache), t != null && ((e.pooledCache = null), Ea(t)));
    }
    function cf() {
      return (
        Cd !== null && (Cd.skipTransition(), (Cd = null)),
        rf(),
        af(),
        of(),
        lf()
      );
    }
    function lf() {
      if (gd !== 5) return !1;
      var e = _d,
        t = bd;
      bd = 0;
      var n = ft(yd),
        r = B.T,
        i = V.p;
      try {
        ((V.p = 32 > n ? 32 : n), (B.T = null), (n = xd), (xd = null));
        var a = _d,
          o = yd;
        if (((gd = 0), (vd = _d = null), (yd = 0), Ku & 6)) throw Error(s(331));
        var c = Ku;
        if (
          ((Ku |= 4),
          Vu(a.current),
          Nu(a, a.current, o, n),
          (Ku = c),
          Tf(0, !1),
          We && typeof We.onPostCommitFiberRoot == `function`)
        )
          try {
            We.onPostCommitFiberRoot(Ue, a);
          } catch {}
        return !0;
      } finally {
        ((V.p = i), (B.T = r), sf(e, t));
      }
    }
    function uf(e, t, n) {
      ((t = Ii(n, t)),
        (t = vc(e.stateNode, t, 2)),
        (e = co(e, t, 2)),
        e !== null && (ot(e, 2), wf(e)));
    }
    function df(e, t, n) {
      if (e.tag === 3) uf(e, e, n);
      else
        for (; t !== null;) {
          if (t.tag === 3) {
            uf(t, e, n);
            break;
          }
          if (t.tag === 1) {
            var r = t.stateNode;
            if (
              typeof t.type.getDerivedStateFromError == `function` ||
              (typeof r.componentDidCatch == `function` &&
                (hd === null || !hd.has(r)))
            ) {
              ((e = Ii(n, e)),
                (n = yc(2)),
                (r = co(t, n, 2)),
                r !== null && (bc(n, r, t, e), ot(r, 2), wf(r)));
              break;
            }
          }
          t = t.return;
        }
    }
    function ff(e, t, n) {
      var r = e.pingCache;
      if (r === null) {
        r = e.pingCache = new Gu();
        var i = new Set();
        r.set(t, i);
      } else ((i = r.get(t)), i === void 0 && ((i = new Set()), r.set(t, i)));
      i.has(n) ||
        ((ed = !0), i.add(n), (e = pf.bind(null, e, t, n)), t.then(e, e));
    }
    function pf(e, t, n) {
      var r = e.pingCache;
      (r !== null && r.delete(t),
        (e.pingedLanes |= e.suspendedLanes & n),
        (e.warmLanes &= ~n),
        qu === e &&
          (Yu & n) === n &&
          (nd === 4 || (nd === 3 && (Yu & 62914560) === Yu && 300 > Pe() - dd)
            ? Ku & 2
              ? (ad |= n)
              : Rd(e, 0)
            : (ad |= n),
          sd === Yu && (sd = 0)),
        wf(e));
    }
    function mf(e, t) {
      (t === 0 && (t = it()), (e = xi(e, t)), e !== null && (ot(e, t), wf(e)));
    }
    function hf(e) {
      var t = e.memoizedState,
        n = 0;
      (t !== null && (n = t.retryLane), mf(e, n));
    }
    function gf(e, t) {
      var n = 0;
      switch (e.tag) {
        case 31:
        case 13:
          var r = e.stateNode,
            i = e.memoizedState;
          i !== null && (n = i.retryLane);
          break;
        case 19:
          r = e.stateNode;
          break;
        case 22:
          r = e.stateNode._retryCache;
          break;
        default:
          throw Error(s(314));
      }
      (r !== null && r.delete(t), mf(e, n));
    }
    function _f(e, t) {
      return Ae(e, t);
    }
    var vf = null,
      yf = null,
      bf = !1,
      xf = !1,
      Sf = !1,
      Cf = 0;
    function wf(e) {
      (e !== yf &&
        e.next === null &&
        (yf === null ? (vf = yf = e) : (yf = yf.next = e)),
        (xf = !0),
        bf || ((bf = !0), jf()));
    }
    function Tf(e, t) {
      if (!Sf && xf) {
        Sf = !0;
        do
          for (var n = !1, r = vf; r !== null;) {
            if (!t) {
              if (e !== 0) {
                var i = r.pendingLanes;
                if (i === 0) var a = 0;
                else {
                  var o = r.suspendedLanes,
                    s = r.pingedLanes;
                  ((a = (1 << (31 - Ke(42 | e) + 1)) - 1),
                    (a &= i & ~(o & ~s)),
                    (a = a & 201326741 ? (a & 201326741) | 1 : a ? a | 2 : 0));
                }
                a !== 0 && ((n = !0), Af(r, a));
              } else
                ((a = Yu),
                  (a = et(
                    r,
                    r === qu ? a : 0,
                    r.cancelPendingCommit !== null || r.timeoutHandle !== -1,
                  )),
                  !(a & 3) || tt(r, a) || ((n = !0), Af(r, a)));
            }
            r = r.next;
          }
        while (n);
        Sf = !1;
      }
    }
    function Ef() {
      Df();
    }
    function Df() {
      xf = bf = !1;
      var e = 0;
      Cf !== 0 && hp() && (e = Cf);
      for (var t = Pe(), n = null, r = vf; r !== null;) {
        var i = r.next,
          a = Of(r, t);
        (a === 0
          ? ((r.next = null),
            n === null ? (vf = i) : (n.next = i),
            i === null && (yf = n))
          : ((n = r), (e !== 0 || a & 3) && (xf = !0)),
          (r = i));
      }
      ((gd !== 0 && gd !== 5) || Tf(e, !1), Cf !== 0 && (Cf = 0));
    }
    function Of(e, t) {
      for (
        var n = e.suspendedLanes,
          r = e.pingedLanes,
          i = e.expirationTimes,
          a = e.pendingLanes & -62914561;
        0 < a;
      ) {
        var o = 31 - Ke(a),
          s = 1 << o,
          c = i[o];
        (c === -1
          ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = rt(s, t))
          : c <= t && (e.expiredLanes |= s),
          (a &= ~s));
      }
      if (
        ((t = qu),
        (n = Yu),
        (n = et(
          e,
          e === t ? n : 0,
          e.cancelPendingCommit !== null || e.timeoutHandle !== -1,
        )),
        (r = e.callbackNode),
        n === 0 ||
          (e === t && (Xu === 2 || Xu === 9)) ||
          e.cancelPendingCommit !== null)
      )
        return (
          r !== null && r !== null && je(r),
          (e.callbackNode = null),
          (e.callbackPriority = 0)
        );
      if (!(n & 3) || tt(e, n)) {
        if (((t = n & -n), t === e.callbackPriority)) return t;
        switch ((r !== null && je(r), ft(n))) {
          case 2:
          case 8:
            n = Le;
            break;
          case 32:
            n = Re;
            break;
          case 268435456:
            n = Be;
            break;
          default:
            n = Re;
        }
        return (
          (r = kf.bind(null, e)),
          (n = Ae(n, r)),
          (e.callbackPriority = t),
          (e.callbackNode = n),
          t
        );
      }
      return (
        r !== null && r !== null && je(r),
        (e.callbackPriority = 2),
        (e.callbackNode = null),
        2
      );
    }
    function kf(e, t) {
      if (gd !== 0 && gd !== 5)
        return ((e.callbackNode = null), (e.callbackPriority = 0), null);
      var n = e.callbackNode;
      if (cf() && e.callbackNode !== n) return null;
      var r = Yu;
      return (
        (r = et(
          e,
          e === qu ? r : 0,
          e.cancelPendingCommit !== null || e.timeoutHandle !== -1,
        )),
        r === 0
          ? null
          : (Md(e, r, t),
            Of(e, Pe()),
            e.callbackNode != null && e.callbackNode === n
              ? kf.bind(null, e)
              : null)
      );
    }
    function Af(e, t) {
      if (cf()) return null;
      Md(e, t, !0);
    }
    function jf() {
      bp(function () {
        Ku & 6 ? Ae(Ie, Ef) : Df();
      });
    }
    function Mf() {
      if (Cf === 0) {
        var e = Aa;
        (e === 0 && ((e = Xe), (Xe <<= 1), !(Xe & 261888) && (Xe = 256)),
          (Cf = e));
      }
      return Cf;
    }
    function Nf(e) {
      return e == null || typeof e == `symbol` || typeof e == `boolean`
        ? null
        : typeof e == `function`
          ? e
          : fn(e);
    }
    function Pf(e, t, n, r, i) {
      if (t === `submit` && n && n.stateNode === i) {
        var a = Nf((i[_t] || null).action),
          o = r.submitter;
        o &&
          ((t = (t = o[_t] || null)
            ? Nf(t.formAction)
            : o.getAttribute(`formAction`)),
          t !== null && ((a = t), (o = null)));
        var s = new Nn(`action`, `action`, null, r, i);
        e.push({
          event: s,
          listeners: [
            {
              instance: null,
              listener: function () {
                if (r.defaultPrevented) {
                  if (Cf !== 0) {
                    var e = new FormData(i, o);
                    Ks(
                      n,
                      { pending: !0, data: e, method: i.method, action: a },
                      null,
                      e,
                    );
                  }
                } else
                  typeof a == `function` &&
                    (s.preventDefault(),
                    (e = new FormData(i, o)),
                    Ks(
                      n,
                      { pending: !0, data: e, method: i.method, action: a },
                      a,
                      e,
                    ));
              },
              currentTarget: i,
            },
          ],
        });
      }
    }
    for (var Ff = 0; Ff < ci.length; Ff++) {
      var If = ci[Ff];
      li(If.toLowerCase(), `on` + (If[0].toUpperCase() + If.slice(1)));
    }
    (li(ei, `onAnimationEnd`),
      li(ti, `onAnimationIteration`),
      li(ni, `onAnimationStart`),
      li(`dblclick`, `onDoubleClick`),
      li(`focusin`, `onFocus`),
      li(`focusout`, `onBlur`),
      li(ri, `onTransitionRun`),
      li(ii, `onTransitionStart`),
      li(ai, `onTransitionCancel`),
      li(oi, `onTransitionEnd`),
      Ft(`onMouseEnter`, [`mouseout`, `mouseover`]),
      Ft(`onMouseLeave`, [`mouseout`, `mouseover`]),
      Ft(`onPointerEnter`, [`pointerout`, `pointerover`]),
      Ft(`onPointerLeave`, [`pointerout`, `pointerover`]),
      Pt(
        `onChange`,
        `change click focusin focusout input keydown keyup selectionchange`.split(
          ` `,
        ),
      ),
      Pt(
        `onSelect`,
        `focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(
          ` `,
        ),
      ),
      Pt(`onBeforeInput`, [`compositionend`, `keypress`, `textInput`, `paste`]),
      Pt(
        `onCompositionEnd`,
        `compositionend focusout keydown keypress keyup mousedown`.split(` `),
      ),
      Pt(
        `onCompositionStart`,
        `compositionstart focusout keydown keypress keyup mousedown`.split(` `),
      ),
      Pt(
        `onCompositionUpdate`,
        `compositionupdate focusout keydown keypress keyup mousedown`.split(
          ` `,
        ),
      ));
    var Lf =
        `abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(
          ` `,
        ),
      Rf = new Set(
        `beforetoggle cancel close invalid load scroll scrollend toggle`
          .split(` `)
          .concat(Lf),
      );
    function zf(e, t) {
      t = !!(t & 4);
      for (var n = 0; n < e.length; n++) {
        var r = e[n],
          i = r.event;
        r = r.listeners;
        a: {
          var a = void 0;
          if (t)
            for (var o = r.length - 1; 0 <= o; o--) {
              var s = r[o],
                c = s.instance,
                l = s.currentTarget;
              if (((s = s.listener), c !== a && i.isPropagationStopped()))
                break a;
              ((a = s), (i.currentTarget = l));
              try {
                a(i);
              } catch (e) {
                mi(e);
              }
              ((i.currentTarget = null), (a = c));
            }
          else
            for (o = 0; o < r.length; o++) {
              if (
                ((s = r[o]),
                (c = s.instance),
                (l = s.currentTarget),
                (s = s.listener),
                c !== a && i.isPropagationStopped())
              )
                break a;
              ((a = s), (i.currentTarget = l));
              try {
                a(i);
              } catch (e) {
                mi(e);
              }
              ((i.currentTarget = null), (a = c));
            }
        }
      }
    }
    function Bf(e, t) {
      var n = t[yt];
      n === void 0 && (n = t[yt] = new Set());
      var r = e + `__bubble`;
      n.has(r) || (Wf(t, e, 2, !1), n.add(r));
    }
    function Vf(e, t, n) {
      var r = 0;
      (t && (r |= 4), Wf(n, e, r, t));
    }
    var Hf = `_reactListening` + Math.random().toString(36).slice(2);
    function Uf(e) {
      if (!e[Hf]) {
        ((e[Hf] = !0),
          Mt.forEach(function (t) {
            t !== `selectionchange` &&
              (Rf.has(t) || Vf(t, !1, e), Vf(t, !0, e));
          }));
        var t = e.nodeType === 9 ? e : e.ownerDocument;
        t === null || t[Hf] || ((t[Hf] = !0), Vf(`selectionchange`, !1, t));
      }
    }
    function Wf(e, t, n, r) {
      switch (Ch(t)) {
        case 2:
          var i = _h;
          break;
        case 8:
          i = vh;
          break;
        default:
          i = yh;
      }
      ((n = i.bind(null, t, n, e)),
        (i = void 0),
        !Sn ||
          (t !== `touchstart` && t !== `touchmove` && t !== `wheel`) ||
          (i = !0),
        r
          ? i === void 0
            ? e.addEventListener(t, n, !0)
            : e.addEventListener(t, n, { capture: !0, passive: i })
          : i === void 0
            ? e.addEventListener(t, n, !1)
            : e.addEventListener(t, n, { passive: i }));
    }
    function Gf(e, t, n, r, i) {
      var a = r;
      if (!(t & 1) && !(t & 2) && r !== null)
        a: for (;;) {
          if (r === null) return;
          var o = r.tag;
          if (o === 3 || o === 4) {
            var s = r.stateNode.containerInfo;
            if (s === i) break;
            if (o === 4)
              for (o = r.return; o !== null;) {
                var c = o.tag;
                if ((c === 3 || c === 4) && o.stateNode.containerInfo === i)
                  return;
                o = o.return;
              }
            for (; s !== null;) {
              if (((o = Et(s)), o === null)) return;
              if (((c = o.tag), c === 5 || c === 6 || c === 26 || c === 27)) {
                r = a = o;
                continue a;
              }
              s = s.parentNode;
            }
          }
          r = r.return;
        }
      yn(function () {
        var r = a,
          i = hn(n),
          o = [];
        a: {
          var s = si.get(e);
          if (s !== void 0) {
            var c = Nn,
              u = e;
            switch (e) {
              case `keypress`:
                if (On(n) === 0) break a;
              case `keydown`:
              case `keyup`:
                c = Zn;
                break;
              case `focusin`:
                ((u = `focus`), (c = Hn));
                break;
              case `focusout`:
                ((u = `blur`), (c = Hn));
                break;
              case `beforeblur`:
              case `afterblur`:
                c = Hn;
                break;
              case `click`:
                if (n.button === 2) break a;
              case `auxclick`:
              case `dblclick`:
              case `mousedown`:
              case `mousemove`:
              case `mouseup`:
              case `mouseout`:
              case `mouseover`:
              case `contextmenu`:
                c = Bn;
                break;
              case `drag`:
              case `dragend`:
              case `dragenter`:
              case `dragexit`:
              case `dragleave`:
              case `dragover`:
              case `dragstart`:
              case `drop`:
                c = Vn;
                break;
              case `touchcancel`:
              case `touchend`:
              case `touchmove`:
              case `touchstart`:
                c = er;
                break;
              case ei:
              case ti:
              case ni:
                c = Un;
                break;
              case oi:
                c = tr;
                break;
              case `scroll`:
              case `scrollend`:
                c = Fn;
                break;
              case `wheel`:
                c = nr;
                break;
              case `copy`:
              case `cut`:
              case `paste`:
                c = Wn;
                break;
              case `gotpointercapture`:
              case `lostpointercapture`:
              case `pointercancel`:
              case `pointerdown`:
              case `pointermove`:
              case `pointerout`:
              case `pointerover`:
              case `pointerup`:
                c = Qn;
                break;
              case `submit`:
                c = $n;
                break;
              case `toggle`:
              case `beforetoggle`:
                c = rr;
            }
            var d = !!(t & 4),
              f = !d && (e === `scroll` || e === `scrollend`),
              p = d ? (s === null ? null : s + `Capture`) : s;
            d = [];
            for (var m = r, h; m !== null;) {
              var g = m;
              if (
                ((h = g.stateNode),
                (g = g.tag),
                (g !== 5 && g !== 26 && g !== 27) ||
                  h === null ||
                  p === null ||
                  ((g = bn(m, p)), g != null && d.push(Kf(m, g, h))),
                f)
              )
                break;
              m = m.return;
            }
            0 < d.length &&
              ((s = new c(s, u, null, n, i)),
              o.push({ event: s, listeners: d }));
          }
        }
        if (!(t & 7)) {
          a: {
            if (
              ((c = e === `mouseover` || e === `pointerover`),
              (s = e === `mouseout` || e === `pointerout`),
              c &&
                n !== mn &&
                (u = n.relatedTarget || n.fromElement) &&
                (Et(u) || u[vt]))
            )
              break a;
            (s || c) &&
              ((u =
                i.window === i
                  ? i
                  : (c = i.ownerDocument)
                    ? c.defaultView || c.parentWindow
                    : window),
              s
                ? ((c = n.relatedTarget || n.toElement),
                  (s = r),
                  (c = c ? Et(c) : null),
                  c !== null &&
                    ((f = l(c)),
                    (d = c.tag),
                    c !== f || (d !== 5 && d !== 27 && d !== 6)) &&
                    (c = null))
                : ((s = null), (c = r)),
              s !== c &&
                ((d = Bn),
                (g = `onMouseLeave`),
                (p = `onMouseEnter`),
                (m = `mouse`),
                (e === `pointerout` || e === `pointerover`) &&
                  ((d = Qn),
                  (g = `onPointerLeave`),
                  (p = `onPointerEnter`),
                  (m = `pointer`)),
                (f = s == null ? u : Ot(s)),
                (h = c == null ? u : Ot(c)),
                (u = new d(g, m + `leave`, s, n, i)),
                (u.target = f),
                (u.relatedTarget = h),
                (g = null),
                Et(i) === r &&
                  ((d = new d(p, m + `enter`, c, n, i)),
                  (d.target = h),
                  (d.relatedTarget = f),
                  (g = d)),
                (f = g),
                (d = s && c ? E(s, c, Jf) : null),
                s !== null && Yf(o, u, s, d, !1),
                c !== null && f !== null && Yf(o, f, c, d, !0)));
          }
          a: {
            if (
              ((s = r ? Ot(r) : window),
              (c = s.nodeName && s.nodeName.toLowerCase()),
              c === `select` || (c === `input` && s.type === `file`))
            )
              var _ = Cr;
            else if (_r(s)) {
              if (wr) _ = Nr;
              else {
                _ = jr;
                var v = Ar;
              }
            } else
              ((c = s.nodeName),
                !c ||
                c.toLowerCase() !== `input` ||
                (s.type !== `checkbox` && s.type !== `radio`)
                  ? r && ln(r.elementType) && (_ = Cr)
                  : (_ = Mr));
            if ((_ &&= _(e, r))) {
              vr(o, _, n, i);
              break a;
            }
            v && v(e, s, r);
          }
          switch (((v = r ? Ot(r) : window), e)) {
            case `focusin`:
              (_r(v) || v.contentEditable === `true`) &&
                ((Wr = v), (Gr = r), (Kr = null));
              break;
            case `focusout`:
              Kr = Gr = Wr = null;
              break;
            case `mousedown`:
              qr = !0;
              break;
            case `contextmenu`:
            case `mouseup`:
            case `dragend`:
              ((qr = !1), Jr(o, n, i));
              break;
            case `selectionchange`:
              if (Ur) break;
            case `keydown`:
            case `keyup`:
              Jr(o, n, i);
          }
          var y;
          if (ar)
            b: {
              switch (e) {
                case `compositionstart`:
                  var b = `onCompositionStart`;
                  break b;
                case `compositionend`:
                  b = `onCompositionEnd`;
                  break b;
                case `compositionupdate`:
                  b = `onCompositionUpdate`;
                  break b;
              }
              b = void 0;
            }
          else
            pr
              ? dr(e, n) && (b = `onCompositionEnd`)
              : e === `keydown` &&
                n.keyCode === 229 &&
                (b = `onCompositionStart`);
          (b &&
            (cr &&
              n.locale !== `ko` &&
              (pr || b !== `onCompositionStart`
                ? b === `onCompositionEnd` && pr && (y = Dn())
                : ((wn = i),
                  (Tn = `value` in wn ? wn.value : wn.textContent),
                  (pr = !0))),
            (v = qf(r, b)),
            0 < v.length &&
              ((b = new Gn(b, e, null, n, i)),
              o.push({ event: b, listeners: v }),
              y ? (b.data = y) : ((y = fr(n)), y !== null && (b.data = y)))),
            (y = sr ? mr(e, n) : hr(e, n)) &&
              ((b = qf(r, `onBeforeInput`)),
              0 < b.length &&
                ((v = new Gn(`onBeforeInput`, `beforeinput`, null, n, i)),
                o.push({ event: v, listeners: b }),
                (v.data = y))),
            Pf(o, e, r, n, i));
        }
        zf(o, t);
      });
    }
    function Kf(e, t, n) {
      return { instance: e, listener: t, currentTarget: n };
    }
    function qf(e, t) {
      for (var n = t + `Capture`, r = []; e !== null;) {
        var i = e,
          a = i.stateNode;
        if (
          ((i = i.tag),
          (i !== 5 && i !== 26 && i !== 27) ||
            a === null ||
            ((i = bn(e, n)),
            i != null && r.unshift(Kf(e, i, a)),
            (i = bn(e, t)),
            i != null && r.push(Kf(e, i, a))),
          e.tag === 3)
        )
          return r;
        e = e.return;
      }
      return [];
    }
    function Jf(e) {
      if (e === null) return null;
      do e = e.return;
      while (e && e.tag !== 5 && e.tag !== 27);
      return e || null;
    }
    function Yf(e, t, n, r, i) {
      for (var a = t._reactName, o = []; n !== null && n !== r;) {
        var s = n,
          c = s.alternate,
          l = s.stateNode;
        if (((s = s.tag), c !== null && c === r)) break;
        ((s !== 5 && s !== 26 && s !== 27) ||
          l === null ||
          ((c = l),
          i
            ? ((l = bn(n, a)), l != null && o.unshift(Kf(n, l, c)))
            : i || ((l = bn(n, a)), l != null && o.push(Kf(n, l, c)))),
          (n = n.return));
      }
      o.length !== 0 && e.push({ event: t, listeners: o });
    }
    var Xf = /\r\n?/g,
      Zf = /\u0000|\uFFFD/g;
    function Qf(e) {
      return (typeof e == `string` ? e : `` + e)
        .replace(
          Xf,
          `
`,
        )
        .replace(Zf, ``);
    }
    function $f(e, t) {
      return ((t = Qf(t)), Qf(e) === t);
    }
    function ep(e, t, n, r, i, a) {
      switch (n) {
        case `children`:
          if (typeof r == `string`)
            t === `body` || (t === `textarea` && r === ``) || an(e, r);
          else if (typeof r == `number` || typeof r == `bigint`)
            t !== `body` && an(e, `` + r);
          else return;
          break;
        case `className`:
          Ut(e, `class`, r);
          break;
        case `tabIndex`:
          Ut(e, `tabindex`, r);
          break;
        case `dir`:
        case `role`:
        case `viewBox`:
        case `width`:
        case `height`:
          Ut(e, n, r);
          break;
        case `style`:
          cn(e, r, a);
          return;
        case `data`:
          if (t !== `object`) {
            Ut(e, `data`, r);
            break;
          }
        case `src`:
        case `href`:
          if (
            (r === `` && (t !== `a` || n !== `href`)) ||
            r == null ||
            typeof r == `function` ||
            typeof r == `symbol` ||
            typeof r == `boolean`
          ) {
            e.removeAttribute(n);
            break;
          }
          ((r = fn(r)), e.setAttribute(n, r));
          break;
        case `action`:
        case `formAction`:
          if (typeof r == `function`) {
            e.setAttribute(
              n,
              `javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`,
            );
            break;
          }
          if (
            (typeof a == `function` &&
              (n === `formAction`
                ? (t !== `input` && ep(e, t, `name`, i.name, i, null),
                  ep(e, t, `formEncType`, i.formEncType, i, null),
                  ep(e, t, `formMethod`, i.formMethod, i, null),
                  ep(e, t, `formTarget`, i.formTarget, i, null))
                : (ep(e, t, `encType`, i.encType, i, null),
                  ep(e, t, `method`, i.method, i, null),
                  ep(e, t, `target`, i.target, i, null))),
            r == null || typeof r == `symbol` || typeof r == `boolean`)
          ) {
            e.removeAttribute(n);
            break;
          }
          ((r = fn(r)), e.setAttribute(n, r));
          break;
        case `onClick`:
          r != null && (e.onclick = pn);
          return;
        case `onScroll`:
          r != null && Bf(`scroll`, e);
          return;
        case `onScrollEnd`:
          r != null && Bf(`scrollend`, e);
          return;
        case `dangerouslySetInnerHTML`:
          if (r != null) {
            if (typeof r != `object` || !(`__html` in r)) throw Error(s(61));
            if (((n = r.__html), n != null)) {
              if (i.children != null) throw Error(s(60));
              a?.__html !== n && (e.innerHTML = n);
            }
          }
          break;
        case `multiple`:
          e.multiple = r && typeof r != `function` && typeof r != `symbol`;
          break;
        case `muted`:
          e.muted = r && typeof r != `function` && typeof r != `symbol`;
          break;
        case `suppressContentEditableWarning`:
        case `suppressHydrationWarning`:
        case `defaultValue`:
        case `defaultChecked`:
        case `innerHTML`:
        case `ref`:
          break;
        case `autoFocus`:
          break;
        case `xlinkHref`:
          if (
            r == null ||
            typeof r == `function` ||
            typeof r == `boolean` ||
            typeof r == `symbol`
          ) {
            e.removeAttribute(`xlink:href`);
            break;
          }
          ((n = fn(r)),
            e.setAttributeNS(`http://www.w3.org/1999/xlink`, `xlink:href`, n));
          break;
        case `contentEditable`:
        case `spellCheck`:
        case `draggable`:
        case `value`:
        case `autoReverse`:
        case `externalResourcesRequired`:
        case `focusable`:
        case `preserveAlpha`:
          r != null && typeof r != `function` && typeof r != `symbol`
            ? e.setAttribute(n, r)
            : e.removeAttribute(n);
          break;
        case `inert`:
        case `allowFullScreen`:
        case `async`:
        case `autoPlay`:
        case `controls`:
        case `credentialless`:
        case `default`:
        case `defer`:
        case `disabled`:
        case `disablePictureInPicture`:
        case `disableRemotePlayback`:
        case `formNoValidate`:
        case `hidden`:
        case `loop`:
        case `noModule`:
        case `noValidate`:
        case `open`:
        case `playsInline`:
        case `readOnly`:
        case `required`:
        case `reversed`:
        case `scoped`:
        case `seamless`:
        case `itemScope`:
          r && typeof r != `function` && typeof r != `symbol`
            ? e.setAttribute(n, ``)
            : e.removeAttribute(n);
          break;
        case `capture`:
        case `download`:
          !0 === r
            ? e.setAttribute(n, ``)
            : !1 !== r &&
                r != null &&
                typeof r != `function` &&
                typeof r != `symbol`
              ? e.setAttribute(n, r)
              : e.removeAttribute(n);
          break;
        case `cols`:
        case `rows`:
        case `size`:
        case `span`:
          r != null &&
          typeof r != `function` &&
          typeof r != `symbol` &&
          !isNaN(r) &&
          1 <= r
            ? e.setAttribute(n, r)
            : e.removeAttribute(n);
          break;
        case `rowSpan`:
        case `start`:
          r == null ||
          typeof r == `function` ||
          typeof r == `symbol` ||
          isNaN(r)
            ? e.removeAttribute(n)
            : e.setAttribute(n, r);
          break;
        case `popover`:
          (Bf(`beforetoggle`, e), Bf(`toggle`, e), Ht(e, `popover`, r));
          break;
        case `xlinkActuate`:
          Wt(e, `http://www.w3.org/1999/xlink`, `xlink:actuate`, r);
          break;
        case `xlinkArcrole`:
          Wt(e, `http://www.w3.org/1999/xlink`, `xlink:arcrole`, r);
          break;
        case `xlinkRole`:
          Wt(e, `http://www.w3.org/1999/xlink`, `xlink:role`, r);
          break;
        case `xlinkShow`:
          Wt(e, `http://www.w3.org/1999/xlink`, `xlink:show`, r);
          break;
        case `xlinkTitle`:
          Wt(e, `http://www.w3.org/1999/xlink`, `xlink:title`, r);
          break;
        case `xlinkType`:
          Wt(e, `http://www.w3.org/1999/xlink`, `xlink:type`, r);
          break;
        case `xmlBase`:
          Wt(e, `http://www.w3.org/XML/1998/namespace`, `xml:base`, r);
          break;
        case `xmlLang`:
          Wt(e, `http://www.w3.org/XML/1998/namespace`, `xml:lang`, r);
          break;
        case `xmlSpace`:
          Wt(e, `http://www.w3.org/XML/1998/namespace`, `xml:space`, r);
          break;
        case `is`:
          Ht(e, `is`, r);
          break;
        case `innerText`:
        case `textContent`:
          return;
        default:
          if (
            !(2 < n.length) ||
            (n[0] !== `o` && n[0] !== `O`) ||
            (n[1] !== `n` && n[1] !== `N`)
          )
            ((n = un.get(n) || n), Ht(e, n, r));
          else return;
      }
      Bt = !0;
    }
    function tp(e, t, n, r, i, a) {
      switch (n) {
        case `style`:
          cn(e, r, a);
          return;
        case `dangerouslySetInnerHTML`:
          if (r != null) {
            if (typeof r != `object` || !(`__html` in r)) throw Error(s(61));
            if (((n = r.__html), n != null)) {
              if (i.children != null) throw Error(s(60));
              a?.__html !== n && (e.innerHTML = n);
            }
          }
          break;
        case `children`:
          if (typeof r == `string`) an(e, r);
          else if (typeof r == `number` || typeof r == `bigint`) an(e, `` + r);
          else return;
          break;
        case `onScroll`:
          r != null && Bf(`scroll`, e);
          return;
        case `onScrollEnd`:
          r != null && Bf(`scrollend`, e);
          return;
        case `onClick`:
          r != null && (e.onclick = pn);
          return;
        case `suppressContentEditableWarning`:
        case `suppressHydrationWarning`:
        case `innerHTML`:
        case `ref`:
          return;
        case `innerText`:
        case `textContent`:
          return;
        default:
          if (!Nt.hasOwnProperty(n))
            a: {
              if (
                n[0] === `o` &&
                n[1] === `n` &&
                ((i = n.endsWith(`Capture`)),
                (a = n.slice(2, i ? n.length - 7 : void 0)),
                (t = e[_t] || null),
                (t = t == null ? null : t[n]),
                typeof t == `function` && e.removeEventListener(a, t, i),
                typeof r == `function`)
              ) {
                (typeof t != `function` &&
                  t !== null &&
                  (n in e
                    ? (e[n] = null)
                    : e.hasAttribute(n) && e.removeAttribute(n)),
                  e.addEventListener(a, r, i));
                break a;
              }
              ((Bt = !0),
                n in e
                  ? (e[n] = r)
                  : !0 === r
                    ? e.setAttribute(n, ``)
                    : Ht(e, n, r));
            }
          return;
      }
      Bt = !0;
    }
    function np(e, t, n) {
      switch (t) {
        case `div`:
        case `span`:
        case `svg`:
        case `path`:
        case `a`:
        case `g`:
        case `p`:
        case `li`:
          break;
        case `img`:
          (Bf(`error`, e), Bf(`load`, e));
          var r = !1,
            i = !1,
            a;
          for (a in n)
            if (n.hasOwnProperty(a)) {
              var o = n[a];
              if (o != null)
                switch (a) {
                  case `src`:
                    r = !0;
                    break;
                  case `srcSet`:
                    i = !0;
                    break;
                  case `children`:
                  case `dangerouslySetInnerHTML`:
                    throw Error(s(137, t));
                  default:
                    ep(e, t, a, o, n, null);
                }
            }
          (i && ep(e, t, `srcSet`, n.srcSet, n, null),
            r && ep(e, t, `src`, n.src, n, null));
          return;
        case `input`:
          Bf(`invalid`, e);
          var c = (a = o = i = null),
            l = null,
            u = null;
          for (r in n)
            if (n.hasOwnProperty(r)) {
              var d = n[r];
              if (d != null)
                switch (r) {
                  case `name`:
                    i = d;
                    break;
                  case `type`:
                    o = d;
                    break;
                  case `checked`:
                    l = d;
                    break;
                  case `defaultChecked`:
                    u = d;
                    break;
                  case `value`:
                    a = d;
                    break;
                  case `defaultValue`:
                    c = d;
                    break;
                  case `children`:
                  case `dangerouslySetInnerHTML`:
                    if (d != null) throw Error(s(137, t));
                    break;
                  default:
                    ep(e, t, r, d, n, null);
                }
            }
          $t(e, a, c, l, u, o, i, !1);
          return;
        case `select`:
          for (i in (Bf(`invalid`, e), (r = o = a = null), n))
            if (n.hasOwnProperty(i) && ((c = n[i]), c != null))
              switch (i) {
                case `value`:
                  a = c;
                  break;
                case `defaultValue`:
                  o = c;
                  break;
                case `multiple`:
                  r = c;
                default:
                  ep(e, t, i, c, n, null);
              }
          ((t = a),
            (n = o),
            (e.multiple = !!r),
            t == null ? n != null && tn(e, !!r, n, !0) : tn(e, !!r, t, !1));
          return;
        case `textarea`:
          for (o in (Bf(`invalid`, e), (a = i = r = null), n))
            if (n.hasOwnProperty(o) && ((c = n[o]), c != null))
              switch (o) {
                case `value`:
                  r = c;
                  break;
                case `defaultValue`:
                  i = c;
                  break;
                case `children`:
                  a = c;
                  break;
                case `dangerouslySetInnerHTML`:
                  if (c != null) throw Error(s(91));
                  break;
                default:
                  ep(e, t, o, c, n, null);
              }
          rn(e, r, i, a);
          return;
        case `option`:
          for (l in n)
            if (n.hasOwnProperty(l) && ((r = n[l]), r != null))
              switch (l) {
                case `selected`:
                  e.selected =
                    r && typeof r != `function` && typeof r != `symbol`;
                  break;
                default:
                  ep(e, t, l, r, n, null);
              }
          return;
        case `dialog`:
          (Bf(`beforetoggle`, e),
            Bf(`toggle`, e),
            Bf(`cancel`, e),
            Bf(`close`, e));
          break;
        case `iframe`:
        case `object`:
          Bf(`load`, e);
          break;
        case `video`:
        case `audio`:
          for (r = 0; r < Lf.length; r++) Bf(Lf[r], e);
          break;
        case `image`:
          (Bf(`error`, e), Bf(`load`, e));
          break;
        case `details`:
          Bf(`toggle`, e);
          break;
        case `embed`:
        case `source`:
        case `link`:
          (Bf(`error`, e), Bf(`load`, e));
        case `area`:
        case `base`:
        case `br`:
        case `col`:
        case `hr`:
        case `keygen`:
        case `meta`:
        case `param`:
        case `track`:
        case `wbr`:
        case `menuitem`:
          for (u in n)
            if (n.hasOwnProperty(u) && ((r = n[u]), r != null))
              switch (u) {
                case `children`:
                case `dangerouslySetInnerHTML`:
                  throw Error(s(137, t));
                default:
                  ep(e, t, u, r, n, null);
              }
          return;
        default:
          if (ln(t)) {
            for (d in n)
              n.hasOwnProperty(d) &&
                ((r = n[d]), r !== void 0 && tp(e, t, d, r, n, void 0));
            return;
          }
      }
      for (c in n)
        n.hasOwnProperty(c) &&
          ((r = n[c]), r != null && ep(e, t, c, r, n, null));
    }
    var rp = {};
    function ip(e, t, n, r) {
      switch (t) {
        case `div`:
        case `span`:
        case `svg`:
        case `path`:
        case `a`:
        case `g`:
        case `p`:
        case `li`:
          break;
        case `input`:
          var i = null,
            a = null,
            o = null,
            c = null,
            l = null,
            u = null,
            d = null;
          for (m in n) {
            var f = n[m];
            if (n.hasOwnProperty(m) && f != null)
              switch (m) {
                case `checked`:
                  break;
                case `value`:
                  break;
                case `defaultValue`:
                  l = f;
                default:
                  r.hasOwnProperty(m) || ep(e, t, m, null, r, f);
              }
          }
          for (var p in r) {
            var m = r[p];
            if (((f = n[p]), r.hasOwnProperty(p) && (m != null || f != null)))
              switch (p) {
                case `type`:
                  (m !== f && (Bt = !0), (a = m));
                  break;
                case `name`:
                  (m !== f && (Bt = !0), (i = m));
                  break;
                case `checked`:
                  (m !== f && (Bt = !0), (u = m));
                  break;
                case `defaultChecked`:
                  (m !== f && (Bt = !0), (d = m));
                  break;
                case `value`:
                  (m !== f && (Bt = !0), (o = m));
                  break;
                case `defaultValue`:
                  (m !== f && (Bt = !0), (c = m));
                  break;
                case `children`:
                case `dangerouslySetInnerHTML`:
                  if (m != null) throw Error(s(137, t));
                  break;
                default:
                  m !== f && ep(e, t, p, m, r, f);
              }
          }
          Qt(e, o, c, l, u, d, a, i);
          return;
        case `select`:
          for (a in ((m = o = c = p = null), n))
            if (((l = n[a]), n.hasOwnProperty(a) && l != null))
              switch (a) {
                case `value`:
                  break;
                case `multiple`:
                  m = l;
                default:
                  r.hasOwnProperty(a) || ep(e, t, a, null, r, l);
              }
          for (i in r)
            if (
              ((a = r[i]),
              (l = n[i]),
              r.hasOwnProperty(i) && (a != null || l != null))
            )
              switch (i) {
                case `value`:
                  (a !== l && (Bt = !0), (p = a));
                  break;
                case `defaultValue`:
                  (a !== l && (Bt = !0), (c = a));
                  break;
                case `multiple`:
                  (a !== l && (Bt = !0), (o = a));
                default:
                  a !== l && ep(e, t, i, a, r, l);
              }
          ((t = c),
            (n = o),
            (r = m),
            p == null
              ? !!r != !!n &&
                (t == null ? tn(e, !!n, n ? [] : ``, !1) : tn(e, !!n, t, !0))
              : tn(e, !!n, p, !1));
          return;
        case `textarea`:
          for (c in ((m = p = null), n))
            if (
              ((i = n[c]),
              n.hasOwnProperty(c) && i != null && !r.hasOwnProperty(c))
            )
              switch (c) {
                case `value`:
                  break;
                case `children`:
                  break;
                default:
                  ep(e, t, c, null, r, i);
              }
          for (o in r)
            if (
              ((i = r[o]),
              (a = n[o]),
              r.hasOwnProperty(o) && (i != null || a != null))
            )
              switch (o) {
                case `value`:
                  (i !== a && (Bt = !0), (p = i));
                  break;
                case `defaultValue`:
                  (i !== a && (Bt = !0), (m = i));
                  break;
                case `children`:
                  break;
                case `dangerouslySetInnerHTML`:
                  if (i != null) throw Error(s(91));
                  break;
                default:
                  i !== a && ep(e, t, o, i, r, a);
              }
          nn(e, p, m);
          return;
        case `option`:
          for (var h in n)
            if (
              ((p = n[h]),
              n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h))
            )
              switch (h) {
                case `selected`:
                  e.selected = !1;
                  break;
                default:
                  ep(e, t, h, null, r, p);
              }
          for (l in r)
            if (
              ((p = r[l]),
              (m = n[l]),
              r.hasOwnProperty(l) && p !== m && (p != null || m != null))
            )
              switch (l) {
                case `selected`:
                  (p !== m && (Bt = !0),
                    (e.selected =
                      p && typeof p != `function` && typeof p != `symbol`));
                  break;
                default:
                  ep(e, t, l, p, r, m);
              }
          return;
        case `img`:
        case `link`:
        case `area`:
        case `base`:
        case `br`:
        case `col`:
        case `embed`:
        case `hr`:
        case `keygen`:
        case `meta`:
        case `param`:
        case `source`:
        case `track`:
        case `wbr`:
        case `menuitem`:
          for (var g in n)
            ((p = n[g]),
              n.hasOwnProperty(g) &&
                p != null &&
                !r.hasOwnProperty(g) &&
                ep(e, t, g, null, r, p));
          for (u in r)
            if (
              ((p = r[u]),
              (m = n[u]),
              r.hasOwnProperty(u) && p !== m && (p != null || m != null))
            )
              switch (u) {
                case `children`:
                case `dangerouslySetInnerHTML`:
                  if (p != null) throw Error(s(137, t));
                  break;
                default:
                  ep(e, t, u, p, r, m);
              }
          return;
        default:
          if (ln(t)) {
            for (var _ in n)
              ((p = n[_]),
                n.hasOwnProperty(_) &&
                  p !== void 0 &&
                  !r.hasOwnProperty(_) &&
                  tp(e, t, _, void 0, r, p));
            for (d in r)
              ((p = r[d]),
                (m = n[d]),
                !r.hasOwnProperty(d) ||
                  p === m ||
                  (p === void 0 && m === void 0) ||
                  tp(e, t, d, p, r, m));
            return;
          }
      }
      for (var v in n)
        ((p = n[v]),
          n.hasOwnProperty(v) &&
            p != null &&
            !r.hasOwnProperty(v) &&
            ep(e, t, v, null, r, p));
      for (f in r)
        ((p = r[f]),
          (m = n[f]),
          !r.hasOwnProperty(f) ||
            p === m ||
            (p == null && m == null) ||
            ep(e, t, f, p, r, m));
    }
    function ap(e) {
      switch (e) {
        case `css`:
        case `script`:
        case `font`:
        case `img`:
        case `image`:
        case `input`:
        case `link`:
          return !0;
        default:
          return !1;
      }
    }
    function op() {
      if (typeof performance.getEntriesByType == `function`) {
        for (
          var e = 0, t = 0, n = performance.getEntriesByType(`resource`), r = 0;
          r < n.length;
          r++
        ) {
          var i = n[r],
            a = i.transferSize,
            o = i.initiatorType,
            s = i.duration;
          if (a && s && ap(o)) {
            for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
              var c = n[r],
                l = c.startTime;
              if (l > s) break;
              var u = c.transferSize,
                d = c.initiatorType;
              u &&
                ap(d) &&
                ((c = c.responseEnd),
                (o += u * (c < s ? 1 : (s - l) / (c - l))));
            }
            if ((--r, (t += (8 * (a + o)) / (i.duration / 1e3)), e++, 10 < e))
              break;
          }
        }
        if (0 < e) return t / e / 1e6;
      }
      return navigator.connection &&
        ((e = navigator.connection.downlink), typeof e == `number`)
        ? e
        : 5;
    }
    var sp = null,
      cp = null;
    function lp(e) {
      return e.nodeType === 9 ? e : e.ownerDocument;
    }
    function up(e) {
      switch (e) {
        case `http://www.w3.org/2000/svg`:
          return 1;
        case `http://www.w3.org/1998/Math/MathML`:
          return 2;
        default:
          return 0;
      }
    }
    function dp(e, t) {
      if (e === 0)
        switch (t) {
          case `svg`:
            return 1;
          case `math`:
            return 2;
          default:
            return 0;
        }
      return e === 1 && t === `foreignObject` ? 0 : e;
    }
    function fp(e, t, n, r) {
      return (
        (n = lp(n).createElement(e)),
        (n[gt] = r),
        (n[_t] = t),
        np(n, e, t),
        At(n),
        n
      );
    }
    function pp(e, t) {
      return (
        e === `textarea` ||
        e === `noscript` ||
        typeof t.children == `string` ||
        typeof t.children == `number` ||
        typeof t.children == `bigint` ||
        (typeof t.dangerouslySetInnerHTML == `object` &&
          t.dangerouslySetInnerHTML !== null &&
          t.dangerouslySetInnerHTML.__html != null)
      );
    }
    var mp = null;
    function hp() {
      var e = window.event;
      return e && e.type === `popstate`
        ? e !== mp && ((mp = e), !0)
        : ((mp = null), !1);
    }
    var gp = typeof setTimeout == `function` ? setTimeout : void 0,
      _p = typeof clearTimeout == `function` ? clearTimeout : void 0,
      vp = typeof Promise == `function` ? Promise : void 0,
      yp =
        typeof requestAnimationFrame == `function` ? requestAnimationFrame : gp,
      bp =
        typeof queueMicrotask == `function`
          ? queueMicrotask
          : vp === void 0
            ? gp
            : function (e) {
                return vp.resolve(null).then(e).catch(xp);
              };
    function xp(e) {
      setTimeout(function () {
        throw e;
      });
    }
    function Sp(e) {
      return e === `head`;
    }
    function Cp(e, t) {
      var n = t,
        r = 0;
      do {
        var i = n.nextSibling;
        if ((e.removeChild(n), i && i.nodeType === 8)) {
          if (((n = i.data), n === `/$` || n === `/&`)) {
            if (r === 0) {
              (e.removeChild(i), Hh(t));
              return;
            }
            r--;
          } else if (
            n === `$` ||
            n === `$?` ||
            n === `$~` ||
            n === `$!` ||
            n === `&`
          )
            r++;
          else if (n === `html`) _m(e.ownerDocument.documentElement);
          else if (n === `head`) {
            ((n = e.ownerDocument.head), _m(n));
            for (var a = n.firstChild; a;) {
              var o = a.nextSibling,
                s = a.nodeName;
              (a[Ct] ||
                s === `SCRIPT` ||
                s === `STYLE` ||
                (s === `LINK` && a.rel.toLowerCase() === `stylesheet`) ||
                n.removeChild(a),
                (a = o));
            }
          } else n === `body` && _m(e.ownerDocument.body);
        }
        n = i;
      } while (n);
      Hh(t);
    }
    function wp(e, t) {
      var n = e;
      e = 0;
      do {
        var r = n.nextSibling;
        if (
          (n.nodeType === 1
            ? t
              ? ((n._stashedDisplay = n.style.display),
                (n.style.display = `none`))
              : ((n.style.display = n._stashedDisplay || ``),
                n.getAttribute(`style`) === `` && n.removeAttribute(`style`))
            : n.nodeType === 3 &&
              (t
                ? ((n._stashedText = n.nodeValue), (n.nodeValue = ``))
                : (n.nodeValue = n._stashedText || ``)),
          r && r.nodeType === 8)
        ) {
          if (((n = r.data), n === `/$`)) {
            if (e === 0) break;
            e--;
          } else (n !== `$` && n !== `$?` && n !== `$~` && n !== `$!`) || e++;
        }
        n = r;
      } while (n);
    }
    function Tp(e, t, n) {
      if (
        ((t = CSS.escape(t) === t ? t : `r-` + btoa(t).replace(/=/g, ``)),
        (e.style.viewTransitionName = t),
        n != null && (e.style.viewTransitionClass = n),
        (n = getComputedStyle(e)),
        n.display === `inline`)
      ) {
        if (((t = e.getClientRects()), t.length === 1)) var r = 1;
        else
          for (var i = (r = 0); i < t.length; i++) {
            var a = t[i];
            0 < a.width && 0 < a.height && r++;
          }
        r === 1 &&
          ((e = e.style),
          (e.display = t.length === 1 ? `inline-block` : `block`),
          (e.marginTop = `-` + n.paddingTop),
          (e.marginBottom = `-` + n.paddingBottom));
      }
    }
    function Ep(e, t) {
      ((e = e.style), (t = t.style));
      var n =
        t == null
          ? null
          : t.hasOwnProperty(`viewTransitionName`)
            ? t.viewTransitionName
            : t.hasOwnProperty(`view-transition-name`)
              ? t[`view-transition-name`]
              : null;
      ((e.viewTransitionName =
        n == null || typeof n == `boolean` ? `` : (`` + n).trim()),
        (n =
          t == null
            ? null
            : t.hasOwnProperty(`viewTransitionClass`)
              ? t.viewTransitionClass
              : t.hasOwnProperty(`view-transition-class`)
                ? t[`view-transition-class`]
                : null),
        (e.viewTransitionClass =
          n == null || typeof n == `boolean` ? `` : (`` + n).trim()),
        e.display === `inline-block` &&
          (t == null
            ? (e.display = e.margin = ``)
            : ((n = t.display),
              (e.display = n == null || typeof n == `boolean` ? `` : n),
              (n = t.margin),
              n == null
                ? ((n = t.hasOwnProperty(`marginTop`)
                    ? t.marginTop
                    : t[`margin-top`]),
                  (e.marginTop = n == null || typeof n == `boolean` ? `` : n),
                  (t = t.hasOwnProperty(`marginBottom`)
                    ? t.marginBottom
                    : t[`margin-bottom`]),
                  (e.marginBottom =
                    t == null || typeof t == `boolean` ? `` : t))
                : (e.margin = n))));
    }
    function Dp(e, t, n) {
      return (
        (n = n.ownerDocument.defaultView),
        {
          rect: e,
          abs: t.position === `absolute` || t.position === `fixed`,
          clip:
            t.clipPath !== `none` ||
            t.overflow !== `visible` ||
            t.filter !== `none` ||
            t.mask !== `none` ||
            t.mask !== `none` ||
            t.borderRadius !== `0px`,
          view:
            0 <= e.bottom &&
            0 <= e.right &&
            e.top <= n.innerHeight &&
            e.left <= n.innerWidth,
        }
      );
    }
    function Op(e) {
      return Dp(e.getBoundingClientRect(), getComputedStyle(e), e);
    }
    function kp(e) {
      var t = e.getBoundingClientRect();
      t = new DOMRect(t.x + 2e4, t.y + 2e4, t.width, t.height);
      var n = getComputedStyle(e);
      return Dp(t, n, e);
    }
    function Ap(e) {
      return e.documentElement.clientHeight;
    }
    function jp(e) {
      (this.addEventListener(`load`, e), this.addEventListener(`error`, e));
    }
    function Mp(e, t, n, r, i, a, o, s, c) {
      var l = t.nodeType === 9 ? t : t.ownerDocument;
      try {
        var u = l.startViewTransition({
          update: function () {
            var t = l.defaultView,
              n = t.navigation && t.navigation.transition,
              o = l.fonts.status;
            r();
            var s = [];
            if (
              (o === `loaded` &&
                (Ap(l), l.fonts.status === `loading` && s.push(l.fonts.ready)),
              (o = s.length),
              e !== null)
            )
              for (var c = e.suspenseyImages, u = 0, d = 0; d < c.length; d++) {
                var f = c[d];
                if (!f.complete) {
                  var p = f.getBoundingClientRect();
                  if (
                    0 < p.bottom &&
                    0 < p.right &&
                    p.top < t.innerHeight &&
                    p.left < t.innerWidth
                  ) {
                    if (((u += Xm(f)), u > $m)) {
                      s.length = o;
                      break;
                    }
                    ((f = new Promise(jp.bind(f))), s.push(f));
                  }
                }
              }
            if (0 < s.length)
              return (
                (t = Promise.race([
                  Promise.all(s),
                  new Promise(function (e) {
                    return setTimeout(e, 500);
                  }),
                ]).then(i, i)),
                (n ? Promise.allSettled([n.finished, t]) : t).then(a, a)
              );
            if ((i(), n)) return n.finished.then(a, a);
            a();
          },
          types: n,
        });
        l.__reactViewTransition = u;
        var d = [];
        return (
          u.ready.then(
            function () {
              for (
                var e = l.documentElement.getAnimations({ subtree: !0 }), t = 0;
                t < e.length;
                t++
              ) {
                var n = e[t],
                  r = n.effect,
                  i = r.pseudoElement;
                if (i != null && i.startsWith(`::view-transition`)) {
                  (d.push(n), (n = r.getKeyframes()));
                  for (var a = (i = void 0), s = !0, c = 0; c < n.length; c++) {
                    var u = n[c],
                      f = u.width;
                    if (i === void 0) i = f;
                    else if (i !== f) {
                      s = !1;
                      break;
                    }
                    if (((f = u.height), a === void 0)) a = f;
                    else if (a !== f) {
                      s = !1;
                      break;
                    }
                    (delete u.width,
                      delete u.height,
                      u.transform === `none` && delete u.transform);
                  }
                  s &&
                    i !== void 0 &&
                    a !== void 0 &&
                    (r.setKeyframes(n),
                    (s = getComputedStyle(r.target, r.pseudoElement)),
                    s.width !== i || s.height !== a) &&
                    ((s = n[0]),
                    (s.width = i),
                    (s.height = a),
                    (s = n[n.length - 1]),
                    (s.width = i),
                    (s.height = a),
                    r.setKeyframes(n));
                }
              }
              o();
            },
            function (e) {
              l.__reactViewTransition === u && (l.__reactViewTransition = null);
              try {
                if (typeof e == `object` && e)
                  switch (e.name) {
                    case `InvalidStateError`:
                      (e.message ===
                        `View transition was skipped because document visibility state is hidden.` ||
                        e.message ===
                          `Skipping view transition because document visibility state has become hidden.` ||
                        e.message ===
                          `Skipping view transition because viewport size changed.` ||
                        e.message ===
                          `Transition was aborted because of invalid state`) &&
                        (e = null);
                  }
                e !== null && c(e);
              } finally {
                (r(), i(), o());
              }
            },
          ),
          u.finished.finally(function () {
            for (var e = 0; e < d.length; e++) d[e].cancel();
            (l.__reactViewTransition === u && (l.__reactViewTransition = null),
              s());
          }),
          u
        );
      } catch {
        return (r(), i(), o(), null);
      }
    }
    function Np(e, t) {
      ((this._scope = document.documentElement),
        (this._selector = `::view-transition-` + e + `(` + t + `)`));
    }
    ((Np.prototype.animate = function (e, t) {
      return (
        (t = typeof t == `number` ? { duration: t } : D({}, t)),
        (t.pseudoElement = this._selector),
        this._scope.animate(e, t)
      );
    }),
      (Np.prototype.getAnimations = function () {
        for (
          var e = this._scope,
            t = this._selector,
            n = e.getAnimations({ subtree: !0 }),
            r = [],
            i = 0;
          i < n.length;
          i++
        ) {
          var a = n[i].effect;
          a !== null && a.target === e && a.pseudoElement === t && r.push(n[i]);
        }
        return r;
      }),
      (Np.prototype.getComputedStyle = function () {
        return getComputedStyle(this._scope, this._selector);
      }));
    function Pp(e) {
      return {
        name: e,
        group: new Np(`group`, e),
        imagePair: new Np(`image-pair`, e),
        old: new Np(`old`, e),
        new: new Np(`new`, e),
      };
    }
    function Fp(e) {
      ((this._fragmentFiber = e),
        (this._observers = this._eventListeners = null));
    }
    Fp.prototype.addEventListener = function (e, t, n) {
      var r = null,
        i = null;
      if (!(
        n != null &&
        typeof n != `boolean` &&
        ((r = n.signal || null), r !== null && r.aborted)
      )) {
        this._eventListeners === null && (this._eventListeners = []);
        var a = this._eventListeners;
        if (Bp(a, e, t, n) === -1) {
          var o = this,
            s = t;
          (n != null &&
            typeof n != `boolean` &&
            !0 === n.once &&
            (s = function (r) {
              (o.removeEventListener(e, t, n),
                typeof t == `function` ? t.call(this, r) : t.handleEvent(r));
            }),
            r !== null &&
              ((i = o.removeEventListener.bind(o, e, t, n)),
              r.addEventListener(`abort`, i, { once: !0 }),
              (i = r.removeEventListener.bind(r, `abort`, i))),
            (r = Rp(n)),
            a.push({
              type: e,
              listener: t,
              optionsOrUseCapture: n,
              attachedListener: s,
              cleanup: i,
            }),
            h(this._fragmentFiber.child, !1, Ip, e, s, r));
        }
        this._eventListeners = a;
      }
    };
    function Ip(e, t, n, r) {
      return (b(e).addEventListener(t, n, r), !1);
    }
    Fp.prototype.removeEventListener = function (e, t, n) {
      var r = this._eventListeners;
      if (r !== null && ((t = Bp(r, e, t, n)), t !== -1)) {
        var i = r[t];
        n = i.attachedListener;
        var a = i.cleanup;
        ((i = Rp(i.optionsOrUseCapture)),
          h(this._fragmentFiber.child, !1, Lp, e, n, i),
          r.splice(t, 1),
          a !== null && a());
      }
    };
    function Lp(e, t, n, r) {
      return (b(e).removeEventListener(t, n, r), !1);
    }
    function Rp(e) {
      return e != null &&
        typeof e != `boolean` &&
        (!0 === e.once || e.signal instanceof AbortSignal)
        ? { capture: e.capture, passive: e.passive }
        : e;
    }
    function zp(e) {
      return e == null
        ? `c=0`
        : typeof e == `boolean`
          ? `c=` + (e ? `1` : `0`)
          : `c=` + (e.capture ? `1` : `0`);
    }
    function Bp(e, t, n, r) {
      if (e.length === 0) return -1;
      r = zp(r);
      for (var i = 0; i < e.length; i++) {
        var a = e[i];
        if (a.type === t && a.listener === n && zp(a.optionsOrUseCapture) === r)
          return i;
      }
      return -1;
    }
    ((Fp.prototype.dispatchEvent = function (e) {
      var t = g(this._fragmentFiber);
      if (t === null) return !0;
      t = b(t);
      var n = this._eventListeners;
      if ((n !== null && 0 < n.length) || !e.bubbles) {
        var r =
          t.nodeType === 9 ? t.createComment(``) : document.createTextNode(``);
        if (n)
          for (var i = 0; i < n.length; i++) {
            var a = n[i];
            r.addEventListener(
              a.type,
              a.attachedListener,
              Rp(a.optionsOrUseCapture),
            );
          }
        if ((t.appendChild(r), (e = r.dispatchEvent(e)), n))
          for (i = 0; i < n.length; i++)
            ((a = n[i]),
              r.removeEventListener(
                a.type,
                a.attachedListener,
                Rp(a.optionsOrUseCapture),
              ));
        return (t.removeChild(r), e);
      }
      return t.dispatchEvent(e);
    }),
      (Fp.prototype.focus = function (e) {
        h(this._fragmentFiber.child, !0, Vp, e, void 0, void 0);
      }));
    function Vp(e, t) {
      return e.tag !== 6 && ((e = b(e)), pm(e, t));
    }
    Fp.prototype.focusLast = function (e) {
      var t = [];
      h(this._fragmentFiber.child, !0, Hp, t, void 0, void 0);
      for (var n = t.length - 1; 0 <= n && !Vp(t[n], e); n--);
    };
    function Hp(e, t) {
      return (t.push(e), !1);
    }
    Fp.prototype.blur = function () {
      var e = g(this._fragmentFiber);
      e !== null &&
        ((e = b(e)),
        (e = lp(e).activeElement),
        e !== null && h(this._fragmentFiber.child, !1, Up, e, void 0, void 0));
    };
    function Up(e, t) {
      return (
        e.tag !== 6 &&
        ((e = b(e)), e === t || e.contains(t) ? (t.blur(), !0) : !1)
      );
    }
    Fp.prototype.observeUsing = function (e) {
      (this._observers === null && (this._observers = new Set()),
        this._observers.add(e),
        h(this._fragmentFiber.child, !1, Wp, e, void 0, void 0));
    };
    function Wp(e, t) {
      return (e.tag === 6 || ((e = b(e)), t.observe(e)), !1);
    }
    Fp.prototype.unobserveUsing = function (e) {
      var t = this._observers;
      if (t !== null && t.has(e)) {
        (t.delete(e), h(this._fragmentFiber.child, !1, Gp, e, void 0, void 0));
        for (var n = (t = 0); n < Kp.length; n++) {
          var r = Kp[n];
          r.fragmentInstance === this && r.observer === e
            ? e.unobserve(r.instance)
            : (Kp[t++] = r);
        }
        Kp.length = t;
      }
    };
    function Gp(e, t) {
      return (e.tag === 6 || ((e = b(e)), t.unobserve(e)), !1);
    }
    var Kp = [],
      qp = !1;
    function Jp(e, t, n) {
      (Kp.push({ fragmentInstance: e, observer: t, instance: n }),
        qp ||
          ((qp = !0),
          mm(function () {
            qp = !1;
            var e = Kp;
            Kp = [];
            for (var t = 0; t < e.length; t++) {
              var n = e[t];
              n.observer.unobserve(n.instance);
            }
          })));
    }
    Fp.prototype.getClientRects = function () {
      var e = [];
      return (h(this._fragmentFiber.child, !1, Yp, e, void 0, void 0), e);
    };
    function Yp(e, t) {
      if (e.tag === 6) {
        e = e.stateNode;
        var n = e.ownerDocument.createRange();
        (n.selectNodeContents(e), t.push.apply(t, n.getClientRects()));
      } else ((e = b(e)), t.push.apply(t, e.getClientRects()));
      return !1;
    }
    ((Fp.prototype.getRootNode = function (e) {
      var t = g(this._fragmentFiber);
      return t === null ? this : b(t).getRootNode(e);
    }),
      (Fp.prototype.compareDocumentPosition = function (e) {
        var t = g(this._fragmentFiber);
        if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
        var n = [];
        h(this._fragmentFiber.child, !1, Hp, n, void 0, void 0);
        var r = b(t);
        if (n.length === 0) {
          if (((n = r), _(this._fragmentFiber))) {
            a: {
              for (t = this._fragmentFiber.return; t !== null;) {
                if (t.tag === 4) {
                  t = t.stateNode.containerInfo;
                  break a;
                }
                if (t.tag === 3 || t.tag === 5 || t.tag === 27) break;
                t = t.return;
              }
              t = null;
            }
            t != null && (n = t);
          }
          t = this._fragmentFiber;
          var i = (r = n.compareDocumentPosition(e));
          return (
            n === e
              ? (i = Node.DOCUMENT_POSITION_CONTAINS)
              : r & Node.DOCUMENT_POSITION_CONTAINED_BY &&
                ((n = v(t)[1]),
                n === null
                  ? (i = Node.DOCUMENT_POSITION_PRECEDING)
                  : ((e = b(n).compareDocumentPosition(e)),
                    (i =
                      e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING
                        ? Node.DOCUMENT_POSITION_FOLLOWING
                        : Node.DOCUMENT_POSITION_PRECEDING))),
            (i |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC)
          );
        }
        ((t = b(n[0])), (i = b(n[n.length - 1])));
        var a = _(this._fragmentFiber) ? t.parentElement : r;
        if (a == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
        ((r =
          a.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY),
          (a =
            a.compareDocumentPosition(i) &
            Node.DOCUMENT_POSITION_CONTAINED_BY));
        var o = t.compareDocumentPosition(e),
          s = i.compareDocumentPosition(e),
          c =
            o & Node.DOCUMENT_POSITION_CONTAINED_BY ||
            s & Node.DOCUMENT_POSITION_CONTAINED_BY;
        return (
          (s =
            r &&
            a &&
            o & Node.DOCUMENT_POSITION_FOLLOWING &&
            s & Node.DOCUMENT_POSITION_PRECEDING),
          (t =
            (r && t === e) || (a && i === e) || c || s
              ? Node.DOCUMENT_POSITION_CONTAINED_BY
              : (!r && t === e) || (!a && i === e)
                ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
                : o),
          t & Node.DOCUMENT_POSITION_DISCONNECTED ||
          t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC ||
          Xp(t, this._fragmentFiber, n[0], n[n.length - 1], e)
            ? t
            : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
        );
      }));
    function Xp(e, t, n, r, i) {
      var a = Et(i);
      if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
        if ((n = !!a))
          a: {
            for (; a !== null;) {
              if (a.tag === 7 && (a === t || a.alternate === t)) {
                n = !0;
                break a;
              }
              a = a.return;
            }
            n = !1;
          }
        return n;
      }
      if (e & Node.DOCUMENT_POSITION_CONTAINS) {
        if (a === null)
          return (
            (a = i.ownerDocument),
            i === a || i === a.documentElement || i === a.body
          );
        a: {
          for (a = t, t = g(t); a !== null;) {
            if (!(
              (a.tag !== 5 && a.tag !== 3 && a.tag !== 27) ||
              (a !== t && a.alternate !== t)
            )) {
              a = !0;
              break a;
            }
            a = a.return;
          }
          a = !1;
        }
        return a;
      }
      return e & Node.DOCUMENT_POSITION_PRECEDING
        ? ((t = !!a) &&
            !(t = a === n) &&
            ((t = E(n, a, T)),
            t === null
              ? (t = !1)
              : (h(t, !0, C, a, n), (a = x), (x = null), (t = a !== null))),
          t)
        : e & Node.DOCUMENT_POSITION_FOLLOWING
          ? ((t = !!a) &&
              !(t = a === r) &&
              ((t = E(r, a, T)),
              t === null
                ? (t = !1)
                : (h(t, !0, w, a, r),
                  (a = x),
                  (S = x = null),
                  (t = a !== null))),
            t)
          : !1;
    }
    function Zp(e, t) {
      var n = e.ownerDocument.createRange();
      (n.selectNodeContents(e),
        (e = n.getBoundingClientRect()),
        window.scrollTo(
          window.scrollX + e.left,
          t
            ? window.scrollY + e.top
            : window.scrollY + e.bottom - window.innerHeight,
        ));
    }
    Fp.prototype.scrollIntoView = function (e) {
      if (typeof e == `object`) throw Error(s(566));
      var t = [];
      h(this._fragmentFiber.child, !1, Hp, t, void 0, void 0);
      var n = !1 !== e;
      if (t.length === 0) {
        var r = v(this._fragmentFiber);
        if (
          ((r = n ? r[1] || r[0] || g(this._fragmentFiber) : r[0] || r[1]),
          r === null)
        )
          return;
        if (r.tag === 6) {
          ((e = b(r)), Zp(e, n));
          return;
        }
        if (((r = b(r)), r.nodeType !== 9)) {
          if (r.nodeType === 11) {
            ((n = `host` in r ? r.host : null),
              n !== null && n.scrollIntoView(e));
            return;
          }
          r.scrollIntoView(e);
        }
      }
      for (r = n ? t.length - 1 : 0; r !== (n ? -1 : t.length);) {
        var i = t[r];
        (i.tag === 6 ? ((i = b(i)), Zp(i, n)) : b(i).scrollIntoView(e),
          (r += n ? -1 : 1));
      }
    };
    function Qp(e, t) {
      return ((e = b(e)), $p(e, t), !1);
    }
    function $p(e, t) {
      ((e.reactFragments ??= new Set()), e.reactFragments.add(t));
    }
    function em(e, t) {
      var n = t._eventListeners;
      if (n !== null)
        for (var r = 0; r < n.length; r++) {
          var i = n[r];
          e.addEventListener(
            i.type,
            i.attachedListener,
            Rp(i.optionsOrUseCapture),
          );
        }
      e.nodeType !== 3 &&
        ((n = t._observers),
        n !== null &&
          n.forEach(function (n) {
            for (var r = 0, i = 0; i < Kp.length; i++) {
              var a = Kp[i];
              (a.fragmentInstance !== t ||
                a.observer !== n ||
                a.instance !== e) &&
                (Kp[r++] = a);
            }
            ((Kp.length = r), n.observe(e));
          }),
        $p(e, t));
    }
    function tm(e, t) {
      var n = t._eventListeners;
      if (n !== null)
        for (var r = 0; r < n.length; r++) {
          var i = n[r];
          e.removeEventListener(
            i.type,
            i.attachedListener,
            Rp(i.optionsOrUseCapture),
          );
        }
      e.nodeType !== 3 &&
        ((n = t._observers),
        n !== null &&
          n.forEach(function (n) {
            typeof n.rootMargin == `string` ? Jp(t, n, e) : n.unobserve(e);
          }),
        e.reactFragments != null && e.reactFragments.delete(t));
    }
    function nm(e) {
      var t = e.firstChild;
      for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
        var n = t;
        switch (((t = t.nextSibling), n.nodeName)) {
          case `HTML`:
          case `HEAD`:
          case `BODY`:
            (nm(n), Tt(n));
            continue;
          case `SCRIPT`:
          case `STYLE`:
            continue;
          case `LINK`:
            if (n.rel.toLowerCase() === `stylesheet`) continue;
        }
        e.removeChild(n);
      }
    }
    function rm(e, t, n, r) {
      for (; e.nodeType === 1;) {
        var i = n;
        if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
          if (!r && (e.nodeName !== `INPUT` || e.type !== `hidden`)) break;
        } else if (!r) {
          if (t === `input` && e.type === `hidden`) {
            var a = i.name == null ? null : `` + i.name;
            if (i.type === `hidden` && e.getAttribute(`name`) === a) return e;
          } else return e;
        } else if (!e[Ct])
          switch (t) {
            case `meta`:
              if (!e.hasAttribute(`itemprop`)) break;
              return e;
            case `link`:
              if (
                ((a = e.getAttribute(`rel`)),
                (a === `stylesheet` && e.hasAttribute(`data-precedence`)) ||
                  a !== i.rel ||
                  e.getAttribute(`href`) !==
                    (i.href == null || i.href === `` ? null : i.href) ||
                  e.getAttribute(`crossorigin`) !==
                    (i.crossOrigin == null ? null : i.crossOrigin) ||
                  e.getAttribute(`title`) !==
                    (i.title == null ? null : i.title))
              )
                break;
              return e;
            case `style`:
              if (e.hasAttribute(`data-precedence`)) break;
              return e;
            case `script`:
              if (
                ((a = e.getAttribute(`src`)),
                (a !== (i.src == null ? null : i.src) ||
                  e.getAttribute(`type`) !== (i.type == null ? null : i.type) ||
                  e.getAttribute(`crossorigin`) !==
                    (i.crossOrigin == null ? null : i.crossOrigin)) &&
                  a &&
                  e.hasAttribute(`async`) &&
                  !e.hasAttribute(`itemprop`))
              )
                break;
              return e;
            default:
              return e;
          }
        if (((e = lm(e.nextSibling)), e === null)) break;
      }
      return null;
    }
    function im(e, t, n) {
      if (t === ``) return null;
      for (; e.nodeType !== 3;)
        if (
          ((e.nodeType !== 1 ||
            e.nodeName !== `INPUT` ||
            e.type !== `hidden`) &&
            !n) ||
          ((e = lm(e.nextSibling)), e === null)
        )
          return null;
      return e;
    }
    function am(e, t) {
      for (; e.nodeType !== 8;)
        if (
          ((e.nodeType !== 1 ||
            e.nodeName !== `INPUT` ||
            e.type !== `hidden`) &&
            !t) ||
          ((e = lm(e.nextSibling)), e === null)
        )
          return null;
      return e;
    }
    function om(e) {
      return e.data === `$?` || e.data === `$~`;
    }
    function sm(e) {
      return (
        e.data === `$!` ||
        (e.data === `$?` && e.ownerDocument.readyState !== `loading`)
      );
    }
    function cm(e, t) {
      var n = e.ownerDocument;
      if (e.data === `$~`) e._reactRetry = t;
      else if (e.data !== `$?` || n.readyState !== `loading`) t();
      else {
        var r = function () {
          (t(), n.removeEventListener(`DOMContentLoaded`, r));
        };
        (n.addEventListener(`DOMContentLoaded`, r), (e._reactRetry = r));
      }
    }
    function lm(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === 1 || t === 3) break;
        if (t === 8) {
          if (
            ((t = e.data),
            t === `$` ||
              t === `$!` ||
              t === `$?` ||
              t === `$~` ||
              t === `&` ||
              t === `F!` ||
              t === `F`)
          )
            break;
          if (t === `/$` || t === `/&`) return null;
        }
      }
      return e;
    }
    var um = null;
    function dm(e) {
      e = e.nextSibling;
      for (var t = 0; e;) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === `/$` || n === `/&`) {
            if (t === 0) return lm(e.nextSibling);
            t--;
          } else
            (n !== `$` &&
              n !== `$!` &&
              n !== `$?` &&
              n !== `$~` &&
              n !== `&`) ||
              t++;
        }
        e = e.nextSibling;
      }
      return null;
    }
    function fm(e) {
      e = e.previousSibling;
      for (var t = 0; e;) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (
            n === `$` ||
            n === `$!` ||
            n === `$?` ||
            n === `$~` ||
            n === `&`
          ) {
            if (t === 0) return e;
            t--;
          } else (n !== `/$` && n !== `/&`) || t++;
        }
        e = e.previousSibling;
      }
      return null;
    }
    function pm(e, t) {
      function n() {
        r = !0;
      }
      if (e.ownerDocument.activeElement === e) return !0;
      var r = !1;
      try {
        (e.ownerDocument.addEventListener(`focus`, n, !0),
          (e.focus || HTMLElement.prototype.focus).call(e, t));
      } finally {
        e.ownerDocument.removeEventListener(`focus`, n, !0);
      }
      return r;
    }
    function mm(e) {
      yp(function () {
        yp(function (t) {
          return e(t);
        });
      });
    }
    function hm(e, t, n) {
      switch (((t = lp(n)), e)) {
        case `html`:
          if (((e = t.documentElement), !e)) throw Error(s(452));
          return e;
        case `head`:
          if (((e = t.head), !e)) throw Error(s(453));
          return e;
        case `body`:
          if (((e = t.body), !e)) throw Error(s(454));
          return e;
        default:
          throw Error(s(451));
      }
    }
    function gm(e, t, n) {
      for (var r in n) {
        var i = n[r];
        n.hasOwnProperty(r) && i != null && ep(e, t, r, null, rp, i);
      }
      (n.dangerouslySetInnerHTML != null && (e.textContent = ``),
        e.onclick === pn && (e.onclick = null),
        Tt(e));
    }
    function _m(e) {
      for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
      Tt(e);
    }
    var vm = new Map(),
      ym = new Set();
    function bm(e) {
      if (typeof e.getRootNode == `function`) {
        var t = e.getRootNode();
        if (t.nodeType === 9 || t.nodeType === 11) return t;
      }
      return e.nodeType === 9 ? e : e.ownerDocument;
    }
    var xm = V.d;
    V.d = { f: Sm, r: Cm, D: Em, C: Dm, L: Om, m: km, X: jm, S: Am, M: Mm };
    function Sm() {
      var e = xm.f(),
        t = Id();
      return e || t;
    }
    function Cm(e) {
      var t = Dt(e);
      t !== null && t.tag === 5 && t.type === `form` ? Js(t) : xm.r(e);
    }
    var wm = typeof document > `u` ? null : document;
    function Tm(e, t, n) {
      var r = wm;
      if (r && typeof t == `string` && t) {
        var i = Zt(t);
        ((i = `link[rel="` + e + `"][href="` + i + `"]`),
          typeof n == `string` && (i += `[crossorigin="` + n + `"]`),
          ym.has(i) ||
            (ym.add(i),
            (e = { rel: e, crossOrigin: n, href: t }),
            r.querySelector(i) === null &&
              ((t = r.createElement(`link`)),
              np(t, `link`, e),
              At(t),
              r.head.appendChild(t))));
      }
    }
    function Em(e) {
      (xm.D(e), Tm(`dns-prefetch`, e, null));
    }
    function Dm(e, t) {
      (xm.C(e, t), Tm(`preconnect`, e, t));
    }
    function Om(e, t, n) {
      xm.L(e, t, n);
      var r = wm;
      if (r && e && t) {
        var i = `link[rel="preload"][as="` + Zt(t) + `"]`;
        t === `image` && n && n.imageSrcSet
          ? ((i += `[imagesrcset="` + Zt(n.imageSrcSet) + `"]`),
            typeof n.imageSizes == `string` &&
              (i += `[imagesizes="` + Zt(n.imageSizes) + `"]`))
          : (i += `[href="` + Zt(e) + `"]`);
        var a = i;
        switch (t) {
          case `style`:
            a = Pm(e);
            break;
          case `script`:
            a = Rm(e);
        }
        if (!(
          vm.has(a) ||
          ((e = D(
            {
              rel: `preload`,
              href: t === `image` && n && n.imageSrcSet ? void 0 : e,
              as: t,
            },
            n,
          )),
          vm.set(a, e),
          r.querySelector(i) !== null ||
            (t === `style` && r.querySelector(Fm(a))) ||
            (t === `script` && r.querySelector(zm(a))))
        )) {
          var o = r.createElement(`link`);
          (np(o, `link`, e),
            t === `style` &&
              ((o[wt] = !0),
              (o.onload = o.onerror =
                function () {
                  jt(o);
                })),
            At(o),
            r.head.appendChild(o));
        }
      }
    }
    function km(e, t) {
      xm.m(e, t);
      var n = wm;
      if (n && e) {
        var r = t && typeof t.as == `string` ? t.as : `script`,
          i =
            `link[rel="modulepreload"][as="` +
            Zt(r) +
            `"][href="` +
            Zt(e) +
            `"]`,
          a = i;
        switch (r) {
          case `audioworklet`:
          case `paintworklet`:
          case `serviceworker`:
          case `sharedworker`:
          case `worker`:
          case `script`:
            a = Rm(e);
        }
        if (
          !vm.has(a) &&
          ((e = D({ rel: `modulepreload`, href: e }, t)),
          vm.set(a, e),
          n.querySelector(i) === null)
        ) {
          switch (r) {
            case `audioworklet`:
            case `paintworklet`:
            case `serviceworker`:
            case `sharedworker`:
            case `worker`:
            case `script`:
              if (n.querySelector(zm(a))) return;
          }
          ((r = n.createElement(`link`)),
            np(r, `link`, e),
            At(r),
            n.head.appendChild(r));
        }
      }
    }
    function Am(e, t, n) {
      xm.S(e, t, n);
      var r = wm;
      if (r && e) {
        var i = kt(r).hoistableStyles,
          a = Pm(e);
        t ||= `default`;
        var o = i.get(a);
        if (!o) {
          var s = { loading: 0, preload: null };
          if ((o = r.querySelector(Fm(a)))) s.loading = 5;
          else {
            ((e = D({ rel: `stylesheet`, href: e, "data-precedence": t }, n)),
              (n = vm.get(a)) && Hm(e, n));
            var c = (o = r.createElement(`link`));
            (At(c),
              np(c, `link`, e),
              (c._p = new Promise(function (e, t) {
                ((c.onload = e), (c.onerror = t));
              })),
              c.addEventListener(`load`, function () {
                s.loading |= 1;
              }),
              c.addEventListener(`error`, function () {
                s.loading |= 2;
              }),
              (s.loading |= 4),
              Vm(o, t, r));
          }
          ((o = { type: `stylesheet`, instance: o, count: 1, state: s }),
            i.set(a, o));
        }
      }
    }
    function jm(e, t) {
      xm.X(e, t);
      var n = wm;
      if (n && e) {
        var r = kt(n).hoistableScripts,
          i = Rm(e),
          a = r.get(i);
        a ||
          ((a = n.querySelector(zm(i))),
          a ||
            ((e = D({ src: e, async: !0 }, t)),
            (t = vm.get(i)) && Um(e, t),
            (a = n.createElement(`script`)),
            At(a),
            np(a, `link`, e),
            n.head.appendChild(a)),
          (a = { type: `script`, instance: a, count: 1, state: null }),
          r.set(i, a));
      }
    }
    function Mm(e, t) {
      xm.M(e, t);
      var n = wm;
      if (n && e) {
        var r = kt(n).hoistableScripts,
          i = Rm(e),
          a = r.get(i);
        a ||
          ((a = n.querySelector(zm(i))),
          a ||
            ((e = D({ src: e, async: !0, type: `module` }, t)),
            (t = vm.get(i)) && Um(e, t),
            (a = n.createElement(`script`)),
            At(a),
            np(a, `link`, e),
            n.head.appendChild(a)),
          (a = { type: `script`, instance: a, count: 1, state: null }),
          r.set(i, a));
      }
    }
    function Nm(e, t, n, r) {
      var i = (i = _e.current) ? bm(i) : null;
      if (!i) throw Error(s(446));
      switch (e) {
        case `meta`:
        case `title`:
          return null;
        case `style`:
          return typeof n.precedence == `string` && typeof n.href == `string`
            ? ((n = Pm(n.href)),
              (t = kt(i).hoistableStyles),
              (r = t.get(n)),
              r ||
                ((r = { type: `style`, instance: null, count: 0, state: null }),
                t.set(n, r)),
              r)
            : { type: `void`, instance: null, count: 0, state: null };
        case `link`:
          if (
            n.rel === `stylesheet` &&
            typeof n.href == `string` &&
            typeof n.precedence == `string`
          ) {
            e = Pm(n.href);
            var a = kt(i).hoistableStyles,
              o = a.get(e);
            if (
              (o ||
                ((i = i.ownerDocument || i),
                (o = {
                  type: `stylesheet`,
                  instance: null,
                  count: 0,
                  state: { loading: 0, preload: null },
                }),
                a.set(e, o),
                (a = i.querySelector(Fm(e)))
                  ? a._p || ((o.instance = a), (o.state.loading = 5))
                  : ((a = vm.get(e)),
                    a ||
                      ((a = {
                        rel: `preload`,
                        as: `style`,
                        href: n.href,
                        crossOrigin: n.crossOrigin,
                        integrity: n.integrity,
                        media: n.media,
                        hrefLang: n.hrefLang,
                        referrerPolicy: n.referrerPolicy,
                      }),
                      vm.set(e, a)),
                    Lm(i, e, a, o.state))),
              t && r === null)
            )
              throw Error(s(528, ``));
            return o;
          }
          if (t && r !== null) throw Error(s(529, ``));
          return null;
        case `script`:
          return (
            (t = n.async),
            (n = n.src),
            typeof n == `string` &&
            t &&
            typeof t != `function` &&
            typeof t != `symbol`
              ? ((n = Rm(n)),
                (t = kt(i).hoistableScripts),
                (r = t.get(n)),
                r ||
                  ((r = {
                    type: `script`,
                    instance: null,
                    count: 0,
                    state: null,
                  }),
                  t.set(n, r)),
                r)
              : { type: `void`, instance: null, count: 0, state: null }
          );
        default:
          throw Error(s(444, e));
      }
    }
    function Pm(e) {
      return `href="` + Zt(e) + `"`;
    }
    function Fm(e) {
      return `link[rel="stylesheet"][` + e + `]`;
    }
    function Im(e) {
      return D({}, e, { "data-precedence": e.precedence, precedence: null });
    }
    function Lm(e, t, n, r) {
      if ((t = e.querySelector(`link[rel="preload"][as="style"][` + t + `]`))) {
        if (!0 !== t[wt]) {
          r.loading = 1;
          return;
        }
      } else
        ((t = e.createElement(`link`)),
          (t[wt] = !0),
          (t.onload = t.onerror = jt.bind(null, t)),
          np(t, `link`, n),
          At(t),
          e.head.appendChild(t));
      ((r.preload = t),
        t.addEventListener(`load`, function () {
          return (r.loading |= 1);
        }),
        t.addEventListener(`error`, function () {
          return (r.loading |= 2);
        }));
    }
    function Rm(e) {
      return `[src="` + Zt(e) + `"]`;
    }
    function zm(e) {
      return `script[async]` + e;
    }
    function Bm(e, t, n) {
      if ((t.count++, t.instance === null))
        switch (t.type) {
          case `style`:
            var r = e.querySelector(`style[data-href~="` + Zt(n.href) + `"]`);
            if (r) return ((t.instance = r), At(r), r);
            var i = D({}, n, {
              "data-href": n.href,
              "data-precedence": n.precedence,
              href: null,
              precedence: null,
            });
            return (
              (r = (e.ownerDocument || e).createElement(`style`)),
              At(r),
              np(r, `style`, i),
              Vm(r, n.precedence, e),
              (t.instance = r)
            );
          case `stylesheet`:
            i = Pm(n.href);
            var a = e.querySelector(Fm(i));
            if (a) return ((t.state.loading |= 4), (t.instance = a), At(a), a);
            ((r = Im(n)),
              (i = vm.get(i)) && Hm(r, i),
              (a = (e.ownerDocument || e).createElement(`link`)),
              At(a));
            var o = a;
            return (
              (o._p = new Promise(function (e, t) {
                ((o.onload = e), (o.onerror = t));
              })),
              np(a, `link`, r),
              (t.state.loading |= 4),
              Vm(a, n.precedence, e),
              (t.instance = a)
            );
          case `script`:
            return (
              (a = Rm(n.src)),
              (i = e.querySelector(zm(a)))
                ? ((t.instance = i), At(i), i)
                : ((r = n),
                  (i = vm.get(a)) && ((r = D({}, n)), Um(r, i)),
                  (e = e.ownerDocument || e),
                  (i = e.createElement(`script`)),
                  At(i),
                  np(i, `link`, r),
                  e.head.appendChild(i),
                  (t.instance = i))
            );
          case `void`:
            return null;
          default:
            throw Error(s(443, t.type));
        }
      else
        t.type === `stylesheet` &&
          !(t.state.loading & 4) &&
          ((r = t.instance), (t.state.loading |= 4), Vm(r, n.precedence, e));
      return t.instance;
    }
    function Vm(e, t, n) {
      for (
        var r = n.querySelectorAll(
            `link[rel="stylesheet"][data-precedence],style[data-precedence]`,
          ),
          i = r.length ? r[r.length - 1] : null,
          a = i,
          o = 0;
        o < r.length;
        o++
      ) {
        var s = r[o];
        if (s.dataset.precedence === t) a = s;
        else if (a !== i) break;
      }
      a
        ? a.parentNode.insertBefore(e, a.nextSibling)
        : ((t = n.nodeType === 9 ? n.head : n),
          t.insertBefore(e, t.firstChild));
    }
    function Hm(e, t) {
      ((e.crossOrigin ??= t.crossOrigin),
        (e.referrerPolicy ??= t.referrerPolicy),
        (e.title ??= t.title));
    }
    function Um(e, t) {
      ((e.crossOrigin ??= t.crossOrigin),
        (e.referrerPolicy ??= t.referrerPolicy),
        (e.integrity ??= t.integrity));
    }
    var Wm = null;
    function Gm(e, t, n) {
      if (Wm === null) {
        var r = new Map(),
          i = (Wm = new Map());
        i.set(n, r);
      } else ((i = Wm), (r = i.get(n)), r || ((r = new Map()), i.set(n, r)));
      if (r.has(e)) return r;
      for (
        r.set(e, null), n = n.getElementsByTagName(e), i = 0;
        i < n.length;
        i++
      ) {
        var a = n[i];
        if (
          !(
            a[Ct] ||
            a[gt] ||
            (e === `link` && a.getAttribute(`rel`) === `stylesheet`)
          ) &&
          a.namespaceURI !== `http://www.w3.org/2000/svg`
        ) {
          var o = a.getAttribute(t) || ``;
          o = e + o;
          var s = r.get(o);
          s ? s.push(a) : r.set(o, [a]);
        }
      }
      return r;
    }
    function Km(e, t, n) {
      ((e = e.ownerDocument || e),
        e.head.insertBefore(
          n,
          t === `title` ? e.querySelector(`head > title`) : null,
        ));
    }
    function qm(e, t, n) {
      if (n === 1 || t.itemProp != null) return !1;
      switch (e) {
        case `meta`:
        case `title`:
          return !0;
        case `style`:
          if (
            typeof t.precedence != `string` ||
            typeof t.href != `string` ||
            t.href === ``
          )
            break;
          return !0;
        case `link`:
          if (
            typeof t.rel != `string` ||
            typeof t.href != `string` ||
            t.href === `` ||
            t.onLoad ||
            t.onError
          )
            break;
          switch (t.rel) {
            case `stylesheet`:
              return (
                (e = t.disabled),
                typeof t.precedence == `string` && e == null
              );
            default:
              return !0;
          }
        case `script`:
          if (
            t.async &&
            typeof t.async != `function` &&
            typeof t.async != `symbol` &&
            !t.onLoad &&
            !t.onError &&
            t.src &&
            typeof t.src == `string`
          )
            return !0;
      }
      return !1;
    }
    function Jm(e, t) {
      return (
        e === `img` &&
        t.src != null &&
        t.src !== `` &&
        t.onLoad == null &&
        t.loading !== `lazy`
      );
    }
    function Ym(e) {
      return !(e.type === `stylesheet` && !(e.state.loading & 3));
    }
    function Xm(e) {
      return (
        (e.width || 100) *
        (e.height || 100) *
        (typeof devicePixelRatio == `number` ? devicePixelRatio : 1) *
        0.25
      );
    }
    function Zm(e, t) {
      typeof t.decode == `function` &&
        (e.imgCount++,
        t.complete || ((e.imgBytes += Xm(t)), e.suspenseyImages.push(t)),
        (e = rh.bind(e)),
        t.decode().then(e, e));
    }
    function Qm(e, t, n, r) {
      if (
        n.type === `stylesheet` &&
        (typeof r.media != `string` || !1 !== matchMedia(r.media).matches) &&
        !(n.state.loading & 4)
      ) {
        if (n.instance === null) {
          var i = Pm(r.href),
            a = t.querySelector(Fm(i));
          if (a) {
            ((t = a._p),
              typeof t == `object` &&
                t &&
                typeof t.then == `function` &&
                (e.count++, (e = nh.bind(e)), t.then(e, e)),
              (n.state.loading |= 4),
              (n.instance = a),
              At(a));
            return;
          }
          ((a = t.ownerDocument || t),
            (r = Im(r)),
            (i = vm.get(i)) && Hm(r, i),
            (a = a.createElement(`link`)),
            At(a));
          var o = a;
          ((o._p = new Promise(function (e, t) {
            ((o.onload = e), (o.onerror = t));
          })),
            np(a, `link`, r),
            (n.instance = a));
        }
        (e.stylesheets === null && (e.stylesheets = new Map()),
          e.stylesheets.set(n, t),
          (t = n.state.preload) &&
            !(n.state.loading & 3) &&
            (e.count++,
            (n = nh.bind(e)),
            t.addEventListener(`load`, n),
            t.addEventListener(`error`, n)));
      }
    }
    var $m = 0;
    function eh(e, t) {
      return (
        e.stylesheets && e.count === 0 && ah(e, e.stylesheets),
        0 < e.count || 0 < e.imgCount
          ? function (n) {
              var r = setTimeout(function () {
                if ((e.stylesheets && ah(e, e.stylesheets), e.unsuspend)) {
                  var t = e.unsuspend;
                  ((e.unsuspend = null), t());
                }
              }, 6e4 + t);
              0 < e.imgBytes && $m === 0 && ($m = 62500 * op());
              var i = setTimeout(
                function () {
                  if (
                    ((e.waitingForImages = !1),
                    e.count === 0 &&
                      (e.stylesheets && ah(e, e.stylesheets), e.unsuspend))
                  ) {
                    var t = e.unsuspend;
                    ((e.unsuspend = null), t());
                  }
                },
                (e.imgBytes > $m ? 50 : 800) + t,
              );
              return (
                (e.unsuspend = n),
                function () {
                  ((e.unsuspend = null), clearTimeout(r), clearTimeout(i));
                }
              );
            }
          : null
      );
    }
    function th(e) {
      if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
        if (e.stylesheets) ah(e, e.stylesheets);
        else if (e.unsuspend) {
          var t = e.unsuspend;
          ((e.unsuspend = null), t());
        }
      }
    }
    function nh() {
      (this.count--, th(this));
    }
    function rh() {
      (this.imgCount--, th(this));
    }
    var ih = null;
    function ah(e, t) {
      ((e.stylesheets = null),
        e.unsuspend !== null &&
          (e.count++,
          (ih = new Map()),
          t.forEach(oh, e),
          (ih = null),
          nh.call(e)));
    }
    function oh(e, t) {
      if (!(t.state.loading & 4)) {
        var n = ih.get(e);
        if (n) var r = n.get(null);
        else {
          ((n = new Map()), ih.set(e, n));
          for (
            var i = e.querySelectorAll(
                `link[data-precedence],style[data-precedence]`,
              ),
              a = 0;
            a < i.length;
            a++
          ) {
            var o = i[a];
            (o.nodeName === `LINK` || o.getAttribute(`media`) !== `not all`) &&
              (n.set(o.dataset.precedence, o), (r = o));
          }
          r && n.set(null, r);
        }
        ((i = t.instance),
          (o = i.getAttribute(`data-precedence`)),
          (a = n.get(o) || r),
          a === r && n.set(null, i),
          n.set(o, i),
          this.count++,
          (r = nh.bind(this)),
          i.addEventListener(`load`, r),
          i.addEventListener(`error`, r),
          a
            ? a.parentNode.insertBefore(i, a.nextSibling)
            : ((e = e.nodeType === 9 ? e.head : e),
              e.insertBefore(i, e.firstChild)),
          (t.state.loading |= 4));
      }
    }
    var sh = {
      $$typeof: F,
      Provider: null,
      Consumer: null,
      _currentValue: de,
      _currentValue2: de,
      _threadCount: 0,
    };
    function ch(e, t, n, r, i, a, o, s, c) {
      ((this.tag = 1),
        (this.containerInfo = e),
        (this.pingCache = this.current = this.pendingChildren = null),
        (this.timeoutHandle = -1),
        (this.callbackNode =
          this.next =
          this.pendingContext =
          this.context =
          this.cancelPendingCommit =
            null),
        (this.callbackPriority = 0),
        (this.expirationTimes = at(-1)),
        (this.entangledLanes =
          this.shellSuspendCounter =
          this.errorRecoveryDisabledLanes =
          this.expiredLanes =
          this.warmLanes =
          this.pingedLanes =
          this.suspendedLanes =
          this.pendingLanes =
            0),
        (this.entanglements = at(0)),
        (this.hiddenUpdates = at(null)),
        (this.identifierPrefix = r),
        (this.onUncaughtError = i),
        (this.onCaughtError = a),
        (this.onRecoverableError = o),
        (this.pooledCache = null),
        (this.pooledCacheLanes = 0),
        (this.formState = c),
        (this.transitionTypes = null),
        (this.incompleteTransitions = new Map()));
    }
    function lh(e, t, n, r, i, a, o, s, c, l, u, d) {
      return (
        (e = new ch(e, t, n, o, c, l, u, d, s)),
        (t = 1),
        !0 === a && (t |= 24),
        (a = Ei(3, null, null, t)),
        (e.current = a),
        (a.stateNode = e),
        (t = Ta()),
        t.refCount++,
        (e.pooledCache = t),
        t.refCount++,
        (a.memoizedState = { element: r, isDehydrated: n, cache: t }),
        ao(a),
        e
      );
    }
    function uh(e) {
      return e ? ((e = wi), e) : wi;
    }
    function dh(e, t, n, r, i, a) {
      ((i = uh(i)),
        r.context === null ? (r.context = i) : (r.pendingContext = i),
        (r = so(t)),
        (r.payload = { element: n }),
        (a = a === void 0 ? null : a),
        a !== null && (r.callback = a),
        (n = co(e, r, t)),
        n !== null && (jd(n, e, t), lo(n, e, t)));
    }
    function fh(e, t) {
      if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
        var n = e.retryLane;
        e.retryLane = n !== 0 && n < t ? n : t;
      }
    }
    function ph(e, t) {
      (fh(e, t), (e = e.alternate) && fh(e, t));
    }
    function mh(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = xi(e, 67108864);
        (t !== null && jd(t, e, 67108864), ph(e, 67108864));
      }
    }
    function hh(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = Od();
        t = dt(t);
        var n = xi(e, t);
        (n !== null && jd(n, e, t), ph(e, t));
      }
    }
    var gh = !0;
    function _h(e, t, n, r) {
      var i = B.T;
      B.T = null;
      var a = V.p;
      try {
        ((V.p = 2), yh(e, t, n, r));
      } finally {
        ((V.p = a), (B.T = i));
      }
    }
    function vh(e, t, n, r) {
      var i = B.T;
      B.T = null;
      var a = V.p;
      try {
        ((V.p = 8), yh(e, t, n, r));
      } finally {
        ((V.p = a), (B.T = i));
      }
    }
    function yh(e, t, n, r) {
      if (gh) {
        var i = bh(r);
        if (i === null) (Gf(e, t, r, xh, n), Mh(e, r));
        else if (Ph(i, e, t, n, r)) r.stopPropagation();
        else if ((Mh(e, r), t & 4 && -1 < jh.indexOf(e))) {
          for (; i !== null;) {
            var a = Dt(i);
            if (a !== null)
              switch (a.tag) {
                case 3:
                  if (
                    ((a = a.stateNode), a.current.memoizedState.isDehydrated)
                  ) {
                    var o = $e(a.pendingLanes);
                    if (o !== 0) {
                      var s = a;
                      for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
                        var c = 1 << (31 - Ke(o));
                        ((s.entanglements[1] |= c), (o &= ~c));
                      }
                      (wf(a), !(Ku & 6) && ((pd = Pe() + 500), Tf(0, !1)));
                    }
                  }
                  break;
                case 31:
                case 13:
                  ((s = xi(a, 2)), s !== null && jd(s, a, 2), Id(), ph(a, 2));
              }
            if (((a = bh(r)), a === null && Gf(e, t, r, xh, n), a === i)) break;
            i = a;
          }
          i !== null && r.stopPropagation();
        } else Gf(e, t, r, null, n);
      }
    }
    function bh(e) {
      return ((e = hn(e)), Sh(e));
    }
    var xh = null;
    function Sh(e) {
      if (((xh = null), (e = Et(e)), e !== null)) {
        var t = l(e);
        if (t === null) e = null;
        else {
          var n = t.tag;
          if (n === 13) {
            if (((e = u(t)), e !== null)) return e;
            e = null;
          } else if (n === 31) {
            if (((e = d(t)), e !== null)) return e;
            e = null;
          } else if (n === 3) {
            if (t.stateNode.current.memoizedState.isDehydrated)
              return t.tag === 3 ? t.stateNode.containerInfo : null;
            e = null;
          } else t !== e && (e = null);
        }
      }
      return ((xh = e), null);
    }
    function Ch(e) {
      switch (e) {
        case `beforetoggle`:
        case `cancel`:
        case `click`:
        case `close`:
        case `contextmenu`:
        case `copy`:
        case `cut`:
        case `auxclick`:
        case `dblclick`:
        case `dragend`:
        case `dragstart`:
        case `drop`:
        case `focusin`:
        case `focusout`:
        case `input`:
        case `invalid`:
        case `keydown`:
        case `keypress`:
        case `keyup`:
        case `mousedown`:
        case `mouseup`:
        case `paste`:
        case `pause`:
        case `play`:
        case `pointercancel`:
        case `pointerdown`:
        case `pointerup`:
        case `ratechange`:
        case `reset`:
        case `seeked`:
        case `submit`:
        case `toggle`:
        case `touchcancel`:
        case `touchend`:
        case `touchstart`:
        case `volumechange`:
        case `change`:
        case `selectionchange`:
        case `textInput`:
        case `compositionstart`:
        case `compositionend`:
        case `compositionupdate`:
        case `beforeblur`:
        case `afterblur`:
        case `beforeinput`:
        case `blur`:
        case `fullscreenchange`:
        case `fullscreenerror`:
        case `focus`:
        case `hashchange`:
        case `popstate`:
        case `select`:
        case `selectstart`:
          return 2;
        case `drag`:
        case `dragenter`:
        case `dragexit`:
        case `dragleave`:
        case `dragover`:
        case `mousemove`:
        case `mouseout`:
        case `mouseover`:
        case `pointermove`:
        case `pointerout`:
        case `pointerover`:
        case `resize`:
        case `scroll`:
        case `touchmove`:
        case `wheel`:
        case `mouseenter`:
        case `mouseleave`:
        case `pointerenter`:
        case `pointerleave`:
          return 8;
        case `message`:
          switch (Fe()) {
            case Ie:
              return 2;
            case Le:
              return 8;
            case Re:
            case ze:
              return 32;
            case Be:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var wh = !1,
      Th = null,
      Eh = null,
      Dh = null,
      Oh = new Map(),
      kh = new Map(),
      Ah = [],
      jh =
        `mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(
          ` `,
        );
    function Mh(e, t) {
      switch (e) {
        case `focusin`:
        case `focusout`:
          Th = null;
          break;
        case `dragenter`:
        case `dragleave`:
          Eh = null;
          break;
        case `mouseover`:
        case `mouseout`:
          Dh = null;
          break;
        case `pointerover`:
        case `pointerout`:
          Oh.delete(t.pointerId);
          break;
        case `gotpointercapture`:
        case `lostpointercapture`:
          kh.delete(t.pointerId);
      }
    }
    function Nh(e, t, n, r, i, a) {
      return e === null || e.nativeEvent !== a
        ? ((e = {
            blockedOn: t,
            domEventName: n,
            eventSystemFlags: r,
            nativeEvent: a,
            targetContainers: [i],
          }),
          t !== null && ((t = Dt(t)), t !== null && mh(t)),
          e)
        : ((e.eventSystemFlags |= r),
          (t = e.targetContainers),
          i !== null && t.indexOf(i) === -1 && t.push(i),
          e);
    }
    function Ph(e, t, n, r, i) {
      switch (t) {
        case `focusin`:
          return ((Th = Nh(Th, e, t, n, r, i)), !0);
        case `dragenter`:
          return ((Eh = Nh(Eh, e, t, n, r, i)), !0);
        case `mouseover`:
          return ((Dh = Nh(Dh, e, t, n, r, i)), !0);
        case `pointerover`:
          var a = i.pointerId;
          return (Oh.set(a, Nh(Oh.get(a) || null, e, t, n, r, i)), !0);
        case `gotpointercapture`:
          return (
            (a = i.pointerId),
            kh.set(a, Nh(kh.get(a) || null, e, t, n, r, i)),
            !0
          );
      }
      return !1;
    }
    function Fh(e) {
      var t = Et(e.target);
      if (t !== null) {
        var n = l(t);
        if (n !== null) {
          if (((t = n.tag), t === 13)) {
            if (((t = u(n)), t !== null)) {
              ((e.blockedOn = t),
                mt(e.priority, function () {
                  hh(n);
                }));
              return;
            }
          } else if (t === 31) {
            if (((t = d(n)), t !== null)) {
              ((e.blockedOn = t),
                mt(e.priority, function () {
                  hh(n);
                }));
              return;
            }
          } else if (
            t === 3 &&
            n.stateNode.current.memoizedState.isDehydrated
          ) {
            e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
            return;
          }
        }
      }
      e.blockedOn = null;
    }
    function Ih(e) {
      if (e.blockedOn !== null) return !1;
      for (var t = e.targetContainers; 0 < t.length;) {
        var n = bh(e.nativeEvent);
        if (n === null) {
          n = e.nativeEvent;
          var r = new n.constructor(n.type, n);
          ((mn = r), n.target.dispatchEvent(r), (mn = null));
        } else return ((t = Dt(n)), t !== null && mh(t), (e.blockedOn = n), !1);
        t.shift();
      }
      return !0;
    }
    function Lh(e, t, n) {
      Ih(e) && n.delete(t);
    }
    function Rh() {
      ((wh = !1),
        Th !== null && Ih(Th) && (Th = null),
        Eh !== null && Ih(Eh) && (Eh = null),
        Dh !== null && Ih(Dh) && (Dh = null),
        Oh.forEach(Lh),
        kh.forEach(Lh));
    }
    function zh(e, n) {
      e.blockedOn === n &&
        ((e.blockedOn = null),
        wh ||
          ((wh = !0),
          t.unstable_scheduleCallback(t.unstable_NormalPriority, Rh)));
    }
    var Bh = null;
    function Vh(e) {
      Bh !== e &&
        ((Bh = e),
        t.unstable_scheduleCallback(t.unstable_NormalPriority, function () {
          Bh === e && (Bh = null);
          for (var t = 0; t < e.length; t += 3) {
            var n = e[t],
              r = e[t + 1],
              i = e[t + 2];
            if (typeof r != `function`) {
              if (Sh(r || n) === null) continue;
              break;
            }
            var a = Dt(n);
            a !== null &&
              (e.splice(t, 3),
              (t -= 3),
              Ks(
                a,
                { pending: !0, data: i, method: n.method, action: r },
                r,
                i,
              ));
          }
        }));
    }
    function Hh(e) {
      function t(t) {
        return zh(t, e);
      }
      (Th !== null && zh(Th, e),
        Eh !== null && zh(Eh, e),
        Dh !== null && zh(Dh, e),
        Oh.forEach(t),
        kh.forEach(t));
      for (var n = 0; n < Ah.length; n++) {
        var r = Ah[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
      for (; 0 < Ah.length && ((n = Ah[0]), n.blockedOn === null);)
        (Fh(n), n.blockedOn === null && Ah.shift());
      if (((n = (e.ownerDocument || e).$$reactFormReplay), n != null))
        for (r = 0; r < n.length; r += 3) {
          var i = n[r],
            a = n[r + 1],
            o = i[_t] || null;
          if (typeof a == `function`) o || Vh(n);
          else if (o) {
            var s = null;
            if (a && a.hasAttribute(`formAction`)) {
              if (((i = a), (o = a[_t] || null))) s = o.formAction;
              else if (Sh(i) !== null) continue;
            } else s = o.action;
            (typeof s == `function`
              ? (n[r + 1] = s)
              : (n.splice(r, 3), (r -= 3)),
              Vh(n));
          }
        }
    }
    function Uh() {
      function e(e) {
        e.canIntercept &&
          e.info === `react-transition` &&
          e.intercept({
            handler: function () {
              return new Promise(function (e) {
                return (i = e);
              });
            },
            focusReset: `manual`,
            scroll: `manual`,
          });
      }
      function t() {
        (i !== null && (i(), (i = null)), r || setTimeout(n, 20));
      }
      function n() {
        if (!r && !navigation.transition) {
          var e = navigation.currentEntry;
          e &&
            e.url != null &&
            navigation.navigate(e.url, {
              state: e.getState(),
              info: `react-transition`,
              history: `replace`,
            });
        }
      }
      if (typeof navigation == `object`) {
        var r = !1,
          i = null;
        return (
          navigation.addEventListener(`navigate`, e),
          navigation.addEventListener(`navigatesuccess`, t),
          navigation.addEventListener(`navigateerror`, t),
          setTimeout(n, 100),
          function () {
            ((r = !0),
              navigation.removeEventListener(`navigate`, e),
              navigation.removeEventListener(`navigatesuccess`, t),
              navigation.removeEventListener(`navigateerror`, t),
              i !== null && (i(), (i = null)));
          }
        );
      }
    }
    function Wh(e) {
      this._internalRoot = e;
    }
    ((Gh.prototype.render = Wh.prototype.render =
      function (e) {
        var t = this._internalRoot;
        if (t === null) throw Error(s(409));
        var n = t.current;
        dh(n, Od(), e, t, null, null);
      }),
      (Gh.prototype.unmount = Wh.prototype.unmount =
        function () {
          var e = this._internalRoot;
          if (e !== null) {
            this._internalRoot = null;
            var t = e.containerInfo;
            (dh(e.current, 2, null, e, null, null), Id(), (t[vt] = null));
          }
        }));
    function Gh(e) {
      this._internalRoot = e;
    }
    Gh.prototype.unstable_scheduleHydration = function (e) {
      if (e) {
        var t = pt();
        e = { blockedOn: null, target: e, priority: t };
        for (var n = 0; n < Ah.length && t !== 0 && t < Ah[n].priority; n++);
        (Ah.splice(n, 0, e), n === 0 && Fh(e));
      }
    };
    var Kh = r.version;
    if (Kh !== `19.3.1`) throw Error(s(527, Kh, `19.3.1`));
    V.findDOMNode = function (e) {
      var t = e._reactInternals;
      if (t === void 0)
        throw typeof e.render == `function`
          ? Error(s(188))
          : ((e = Object.keys(e).join(`,`)), Error(s(268, e)));
      return (
        (e = p(t)),
        (e = e === null ? null : m(e)),
        (e = e === null ? null : e.stateNode),
        e
      );
    };
    var qh = {
      bundleType: 0,
      version: `19.3.1`,
      rendererPackageName: `react-dom`,
      currentDispatcherRef: B,
      reconcilerVersion: `19.3.1`,
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < `u`) {
      var Jh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!Jh.isDisabled && Jh.supportsFiber)
        try {
          ((Ue = Jh.inject(qh)), (We = Jh));
        } catch {}
    }
    e.createRoot = function (e, t) {
      if (!c(e)) throw Error(s(299));
      var n = !1,
        r = ``,
        i = pc,
        a = mc,
        o = hc;
      return (
        t != null &&
          (!0 === t.unstable_strictMode && (n = !0),
          t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
          t.onUncaughtError !== void 0 && (i = t.onUncaughtError),
          t.onCaughtError !== void 0 && (a = t.onCaughtError),
          t.onRecoverableError !== void 0 && (o = t.onRecoverableError)),
        (t = lh(e, 1, !1, null, null, n, r, null, i, a, o, Uh)),
        (e[vt] = t.current),
        Uf(e),
        new Wh(t)
      );
    };
  }),
  c = e((e, t) => {
    function n() {
      if (
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < `u` &&
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == `function`
      )
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
        } catch (e) {
          console.error(e);
        }
    }
    (n(), (t.exports = s()));
  })(),
  l = i(),
  u = `1.3.27`;
function d(e, t, n) {
  return Math.max(e, Math.min(t, n));
}
function f(e, t, n) {
  return (1 - n) * e + n * t;
}
function p(e, t, n, r) {
  return f(e, t, 1 - Math.exp(-n * r));
}
function m(e, t) {
  return ((e % t) + t) % t;
}
var h = class {
  isRunning = !1;
  value = 0;
  from = 0;
  to = 0;
  currentTime = 0;
  lerp;
  duration;
  easing;
  onUpdate;
  advance(e) {
    if (!this.isRunning) return;
    let t = !1;
    if (this.duration && this.easing) {
      this.currentTime += e;
      let n = d(0, this.currentTime / this.duration, 1);
      t = n >= 1;
      let r = t ? 1 : this.easing(n);
      this.value = this.from + (this.to - this.from) * r;
    } else
      this.lerp
        ? ((this.value = p(this.value, this.to, this.lerp * 60, e)),
          Math.round(this.value) === Math.round(this.to) &&
            ((this.value = this.to), (t = !0)))
        : ((this.value = this.to), (t = !0));
    (t && this.stop(), this.onUpdate?.(this.value, t));
  }
  stop() {
    this.isRunning = !1;
  }
  fromTo(e, t, { lerp: n, duration: r, easing: i, onStart: a, onUpdate: o }) {
    ((this.from = this.value = e),
      (this.to = t),
      (this.lerp = n),
      (this.duration = r),
      (this.easing = i),
      (this.currentTime = 0),
      (this.isRunning = !0),
      a?.(),
      (this.onUpdate = o));
  }
};
function g(e, t) {
  let n;
  return function (...r) {
    (clearTimeout(n),
      (n = setTimeout(() => {
        ((n = void 0), e.apply(this, r));
      }, t)));
  };
}
var _ = class {
    width = 0;
    height = 0;
    scrollHeight = 0;
    scrollWidth = 0;
    debouncedResize;
    wrapperResizeObserver;
    contentResizeObserver;
    constructor(e, t, { autoResize: n = !0, debounce: r = 250 } = {}) {
      ((this.wrapper = e),
        (this.content = t),
        n &&
          ((this.debouncedResize = g(this.resize, r)),
          this.wrapper instanceof Window
            ? window.addEventListener(`resize`, this.debouncedResize)
            : ((this.wrapperResizeObserver = new ResizeObserver(
                this.debouncedResize,
              )),
              this.wrapperResizeObserver.observe(this.wrapper)),
          (this.contentResizeObserver = new ResizeObserver(
            this.debouncedResize,
          )),
          this.contentResizeObserver.observe(this.content)),
        this.resize());
    }
    destroy() {
      (this.wrapperResizeObserver?.disconnect(),
        this.contentResizeObserver?.disconnect(),
        this.wrapper === window &&
          this.debouncedResize &&
          window.removeEventListener(`resize`, this.debouncedResize));
    }
    resize = () => {
      (this.onWrapperResize(), this.onContentResize());
    };
    onWrapperResize = () => {
      this.wrapper instanceof Window
        ? ((this.width = window.innerWidth), (this.height = window.innerHeight))
        : ((this.width = this.wrapper.clientWidth),
          (this.height = this.wrapper.clientHeight));
    };
    onContentResize = () => {
      this.wrapper instanceof Window
        ? ((this.scrollHeight = this.content.scrollHeight),
          (this.scrollWidth = this.content.scrollWidth))
        : ((this.scrollHeight = this.wrapper.scrollHeight),
          (this.scrollWidth = this.wrapper.scrollWidth));
    };
    get limit() {
      return {
        x: this.scrollWidth - this.width,
        y: this.scrollHeight - this.height,
      };
    }
  },
  v = class {
    events = {};
    emit(e, ...t) {
      let n = this.events[e] || [];
      for (let e = 0, r = n.length; e < r; e++) n[e]?.(...t);
    }
    on(e, t) {
      return (
        this.events[e] ? this.events[e].push(t) : (this.events[e] = [t]),
        () => {
          this.events[e] = this.events[e]?.filter((e) => t !== e);
        }
      );
    }
    off(e, t) {
      this.events[e] = this.events[e]?.filter((e) => t !== e);
    }
    destroy() {
      this.events = {};
    }
  },
  y = 100 / 6,
  b = { passive: !1 };
function x(e, t) {
  return e === 1 ? y : e === 2 ? t : 1;
}
var S = class {
    touchStart = { x: 0, y: 0 };
    lastDelta = { x: 0, y: 0 };
    window = { width: 0, height: 0 };
    emitter = new v();
    constructor(e, t = { wheelMultiplier: 1, touchMultiplier: 1 }) {
      ((this.element = e),
        (this.options = t),
        window.addEventListener(`resize`, this.onWindowResize),
        this.onWindowResize(),
        this.element.addEventListener(`wheel`, this.onWheel, b),
        this.element.addEventListener(`touchstart`, this.onTouchStart, b),
        this.element.addEventListener(`touchmove`, this.onTouchMove, b),
        this.element.addEventListener(`touchend`, this.onTouchEnd, b));
    }
    on(e, t) {
      return this.emitter.on(e, t);
    }
    destroy() {
      (this.emitter.destroy(),
        window.removeEventListener(`resize`, this.onWindowResize),
        this.element.removeEventListener(`wheel`, this.onWheel, b),
        this.element.removeEventListener(`touchstart`, this.onTouchStart, b),
        this.element.removeEventListener(`touchmove`, this.onTouchMove, b),
        this.element.removeEventListener(`touchend`, this.onTouchEnd, b));
    }
    onTouchStart = (e) => {
      let { clientX: t, clientY: n } = e.targetTouches ? e.targetTouches[0] : e;
      ((this.touchStart.x = t),
        (this.touchStart.y = n),
        (this.lastDelta = { x: 0, y: 0 }),
        this.emitter.emit(`scroll`, { deltaX: 0, deltaY: 0, event: e }));
    };
    onTouchMove = (e) => {
      let { clientX: t, clientY: n } = e.targetTouches ? e.targetTouches[0] : e,
        r = -(t - this.touchStart.x) * this.options.touchMultiplier,
        i = -(n - this.touchStart.y) * this.options.touchMultiplier;
      ((this.touchStart.x = t),
        (this.touchStart.y = n),
        (this.lastDelta = { x: r, y: i }),
        this.emitter.emit(`scroll`, { deltaX: r, deltaY: i, event: e }));
    };
    onTouchEnd = (e) => {
      this.emitter.emit(`scroll`, {
        deltaX: this.lastDelta.x,
        deltaY: this.lastDelta.y,
        event: e,
      });
    };
    onWheel = (e) => {
      let { deltaX: t, deltaY: n, deltaMode: r } = e,
        i = x(r, this.window.width),
        a = x(r, this.window.height);
      ((t *= i),
        (n *= a),
        (t *= this.options.wheelMultiplier),
        (n *= this.options.wheelMultiplier),
        this.emitter.emit(`scroll`, { deltaX: t, deltaY: n, event: e }));
    };
    onWindowResize = () => {
      this.window = { width: window.innerWidth, height: window.innerHeight };
    };
  },
  C = (e) => Math.min(1, 1.001 - 2 ** (-10 * e)),
  w = class {
    _isScrolling = !1;
    _isStopped = !1;
    _isLocked = !1;
    _preventNextNativeScrollEvent = !1;
    _resetVelocityTimeout = null;
    _rafId = null;
    _isDraggingSelection = !1;
    reducedMotionMediaQuery = window.matchMedia(
      `(prefers-reduced-motion: reduce)`,
    );
    isTouching;
    isIos;
    time = 0;
    userData = {};
    lastVelocity = 0;
    velocity = 0;
    direction = 0;
    options;
    targetScroll;
    animatedScroll;
    animate = new h();
    emitter = new v();
    dimensions;
    virtualScroll;
    constructor({
      wrapper: e = window,
      content: t = document.documentElement,
      eventsTarget: n = e,
      smoothWheel: r = !0,
      syncTouch: i = !1,
      syncTouchLerp: a = 0.075,
      touchInertiaExponent: o = 1.7,
      duration: s,
      easing: c,
      lerp: l = 0.1,
      infinite: d = !1,
      orientation: f = `vertical`,
      gestureOrientation: p = f === `horizontal` ? `both` : `vertical`,
      touchMultiplier: m = 1,
      wheelMultiplier: h = 1,
      autoResize: g = !0,
      prevent: v,
      virtualScroll: y,
      overscroll: b = !0,
      autoRaf: x = !1,
      anchors: w = !1,
      autoToggle: T = !1,
      allowNestedScroll: E = !1,
      __experimental__naiveDimensions: D = !1,
      naiveDimensions: O = D,
      stopInertiaOnNavigate: k = !1,
      respectReducedMotion: A = !0,
    } = {}) {
      ((window.lenisVersion = u),
        window.lenis || (window.lenis = {}),
        (window.lenis.version = u),
        f === `horizontal` && (window.lenis.horizontal = !0),
        i === !0 && (window.lenis.touch = !0),
        (this.isIos = /(iPad|iPhone|iPod)/g.test(navigator.userAgent)),
        (e && e !== document.documentElement) || (e = window),
        typeof s == `number` && typeof c != `function`
          ? (c = C)
          : typeof c == `function` && typeof s != `number` && (s = 1),
        (this.options = {
          wrapper: e,
          content: t,
          eventsTarget: n,
          smoothWheel: r,
          syncTouch: i,
          syncTouchLerp: a,
          touchInertiaExponent: o,
          duration: s,
          easing: c,
          lerp: l,
          infinite: d,
          gestureOrientation: p,
          orientation: f,
          touchMultiplier: m,
          wheelMultiplier: h,
          autoResize: g,
          prevent: v,
          virtualScroll: y,
          overscroll: b,
          autoRaf: x,
          anchors: w,
          autoToggle: T,
          allowNestedScroll: E,
          naiveDimensions: O,
          stopInertiaOnNavigate: k,
          respectReducedMotion: A,
        }),
        (this.dimensions = new _(e, t, { autoResize: g })),
        this.updateClassName(),
        (this.targetScroll = this.animatedScroll = this.actualScroll),
        this.options.wrapper.addEventListener(`scroll`, this.onNativeScroll),
        this.options.wrapper.addEventListener(`scrollend`, this.onScrollEnd, {
          capture: !0,
        }),
        (this.options.anchors || this.options.stopInertiaOnNavigate) &&
          this.options.wrapper.addEventListener(`click`, this.onClick),
        this.options.wrapper.addEventListener(
          `pointerdown`,
          this.onPointerDown,
        ),
        (this.virtualScroll = new S(n, {
          touchMultiplier: m,
          wheelMultiplier: h,
        })),
        this.virtualScroll.on(`scroll`, this.onVirtualScroll),
        this.options.autoToggle &&
          (this.checkOverflow(),
          this.rootElement.addEventListener(
            `transitionend`,
            this.onTransitionEnd,
          )),
        this.options.autoRaf &&
          (this._rafId = requestAnimationFrame(this.raf)));
    }
    destroy() {
      (this.emitter.destroy(),
        this._resetVelocityTimeout !== null &&
          (clearTimeout(this._resetVelocityTimeout),
          (this._resetVelocityTimeout = null)),
        this.options.wrapper.removeEventListener(`scroll`, this.onNativeScroll),
        this.options.wrapper.removeEventListener(
          `scrollend`,
          this.onScrollEnd,
          { capture: !0 },
        ),
        this.options.wrapper.removeEventListener(
          `pointerdown`,
          this.onPointerDown,
        ),
        (this.options.anchors || this.options.stopInertiaOnNavigate) &&
          this.options.wrapper.removeEventListener(`click`, this.onClick),
        this.virtualScroll.destroy(),
        this.dimensions.destroy(),
        this.cleanUpClassName(),
        this._rafId && cancelAnimationFrame(this._rafId));
    }
    on(e, t) {
      return this.emitter.on(e, t);
    }
    off(e, t) {
      return this.emitter.off(e, t);
    }
    onScrollEnd = (e) => {
      e instanceof CustomEvent ||
        ((this.isScrolling === `smooth` || this.isScrolling === !1) &&
          e.stopPropagation());
    };
    dispatchScrollendEvent = () => {
      this.options.wrapper.dispatchEvent(
        new CustomEvent(`scrollend`, {
          bubbles: this.options.wrapper === window,
          detail: { lenisScrollEnd: !0 },
        }),
      );
    };
    get overflow() {
      let e = this.isHorizontal ? `overflow-x` : `overflow-y`;
      return getComputedStyle(this.rootElement)[e];
    }
    checkOverflow() {
      [`hidden`, `clip`].includes(this.overflow)
        ? this.internalStop()
        : this.internalStart();
    }
    onTransitionEnd = (e) => {
      e.propertyName?.includes(`overflow`) &&
        e.target === this.rootElement &&
        this.checkOverflow();
    };
    setScroll(e) {
      this.isHorizontal
        ? this.options.wrapper.scrollTo({ left: e, behavior: `instant` })
        : this.options.wrapper.scrollTo({ top: e, behavior: `instant` });
    }
    onClick = (e) => {
      let t = e
          .composedPath()
          .filter((e) => e instanceof HTMLAnchorElement && e.href)
          .map((e) => new URL(e.href)),
        n = new URL(window.location.href);
      if (this.options.anchors) {
        let e = t.find(
          (e) => n.host === e.host && n.pathname === e.pathname && e.hash,
        );
        if (e) {
          let t =
              typeof this.options.anchors == `object` && this.options.anchors
                ? this.options.anchors
                : void 0,
            n = decodeURIComponent(e.hash);
          this.scrollTo(n, t);
          return;
        }
      }
      this.options.stopInertiaOnNavigate &&
        t.some((e) => n.host === e.host && n.pathname !== e.pathname) &&
        this.reset();
    };
    onPointerDown = (e) => {
      e.button === 1 && this.reset();
    };
    isTouchOnSelectionHandle(e) {
      let t = window.getSelection();
      if (!t || t.isCollapsed || t.rangeCount === 0) return !1;
      let n = e.targetTouches[0] ?? e.changedTouches[0];
      if (!n) return !1;
      let r = t.getRangeAt(0).getClientRects();
      if (r.length === 0) return !1;
      let i = r[0],
        a = r[r.length - 1],
        o = Math.hypot(n.clientX - i.left, n.clientY - i.top) <= 40,
        s = Math.hypot(n.clientX - a.right, n.clientY - a.bottom) <= 40;
      return o || s;
    }
    onVirtualScroll = (e) => {
      if (
        typeof this.options.virtualScroll == `function` &&
        this.options.virtualScroll(e) === !1
      )
        return;
      let { deltaX: t, deltaY: n, event: r } = e;
      if (
        (this.emitter.emit(`virtual-scroll`, {
          deltaX: t,
          deltaY: n,
          event: r,
        }),
        r.ctrlKey || r.lenisStopPropagation)
      )
        return;
      let i = r.type.includes(`touch`),
        a = r.type.includes(`wheel`);
      if (
        i &&
        this.isIos &&
        (r.type === `touchstart` &&
          (this._isDraggingSelection = this.isTouchOnSelectionHandle(r)),
        this._isDraggingSelection)
      ) {
        r.type === `touchend` && (this._isDraggingSelection = !1);
        return;
      }
      this.isTouching = r.type === `touchstart` || r.type === `touchmove`;
      let o = t === 0 && n === 0;
      if (
        this.options.syncTouch &&
        i &&
        r.type === `touchstart` &&
        o &&
        !this.isStopped &&
        !this.isLocked
      ) {
        this.reset();
        return;
      }
      let s =
        (this.options.gestureOrientation === `vertical` && n === 0) ||
        (this.options.gestureOrientation === `horizontal` && t === 0);
      if (o || s) return;
      let c = r.composedPath();
      c = c.slice(0, c.indexOf(this.rootElement));
      let l = this.options.prevent,
        u = Math.abs(t) >= Math.abs(n) ? `horizontal` : `vertical`;
      if (
        c.find(
          (e) =>
            e instanceof HTMLElement &&
            ((typeof l == `function` && l?.(e)) ||
              e.hasAttribute?.(`data-lenis-prevent`) ||
              (u === `vertical` &&
                e.hasAttribute?.(`data-lenis-prevent-vertical`)) ||
              (u === `horizontal` &&
                e.hasAttribute?.(`data-lenis-prevent-horizontal`)) ||
              (i && e.hasAttribute?.(`data-lenis-prevent-touch`)) ||
              (a && e.hasAttribute?.(`data-lenis-prevent-wheel`)) ||
              (this.options.allowNestedScroll &&
                this.hasNestedScroll(e, { deltaX: t, deltaY: n }))),
        )
      )
        return;
      if (this.isStopped || this.isLocked) {
        r.cancelable && r.preventDefault();
        return;
      }
      if (!((this.options.syncTouch && i) || (this.options.smoothWheel && a))) {
        ((this.isScrolling = `native`),
          this.animate.stop(),
          (r.lenisStopPropagation = !0));
        return;
      }
      let d = n;
      (this.options.gestureOrientation === `both`
        ? (d = Math.abs(n) > Math.abs(t) ? n : t)
        : this.options.gestureOrientation === `horizontal` && (d = t),
        (!this.options.overscroll ||
          this.options.infinite ||
          (this.options.wrapper !== window &&
            this.limit > 0 &&
            ((this.animatedScroll > 0 && this.animatedScroll < this.limit) ||
              (this.animatedScroll === 0 && n > 0) ||
              (this.animatedScroll === this.limit && n < 0)))) &&
          (r.lenisStopPropagation = !0),
        r.cancelable && r.preventDefault());
      let f = i && this.options.syncTouch,
        p = i && r.type === `touchend`;
      (p &&
        (d =
          Math.sign(d) *
          Math.abs(this.velocity) ** this.options.touchInertiaExponent),
        this.scrollTo(this.targetScroll + d, {
          programmatic: !1,
          ...(f
            ? { lerp: p ? this.options.syncTouchLerp : 1 }
            : {
                lerp: this.options.lerp,
                duration: this.options.duration,
                easing: this.options.easing,
              }),
        }));
    };
    resize() {
      (this.dimensions.resize(),
        (this.animatedScroll = this.targetScroll = this.actualScroll),
        this.emit());
    }
    emit() {
      this.emitter.emit(`scroll`, this);
    }
    onNativeScroll = () => {
      if (
        (this._resetVelocityTimeout !== null &&
          (clearTimeout(this._resetVelocityTimeout),
          (this._resetVelocityTimeout = null)),
        this._preventNextNativeScrollEvent)
      )
        this._preventNextNativeScrollEvent = !1;
      else if (this.isScrolling === !1 || this.isScrolling === `native`) {
        let e = this.animatedScroll;
        ((this.animatedScroll = this.targetScroll = this.actualScroll),
          (this.lastVelocity = this.velocity),
          (this.velocity = this.animatedScroll - e),
          (this.direction = Math.sign(this.animatedScroll - e)),
          this.isStopped || (this.isScrolling = `native`),
          this.emit(),
          this.velocity !== 0 &&
            (this._resetVelocityTimeout = setTimeout(() => {
              ((this.lastVelocity = this.velocity),
                (this.velocity = 0),
                (this.isScrolling = !1),
                this.emit());
            }, 400)));
      }
    };
    reset() {
      ((this.isLocked = !1),
        (this.isScrolling = !1),
        (this.animatedScroll = this.targetScroll = this.actualScroll),
        (this.lastVelocity = this.velocity = 0),
        this.animate.stop());
    }
    start() {
      this.isStopped &&
        (this.options.autoToggle
          ? this.rootElement.style.removeProperty(`overflow`)
          : this.internalStart());
    }
    internalStart() {
      this.isStopped && (this.reset(), (this.isStopped = !1), this.emit());
    }
    stop() {
      this.isStopped ||
        (this.options.autoToggle
          ? this.rootElement.style.setProperty(`overflow`, `clip`)
          : this.internalStop());
    }
    internalStop() {
      this.isStopped || (this.reset(), (this.isStopped = !0), this.emit());
    }
    raf = (e) => {
      let t = e - (this.time || e);
      ((this.time = e),
        this.animate.advance(t * 0.001),
        this.options.autoRaf &&
          (this._rafId = requestAnimationFrame(this.raf)));
    };
    scrollTo(
      e,
      {
        offset: t = 0,
        immediate: n = !1,
        lock: r = !1,
        programmatic: i = !0,
        lerp: a = i ? this.options.lerp : void 0,
        duration: o = i ? this.options.duration : void 0,
        easing: s = i ? this.options.easing : void 0,
        onStart: c,
        onComplete: l,
        force: u = !1,
        userData: f,
      } = {},
    ) {
      if (
        (this.prefersReducedMotion &&
          (i ? (n = !0) : ((a = 1), (o = void 0), (s = void 0))),
        (this.isStopped || this.isLocked) && !u)
      )
        return;
      let p = e,
        m = t;
      if (typeof p == `string` && [`top`, `left`, `start`, `#`].includes(p))
        p = 0;
      else if (typeof p == `string` && [`bottom`, `right`, `end`].includes(p))
        p = this.limit;
      else {
        let e = null;
        if (
          (typeof p == `string`
            ? ((e = p.startsWith(`#`)
                ? document.getElementById(p.slice(1))
                : document.querySelector(p)),
              e ||
                (p === `#top`
                  ? (p = 0)
                  : console.warn(`Lenis: Target not found`, p)))
            : p instanceof Element && (e = p),
          e)
        ) {
          if (this.options.wrapper !== window) {
            let e = this.rootElement.getBoundingClientRect();
            m -= this.isHorizontal ? e.left : e.top;
          }
          let t = e.getBoundingClientRect(),
            n = getComputedStyle(e),
            r = this.isHorizontal
              ? Number.parseFloat(n.scrollMarginLeft)
              : Number.parseFloat(n.scrollMarginTop),
            i = getComputedStyle(this.rootElement),
            a = this.isHorizontal
              ? Number.parseFloat(i.scrollPaddingLeft)
              : Number.parseFloat(i.scrollPaddingTop);
          p =
            (this.isHorizontal ? t.left : t.top) +
            this.animatedScroll -
            (Number.isNaN(r) ? 0 : r) -
            (Number.isNaN(a) ? 0 : a);
        }
      }
      if (typeof p == `number`) {
        if (((p += m), this.options.infinite)) {
          if (i) {
            this.targetScroll = this.animatedScroll = this.scroll;
            let e = p - this.animatedScroll;
            e > this.limit / 2
              ? (p -= this.limit)
              : e < -this.limit / 2 && (p += this.limit);
          }
        } else p = d(0, p, this.limit);
        p === this.targetScroll
          ? (c?.(this), l?.(this))
          : ((this.userData = f ?? {}),
            n
              ? ((this.animatedScroll = this.targetScroll = p),
                this.setScroll(this.scroll),
                this.reset(),
                this.preventNextNativeScrollEvent(),
                this.emit(),
                l?.(this),
                (this.userData = {}),
                requestAnimationFrame(() => {
                  this.dispatchScrollendEvent();
                }))
              : (i || (this.targetScroll = p),
                typeof o == `number` && typeof s != `function`
                  ? (s = C)
                  : typeof s == `function` && typeof o != `number` && (o = 1),
                this.animate.fromTo(this.animatedScroll, p, {
                  duration: o,
                  easing: s,
                  lerp: a,
                  onStart: () => {
                    (r && (this.isLocked = !0),
                      (this.isScrolling = `smooth`),
                      c?.(this));
                  },
                  onUpdate: (e, t) => {
                    ((this.isScrolling = `smooth`),
                      (this.lastVelocity = this.velocity),
                      (this.velocity = e - this.animatedScroll),
                      (this.direction = Math.sign(this.velocity)),
                      (this.animatedScroll = e),
                      this.setScroll(this.scroll),
                      i && (this.targetScroll = e),
                      t || this.emit(),
                      t &&
                        (this.reset(),
                        this.emit(),
                        l?.(this),
                        (this.userData = {}),
                        requestAnimationFrame(() => {
                          this.dispatchScrollendEvent();
                        }),
                        this.preventNextNativeScrollEvent()));
                  },
                })));
      }
    }
    preventNextNativeScrollEvent() {
      ((this._preventNextNativeScrollEvent = !0),
        requestAnimationFrame(() => {
          this._preventNextNativeScrollEvent = !1;
        }));
    }
    hasNestedScroll(e, { deltaX: t, deltaY: n }) {
      let r = Date.now();
      e._lenis ||= {};
      let i = e._lenis,
        a,
        o,
        s,
        c,
        l,
        u,
        d,
        f,
        p,
        m;
      if (r - (i.time ?? 0) > 2e3) {
        i.time = Date.now();
        let t = window.getComputedStyle(e);
        if (
          ((i.computedStyle = t),
          (a = [`auto`, `overlay`, `scroll`].includes(t.overflowX)),
          (o = [`auto`, `overlay`, `scroll`].includes(t.overflowY)),
          (l = [`auto`].includes(t.overscrollBehaviorX)),
          (u = [`auto`].includes(t.overscrollBehaviorY)),
          (i.hasOverflowX = a),
          (i.hasOverflowY = o),
          !(a || o))
        )
          return !1;
        ((d = e.scrollWidth),
          (f = e.scrollHeight),
          (p = e.clientWidth),
          (m = e.clientHeight),
          (s = d > p),
          (c = f > m),
          (i.isScrollableX = s),
          (i.isScrollableY = c),
          (i.scrollWidth = d),
          (i.scrollHeight = f),
          (i.clientWidth = p),
          (i.clientHeight = m),
          (i.hasOverscrollBehaviorX = l),
          (i.hasOverscrollBehaviorY = u));
      } else
        ((s = i.isScrollableX),
          (c = i.isScrollableY),
          (a = i.hasOverflowX),
          (o = i.hasOverflowY),
          (d = i.scrollWidth),
          (f = i.scrollHeight),
          (p = i.clientWidth),
          (m = i.clientHeight),
          (l = i.hasOverscrollBehaviorX),
          (u = i.hasOverscrollBehaviorY));
      if (!((a && s) || (o && c))) return !1;
      let h = Math.abs(t) >= Math.abs(n) ? `horizontal` : `vertical`,
        g,
        _,
        v,
        y,
        b,
        x;
      if (h === `horizontal`)
        ((g = Math.round(e.scrollLeft)),
          (_ = d - p),
          (v = t),
          (y = a),
          (b = s),
          (x = l));
      else if (h === `vertical`)
        ((g = Math.round(e.scrollTop)),
          (_ = f - m),
          (v = n),
          (y = o),
          (b = c),
          (x = u));
      else return !1;
      return (!x && (g >= _ || g <= 0)) || ((v > 0 ? g < _ : g > 0) && y && b);
    }
    get rootElement() {
      return this.options.wrapper === window
        ? document.documentElement
        : this.options.wrapper;
    }
    get limit() {
      return this.options.naiveDimensions
        ? this.isHorizontal
          ? this.rootElement.scrollWidth - this.rootElement.clientWidth
          : this.rootElement.scrollHeight - this.rootElement.clientHeight
        : this.dimensions.limit[this.isHorizontal ? `x` : `y`];
    }
    get isHorizontal() {
      return this.options.orientation === `horizontal`;
    }
    get actualScroll() {
      let e = this.options.wrapper;
      return this.isHorizontal
        ? (e.scrollX ?? e.scrollLeft)
        : (e.scrollY ?? e.scrollTop);
    }
    get scroll() {
      return this.options.infinite
        ? m(this.animatedScroll, this.limit)
        : this.animatedScroll;
    }
    get progress() {
      return this.limit === 0 ? 1 : this.scroll / this.limit;
    }
    get isScrolling() {
      return this._isScrolling;
    }
    set isScrolling(e) {
      this._isScrolling !== e &&
        ((this._isScrolling = e), this.updateClassName());
    }
    get isStopped() {
      return this._isStopped;
    }
    set isStopped(e) {
      this._isStopped !== e && ((this._isStopped = e), this.updateClassName());
    }
    get isLocked() {
      return this._isLocked;
    }
    set isLocked(e) {
      this._isLocked !== e && ((this._isLocked = e), this.updateClassName());
    }
    get isSmooth() {
      return this.isScrolling === `smooth`;
    }
    get prefersReducedMotion() {
      return (
        this.options.respectReducedMotion &&
        this.reducedMotionMediaQuery.matches
      );
    }
    get className() {
      let e = `lenis`;
      return (
        this.options.autoToggle && (e += ` lenis-autoToggle`),
        this.isStopped && (e += ` lenis-stopped`),
        this.isLocked && (e += ` lenis-locked`),
        this.isScrolling && (e += ` lenis-scrolling`),
        this.isScrolling === `smooth` && (e += ` lenis-smooth`),
        e
      );
    }
    updateClassName() {
      (this.cleanUpClassName(),
        this.className.split(` `).forEach((e) => {
          this.rootElement.classList.add(e);
        }));
    }
    cleanUpClassName() {
      for (let e of Array.from(this.rootElement.classList))
        (e === `lenis` || e.startsWith(`lenis-`)) &&
          this.rootElement.classList.remove(e);
    }
  };
function T(e) {
  if (e === void 0)
    throw ReferenceError(
      `this hasn't been initialised - super() hasn't been called`,
    );
  return e;
}
function E(e, t) {
  ((e.prototype = Object.create(t.prototype)),
    (e.prototype.constructor = e),
    (e.__proto__ = t));
}
var D = {
    autoSleep: 120,
    force3D: `auto`,
    nullTargetWarn: 1,
    units: { lineHeight: `` },
  },
  O = { duration: 0.5, overwrite: !1, delay: 0 },
  k,
  A,
  j,
  M = 1e8,
  N = 1 / M,
  P = Math.PI * 2,
  F = P / 4,
  ee = 0,
  te = Math.sqrt,
  ne = Math.cos,
  re = Math.sin,
  I = function (e) {
    return typeof e == `string`;
  },
  L = function (e) {
    return typeof e == `function`;
  },
  ie = function (e) {
    return typeof e == `number`;
  },
  ae = function (e) {
    return e === void 0;
  },
  oe = function (e) {
    return typeof e == `object`;
  },
  se = function (e) {
    return e !== !1;
  },
  ce = function () {
    return typeof window < `u`;
  },
  R = function (e) {
    return L(e) || I(e);
  },
  le =
    (typeof ArrayBuffer == `function` && ArrayBuffer.isView) || function () {},
  ue = Array.isArray,
  z = /random\([^)]+\)/g,
  B = /,\s*/g,
  V = /(?:-?\.?\d|\.)+/gi,
  de = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,
  fe = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
  pe = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,
  me = /[+-]=-?[.\d]+/,
  he = /[^,'"\[\]\s]+/gi,
  ge = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,
  H,
  U,
  _e,
  ve,
  ye = {},
  be = {},
  xe,
  W = function (e) {
    return (be = $e(e, ye)) && vr;
  },
  Se = function (e, t) {
    return console.warn(
      `Invalid property`,
      e,
      `set to`,
      t,
      `Missing plugin? gsap.registerPlugin()`,
    );
  },
  Ce = function (e, t) {
    return !t && console.warn(e);
  },
  we = function (e, t) {
    return (e && (ye[e] = t) && be && (be[e] = t)) || ye;
  },
  Te = function () {
    return 0;
  },
  Ee = { suppressEvents: !0, isStart: !0, kill: !1 },
  De = { suppressEvents: !0, kill: !1 },
  Oe = { suppressEvents: !0 },
  ke = {},
  Ae = [],
  je = {},
  Me,
  Ne = {},
  Pe = {},
  Fe = 30,
  Ie = [],
  Le = ``,
  Re = function (e) {
    var t = e[0],
      n,
      r;
    if ((oe(t) || L(t) || (e = [e]), !(n = (t._gsap || {}).harness))) {
      for (r = Ie.length; r-- && !Ie[r].targetTest(t););
      n = Ie[r];
    }
    for (r = e.length; r--;)
      (e[r] && (e[r]._gsap || (e[r]._gsap = new On(e[r], n)))) ||
        e.splice(r, 1);
    return e;
  },
  ze = function (e) {
    return e._gsap || Re(It(e))[0]._gsap;
  },
  Be = function (e, t, n) {
    return (n = e[t]) && L(n)
      ? e[t]()
      : (ae(n) && e.getAttribute && e.getAttribute(t)) || n;
  },
  Ve = function (e, t) {
    return (e = e.split(`,`)).forEach(t) || e;
  },
  He = function (e) {
    return Math.round(e * 1e5) / 1e5 || 0;
  },
  Ue = function (e) {
    return Math.round(e * 1e7) / 1e7 || 0;
  },
  We = function (e, t) {
    var n = t.charAt(0),
      r = parseFloat(t.substr(2));
    return (
      (e = parseFloat(e)),
      n === `+` ? e + r : n === `-` ? e - r : n === `*` ? e * r : e / r
    );
  },
  Ge = function (e, t) {
    for (var n = t.length, r = 0; e.indexOf(t[r]) < 0 && ++r < n;);
    return r < n;
  },
  Ke = function () {
    var e = Ae.length,
      t = Ae.slice(0),
      n,
      r;
    for (je = {}, Ae.length = 0, n = 0; n < e; n++)
      ((r = t[n]),
        r && r._lazy && (r.render(r._lazy[0], r._lazy[1], !0)._lazy = 0));
  },
  qe = function (e) {
    return !!(e._initted || e._startAt || e.add);
  },
  Je = function (e, t, n, r) {
    (Ae.length && !A && Ke(),
      e.render(t, n, r || !!(A && t < 0 && qe(e))),
      Ae.length && !A && Ke());
  },
  Ye = function (e) {
    var t = parseFloat(e);
    return (t || t === 0) && (e + ``).match(he).length < 2
      ? t
      : I(e)
        ? e.trim()
        : e;
  },
  Xe = function (e) {
    return e;
  },
  Ze = function (e, t) {
    for (var n in t) n in e || (e[n] = t[n]);
    return e;
  },
  Qe = function (e) {
    return function (t, n) {
      for (var r in n)
        r in t || (r === `duration` && e) || r === `ease` || (t[r] = n[r]);
    };
  },
  $e = function (e, t) {
    for (var n in t) e[n] = t[n];
    return e;
  },
  et = function e(t, n) {
    for (var r in n)
      r !== `__proto__` &&
        r !== `constructor` &&
        r !== `prototype` &&
        (t[r] = oe(n[r]) ? e(t[r] || (t[r] = {}), n[r]) : n[r]);
    return t;
  },
  tt = function (e, t) {
    var n = {},
      r;
    for (r in e) r in t || (n[r] = e[r]);
    return n;
  },
  nt = function (e) {
    var t = e.parent || H,
      n = e.keyframes ? Qe(ue(e.keyframes)) : Ze;
    if (se(e.inherit))
      for (; t;) (n(e, t.vars.defaults), (t = t.parent || t._dp));
    return e;
  },
  rt = function (e, t) {
    for (var n = e.length, r = n === t.length; r && n-- && e[n] === t[n];);
    return n < 0;
  },
  it = function (e, t, n, r, i) {
    (n === void 0 && (n = `_first`), r === void 0 && (r = `_last`));
    var a = e[r],
      o;
    if (i) for (o = t[i]; a && a[i] > o;) a = a._prev;
    return (
      a ? ((t._next = a._next), (a._next = t)) : ((t._next = e[n]), (e[n] = t)),
      t._next ? (t._next._prev = t) : (e[r] = t),
      (t._prev = a),
      (t.parent = t._dp = e),
      t
    );
  },
  at = function (e, t, n, r) {
    (n === void 0 && (n = `_first`), r === void 0 && (r = `_last`));
    var i = t._prev,
      a = t._next;
    (i ? (i._next = a) : e[n] === t && (e[n] = a),
      a ? (a._prev = i) : e[r] === t && (e[r] = i),
      (t._next = t._prev = t.parent = null));
  },
  ot = function (e, t) {
    (e.parent &&
      (!t || e.parent.autoRemoveChildren) &&
      e.parent.remove &&
      e.parent.remove(e),
      (e._act = 0));
  },
  st = function (e, t) {
    if (e && (!t || t._end > e._dur || t._start < 0))
      for (var n = e; n;) ((n._dirty = 1), (n = n.parent));
    return e;
  },
  ct = function (e) {
    for (var t = e.parent; t && t.parent;)
      ((t._dirty = 1), t.totalDuration(), (t = t.parent));
    return e;
  },
  lt = function (e, t, n, r) {
    return (
      e._startAt &&
      (A
        ? e._startAt.revert(De)
        : (e.vars.immediateRender && !e.vars.autoRevert) ||
          e._startAt.render(t, !0, r))
    );
  },
  ut = function e(t) {
    return !t || (t._ts && e(t.parent));
  },
  dt = function (e) {
    return e._repeat ? ft(e._tTime, (e = e.duration() + e._rDelay)) * e : 0;
  },
  ft = function (e, t) {
    var n = Math.floor((e = Ue(e / t)));
    return e && n === e ? n - 1 : n;
  },
  pt = function (e, t) {
    return (
      (e - t._start) * t._ts +
      (t._ts >= 0 ? 0 : t._dirty ? t.totalDuration() : t._tDur)
    );
  },
  mt = function (e) {
    return (e._end = Ue(
      e._start + (e._tDur / Math.abs(e._ts || e._rts || N) || 0),
    ));
  },
  ht = function (e, t) {
    var n = e._dp;
    return (
      n &&
        n.smoothChildTiming &&
        e._ts &&
        ((e._start = Ue(
          n._time -
            (e._ts > 0
              ? t / e._ts
              : ((e._dirty ? e.totalDuration() : e._tDur) - t) / -e._ts),
        )),
        mt(e),
        n._dirty || st(n, e)),
      e
    );
  },
  gt = function (e, t) {
    var n;
    if (
      ((t._time ||
        (!t._dur && t._initted) ||
        (t._start < e._time && (t._dur || !t.add))) &&
        ((n = pt(e.rawTime(), t)),
        (!t._dur || At(0, t.totalDuration(), n) - t._tTime > N) &&
          t.render(n, !0)),
      st(e, t)._dp && e._initted && e._time >= e._dur && e._ts)
    ) {
      if (e._dur < e.duration())
        for (n = e; n._dp;)
          (n.rawTime() >= 0 && n.totalTime(n._tTime), (n = n._dp));
      e._zTime = -N;
    }
  },
  _t = function (e, t, n, r) {
    return (
      t.parent && ot(t),
      (t._start = Ue(
        (ie(n)
          ? n
          : !n && xt(t) && (!e._last || e._last._start >= e._time)
            ? e._last
              ? e._last._start
              : e._time
            : n || e !== H
              ? Dt(e, n, t)
              : e._time) + t._delay,
      )),
      (t._end = Ue(
        t._start + (t.totalDuration() / Math.abs(t.timeScale()) || 0),
      )),
      it(e, t, `_first`, `_last`, e._sort ? `_start` : 0),
      xt(t) || (e._recent = t),
      r || gt(e, t),
      e._ts < 0 && ht(e, e._tTime),
      e
    );
  },
  vt = function (e, t) {
    return (
      (ye.ScrollTrigger || Se(`scrollTrigger`, t)) &&
      ye.ScrollTrigger.create(t, e)
    );
  },
  yt = function (e, t, n, r, i) {
    if ((Ln(e, t, i), !e._initted)) return 1;
    if (
      !n &&
      e._pt &&
      !A &&
      ((e._dur && e.vars.lazy !== !1) || (!e._dur && e.vars.lazy)) &&
      Me !== hn.frame
    )
      return (Ae.push(e), (e._lazy = [i, r]), 1);
  },
  bt = function e(t) {
    var n = t.parent;
    return n && n._ts && n._initted && !n._lock && (n.rawTime() < 0 || e(n));
  },
  xt = function (e) {
    var t = e.data;
    return t === `isFromStart` || t === `isStart`;
  },
  St = function (e, t, n, r) {
    var i = e.ratio,
      a =
        t < 0 ||
        (!t &&
          ((!e._start && bt(e) && (e._initted || !xt(e))) ||
            ((e._ts < 0 || e._dp._ts < 0) && !xt(e))))
          ? 0
          : 1,
      o = e._rDelay,
      s = 0,
      c,
      l,
      u;
    if (
      (o &&
        e._repeat &&
        ((s = At(0, e._tDur, t)),
        (l = ft(s, o)),
        e._yoyo && l & 1 && (a = 1 - a),
        l !== ft(e._tTime, o) &&
          ((i = 1 - a), e.vars.repeatRefresh && e._initted && e.invalidate())),
      a !== i || A || r || e._zTime === N || (!t && e._zTime))
    ) {
      if (!e._initted && yt(e, t, r, n, s)) return;
      for (
        u = e._zTime,
          e._zTime = t || (n ? N : 0),
          n ||= t && !u,
          e.ratio = a,
          e._from && (a = 1 - a),
          e._time = 0,
          e._tTime = s,
          c = e._pt;
        c;
      )
        (c.r(a, c.d), (c = c._next));
      (t < 0 && lt(e, t, n, !0),
        e._onUpdate && !n && $t(e, `onUpdate`),
        s && e._repeat && !n && e.parent && $t(e, `onRepeat`),
        (t >= e._tDur || t < 0) &&
          e.ratio === a &&
          (a && ot(e, 1),
          !n &&
            !A &&
            ($t(e, a ? `onComplete` : `onReverseComplete`, !0),
            e._prom && e._prom())));
    } else e._zTime ||= t;
  },
  Ct = function (e, t, n) {
    var r;
    if (n > t)
      for (r = e._first; r && r._start <= n;) {
        if (r.data === `isPause` && r._start > t) return r;
        r = r._next;
      }
    else
      for (r = e._last; r && r._start >= n;) {
        if (r.data === `isPause` && r._start < t) return r;
        r = r._prev;
      }
  },
  wt = function (e, t, n, r) {
    var i = e._repeat,
      a = Ue(t) || 0,
      o = e._tTime / e._tDur;
    return (
      o && !r && (e._time *= a / e._dur),
      (e._dur = a),
      (e._tDur = i ? (i < 0 ? 1e10 : Ue(a * (i + 1) + e._rDelay * i)) : a),
      o > 0 && !r && ht(e, (e._tTime = e._tDur * o)),
      e.parent && mt(e),
      n || st(e.parent, e),
      e
    );
  },
  Tt = function (e) {
    return e instanceof An ? st(e) : wt(e, e._dur);
  },
  Et = { _start: 0, endTime: Te, totalDuration: Te },
  Dt = function e(t, n, r) {
    var i = t.labels,
      a = t._recent || Et,
      o = t.duration() >= M ? a.endTime(!1) : t._dur,
      s,
      c,
      l;
    return I(n) && (isNaN(n) || n in i)
      ? ((c = n.charAt(0)),
        (l = n.substr(-1) === `%`),
        (s = n.indexOf(`=`)),
        c === `<` || c === `>`
          ? (s >= 0 && (n = n.replace(/=/, ``)),
            (c === `<` ? a._start : a.endTime(a._repeat >= 0)) +
              (parseFloat(n.substr(1)) || 0) *
                (l ? (s < 0 ? a : r).totalDuration() / 100 : 1))
          : s < 0
            ? (n in i || (i[n] = o), i[n])
            : ((c = parseFloat(n.charAt(s - 1) + n.substr(s + 1))),
              l && r && (c = (c / 100) * (ue(r) ? r[0] : r).totalDuration()),
              s > 1 ? e(t, n.substr(0, s - 1), r) + c : o + c))
      : n == null
        ? o
        : +n;
  },
  Ot = function (e, t, n) {
    var r = ie(t[1]),
      i = (r ? 2 : 1) + (e < 2 ? 0 : 1),
      a = t[i],
      o,
      s;
    if ((r && (a.duration = t[1]), (a.parent = n), e)) {
      for (o = a, s = n; s && !(`immediateRender` in o);)
        ((o = s.vars.defaults || {}), (s = se(s.vars.inherit) && s.parent));
      ((a.immediateRender = se(o.immediateRender)),
        e < 2 ? (a.runBackwards = 1) : (a.startAt = t[i - 1]));
    }
    return new Wn(t[0], a, t[i + 1]);
  },
  kt = function (e, t) {
    return e || e === 0 ? t(e) : t;
  },
  At = function (e, t, n) {
    return n < e ? e : n > t ? t : n;
  },
  jt = function (e, t) {
    return !I(e) || !(t = ge.exec(e)) ? `` : t[1];
  },
  Mt = function (e, t, n) {
    return kt(n, function (n) {
      return At(e, t, n);
    });
  },
  Nt = [].slice,
  Pt = function (e, t) {
    return (
      e &&
      oe(e) &&
      `length` in e &&
      ((!t && !e.length) || (e.length - 1 in e && oe(e[0]))) &&
      !e.nodeType &&
      e !== U
    );
  },
  Ft = function (e, t, n) {
    return (
      n === void 0 && (n = []),
      e.forEach(function (e) {
        var r;
        return (I(e) && !t) || Pt(e, 1)
          ? (r = n).push.apply(r, It(e))
          : n.push(e);
      }) || n
    );
  },
  It = function (e, t, n) {
    return j && !t && j.selector
      ? j.selector(e)
      : I(e) && !n && (_e || !gn())
        ? Nt.call((t || ve).querySelectorAll(e), 0)
        : ue(e)
          ? Ft(e, n)
          : Pt(e)
            ? Nt.call(e, 0)
            : e
              ? [e]
              : [];
  },
  Lt = function (e) {
    return (
      (e = It(e)[0] || Ce(`Invalid scope`) || {}),
      function (t) {
        var n = e.current || e.nativeElement || e;
        return It(
          t,
          n.querySelectorAll
            ? n
            : n === e
              ? Ce(`Invalid scope`) || ve.createElement(`div`)
              : e,
        );
      }
    );
  },
  Rt = function (e) {
    return e.sort(function () {
      return 0.5 - Math.random();
    });
  },
  zt = function (e) {
    if (L(e)) return e;
    var t = oe(e) ? e : { each: e },
      n = Cn(t.ease),
      r = t.from || 0,
      i = parseFloat(t.base) || 0,
      a = {},
      o = r > 0 && r < 1,
      s = isNaN(r) || o,
      c = t.axis,
      l = r,
      u = r;
    return (
      I(r)
        ? (l = u = { center: 0.5, edges: 0.5, end: 1 }[r] || 0)
        : !o && s && ((l = r[0]), (u = r[1])),
      function (e, o, d) {
        var f = (d || t).length,
          p = a[f],
          m,
          h,
          g,
          _,
          v,
          y,
          b,
          x,
          S;
        if (!p) {
          if (((S = t.grid === `auto` ? 0 : (t.grid || [1, M])[1]), !S)) {
            for (
              b = -M;
              b < (b = d[S++].getBoundingClientRect().left) && S < f;
            );
            S < f && S--;
          }
          for (
            p = a[f] = [],
              m = s ? Math.min(S, f) * l - 0.5 : r % S,
              h = S === M ? 0 : s ? (f * u) / S - 0.5 : (r / S) | 0,
              b = 0,
              x = M,
              y = 0;
            y < f;
            y++
          )
            ((g = (y % S) - m),
              (_ = h - ((y / S) | 0)),
              (p[y] = v = c ? Math.abs(c === `y` ? _ : g) : te(g * g + _ * _)),
              v > b && (b = v),
              v < x && (x = v));
          (r === `random` && Rt(p),
            (p.max = b - x),
            (p.min = x),
            (p.v = f =
              (parseFloat(t.amount) ||
                parseFloat(t.each) *
                  (S > f
                    ? f - 1
                    : c
                      ? c === `y`
                        ? f / S
                        : S
                      : Math.max(S, f / S)) ||
                0) * (r === `edges` ? -1 : 1)),
            (p.b = f < 0 ? i - f : i),
            (p.u = jt(t.amount || t.each) || 0),
            (n = n && f < 0 ? Sn(n) : n));
        }
        return (
          (f = (p[e] - p.min) / p.max || 0),
          Ue(p.b + (n ? n(f) : f) * p.v) + p.u
        );
      }
    );
  },
  Bt = function (e) {
    var t = 10 ** ((e + ``).split(`.`)[1] || ``).length;
    return function (n) {
      var r = Ue(Math.round(parseFloat(n) / e) * e * t);
      return (r - (r % 1)) / t + (ie(n) ? 0 : jt(n));
    };
  },
  Vt = function (e, t) {
    var n = ue(e),
      r,
      i;
    return (
      !n &&
        oe(e) &&
        ((r = n = e.radius || M),
        e.values
          ? ((e = It(e.values)), (i = !ie(e[0])) && (r *= r))
          : (e = Bt(e.increment))),
      kt(
        t,
        n
          ? L(e)
            ? function (t) {
                return ((i = e(t)), Math.abs(i - t) <= r ? i : t);
              }
            : function (t) {
                for (
                  var n = parseFloat(i ? t.x : t),
                    a = parseFloat(i ? t.y : 0),
                    o = M,
                    s = 0,
                    c = e.length,
                    l,
                    u;
                  c--;
                )
                  (i
                    ? ((l = e[c].x - n), (u = e[c].y - a), (l = l * l + u * u))
                    : (l = Math.abs(e[c] - n)),
                    l < o && ((o = l), (s = c)));
                return (
                  (s = !r || o <= r ? e[s] : t),
                  i || s === t || ie(t) ? s : s + jt(t)
                );
              }
          : Bt(e),
      )
    );
  },
  Ht = function (e, t, n, r) {
    return kt(ue(e) ? !t : n === !0 ? !!(n = 0) : !r, function () {
      return ue(e)
        ? e[~~(Math.random() * e.length)]
        : (n ||= 1e-5) &&
            (r = n < 1 ? 10 ** ((n + ``).length - 2) : 1) &&
            Math.floor(
              Math.round((e - n / 2 + Math.random() * (t - e + n * 0.99)) / n) *
                n *
                r,
            ) / r;
    });
  },
  Ut = function () {
    var e = [...arguments];
    return function (t) {
      return e.reduce(function (e, t) {
        return t(e);
      }, t);
    };
  },
  Wt = function (e, t) {
    return function (n) {
      return e(parseFloat(n)) + (t || jt(n));
    };
  },
  Gt = function (e, t, n) {
    return Xt(e, t, 0, 1, n);
  },
  Kt = function (e, t, n) {
    return kt(n, function (n) {
      return e[~~t(n)];
    });
  },
  qt = function e(t, n, r) {
    var i = n - t;
    return ue(t)
      ? Kt(t, e(0, t.length), n)
      : kt(r, function (e) {
          return ((i + ((e - t) % i)) % i) + t;
        });
  },
  Jt = function e(t, n, r) {
    var i = n - t,
      a = i * 2;
    return ue(t)
      ? Kt(t, e(0, t.length - 1), n)
      : kt(r, function (e) {
          return ((e = (a + ((e - t) % a)) % a || 0), t + (e > i ? a - e : e));
        });
  },
  Yt = function (e) {
    return e.replace(z, function (e) {
      var t = e.indexOf(`[`) + 1,
        n = e.substring(t || 7, t ? e.indexOf(`]`) : e.length - 1).split(B);
      return Ht(t ? n : +n[0], t ? 0 : +n[1], +n[2] || 1e-5);
    });
  },
  Xt = function (e, t, n, r, i) {
    var a = t - e,
      o = r - n;
    return kt(i, function (t) {
      return n + (((t - e) / a) * o || 0);
    });
  },
  Zt = function e(t, n, r, i) {
    var a = isNaN(t + n)
      ? 0
      : function (e) {
          return (1 - e) * t + e * n;
        };
    if (!a) {
      var o = I(t),
        s = {},
        c,
        l,
        u,
        d,
        f;
      if ((r === !0 && (i = 1) && (r = null), o))
        ((t = { p: t }), (n = { p: n }));
      else if (ue(t) && !ue(n)) {
        for (u = [], d = t.length, f = d - 2, l = 1; l < d; l++)
          u.push(e(t[l - 1], t[l]));
        (d--,
          (a = function (e) {
            e *= d;
            var t = Math.min(f, ~~e);
            return u[t](e - t);
          }),
          (r = n));
      } else i || (t = $e(ue(t) ? [] : {}, t));
      if (!u) {
        for (c in n) Mn.call(s, t, c, `get`, n[c]);
        a = function (e) {
          return $n(e, s) || (o ? t.p : t);
        };
      }
    }
    return kt(r, a);
  },
  Qt = function (e, t, n) {
    var r = e.labels,
      i = M,
      a,
      o,
      s;
    for (a in r)
      ((o = r[a] - t),
        o < 0 == !!n && o && i > (o = Math.abs(o)) && ((s = a), (i = o)));
    return s;
  },
  $t = function (e, t, n) {
    var r = e.vars,
      i = r[t],
      a = j,
      o = e._ctx,
      s,
      c,
      l;
    if (i)
      return (
        (s = r[t + `Params`]),
        (c = r.callbackScope || e),
        n && Ae.length && Ke(),
        o && (j = o),
        (l = s ? i.apply(c, s) : i.call(c)),
        (j = a),
        l
      );
  },
  en = function (e) {
    return (
      ot(e),
      e.scrollTrigger && e.scrollTrigger.kill(!!A),
      e.progress() < 1 && $t(e, `onInterrupt`),
      e
    );
  },
  tn,
  nn = [],
  rn = function (e) {
    if (e) {
      if (((e = (!e.name && e.default) || e), ce() || e.headless)) {
        var t = e.name,
          n = L(e),
          r =
            t && !n && e.init
              ? function () {
                  this._props = [];
                }
              : e,
          i = {
            init: Te,
            render: $n,
            add: Mn,
            kill: tr,
            modifier: er,
            rawVars: 0,
          },
          a = {
            targetTest: 0,
            get: 0,
            getSetter: Yn,
            aliases: {},
            register: 0,
          };
        if ((gn(), e !== r)) {
          if (Ne[t]) return;
          (Ze(r, Ze(tt(e, i), a)),
            $e(r.prototype, $e(i, tt(e, a))),
            (Ne[(r.prop = t)] = r),
            e.targetTest && (Ie.push(r), (ke[t] = 1)),
            (t =
              (t === `css` ? `CSS` : t.charAt(0).toUpperCase() + t.substr(1)) +
              `Plugin`));
        }
        (we(t, r), e.register && e.register(vr, r, ir));
      } else nn.push(e);
    }
  },
  an = 255,
  on = {
    aqua: [0, an, an],
    lime: [0, an, 0],
    silver: [192, 192, 192],
    black: [0, 0, 0],
    maroon: [128, 0, 0],
    teal: [0, 128, 128],
    blue: [0, 0, an],
    navy: [0, 0, 128],
    white: [an, an, an],
    olive: [128, 128, 0],
    yellow: [an, an, 0],
    orange: [an, 165, 0],
    gray: [128, 128, 128],
    purple: [128, 0, 128],
    green: [0, 128, 0],
    red: [an, 0, 0],
    pink: [an, 192, 203],
    cyan: [0, an, an],
    transparent: [an, an, an, 0],
  },
  sn = function (e, t, n) {
    return (
      (e += e < 0 ? 1 : e > 1 ? -1 : 0),
      ((e * 6 < 1
        ? t + (n - t) * e * 6
        : e < 0.5
          ? n
          : e * 3 < 2
            ? t + (n - t) * (2 / 3 - e) * 6
            : t) *
        an +
        0.5) |
        0
    );
  },
  cn = function (e, t, n) {
    var r = e ? (ie(e) ? [e >> 16, (e >> 8) & an, e & an] : 0) : on.black,
      i,
      a,
      o,
      s,
      c,
      l,
      u,
      d,
      f,
      p;
    if (!r) {
      if ((e.substr(-1) === `,` && (e = e.substr(0, e.length - 1)), on[e]))
        r = on[e];
      else if (e.charAt(0) === `#`) {
        if (
          (e.length < 6 &&
            ((i = e.charAt(1)),
            (a = e.charAt(2)),
            (o = e.charAt(3)),
            (e =
              `#` +
              i +
              i +
              a +
              a +
              o +
              o +
              (e.length === 5 ? e.charAt(4) + e.charAt(4) : ``))),
          e.length === 9)
        )
          return (
            (r = parseInt(e.substr(1, 6), 16)),
            [r >> 16, (r >> 8) & an, r & an, parseInt(e.substr(7), 16) / 255]
          );
        ((e = parseInt(e.substr(1), 16)),
          (r = [e >> 16, (e >> 8) & an, e & an]));
      } else if (e.substr(0, 3) === `hsl`) {
        if (((r = p = e.match(V)), !t))
          ((s = (r[0] % 360) / 360),
            (c = r[1] / 100),
            (l = r[2] / 100),
            (a = l <= 0.5 ? l * (c + 1) : l + c - l * c),
            (i = l * 2 - a),
            r.length > 3 && (r[3] *= 1),
            (r[0] = sn(s + 1 / 3, i, a)),
            (r[1] = sn(s, i, a)),
            (r[2] = sn(s - 1 / 3, i, a)));
        else if (~e.indexOf(`=`))
          return ((r = e.match(de)), n && r.length < 4 && (r[3] = 1), r);
      } else r = e.match(V) || on.transparent;
      r = r.map(Number);
    }
    return (
      t &&
        !p &&
        ((i = r[0] / an),
        (a = r[1] / an),
        (o = r[2] / an),
        (u = Math.max(i, a, o)),
        (d = Math.min(i, a, o)),
        (l = (u + d) / 2),
        u === d
          ? (s = c = 0)
          : ((f = u - d),
            (c = l > 0.5 ? f / (2 - u - d) : f / (u + d)),
            (s =
              u === i
                ? (a - o) / f + (a < o ? 6 : 0)
                : u === a
                  ? (o - i) / f + 2
                  : (i - a) / f + 4),
            (s *= 60)),
        (r[0] = ~~(s + 0.5)),
        (r[1] = ~~(c * 100 + 0.5)),
        (r[2] = ~~(l * 100 + 0.5))),
      n && r.length < 4 && (r[3] = 1),
      r
    );
  },
  ln = function (e) {
    var t = [],
      n = [],
      r = -1;
    return (
      e.split(dn).forEach(function (e) {
        var i = e.match(fe) || [];
        (t.push.apply(t, i), n.push((r += i.length + 1)));
      }),
      (t.c = n),
      t
    );
  },
  un = function (e, t, n) {
    var r = ``,
      i = (e + r).match(dn),
      a = t ? `hsla(` : `rgba(`,
      o = 0,
      s,
      c,
      l,
      u;
    if (!i) return e;
    if (
      ((i = i.map(function (e) {
        return (
          (e = cn(e, t, 1)) &&
          a +
            (t ? e[0] + `,` + e[1] + `%,` + e[2] + `%,` + e[3] : e.join(`,`)) +
            `)`
        );
      })),
      n && ((l = ln(e)), (s = n.c), s.join(r) !== l.c.join(r)))
    )
      for (c = e.replace(dn, `1`).split(fe), u = c.length - 1; o < u; o++)
        r +=
          c[o] +
          (~s.indexOf(o)
            ? i.shift() || a + `0,0,0,0)`
            : (l.length ? l : i.length ? i : n).shift());
    if (!c)
      for (c = e.split(dn), u = c.length - 1; o < u; o++) r += c[o] + i[o];
    return r + c[u];
  },
  dn = (function () {
    var e = `(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b`,
      t;
    for (t in on) e += `|` + t + `\\b`;
    return RegExp(e + `)`, `gi`);
  })(),
  fn = /hsl[a]?\(/,
  pn = function (e) {
    var t = e.join(` `),
      n;
    if (((dn.lastIndex = 0), dn.test(t)))
      return (
        (n = fn.test(t)),
        (e[1] = un(e[1], n)),
        (e[0] = un(e[0], n, ln(e[1]))),
        !0
      );
  },
  mn,
  hn = (function () {
    var e = Date.now,
      t = 500,
      n = 33,
      r = e(),
      i = r,
      a = 1e3 / 240,
      o = a,
      s = [],
      c,
      l,
      u,
      d,
      f,
      p,
      m = function u(m) {
        var h = e() - i,
          g = m === !0,
          _,
          v,
          y,
          b;
        if (
          ((h > t || h < 0) && (r += h - n),
          (i += h),
          (y = i - r),
          (_ = y - o),
          (_ > 0 || g) &&
            ((b = ++d.frame),
            (f = y - d.time * 1e3),
            (d.time = y /= 1e3),
            (o += _ + (_ >= a ? 0 : a - _)),
            (v = 1)),
          g || (c = l(u)),
          v)
        )
          for (p = 0; p < s.length; p++) s[p](y, f, b, m);
      };
    return (
      (d = {
        time: 0,
        frame: 0,
        tick: function () {
          m(!0);
        },
        deltaRatio: function (e) {
          return f / (1e3 / (e || 60));
        },
        wake: function () {
          xe &&
            (!_e &&
              ce() &&
              ((U = _e = window),
              (ve = U.document || {}),
              (ye.gsap = vr),
              (U.gsapVersions || (U.gsapVersions = [])).push(vr.version),
              W(be || U.GreenSockGlobals || (!U.gsap && U) || {}),
              nn.forEach(rn)),
            (u = typeof requestAnimationFrame < `u` && requestAnimationFrame),
            c && d.sleep(),
            (l =
              u ||
              function (e) {
                return setTimeout(e, (o - d.time * 1e3 + 1) | 0);
              }),
            (mn = 1),
            m(2));
        },
        sleep: function () {
          ((u ? cancelAnimationFrame : clearTimeout)(c), (mn = 0), (l = Te));
        },
        lagSmoothing: function (e, r) {
          ((t = e || 1 / 0), (n = Math.min(r || 33, t)));
        },
        fps: function (e) {
          ((a = 1e3 / (e || 240)), (o = d.time * 1e3 + a));
        },
        add: function (e, t, n) {
          var r = t
            ? function (t, n, i, a) {
                (e(t, n, i, a), d.remove(r));
              }
            : e;
          return (d.remove(e), s[n ? `unshift` : `push`](r), gn(), r);
        },
        remove: function (e, t) {
          ~(t = s.indexOf(e)) && s.splice(t, 1) && p >= t && p--;
        },
        _listeners: s,
      }),
      d
    );
  })(),
  gn = function () {
    return !mn && hn.wake();
  },
  G = {},
  _n = /^[\d.\-M][\d.\-,\s]/,
  vn = /["']/g,
  yn = function (e) {
    for (
      var t = {},
        n = e.substr(1, e.length - 3).split(`:`),
        r = n[0],
        i = 1,
        a = n.length,
        o,
        s,
        c;
      i < a;
      i++
    )
      ((s = n[i]),
        (o = i === a - 1 ? s.length : s.lastIndexOf(`,`)),
        (c = s.substr(0, o)),
        (t[r] = isNaN(c) ? c.replace(vn, ``).trim() : +c),
        (r = s.substr(o + 1).trim()));
    return t;
  },
  bn = function (e) {
    var t = e.indexOf(`(`) + 1,
      n = e.indexOf(`)`),
      r = e.indexOf(`(`, t);
    return e.substring(t, ~r && r < n ? e.indexOf(`)`, n + 1) : n);
  },
  xn = function (e) {
    var t = (e + ``).split(`(`),
      n = G[t[0]];
    return n && t.length > 1 && n.config
      ? n.config.apply(
          null,
          ~e.indexOf(`{`) ? [yn(t[1])] : bn(e).split(`,`).map(Ye),
        )
      : G._CE && _n.test(e)
        ? G._CE(``, e)
        : n;
  },
  Sn = function (e) {
    return function (t) {
      return 1 - e(1 - t);
    };
  },
  Cn = function (e, t) {
    return (e && (L(e) ? e : G[e] || xn(e))) || t;
  },
  wn = function (e, t, n, r) {
    (n === void 0 &&
      (n = function (e) {
        return 1 - t(1 - e);
      }),
      r === void 0 &&
        (r = function (e) {
          return e < 0.5 ? t(e * 2) / 2 : 1 - t((1 - e) * 2) / 2;
        }));
    var i = { easeIn: t, easeOut: n, easeInOut: r },
      a;
    return (
      Ve(e, function (e) {
        for (var t in ((G[e] = ye[e] = i), (G[(a = e.toLowerCase())] = n), i))
          G[
            a + (t === `easeIn` ? `.in` : t === `easeOut` ? `.out` : `.inOut`)
          ] = G[e + `.` + t] = i[t];
      }),
      i
    );
  },
  Tn = function (e) {
    return function (t) {
      return t < 0.5 ? (1 - e(1 - t * 2)) / 2 : 0.5 + e((t - 0.5) * 2) / 2;
    };
  },
  En = function e(t, n, r) {
    var i = n >= 1 ? n : 1,
      a = (r || (t ? 0.3 : 0.45)) / (n < 1 ? n : 1),
      o = (a / P) * (Math.asin(1 / i) || 0),
      s = function (e) {
        return e === 1 ? 1 : i * 2 ** (-10 * e) * re((e - o) * a) + 1;
      },
      c =
        t === `out`
          ? s
          : t === `in`
            ? function (e) {
                return 1 - s(1 - e);
              }
            : Tn(s);
    return (
      (a = P / a),
      (c.config = function (n, r) {
        return e(t, n, r);
      }),
      c
    );
  },
  Dn = function e(t, n) {
    n === void 0 && (n = 1.70158);
    var r = function (e) {
        return e ? --e * e * ((n + 1) * e + n) + 1 : 0;
      },
      i =
        t === `out`
          ? r
          : t === `in`
            ? function (e) {
                return 1 - r(1 - e);
              }
            : Tn(r);
    return (
      (i.config = function (n) {
        return e(t, n);
      }),
      i
    );
  };
(Ve(`Linear,Quad,Cubic,Quart,Quint,Strong`, function (e, t) {
  var n = t < 5 ? t + 1 : t;
  wn(
    e + `,Power` + (n - 1),
    t
      ? function (e) {
          return e ** +n;
        }
      : function (e) {
          return e;
        },
    function (e) {
      return 1 - (1 - e) ** n;
    },
    function (e) {
      return e < 0.5 ? (e * 2) ** n / 2 : 1 - ((1 - e) * 2) ** n / 2;
    },
  );
}),
  (G.Linear.easeNone = G.none = G.Linear.easeIn),
  wn(`Elastic`, En(`in`), En(`out`), En()),
  (function (e, t) {
    var n = 1 / t,
      r = 2 * n,
      i = 2.5 * n,
      a = function (a) {
        return a < n
          ? e * a * a
          : a < r
            ? e * (a - 1.5 / t) ** 2 + 0.75
            : a < i
              ? e * (a -= 2.25 / t) * a + 0.9375
              : e * (a - 2.625 / t) ** 2 + 0.984375;
      };
    wn(
      `Bounce`,
      function (e) {
        return 1 - a(1 - e);
      },
      a,
    );
  })(7.5625, 2.75),
  wn(`Expo`, function (e) {
    return 2 ** (10 * (e - 1)) * e + e * e * e * e * e * e * (1 - e);
  }),
  wn(`Circ`, function (e) {
    return -(te(1 - e * e) - 1);
  }),
  wn(`Sine`, function (e) {
    return e === 1 ? 1 : -ne(e * F) + 1;
  }),
  wn(`Back`, Dn(`in`), Dn(`out`), Dn()),
  (G.SteppedEase =
    G.steps =
    ye.SteppedEase =
      {
        config: function (e, t) {
          e === void 0 && (e = 1);
          var n = 1 / e,
            r = e + +!t,
            i = +!!t,
            a = 1 - N;
          return function (e) {
            return (((r * At(0, a, e)) | 0) + i) * n;
          };
        },
      }),
  (O.ease = G[`quad.out`]),
  Ve(
    `onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt`,
    function (e) {
      return (Le += e + `,` + e + `Params,`);
    },
  ));
var On = function (e, t) {
    ((this.id = ee++),
      (e._gsap = this),
      (this.target = e),
      (this.harness = t),
      (this.get = t ? t.get : Be),
      (this.set = t ? t.getSetter : Yn));
  },
  kn = (function () {
    function e(e) {
      ((this.vars = e),
        (this._delay = +e.delay || 0),
        (this._repeat = e.repeat === 1 / 0 ? -2 : e.repeat || 0) &&
          ((this._rDelay = e.repeatDelay || 0),
          (this._yoyo = !!e.yoyo || !!e.yoyoEase)),
        (this._ts = 1),
        wt(this, +e.duration, 1, 1),
        (this.data = e.data),
        j && ((this._ctx = j), j.data.push(this)),
        mn || hn.wake());
    }
    var t = e.prototype;
    return (
      (t.delay = function (e) {
        return e || e === 0
          ? (this.parent &&
              this.parent.smoothChildTiming &&
              this.startTime(this._start + e - this._delay),
            (this._delay = e),
            this)
          : this._delay;
      }),
      (t.duration = function (e) {
        return arguments.length
          ? this.totalDuration(
              this._repeat > 0 ? e + (e + this._rDelay) * this._repeat : e,
            )
          : this.totalDuration() && this._dur;
      }),
      (t.totalDuration = function (e) {
        return arguments.length
          ? ((this._dirty = 0),
            wt(
              this,
              this._repeat < 0
                ? e
                : (e - this._repeat * this._rDelay) / (this._repeat + 1),
            ))
          : this._tDur;
      }),
      (t.totalTime = function (e, t) {
        if ((gn(), !arguments.length)) return this._tTime;
        var n = this._dp;
        if (n && n.smoothChildTiming && this._ts) {
          for (ht(this, e), !n._dp || n.parent || gt(n, this); n && n.parent;)
            (n.parent._time !==
              n._start +
                (n._ts >= 0
                  ? n._tTime / n._ts
                  : (n.totalDuration() - n._tTime) / -n._ts) &&
              n.totalTime(n._tTime, !0),
              (n = n.parent));
          !this.parent &&
            this._dp.autoRemoveChildren &&
            ((this._ts > 0 && e < this._tDur) ||
              (this._ts < 0 && e > 0) ||
              (!this._tDur && !e)) &&
            _t(this._dp, this, this._start - this._delay);
        }
        return (
          (this._tTime !== e ||
            (!this._dur && !t) ||
            (this._initted && Math.abs(this._zTime) === N) ||
            (!this._initted && this._dur && e) ||
            (!e && !this._initted && (this.add || this._ptLookup))) &&
            (this._ts || (this._pTime = e), Je(this, e, t)),
          this
        );
      }),
      (t.time = function (e, t) {
        return arguments.length
          ? this.totalTime(
              Math.min(this.totalDuration(), e + dt(this)) %
                (this._dur + this._rDelay) || (e ? this._dur : 0),
              t,
            )
          : this._time;
      }),
      (t.totalProgress = function (e, t) {
        return arguments.length
          ? this.totalTime(this.totalDuration() * e, t)
          : this.totalDuration()
            ? Math.min(1, this._tTime / this._tDur)
            : this.rawTime() >= 0 && this._initted
              ? 1
              : 0;
      }),
      (t.progress = function (e, t) {
        return arguments.length
          ? this.totalTime(
              this.duration() *
                (this._yoyo && !(this.iteration() & 1) ? 1 - e : e) +
                dt(this),
              t,
            )
          : this.duration()
            ? Math.min(1, this._time / this._dur)
            : +(this.rawTime() > 0);
      }),
      (t.iteration = function (e, t) {
        var n = this.duration() + this._rDelay;
        return arguments.length
          ? this.totalTime(this._time + (e - 1) * n, t)
          : this._repeat
            ? ft(this._tTime, n) + 1
            : 1;
      }),
      (t.timeScale = function (e, t) {
        if (!arguments.length) return this._rts === -N ? 0 : this._rts;
        if (this._rts === e) return this;
        var n =
            this.parent && this._ts ? pt(this.parent._time, this) : this._tTime,
          r = this._rts < 0;
        ((this._rts = +e || 0),
          (this._ts = this._ps || e === -N ? 0 : this._rts));
        var i = this.totalDuration();
        return (
          (r !== this._rts < 0 || (n > 0 && n < i)) &&
            this.totalTime(At(-Math.abs(this._delay), i, n), t !== !1),
          mt(this),
          ct(this)
        );
      }),
      (t.paused = function (e) {
        if (!arguments.length) return this._ps;
        if (this._ps !== e) {
          if (((this._ps = e), e))
            ((this._pTime =
              this._tTime || Math.max(-this._delay, this.rawTime())),
              (this._ts = this._act = 0));
          else {
            (gn(), (this._ts = this._rts));
            var t =
                this.parent && !this.parent.smoothChildTiming
                  ? this.rawTime()
                  : this._tTime || this._pTime,
              n = this.progress() === 1 && Math.abs(this._zTime) !== N,
              r;
            if (n)
              for (this._tTime -= N, r = this._first; r;) {
                if (!r._dur && r._zTime < 0 && r._ts && r._start <= t + N) {
                  n = !1;
                  break;
                }
                r = r._next;
              }
            this.totalTime(t, n);
          }
        }
        return this;
      }),
      (t.startTime = function (e) {
        if (arguments.length) {
          this._start = Ue(e);
          var t = this.parent || this._dp;
          return (
            t &&
              (t._sort || !this.parent) &&
              _t(t, this, this._start - this._delay),
            this
          );
        }
        return this._start;
      }),
      (t.endTime = function (e) {
        return (
          this._start +
          (se(e) ? this.totalDuration() : this.duration()) /
            Math.abs(this._ts || 1)
        );
      }),
      (t.rawTime = function (e) {
        var t = this.parent || this._dp;
        return t
          ? e &&
            (!this._ts ||
              (this._repeat && this._time && this.totalProgress() < 1))
            ? this._tTime % (this._dur + this._rDelay)
            : this._ts
              ? pt(t.rawTime(e), this)
              : this._tTime
          : this._tTime;
      }),
      (t.revert = function (e) {
        e === void 0 && (e = Oe);
        var t = A;
        return (
          (A = e),
          qe(this) &&
            (this.timeline && this.timeline.revert(e),
            this.totalTime(-0.01, e.suppressEvents)),
          this.data !== `nested` && e.kill !== !1 && this.kill(),
          (A = t),
          this
        );
      }),
      (t.globalTime = function (e) {
        for (var t = this, n = arguments.length ? e : t.rawTime(); t;)
          ((n = t._start + n / (Math.abs(t._ts) || 1)), (t = t._dp));
        return !this.parent && this._sat ? this._sat.globalTime(e) : n;
      }),
      (t.repeat = function (e) {
        return arguments.length
          ? ((this._repeat = e === 1 / 0 ? -2 : e), Tt(this))
          : this._repeat === -2
            ? 1 / 0
            : this._repeat;
      }),
      (t.repeatDelay = function (e) {
        if (arguments.length) {
          var t = this._time;
          return ((this._rDelay = e), Tt(this), t ? this.time(t) : this);
        }
        return this._rDelay;
      }),
      (t.yoyo = function (e) {
        return arguments.length ? ((this._yoyo = e), this) : this._yoyo;
      }),
      (t.seek = function (e, t) {
        return this.totalTime(Dt(this, e), se(t));
      }),
      (t.restart = function (e, t) {
        return (
          this.play().totalTime(e ? -this._delay : 0, se(t)),
          this._dur || (this._zTime = -N),
          this
        );
      }),
      (t.play = function (e, t) {
        return (e != null && this.seek(e, t), this.reversed(!1).paused(!1));
      }),
      (t.reverse = function (e, t) {
        return (
          e != null && this.seek(e || this.totalDuration(), t),
          this.reversed(!0).paused(!1)
        );
      }),
      (t.pause = function (e, t) {
        return (e != null && this.seek(e, t), this.paused(!0));
      }),
      (t.resume = function () {
        return this.paused(!1);
      }),
      (t.reversed = function (e) {
        return arguments.length
          ? (!!e !== this.reversed() &&
              this.timeScale(-this._rts || (e ? -N : 0)),
            this)
          : this._rts < 0;
      }),
      (t.invalidate = function () {
        return ((this._initted = this._act = 0), (this._zTime = -N), this);
      }),
      (t.isActive = function () {
        var e = this.parent || this._dp,
          t = this._start,
          n;
        return !!(
          !e ||
          (this._ts &&
            this._initted &&
            e.isActive() &&
            (n = e.rawTime(!0)) >= t &&
            n < this.endTime(!0) - N)
        );
      }),
      (t.eventCallback = function (e, t, n) {
        var r = this.vars;
        return arguments.length > 1
          ? (t
              ? ((r[e] = t),
                n && (r[e + `Params`] = n),
                e === `onUpdate` && (this._onUpdate = t))
              : delete r[e],
            this)
          : r[e];
      }),
      (t.then = function (e) {
        var t = this,
          n = t._prom;
        return new Promise(function (r) {
          var i = L(e) ? e : Xe,
            a = function () {
              var e = t.then;
              ((t.then = null),
                n && n(),
                L(i) && (i = i(t)) && (i.then || i === t) && (t.then = e),
                r(i),
                (t.then = e));
            };
          (t._initted && t.totalProgress() === 1 && t._ts >= 0) ||
          (!t._tTime && t._ts < 0)
            ? a()
            : (t._prom = a);
        });
      }),
      (t.kill = function () {
        en(this);
      }),
      e
    );
  })();
Ze(kn.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: !1,
  parent: null,
  _initted: !1,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -N,
  _prom: 0,
  _ps: !1,
  _rts: 1,
});
var An = (function (e) {
  E(t, e);
  function t(t, n) {
    var r;
    return (
      t === void 0 && (t = {}),
      (r = e.call(this, t) || this),
      (r.labels = {}),
      (r.smoothChildTiming = !!t.smoothChildTiming),
      (r.autoRemoveChildren = !!t.autoRemoveChildren),
      (r._sort = se(t.sortChildren)),
      H && _t(t.parent || H, T(r), n),
      t.reversed && r.reverse(),
      t.paused && r.paused(!0),
      t.scrollTrigger && vt(T(r), t.scrollTrigger),
      r
    );
  }
  var n = t.prototype;
  return (
    (n.to = function (e, t, n) {
      return (Ot(0, arguments, this), this);
    }),
    (n.from = function (e, t, n) {
      return (Ot(1, arguments, this), this);
    }),
    (n.fromTo = function (e, t, n, r) {
      return (Ot(2, arguments, this), this);
    }),
    (n.set = function (e, t, n) {
      return (
        (t.duration = 0),
        (t.parent = this),
        nt(t).repeatDelay || (t.repeat = 0),
        (t.immediateRender = !!t.immediateRender),
        new Wn(e, t, Dt(this, n), 1),
        this
      );
    }),
    (n.call = function (e, t, n) {
      return _t(this, Wn.delayedCall(0, e, t), n);
    }),
    (n.staggerTo = function (e, t, n, r, i, a, o) {
      return (
        (n.duration = t),
        (n.stagger = n.stagger || r),
        (n.onComplete = a),
        (n.onCompleteParams = o),
        (n.parent = this),
        new Wn(e, n, Dt(this, i)),
        this
      );
    }),
    (n.staggerFrom = function (e, t, n, r, i, a, o) {
      return (
        (n.runBackwards = 1),
        (nt(n).immediateRender = se(n.immediateRender)),
        this.staggerTo(e, t, n, r, i, a, o)
      );
    }),
    (n.staggerFromTo = function (e, t, n, r, i, a, o, s) {
      return (
        (r.startAt = n),
        (nt(r).immediateRender = se(r.immediateRender)),
        this.staggerTo(e, t, r, i, a, o, s)
      );
    }),
    (n.render = function (e, t, n) {
      var r = this._time,
        i = this._dirty ? this.totalDuration() : this._tDur,
        a = this._dur,
        o = e <= 0 ? 0 : Ue(e),
        s = this._zTime < 0 != e < 0 && (this._initted || !a),
        c,
        l,
        u,
        d,
        f,
        p,
        m,
        h,
        g,
        _,
        v,
        y;
      if (
        (this !== H && o > i && e >= 0 && (o = i), o !== this._tTime || n || s)
      ) {
        if (
          (r !== this._time &&
            a &&
            ((o += this._time - r), (e += this._time - r)),
          (c = o),
          (g = this._start),
          (h = this._ts),
          (p = !h),
          s && (a || (r = this._zTime), (e || !t) && (this._zTime = e)),
          this._repeat)
        ) {
          if (
            ((v = this._yoyo),
            (f = a + this._rDelay),
            this._repeat < -1 && e < 0)
          )
            return this.totalTime(f * 100 + e, t, n);
          if (
            ((c = Ue(o % f)),
            o === i
              ? ((d = this._repeat), (c = a))
              : ((_ = Ue(o / f)),
                (d = ~~_),
                d && d === _ && ((c = a), d--),
                c > a && (c = a)),
            (_ = ft(this._tTime, f)),
            !r &&
              this._tTime &&
              _ !== d &&
              this._tTime - _ * f - this._dur <= 0 &&
              (_ = d),
            v && d & 1 && ((c = a - c), (y = 1)),
            d !== _ && !this._lock)
          ) {
            var b = v && _ & 1,
              x = b === (v && d & 1);
            if (
              (d < _ && (b = !b),
              (r = b ? 0 : o % a ? a : o),
              (this._lock = 1),
              (this.render(r || (y ? 0 : Ue(d * f)), t, !a)._lock = 0),
              (this._tTime = o),
              !t && this.parent && $t(this, `onRepeat`),
              this.vars.repeatRefresh &&
                !y &&
                ((this.invalidate()._lock = 1), (_ = d)),
              (r && r !== this._time) ||
                p !== !this._ts ||
                (this.vars.onRepeat && !this.parent && !this._act) ||
                ((a = this._dur),
                (i = this._tDur),
                x &&
                  ((this._lock = 2),
                  (r = b ? a : -1e-4),
                  this.render(r, !0),
                  this.vars.repeatRefresh && !y && this.invalidate()),
                (this._lock = 0),
                !this._ts && !p))
            )
              return this;
          }
        }
        if (
          (this._hasPause &&
            !this._forcing &&
            this._lock < 2 &&
            ((m = Ct(this, Ue(r), Ue(c))), m && (o -= c - (c = m._start))),
          (this._tTime = o),
          (this._time = c),
          (this._act = !!h),
          this._initted ||
            ((this._onUpdate = this.vars.onUpdate),
            (this._initted = 1),
            (this._zTime = e),
            (r = 0)),
          !r && o && a && !t && !_ && ($t(this, `onStart`), this._tTime !== o))
        )
          return this;
        if (c >= r && e >= 0)
          for (l = this._first; l;) {
            if (
              ((u = l._next), (l._act || c >= l._start) && l._ts && m !== l)
            ) {
              if (l.parent !== this) return this.render(e, t, n);
              if (
                (l.render(
                  l._ts > 0
                    ? (c - l._start) * l._ts
                    : (l._dirty ? l.totalDuration() : l._tDur) +
                        (c - l._start) * l._ts,
                  t,
                  n,
                ),
                c !== this._time || (!this._ts && !p))
              ) {
                ((m = 0), u && (o += this._zTime = -N));
                break;
              }
            }
            l = u;
          }
        else {
          l = this._last;
          for (var S = e < 0 ? e : c; l;) {
            if (((u = l._prev), (l._act || S <= l._end) && l._ts && m !== l)) {
              if (l.parent !== this) return this.render(e, t, n);
              if (
                (l.render(
                  l._ts > 0
                    ? (S - l._start) * l._ts
                    : (l._dirty ? l.totalDuration() : l._tDur) +
                        (S - l._start) * l._ts,
                  t,
                  n || (A && qe(l)),
                ),
                c !== this._time || (!this._ts && !p))
              ) {
                ((m = 0), u && (o += this._zTime = S ? -N : N));
                break;
              }
            }
            l = u;
          }
        }
        if (
          m &&
          !t &&
          (this.pause(),
          (m.render(c >= r ? 0 : -N)._zTime = c >= r ? 1 : -1),
          this._ts)
        )
          return ((this._start = g), mt(this), this.render(e, t, n));
        (this._onUpdate && !t && $t(this, `onUpdate`, !0),
          ((o === i && this._tTime >= this.totalDuration()) || (!o && r)) &&
            ((g !== this._start && Math.abs(h) === Math.abs(this._ts)) ||
              this._lock ||
              ((e || !a) &&
                ((o === i && this._ts > 0) || (!o && this._ts < 0)) &&
                ot(this, 1),
              t ||
                (e < 0 && !r) ||
                (!o && !r && i) ||
                ($t(
                  this,
                  o === i && e >= 0 ? `onComplete` : `onReverseComplete`,
                  !0,
                ),
                this._prom &&
                  !(o < i && this.timeScale() > 0) &&
                  this._prom()))));
      }
      return this;
    }),
    (n.add = function (e, t) {
      var n = this;
      if ((ie(t) || (t = Dt(this, t, e)), !(e instanceof kn))) {
        if (ue(e))
          return (
            e.forEach(function (e) {
              return n.add(e, t);
            }),
            this
          );
        if (I(e)) return this.addLabel(e, t);
        if (L(e)) e = Wn.delayedCall(0, e);
        else return this;
      }
      return this === e ? this : _t(this, e, t);
    }),
    (n.getChildren = function (e, t, n, r) {
      (e === void 0 && (e = !0),
        t === void 0 && (t = !0),
        n === void 0 && (n = !0),
        r === void 0 && (r = -M));
      for (var i = [], a = this._first; a;)
        (a._start >= r &&
          (a instanceof Wn
            ? t && i.push(a)
            : (n && i.push(a), e && i.push.apply(i, a.getChildren(!0, t, n)))),
          (a = a._next));
      return i;
    }),
    (n.getById = function (e) {
      for (var t = this.getChildren(1, 1, 1), n = t.length; n--;)
        if (t[n].vars.id === e) return t[n];
    }),
    (n.remove = function (e) {
      return I(e)
        ? this.removeLabel(e)
        : L(e)
          ? this.killTweensOf(e)
          : (e.parent === this && at(this, e),
            e === this._recent && (this._recent = this._last),
            st(this));
    }),
    (n.totalTime = function (t, n) {
      return arguments.length
        ? ((this._forcing = 1),
          !this._dp &&
            this._ts &&
            (this._start = Ue(
              hn.time -
                (this._ts > 0
                  ? t / this._ts
                  : (this.totalDuration() - t) / -this._ts),
            )),
          e.prototype.totalTime.call(this, t, n),
          (this._forcing = 0),
          this)
        : this._tTime;
    }),
    (n.addLabel = function (e, t) {
      return ((this.labels[e] = Dt(this, t)), this);
    }),
    (n.removeLabel = function (e) {
      return (delete this.labels[e], this);
    }),
    (n.addPause = function (e, t, n) {
      var r = Wn.delayedCall(0, t || Te, n);
      return (
        (r.data = `isPause`),
        (this._hasPause = 1),
        _t(this, r, Dt(this, e))
      );
    }),
    (n.removePause = function (e) {
      var t = this._first;
      for (e = Dt(this, e); t;)
        (t._start === e && t.data === `isPause` && ot(t), (t = t._next));
    }),
    (n.killTweensOf = function (e, t, n) {
      for (var r = this.getTweensOf(e, n), i = r.length; i--;)
        Fn !== r[i] && r[i].kill(e, t);
      return this;
    }),
    (n.getTweensOf = function (e, t) {
      for (var n = [], r = It(e), i = this._first, a = ie(t), o; i;)
        (i instanceof Wn
          ? Ge(i._targets, r) &&
            (a
              ? (!Fn || (i._initted && i._ts)) &&
                i.globalTime(0) <= t &&
                i.globalTime(i.totalDuration()) > t
              : !t || i.isActive()) &&
            n.push(i)
          : (o = i.getTweensOf(r, t)).length && n.push.apply(n, o),
          (i = i._next));
      return n;
    }),
    (n.tweenTo = function (e, t) {
      t ||= {};
      var n = this,
        r = Dt(n, e),
        i = t,
        a = i.startAt,
        o = i.onStart,
        s = i.onStartParams,
        c = i.immediateRender,
        l,
        u = Wn.to(
          n,
          Ze(
            {
              ease: t.ease || `none`,
              lazy: !1,
              immediateRender: !1,
              time: r,
              overwrite: `auto`,
              duration:
                t.duration ||
                Math.abs(
                  (r - (a && `time` in a ? a.time : n._time)) / n.timeScale(),
                ) ||
                N,
              onStart: function () {
                if ((n.pause(), !l)) {
                  var e =
                    t.duration ||
                    Math.abs(
                      (r - (a && `time` in a ? a.time : n._time)) /
                        n.timeScale(),
                    );
                  (u._dur !== e && wt(u, e, 0, 1).render(u._time, !0, !0),
                    (l = 1));
                }
                o && o.apply(u, s || []);
              },
            },
            t,
          ),
        );
      return c ? u.render(0) : u;
    }),
    (n.tweenFromTo = function (e, t, n) {
      return this.tweenTo(t, Ze({ startAt: { time: Dt(this, e) } }, n));
    }),
    (n.recent = function () {
      return this._recent;
    }),
    (n.nextLabel = function (e) {
      return (e === void 0 && (e = this._time), Qt(this, Dt(this, e)));
    }),
    (n.previousLabel = function (e) {
      return (e === void 0 && (e = this._time), Qt(this, Dt(this, e), 1));
    }),
    (n.currentLabel = function (e) {
      return arguments.length
        ? this.seek(e, !0)
        : this.previousLabel(this._time + N);
    }),
    (n.shiftChildren = function (e, t, n) {
      n === void 0 && (n = 0);
      var r = this._first,
        i = this.labels,
        a;
      for (e = Ue(e); r;)
        (r._start >= n && ((r._start += e), (r._end += e)), (r = r._next));
      if (t) for (a in i) i[a] >= n && (i[a] += e);
      return st(this);
    }),
    (n.invalidate = function (t) {
      var n = this._first;
      for (this._lock = 0; n;) (n.invalidate(t), (n = n._next));
      return e.prototype.invalidate.call(this, t);
    }),
    (n.clear = function (e) {
      e === void 0 && (e = !0);
      for (var t = this._first, n; t;) ((n = t._next), this.remove(t), (t = n));
      return (
        this._dp && (this._time = this._tTime = this._pTime = 0),
        e && (this.labels = {}),
        st(this)
      );
    }),
    (n.totalDuration = function (e) {
      var t = 0,
        n = this,
        r = n._last,
        i = M,
        a,
        o,
        s;
      if (arguments.length)
        return n.timeScale(
          (n._repeat < 0 ? n.duration() : n.totalDuration()) /
            (n.reversed() ? -e : e),
        );
      if (n._dirty) {
        for (s = n.parent; r;)
          ((a = r._prev),
            r._dirty && r.totalDuration(),
            (o = r._start),
            o > i && n._sort && r._ts && !n._lock
              ? ((n._lock = 1), (_t(n, r, o - r._delay, 1)._lock = 0))
              : (i = o),
            o < 0 &&
              r._ts &&
              ((t -= o),
              ((!s && !n._dp) || (s && s.smoothChildTiming)) &&
                ((n._start += Ue(o / n._ts)), (n._time -= o), (n._tTime -= o)),
              n.shiftChildren(-o, !1, -1 / 0),
              (i = 0)),
            r._end > t && r._ts && (t = r._end),
            (r = a));
        (wt(n, n === H && n._time > t ? n._time : t, 1, 1), (n._dirty = 0));
      }
      return n._tDur;
    }),
    (t.updateRoot = function (e) {
      if ((H._ts && (Je(H, pt(e, H)), (Me = hn.frame)), hn.frame >= Fe)) {
        Fe += D.autoSleep || 120;
        var t = H._first;
        if ((!t || !t._ts) && D.autoSleep && hn._listeners.length < 2) {
          for (; t && !t._ts;) t = t._next;
          t || hn.sleep();
        }
      }
    }),
    t
  );
})(kn);
Ze(An.prototype, { _lock: 0, _hasPause: 0, _forcing: 0 });
var jn = function (e, t, n, r, i, a, o) {
    var s = new ir(this._pt, e, t, 0, 1, Qn, null, i),
      c = 0,
      l = 0,
      u,
      d,
      f,
      p,
      m,
      h,
      g,
      _;
    for (
      s.b = n,
        s.e = r,
        n += ``,
        r += ``,
        (g = ~r.indexOf(`random(`)) && (r = Yt(r)),
        a && ((_ = [n, r]), a(_, e, t), (n = _[0]), (r = _[1])),
        d = n.match(pe) || [];
      (u = pe.exec(r));
    )
      ((p = u[0]),
        (m = r.substring(c, u.index)),
        f ? (f = (f + 1) % 5) : m.substr(-5) === `rgba(` && (f = 1),
        p !== d[l++] &&
          ((h = parseFloat(d[l - 1]) || 0),
          (s._pt = {
            _next: s._pt,
            p: m || l === 1 ? m : `,`,
            s: h,
            c: p.charAt(1) === `=` ? We(h, p) - h : parseFloat(p) - h,
            m: f && f < 4 ? Math.round : 0,
          }),
          (c = pe.lastIndex)));
    return (
      (s.c = c < r.length ? r.substring(c, r.length) : ``),
      (s.fp = o),
      (me.test(r) || g) && (s.e = 0),
      (this._pt = s),
      s
    );
  },
  Mn = function (e, t, n, r, i, a, o, s, c, l) {
    L(r) && (r = r(i || 0, e, a));
    var u = e[t],
      d =
        n === `get`
          ? L(u)
            ? c
              ? e[
                  t.indexOf(`set`) || !L(e[`get` + t.substr(3)])
                    ? t
                    : `get` + t.substr(3)
                ](c)
              : e[t]()
            : u
          : n,
      f = L(u) ? (c ? qn : Kn) : Gn,
      p;
    if (
      (I(r) &&
        (~r.indexOf(`random(`) && (r = Yt(r)),
        r.charAt(1) === `=` &&
          ((p = We(d, r) + (jt(d) || 0)), (p || p === 0) && (r = p))),
      !l || d !== r || In)
    )
      return !isNaN(d * r) && r !== ``
        ? ((p = new ir(
            this._pt,
            e,
            t,
            +d || 0,
            r - (d || 0),
            typeof u == `boolean` ? Zn : Xn,
            0,
            f,
          )),
          c && (p.fp = c),
          o && p.modifier(o, this, e),
          (this._pt = p))
        : (!u && !(t in e) && Se(t, r),
          jn.call(this, e, t, d, r, f, s || D.stringFilter, c));
  },
  Nn = function (e, t, n, r, i) {
    if (
      (L(e) && (e = Vn(e, i, t, n, r)),
      !oe(e) || (e.style && e.nodeType) || ue(e) || le(e))
    )
      return I(e) ? Vn(e, i, t, n, r) : e;
    var a = {},
      o;
    for (o in e) a[o] = Vn(e[o], i, t, n, r);
    return a;
  },
  Pn = function (e, t, n, r, i, a) {
    var o, s, c, l;
    if (
      Ne[e] &&
      (o = new Ne[e]()).init(
        i,
        o.rawVars ? t[e] : Nn(t[e], r, i, a, n),
        n,
        r,
        a,
      ) !== !1 &&
      ((n._pt = s = new ir(n._pt, i, e, 0, 1, o.render, o, 0, o.priority)),
      n !== tn)
    )
      for (c = n._ptLookup[n._targets.indexOf(i)], l = o._props.length; l--;)
        c[o._props[l]] = s;
    return o;
  },
  Fn,
  In,
  Ln = function e(t, n, r) {
    var i = t.vars,
      a = i.ease,
      o = i.startAt,
      s = i.immediateRender,
      c = i.lazy,
      l = i.onUpdate,
      u = i.runBackwards,
      d = i.yoyoEase,
      f = i.keyframes,
      p = i.autoRevert,
      m = t._dur,
      h = t._startAt,
      g = t._targets,
      _ = t.parent,
      v = _ && _.data === `nested` ? _.vars.targets : g,
      y = t._overwrite === `auto` && !k,
      b = t.timeline,
      x = i.easeReverse || d,
      S,
      C,
      w,
      T,
      E,
      D,
      j,
      P,
      F,
      ee,
      te,
      ne,
      re;
    if (
      (!b || (f && a) || (a = `none`),
      (t._ease = Cn(a, O.ease)),
      (t._rEase = x && (Cn(x) || t._ease)),
      (t._from = !b && !!i.runBackwards),
      t._from && (t.ratio = 1),
      !b || (f && !i.stagger))
    ) {
      if (
        ((P = g[0] ? ze(g[0]).harness : 0),
        (ne = P && i[P.prop]),
        (S = tt(i, ke)),
        h &&
          (h._zTime < 0 && h.progress(1),
          n < 0 && u && s && !p ? h.render(-1, !0) : h.revert(u && m ? De : Ee),
          (h._lazy = 0)),
        o)
      ) {
        if (
          (ot(
            (t._startAt = Wn.set(
              g,
              Ze(
                {
                  data: `isStart`,
                  overwrite: !1,
                  parent: _,
                  immediateRender: !0,
                  lazy: !h && se(c),
                  startAt: null,
                  delay: 0,
                  onUpdate:
                    l &&
                    function () {
                      return $t(t, `onUpdate`);
                    },
                  stagger: 0,
                },
                o,
              ),
            )),
          ),
          (t._startAt._dp = 0),
          (t._startAt._sat = t),
          n < 0 && (A || (!s && !p)) && t._startAt.revert(De),
          s && m && n <= 0 && r <= 0)
        ) {
          n && (t._zTime = n);
          return;
        }
      } else if (u && m && !h) {
        if (
          (n && (s = !1),
          (w = Ze(
            {
              overwrite: !1,
              data: `isFromStart`,
              lazy: s && !h && se(c),
              immediateRender: s,
              stagger: 0,
              parent: _,
            },
            S,
          )),
          ne && (w[P.prop] = ne),
          ot((t._startAt = Wn.set(g, w))),
          (t._startAt._dp = 0),
          (t._startAt._sat = t),
          n < 0 && (A ? t._startAt.revert(De) : t._startAt.render(-1, !0)),
          (t._zTime = n),
          !s)
        )
          e(t._startAt, N, N);
        else if (!n) return;
      }
      for (
        t._pt = t._ptCache = 0, c = (m && se(c)) || (c && !m), C = 0;
        C < g.length;
        C++
      ) {
        if (
          ((E = g[C]),
          (j = E._gsap || Re(g)[C]._gsap),
          (t._ptLookup[C] = ee = {}),
          je[j.id] && Ae.length && Ke(),
          (te = v === g ? C : v.indexOf(E)),
          P &&
            (F = new P()).init(E, ne || S, t, te, v) !== !1 &&
            ((t._pt = T =
              new ir(t._pt, E, F.name, 0, 1, F.render, F, 0, F.priority)),
            F._props.forEach(function (e) {
              ee[e] = T;
            }),
            F.priority && (D = 1)),
          !P || ne)
        )
          for (w in S)
            Ne[w] && (F = Pn(w, S, t, te, E, v))
              ? F.priority && (D = 1)
              : (ee[w] = T =
                  Mn.call(t, E, w, `get`, S[w], te, v, 0, i.stringFilter));
        (t._op && t._op[C] && t.kill(E, t._op[C]),
          y &&
            t._pt &&
            ((Fn = t),
            H.killTweensOf(E, ee, t.globalTime(n)),
            (re = !t.parent),
            (Fn = 0)),
          t._pt && c && (je[j.id] = 1));
      }
      (D && rr(t), t._onInit && t._onInit(t));
    }
    ((t._onUpdate = l),
      (t._initted = (!t._op || t._pt) && !re),
      f && n <= 0 && b.render(M, !0, !0));
  },
  Rn = function (e, t, n, r, i, a, o, s) {
    var c = ((e._pt && e._ptCache) || (e._ptCache = {}))[t],
      l,
      u,
      d,
      f;
    if (!c)
      for (
        c = e._ptCache[t] = [], d = e._ptLookup, f = e._targets.length;
        f--;
      ) {
        if (((l = d[f][t]), l && l.d && l.d._pt))
          for (l = l.d._pt; l && l.p !== t && l.fp !== t;) l = l._next;
        if (!l)
          return (
            (In = 1),
            (e.vars[t] = `+=0`),
            Ln(e, o),
            (In = 0),
            s
              ? Ce(
                  t +
                    ` not eligible for reset. Try splitting into individual properties`,
                )
              : 1
          );
        c.push(l);
      }
    for (f = c.length; f--;)
      ((u = c[f]),
        (l = u._pt || u),
        (l.s = (r || r === 0) && !i ? r : l.s + (r || 0) + a * l.c),
        (l.c = n - l.s),
        u.e && (u.e = He(n) + jt(u.e)),
        u.b && (u.b = l.s + jt(u.b)));
  },
  zn = function (e, t) {
    var n = e[0] ? ze(e[0]).harness : 0,
      r = n && n.aliases,
      i,
      a,
      o,
      s;
    if (!r) return t;
    for (a in ((i = $e({}, t)), r))
      if (a in i) for (s = r[a].split(`,`), o = s.length; o--;) i[s[o]] = i[a];
    return i;
  },
  Bn = function (e, t, n, r) {
    var i = t.ease || r || `power1.inOut`,
      a,
      o;
    if (ue(t))
      ((o = n[e] || (n[e] = [])),
        t.forEach(function (e, n) {
          return o.push({ t: (n / (t.length - 1)) * 100, v: e, e: i });
        }));
    else
      for (a in t)
        ((o = n[a] || (n[a] = [])),
          a === `ease` || o.push({ t: parseFloat(e), v: t[a], e: i }));
  },
  Vn = function (e, t, n, r, i) {
    return L(e)
      ? e.call(t, n, r, i)
      : I(e) && ~e.indexOf(`random(`)
        ? Yt(e)
        : e;
  },
  Hn =
    Le +
    `repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert`,
  Un = {};
(Ve(Hn + `,id,stagger,delay,duration,paused,scrollTrigger`, function (e) {
  return (Un[e] = 1);
}),
  (Hn = Hn.split(`,`)));
var Wn = (function (e) {
  E(t, e);
  function t(t, n, r, i) {
    var a;
    (typeof n == `number` && ((r.duration = n), (n = r), (r = null)),
      (a = e.call(this, i ? n : nt(n)) || this));
    var o = a.vars,
      s = o.duration,
      c = o.delay,
      l = o.immediateRender,
      u = o.stagger,
      d = o.overwrite,
      f = o.keyframes,
      p = o.defaults,
      m = o.scrollTrigger,
      h = n.parent || H,
      g = (ue(t) || le(t) ? ie(t[0]) : `length` in n) ? [t] : It(t),
      _,
      v,
      y,
      b,
      x,
      S,
      C,
      w;
    if (
      ((a._targets = g.length
        ? Re(g)
        : Ce(
            `GSAP target ` + t + ` not found. https://gsap.com`,
            !D.nullTargetWarn,
          ) || []),
      (a._ptLookup = []),
      (a._overwrite = d),
      f || u || R(s) || R(c))
    ) {
      n = a.vars;
      var E = n.easeReverse || n.yoyoEase;
      if (
        ((_ = a.timeline =
          new An({
            data: `nested`,
            defaults: p || {},
            targets: h && h.data === `nested` ? h.vars.targets : g,
          })),
        _.kill(),
        (_.parent = _._dp = T(a)),
        (_._start = 0),
        u || R(s) || R(c))
      ) {
        if (((b = g.length), (C = u && zt(u)), oe(u)))
          for (x in u) ~Hn.indexOf(x) && ((w ||= {}), (w[x] = u[x]));
        for (v = 0; v < b; v++)
          ((y = tt(n, Un)),
            (y.stagger = 0),
            E && (y.easeReverse = E),
            w && $e(y, w),
            (S = g[v]),
            (y.duration = +Vn(s, T(a), v, S, g)),
            (y.delay = (+Vn(c, T(a), v, S, g) || 0) - a._delay),
            !u &&
              b === 1 &&
              y.delay &&
              ((a._delay = c = y.delay), (a._start += c), (y.delay = 0)),
            _.to(S, y, C ? C(v, S, g) : 0),
            (_._ease = G.none));
        _.duration() ? (s = c = 0) : (a.timeline = 0);
      } else if (f) {
        (nt(Ze(_.vars.defaults, { ease: `none` })),
          (_._ease = Cn(f.ease || n.ease || `none`)));
        var O = 0,
          A,
          j,
          M;
        if (ue(f))
          (f.forEach(function (e) {
            return _.to(g, e, `>`);
          }),
            _.duration());
        else {
          for (x in ((y = {}), f))
            x === `ease` || x === `easeEach` || Bn(x, f[x], y, f.easeEach);
          for (x in y)
            for (
              A = y[x].sort(function (e, t) {
                return e.t - t.t;
              }),
                O = 0,
                v = 0;
              v < A.length;
              v++
            )
              ((j = A[v]),
                (M = {
                  ease: j.e,
                  duration: ((j.t - (v ? A[v - 1].t : 0)) / 100) * s,
                }),
                (M[x] = j.v),
                _.to(g, M, O),
                (O += M.duration));
          _.duration() < s && _.to({}, { duration: s - _.duration() });
        }
      }
      s || a.duration((s = _.duration()));
    } else a.timeline = 0;
    return (
      d === !0 && !k && ((Fn = T(a)), H.killTweensOf(g), (Fn = 0)),
      _t(h, T(a), r),
      n.reversed && a.reverse(),
      n.paused && a.paused(!0),
      (l ||
        (!s &&
          !f &&
          a._start === Ue(h._time) &&
          se(l) &&
          ut(T(a)) &&
          h.data !== `nested`)) &&
        ((a._tTime = -N), a.render(Math.max(0, -c) || 0)),
      m && vt(T(a), m),
      a
    );
  }
  var n = t.prototype;
  return (
    (n.render = function (e, t, n) {
      var r = this._time,
        i = this._tDur,
        a = this._dur,
        o = e < 0,
        s = e > i - N && !o ? i : e < N ? 0 : e,
        c,
        l,
        u,
        d,
        f,
        p,
        m,
        h;
      if (!a) St(this, e, t, n);
      else if (
        s !== this._tTime ||
        !e ||
        n ||
        (!this._initted && this._tTime) ||
        (this._startAt && this._zTime < 0 !== o) ||
        this._lazy
      ) {
        if (((c = s), (h = this.timeline), this._repeat)) {
          if (((d = a + this._rDelay), this._repeat < -1 && o))
            return this.totalTime(d * 100 + e, t, n);
          if (
            ((c = Ue(s % d)),
            s === i
              ? ((u = this._repeat), (c = a))
              : ((f = Ue(s / d)),
                (u = ~~f),
                u && u === f ? ((c = a), u--) : c > a && (c = a)),
            (p = this._yoyo && u & 1),
            p && (c = a - c),
            (f = ft(this._tTime, d)),
            c === r && !n && this._initted && u === f)
          )
            return ((this._tTime = s), this);
          u !== f &&
            this.vars.repeatRefresh &&
            !p &&
            !this._lock &&
            c !== d &&
            this._initted &&
            ((this._lock = n = 1),
            (this.render(Ue(d * u), !0).invalidate()._lock = 0));
        }
        if (!this._initted) {
          if (yt(this, o ? e : c, n, t, s)) return ((this._tTime = 0), this);
          if (r !== this._time && !(n && this.vars.repeatRefresh && u !== f))
            return this;
          if (a !== this._dur) return this.render(e, t, n);
        }
        if (this._rEase) {
          var g = c < r;
          if (g !== this._inv) {
            var _ = g ? r : a - r;
            ((this._inv = g),
              this._from && (this.ratio = 1 - this.ratio),
              (this._invRatio = this.ratio),
              (this._invTime = r),
              (this._invRecip = _ ? (g ? -1 : 1) / _ : 0),
              (this._invScale = g ? -this.ratio : 1 - this.ratio),
              (this._invEase = g ? this._rEase : this._ease));
          }
          this.ratio = m =
            this._invRatio +
            this._invScale *
              this._invEase((c - this._invTime) * this._invRecip);
        } else this.ratio = m = this._ease(c / a);
        if (
          (this._from && (this.ratio = m = 1 - m),
          (this._tTime = s),
          (this._time = c),
          !this._act && this._ts && ((this._act = 1), (this._lazy = 0)),
          !r && s && !t && !f && ($t(this, `onStart`), this._tTime !== s))
        )
          return this;
        for (l = this._pt; l;) (l.r(m, l.d), (l = l._next));
        ((h && h.render(e < 0 ? e : h._dur * h._ease(c / this._dur), t, n)) ||
          (this._startAt && (this._zTime = e)),
          this._onUpdate &&
            !t &&
            (o && lt(this, e, t, n), $t(this, `onUpdate`)),
          this._repeat &&
            u !== f &&
            this.vars.onRepeat &&
            !t &&
            this.parent &&
            $t(this, `onRepeat`),
          (s !== this._tDur && s) ||
            this._tTime !== s ||
            (o && !this._onUpdate && lt(this, e, !0, !0),
            (e || !a) &&
              ((s === this._tDur && this._ts > 0) || (!s && this._ts < 0)) &&
              ot(this, 1),
            !t &&
              (!o || r) &&
              (s || r || p) &&
              ($t(this, s === i ? `onComplete` : `onReverseComplete`, !0),
              this._prom && !(s < i && this.timeScale() > 0) && this._prom())));
      }
      return this;
    }),
    (n.targets = function () {
      return this._targets;
    }),
    (n.invalidate = function (t) {
      return (
        (t && this.vars.runBackwards) || (this._startAt = 0),
        (this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0),
        (this._ptLookup = []),
        this.timeline && this.timeline.invalidate(t),
        e.prototype.invalidate.call(this, t)
      );
    }),
    (n.resetTo = function (e, t, n, r, i) {
      (mn || hn.wake(), this._ts || this.play());
      var a = Math.min(this._dur, (this._dp._time - this._start) * this._ts),
        o;
      return (
        this._initted || Ln(this, a),
        (o = this._ease(a / this._dur)),
        Rn(this, e, t, n, r, o, a, i)
          ? this.resetTo(e, t, n, r, 1)
          : (ht(this, 0),
            this.parent ||
              it(
                this._dp,
                this,
                `_first`,
                `_last`,
                this._dp._sort ? `_start` : 0,
              ),
            this.render(0))
      );
    }),
    (n.kill = function (e, t) {
      if ((t === void 0 && (t = `all`), !e && (!t || t === `all`)))
        return (
          (this._lazy = this._pt = 0),
          this.parent
            ? en(this)
            : this.scrollTrigger && this.scrollTrigger.kill(!!A),
          this
        );
      if (this.timeline) {
        var n = this.timeline.totalDuration();
        return (
          this.timeline.killTweensOf(e, t, Fn && Fn.vars.overwrite !== !0)
            ._first || en(this),
          this.parent &&
            n !== this.timeline.totalDuration() &&
            wt(this, (this._dur * this.timeline._tDur) / n, 0, 1),
          this
        );
      }
      var r = this._targets,
        i = e ? It(e) : r,
        a = this._ptLookup,
        o = this._pt,
        s,
        c,
        l,
        u,
        d,
        f,
        p;
      if ((!t || t === `all`) && rt(r, i))
        return (t === `all` && (this._pt = 0), en(this));
      for (
        s = this._op = this._op || [],
          t !== `all` &&
            (I(t) &&
              ((d = {}),
              Ve(t, function (e) {
                return (d[e] = 1);
              }),
              (t = d)),
            (t = zn(r, t))),
          p = r.length;
        p--;
      )
        if (~i.indexOf(r[p]))
          for (d in ((c = a[p]),
          t === `all`
            ? ((s[p] = t), (u = c), (l = {}))
            : ((l = s[p] = s[p] || {}), (u = t)),
          u))
            ((f = c && c[d]),
              f &&
                ((`kill` in f.d && f.d.kill(d) !== !0) || at(this, f, `_pt`),
                delete c[d]),
              l !== `all` && (l[d] = 1));
      return (this._initted && !this._pt && o && en(this), this);
    }),
    (t.to = function (e, n) {
      return new t(e, n, arguments[2]);
    }),
    (t.from = function (e, t) {
      return Ot(1, arguments);
    }),
    (t.delayedCall = function (e, n, r, i) {
      return new t(n, 0, {
        immediateRender: !1,
        lazy: !1,
        overwrite: !1,
        delay: e,
        onComplete: n,
        onReverseComplete: n,
        onCompleteParams: r,
        onReverseCompleteParams: r,
        callbackScope: i,
      });
    }),
    (t.fromTo = function (e, t, n) {
      return Ot(2, arguments);
    }),
    (t.set = function (e, n) {
      return ((n.duration = 0), n.repeatDelay || (n.repeat = 0), new t(e, n));
    }),
    (t.killTweensOf = function (e, t, n) {
      return H.killTweensOf(e, t, n);
    }),
    t
  );
})(kn);
(Ze(Wn.prototype, { _targets: [], _lazy: 0, _startAt: 0, _op: 0, _onInit: 0 }),
  Ve(`staggerTo,staggerFrom,staggerFromTo`, function (e) {
    Wn[e] = function () {
      var t = new An(),
        n = Nt.call(arguments, 0);
      return (n.splice(e === `staggerFromTo` ? 5 : 4, 0, 0), t[e].apply(t, n));
    };
  }));
var Gn = function (e, t, n) {
    return (e[t] = n);
  },
  Kn = function (e, t, n) {
    return e[t](n);
  },
  qn = function (e, t, n, r) {
    return e[t](r.fp, n);
  },
  Jn = function (e, t, n) {
    return e.setAttribute(t, n);
  },
  Yn = function (e, t) {
    return L(e[t]) ? Kn : ae(e[t]) && e.setAttribute ? Jn : Gn;
  },
  Xn = function (e, t) {
    return t.set(t.t, t.p, Math.round((t.s + t.c * e) * 1e6) / 1e6, t);
  },
  Zn = function (e, t) {
    return t.set(t.t, t.p, !!(t.s + t.c * e), t);
  },
  Qn = function (e, t) {
    var n = t._pt,
      r = ``;
    if (!e && t.b) r = t.b;
    else if (e === 1 && t.e) r = t.e;
    else {
      for (; n;)
        ((r =
          n.p +
          (n.m ? n.m(n.s + n.c * e) : Math.round((n.s + n.c * e) * 1e4) / 1e4) +
          r),
          (n = n._next));
      r += t.c;
    }
    t.set(t.t, t.p, r, t);
  },
  $n = function (e, t) {
    for (var n = t._pt; n;) (n.r(e, n.d), (n = n._next));
  },
  er = function (e, t, n, r) {
    for (var i = this._pt, a; i;)
      ((a = i._next), i.p === r && i.modifier(e, t, n), (i = a));
  },
  tr = function (e) {
    for (var t = this._pt, n, r; t;)
      ((r = t._next),
        (t.p === e && !t.op) || t.op === e
          ? at(this, t, `_pt`)
          : t.dep || (n = 1),
        (t = r));
    return !n;
  },
  nr = function (e, t, n, r) {
    r.mSet(e, t, r.m.call(r.tween, n, r.mt), r);
  },
  rr = function (e) {
    for (var t = e._pt, n, r, i, a; t;) {
      for (n = t._next, r = i; r && r.pr > t.pr;) r = r._next;
      ((t._prev = r ? r._prev : a) ? (t._prev._next = t) : (i = t),
        (t._next = r) ? (r._prev = t) : (a = t),
        (t = n));
    }
    e._pt = i;
  },
  ir = (function () {
    function e(e, t, n, r, i, a, o, s, c) {
      ((this.t = t),
        (this.s = r),
        (this.c = i),
        (this.p = n),
        (this.r = a || Xn),
        (this.d = o || this),
        (this.set = s || Gn),
        (this.pr = c || 0),
        (this._next = e),
        e && (e._prev = this));
    }
    var t = e.prototype;
    return (
      (t.modifier = function (e, t, n) {
        ((this.mSet = this.mSet || this.set),
          (this.set = nr),
          (this.m = e),
          (this.mt = n),
          (this.tween = t));
      }),
      e
    );
  })();
(Ve(
  Le +
    `parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse`,
  function (e) {
    return (ke[e] = 1);
  },
),
  (ye.TweenMax = ye.TweenLite = Wn),
  (ye.TimelineLite = ye.TimelineMax = An),
  (H = new An({
    sortChildren: !1,
    defaults: O,
    autoRemoveChildren: !0,
    id: `root`,
    smoothChildTiming: !0,
  })),
  (D.stringFilter = pn));
var ar = [],
  or = {},
  sr = [],
  cr = 0,
  lr = 0,
  ur = function (e) {
    return (or[e] || sr).map(function (e) {
      return e();
    });
  },
  dr = function () {
    var e = Date.now(),
      t = [];
    e - cr > 2 &&
      (ur(`matchMediaInit`),
      ar.forEach(function (e) {
        var n = e.queries,
          r = e.conditions,
          i,
          a,
          o,
          s;
        for (a in n)
          ((i = U.matchMedia(n[a]).matches),
            i && (o = 1),
            i !== r[a] && ((r[a] = i), (s = 1)));
        s && (e.revert(), o && t.push(e));
      }),
      ur(`matchMediaRevert`),
      t.forEach(function (e) {
        return e.onMatch(e, function (t) {
          return e.add(null, t);
        });
      }),
      (cr = e),
      ur(`matchMedia`));
  },
  fr = (function () {
    function e(e, t) {
      ((this.selector = t && Lt(t)),
        (this.data = []),
        (this._r = []),
        (this.isReverted = !1),
        (this.id = lr++),
        e && this.add(e));
    }
    var t = e.prototype;
    return (
      (t.add = function (e, t, n) {
        L(e) && ((n = t), (t = e), (e = L));
        var r = this,
          i = function () {
            var e = j,
              i = r.selector,
              a;
            return (
              e && e !== r && e.data.push(r),
              n && (r.selector = Lt(n)),
              (j = r),
              (a = t.apply(r, arguments)),
              L(a) && r._r.push(a),
              (j = e),
              (r.selector = i),
              (r.isReverted = !1),
              a
            );
          };
        return (
          (r.last = i),
          e === L
            ? i(r, function (e) {
                return r.add(null, e);
              })
            : e
              ? (r[e] = i)
              : i
        );
      }),
      (t.ignore = function (e) {
        var t = j;
        ((j = null), e(this), (j = t));
      }),
      (t.getTweens = function () {
        var t = [];
        return (
          this.data.forEach(function (n) {
            return n instanceof e
              ? t.push.apply(t, n.getTweens())
              : n instanceof Wn &&
                  !(n.parent && n.parent.data === `nested`) &&
                  t.push(n);
          }),
          t
        );
      }),
      (t.clear = function () {
        this._r.length = this.data.length = 0;
      }),
      (t.kill = function (e, t) {
        var n = this;
        if (
          (e
            ? (function () {
                for (var t = n.getTweens(), r = n.data.length, i; r--;)
                  ((i = n.data[r]),
                    i.data === `isFlip` &&
                      (i.revert(),
                      i.getChildren(!0, !0, !1).forEach(function (e) {
                        return t.splice(t.indexOf(e), 1);
                      })));
                for (
                  t
                    .map(function (e) {
                      return {
                        g:
                          e._dur ||
                          e._delay ||
                          (e._sat && !e._sat.vars.immediateRender)
                            ? e.globalTime(0)
                            : -1 / 0,
                        t: e,
                      };
                    })
                    .sort(function (e, t) {
                      return t.g - e.g || -1 / 0;
                    })
                    .forEach(function (t) {
                      return t.t.revert(e);
                    }),
                    r = n.data.length;
                  r--;
                )
                  ((i = n.data[r]),
                    i instanceof An
                      ? i.data !== `nested` &&
                        (i.scrollTrigger && i.scrollTrigger.revert(), i.kill())
                      : !(i instanceof Wn) && i.revert && i.revert(e));
                (n._r.forEach(function (t) {
                  return t(e, n);
                }),
                  (n.isReverted = !0));
              })()
            : this.data.forEach(function (e) {
                return e.kill && e.kill();
              }),
          this.clear(),
          t)
        ) {
          for (var r = ar.length; r--;) ar[r].id === this.id && ar.splice(r, 1);
          (this._mqs &&
            this._mqs.forEach(function (e) {
              return e.removeListener
                ? e.removeListener(dr)
                : e.removeEventListener(`change`, dr);
            }),
            (this._mqs = null));
        }
      }),
      (t.revert = function (e) {
        this.kill(e || {});
      }),
      e
    );
  })(),
  pr = (function () {
    function e(e) {
      ((this.contexts = []), (this.scope = e), j && j.data.push(this));
    }
    var t = e.prototype;
    return (
      (t.add = function (e, t, n) {
        oe(e) || (e = { matches: e });
        var r = new fr(0, n || this.scope),
          i = (r.conditions = {}),
          a,
          o,
          s;
        for (o in (j && !r.selector && (r.selector = j.selector),
        this.contexts.push(r),
        (t = r.add(`onMatch`, t)),
        (r.queries = e),
        e))
          o === `all`
            ? (s = 1)
            : ((a = U.matchMedia(e[o])),
              a &&
                (ar.indexOf(r) < 0 && ar.push(r),
                (i[o] = a.matches) && (s = 1),
                a.addListener
                  ? a.addListener(dr)
                  : a.addEventListener(`change`, dr),
                (r._mqs ||= []).push(a)));
        return (
          s &&
            t(r, function (e) {
              return r.add(null, e);
            }),
          this
        );
      }),
      (t.revert = function (e) {
        this.kill(e || {});
      }),
      (t.kill = function (e) {
        this.contexts.forEach(function (t) {
          return t.kill(e, !0);
        });
      }),
      e
    );
  })(),
  mr = {
    registerPlugin: function () {
      [...arguments].forEach(function (e) {
        return rn(e);
      });
    },
    timeline: function (e) {
      return new An(e);
    },
    getTweensOf: function (e, t) {
      return H.getTweensOf(e, t);
    },
    getProperty: function (e, t, n, r) {
      I(e) && (e = It(e)[0]);
      var i = ze(e || {}).get,
        a = n ? Xe : Ye;
      return (
        n === `native` && (n = ``),
        e &&
          (t
            ? a(((Ne[t] && Ne[t].get) || i)(e, t, n, r))
            : function (t, n, r) {
                return a(((Ne[t] && Ne[t].get) || i)(e, t, n, r));
              })
      );
    },
    quickSetter: function (e, t, n) {
      if (((e = It(e)), e.length > 1)) {
        var r = e.map(function (e) {
            return vr.quickSetter(e, t, n);
          }),
          i = r.length;
        return function (e) {
          for (var t = i; t--;) r[t](e);
        };
      }
      e = e[0] || {};
      var a = Ne[t],
        o = ze(e),
        s = (o.harness && (o.harness.aliases || {})[t]) || t,
        c = a
          ? function (t) {
              var r = new a();
              ((tn._pt = 0),
                r.init(e, n ? t + n : t, tn, 0, [e]),
                r.render(1, r),
                tn._pt && $n(1, tn));
            }
          : o.set(e, s);
      return a
        ? c
        : function (t) {
            return c(e, s, n ? t + n : t, o, 1);
          };
    },
    quickTo: function (e, t, n) {
      var r,
        i = vr.to(
          e,
          Ze(
            ((r = {}), (r[t] = `+=0.1`), (r.paused = !0), (r.stagger = 0), r),
            n || {},
          ),
        ),
        a = function (e, n, r) {
          return i.resetTo(t, e, n, r);
        };
      return ((a.tween = i), a);
    },
    isTweening: function (e) {
      return H.getTweensOf(e, !0).length > 0;
    },
    defaults: function (e) {
      return (e && e.ease && (e.ease = Cn(e.ease, O.ease)), et(O, e || {}));
    },
    config: function (e) {
      return et(D, e || {});
    },
    registerEffect: function (e) {
      var t = e.name,
        n = e.effect,
        r = e.plugins,
        i = e.defaults,
        a = e.extendTimeline;
      ((r || ``).split(`,`).forEach(function (e) {
        return (
          e && !Ne[e] && !ye[e] && Ce(t + ` effect requires ` + e + ` plugin.`)
        );
      }),
        (Pe[t] = function (e, t, r) {
          return n(It(e), Ze(t || {}, i), r);
        }),
        a &&
          (An.prototype[t] = function (e, n, r) {
            return this.add(Pe[t](e, oe(n) ? n : (r = n) && {}, this), r);
          }));
    },
    registerEase: function (e, t) {
      G[e] = Cn(t);
    },
    parseEase: function (e, t) {
      return arguments.length ? Cn(e, t) : G;
    },
    getById: function (e) {
      return H.getById(e);
    },
    exportRoot: function (e, t) {
      e === void 0 && (e = {});
      var n = new An(e),
        r,
        i;
      for (
        n.smoothChildTiming = se(e.smoothChildTiming),
          H.remove(n),
          n._dp = 0,
          n._time = n._tTime = H._time,
          r = H._first;
        r;
      )
        ((i = r._next),
          (t ||
            !(
              !r._dur &&
              r instanceof Wn &&
              r.vars.onComplete === r._targets[0]
            )) &&
            _t(n, r, r._start - r._delay),
          (r = i));
      return (_t(H, n, 0), n);
    },
    context: function (e, t) {
      return e ? new fr(e, t) : j;
    },
    matchMedia: function (e) {
      return new pr(e);
    },
    matchMediaRefresh: function () {
      return (
        ar.forEach(function (e) {
          var t = e.conditions,
            n,
            r;
          for (r in t) t[r] && ((t[r] = !1), (n = 1));
          n && e.revert();
        }) || dr()
      );
    },
    addEventListener: function (e, t) {
      var n = or[e] || (or[e] = []);
      ~n.indexOf(t) || n.push(t);
    },
    removeEventListener: function (e, t) {
      var n = or[e],
        r = n && n.indexOf(t);
      r >= 0 && n.splice(r, 1);
    },
    utils: {
      wrap: qt,
      wrapYoyo: Jt,
      distribute: zt,
      random: Ht,
      snap: Vt,
      normalize: Gt,
      getUnit: jt,
      clamp: Mt,
      splitColor: cn,
      toArray: It,
      selector: Lt,
      mapRange: Xt,
      pipe: Ut,
      unitize: Wt,
      interpolate: Zt,
      shuffle: Rt,
    },
    install: W,
    effects: Pe,
    ticker: hn,
    updateRoot: An.updateRoot,
    plugins: Ne,
    globalTimeline: H,
    core: {
      PropTween: ir,
      globals: we,
      Tween: Wn,
      Timeline: An,
      Animation: kn,
      getCache: ze,
      _removeLinkedListItem: at,
      reverting: function () {
        return A;
      },
      context: function (e) {
        return (e && j && (j.data.push(e), (e._ctx = j)), j);
      },
      suppressOverwrites: function (e) {
        return (k = e);
      },
    },
  };
(Ve(`to,from,fromTo,delayedCall,set,killTweensOf`, function (e) {
  return (mr[e] = Wn[e]);
}),
  hn.add(An.updateRoot),
  (tn = mr.to({}, { duration: 0 })));
var hr = function (e, t) {
    for (var n = e._pt; n && n.p !== t && n.op !== t && n.fp !== t;)
      n = n._next;
    return n;
  },
  gr = function (e, t) {
    var n = e._targets,
      r,
      i,
      a;
    for (r in t)
      for (i = n.length; i--;)
        ((a = e._ptLookup[i][r]),
          (a &&= a.d) &&
            (a._pt && (a = hr(a, r)),
            a && a.modifier && a.modifier(t[r], e, n[i], r)));
  },
  _r = function (e, t) {
    return {
      name: e,
      headless: 1,
      rawVars: 1,
      init: function (e, n, r) {
        r._onInit = function (e) {
          var r, i;
          if (
            (I(n) &&
              ((r = {}),
              Ve(n, function (e) {
                return (r[e] = 1);
              }),
              (n = r)),
            t)
          ) {
            for (i in ((r = {}), n)) r[i] = t(n[i]);
            n = r;
          }
          gr(e, n);
        };
      },
    };
  },
  vr =
    mr.registerPlugin(
      {
        name: `attr`,
        init: function (e, t, n, r, i) {
          var a, o, s;
          for (a in ((this.tween = n), t))
            ((s = e.getAttribute(a) || ``),
              (o = this.add(
                e,
                `setAttribute`,
                (s || 0) + ``,
                t[a],
                r,
                i,
                0,
                0,
                a,
              )),
              (o.op = a),
              (o.b = s),
              this._props.push(a));
        },
        render: function (e, t) {
          for (var n = t._pt; n;)
            (A ? n.set(n.t, n.p, n.b, n) : n.r(e, n.d), (n = n._next));
        },
      },
      {
        name: `endArray`,
        headless: 1,
        init: function (e, t) {
          for (var n = t.length; n--;)
            this.add(e, n, e[n] || 0, t[n], 0, 0, 0, 0, 0, 1);
        },
      },
      _r(`roundProps`, Bt),
      _r(`modifiers`),
      _r(`snap`, Vt),
    ) || mr;
((Wn.version = An.version = vr.version = `3.15.1`),
  (xe = 1),
  ce() && gn(),
  G.Power0,
  G.Power1,
  G.Power2,
  G.Power3,
  G.Power4,
  G.Linear,
  G.Quad,
  G.Cubic,
  G.Quart,
  G.Quint,
  G.Strong,
  G.Elastic,
  G.Back,
  G.SteppedEase,
  G.Bounce,
  G.Sine,
  G.Expo,
  G.Circ);
var yr,
  br,
  xr,
  Sr,
  Cr,
  wr,
  Tr,
  Er = function () {
    return typeof window < `u`;
  },
  Dr = {},
  Or = 180 / Math.PI,
  kr = Math.PI / 180,
  Ar = Math.atan2,
  jr = 1e8,
  Mr = /([A-Z])/g,
  Nr = /(left|right|width|margin|padding|x)/i,
  Pr = /[\s,\(]\S/,
  Fr = {
    autoAlpha: `opacity,visibility`,
    scale: `scaleX,scaleY`,
    alpha: `opacity`,
  },
  Ir = function (e, t) {
    return t.set(t.t, t.p, Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u, t);
  },
  Lr = function (e, t) {
    return t.set(
      t.t,
      t.p,
      e === 1 ? t.e : Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u,
      t,
    );
  },
  Rr = function (e, t) {
    return t.set(
      t.t,
      t.p,
      e ? Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u : t.b,
      t,
    );
  },
  zr = function (e, t) {
    return t.set(
      t.t,
      t.p,
      e === 1 ? t.e : e ? Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u : t.b,
      t,
    );
  },
  Br = function (e, t) {
    var n = t.s + t.c * e;
    t.set(t.t, t.p, ~~(n + (n < 0 ? -0.5 : 0.5)) + t.u, t);
  },
  Vr = function (e, t) {
    return t.set(t.t, t.p, e ? t.e : t.b, t);
  },
  Hr = function (e, t) {
    return t.set(t.t, t.p, e === 1 ? t.e : t.b, t);
  },
  Ur = function (e, t, n) {
    return (e.style[t] = n);
  },
  Wr = function (e, t, n) {
    return e.style.setProperty(t, n);
  },
  Gr = function (e, t, n) {
    return (e._gsap[t] = n);
  },
  Kr = function (e, t, n) {
    return (e._gsap.scaleX = e._gsap.scaleY = n);
  },
  qr = function (e, t, n, r, i) {
    var a = e._gsap;
    ((a.scaleX = a.scaleY = n), a.renderTransform(i, a));
  },
  Jr = function (e, t, n, r, i) {
    var a = e._gsap;
    ((a[t] = n), a.renderTransform(i, a));
  },
  Yr = `transform`,
  Xr = Yr + `Origin`,
  Zr = function e(t, n) {
    var r = this,
      i = this.target,
      a = i.style,
      o = i._gsap;
    if (t in Dr && a) {
      if (((this.tfm = this.tfm || {}), t !== `transform`))
        ((t = Fr[t] || t),
          ~t.indexOf(`,`)
            ? t.split(`,`).forEach(function (e) {
                return (r.tfm[e] = gi(i, e));
              })
            : (this.tfm[t] = o.x ? o[t] : gi(i, t)),
          t === Xr && (this.tfm.zOrigin = o.zOrigin));
      else
        return Fr.transform.split(`,`).forEach(function (t) {
          return e.call(r, t, n);
        });
      if (this.props.indexOf(Yr) >= 0) return;
      (o.svg &&
        ((this.svgo = i.getAttribute(`data-svg-origin`)),
        this.props.push(Xr, n, ``)),
        (t = Yr));
    }
    (a || n) && this.props.push(t, n, a[t]);
  },
  Qr = function (e) {
    e.translate &&
      (e.removeProperty(`translate`),
      e.removeProperty(`scale`),
      e.removeProperty(`rotate`));
  },
  $r = function () {
    for (
      var e = this.props, t = this.target, n = t.style, r = t._gsap, i = 0, a;
      i < e.length;
      i += 3
    )
      e[i + 1]
        ? e[i + 1] === 2
          ? t[e[i]](e[i + 2])
          : (t[e[i]] = e[i + 2])
        : e[i + 2]
          ? (n[e[i]] = e[i + 2])
          : n.removeProperty(
              e[i].substr(0, 2) === `--`
                ? e[i]
                : e[i].replace(Mr, `-$1`).toLowerCase(),
            );
    if (this.tfm) {
      for (a in this.tfm) r[a] = this.tfm[a];
      (r.svg &&
        (r.renderTransform(),
        t.setAttribute(`data-svg-origin`, this.svgo || ``)),
        (i = Tr()),
        (i && i.isStart) ||
          n[Yr] ||
          (Qr(n),
          r.zOrigin &&
            n[Xr] &&
            ((n[Xr] += ` ` + r.zOrigin + `px`),
            (r.zOrigin = 0),
            r.renderTransform()),
          (r.uncache = 1)));
    }
  },
  ei = function (e, t) {
    var n = { target: e, props: [], revert: $r, save: Zr };
    return (
      e._gsap || vr.core.getCache(e),
      t &&
        e.style &&
        e.nodeType &&
        t.split(`,`).forEach(function (e) {
          return n.save(e);
        }),
      n
    );
  },
  ti,
  ni = function (e, t) {
    var n = br.createElementNS
      ? br.createElementNS(
          (t || `http://www.w3.org/1999/xhtml`).replace(/^https/, `http`),
          e,
        )
      : br.createElement(e);
    return n && n.style ? n : br.createElement(e);
  },
  ri = function e(t, n, r) {
    var i = getComputedStyle(t);
    return (
      i[n] ||
      i.getPropertyValue(n.replace(Mr, `-$1`).toLowerCase()) ||
      i.getPropertyValue(n) ||
      (!r && e(t, ai(n) || n, 1)) ||
      ``
    );
  },
  ii = `O,Moz,ms,Ms,Webkit`.split(`,`),
  ai = function (e, t, n) {
    var r = (t || Cr).style,
      i = 5;
    if (e in r && !n) return e;
    for (
      e = e.charAt(0).toUpperCase() + e.substr(1);
      i-- && !(ii[i] + e in r);
    );
    return i < 0 ? null : (i === 3 ? `ms` : i >= 0 ? ii[i] : ``) + e;
  },
  oi = function () {
    Er() &&
      window.document &&
      ((yr = window),
      (br = yr.document),
      (xr = br.documentElement),
      (Cr = ni(`div`) || { style: {} }),
      ni(`div`),
      (Yr = ai(Yr)),
      (Xr = Yr + `Origin`),
      (Cr.style.cssText = `border-width:0;line-height:0;position:absolute;padding:0`),
      (ti = !!ai(`perspective`)),
      (Tr = vr.core.reverting),
      (Sr = 1));
  },
  si = function (e) {
    var t = e.ownerSVGElement,
      n = ni(
        `svg`,
        (t && t.getAttribute(`xmlns`)) || `http://www.w3.org/2000/svg`,
      ),
      r = e.cloneNode(!0),
      i;
    ((r.style.display = `block`), n.appendChild(r), xr.appendChild(n));
    try {
      i = r.getBBox();
    } catch {}
    return (n.removeChild(r), xr.removeChild(n), i);
  },
  ci = function (e, t) {
    for (var n = t.length; n--;)
      if (e.hasAttribute(t[n])) return e.getAttribute(t[n]);
  },
  li = function (e) {
    var t, n;
    try {
      t = e.getBBox();
    } catch {
      ((t = si(e)), (n = 1));
    }
    return (
      (t && (t.width || t.height)) || n || (t = si(e)),
      t && !t.width && !t.x && !t.y
        ? {
            x: +ci(e, [`x`, `cx`, `x1`]) || 0,
            y: +ci(e, [`y`, `cy`, `y1`]) || 0,
            width: 0,
            height: 0,
          }
        : t
    );
  },
  ui = function (e) {
    return !(!e.getCTM || (e.parentNode && !e.ownerSVGElement) || !li(e));
  },
  di = function (e, t) {
    if (t) {
      var n = e.style,
        r;
      (t in Dr && t !== Xr && (t = Yr),
        n.removeProperty
          ? ((r = t.substr(0, 2)),
            (r === `ms` || t.substr(0, 6) === `webkit`) && (t = `-` + t),
            n.removeProperty(
              r === `--` ? t : t.replace(Mr, `-$1`).toLowerCase(),
            ))
          : n.removeAttribute(t));
    }
  },
  fi = function (e, t, n, r, i, a) {
    var o = new ir(e._pt, t, n, 0, 1, a ? Hr : Vr);
    return ((e._pt = o), (o.b = r), (o.e = i), e._props.push(n), o);
  },
  pi = { deg: 1, rad: 1, turn: 1 },
  mi = { grid: 1, flex: 1 },
  hi = function e(t, n, r, i) {
    var a = parseFloat(r) || 0,
      o = (r + ``).trim().substr((a + ``).length) || `px`,
      s = Cr.style,
      c = Nr.test(n),
      l = t.tagName.toLowerCase() === `svg`,
      u = (l ? `client` : `offset`) + (c ? `Width` : `Height`),
      d = 100,
      f = i === `px`,
      p = i === `%`,
      m,
      h,
      g,
      _;
    if (i === o || !a || pi[i] || pi[o]) return a;
    if (
      (o !== `px` && !f && (a = e(t, n, r, `px`)),
      (_ = t.getCTM && ui(t)),
      (p || o === `%`) && (Dr[n] || ~n.indexOf(`adius`)))
    )
      return (
        (m = _ ? t.getBBox()[c ? `width` : `height`] : t[u]),
        He(p ? (a / m) * d : (a / 100) * m)
      );
    if (
      ((s[c ? `width` : `height`] = d + (f ? o : i)),
      (h =
        (i !== `rem` && ~n.indexOf(`adius`)) ||
        (i === `em` && t.appendChild && !l)
          ? t
          : t.parentNode),
      _ && (h = (t.ownerSVGElement || {}).parentNode),
      (h && h !== br && h.appendChild) || (h = br.body),
      (g = h._gsap),
      g && p && g.width && c && g.time === hn.time && !g.uncache)
    )
      return He((a / g.width) * d);
    if (p && (n === `height` || n === `width`)) {
      var v = t.style[n];
      ((t.style[n] = d + i), (m = t[u]), v ? (t.style[n] = v) : di(t, n));
    } else
      ((p || o === `%`) &&
        !mi[ri(h, `display`)] &&
        (s.position = ri(t, `position`)),
        h === t && (s.position = `static`),
        h.appendChild(Cr),
        (m = Cr[u]),
        h.removeChild(Cr),
        (s.position = `absolute`));
    return (
      c && p && ((g = ze(h)), (g.time = hn.time), (g.width = h[u])),
      He(f ? (m * a) / d : m && a ? (d / m) * a : 0)
    );
  },
  gi = function (e, t, n, r) {
    var i;
    return (
      Sr || oi(),
      t in Fr &&
        t !== `transform` &&
        ((t = Fr[t]), ~t.indexOf(`,`) && (t = t.split(`,`)[0])),
      Dr[t] && t !== `transform`
        ? ((i = Oi(e, r)),
          (i =
            t === `transformOrigin`
              ? i.svg
                ? i.origin
                : ki(ri(e, Xr)) + ` ` + i.zOrigin + `px`
              : i[t]))
        : ((i = e.style[t]),
          (!i || i === `auto` || r || ~(i + ``).indexOf(`calc(`)) &&
            (i =
              (xi[t] && xi[t](e, t, n)) ||
              ri(e, t) ||
              Be(e, t) ||
              +(t === `opacity`))),
      n && !~(i + ``).trim().indexOf(` `) ? hi(e, t, i, n) + n : i
    );
  },
  _i = function (e, t, n, r) {
    if (!n || n === `none`) {
      var i = ai(t, e, 1),
        a = i && ri(e, i, 1);
      a && a !== n
        ? ((t = i), (n = a))
        : t === `borderColor` && (n = ri(e, `borderTopColor`));
    }
    var o = new ir(this._pt, e.style, t, 0, 1, Qn),
      s = 0,
      c = 0,
      l,
      u,
      d,
      f,
      p,
      m,
      h,
      g,
      _,
      v,
      y,
      b;
    if (
      ((o.b = n),
      (o.e = r),
      (n += ``),
      (r += ``),
      r.substring(0, 6) === `var(--` &&
        (r = ri(e, r.substring(4, r.indexOf(`)`)))),
      r === `auto` &&
        ((m = e.style[t]),
        (e.style[t] = r),
        (r = ri(e, t) || r),
        m ? (e.style[t] = m) : di(e, t)),
      (l = [n, r]),
      pn(l),
      (n = l[0]),
      (r = l[1]),
      (d = n.match(fe) || []),
      (b = r.match(fe) || []),
      b.length)
    ) {
      for (; (u = fe.exec(r));)
        ((h = u[0]),
          (_ = r.substring(s, u.index)),
          p
            ? (p = (p + 1) % 5)
            : (_.substr(-5) === `rgba(` || _.substr(-5) === `hsla(`) && (p = 1),
          h !== (m = d[c++] || ``) &&
            ((f = parseFloat(m) || 0),
            (y = m.substr((f + ``).length)),
            h.charAt(1) === `=` && (h = We(f, h) + y),
            (g = parseFloat(h)),
            (v = h.substr((g + ``).length)),
            (s = fe.lastIndex - v.length),
            v ||
              ((v = v || D.units[t] || y),
              s === r.length && ((r += v), (o.e += v))),
            y !== v && (f = hi(e, t, m, v) || 0),
            (o._pt = {
              _next: o._pt,
              p: _ || c === 1 ? _ : `,`,
              s: f,
              c: g - f,
              m: (p && p < 4) || t === `zIndex` ? Math.round : 0,
            })));
      o.c = s < r.length ? r.substring(s, r.length) : ``;
    } else o.r = t === `display` && r === `none` ? Hr : Vr;
    return (me.test(r) && (o.e = 0), (this._pt = o), o);
  },
  vi = { top: `0%`, bottom: `100%`, left: `0%`, right: `100%`, center: `50%` },
  yi = function (e) {
    var t = e.split(` `),
      n = t[0],
      r = t[1] || `50%`;
    return (
      (n === `top` || n === `bottom` || r === `left` || r === `right`) &&
        ((e = n), (n = r), (r = e)),
      (t[0] = vi[n] || n),
      (t[1] = vi[r] || r),
      t.join(` `)
    );
  },
  bi = function (e, t) {
    if (t.tween && t.tween._time === t.tween._dur) {
      var n = t.t,
        r = n.style,
        i = t.u,
        a = n._gsap,
        o,
        s,
        c;
      if (i === `all` || i === !0) ((r.cssText = ``), (s = 1));
      else
        for (i = i.split(`,`), c = i.length; --c > -1;)
          ((o = i[c]),
            Dr[o] && ((s = 1), (o = o === `transformOrigin` ? Xr : Yr)),
            di(n, o));
      s &&
        (di(n, Yr),
        a &&
          (a.svg && n.removeAttribute(`transform`),
          (r.scale = r.rotate = r.translate = `none`),
          Oi(n, 1),
          (a.uncache = 1),
          Qr(r)));
    }
  },
  xi = {
    clearProps: function (e, t, n, r, i) {
      if (i.data !== `isFromStart`) {
        var a = (e._pt = new ir(e._pt, t, n, 0, 0, bi));
        return ((a.u = r), (a.pr = -10), (a.tween = i), e._props.push(n), 1);
      }
    },
  },
  Si = [1, 0, 0, 1, 0, 0],
  Ci = {},
  wi = function (e) {
    return e === `matrix(1, 0, 0, 1, 0, 0)` || e === `none` || !e;
  },
  Ti = function (e) {
    var t = ri(e, Yr);
    return wi(t) ? Si : t.substr(7).match(de).map(He);
  },
  Ei = function (e, t) {
    var n = e._gsap || ze(e),
      r = e.style,
      i = Ti(e),
      a,
      o,
      s,
      c;
    return n.svg && e.getAttribute(`transform`)
      ? ((s = e.transform.baseVal.consolidate().matrix),
        (i = [s.a, s.b, s.c, s.d, s.e, s.f]),
        i.join(`,`) === `1,0,0,1,0,0` ? Si : i)
      : (i === Si &&
          !e.offsetParent &&
          e !== xr &&
          !n.svg &&
          ((s = r.display),
          (r.display = `block`),
          (a = e.parentNode),
          (a && (e.offsetParent || e.getBoundingClientRect().width)) ||
            ((c = 1), (o = e.nextElementSibling), xr.appendChild(e)),
          (i = Ti(e)),
          s ? (r.display = s) : di(e, `display`),
          c &&
            (o
              ? a.insertBefore(e, o)
              : a
                ? a.appendChild(e)
                : xr.removeChild(e))),
        t && i.length > 6 ? [i[0], i[1], i[4], i[5], i[12], i[13]] : i);
  },
  Di = function (e, t, n, r, i, a) {
    var o = e._gsap,
      s = i || Ei(e, !0),
      c = o.xOrigin || 0,
      l = o.yOrigin || 0,
      u = o.xOffset || 0,
      d = o.yOffset || 0,
      f = s[0],
      p = s[1],
      m = s[2],
      h = s[3],
      g = s[4],
      _ = s[5],
      v = t.split(` `),
      y = parseFloat(v[0]) || 0,
      b = parseFloat(v[1]) || 0,
      x,
      S,
      C,
      w;
    (n
      ? s !== Si &&
        (S = f * h - p * m) &&
        ((C = (h / S) * y + b * (-m / S) + (m * _ - h * g) / S),
        (w = y * (-p / S) + (f / S) * b - (f * _ - p * g) / S),
        (y = C),
        (b = w))
      : ((x = li(e)),
        (y = x.x + (~v[0].indexOf(`%`) ? (y / 100) * x.width : y)),
        (b = x.y + (~(v[1] || v[0]).indexOf(`%`) ? (b / 100) * x.height : b))),
      r || (r !== !1 && o.smooth)
        ? ((g = y - c),
          (_ = b - l),
          (o.xOffset = u + (g * f + _ * m) - g),
          (o.yOffset = d + (g * p + _ * h) - _))
        : (o.xOffset = o.yOffset = 0),
      (o.xOrigin = y),
      (o.yOrigin = b),
      (o.smooth = !!r),
      (o.origin = t),
      (o.originIsAbsolute = !!n),
      (e.style[Xr] = `0px 0px`),
      a &&
        (fi(a, o, `xOrigin`, c, y),
        fi(a, o, `yOrigin`, l, b),
        fi(a, o, `xOffset`, u, o.xOffset),
        fi(a, o, `yOffset`, d, o.yOffset)),
      e.setAttribute(`data-svg-origin`, y + ` ` + b));
  },
  Oi = function (e, t) {
    var n = e._gsap || new On(e);
    if (`x` in n && !t && !n.uncache) return n;
    var r = e.style,
      i = n.scaleX < 0,
      a = `px`,
      o = `deg`,
      s = getComputedStyle(e),
      c = ri(e, Xr) || `0`,
      l = (u = d = m = h = g = _ = v = y = 0),
      u,
      d,
      f = (p = 1),
      p,
      m,
      h,
      g,
      _,
      v,
      y,
      b,
      x,
      S,
      C,
      w,
      T,
      E,
      O,
      k,
      A,
      j,
      M,
      N,
      P,
      F,
      ee,
      te,
      ne,
      re,
      I,
      L;
    return (
      (n.svg = !!(e.getCTM && ui(e))),
      s.translate &&
        ((s.translate !== `none` ||
          s.scale !== `none` ||
          s.rotate !== `none`) &&
          (r[Yr] =
            (s.translate === `none`
              ? ``
              : `translate3d(` +
                (s.translate + ` 0 0`).split(` `).slice(0, 3).join(`, `) +
                `) `) +
            (s.rotate === `none` ? `` : `rotate(` + s.rotate + `) `) +
            (s.scale === `none`
              ? ``
              : `scale(` + s.scale.split(` `).join(`,`) + `) `) +
            (s[Yr] === `none` ? `` : s[Yr])),
        (r.scale = r.rotate = r.translate = `none`)),
      (S = Ei(e, n.svg)),
      n.svg &&
        (n.uncache
          ? ((P = e.getBBox()),
            (c = n.xOrigin - P.x + `px ` + (n.yOrigin - P.y) + `px`),
            (N = ``))
          : (N = !t && e.getAttribute(`data-svg-origin`)),
        Di(e, N || c, !!N || n.originIsAbsolute, n.smooth !== !1, S)),
      (b = n.xOrigin || 0),
      (x = n.yOrigin || 0),
      S !== Si &&
        ((E = S[0]),
        (O = S[1]),
        (k = S[2]),
        (A = S[3]),
        (l = j = S[4]),
        (u = M = S[5]),
        S.length === 6
          ? ((f = Math.sqrt(E * E + O * O)),
            (p = Math.sqrt(A * A + k * k)),
            (m = E || O ? Ar(O, E) * Or : 0),
            (_ = k || A ? Ar(k, A) * Or + m : 0),
            _ && (p *= Math.abs(Math.cos(_ * kr))),
            n.svg && ((l -= b - (b * E + x * k)), (u -= x - (b * O + x * A))))
          : ((L = S[6]),
            (re = S[7]),
            (ee = S[8]),
            (te = S[9]),
            (ne = S[10]),
            (I = S[11]),
            (l = S[12]),
            (u = S[13]),
            (d = S[14]),
            (C = Ar(L, ne)),
            (h = C * Or),
            C &&
              ((w = Math.cos(-C)),
              (T = Math.sin(-C)),
              (N = j * w + ee * T),
              (P = M * w + te * T),
              (F = L * w + ne * T),
              (ee = j * -T + ee * w),
              (te = M * -T + te * w),
              (ne = L * -T + ne * w),
              (I = re * -T + I * w),
              (j = N),
              (M = P),
              (L = F)),
            (C = Ar(-k, ne)),
            (g = C * Or),
            C &&
              ((w = Math.cos(-C)),
              (T = Math.sin(-C)),
              (N = E * w - ee * T),
              (P = O * w - te * T),
              (F = k * w - ne * T),
              (I = A * T + I * w),
              (E = N),
              (O = P),
              (k = F)),
            (C = Ar(O, E)),
            (m = C * Or),
            C &&
              ((w = Math.cos(C)),
              (T = Math.sin(C)),
              (N = E * w + O * T),
              (P = j * w + M * T),
              (O = O * w - E * T),
              (M = M * w - j * T),
              (E = N),
              (j = P)),
            h &&
              Math.abs(h) + Math.abs(m) > 359.9 &&
              ((h = m = 0), (g = 180 - g)),
            (f = He(Math.sqrt(E * E + O * O + k * k))),
            (p = He(Math.sqrt(M * M + L * L))),
            (C = Ar(j, M)),
            (_ = Math.abs(C) > 2e-4 ? C * Or : 0),
            (y = I ? 1 / (I < 0 ? -I : I) : 0)),
        n.svg &&
          ((N = e.getAttribute(`transform`)),
          (n.forceCSS = e.setAttribute(`transform`, ``) || !wi(ri(e, Yr))),
          N && e.setAttribute(`transform`, N))),
      Math.abs(_) > 90 &&
        Math.abs(_) < 270 &&
        (i
          ? ((f *= -1), (_ += m <= 0 ? 180 : -180), (m += m <= 0 ? 180 : -180))
          : ((p *= -1), (_ += _ <= 0 ? 180 : -180))),
      (t ||= n.uncache),
      (n.x =
        l -
        ((n.xPercent =
          l &&
          ((!t && n.xPercent) ||
            (Math.round(e.offsetWidth / 2) === Math.round(-l) ? -50 : 0)))
          ? (e.offsetWidth * n.xPercent) / 100
          : 0) +
        a),
      (n.y =
        u -
        ((n.yPercent =
          u &&
          ((!t && n.yPercent) ||
            (Math.round(e.offsetHeight / 2) === Math.round(-u) ? -50 : 0)))
          ? (e.offsetHeight * n.yPercent) / 100
          : 0) +
        a),
      (n.z = d + a),
      (n.scaleX = He(f)),
      (n.scaleY = He(p)),
      (n.rotation = He(m) + o),
      (n.rotationX = He(h) + o),
      (n.rotationY = He(g) + o),
      (n.skewX = _ + o),
      (n.skewY = v + o),
      (n.transformPerspective = y + a),
      (n.zOrigin = parseFloat(c.split(` `)[2]) || (!t && n.zOrigin) || 0) &&
        (r[Xr] = ki(c)),
      (n.xOffset = n.yOffset = 0),
      (n.force3D = D.force3D),
      (n.renderTransform = n.svg ? Ii : ti ? Fi : ji),
      (n.uncache = 0),
      n
    );
  },
  ki = function (e) {
    return (e = e.split(` `))[0] + ` ` + e[1];
  },
  Ai = function (e, t, n) {
    var r = jt(t);
    return He(parseFloat(t) + parseFloat(hi(e, `x`, n + `px`, r))) + r;
  },
  ji = function (e, t) {
    ((t.z = `0px`),
      (t.rotationY = t.rotationX = `0deg`),
      (t.force3D = 0),
      Fi(e, t));
  },
  Mi = `0deg`,
  Ni = `0px`,
  Pi = `) `,
  Fi = function (e, t) {
    var n = t || this,
      r = n.xPercent,
      i = n.yPercent,
      a = n.x,
      o = n.y,
      s = n.z,
      c = n.rotation,
      l = n.rotationY,
      u = n.rotationX,
      d = n.skewX,
      f = n.skewY,
      p = n.scaleX,
      m = n.scaleY,
      h = n.transformPerspective,
      g = n.force3D,
      _ = n.target,
      v = n.zOrigin,
      y = ``,
      b = (g === `auto` && e && e !== 1) || g === !0;
    if (v && (u !== Mi || l !== Mi)) {
      var x = parseFloat(l) * kr,
        S = Math.sin(x),
        C = Math.cos(x),
        w;
      ((x = parseFloat(u) * kr),
        (w = Math.cos(x)),
        (a = Ai(_, a, S * w * -v)),
        (o = Ai(_, o, -Math.sin(x) * -v)),
        (s = Ai(_, s, C * w * -v + v)));
    }
    (h !== Ni && (y += `perspective(` + h + Pi),
      (r || i) && (y += `translate(` + r + `%, ` + i + `%) `),
      (b || a !== Ni || o !== Ni || s !== Ni) &&
        (y +=
          s !== Ni || b
            ? `translate3d(` + a + `, ` + o + `, ` + s + `) `
            : `translate(` + a + `, ` + o + Pi),
      c !== Mi && (y += `rotate(` + c + Pi),
      l !== Mi && (y += `rotateY(` + l + Pi),
      u !== Mi && (y += `rotateX(` + u + Pi),
      (d !== Mi || f !== Mi) && (y += `skew(` + d + `, ` + f + Pi),
      (p !== 1 || m !== 1) && (y += `scale(` + p + `, ` + m + Pi),
      (_.style[Yr] = y || `translate(0, 0)`));
  },
  Ii = function (e, t) {
    var n = t || this,
      r = n.xPercent,
      i = n.yPercent,
      a = n.x,
      o = n.y,
      s = n.rotation,
      c = n.skewX,
      l = n.skewY,
      u = n.scaleX,
      d = n.scaleY,
      f = n.target,
      p = n.xOrigin,
      m = n.yOrigin,
      h = n.xOffset,
      g = n.yOffset,
      _ = n.forceCSS,
      v = parseFloat(a),
      y = parseFloat(o),
      b,
      x,
      S,
      C,
      w;
    ((s = parseFloat(s)),
      (c = parseFloat(c)),
      (l = parseFloat(l)),
      l && ((l = parseFloat(l)), (c += l), (s += l)),
      s || c
        ? ((s *= kr),
          (c *= kr),
          (b = Math.cos(s) * u),
          (x = Math.sin(s) * u),
          (S = Math.sin(s - c) * -d),
          (C = Math.cos(s - c) * d),
          c &&
            ((l *= kr),
            (w = Math.tan(c - l)),
            (w = Math.sqrt(1 + w * w)),
            (S *= w),
            (C *= w),
            l &&
              ((w = Math.tan(l)),
              (w = Math.sqrt(1 + w * w)),
              (b *= w),
              (x *= w))),
          (b = He(b)),
          (x = He(x)),
          (S = He(S)),
          (C = He(C)))
        : ((b = u), (C = d), (x = S = 0)),
      ((v && !~(a + ``).indexOf(`px`)) || (y && !~(o + ``).indexOf(`px`))) &&
        ((v = hi(f, `x`, a, `px`)), (y = hi(f, `y`, o, `px`))),
      (p || m || h || g) &&
        ((v = He(v + p - (p * b + m * S) + h)),
        (y = He(y + m - (p * x + m * C) + g))),
      (r || i) &&
        ((w = f.getBBox()),
        (v = He(v + (r / 100) * w.width)),
        (y = He(y + (i / 100) * w.height))),
      (w =
        `matrix(` + b + `,` + x + `,` + S + `,` + C + `,` + v + `,` + y + `)`),
      f.setAttribute(`transform`, w),
      _ && (f.style[Yr] = w));
  },
  Li = function (e, t, n, r, i) {
    var a = 360,
      o = I(i),
      s = parseFloat(i) * (o && ~i.indexOf(`rad`) ? Or : 1) - r,
      c = r + s + `deg`,
      l,
      u;
    return (
      o &&
        ((l = i.split(`_`)[1]),
        l === `short` && ((s %= a), s !== s % (a / 2) && (s += s < 0 ? a : -a)),
        l === `cw` && s < 0
          ? (s = ((s + a * jr) % a) - ~~(s / a) * a)
          : l === `ccw` && s > 0 && (s = ((s - a * jr) % a) - ~~(s / a) * a)),
      (e._pt = u = new ir(e._pt, t, n, r, s, Lr)),
      (u.e = c),
      (u.u = `deg`),
      e._props.push(n),
      u
    );
  },
  Ri = function (e, t) {
    for (var n in t) e[n] = t[n];
    return e;
  },
  zi = function (e, t, n) {
    var r = Ri({}, n._gsap),
      i = `perspective,force3D,transformOrigin,svgOrigin`,
      a = n.style,
      o,
      s,
      c,
      l,
      u,
      d,
      f,
      p;
    for (s in (r.svg
      ? ((c = n.getAttribute(`transform`)),
        n.setAttribute(`transform`, ``),
        (a[Yr] = t),
        (o = Oi(n, 1)),
        di(n, Yr),
        n.setAttribute(`transform`, c))
      : ((c = getComputedStyle(n)[Yr]),
        (a[Yr] = t),
        (o = Oi(n, 1)),
        (a[Yr] = c)),
    Dr))
      ((c = r[s]),
        (l = o[s]),
        c !== l &&
          i.indexOf(s) < 0 &&
          ((f = jt(c)),
          (p = jt(l)),
          (u = f === p ? parseFloat(c) : hi(n, s, c, p)),
          (d = parseFloat(l)),
          (e._pt = new ir(e._pt, o, s, u, d - u, Ir)),
          (e._pt.u = p || 0),
          e._props.push(s)));
    Ri(o, r);
  };
Ve(`padding,margin,Width,Radius`, function (e, t) {
  var n = `Top`,
    r = `Right`,
    i = `Bottom`,
    a = `Left`,
    o = (t < 3 ? [n, r, i, a] : [n + a, n + r, i + r, i + a]).map(function (n) {
      return t < 2 ? e + n : `border` + n + e;
    });
  xi[t > 1 ? `border` + e : e] = function (e, t, n, r, i) {
    var a, s;
    if (arguments.length < 4)
      return (
        (a = o.map(function (t) {
          return gi(e, t, n);
        })),
        (s = a.join(` `)),
        s.split(a[0]).length === 5 ? a[0] : s
      );
    ((a = (r + ``).split(` `)),
      (s = {}),
      o.forEach(function (e, t) {
        return (s[e] = a[t] = a[t] || a[((t - 1) / 2) | 0]);
      }),
      e.init(t, s, i));
  };
});
var Bi = {
  name: `css`,
  register: oi,
  targetTest: function (e) {
    return e.style && e.nodeType;
  },
  init: function (e, t, n, r, i) {
    var a = this._props,
      o = e.style,
      s = n.vars.startAt,
      c,
      l,
      u,
      d,
      f,
      p,
      m,
      h,
      g,
      _,
      v,
      y,
      b,
      x,
      S,
      C,
      w;
    for (m in (Sr || oi(),
    (this.styles = this.styles || ei(e)),
    (C = this.styles.props),
    (this.tween = n),
    t))
      if (m !== `autoRound` && ((l = t[m]), !(Ne[m] && Pn(m, t, n, r, e, i)))) {
        if (
          ((f = typeof l),
          (p = xi[m]),
          f === `function` && ((l = l.call(n, r, e, i)), (f = typeof l)),
          f === `string` && ~l.indexOf(`random(`) && (l = Yt(l)),
          p)
        )
          p(this, e, m, l, n) && (S = 1);
        else if (m.substr(0, 2) === `--`)
          ((c = (getComputedStyle(e).getPropertyValue(m) + ``).trim()),
            (l += ``),
            (dn.lastIndex = 0),
            dn.test(c) ||
              ((h = jt(c)),
              (g = jt(l)),
              g ? h !== g && (c = hi(e, m, c, g) + g) : h && (l += h)),
            this.add(o, `setProperty`, c, l, r, i, 0, 0, m),
            a.push(m),
            C.push(m, 0, o[m]));
        else if (f !== `undefined`) {
          if (
            (s && m in s
              ? ((c = typeof s[m] == `function` ? s[m].call(n, r, e, i) : s[m]),
                I(c) && ~c.indexOf(`random(`) && (c = Yt(c)),
                jt(c + ``) ||
                  c === `auto` ||
                  (c += D.units[m] || jt(gi(e, m)) || ``),
                (c + ``).charAt(1) === `=` && (c = gi(e, m)))
              : (c = gi(e, m)),
            (d = parseFloat(c)),
            (_ = f === `string` && l.charAt(1) === `=` && l.substr(0, 2)),
            _ && (l = l.substr(2)),
            (u = parseFloat(l)),
            m in Fr &&
              (m === `autoAlpha` &&
                (d === 1 && gi(e, `visibility`) === `hidden` && u && (d = 0),
                C.push(`visibility`, 0, o.visibility),
                fi(
                  this,
                  o,
                  `visibility`,
                  d ? `inherit` : `hidden`,
                  u ? `inherit` : `hidden`,
                  !u,
                )),
              m !== `scale` &&
                m !== `transform` &&
                ((m = Fr[m]), ~m.indexOf(`,`) && (m = m.split(`,`)[0]))),
            (v = m in Dr),
            v)
          ) {
            if (
              (this.styles.save(m),
              (w = l),
              f === `string` && l.substring(0, 6) === `var(--`)
            ) {
              if (
                ((l = ri(e, l.substring(4, l.indexOf(`)`)))),
                l.substring(0, 5) === `calc(`)
              ) {
                var T = e.style.perspective;
                ((e.style.perspective = l),
                  (l = ri(e, `perspective`)),
                  T ? (e.style.perspective = T) : di(e, `perspective`));
              }
              u = parseFloat(l);
            }
            if (
              (y ||
                ((b = e._gsap),
                (b.renderTransform && !t.parseTransform) ||
                  Oi(e, t.parseTransform),
                (x = t.smoothOrigin !== !1 && b.smooth),
                (y = this._pt =
                  new ir(this._pt, o, Yr, 0, 1, b.renderTransform, b, 0, -1)),
                (y.dep = 1)),
              m === `scale`)
            )
              ((this._pt = new ir(
                this._pt,
                b,
                `scaleY`,
                b.scaleY,
                (_ ? We(b.scaleY, _ + u) : u) - b.scaleY || 0,
                Ir,
              )),
                (this._pt.u = 0),
                a.push(`scaleY`, m),
                (m += `X`));
            else if (m === `transformOrigin`) {
              (C.push(Xr, 0, o[Xr]),
                (l = yi(l)),
                b.svg
                  ? Di(e, l, 0, x, 0, this)
                  : ((g = parseFloat(l.split(` `)[2]) || 0),
                    g !== b.zOrigin && fi(this, b, `zOrigin`, b.zOrigin, g),
                    fi(this, o, m, ki(c), ki(l))));
              continue;
            } else if (m === `svgOrigin`) {
              Di(e, l, 1, x, 0, this);
              continue;
            } else if (m in Ci) {
              Li(this, b, m, d, _ ? We(d, _ + l) : l);
              continue;
            } else if (m === `smoothOrigin`) {
              fi(this, b, `smooth`, b.smooth, l);
              continue;
            } else if (m === `force3D`) {
              b[m] = l;
              continue;
            } else if (m === `transform`) {
              zi(this, l, e);
              continue;
            }
          } else m in o || (m = ai(m) || m);
          if (v || ((u || u === 0) && (d || d === 0) && !Pr.test(l) && m in o))
            ((h = (c + ``).substr((d + ``).length)),
              (u ||= 0),
              (g = jt(l) || (m in D.units ? D.units[m] : h)),
              h !== g && (d = hi(e, m, c, g)),
              (this._pt = new ir(
                this._pt,
                v ? b : o,
                m,
                d,
                (_ ? We(d, _ + u) : u) - d,
                !v && (g === `px` || m === `zIndex`) && t.autoRound !== !1
                  ? Br
                  : Ir,
              )),
              (this._pt.u = g || 0),
              v && w !== l
                ? ((this._pt.b = c), (this._pt.e = w), (this._pt.r = zr))
                : h !== g &&
                  g !== `%` &&
                  ((this._pt.b = c), (this._pt.r = Rr)));
          else if (m in o) _i.call(this, e, m, c, _ ? _ + l : l);
          else if (m in e) this.add(e, m, c || e[m], _ ? _ + l : l, r, i);
          else if (m !== `parseTransform`) {
            Se(m, l);
            continue;
          }
          (v ||
            (m in o
              ? C.push(m, 0, o[m])
              : typeof e[m] == `function`
                ? C.push(m, 2, e[m]())
                : C.push(m, 1, c || e[m])),
            a.push(m));
        }
      }
    S && rr(this);
  },
  render: function (e, t) {
    if (t.tween._time || !Tr())
      for (var n = t._pt; n;) (n.r(e, n.d), (n = n._next));
    else t.styles.revert();
  },
  get: gi,
  aliases: Fr,
  getSetter: function (e, t, n) {
    var r = Fr[t];
    return (
      r && r.indexOf(`,`) < 0 && (t = r),
      t in Dr && t !== Xr && (e._gsap.x || gi(e, `x`))
        ? n && wr === n
          ? t === `scale`
            ? Kr
            : Gr
          : (wr = n || {}) && (t === `scale` ? qr : Jr)
        : e.style && !ae(e.style[t])
          ? Ur
          : ~t.indexOf(`-`)
            ? Wr
            : Yn(e, t)
    );
  },
  core: { _removeProperty: di, _getMatrix: Ei },
};
((vr.utils.checkPrefix = ai),
  (vr.core.getStyleSaver = ei),
  (function (e, t, n, r) {
    var i = Ve(e + `,` + t + `,` + n, function (e) {
      Dr[e] = 1;
    });
    (Ve(t, function (e) {
      ((D.units[e] = `deg`), (Ci[e] = 1));
    }),
      (Fr[i[13]] = e + `,` + t),
      Ve(r, function (e) {
        var t = e.split(`:`);
        Fr[t[1]] = i[t[0]];
      }));
  })(
    `x,y,z,scale,scaleX,scaleY,xPercent,yPercent`,
    `rotation,rotationX,rotationY,skewX,skewY`,
    `transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective`,
    `0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY`,
  ),
  Ve(
    `x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective`,
    function (e) {
      D.units[e] = `px`;
    },
  ),
  vr.registerPlugin(Bi));
var Vi = vr.registerPlugin(Bi) || vr;
Vi.core.Tween;
function Hi(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    ((r.enumerable = r.enumerable || !1),
      (r.configurable = !0),
      `value` in r && (r.writable = !0),
      Object.defineProperty(e, r.key, r));
  }
}
function Ui(e, t, n) {
  return (t && Hi(e.prototype, t), n && Hi(e, n), e);
}
var Wi,
  Gi,
  Ki,
  qi,
  Ji,
  Yi,
  Xi,
  Zi,
  Qi,
  K,
  $i,
  ea,
  ta,
  na = function () {
    return (
      Wi ||
      (typeof window < `u` && (Wi = window.gsap) && Wi.registerPlugin && Wi)
    );
  },
  ra = 1,
  ia = [],
  q = [],
  aa = [],
  oa = Date.now,
  sa = function (e, t) {
    return t;
  },
  ca = function () {
    var e = Qi.core,
      t = e.bridge || {},
      n = e._scrollers,
      r = e._proxies;
    (n.push.apply(n, q),
      r.push.apply(r, aa),
      (q = n),
      (aa = r),
      (sa = function (e, n) {
        return t[e](n);
      }));
  },
  la = function (e, t) {
    return ~aa.indexOf(e) && aa[aa.indexOf(e) + 1][t];
  },
  ua = function (e) {
    return !!~K.indexOf(e);
  },
  da = function (e, t, n, r, i) {
    return e.addEventListener(t, n, { passive: r !== !1, capture: !!i });
  },
  fa = function (e, t, n, r) {
    return e.removeEventListener(t, n, !!r);
  },
  pa = `scrollLeft`,
  ma = `scrollTop`,
  ha = function () {
    return ($i && $i.isPressed) || q.cache++;
  },
  ga = function (e, t) {
    var n = function n(r) {
      if (r || r === 0) {
        ra &&
          Ki.history.scrollRestoration !== `manual` &&
          (Ki.history.scrollRestoration = `manual`);
        var i = $i && $i.isPressed;
        ((r = n.v = Math.round(r) || ($i && $i.iOS ? 1 : 0)),
          e(r),
          (n.cacheID = q.cache),
          i && sa(`ss`, r));
      } else
        (t || q.cache !== n.cacheID || sa(`ref`)) &&
          ((n.cacheID = q.cache), (n.v = e()));
      return n.v + n.offset;
    };
    return ((n.offset = 0), e && n);
  },
  _a = {
    s: pa,
    p: `left`,
    p2: `Left`,
    os: `right`,
    os2: `Right`,
    d: `width`,
    d2: `Width`,
    a: `x`,
    sc: ga(function (e) {
      return arguments.length
        ? Ki.scrollTo(e, va.sc())
        : Ki.pageXOffset || qi[pa] || Ji[pa] || Yi[pa] || 0;
    }),
  },
  va = {
    s: ma,
    p: `top`,
    p2: `Top`,
    os: `bottom`,
    os2: `Bottom`,
    d: `height`,
    d2: `Height`,
    a: `y`,
    op: _a,
    sc: ga(function (e) {
      return arguments.length
        ? Ki.scrollTo(_a.sc(), e)
        : Ki.pageYOffset || qi[ma] || Ji[ma] || Yi[ma] || 0;
    }),
  },
  ya = function (e, t) {
    return (
      ((t && t._ctx && t._ctx.selector) || Wi.utils.toArray)(e)[0] ||
      (typeof e == `string` && Wi.config().nullTargetWarn !== !1
        ? console.warn(`Element not found:`, e)
        : null)
    );
  },
  ba = function (e, t) {
    for (var n = t.length; n--;) if (t[n] === e || t[n].contains(e)) return !0;
    return !1;
  },
  xa = function (e, t) {
    var n = t.s,
      r = t.sc;
    ua(e) && (e = qi.scrollingElement || Ji);
    var i = q.indexOf(e),
      a = r === va.sc ? 1 : 2;
    (!~i && (i = q.push(e) - 1), q[i + a] || da(e, `scroll`, ha));
    var o = q[i + a],
      s =
        o ||
        (q[i + a] =
          ga(la(e, n), !0) ||
          (ua(e)
            ? r
            : ga(function (t) {
                return arguments.length ? (e[n] = t) : e[n];
              })));
    return (
      (s.target = e),
      o || (s.smooth = Wi.getProperty(e, `scrollBehavior`) === `smooth`),
      s
    );
  },
  Sa = function (e, t, n) {
    var r = e,
      i = e,
      a = oa(),
      o = a,
      s = t || 50,
      c = Math.max(500, s * 3),
      l = function (e, t) {
        var c = oa();
        t || c - a > s
          ? ((i = r), (r = e), (o = a), (a = c))
          : n
            ? (r += e)
            : (r = i + ((e - i) / (c - o)) * (a - o));
      };
    return {
      update: l,
      reset: function () {
        ((i = r = n ? 0 : r), (o = a = 0));
      },
      getVelocity: function (e) {
        var t = o,
          s = i,
          u = oa();
        return (
          (e || e === 0) && e !== r && l(e),
          a === o || u - o > c
            ? 0
            : ((r + (n ? s : -s)) / ((n ? u : a) - t)) * 1e3
        );
      },
    };
  },
  Ca = function (e, t) {
    return (
      t && !e._gsapAllow && e.cancelable !== !1 && e.preventDefault(),
      e.changedTouches ? e.changedTouches[0] : e
    );
  },
  wa = function (e) {
    var t = Math.max.apply(Math, e),
      n = Math.min.apply(Math, e);
    return Math.abs(t) >= Math.abs(n) ? t : n;
  },
  Ta = function () {
    ((Qi = Wi.core.globals().ScrollTrigger), Qi && Qi.core && ca());
  },
  Ea = function (e) {
    return (
      (Wi = e || na()),
      !Gi &&
        Wi &&
        typeof document < `u` &&
        document.body &&
        ((Ki = window),
        (qi = document),
        (Ji = qi.documentElement),
        (Yi = qi.body),
        (K = [Ki, qi, Ji, Yi]),
        Wi.utils.clamp,
        (ta = Wi.core.context || function () {}),
        (Zi = `onpointerenter` in Yi ? `pointer` : `mouse`),
        (Xi = Da.isTouch =
          Ki.matchMedia &&
          Ki.matchMedia(`(hover: none), (pointer: coarse)`).matches
            ? 1
            : `ontouchstart` in Ki ||
                navigator.maxTouchPoints > 0 ||
                navigator.msMaxTouchPoints > 0
              ? 2
              : 0),
        (ea = Da.eventTypes =
          (
            `ontouchstart` in Ji
              ? `touchstart,touchmove,touchcancel,touchend`
              : `onpointerdown` in Ji
                ? `pointerdown,pointermove,pointercancel,pointerup`
                : `mousedown,mousemove,mouseup,mouseup`
          ).split(`,`)),
        setTimeout(function () {
          return (ra = 0);
        }, 500),
        (Gi = 1)),
      Qi || Ta(),
      Gi
    );
  };
((_a.op = va), (q.cache = 0));
var Da = (function () {
  function e(e) {
    this.init(e);
  }
  var t = e.prototype;
  return (
    (t.init = function (e) {
      (Gi || Ea(Wi) || console.warn(`Please gsap.registerPlugin(Observer)`),
        Qi || Ta());
      var t = e.tolerance,
        n = e.dragMinimum,
        r = e.type,
        i = e.target,
        a = e.lineHeight,
        o = e.debounce,
        s = e.preventDefault,
        c = e.onStop,
        l = e.onStopDelay,
        u = e.ignore,
        d = e.wheelSpeed,
        f = e.event,
        p = e.onDragStart,
        m = e.onDragEnd,
        h = e.onDrag,
        g = e.onPress,
        _ = e.onRelease,
        v = e.onRight,
        y = e.onLeft,
        b = e.onUp,
        x = e.onDown,
        S = e.onChangeX,
        C = e.onChangeY,
        w = e.onChange,
        T = e.onToggleX,
        E = e.onToggleY,
        D = e.onHover,
        O = e.onHoverEnd,
        k = e.onMove,
        A = e.ignoreCheck,
        j = e.isNormalizer,
        M = e.onGestureStart,
        N = e.onGestureEnd,
        P = e.onWheel,
        F = e.onEnable,
        ee = e.onDisable,
        te = e.onClick,
        ne = e.scrollSpeed,
        re = e.capture,
        I = e.allowClicks,
        L = e.lockAxis,
        ie = e.onLockAxis;
      ((this.target = i = ya(i) || Ji),
        (this.vars = e),
        (u &&= Wi.utils.toArray(u)),
        (t ||= 1e-9),
        (n ||= 0),
        (d ||= 1),
        (ne ||= 1),
        (r ||= `wheel,touch,pointer`),
        (o = o !== !1),
        (a ||= parseFloat(Ki.getComputedStyle(Yi).lineHeight) || 22));
      var ae,
        oe,
        se,
        ce,
        R,
        le,
        ue,
        z = this,
        B = 0,
        V = 0,
        de = e.passive || (!s && e.passive !== !1),
        fe = xa(i, _a),
        pe = xa(i, va),
        me = fe(),
        he = pe(),
        ge =
          ~r.indexOf(`touch`) &&
          !~r.indexOf(`pointer`) &&
          ea[0] === `pointerdown`,
        H = ua(i),
        U = i.ownerDocument || qi,
        _e = [0, 0, 0],
        ve = [0, 0, 0],
        ye = 0,
        be = function () {
          return (ye = oa());
        },
        xe = function (e, t) {
          return (
            ((z.event = e) && u && ba(e.target, u)) ||
            (t && ge && e.pointerType !== `touch`) ||
            (A && A(e, t))
          );
        },
        W = function () {
          (z._vx.reset(), z._vy.reset(), oe.pause(), c && c(z));
        },
        Se = function () {
          var e = (z.deltaX = wa(_e)),
            n = (z.deltaY = wa(ve)),
            r = Math.abs(e) >= t,
            i = Math.abs(n) >= t;
          (w && (r || i) && w(z, e, n, _e, ve),
            r &&
              (v && z.deltaX > 0 && v(z),
              y && z.deltaX < 0 && y(z),
              S && S(z),
              T && z.deltaX < 0 != B < 0 && T(z),
              (B = z.deltaX),
              (_e[0] = _e[1] = _e[2] = 0)),
            i &&
              (x && z.deltaY > 0 && x(z),
              b && z.deltaY < 0 && b(z),
              C && C(z),
              E && z.deltaY < 0 != V < 0 && E(z),
              (V = z.deltaY),
              (ve[0] = ve[1] = ve[2] = 0)),
            (ce || se) &&
              (k && k(z),
              (se &&= (p && se === 1 && p(z), h && h(z), 0)),
              (ce = !1)),
            le && !(le = !1) && ie && ie(z),
            (R &&= (P(z), !1)),
            (ae = 0));
        },
        Ce = function (e, t, n) {
          ((_e[n] += e),
            (ve[n] += t),
            z._vx.update(e),
            z._vy.update(t),
            o ? (ae ||= requestAnimationFrame(Se)) : Se());
        },
        we = function (e, t) {
          (L &&
            !ue &&
            ((z.axis = ue = Math.abs(e) > Math.abs(t) ? `x` : `y`), (le = !0)),
            ue !== `y` && ((_e[2] += e), z._vx.update(e, !0)),
            ue !== `x` && ((ve[2] += t), z._vy.update(t, !0)),
            o ? (ae ||= requestAnimationFrame(Se)) : Se());
        },
        Te = function (e) {
          if (!xe(e, 1)) {
            e = Ca(e, s);
            var t = e.clientX,
              r = e.clientY,
              i = t - z.x,
              a = r - z.y,
              o = z.isDragging;
            ((z.x = t),
              (z.y = r),
              (o ||
                ((i || a) &&
                  (Math.abs(z.startX - t) >= n ||
                    Math.abs(z.startY - r) >= n))) &&
                ((se ||= o ? 2 : 1), o || (z.isDragging = !0), we(i, a)));
          }
        },
        Ee = (z.onPress = function (e) {
          xe(e, 1) ||
            (e && e.button) ||
            ((z.axis = ue = null),
            oe.pause(),
            (z.isPressed = !0),
            (e = Ca(e)),
            (B = V = 0),
            (z.startX = z.x = e.clientX),
            (z.startY = z.y = e.clientY),
            z._vx.reset(),
            z._vy.reset(),
            da(j ? i : U, ea[1], Te, de, !0),
            (z.deltaX = z.deltaY = 0),
            g && g(z));
        }),
        De = (z.onRelease = function (e) {
          if (!xe(e, 1)) {
            fa(j ? i : U, ea[1], Te, !0);
            var t = !isNaN(z.y - z.startY),
              n = z.isDragging,
              r =
                n &&
                (Math.abs(z.x - z.startX) > 3 || Math.abs(z.y - z.startY) > 3),
              a = Ca(e);
            (!r &&
              t &&
              (z._vx.reset(),
              z._vy.reset(),
              s &&
                I &&
                Wi.delayedCall(0.08, function () {
                  if (oa() - ye > 300 && !e.defaultPrevented) {
                    if (e.target.click) e.target.click();
                    else if (U.createEvent) {
                      var t = U.createEvent(`MouseEvents`);
                      (t.initMouseEvent(
                        `click`,
                        !0,
                        !0,
                        Ki,
                        1,
                        a.screenX,
                        a.screenY,
                        a.clientX,
                        a.clientY,
                        !1,
                        !1,
                        !1,
                        !1,
                        0,
                        null,
                      ),
                        e.target.dispatchEvent(t));
                    }
                  }
                })),
              (z.isDragging = z.isGesturing = z.isPressed = !1),
              c && n && !j && oe.restart(!0),
              se && Se(),
              m && n && m(z),
              _ && _(z, r));
          }
        }),
        Oe = function (e) {
          return (
            e.touches &&
            e.touches.length > 1 &&
            (z.isGesturing = !0) &&
            M(e, z.isDragging)
          );
        },
        ke = function () {
          return (z.isGesturing = !1) || N(z);
        },
        Ae = function (e) {
          if (!xe(e)) {
            var t = fe(),
              n = pe();
            (Ce((t - me) * ne, (n - he) * ne, 1),
              (me = t),
              (he = n),
              c && oe.restart(!0));
          }
        },
        je = function (e) {
          if (!xe(e)) {
            ((e = Ca(e, s)), P && (R = !0));
            var t =
              (e.deltaMode === 1 ? a : e.deltaMode === 2 ? Ki.innerHeight : 1) *
              d;
            (Ce(e.deltaX * t, e.deltaY * t, 0), c && !j && oe.restart(!0));
          }
        },
        Me = function (e) {
          if (!xe(e)) {
            var t = e.clientX,
              n = e.clientY,
              r = t - z.x,
              i = n - z.y;
            ((z.x = t),
              (z.y = n),
              (ce = !0),
              c && oe.restart(!0),
              (r || i) && we(r, i));
          }
        },
        Ne = function (e) {
          ((z.event = e), D(z));
        },
        Pe = function (e) {
          ((z.event = e), O(z));
        },
        Fe = function (e) {
          return xe(e) || (Ca(e, s) && te(z));
        };
      ((oe = z._dc = Wi.delayedCall(l || 0.25, W).pause()),
        (z.deltaX = z.deltaY = 0),
        (z._vx = Sa(0, 50, !0)),
        (z._vy = Sa(0, 50, !0)),
        (z.scrollX = fe),
        (z.scrollY = pe),
        (z.isDragging = z.isGesturing = z.isPressed = !1),
        ta(this),
        (z.enable = function (e) {
          return (
            z.isEnabled ||
              (da(H ? U : i, `scroll`, ha),
              r.indexOf(`scroll`) >= 0 && da(H ? U : i, `scroll`, Ae, de, re),
              r.indexOf(`wheel`) >= 0 && da(i, `wheel`, je, de, re),
              ((r.indexOf(`touch`) >= 0 && Xi) || r.indexOf(`pointer`) >= 0) &&
                (da(i, ea[0], Ee, de, re),
                da(U, ea[2], De),
                da(U, ea[3], De),
                I && da(i, `click`, be, !0, !0),
                te && da(i, `click`, Fe),
                M && da(U, `gesturestart`, Oe),
                N && da(U, `gestureend`, ke),
                D && da(i, Zi + `enter`, Ne),
                O && da(i, Zi + `leave`, Pe),
                k && da(i, Zi + `move`, Me)),
              (z.isEnabled = !0),
              (z.isDragging = z.isGesturing = z.isPressed = ce = se = !1),
              z._vx.reset(),
              z._vy.reset(),
              (me = fe()),
              (he = pe()),
              e && e.type && Ee(e),
              F && F(z)),
            z
          );
        }),
        (z.disable = function () {
          z.isEnabled &&
            (ia.filter(function (e) {
              return e !== z && ua(e.target);
            }).length || fa(H ? U : i, `scroll`, ha),
            z.isPressed &&
              (z._vx.reset(), z._vy.reset(), fa(j ? i : U, ea[1], Te, !0)),
            fa(H ? U : i, `scroll`, Ae, re),
            fa(i, `wheel`, je, re),
            fa(i, ea[0], Ee, re),
            fa(U, ea[2], De),
            fa(U, ea[3], De),
            fa(i, `click`, be, !0),
            fa(i, `click`, Fe),
            fa(U, `gesturestart`, Oe),
            fa(U, `gestureend`, ke),
            fa(i, Zi + `enter`, Ne),
            fa(i, Zi + `leave`, Pe),
            fa(i, Zi + `move`, Me),
            (z.isEnabled = z.isPressed = z.isDragging = !1),
            ee && ee(z));
        }),
        (z.kill = z.revert =
          function () {
            z.disable();
            var e = ia.indexOf(z);
            (e >= 0 && ia.splice(e, 1), $i === z && ($i = 0));
          }),
        ia.push(z),
        j && ua(i) && ($i = z),
        z.enable(f));
    }),
    Ui(e, [
      {
        key: `velocityX`,
        get: function () {
          return this._vx.getVelocity();
        },
      },
      {
        key: `velocityY`,
        get: function () {
          return this._vy.getVelocity();
        },
      },
    ]),
    e
  );
})();
((Da.version = `3.15.1`),
  (Da.create = function (e) {
    return new Da(e);
  }),
  (Da.register = Ea),
  (Da.getAll = function () {
    return ia.slice();
  }),
  (Da.getById = function (e) {
    return ia.filter(function (t) {
      return t.vars.id === e;
    })[0];
  }),
  na() && Wi.registerPlugin(Da));
var J,
  Oa,
  Y,
  ka,
  Aa,
  ja,
  Ma,
  Na,
  Pa,
  Fa,
  Ia,
  La,
  Ra,
  za,
  Ba,
  Va,
  Ha,
  Ua,
  Wa,
  Ga,
  Ka,
  qa,
  Ja,
  Ya,
  Xa,
  Za,
  Qa,
  $a,
  eo,
  to,
  no,
  ro,
  io,
  ao,
  oo = 1,
  so = Date.now,
  co = so(),
  lo = 0,
  uo = 0,
  fo = function (e, t, n) {
    var r = Oo(e) && (e.substr(0, 6) === `clamp(` || e.indexOf(`max`) > -1);
    return ((n[`_` + t + `Clamp`] = r), r ? e.substr(6, e.length - 7) : e);
  },
  po = function (e, t) {
    return t && (!Oo(e) || e.substr(0, 6) !== `clamp(`)
      ? `clamp(` + e + `)`
      : e;
  },
  mo = function e() {
    return uo && requestAnimationFrame(e);
  },
  ho = function () {
    return (za = 1);
  },
  go = function () {
    return (za = 0);
  },
  _o = function (e) {
    return e;
  },
  vo = function (e) {
    return Math.round(e * 1e5) / 1e5 || 0;
  },
  yo = function () {
    return typeof window < `u`;
  },
  bo = function () {
    return J || (yo() && (J = window.gsap) && J.registerPlugin && J);
  },
  xo = function (e) {
    return !!~Ma.indexOf(e);
  },
  So = function (e) {
    return (
      (e === `Height` ? no : Y[`inner` + e]) ||
      Aa[`client` + e] ||
      ja[`client` + e]
    );
  },
  Co = function (e) {
    return (
      la(e, `getBoundingClientRect`) ||
      (xo(e)
        ? function () {
            return ((Js.width = Y.innerWidth), (Js.height = no), Js);
          }
        : function () {
            return Qo(e);
          })
    );
  },
  wo = function (e, t, n) {
    var r = n.d,
      i = n.d2,
      a = n.a;
    return (a = la(e, `getBoundingClientRect`))
      ? function () {
          return a()[r];
        }
      : function () {
          return (t ? So(i) : e[`client` + i]) || 0;
        };
  },
  To = function (e, t) {
    return !t || ~aa.indexOf(e)
      ? Co(e)
      : function () {
          return Js;
        };
  },
  Eo = function (e, t) {
    var n = t.s,
      r = t.d2,
      i = t.d,
      a = t.a;
    return Math.max(
      0,
      (n = `scroll` + r) && (a = la(e, n))
        ? a() - Co(e)()[i]
        : xo(e)
          ? (Aa[n] || ja[n]) - So(r)
          : e[n] - e[`offset` + r],
    );
  },
  Do = function (e, t) {
    for (var n = 0; n < Wa.length; n += 3)
      (!t || ~t.indexOf(Wa[n + 1])) && e(Wa[n], Wa[n + 1], Wa[n + 2]);
  },
  Oo = function (e) {
    return typeof e == `string`;
  },
  ko = function (e) {
    return typeof e == `function`;
  },
  Ao = function (e) {
    return typeof e == `number`;
  },
  jo = function (e) {
    return typeof e == `object`;
  },
  Mo = function (e, t, n) {
    return e && e.progress(+!t) && n && e.pause();
  },
  No = function (e, t, n) {
    if (e.enabled) {
      var r = e._ctx
        ? e._ctx.add(function () {
            return t(e, n);
          })
        : t(e, n);
      r && r.totalTime && (e.callbackAnimation = r);
    }
  },
  X = Math.abs,
  Po = `left`,
  Fo = `top`,
  Io = `right`,
  Lo = `bottom`,
  Ro = `width`,
  zo = `height`,
  Bo = `Right`,
  Vo = `Left`,
  Ho = `Top`,
  Uo = `Bottom`,
  Wo = `padding`,
  Go = `margin`,
  Ko = `Width`,
  qo = `Height`,
  Jo = `px`,
  Yo = function (e) {
    return Y.getComputedStyle(
      e.nodeType === Node.DOCUMENT_NODE ? e.scrollingElement : e,
    );
  },
  Xo = function (e) {
    var t = Yo(e).position;
    e.style.position = t === `absolute` || t === `fixed` ? t : `relative`;
  },
  Zo = function (e, t) {
    for (var n in t) n in e || (e[n] = t[n]);
    return e;
  },
  Qo = function (e, t) {
    var n =
        t &&
        Yo(e)[Ba] !== `matrix(1, 0, 0, 1, 0, 0)` &&
        J.to(e, {
          x: 0,
          y: 0,
          xPercent: 0,
          yPercent: 0,
          rotation: 0,
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          skewX: 0,
          skewY: 0,
        }).progress(1),
      r = e.getBoundingClientRect
        ? e.getBoundingClientRect()
        : e.scrollingElement.getBoundingClientRect();
    return (n && n.progress(0).kill(), r);
  },
  $o = function (e, t) {
    var n = t.d2;
    return e[`offset` + n] || e[`client` + n] || 0;
  },
  es = function (e) {
    var t = [],
      n = e.labels,
      r = e.duration(),
      i;
    for (i in n) t.push(n[i] / r);
    return t;
  },
  ts = function (e) {
    return function (t) {
      return J.utils.snap(es(e), t);
    };
  },
  ns = function (e) {
    var t = J.utils.snap(e),
      n =
        Array.isArray(e) &&
        e.slice(0).sort(function (e, t) {
          return e - t;
        });
    return n
      ? function (e, r, i) {
          i === void 0 && (i = 0.001);
          var a;
          if (!r) return t(e);
          if (r > 0) {
            for (e -= i, a = 0; a < n.length; a++) if (n[a] >= e) return n[a];
            return n[a - 1];
          }
          for (a = n.length, e += i; a--;) if (n[a] <= e) return n[a];
          return n[0];
        }
      : function (n, r, i) {
          i === void 0 && (i = 0.001);
          var a = t(n);
          return !r || Math.abs(a - n) < i || a - n < 0 == r < 0
            ? a
            : t(r < 0 ? n - e : n + e);
        };
  },
  rs = function (e) {
    return function (t, n) {
      return ns(es(e))(t, n.direction);
    };
  },
  is = function (e, t, n, r) {
    return n.split(`,`).forEach(function (n) {
      return e(t, n, r);
    });
  },
  as = function (e, t, n, r, i) {
    return e.addEventListener(t, n, { passive: !r, capture: !!i });
  },
  os = function (e, t, n, r) {
    return e.removeEventListener(t, n, !!r);
  },
  ss = function (e, t, n) {
    ((n &&= n.wheelHandler), n && (e(t, `wheel`, n), e(t, `touchmove`, n)));
  },
  cs = {
    startColor: `green`,
    endColor: `red`,
    indent: 0,
    fontSize: `16px`,
    fontWeight: `normal`,
  },
  ls = { toggleActions: `play`, anticipatePin: 0 },
  us = { top: 0, left: 0, center: 0.5, bottom: 1, right: 1 },
  ds = function (e, t) {
    if (Oo(e)) {
      var n = e.indexOf(`=`),
        r = ~n ? +(e.charAt(n - 1) + 1) * parseFloat(e.substr(n + 1)) : 0;
      (~n && (e.indexOf(`%`) > n && (r *= t / 100), (e = e.substr(0, n - 1))),
        (e =
          r +
          (e in us
            ? us[e] * t
            : ~e.indexOf(`%`)
              ? (parseFloat(e) * t) / 100
              : parseFloat(e) || 0)));
    }
    return e;
  },
  fs = function (e, t, n, r, i, a, o, s) {
    var c = i.startColor,
      l = i.endColor,
      u = i.fontSize,
      d = i.indent,
      f = i.fontWeight,
      p = ka.createElement(`div`),
      m = xo(n) || la(n, `pinType`) === `fixed`,
      h = e.indexOf(`scroller`) !== -1,
      g = m ? ja : n.tagName === `IFRAME` ? n.contentDocument.body : n,
      _ = e.indexOf(`start`) !== -1,
      v = _ ? c : l,
      y =
        `border-color:` +
        v +
        `;font-size:` +
        u +
        `;color:` +
        v +
        `;font-weight:` +
        f +
        `;pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;`;
    return (
      (y += `position:` + ((h || s) && m ? `fixed;` : `absolute;`)),
      (h || s || !m) &&
        (y += (r === va ? Io : Lo) + `:` + (a + parseFloat(d)) + `px;`),
      o &&
        (y +=
          `box-sizing:border-box;text-align:left;width:` +
          o.offsetWidth +
          `px;`),
      (p._isStart = _),
      p.setAttribute(`class`, `gsap-marker-` + e + (t ? ` marker-` + t : ``)),
      (p.style.cssText = y),
      (p.innerText = t || t === 0 ? e + `-` + t : e),
      g.children[0] ? g.insertBefore(p, g.children[0]) : g.appendChild(p),
      (p._offset = p[`offset` + r.op.d2]),
      ps(p, 0, r, _),
      p
    );
  },
  ps = function (e, t, n, r) {
    var i = { display: `block` },
      a = n[r ? `os2` : `p2`],
      o = n[r ? `p2` : `os2`];
    ((e._isFlipped = r),
      (i[n.a + `Percent`] = r ? -100 : 0),
      (i[n.a] = r ? `1px` : 0),
      (i[`border` + a + Ko] = 1),
      (i[`border` + o + Ko] = 0),
      (i[n.p] = t + `px`),
      J.set(e, i));
  },
  Z = [],
  ms = {},
  hs,
  gs = function () {
    return so() - lo > 34 && (hs ||= requestAnimationFrame(zs));
  },
  _s = function () {
    (!Ja || !Ja.isPressed || Ja.startX > ja.clientWidth) &&
      (q.cache++,
      Ja ? (hs ||= requestAnimationFrame(zs)) : zs(),
      lo || Cs(`scrollStart`),
      (lo = so()));
  },
  vs = function () {
    ((Za = Y.innerWidth), (Xa = Y.innerHeight));
  },
  ys = function (e) {
    (q.cache++,
      (e === !0 ||
        (!Ra &&
          !qa &&
          !ka.fullscreenElement &&
          !ka.webkitFullscreenElement &&
          (!Ya ||
            Za !== Y.innerWidth ||
            Math.abs(Y.innerHeight - Xa) > Y.innerHeight * 0.25))) &&
        Na.restart(!0));
  },
  bs = {},
  xs = [],
  Ss = function e() {
    return os(Q, `scrollEnd`, e) || Fs(!0);
  },
  Cs = function (e) {
    return (
      (bs[e] &&
        bs[e].map(function (e) {
          return e();
        })) ||
      xs
    );
  },
  ws = [],
  Ts = function (e) {
    for (var t = 0; t < ws.length; t += 5)
      (!e || (ws[t + 4] && ws[t + 4].query === e)) &&
        ((ws[t].style.cssText = ws[t + 1]),
        ws[t].getBBox && ws[t].setAttribute(`transform`, ws[t + 2] || ``),
        (ws[t + 3].uncache = 1));
  },
  Es = function () {
    (q.cache++,
      q.forEach(function (e) {
        return ko(e) && (e.rec = e());
      }));
  },
  Ds = function (e, t) {
    var n;
    for (Va = 0; Va < Z.length; Va++)
      ((n = Z[Va]),
        n && (!t || n._ctx === t) && (e ? n.kill(1) : n.revert(!0, !0)));
    ((ro = !0), t && Ts(t), t || Cs(`revert`));
  },
  Os = function (e, t) {
    (q.cache++,
      (t || !ks) &&
        q.forEach(function (e) {
          return ko(e) && e.cacheID++ && (e.rec = 0);
        }),
      Oo(e) &&
        ((eo = e),
        Y.history.scrollRestoration !== e &&
          (Y.history.scrollRestoration = e)));
  },
  ks,
  As = 0,
  js,
  Ms = function () {
    if (js !== As) {
      var e = (js = As);
      requestAnimationFrame(function () {
        return e === As && Fs(!0);
      });
    }
  },
  Ns = function () {
    (ja.appendChild(to),
      (no = (!Ja && to.offsetHeight) || Y.innerHeight),
      ja.removeChild(to));
  },
  Ps = function (e) {
    return Pa(
      `.gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end`,
    ).forEach(function (t) {
      return (t.style.display = e ? `none` : `block`);
    });
  },
  Fs = function (e, t) {
    if (
      ((Aa = ka.documentElement),
      (ja = ka.body),
      (Ma = [Y, ka, Aa, ja]),
      lo && !e && !ro)
    )
      as(Q, `scrollEnd`, Ss);
    else {
      (Ns(), (ks = Q.isRefreshing = !0), ro || Es());
      var n = Cs(`refreshInit`);
      (Ga && Q.sort(),
        t || Ds(),
        q.forEach(function (e) {
          ko(e) && (e.smooth && (e.target.style.scrollBehavior = `auto`), e(0));
        }),
        Z.slice(0).forEach(function (e) {
          return e.refresh();
        }),
        (ro = !1),
        Z.forEach(function (e) {
          if (e._subPinOffset && e.pin) {
            var t = e.vars.horizontal ? `offsetWidth` : `offsetHeight`,
              n = e.pin[t];
            (e.revert(!0, 1), e.adjustPinSpacing(e.pin[t] - n), e.refresh());
          }
        }),
        (io = 1),
        Ps(!0),
        Z.forEach(function (e) {
          var t = Eo(e.scroller, e._dir),
            n = e.vars.end === `max` || (e._endClamp && e.end > t),
            r = e._startClamp && e.start >= t;
          (n || r) &&
            e.setPositions(
              r ? t - 1 : e.start,
              n ? Math.max(r ? t : e.start + 1, t) : e.end,
              !0,
            );
        }),
        Ps(!1),
        (io = 0),
        n.forEach(function (e) {
          return e && e.render && e.render(-1);
        }),
        q.forEach(function (e) {
          ko(e) &&
            (e.smooth &&
              requestAnimationFrame(function () {
                return (e.target.style.scrollBehavior = `smooth`);
              }),
            e.rec && e(e.rec));
        }),
        Os(eo, 1),
        Na.pause(),
        As++,
        (ks = 2),
        zs(2),
        Z.forEach(function (e) {
          return ko(e.vars.onRefresh) && e.vars.onRefresh(e);
        }),
        (ks = Q.isRefreshing = !1),
        Cs(`refresh`));
    }
  },
  Is = 0,
  Ls = 1,
  Rs,
  zs = function (e) {
    if (e === 2 || (!ks && !ro)) {
      ((Q.isUpdating = !0), Rs && Rs.update(0));
      var t = Z.length,
        n = so(),
        r = n - co >= 50,
        i = t && Z[0].scroll();
      if (
        ((Ls = Is > i ? -1 : 1),
        ks || (Is = i),
        r &&
          (lo && !za && n - lo > 200 && ((lo = 0), Cs(`scrollEnd`)),
          (Ia = co),
          (co = n)),
        Ls < 0)
      ) {
        for (Va = t; Va-- > 0;) Z[Va] && Z[Va].update(0, r);
        Ls = 1;
      } else for (Va = 0; Va < t; Va++) Z[Va] && Z[Va].update(0, r);
      Q.isUpdating = !1;
    }
    hs = 0;
  },
  Bs = [
    Po,
    Fo,
    Lo,
    Io,
    Go + Uo,
    Go + Bo,
    Go + Ho,
    Go + Vo,
    `display`,
    `flexShrink`,
    `float`,
    `zIndex`,
    `gridColumnStart`,
    `gridColumnEnd`,
    `gridRowStart`,
    `gridRowEnd`,
    `gridArea`,
    `justifySelf`,
    `alignSelf`,
    `placeSelf`,
    `order`,
  ],
  Vs = Bs.concat([
    Ro,
    zo,
    `boxSizing`,
    `max` + Ko,
    `max` + qo,
    `position`,
    Go,
    Wo,
    Wo + Ho,
    Wo + Bo,
    Wo + Uo,
    Wo + Vo,
  ]),
  Hs = function (e, t, n) {
    Gs(n);
    var r = e._gsap;
    if (r.spacerIsNative) Gs(r.spacerState);
    else if (e._gsap.swappedIn) {
      var i = t.parentNode;
      i && (i.insertBefore(e, t), i.removeChild(t));
    }
    e._gsap.swappedIn = !1;
  },
  Us = function (e, t, n, r) {
    if (!e._gsap.swappedIn) {
      for (var i = Bs.length, a = t.style, o = e.style, s; i--;)
        ((s = Bs[i]), (a[s] = n[s]));
      ((a.position = n.position === `absolute` ? `absolute` : `relative`),
        n.display === `inline` && (a.display = `inline-block`),
        (o[Lo] = o[Io] = `auto`),
        (a.flexBasis = n.flexBasis || `auto`),
        (a.overflow = `visible`),
        (a.boxSizing = `border-box`),
        (a[Ro] = $o(e, _a) + Jo),
        (a[zo] = $o(e, va) + Jo),
        (a[Wo] = o[Go] = o[Fo] = o[Po] = `0`),
        Gs(r),
        (o[Ro] = o[`max` + Ko] = n[Ro]),
        (o[zo] = o[`max` + qo] = n[zo]),
        (o[Wo] = n[Wo]),
        e.parentNode !== t &&
          (e.parentNode.insertBefore(t, e), t.appendChild(e)),
        (e._gsap.swappedIn = !0));
    }
  },
  Ws = /([A-Z])/g,
  Gs = function (e) {
    if (e) {
      var t = e.t.style,
        n = e.length,
        r = 0,
        i,
        a;
      for ((e.t._gsap || J.core.getCache(e.t)).uncache = 1; r < n; r += 2)
        ((a = e[r + 1]),
          (i = e[r]),
          a
            ? (t[i] = a)
            : t[i] && t.removeProperty(i.replace(Ws, `-$1`).toLowerCase()));
    }
  },
  Ks = function (e) {
    for (var t = Vs.length, n = e.style, r = [], i = 0; i < t; i++)
      r.push(Vs[i], n[Vs[i]]);
    return ((r.t = e), r);
  },
  qs = function (e, t, n) {
    for (var r = [], i = e.length, a = n ? 8 : 0, o; a < i; a += 2)
      ((o = e[a]), r.push(o, o in t ? t[o] : e[a + 1]));
    return ((r.t = e.t), r);
  },
  Js = { left: 0, top: 0 },
  Ys = function (e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
    (ko(e) && (e = e(s)),
      Oo(e) &&
        e.substr(0, 3) === `max` &&
        (e = d + (e.charAt(4) === `=` ? ds(`0` + e.substr(3), n) : 0)));
    var m = f ? f.time() : 0,
      h,
      g,
      _;
    if ((f && f.seek(0), isNaN(e) || (e = +e), Ao(e)))
      (f &&
        (e = J.utils.mapRange(
          f.scrollTrigger.start,
          f.scrollTrigger.end,
          0,
          d,
          e,
        )),
        o && ps(o, n, r, !0));
    else {
      ko(t) && (t = t(s));
      var v = (e || `0`).split(` `),
        y,
        b,
        x,
        S;
      ((_ = ya(t, s) || ja),
        (y = Qo(_) || {}),
        (y && (y.left || y.top)) ||
          Yo(_).display !== `none` ||
          ((S = _.style.display),
          (_.style.display = `block`),
          (y = Qo(_)),
          S ? (_.style.display = S) : _.style.removeProperty(`display`)),
        (b = ds(v[0], y[r.d])),
        (x = ds(v[1] || `0`, n)),
        (e = y[r.p] - c[r.p] - l + b + i - x),
        o && ps(o, x, r, n - x < 20 || (o._isStart && x > 20)),
        (n -= n - x));
    }
    if ((p && ((s[p] = e || -0.001), e < 0 && (e = 0)), a)) {
      var C = e + n,
        w = a._isStart;
      ((h = `scroll` + r.d2),
        ps(
          a,
          C,
          r,
          (w && C > 20) ||
            (!w && (u ? Math.max(ja[h], Aa[h]) : a.parentNode[h]) <= C + 1),
        ),
        u &&
          ((c = Qo(o)),
          u && (a.style[r.op.p] = c[r.op.p] - r.op.m - a._offset + Jo)));
    }
    return (
      f &&
        _ &&
        ((h = Qo(_)),
        f.seek(d),
        (g = Qo(_)),
        (f._caScrollDist = h[r.p] - g[r.p]),
        (e = (e / f._caScrollDist) * d)),
      f && f.seek(m),
      f ? e : Math.round(e)
    );
  },
  Xs = /(webkit|moz|length|cssText|inset)/i,
  Zs = function (e, t, n, r) {
    if (e.parentNode !== t) {
      var i = e.style,
        a,
        o;
      if (t === ja) {
        for (a in ((e._stOrig = i.cssText), (o = Yo(e)), o))
          !+a &&
            !Xs.test(a) &&
            o[a] &&
            typeof i[a] == `string` &&
            a !== `0` &&
            (i[a] = o[a]);
        ((i.top = n), (i.left = r));
      } else i.cssText = e._stOrig;
      ((J.core.getCache(e).uncache = 1), t.appendChild(e));
    }
  },
  Qs = function (e, t, n) {
    var r = t,
      i = r;
    return function (t) {
      var a = Math.round(e());
      return (
        a !== r &&
          a !== i &&
          Math.abs(a - r) > 3 &&
          Math.abs(a - i) > 3 &&
          ((t = a), n && n()),
        (i = r),
        (r = Math.round(t)),
        r
      );
    };
  },
  $s = function (e, t, n) {
    var r = {};
    ((r[t.p] = `+=` + n), J.set(e, r));
  },
  ec = function (e, t) {
    var n = xa(e, t),
      r = `_scroll` + t.p2,
      i = function t(i, a, o, s, c) {
        var l = t.tween,
          u = a.onComplete,
          d = {};
        o ||= n();
        var f = Qs(n, o, function () {
          (l.kill(), (t.tween = 0));
        });
        return (
          (c = (s && c) || 0),
          (s ||= i - o),
          l && l.kill(),
          (a[r] = i),
          (a.inherit = !1),
          (a.modifiers = d),
          (d[r] = function () {
            return f(o + s * l.ratio + c * l.ratio * l.ratio);
          }),
          (a.onUpdate = function () {
            (q.cache++, t.tween && zs());
          }),
          (a.onComplete = function () {
            ((t.tween = 0), u && u.call(l));
          }),
          (l = t.tween = J.to(e, a)),
          l
        );
      };
    return (
      (e[r] = n),
      (n.wheelHandler = function () {
        return i.tween && i.tween.kill() && (i.tween = 0);
      }),
      as(e, `wheel`, n.wheelHandler),
      Q.isTouch && as(e, `touchmove`, n.wheelHandler),
      i
    );
  },
  Q = (function () {
    function e(t, n) {
      (Oa ||
        e.register(J) ||
        console.warn(`Please gsap.registerPlugin(ScrollTrigger)`),
        $a(this),
        this.init(t, n));
    }
    var t = e.prototype;
    return (
      (t.init = function (t, n) {
        if (
          ((this.progress = this.start = 0),
          this.vars && this.kill(!0, !0),
          !uo)
        )
          this.update = this.refresh = this.kill = _o;
        else {
          t = Zo(Oo(t) || Ao(t) || t.nodeType ? { trigger: t } : t, ls);
          var r = t,
            i = r.onUpdate,
            a = r.toggleClass,
            o = r.id,
            s = r.onToggle,
            c = r.onRefresh,
            l = r.scrub,
            u = r.trigger,
            d = r.pin,
            f = r.pinSpacing,
            p = r.invalidateOnRefresh,
            m = r.anticipatePin,
            h = r.onScrubComplete,
            g = r.onSnapComplete,
            _ = r.once,
            v = r.snap,
            y = r.pinReparent,
            b = r.pinSpacer,
            x = r.containerAnimation,
            S = r.fastScrollEnd,
            C = r.preventOverlaps,
            w =
              t.horizontal || (t.containerAnimation && t.horizontal !== !1)
                ? _a
                : va,
            T = !l && l !== 0,
            E = ya(t.scroller || Y),
            D = J.core.getCache(E),
            O = xo(E),
            k =
              (`pinType` in t
                ? t.pinType
                : la(E, `pinType`) || (O && `fixed`)) === `fixed`,
            A = [t.onEnter, t.onLeave, t.onEnterBack, t.onLeaveBack],
            j = T && t.toggleActions.split(` `),
            M = `markers` in t ? t.markers : ls.markers,
            N = O ? 0 : parseFloat(Yo(E)[`border` + w.p2 + Ko]) || 0,
            P = this,
            F =
              t.onRefreshInit &&
              function () {
                return t.onRefreshInit(P);
              },
            ee = wo(E, O, w),
            te = To(E, O),
            ne = 0,
            re = 0,
            I = 0,
            L = xa(E, w),
            ie,
            ae,
            oe,
            se,
            ce,
            R,
            le,
            ue,
            z,
            B,
            V,
            de,
            fe,
            pe,
            me,
            he,
            ge,
            H,
            U,
            _e,
            ve,
            ye,
            be,
            xe,
            W,
            Se,
            Ce,
            we,
            Te,
            Ee,
            De,
            Oe,
            ke,
            Ae,
            je,
            Me,
            Ne,
            Pe,
            Fe;
          if (
            ((P._startClamp = P._endClamp = !1),
            (P._dir = w),
            (m *= 45),
            (P.scroller = E),
            (P.scroll = x ? x.time.bind(x) : L),
            (se = L()),
            ro && L.rec == null && (L.rec = se),
            (P.vars = t),
            (n ||= t.animation),
            `refreshPriority` in t &&
              ((Ga = 1), t.refreshPriority === -9999 && (Rs = P)),
            (D.tweenScroll = D.tweenScroll || {
              top: ec(E, va),
              left: ec(E, _a),
            }),
            (P.tweenTo = ie = D.tweenScroll[w.p]),
            (P.scrubDuration = function (e) {
              ((ke = Ao(e) && e),
                ke
                  ? Oe
                    ? Oe.duration(e)
                    : (Oe = J.to(n, {
                        ease: `expo`,
                        totalProgress: `+=0`,
                        inherit: !1,
                        duration: ke,
                        paused: !0,
                        onComplete: function () {
                          return h && h(P);
                        },
                      }))
                  : (Oe && Oe.progress(1).kill(), (Oe = 0)));
            }),
            n &&
              ((n.vars.lazy = !1),
              (n._initted && !P.isReverted) ||
                (n.vars.immediateRender !== !1 &&
                  t.immediateRender !== !1 &&
                  n.duration() &&
                  n.render(0, !0, !0)),
              (P.animation = n.pause()),
              (n.scrollTrigger = P),
              P.scrubDuration(l),
              (Ee = 0),
              (o ||= n.vars.id)),
            v &&
              ((!jo(v) || v.push) && (v = { snapTo: v }),
              `scrollBehavior` in ja.style &&
                J.set(O ? [ja, Aa] : E, { scrollBehavior: `auto` }),
              q.forEach(function (e) {
                return (
                  ko(e) &&
                  e.target === (O ? ka.scrollingElement || Aa : E) &&
                  (e.smooth = !1)
                );
              }),
              (oe = ko(v.snapTo)
                ? v.snapTo
                : v.snapTo === `labels`
                  ? ts(n)
                  : v.snapTo === `labelsDirectional`
                    ? rs(n)
                    : v.directional === !1
                      ? J.utils.snap(v.snapTo)
                      : function (e, t) {
                          return ns(v.snapTo)(
                            e,
                            so() - re < 500 ? 0 : t.direction,
                          );
                        }),
              (Ae = v.duration || { min: 0.1, max: 2 }),
              (Ae = jo(Ae) ? Fa(Ae.min, Ae.max) : Fa(Ae, Ae)),
              (je = J.delayedCall(v.delay || ke / 2 || 0.1, function () {
                var e = L(),
                  t = so() - re < 500,
                  r = ie.tween;
                if (
                  (t || Math.abs(P.getVelocity()) < 10) &&
                  !r &&
                  !za &&
                  ne !== e
                ) {
                  var i = (e - R) / pe,
                    a = n && !T ? n.totalProgress() : i,
                    o = t ? 0 : ((a - De) / (so() - Ia)) * 1e3 || 0,
                    s = J.utils.clamp(-i, 1 - i, (X(o / 2) * o) / 0.185),
                    c = i + (v.inertia === !1 ? 0 : s),
                    l,
                    u,
                    d = v,
                    f = d.onStart,
                    p = d.onInterrupt,
                    m = d.onComplete;
                  if (
                    ((l = oe(c, P)),
                    Ao(l) || (l = c),
                    (u = Math.max(0, Math.round(R + l * pe))),
                    e <= le && e >= R && u !== e)
                  ) {
                    if (r && !r._initted && r.data <= X(u - e)) return;
                    (v.inertia === !1 && (s = l - i),
                      ie(
                        u,
                        {
                          duration: Ae(
                            X(
                              (Math.max(X(c - a), X(l - a)) * 0.185) /
                                o /
                                0.05 || 0,
                            ),
                          ),
                          ease: v.ease || `power3`,
                          data: X(u - e),
                          onInterrupt: function () {
                            return je.restart(!0) && p && No(P, p);
                          },
                          onComplete: function () {
                            (P.update(),
                              (ne = L()),
                              n &&
                                !T &&
                                (Oe
                                  ? Oe.resetTo(
                                      `totalProgress`,
                                      l,
                                      n._tTime / n._tDur,
                                    )
                                  : n.progress(l)),
                              (Ee = De =
                                n && !T ? n.totalProgress() : P.progress),
                              g && g(P),
                              m && No(P, m));
                          },
                        },
                        e,
                        s * pe,
                        u - e - s * pe,
                      ),
                      f && No(P, f, ie.tween));
                  }
                } else P.isActive && ne !== e && je.restart(!0);
              }).pause())),
            o && (ms[o] = P),
            (u = P.trigger = ya(u || (d !== !0 && d))),
            (Fe = u && u._gsap && u._gsap.stRevert),
            (Fe &&= Fe(P)),
            (d = d === !0 ? u : ya(d)),
            Oo(a) && (a = { targets: u, className: a }),
            d &&
              (f === !1 ||
                f === Go ||
                (f =
                  !f &&
                  d.parentNode &&
                  d.parentNode.style &&
                  Yo(d.parentNode).display === `flex`
                    ? !1
                    : Wo),
              (P.pin = d),
              (ae = J.core.getCache(d)),
              ae.spacer
                ? (me = ae.pinState)
                : (b &&
                    ((b = ya(b)),
                    b && !b.nodeType && (b = b.current || b.nativeElement),
                    (ae.spacerIsNative = !!b),
                    b && (ae.spacerState = Ks(b))),
                  (ae.spacer = H = b || ka.createElement(`div`)),
                  H.classList.add(`pin-spacer`),
                  o && H.classList.add(`pin-spacer-` + o),
                  (ae.pinState = me = Ks(d))),
              t.force3D !== !1 && J.set(d, { force3D: !0 }),
              (P.spacer = H = ae.spacer),
              (Te = Yo(d)),
              (xe = Te[f + w.os2]),
              (_e = J.getProperty(d)),
              (ve = J.quickSetter(d, w.a, Jo)),
              Us(d, H, Te),
              (ge = Ks(d))),
            M)
          ) {
            ((de = jo(M) ? Zo(M, cs) : cs),
              (B = fs(`scroller-start`, o, E, w, de, 0)),
              (V = fs(`scroller-end`, o, E, w, de, 0, B)),
              (U = B[`offset` + w.op.d2]));
            var Ie = ya(la(E, `content`) || E);
            ((ue = this.markerStart = fs(`start`, o, Ie, w, de, U, 0, x)),
              (z = this.markerEnd = fs(`end`, o, Ie, w, de, U, 0, x)),
              x && (Pe = J.quickSetter([ue, z], w.a, Jo)),
              !k &&
                !(aa.length && la(E, `fixedMarkers`) === !0) &&
                (Xo(O ? ja : E),
                J.set([B, V], { force3D: !0 }),
                (Se = J.quickSetter(B, w.a, Jo)),
                (we = J.quickSetter(V, w.a, Jo))));
          }
          if (x) {
            var Le = x.vars.onUpdate,
              Re = x.vars.onUpdateParams;
            x.eventCallback(`onUpdate`, function () {
              (P.update(0, 0, 1), Le && Le.apply(x, Re || []));
            });
          }
          if (
            ((P.previous = function () {
              return Z[Z.indexOf(P) - 1];
            }),
            (P.next = function () {
              return Z[Z.indexOf(P) + 1];
            }),
            (P.revert = function (e, t) {
              if (!t) return P.kill(!0);
              var r = e !== !1 || !P.enabled,
                i = Ra;
              r !== P.isReverted &&
                (r &&
                  ((Me = Math.max(L(), P.scroll.rec || 0)),
                  (I = P.progress),
                  (Ne = n && n.progress())),
                ue &&
                  [ue, z, B, V].forEach(function (e) {
                    return (e.style.display = r ? `none` : `block`);
                  }),
                r && ((Ra = P), P.update(r)),
                !d ||
                  (y && P.isActive) ||
                  (r ? Hs(d, H, me) : Us(d, H, Yo(d), W)),
                r || P.update(r),
                (Ra = i),
                (P.isReverted = r));
            }),
            (P.refresh = function (r, i, a, o) {
              if ((!Ra && P.enabled) || i) {
                if (d && r && lo) as(e, `scrollEnd`, Ss);
                else {
                  (!ks && F && F(P),
                    (Ra = P),
                    ie.tween && !a && (ie.tween.kill(), (ie.tween = 0)),
                    Oe && Oe.pause(),
                    p &&
                      n &&
                      (n.revert({ kill: !1 }).invalidate(),
                      n.getChildren
                        ? n.getChildren(!0, !0, !1).forEach(function (e) {
                            return (
                              e.vars.immediateRender && e.render(0, !0, !0)
                            );
                          })
                        : n.vars.immediateRender && n.render(0, !0, !0)),
                    P.isReverted || P.revert(!0, !0),
                    (P._subPinOffset = !1));
                  var s = ee(),
                    l = te(),
                    m = x ? x.duration() : Eo(E, w),
                    h = pe <= 0.01 || !pe,
                    g = 0,
                    _ = o || 0,
                    v = jo(a) ? a.end : t.end,
                    b = t.endTrigger || u,
                    S = jo(a)
                      ? a.start
                      : t.start ||
                        (t.start === 0 || !u ? 0 : d ? `0 0` : `0 100%`),
                    C = (P.pinnedContainer =
                      t.pinnedContainer && ya(t.pinnedContainer, P)),
                    D = (u && Math.max(0, Z.indexOf(P))) || 0,
                    A = D,
                    j,
                    ae,
                    oe,
                    de,
                    U,
                    ve,
                    xe,
                    Se,
                    we,
                    Te,
                    Ee,
                    De,
                    ke;
                  for (
                    M &&
                    jo(a) &&
                    ((De = J.getProperty(B, w.p)),
                    (ke = J.getProperty(V, w.p)));
                    A-- > 0;
                  )
                    ((ve = Z[A]),
                      ve.end || ve.refresh(0, 1) || (Ra = P),
                      (xe = ve.pin),
                      xe &&
                        (xe === u || xe === d || xe === C) &&
                        !ve.isReverted &&
                        ((Te ||= []), Te.unshift(ve), ve.revert(!0, !0)),
                      ve !== Z[A] && (D--, A--));
                  for (
                    ko(S) && (S = S(P)),
                      S = fo(S, `start`, P),
                      R =
                        Ys(
                          S,
                          u,
                          s,
                          w,
                          L(),
                          ue,
                          B,
                          P,
                          l,
                          N,
                          k,
                          m,
                          x,
                          P._startClamp && `_startClamp`,
                        ) || (d ? -0.001 : 0),
                      ko(v) && (v = v(P)),
                      Oo(v) &&
                        !v.indexOf(`+=`) &&
                        (~v.indexOf(` `)
                          ? (v = (Oo(S) ? S.split(` `)[0] : ``) + v)
                          : ((g = ds(v.substr(2), s)),
                            (v = Oo(S)
                              ? S
                              : (x
                                  ? J.utils.mapRange(
                                      0,
                                      x.duration(),
                                      x.scrollTrigger.start,
                                      x.scrollTrigger.end,
                                      R,
                                    )
                                  : R) + g),
                            (b = u))),
                      v = fo(v, `end`, P),
                      le =
                        Math.max(
                          R,
                          Ys(
                            v || (b ? `100% 0` : m),
                            b,
                            s,
                            w,
                            L() + g,
                            z,
                            V,
                            P,
                            l,
                            N,
                            k,
                            m,
                            x,
                            P._endClamp && `_endClamp`,
                          ),
                        ) || -0.001,
                      g = 0,
                      A = D;
                    A--;
                  )
                    ((ve = Z[A] || {}),
                      (xe = ve.pin),
                      xe &&
                        ve.start - ve._pinPush <= R &&
                        !x &&
                        ve.end > 0 &&
                        ((j =
                          ve.end -
                          (P._startClamp ? Math.max(0, ve.start) : ve.start)),
                        ((xe === u && ve.start - ve._pinPush < R) ||
                          xe === C) &&
                          isNaN(S) &&
                          (g += j * (1 - ve.progress)),
                        xe === d && (_ += j)));
                  if (
                    ((R += g),
                    (le += g),
                    P._startClamp && (P._startClamp += g),
                    P._endClamp &&
                      !ks &&
                      ((P._endClamp = le || -0.001),
                      (le = Math.min(le, Eo(E, w)))),
                    (pe = le - R || ((R -= 0.01) && 0.001)),
                    h &&
                      (I = J.utils.clamp(0, 1, J.utils.normalize(R, le, Me))),
                    (P._pinPush = _),
                    ue &&
                      g &&
                      ((j = {}),
                      (j[w.a] = `+=` + g),
                      C && (j[w.p] = `-=` + L()),
                      J.set([ue, z], j)),
                    d && !(io && P.end >= Eo(E, w)))
                  )
                    ((j = Yo(d)),
                      (de = w === va),
                      (oe = L()),
                      (ye = parseFloat(_e(w.a)) + _),
                      !m &&
                        le > 1 &&
                        ((Ee = (O ? ka.scrollingElement || Aa : E).style),
                        (Ee = {
                          style: Ee,
                          value: Ee[`overflow` + w.a.toUpperCase()],
                        }),
                        O &&
                          Yo(ja)[`overflow` + w.a.toUpperCase()] !== `scroll` &&
                          (Ee.style[`overflow` + w.a.toUpperCase()] =
                            `scroll`)),
                      Us(d, H, j),
                      (ge = Ks(d)),
                      (ae = Qo(d, !0)),
                      (Se = k && xa(E, de ? _a : va)()),
                      f
                        ? ((W = [f + w.os2, pe + _ + Jo]),
                          (W.t = H),
                          (A = f === Wo ? $o(d, w) + pe + _ : 0),
                          A &&
                            (W.push(w.d, A + Jo),
                            H.style.flexBasis !== `auto` &&
                              (H.style.flexBasis = A + Jo)),
                          Gs(W),
                          C &&
                            Z.forEach(function (e) {
                              e.pin === C &&
                                e.vars.pinSpacing !== !1 &&
                                (e._subPinOffset = !0);
                            }),
                          k && L(Me))
                        : ((A = $o(d, w)),
                          A &&
                            H.style.flexBasis !== `auto` &&
                            (H.style.flexBasis = A + Jo)),
                      k &&
                        ((U = {
                          top: ae.top + (de ? oe - R : Se) + Jo,
                          left: ae.left + (de ? Se : oe - R) + Jo,
                          boxSizing: `border-box`,
                          position: `fixed`,
                        }),
                        (U[Ro] = U[`max` + Ko] = Math.ceil(ae.width) + Jo),
                        (U[zo] = U[`max` + qo] = Math.ceil(ae.height) + Jo),
                        (U[Go] =
                          U[Go + Ho] =
                          U[Go + Bo] =
                          U[Go + Uo] =
                          U[Go + Vo] =
                            `0`),
                        (U[Wo] = j[Wo]),
                        (U[Wo + Ho] = j[Wo + Ho]),
                        (U[Wo + Bo] = j[Wo + Bo]),
                        (U[Wo + Uo] = j[Wo + Uo]),
                        (U[Wo + Vo] = j[Wo + Vo]),
                        (he = qs(me, U, y)),
                        ks && L(0)),
                      n
                        ? ((we = n._initted),
                          Ka(1),
                          n.render(n.duration(), !0, !0),
                          (be = _e(w.a) - ye + pe + _),
                          (Ce = Math.abs(pe - be) > 1),
                          k && Ce && he.splice(he.length - 2, 2),
                          n.render(0, !0, !0),
                          we || n.invalidate(!0),
                          n.parent || n.totalTime(n.totalTime()),
                          Ka(0))
                        : (be = pe),
                      Ee &&
                        (Ee.value
                          ? (Ee.style[`overflow` + w.a.toUpperCase()] =
                              Ee.value)
                          : Ee.style.removeProperty(`overflow-` + w.a)));
                  else if (u && L() && !x)
                    for (ae = u.parentNode; ae && ae !== ja;)
                      (ae._pinOffset &&
                        ((R -= ae._pinOffset), (le -= ae._pinOffset)),
                        (ae = ae.parentNode));
                  (Te &&
                    Te.forEach(function (e) {
                      return e.revert(!1, !0);
                    }),
                    (P.start = R),
                    (P.end = le),
                    (se = ce = ks ? Me : L()),
                    x || ks || ro || (se < Me && L(Me), (P.scroll.rec = 0)),
                    P.revert(!1, !0),
                    (re = so()),
                    je && ((ne = -1), je.restart(!0)),
                    (Ra = 0),
                    n &&
                      T &&
                      (n._initted || Ne) &&
                      n.progress() !== Ne &&
                      n.progress(Ne || 0, !0).render(n.time(), !0, !0),
                    (h || I !== P.progress || x || p || (n && !n._initted)) &&
                      (n &&
                        !T &&
                        (n._initted || I || n.vars.immediateRender !== !1) &&
                        n.totalProgress(
                          x && R < -0.001 && !I
                            ? J.utils.normalize(R, le, 0)
                            : I,
                          !0,
                        ),
                      (P.progress = h || (se - R) / pe === I ? 0 : I)),
                    d && f && (H._pinOffset = Math.round(P.progress * be)),
                    Oe && Oe.invalidate(),
                    isNaN(De) ||
                      ((De -= J.getProperty(B, w.p)),
                      (ke -= J.getProperty(V, w.p)),
                      $s(B, w, De),
                      $s(ue, w, De - (o || 0)),
                      $s(V, w, ke),
                      $s(z, w, ke - (o || 0))),
                    h && !ks && P.update(),
                    c && !ks && !fe && ((fe = !0), c(P), (fe = !1)));
                }
              }
            }),
            (P.getVelocity = function () {
              return ((L() - ce) / (so() - Ia)) * 1e3 || 0;
            }),
            (P.endAnimation = function () {
              (Mo(P.callbackAnimation),
                n &&
                  (Oe
                    ? Oe.progress(1)
                    : n.paused()
                      ? T || Mo(n, P.direction < 0, 1)
                      : Mo(n, n.reversed())));
            }),
            (P.labelToScroll = function (e) {
              return (
                (n &&
                  n.labels &&
                  (R || P.refresh() || R) +
                    (n.labels[e] / n.duration()) * pe) ||
                0
              );
            }),
            (P.getTrailing = function (e) {
              var t = Z.indexOf(P),
                n = P.direction > 0 ? Z.slice(0, t).reverse() : Z.slice(t + 1);
              return (
                Oo(e)
                  ? n.filter(function (t) {
                      return t.vars.preventOverlaps === e;
                    })
                  : n
              ).filter(function (e) {
                return P.direction > 0 ? e.end <= R : e.start >= le;
              });
            }),
            (P.update = function (e, t, r) {
              if (!x || r || e) {
                var o = ks === !0 ? Me : P.scroll(),
                  c = e ? 0 : (o - R) / pe,
                  u = c < 0 ? 0 : c > 1 ? 1 : c || 0,
                  p = P.progress,
                  h,
                  g,
                  b,
                  D,
                  O,
                  M,
                  N,
                  F;
                if (
                  (t &&
                    ((ce = se),
                    (se = x ? L() : o),
                    v && ((De = Ee), (Ee = n && !T ? n.totalProgress() : u))),
                  m &&
                    d &&
                    !Ra &&
                    !oo &&
                    lo &&
                    (!u && R < o + ((o - ce) / (so() - Ia)) * m
                      ? (u = 1e-4)
                      : u === 1 &&
                        le > o + ((o - ce) / (so() - Ia)) * m &&
                        (u = 0.9999)),
                  u !== p && P.enabled)
                ) {
                  if (
                    ((h = P.isActive = !!u && u < 1),
                    (g = !!p && p < 1),
                    (M = h !== g),
                    (O = M || !!u != !!p),
                    (P.direction = u > p ? 1 : -1),
                    (P.progress = u),
                    O &&
                      !Ra &&
                      ((b = u && !p ? 0 : u === 1 ? 1 : p === 1 ? 2 : 3),
                      T &&
                        ((D = (!M && j[b + 1] !== `none` && j[b + 1]) || j[b]),
                        (F =
                          n && (D === `complete` || D === `reset` || D in n)))),
                    C &&
                      (M || F) &&
                      (F || l || !n) &&
                      (ko(C)
                        ? C(P)
                        : P.getTrailing(C).forEach(function (e) {
                            return e.endAnimation();
                          })),
                    T ||
                      (Oe && !Ra && !oo
                        ? (Oe._dp._time - Oe._start !== Oe._time &&
                            Oe.render(Oe._dp._time - Oe._start),
                          Oe.resetTo
                            ? Oe.resetTo(`totalProgress`, u, n._tTime / n._tDur)
                            : ((Oe.vars.totalProgress = u),
                              Oe.invalidate().restart()))
                        : n && n.totalProgress(u, !!(Ra && (re || e)))),
                    d)
                  ) {
                    if ((e && f && (H.style[f + w.os2] = xe), !k))
                      ve(vo(ye + be * u));
                    else if (O) {
                      if (
                        ((N = !e && u > p && le + 1 > o && o + 1 >= Eo(E, w)),
                        y)
                      ) {
                        if (!e && (h || N)) {
                          var ee = Qo(d, !0),
                            te = o - R;
                          Zs(
                            d,
                            ja,
                            ee.top + (w === va ? te : 0) + Jo,
                            ee.left + (w === va ? 0 : te) + Jo,
                          );
                        } else Zs(d, H);
                      }
                      (Gs(h || N ? he : ge),
                        (Ce && u < 1 && h) ||
                          ve(ye + (u === 1 && !N ? be : 0)));
                    }
                  }
                  (v && !ie.tween && !Ra && !oo && je.restart(!0),
                    a &&
                      (M || (_ && u && (u < 1 || !ao))) &&
                      Pa(a.targets).forEach(function (e) {
                        return e.classList[h || _ ? `add` : `remove`](
                          a.className,
                        );
                      }),
                    i && !T && !e && i(P),
                    O && !Ra
                      ? (T &&
                          (F &&
                            (D === `complete`
                              ? n.pause().totalProgress(1)
                              : D === `reset`
                                ? n.restart(!0).pause()
                                : D === `restart`
                                  ? n.restart(!0)
                                  : n[D]()),
                          i && i(P)),
                        (M || !ao) &&
                          (s && M && No(P, s),
                          A[b] && No(P, A[b]),
                          _ && (u === 1 ? P.kill(!1, 1) : (A[b] = 0)),
                          M || ((b = u === 1 ? 1 : 3), A[b] && No(P, A[b]))),
                        S &&
                          !h &&
                          Math.abs(P.getVelocity()) > (Ao(S) ? S : 2500) &&
                          (Mo(P.callbackAnimation),
                          Oe
                            ? Oe.progress(1)
                            : Mo(n, D === `reverse` ? 1 : !u, 1)))
                      : T && i && !Ra && i(P));
                }
                if (we) {
                  var ne = x ? (o / x.duration()) * (x._caScrollDist || 0) : o;
                  (Se(ne + +!!B._isFlipped), we(ne));
                }
                Pe && Pe((-o / x.duration()) * (x._caScrollDist || 0));
              }
            }),
            (P.enable = function (t, n) {
              P.enabled ||
                ((P.enabled = !0),
                as(E, `resize`, ys),
                O || as(E, `scroll`, _s),
                F && as(e, `refreshInit`, F),
                t !== !1 && ((P.progress = I = 0), (se = ce = ne = L())),
                n !== !1 && P.refresh());
            }),
            (P.getTween = function (e) {
              return e && ie ? ie.tween : Oe;
            }),
            (P.setPositions = function (e, t, n, r) {
              if (x) {
                var i = x.scrollTrigger,
                  a = x.duration(),
                  o = i.end - i.start;
                ((e = i.start + (o * e) / a), (t = i.start + (o * t) / a));
              }
              (P.refresh(
                !1,
                !1,
                {
                  start: po(e, n && !!P._startClamp),
                  end: po(t, n && !!P._endClamp),
                },
                r,
              ),
                P.update());
            }),
            (P.adjustPinSpacing = function (e) {
              if (W && e) {
                var t = W.indexOf(w.d) + 1;
                ((W[t] = parseFloat(W[t]) + e + Jo),
                  (W[1] = parseFloat(W[1]) + e + Jo),
                  Gs(W));
              }
            }),
            (P.disable = function (t, n) {
              if (
                (t !== !1 && P.revert(!0, !0),
                P.enabled &&
                  ((P.enabled = P.isActive = !1),
                  n || (Oe && Oe.pause()),
                  (Me = 0),
                  ae && (ae.uncache = 1),
                  F && os(e, `refreshInit`, F),
                  je &&
                    (je.pause(), ie.tween && ie.tween.kill() && (ie.tween = 0)),
                  !O))
              ) {
                for (var r = Z.length; r--;)
                  if (Z[r].scroller === E && Z[r] !== P) return;
                (os(E, `resize`, ys), O || os(E, `scroll`, _s));
              }
            }),
            (P.kill = function (e, r) {
              (P.disable(e, r), Oe && !r && Oe.kill(), o && delete ms[o]);
              var i = Z.indexOf(P);
              (i >= 0 && Z.splice(i, 1),
                i === Va && Ls > 0 && Va--,
                (i = 0),
                Z.forEach(function (e) {
                  return e.scroller === P.scroller && (i = 1);
                }),
                i || ks || ro || (P.scroll.rec = 0),
                n &&
                  ((n.scrollTrigger = null),
                  e && n.revert({ kill: !1 }),
                  r || n.kill()),
                ue &&
                  [ue, z, B, V].forEach(function (e) {
                    return e.parentNode && e.parentNode.removeChild(e);
                  }),
                Rs === P && (Rs = 0),
                d &&
                  (ae && (ae.uncache = 1),
                  (i = 0),
                  Z.forEach(function (e) {
                    return e.pin === d && i++;
                  }),
                  i || (ae.spacer = 0)),
                t.onKill && t.onKill(P));
            }),
            Z.push(P),
            P.enable(!1, !1),
            Fe && Fe(P),
            n && n.add && !pe)
          ) {
            var ze = P.update;
            ((P.update = function () {
              ((P.update = ze), q.cache++, R || le || P.refresh());
            }),
              J.delayedCall(0.01, P.update),
              (pe = 0.01),
              (R = le = 0));
          } else P.refresh();
          d && Ms();
        }
      }),
      (e.register = function (t) {
        return (
          (Oa ||= ((J = t || bo()), yo() && window.document && e.enable(), uo)),
          Oa
        );
      }),
      (e.defaults = function (e) {
        if (e) for (var t in e) ls[t] = e[t];
        return ls;
      }),
      (e.disable = function (e, t) {
        ((uo = 0),
          Z.forEach(function (n) {
            return n[t ? `kill` : `disable`](e);
          }),
          os(Y, `wheel`, _s),
          os(ka, `scroll`, _s),
          clearInterval(La),
          os(ka, `touchcancel`, _o),
          os(ja, `touchstart`, _o),
          is(os, ka, `pointerdown,touchstart,mousedown`, ho),
          is(os, ka, `pointerup,touchend,mouseup`, go),
          Na.kill(),
          Do(os));
        for (var n = 0; n < q.length; n += 3)
          (ss(os, q[n], q[n + 1]), ss(os, q[n], q[n + 2]));
      }),
      (e.enable = function () {
        if (
          ((Y = window),
          (ka = document),
          (Aa = ka.documentElement),
          (ja = ka.body),
          J)
        ) {
          if (
            ((Pa = J.utils.toArray),
            (Fa = J.utils.clamp),
            ($a = J.core.context || _o),
            (Ka = J.core.suppressOverwrites || _o),
            (eo = Y.history.scrollRestoration || `auto`),
            (Is = Y.pageYOffset || 0),
            J.core.globals(`ScrollTrigger`, e),
            ja)
          ) {
            ((uo = 1),
              (to = document.createElement(`div`)),
              (to.style.height = `100vh`),
              (to.style.position = `absolute`),
              Ns(),
              mo(),
              Da.register(J),
              (e.isTouch = Da.isTouch),
              (Qa =
                Da.isTouch &&
                /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent)),
              (Ya = Da.isTouch === 1),
              as(Y, `wheel`, _s),
              (Ma = [Y, ka, Aa, ja]),
              J.matchMedia
                ? ((e.matchMedia = function (e) {
                    var t = J.matchMedia(),
                      n;
                    for (n in e) t.add(n, e[n]);
                    return t;
                  }),
                  J.addEventListener(`matchMediaInit`, function () {
                    (Es(), Ds());
                  }),
                  J.addEventListener(`matchMediaRevert`, function () {
                    return Ts();
                  }),
                  J.addEventListener(`matchMedia`, function () {
                    (Fs(0, 1), Cs(`matchMedia`));
                  }),
                  J.matchMedia().add(`(orientation: portrait)`, function () {
                    return (vs(), vs);
                  }))
                : console.warn(`Requires GSAP 3.11.0 or later`),
              vs(),
              as(ka, `scroll`, _s));
            var t = ja.hasAttribute(`style`),
              n = ja.style,
              r = n.borderTopStyle,
              i = J.core.Animation.prototype,
              a,
              o;
            for (
              i.revert ||
                Object.defineProperty(i, "revert", {
                  value: function () {
                    return this.time(-0.01, !0);
                  },
                }),
                n.borderTopStyle = `solid`,
                a = Qo(ja),
                va.m = Math.round(a.top + va.sc()) || 0,
                _a.m = Math.round(a.left + _a.sc()) || 0,
                r
                  ? (n.borderTopStyle = r)
                  : n.removeProperty(`border-top-style`),
                t ||
                  (ja.setAttribute(`style`, ``), ja.removeAttribute(`style`)),
                La = setInterval(gs, 250),
                J.delayedCall(0.5, function () {
                  return (oo = 0);
                }),
                as(ka, `touchcancel`, _o),
                as(ja, `touchstart`, _o),
                is(as, ka, `pointerdown,touchstart,mousedown`, ho),
                is(as, ka, `pointerup,touchend,mouseup`, go),
                Ba = J.utils.checkPrefix(`transform`),
                Vs.push(Ba),
                Oa = so(),
                Na = J.delayedCall(0.2, Fs).pause(),
                Wa = [
                  ka,
                  `visibilitychange`,
                  function () {
                    var e = Y.innerWidth,
                      t = Y.innerHeight;
                    ka.hidden
                      ? ((Ha = e), (Ua = t))
                      : (Ha !== e || Ua !== t) && ys();
                  },
                  ka,
                  `DOMContentLoaded`,
                  Fs,
                  Y,
                  `load`,
                  Fs,
                  Y,
                  `resize`,
                  ys,
                ],
                Do(as),
                Z.forEach(function (e) {
                  return e.enable(0, 1);
                }),
                o = 0;
              o < q.length;
              o += 3
            )
              (ss(os, q[o], q[o + 1]), ss(os, q[o], q[o + 2]));
          } else
            ka &&
              ka.addEventListener(`DOMContentLoaded`, function t() {
                (e.enable(), ka.removeEventListener(`DOMContentLoaded`, t));
              });
        }
      }),
      (e.config = function (t) {
        `limitCallbacks` in t && (ao = !!t.limitCallbacks);
        var n = t.syncInterval;
        ((n && clearInterval(La)) || ((La = n) && setInterval(gs, n)),
          `ignoreMobileResize` in t &&
            (Ya = e.isTouch === 1 && t.ignoreMobileResize),
          `autoRefreshEvents` in t &&
            (Do(os) || Do(as, t.autoRefreshEvents || `none`),
            (qa = (t.autoRefreshEvents + ``).indexOf(`resize`) === -1)));
      }),
      (e.scrollerProxy = function (e, t) {
        var n = ya(e),
          r = q.indexOf(n),
          i = xo(n);
        (~r && q.splice(r, i ? 6 : 2),
          t && (i ? aa.unshift(Y, t, ja, t, Aa, t) : aa.unshift(n, t)));
      }),
      (e.clearMatchMedia = function (e) {
        Z.forEach(function (t) {
          return t._ctx && t._ctx.query === e && t._ctx.kill(!0, !0);
        });
      }),
      (e.isInViewport = function (e, t, n) {
        var r = (Oo(e) ? ya(e) : e).getBoundingClientRect(),
          i = r[n ? Ro : zo] * t || 0;
        return n
          ? r.right - i > 0 && r.left + i < Y.innerWidth
          : r.bottom - i > 0 && r.top + i < Y.innerHeight;
      }),
      (e.positionInViewport = function (e, t, n) {
        Oo(e) && (e = ya(e));
        var r = e.getBoundingClientRect(),
          i = r[n ? Ro : zo],
          a =
            t == null
              ? i / 2
              : t in us
                ? us[t] * i
                : ~t.indexOf(`%`)
                  ? (parseFloat(t) * i) / 100
                  : parseFloat(t) || 0;
        return n ? (r.left + a) / Y.innerWidth : (r.top + a) / Y.innerHeight;
      }),
      (e.killAll = function (e) {
        if (
          (Z.slice(0).forEach(function (e) {
            return e.vars.id !== `ScrollSmoother` && e.kill();
          }),
          e !== !0)
        ) {
          var t = bs.killAll || [];
          ((bs = {}),
            t.forEach(function (e) {
              return e();
            }));
        }
      }),
      e
    );
  })();
((Q.version = `3.15.1`),
  (Q.saveStyles = function (e) {
    return e
      ? Pa(e).forEach(function (e) {
          if (e && e.style) {
            var t = ws.indexOf(e);
            (t >= 0 && ws.splice(t, 5),
              ws.push(
                e,
                e.style.cssText,
                e.getBBox && e.getAttribute(`transform`),
                J.core.getCache(e),
                $a(),
              ));
          }
        })
      : ws;
  }),
  (Q.revert = function (e, t) {
    return Ds(!e, t);
  }),
  (Q.create = function (e, t) {
    return new Q(e, t);
  }),
  (Q.refresh = function (e) {
    return e ? ys(!0) : (Oa || Q.register()) && Fs(!0);
  }),
  (Q.update = function (e) {
    return ++q.cache && zs(e === !0 ? 2 : 0);
  }),
  (Q.clearScrollMemory = Os),
  (Q.maxScroll = function (e, t) {
    return Eo(e, t ? _a : va);
  }),
  (Q.getScrollFunc = function (e, t) {
    return xa(ya(e), t ? _a : va);
  }),
  (Q.getById = function (e) {
    return ms[e];
  }),
  (Q.getAll = function () {
    return Z.filter(function (e) {
      return e.vars.id !== `ScrollSmoother`;
    });
  }),
  (Q.isScrolling = function () {
    return !!lo;
  }),
  (Q.snapDirectional = ns),
  (Q.addEventListener = function (e, t) {
    var n = bs[e] || (bs[e] = []);
    ~n.indexOf(t) || n.push(t);
  }),
  (Q.removeEventListener = function (e, t) {
    var n = bs[e],
      r = n && n.indexOf(t);
    r >= 0 && n.splice(r, 1);
  }),
  (Q.batch = function (e, t) {
    var n = [],
      r = {},
      i = t.interval || 0.016,
      a = t.batchMax || 1e9,
      o = function (e, t) {
        var n = [],
          r = [],
          o = J.delayedCall(i, function () {
            (t(n, r), (n = []), (r = []));
          }).pause();
        return function (e) {
          (n.length || o.restart(!0),
            n.push(e.trigger),
            r.push(e),
            a <= n.length && o.progress(1));
        };
      },
      s;
    for (s in t)
      r[s] =
        s.substr(0, 2) === `on` && ko(t[s]) && s !== `onRefreshInit`
          ? o(s, t[s])
          : t[s];
    return (
      ko(a) &&
        ((a = a()),
        as(Q, `refresh`, function () {
          return (a = t.batchMax());
        })),
      Pa(e).forEach(function (e) {
        var t = {};
        for (s in r) t[s] = r[s];
        ((t.trigger = e), n.push(Q.create(t)));
      }),
      n
    );
  }));
var tc = function (e, t, n, r) {
    return (
      t > r ? e(r) : t < 0 && e(0),
      n > r ? (r - t) / (n - t) : n < 0 ? t / (t - n) : 1
    );
  },
  nc = function e(t, n) {
    (n === !0
      ? t.style.removeProperty(`touch-action`)
      : (t.style.touchAction =
          n === !0
            ? `auto`
            : n
              ? `pan-` + n + (Da.isTouch ? ` pinch-zoom` : ``)
              : `none`),
      t === Aa && e(ja, n));
  },
  rc = { auto: 1, scroll: 1 },
  ic = function (e) {
    var t = e.event,
      n = e.target,
      r = e.axis,
      i = (t.changedTouches ? t.changedTouches[0] : t).target,
      a = i._gsap || J.core.getCache(i),
      o = so(),
      s;
    if (!a._isScrollT || o - a._isScrollT > 2e3) {
      for (
        ;
        i &&
        i !== ja &&
        ((i.scrollHeight <= i.clientHeight && i.scrollWidth <= i.clientWidth) ||
          !(rc[(s = Yo(i)).overflowY] || rc[s.overflowX]));
      )
        i = i.parentNode;
      ((a._isScroll =
        i &&
        i !== n &&
        !xo(i) &&
        (rc[(s = Yo(i)).overflowY] || rc[s.overflowX])),
        (a._isScrollT = o));
    }
    (a._isScroll || r === `x`) && (t.stopPropagation(), (t._gsapAllow = !0));
  },
  ac = function (e, t, n, r) {
    return Da.create({
      target: e,
      capture: !0,
      debounce: !1,
      lockAxis: !0,
      type: t,
      onWheel: (r &&= ic),
      onPress: r,
      onDrag: r,
      onScroll: r,
      onEnable: function () {
        return n && as(ka, Da.eventTypes[0], cc, !1, !0);
      },
      onDisable: function () {
        return os(ka, Da.eventTypes[0], cc, !0);
      },
    });
  },
  oc = /(input|label|select|textarea)/i,
  sc,
  cc = function (e) {
    var t = oc.test(e.target.tagName);
    (t || sc) && ((e._gsapAllow = !0), (sc = t));
  },
  lc = function (e) {
    (jo(e) || (e = {}),
      (e.preventDefault = e.isNormalizer = e.allowClicks = !0),
      e.type || (e.type = `wheel,touch`),
      (e.debounce = !!e.debounce),
      (e.id = e.id || `normalizer`));
    var t = e,
      n = t.normalizeScrollX,
      r = t.momentum,
      i = t.allowNestedScroll,
      a = t.onRelease,
      o,
      s,
      c = ya(e.target) || Aa,
      l = J.core.globals().ScrollSmoother,
      u = l && l.get(),
      d =
        Qa &&
        ((e.content && ya(e.content)) ||
          (u && e.content !== !1 && !u.smooth() && u.content())),
      f = xa(c, va),
      p = xa(c, _a),
      m = 1,
      h =
        (Da.isTouch && Y.visualViewport
          ? Y.visualViewport.scale * Y.visualViewport.width
          : Y.outerWidth) / Y.innerWidth,
      g = 0,
      _ = ko(r)
        ? function () {
            return r(o);
          }
        : function () {
            return r || 2.8;
          },
      v,
      y,
      b = ac(c, e.type, !0, i),
      x = function () {
        return (y = !1);
      },
      S = _o,
      C = _o,
      w = function () {
        ((s = Eo(c, va)),
          (C = Fa(+!!Qa, s)),
          n && (S = Fa(0, Eo(c, _a))),
          (v = As));
      },
      T = function () {
        ((d._gsap.y = vo(parseFloat(d._gsap.y) + f.offset) + `px`),
          (d.style.transform =
            `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ` +
            parseFloat(d._gsap.y) +
            `, 0, 1)`),
          (f.offset = f.cacheID = 0));
      },
      E = function () {
        if (y) {
          requestAnimationFrame(x);
          var e = vo(o.deltaY / 2),
            t = C(f.v - e);
          if (d && t !== f.v + f.offset) {
            f.offset = t - f.v;
            var n = vo((parseFloat(d && d._gsap.y) || 0) - f.offset);
            ((d.style.transform =
              `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ` +
              n +
              `, 0, 1)`),
              (d._gsap.y = n + `px`),
              (f.cacheID = q.cache),
              zs());
          }
          return !0;
        }
        (f.offset && T(), (y = !0));
      },
      D,
      O,
      k,
      A,
      j = function () {
        (w(),
          D.isActive() &&
            D.vars.scrollY > s &&
            (f() > s ? D.progress(1) && f(s) : D.resetTo(`scrollY`, s)));
      };
    return (
      d && J.set(d, { y: `+=0` }),
      (e.ignoreCheck = function (e) {
        return (
          (Qa && e.type === `touchmove` && E(e)) ||
          (m > 1.05 && e.type !== `touchstart`) ||
          o.isGesturing ||
          (e.touches && e.touches.length > 1)
        );
      }),
      (e.onPress = function () {
        y = !1;
        var e = m;
        ((m = vo(((Y.visualViewport && Y.visualViewport.scale) || 1) / h)),
          D.pause(),
          e !== m && nc(c, m > 1.01 || (!n && `x`)),
          (O = p()),
          (k = f()),
          w(),
          (v = As));
      }),
      (e.onRelease = e.onGestureStart =
        function (e, t) {
          if ((f.offset && T(), !t)) A.restart(!0);
          else {
            q.cache++;
            var r = _(),
              i,
              o;
            (n &&
              ((i = p()),
              (o = i + (r * 0.05 * -e.velocityX) / 0.227),
              (r *= tc(p, i, o, Eo(c, _a))),
              (D.vars.scrollX = S(o))),
              (i = f()),
              (o = i + (r * 0.05 * -e.velocityY) / 0.227),
              (r *= tc(f, i, o, Eo(c, va))),
              (D.vars.scrollY = C(o)),
              D.invalidate().duration(r).play(0.01),
              ((Qa && D.vars.scrollY >= s) || i >= s - 1) &&
                J.to({}, { onUpdate: j, duration: r }));
          }
          a && a(e);
        }),
      (e.onWheel = function () {
        (D._ts && D.pause(), so() - g > 1e3 && ((v = 0), (g = so())));
      }),
      (e.onChange = function (e, t, r, i, a) {
        if (
          (As !== v && w(),
          t && n && p(S(i[2] === t ? O + (e.startX - e.x) : p() + t - i[1])),
          r)
        ) {
          f.offset && T();
          var o = a[2] === r,
            s = o ? k + e.startY - e.y : f() + r - a[1],
            c = C(s);
          (o && s !== c && (k += c - s), f(c));
        }
        (r || t) && zs();
      }),
      (e.onEnable = function () {
        (nc(c, !n && `x`),
          Q.addEventListener(`refresh`, j),
          as(Y, `resize`, j),
          (f.smooth &&=
            ((f.target.style.scrollBehavior = `auto`), (p.smooth = !1))),
          b.enable());
      }),
      (e.onDisable = function () {
        (nc(c, !0),
          os(Y, `resize`, j),
          Q.removeEventListener(`refresh`, j),
          b.kill());
      }),
      (e.lockAxis = e.lockAxis !== !1),
      (o = new Da(e)),
      (o.iOS = Qa),
      Qa && !f() && f(1),
      Qa && J.ticker.add(_o),
      (A = o._dc),
      (D = J.to(o, {
        ease: `power4`,
        paused: !0,
        inherit: !1,
        scrollX: n ? `+=0.1` : `+=0`,
        scrollY: `+=0.1`,
        modifiers: {
          scrollY: Qs(f, f(), function () {
            return D.pause();
          }),
        },
        onUpdate: zs,
        onComplete: A.vars.onComplete,
      })),
      o
    );
  };
((Q.sort = function (e) {
  if (ko(e)) return Z.sort(e);
  var t = Y.pageYOffset || 0;
  return (
    Q.getAll().forEach(function (e) {
      return (e._sortY = e.trigger
        ? t + e.trigger.getBoundingClientRect().top
        : e.start + Y.innerHeight);
    }),
    Z.sort(
      e ||
        function (e, t) {
          return (
            (e.vars.refreshPriority || 0) * -1e6 +
            (e.vars.containerAnimation ? 1e6 : e._sortY) -
            ((t.vars.containerAnimation ? 1e6 : t._sortY) +
              (t.vars.refreshPriority || 0) * -1e6)
          );
        },
    )
  );
}),
  (Q.observe = function (e) {
    return new Da(e);
  }),
  (Q.normalizeScroll = function (e) {
    if (e === void 0) return Ja;
    if (e === !0 && Ja) return Ja.enable();
    if (e === !1) (Ja && Ja.kill(), (Ja = e));
    else {
      var t = e instanceof Da ? e : lc(e);
      return (
        Ja && Ja.target === t.target && Ja.kill(),
        xo(t.target) && (Ja = t),
        t
      );
    }
  }),
  (Q.core = {
    _getVelocityProp: Sa,
    _inputObserver: ac,
    _scrollers: q,
    _proxies: aa,
    bridge: {
      ss: function () {
        (lo || Cs(`scrollStart`), (lo = so()));
      },
      ref: function () {
        return Ra;
      },
    },
  }),
  bo() && J.registerPlugin(Q));
var uc = e((e) => {
    var t = Symbol.for(`react.transitional.element`),
      n = Symbol.for(`react.fragment`);
    function r(e, n, r) {
      var i = null;
      if (
        (r !== void 0 && (i = `` + r),
        n.key !== void 0 && (i = `` + n.key),
        `key` in n)
      )
        for (var a in ((r = {}), n)) a !== `key` && (r[a] = n[a]);
      else r = n;
      return (
        (n = r.ref),
        { $$typeof: t, type: e, key: i, ref: n === void 0 ? null : n, props: r }
      );
    }
    ((e.Fragment = n), (e.jsx = r), (e.jsxs = r));
  }),
  $ = e((e, t) => {
    t.exports = uc();
  })(),
  dc = (e) => `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(e),
  fc = dc(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 475 520"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F2CF86"/><stop offset=".25" stop-color="#C99A50"/><stop offset=".45" stop-color="#EDC67C"/><stop offset=".65" stop-color="#B8863F"/><stop offset=".85" stop-color="#E4BB72"/><stop offset="1" stop-color="#A87536"/></linearGradient></defs><path d="M474 372 444 387 417 393 276 394 247 400 226 408 146 455 102 484 415 484 442 478 460 470 472 461 470 460 470 376ZM452 174 440 185 404 206 354 228 219 281 163 305 106 334 73 356 40 388 25 408 15 426 5 452 1 471 1 518 2 516 22 517 34 503 55 482 90 454 234 356 308 306 348 276 401 232 432 200ZM474 8 450 30 410 61 344 104 187 200 144 230 116 252 81 286 64 308 40 349 30 378 46 354 67 330 90 312 125 290 194 256 392 176 432 156 454 140 473 124 472 122 472 13ZM26 184 38 155 52 135 73 116 95 104 111 98 129 96 228 96 258 90 286 80 343 42 382 22 419 8 452 0 142 0 123 4 104 11 91 18 68 35 51 54 37 78 30 98 26 120Z" fill="#5E3A1A" transform="translate(3 4)"/><path d="M474 372 444 387 417 393 276 394 247 400 226 408 146 455 102 484 415 484 442 478 460 470 472 461 470 460 470 376ZM452 174 440 185 404 206 354 228 219 281 163 305 106 334 73 356 40 388 25 408 15 426 5 452 1 471 1 518 2 516 22 517 34 503 55 482 90 454 234 356 308 306 348 276 401 232 432 200ZM474 8 450 30 410 61 344 104 187 200 144 230 116 252 81 286 64 308 40 349 30 378 46 354 67 330 90 312 125 290 194 256 392 176 432 156 454 140 473 124 472 122 472 13ZM26 184 38 155 52 135 73 116 95 104 111 98 129 96 228 96 258 90 286 80 343 42 382 22 419 8 452 0 142 0 123 4 104 11 91 18 68 35 51 54 37 78 30 98 26 120Z" fill="url(#g)" stroke="#8C5E2B" stroke-width="1.2"/></svg>`,
  );
(dc(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 162"><path fill="#4A1026" fill-rule="evenodd" d="M18.2 4.2 18.2 15.0 104.0 15.0 104.5 16.0 0.0 153.8 5.5 154.5 143.8 153.8 144.2 144.0 143.5 143.0 42.2 143.2 41.8 142.2 145.2 4.2ZM688.5 4.0 688.0 4.8 692.0 9.2 694.0 13.2 695.8 21.0 696.0 153.2 723.0 153.2 722.0 13.2 738.2 12.5 748.8 12.8 755.5 14.5 763.0 18.8 768.8 24.5 772.8 31.8 774.5 37.5 774.5 51.5 770.5 64.2 767.8 68.2 761.5 73.8 756.0 77.0 747.0 80.0 730.5 80.8 730.5 81.8 737.0 88.5 772.0 135.2 786.5 152.8 789.2 153.8 821.5 153.8 811.0 142.5 767.8 85.2 768.2 83.8 777.2 81.5 788.2 75.8 796.8 67.2 801.8 57.8 803.8 50.5 803.8 37.8 800.5 28.5 794.0 19.2 788.2 14.2 782.8 11.0 773.2 7.2 756.8 4.2ZM175.0 4.2 179.0 11.5 180.8 21.5 181.2 108.2 184.2 119.2 191.8 133.2 201.5 143.0 209.5 148.2 220.2 152.5 235.0 155.8 250.8 155.8 258.2 154.5 272.0 149.8 280.2 144.8 286.5 139.5 293.5 131.5 297.8 123.8 301.5 112.5 302.8 101.8 302.5 4.2 291.2 4.8 291.2 102.2 290.0 110.8 287.0 119.8 282.0 128.0 272.2 137.0 260.0 143.0 252.0 145.0 245.5 145.5 238.8 145.0 233.5 143.5 223.5 138.2 215.0 129.2 209.8 118.2 207.5 102.2 207.5 4.5ZM576.8 2.5 557.5 6.0 544.5 11.0 531.0 19.2 517.0 32.5 509.0 44.8 503.2 58.5 500.2 73.5 500.2 87.8 503.2 102.2 509.0 116.2 518.2 129.8 529.8 140.5 542.8 148.5 556.5 153.8 575.5 157.5 588.5 157.5 605.2 154.5 620.5 148.8 635.5 139.2 645.8 129.8 654.8 117.5 660.5 105.5 664.8 87.8 664.8 72.8 663.8 65.5 660.5 54.2 654.5 41.8 648.8 33.2 636.8 21.2 627.2 14.2 612.2 7.2 593.2 3.0ZM589.8 11.5 597.5 13.2 610.5 20.0 620.0 28.8 625.8 36.8 632.0 51.5 635.0 63.5 636.0 78.2 635.5 90.5 633.8 101.2 629.0 114.5 620.8 128.5 612.8 137.0 604.8 142.8 596.0 146.8 582.8 149.0 574.2 148.5 563.5 145.5 553.5 140.0 544.5 131.8 539.0 124.2 533.8 113.0 530.0 100.2 528.2 86.8 528.8 70.5 532.8 53.2 536.8 42.8 542.0 33.8 550.0 24.8 560.5 16.8 568.5 13.2 576.2 11.5ZM925.5 0.0 923.2 2.5 870.8 102.2 843.5 152.0 843.5 153.8 856.2 154.0 857.5 152.8 873.8 120.5 914.0 46.8 915.0 47.2 965.2 153.8 999.8 153.8ZM343.0 0.0 343.2 153.2 364.2 153.5 358.8 146.5 356.2 137.0 355.8 77.0 356.2 53.0 357.2 52.5 468.8 161.8 470.5 161.8 470.0 4.5 449.0 4.2 453.2 9.0 455.5 13.5 457.2 20.5 458.0 29.5 458.0 111.0 456.8 112.2 431.0 87.8 344.0 0.0Z"/></svg>`,
),
  dc(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 36"><path fill="#A8773A" fill-rule="evenodd" d="M871.0 6.0 867.0 13.5 866.2 20.2 868.0 26.0 873.2 32.0 877.5 34.5 881.2 35.0 882.0 35.8 887.5 35.8 888.0 35.0 893.5 34.5 899.8 31.8 899.8 15.2 886.5 15.2 885.5 16.2 886.0 19.8 894.8 20.2 894.8 28.5 891.2 30.8 884.5 31.0 879.5 30.0 873.8 25.2 872.0 21.2 872.0 14.5 873.8 10.5 877.5 6.8 883.2 4.5 889.0 4.5 896.8 7.8 899.0 4.8 898.0 3.0 890.2 0.0 882.0 0.0 881.5 0.8 876.0 2.2ZM835.0 0.0 831.5 0.0 830.0 1.0 829.8 23.8 825.8 20.2 809.2 1.0 805.0 1.2 805.5 35.0 809.2 35.8 810.5 34.2 810.5 11.5 829.5 31.8 831.5 34.8 835.8 34.5 835.8 1.2ZM767.0 0.0 766.5 34.0 767.8 35.2 771.2 35.8 772.2 34.5 772.0 0.0ZM709.2 0.0 708.2 1.2 708.2 3.8 709.2 5.0 720.8 5.5 721.0 34.8 721.5 35.8 726.0 35.8 726.8 34.2 726.0 5.8 727.0 5.0 737.5 5.0 738.5 4.2 738.5 1.0 737.8 0.0ZM656.8 0.0 656.0 1.2 656.2 34.8 682.0 34.8 682.5 32.5 681.5 30.8 662.0 30.8 661.2 30.0 661.0 21.8 662.0 19.8 678.5 19.5 678.5 15.2 661.5 15.0 660.8 6.8 662.0 5.0 680.5 5.0 681.5 3.2 681.0 0.0ZM625.5 0.0 620.2 0.0 602.8 18.2 601.8 17.8 601.0 1.2 596.0 1.2 596.5 35.0 601.5 35.0 601.8 26.2 606.5 20.8 608.2 21.5 619.8 34.8 625.5 34.8 611.5 16.8 611.8 15.5 625.5 1.5ZM536.5 0.0 536.2 35.5 541.5 35.8 542.0 23.2 549.5 23.0 558.2 34.8 560.8 35.8 563.5 35.8 564.0 34.2 556.0 22.5 561.0 20.0 564.0 15.5 564.0 8.2 562.0 4.2 559.2 2.0 555.8 0.8ZM541.2 5.5 542.2 4.5 554.8 5.0 558.2 8.2 559.0 13.5 557.8 15.8 554.8 18.0 542.2 18.0ZM488.0 0.0 475.0 26.8 472.0 34.8 473.5 35.8 476.2 35.8 480.2 27.5 481.5 26.8 494.5 26.8 498.0 28.0 501.2 35.0 506.2 35.0 506.8 34.5 490.8 0.0ZM489.0 9.5 489.8 9.8 495.5 21.5 494.8 22.8 483.0 22.2 485.8 15.0ZM404.0 0.0 403.8 35.8 408.2 35.8 408.8 34.8 409.2 11.8 422.2 30.8 425.0 29.2 436.0 12.8 437.0 12.2 437.2 34.2 438.0 35.0 443.0 34.8 443.0 0.0 438.8 0.0 423.5 22.0 420.8 19.0 409.0 1.5 407.5 0.0ZM314.8 0.0 314.8 34.8 339.0 35.0 339.8 34.0 339.0 30.8 321.2 30.8 319.8 29.8 319.8 0.0ZM266.5 0.0 257.0 18.2 250.0 34.0 250.2 35.0 255.5 34.8 258.2 27.5 261.8 26.5 275.5 27.0 279.8 34.8 285.0 34.8 268.8 0.0ZM267.2 9.5 273.5 21.5 273.0 22.5 261.2 22.2 262.8 17.5ZM200.5 0.0 199.5 1.2 199.5 4.0 200.2 5.0 211.2 5.0 212.0 5.8 212.2 34.5 217.2 35.0 217.2 6.2 218.5 5.0 228.8 5.0 229.8 4.0 229.8 0.0ZM167.2 0.0 167.0 34.2 167.8 35.8 172.5 35.8 172.8 0.0ZM117.5 0.0 116.8 0.8 112.8 1.2 108.5 3.5 104.0 8.0 101.8 13.5 101.8 23.0 104.0 27.8 108.8 32.5 112.5 34.5 116.2 35.0 116.8 35.8 121.5 35.8 122.2 35.0 127.5 34.5 134.5 31.0 134.5 15.8 130.5 15.2 120.5 16.0 120.5 19.5 128.8 19.8 129.5 20.5 129.5 28.0 128.0 29.8 125.5 30.8 119.0 31.2 112.5 29.2 108.0 24.5 106.8 21.2 106.8 14.2 107.5 12.2 110.8 7.8 115.2 5.0 124.0 4.5 131.5 7.8 133.8 5.0 133.8 3.8 124.5 0.0ZM65.5 0.0 64.8 1.2 64.8 34.5 65.5 35.2 69.5 35.8 70.5 34.5 70.5 1.0 69.8 0.0ZM0.0 1.0 0.8 34.5 18.0 35.0 23.2 33.8 28.8 30.5 31.5 27.5 34.0 20.8 33.5 12.2 31.0 7.8 27.2 4.0 20.2 0.8 17.2 0.8 16.2 0.0 1.5 0.0ZM6.2 5.0 19.5 5.0 23.0 6.8 25.8 9.5 28.5 15.5 28.5 20.2 27.0 24.2 24.0 27.8 17.2 30.8 6.5 30.8 5.8 30.0Z"/></svg>`,
  ));
function pc() {
  return (
    (0, l.useEffect)(() => {
      if (sessionStorage.getItem(`zn-viu`) === `1`) {
        window.dispatchEvent(new Event(`zn:entrou`));
        return;
      }
      let e = document.createElement(`div`);
      ((e.id = `ab`),
        (e.innerHTML = `<style>#ab #ab_filme{transition:none;object-fit:cover;background:#0E0507}
@media (max-aspect-ratio:3/5){#ab #ab_filme{object-fit:contain}}
#ab video{position:fixed;left:50%;top:50%;width:max(100vw,177.78vh);height:max(100vh,56.25vw);transform:translate(-50%,-50%);object-fit:cover;background:#1d0a0e;transition:width 2.4s cubic-bezier(.4,0,.2,1),height 2.4s cubic-bezier(.4,0,.2,1)}
#ab.fim{background:radial-gradient(90% 60% at 50% 50%,#3a141b,#1d0a0e)}
@media (max-aspect-ratio:1/1){#ab.fim video{width:190vw;height:106.9vw}}
#ab canvas{position:fixed;inset:0;width:100%;height:100%;touch-action:none;cursor:none}
#ab .ui{position:fixed;inset:0;pointer-events:none}
#ab .conv{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;color:#3A0E1C;transition:opacity .9s,filter .9s}
#ab .conv h1{font-family:Marcellus,serif;font-weight:400;font-size:clamp(34px,5vw,74px);letter-spacing:.01em}
#ab .conv p{margin-top:14px;font-size:14px;color:#6E5343;letter-spacing:.04em}
#ab .conv.some{opacity:0;filter:blur(8px)}
#ab .topo{position:absolute;top:22px;left:26px;right:26px;display:flex;justify-content:space-between;align-items:center;font-size:12px;letter-spacing:.06em;color:#5C4233;transition:color 1s}
#ab .topo.claro{color:rgba(246,235,220,.85)}
#ab .topo button{pointer-events:auto;background:rgba(255,250,242,.65);border:1px solid rgba(58,14,28,.22);border-radius:999px;padding:7px 15px;font:500 12px "Instrument Sans",sans-serif;letter-spacing:.04em;color:#3A0E1C;cursor:pointer;transition:background .3s,color .3s,border-color .3s}
#ab .topo button:hover{background:rgba(90,20,48,.12);border-color:rgba(90,20,48,.4)}
#ab .topo.claro button{background:rgba(14,5,7,.55);border-color:rgba(226,188,116,.38);color:#F6EBDC}
#ab .revelar{position:absolute;left:50%;bottom:7%;transform:translate(-50%,14px);opacity:0;pointer-events:none;padding:16px 36px;border:0;border-radius:999px;font:500 14px "Instrument Sans",sans-serif;letter-spacing:.06em;color:#FBEFD8;background:#5A1430;box-shadow:0 16px 40px -14px rgba(90,20,48,.6);cursor:pointer;transition:opacity .5s,transform .5s}
#ab .revelar.on{opacity:1;transform:translate(-50%,0);pointer-events:auto}
#ab .marca{position:absolute;left:0;right:0;bottom:9vh;text-align:center;color:#F6EBDC;opacity:0;transform:translateY(18px);transition:opacity 1.4s,transform 1.4s cubic-bezier(.2,.8,.2,1)}
#ab .marca.on{opacity:1;transform:none}
#ab .marca.on button{pointer-events:auto}
#ab .marca img{width:min(380px,72vw);filter:drop-shadow(0 6px 30px rgba(0,0,0,.6))}
#ab .marca p{margin-top:16px;font-family:Marcellus,serif;font-size:clamp(17px,1.6vw,22px);text-shadow:0 2px 20px rgba(0,0,0,.8)}
#ab .marca button{pointer-events:none;margin-top:22px;padding:14px 30px;border:0;border-radius:999px;font:500 14px "Instrument Sans",sans-serif;color:#1E0C0C;background:linear-gradient(180deg,#F6D899,#D9A85A);cursor:pointer;box-shadow:0 14px 40px -12px rgba(226,188,116,.6)}
#ab .sombra{position:fixed;inset:0;background:linear-gradient(180deg,transparent 62%,rgba(10,3,5,.7) 100%);opacity:0;transition:opacity 1.6s;pointer-events:none}
#ab .sombra.on{opacity:1}
#ab{position:fixed;inset:0;z-index:2147483000;background:#1d0a0e;overflow:hidden;font-family:"Instrument Sans",system-ui,sans-serif;-webkit-user-select:none;user-select:none;transition:opacity 1.1s cubic-bezier(.4,0,.2,1)}#ab *{box-sizing:border-box;margin:0;padding:0}#ab.sai{opacity:0;pointer-events:none}#ab .topo button{margin-left:18px}</style>
<video id="ab_v" src="./videos/sec-couro.mp4" muted playsinline autoplay preload="auto"></video>
<video id="ab_filme" playsinline preload="auto" style="opacity:0"></video>
<div class="sombra" id="ab_sombra"></div>
<div id="ab_clarao" style="position:fixed;inset:0;pointer-events:none;opacity:0;background:radial-gradient(70% 90% at 50% 50%,#FFF8E6 0%,#FFE2A6 45%,#E9B866 100%)"></div>
<canvas id="ab_c"></canvas>
<div class="ui">
  <div class="topo" id="ab_topo"><button id="ab_som">Som: desligado</button><span>ZUNORA</span></div>
  <div class="conv" id="ab_conv"><h1>Deixe a sua marca.</h1><p>Desenhe com o dedo ou o mouse.</p></div>
  <button class="revelar" id="ab_rev">Revelar</button>
  <div class="marca" id="ab_marca"><button id="ab_entrar">Entrar no site</button></div>
</div>
`),
        document.body.appendChild(e));
      let t = !0,
        n = 0,
        r = !1,
        i = document.documentElement;
      ((i.style.overflow = `hidden`),
        (document.body.style.overflow = `hidden`),
        window.scrollTo(0, 0),
        window.dispatchEvent(new Event(`zn:travou`)));
      function a() {
        if (!r) {
          r = !0;
          try {
            sessionStorage.setItem(`zn-viu`, `1`);
          } catch {}
          ((i.style.overflow = ``),
            (document.body.style.overflow = ``),
            window.dispatchEvent(new Event(`zn:entrou`)),
            e.classList.add(`sai`));
          try {
            Te && Pe(!1);
          } catch {}
          setTimeout(() => {
            ((t = !1),
              cancelAnimationFrame(n),
              removeEventListener(`resize`, k));
            try {
              (c.pause(),
                c.removeAttribute(`src`),
                c.load(),
                s.pause(),
                s.removeAttribute(`src`),
                s.load());
            } catch {}
            try {
              W && W.close();
            } catch {}
            try {
              [f, v, S, y, b, x, P, F, ne, ee, te, j].forEach((e) => {
                e && ((e.width = 0), (e.height = 0));
              });
            } catch {}
            e.remove();
          }, 1200);
        }
      }
      let o = (t) => e.querySelector(`#ab_` + t),
        s = o(`v`),
        c = o(`filme`);
      c.preload = `none`;
      let l =
          innerWidth / innerHeight < 0.8
            ? `./videos/filme-cel.mp4`
            : `./videos/filme.mp4`,
        u = !1,
        d = () => {
          u || ((u = !0), (c.src = l), (c.preload = `auto`), c.load());
        };
      (s.addEventListener(`loadedmetadata`, () => {
        s.currentTime = 2.6;
      }),
        s.addEventListener(`timeupdate`, () => {
          s.currentTime > 4.3 && (s.currentTime = 2.6);
        }));
      let f = o(`c`),
        p = f.getContext(`2d`),
        m = o(`v`),
        h,
        g,
        _,
        v,
        y,
        b,
        x,
        S,
        C = () => {
          let e = document.createElement(`canvas`);
          ((e.width = h * _), (e.height = g * _));
          let t = e.getContext(`2d`);
          return (t.scale(_, _), [e, t]);
        },
        w = [],
        T = matchMedia(`(pointer:coarse)`).matches,
        E = T ? 17 : 22;
      function D() {
        let [e, t] = C(),
          n = t.createRadialGradient(
            h / 2,
            g * 0.42,
            0,
            h / 2,
            g * 0.42,
            Math.max(h, g) * 0.75,
          );
        (n.addColorStop(0, `#FDF8F0`),
          n.addColorStop(0.6, `#F5EADA`),
          n.addColorStop(1, `#E8D7BE`),
          (t.fillStyle = n),
          t.fillRect(0, 0, h, g));
        for (let e = 0; e < (h * g) / 90; e++)
          ((t.fillStyle = `rgba(120,80,40,` + Math.random() * 0.05 + `)`),
            t.fillRect(
              Math.random() * h,
              Math.random() * g,
              Math.random() * 2 + 0.5,
              Math.random() * 1.2,
            ));
        for (let e = 0; e < 60; e++) {
          ((t.strokeStyle = `rgba(150,110,60,.05)`),
            (t.lineWidth = 0.6),
            t.beginPath());
          let e = Math.random() * h,
            n = Math.random() * g;
          (t.moveTo(e, n),
            t.bezierCurveTo(
              e + Math.random() * 60 - 30,
              n + Math.random() * 30,
              e + Math.random() * 90 - 45,
              n + Math.random() * 40,
              e + Math.random() * 120 - 60,
              n + Math.random() * 50,
            ),
            t.stroke());
        }
        return e;
      }
      function O() {
        let [e, t] = C(),
          n = t.createLinearGradient(0, 0, h, g);
        return (
          [
            [0, `#FFB347`],
            [0.25, `#FFE3A0`],
            [0.5, `#FF9F3A`],
            [0.75, `#FFD27A`],
            [1, `#FF8A2A`],
          ].forEach(([e, t]) => n.addColorStop(e, t)),
          (t.fillStyle = n),
          t.fillRect(0, 0, h, g),
          e
        );
      }
      function k() {
        ((h = innerWidth),
          (g = innerHeight),
          (_ = T ? 1 : Math.min(devicePixelRatio || 1, 2)),
          (f.width = h * _),
          (f.height = g * _),
          p.setTransform(_, 0, 0, _, 0, 0),
          (v = D()),
          (S = O()),
          ([y] = C()),
          ([b] = C()),
          ([x] = C()),
          (w.length = 0),
          (A = !0));
      }
      let A = !0;
      (addEventListener(`resize`, k), k());
      let j = null;
      function M(e, t, n, r) {
        if (
          (T || (j && j.width === Math.round(h / 2)) || (j = re(h / 2, g / 2)),
          j)
        ) {
          let i = j.getContext(`2d`);
          (i.setTransform(0.5, 0, 0, 0.5, 0, 0),
            (i.strokeStyle = `rgba(255,246,214,1)`),
            (i.lineCap = `round`),
            (i.lineJoin = `round`),
            (i.lineWidth = r + 10),
            i.beginPath(),
            i.moveTo((e[0] + t[0]) / 2, (e[1] + t[1]) / 2),
            i.quadraticCurveTo(
              t[0],
              t[1],
              (t[0] + n[0]) / 2,
              (t[1] + n[1]) / 2,
            ),
            i.stroke());
        }
        let i = [
          [y, r],
          [b, r + 3.2],
          [x, r + 7],
        ];
        for (let [r, a] of i) {
          let i = r.getContext(`2d`);
          ((i.strokeStyle = `#000`),
            (i.lineCap = `round`),
            (i.lineJoin = `round`),
            (i.lineWidth = a),
            i.beginPath(),
            i.moveTo((e[0] + t[0]) / 2, (e[1] + t[1]) / 2),
            i.quadraticCurveTo(
              t[0],
              t[1],
              (t[0] + n[0]) / 2,
              (t[1] + n[1]) / 2,
            ),
            i.stroke());
        }
        A = !0;
      }
      function N(e, t, n) {
        for (let [r, i] of [
          [y, n],
          [b, n + 1.6],
          [x, n + 3.5],
        ]) {
          let n = r.getContext(`2d`);
          ((n.fillStyle = `#000`),
            n.beginPath(),
            n.arc(e, t, i, 0, 7),
            n.fill());
        }
        A = !0;
      }
      let P = null,
        F = null,
        ee = null,
        te = null,
        ne = null,
        re = (e, t) => {
          let n = document.createElement(`canvas`);
          return (
            (n.width = Math.max(1, e | 0)),
            (n.height = Math.max(1, t | 0)),
            n
          );
        };
      function I() {
        (P && P.width === h * _) ||
          ((P = re(h * _, g * _)),
          (F = re(h * _, g * _)),
          (ee = re((h * _) / 4, (g * _) / 4)),
          (te = re((h * _) / 14, (g * _) / 14)),
          (ne = re(h * _, g * _)));
        let e = P.getContext(`2d`),
          t = F.getContext(`2d`);
        ((t.globalCompositeOperation = `source-over`),
          t.clearRect(0, 0, F.width, F.height),
          t.drawImage(b, 0, 0),
          (t.globalCompositeOperation = `source-in`),
          t.drawImage(S, 0, 0),
          (t.globalCompositeOperation = `destination-out`),
          t.drawImage(y, 0, 0),
          (e.globalCompositeOperation = `source-over`),
          e.clearRect(0, 0, P.width, P.height),
          e.drawImage(v, 0, 0));
        let n = R();
        ((n.x.globalCompositeOperation = `source-over`),
          n.x.clearRect(0, 0, h, g),
          n.x.drawImage(x, 0, 0, h, g),
          (n.x.globalCompositeOperation = `source-in`),
          (n.x.fillStyle = `#2A140B`),
          n.x.fillRect(0, 0, h, g),
          (e.globalAlpha = 0.9),
          (e.globalCompositeOperation = `source-over`),
          e.drawImage(n.c, 0, 0),
          (e.globalAlpha = 1),
          (e.globalCompositeOperation = `destination-out`),
          e.drawImage(b, 0, 0),
          (e.globalCompositeOperation = `source-over`),
          e.drawImage(F, 0, 0),
          [ee, te].forEach((e) => {
            let t = e.getContext(`2d`);
            (t.clearRect(0, 0, e.width, e.height),
              (t.imageSmoothingQuality = `high`),
              t.drawImage(F, 0, 0, e.width, e.height));
          }));
        let r = ne.getContext(`2d`);
        ((r.globalCompositeOperation = `source-over`),
          r.clearRect(0, 0, ne.width, ne.height),
          (r.imageSmoothingQuality = `high`),
          (r.globalAlpha = 1),
          r.drawImage(ee, 0, 0, ne.width, ne.height),
          r.drawImage(ee, 0, 0, ne.width, ne.height),
          (r.globalAlpha = 0.5),
          r.drawImage(te, 0, 0, ne.width, ne.height),
          (r.globalAlpha = 0.7),
          r.drawImage(F, 0, 0),
          (r.globalAlpha = 1),
          (r.globalCompositeOperation = `destination-out`),
          r.drawImage(y, 0, 0));
      }
      function L(e) {
        A &&= (I(), !1);
        let t = 0.8 + 0.2 * Math.sin(e / 90) * Math.sin(e / 53);
        if (
          ((p.globalCompositeOperation = `source-over`),
          p.clearRect(0, 0, h, g),
          (p.imageSmoothingQuality = `high`),
          p.drawImage(P, 0, 0, h, g),
          (p.globalCompositeOperation = `lighter`),
          (p.globalAlpha = t),
          p.drawImage(ne, 0, 0, h, g),
          (p.globalAlpha = 1),
          j)
        ) {
          let e = j.getContext(`2d`);
          (e.setTransform(1, 0, 0, 1, 0, 0),
            (e.globalCompositeOperation = `destination-out`),
            (e.fillStyle = `rgba(0,0,0,.055)`),
            e.fillRect(0, 0, j.width, j.height),
            (e.globalCompositeOperation = `source-over`),
            (p.globalAlpha = 0.85),
            p.drawImage(j, 0, 0, h, g),
            (p.globalAlpha = 1));
        }
        if (z && fe === `desenhar` && !pe) {
          let t = me * (1.5 + 0.25 * Math.sin(e / 70));
          ((p.globalAlpha = 0.95),
            p.drawImage(ie, z[0] - t, z[1] - t, t * 2, t * 2),
            (p.globalAlpha = 0.5),
            p.drawImage(ie, z[0] - t * 2.4, z[1] - t * 2.4, t * 4.8, t * 4.8),
            (p.globalAlpha = 1));
        }
        p.lineCap = `round`;
        for (let e = ae.length - 1; e >= 0; e--) {
          let t = ae[e];
          if (((t.v += 1 / 60 / t.d), t.v >= 1)) {
            ae.splice(e, 1);
            continue;
          }
          let n = t.x,
            r = t.y;
          ((t.vy += 0.12), (t.vx *= 0.985), (t.x += t.vx), (t.y += t.vy));
          let i = 1 - t.v;
          if (
            ((p.strokeStyle =
              `rgba(255,` +
              ((200 + 55 * (1 - t.v)) | 0) +
              `,` +
              ((120 + 100 * (1 - t.v)) | 0) +
              `,` +
              i +
              `)`),
            (p.lineWidth = t.r * (1 - t.v * 0.6)),
            p.beginPath(),
            p.moveTo(n - t.vx * 1.5, r - t.vy * 1.5),
            p.lineTo(t.x, t.y),
            p.stroke(),
            t.v < 0.4)
          ) {
            p.globalAlpha = i * 0.6;
            let e = t.r * 3;
            (p.drawImage(ie, t.x - e, t.y - e, e * 2, e * 2),
              (p.globalAlpha = 1));
          }
        }
        ((p.globalAlpha = 1), (p.globalCompositeOperation = `source-over`));
      }
      let ie = (() => {
          let e = re(32, 32),
            t = e.getContext(`2d`),
            n = t.createRadialGradient(16, 16, 0, 16, 16, 16);
          return (
            n.addColorStop(0, `rgba(255,244,210,1)`),
            n.addColorStop(0.3, `rgba(255,176,70,.75)`),
            n.addColorStop(1, `rgba(255,120,30,0)`),
            (t.fillStyle = n),
            t.fillRect(0, 0, 32, 32),
            e
          );
        })(),
        ae = [],
        oe = T ? 30 : 180;
      function se(e, t, n, r = 0, i = 0) {
        for (let a = 0; a < n && ae.length < oe; a++) {
          let n = Math.random() * 6.283,
            a = 1.5 + Math.random() * 4;
          ae.push({
            x: e,
            y: t,
            vx: Math.cos(n) * a - r * 0.25,
            vy: Math.sin(n) * a - i * 0.25 - 1.5,
            v: 0,
            d: 0.35 + Math.random() * 0.6,
            r: 1 + Math.random() * 1.4,
          });
        }
      }
      let ce = null;
      function R() {
        if (!ce || ce.c.width !== h * _) {
          let [e, t] = C();
          (t.setTransform(1, 0, 0, 1, 0, 0),
            t.scale(_, _),
            (ce = { c: e, x: t }));
        }
        return ce;
      }
      let le = 0,
        ue = null,
        z = null,
        B = [],
        V = null,
        de = !1,
        fe = `desenhar`,
        pe = !0,
        me = E * 2;
      (f.addEventListener(`pointerdown`, (e) => {
        fe === `desenhar` &&
          (f.setPointerCapture(e.pointerId),
          (ue = [e.clientX, e.clientY]),
          (z = ue.slice()),
          (B = [z.slice(), z.slice()]),
          (pe = !1),
          (me = E * 1.6),
          N(z[0], z[1], me / 2),
          w.push(z.slice()),
          _e(),
          Pe(!0));
      }),
        f.addEventListener(`pointermove`, (e) => {
          ((V = [e.clientX, e.clientY]), pe || (ue = [e.clientX, e.clientY]));
        }));
      let he = () => {
        ((pe = !0),
          Pe(!1),
          fe === `desenhar` &&
            le > Math.max(h, g) * 0.85 &&
            setTimeout(() => {
              fe === `desenhar` && pe && o(`rev`).onclick();
            }, 450));
      };
      f.addEventListener(`pointerup`, he);
      let ge = !1,
        H = () => {
          if ((je(), !ge && W)) {
            ge = !0;
            try {
              navigator.audioSession &&
                (navigator.audioSession.type = `playback`);
            } catch {}
            try {
              let e = W.createBuffer(1, 1, 22050),
                t = W.createBufferSource();
              ((t.buffer = e), t.connect(W.destination), t.start(0));
            } catch {}
          }
        };
      (f.addEventListener(`touchend`, H, { passive: !0 }),
        f.addEventListener(`pointerup`, H),
        e.addEventListener(`click`, H),
        f.addEventListener(`pointercancel`, he));
      function U() {
        if (!z || !ue) return;
        let e = ue[0] - z[0],
          t = ue[1] - z[1],
          n = Math.hypot(e, t);
        if (pe && n < 1) {
          z = null;
          return;
        }
        if (n < 0.5) return;
        let r = [z[0] + e * 0.32, z[1] + t * 0.32],
          i = Math.hypot(r[0] - z[0], r[1] - z[1]),
          a = E * 2 * Math.max(0.55, Math.min(1.25, 1.35 - i / 26));
        ((me += (a - me) * 0.2),
          B.push(r),
          B.length > 3 && B.shift(),
          (z = r),
          M(B[0], B[1], B[2], me),
          w.push(r.slice()),
          (le += i),
          se(
            r[0],
            r[1],
            Math.min(4, (1 + i / 6) | 0),
            r[0] - B[1][0],
            r[1] - B[1][1],
          ),
          Le(i));
      }
      function _e() {
        (d(),
          de ||
            ((de = !0),
            o(`conv`).classList.add(`some`),
            setTimeout(() => o(`rev`).classList.add(`on`), 1600),
            m.play().catch(() => {})));
      }
      let ve = 0;
      o(`rev`).onclick = () => {
        fe === `desenhar` &&
          ((fe = `revela`),
          (ve = performance.now()),
          o(`rev`).classList.remove(`on`),
          o(`conv`).classList.add(`some`),
          w.length || w.push([h / 2, g / 2]),
          ze());
      };
      function ye(e) {
        let t = Math.min((e - ve) / 1500, 1),
          n = t * t * (3 - 2 * t),
          r = Math.hypot(h, g) * 0.6,
          i = Math.max(1, Math.floor(w.length / 140));
        for (let e = 0; e < w.length; e += i) {
          let t = w[e];
          if ((N(t[0], t[1], E + n * r), j)) {
            let e = j.getContext(`2d`);
            (e.setTransform(0.5, 0, 0, 0.5, 0, 0),
              (e.fillStyle = `rgba(255,240,200,.5)`),
              e.beginPath(),
              e.arc(t[0], t[1], E + n * r + 14, 0, 7),
              e.fill());
          }
        }
        for (let e = 0; e < 4; e++) {
          let e = w[(Math.random() * w.length) | 0];
          se(e[0], e[1], 2);
        }
        let a = o(`clarao`);
        ((a.style.opacity = Math.max(0, (t - 0.55) / 0.45)),
          t >= 1 && ((fe = `fim`), be()));
      }
      function be() {
        d();
        let e = o(`clarao`);
        ((e.style.opacity = 1),
          (f.style.opacity = 0),
          s.pause(),
          (s.style.opacity = 0));
        try {
          c.currentTime = 0.3;
        } catch {}
        let Je = setTimeout(() => a(), 8500);
        ((c.muted = !Se),
          (c.style.opacity = 1),
          (c.onerror = () => {
            (clearTimeout(Je), a());
          }),
          (c.onended = () => {
            (clearTimeout(Je), a());
          }),
          c.play().catch(() => {
            ((c.muted = !0),
              c.play().catch(() => {
                (clearTimeout(Je), a());
              }));
          }));
        let t = performance.now();
        ((function n() {
          let r = Math.min((performance.now() - t) / 900, 1);
          ((e.style.opacity = 1 - r * r), r < 1 && requestAnimationFrame(n));
        })(),
          o(`topo`).classList.add(`claro`));
      }
      function xe(e) {
        if (
          (fe === `desenhar` && U(),
          fe === `revela` && ye(e),
          L(e),
          fe === `desenhar` && V && !T)
        ) {
          (p.save(), (p.globalCompositeOperation = `source-over`));
          let e = p.createRadialGradient(V[0], V[1], 0, V[0], V[1], 14);
          (e.addColorStop(0, `rgba(255,236,190,.95)`),
            e.addColorStop(0.35, `rgba(214,160,80,.6)`),
            e.addColorStop(1, `rgba(214,160,80,0)`),
            (p.fillStyle = e),
            p.beginPath(),
            p.arc(V[0], V[1], 14, 0, 7),
            p.fill(),
            p.restore());
        }
        t && (n = requestAnimationFrame(xe));
      }
      n = requestAnimationFrame(xe);
      let W = null,
        Se = !0,
        Ce = null,
        we = null,
        Te = null,
        Ee = null,
        De = null,
        Oe = 0,
        ke = 7,
        Ae = 0;
      ((o(`som`).textContent = `Som: ligado`),
        (o(`som`).onclick = () => {
          ((Se = !Se),
            (o(`som`).textContent = `Som: ` + (Se ? `ligado` : `desligado`)),
            Ce && (Ce.gain.value = Se ? 0.8 : 0),
            c && (c.muted = !Se));
        }));
      function je() {
        try {
          if (!W) {
            ((W = new (window.AudioContext || window.webkitAudioContext)()),
              (Ce = W.createGain()),
              (Ce.gain.value = Se ? 0.8 : 0));
            let e = W.createDynamicsCompressor();
            ((e.threshold.value = -18),
              (e.ratio.value = 6),
              Ce.connect(e),
              e.connect(W.destination),
              (we = W.createDelay()),
              (we.delayTime.value = 0.23));
            let t = W.createGain();
            t.gain.value = 0.22;
            let n = W.createBiquadFilter();
            ((n.type = `lowpass`),
              (n.frequency.value = 2600),
              we.connect(t),
              t.connect(n),
              n.connect(we));
            let r = W.createGain();
            ((r.gain.value = 0.3), we.connect(r), r.connect(Ce));
          }
          W.state === `suspended` && W.resume();
        } catch {}
        return W;
      }
      let Me = null;
      function Ne() {
        if (Me) return Me;
        let e = W.sampleRate * 2,
          t = W.createBuffer(1, e, W.sampleRate),
          n = t.getChannelData(0),
          r = 0;
        for (let t = 0; t < e; t++) {
          let e = Math.random() * 2 - 1;
          ((r = (r + 0.04 * e) / 1.04), (n[t] = (e * 0.35 + r * 2.2) * 0.6));
        }
        return (Me = t);
      }
      function Pe(e) {
        if (je()) {
          if (e && !Te)
            ((Te = W.createBufferSource()),
              (Te.buffer = Ne()),
              (Te.loop = !0),
              (De = W.createBiquadFilter()),
              (De.type = `lowpass`),
              (De.Q.value = 0.3),
              (De.frequency.value = 700),
              (Ee = W.createGain()),
              (Ee.gain.value = 0),
              Te.connect(De),
              De.connect(Ee),
              Ee.connect(Ce),
              Te.start(),
              Re());
          else if (!e && Te) {
            let e = Te,
              t = Ee;
            (t.gain.cancelScheduledValues(W.currentTime),
              t.gain.setTargetAtTime(0, W.currentTime, 0.06),
              setTimeout(() => {
                try {
                  e.stop();
                } catch {}
              }, 400),
              (Te = null));
          }
        }
      }
      let Fe = [
        261.6, 293.7, 329.6, 392, 440, 523.3, 587.3, 659.3, 784, 880, 1046.5,
        1174.7, 1318.5, 1568,
      ];
      function Ie(e, t) {
        let n = W.currentTime;
        [1, 2].forEach((r, i) => {
          let a = W.createOscillator(),
            o = W.createGain();
          ((a.type = `sine`),
            (a.frequency.value = e * r),
            o.gain.setValueAtTime(0, n),
            o.gain.linearRampToValueAtTime(t / (1 + i * 3), n + 0.012),
            o.gain.exponentialRampToValueAtTime(1e-4, n + 1.2 / (1 + i)),
            a.connect(o),
            o.connect(Ce),
            i === 0 && o.connect(we),
            a.start(n),
            a.stop(n + 1.3));
        });
      }
      function Le(e) {
        if (!W) return;
        let t = W.currentTime;
        if (
          (Ee &&
            (Ee.gain.setTargetAtTime(
              Math.min(0.09, 0.015 + e * 0.003),
              t,
              0.08,
            ),
            De.frequency.setTargetAtTime(
              Math.min(2600, 600 + e * 55),
              t,
              0.08,
            )),
          (Oe += e),
          Oe > 110 && performance.now() - Ae > 160)
        ) {
          ((Oe = 0), (Ae = performance.now()));
          let e = B[2][1] - B[1][1];
          ((ke = Math.max(
            0,
            Math.min(
              Fe.length - 1,
              ke + (e < 0 ? 1 : -1) * (Math.random() < 0.7 ? 1 : 2),
            ),
          )),
            Ie(Fe[ke], 0.028),
            navigator.vibrate && navigator.vibrate(4));
        }
      }
      function Re() {
        let e = W.currentTime,
          t = W.createBufferSource();
        t.buffer = Ne();
        let n = W.createBiquadFilter();
        ((n.type = `lowpass`),
          n.frequency.setValueAtTime(200, e),
          n.frequency.exponentialRampToValueAtTime(3e3, e + 0.25));
        let r = W.createGain();
        (r.gain.setValueAtTime(0, e),
          r.gain.linearRampToValueAtTime(0.1, e + 0.06),
          r.gain.exponentialRampToValueAtTime(0.001, e + 0.5),
          t.connect(n),
          n.connect(r),
          r.connect(Ce),
          t.start(e),
          t.stop(e + 0.7));
      }
      function ze() {
        if (!je()) return;
        let e = W.currentTime,
          t = W.createBufferSource();
        ((t.buffer = Ne()), (t.loop = !0));
        let n = W.createBiquadFilter();
        ((n.type = `lowpass`),
          n.frequency.setValueAtTime(250, e),
          n.frequency.exponentialRampToValueAtTime(6e3, e + 1.6));
        let r = W.createGain();
        (r.gain.setValueAtTime(0, e),
          r.gain.linearRampToValueAtTime(0.16, e + 1.2),
          r.gain.linearRampToValueAtTime(0, e + 1.7),
          t.connect(n),
          n.connect(r),
          r.connect(Ce),
          t.start(e),
          t.stop(e + 2.1),
          [0, 0.35, 0.7, 1.05].forEach((e, t) =>
            setTimeout(() => Ie(Fe[5 + t * 2], 0.025), e * 1e3),
          ));
      }
      o(`entrar`).onclick = () => a();
      let Be = document.createElement(`button`);
      return (
        (Be.textContent = `Pular`),
        (Be.onclick = a),
        o(`topo`).appendChild(Be),
        () => {
          ((t = !1), cancelAnimationFrame(n), removeEventListener(`resize`, k));
          try {
            W && W.close();
          } catch {}
          (e.remove(),
            (i.style.overflow = ``),
            (document.body.style.overflow = ``));
        }
      );
    }, []),
    null
  );
}
function mc({ whats: e }) {
  let t = (0, l.useRef)(null),
    n = (0, l.useRef)(null),
    r = (0, l.useRef)(null);
  return (
    (0, l.useEffect)(() => {
      let e = t.current,
        i = n.current,
        a = r.current,
        o = i.getContext(`2d`),
        s = 0,
        c = 0,
        l = 1,
        u = !0,
        d = 0,
        f = !1,
        p = !1,
        m = 0,
        h = !0,
        g = (e, t) => {
          let n = document.createElement(`canvas`);
          return (
            (n.width = Math.max(1, e | 0)),
            (n.height = Math.max(1, t | 0)),
            n
          );
        },
        _ = g(1, 1),
        v = g(1, 1),
        y = g(1, 1),
        b = g(1, 1),
        x = g(1, 1),
        z = g(1, 1),
        S = [],
        C = [],
        w = matchMedia(`(pointer: coarse)`).matches;
      function T() {
        let e = g(s * l, c * l),
          t = e.getContext(`2d`);
        t.scale(l, l);
        let n = t.createRadialGradient(
          s / 2,
          c * 0.42,
          0,
          s / 2,
          c * 0.42,
          Math.max(s, c) * 0.75,
        );
        (n.addColorStop(0, `#FDF8F0`),
          n.addColorStop(0.6, `#F5EADA`),
          n.addColorStop(1, `#E8D7BE`),
          (t.fillStyle = n),
          t.fillRect(0, 0, s, c));
        for (let e = 0; e < (s * c) / 110; e++)
          ((t.fillStyle = `rgba(120,80,40,` + Math.random() * 0.05 + `)`),
            t.fillRect(
              Math.random() * s,
              Math.random() * c,
              Math.random() * 2 + 0.5,
              Math.random() * 1.2,
            ));
        let r = Math.min(s * (w ? 0.1 : 0.068), 104);
        return (
          (t.textAlign = `center`),
          (t.fillStyle = `#3A0E1C`),
          (t.font = r + `px Marcellus, Georgia, serif`),
          t.fillText(`Bora tirar a sua ideia`, s / 2, c * 0.44),
          (t.fillStyle = `#8A5A2B`),
          t.fillText(`do papel?`, s / 2, c * 0.44 + r * 1.1),
          (t.fillStyle = `#6E5343`),
          (t.font = `500 14px 'Instrument Sans', sans-serif`),
          t.fillText(
            w
              ? `role para tirar do papel`
              : `role ou passe o mouse para tirar do papel`,
            s / 2,
            c * 0.44 + r * 1.1 + 54,
          ),
          e
        );
      }
      function E() {
        let t = e.getBoundingClientRect();
        ((s = t.width),
          (c = t.height),
          (l = w ? 1 : Math.min(devicePixelRatio || 1, 1.5)),
          (i.width = s * l),
          (i.height = c * l),
          (_ = T()),
          (v = g(s * l, c * l)),
          (y = g(s * l, c * l)),
          (x = g(s * l, c * l)),
          (z = g(s * l, c * l)),
          (b = g((s * l) / 5, (c * l) / 5)),
          (S.length = 0),
          [
            [0.5, 0.44],
            [0.28, 0.42],
            [0.72, 0.46],
            [0.5, 0.44 + (Math.min(s * (w ? 0.1 : 0.068), 104) * 1.1) / c],
          ].forEach(([e, t]) => S.push([s * e, c * t])),
          (h = !0));
      }
      ((document.fonts?.ready ?? Promise.resolve()).then(() => {
        u && E();
      }),
        E());
      let D = new ResizeObserver(() => E());
      D.observe(e);
      function O(e, t, n, r) {
        let i = e.getContext(`2d`);
        (i.setTransform(l, 0, 0, l, 0, 0),
          (i.fillStyle = `#000`),
          i.beginPath(),
          i.arc(t, n, r, 0, 7),
          i.fill());
      }
      function k(e, t, n) {
        (O(v, e, t, n), O(y, e, t, n + 3.5), (h = !0));
      }
      function A() {
        let e = x.getContext(`2d`);
        (e.setTransform(1, 0, 0, 1, 0, 0),
          (e.globalCompositeOperation = `source-over`),
          e.clearRect(0, 0, x.width, x.height),
          e.drawImage(_, 0, 0),
          (e.globalCompositeOperation = `destination-out`),
          e.drawImage(y, 0, 0));
        let t = z,
          n = t.getContext(`2d`);
        (n.setTransform(1, 0, 0, 1, 0, 0),
          (n.globalCompositeOperation = `source-over`),
          n.clearRect(0, 0, t.width, t.height),
          n.drawImage(y, 0, 0),
          (n.globalCompositeOperation = `source-in`));
        let r = n.createLinearGradient(0, 0, t.width, t.height);
        (r.addColorStop(0, `#FFB347`),
          r.addColorStop(0.5, `#FFE3A0`),
          r.addColorStop(1, `#FF9F3A`),
          (n.fillStyle = r),
          n.fillRect(0, 0, t.width, t.height),
          (n.globalCompositeOperation = `destination-out`),
          n.drawImage(v, 0, 0),
          (e.globalCompositeOperation = `source-over`),
          e.drawImage(t, 0, 0));
        let i = b.getContext(`2d`);
        (i.clearRect(0, 0, b.width, b.height),
          i.drawImage(t, 0, 0, b.width, b.height));
      }
      let B = !1,
        V = 0,
        H = () => {
          if (B || f) return;
          ((B = !0), (p = !0), e.classList.add(`aberto`));
          try {
            ((a.currentTime = 4.8), a.play().catch(() => {}));
          } catch {}
          let t = performance.now(),
            n = m,
            r = () => {
              !f &&
                u &&
                ((m = Math.max(
                  m,
                  Math.min(1, n + (performance.now() - t) / 620),
                )),
                requestAnimationFrame(r));
            };
          requestAnimationFrame(r);
        };
      function j(t) {
        if (u) {
          if (!f) {
            let n = Math.hypot(s, c) * 0.68,
              r = Math.pow(m, 1.25);
            (p &&
              m > 0 &&
              S.forEach(([e, i], a) =>
                k(
                  e + Math.sin(t / 400 + a) * 4,
                  i,
                  24 + r * n * (1 - a * 0.05),
                ),
              ),
              C.forEach(([e, t, n]) => k(e, t, n)),
              (C.length = 0),
              (h &&= (A(), !1)));
            let a = 0.8 + 0.2 * Math.sin(t / 90) * Math.sin(t / 53);
            (o.setTransform(1, 0, 0, 1, 0, 0),
              o.clearRect(0, 0, i.width, i.height),
              o.drawImage(x, 0, 0),
              (o.globalCompositeOperation = `lighter`),
              (o.globalAlpha = 0.9 * a),
              o.drawImage(b, 0, 0, i.width, i.height),
              (o.globalAlpha = 1),
              (o.globalCompositeOperation = `source-over`),
              m >= 1 &&
                ((f = !0),
                (i.style.transition = `opacity .45s`),
                (i.style.opacity = `0`),
                e.classList.add(`aberto`)));
          }
          d = requestAnimationFrame(j);
        }
      }
      d = requestAnimationFrame(j);
      let M = () => {
        let t = e.getBoundingClientRect();
        if (t.top < innerHeight * 0.65 && !p) {
          ((p = !0), e.classList.add(`revelando`));
          try {
            ((a.currentTime = 4.8), a.play().catch(() => {}));
          } catch {}
        }
        if (t.top <= innerHeight * 0.12 && !B && !V) {
          V = setTimeout(H, 1050);
        }
      };
      (addEventListener(`scroll`, M, { passive: !0 }), M());
      let U = 0,
        N = (t) => {
          if (f) return;
          let n = e.getBoundingClientRect();
          (C.push([t.clientX - n.left, t.clientY - n.top, w ? 30 : 38]),
            p || M(),
            e.classList.add(`revelando`),
            U++,
            U > 12 && H());
        },
        W = (t) => {
          if (f) return;
          let n = e.getBoundingClientRect();
          n.top <= innerHeight * 0.35 && t.deltaY > 0 && H();
        };
      (e.addEventListener(`pointermove`, N),
        e.addEventListener(`wheel`, W, { passive: !0 }));
      let P = new IntersectionObserver(
        ([e]) => {
          e.intersectionRatio > 0.7 && !B && !V && (V = setTimeout(H, 1050));
        },
        { threshold: [0.7, 0.85] },
      );
      return (
        P.observe(e),
        a.addEventListener(`loadedmetadata`, () => {
          p || (a.currentTime = 4.8);
        }),
        () => {
          ((u = !1),
            clearTimeout(V),
            cancelAnimationFrame(d),
            D.disconnect(),
            P.disconnect(),
            removeEventListener(`scroll`, M),
            e.removeEventListener(`pointermove`, N),
            e.removeEventListener(`wheel`, W));
        }
      );
    }, []),
    (0, $.jsxs)(`section`, {
      className: `fx2-cont fecho`,
      ref: t,
      "aria-label": `Contato`,
      children: [
        (0, $.jsx)(`video`, {
          ref: r,
          className: `fecho-video`,
          src: `./videos/sec-couro.mp4`,
          muted: !0,
          playsInline: !0,
          preload: `metadata`,
        }),
        (0, $.jsx)(`div`, { className: `fecho-sombra` }),
        (0, $.jsxs)(`div`, {
          className: `fecho-in`,
          children: [
            (0, $.jsxs)(`h2`, {
              children: [
                `Então vamos `,
                (0, $.jsx)(`em`, { children: `tirar.` }),
              ],
            }),
            (0, $.jsx)(`p`, {
              children: `Conta a sua ideia no WhatsApp. A gente responde e te mostra o caminho.`,
            }),
            (0, $.jsxs)(`div`, {
              className: `fecho-acoes`,
              children: [
                (0, $.jsx)(`a`, {
                  className: `fx2-pill`,
                  href: e,
                  target: `_blank`,
                  rel: `noreferrer`,
                  "data-cursor": `link`,
                  children: `Chamar no WhatsApp`,
                }),
                (0, $.jsx)(`a`, {
                  className: `fx2-insta`,
                  href: `https://instagram.com/zunora.mkt`,
                  target: `_blank`,
                  rel: `noreferrer`,
                  "data-cursor": `link`,
                  children: `@zunora.mkt`,
                }),
              ],
            }),
          ],
        }),
        (0, $.jsx)(`canvas`, {
          ref: n,
          className: `fecho-papel`,
          "aria-hidden": `true`,
        }),
        (0, $.jsxs)(`footer`, {
          className: `fecho-rodape`,
          children: [
            (0, $.jsx)(`span`, { children: `ZUNORA Digital Marketing` }),
            (0, $.jsx)(`span`, { children: new Date().getFullYear() }),
          ],
        }),
      ],
    })
  );
}
function hc(e) {
  let t = (0, l.useRef)(null);
  return (
    (0, l.useEffect)(() => {
      let n = t.current,
        r = n.getContext(`2d`),
        i = 0,
        a = 0,
        o = 0,
        s = () => {
          let e = Math.min(devicePixelRatio || 1, 2);
          ((a = n.clientWidth),
            (o = n.clientHeight),
            (n.width = a * e),
            (n.height = o * e),
            r.setTransform(e, 0, 0, e, 0, 0));
        };
      s();
      let c = new ResizeObserver(s);
      c.observe(n);
      let l = matchMedia(`(prefers-reduced-motion: reduce)`).matches,
        u = performance.now(),
        d = (t) => {
          ((n.closest(`.cena`)?.classList.contains(`ativa`) || l) &&
            (r.clearRect(0, 0, a, o), e(r, a, o, l ? 4 : (t - u) / 1e3)),
            l || (i = requestAnimationFrame(d)));
        };
      return (
        (i = requestAnimationFrame(d)),
        () => {
          (cancelAnimationFrame(i), c.disconnect());
        }
      );
    }, []),
    (0, $.jsx)(`canvas`, {
      ref: t,
      className: `fd-canvas`,
      "aria-hidden": `true`,
    })
  );
}
function gc() {
  let e = (0, l.useRef)(null);
  (0, l.useEffect)(() => {
    let t = Array.from(e.current.querySelectorAll(`.fa-c`)),
      n = [
        `Ana`,
        `Bia`,
        `Rê`,
        `Mel`,
        `Fê`,
        `Carol`,
        `Lia`,
        `Ju`,
        `Dani`,
        `Gabi`,
        `Lu`,
        `Pri`,
      ],
      r = [`Sobrancelha`, `Cílios`, `Unhas`, `Limpeza`, `Design`, `Botox`],
      i = 0,
      a = setInterval(() => {
        if (!e.current?.closest(`.cena`)?.classList.contains(`ativa`)) return;
        let a = t[(i * 37 + 11) % t.length];
        (i++,
          a.classList.contains(`on`)
            ? a.classList.remove(`on`)
            : ((a.innerHTML =
                `<b>` + n[i % n.length] + `</b>` + r[i % r.length]),
              a.classList.add(`on`)));
      }, 420);
    return () => clearInterval(a);
  }, []);
  let t = [`seg`, `ter`, `qua`, `qui`, `sex`, `sáb`, `dom`];
  return (0, $.jsxs)(`div`, {
    className: `fd fd-agenda`,
    ref: e,
    "aria-hidden": `true`,
    children: [
      (0, $.jsxs)(`div`, {
        className: `fa-dias`,
        children: [
          (0, $.jsx)(`span`, {}),
          t.map((e) => (0, $.jsx)(`span`, { children: e }, e)),
        ],
      }),
      (0, $.jsx)(`div`, {
        className: `fa-grade`,
        children: Array.from({ length: 11 }).map((e, n) =>
          (0, $.jsxs)(
            `div`,
            {
              className: `fa-linha`,
              children: [
                (0, $.jsxs)(`span`, {
                  children: [String(8 + n).padStart(2, `0`), `h`],
                }),
                t.map((e, t) => (0, $.jsx)(`div`, { className: `fa-c` }, t)),
              ],
            },
            n,
          ),
        ),
      }),
    ],
  });
}
function _c() {
  let e = Array.from(
    { length: 40 },
    (e, t) =>
      0.25 + t / 60 + Math.sin(t * 0.9) * 0.05 + Math.sin(t * 0.31) * 0.08,
  );
  return hc((t, n, r, i) => {
    let a = r * 0.88,
      o = r * 0.62,
      s = e.length;
    ((t.strokeStyle = `rgba(95,227,180,.06)`), (t.lineWidth = 1));
    for (let e = 0; e < 6; e++) {
      let r = a - (o * e) / 5;
      (t.beginPath(), t.moveTo(0, r), t.lineTo(n, r), t.stroke());
    }
    for (let e = 0; e < s; e++) {
      let r = (e / (s - 1)) * n,
        i = o * (0.08 + ((e * 7) % 5) / 30);
      ((t.fillStyle = `rgba(95,227,180,.045)`),
        t.fillRect(r - 6, a - i, 12, i));
    }
    let c = Math.min(1, (i % 14) / 6),
      l = Math.max(1, Math.floor(c * (s - 1))),
      u = (t) => [(t / (s - 1)) * n, a - e[t] * o],
      d = t.createLinearGradient(0, a - o, 0, a);
    (d.addColorStop(0, `rgba(95,227,180,.16)`),
      d.addColorStop(1, `rgba(95,227,180,0)`),
      t.beginPath(),
      t.moveTo(0, a));
    for (let e = 0; e <= l; e++) {
      let [n, r] = u(e);
      t.lineTo(n, r);
    }
    (t.lineTo(u(l)[0], a),
      t.closePath(),
      (t.fillStyle = d),
      t.fill(),
      t.beginPath());
    for (let e = 0; e <= l; e++) {
      let [n, r] = u(e);
      e ? t.lineTo(n, r) : t.moveTo(n, r);
    }
    ((t.strokeStyle = `rgba(95,227,180,.55)`),
      (t.lineWidth = 2),
      (t.shadowColor = `rgba(95,227,180,.8)`),
      (t.shadowBlur = 14),
      t.stroke(),
      (t.shadowBlur = 0));
    let [f, p] = u(l);
    ((t.fillStyle = `#5FE3B4`),
      t.beginPath(),
      t.arc(f, p, 5, 0, 7),
      t.fill(),
      (t.strokeStyle = `rgba(95,227,180,.3)`),
      t.beginPath(),
      t.arc(f, p, 10 + ((i * 20) % 16), 0, 7),
      t.stroke(),
      (t.font = `500 13px Instrument Sans, sans-serif`),
      (t.fillStyle = `rgba(232,245,240,.55)`),
      t.fillText(
        `R$ ` + Math.round(9e3 + e[l] * 1e4).toLocaleString(`pt-BR`),
        f + 14,
        p - 12,
      ));
  });
}
function vc() {
  return (0, $.jsxs)(`div`, {
    className: `fd fd-respira`,
    "aria-hidden": `true`,
    children: [
      Array.from({ length: 7 }).map((e, t) =>
        (0, $.jsx)(`i`, { style: { "--k": t } }, t),
      ),
      (0, $.jsxs)(`span`, {
        className: `fr-txt`,
        children: [
          (0, $.jsx)(`em`, { children: `inspira` }),
          (0, $.jsx)(`em`, { children: `expira` }),
        ],
      }),
    ],
  });
}
function yc() {
  let e = [],
    t = 7,
    n = () => (t = (t * 9301 + 49297) % 233280) / 233280,
    r = (t, i, a, o, s, c) => {
      if (c > 6 || o < 14) return;
      let l = `M${t.toFixed(1)} ${i.toFixed(1)}`,
        u = t,
        d = i,
        f = a;
      for (let e = 0; e < 4; e++) {
        f += (n() - 0.5) * 0.5;
        let e = u + (Math.cos(f) * o) / 4,
          t = d + (Math.sin(f) * o) / 4;
        ((l += ` Q${((u + e) / 2 + (n() - 0.5) * 10).toFixed(1)} ${((d + t) / 2).toFixed(1)} ${e.toFixed(1)} ${t.toFixed(1)}`),
          (u = e),
          (d = t));
      }
      e.push(l + `|` + s.toFixed(2) + `|` + c);
      let p = c < 2 ? 3 : 2;
      for (let e = 0; e < p; e++)
        r(
          u,
          d,
          f + (n() - 0.5) * 1.3,
          o * (0.62 + n() * 0.15),
          s * 0.68,
          c + 1,
        );
    };
  return (
    [180, 520, 860, 1220].forEach((e, t) =>
      r(e, 0, Math.PI / 2 + (t - 1.5) * 0.12, 260, 3.2, 0),
    ),
    (0, $.jsx)(`svg`, {
      className: `fd fd-raizes`,
      viewBox: `0 0 1400 900`,
      preserveAspectRatio: `xMidYMax slice`,
      "aria-hidden": `true`,
      children: (0, $.jsx)(`g`, {
        transform: `translate(0,900) scale(1,-1)`,
        children: e.map((e, t) => {
          let [n, r, i] = e.split(`|`);
          return (0, $.jsx)(
            `path`,
            {
              d: n,
              style: { strokeWidth: +r, "--n": +i, "--i": t },
              pathLength: 1,
            },
            t,
          );
        }),
      }),
    })
  );
}
function bc() {
  let e = (0, l.useRef)(
    Array.from({ length: 90 }, (e, t) => ({
      x: (t * 0.618) % 1,
      y: (t * 0.371) % 1,
      r: 0.6 + (t % 4) * 0.5,
      v: 0.004 + (t % 5) * 0.002,
      f: t,
    })),
  );
  return hc((t, n, r, i) => {
    let a = 0.5 + Math.sin(i * 0.8) * 0.12,
      o = t.createRadialGradient(
        n * 0.68,
        r * 1.05,
        10,
        n * 0.68,
        r * 1.05,
        r * 1.1,
      );
    (o.addColorStop(0, `rgba(232,140,60,${0.35 * a})`),
      o.addColorStop(0.5, `rgba(214,120,50,${0.12 * a})`),
      o.addColorStop(1, `rgba(214,120,50,0)`),
      (t.fillStyle = o),
      t.fillRect(0, 0, n, r));
    for (let a of e.current)
      ((a.y -= (a.v / 60) * 6),
        (a.x += Math.sin(i * 0.6 + a.f) * 25e-5),
        a.y < -0.02 && (a.y = 1.02),
        (t.fillStyle = `rgba(255,250,240,${0.35 + Math.sin(i + a.f) * 0.2})`),
        t.beginPath(),
        t.arc(a.x * n, a.y * r, a.r, 0, 7),
        t.fill());
  });
}
function xc() {
  let e = [
      `facial`,
      `doces`,
      `salao2`,
      `mentora`,
      `pilates`,
      `salao1`,
      `facial`,
      `doces`,
    ],
    t = (t) =>
      (0, $.jsx)(`div`, {
        className: `ff-fita ` + t,
        children: (0, $.jsx)(`div`, {
          className: `ff-trilho`,
          children: [...e, ...e].map((e, t) =>
            (0, $.jsx)(
              `span`,
              {
                children: (0, $.jsx)(`img`, {
                  src: `./img/${e}.webp`,
                  alt: ``,
                }),
              },
              t,
            ),
          ),
        }),
      });
  return (0, $.jsxs)(`div`, {
    className: `fd fd-filme`,
    "aria-hidden": `true`,
    children: [t(`a`), t(`b`)],
  });
}
function Sc() {
  return (0, $.jsx)(`svg`, {
    className: `fd fd-arcos`,
    viewBox: `0 0 1400 900`,
    preserveAspectRatio: `xMidYMid slice`,
    "aria-hidden": `true`,
    children: Array.from({ length: 9 }).map((e, t) => {
      let n = 180 + t * 70;
      return (0, $.jsx)(
        `path`,
        {
          d: `M ${980 - n} 900 L ${980 - n} 520 A ${n} ${n} 0 0 1 ${980 + n} 520 L ${980 + n} 900`,
          pathLength: 1,
          style: { "--i": t },
        },
        t,
      );
    }),
  });
}
function Cc() {
  return (0, $.jsxs)(`div`, {
    className: `fd fd-luz`,
    "aria-hidden": `true`,
    children: [
      (0, $.jsx)(`i`, { className: `cone` }),
      (0, $.jsx)(`i`, { className: `poeira` }),
    ],
  });
}
var wc = (e) => e?.replace(/([a-z0-9])([A-Z])/g, `$1-$2`).toLowerCase();
function Tc(e, t, n = []) {
  if (t == null)
    throw Error(`[lucide]: iconNode is required when icon name is used`);
  return {
    name: wc(e),
    size: 24,
    node: t,
    ...(n.length > 0 ? { aliases: n } : {}),
  };
}
var Ec = (e) => {
    let t = ``,
      n = !1;
    for (let r of e)
      r === `-` || r === `_` || r <= ` `
        ? (n = t.length > 0)
        : (t.length === 0
            ? (t += r.toLowerCase())
            : (t += n ? r.toUpperCase() : r),
          (n = !1));
    return t;
  },
  Dc = (e) => {
    let t = Ec(e);
    return t.charAt(0).toUpperCase() + t.slice(1);
  },
  Oc = (...e) =>
    e
      .filter((e, t, n) => !!e && e.trim() !== `` && n.indexOf(e) === t)
      .join(` `)
      .trim(),
  kc = {
    xmlns: `http://www.w3.org/2000/svg`,
    width: 24,
    height: 24,
    viewBox: `0 0 24 24`,
    fill: `none`,
    stroke: `currentColor`,
    "stroke-width": 2,
    "stroke-linecap": `round`,
    "stroke-linejoin": `round`,
  };
function Ac(e) {
  return e != null;
}
function jc(e, t = {}) {
  let n = t.attributeNames ?? {},
    r = (e) => n[e] ?? e,
    i = e.size ?? e.width ?? kc.width,
    a = e.size ?? e.height ?? kc.height,
    o =
      e.aliases
        ?.filter((e) => typeof e == `string` && e.trim() !== ``)
        .map((e) => `lucide-${e}`) ?? [],
    s = [...(e.name ? [`lucide-${e.name}`] : []), ...o],
    c = t.className?.split(` `).filter(Boolean) ?? [],
    l = t.includeDefaultClasses === !1 ? Oc(...c) : Oc(`lucide`, ...s, ...c),
    u = t.absoluteStrokeWidth
      ? (Number(t.strokeWidth ?? kc[`stroke-width`]) *
          Number(e.size ?? e.width ?? kc.width)) /
        Number(t.size ?? t.width ?? kc.width)
      : (t.strokeWidth ?? kc[`stroke-width`]);
  return [
    `svg`,
    {
      ...Object.entries(kc).reduce((e, [t, n]) => ((e[r(t)] = n), e), {}),
      ...(`color` in t && t.color && { [r(`stroke`)]: t.color }),
      ...(`size` in t &&
        Ac(t.size) && { [r(`width`)]: t.size, [r(`height`)]: t.size }),
      ...(`width` in t && Ac(t.width) && { [r(`width`)]: t.width }),
      ...(`height` in t && Ac(t.height) && { [r(`height`)]: t.height }),
      [r(`stroke-width`)]: u,
      ...(l && { [r(`class`)]: l }),
      [r(`viewBox`)]: `0 0 ${i} ${a}`,
      ...(t.hasA11yProp === !1 ? { [r(`aria-hidden`)]: `true` } : {}),
      ...(`attributes` in t && t.attributes),
    },
    e.node.map((e) => {
      let [n, i, a] = e,
        o = t.nonScalingStroke
          ? { [r(`vector-effect`)]: `non-scaling-stroke`, ...i }
          : i;
      return a ? [n, o, a] : [n, o];
    }),
  ];
}
function Mc(e, t = {}) {
  return jc(e, {
    ...t,
    attributeNames: {
      ...t.attributeNames,
      class: `className`,
      "stroke-width": `strokeWidth`,
      "stroke-linecap": `strokeLinecap`,
      "stroke-linejoin": `strokeLinejoin`,
      "vector-effect": `vectorEffect`,
    },
  });
}
var Nc = (e) => {
    for (let t in e)
      if (t.startsWith(`aria-`) || t === `role` || t === `title`) return !0;
    return !1;
  },
  Pc = (0, l.createContext)({}),
  Fc = () => (0, l.useContext)(Pc),
  Ic = (0, l.forwardRef)(
    (
      {
        color: e,
        size: t,
        width: n,
        height: r,
        strokeWidth: i,
        absoluteStrokeWidth: a,
        nonScalingStroke: o,
        className: s = ``,
        children: c,
        iconNode: u = [],
        icon: d = { node: u, aliases: [], size: 24 },
        ...f
      },
      p,
    ) => {
      let {
          size: m = 24,
          strokeWidth: h = 2,
          absoluteStrokeWidth: g = !1,
          nonScalingStroke: _ = !1,
          color: v = `currentColor`,
          className: y = ``,
        } = Fc() ?? {},
        b = !!c || Nc(f),
        [x, S, C = []] = Mc(d, {
          color: e ?? v,
          width: n ?? t ?? m,
          height: r ?? t ?? m,
          strokeWidth: i ?? h,
          absoluteStrokeWidth: a ?? g,
          nonScalingStroke: o ?? _,
          className: Oc(y, s),
          hasA11yProp: b,
          attributes: f,
        });
      return (0, l.createElement)(x, { ref: p, ...S }, [
        ...C.map(([e, t]) => (0, l.createElement)(e, t)),
        ...(Array.isArray(c) ? c : [c]),
      ]);
    },
  );
function Lc(e, t = [], n = []) {
  let r = typeof e == `string` ? Tc(e, t, n) : e,
    i = (0, l.forwardRef)(({ className: e, ...t }, n) =>
      (0, l.createElement)(Ic, { ref: n, icon: r, className: e, ...t }),
    );
  return (r.name && (i.displayName = Dc(r.name)), i);
}
var Rc = {
  name: `arrow-down-left`,
  size: 24,
  node: [
    [`path`, { d: `M17 7 7 17`, key: `15tmo1` }],
    [`path`, { d: `M17 17H7V7`, key: `1org7z` }],
  ],
};
Rc.node;
var zc = Lc(Rc),
  Bc = {
    name: `arrow-left`,
    size: 24,
    node: [
      [`path`, { d: `m12 19-7-7 7-7`, key: `1l729n` }],
      [`path`, { d: `M19 12H5`, key: `x3x0zl` }],
    ],
  };
Bc.node;
var Vc = Lc(Bc),
  Hc = {
    name: `arrow-up-right`,
    size: 24,
    node: [
      [`path`, { d: `M7 7h10v10`, key: `1tivn9` }],
      [`path`, { d: `M7 17 17 7`, key: `1vkiza` }],
    ],
  };
Hc.node;
var Uc = Lc(Hc),
  Wc = {
    name: `bell`,
    size: 24,
    node: [
      [`path`, { d: `M10.268 21a2 2 0 0 0 3.464 0`, key: `vwvbt9` }],
      [
        `path`,
        {
          d: `M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326`,
          key: `11g9vi`,
        },
      ],
    ],
  };
Wc.node;
var Gc = Lc(Wc),
  Kc = {
    name: `calendar-days`,
    size: 24,
    node: [
      [`path`, { d: `M8 2v3`, key: `1ioesn` }],
      [`path`, { d: `M16 2v3`, key: `otl347` }],
      [
        `rect`,
        { x: `3`, y: `3`, width: `18`, height: `18`, rx: `2`, key: `h1oib` },
      ],
      [`path`, { d: `M3 9h18`, key: `1pudct` }],
      [`path`, { d: `M8 13h.01`, key: `1sbv64` }],
      [`path`, { d: `M12 13h.01`, key: `y0uutt` }],
      [`path`, { d: `M16 13h.01`, key: `wip0gl` }],
      [`path`, { d: `M8 17h.01`, key: `p3bg7i` }],
      [`path`, { d: `M12 17h.01`, key: `p32p05` }],
      [`path`, { d: `M16 17h.01`, key: `ql8jdd` }],
    ],
  };
Kc.node;
var qc = Lc(Kc),
  Jc = {
    name: `camera`,
    size: 24,
    node: [
      [
        `path`,
        {
          d: `M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z`,
          key: `18u6gg`,
        },
      ],
      [`circle`, { cx: `12`, cy: `13`, r: `3`, key: `1vg3eu` }],
    ],
  };
Jc.node;
var Yc = Lc(Jc),
  Xc = {
    name: `chart-column`,
    size: 24,
    node: [
      [`path`, { d: `M3 3v16a2 2 0 0 0 2 2h16`, key: `c24i48` }],
      [`path`, { d: `M18 17V9`, key: `2bz60n` }],
      [`path`, { d: `M13 17V5`, key: `1frdt8` }],
      [`path`, { d: `M8 17v-3`, key: `17ska0` }],
    ],
    aliases: [`bar-chart-3`],
  };
Xc.node;
var Zc = Lc(Xc),
  Qc = {
    name: `check-check`,
    size: 24,
    node: [
      [`path`, { d: `M18 6 7 17l-5-5`, key: `116fxf` }],
      [`path`, { d: `m22 10-7.5 7.5L13 16`, key: `ke71qq` }],
    ],
  };
Qc.node;
var $c = Lc(Qc),
  el = {
    name: `chevron-right`,
    size: 24,
    node: [[`path`, { d: `m9 18 6-6-6-6`, key: `mthhwq` }]],
  };
el.node;
var tl = Lc(el),
  nl = {
    name: `clock`,
    size: 24,
    node: [
      [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
      [`path`, { d: `M12 6v6l4 2`, key: `mmk7yg` }],
    ],
  };
nl.node;
var rl = Lc(nl),
  il = {
    name: `ellipsis-vertical`,
    size: 24,
    node: [
      [`circle`, { cx: `12`, cy: `12`, r: `1`, key: `41hilf` }],
      [`circle`, { cx: `12`, cy: `5`, r: `1`, key: `gxeob9` }],
      [`circle`, { cx: `12`, cy: `19`, r: `1`, key: `lyex9k` }],
    ],
    aliases: [`more-vertical`],
  };
il.node;
var al = Lc(il),
  ol = {
    name: `eye`,
    size: 24,
    node: [
      [
        `path`,
        {
          d: `M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0`,
          key: `1nclc0`,
        },
      ],
      [`circle`, { cx: `12`, cy: `12`, r: `3`, key: `1v7zrd` }],
    ],
  };
ol.node;
var sl = Lc(ol),
  cl = {
    name: `face-slightly-smiling`,
    size: 24,
    node: [
      [`path`, { d: `M15 10V9`, key: `4dkmfx` }],
      [`path`, { d: `M16.472 15a6 6 0 01-8.943 0`, key: `7qomzy` }],
      [`path`, { d: `M9 10V9`, key: `1lazqi` }],
      [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
    ],
    aliases: [`smile`],
  };
cl.node;
var ll = Lc(cl),
  ul = {
    name: `flame`,
    size: 24,
    node: [
      [
        `path`,
        {
          d: `M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4`,
          key: `1slcih`,
        },
      ],
    ],
  };
ul.node;
var dl = Lc(ul),
  fl = {
    name: `house`,
    size: 24,
    node: [
      [
        `path`,
        { d: `M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8`, key: `5wwlr5` },
      ],
      [
        `path`,
        {
          d: `M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z`,
          key: `r6nss1`,
        },
      ],
    ],
    aliases: [`home`],
  };
fl.node;
var pl = Lc(fl),
  ml = {
    name: `layout-dashboard`,
    size: 24,
    node: [
      [
        `rect`,
        { width: `7`, height: `9`, x: `3`, y: `3`, rx: `1`, key: `10lvy0` },
      ],
      [
        `rect`,
        { width: `7`, height: `5`, x: `14`, y: `3`, rx: `1`, key: `16une8` },
      ],
      [
        `rect`,
        { width: `7`, height: `9`, x: `14`, y: `12`, rx: `1`, key: `1hutg5` },
      ],
      [
        `rect`,
        { width: `7`, height: `5`, x: `3`, y: `16`, rx: `1`, key: `ldoo1y` },
      ],
    ],
  };
ml.node;
var hl = Lc(ml),
  gl = {
    name: `map-pin`,
    size: 24,
    node: [
      [
        `path`,
        {
          d: `M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0`,
          key: `1r0f0z`,
        },
      ],
      [`circle`, { cx: `12`, cy: `10`, r: `3`, key: `ilqhr7` }],
    ],
  };
gl.node;
var _l = Lc(gl),
  vl = {
    name: `mic`,
    size: 24,
    node: [
      [`path`, { d: `M12 19v3`, key: `npa21l` }],
      [`path`, { d: `M19 10v2a7 7 0 0 1-14 0v-2`, key: `1vc78b` }],
      [
        `rect`,
        { x: `9`, y: `2`, width: `6`, height: `13`, rx: `3`, key: `s6n7sd` },
      ],
    ],
  };
vl.node;
var yl = Lc(vl),
  bl = {
    name: `paperclip`,
    size: 24,
    node: [
      [
        `path`,
        {
          d: `m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551`,
          key: `1miecu`,
        },
      ],
    ],
  };
bl.node;
var xl = Lc(bl),
  Sl = {
    name: `phone`,
    size: 24,
    node: [
      [
        `path`,
        {
          d: `M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384`,
          key: `9njp5v`,
        },
      ],
    ],
  };
Sl.node;
var Cl = Lc(Sl),
  wl = {
    name: `piggy-bank`,
    size: 24,
    node: [
      [
        `path`,
        {
          d: `M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z`,
          key: `1piglc`,
        },
      ],
      [`path`, { d: `M16 10h.01`, key: `1m94wz` }],
      [`path`, { d: `M2 8v1a2 2 0 0 0 2 2h1`, key: `1env43` }],
    ],
  };
wl.node;
var Tl = Lc(wl),
  El = {
    name: `play`,
    size: 24,
    node: [
      [
        `path`,
        {
          d: `M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z`,
          key: `10ikf1`,
        },
      ],
    ],
  };
El.node;
var Dl = Lc(El),
  Ol = {
    name: `qr-code`,
    size: 24,
    node: [
      [
        `rect`,
        { width: `5`, height: `5`, x: `3`, y: `3`, rx: `1`, key: `1tu5fj` },
      ],
      [
        `rect`,
        { width: `5`, height: `5`, x: `16`, y: `3`, rx: `1`, key: `1v8r4q` },
      ],
      [
        `rect`,
        { width: `5`, height: `5`, x: `3`, y: `16`, rx: `1`, key: `1x03jg` },
      ],
      [`path`, { d: `M21 16h-3a2 2 0 0 0-2 2v3`, key: `177gqh` }],
      [`path`, { d: `M21 21v.01`, key: `ents32` }],
      [`path`, { d: `M12 7v3a2 2 0 0 1-2 2H7`, key: `8crl2c` }],
      [`path`, { d: `M3 12h.01`, key: `nlz23k` }],
      [`path`, { d: `M12 3h.01`, key: `n36tog` }],
      [`path`, { d: `M12 16v.01`, key: `133mhm` }],
      [`path`, { d: `M16 12h1`, key: `1slzba` }],
      [`path`, { d: `M21 12v.01`, key: `1lwtk9` }],
      [`path`, { d: `M12 21v-1`, key: `1880an` }],
    ],
  };
Ol.node;
var kl = Lc(Ol),
  Al = {
    name: `receipt`,
    size: 24,
    node: [
      [`path`, { d: `M12 17V7`, key: `pyj7ub` }],
      [
        `path`,
        { d: `M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8`, key: `1elt7d` },
      ],
      [
        `path`,
        {
          d: `M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z`,
          key: `ycz6yz`,
        },
      ],
    ],
  };
Al.node;
var jl = Lc(Al),
  Ml = {
    name: `search`,
    size: 24,
    node: [
      [`path`, { d: `m21 21-4.34-4.34`, key: `14j7rj` }],
      [`circle`, { cx: `11`, cy: `11`, r: `8`, key: `4ej97u` }],
    ],
  };
Ml.node;
var Nl = Lc(Ml),
  Pl = {
    name: `settings`,
    size: 24,
    node: [
      [
        `path`,
        {
          d: `M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,
          key: `1i5ecw`,
        },
      ],
      [`circle`, { cx: `12`, cy: `12`, r: `3`, key: `1v7zrd` }],
    ],
  };
Pl.node;
var Fl = Lc(Pl),
  Il = {
    name: `shield-check`,
    size: 24,
    node: [
      [
        `path`,
        {
          d: `M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,
          key: `oel41y`,
        },
      ],
      [`path`, { d: `m9 12 2 2 4-4`, key: `dzmm74` }],
    ],
  };
Il.node;
var Ll = Lc(Il),
  Rl = {
    name: `sparkles`,
    size: 24,
    node: [
      [
        `path`,
        {
          d: `M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z`,
          key: `1s2grr`,
        },
      ],
      [`path`, { d: `M20 2v4`, key: `1rf3ol` }],
      [`path`, { d: `M22 4h-4`, key: `gwowj6` }],
      [`circle`, { cx: `4`, cy: `20`, r: `2`, key: `6kqj1y` }],
    ],
    aliases: [`stars`],
  };
Rl.node;
var zl = Lc(Rl),
  Bl = {
    name: `target`,
    size: 24,
    node: [
      [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
      [`circle`, { cx: `12`, cy: `12`, r: `6`, key: `1vlfrh` }],
      [`circle`, { cx: `12`, cy: `12`, r: `2`, key: `1c9p78` }],
    ],
  };
Bl.node;
var Vl = Lc(Bl),
  Hl = {
    name: `trending-down`,
    size: 24,
    node: [
      [`path`, { d: `M16 17h6v-6`, key: `t6n2it` }],
      [`path`, { d: `m22 17-8.5-8.5-5 5L2 7`, key: `x473p` }],
    ],
  };
Hl.node;
var Ul = Lc(Hl),
  Wl = {
    name: `trending-up`,
    size: 24,
    node: [
      [`path`, { d: `M16 7h6v6`, key: `box55l` }],
      [`path`, { d: `m22 7-8.5 8.5-5-5L2 17`, key: `1t1m79` }],
    ],
  };
Wl.node;
var Gl = Lc(Wl),
  Kl = {
    name: `user`,
    size: 24,
    node: [
      [
        `path`,
        { d: `M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2`, key: `975kel` },
      ],
      [`circle`, { cx: `12`, cy: `7`, r: `4`, key: `17ys0d` }],
    ],
  };
Kl.node;
var ql = Lc(Kl),
  Jl = {
    name: `users`,
    size: 24,
    node: [
      [
        `path`,
        { d: `M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`, key: `1yyitq` },
      ],
      [`path`, { d: `M16 3.128a4 4 0 0 1 0 7.744`, key: `16gr8j` }],
      [`path`, { d: `M22 21v-2a4 4 0 0 0-3-3.87`, key: `kshegd` }],
      [`circle`, { cx: `9`, cy: `7`, r: `4`, key: `nufk8` }],
    ],
  };
Jl.node;
var Yl = Lc(Jl),
  Xl = {
    name: `video`,
    size: 24,
    node: [
      [
        `path`,
        {
          d: `m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5`,
          key: `ftymec`,
        },
      ],
      [
        `rect`,
        { x: `2`, y: `6`, width: `14`, height: `12`, rx: `2`, key: `158x01` },
      ],
    ],
  };
Xl.node;
var Zl = Lc(Xl),
  Ql = {
    name: `wallet`,
    size: 24,
    node: [
      [
        `path`,
        {
          d: `M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1`,
          key: `18etb6`,
        },
      ],
      [
        `path`,
        { d: `M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4`, key: `xoc0q4` },
      ],
    ],
  };
Ql.node;
var $l = Lc(Ql);
function eu({ w: e, h: t, children: n, className: r = `` }) {
  let i = (0, l.useRef)(null),
    [a, o] = (0, l.useState)(0.5);
  return (
    (0, l.useEffect)(() => {
      let n = i.current,
        r = new ResizeObserver(() =>
          o(Math.max(n.clientWidth / e, n.clientHeight / t)),
        );
      return (r.observe(n), () => r.disconnect());
    }, [e]),
    (0, $.jsx)(`div`, {
      ref: i,
      className: `escala ` + r,
      style: { aspectRatio: `${e}/${t}` },
      children: (0, $.jsx)(`div`, {
        className: `escala-in`,
        style: { width: e, height: t, transform: `scale(${a})` },
        children: n,
      }),
    })
  );
}
function tu({ claro: e = !1 }) {
  return (0, $.jsxs)(`div`, {
    className: `t-status` + (e ? ` claro` : ``),
    children: [
      (0, $.jsx)(`b`, { children: `9:41` }),
      (0, $.jsxs)(`span`, {
        children: [
          (0, $.jsx)(`i`, {}),
          (0, $.jsx)(`i`, {}),
          (0, $.jsx)(`i`, {}),
          (0, $.jsx)(`i`, {}),
        ],
      }),
    ],
  });
}
function nu() {
  return (0, $.jsxs)(eu, {
    w: 390,
    h: 844,
    className: `t-wa`,
    children: [
      (0, $.jsx)(tu, { claro: !0 }),
      (0, $.jsxs)(`header`, {
        className: `wa2-topo`,
        children: [
          (0, $.jsx)(Vc, { size: 24 }),
          (0, $.jsx)(`span`, { className: `wa2-av`, children: `SL` }),
          (0, $.jsxs)(`div`, {
            children: [
              (0, $.jsx)(`b`, { children: `Studio Lia` }),
              (0, $.jsx)(`small`, { children: `online` }),
            ],
          }),
          (0, $.jsx)(Zl, { size: 22 }),
          (0, $.jsx)(Cl, { size: 20 }),
          (0, $.jsx)(al, { size: 20 }),
        ],
      }),
      (0, $.jsxs)(`div`, {
        className: `wa2-chat`,
        children: [
          (0, $.jsx)(`span`, { className: `wa2-dia`, children: `HOJE` }),
          [
            [`c`, `Oi! Tem horário pra sobrancelha amanhã?`, `09:40`],
            [
              `ia`,
              `Oi, Ana! Tudo bem? Amanhã a Lia tem 10h, 14h e 16h30. Qual fica melhor pra você?`,
              `09:40`,
            ],
            [`c`, `14h por favor`, `09:41`],
            [
              `ia`,
              `Prontinho! Ficou marcado:

Design de sobrancelha
Quinta, 14h00 com a Lia

Te mando um lembrete 2h antes. Se precisar remarcar é só me chamar aqui.`,
              `09:41`,
            ],
          ].map(([e, t, n], r) =>
            (0, $.jsxs)(
              `div`,
              {
                className: `wa2-m ` + e,
                style: { "--d": r * 0.85 + `s` },
                children: [
                  e === `ia` && (0, $.jsx)(`em`, { children: `SecretarIA` }),
                  t,
                  (0, $.jsxs)(`span`, {
                    children: [n, e === `c` && (0, $.jsx)($c, { size: 15 })],
                  }),
                ],
              },
              r,
            ),
          ),
          (0, $.jsxs)(`div`, {
            className: `wa2-dig`,
            style: { "--d": `3.1s` },
            children: [
              (0, $.jsx)(`i`, {}),
              (0, $.jsx)(`i`, {}),
              (0, $.jsx)(`i`, {}),
            ],
          }),
        ],
      }),
      (0, $.jsxs)(`footer`, {
        className: `wa2-barra`,
        children: [
          (0, $.jsxs)(`div`, {
            children: [
              (0, $.jsx)(ll, { size: 22 }),
              (0, $.jsx)(`span`, { children: `Mensagem` }),
              (0, $.jsx)(xl, { size: 20 }),
              (0, $.jsx)(Yc, { size: 20 }),
            ],
          }),
          (0, $.jsx)(`b`, { children: (0, $.jsx)(yl, { size: 22 }) }),
        ],
      }),
    ],
  });
}
function ru({ ativa: e }) {
  let t = [42, 38, 51, 47, 60, 56, 71, 66, 82, 78, 94],
    n = t
      .map(
        (e, n) =>
          (n ? `L` : `M`) +
          ((n * 342) / (t.length - 1)).toFixed(1) +
          ` ` +
          (150 - e * 1.4).toFixed(1),
      )
      .join(` `),
    r = [
      [
        zc,
        `Pix recebido`,
        `Marina Souza · design de sobrancelha`,
        `+ R$ 350,00`,
        `e`,
      ],
      [zc, `Venda do curso`, `Hotmart · Método Bela`, `+ R$ 997,00`, `e`],
      [Uc, `Aluguel do espaço`, `Boleto · vence dia 10`, `− R$ 2.100,00`, `s`],
      [
        zc,
        `Pix recebido`,
        `Carla Mendes · limpeza de pele`,
        `+ R$ 180,00`,
        `e`,
      ],
    ];
  return (0, $.jsxs)(eu, {
    w: 390,
    h: 844,
    className: `t-fin`,
    children: [
      (0, $.jsx)(tu, { claro: !0 }),
      (0, $.jsxs)(`div`, {
        className: `f2-topo`,
        children: [
          (0, $.jsxs)(`div`, {
            children: [
              (0, $.jsx)(`small`, { children: `Olá, Fernanda` }),
              (0, $.jsx)(`b`, { children: `Novembro` }),
            ],
          }),
          (0, $.jsxs)(`span`, {
            className: `f2-sino`,
            children: [(0, $.jsx)(Gc, { size: 20 }), (0, $.jsx)(`i`, {})],
          }),
        ],
      }),
      (0, $.jsxs)(`div`, {
        className: `f2-saldo`,
        children: [
          (0, $.jsxs)(`small`, {
            children: [`Saldo disponível `, (0, $.jsx)(sl, { size: 14 })],
          }),
          (0, $.jsxs)(`b`, {
            children: [`R$ 18.420`, (0, $.jsx)(`span`, { children: `,00` })],
          }),
          (0, $.jsxs)(`em`, {
            children: [(0, $.jsx)(Uc, { size: 14 }), ` 23% acima de outubro`],
          }),
        ],
      }),
      (0, $.jsxs)(`div`, {
        className: `f2-graf`,
        children: [
          (0, $.jsxs)(`svg`, {
            viewBox: `0 0 342 150`,
            children: [
              (0, $.jsx)(`defs`, {
                children: (0, $.jsxs)(`linearGradient`, {
                  id: `f2g`,
                  x1: `0`,
                  x2: `0`,
                  y1: `0`,
                  y2: `1`,
                  children: [
                    (0, $.jsx)(`stop`, {
                      offset: `0`,
                      stopColor: `#5FE3B4`,
                      stopOpacity: `.35`,
                    }),
                    (0, $.jsx)(`stop`, {
                      offset: `1`,
                      stopColor: `#5FE3B4`,
                      stopOpacity: `0`,
                    }),
                  ],
                }),
              }),
              [30, 70, 110].map((e) =>
                (0, $.jsx)(
                  `line`,
                  { x1: `0`, x2: 342, y1: e, y2: e, className: `f2-grade` },
                  e,
                ),
              ),
              (0, $.jsx)(`path`, {
                d: n + ` L342 150 L0 150 Z`,
                fill: `url(#f2g)`,
                className: `f2-area` + (e ? ` on` : ``),
              }),
              (0, $.jsx)(`path`, {
                d: n,
                className: `f2-linha` + (e ? ` on` : ``),
              }),
              (0, $.jsx)(`circle`, {
                cx: 342,
                cy: 18.400000000000006,
                r: `5`,
                className: `f2-ponto`,
              }),
            ],
          }),
          (0, $.jsx)(`div`, {
            className: `f2-eixo`,
            children: [`1`, `5`, `10`, `15`, `20`, `25`, `30`].map((e) =>
              (0, $.jsx)(`span`, { children: e }, e),
            ),
          }),
        ],
      }),
      (0, $.jsx)(`div`, {
        className: `f2-acoes`,
        children: [
          [kl, `Pix`],
          [Uc, `Pagar`],
          [Vl, `Metas`],
          [Zc, `Relatórios`],
        ].map(([e, t]) =>
          (0, $.jsxs)(
            `div`,
            {
              children: [
                (0, $.jsx)(`span`, { children: (0, $.jsx)(e, { size: 22 }) }),
                t,
              ],
            },
            t,
          ),
        ),
      }),
      (0, $.jsxs)(`div`, {
        className: `f2-lista`,
        children: [
          (0, $.jsxs)(`div`, {
            className: `f2-cab`,
            children: [
              (0, $.jsx)(`b`, { children: `Movimentações` }),
              (0, $.jsx)(`span`, { children: `Ver tudo` }),
            ],
          }),
          r.map(([e, t, n, r, i], a) =>
            (0, $.jsxs)(
              `div`,
              {
                className: `f2-it ` + i,
                style: { "--d": 0.15 + a * 0.2 + `s` },
                children: [
                  (0, $.jsx)(`span`, { children: (0, $.jsx)(e, { size: 18 }) }),
                  (0, $.jsxs)(`div`, {
                    children: [
                      (0, $.jsx)(`b`, { children: t }),
                      (0, $.jsx)(`small`, { children: n }),
                    ],
                  }),
                  (0, $.jsx)(`em`, { children: r }),
                ],
              },
              a,
            ),
          ),
        ],
      }),
    ],
  });
}
function iu() {
  return (0, $.jsxs)(eu, {
    w: 390,
    h: 844,
    className: `t-pil`,
    children: [
      (0, $.jsx)(tu, {}),
      (0, $.jsxs)(`div`, {
        className: `p2-topo`,
        children: [
          (0, $.jsxs)(`div`, {
            children: [
              (0, $.jsx)(`small`, { children: `Quinta, 14 de novembro` }),
              (0, $.jsx)(`b`, { children: `Bom dia, Carol` }),
            ],
          }),
          (0, $.jsx)(`img`, { src: `./img/pilates-sq.webp`, alt: `` }),
        ],
      }),
      (0, $.jsxs)(`div`, {
        className: `p2-hero`,
        children: [
          (0, $.jsx)(`img`, { src: `./img/pilates.webp`, alt: `` }),
          (0, $.jsxs)(`div`, {
            children: [
              (0, $.jsx)(`span`, { children: `Hoje · 18h00` }),
              (0, $.jsx)(`b`, { children: `Reformer Flow` }),
              (0, $.jsxs)(`small`, {
                children: [
                  (0, $.jsx)(_l, { size: 13 }),
                  ` Sala 2 · Prof. Bruna`,
                ],
              }),
            ],
          }),
          (0, $.jsx)(`em`, { children: `Confirmada` }),
        ],
      }),
      (0, $.jsxs)(`div`, {
        className: `p2-sem`,
        children: [
          (0, $.jsxs)(`div`, {
            className: `p2-cab`,
            children: [
              (0, $.jsx)(`b`, { children: `Sua semana` }),
              (0, $.jsxs)(`span`, {
                children: [(0, $.jsx)(dl, { size: 15 }), ` 4 seguidas`],
              }),
            ],
          }),
          (0, $.jsx)(`div`, {
            className: `p2-dias`,
            children: [
              [`S`, 11, 1],
              [`T`, 12, 1],
              [`Q`, 13, 1],
              [`Q`, 14, 2],
              [`S`, 15, 0],
              [`S`, 16, 0],
              [`D`, 17, 0],
            ].map(([e, t, n], r) =>
              (0, $.jsxs)(
                `span`,
                {
                  className: `s` + n,
                  children: [(0, $.jsx)(`small`, { children: e }), t],
                },
                r,
              ),
            ),
          }),
        ],
      }),
      (0, $.jsxs)(`div`, {
        className: `p2-prox`,
        children: [
          (0, $.jsxs)(`div`, {
            className: `p2-cab`,
            children: [
              (0, $.jsx)(`b`, { children: `Próximas aulas` }),
              (0, $.jsxs)(`span`, {
                children: [`Agenda `, (0, $.jsx)(tl, { size: 15 })],
              }),
            ],
          }),
          [
            [`Sex`, `07:00`, `Mat Core`, `Prof. Ana`, `3 vagas`],
            [`Sáb`, `09:30`, `Reformer Postura`, `Prof. Bruna`, `Lotada`],
          ].map(([e, t, n, r, i]) =>
            (0, $.jsxs)(
              `div`,
              {
                className: `p2-aula`,
                children: [
                  (0, $.jsxs)(`div`, {
                    className: `p2-hora`,
                    children: [
                      (0, $.jsx)(`small`, { children: e }),
                      (0, $.jsx)(`b`, { children: t }),
                    ],
                  }),
                  (0, $.jsxs)(`div`, {
                    children: [
                      (0, $.jsx)(`b`, { children: n }),
                      (0, $.jsx)(`small`, { children: r }),
                    ],
                  }),
                  (0, $.jsx)(`em`, {
                    className: i === `Lotada` ? `x` : ``,
                    children: i,
                  }),
                ],
              },
              n,
            ),
          ),
        ],
      }),
      (0, $.jsx)(`nav`, {
        className: `p2-tab`,
        children: [
          [pl, `Início`],
          [qc, `Agenda`],
          [Zc, `Progresso`],
          [ql, `Perfil`],
        ].map(([e, t], n) =>
          (0, $.jsxs)(
            `span`,
            {
              className: n === 0 ? `on` : ``,
              children: [(0, $.jsx)(e, { size: 22 }), t],
            },
            t,
          ),
        ),
      }),
    ],
  });
}
function au() {
  return (0, $.jsxs)(eu, {
    w: 390,
    h: 844,
    className: `t-pil`,
    children: [
      (0, $.jsx)(tu, {}),
      (0, $.jsxs)(`div`, {
        className: `p2-volta`,
        children: [
          (0, $.jsx)(Vc, { size: 22 }),
          (0, $.jsx)(`b`, { children: `Reservar aula` }),
          (0, $.jsx)(`span`, {}),
        ],
      }),
      (0, $.jsx)(`div`, {
        className: `p2-cal`,
        children: [
          [`Qui`, 14],
          [`Sex`, 15],
          [`Sáb`, 16],
          [`Seg`, 18],
          [`Ter`, 19],
        ].map(([e, t], n) =>
          (0, $.jsxs)(
            `span`,
            {
              className: n === 1 ? `on` : ``,
              children: [(0, $.jsx)(`small`, { children: e }), t],
            },
            n,
          ),
        ),
      }),
      (0, $.jsx)(`div`, {
        className: `p2-horas`,
        children: [
          [`07:00`, `Mat Core`, `3`],
          [`08:00`, `Reformer`, `0`],
          [`12:00`, `Alongamento`, `5`],
          [`18:00`, `Reformer Flow`, `2`],
          [`19:00`, `Mat Core`, `6`],
        ].map(([e, t, n], r) =>
          (0, $.jsxs)(
            `div`,
            {
              className: (r === 3 ? `on ` : ``) + (n === `0` ? `x` : ``),
              children: [
                (0, $.jsx)(`b`, { children: e }),
                (0, $.jsxs)(`div`, {
                  children: [
                    (0, $.jsx)(`span`, { children: t }),
                    (0, $.jsx)(`small`, {
                      children: n === `0` ? `Lotada` : n + ` vagas`,
                    }),
                  ],
                }),
                r === 3 && (0, $.jsx)($c, { size: 18 }),
              ],
            },
            e,
          ),
        ),
      }),
      (0, $.jsxs)(`div`, {
        className: `p2-conf`,
        children: [
          (0, $.jsxs)(`span`, {
            children: [(0, $.jsx)(rl, { size: 16 }), ` Sexta, 18h00 · 50 min`],
          }),
          (0, $.jsx)(`b`, { children: `Confirmar reserva` }),
        ],
      }),
    ],
  });
}
function ou() {
  return (0, $.jsx)(eu, {
    w: 1280,
    h: 820,
    className: `t-rz`,
    children: (0, $.jsxs)(`div`, {
      className: `rz-rolo`,
      children: [
        (0, $.jsxs)(`nav`, {
          className: `rz-nav`,
          children: [
            (0, $.jsxs)(`b`, {
              children: [`raízes`, (0, $.jsx)(`i`, { children: `.` })],
            }),
            (0, $.jsx)(`span`, { children: `O método` }),
            (0, $.jsx)(`span`, { children: `Para quem é` }),
            (0, $.jsx)(`span`, { children: `Investimento` }),
            (0, $.jsx)(`span`, { children: `Dúvidas` }),
            (0, $.jsx)(`em`, { children: `Entrar na turma` }),
          ],
        }),
        (0, $.jsxs)(`section`, {
          className: `rz-hero`,
          children: [
            (0, $.jsxs)(`div`, {
              className: `rz-txt`,
              children: [
                (0, $.jsxs)(`span`, {
                  className: `rz-sel`,
                  children: [
                    (0, $.jsx)(zl, { size: 15 }),
                    ` Turma 3 · inscrições abertas`,
                  ],
                }),
                (0, $.jsxs)(`h1`, {
                  children: [
                    `Do zero ao seu`,
                    (0, $.jsx)(`br`, {}),
                    `primeiro lançamento.`,
                  ],
                }),
                (0, $.jsx)(`p`, {
                  children: `Oito semanas para transformar o que você sabe em um curso que vende. Com encontros ao vivo, correção da sua página e alguém do seu lado em cada passo.`,
                }),
                (0, $.jsxs)(`div`, {
                  className: `rz-ctas`,
                  children: [
                    (0, $.jsx)(`em`, { children: `Quero minha vaga` }),
                    (0, $.jsxs)(`span`, {
                      children: [
                        (0, $.jsx)(Dl, { size: 16 }),
                        ` Ver como funciona`,
                      ],
                    }),
                  ],
                }),
                (0, $.jsxs)(`div`, {
                  className: `rz-prova`,
                  children: [
                    (0, $.jsxs)(`div`, {
                      children: [
                        (0, $.jsx)(`b`, { children: `8` }),
                        (0, $.jsx)(`small`, { children: `semanas` }),
                      ],
                    }),
                    (0, $.jsxs)(`div`, {
                      children: [
                        (0, $.jsx)(`b`, { children: `16` }),
                        (0, $.jsx)(`small`, { children: `encontros ao vivo` }),
                      ],
                    }),
                    (0, $.jsxs)(`div`, {
                      children: [
                        (0, $.jsx)(`b`, { children: `1 ano` }),
                        (0, $.jsx)(`small`, { children: `de acesso` }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            (0, $.jsxs)(`div`, {
              className: `rz-foto`,
              children: [
                (0, $.jsx)(`img`, { src: `./img/mentora.webp`, alt: `` }),
                (0, $.jsxs)(`div`, {
                  className: `rz-card`,
                  children: [
                    (0, $.jsx)(`span`, {
                      children: (0, $.jsx)(Yl, { size: 18 }),
                    }),
                    (0, $.jsxs)(`div`, {
                      children: [
                        (0, $.jsx)(`b`, { children: `Próximo encontro` }),
                        (0, $.jsx)(`small`, {
                          children: `terça, 20h · ao vivo`,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        (0, $.jsxs)(`section`, {
          className: `rz-mods`,
          children: [
            (0, $.jsx)(`h2`, { children: `O que você vai construir` }),
            (0, $.jsx)(`div`, {
              children: [
                [
                  `01`,
                  `Seu método`,
                  `Transforme o que você sabe em um passo a passo que outra pessoa consegue seguir.`,
                ],
                [
                  `02`,
                  `Sua oferta`,
                  `Preço, bônus e garantia que fazem sentido para quem compra.`,
                ],
                [
                  `03`,
                  `Sua página`,
                  `Texto e estrutura que levam a pessoa até o botão de compra.`,
                ],
                [
                  `04`,
                  `Seu lançamento`,
                  `Aquecimento, abertura e fechamento de carrinho, semana a semana.`,
                ],
              ].map(([e, t, n]) =>
                (0, $.jsxs)(
                  `article`,
                  {
                    children: [
                      (0, $.jsx)(`span`, { children: e }),
                      (0, $.jsx)(`b`, { children: t }),
                      (0, $.jsx)(`p`, { children: n }),
                    ],
                  },
                  e,
                ),
              ),
            }),
          ],
        }),
        (0, $.jsxs)(`section`, {
          className: `rz-preco`,
          children: [
            (0, $.jsxs)(`div`, {
              children: [
                (0, $.jsx)(`small`, { children: `investimento` }),
                (0, $.jsx)(`b`, { children: `12x de R$ 97` }),
                (0, $.jsx)(`span`, { children: `ou R$ 997 à vista` }),
              ],
            }),
            (0, $.jsx)(`em`, { children: `Entrar para a turma 3` }),
            (0, $.jsxs)(`p`, {
              children: [
                (0, $.jsx)(Ll, { size: 16 }),
                ` 7 dias de garantia incondicional`,
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
function su() {
  return (0, $.jsxs)(eu, {
    w: 390,
    h: 844,
    className: `t-rz cel`,
    children: [
      (0, $.jsx)(tu, {}),
      (0, $.jsxs)(`nav`, {
        className: `rz-nav m`,
        children: [
          (0, $.jsxs)(`b`, {
            children: [`raízes`, (0, $.jsx)(`i`, { children: `.` })],
          }),
          (0, $.jsx)(`em`, { children: `Entrar` }),
        ],
      }),
      (0, $.jsxs)(`div`, {
        className: `rz-m`,
        children: [
          (0, $.jsx)(`img`, { src: `./img/mentora.webp`, alt: `` }),
          (0, $.jsxs)(`span`, {
            className: `rz-sel`,
            children: [(0, $.jsx)(zl, { size: 13 }), ` Turma 3 aberta`],
          }),
          (0, $.jsx)(`h1`, { children: `Do zero ao seu primeiro lançamento.` }),
          (0, $.jsx)(`p`, {
            children: `Oito semanas, encontros ao vivo e alguém do seu lado em cada passo.`,
          }),
          (0, $.jsx)(`em`, { children: `Quero minha vaga` }),
        ],
      }),
      (0, $.jsxs)(`div`, {
        className: `rz-ok`,
        children: [
          (0, $.jsx)(`span`, { children: (0, $.jsx)($c, { size: 22 }) }),
          (0, $.jsx)(`b`, { children: `Pagamento aprovado` }),
          (0, $.jsx)(`small`, {
            children: `Bem-vinda à turma 3. O acesso chegou no seu e-mail.`,
          }),
        ],
      }),
    ],
  });
}
function cu({ ativa: e }) {
  return (0, $.jsxs)(eu, {
    w: 1280,
    h: 800,
    className: `t-fd`,
    children: [
      (0, $.jsxs)(`aside`, {
        className: `fd-lado`,
        children: [
          (0, $.jsxs)(`div`, {
            className: `fd-marca`,
            children: [
              (0, $.jsx)(`i`, { children: `F` }),
              (0, $.jsx)(`b`, { children: `Fluxo` }),
            ],
          }),
          [
            [hl, `Visão geral`, 1],
            [$l, `Movimentações`],
            [jl, `Contas a pagar`],
            [Tl, `Metas e reserva`],
            [Zc, `Relatórios`],
            [Fl, `Ajustes`],
          ].map(([e, t, n]) =>
            (0, $.jsxs)(
              `div`,
              {
                className: `fd-item` + (n ? ` on` : ``),
                children: [(0, $.jsx)(e, { size: 18 }), t],
              },
              t,
            ),
          ),
          (0, $.jsxs)(`div`, {
            className: `fd-plano`,
            children: [
              (0, $.jsx)(`small`, { children: `Reserva de emergência` }),
              (0, $.jsxs)(`b`, {
                children: [
                  `R$ 21.600 `,
                  (0, $.jsx)(`span`, { children: `de 30.000` }),
                ],
              }),
              (0, $.jsx)(`i`, {
                children: (0, $.jsx)(`em`, {
                  style: { width: e ? `72%` : `0%` },
                }),
              }),
            ],
          }),
        ],
      }),
      (0, $.jsxs)(`main`, {
        className: `fd-main`,
        children: [
          (0, $.jsxs)(`header`, {
            className: `fd-topo`,
            children: [
              (0, $.jsxs)(`div`, {
                children: [
                  (0, $.jsx)(`small`, { children: `Visão geral` }),
                  (0, $.jsx)(`h4`, { children: `Novembro de 2026` }),
                ],
              }),
              (0, $.jsxs)(`div`, {
                className: `fd-busca`,
                children: [(0, $.jsx)(Nl, { size: 16 }), ` Buscar lançamento`],
              }),
              (0, $.jsx)(`span`, { className: `fd-av`, children: `FE` }),
            ],
          }),
          (0, $.jsx)(`div`, {
            className: `fd-kpis`,
            children: [
              [`Entradas`, `32.640`, `+ 23% vs outubro`, `e`, Gl],
              [`Saídas`, `14.220`, `− 8% vs outubro`, `s`, Ul],
              [`Lucro do mês`, `18.420`, `margem de 56%`, `l`, Gl],
              [`A receber`, `4.180`, `6 clientes`, `n`, rl],
            ].map(([e, t, n, r, i]) => {
              let a = i;
              return (0, $.jsxs)(
                `div`,
                {
                  className: `fd-kpi ` + r,
                  children: [
                    (0, $.jsx)(`small`, { children: e }),
                    (0, $.jsxs)(`b`, {
                      children: [
                        (0, $.jsx)(`span`, { children: `R$` }),
                        ` `,
                        t,
                      ],
                    }),
                    (0, $.jsxs)(`em`, {
                      children: [(0, $.jsx)(a, { size: 14 }), ` `, n],
                    }),
                  ],
                },
                e,
              );
            }),
          }),
          (0, $.jsxs)(`div`, {
            className: `fd-meio`,
            children: [
              (0, $.jsxs)(`div`, {
                className: `fd-card fd-barras`,
                children: [
                  (0, $.jsxs)(`div`, {
                    className: `fd-cab`,
                    children: [
                      (0, $.jsx)(`b`, { children: `Entradas e saídas` }),
                      (0, $.jsxs)(`span`, {
                        children: [
                          (0, $.jsx)(`i`, { className: `e` }),
                          `Entradas `,
                          (0, $.jsx)(`i`, { className: `s` }),
                          `Saídas`,
                        ],
                      }),
                    ],
                  }),
                  (0, $.jsx)(`div`, {
                    className: `fd-cols`,
                    children: [
                      [`Jun`, 21, 13],
                      [`Jul`, 24, 15],
                      [`Ago`, 22, 12],
                      [`Set`, 27, 14],
                      [`Out`, 26.5, 15.5],
                      [`Nov`, 32.6, 14.2],
                    ].map(([t, n, r], i) =>
                      (0, $.jsxs)(
                        `div`,
                        {
                          className: `fd-col`,
                          children: [
                            (0, $.jsxs)(`div`, {
                              className: `fd-par`,
                              children: [
                                (0, $.jsx)(`i`, {
                                  className: `e`,
                                  style: {
                                    height: e ? n * 2.6 + `%` : `0%`,
                                    transitionDelay: i * 0.08 + `s`,
                                  },
                                }),
                                (0, $.jsx)(`i`, {
                                  className: `s`,
                                  style: {
                                    height: e ? r * 2.6 + `%` : `0%`,
                                    transitionDelay: i * 0.08 + 0.1 + `s`,
                                  },
                                }),
                              ],
                            }),
                            (0, $.jsx)(`small`, { children: t }),
                          ],
                        },
                        t,
                      ),
                    ),
                  }),
                ],
              }),
              (0, $.jsxs)(`div`, {
                className: `fd-card fd-cats`,
                children: [
                  (0, $.jsx)(`div`, {
                    className: `fd-cab`,
                    children: (0, $.jsx)(`b`, {
                      children: `Para onde foi o dinheiro`,
                    }),
                  }),
                  [
                    [`Aluguel e contas`, 38, `#E2BC74`],
                    [`Produtos`, 24, `#5FE3B4`],
                    [`Equipe`, 21, `#8FB8FF`],
                    [`Marketing`, 11, `#F2A65A`],
                    [`Outros`, 6, `#9AA7A3`],
                  ].map(([t, n, r], i) =>
                    (0, $.jsxs)(
                      `div`,
                      {
                        className: `fd-cat`,
                        children: [
                          (0, $.jsxs)(`span`, {
                            children: [
                              (0, $.jsx)(`i`, { style: { background: r } }),
                              t,
                            ],
                          }),
                          (0, $.jsxs)(`em`, { children: [n, `%`] }),
                          (0, $.jsx)(`div`, {
                            children: (0, $.jsx)(`b`, {
                              style: {
                                width: e ? n * 2.4 + `%` : `0%`,
                                background: r,
                                transitionDelay: 0.4 + i * 0.1 + `s`,
                              },
                            }),
                          }),
                        ],
                      },
                      t,
                    ),
                  ),
                ],
              }),
            ],
          }),
          (0, $.jsxs)(`div`, {
            className: `fd-card fd-tab`,
            children: [
              (0, $.jsxs)(`div`, {
                className: `fd-cab`,
                children: [
                  (0, $.jsx)(`b`, { children: `Últimos lançamentos` }),
                  (0, $.jsx)(`span`, { children: `Ver todos` }),
                ],
              }),
              [
                [
                  `12 nov`,
                  `Marina Souza`,
                  `Design de sobrancelha`,
                  `Pix`,
                  `+ 350,00`,
                  `e`,
                ],
                [
                  `12 nov`,
                  `Hotmart`,
                  `Venda · Método Bela`,
                  `Cartão`,
                  `+ 997,00`,
                  `e`,
                ],
                [
                  `11 nov`,
                  `Imobiliária Centro`,
                  `Aluguel do espaço`,
                  `Boleto`,
                  `− 2.100,00`,
                  `s`,
                ],
                [
                  `11 nov`,
                  `Carla Mendes`,
                  `Limpeza de pele`,
                  `Pix`,
                  `+ 180,00`,
                  `e`,
                ],
                [
                  `10 nov`,
                  `Distribuidora Bella`,
                  `Produtos`,
                  `Boleto`,
                  `− 640,00`,
                  `s`,
                ],
              ].map((e, t) =>
                (0, $.jsxs)(
                  `div`,
                  {
                    className: `fd-lin ` + e[5],
                    children: [
                      (0, $.jsx)(`span`, { children: e[0] }),
                      (0, $.jsx)(`b`, { children: e[1] }),
                      (0, $.jsx)(`span`, { children: e[2] }),
                      (0, $.jsx)(`span`, {
                        className: `fd-tag`,
                        children: e[3],
                      }),
                      (0, $.jsx)(`em`, { children: e[4] }),
                    ],
                  },
                  t,
                ),
              ),
            ],
          }),
        ],
      }),
    ],
  });
}
var lu = {
  secretaria: {
    src: `./img/bg-secretaria.webp`,
    cel: `./img/bg-secretaria-cel.webp`,
    pos: `70% 60%`,
  },
  financas: { src: `./img/bg-financas.webp`, pos: `70% 55%` },
  app: {
    src: `./img/bg-pilates.webp`,
    cel: `./img/bg-pilates-cel.webp`,
    pos: `75% 60%`,
  },
  vendas: { src: `./img/bg-raizes.webp`, pos: `50% 45%` },
  membros: { src: `./img/bg-essencia.webp`, pos: `80% 50%` },
  site: { src: `./img/bg-donna.webp`, pos: `70% 60%` },
  apostila: { src: `./img/bg-doces.webp`, pos: `70% 50%` },
  videos: {
    src: `./img/bg-videos.webp`,
    video: `./videos/bg-videos.mp4`,
    pos: `70% 50%`,
  },
};
function uu({ f: e }) {
  let t = (0, l.useRef)(null),
    n = (0, l.useRef)(null),
    r = du(t);
  (0, l.useEffect)(() => {
    let e = n.current;
    e && (r ? e.play().catch(() => {}) : e.pause());
  }, [r]);
  let i = { objectPosition: e.pos };
  return (0, $.jsx)(`div`, {
    className: `cena-foto`,
    ref: t,
    children: (0, $.jsx)(`div`, {
      className: `foto-in`,
      children: e.video
        ? (0, $.jsx)(`video`, {
            ref: n,
            className: `foto-img`,
            src: e.video,
            poster: e.src,
            muted: !0,
            loop: !0,
            playsInline: !0,
            preload: `none`,
            style: i,
          })
        : (0, $.jsxs)(`picture`, {
            children: [
              e.cel &&
                (0, $.jsx)(`source`, {
                  media: `(max-width: 760px)`,
                  srcSet: e.cel,
                }),
              (0, $.jsx)(`img`, {
                className: `foto-img`,
                src: e.src,
                alt: ``,
                style: i,
                decoding: `async`,
              }),
            ],
          }),
    }),
  });
}
function du(e) {
  let [t, n] = (0, l.useState)(!1);
  return (
    (0, l.useEffect)(() => {
      let t = e.current?.closest(`.cena`);
      if (!t) return;
      let r = new MutationObserver(() => n(t.classList.contains(`ativa`)));
      return (
        r.observe(t, { attributes: !0, attributeFilter: [`class`] }),
        () => r.disconnect()
      );
    }, [e]),
    t
  );
}
function fu({ children: e, chips: t = [], luz: n }) {
  let r = (0, l.useRef)(null);
  return (
    (0, l.useEffect)(() => {
      let e = r.current;
      if (
        matchMedia(`(pointer: coarse)`).matches ||
        matchMedia(`(prefers-reduced-motion: reduce)`).matches
      )
        return;
      let t = e.closest(`.cena`),
        n = 0,
        i = 0,
        a = 0,
        o = 0,
        s = 0,
        c = () => {
          ((n += (a - n) * 0.08),
            (i += (o - i) * 0.08),
            e.style.setProperty(`--rx`, (i * -7).toFixed(2) + `deg`),
            e.style.setProperty(`--ry`, (n * 11).toFixed(2) + `deg`),
            e.style.setProperty(`--px`, n.toFixed(3)),
            e.style.setProperty(`--py`, i.toFixed(3)),
            e.style.setProperty(`--mx`, (n * 50 + 50).toFixed(1) + `%`),
            e.style.setProperty(`--my`, (i * 50 + 50).toFixed(1) + `%`),
            (s =
              Math.abs(a - n) + Math.abs(o - i) > 0.004
                ? requestAnimationFrame(c)
                : 0));
        },
        l = (e) => {
          (!t || t.classList.contains(`ativa`)) &&
            ((a = (e.clientX / innerWidth - 0.5) * 2),
            (o = (e.clientY / innerHeight - 0.5) * 2),
            (s ||= requestAnimationFrame(c)));
        };
      return (
        addEventListener(`pointermove`, l, { passive: !0 }),
        () => {
          (removeEventListener(`pointermove`, l), cancelAnimationFrame(s));
        }
      );
    }, []),
    (0, $.jsxs)(`div`, {
      className: `palco`,
      ref: r,
      style: { "--luz": n },
      children: [
        (0, $.jsx)(`div`, { className: `palco-luz` }),
        (0, $.jsx)(`div`, { className: `palco-chao` }),
        (0, $.jsx)(`div`, { className: `palco-obj`, children: e }),
        t.map((e, t) =>
          (0, $.jsxs)(
            `div`,
            {
              className: `chip chip-` + (e.tipo || `neutro`),
              style: {
                left: e.x,
                top: e.y,
                "--d": 0.8 + t * 0.5 + `s`,
                "--f": 4 + t * 0.7 + `s`,
              },
              children: [
                (0, $.jsx)(`i`, {}),
                (0, $.jsxs)(`div`, {
                  children: [
                    (0, $.jsx)(`b`, { children: e.t }),
                    e.s && (0, $.jsx)(`small`, { children: e.s }),
                  ],
                }),
              ],
            },
            t,
          ),
        ),
      ],
    })
  );
}
function pu({ children: e, className: t = ``, style: n }) {
  return (0, $.jsxs)(`div`, {
    className: `mk-cel ` + t,
    style: n,
    children: [
      (0, $.jsx)(`span`, { className: `cel-bt b1` }),
      (0, $.jsx)(`span`, { className: `cel-bt b2` }),
      (0, $.jsx)(`span`, { className: `cel-bt b3` }),
      (0, $.jsxs)(`div`, {
        className: `mk-cel-tela`,
        children: [
          (0, $.jsxs)(`div`, {
            className: `cel-status`,
            children: [
              (0, $.jsx)(`b`, { children: `9:41` }),
              (0, $.jsx)(`span`, { children: `▮▮▮ ◠ ▭` }),
            ],
          }),
          e,
        ],
      }),
      (0, $.jsx)(`i`, { className: `mk-ilha` }),
    ],
  });
}
function mu({
  url: e,
  children: t,
  className: n = ``,
  escuro: r = !1,
  style: i,
}) {
  return (0, $.jsxs)(`div`, {
    className: `mk-nav ` + (r ? `escuro ` : ``) + n,
    style: i,
    children: [
      (0, $.jsxs)(`div`, {
        className: `mk-nav-barra`,
        children: [
          (0, $.jsx)(`i`, {}),
          (0, $.jsx)(`i`, {}),
          (0, $.jsx)(`i`, {}),
          (0, $.jsx)(`em`, { children: e }),
        ],
      }),
      (0, $.jsx)(`div`, { className: `mk-nav-corpo`, children: t }),
    ],
  });
}
function hu() {
  return (0, $.jsxs)(`div`, {
    className: `comp comp-secretaria`,
    children: [
      (0, $.jsx)(mu, {
        url: `SecretarIA`,
        className: `sc-painel`,
        children: (0, $.jsx)(`img`, {
          src: `./img/real-secretaria.webp`,
          alt: `Página de vendas da SecretarIA`,
        }),
      }),
      (0, $.jsx)(pu, { className: `sc-cel`, children: (0, $.jsx)(nu, {}) }),
    ],
  });
}
function gu() {
  let e = (0, l.useRef)(null),
    t = du(e);
  return (0, $.jsxs)(`div`, {
    className: `comp comp-fin2`,
    ref: e,
    children: [
      (0, $.jsx)(mu, {
        url: `painel financeiro`,
        escuro: !0,
        className: `fin2-nav`,
        children: (0, $.jsx)(cu, { ativa: t }),
      }),
      (0, $.jsx)(pu, {
        className: `fin2-cel`,
        children: (0, $.jsx)(ru, { ativa: t }),
      }),
      (0, $.jsx)(`div`, {
        className: `fin-moeda fin2-moeda`,
        children: (0, $.jsxs)(`div`, {
          className: `moeda`,
          children: [
            (0, $.jsx)(`i`, { className: `f` }),
            (0, $.jsx)(`i`, { className: `v` }),
          ],
        }),
      }),
    ],
  });
}
function _u() {
  return (0, $.jsxs)(`div`, {
    className: `comp comp-pil`,
    children: [
      (0, $.jsx)(pu, { className: `pil-tras`, children: (0, $.jsx)(au, {}) }),
      (0, $.jsx)(pu, { className: `pil-frente`, children: (0, $.jsx)(iu, {}) }),
    ],
  });
}
function vu() {
  return (0, $.jsxs)(`div`, {
    className: `comp comp-pv`,
    children: [
      (0, $.jsx)(mu, {
        url: `mentoria raízes`,
        className: `mk-pv`,
        children: (0, $.jsx)(ou, {}),
      }),
      (0, $.jsx)(pu, { className: `pv-cel`, children: (0, $.jsx)(su, {}) }),
    ],
  });
}
var yu = [
  [`C`, `Compreenda`, `Faz sentido. Investir agora pesa mesmo.`],
  [`L`, `Ligue`, `Me conta: o que mais te trava hoje no salão?`],
  [
    `A`,
    `Apresente`,
    `O método resolve isso em quatro semanas, com roteiro pronto.`,
  ],
  [
    `R`,
    `Responda`,
    `Dá para dividir em seis vezes. Menos que um atendimento por mês.`,
  ],
  [`A`, `Avance`, `Te mando o link para garantir a vaga de hoje?`],
];
function bu() {
  let e = (0, l.useRef)(null),
    t = du(e),
    [n, r] = (0, l.useState)(0),
    [i, a] = (0, l.useState)(0);
  return (
    (0, l.useEffect)(() => {
      if (!t) {
        r(0);
        return;
      }
      if (i && Date.now() - i < 9e3) {
        let e = window.setTimeout(() => a(0), 9e3 - (Date.now() - i));
        return () => clearTimeout(e);
      }
      let e = n < 0 ? 0 : n,
        o = window.setInterval(() => {
          ((e = (e + 1) % yu.length), r(e));
        }, 2400);
      return () => clearInterval(o);
    }, [t, i]),
    (0, $.jsxs)(`div`, {
      className: `comp comp-me3`,
      ref: e,
      children: [
        (0, $.jsx)(pu, {
          className: `me3-cel`,
          children: (0, $.jsx)(`img`, {
            src: `./img/me-clara.webp`,
            alt: `Treinador de vendas do Método Essência no celular`,
          }),
        }),
        (0, $.jsxs)(`div`, {
          className: `me4`,
          children: [
            (0, $.jsxs)(`div`, {
              className: `me4-cab`,
              children: [
                (0, $.jsx)(`b`, { children: `Treinador de vendas` }),
                (0, $.jsx)(`span`, {
                  children: `responda qualquer objeção em 5 passos`,
                }),
              ],
            }),
            (0, $.jsxs)(`div`, {
              className: `me4-obj`,
              children: [
                (0, $.jsx)(`small`, { children: `a cliente diz` }),
                (0, $.jsx)(`p`, {
                  children: `“Está caro, não tenho esse orçamento agora.”`,
                }),
              ],
            }),
            (0, $.jsx)(`ol`, {
              className: `me4-passos`,
              children: yu.map(([e, t, i], o) =>
                (0, $.jsxs)(
                  `li`,
                  {
                    className: o === n ? `on` : o < n ? `foi` : ``,
                    children: [
                      (0, $.jsxs)(`button`, {
                        type: `button`,
                        onClick: () => {
                          (r(o), a(Date.now()));
                        },
                        children: [
                          (0, $.jsx)(`i`, { children: e }),
                          (0, $.jsx)(`b`, { children: t }),
                        ],
                      }),
                      (0, $.jsx)(`p`, { children: i }),
                    ],
                  },
                  o,
                ),
              ),
            }),
          ],
        }),
      ],
    })
  );
}
function xu() {
  let e = (0, l.useRef)(null),
    t = (0, l.useRef)(null),
    n = du(e);
  return (
    (0, l.useEffect)(() => {
      let e = t.current;
      if (!e || !n) return;
      let r = () => e.scrollHeight / 5,
        i = 0,
        a = Math.round(e.scrollTop / r()),
        o = () => {
          i = Date.now();
        };
      (e.addEventListener(`pointerdown`, o),
        e.addEventListener(`wheel`, o, { passive: !0 }),
        e.addEventListener(`touchstart`, o, { passive: !0 }));
      let s = window.setInterval(() => {
        Date.now() - i < 7e3
          ? (a = Math.round(e.scrollTop / r()))
          : ((a = (a + 1) % 5),
            e.scrollTo({ top: a * r(), behavior: `smooth` }));
      }, 2600);
      return () => {
        (clearInterval(s),
          e.removeEventListener(`pointerdown`, o),
          e.removeEventListener(`wheel`, o),
          e.removeEventListener(`touchstart`, o));
      };
    }, [n]),
    (0, $.jsxs)(`div`, {
      className: `comp comp-dn3`,
      ref: e,
      children: [
        (0, $.jsx)(pu, {
          className: `dn3-cel`,
          children: (0, $.jsx)(`div`, {
            className: `dn3-rola`,
            ref: t,
            children: (0, $.jsx)(`img`, {
              src: `./img/dn-rolagem.webp`,
              alt: `Site da Donna Nina no celular: role para ver as bolachas`,
            }),
          }),
        }),
        (0, $.jsx)(`span`, {
          className: `toque-dica dn3-dica`,
          children: `role a tela do celular`,
        }),
        (0, $.jsxs)(`div`, {
          className: `dn2-etiq dn3-etiq`,
          children: [
            (0, $.jsx)(`small`, { children: `encomenda nº 048` }),
            (0, $.jsxs)(`b`, {
              children: [`2× Alfajor`, (0, $.jsx)(`br`, {}), `1× Especiarias`],
            }),
            (0, $.jsx)(`span`, { children: `retirar sábado · Palhoça` }),
          ],
        }),
      ],
    })
  );
}
var Su = [
  {
    t: `Pele em Dia`,
    n: `estética`,
    f: `E-book`,
    bg: `#EAD8CA`,
    fg: `#6B3B2E`,
    ac: `#B9785F`,
    serif: !0,
  },
  {
    t: `Unha de Salão`,
    n: `nail designer`,
    f: `Apostila`,
    bg: `#1B1517`,
    fg: `#F2B8C6`,
    ac: `#F2B8C6`,
    serif: !1,
  },
  {
    t: `Dinheiro em Ordem`,
    n: `finanças`,
    f: `Workbook`,
    bg: `#123A2E`,
    fg: `#F1D9A0`,
    ac: `#E2BC74`,
    serif: !0,
  },
  {
    t: `Pilates em Casa`,
    n: `saúde`,
    f: `Slides`,
    bg: `#EEEADF`,
    fg: `#3F5B47`,
    ac: `#7E9A83`,
    serif: !1,
  },
  {
    t: `Inglês sem Medo`,
    n: `idiomas`,
    f: `PDF`,
    bg: `#1F2B55`,
    fg: `#F4C653`,
    ac: `#F4C653`,
    serif: !1,
  },
  {
    t: `Pão Caseiro`,
    n: `gastronomia`,
    f: `Apostila`,
    bg: `#C98A3E`,
    fg: `#2A1608`,
    ac: `#2A1608`,
    serif: !0,
  },
];
function Cu() {
  let e = (0, l.useRef)(null),
    t = du(e),
    [n, r] = (0, l.useState)(0),
    [i, a] = (0, l.useState)(0);
  (0, l.useEffect)(() => {
    if (!t) {
      r(0);
      return;
    }
    if (i && Date.now() - i < 9e3) {
      let e = window.setTimeout(() => a(0), 9e3 - (Date.now() - i));
      return () => clearTimeout(e);
    }
    let e = n,
      s =
        e === 0
          ? window.setTimeout(() => {
              ((e = 1), r(1));
            }, 900)
          : 0,
      o = window.setInterval(() => {
        ((e = (e + 1) % 5), r(Math.min(e, 3)));
      }, 2600);
    return () => {
      (clearTimeout(s), clearInterval(o));
    };
  }, [t, i]);
  let o = () => {
      (r((e) => (e >= 3 ? 0 : e + 1)), a(Date.now()));
    },
    s = [
      [
        (0, $.jsxs)(`div`, {
          className: `lv-capa`,
          children: [
            (0, $.jsx)(`span`, { children: `guia prático` }),
            (0, $.jsxs)(`b`, {
              children: [`Doce`, (0, $.jsx)(`br`, {}), `Lucro`],
            }),
            (0, $.jsx)(`i`, {}),
            (0, $.jsx)(`small`, { children: `Confeitaria que dá dinheiro` }),
          ],
        }),
        (0, $.jsxs)(`div`, {
          className: `lv-pg lv-sum`,
          children: [
            (0, $.jsx)(`h6`, { children: `Sumário` }),
            [
              [`1`, `Preço não é chute`, `07`],
              [`2`, `Ficha técnica`, `12`],
              [`3`, `Quanto cobrar`, `19`],
              [`4`, `Embalagem que vende`, `26`],
              [`5`, `Encomendas da semana`, `33`],
            ].map(([e, t, n]) =>
              (0, $.jsxs)(
                `div`,
                {
                  children: [
                    (0, $.jsx)(`em`, { children: e }),
                    (0, $.jsx)(`b`, { children: t }),
                    (0, $.jsx)(`span`, { children: n }),
                  ],
                },
                e,
              ),
            ),
          ],
        }),
      ],
      [
        (0, $.jsxs)(`div`, {
          className: `lv-pg lv-foto`,
          children: [
            (0, $.jsx)(`img`, { src: `./img/doces.webp`, alt: `` }),
            (0, $.jsxs)(`div`, {
              children: [
                (0, $.jsx)(`small`, { children: `capítulo 1` }),
                (0, $.jsxs)(`b`, {
                  children: [`Preço não`, (0, $.jsx)(`br`, {}), `é chute.`],
                }),
              ],
            }),
          ],
        }),
        (0, $.jsxs)(`div`, {
          className: `lv-pg`,
          children: [
            (0, $.jsx)(`small`, {
              className: `lv-cap`,
              children: `capítulo 2 · ficha técnica`,
            }),
            (0, $.jsx)(`h6`, { children: `Brigadeiro gourmet` }),
            (0, $.jsx)(`p`, {
              className: `lv-sub`,
              children: `rende 30 unidades`,
            }),
            (0, $.jsx)(`table`, {
              children: (0, $.jsx)(`tbody`, {
                children: [
                  [`Leite condensado`, `395 g`, `7,90`],
                  [`Chocolate 50%`, `100 g`, `6,40`],
                  [`Manteiga`, `20 g`, `1,80`],
                  [`Granulado belga`, `80 g`, `4,10`],
                  [`Forminhas`, `30 un`, `2,50`],
                  [`Caixa e fita`, `1 un`, `3,20`],
                ].map(([e, t, n]) =>
                  (0, $.jsxs)(
                    `tr`,
                    {
                      children: [
                        (0, $.jsx)(`td`, { children: e }),
                        (0, $.jsx)(`td`, { children: t }),
                        (0, $.jsxs)(`td`, { children: [`R$ `, n] }),
                      ],
                    },
                    e,
                  ),
                ),
              }),
            }),
            (0, $.jsxs)(`div`, {
              className: `lv-tot`,
              children: [
                (0, $.jsx)(`span`, { children: `custo da receita` }),
                (0, $.jsx)(`b`, { children: `R$ 25,90` }),
              ],
            }),
            (0, $.jsx)(`em`, { className: `lv-pg-n`, children: `12` }),
          ],
        }),
      ],
      [
        (0, $.jsxs)(`div`, {
          className: `lv-pg`,
          children: [
            (0, $.jsx)(`small`, {
              className: `lv-cap`,
              children: `capítulo 3 · quanto cobrar`,
            }),
            (0, $.jsx)(`h6`, { children: `A conta que ninguém te ensinou` }),
            (0, $.jsxs)(`div`, {
              className: `lv-conta`,
              children: [
                (0, $.jsxs)(`div`, {
                  children: [
                    (0, $.jsx)(`span`, { children: `custo` }),
                    (0, $.jsx)(`b`, { children: `25,90` }),
                  ],
                }),
                (0, $.jsx)(`i`, { children: `×` }),
                (0, $.jsxs)(`div`, {
                  children: [
                    (0, $.jsx)(`span`, { children: `margem` }),
                    (0, $.jsx)(`b`, { children: `2,24` }),
                  ],
                }),
                (0, $.jsx)(`i`, { children: `=` }),
                (0, $.jsxs)(`div`, {
                  className: `v`,
                  children: [
                    (0, $.jsx)(`span`, { children: `vender por` }),
                    (0, $.jsx)(`b`, { children: `58,00` }),
                  ],
                }),
              ],
            }),
            (0, $.jsx)(`p`, {
              className: `lv-txt`,
              children: `Some ingredientes, embalagem e o seu tempo. Depois multiplique pela margem do seu bairro.`,
            }),
            (0, $.jsx)(`span`, {
              className: `lv-nota`,
              children: `lucro de 124%!`,
            }),
            (0, $.jsx)(`em`, { className: `lv-pg-n`, children: `19` }),
          ],
        }),
        (0, $.jsxs)(`div`, {
          className: `lv-pg lv-foto`,
          children: [
            (0, $.jsx)(`img`, { src: `./img/bolacha1.webp`, alt: `` }),
            (0, $.jsxs)(`div`, {
              children: [
                (0, $.jsx)(`small`, { children: `capítulo 4` }),
                (0, $.jsxs)(`b`, {
                  children: [`A caixa`, (0, $.jsx)(`br`, {}), `também vende.`],
                }),
              ],
            }),
          ],
        }),
      ],
    ];
  return (0, $.jsxs)(`div`, {
    className: `comp comp-lv`,
    ref: e,
    children: [
      (0, $.jsxs)(`div`, {
        className: `lv-livro` + (n === 0 ? ` fechado` : ``),
        onClick: o,
        role: `button`,
        tabIndex: 0,
        "aria-label": `Virar a página da apostila`,
        onKeyDown: (e) => {
          (e.key === `Enter` || e.key === ` `) && o();
        },
        children: [
          (0, $.jsx)(`div`, { className: `lv-base esq` }),
          (0, $.jsx)(`div`, {
            className: `lv-base dir`,
            children: (0, $.jsxs)(`div`, {
              className: `lv-pg lv-fim`,
              children: [
                (0, $.jsx)(`b`, { children: `Doce Lucro` }),
                (0, $.jsx)(`small`, {
                  children: `ZUNORA · edição impressa e PDF`,
                }),
              ],
            }),
          }),
          s.map(([e, t], r) =>
            (0, $.jsxs)(
              `div`,
              {
                className: `lv-folha` + (r < n ? ` virada` : ``),
                style: { zIndex: r < n ? 10 + r : 13 - r },
                children: [
                  (0, $.jsx)(`div`, {
                    className: `lv-face frente`,
                    children: e,
                  }),
                  (0, $.jsx)(`div`, {
                    className: `lv-face verso`,
                    children: t,
                  }),
                ],
              },
              r,
            ),
          ),
        ],
      }),
      (0, $.jsx)(`div`, {
        className: `lv-lapis`,
        children: (0, $.jsx)(`i`, {}),
      }),
      (0, $.jsx)(`div`, {
        className: `lv-estante`,
        children: Su.map((e, t) =>
          (0, $.jsxs)(
            `button`,
            {
              type: `button`,
              className: `lv-cv cv` + t + (e.f === `Slides` ? ` slide` : ``),
              style: { "--bg": e.bg, "--fg": e.fg, "--ac": e.ac, "--i": t },
              "aria-label": e.f + `: ` + e.t,
              "data-cursor": `link`,
              onClick: () => {
                (r((t % 3) + 1), a(Date.now()));
              },
              children: [
                (0, $.jsx)(`span`, { className: `cv-n`, children: e.n }),
                (0, $.jsx)(`b`, {
                  className: e.serif ? `serif` : ``,
                  children: e.t,
                }),
                (0, $.jsx)(`i`, {}),
                (0, $.jsx)(`small`, { children: e.f }),
              ],
            },
            e.t,
          ),
        ),
      }),
      (0, $.jsx)(`span`, {
        className: `toque-dica`,
        children: `toque para virar a página`,
      }),
    ],
  });
}
var wu = [
    [
      [`./videos/r-bia.mp4`, `Série animada · Bia`],
      [`./videos/r-dona.mp4`, `Novelinha · A Dona de Tudo`],
      [`./videos/r-casa47.mp4`, `Suspense · Casa 47`],
    ],
    [
      [`./videos/r-asterion.mp4`, `Mundo Asterion · a vila`],
      [`./videos/r-ceu.mp4`, `O Céu Ficou Vermelho`],
      [`./videos/r-deise.mp4`, `Personagem · Salão da Deise`],
    ],
    [
      [`./videos/r-dona3.mp4`, `Novelinha · parte 3`],
      [`./videos/r-procurado.mp4`, `História animada`],
      [`./videos/r-historias.mp4`, `Histórias sem explicação`],
    ],
  ],
  Tu =
    typeof window < `u` &&
    (matchMedia(`(pointer: coarse)`).matches || innerWidth < 760),
  Eu = (e) => e.replace(`./videos/`, `./img/p-`).replace(`.mp4`, `.webp`);
function Du({ src: e, t, video: n }) {
  return (0, $.jsxs)(`div`, {
    className: `ia-reel`,
    children: [
      n
        ? (0, $.jsx)(`video`, {
            src: e,
            poster: Eu(e),
            muted: !0,
            loop: !0,
            playsInline: !0,
            preload: `none`,
          })
        : (0, $.jsx)(`img`, {
            src: Eu(e),
            alt: ``,
            loading: `lazy`,
            decoding: `async`,
          }),
      (0, $.jsx)(`span`, { children: t }),
    ],
  });
}
function Ou() {
  let e = (0, l.useRef)(null),
    t = du(e);
  return (
    (0, l.useEffect)(() => {
      e.current?.querySelectorAll(`video`).forEach((e) => {
        t ? e.play().catch(() => {}) : e.pause();
      });
    }, [t]),
    (0, $.jsx)(`div`, {
      className: `comp comp-ia2`,
      ref: e,
      children: wu.map((e, t) =>
        (0, $.jsx)(
          `div`,
          {
            className: `ia-col c` + t,
            children: (0, $.jsx)(`div`, {
              className: `ia-trilho`,
              children: e.map(([e, n], r) =>
                (0, $.jsx)(
                  Du,
                  { src: e, t: n, video: !Tu || (t === 1 && r < 2) },
                  r,
                ),
              ),
            }),
          },
          t,
        ),
      ),
    })
  );
}
var ku = {
    secretaria: (0, $.jsx)(gc, {}),
    financas: (0, $.jsx)(_c, {}),
    app: (0, $.jsx)(vc, {}),
    vendas: (0, $.jsx)(yc, {}),
    membros: (0, $.jsx)(Sc, {}),
    site: (0, $.jsx)(bc, {}),
    apostila: (0, $.jsx)(Cc, {}),
    videos: (0, $.jsx)(xc, {}),
  },
  Au = [
    {
      id: `secretaria`,
      seda: [`#22060F`, `#5E1529`, `#7A5326`],
      fundo: `agenda`,
      cor: `#1F0A0B`,
      luz: `rgba(226,188,116,.32)`,
      tag: `App com IA`,
      titulo: `SecretarIA`,
      texto: `Uma inteligência artificial que atende o WhatsApp do salão. Marca, remarca, lembra e avisa, até de madrugada, e tudo cai direto na agenda.`,
      itens: [
        `IA no WhatsApp`,
        `Agenda da equipe`,
        `Lembretes automáticos`,
        `Página de vendas`,
      ],
      chips: [
        {
          t: `Novo agendamento`,
          s: `Ana · amanhã 14h`,
          x: `70%`,
          y: `-4%`,
          tipo: `ok`,
        },
        {
          t: `Respondido às 02:14`,
          s: `a IA atende de madrugada`,
          x: `-6%`,
          y: `86%`,
          tipo: `zap`,
        },
      ],
      mock: (0, $.jsx)(hu, {}),
    },
    {
      id: `financas`,
      seda: [`#041917`, `#0F4541`, `#2A7A64`],
      fundo: `lucro`,
      cor: `#040E0D`,
      luz: `rgba(95,227,180,.26)`,
      tag: `App de finanças`,
      titulo: `Controle financeiro`,
      texto: `Entradas, saídas, metas e reserva num painel que dá gosto de abrir. A empresária sabe quanto entrou, quanto saiu e quanto sobra, sem planilha.`,
      itens: [
        `Saldo em tempo real`,
        `Gráficos do mês`,
        `Metas e reserva`,
        `Categorias automáticas`,
      ],
      chips: [
        {
          t: `Pix recebido`,
          s: `+ R$ 350,00 · Marina`,
          x: `70%`,
          y: `-4%`,
          tipo: `venda`,
        },
        {
          t: `Meta batida`,
          s: `faturamento de novembro`,
          x: `-6%`,
          y: `88%`,
          tipo: `ok`,
        },
      ],
      mock: (0, $.jsx)(gu, {}),
    },
    {
      id: `app`,
      seda: [`#DCC2B3`, `#F4E8DE`, `#FFFFFF`],
      fundo: `flow`,
      cor: `#E9D6CB`,
      luz: `rgba(150,90,70,.25)`,
      tom: `claro`,
      tag: `Projeto conceito · App`,
      titulo: `Flow Pilates`,
      texto: `O método do estúdio no celular da aluna: aulas, reservas, progresso e um lembrete para ela não faltar.`,
      itens: [
        `iPhone e Android`,
        `Reserva de aulas`,
        `Progresso da aluna`,
        `Notificações`,
      ],
      chips: [
        {
          t: `Flow Pilates`,
          s: `Sua aula começa em 30 min`,
          x: `66%`,
          y: `6%`,
          tipo: `neutro`,
        },
        {
          t: `Reserva confirmada`,
          s: `Sexta · 18h · Reformer`,
          x: `-10%`,
          y: `80%`,
          tipo: `ok`,
        },
      ],
      mock: (0, $.jsx)(_u, {}),
    },
    {
      id: `vendas`,
      seda: [`#3E1408`, `#8E3D1D`, `#8A5A28`],
      fundo: `venda`,
      cor: `#2E1307`,
      luz: `rgba(242,195,139,.32)`,
      tag: `Projeto conceito · Página de vendas`,
      titulo: `Mentoria Raízes`,
      texto: `Uma página feita para quem chega sem te conhecer sair comprando. Texto, design, versão de celular e checkout no mesmo lugar.`,
      itens: [
        `Texto que vende`,
        `Design sob medida`,
        `Versão celular`,
        `Checkout integrado`,
      ],
      chips: [
        {
          t: `Venda aprovada`,
          s: `Mentoria Raízes · R$ 1.164`,
          x: `60%`,
          y: `-6%`,
          tipo: `venda`,
        },
        {
          t: `Venda aprovada`,
          s: `Mentoria Raízes · R$ 1.164`,
          x: `-8%`,
          y: `88%`,
          tipo: `venda`,
        },
      ],
      mock: (0, $.jsx)(vu, {}),
    },
    {
      id: `membros`,
      seda: [`#21060F`, `#58183A`, `#7A4048`],
      fundo: `aulas`,
      cor: `#0C0507`,
      luz: `rgba(214,128,146,.28)`,
      tag: `Área de membros`,
      titulo: `Método Essência`,
      texto: `A área de membros da mentoria da Edna Mari. Mais que aulas: diagnóstico que calcula a meta do negócio, estúdio com roteiros prontos e um treinador de vendas para responder objeções.`,
      itens: [
        `Diagnóstico de negócio`,
        `Estúdio de conteúdo`,
        `Treinador de vendas`,
        `Computador e celular`,
      ],
      mock: (0, $.jsx)(bu, {}),
    },
    {
      id: `site`,
      seda: [`#E2D3BC`, `#F7EFE3`, `#FFFFFF`],
      fundo: `forno`,
      cor: `#2A170F`,
      luz: `rgba(214,140,70,.35)`,
      tag: `Site`,
      titulo: `Donna Nina`,
      texto: `Bolachas de família feitas à mão em Palhoça. Cada bolacha ganhou a sua vitrine: a cliente passa de uma para outra, põe no pacote e encomenda pelo WhatsApp.`,
      itens: [
        `Vitrine de produtos`,
        `Monte seu pacote`,
        `Pedido pelo WhatsApp`,
        `Pensado para o celular`,
      ],
      chips: [
        {
          t: `Pedido no WhatsApp`,
          s: `Juliana · 3 pacotes`,
          x: `-4%`,
          y: `10%`,
          tipo: `zap`,
        },
      ],
      mock: (0, $.jsx)(xu, {}),
    },
    {
      id: `apostila`,
      seda: [`#0A1022`, `#26335F`, `#5E4E30`],
      fundo: `papel`,
      cor: `#1C110D`,
      luz: `rgba(226,188,116,.26)`,
      tag: `Material de curso`,
      titulo: `Apostilas`,
      texto: `Todo o material do seu curso, para qualquer nicho: apostila, e-book, PDF, workbook e slides das aulas. A Doce Lucro é uma delas.`,
      itens: [
        `Apostila e e-book`,
        `Workbook para imprimir`,
        `Slides das aulas`,
        `Qualquer nicho`,
      ],
      mock: (0, $.jsx)(Cu, {}),
    },
    {
      id: `videos`,
      seda: [`#070608`, `#1F1B24`, `#55442A`],
      fundo: `play`,
      cor: `#0F0D10`,
      luz: `rgba(226,188,116,.22)`,
      tag: `Vídeos`,
      titulo: `Vídeos e novelinhas`,
      texto: `A ZUNORA cria o roteiro, os personagens e a edição. Criativo para anúncio, novelinha em partes, personagem da marca ou reel que prende até o fim, sem você precisar aparecer.`,
      itens: [
        `Criativos para anúncio`,
        `Novelinhas e séries`,
        `Personagens da marca`,
        `Reels e TikTok`,
      ],
      chips: [
        {
          t: `Criativo pronto`,
          s: `15s · 9:16 · com legenda`,
          x: `66%`,
          y: `-6%`,
          tipo: `ok`,
        },
      ],
      mock: (0, $.jsx)(Ou, {}),
    },
  ];
function ju() {
  return (0, $.jsxs)(`section`, {
    className: `vitrine`,
    "aria-label": `O que a gente entrega`,
    children: [
      (0, $.jsxs)(`header`, {
        className: `vt-cab`,
        children: [
          (0, $.jsxs)(`h2`, {
            children: [
              `O que a gente`,
              (0, $.jsx)(`br`, {}),
              (0, $.jsx)(`span`, { children: `entrega.` }),
            ],
          }),
          (0, $.jsx)(`p`, {
            children: `Role e veja funcionando. Oito coisas que a ZUNORA faz para o seu conhecimento virar produto e o seu negócio vender mais.`,
          }),
        ],
      }),
      Au.map((e, t) =>
        (0, $.jsxs)(
          l.Fragment,
          {
            children: [
              (0, $.jsxs)(`article`, {
                className: `cena` + (e.tom === `claro` ? ` claro` : ``),
                style: { "--cor": e.cor },
                "data-cena": e.id,
                children: [
                  (0, $.jsx)(`div`, {
                    className: `cena-bg` + (lu[e.id] && !Tu ? ` com-foto` : ``),
                    children: Tu
                      ? null
                      : lu[e.id]
                        ? (0, $.jsx)(uu, { f: lu[e.id] })
                        : ku[e.id],
                  }),
                  (0, $.jsxs)(`div`, {
                    className: `cena-in`,
                    children: [
                      (0, $.jsxs)(`div`, {
                        className: `cena-txt`,
                        children: [
                          (0, $.jsxs)(`span`, {
                            className: `cena-n`,
                            children: [
                              String(t + 1).padStart(2, `0`),
                              ` / `,
                              String(Au.length).padStart(2, `0`),
                            ],
                          }),
                          (0, $.jsx)(`span`, {
                            className: `cena-tag`,
                            children: e.tag,
                          }),
                          (0, $.jsx)(`h3`, {
                            "aria-label": e.titulo,
                            children: (() => {
                              let n = 0;
                              return e.titulo
                                .split(` `)
                                .map((e, t) =>
                                  (0, $.jsx)(
                                    `span`,
                                    {
                                      className: `pal`,
                                      children: e
                                        .split(``)
                                        .map((e, r) =>
                                          (0, $.jsx)(
                                            `span`,
                                            {
                                              className: `let`,
                                              style: { "--i": n++ },
                                              "aria-hidden": `true`,
                                              children: e,
                                            },
                                            r,
                                          ),
                                        ),
                                    },
                                    t,
                                  ),
                                );
                            })(),
                          }),
                          (0, $.jsx)(`p`, { children: e.texto }),
                          (0, $.jsx)(`ul`, {
                            children: e.itens.map((e) =>
                              (0, $.jsx)(`li`, { children: e }, e),
                            ),
                          }),
                        ],
                      }),
                      (0, $.jsx)(`div`, {
                        className: `cena-mock`,
                        children: (0, $.jsx)(fu, {
                          chips: e.chips,
                          luz: e.luz,
                          children: e.mock,
                        }),
                      }),
                    ],
                  }),
                ],
              }),
              (0, $.jsx)(`div`, {
                className: `cena-espaco`,
                "aria-hidden": `true`,
              }),
            ],
          },
          e.id,
        ),
      ),
    ],
  });
}
var Mu = [
    {
      k: `plan`,
      t: `Planejar`,
      f: `O mês inteiro no calendário: o que sai, em que dia e com qual objetivo.`,
      nota: `Calendário do mês pronto`,
    },
    {
      k: `cria`,
      t: `Criar`,
      f: `Reels, carrosséis e novelinhas feitos pela ZUNORA, na cara da sua marca.`,
      nota: `Feed com a mesma identidade`,
    },
    {
      k: `posta`,
      t: `Postar`,
      f: `Legenda, capa e horário certo. Agendamos e publicamos por você.`,
      nota: `Agendado para sexta, 19h`,
    },
    {
      k: `resp`,
      t: `Responder`,
      f: `Comentários e direct respondidos rápido, para nenhuma cliente ficar esperando.`,
      nota: `Direct respondido em minutos`,
    },
  ],
  Nu = {
    2: `r`,
    4: `c`,
    6: `s`,
    9: `r`,
    11: `c`,
    13: `s`,
    16: `r`,
    18: `c`,
    20: `r`,
    23: `s`,
    25: `r`,
    27: `c`,
    30: `r`,
  };
function Pu({ whats: e }) {
  let t = (0, l.useRef)(null),
    [n, r] = (0, l.useState)(0),
    [i, a] = (0, l.useState)(!1),
    o = (0, l.useRef)(0);
  ((0, l.useEffect)(() => {
    let e = t.current;
    if (!e) return;
    let n = new IntersectionObserver(
      ([e]) => {
        e.isIntersecting && a(!0);
      },
      { threshold: 0.15 },
    );
    return (n.observe(e), () => n.disconnect());
  }, []),
    (0, l.useEffect)(() => {
      if (!i) return;
      let e = setInterval(() => {
        Date.now() - o.current > 9e3 && r((e) => (e + 1) % Mu.length);
      }, 4200);
      return () => clearInterval(e);
    }, [i]));
  let s = (e) => {
    ((o.current = Date.now()), r(e));
  };
  return (0, $.jsxs)(`section`, {
    className: `ig` + (i ? ` vis` : ``),
    ref: t,
    "aria-label": `Gestão de Instagram`,
    children: [
      (0, $.jsxs)(`div`, {
        className: `ig-txt`,
        children: [
          (0, $.jsx)(`span`, { className: `fx2-tag`, children: `Instagram` }),
          (0, $.jsxs)(`h2`, {
            children: [
              `A gente cuida do `,
              (0, $.jsx)(`em`, { children: `seu Instagram.` }),
            ],
          }),
          (0, $.jsx)(`p`, {
            className: `ig-lead`,
            children: `Você foca no seu negócio. A ZUNORA planeja, cria, posta e responde, todo mês.`,
          }),
          (0, $.jsx)(`div`, {
            className: `ig-abas`,
            role: `tablist`,
            children: Mu.map((e, t) =>
              (0, $.jsxs)(
                `button`,
                {
                  role: `tab`,
                  "aria-selected": t === n,
                  className: t === n ? `on` : ``,
                  onClick: () => s(t),
                  "data-cursor": `link`,
                  children: [
                    (0, $.jsx)(`span`, {
                      className: `ig-aba-t`,
                      children: e.t,
                    }),
                    (0, $.jsx)(`span`, {
                      className: `ig-aba-f`,
                      children: e.f,
                    }),
                    (0, $.jsx)(
                      `i`,
                      { className: `ig-barra` },
                      t === n ? `on` + n : `off`,
                    ),
                  ],
                },
                e.k,
              ),
            ),
          }),
          (0, $.jsx)(`a`, {
            className: `ig-cta`,
            href: e,
            target: `_blank`,
            rel: `noreferrer`,
            "data-cursor": `link`,
            children: `Quero a ZUNORA no meu Instagram`,
          }),
        ],
      }),
      (0, $.jsxs)(`div`, {
        className: `ig-palco`,
        children: [
          (0, $.jsxs)(`div`, {
            className: `ig-cel`,
            children: [
              (0, $.jsxs)(`div`, {
                className: `ig-tela`,
                children: [
                  (0, $.jsxs)(`div`, {
                    className: `ig-status`,
                    children: [
                      (0, $.jsx)(`b`, { children: `9:41` }),
                      (0, $.jsx)(`span`, {}),
                    ],
                  }),
                  (0, $.jsxs)(`div`, {
                    className: `ig-v ig-plan` + (n === 0 ? ` on` : ``),
                    children: [
                      (0, $.jsxs)(`div`, {
                        className: `ig-cab`,
                        children: [
                          (0, $.jsx)(`b`, { children: `Novembro` }),
                          (0, $.jsx)(`small`, { children: `13 posts` }),
                        ],
                      }),
                      (0, $.jsx)(`div`, {
                        className: `ig-sem`,
                        children: [`D`, `S`, `T`, `Q`, `Q`, `S`, `S`].map(
                          (e, t) => (0, $.jsx)(`span`, { children: e }, t),
                        ),
                      }),
                      (0, $.jsx)(`div`, {
                        className: `ig-cal`,
                        children: Array.from(
                          { length: 30 },
                          (e, t) => t + 1,
                        ).map((e) =>
                          (0, $.jsx)(
                            `span`,
                            {
                              className: Nu[e] ? `t-` + Nu[e] : ``,
                              style: { "--d": e * 0.025 + `s` },
                              children: e,
                            },
                            e,
                          ),
                        ),
                      }),
                      (0, $.jsxs)(`div`, {
                        className: `ig-leg`,
                        children: [
                          (0, $.jsx)(`span`, {
                            className: `t-r`,
                            children: `Reels`,
                          }),
                          (0, $.jsx)(`span`, {
                            className: `t-c`,
                            children: `Carrossel`,
                          }),
                          (0, $.jsx)(`span`, {
                            className: `t-s`,
                            children: `Story`,
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, $.jsxs)(`div`, {
                    className: `ig-v ig-cria` + (n === 1 ? ` on` : ``),
                    children: [
                      (0, $.jsxs)(`div`, {
                        className: `ig-perfil`,
                        children: [
                          (0, $.jsx)(`i`, {
                            className: `ig-av`,
                            children: `L`,
                          }),
                          (0, $.jsxs)(`div`, {
                            children: [
                              (0, $.jsx)(`b`, { children: `lia.estetica` }),
                              (0, $.jsx)(`small`, {
                                children: `Esteticista · Palhoça, SC`,
                              }),
                              (0, $.jsx)(`small`, {
                                children: `Pele bonita é rotina, não milagre.`,
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, $.jsx)(`div`, {
                        className: `ig-dest`,
                        children: [`Valores`, `Agenda`, `Dicas`, `Studio`].map(
                          (e) =>
                            (0, $.jsxs)(
                              `span`,
                              { children: [(0, $.jsx)(`i`, {}), e] },
                              e,
                            ),
                        ),
                      }),
                      (0, $.jsxs)(`div`, {
                        className: `ig-grade`,
                        children: [
                          (0, $.jsxs)(`div`, {
                            className: `pt q1`,
                            children: [
                              (0, $.jsx)(`small`, { children: `carrossel` }),
                              (0, $.jsx)(`b`, {
                                children: `3 erros que mancham a sua pele`,
                              }),
                              (0, $.jsx)(`em`, { children: `arraste` }),
                            ],
                          }),
                          (0, $.jsx)(`div`, {
                            className: `pt q2`,
                            children: (0, $.jsx)(`b`, {
                              children: `Pele bonita é rotina, não milagre.`,
                            }),
                          }),
                          (0, $.jsxs)(`div`, {
                            className: `pt q3`,
                            children: [
                              (0, $.jsx)(`i`, { className: `pl` }),
                              (0, $.jsx)(`b`, {
                                children: `Limpeza de pele, passo a passo`,
                              }),
                            ],
                          }),
                          (0, $.jsxs)(`div`, {
                            className: `pt q4`,
                            children: [
                              (0, $.jsx)(`small`, { children: `dezembro` }),
                              (0, $.jsx)(`b`, { children: `Agenda aberta` }),
                              (0, $.jsx)(`span`, {
                                className: `cal`,
                                children: Array.from({ length: 12 }, (e, t) =>
                                  (0, $.jsx)(
                                    `i`,
                                    {
                                      className: [2, 5, 9].includes(t)
                                        ? `x`
                                        : ``,
                                    },
                                    t,
                                  ),
                                ),
                              }),
                            ],
                          }),
                          (0, $.jsxs)(`div`, {
                            className: `pt q5`,
                            children: [
                              (0, $.jsx)(`i`, { className: `gota` }),
                              (0, $.jsx)(`b`, {
                                children: `Protetor: quanto passar?`,
                              }),
                            ],
                          }),
                          (0, $.jsxs)(`div`, {
                            className: `pt q6`,
                            children: [
                              (0, $.jsx)(`small`, { children: `combo verão` }),
                              (0, $.jsx)(`b`, {
                                children: `Limpeza + hidratação`,
                              }),
                              (0, $.jsx)(`em`, { children: `R$ 189` }),
                            ],
                          }),
                          (0, $.jsxs)(`div`, {
                            className: `pt q7`,
                            children: [
                              (0, $.jsx)(`small`, {
                                children: `mito ou verdade?`,
                              }),
                              (0, $.jsx)(`b`, {
                                children: `Água quente abre os poros`,
                              }),
                            ],
                          }),
                          (0, $.jsxs)(`div`, {
                            className: `pt q8`,
                            children: [
                              (0, $.jsx)(`i`, { className: `pl` }),
                              (0, $.jsx)(`b`, { children: `Um dia no studio` }),
                            ],
                          }),
                          (0, $.jsxs)(`div`, {
                            className: `pt q9`,
                            children: [
                              (0, $.jsx)(`b`, {
                                children: `Sua pele em 4 semanas`,
                              }),
                              (0, $.jsxs)(`span`, {
                                className: `barras`,
                                children: [
                                  (0, $.jsx)(`i`, {}),
                                  (0, $.jsx)(`i`, {}),
                                  (0, $.jsx)(`i`, {}),
                                  (0, $.jsx)(`i`, {}),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, $.jsxs)(`div`, {
                    className: `ig-v ig-posta` + (n === 2 ? ` on` : ``),
                    children: [
                      (0, $.jsx)(`div`, {
                        className: `ig-cab`,
                        children: (0, $.jsx)(`b`, {
                          children: `Nova publicação`,
                        }),
                      }),
                      (0, $.jsxs)(`div`, {
                        className: `ig-post pt q1`,
                        children: [
                          (0, $.jsx)(`small`, { children: `carrossel · 1/7` }),
                          (0, $.jsx)(`b`, {
                            children: `3 erros que mancham a sua pele`,
                          }),
                          (0, $.jsx)(`em`, { children: `arraste` }),
                        ],
                      }),
                      (0, $.jsx)(`p`, {
                        className: `ig-legenda`,
                        children: `Você lava o rosto com água quente? Então esse post é para você. Salva para não esquecer.`,
                      }),
                      (0, $.jsxs)(`div`, {
                        className: `ig-linha`,
                        children: [
                          (0, $.jsx)(`span`, { children: `Capa` }),
                          (0, $.jsx)(`b`, { children: `escolhida` }),
                        ],
                      }),
                      (0, $.jsxs)(`div`, {
                        className: `ig-linha`,
                        children: [
                          (0, $.jsx)(`span`, { children: `Horário` }),
                          (0, $.jsx)(`b`, { children: `sexta, 19:00` }),
                        ],
                      }),
                      (0, $.jsxs)(`div`, {
                        className: `ig-agenda`,
                        children: [
                          (0, $.jsx)(`svg`, {
                            viewBox: `0 0 24 24`,
                            children: (0, $.jsx)(`path`, {
                              d: `M5 12.5l4.5 4.5L19 7.5`,
                            }),
                          }),
                          `Agendado`,
                        ],
                      }),
                    ],
                  }),
                  (0, $.jsxs)(`div`, {
                    className: `ig-v ig-resp` + (n === 3 ? ` on` : ``),
                    children: [
                      (0, $.jsx)(`div`, {
                        className: `ig-cab`,
                        children: (0, $.jsx)(`b`, { children: `Mensagens` }),
                      }),
                      (0, $.jsx)(`p`, {
                        className: `m c`,
                        children: `Vi o post do combo verão, ainda tem horário?`,
                      }),
                      (0, $.jsx)(`p`, {
                        className: `m z`,
                        children: `Oi! Tenho quinta às 15h ou sábado às 10h. Qual prefere?`,
                      }),
                      (0, $.jsx)(`p`, {
                        className: `m c`,
                        children: `Sábado!`,
                      }),
                      (0, $.jsx)(`p`, {
                        className: `m z`,
                        children: `Agendado! Te mando a confirmação aqui.`,
                      }),
                    ],
                  }),
                ],
              }),
              (0, $.jsx)(`i`, { className: `ig-ilha` }),
            ],
          }),
          (0, $.jsx)(`div`, { className: `ig-nota`, children: Mu[n].nota }, n),
        ],
      }),
    ],
  });
}
Vi.registerPlugin(Q);
var Fu = `https://wa.me/5548988709163?text=Oi!%20Vim%20pelo%20site%20da%20ZUNORA%20e%20quero%20tirar%20minha%20ideia%20do%20papel.`,
  Iu = (e) => `https://wa.me/5548988709163?text=` + encodeURIComponent(e),
  Lu = [
    {
      img: `./img/bg-essencia.webp`,
      tag: `Para quem ensina`,
      t: `Quero vender meu curso`,
      f: `Página de vendas, área de membros, apostila e as aulas organizadas para a aluna comprar e concluir.`,
      m: `Oi! Vim pelo site da ZUNORA e quero vender meu curso.`,
    },
    {
      img: `./img/bg-secretaria.webp`,
      tag: `Para quem atende`,
      t: `Quero um app ou site`,
      f: `App com IA no WhatsApp, site ou sistema sob medida para o seu negócio funcionar sozinho.`,
      m: `Oi! Vim pelo site da ZUNORA e quero um app ou site.`,
    },
    {
      img: `./img/bg-videos.webp`,
      tag: `Para quem quer aparecer`,
      t: `Quero vídeos para a minha marca`,
      f: `Roteiro, personagens e edição feitos pela ZUNORA: criativos para anúncio, novelinhas e reels da sua marca.`,
      m: `Oi! Vim pelo site da ZUNORA e quero vídeos para a minha marca.`,
    },
  ];
function Ru() {
  let e = (0, l.useRef)(null),
    t = (0, l.useRef)(null);
  return (
    (0, l.useEffect)(() => {
      if (matchMedia(`(pointer: coarse)`).matches) return;
      document.documentElement.classList.add(`cursor-proprio`);
      let n = innerWidth / 2,
        r = innerHeight / 2,
        i = n,
        a = r,
        o = 0,
        s = (e) => {
          ((n = e.clientX), (r = e.clientY));
          let i = e.target.closest(`[data-cursor]`);
          ((t.current.dataset.modo = i ? i.dataset.cursor : ``),
            (t.current.querySelector(`span`).textContent =
              i?.dataset.cursor === `ver`
                ? `ver`
                : i?.dataset.cursor === `play`
                  ? `assistir`
                  : ``));
        },
        c = () => {
          ((i += (n - i) * 0.16),
            (a += (r - a) * 0.16),
            (e.current.style.transform = `translate(${n}px,${r}px)`),
            (t.current.style.transform = `translate(${i}px,${a}px)`),
            (o = requestAnimationFrame(c)));
        };
      return (
        addEventListener(`pointermove`, s),
        c(),
        () => {
          (removeEventListener(`pointermove`, s),
            cancelAnimationFrame(o),
            document.documentElement.classList.remove(`cursor-proprio`));
        }
      );
    }, []),
    (0, $.jsxs)($.Fragment, {
      children: [
        (0, $.jsx)(`div`, { className: `cur-ponto`, ref: e }),
        (0, $.jsx)(`div`, {
          className: `cur-anel`,
          ref: t,
          children: (0, $.jsx)(`span`, {}),
        }),
      ],
    })
  );
}
function zu() {
  return (0, $.jsxs)(`svg`, {
    className: `grao`,
    "aria-hidden": `true`,
    children: [
      (0, $.jsx)(`filter`, {
        id: `g`,
        children: (0, $.jsx)(`feTurbulence`, {
          type: `fractalNoise`,
          baseFrequency: `.9`,
          numOctaves: `3`,
          stitchTiles: `stitch`,
        }),
      }),
      (0, $.jsx)(`rect`, { width: `100%`, height: `100%`, filter: `url(#g)` }),
    ],
  });
}
function Bu() {
  let e = (0, l.useRef)(null);
  return (
    (0, l.useEffect)(() => {
      let t = matchMedia(`(prefers-reduced-motion: reduce)`).matches,
        n = matchMedia(`(pointer: coarse)`).matches || innerWidth < 760;
      Q.config({ ignoreMobileResize: !0 });
      let r = n
        ? { on() {}, raf() {}, stop() {}, start() {}, destroy() {} }
        : new w({ lerp: 0.09 });
      r.on(`scroll`, Q.update);
      let i = (e) => r.raf(e * 1e3);
      (Vi.ticker.add(i), Vi.ticker.lagSmoothing(0));
      let a = () => r.stop(),
        ht = null,
        o = () => {
          (r.start(),
            ht && ht.restart(),
            requestAnimationFrame(() => Q.refresh()));
        };
      (addEventListener(`zn:travou`, a),
        addEventListener(`zn:entrou`, o),
        document.documentElement.style.overflow === `hidden` && r.stop());
      let s = Vi.context(() => {
          if (t) return;
          ht = Vi.timeline({
            paused: !!document.getElementById(`ab`),
          })
            .fromTo(
              `.fx2-mani .fx2-tag`,
              { opacity: 0 },
              { opacity: 1, duration: 0.4 },
              0,
            )
            .fromTo(
              `.fx2-mani .w1, .fx2-mani .w2`,
              { yPercent: 105 },
              { yPercent: 0, stagger: 0.08, duration: 0.7, ease: `power3.out` },
              0,
            )
            .fromTo(
              `.fx2-mani .fx2-txt p`,
              { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: 0.5 },
              0.35,
            )
            .fromTo(
              `.fx2-mani .fx2-role`,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.5 },
              0.55,
            );
          let e = Vi.utils.toArray(`.cena`);
          (e.forEach((t, r) => {
            let i = t.nextElementSibling;
            n
              ? Q.create({
                  trigger: t,
                  start: `top 88%`,
                  end: `bottom 5%`,
                  toggleClass: { targets: t, className: `ativa` },
                })
              : Q.create({
                  trigger: t,
                  start: `top 90%`,
                  endTrigger: i,
                  end: `bottom 2%`,
                  toggleClass: { targets: t, className: `ativa` },
                });
            let a = t.querySelector(`.comp`);
            a &&
              innerWidth > 760 &&
              Vi.fromTo(
                a,
                { rotateX: 22, rotateY: -18, rotateZ: 2.5, scale: 0.88, y: 56 },
                {
                  rotateX: 0,
                  rotateY: 0,
                  rotateZ: 0,
                  scale: 1,
                  y: 0,
                  ease: `power2.out`,
                  scrollTrigger: {
                    trigger: t,
                    start: `top 92%`,
                    endTrigger: i,
                    end: `top 38%`,
                    scrub: 0.55,
                  },
                },
              );
            let o = t.querySelector(`.cena-txt`),
              u = 0,
              d = 0,
              f = 0;
            (o &&
              innerWidth > 760 &&
              Vi.fromTo(
                o,
                { y: 0 },
                {
                  y: -32,
                  ease: `none`,
                  scrollTrigger: {
                    trigger: i,
                    start: `top bottom`,
                    end: `bottom bottom`,
                    scrub: !0,
                  },
                },
              ),
              n ||
                t.addEventListener(
                  `pointermove`,
                  (e) => {
                    ((d = e.clientX),
                      (f = e.clientY),
                      (u ||= requestAnimationFrame(() => {
                        u = 0;
                        let e = t.getBoundingClientRect();
                        (t.style.setProperty(`--lx`, d - e.left + `px`),
                          t.style.setProperty(`--ly`, f - e.top + `px`),
                          t.style.setProperty(
                            `--fx`,
                            ((d - e.left) / e.width - 0.5).toFixed(3),
                          ),
                          t.style.setProperty(
                            `--fy`,
                            ((f - e.top) / e.height - 0.5).toFixed(3),
                          ));
                      })));
                  },
                  { passive: !0 },
                ));
            let s = t.querySelector(`.cena-foto`);
            s &&
              !n &&
              Vi.fromTo(
                s,
                { scale: 1.18, yPercent: -4 },
                {
                  scale: 1.02,
                  yPercent: 4,
                  ease: `none`,
                  scrollTrigger: {
                    trigger: t,
                    start: `top bottom`,
                    endTrigger: i,
                    end: `bottom top`,
                    scrub: !0,
                  },
                },
              );
            let c = e[r + 1];
            c &&
              !n &&
              Vi.fromTo(
                t,
                { scale: 1, "--escuro": 0, borderRadius: 0 },
                {
                  scale: 0.88,
                  "--escuro": 0.6,
                  borderRadius: 28,
                  ease: `none`,
                  scrollTrigger: {
                    trigger: c,
                    start: `top bottom`,
                    end: `top top`,
                    scrub: !0,
                    onLeave: () => t.classList.add(`coberta`),
                    onEnterBack: () => t.classList.remove(`coberta`),
                  },
                },
              );
          }),
            Vi.fromTo(
              `.vt-cab h2`,
              { yPercent: 30, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                duration: 1.1,
                ease: `power4.out`,
                scrollTrigger: { trigger: `.vt-cab`, start: `top 78%` },
              },
            ),
            Vi.fromTo(
              `.duo .cria`,
              n ? { y: 40, opacity: 0 } : { xPercent: -8, opacity: 0 },
              {
                y: 0,
                xPercent: 0,
                opacity: 1,
                duration: 0.95,
                ease: `power3.out`,
                scrollTrigger: { trigger: `.duo`, start: `top 82%` },
              },
            ),
            Vi.fromTo(
              `.duo .tec`,
              n ? { y: 40, opacity: 0 } : { xPercent: 8, opacity: 0 },
              {
                y: 0,
                xPercent: 0,
                opacity: 1,
                duration: 0.95,
                ease: `power3.out`,
                scrollTrigger: { trigger: `.duo`, start: `top 82%` },
              },
            ),
            Vi.fromTo(
              `.duo-z`,
              { scale: 0.4, opacity: 0, rotate: -40 },
              {
                scale: 1,
                opacity: 1,
                rotate: 0,
                duration: 1,
                delay: 0.3,
                ease: `back.out(1.6)`,
                scrollTrigger: { trigger: `.duo`, start: `top 82%` },
              },
            ),
            Q.sort(),
            Q.refresh());
        }, e),
        c = document.querySelector(`.zap-fixo`),
        l = () => c?.classList.add(`on`);
      (addEventListener(`zn:entrou`, l),
        document.documentElement.style.overflow !== `hidden` &&
          scrollY > 10 &&
          l());
      let u = new Set(),
        d = new IntersectionObserver(
          (e) => {
            (e.forEach((e) =>
              e.isIntersecting ? u.add(e.target) : u.delete(e.target),
            ),
              c?.classList.toggle(`escondido`, u.size > 0));
          },
          { threshold: 0.2 },
        );
      document
        .querySelectorAll(`.cl-cam, .fx2-cont`)
        .forEach((e) => d.observe(e));
      let f = document.querySelector(`.fx-hist`),
        p = new IntersectionObserver(
          (e) =>
            e.forEach((e) =>
              document.querySelectorAll(`.fx-reel video`).forEach((t) => {
                e.isIntersecting ? t.play().catch(() => {}) : t.pause();
              }),
            ),
          { threshold: 0.05 },
        );
      f && p.observe(f);
      let m = new IntersectionObserver(
        (e) =>
          e.forEach((e) => {
            let t = e.target;
            e.isIntersecting && !document.getElementById(`ab`)
              ? t.play().catch(() => {})
              : t.pause();
          }),
        { threshold: 0.05 },
      );
      (addEventListener(`zn:entrou`, () =>
        setTimeout(
          () =>
            document.querySelectorAll(`video[data-auto]`).forEach((e) => {
              let t = e.getBoundingClientRect();
              t.bottom > 0 && t.top < innerHeight && e.play().catch(() => {});
            }),
          1300,
        ),
      ),
        document
          .querySelectorAll(`video[data-auto]`)
          .forEach((e) => m.observe(e)));
      let h = document.querySelector(`.btn-mag`),
        g = (e) => {
          if (!h) return;
          let t = h.getBoundingClientRect(),
            n = t.left + t.width / 2,
            r = t.top + t.height / 2,
            i = e.clientX - n,
            a = e.clientY - r;
          Math.hypot(i, a) < 220
            ? Vi.to(h, {
                x: i * 0.35,
                y: a * 0.35,
                duration: 0.5,
                ease: `power3.out`,
              })
            : Vi.to(h, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: `elastic.out(1,.4)`,
              });
        };
      return (
        addEventListener(`pointermove`, g),
        () => {
          (p.disconnect(),
            m.disconnect(),
            d.disconnect(),
            removeEventListener(`zn:entrou`, l),
            s.revert(),
            r.destroy(),
            Vi.ticker.remove(i),
            removeEventListener(`pointermove`, g),
            removeEventListener(`zn:travou`, a),
            removeEventListener(`zn:entrou`, o));
        }
      );
    }, []),
    (0, $.jsxs)(`div`, {
      ref: e,
      children: [
        (0, $.jsx)(Ru, {}),
        (0, $.jsx)(zu, {}),
        (0, $.jsx)(pc, {}),
        (0, $.jsxs)(`a`, {
          className: `zap-fixo`,
          href: Fu,
          target: `_blank`,
          rel: `noreferrer`,
          "data-cursor": `link`,
          "aria-label": `Chamar a ZUNORA no WhatsApp`,
          children: [
            (0, $.jsxs)(`svg`, {
              viewBox: `0 0 24 24`,
              "aria-hidden": `true`,
              children: [
                (0, $.jsx)(`path`, {
                  d: `M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z`,
                }),
                (0, $.jsx)(`path`, {
                  d: `M8.6 8.4c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.4.5c-.1.1-.2.3 0 .5.4.7 1 1.3 1.6 1.7.4.3.8.4 1 .5.2.1.4 0 .5-.1l.6-.7c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.4.5 0 .5-.2 1.2-.8 1.5-.5.3-1.4.4-2.6-.1a9 9 0 0 1-4.2-3.8c-.6-1-.8-2-.5-2.6z`,
                }),
              ],
            }),
            (0, $.jsx)(`span`, { children: `Falar com a ZUNORA` }),
          ],
        }),
        (0, $.jsxs)(`section`, {
          className: `fx2 fx2-mani`,
          "aria-label": `Manifesto`,
          children: [
            (0, $.jsx)(`div`, { className: `fx2-sombra` }),
            (0, $.jsxs)(`div`, {
              className: `fx2-txt`,
              children: [
                (0, $.jsx)(`span`, {
                  className: `fx2-tag`,
                  children: `ZUNORA Digital Marketing`,
                }),
                (0, $.jsxs)(`h2`, {
                  children: [
                    (0, $.jsx)(`span`, {
                      className: `m`,
                      children: (0, $.jsx)(`span`, {
                        className: `w1`,
                        children: `Você já tem`,
                      }),
                    }),
                    (0, $.jsx)(`span`, {
                      className: `m`,
                      children: (0, $.jsx)(`span`, {
                        className: `w1`,
                        children: `o conhecimento.`,
                      }),
                    }),
                    (0, $.jsx)(`span`, {
                      className: `m`,
                      children: (0, $.jsx)(`span`, {
                        className: `w2 ouro`,
                        children: `A gente transforma`,
                      }),
                    }),
                    (0, $.jsx)(`span`, {
                      className: `m`,
                      children: (0, $.jsx)(`span`, {
                        className: `w2 ouro`,
                        children: `em produto.`,
                      }),
                    }),
                  ],
                }),
                (0, $.jsx)(`p`, {
                  children: `Apps, sites, páginas de vendas, áreas de membros, apostilas e vídeos para quem quer vender o que sabe.`,
                }),
              ],
            }),
            (0, $.jsxs)(`div`, {
              className: `fx2-role`,
              "aria-hidden": `true`,
              children: [
                (0, $.jsx)(`span`, { children: `Role para explorar` }),
                (0, $.jsx)(`i`, {}),
              ],
            }),
          ],
        }),
        (0, $.jsx)(ju, {}),
        (0, $.jsxs)(`section`, {
          className: `cl cl-nos`,
          "aria-label": `Quem somos`,
          children: [
            (0, $.jsxs)(`div`, {
              className: `cl-cab`,
              children: [
                (0, $.jsx)(`span`, {
                  className: `cl-tag`,
                  children: `Quem somos`,
                }),
                (0, $.jsxs)(`h2`, {
                  children: [
                    `Um estúdio, `,
                    (0, $.jsx)(`em`, { children: `duas frentes.` }),
                  ],
                }),
                (0, $.jsx)(`p`, {
                  children: `Criação e tecnologia no mesmo lugar. Você não precisa contratar designer, editor e programador separados: a ideia entra de um lado e sai pronta para vender do outro.`,
                }),
              ],
            }),
            (0, $.jsxs)(`div`, {
              className: `cl-frentes duo`,
              children: [
                (0, $.jsxs)(`div`, {
                  className: `duo-lado cria`,
                  children: [
                    (0, $.jsx)(`small`, { children: `Tudo o que se vê` }),
                    (0, $.jsx)(`h3`, { children: `Criação` }),
                    (0, $.jsxs)(`ul`, {
                      children: [
                        (0, $.jsx)(`li`, {
                          children: `Identidade visual e logo`,
                        }),
                        (0, $.jsx)(`li`, {
                          children: `Posts, carrosséis e stories`,
                        }),
                        (0, $.jsx)(`li`, {
                          children: `Vídeos, reels e novelinhas`,
                        }),
                        (0, $.jsx)(`li`, {
                          children: `Roteiros e gestão de Instagram`,
                        }),
                        (0, $.jsx)(`li`, {
                          children: `Apostilas, e-books e slides`,
                        }),
                      ],
                    }),
                  ],
                }),
                (0, $.jsx)(`div`, {
                  className: `duo-z`,
                  children: (0, $.jsx)(`img`, { src: fc, alt: `` }),
                }),
                (0, $.jsxs)(`div`, {
                  className: `duo-lado tec`,
                  children: [
                    (0, $.jsx)(`small`, { children: `Tudo o que funciona` }),
                    (0, $.jsx)(`h3`, { children: `Tecnologia` }),
                    (0, $.jsxs)(`ul`, {
                      children: [
                        (0, $.jsx)(`li`, {
                          children: `Sites e páginas de vendas`,
                        }),
                        (0, $.jsx)(`li`, { children: `Apps sob medida` }),
                        (0, $.jsx)(`li`, { children: `Áreas de membros` }),
                        (0, $.jsx)(`li`, {
                          children: `IA que atende no WhatsApp`,
                        }),
                        (0, $.jsx)(`li`, {
                          children: `Agenda, pedidos e cobranças`,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            (0, $.jsx)(`small`, {
              className: `cl-onde`,
              children: `Clientes no Brasil, na Holanda e na Espanha.`,
            }),
          ],
        }),
        (0, $.jsx)(Pu, { whats: Fu }),
        (0, $.jsxs)(`section`, {
          className: `cl cl-cam`,
          "aria-label": `Por onde começar`,
          children: [
            (0, $.jsxs)(`div`, {
              className: `cl-cab`,
              children: [
                (0, $.jsx)(`span`, {
                  className: `cl-tag`,
                  children: `Por onde começar`,
                }),
                (0, $.jsxs)(`h2`, {
                  children: [
                    `Qual é a sua `,
                    (0, $.jsx)(`em`, { children: `ideia?` }),
                  ],
                }),
              ],
            }),
            (0, $.jsx)(`div`, {
              className: `cl-linhas`,
              children: Lu.map((e) =>
                (0, $.jsxs)(
                  `a`,
                  {
                    className: `cl-linha`,
                    href: Iu(e.m),
                    target: `_blank`,
                    rel: `noreferrer`,
                    "data-cursor": `link`,
                    children: [
                      (0, $.jsx)(`small`, { children: e.tag }),
                      (0, $.jsx)(`h3`, { children: e.t }),
                      (0, $.jsx)(`p`, { children: e.f }),
                      (0, $.jsx)(`span`, { children: `Conversar no WhatsApp` }),
                    ],
                  },
                  e.t,
                ),
              ),
            }),
          ],
        }),
        (0, $.jsx)(mc, { whats: Fu }),
      ],
    })
  );
}
(0, c.createRoot)(document.getElementById(`root`)).render((0, $.jsx)(Bu, {}));
