"use strict";

var ImmutableObject = require("./ImmutableObject");
var ImmutableDate = require("immutable-date");
var freeze = require("./freeze");

function isDate(arg) {
  return typeof arg === 'object' && arg !== null &&
    Object.prototype.toString.call(arg) === '[object Date]';
}

function factory(input, callback) {
  if (arguments.length === 0) {
    return ImmutableObject(null, callback);
  } else if (Array.isArray(input)) {
    return freeze(input.map(function(el) {
      return factory(el, callback);
    }));
  } else if (isDate(input)) {
    // Wrap dates using immutable-date
    // @TODO Handle callback
    return new ImmutableDate(+input);
  } else if (typeof input === "object" && input != null) {
    return ImmutableObject(input, callback);
  } else {
    // Treat anything else i.e. number, boolean, null, as immutable already
    // @TODO Warn about callback
    return input;
  }
}

module.exports = factory;

