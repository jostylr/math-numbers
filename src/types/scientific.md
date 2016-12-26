This models the scientific precision numbers as an integer and a magnitude
with a precision level. After computations are done, the precision rules
dictate the new precision and all digits after that are truncated. 

Exact numbers can have a precision of Infinity



    var sci = Num.sci = Num.type("sci");
    var int = Num.int;
    var zero = int.zero;
    var unit = int.unit;
    var digcom = _"leading digit comparison";
    var mcom = _"mass comparison";
    var dcom = _"num::directed comparison";
    var divsci = _"division for scientific numbers";
    var detpre = _"figure out to string precision";
    

    Num.define("sci", {
        parse : _"parse",
        neg : _"negate",
        inv : _"reciprocal",
        abs : _"abs",
        str : _"str",
        ipow : _"num::ipow",
        coef : _"coef",
        lead : _"leading digit",
        slice : _"slice the digits",
        i : _"integer",
        E : _"power of ten",
        iE : _"placement of last digit",
        pre : _"precision level",
        sign : _"num::sign",
        floor : _"floor",
        ceil : _"ceiling",
        round : _"round",
        simplify : ident,
        make: sci
    });
    Num.define("sci,sci", {
        add : _"add",
        sub : _"sub",
        mul : _"mul",
        div : _"div",
        mgt : _"bool | sub C, mcom, INQ, > 0",
        mgte : _"bool | sub C, mcom, INQ, >= 0",
        mlt : _"bool | sub C, mcom, INQ, <  0",
        mlte : _"bool | sub C, mcom, INQ, <= 0",
        meq : _"bool | sub C, mcom, INQ, === 0",
        gt : _"bool | sub C, dcom, INQ, > 0",
        gte : _"bool | sub C, dcom, INQ, >= 0",
        lt : _"bool | sub C, dcom, INQ, <  0",
        lte : _"bool | sub C, dcom, INQ, <= 0",
        eq : _"bool | sub C, dcom, INQ, === 0",
        max : _"num::minmax | sub INQ, gte",
        mmax : _"num::minmax | sub INQ, mgte",
        min : _"num::minmax | sub INQ, lte",
        mmin : _"num::minmax | sub INQ, mlte"
    });

    sci.zero = sci({i:int(0), neg: false, p:Infinity, E: 0});
    sci.unit = sci({i:int(1), neg: false, p:Infinity, E: 0});
    Num.makeCon("zero", sci.zero);    
    Num.makeCon("unit", sci.unit);

### parse

A scientific number value contains a sign, an integer, an exponent E for power
of 10, and a precision level. 

The precision is the number of significant digits. Generally, one extra digit
is left on for semi-significance. When parsing in a string, the last digit is
considered semi-significant.

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
            this.val =  _"rat conversion to sci| ife o, zero, int, divsci, sci ";
        } else {
            return false;
        }

The property .iE is the last digit's placement. We take E and subtract the
number of digits from it to get it, +/- 1 or so.  1.32E5 has  iE 3 :   5 -
(3-1) = 3,  1.2324E-7   iE  : -7 - (5 -1) = -11

        this.val.iE = this.val.E - (this.val.i.str().length - 1);
        this.val.p = this.val.p || 1;

To catch zero, we put E to -oo.


        if (this.val.i.eq(zero ) ) {
            this.val.E = -Infinity;
        }
        return this;
    }

### precision length and E

To be deleted eventually. The idea was to cut the number short when defined,
but I think it is more reasonable to let it be at whatever and then manipulate
on the method level. In other words, if adding, round at that stage to do the
adding. 

This bit checks to make sure the sci number is not more precise than the given
precision, up to 1 extra digit. Then it also computes the property iE which is
the place value of the last digit. 

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




### negate

Flip the sign. 

    function () {
        var clone = sci(this.val);
        clone.val.neg = !clone.val.neg;
        return clone;
    }


### abs

    function () {
        var clone = sci(this.val);
        clone.val.neg = false;
        return clone;
    }

### str

Produces, mostly something of the form -?a.bEc:d  where a is a digit, b is a
string of digits, c is an integer, and d is an integer representing precision.
For some numbers, parts of this will be missing.

long strings should be truncated to the precision.

!! should be able to add in engineering format, etc., fairly easily. 

Format:  level:precision number for display, full is for showing the full
number in memory. 

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

The goal of this is to take in a level and a precision for string output and
determine what to round the number to. 

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

    
### eng

This allows for more engineering type precision output. Basically, allows one
to shift the decimal point to make hundreds and so forth more visibile, e.g.,
1.2E1 is more readily read as 12 so x.eng() would do that. 

This is kind of tricky. If E is > than num, then we use the str method.
Otherwise, we need to break it up based on E>0. If E>0 but the length of the
integers is less than num, then we need to pad it with 0's. If greater than
num, then we can just slice with decimals. If v.E<0, then we pad with the
appropriate 0's. No need to break it into cases. 

!!! Need to check out all the cases and in particular make sure the lengths
are not off by 1 or something. 

!!! This is not quite engineering notation. They use multiples of 3 for the
exponent. so E is just 3 or -9 never -8 for example. 

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

### coef

This returns an integer with at most `pre` digits. If there is no `pre`, then
it returns the full integer. The integer in either case is the scientific
number's mantissa (significand).

    function (pre) {
        var istr;
        if ((typeof pre === "number") && (pre < Infinity) ) {
            istr = this.val.i.str();
            return int(istr.slice(0, pre));  // 
        } else {
            return this.val.i;
        }
    }
    
### leading digit

Return just the leading digit.

    function () {
        var i = this.val.i;
        return i.str()[0];
    }
    
### slice the digits

Given a number, return the first n digits and E. If n is negative, then it
goes from the end. 

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

### integer

This returns the integer value, that is if it is 1.34E4, then it returns 134. 

    function () {
        return this.val.i;
    }

    
### power of ten

    function () {
        if (! this.val.E) {
            return 0;
        }
        return this.val.E;
    }
    
### precision level

    function () {
        return this.val.p;
    }
    
### placement of last digit

    function () {
        return this.val.iE;
    }
    
### floor

This creates a new sci number by truncating after n digits. For negative
numbers, it shifts the last digit down by 1.  

If adding 1 shifts the leading digit up to another power of 10, this will get
E to be wrong. We detect this by the length of the string of the integer. Then
we modify E. 

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
    
### ceiling

The ceiling function is the floor function doubly negated:  -floor(-x) = ceil

    function (n) {
        return this.neg().floor(n).neg();
    }
    
### round

The round function is the floor function shifted by 0.5:  floor(x+0.5) = round

But for us it is a little more complicated. We have n

    function (n) {
        if (this.val.i.str().length <= n) {  // already done
            return sci(this.val);
        }
        var half = sci({neg: false, i:int(5), E:this.E()-(n-1)-1, p:Infinity});
        return this.add(half).floor(n);
    }
    
### add

To add scientific numbers, we pad with zeros all the numbers to have the same
iE (last digit's decimal place) level. This is without regards to precision. 

To figure that out, we take the  minimum iE and then subtract that from each
iE and add those number of zeros. 

The precision of the new number should be set so that the minimum of the iE
version of precision is attained. That is, for each number's E, compute  E -
(precision - 1) to get the precision iE. The maximum of those is the iE to
use. Once we have that, we take the new E solve for precision:  
`piE = E - (pre-1),  pre = (E - p) + 1`


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
    
### sub

    function (b, level) {
        return this.add(b.neg(), level);
    }
    
### mul

To multiply scientific numbers, we multiply the integers, add the Es and then
truncate the digits based on the min precision level. We do a bit of precision
pruning before multiplication to minimize computations. The +4 is a bit
random, but we want to make sure the precision is sufficient. This should be
investigated. I imagine +1 or +2 is fine, but +4 should be very safe and not a
big drain on resources.

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


### Pow

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

This is a stand-alone function that takes in two integers and a precision. It
returns a scientific number whose precision is the given precision. 

We start with the lengths of the numerator and denominator. The first quantity
to compute is numerator.length - denominator.length. This is roughly the
natural precision of the division. If the denominator is larger, than the
quotient is 0 and that is reflected in a negative precision. We can use this
basic precision and subtract it from the given precision. This gives us the
padding we need to apply to the numerator to get a "decimal" with the given
precision with possibly one extra place of precision. 

Once we have computed the padding, we shift the numerator and do the division,
getting the quotient. The length of the quotient minus the padding minus 1 is
the E for the scientific number. If the length is greater than the precision,
we truncate. 

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

### reciprocal

    function (level) {
        return unit.div(this, level); //divsci(unit, this.val.i, detpre(level, this.pre()));
    }


### div

The pre level +20 is roughly the size of the return value. If pre is infinite,
we have chosen 500 as a sufficient size. 


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
    
### bool

We need to define a series of comparison operators.

    function (b) {
        return (C(this.val,b.val) INQ ) ? true : false;
    }


### Mass Comparison

This is without regard to sign. If E is larger than that number is larger than
the other. Otherwise, we look at the digits up to the least precision. If they
are not different up to that, we treat them as equal. 

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

Given two scientific numbers, determine which one is larger in terms of its
digits, treating the leading digit as the same place. 

Comparing the integer parts using integer relations is inadequate since
1.45E34 and 1.356E34 will have 1356 as larger while we want 145 to be the
larger. 

We implement this by slicing at the minimum pre+1 level (more precision is not
warranted) and then comparing the leading digits until a difference is found.

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

