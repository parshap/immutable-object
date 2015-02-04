"use strict";

// Object.freeze but not in production
module.exports = function(obj) {
  if (process.env.NODE_ENV !== "production") {
    return Object.freeze(obj);
  }
  else {
    return obj;
  }
};
