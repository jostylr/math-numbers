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
    var ops = ['add', 'sub', 'mul', 'div', 'pow',  'max', 'mmax', 'min', 'mmin'];
    var comps = ['mgt', 'mgte', 'mlt', 'mlte', 'meq', 'gt', 'gte', 'lt', 'lte', 'eq'];
    var unitary = ['neg', 'round', 'floor', 'abs', 'ceil'];
    samples.forEach(function (bin) {
        var a = bin[0], 
            b = bin[1];

        actual.push("a: " + a.str() + ", b: " + b.str());
        ops.forEach(function(op) {
            actual.push(op+": " + a[op](b).str());
        });

        comps.forEach(function(comp) {
            actual.push(comp+": " + a[comp](b));
        });

        unitary.forEach( function(un) {
            actual.push(un+": " + a[un]().str() + "; " + b[un]().str());
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
            return el.trim();
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
            "float tests" : _"float tests*test template"
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
