# Math Numbers
    
Math-numbers is a project dedicated to exploring math with as little concern
about floating point approximations as possible. The idea is that we can use
integers and rational numbers of perfect precision while we can still drop
into the scientific numbers with an arbitrary precision level whenever we want
to. 

The coding syntax for using the numbers is x.add(y).mul(z)  to indicate
(x+y)*z while  x.add(y.mul(z)) to do x+(y*z). 

The methods are designed here so that we can write algorithms that will work
as long as the input types support the given methods. It is more or less
subclassing, but since we need to subclass with operators of multiple
arguments and types, it gets a little tricky (as far as I can tell). 



## Files

Here we define the directory structure for math-numbers.

### Output files

* [../](# "cd: save")
* [index.js](#main-num-class "save:|jshint") This is the node module entry point and only
  relevant file. It is a small file.
* [README.md](#readme "save: | raw ## README, ---! | sub \n\ #, \n# |trim") 
  The standard README.
* [](# "cd: save")
* [index.js](#main-num-class "save:") This is for the webpage use in build



### Source Files

* [num](num.md "load:") The core number constructor, with basic operators and
  and how to combine the different type of numbers. 
* [types/](# "cd: load")  Until the next cd, these are the different types of
  numbers with their operations and properties defined. 
* [float](float.md "load:")
* [integer](integer.md "load:")
* [rational](rational.md "load:")
* [scientific](scientific.md "load:")
* [complex](complex.md "load:")
* [](# "cd: load")
* [parsing](parsing.md "load:") Parsing the different types of numbers. 
* [test](test.md "load:") The testrunner
* [examples](examples.md "load:") console examples
* [pages](pages.md "load:") web page tutorials for using and a testing page



## Main Num Class

Here we define the Num class and all associated code. The code below is
suitable for browser or node. We add a global for browsers while for node we use 
module.exports. 

    (function () {

        /*global module*/

        var Num = _"num::Num constructor";

        if (typeof module !== 'undefined' && module.exports) {
            module.exports = Num;
        } else {
            this.Num = Num;
        }

        _"num::properties"
        
        Num.tryParse = _"parsing::";
        
        _"float:: | ife Num";

        _"integer:: | ife Num";

        _"rational:: | ife Num";

        _"scientific:: | ife Num";

        _"complex:: | ife Num ";

        _"num::combo numbers"

    }).call(this);




## Making functions

So most functions are used as  f(x, y, ...)  but we may want them to be of the
form x.f(y, z)  for chaining purposes. So we need a little function that takes
in a function and some 

Num.Fun(f, 


[off](# "block:")

## README

 ## Math-Numbers  [![Build Status](https://travis-ci.org/jostylr/math-numbers.png)](https://travis-ci.org/jostylr/math-numbers)

This is a JavaScript library that implements exact integer arithmetic,
arbitrary precision decimals, and other stuff. It is intended for educational
purposes and most of the algorithms are fairly straightforward with little
concern for performance.

It should work equally well in node or browser though mostly it is for the
browser. 

 
 ## Install

`npm install math-numbers` is the command to include it as a package for npm
though it is usually better to use package.json to load the dependencies. Once
installed, you can get the number constructor as the return object from
`require('math-numbers');`

For the browser, you can just include the index.js file. It will load the
number constructor in as `Num` in the global window space. To test it, you can
go to [jsbin](http://jsbin.com/AxaxOlU/2/edit?js,console) and make sure
everything passes. 

 ## Example

Let's say we want to compute 300!   This is a very large number. To get all of
its digits, we can do:

    var Num = require('math-numbers');
    var i, n =300;
    var fact = Num.int.unit;
    for (i = 1; i <= n; i += 1) {
        fact = fact.mul(Num.int(i));
    }

    console.log(fact.str() );

The live example is at [JSBin](http://jsbin.com/eqiBiL/1/edit?js,console)
which differs by removing the var Num line as Num is loaded as a global for
the browser. 

There is a better example at
[JSBin](http://jsbin.com/gist/7121167/?js,console) This can handle computing
40,000! in about 22 seconds on my machine.  Hit Run, and then in the console,
type `factprint(40000, 60)` to get 40,000 factorial printed out in groups of
60. It will produce the number which is 166714 digits long!

 ## Basic numbers

The types of numbers are float, int (integer), rat (rational), sci
(scientific), com (complex). 

You can create a new number by either doing `Num.int(5)` or  `new Num(5, "int")`

Then you can do operations on it. [live]( http://jsbin.com/EgucEHu/1/edit?js,console)

    var x = Num.int(5);
    console.log(x.str());  // 5

    var y = (x.add(7).mul(6)).ipow(5);
    console.log(y.str()); // computes ( (5 +7)*(6) )^ 3 = 373248

We have a variety of basic operators. All of them are designed to stay within
the rational system, as applicable. Thus, we have not fractional powers in
this library. 

 ### Arithmetic operators

All of the numbers support the basic arithmetic interfaces: add, sub, mul,
div, ipow. The first four are obvious, but the second one is an integral power
operator. `x.ipow(n)` will take the `Num` instance x and raise it (via
multiplication, reciprocation) to the nth power which should be either a plain
JavaScript integer or a Num.int.

Integers have more arithmetic operators. 

`int.div(int)` will generally create a rational numbers. But `.quo` will give
the quotient of the division and `.rem` will give the remainder. 

`int.gcd(int)` and `int.lcm(int)`  will compute the greatest common divisor
and least common multiple, respectively.

 ### Comparison operators

Except for complex numbers where comparison is not meaningful, we can compare
the various numbers. For example,  `x.gt(y)` will return true if x > y. The
full list of comparators are: gt, gte, lt, lte, mgt, mgte, mlt, mlte, eq, meq
which are, respectively:  greater than, greater than or equal to, less than,
less than or equal to, mass greater than, mass greater than or equal, mass
less than, mass less than or equal to, equals, mass equal.  The term mass is
used to indicate that the absolute values of the given numbers are being
compared. 

Along with the comparators, there are also the max, min, mmax, mmin operators
that return the maximum, minimum, mass maximum, mass minimum. 

 ### Unary operators

The following unary operators are universal: neg which negates the number and
inv which inverts it. 

Non-complex numbers all have round, floor, abs, ceil which takes, for example,
-2.3 to -2, -3, 2.3, and -2. 

Complex numbers have abssq which, given x+iy,  will yield  x^2 + y^2. We do
not have abs since that involves square roots and will lead rationals out of
being rational. They also have re and im which yield x, respectively y, from
an input of x+iy. 

Integers have `.shift(n)` which is the equivalent of multiplying the integer
by 10^n where n is a positive integer.

---!

[on](# "block:")

## TODO

.E()  for all types

.norm() is abs value for all except complex which is the sum of absolute values. 

Figure out construction for hooking functions easily and smoothly. want f,
[relevant types]

Can we subtype so positive integer is possible? 

round robin parser

.to(type) for converting to the given type. Use .type to get the current type. 

Some common questions such as .isZero, .isOne, .isPositive, .isNegative 

Complex: Octant  1a meaning a > b > 0,  1b meaning b > a > 0,  2a meaning -a >
b > 0, ...

Write up docs. 

Documentation and tests. 

Need a strategy for errors, particularly bad inputs. 

Implement subclassing for types so that constant is not a function! Need to do
this soon!

Apply methods -- return new objects

Rationals and the mixed/improrper stuff. Probably want to keep the original
form somewhere. Do we have the ability to manipulate the form directly? 

Garbage collection strategy. For example, if computing 40,000!, we are
currently creating many intermediate objects. 


