This is the cool base class upon which all else is built. It is an array of
numbers (js integers) for which each entry is less than 1e7. This allows for
multiplication without loss of precision.  

I am coding this up without worrying about performance at this time. The goal
is for educational value, not for doing anything serious. That is to say, I
simply want to be able to do exact arithmetic and/or explore error bounds,
significance, Newton's method, etc.,  and that means being able to deal with
large numbers. 

Each value is represented by an array of js integers with the first entry
being the lowest entry. That is, 23,567,654 would be represented as [3567654,
2]. The array also has a property called neg which is a boolean flag for being
negative or not. 

    var int = Num.int = Num.type("int");
    int.lim = 1e7;  //this controls the size
    var zero, unit; 
    int.halflim = 5e6;
    int.digits = (int.lim+"").slice(1);
    var reduce = _"reduce";
    var mcom = _"mass comparison";
    var dcom = _"num::directed comparison";
    var div = Num.int.divalgo = _"division algorithm";

    Num.define("int", {
        parse : _"parse",
        neg : _"negate",
        abs : _"abs",
        str : _"str",
        ceil : ident,
        floor: ident,
        ipow : _"num::ipow",
        round: ident,
        sign: _"num::sign",
        inv : _"reciprocal",
        shift : _"shift",
        simplify : ident,
        make: int
    });
    Num.define("int,int", {
        add : _"add",
        sub : _"sub",
        mul : _"mul",
        div : _"div",
        quo : _"quo",
        rem : _"rem",
        qure : _"full division return",
        mgt : _"bool | sub  C, mcom, INQ, > 0",
        mgte : _"bool | sub C, mcom, INQ, >= 0",
        mlt : _"bool | sub C, mcom, INQ, <  0",
        mlte : _"bool | sub C, mcom, INQ, <= 0",
        meq : _"bool | sub C, mcom, INQ, === 0",
        gt : _"bool | sub C, dcom, INQ, > 0",
        gte : _"bool | sub C, dcom, INQ, >= 0",
        lt : _"bool | sub C, dcom, INQ, <  0",
        lte : _"bool | sub C, dcom, INQ, <= 0",
        eq : _"bool | sub C, dcom, INQ, === 0",
        gcd : _"gcd",
        lcm : _"lcm",
        max : _"num::minmax | sub INQ, gte",
        mmax : _"num::minmax | sub INQ, mgte",
        min : _"num::minmax | sub INQ, lte",
        mmin : _"num::minmax | sub INQ, mlte"
    });

    int.zero = zero = int(0);
    int.unit = unit = int(1);
    Num.makeCon("zero", zero);
    Num.makeCon("unit", unit);    


### Parse

Initially already assume given in form. Just to get the rest right. 

The string parsing should reverse the .str method. So first it checks for a
minus sign. Then it parses backwards 7 digits 

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

### Negate

    function () {
        var clone = int(this.val);
        clone.val.neg = !clone.val.neg;
        return clone; 
    }


### reciprocal

    function () {
        var x = this;
        return Num.rat({neg: x.sign(), w:zero, n: unit, d: x.abs()});
    }

### Abs

    function () {
        var clone = int(this.val);
        clone.val.neg = false;
        return clone; 
    }

### sign

    function () {
        return this.val.neg || false;
    }

### shift

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


### Str

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

### Reduce

We need to have something implements reduction of values below the safe limit
of 1e7. The incoming value is an array of js integers with the first entry
being the lowest entry.  That is, 23,567,654 would be represented as [3567654,
2].

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

### Bool

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


### Add

We use the mgte function to decide which integer is larger in mass (absolute
value). We copy the larger one in to the new number and it takes the sign of
the larger one. If the signs are the same, we simply add in the smaller one's
values. If the signs are different, we first shift the values of the larger
one to ensure that it is always greater than the smaller one's values. And
then we subtract. 

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

### Sub

Just negate and add.

    function (b) {
        return this.add(b.neg());
    }

### Mul

Figure out sign separately from the value. The value is obtained by
multiplying the various 

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

### Division Algorithm

This is the primary implementation of division by integers. It returns the
quotient, remainder, and divisor. It can be used to create a rational number,
get just the quotient, or just get the remainder. 

This is the high school division algorithm applied to digits written in base
1e7. Looking at other algorithms, this seems to be fine for our needs. See
[Master's
Thesis](http://bioinfo.ict.ac.cn/~dbu/AlgorithmCourses/Lectures/Hasselstrom2003.pdf‎)

First we check for zero denominator, deal with negatives, and check for
numerator being less than denominator in magnitude. If we are still on track,
then we scale the numerator and denominator so that the denominator's leading
digit is >5e6. We do this to minimize the number of times we need to adjust
the quotient digit. This should limit the adjustment to no more than two times
though it seems to take a few more times than that at times. 

Once scaled, we then take the first two digits of the numerator to form a
number that gets divided by the first digit of denominator. We floor it and
use that as the quotient digit. If quotient digit * shifted denominator is >
numerator, then we subtract the scaled denominator until it is less than the
numerator, updating the the quotient digit by subtracting 1. 

When the multicant is smaller, we subtract and the remainder is then used as
the new numerator. We repeat until we exhaust the digits needed. Whatever is
left is a remainder and should be less than the denominator. 

Our final action is to scale the remainder down by dividing by the scale
factor. This results in a division with no remainder; we call the algorithm
itself when the remainder is non-zero and not if it is zero.

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

We need to ensure that the denominator's first significant digit is at least
as large as half the limit. We can do this by dividing the halflimit by the
significant digit, flooring it, and adding one. Then we scale the denominator
and numerator by this value. 

    if (dbig < halflim) {
       scale = int(Math.floor(halflim/dbig) + 1);
       top = top.mul(scale);
       den = den.mul(scale);
       d = den.val;
       dl = d.length -1;
       dbig = d[dl];
    }    

### gcd

The gcd algorithm is simple. a.gcd(b) is implemented by finding the sequence
a_0, a_1, ..., a_i, ... a_n=0 such that a_0>a_1>... and a_i mod a_i-1  =
a_i+1.  That is, we go along dividing and using the remainders. It will end
with 0 remainder and the last non-zero remainder is the gcd. 

It terminates because it is a finite list of positive integers descending. The
last one is a divisor of the previous because of 0 remainder. Why does the
reduction work? We need to see that gcd(a,b) = gcd(b, c) where c = a mod b.
Basically,`a = q*b + c`. So anything that divides both a and b must divide c.
And if something divides b and c, then it divides a. 

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

### lcm

Given the gcd, we can simply divide one of them by it and multiply by the
other to get the lcm. 

    function (b) {
        var gcd = this.gcd(b);
        return this.quo(gcd).mul(b);
    }

### Div

Returns a rational number. 

    function (b) {
        return Num.rat(div(this, b));
    }

### Full Division Return

Return quotient and remainder.

    function (b) {
        return div(this, b);
    }

### Quo

Returns the quotient part.

    function (b) {
        return div(this, b).q;
    }

### Rem

Returns the remainder part.

    function (b) {
        return div(this, b).r;
    }
