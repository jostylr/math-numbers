var Num = require('../index.js');
var i, n =300;
var fact = Num.int.unit;
for (i = 1; i <= n; i += 1) {
    fact = fact.mul(Num.int(i));
}

console.log(fact.str() );