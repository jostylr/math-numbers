/*jshint node:true*/

var Num = require('../index.js');

console.log("START");

var a = ["1 3/4", "-1_3/4", "1._75", "1. 75", "5"];

a.forEach(function (el) {
    var x = Num(el);
    console.log(x.str());    
});

console.log(Num("1 3/4").add("5 2/3").str());

console.log(Num("-1.45E34").str());

console.log(Num("1.3_0E7+2_3/4i").add("0-i").mul("2+3i").str() );