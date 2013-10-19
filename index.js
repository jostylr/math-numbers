(function () {

    /*global module*/

    var Num = function (val, type, options) {
            this.original = val;
            this.type = type;
            this.parse.apply(this, options);  // will convert original into appropriate val
        
            return this;
        };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Num;
    } else {
        this.Num = Num;
    }

    Num.ops ={};

    Num.makeOp = function (name) {
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
        
        };

    Num.define = function (types, operators) {
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
        };

    Num.type = (function ( Num ) {
         return function (type) { 
            Num.prototype[type] = function () {
                return new Num(this, type);
            };
            return function (val) {
                return new Num(val, type);
            };
        };
        } ( Num ) );

    Num.makeCon = function (name, value) {
            var fun; 
            if (! Num.prototype.hasOwnProperty(name) ) {
                fun = Num.prototype[name] = function () {
                    return fun[this.type];
                };
            } else {
                fun = Num.prototype[name];
            }
            fun[value.type] = value;
        };

    Num.str = function () {
            var ret = [], i, n = arguments.length;
            for (i=0; i < n; i += 1) {
                ret.push( arguments[i].str() );
            }
            return ret;
        };

    (function ( Num ) {var float = Num.float = Num.type("float");
    Num.define("float", {
        parse : function () {
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
            },
        neg : function () {
                return new Num (-1*this.val, "float");
            },
        round : function () {
                return new Num (Math.round(this.val), "int");
            },
        floor : function () {
                return new Num (Math.floor(this.val), "int");
            },
        ceil : function () {
                return new Num (Math.ceil(this.val), "int");
            },
        abs : function () {
                return new Num (Math.abs(this.val), "float");
            },
        str : function () {
                return this.val+"";
            },
        ipow : function (power) {
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
                    return prod;
                } else if ( (typeof power === "number") && (power < 0) && (Math.floor(power) === power) ) {
                    power = -power;
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
                    return prod.inv();  
                }
            
            },
        inv : function () {
                return new Num (1/this.val, "float");
            },
        make : float
    });
    Num.define("float,float", {
        add : function (b) {
                return new Num ( (this.val + b.val), "float");
            },
        sub : function (b) {
                return new Num ( (this.val - b.val), "float");
            },
        mul : function (b) {
                return new Num ( (this.val * b.val), "float");
            },
        div : function (b) {
                return new Num ( (this.val / b.val), "float");
            },
        pow : function (b) {
                return new Num ( Math.pow(this.val, b.val), "float");
            },
        mgt : function (b) {
                return (Math.abs(this.val) > Math.abs(b.val));
            },
        mgte :function (b) {
                return (Math.abs(this.val) >= Math.abs(b.val));
            },
        mlt : function (b) {
                return (Math.abs(this.val) < Math.abs(b.val));
            },
        mlte : function (b) {
                return (Math.abs(this.val) <= Math.abs(b.val));
            },
        meq : function (b) {
                return (Math.abs(this.val) == Math.abs(b.val));
            },
        gt : function (b) {
                return (this.val > b.val);
            },
        gte : function (b) {
                return (this.val >= b.val);
            },
        lt : function (b) {
                return (this.val < b.val);
            },
        lte : function (b) {
                return (this.val <= b.val);
            },
        eq : function (b) {
                return (this.val == b.val);
            },
        max : function (r) {
                if (this.gte(r)) {
                    return this;
                } else {
                    return r;
                }
            },
        mmax : function (r) {
                if (this.mgte(r)) {
                    return this;
                } else {
                    return r;
                }
            },
        min : function (r) {
                if (this.lte(r)) {
                    return this;
                } else {
                    return r;
                }
            },
        mmin : function (r) {
                if (this.mlte(r)) {
                    return this;
                } else {
                    return r;
                }
            }
    });
    
    float.zero = float(0);
    float.unit = float(1);
    Num.makeCon("zero", float.zero);
    Num.makeCon("unit", float.unit);
    } ( Num ) );

    (function ( Num ) {var lim = 1e7;  //this controls the size
    var zero, unit; 
    var halflim = 5e6;
    var digits = (lim+"").slice(1);
    var reduce = function (arr) {
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
        };
    var mcom = function (a, b) {
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
        };
    var dcom = function (a, b) {
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
        };
    var int = Num.int = Num.type("int");
    var div = Num.int.divalgo = function self (top, den) {
        
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
        
            if (dbig < halflim) {
               scale = int(Math.floor(halflim/dbig) + 1);
               top = top.mul(scale);
               den = den.mul(scale);
               d = den.val;
               dl = d.length -1;
               dbig = d[dl];
            }    
        
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
        
        };
    var ident = function () {return int(this.val);};
    
    Num.define("int", {
        parse : function self () {
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
            
                if ((ret.length === 1) && ret[0] === 0) {
                    ret.neg = false;
                }
            
                return this;
            },
        neg : function () {
                var clone = int(this.val);
                clone.val.neg = !clone.val.neg;
                return clone; 
            },
        abs : function () {
                var clone = int(this.val);
                clone.val.neg = false;
                return clone; 
            },
        str : function() {
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
            },
        ceil : ident,
        floor: ident,
        ipow : function (power) {
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
                    return prod;
                } else if ( (typeof power === "number") && (power < 0) && (Math.floor(power) === power) ) {
                    power = -power;
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
                    return prod.inv();  
                }
            
            },
        round: ident,
        sign: function () {
                return (this.val.neg ? "-" : "");
            },
        inv : function () {
                var x = this;
                return Num.rat({neg: x.sign(), w:zero, n: unit, d: x});
            },
        shift : function (d) {
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
            },
        make: int
    });
    Num.define("int,int", {
        add : function (b) {
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
            },
        sub : function (b) {
                return this.add(b.neg());
            },
        mul : function (fullb) {
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
            },
        div : function (b) {
                return Num.rat(div(this, b));
            },
        quo : function (b) {
                return div(this, b).q;
            },
        rem : function (b) {
                return div(this, b).r;
            },
        mgt : function (b) {
                return (mcom(this.val,b.val) > 0 ) ? true : false;
            },
        mgte : function (b) {
                return (mcom(this.val,b.val) >= 0 ) ? true : false;
            },
        mlt : function (b) {
                return (mcom(this.val,b.val) <  0 ) ? true : false;
            },
        mlte : function (b) {
                return (mcom(this.val,b.val) <= 0 ) ? true : false;
            },
        meq : function (b) {
                return (mcom(this.val,b.val) === 0 ) ? true : false;
            },
        gt : function (b) {
                return (dcom(this.val,b.val) > 0 ) ? true : false;
            },
        gte : function (b) {
                return (dcom(this.val,b.val) >= 0 ) ? true : false;
            },
        lt : function (b) {
                return (dcom(this.val,b.val) <  0 ) ? true : false;
            },
        lte : function (b) {
                return (dcom(this.val,b.val) <= 0 ) ? true : false;
            },
        eq : function (b) {
                return (dcom(this.val,b.val) === 0 ) ? true : false;
            },
        gcd : function (b) {
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
            },
        lcm : function (b) {
                var gcd = this.gcd(b);
                return this.quo(gcd).mul(b);
            },
        max : function (r) {
                if (this.gte(r)) {
                    return this;
                } else {
                    return r;
                }
            },
        mmax : function (r) {
                if (this.mgte(r)) {
                    return this;
                } else {
                    return r;
                }
            },
        min : function (r) {
                if (this.lte(r)) {
                    return this;
                } else {
                    return r;
                }
            },
        mmin : function (r) {
                if (this.mlte(r)) {
                    return this;
                } else {
                    return r;
                }
            }
    });
    
    int.zero = zero = int(0);
    int.unit = unit = int(1);
    Num.makeCon("zero", zero);
    Num.makeCon("unit", unit);
    } ( Num ) );

    (function ( Num ) {var rat = Num.rat = Num.type("rat");
    var int = Num.int;
    var zero = int.zero;
    var unit = int.unit;
    var half;
    var mcom = function (a, b) {
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
        };
    var dcom = function (a, b) {
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
        };
    
    Num.define("rat", {
        parse : function () {
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
            },
        neg : function () {
                var clone = rat(this.val);
                clone.val.neg = !this.val.neg;
                return clone;
            },
        inv : function () {
                this.imp();
                if (this.n().eq(zero)) {
                    return rat({w:int(NaN), n:int(NaN), d: int(NaN)});
                }
                return rat({w:zero, n: this.d(), d: this.n()});
            },
        abs : function () {
                var clone = rat(this.val);
                clone.val.neg = false;
                return clone;
            },
        str : function (options) {
                if (options) {
                    if (options.simplify) {
                        this.simplify();
                    }
                }
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
            },
        ipow : function (power) {
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
                    return prod;
                } else if ( (typeof power === "number") && (power < 0) && (Math.floor(power) === power) ) {
                    power = -power;
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
                    return prod.inv();  
                }
            
            },
        w : function () {
                return this.val.w;
            },
        n : function () {
                return this.val.n;
            },
        d : function () {
                return this.val.d;
            },
        imp : function () {
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
            },
        mix : function () {
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
            },
        reduce : function () {
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
            },
        scale : function (s) {
                var r = this.val;
                r.n = r.n.mul(s);
                r.d = r.d.mul(s);
                return this;
            },
        sim : function () {
                this.mix().reduce();
                if (this.n().eq(zero)) {
                    return (this.sign() ? this.w().neg() : this.w());
                } else {
                    return this;
                }
            },
        simplify : function () {
                this.mix().reduce();
                if (this.n().eq(zero)) {
                    return (this.sign() ? this.w().neg() : this.w());
                } else {
                    return this;
                }
            },
        sign : function () {
                return (this.val.neg ? "-" : "");
            },
        floor : function () {
                this.mix();
                return this.w();
            },
        ceil : function () {
                this.mix();
                return this.w().add(unit);
            },
        round : function () {
                this.mix();
                if (this.frac().gt(half)) {
                    return this.w().add(unit);
                } else {
                    return this.w();
                }
            },
        frac : function () {
                this.mix();
                return rat({neg:this.neg, w:zero, n:this.n(), d:this.d()});
            },
        make: rat
    });
    Num.define("rat,rat", {
        add : function (b) {
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
            },
        sub : function (b) {
                return this.add(b.neg());
            },
        mul : function (b) {
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
            },
        div : function (b) {
                return this.mul(b.inv());
            },
        mgt : function (b) {
                this.mix();
                b.mix();
                return (mcom(this.val,b.val) > 0 ) ? true : false;
            },
        mgte : function (b) {
                this.mix();
                b.mix();
                return (mcom(this.val,b.val) >= 0 ) ? true : false;
            },
        mlt : function (b) {
                this.mix();
                b.mix();
                return (mcom(this.val,b.val) <  0 ) ? true : false;
            },
        mlte : function (b) {
                this.mix();
                b.mix();
                return (mcom(this.val,b.val) <= 0 ) ? true : false;
            },
        meq : function (b) {
                this.mix();
                b.mix();
                return (mcom(this.val,b.val) === 0 ) ? true : false;
            },
        gt : function (b) {
                this.mix();
                b.mix();
                return (dcom(this.val,b.val) > 0 ) ? true : false;
            },
        gte : function (b) {
                this.mix();
                b.mix();
                return (dcom(this.val,b.val) >= 0 ) ? true : false;
            },
        lt : function (b) {
                this.mix();
                b.mix();
                return (dcom(this.val,b.val) <  0 ) ? true : false;
            },
        lte : function (b) {
                this.mix();
                b.mix();
                return (dcom(this.val,b.val) <= 0 ) ? true : false;
            },
        eq : function (b) {
                this.mix();
                b.mix();
                return (dcom(this.val,b.val) === 0 ) ? true : false;
            },
        max : function (r) {
                if (this.gte(r)) {
                    return this;
                } else {
                    return r;
                }
            },
        mmax : function (r) {
                if (this.mgte(r)) {
                    return this;
                } else {
                    return r;
                }
            },
        min : function (r) {
                if (this.lte(r)) {
                    return this;
                } else {
                    return r;
                }
            },
        mmin : function (r) {
                if (this.mlte(r)) {
                    return this;
                } else {
                    return r;
                }
            }
    });
    
    half = rat.half = rat({neg:false, w: zero, n: unit, d: int(2)});
    rat.zero = rat({neg:false, w: zero, n: zero, d: unit});
    rat.unit = rat({neg:false, w: zero, n: unit, d: unit});
    Num.makeCon("zero", rat.zero);
    Num.makeCon("unit", rat.unit);    
    Num.makeCon("half", half);
    } ( Num ) );

    (function ( Num ) {var sci = Num.sci = Num.type("sci");
    var int = Num.int;
    var zero = int.zero;
    var unit = int.unit;
    var digcom = function (a, b) {
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
        };
    var mcom = function (a, b) {
            if (a.E > b.E) {
                return 1;
            } else if (a.E < b.E) {
                return -1;
            } else {
                return digcom(a, b); 
            }
        };
    var dcom = function (a, b) {
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
        };
    var divsci = function (num, den, pre) {
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
        };
    var detpre = function (level, pre) {
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
        };
    
    Num.define("sci", {
        parse : function () {
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
                    this.val =  (function ( o, zero, int, divsci, sci ) {var pre,l, i, E, ext, str, divres, val;
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
                        } ( o,zero,int,divsci,sci ) );
                } else {
                    return false;
                }
            
                this.val.iE = this.val.E - (this.val.i.str().length - 1);
                this.val.p = this.val.p || 1;
            
                if (this.val.i.eq(zero ) ) {
                    this.val.E = -Infinity;
                }
                return this;
            },
        neg : function () {
                var clone = sci(this.val);
                clone.val.neg = !clone.val.neg;
                return clone;
            },
        inv : function (level) {
                return unit.div(this, level); //divsci(unit, this.val.i, detpre(level, this.pre()));
            },
        abs : function () {
                var clone = sci(this.val);
                clone.val.neg = false;
                return clone;
            },
        str : function (level) {
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
            },
        ipow : function (power) {
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
                    return prod;
                } else if ( (typeof power === "number") && (power < 0) && (Math.floor(power) === power) ) {
                    power = -power;
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
                    return prod.inv();  
                }
            
            },
        coef : function (pre) {
                var istr;
                if ((typeof pre === "number") && (pre < Infinity) ) {
                    istr = this.val.i.str();
                    return int(istr.slice(0, pre));  // 
                } else {
                    return this.val.i;
                }
            },
        lead : function () {
                var i = this.val.i;
                return i.str()[0];
            },
        slice : function (n) {
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
            },
        i : function () {
                return this.val.i;
            },
        E : function () {
                if (! this.val.E) {
                    return 0;
                }
                return this.val.E;
            },
        iE : function () {
                return this.val.iE;
            },
        pre : function () {
                return this.val.p;
            },
        sign : function () {
                return (this.val.neg ? "-" : "");
            },
        floor : function (n) {
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
            },
        ceil : function (n) {
                return this.neg().floor(n).neg();
            },
        round : function (n) {
                if (this.val.i.str().length <= n) {  // already done
                    return sci(this.val);
                }
                var half = sci({neg: false, i:int(5), E:this.E()-(n-1)-1, p:Infinity});
                return this.add(half).floor(n);
            },
        make: sci
    });
    Num.define("sci,sci", {
        add : function (r, level) {
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
            },
        sub : function (b, level) {
                return this.add(b.neg(), level);
            },
        mul : function (r,level) {
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
            },
        div : function (den, level) {
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
            },
        mgt : function (b) {
                return (mcom(this.val,b.val) > 0 ) ? true : false;
            },
        mgte : function (b) {
                return (mcom(this.val,b.val) >= 0 ) ? true : false;
            },
        mlt : function (b) {
                return (mcom(this.val,b.val) <  0 ) ? true : false;
            },
        mlte : function (b) {
                return (mcom(this.val,b.val) <= 0 ) ? true : false;
            },
        meq : function (b) {
                return (mcom(this.val,b.val) === 0 ) ? true : false;
            },
        gt : function (b) {
                return (dcom(this.val,b.val) > 0 ) ? true : false;
            },
        gte : function (b) {
                return (dcom(this.val,b.val) >= 0 ) ? true : false;
            },
        lt : function (b) {
                return (dcom(this.val,b.val) <  0 ) ? true : false;
            },
        lte : function (b) {
                return (dcom(this.val,b.val) <= 0 ) ? true : false;
            },
        eq : function (b) {
                return (dcom(this.val,b.val) === 0 ) ? true : false;
            },
        max : function (r) {
                if (this.gte(r)) {
                    return this;
                } else {
                    return r;
                }
            },
        mmax : function (r) {
                if (this.mgte(r)) {
                    return this;
                } else {
                    return r;
                }
            },
        min : function (r) {
                if (this.lte(r)) {
                    return this;
                } else {
                    return r;
                }
            },
        mmin : function (r) {
                if (this.mlte(r)) {
                    return this;
                } else {
                    return r;
                }
            }
    });
    
    sci.zero = sci({i:int(0), neg: false, p:Infinity, E: 0});
    sci.unit = sci({i:int(1), neg: false, p:Infinity, E: 0});
    Num.makeCon("zero", sci.zero);    
    Num.makeCon("unit", sci.unit);
    } ( Num ) );

    (function ( Num ) {var com = Num.com = Num.type("com");
    var int = Num.int;
    var zero = int.zero;
    var unit = int.unit;
    
    Num.define("com", {
        parse : function () {
                var o = this.original;
                if (o.hasOwnProperty("re") && o.hasOwnProperty("im") ) {
                    this.val = {re: o.re, im: o.im};
                } 
                return this;
            },
        neg : function () {
                var val = this.val;
                var clone = {
                    re : val.re.neg(),
                    im : val.im.neg()
                };
                return com(clone);
            },
        inv : function () {
                var mag = this.abssq();
                var clone = {
                    re : this.re().div(mag),
                    im : this.im().neg().div(mag)
                };
                return com(clone);
            },
        abssq : function () {
                var re = this.val.re;
                var im = this.val.im;
                return re.mul(re).add(im.mul(im));
            },
        str : function () {
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
                if (im === "1i") {
                    im = '-i';
                }
                ret = re + plus + im;
                return (ret ? ret : "0");
            },
        ipow : function (power) {
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
                    return prod;
                } else if ( (typeof power === "number") && (power < 0) && (Math.floor(power) === power) ) {
                    power = -power;
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
                    return prod.inv();  
                }
            
            },
        re : function () {
                return this.val.re;
            },
        im : function () {
                return this.val.im;
            },
        apply : function () {
                this.apply_re.apply(this, arguments);
                this.apply_im.apply(this, arguments);
                return this;
            },
        apply_re : function (str) {
                return this.val.re[str].apply(this, Array.prototype.slice.call(arguments, 1));
            },
        apply_im : function (str) {
                return this.val.im[str].apply(this, Array.prototype.slice.call(arguments, 1));
            },
        make: com
    });
    Num.define("com,com", {
        add : function (r) {
                var lv = this.val;
                var rv = r.val;
                return com({re: lv.re.add(rv.re), im:lv.im.add(rv.im)});
            },
        sub : function (r) {
                return this.add(r.neg());
            },
        mul : function (r) {
                var l = this;
                var res = com({
                    re : l.re().mul(r.re()).sub(l.im().mul(r.im())),
                    im : l.re().mul(r.im()).add(l.im().mul(r.re()))
                });
                return res;
            },
        div : function (r) {
                return this.mul(r.inv());
            }
    });
    
    com.zero = com({re:zero, im: zero});    
    com.unit = com({re:unit, im: zero});
    Num.makeCon("zero", com.zero);    
    Num.makeCon("unit", com.unit);
    } ( Num ) );

    (function ( Num ) {var fullops = ['add', 'sub', 'mul', 'div', 'pow', 'mgt', 'mgte', 'mlt', 'mlte', 'meq', 'gt', 'gte', 'lt', 'lte', 'eq', 'max', 'mmax', 'min', 'mmin'];
    
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
    
    converter(['int'], 'rat', fullops, function (op) {
            return function (r) {
                var l = this, result;
                if (l.type === "rat") {
                    result = l[op](r.rat());
                } else {
                    result = l.rat()[op](r);
                }
                return result;
            };
        });
    converter(['int', 'rat'], 'sci', fullops, function (op) {
            return function (r) {
                var l = this, result;
                if (l.type === "sci") {
                    result = l[op](Num.sci(r));
                } else {
                    result = Num.sci(l)[op](r);
                }
                return result;
            };
        });
    converter(['int', 'rat', 'sci'], 'float', fullops, function (op) {
            return function (r) {
                var l = this, result;
                if (l.type === "float") {
                    result = l[op](r.float());
                } else {
                    result = l.float()[op](r);
                }
                return result;
            };
        });
    converter(['int', 'rat', 'sci', 'float'], 'com', arithops, function (op) {
            return function (r) {
                var l = this, result;
                if (l.type === "com") {
                    result = l[op](Num.com({re:r, im:r.zero()}));
                } else {
                    result = Num.com({re:l, im:l.zero()})[op](r);
                }
                return result;
            };
        });
    converter(['int', 'rat', 'sci', 'float'], '', fullops, function (op) {
            return function (r) {
                var result;
                var right = this.make(r);
                result = this[op](right);
                return result;        
            };
        });
    converter(['com'], '', arithops, function (op) {
            return function (r) {
                var result;
                var right = this.re().make(r);
                right = Num.com({re: right, im: right.zero});
                result = this[op](right);
                return result;
            };
        });
    } ( Num ) );

}).call(this);