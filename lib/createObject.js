"use strict";

// Performant `Object.create()`
module.exports = function(proto, props) {
  function ctor() {}
  ctor.prototype = proto;
  var o = new ctor();
  if (props) {
    Object.defineProperties(o, props);
  }
  return o;
};
