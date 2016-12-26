# Basic flow

The constuctor `Num` is used to construct a number.  So  `new
Num('509823423408', 'int')` creates an integer with the given value.  We also
support Num.int('509823423408')`. Working on simply `Num('509823423408')`
where it will do a round-robin parsing of the string given to it. 

If parsing fails, it will return a Num object of type `NaN` that infects all
other objects that it comes into contact with. But the idea is that there will
be tracking information put into it. 

!!! Currently thinking about using underscores for spaces in numbers.
Examples:  `1_3/4` for 1 and three-quarters,  `1.2_3` for 1.233333333... 3
repeating (also 1.2+1/30). Or for complex `1.2_4i` Numbers should have no
spaces in them for the parsing. Thinking not.

We can also use E notation for numbers:  `123E9` represents one hundred and
twenty-three billion. 

### Methods

All methods are on the prototype object of Num. 

1. The operators should be inherited from an operator object passed in. 
2. print (format instructions) -> string representing Num

The prototype object on Num has all of the operators. They then pass
everything on to the operator dealing with the right mixture of types. 


### Specials

1. zero  Represents additive identity
2. one  Represents multiplicative identity. 
3. inf Represents infinity
4. neginf Reprents negative infinity



## Properties

        var parseFormat = Num.prototype.parseFormat  = _"parse str format";

        var ident = function () {return this;};

        Num.ops ={};

        Num.makeOp = _"get right typed operator";

        Num.define = _"Loading ops";

        Num.type = _"Short version of defining number | ife Num";

        Num.makeCon = _"make a constant";

        Num.str = _"args to string";

        Num.toStr =  _"make toString work";

        Num.each = _"generate a string from array of values";


### Combo Numbers

        _"combo setup | ife Num";

        _"nan | ife Num";

        var int = Num.int;

        Num.types = [_"parsing::Reg Matching"];


We added a Num.nan function for making explicit NaN values. This is a handy
way of having errors that can propagate up through the chains. 

## Num constructor

Standard usage is that this is a constructor with `this` as the main return
value, though it is possible for the parsing to create a new object that gets
returned. This is true for [ratdec](#ratdec).


    function (val, type) {
        var ret;

Checks for whether this was a construct call or not. If not, calls the
constructor and returns result.

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

We want to store the original input value, but if it is a Num object, then we
stringify it for both debugging and not holding onto a reference
unnecessarily. 

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

Writing out `new Num(3, "float")` is a hassle. So instead we will create a
method that creates bound functions to allow for shorthand `Num.float(3)`


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
