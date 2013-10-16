# [math-numbers](# "version: 0.0.1| jostylr")

This is what a "Num" should conform to. Initially, it will just be the usual Nums in the system, but with their operations replaced with a function call. Why? So that we can swap out Nums easily. For example, we may want to use exact arithmetic (at least as much as we can) or complex Nums or some other ring/field/...

## What is a Num?

A Num is an object with various properties and methods defined. (I) is for instance and (P) is for prototype


## Files

Here we define the directory structure for math-numbers.

* [index.js](#num "save:|jshint") This is the node module entry point and only relevant file. It is a small file.
* [README.md](#readme "save:| clean raw") The standard README.
* [package.json](#npm-package "save: json  | jshint") The requisite package file for a npm project. 
* [TODO.md](#todo "save: | clean raw") A list of growing and shrinking items todo.
* [LICENSE](#license-mit "save: | clean raw") The MIT license.
* [.travis.yml](#travis "save:") A .travis.yml file for [Travis CI](https://travis-ci.org/)
* [.gitignore](#gitignore "Save:") A .gitignore file
* [.npmignore](#npmignore "Save:") A .npmignore file


### Examples

    x = new Num(5, "eint");
    y = new Num(2, "fint");
    z = x.add(y); 
    z = z.mul(x.add(x).sub(y)).quo(y)  // is equivalent to   (z *  (x+x-y)) /y  (intergal part), .rem for remainder
    z = z.mul(y.sub(x.add(3)).div(y) ) // is equivalent to  (z* ((y - (x+3) ) /y)
    z = z.pow(x).floor()   // is  z^x  then floored. 

    z = num(5, "fcplx");

    z = num(5, "fcplx").add(x);

    (z.sin().exp().add(5)).mul(m) //  (exp(sin(z))+5) * m

The `num` function results in the same as `new Num(5)` but it is more compact. This is appropriate for chaining, more so than anything else.  Note that it is only required if the first part of the chain. All the operators will check the arguments and do appropriate parsing. 

### Properties

1. (I) Value. This is some object whose sole function is to represent the value to be used elsewhere. 
2. (P) Type. A name we give it. 
3. (P) Precision.  

### Methods

All methods are on the prototype object. 

1. The operators should be inherited from an operator object passed in. 
2. print (format instructions) -> string representing Num

The prototype object on Num has all of the operators. They then pass everything on to the operator dealing with the right mixture of types. 


### Specials

1. zero  Represents additive identity
2. one  Represents multiplicative identity. 
3. inf Represents infinity
4. neginf Reprents negative infinity


## Num

Here we define the Num class and all associated code. The code below is suitable for browser or node, I hope. Followed underscore's lead with adding global via this for browsers. Node is sweet with module.exports. 

    (function () {

        /*global module*/

        var Num = _"Num constructor";

        if (typeof module !== 'undefined' && module.exports) {
            module.exports = Num;
        } else {
            this.Num = Num;
        }

        Num.ops ={};

        Num.makeOp = _"get right typed operator";

        Num.define = _"Loading ops";

        Num.type = _"Short version of defining number | ife(Num)";

        Num.makeCon = _"make a constant";

        Num.str = _"args to string";

        _"float | ife(Num)";

        _"integer | ife(Num)";

        _"rational | ife(Num)";

        _"scientific | ife(Num)";

        _"complex | ife(Num) ";

        _"combo setup | ife(Num)";

    }).call(this);

## Num constructor


    function (val, type, options) {
        this.original = val;
        this.type = type;
        this.parse.apply(this, options);  // will convert original into appropriate val

        return this;
    }



## Operators

We should have a global class of operators that get instantiated as part of the prototype objects. The Num class itself will create Nums; a properties object can be passed in. 

All of the operators have the same boilerplate to go through and then they call the actual operator. So we will define a factory that produces operators.


### Get right typed operator

We want to pass in an operator and get out a function that handles getting the types right. It does this by looking the type up in Num.ops[name]. If none is found, an Error is thrown. 

This had(?) a subtle bug that if a function passed in undefined, it would be problematic. This could happen wtih optional parameters. Called once, fine. But if called from a caller that is passing an operator, could be an issue. So...we deal with that. 

    function (name) {
        var Num = this;
        return function () {
            var left = this;
            var type = [left.type];
            var str, i, n = arguments.length;
            for (i = 0; i < n; i += 1) {
                if (typeof arguments[i] !== "undefined") {
                    type.push(arguments[i].type);
                }
            }
            var orig = type.join(",");
            n = type.length;
            for (i = 0; i < n; i += 1) {
                str = type.join(",");
               var op = Num.ops[name][str];
                if (typeof op === "function") {
                    return op.apply(left, arguments);
                }
                type.pop();
            }
            throw new Error("Unknown operation "+name+" in given types: "+orig);
        };

    }
    

### Loading ops

To load a set of ops based on a type, we use the following function. It expects a "type,..." string as the first argument and an object consisting of the keys being the operators with value being a function that acts on the Nums. 

    function (types, operators) {
        var Num = this; 
        if (!(Array.isArray(types))) {
            types = [types];
        }
        var i, n = types.length, type, op;
        for (i = 0; i < n; i +=1 ) {
            type = types[i];
            for (op in operators) {
                if (! Num.ops.hasOwnProperty(op) ) {
                    Num.ops[op] = {};
                    Num.prototype[op] = Num.makeOp(op);
                }
                Num.ops[op][type] = operators[op];
            }
        }
    }


### Short version of defining number

Writing out `new Num(3, "float")` is a hassle. So instead we will create a method that creates bound functions to allow for shorthand. 
`

    function (type) { 
        Num.prototype[type] = function () {
            return new Num(this, type);
        };
        return function (val) {
            return new Num(val, type);
        };
    }

### args to string

    function () {
        var ret = [], i, n = arguments.length;
        for (i=0; i < n; i += 1) {
            ret.push( arguments[i].str() );
        }
        return ret;
    }

### Map to string

Just a simple function to implement iterating over an array of Nums and getting string representations. 

    function (value) {
        return value.str(); 
    }

### Make a constant

Constants are handled by giving them a name and having that name be a function that returns the constant appropriate for the type. It is always just the same constant. 

This is at the point where subclassing would be useful. Essentially, this is a hack that uses a common method on all Num instances that can access the specfic kind of constant. To fix this, each type should define a constructor. 

    function (name, value) {
        var fun; 
        if (! Num.prototype.hasOwnProperty(name) ) {
            fun = Num.prototype[name] = function () {
                return fun[this.type];
            };
        } else {
            fun = Num.prototype[name];
        }
        fun[value.type] = value;
    }

### Sign

This is a common method to many of the types. If the value is negative, it returns "-" which is a truthy value. If the value is positive, it returns "" which is falsy value. But it also doubles duty as something to tack onto to strings. 

    function () {
        return (this.val.neg ? "-" : "");
    }

## Minmax

Given the inequality methods, we define a simple helper method to give the max, and below, the min.

    function (r) {
        if (this.INQ(r)) {
            return this;
        } else {
            return r;
        }
    }

## iPow

This is a general algorithm that uses the basic arithmetic operators to implement integral powers. This is the only kind of power that iPow does. It can take in a regular integer or a Num.int integer though large integers are sure to have issues in terms of doing anything. It is more of a convenience to take in Num.int. 

We need to filter this into separate cases. If the power is a positive integer, then we use exponentiating via squaring and produce an integer. If it is is a negative integer, then we end up producing a rational number, namely the numerator is 1 and the denominator is the integer raised to the positive version of the integer. 

    function (power) {
        var x = this;
        if (power instanceof Num) {
            if (power.type === "int") {
                power = parseInt(power.str(), 10);
            } else {
                power = 1;
            }
        }
        var prod = x.unit(), xsq = x;
        if ( (typeof power === "number") && (power > 0) && (Math.floor(power) === power) ) {
            _"exponentiating via squaring"
            return prod;
        } else if ( (typeof power === "number") && (power < 0) && (Math.floor(power) === power) ) {
            power = -power;
            _"exponentiating via squaring"
            return prod.inv();  
        }

    }




### Exponentiating via squaring

Multiplies out the power. We will use the squaring approach to get the power method down to ~ 2log_2(n) number of powers.  

Our approach is to convert the integer power n into binary and then start squaring the base. After each squaring, if the corresponding binary entry is 1, we multiply it into our product 

    
    while (1) {
        if (power % 2) {
            prod = prod.mul(xsq);
        }
        power = Math.floor(power/2);
        if (power >0) {
            xsq = xsq.mul(xsq);
        } else {
            break;
        }
    }



## Float

Here we implement the basic interface using the built-in operators. 

    var float = Num.float = Num.type("float");
    Num.define("float", {
        parse : _"float parse",
        neg : _"float negate",
        round : _"float to int | substitute(FUN, round)",
        floor : _"float to int | substitute(FUN, floor)",
        ceil : _"float to int | substitute(FUN, ceil)",
        abs : _"float unary | substitute(FUN, abs)",
        str : _"float str",
        ipow : _"ipow",
        inv : _"float reciprocal",
        make : float
    });
    Num.define("float,float", {
        add : _"float op | substitute(OP, +)",
        sub : _"float op | substitute(OP, -)",
        mul : _"float op | substitute(OP, *)",
        div : _"float op | substitute(OP, /)",
        pow : _"float binary | substitute(FUN, pow)",
        mgt : _"float minq | substitute(com, >)",
        mgte :_"float minq | substitute(com, >=)",
        mlt : _"float minq | substitute(com, <)",
        mlte : _"float minq | substitute(com, <=)",
        meq : _"float minq | substitute(com, ==)",
        gt : _"float inq | substitute(com, >)",
        gte : _"float inq | substitute(com, >=)",
        lt : _"float inq | substitute(com, <)",
        lte : _"float inq | substitute(com, <=)",
        eq : _"float inq | substitute(com, ==)",
        max : _"minmax | substitute(INQ, gte)",
        mmax : _"minmax | substitute(INQ, mgte)",
        min : _"minmax | substitute(INQ, lte)",
        mmin : _"minmax | substitute(INQ, mlte)"
    });

    float.zero = float(0);
    float.unit = float(1);
    Num.makeCon("zero", float.zero);
    Num.makeCon("unit", float.unit);



### Float parse

We need to parse a normal Num into a Num of type float. 

    function () {
        var original = this.original;
        if (typeof original === "number") {
            this.val = original;
        } else if (typeof original === "string") {
            this.val = parseFloat(original);
        } else if (original && original.hasOwnProperty("type") ) {
            switch (original.type) {
                case 'int' :
                case 'rat' :
                    this.val = parseFloat(original.sci().str(15));
                break;
                case 'sci':
                    this.val = parseFloat(original.str(15));
                break;
                default:
                return false;

            }
        } else {
            return false;
        }
    }

### Float negate

    function () {
        return new Num (-1*this.val, "float");
    }

### Float reciprocal

    function () {
        return new Num (1/this.val, "float");
    }


### Float to int

Some conversions to integers

    function () {
        return new Num (Math.FUN(this.val), "int");
    }

### Float unary

    function () {
        return new Num (Math.FUN(this.val), "float");
    }


### Float op

And then the operators are basically the same as well

    function (b) {
        return new Num ( (this.val OP b.val), "float");
    }

### Float binary 

    function (b) {
        return new Num ( Math.FUN(this.val, b.val), "float");
    }

### Float inq 

    function (b) {
        return (this.val com b.val);
    }

### Float minq 

    function (b) {
        return (Math.abs(this.val) com Math.abs(b.val));
    }


### Float str

This is a terminal method that produces a string representation. Options have not been implemented yet. Probably grab a string formatting library.

    function () {
        return this.val+"";
    }


## Integer

This is the cool base class upon which all else is built. It is an array of numbers (js integers) for which each entry is less than 1e7. This allows for multiplication without loss of precision.  

I am coding this up without worrying about performance at this time. The goal is for educational value, not for doing anything serious. That is to say, I simply want to be able to do exact arithmetic and/or explore error bounds, significance, Newton's method, etc.,  and that means being able to deal with large numbers. 

Each value is represented by an array of js integers with the first entry being the lowest entry. That is, 23,567,654 would be represented as [3567654, 2]. The array also has a property called neg which is a boolean flag for being negative or not. 

    var lim = 1e7;  //this controls the size
    var zero, unit; 
    var halflim = 5e6;
    var digits = (lim+"").slice(1);
    var reduce = _"int reduce";
    var mcom = _"mass comparison";
    var dcom = _"directed comparison";
    var int = Num.int = Num.type("int");
    var div = Num.int.divalgo = _"int division algorithm";
    var ident = function () {return int(this.val);};

    Num.define("int", {
        parse : _"int parse",
        neg : _"int negate",
        abs : _"int abs",
        str : _"int str",
        ceil : ident,
        floor: ident,
        ipow : _"ipow",
        round: ident,
        sign: _"sign",
        inv : _"int reciprocal",
        shift : _"int shift",
        make: int
    });
    Num.define("int,int", {
        add : _"int add",
        sub : _"int sub",
        mul : _"int mul",
        div : _"int div",
        quo : _"int quo",
        rem : _"int rem",
        mgt : _"int bool | substitute(C, mcom, INQ, > 0)",
        mgte : _"int bool | substitute(C, mcom, INQ, >= 0)",
        mlt : _"int bool | substitute(C, mcom, INQ, <  0)",
        mlte : _"int bool | substitute(C, mcom, INQ, <= 0)",
        meq : _"int bool | substitute(C, mcom, INQ, === 0)",
        gt : _"int bool | substitute(C, dcom, INQ, > 0)",
        gte : _"int bool | substitute(C, dcom, INQ, >= 0)",
        lt : _"int bool | substitute(C, dcom, INQ, <  0)",
        lte : _"int bool | substitute(C, dcom, INQ, <= 0)",
        eq : _"int bool | substitute(C, dcom, INQ, === 0)",
        gcd : _"int gcd",
        lcm : _"int lcm",
        max : _"minmax | substitute(INQ, gte)",
        mmax : _"minmax | substitute(INQ, mgte)",
        min : _"minmax | substitute(INQ, lte)",
        mmin : _"minmax | substitute(INQ, mlte)"
    });

    int.zero = zero = int(0);
    int.unit = unit = int(1);
    Num.makeCon("zero", zero);
    Num.makeCon("unit", unit);    


### Int Parse

Initially already assume given in form. Just to get the rest right. 

The string parsing should reverse the .str method. So first it checks for a minus sign. Then it parses backwards 7 digits 

    function self () {
        var o = this.original, dl;
        var ret = [], i, n, digit;
        if (Array.isArray(o)) {
            ret.neg = o.neg || false;   
            // check to make sure all entries are numbers
            n = o.length;
            for (i = 0; i < n; i += 1) {
                digit = o[i];
                if (! digit ) {
                    ret[i] = 0;
                } else if ( typeof digit === "number") {
                    ret[i] = digit;
                } else {
                    ret[i] = parseInt(digit, 10);
                }
            }
        } else if (typeof o === "string") {
            if (o[0] === "-") {
                ret.neg = true;
                o = o.slice(1);
            } else {
                ret.neg = false;
            }
            dl = digits.length;
            while (o.length >0) {
                ret.push(parseInt(o.slice(-dl), 10));
                o = o.slice(0, -dl); 
            }
        } else if (typeof o === "number") {
            if (o < 0) {
                ret.neg = true;
            } else {
                ret.neg = false;
            }
            ret[0] = Math.floor(Math.abs(o)); 
        } else if (o.hasOwnProperty("val")) {
            ret = self.call({original : o.val}).val;
        } else { // declare failure
            return false; //ret[0] = NaN;
        }


        this.val = reduce(ret);
        // clean out zeros in the front
        while ( (ret.length > 1) && (ret[ret.length -1] === 0) ) {
            ret.pop();
        }

        return this;
    }

### Int Negate

    function () {
        var clone = int(this.val);
        clone.val.neg = !clone.val.neg;
        return clone; 
    }


### Int reciprocal

    function () {
        var x = this;
        return Num.rat({neg: x.sign(), w:zero, n: unit, d: x});
    }

### Int Abs

    function () {
        var clone = int(this.val);
        clone.val.neg = false;
        return clone; 
    }

### Int sign

    function () {
        return this.val.neg || false;
    }

### Int shift

This will return a shifted integer d places. We do this by converting the integer to a string, splitting that into an array, adding 0's, and then joining it into a string before passing it to the int() function. 

    function (d) {
        if ( d>0) {
            var str = this.str().split('');
            var i;
            for (i = 0; i < d; i += 1) {
                str.push("0");
            }
            return int(str.join(""));
        } else {
            return this;
        }
    }


### Int Str

Reverse the array and join it. This is wrong as it misses 0's in between. Need to add some padding. Also need to add in negative sign.

    function() {
        var strarr = [].concat(this.val), temp;
        var i, n = strarr.length;
        for (i = 0; i < n-1; i +=1 ) {
            temp = strarr[i] + "";
            // add zeros
            strarr[i] = digits.slice(temp.length) + temp;
        }
        strarr[n-1] = strarr[n-1]+"";
        var minus = this.val.neg ? "-" : "";
        return minus + strarr.reverse().join("");
    }

### Int Reduce

We need to have something implements reduction of values below the safe limit of 1e7. The incoming value is an array of js integers with the first entry being the lowest entry.  That is, 23,567,654 would be represented as [3567654, 2].

For this, all entries should be positive. 

    function (arr) {
        var i, n = arr.length, cur, big;

        for (i = 0; i < n; i += 1) {
            cur = arr[i];
            if (cur >= lim) {
                big = Math.floor(cur/lim);
                arr[i+1] =  (arr[i+1] || 0) + big;
                arr[i] = cur - big*lim;
            }
        }
        return arr;
    }

### Int Bool

We need to define a series of comparison operators.

    function (b) {
        return (C(this.val,b.val) INQ ) ? true : false;
    }


### Mass Comparison

We will encode the mass of it as whether it is 

    function (a, b) {
        var i, n; 
        if (a.length > b.length) {
            return 1;
        } else if (b.length > a.length) {
            return -1;
        } else {
            n = a.length; // same as b.length
            for (i = n-1; i > -1; i -= 1) {
                if (a[i] > b[i]) {
                    return 1;
                } else if (a[i] < b[i]) {
                    return -1;
                }
            }
            // should be equal at this point, in mass
            return 0;
        }
    }

### Directed Comparison

This is for taking sign into account. 

    function (a, b) {
        if (a.neg) {
            if (b.neg) {
                return mcom(a, b);
            } else {
                // b is larger as a is negative and b is positive
                return -1;
            }
        } else {
            if (! b.neg) {
                return mcom(a, b);
            } else {
                // a is larger as b is negative and a is positive
                return 1;
            }

        }
    }


### Int Add

We use the mgte function to decide which integer is larger in mass (absolute value). We copy the larger one in to the new number and it takes the sign of the larger one. If the signs are the same, we simply add in the smaller one's values. If the signs are different, we first shift the values of the larger one to ensure that it is always greater than the smaller one's values. And then we subtract. 

In both cases, we finish by reducing and creating a new Num. 

    function (b) {
        var i, n, s;
        var a = this;
        var ret;
        if (a.mgte(b)) {
            ret = [].concat(a.val);
            ret.neg = a.val.neg;
            s = b.val;
        } else {
            ret = [].concat(b.val);
            ret.neg = b.val.neg;
            s = a.val;
        }
        if (a.val.neg == b.val.neg) {
            // add
            n = s.length;
            for (i = 0; i < n; i += 1) {
                ret[i] += s[i];
            }
        } else {
            // subtract
            if (ret.length > 1) {
                n = ret.length;
                for (i = 1; i <n-1; i +=1) {
                    ret[i] = ret[i] - 1 + 1e7;
                }
                ret[n-1] -= 1;
                ret[0] += 1e7;
                n = s.length;
                for (i = 0; i < n; i += 1) {
                    ret[i] -= s[i];
                }
            } else {  // both are length 1
                ret[0] -= s[0];
            }
        }

        //reduce(ret);
        return int(ret);
    }

### Int Sub

Just negate and add.

    function (b) {
        return this.add(b.neg());
    }

### Int Mul

Figure out sign separately from the value. The value is obtained by multiplying the various 

    function (fullb) {
        var a = this.val;
        var b = fullb.val;
        var ret = [];
        var mul, ii, nn, i, n = a.length + b.length+1;
        for (i = 0; i < n; i += 1) {
            ret[i] = 0;
        }
        if (a.neg == b.neg) {
            ret.neg = false; 
        } else {
            ret.neg = true;
        }
        n = a.length;
        nn = b.length;
        for (i = 0; i< n; i +=1) {
            mul = a[i];
            for (ii = 0; ii < nn; ii += 1) {
                ret[i+ii] += mul*b[ii];
            }
            reduce(ret);
        }
        return int(ret); 
    }

### Int Division Algorithm

This is the primary implementation of division by integers. It returns the quotient, remainder, and divisor. It can be used to create a rational number, get just the quotient, or just get the remainder. 

This is the high school division algorithm applied to digits written in base 1e7. Looking at other algorithms, this seems to be fine for our needs. See [Master's Thesis](http://bioinfo.ict.ac.cn/~dbu/AlgorithmCourses/Lectures/Hasselstrom2003.pdf‎)

First we check for zero denominator, deal with negatives, and check for numerator being less than denominator in magnitude. If we are still on track, then we scale the numerator and denominator so that the denominator's leading digit is >5e6. We do this to minimize the number of times we need to adjust the quotient digit. This should limit the adjustment to no more than two times though it seems to take a few more times than that at times. 

Once scaled, we then take the first two digits of the numerator to form a number that gets divided by the first digit of denominator. We floor it and use that as the quotient digit. If quotient digit * shifted denominator is > numerator, then we subtract the scaled denominator until it is less than the numerator, updating the the quotient digit by subtracting 1. 

When the multicant is smaller, we subtract and the remainder is then used as the new numerator. We repeat until we exhaust the digits needed. Whatever is left is a remainder and should be less than the denominator. 

Our final action is to scale the remainder down by dividing by the scale factor. This results in a division with no remainder; we call the algorithm itself when the remainder is non-zero and not if it is zero.

I checked the experimental results with WolframAlpha and it all checks out.  


    function self (top, den) {

        var ret = {neg: (top.val.neg !== den.val.neg)};

        if (den.eq(int(0))) {
            return int(NaN);
        }

        var oden = den;

        var q = [];

        // clone values and make positive
        top = int(top.val);
        top.val.neg = false;
        den = int(den.val);
        den.val.neg = false;

        if (top.mlt(den)) {
            ret.q = zero;
            ret.d = den;
            ret.r = top;
            return ret;
        }

        var t,tl, tbig, scale, qdig, temp;
        var d = den.val;
        var dl = d.length-1;
        var dbig = d[dl]; 

        _"modify to make sure denominator is large enough"


        var i, mul, place, n = top.val.length - d.length +1 ;

        for (i = 0; i < n; i += 1) {

            if (top.lt(den) ) {
                break;
            }

            t = top.val; 
            tl = t.length-1;
            
            if (tl === dl) {
                tbig = t[tl];
                mul = int(1);
                place = tl-dl;
            }  else {
                tbig = t[tl]*1e7 + (t[tl-1]||0);
                place = tl - dl -1;
                mul = [];  mul[tl-dl-1] = 1; mul = int(mul);
            }

            qdig = Math.floor(tbig/dbig);
            temp = qdig*dbig;

            while (temp > tbig) {
                temp -= dbig;
                qdig -= 1;
            }
                

            
            q[place] = qdig;
            temp = den.mul(int(qdig)).mul(mul);
            while (temp.mgt(top)) {
                temp = temp.sub(den.mul(mul));
                q[place] -= 1;
            }
            top = top.sub(temp);

        }   
        q = int(q);

        // need to reduce remainder
        if ( (typeof scale !== "undefined") && (top.gt(int(0))) ) {
            top = self(top, scale ).q;
        }
        ret.q = q;
        ret.d = oden;
        ret.r = top;
        return ret;

    }


#### Modify to make sure denominator is large enough

We need to ensure that the denominator's first significant digit is at least as large as half the limit. We can do this by dividing the halflimit by the significant digit, flooring it, and adding one. Then we scale the denominator and numerator by this value. 

    if (dbig < halflim) {
       scale = int(Math.floor(halflim/dbig) + 1);
       top = top.mul(scale);
       den = den.mul(scale);
       d = den.val;
       dl = d.length -1;
       dbig = d[dl];
    }    

### Int gcd

The gcd algorithm is simple. a.gcd(b) is implemented by finding the sequence a_0, a_1, ..., a_i, ... a_n=0 such that a_0>a_1>... and a_i mod a_i-1  =  a_i+1.  That is, we go along dividing and using the remainders. It will end with 0 remainder and the last non-zero remainder is the gcd. 

It terminates because it is a finite list of positive integers descending. The last one is a divisor of the previous because of 0 remainder. Why does the reduction work? We need to see that gcd(a,b) = gcd(b, c) where c = a mod b. Basically, a = q*b + c. So anything that divides both a and b must divide c. And if something divides b and c, then it divides a. 

    function (b) {
        var a = this;
        var big, small, temp;
        var zero = int(0);
        if (a.mgte(b) ) {
            big = a.abs();
            small = b.abs();
        } else {
            big = b.abs();
            small = a.abs();
        }
        while (small.gt(zero)) {
            temp = small;
            small = big.rem(small);
            big = temp;
            if (small.gt(big)) {
                throw new Error ("descent not happening");
            }

        }
        return big;
    }

### Int lcm

Given the gcd, we can simply divide one of them by it and multiply by the other to get the lcm. 

    function (b) {
        var gcd = this.gcd(b);
        return this.quo(gcd).mul(b);
    }

### Int Div

Returns a rational number. 

    function (b) {
        return Num.rat(div(this, b));
    }


### Int Quo

Returns the quotient part.

    function (b) {
        return div(this, b).q;
    }

### Int Rem

Returns the remainder part.

    function (b) {
        return div(this, b).r;
    }


## Rational

This models rational numbers as a triple pair of integers: whole, numerator, denominator and a sign so that all three parts are taken to be positive. 


    var rat = Num.rat = Num.type("rat");
    var int = Num.int;
    var zero = int.zero;
    var unit = int.unit;
    var half;
    var mcom = _"rat mass comparison";
    var dcom = _"directed comparison";

    Num.define("rat", {
        parse : _"rat parse",
        neg : _"rat negate",
        inv : _"rat reciprocal",
        abs : _"rat abs",
        str : _"rat str",
        ipow : _"ipow",
        w : _"rat whole",
        n : _"rat numerator",
        d : _"rat denominator",
        imp : _"rat improper",
        mix : _"rat mixed",
        reduce : _"rat reduce",
        scale : _"rat scale",
        sim : _"rat simplify",
        sign : _"sign",
        floor : _"rat floor",
        ceil : _"rat ceiling",
        round : _"rat round",
        frac : _"rat fraction",
        make: rat
    });
    Num.define("rat,rat", {
        add : _"rat add",
        sub : _"rat sub",
        mul : _"rat mul",
        div : _"rat div",
        mgt : _"rat bool | substitute(C, mcom, INQ, > 0)",
        mgte : _"rat bool | substitute(C, mcom, INQ, >= 0)",
        mlt : _"rat bool | substitute(C, mcom, INQ, <  0)",
        mlte : _"rat bool | substitute(C, mcom, INQ, <= 0)",
        meq : _"rat bool | substitute(C, mcom, INQ, === 0)",
        gt : _"rat bool | substitute(C, dcom, INQ, > 0)",
        gte : _"rat bool | substitute(C, dcom, INQ, >= 0)",
        lt : _"rat bool | substitute(C, dcom, INQ, <  0)",
        lte : _"rat bool | substitute(C, dcom, INQ, <= 0)",
        eq : _"rat bool | substitute(C, dcom, INQ, === 0)",
        max : _"minmax | substitute(INQ, gte)",
        mmax : _"minmax | substitute(INQ, mgte)",
        min : _"minmax | substitute(INQ, lte)",
        mmin : _"minmax | substitute(INQ, mlte)"
    });

    half = rat.half = rat({neg:false, w: zero, n: unit, d: int(2)});
    rat.zero = rat({neg:false, w: zero, n: zero, d: unit});
    rat.unit = rat({neg:false, w: zero, n: unit, d: unit});
    Num.makeCon("zero", rat.zero);
    Num.makeCon("unit", rat.unit);    
    Num.makeCon("half", half);



### rat Parse

string, number, objects already in basic form. Given a version with numbers, probably should clone it. 

    function () {
        var o = this.original, m;
        if (typeof o === "string") {
            m =  o.match(/^\s*(-)?\s*(\d+)?\s+(\d+)?\s*\/?\s*(\d+)?\s*$/);
            if (!m) {
                m =  o.match(/^\s*(-)?(\d+)?\s*\/\s*(\d+)?\s*$/);
                if (!m) {
                    this.val = {neg: false, w: int(NaN), n: int(NaN), d: int(NaN)};
                } else {
                    this.val = {
                        neg: !!m[1], 
                        w: zero,
                        n: int(m[2]||0),
                        d: int(m[3]||1)
                    };                        
                }
            } else {
                this.val = { 
                    neg: !!m[1], 
                    w: int(m[2]||0),
                    n: int(m[3]||0),
                    d: int(m[4]||1)
                };
            }
        } else if (typeof o === "number") {
            if (Math.floor(o) === o ) { // integer
                this.val = {
                    neg: (o < 0),
                    w : Num.int(Math.abs(o)),
                    n : zero,
                    d : unit
                };
            }
        } else if (o.hasOwnProperty("q") ) {
            this.val = {
                neg : o.neg,
                w : o.q.abs() || zero,
                n : o.r || zero,
                d : o.d || unit
            };
        } else if (o.hasOwnProperty("w") ) { // basically correct form already
            this.val = {
                neg : o.neg,
                w : o.w || zero,
                n : o.n || zero,
                d : o.d || unit
            };
        } else if (o.type === "int") {
            this.val = {
                neg : o.sign(),
                w :   o.abs(),
                n :  zero,
                d :  unit
            };
        } else if (o.type === "rat") {
            this.val = {
                neg : o.w.sign(),
                w :   o.w,
                n :  o.n,
                d :  o.d
            };            
        } else {
            return false;    
        }

        return this;
    }

### rat Negate

Flip neg, returning a new value.

    function () {
        var clone = rat(this.val);
        clone.val.neg = !this.val.neg;
        return clone;
    }


### rat Reciprocal

Get it to be improper and then flip and simplify. Check for non-zero. 

    function () {
        this.imp();
        if (this.n().eq(zero)) {
            return rat({w:int(NaN), n:int(NaN), d: int(NaN)});
        }
        return rat({w:zero, n: this.d(), d: this.n()});
    }

### rat Abs

Take neg and turn it false;

    function () {
        var clone = rat(this.val);
        clone.val.neg = false;
        return clone;
    }


### rat Str

Need to put together a string. 

    function () {
        var v = this.val;
        var ret = '';
        if (v.neg) {
            ret = '-';
        }
        if (!v.w.eq(zero) ) {
            ret += v.w.str() + " ";
        }
        if (!v.n.eq(zero) ) {
           ret += v.n.str() + "/" + v.d.str(); 
        }

        if (v.w.eq(zero) && v.n.eq(zero) ) {
            ret = "0";
        }

        return ret;
    }




### rat Whole

Give the whole part of the fraction.

    function () {
        return this.val.w;
    }

### rat Numerator

Give the numerator part.


    function () {
        return this.val.n;
    }
    
### rat Denominator

And the denominator

    function () {
        return this.val.d;
    }


### rat Improper

Makes the current form improper. This may have its uses, but probably mostly for display. Numbers should be thought of as largely immutable. As such, once a form is computed, it should be stored and it can be used quickly to switch. 

    function () {
        var imp, v, w, d, n;
        v = this.val;
        if (this.improper) {
            v = this.improper;
        } else {
            this.val = this.improper = imp = {};
            imp.neg = v.neg;
            w = v.w;
            d = v.d;
            n = v.n;
            imp.n = n.add(w.mul(d));
            imp.d = d;
            imp.w = zero;
        }
        return this; // for chaining
    }

### rat Mixed

Makes the current form mixed. We still assume it is of the form w n/d where presumably w is 0, but perhaps it is not a properly reduced form.

    function () {
        var mix, v, w, d, n, temp;
        v = this.val;
        if (this.mixed) {
            v = this.mixed;
        } else {
            this.mixed = this.val = mix = {};
            mix.neg = v.neg;
            w = v.w; 
            d = v.d;
            n = v.n;
            temp = n.div(d);
            mix.w = (w||zero).add(temp.w());
            mix.n = temp.n();
            mix.d = d;
        }
        return this;
    }

### rat Reduce

Automatic reduction of numerator and denominator:

    function () {
        var r = this.val;
        var gcd = r.n.gcd(r.d);
        if (r.d.eq(gcd)) {
            r.w = r.w.add(r.n.quo(gcd));
            r.n = zero;
            r.d = unit;
        } else {
            r.n = r.n.quo(gcd);
            r.d = r.d.quo(gcd);
        }
        return this;
    }

### rat Simplify

Convenience method to both eliminate common factors in n/d as well as make it a mixed number.

    function () {
        this.mix().reduce();
        if (this.n().eq(zero)) {
            return (this.sign() ? this.w().neg() : this.w());
        } else {
            return this;
        }
    }

### rat Floor

Eliminate the fraction part going down.

    function () {
        this.mix();
        return this.w();
    }

### rat Ceiling

Eliminate the fraction part going up.

    function () {
        this.mix();
        return this.w().add(unit);
    }


### rat Fraction

Returns the fraction part of the rational number. This is after applying mix.

    function () {
        this.mix();
        return rat({neg:this.neg, w:zero, n:this.n(), d:this.d()});
    }

### rat Round

Eliminate the fraction part going down.

    function () {
        this.mix();
        if (this.frac().gt(half)) {
            return this.w().add(unit);
        } else {
            return this.w();
        }
    }

### rat Scale

We scale the fraction part by the passed in s.

    function (s) {
        var r = this.val;
        r.n = r.n.mul(s);
        r.d = r.d.mul(s);
        return this;
    }

### rat Add

To add two fractions of the same sign, we add the whole parts separately from the proper fraction parts. The proper fractions we combine by common denominators. 

If they are of different sign, we put them into improper fractions, make common denomiators, and subtract the smallest from the largest. 

    function (b) {
        var l = this.val;
        var r = b.val;
        var neg, w, n, d, gcd, big, small;
        gcd = l.d.gcd(r.d);
        d = l.d.quo(gcd).mul(r.d);
        if (l.neg == r.neg) {
            w = l.w.add(r.w);
            n = l.n.mul(r.d.quo(gcd)).add(r.n.mul(l.d.quo(gcd)));
            neg = l.neg;
            return rat({neg:neg, w: w, n: n, d:d});
        } 
        this.imp();
        b.imp();
        l = this.val;
        r = b.val;
        if (l.neg) { //l neg, r positive
            if (this.mgt(b)) {
                neg = true;
                big = l;
                small = r;
            } else {
                neg = false; 
                big = r;
                small = l;
            }
        } else { // l pos, r neg
            if (b.mgt(this) ) {
                neg = true;
                big = r;
                small = l;
            } else {
                neg = false;
                big = l;
                small = r;
            }
        }
        n = big.n.mul(small.d.quo(gcd)).sub(small.n.mul(big.d.quo(gcd)));
        return rat({neg:neg, w:zero, n:n, d:d}).mix();
    }

### rat Sub

We negate and apply the addition function

    function (b) {
        return this.add(b.neg());
    }

### rat Mul

Check signs separately. Multiply all of it and combine: (w + n/d) (v + m/c) =  wv + wm/c + vn/d + mn/(dc). So the easiest way to code this is to compute out the four rational numbers above and then invoke addition. 

    function (b) {
        var l = this.val;
        var r = b.val;
        var neg = (l.neg != r.neg);
        var wv = rat({w:l.w.mul(r.w), neg:false, n:zero, d: unit});
        var wmc =  rat({w:zero, neg : false, n : l.w.mul(r.n), d: r.d});
        var vnd =  rat({w:zero, neg : false, n : r.w.mul(l.n), d: l.d});
        var mndc =  rat({w:zero, neg : false, n : l.n.mul(r.n), d: l.d.mul(r.d)});
        var ret = wv.add(wmc).add(vnd).add(mndc);
        ret.val.neg = neg;
        return ret;
    }

### rat Div

Reciprocate and then multiply.

    function (b) {
        return this.mul(b.inv());
    }


### Rat Bool

We need to define a series of comparison operators 

    function (b) {
        this.mix();
        b.mix();
        return (C(this.val,b.val) INQ ) ? true : false;
    }


### Rat Mass Comparison

This is without regard to sign. So first check the whole, then go to the fraction part: a = w + n/d and b = v+m/c so  if w = v then a < b if  n/d < m/c  or  n*c < m*d

    function (a, b) {
        var nc, md;
        if (a.w.gt(b.w) ) {
            return 1;
        } else if (a.w.lt(b.w)) {
            return -1;
        } else {
            nc = a.n.mul(b.d);
            md = b.n.mul(a.d);
            if (nc.gt(md)) {
                return 1;
            } else if (nc.lt(md)){
                return -1;
            } else {
                return 0;
            }
        }
    }




## Scientific

This models the scientific precision numbers as an integer and and a magnitude with a precision level. After computations are done, the precision rules dictate the new precision and all digits after that are truncated. 

Exact numbers can have a precision of Infinity



    var sci = Num.sci = Num.type("sci");
    var int = Num.int;
    var zero = int.zero;
    var unit = int.unit;
    var digcom = _"leading digit comparison";
    var mcom = _"sci mass comparison";
    var dcom = _"directed comparison";
    var divsci = _"division for scientific numbers";
    var detpre = _"figure out to string precision";
    

    Num.define("sci", {
        parse : _"sci parse",
        neg : _"sci negate",
        inv : _"sci reciprocal",
        abs : _"sci abs",
        str : _"sci str",
        ipow : _"ipow",
        coef : _"sci coef",
        lead : _"sci leading digit",
        slice : _"sci slice the digits",
        i : _"sci integer",
        E : _"sci power of ten",
        iE : _"sci placement of last digit",
        pre : _"sci precision level",
        sign : _"sign",
        floor : _"sci floor",
        ceil : _"sci ceiling",
        round : _"sci round",
        make: sci
    });
    Num.define("sci,sci", {
        add : _"sci add",
        sub : _"sci sub",
        mul : _"sci mul",
        div : _"sci div",
        mgt : _"sci bool | substitute(C, mcom, INQ, > 0)",
        mgte : _"sci bool | substitute(C, mcom, INQ, >= 0)",
        mlt : _"sci bool | substitute(C, mcom, INQ, <  0)",
        mlte : _"sci bool | substitute(C, mcom, INQ, <= 0)",
        meq : _"sci bool | substitute(C, mcom, INQ, === 0)",
        gt : _"sci bool | substitute(C, dcom, INQ, > 0)",
        gte : _"sci bool | substitute(C, dcom, INQ, >= 0)",
        lt : _"sci bool | substitute(C, dcom, INQ, <  0)",
        lte : _"sci bool | substitute(C, dcom, INQ, <= 0)",
        eq : _"sci bool | substitute(C, dcom, INQ, === 0)",
        max : _"minmax | substitute(INQ, gte)",
        mmax : _"minmax | substitute(INQ, mgte)",
        min : _"minmax | substitute(INQ, lte)",
        mmin : _"minmax | substitute(INQ, mlte)"
    });

    sci.zero = sci({i:int(0), neg: false, p:Infinity, E: 0});
    sci.unit = sci({i:int(1), neg: false, p:Infinity, E: 0});
    Num.makeCon("zero", sci.zero);    
    Num.makeCon("unit", sci.unit);

### sci parse

A scientific number value contains a sign, an integer, an exponent E for power of 10, and a precision level. 

The precision is the number of significant digits. Generally, one extra digit is left on for semi-significance. When parsing in a string, the last digit is considered semi-significant.

    function () {
        var o = this.original, m, digits;
        if (typeof o === "string") {
            m =  o.match(/^(-)?(\d+)(?:\.(\d+))?(?:(?:E|e)((?:\-|\+)?\d+))?(?:\:(\d+))?$/);
            if (!m) {
                this.val = {neg: false, i: int(NaN), E: 0, p: 0};
            } else {
                digits = m[2] + (m[3]||'');
                this.val = {
                    neg: !!m[1], 
                    i: int(digits),
                    E: parseInt(m[4], 10),
                    p: (m[5] ? parseInt(m[5], 10) : digits.length-1 ) || 1 
                };              
            } 
        } else if (typeof o === "number") {
            this.val = sci(o.toExponential()).val; // lazy path
        } else if (o.hasOwnProperty("E") ) { // basically correct form already
            this.val = {
                neg : o.neg,
                i : o.i || zero,
                E : o.E,
                p : o.p || 32
            };

        } else if (o.type === "int") {
            this.val = {
                neg : o.sign(),
                i :   o.abs(),
                E :  o.str().length-1,
                p :  Infinity,
                rep : zero  //what is this?
            };            
        } else if (o.type === "rat") {
            this.val =  _"rat conversion to sci| ife(o, zero, int, divsci, sci) ";
        } else {
            return false;
        }

The property .iE is the last digit's placement. We take E and subtract the number of digits from it to get it, +/- 1 or so.  1.32E5 has  iE 3 :   5 - (3-1) = 3,  1.2324E-7   iE  : -7 - (5 -1) = -11

        this.val.iE = this.val.E - (this.val.i.str().length - 1);
        this.val.p = this.val.p || 1;

To catch zero, we put E to -oo.


        if (this.val.i.eq(zero ) ) {
            this.val.E = -Infinity;
        }
        return this;
    }

### precision length and E

To be deleted eventually. The idea was to cut the number short when defined, but I think it is more reasonable to let it be at whatever and then manipulate on the method level. In other words, if adding, round at that stage to do the adding. 

This bit checks to make sure the sci number is not more precise than the given precision, up to 1 extra digit. Then it also computes the property iE which is the place value of the last digit. 

    // check length of i vs. pre
    var str = this.val.i.str();
    var temp;
    console.log("pre, E", this.val.p, str.length, str);
    if (str.length > this.val.p+1) {

        temp = int(str.slice(0, this.val.p+1));

        this.val.i = temp;
        this.val.iE = this.val.E -   this.val.p;
    } else {
        this.val.iE = this.val.E -str.length - 1;
    }



#### rat conversion to sci


Designed to be an ife using variable from environment: o, zero, int, divsci, sci

What gives precision level? Shouldn't this be passed in?

    var pre,l, i, E, ext, str, divres, val;
    o.mix();

    pre = parseInt(arguments[0], 10);
    if (isNaN(pre) ) { pre = 32;}
    str = o.w().str();
    l = o.w().eq(zero) ? 0 : str.length;
    if (l >= pre) {
        i = int(str.slice(0, pre));
        E = l-1;
    } else {
        if (l === 0) {
            divres = divsci(o.n(), o.d(), pre);
        } else {
            ext = pre-l;
            divres = divsci(o.n(), o.d(), ext);
            divres = sci(o.w()).add(divres);
        }
        i = divres.i();
        E = divres.E(); 
    }
    val = {
        neg : o.sign(),
        i:   i,
        E :  E,
        p :  pre
    };    
    return val;        




### sci negate

Flip the sign. 

    function () {
        var clone = sci(this.val);
        clone.val.neg = !clone.val.neg;
        return clone;
    }



### sci abs

    function () {
        var clone = sci(this.val);
        clone.val.neg = false;
        return clone;
    }

### sci str

    function (level) {
        var pre = this.pre();
        pre =detpre(level, pre);
        var out = this.round(pre+1);
        var temp = out.val.i.str();

        // !! quick hack to get 0 and 1 looking reasonable
        if ( (temp.length === 1) && (this.E() === 0) ) {
            return this.sign() + temp;
        }
        var i = temp[0]+"."+temp.slice(1);
        if (temp.length < pre + 1) {
            if (isFinite(pre)) {
                return this.sign()+i+"E"+this.E()+ ":"+pre;        
            } else {
                return this.sign()+i+"E"+this.E()+ ":oo";
            }        
        } else {
            return this.sign()+i+"E"+this.E();        
        }
    }

#### figure out to string precision

The goal of this is to take in a level and a precision for string output and determine what to round the number to. 

    function (level, pre) {
        var ret; 
        if (typeof level === "string") {
            if (level === "oo") {
                return Infinity;
            } else {
                ret = parseInt(level, 10);
                if (!isNaN(ret)) {
                    return ret;
                }
            }
        }
        if (typeof level === "number") {
            return level;
        }
        return pre;
    }

    
### sci eng

This allows for more engineering type precision output. Basically, allows one to shift the decimal point to make hundreds and so forth more visibile, e.g.,  1.2E1 is more readily read as 12 so x.eng() would do that. 

This is kind of tricky. If E is > than num, then we use the str method. Otherwise, we need to break it up based on E>0. If E>0 but the length of the integers is less than num, then we need to pad it with 0's. If greater than num, then we can just slice with decimals. If v.E<0, then we pad with the appropriate 0's. No need to break it into cases. 

!!! Need to check out all the cases and in particular make sure the lengths are not off by 1 or something. 

!!! This is not quite engineering notation. They use multiples of 3 for the exponent. so E is just 3 or -9 never -8 for example. 

    function (num) {
        num = num || 3; 
        var v = this.val;
        v i, sign, temp, flag, p;
        if (Math.abs(v.E) <= num) {
            sign = this.sign();
            temp = v.i.str();
            if (v.E>0) {
                if (temp.length <= num) {            
                    i = temp.split(''); 
                    while (i.length < num) {
                        i.push('0');
                    }
                    i = i.join('');
                    flag = true; // no decimal points
                } else {
                    i = temp.slice(0,num)+"."+temp.slice(num);
                }
            } else {
                    i = temp.split(''); 
                    while (i.length < num) {
                        i.unshift('0');
                    }
                    i.unshift('0.');
                    i = i.join('');                
            }
            p = v.p;
            if (p > i.length) {
                if (flag) {
                    i += ".";
                }
                i = i.split('');
                while (i.length < p) {
                    i.push('0');
                }
                i = i.join('');
            }
            var p = (v.p > i.length ? ":"+v.p : "");
            return sign+i+E+p;
        } else {
            return this.str();
    }

### sci coef

This returns an integer with at most `pre` digits. If there is no `pre`, then it returns the full integer. The integer in either case is the scientific number's mantissa (significand).

    function (pre) {
        var istr;
        if ((typeof pre === "number") && (pre < Infinity) ) {
            istr = this.val.i.str();
            return int(istr.slice(0, pre));  // 
        } else {
            return this.val.i;
        }
    }
    
### sci leading digit

Return just the leading digit.

    function () {
        var i = this.val.i;
        return i.str()[0];
    }
    
### sci slice the digits

Given a number, return the first n digits and E. If n is negative, then it goes from the end. 

    function (n) {
        var v = this.val;
        var str = v.i.str();
        if (n > 0) {
            str = str.slice(0,n);
        } else if (n<0) {
            str = str.slice(n);
        } else {
            return str;
        }
        return str;
    }

### sci integer

This returns the integer value, that is if it is 1.34E4, then it returns 134. 

    function () {
        return this.val.i;
    }

    
### sci power of ten

    function () {
        if (! this.val.E) {
            return 0;
        }
        return this.val.E;
    }
    
### sci precision level

    function () {
        return this.val.p;
    }
    
### sci placement of last digit

    function () {
        return this.val.iE;
    }
    
### sci floor

This creates a new sci number by truncating after n digits. For negative numbers, it shifts the last digit down by 1.  

If adding 1 shifts the leading digit up to another power of 10, this will get E to be wrong. We detect this by the length of the string of the integer. Then we modify E. 

!!! check sign behavior around 0 for this.

    function (n) {
        var i = this.val.i.str();
        if (i.length <= n) {  // already done
            return sci(this.val);
        }
        i = int(i.slice(0,n));
        var old;
        var E = this.E();
        if (this.sign()) { //negative
            old = i.str();
            i = i.add(unit);
            if (i.str().length > old) {
                E += 1;
            }
        } 
        return sci({
            i : i,
            E: E,
            p : (n < this.pre()) ? n : this.pre(),
            neg : this.sign()
        });
    }
    
### sci ceiling

The ceiling function is the floor function doubly negated:  -floor(-x) = ceil
    function (n) {
        return this.neg().floor(n).neg();
    }
    
### sci round

The round function is the floor function shifted by 0.5:  floor(x+0.5) = round

But for us it is a little more complicated. We have n

    function (n) {
        if (this.val.i.str().length <= n) {  // already done
            return sci(this.val);
        }
        var half = sci({neg: false, i:int(5), E:this.E()-(n-1)-1, p:Infinity});
        return this.add(half).floor(n);
    }
    
### sci add

To add scientific numbers, we pad with zeros all the numbers to have the same iE (last digit's decimal place) level. This is without regards to precision. 

To figure that out, we take the  minimum iE and then subtract that from each iE and add those number of zeros. 

The precision of the new number should be set so that the minimum of the iE version of precision is attained. That is, for each number's E, compute  E - (precision - 1) to get the precision iE. The maximum of those is the iE to use. Once we have that, we take the new E solve for precision:  piE = E - (pre -1),  pre = (E - p) + 1


    function (r, level) {
        var l = this;
        var ret = {};
        var iE = Math.min(l.iE(), r.iE());
        // get left value in shape
        var lval = l.coef().shift(l.iE()-iE);
        var llength = lval.str();
        if (l.sign()) {
            lval = lval.neg();
        }
        // get right value in shape
        var rval = r.coef().shift(r.iE()-iE);
        var rlength = rval.str();
        if (r.sign() ) {
            rval = rval.neg();
        }
        // add
        var significand = lval.add(rval);
        // deal with sign
        if (significand.sign()) {
            ret.i = significand.neg();
            ret.neg = true;
        } else {
            ret.i = significand;
            ret.neg = false;
        }
        // new E level
        ret.E = Math.max(l.E(), r.E());
        if (ret.i.str().length > Math.max(llength, rlength) ) {
            ret.E += 1;
        }
        // precision issues 
        var lpie = l.E() - (l.pre()-1);
        var rpie = r.E() - (r.pre() -1);
        ret.p = detpre(level, ret.E - Math.max(lpie, rpie)+1);
        return sci(ret);
    }
    
### sci sub

    function (b, level) {
        return this.add(b.neg(), level);
    }
    
### sci mul

To multiply scientific numbers, we multiply the integers, add the Es and then truncate the digits based on the min precision level. We do a bit of precision pruning before multiplication to minimize computations. The +4 is a bit random, but we want to make sure the precision is sufficient. This should be investigated. I imagine +1 or +2 is fine, but +4 should be very safe and not a big drain on resources.

    function (r,level) {
        var l = this;
        var ret = {};
        if ( (l.i().eq(zero)) || (r.i().eq(zero)) ) {
            return sci.zero;
        }
        var pre = ret.p = detpre(level, Math.min(l.pre(), r.pre()));
        ret.i = l.coef(pre+20).mul(r.coef(pre+20));
        ret.E = l.E() + r.E();
        ret.neg = l.sign() != r.sign() ;
        return sci(ret);
    }


### sci Pow

Same algorithm as in integer...

    function (power, level) {
        var x = this;
        var prod, xsq;
        if ( (typeof power === "number") && (power > 0) && (Math.floor(power) === power) ) {
            prod = unit;
            xsq = x.make(x.val);
            while (1) {
                if (power % 2) {
                    prod = prod.mul(xsq, level);
                }
                power = Math.floor(power/2);
                if (power >0) {
                    xsq = xsq.mul(xsq, level);
                } else {
                    break;
                }
            }
            return prod;
        } else if ( (typeof power === "number") && (power < 0) && (Math.floor(power) === power) ) {
            prod = unit;
            xsq = x.make(x.val);
            power = -power;
            while (1) {
                if (power % 2) {
                    prod = prod.mul(xsq, level);
                }
                power = Math.floor(power/2);
                if (power >0) {
                    xsq = xsq.mul(xsq, level);
                } else {
                    break;
                }
            }
            return prod.inv();
        }
    }
    
### Division for scientific numbers

This is a stand-alone function that takes in two integers and a precision. It returns a scientific number whose precision is the given precision. 

We start with the lengths of the numerator and denominator. The first quantity to compute is numerator.length - denominator.length. This is roughly the natural precision of the division. If the denominator is larger, than the quotient is 0 and that is reflected in a negative precision. We can use this basic precision and subtract it from the given precision. This gives us the padding we need to apply to the numerator to get a "decimal" with the given precision with possibly one extra place of precision. 

Once we have computed the padding, we shift the numerator and do the division, getting the quotient. The length of the quotient minus the padding minus 1 is the E for the scientific number. If the length is greater than the precision, we truncate. 

    function (num, den, pre) {
        if (num.eq(zero)) {
            return sci.zero;
        }
        if (den.eq(zero)) {
            return sci({i : Num.int(Infinity), 
                E: 0,
                p : pre,
                neg : false
            });
        }
        var nstr = num.str();
        var dstr = den.str();
        var minpre = nstr.length - dstr.length;
        var padding = pre - minpre+20;
        var newlength = padding+nstr.length;
        var newn = nstr.split('');
        while (newn.length < newlength) { // to make precise enough
            newn.push(0);
        }
        newlength += 20;
        while (newn.length > newlength) { // to eliminate excess precision
            newn.pop();
        }
        var quo = int(newn.join('')).quo(den);
        var quostr = quo.str();
        var E = quostr.length - padding -1;
        return sci({
            i : quo, 
            E: E,
            p : pre,
            neg : false
        });
    }

### sci reciprocal

    function (level) {
        return unit.div(this, level); //divsci(unit, this.val.i, detpre(level, this.pre()));
    }


### sci div

The pre level +20 is roughly the size of the return value. If pre is infinite, we have chosen 500 as a sufficient size. 


    function (den, level) {
        var num = this;
        var pre = detpre(level, Math.min(num.pre(), den.pre()));
        if (pre === Infinity) {
            pre = 500; 
        }
        var quo = divsci(num.coef(), den.coef(), pre);
        var E = num.E() - den.E();
        if (digcom(num.val, den.val) === -1) {
            E -= 1;
        } // + quo.E();
        var sign = (num.sign() == den.sign() ) ? false : true;
        return sci({
            i : quo.val.i,
            E : E,
            p: pre,
            neg : sign
        });
    }
    
### sci bool

We need to define a series of comparison operators.

    function (b) {
        return (C(this.val,b.val) INQ ) ? true : false;
    }


### sci Mass Comparison

This is without regard to sign. If E is larger than that number is larger than the other. Otherwise, we look at the digits up to the least precision. If they are not different up to that, we treat them as equal. 

    function (a, b) {
        if (a.E > b.E) {
            return 1;
        } else if (a.E < b.E) {
            return -1;
        } else {
            return digcom(a, b); 
        }
    }

#### leading digit comparison

Given two scientific numbers, determine which one is larger in terms of its digits, treating the leading digit as the same place. 

Comparing the integer parts using integer relations is inadequate since 1.45E34 and 1.356E34 will have 1356 as larger while we want 145 to be the larger. 

We implement this by slicing at the minimum pre+1 level (more precision is not warranted) and then comparing the leading digits until a difference is found.

    function (a, b) {
       var pre, ai, bi, i, n, ain, bin;
        pre = Math.min(a.p, b.p)+1;
        ai = a.i.str().slice(0,pre).split('');
        bi = b.i.str().slice(0,pre).split('');
        n = ai.length;
        for (i = 0; i < n; i += 1) {
            if (bi.length === 0) {
                return 1;
            }
            ain = ai.pop();
            bin = bi.pop();
            if (ain > bin) {
                return 1;
            } else if (ain < bin) {
                return -1;
            }
        }
        if (bi.length > 0) {
            return -1;
        }
        // same length and same digits. 
        return 0; 
    }



## Complex

This should complexify the already existing types. 


    var com = Num.com = Num.type("com");
    var int = Num.int;
    var zero = int.zero;
    var unit = int.unit;
    var pi, halfpi, tau; //!!!!  define these and arctan


    Num.define("com", {
        parse : _"com parse",
        neg : _"com negate",
        inv : _"com reciprocal",
        abs : _"com abs",
        abssq : _"com abssq",
        str : _"com str",
        ipow : _"ipow",
        re : _"com real",
        im : _"com imaginary",
        apply : _"com apply to parts",
        apply_re : _"com apply to real",
        apply_im : _"com apply to imag",
        theta : _"com polar angle",
        make: com
    });
    Num.define("com,com", {
        add : _"com add",
        sub : _"com sub",
        mul : _"com mul",
        div : _"com div"
    });

    com.zero = com({re:zero, im: zero});    
    com.unit = com({re:unit, im: zero});
    Num.makeCon("zero", com.zero);    
    Num.makeCon("unit", com.unit);


### com Parse

    function () {
        var o = this.original;
        if (o.hasOwnProperty("re") && o.hasOwnProperty("im") ) {
            this.val = {re: o.re, im: o.im};
        } 
        return this;
    }


### com negate

Negate both quantities.


    function () {
        var val = this.val;
        var clone = {
            re : val.re.neg(),
            im : val.im.neg()
        };
        return com(clone);
    }
    
### com reciprocal

We implement  1/(a+bi) =  (a-bi)/(a^2 + b^2)

    function () {
        var mag = this.abssq();
        var clone = {
            re : this.re().div(mag),
            im : this.im().neg().div(mag)
        };
        return com(clone);
    }
    
### com abssq

    function () {
        var re = this.val.re;
        var im = this.val.im;
        return re.mul(re).add(im.mul(im));
    }
    
### com abs

    function () {
        return this.abssq().sqrt();
    }

### com str

Fairly simple; just use existing prints. But need to deal with 0 and 1 coeficients as well as negatives. 

    function () {
        var re, im, plus;
        re = this.val.re.str();
        if (! this.val.im.sign()) {
            plus = "+";
        } else {
            plus = '';
        }
        if (re === "0") {
            re = '';
            if (plus === "+") {
                plus = '';
            }
        }
        im = this.val.im.str()+"i";
        if (im === "0i") {
            im = '';
            plus = '';
        }
        if (im === "1i") {
            im = 'i';
        }
        if (im === "1i") {
            im = '-i';
        }
        return re + plus + im;
    }
    
    
### com real

    function () {
        return this.val.re;
    }
    
### com imaginary

    function () {
        return this.val.im;
    }
    
### com apply to parts

The applies are mainly for manipulating presentation of rational parts. 

    function () {
        this.apply_re.apply(this, arguments);
        this.apply_im.apply(this, arguments);
        return this;
    }
    
### com apply to real

    function (str) {
        return this.val.re[str].apply(this, Array.prototype.slice.apply(arguments, 1));
    }

### com apply to imag

    function (str) {
        return this.val.im[str].apply(this, Array.prototype.slice.apply(arguments, 1));
    }


### com polar angle

To comput the polar angle, we need to compute the quadrant and use tan(theta) = y/x. That is, arctan(i/r).

    function () {
        var v = this.val;
        if (v.re.eq(zero)) {
            if (v.im.gt(zero)) {
                return halfpi;
            } else 
                return halfpi.mul(pi.make(1.5));
            }
        var at = v.im.div(v.re).arctan();        
        if (v.re.sign()) { //2 or 3
            if (v.im.sign()) { //q3
                return pi.add(at);
            } else { //q2
                return pi.add(at);
            }
        } else { // 1, 4
            if (v.im.sign() ) { // q 4
                return tau.add(at);
            } else { //q 1
                return at;
            }
        }

    }
    
### com add

We simply add the components seprarately.

    function (r) {
        var lv = this.val;
        var rv = r.val;
        return com({re: lv.re.add(rv.re), im:lv.im.add(rv.im)});
    }
    
### com sub

    function (r) {
        return this.add(r.neg());
    }
    
### com mul

Multiplication is done by (a+bi)(c+di) =  ac + bci + adi -bd = (ac-bd) + i (bc + ad) 

    function (r) {
        var l = this;
        var res = com({
            re : l.re().mul(r.re()).sub(l.im().mul(r.im())),
            im : l.re().mul(r.im()).add(l.im().mul(r.re()))
        });
        return res;
    }
    
### com div

    function (r) {
        return this.mul(r.inv());
    }

### Combo setup

The idea of this is to do automatic conversion from one type to another. Converter takes in an array (or just a single string) of possible types that are going to be matched up with the single type in string b. The ops covered should be the basic binary operators we have. The function is the conversion function.

    var fullops = ['add', 'sub', 'mul', 'div', 'pow', 'mgt', 'mgte', 'mlt', 'mlte', 'meq', 'gt', 'gte', 'lt', 'lte', 'eq', 'max', 'mmax', 'min', 'mmin'];

    var arithops = ['add', 'sub', 'mul', 'div', 'pow'];

    var converter = function (a, b, ops, convert) {
        var firstarg, secondarg, op, aa, i, n, tops;    
        n = a.length;
        for (i = 0; i < n; i +=1 ) {
            aa = a[i];
            tops = ops.slice();
            firstarg = [aa+','+b, b+','+aa];
            secondarg = {};
            while (tops.length > 0) {
                op = tops.pop();
                secondarg[op] = convert(op);
            }
            Num.define(firstarg, secondarg);
        }
    };

    converter(['int'], 'rat', fullops, _"rat conversion");
    converter(['int', 'rat'], 'sci', fullops, _"sci conversion");
    converter(['int', 'rat', 'sci'], 'float', fullops, _"float conversion");
    converter(['int', 'rat', 'sci', 'float'], 'com', arithops, _"anycom conversion");
    converter(['int', 'rat', 'sci', 'float'], '', fullops, _"number conversion");
    converter(['com'], '', arithops, _"number com conversion");

### number conversion

What if we just use a raw number? Happens frequently so far. If left side, then we need to wrap it. But if right, not so much. So we just need to deal here with the right one. We convert it using the make function. Thought I forgot about that, didn't you?


    function (op) {
        return function (r) {
            var result;
            var right = this.make(r);
            result = this[op](right);
            return result;        
        };
    }

### number com conversion

If complex, we need to use the real part's make.

    function (op) {
        return function (r) {
            var result;
            var right = this.re().make(r);
            right = Num.com({re: right, im: right.zero});
            result = this[op](right);
            return result;
        };
    }


### rat conversion

    function (op) {
        return function (r) {
            var l = this, result;
            if (l.type === "rat") {
                result = l[op](r.rat());
            } else {
                result = l.rat()[op](r);
            }
            return result;
        };
    }

### float conversion

Float is contagious. Its existence is as a means to speed computations up and a simple test class. 

    function (op) {
        return function (r) {
            var l = this, result;
            if (l.type === "float") {
                result = l[op](r.float());
            } else {
                result = l.float()[op](r);
            }
            return result;
        };
    }


### sci conversion
    
    function (op) {
        return function (r) {
            var l = this, result;
            if (l.type === "sci") {
                result = l[op](Num.sci(r));
            } else {
                result = Num.sci(l)[op](r);
            }
            return result;
        };
    }


### anycom conversion

    function (op) {
        return function (r) {
            var l = this, result;
            if (l.type === "com") {
                result = l[op](Num.com({re:r, im:r.zero()}));
            } else {
                result = Num.com({re:l, im:l.zero()})[op](r);
            }
            return result;
        };
    }


## README


 ## Math-Numbers  [![Build Status](https://travis-ci.org/jostylr/math-numbers.png)](https://travis-ci.org/jostylr/math-numbers)

This is a JavaScript library that implements exact integer arithmetic, arbitrary precision decimals, and other stuff. It is intended for educational purposes and is probably not performant. Yeah, the multiplication algorithm is the simple one. 

It should work equally well in node or browser though mostly it is for the browser. 




## TODO

Documentation and tests. 

Need a strategy for errors, particularly bad inputs. 

Implement subclassing for types so that constant is not a function! Need to do this soon!

## NPM package

The requisite npm package file. Use `npm run-script compile` to compile the literate program.

[](# "json") 

    {
      "name": "DOCNAME",
      "description": "A systematic implementation of different kinds of numbers with a consistent interface",
      "version": "DOCVERSION",
      "homepage": "https://github.com/GHUSER/DOCNAME",
      "author": {
        "name": "James Taylor",
        "email": "GHUSER@gmail.com"
      },
      "repository": {
        "type": "git",
        "url": "git://github.com/GHUSER/DOCNAME.git"
      },
      "bugs": {
        "url": "https://github.com/GHUSER/DOCNAME/issues"
      },
      "licenses": [
        {
          "type": "MIT",
          "url": "https://github.com/GHUSER/DOCNAME/blob/master/LICENSE-MIT"
        }
      ],
      "main": "index.js",
      "engines": {
        "node": ">0.6"
      },
      "devDependencies" : {
        "literate-programming" : "~0.7.2",
        "event-when" : "=0.5.0"
      },
      "dependencies":{
      },
      "scripts" : { 
        "prepublish" : "node ./node_modules/literate-programming/bin/literate-programming.js numbers.md",
        "compile" : "node ./node_modules/literate-programming/bin/literate-programming.js numbers.md",
        "test" : "node ./test/testrunner.js"
      },
      "keywords": ["bigint", "bignum", "arithmetic", "arbitrary", "precision", "numbers"],
      "preferGlobal": "false"
    }

## gitignore

We should ignore node_modules (particularly the dev ones)

    node_modules

## npmignore

We should ignore test, examples, and .md files

    test
    examples
    *.md

## Travis

A travis.yml file for continuous test integration!

    language: node_js
    node_js:
      - "0.10"
      - "0.8"
      - "0.6"

## LICENSE MIT


The MIT License (MIT)
Copyright (c) 2013 James Taylor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
