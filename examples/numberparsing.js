/*jshint node:true*/

var Num = require('../index.js');

var a = ["0", "1", "-0", "-1234567890123456789"];
var b = [];

a.forEach(function (el) {
    var x = Num.int(el);
    b.push(x);
    console.log(x.str());    
});