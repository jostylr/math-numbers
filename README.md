## Math-Numbers  [![Build Status](https://travis-ci.org/jostylr/math-numbers.png)](https://travis-ci.org/jostylr/math-numbers)

This is a JavaScript library that implements exact integer arithmetic, arbitrary precision decimals, and other stuff. It is intended for educational purposes and most of the algorithms are fairly straightforward with little concern for performance.

It should work equally well in node or browser though mostly it is for the browser. 
 
## Install

`npm install math-numbers` is the command to include it as a package for npm though it is usually better to use package.json to load the dependencies. Once installed, you can get the number constructor as the return object from `require('math-numbers');`

For the browser, you can just include the index.js file. It will load the number constructor in as `Num` in the global window space. 

## Example

Let's say we want to compute 300!   This is a very large number. To get all of its digits, we can do:

    var Num = require('math-numbers');
    var i, n =300;
    var fact = Num.int.unit;
    for (i = 1; i <= n; i += 1) {
        fact = fact.mul(Num.int(i));
    }

    console.log(fact.str() );