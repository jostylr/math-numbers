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
                    "1",
                    "2.3",
                    "3.3",
                    "2.3",
                    "-1.2999999999999998",
                    "0.4347826086956522"
                    ],
                    actual = [];
                
                emitter.on("done", function () {
                    var result;
                
                    result = Test.same(actual, expected);
                    if (result === true ) {
                       tester.emit("passed", key);
                    } else {
                        tester.emit("failed", {key:key, result:result});
                    }    
                });
            
                var a = new Num(1, "float");
                var b = Num.float(2.3);
                actual.push("1", "2.3");
                actual.push(a.add(b).str());
                actual.push(a.mul(b).str());
                actual.push(a.sub(b).str());
                actual.push(a.div(b).str());
            
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