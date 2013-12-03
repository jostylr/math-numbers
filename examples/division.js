/*global console, require*/
var Num = require('../index.js');

var orig, res, a, b, i, index = Infinity;

var den = Num.int('5');
var zero = den.zero();
orig = Num.int('4');
res = orig.qure(den);

var rem = [res.r.str()];
var quo = [res.q.str()];
var rep = [];

a = res.r;

for (i = 0; i<2000; i += 1) { 
    a = a.mul(10);
    res = a.qure(den);
    quo.push(res.q.str());

    b = res.r.str();
    index = rem.indexOf(b);
    if (index !== -1) {
        break;
    }
    rem.push(b);
    a = res.r;
}

console.log(orig.str()+'/'+den.str());
if (index === -1) {
    console.log(quo[0]+"."+quo.join(''));
} else {
    console.log(quo[0]+"."+quo.slice(1,index+1).join('')+' '+quo.slice(index+1).join(''));
}