# Test files

This is a set of tests for this library to pass. 



## Float tests

This will test the basic math functions for our float system. This is a number system that comes with the language so it ought to do pretty well...

[key]()

    float tests

[expected]()

    zero: 0, one: 1
    a: 2.3, b: -3
    add: -0.7000000000000002
    sub: 5.3
    mul: -6.8999999999999995
    div: -0.7666666666666666
    pow: 0.08218952905399854
    max: 2.3
    mmax: -3
    min: -3
    mmin: 2.3
    mgt: false
    mgte: false
    mlt: true
    mlte: true
    meq: false
    gt: true
    gte: true
    lt: false
    lte: false
    eq: false
    neg: -2.3; 3
    round: 2; -3
    floor: 2; -3
    abs: 2.3; 3
    ceil: 3; -3

[code]()

    
    var instance = new Num(4, "float");
    actual.push("zero: " + instance.zero().str() +  ", one: " + instance.unit().str());
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
    add: -2
    sub: 22
    mul: -120
    div: -10/12
    pow: 1/1000000000000
    max: 10
    mmax: -12
    min: -12
    mmin: 10
    quo: 0
    rem: 10
    gcd: 2
    lcm: -60
    mgt: false
    mgte: false
    mlt: true
    mlte: true
    meq: false
    gt: true
    gte: true
    lt: false
    lte: false
    eq: false
    neg: -10; 12
    round: 10; -12
    floor: 10; -12
    abs: 10; 12
    ceil: 10; -12
    a shift 2: 1000
    b shift 2: -1200
    a sign : 
    b sign : -
    a: 123456789123456789123456789, b: 5
    add: 123456789123456789123456794
    sub: 123456789123456789123456784
    mul: 617283945617283945617283945
    div: 24691357824691357824691357 4/5
    pow: 28679718746395774517519299647974067853199588896463036970972834315105461935781603131036162289536454167206060221256216795681720482949
    max: 123456789123456789123456789
    mmax: 123456789123456789123456789
    min: 5
    mmin: 5
    quo: 24691357824691357824691357
    rem: 4
    gcd: 1
    lcm: 617283945617283945617283945
    mgt: true
    mgte: true
    mlt: false
    mlte: false
    meq: false
    gt: true
    gte: true
    lt: false
    lte: false
    eq: false
    neg: -123456789123456789123456789; -5
    round: 123456789123456789123456789; 5
    floor: 123456789123456789123456789; 5
    abs: 123456789123456789123456789; 5
    ceil: 123456789123456789123456789; 5
    a shift 2: 12345678912345678912345678900
    b shift 2: 500
    a sign : 
    b sign : 

[code]()

    var instance = new Num(4, "int");
    actual.push("zero: " + instance.zero().str() +  ", one: " + instance.unit().str());
    var samples = [ 
        [new Num(10, "int"), Num.int(-12)],
        [new Num("123456789123456789123456789", "int"), new Num("5", "int")]
    ];

    _"ops"

    others.push(["shift", 2], ["sign"]);
    ops.push("quo", "rem", "gcd", "lcm");
    //ops = ops.filter(function (el) { return (el === "pow" ? false : true);});

## Ops

These are the operations, comparisons (yielding true/false), and unitary operators. 

    var ops = ['add', 'sub', 'mul', 'div', 'pow',  'max', 'mmax', 'min', 'mmin'];
    var comps = ['mgt', 'mgte', 'mlt', 'mlte', 'meq', 'gt', 'gte', 'lt', 'lte', 'eq'];
    var unitary = ['neg', 'round', 'floor', 'abs', 'ceil'];
    var others = [];


## Core redundant code

This takes an array of samples and runs them through the arrays of opeartions, comparisons, and unitary operators. 

    samples.forEach(function (bin) {
        var a = bin[0], 
            b = bin[1];

        actual.push("a: " + a.str() + ", b: " + b.str());
        ops.forEach(function(op) {
            //console.log(op);
            actual.push(op+": " + a[op](b).str());
        });

        comps.forEach(function(comp) {
            actual.push(comp+": " + a[comp](b));
        });

        unitary.forEach( function(un) {
            //console.log(un);
            actual.push(un+": " + a[un]().str() + "; " + b[un]().str());
        });

        others.forEach( function (other) {
            var result, str;
            result = a[other[0]](other[1]);
            str = "a " + other[0] + " " + (other[1] || "") +": ";
            if (result instanceof Num) {
                actual.push(str + result.str());
            } else {
                actual.push(str + result);
            }
            str = "b " + other[0] + " " + (other[1] || "") +": ";
            result = b[other[0]](other[1]);
            if (result instanceof Num) {
                actual.push(str+ result.str());
            } else {
                actual.push(str+ result);
            }

        });


    });

## Async emitting

This is a snippet that should be placed at the end of each async function. 

    emitter.on("done", function () {
        var result;

        result = Test.same(actual, expected);
        if (result === true ) {
           tester.emit("passed", key);
        } else {
            tester.emit("failed", {key:key, result:result, actual: actual, expected: expected});
        }    
    })


## Test Template

This is the test template

    function () {

        var emitter = new EventWhen();
        var key = '_"*:key"';

        emitter.name = key;

        var expected = _"*:expected| arrayify",
            actual = [];
        
        _"async emitting";

        _"*:code"



        _"core redundant code"


        emitter.emit("done");

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


## [test.js](#test.js "save: |jshint")

This is the set of test functions one can use. Basic. 

    /*global module*/
    module.exports.same = function (inp, out) {
        var i, n = inp.length;

        if (inp.length !== out.length) {
            return inp;
        }

        for (i =0; i <n; i+=1 ) {
            if (inp[i] !== out[i]) {
                return "expected: "+out[i] + "\nactual: " +inp[i];
            }
        }
        return true;
    };

## [testrunner.js](#testrunner.js "save: |jshint")

This is a simple test runner. 


    /*global require, console, process*/
    var Num = require('../index.js'),
        EventWhen = require('event-when'),
        Test = require('./test.js'),
        tester = new EventWhen(),
        key;
        
    var records = {
            "float tests" : _"float tests*test template",
            "integers" : _"integers*test template"
    };

    tester.on("passed", _":passing");

    tester.on("failed", _":failing");

    for (key in records) {
        records[key]();
    }

    process.on('exit', function () {
        var n = Object.keys(records).length;
        if ( n > 0 ) {
            console.log("Remaining keys:", Object.keys(records));
            throw(n + " number of failures!");
        }
    });



[passing](# "js")

    function (key) {
        key = key.toLowerCase();
        delete records[key];
        console.log("passed: " + key);
    }

[failing](# "js")

    function (data) {
        console.log("FAILED: " + data.key);
        console.log(data.result);
        console.log("expected:", data.expected);
        console.log("actual:\n"+ data.actual.join("\n"));
    }    

[run sync tests](# "js")

    function (tests) {
        var key, result; 


        for (key in tests ) {
            result = tests[key]();
            if (result === true) {
                tester.emit("passed", key);
            } else {
                tester.emit("failed", {key:key, result:result});
            }
        }
    }
