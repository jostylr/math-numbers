# Test files

This is a set of tests for this library to pass. 



## Float tests

This will test the basic math functions for our float system. This is a number system that comes with the language so it ought to do pretty well...

[key]()

    float tests

[expected]()

    1
    2.3
    3.3
    2.3
    -1.2999999999999998
    0.4347826086956522

[code]()

    var a = new Num(1, "float");
    var b = Num.float(2.3);
    actual.push("1", "2.3");
    actual.push(a.add(b).str());
    actual.push(a.mul(b).str());
    actual.push(a.sub(b).str());
    actual.push(a.div(b).str());



## Async emitting

This is a snippet that should be placed at the end of each async function. 

    emitter.on("done", function () {
        var result;

        result = Test.same(actual, expected);
        if (result === true ) {
           tester.emit("passed", key);
        } else {
            tester.emit("failed", {key:key, result:result});
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
