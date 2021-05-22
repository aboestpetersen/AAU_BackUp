// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"dist/ors-js-client.js":[function(require,module,exports) {
var define;
var global = arguments[3];
var process = require("process");
function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }

        var p = n[i] = {
          exports: {}
        };
        e[i][0].call(p.exports, function (r) {
          var n = e[i][1][r];
          return o(n || r);
        }, p, p.exports, r, e, n, t);
      }

      return n[i].exports;
    }

    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
      o(t[i]);
    }

    return o;
  }

  return r;
})()({
  1: [function (_dereq_, module, exports) {
    (function (process, global, setImmediate) {
      (function () {
        !function (t) {
          if ("object" == _typeof2(exports) && "undefined" != typeof module) module.exports = t();else if ("function" == typeof define && define.amd) define([], t);else {
            var e;
            "undefined" != typeof window ? e = window : "undefined" != typeof global ? e = global : "undefined" != typeof self && (e = self), e.Promise = t();
          }
        }(function () {
          var t, e, n;
          return function t(e, n, r) {
            function i(s, a) {
              if (!n[s]) {
                if (!e[s]) {
                  var c = "function" == typeof _dereq_ && _dereq_;
                  if (!a && c) return c(s, !0);
                  if (o) return o(s, !0);
                  var l = new Error("Cannot find module '" + s + "'");
                  throw l.code = "MODULE_NOT_FOUND", l;
                }

                var u = n[s] = {
                  exports: {}
                };
                e[s][0].call(u.exports, function (t) {
                  var n = e[s][1][t];
                  return i(n || t);
                }, u, u.exports, t, e, n, r);
              }

              return n[s].exports;
            }

            for (var o = "function" == typeof _dereq_ && _dereq_, s = 0; s < r.length; s++) {
              i(r[s]);
            }

            return i;
          }({
            1: [function (t, e, n) {
              "use strict";

              e.exports = function (t) {
                var e = t._SomePromiseArray;

                function n(t) {
                  var n = new e(t),
                      r = n.promise();
                  return n.setHowMany(1), n.setUnwrap(), n.init(), r;
                }

                t.any = function (t) {
                  return n(t);
                }, t.prototype.any = function () {
                  return n(this);
                };
              };
            }, {}],
            2: [function (t, e, n) {
              "use strict";

              var r;

              try {
                throw new Error();
              } catch (t) {
                r = t;
              }

              var i = t("./schedule"),
                  o = t("./queue");

              function s() {
                this._customScheduler = !1, this._isTickUsed = !1, this._lateQueue = new o(16), this._normalQueue = new o(16), this._haveDrainedQueues = !1;
                var t = this;
                this.drainQueues = function () {
                  t._drainQueues();
                }, this._schedule = i;
              }

              function a(t) {
                for (; t.length() > 0;) {
                  c(t);
                }
              }

              function c(t) {
                var e = t.shift();
                if ("function" != typeof e) e._settlePromises();else {
                  var n = t.shift(),
                      r = t.shift();
                  e.call(n, r);
                }
              }

              s.prototype.setScheduler = function (t) {
                var e = this._schedule;
                return this._schedule = t, this._customScheduler = !0, e;
              }, s.prototype.hasCustomScheduler = function () {
                return this._customScheduler;
              }, s.prototype.haveItemsQueued = function () {
                return this._isTickUsed || this._haveDrainedQueues;
              }, s.prototype.fatalError = function (t, e) {
                e ? (process.stderr.write("Fatal " + (t instanceof Error ? t.stack : t) + "\n"), process.exit(2)) : this.throwLater(t);
              }, s.prototype.throwLater = function (t, e) {
                if (1 === arguments.length && (e = t, t = function t() {
                  throw e;
                }), "undefined" != typeof setTimeout) setTimeout(function () {
                  t(e);
                }, 0);else try {
                  this._schedule(function () {
                    t(e);
                  });
                } catch (t) {
                  throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
                }
              }, s.prototype.invokeLater = function (t, e, n) {
                this._lateQueue.push(t, e, n), this._queueTick();
              }, s.prototype.invoke = function (t, e, n) {
                this._normalQueue.push(t, e, n), this._queueTick();
              }, s.prototype.settlePromises = function (t) {
                this._normalQueue._pushOne(t), this._queueTick();
              }, s.prototype._drainQueues = function () {
                a(this._normalQueue), this._reset(), this._haveDrainedQueues = !0, a(this._lateQueue);
              }, s.prototype._queueTick = function () {
                this._isTickUsed || (this._isTickUsed = !0, this._schedule(this.drainQueues));
              }, s.prototype._reset = function () {
                this._isTickUsed = !1;
              }, e.exports = s, e.exports.firstLineError = r;
            }, {
              "./queue": 26,
              "./schedule": 29
            }],
            3: [function (t, e, n) {
              "use strict";

              e.exports = function (t, e, n, r) {
                var i = !1,
                    o = function o(t, e) {
                  this._reject(e);
                },
                    s = function s(t, e) {
                  e.promiseRejectionQueued = !0, e.bindingPromise._then(o, o, null, this, t);
                },
                    a = function a(t, e) {
                  0 == (50397184 & this._bitField) && this._resolveCallback(e.target);
                },
                    c = function c(t, e) {
                  e.promiseRejectionQueued || this._reject(t);
                };

                t.prototype.bind = function (o) {
                  i || (i = !0, t.prototype._propagateFrom = r.propagateFromFunction(), t.prototype._boundValue = r.boundValueFunction());
                  var l = n(o),
                      u = new t(e);

                  u._propagateFrom(this, 1);

                  var p = this._target();

                  if (u._setBoundTo(l), l instanceof t) {
                    var f = {
                      promiseRejectionQueued: !1,
                      promise: u,
                      target: p,
                      bindingPromise: l
                    };
                    p._then(e, s, void 0, u, f), l._then(a, c, void 0, u, f), u._setOnCancel(l);
                  } else u._resolveCallback(p);

                  return u;
                }, t.prototype._setBoundTo = function (t) {
                  void 0 !== t ? (this._bitField = 2097152 | this._bitField, this._boundTo = t) : this._bitField = -2097153 & this._bitField;
                }, t.prototype._isBound = function () {
                  return 2097152 == (2097152 & this._bitField);
                }, t.bind = function (e, n) {
                  return t.resolve(n).bind(e);
                };
              };
            }, {}],
            4: [function (t, e, n) {
              "use strict";

              var r;
              "undefined" != typeof Promise && (r = Promise);
              var i = t("./promise")();
              i.noConflict = function () {
                try {
                  Promise === i && (Promise = r);
                } catch (t) {}

                return i;
              }, e.exports = i;
            }, {
              "./promise": 22
            }],
            5: [function (t, e, n) {
              "use strict";

              var r = Object.create;

              if (r) {
                var i = r(null),
                    o = r(null);
                i[" size"] = o[" size"] = 0;
              }

              e.exports = function (e) {
                var n,
                    r = t("./util"),
                    i = r.canEvaluate;
                r.isIdentifier;

                function o(t, n) {
                  var i;

                  if (null != t && (i = t[n]), "function" != typeof i) {
                    var o = "Object " + r.classString(t) + " has no method '" + r.toString(n) + "'";
                    throw new e.TypeError(o);
                  }

                  return i;
                }

                function s(t) {
                  return o(t, this.pop()).apply(t, this);
                }

                function a(t) {
                  return t[this];
                }

                function c(t) {
                  var e = +this;
                  return e < 0 && (e = Math.max(0, e + t.length)), t[e];
                }

                e.prototype.call = function (t) {
                  var e = [].slice.call(arguments, 1);
                  return e.push(t), this._then(s, void 0, void 0, e, void 0);
                }, e.prototype.get = function (t) {
                  var e;
                  if ("number" == typeof t) e = c;else if (i) {
                    var r = n(t);
                    e = null !== r ? r : a;
                  } else e = a;
                  return this._then(e, void 0, void 0, t, void 0);
                };
              };
            }, {
              "./util": 36
            }],
            6: [function (t, e, n) {
              "use strict";

              e.exports = function (e, n, r, i) {
                var o = t("./util"),
                    s = o.tryCatch,
                    a = o.errorObj,
                    c = e._async;
                e.prototype.break = e.prototype.cancel = function () {
                  if (!i.cancellation()) return this._warn("cancellation is disabled");

                  for (var t = this, e = t; t._isCancellable();) {
                    if (!t._cancelBy(e)) {
                      e._isFollowing() ? e._followee().cancel() : e._cancelBranched();
                      break;
                    }

                    var n = t._cancellationParent;

                    if (null == n || !n._isCancellable()) {
                      t._isFollowing() ? t._followee().cancel() : t._cancelBranched();
                      break;
                    }

                    t._isFollowing() && t._followee().cancel(), t._setWillBeCancelled(), e = t, t = n;
                  }
                }, e.prototype._branchHasCancelled = function () {
                  this._branchesRemainingToCancel--;
                }, e.prototype._enoughBranchesHaveCancelled = function () {
                  return void 0 === this._branchesRemainingToCancel || this._branchesRemainingToCancel <= 0;
                }, e.prototype._cancelBy = function (t) {
                  return t === this ? (this._branchesRemainingToCancel = 0, this._invokeOnCancel(), !0) : (this._branchHasCancelled(), !!this._enoughBranchesHaveCancelled() && (this._invokeOnCancel(), !0));
                }, e.prototype._cancelBranched = function () {
                  this._enoughBranchesHaveCancelled() && this._cancel();
                }, e.prototype._cancel = function () {
                  this._isCancellable() && (this._setCancelled(), c.invoke(this._cancelPromises, this, void 0));
                }, e.prototype._cancelPromises = function () {
                  this._length() > 0 && this._settlePromises();
                }, e.prototype._unsetOnCancel = function () {
                  this._onCancelField = void 0;
                }, e.prototype._isCancellable = function () {
                  return this.isPending() && !this._isCancelled();
                }, e.prototype.isCancellable = function () {
                  return this.isPending() && !this.isCancelled();
                }, e.prototype._doInvokeOnCancel = function (t, e) {
                  if (o.isArray(t)) for (var n = 0; n < t.length; ++n) {
                    this._doInvokeOnCancel(t[n], e);
                  } else if (void 0 !== t) if ("function" == typeof t) {
                    if (!e) {
                      var r = s(t).call(this._boundValue());
                      r === a && (this._attachExtraTrace(r.e), c.throwLater(r.e));
                    }
                  } else t._resultCancelled(this);
                }, e.prototype._invokeOnCancel = function () {
                  var t = this._onCancel();

                  this._unsetOnCancel(), c.invoke(this._doInvokeOnCancel, this, t);
                }, e.prototype._invokeInternalOnCancel = function () {
                  this._isCancellable() && (this._doInvokeOnCancel(this._onCancel(), !0), this._unsetOnCancel());
                }, e.prototype._resultCancelled = function () {
                  this.cancel();
                };
              };
            }, {
              "./util": 36
            }],
            7: [function (t, e, n) {
              "use strict";

              e.exports = function (e) {
                var n = t("./util"),
                    r = t("./es5").keys,
                    i = n.tryCatch,
                    o = n.errorObj;
                return function (t, s, a) {
                  return function (c) {
                    var l = a._boundValue();

                    t: for (var u = 0; u < t.length; ++u) {
                      var p = t[u];

                      if (p === Error || null != p && p.prototype instanceof Error) {
                        if (c instanceof p) return i(s).call(l, c);
                      } else if ("function" == typeof p) {
                        var f = i(p).call(l, c);
                        if (f === o) return f;
                        if (f) return i(s).call(l, c);
                      } else if (n.isObject(c)) {
                        for (var h = r(p), _ = 0; _ < h.length; ++_) {
                          var d = h[_];
                          if (p[d] != c[d]) continue t;
                        }

                        return i(s).call(l, c);
                      }
                    }

                    return e;
                  };
                };
              };
            }, {
              "./es5": 13,
              "./util": 36
            }],
            8: [function (t, e, n) {
              "use strict";

              e.exports = function (t) {
                var e = !1,
                    n = [];

                function r() {
                  this._trace = new r.CapturedTrace(i());
                }

                function i() {
                  var t = n.length - 1;
                  if (t >= 0) return n[t];
                }

                return t.prototype._promiseCreated = function () {}, t.prototype._pushContext = function () {}, t.prototype._popContext = function () {
                  return null;
                }, t._peekContext = t.prototype._peekContext = function () {}, r.prototype._pushContext = function () {
                  void 0 !== this._trace && (this._trace._promiseCreated = null, n.push(this._trace));
                }, r.prototype._popContext = function () {
                  if (void 0 !== this._trace) {
                    var t = n.pop(),
                        e = t._promiseCreated;
                    return t._promiseCreated = null, e;
                  }

                  return null;
                }, r.CapturedTrace = null, r.create = function () {
                  if (e) return new r();
                }, r.deactivateLongStackTraces = function () {}, r.activateLongStackTraces = function () {
                  var n = t.prototype._pushContext,
                      o = t.prototype._popContext,
                      s = t._peekContext,
                      a = t.prototype._peekContext,
                      c = t.prototype._promiseCreated;
                  r.deactivateLongStackTraces = function () {
                    t.prototype._pushContext = n, t.prototype._popContext = o, t._peekContext = s, t.prototype._peekContext = a, t.prototype._promiseCreated = c, e = !1;
                  }, e = !0, t.prototype._pushContext = r.prototype._pushContext, t.prototype._popContext = r.prototype._popContext, t._peekContext = t.prototype._peekContext = i, t.prototype._promiseCreated = function () {
                    var t = this._peekContext();

                    t && null == t._promiseCreated && (t._promiseCreated = this);
                  };
                }, r;
              };
            }, {}],
            9: [function (t, e, n) {
              "use strict";

              e.exports = function (e, n, r, i) {
                var o,
                    s,
                    a,
                    c,
                    l = e._async,
                    u = t("./errors").Warning,
                    p = t("./util"),
                    f = t("./es5"),
                    h = p.canAttachTrace,
                    _ = /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/,
                    d = /\((?:timers\.js):\d+:\d+\)/,
                    v = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/,
                    y = null,
                    g = null,
                    m = !1,
                    b = !(0 == p.env("BLUEBIRD_DEBUG")),
                    w = !(0 == p.env("BLUEBIRD_WARNINGS") || !b && !p.env("BLUEBIRD_WARNINGS")),
                    C = !(0 == p.env("BLUEBIRD_LONG_STACK_TRACES") || !b && !p.env("BLUEBIRD_LONG_STACK_TRACES")),
                    j = 0 != p.env("BLUEBIRD_W_FORGOTTEN_RETURN") && (w || !!p.env("BLUEBIRD_W_FORGOTTEN_RETURN"));
                !function () {
                  var t = [];

                  function n() {
                    for (var e = 0; e < t.length; ++e) {
                      t[e]._notifyUnhandledRejection();
                    }

                    r();
                  }

                  function r() {
                    t.length = 0;
                  }

                  c = function c(e) {
                    t.push(e), setTimeout(n, 1);
                  }, f.defineProperty(e, "_unhandledRejectionCheck", {
                    value: n
                  }), f.defineProperty(e, "_unhandledRejectionClear", {
                    value: r
                  });
                }(), e.prototype.suppressUnhandledRejections = function () {
                  var t = this._target();

                  t._bitField = -1048577 & t._bitField | 524288;
                }, e.prototype._ensurePossibleRejectionHandled = function () {
                  0 == (524288 & this._bitField) && (this._setRejectionIsUnhandled(), c(this));
                }, e.prototype._notifyUnhandledRejectionIsHandled = function () {
                  z("rejectionHandled", o, void 0, this);
                }, e.prototype._setReturnedNonUndefined = function () {
                  this._bitField = 268435456 | this._bitField;
                }, e.prototype._returnedNonUndefined = function () {
                  return 0 != (268435456 & this._bitField);
                }, e.prototype._notifyUnhandledRejection = function () {
                  if (this._isRejectionUnhandled()) {
                    var t = this._settledValue();

                    this._setUnhandledRejectionIsNotified(), z("unhandledRejection", s, t, this);
                  }
                }, e.prototype._setUnhandledRejectionIsNotified = function () {
                  this._bitField = 262144 | this._bitField;
                }, e.prototype._unsetUnhandledRejectionIsNotified = function () {
                  this._bitField = -262145 & this._bitField;
                }, e.prototype._isUnhandledRejectionNotified = function () {
                  return (262144 & this._bitField) > 0;
                }, e.prototype._setRejectionIsUnhandled = function () {
                  this._bitField = 1048576 | this._bitField;
                }, e.prototype._unsetRejectionIsUnhandled = function () {
                  this._bitField = -1048577 & this._bitField, this._isUnhandledRejectionNotified() && (this._unsetUnhandledRejectionIsNotified(), this._notifyUnhandledRejectionIsHandled());
                }, e.prototype._isRejectionUnhandled = function () {
                  return (1048576 & this._bitField) > 0;
                }, e.prototype._warn = function (t, e, n) {
                  return q(t, e, n || this);
                }, e.onPossiblyUnhandledRejection = function (t) {
                  var n = e._getContext();

                  s = p.contextBind(n, t);
                }, e.onUnhandledRejectionHandled = function (t) {
                  var n = e._getContext();

                  o = p.contextBind(n, t);
                };

                var k = function k() {};

                e.longStackTraces = function () {
                  if (l.haveItemsQueued() && !et.longStackTraces) throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");

                  if (!et.longStackTraces && W()) {
                    var t = e.prototype._captureStackTrace,
                        r = e.prototype._attachExtraTrace,
                        i = e.prototype._dereferenceTrace;
                    et.longStackTraces = !0, k = function k() {
                      if (l.haveItemsQueued() && !et.longStackTraces) throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
                      e.prototype._captureStackTrace = t, e.prototype._attachExtraTrace = r, e.prototype._dereferenceTrace = i, n.deactivateLongStackTraces(), et.longStackTraces = !1;
                    }, e.prototype._captureStackTrace = U, e.prototype._attachExtraTrace = B, e.prototype._dereferenceTrace = M, n.activateLongStackTraces();
                  }
                }, e.hasLongStackTraces = function () {
                  return et.longStackTraces && W();
                };

                var E = {
                  unhandledrejection: {
                    before: function before() {
                      var t = p.global.onunhandledrejection;
                      return p.global.onunhandledrejection = null, t;
                    },
                    after: function after(t) {
                      p.global.onunhandledrejection = t;
                    }
                  },
                  rejectionhandled: {
                    before: function before() {
                      var t = p.global.onrejectionhandled;
                      return p.global.onrejectionhandled = null, t;
                    },
                    after: function after(t) {
                      p.global.onrejectionhandled = t;
                    }
                  }
                },
                    F = function () {
                  var t = function t(_t, e) {
                    if (!_t) return !p.global.dispatchEvent(e);
                    var n;

                    try {
                      return n = _t.before(), !p.global.dispatchEvent(e);
                    } finally {
                      _t.after(n);
                    }
                  };

                  try {
                    if ("function" == typeof CustomEvent) {
                      var e = new CustomEvent("CustomEvent");
                      return p.global.dispatchEvent(e), function (e, n) {
                        e = e.toLowerCase();
                        var r = new CustomEvent(e, {
                          detail: n,
                          cancelable: !0
                        });
                        return f.defineProperty(r, "promise", {
                          value: n.promise
                        }), f.defineProperty(r, "reason", {
                          value: n.reason
                        }), t(E[e], r);
                      };
                    }

                    if ("function" == typeof Event) {
                      e = new Event("CustomEvent");
                      return p.global.dispatchEvent(e), function (e, n) {
                        e = e.toLowerCase();
                        var r = new Event(e, {
                          cancelable: !0
                        });
                        return r.detail = n, f.defineProperty(r, "promise", {
                          value: n.promise
                        }), f.defineProperty(r, "reason", {
                          value: n.reason
                        }), t(E[e], r);
                      };
                    }

                    return (e = document.createEvent("CustomEvent")).initCustomEvent("testingtheevent", !1, !0, {}), p.global.dispatchEvent(e), function (e, n) {
                      e = e.toLowerCase();
                      var r = document.createEvent("CustomEvent");
                      return r.initCustomEvent(e, !1, !0, n), t(E[e], r);
                    };
                  } catch (t) {}

                  return function () {
                    return !1;
                  };
                }(),
                    x = p.isNode ? function () {
                  return process.emit.apply(process, arguments);
                } : p.global ? function (t) {
                  var e = "on" + t.toLowerCase(),
                      n = p.global[e];
                  return !!n && (n.apply(p.global, [].slice.call(arguments, 1)), !0);
                } : function () {
                  return !1;
                };

                function T(t, e) {
                  return {
                    promise: e
                  };
                }

                var P = {
                  promiseCreated: T,
                  promiseFulfilled: T,
                  promiseRejected: T,
                  promiseResolved: T,
                  promiseCancelled: T,
                  promiseChained: function promiseChained(t, e, n) {
                    return {
                      promise: e,
                      child: n
                    };
                  },
                  warning: function warning(t, e) {
                    return {
                      warning: e
                    };
                  },
                  unhandledRejection: function unhandledRejection(t, e, n) {
                    return {
                      reason: e,
                      promise: n
                    };
                  },
                  rejectionHandled: T
                },
                    R = function R(t) {
                  var e = !1;

                  try {
                    e = x.apply(null, arguments);
                  } catch (t) {
                    l.throwLater(t), e = !0;
                  }

                  var n = !1;

                  try {
                    n = F(t, P[t].apply(null, arguments));
                  } catch (t) {
                    l.throwLater(t), n = !0;
                  }

                  return n || e;
                };

                function S() {
                  return !1;
                }

                function O(t, e, n) {
                  var r = this;

                  try {
                    t(e, n, function (t) {
                      if ("function" != typeof t) throw new TypeError("onCancel must be a function, got: " + p.toString(t));

                      r._attachCancellationCallback(t);
                    });
                  } catch (t) {
                    return t;
                  }
                }

                function A(t) {
                  if (!this._isCancellable()) return this;

                  var e = this._onCancel();

                  void 0 !== e ? p.isArray(e) ? e.push(t) : this._setOnCancel([e, t]) : this._setOnCancel(t);
                }

                function H() {
                  return this._onCancelField;
                }

                function V(t) {
                  this._onCancelField = t;
                }

                function D() {
                  this._cancellationParent = void 0, this._onCancelField = void 0;
                }

                function I(t, e) {
                  if (0 != (1 & e)) {
                    this._cancellationParent = t;
                    var n = t._branchesRemainingToCancel;
                    void 0 === n && (n = 0), t._branchesRemainingToCancel = n + 1;
                  }

                  0 != (2 & e) && t._isBound() && this._setBoundTo(t._boundTo);
                }

                e.config = function (t) {
                  if ("longStackTraces" in (t = Object(t)) && (t.longStackTraces ? e.longStackTraces() : !t.longStackTraces && e.hasLongStackTraces() && k()), "warnings" in t) {
                    var n = t.warnings;
                    et.warnings = !!n, j = et.warnings, p.isObject(n) && "wForgottenReturn" in n && (j = !!n.wForgottenReturn);
                  }

                  if ("cancellation" in t && t.cancellation && !et.cancellation) {
                    if (l.haveItemsQueued()) throw new Error("cannot enable cancellation after promises are in use");
                    e.prototype._clearCancellationData = D, e.prototype._propagateFrom = I, e.prototype._onCancel = H, e.prototype._setOnCancel = V, e.prototype._attachCancellationCallback = A, e.prototype._execute = O, L = I, et.cancellation = !0;
                  }

                  if ("monitoring" in t && (t.monitoring && !et.monitoring ? (et.monitoring = !0, e.prototype._fireEvent = R) : !t.monitoring && et.monitoring && (et.monitoring = !1, e.prototype._fireEvent = S)), "asyncHooks" in t && p.nodeSupportsAsyncResource) {
                    var o = et.asyncHooks,
                        s = !!t.asyncHooks;
                    o !== s && (et.asyncHooks = s, s ? r() : i());
                  }

                  return e;
                }, e.prototype._fireEvent = S, e.prototype._execute = function (t, e, n) {
                  try {
                    t(e, n);
                  } catch (t) {
                    return t;
                  }
                }, e.prototype._onCancel = function () {}, e.prototype._setOnCancel = function (t) {}, e.prototype._attachCancellationCallback = function (t) {}, e.prototype._captureStackTrace = function () {}, e.prototype._attachExtraTrace = function () {}, e.prototype._dereferenceTrace = function () {}, e.prototype._clearCancellationData = function () {}, e.prototype._propagateFrom = function (t, e) {};

                var L = function L(t, e) {
                  0 != (2 & e) && t._isBound() && this._setBoundTo(t._boundTo);
                };

                function N() {
                  var t = this._boundTo;
                  return void 0 !== t && t instanceof e ? t.isFulfilled() ? t.value() : void 0 : t;
                }

                function U() {
                  this._trace = new Z(this._peekContext());
                }

                function B(t, e) {
                  if (h(t)) {
                    var n = this._trace;
                    if (void 0 !== n && e && (n = n._parent), void 0 !== n) n.attachExtraTrace(t);else if (!t.__stackCleaned__) {
                      var r = Q(t);
                      p.notEnumerableProp(t, "stack", r.message + "\n" + r.stack.join("\n")), p.notEnumerableProp(t, "__stackCleaned__", !0);
                    }
                  }
                }

                function M() {
                  this._trace = void 0;
                }

                function q(t, n, r) {
                  if (et.warnings) {
                    var i,
                        o = new u(t);
                    if (n) r._attachExtraTrace(o);else if (et.longStackTraces && (i = e._peekContext())) i.attachExtraTrace(o);else {
                      var s = Q(o);
                      o.stack = s.message + "\n" + s.stack.join("\n");
                    }
                    R("warning", o) || G(o, "", !0);
                  }
                }

                function $(t) {
                  for (var e = [], n = 0; n < t.length; ++n) {
                    var r = t[n],
                        i = "    (No stack trace)" === r || y.test(r),
                        o = i && K(r);
                    i && !o && (m && " " !== r.charAt(0) && (r = "    " + r), e.push(r));
                  }

                  return e;
                }

                function Q(t) {
                  var e = t.stack,
                      n = t.toString();
                  return e = "string" == typeof e && e.length > 0 ? function (t) {
                    for (var e = t.stack.replace(/\s+$/g, "").split("\n"), n = 0; n < e.length; ++n) {
                      var r = e[n];
                      if ("    (No stack trace)" === r || y.test(r)) break;
                    }

                    return n > 0 && "SyntaxError" != t.name && (e = e.slice(n)), e;
                  }(t) : ["    (No stack trace)"], {
                    message: n,
                    stack: "SyntaxError" == t.name ? e : $(e)
                  };
                }

                function G(t, e, n) {
                  if ("undefined" != typeof console) {
                    var r;

                    if (p.isObject(t)) {
                      var i = t.stack;
                      r = e + g(i, t);
                    } else r = e + String(t);

                    "function" == typeof a ? a(r, n) : "function" != typeof console.log && "object" != _typeof2(console.log) || console.log(r);
                  }
                }

                function z(t, e, n, r) {
                  var i = !1;

                  try {
                    "function" == typeof e && (i = !0, "rejectionHandled" === t ? e(r) : e(n, r));
                  } catch (t) {
                    l.throwLater(t);
                  }

                  "unhandledRejection" === t ? R(t, n, r) || i || G(n, "Unhandled rejection ") : R(t, r);
                }

                function X(t) {
                  var e;
                  if ("function" == typeof t) e = "[function " + (t.name || "anonymous") + "]";else {
                    e = t && "function" == typeof t.toString ? t.toString() : p.toString(t);
                    if (/\[object [a-zA-Z0-9$_]+\]/.test(e)) try {
                      e = JSON.stringify(t);
                    } catch (t) {}
                    0 === e.length && (e = "(empty array)");
                  }
                  return "(<" + function (t) {
                    if (t.length < 41) return t;
                    return t.substr(0, 38) + "...";
                  }(e) + ">, no stack trace)";
                }

                function W() {
                  return "function" == typeof tt;
                }

                var K = function K() {
                  return !1;
                },
                    J = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;

                function Y(t) {
                  var e = t.match(J);
                  if (e) return {
                    fileName: e[1],
                    line: parseInt(e[2], 10)
                  };
                }

                function Z(t) {
                  this._parent = t, this._promisesCreated = 0;
                  var e = this._length = 1 + (void 0 === t ? 0 : t._length);
                  tt(this, Z), e > 32 && this.uncycle();
                }

                p.inherits(Z, Error), n.CapturedTrace = Z, Z.prototype.uncycle = function () {
                  var t = this._length;

                  if (!(t < 2)) {
                    for (var e = [], n = {}, r = 0, i = this; void 0 !== i; ++r) {
                      e.push(i), i = i._parent;
                    }

                    for (r = (t = this._length = r) - 1; r >= 0; --r) {
                      var o = e[r].stack;
                      void 0 === n[o] && (n[o] = r);
                    }

                    for (r = 0; r < t; ++r) {
                      var s = n[e[r].stack];

                      if (void 0 !== s && s !== r) {
                        s > 0 && (e[s - 1]._parent = void 0, e[s - 1]._length = 1), e[r]._parent = void 0, e[r]._length = 1;
                        var a = r > 0 ? e[r - 1] : this;
                        s < t - 1 ? (a._parent = e[s + 1], a._parent.uncycle(), a._length = a._parent._length + 1) : (a._parent = void 0, a._length = 1);

                        for (var c = a._length + 1, l = r - 2; l >= 0; --l) {
                          e[l]._length = c, c++;
                        }

                        return;
                      }
                    }
                  }
                }, Z.prototype.attachExtraTrace = function (t) {
                  if (!t.__stackCleaned__) {
                    this.uncycle();

                    for (var e = Q(t), n = e.message, r = [e.stack], i = this; void 0 !== i;) {
                      r.push($(i.stack.split("\n"))), i = i._parent;
                    }

                    !function (t) {
                      for (var e = t[0], n = 1; n < t.length; ++n) {
                        for (var r = t[n], i = e.length - 1, o = e[i], s = -1, a = r.length - 1; a >= 0; --a) {
                          if (r[a] === o) {
                            s = a;
                            break;
                          }
                        }

                        for (a = s; a >= 0; --a) {
                          var c = r[a];
                          if (e[i] !== c) break;
                          e.pop(), i--;
                        }

                        e = r;
                      }
                    }(r), function (t) {
                      for (var e = 0; e < t.length; ++e) {
                        (0 === t[e].length || e + 1 < t.length && t[e][0] === t[e + 1][0]) && (t.splice(e, 1), e--);
                      }
                    }(r), p.notEnumerableProp(t, "stack", function (t, e) {
                      for (var n = 0; n < e.length - 1; ++n) {
                        e[n].push("From previous event:"), e[n] = e[n].join("\n");
                      }

                      return n < e.length && (e[n] = e[n].join("\n")), t + "\n" + e.join("\n");
                    }(n, r)), p.notEnumerableProp(t, "__stackCleaned__", !0);
                  }
                };

                var tt = function () {
                  var t = /^\s*at\s*/,
                      e = function e(t, _e) {
                    return "string" == typeof t ? t : void 0 !== _e.name && void 0 !== _e.message ? _e.toString() : X(_e);
                  };

                  if ("number" == typeof Error.stackTraceLimit && "function" == typeof Error.captureStackTrace) {
                    Error.stackTraceLimit += 6, y = t, g = e;
                    var n = Error.captureStackTrace;
                    return K = function K(t) {
                      return _.test(t);
                    }, function (t, e) {
                      Error.stackTraceLimit += 6, n(t, e), Error.stackTraceLimit -= 6;
                    };
                  }

                  var r,
                      i = new Error();
                  if ("string" == typeof i.stack && i.stack.split("\n")[0].indexOf("stackDetection@") >= 0) return y = /@/, g = e, m = !0, function (t) {
                    t.stack = new Error().stack;
                  };

                  try {
                    throw new Error();
                  } catch (t) {
                    r = "stack" in t;
                  }

                  return "stack" in i || !r || "number" != typeof Error.stackTraceLimit ? (g = function g(t, e) {
                    return "string" == typeof t ? t : "object" != _typeof2(e) && "function" != typeof e || void 0 === e.name || void 0 === e.message ? X(e) : e.toString();
                  }, null) : (y = t, g = e, function (t) {
                    Error.stackTraceLimit += 6;

                    try {
                      throw new Error();
                    } catch (e) {
                      t.stack = e.stack;
                    }

                    Error.stackTraceLimit -= 6;
                  });
                }();

                "undefined" != typeof console && void 0 !== console.warn && (a = function a(t) {
                  console.warn(t);
                }, p.isNode && process.stderr.isTTY ? a = function a(t, e) {
                  var n = e ? "[33m" : "[31m";
                  console.warn(n + t + "[0m\n");
                } : p.isNode || "string" != typeof new Error().stack || (a = function a(t, e) {
                  console.warn("%c" + t, e ? "color: darkorange" : "color: red");
                }));
                var et = {
                  warnings: w,
                  longStackTraces: !1,
                  cancellation: !1,
                  monitoring: !1,
                  asyncHooks: !1
                };
                return C && e.longStackTraces(), {
                  asyncHooks: function asyncHooks() {
                    return et.asyncHooks;
                  },
                  longStackTraces: function longStackTraces() {
                    return et.longStackTraces;
                  },
                  warnings: function warnings() {
                    return et.warnings;
                  },
                  cancellation: function cancellation() {
                    return et.cancellation;
                  },
                  monitoring: function monitoring() {
                    return et.monitoring;
                  },
                  propagateFromFunction: function propagateFromFunction() {
                    return L;
                  },
                  boundValueFunction: function boundValueFunction() {
                    return N;
                  },
                  checkForgottenReturns: function checkForgottenReturns(t, e, n, r, i) {
                    if (void 0 === t && null !== e && j) {
                      if (void 0 !== i && i._returnedNonUndefined()) return;
                      if (0 == (65535 & r._bitField)) return;
                      n && (n += " ");
                      var o = "",
                          s = "";

                      if (e._trace) {
                        for (var a = e._trace.stack.split("\n"), c = $(a), l = c.length - 1; l >= 0; --l) {
                          var u = c[l];

                          if (!d.test(u)) {
                            var p = u.match(v);
                            p && (o = "at " + p[1] + ":" + p[2] + ":" + p[3] + " ");
                            break;
                          }
                        }

                        if (c.length > 0) {
                          var f = c[0];

                          for (l = 0; l < a.length; ++l) {
                            if (a[l] === f) {
                              l > 0 && (s = "\n" + a[l - 1]);
                              break;
                            }
                          }
                        }
                      }

                      var h = "a promise was created in a " + n + "handler " + o + "but was not returned from it, see http://goo.gl/rRqMUw" + s;

                      r._warn(h, !0, e);
                    }
                  },
                  setBounds: function setBounds(t, e) {
                    if (W()) {
                      for (var n, r, i = (t.stack || "").split("\n"), o = (e.stack || "").split("\n"), s = -1, a = -1, c = 0; c < i.length; ++c) {
                        if (l = Y(i[c])) {
                          n = l.fileName, s = l.line;
                          break;
                        }
                      }

                      for (c = 0; c < o.length; ++c) {
                        var l;

                        if (l = Y(o[c])) {
                          r = l.fileName, a = l.line;
                          break;
                        }
                      }

                      s < 0 || a < 0 || !n || !r || n !== r || s >= a || (K = function K(t) {
                        if (_.test(t)) return !0;
                        var e = Y(t);
                        return !!(e && e.fileName === n && s <= e.line && e.line <= a);
                      });
                    }
                  },
                  warn: q,
                  deprecated: function deprecated(t, e) {
                    var n = t + " is deprecated and will be removed in a future version.";
                    return e && (n += " Use " + e + " instead."), q(n);
                  },
                  CapturedTrace: Z,
                  fireDomEvent: F,
                  fireGlobalEvent: x
                };
              };
            }, {
              "./errors": 12,
              "./es5": 13,
              "./util": 36
            }],
            10: [function (t, e, n) {
              "use strict";

              e.exports = function (t) {
                function e() {
                  return this.value;
                }

                function n() {
                  throw this.reason;
                }

                t.prototype.return = t.prototype.thenReturn = function (n) {
                  return n instanceof t && n.suppressUnhandledRejections(), this._then(e, void 0, void 0, {
                    value: n
                  }, void 0);
                }, t.prototype.throw = t.prototype.thenThrow = function (t) {
                  return this._then(n, void 0, void 0, {
                    reason: t
                  }, void 0);
                }, t.prototype.catchThrow = function (t) {
                  if (arguments.length <= 1) return this._then(void 0, n, void 0, {
                    reason: t
                  }, void 0);
                  var e = arguments[1];
                  return this.caught(t, function () {
                    throw e;
                  });
                }, t.prototype.catchReturn = function (n) {
                  if (arguments.length <= 1) return n instanceof t && n.suppressUnhandledRejections(), this._then(void 0, e, void 0, {
                    value: n
                  }, void 0);
                  var r = arguments[1];
                  r instanceof t && r.suppressUnhandledRejections();
                  return this.caught(n, function () {
                    return r;
                  });
                };
              };
            }, {}],
            11: [function (t, e, n) {
              "use strict";

              e.exports = function (t, e) {
                var n = t.reduce,
                    r = t.all;

                function i() {
                  return r(this);
                }

                t.prototype.each = function (t) {
                  return n(this, t, e, 0)._then(i, void 0, void 0, this, void 0);
                }, t.prototype.mapSeries = function (t) {
                  return n(this, t, e, e);
                }, t.each = function (t, r) {
                  return n(t, r, e, 0)._then(i, void 0, void 0, t, void 0);
                }, t.mapSeries = function (t, r) {
                  return n(t, r, e, e);
                };
              };
            }, {}],
            12: [function (t, e, n) {
              "use strict";

              var r,
                  i,
                  o = t("./es5"),
                  s = o.freeze,
                  a = t("./util"),
                  c = a.inherits,
                  l = a.notEnumerableProp;

              function u(t, e) {
                function n(r) {
                  if (!(this instanceof n)) return new n(r);
                  l(this, "message", "string" == typeof r ? r : e), l(this, "name", t), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : Error.call(this);
                }

                return c(n, Error), n;
              }

              var p = u("Warning", "warning"),
                  f = u("CancellationError", "cancellation error"),
                  h = u("TimeoutError", "timeout error"),
                  _ = u("AggregateError", "aggregate error");

              try {
                r = TypeError, i = RangeError;
              } catch (t) {
                r = u("TypeError", "type error"), i = u("RangeError", "range error");
              }

              for (var d = "join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" "), v = 0; v < d.length; ++v) {
                "function" == typeof Array.prototype[d[v]] && (_.prototype[d[v]] = Array.prototype[d[v]]);
              }

              o.defineProperty(_.prototype, "length", {
                value: 0,
                configurable: !1,
                writable: !0,
                enumerable: !0
              }), _.prototype.isOperational = !0;
              var y = 0;

              function g(t) {
                if (!(this instanceof g)) return new g(t);
                l(this, "name", "OperationalError"), l(this, "message", t), this.cause = t, this.isOperational = !0, t instanceof Error ? (l(this, "message", t.message), l(this, "stack", t.stack)) : Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
              }

              _.prototype.toString = function () {
                var t = Array(4 * y + 1).join(" "),
                    e = "\n" + t + "AggregateError of:\n";
                y++, t = Array(4 * y + 1).join(" ");

                for (var n = 0; n < this.length; ++n) {
                  for (var r = this[n] === this ? "[Circular AggregateError]" : this[n] + "", i = r.split("\n"), o = 0; o < i.length; ++o) {
                    i[o] = t + i[o];
                  }

                  e += (r = i.join("\n")) + "\n";
                }

                return y--, e;
              }, c(g, Error);
              var m = Error.__BluebirdErrorTypes__;
              m || (m = s({
                CancellationError: f,
                TimeoutError: h,
                OperationalError: g,
                RejectionError: g,
                AggregateError: _
              }), o.defineProperty(Error, "__BluebirdErrorTypes__", {
                value: m,
                writable: !1,
                enumerable: !1,
                configurable: !1
              })), e.exports = {
                Error: Error,
                TypeError: r,
                RangeError: i,
                CancellationError: m.CancellationError,
                OperationalError: m.OperationalError,
                TimeoutError: m.TimeoutError,
                AggregateError: m.AggregateError,
                Warning: p
              };
            }, {
              "./es5": 13,
              "./util": 36
            }],
            13: [function (t, e, n) {
              var r = function () {
                "use strict";

                return void 0 === this;
              }();

              if (r) e.exports = {
                freeze: Object.freeze,
                defineProperty: Object.defineProperty,
                getDescriptor: Object.getOwnPropertyDescriptor,
                keys: Object.keys,
                names: Object.getOwnPropertyNames,
                getPrototypeOf: Object.getPrototypeOf,
                isArray: Array.isArray,
                isES5: r,
                propertyIsWritable: function propertyIsWritable(t, e) {
                  var n = Object.getOwnPropertyDescriptor(t, e);
                  return !(n && !n.writable && !n.set);
                }
              };else {
                var i = {}.hasOwnProperty,
                    o = {}.toString,
                    s = {}.constructor.prototype,
                    a = function a(t) {
                  var e = [];

                  for (var n in t) {
                    i.call(t, n) && e.push(n);
                  }

                  return e;
                };

                e.exports = {
                  isArray: function isArray(t) {
                    try {
                      return "[object Array]" === o.call(t);
                    } catch (t) {
                      return !1;
                    }
                  },
                  keys: a,
                  names: a,
                  defineProperty: function defineProperty(t, e, n) {
                    return t[e] = n.value, t;
                  },
                  getDescriptor: function getDescriptor(t, e) {
                    return {
                      value: t[e]
                    };
                  },
                  freeze: function freeze(t) {
                    return t;
                  },
                  getPrototypeOf: function getPrototypeOf(t) {
                    try {
                      return Object(t).constructor.prototype;
                    } catch (t) {
                      return s;
                    }
                  },
                  isES5: r,
                  propertyIsWritable: function propertyIsWritable() {
                    return !0;
                  }
                };
              }
            }, {}],
            14: [function (t, e, n) {
              "use strict";

              e.exports = function (t, e) {
                var n = t.map;
                t.prototype.filter = function (t, r) {
                  return n(this, t, r, e);
                }, t.filter = function (t, r, i) {
                  return n(t, r, i, e);
                };
              };
            }, {}],
            15: [function (t, e, n) {
              "use strict";

              e.exports = function (e, n, r) {
                var i = t("./util"),
                    o = e.CancellationError,
                    s = i.errorObj,
                    a = t("./catch_filter")(r);

                function c(t, e, n) {
                  this.promise = t, this.type = e, this.handler = n, this.called = !1, this.cancelPromise = null;
                }

                function l(t) {
                  this.finallyHandler = t;
                }

                function u(t, e) {
                  return null != t.cancelPromise && (arguments.length > 1 ? t.cancelPromise._reject(e) : t.cancelPromise._cancel(), t.cancelPromise = null, !0);
                }

                function p() {
                  return h.call(this, this.promise._target()._settledValue());
                }

                function f(t) {
                  if (!u(this, t)) return s.e = t, s;
                }

                function h(t) {
                  var i = this.promise,
                      a = this.handler;

                  if (!this.called) {
                    this.called = !0;
                    var c = this.isFinallyHandler() ? a.call(i._boundValue()) : a.call(i._boundValue(), t);
                    if (c === r) return c;

                    if (void 0 !== c) {
                      i._setReturnedNonUndefined();

                      var h = n(c, i);

                      if (h instanceof e) {
                        if (null != this.cancelPromise) {
                          if (h._isCancelled()) {
                            var _ = new o("late cancellation observer");

                            return i._attachExtraTrace(_), s.e = _, s;
                          }

                          h.isPending() && h._attachCancellationCallback(new l(this));
                        }

                        return h._then(p, f, void 0, this, void 0);
                      }
                    }
                  }

                  return i.isRejected() ? (u(this), s.e = t, s) : (u(this), t);
                }

                return c.prototype.isFinallyHandler = function () {
                  return 0 === this.type;
                }, l.prototype._resultCancelled = function () {
                  u(this.finallyHandler);
                }, e.prototype._passThrough = function (t, e, n, r) {
                  return "function" != typeof t ? this.then() : this._then(n, r, void 0, new c(this, e, t), void 0);
                }, e.prototype.lastly = e.prototype.finally = function (t) {
                  return this._passThrough(t, 0, h, h);
                }, e.prototype.tap = function (t) {
                  return this._passThrough(t, 1, h);
                }, e.prototype.tapCatch = function (t) {
                  var n = arguments.length;
                  if (1 === n) return this._passThrough(t, 1, void 0, h);
                  var r,
                      o = new Array(n - 1),
                      s = 0;

                  for (r = 0; r < n - 1; ++r) {
                    var c = arguments[r];
                    if (!i.isObject(c)) return e.reject(new TypeError("tapCatch statement predicate: expecting an object but got " + i.classString(c)));
                    o[s++] = c;
                  }

                  o.length = s;
                  var l = arguments[r];
                  return this._passThrough(a(o, l, this), 1, void 0, h);
                }, c;
              };
            }, {
              "./catch_filter": 7,
              "./util": 36
            }],
            16: [function (t, e, n) {
              "use strict";

              e.exports = function (e, n, r, i, o, s) {
                var a = t("./errors").TypeError,
                    c = t("./util"),
                    l = c.errorObj,
                    u = c.tryCatch,
                    p = [];

                function f(t, n, i, o) {
                  if (s.cancellation()) {
                    var a = new e(r),
                        c = this._finallyPromise = new e(r);
                    this._promise = a.lastly(function () {
                      return c;
                    }), a._captureStackTrace(), a._setOnCancel(this);
                  } else {
                    (this._promise = new e(r))._captureStackTrace();
                  }

                  this._stack = o, this._generatorFunction = t, this._receiver = n, this._generator = void 0, this._yieldHandlers = "function" == typeof i ? [i].concat(p) : p, this._yieldedPromise = null, this._cancellationPhase = !1;
                }

                c.inherits(f, o), f.prototype._isResolved = function () {
                  return null === this._promise;
                }, f.prototype._cleanup = function () {
                  this._promise = this._generator = null, s.cancellation() && null !== this._finallyPromise && (this._finallyPromise._fulfill(), this._finallyPromise = null);
                }, f.prototype._promiseCancelled = function () {
                  if (!this._isResolved()) {
                    var t;
                    if (void 0 !== this._generator.return) this._promise._pushContext(), t = u(this._generator.return).call(this._generator, void 0), this._promise._popContext();else {
                      var n = new e.CancellationError("generator .return() sentinel");
                      e.coroutine.returnSentinel = n, this._promise._attachExtraTrace(n), this._promise._pushContext(), t = u(this._generator.throw).call(this._generator, n), this._promise._popContext();
                    }
                    this._cancellationPhase = !0, this._yieldedPromise = null, this._continue(t);
                  }
                }, f.prototype._promiseFulfilled = function (t) {
                  this._yieldedPromise = null, this._promise._pushContext();
                  var e = u(this._generator.next).call(this._generator, t);
                  this._promise._popContext(), this._continue(e);
                }, f.prototype._promiseRejected = function (t) {
                  this._yieldedPromise = null, this._promise._attachExtraTrace(t), this._promise._pushContext();
                  var e = u(this._generator.throw).call(this._generator, t);
                  this._promise._popContext(), this._continue(e);
                }, f.prototype._resultCancelled = function () {
                  if (this._yieldedPromise instanceof e) {
                    var t = this._yieldedPromise;
                    this._yieldedPromise = null, t.cancel();
                  }
                }, f.prototype.promise = function () {
                  return this._promise;
                }, f.prototype._run = function () {
                  this._generator = this._generatorFunction.call(this._receiver), this._receiver = this._generatorFunction = void 0, this._promiseFulfilled(void 0);
                }, f.prototype._continue = function (t) {
                  var n = this._promise;
                  if (t === l) return this._cleanup(), this._cancellationPhase ? n.cancel() : n._rejectCallback(t.e, !1);
                  var r = t.value;
                  if (!0 === t.done) return this._cleanup(), this._cancellationPhase ? n.cancel() : n._resolveCallback(r);
                  var o = i(r, this._promise);

                  if (o instanceof e || null !== (o = function (t, n, r) {
                    for (var o = 0; o < n.length; ++o) {
                      r._pushContext();

                      var s = u(n[o])(t);

                      if (r._popContext(), s === l) {
                        r._pushContext();

                        var a = e.reject(l.e);
                        return r._popContext(), a;
                      }

                      var c = i(s, r);
                      if (c instanceof e) return c;
                    }

                    return null;
                  }(o, this._yieldHandlers, this._promise))) {
                    var s = (o = o._target())._bitField;

                    0 == (50397184 & s) ? (this._yieldedPromise = o, o._proxy(this, null)) : 0 != (33554432 & s) ? e._async.invoke(this._promiseFulfilled, this, o._value()) : 0 != (16777216 & s) ? e._async.invoke(this._promiseRejected, this, o._reason()) : this._promiseCancelled();
                  } else this._promiseRejected(new a("A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s", String(r)) + "From coroutine:\n" + this._stack.split("\n").slice(1, -7).join("\n")));
                }, e.coroutine = function (t, e) {
                  if ("function" != typeof t) throw new a("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
                  var n = Object(e).yieldHandler,
                      r = f,
                      i = new Error().stack;
                  return function () {
                    var e = t.apply(this, arguments),
                        o = new r(void 0, void 0, n, i),
                        s = o.promise();
                    return o._generator = e, o._promiseFulfilled(void 0), s;
                  };
                }, e.coroutine.addYieldHandler = function (t) {
                  if ("function" != typeof t) throw new a("expecting a function but got " + c.classString(t));
                  p.push(t);
                }, e.spawn = function (t) {
                  if (s.deprecated("Promise.spawn()", "Promise.coroutine()"), "function" != typeof t) return n("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
                  var r = new f(t, this),
                      i = r.promise();
                  return r._run(e.spawn), i;
                };
              };
            }, {
              "./errors": 12,
              "./util": 36
            }],
            17: [function (t, e, n) {
              "use strict";

              e.exports = function (e, n, r, i, o) {
                var s = t("./util");
                s.canEvaluate, s.tryCatch, s.errorObj;

                e.join = function () {
                  var t,
                      e = arguments.length - 1;
                  e > 0 && "function" == typeof arguments[e] && (t = arguments[e]);
                  var r = [].slice.call(arguments);
                  t && r.pop();
                  var i = new n(r).promise();
                  return void 0 !== t ? i.spread(t) : i;
                };
              };
            }, {
              "./util": 36
            }],
            18: [function (t, e, n) {
              "use strict";

              e.exports = function (e, n, r, i, o, s) {
                var a = t("./util"),
                    c = a.tryCatch,
                    l = a.errorObj,
                    u = e._async;

                function p(t, n, r, i) {
                  this.constructor$(t), this._promise._captureStackTrace();

                  var s = e._getContext();

                  if (this._callback = a.contextBind(s, n), this._preservedValues = i === o ? new Array(this.length()) : null, this._limit = r, this._inFlight = 0, this._queue = [], u.invoke(this._asyncInit, this, void 0), a.isArray(t)) for (var c = 0; c < t.length; ++c) {
                    var l = t[c];
                    l instanceof e && l.suppressUnhandledRejections();
                  }
                }

                function f(t, n, i, o) {
                  if ("function" != typeof n) return r("expecting a function but got " + a.classString(n));
                  var s = 0;

                  if (void 0 !== i) {
                    if ("object" != _typeof2(i) || null === i) return e.reject(new TypeError("options argument must be an object but it is " + a.classString(i)));
                    if ("number" != typeof i.concurrency) return e.reject(new TypeError("'concurrency' must be a number but it is " + a.classString(i.concurrency)));
                    s = i.concurrency;
                  }

                  return new p(t, n, s = "number" == typeof s && isFinite(s) && s >= 1 ? s : 0, o).promise();
                }

                a.inherits(p, n), p.prototype._asyncInit = function () {
                  this._init$(void 0, -2);
                }, p.prototype._init = function () {}, p.prototype._promiseFulfilled = function (t, n) {
                  var r = this._values,
                      o = this.length(),
                      a = this._preservedValues,
                      u = this._limit;

                  if (n < 0) {
                    if (r[n = -1 * n - 1] = t, u >= 1 && (this._inFlight--, this._drainQueue(), this._isResolved())) return !0;
                  } else {
                    if (u >= 1 && this._inFlight >= u) return r[n] = t, this._queue.push(n), !1;
                    null !== a && (a[n] = t);

                    var p = this._promise,
                        f = this._callback,
                        h = p._boundValue();

                    p._pushContext();

                    var _ = c(f).call(h, t, n, o),
                        d = p._popContext();

                    if (s.checkForgottenReturns(_, d, null !== a ? "Promise.filter" : "Promise.map", p), _ === l) return this._reject(_.e), !0;
                    var v = i(_, this._promise);

                    if (v instanceof e) {
                      var y = (v = v._target())._bitField;

                      if (0 == (50397184 & y)) return u >= 1 && this._inFlight++, r[n] = v, v._proxy(this, -1 * (n + 1)), !1;
                      if (0 == (33554432 & y)) return 0 != (16777216 & y) ? (this._reject(v._reason()), !0) : (this._cancel(), !0);
                      _ = v._value();
                    }

                    r[n] = _;
                  }

                  return ++this._totalResolved >= o && (null !== a ? this._filter(r, a) : this._resolve(r), !0);
                }, p.prototype._drainQueue = function () {
                  for (var t = this._queue, e = this._limit, n = this._values; t.length > 0 && this._inFlight < e;) {
                    if (this._isResolved()) return;
                    var r = t.pop();

                    this._promiseFulfilled(n[r], r);
                  }
                }, p.prototype._filter = function (t, e) {
                  for (var n = e.length, r = new Array(n), i = 0, o = 0; o < n; ++o) {
                    t[o] && (r[i++] = e[o]);
                  }

                  r.length = i, this._resolve(r);
                }, p.prototype.preservedValues = function () {
                  return this._preservedValues;
                }, e.prototype.map = function (t, e) {
                  return f(this, t, e, null);
                }, e.map = function (t, e, n, r) {
                  return f(t, e, n, r);
                };
              };
            }, {
              "./util": 36
            }],
            19: [function (t, e, n) {
              "use strict";

              e.exports = function (e, n, r, i, o) {
                var s = t("./util"),
                    a = s.tryCatch;
                e.method = function (t) {
                  if ("function" != typeof t) throw new e.TypeError("expecting a function but got " + s.classString(t));
                  return function () {
                    var r = new e(n);
                    r._captureStackTrace(), r._pushContext();

                    var i = a(t).apply(this, arguments),
                        s = r._popContext();

                    return o.checkForgottenReturns(i, s, "Promise.method", r), r._resolveFromSyncValue(i), r;
                  };
                }, e.attempt = e.try = function (t) {
                  if ("function" != typeof t) return i("expecting a function but got " + s.classString(t));
                  var r,
                      c = new e(n);

                  if (c._captureStackTrace(), c._pushContext(), arguments.length > 1) {
                    o.deprecated("calling Promise.try with more than 1 argument");
                    var l = arguments[1],
                        u = arguments[2];
                    r = s.isArray(l) ? a(t).apply(u, l) : a(t).call(u, l);
                  } else r = a(t)();

                  var p = c._popContext();

                  return o.checkForgottenReturns(r, p, "Promise.try", c), c._resolveFromSyncValue(r), c;
                }, e.prototype._resolveFromSyncValue = function (t) {
                  t === s.errorObj ? this._rejectCallback(t.e, !1) : this._resolveCallback(t, !0);
                };
              };
            }, {
              "./util": 36
            }],
            20: [function (t, e, n) {
              "use strict";

              var r = t("./util"),
                  i = r.maybeWrapAsError,
                  o = t("./errors").OperationalError,
                  s = t("./es5");
              var a = /^(?:name|message|stack|cause)$/;

              function c(t) {
                var e;

                if (function (t) {
                  return t instanceof Error && s.getPrototypeOf(t) === Error.prototype;
                }(t)) {
                  (e = new o(t)).name = t.name, e.message = t.message, e.stack = t.stack;

                  for (var n = s.keys(t), i = 0; i < n.length; ++i) {
                    var c = n[i];
                    a.test(c) || (e[c] = t[c]);
                  }

                  return e;
                }

                return r.markAsOriginatingFromRejection(t), t;
              }

              e.exports = function (t, e) {
                return function (n, r) {
                  if (null !== t) {
                    if (n) {
                      var o = c(i(n));
                      t._attachExtraTrace(o), t._reject(o);
                    } else if (e) {
                      var s = [].slice.call(arguments, 1);

                      t._fulfill(s);
                    } else t._fulfill(r);

                    t = null;
                  }
                };
              };
            }, {
              "./errors": 12,
              "./es5": 13,
              "./util": 36
            }],
            21: [function (t, e, n) {
              "use strict";

              e.exports = function (e) {
                var n = t("./util"),
                    r = e._async,
                    i = n.tryCatch,
                    o = n.errorObj;

                function s(t, e) {
                  if (!n.isArray(t)) return a.call(this, t, e);
                  var s = i(e).apply(this._boundValue(), [null].concat(t));
                  s === o && r.throwLater(s.e);
                }

                function a(t, e) {
                  var n = this._boundValue(),
                      s = void 0 === t ? i(e).call(n, null) : i(e).call(n, null, t);

                  s === o && r.throwLater(s.e);
                }

                function c(t, e) {
                  if (!t) {
                    var n = new Error(t + "");
                    n.cause = t, t = n;
                  }

                  var s = i(e).call(this._boundValue(), t);
                  s === o && r.throwLater(s.e);
                }

                e.prototype.asCallback = e.prototype.nodeify = function (t, e) {
                  if ("function" == typeof t) {
                    var n = a;
                    void 0 !== e && Object(e).spread && (n = s), this._then(n, c, void 0, this, t);
                  }

                  return this;
                };
              };
            }, {
              "./util": 36
            }],
            22: [function (t, e, n) {
              "use strict";

              e.exports = function () {
                var n = function n() {
                  return new y("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n");
                },
                    r = function r() {
                  return new O.PromiseInspection(this._target());
                },
                    i = function i(t) {
                  return O.reject(new y(t));
                };

                function o() {}

                var s = {},
                    a = t("./util");
                a.setReflectHandler(r);

                var c = function c() {
                  var t = process.domain;
                  return void 0 === t ? null : t;
                },
                    l = function l() {
                  return {
                    domain: c(),
                    async: null
                  };
                },
                    u = a.isNode && a.nodeSupportsAsyncResource ? t("async_hooks").AsyncResource : null,
                    p = function p() {
                  return {
                    domain: c(),
                    async: new u("Bluebird::Promise")
                  };
                },
                    f = a.isNode ? l : function () {
                  return null;
                };

                a.notEnumerableProp(O, "_getContext", f);

                var h = t("./es5"),
                    _ = t("./async"),
                    d = new _();

                h.defineProperty(O, "_async", {
                  value: d
                });
                var v = t("./errors"),
                    y = O.TypeError = v.TypeError;
                O.RangeError = v.RangeError;
                var g = O.CancellationError = v.CancellationError;
                O.TimeoutError = v.TimeoutError, O.OperationalError = v.OperationalError, O.RejectionError = v.OperationalError, O.AggregateError = v.AggregateError;

                var m = function m() {},
                    b = {},
                    w = {},
                    C = t("./thenables")(O, m),
                    j = t("./promise_array")(O, m, C, i, o),
                    k = t("./context")(O),
                    E = k.create,
                    F = t("./debuggability")(O, k, function () {
                  f = p, a.notEnumerableProp(O, "_getContext", p);
                }, function () {
                  f = l, a.notEnumerableProp(O, "_getContext", l);
                }),
                    x = (F.CapturedTrace, t("./finally")(O, C, w)),
                    T = t("./catch_filter")(w),
                    P = t("./nodeback"),
                    R = a.errorObj,
                    S = a.tryCatch;

                function O(t) {
                  t !== m && function (t, e) {
                    if (null == t || t.constructor !== O) throw new y("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n");
                    if ("function" != typeof e) throw new y("expecting a function but got " + a.classString(e));
                  }(this, t), this._bitField = 0, this._fulfillmentHandler0 = void 0, this._rejectionHandler0 = void 0, this._promise0 = void 0, this._receiver0 = void 0, this._resolveFromExecutor(t), this._promiseCreated(), this._fireEvent("promiseCreated", this);
                }

                function A(t) {
                  this.promise._resolveCallback(t);
                }

                function H(t) {
                  this.promise._rejectCallback(t, !1);
                }

                function V(t) {
                  var e = new O(m);
                  e._fulfillmentHandler0 = t, e._rejectionHandler0 = t, e._promise0 = t, e._receiver0 = t;
                }

                return O.prototype.toString = function () {
                  return "[object Promise]";
                }, O.prototype.caught = O.prototype.catch = function (t) {
                  var e = arguments.length;

                  if (e > 1) {
                    var n,
                        r = new Array(e - 1),
                        o = 0;

                    for (n = 0; n < e - 1; ++n) {
                      var s = arguments[n];
                      if (!a.isObject(s)) return i("Catch statement predicate: expecting an object but got " + a.classString(s));
                      r[o++] = s;
                    }

                    if (r.length = o, "function" != typeof (t = arguments[n])) throw new y("The last argument to .catch() must be a function, got " + a.toString(t));
                    return this.then(void 0, T(r, t, this));
                  }

                  return this.then(void 0, t);
                }, O.prototype.reflect = function () {
                  return this._then(r, r, void 0, this, void 0);
                }, O.prototype.then = function (t, e) {
                  if (F.warnings() && arguments.length > 0 && "function" != typeof t && "function" != typeof e) {
                    var n = ".then() only accepts functions but was passed: " + a.classString(t);
                    arguments.length > 1 && (n += ", " + a.classString(e)), this._warn(n);
                  }

                  return this._then(t, e, void 0, void 0, void 0);
                }, O.prototype.done = function (t, e) {
                  this._then(t, e, void 0, void 0, void 0)._setIsFinal();
                }, O.prototype.spread = function (t) {
                  return "function" != typeof t ? i("expecting a function but got " + a.classString(t)) : this.all()._then(t, void 0, void 0, b, void 0);
                }, O.prototype.toJSON = function () {
                  var t = {
                    isFulfilled: !1,
                    isRejected: !1,
                    fulfillmentValue: void 0,
                    rejectionReason: void 0
                  };
                  return this.isFulfilled() ? (t.fulfillmentValue = this.value(), t.isFulfilled = !0) : this.isRejected() && (t.rejectionReason = this.reason(), t.isRejected = !0), t;
                }, O.prototype.all = function () {
                  return arguments.length > 0 && this._warn(".all() was passed arguments but it does not take any"), new j(this).promise();
                }, O.prototype.error = function (t) {
                  return this.caught(a.originatesFromRejection, t);
                }, O.getNewLibraryCopy = e.exports, O.is = function (t) {
                  return t instanceof O;
                }, O.fromNode = O.fromCallback = function (t) {
                  var e = new O(m);

                  e._captureStackTrace();

                  var n = arguments.length > 1 && !!Object(arguments[1]).multiArgs,
                      r = S(t)(P(e, n));
                  return r === R && e._rejectCallback(r.e, !0), e._isFateSealed() || e._setAsyncGuaranteed(), e;
                }, O.all = function (t) {
                  return new j(t).promise();
                }, O.cast = function (t) {
                  var e = C(t);
                  return e instanceof O || ((e = new O(m))._captureStackTrace(), e._setFulfilled(), e._rejectionHandler0 = t), e;
                }, O.resolve = O.fulfilled = O.cast, O.reject = O.rejected = function (t) {
                  var e = new O(m);
                  return e._captureStackTrace(), e._rejectCallback(t, !0), e;
                }, O.setScheduler = function (t) {
                  if ("function" != typeof t) throw new y("expecting a function but got " + a.classString(t));
                  return d.setScheduler(t);
                }, O.prototype._then = function (t, e, n, r, i) {
                  var o = void 0 !== i,
                      s = o ? i : new O(m),
                      c = this._target(),
                      l = c._bitField;

                  o || (s._propagateFrom(this, 3), s._captureStackTrace(), void 0 === r && 0 != (2097152 & this._bitField) && (r = 0 != (50397184 & l) ? this._boundValue() : c === this ? void 0 : this._boundTo), this._fireEvent("promiseChained", this, s));
                  var u = f();

                  if (0 != (50397184 & l)) {
                    var p,
                        h,
                        _ = c._settlePromiseCtx;
                    0 != (33554432 & l) ? (h = c._rejectionHandler0, p = t) : 0 != (16777216 & l) ? (h = c._fulfillmentHandler0, p = e, c._unsetRejectionIsUnhandled()) : (_ = c._settlePromiseLateCancellationObserver, h = new g("late cancellation observer"), c._attachExtraTrace(h), p = e), d.invoke(_, c, {
                      handler: a.contextBind(u, p),
                      promise: s,
                      receiver: r,
                      value: h
                    });
                  } else c._addCallbacks(t, e, s, r, u);

                  return s;
                }, O.prototype._length = function () {
                  return 65535 & this._bitField;
                }, O.prototype._isFateSealed = function () {
                  return 0 != (117506048 & this._bitField);
                }, O.prototype._isFollowing = function () {
                  return 67108864 == (67108864 & this._bitField);
                }, O.prototype._setLength = function (t) {
                  this._bitField = -65536 & this._bitField | 65535 & t;
                }, O.prototype._setFulfilled = function () {
                  this._bitField = 33554432 | this._bitField, this._fireEvent("promiseFulfilled", this);
                }, O.prototype._setRejected = function () {
                  this._bitField = 16777216 | this._bitField, this._fireEvent("promiseRejected", this);
                }, O.prototype._setFollowing = function () {
                  this._bitField = 67108864 | this._bitField, this._fireEvent("promiseResolved", this);
                }, O.prototype._setIsFinal = function () {
                  this._bitField = 4194304 | this._bitField;
                }, O.prototype._isFinal = function () {
                  return (4194304 & this._bitField) > 0;
                }, O.prototype._unsetCancelled = function () {
                  this._bitField = -65537 & this._bitField;
                }, O.prototype._setCancelled = function () {
                  this._bitField = 65536 | this._bitField, this._fireEvent("promiseCancelled", this);
                }, O.prototype._setWillBeCancelled = function () {
                  this._bitField = 8388608 | this._bitField;
                }, O.prototype._setAsyncGuaranteed = function () {
                  if (!d.hasCustomScheduler()) {
                    var t = this._bitField;
                    this._bitField = t | (536870912 & t) >> 2 ^ 134217728;
                  }
                }, O.prototype._setNoAsyncGuarantee = function () {
                  this._bitField = -134217729 & (536870912 | this._bitField);
                }, O.prototype._receiverAt = function (t) {
                  var e = 0 === t ? this._receiver0 : this[4 * t - 4 + 3];
                  if (e !== s) return void 0 === e && this._isBound() ? this._boundValue() : e;
                }, O.prototype._promiseAt = function (t) {
                  return this[4 * t - 4 + 2];
                }, O.prototype._fulfillmentHandlerAt = function (t) {
                  return this[4 * t - 4 + 0];
                }, O.prototype._rejectionHandlerAt = function (t) {
                  return this[4 * t - 4 + 1];
                }, O.prototype._boundValue = function () {}, O.prototype._migrateCallback0 = function (t) {
                  t._bitField;

                  var e = t._fulfillmentHandler0,
                      n = t._rejectionHandler0,
                      r = t._promise0,
                      i = t._receiverAt(0);

                  void 0 === i && (i = s), this._addCallbacks(e, n, r, i, null);
                }, O.prototype._migrateCallbackAt = function (t, e) {
                  var n = t._fulfillmentHandlerAt(e),
                      r = t._rejectionHandlerAt(e),
                      i = t._promiseAt(e),
                      o = t._receiverAt(e);

                  void 0 === o && (o = s), this._addCallbacks(n, r, i, o, null);
                }, O.prototype._addCallbacks = function (t, e, n, r, i) {
                  var o = this._length();

                  if (o >= 65531 && (o = 0, this._setLength(0)), 0 === o) this._promise0 = n, this._receiver0 = r, "function" == typeof t && (this._fulfillmentHandler0 = a.contextBind(i, t)), "function" == typeof e && (this._rejectionHandler0 = a.contextBind(i, e));else {
                    var s = 4 * o - 4;
                    this[s + 2] = n, this[s + 3] = r, "function" == typeof t && (this[s + 0] = a.contextBind(i, t)), "function" == typeof e && (this[s + 1] = a.contextBind(i, e));
                  }
                  return this._setLength(o + 1), o;
                }, O.prototype._proxy = function (t, e) {
                  this._addCallbacks(void 0, void 0, e, t, null);
                }, O.prototype._resolveCallback = function (t, e) {
                  if (0 == (117506048 & this._bitField)) {
                    if (t === this) return this._rejectCallback(n(), !1);
                    var r = C(t, this);
                    if (!(r instanceof O)) return this._fulfill(t);
                    e && this._propagateFrom(r, 2);

                    var i = r._target();

                    if (i !== this) {
                      var o = i._bitField;

                      if (0 == (50397184 & o)) {
                        var s = this._length();

                        s > 0 && i._migrateCallback0(this);

                        for (var a = 1; a < s; ++a) {
                          i._migrateCallbackAt(this, a);
                        }

                        this._setFollowing(), this._setLength(0), this._setFollowee(r);
                      } else if (0 != (33554432 & o)) this._fulfill(i._value());else if (0 != (16777216 & o)) this._reject(i._reason());else {
                        var c = new g("late cancellation observer");
                        i._attachExtraTrace(c), this._reject(c);
                      }
                    } else this._reject(n());
                  }
                }, O.prototype._rejectCallback = function (t, e, n) {
                  var r = a.ensureErrorObject(t),
                      i = r === t;

                  if (!i && !n && F.warnings()) {
                    var o = "a promise was rejected with a non-error: " + a.classString(t);

                    this._warn(o, !0);
                  }

                  this._attachExtraTrace(r, !!e && i), this._reject(t);
                }, O.prototype._resolveFromExecutor = function (t) {
                  if (t !== m) {
                    var e = this;
                    this._captureStackTrace(), this._pushContext();

                    var n = !0,
                        r = this._execute(t, function (t) {
                      e._resolveCallback(t);
                    }, function (t) {
                      e._rejectCallback(t, n);
                    });

                    n = !1, this._popContext(), void 0 !== r && e._rejectCallback(r, !0);
                  }
                }, O.prototype._settlePromiseFromHandler = function (t, e, n, r) {
                  var i = r._bitField;

                  if (0 == (65536 & i)) {
                    var o;
                    r._pushContext(), e === b ? n && "number" == typeof n.length ? o = S(t).apply(this._boundValue(), n) : (o = R).e = new y("cannot .spread() a non-array: " + a.classString(n)) : o = S(t).call(e, n);

                    var s = r._popContext();

                    0 == (65536 & (i = r._bitField)) && (o === w ? r._reject(n) : o === R ? r._rejectCallback(o.e, !1) : (F.checkForgottenReturns(o, s, "", r, this), r._resolveCallback(o)));
                  }
                }, O.prototype._target = function () {
                  for (var t = this; t._isFollowing();) {
                    t = t._followee();
                  }

                  return t;
                }, O.prototype._followee = function () {
                  return this._rejectionHandler0;
                }, O.prototype._setFollowee = function (t) {
                  this._rejectionHandler0 = t;
                }, O.prototype._settlePromise = function (t, e, n, i) {
                  var s = t instanceof O,
                      a = this._bitField,
                      c = 0 != (134217728 & a);
                  0 != (65536 & a) ? (s && t._invokeInternalOnCancel(), n instanceof x && n.isFinallyHandler() ? (n.cancelPromise = t, S(e).call(n, i) === R && t._reject(R.e)) : e === r ? t._fulfill(r.call(n)) : n instanceof o ? n._promiseCancelled(t) : s || t instanceof j ? t._cancel() : n.cancel()) : "function" == typeof e ? s ? (c && t._setAsyncGuaranteed(), this._settlePromiseFromHandler(e, n, i, t)) : e.call(n, i, t) : n instanceof o ? n._isResolved() || (0 != (33554432 & a) ? n._promiseFulfilled(i, t) : n._promiseRejected(i, t)) : s && (c && t._setAsyncGuaranteed(), 0 != (33554432 & a) ? t._fulfill(i) : t._reject(i));
                }, O.prototype._settlePromiseLateCancellationObserver = function (t) {
                  var e = t.handler,
                      n = t.promise,
                      r = t.receiver,
                      i = t.value;
                  "function" == typeof e ? n instanceof O ? this._settlePromiseFromHandler(e, r, i, n) : e.call(r, i, n) : n instanceof O && n._reject(i);
                }, O.prototype._settlePromiseCtx = function (t) {
                  this._settlePromise(t.promise, t.handler, t.receiver, t.value);
                }, O.prototype._settlePromise0 = function (t, e, n) {
                  var r = this._promise0,
                      i = this._receiverAt(0);

                  this._promise0 = void 0, this._receiver0 = void 0, this._settlePromise(r, t, i, e);
                }, O.prototype._clearCallbackDataAtIndex = function (t) {
                  var e = 4 * t - 4;
                  this[e + 2] = this[e + 3] = this[e + 0] = this[e + 1] = void 0;
                }, O.prototype._fulfill = function (t) {
                  var e = this._bitField;

                  if (!((117506048 & e) >>> 16)) {
                    if (t === this) {
                      var r = n();
                      return this._attachExtraTrace(r), this._reject(r);
                    }

                    this._setFulfilled(), this._rejectionHandler0 = t, (65535 & e) > 0 && (0 != (134217728 & e) ? this._settlePromises() : d.settlePromises(this), this._dereferenceTrace());
                  }
                }, O.prototype._reject = function (t) {
                  var e = this._bitField;

                  if (!((117506048 & e) >>> 16)) {
                    if (this._setRejected(), this._fulfillmentHandler0 = t, this._isFinal()) return d.fatalError(t, a.isNode);
                    (65535 & e) > 0 ? d.settlePromises(this) : this._ensurePossibleRejectionHandled();
                  }
                }, O.prototype._fulfillPromises = function (t, e) {
                  for (var n = 1; n < t; n++) {
                    var r = this._fulfillmentHandlerAt(n),
                        i = this._promiseAt(n),
                        o = this._receiverAt(n);

                    this._clearCallbackDataAtIndex(n), this._settlePromise(i, r, o, e);
                  }
                }, O.prototype._rejectPromises = function (t, e) {
                  for (var n = 1; n < t; n++) {
                    var r = this._rejectionHandlerAt(n),
                        i = this._promiseAt(n),
                        o = this._receiverAt(n);

                    this._clearCallbackDataAtIndex(n), this._settlePromise(i, r, o, e);
                  }
                }, O.prototype._settlePromises = function () {
                  var t = this._bitField,
                      e = 65535 & t;

                  if (e > 0) {
                    if (0 != (16842752 & t)) {
                      var n = this._fulfillmentHandler0;
                      this._settlePromise0(this._rejectionHandler0, n, t), this._rejectPromises(e, n);
                    } else {
                      var r = this._rejectionHandler0;
                      this._settlePromise0(this._fulfillmentHandler0, r, t), this._fulfillPromises(e, r);
                    }

                    this._setLength(0);
                  }

                  this._clearCancellationData();
                }, O.prototype._settledValue = function () {
                  var t = this._bitField;
                  return 0 != (33554432 & t) ? this._rejectionHandler0 : 0 != (16777216 & t) ? this._fulfillmentHandler0 : void 0;
                }, "undefined" != typeof Symbol && Symbol.toStringTag && h.defineProperty(O.prototype, Symbol.toStringTag, {
                  get: function get() {
                    return "Object";
                  }
                }), O.defer = O.pending = function () {
                  return F.deprecated("Promise.defer", "new Promise"), {
                    promise: new O(m),
                    resolve: A,
                    reject: H
                  };
                }, a.notEnumerableProp(O, "_makeSelfResolutionError", n), t("./method")(O, m, C, i, F), t("./bind")(O, m, C, F), t("./cancel")(O, j, i, F), t("./direct_resolve")(O), t("./synchronous_inspection")(O), t("./join")(O, j, C, m, d), O.Promise = O, O.version = "3.7.2", t("./call_get.js")(O), t("./generators.js")(O, i, m, C, o, F), t("./map.js")(O, j, i, C, m, F), t("./nodeify.js")(O), t("./promisify.js")(O, m), t("./props.js")(O, j, C, i), t("./race.js")(O, m, C, i), t("./reduce.js")(O, j, i, C, m, F), t("./settle.js")(O, j, F), t("./some.js")(O, j, i), t("./timers.js")(O, m, F), t("./using.js")(O, i, C, E, m, F), t("./any.js")(O), t("./each.js")(O, m), t("./filter.js")(O, m), a.toFastProperties(O), a.toFastProperties(O.prototype), V({
                  a: 1
                }), V({
                  b: 2
                }), V({
                  c: 3
                }), V(1), V(function () {}), V(void 0), V(!1), V(new O(m)), F.setBounds(_.firstLineError, a.lastLineError), O;
              };
            }, {
              "./any.js": 1,
              "./async": 2,
              "./bind": 3,
              "./call_get.js": 5,
              "./cancel": 6,
              "./catch_filter": 7,
              "./context": 8,
              "./debuggability": 9,
              "./direct_resolve": 10,
              "./each.js": 11,
              "./errors": 12,
              "./es5": 13,
              "./filter.js": 14,
              "./finally": 15,
              "./generators.js": 16,
              "./join": 17,
              "./map.js": 18,
              "./method": 19,
              "./nodeback": 20,
              "./nodeify.js": 21,
              "./promise_array": 23,
              "./promisify.js": 24,
              "./props.js": 25,
              "./race.js": 27,
              "./reduce.js": 28,
              "./settle.js": 30,
              "./some.js": 31,
              "./synchronous_inspection": 32,
              "./thenables": 33,
              "./timers.js": 34,
              "./using.js": 35,
              "./util": 36,
              async_hooks: void 0
            }],
            23: [function (t, e, n) {
              "use strict";

              e.exports = function (e, n, r, i, o) {
                var s = t("./util");
                s.isArray;

                function a(t) {
                  var r = this._promise = new e(n);
                  t instanceof e && (r._propagateFrom(t, 3), t.suppressUnhandledRejections()), r._setOnCancel(this), this._values = t, this._length = 0, this._totalResolved = 0, this._init(void 0, -2);
                }

                return s.inherits(a, o), a.prototype.length = function () {
                  return this._length;
                }, a.prototype.promise = function () {
                  return this._promise;
                }, a.prototype._init = function t(n, o) {
                  var a = r(this._values, this._promise);

                  if (a instanceof e) {
                    var c = (a = a._target())._bitField;

                    if (this._values = a, 0 == (50397184 & c)) return this._promise._setAsyncGuaranteed(), a._then(t, this._reject, void 0, this, o);
                    if (0 == (33554432 & c)) return 0 != (16777216 & c) ? this._reject(a._reason()) : this._cancel();
                    a = a._value();
                  }

                  if (null !== (a = s.asArray(a))) 0 !== a.length ? this._iterate(a) : -5 === o ? this._resolveEmptyArray() : this._resolve(function (t) {
                    switch (t) {
                      case -2:
                        return [];

                      case -3:
                        return {};

                      case -6:
                        return new Map();
                    }
                  }(o));else {
                    var l = i("expecting an array or an iterable object but got " + s.classString(a)).reason();

                    this._promise._rejectCallback(l, !1);
                  }
                }, a.prototype._iterate = function (t) {
                  var n = this.getActualLength(t.length);
                  this._length = n, this._values = this.shouldCopyValues() ? new Array(n) : this._values;

                  for (var i = this._promise, o = !1, s = null, a = 0; a < n; ++a) {
                    var c = r(t[a], i);
                    s = c instanceof e ? (c = c._target())._bitField : null, o ? null !== s && c.suppressUnhandledRejections() : null !== s ? 0 == (50397184 & s) ? (c._proxy(this, a), this._values[a] = c) : o = 0 != (33554432 & s) ? this._promiseFulfilled(c._value(), a) : 0 != (16777216 & s) ? this._promiseRejected(c._reason(), a) : this._promiseCancelled(a) : o = this._promiseFulfilled(c, a);
                  }

                  o || i._setAsyncGuaranteed();
                }, a.prototype._isResolved = function () {
                  return null === this._values;
                }, a.prototype._resolve = function (t) {
                  this._values = null, this._promise._fulfill(t);
                }, a.prototype._cancel = function () {
                  !this._isResolved() && this._promise._isCancellable() && (this._values = null, this._promise._cancel());
                }, a.prototype._reject = function (t) {
                  this._values = null, this._promise._rejectCallback(t, !1);
                }, a.prototype._promiseFulfilled = function (t, e) {
                  return this._values[e] = t, ++this._totalResolved >= this._length && (this._resolve(this._values), !0);
                }, a.prototype._promiseCancelled = function () {
                  return this._cancel(), !0;
                }, a.prototype._promiseRejected = function (t) {
                  return this._totalResolved++, this._reject(t), !0;
                }, a.prototype._resultCancelled = function () {
                  if (!this._isResolved()) {
                    var t = this._values;
                    if (this._cancel(), t instanceof e) t.cancel();else for (var n = 0; n < t.length; ++n) {
                      t[n] instanceof e && t[n].cancel();
                    }
                  }
                }, a.prototype.shouldCopyValues = function () {
                  return !0;
                }, a.prototype.getActualLength = function (t) {
                  return t;
                }, a;
              };
            }, {
              "./util": 36
            }],
            24: [function (t, e, n) {
              "use strict";

              e.exports = function (e, n) {
                var r = {},
                    i = t("./util"),
                    o = t("./nodeback"),
                    s = i.withAppended,
                    a = i.maybeWrapAsError,
                    c = i.canEvaluate,
                    l = t("./errors").TypeError,
                    u = {
                  __isPromisified__: !0
                },
                    p = new RegExp("^(?:" + ["arity", "length", "name", "arguments", "caller", "callee", "prototype", "__isPromisified__"].join("|") + ")$"),
                    f = function f(t) {
                  return i.isIdentifier(t) && "_" !== t.charAt(0) && "constructor" !== t;
                };

                function h(t) {
                  return !p.test(t);
                }

                function _(t) {
                  try {
                    return !0 === t.__isPromisified__;
                  } catch (t) {
                    return !1;
                  }
                }

                function d(t, e, n) {
                  var r = i.getDataPropertyOrDefault(t, e + n, u);
                  return !!r && _(r);
                }

                function v(t, e, n, r) {
                  for (var o = i.inheritedDataKeys(t), s = [], a = 0; a < o.length; ++a) {
                    var c = o[a],
                        u = t[c],
                        p = r === f || f(c, u, t);
                    "function" != typeof u || _(u) || d(t, c, e) || !r(c, u, t, p) || s.push(c, u);
                  }

                  return function (t, e, n) {
                    for (var r = 0; r < t.length; r += 2) {
                      var i = t[r];
                      if (n.test(i)) for (var o = i.replace(n, ""), s = 0; s < t.length; s += 2) {
                        if (t[s] === o) throw new l("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s", e));
                      }
                    }
                  }(s, e, n), s;
                }

                var y,
                    g = function g(t) {
                  return t.replace(/([$])/, "\\$");
                };

                var m = c ? y : function (t, c, l, u, p, f) {
                  var h = function () {
                    return this;
                  }(),
                      _ = t;

                  function d() {
                    var i = c;
                    c === r && (i = this);
                    var l = new e(n);

                    l._captureStackTrace();

                    var u = "string" == typeof _ && this !== h ? this[_] : t,
                        p = o(l, f);

                    try {
                      u.apply(i, s(arguments, p));
                    } catch (t) {
                      l._rejectCallback(a(t), !0, !0);
                    }

                    return l._isFateSealed() || l._setAsyncGuaranteed(), l;
                  }

                  return "string" == typeof _ && (t = u), i.notEnumerableProp(d, "__isPromisified__", !0), d;
                };

                function b(t, e, n, o, s) {
                  for (var a = new RegExp(g(e) + "$"), c = v(t, e, a, n), l = 0, u = c.length; l < u; l += 2) {
                    var p = c[l],
                        f = c[l + 1],
                        h = p + e;
                    if (o === m) t[h] = m(p, r, p, f, e, s);else {
                      var _ = o(f, function () {
                        return m(p, r, p, f, e, s);
                      });

                      i.notEnumerableProp(_, "__isPromisified__", !0), t[h] = _;
                    }
                  }

                  return i.toFastProperties(t), t;
                }

                e.promisify = function (t, e) {
                  if ("function" != typeof t) throw new l("expecting a function but got " + i.classString(t));
                  if (_(t)) return t;

                  var n = function (t, e, n) {
                    return m(t, e, void 0, t, null, n);
                  }(t, void 0 === (e = Object(e)).context ? r : e.context, !!e.multiArgs);

                  return i.copyDescriptors(t, n, h), n;
                }, e.promisifyAll = function (t, e) {
                  if ("function" != typeof t && "object" != _typeof2(t)) throw new l("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");
                  var n = !!(e = Object(e)).multiArgs,
                      r = e.suffix;
                  "string" != typeof r && (r = "Async");
                  var o = e.filter;
                  "function" != typeof o && (o = f);
                  var s = e.promisifier;
                  if ("function" != typeof s && (s = m), !i.isIdentifier(r)) throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");

                  for (var a = i.inheritedDataKeys(t), c = 0; c < a.length; ++c) {
                    var u = t[a[c]];
                    "constructor" !== a[c] && i.isClass(u) && (b(u.prototype, r, o, s, n), b(u, r, o, s, n));
                  }

                  return b(t, r, o, s, n);
                };
              };
            }, {
              "./errors": 12,
              "./nodeback": 20,
              "./util": 36
            }],
            25: [function (t, e, n) {
              "use strict";

              e.exports = function (e, n, r, i) {
                var o,
                    s = t("./util"),
                    a = s.isObject,
                    c = t("./es5");
                "function" == typeof Map && (o = Map);

                var l = function () {
                  var t = 0,
                      e = 0;

                  function n(n, r) {
                    this[t] = n, this[t + e] = r, t++;
                  }

                  return function (r) {
                    e = r.size, t = 0;
                    var i = new Array(2 * r.size);
                    return r.forEach(n, i), i;
                  };
                }();

                function u(t) {
                  var e,
                      n = !1;
                  if (void 0 !== o && t instanceof o) e = l(t), n = !0;else {
                    var r = c.keys(t),
                        i = r.length;
                    e = new Array(2 * i);

                    for (var s = 0; s < i; ++s) {
                      var a = r[s];
                      e[s] = t[a], e[s + i] = a;
                    }
                  }
                  this.constructor$(e), this._isMap = n, this._init$(void 0, n ? -6 : -3);
                }

                function p(t) {
                  var n,
                      o = r(t);
                  return a(o) ? (n = o instanceof e ? o._then(e.props, void 0, void 0, void 0, void 0) : new u(o).promise(), o instanceof e && n._propagateFrom(o, 2), n) : i("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n");
                }

                s.inherits(u, n), u.prototype._init = function () {}, u.prototype._promiseFulfilled = function (t, e) {
                  if (this._values[e] = t, ++this._totalResolved >= this._length) {
                    var n;
                    if (this._isMap) n = function (t) {
                      for (var e = new o(), n = t.length / 2 | 0, r = 0; r < n; ++r) {
                        var i = t[n + r],
                            s = t[r];
                        e.set(i, s);
                      }

                      return e;
                    }(this._values);else {
                      n = {};

                      for (var r = this.length(), i = 0, s = this.length(); i < s; ++i) {
                        n[this._values[i + r]] = this._values[i];
                      }
                    }
                    return this._resolve(n), !0;
                  }

                  return !1;
                }, u.prototype.shouldCopyValues = function () {
                  return !1;
                }, u.prototype.getActualLength = function (t) {
                  return t >> 1;
                }, e.prototype.props = function () {
                  return p(this);
                }, e.props = function (t) {
                  return p(t);
                };
              };
            }, {
              "./es5": 13,
              "./util": 36
            }],
            26: [function (t, e, n) {
              "use strict";

              function r(t) {
                this._capacity = t, this._length = 0, this._front = 0;
              }

              r.prototype._willBeOverCapacity = function (t) {
                return this._capacity < t;
              }, r.prototype._pushOne = function (t) {
                var e = this.length();
                this._checkCapacity(e + 1), this[this._front + e & this._capacity - 1] = t, this._length = e + 1;
              }, r.prototype.push = function (t, e, n) {
                var r = this.length() + 3;
                if (this._willBeOverCapacity(r)) return this._pushOne(t), this._pushOne(e), void this._pushOne(n);
                var i = this._front + r - 3;

                this._checkCapacity(r);

                var o = this._capacity - 1;
                this[i + 0 & o] = t, this[i + 1 & o] = e, this[i + 2 & o] = n, this._length = r;
              }, r.prototype.shift = function () {
                var t = this._front,
                    e = this[t];
                return this[t] = void 0, this._front = t + 1 & this._capacity - 1, this._length--, e;
              }, r.prototype.length = function () {
                return this._length;
              }, r.prototype._checkCapacity = function (t) {
                this._capacity < t && this._resizeTo(this._capacity << 1);
              }, r.prototype._resizeTo = function (t) {
                var e = this._capacity;
                this._capacity = t, function (t, e, n, r, i) {
                  for (var o = 0; o < i; ++o) {
                    n[o + r] = t[o + e], t[o + e] = void 0;
                  }
                }(this, 0, this, e, this._front + this._length & e - 1);
              }, e.exports = r;
            }, {}],
            27: [function (t, e, n) {
              "use strict";

              e.exports = function (e, n, r, i) {
                var o = t("./util"),
                    s = function s(t) {
                  return t.then(function (e) {
                    return a(e, t);
                  });
                };

                function a(t, a) {
                  var c = r(t);
                  if (c instanceof e) return s(c);
                  if (null === (t = o.asArray(t))) return i("expecting an array or an iterable object but got " + o.classString(t));
                  var l = new e(n);
                  void 0 !== a && l._propagateFrom(a, 3);

                  for (var u = l._fulfill, p = l._reject, f = 0, h = t.length; f < h; ++f) {
                    var _ = t[f];
                    (void 0 !== _ || f in t) && e.cast(_)._then(u, p, void 0, l, null);
                  }

                  return l;
                }

                e.race = function (t) {
                  return a(t, void 0);
                }, e.prototype.race = function () {
                  return a(this, void 0);
                };
              };
            }, {
              "./util": 36
            }],
            28: [function (t, e, n) {
              "use strict";

              e.exports = function (e, n, r, i, o, s) {
                var a = t("./util"),
                    c = a.tryCatch;

                function l(t, n, r, i) {
                  this.constructor$(t);

                  var s = e._getContext();

                  this._fn = a.contextBind(s, n), void 0 !== r && (r = e.resolve(r))._attachCancellationCallback(this), this._initialValue = r, this._currentCancellable = null, this._eachValues = i === o ? Array(this._length) : 0 === i ? null : void 0, this._promise._captureStackTrace(), this._init$(void 0, -5);
                }

                function u(t, e) {
                  this.isFulfilled() ? e._resolve(t) : e._reject(t);
                }

                function p(t, e, n, i) {
                  return "function" != typeof e ? r("expecting a function but got " + a.classString(e)) : new l(t, e, n, i).promise();
                }

                function f(t) {
                  this.accum = t, this.array._gotAccum(t);
                  var n = i(this.value, this.array._promise);
                  return n instanceof e ? (this.array._currentCancellable = n, n._then(h, void 0, void 0, this, void 0)) : h.call(this, n);
                }

                function h(t) {
                  var n,
                      r = this.array,
                      i = r._promise,
                      o = c(r._fn);
                  i._pushContext(), (n = void 0 !== r._eachValues ? o.call(i._boundValue(), t, this.index, this.length) : o.call(i._boundValue(), this.accum, t, this.index, this.length)) instanceof e && (r._currentCancellable = n);

                  var a = i._popContext();

                  return s.checkForgottenReturns(n, a, void 0 !== r._eachValues ? "Promise.each" : "Promise.reduce", i), n;
                }

                a.inherits(l, n), l.prototype._gotAccum = function (t) {
                  void 0 !== this._eachValues && null !== this._eachValues && t !== o && this._eachValues.push(t);
                }, l.prototype._eachComplete = function (t) {
                  return null !== this._eachValues && this._eachValues.push(t), this._eachValues;
                }, l.prototype._init = function () {}, l.prototype._resolveEmptyArray = function () {
                  this._resolve(void 0 !== this._eachValues ? this._eachValues : this._initialValue);
                }, l.prototype.shouldCopyValues = function () {
                  return !1;
                }, l.prototype._resolve = function (t) {
                  this._promise._resolveCallback(t), this._values = null;
                }, l.prototype._resultCancelled = function (t) {
                  if (t === this._initialValue) return this._cancel();
                  this._isResolved() || (this._resultCancelled$(), this._currentCancellable instanceof e && this._currentCancellable.cancel(), this._initialValue instanceof e && this._initialValue.cancel());
                }, l.prototype._iterate = function (t) {
                  var n, r;
                  this._values = t;
                  var i = t.length;
                  void 0 !== this._initialValue ? (n = this._initialValue, r = 0) : (n = e.resolve(t[0]), r = 1), this._currentCancellable = n;

                  for (var o = r; o < i; ++o) {
                    var s = t[o];
                    s instanceof e && s.suppressUnhandledRejections();
                  }

                  if (!n.isRejected()) for (; r < i; ++r) {
                    var a = {
                      accum: null,
                      value: t[r],
                      index: r,
                      length: i,
                      array: this
                    };
                    n = n._then(f, void 0, void 0, a, void 0), 0 == (127 & r) && n._setNoAsyncGuarantee();
                  }
                  void 0 !== this._eachValues && (n = n._then(this._eachComplete, void 0, void 0, this, void 0)), n._then(u, u, void 0, n, this);
                }, e.prototype.reduce = function (t, e) {
                  return p(this, t, e, null);
                }, e.reduce = function (t, e, n, r) {
                  return p(t, e, n, r);
                };
              };
            }, {
              "./util": 36
            }],
            29: [function (t, e, n) {
              "use strict";

              var r,
                  i = t("./util"),
                  o = i.getNativePromise();

              if (i.isNode && "undefined" == typeof MutationObserver) {
                var s = global.setImmediate,
                    a = process.nextTick;
                r = i.isRecentNode ? function (t) {
                  s.call(global, t);
                } : function (t) {
                  a.call(process, t);
                };
              } else if ("function" == typeof o && "function" == typeof o.resolve) {
                var c = o.resolve();

                r = function r(t) {
                  c.then(t);
                };
              } else r = "undefined" != typeof MutationObserver && ("undefined" == typeof window || !window.navigator || !window.navigator.standalone && !window.cordova) && "classList" in document.documentElement ? function () {
                var t = document.createElement("div"),
                    e = {
                  attributes: !0
                },
                    n = !1,
                    r = document.createElement("div");
                new MutationObserver(function () {
                  t.classList.toggle("foo"), n = !1;
                }).observe(r, e);
                return function (i) {
                  var o = new MutationObserver(function () {
                    o.disconnect(), i();
                  });
                  o.observe(t, e), n || (n = !0, r.classList.toggle("foo"));
                };
              }() : "undefined" != typeof setImmediate ? function (t) {
                setImmediate(t);
              } : "undefined" != typeof setTimeout ? function (t) {
                setTimeout(t, 0);
              } : function () {
                throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
              };

              e.exports = r;
            }, {
              "./util": 36
            }],
            30: [function (t, e, n) {
              "use strict";

              e.exports = function (e, n, r) {
                var i = e.PromiseInspection;

                function o(t) {
                  this.constructor$(t);
                }

                t("./util").inherits(o, n), o.prototype._promiseResolved = function (t, e) {
                  return this._values[t] = e, ++this._totalResolved >= this._length && (this._resolve(this._values), !0);
                }, o.prototype._promiseFulfilled = function (t, e) {
                  var n = new i();
                  return n._bitField = 33554432, n._settledValueField = t, this._promiseResolved(e, n);
                }, o.prototype._promiseRejected = function (t, e) {
                  var n = new i();
                  return n._bitField = 16777216, n._settledValueField = t, this._promiseResolved(e, n);
                }, e.settle = function (t) {
                  return r.deprecated(".settle()", ".reflect()"), new o(t).promise();
                }, e.allSettled = function (t) {
                  return new o(t).promise();
                }, e.prototype.settle = function () {
                  return e.settle(this);
                };
              };
            }, {
              "./util": 36
            }],
            31: [function (t, e, n) {
              "use strict";

              e.exports = function (e, n, r) {
                var i = t("./util"),
                    o = t("./errors").RangeError,
                    s = t("./errors").AggregateError,
                    a = i.isArray,
                    c = {};

                function l(t) {
                  this.constructor$(t), this._howMany = 0, this._unwrap = !1, this._initialized = !1;
                }

                function u(t, e) {
                  if ((0 | e) !== e || e < 0) return r("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");
                  var n = new l(t),
                      i = n.promise();
                  return n.setHowMany(e), n.init(), i;
                }

                i.inherits(l, n), l.prototype._init = function () {
                  if (this._initialized) if (0 !== this._howMany) {
                    this._init$(void 0, -5);

                    var t = a(this._values);
                    !this._isResolved() && t && this._howMany > this._canPossiblyFulfill() && this._reject(this._getRangeError(this.length()));
                  } else this._resolve([]);
                }, l.prototype.init = function () {
                  this._initialized = !0, this._init();
                }, l.prototype.setUnwrap = function () {
                  this._unwrap = !0;
                }, l.prototype.howMany = function () {
                  return this._howMany;
                }, l.prototype.setHowMany = function (t) {
                  this._howMany = t;
                }, l.prototype._promiseFulfilled = function (t) {
                  return this._addFulfilled(t), this._fulfilled() === this.howMany() && (this._values.length = this.howMany(), 1 === this.howMany() && this._unwrap ? this._resolve(this._values[0]) : this._resolve(this._values), !0);
                }, l.prototype._promiseRejected = function (t) {
                  return this._addRejected(t), this._checkOutcome();
                }, l.prototype._promiseCancelled = function () {
                  return this._values instanceof e || null == this._values ? this._cancel() : (this._addRejected(c), this._checkOutcome());
                }, l.prototype._checkOutcome = function () {
                  if (this.howMany() > this._canPossiblyFulfill()) {
                    for (var t = new s(), e = this.length(); e < this._values.length; ++e) {
                      this._values[e] !== c && t.push(this._values[e]);
                    }

                    return t.length > 0 ? this._reject(t) : this._cancel(), !0;
                  }

                  return !1;
                }, l.prototype._fulfilled = function () {
                  return this._totalResolved;
                }, l.prototype._rejected = function () {
                  return this._values.length - this.length();
                }, l.prototype._addRejected = function (t) {
                  this._values.push(t);
                }, l.prototype._addFulfilled = function (t) {
                  this._values[this._totalResolved++] = t;
                }, l.prototype._canPossiblyFulfill = function () {
                  return this.length() - this._rejected();
                }, l.prototype._getRangeError = function (t) {
                  var e = "Input array must contain at least " + this._howMany + " items but contains only " + t + " items";
                  return new o(e);
                }, l.prototype._resolveEmptyArray = function () {
                  this._reject(this._getRangeError(0));
                }, e.some = function (t, e) {
                  return u(t, e);
                }, e.prototype.some = function (t) {
                  return u(this, t);
                }, e._SomePromiseArray = l;
              };
            }, {
              "./errors": 12,
              "./util": 36
            }],
            32: [function (t, e, n) {
              "use strict";

              e.exports = function (t) {
                function e(t) {
                  void 0 !== t ? (t = t._target(), this._bitField = t._bitField, this._settledValueField = t._isFateSealed() ? t._settledValue() : void 0) : (this._bitField = 0, this._settledValueField = void 0);
                }

                e.prototype._settledValue = function () {
                  return this._settledValueField;
                };

                var n = e.prototype.value = function () {
                  if (!this.isFulfilled()) throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");
                  return this._settledValue();
                },
                    r = e.prototype.error = e.prototype.reason = function () {
                  if (!this.isRejected()) throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");
                  return this._settledValue();
                },
                    i = e.prototype.isFulfilled = function () {
                  return 0 != (33554432 & this._bitField);
                },
                    o = e.prototype.isRejected = function () {
                  return 0 != (16777216 & this._bitField);
                },
                    s = e.prototype.isPending = function () {
                  return 0 == (50397184 & this._bitField);
                },
                    a = e.prototype.isResolved = function () {
                  return 0 != (50331648 & this._bitField);
                };

                e.prototype.isCancelled = function () {
                  return 0 != (8454144 & this._bitField);
                }, t.prototype.__isCancelled = function () {
                  return 65536 == (65536 & this._bitField);
                }, t.prototype._isCancelled = function () {
                  return this._target().__isCancelled();
                }, t.prototype.isCancelled = function () {
                  return 0 != (8454144 & this._target()._bitField);
                }, t.prototype.isPending = function () {
                  return s.call(this._target());
                }, t.prototype.isRejected = function () {
                  return o.call(this._target());
                }, t.prototype.isFulfilled = function () {
                  return i.call(this._target());
                }, t.prototype.isResolved = function () {
                  return a.call(this._target());
                }, t.prototype.value = function () {
                  return n.call(this._target());
                }, t.prototype.reason = function () {
                  var t = this._target();

                  return t._unsetRejectionIsUnhandled(), r.call(t);
                }, t.prototype._value = function () {
                  return this._settledValue();
                }, t.prototype._reason = function () {
                  return this._unsetRejectionIsUnhandled(), this._settledValue();
                }, t.PromiseInspection = e;
              };
            }, {}],
            33: [function (t, e, n) {
              "use strict";

              e.exports = function (e, n) {
                var r = t("./util"),
                    i = r.errorObj,
                    o = r.isObject;
                var s = {}.hasOwnProperty;
                return function (t, a) {
                  if (o(t)) {
                    if (t instanceof e) return t;

                    var c = function (t) {
                      try {
                        return function (t) {
                          return t.then;
                        }(t);
                      } catch (t) {
                        return i.e = t, i;
                      }
                    }(t);

                    if (c === i) {
                      a && a._pushContext();
                      var l = e.reject(c.e);
                      return a && a._popContext(), l;
                    }

                    if ("function" == typeof c) return function (t) {
                      try {
                        return s.call(t, "_promise0");
                      } catch (t) {
                        return !1;
                      }
                    }(t) ? (l = new e(n), t._then(l._fulfill, l._reject, void 0, l, null), l) : function (t, o, s) {
                      var a = new e(n),
                          c = a;
                      s && s._pushContext(), a._captureStackTrace(), s && s._popContext();
                      var l = !0,
                          u = r.tryCatch(o).call(t, function (t) {
                        a && (a._resolveCallback(t), a = null);
                      }, function (t) {
                        a && (a._rejectCallback(t, l, !0), a = null);
                      });
                      return l = !1, a && u === i && (a._rejectCallback(u.e, !0, !0), a = null), c;
                    }(t, c, a);
                  }

                  return t;
                };
              };
            }, {
              "./util": 36
            }],
            34: [function (t, e, n) {
              "use strict";

              e.exports = function (e, n, r) {
                var i = t("./util"),
                    o = e.TimeoutError;

                function s(t) {
                  this.handle = t;
                }

                s.prototype._resultCancelled = function () {
                  clearTimeout(this.handle);
                };

                var a = function a(t) {
                  return c(+this).thenReturn(t);
                },
                    c = e.delay = function (t, i) {
                  var o, c;
                  return void 0 !== i ? (o = e.resolve(i)._then(a, null, null, t, void 0), r.cancellation() && i instanceof e && o._setOnCancel(i)) : (o = new e(n), c = setTimeout(function () {
                    o._fulfill();
                  }, +t), r.cancellation() && o._setOnCancel(new s(c)), o._captureStackTrace()), o._setAsyncGuaranteed(), o;
                };

                e.prototype.delay = function (t) {
                  return c(t, this);
                };

                function l(t) {
                  return clearTimeout(this.handle), t;
                }

                function u(t) {
                  throw clearTimeout(this.handle), t;
                }

                e.prototype.timeout = function (t, e) {
                  var n, a;
                  t = +t;
                  var c = new s(setTimeout(function () {
                    n.isPending() && function (t, e, n) {
                      var r;
                      r = "string" != typeof e ? e instanceof Error ? e : new o("operation timed out") : new o(e), i.markAsOriginatingFromRejection(r), t._attachExtraTrace(r), t._reject(r), null != n && n.cancel();
                    }(n, e, a);
                  }, t));
                  return r.cancellation() ? (a = this.then(), (n = a._then(l, u, void 0, c, void 0))._setOnCancel(c)) : n = this._then(l, u, void 0, c, void 0), n;
                };
              };
            }, {
              "./util": 36
            }],
            35: [function (t, e, n) {
              "use strict";

              e.exports = function (e, n, r, i, o, s) {
                var a = t("./util"),
                    c = t("./errors").TypeError,
                    l = t("./util").inherits,
                    u = a.errorObj,
                    p = a.tryCatch,
                    f = {};

                function h(t) {
                  setTimeout(function () {
                    throw t;
                  }, 0);
                }

                function _(t, n) {
                  var i = 0,
                      s = t.length,
                      a = new e(o);
                  return function o() {
                    if (i >= s) return a._fulfill();

                    var c = function (t) {
                      var e = r(t);
                      return e !== t && "function" == typeof t._isDisposable && "function" == typeof t._getDisposer && t._isDisposable() && e._setDisposable(t._getDisposer()), e;
                    }(t[i++]);

                    if (c instanceof e && c._isDisposable()) {
                      try {
                        c = r(c._getDisposer().tryDispose(n), t.promise);
                      } catch (t) {
                        return h(t);
                      }

                      if (c instanceof e) return c._then(o, h, null, null, null);
                    }

                    o();
                  }(), a;
                }

                function d(t, e, n) {
                  this._data = t, this._promise = e, this._context = n;
                }

                function v(t, e, n) {
                  this.constructor$(t, e, n);
                }

                function y(t) {
                  return d.isDisposer(t) ? (this.resources[this.index]._setDisposable(t), t.promise()) : t;
                }

                function g(t) {
                  this.length = t, this.promise = null, this[t - 1] = null;
                }

                d.prototype.data = function () {
                  return this._data;
                }, d.prototype.promise = function () {
                  return this._promise;
                }, d.prototype.resource = function () {
                  return this.promise().isFulfilled() ? this.promise().value() : f;
                }, d.prototype.tryDispose = function (t) {
                  var e = this.resource(),
                      n = this._context;
                  void 0 !== n && n._pushContext();
                  var r = e !== f ? this.doDispose(e, t) : null;
                  return void 0 !== n && n._popContext(), this._promise._unsetDisposable(), this._data = null, r;
                }, d.isDisposer = function (t) {
                  return null != t && "function" == typeof t.resource && "function" == typeof t.tryDispose;
                }, l(v, d), v.prototype.doDispose = function (t, e) {
                  return this.data().call(t, t, e);
                }, g.prototype._resultCancelled = function () {
                  for (var t = this.length, n = 0; n < t; ++n) {
                    var r = this[n];
                    r instanceof e && r.cancel();
                  }
                }, e.using = function () {
                  var t = arguments.length;
                  if (t < 2) return n("you must pass at least 2 arguments to Promise.using");
                  var i,
                      o = arguments[t - 1];
                  if ("function" != typeof o) return n("expecting a function but got " + a.classString(o));
                  var c = !0;
                  2 === t && Array.isArray(arguments[0]) ? (t = (i = arguments[0]).length, c = !1) : (i = arguments, t--);

                  for (var l = new g(t), f = 0; f < t; ++f) {
                    var h = i[f];

                    if (d.isDisposer(h)) {
                      var v = h;

                      (h = h.promise())._setDisposable(v);
                    } else {
                      var m = r(h);
                      m instanceof e && (h = m._then(y, null, null, {
                        resources: l,
                        index: f
                      }, void 0));
                    }

                    l[f] = h;
                  }

                  var b = new Array(l.length);

                  for (f = 0; f < b.length; ++f) {
                    b[f] = e.resolve(l[f]).reflect();
                  }

                  var w = e.all(b).then(function (t) {
                    for (var e = 0; e < t.length; ++e) {
                      var n = t[e];
                      if (n.isRejected()) return u.e = n.error(), u;
                      if (!n.isFulfilled()) return void w.cancel();
                      t[e] = n.value();
                    }

                    C._pushContext(), o = p(o);

                    var r = c ? o.apply(void 0, t) : o(t),
                        i = C._popContext();

                    return s.checkForgottenReturns(r, i, "Promise.using", C), r;
                  }),
                      C = w.lastly(function () {
                    var t = new e.PromiseInspection(w);
                    return _(l, t);
                  });
                  return l.promise = C, C._setOnCancel(l), C;
                }, e.prototype._setDisposable = function (t) {
                  this._bitField = 131072 | this._bitField, this._disposer = t;
                }, e.prototype._isDisposable = function () {
                  return (131072 & this._bitField) > 0;
                }, e.prototype._getDisposer = function () {
                  return this._disposer;
                }, e.prototype._unsetDisposable = function () {
                  this._bitField = -131073 & this._bitField, this._disposer = void 0;
                }, e.prototype.disposer = function (t) {
                  if ("function" == typeof t) return new v(t, this, i());
                  throw new c();
                };
              };
            }, {
              "./errors": 12,
              "./util": 36
            }],
            36: [function (t, e, n) {
              "use strict";

              var r = t("./es5"),
                  i = "undefined" == typeof navigator,
                  o = {
                e: {}
              },
                  s,
                  a = "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : void 0 !== this ? this : null;

              function c() {
                try {
                  var t = s;
                  return s = null, t.apply(this, arguments);
                } catch (t) {
                  return o.e = t, o;
                }
              }

              function l(t) {
                return s = t, c;
              }

              var u = function u(t, e) {
                var n = {}.hasOwnProperty;

                function r() {
                  for (var r in this.constructor = t, this.constructor$ = e, e.prototype) {
                    n.call(e.prototype, r) && "$" !== r.charAt(r.length - 1) && (this[r + "$"] = e.prototype[r]);
                  }
                }

                return r.prototype = e.prototype, t.prototype = new r(), t.prototype;
              };

              function p(t) {
                return null == t || !0 === t || !1 === t || "string" == typeof t || "number" == typeof t;
              }

              function f(t) {
                return "function" == typeof t || "object" == _typeof2(t) && null !== t;
              }

              function h(t) {
                return p(t) ? new Error(E(t)) : t;
              }

              function _(t, e) {
                var n,
                    r = t.length,
                    i = new Array(r + 1);

                for (n = 0; n < r; ++n) {
                  i[n] = t[n];
                }

                return i[n] = e, i;
              }

              function d(t, e, n) {
                if (!r.isES5) return {}.hasOwnProperty.call(t, e) ? t[e] : void 0;
                var i = Object.getOwnPropertyDescriptor(t, e);
                return null != i ? null == i.get && null == i.set ? i.value : n : void 0;
              }

              function v(t, e, n) {
                if (p(t)) return t;
                var i = {
                  value: n,
                  configurable: !0,
                  enumerable: !1,
                  writable: !0
                };
                return r.defineProperty(t, e, i), t;
              }

              function y(t) {
                throw t;
              }

              var g = function () {
                var t = [Array.prototype, Object.prototype, Function.prototype],
                    e = function e(_e2) {
                  for (var n = 0; n < t.length; ++n) {
                    if (t[n] === _e2) return !0;
                  }

                  return !1;
                };

                if (r.isES5) {
                  var n = Object.getOwnPropertyNames;
                  return function (t) {
                    for (var i = [], o = Object.create(null); null != t && !e(t);) {
                      var s;

                      try {
                        s = n(t);
                      } catch (t) {
                        return i;
                      }

                      for (var a = 0; a < s.length; ++a) {
                        var c = s[a];

                        if (!o[c]) {
                          o[c] = !0;
                          var l = Object.getOwnPropertyDescriptor(t, c);
                          null != l && null == l.get && null == l.set && i.push(c);
                        }
                      }

                      t = r.getPrototypeOf(t);
                    }

                    return i;
                  };
                }

                var i = {}.hasOwnProperty;
                return function (n) {
                  if (e(n)) return [];
                  var r = [];

                  t: for (var o in n) {
                    if (i.call(n, o)) r.push(o);else {
                      for (var s = 0; s < t.length; ++s) {
                        if (i.call(t[s], o)) continue t;
                      }

                      r.push(o);
                    }
                  }

                  return r;
                };
              }(),
                  m = /this\s*\.\s*\S+\s*=/;

              function b(t) {
                try {
                  if ("function" == typeof t) {
                    var e = r.names(t.prototype),
                        n = r.isES5 && e.length > 1,
                        i = e.length > 0 && !(1 === e.length && "constructor" === e[0]),
                        o = m.test(t + "") && r.names(t).length > 0;
                    if (n || i || o) return !0;
                  }

                  return !1;
                } catch (t) {
                  return !1;
                }
              }

              function w(t) {
                function e() {}

                e.prototype = t;
                var n = new e();

                function r() {
                  return _typeof2(n.foo);
                }

                return r(), r(), t;
              }

              var C = /^[a-z$_][a-z$_0-9]*$/i;

              function j(t) {
                return C.test(t);
              }

              function k(t, e, n) {
                for (var r = new Array(t), i = 0; i < t; ++i) {
                  r[i] = e + i + n;
                }

                return r;
              }

              function E(t) {
                try {
                  return t + "";
                } catch (t) {
                  return "[no string representation]";
                }
              }

              function F(t) {
                return t instanceof Error || null !== t && "object" == _typeof2(t) && "string" == typeof t.message && "string" == typeof t.name;
              }

              function x(t) {
                try {
                  v(t, "isOperational", !0);
                } catch (t) {}
              }

              function T(t) {
                return null != t && (t instanceof Error.__BluebirdErrorTypes__.OperationalError || !0 === t.isOperational);
              }

              function P(t) {
                return F(t) && r.propertyIsWritable(t, "stack");
              }

              var R = "stack" in new Error() ? function (t) {
                return P(t) ? t : new Error(E(t));
              } : function (t) {
                if (P(t)) return t;

                try {
                  throw new Error(E(t));
                } catch (t) {
                  return t;
                }
              };

              function S(t) {
                return {}.toString.call(t);
              }

              function O(t, e, n) {
                for (var i = r.names(t), o = 0; o < i.length; ++o) {
                  var s = i[o];
                  if (n(s)) try {
                    r.defineProperty(e, s, r.getDescriptor(t, s));
                  } catch (t) {}
                }
              }

              var A = function A(t) {
                return r.isArray(t) ? t : null;
              };

              if ("undefined" != typeof Symbol && Symbol.iterator) {
                var H = "function" == typeof Array.from ? function (t) {
                  return Array.from(t);
                } : function (t) {
                  for (var e, n = [], r = t[Symbol.iterator](); !(e = r.next()).done;) {
                    n.push(e.value);
                  }

                  return n;
                };

                A = function A(t) {
                  return r.isArray(t) ? t : null != t && "function" == typeof t[Symbol.iterator] ? H(t) : null;
                };
              }

              var V = "undefined" != typeof process && "[object process]" === S(process).toLowerCase(),
                  D = "undefined" != typeof process && void 0 !== process.env,
                  I;

              function L(t) {
                return D ? process.env[t] : void 0;
              }

              function N() {
                if ("function" == typeof Promise) try {
                  if ("[object Promise]" === S(new Promise(function () {}))) return Promise;
                } catch (t) {}
              }

              function U(t, e) {
                if (null === t || "function" != typeof e || e === I) return e;
                null !== t.domain && (e = t.domain.bind(e));
                var n = t.async;

                if (null !== n) {
                  var r = e;

                  e = function e() {
                    var t = new Array(2).concat([].slice.call(arguments));
                    return t[0] = r, t[1] = this, n.runInAsyncScope.apply(n, t);
                  };
                }

                return e;
              }

              var B = {
                setReflectHandler: function setReflectHandler(t) {
                  I = t;
                },
                isClass: b,
                isIdentifier: j,
                inheritedDataKeys: g,
                getDataPropertyOrDefault: d,
                thrower: y,
                isArray: r.isArray,
                asArray: A,
                notEnumerableProp: v,
                isPrimitive: p,
                isObject: f,
                isError: F,
                canEvaluate: i,
                errorObj: o,
                tryCatch: l,
                inherits: u,
                withAppended: _,
                maybeWrapAsError: h,
                toFastProperties: w,
                filledRange: k,
                toString: E,
                canAttachTrace: P,
                ensureErrorObject: R,
                originatesFromRejection: T,
                markAsOriginatingFromRejection: x,
                classString: S,
                copyDescriptors: O,
                isNode: V,
                hasEnvVariables: D,
                env: L,
                global: a,
                getNativePromise: N,
                contextBind: U
              },
                  M;
              B.isRecentNode = B.isNode && (process.versions && process.versions.node ? M = process.versions.node.split(".").map(Number) : process.version && (M = process.version.split(".").map(Number)), 0 === M[0] && M[1] > 10 || M[0] > 0), B.nodeSupportsAsyncResource = B.isNode && function () {
                var e = !1;

                try {
                  e = "function" == typeof t("async_hooks").AsyncResource.prototype.runInAsyncScope;
                } catch (t) {
                  e = !1;
                }

                return e;
              }(), B.isNode && B.toFastProperties(process);

              try {
                throw new Error();
              } catch (t) {
                B.lastLineError = t;
              }

              e.exports = B;
            }, {
              "./es5": 13,
              async_hooks: void 0
            }]
          }, {}, [4])(4);
        }), "undefined" != typeof window && null !== window ? window.P = window.Promise : "undefined" != typeof self && null !== self && (self.P = self.Promise);
      }).call(this);
    }).call(this, _dereq_('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {}, _dereq_("timers").setImmediate);
  }, {
    "_process": 3,
    "timers": 10
  }],
  2: [function (_dereq_, module, exports) {
    function Emitter(t) {
      if (t) return mixin(t);
    }

    function mixin(t) {
      for (var e in Emitter.prototype) {
        t[e] = Emitter.prototype[e];
      }

      return t;
    }

    "undefined" != typeof module && (module.exports = Emitter), Emitter.prototype.on = Emitter.prototype.addEventListener = function (t, e) {
      return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), this;
    }, Emitter.prototype.once = function (t, e) {
      function i() {
        this.off(t, i), e.apply(this, arguments);
      }

      return i.fn = e, this.on(t, i), this;
    }, Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (t, e) {
      if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
      var i,
          r = this._callbacks["$" + t];
      if (!r) return this;
      if (1 == arguments.length) return delete this._callbacks["$" + t], this;

      for (var s = 0; s < r.length; s++) {
        if ((i = r[s]) === e || i.fn === e) {
          r.splice(s, 1);
          break;
        }
      }

      return 0 === r.length && delete this._callbacks["$" + t], this;
    }, Emitter.prototype.emit = function (t) {
      this._callbacks = this._callbacks || {};

      for (var e = new Array(arguments.length - 1), i = this._callbacks["$" + t], r = 1; r < arguments.length; r++) {
        e[r - 1] = arguments[r];
      }

      if (i) {
        r = 0;

        for (var s = (i = i.slice(0)).length; r < s; ++r) {
          i[r].apply(this, e);
        }
      }

      return this;
    }, Emitter.prototype.listeners = function (t) {
      return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || [];
    }, Emitter.prototype.hasListeners = function (t) {
      return !!this.listeners(t).length;
    };
  }, {}],
  3: [function (_dereq_, module, exports) {
    var cachedSetTimeout,
        cachedClearTimeout,
        process = module.exports = {};

    function defaultSetTimout() {
      throw new Error("setTimeout has not been defined");
    }

    function defaultClearTimeout() {
      throw new Error("clearTimeout has not been defined");
    }

    function runTimeout(e) {
      if (cachedSetTimeout === setTimeout) return setTimeout(e, 0);
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) return cachedSetTimeout = setTimeout, setTimeout(e, 0);

      try {
        return cachedSetTimeout(e, 0);
      } catch (t) {
        try {
          return cachedSetTimeout.call(null, e, 0);
        } catch (t) {
          return cachedSetTimeout.call(this, e, 0);
        }
      }
    }

    function runClearTimeout(e) {
      if (cachedClearTimeout === clearTimeout) return clearTimeout(e);
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) return cachedClearTimeout = clearTimeout, clearTimeout(e);

      try {
        return cachedClearTimeout(e);
      } catch (t) {
        try {
          return cachedClearTimeout.call(null, e);
        } catch (t) {
          return cachedClearTimeout.call(this, e);
        }
      }
    }

    !function () {
      try {
        cachedSetTimeout = "function" == typeof setTimeout ? setTimeout : defaultSetTimout;
      } catch (e) {
        cachedSetTimeout = defaultSetTimout;
      }

      try {
        cachedClearTimeout = "function" == typeof clearTimeout ? clearTimeout : defaultClearTimeout;
      } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
      }
    }();
    var currentQueue,
        queue = [],
        draining = !1,
        queueIndex = -1;

    function cleanUpNextTick() {
      draining && currentQueue && (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, queue.length && drainQueue());
    }

    function drainQueue() {
      if (!draining) {
        var e = runTimeout(cleanUpNextTick);
        draining = !0;

        for (var t = queue.length; t;) {
          for (currentQueue = queue, queue = []; ++queueIndex < t;) {
            currentQueue && currentQueue[queueIndex].run();
          }

          queueIndex = -1, t = queue.length;
        }

        currentQueue = null, draining = !1, runClearTimeout(e);
      }
    }

    function Item(e, t) {
      this.fun = e, this.array = t;
    }

    function noop() {}

    process.nextTick = function (e) {
      var t = new Array(arguments.length - 1);
      if (arguments.length > 1) for (var r = 1; r < arguments.length; r++) {
        t[r - 1] = arguments[r];
      }
      queue.push(new Item(e, t)), 1 !== queue.length || draining || runTimeout(drainQueue);
    }, Item.prototype.run = function () {
      this.fun.apply(null, this.array);
    }, process.title = "browser", process.env = {}, process.argv = [], process.version = "", process.versions = {}, process.on = noop, process.addListener = noop, process.once = noop, process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, process.emit = noop, process.prependListener = noop, process.prependOnceListener = noop, process.listeners = function (e) {
      return [];
    }, process.binding = function (e) {
      throw new Error("process.binding is not supported");
    }, process.cwd = function () {
      return "/";
    }, process.chdir = function (e) {
      throw new Error("process.chdir is not supported");
    }, process.umask = function () {
      return 0;
    };
  }, {}],
  4: [function (_dereq_, module, exports) {
    function Agent() {
      this._defaults = [];
    }

    ["use", "on", "once", "set", "query", "type", "accept", "auth", "withCredentials", "sortQuery", "retry", "ok", "redirects", "timeout", "buffer", "serialize", "parse", "ca", "key", "pfx", "cert"].forEach(function (t) {
      Agent.prototype[t] = function () {
        for (var _len = arguments.length, e = new Array(_len), _key = 0; _key < _len; _key++) {
          e[_key] = arguments[_key];
        }

        return this._defaults.push({
          fn: t,
          args: e
        }), this;
      };
    }), Agent.prototype._setDefaults = function (t) {
      this._defaults.forEach(function (e) {
        t[e.fn].apply(t, e.args);
      });
    }, module.exports = Agent;
  }, {}],
  5: [function (_dereq_, module, exports) {
    var root;
    "undefined" != typeof window ? root = window : "undefined" != typeof self ? root = self : (console.warn("Using browser-only version of superagent in non-browser environment"), root = this);

    var Emitter = _dereq_("component-emitter"),
        RequestBase = _dereq_("./request-base"),
        isObject = _dereq_("./is-object"),
        ResponseBase = _dereq_("./response-base"),
        Agent = _dereq_("./agent-base");

    function noop() {}

    var request = exports = module.exports = function (e, t) {
      return "function" == typeof t ? new exports.Request("GET", e).end(t) : 1 == arguments.length ? new exports.Request("GET", e) : new exports.Request(e, t);
    };

    exports.Request = Request, request.getXHR = function () {
      if (!(!root.XMLHttpRequest || root.location && "file:" == root.location.protocol && root.ActiveXObject)) return new XMLHttpRequest();

      try {
        return new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {}

      try {
        return new ActiveXObject("Msxml2.XMLHTTP.6.0");
      } catch (e) {}

      try {
        return new ActiveXObject("Msxml2.XMLHTTP.3.0");
      } catch (e) {}

      try {
        return new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {}

      throw Error("Browser-only version of superagent could not find XHR");
    };
    var trim = "".trim ? function (e) {
      return e.trim();
    } : function (e) {
      return e.replace(/(^\s*|\s*$)/g, "");
    };

    function serialize(e) {
      if (!isObject(e)) return e;
      var t = [];

      for (var s in e) {
        pushEncodedKeyValuePair(t, s, e[s]);
      }

      return t.join("&");
    }

    function pushEncodedKeyValuePair(e, t, s) {
      if (null != s) {
        if (Array.isArray(s)) s.forEach(function (s) {
          pushEncodedKeyValuePair(e, t, s);
        });else if (isObject(s)) for (var r in s) {
          pushEncodedKeyValuePair(e, "".concat(t, "[").concat(r, "]"), s[r]);
        } else e.push(encodeURIComponent(t) + "=" + encodeURIComponent(s));
      } else null === s && e.push(encodeURIComponent(t));
    }

    function parseString(e) {
      var t = {},
          s = e.split("&");
      var r, o;

      for (var _e3 = 0, n = s.length; _e3 < n; ++_e3) {
        -1 == (o = (r = s[_e3]).indexOf("=")) ? t[decodeURIComponent(r)] = "" : t[decodeURIComponent(r.slice(0, o))] = decodeURIComponent(r.slice(o + 1));
      }

      return t;
    }

    function parseHeader(e) {
      var t = e.split(/\r?\n/),
          s = {};
      var r, o, n, i;

      for (var _e4 = 0, u = t.length; _e4 < u; ++_e4) {
        -1 !== (r = (o = t[_e4]).indexOf(":")) && (n = o.slice(0, r).toLowerCase(), i = trim(o.slice(r + 1)), s[n] = i);
      }

      return s;
    }

    function isJSON(e) {
      return /[\/+]json($|[^-\w])/.test(e);
    }

    function Response(e) {
      this.req = e, this.xhr = this.req.xhr, this.text = "HEAD" != this.req.method && ("" === this.xhr.responseType || "text" === this.xhr.responseType) || void 0 === this.xhr.responseType ? this.xhr.responseText : null, this.statusText = this.req.xhr.statusText;
      var t = this.xhr.status;
      1223 === t && (t = 204), this._setStatusProperties(t), this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders()), this.header["content-type"] = this.xhr.getResponseHeader("content-type"), this._setHeaderProperties(this.header), null === this.text && e._responseType ? this.body = this.xhr.response : this.body = "HEAD" != this.req.method ? this._parseBody(this.text ? this.text : this.xhr.response) : null;
    }

    function Request(e, t) {
      var s = this;
      this._query = this._query || [], this.method = e, this.url = t, this.header = {}, this._header = {}, this.on("end", function () {
        var e,
            t = null,
            r = null;

        try {
          r = new Response(s);
        } catch (e) {
          return (t = new Error("Parser is unable to parse the response")).parse = !0, t.original = e, s.xhr ? (t.rawResponse = void 0 === s.xhr.responseType ? s.xhr.responseText : s.xhr.response, t.status = s.xhr.status ? s.xhr.status : null, t.statusCode = t.status) : (t.rawResponse = null, t.status = null), s.callback(t);
        }

        s.emit("response", r);

        try {
          s._isResponseOK(r) || (e = new Error(r.statusText || "Unsuccessful HTTP response"));
        } catch (t) {
          e = t;
        }

        e ? (e.original = t, e.response = r, e.status = r.status, s.callback(e, r)) : s.callback(null, r);
      });
    }

    function del(e, t, s) {
      var r = request("DELETE", e);
      return "function" == typeof t && (s = t, t = null), t && r.send(t), s && r.end(s), r;
    }

    request.serializeObject = serialize, request.parseString = parseString, request.types = {
      html: "text/html",
      json: "application/json",
      xml: "text/xml",
      urlencoded: "application/x-www-form-urlencoded",
      form: "application/x-www-form-urlencoded",
      "form-data": "application/x-www-form-urlencoded"
    }, request.serialize = {
      "application/x-www-form-urlencoded": serialize,
      "application/json": JSON.stringify
    }, request.parse = {
      "application/x-www-form-urlencoded": parseString,
      "application/json": JSON.parse
    }, ResponseBase(Response.prototype), Response.prototype._parseBody = function (e) {
      var t = request.parse[this.type];
      return this.req._parser ? this.req._parser(this, e) : (!t && isJSON(this.type) && (t = request.parse["application/json"]), t && e && (e.length || e instanceof Object) ? t(e) : null);
    }, Response.prototype.toError = function () {
      var e = this.req,
          t = e.method,
          s = e.url,
          r = "cannot ".concat(t, " ").concat(s, " (").concat(this.status, ")"),
          o = new Error(r);
      return o.status = this.status, o.method = t, o.url = s, o;
    }, request.Response = Response, Emitter(Request.prototype), RequestBase(Request.prototype), Request.prototype.type = function (e) {
      return this.set("Content-Type", request.types[e] || e), this;
    }, Request.prototype.accept = function (e) {
      return this.set("Accept", request.types[e] || e), this;
    }, Request.prototype.auth = function (e, t, s) {
      1 === arguments.length && (t = ""), "object" == _typeof2(t) && null !== t && (s = t, t = ""), s || (s = {
        type: "function" == typeof btoa ? "basic" : "auto"
      });
      return this._auth(e, t, s, function (e) {
        if ("function" == typeof btoa) return btoa(e);
        throw new Error("Cannot use basic auth, btoa is not a function");
      });
    }, Request.prototype.query = function (e) {
      return "string" != typeof e && (e = serialize(e)), e && this._query.push(e), this;
    }, Request.prototype.attach = function (e, t, s) {
      if (t) {
        if (this._data) throw Error("superagent can't mix .send() and .attach()");

        this._getFormData().append(e, t, s || t.name);
      }

      return this;
    }, Request.prototype._getFormData = function () {
      return this._formData || (this._formData = new root.FormData()), this._formData;
    }, Request.prototype.callback = function (e, t) {
      if (this._shouldRetry(e, t)) return this._retry();
      var s = this._callback;
      this.clearTimeout(), e && (this._maxRetries && (e.retries = this._retries - 1), this.emit("error", e)), s(e, t);
    }, Request.prototype.crossDomainError = function () {
      var e = new Error("Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.");
      e.crossDomain = !0, e.status = this.status, e.method = this.method, e.url = this.url, this.callback(e);
    }, Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function () {
      return console.warn("This is not supported in browser version of superagent"), this;
    }, Request.prototype.pipe = Request.prototype.write = function () {
      throw Error("Streaming is not supported in browser version of superagent");
    }, Request.prototype._isHost = function (e) {
      return e && "object" == _typeof2(e) && !Array.isArray(e) && "[object Object]" !== Object.prototype.toString.call(e);
    }, Request.prototype.end = function (e) {
      this._endCalled && console.warn("Warning: .end() was called twice. This is not supported in superagent"), this._endCalled = !0, this._callback = e || noop, this._finalizeQueryString(), this._end();
    }, Request.prototype._end = function () {
      if (this._aborted) return this.callback(Error("The request has been aborted even before .end() was called"));
      var e = this,
          t = this.xhr = request.getXHR();
      var s = this._formData || this._data;
      this._setTimeouts(), t.onreadystatechange = function () {
        var s = t.readyState;
        if (s >= 2 && e._responseTimeoutTimer && clearTimeout(e._responseTimeoutTimer), 4 != s) return;
        var r;

        try {
          r = t.status;
        } catch (e) {
          r = 0;
        }

        if (!r) {
          if (e.timedout || e._aborted) return;
          return e.crossDomainError();
        }

        e.emit("end");
      };

      var r = function r(t, s) {
        s.total > 0 && (s.percent = s.loaded / s.total * 100), s.direction = t, e.emit("progress", s);
      };

      if (this.hasListeners("progress")) try {
        t.onprogress = r.bind(null, "download"), t.upload && (t.upload.onprogress = r.bind(null, "upload"));
      } catch (e) {}

      try {
        this.username && this.password ? t.open(this.method, this.url, !0, this.username, this.password) : t.open(this.method, this.url, !0);
      } catch (e) {
        return this.callback(e);
      }

      if (this._withCredentials && (t.withCredentials = !0), !this._formData && "GET" != this.method && "HEAD" != this.method && "string" != typeof s && !this._isHost(s)) {
        var _e5 = this._header["content-type"];

        var _t2 = this._serializer || request.serialize[_e5 ? _e5.split(";")[0] : ""];

        !_t2 && isJSON(_e5) && (_t2 = request.serialize["application/json"]), _t2 && (s = _t2(s));
      }

      for (var _e6 in this.header) {
        null != this.header[_e6] && this.header.hasOwnProperty(_e6) && t.setRequestHeader(_e6, this.header[_e6]);
      }

      this._responseType && (t.responseType = this._responseType), this.emit("request", this), t.send(void 0 !== s ? s : null);
    }, request.agent = function () {
      return new Agent();
    }, ["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"].forEach(function (e) {
      Agent.prototype[e.toLowerCase()] = function (t, s) {
        var r = new request.Request(e, t);
        return this._setDefaults(r), s && r.end(s), r;
      };
    }), Agent.prototype.del = Agent.prototype.delete, request.get = function (e, t, s) {
      var r = request("GET", e);
      return "function" == typeof t && (s = t, t = null), t && r.query(t), s && r.end(s), r;
    }, request.head = function (e, t, s) {
      var r = request("HEAD", e);
      return "function" == typeof t && (s = t, t = null), t && r.query(t), s && r.end(s), r;
    }, request.options = function (e, t, s) {
      var r = request("OPTIONS", e);
      return "function" == typeof t && (s = t, t = null), t && r.send(t), s && r.end(s), r;
    }, request.del = del, request.delete = del, request.patch = function (e, t, s) {
      var r = request("PATCH", e);
      return "function" == typeof t && (s = t, t = null), t && r.send(t), s && r.end(s), r;
    }, request.post = function (e, t, s) {
      var r = request("POST", e);
      return "function" == typeof t && (s = t, t = null), t && r.send(t), s && r.end(s), r;
    }, request.put = function (e, t, s) {
      var r = request("PUT", e);
      return "function" == typeof t && (s = t, t = null), t && r.send(t), s && r.end(s), r;
    };
  }, {
    "./agent-base": 4,
    "./is-object": 6,
    "./request-base": 7,
    "./response-base": 8,
    "component-emitter": 2
  }],
  6: [function (_dereq_, module, exports) {
    "use strict";

    function isObject(t) {
      return null !== t && "object" == _typeof2(t);
    }

    module.exports = isObject;
  }, {}],
  7: [function (_dereq_, module, exports) {
    "use strict";

    var isObject = _dereq_("./is-object");

    function RequestBase(t) {
      if (t) return mixin(t);
    }

    function mixin(t) {
      for (var e in RequestBase.prototype) {
        t[e] = RequestBase.prototype[e];
      }

      return t;
    }

    module.exports = RequestBase, RequestBase.prototype.clearTimeout = function () {
      return clearTimeout(this._timer), clearTimeout(this._responseTimeoutTimer), delete this._timer, delete this._responseTimeoutTimer, this;
    }, RequestBase.prototype.parse = function (t) {
      return this._parser = t, this;
    }, RequestBase.prototype.responseType = function (t) {
      return this._responseType = t, this;
    }, RequestBase.prototype.serialize = function (t) {
      return this._serializer = t, this;
    }, RequestBase.prototype.timeout = function (t) {
      if (!t || "object" != _typeof2(t)) return this._timeout = t, this._responseTimeout = 0, this;

      for (var e in t) {
        switch (e) {
          case "deadline":
            this._timeout = t.deadline;
            break;

          case "response":
            this._responseTimeout = t.response;
            break;

          default:
            console.warn("Unknown timeout option", e);
        }
      }

      return this;
    }, RequestBase.prototype.retry = function (t, e) {
      return 0 !== arguments.length && !0 !== t || (t = 1), t <= 0 && (t = 0), this._maxRetries = t, this._retries = 0, this._retryCallback = e, this;
    };
    var ERROR_CODES = ["ECONNRESET", "ETIMEDOUT", "EADDRINFO", "ESOCKETTIMEDOUT"];
    RequestBase.prototype._shouldRetry = function (t, e) {
      if (!this._maxRetries || this._retries++ >= this._maxRetries) return !1;
      if (this._retryCallback) try {
        var s = this._retryCallback(t, e);

        if (!0 === s) return !0;
        if (!1 === s) return !1;
      } catch (t) {
        console.error(t);
      }
      if (e && e.status && e.status >= 500 && 501 != e.status) return !0;

      if (t) {
        if (t.code && ~ERROR_CODES.indexOf(t.code)) return !0;
        if (t.timeout && "ECONNABORTED" == t.code) return !0;
        if (t.crossDomain) return !0;
      }

      return !1;
    }, RequestBase.prototype._retry = function () {
      return this.clearTimeout(), this.req && (this.req = null, this.req = this.request()), this._aborted = !1, this.timedout = !1, this._end();
    }, RequestBase.prototype.then = function (t, e) {
      var _this = this;

      if (!this._fullfilledPromise) {
        var _t3 = this;

        this._endCalled && console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises"), this._fullfilledPromise = new Promise(function (e, s) {
          _t3.on("error", s), _t3.on("abort", function () {
            var t = new Error("Aborted");
            t.code = "ABORTED", t.status = _this.status, t.method = _this.method, t.url = _this.url, s(t);
          }), _t3.end(function (t, i) {
            t ? s(t) : e(i);
          });
        });
      }

      return this._fullfilledPromise.then(t, e);
    }, RequestBase.prototype.catch = function (t) {
      return this.then(void 0, t);
    }, RequestBase.prototype.use = function (t) {
      return t(this), this;
    }, RequestBase.prototype.ok = function (t) {
      if ("function" != typeof t) throw Error("Callback required");
      return this._okCallback = t, this;
    }, RequestBase.prototype._isResponseOK = function (t) {
      return !!t && (this._okCallback ? this._okCallback(t) : t.status >= 200 && t.status < 300);
    }, RequestBase.prototype.get = function (t) {
      return this._header[t.toLowerCase()];
    }, RequestBase.prototype.getHeader = RequestBase.prototype.get, RequestBase.prototype.set = function (t, e) {
      if (isObject(t)) {
        for (var _e7 in t) {
          this.set(_e7, t[_e7]);
        }

        return this;
      }

      return this._header[t.toLowerCase()] = e, this.header[t] = e, this;
    }, RequestBase.prototype.unset = function (t) {
      return delete this._header[t.toLowerCase()], delete this.header[t], this;
    }, RequestBase.prototype.field = function (t, e) {
      if (null === t || void 0 === t) throw new Error(".field(name, val) name can not be empty");
      if (this._data) throw new Error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");

      if (isObject(t)) {
        for (var _e8 in t) {
          this.field(_e8, t[_e8]);
        }

        return this;
      }

      if (Array.isArray(e)) {
        for (var s in e) {
          this.field(t, e[s]);
        }

        return this;
      }

      if (null === e || void 0 === e) throw new Error(".field(name, val) val can not be empty");
      return "boolean" == typeof e && (e = "" + e), this._getFormData().append(t, e), this;
    }, RequestBase.prototype.abort = function () {
      return this._aborted ? this : (this._aborted = !0, this.xhr && this.xhr.abort(), this.req && this.req.abort(), this.clearTimeout(), this.emit("abort"), this);
    }, RequestBase.prototype._auth = function (t, e, s, i) {
      switch (s.type) {
        case "basic":
          this.set("Authorization", "Basic ".concat(i("".concat(t, ":").concat(e))));
          break;

        case "auto":
          this.username = t, this.password = e;
          break;

        case "bearer":
          this.set("Authorization", "Bearer ".concat(t));
      }

      return this;
    }, RequestBase.prototype.withCredentials = function (t) {
      return void 0 == t && (t = !0), this._withCredentials = t, this;
    }, RequestBase.prototype.redirects = function (t) {
      return this._maxRedirects = t, this;
    }, RequestBase.prototype.maxResponseSize = function (t) {
      if ("number" != typeof t) throw TypeError("Invalid argument");
      return this._maxResponseSize = t, this;
    }, RequestBase.prototype.toJSON = function () {
      return {
        method: this.method,
        url: this.url,
        data: this._data,
        headers: this._header
      };
    }, RequestBase.prototype.send = function (t) {
      var e = isObject(t);
      var s = this._header["content-type"];
      if (this._formData) throw new Error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
      if (e && !this._data) Array.isArray(t) ? this._data = [] : this._isHost(t) || (this._data = {});else if (t && this._data && this._isHost(this._data)) throw Error("Can't merge these send calls");
      if (e && isObject(this._data)) for (var _e9 in t) {
        this._data[_e9] = t[_e9];
      } else "string" == typeof t ? (s || this.type("form"), s = this._header["content-type"], this._data = "application/x-www-form-urlencoded" == s ? this._data ? "".concat(this._data, "&").concat(t) : t : (this._data || "") + t) : this._data = t;
      return !e || this._isHost(t) ? this : (s || this.type("json"), this);
    }, RequestBase.prototype.sortQuery = function (t) {
      return this._sort = void 0 === t || t, this;
    }, RequestBase.prototype._finalizeQueryString = function () {
      var t = this._query.join("&");

      if (t && (this.url += (this.url.indexOf("?") >= 0 ? "&" : "?") + t), this._query.length = 0, this._sort) {
        var _t4 = this.url.indexOf("?");

        if (_t4 >= 0) {
          var e = this.url.substring(_t4 + 1).split("&");
          "function" == typeof this._sort ? e.sort(this._sort) : e.sort(), this.url = this.url.substring(0, _t4) + "?" + e.join("&");
        }
      }
    }, RequestBase.prototype._appendQueryString = function () {
      console.trace("Unsupported");
    }, RequestBase.prototype._timeoutError = function (t, e, s) {
      if (this._aborted) return;
      var i = new Error("".concat(t + e, "ms exceeded"));
      i.timeout = e, i.code = "ECONNABORTED", i.errno = s, this.timedout = !0, this.abort(), this.callback(i);
    }, RequestBase.prototype._setTimeouts = function () {
      var t = this;
      this._timeout && !this._timer && (this._timer = setTimeout(function () {
        t._timeoutError("Timeout of ", t._timeout, "ETIME");
      }, this._timeout)), this._responseTimeout && !this._responseTimeoutTimer && (this._responseTimeoutTimer = setTimeout(function () {
        t._timeoutError("Response timeout of ", t._responseTimeout, "ETIMEDOUT");
      }, this._responseTimeout));
    };
  }, {
    "./is-object": 6
  }],
  8: [function (_dereq_, module, exports) {
    "use strict";

    var utils = _dereq_("./utils");

    function ResponseBase(t) {
      if (t) return mixin(t);
    }

    function mixin(t) {
      for (var s in ResponseBase.prototype) {
        t[s] = ResponseBase.prototype[s];
      }

      return t;
    }

    module.exports = ResponseBase, ResponseBase.prototype.get = function (t) {
      return this.header[t.toLowerCase()];
    }, ResponseBase.prototype._setHeaderProperties = function (t) {
      var s = t["content-type"] || "";
      this.type = utils.type(s);
      var e = utils.params(s);

      for (var _t5 in e) {
        this[_t5] = e[_t5];
      }

      this.links = {};

      try {
        t.link && (this.links = utils.parseLinks(t.link));
      } catch (t) {}
    }, ResponseBase.prototype._setStatusProperties = function (t) {
      var s = t / 100 | 0;
      this.status = this.statusCode = t, this.statusType = s, this.info = 1 == s, this.ok = 2 == s, this.redirect = 3 == s, this.clientError = 4 == s, this.serverError = 5 == s, this.error = (4 == s || 5 == s) && this.toError(), this.created = 201 == t, this.accepted = 202 == t, this.noContent = 204 == t, this.badRequest = 400 == t, this.unauthorized = 401 == t, this.notAcceptable = 406 == t, this.forbidden = 403 == t, this.notFound = 404 == t, this.unprocessableEntity = 422 == t;
    };
  }, {
    "./utils": 9
  }],
  9: [function (_dereq_, module, exports) {
    "use strict";

    exports.type = function (e) {
      return e.split(/ *; */).shift();
    }, exports.params = function (e) {
      return e.split(/ *; */).reduce(function (e, t) {
        var s = t.split(/ *= */),
            i = s.shift(),
            r = s.shift();
        return i && r && (e[i] = r), e;
      }, {});
    }, exports.parseLinks = function (e) {
      return e.split(/ *, */).reduce(function (e, t) {
        var s = t.split(/ *; */),
            i = s[0].slice(1, -1);
        return e[s[1].split(/ *= */)[1].slice(1, -1)] = i, e;
      }, {});
    }, exports.cleanHeader = function (e, t) {
      return delete e["content-type"], delete e["content-length"], delete e["transfer-encoding"], delete e.host, t && (delete e.authorization, delete e.cookie), e;
    };
  }, {}],
  10: [function (_dereq_, module, exports) {
    (function (setImmediate, clearImmediate) {
      (function () {
        var nextTick = _dereq_("process/browser.js").nextTick,
            apply = Function.prototype.apply,
            slice = Array.prototype.slice,
            immediateIds = {},
            nextImmediateId = 0;

        function Timeout(e, t) {
          this._id = e, this._clearFn = t;
        }

        exports.setTimeout = function () {
          return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
        }, exports.setInterval = function () {
          return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
        }, exports.clearTimeout = exports.clearInterval = function (e) {
          e.close();
        }, Timeout.prototype.unref = Timeout.prototype.ref = function () {}, Timeout.prototype.close = function () {
          this._clearFn.call(window, this._id);
        }, exports.enroll = function (e, t) {
          clearTimeout(e._idleTimeoutId), e._idleTimeout = t;
        }, exports.unenroll = function (e) {
          clearTimeout(e._idleTimeoutId), e._idleTimeout = -1;
        }, exports._unrefActive = exports.active = function (e) {
          clearTimeout(e._idleTimeoutId);
          var t = e._idleTimeout;
          t >= 0 && (e._idleTimeoutId = setTimeout(function () {
            e._onTimeout && e._onTimeout();
          }, t));
        }, exports.setImmediate = "function" == typeof setImmediate ? setImmediate : function (e) {
          var t = nextImmediateId++,
              i = !(arguments.length < 2) && slice.call(arguments, 1);
          return immediateIds[t] = !0, nextTick(function () {
            immediateIds[t] && (i ? e.apply(null, i) : e.call(null), exports.clearImmediate(t));
          }), t;
        }, exports.clearImmediate = "function" == typeof clearImmediate ? clearImmediate : function (e) {
          delete immediateIds[e];
        };
      }).call(this);
    }).call(this, _dereq_("timers").setImmediate, _dereq_("timers").clearImmediate);
  }, {
    "process/browser.js": 3,
    "timers": 10
  }],
  11: [function (_dereq_, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    });

    var _extends = Object.assign || function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var s = arguments[t];

        for (var r in s) {
          Object.prototype.hasOwnProperty.call(s, r) && (e[r] = s[r]);
        }
      }

      return e;
    },
        _typeof = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function (e) {
      return _typeof2(e);
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof2(e);
    },
        _createClass = function () {
      function e(e, t) {
        for (var s = 0; s < t.length; s++) {
          var r = t[s];
          r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
        }
      }

      return function (t, s, r) {
        return s && e(t.prototype, s), r && e(t, r), t;
      };
    }(),
        _superagent = _dereq_("superagent"),
        _superagent2 = _interopRequireDefault(_superagent),
        _bluebird = _dereq_("bluebird"),
        _bluebird2 = _interopRequireDefault(_bluebird),
        _OrsUtil = _dereq_("./OrsUtil"),
        _OrsUtil2 = _interopRequireDefault(_OrsUtil),
        _constants = _dereq_("./constants"),
        _constants2 = _interopRequireDefault(_constants);

    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    function _toConsumableArray(e) {
      if (Array.isArray(e)) {
        for (var t = 0, s = Array(e.length); t < e.length; t++) {
          s[t] = e[t];
        }

        return s;
      }

      return Array.from(e);
    }

    function _classCallCheck(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    }

    var orsUtil = new _OrsUtil2.default(),
        OrsDirections = function () {
      function e(t) {
        _classCallCheck(this, e), this.requestSettings = null, this.args = {}, this.meta = null, _constants2.default.propNames.apiKey in t ? this.args[_constants2.default.propNames.apiKey] = t[_constants2.default.propNames.apiKey] : console.error(_constants2.default.missingAPIKeyMsg), _constants2.default.propNames.host in t && (this.args[_constants2.default.propNames.host] = t[_constants2.default.propNames.host]), _constants2.default.propNames.service in t && (this.args[_constants2.default.propNames.service] = t[_constants2.default.propNames.service]);
      }

      return _createClass(e, [{
        key: "clear",
        value: function value() {
          for (var e in this.args) {
            e !== _constants2.default.apiKeyPropName && delete this.args[e];
          }
        }
      }, {
        key: "clearPoints",
        value: function value() {
          "coordinates" in this.args && (this.args.coordinates.length = 0);
        }
      }, {
        key: "addWaypoint",
        value: function value(e) {
          "coordinates" in this.args || (this.args.coordinates = []), this.args.coordinates.push(e);
        }
      }, {
        key: "getBody",
        value: function value(e) {
          return e.options && "object" !== _typeof(e.options) && (e.options = JSON.parse(e.options)), !this.meta || "driving-hgv" !== this.meta.profile || e.options && e.options.vehicle_type || (e.options.vehicle_type = "hgv"), e.restrictions && (e.options.profile_params = {
            restrictions: _extends({}, e.restrictions)
          }, delete e.options.restrictions), e.avoidables && (e.options.avoid_features = [].concat(_toConsumableArray(e.avoidables)), delete e.avoidables), e;
        }
      }, {
        key: "calculate",
        value: function value(e) {
          this.customHeaders = [], e.customHeaders && (this.customHeaders = e.customHeaders, delete e.customHeaders), orsUtil.setRequestDefaults(this.args, e, !0), this.args[_constants2.default.propNames.service] || (this.args[_constants2.default.propNames.service] = "directions"), orsUtil.copyProperties(e, this.args);
          var t = this;
          return new _bluebird2.default(function (e, s) {
            null == t.meta && (t.meta = orsUtil.prepareMeta(t.args)), t.httpArgs = orsUtil.prepareRequest(t.args);

            var r = orsUtil.prepareUrl(t.meta),
                o = t.getBody(t.httpArgs),
                a = t.meta[_constants2.default.propNames.apiKey],
                n = _superagent2.default.post(r).send(o).set("Authorization", a).timeout(1e4);

            for (var i in t.customHeaders) {
              n.set(i, t.customHeaders[i]);
            }

            n.end(function (t, r) {
              t || !r.ok ? (console.error(t), s(t)) : r && e(r.body || r.text);
            });
          });
        }
      }]), e;
    }();

    exports.default = OrsDirections;
  }, {
    "./OrsUtil": 18,
    "./constants": 19,
    "bluebird": 1,
    "superagent": 5
  }],
  12: [function (_dereq_, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    });

    var _createClass = function () {
      function e(e, t) {
        for (var s = 0; s < t.length; s++) {
          var r = t[s];
          r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
        }
      }

      return function (t, s, r) {
        return s && e(t.prototype, s), r && e(t, r), t;
      };
    }(),
        _superagent = _dereq_("superagent"),
        _superagent2 = _interopRequireDefault(_superagent),
        _bluebird = _dereq_("bluebird"),
        _bluebird2 = _interopRequireDefault(_bluebird),
        _OrsUtil = _dereq_("./OrsUtil"),
        _OrsUtil2 = _interopRequireDefault(_OrsUtil),
        _constants = _dereq_("./constants"),
        _constants2 = _interopRequireDefault(_constants);

    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    function _classCallCheck(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    }

    var orsUtil = new _OrsUtil2.default(),
        OrsElevation = function () {
      function e(t) {
        _classCallCheck(this, e), this.args = {}, _constants2.default.propNames.apiKey in t ? this.args[_constants2.default.propNames.apiKey] = t[_constants2.default.propNames.apiKey] : console.error(_constants2.default.missingAPIKeyMsg);
      }

      return _createClass(e, [{
        key: "clear",
        value: function value() {
          for (var e in this.args) {
            e !== _constants2.default.propNames.apiKey && delete this.args[e];
          }
        }
      }, {
        key: "generatePayload",
        value: function value(e) {
          var t = {};

          for (var s in e) {
            _constants2.default.baseUrlConstituents.indexOf(s) > -1 || (t[s] = e[s]);
          }

          return t;
        }
      }, {
        key: "elevationPromise",
        value: function value() {
          var e = this;
          return new _bluebird2.default(function (t, s) {
            var r = orsUtil.prepareUrl(e.args),
                a = e.generatePayload(e.args),
                n = e.args[_constants2.default.propNames.apiKey],
                o = _superagent2.default.post(r).send(a).accept(e.args[_constants2.default.propNames.mimeType]).set("Authorization", n).timeout(5e3);

            for (var i in e.customHeaders) {
              o.set(i, e.customHeaders[i]);
            }

            o.end(function (e, r) {
              e || !r.ok ? (console.error(e), s(e)) : r && t(r.body || r.text);
            });
          });
        }
      }, {
        key: "lineElevation",
        value: function value(e) {
          return this.customHeaders = [], e.customHeaders && (this.customHeaders = e.customHeaders, delete e.customHeaders), orsUtil.setRequestDefaults(this.args, e), this.args[_constants2.default.propNames.service] || e[_constants2.default.propNames.service] || (e[[_constants2.default.propNames.service]] = "elevation/line"), orsUtil.copyProperties(e, this.args), this.elevationPromise();
        }
      }, {
        key: "pointElevation",
        value: function value(e) {
          return this.customHeaders = [], e.customHeaders && (this.customHeaders = e.customHeaders, delete e.customHeaders), orsUtil.setRequestDefaults(this.args, e), this.args[_constants2.default.propNames.service] || e[_constants2.default.propNames.service] || (e[[_constants2.default.propNames.service]] = "elevation/point"), orsUtil.copyProperties(e, this.args), this.elevationPromise();
        }
      }]), e;
    }();

    exports.default = OrsElevation;
  }, {
    "./OrsUtil": 18,
    "./constants": 19,
    "bluebird": 1,
    "superagent": 5
  }],
  13: [function (_dereq_, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    });

    var _createClass = function () {
      function e(e, r) {
        for (var t = 0; t < r.length; t++) {
          var s = r[t];
          s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(e, s.key, s);
        }
      }

      return function (r, t, s) {
        return t && e(r.prototype, t), s && e(r, s), r;
      };
    }(),
        _superagent = _dereq_("superagent"),
        _superagent2 = _interopRequireDefault(_superagent),
        _bluebird = _dereq_("bluebird"),
        _bluebird2 = _interopRequireDefault(_bluebird),
        _OrsUtil = _dereq_("./OrsUtil"),
        _OrsUtil2 = _interopRequireDefault(_OrsUtil),
        _constants = _dereq_("./constants"),
        _constants2 = _interopRequireDefault(_constants);

    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    function _classCallCheck(e, r) {
      if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function");
    }

    var orsUtil = new _OrsUtil2.default(),
        OrsGeocode = function () {
      function e(r) {
        _classCallCheck(this, e), this.args = {}, _constants2.default.apiKeyPropName in r ? this.args.api_key = r.api_key : console.error(_constants2.default.missingAPIKeyMsg), _constants2.default.propNames.host in r && (this.args[_constants2.default.propNames.host] = r[_constants2.default.propNames.host]), _constants2.default.propNames.service in r && (this.args[_constants2.default.propNames.service] = r[_constants2.default.propNames.service]), this.lookupParameter = {
          api_key: function api_key(e, r) {
            return e + "=" + r;
          },
          text: function text(e, r) {
            return "&" + e + "=" + r;
          },
          focus_point: function focus_point(e, r) {
            var t = "";
            return t += "&focus.point.lon=" + r[1], t += "&focus.point.lat=" + r[0];
          },
          boundary_bbox: function boundary_bbox(e, r) {
            var t = "";
            return t += "&boundary.rect.min_lon=" + r[0][1], t += "&boundary.rect.min_lat=" + r[0][0], t += "&boundary.rect.max_lon=" + r[1][1], t += "&boundary.rect.max_lat=" + r[1][0];
          },
          point: function point(e, r) {
            var t = "";
            return t += "&point.lon=" + r.lat_lng[1], t += "&point.lat=" + r.lat_lng[0], t += "&boundary.circle.radius=" + r.radius;
          },
          boundary_circle: function boundary_circle(e, r) {
            var t = "";
            return t += "&boundary.circle.lon=" + r.lat_lng[1], t += "&boundary.circle.lat=" + r.lat_lng[0], t += "&boundary.circle.radius=" + r.radius;
          },
          sources: function sources(e, r) {
            var t = "&sources=";

            for (var s in r) {
              t += s + ",";
            }

            return t;
          },
          layers: function layers(e, r) {
            var t = "&layers=",
                s = 0;

            for (e in r) {
              s > 0 && (t += ","), t += r[e], s++;
            }

            return t;
          },
          boundary_country: function boundary_country(e, r) {
            return "&boundary.country=" + r;
          },
          size: function size(e, r) {
            return "&" + e + "=" + r;
          },
          address: function address(e, r) {
            return "&" + e + "=" + r;
          },
          neighbourhood: function neighbourhood(e, r) {
            return "&" + e + "=" + r;
          },
          borough: function borough(e, r) {
            return "&" + e + "=" + r;
          },
          locality: function locality(e, r) {
            return "&" + e + "=" + r;
          },
          county: function county(e, r) {
            return "&" + e + "=" + r;
          },
          region: function region(e, r) {
            return "&" + e + "=" + r;
          },
          postalcode: function postalcode(e, r) {
            return "&" + e + "=" + r;
          },
          country: function country(e, r) {
            return "&" + e + "=" + r;
          }
        };
      }

      return _createClass(e, [{
        key: "clear",
        value: function value() {
          for (var e in this.args) {
            e !== _constants2.default.apiKeyPropName && delete this.args[e];
          }
        }
      }, {
        key: "getParametersAsQueryString",
        value: function value(e) {
          var r = "";

          for (var t in e) {
            var s = e[t];
            _constants2.default.baseUrlConstituents.indexOf(t) > -1 || (r += this.lookupParameter[t](t, s));
          }

          return r;
        }
      }, {
        key: "geocodePromise",
        value: function value() {
          var e = this;
          return new _bluebird2.default(function (r, t) {
            var s = orsUtil.prepareUrl(e.args);
            s += "?" + e.getParametersAsQueryString(e.args);

            var n = _superagent2.default.get(s).timeout(5e3);

            for (var o in e.customHeaders) {
              n.set(o, e.customHeaders[o]);
            }

            n.end(function (e, s) {
              e || !s.ok ? (console.error(e), t(e)) : s && r(s.body || s.text);
            });
          });
        }
      }, {
        key: "geocode",
        value: function value(e) {
          return this.customHeaders = [], e.customHeaders && (this.customHeaders = e.customHeaders, delete e.customHeaders), orsUtil.setRequestDefaults(this.args, e), this.args[_constants2.default.propNames.service] || e[_constants2.default.propNames.service] || (e.service = "geocode/search"), orsUtil.copyProperties(e, this.args), this.geocodePromise();
        }
      }, {
        key: "reverseGeocode",
        value: function value(e) {
          return this.customHeaders = [], e.customHeaders && (this.customHeaders = e.customHeaders, delete e.customHeaders), orsUtil.setRequestDefaults(this.args, e), this.args[_constants2.default.propNames.service] || e[_constants2.default.propNames.service] || (e.service = "geocode/reverse"), orsUtil.copyProperties(e, this.args), this.geocodePromise();
        }
      }, {
        key: "structuredGeocode",
        value: function value(e) {
          return orsUtil.setRequestDefaults(this.args, e), this.args[_constants2.default.propNames.service] || e[_constants2.default.propNames.service] || (e.service = "geocode/search/structured"), orsUtil.copyProperties(e, this.args), this.geocodePromise();
        }
      }]), e;
    }();

    exports.default = OrsGeocode;
  }, {
    "./OrsUtil": 18,
    "./constants": 19,
    "bluebird": 1,
    "superagent": 5
  }],
  14: [function (_dereq_, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    });

    var _createClass = function () {
      function t(t, e) {
        for (var r = 0; r < e.length; r++) {
          var n = e[r];
          n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n);
        }
      }

      return function (e, r, n) {
        return r && t(e.prototype, r), n && t(e, n), e;
      };
    }();

    function _classCallCheck(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }

    var OrsInput = function () {
      function t(e, r) {
        _classCallCheck(this, t), this.setCoord(e, r);
      }

      return _createClass(t, [{
        key: "round",
        value: function value(t, e) {
          return void 0 === e && (e = 1e6), Math.round(t * e) / e;
        }
      }, {
        key: "setCoord",
        value: function value(t, e) {
          this.coord = [this.round(t), this.round(e)];
        }
      }, {
        key: "isObject",
        value: function value(t) {
          return "[object object]" === Object.prototype.toString.call(t).toLowerCase();
        }
      }, {
        key: "isString",
        value: function value(t) {
          return "[object string]" === Object.prototype.toString.call(t).toLowerCase();
        }
      }, {
        key: "set",
        value: function value(e, r) {
          if (r) this.setCoord(e, r);else if (t.isObject(e)) this.setCoord(e.lat, e.lng);else if (t.isString(e)) {
            var n = e.indexOf(",");
            n >= 0 && (this.coord = [this.round(parseFloat(e.substr(0, n))), this.round(parseFloat(e.substr(n + 1)))]);
          }
        }
      }, {
        key: "toString",
        value: function value() {
          if (void 0 !== this.lat && void 0 !== this.lng) return this.lat + "," + this.lng;
        }
      }]), t;
    }();

    exports.default = OrsInput;
  }, {}],
  15: [function (_dereq_, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    });

    var _extends = Object.assign || function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var s = arguments[t];

        for (var r in s) {
          Object.prototype.hasOwnProperty.call(s, r) && (e[r] = s[r]);
        }
      }

      return e;
    },
        _createClass = function () {
      function e(e, t) {
        for (var s = 0; s < t.length; s++) {
          var r = t[s];
          r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
        }
      }

      return function (t, s, r) {
        return s && e(t.prototype, s), r && e(t, r), t;
      };
    }(),
        _superagent = _dereq_("superagent"),
        _superagent2 = _interopRequireDefault(_superagent),
        _bluebird = _dereq_("bluebird"),
        _bluebird2 = _interopRequireDefault(_bluebird),
        _OrsUtil = _dereq_("./OrsUtil"),
        _OrsUtil2 = _interopRequireDefault(_OrsUtil),
        _constants = _dereq_("./constants"),
        _constants2 = _interopRequireDefault(_constants);

    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    function _toConsumableArray(e) {
      if (Array.isArray(e)) {
        for (var t = 0, s = Array(e.length); t < e.length; t++) {
          s[t] = e[t];
        }

        return s;
      }

      return Array.from(e);
    }

    function _classCallCheck(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    }

    var orsUtil = new _OrsUtil2.default(),
        OrsIsochrones = function () {
      function e(t) {
        _classCallCheck(this, e), this.meta = null, this.args = {}, _constants2.default.propNames.apiKey in t ? this.args[_constants2.default.propNames.apiKey] = t[_constants2.default.propNames.apiKey] : console.log(_constants2.default.missingAPIKeyMsg), _constants2.default.propNames.host in t && (this.args[_constants2.default.propNames.host] = t[_constants2.default.propNames.host]), _constants2.default.propNames.service in t && (this.args[_constants2.default.propNames.service] = t[_constants2.default.propNames.service]);
      }

      return _createClass(e, [{
        key: "addLocation",
        value: function value(e) {
          "locations" in this.args || (this.args.locations = []), this.args.locations.push(e);
        }
      }, {
        key: "getBody",
        value: function value(e) {
          var t = {};
          return e.restrictions && (t.profile_params = {
            restrictions: _extends({}, e.restrictions)
          }, delete e.restrictions), e.avoidables && (t.avoid_features = [].concat(_toConsumableArray(e.avoidables)), delete e.avoidables), e.avoid_polygons && (t.avoid_polygons = _extends({}, e.avoid_polygons), delete e.avoid_polygons), Object.keys(t).length > 0 ? _extends({}, e, {
            options: t
          }) : _extends({}, e);
        }
      }, {
        key: "calculate",
        value: function value(e) {
          this.customHeaders = [], e.customHeaders && (this.customHeaders = e.customHeaders, delete e.customHeaders), orsUtil.setRequestDefaults(this.args, e, !0), this.args[_constants2.default.propNames.service] || e[_constants2.default.propNames.service] || (e.service = "isochrones"), orsUtil.copyProperties(e, this.args);
          var t = this;
          return new _bluebird2.default(function (e, s) {
            if (t.args[_constants2.default.propNames.apiVersion] === _constants2.default.defaultAPIVersion) {
              null == t.meta && (t.meta = orsUtil.prepareMeta(t.args)), t.httpArgs = orsUtil.prepareRequest(t.args);

              var r = orsUtil.prepareUrl(t.meta),
                  a = t.getBody(t.httpArgs),
                  o = t.meta[_constants2.default.propNames.apiKey],
                  n = _superagent2.default.post(r).send(a).set("Authorization", o).timeout(1e4);

              for (var i in t.customHeaders) {
                n.set(i, t.customHeaders[i]);
              }

              n.end(function (t, r) {
                t || !r.ok ? (console.error(t), s(t)) : r && e(r.body || r.text);
              });
            } else console.error(_constants2.default.useAPIV2Msg);
          });
        }
      }]), e;
    }();

    exports.default = OrsIsochrones;
  }, {
    "./OrsUtil": 18,
    "./constants": 19,
    "bluebird": 1,
    "superagent": 5
  }],
  16: [function (_dereq_, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    });

    var _createClass = function () {
      function e(e, t) {
        for (var s = 0; s < t.length; s++) {
          var r = t[s];
          r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
        }
      }

      return function (t, s, r) {
        return s && e(t.prototype, s), r && e(t, r), t;
      };
    }(),
        _superagent = _dereq_("superagent"),
        _superagent2 = _interopRequireDefault(_superagent),
        _bluebird = _dereq_("bluebird"),
        _bluebird2 = _interopRequireDefault(_bluebird),
        _OrsUtil = _dereq_("./OrsUtil"),
        _OrsUtil2 = _interopRequireDefault(_OrsUtil),
        _constants = _dereq_("./constants"),
        _constants2 = _interopRequireDefault(_constants);

    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    function _classCallCheck(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    }

    var orsUtil = new _OrsUtil2.default(),
        OrsMatrix = function () {
      function e(t) {
        _classCallCheck(this, e), this.meta = null, this.args = {}, _constants2.default.propNames.apiKey in t ? this.args[_constants2.default.propNames.apiKey] = t[_constants2.default.propNames.apiKey] : console.log(_constants2.default.missingAPIKeyMsg);
      }

      return _createClass(e, [{
        key: "calculate",
        value: function value(e) {
          this.customHeaders = [], e.customHeaders && (this.customHeaders = e.customHeaders, delete e.customHeaders), orsUtil.setRequestDefaults(this.args, e, !0), this.args[_constants2.default.propNames.service] || e[_constants2.default.propNames.service] || (this.args[_constants2.default.propNames.service] = "matrix"), orsUtil.copyProperties(e, this.args);
          var t = this;
          return new _bluebird2.default(function (e, s) {
            if (t.args[_constants2.default.propNames.apiVersion] === _constants2.default.defaultAPIVersion) {
              null == t.meta && (t.meta = orsUtil.prepareMeta(t.args)), t.httpArgs = orsUtil.prepareRequest(t.args);

              var r = orsUtil.prepareUrl(t.meta),
                  a = t.meta[_constants2.default.propNames.apiKey],
                  n = _superagent2.default.post(r).send(t.httpArgs).set("Authorization", a).timeout(1e4);

              for (var o in t.customHeaders) {
                n.set(o, t.customHeaders[o]);
              }

              n.end(function (t, r) {
                t || !r.ok ? (console.error(t), s(t)) : r && e(r.body || r.text);
              });
            } else console.error(_constants2.default.useAPIV2Msg);
          });
        }
      }]), e;
    }();

    exports.default = OrsMatrix;
  }, {
    "./OrsUtil": 18,
    "./constants": 19,
    "bluebird": 1,
    "superagent": 5
  }],
  17: [function (_dereq_, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    });

    var _createClass = function () {
      function e(e, s) {
        for (var t = 0; t < s.length; t++) {
          var r = s[t];
          r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
        }
      }

      return function (s, t, r) {
        return t && e(s.prototype, t), r && e(s, r), s;
      };
    }(),
        _superagent = _dereq_("superagent"),
        _superagent2 = _interopRequireDefault(_superagent),
        _bluebird = _dereq_("bluebird"),
        _bluebird2 = _interopRequireDefault(_bluebird),
        _OrsUtil = _dereq_("./OrsUtil"),
        _OrsUtil2 = _interopRequireDefault(_OrsUtil),
        _constants = _dereq_("./constants"),
        _constants2 = _interopRequireDefault(_constants);

    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    function _classCallCheck(e, s) {
      if (!(e instanceof s)) throw new TypeError("Cannot call a class as a function");
    }

    var orsUtil = new _OrsUtil2.default(),
        OrsPois = function () {
      function e(s) {
        _classCallCheck(this, e), this.args = {}, _constants2.default.propNames.apiKey in s ? this.args[_constants2.default.propNames.apiKey] = s[_constants2.default.propNames.apiKey] : console.error(_constants2.default.missingAPIKeyMsg), _constants2.default.propNames.host in s && (this.args[_constants2.default.propNames.host] = s[_constants2.default.propNames.host]), _constants2.default.propNames.service in s && (this.args[_constants2.default.propNames.service] = s[_constants2.default.propNames.service]);
      }

      return _createClass(e, [{
        key: "clear",
        value: function value() {
          for (var e in this.args) {
            e !== _constants2.default.propNames.apiKey && delete this.args[e];
          }
        }
      }, {
        key: "generatePayload",
        value: function value(e) {
          var s = {};

          for (var t in e) {
            _constants2.default.baseUrlConstituents.indexOf(t) > -1 || (s[t] = e[t]);
          }

          return s;
        }
      }, {
        key: "poisPromise",
        value: function value() {
          this.args[_constants2.default.propNames.service] || (this.args[_constants2.default.propNames.service] = "pois"), this.args.request = this.args.request || "pois";
          var e = this;
          return new _bluebird2.default(function (s, t) {
            var r = orsUtil.prepareUrl(e.args);
            r += r.indexOf("?") > -1 ? "&" : "?", e.args[_constants2.default.propNames.service] && delete e.args[_constants2.default.propNames.service];

            var a = e.generatePayload(e.args),
                n = e.args[_constants2.default.propNames.apiKey],
                o = _superagent2.default.post(r).send(a).set("Authorization", n).timeout(5e3);

            for (var i in e.customHeaders) {
              o.set(i, e.customHeaders[i]);
            }

            o.end(function (e, r) {
              e || !r.ok ? (console.error(e), t(e)) : r && s(r.body || r.text);
            });
          });
        }
      }, {
        key: "pois",
        value: function value(e) {
          return this.customHeaders = [], e.customHeaders && (this.customHeaders = e.customHeaders, delete e.customHeaders), orsUtil.setRequestDefaults(this.args, e), orsUtil.copyProperties(e, this.args), this.poisPromise();
        }
      }]), e;
    }();

    exports.default = OrsPois;
  }, {
    "./OrsUtil": 18,
    "./constants": 19,
    "bluebird": 1,
    "superagent": 5
  }],
  18: [function (_dereq_, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    });

    var _extends = Object.assign || function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var a = arguments[t];

        for (var s in a) {
          Object.prototype.hasOwnProperty.call(a, s) && (e[s] = a[s]);
        }
      }

      return e;
    },
        _createClass = function () {
      function e(e, t) {
        for (var a = 0; a < t.length; a++) {
          var s = t[a];
          s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(e, s.key, s);
        }
      }

      return function (t, a, s) {
        return a && e(t.prototype, a), s && e(t, s), t;
      };
    }(),
        _constants = _dereq_("./constants"),
        _constants2 = _interopRequireDefault(_constants);

    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    function _classCallCheck(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    }

    var OrsUtil = function () {
      function e() {
        _classCallCheck(this, e);
      }

      return _createClass(e, [{
        key: "clone",
        value: function value(e) {
          var t = {};

          for (var a in e) {
            e.hasOwnProperty(a) && (t[a] = e[a]);
          }

          return t;
        }
      }, {
        key: "copyProperties",
        value: function value(e, t) {
          if (!e) return t;

          for (var a in e) {
            e.hasOwnProperty(a) && void 0 !== e[a] && (t[a] = e[a]);
          }

          return t;
        }
      }, {
        key: "extractError",
        value: function value(e, t) {
          var a = void 0;
          return e && e.body ? (a = e.body).message && (a = a.message) : a = e, new Error(a + " - for url " + t);
        }
      }, {
        key: "isArray",
        value: function value(e) {
          return "[object array]" === Object.prototype.toString.call(e).toLowerCase();
        }
      }, {
        key: "isObject",
        value: function value(e) {
          return "[object object]" === Object.prototype.toString.call(e).toLowerCase();
        }
      }, {
        key: "isString",
        value: function value(e) {
          return "string" == typeof e;
        }
      }, {
        key: "prepareMeta",
        value: function value(e) {
          return {
            host: e[_constants2.default.propNames.host],
            api_version: e[_constants2.default.propNames.apiVersion],
            profile: e[_constants2.default.propNames.profile],
            format: e[_constants2.default.propNames.format],
            service: e[_constants2.default.propNames.service],
            api_key: e[_constants2.default.propNames.apiKey],
            mime_type: e[_constants2.default.propNames.mimeType]
          };
        }
      }, {
        key: "prepareRequest",
        value: function value(e) {
          return delete e[_constants2.default.propNames.mimeType], delete e[_constants2.default.propNames.host], delete e[_constants2.default.propNames.apiVersion], delete e[_constants2.default.propNames.service], delete e[_constants2.default.propNames.apiKey], delete e[_constants2.default.propNames.profile], delete e[_constants2.default.propNames.format], _extends({}, e);
        }
      }, {
        key: "prepareUrl",
        value: function value(e) {
          var t = "",
              a = [];
          e[_constants2.default.propNames.service] && 0 === e[_constants2.default.propNames.service].indexOf("http") ? (t = e[_constants2.default.propNames.service], a = [e[_constants2.default.propNames.profile], e[_constants2.default.propNames.format]]) : (t = e[_constants2.default.propNames.host], a = [e[_constants2.default.propNames.apiVersion], e[_constants2.default.propNames.service], e[_constants2.default.propNames.profile], e[_constants2.default.propNames.format]]);
          var s = "/",
              r = 0;

          for (var n in a) {
            a[n] && (r > 0 && r && (s += "/"), s += a[n]), r++;
          }

          return "/" === (t += s.replace(/\/\//g, "/")).slice(-1) && (t = t.slice(0, -1)), t;
        }
      }, {
        key: "setRequestDefaults",
        value: function value(e, t) {
          var a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
          t[_constants2.default.propNames.service] && (e[_constants2.default.propNames.service] = t[_constants2.default.propNames.service]), t[_constants2.default.propNames.host] && (e[_constants2.default.propNames.host] = t[_constants2.default.propNames.host]), e[_constants2.default.propNames.host] || (e[_constants2.default.propNames.host] = _constants2.default.defaultHost), !0 === a && (t[_constants2.default.propNames.apiVersion] || (t.api_version = _constants2.default.defaultAPIVersion), t[_constants2.default.propNames.apiVersion] || (t.api_version = _constants2.default.defaultAPIVersion));
        }
      }]), e;
    }();

    exports.default = OrsUtil;
  }, {
    "./constants": 19
  }],
  19: [function (_dereq_, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    });
    var constants = {
      defaultAPIVersion: "v2",
      defaultHost: "https://api.openrouteservice.org",
      apiKeyPropName: "api_key",
      hostPropName: "host",
      missingAPIKeyMsg: "Please add your openrouteservice api_key..",
      useAPIV2Msg: "Please use ORS API v2",
      baseUrlConstituents: ["host", "service", "api_version", "mime_type"],
      propNames: {
        apiKey: "api_key",
        host: "host",
        service: "service",
        apiVersion: "api_version",
        mimeType: "mime_type",
        profile: "profile",
        format: "format"
      }
    };
    exports.default = constants;
  }, {}],
  20: [function (_dereq_, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    });

    var _typeof = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function (e) {
      return _typeof2(e);
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof2(e);
    },
        _OrsUtil = _dereq_("./OrsUtil.js"),
        _OrsUtil2 = _interopRequireDefault(_OrsUtil),
        _OrsInput = _dereq_("./OrsInput.js"),
        _OrsInput2 = _interopRequireDefault(_OrsInput),
        _OrsGeocode = _dereq_("./OrsGeocode.js"),
        _OrsGeocode2 = _interopRequireDefault(_OrsGeocode),
        _OrsIsochrones = _dereq_("./OrsIsochrones.js"),
        _OrsIsochrones2 = _interopRequireDefault(_OrsIsochrones),
        _OrsMatrix = _dereq_("./OrsMatrix.js"),
        _OrsMatrix2 = _interopRequireDefault(_OrsMatrix),
        _OrsDirections = _dereq_("./OrsDirections.js"),
        _OrsDirections2 = _interopRequireDefault(_OrsDirections),
        _OrsPois = _dereq_("./OrsPois.js"),
        _OrsPois2 = _interopRequireDefault(_OrsPois),
        _OrsElevation = _dereq_("./OrsElevation.js"),
        _OrsElevation2 = _interopRequireDefault(_OrsElevation);

    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    var Openrouteservice = {
      Util: _OrsUtil2.default,
      Input: _OrsInput2.default,
      Geocode: _OrsGeocode2.default,
      Isochrones: _OrsIsochrones2.default,
      Directions: _OrsDirections2.default,
      Matrix: _OrsMatrix2.default,
      Pois: _OrsPois2.default,
      Elevation: _OrsElevation2.default
    };
    "object" === ("undefined" == typeof module ? "undefined" : _typeof(module)) && "object" === _typeof(module.exports) ? module.exports = Openrouteservice : "function" == typeof define && define.amd && define(Openrouteservice), "undefined" != typeof window && (window.Openrouteservice = Openrouteservice), exports.default = Openrouteservice;
  }, {
    "./OrsDirections.js": 11,
    "./OrsElevation.js": 12,
    "./OrsGeocode.js": 13,
    "./OrsInput.js": 14,
    "./OrsIsochrones.js": 15,
    "./OrsMatrix.js": 16,
    "./OrsPois.js": 17,
    "./OrsUtil.js": 18
  }]
}, {}, [20]);
},{"process":"node_modules/process/browser.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51919" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","dist/ors-js-client.js"], null)
//# sourceMappingURL=/ors-js-client.bab4021b.js.map