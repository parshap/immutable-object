"use strict";

var factory = require("./factory");
var ImmutableObject = require("./ImmutableObject");
var lens = require("./lens");
var createClass = require("./createClass");
var plain = require("./plain");

var api = factory;
api.Object = ImmutableObject;
api.keys = ImmutableObject.keys;
api.createClass = createClass;
api.lens = lens;
api.plain = plain;

module.exports = api;

