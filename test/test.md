# Test files

This is a set of tests for this library to pass. 


## TODO

Comparators:  ? :  a ? b, b ? a, a ? a, b ? b,  a ? -a, b ? -b

Fix sci division



## Float tests

This will test the basic math functions for our float system. This is a number system that comes with the language so it ought to do pretty well...

[key]()

    float tests

[expected]()

    zero: 0, one: 1
    a: 2.3, b: -3
    ?: a ? b; b ? a, a ? a, b ? a
    add: -0.7000000000000002; -0.7000000000000002; 4.6; -6
    sub: 5.3; -5.3; 0; 0
    mul: -6.8999999999999995; -6.8999999999999995; 5.289999999999999; 9
    div: -0.7666666666666666; -1.3043478260869565; 1; 1
    max: 2.3; 2.3; 2.3; -3
    mmax: -3; -3; 2.3; -3
    min: -3; -3; 2.3; -3
    mmin: 2.3; 2.3; 2.3; -3
    mgt: false; true; false; false
    mgte: false; true; true; true
    mlt: true; false; false; false
    mlte: true; false; true; true
    meq: false; false; true; true
    gt: true; false; false; false
    gte: true; false; true; true
    lt: false; true; false; false
    lte: false; true; true; true
    eq: false; false; true; true
    neg: -2.3; 3
    round: 2; -3
    floor: 2; -3
    abs: 2.3; 3
    ceil: 3; -3
    inv: 0.4347826086956522; -0.3333333333333333
    a ipow 5: 64.36342999999998
    b ipow 5: -243
    a ipow -4: 0.03573457784956459
    b ipow -4: 0.012345679012345678

[code]()

    var float = Num.float;
    actual.push("zero: " + float.zero.str() +  ", one: " + float.unit.str());
    var samples = [ 
        [new Num(2.3, "float"), Num.float(-3)]
    ];

    _"ops"


## Integers

[key]()

    integers

[expected]()

    zero: 0, one: 1
    a: 10, b: -12
    ?: a ? b; b ? a, a ? a, b ? a
    add: -2; -2; 20; -24
    sub: 22; -22; 0; 0
    mul: -120; -120; 100; 144
    div: -10/12; -1 2/10; 1 ; 1 
    max: 10; 10; 10; -12
    mmax: -12; -12; 10; -12
    min: -12; -12; 10; -12
    mmin: 10; 10; 10; -12
    quo: 0; 1; 1; 1
    rem: 10; 2; 0; 0
    gcd: 2; 2; 10; 12
    lcm: -60; 60; 10; -12
    mgt: false; true; false; false
    mgte: false; true; true; true
    mlt: true; false; false; false
    mlte: true; false; true; true
    meq: false; false; true; true
    gt: true; false; false; false
    gte: true; false; true; true
    lt: false; true; false; false
    lte: false; true; true; true
    eq: false; false; true; true
    neg: -10; 12
    round: 10; -12
    floor: 10; -12
    abs: 10; 12
    ceil: 10; -12
    inv: 1/10; -1/-12
    a ipow 5: 100000
    b ipow 5: -248832
    a ipow -4: 1/10000
    b ipow -4: 1/20736
    a shift 2: 1000
    b shift 2: -1200
    a sign : 
    b sign : -
    a: 123456789123456789123456789, b: 5
    ?: a ? b; b ? a, a ? a, b ? a
    add: 123456789123456789123456794; 123456789123456789123456794; 246913578246913578246913578; 10
    sub: 123456789123456789123456784; -123456789123456789123456784; 0; 0
    mul: 617283945617283945617283945; 617283945617283945617283945; 15241578780673678546105778281054720515622620750190521; 25
    div: 24691357824691357824691357 4/5; 5/123456789123456789123456789; 1 ; 1 
    max: 123456789123456789123456789; 123456789123456789123456789; 123456789123456789123456789; 5
    mmax: 123456789123456789123456789; 123456789123456789123456789; 123456789123456789123456789; 5
    min: 5; 5; 123456789123456789123456789; 5
    mmin: 5; 5; 123456789123456789123456789; 5
    quo: 24691357824691357824691357; 0; 1; 1
    rem: 4; 5; 0; 0
    gcd: 1; 1; 123456789123456789123456789; 5
    lcm: 617283945617283945617283945; 617283945617283945617283945; 123456789123456789123456789; 5
    mgt: true; false; false; false
    mgte: true; false; true; true
    mlt: false; true; false; false
    mlte: false; true; true; true
    meq: false; false; true; true
    gt: true; false; false; false
    gte: true; false; true; true
    lt: false; true; false; false
    lte: false; true; true; true
    eq: false; false; true; true
    neg: -123456789123456789123456789; -5
    round: 123456789123456789123456789; 5
    floor: 123456789123456789123456789; 5
    abs: 123456789123456789123456789; 5
    ceil: 123456789123456789123456789; 5
    inv: 1/123456789123456789123456789; 1/5
    a ipow 5: 28679718746395774517519299647974067853199588896463036970972834315105461935781603131036162289536454167206060221256216795681720482949
    b ipow 5: 3125
    a ipow -4: 1/232305723727482137666188006551300203692658625799727977970043302090695104949336681913044437155857798251441
    b ipow -4: 1/625
    a shift 2: 12345678912345678912345678900
    b shift 2: 500
    a sign : 
    b sign : 


[code]()

    var int = Num.int;
    actual.push("zero: " + int.zero.str() +  ", one: " + int.unit.str());
    var samples = [ 
        [new Num(10, "int"), Num.int(-12)],
        [new Num("123456789123456789123456789", "int"), new Num("5", "int")]
    ];

    _"ops"

    others.push(["shift", 2], ["sign"]);
    ops.push("quo", "rem", "gcd", "lcm");

## Rationals

[key]()

    rationals

[expected]()

    zero: 0, one: 1/1
    a: -23 4/5, b: 2 1/4
    ?: a ? b; b ? a, a ? a, b ? a
    add: -21 11/20; -11/20; -47 3/5; 4 1/2
    sub: -26 1/20; 26 1/20; 23 ; 2 
    mul: -53 11/20; -53 11/20; 566 11/25; 5 1/16
    div: -95 1/5; -2 13/16; -29 3/4; -9 
    max: 2 1/4; 2 1/4; -23 4/5; 2 1/4
    mmax: -23 4/5; -23 4/5; -23 4/5; 2 1/4
    min: -23 4/5; -23 4/5; -23 4/5; 2 1/4
    mmin: 2 1/4; 2 1/4; -23 4/5; 2 1/4
    mgt: true; false; false; false
    mgte: true; false; true; true
    mlt: false; true; false; false
    mlte: false; true; true; true
    meq: false; false; true; true
    gt: false; true; false; false
    gte: false; true; true; true
    lt: true; false; false; false
    lte: true; false; true; true
    eq: false; false; true; true
    neg: 23 4/5; -2 1/4
    round: 23; 2
    floor: 23; 2
    abs: 23 4/5; 2 1/4
    ceil: 24; 3
    inv: 5/4; 4/1
    a ipow 5: -23863536599/3125
    b ipow 5: 59049/1024
    a ipow -4: 625/200533921
    b ipow -4: 256/6561
    a: -34233112312312 423452345234523/52323412412341234123412424, b: 5 2/3
    ?: a ? b; b ? a, a ? a, b ? a
    add: -34233112312306 17441137471203863719705331/52323412412341234123412424; -34882274941137370403707093/52323412412341234123412424; -68466224624624 141150781744841/8720568735390205687235404; 11 1/3
    sub: -34233112312317 34882274941984275094176139/52323412412341234123412424; 34233112312317 34882274941984275094176139/52323412412341234123412424; 34233112312312 ; 5 
    mul: -193987636436434 34882274943960386038603913/52323412412341234123412424; -193987636436434 34882274943960386038603913/52323412412341234123412424; 1171905978587367447426785898 29143618721581228223533500083789330819707263174097/304193276274660525031203063573354935712562044172864; 32 1/9
    div: -51349668468468 423452345234523/34882274941560822748941616; -700195288419 78201185114599/423452345234523; -4229975991000995797887454 96033141608123/141150781744841; -8 1/2
    max: 5 2/3; 5 2/3; -34233112312312 141150781744841/17441137470780411374470808; 5 2/3
    mmax: -34233112312312 141150781744841/17441137470780411374470808; -34233112312312 141150781744841/17441137470780411374470808; -34233112312312 141150781744841/17441137470780411374470808; 5 2/3
    min: -34233112312312 141150781744841/17441137470780411374470808; -34233112312312 141150781744841/17441137470780411374470808; -34233112312312 141150781744841/17441137470780411374470808; 5 2/3
    mmin: 5 2/3; 5 2/3; -34233112312312 141150781744841/17441137470780411374470808; 5 2/3
    mgt: true; false; false; false
    mgte: true; false; true; true
    mlt: false; true; false; false
    mlte: false; true; true; true
    meq: false; false; true; true
    gt: false; true; false; false
    gte: false; true; true; true
    lt: true; false; false; false
    lte: true; false; true; true
    eq: false; false; true; true
    neg: 34233112312312 141150781744841/17441137470780411374470808; -5 2/3
    round: 34233112312312; 5
    floor: 34233112312312; 5
    abs: 34233112312312 141150781744841/17441137470780411374470808; 5 2/3
    ceil: 34233112312313; 6
    inv: 17441137470780411374470808/141150781744841; 3/2
    a ipow 5: -75876266051726016288362945578759763056635122284992083968641337925116642657968527972891191035361328573061520034247965020952437427310725292751350296770527146128909309683597342642359413061999628457/1613890354536187775302160953265752695435112751828964879426742328250076236565133446172529180718845080409079319836700746358816768
    b ipow 5: 1419857/243
    a ipow -4: 92533549330711945869681728269646333056653001625070330909647963004625471113007801763490586377913962496/127082210525379419180829536422181247314673467860098639914056136490622318985233240122776502477599013115836647748861587708356077596951348198006971786371948961
    b ipow -4: 81/83521

[code]()

    var rat = Num.rat;
    actual.push("zero: " + rat.zero.str() +  ", one: " + rat.unit.str());
    var samples = [ 
        [new Num("-23 4/5", "rat"), Num.rat("2 1/4")],
        [Num.rat("-34233112312312 423452345234523/52323412412341234123412424"), new Num("5 2/3", "rat")]
    ];

    _"ops"

    format.simplify = true;


## Scientific


[key]()

    scientific

[expected]()

    zero: 0.E-Infinity:oo, one: 1
    a: -1.45E34, b: 4.532312342345234523E12
    ?: a ? b; b ? a, a ? a, b ? a
    add: -1.45E34; -1.45E34; -2.90E34; 9.064624684690469046E12
    sub: -1.45E34; 1.45E34; 0.E-Infinity:2; 0.E-Infinity:18
    mul: -6.57E46; -6.57E46; 2.10E68; 2.054185516857494634E24
    div: -3.20E21; -3.13E-22; 1.00E0; 1.000000000000000000E0
    max: 4.532312342345234523E12; 4.532312342345234523E12; -1.45E34; 4.532312342345234523E12
    mmax: -1.45E34; -1.45E34; -1.45E34; 4.532312342345234523E12
    min: -1.45E34; -1.45E34; -1.45E34; 4.532312342345234523E12
    mmin: 4.532312342345234523E12; 4.532312342345234523E12; -1.45E34; 4.532312342345234523E12
    mgt: true; false; false; false
    mgte: true; false; true; true
    mlt: false; true; false; false
    mlte: false; true; true; true
    meq: false; false; true; true
    gt: false; true; false; false
    gte: false; true; true; true
    lt: true; false; false; false
    lte: true; false; true; true
    eq: false; false; true; true
    neg: 1.45E34; -4.532312342345234523E12
    round: -1.41E34; 4.532312342345234528E12
    floor: -1.46E34; 4.532312342345234523E12
    abs: 1.45E34; 4.532312342345234523E12
    ceil: -1.45E34; 4.532312342345234524E12
    inv: -6.90E-35; 2.206379270592265308E-13
    a ipow 5: -6.41E170
    b ipow 5: 1.912489930407291642E60
    a ipow -4: 2.26E-137
    b ipow -4: 2.369848996475508153E-49
    a: 1.2341234E-30, b: 2
    ?: a ? b; b ? a, a ? a, b ? a
    add: 1.2E0; 1.2E0; 2.4682468E-30; 4
    sub: 1.2E0; -1.2E0; 0.E-Infinity:7; 0.E-Infinity:1
    mul: 2.5E-30; 2.5E-30; 1.5230606E-60; 4
    div: 6.2E-31; 1.6E30; 1.0000000E0; 1.0E0
    max: 2; 2; 1.2341234E-30; 2
    mmax: 2; 2; 1.2341234E-30; 2
    min: 1.2341234E-30; 1.2341234E-30; 1.2341234E-30; 2
    mmin: 1.2341234E-30; 1.2341234E-30; 1.2341234E-30; 2
    mgt: false; true; false; false
    mgte: false; true; true; true
    mlt: true; false; false; false
    mlte: true; false; true; true
    meq: false; false; true; true
    gt: false; true; false; false
    gte: false; true; true; true
    lt: true; false; false; false
    lte: true; false; true; true
    eq: false; false; true; true
    neg: -1.2341234E-30; -2
    round: 1.2341239E0:37; 7
    floor: 1.2341234E-30; 2
    abs: 1.2341234E-30; 2
    ceil: 1.2341235E-30; 3
    inv: 8.1029174E29; 5.0E-1
    a ipow 5: 2.8628127E-150
    b ipow 5: 3.2E0
    a ipow -4: 4.3108772E119
    b ipow -4: 6.3E-1

[code]()

    var sci = Num.sci;
    actual.push("zero: " + sci.zero.str() +  ", one: " + sci.unit.str());
    var samples = [ 
        [new Num("-1.45E34", "sci"), Num.sci("4.532312342345234523E12")],
        [new Num("1.2341234E-30", "sci"), new Num("2", "sci")]
    ];

    _"ops"

## Complex


[key]()

    Complex

[expected]()

    zero: 0, one: 1
    a: 5+10i, b: -8-43i
    ?: a ? b; b ? a, a ? a, b ? a
    add: -3-33i; -3-33i; 10+20i; -16-86i
    sub: 13+53i; -13-53i; 0; 0
    mul: 390-295i; 390-295i; -75+100i; -1785+688i
    div: -470/1913+135/1913i; 3 15/125-295/125i; 125/125; 1785/1913-688/1913i
    neg: -5-10i; 8+43i
    inv: 5/125-10/125i; -8/1913+43/1913i
    abssq: 125; 1913
    re: 5; -8
    im: 10; -43
    a ipow 5: 128125-118750i
    b ipow 5: -127317928-97004603i
    a ipow -4: -4375/244140625+15000/244140625i
    b ipow -4: 2712881/13392445265761+2456160/13392445265761i

[code]()

    var com = Num.com, int = Num.int;
    actual.push("zero: " + com.zero.str() +  ", one: " + com.unit.str());
    var samples = [ 
        [com({re : int(5), im : int(10)}), com({re:int(-8), im : int(-43)})]
    ];

    _"ops"

    ops = ['add', 'sub', 'mul', 'div'];
    comps = [];
    unitary = ['neg', 'inv', 'abssq', 're', 'im'];


## Ops

These are the operations, comparisons (yielding true/false), and unitary operators. 

    var ops = ['add', 'sub', 'mul', 'div', 'max', 'mmax', 'min', 'mmin'];
    var comps = ['mgt', 'mgte', 'mlt', 'mlte', 'meq', 'gt', 'gte', 'lt', 'lte', 'eq'];
    var unitary = ['neg', 'round', 'floor', 'abs', 'ceil', 'inv'];
    var others = [['ipow', Num.int(5)], ['ipow', -4]];
    var format = {};


## Core redundant code

This takes an array of samples and runs them through the arrays of opeartions, comparisons, and unitary operators. 

    samples.forEach(function (bin) {
        var a = bin[0], 
            b = bin[1];

        actual.push("a: " + a.str() + ", b: " + b.str());

        actual.push("?: a ? b; b ? a, a ? a, b ? a");        
        ops.forEach(function(op) {
            //console.log(op);
            actual.push( op+": " +
                a[op](b).str(format) + "; " +
                b[op](a).str(format) + "; " +
                a[op](a).str(format) + "; " +
                b[op](b).str(format) 
            );
        });

        comps.forEach(function(comp) {
            //console.log(comp);
            actual.push(comp + ": " +
                a[comp](b) + "; " +
                b[comp](a) + "; " +
                a[comp](a) + "; " +
                b[comp](b) 
            );
        });

        unitary.forEach( function(un) {
            //console.log(un);
            actual.push(un+": " + a[un]().str() + "; " + b[un]().str());
        });

        others.forEach( function (other) {
            var result, 
                str = "", 
                argstr = [],
                args = other.slice(1),
                op = other[0];

            //console.log(op);

            args.forEach(function (el) {
                if (el instanceof Num) {
                    argstr.push(el.str());
                } else {
                    argstr.push(el+"");
                }
            });

            argstr = argstr.join(" , ");

            result = a[op].apply(a, args);
            str = "a " + op + " " + argstr +": ";
            if (result instanceof Num) {
                actual.push(str + result.str());
            } else {
                actual.push(str + result);
            }
            str = "b " + op + " " + argstr +": ";
            result = b[op].apply(b, args);
            if (result instanceof Num) {
                actual.push(str+ result.str());
            } else {
                actual.push(str+ result);
            }

        });


    });

## Done

This checks whether the tests passed.

    function (actual, expected, key) {
        var result;

        result = same(actual, expected);
        if (result === true ) {
            passing(key);
        } else {
            failing(key, result, actual, expected);
        }    
    }


## Test Template

This is the test template

    function () {

        var key = '_"*:key"';

        var expected = _"*:expected| arrayify",
            actual = [];

        _"*:code"



        _"core redundant code"


        done(actual, expected, key);

    }

## Arrayify

We define a command that takes a list of items separated by returns and makes an array out of them. The strings are trimmed and empty lines are ignored. This should allow for some whitespace formatting. 

    function (code) {
        var lines = code.split("\n");
        return '[\n"' + lines.filter(function (el) {
            if (el.length > 0) {
                return true;
            } else {
                return false;
            }
        }).map(function (el) {
            return el; //.trim();
        }).join('",\n"') + '"\n]';
    }

[arrayify](#arrayify "define: command | | now")


## same comparison

This is the set of test functions one can use. Basic. 

    function (actual, expected) {
        var i, n = actual.length;

        if (actual.length !== expected.length) {
            return actual;
        }

        for (i =0; i <n; i+=1 ) {
            if (actual[i] !== expected[i]) {
                return "expected: " + expected[i] + "\nactual: " +actual[i];
            }
        }
        return true;
    }

## [testrunner.js](#testrunner.js "save: |jshint")

This is a simple test runner. 


    /*global module, require, console*/

    (function () {

        var Num, key, same, records, passing, failing, n, done;

        if (typeof module !== 'undefined' && module.exports) {
            Num = require('../index.js');            
        } else {
            Num = this.Num;
        }

        same = _"same comparison";

        _"testing code"

    }).call(this);


## testing code
        
This is only suitable for synchronous testing. Hey, this is a math library, for crying out loud...

    records = {
            "float tests" : _"float tests*test template",
            "integers" : _"integers*test template",
            "rationals": _"rationals*test template",
            "scientific" : _"scientific*test template",
            "complex" : _"complex*test template"
    };

    done = _"done";

    if (this.hasOwnProperty("test") && (typeof this.test === "function") ) {
        passing = _":q passing";
        failing = _":q failing";
        this.test(            "integers" , _"integers*test template");
        this.test("float tests" , _"float tests*test template");
    
        for (key in records) {
            console.log(key);
            this.test(key, records[key]);
        }
    } else {
        passing = _":passing";
        failing = _":failing";

        for (key in records) {
            records[key]();
        }

        n = Object.keys(records).length;
        if ( n > 0 ) {
            console.log("Remaining keys:", Object.keys(records));
            throw(n + " number of failures!");
        }
    }


[passing](# "js")

    function (key) {
        key = key.toLowerCase();
        delete records[key];
        console.log("passed: " + key);
    }

[failing](# "js")

    function (key, result, actual, expected) {
        console.log("FAILED: " + key);
        console.log(result);
        console.log("expected:", expected);
        console.log("actual:\n"+ actual.join("\n"));
    }


[q passing](# "js")

    function (key) {
        this.ok(true, "Passed:"+ key);
    }

[q failing](# "js")

    function (key, result, actual, expected) {
        this.ok(false, "FAILED: " + key + 
            result + "expected:" + expected + "actual:\n"+ actual.join("\n")
        );
    }
