/*global console, require */
var Num = require('../index.js');

var r = Num.rat("4.2 131282");

console.log(r.str(), r.mul(r).str("simplify"), r.str("dec"), r.mul(r).str("dec:100") );
