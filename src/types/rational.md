This models rational numbers as a triple pair of integers: whole, numerator,
denominator and a sign so that all three parts are taken to be positive. 


    var rat = Num.rat = Num.type("rat");
    var int = Num.int;
    var zero = int.zero;
    var unit = int.unit;
    var half;
    var mcom = _"mass comparison";
    var dcom = _"num::directed comparison";

    Num.define("rat", {
        parse : _"parse",
        neg : _"negate",
        inv : _"reciprocal",
        abs : _"abs",
        str : _"str",
        ipow : _"num::ipow",
        w : _"whole",
        n : _"numerator",
        d : _"denominator",
        imp : _"improper",
        mix : _"mixed",
        reduce : _"reduce",
        scale : _"scale",
        sim : _"simplify",
        simplify : _"simplify",
        sign : _"num::sign",
        floor : _"floor",
        ceil : _"ceiling",
        round : _"round",
        frac : _"fraction",
        make: rat
    });
    Num.define("rat,rat", {
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

    half = rat.half = rat({neg:false, w: zero, n: unit, d: int(2)});
    rat.zero = rat({neg:false, w: zero, n: zero, d: unit});
    rat.unit = rat({neg:false, w: zero, n: unit, d: unit});
    Num.makeCon("zero", rat.zero);
    Num.makeCon("unit", rat.unit);    
    Num.makeCon("half", half);



### Parse

string, number, objects already in basic form. Given a version with numbers,
probably should clone it. 

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



### Negate

Flip neg, returning a new value.

    function () {
        var clone = rat(this.val);
        clone.val.neg = !this.val.neg;
        return clone;
    }


### Reciprocal

Get it to be improper and then flip and simplify. Check for non-zero. 

    function () {
        this.imp();
        if (this.n().eq(zero)) {
            return rat({w:int(NaN), n:int(NaN), d: int(NaN)});
        }
        return rat({neg: this.sign(), w:zero, n: this.d(), d: this.n()}).simplify();
    }

### Abs

Take neg and turn it false;

    function () {
        var clone = rat(this.val);
        clone.val.neg = false;
        return clone;
    }


### Str

Need to put together a string. name:val1:val2,name:val... with name, given
value of true. Most likely case is name:val

Example  "dec:10" for decimal version with at most 10 digits; reps will work.

    function (format) {

        var options = parseFormat(format);

        if (options.simplify) {
            this.simplify();
        }

        var sep = options.sep || "\_";


        var v = this.val,
            ret = '',
            parts; 

        if (v.neg) {
            ret = '-';
        }
        
        if ( options.hasOwnProperty("dec") ) {
            
            parts = _"ratdec |ife num=v.n, den=v.d, max=options.dec";

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

From env: num, den, max. Note if max is true, then no limit was passed in.
What a hack!

We are given something of the form n/d and we want to make this into something
of the form w.q r  where w is a whole number, q is a non-repeating part of the
division and r is a repeating part. We go through computing the remainder and
quotient, shifting by 10 on each loop. If the remainder is ever repeated, then
we have hit a loop. 
    
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


### Whole

Give the whole part of the fraction.

    function () {
        return this.val.w;
    }

### Numerator

Give the numerator part.


    function () {
        return this.val.n;
    }
    
### Denominator

And the denominator

    function () {
        return this.val.d;
    }


### Improper

Makes the current form improper. This may have its uses, but probably mostly
for display. Numbers should be thought of as largely immutable. As such, once
a form is computed, it should be stored and it can be used quickly to switch. 

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

### Mixed

Makes the current form mixed. We still assume it is of the form `w n/d` where
presumably w is 0, but perhaps it is not a properly reduced form.

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

### Reduce

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

### Simplify

Convenience method to both eliminate common factors in `n/d` as well as make it
a mixed number.

    function () {
        this.mix().reduce();
        if (this.n().eq(zero)) {
            return (this.sign() ? this.w().neg() : this.w());
        } else {
            return this;
        }
    }

### Floor

Eliminate the fraction part going down.

    function () {
        this.mix();
        if (this.sign() ) {
            return this.w().add(unit).neg();
        } else {
            return this.w();
        }
    }

### Ceiling

Eliminate the fraction part going up.

    function () {
        this.mix();
        if (this.sign() ) {
            return this.w().neg();
        } else {
            return this.w().add(unit);
        }
    }


### Fraction

Returns the fraction part of the rational number. This is after applying mix.

    function () {
        this.mix();
        return rat({w:zero, n:this.n(), d:this.d()});
    }

### Round

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

### Scale

We scale the fraction part by the passed in s.

    function (s) {
        var r = this.val;
        r.n = r.n.mul(s);
        r.d = r.d.mul(s);
        return this;
    }

### Add

To add two fractions of the same sign, we add the whole parts separately from
the proper fraction parts. The proper fractions we combine by common
denominators. 

If they are of different sign, we put them into improper fractions, make
common denominators, and subtract the smallest from the largest. 

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

### Sub

We negate and apply the addition function

    function (b) {
        return this.add(b.neg());
    }

### Mul

Check signs separately. Multiply all of it and combine: 
`(w + n/d) (v + m/c) = wv + wm/c + vn/d + mn/(dc)`. 
So the easiest way to code this is to compute out
the four rational numbers above and then invoke addition. 

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

### Div

Reciprocate and then multiply.

    function (b) {
        return this.mul(b.inv());
    }


### Bool

We need to define a series of comparison operators 

    function (b) {
        this.mix();
        b.mix();
        return (C(this.val,b.val) INQ ) ? true : false;
    }


### Mass Comparison

This is without regard to sign. So first check the whole, then go to the
fraction part: `a = w + n/d and b = v+m/c` 
so  if `w = v` then `a < b if  n/d < m/c`
or  `n*c < m*d`

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



