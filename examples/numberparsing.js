/*jshint node:true*/

var Num = require('../index.js');

var a = ["1 3/4", "-1 3/4", "5"];

a.forEach(function (el) {
    var x = Num(el);
    console.log(x.str());    
});

console.log(Num("1 3/4").add("5 2/3").str());

console.log(Num("-1.45E34").str());