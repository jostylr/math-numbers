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
                    "ceil: 3; -3",
                    "inv: 0.4347826086956522; -0.3333333333333333",
                    "a ipow 5: 64.36342999999998",
                    "b ipow 5: -243",
                    "a ipow -4: 0.03573457784956459",
                    "b ipow -4: 0.012345679012345678"
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
                
                var ops = ['add', 'sub', 'mul', 'div', 'max', 'mmax', 'min', 'mmin'];
                var comps = ['mgt', 'mgte', 'mlt', 'mlte', 'meq', 'gt', 'gte', 'lt', 'lte', 'eq'];
                var unitary = ['neg', 'round', 'floor', 'abs', 'ceil', 'inv'];
                var others = [['ipow', Num.int(5)], ['ipow', -4]];
            
                samples.forEach(function (bin) {
                    var a = bin[0], 
                        b = bin[1];
                
                    actual.push("a: " + a.str() + ", b: " + b.str());
                    ops.forEach(function(op) {
                        //console.log(op);
                        actual.push(op+": " + a[op](b).str());
                    });
                
                    comps.forEach(function(comp) {
                        //console.log(comp);
                        actual.push(comp+": " + a[comp](b));
                    });
                
                    unitary.forEach( function(un) {
                        //console.log(un);
                        actual.push(un+": " + a[un]().str() + "; " + b[un]().str());
                    });
                
                    others.forEach( function (other) {
                        var result, str = "", o1str = "";
                
                        if (typeof other[1] !== "undefined") {
                            if (other[1] instanceof Num) {
                                o1str = other[1].str();
                            } else {
                                o1str = other[1]+"";
                            }
                        }
                
                        result = a[other[0]](other[1]);
                        str = "a " + other[0] + " " + o1str +": ";
                        if (result instanceof Num) {
                            actual.push(str + result.str());
                        } else {
                            actual.push(str + result);
                        }
                        str = "b " + other[0] + " " + o1str +": ";
                        result = b[other[0]](other[1]);
                        if (result instanceof Num) {
                            actual.push(str+ result.str());
                        } else {
                            actual.push(str+ result);
                        }
                
                    });
                
                });
            
                emitter.emit("done");
            
            },
        "integers" : function () {
            
                var emitter = new EventWhen();
                var key = 'integers';
            
                emitter.name = key;
            
                var expected = [
                    "zero: 0, one: 1",
                    "a: 10, b: -12",
                    "add: -2",
                    "sub: 22",
                    "mul: -120",
                    "div: -10/12",
                    "max: 10",
                    "mmax: -12",
                    "min: -12",
                    "mmin: 10",
                    "quo: 0",
                    "rem: 10",
                    "gcd: 2",
                    "lcm: -60",
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
                    "neg: -10; 12",
                    "round: 10; -12",
                    "floor: 10; -12",
                    "abs: 10; 12",
                    "ceil: 10; -12",
                    "inv: 1/10; -1/-12",
                    "a ipow 5: 100000",
                    "b ipow 5: -248832",
                    "a ipow -4: 1/10000",
                    "b ipow -4: 1/20736",
                    "a shift 2: 1000",
                    "b shift 2: -1200",
                    "a sign : ",
                    "b sign : -",
                    "a: 123456789123456789123456789, b: 5",
                    "add: 123456789123456789123456794",
                    "sub: 123456789123456789123456784",
                    "mul: 617283945617283945617283945",
                    "div: 24691357824691357824691357 4/5",
                    "max: 123456789123456789123456789",
                    "mmax: 123456789123456789123456789",
                    "min: 5",
                    "mmin: 5",
                    "quo: 24691357824691357824691357",
                    "rem: 4",
                    "gcd: 1",
                    "lcm: 617283945617283945617283945",
                    "mgt: true",
                    "mgte: true",
                    "mlt: false",
                    "mlte: false",
                    "meq: false",
                    "gt: true",
                    "gte: true",
                    "lt: false",
                    "lte: false",
                    "eq: false",
                    "neg: -123456789123456789123456789; -5",
                    "round: 123456789123456789123456789; 5",
                    "floor: 123456789123456789123456789; 5",
                    "abs: 123456789123456789123456789; 5",
                    "ceil: 123456789123456789123456789; 5",
                    "inv: 1/123456789123456789123456789; 1/5",
                    "a ipow 5: 28679718746395774517519299647974067853199588896463036970972834315105461935781603131036162289536454167206060221256216795681720482949",
                    "b ipow 5: 3125",
                    "a ipow -4: 1/232305723727482137666188006551300203692658625799727977970043302090695104949336681913044437155857798251441",
                    "b ipow -4: 1/625",
                    "a shift 2: 12345678912345678912345678900",
                    "b shift 2: 500",
                    "a sign : ",
                    "b sign : "
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
            
                var instance = new Num(4, "int");
                actual.push("zero: " + instance.zero().str() +  ", one: " + instance.unit().str());
                var samples = [ 
                    [new Num(10, "int"), Num.int(-12)],
                    [new Num("123456789123456789123456789", "int"), new Num("5", "int")]
                ];
                
                var ops = ['add', 'sub', 'mul', 'div', 'max', 'mmax', 'min', 'mmin'];
                var comps = ['mgt', 'mgte', 'mlt', 'mlte', 'meq', 'gt', 'gte', 'lt', 'lte', 'eq'];
                var unitary = ['neg', 'round', 'floor', 'abs', 'ceil', 'inv'];
                var others = [['ipow', Num.int(5)], ['ipow', -4]];
                
                others.push(["shift", 2], ["sign"]);
                ops.push("quo", "rem", "gcd", "lcm");
            
                samples.forEach(function (bin) {
                    var a = bin[0], 
                        b = bin[1];
                
                    actual.push("a: " + a.str() + ", b: " + b.str());
                    ops.forEach(function(op) {
                        //console.log(op);
                        actual.push(op+": " + a[op](b).str());
                    });
                
                    comps.forEach(function(comp) {
                        //console.log(comp);
                        actual.push(comp+": " + a[comp](b));
                    });
                
                    unitary.forEach( function(un) {
                        //console.log(un);
                        actual.push(un+": " + a[un]().str() + "; " + b[un]().str());
                    });
                
                    others.forEach( function (other) {
                        var result, str = "", o1str = "";
                
                        if (typeof other[1] !== "undefined") {
                            if (other[1] instanceof Num) {
                                o1str = other[1].str();
                            } else {
                                o1str = other[1]+"";
                            }
                        }
                
                        result = a[other[0]](other[1]);
                        str = "a " + other[0] + " " + o1str +": ";
                        if (result instanceof Num) {
                            actual.push(str + result.str());
                        } else {
                            actual.push(str + result);
                        }
                        str = "b " + other[0] + " " + o1str +": ";
                        result = b[other[0]](other[1]);
                        if (result instanceof Num) {
                            actual.push(str+ result.str());
                        } else {
                            actual.push(str+ result);
                        }
                
                    });
                
                });
            
                emitter.emit("done");
            
            },
        "rationals": function () {
            
                var emitter = new EventWhen();
                var key = 'rationals';
            
                emitter.name = key;
            
                var expected = [
                    "zero: 0, one: 1/1",
                    "a: -23 4/5, b: 2 1/4",
                    "add: -21 11/20",
                    "sub: -25 21/20",
                    "mul: -46 151/20",
                    "div: -476/5",
                    "max: 2 1/4",
                    "mmax: -23 4/5",
                    "min: -23 4/5",
                    "mmin: 2 1/4",
                    "mgt: true",
                    "mgte: true",
                    "mlt: false",
                    "mlte: false",
                    "meq: false",
                    "gt: false",
                    "gte: false",
                    "lt: true",
                    "lte: true",
                    "eq: false",
                    "neg: 23 4/5; -2 1/4",
                    "round: 23; 2",
                    "floor: 23; 2",
                    "abs: 23 4/5; 2 1/4",
                    "ceil: 24; 3",
                    "inv: 5/4; 4/1",
                    "a ipow 5: -23863536599/3125",
                    "b ipow 5: 59049/1024",
                    "a ipow -4: 625/200533921",
                    "b ipow -4: 256/6561",
                    "a: -34233112312312 423452345234523/52323412412341234123412424, b: 5 2/3",
                    "add: -34233112312306 17441137471203863719705331/52323412412341234123412424",
                    "sub: -34233112312317 34882274941984275094176139/52323412412341234123412424",
                    "mul: -171165561561560 3582386507350194454576236887759206915467/156970237237023702370237272",
                    "div: -5373579761025291681864345803961042596433/104646824824682468246824848",
                    "max: 5 2/3",
                    "mmax: -34233112312312 423452345234523/52323412412341234123412424",
                    "min: -34233112312312 423452345234523/52323412412341234123412424",
                    "mmin: 5 2/3",
                    "mgt: true",
                    "mgte: true",
                    "mlt: false",
                    "mlte: false",
                    "meq: false",
                    "gt: false",
                    "gte: false",
                    "lt: true",
                    "lte: true",
                    "eq: false",
                    "neg: 34233112312312 423452345234523/52323412412341234123412424; -5 2/3",
                    "round: 34233112312312; 5",
                    "floor: 34233112312312; 5",
                    "abs: 34233112312312 423452345234523/52323412412341234123412424; 5 2/3",
                    "ceil: 34233112312313; 6",
                    "inv: 52323412412341234123412424/423452345234523; 3/2",
                    "a ipow 5: -18437932650569421958072195775638622422762334715253076404379845115803344165886352297412559421592802843253949368322255500091442294836506246138578122115238096509324962253114154262093337374065909715051/392175356152293629398425111643577904990732398694438465700698385764768525485327427419924590914679354539406274720318281365192474624",
                    "b ipow 5: 1419857/243",
                    "a ipow -4: 7495217495787667615444219989841352977588893131630696803681485003374663160153631942842737496611030962176/10293659052555732953647192450196681032488550896667989833038547055740407837803892449944896700685520062382768467657788604376842285353059204038564714696127865841",
                    "b ipow -4: 81/83521"
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
            
                var instance = new Num(4, "rat");
                actual.push("zero: " + instance.zero().str() +  ", one: " + instance.unit().str());
                var samples = [ 
                    [new Num("-23 4/5", "rat"), Num.rat("2 1/4")],
                    [Num.rat("-34233112312312 423452345234523/52323412412341234123412424"), new Num("5 2/3", "rat")]
                ];
                
                var ops = ['add', 'sub', 'mul', 'div', 'max', 'mmax', 'min', 'mmin'];
                var comps = ['mgt', 'mgte', 'mlt', 'mlte', 'meq', 'gt', 'gte', 'lt', 'lte', 'eq'];
                var unitary = ['neg', 'round', 'floor', 'abs', 'ceil', 'inv'];
                var others = [['ipow', Num.int(5)], ['ipow', -4]];
            
                samples.forEach(function (bin) {
                    var a = bin[0], 
                        b = bin[1];
                
                    actual.push("a: " + a.str() + ", b: " + b.str());
                    ops.forEach(function(op) {
                        //console.log(op);
                        actual.push(op+": " + a[op](b).str());
                    });
                
                    comps.forEach(function(comp) {
                        //console.log(comp);
                        actual.push(comp+": " + a[comp](b));
                    });
                
                    unitary.forEach( function(un) {
                        //console.log(un);
                        actual.push(un+": " + a[un]().str() + "; " + b[un]().str());
                    });
                
                    others.forEach( function (other) {
                        var result, str = "", o1str = "";
                
                        if (typeof other[1] !== "undefined") {
                            if (other[1] instanceof Num) {
                                o1str = other[1].str();
                            } else {
                                o1str = other[1]+"";
                            }
                        }
                
                        result = a[other[0]](other[1]);
                        str = "a " + other[0] + " " + o1str +": ";
                        if (result instanceof Num) {
                            actual.push(str + result.str());
                        } else {
                            actual.push(str + result);
                        }
                        str = "b " + other[0] + " " + o1str +": ";
                        result = b[other[0]](other[1]);
                        if (result instanceof Num) {
                            actual.push(str+ result.str());
                        } else {
                            actual.push(str+ result);
                        }
                
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