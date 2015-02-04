"use strict";

var ImmutableObject = require("./ImmutableObject");
var ImmutableDate = require("immutable-date");

// Recursively turn an immutable object into a plain js object
function toPlain(obj) {
  if (obj instanceof ImmutableObject) {
    return immutableToPlain(obj);
  }
  else if (obj instanceof ImmutableDate) {
    return obj._date;
  }
  else if (Array.isArray(obj)) {
    return obj.map(toPlain);
  }
  else {
    return obj;
  }
}

// Return on ImmutableObject to a plain javascript object
function immutableToPlain(obj) {
  var pojo = {};
  ImmutableObject.keys(obj).forEach(function(name) {
    pojo[name] = toPlain(obj[name]);
  });
  return pojo;
}

module.exports = toPlain;
