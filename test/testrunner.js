/*global require, console, process*/
var Num = require('../index.js'),
    EventWhen = require('event-when'),
    Test = require('./test.js'),
    tester = new EventWhen(),
    key;
    
var records = {
        "float tests" : function () {
            
                var emitter = new EventWhen();
                var key = 'float tests';
            
                emitter.name = key;
            
                var expected = [
                    "zero: 0, one: 1",
                    "a: 2.3, b: -3",
                    "add: -0.7000000000000002",
                    "sub: 5.3",
                    "mul: -6.8999999999999995",
                    "div: -0.7666666666666666",
                    "pow: 0.08218952905399854",
                    "max: 2.3",
                    "mmax: -3",
                    "min: -3",
                    "mmin: 2.3",
                    "mgt: false",
                    "mgte: false",
                    "mlt: true",
                    "mlte: true",
                    "meq: false",
                    "gt: true",
                    "gte: true",
                    "lt: false",
                    "lte: false",
                    "eq: false",
                    "neg: -2.3; 3",
                    "round: 2; -3",
                    "floor: 2; -3",
                    "abs: 2.3; 3",
                    "ceil: 3; -3"
                    ],
                    actual = [];
                
                emitter.on("done", function () {
                    var result;
                
                    result = Test.same(actual, expected);
                    if (result === true ) {
                       tester.emit("passed", key);
                    } else {
                        tester.emit("failed", {key:key, result:result, actual: actual, expected: expected});
                    }    
                });
            
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
            
                emitter.emit("done");
            
            }
};

tester.on("passed", function (key) {
        key = key.toLowerCase();
        delete records[key];
        console.log("passed: " + key);
    });

tester.on("failed", function (data) {
        console.log("FAILED: " + data.key);
        console.log(data.result);
        console.log("expected:", data.expected);
        console.log("actual:\n"+ data.actual.join("\n"));
    }    );

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