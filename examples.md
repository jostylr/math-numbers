# Examples

Here is a set of runnable examples


## Files

* [examples/factorial.js](#factorial-broken-up "save: | jshint")

## Factorial broken up

How far can we go with some intelligent factorializing? 

    var Num = require('../index.js');

    var factorial = _":factorial function";

    var prettyprint = _":pretty print";

    var ret = factorial(process.argv[2] || 300).str();
    console.log(prettyprint(ret, process.argv[3] || 80), "Length: "+ ret.length );

[factorial function]()

    function (n) {
        var i;
        n = parseInt(n) || 300;
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

        return facts[0]
    }

[pretty print]() 

Takes a string and breaks it up into chunks of width w or 80.

    function (str,w) {
        w = parseInt(w) || 80; 
        str = str || "";
        var arr = [];
        var i = 0;
        while (i < str.length) {
            arr.push(str.slice(i, i+w));
            i += w;
        }
        return arr.join("\n");
    }

