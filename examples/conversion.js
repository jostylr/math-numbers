/*global console, require*/
var Num = require('../index.js');

var x = Num.int(5);

var y = x.add("23/5");

Num.toStr("inspect");
console.log(x, y);

Num.toStr("noInspect");
console.log(x, y);

console.log( Num.each([x, y, true],  "sci" ).join("\n") );
