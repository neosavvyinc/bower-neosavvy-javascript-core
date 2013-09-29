/*! neosavvy-javascript-core - v0.1.0 - 2013-09-29
* Copyright (c) 2013 Neosavvy, Inc.; Licensed  */
var Neosavvy = Neosavvy || {};
Neosavvy.Core = Neosavvy.Core || {};
Neosavvy.Core.Builders = Neosavvy.Core.Builders || {};

/**
 * @class Neosavvy.Core.Builders.Collection
 * @constructor
 **/
Neosavvy.Core.Builders.CollectionBuilder = function (collection) {
    if (collection) {
        this.operations = {};
        this.collection = collection;
    } else {
        throw "You must pass in a collection as the base upon which to build!";
    }
};
Neosavvy.Core.Builders.CollectionBuilder.prototype = {
    /**
     * Operates on the collection to nest each item down to the level of the property string specified
     * @param {String} propertyString
     * @returns Neosavvy.Core.Builders.Collection
     * @method nest
     **/
    nest: function (propertyString) {
        if (!_.isEmpty(propertyString)) {
            this.operations.nest = propertyString;
        } else {
            throw "You must pass a valid propertyString to nest a collection.";
        }
        return this;
    },
    /**
     * Returns the output of all the operations on the builder. If none specified, returns the base collection.
     * @returns Array
     * @method build
     **/
    build: function () {
        if (_.keys(this.operations).length) {
            //Nest
            var nest = function (item, propertyString) {
                var ar = propertyString.split(".");
                while (ar.length) {
                    var tempObj = {};
                    tempObj[ar.pop()] = item;
                    item = tempObj;
                }
                return item;
            };
            return _.map(this.collection, function (item) {
                if (this.operations.nest) {
                    item = nest(item, this.operations.nest);
                }
                return item;
            }, this);
        }
        return this.collection;
    }
};
var Neosavvy = Neosavvy || {};
Neosavvy.Core = Neosavvy.Core || {};
Neosavvy.Core.Builders = Neosavvy.Core.Builders || {};

/**
 * @class Neosavvy.Core.Utils.RequestUrlBuilder
 * @constructor
 **/
Neosavvy.Core.Builders.RequestUrlBuilder = function (baseUrl) {
    if (!baseUrl) {
        throw "You must provide a base url for every request url built.";
    }
    this.keyValues = {};
    this.replacements = {};
    this.baseUrl = baseUrl;
};
Neosavvy.Core.Builders.RequestUrlBuilder.prototype = {
    /**
     * Adds a url parameter style param (key=value) to the url being built. Pass in either a key value pair, or an object with one or many key values.
     * @param {String|Object} key
     * @param {String} value
     * @returns Neosavvy.Core.Builders.RequestUrlBuilder
     * @method addParam
     **/
    addParam: function (key, value) {
        if (typeof(key) === 'object') {
            if (Neosavvy.Core.Utils.MapUtils.keysDistinct(this.keyValues, key)) {
                this.keyValues = _.merge(this.keyValues, key);
            } else {
                throw "You have passed overlapping keys for object arguments."
            }
        } else if (key && value) {
            this.keyValues = this.keyValues || {};
            if (this.keyValues[key] === undefined) {
                this.keyValues[key] = value;
            } else {
                throw "You have attempted to overwrite an existing key value in the request url.";
            }
        }
        else {
            throw "You must provide either a keyValue object, or a key value as arguments.";
        }
        return this;
    },
    /**
     * Replaces a key in the url with the value specified. Pass in a key value pair as separate arguments or an object with one or many key value pairs defined.
     * @param {String|Object} key
     * @param {String} value
     * @returns Neosavvy.Core.Builders.RequestUrlBuilder
     * @method paramReplace
     **/
    paramReplace: function (key, value) {
        if (typeof(key) === 'object') {
            if (Neosavvy.Core.Utils.MapUtils.keysDistinct(this.replacements, key)) {
                this.replacements = _.merge(this.replacements, key);
            } else {
                throw "You have passed overlapping keys for object arguments."
            }
        } else if (key && value) {
            this.replacements = this.replacements || {};
            if (this.replacements[key] === undefined) {
                this.replacements[key] = value;
            } else {
                throw "You have attempted to overwrite an existing key value in the request url.";
            }
        }
        else {
            throw "You must provide either a keyValue object, or a key value as arguments.";
        }
        return this;
    },
    /**
     * Runs all the operations specified and generates the appropriate request url output.
     * @returns String
     * @method build
     **/
    build: function () {
        if (this.replacements) {
            for (var key in this.replacements) {
                this.baseUrl = this.baseUrl.replace(new RegExp(key, "g"), String(this.replacements[key]))
            }
        }
        if (this.keyValues) {
            var count = 0;
            for (var key in this.keyValues) {
                if (count === 0) {
                    this.baseUrl += "?";
                } else {
                    this.baseUrl += "&";
                }
                this.baseUrl += key + "=" + String(this.keyValues[key]);
                count++;
            }
        }
        return this.baseUrl;
    }
};

var Neosavvy = Neosavvy || {};
Neosavvy.Core = Neosavvy.Core || {};
Neosavvy.Core.Builders = Neosavvy.Core.Builders || {};

/**
 * @class Neosavvy.Core.Builders.StringBuilder
 * @constructor
 **/
Neosavvy.Core.Builders.StringBuilder = function (input) {
    //Nothing defined here yet
    if (input) {
        this.input = input;
        this.output = input;
    } else {
        throw "Do not try to build a string with no input, it is pointless.";
    }
};

Neosavvy.Core.Builders.StringBuilder.prototype = {
    /**
     * Converts any camel case in a string to dash case: myNameMike >> my-name-mike.
     * @returns Neosavvy.Core.Builders.StringBuilder
     * @method camelToDash
     **/
    camelToDash:function () {
        this.output = this.output.replace(/\W+/g, '-')
            .replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
        return this;
    },
    /**
     * Changes a standard constant syntax to standard dash syntax: MY_NAME_MIKE >> my-name-mike.
     * @returns Neosavvy.Core.Builders.StringBuilder
     * @method constantToDash
     **/
    constantToDash:function () {
        this.output = this.output.replace(/_/g, '-').toLowerCase();
        return this;
    },
    /**
     * Rusn all the operations specified for the builder.
     * @returns String
     * @method build
     **/
    build:function () {
        return this.output;
    }
};

(function (global) {
    "use strict";
    global.memoize || (global.memoize = (typeof JSON === 'object' && typeof JSON.stringify === 'function' ?
        function (func) {
            var stringifyJson = JSON.stringify,
                cache = {};

            var cachedfun = function () {
                var hash = stringifyJson(arguments);
                return (hash in cache) ? cache[hash] : cache[hash] = func.apply(this, arguments);
            };
            cachedfun.__cache = (function(){
                cache.remove || (cache.remove = function(){
                    var hash = stringifyJson(arguments);
                    return (delete cache[hash]);
                });
                return cache;
            }).call(this);
            return cachedfun;
        } : function (func) {
        return func;
    }));
}(this));
(function (window, _) {
    if (_ && memoize) {
        window._cached = window._cached || {};
        for (var fn in _) {
            //No need to re-cache the memoization function in Lodash
            if (fn !== "memoize") {
                window._cached[fn] = memoize(_[fn]);
            }
        }
    } else {
        throw "Either Lodash or global memoize has not been loaded within this application. Please load these files before cached-lodash.js";
    }
})(window, window._);
var Neosavvy = Neosavvy || {};

/**
 * @class Neosavvy.Core
 * @static
 **/
Neosavvy.Core = Neosavvy.Core || {};

/**
 * @class Neosavvy.Core.Utils
 * @static
 **/
Neosavvy.Core.Utils = Neosavvy.Core.Utils || {};

/**
 * @class Neosavvy.Core.Builders
 * @static
 **/
Neosavvy.Core.Builders = Neosavvy.Core.Builders || {};


var Neosavvy = Neosavvy || {};
Neosavvy.Core = Neosavvy.Core || {};
Neosavvy.Core.Utils = Neosavvy.Core.Utils || {};

/**
 * @class Neosavvy.Core.Utils.CollectionUtils
 * @static
 **/
Neosavvy.Core.Utils.CollectionUtils = (function() {
    return {
        /**
         * does a thing...
         * @param {type} name
         * @returns type
         * @method itemByProperty
         **/
        itemByProperty: function (collection, property, value) {
            if (collection && collection.length && value) {
                for (var i = 0; i < collection.length; i++) {
                    var found = Neosavvy.Core.Utils.MapUtils.get(collection[i], property);
                    if (found === value) {
                        return collection[i];
                    }
                }
            }
            return null;
        },
        /**
         * does a thing...
         * @param {type} name
         * @returns type
         * @method updateByProperty
         **/
        updateByProperty: function (collection, item, propertyName) {
            if (collection && collection.length && item && item[propertyName] && propertyName) {
                for (var i = 0; i < collection.length; i++) {
                    if (collection[i] != undefined && collection[i] != null && collection[i][propertyName] === item[propertyName]) {
                        collection[i] = item;
                        break;
                    }
                }
            }
        },
        /**
         * does a thing...
         * @param {type} name
         * @returns type
         * @method removeByProperty
         **/
        removeByProperty: function (collection, item, propertyName) {
            if (collection && collection.length && item && item[propertyName] && propertyName) {
                for (var i = 0; i < collection.length; i++) {
                    if (collection[i] != undefined && collection[i] != null && collection[i][propertyName] === item[propertyName]) {
                        collection.splice(i, 1);
                        break;
                    }
                }
            }
        },
        /**
         * does a thing...
         * @param {type} name
         * @returns type
         * @method uniqueMap
         **/
        uniqueMap: function (collection, properties) {
            var map = {};
            if (collection && collection.length) {
                for (var i = 0; i < collection.length; i++) {
                    map[String(Neosavvy.Core.Utils.MapUtils.get(collection[i], properties))] = collection[i];
                }
            }
            return map;
        },
        /**
         * does a thing...
         * @param {type} name
         * @returns type
         * @method containMatchByProperty
         **/
        containMatchByProperty: function (collectionA, collectionB, propertyName) {
            if (collectionA && collectionB && collectionA.length && collectionB.length) {
                var compare = collectionB.map(function (item) {
                    return item[propertyName];
                });

                for (var i = 0; i < collectionA.length; i++) {
                    if (compare.indexOf(collectionA[i][propertyName]) != -1) {
                        return true;
                    }
                }
            }
            return false;
        },
        /**
         * does a thing...
         * @param {type} name
         * @returns type
         * @method collectionContainsAllOtherItems
         **/
        collectionContainsAllOtherItems: function (collection, otherItems, propertyName) {
            if (collection && collection.length && otherItems && otherItems.length) {
                var collectionProperties = collection.map(function (item) {
                    return item[propertyName];
                });

                for (var i = 0; i < otherItems.length; i++) {
                    if (collectionProperties.indexOf(otherItems[i][propertyName]) == -1) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        },
        /**
         * does a thing...
         * @param {type} name
         * @returns type
         * @method containsExclusively
         **/
        containsExclusively: function (collection, compare) {
            if (collection && compare) {
                for (var i = 0; i < collection.length; i++) {
                    if (compare.indexOf(collection[i]) === -1) {
                        return false;
                    }
                }
                for (var i = 0; i < compare.length; i++) {
                    if (collection.indexOf(compare[i]) === -1) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
    };
})();


var Neosavvy = Neosavvy || {};
Neosavvy.Core = Neosavvy.Core || {};
Neosavvy.Core.Utils = Neosavvy.Core.Utils || {};

/**
 * @class Neosavvy.Core.Utils.DateUtils
 * @static
 **/
Neosavvy.Core.Utils.DateUtils = (function () {
    var DAY_IN_MILLISECONDS = (24 * 60 * 60 * 1000);

    return {
        /**
         * returns the length of a day in milliseconds
         * @property DAY_IN_MILLISECONDS
         * @returns int
         **/
        DAY_IN_MILLISECONDS:DAY_IN_MILLISECONDS,

        /**
         * returns true if dateA and dateB are within the same day
         * @param {DateTime} dateA
         * @param {DateTime} dateB
         * @returns boolean
         * @method sameDay
         **/
        sameDay:function (dateA, dateB) {
            if (dateA && dateB) {
                if (dateA.getDay() == dateB.getDay()) {
                    return (dateA.getTime() >= (dateB.getTime() - DAY_IN_MILLISECONDS)) && (dateA.getTime() <= (dateB.getTime() + DAY_IN_MILLISECONDS));
                }
            }
            return false
        },

        /**
         * returns the number of days from now until the passed in day
         * @param {DateTime} days
         * @returns integer
         * @method daysFromNow
         **/
        daysFromNow:function (days) {
            return new Date(new Date().getTime() + (days * (24 * 60 * 60 * 1000)));
        }
    };

})();

var Neosavvy = Neosavvy || {};
Neosavvy.Core = Neosavvy.Core || {};
Neosavvy.Core.Utils = Neosavvy.Core.Utils || {};

/**
 * @class Neosavvy.Core.Utils.DomUtils
 * @static
 **/
Neosavvy.Core.Utils.DomUtils = (function () {
    return {
        /**
         * returns an array of DOM elements that contain the passed
         * in attribute matching value
         * @param {string} tagName
         * @param {string} attr
         * @param {string} value
         * @returns array
         * @method getElementsByAttribute
         **/
        getElementsByAttribute:function (tagName, attr, value) {
            var matchingElements = [];
            var allElements = document.getElementsByTagName(tagName);
            for (var i = 0; i < allElements.length; i++) {
                if (allElements[i].getAttribute(attr) == value) {
                    // Element exists with attribute. Add to array.
                    matchingElements.push(allElements[i]);
                }
            }
            return matchingElements;
        }
    };
})();

var Neosavvy = Neosavvy || {};
Neosavvy.Core = Neosavvy.Core || {};
Neosavvy.Core.Utils = Neosavvy.Core.Utils || {};

/**
 * @class Neosavvy.Core.Utils.MapUtils
 * @static
 **/
Neosavvy.Core.Utils.MapUtils = (function () {
    return {
        /**
         * does a thing...
         * @param {type} name
         * @param {type} name
         * @returns type
         * @method itemByProperty
         **/
        get:function (map, properties) {
            if (map && properties) {
                properties = properties.split(".");
                while (properties.length) {
                    if (map) {
                        map = map[properties.shift()];
                    } else {
                        break;
                    }
                }
            }
            return map;
        },
        keysDistinct:function() {
            if (arguments.length > 1) {
                var accumulatedLength = 0;
                for (var i = 0; i < arguments.length; i++) {
                    accumulatedLength += _.keys(arguments[i]).length;
                }
                return (_.keys(_.merge.apply(this, arguments)).length === accumulatedLength);
            }
            return true;
        }
    }
})();

var Neosavvy = Neosavvy || {};
Neosavvy.Core = Neosavvy.Core || {};
Neosavvy.Core.Utils = Neosavvy.Core.Utils || {};

/**
 * @class Neosavvy.Core.Utils.NumberUtils
 * @static
 **/
Neosavvy.Core.Utils.NumberUtils = (function () {

    return {
        asOrdinal:function (n) {
            var s = ["th", "st", "nd", "rd"], v = Math.abs(n) % 100;
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
        },
        round:function (value, significantDigits) {
            if (value !== undefined && value !== null) {
                var str = String(Math.round(parseFloat(value) * Math.pow(10, significantDigits)));
                return significantDigits ? str.slice(0, str.length - significantDigits) + "." + str.slice(str.length - significantDigits, str.length) : str;
            }
            return value;
        },
        roundUpIfFloat:function (n) {
            var absN = Math.abs(n);
            if ((absN - parseInt(absN)) > 0) {
                return parseInt(n) + (n < 0 ? -1 : 1);
            }
            return n;
        },
        leadingZeroes:function (n, digits) {
            if (n != undefined && n != null) {
                if (digits == undefined || digits == null) {
                    digits = 2;
                }
                var s = String(n);
                var negative = (s.charAt(0) == "-");
                if (negative) {
                    s = s.slice(1);
                }
                var split = s.split(".");
                if (split.length == 2) {
                    s = split[0];
                }
                while (s.length < digits) {
                    s = "0" + s;
                }
                if (split.length == 2) {
                    s += "." + split[1];
                }
                return negative ? "-" + s : s;
            }
            return n;
        }
    }

})();

var Neosavvy = Neosavvy || {};
Neosavvy.Core = Neosavvy.Core || {};
Neosavvy.Core.Utils = Neosavvy.Core.Utils || {};

/**
 * @class Neosavvy.Core.Utils.RegexUtils
 * @static
 **/
Neosavvy.Core.Utils.RegexUtils = (function () {
    var EMAIL_REGEX = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    return {
        matchStringAndLeadup: function(str) {
            if (!_.isEmpty(str)) {
                str = String(str);
                var re = "", idx = 0;
                while (idx < str.length) {
                    re += "^" + str.slice(0, idx + 1) + "$";
                    if (idx < (str.length - 1)) {
                        re += "|";
                    }
                    idx++;
                }
                return new RegExp(re.replace(/([.?*+[\]\\(){}-])/g, "\\$1"), "i");
            }
            return undefined;
        },
        isEmail: function(str) {
            if (str !== undefined && str !== null) {
                return String(str).search(EMAIL_REGEX) != -1;
            }
            return false;
        }
    };
})();

var Neosavvy = Neosavvy || {};
Neosavvy.Core = Neosavvy.Core || {};
Neosavvy.Core.Utils = Neosavvy.Core.Utils || {};

/**
 * @class Neosavvy.Core.Utils.RequestUrlUtils
 * @static
 **/
Neosavvy.Core.Utils.RequestUrlUtils = (function () {
    function addParam(url, key, value) {
        if (url && url != null && key != null && key != "" && value != null && value != "") {
            var key_value = key.toString() + "=" + value.toString();

            if (url.indexOf("?") == -1) {
                url += "?" + key_value;
            } else {
                url += "&" + key_value;
            }
        }
        return url;
    }

    function getKey(hash) {
        if (hash && hash != null) {
            var ar = Object.keys(hash);

            if (ar != null && ar.length) {
                return ar[0];
            }
        }
        return null;
    }

    return {
        addParams:function (url, key_value_pairs) {
            if (url && url != null && key_value_pairs != null && key_value_pairs.length) {
                for (var i = 0; i < key_value_pairs.length; i++) {
                    var hash = key_value_pairs[i];
                    var key = getKey(hash);
                    url = addParam(url, key, hash[key]);
                }
            }
            return url;
        },

        addParam:function (url, key, value) {
            return addParam(url, key, value);
        },

        replaceParam:function (url, key, value) {
            if (url != null && key != null && value != null) {
                var url_array = url.split("?");
                if (url_array.length == 2) {
                    var found_param = false;

                    var params = url_array[1].split("&");
                    for (var i = 0; i < params.length; i++) {
                        if (params[i].indexOf(key + "=") != -1) {
                            params[i] = key.toString() + "=" + value.toString();
                            found_param = true;
                            break;
                        }
                    }

                    if (found_param) {
                        url = url_array[0] + "?";

                        for (var i = 0; i < params.length; i++) {
                            url += params[i];
                            if (i < (params.length - 1)) {
                                url += "&";
                            }
                        }
                    }
                }
                return url
            }
            return null
        }
    }
})();

var Neosavvy = Neosavvy || {};
Neosavvy.Core = Neosavvy.Core || {};
Neosavvy.Core.Utils = Neosavvy.Core.Utils || {};

/**
 * @class Neosavvy.Core.Utils.SpecialUtils
 * @static
 **/
Neosavvy.Core.Utils.SpecialUtils = (function () {
    return {
        keepTrying:function () {
            function _keepTrying() {
                if (arguments.length) {
                    if ((arguments.length % 2) === 0) {
                        try {
                            return arguments[0].apply(this, arguments[1]);
                        } catch (e) {
                            return _keepTrying.apply(this, Array.prototype.slice.call(arguments, 2));
                        }
                    } else {
                        throw "Keep trying requires an event number of arguments. Even indices are functions and odd indices are arrays or empty arrays of their arguments!";
                    }
                }
                return null;
            }

            return _keepTrying.apply(this, arguments);
        }
    }
})();

var Neosavvy = Neosavvy || {};
Neosavvy.Core = Neosavvy.Core || {};
Neosavvy.Core.Utils = Neosavvy.Core.Utils || {};

/**
 * @class Neosavvy.Core.Utils.StringUtils
 * @static
 **/
Neosavvy.Core.Utils.StringUtils = (function () {
    var BLANK_STRING_REGEX = /^\s*$/;

    return {
        //Deals with 5 character gaps at the largest
        htmlAttributeSafe:function (str) {
            if (str != null) {
                var largest_gap = "     ";
                while (largest_gap != " ") {
                    str = str.replace(largest_gap, " ");
                    largest_gap = largest_gap.slice(0, largest_gap.length - 1);
                }

                return str.replace(/(_\s|\s_|\s)/g, "_").
                    replace(/([^a-zA-Z0-9_])/g, "").
                    toLowerCase();
            }
            return null;
        },

        truncate:function (str, character_count, include_dots) {
            if (include_dots == undefined) {
                include_dots = true;
            }
            if (str && str != null) {
                if (str.length > character_count) {
                    str = str.slice(0, character_count).trim();
                    if (include_dots) {
                        str += "...";
                    }
                }
            }
            return str;
        },

        isBlank:function (str) {
            return (!str || BLANK_STRING_REGEX.test(str));
        },
        replaceIfExistsAtIndex:function (str, character, replacement, index) {
            if (str && character != undefined && character != null && replacement != undefined && replacement != null && index >= 0) {
                if (str[index] == character) {
                    return str.substr(0, index) + replacement + str.substr(index + replacement.length + 1);
                }
            }
            return str;
        },
        properCase:function (str) {
            if (str) {
                return str.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            }
            return "";
        },
        remove:function (value) {
            if (value && arguments.length > 1) {
                value = String(value);
                for (var i = 1; i < arguments.length; i++) {
                    value = value.replace(new RegExp(arguments[i], "g"), "");
                }
            }
            return value;
        }
    }

})();
