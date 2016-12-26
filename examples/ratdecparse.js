/*global console, require */
var Num = require('../index.js');
["6.24 3", "6.24 0", "6.24 32 E-3", "-7.28 14323E5"].forEach(function (el) {
    var r = Num.rat(el);
    console.log(el, ": ", r.str(), " || ", r.str("simplify"));
});
