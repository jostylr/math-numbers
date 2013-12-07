/*global console, require */
var Num = require('../index.js');
var r = Num.rat("6.24 3");
console.log(r, r.w);
console.log(r.str(), r.str("simplify"));