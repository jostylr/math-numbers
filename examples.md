# Examples

Here is a set of runnable examples


## Files

* [examples/factorial.js](#factorial-broken-up "save: | jshint")
* [examples/conversion.js](#conversions "save:|jshint")
* [examples/division.js](#division "save:|jshint")

## Factorial broken up

How far can we go with some intelligent factorializing? 

    /*global console, require, process*/

    var Num = require('../index.js');

    var factorial = _":factorial function";

    var prettyprint = _":pretty print";

    var digitcount = _":digit count";

    var ret = factorial(process.argv[2] || 300).str();
    console.log(prettyprint(ret, process.argv[3] || 80), "Length: "+ ret.length+"\n", digitcount(ret) );

[factorial function]()

    function (n) {
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
    }

[pretty print]() 

Takes a string and breaks it up into chunks of width w or 80.

    function (str,w) {
        w = parseInt(w, 10) || 80; 
        str = str || "";
        var arr = [];
        var i = 0;
        while (i < str.length) {
            arr.push(str.slice(i, i+w));
            i += w;
        }
        return arr.join("\n");
    }


[digit count]()

Counts the frequency in the factorial number. 

    function (str) {
        var ret = [0,0,0,0,0,0,0,0,0,0],
            i, n = str.length;

        for (i = 0; i < n; i += 1) {
            ret[parseInt(str[i], 10)] += 1;
        }

        return ret;
    }


## Conversions

These are examples of converting from one type of number to another. 

    /*global console, require*/
    var Num = require('../index.js');

    var x = Num.int(5);

    var y = x.add("23/5");

    Num.toStr("inspect");
    console.log(x, y);

    Num.toStr("noInspect");
    console.log(x, y);

    console.log( Num.each([x, y, true],  "sci" ).join("\n") );


## Division

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

Check to see if we have seen the remainder already.

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
