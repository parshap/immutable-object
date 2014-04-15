"use strict";

var ImmutableObject = require("./ImmutableObject");
var createObject = require("./lib/createObject");

module.exports = function(members) {
  members = members || {};

  function ctor() {
    var base = (this instanceof ctor) ? this : createObject(ctor.prototype);
    var callback = arguments[arguments.length - 1];
    var instance = ImmutableObject(base, callback);

    if (typeof instance.init === "function") {
      instance = instance.init.apply(instance, arguments);
      if (!instance || !instance.__isImmutableObject__) {
        throw new Error("init method must return an immutable object.");
      }
    }

    return instance;
  }

  ctor.prototype = ImmutableObject(members);
  return ctor;
};

