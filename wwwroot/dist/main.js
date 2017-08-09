/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(2))(6);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = Object.create(options.computed || null)
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
    options.computed = computed
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = vendor_4c7899ff6f47ad9763f9;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(38)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(35)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(20),
  /* template */
  __webpack_require__(31),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\学习\\03 其他事务\\校史竞赛系统\\POJECT\\SEU-History-Contest-System\\HistoryContest.Client\\Scripts\\components\\login\\login.vue.html"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] login.vue.html: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-55a30ee4", Component.options)
  } else {
    hotAPI.reload("data-v-55a30ee4", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * vue-validator v3.0.0-alpha.2 
 * (c) 2016 kazuya kawaguchi
 * Released under the MIT License.
 */


/*  */

function warn (msg, err) {
  if (window.console) {
    console.warn('[vue-validator] ' + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}

/*  */

// validator configrations
var validator = {
  classes: {}
};

var Config = function (Vue) {
  // define Vue.config.validator configration
  // $FlowFixMe: https://github.com/facebook/flow/issues/285
  Object.defineProperty(Vue.config, 'validator', {
    enumerable: true,
    configurable: true,
    get: function () { return validator },
    set: function (val) { validator = val; }
  });
};

/*  */
/**
 * build-in validators
 */

/**
 * required
 * This function validate whether the value has been filled out.
 */
function required (val, arg) {
  var isRequired = arg === undefined ? true : arg;
  if (Array.isArray(val)) {
    if (val.length !== 0) {
      var valid = true;
      for (var i = 0, l = val.length; i < l; i++) {
        valid = required(val[i], isRequired);
        if ((isRequired && !valid) || (!isRequired && valid)) {
          break
        }
      }
      return valid
    } else {
      return !isRequired
    }
  } else if (typeof val === 'number' || typeof val === 'function') {
    return isRequired
  } else if (typeof val === 'boolean') {
    return val === isRequired
  } else if (typeof val === 'string') {
    return isRequired ? (val.length > 0) : (val.length <= 0)
  } else if (val !== null && typeof val === 'object') {
    return isRequired ? (Object.keys(val).length > 0) : (Object.keys(val).length <= 0)
  } else if (val === null || val === undefined) {
    return !isRequired
  } else {
    return !isRequired
  }
}

/**
 * pattern
 * This function validate whether the value matches the regex pattern
 */
function pattern (val, pat) {
  if (typeof pat !== 'string') { return false }

  var match = pat.match(new RegExp('^/(.*?)/([gimy]*)$'));
  if (!match) { return false }

  return new RegExp(match[1], match[2]).test(val)
}

/**
 * minlength
 * This function validate whether the minimum length.
 */
function minlength (val, min) {
  if (typeof val === 'string') {
    return isInteger(min, 10) && val.length >= parseInt(min, 10)
  } else if (Array.isArray(val)) {
    return val.length >= parseInt(min, 10)
  } else {
    return false
  }
}

/**
 * maxlength
 * This function validate whether the maximum length.
 */
function maxlength (val, max) {
  if (typeof val === 'string') {
    return isInteger(max, 10) && val.length <= parseInt(max, 10)
  } else if (Array.isArray(val)) {
    return val.length <= parseInt(max, 10)
  } else {
    return false
  }
}

/**
 * min
 * This function validate whether the minimum value of the numberable value.
 */
function min (val, arg) {
  return !isNaN(+(val)) && !isNaN(+(arg)) && (+(val) >= +(arg))
}

/**
 * max
 * This function validate whether the maximum value of the numberable value.
 */
function max (val, arg) {
  return !isNaN(+(val)) && !isNaN(+(arg)) && (+(val) <= +(arg))
}

/**
 * isInteger
 * This function check whether the value of the string is integer.
 */
function isInteger (val) {
  return /^(-?[1-9]\d*|0)$/.test(val)
}


var validators = Object.freeze({
	required: required,
	pattern: pattern,
	minlength: minlength,
	maxlength: maxlength,
	min: min,
	max: max
});

/*  */
var Asset = function (Vue) {
  var ref = Vue.util;
  var extend = ref.extend;

  // set global validators asset
  var assets = Object.create(null);
  extend(assets, validators);
  Vue.options.validators = assets;

  // set option merge strategy
  var strats = Vue.config.optionMergeStrategies;
  if (strats) {
    strats.validators = function (parent, child) {
      if (!child) { return parent }
      if (!parent) { return child }
      var ret = Object.create(null);
      extend(ret, parent);
      var key;
      for (key in child) {
        ret[key] = child[key];
      }
      return ret
    };
  }

  /**
   * Register or retrieve a global validator definition.
   */
  function validator (
    id,
    def
  ) {
    if (def === undefined) {
      return Vue.options['validators'][id]
    } else {
      Vue.options['validators'][id] = def;
      if (def === null) {
        delete Vue.options['validators']['id'];
      }
    }
  }
  Vue['validator'] = validator;
};

/*  */

var Group = function (Vue) {
  var ref = Vue.util;
  var extend = ref.extend;

  return {
    data: function data () {
      return {
        valid: true,
        dirty: false,
        touched: false,
        modified: false,
        results: {}
      }
    },
    computed: {
      invalid: function invalid () { return !this.valid },
      pristine: function pristine () { return !this.dirty },
      untouched: function untouched () { return !this.touched },
      result: function result () {
        var ret = {
          valid: this.valid,
          invalid: this.invalid,
          dirty: this.dirty,
          pristine: this.pristine,
          touched: this.touched,
          untouched: this.untouched,
          modified: this.modified
        };
        var results = this.results;
        this._validityKeys.forEach(function (key) {
          ret[key] = results[key];
          if (ret[key].errors) {
            var errors = ret.errors || [];
            ret[key].errors.forEach(function (error) {
              errors.push(error);
            });
            ret.errors = errors;
          }
        });
        return ret
      }
    },
    watch: {
      results: function results (val, old) {
        var keys = this._validityKeys;
        var results = this.results;
        this.valid = this.checkResults(keys, results, 'valid', true);
        this.dirty = this.checkResults(keys, results, 'dirty', false);
        this.touched = this.checkResults(keys, results, 'touched', false);
        this.modified = this.checkResults(keys, results, 'modified', false);
      }
    },
    created: function created () {
      this._validities = Object.create(null);
      this._validityWatchers = Object.create(null);
      this._validityKeys = [];
      this._committing = false;
    },
    destroyed: function destroyed () {
      var this$1 = this;

      this._validityKeys.forEach(function (key) {
        this$1._validityWatchers[key]();
        delete this$1._validityWatchers[key];
        delete this$1._validities[key];
      });
      delete this._validityWatchers;
      delete this._validities;
      delete this._validityKeys;
    },
    methods: {
      register: function register (name, validity) {
        var this$1 = this;

        this._validities[name] = validity;
        this._validityKeys = Object.keys(this._validities);
        this.setResults(name, {});
        this.withCommit(function () {
          this$1._validityWatchers[name] = validity.$watch('result', function (val, old) {
            this$1.setResults(name, val);
          }, { deep: true, immediate: true });
        });
      },
      unregister: function unregister (name) {
        var this$1 = this;

        this._validityWatchers[name]();
        delete this._validityWatchers[name];
        delete this._validities[name];
        this._validityKeys = Object.keys(this._validities);
        this.withCommit(function () {
          this$1.resetResults(name);
        });
      },
      validityCount: function validityCount () {
        return this._validityKeys.length
      },
      isRegistered: function isRegistered (name) {
        return name in this._validities
      },
      getValidityKeys: function getValidityKeys () {
        return this._validityKeys
      },
      checkResults: function checkResults (
        keys,
        results,
        prop,
        checking
      ) {
        var ret = checking;
        for (var i = 0; i < keys.length; i++) {
          var result = results[keys[i]];
          if (result[prop] !== checking) {
            ret = !checking;
            break
          }
        }
        return ret
      },
      setResults: function setResults (name, val) {
        var this$1 = this;

        var newVal = {};
        this._validityKeys.forEach(function (key) {
          newVal[key] = extend({}, this$1.results[key]);
        });
        newVal[name] = extend({}, val);
        this.results = newVal;
      },
      resetResults: function resetResults (ignore) {
        var this$1 = this;

        var newVal = {};
        this._validityKeys.forEach(function (key) {
          if (ignore && ignore !== key) {
            newVal[key] = extend({}, this$1.results[key]);
          }
        });
        this.results = newVal;
      },
      withCommit: function withCommit (fn) {
        var committing = this._committing;
        this._committing = true;
        fn();
        this._committing = committing;
      }
    }
  }
};

/*  */
var ValidationClass = function (Vue) {
  var ValidityGroup = Group(Vue);

  var Validation = function Validation (options) {
    if ( options === void 0 ) options = {};

    this._result = {};
    this._host = options.host;
    this._named = Object.create(null);
    this._group = Object.create(null);
    this._validities = Object.create(null);
    this._beginDestroy = false;
    Vue.util.defineReactive(this._host, '$validation', this._result);
  };

  Validation.prototype.register = function register (
    field,
    validity,
    options
  ) {
      if ( options === void 0 ) options = {};

    // NOTE: lazy setup (in constructor, occured callstack recursive errors ...)
    if (!this._validityManager) {
      this._validityManager = new Vue(ValidityGroup);
      this._watchValidityResult();
    }

    if (this._validities[field]) {
      // TODO: should be output console.error
      return
    }
    this._validities[field] = validity;

    var named = options.named;
      var group = options.group;
    var groupValidity = group
      ? this._getValidityGroup('group', group) || this._registerValidityGroup('group', group)
      : null;
    var namedValidity = named
      ? this._getValidityGroup('named', named) || this._registerValidityGroup('named', named)
      : null;
    if (named && group && namedValidity && groupValidity) {
      groupValidity.register(field, validity);
      !namedValidity.isRegistered(group) && namedValidity.register(group, groupValidity);
      !this._validityManager.isRegistered(named) && this._validityManager.register(named, namedValidity);
    } else if (namedValidity) {
      namedValidity.register(field, validity);
      !this._validityManager.isRegistered(named) && this._validityManager.register(named, namedValidity);
    } else if (groupValidity) {
      groupValidity.register(field, validity);
      !this._validityManager.isRegistered(group) && this._validityManager.register(group, groupValidity);
    } else {
      this._validityManager.register(field, validity);
    }
  };

  Validation.prototype.unregister = function unregister (
    field,
    options
  ) {
      if ( options === void 0 ) options = {};

    if (!this._validityManager) {
      // TODO: should be output error
      return
    }

    if (!this._validities[field]) {
      // TODO: should be output error
      return
    }
    delete this._validities[field];

    var named = options.named;
      var group = options.group;
    var groupValidity = group ? this._getValidityGroup('group', group) : null;
    var namedValidity = named ? this._getValidityGroup('named', named) : null;
    if (named && group && namedValidity && groupValidity) {
      groupValidity.unregister(field);
      if (groupValidity.validityCount() === 0) {
        namedValidity.isRegistered(group) && namedValidity.unregister(group);
        this._unregisterValidityGroup('group', group);
      }
      if (namedValidity.validityCount() === 0) {
        this._validityManager.isRegistered(named) && this._validityManager.unregister(named);
        this._unregisterValidityGroup('named', named);
      }
    } else if (named && namedValidity) {
      namedValidity.unregister(field);
      if (namedValidity.validityCount() === 0) {
        this._validityManager.isRegistered(named) && this._validityManager.unregister(named);
        this._unregisterValidityGroup('named', named);
      }
    } else if (group && groupValidity) {
      groupValidity.unregister(field);
      if (groupValidity.validityCount() === 0) {
        this._validityManager.isRegistered(group) && this._validityManager.unregister(group);
        this._unregisterValidityGroup('group', group);
      }
    } else {
      this._validityManager.unregister(field);
    }
  };

  Validation.prototype.destroy = function destroy () {
      var this$1 = this;

    var validityKeys = Object.keys(this._validities);
    var namedKeys = Object.keys(this._named);
    var groupKeys = Object.keys(this._group);

    // unregister validity
    validityKeys.forEach(function (validityKey) {
      groupKeys.forEach(function (groupKey) {
        var group = this$1._getValidityGroup('group', groupKey);
        if (group && group.isRegistered(groupKey)) {
          group.unregister(validityKey);
        }
      });
      namedKeys.forEach(function (namedKey) {
        var named = this$1._getValidityGroup('named', namedKey);
        if (named && named.isRegistered(validityKey)) {
          named.unregister(validityKey);
        }
      });
      if (this$1._validityManager.isRegistered(validityKey)) {
        this$1._validityManager.unregister(validityKey);
      }
      delete this$1._validities[validityKey];
    });

    // unregister grouped validity
    groupKeys.forEach(function (groupKey) {
      namedKeys.forEach(function (namedKey) {
        var named = this$1._getValidityGroup('named', namedKey);
        if (named && named.isRegistered(groupKey)) {
          named.unregister(groupKey);
        }
      });
      if (this$1._validityManager.isRegistered(groupKey)) {
        this$1._validityManager.unregister(groupKey);
      }
      this$1._unregisterValidityGroup('group', groupKey);
    });

    // unregister named validity
    namedKeys.forEach(function (namedKey) {
      if (this$1._validityManager.isRegistered(namedKey)) {
        this$1._validityManager.unregister(namedKey);
      }
      this$1._unregisterValidityGroup('named', namedKey);
    });

    this._beginDestroy = true;
  };

  Validation.prototype._getValidityGroup = function _getValidityGroup (type, name) {
    return type === 'named' ? this._named[name] : this._group[name]
  };

  Validation.prototype._registerValidityGroup = function _registerValidityGroup (type, name) {
    var groups = type === 'named' ? this._named : this._group;
    groups[name] = new Vue(ValidityGroup);
    return groups[name]
  };

  Validation.prototype._unregisterValidityGroup = function _unregisterValidityGroup (type, name) {
    var groups = type === 'named' ? this._named : this._group;
    if (!groups[name]) {
      // TODO: should be warn
      return
    }

    groups[name].$destroy();
    delete groups[name];
  };

  Validation.prototype._watchValidityResult = function _watchValidityResult () {
      var this$1 = this;

    this._watcher = this._validityManager.$watch('results', function (val, old) {
      Vue.set(this$1._host, '$validation', val);
      if (this$1._beginDestroy) {
        this$1._destroyValidityMananger();
      }
    }, { deep: true });
  };

  Validation.prototype._unwatchValidityResult = function _unwatchValidityResult () {
    this._watcher();
    delete this._watcher;
  };

  Validation.prototype._destroyValidityMananger = function _destroyValidityMananger () {
    this._unwatchValidityResult();
    this._validityManager.$destroy();
    this._validityManager = null;
  };

  return Validation
};

/*  */

var Mixin = function (Vue) {
  var Validation = ValidationClass(Vue);

  return {
    beforeCreate: function beforeCreate () {
      this._validation = new Validation({ host: this });
    }
  }
};

/*  */

var baseProps = {
  field: {
    type: String,
    required: true
  },
  validators: {
    type: [String, Array, Object],
    required: true
  },
  group: {
    type: String
  },
  multiple: {
    type: Boolean
  },
  autotouch: {
    type: String,
    default: function () {
      return 'on'
    }
  },
  classes: {
    type: Object,
    default: function () {
      return {}
    }
  }
};

var DEFAULT_CLASSES = {
  valid: 'valid',
  invalid: 'invalid',
  touched: 'touched',
  untouched: 'untouched',
  pristine: 'pristine',
  dirty: 'dirty',
  modified: 'modified'
};

/*  */
var States = function (Vue) {
  var ref = Vue.util;
  var extend = ref.extend;
  var isPlainObject = ref.isPlainObject;

  function initialStates (states, validators, init) {
    if ( init === void 0 ) init = undefined;

    if (Array.isArray(validators)) {
      validators.forEach(function (validator) {
        states[validator] = init;
      });
    } else {
      Object.keys(validators).forEach(function (validator) {
        var props = (validators[validator] &&
          validators[validator]['props'] &&
          isPlainObject(validators[validator]['props']))
            ? validators[validator]['props']
            : null;
        if (props) {
          Object.keys(props).forEach(function (prop) {
            states[validator] = {};
            states[validator][prop] = init;
          });
        } else {
          states[validator] = init;
        }
      });
    }
  }

  function getInitialResults (validators) {
    var results = {};
    initialStates(results, validators, undefined);
    return results
  }

  function getInitialProgresses (validators) {
    var progresses = {};
    initialStates(progresses, validators, '');
    return progresses
  }

  var props = extend({
    child: {
      type: Object,
      required: true
    },
    value: {
      type: Object
    }
  }, baseProps);

  function data () {
    var validators = nomalizeValidators(this.validators);
    return {
      results: getInitialResults(validators),
      valid: true,
      dirty: false,
      touched: false,
      modified: false,
      progresses: getInitialProgresses(validators)
    }
  }

  return {
    props: props,
    data: data
  }
};

function nomalizeValidators (target) {
  return typeof target === 'string' ? [target] : target
}

/*  */

var Computed = function (Vue) {
  var ref = Vue.util;
  var isPlainObject = ref.isPlainObject;

  function setError (
    result,
    field,
    validator,
    message,
    prop
  ) {
    var error = { field: field, validator: validator };
    if (message) {
      error.message = message;
    }
    if (prop) {
      error.prop = prop;
    }
    result.errors = result.errors || [];
    result.errors.push(error);
  }

  function walkProgresses (keys, target) {
    var progress = '';
    for (var i = 0; i < keys.length; i++) {
      var result = target[keys[i]];
      if (typeof result === 'string' && result) {
        progress = result;
        break
      }
      if (isPlainObject(result)) {
        var nestedKeys = Object.keys(result);
        progress = walkProgresses(nestedKeys, result);
        if (!progress) {
          break
        }
      }
    }
    return progress
  }

  function invalid () {
    return !this.valid
  }

  function pristine () {
    return !this.dirty
  }

  function untouched () {
    return !this.touched
  }

  function result () {
    var this$1 = this;

    var ret = {
      valid: this.valid,
      invalid: this.invalid,
      dirty: this.dirty,
      pristine: this.pristine,
      touched: this.touched,
      untouched: this.untouched,
      modified: this.modified
    };

    var keys = this._keysCached(this._uid.toString(), this.results);
    keys.forEach(function (validator) {
      var result = this$1.results[validator];
      if (typeof result === 'boolean') {
        if (result) {
          ret[validator] = false;
        } else {
          setError(ret, this$1.field, validator);
          ret[validator] = !result;
        }
      } else if (typeof result === 'string') {
        setError(ret, this$1.field, validator, result);
        ret[validator] = result;
      } else if (isPlainObject(result)) { // object
        var props = Object.keys(result);
        props.forEach(function (prop) {
          var propRet = result[prop];
          ret[prop] = ret[prop] || {};
          if (typeof propRet === 'boolean') {
            if (propRet) {
              ret[prop][validator] = false;
            } else {
              setError(ret, this$1.field, validator, undefined, prop);
              ret[prop][validator] = !propRet;
            }
          } else if (typeof propRet === 'string') {
            setError(ret, this$1.field, validator, propRet, prop);
            ret[prop][validator] = propRet;
          } else {
            ret[prop][validator] = false;
          }
        });
      } else {
        ret[validator] = false;
      }
    });

    return ret
  }

  function progress () {
    var ret = '';
    ret = walkProgresses(
      this._keysCached(this._uid.toString(), this.results),
      this.progresses
    );
    return ret
  }

  return {
    invalid: invalid,
    pristine: pristine,
    untouched: untouched,
    result: result,
    progress: progress
  }
};

/*  */

var Render = function (Vue) {
  return {
    render: function render (h) {
      return this.child
    }
  }
};

/*  */

var SingleElementClass = function (Vue) {
  var ref = Vue.util;
  var looseEqual = ref.looseEqual;

  var SingleElement = function SingleElement (vm) {
    this._vm = vm;
    this.initValue = this.getValue();
    this.attachValidity();
  };

  SingleElement.prototype.attachValidity = function attachValidity () {
    this._vm.$el.$validity = this._vm;
  };

  SingleElement.prototype.getValue = function getValue () {
    var el = this._vm.$el;
    if (el.tagName === 'SELECT') {
      return getSelectValue(el)
    } else {
      if (el.type === 'checkbox') {
        return el.checked
      } else {
        return el.value
      }
    }
  };

  SingleElement.prototype.checkModified = function checkModified () {
    var el = this._vm.$el;
    if (el.tagName === 'SELECT') {
      return !looseEqual(this.initValue, getSelectValue(el))
    } else {
      if (el.type === 'checkbox') {
        return !looseEqual(this.initValue, el.checked)
      } else {
        return !looseEqual(this.initValue, el.value)
      }
    }
  };

  SingleElement.prototype.listenToucheableEvent = function listenToucheableEvent () {
    this._vm.$el.addEventListener('focusout', this._vm.willUpdateTouched);
  };

  SingleElement.prototype.unlistenToucheableEvent = function unlistenToucheableEvent () {
    this._vm.$el.removeEventListener('focusout', this._vm.willUpdateTouched);
  };

  SingleElement.prototype.listenInputableEvent = function listenInputableEvent () {
    var vm = this._vm;
    var el = vm.$el;
    if (el.tagName === 'SELECT') {
      el.addEventListener('change', vm.handleInputable);
    } else {
      if (el.type === 'checkbox') {
        el.addEventListener('change', vm.handleInputable);
      } else {
        el.addEventListener('input', vm.handleInputable);
      }
    }
  };

  SingleElement.prototype.unlistenInputableEvent = function unlistenInputableEvent () {
    var vm = this._vm;
    var el = vm.$el;
    if (el.tagName === 'SELECT') {
      el.removeEventListener('change', vm.handleInputable);
    } else {
      if (el.type === 'checkbox') {
        el.removeEventListener('change', vm.handleInputable);
      } else {
        el.removeEventListener('input', vm.handleInputable);
      }
    }
  };

  return SingleElement
};

function getSelectValue (el) {
  var value = [];
  for (var i = 0, l = el.options.length; i < l; i++) {
    var option = el.options[i];
    if (!option.disabled && option.selected) {
      value.push(option.value);
    }
  }
  return value
}

/*  */

var MultiElementClass = function (Vue) {
  var ref = Vue.util;
  var looseEqual = ref.looseEqual;

  var MultiElement = function MultiElement (vm) {
    // TODO: should be checked whether included radio or checkbox
    this._vm = vm;
    this.initValue = this.getValue();
    this.attachValidity();
  };

  MultiElement.prototype.attachValidity = function attachValidity () {
      var this$1 = this;

    this._vm.$el.$validity = this._vm;
    this._eachItems(function (item) {
      item.$validity = this$1._vm;
    });
  };

  MultiElement.prototype.getValue = function getValue () {
    return this._getCheckedValue()
  };

  MultiElement.prototype.checkModified = function checkModified () {
    return !looseEqual(this.initValue, this._getCheckedValue())
  };

  MultiElement.prototype.listenToucheableEvent = function listenToucheableEvent () {
      var this$1 = this;

    this._eachItems(function (item) {
      item.addEventListener('focusout', this$1._vm.willUpdateTouched);
    });
  };

  MultiElement.prototype.unlistenToucheableEvent = function unlistenToucheableEvent () {
      var this$1 = this;

    this._eachItems(function (item) {
      item.removeEventListener('focusout', this$1._vm.willUpdateTouched);
    });
  };

  MultiElement.prototype.listenInputableEvent = function listenInputableEvent () {
      var this$1 = this;

    this._eachItems(function (item) {
      item.addEventListener('change', this$1._vm.handleInputable);
    });
  };

  MultiElement.prototype.unlistenInputableEvent = function unlistenInputableEvent () {
      var this$1 = this;

    this._eachItems(function (item) {
      item.removeEventListener('change', this$1._vm.handleInputable);
    });
  };

  MultiElement.prototype._getCheckedValue = function _getCheckedValue () {
    var value = [];
    this._eachItems(function (item) {
      if (!item.disabled && item.checked) {
        value.push(item.value);
      }
    });
    return value
  };

  MultiElement.prototype._getItems = function _getItems () {
    return this._vm.$el.querySelectorAll('input[type="checkbox"], input[type="radio"]')
  };

  MultiElement.prototype._eachItems = function _eachItems (cb) {
    var items = this._getItems();
    for (var i = 0; i < items.length; i++) {
      cb(items[i]);
    }
  };

  return MultiElement
};

/*  */

var inBrowser =
  typeof window !== 'undefined' &&
  Object.prototype.toString.call(window) !== '[object Object]';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;

function getClass (el) {
  var classname = el.className;
  if (typeof classname === 'object') {
    classname = classname.baseVal || '';
  }
  return classname
}

function setClass (el, cls) {
  if (isIE9 && !/svg$/.test(el.namespaceURI)) {
    el.className = cls;
  } else {
    el.setAttribute('class', cls);
  }
}

function addClass (el, cls) {
  if (el.classList) {
    el.classList.add(cls);
  } else {
    var cur = ' ' + getClass(el) + ' ';
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      setClass(el, (cur + cls).trim());
    }
  }
}

function removeClass (el, cls) {
  if (el.classList) {
    el.classList.remove(cls);
  } else {
    var cur = ' ' + getClass(el) + ' ';
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    setClass(el, cur.trim());
  }
  if (!el.className) {
    el.removeAttribute('class');
  }
}

function toggleClasses (el, key, fn) {
  if (!el) { return }

  key = key.trim();
  if (key.indexOf(' ') === -1) {
    fn(el, key);
    return
  }

  var keys = key.split(/\s+/);
  for (var i = 0, l = keys.length; i < l; i++) {
    fn(el, keys[i]);
  }
}

function memoize (fn) {
  var cache = Object.create(null);
  return function memoizeFn (id) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    var hit = cache[id];
    return hit || (cache[id] = fn.apply(void 0, args))
  }
}

/*  */
var ComponentElementClass = function (Vue) {
  var ref = Vue.util;
  var looseEqual = ref.looseEqual;
  var isPlainObject = ref.isPlainObject;

  function getValidatorProps (validators) {
    var normalized = typeof validators === 'string' ? [validators] : validators;
    var targets = [];
    if (isPlainObject(normalized)) {
      Object.keys(normalized).forEach(function (validator) {
        var props = (normalized[validator] &&
          normalized[validator]['props'] &&
          isPlainObject(normalized[validator]['props']))
            ? normalized[validator]['props']
            : null;
        if (props) {
          Object.keys(props).forEach(function (prop) {
            if (!~targets.indexOf(prop)) {
              targets.push(prop);
            }
          });
        }
      });
    }
    return targets
  }

  var ComponentElement = function ComponentElement (vm, vnode, validatorProps) {
    this._vm = vm;
    this._vnode = vnode;
    this._validatorProps = validatorProps || memoize(getValidatorProps);
    this.initValue = this.getValue();
    this._watchers = [];
    this.attachValidity();
  };

  ComponentElement.prototype.attachValidity = function attachValidity () {
    this._vm.$el.$validity = this._vm;
  };

  ComponentElement.prototype.getValidatorProps = function getValidatorProps$1 () {
    var vm = this._vm;
    return this._validatorProps(vm._uid.toString(), vm.validators)
  };

  ComponentElement.prototype.getValue = function getValue () {
      var this$1 = this;

    var value = {};
    this.getValidatorProps().forEach(function (prop) {
      value[prop] = this$1._vnode.child[prop];
    });
    return value
  };

  ComponentElement.prototype.checkModified = function checkModified () {
    return !looseEqual(this.initValue, this.getValue())
  };

  ComponentElement.prototype.listenToucheableEvent = function listenToucheableEvent () {
    this._vm.$el.addEventListener('focusout', this._vm.willUpdateTouched);
  };

  ComponentElement.prototype.unlistenToucheableEvent = function unlistenToucheableEvent () {
    this._vm.$el.removeEventListener('focusout', this._vm.willUpdateTouched);
  };

  ComponentElement.prototype.listenInputableEvent = function listenInputableEvent () {
      var this$1 = this;

    this.getValidatorProps().forEach(function (prop) {
      this$1._watchers.push(this$1._vnode.child.$watch(prop, this$1._vm.watchInputable));
    });
  };

  ComponentElement.prototype.unlistenInputableEvent = function unlistenInputableEvent () {
    this._watchers.forEach(function (watcher) { watcher(); });
    this._watchers = [];
  };

  return ComponentElement
};

/*  */
var Elements = function (Vue) {
  var SingleElement = SingleElementClass(Vue);
  var MultiElement = MultiElementClass(Vue);
  var ComponentElement = ComponentElementClass(Vue);

  return {
    SingleElement: SingleElement,
    MultiElement: MultiElement,
    ComponentElement: ComponentElement
  }
};

/*  */
var Lifecycles = function (Vue) {
  var ref = Elements(Vue);
  var SingleElement = ref.SingleElement;
  var MultiElement = ref.MultiElement;
  var ComponentElement = ref.ComponentElement;

  function createValidityElement (vm, vnode) {
    return vm.multiple
      ? new MultiElement(vm)
      : checkBuiltInElement(vnode)
        ? new SingleElement(vm)
        : checkComponentElement(vnode)
          ? new ComponentElement(vm, vnode)
          : null
  }

  function watchModelable (val) {
    this.$emit('input', {
      result: this.result,
      progress: this.progress,
      progresses: this.progresses
    });
  }

  function created () {
    this._elementable = null;

    this._keysCached = memoize(function (results) {
      return Object.keys(results)
    });

    // for event control flags
    this._modified = false;

    // watch validation raw results
    this._watchValidationRawResults();

    var validation = this.$options.propsData ? this.$options.propsData.validation : null;
    if (validation) {
      var instance = validation.instance;
      var name = validation.name;
      var group = this.group;
      instance.register(this.field, this, { named: name, group: group });
    }
  }

  function destroyed () {
    var validation = this.$options.propsData ? this.$options.propsData.validation : null;
    if (validation) {
      var instance = validation.instance;
      var name = validation.name;
      var group = this.group;
      instance.unregister(this.field, { named: name, group: group });
    }

    if (this._unwatchResultProp) {
      this._unwatchResultProp();
      this._unwatchResultProp = null;
    }

    if (this._unwatchProgressProp) {
      this._unwatchProgressProp();
      this._unwatchProgressProp = null;
    }

    this._unwatchValidationRawResults();

    this._elementable.unlistenInputableEvent();
    if (this.autotouch === 'on') {
      this._elementable.unlistenToucheableEvent();
    }
    this._elementable = null;
  }

  function mounted () {
    this._elementable = createValidityElement(this, this._vnode);
    if (this._elementable) {
      if (this.autotouch === 'on') {
        this._elementable.listenToucheableEvent();
      }
      this._elementable.listenInputableEvent();
    } else {
      // TODO: should be warn
    }

    if (hasModelDirective(this.$vnode)) {
      this._unwatchResultProp = this.$watch('result', watchModelable);
      this._unwatchProgressProp = this.$watch('progress', watchModelable);
    }

    toggleClasses(this.$el, this.classes.untouched, addClass);
    toggleClasses(this.$el, this.classes.pristine, addClass);
  }

  return {
    created: created,
    destroyed: destroyed,
    mounted: mounted
  }
};

function checkComponentElement (vnode) {
  return vnode.child &&
    vnode.componentOptions &&
    vnode.tag &&
    vnode.tag.match(/vue-component/)
}

function checkBuiltInElement (vnode) {
  return !vnode.child &&
    !vnode.componentOptions &&
    vnode.tag
}

function hasModelDirective (vnode) {
  return ((vnode && vnode.data && vnode.data.directives) || []).find(function (dir) { return dir.name === 'model'; })
}

/*  */

var Event = function (Vue) {
  function _fireEvent (type) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    (ref = this).$emit.apply(ref, [ type ].concat( args ));
    var ref;
  }

  return {
    _fireEvent: _fireEvent
  }
};

/*  */
var State = function (Vue) {
  var ref = Vue.util;
  var isPlainObject = ref.isPlainObject;

  function getValue (options) {
    return this._elementable.getValue()
  }

  function checkModified () {
    return this._elementable.checkModified()
  }

  function willUpdateTouched (options) {
    if (!this.touched) {
      this.touched = true;
      toggleClasses(this.$el, this.classes.touched, addClass);
      toggleClasses(this.$el, this.classes.untouched, removeClass);
      this._fireEvent('touched');
    }
  }

  function willUpdateDirty () {
    if (!this.dirty && this.checkModified()) {
      this.dirty = true;
      toggleClasses(this.$el, this.classes.dirty, addClass);
      toggleClasses(this.$el, this.classes.pristine, removeClass);
      this._fireEvent('dirty');
    }
  }

  function willUpdateModified () {
    var modified = this.modified = this.checkModified();
    if (this._modified !== modified) {
      this._modified = modified;
      toggleClasses(this.$el, this.classes.modified, modified ? addClass : removeClass);
      this._fireEvent('modified', modified);
    }
  }

  function handleInputable (e) {
    this.willUpdateDirty();
    this.willUpdateModified();
  }

  function watchInputable (val) {
    this.willUpdateDirty();
    this.willUpdateModified();
  }

  function _initStates (keys, target, init) {
    if ( init === void 0 ) init = undefined;

    for (var i = 0; i < keys.length; i++) {
      var result = target[keys[i]];
      if (isPlainObject(result)) {
        var nestedKeys = Object.keys(result);
        _initStates(nestedKeys, result, init);
      } else {
        target[keys[i]] = init;
      }
    }
  }

  function reset () {
    this._unwatchValidationRawResults();
    var keys = this._keysCached(this._uid.toString(), this.results);
    _initStates(keys, this.results, undefined);
    _initStates(keys, this.progresses, '');
    toggleClasses(this.$el, this.classes.valid, removeClass);
    toggleClasses(this.$el, this.classes.invalid, removeClass);
    toggleClasses(this.$el, this.classes.touched, removeClass);
    toggleClasses(this.$el, this.classes.untouched, addClass);
    toggleClasses(this.$el, this.classes.dirty, removeClass);
    toggleClasses(this.$el, this.classes.pristine, addClass);
    toggleClasses(this.$el, this.classes.modified, removeClass);
    this.valid = true;
    this.dirty = false;
    this.touched = false;
    this.modified = false;
    this._modified = false;
    this._watchValidationRawResults();
  }

  function _walkValid (keys, target) {
    var valid = true;
    for (var i = 0; i < keys.length; i++) {
      var result = target[keys[i]];
      if (typeof result === 'boolean' && !result) {
        valid = false;
        break
      }
      if (typeof result === 'string' && result) {
        valid = false;
        break
      }
      if (isPlainObject(result)) {
        var nestedKeys = Object.keys(result);
        valid = _walkValid(nestedKeys, result);
        if (!valid) {
          break
        }
      }
    }
    return valid
  }

  function _watchValidationRawResults () {
    var this$1 = this;

    this._unwatchResults = this.$watch('results', function (val) {
      this$1.valid = _walkValid(
        this$1._keysCached(this$1._uid.toString(), this$1.results),
        this$1.results
      );
      if (this$1.valid) {
        toggleClasses(this$1.$el, this$1.classes.valid, addClass);
        toggleClasses(this$1.$el, this$1.classes.invalid, removeClass);
      } else {
        toggleClasses(this$1.$el, this$1.classes.valid, removeClass);
        toggleClasses(this$1.$el, this$1.classes.invalid, addClass);
      }

      this$1._fireEvent(this$1.valid ? 'valid' : 'invalid');
    }, { deep: true });
  }

  function _unwatchValidationRawResults () {
    this._unwatchResults();
    this._unwatchResults = undefined;
    delete this._unwatchResults;
  }

  function touch () {
    this.willUpdateTouched();
  }

  return {
    getValue: getValue,
    checkModified: checkModified,
    willUpdateTouched: willUpdateTouched,
    willUpdateDirty: willUpdateDirty,
    willUpdateModified: willUpdateModified,
    handleInputable: handleInputable,
    watchInputable: watchInputable,
    reset: reset,
    _walkValid: _walkValid,
    _watchValidationRawResults: _watchValidationRawResults,
    _unwatchValidationRawResults: _unwatchValidationRawResults,
    touch: touch
  }
};

/*  */

/**
 * Forgiving check for a promise
 */
function isPromise (p) {
  return p && typeof p.then === 'function'
}

var Validate = function (Vue) {
  var ref = Vue.util;
  var extend = ref.extend;
  var isPlainObject = ref.isPlainObject;
  var resolveAsset = ref.resolveAsset;

  function _resolveValidator (name) {
    var options = (this.child && this.child.context)
      ? this.child.context.$options
      : this.$options;
    return resolveAsset(options, 'validators', name)
  }

  function _getValidateRawDescriptor (
    validator,
    field,
    value
  ) {
    var asset = this._resolveValidator(validator);
    if (!asset) {
      // TODO: should be warned
      return null
    }

    var fn = null;
    var rule = null;
    var msg = null;
    if (isPlainObject(asset)) {
      if (asset.check && typeof asset.check === 'function') {
        fn = asset.check;
      }
      if (asset.message) {
        msg = asset.message;
      }
    } else if (typeof asset === 'function') {
      fn = asset;
    } else {
      // TODO: should be warned
      return null
    }

    if (!fn) {
      // TODO: should be warned
      return null
    }

    var props = null;
    var validators = this.validators;
    if (isPlainObject(validators)) {
      if (isPlainObject(validators[validator])) {
        if (validators[validator].props && isPlainObject(validators[validator].props)) {
          props = validators[validator].props;
        } else {
          if (validators[validator].rule) {
            rule = validators[validator].rule;
          }
          if (validators[validator].message) {
            msg = validators[validator].message;
          }
        }
      } else {
        rule = validators[validator];
      }
    }

    var descriptor = { fn: fn, value: value, field: field };
    if (rule) {
      descriptor.rule = rule;
    }
    if (msg) {
      descriptor.msg = msg;
    }
    if (props) {
      descriptor.props = props;
    }

    return descriptor
  }

  function _resolveMessage (
    field,
    msg,
    override
  ) {
    if (override) { return override }
    return msg
      ? typeof msg === 'function'
        ? msg(field)
        : msg
      : undefined
  }

  function _invokeValidator (
    ref,
    value,
    cb
  ) {
    var this$1 = this;
    var fn = ref.fn;
    var field = ref.field;
    var rule = ref.rule;
    var msg = ref.msg;

    var future = fn.call(this.child.context, value, rule);
    if (typeof future === 'function') { // function
      future(function () { // resolve
        cb(true);
      }, function (err) { // reject
        cb(false, this$1._resolveMessage(field, msg, err));
      });
    } else if (isPromise(future)) { // promise
      future.then(function () { // resolve
        cb(true);
      }, function (err) { // reject
        cb(false, this$1._resolveMessage(field, msg, err));
      }).catch(function (err) {
        cb(false, this$1._resolveMessage(field, msg, err.message));
      });
    } else { // sync
      cb(future, future === false ? this._resolveMessage(field, msg) : undefined);
    }
  }

  function _getValidateDescriptors (
    validator,
    field,
    value
  ) {
    var descriptors = [];

    var rawDescriptor = this._getValidateRawDescriptor(validator, this.field, value);
    if (!rawDescriptor) { return descriptors }

    if (!rawDescriptor.props) {
      var descriptor = { name: validator };
      extend(descriptor, rawDescriptor);
      descriptors.push(descriptor);
    } else {
      var propsKeys = Object.keys(!rawDescriptor.props);
      propsKeys.forEach(function (prop) {
        var descriptor = {
          fn: rawDescriptor.fn,
          name: validator,
          value: rawDescriptor.value[prop],
          field: rawDescriptor.field,
          prop: prop
        };
        if (rawDescriptor.props[prop].rule) {
          descriptor.rule = rawDescriptor.props[prop].rule;
        }
        if (rawDescriptor.props[prop].message) {
          descriptor.msg = rawDescriptor.props[prop].message;
        }
        descriptors.push(descriptor);
      });
    }

    return descriptors
  }

  function _syncValidates (field, cb) {
    var this$1 = this;

    var validators = this._keysCached(this._uid.toString(), this.results);
    var value = this.getValue();
    var descriptors = [];
    validators.forEach(function (validator) {
      this$1._getValidateDescriptors(validator, field, value).forEach(function (desc) {
        descriptors.push(desc);
      });
    });

    var count = 0;
    var len = descriptors.length;
    descriptors.forEach(function (desc) {
      var validator = desc.name;
      var prop = desc.prop;
      if ((!prop && this$1.progresses[validator]) || (prop && this$1.progresses[validator][prop])) {
        count++;
        if (count === len) {
          cb(this$1._walkValid(this$1._keysCached(this$1._uid.toString(), this$1.results), this$1.results));
        }
        return
      }

      if (!prop) {
        this$1.progresses[validator] = 'running';
      } else {
        this$1.progresses[validator][prop] = 'running';
      }

      this$1.$nextTick(function () {
        this$1._invokeValidator(desc, desc.value, function (ret, msg) {
          if (!prop) {
            this$1.progresses[validator] = '';
            this$1.results[validator] = msg || ret;
          } else {
            this$1.progresses[validator][prop] = '';
            this$1.results[validator][prop] = msg || ret;
          }

          count++;
          if (count === len) {
            cb(this$1._walkValid(this$1._keysCached(this$1._uid.toString(), this$1.results), this$1.results));
          }
        });
      });
    });
  }

  // TODO:should be refactor!!
  function _validate (validator, value, cb) {
    var this$1 = this;

    var descriptor = this._getValidateRawDescriptor(validator, this.field, value);
    if (descriptor && !descriptor.props) {
      if (this.progresses[validator]) { return false }
      this.progresses[validator] = 'running';
      this.$nextTick(function () {
        this$1._invokeValidator(descriptor, descriptor.value, function (ret, msg) {
          this$1.progresses[validator] = '';
          this$1.results[validator] = msg || ret;
          if (cb) {
            this$1.$nextTick(function () {
              cb.call(this$1, null, ret, msg);
            });
          } else {
            var e = { result: ret };
            if (msg) {
              e['msg'] = msg;
            }
            this$1._fireEvent('validate', validator, e);
          }
        });
      });
    } else if (descriptor && descriptor.props) {
      var propsKeys = Object.keys(descriptor.props);
      propsKeys.forEach(function (prop) {
        if (this$1.progresses[validator][prop]) { return }
        this$1.progresses[validator][prop] = 'running';
        var values = descriptor.value;
        var propDescriptor = {
          fn: descriptor.fn,
          value: values[prop],
          field: descriptor.field
        };
        if (descriptor.props[prop].rule) {
          propDescriptor.rule = descriptor.props[prop].rule;
        }
        if (descriptor.props[prop].message) {
          propDescriptor.msg = descriptor.props[prop].message;
        }
        this$1.$nextTick(function () {
          this$1._invokeValidator(propDescriptor, propDescriptor.value, function (result, msg) {
            this$1.progresses[validator][prop] = '';
            this$1.results[validator][prop] = msg || result;
            var e = { prop: prop, result: result };
            if (msg) {
              e['msg'] = msg;
            }
            this$1._fireEvent('validate', validator, e);
          });
        });
      });
    } else {
      // TODO:
      var err = new Error();
      cb ? cb.call(this, err) : this._fireEvent('validate', validator, err);
    }
    return true
  }

  // TODO: should be re-design of API
  function validate () {
    var this$1 = this;
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var validators;
    var value;
    var cb;
    var ret = true;

    if (args.length === 3) {
      validators = [args[0]];
      value = args[1];
      cb = args[2];
    } else if (args.length === 2) {
      if (isPlainObject(args[0])) {
        validators = [args[0].validator];
        value = args[0].value || this.getValue();
        cb = args[1];
      } else {
        validators = this._keysCached(this._uid.toString(), this.results);
        value = args[0];
        cb = args[1];
      }
    } else if (args.length === 1) {
      validators = this._keysCached(this._uid.toString(), this.results);
      value = this.getValue();
      cb = args[0];
    } else {
      validators = this._keysCached(this._uid.toString(), this.results);
      value = this.getValue();
      cb = null;
    }

    if (args.length === 3 || (args.length === 2 && isPlainObject(args[0]))) {
      ret = this._validate(validators[0], value, cb);
    } else {
      validators.forEach(function (validator) {
        ret = this$1._validate(validator, value, cb);
      });
    }

    return ret
  }

  return {
    _resolveValidator: _resolveValidator,
    _getValidateRawDescriptor: _getValidateRawDescriptor,
    _getValidateDescriptors: _getValidateDescriptors,
    _resolveMessage: _resolveMessage,
    _invokeValidator: _invokeValidator,
    _validate: _validate,
    _syncValidates: _syncValidates,
    validate: validate
  }
};

/*  */

var Methods = function (Vue) {
  var ref = Vue.util;
  var extend = ref.extend;

  var methods = {};
  extend(methods, Event(Vue));
  extend(methods, State(Vue));
  extend(methods, Validate(Vue));

  return methods
};

/*  */

var ValidityControl = function (Vue) {
  var ref = Vue.util;
  var extend = ref.extend;

  var ref$1 = States(Vue);
  var props = ref$1.props;
  var data = ref$1.data;
  var computed = Computed(Vue);
  var lifecycles = Lifecycles(Vue);
  var ref$2 = Render(Vue);
  var render = ref$2.render;
  var methods = Methods(Vue);

  var validity = {
    props: props,
    data: data,
    render: render,
    computed: computed,
    methods: methods
  };
  extend(validity, lifecycles);

  return validity
};

/*  */
var Validity = function (Vue) {
  var ref = Vue.util;
  var extend = ref.extend;

  return {
    functional: true,
    props: baseProps,
    render: function render (
      h,
      ref
    ) {
      var props = ref.props;
      var data = ref.data;
      var children = ref.children;

      return children.map(function (child) {
        if (!child.tag) { return child }
        var newData = extend({}, data);
        newData.props = extend({}, props);
        // TODO: should be refactored
        newData.props.classes = extend(extend(extend({}, DEFAULT_CLASSES), Vue.config.validator.classes), newData.props.classes);
        newData.props.child = child;
        return h('validity-control', newData)
      })
    }
  }
};

/*  */
var ValidityGroup = function (Vue) {
  var ref = Vue.util;
  var extend = ref.extend;

  var props = extend({
    tag: {
      type: String,
      default: 'fieldset'
    }
  }, baseProps);

  return {
    functional: true,
    props: props,
    render: function render (
      h,
      ref
    ) {
      var props = ref.props;
      var data = ref.data;
      var children = ref.children;

      var child = h(props.tag, children);
      var newData = extend({}, data);
      newData.props = extend({}, props);
      // TODO: should be refactored
      newData.props.classes = extend(extend(extend({}, DEFAULT_CLASSES), Vue.config.validator.classes), newData.props.classes);
      newData.props.child = child;
      newData.props.multiple = true;
      return h('validity-control', newData)
    }
  }
};

/*  */

var Validation = function (Vue) {
  var ref = Vue.util;
  var extend = ref.extend;

  return {
    functional: true,
    props: {
      name: {
        type: String
      },
      tag: {
        type: String,
        default: 'form'
      }
    },
    render: function render (
      h,
      ref
    ) {
      var props = ref.props;
      var data = ref.data;
      var parent = ref.parent;
      var children = ref.children;
      var slots = ref.slots;

      if (!parent._validation) {
        // TODO: should be warned
        return children
      }
      var tag = props.tag || 'form';
      walkChildren(parent._validation, props.name, children);
      var newData = extend({ attrs: {}}, data);
      if (tag === 'form') {
        newData.attrs.novalidate = true;
      }
      return h(tag, newData, children)
    }
  }
};

function walkChildren (validation, name, children) {
  children.forEach(function (child) {
    if (child &&
        child.componentOptions &&
        child.componentOptions.propsData && child.componentOptions.tag === 'validity-control') {
      child.componentOptions.propsData.validation = {
        instance: validation,
        name: name
      };
    }
    child.children && walkChildren(validation, name, child.children);
  });
}

/*  */
var Component = function (Vue) {
  return {
    'validity-control': ValidityControl(Vue),
    'validity': Validity(Vue),
    'validity-group': ValidityGroup(Vue),
    'validation': Validation(Vue)
  }
};

/*  */
// TODO: should be defined strict type
function mapValidation (results) {
  var res = {};

  normalizeMap(results).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedValidation () {
      var validation = this.$validation;
      if (!this._isMounted) {
        return null
      }
      var paths = val.split('.');
      var first = paths.shift();
      if (first !== '$validation') {
        warn(("unknown validation result path: " + val));
        return null
      }
      var path;
      var value = validation;
      do {
        path = paths.shift();
        value = value[path];
      } while (paths.length > 0 && value !== undefined)
      return value
    };
  });

  return res
}

// TODO: should be defined strict type
function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

/*  */
var installed = false;

function plugin (Vue, options) {
  if ( options === void 0 ) options = {};

  if (installed) {
    warn('already installed.');
    return
  }

  Config(Vue);
  Asset(Vue);
  installMixin(Vue);
  installComponent(Vue);
  installed = true;
}

function installMixin (Vue) {
  Vue.mixin(Mixin(Vue));
}

function installComponent (Vue) {
  var components = Component(Vue);
  Object.keys(components).forEach(function (id) {
    Vue.component(id, components[id]);
  });
}

plugin.mapValidation = mapValidation; // for standalone
plugin.version = '__VERSION__';

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

var index = {
  install: plugin,
  mapValidation: mapValidation
};

module.exports = index;


/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
	 true ? factory(exports, __webpack_require__(0), __webpack_require__(27), __webpack_require__(25)) :
	typeof define === 'function' && define.amd ? define(['exports', 'vue', 'vue-class-component', 'reflect-metadata'], factory) :
	(factory((global.VuePropertyDecorator = {}),global.Vue,global.VueClassComponent));
}(this, (function (exports,vue,vueClassComponent) { 'use strict';

vue = vue && vue.hasOwnProperty('default') ? vue['default'] : vue;
var vueClassComponent__default = 'default' in vueClassComponent ? vueClassComponent['default'] : vueClassComponent;

/** vue-property-decorator verson 5.2.1 MIT LICENSE copyright 2017 kaorun343 */
/**
 * decorator of an inject
 * @param key key
 * @return PropertyDecorator
 */
function Inject(key) {
    return vueClassComponent.createDecorator(function (componentOptions, k) {
        if (typeof componentOptions.inject === 'undefined') {
            componentOptions.inject = {};
        }
        if (!Array.isArray(componentOptions.inject)) {
            componentOptions.inject[k] = key || k;
        }
    });
}
/**
 * decorator of a provide
 * @param key key
 * @return PropertyDecorator | void
 */
function Provide(key) {
    return vueClassComponent.createDecorator(function (componentOptions, k) {
        var provide = componentOptions.provide;
        if (typeof provide !== 'function' || !provide.managed) {
            var original_1 = componentOptions.provide;
            provide = componentOptions.provide = function () {
                var rv = Object.create((typeof original_1 === 'function' ? original_1.call(this) : original_1) || null);
                for (var i in provide.managed)
                    rv[provide.managed[i]] = this[i];
                return rv;
            };
            provide.managed = {};
        }
        provide.managed[k] = key || k;
    });
}
/**
 * decorator of model
 * @param  event event name
 * @return PropertyDecorator
 */
function Model(event) {
    return vueClassComponent.createDecorator(function (componentOptions, prop) {
        componentOptions.model = { prop: prop, event: event || prop };
    });
}
/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
function Prop(options) {
    if (options === void 0) { options = {}; }
    return function (target, key) {
        if (!Array.isArray(options) && typeof options.type === 'undefined') {
            options.type = Reflect.getMetadata('design:type', target, key);
        }
        vueClassComponent.createDecorator(function (componentOptions, k) {
            (componentOptions.props || (componentOptions.props = {}))[k] = options;
        })(target, key);
    };
}
/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  WatchOption
 * @return MethodDecorator
 */
function Watch(path, options) {
    if (options === void 0) { options = {}; }
    var _a = options.deep, deep = _a === void 0 ? false : _a, _b = options.immediate, immediate = _b === void 0 ? false : _b;
    return vueClassComponent.createDecorator(function (componentOptions, handler) {
        if (typeof componentOptions.watch !== 'object') {
            componentOptions.watch = Object.create(null);
        }
        componentOptions.watch[path] = { handler: handler, deep: deep, immediate: immediate };
    });
}

exports.Inject = Inject;
exports.Provide = Provide;
exports.Model = Model;
exports.Prop = Prop;
exports.Watch = Watch;
exports.Component = vueClassComponent__default;
exports.Vue = vue;

Object.defineProperty(exports, '__esModule', { value: true });

})));


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(2))(0);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(37)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(17),
  /* template */
  __webpack_require__(34),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\学习\\03 其他事务\\校史竞赛系统\\POJECT\\SEU-History-Contest-System\\HistoryContest.Client\\Scripts\\components\\app\\app.vue.html"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] app.vue.html: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e8bff018", Component.options)
  } else {
    hotAPI.reload("data-v-e8bff018", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(18),
  /* template */
  __webpack_require__(30),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\学习\\03 其他事务\\校史竞赛系统\\POJECT\\SEU-History-Contest-System\\HistoryContest.Client\\Scripts\\components\\counter\\counter.vue.html"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] counter.vue.html: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-480bca04", Component.options)
  } else {
    hotAPI.reload("data-v-480bca04", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(19),
  /* template */
  __webpack_require__(29),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\学习\\03 其他事务\\校史竞赛系统\\POJECT\\SEU-History-Contest-System\\HistoryContest.Client\\Scripts\\components\\fetchdata\\fetchdata.vue.html"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] fetchdata.vue.html: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0c646c6e", Component.options)
  } else {
    hotAPI.reload("data-v-0c646c6e", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  null,
  /* template */
  __webpack_require__(33),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\学习\\03 其他事务\\校史竞赛系统\\POJECT\\SEU-History-Contest-System\\HistoryContest.Client\\Scripts\\components\\home\\home.vue.html"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] home.vue.html: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-826e69d0", Component.options)
  } else {
    hotAPI.reload("data-v-826e69d0", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(2))(1);

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(2))(5);

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bootstrap__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bootstrap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bootstrap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue_router__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_validator__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_validator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_vue_validator__);




//import './components/login/validator.js';
__WEBPACK_IMPORTED_MODULE_1_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_2_vue_router__["default"]);
__WEBPACK_IMPORTED_MODULE_1_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_3_vue_validator___default.a);
//require('./components/login/validator.js')
var routes = [
    //   { path: '/image1', component: require('../Images/background1.jpg') },
    { path: '/', component: __webpack_require__(13) },
    { path: '/counter', component: __webpack_require__(11) },
    { path: '/fetchdata', component: __webpack_require__(12) },
    { path: '/login', component: __webpack_require__(5) }
];
new __WEBPACK_IMPORTED_MODULE_1_vue__["default"]({
    el: '#app-root',
    router: new __WEBPACK_IMPORTED_MODULE_2_vue_router__["default"]({ mode: 'history', routes: routes }),
    render: function (h) { return h(__webpack_require__(10)); }
});


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jquery__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



//import boolstrap from 'boolstrap';
__WEBPACK_IMPORTED_MODULE_2_jquery___default()(function () {
    var bgCounter = 0;
    var backgrounds = [
        "/dist/Images/background1.jpg",
        "/dist/Images/background2.jpg",
        "/dist/Images/background3.jpg",
        "/dist/Images/background4.jpg",
        "/dist/Images/background5.jpg",
        "/dist/Images/background6.jpg",
        "/dist/Images/background7.jpg"
    ];
    function changeBackground() {
        bgCounter = (bgCounter + 1) % backgrounds.length;
        __WEBPACK_IMPORTED_MODULE_2_jquery___default()('.backgrounds').css('background-image', 'url(' + backgrounds[bgCounter] + ')');
        setTimeout(changeBackground, 4050);
    }
    changeBackground();
});
var AppComponent = (function (_super) {
    __extends(AppComponent, _super);
    function AppComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__["Component"])({
            components: {
                MenuComponent: __webpack_require__(28),
                LoginComponent: __webpack_require__(5)
            }
        })
    ], AppComponent);
    return AppComponent;
}(__WEBPACK_IMPORTED_MODULE_0_vue__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (AppComponent);


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jquery__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


__WEBPACK_IMPORTED_MODULE_1_jquery___default()(function () {
    //  $(this).css("background-color","#aaa");
    __WEBPACK_IMPORTED_MODULE_1_jquery___default()("#list2").click(function () {
        alert("确认开始答题吗？（答题过程中不能关闭窗口）");
        window.open('../href/index.html');
    });
});
/*
@Component
export default class CounterComponent extends Vue {
    currentcount: number = 0;

    incrementCounter() {
        this.currentcount++;
    }
}
*/
var CounterComponent = (function (_super) {
    __extends(CounterComponent, _super);
    function CounterComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CounterComponent;
}(__WEBPACK_IMPORTED_MODULE_0_vue__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (CounterComponent);


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var FetchDataComponent = (function (_super) {
    __extends(FetchDataComponent, _super);
    function FetchDataComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.forecasts = [];
        return _this;
    }
    FetchDataComponent.prototype.mounted = function () {
        var _this = this;
        fetch('/api/SampleData/WeatherForecasts')
            .then(function (response) { return response.json(); })
            .then(function (data) {
            _this.forecasts = data;
        });
    };
    FetchDataComponent = __decorate([
        __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__["Component"]
    ], FetchDataComponent);
    return FetchDataComponent;
}(__WEBPACK_IMPORTED_MODULE_0_vue__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (FetchDataComponent);


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_validator__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_validator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_validator__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


__WEBPACK_IMPORTED_MODULE_0_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_1_vue_validator___default.a);
/*
@Component({
    components: {
        validator: require('./validator.js')
    }
})*/
var AppComponent = (function (_super) {
    __extends(AppComponent, _super);
    function AppComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AppComponent;
}(__WEBPACK_IMPORTED_MODULE_0_vue__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (AppComponent);


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "\r\n/* Keep the nav menu independent of scrolling and on top of other items */\n.backgrounds {\r\n    background-image:url(" + __webpack_require__(40) + ");\r\n    position: fixed;\r\n    background-position: center;\r\n    top: 0; \r\n    left: 0;\r\n\tright:0;\r\n\tbottom:0;\n}\nh1{\r\n\tcolor:red;\n}\n.header{\r\n\tpadding:30px;\r\n\twidth:100%;\r\n\theight:25%;\n}\n.container{\r\n\tmargin-top:60px;\r\n\tmargin-bottom: 60px;\n}\n.form-horizontal{\r\n\tbackground:rgba(255,255,255,0.6);\r\n\tmax-width: 540px;\r\n\tmargin:auto;\r\n\tpadding-bottom: 25px;\r\n\tborder-radius: 15px;\r\n\ttext-align: center;\n}\n.form-horizontal .heading{\r\n\tdisplay: block;\r\n\tfont-family:FZYaoti;\r\n\tbackground:rgba(255,255,255,0.6);\r\n\tborder-radius:15px 15px 0 0px;\r\n\tfont-size: 35px;\r\n\tfont-weight: 700;\r\n\tpadding: 35px 0;\r\n\t\r\n\tmargin-bottom: 30px;\n}\n.form-horizontal .form-group{\r\n\tpadding: 0;\r\n\tfont-family: Microsoft Yahei;\r\n\tmargin: 15px 60px;\r\n\tposition:relative;\n}\n.form-horizontal .form-control{\r\n\tbackground: #f0f0f0;\r\n\topacity: 0.8;\r\n\tborder: none;\r\n\tborder-radius: 20px;\r\n\tbox-shadow: none;\r\n\tpadding: 0 50px 0 80px;\r\n\theight: 40px;\r\n\ttransition: all 0.3s ease 0s;\n}\n.form-horizontal .form-control:focus{\r\n\tbackground: #e0e0e0;\r\n\topacity: 0.8;\r\n\tbox-shadow: none;\r\n\toutline: 0 none;\n}\n.form-horizontal .form-group span{\r\n\tposition: absolute;\r\n\ttop: 12px;\r\n\r\n\tleft: 45px;\r\n\tfont-size: 16px;\r\n\tcolor: #c8c8c8;\r\n\tanimation: loaded 0.8s ease 0s 1 normal;\r\n\ttransition: all 0.5s ease 0s;\n}\n.form-horizontal .form-control:focus + span{\r\n\tcolor: #00b4ef;\n}\n.form-horizontal .btn{\r\n\tfloat: right;\r\n\tfont-size: 14px;\r\n\tcolor: #fff;\r\n\tbackground: #00b4ef;\r\n\tborder-radius: 30px;\r\n\tpadding: 10px 25px;\r\n\tborder: none;\r\n\ttransition: all 0.5s ease 0s;\n}\n.form-horizontal a{\r\n\tdisplay:block;\r\n\tfloat:left;\r\n\tfont-size:14px;\r\n\tpadding: 10px 25px;\n}\n@media only screen and (max-width: 479px){\n.header{\r\n\t\ttext-align: center;\n}\n.form-horizontal .form-group{\r\n\t\tmargin: 15px 25px;\n}\n.form-horizontal .form-group i{\r\n\t\tleft: 45px;\n}\n.form-horizontal .btn{\r\n\t\tpadding: 10px 20px;\n}\n}\n@keyframes loaded{\nfrom{\r\n\t\tleft:0px;\n}\nto{\r\n\t\tleft:45px;\n}\n}\n@media (max-width: 767px) {\nbody {\r\n        padding-top: 50px;\n}\n}\n@media (min-width: 768px) {\n.background{\r\n        height:100%;\n}\n.background .inside{\r\n       /* background:rgba(255,255,255,0.8);*/   \r\n        border-radius: 0px;\r\n        border-width: 0px;\r\n        height: 100%;\n}\r\n    /* On small screens, convert the nav menu to a vertical sidebar */\r\n   /* .main-nav {\r\n        height: 100%;\r\n        width: calc(25% - 20px);\r\n    }\r\n    .main-nav .navbar {\r\n        background-color:rgba(0,162,232,0.8);\r\n        border-radius: 0px;\r\n        border-width: 0px;\r\n        height: 100%;\r\n    }\r\n    .main-nav .navbar-header {\r\n        float: none;\r\n    }\r\n    .main-nav .navbar-collapse {\r\n        border-top: 1px solid #fff;\r\n        padding: 0px;\r\n    }\r\n    .main-nav .navbar ul {\r\n        float: none;\r\n                font-size: 20px;\r\n\r\n    }\r\n    .main-nav .navbar li {\r\n        float: none;\r\n        font-size: 18px;\r\n        margin: 6px;\r\n    }\r\n    .main-nav .navbar li a {\r\n        padding: 18px 16px;\r\n        border-radius: 4px;\r\n    }\r\n    .main-nav .navbar a {\r\n        width: 100%;\r\n        white-space: nowrap;\r\n        overflow: hidden;\r\n        text-overflow: ellipsis;\r\n    }*/\n}\r\n", "", {"version":3,"sources":["/./Scripts/components/app/app.css"],"names":[],"mappings":";AACA,0EAA0E;AAC1E;IACI,+CAAsD;IACtD,gBAAgB;IAChB,4BAA4B;IAC5B,OAAO;IACP,QAAQ;CACX,QAAQ;CACR,SAAS;CACT;AAED;CACC,UAAU;CACV;AACD;CACC,aAAa;CACb,WAAW;CACX,WAAW;CACX;AACD;CACC,gBAAgB;CAChB,oBAAoB;CACpB;AACD;CACC,iCAAiC;CACjC,iBAAiB;CACjB,YAAY;CACZ,qBAAqB;CACrB,oBAAoB;CACpB,mBAAmB;CACnB;AACD;CACC,eAAe;CACf,oBAAoB;CACpB,iCAAiC;CACjC,8BAA8B;CAC9B,gBAAgB;CAChB,iBAAiB;CACjB,gBAAgB;;CAEhB,oBAAoB;CACpB;AACD;CACC,WAAW;CACX,6BAA6B;CAC7B,kBAAkB;CAClB,kBAAkB;CAClB;AACD;CACC,oBAAoB;CACpB,aAAa;CACb,aAAa;CACb,oBAAoB;CACpB,iBAAiB;CACjB,uBAAuB;CACvB,aAAa;CACb,6BAA6B;CAC7B;AACD;CACC,oBAAoB;CACpB,aAAa;CACb,iBAAiB;CACjB,gBAAgB;CAChB;AACD;CACC,mBAAmB;CACnB,UAAU;;CAEV,WAAW;CACX,gBAAgB;CAChB,eAAe;CACf,wCAAwC;CACxC,6BAA6B;CAC7B;AACD;CACC,eAAe;CACf;AAGD;CACC,aAAa;CACb,gBAAgB;CAChB,YAAY;CACZ,oBAAoB;CACpB,oBAAoB;CACpB,mBAAmB;CACnB,aAAa;CACb,6BAA6B;CAC7B;AAED;CACC,cAAc;CACd,WAAW;CACX,eAAe;CACf,mBAAmB;CACnB;AACD;AACC;EACC,mBAAmB;CACnB;AACD;EACC,kBAAkB;CAClB;AACD;EACC,WAAW;CACX;AACD;EACC,mBAAmB;CACnB;CAED;AAED;AACC;EACC,SAAS;CACT;AACD;EACC,UAAU;CACV;CACD;AAED;AACI;QACI,kBAAkB;CACrB;CACJ;AAED;AACI;QACI,YAAY;CACf;AACD;OACG,sCAAsC;QACrC,mBAAmB;QACnB,kBAAkB;QAClB,aAAa;CAChB;IACD,kEAAkE;GACnE;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;OAoCI;CACN","file":"app.css","sourcesContent":["\r\n/* Keep the nav menu independent of scrolling and on top of other items */\r\n.backgrounds {\r\n    background-image:url(../../../Images/background2.jpg);\r\n    position: fixed;\r\n    background-position: center;\r\n    top: 0; \r\n    left: 0;\r\n\tright:0;\r\n\tbottom:0;\r\n}\r\n\r\nh1{\r\n\tcolor:red;\r\n}\r\n.header{\r\n\tpadding:30px;\r\n\twidth:100%;\r\n\theight:25%;\r\n}\r\n.container{\r\n\tmargin-top:60px;\r\n\tmargin-bottom: 60px;\r\n}\r\n.form-horizontal{\r\n\tbackground:rgba(255,255,255,0.6);\r\n\tmax-width: 540px;\r\n\tmargin:auto;\r\n\tpadding-bottom: 25px;\r\n\tborder-radius: 15px;\r\n\ttext-align: center;\r\n}\r\n.form-horizontal .heading{\r\n\tdisplay: block;\r\n\tfont-family:FZYaoti;\r\n\tbackground:rgba(255,255,255,0.6);\r\n\tborder-radius:15px 15px 0 0px;\r\n\tfont-size: 35px;\r\n\tfont-weight: 700;\r\n\tpadding: 35px 0;\r\n\t\r\n\tmargin-bottom: 30px;\r\n}\r\n.form-horizontal .form-group{\r\n\tpadding: 0;\r\n\tfont-family: Microsoft Yahei;\r\n\tmargin: 15px 60px;\r\n\tposition:relative;\r\n}\r\n.form-horizontal .form-control{\r\n\tbackground: #f0f0f0;\r\n\topacity: 0.8;\r\n\tborder: none;\r\n\tborder-radius: 20px;\r\n\tbox-shadow: none;\r\n\tpadding: 0 50px 0 80px;\r\n\theight: 40px;\r\n\ttransition: all 0.3s ease 0s;\r\n}\r\n.form-horizontal .form-control:focus{\r\n\tbackground: #e0e0e0;\r\n\topacity: 0.8;\r\n\tbox-shadow: none;\r\n\toutline: 0 none;\r\n}\r\n.form-horizontal .form-group span{\r\n\tposition: absolute;\r\n\ttop: 12px;\r\n\r\n\tleft: 45px;\r\n\tfont-size: 16px;\r\n\tcolor: #c8c8c8;\r\n\tanimation: loaded 0.8s ease 0s 1 normal;\r\n\ttransition: all 0.5s ease 0s;\r\n}\r\n.form-horizontal .form-control:focus + span{\r\n\tcolor: #00b4ef;\r\n}\r\n\r\n\r\n.form-horizontal .btn{\r\n\tfloat: right;\r\n\tfont-size: 14px;\r\n\tcolor: #fff;\r\n\tbackground: #00b4ef;\r\n\tborder-radius: 30px;\r\n\tpadding: 10px 25px;\r\n\tborder: none;\r\n\ttransition: all 0.5s ease 0s;\r\n}\r\n\r\n.form-horizontal a{\r\n\tdisplay:block;\r\n\tfloat:left;\r\n\tfont-size:14px;\r\n\tpadding: 10px 25px;\r\n}\r\n@media only screen and (max-width: 479px){\r\n\t.header{\r\n\t\ttext-align: center;\r\n\t}\r\n\t.form-horizontal .form-group{\r\n\t\tmargin: 15px 25px;\r\n\t}\r\n\t.form-horizontal .form-group i{\r\n\t\tleft: 45px;\r\n\t}\r\n\t.form-horizontal .btn{\r\n\t\tpadding: 10px 20px;\r\n\t}\r\n\r\n}\r\n\r\n@keyframes loaded{\r\n\tfrom{\r\n\t\tleft:0px;\r\n\t}\r\n\tto{\r\n\t\tleft:45px;\r\n\t}\r\n}\r\n\r\n@media (max-width: 767px) {\r\n    body {\r\n        padding-top: 50px;\r\n    }   \r\n}\r\n\r\n@media (min-width: 768px) {\r\n    .background{\r\n        height:100%;\r\n    }\r\n    .background .inside{\r\n       /* background:rgba(255,255,255,0.8);*/   \r\n        border-radius: 0px;\r\n        border-width: 0px;\r\n        height: 100%;        \r\n    }\r\n    /* On small screens, convert the nav menu to a vertical sidebar */\r\n   /* .main-nav {\r\n        height: 100%;\r\n        width: calc(25% - 20px);\r\n    }\r\n    .main-nav .navbar {\r\n        background-color:rgba(0,162,232,0.8);\r\n        border-radius: 0px;\r\n        border-width: 0px;\r\n        height: 100%;\r\n    }\r\n    .main-nav .navbar-header {\r\n        float: none;\r\n    }\r\n    .main-nav .navbar-collapse {\r\n        border-top: 1px solid #fff;\r\n        padding: 0px;\r\n    }\r\n    .main-nav .navbar ul {\r\n        float: none;\r\n                font-size: 20px;\r\n\r\n    }\r\n    .main-nav .navbar li {\r\n        float: none;\r\n        font-size: 18px;\r\n        margin: 6px;\r\n    }\r\n    .main-nav .navbar li a {\r\n        padding: 18px 16px;\r\n        border-radius: 4px;\r\n    }\r\n    .main-nav .navbar a {\r\n        width: 100%;\r\n        white-space: nowrap;\r\n        overflow: hidden;\r\n        text-overflow: ellipsis;\r\n    }*/\r\n}\r\n"],"sourceRoot":"webpack://"}]);

// exports


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "\n.main-nav li .glyphicon {\r\n    margin-right: 10px;\n}\r\n\r\n/* Highlighting rules for nav menu items */\n.main-nav li a.router-link-active,\r\n.main-nav li a.router-link-active:hover,\r\n.main-nav li a.router-link-active:focus {\r\n    background-color: rgba(255,255,255,0.6);\r\n    color: white;\n}\r\n\r\n/* Keep the nav menu independent of scrolling and on top of other items */\n.main-nav {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    z-index: 1;\n}\n@media (max-width: 767px) {\r\n    /* On small screens, the nav menu spans the full width of the screen. Leave a space for it. */\nbody {\r\n        padding-top: 50px;\n}\n}\n@media (min-width: 768px) {\r\n    /* On small screens, convert the nav menu to a vertical sidebar */\n.main-nav {\r\n        height: 100%;\r\n        width: calc(25% - 20px);\n}\n.main-nav .navbar {\r\n        background-color:rgba(0,162,232,0.8);\r\n        border-radius: 0px;\r\n        border-width: 0px;\r\n        height: 100%;\n}\n.main-nav .navbar-header {\r\n        float: none;\n}\n.main-nav .navbar-collapse {\r\n        border-top: 1px solid #fff;\r\n        padding: 0px;\n}\n.main-nav .navbar ul {\r\n        float: none;\r\n                font-size: 20px;\n}\n.main-nav .navbar li {\r\n        float: none;\r\n        font-size: 18px;\r\n        margin: 6px;\n}\n.main-nav .navbar li a {\r\n        padding: 18px 16px;\r\n        border-radius: 4px;\n}\n.main-nav .navbar a {\r\n        width: 100%;\r\n        white-space: nowrap;\r\n        overflow: hidden;\r\n        text-overflow: ellipsis;\n}\n}\r\n", "", {"version":3,"sources":["/./Scripts/components/navmenu/navmenu.css"],"names":[],"mappings":";AAAA;IACI,mBAAmB;CACtB;;AAED,2CAA2C;AAC3C;;;IAGI,wCAAwC;IACxC,aAAa;CAChB;;AAED,0EAA0E;AAC1E;IACI,gBAAgB;IAChB,OAAO;IACP,QAAQ;IACR,SAAS;IACT,WAAW;CACd;AAED;IACI,8FAA8F;AAC9F;QACI,kBAAkB;CACrB;CACJ;AAED;IACI,kEAAkE;AAClE;QACI,aAAa;QACb,wBAAwB;CAC3B;AACD;QACI,qCAAqC;QACrC,mBAAmB;QACnB,kBAAkB;QAClB,aAAa;CAChB;AACD;QACI,YAAY;CACf;AACD;QACI,2BAA2B;QAC3B,aAAa;CAChB;AACD;QACI,YAAY;gBACJ,gBAAgB;CAE3B;AACD;QACI,YAAY;QACZ,gBAAgB;QAChB,YAAY;CACf;AACD;QACI,mBAAmB;QACnB,mBAAmB;CACtB;AACD;QACI,YAAY;QACZ,oBAAoB;QACpB,iBAAiB;QACjB,wBAAwB;CAC3B;CACJ","file":"navmenu.css","sourcesContent":[".main-nav li .glyphicon {\r\n    margin-right: 10px;\r\n}\r\n\r\n/* Highlighting rules for nav menu items */\r\n.main-nav li a.router-link-active,\r\n.main-nav li a.router-link-active:hover,\r\n.main-nav li a.router-link-active:focus {\r\n    background-color: rgba(255,255,255,0.6);\r\n    color: white;\r\n}\r\n\r\n/* Keep the nav menu independent of scrolling and on top of other items */\r\n.main-nav {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    z-index: 1;\r\n}\r\n\r\n@media (max-width: 767px) {\r\n    /* On small screens, the nav menu spans the full width of the screen. Leave a space for it. */\r\n    body {\r\n        padding-top: 50px;\r\n    }\r\n}\r\n\r\n@media (min-width: 768px) {\r\n    /* On small screens, convert the nav menu to a vertical sidebar */\r\n    .main-nav {\r\n        height: 100%;\r\n        width: calc(25% - 20px);\r\n    }\r\n    .main-nav .navbar {\r\n        background-color:rgba(0,162,232,0.8);\r\n        border-radius: 0px;\r\n        border-width: 0px;\r\n        height: 100%;\r\n    }\r\n    .main-nav .navbar-header {\r\n        float: none;\r\n    }\r\n    .main-nav .navbar-collapse {\r\n        border-top: 1px solid #fff;\r\n        padding: 0px;\r\n    }\r\n    .main-nav .navbar ul {\r\n        float: none;\r\n                font-size: 20px;\r\n\r\n    }\r\n    .main-nav .navbar li {\r\n        float: none;\r\n        font-size: 18px;\r\n        margin: 6px;\r\n    }\r\n    .main-nav .navbar li a {\r\n        padding: 18px 16px;\r\n        border-radius: 4px;\r\n    }\r\n    .main-nav .navbar a {\r\n        width: 100%;\r\n        white-space: nowrap;\r\n        overflow: hidden;\r\n        text-overflow: ellipsis;\r\n    }\r\n}\r\n"],"sourceRoot":"webpack://"}]);

// exports


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "\r\n/* Keep the nav menu independent of scrolling and on top of other items */\n.backgrounds {\r\n    background-image:url(" + __webpack_require__(40) + ");\r\n    position: fixed;\r\n    background-position: center;\r\n    top: 0; \r\n    left: 0;\r\n\tright:0;\r\n\tbottom:0;\n}\nh1{\r\n\tcolor:red;\n}\n.header{\r\n\tpadding:30px;\r\n\twidth:100%;\r\n\theight:25%;\n}\n.container{\r\n\tmargin-top:60px;\r\n\tmargin-bottom: 60px;\n}\n.form-horizontal{\r\n\tbackground:rgba(255,255,255,0.6);\r\n\tmax-width: 540px;\r\n\tmargin:auto;\r\n\tpadding-bottom: 25px;\r\n\tborder-radius: 15px;\r\n\ttext-align: center;\n}\n.form-horizontal .heading{\r\n\tdisplay: block;\r\n\tfont-family:FZYaoti;\r\n\tbackground:rgba(255,255,255,0.6);\r\n\tborder-radius:15px 15px 0 0px;\r\n\tfont-size: 35px;\r\n\tfont-weight: 700;\r\n\tpadding: 35px 0;\r\n\t\r\n\tmargin-bottom: 30px;\n}\n.form-horizontal .form-group{\r\n\tpadding: 0;\r\n\tfont-family: Microsoft Yahei;\r\n\tmargin: 15px 60px;\r\n\tposition:relative;\n}\n.form-horizontal .form-control{\r\n\tbackground: #f0f0f0;\r\n\topacity: 0.8;\r\n\tborder: none;\r\n\tborder-radius: 20px;\r\n\tbox-shadow: none;\r\n\tpadding: 0 50px 0 80px;\r\n\theight: 40px;\r\n\ttransition: all 0.3s ease 0s;\n}\n.form-horizontal .form-control:focus{\r\n\tbackground: #e0e0e0;\r\n\topacity: 0.8;\r\n\tbox-shadow: none;\r\n\toutline: 0 none;\n}\n.form-horizontal .form-group span{\r\n\tposition: absolute;\r\n\ttop: 12px;\r\n\r\n\tleft: 45px;\r\n\tfont-size: 16px;\r\n\tcolor: #c8c8c8;\r\n\tanimation: loaded 0.8s ease 0s 1 normal;\r\n\ttransition: all 0.5s ease 0s;\n}\n.form-horizontal .form-control:focus + span{\r\n\tcolor: #00b4ef;\n}\n.form-horizontal .btn{\r\n\tfloat: right;\r\n\tfont-size: 14px;\r\n\tcolor: #fff;\r\n\tbackground: #00b4ef;\r\n\tborder-radius: 30px;\r\n\tpadding: 10px 25px;\r\n\tborder: none;\r\n\ttransition: all 0.5s ease 0s;\n}\n.form-horizontal a{\r\n\tdisplay:block;\r\n\tfloat:left;\r\n\tfont-size:14px;\r\n\tpadding: 10px 25px;\n}\n@media only screen and (max-width: 479px){\n.header{\r\n\t\ttext-align: center;\n}\n.form-horizontal .form-group{\r\n\t\tmargin: 15px 25px;\n}\n.form-horizontal .form-group i{\r\n\t\tleft: 45px;\n}\n.form-horizontal .btn{\r\n\t\tpadding: 10px 20px;\n}\n}\n@keyframes loaded{\nfrom{\r\n\t\tleft:0px;\n}\nto{\r\n\t\tleft:45px;\n}\n}\n@media (max-width: 767px) {\nbody {\r\n        padding-top: 50px;\n}\n}\n@media (min-width: 768px) {\n.background{\r\n        height:100%;\n}\n.background .inside{\r\n       /* background:rgba(255,255,255,0.8);*/   \r\n        border-radius: 0px;\r\n        border-width: 0px;\r\n        height: 100%;\n}\r\n    /* On small screens, convert the nav menu to a vertical sidebar */\r\n   /* .main-nav {\r\n        height: 100%;\r\n        width: calc(25% - 20px);\r\n    }\r\n    .main-nav .navbar {\r\n        background-color:rgba(0,162,232,0.8);\r\n        border-radius: 0px;\r\n        border-width: 0px;\r\n        height: 100%;\r\n    }\r\n    .main-nav .navbar-header {\r\n        float: none;\r\n    }\r\n    .main-nav .navbar-collapse {\r\n        border-top: 1px solid #fff;\r\n        padding: 0px;\r\n    }\r\n    .main-nav .navbar ul {\r\n        float: none;\r\n                font-size: 20px;\r\n\r\n    }\r\n    .main-nav .navbar li {\r\n        float: none;\r\n        font-size: 18px;\r\n        margin: 6px;\r\n    }\r\n    .main-nav .navbar li a {\r\n        padding: 18px 16px;\r\n        border-radius: 4px;\r\n    }\r\n    .main-nav .navbar a {\r\n        width: 100%;\r\n        white-space: nowrap;\r\n        overflow: hidden;\r\n        text-overflow: ellipsis;\r\n    }*/\n}\r\n", "", {"version":3,"sources":["/./Scripts/components/app/app.css"],"names":[],"mappings":";AACA,0EAA0E;AAC1E;IACI,+CAAsD;IACtD,gBAAgB;IAChB,4BAA4B;IAC5B,OAAO;IACP,QAAQ;CACX,QAAQ;CACR,SAAS;CACT;AAED;CACC,UAAU;CACV;AACD;CACC,aAAa;CACb,WAAW;CACX,WAAW;CACX;AACD;CACC,gBAAgB;CAChB,oBAAoB;CACpB;AACD;CACC,iCAAiC;CACjC,iBAAiB;CACjB,YAAY;CACZ,qBAAqB;CACrB,oBAAoB;CACpB,mBAAmB;CACnB;AACD;CACC,eAAe;CACf,oBAAoB;CACpB,iCAAiC;CACjC,8BAA8B;CAC9B,gBAAgB;CAChB,iBAAiB;CACjB,gBAAgB;;CAEhB,oBAAoB;CACpB;AACD;CACC,WAAW;CACX,6BAA6B;CAC7B,kBAAkB;CAClB,kBAAkB;CAClB;AACD;CACC,oBAAoB;CACpB,aAAa;CACb,aAAa;CACb,oBAAoB;CACpB,iBAAiB;CACjB,uBAAuB;CACvB,aAAa;CACb,6BAA6B;CAC7B;AACD;CACC,oBAAoB;CACpB,aAAa;CACb,iBAAiB;CACjB,gBAAgB;CAChB;AACD;CACC,mBAAmB;CACnB,UAAU;;CAEV,WAAW;CACX,gBAAgB;CAChB,eAAe;CACf,wCAAwC;CACxC,6BAA6B;CAC7B;AACD;CACC,eAAe;CACf;AAGD;CACC,aAAa;CACb,gBAAgB;CAChB,YAAY;CACZ,oBAAoB;CACpB,oBAAoB;CACpB,mBAAmB;CACnB,aAAa;CACb,6BAA6B;CAC7B;AAED;CACC,cAAc;CACd,WAAW;CACX,eAAe;CACf,mBAAmB;CACnB;AACD;AACC;EACC,mBAAmB;CACnB;AACD;EACC,kBAAkB;CAClB;AACD;EACC,WAAW;CACX;AACD;EACC,mBAAmB;CACnB;CAED;AAED;AACC;EACC,SAAS;CACT;AACD;EACC,UAAU;CACV;CACD;AAED;AACI;QACI,kBAAkB;CACrB;CACJ;AAED;AACI;QACI,YAAY;CACf;AACD;OACG,sCAAsC;QACrC,mBAAmB;QACnB,kBAAkB;QAClB,aAAa;CAChB;IACD,kEAAkE;GACnE;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;OAoCI;CACN","file":"app.css","sourcesContent":["\r\n/* Keep the nav menu independent of scrolling and on top of other items */\r\n.backgrounds {\r\n    background-image:url(../../../Images/background2.jpg);\r\n    position: fixed;\r\n    background-position: center;\r\n    top: 0; \r\n    left: 0;\r\n\tright:0;\r\n\tbottom:0;\r\n}\r\n\r\nh1{\r\n\tcolor:red;\r\n}\r\n.header{\r\n\tpadding:30px;\r\n\twidth:100%;\r\n\theight:25%;\r\n}\r\n.container{\r\n\tmargin-top:60px;\r\n\tmargin-bottom: 60px;\r\n}\r\n.form-horizontal{\r\n\tbackground:rgba(255,255,255,0.6);\r\n\tmax-width: 540px;\r\n\tmargin:auto;\r\n\tpadding-bottom: 25px;\r\n\tborder-radius: 15px;\r\n\ttext-align: center;\r\n}\r\n.form-horizontal .heading{\r\n\tdisplay: block;\r\n\tfont-family:FZYaoti;\r\n\tbackground:rgba(255,255,255,0.6);\r\n\tborder-radius:15px 15px 0 0px;\r\n\tfont-size: 35px;\r\n\tfont-weight: 700;\r\n\tpadding: 35px 0;\r\n\t\r\n\tmargin-bottom: 30px;\r\n}\r\n.form-horizontal .form-group{\r\n\tpadding: 0;\r\n\tfont-family: Microsoft Yahei;\r\n\tmargin: 15px 60px;\r\n\tposition:relative;\r\n}\r\n.form-horizontal .form-control{\r\n\tbackground: #f0f0f0;\r\n\topacity: 0.8;\r\n\tborder: none;\r\n\tborder-radius: 20px;\r\n\tbox-shadow: none;\r\n\tpadding: 0 50px 0 80px;\r\n\theight: 40px;\r\n\ttransition: all 0.3s ease 0s;\r\n}\r\n.form-horizontal .form-control:focus{\r\n\tbackground: #e0e0e0;\r\n\topacity: 0.8;\r\n\tbox-shadow: none;\r\n\toutline: 0 none;\r\n}\r\n.form-horizontal .form-group span{\r\n\tposition: absolute;\r\n\ttop: 12px;\r\n\r\n\tleft: 45px;\r\n\tfont-size: 16px;\r\n\tcolor: #c8c8c8;\r\n\tanimation: loaded 0.8s ease 0s 1 normal;\r\n\ttransition: all 0.5s ease 0s;\r\n}\r\n.form-horizontal .form-control:focus + span{\r\n\tcolor: #00b4ef;\r\n}\r\n\r\n\r\n.form-horizontal .btn{\r\n\tfloat: right;\r\n\tfont-size: 14px;\r\n\tcolor: #fff;\r\n\tbackground: #00b4ef;\r\n\tborder-radius: 30px;\r\n\tpadding: 10px 25px;\r\n\tborder: none;\r\n\ttransition: all 0.5s ease 0s;\r\n}\r\n\r\n.form-horizontal a{\r\n\tdisplay:block;\r\n\tfloat:left;\r\n\tfont-size:14px;\r\n\tpadding: 10px 25px;\r\n}\r\n@media only screen and (max-width: 479px){\r\n\t.header{\r\n\t\ttext-align: center;\r\n\t}\r\n\t.form-horizontal .form-group{\r\n\t\tmargin: 15px 25px;\r\n\t}\r\n\t.form-horizontal .form-group i{\r\n\t\tleft: 45px;\r\n\t}\r\n\t.form-horizontal .btn{\r\n\t\tpadding: 10px 20px;\r\n\t}\r\n\r\n}\r\n\r\n@keyframes loaded{\r\n\tfrom{\r\n\t\tleft:0px;\r\n\t}\r\n\tto{\r\n\t\tleft:45px;\r\n\t}\r\n}\r\n\r\n@media (max-width: 767px) {\r\n    body {\r\n        padding-top: 50px;\r\n    }   \r\n}\r\n\r\n@media (min-width: 768px) {\r\n    .background{\r\n        height:100%;\r\n    }\r\n    .background .inside{\r\n       /* background:rgba(255,255,255,0.8);*/   \r\n        border-radius: 0px;\r\n        border-width: 0px;\r\n        height: 100%;        \r\n    }\r\n    /* On small screens, convert the nav menu to a vertical sidebar */\r\n   /* .main-nav {\r\n        height: 100%;\r\n        width: calc(25% - 20px);\r\n    }\r\n    .main-nav .navbar {\r\n        background-color:rgba(0,162,232,0.8);\r\n        border-radius: 0px;\r\n        border-width: 0px;\r\n        height: 100%;\r\n    }\r\n    .main-nav .navbar-header {\r\n        float: none;\r\n    }\r\n    .main-nav .navbar-collapse {\r\n        border-top: 1px solid #fff;\r\n        padding: 0px;\r\n    }\r\n    .main-nav .navbar ul {\r\n        float: none;\r\n                font-size: 20px;\r\n\r\n    }\r\n    .main-nav .navbar li {\r\n        float: none;\r\n        font-size: 18px;\r\n        margin: 6px;\r\n    }\r\n    .main-nav .navbar li a {\r\n        padding: 18px 16px;\r\n        border-radius: 4px;\r\n    }\r\n    .main-nav .navbar a {\r\n        width: 100%;\r\n        white-space: nowrap;\r\n        overflow: hidden;\r\n        text-overflow: ellipsis;\r\n    }*/\r\n}\r\n"],"sourceRoot":"webpack://"}]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
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
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
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
    while(len) {
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
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
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

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
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
var Reflect;
(function (Reflect) {
    "use strict";
    var hasOwn = Object.prototype.hasOwnProperty;
    // feature test for Symbol support
    var supportsSymbol = typeof Symbol === "function";
    var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
    var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
    var HashMap;
    (function (HashMap) {
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        HashMap.create = supportsCreate
            ? function () { return MakeDictionary(Object.create(null)); }
            : supportsProto
                ? function () { return MakeDictionary({ __proto__: null }); }
                : function () { return MakeDictionary({}); };
        HashMap.has = downLevel
            ? function (map, key) { return hasOwn.call(map, key); }
            : function (map, key) { return key in map; };
        HashMap.get = downLevel
            ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
            : function (map, key) { return map[key]; };
    })(HashMap || (HashMap = {}));
    // Load global or shim versions of Map, Set, and WeakMap
    var functionPrototype = Object.getPrototypeOf(Function);
    var usePolyfill = typeof process === "object" && __webpack_require__.i({"NODE_ENV":"development"}) && __webpack_require__.i({"NODE_ENV":"development"})["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
    var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
    var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
    var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
    // [[Metadata]] internal slot
    // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
    var Metadata = new _WeakMap();
    /**
      * Applies a set of decorators to a property of a target object.
      * @param decorators An array of decorators.
      * @param target The target object.
      * @param propertyKey (Optional) The property key to decorate.
      * @param attributes (Optional) The property descriptor for the target key.
      * @remarks Decorators are applied in reverse order.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Example = Reflect.decorate(decoratorsArray, Example);
      *
      *     // property (on constructor)
      *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Object.defineProperty(Example, "staticMethod",
      *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
      *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
      *
      *     // method (on prototype)
      *     Object.defineProperty(Example.prototype, "method",
      *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
      *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
      *
      */
    function decorate(decorators, target, propertyKey, attributes) {
        if (!IsUndefined(propertyKey)) {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsObject(target))
                throw new TypeError();
            if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                throw new TypeError();
            if (IsNull(attributes))
                attributes = undefined;
            propertyKey = ToPropertyKey(propertyKey);
            return DecorateProperty(decorators, target, propertyKey, attributes);
        }
        else {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsConstructor(target))
                throw new TypeError();
            return DecorateConstructor(decorators, target);
        }
    }
    Reflect.decorate = decorate;
    // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
    // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
    /**
      * A default metadata decorator factory that can be used on a class, class member, or parameter.
      * @param metadataKey The key for the metadata entry.
      * @param metadataValue The value for the metadata entry.
      * @returns A decorator function.
      * @remarks
      * If `metadataKey` is already defined for the target and target key, the
      * metadataValue for that key will be overwritten.
      * @example
      *
      *     // constructor
      *     @Reflect.metadata(key, value)
      *     class Example {
      *     }
      *
      *     // property (on constructor, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticProperty;
      *     }
      *
      *     // property (on prototype, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         property;
      *     }
      *
      *     // method (on constructor)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticMethod() { }
      *     }
      *
      *     // method (on prototype)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         method() { }
      *     }
      *
      */
    function metadata(metadataKey, metadataValue) {
        function decorator(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                throw new TypeError();
            OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        return decorator;
    }
    Reflect.metadata = metadata;
    /**
      * Define a unique metadata entry on the target.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param metadataValue A value that contains attached metadata.
      * @param target The target object on which to define metadata.
      * @param propertyKey (Optional) The property key for the target.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Reflect.defineMetadata("custom:annotation", options, Example);
      *
      *     // property (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
      *
      *     // method (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
      *
      *     // decorator factory as metadata-producing annotation.
      *     function MyAnnotation(options): Decorator {
      *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
      *     }
      *
      */
    function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
    }
    Reflect.defineMetadata = defineMetadata;
    /**
      * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasMetadata = hasMetadata;
    /**
      * Gets a value indicating whether the target object has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasOwnMetadata = hasOwnMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getMetadata = getMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getOwnMetadata = getOwnMetadata;
    /**
      * Gets the metadata keys defined on the target object or its prototype chain.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "method");
      *
      */
    function getMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryMetadataKeys(target, propertyKey);
    }
    Reflect.getMetadataKeys = getMetadataKeys;
    /**
      * Gets the unique metadata keys defined on the target object.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
      *
      */
    function getOwnMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryOwnMetadataKeys(target, propertyKey);
    }
    Reflect.getOwnMetadataKeys = getOwnMetadataKeys;
    /**
      * Deletes the metadata entry from the target object with the provided key.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata entry was found and deleted; otherwise, false.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.deleteMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function deleteMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        if (!metadataMap.delete(metadataKey))
            return false;
        if (metadataMap.size > 0)
            return true;
        var targetMetadata = Metadata.get(target);
        targetMetadata.delete(propertyKey);
        if (targetMetadata.size > 0)
            return true;
        Metadata.delete(target);
        return true;
    }
    Reflect.deleteMetadata = deleteMetadata;
    function DecorateConstructor(decorators, target) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsConstructor(decorated))
                    throw new TypeError();
                target = decorated;
            }
        }
        return target;
    }
    function DecorateProperty(decorators, target, propertyKey, descriptor) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target, propertyKey, descriptor);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsObject(decorated))
                    throw new TypeError();
                descriptor = decorated;
            }
        }
        return descriptor;
    }
    function GetOrCreateMetadataMap(O, P, Create) {
        var targetMetadata = Metadata.get(O);
        if (IsUndefined(targetMetadata)) {
            if (!Create)
                return undefined;
            targetMetadata = new _Map();
            Metadata.set(O, targetMetadata);
        }
        var metadataMap = targetMetadata.get(P);
        if (IsUndefined(metadataMap)) {
            if (!Create)
                return undefined;
            metadataMap = new _Map();
            targetMetadata.set(P, metadataMap);
        }
        return metadataMap;
    }
    // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
    function OrdinaryHasMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return true;
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryHasMetadata(MetadataKey, parent, P);
        return false;
    }
    // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
    function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        return ToBoolean(metadataMap.has(MetadataKey));
    }
    // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
    function OrdinaryGetMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return OrdinaryGetOwnMetadata(MetadataKey, O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryGetMetadata(MetadataKey, parent, P);
        return undefined;
    }
    // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
    function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return undefined;
        return metadataMap.get(MetadataKey);
    }
    // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
    function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
        metadataMap.set(MetadataKey, MetadataValue);
    }
    // 3.1.6.1 OrdinaryMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
    function OrdinaryMetadataKeys(O, P) {
        var ownKeys = OrdinaryOwnMetadataKeys(O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (parent === null)
            return ownKeys;
        var parentKeys = OrdinaryMetadataKeys(parent, P);
        if (parentKeys.length <= 0)
            return ownKeys;
        if (ownKeys.length <= 0)
            return parentKeys;
        var set = new _Set();
        var keys = [];
        for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
            var key = ownKeys_1[_i];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
            var key = parentKeys_1[_a];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        return keys;
    }
    // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
    function OrdinaryOwnMetadataKeys(O, P) {
        var keys = [];
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return keys;
        var keysObj = metadataMap.keys();
        var iterator = GetIterator(keysObj);
        var k = 0;
        while (true) {
            var next = IteratorStep(iterator);
            if (!next) {
                keys.length = k;
                return keys;
            }
            var nextValue = IteratorValue(next);
            try {
                keys[k] = nextValue;
            }
            catch (e) {
                try {
                    IteratorClose(iterator);
                }
                finally {
                    throw e;
                }
            }
            k++;
        }
    }
    // 6 ECMAScript Data Typ0es and Values
    // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
    function Type(x) {
        if (x === null)
            return 1 /* Null */;
        switch (typeof x) {
            case "undefined": return 0 /* Undefined */;
            case "boolean": return 2 /* Boolean */;
            case "string": return 3 /* String */;
            case "symbol": return 4 /* Symbol */;
            case "number": return 5 /* Number */;
            case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
            default: return 6 /* Object */;
        }
    }
    // 6.1.1 The Undefined Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
    function IsUndefined(x) {
        return x === undefined;
    }
    // 6.1.2 The Null Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
    function IsNull(x) {
        return x === null;
    }
    // 6.1.5 The Symbol Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
    function IsSymbol(x) {
        return typeof x === "symbol";
    }
    // 6.1.7 The Object Type
    // https://tc39.github.io/ecma262/#sec-object-type
    function IsObject(x) {
        return typeof x === "object" ? x !== null : typeof x === "function";
    }
    // 7.1 Type Conversion
    // https://tc39.github.io/ecma262/#sec-type-conversion
    // 7.1.1 ToPrimitive(input [, PreferredType])
    // https://tc39.github.io/ecma262/#sec-toprimitive
    function ToPrimitive(input, PreferredType) {
        switch (Type(input)) {
            case 0 /* Undefined */: return input;
            case 1 /* Null */: return input;
            case 2 /* Boolean */: return input;
            case 3 /* String */: return input;
            case 4 /* Symbol */: return input;
            case 5 /* Number */: return input;
        }
        var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
        var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
        if (exoticToPrim !== undefined) {
            var result = exoticToPrim.call(input, hint);
            if (IsObject(result))
                throw new TypeError();
            return result;
        }
        return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
    }
    // 7.1.1.1 OrdinaryToPrimitive(O, hint)
    // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
    function OrdinaryToPrimitive(O, hint) {
        if (hint === "string") {
            var toString_1 = O.toString;
            if (IsCallable(toString_1)) {
                var result = toString_1.call(O);
                if (!IsObject(result))
                    return result;
            }
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        else {
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
            var toString_2 = O.toString;
            if (IsCallable(toString_2)) {
                var result = toString_2.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        throw new TypeError();
    }
    // 7.1.2 ToBoolean(argument)
    // https://tc39.github.io/ecma262/2016/#sec-toboolean
    function ToBoolean(argument) {
        return !!argument;
    }
    // 7.1.12 ToString(argument)
    // https://tc39.github.io/ecma262/#sec-tostring
    function ToString(argument) {
        return "" + argument;
    }
    // 7.1.14 ToPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-topropertykey
    function ToPropertyKey(argument) {
        var key = ToPrimitive(argument, 3 /* String */);
        if (IsSymbol(key))
            return key;
        return ToString(key);
    }
    // 7.2 Testing and Comparison Operations
    // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
    // 7.2.2 IsArray(argument)
    // https://tc39.github.io/ecma262/#sec-isarray
    function IsArray(argument) {
        return Array.isArray
            ? Array.isArray(argument)
            : argument instanceof Object
                ? argument instanceof Array
                : Object.prototype.toString.call(argument) === "[object Array]";
    }
    // 7.2.3 IsCallable(argument)
    // https://tc39.github.io/ecma262/#sec-iscallable
    function IsCallable(argument) {
        // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
        return typeof argument === "function";
    }
    // 7.2.4 IsConstructor(argument)
    // https://tc39.github.io/ecma262/#sec-isconstructor
    function IsConstructor(argument) {
        // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
        return typeof argument === "function";
    }
    // 7.2.7 IsPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-ispropertykey
    function IsPropertyKey(argument) {
        switch (Type(argument)) {
            case 3 /* String */: return true;
            case 4 /* Symbol */: return true;
            default: return false;
        }
    }
    // 7.3 Operations on Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-objects
    // 7.3.9 GetMethod(V, P)
    // https://tc39.github.io/ecma262/#sec-getmethod
    function GetMethod(V, P) {
        var func = V[P];
        if (func === undefined || func === null)
            return undefined;
        if (!IsCallable(func))
            throw new TypeError();
        return func;
    }
    // 7.4 Operations on Iterator Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
    function GetIterator(obj) {
        var method = GetMethod(obj, iteratorSymbol);
        if (!IsCallable(method))
            throw new TypeError(); // from Call
        var iterator = method.call(obj);
        if (!IsObject(iterator))
            throw new TypeError();
        return iterator;
    }
    // 7.4.4 IteratorValue(iterResult)
    // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
    function IteratorValue(iterResult) {
        return iterResult.value;
    }
    // 7.4.5 IteratorStep(iterator)
    // https://tc39.github.io/ecma262/#sec-iteratorstep
    function IteratorStep(iterator) {
        var result = iterator.next();
        return result.done ? false : result;
    }
    // 7.4.6 IteratorClose(iterator, completion)
    // https://tc39.github.io/ecma262/#sec-iteratorclose
    function IteratorClose(iterator) {
        var f = iterator["return"];
        if (f)
            f.call(iterator);
    }
    // 9.1 Ordinary Object Internal Methods and Internal Slots
    // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
    // 9.1.1.1 OrdinaryGetPrototypeOf(O)
    // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
    function OrdinaryGetPrototypeOf(O) {
        var proto = Object.getPrototypeOf(O);
        if (typeof O !== "function" || O === functionPrototype)
            return proto;
        // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
        // Try to determine the superclass constructor. Compatible implementations
        // must either set __proto__ on a subclass constructor to the superclass constructor,
        // or ensure each class has a valid `constructor` property on its prototype that
        // points back to the constructor.
        // If this is not the same as Function.[[Prototype]], then this is definately inherited.
        // This is the case when in ES6 or when using __proto__ in a compatible browser.
        if (proto !== functionPrototype)
            return proto;
        // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
        var prototype = O.prototype;
        var prototypeProto = prototype && Object.getPrototypeOf(prototype);
        if (prototypeProto == null || prototypeProto === Object.prototype)
            return proto;
        // If the constructor was not a function, then we cannot determine the heritage.
        var constructor = prototypeProto.constructor;
        if (typeof constructor !== "function")
            return proto;
        // If we have some kind of self-reference, then we cannot determine the heritage.
        if (constructor === O)
            return proto;
        // we have a pretty good guess at the heritage.
        return constructor;
    }
    // naive Map shim
    function CreateMapPolyfill() {
        var cacheSentinel = {};
        var arraySentinel = [];
        var MapIterator = (function () {
            function MapIterator(keys, values, selector) {
                this._index = 0;
                this._keys = keys;
                this._values = values;
                this._selector = selector;
            }
            MapIterator.prototype["@@iterator"] = function () { return this; };
            MapIterator.prototype[iteratorSymbol] = function () { return this; };
            MapIterator.prototype.next = function () {
                var index = this._index;
                if (index >= 0 && index < this._keys.length) {
                    var result = this._selector(this._keys[index], this._values[index]);
                    if (index + 1 >= this._keys.length) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    else {
                        this._index++;
                    }
                    return { value: result, done: false };
                }
                return { value: undefined, done: true };
            };
            MapIterator.prototype.throw = function (error) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                throw error;
            };
            MapIterator.prototype.return = function (value) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                return { value: value, done: true };
            };
            return MapIterator;
        }());
        return (function () {
            function Map() {
                this._keys = [];
                this._values = [];
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            }
            Object.defineProperty(Map.prototype, "size", {
                get: function () { return this._keys.length; },
                enumerable: true,
                configurable: true
            });
            Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
            Map.prototype.get = function (key) {
                var index = this._find(key, /*insert*/ false);
                return index >= 0 ? this._values[index] : undefined;
            };
            Map.prototype.set = function (key, value) {
                var index = this._find(key, /*insert*/ true);
                this._values[index] = value;
                return this;
            };
            Map.prototype.delete = function (key) {
                var index = this._find(key, /*insert*/ false);
                if (index >= 0) {
                    var size = this._keys.length;
                    for (var i = index + 1; i < size; i++) {
                        this._keys[i - 1] = this._keys[i];
                        this._values[i - 1] = this._values[i];
                    }
                    this._keys.length--;
                    this._values.length--;
                    if (key === this._cacheKey) {
                        this._cacheKey = cacheSentinel;
                        this._cacheIndex = -2;
                    }
                    return true;
                }
                return false;
            };
            Map.prototype.clear = function () {
                this._keys.length = 0;
                this._values.length = 0;
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            };
            Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
            Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
            Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
            Map.prototype["@@iterator"] = function () { return this.entries(); };
            Map.prototype[iteratorSymbol] = function () { return this.entries(); };
            Map.prototype._find = function (key, insert) {
                if (this._cacheKey !== key) {
                    this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                }
                if (this._cacheIndex < 0 && insert) {
                    this._cacheIndex = this._keys.length;
                    this._keys.push(key);
                    this._values.push(undefined);
                }
                return this._cacheIndex;
            };
            return Map;
        }());
        function getKey(key, _) {
            return key;
        }
        function getValue(_, value) {
            return value;
        }
        function getEntry(key, value) {
            return [key, value];
        }
    }
    // naive Set shim
    function CreateSetPolyfill() {
        return (function () {
            function Set() {
                this._map = new _Map();
            }
            Object.defineProperty(Set.prototype, "size", {
                get: function () { return this._map.size; },
                enumerable: true,
                configurable: true
            });
            Set.prototype.has = function (value) { return this._map.has(value); };
            Set.prototype.add = function (value) { return this._map.set(value, value), this; };
            Set.prototype.delete = function (value) { return this._map.delete(value); };
            Set.prototype.clear = function () { this._map.clear(); };
            Set.prototype.keys = function () { return this._map.keys(); };
            Set.prototype.values = function () { return this._map.values(); };
            Set.prototype.entries = function () { return this._map.entries(); };
            Set.prototype["@@iterator"] = function () { return this.keys(); };
            Set.prototype[iteratorSymbol] = function () { return this.keys(); };
            return Set;
        }());
    }
    // naive WeakMap shim
    function CreateWeakMapPolyfill() {
        var UUID_SIZE = 16;
        var keys = HashMap.create();
        var rootKey = CreateUniqueKey();
        return (function () {
            function WeakMap() {
                this._key = CreateUniqueKey();
            }
            WeakMap.prototype.has = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.has(table, this._key) : false;
            };
            WeakMap.prototype.get = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.get(table, this._key) : undefined;
            };
            WeakMap.prototype.set = function (target, value) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                table[this._key] = value;
                return this;
            };
            WeakMap.prototype.delete = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? delete table[this._key] : false;
            };
            WeakMap.prototype.clear = function () {
                // NOTE: not a real clear, just makes the previous data unreachable
                this._key = CreateUniqueKey();
            };
            return WeakMap;
        }());
        function CreateUniqueKey() {
            var key;
            do
                key = "@@WeakMap@@" + CreateUUID();
            while (HashMap.has(keys, key));
            keys[key] = true;
            return key;
        }
        function GetOrCreateWeakMapTable(target, create) {
            if (!hasOwn.call(target, rootKey)) {
                if (!create)
                    return undefined;
                Object.defineProperty(target, rootKey, { value: HashMap.create() });
            }
            return target[rootKey];
        }
        function FillRandomBytes(buffer, size) {
            for (var i = 0; i < size; ++i)
                buffer[i] = Math.random() * 0xff | 0;
            return buffer;
        }
        function GenRandomBytes(size) {
            if (typeof Uint8Array === "function") {
                if (typeof crypto !== "undefined")
                    return crypto.getRandomValues(new Uint8Array(size));
                if (typeof msCrypto !== "undefined")
                    return msCrypto.getRandomValues(new Uint8Array(size));
                return FillRandomBytes(new Uint8Array(size), size);
            }
            return FillRandomBytes(new Array(size), size);
        }
        function CreateUUID() {
            var data = GenRandomBytes(UUID_SIZE);
            // mark as random - RFC 4122 § 4.4
            data[6] = data[6] & 0x4f | 0x40;
            data[8] = data[8] & 0xbf | 0x80;
            var result = "";
            for (var offset = 0; offset < UUID_SIZE; ++offset) {
                var byte = data[offset];
                if (offset === 4 || offset === 6 || offset === 8)
                    result += "-";
                if (byte < 16)
                    result += "0";
                result += byte.toString(16).toLowerCase();
            }
            return result;
        }
    }
    // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
    function MakeDictionary(obj) {
        obj.__ = undefined;
        delete obj.__;
        return obj;
    }
    // patch global Reflect
    (function (__global) {
        if (typeof __global.Reflect !== "undefined") {
            if (__global.Reflect !== Reflect) {
                for (var p in Reflect) {
                    if (hasOwn.call(Reflect, p)) {
                        __global.Reflect[p] = Reflect[p];
                    }
                }
            }
        }
        else {
            __global.Reflect = Reflect;
        }
    })(typeof global !== "undefined" ? global :
        typeof self !== "undefined" ? self :
            Function("return this;")());
})(Reflect || (Reflect = {}));
//# sourceMappingURL=Reflect.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(24), __webpack_require__(39)))

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "Images/logo.png";

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
  * vue-class-component v5.0.2
  * (c) 2015-2017 Evan You
  * @license MIT
  */


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(__webpack_require__(0));

function createDecorator(factory) {
    return function (target, key, index) {
        var Ctor = target.constructor;
        if (!Ctor.__decorators__) {
            Ctor.__decorators__ = [];
        }
        if (typeof index !== 'number') {
            index = undefined;
        }
        Ctor.__decorators__.push(function (options) { return factory(options, key, index); });
    };
}
function warn(message) {
    if (typeof console !== 'undefined') {
        console.warn('[vue-class-component] ' + message);
    }
}

function collectDataFromConstructor(vm, Component) {
    Component.prototype._init = function () {
        var _this = this;
        var keys = Object.getOwnPropertyNames(vm);
        if (vm.$options.props) {
            for (var key in vm.$options.props) {
                if (!vm.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
        }
        keys.forEach(function (key) {
            if (key.charAt(0) !== '_') {
                Object.defineProperty(_this, key, {
                    get: function () { return vm[key]; },
                    set: function (value) { return vm[key] = value; }
                });
            }
        });
    };
    var data = new Component();
    var plainData = {};
    Object.keys(data).forEach(function (key) {
        if (data[key] !== undefined) {
            plainData[key] = data[key];
        }
    });
    if (true) {
        if (!(Component.prototype instanceof Vue) && Object.keys(plainData).length > 0) {
            warn('Component class must inherit Vue or its descendant class ' +
                'when class property is used.');
        }
    }
    return plainData;
}

var $internalHooks = [
    'data',
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeDestroy',
    'destroyed',
    'beforeUpdate',
    'updated',
    'activated',
    'deactivated',
    'render'
];
function componentFactory(Component, options) {
    if (options === void 0) { options = {}; }
    options.name = options.name || Component._componentTag || Component.name;
    var proto = Component.prototype;
    Object.getOwnPropertyNames(proto).forEach(function (key) {
        if (key === 'constructor') {
            return;
        }
        if ($internalHooks.indexOf(key) > -1) {
            options[key] = proto[key];
            return;
        }
        var descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (typeof descriptor.value === 'function') {
            (options.methods || (options.methods = {}))[key] = descriptor.value;
        }
        else if (descriptor.get || descriptor.set) {
            (options.computed || (options.computed = {}))[key] = {
                get: descriptor.get,
                set: descriptor.set
            };
        }
    });
    (options.mixins || (options.mixins = [])).push({
        data: function () {
            return collectDataFromConstructor(this, Component);
        }
    });
    var decorators = Component.__decorators__;
    if (decorators) {
        decorators.forEach(function (fn) { return fn(options); });
    }
    var superProto = Object.getPrototypeOf(Component.prototype);
    var Super = superProto instanceof Vue
        ? superProto.constructor
        : Vue;
    return Super.extend(options);
}

function Component(options) {
    if (typeof options === 'function') {
        return componentFactory(options);
    }
    return function (Component) {
        return componentFactory(Component, options);
    };
}
(function (Component) {
    function registerHooks(keys) {
        $internalHooks.push.apply($internalHooks, keys);
    }
    Component.registerHooks = registerHooks;
})(Component || (Component = {}));
var Component$1 = Component;

exports['default'] = Component$1;
exports.createDecorator = createDecorator;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(36)

var Component = __webpack_require__(1)(
  /* script */
  null,
  /* template */
  __webpack_require__(32),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\学习\\03 其他事务\\校史竞赛系统\\POJECT\\SEU-History-Contest-System\\HistoryContest.Client\\Scripts\\components\\navmenu\\navmenu.vue.html"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] navmenu.vue.html: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-71969072", Component.options)
  } else {
    hotAPI.reload("data-v-71969072", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c("div")
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0c646c6e", module.exports)
  }
}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c("div")
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-480bca04", module.exports)
  }
}

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticStyle: {
      "width": "100%"
    }
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-md-6 col-md-offset-3"
  }, [_c('validator', {
    attrs: {
      "name": "validation"
    }
  }, [_c('form', {
    staticClass: "form-horizontal",
    attrs: {
      "data-toggle": "validator",
      "method": "POST",
      "action": "xxxx.asp"
    }
  }, [_c('span', {
    staticClass: "heading"
  }, [_vm._v("校史校情知识竞赛")]), _vm._v(" "), _c('div', {
    staticClass: "form-group username-field"
  }, [_c('input', {
    directives: [{
      name: "validate",
      rawName: "v-validate:username",
      value: ({
        minlength: 6,
        maxlength: 12
      }),
      expression: "{minlength:6,maxlength:12}",
      arg: "username"
    }],
    staticClass: "form-control",
    attrs: {
      "type": "text",
      "id": "username",
      "pattern": "^[0-9]{8}$",
      "required": "",
      "autofocus": "",
      "placeholder": "账号为学号",
      "name": "user",
      "data-toggle": "validator"
    }
  }), _vm._v(" "), _c('div', [_vm._v("\r\n                                            " + _vm._s(_vm._f("json")(_vm.$myForm)) + "\r\n                                        ")]), _vm._v(" "), _c('span', {
    staticClass: "glyphicon glyphicon-user"
  })]), _vm._v(" "), _c('div', {
    staticClass: "form-group"
  }, [_c('input', {
    staticClass: "form-control",
    attrs: {
      "type": "password",
      "pattern": "^[0-9]{9}$",
      "required": "",
      "placeholder": "密码为一卡通号",
      "data-toggle": "validator",
      "name": "password",
      "title": "密码为一卡通号",
      "data-minlength": "9",
      "maxlength": "9",
      "data-error": "密码为九位一卡通号！"
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "glyphicon glyphicon-lock"
  })]), _vm._v(" "), _c('div', {
    staticClass: "form-group"
  }, [_c('a', {
    attrs: {
      "href": "#"
    }
  }, [_vm._v("还未注册？")]), _vm._v(" "), _c('button', {
    staticClass: "btn btn-default",
    attrs: {
      "type": "submit"
    }
  }, [_vm._v("登录")])])])])], 1)])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "header"
  }, [_c('img', {
    attrs: {
      "src": __webpack_require__(26),
      "alt": "东大校徽"
    }
  })])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-55a30ee4", module.exports)
  }
}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "main-nav"
  }, [_c('div', {
    staticClass: "navbar navbar-inverse"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  }), _vm._v(" "), _c('div', {
    staticClass: "navbar-collapse collapse"
  }, [_c('ul', {
    staticClass: "nav navbar-nav"
  }, [_c('li', {
    attrs: {
      "id": "list1"
    }
  }, [_c('router-link', {
    attrs: {
      "to": "/",
      "exact": true
    }
  }, [_c('span', {
    staticClass: "glyphicon glyphicon-home"
  }), _vm._v(" 主页\n                    ")])], 1), _vm._v(" "), _c('li', {
    attrs: {
      "id": "list2"
    }
  }, [_c('router-link', {
    attrs: {
      "to": "/counter"
    }
  }, [_c('span', {
    staticClass: "glyphicon glyphicon-th-list"
  }), _vm._v(" 开始测试\n                    ")])], 1), _vm._v(" "), _c('li', {
    attrs: {
      "id": "list3"
    }
  }, [_c('router-link', {
    attrs: {
      "to": "/fetchdata"
    }
  }, [_c('span', {
    staticClass: "glyphicon glyphicon-education"
  }), _vm._v(" 成绩\n                    ")])], 1)])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "navbar-header"
  }, [_c('button', {
    staticClass: "navbar-toggle",
    attrs: {
      "type": "button",
      "data-toggle": "collapse",
      "data-target": ".navbar-collapse"
    }
  }, [_c('span', {
    staticClass: "sr-only"
  }, [_vm._v("Toggle navigation")]), _vm._v(" "), _c('span', {
    staticClass: "icon-bar"
  }), _vm._v(" "), _c('span', {
    staticClass: "icon-bar"
  }), _vm._v(" "), _c('span', {
    staticClass: "icon-bar"
  })]), _vm._v(" "), _c('a', {
    staticClass: "navbar-brand",
    attrs: {
      "href": "#"
    }
  }, [_vm._v("校史校情竞赛系统")])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-71969072", module.exports)
  }
}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('h4', {
    staticStyle: {
      "text-align": "right"
    }
  }, [_vm._v("欢迎，"), _c('span', [_vm._v("***")]), _vm._v("同学！")]), _vm._v(" "), _c('h3', [_vm._v("提示信息：")]), _vm._v(" "), _c('p', [_vm._v("点击页面左侧导航栏“开始测试”进入校史校情竞赛答题页面。")]), _vm._v(" "), _c('p', [_vm._v("推荐使用Firefox,Safari,Chrome或IE9及以上版本浏览器进行答题。如在答题过程中出现问题，请联系东南大学计算机科学与工程学院科协赛事部。")]), _vm._v(" "), _c('p', [_vm._v("（完美甩锅）o(*￣▽￣*)o")])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-826e69d0", module.exports)
  }
}

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "backgrounds"
  }, [_c('div', {
    staticClass: "inside container-fluid",
    staticStyle: {
      "height": "100%"
    },
    attrs: {
      "id": "app-root"
    }
  }, [_c('login-component')], 1)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-e8bff018", module.exports)
  }
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(21);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("6b3fca21", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-55a30ee4\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-55a30ee4\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(22);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("7f6ca90d", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-71969072\",\"scoped\":false,\"hasInlineConfig\":false}!./navmenu.css", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-71969072\",\"scoped\":false,\"hasInlineConfig\":false}!./navmenu.css");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(23);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("49d2c6a2", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-e8bff018\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-e8bff018\",\"scoped\":false,\"hasInlineConfig\":false}!./app.css");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 38 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(2))(19);

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "Images/background2.jpg";

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map