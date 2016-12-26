/*global console, require, process*/

var Num = require('../index.js');

var factorial = function (n) {
    var i;
    n = parseInt(n, 10) || 300;
    var fact = Num.int.unit;
    var facts = [];
    for (i = 1; i <= n; i += 1) {
        if (i % 100 === 0) {
           facts.push(fact);
           fact = Num.int(i);
        } else {
          fact = fact.mul(Num.int(i));
        }
    }
    facts.push(fact);


    var nfacts;
    while (facts.length > 1) {
        n = facts.length;
        nfacts = [];
        fact = facts[0];
        for (i = 1; i < n; i += 1) {
            if (i % 10 === 0) {
                 nfacts.push(fact);
                 fact = facts[i];
            } else {
                fact = fact.mul(facts[i]);
            }
        }
        nfacts.push(fact);
        facts = nfacts;
    }

    return facts[0];
};

var prettyprint = function (str,w) {
    w = parseInt(w, 10) || 80; 
    str = str || "";
    var arr = [];
    var i = 0;
    while (i < str.length) {
        arr.push(str.slice(i, i+w));
        i += w;
    }
    return arr.join("\n");
};

var digitcount = function (str) {
    var ret = [0,0,0,0,0,0,0,0,0,0],
        i, n = str.length;

    for (i = 0; i < n; i += 1) {
        ret[parseInt(str[i], 10)] += 1;
    }

    return ret;
};

var ret = factorial(process.argv[2] || 300).str();
console.log(prettyprint(ret, process.argv[3] || 80), "Length: "+ ret.length+"\n", digitcount(ret) );
