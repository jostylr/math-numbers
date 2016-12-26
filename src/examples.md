# Examples

Here is a set of runnable examples


## Files

* [../examples/](# "cd: save")
* [convert.js](#conversion "save: |jshint")
* [numberparsing.js](#number-parsing "save: |jshint")
* [factorial.js](#factorial-broken-up "save: | jshint")
* [conversion.js](#conversions "save:|jshint")
* [division.js](#division "save:|jshint")
* [ratdecparse.js](#parsing-ratdec "save:|jshint")
* [squarerat.js](#repeating-squared "save:|jshint")
* [](# "cd: save")

## Number parsing

We just want to try some number parsing and see if we can get some trouble.

    /*jshint node:true*/

    var Num = require('../index.js');

    console.log(Num("3+5"));


### Old

console.log("START");

var a = ["1 3/4", "-1_3/4", "1._75", "1. 75", "5"];

a.forEach(function (el) {
    var x = Num(el);
    console.log(x.str());    
});

console.log(Num("1 3/4").add("5 2/3").str());

console.log(Num("-1.45E34").str());

console.log(Num("1.3_0E7+2_3/4i").add("0-i").mul("2+3i").str() );

console.log(Num("ab").add(3).mul("57").abs().div("cd").str());

console.log((Num(3).mul(7)).add("ab").div("7").add(Num(57).sub(4)).str());


## Conversion


    /*jshint node:true*/

    var Num = require('../index.js');    

    console.log(Num("0").add("1.1").str());
    

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


## Old Division

    /*global console, require*/
  
    var ratdec = function (num, den, max) {
  
        max = max || 100;
        var orig, res, a, b, index = Infinity;

        den = Num.int(den);
        var zero = den.zero();
        orig = Num.int(num);
        res = orig.qure(den);

        var rem = [res.r.str()];
        var quo = [res.q.str()];
        var rep = [];

        a = res.r;

        for (i = 0; i<max; i += 1) { 
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
            return quo[0]+"."+quo.join('');
        } else {
            return quo[0]+"."+quo.slice(1,index+1).join('') +    ' ' +  quo.slice(index+1).join('');
        }
      
        
    };

Type in ratdec(num, den) where num is the numerator (integer) and den is the denominator (integer).

Example:  ratdec(42, 3)

If you want to do something long, you can try ratdec(42, 823, 1000). The third number is the max period detectable before giving up.

## Division

    /*global console, require*/
    var Num = require('../index.js');
    var r = Num.rat("2 5/4");

    console.log(r.str("dec:10"));


## Parsing ratdec

    /*global console, require */
    var Num = require('../index.js');
    ["6.24 3", "6.24 0", "6.24 32 E-3", "-7.28 14323E5"].forEach(function (el) {
        var r = Num.rat(el);
        console.log(el, ": ", r.str(), " || ", r.str("simplify"));
    });

## Repeating squared

    /*global console, require */
    var Num = require('../index.js');

    var r = Num.rat("4.2 131282");

    console.log(r.str(), r.mul(r).str("simplify"), r.str("dec"), r.mul(r).str("dec:100") );

