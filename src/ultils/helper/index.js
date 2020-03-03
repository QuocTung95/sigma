

const helper = {
    //extend object
    extendObject: Object.assign || function () {
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && typeof (target) !== "function") {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        if (length === i) {
            target = this;
            --i;
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (helper.isPlainObject(copy) || (copyIsArray = helper.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && helper.isArray(src) ? src : [];

                        } else {
                            clone = src && helper.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = helper.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    },
    //copy from jquery
    isPlainObject: function (obj) {
        var key;
        var class2type = {}, core_hasOwn = class2type.hasOwnProperty;

        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if (!obj || typeof (obj) !== "object" || obj.nodeType || (obj != null && obj == obj.window)) {
            return false;
        }

        try {
            // Not own constructor property must be Object
            if (obj.constructor &&
                !core_hasOwn.call(obj, "constructor") &&
                !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            // IE8,9 Will throw exceptions on certain host objects #9897
            return false;
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.
        for (key in obj) { }

        return key === undefined || core_hasOwn.call(obj, key);
    },
    setSessionData: function (key, content) {
        try {
            if (typeof (Storage) !== "undefined") {
                sessionStorage.setItem(key, content);
                return true;
            }
        } catch (e) {
            console.log(e);
            return false;
        }

    },

    getSessionData: function (key) {
        try {
            if (typeof (Storage) !== "undefined") {
                return sessionStorage.getItem(key);
            }
        } catch (e) {

        }

        return "";
    },

    removeSessionData: function (key) {
        try {
            if (typeof (Storage) !== "undefined") {
                sessionStorage.removeItem(key);
            }
        } catch (e) {

        }

        return false;
    },

    objectWithoutProperties: function (obj, keys) {
        var target = {};

        for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue;
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
            target[i] = obj[i];
        }

        return target;
    },
    isHTMLContent: function (str) {
        if (!str || str == "" || typeof str != "string")
            return false;

        var returnText = "" + str;
        //-- get rid of html-encoded characters:
        returnText = returnText.replace(/&lt;/gi, '<');
        returnText = returnText.replace(/&gt;/gi, '>');
        returnText = returnText.replace(/&#x3C;/gi, '<');
        returnText = returnText.replace(/&#x3E;/gi, '>');

        var a = document.createElement('div');
        a.innerHTML = returnText;

        for (var c = a.childNodes, i = c.length; i--;) {
            if (c[i].nodeType == 1) return true;
        }

        return false;
    }

};

export default helper;
    
(function (helper) {
    window.SIGMA = window.SIGMA || {};
    //window.IMS.Helper = helper();
})(function () {    
    return helper;
});