// From https://github.com/kevlatus/polyfill-array-includes/blob/master/array-includes.js
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }

            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                // c. Increase k by 1.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                k++;
            }

            // 8. Return false
            return false;
        }
    });
};//https://github.com/JamesMGreene/Function.name/blob/master/Function.name.js
(function() {

var fnNameMatchRegex = /^\s*function\s+([^\(\s]*)\s*/;

function _name() {
  var match, name;
  if (this === Function || this === Function.prototype.constructor) {
    name = "Function";
  }
  else if (this !== Function.prototype) {
    match = ("" + this).match(fnNameMatchRegex);
    name = match && match[1];
  }
  return name || "";
}

// Inspect the polyfill-ability of this browser
var needsPolyfill = !("name" in Function.prototype && "name" in (function x() {}));
var canDefineProp = typeof Object.defineProperty === "function" &&
  (function() {
    var result;
    try {
      Object.defineProperty(Function.prototype, "_xyz", {
        get: function() {
          return "blah";
        },
        configurable: true
      });
      result = Function.prototype._xyz === "blah";
      delete Function.prototype._xyz;
    }
    catch (e) {
      result = false;
    }
    return result;
  })();
var canDefineGetter = typeof Object.prototype.__defineGetter__ === "function" &&
  (function() {
    var result;
    try {
      Function.prototype.__defineGetter__("_abc", function() {
        return "foo";
      });
      result = Function.prototype._abc === "foo";
      delete Function.prototype._abc;
    }
    catch (e) {
      result = false;
    }
    return result;
  })();



// Add the "private" property for testing, even if the real property can be polyfilled
Function.prototype._name = _name;


// Polyfill it!
// For:
//  * IE >=9 <12
//  * Chrome <33
if (needsPolyfill) {
  // For:
  //  * IE >=9 <12
  //  * Chrome >=5 <33
  if (canDefineProp) {
    Object.defineProperty(Function.prototype, "name", {
      get: function() {
        var name = _name.call(this);

        // Since named function definitions have immutable names, also memoize the
        // output by defining the `name` property directly on this Function
        // instance so that this polyfill will not need to be invoked again
        if (this !== Function.prototype) {
          Object.defineProperty(this, "name", {
            value: name,
            configurable: true
          });
        }

        return name;
      },
      configurable: true
    });
  }
  // For:
  //  * Chrome <5
  else if (canDefineGetter) {
    // NOTE:
    // The snippet:
    //
    //     x.__defineGetter__('y', z);
    //
    // ...is essentially equivalent to:
    //
    //     Object.defineProperty(x, 'y', {
    //       get: z,
    //       configurable: true,  // <-- key difference #1
    //       enumerable: true     // <-- key difference #2
    //     });
    //
    Function.prototype.__defineGetter__("name", function() {
      var name = _name.call(this);

      // Since named function definitions have immutable names, also memoize the
      // output by defining the `name` property directly on this Function
      // instance so that this polyfill will not need to be invoked again
      if (this !== Function.prototype) {
        this.__defineGetter__("name", function() { return name; });
      }

      return name;
    });
  }
}

})();;!function(e){function n(){}function t(e,n){return function(){e.apply(n,arguments)}}function o(e){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],s(e,this)}function i(e,n){for(;3===e._state;)e=e._value;return 0===e._state?void e._deferreds.push(n):(e._handled=!0,void o._immediateFn(function(){var t=1===e._state?n.onFulfilled:n.onRejected;if(null===t)return void(1===e._state?r:u)(n.promise,e._value);var o;try{o=t(e._value)}catch(i){return void u(n.promise,i)}r(n.promise,o)}))}function r(e,n){try{if(n===e)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==typeof n||"function"==typeof n)){var i=n.then;if(n instanceof o)return e._state=3,e._value=n,void f(e);if("function"==typeof i)return void s(t(i,n),e)}e._state=1,e._value=n,f(e)}catch(r){u(e,r)}}function u(e,n){e._state=2,e._value=n,f(e)}function f(e){2===e._state&&0===e._deferreds.length&&o._immediateFn(function(){e._handled||o._unhandledRejectionFn(e._value)});for(var n=0,t=e._deferreds.length;n<t;n++)i(e,e._deferreds[n]);e._deferreds=null}function c(e,n,t){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof n?n:null,this.promise=t}function s(e,n){var t=!1;try{e(function(e){t||(t=!0,r(n,e))},function(e){t||(t=!0,u(n,e))})}catch(o){if(t)return;t=!0,u(n,o)}}var a=setTimeout;o.prototype["catch"]=function(e){return this.then(null,e)},o.prototype.then=function(e,t){var o=new this.constructor(n);return i(this,new c(e,t,o)),o},o.all=function(e){var n=Array.prototype.slice.call(e);return new o(function(e,t){function o(r,u){try{if(u&&("object"==typeof u||"function"==typeof u)){var f=u.then;if("function"==typeof f)return void f.call(u,function(e){o(r,e)},t)}n[r]=u,0===--i&&e(n)}catch(c){t(c)}}if(0===n.length)return e([]);for(var i=n.length,r=0;r<n.length;r++)o(r,n[r])})},o.resolve=function(e){return e&&"object"==typeof e&&e.constructor===o?e:new o(function(n){n(e)})},o.reject=function(e){return new o(function(n,t){t(e)})},o.race=function(e){return new o(function(n,t){for(var o=0,i=e.length;o<i;o++)e[o].then(n,t)})},o._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){a(e,0)},o._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)},o._setImmediateFn=function(e){o._immediateFn=e},o._setUnhandledRejectionFn=function(e){o._unhandledRejectionFn=e},"undefined"!=typeof module&&module.exports?module.exports=o:e.Promise||(e.Promise=o)}(this);;if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(search, this_len) {
        if (this_len === undefined || this_len > this.length) {
            this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
    };
};if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
};if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(search, pos) {
        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
};/*global define, window, document*/

(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define("Behaviors", ["jquery"], factory);
    } else {
        root.Behaviors = factory(root.jQuery);
    }
}(this, function ($) {
    "use strict";

    var module = {},
        behavior_registry = {},
        content_ready_listeners = [],
        ElementMissingError = error("ElementMissingError");
    
    /* Throttle an event handler.
     *
     * Returns a function which, no matter how frequently it's called, will
     * only trigger a maximum of once per timeout period. More specifically,
     * the first event will always be processed, then, no events will process
     * until the end of the timeout period. If one or more events occurred
     * during this period, the last event recieved will trigger immediately
     * after the end of the timeout period, as well as restart the throttling
     * period. Any preceding events will be discarded.
     *
     * Not to be confused with a debounce, which only fires the event handler
     * at the end of a string of events spaced closer than the timeout period.
     *
     * The nature of this function means that any passed in function's return
     * value will be discarded.
     */
    function throttle_single(func, timeout) {
        var lastTimeout, afterLastArgs, afterLastThis;

        function unthrottle() {
            if (afterLastArgs !== undefined) {
                func.apply(afterLastThis, afterLastArgs);
                afterLastArgs = undefined;
                lastTimeout = window.setTimeout(unthrottle, timeout);
            } else {
                lastTimeout = undefined;
            }
        }

        return function () {
            var myThis = this, myArgs = [], i;

            for (i = 0; i < arguments.length; i += 1) {
                myArgs.push(arguments[i]);
            }

            if (lastTimeout === undefined) {
                func.apply(myThis, myArgs);
                lastTimeout = window.setTimeout(unthrottle, timeout);
            } else {
                afterLastArgs = myArgs;
                afterLastThis = myThis;
            }
        };
    }

    function Behavior(elem) {
        //Do something to elem
        this.$elem = $(elem);
    }

    /* Find a behavior's markup.
     *
     * The $context argument passed to this function is the jQuery element that
     * will be searched for behaviors. Any additional arguments will be passed
     * to Behavior.locate and ultimately to the behavior's constructor.
     */
    Behavior.find_markup = function ($context) {
        var results = [], i, splitArgs = [], Class = this;

        for (i = 1; i < arguments.length; i += 1) {
            splitArgs.push(arguments[i]);
        }
        
        function processElem(index, elem) {
            var locateArgs = [elem].concat(splitArgs);

            results.push(Class.locate.apply(Class, locateArgs));
        }
        
        $context.filter(Class.QUERY).each(processElem);
        $context.find(Class.QUERY).each(processElem);

        return results;
    };

    /* Locate a behavior onto an element, returning an instance of that
     * behavior that you can work with.
     *
     * A behavior locates onto an element by instantiating an instance of
     * itself and installing it onto the markup's jQuery data. Therefore, we
     * will only instantiate that behavior once; and further calls to .locate
     * instead return the same object. Thus, it is safe to use .locate as a
     * general accessor - it is idempotent.
     *
     * The elem argument indicates the element that the behavior should locate
     * onto. Further arguments are passed onto the constructor.
     *
     * TODO: Is there a non-jQuery way of handling this?
     */
    Behavior.locate = function (elem, ...objectArgs) {
        var $elem = $(elem), new_object, i, Class = this,
            rc = $elem.data("behaviors-registered-classes");
        
        if ($elem.length === 0) {
            throw new ElementMissingError("Attempted to locate a Behavior onto an empty element query.");
        }

        if (rc === undefined) {
            rc = {};
        }

        if (rc[Class.QUERY] === undefined) {
            rc[Class.QUERY] = new Class(elem, ...objectArgs);
        } else {
            new_object = rc[Class.QUERY];
        }

        $elem.data("behaviors-registered-classes", rc);

        return new_object;
    };

    /* Respond to the presence of new content on the page.
     *
     * By default, we attempt to find markup on all children of the context.
     * Subclasses may do something crazier, like say delay behavior processing
     * until some third-party API is loaded.
     *
     * Consider this roughly equivalent to $(document).ready() callbacks.
     */
    Behavior.content_ready = function ($context) {
        var Class = this;

        Class.find_markup($context);
    };
    
    /* Respond to the impending removal of content from the page.
     * 
     * Most behaviors that only attach event handlers to their own content are
     * safe and do not need to implement content removal support: they will
     * inherently "fall away".
     * 
     * However, behaviors that run a constant animation kernel or attach event
     * handlers to elements outside of their own ownership must provide a
     * mechanism to detach those event handlers and stop those kernels.
     */
    Behavior.content_removal = function ($context) {
        var Class = this,
            $attached_elems = $context.find(Class.QUERY);
        
        //Iterate through each element and see if our behavior has located upon
        //them. We don't just call .find_markup/.locate since we don't want to
        //risk initializing something just to tear it down one cycle later.
        $attached_elems.each(function (index, attach_elem) {
            var $elem = $(attach_elem),
                rc = $elem.data("behaviors-registered-classes");
            
            if (rc === undefined) {
                return;
            }
            
            if (rc[Class.QUERY] === undefined) {
                return;
            }
            
            if (rc[Class.QUERY].deinitialize === undefined) {
                return;
            }
            
            rc[Class.QUERY].deinitialize();
        });
    };

    /* Register a behavior so that it can respond to global events such as new
     * content becoming ready.
     *
     * It is not always appropriate to register your behavior to recieve load
     * events. Generally, if this is a behavior you would initialize yourself,
     * perhaps with special arguments, then you should not register that here.
     */
    function register_behavior(Class, name) {
        if (name === undefined) {
            name = Class.QUERY;
        }

        if (behavior_registry[name] === Class) {
            console.warn("Attempted to register the same behavior twice to the same CSS selector \"" + name + "\".");
            return;
        } else if (behavior_registry[name] !== undefined) {
            console.error("Attempted to register a second behavior onto CSS selector \""
                + name + "\". Only one behavior may be registered to a given CSS selector "
                + "at a given time. The offending classes are " + Class.name
                + " and " + behavior_registry[name].name + ".");
            
            return;
        }

        behavior_registry[name] = Class;
    }
    
    /* Register a function that is called when content is ready.
     * 
     * This function should only be used for things that are not a Behavior.
     * Proper behaviors should be registered using register_behavior for future
     * uses. Non-behavior listeners get registered here so that future uses of
     * behavior registration do not conflict with non-Behavior listeners.
     */
    function register_content_listener(func) {
        content_ready_listeners.push(func);
    }

    /* Indicate that some new content is ready.
     *
     * The given content will be passed onto all registered behaviors.
     *
     * CMS/frameworks with their own ready mechanism will need to ship their
     * own replacement/wrapper for this function that pushes calls to this
     * function over to that mechanism; and calls from that mechanism need to
     * come back here.
     */
    function content_ready($context) {
        var k, i;
        
        function do_later(obj, func) {
            window.setTimeout(func.bind(obj, $context), 0);
        }
        
        for (i = 0; i < content_ready_listeners.length; i += 1) {
            do_later(undefined, content_ready_listeners[i]);
        }

        for (k in behavior_registry) {
            if (behavior_registry.hasOwnProperty(k)) {
                do_later(behavior_registry[k], behavior_registry[k].content_ready);
            }
        }
    }
    
    /* Indicate that content is about to be removed.
     * 
     * Registered behaviors with destructors will be called upon to remove any
     * external event handlers or animation kernels preventing them from being
     * terminated by the JS runtime.
     * 
     * TODO: Add content_removal listener functions.
     */
    function content_removal($context) {
        var k, i;
        
        function do_later(obj, func) {
            window.setTimeout(func.bind(obj, $context), 0);
        }
        
        for (k in behavior_registry) {
            if (behavior_registry.hasOwnProperty(k)) {
                do_later(behavior_registry[k], behavior_registry[k].content_removal);
            }
        }
    }
    
    function error(error_class_name, ParentClass) {
        if (error_class_name === undefined) {
            throw new Error("Please name your error subclass.");
        }

        if (!(ParentClass instanceof Function)) {
            ParentClass = Error;
        }

        var SubError = function (message) {
            var err = new Error(message);
            err.name = error_class_name;

            this.name = error_class_name;
            this.message = err.message;
            if (err.stack) {
                this.stack = err.stack;
            }
        };

        SubError.prototype = new ParentClass("u dont c me");
        SubError.prototype.constructor = SubError;
        SubError.prototype.name = error_class_name;

        delete SubError.prototype.stack;

        return SubError;
    }
    
    function inherit(ChildClass, ParentClass) {
        var k;

        //Use the prototyping system to copy methods from parent to child.
        ChildClass.prototype = Object.create(ParentClass.prototype);
        ChildClass.prototype.constructor = ChildClass;
        ChildClass.prototype.parent = ParentClass.prototype;

        //Manually copy class-level methods from parent to child.
        for (k in ParentClass) {
            if (ParentClass.hasOwnProperty(k)) {
                ChildClass[k] = ParentClass[k];
            }
        }
    }

    function init(ChildClass, object, args) {
        ChildClass.prototype.parent.constructor.apply(object, args);
    }
    
    /* By default, report the initial page load to registered behaviors.
     */
    $(document).ready(function () {
        content_ready($(document));
    });
    
    module.ElementMissingError = ElementMissingError;
    module.throttle_single = throttle_single;
    module.Behavior = Behavior;
    module.error = error;
    module.inherit = inherit;
    module.init = init;
    module.register_behavior = register_behavior;
    module.content_ready = content_ready;
    module.content_removal = content_removal;
    module.register_content_listener = register_content_listener;

    return module;
}));
;/**
 * Function used to get the height of the admin bar in pixels.
 *
 * @return {int} The height of the admin bar (in pixels)
 */
 function get_wp_admin_bar_height(){
    // Start by getting the admin bar
    var admin_bar = document.getElementById( 'wpadminbar' );
    // If the admin bar doesn't exist, just return zero
    if ( !admin_bar ){
        return 0;
    }
    // Otherwise, get the current height
    else {
        return admin_bar.offsetHeight;
    }
}

/**
 * Function for registering callbacks based on a window resize.
 *
 * @param     {Function}    callback                 The callback
 * @param     {object}      context                  The context for the callback
 * @param     {int}         window_resize_timeout    The timeout for the window resize
 *
 * @return    {void}        
 */
 function bind_callback_to_window_resize(callback, context, window_resize_timeout){
    if ( !window_resize_timeout ){
        window_resize_timeout = 500;
    }
    // To allow for the timeout
    var id;
    window.addEventListener("resize", function(){
        // Clear the timeout
        clearTimeout(id);
        // Create the function and callback
        id = setTimeout(function(){
            callback.call(context);
        }, window_resize_timeout);
    });
}

/**
 * Function used to get the height of the header in pixels.
 *
 * @return {int} The height of the header (in pixels)
 */
 function get_header_height(){
    // Start by getting the header
    var header = document.querySelector( 'header' );
    return header.offsetHeight;
}

/**
 * Function used to determine if the header is sticky or not.
 *
 * @return {bool} True if the header is sticky
 */
 function header_is_sticky(){
    // Start by getting the header
    var header = document.querySelector( 'header' );
    // Get the classes attached to the header
    header_classes = header.classList;
    return header_classes.contains( 'fl-theme-builder-header-sticky' );
};(function($){
    /**
     * Mark all the rows with their background color.
     */
    function initColor(){
        var rows = document.querySelector(".fl-page-content").querySelectorAll(".fl-row-content-wrap");
        for(var i = 2; i < rows.length; i++){
            var color = window.getComputedStyle(rows[i], null).getPropertyValue("background-color");
            if(i === 0){
                color = "#fff";
            }
            rows[i].dataset.color = color;
            rows[i].style.backgroundColor = "rgba(0,0,0,0)";
        }
        handleColorScroll();
    }
    
    var rows = $(".fl-page-content").find(".fl-row-content-wrap");
    
    /**
     * Scroll handler that changes the background based on the currently
     * focused page row.
     */
    function handleColorScroll(){
        var scroll = $(window).scrollTop() + ($(window).height() / 3);
        var bgcolor = $(".fl-page-content").css('backgroundColor');
        $(rows).each(function(){
            var $this = $(this);
            if ($this.position().top <= scroll && $this.position().top + $this.height() > scroll) {
                var c = $this.attr("data-color");
                if(c === "" || c === "rgba(0,0,0,0)" || c === "#ffffff" || c === "rgba(0, 0, 0, 0)" || c === "transparent" || c === "#fff"){
                    c = "#fff";
                }
                if(c !== bgcolor){
                    $(".fl-page-content").css("background-color", c); 
                    $("body").css("background-color", c); 
                }
            }
        })
    }
})(jQuery);;(function() {
  var MutationObserver, Util, WeakMap, getComputedStyle, getComputedStyleRX,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Util = (function() {
    function Util() {}

    Util.prototype.extend = function(custom, defaults) {
      var key, value;
      for (key in defaults) {
        value = defaults[key];
        if (custom[key] == null) {
          custom[key] = value;
        }
      }
      return custom;
    };

    Util.prototype.isMobile = function(agent) {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
    };

    Util.prototype.createEvent = function(event, bubble, cancel, detail) {
      var customEvent;
      if (bubble == null) {
        bubble = false;
      }
      if (cancel == null) {
        cancel = false;
      }
      if (detail == null) {
        detail = null;
      }
      if (document.createEvent != null) {
        customEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent(event, bubble, cancel, detail);
      } else if (document.createEventObject != null) {
        customEvent = document.createEventObject();
        customEvent.eventType = event;
      } else {
        customEvent.eventName = event;
      }
      return customEvent;
    };

    Util.prototype.emitEvent = function(elem, event) {
      if (elem.dispatchEvent != null) {
        return elem.dispatchEvent(event);
      } else if (event in (elem != null)) {
        return elem[event]();
      } else if (("on" + event) in (elem != null)) {
        return elem["on" + event]();
      }
    };

    Util.prototype.addEvent = function(elem, event, fn) {
      if (elem.addEventListener != null) {
        return elem.addEventListener(event, fn, false);
      } else if (elem.attachEvent != null) {
        return elem.attachEvent("on" + event, fn);
      } else {
        return elem[event] = fn;
      }
    };

    Util.prototype.removeEvent = function(elem, event, fn) {
      if (elem.removeEventListener != null) {
        return elem.removeEventListener(event, fn, false);
      } else if (elem.detachEvent != null) {
        return elem.detachEvent("on" + event, fn);
      } else {
        return delete elem[event];
      }
    };

    Util.prototype.innerHeight = function() {
      if ('innerHeight' in window) {
        return window.innerHeight;
      } else {
        return document.documentElement.clientHeight;
      }
    };

    return Util;

  })();

  WeakMap = this.WeakMap || this.MozWeakMap || (WeakMap = (function() {
    function WeakMap() {
      this.keys = [];
      this.values = [];
    }

    WeakMap.prototype.get = function(key) {
      var i, item, j, len, ref;
      ref = this.keys;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        item = ref[i];
        if (item === key) {
          return this.values[i];
        }
      }
    };

    WeakMap.prototype.set = function(key, value) {
      var i, item, j, len, ref;
      ref = this.keys;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        item = ref[i];
        if (item === key) {
          this.values[i] = value;
          return;
        }
      }
      this.keys.push(key);
      return this.values.push(value);
    };

    return WeakMap;

  })());

  MutationObserver = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (MutationObserver = (function() {
    function MutationObserver() {
      if (typeof console !== "undefined" && console !== null) {
        console.warn('MutationObserver is not supported by your browser.');
      }
      if (typeof console !== "undefined" && console !== null) {
        console.warn('WOW.js cannot detect dom mutations, please call .sync() after loading new content.');
      }
    }

    MutationObserver.notSupported = true;

    MutationObserver.prototype.observe = function() {};

    return MutationObserver;

  })());

  getComputedStyle = this.getComputedStyle || function(el, pseudo) {
    this.getPropertyValue = function(prop) {
      var ref;
      if (prop === 'float') {
        prop = 'styleFloat';
      }
      if (getComputedStyleRX.test(prop)) {
        prop.replace(getComputedStyleRX, function(_, _char) {
          return _char.toUpperCase();
        });
      }
      return ((ref = el.currentStyle) != null ? ref[prop] : void 0) || null;
    };
    return this;
  };

  getComputedStyleRX = /(\-([a-z]){1})/g;

  this.WOW = (function() {
    WOW.prototype.defaults = {
      boxClass: 'wow',
      animateClass: 'animated',
      offset: 0,
      mobile: true,
      live: true,
      callback: null,
      scrollContainer: null
    };

    function WOW(options) {
      if (options == null) {
        options = {};
      }
      this.scrollCallback = bind(this.scrollCallback, this);
      this.scrollHandler = bind(this.scrollHandler, this);
      this.resetAnimation = bind(this.resetAnimation, this);
      this.start = bind(this.start, this);
      this.scrolled = true;
      this.config = this.util().extend(options, this.defaults);
      if (options.scrollContainer != null) {
        this.config.scrollContainer = document.querySelector(options.scrollContainer);
      }
      this.animationNameCache = new WeakMap();
      this.wowEvent = this.util().createEvent(this.config.boxClass);
    }

    WOW.prototype.init = function() {
      var ref;
      this.element = window.document.documentElement;
      if ((ref = document.readyState) === "interactive" || ref === "complete") {
        this.start();
      } else {
        this.util().addEvent(document, 'DOMContentLoaded', this.start);
      }
      return this.finished = [];
    };

    WOW.prototype.start = function() {
      var box, j, len, ref;
      this.stopped = false;
      this.boxes = (function() {
        var j, len, ref, results;
        ref = this.element.querySelectorAll("." + this.config.boxClass);
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          box = ref[j];
          results.push(box);
        }
        return results;
      }).call(this);
      this.all = (function() {
        var j, len, ref, results;
        ref = this.boxes;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          box = ref[j];
          results.push(box);
        }
        return results;
      }).call(this);
      if (this.boxes.length) {
        if (this.disabled()) {
          this.resetStyle();
        } else {
          ref = this.boxes;
          for (j = 0, len = ref.length; j < len; j++) {
            box = ref[j];
            this.applyStyle(box, true);
          }
        }
      }
      if (!this.disabled()) {
        this.util().addEvent(this.config.scrollContainer || window, 'scroll', this.scrollHandler);
        this.util().addEvent(window, 'resize', this.scrollHandler);
        this.interval = setInterval(this.scrollCallback, 50);
      }
      if (this.config.live) {
        return new MutationObserver((function(_this) {
          return function(records) {
            var k, len1, node, record, results;
            results = [];
            for (k = 0, len1 = records.length; k < len1; k++) {
              record = records[k];
              results.push((function() {
                var l, len2, ref1, results1;
                ref1 = record.addedNodes || [];
                results1 = [];
                for (l = 0, len2 = ref1.length; l < len2; l++) {
                  node = ref1[l];
                  results1.push(this.doSync(node));
                }
                return results1;
              }).call(_this));
            }
            return results;
          };
        })(this)).observe(document.body, {
          childList: true,
          subtree: true
        });
      }
    };

    WOW.prototype.stop = function() {
      this.stopped = true;
      this.util().removeEvent(this.config.scrollContainer || window, 'scroll', this.scrollHandler);
      this.util().removeEvent(window, 'resize', this.scrollHandler);
      if (this.interval != null) {
        return clearInterval(this.interval);
      }
    };

    WOW.prototype.sync = function(element) {
      if (MutationObserver.notSupported) {
        return this.doSync(this.element);
      }
    };

    WOW.prototype.doSync = function(element) {
      var box, j, len, ref, results;
      if (element == null) {
        element = this.element;
      }
      if (element.nodeType !== 1) {
        return;
      }
      element = element.parentNode || element;
      ref = element.querySelectorAll("." + this.config.boxClass);
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        box = ref[j];
        if (indexOf.call(this.all, box) < 0) {
          this.boxes.push(box);
          this.all.push(box);
          if (this.stopped || this.disabled()) {
            this.resetStyle();
          } else {
            this.applyStyle(box, true);
          }
          results.push(this.scrolled = true);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    WOW.prototype.show = function(box) {
      this.applyStyle(box);
      box.className = box.className + " " + this.config.animateClass;
      if (this.config.callback != null) {
        this.config.callback(box);
      }
      this.util().emitEvent(box, this.wowEvent);
      this.util().addEvent(box, 'animationend', this.resetAnimation);
      this.util().addEvent(box, 'oanimationend', this.resetAnimation);
      this.util().addEvent(box, 'webkitAnimationEnd', this.resetAnimation);
      this.util().addEvent(box, 'MSAnimationEnd', this.resetAnimation);
      return box;
    };

    WOW.prototype.applyStyle = function(box, hidden) {
      var delay, duration, iteration;
      duration = box.getAttribute('data-wow-duration');
      delay = box.getAttribute('data-wow-delay');
      iteration = box.getAttribute('data-wow-iteration');
      return this.animate((function(_this) {
        return function() {
          return _this.customStyle(box, hidden, duration, delay, iteration);
        };
      })(this));
    };

    WOW.prototype.animate = (function() {
      if ('requestAnimationFrame' in window) {
        return function(callback) {
          return window.requestAnimationFrame(callback);
        };
      } else {
        return function(callback) {
          return callback();
        };
      }
    })();

    WOW.prototype.resetStyle = function() {
      var box, j, len, ref, results;
      ref = this.boxes;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        box = ref[j];
        results.push(box.style.visibility = 'visible');
      }
      return results;
    };

    WOW.prototype.resetAnimation = function(event) {
      var target;
      if (event.type.toLowerCase().indexOf('animationend') >= 0) {
        target = event.target || event.srcElement;
        return target.className = target.className.replace(this.config.animateClass, '').trim();
      }
    };

    WOW.prototype.customStyle = function(box, hidden, duration, delay, iteration) {
      if (hidden) {
        this.cacheAnimationName(box);
      }
      box.style.visibility = hidden ? 'hidden' : 'visible';
      if (duration) {
        this.vendorSet(box.style, {
          animationDuration: duration
        });
      }
      if (delay) {
        this.vendorSet(box.style, {
          animationDelay: delay
        });
      }
      if (iteration) {
        this.vendorSet(box.style, {
          animationIterationCount: iteration
        });
      }
      this.vendorSet(box.style, {
        animationName: hidden ? 'none' : this.cachedAnimationName(box)
      });
      return box;
    };

    WOW.prototype.vendors = ["moz", "webkit"];

    WOW.prototype.vendorSet = function(elem, properties) {
      var name, results, value, vendor;
      results = [];
      for (name in properties) {
        value = properties[name];
        elem["" + name] = value;
        results.push((function() {
          var j, len, ref, results1;
          ref = this.vendors;
          results1 = [];
          for (j = 0, len = ref.length; j < len; j++) {
            vendor = ref[j];
            results1.push(elem["" + vendor + (name.charAt(0).toUpperCase()) + (name.substr(1))] = value);
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    WOW.prototype.vendorCSS = function(elem, property) {
      var j, len, ref, result, style, vendor;
      style = getComputedStyle(elem);
      result = style.getPropertyCSSValue(property);
      ref = this.vendors;
      for (j = 0, len = ref.length; j < len; j++) {
        vendor = ref[j];
        result = result || style.getPropertyCSSValue("-" + vendor + "-" + property);
      }
      return result;
    };

    WOW.prototype.animationName = function(box) {
      var animationName;
      try {
        animationName = this.vendorCSS(box, 'animation-name').cssText;
      } catch (_error) {
        animationName = getComputedStyle(box).getPropertyValue('animation-name');
      }
      if (animationName === 'none') {
        return '';
      } else {
        return animationName;
      }
    };

    WOW.prototype.cacheAnimationName = function(box) {
      return this.animationNameCache.set(box, this.animationName(box));
    };

    WOW.prototype.cachedAnimationName = function(box) {
      return this.animationNameCache.get(box);
    };

    WOW.prototype.scrollHandler = function() {
      return this.scrolled = true;
    };

    WOW.prototype.scrollCallback = function() {
      var box;
      if (this.scrolled) {
        this.scrolled = false;
        this.boxes = (function() {
          var j, len, ref, results;
          ref = this.boxes;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            box = ref[j];
            if (!(box)) {
              continue;
            }
            if (this.isVisible(box)) {
              this.show(box);
              continue;
            }
            results.push(box);
          }
          return results;
        }).call(this);
        if (!(this.boxes.length || this.config.live)) {
          return this.stop();
        }
      }
    };

    WOW.prototype.offsetTop = function(element) {
      var top;
      while (element.offsetTop === void 0) {
        element = element.parentNode;
      }
      top = element.offsetTop;
      while (element = element.offsetParent) {
        top += element.offsetTop;
      }
      return top;
    };

    WOW.prototype.isVisible = function(box) {
      var bottom, offset, top, viewBottom, viewTop;
      offset = box.getAttribute('data-wow-offset') || this.config.offset;
      viewTop = (this.config.scrollContainer && this.config.scrollContainer.scrollTop) || window.pageYOffset;
      viewBottom = viewTop + Math.min(this.element.clientHeight, this.util().innerHeight()) - offset;
      top = this.offsetTop(box);
      bottom = top + box.clientHeight;
      return top <= viewBottom && bottom >= viewTop;
    };

    WOW.prototype.util = function() {
      return this._util != null ? this._util : this._util = new Util();
    };

    WOW.prototype.disabled = function() {
      return !this.config.mobile && this.util().isMobile(navigator.userAgent);
    };

    return WOW;

  })();

}).call(this);
;/*global define, console, document, window*/
(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define("Animations", ["jquery", "Behaviors"], factory);
    } else {
        root.Animations = factory(root.jQuery, root.Behaviors);
    }
}(this, function ($, Behaviors) {
    "use strict";
    
    var module = {};

    /* Watches for the start and end of an animation.
     *
     * The .promise attribute stores a promise which resolves whenever the
     * animation has completed or no animation events were detected over a
     * timeout period of 5 second.
     *
     * An important caveat: Animations with delay longer than 5 seconds will
     * fail to fire events and the animation watcher will trigger the timeout
     * behavior instead. You can avoid this behavior by triggering another
     * animation of any kind during the timeout period and keeping it alive
     * until the delayed animation begins.
     */
    function AnimationWatcher($elem) {
        var Class = this.constructor,
            eventSelector = Class.get_unique_id(),
            that = this,
            evtStartNames = "animationstart." + eventSelector +
                      " webkitAnimationStart." + eventSelector +
                      " oanimationstart." + eventSelector +
                      " MSAnimationStart." + eventSelector,
            evtEndNames = "animationend." + eventSelector +
                      " webkitAnimationEnd." + eventSelector +
                      " oanimationend." + eventSelector +
                      " MSAnimationEnd." + eventSelector,
            animation_start = this.animation_start.bind(this),
            animation_end = this.animation_end.bind(this),
            animation_timeout_delay = 5000;

        this.eventSelector = eventSelector;

        this.$elem = $elem;
        this.$elem.on(evtStartNames, animation_start);
        this.$elem.on(evtEndNames, animation_end);

        if (window.Modernizr && window.Modernizr.cssanimations === false) {
            animation_timeout_delay = 0;
        }

        this.timeout = window.setTimeout(this.abort_animation.bind(this), animation_timeout_delay);
        this.remaining_animations = [];

        //We remove event handlers after one of the handlers resolves the
        //animation promise.
        this.promise = new Promise(function (resolve, reject) {
            that.resolve = resolve;
            that.reject = reject;
        }).then(function () {
            that.$elem.off(evtStartNames, animation_start);
            that.$elem.off(evtEndNames, animation_end);
        });

        console.log("ANIMATIONWATCHER" + this.eventSelector + ": Created");
    }

    AnimationWatcher.count = 0;

    AnimationWatcher.get_unique_id = function () {
        var Class = this,
            sel = "." + Class.name + "_" + Class.count;

        Class.count += 1;
        return sel;
    };

    AnimationWatcher.prototype.animation_start = function (evt) {
        console.log("ANIMATIONWATCHER" + this.eventSelector + ": Begun (" + evt.originalEvent.animationName + ")");
        if (this.timeout !== null) {
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }

        this.remaining_animations.push(evt.originalEvent.animationName);
    };

    AnimationWatcher.prototype.animation_end = function (evt) {
        var loc = this.remaining_animations.indexOf(evt.originalEvent.animationName);

        console.log("ANIMATIONWATCHER" + this.eventSelector + ": Ended (" + evt.originalEvent.animationName + ")");

        if (loc !== -1) {
            this.remaining_animations.splice(loc, 1);
        }

        if (this.remaining_animations.length === 0) {
            this.resolve();
        }
    };

    AnimationWatcher.prototype.abort_animation = function (evt) {
        console.log("ANIMATIONWATCHER" + this.eventSelector + ": Abort timeout triggered");

        if (this.remaining_animations.length === 0) {
            this.resolve();
        }
    };

    module.AnimationWatcher = AnimationWatcher;

    return module;
}));
;/*global define, console, document, window, Promise*/
(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define("PageTransition", ["jquery", "Behaviors", "Animations"], factory);
    } else {
        root.PageTransition = factory(root.jQuery, root.Behaviors, root.Animations);
    }
}(this, function ($, Behaviors, Animations) {
    "use strict";

    var module = {};

    function $do(that, target) {
        return function () {
            target.apply(that, arguments);
        };
    }

    /* A page transition region is an element on the page with a unique ID that
     * is the same from page load to page load. It is a good idea for there to
     * be only one page transition region covering as much is it can on the
     * page.
     *
     * An ID is mandatory for page transition regions.
     */
    function PageTransitionRegion(elem) {
        Behaviors.init(PageTransitionRegion, this, arguments);

        this.id = this.$elem.attr("id");

        this.$elem.on("click", this.navigation_intent.bind(this));

        this.claim_current_state();
        $(window).on("popstate", this.pop_state_intent.bind(this));
    }

    Behaviors.inherit(PageTransitionRegion, Behaviors.Behavior);

    PageTransitionRegion.QUERY = "[data-pagetransition-region]";
    
    /* Determine if we can transition to a new page or not.
     * 
     * This does not actually replace the content. Thus, you can make the check
     * without committing to the new page.
     */
    PageTransitionRegion.prototype.can_replace = function ($new_document) {
        var $other_region = $new_document.find("#" + this.id);
        if ($other_region.length === 0) {
            $other_region = $new_document.filter("#" + this.id);
        }
        
        if ($other_region.length === 0) {
            return false;
        }
        
        return true;
    };
    
    /* Prepare to replace the old content with the new one.
     */
    PageTransitionRegion.prototype.prepare_to_replace = function ($old_document) {
        Behaviors.content_removal($old_document.children().filter(":not([data-pagetransition-backdrop])"));
    };

    /* Replace current content with content pulled from a new page we're trying
     * to transition into.
     *
     * Returns false if we could not extract content from the new document.
     * In this case, calling method should perform a traditional navigation to
     * the new document.
     */
    PageTransitionRegion.prototype.replace = function ($new_document) {
        var $other_region = $new_document.find("#" + this.id), $children;
        if ($other_region.length === 0) {
            $other_region = $new_document.filter("#" + this.id);
        }

        if ($other_region.length === 0) {
            return false;
        }
        
        $children = $other_region.children().filter(":not([data-pagetransition-backdrop])");

        this.$elem.children().filter(":not([data-pagetransition-backdrop])").remove();
        this.$elem.append($children);
        $(window).scrollTop(0);
        
        Behaviors.content_ready($children.parent());

        return true;
    };

    /* Replace the backdrop element.
     *
     * This is replaced separately so that each page can specify it's own outro
     * backdrop without interrupting the incoming animation.
     *
     * This should only be called after the promise returned by transition_in
     * resolves.
     *
     * Returns false if we could not extract content from the new document.
     * In this case, calling method should perform a traditional navigation to
     * the new document.
     */
    PageTransitionRegion.prototype.replace_backdrop = function ($new_document) {
        var $other_region = $new_document.find("#" + this.id);
        if ($other_region.length === 0) {
            $other_region = $new_document.filter("#" + this.id);
        }

        if ($other_region.length === 0) {
            return false;
        }

        this.$elem.attr("class", $other_region.attr("class"));
        this.$elem.children().filter("[data-pagetransition-backdrop]").remove();
        this.$elem.append($other_region.children().filter("[data-pagetransition-backdrop]"));

        return true;
    };

    /* Change the browser URL to point to the new URL, and also fix relative
     * links such that they resolve correctly.
     *
     * The transition property in the pushState data indicates that this entry
     * was placed here by the PageTransitionRegion class. This lets us avoid
     * applying transitions to things that shouldn't get them.
     */
    PageTransitionRegion.prototype.replace_state = function (url) {
        window.history.pushState({transition: true, url: url}, "", url);
        this.claim_current_state();
    };
    
    /* Changes the document head to match what is present in the new document.
     * 
     * Currently, only title replacement is supported, but this function may
     * also be extended to 
     */
    PageTransitionRegion.prototype.replace_head = function ($new_document) {
        var $new_title = $new_document.filter("title"),
            $title = $("title");
        
        if ($new_title.length === 0) {
            $new_title = $new_document.find("title");
        }
        
        $title.text($new_title.text());
    };
    
    /* Retrigger analytics scripts if so marked.
     */
    PageTransitionRegion.prototype.replace_analytics = function () {
        var $reloadable_tags;
        
        //Step 1: Find tags marked for reloading.
        $reloadable_tags = $(this.constructor.RELOADABLE_SCRIPT_QUERY);
        
        //Step 2: Reinsert them, hopefully causing them to be included again.
        //We need to try this two separate ways based on if it's an inline
        //script or external.
        $reloadable_tags.detach();
        
        $reloadable_tags.each(function (index, elem) {
            var $elem = $(elem), src = $elem.attr("src");
            
            if (src !== undefined) {
                //External script, recreate the tag
                $elem.remove();
                $elem = $("<script></script>");
                $elem.attr("src", src);
            }
            
            $("body").append($elem);
        });
    };
    
    /* Indicates an analytics tag that can be retriggered for the new page load
     * by just reloading it's tag.
     */
    PageTransitionRegion.RELOADABLE_SCRIPT_QUERY = "[data-pagetransition-analytics='reloadable']";

    /* Claim the current history state for ourselves.
     *
     * By default, this is only called at the start of the page load.
     */
    PageTransitionRegion.prototype.claim_current_state = function () {
        var url = window.location.href;
        window.history.replaceState({transition: true, url: url}, "", url);
    };

    /* Determine if link is internal or external.
     *
     * The purpose of distinguishing between internal and external links is to
     * check if we can transition to them properly or not. We can only
     * transition into pages with compatible regions; so we assume that all
     * internal links will use the same compatible theming.
     *
     * Also, transitioning to an external page requires specially configured
     * web servers that allow CORS, which is a pain.
     *
     * Returns LINK_INTERNAL, LINK_EXTERNAL, LINK_POPUP, or LINK_HASH.
     */
    PageTransitionRegion.prototype.is_internal_link = function (url, $a) {
        var extRegex = new RegExp("(\/\/|:)"),
            hashRegex = new RegExp("^#"),
            domainRelativeHashRegex = new RegExp("^" + window.location.pathname + "/#"),
            protRelativeRegex = new RegExp("^//" + window.location.host),
            protAbsoluteRegex = new RegExp('^' + window.location.protocol + "//" + window.location.host),
            protRelativeHashRegex = new RegExp('^//' + window.location.host + window.location.pathname + "#"),
            absoluteHashRegex = new RegExp('^' + window.location.protocol + "//" + window.location.host + window.location.pathname + "#");

        if ($a.attr("target") !== undefined && $a.attr("target") !== "") {
            return PageTransitionRegion.LINK_POPUP;
        }
        
        if (hashRegex.test(url) || absoluteHashRegex.test(url) || protRelativeHashRegex.test(url) || domainRelativeHashRegex.test(url)) {
            return PageTransitionRegion.LINK_HASH;
        } else if (!extRegex.test(url) || protRelativeRegex.test(url) || protAbsoluteRegex.test(url)) {
            return PageTransitionRegion.LINK_INTERNAL;
        } else {
            return PageTransitionRegion.LINK_EXTERNAL;
        }
    };

    /* Transition out the current page.
     *
     * Returns a promise which resolves when the transition has completed.
     *
     * This default implementation uses a CSS class and waits for transitionEnd
     * events.
     */
    PageTransitionRegion.prototype.transition_out = function () {
        var aw;

        this.$elem.removeClass("is-PageTransition--transition_loading");
        this.$elem.addClass("is-PageTransition--transition_out");
        this.$elem.removeClass("is-PageTransition--transition_in");
        aw = new Animations.AnimationWatcher(this.$elem.find("[data-pagetransition-backdrop]"));

        return aw.promise;
    };

    /* Transition to a loading animation.
     *
     * Returns a promise which resolves when the transition has completed.
     *
     * This default implementation uses a CSS class and waits for transitionEnd
     * events.
     */
    PageTransitionRegion.prototype.transition_loading = function () {
        var aw;

        this.$elem.addClass("is-PageTransition--transition_loading");
        this.$elem.removeClass("is-PageTransition--transition_out");
        this.$elem.removeClass("is-PageTransition--transition_in");
        aw = new Animations.AnimationWatcher(this.$elem.find("[data-pagetransition-backdrop]"));

        return aw.promise;
    };

    /* Transition in the current page.
     *
     * Returns a promise which resolves when the transition has completed.
     *
     * This default implementation uses a CSS class and waits for transitionEnd
     * events.
     */
    PageTransitionRegion.prototype.transition_in = function () {
        var aw;

        this.$elem.removeClass("is-PageTransition--transition_loading");
        this.$elem.removeClass("is-PageTransition--transition_out");
        this.$elem.addClass("is-PageTransition--transition_in");
        aw = new Animations.AnimationWatcher(this.$elem.find("[data-pagetransition-backdrop]"));

        return aw.promise;
    };

    /* Transition to the "done" state, which should just have the site be
     * plainly visible.
     *
     * Returns a promise which resolves any final transitions have completed.
     * However, most transition effects should not be starting animations here,
     * so it may never resolve.
     *
     * This default implementation removes all CSS classes and waits for
     * transitionEnd events.
     */
    PageTransitionRegion.prototype.transition_done = function () {
        var aw;

        this.$elem.removeClass("is-PageTransition--transition_loading");
        this.$elem.removeClass("is-PageTransition--transition_out");
        this.$elem.removeClass("is-PageTransition--transition_in");
        aw = new Animations.AnimationWatcher(this.$elem.find("[data-pagetransition-backdrop]"));

        return aw.promise;
    };

    /* Given a URL, actually transition the page to a new page.
     *
     * The default method of transitioning the page is to:
     *
     *   1. AJAX the new page in
     *   2. Transition out the current page
     *   3. Call .replace() to get the new page's content in here.
     *   4. Transition in the new page
     *
     * Subclasses of PageTransitionRegion may implement more complicated
     * behavior based on their own individual requirements. Generally, however,
     * you will want to call .replace() to get the content in.
     *
     * If the replacement fails, we will attempt traditional navigation instead
     * of silently or catastrophically failing.
     */
    PageTransitionRegion.prototype.retrieve_document_by_url = function (url, isPopState) {
        var ajaxPromise = new Promise(function (resolve, reject) {
            $.get(url, undefined, resolve, "html");
        }),
            theData;

        return this.transition_out().then(function () {
            console.log("Out transition finished");
            this.transition_loading();
            return ajaxPromise;
        }.bind(this)).then(function (data) {
            this.prepare_to_replace(this.$elem);
            return new Promise(function (resolve, reject) {
                window.setTimeout(resolve.bind(this, data), 1);
            });
        }.bind(this)).then(function (data) {
            var couldReplace;

            console.log("Load finished");
            theData = data;

            couldReplace = this.can_replace($(theData));
            if (!couldReplace) {
                window.location.href = url;
                throw new Error("Location " + url + " does not have transitionable links!");
            } else if (isPopState !== true) {
                this.replace_state(url);
            }
            
            this.replace($(theData));
            this.replace_head($(theData));
            this.replace_analytics($(theData));
            
            return this.transition_in();
        }.bind(this)).then(function () {
            console.log("In transition finished");
            this.replace_backdrop($(theData));
            this.transition_done();
        }.bind(this));
    };

    /* Link which resolves to the same origin server. */
    PageTransitionRegion.LINK_INTERNAL = 0;

    /* Link which resolves to a different origin server. */
    PageTransitionRegion.LINK_EXTERNAL = 1;

    /* Link which resolves in another window */
    PageTransitionRegion.LINK_POPUP = 2;

    /* Link which resolves to the same page.
     * Also covers links which do JavaScripty things and should be buttons, but
     * aren't because some developers think their pages will always load with
     * the correct JS and don't consider fallback cases
     */
    PageTransitionRegion.LINK_HASH = 3;

    /* Event handler for when a link within the region is clicked.
     */
    PageTransitionRegion.prototype.navigation_intent = function (evt) {
        var $target = $(evt.target), $parent_tgt = $target.parents().filter("a"),
            href;

        if ($target.filter("a").length === 0) {
            $target = $parent_tgt;
        }

        if ($target.filter("a").length === 0) {
            //Not a link.
            return;
        }

        href = $target.attr("href");

        if (this.is_internal_link(href, $target) === PageTransitionRegion.LINK_INTERNAL) {
            //It's AJAX time!
            evt.preventDefault();
            this.retrieve_document_by_url(href);
        }
    };

    /* Event handler for when the user presses the back button. */
    PageTransitionRegion.prototype.pop_state_intent = function (evt) {
        if (evt.originalEvent.state !== undefined &&
                evt.originalEvent.state !== null &&
                evt.originalEvent.state.transition === true) {
            evt.preventDefault();
            this.retrieve_document_by_url(evt.originalEvent.state.url, true);
        }
    };

    Behaviors.register_behavior(PageTransitionRegion);

    module.PageTransitionRegion = PageTransitionRegion;

    return module;
}));
;/*global define, console, document, window*/
/*jslint continue:true*/
(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define("AffixColumn", ["jquery", "Behaviors"], factory);
    } else {
        root.AffixColumn = factory(root.jQuery, root.Behaviors);
    }
}(this, function ($, Behaviors) {
    "use strict";

    var module = {};
    
    function $do(that, target) {
        return function () {
            target.apply(that, arguments);
        };
    }
    
    /* An Affix root is an element which is used to determine the edges of the
     * region that columns stick to. It also provides the core event handlers
     * to drive the AffixColumn and AffixRow behaviors.
     */
    function Affix(elem, scrollElem) {
        Behaviors.init(Affix, this, arguments);

        this.height = this.$elem.height();
        this.offsetTop = this.$elem.offset().top;
        
        this.columns = [];
        this.$scrollElem = $(scrollElem || document);
        this.$scrollHeightElem = this.$scrollElem;
        
        //weird DOM quirk
        if (this.$scrollElem[0] === document) {
            this.$scrollHeightElem = $(window);
        }
        
        this.$alwaysTopElem = $(this.$elem.data("affixcolumn-alwaystop"));
        this.$alwaysBottomElem = $(this.$elem.data("affixcolumn-alwaysbottom"));
        
        this.bind_event_handlers();
        this.find_columns_and_rows();
        
        this.resized();
        this.scroll_changed();
    }
    
    Behaviors.inherit(Affix, Behaviors.Behavior);
    
    Affix.QUERY = "[data-affixcolumn='root']";
    
    Affix.prototype.deinitialize = function () {
        this.unbind_event_handlers();
    };
    
    /* Check our alwaystop/alwaysbottom elements and see if they are floating.
     * If so, add their height to the top and bottom adjustments given to the
     * individual columns.
     */
    Affix.prototype.determine_global_floating_adjustment = function () {
        this.globalTopAdjust = 0;
        
        this.$alwaysTopElem.each(function (index, atelem) {
            var $atelem = $(atelem);
            this.globalTopAdjust += $atelem.height();
        }.bind(this));
        
        this.globalBottomAdjust = 0;
        
        this.$alwaysBottomElem.each(function (index, atelem) {
            var $atelem = $(atelem);
            this.globalBottomAdjust += $atelem.height();
        }.bind(this));
    };

    Affix.prototype.resized = function () {
        var i, maxColHeight = 0, maxColId, heightSum, disp = 0, topAdjust = 0, bottomAdjust = 0;
        
        this.determine_global_floating_adjustment();
        this.height = this.$elem.height();
        
        if (this.columns.length > 0) {
            //Scan top rows to fix their displacement heights and determine top
            //adjustments.
            for (i = 0; i < this.columns.length; i += 1) {
                //Also, kill floating adjustments plz
                this.columns[i].clear_floating_adjustments();
                
                if (!this.columns[i].has_option("top")) {
                    continue;
                }
                
                //Top rows never get a bottom adjustment.
                this.columns[i].set_floating_adjustments(this.globalTopAdjust, topAdjust, 0, 0);
                
                disp = this.columns[i].displacement_height();
                
                this.columns[i].$height_bearing_element().css("min-height", disp + "px");
                topAdjust += disp;
            }
            
            //Scan bottom rows to fix their displacement heights and determine top
            //adjustments. This is done in reverse order so that the bottommost
            //bottom row gets the lowest bottom float adjustment.
            for (i = this.columns.length - 1; i >= 0; i -= 1) {
                if (!this.columns[i].has_option("bottom")) {
                    continue;
                }
                
                //Bottom rows never get a top adjustment.
                this.columns[i].set_floating_adjustments(0, 0, this.globalBottomAdjust, bottomAdjust);
                
                disp = this.columns[i].displacement_height();
                
                this.columns[i].$height_bearing_element().css("min-height", disp + "px");
                bottomAdjust += disp;
            }
            
            //Scan columns to select the height-bearing column.
            for (i = 0; i < this.columns.length; i += 1) {
                if (!this.columns[i].has_option("column")) {
                    continue;
                }
                
                //Columns get both the top and bottom adjustment.
                this.columns[i].set_floating_adjustments(this.globalTopAdjust, topAdjust, this.globalBottomAdjust, bottomAdjust);
                
                //Determine which column is height bearing for this Affix.
                if (maxColHeight < this.columns[i].displacement_height() &&
                        !this.columns[i].has_option("noheightbearing")) {
                    maxColHeight = this.columns[i].displacement_height();
                    maxColId = i;
                }
                
                this.columns[i].remove_state("tallest");
            }
            
            if (maxColId !== undefined) {
                this.columns[maxColId].add_state("tallest");
            }
        }
    };
    
    Affix.prototype.scroll_changed = function () {
        var i, maxColHeight = 0, maxColId;
        
        this.height = this.$elem.height();
        this.windowHeight = this.$scrollHeightElem.height();
        this.offsetTop = this.$elem.offset().top;
        this.scrollTop = this.$scrollElem.scrollTop();
        this.offsetBottom = this.offsetTop + this.height;
        this.scrollBottom = this.scrollTop + this.windowHeight;
        
        if (this.columns.length > 0) {
            for (i = 0; i < this.columns.length; i += 1) {
                this.columns[i].viewport_changed(this.height, this.offsetTop, this.offsetBottom, this.scrollTop, this.scrollBottom);
            }
        }
    };
    
    Affix.prototype.unbind_event_handlers = function () {
        if (this.scroll_handler !== undefined) {
            this.$scrollElem.off("scroll", this.scroll_handler);
        }
        
        if (this.resize_handler !== undefined) {
            $(window).off("resize", this.resize_handler);
        }
    };
    
    Affix.prototype.bind_event_handlers = function () {
        this.unbind_event_handlers();
        
        this.scroll_handler = $do(this, this.scroll_changed);
        this.resize_handler = $do(this, this.resized);
        
        this.$scrollElem.on("scroll", this.scroll_handler);
        $(window).on("resize", this.resize_handler);
        $(document).on("load", this.resize_handler);
        $("img").on("load", this.resize_handler);
    };
    
    Affix.prototype.find_columns_and_rows = function () {
        var $likely_columns = this.$elem.find(AffixColumn.QUERY),
            $likely_roots = this.$elem.find(Affix.QUERY);

        this.columns = [];
        this.roots = [];

        $likely_columns.each(function (index, lcelem) {
            var $lcelem = $(lcelem),
                $parent_root = $lcelem.parents().filter(Affix.QUERY).first();

            if ($parent_root[0] === this.$elem) {
                this.columns.push(AffixColumn.locate($lcelem));
            }
        }.bind(this));

        $likely_roots.each(function (index, lrelem) {
            var $lrelem = $(lrelem),
                $parent_root = $lrelem.parents().filter(Affix.QUERY).first();

            if ($parent_root[0] === this.$elem) {
                this.roots.push(Affix.locate($lrelem));
            }
        }.bind(this));
    };
    
    /* An AffixColumn is a normally fixed element which sticks to the top or
     * bottom edges of a scrolling viewport (typically the document).
     * 
     * AffixColumn itself contains no event handlers. The parent Affix is
     * responsible for propagating viewport scrolling to it's child Columns.
     * 
     * Options may be provided which cause the Column to behave differently.
     * Examples of this include the "noheightbearing" option, which prevents
     * your AffixColumn from being marked as tallest for the purposes of parent
     * element height preservation. See the parse_option_list function for more
     * information on the option list format, and has_option for what options
     * are available.
     * 
     * The name "AffixColumn" is a misnomer. "Columns" may be configured as rows
     * or columns in CSS. Orientation of the Column is configured with the
     * column/top/bottom options. If neither is active, "column" is assumed.
     */
    function AffixColumn(elem) {
        this.$elem = $(elem);
        this.options = this.parse_option_list(this.$elem.data("affixcolumn-options"));
        
        this.top_adjust = 0;
        this.bottom_adjust = 0;
    }
    
    Behaviors.inherit(AffixColumn, Behaviors.Behavior);
    
    AffixColumn.QUERY = "[data-affixcolumn='column']";
    
    /* Calculate the height taken up by the AffixColumn if placed in normal
     * document flow.
     * 
     * The floating adjustments currently applied to the column may cause
     * invalid displacement height results to occur. For best results, call
     * clear_floating_adjustments to remove them, and then trigger a viewport
     * update from the Affix root once the height has been measured.
     */
    AffixColumn.prototype.displacement_height = function () {
        return this.$elem.height();
    };
    
    /* Change the top/bottom values that this column floats at.
     * 
     * Floating adjustments determine the safe area of space that this element
     * may float at without being overlapped or overlapping top or bottom rows.
     * 
     * These will override any top/bottom values set via CSS.
     */
    AffixColumn.prototype.set_floating_adjustments = function (globalTop, top, globalBottom, bottom) {
        this.top_adjust = top;
        this.bottom_adjust = bottom;
        
        this.global_top_adjust = globalTop;
        this.global_bottom_adjust = globalBottom;
    };
    
    /* Remove inline CSS applied to make floating adjustments visually present.
     * 
     * You must call this method before querying displacement_height, or you
     * will get invalid results. After calling this method, you must trigger a
     * viewport update by calling scroll_changed on the containing Affix root.
     */
    AffixColumn.prototype.clear_floating_adjustments = function () {
        this.$elem.css("top", "");
        this.$elem.css("bottom", "");
    };
    
    /* Return the element responsible for propagating our displacement height in
     * normal document flow.
     * 
     * By default, the height bearing element is our parent element. We do not
     * have a facility to override this currently.
     */
    AffixColumn.prototype.$height_bearing_element = function () {
        return this.$elem.parent();
    };
    
    AffixColumn.prototype.add_state = function (state) {
        this.$elem.addClass("is-AffixColumn--" + state);
    };
    
    AffixColumn.prototype.remove_state = function (state) {
        this.$elem.removeClass("is-AffixColumn--" + state);
    };
    
    /* Determine if an AffixColumn option applies given the current viewport.
     * 
     * Valid options include:
     * 
     *  - column: AffixColumn to be oriented vertically aside other columns.
     *    The tallest column is marked as "tallest" and considered the height
     *    bearing column, whereby it is expected to be positioned in normal
     *    document flow such that the Affix element can grab it's CSS height.
     * 
     *  - top: AffixColumn to be oriented above other columns. Top rows are
     *    given a CSS min-height equal to the sum of their childrens' heights
     *    and their children are assumed to float. This minimum height will be
     *    applied as the top value to any following tops or columns.
     *
     *  - bottom: AffixColumn to be oriented below other columns. Bottom rows
     *    are given a CSS min-height in the same fashion as top rows. This
     *    minimum height will be applied as the bottom value to any preceding
     *    bottoms or columns.
     * 
     *  - noheightbearing: Column-oriented AffixColumn to be disqualified from
     *    being marked as a height-bearing column.
     */
    AffixColumn.prototype.has_option = function (option_string) {
        var i;
        
        for (i = 0; i < this.options.length; i += 1) {
            if (this.options[i].media === null || window.matchMedia(this.options[i].media).matches) {
                //Column enabled by default
                if (option_string === "column" &&
                        this.options[i].options.indexOf("top") === -1 &&
                        this.options[i].options.indexOf("bottom") === -1) {
                    return true;
                }
                
                return this.options[i].options.indexOf(option_string) > -1;
            }
        }
        
        if (option_string === "column") {
            return true;
        } else {
            return false;
        }
    };
    
    AffixColumn.MATCH_MEDIA_QUERY_REGEX = /\(([\s\S]*)\)/g;
    
    /* Parse an option list.
     * 
     * The option list determines what options are active on a column. It is
     * comma separated. Each comma indicates a new option list for a particular
     * media query. The first media query to match determines the total option
     * set. The final option set may or may not have a media query; if it does
     * not, then it serves as the default option set.
     * 
     * This is very analagous to the sizes attribute of <img> tags in modern
     * browsers. Example format:
     * 
     *    (min-width: 450px) column noheightbearing, top
     */
    AffixColumn.prototype.parse_option_list = function (option_list_string) {
        var cases, i, j, rval = [], case_obj = {}, match;
        
        if (option_list_string === undefined) {
            option_list_string = "";
        }
        
        cases = option_list_string.split(",");
        
        for (i = 0; i < cases.length; i += 1) {
            case_obj = {};
            match = this.constructor.MATCH_MEDIA_QUERY_REGEX.exec(cases[i]);
            
            //Reset the string. Sharing regex objects is dirty...
            this.constructor.MATCH_MEDIA_QUERY_REGEX.lastIndex = 0;
            
            if (match === null || match.length === 0) {
                case_obj.options = cases[i].split(" ");
                case_obj.media = null;
            } else {
                case_obj.options = cases[i].slice(match[0]).split(" ");
                case_obj.media = match[0];
            }
            
            //Filter empty options
            for (j = 0; j < case_obj.options.length; j += 0) {
                if (case_obj.options[j] === "") {
                    case_obj.options.splice(j, 1);
                } else {
                    j += 1;
                }
            }
            
            rval.push(case_obj);
        }
        
        return rval;
    };
    
    /* Internal method used by Affix to communicate to it's children the new
     * parameters of the scroll viewport.
     */
    AffixColumn.prototype.viewport_changed = function (rootHeight, offsetTop, offsetBottom, scrollTop, scrollBottom) {
        var isTopAnchored = this.has_option("column") || this.has_option("top"),
            isBottomAnchored = this.has_option("anchorbottom") || this.has_option("bottom"),
            bottomStateAdjust = true,
            topStateAdjust = true,
            adjustWithoutGlobal = true;
        
        //Remove existing floating adjustments.
        //Otherwise, our displacement height is incorrect.
        this.clear_floating_adjustments();
        
        //Apply affix states.
        if (isTopAnchored && scrollTop + this.global_top_adjust < offsetTop ||
                isBottomAnchored && scrollBottom - this.displacement_height() < offsetTop) {
            this.add_state("top");
            this.remove_state("bottom");
            bottomStateAdjust = false;
        } else if (isTopAnchored && scrollTop + this.top_adjust + this.global_top_adjust + this.displacement_height() + this.bottom_adjust >= offsetBottom ||
                isBottomAnchored && scrollBottom >= offsetBottom) {
            this.remove_state("top");
            this.add_state("bottom");
            topStateAdjust = false;
        } else {
            this.remove_state("top");
            this.remove_state("bottom");
            adjustWithoutGlobal = false;
        }
        
        //Apply floating adjustments.
        if ((this.has_option("column") || this.has_option("top")) && topStateAdjust) {
            if (adjustWithoutGlobal) {
                this.$elem.css("top", this.top_adjust + "px");
            } else {
                this.$elem.css("top", this.top_adjust + this.global_top_adjust + "px");
            }
        }
        
        if ((this.has_option("column") || this.has_option("bottom")) && bottomStateAdjust) {
            if (adjustWithoutGlobal) {
                this.$elem.css("bottom", this.bottom_adjust + "px");
            } else {
                this.$elem.css("bottom", this.bottom_adjust + this.global_bottom_adjust + "px");
            }
        }
    };
    
    Behaviors.register_behavior(Affix);

    module.Affix = Affix;
    module.AffixColumn = AffixColumn;

    return module;
}));
;/*global define, console, window, HTMLImageElement, Promise*/

(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define("AtlasPlayer", ["jquery", "Behaviors"], factory);
    } else {
        root.AtlasPlayer = factory(root.jQuery, root.Behaviors);
    }
}(this, function ($, Behaviors) {
    "use strict";
    var module = {};

    /* A Behavior that plays an image atlas on a canvas.
     *
     * Atlas description format is that which is generated by the following
     * Photoshop script: https://github.com/tonioloewald/Layer-Group-Atlas
     */
    function AtlasPlayer() {
        Behaviors.init(AtlasPlayer, this, arguments);

        this.deinitialize_stop = false;

        this.$canvas = this.$elem;
        if (!this.$canvas.is("canvas")) {
            this.$canvas = this.$elem.find("canvas");
        }

        this.context = this.$canvas[0].getContext("2d");

        this.image = undefined;
        this.atlas_data = undefined;

        //TODO: Make configurable
        this.anim_player_running = false;

        this.ready().then(function () {
            $(window).on("resize", this.size_canvas_to_fit.bind(this));
            
            this.anim_length = this.find_anim_length();
            
            if (this.atlas_data.autoplay === true) {
                this.play();
            }
        }.bind(this));
    }

    Behaviors.inherit(AtlasPlayer, Behaviors.Behavior);

    AtlasPlayer.QUERY = "[data-atlasplayer]";

    /* Cause AtlasPlayer to ensure it's image and atlas are ready.
     *
     * Returns a promise which resolves when the atlas is ready for playback.
     * Promise will reject if the image is an image tag which has failed to
     * load.
     */
    AtlasPlayer.prototype.ready = function () {
        if (this.ready_promise === undefined) {
            this.ready_promise = new Promise(function (resolve, reject) {
                this.ready_resolve = resolve;
                this.ready_reject = reject;
            }.bind(this));

            this.find_image();
            this.find_atlas();
            this.is_ready();
        }

        return this.ready_promise;
    };

    /* Determine if the atlas is ready for playback.
     *
     * Calling this function also has the side effect of resolving the ready
     * promise if it has not already been done. If this function returns true
     * for the first time, then the promise has been resolved. If it returns
     * false, it may have been rejected (say, if the image fails to load).
     */
    AtlasPlayer.prototype.is_ready = function () {
        var image_ready, atlas_ready, total_ready;

        if (this.image === undefined) {
            image_ready = false;
        } else if (this.image.constructor === HTMLImageElement) {
            if (this.image.complete) {
                if (this.image.naturalHeight === 0) {
                    //Something has gone horribly wrong
                    this.ready_reject();
                    image_ready = false;
                } else {
                    image_ready = true;
                }
            } else {
                image_ready = false;
            }
        } else {
            //Other drawables are presumed already loaded
            image_ready = true;
        }

        if (this.atlas_data !== undefined && this.atlas_data.then !== undefined) {
            //Not ready, since a promise was provided
            atlas_ready = false;
        } else {
            atlas_ready = this.atlas_data !== undefined;
        }

        total_ready = image_ready && atlas_ready;

        if (total_ready) {
            this.ready_resolve();
        }

        return total_ready;
    };

    /* Called to find the image we're drawing our animation from, if present.
     */
    AtlasPlayer.prototype.find_image = function () {
        var image_id = this.$elem.data("atlasplayer-image");

        if (this.image !== undefined) {
            return;
        }

        if (image_id !== undefined) {
            this.image = $(image_id)[0];

            if (this.image.constructor === HTMLImageElement) {
                $(this.image).on("load", this.is_ready.bind(this));
            }
        }
    };

    /* Called to find and load our atlas data.
     */
    AtlasPlayer.prototype.find_atlas = function () {
        var atlas_data = this.$elem.data("atlasplayer-data");

        if (this.atlas_data !== undefined) {
            return;
        }

        if (typeof atlas_data === "string") {
            //Atlas data is a URL.
            this.atlas_data = this.load_atlas_data(atlas_data)
                .then(function (data) {
                    this.atlas_data = data;
                    this.is_ready();
                }.bind(this))
                .catch(this.ready_reject);
        } else {
            //Atlas data is immediately provided.
            this.atlas_data = atlas_data;
        }
    };
    
    AtlasPlayer.prototype.find_anim_length = function () {
        var anim_length = this.$elem.data("atlasplayer-animlength");
        
        if (anim_length === undefined) {
            anim_length = this.atlas_data.time;
        }
        
        if (anim_length === undefined) {
            anim_length = "5s";
        }
        
        anim_length = parseFloat(anim_length, 10);
        
        if (isNaN(anim_length) || anim_length === 0) {
            anim_length = 5000;
        } else {
            anim_length *= 1000;
        }
        
        return anim_length;
    };

    /* Load the atlas data.
     *
     * Returns a promise which resolves when the atlas data has loaded.
     */
    AtlasPlayer.prototype.load_atlas_data = function (url) {
        var promiseResolve, promiseReject,
            myPromise = new Promise(function (resolve, reject) {
                promiseResolve = resolve;
                promiseReject = reject;
            });

        $.ajax({
            "url": url,
            "dataType": "json"
        }).done(function (data) {
            promiseResolve(data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            promiseReject([textStatus, errorThrown]);
        });

        return myPromise;
    };

    /* Cause the canvas to draw a particular atlas frame.
     */
    AtlasPlayer.prototype.draw_frame = function (frame_id) {
        var layerData = this.atlas_data.layers[this.atlas_data.layers.length - frame_id - 1];
        
        if (layerData.width <= 0) {
            return;
        }
        
        if (layerData.height <= 0) {
            return;
        }

        this.context.drawImage(this.image,
                               //Location of the atlas slice
                               layerData.packedOrigin.x * this.image_x_space,
                               layerData.packedOrigin.y * this.image_y_space,
                               layerData.width * this.image_x_space,
                               layerData.height * this.image_y_space,
                               //Where we want it
                               layerData.left,
                               layerData.top,
                               layerData.width,
                               layerData.height
                              );
    };
    
    /* Size the canvas to fit our data.
     */
    AtlasPlayer.prototype.size_canvas_to_fit = function () {
        //Determine the device-specific pixel size of this AtlasPlayer.
        this.canvas_scale_factor = window.devicePixelRatio;
        this.$canvas[0].width = this.$canvas.width() * this.canvas_scale_factor;
        this.$canvas[0].height = this.$canvas.height() * this.canvas_scale_factor;
        
        //Reset the current canvas transform, if any.
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        
        //Scale down our coordinate space
        this.context.scale(this.canvas_scale_factor, this.canvas_scale_factor);
        
        //Determine if cropping is needed.
        this.css_aspect_ratio = this.$canvas.width() / this.$canvas.height();
        this.atlas_aspect_ratio = this.atlas_data.width / this.atlas_data.height;
        if (this.css_aspect_ratio > this.atlas_aspect_ratio) {
            this.context.translate(0, (this.$canvas.width() / this.atlas_aspect_ratio - this.$canvas.height()) / -2);
            
            this.canvas_transform_scale_factor = this.$canvas.width() / this.atlas_aspect_ratio / this.atlas_data.height;
            this.context.scale(this.canvas_transform_scale_factor, this.canvas_transform_scale_factor);
        } else if (this.css_aspect_ratio < this.atlas_aspect_ratio) {
            this.context.translate((this.$canvas.height() * this.atlas_aspect_ratio - this.$canvas.width()) / -2, 0);
            
            this.canvas_transform_scale_factor = this.$canvas.height() * this.atlas_aspect_ratio / this.atlas_data.width;
            this.context.scale(this.canvas_transform_scale_factor, this.canvas_transform_scale_factor);
        }
        
        //We also need to determine if our atlas image is scaled down and adjust
        //our source coordinate space to match.
        this.image_x_space = this.image.width / this.atlas_data.atlas.width;
        this.image_y_space = this.image.height / this.atlas_data.atlas.height;
        
        //Since we just clared the canvas, if we aren't animated, then we need
        //to manually repopulate ourselves:
        if (this.last_frame_drawn !== undefined) {
            this.draw_frame(this.last_frame_drawn);
        }
    };

    AtlasPlayer.prototype.animation_krnl = function (time) {
        var step, frame, total_frames;

        if (this.deinitialize_stop) {
            return;
        }
        
        if (this.playing === false) {
            this.anim_player_running = false;
            
            if (this.on_animation_complete) {
                this.on_animation_complete();
                this.on_animation_complete = undefined;
            }
            return;
        }

        if (this.anim_first_time === undefined) {
            this.anim_first_time = time;
            window.requestAnimationFrame(this.animation_krnl.bind(this));
            return;
        }
        
        if (this.anim_length === undefined) {
            //Don't animate if we haven't loaded yet
            window.requestAnimationFrame(this.animation_krnl.bind(this));
            return;
        }

        total_frames = this.atlas_data.layers.length;
        step = this.anim_length / total_frames;
        time = time - this.anim_first_time;
        frame = Math.max(Math.min(Math.round(time / step), total_frames - 1), 0);

        if (this.reverse) {
            frame = (total_frames - 1) - frame;
        }

        this.context.clearRect(0,0,this.atlas_data.width, this.atlas_data.height);
        this.draw_frame(frame);
        
        this.last_frame_drawn = frame;
        
        if (time > this.anim_length) {
            if (this.should_loop()) {
                this.anim_first_time = undefined;
            } else {
                this.anim_player_running = false;
                
                if (this.on_animation_complete) {
                    this.on_animation_complete();
                    this.on_animation_complete = undefined;
                }
                return;
            }
        }
        
        window.requestAnimationFrame(this.animation_krnl.bind(this));
    };

    AtlasPlayer.prototype.update_animation_state = function () {
        if (this.playing && this.anim_player_running === false) {
            if (this.on_animation_complete) {
                this.on_animation_complete();
            }
            
            this.animation_promise = new Promise(function (resolve, reject) {
                this.on_animation_complete = resolve;
            }.bind(this));
            
            this.size_canvas_to_fit();
            this.anim_player_running = true;
            window.requestAnimationFrame(this.animation_krnl.bind(this));
        }
        
        return this.animation_promise;
    };
    
    AtlasPlayer.prototype.play = function () {
        this.playing = true;
        this.reverse = false;
        this.anim_first_time = undefined;
        return this.update_animation_state();
    };

    AtlasPlayer.prototype.play_reverse = function () {
        this.playing = true;
        this.reverse = true;
        this.anim_first_time = undefined;
        return this.update_animation_state();
    };
    
    /* Request the animation to stop playing on the next frame.
     * 
     * This function also resets the animation to play again.
     */
    AtlasPlayer.prototype.stop = function () {
        //A bit of subtlety: We don't clear anim_player_running since we don't
        //cancel the animation frame when you stop the animation. We instead
        //wait for the animation to stop itself.
        this.playing = false;
        this.reverse = false;
        this.anim_first_time = undefined;
        return this.update_animation_state();
    };
    
    AtlasPlayer.prototype.seek = function (frame) {
        if (frame < 0) {
            frame = this.atlas_data.layers.length - frame - 2;
        }

        this.context.clearRect(0,0,this.atlas_data.width, this.atlas_data.height);
        this.draw_frame(frame);

        this.last_frame_drawn = frame;
    };
    
    /* Determine if this AtlasPlayer should loop or not.
     */
    AtlasPlayer.prototype.should_loop = function () {
        var loop_force = this.$elem.data("atlasplayer-loop"),
            loop_deny = this.$elem.data("atlasplayer-once");
        
        if (loop_force !== undefined) {
            return true;
        } else if (loop_deny !== undefined) {
            return false;
        } else {
            return this.atlas_data.loop === true;
        }
    };

    Behaviors.register_behavior(AtlasPlayer);

    module.AtlasPlayer = AtlasPlayer;

    return module;
}));
;/*global define, console, document, window*/
(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define("CollapseContent", ["jquery", "Behaviors"], factory);
    } else {
        root.CollapseContent = factory(root.jQuery, root.Behaviors);
    }
}(this, function ($, Behaviors) {
    "use strict";

    var module = {};

    function $do(that, target) {
        return function () {
            target.apply(that, arguments);
        };
    }

    function CollapseContentRegion(elem) {
        Behaviors.init(CollapseContentRegion, this, arguments);

        this.$elem = $(elem);
        this.visible = this.$elem.data("collapsecontent-region-visible") !== undefined;

        this.update_classes();
    }

    Behaviors.inherit(CollapseContentRegion, Behaviors.Behavior);

    CollapseContentRegion.QUERY = "[data-collapsecontent-region]";

    CollapseContentRegion.prototype.update_classes = function () {
        this.$elem.find("[data-collapsecontent-body]").each(function (index, body_elem) {
            if (this.visible) {
                $(body_elem).addClass("is-CollapseContent--visible");
                $(body_elem).removeClass("is-CollapseContent--hidden");
            } else {
                $(body_elem).removeClass("is-CollapseContent--visible");
                $(body_elem).addClass("is-CollapseContent--hidden");
            }
        }.bind(this));

        this.$elem.find("[data-collapsecontent-trigger]").each(function (index, trigger_elem) {
            if (this.visible) {
                $(trigger_elem).addClass("is-CollapseContent--visible");
                $(trigger_elem).removeClass("is-CollapseContent--hidden");
            } else {
                $(trigger_elem).removeClass("is-CollapseContent--visible");
                $(trigger_elem).addClass("is-CollapseContent--hidden");
            }
        }.bind(this));
    };

    CollapseContentRegion.prototype.make_visible = function () {
        this.visible = true;
        this.update_classes();
    };

    CollapseContentRegion.prototype.make_hidden = function () {
        this.visible = false;
        this.update_classes();
    };

    CollapseContentRegion.prototype.toggle = function () {
        this.visible = !this.visible;
        this.update_classes();

        // Fire custom event when toggles are activated
        newEvent = new $.Event({
            "type": "collapsecontent-toggle",
            "visible": this.visible,
            "target": this.$elem,
        });

        this.$elem.trigger(newEvent);
    };

    function CollapseContentTrigger(elem) {
        Behaviors.init(CollapseContentTrigger, this, arguments);

        this.$elem = $(elem);

        if (this.$elem.data("collapsecontent-trigger") !== undefined) {
            //Mode 1: Trigger explicitly specifies region to toggle.
            this.region = this.set_region($(this.$elem.data("collapsecontent-trigger"))[0]);
        } else if (this.$elem.attr("href") !== undefined) {
            //Mode 1: Trigger explicitly specifies region to toggle, as an href..
            this.region = this.set_region($(this.$elem.data("collapsecontent-trigger"))[0]);
        }

        if (this.region === undefined) {
            //Mode 2: Find parent element that qualifies as a region.
            this.region = this.set_region(this.$elem.parents().filter(CollapseContentRegion.QUERY)[0]);
        }

        if (this.region === undefined) {
            console.error("There is a CollapseContent trigger that neither points to a valid region nor is a child of a valid region..");
        }

        this.$elem.on("click", this.toggle_intent.bind(this));
    }

    Behaviors.inherit(CollapseContentTrigger, Behaviors.Behavior);

    CollapseContentTrigger.QUERY = "[data-collapsecontent-trigger]";

    CollapseContentTrigger.prototype.set_region = function (elem) {
        if (elem === undefined) {
            return;
        }

        return CollapseContentRegion.locate(elem);
    };

    CollapseContentTrigger.prototype.toggle_intent = function (evt) {
        if (evt) {
            evt.preventDefault();
        }
        
        this.region.toggle();
    };

    Behaviors.register_behavior(CollapseContentRegion);
    Behaviors.register_behavior(CollapseContentTrigger);

    module.CollapseContentRegion = CollapseContentRegion;
    module.CollapseContentTrigger = CollapseContentTrigger;

    return module;
}));
;(function () {
    window.addEventListener('load', () => {
        if (document.querySelector('.hubspotContactForm')) {
            let inputs = document.querySelectorAll('.hubspotContactForm .hs-input');
            
            for (let i = 0; i < inputs.length; i++) {
                let thisInput = inputs[i];
    
                if (thisInput.value) {
                    thisInput.parentNode.parentNode.classList.add('active');
                }
    
                thisInput.addEventListener('focus', () => {
                    thisInput.parentNode.parentNode.classList.add('active');
                });
    
                thisInput.addEventListener('focusout', () => {
                    if (!thisInput.value) {
                        thisInput.parentNode.parentNode.classList.remove('active');
                    }
                });
            }
        }
    });
})();;(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define("ContentSlider", ["jquery", "Behaviors"], factory);
    } else {
        root.ContentSlider = factory(root.jQuery, root.Behaviors);
    }
}(window, function ($, Behaviors) {
    //TODO: Move this file out of `frontend.prebuilt.js` and into the global script pack
    "use strict";
    var module = {};
    
    function ContentSlider() {
        Behaviors.init(ContentSlider, this, arguments);
        this.element = this.$elem[0];
        this.left_arrow = this.$elem.data("contentslider-leftarrow");
        this.right_arrow = this.$elem.data("contentslider-rightarrow");
        this.dots = this.$elem.data("contentslider-dots");
        this.dots_icon = this.$elem.data("contentslider-dotsicon");
        this.autoplay_timeout = this.$elem.data("contentslider-autoplay");

        this.item_margin = this.$elem.data("contentslider-itemmargin");

        this.number_of_items = this.$elem.data("contentslider-itemsperview");
        this.center = this.$elem.data("contentslider-center");
        this.number_of_items_medium = this.$elem.data("contentslider-itemsperviewmedium");
        this.center_medium = this.$elem.data("contentslider-centermedium");
        this.number_of_items_responsive = this.$elem.data("contentslider-itemsperviewresponsive");
        this.center_responsive = this.$elem.data("contentslider-centerresponsive");

        this.slide_stage_padding = this.$elem.data("contentslider-stagepadding");
        this.slide_stage_padding_medium = this.$elem.data("contentslider-stagepaddingmedium");
        this.slide_stage_padding_responsive = this.$elem.data("contentslider-stagepaddingresponsive");
        
        this.has_loop = this.$elem.data("contentslider-loop") !== undefined;
        this.has_autoplay = this.autoplay_timeout !== undefined;
        this.has_hoverpause = this.$elem.data("contentslider-hoverpause") !== undefined;
        this.has_dots = this.dots !== "none";
        this.has_nav = false;
        if (this.left_arrow) {
            this.has_nav = true;
        }
        
        if (this.right_arrow) {
            this.has_nav = true;
        }
        this.initOwlCarousel();
    };
    
    Behaviors.inherit(ContentSlider, Behaviors.Behavior);
    
    ContentSlider.QUERY = "[data-contentslider]";
    
    ContentSlider.ELEMENTS = {
        heightContainer: ".scrollContainerHeight",
        widthContainer: ".scrollContainerWidth",
        sliderContents: ".horizontalContents",
        section: ".section",
        progressBar: ".progressBarFill",
        progressBall: ".progressBall",
        carousel: ".owl-carousel"
    };
    
    ContentSlider.prototype.dots_class = function () {
        return "owl-dots ContentSlider-dots ContentSlider-dots--style_" + this.dots;
    };
    
    ContentSlider.prototype.dot_class = function () {
        if (this.dots_icon) {
            return "ContentSlider-dot ContentSlider-dot--style_" + this.dots + " " + this.dots_icon;
        } else {
            return "ContentSlider-dot ContentSlider-dot--style_" + this.dots;
        }
    };
    
    ContentSlider.prototype.initOwlCarousel = function() {
        this.carousel = this.$elem.find(ContentSlider.ELEMENTS.carousel).owlCarousel({
            loop: this.has_loop,
            dots: this.has_dots,
            dotsClass: this.dots_class(),
            dotClass: this.dot_class(),
            margin: this.item_margin,
            nav: this.has_nav,
            navClass: ["owl-prev " + this.left_arrow, "owl-next " + this.right_arrow],
            //onDragged: self.updatePagination.bind(self),
            autoplay: this.has_autoplay,
            autoplayTimeout: this.autoplay_timeout,
            autoplayHoverPause: this.has_hoverpause,
            responsive : {
                0 : {
                    items: this.number_of_items_responsive,
                    slideBy: this.number_of_items_responsive,
                    center: this.center_responsive,
                    stagePadding: this.slide_stage_padding_responsive,
                },
                768 : {
                    items: this.number_of_items_medium,
                    slideBy: this.number_of_items_medium, 
                    center: this.center_medium,
                    stagePadding: this.slide_stage_padding_medium,
                },
                1024 : {
                    items: this.number_of_items,
                    slideBy: this.number_of_items, 
                    center: this.center,
                    stagePadding: this.slide_stage_padding,
                },
            },
        });
        //self.updateNav(0);
    };

    
    
    ContentSlider.prototype.init = function () {
        this.fixed = false;
        //this.setHeight();
        //this.handleScroll();
        //this.handleResize();
        this.initMobileSlider();
        //this.handleDrag();
        //this.element.querySelector(".currentSlide").innerHTML = "01";
        //this.element.querySelector(".maxSlide").innerHTML = "0".concat(this.sectionNumber);
        //this.setTitlePos();
    };
    
    ContentSlider.prototype.setHeight = function () {
        this.elementHeight = this.element.querySelector(ContentSlider.ELEMENTS.section).offsetHeight;
        this.sectionNumber = this.element.querySelectorAll(ContentSlider.ELEMENTS.section).length;
        var width = this.element.querySelector(ContentSlider.ELEMENTS.section).offsetWidth;
        this.height = (this.sectionNumber - 1) * (width * 3) + this.elementHeight;
        this.element.querySelector(ContentSlider.ELEMENTS.heightContainer).style.height = "".concat(this.height, "px");
    };
    
    ContentSlider.prototype.handleScroll = function () {
        var self = this;
        wContainer = self.element.querySelector(ContentSlider.ELEMENTS.widthContainer), sContents = self.element.querySelector(ContentSlider.ELEMENTS.sliderContents), pBar = self.element.querySelector(ContentSlider.ELEMENTS.progressBar);
        pBall = self.element.querySelector(ContentSlider.ELEMENTS.progressBall);
        window.addEventListener("scroll", function () {
            self.scrollHandler.call(self, wContainer, sContents, pBar, pBall);
        });
    };
    
    ContentSlider.prototype.scrollHandler = function(wContainer, sContents, pBar, pBall) {
        var self = this;
        var s = self.getOffsetTop(self.element) - window.scrollY;
        self.currentScroll = window.scrollY;
        var pFill = s * -1 / (self.height - self.elementHeight) * 100;

        if (s <= 0 && s >= (self.height - self.elementHeight) * -1 && self.fixed === false) {
            document.body.style.overscrollBehaviorX = 'none';
            wContainer.style.position = "fixed";
            self.fixed = true;
        } else if (s > 0) {
            wContainer.style.position = "absolute";
            wContainer.classList.add('top');
            wContainer.classList.remove('bottom');
            sContents.style.transform = "translate3d(0px, 0px, 0px)";
            pBar.style.width = "0%";
            pBall.style.left = "0%";
            self.fixed = false;
        } else if (s <= (self.height - self.elementHeight) * -1) {
            var height = (self.height - self.elementHeight) * -1 / 3;
            wContainer.style.position = "absolute";
            wContainer.classList.add('bottom');
            wContainer.classList.remove('top');
            sContents.style.transform = "translate3d(".concat(height, "px, 0px, 0px)");
            pBar.style.width = "100%";
            pBall.style.left = "100%";
            document.body.style.overscrollBehaviorX = 'auto';
            self.fixed = false;
        }

        if (self.fixed) {
            var ns = s / 3;
            self.ns = ns;
            var wScroll = s * -1;

            var _height = (self.height - self.elementHeight) * -1 / 3;

            if (ns) sContents.style.transform = "translate3d(".concat(ns, "px, 0px, 0px)");
            pBar.style.width = "".concat(pFill, "%");
            pBall.style.left = "".concat(pFill, "%");
            var newIndex = Math.floor(self.sectionNumber * (pFill / 100)) + 1;

            if (newIndex < 10) {
                newIndex = "0".concat(newIndex);
            }

            var maxIndex = self.sectionNumber;

            if (maxIndex < 10) {
                maxIndex = "0".concat(maxIndex);
            }

            self.element.querySelector(".currentSlide").innerHTML = newIndex;
            self.element.querySelector(".maxSlide").innerHTML = maxIndex; // if(pFill >= 90 && !self.circleOpen){
            //         self.toggleProgressCircle('open');
            // }else if(pFill < 90 && self.circleOpen){
            //         self.toggleProgressCircle('close');
            // }
            // if(newIndex > self.sectionNum - 1){
            //         return;
            // }else if(newIndex !== self.currentIndex){
            //         self.currentIndex = newIndex;
            // }
            // self.changeImageOpacity();
        }

        self.scrollPos = s;
    };
    
    ContentSlider.prototype.handleDrag = function() {
        var self = this;
        var wee = self.element.querySelector(ContentSlider.ELEMENTS.sliderContents);
        wee.addEventListener('mousedown', function (e) {
            self.mousedown = true;
            self.x = e.clientX;
        });
        wee.addEventListener('mouseup', function (e) {
            self.mousedown = false;
        });
        wee.addEventListener('mousemove', function (e) {
            if (self.mousedown === true && self.scrollPos < +30 && self.scrollPos > (self.height - self.elementHeight) * -1 - 30) {
                var ws = window.scrollY,
                        change = (self.x - e.clientX) * 3,
                        newPos = ws += change;
                window.scrollTo(0, newPos);
                self.x = e.clientX;
            }
        });
    };
    
    ContentSlider.prototype.getOffsetTop = function(ele) {
        var offsetTop = 0;

        while (ele) {
            offsetTop += ele.offsetTop;
            ele = ele.offsetParent;
        }

        return offsetTop;
    };
    
    ContentSlider.prototype.setTitlePos = function() {
        var width = this.element.querySelector(".fl-row-content").offsetWidth,
                title = this.element.querySelector(".sliderLabel"),
                prog = this.element.querySelector(".progressBarContainer");
        var leftPos = (window.innerWidth - width) / 2;
        title.style.left = "".concat(leftPos, "px");
        prog.style.left = "".concat(leftPos, "px");
    };
    
    ContentSlider.prototype.handleResize = function() {
        var self = this,
                wContainer = self.element.querySelector(ContentSlider.ELEMENTS.widthContainer),
                sContents = self.element.querySelector(ContentSlider.ELEMENTS.sliderContents),
                pBar = self.element.querySelector(ContentSlider.ELEMENTS.progressBar),
                pBall = self.element.querySelector(ContentSlider.ELEMENTS.progressBall);
        window.addEventListener("resize", function () {
            self.setHeight();
            self.setTitlePos();
            self.scrollHandler.call(self, wContainer, sContents, pBar, pBall);
            this.setTimeout(function () {
                self.setMobileOffset();
            }, 500);
        });
    };
    
    ContentSlider.prototype.setMobileOffset = function() {
        var offset = $(".owl-stage").offset().left;
        $(".sliderLabel").css("margin-left", "".concat(offset, "px"));
        $(".progressBarContainerMobile").css("margin-left", "".concat(offset, "px"));
    };
    
    ContentSlider.prototype.updatePagination = function(event) {
        var index = event.item.index;
        this.updateNav(index);
    };
    
    ContentSlider.prototype.updateNav = function(index) {
        var current = this.element.querySelector(".currentSlideMobile");
        var slideMax = this.element.querySelector(".maxSlideMobile");
        var max = this.element.querySelectorAll(".mobile-slider-item").length;
        index++;

        if (index < 10) {
            index = "0".concat(index);
        }

        if (max < 10) {
            max = "0".concat(max);
        }

        current.innerHTML = index;
        slideMax.innerHTML = max;
        var percent = index / max * 100;
        var ball = this.element.querySelector(".progressBallMobile");
        var fill = this.element.querySelector(".progressBarFillMobile");
        ball.style.left = "".concat(percent, "%");
        fill.style.width = "".concat(percent, "%");
    };
    
    Behaviors.register_behavior(ContentSlider);
    
    module.ContentSlider = ContentSlider;
    
    return module;
}));;/* Paginate.js
 * A progressively-enhancing infinite scroll library
 * ©2014 HUEMOR Designs All Rights Reserved
 */

/*global jQuery, define, console, window, document*/
(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define('depaginate', ['jquery', "Behaviors"], factory);
    } else if (root.jQuery) {
        root.PaginateJS = factory(root.jQuery, root.Behaviors);
    } else {
        console.error("No jQuery found. Load jQuery before this module or use an AMD-compliant loader.");
    }
}(this, function ($, Behaviors) {
    "use strict";
    
    var module = {};
    
    function Pager(elem, page_select_handler) {
        Behaviors.init(Pager, this, arguments);
        
        this.links = {};
        this.current = null;
        this.$pager = $(elem);
        this.min_page_count = Infinity;
        this.max_page_count = 0;
        
        this.$pager.addClass("is-Paginate--managed");

        this.page_select_handler = page_select_handler;

        this.features = this.$pager.data("paginate-features");

        if (this.features === undefined) {
            this.features = "replaceState";
        }

        console.log("Pager Features:" + this.features);
        this.features = this.features.split(" ");
    }
    
    Behaviors.inherit(Pager, Behaviors.Behavior);
    
    Pager.QUERY = "[data-paginate='pager']";
    
    Pager.DEFAULT_LINK = {
        "loaded": false,
        "requested": false,
        "pending": false,
        "current": false
    };
    
    Pager.prototype.is_page_loaded = function (pagenumber) {
        return this.links[pagenumber].loaded;
    };
    
    Pager.prototype.set_current_page = function (pagenumber) {
        var i = 0, pageid;
        
        if (this.current === pagenumber) {
            return;
        }
        
        this.current = pagenumber;
        this.links[pagenumber] = this.links[pagenumber] || $.extend({}, Pager.DEFAULT_LINK);
        
        for (pageid in this.links) {
            if (this.links.hasOwnProperty(pageid)) {
                this.links[pageid].current = pageid === pagenumber;
            }
        }
        
        if (this.links[pagenumber].$pagerContents !== undefined) {
            this.$pager.children().detach();
            this.$pager.append(this.links[pagenumber].$pagerContents);
        }
        
        if (this.links[pagenumber].href !== undefined) {
            if (this.features.indexOf("replaceState") > -1 && window.history.replaceState) {
                window.history.replaceState({transition: true, url: this.links[pagenumber].href}, "", this.links[pagenumber].href);
            }
        }
    };
    
    Pager.prototype.read_pager = function (pagerElem) {
        var $newPager = $(pagerElem),
            pagerThis = this;
        
        $newPager.find("[data-paginate='page']").each(function (index, pageElem) {
            var $newPage = $(pageElem),
                page = $newPage.data("paginate-page"),
                isCurrent = $newPage.data("paginate-current") !== undefined,
                href = $newPage.attr("href");
            
            pagerThis.links[page] = pagerThis.links[page] || $.extend({}, Pager.DEFAULT_LINK);
            
            pagerThis.links[page].href = href || pagerThis.links[page].href;
            pagerThis.links[page].current = isCurrent;
            
            if (isCurrent) {
                pagerThis.current = page;
            }
            
            if (pagerThis.links[page].pending) {
                pagerThis.load_page(page);
            }
            
            if (page > pagerThis.max_page_count) {
                pagerThis.max_page_count = page;
            }
            
            if (page < pagerThis.min_page_count) {
                pagerThis.min_page_count = page;
            }

            $newPage.on("click", function (evt) {
                evt.preventDefault();

                if (pagerThis.page_select_handler) {
                    pagerThis.page_select_handler(pagerThis, page);
                }
            });
        });
        
        this.links[this.current] = this.links[this.current] || $.extend({}, Pager.DEFAULT_LINK);
        this.links[this.current].$pagerContents = $newPager.children();
        
        if (this.links[this.current].$pagerContents !== undefined) {
            this.$pager.children().detach();
            this.$pager.append(this.links[this.current].$pagerContents);
        }
    };
    
    Pager.prototype.load_page = function (pagenumber, on_success, on_failure) {
        var paginateThis = this;
        
        if (this.links[pagenumber] === undefined || this.links[pagenumber].href === undefined) {
            this.links[pagenumber] = $.extend({}, this.links[pagenumber], Pager.DEFAULT_LINK);
            this.links[pagenumber].pending = true;
            this.links[pagenumber].on_success = on_success || this.links[pagenumber].on_success;
            this.links[pagenumber].on_failure = on_failure || this.links[pagenumber].on_failure;
            
            return;
        }
        
        if (this.links[pagenumber].requested || this.links[pagenumber].loaded) {
            return;
        }
        
        this.links[pagenumber].pending = false;
        this.links[pagenumber].requested = true;
        
        $.ajax({
            "url": this.links[pagenumber].href,
            "dataType": "html"
        }).done(function (data, textStatus, jqXHR) {
            if (paginateThis.links[pagenumber].on_success !== undefined) {
                paginateThis.links[pagenumber].on_success(data, textStatus, jqXHR);
            }
            
            if (on_success !== undefined) {
                on_success(data, textStatus, jqXHR);
            }
            
            paginateThis.links[pagenumber].loaded = true;
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (paginateThis.links[pagenumber].on_failure !== undefined) {
                paginateThis.links[pagenumber].on_failure(jqXHR, textStatus, errorThrown);
            }
            
            if (on_failure !== undefined) {
                on_failure(jqXHR, textStatus, errorThrown);
            }
        });
    };
    
    Pager.prototype.is_first_page = function (test_page) {
        return (test_page !== null && test_page === this.min_page_count);
    };
    
    Pager.prototype.is_last_page = function (test_page) {
        return (test_page !== null && test_page === this.max_page_count);
    };
    
    module.Pager = Pager;
    
    function Region(elem, on_region_scrolled) {
        var $extantRegion = $(elem);
        Behaviors.init(Region, this, arguments);
        
        this.name = $extantRegion.data("paginate-region");

        this.load_methods = $extantRegion.data("paginate-methods");

        if (this.load_methods === undefined) {
            this.load_methods = "scroll";
        }

        console.log("LoadMethods:" + this.load_methods);
        this.load_methods = this.load_methods.split(" ");

        this.features = $extantRegion.data("paginate-features");

        if (this.features === undefined) {
            this.features = "scrollOnLoad";
        }

        console.log("Region Features:" + this.features);
        this.features = this.features.split(" ");
        
        this.pages = {};
        this.pagenumbers = [];
        
        this.min_page_loaded = Infinity;
        this.max_page_loaded = 0;
        
        this.$region = $extantRegion;
        
        this.$parentScroller = null;
        this.lastScrollTop = 0;
        
        this.on_region_scrolled = on_region_scrolled;
        
        this.$region.addClass("is-Paginate--managed");
    }
    
    Behaviors.inherit(Region, Behaviors.Behavior);
    
    Region.QUERY = "[data-paginate='region']";
    
    /* Called to append a new page to the region.
     * 
     * Region contents will be extracted from the given region element and
     * appended to the existing region, such that any existing content belonging
     * to pages marked with a lower page number will appear before your page
     * content, and any existing content belonging to pages marked with a higher
     * page number will appear after your page content.
     * 
     * Already inserted pages will not be reinserted into the region.
     * 
     * As this function inserts content into the page, it will be presented to
     * Behaviors to ensure any Behaviors on the new page content can locate
     * correctly.
     * 
     * An event will be fired from the region's element called depaginate_load
     * which serves to indicate when a new page has loaded. Do not use this
     * event to check if new content has been added to the page, use Behaviors'
     * register_behavior or register_content_listener functions instead. This
     * event will be called before behaviors have been located on their
     * elements.
     */
    Region.prototype.read_page_region = function (pageNumber, regionElem) {
        var $newRegion = $(regionElem),
            itemSelector = $newRegion.data("paginate-selector") || "> *",
            prevPageNumberId = 0,
            nextPageNumberId = this.pagenumbers.length,
            nextPageNumber,
            prevPageNumber,
            pageAlreadyExists = false,
            i = 0,
            $newItems = $newRegion.find(itemSelector),
            $firstItem = $newItems.first(),
            $lastItem = $newItems.last(),
            oldPageTop = 0,
            newPageTop = 0,
            evt;
        
        if (this.firstVisiblePage !== undefined) {
            oldPageTop = this.page_top_position(this.firstVisiblePage);
        }

        for (i = 0; i < this.pagenumbers.length; i += 1) {
            if (this.pagenumbers[i] < pageNumber) {
                prevPageNumberId = i;
                prevPageNumber = this.pagenumbers[i];
            } else if (this.pagenumbers[i] === pageNumber) {
                pageAlreadyExists = true;
            } else {
                nextPageNumber = this.pagenumbers[i];
                nextPageNumberId = i;
                break;
            }
        }
        
        if (!pageAlreadyExists) {
            this.pagenumbers.splice(nextPageNumberId, 0, pageNumber);
            
            if (this.pages[prevPageNumber] !== undefined) {
                $newItems = $newItems.insertAfter(this.pages[prevPageNumber].$lastItem);
            } else if (this.pages[nextPageNumber] !== undefined) {
                $newItems = $newItems.insertBefore(this.pages[nextPageNumber].$firstItem);
            } //else do nothing since this obviously must be the original region
            
            $firstItem = $newItems.first();
            $lastItem = $newItems.last();
            
            this.pages[pageNumber] = this.pages[pageNumber] || {};
            this.pages[pageNumber].$newItems = $newItems;
            this.pages[pageNumber].$firstItem = $firstItem;
            this.pages[pageNumber].$lastItem = $lastItem;

            evt = jQuery.Event("depaginate_load");
            evt.region = this;
            evt.target = this.$region[0];
            evt.$newItems = $newItems;

            this.$region.trigger(evt);
            
            Behaviors.content_ready($newItems);
        }
        
        if (pageNumber < this.min_page_loaded) {
            this.min_page_loaded = pageNumber;
        }
        
        if (pageNumber > this.max_page_loaded) {
            this.max_page_loaded = pageNumber;
        }

        if (this.firstVisiblePage !== undefined) {
            newPageTop = this.page_top_position(this.firstVisiblePage);

            if (this.features.indexOf("scrollOnLoad") > -1) {
                window.setTimeout(
                    this.scroll_by_delta.bind(this, newPageTop - oldPageTop),
                    50
                );
            }
        }
    };
    
    Region.prototype.register_scroll_handler = function () {
        var cssOverflowX,
            regionThis = this;
        
        if (this.$parentScroller !== null) {
            this.$parentScroller.off("scroll.paginate");
        }

        this.$parentScroller = this.$region;

        while (this.$parentScroller.length !== 0 && this.$parentScroller.get(0) !== document) {
            cssOverflowX = this.$parentScroller.css("overflow-x");

            if (cssOverflowX === "visible" || cssOverflowX === "hidden") {
                this.$parentScroller = this.$parentScroller.parent();
            } else {
                break;
            }
        }
        
        regionThis.on_scroll({"target": this.$parentScroller[0]});
        this.$parentScroller.on("scroll.paginate", function (evt) {
            regionThis.on_scroll(evt);
        });

        this.lastScrollTop = this.$parentScroller.scrollTop();
    };
    
    Region.prototype.on_scroll = function (evt) {
        var $target = $(evt.target),
            scrollTop = $target.scrollTop(),
            scrollBottom = scrollTop + (evt.target !== document ? $target.height() : $(window).height()),
            targetTop = evt.target !== document ? $target.position().top : 0,
            targetAdjust = evt.target !== document ? scrollTop : 0,
            i = 0,
            firstVisibleTop = null,
            firstVisiblePage = null,
            lastVisiblePage = null,
            lastVisibleBottom = null,
            scrollDelta = scrollTop - this.lastScrollTop,
            stopOuterLoopSentinel = false,
            regionThis = this;
        
        this.lastScrollTop = scrollDelta;
        
        function pageEach(index, itemElem) {
            var $itemElem = $(itemElem),
                itemTop = targetAdjust + $itemElem.position().top - targetTop,
                itemBottom = itemTop + $itemElem.height(),
                isVisible = (scrollTop <= itemTop && itemTop <= scrollBottom) ||
                            (scrollTop <= itemBottom && itemBottom <= scrollBottom) ||
                            (itemTop <= scrollTop && scrollBottom <= itemBottom);
            
            if (!isVisible) {
                if (lastVisiblePage !== null) {
                    stopOuterLoopSentinel = true;
                }

                return true;
            }

            if (firstVisiblePage === null) {
                firstVisiblePage = regionThis.pagenumbers[i];
                firstVisibleTop = itemTop;
            }
            
            lastVisiblePage = regionThis.pagenumbers[i];
            lastVisibleBottom = itemTop + $itemElem.height();

            return false;
        }
        
        //Determine what pages are visible now
        if (this.pagenumbers.length === 0) {
            console.log("There are no page numbers.");
        }
        
        for (i = 0; i < this.pagenumbers.length; i += 1) {
            if (this.pages[this.pagenumbers[i]].$newItems === 0) {
                console.log("There are no pages within page " + this.pagenumbers[i]);
            }
            
            this.pages[this.pagenumbers[i]].$newItems.each(pageEach);
            
            if (stopOuterLoopSentinel) {
                stopOuterLoopSentinel = false;
                break;
            }
        }
        
        if (firstVisiblePage === null) {
            console.log("First visible page did NOT get set. Dropping the scroll event.");
            return;
        }
        
        this.firstVisiblePage = firstVisiblePage;
        this.lastVisiblePage = lastVisiblePage;
        this.firstVisibleTop = firstVisibleTop;
        this.lastVisibleBottom = lastVisibleBottom;

        if (this.load_methods.indexOf("scroll") > -1) {
            this.on_region_scrolled(this, scrollTop, scrollBottom, scrollDelta, firstVisiblePage, lastVisiblePage, firstVisibleTop, lastVisibleBottom);
        }
    };
    
    Region.prototype.first_loaded_page = function () {
        return this.min_page_loaded;
    };
    
    Region.prototype.last_loaded_page = function () {
        return this.max_page_loaded;
    };
    
    Region.prototype.set_additional_content_indicators = function (has_next_page, has_prev_page) {
        if (has_next_page) {
            this.$region.addClass("is-Paginate--has_next_page");
            this.$region.removeClass("is-Paginate--no_next_page");
        } else {
            this.$region.removeClass("is-Paginate--has_next_page");
            this.$region.addClass("is-Paginate--no_next_page");
        }
        
        if (has_prev_page) {
            this.$region.addClass("is-Paginate--has_prev_page");
            this.$region.removeClass("is-Paginate--no_prev_page");
        } else {
            this.$region.removeClass("is-Paginate--has_prev_page");
            this.$region.addClass("is-Paginate--no_prev_page");
        }
    };
    
    /* Returns the position of the top of a particular page.
     */
    Region.prototype.page_top_position = function (pagenumber) {
        var page = this.pages[pagenumber],
            $firstItem,
            measuredOffset,
            $parentScroller = this.$parentScroller,
            scrollerOffset = 0,
            encounteredScroller = false;
        
        if (page === undefined) {
            console.log("Missing page: " + pagenumber);
            console.log(this.pages);
            
            if (pagenumber < this.min_page_loaded || pagenumber === null) {
                pagenumber = this.min_page_loaded;
            }
            
            if (pagenumber > this.max_page_loaded) {
                pagenumber = this.max_page_loaded;
            }
            
            page = this.pages[pagenumber];
        }
        
        $firstItem = page.$firstItem;
        measuredOffset = $firstItem.offset().top;
        if ($parentScroller[0] !== document) {
            scrollerOffset = $parentScroller.offset().top;
        }
        
        return measuredOffset - scrollerOffset;
    };
    
    /* Scroll the region by a particular delta. */
    Region.prototype.scroll_by_delta = function (scrollDelta) {
        var $parentScroller = this.$parentScroller;
        
        $parentScroller.scrollTop($parentScroller.scrollTop() + scrollDelta);
    };
    
    Region.prototype.scroll_absolutely = function (scrollAbs) {
        var $parentScroller = this.$parentScroller;
        
        $parentScroller.scrollTop(scrollAbs);
    };
    
    module.Region = Region;
    
    function Paginate(elem) {
        var $extantPager = $(elem).find(Pager.QUERY),
            $extantRegions = $(elem).find(Region.QUERY),
            currentPage = $(elem).data("paginate-page"),
            paginateThis = this;
        
        Behaviors.init(Paginate, this, arguments);
        
        if ($extantPager.length === 0) {
            console.error("No pager was found in this paginage instance.");
            return;
        }
        
        if (this.$elem.attr('id') === undefined) {
            console.error("This paginate needs an id before it can be used.");
            return;
        }
        
        console.log("page: " + currentPage);
        
        this.$context = $(elem);
        this.id = this.$context.attr("id");
        
        function pshClosure() {
            paginateThis.page_select_handler.apply(paginateThis, arguments);
        }

        this.pager = Pager.locate($extantPager.get(0), pshClosure);
        
        if ($extantPager.data("paginate-count") === 1) {
            console.log("Not activating depaginate on a region with only one page.");
            return;
        }
        
        this.pager.set_current_page(currentPage);
        this.pager.read_pager($extantPager.get(0));
        
        this.regions = {};
        this.regionNames = [];
        
        this.currentPage = currentPage;
        
        function orsClosure() {
            paginateThis.on_region_scrolled.apply(paginateThis, arguments);
        }
        
        this.features = $extantPager.data("paginate-features");

        if (this.features === undefined) {
            this.features = "backScroll";
        }

        console.log("Paginate Features:" + this.features);
        this.features = this.features.split(" ");

        $extantRegions.each(function (index, elem) {
            var $extantRegion = $(elem),
                regionName = $extantRegion.data("paginate-region"),
                region,
                currentPage = paginateThis.currentPage;
            
            console.log("page: " + currentPage);
            
            function scrollBack() {
                console.log("Scrolling back the user to " + region.page_top_position(currentPage) + " (page: " + currentPage + ")");
                region.scroll_absolutely(region.page_top_position(currentPage));
            }
            
            paginateThis.regionNames.push(regionName);
            
            region = paginateThis.regions[regionName] || Region.locate(elem, orsClosure);
            paginateThis.regions[regionName] = region;
            
            region.read_page_region(currentPage, elem);
            region.register_scroll_handler();
            
            paginateThis.update_region_indicators(region);
            
            if (!paginateThis.pager.is_first_page(currentPage) && paginateThis.features.indexOf("backScroll") > -1) {
                //User pressed back button, scroll the region into view
                
                $(document).ready(scrollBack);
                $(window).on("load", function () {
                    window.setTimeout(scrollBack, 1500);
                });
            }
        });
    }
    
    Behaviors.inherit(Paginate, Behaviors.Behavior);
    
    Paginate.QUERY = "[data-paginate='paginate']";
    
    Paginate.prototype.page_load_success = function (data, textStatus, jqXHR) {
        var $data = $(data),
            i = 0,
            $dataPaginate,
            $dataRegion,
            $dataPager,
            region = null,
            paginateThis = this,
            next_page = 0;

        $dataPaginate = $data.find("#" + this.id);
        
        if ($dataPaginate.length === 0) {
            $dataPaginate = $data.filter("#" + this.id);
        }
        
        if ($dataPaginate.length === 0) {
            console.error("DEPAGINATE: The paginate context with ID " + this.id + " could not be found in the loaded page. Errors may result.");
        }
        
        next_page = $dataPaginate.data("paginate-page");

        for (i = 0; i < this.regionNames.length; i += 1) {
            $dataRegion = $dataPaginate.find("[data-paginate-region='" + this.regionNames[i] + "']");

            if ($dataRegion.length > 0) {
                region = this.regions[this.regionNames[i]];
                region.read_page_region(next_page, $dataRegion[0]);
            }
        }

        $dataPager = $dataPaginate.find(Pager.QUERY);
        $dataPager.each(function (index, pagerElem) {
            paginateThis.pager.read_pager(pagerElem);
        });

        this.pager.set_current_page(next_page);
        this.update_region_indicators(region);
    };

    Paginate.prototype.page_select_handler = function (pager, pagenumber) {
        var paginateThis = this;
        if (this.pager.is_page_loaded(pagenumber)) {
            return;
        }

        function on_success() {
            paginateThis.page_load_success.apply(paginateThis, arguments);
        }

        this.pager.load_page(pagenumber, on_success);
    };

    Paginate.prototype.on_region_scrolled = function (region, scrollTop, scrollBottom, scrollDelta, firstVisiblePage, lastVisiblePage, firstVisibleTop, lastVisibleBottom) {
        var visible_range = lastVisibleBottom - firstVisibleTop,
            visible_pagerange = lastVisiblePage - firstVisiblePage,
            average_page_size = visible_range / visible_pagerange,
            scroll_direction_down = scrollDelta > 0,
            should_load_page,
            next_page,
            paginateThis = this;
        
        function on_success() {
            paginateThis.page_load_success.apply(paginateThis, arguments);
        }
        
        if (scroll_direction_down) {
            should_load_page = scrollBottom + scrollDelta >= lastVisibleBottom;
            next_page = lastVisiblePage + 1;
            
            this.pager.set_current_page(lastVisiblePage);
        } else {
            should_load_page = scrollTop + scrollDelta < firstVisibleTop;
            next_page = firstVisiblePage - 1;
            
            this.pager.set_current_page(firstVisiblePage);
        }
        
        if (next_page < 0) {
            return;
        }
        
        if (should_load_page) {
            this.pager.load_page(next_page, on_success);
        }
    };
    
    Paginate.prototype.update_region_indicators = function (region) {
        region.set_additional_content_indicators(
            !this.pager.is_last_page(region.last_loaded_page()),
            !this.pager.is_first_page(region.first_loaded_page())
        );
    };
    
    module.Paginate = Paginate;
    
    Behaviors.register_behavior(Paginate);
    
    return module;
}));;window.Huemor = window.Huemor || {};
window.Huemor.FilterableLogoGrid = (function($, Behaviors) {
    /**
     * JS that powers the filtering on the filterable logo grid.
     */
    function FilterableLogoGrid() {
        Behaviors.init(FilterableLogoGrid, this, arguments);

        this.$filters = this.$elem.find("[data-filterablelogogrid-filter]");
        this.$content_items = this.$elem.find("[data-filterablelogogrid-content]");

        this.current_filter = "";
        this.update_filters();

        this.$filters.each(function (index, filter_toggle) {
            var $filter = $(filter_toggle);

            $filter.on("click", this.filter_change_intent.bind(this, $filter));
        }.bind(this));
    }

    Behaviors.inherit(FilterableLogoGrid, Behaviors.Behavior);

    FilterableLogoGrid.QUERY = "[data-filterablelogogrid]";

    /**
     * Event handler for a filter being clicked.
     * 
     * @param {jQuery} $filter The filter that was clicked.
     * @param {*} evt The event that caused the click.
     */
    FilterableLogoGrid.prototype.filter_change_intent = function($filter, evt) {
        var new_category = $filter.data("filterablelogogrid-filter");

        if (this.current_filter !== new_category) {
            this.current_filter = new_category;
        } else {
            this.current_filter = "";
        }

        this.update_filters();
        evt.preventDefault();
    };

    /**
     * Update state of the filters after an event was processed.
     */
    FilterableLogoGrid.prototype.update_filters = function () {
        this.$content_items.each(function (index, cielem) {
            var $cielem = $(cielem),
                content_categories = $cielem.data("filterablelogogrid-content-category");

            if (this.current_filter === "" || content_categories.indexOf(this.current_filter) !== -1) {
                $cielem.addClass("is-FilterableLogoGrid-logo--visible");
                $cielem.removeClass("is-FilterableLogoGrid-logo--hidden");
            } else {
                $cielem.removeClass("is-FilterableLogoGrid-logo--visible");
                $cielem.addClass("is-FilterableLogoGrid-logo--hidden");
            }
        }.bind(this));

        this.$filters.each(function (index, felem) {
            var $felem = $(felem),
                filter = $felem.data("filterablelogogrid-filter");
            
            if (this.current_filter === filter) {
                $felem.addClass("is-FilterableLogoGrid-filter--active");
                $felem.removeClass("is-FilterableLogoGrid-filter--inactive");
            } else {
                $felem.removeClass("is-FilterableLogoGrid-filter--active");
                $felem.addClass("is-FilterableLogoGrid-filter--inactive");
            }
        }.bind(this));
    }

    Behaviors.register_behavior(FilterableLogoGrid);

    return FilterableLogoGrid;
}(window.jQuery, window.Behaviors));;/*global define,google,Promise*/
(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define("GoogleMap", ["jquery", "Behaviors"], factory);
    } else {
        root.GoogleMap = factory(root.jQuery, root.Behaviors);
    }
}(this, function ($, Behaviors) {
    "use strict";
    
    var module = {};
    
    function GoogleMap() {
        Behaviors.init(GoogleMap, this, arguments);
        
        this.load_gmaps().then(this.render_map.bind(this));
    }
    
    Behaviors.inherit(GoogleMap, Behaviors.Behavior);
    
    GoogleMap.QUERY = "[data-googlemap]";
    
    GoogleMap.prototype.center_specified_by_markup = function () {
        return this.$elem.data("googlemap-lat") !== undefined && this.$elem.data("googlemap-lng") !== undefined;
    };
    
    GoogleMap.prototype.determine_default_args = function () {
        var args = {
            center: {lat: 0, lng: 0},
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            draggable: false,
            scrollwheel: false,
            zoom: 15
        };
        
        if (this.$elem.data("googlemap-draggable") !== undefined) {
            args.draggable = true;
        }
        
        if (this.$elem.data("googlemap-scrollzoom") !== undefined) {
            args.scrollwheel = true;
        }
        
        if (this.center_specified_by_markup()) {
            args.center = {lat: this.$elem.data("googlemap-lat"),
                           lng: this.$elem.data("googlemap-lng")};
        }
        
        if (this.$elem.data("googlemap-zoom") !== undefined) {
            args.zoom = this.$elem.data("googlemap-zoom");
        }
        
        return args;
    };
    
    GoogleMap.prototype.load_gmaps = function () {
        return Promise.resolve().then(function () {
            if (window.google) {
                return;
            } else {
                //TODO: Autoload Gmaps API
                throw new Error("Google Maps API not loaded at time of initialization.");
            }
        });
    };
    
    GoogleMap.prototype.render_map = function () {
        var $markers = this.$elem.find('[data-googlemap-marker]'), i;
        
        // create map
        this.map = new google.maps.Map(this.$elem[0], this.determine_default_args());
        
        this.map.markers = [];
        for (i = 0; i < $markers.length; i += 1) {
            this.add_marker($($markers[i]), this.map);
        }
        
        // center map
        this.center_map();
    };
    
    GoogleMap.prototype.add_marker = function ($marker) {
        var latlng = new google.maps.LatLng($marker.data('googlemap-lat'), $marker.data('googlemap-lng')),
            marker = new google.maps.Marker({
                position: latlng,
                map: this.map
            }),
            infowindow;
        
        this.map.markers.push(marker);
        
        // if marker contains HTML, add it to an infoWindow
        if ($marker.html()) {
            infowindow = new google.maps.InfoWindow({
                content		: $marker.html()
            });
            
            google.maps.event.addListener(marker, 'click', this.marker_click_intent.bind(this, marker, infowindow));
        }
    };
    
    GoogleMap.prototype.marker_click_intent = function (marker, infowindow) {
        infowindow.open(this.map, marker);
    };
    
    GoogleMap.prototype.center_map = function () {
        var i, marker, latlng, bounds = new google.maps.LatLngBounds();
        
        // loop through all markers and create bounds
        for (i = 0; i < this.map.markers.length; i += 1) {
            marker = this.map.markers[i];
            latlng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
            bounds.extend(latlng);
        }
        
        if (!this.center_specified_by_markup()) {
            if (this.map.markers.length === 1) {
                this.map.setCenter(bounds.getCenter());
            } else {
                this.map.fitBounds(bounds);
            }
        }
    };
    
    Behaviors.register_behavior(GoogleMap);
    
    module.GoogleMap = GoogleMap;
    
    return module;
}));;/*global define, console*/
/*jslint bitwise: true */
/* updated 9/14/2016 */

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt) { /*, from*/
        "use strict";
        var len = this.length >>> 0, from = Number(arguments[1]) || 0, derparam;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) {
            from += len;
        }

        for (derparam; from < len; from += 1) {
            if (from in this && this[from] === elt) {
                return from;
            }
        }
        return -1;
    };
}

(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define("betteroffcanvas", ["jquery"], factory);
    } else {
        // Browser globals
        root.betteroffcanvas = factory(root.jQuery);
    }
}(this, function ($) {
    //BetterOffcanvas
    //Works like this:
    /*
    *  <button type="button" data-toggle="offcanvas" data-target="#any-selector">
    */

    "use strict";

    var $openTarget = null, currentLevel = 0, module = {}, isInDebounce = false,
        target_has_touch = false,
        focus_click_inquiry = false, click_keydown_inquiry = false,
        eligibleTouches = {},
        logger;
    
    /* Logger that throws away all data (default)
     */
    function null_logging() {
        return;
    }
    
    /* Logger that sends all logged data to the JS console.
     */
    function console_logging(log_data) {
        return console.log(log_data);
    }
    
    function switchLoggingMode(mode) {
        switch (mode) {
        case "console":
            logger = console_logging;
            break;
        default:
            logger = null_logging;
            break;
        }
    }
    
    //Inform the user they can enable console logging
    console.log("Offcanvas: You can enable detailed event logging by typing betteroffcanvas.switchLoggingMode('console').");
    switchLoggingMode("null");

    function initOffcanvasToggle($theToggle) {
        var $theTarget = $($theToggle.data("target")), toggleOptions = $theToggle.data("toggle-options"),
            state;

        if ($theTarget.data("offcanvas-state") === undefined) {
            $theTarget.data("offcanvas-state", {"open": false, "parents": null, "$openChild": null, "openChildLvl": 0, "toggleOptions": []});
        }

        state = $theTarget.data("offcanvas-state");

        if (state.toggleOptions === undefined) {
            state.toggleOptions = [];
        }

        if (toggleOptions !== undefined) {
            state.toggleOptions.push.apply(state.toggleOptions, toggleOptions.split(" "));
        }

        $theTarget.data("offcanvas-state", state);

        return $theTarget;
    }

    function findParentLevels($theTarget) {
        var parents = [], tgtState = $theTarget.data("offcanvas-state");

        if (tgtState.parents === null) {
            $theTarget.parents().each(function (index, pelem) {
                var $pelem = $(pelem),
                    parState = $pelem.data("offcanvas-state"),
                    $parTgl;

                if (parState === undefined) {
                    if ($pelem.attr("id") !== undefined) {
                        $parTgl = $("[data-toggle='offcanvas'][data-target='#" + $pelem.attr("id") + "']");
                        if ($parTgl.length > 0) {
                            initOffcanvasToggle($parTgl);
                            parents.push(pelem);
                        }
                    }
                } else {
                    parents.push(pelem);
                }
            });

            tgtState.parents = parents;
            $theTarget.data("offcanvas-state", tgtState);

            $(tgtState.parents).each(function (index, pelem) {
                findParentLevels($(pelem));
            });
        }
    }

    function initOffcanvas($theTarget, toggleOptions) {
        if (toggleOptions === undefined) {
            toggleOptions = [];
        }
        
        if ($theTarget.data("offcanvas-state") === undefined) {
            $theTarget.data("offcanvas-state", {"open": false, "parents": null, "$openChild": null, "openChildLvl": 0, "toggleOptions": toggleOptions});
        }

        findParentLevels($theTarget);
    }

    function isOffcanvas($theTargetList) {
        var truth = true;

        $theTargetList.each(function (index, elem) {
            var $theTarget = $(elem), $toggles;

            if ($theTarget.data("offcanvas-state") !== undefined) {
                truth = truth & true;
                return;
            }

            $toggles = $("[data-toggle='offcanvas'][data-target='#" + $theTarget.attr("id") + "']");

            if ($toggles.length > 0) {
                initOffcanvas($theTarget);

                $toggles.each(function (index, elem) {
                    initOffcanvasToggle($(elem));
                });

                truth &= true;
                return;
            }

            truth &= false;
        });

        return truth;
    }

    function isChildOffcanvas($theTarget, $potentialParent) {
        if (!isOffcanvas($theTarget) || !isOffcanvas($potentialParent)) {
            return false;
        }

        if ($theTarget.data("offcanvas-state").parents.indexOf($potentialParent[0]) === -1) {
            return false;
        }

        return true;
    }

    function isTopLevelOffcanvas($theTarget) {
        return isOffcanvas($theTarget) && $theTarget.data("offcanvas-state").parents.length === 0;
    }

    function updateBackdrop(newLevel, openTargetList) {
        var $backdropDivs = $("[data-offcanvas-backdrop]");

        $backdropDivs.each(function (index, bdElem) {
            var $bdElem = $(bdElem),
                bdLevel = $bdElem.data("offcanvas-backdrop"),
                bdFor = $bdElem.data("offcanvas-backdrop-for");

            if (bdFor !== undefined && openTargetList.indexOf(bdFor) === -1) {
                $bdElem.removeClass("is-Offcanvas--backdrop_active");
                $bdElem.addClass("is-Offcanvas--backdrop_inactive");
            } else if (newLevel >= bdLevel) {
                $bdElem.addClass("is-Offcanvas--backdrop_active");
                $bdElem.removeClass("is-Offcanvas--backdrop_inactive");
            } else {
                $bdElem.removeClass("is-Offcanvas--backdrop_active");
                $bdElem.addClass("is-Offcanvas--backdrop_inactive");
            }
        });

        currentLevel = newLevel;
    }

    function scanChildrenWithinLevel($theTarget, cbk) {
        $theTarget.each(function (index, elem) {
            var $elem = $(elem);

            if (isOffcanvas($elem)) {
                return;
            }

            cbk($elem);
            scanChildrenWithinLevel($elem.children(), cbk);
        });
    }

    function setFocusableWithinLevel($theTarget, isFocusable) {
        if (isFocusable === undefined) {
            isFocusable = true;
        }

        logger("changing focus state to " + isFocusable);

        scanChildrenWithinLevel($theTarget.children(), function ($elem) {
            if ($elem.data("offcanvas-tabindex") === undefined) {
                //Determine if this element should be focusable or not...
                if ($elem.attr("tabindex") !== undefined) {
                    $elem.data("offcanvas-tabindex", $elem.attr("offcanvas-tabindex"));
                } else {
                    $elem.data("offcanvas-tabindex", null);
                }
            }

            if (isFocusable) {
                if ($elem.data("offcanvas-tabindex") === null) {
                    $elem.removeAttr("tabindex");
                } else {
                    $elem.attr("tabindex", $elem.data("offcanvas-tabindex"));
                }
            } else {
                $elem.attr("tabindex", -1);
            }
        });
    }

    function openOffcanvas($theTarget, $theToggle, eventType, isRecursive, recursiveCount) {
        var tgtState, $pelem, parState, newLevel = 1, i, targetIDs = [], $topElem, topState, newEvent;
        if ($theTarget !== null && $theTarget !== undefined) {
            logger("Open Offcanvas " + $theTarget.attr("id"));
        } else {
            logger("Open Offcanvas (no target)");
        }

        if ($theTarget === null) {
            return;
        }
        tgtState = $theTarget.data("offcanvas-state");

        if (recursiveCount === undefined) {
            recursiveCount = 1;
        }

        $theTarget.addClass("is-Offcanvas--open");
        $theTarget.removeClass("is-Offcanvas--closed");
        tgtState.open = true;
        tgtState.open_event = eventType;
        $theTarget.data("offcanvas-state", tgtState);

        $("[data-toggle='offcanvas'][data-target='#" + $theTarget.attr("id") + "']").addClass("is-Offcanvas--target_open");

        setFocusableWithinLevel($theTarget, true);

        if (tgtState.parents.length > 0) {
            $pelem = $(tgtState.parents[0]);

            parState = $pelem.data("offcanvas-state");
            parState.$openChild = $theTarget;
            parState.openChildLvl = recursiveCount;
            $pelem.data("offcanvas-state", parState);

            $pelem.addClass("is-Offcanvas--open_sublvl_" + recursiveCount);

            openOffcanvas($pelem, $theToggle, eventType, true, recursiveCount + 1);

            newLevel = newLevel + tgtState.parents.length;

            $topElem = $(tgtState.parents[tgtState.parents.length - 1]);
            if ($topElem.length > 0) {
                topState = $topElem.data("offcanvas-state");

                if (topState !== undefined) {
                    if (topState.childDepthLvl !== undefined) {
                        $topElem.removeClass("is-Offcanvas--depth_" + topState.childDepthLvl);
                    }

                    topState.childDepthLvl = tgtState.parents.length;
                    $topElem.addClass("is-Offcanvas--depth_" + topState.childDepthLvl);
                }
            }
        }

        if (isRecursive !== true) {
            targetIDs.push($theTarget.attr("id"));

            for (i = 0; i < tgtState.parents.length; i += 1) {
                targetIDs.push(tgtState.parents[i].getAttribute("id"));
            }

            updateBackdrop(newLevel, targetIDs);
        }

        $openTarget = $theTarget;

        newEvent = new $.Event({
            "type": "offcanvas-open",
            "target": $theTarget,
            "toggle": $theToggle,
            "from_child": isRecursive,
            "children_count": recursiveCount
        });
        $theTarget.trigger(newEvent);
    }
    
    /* Determine if a user-triggered event is allowed to dismiss an offcanvas
     * or not.
     * 
     * This function is consistenly called before dismissOffcanvas in order to
     * gate event-driven dismissals consistently. Programmatic dismissals (e.g.
     * by third-party code or for clearing the way for the next offcanvas) are
     * NOT gated in the same way.
     * 
     * To gate dismissals in the same fashion, call this function with the
     * following four parameters:
     * 
     *  - $_openTarget: The currently open offcanvas at the start of event
     *                 processing. Specify false to automatically select the
     *                 current open target. Specify undefined for no open
     *                 target.
     * 
     *  - $newTarget:  The new offcanvas that you plan to open at the end of
     *                 event processing.
     * 
     *  - evt:         The event that triggered your current event processing.
     *                 Your code is expected to filter mobile emulation events
     *                 such as emulated click-after-touchend through some means
     *                 so that this function can differentiate between the two.
     * 
     *  - $evtToggle:  The element which triggered the event. May be a
     *                 data-toggle or data-dismiss element. This is not,
     *                 strictly speaking, evt.target: client code is allowed and
     *                 expected to traverse the parents of the target to find,
     *                 say, the button containing the actual event target.
     * 
     * In the event of recieving false from this function, event handlers should
     * cease any event processing which would cause the open target to be
     * dismissed, including opening other offcanvas hierarchies as that will
     * implicitly dismiss the current one.
     */
    function eventCanDismissOffcanvas($_openTarget, $newTarget, evt, $evtToggle) {
        var openTargetState = {"toggleOptions": []}, openTargetIsNoHover = false,
            openTargetWasHovered = false,
            targetsAreIdentical = false,
            evtFromToggle = false, evtFromDismiss = false,
            evtWithinOpenTarget = false,
            evtToggleOptions, evtToggleIsNoHover = false,
            evtToggleTargetsOpenTarget = false,
            hasNewTarget,
            hasOpenTarget,
            hasEventToggle;
        
        if ($_openTarget === false) {
            $_openTarget = $openTarget;
        }
        
        hasNewTarget = $newTarget !== undefined && $newTarget !== null && $newTarget.length >= 1;
        hasOpenTarget = $_openTarget !== undefined && $_openTarget !== null && $_openTarget.length >= 1;
        hasEventToggle = $evtToggle !== undefined && $evtToggle !== null && $evtToggle.length >= 1;
        
        if (hasOpenTarget) {
            openTargetState = $_openTarget.data("offcanvas-state");
            openTargetIsNoHover = openTargetState.toggleOptions.indexOf("nohover") > -1;
            openTargetWasHovered = openTargetState.open_event === "mouseover";
            
            if (evt.target) {
                evtWithinOpenTarget = $_openTarget[0] === evt.target || $.contains($_openTarget[0], evt.target);
            }
        } else {
            logger("Dismissals are always allowed if no offcanvas is open");
            return true;
        }
        
        if (hasNewTarget) {
            targetsAreIdentical = $_openTarget[0] === $newTarget[0];
        }
        
        if (hasEventToggle) {
            evtFromToggle = $evtToggle.filter("[data-toggle='offcanvas']").length > 0 ||
                            $evtToggle.parents().filter("[data-toggle='offcanvas']").length > 0;
            evtFromDismiss = $evtToggle.filter("[data-dismiss='offcanvas']").length > 0 ||
                             $evtToggle.parents().filter("[data-dismiss='offcanvas']").length > 0;
            
            evtToggleOptions = $evtToggle.data("toggle-options");
            if (evtToggleOptions !== undefined) {
                evtToggleOptions = evtToggleOptions.split(" ");
            } else {
                evtToggleOptions = [];
            }
            
            evtToggleIsNoHover = evtToggleOptions.indexOf("nohover") > -1;
            evtToggleTargetsOpenTarget = $evtToggle.data("target") === "#" + $_openTarget.attr("id");
        }
        
        //Dismissals by toggling the same target
        if (evt.type === "click" && openTargetWasHovered) {
            if (targetsAreIdentical) {
                logger("Not going to allow dismiss from click on already hovered nav.");
                return false;
            }
        }
        
        if (evt.type === "focusin") {
            if (targetsAreIdentical) { //TODO: should this be evtWithinOpenTarget?
                logger("Not going to allow dismiss from focusin within same target");
                return false;
            }
            
            if (!hasNewTarget && (evtFromToggle || evtFromDismiss)) {
                logger("Ignoring focus-dismiss due to the fact that event target is an offcanvas toggle.");
                logger("Currently focused off-canvas element: " + $_openTarget.attr("id"));
                return false;
            }
        }
        
        if (evt.type === "mouseover" && !evtWithinOpenTarget) {
            if (evtFromDismiss) {
                logger("Not going to allow dismiss until user actually clicks hovered dismiss button.");
                return false;
            } else if (evtToggleIsNoHover || openTargetIsNoHover) {
                logger("Not going to allow dismiss as toggle is nohover.");
                return false;
            } else if (evtFromToggle && targetsAreIdentical) {
                logger("Not going to allow dismiss as toggle is for current offcanvas.");
                return false;
            }
        }
        
        return true;
    }

    function dismissOffcanvas($theTarget, numLvls) {
        var tgtState = $theTarget.data("offcanvas-state"), newLvl = -1, i, targetIDs = [], $topElem, topState, newEvent;

        if ($theTarget !== null && $theTarget !== undefined) {
            logger("Dismiss Offcanvas " + $theTarget.attr("id"));
        } else {
            logger("Dismiss Offcanvas (no target)");
        }

        if (numLvls === undefined) {
            /* NumLvls is the number of recursion levels (children being auto-dismissed) */
            numLvls = 1;

            $topElem = $(tgtState.parents[tgtState.parents.length - 1]);
            if ($topElem.length > 0) {
                topState = $topElem.data("offcanvas-state");

                if (topState !== undefined) {
                    if (topState.childDepthLvl !== undefined) {
                        $topElem.removeClass("is-Offcanvas--depth_" + topState.childDepthLvl);
                    }

                    topState.childDepthLvl = tgtState.parents.length - 1;
                    $topElem.addClass("is-Offcanvas--depth_" + topState.childDepthLvl);
                }
            }
        }

        $theTarget.removeClass("is-Offcanvas--open");
        $theTarget.addClass("is-Offcanvas--closed");
        tgtState.open = false;
        tgtState.open_event = undefined;
        $theTarget.data("offcanvas-state", tgtState);

        $("[data-toggle='offcanvas'][data-target='#" + $theTarget.attr("id") + "']").removeClass("is-Offcanvas--target_open");

        newEvent = new $.Event({
            "type": "offcanvas-dismiss",
            "target": $theTarget
        });
        $theTarget.trigger(newEvent);

        //TODO: How do we actually tell if the offcanvas is visible when closed?
        //(e.g. desktop nav)
        if (!isTopLevelOffcanvas($theTarget)) {
            if ($theTarget !== null) {
                logger("Marking non-top-level offcanvas nav " + $theTarget.attr("id") + " as untabbable");
            }
            setFocusableWithinLevel($theTarget, false);
        }

        if (tgtState.$openChild !== null) {
            dismissOffcanvas(tgtState.$openChild, numLvls + 1);
        } else {
            if (tgtState.parents.length > 0) {
                $openTarget = $(tgtState.parents[numLvls - 1]);
                if ($openTarget.length === 0) {
                    $openTarget = null;
                }

                $(tgtState.parents).each(function (index, pelem) {
                    var $pelem = $(pelem), parState = $pelem.data("offcanvas-state"), childlvl, newChildLvl = parState.openChildLvl - numLvls;

                    $pelem.removeClass("is-Offcanvas--open_sublvl_" + parState.openChildLvl);
                    if (newChildLvl > 0) {
                        $pelem.addClass("is-Offcanvas--open_sublvl_" + newChildLvl);
                    } else {
                        parState.$openChild = null;
                    }

                    parState.openChildLvl = newChildLvl;
                    $pelem.data("offcanvas-state", parState);

                    if (newChildLvl > newLvl) {
                        newLvl = newChildLvl;
                    }
                });
            } else {
                $openTarget = null;
                newLvl = -1;
            }

            for (i = 0; i < tgtState.parents.length; i += 1) {
                targetIDs.push(tgtState.parents[i].getAttribute("id"));
            }

            updateBackdrop(newLvl + 1, targetIDs);
        }
    }

    function dismissOpenOffcanvas() {
        if ($openTarget !== null) {
            dismissOffcanvas($openTarget);
        }
    }

    function enableDebounce() {
        if (!isInDebounce) {
            logger("Debounce timeout enabled");
            isInDebounce = true;
            window.setTimeout(function () {
                logger("Debounce timeout expired - event processing will resume");
                isInDebounce = false;
            }, 100);
        }
    }

    $(document).on("keydown", function (evt) {
        if (evt.keyCode === 27) {
            dismissOpenOffcanvas();
        } else if (evt.keyCode === 13) {
            logger("Keydown event - ENTER. Disabling link clickthrough for the next click event.");
            click_keydown_inquiry = true; //mark that the following click event is
                                        //from a keyboard
        }
    });

    $(document).on("ready", function (evt) {
        var openIDs = [], openState, i;

        if ($openTarget !== null) {
            openState = $openTarget.data("offcanvas-state");

            for (i = 0; i < openState.parents.length; i += 1) {
                openIDs.push(openState.parents[i].getAttribute("id"));
            }

            updateBackdrop(currentLevel, openIDs);
        }
    });

    function on_focusin(evt) {
        var $tgt = $(evt.target), $tgtOffcanvas = null,
            $tgtParents = $tgt.parents(), $toggleTarget,
            dismissAllowed;

        $tgtParents.each(function (index, elem) {
            if ($tgtOffcanvas === null) {
                if (isOffcanvas($(elem))) {
                    $tgtOffcanvas = $(elem);
                }
            }
        });

        if (isInDebounce) {
            logger("Processed event (debounced, type: focusin)");
            return;
        }
        
        if ($tgt.data("toggle") === "offcanvas") {
            $toggleTarget = $($tgt.data("target"));
            if (!isTopLevelOffcanvas($toggleTarget)) {
                if ($toggleTarget !== null) {
                    logger("Marking non-top-level offcanvas nav " + $toggleTarget.attr("id") + " as untabbable");
                }
                setFocusableWithinLevel($toggleTarget, false);
            }
        }
        
        if (!eventCanDismissOffcanvas($openTarget, $tgtOffcanvas, evt, $tgt)) {
            return;
        }

        if ($tgtOffcanvas === null && $openTarget !== null) {
            logger("Focused on something outside of off-canvas nav " + $openTarget.attr("id"));
            logger($tgt);

            enableDebounce(); //prevent subsequent click event handlers from tripping

            while ($openTarget !== null) {
                dismissOpenOffcanvas();
            }
        } else {
            if ($tgtOffcanvas !== null) {
                logger("Focused inside off-canvas nav " + $tgtOffcanvas.attr("id"));
            }

            if ($openTarget !== null) {
                enableDebounce(); //prevent subsequent click event handlers from tripping

                while ($openTarget !== null && !isChildOffcanvas($tgtOffcanvas, $openTarget)) {
                    logger("Dismissing off-canvas menu " + $openTarget.attr("id"));
                    dismissOffcanvas($openTarget);
                }
            }
            openOffcanvas($tgtOffcanvas, $tgt, evt.type);
        }
    }
    
    //Track a specific set of focus events to ensure they don't result in a
    //click.
    $(document).on("focusin", function (evt) {
        logger(evt.type);

        focus_click_inquiry = true;

        window.setTimeout(function () {
            if (focus_click_inquiry) { //e.g. if a click event hasn't happened
                on_focusin(evt);
            }
        }, 300);
    });
    
    //Activate touch-specific behaviors if we have ever recieved a touch event.
    $(document).on("touchstart touchend touchmove touchcancel", function (evt) {
        target_has_touch = true;
    });
    
    /* Track the starting position of every touch we get. */
    $(document).on("touchstart", function (evt) {
        var i, touch;
        
        for (i = 0; i < evt.originalEvent.changedTouches.length; i += 1) {
            touch = evt.originalEvent.changedTouches.item(i);
            eligibleTouches[touch.identifier] = {
                "x": touch.screenX,
                "y": touch.screenY
            };
        }
    });
    
    /* Track and remove touches which have become drags.
     * Assumes a minimum drag distance of 15px.
     * Returns true if any of the given touches are still eligible.
     */
    function testAndPruneTouchList(changedTouches) {
        var i, touch, stTouch, dist, MAX_DIST = 15, num_valid_touches = 0;
        
        for (i = 0; i < changedTouches.length; i += 1) {
            touch = changedTouches.item(i);
            
            if (eligibleTouches.hasOwnProperty(touch.identifier)) {
                stTouch = eligibleTouches[touch.identifier];
                dist = Math.sqrt(Math.pow((touch.screenX - stTouch.x), 2.0)
                               + Math.pow((touch.screenY - stTouch.y), 2.0));
                
                if (dist > MAX_DIST) {
                    delete eligibleTouches[touch.identifier];
                } else {
                    num_valid_touches += 1;
                }
            }
        }
        
        return num_valid_touches > 0;
    }
    
    /* Remove touches that have become drags.
     * This function assumes a minimum drag distance of 15px.
     */
    $(document).on("touchmove", function (evt) {
        testAndPruneTouchList(evt.originalEvent.changedTouches);
    });
    
    /* Remove touches that have cancelled for hardware or OS specific reasons.
     */
    $(document).on("touchcancel", function (evt) {
        var i, touch;
        
        for (i = 0; i < evt.originalEvent.changedTouches.length; i += 1) {
            touch = evt.originalEvent.changedTouches.item(i);
            delete eligibleTouches[touch.identifier];
        }
    });
    
    /* Our main, extremely complicated event handler.
     * We have to track a whole bunch of corner cases, since users expect the
     * following out of their navigation structures:
     * 
     *  1. Hovering over a toggle should open it
     *  2. Touching a toggle with a finger should open it
     *  3. Clicking on a toggle should navigate to it's link target, as it has
     *     already opened from a hover
     *  4. Tab-focusing content should cause offcanvas's open/close state to
     *     follow through it
     *  5. Touches should only be honored if they were not the end of a drag
     */
    $(document).on("click touchend mouseover", function (evt) {
        var i, sentinel = false,
            $theToggle = $(evt.target),
            $theTarget,
            tgtStatus,
            tgtState,
            $btnParent = $theToggle.parents().filter("[data-toggle='offcanvas']"),
            skipToggle = false,
            hoverMin = $("body").data("offcanvas-hover-min"),
            toggleOptions,
            hasEligibleTouches;

        logger(evt.type);

        focus_click_inquiry = false;

        if (hoverMin === undefined) {
            hoverMin = 0;
        }

        if (evt.type === "mouseover") {
            if ($(window).width() < hoverMin) {
                return;
            }
        }

        if ($theToggle.data("toggle") !== "offcanvas" && $btnParent.length > 0) { //Fixup hits on child text, graphical bits, etc
            $theToggle = $btnParent;
        }

        if (($openTarget === null || $openTarget === undefined || $openTarget.length === 0) && $theToggle.data("toggle") !== "offcanvas") {
            return;
        }

        if (evt.type !== "mouseover" && isInDebounce) {
            logger("Processed event (debounced)");
            evt.preventDefault();
            return;
        }
        
        //Check if any of our touches were actually drags so we can ignore em
        if (evt.type === "touchend") {
            hasEligibleTouches = testAndPruneTouchList(evt.originalEvent.changedTouches);
            
            if (!hasEligibleTouches) {
                logger("Ignoring touch event as it is the result of a drag");
                return;
            }
        }

        toggleOptions = $theToggle.data("toggle-options");
        if (toggleOptions !== undefined) {
            toggleOptions = toggleOptions.split(" ");
        } else {
            toggleOptions = [];
        }

        if (evt.type === "mouseover" && toggleOptions.indexOf("nohover") > -1) {
            logger("Not opening a no-hover toggle");
            return;
        }
        
        //Used to allow using the <a>nchor portion of a dropdown toggle
        //but only after it was opened using a mouse
        if ($(window).width() >= hoverMin &&
                $theToggle[0].tagName === "A" &&
                evt.type === "click" &&
                !target_has_touch &&
                !click_keydown_inquiry && //and event is not generated by a keyboard
                toggleOptions.indexOf("nohover") === -1 &&
                toggleOptions.indexOf("nohref") === -1) {

            logger("Allowing link to resolve instead of opening toggle");
            return;
        }

        click_keydown_inquiry = false; //clear the "click event was generated by
                                     //a keyboard event" flag so the user can
                                     //switch back to mouse input
        
        if ($openTarget !== null && $openTarget !== undefined && $openTarget.length > 0) {
            //Determine if it's okay to do anything that might dismiss an offcanvas
            //based on this event
            tgtState = $openTarget.data("offcanvas-state");
            if (tgtState === undefined) {
                //This step is needed if the offcanvas elements were deleted and
                //recreated behind our back (e.g. because PageTransitions). In that
                //case all we can do is drop the current $openTarget entirely.
                $openTarget = undefined;
            }
        }
        
        if ($theToggle.data("toggle") === "offcanvas") {
            $theTarget = initOffcanvasToggle($theToggle);
            findParentLevels($theTarget);
        }

        if (!eventCanDismissOffcanvas($openTarget, $theTarget, evt, $theToggle)) {
            return;
        }
        
        logger("Processed event");
        
        if ($openTarget !== null &&
                $openTarget !== undefined &&
                $openTarget.length > 0 &&
                !$.contains($openTarget[0], evt.target) &&
                $openTarget[0] !== evt.target) {
            
            //Dismiss offcanvas by clicking outside it's area
            if ("#" + $openTarget.attr("id") === $theToggle.data("target")) {
                skipToggle = true;
            }
            
            if ($theToggle.filter("[data-dismiss='offcanvas']").length > 0) {
                logger("Not overridding a click on an existing dismiss button just because the click handler happened to win a race condition");
            } else {
                logger(tgtState.toggleOptions);
                logger(toggleOptions);

                enableDebounce();

                if ($($theToggle.data("target"))[0] === $openTarget[0]) {
                    //If we have clicked on a toggle for the currently open offcanvas, eat the event
                    evt.preventDefault();
                    evt.stopPropagation();
                    evt.stopImmediatePropagation();
                }

                dismissOffcanvas($openTarget);
            }
        }

        if ($theTarget !== undefined && !skipToggle) { //Open offcanvas via a toggle link
            enableDebounce();

            tgtState = $theTarget.data("offcanvas-state");

            //Determine if a different offcanvas tree is active, and, if so, dismiss it first.
            while ($openTarget !== null && $openTarget !== undefined) {
                sentinel = $openTarget[0] === $theTarget[0];

                for (i = 0; i < tgtState.parents.length; i += 1) {
                    if ($openTarget[0] === tgtState.parents[i]) {
                        sentinel = true;
                        break;
                    }
                }

                if (sentinel) {
                    break;
                }

                dismissOffcanvas($openTarget);
            }

            if (tgtState.open) {
                dismissOffcanvas($theTarget);
            } else {
                openOffcanvas($theTarget, $theToggle, evt.type);
            }

            if ($theToggle[0].tagName.toLowerCase() === "a" || $theToggle[0].tagName.toLowerCase() === "button") {
                evt.preventDefault();
            }
        }
    });
    
    /* Another, slightly less complex event handler for dismissing open content
     */
    $(document).on("click touchend", function (evt) {
        var $theToggle = $(evt.target), $theTarget, tgtStatus, tgtState, $btnParent = $theToggle.parents().filter("[data-dismiss='offcanvas']"), skipToggle = false, i, sentinel = false, $toDismiss = $openTarget;

        if ($theToggle.data("dismiss") !== "offcanvas" && $btnParent.length > 0) { //Fixup hits on child text, graphical bits, etc
            $theToggle = $btnParent;
        }

        if ($theToggle.data("dismiss") !== "offcanvas") {
            return;
        }

        if (isInDebounce) {
            logger("Processed event (debounced)");
            evt.preventDefault();
            return;
        }

        enableDebounce();

        if ($theToggle.data("target") !== undefined) {
            $toDismiss = $($theToggle.data("target"));
        }

        if ($toDismiss.length > 0) {
            dismissOffcanvas($toDismiss);
        }
        
        evt.preventDefault();
    });

    module.isOffcanvas = isOffcanvas;
    module.isChildOffcanvas = isChildOffcanvas;
    module.isTopLevelOffcanvas = isTopLevelOffcanvas;
    module.initOffcanvas = initOffcanvas;
    module.initOffcanvasToggle = initOffcanvasToggle;
    module.dismissOpenOffcanvas = dismissOpenOffcanvas;
    module.openOffcanvas = openOffcanvas;
    module.dismissOffcanvas = dismissOffcanvas;
    module.enableDebounce = enableDebounce;
    module.switchLoggingMode = switchLoggingMode;

    return module;
}));
;window.HUEMOR = window.HUEMOR || {};

window.HUEMOR.HJFPageTransitionRegion = function ($, Behaviors, PageTransition) {
    "use strict";

    /**
     * Subclass/customization of `PageTransitionRegion` that also handles
     * Beaver Builder CSS.
     */
    function HJFPageTransitionRegion() {
        Behaviors.init(HJFPageTransitionRegion, this, arguments);

        if (window.location.pathname === "/" || window.location.pathname === "/home-b/") {
            this.transition_done();
        } else {
            this.transition_in().then(function () {
                this.transition_done();
            }.bind(this));
        }
    }

    Behaviors.inherit(HJFPageTransitionRegion, PageTransition.PageTransitionRegion);

    HJFPageTransitionRegion.QUERY = "[data-hjf-pagetransition-region]";

    /**
     * Copy head content (such as the title, or Beaver Builder CSS) into this
     * page.
     * 
     * This extends the superclass's `replace_head` method.
     * 
     * @param {window.jQuery} $new_document The document being replaced in,
     * without restriction to the region that is being replaced
     */
    HJFPageTransitionRegion.prototype.replace_head = function ($new_document) {
        PageTransition.PageTransitionRegion.prototype.replace_head.apply(this, arguments);

        var $head = $("head"),
            $new_css = $new_document.filter("link[rel='stylesheet'], style, script");

        $new_css.each(function (index, sheet_elem) {
            var $sheet_elem = $(sheet_elem),
                id = $sheet_elem.attr("id");

            if (id) {
                $("#" + id).remove();
            }
        });

        $head.append($new_css);
    }

    /**
     * Simulate navigation to a new page by animating out, downloading the
     * page, injecting it into the current document, and then animating in.
     * 
     * This implementation removes the simulation step: we instead animate out
     * and just navigate to the new page. This guarantees that all JavaScript
     * will reset and get the events it expects, at the expense of every page
     * needing to start in the loading state and then animate themselves in.
     * 
     * This function returns a Promise that will probably not resolve, as the
     * page load will now obliterate all existing event loop tasks.
     * 
     * @param {string} url The URL to simulate navigation to
     * @param {bool} isPopState If we're going backwards.
     */
    HJFPageTransitionRegion.prototype.retrieve_document_by_url = function(url, isPopState) {
        return this.transition_out().then(function () {
            window.location = url;

            return this.transition_loading();
        }.bind(this));
    }

    /**
     * Determine what kind of link a particular element is.
     * 
     * This is an improvement upon the base PageTransitionRegion impl that
     * tries to catch a handful of broken WordPress behaviors that misuse
     * anchors as buttons.
     * 
     * @param {string} url The URL to navigate to
     * @param {window.jQuery} $a The link that was clicked
     * @returns One of the PageTransitionRegion constants, either
     * `LINK_INTERNAL`, `LINK_EXTERNAL`, `LINK_POPUP`, or `LINK_HASH`.
     */
    HJFPageTransitionRegion.prototype.is_internal_link = function(url, $a) {
        if (url === undefined) {
            return PageTransition.PageTransitionRegion.LINK_HASH;
        }

        return PageTransition.PageTransitionRegion.prototype.is_internal_link.apply(this, arguments);
    }

    Behaviors.register_behavior(HJFPageTransitionRegion);

    return HJFPageTransitionRegion;
}(window.jQuery, window.Behaviors, window.PageTransition);;(function ($) {
  $(function () {
    var Shuffle = window.Shuffle;
    if (Shuffle) {
      console.log('alive 2');
    } else {
      console.log('dead 2');
    }
    var element = document.querySelector('.shuffle-container');
    if (!element) return;
    
    var sizer = element.querySelector('.sizer');

    var shuffleInstance = new Shuffle(element, {
      itemSelector: '.post-item',
      sizer: sizer, 
    });
    $('#all').on('click', function () {
      shuffleInstance.filter();
    });
    $('#btn-one').on('click', function () {
      shuffleInstance.filter('one');
    });
    $('#btn-two').on('click', function () {
      shuffleInstance.filter('two');
    });
  });
})(jQuery);

window.HUEMOR = window.HUEMOR || {};

(window.HUEMOR.PPFDropdown = function ($, Behaviors) {
  /**
   * Project Post Feed Dropdown
   * 
   * Apologies if I've already written this code.
   */
  function PPFDropdown() {
    Behaviors.init(PPFDropdown, this, arguments);

    this.open = false;

    this.$toggles = this.$elem.siblings().filter("[data-projectpostfeed-dropdowntoggle]");

    this.$toggles.on("click", this.dropdown_toggle_intent.bind(this));
    this.$elem.on("blur", this.focus_lost_intent.bind(this));
    this.update_dropdown_state();
  }

  Behaviors.inherit(PPFDropdown, Behaviors.Behavior);

  PPFDropdown.QUERY = "[data-projectpostfeed-dropdown]";

  /**
   * Event handler for clicking the dropdown toggle.
   */
  PPFDropdown.prototype.dropdown_toggle_intent = function() {
    this.open = !this.open;

    this.update_dropdown_state();
  }

  /**
   * Function to be called whenever dropdown state changes.
   */
  PPFDropdown.prototype.update_dropdown_state = function () {
    if (this.open) {
      this.$elem.addClass("is-ProjectPostFeed-filter_dropdown--open");
      this.$elem.removeClass("is-ProjectPostFeed-filter_dropdown--closed");
      this.$toggles.addClass("is-ProjectPostFeed-filter_dropdown_toggle--open");
      this.$toggles.removeClass("is-ProjectPostFeed-filter_dropdown_toggle--closed");
    } else {
      this.$elem.addClass("is-ProjectPostFeed-filter_dropdown--closed");
      this.$elem.removeClass("is-ProjectPostFeed-filter_dropdown--open");
      this.$toggles.removeClass("is-ProjectPostFeed-filter_dropdown_toggle--open");
      this.$toggles.addClass("is-ProjectPostFeed-filter_dropdown_toggle--closed");
    }
  }

  PPFDropdown.prototype.focus_lost_intent = function () {
    this.open = false;

    this.update_dropdown_state();
  }

  Behaviors.register_behavior(PPFDropdown);

  return PPFDropdown;
}(window.jQuery, window.Behaviors));;window.HUEMOR = window.HUEMOR || {};
window.HUEMOR.HUEROICalculator = (function ($, Behaviors) {
    "use strict";

    /**
     * Behavior associated with the ROI Calculator module.
     */
    function HUEROICalculator() {
        Behaviors.init(HUEROICalculator, this, arguments);

        this.$elem.on("submit", this.submit_intent.bind(this));

        // These are the input variables.
        this.$inputs = this.$elem.find("[data-roicalculator-input]");
        this.validate_input(); //attach validators

        // This is where output variables go to.
        this.$results = this.$elem.find("[data-roicalculator-results]");
    }

    Behaviors.inherit(HUEROICalculator, Behaviors.Behavior);

    HUEROICalculator.QUERY = "[data-roicalculator]";

    /**
     * Update function that takes the projection parameters and calculates a
     * result.
     * 
     * @param {Object} input Input parsed via `retrieve_input`.
     * @returns {Object} The results to be presented via `present_results`
     */
    HUEROICalculator.prototype.update_projection = function(input) {
        var currentConversionRate = input.currentConversionRate,
            monthlyTraffic = input.monthlyTraffic,
            averageOrderValue = input.averageOrderValue,
            conversionRateImprovement = input.conversionRateImprovement,
            investment = input.investment,
            output = {};

        output.beforeConversionRate = currentConversionRate;
        output.beforeConversionsPerMonth = monthlyTraffic * output.beforeConversionRate;
        output.beforeMonthlyOnlineRevenue = output.beforeConversionsPerMonth * averageOrderValue;

        output.afterConversionRate = currentConversionRate + conversionRateImprovement;
        output.afterConversionsPerMonth = monthlyTraffic * output.afterConversionRate;
        output.afterMonthlyOnlineRevenue = output.afterConversionsPerMonth * averageOrderValue;

        output.sixMonthsRevenueBefore = output.beforeMonthlyOnlineRevenue * 6;
        output.sixMonthsRevenueAfter = output.afterMonthlyOnlineRevenue * 6;
        output.sixMonthsInvestment = investment * 6;
        output.sixMonthsRevenueNet = output.sixMonthsRevenueAfter - output.sixMonthsRevenueBefore - output.sixMonthsInvestment;
        output.sixMonthsRoi = output.sixMonthsRevenueNet / output.sixMonthsInvestment;

        output.oneYearRevenueBefore = output.beforeMonthlyOnlineRevenue * 12;
        output.oneYearRevenueAfter = output.afterMonthlyOnlineRevenue * 12;
        output.oneYearInvestment = investment * 12;
        output.oneYearRevenueNet = output.oneYearRevenueAfter - output.oneYearRevenueBefore - output.oneYearInvestment;
        output.oneYearRoi = output.oneYearRevenueNet / output.oneYearInvestment;

        output.threeYearsRevenueBefore = output.beforeMonthlyOnlineRevenue * 36;
        output.threeYearsRevenueAfter = output.afterMonthlyOnlineRevenue * 36;
        output.threeYearsInvestment = investment * 36;
        output.threeYearsRevenueNet = output.threeYearsRevenueAfter - output.threeYearsRevenueBefore - output.threeYearsInvestment;
        output.threeYearsRoi = output.threeYearsRevenueNet / output.threeYearsInvestment;

        return output;
    }

    /**
     * Attach validation functions for all marked inputs.
     */
    HUEROICalculator.prototype.validate_input = function () {
        this.$inputs.each(function (index, input_elem) {
            var $input = $(input_elem);

            function validator(evt) {
                var raw_value = $input.val(), value, float_value,
                    formatting = $input.data("roicalculator-format");
                    
                if (formatting == "percent") {
                    value = raw_value.replace(",", "");
                    float_value = parseFloat(value);

                    if (value === float_value + "%") {
                        evt.target.setCustomValidity("");
                    } else if (value + "" === float_value + "") {
                        evt.target.setCustomValidity(""); //value without percentage
                    } else {
                        evt.target.setCustomValidity("Please enter a valid percentage");
                    }
                } else if (formatting == "money.USD") {
                    value = raw_value.replace(",", "");
                    float_value = parseFloat(value.replace("$", ""));

                    if (value === "$" + float_value) {
                        evt.target.setCustomValidity("");
                    } else {
                        evt.target.setCustomValidity("Please enter a valid dollar amount");
                    }
                } else {
                    value = raw_value.replace(",", "");
                    float_value = parseInt(value);

                    if (value === float_value + "") {
                        evt.target.setCustomValidity("");
                    } else {
                        evt.target.setCustomValidity("Please enter a valid number");
                    }
                }
            }

            function autoformat() {
                var raw_value = $input.val(), value, float_value,
                    formatting = $input.data("roicalculator-format");
                    
                if (formatting == "percent") {
                    value = raw_value.replace(",", "");
                    float_value = parseFloat(value);

                    if (value + "" === float_value + "") {
                        $input.val(raw_value + "%");
                    }
                }
            }

            $input.on("input", validator.bind(this));
            $input.on("blur", autoformat.bind(this));
            validator.call(this, {"target": $input[0]});
        }.bind(this));
    }

    /**
     * Retrieve all input form field values, pre-parsed.
     * 
     * @returns {Object} The output values, keyed by name.
     */
    HUEROICalculator.prototype.retrieve_input = function() {
        var output = {};

        this.$inputs.each(function (index, input_elem) {
            var $input = $(input_elem),
                key = $input.attr("name"),
                raw_value = $input.val(),
                formatting = $input.data("roicalculator-format");
                
            if (formatting == "percent") {
                output[key] = parseFloat(raw_value.replace(",", "")) / 100;
            } else if (formatting == "money.USD") {
                output[key] = parseFloat(raw_value.replace(",", "").replace("$", ""));
            } else {
                output[key] = parseInt(raw_value.replace(",", ""));
            }
        });

        return output;
    }

    /**
     * Present results to the user.
     * 
     * @param {Object} output The output, as an "associative array" style
     * object.
     */
    HUEROICalculator.prototype.present_results = function(output) {
        var $result_fields = this.$results.find("[data-roicalculator-result]");

        $result_fields.html("");

        $result_fields.each(function (index, result_elem) {
            var $result_elem = $(result_elem),
                key = $result_elem.data("roicalculator-result"),
                formatting = $result_elem.data("roicalculator-format"),
                value = output[key];

            if (formatting == "percent") {
                $result_elem.text((value * 100).toFixed(1) + "%");
            } else if (formatting == "money.USD") {
                $result_elem.text(value.toLocaleString(undefined, {style: 'currency', currency: 'USD', maximumFractionDigits: 0}));
            } else if (formatting == "ratio") {
                $result_elem.text(value.toFixed(1) + " : 1");
            } else {
                $result_elem.text(value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));
            }
        });
    }

    /**
     * Event handler for submitting the form.
     * 
     * @param {Event|jQuery.Event} e A jQuery-normalized or DOM Event object that can be
     * prevent-defaulted
     */
    HUEROICalculator.prototype.submit_intent = function(e) {
        var input = this.retrieve_input();
        e.preventDefault();
        this.present_results(this.update_projection(input));
        
        $("html, body").animate({
            scrollTop: this.$results.offset().top - 100,
        }, 1000);
    }

    Behaviors.register_behavior(HUEROICalculator);

    return HUEROICalculator;
}(window.jQuery, window.Behaviors));;window.HUEMOR = window.HUEMOR || {};

window.HUEMOR.HUEROICalculatorTooltip = (function($, Behaviors) {
    "use strict";

    /**
     * Add a tooltip to the page.
     */
    function ROICalculatorTooltip() {
        Behaviors.init(ROICalculatorTooltip, this, arguments);

        this.is_visible = false;
        this.is_focused = false;
        this.direction = "up";

        this.$contents = $("<div></div>");
        this.$contents.addClass("ROICalculator-tooltip_contents");
        this.$contents.append(this.$elem.contents());
        this.$elem.append(this.$contents);

        this.$button = $("<button></button>");
        this.$button.attr("type", "button");
        this.$button.addClass("ROICalculator-tooltip_button");
        this.$elem.append(this.$button);

        this.update_state();
        $(window).on("resize scroll", this.window_change_intent.bind(this));
        this.$button.on("focus", this.button_focus_intent.bind(this));
        this.$button.on("mouseenter", this.button_mouseenter_intent.bind(this));
        this.$button.on("blur", this.button_blur_intent.bind(this));
        this.$button.on("mouseleave", this.button_mouseleave_intent.bind(this));
    }

    Behaviors.inherit(ROICalculatorTooltip, Behaviors.Behavior);

    ROICalculatorTooltip.QUERY = "[data-roicalculator-tooltip]";

    ROICalculatorTooltip.prototype.update_state = function() {
        var base_position, contents_width, button_width, is_left_constrained,
            is_right_constrained, contents_height, is_top_constrained;

        if (this.is_visible) {
            this.$contents.addClass("is-ROICalculator--active");
            this.$contents.removeClass("is-ROICalculator--inactive");

            //We need to unconstrain the contents before we measure the width.
            this.$contents.removeClass("is-ROICalculator--left_constrained");
            this.$contents.removeClass("is-ROICalculator--right_constrained");
            this.$contents.css("left", "auto");
            this.$contents.css("right", "auto");

            base_position = this.$elem.offset();
            contents_width = this.$contents.width();
            button_width = this.$button.width();

            is_left_constrained = (base_position.left - contents_width / 2 + button_width / 2) < 0;
            is_right_constrained = (base_position.left + contents_width / 2 + button_width / 2) > ($(window).width() - 30);

            if (is_left_constrained) {
                this.$contents.addClass("is-ROICalculator--left_constrained");
                this.$contents.css("left", (base_position.left * -1));
            } else {
                this.$contents.removeClass("is-ROICalculator--left_constrained");
                this.$contents.css("left", "");
            }
            
            if (is_right_constrained) {
                this.$contents.addClass("is-ROICalculator--right_constrained");
                this.$contents.css("right", ($(window).width() - 30 - base_position.left - button_width) * -1);
            } else {
                this.$contents.removeClass("is-ROICalculator--right_constrained");
                this.$contents.css("right", "");
            }

            contents_height = this.$contents.height();
            is_top_constrained = (base_position.top - contents_height) < ($(window).scrollTop() + 150);
            if (is_top_constrained) {
                this.$contents.addClass("is-ROICalculator--top_constrained");
            } else {
                this.$contents.removeClass("is-ROICalculator--top_constrained");
            }

            this.$button.addClass("is-ROICalculator--active");
            this.$button.removeClass("is-ROICalculator--inactive");
        } else {
            this.$contents.addClass("is-ROICalculator--inactive");
            this.$contents.removeClass("is-ROICalculator--active");
            this.$contents.removeClass("is-ROICalculator--left_constrained");
            this.$contents.removeClass("is-ROICalculator--right_constrained");
            this.$contents.css("left", "");
            this.$contents.css("right", "");
            this.$contents.removeClass("is-ROICalculator--top_constrained");

            this.$button.addClass("is-ROICalculator--inactive");
            this.$button.removeClass("is-ROICalculator--active");
        }
    }

    /**
     * Event handler that triggers whenever the window geometry or scroll
     * changes.
     * 
     * It mainly exists to ensure that tooltip positioning stays put whenever
     * any state that the tooltip positioning relies upon changes. If there's
     * no tooltip currently open we don't update state.
     */
    ROICalculatorTooltip.prototype.window_change_intent = function() {
        if (this.is_visible) {
            this.update_state();
        }
    }

    /**
     * Event handler that triggers whenever the button is focused or entered.
     */
    ROICalculatorTooltip.prototype.button_focus_intent = function() {
        this.is_visible = true;
        this.is_focused = true;
        this.update_state();
    }

    /**
     * Event handler that triggers whenever the button is entered.
     */
    ROICalculatorTooltip.prototype.button_mouseenter_intent = function() {
        this.is_visible = true;
        this.update_state();
    }

    /**
     * Event handler that triggers whenever the button is blurred or left.
     */
    ROICalculatorTooltip.prototype.button_blur_intent = function() {
        this.is_visible = false;
        this.is_focused = false;
        this.update_state();
    }

    /**
     * Event handler that triggers whenever the button is left.
     */
    ROICalculatorTooltip.prototype.button_mouseleave_intent = function() {
        if (!this.is_focused) {
            this.is_visible = false;
        }

        this.update_state();
    }

    Behaviors.register_behavior(ROICalculatorTooltip);

    return ROICalculatorTooltip;
}(window.jQuery, window.Behaviors));;/*global window, define, Promise*/

(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define("ScrollEffects", ["jquery", "Behaviors", "AtlasPlayer", "Animations"], factory);
    } else {
        root.ScrollEffects = factory(root.jQuery, root.Behaviors, root.AtlasPlayer, root.Animations);
    }
}(this, function ($, Behaviors, AtlasPlayer, Animations) {
    "use strict";

    var module = {};

    function ScrollEffects(elem) {
        Behaviors.init(ScrollEffects, this, arguments);

        this.$elem = $(elem);
        this.$scrollCtxt = $(window); //TODO: Allow CSS overflow scrolling
        
        this.scrollHandler = this.on_scroll_intent.bind(this);

        this.$scrollCtxt.on("scroll", this.scrollHandler);
        
        this.has_load_animation = $(elem).data("scrolleffects-loadanimation") !== undefined;
    }

    Behaviors.inherit(ScrollEffects, Behaviors.Behavior);

    ScrollEffects.QUERY = "[data-scrolleffects]";
    ScrollEffects.THROTTLE_TIMEOUT = 200;
    
    /* Deinitialize our scroll handler if needed.
     */
    ScrollEffects.prototype.deinitialize = function () {
        this.$scrollCtxt.off("scroll", this.scrollHandler);
    };
    
    /* Return a list of all available scroll effect modes on this bit.
     */
    ScrollEffects.prototype.activation_modes = function () {
        return this.$elem.data("scrolleffects").split(" ");
    };

    ScrollEffects.prototype.update_css_classes = function () {
        var activation_modes = this.activation_modes(),
            active = false;

        if (this.isTopVisible && activation_modes.indexOf("top_visible") !== -1) {
            active = true;
        }

        if (this.isBottomVisible && activation_modes.indexOf("bottom_visible") !== -1) {
            active = true;
        }

        if (this.isVisible && activation_modes.indexOf("visible") !== -1) {
            active = true;
        }

        if (this.onceTopVisible && activation_modes.indexOf("top_visible_once") !== -1) {
            active = true;
        }

        if (this.onceBottomVisible && activation_modes.indexOf("bottom_visible_once") !== -1) {
            active = true;
        }

        if (this.onceVisible && activation_modes.indexOf("visible_once") !== -1) {
            active = true;
        }

        if (active) {
            this.$elem.addClass("is-ScrollEffects--active");
            this.$elem.removeClass("is-ScrollEffects--inactive");
        } else {
            this.$elem.removeClass("is-ScrollEffects--active");
            this.$elem.addClass("is-ScrollEffects--inactive");
        }
        
        if (this.loaded) {
            this.$elem.removeClass("is-ScrollEffects--unloaded");
            this.$elem.addClass("is-ScrollEffects--loaded");
        } else {
            this.$elem.addClass("is-ScrollEffects--unloaded");
            this.$elem.removeClass("is-ScrollEffects--loaded");
        }
    };

    ScrollEffects.prototype.on_scroll_intent = function () {
        var top = this.$elem.offset().top,
            height = this.$elem.height(),
            bottom = top + height,
            contextOffset = this.$scrollCtxt.offset(),
            contextScrollTop = contextOffset !== undefined
                                ? contextOffset.top + this.$scrollCtxt.scrollTop()
                                : this.$scrollCtxt.scrollTop(),
            contextHeight = this.$scrollCtxt.height(),
            contextScrollBottom = contextScrollTop + contextHeight;

        this.isTopVisible = contextScrollTop <= top && top <= contextScrollBottom;
        this.isBottomVisible = contextScrollTop <= bottom && bottom <= contextScrollBottom;
        this.isVisible = this.isTopVisible || this.isBottomVisible
            || (top <= contextScrollTop && contextScrollTop <= bottom)
            || (top <= contextScrollBottom && contextScrollBottom <= bottom);

        this.onceTopVisible = this.onceTopVisible || this.isTopVisible;
        this.onceBottomVisible = this.onceBottomVisible || this.isBottomVisible;
        this.onceVisible = this.onceVisible || this.isVisible;

        this.top = top;
        this.bottom = bottom;
        this.contextScrollTop = contextScrollTop;
        this.contextScrollBottom = contextScrollBottom;

        this.update_css_classes();
    };

    Behaviors.register_behavior(ScrollEffects);

    function ScrollAlax() {
        Behaviors.init(ScrollAlax, this, arguments);

        this.$layers = this.$elem.find("li");
        this.$atlasplayers = this.$elem.find(AtlasPlayer.AtlasPlayer.QUERY);
        this.atlasplayers = AtlasPlayer.AtlasPlayer.find_markup(this.$atlasplayers);
        
        this.depth = this.$elem.height() * -0.5;

        if (this.$elem.data('scrollalax-depthrange') === 'outside') {
            this.anim_scale = 1;
        } else {
            this.anim_scale = -1;
        }

        this.weights = this.weight_layers(this.$layers);

        this.on_scroll_intent();
        
        this.loaded = false;
        this.minimum_load_time = this.$elem.data("scrollalax-loadmin");
        this.load().then(this.on_loaded.bind(this));
        
        this.load_animation_playing = this.has_load_animation;
        
        if (this.has_load_animation) {
            this.load_animation_watcher = new Animations.AnimationWatcher(this.$elem);
            this.load_animation_watcher.promise.then(this.on_load_animation_complete.bind(this));
        } else {
            this.on_load_animation_complete();
        }
    }

    Behaviors.inherit(ScrollAlax, ScrollEffects);

    ScrollAlax.QUERY = "[data-scrollalax]";

    /* Determine the weights of each layer on the parallax group. */
    ScrollAlax.prototype.weight_layers = function ($layers) {
        var min = Infinity, max = -Infinity, w = [];

        $layers.each(function (index, elem) {
            var depth = $(elem).data("scrollalax-depth");

            if (min > depth) {
                min = depth;
            }

            if (max < depth) {
                max = depth;
            }
        }.bind(this));

        $layers.each(function (index, elem) {
            var depth = $(elem).data("scrollalax-depth");

            if (this.anim_scale === -1) {
                w.push(-1 + (depth - min) / (max - min));
            } else {
                w.push((depth - min) / (max - min));
            }
        }.bind(this));

        return w;
    };

    /* Calculate X or Y positions of a layer. */
    ScrollAlax.prototype.apply_transform_css = function (style, index, xPct, yPct) {
        var pct_Xdrag = this.weights[index] * xPct * this.anim_scale,
            pct_Ydrag = this.weights[index] * yPct * this.anim_scale,
            xDisp = this.depth * pct_Xdrag * this.anim_scale,
            yDisp = this.depth * pct_Ydrag * this.anim_scale;

        //style.left = xDisp + "px";
        //style.top = yDisp + "px";

        style.transform = "translate3D(" + xDisp + "px, " + yDisp + "px, 0px)";
    };

    /* Update the scroll animation. */
    ScrollAlax.prototype.update_css_classes = function (evt) {
        var pct_down = Math.max(Math.min((this.contextScrollTop - this.top) / this.$elem.height(), 1.0), 0.0);
        
        this.$layers.each(function (index, layer_elem) {
            var $layer_elem = $(layer_elem);

            this.apply_transform_css(layer_elem.style, index, 0, pct_down);
        }.bind(this));

        this.$elem.removeClass("is-ScrollEffects--indeterminate");
        
        if (this.loaded && !this.load_animation_playing) {
            this.$elem.removeClass("is-ScrollEffects--unloaded");
            this.$elem.addClass("is-ScrollEffects--loaded");
        } else {
            this.$elem.addClass("is-ScrollEffects--unloaded");
            this.$elem.removeClass("is-ScrollEffects--loaded");
        }
    };
    
    /**
     * Ensure all layers have their images loaded.
     * 
     * Returns a promise that resolves when all images in all layers have
     * loaded.
     */
    ScrollAlax.prototype.load = function () {
        var promises = [];
        
        if (this.minimum_load_time > 0) {
            promises.push(new Promise (function (resolve) {
                window.setTimeout(resolve, this.minimum_load_time * 1000);
            }.bind(this)));
        }
        
        this.$layers.each(function (index, layer_elem) {
            var $backgrounds = $(layer_elem).find("[style*='background-image']"),
                $images = $(layer_elem).find("img[src]");
            
            $backgrounds.each(function (index, bgelem) {
                var src = $(bgelem).css("background-image").slice(5, -2);
                
                promises.push(new Promise(function (resolve) {
                    $("<img/>").attr("src", src).on('load', function () {
                        $(this).remove();
                        resolve();
                    }).on('error', function () {
                        //This should be reject, but some browsers will
                        //spuriously fire error if the image was cached instead
                        //of firing load. This is a workaround.
                        $(this).remove();
                        resolve();
                    });
                }.bind(this)));
            }.bind(this));
            
            $images.each(function (index, imgelem) {
                var src = $(imgelem).attr("src");
                
                promises.push(new Promise(function (resolve) {
                    $("<img/>").attr("src", src).on('load', function () {
                        $(this).remove();
                        resolve();
                    }).on('error', function () {
                        //This should be reject, but some browsers will
                        //spuriously fire error if the image was cached instead
                        //of firing load. This is a workaround.
                        $(this).remove();
                        resolve();
                    });
                }.bind(this)));
            }.bind(this));
        });
        
        return Promise.all(promises);
    };
    
    ScrollAlax.prototype.on_loaded = function () {
        var i = 0;

        for (i = 0; i < this.atlasplayers.length; i += 1) {
            this.atlasplayers[i].seek(0);
            this.atlasplayers[i].stop();
        }
        
        this.loaded = true;
        this.update_css_classes();
        
        if (!this.load_animation_playing) {
            if (this.has_load_animation) {
                this.unload_animation_watcher = new Animations.AnimationWatcher(this.$elem);
                this.unload_animation_watcher.promise.then(this.on_unload_animation_complete.bind(this));
            } else {
                this.on_unload_animation_complete();
            }
        }
    };
    
    ScrollAlax.prototype.on_load_animation_complete = function () {
        this.load_animation_playing = false;
        this.update_css_classes();
        
        if (this.loaded) {
            if (this.has_load_animation) {
                this.unload_animation_watcher = new Animations.AnimationWatcher(this.$elem);
                this.unload_animation_watcher.promise.then(this.on_unload_animation_complete.bind(this));
            } else {
                this.on_unload_animation_complete();
            }
        }
    };
    
    ScrollAlax.prototype.on_unload_animation_complete = function () {
        var i = 0;

        for (i = 0; i < this.atlasplayers.length; i += 1) {
            this.atlasplayers[i].seek(0);
            this.atlasplayers[i].play();
        }
    };

    Behaviors.register_behavior(ScrollAlax);

    module.ScrollEffects = ScrollEffects;
    module.ScrollAlax = ScrollAlax;

    return module;
}));
;(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define("accountslidein", ["jquery", "betteroffcanvas"], factory);
    } else {
        // Browser globals
        root.accountslidein = factory(root.jQuery, root.betteroffcanvas);
    }
}(this, function ($, betteroffcanvas) {
    "use strict";
    "feel good";

    $('.Account_slide-login--button').click(function(){
        $(this).hide();
        $('.Account_slide-form--password').removeClass('Account_slide-form--visible')
        $('.Account_slide-form--login').addClass('Account_slide-form--visible');
        return false;
    });

    $('.Account_slide-password_recovery').click(function(){
        $('.Account_slide-login--button').show();
        $('.Account_slide-form--login').removeClass('Account_slide-form--visible');
        $('.Account_slide-form--password').addClass('Account_slide-form--visible');
        return false;
    });


    $('.Account_slide-close').click(function(){
        betteroffcanvas.dismissOffcanvas($('#SiteHeader-accounts'));
    });
}));
;(function ($) {
    /**
     * Attempt to latch onto every mobile menu toggle on the site and provide a
     * class to it's target element so it knows when it's actually open.
     */
    $(document).ready(function () {
        $("button.fl-menu-mobile-toggle").each(function (index, btn_elem) {
            var $btn_elem = $(btn_elem),
                $node = $btn_elem.parents().filter(".fl-module-menu[data-node]"),
                node_id;

            if ($node.length > 0) {
                node_id = $node.data("node");

                $btn_elem.on("click", function (evt) {
                    window.setTimeout(function () {
                        var $clone = $(".fl-menu-mobile-clone[data-node='" + node_id + "']");

                        $clone.toggleClass("is-SiteHeader--mobile_nav_active");
                    }, 50);
                })
            }
        });
    });
})(jQuery);

(function ($) {

    function setHeaderClasses() {
        // var parent = document.querySelector('.fl-page-content').querySelector(".fl-builder-content");
        // var rows = childrenMatches(parent, '.fl-row');
        // for(var i = 0; i < rows.length; i++){
        //     var row = childrenMatches(rows[i], ".fl-row-content-wrap")[0];
        //     var color = window.getComputedStyle(row).backgroundColor;
        //     var img = window.getComputedStyle(row).backgroundImage;
        //     var substrStart = color[3] === "a" ? 5 : 4;
        //     var rgb = color.substring(substrStart, color.length - 1).replace(/ /g, '').split(',');
        //     console.log(img);
        //     if(rgb.length === 4 && rgb[3] === "0"){
        //         row.parentElement.classList.add("lightSection");
        //     }else{
        //         var r = rgb[0] * 0.241, g = rgb[1] * 0.691, b = rgb[2] * 0.068;
        //         var brightness = r + g + b;
        //         if(brightness < 112 || img === 'none'){
        //             console.log('dark?');
        //             row.parentElement.classList.add("darkSection");
        //         }else{
        //             console.log('light?');
        //             row.parentElement.classList.add("lightSection");
        //         }
        //     }
        // }
        var topRow = document.querySelector(".fl-page-content").querySelector('.fl-row');
        var row = topRow.querySelector(".fl-row-content-wrap");
        var color = window.getComputedStyle(row).backgroundColor;
        var img = window.getComputedStyle(row).backgroundImage;
        var substrStart = color[3] === "a" ? 5 : 4;
        var rgb = color.substring(substrStart, color.length - 1).replace(/ /g, '').split(',');
        var r = rgb[0] * 0.241, g = rgb[1] * 0.691, b = rgb[2] * 0.068;
        var brightness = r + g + b;
        if (img !== 'none') {
            $("header").addClass("lightHeader");
            $("header").removeClass("darkHeader");
        } else if (rgb.length === 4 && rgb[3] === "0" && img === 'none') {
            $("header").removeClass("lightHeader");
            $("header").addClass("darkHeader");
        } else if (brightness < 112) {
            $("header").addClass("lightHeader");
        } else {
            $("header").addClass("darkHeader");
        }
    }


    function checkHeader() {
        var dS = $(".darkSection");
        var lS = $(".lightSection");
        $.each(dS, function () {
            if ($(this).offset().top - $(window).scrollTop() < 52 && $(this).offset().top + $(this).height() - $(window).scrollTop() > 52) {
                $("header").addClass('lightHeader');
                $("header").removeClass('darkHeader');
            }
        })
        $.each(lS, function () {
            if ($(this).offset().top - $(window).scrollTop() < 52 && $(this).offset().top + $(this).height() - $(window).scrollTop() > 52) {
                $("header").addClass('darkHeader');
                $("header").removeClass('lightHeader');
            }
        })

    }

    var childrenMatches = function (elem, selector) {
        return Array.prototype.filter.call(elem.children, function (child) {
            return child.matches(selector);
        });
    };
    // function createDefault(){
    //     var img = document.createElement("img");
    //     img.setAttribute("class", 'defaultImage');
    //     img.setAttribute("src", "/wp-content/uploads/2019/10/085563.png");
    //     var menu = document.querySelector(".mega-menu").querySelector(".sub-menu");
    //     menu.appendChild(img);
    // }
    $(window).on('load', function () {
        setHeaderClasses();
        console.log('wth');
        setTimeout(checkHeader, 100);
        // createDefault();
    })

    // $(window).on('scroll', function(){
    //     checkHeader();
    // })
    var $ = jQuery;
    var nav = document.getElementById("navContainer");
    // var bkg = document.createElement("div");

    // bkg.setAttribute("class", "navBackground");
    // nav.appendChild(bkg);

    var c = 0, scrollPos = 0,
        navHeight = $("#navMenu").height(),
        scrollUp = 0,
        scrollDown = 0,
        navHidden = false,
        mOver = false;

    function handleNavScroll() {
        var sPos = $(window).scrollTop();
        scrollPos = sPos;
        scrollDif = c - sPos;
        //   if(sPos <= 0){
        //       $(".navBackground").removeClass('scrolled');
        //   }else{
        //       $(".navBackground").addClass('scrolled');
        //   }
        if (scrollPos <= 50) {
            $("#navContainer").find(".fl-row-content-wrap").addClass('topHeader');
        } else {
            $("#navContainer").find(".fl-row-content-wrap").removeClass('topHeader');
        }
        // if(c < scrollPos && sPos > navHeight + navHeight){
        //     if(scrollDown <= -50){
        //         navHidden = true;
        //             if(!mOver){
        //                 $("#navContainer").find(".fl-row-content-wrap").addClass('scrollUp');
        //             }
        //         //   $(".navBackground").addClass('scrollUp');
        //     }
        //         scrollDown += scrollDif;
        //         scrollUp = 0;
        // }else if(c > scrollPos && !(sPos <= navHeight)){
        //     if(scrollUp >= 50){
        //         if(!mOver){
        //             navHidden = false;
        //             $("#navContainer").find(".fl-row-content-wrap").removeClass('scrollUp');
        //         }
        //         //   $(".navBackground").removeClass('scrollUp');
        //     }
        //     scrollUp += scrollDif;
        //     scrollDown = 0;
        // }
        c = scrollPos;
    }
    nav.addEventListener("mouseover", function (e) {
        // e.stopImmediatePropagation();
        if (navHidden) {
            mOver = true;
            $("#navContainer").find(".fl-row-content-wrap").removeClass('scrollUp');
            // $(".navBackground").removeClass('scrollUp');
        }
    });
    nav.addEventListener("mouseout", function (e) {
        // e.stopImmediatePropagation();
        if (navHidden) {
            mOver = false;
            $("#navContainer").find(".fl-row-content-wrap").addClass('scrollUp');
            // $(".navBackground").addClass('scrollUp');
        }
    });
    handleNavScroll();
    window.addEventListener("scroll", handleNavScroll);
})(jQuery);



//convert wordpress main menu image to new alternative huemor menu banner
($ => {
    let featuredPost = $('.alternateMenu-featuredPost');
    featuredPost.each(function () {
        if ($(this).length) {
            let imgSrc = $(this).find('img').attr('src');
            $(this).find('a').css("background-image", "url(" + imgSrc + ")");
            $(this).find('img').remove();
            $(this).find('span').append('<i class="dashicons dashicons-before dashicons-arrow-right-alt" data-icon="dashicons dashicons-before dashicons-arrow-right-alt"></i>');
        }
    });

})(jQuery);;(function($){
    var logoPath = '/wp-content/themes/beaverwarrior/components/SiteHeader/logo.json';
    var position = $(window).scrollTop(); 

    /**
     * Load a logo into it's container.
     * 
     * @param {HTMLElement} svgContainer The HTML element to stick the logo into.
     */
    function start_logo(svgContainer) {
        var sTop, logoHidden = false,
            animation = {
                container: svgContainer,
                renderer: 'svg',
                loop: false,
                autoplay: false,
                path: logoPath
            },
            anim = lottie.loadAnimation(animation);
        
        function logoSlideIn() {
            anim.playSegments([0,50], true);

            return logoHidden= true;
        }

        function logoSlideOut() {
            anim.playSegments([100,200], true);

            return logoHidden = false;
        }
        
        if ($(window).scrollTop() <= 1) {
            sTop = true;
        }

        $(window).scroll(function() {
            var scroll = $(window).scrollTop();
            if(scroll <= 1){
                sTop = true;
            }else{
                sTop = false;
            }
            // if viewport is at top of window display header and logo is hidden slide out logo
            if( scroll <= 1 && logoHidden == true){
                logoSlideOut();
            }
    
            if(scroll > position) {
                //on scroll down slide in logo unless the header is being hovered
                if ($('header').is(':hover')){

                } else if(logoHidden == false)  {
                
                    logoSlideIn();
                }

            }

            position = scroll;
        });

        var header = document.querySelector("header");


        header.onmouseenter = function(){
            if(logoHidden){
                $(".huemorCol").addClass("mOver");
                $("#navMenu").addClass("mOver");
                $("#navContainer").find(".fl-row-content-wrap").addClass('mOver');
                logoSlideOut();
            }
        };

        header.onmouseleave = function(){
            if(!logoHidden && !sTop){
                logoSlideIn();
                setTimeout(function(){
                    $(".huemorCol").removeClass("mOver");
                    $("#navMenu").removeClass("mOver");
                    $("#navContainer").find(".fl-row-content-wrap").removeClass('mOver');
                }, 500)
            }
        }

    }

    $(document).ready(function(){
        var svgContainer = document.getElementById('logoSVGContainer');
        var mobileSvgContainer = document.getElementById('logoSVGContainerMobile');

        start_logo(svgContainer);
        start_logo(mobileSvgContainer);
    });
})(jQuery);;(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define("siteheader", ["jquery", "betteroffcanvas"], factory);
    } else {
        // Browser globals
        root.siteheader = factory(root.jQuery, root.betteroffcanvas);
    }
}(this, function ($, betteroffcanvas, ajaxCart, Handlebars) {
    "use strict";
    "feel good";

    function update_scroll() {
        var scrollTop = $(window).scrollTop(),
            $SiteHeader = $("[data-siteheader='siteheader']");

        if (scrollTop === 0) {
            $SiteHeader.addClass("is-SiteHeader--at_top");
            $SiteHeader.removeClass("is-SiteHeader--scrolled");
        } else {
            $SiteHeader.removeClass("is-SiteHeader--at_top");
            $SiteHeader.addClass("is-SiteHeader--scrolled");
        }
    };

    $(window).on("scroll", update_scroll);

    update_scroll();
}));
;(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define("StaffGrid", ["jquery", "Behaviors"], factory);
    } else {
        root.StaffGrid = factory(root.jQuery, root.Behaviors);
    }
}(this, function ($, Behaviors) {
    "use strict";

    var module = {};
    
    function StaffGridSlider() {
        Behaviors.init(StaffGridSlider, this, arguments);
        
        this.$elem.slick({
            prevArrow: this.$elem.find('[data-staffgrid-prev]'),
            nextArrow: this.$elem.find('[data-staffgrid-next]')
        });
    }
    
    Behaviors.inherit(StaffGridSlider, Behaviors.Behavior);
    
    StaffGridSlider.QUERY = "[data-staffgrid-slider]";
    
    StaffGridSlider.prototype.goto = function (id, animate) {
        this.$elem.slick('slickGoTo', id, animate);
    }
    
    function StaffGridModal() {
        Behaviors.init(StaffGridModal, this, arguments);
        
        this.slider = StaffGridSlider.locate(this.$elem.find('[data-staffgrid-slider]'));
        this.$elem.on("offcanvas-open", this.modal_reveal_intent.bind(this));
    }
    
    Behaviors.inherit(StaffGridModal, Behaviors.Behavior);
    
    StaffGridModal.QUERY = "[data-staffgrid-modal]";
    
    StaffGridModal.prototype.modal_reveal_intent = function (evt) {
        var slideIndex = $(evt.originalEvent.toggle).data('staffgrid-slider-index');
        
        this.slider.goto(slideIndex, true);
    };
    
    Behaviors.register_behavior(StaffGridModal);
    Behaviors.register_behavior(StaffGridSlider);
    
    module.StaffGridModal = StaffGridModal;
    module.StaffGridSlider = StaffGridSlider;
    
    return module;
}));
;/*global define, console, document, window*/
(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define("TabbedContent", ["jquery", "Behaviors"], factory);
    } else {
        root.TabbedContent = factory(root.jQuery, root.Behaviors);
    }
}(this, function ($, Behaviors) {
    "use strict";

    var module = {};

    function $do(that, target) {
        return function () {
            target.apply(that, arguments);
        };
    }

    function TabbedContentRegion(elem) {
        Behaviors.init(TabbedContentRegion, this, arguments);

        this.$elem = $(elem);
        this.id = this.$elem.attr("id");
        this.active = this.$elem.data("tabbedcontent-region-active") !== undefined;

        this.links = [];

        this.reflect_status();
    }

    Behaviors.inherit(TabbedContentRegion, Behaviors.Behavior);

    TabbedContentRegion.QUERY = "[data-tabbedcontent-region]";

    TabbedContentRegion.prototype.reflect_status = function (status) {
        var i;

        if (status === undefined) {
            status = this.active;
        }

        if (status) {
            this.$elem.addClass("is-TabbedContent--active");
            this.$elem.removeClass("is-TabbedContent--inactive");
        } else {
            this.$elem.removeClass("is-TabbedContent--active");
            this.$elem.addClass("is-TabbedContent--inactive");
        }

        for (i = 0; i < this.links.length; i += 1) {
            if (status) {
                this.links[i].addClass("is-TabbedContent--target_active");
                this.links[i].removeClass("is-TabbedContent--target_inactive");
            } else {
                this.links[i].removeClass("is-TabbedContent--target_active");
                this.links[i].addClass("is-TabbedContent--target_inactive");
            }
        }
    };

    TabbedContentRegion.prototype.add_incoming_link = function ($li) {
        this.links.push($li);
    };

    function TabbedContentSet(elem) {
        Behaviors.init(TabbedContentSet, this, arguments);

        this.$elem = $(elem);

        this.tabset_name = this.$elem.attr("data-tabbedcontent-set");
        if (this.tabset_name === undefined) {
            this.tabset_name = this.$elem.attr("id");
        }

        this.tab_members = {};
        this.list = [];

        this.find_links();
    }

    Behaviors.inherit(TabbedContentSet, Behaviors.Behavior);

    TabbedContentSet.QUERY = "[data-tabbedcontent-set]";

    TabbedContentSet.prototype.new_tab = function (id) {
        var $elem = $("#" + id);

        if ($elem.length === 0) {
            return false;
        }

        if (this.tab_members[id] === undefined) {
            this.tab_members[id] = {
                "toggles": [],
                "content": TabbedContentRegion.locate($elem)
            };
        }

        return true;
    };

    TabbedContentSet.prototype.set_active_tab = function (id) {
        var k;

        for (k in this.tab_members) {
            if (this.tab_members.hasOwnProperty(k)) {
                this.tab_members[k].content.active = k === id;
                this.tab_members[k].content.reflect_status();
            }
        }
    };

    TabbedContentSet.prototype.navigate_tab_intent = function (id, evt) {
        this.set_active_tab(id);

        if (evt) {
            evt.preventDefault();
        }
    };

    TabbedContentSet.prototype.import_list_item = function (li) {
        var $li = $(li),
            $link = $li.find("a"),
            href = $link.attr("href"),
            id;

        if ($link.length === 0) {
            return;
        }

        if (href.indexOf("#") !== -1) {
            id = href.slice(1);
        }

        if (id === undefined) {
            return;
        }

        if (this.tab_members[id] === undefined && !this.new_tab(id)) {
            return;
        }

        this.list.push({
            "li": $li,
            "id": id
        });
        this.tab_members[id].content.add_incoming_link($li);
        this.tab_members[id].content.reflect_status();
        $link.on("touchend click", this.navigate_tab_intent.bind(this, id));
    };

    TabbedContentSet.prototype.find_links = function () {
        var that = this;

        this.$elem.find("li").each(function (index, elem) {
            return that.import_list_item(elem);
        });
    };

    Behaviors.register_behavior(TabbedContentSet);

    module.TabbedContentSet = TabbedContentSet;

    return module;
}));
;/*jslint continue: true, es5: true*/
/*global detectZoom, console, jQuery, define, Float32Array, Uint16Array*/
(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define("UTM", ["jquery", "Behaviors"], factory);
    } else {
        root.UTM = factory(root.jQuery, root.Behaviors);
    }
}(this, function ($, Behaviors) {
    "use strict";
    var module = {},
        utm_variables = {},
        wanted_vars = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    
    function utm_preserve_enabled() {
        return $("body").data("utmpreserve-preserve") !== false;
    }
    
    function utm_forminject_enabled() {
        return $("body").data("utmpreserve-forminject") !== false;
    }

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
    }

    /* Given a query string, return an object whose keys are matched UTM vars.
     */
    function look_for_utm_variables() {
        var new_utm_variables = {}, i;

        for (i = 0; i < wanted_vars.length; i += 1) {
            new_utm_variables[wanted_vars[i]] = getQueryVariable(wanted_vars[i]);
        }

        return new_utm_variables;
    }

    function do_utm_replace($context) {
        if (!utm_preserve_enabled()) {
            console.log("UTM preserve is disabled.");
            return;
        }
        
        utm_variables = look_for_utm_variables();

        $context.find("a[href]").each(function (index, elem) {
            var k, $elem = $(elem),
                old_href = $elem.attr("href");

            for (k in utm_variables) {
                if (utm_variables.hasOwnProperty(k) && utm_variables[k] !== undefined) {
                    if (old_href.indexOf("?") !== -1) {
                        old_href = old_href + "&" + k + "=" + utm_variables[k];
                    } else {
                        old_href = old_href + "?" + k + "=" + utm_variables[k];
                    }
                }
            }

            $elem.attr("href", old_href);
        })
    }
    
    function do_gform_insertion(evt, form_id, current_page) {
        var $form = $("#gform_" + form_id), i, k,
            old_action = $form.attr("action");
        
        if (!utm_forminject_enabled()) {
            console.log("UTM form injection is disabled.");
            return;
        }
        
        utm_variables = look_for_utm_variables();
        
        //Remove any existing query vars.
        //TODO: should we bother preserving old vars that aren't UTMs?
        old_action = old_action.split("?")[0];
        
        //Add UTM variables as seen by the client.
        for (k in utm_variables) {
            if (utm_variables.hasOwnProperty(k) && utm_variables[k] !== undefined) {
                if (old_action.indexOf("?") !== -1) {
                    old_action = old_action + "&" + k + "=" + utm_variables[k];
                } else {
                    old_action = old_action + "?" + k + "=" + utm_variables[k];
                }
            }
        }
        
        $form.attr("action", old_action);
        
        //We can't auto-insert UTM variables into hidden fields, so instead we
        //replace by hidden values.
        $form.find("input[type='hidden']").each(function (index, ielem) {
            var $ielem = $(ielem), old_value = $ielem.attr("value"), new_key;

            if (old_value.startsWith("replace_param[") && old_value.endsWith("]")) {
                new_key = old_value.split("[")[1].split("]")[0];
                $ielem.val(utm_variables[new_key]);
            }
        })
    }
    
    $(document).bind("gform_post_render", do_gform_insertion);
    
    Behaviors.register_content_listener(do_utm_replace);
    
    module.do_utm_replace = do_utm_replace;
    module.look_for_utm_variables = look_for_utm_variables;
    module.getQueryVariable = getQueryVariable;
    
    return module;
}));
;/*global define, window, document, Promise*/
(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define("VideoPlayer", ["jquery", "Behaviors"], factory);
    } else {
        root.VideoPlayer = factory(root.jQuery, root.Behaviors);
    }
}(this, function ($, Behaviors) {
    "use strict";

    var module = {};

    function VideoPlayer(elem) {
        Behaviors.init(VideoPlayer, this, arguments);

        this.$elem = $(elem);
        
        if (this.ready) {
            this.ready().then(this.locate_children.bind(this));
        } else {
            this.locate_children();
        }
    }

    Behaviors.inherit(VideoPlayer, Behaviors.Behavior);

    /* Returns a promise which resolves when the player is ready to accept
     * other API calls.
     *
     * Calling those other API calls outside of a then() block from the promise
     * returned by this function is a good way to have a bad time.
     *
     * By default, the video player is always ready.
     */
    VideoPlayer.prototype.ready = function () {
        return new Promise(function (resolve, reject) {
            resolve();
        });
    };

    //No QUERY is defined for the base VideoPlayer class as it is not intended
    //to be locatable. Derived classes should locate their VideoPlayer subclass
    //once it's attendant APIs have been loaded.
    //VideoPlayer.QUERY = "";

    VideoPlayer.prototype.locate_children = function () {
        var $parent_modal, $parent_hover;
        
        this.playpause = VideoPlayer_playpause.find_markup(this.$elem, this);
        this.scrubbers = VideoPlayer_scrubber.find_markup(this.$elem, this);
        this.mute_btns = VideoPlayer_mute.find_markup(this.$elem, this);
        
        //This is an example of how to locate upwards
        $parent_modal = this.$elem.parents().filter(VideoPlayer_offcanvas.QUERY);
        
        if ($parent_modal.length > 0) {
            this.modal = VideoPlayer_offcanvas.locate($parent_modal[0], this);
        }
        
        $parent_hover = this.$elem.parents().filter(VideoPlayer_hover.QUERY);
        
        if ($parent_hover.length > 0) {
            this.hover = VideoPlayer_hover.locate($parent_hover[0], this);
        }
        
        //Now see if we're supposed to autoplay...
        if (this.$elem.data("videoplayer-autoplay") !== undefined) {
            this.play();
        }
        
        if (this.$elem.data("videoplayer-loop") !== undefined) {
            this.add_statechange_listener(this.loopcheck.bind(this));
        }
    };
    
    VideoPlayer.prototype.loopcheck = function () {
        Promise.all([this.is_paused(), this.get_current_time(), this.get_duration()]).then(function (values) {
            var is_paused = values[0];
            var current_time = values[1];
            var duration = values[2];
            
            if (current_time === duration) {
                this.seek(0);
                this.play();
            }
        }.bind(this));
    };

    /* Determine if the video player is active.
     *
     * Most keyboard events only process on the active video's controls, not
     * other videos. This ensures that you can have multiple VideoPlayers
     * running without them all being controlled by the same limited set of
     * keyboard shortcuts.
     *
     * A video player is active if any of the following apply:
     *
     *  - The video is marked primary with [data-videoplayer-primary].
     *  - The video is currently playing.
     *  - The VideoPlayer element or one of it's children has keyboard focus.
     * 
     * This function returns a promise which resolves to the return value.
     */
    VideoPlayer.prototype.is_active = function () {
        return this.is_paused(function (is_paused) {
            if (this.$elem.data("videoplayer-primary") !== undefined) {
                return true;
            }

            if (!is_paused) {
                return true;
            }

            if (this.$elem.find(":focus").length > 0) {
                return true;
            }

            return false;
        }.bind(this));
    };

    /* Serves as a play/pause button for a connected VideoPlayer.
     */
    function VideoPlayer_playpause(elem, parent) {
        var that = this;

        Behaviors.init(VideoPlayer_playpause, that, arguments);

        that.parent = parent;

        that.parent.ready().then(function () {
            that.parent.add_statechange_listener(that.on_statechange.bind(that));
            that.$elem.on("click touchend", that.on_play_intent.bind(that));

            that.update_css_classes();
        });
    }

    Behaviors.inherit(VideoPlayer_playpause, Behaviors.Behavior);

    VideoPlayer_playpause.QUERY = "[data-videoplayer-playpause]";

    VideoPlayer_playpause.prototype.update_css_classes = function () {
        this.parent.is_paused().then(function (is_paused) {
            if (is_paused) {
                this.$elem.addClass("is-VideoPlayer--paused");
                this.$elem.removeClass("is-VideoPlayer--playing");
            } else {
                this.$elem.removeClass("is-VideoPlayer--paused");
                this.$elem.addClass("is-VideoPlayer--playing");
            }
        }.bind(this));
    };

    VideoPlayer_playpause.prototype.toggle_playback = function () {
        this.parent.is_paused().then(function (is_paused) {
            if (is_paused) {
                this.parent.play();
            } else {
                this.parent.pause();
            }
        }.bind(this));
    };

    VideoPlayer_playpause.prototype.on_statechange = function () {
        this.update_css_classes();
    };

    VideoPlayer_playpause.prototype.on_play_intent = function () {
        this.toggle_playback();
    };

    /* Allows a video modal to be started and stopped as the modal is opened
     * and closed.
     * 
     * Place this on the Offcanvas element that gets dismissed and/or opened.
     */
    function VideoPlayer_offcanvas(elem, parent) {
        var that = this;

        Behaviors.init(VideoPlayer_offcanvas, that, arguments);

        that.parent = parent;

        that.$elem.on("offcanvas-open", that.on_open_intent.bind(that));
        that.$elem.on("offcanvas-dismiss", that.on_dismiss_intent.bind(that));
    }

    Behaviors.inherit(VideoPlayer_offcanvas, Behaviors.Behavior);

    VideoPlayer_offcanvas.QUERY = "[data-videoplayer-offcanvas]";

    VideoPlayer_offcanvas.prototype.on_open_intent = function () {
        var that = this;

        that.parent.is_paused().then(function (is_paused) {
            if (is_paused) {
                that.parent.play();
            }
        });
    };

    VideoPlayer_offcanvas.prototype.on_dismiss_intent = function () {
        var that = this;

        that.parent.is_paused().then(function (is_paused) {
            if (!is_paused) {
                that.parent.pause();
            }
        });
    };

    /* Allows a video modal to be started and stopped based on the hover state
     * of an element. Won't work on mobile.
     * 
     * Place this on the element that gets hovered.
     */
    function VideoPlayer_hover(elem, parent) {
        var that = this;

        Behaviors.init(VideoPlayer_hover, that, arguments);

        that.parent = parent;

        that.$elem.on("mouseenter", that.on_hover_intent.bind(that));
        that.$elem.on("mouseleave", that.on_leave_intent.bind(that));
    }

    Behaviors.inherit(VideoPlayer_hover, Behaviors.Behavior);

    VideoPlayer_hover.QUERY = "[data-videoplayer-hover]";

    VideoPlayer_hover.prototype.on_hover_intent = function () {
        var that = this;

        that.parent.is_paused().then(function (is_paused) {
            if (is_paused) {
                that.parent.play();
            }
        });
    };

    VideoPlayer_hover.prototype.on_leave_intent = function () {
        var that = this;

        that.parent.is_paused().then(function (is_paused) {
            if (!is_paused) {
                that.parent.pause();
            }
        });
    };

    /* Serves as a scrub bar for a connected VideoPlayer.
     *
     * A Scrubber contains additional elements inside of it that do not have an
     * associated behavior:
     *
     *  - [data-videoplayer-scrubberfill]: The filled range of the scrubber.
     *  - [data-videoplayer-scrubberknob]: A knob which indicates the current
     *     scrubber point.
     */
    function VideoPlayer_scrubber(elem, parent) {
        var err, that = this;

        Behaviors.init(VideoPlayer_scrubber, that, arguments);

        that.parent = parent;

        //EVENT STATE VARIABLES
        that.is_dragging = false;
        that.in_debounce = false;

        //OPTIONAL COMPONENTS
        that.$scrubfill = that.$elem.find("[data-videoplayer-scrubberfill]");
        that.$scrubknob = that.$elem.find("[data-videoplayer-scrubberknob]");

        that.parent.ready().then(function () {
            //EVENT HANDLERS
            that.$elem.on("mousedown touchstart", that.on_dragstart_intent.bind(that));
            that.$elem.on("mousemove touchmove", that.on_drag_intent.bind(that));
            $(document).on("mouseup touchend touchcancel", that.on_dragend_intent.bind(that));
            $(document).on("keydown", that.on_keyboard_nav.bind(that));

            err = that.parent.add_timeupdate_listener(that.on_timeupdate.bind(that));
            if (err === false) {
                window.setInterval(that.on_timeupdate.bind(that), 1000);
            }
        });

        that.update_scrubber();
    }

    Behaviors.inherit(VideoPlayer_scrubber, Behaviors.Behavior);

    VideoPlayer_scrubber.QUERY = "[data-videoplayer-scrubber]";

    VideoPlayer_scrubber.prototype.css_percent = function (value) {
        return (value * 100) + "%";
    };

    /* This defines the dynamic CSS properties that are applied to scrubber
     * elements.
     *
     * Specifically, fills get a width equal to the current play percentage;
     * knobs get a left position equal to the current play percentage.
     *
     * This assumes knobs and fills get positioned relative to the scrubber.
     */
    VideoPlayer_scrubber.prototype.update_scrubber = function () {
        var that = this, currentTime, ratio;
        
        that.parent.ready().then(function () {
            return that.parent.get_current_time();
        }.bind(this)).then(function (newCurrentTime) {
            currentTime = newCurrentTime;
            return that.parent.get_duration();
        }.bind(this)).then(function (duration) {
            ratio = 0;

            if (!isFinite(duration)) {
                //Livestreams always show as complete.
                ratio = 1;
            } else if (!isNaN(duration)) {
                ratio = currentTime / duration;
            }

            that.$scrubfill.css("width", that.css_percent(ratio));
            that.$scrubknob.css("left", that.css_percent(ratio));
        });
    };

    /* Given an X coordinate, calculate the corresponding video seek time and
     * return it.
     *
     * Input is in page co-ordinates. Input is scaled to output based on the
     * CSS width and position of the scrubber. Output is bounded within the
     * closed range [0, 1].
     * 
     * Returns a promise with the correct seek time.
     */
    VideoPlayer_scrubber.prototype.mouse_to_ctime = function (page_x) {
        return this.parent.get_duration().then(function (duration) {
            return (page_x - this.$elem.offset().left) / this.$elem.width() * duration;
        }.bind(this));
    };

    /* Seek the parent player, but only if the proposed new time is valid.
     */
    VideoPlayer_scrubber.prototype.seek_if_valid = function (newTime, isFinal) {
        if (isNaN(newTime) || !isFinite(newTime)) {
            return;
        }

        this.parent.seek(newTime, isFinal);
    };

    // Drag event filtering

    /* Start a drag operation; configuring the event filtering machinery to
     * only recognize the click or touch that started the event chain.
     */
    VideoPlayer_scrubber.prototype.start_drag = function (evt) {
        this.is_dragging = true;

        if (evt.changedTouches !== undefined && evt.changedTouches.length > 0) {
            this.drag_touch_id = evt.changedTouches[0].identifier;
            return evt.changedTouches[0].pageX;
        } else {
            this.drag_touch_id = undefined;
            return evt.pageX;
        }
    };

    /* Retrieves the Page X coordinate from an event, ensuring that the correct
     * finger is tracked across the entire event chain.
     *
     * Events will be ignored, and FALSE returned, if the event type that
     * started the drag does not match the given event; or, if it's a touch
     * event type, it will be ignored if there is no touch matching the current
     * one.
     */
    VideoPlayer_scrubber.prototype.validate_drag = function (evt) {
        var i;

        if (this.is_dragging) {
            if (this.drag_touch_id !== undefined) {
                if (evt.changedTouches !== undefined) {
                    for (i = 0; i < evt.changedTouches.length; i += 1) {
                        if (evt.changedTouches[i].identifier === this.drag_touch_id) {
                            return evt.changedTouches[i].pageX;
                        }
                    }
                }
            } else {
                if (evt.changedTouches === undefined) {
                    return evt.pageX;
                }
            }
        }

        return false;
    };

    /* Retrieves the Page X coordinate from an event and turns off further drag
     * processing.
     *
     * For the same reasons as validate_drag, non-matching events will not
     * cancel drag processing. This function returns FALSE if this event was
     * ignored.
     */
    VideoPlayer_scrubber.prototype.end_drag = function (evt) {
        var px = this.validate_drag(evt);
        if (px === false) {
            return px;
        }

        this.is_dragging = false;
        this.drag_touch_id = undefined;

        return px;
    };

    /* Process a drag event given the incoming Page X.
     *
     * If FALSE is given, indicating an event filtered by validate_drag, this
     * does nothing.
     */
    VideoPlayer_scrubber.prototype.handle_drag = function (pageX, final) {
        var newtime;

        if (pageX === false) {
            return;
        }

        return this.mouse_to_ctime(pageX).then(function (newtime) {
            this.seek_if_valid(newtime, final);
            this.update_scrubber();
        }.bind(this));
    };

    // Event handlers

    VideoPlayer_scrubber.prototype.on_timeupdate = function () {
        this.update_scrubber();
    };

    VideoPlayer_scrubber.prototype.on_dragstart_intent = function (evt) {
        this.handle_drag(this.start_drag(evt), false);
    };

    VideoPlayer_scrubber.prototype.on_drag_intent = function (evt) {
        this.handle_drag(this.validate_drag(evt), false);
    };

    VideoPlayer_scrubber.prototype.on_dragend_intent = function (evt) {
        this.handle_drag(this.end_drag(evt), true);
    };

    VideoPlayer_scrubber.prototype.on_keyboard_nav = function (evt) {
        var currentTime;
        
        this.parent.ready().then(function () {
            return this.parent.get_current_time();
        }.bind(this)).then(function (newCurrentTime) {
            currentTime = newCurrentTime;
            return this.parent.is_active();
        }.bind(this)).then(function (is_active) {
            if (!is_active) {
                return;
            }
            
            if (evt.keyCode === 37) { //LEFT
                evt.preventDefault();
                this.parent.seek(currentTime - 1.0);
                this.update_scrubber();
            } else if (evt.keyCode === 39) { // RIGHT
                evt.preventDefault();
                this.parent.seek(currentTime + 1.0);
                this.update_scrubber();
            }
        });
    };

    /* Serves as a play/pause button for a connected VideoPlayer.
     */
    function VideoPlayer_mute(elem, parent) {
        var that = this;
        
        Behaviors.init(VideoPlayer_mute, that, arguments);

        that.parent = parent;

        that.parent.ready().then(function () {
            that.$elem.on("click touchend", that.on_mute_intent.bind(that));

            that.update_css_classes();
        });
    }

    Behaviors.inherit(VideoPlayer_mute, Behaviors.Behavior);

    VideoPlayer_mute.QUERY = "[data-videoplayer-mute]";

    VideoPlayer_mute.prototype.update_css_classes = function () {
        this.parent.is_muted().then(function (is_muted) {
            if (is_muted) {
                this.$elem.addClass("is-VideoPlayer--muted");
                this.$elem.removeClass("is-VideoPlayer--audible");
            } else {
                this.$elem.removeClass("is-VideoPlayer--muted");
                this.$elem.addClass("is-VideoPlayer--audible");
            }
        }.bind(this));
    };

    VideoPlayer_mute.prototype.toggle_mute = function () {
        this.parent.is_muted().then(function (is_muted) {
            if (is_muted) {
                this.parent.unmute();
            } else {
                this.parent.mute();
            }
        }.bind(this));
    };

    VideoPlayer_mute.prototype.on_mute_intent = function () {
        this.toggle_mute();
        this.update_css_classes();
    };

    // Player API adaptations


    /* Thin implementation for a VideoPlayer that consumes an HTML5 video
     * directly. Also provides a good demonstration that the VideoPlayer APIs
     * are a very thin wrapper over HTMLMediaElement.
     */
    function VideoPlayer__html5(elem) {
        this.$video = $(elem).find("video");

        Behaviors.init(VideoPlayer__html5, this, arguments);
    }

    Behaviors.inherit(VideoPlayer__html5, VideoPlayer);

    VideoPlayer__html5.QUERY = "[data-videoplayer='html5']";

    /* Plays the video, if loaded.
     */
    VideoPlayer__html5.prototype.play = function () {
        this.$video[0].play();
    };

    /* Pauses the video.
     */
    VideoPlayer__html5.prototype.pause = function () {
        this.$video[0].pause();
    };

    /* Mute the video
     */
    VideoPlayer__html5.prototype.mute = function () {
        this.$video[0].muted = true;
    };

    /* Unmute the video
     */
    VideoPlayer__html5.prototype.unmute = function () {
        this.$video[0].muted = false;
    };

    /* Returns the current player position.
     * 
     * This function returns a promise which resolves to the current time.
     */
    VideoPlayer__html5.prototype.get_current_time = function () {
        return Promise.resolve(this.$video[0].currentTime);
    };

    /* Seek the video to the number of seconds indicated in time.
     */
    VideoPlayer__html5.prototype.seek = function (time) {
        this.$video[0].currentTime = time;
    };

    /* Check the video's duration.
     *
     * Returns the media's length in seconds.
     *
     * NaN is returned if the duration is unknown (check with isNaN).
     * Infinity is returned if this is a streaming video.
     * 
     * This function returns a promise which resolves to the aformentioned
     * return value.
     */
    VideoPlayer__html5.prototype.get_duration = function () {
        return Promise.resolve(this.$video[0].duration);
    };

    /* Check if the video is paused.
     * 
     * This function returns a promise which resolves to the aformentioned
     * return value.
     */
    VideoPlayer__html5.prototype.is_paused = function () {
        return Promise.resolve(this.$video[0].paused);
    };

    /* Check if the video is muted.
     * 
     * This function returns a promise which resolves to the aformentioned
     * return value.
     */
    VideoPlayer__html5.prototype.is_muted = function () {
        return Promise.resolve(this.$video[0].muted);
    };

    /* Check the volume of the video.
     * 
     * This function returns a promise which resolves to the aformentioned
     * return value.
     */
    VideoPlayer__html5.prototype.get_volume = function () {
        return Promise.resolve(this.$video[0].volume);
    };

    /* Register an event handler for changes to the video's playback state.
     *
     * This corresponds exactly to matching the playing, play, and pause events
     * and other video service APIs should ensure their event handler triggers
     * on similar conditions.
     */
    VideoPlayer__html5.prototype.add_statechange_listener = function (listen) {
        this.$video.on("playing play pause", listen);
    };

    /* Register an event handler for changes to the video's playback time.
     *
     * This corresponds to the timeupdate event on HTMLMediaElement. This event
     * is permitted not to register an event if it returns FALSE, indicating
     * that timeupdates are not provided by this player type.
     */
    VideoPlayer__html5.prototype.add_timeupdate_listener = function (listen) {
        this.$video.on("timeupdate", listen);
    };

    /* This VideoPlayer consumes a YouTube iframe using the YouTube API.
     * See https://developers.google.com/youtube/iframe_api_reference
     */
    function VideoPlayer__youtube(elem) {
        var that = this;

        Behaviors.init(VideoPlayer__youtube, that, arguments);

        this.$iframe = $(elem).find("iframe");
        this.id = this.$iframe.attr("id");
        if (this.id === undefined) {
            //Randomly generate an ID if one was not provided.
            this.id = "VideoPlayer-random_id--" + Math.random() * 1024 * 1024;
            this.$iframe.attr("id", this.id);
        }

        this.player_fully_loaded = false;
    }

    Behaviors.inherit(VideoPlayer__youtube, VideoPlayer);

    VideoPlayer__youtube.QUERY = "[data-videoplayer='youtube']";

    /* Install the YouTube API, if not already installed.
     *
     * This is an asynchronous operation, so we return a Promise that resolves
     * when YouTube's API is available. Invocation works like so:
     *
     * VideoPlayer__youtube.api().then(function () {
     *     //do stuff...
     * })
     */
    VideoPlayer__youtube.api = function () {
        if (VideoPlayer__youtube.install_promise === undefined) {
            VideoPlayer__youtube.install_promise = new Promise(function (resolve, reject) {
                var tag, firstScriptTag;

                tag = document.createElement("script");
                tag.src = "https://www.youtube.com/iframe_api";
                firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                window.onYouTubeIframeAPIReady = VideoPlayer__youtube.api_ready_handler(resolve, reject);
            });
        }

        return VideoPlayer__youtube.install_promise;
    };

    /* Creates the function that gets called when the YouTube API is ready.
     */
    VideoPlayer__youtube.api_ready_handler = function (resolve, reject) {
        return function () {
            resolve();
        };
    };

    /* Returns a promise which resolves when the player is ready to accept
     * other API calls.
     *
     * Calling those other API calls outside of a then() block from the promise
     * returned by this function is a good way to have a bad time.
     */
    VideoPlayer__youtube.prototype.ready = function () {
        var that = this;
        
        if (that.ready_promise === undefined) {
            that.ready_promise = VideoPlayer__youtube.api().then(function () {
                that.player = new window.YT.Player(that.id, {
                    "playerVars": {
                        "enablejsapi": true
                    }
                });

                return new Promise(function (resolve, reject) {
                    if (that.player_fully_loaded) {
                        resolve();
                    } else {
                        that.player.addEventListener("onReady", function () {
                            that.player_fully_loaded = true;
                            resolve();
                        });
                    }
                });
            });
        }
        
        return that.ready_promise;
    };

    /* Plays the video, if loaded.
     */
    VideoPlayer__youtube.prototype.play = function () {
        this.ready().then(function () {
            this.player.playVideo();
        }.bind(this));
    };

    /* Pauses the video.
     */
    VideoPlayer__youtube.prototype.pause = function () {
        this.ready().then(function () {
            this.player.pauseVideo();
        }.bind(this));
    };

    /* Mute the video
     */
    VideoPlayer__youtube.prototype.mute = function () {
        this.ready().then(function () {
            this.player.mute();
        }.bind(this));
    };

    /* Unmute the video
     */
    VideoPlayer__youtube.prototype.unmute = function () {
        this.ready().then(function () {
            this.player.unMute();
        }.bind(this));
    };

    /* Returns the current player position.
     * 
     * This function returns a promise which resolves to the current time.
     */
    VideoPlayer__youtube.prototype.get_current_time = function () {
        return this.ready().then(function () {
            return this.player.getCurrentTime();
        }.bind(this));
    };

    /* Seek the video to the number of seconds indicated in time.
     *
     * The seek_commit parameter should be FALSE if and only if the seek
     * resulted from a mousedrag and you expect to get more seek operations.
     */
    VideoPlayer__youtube.prototype.seek = function (time, seek_commit) {
        return this.ready().then(function () {
            return this.player.seekTo(time, seek_commit);
        }.bind(this));
    };

    /* Check the video's duration.
     *
     * Returns the media's length in seconds.
     *
     * NaN is returned if the duration is unknown (check with isNaN).
     * Infinity is returned if this is a streaming video.
     *
     * SPEC VIOLATION: YouTube does not indicate if the player is playing a
     * live event, so live-streaming players will have incorrect duration info.
     * 
     * This function returns a promise which resolves to the aformentioned
     * return value.
     */
    VideoPlayer__youtube.prototype.get_duration = function () {
        return this.ready().then(function () {
            var duration = this.player.getDuration();

            if (duration === 0) {
                return NaN;
            }

            return duration;
        }.bind(this));
    };

    /* Check if the video is paused.
     *
     * TODO: We naively interpret YouTube's player state, does player state 2
     * correspond to HTMLMediaElement/VideoPlayer__html5's .paused attribute?
     * Or are there other player states that count as paused by HTML5?
     * 
     * This function returns a promise which resolves to the aformentioned
     * return value.
     */
    VideoPlayer__youtube.prototype.is_paused = function () {
        return this.ready().then(function () {
            var ps = this.player.getPlayerState();
            return ps === 2 || ps === -1 || ps === 5;
        }.bind(this));
    };

    /* Check if the video is muted.
     * 
     * This function returns a promise which resolves to the aformentioned
     * return value.
     */
    VideoPlayer__youtube.prototype.is_muted = function () {
        return this.ready().then(function () {
            return this.player.isMuted();
        }.bind(this));
    };

    /* Check the volume of the video.
     *
     * YouTube works in percentage units for some reason.
     * 
     * This function returns a promise which resolves to the aformentioned
     * return value.
     */
    VideoPlayer__youtube.prototype.get_volume = function () {
        return this.ready().then(function () {
            return this.player.getVolume() / 100;
        }.bind(this));
    };

    /* Register an event handler for changes to the video's playback state.
     *
     * This corresponds exactly to matching the playing, play, and pause events
     * and other video service APIs should ensure their event handler triggers
     * on similar conditions.
     */
    VideoPlayer__youtube.prototype.add_statechange_listener = function (listen) {
        this.ready().then(function () {
            this.player.addEventListener("onStateChange", listen);
        }.bind(this));
    };

    /* Register an event handler for changes to the video's playback time.
     *
     * YouTube doesn't have this event type for some reason.
     */
    VideoPlayer__youtube.prototype.add_timeupdate_listener = function (listen) {
        return false;
    };

    VideoPlayer__youtube.content_ready = function ($context) {
        var Class = this;

        if ($context.find(Class.QUERY).length > 0) {
            Class.api().then(function () {
                Class.find_markup($context);
            });
        }
    };
    
    /* This VideoPlayer consumes a Vimeo iframe using their player controller.
     * See https://github.com/vimeo/player.js
     */
    function VideoPlayer__vimeo(elem) {
        var that = this;

        Behaviors.init(VideoPlayer__vimeo, that, arguments);
        
        this.ready();
    }

    VideoPlayer__vimeo.QUERY = "[data-videoplayer='vimeo']";
    
    Behaviors.inherit(VideoPlayer__vimeo, VideoPlayer);
    
    /* Install the Vimeo API, if not already installed.
     *
     * This is an asynchronous operation, so we return a Promise that resolves
     * when Vimeo's API is available. Invocation works like so:
     *
     * VideoPlayer__vimeo.api().then(function () {
     *     //do stuff...
     * })
     */
    VideoPlayer__vimeo.api = function () {
        if (VideoPlayer__vimeo.install_promise === undefined) {
            VideoPlayer__vimeo.install_promise = new Promise(function (resolve, reject) {
                var tag, firstScriptTag;

                tag = document.createElement("script");
                tag.src = "https://player.vimeo.com/api/player.js";
                tag.onload = VideoPlayer__vimeo.api_ready_handler(resolve, reject);
                tag.async = true;
                firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            });
        }

        return VideoPlayer__vimeo.install_promise;
    };

    /* Creates the function that gets called when the Vimeo API is ready.
     */
    VideoPlayer__vimeo.api_ready_handler = function (resolve, reject) {
        function wait_for_vimeo() {
            if (window.Vimeo !== undefined) {
                resolve();
            } else {
                window.setTimeout(wait_for_vimeo, 10);
            }
        }
        
        return wait_for_vimeo;
    };
    
    /* Returns a promise which resolves when the player is ready to accept
     * other API calls.
     *
     * Calling those other API calls outside of a then() block from the promise
     * returned by this function is a good way to have a bad time.
     */
    VideoPlayer__vimeo.prototype.ready = function () {
        var that = this;
        
        if (this.ready_promise === undefined) {
            this.ready_promise = VideoPlayer__vimeo.api().then(function () {
                this.player = new window.Vimeo.Player(this.$elem);
            }.bind(this));
        }
        
        return this.ready_promise;
    };

    /* Plays the video, if loaded.
     */
    VideoPlayer__vimeo.prototype.play = function () {
        return this.ready().then(function () {
            this.player.play();
        }.bind(this));
    };

    /* Pauses the video.
     */
    VideoPlayer__vimeo.prototype.pause = function () {
        return this.ready().then(function () {
            this.player.pause();
        }.bind(this));
    };

    /* Mute the video
     */
    VideoPlayer__vimeo.prototype.mute = function () {
        return this.ready().then(function () {
            return this.player.getVolume();
        }.bind(this)).then(function (volume) {
            this.preMuteVolume = volume;
            this.player.setVolume(0);
        }.bind(this));
    };

    /* Unmute the video
     */
    VideoPlayer__vimeo.prototype.unmute = function () {
        return this.ready().then(function () {
            return this.player.setVolume(this.preMuteVolume || 1.0);
        }.bind(this));
    };

    /* Returns the current player position.
     * 
     * This function returns a promise which resolves to the current time.
     */
    VideoPlayer__vimeo.prototype.get_current_time = function () {
        return this.ready().then(function () {
            return this.player.getCurrentTime();
        }.bind(this));
    };

    /* Seek the video to the number of seconds indicated in time.
     *
     * The seek_commit parameter should be FALSE if and only if the seek
     * resulted from a mousedrag and you expect to get more seek operations.
     * 
     * As a unique quirk of the Vimeo API, the returned promise will resolve
     * to the actual seek time adopted by the player.
     */
    VideoPlayer__vimeo.prototype.seek = function (time, seek_commit) {
        return this.ready().then(function () {
            return this.player.setCurrentTime(time);
        }.bind(this));
    };

    /* Check the video's duration.
     *
     * Returns the media's length in seconds.
     *
     * NaN is returned if the duration is unknown (check with isNaN).
     * Infinity is returned if this is a streaming video.
     * 
     * This function returns a promise which resolves to the aformentioned
     * return value.
     */
    VideoPlayer__vimeo.prototype.get_duration = function () {
        return this.ready().then(function () {
            return this.player.getDuration();
        }.bind(this));
    };

    /* Check if the video is paused.
     * 
     * This function returns a promise which resolves to the aformentioned
     * return value.
     */
    VideoPlayer__vimeo.prototype.is_paused = function () {
        return this.ready().then(function () {
            return this.player.getPaused();
        }.bind(this));
    };

    /* Check if the video is muted.
     * 
     * This function returns a promise which resolves to the aformentioned
     * return value.
     */
    VideoPlayer__vimeo.prototype.is_muted = function () {
        return this.ready().then(function () {
            return this.get_volume();
        }.bind(this)).then(function (volume) {
            return volume === 0.0;
        }.bind(this));
    };

    /* Check the volume of the video.
     * 
     * This function returns a promise which resolves to the aformentioned
     * return value.
     */
    VideoPlayer__vimeo.prototype.get_volume = function () {
        return this.ready().then(function () {
            return this.player.getVolume();
        }.bind(this));
    };

    /* Register an event handler for changes to the video's playback state.
     *
     * This corresponds exactly to matching the playing, play, and pause events
     * and other video service APIs should ensure their event handler triggers
     * on similar conditions.
     */
    VideoPlayer__vimeo.prototype.add_statechange_listener = function (listen) {
        return this.ready().then(function () {
            this.player.on("play", listen);
            this.player.on("pause", listen);
            this.player.on("ended", listen);
        }.bind(this));
    };

    /* Register an event handler for changes to the video's playback time.
     */
    VideoPlayer__vimeo.prototype.add_timeupdate_listener = function (listen) {
        return this.ready().then(function () {
            return this.player.on("timeupdate", listen);
        }.bind(this));
    };
    
    VideoPlayer__vimeo.content_ready = function ($context) {
        var Class = this;

        if ($context.find(Class.QUERY).length > 0) {
            Class.api().then(function () {
                Class.find_markup($context);
            });
        }
    };

    Behaviors.register_behavior(VideoPlayer__html5);
    Behaviors.register_behavior(VideoPlayer__youtube);
    Behaviors.register_behavior(VideoPlayer__vimeo);
    
    module.VideoPlayer = VideoPlayer;
    module.VideoPlayer_playpause = VideoPlayer_playpause;
    module.VideoPlayer_scrubber = VideoPlayer_scrubber;
    module.VideoPlayer_mute = VideoPlayer_mute;
    module.VideoPlayer_offcanvas = VideoPlayer_offcanvas;
    module.VideoPlayer_hover = VideoPlayer_hover;
    module.VideoPlayer__html5 = VideoPlayer__html5;
    module.VideoPlayer__youtube = VideoPlayer__youtube;
    module.VideoPlayer__vimeo = VideoPlayer__vimeo;
    return module;
}));

//# sourceMappingURL=debug/script.js.map
