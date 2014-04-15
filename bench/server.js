"use strict";

var watchify = require("watchify");
var http = require("http");

var w = watchify(__dirname + "/index.js");

http.createServer(function(req, res) {
  var b = w.bundle();
  res.write("<script>");
  b.pipe(res, { end: false });
  b.on("end", function() {
    res.write("</script>");
    res.end();
  });
}).listen(process.env.PORT || 8080);
