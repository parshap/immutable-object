"use strict";

var ImmutableObject = require("./ImmutableObject");

function factory(input, callback) {
  if (arguments.length === 0) {
    return ImmutableObject(null, callback);
  } else if (Array.isArray(input)) {
    return Object.freeze(input.map(function(el) {
      return factory(el, callback);
    }));
  } else if (typeof input === "object" && input != null) {
    return ImmutableObject(input, callback);
  } else {
    // Treat anything else i.e. number, boolean, null, as immutable already
    return input;
  }
}

module.exports = factory;

