'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var reactRedux = require('react-redux');
var effects = require('redux-saga/effects');
var React = _interopDefault(require('react'));
var invariant = _interopDefault(require('invariant'));

const RouteContext = React.createContext({
    path: [],
});
const RouterProviderContext = React.createContext({
    buildUrl: (() => {
        throw new Error('RouterProviderContext is not initialized');
    }),
});

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function checkIsEmpty(arg, argPosition) {
    if (argPosition === void 0) { argPosition = 1; }
    return arg == null;
}
function throwIsEmpty(argPosition) {
    if (argPosition === void 0) { argPosition = 1; }
    throw new Error("Argument " + argPosition + " is empty.");
}
function checkValidActionCreator(arg) {
    return typeof arg === 'function' && 'getType' in arg;
}
function checkInvalidActionCreator(arg) {
    return !checkValidActionCreator(arg);
}
function throwInvalidActionCreator(argPosition) {
    if (argPosition === void 0) { argPosition = 1; }
    throw new Error("Argument " + argPosition + " is invalid, it should be an action-creator instance from \"typesafe-actions\"");
}
function checkValidActionType(arg) {
    return typeof arg === 'string' || typeof arg === 'symbol';
}
function checkInvalidActionType(arg) {
    return !checkValidActionType(arg);
}
function throwInvalidActionType(argPosition) {
    if (argPosition === void 0) { argPosition = 1; }
    throw new Error("Argument " + argPosition + " is invalid, it should be an action type of type: string | symbol");
}

function action(type, payload, meta, error) {
    if (checkIsEmpty(type)) {
        throwIsEmpty(1);
    }
    if (checkInvalidActionType(type)) {
        throwInvalidActionCreator(1);
    }
    return { type: type, payload: payload, meta: meta, error: error };
}

function createAction(type, createHandler) {
    var actionCreator = createHandler == null
        ? (function () { return action(type); })
        : createHandler(action.bind(null, type));
    return Object.assign(actionCreator, {
        getType: function () { return type; },
        toString: function () { return type; },
    });
}

function createCustomAction(type, createHandler) {
    if (checkIsEmpty(type)) {
        throwIsEmpty(1);
    }
    if (checkInvalidActionType(type)) {
        throwInvalidActionType(1);
    }
    var actionCreator = createHandler != null ? createHandler(type) : (function () { return ({ type: type }); });
    return Object.assign(actionCreator, {
        getType: function () { return type; },
        toString: function () { return type; },
    });
}

function createStandardAction(type) {
    if (checkIsEmpty(type)) {
        throwIsEmpty(1);
    }
    if (checkInvalidActionType(type)) {
        throwInvalidActionType(1);
    }
    function constructor() {
        return createCustomAction(type, function (_type) { return function (payload, meta) { return ({
            type: _type,
            payload: payload,
            meta: meta,
        }); }; });
    }
    function map(fn) {
        return createCustomAction(type, function (_type) { return function (payload, meta) {
            return Object.assign(fn(payload, meta), { type: _type });
        }; });
    }
    return Object.assign(constructor, { map: map });
}

function getType(actionCreator) {
    if (checkIsEmpty(actionCreator)) {
        throwIsEmpty(1);
    }
    if (checkInvalidActionCreator(actionCreator)) {
        throwInvalidActionCreator(1);
    }
    return actionCreator.getType();
}

const goTo = createStandardAction('@rs_router/GO_TO')
    .map((_a) => {
    var { replace = false } = _a, payload = __rest(_a, ["replace"]);
    if ('url' in payload) {
        return { payload: Object.assign({}, payload, { replace }) };
    }
    const { path, params } = payload;
    return { payload: { path, replace, params: params || {} } };
});
const setMatch = createStandardAction('@rs_router/MATCH_SET')
    .map((payload) => ({ payload }));
const setLocation = createStandardAction('@rs_router/LOCATION_SET')
    .map((payload) => ({ payload }));
const notFound = createAction('@rs_router/NOT_FOUND');
const goBack = createAction('@rs_router/GO_BACK');
const setServerResponse = createStandardAction('@rs_router/SERVER_RESPONSE_SET')
    .map((payload) => ({ payload }));

const initialState = {
    match: { path: [], params: {} },
    serverResponse: { status: 200 },
    location: null,
};
function routerReducer(state = initialState, action$$1) {
    switch (action$$1.type) {
        case getType(setMatch):
            return Object.assign({}, state, { match: Object.assign({}, action$$1.payload) });
        case getType(setServerResponse):
            return Object.assign({}, state, { serverResponse: Object.assign({}, action$$1.payload) });
        case getType(setLocation):
            return Object.assign({}, state, { location: action$$1.payload });
        default:
            return state;
    }
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var cjs = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
function isAbsolute(pathname) {
  return pathname.charAt(0) === '/';
}

// About 1.5x faster than the two-arg version of Array#splice()
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
    list[i] = list[k];
  }

  list.pop();
}

// This implementation is based heavily on node's url.parse
function resolvePathname(to) {
  var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var toParts = to && to.split('/') || [];
  var fromParts = from && from.split('/') || [];

  var isToAbs = to && isAbsolute(to);
  var isFromAbs = from && isAbsolute(from);
  var mustEndAbs = isToAbs || isFromAbs;

  if (to && isAbsolute(to)) {
    // to is absolute
    fromParts = toParts;
  } else if (toParts.length) {
    // to is relative, drop the filename
    fromParts.pop();
    fromParts = fromParts.concat(toParts);
  }

  if (!fromParts.length) return '/';

  var hasTrailingSlash = void 0;
  if (fromParts.length) {
    var last = fromParts[fromParts.length - 1];
    hasTrailingSlash = last === '.' || last === '..' || last === '';
  } else {
    hasTrailingSlash = false;
  }

  var up = 0;
  for (var i = fromParts.length; i >= 0; i--) {
    var part = fromParts[i];

    if (part === '.') {
      spliceOne(fromParts, i);
    } else if (part === '..') {
      spliceOne(fromParts, i);
      up++;
    } else if (up) {
      spliceOne(fromParts, i);
      up--;
    }
  }

  if (!mustEndAbs) for (; up--; up) {
    fromParts.unshift('..');
  }if (mustEndAbs && fromParts[0] !== '' && (!fromParts[0] || !isAbsolute(fromParts[0]))) fromParts.unshift('');

  var result = fromParts.join('/');

  if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';

  return result;
}

exports.default = resolvePathname;
module.exports = exports['default'];
});

var resolvePathname = unwrapExports(cjs);

var cjs$1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function valueEqual(a, b) {
  if (a === b) return true;

  if (a == null || b == null) return false;

  if (Array.isArray(a)) {
    return Array.isArray(b) && a.length === b.length && a.every(function (item, index) {
      return valueEqual(item, b[index]);
    });
  }

  var aType = typeof a === 'undefined' ? 'undefined' : _typeof(a);
  var bType = typeof b === 'undefined' ? 'undefined' : _typeof(b);

  if (aType !== bType) return false;

  if (aType === 'object') {
    var aValue = a.valueOf();
    var bValue = b.valueOf();

    if (aValue !== a || bValue !== b) return valueEqual(aValue, bValue);

    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) return false;

    return aKeys.every(function (key) {
      return valueEqual(a[key], b[key]);
    });
  }

  return false;
}

exports.default = valueEqual;
module.exports = exports['default'];
});

unwrapExports(cjs$1);

var isProduction = process.env.NODE_ENV === 'production';
function warning(condition, message) {
  if (!isProduction) {
    if (condition) {
      return;
    }

    var text = "Warning: " + message;

    if (typeof console !== 'undefined') {
      console.warn(text);
    }

    try {
      throw Error(text);
    } catch (x) {}
  }
}

var tinyWarning_cjs = warning;

var isProduction$1 = process.env.NODE_ENV === 'production';
var prefix = 'Invariant failed';
function invariant$1(condition, message) {
  if (condition) {
    return;
  }

  if (isProduction$1) {
    throw new Error(prefix);
  } else {
    throw new Error(prefix + ": " + (message || ''));
  }
}

function addLeadingSlash(path) {
  return path.charAt(0) === '/' ? path : '/' + path;
}
function hasBasename(path, prefix) {
  return new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i').test(path);
}
function stripBasename(path, prefix) {
  return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
}
function stripTrailingSlash(path) {
  return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
}
function parsePath(path) {
  var pathname = path || '/';
  var search = '';
  var hash = '';
  var hashIndex = pathname.indexOf('#');

  if (hashIndex !== -1) {
    hash = pathname.substr(hashIndex);
    pathname = pathname.substr(0, hashIndex);
  }

  var searchIndex = pathname.indexOf('?');

  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex);
    pathname = pathname.substr(0, searchIndex);
  }

  return {
    pathname: pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash
  };
}
function createPath(location) {
  var pathname = location.pathname,
      search = location.search,
      hash = location.hash;
  var path = pathname || '/';
  if (search && search !== '?') path += search.charAt(0) === '?' ? search : "?" + search;
  if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : "#" + hash;
  return path;
}

function createLocation(path, state, key, currentLocation) {
  var location;

  if (typeof path === 'string') {
    // Two-arg form: push(path, state)
    location = parsePath(path);
    location.state = state;
  } else {
    // One-arg form: push(location)
    location = _extends({}, path);
    if (location.pathname === undefined) location.pathname = '';

    if (location.search) {
      if (location.search.charAt(0) !== '?') location.search = '?' + location.search;
    } else {
      location.search = '';
    }

    if (location.hash) {
      if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
    } else {
      location.hash = '';
    }

    if (state !== undefined && location.state === undefined) location.state = state;
  }

  try {
    location.pathname = decodeURI(location.pathname);
  } catch (e) {
    if (e instanceof URIError) {
      throw new URIError('Pathname "' + location.pathname + '" could not be decoded. ' + 'This is likely caused by an invalid percent-encoding.');
    } else {
      throw e;
    }
  }

  if (key) location.key = key;

  if (currentLocation) {
    // Resolve incomplete/relative pathname relative to current location.
    if (!location.pathname) {
      location.pathname = currentLocation.pathname;
    } else if (location.pathname.charAt(0) !== '/') {
      location.pathname = resolvePathname(location.pathname, currentLocation.pathname);
    }
  } else {
    // When there is no prior location and pathname is empty, set it to /
    if (!location.pathname) {
      location.pathname = '/';
    }
  }

  return location;
}

function createTransitionManager() {
  var prompt = null;

  function setPrompt(nextPrompt) {
    process.env.NODE_ENV !== "production" ? tinyWarning_cjs(prompt == null, 'A history supports only one prompt at a time') : void 0;
    prompt = nextPrompt;
    return function () {
      if (prompt === nextPrompt) prompt = null;
    };
  }

  function confirmTransitionTo(location, action, getUserConfirmation, callback) {
    // TODO: If another transition starts while we're still confirming
    // the previous one, we may end up in a weird state. Figure out the
    // best way to handle this.
    if (prompt != null) {
      var result = typeof prompt === 'function' ? prompt(location, action) : prompt;

      if (typeof result === 'string') {
        if (typeof getUserConfirmation === 'function') {
          getUserConfirmation(result, callback);
        } else {
          process.env.NODE_ENV !== "production" ? tinyWarning_cjs(false, 'A history needs a getUserConfirmation function in order to use a prompt message') : void 0;
          callback(true);
        }
      } else {
        // Return false from a transition hook to cancel the transition.
        callback(result !== false);
      }
    } else {
      callback(true);
    }
  }

  var listeners = [];

  function appendListener(fn) {
    var isActive = true;

    function listener() {
      if (isActive) fn.apply(void 0, arguments);
    }

    listeners.push(listener);
    return function () {
      isActive = false;
      listeners = listeners.filter(function (item) {
        return item !== listener;
      });
    };
  }

  function notifyListeners() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    listeners.forEach(function (listener) {
      return listener.apply(void 0, args);
    });
  }

  return {
    setPrompt: setPrompt,
    confirmTransitionTo: confirmTransitionTo,
    appendListener: appendListener,
    notifyListeners: notifyListeners
  };
}

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
function getConfirmation(message, callback) {
  callback(window.confirm(message)); // eslint-disable-line no-alert
}
/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */

function supportsHistory() {
  var ua = window.navigator.userAgent;
  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) return false;
  return window.history && 'pushState' in window.history;
}
/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */

function supportsPopStateOnHashChange() {
  return window.navigator.userAgent.indexOf('Trident') === -1;
}
/**
 * Returns true if a given popstate event is an extraneous WebKit event.
 * Accounts for the fact that Chrome on iOS fires real popstate events
 * containing undefined state when pressing the back button.
 */

function isExtraneousPopstateEvent(event) {
  event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
}

var PopStateEvent = 'popstate';
var HashChangeEvent = 'hashchange';

function getHistoryState() {
  try {
    return window.history.state || {};
  } catch (e) {
    // IE 11 sometimes throws when accessing window.history.state
    // See https://github.com/ReactTraining/history/pull/289
    return {};
  }
}
/**
 * Creates a history object that uses the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */


function createBrowserHistory(props) {
  if (props === void 0) {
    props = {};
  }

  !canUseDOM ? process.env.NODE_ENV !== "production" ? invariant$1(false, 'Browser history needs a DOM') : invariant$1(false) : void 0;
  var globalHistory = window.history;
  var canUseHistory = supportsHistory();
  var needsHashChangeListener = !supportsPopStateOnHashChange();
  var _props = props,
      _props$forceRefresh = _props.forceRefresh,
      forceRefresh = _props$forceRefresh === void 0 ? false : _props$forceRefresh,
      _props$getUserConfirm = _props.getUserConfirmation,
      getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm,
      _props$keyLength = _props.keyLength,
      keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
  var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';

  function getDOMLocation(historyState) {
    var _ref = historyState || {},
        key = _ref.key,
        state = _ref.state;

    var _window$location = window.location,
        pathname = _window$location.pathname,
        search = _window$location.search,
        hash = _window$location.hash;
    var path = pathname + search + hash;
    process.env.NODE_ENV !== "production" ? tinyWarning_cjs(!basename || hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".') : void 0;
    if (basename) path = stripBasename(path, basename);
    return createLocation(path, state, key);
  }

  function createKey() {
    return Math.random().toString(36).substr(2, keyLength);
  }

  var transitionManager = createTransitionManager();

  function setState(nextState) {
    _extends(history, nextState);

    history.length = globalHistory.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  function handlePopState(event) {
    // Ignore extraneous popstate events in WebKit.
    if (isExtraneousPopstateEvent(event)) return;
    handlePop(getDOMLocation(event.state));
  }

  function handleHashChange() {
    handlePop(getDOMLocation(getHistoryState()));
  }

  var forceNextPop = false;

  function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = 'POP';
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({
            action: action,
            location: location
          });
        } else {
          revertPop(location);
        }
      });
    }
  }

  function revertPop(fromLocation) {
    var toLocation = history.location; // TODO: We could probably make this more reliable by
    // keeping a list of keys we've seen in sessionStorage.
    // Instead, we just default to 0 for keys we don't know.

    var toIndex = allKeys.indexOf(toLocation.key);
    if (toIndex === -1) toIndex = 0;
    var fromIndex = allKeys.indexOf(fromLocation.key);
    if (fromIndex === -1) fromIndex = 0;
    var delta = toIndex - fromIndex;

    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  }

  var initialLocation = getDOMLocation(getHistoryState());
  var allKeys = [initialLocation.key]; // Public interface

  function createHref(location) {
    return basename + createPath(location);
  }

  function push(path, state) {
    process.env.NODE_ENV !== "production" ? tinyWarning_cjs(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored') : void 0;
    var action = 'PUSH';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var href = createHref(location);
      var key = location.key,
          state = location.state;

      if (canUseHistory) {
        globalHistory.pushState({
          key: key,
          state: state
        }, null, href);

        if (forceRefresh) {
          window.location.href = href;
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);
          var nextKeys = allKeys.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);
          nextKeys.push(location.key);
          allKeys = nextKeys;
          setState({
            action: action,
            location: location
          });
        }
      } else {
        process.env.NODE_ENV !== "production" ? tinyWarning_cjs(state === undefined, 'Browser history cannot push state in browsers that do not support HTML5 history') : void 0;
        window.location.href = href;
      }
    });
  }

  function replace(path, state) {
    process.env.NODE_ENV !== "production" ? tinyWarning_cjs(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored') : void 0;
    var action = 'REPLACE';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var href = createHref(location);
      var key = location.key,
          state = location.state;

      if (canUseHistory) {
        globalHistory.replaceState({
          key: key,
          state: state
        }, null, href);

        if (forceRefresh) {
          window.location.replace(href);
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);
          if (prevIndex !== -1) allKeys[prevIndex] = location.key;
          setState({
            action: action,
            location: location
          });
        }
      } else {
        process.env.NODE_ENV !== "production" ? tinyWarning_cjs(state === undefined, 'Browser history cannot replace state in browsers that do not support HTML5 history') : void 0;
        window.location.replace(href);
      }
    });
  }

  function go(n) {
    globalHistory.go(n);
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  var listenerCount = 0;

  function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1 && delta === 1) {
      window.addEventListener(PopStateEvent, handlePopState);
      if (needsHashChangeListener) window.addEventListener(HashChangeEvent, handleHashChange);
    } else if (listenerCount === 0) {
      window.removeEventListener(PopStateEvent, handlePopState);
      if (needsHashChangeListener) window.removeEventListener(HashChangeEvent, handleHashChange);
    }
  }

  var isBlocked = false;

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    var unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }

    return function () {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }

      return unblock();
    };
  }

  function listen(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);
    return function () {
      checkDOMListeners(-1);
      unlisten();
    };
  }

  var history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    block: block,
    listen: listen
  };
  return history;
}

let history = null;
if (typeof window === 'object') {
    history = createBrowserHistory();
}
var history$1 = history;

const getServerResponse = (state) => state.router.serverResponse;
const getMatch = (state) => state.router.match;
const getMatchPath = (state) => state.router.match.path;
const getLocation = (state) => state.router.location;
const getParams = (state, paramName) => {
    const params = state.router.match.params;
    if (paramName) {
        return params[paramName];
    }
    return params;
};

function matchLocation(route, location, context) {
    switch (route.type) {
        case 'static': {
            const routeExpectsExactMatch = route.path.endsWith('$');
            const routePath = routeExpectsExactMatch ? route.path.slice(0, -1) : route.path;
            if (routeExpectsExactMatch && routePath === location.pathname) {
                return {
                    nextLocation: null,
                };
            }
            if (location.pathname.startsWith(routePath)) {
                const hasNested = Array.isArray(route.routes) && route.routes.length > 0;
                const case1 = routeExpectsExactMatch && hasNested && location.pathname[routePath.length] === '/';
                const case2 = !routeExpectsExactMatch && hasNested;
                if (case1 || case2) {
                    return {
                        nextLocation: Object.assign({}, location, { pathname: location.pathname.slice(routePath.length) }),
                    };
                }
            }
            return null;
        }
        case 'dynamic': {
            return route.pathMatcher(location, context);
        }
        case 'fallback': {
            return {
                nextLocation: null,
            };
        }
        default: {
            throw new Error(`Unknown route schema:\n${JSON.stringify(route, null, 4)}`);
        }
    }
}

function extendMatch(match, routeId, params) {
    return {
        path: [...match.path, routeId],
        params: Object.assign({}, match.params, (params ? params : {})),
    };
}
function extendMatcherContext(context, routeId, params) {
    return Object.assign({}, context, { match: extendMatch(context.match, routeId, params) });
}
const routeHasNested = (routeSchema) => {
    return 'routes' in routeSchema && Array.isArray(routeSchema.routes) && routeSchema.routes.length > 0;
};
class RoutesCollection {
    constructor(routeSchemas, parentCollection, parentRouteSchema) {
        this.parentCollection = parentCollection;
        this.parentRouteSchema = parentRouteSchema;
        this.fallbackId = null;
        this.routesMap = new Map();
        for (const route of routeSchemas) {
            if (route.type === 'fallback') {
                if (process.env.NODE_ENV !== 'production') {
                    invariant(this.fallbackId === null, 'You can specify only one fallback route');
                }
                this.fallbackId = route.id;
            }
            this.routesMap.set(route.id, Object.freeze(route));
        }
        this.nestedMap = new Map();
        if (this.parentCollection == null) {
            invariant(this.fallbackId, 'You must specify root fallback route');
        }
    }
    hasRoute(routeId) {
        return this.routesMap.has(routeId);
    }
    getRouteSchemaById(routeId) {
        const routeSchema = this.routesMap.get(routeId);
        if (!routeSchema) {
            throw new Error(`Route ${routeId} is not found, `
                + `available routes: ${Array.from(this.routesMap.keys()).join(', ')}`);
        }
        return routeSchema;
    }
    routeSchemaHasNested(routeId) {
        const routeSchema = this.getRouteSchemaById(routeId);
        return routeHasNested(routeSchema);
    }
    getRouteNestedCollection(routeId) {
        if (this.nestedMap.has(routeId)) {
            return this.nestedMap.get(routeId);
        }
        const routeSchema = this.getRouteSchemaById(routeId);
        if (!routeHasNested(routeSchema)) {
            throw new Error(`Route ${routeId} hasn't nested`);
        }
        const nestedRoutesSchemas = routeSchema.routes;
        const collection = new RoutesCollection(nestedRoutesSchemas, this, routeSchema);
        this.nestedMap.set(routeId, collection);
        return collection;
    }
    traverse(location, context) {
        for (const route of this.routesMap.values()) {
            const matcherResult = matchLocation(route, location, context);
            if (matcherResult !== null) {
                if (matcherResult.nextLocation && routeHasNested(route)) {
                    const nestedRoutesCollection = this.getRouteNestedCollection(route.id);
                    const res = nestedRoutesCollection.traverse(matcherResult.nextLocation, extendMatcherContext(context, route.id, matcherResult.params));
                    if (res !== null) {
                        return res;
                    }
                }
                else {
                    return extendMatch(context.match, route.id, matcherResult.params);
                }
            }
        }
        if (this.fallbackId !== null) {
            return extendMatch(context.match, this.fallbackId);
        }
        return null;
    }
    getMatch(location, getState) {
        const res = this.traverse(location, { getState, match: { path: [], params: {} } });
        if (res === null) {
            throw new Error('Route is not found. Did you forget to specify fallback route?');
        }
        return res;
    }
    getRouteSchemas(path) {
        let collection = this;
        let ind = 0;
        return {
            next() {
                if (ind < path.length) {
                    if (!collection) {
                        throw new Error(`Route ${path[ind]} is not found`);
                    }
                    const route = collection.getRouteSchemaById(path[ind]);
                    const res = { done: false, value: route };
                    if (routeHasNested(route)) {
                        collection = collection.getRouteNestedCollection(path[ind]);
                    }
                    else {
                        collection = null;
                    }
                    ind += 1;
                    return res;
                }
                return { done: true, value: null };
            },
            [Symbol.iterator]() {
                return this;
            },
        };
    }
    getRouteFullPath(routeId) {
        let parentCollection = this.parentCollection;
        let parentRouteSchema = this.parentRouteSchema;
        const path = [routeId];
        while (parentCollection && parentRouteSchema) {
            path.push(parentRouteSchema.id);
            parentRouteSchema = parentCollection.parentRouteSchema;
            parentCollection = parentCollection.parentCollection;
        }
        path.reverse();
        return path;
    }
    getFallbackMatch(path) {
        if (Array.isArray(path) && path.length > 1) {
            let nestedCollection = this;
            for (let ind = 0; ind < path.length - 1; ind += 1) {
                if (!nestedCollection.routeSchemaHasNested(path[ind])) {
                    break;
                }
                nestedCollection = nestedCollection.getRouteNestedCollection(path[ind]);
            }
            while (nestedCollection) {
                if (nestedCollection.fallbackId !== null) {
                    return {
                        path: nestedCollection.getRouteFullPath(nestedCollection.fallbackId),
                        params: {},
                    };
                }
                nestedCollection = nestedCollection.parentCollection;
            }
        }
        if (this.fallbackId === null) {
            throw new Error('You must specify at least one fallback route');
        }
        return { path: [this.fallbackId], params: {} };
    }
    isFallbackPath(path) {
        const routes = Array.from(this.getRouteSchemas(path));
        return routes[routes.length - 1].type === 'fallback';
    }
    buildUrl(path, params, getState) {
        let url = '';
        const routeId = path[0];
        const route = this.getRouteSchemaById(routeId);
        switch (route.type) {
            case 'static': {
                url = route.path.endsWith('$') ? route.path.slice(0, -1) : route.path;
                break;
            }
            case 'dynamic': {
                url = route.buildUrl(params, { getState });
                break;
            }
        }
        if (path.length > 1) {
            const nestedCollection = this.getRouteNestedCollection(routeId);
            url = `${url}${nestedCollection.buildUrl(path.slice(1), params, getState)}`;
        }
        if (url.startsWith('//')) {
            url = url.slice(1);
        }
        return url;
    }
}

const urlToRouterLocation = (url) => {
    if (url) {
        const [pathname, ...rest] = url.split('?');
        const search = rest.length > 0 ? `?${rest.join('?')}` : '';
        return { pathname, search };
    }
    return { pathname: '', search: '' };
};
const locationToUrl = (location) => `${location.pathname}${location.search}`;
const isNotTheSameLocations = ({ pathname: pathname1 = '', search: search1 = '' } = { pathname: '', search: '' }, { pathname: pathname2 = '', search: search2 = '' } = { pathname: '', search: '' }) => pathname1 !== pathname2 || search1 !== search2;

var createApplyMatch = ({ routes, ssr }) => {
    const runTasks = [];
    return function* applyMatch({ match }) {
        const prevMatch = yield effects.select(getMatch);
        yield effects.cancel(runTasks);
        runTasks.splice(0);
        yield effects.put(setMatch(match));
        for (const routeSchema of routes.getRouteSchemas(match.path)) {
            if ('onEnter' in routeSchema) {
                const onEnter = routeSchema.onEnter;
                if (ssr) {
                    yield effects.call(onEnter, { ssr, prevMatch });
                }
                else {
                    runTasks.push(yield effects.fork(onEnter, { ssr, prevMatch }));
                }
            }
        }
    };
};

const getUrlFromGoToAction = ({ routes, getState }, action$$1) => {
    return 'url' in action$$1.payload
        ? action$$1.payload.url
        : routes.buildUrl(action$$1.payload.path, action$$1.payload.params, getState);
};
function* setFallbackMatch({ routes, applyMatch }) {
    const match = yield effects.select(getMatch);
    const fallbackMatch = routes.getFallbackMatch(match.path);
    yield effects.call(applyMatch, { match: fallbackMatch });
}
function* handleNotFound({ routes, applyMatch }, action$$1) {
    yield effects.call(setFallbackMatch, { routes, applyMatch });
}
function handleGoBack() {
    if (history$1 !== null) {
        history$1.back();
    }
}
function* handleGoTo({ routes, applyMatch, getState }, action$$1) {
    const nextLocation = urlToRouterLocation(getUrlFromGoToAction({ routes, getState }, action$$1));
    let match;
    if ('url' in action$$1.payload) {
        match = routes.getMatch(nextLocation, getState);
    }
    else {
        match = { path: action$$1.payload.path, params: action$$1.payload.params };
    }
    yield effects.put(setLocation(nextLocation));
    if (history$1 !== null) {
        if (isNotTheSameLocations(history$1.location, nextLocation)) {
            if (action$$1.payload.replace) {
                history$1.replace(locationToUrl(nextLocation));
            }
            else {
                history$1.push(locationToUrl(nextLocation));
            }
        }
    }
    yield effects.call(applyMatch, { match });
}
function createRouterSaga({ routes, serverLocation, store }) {
    const ssr = Boolean(serverLocation);
    const applyMatch = createApplyMatch({ routes, ssr });
    if (history$1) {
        history$1.listen(location => {
            const currentLocation = getLocation(store.getState());
            if (!currentLocation || isNotTheSameLocations(location, currentLocation)) {
                const match = routes.getMatch(location, store.getState);
                store.dispatch(goTo(match));
            }
        });
    }
    return function* routerSaga() {
        let startLocation = serverLocation;
        if (!startLocation) {
            if (typeof window === 'object' && window.location) {
                startLocation = {
                    pathname: window.location.pathname,
                    search: window.location.search,
                };
            }
            else {
                throw new Error('You must provide serverLocation');
            }
        }
        if (ssr) {
            yield effects.put(setLocation(startLocation));
            const match = routes.getMatch(startLocation, store.getState);
            const { notFoundAction, goToAction } = yield effects.race({
                _: effects.call(applyMatch, { match }),
                notFoundAction: effects.take(getType(notFound)),
                goToAction: effects.take(getType(goTo)),
            });
            if (notFoundAction) {
                yield effects.put(setServerResponse({ status: 404 }));
                yield effects.call(setFallbackMatch, { routes, applyMatch });
            }
            else if (goToAction) {
                const location = getUrlFromGoToAction({ routes, getState: store.getState }, goToAction);
                yield effects.put(setServerResponse({
                    location,
                    status: goToAction.payload.replace ? 301 : 302,
                }));
            }
            else if (routes.isFallbackPath(match.path)) {
                yield effects.put(setServerResponse({ status: 404 }));
            }
            else {
                yield effects.put(setServerResponse({ status: 200 }));
            }
            return;
        }
        const params = { routes, applyMatch, getState: store.getState };
        yield effects.takeLatest(getType(notFound), handleNotFound, params);
        yield effects.takeLatest(getType(goTo), handleGoTo, params);
        yield effects.takeLatest(getType(goBack), handleGoBack);
        const currentMatch = yield effects.select(getMatch);
        if (currentMatch.path.length === 0) {
            const match = routes.getMatch(startLocation, store.getState);
            yield effects.put(goTo({ path: match.path, params: match.params }));
        }
        else {
            yield effects.call(applyMatch, { match: currentMatch });
        }
    };
}

const Routes = ({ routes, path }) => {
    if (routes && path.length > 0 && routes.hasRoute(path[0])) {
        const routeSchema = routes.getRouteSchemaById(path[0]);
        const nestRoutes = routes.routeSchemaHasNested(path[0]) ? routes.getRouteNestedCollection(path[0]) : null;
        const Component = routeSchema.component;
        if (Component) {
            return (React.createElement(RouteContext.Provider, { value: { path: path.slice(1) } },
                React.createElement(Component, { routes: nestRoutes })));
        }
        if (nestRoutes) {
            return (React.createElement(RouteContext.Provider, { value: { path: path.slice(1) } },
                React.createElement(Routes, { routes: nestRoutes, path: path.slice(1) })));
        }
    }
    return null;
};
var Routes$1 = (props) => (React.createElement(RouteContext.Consumer, null, ({ path }) => React.createElement(Routes, Object.assign({}, props, { path: path }))));

class RouterProvider extends React.Component {
    constructor() {
        super(...arguments);
        this.buildUrl = (to, params) => {
            return this.props.routes.buildUrl(to, params, this.props.getState);
        };
    }
    render() {
        const { match, routes, children } = this.props;
        if (match && match.path.length > 0) {
            return (React.createElement(RouterProviderContext.Provider, { value: { buildUrl: this.buildUrl } },
                React.createElement(RouteContext.Provider, { value: { path: match.path } }, children ? children : React.createElement(Routes$1, { routes: routes }))));
        }
        return null;
    }
}
const stateToProps = (state) => {
    invariant(state.router, 'Router state is not found. You must attach it under "router" key.');
    return {
        match: getMatch(state),
        getState: () => state,
    };
};
const ConnectedRouterProvider = reactRedux.connect(stateToProps)(RouterProvider);

const isModifiedEvent = (event) => Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
class Link extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {};
        this.onClick = (event) => {
            if (!event.defaultPrevented &&
                event.button === 0 &&
                !this.props.target &&
                !isModifiedEvent(event)) {
                event.preventDefault();
                if (history$1) {
                    if (Boolean(this.props.replace)) {
                        history$1.replace(this.state.href);
                    }
                    else {
                        history$1.push(this.state.href);
                    }
                }
            }
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        invariant(nextProps.to, 'You must specify the "to" property');
        if (prevState.propsTo !== nextProps.to || prevState.propsParams !== nextProps.params) {
            const to = Array.isArray(nextProps.to) ? nextProps.to : nextProps.to.split('.');
            const params = nextProps.params || {};
            return {
                to,
                params,
                propsTo: nextProps.to,
                propsParams: nextProps.params,
                href: nextProps.buildUrl(to, params),
            };
        }
        return null;
    }
    render() {
        const { className, children, style } = this.props;
        const { href } = this.state;
        return (React.createElement("a", { href: href, onClick: this.onClick, className: className, style: style }, children));
    }
}
Link.defaultProps = {
    replace: false,
};
const LinkWithBuildUrl = props => {
    return (React.createElement(RouterProviderContext.Consumer, null, ({ buildUrl }) => {
        return React.createElement(Link, Object.assign({}, props, { buildUrl: buildUrl }));
    }));
};

exports.RouterProvider = ConnectedRouterProvider;
exports.Link = LinkWithBuildUrl;
exports.Routes = Routes$1;
exports.RouterProviderContext = RouterProviderContext;
exports.reducer = routerReducer;
exports.createRouterSaga = createRouterSaga;
exports.getServerResponse = getServerResponse;
exports.getMatch = getMatch;
exports.getMatchPath = getMatchPath;
exports.getLocation = getLocation;
exports.getParams = getParams;
exports.goTo = goTo;
exports.setMatch = setMatch;
exports.setLocation = setLocation;
exports.notFound = notFound;
exports.goBack = goBack;
exports.setServerResponse = setServerResponse;
exports.urlToRouterLocation = urlToRouterLocation;
exports.locationToUrl = locationToUrl;
exports.isNotTheSameLocations = isNotTheSameLocations;
exports.RoutesCollection = RoutesCollection;
exports.matchLocation = matchLocation;
//# sourceMappingURL=react-rsrouter.js.map
