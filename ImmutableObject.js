"use strict";

function ImmutableObject(input, callback) {
  if (input && typeof input !== "object") {
    throw new TypeError("ImmutableObject property source must be an object.");
  }

  var base = empty;
  var props = input || {};
  if (input && input.__isImmutableObject__) {
    base = input;
    props = {};
  }

  return Object.freeze(Object.create(base, {
    __callback: {
      enumerable: false,
      value: callback,
    },
  })).set(props);
}

var empty = Object.freeze(Object.create(ImmutableObject.prototype));

ImmutableObject.prototype.set = function(props, callback) {
  if (!props) {
    return this;
  }

  // allow this.set("property", value)
  // call this.set({property: value})
  if (typeof props === "string") {
    props = {};
    props[arguments[0]] = arguments[1];
    callback = arguments[2];
  }

  var keys = allKeys(props);
  if (keys.length === 0) return this;

  function sameKeys(x, y) {
    return Object.keys(x).every(function(key) {
      return y.hasOwnProperty(key);
    });
  }

  var allSameKeys = sameKeys(this, props) && sameKeys(props, this);
  if (allSameKeys) {
    var p = Object.getPrototypeOf(this);
    return p.set(props);
  }

  var propertyDefs = {};
  keys.forEach(function(key) {
    var value = props[key];
    value = require("./factory")(value);
    propertyDefs[key] = { value: value, enumerable: true };
  });
  var newObj = Object.create(this, propertyDefs);
  Object.freeze(newObj);
  triggerChange(this, newObj);
  return newObj;
};

ImmutableObject.prototype.unset = function(keyToExclude) {
  var props = {};

  var includeKey = function(key) {
    props[key] = this[key];
  }.bind(this);

  function notExcluded(key) {
    return key !== keyToExclude;
  }

  if (this.hasOwnProperty(keyToExclude) &&
      allKeys(Object.getPrototypeOf(this)).indexOf(keyToExclude) < 0) {
    Object.keys(this).filter(notExcluded).forEach(includeKey);
    return Object.getPrototypeOf(this).set(props);
  } else {
    var keys = allKeys(this);
    var filtered = keys.filter(notExcluded);
    var noChange = filtered.length === keys.length;
    if (noChange) {
      return this;
    } else {
      filtered.forEach(includeKey);
      return ImmutableObject(props);
    }
  }
};

ImmutableObject.prototype.toJSON = function() {
  var json = {};
  ImmutableObject.keys(this).forEach(function(key) {
    var value = this[key];
    json[key] = (value && typeof value.toJSON === "function")
      ? value.toJSON()
      : value;
  }, this);
  return json;
};

Object.defineProperty(ImmutableObject.prototype, "__isImmutableObject__", {
  enumerable: false,
  value: true,
});

Object.freeze(ImmutableObject.prototype);

function allKeys(obj) {
  if (obj && obj.__isImmutableObject__) {
    return ImmutableObject.keys(obj);
  } else {
    return Object.keys(obj);
  }
}

function triggerChange(obj, newObj) {
  if (typeof obj.__callback === "function") {
    obj.__callback(newObj);
  }
}

ImmutableObject.keys = function(obj) {
  var keys = [];
  var seen = {};
  function notSeen(key) {
    if (!seen.hasOwnProperty(key)) {
      seen[key] = true;
      return true;
    } else {
      return false;
    }
  }
  while (obj && obj !== ImmutableObject.prototype) {
    keys = keys.concat( Object.keys(obj).filter(notSeen) );
    obj = Object.getPrototypeOf(obj);
  }
  return keys;
};

module.exports = ImmutableObject;

