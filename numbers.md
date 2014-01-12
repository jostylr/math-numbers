# [math-numbers](# "version: 0.1.0| jostylr")

Math-numbers is a project dedicated to exploring math with as little concern about floating point approximations as possible. The idea is that we can use integers and rational numbers of perfect precision while we can still drop into the scientific numbers with an arbitrary precision level whenever we want to. 

The coding syntax for using the numbers is x.add(y).mul(z)  to indicate (x+y)*z while  x.add(y.mul(z)) to do x+(y*z). 

The methods are designed here so that we can write algorithms that will work as long as the input types support the given methods. It is more or less subclassing, but since we need to subclass with operators of multiple arguments and types, it gets a little tricky (as far as I can tell). 


## Files

Here we define the directory structure for math-numbers.

* [index.js](#num "save:|jshint") This is the node module entry point and only relevant file. It is a small file.
* [ghpages/index.js](#num "save:") A copy of the index file for ghpages
* [README.md](#readme "save:| clean raw") The standard README.
* [package.json](#npm-package "save: json  | jshint") The requisite package file for a npm project. 
* [TODO.md](#todo "save: | clean raw") A list of growing and shrinking items todo.
* [LICENSE](#license-mit "save: | clean raw") The MIT license.
* [.travis.yml](#travis "save:") A .travis.yml file for [Travis CI](https://travis-ci.org/)
* [.gitignore](#gitignore "Save:") A .gitignore file
* [.npmignore](#npmignore "Save:") A .npmignore file

Other litpro files (all need extensive work):

* ghpages.md generates the documentation that get displayed in the ghpages for this project. 
* examples.md generates the examples in examples that are also put in ghpages as well.
* test.md generates all the tests.  

## Basic flow

The constuctor `Num` is used to construct a number.  So  `new Num('509823423408', 'int')` creates an integer with the given value.  We also support Num.int('509823423408')`. Working on simply `Num('509823423408')` where it will do a round-robin parsing of the string given to it. 

If parsing fails, it will return a Num object of type `NaN` that infects all other objects that it comes into contact with. But the idea is that there will be tracking information put into it. 

!!! Currently thinking about using underscores for spaces in numbers. Examples:  `1_3/4` for 1 and three-quarters,  `1.2_3` for 1.233333333... 3 repeating (also 1.2+1/30). Or for complex `1.2_4i` Numbers should have no spaces in them for the parsing. Thinking not.

We can also use E notation for numbers:  `123E9` represents one hundred and twenty-three billion. 

### Methods

All methods are on the prototype object of Num. 

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

        var parseFormat = Num.prototype.parseFormat  = _"parse str format";

        var ident = function () {return this;};

        Num.ops ={};

        Num.makeOp = _"get right typed operator";

        Num.define = _"Loading ops";

        Num.type = _"Short version of defining number | ife(Num)";

        Num.makeCon = _"make a constant";

        Num.str = _"args to string";

        Num.toStr =  _"make toString work";

        Num.each = _"generate a string from array of values";

        Num.tryParse = _"try parsing";

        _"float | ife(Num)";

        _"integer | ife(Num)";

        _"rational | ife(Num)";

        _"scientific | ife(Num)";

        _"complex | ife(Num) ";

        _"combo setup | ife(Num)";

        _"nan | ife(Num)";

        var int = Num.int;

        Num.types = [_"Reg Matching"];


    }).call(this);

We added a Num.nan function for making explicit NaN values. This is a handy way of having errors that can propagate up through the chains. 

## Num constructor

Standard usage is that this is a constructor with `this` as the main return value, though it is possible for the parsing to create a new object that gets returned. This is true for [ratdec](#ratdec).


    function (val, type) {
        var ret;

Checks for whether this was a construct call or not. If not, calls the constructor and returns result.

        // allows Num(...) to be used directly without new. For shame!
        if (!(this instanceof Num) ) {
            return new Num(val, type);
        }

        this.original = val;

        if ((val instanceof Num) && (val.type === "NaN") ) {
            return val;
        }

        if (type) {
            this.type = type;
            ret = this.parse();  // will convert original into appropriate val
        } else if (typeof val === "string") {
            ret = Num.tryParse(this);
        } else if (val.type) {
            this.type = val.type;
            ret = this.parse();
        } else if (typeof val === "number") {
            if (Math.floor(val) === val) {
                ret = Num.int(val);
            } else {
                ret = Num.float(val);
            }
        } else {
            ret = false;
        } 

        //this.original = val;

        if (ret === false) {
            ret = this;
            this.type = "NaN";
            this.val = NaN;
        }   

We want to store the original input value, but if it is a Num object, then we stringify it for both debugging and not holding onto a reference unnecessarily. 

        if (val instanceof Num) {
            // to make original more viewable for debugging
            if (val.type === "NaN") {
                return val;
            }
            ret.original = val.str();
        }

        if (!ret) {
            ret = this;
        }

        return ret;
    }

### Short version of defining number

Writing out `new Num(3, "float")` is a hassle. So instead we will create a method that creates bound functions to allow for shorthand `Num.float(3)`


    function (type) { 
        // prototype converts an existing num into new type
        Num.prototype[type] = function () {
            return new Num(this, type);
        };
        // this is standalone function to return the type
        return function (val) {
            return new Num(val, type);
        };
    }

### Try Parsing

We are just given a string and we want to try parsing it as a number, figuring out its type. 

See [Reg Matching](#reg-matching) for the array types. We go in order, trying to match the string to the given reg. Right now, I have the end of the string, but I may want to change that -- not sure. It could cause false matches without it. 

Anyway, given a sucessful match, it then goes through the function to get an object that can then be fed into the type's parser. The return object is then returned to the some function which sees it as truthy and will then return that object up to the Num constructor. If nothing matches, then 

    function (num, givenType) {
        var Num = this,
            types = Num.types;

        if (givenType) {
            types = types.filter(function (el) {
                return (givenType === el[0]);
            });
        }

        var ret = false;

        types.some(function (el) {
            var type = el[0],
                reg = el[1],
                fun = el[2],
                m;

            m = reg.exec(num.original);
            if (m) {
                ret = fun(m);
                if (!ret) {
                    return false;
                }
                num.type = type;
                num.parsed = ret;
                ret = num.parse();
                ret.original = m[0];

                return ret;
            }
            return false;
        });

        return ret;

    }

### Reg Matching

Complex form:  a+ib  where a and b are numbers matching one of the other forms. 3+4i. For pure imaginary, use 0+bi

    ["com", /^(-?[0-9_.\/]+(?:E-?\d+)?(?:\:\d+)?)(\+|\-)([0-9_.\/]+(?:E-?\d+)?(?:\:\d+)?)?i/, function (m) {
        var a = new Num(m[1]), 
            b = m[3] || "1";
        if (m[2] === "+") {
            b = new Num(b);
        } else {
            b = new Num("-"+b);
        }
        if  ( (a.type !== "NaN") && (b.type !== "NaN") ) {
            return {
                re : a,
                im : b
            };
        } else {
            return false;
        }
    }],


Rational mixed form: (-)w n/d

    ["rat", /^(-)?(\d+)[ _](\d+)\/(\d+)/, function (m) {
         return { 
            neg: !!m[1], 
            w: int(m[2]),
            n: int(m[3]),
            d: int(m[4])
        };
    }],

Rational fraction only (-)n/d

    ["rat", /^(-)?(\d+)\/(\d+)/, function (m) {
         return { 
            neg: !!m[1], 
            w: int.zero,
            n: int(m[2]),
            d: int(m[3])
        };
    }],

Rational in decimal form  (-)#.# #E#  1.2 3 E34

    ["rat", /^(-)?(\d+)?\.(\d+)?[ _](\d+)\s?(E-?(\d+))?/, function (m) {
         _"parsing rational dec"
    }],

Scientific number  (-)#.#E(-)#:#  1.2 E34 :3  Using non-naming grouping for E and : since we can tell a match by existence of the number after the flag. 

    ["sci", /^(-)?(\d+)\.(\d+)? ?(?:E(-?\d+))? ?(?:\:(\d+))?/, function (m) {
        _"sci parsing"
    }],

Integers are real simple

    ["int", /^(-)?(\d+)/, function (m) {
        _"int parsing"
    }]

#### Int parsing

With integers, we have an array that represents the full number. We fill it in reverse order so that the small part comes first. Num.int.digits represents the string of the limit, which is generally 1E7. 

    var ret = [],
        dstr = m[2],
        dl = Num.int.digits.length;

    ret.neg = !!m[1];

    while (dstr.length > 0) {
        ret.push(parseInt(dstr.slice(-dl), 10));
        dstr = dstr.slice(0, -dl); 
    }

    return ret;


#### Sci parsing

We have a match, now we need to make an object out of it. 

    var neg = !!m[1],
        whole = m[2],
        frac = m[3] || '',
        E, pre;

Precision is either given by `:#` or we read it from the length of the digits.

    if (m[5]) {
        pre = parseInt(m[5], 10);
    } else {
        pre = whole.length + frac.length;
    }

E is either given or assumed to be 0. 

    if (m[4]) {
        E = parseInt(m[4], 10);
    } else {
        E = 0;
    }

If the leading digit is zero, we use frac to get to a non-leading zero. 

    while ((whole === "0") && (frac.length)) {
        E -= 1;
        whole = frac[0];
        frac = frac.slice(1);
    }


If the whole is more than a single digit (courtesy to engineering kind of notation), we adjust E by adding the length offset by 1. So for example 12E3 translates to 1.2E4. Note that there is always a leading digit.

    E += whole.length-1; //subtract 1 from length first

The number is just zero.

    if (whole === "0") {
        E = 0;
        neg = false;
    }

    return {
        neg: neg,
        i: int(whole+frac),
        E: E,
        p: pre
    };              


#### parsing rational dec

We want to convert a rational written in decimal form back into rational form. 

Form:  sign lead.nonrep rep E

rep into fraction is done by computing rep/ ( 10^{length of rep}  - 1)

Then we add that to rep followed by dividing by 10^length of nonrep

We add that to the lead, negate if needed, and shift it using E if needed. 


    var lead = m[2],
        nonrep = m[3] || "",
        rep = m[4],
        unit = Num.int.unit,
        E, ret, shift, repfrac, dec ;

    repfrac = Num.int(rep).div(Num.int(10).ipow(rep.length).sub( unit ) );
    dec = Num.int(nonrep||"0").add(repfrac).div(Num.int(10).ipow(nonrep.length));
    ret = (Num.int(lead)).add(dec);
    

    if (m[1]) {
        ret = ret.neg();
    }

    if (m[5]) {
        E = parseInt(m[5].slice(1), 10);
        shift = Num.int(10).ipow(E);
        ret = ret.mul(shift);
    } 

    return ret.val;


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

So nothing matched, erorr condition. This should be informative. Left should always be an instance of Num since that is how we got here. 

            var ret = left.str() + " ", 
                temp;
            ret += name + " ";
            for (i = 0; i < n; i += 1) {
                temp = arguments[i];
                if (temp instanceof Num )  {
                    ret += temp.str() + " ";
                } else if (temp) {
                    ret += temp + " ";
                }
            }

            return Num.nan(ret);
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




### args to string

    function () {
        var ret = [], i, n = arguments.length;
        for (i=0; i < n; i += 1) {
            ret.push( arguments[i].str() );
        }
        return ret;
    }

### make toString work

    function (type) {

        switch (type) {
            case "inspect" :
                Num.prototype.inspect = function () {
                    return this.str();
                };
            break;
            case "toString" :
                Num.prototype.toString = function () {
                    return this.str();
                };
            break;
            case "noInspect" :
                delete Num.prototype.inspect;
            break;
            case "noToString" :
                delete Num.prototype.toString;
            break;
        }

    }

### Generate a string from array of values

Given an array, we loop over it, generating a new array. The first argument is the array and the rest is an array to apply to the .str methods

It checks for it each element being an instance of Num. If it is, .str() is applied. If not, .toString() is applied.

    function (arr) {
        var ret = [], a, b, args;
        if (arguments.length <= 3) {
            a = arguments[1];
            b = arguments[2];
            arr.forEach(function (el) {
                if (el instanceof Num) {
                    ret.push( el.str(a, b) );
                } else {
                    ret.push( el.toString() );
                }
            });
        } else {
            args = Array.prototype.slice.call(arguments, 1);
            arr.forEach(function (el) {
                if (el instanceof Num) {
                    ret.push( el.str.apply(el, args) );
                } else {
                    ret.push( el.toString() );
                }
            });
        }
        return ret;
    }

### Map to string

Just a simple function to implement iterating over an array of Nums and getting string representations. 

    function (value) {
        return value.str(); 
    }

### Parse str format

Here we need to take a string of the form "key:val,keyA:val1:val2,keyB" into {key:val, keyA:[val1, val2], keyB:true}. This is a dumb parser, so commas and colons are excluded from key, value names.

    function (str) {
        var ret = {};
        if (! str) {
            return ret;
        }
        var arr = str.split(",");
        arr.forEach(function (el) {
            var temp = el.split(":");
            if (temp.length === 0) {
                return;
            }
            var key = temp[0].trim();
            if (temp.length === 1) {
                ret[key] = true;
            } else if (temp.length === 2) {
                ret[key] = temp[1].trim();
            } else {
                ret[key] = temp.slice(1).map(function (el) {
                    return el.trim();
                });
            }
        });

        return ret;
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
        if (power === 0) {
            return Num.int(1);
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


## Nan

We need to define a to string method for nan. Maybe some other stuff.

    Num.nan = Num.type("NaN");

    Num.define("NaN", {
        str : function () {
            return "(!" + this.original + ")";
        },
        parse: function (val) {
            return false;
        }
    });


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
        sign : _"float sign",
        simplify : ident,
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

### Float sign 

    function () {
        if (this.val >= 0) {
            return "";
        } else {
            return "-";
        }
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

    var int = Num.int = Num.type("int");
    int.lim = 1e7;  //this controls the size
    var zero, unit; 
    int.halflim = 5e6;
    int.digits = (int.lim+"").slice(1);
    var reduce = _"int reduce";
    var mcom = _"mass comparison";
    var dcom = _"directed comparison";
    var div = Num.int.divalgo = _"int division algorithm";

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
        simplify : ident,
        make: int
    });
    Num.define("int,int", {
        add : _"int add",
        sub : _"int sub",
        mul : _"int mul",
        div : _"int div",
        quo : _"int quo",
        rem : _"int rem",
        qure : _"int full division return",
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
        var o = this.original;
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
        } else if (this.parsed) {
            ret = this.parsed;
            delete this.parsed;
        } else if (typeof o === "string") {
            return Num.tryParse(this, "int");
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

        if ((ret.length === 1) && ret[0] === 0) {
            ret.neg = false;
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
        return Num.rat({neg: x.sign(), w:zero, n: unit, d: x.abs()});
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
            strarr[i] = int.digits.slice(temp.length) + temp;
        }
        strarr[n-1] = strarr[n-1]+"";
        var minus = this.val.neg ? "-" : "";
        return minus + strarr.reverse().join("");
    }

### Int Reduce

We need to have something implements reduction of values below the safe limit of 1e7. The incoming value is an array of js integers with the first entry being the lowest entry.  That is, 23,567,654 would be represented as [3567654, 2].

For this, all entries should be positive. 

    function (arr) {
        var i, n = arr.length, cur, big,
            lim = int.lim;


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
        var halflim = int.halflim;

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
                return Num.nan("descent not happening in gcd: " + a.str() + ", "+ b.str());
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

### Int Full Division Return

Return quotient and remainder.

    function (b) {
        return div(this, b);
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
        simplify : _"rat simplify",
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
        var o = this.original;
        if (this.parsed) {
            this.val = this.parsed;
            delete this.parsed;
        } else if (typeof o === "string") {
            return Num.tryParse(this, "rat");
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
                neg : o.val.w.sign(),
                w :   o.w(),
                n :  o.n(),
                d :  o.d()
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
        return rat({neg: this.sign(), w:zero, n: this.d(), d: this.n()}).simplify();
    }

### rat Abs

Take neg and turn it false;

    function () {
        var clone = rat(this.val);
        clone.val.neg = false;
        return clone;
    }


### rat Str

Need to put together a string. name:val1:val2,name:val... with name, given value of true. Most likely case is name:val

Example  "dec:10" for decimal version with at most 10 digits; reps will work.

    function (format) {

        var options = parseFormat(format);

        if (options.simplify) {
            this.simplify();
        }

        var sep = options.sep || "_";


        var v = this.val,
            ret = '',
            parts; 

        if (v.neg) {
            ret = '-';
        }
        
        if ( options.hasOwnProperty("dec") ) {
            
            parts = _"ratdec |ife(num=v.n, den=v.d, max=options.dec)";

            ret += v.w.add(parts[0]).str()+".";
            ret += parts[1];
            if (parts[2]) {
                ret += sep + parts[2];
            }
            return ret.trim();
        }
        
        //default
        var wz = v.w.eq(zero),
            nz = v.n.eq(zero);
        
        if (!wz ) {
            ret += v.w.str();
        }

        if (!wz && !nz) {
            ret += sep;
        }

        if (!nz ) {
           ret +=  v.n.str() + "/" + v.d.str(); 
        }

        if (wz && nz ) {
            ret = "0";
        }

        return ret.trim();
    }



#### ratdec

This will convert a rational number into a decimal. 

From env: num, den, max. Note if max is true, then no limit was passed in. What a hack!

We are given something of the form n/d and we want to make this into something of the form w.q r  where w is a whole number, q is a non-repeating part of the division and r is a repeating part. We go through computing the remainder and quotient, shifting by 10 on each loop. If the remainder is ever repeated, then we have hit a loop. 
    
        if (max === true) {
            max = 100;
        }
        var orig, res, a, b, index = Infinity, i;

        den = Num.int(den);
        orig = Num.int(num);
        res = orig.qure(den);

        var rem = [res.r.str()];
        var quo = [res.q.str()];

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

        if (index === -1) {
            return [quo[0], quo.slice(1).join(''), ''];
        } else {
            return [quo[0], quo.slice(1,index+1).join(''),  quo.slice(index+1).join('')];
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
            this.val = this.improper;
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
            this.val = this.mixed;
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
        if (this.sign() ) {
            return this.w().add(unit).neg();
        } else {
            return this.w();
        }
    }

### rat Ceiling

Eliminate the fraction part going up.

    function () {
        this.mix();
        if (this.sign() ) {
            return this.w().neg();
        } else {
            return this.w().add(unit);
        }
    }


### rat Fraction

Returns the fraction part of the rational number. This is after applying mix.

    function () {
        this.mix();
        return rat({w:zero, n:this.n(), d:this.d()});
    }

### rat Round

Eliminate the fraction part going down.

    function () {
        this.mix();
        if (this.sign()) {
            if (this.frac().gt(half)) {
                return this.w().add(unit).neg();
            } else {
                return this.w().neg();
            }            
        } else {
            if (this.frac().gt(half)) {
                return this.w().add(unit);
            } else {
                return this.w();
            }
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
        var neg;
        if  ( (l.neg && r.neg) || (!l.neg && !r.neg) ) {
            neg = false;
        } else {
            neg = true;
        }
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
        simplify : ident,
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
        var o = this.original;
        if (!o) {
            return false;
        }
        if (this.parsed) {
            this.val = this.parsed;
            delete this.parsed;
        } else if (typeof o === "string") {
            return Num.tryParse(this, "sci");
        } else if (typeof o === "number") {
            this.val = sci(o.toExponential()).val; // lazy path
        } else if (o.hasOwnProperty("E") ) { // basically correct form already
            this.val = {
                neg : o.neg,
                i : o.i || zero,
                E : o.E,
                p : o.p || 32
            };
        } else if (o.type === "sci" ) { // basically correct form already
            this.val = {
                neg : o.val.neg,
                i : o.val.i || zero,
                E : o.val.E,
                p : o.val.p || 32
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

Produces, mostly something of the form -?a.bEc:d  where a is a digit, b is a string of digits, c is an integer, and d is an integer representing precision. For some numbers, parts of this will be missing.

long strings should be truncated to the precision.

!! should be able to add in engineering format, etc., fairly easily. 

Format:  level:precision number for display, full is for showing the full number in memory. 

    function (format) {

        var options = parseFormat(format);

        var pre = detpre(options.level, this.pre() );

        if (options.full) {
            pre = Infinity;
        }


        var out = this.round(pre+1);
        var temp = out.val.i.str();
        var flag = (temp.length <  pre );

        // -?a
        var ret = this.sign() + temp[0];

        // b
        if (temp.length > 1) {
            ret += "."+temp.slice(1, pre+1);
        } 

        // c
        if (this.E() !== 0) {
            ret += "E"+this.E();
        }

        //overwrites
        if (this.E() === -Infinity) {
            ret = "0";
        }

        var isInteger =  ( (temp.length === (this.E()+1) ) || (ret === "0") ) ;


        // d
        if ( (!options.full) && (flag) && !isInteger ) {
            if (isFinite(pre)) {
                ret += ":"+pre;        
            } else {
                ret += ":oo";
            }        
        }

        return ret;
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
        var llength = lval.str().length;
        if (l.sign()) {
            lval = lval.neg();
        }
        // get right value in shape
        var rval = r.coef().shift(r.iE()-iE);
        var rlength = rval.str().length;
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

        ret.E = Math.max(l.E(), r.E()) + ret.i.str().length - Math.max(llength, rlength);

        // precision issues 
        var lpie = l.E() - (l.pre()-1);
        var rpie = r.E() - (r.pre()-1);
        ret.p = detpre(level, ret.E - Math.max(lpie, rpie)+1);
        return sci(ret);
    }
    
### sci sub

    function (b, level) {
        return this.add(b.neg(), level);
    }
    
### sci mul

To multiply scientific numbers, we multiply the integers, add the Es and then truncate the digits based on the min precision level. We do a bit of precision pruning before multiplication to minimize computations. The +4 is a bit random, but we want to make sure the precision is sufficient. This should be investigated. I imagine +1 or +2 is fine, but +4 should be very safe and not a big drain on resources.

!! looks like the +4 is actually a +20 ??

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
            ain = ai.shift();
            bin = bi.shift();
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


    Num.define("com", {
        parse : _"com parse",
        neg : _"com negate",
        inv : _"com reciprocal",
        abssq : _"com abssq",
        str : _"com str",
        ipow : _"ipow",
        re : _"com real",
        im : _"com imaginary",
        apply : _"com apply to parts",
        apply_re : _"com apply to real",
        apply_im : _"com apply to imag",
        simplify : _"com simplify",
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
        if (this.parsed) {
            this.val = this.parsed;
            delete this.parsed;
        } else if (typeof o === "string") {
            return Num.tryParse(this, "com");
        } else if (o instanceof Num) {
            if (o.type === "com") {
                this.val = {re : o.val.re, im : o.val.im};
            } else {
                this.val = {re : o, im : o.zero()};
            }
        } else if (o.hasOwnProperty("re") && o.hasOwnProperty("im") ) {
            this.val = {re: o.re, im: o.im};
        } else {
            return false;
        }

        return this;
    }

### com simplify

    function () {
        return this.apply("simplify");
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

This requires the square root function. Not available at this level. So this is not present

    function () {
        return this.abssq().sqrt();
    }

### com str

Fairly simple; just use existing prints. But need to deal with 0 and 1 coeficients as well as negatives. 

    function () {
        var re, im, plus, ret;
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
        if (im === "-1i") {
            im = '-i';
        }
        ret = re + plus + im;
        return (ret ? ret : "0");
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
        return this.val.re[str].apply(this.val.re, Array.prototype.slice.call(arguments, 1));
    }

### com apply to imag

    function (str) {
        return this.val.im[str].apply(this.val.im, Array.prototype.slice.call(arguments, 1));
    }


### com polar angle

To compute the polar angle, we need to compute the quadrant and use tan(theta) = y/x. That is, arctan(i/r).

Since we don't have arctan at this level of the library, this is not actually present. To be moved to. 


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
            re : l.re().mul(r.re()).sub(l.im().mul(r.im())).simplify(),
            im : l.re().mul(r.im()).add(l.im().mul(r.re())).simplify()
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

What if we just use a raw number as string? Happens frequently so far. If left side, then we need to wrap it. But if right, not so much. So we just need to deal here with the right one. We convert it using the make function. Thought I forgot about that, didn't you?


    function (op) {
        return function (r) {
            var result;
            var right = Num(r);     // this.make(r);
            result = this[op](right);
            return result;        
        };
    }

### number com conversion

If complex, we need to use the real part's make.

    function (op) {
        return function (r) {
            var result;
            var right = Num(r).com(); 
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

## Making functions

So most functions are used as  f(x, y, ...)  but we may want them to be of the form x.f(y, z)  for chaining purposes. So we need a little function that takes in a function and some 

Num.Fun(f, 


## README


 ## Math-Numbers  [![Build Status](https://travis-ci.org/jostylr/math-numbers.png)](https://travis-ci.org/jostylr/math-numbers)

This is a JavaScript library that implements exact integer arithmetic, arbitrary precision decimals, and other stuff. It is intended for educational purposes and most of the algorithms are fairly straightforward with little concern for performance.

It should work equally well in node or browser though mostly it is for the browser. 

[![browser support](https://ci.testling.com/jostylr/math-numbers.png)](https://ci.testling.com/jostylr/math-numbers)
 
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

There is a better example at [JSBin](http://jsbin.com/gist/7121167/?js,console) This can handle computing 40,000! in about 22 seconds on my machine.  Hit Run, and then in the console, type `factprint(40000, 60)` to get 40,000 factorial printed out in groups of 60. It will produce the number which is 166714 digits long!

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

Integers have `.shift(n)` which is the equivalent of multiplying the integer by 10^n where n is a positive integer.




## TODO

.E()  for all types

.norm() is abs value for all except complex which is the sum of absolute values. 

Figure out construction for hooking functions easily and smoothly. want f, [relevant types]

Can we subtype so positive integer is possible? 

round robin parser

.to(type) for converting to the given type. Use .type to get the current type. 

Some common questions such as .isZero, .isOne, .isPositive, .isNegative 

Complex: Octant  1a meaning a > b > 0,  1b meaning b > a > 0,  2a meaning -a > b > 0, ...

Write up docs. 

Documentation and tests. 

Need a strategy for errors, particularly bad inputs. 

Implement subclassing for types so that constant is not a function! Need to do this soon!

Apply methods -- return new objects

Rationals and the mixed/improrper stuff. Probably want to keep the original form somewhere. Do we have the ability to manipulate the form directly? 

Garbage collection strategy. For example, if computing 40,000!, we are currently creating many intermediate objects. 

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
        "literate-programming" : "~0.7.5",
        "tape" : "=2.3.0"
      },
      "dependencies":{
      },
      "scripts" : { 
        "prepublish" : "node ./node_modules/literate-programming/bin/literate-programming.js numbers.md",
        "compile" : "node ./node_modules/literate-programming/bin/literate-programming.js numbers.md",
        "test" : "node ./test/testrunner.js",
        "testq" : "node ./test/testrunner.js | grep -v -e ^ok"
      },
      "keywords": ["bigint", "bignum", "arithmetic", "arbitrary", "precision", "numbers"],
      "testling": {
            "files": "test/*.js",
            "browsers": {
              "ie": [ 9, 10 ],
              "firefox": [ 25, "nightly" ],
              "chrome": [ 31, "canary" ],
              "safari": [ 5.1]
            }
        }
    }

## gitignore

We should ignore node_modules (particularly the dev ones) and ghpages which is just a directory where I have the gh-pages branch repo. 

    node_modules
    ghpages

## npmignore

We should ignore test, examples, and .md files

    test
    examples
    ghpages
    *.md

## Travis

A travis.yml file for continuous test integration!

    language: node_js
    node_js:
      - "0.10"

## LICENSE MIT


The MIT License (MIT)
Copyright (c) 2013 James Taylor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
