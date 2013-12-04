/*global console, require*/
var Num = require('../index.js');
var r = Num.rat("2 5/4");

console.log(r.str("dec:10"));