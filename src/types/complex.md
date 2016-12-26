This should complexify the already existing types. 


    var com = Num.com = Num.type("com");
    var int = Num.int;
    var zero = int.zero;
    var unit = int.unit;


    Num.define("com", {
        parse : _"parse",
        neg : _"negate",
        inv : _"reciprocal",
        abssq : _"abssq",
        str : _"str",
        ipow : _"num::ipow",
        re : _"real",
        im : _"imaginary",
        apply : _"apply to parts",
        apply_re : _"apply to real",
        apply_im : _"apply to imag",
        simplify : _"simplify",
        make: com
    });
    Num.define("com,com", {
        add : _"add",
        sub : _"sub",
        mul : _"mul",
        div : _"div"
    });

    com.zero = com({re:zero, im: zero});    
    com.unit = com({re:unit, im: zero});
    Num.makeCon("zero", com.zero);    
    Num.makeCon("unit", com.unit);


### Parse

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

### simplify

    function () {
        return this.apply("simplify");
    }

### negate

Negate both quantities.


    function () {
        var val = this.val;
        var clone = {
            re : val.re.neg(),
            im : val.im.neg()
        };
        return com(clone);
    }
    
### reciprocal

We implement  1/(a+bi) =  (a-bi)/(a^2 + b^2)

    function () {
        var mag = this.abssq();
        var clone = {
            re : this.re().div(mag),
            im : this.im().neg().div(mag)
        };
        return com(clone);
    }
    
### abssq

    function () {
        var re = this.val.re;
        var im = this.val.im;
        return re.mul(re).add(im.mul(im));
    }
    
### abs

This requires the square root function. Not available at this level. So this
is not present

    function () {
        return this.abssq().sqrt();
    }

### str

Fairly simple; just use existing prints. But need to deal with 0 and 1
coeficients as well as negatives. 

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
    
    
### real

    function () {
        return this.val.re;
    }
    
### imaginary

    function () {
        return this.val.im;
    }
    
### apply to parts

The applies are mainly for manipulating presentation of rational parts. 

    function () {
        this.apply_re.apply(this, arguments);
        this.apply_im.apply(this, arguments);
        return this;
    }
    
### apply to real

    function (str) {
        return this.val.re[str].apply(this.val.re, Array.prototype.slice.call(arguments, 1));
    }

### apply to imag

    function (str) {
        return this.val.im[str].apply(this.val.im, Array.prototype.slice.call(arguments, 1));
    }


### polar angle

To compute the polar angle, we need to compute the quadrant and use tan(theta)
= y/x. That is, arctan(i/r).

Since we don't have arctan at this level of the library, this is not actually
present. To be moved to. 


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
    
### add

We simply add the components seprarately.

    function (r) {
        var lv = this.val;
        var rv = r.val;
        return com({re: lv.re.add(rv.re), im:lv.im.add(rv.im)});
    }
    
### sub

    function (r) {
        return this.add(r.neg());
    }
    
### mul

Multiplication is done by 
`(a+bi)(c+di) =  ac + bci + adi -bd = (ac-bd) + i (bc + ad)` 

    function (r) {
        var l = this;
        var res = com({
            re : l.re().mul(r.re()).sub(l.im().mul(r.im())).simplify(),
            im : l.re().mul(r.im()).add(l.im().mul(r.re())).simplify()
        });
        return res;
    }
    
### div

    function (r) {
        return this.mul(r.inv());
    }
