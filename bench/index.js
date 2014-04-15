var immutable = require("../");
var OBJ = require("./obj.json");

console.time("create");
var o = immutable(OBJ);
console.timeEnd("create");

console.time("overwrite");
o.set(OBJ);
console.timeEnd("overwrite");

console.time("set");
o.set({ test: OBJ });
console.timeEnd("set");
