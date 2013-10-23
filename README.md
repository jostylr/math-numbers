## Math-Numbers  [![Build Status](https://travis-ci.org/jostylr/math-numbers.png)](https://travis-ci.org/jostylr/math-numbers)

This is a JavaScript library that implements exact integer arithmetic, arbitrary precision decimals, and other stuff. It is intended for educational purposes and most of the algorithms are fairly straightforward with little concern for performance.

It should work equally well in node or browser though mostly it is for the browser. 
 
## Install

`npm install math-numbers` is the command to include it as a package for npm though it is usually better to use package.json to load the dependencies. Once installed, you can get the number constructor as the return object from `require('math-numbers');`

For the browser, you can just include the index.js file. It will load the number constructor in as `Num` in the global window space. To test it, you can go to [jsbin](http://jsbin.com/AxaxOlU/2/edit?js,console) and make sure everything passes. 

## Example

Let's say we want to compute 300!   This is a very large number. To get all of its digits, we can do:

    var Num = require('math-numbers');
    var i, n =300;
    var fact = Num.int.unit;
    for (i = 1; i <= n; i += 1) {
        fact = fact.mul(Num.int(i));
    }

    console.log(fact.str() );

The live example is at [JSBin](http://jsbin.com/eqiBiL/1/edit?js,console) which differs by removing the var Num line as Num is loaded as a global for the browser. 

## Basic numbers

The types of numbers are float, int (integer), rat (rational), sci (scientific), com (complex). 

You can create a new number by either doing `Num.int(5)` or  `new Num(5, "int")`

Then you can do operations on it. [live]( http://jsbin.com/EgucEHu/1/edit?js,console)

    var x = Num.int(5);
    console.log(x.str());  // 5

    var y = (x.add(7).mul(6)).ipow(5);
    console.log(y.str()); // computes ( (5 +7)*(6) )^ 3 = 373248

We have a variety of basic operators. All of them are designed to stay within the rational system, as applicable. Thus, we have not fractional powers in this library. 

### Arithmetic operators

All of the numbers support the basic arithmetic interfaces: add, sub, mul, div, ipow. The first four are obvious, but the second one is an integral power operator. `x.ipow(n)` will take the `Num` instance x and raise it (via multiplication, reciprocation) to the nth power which should be either a plain JavaScript integer or a Num.int.

Integers have more arithmetic operators. 

`int.div(int)` will generally create a rational numbers. But `.quo` will give the quotient of the division and `.rem` will give the remainder. 

`int.gcd(int)` and `int.lcm(int)`  will compute the greatest common divisor and least common multiple, respectively.

### Comparison operators

Except for complex numbers where comparison is not meaningful, we can compare the various numbers. For example,  `x.gt(y)` will return true if x > y. The full list of comparators are: gt, gte, lt, lte, mgt, mgte, mlt, mlte, eq, meq which are, respectively:  greater than, greater than or equal to, less than, less than or equal to, mass greater than, mass greater than or equal, mass less than, mass less than or equal to, equals, mass equal.  The term mass is used to indicate that the absolute values of the given numbers are being compared. 

Along with the comparators, there are also the max, min, mmax, mmin operators that return the maximum, minimum, mass maximum, mass minimum. 

### Unary operators

The following unary operators are universal: neg which negates the number and inv which inverts it. 

Non-complex numbers all have round, floor, abs, ceil which takes, for example,  -2.3 to -2, -3, 2.3, and -2. 

Complex numbers have abssq which, given x+iy,  will yield  x^2 + y^2. We do not have abs since that involves square roots and will lead rationals out of being rational. They also have re and im which yield x, respectively y, from an input of x+iy.