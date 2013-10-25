/*global console, require*/
var Num = require('../index.js');

var x = Num.int(5);

var y = x.add("23/5");

console.log(y.str());