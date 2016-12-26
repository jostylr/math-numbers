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

    ["rat", /^(-)?(\d+)_(\d+)\/(\d+)/, function (m) {
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

Rational in decimal form  (-)#.# #E#  1.2_3E34

    ["rat", /^(-)?(\d+)?\.(\d+)?_(\d+)\s?(E-?(\d+))?/, function (m) {
         _"parsing rational dec"
    }],

Scientific number  (-)#.#E(-)#:# 1.2E34:3  Using non-naming grouping for E and : since we can tell a match by existence of the number after the flag. 

    ["sci", /^(-)?(\d+)\.(\d+)?(?:E(-?\d+))?(?:\:(\d+))?/, function (m) {
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



