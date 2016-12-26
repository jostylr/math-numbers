Here we implement the basic interface using the built-in operators. 

    var float = Num.float = Num.type("float");
    Num.define("float", {
        parse : _"parse",
        neg : _"negate",
        round : _"float to int | sub FUN, round",
        floor : _"float to int | sub FUN, floor",
        ceil : _"float to int | sub FUN, ceil",
        abs : _"unary | sub FUN, abs",
        str : _"str",
        ipow : _"num::ipow",
        inv : _"reciprocal",
        sign : _"sign",
        simplify : ident,
        make : float
    });
    Num.define("float,float", {
        add : _"op | sub OP, +",
        sub : _"op | sub OP, -",
        mul : _"op | sub OP, *",
        div : _"op | sub OP, /",
        pow : _"binary | sub FUN, pow",
        mgt : _"minq | sub com, >",
        mgte :_"minq | sub com, >=",
        mlt : _"minq | sub com, <",
        mlte : _"minq | sub com, <=",
        meq : _"minq | sub com, ==",
        gt : _"inq | sub com, >",
        gte : _"inq | sub com, >=",
        lt : _"inq | sub com, <",
        lte : _"inq | sub com, <=",
        eq : _"inq | sub com, ==",
        max : _"num::minmax | sub INQ, gte",
        mmax : _"num::minmax | sub INQ, mgte",
        min : _"num::minmax | sub INQ, lte",
        mmin : _"num::minmax | sub INQ, mlte"
    });

    float.zero = float(0);
    float.unit = float(1);
    Num.makeCon("zero", float.zero);
    Num.makeCon("unit", float.unit);



### parse

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

### negate

    function () {
        return new Num (-1*this.val, "float");
    }

### sign 

    function () {
        if (this.val >= 0) {
            return "";
        } else {
            return "-";
        }
    }

### reciprocal

    function () {
        return new Num (1/this.val, "float");
    }


### Float to int

Some conversions to integers

    function () {
        return new Num (Math.FUN(this.val), "int");
    }

### unary

    function () {
        return new Num (Math.FUN(this.val), "float");
    }


### op

And then the operators are basically the same as well

    function (b) {
        return new Num ( (this.val OP b.val), "float");
    }

### binary 

    function (b) {
        return new Num ( Math.FUN(this.val, b.val), "float");
    }

### inq 

    function (b) {
        return (this.val com b.val);
    }

### minq 

    function (b) {
        return (Math.abs(this.val) com Math.abs(b.val));
    }


### str

This is a terminal method that produces a string representation. Options have
not been implemented yet. Probably grab a string formatting library.

    function () {
        return this.val+"";
    }

