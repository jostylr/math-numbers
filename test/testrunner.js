/*global require*/

var Num, test;

Num = require('../index.js');
test = require('tape');

test("scientific" , function (t) {

    // var key = 'scientific';

    var expected = [
        "zero: 0.E-Infinity:oo, one: 1",
        "a: -1.45E34, b: 4.532312342345234523E12",
        "?: a ? b; b ? a, a ? a, b ? a",
        "add: -1.45E34; -1.45E34; -2.90E34; 9.064624684690469046E12",
        "sub: -1.45E34; 1.45E34; 0.E-Infinity:2; 0.E-Infinity:18",
        "mul: -6.57E46; -6.57E46; 2.10E68; 2.054185516857494634E24",
        "div: -3.20E21; -3.13E-22; 1.00E0; 1.000000000000000000E0",
        "max: 4.532312342345234523E12; 4.532312342345234523E12; -1.45E34; 4.532312342345234523E12",
        "mmax: -1.45E34; -1.45E34; -1.45E34; 4.532312342345234523E12",
        "min: -1.45E34; -1.45E34; -1.45E34; 4.532312342345234523E12",
        "mmin: 4.532312342345234523E12; 4.532312342345234523E12; -1.45E34; 4.532312342345234523E12",
        "mgt: true; false; false; false",
        "mgte: true; false; true; true",
        "mlt: false; true; false; false",
        "mlte: false; true; true; true",
        "meq: false; false; true; true",
        "gt: false; true; false; false",
        "gte: false; true; true; true",
        "lt: true; false; false; false",
        "lte: true; false; true; true",
        "eq: false; false; true; true",
        "neg: 1.45E34; -4.532312342345234523E12",
        "round: -1.41E34; 4.532312342345234528E12",
        "floor: -1.46E34; 4.532312342345234523E12",
        "abs: 1.45E34; 4.532312342345234523E12",
        "ceil: -1.45E34; 4.532312342345234524E12",
        "inv: -6.90E-35; 2.206379270592265308E-13",
        "a ipow 5: -6.41E170",
        "b ipow 5: 1.912489930407291642E60",
        "a ipow -4: 2.26E-137",
        "b ipow -4: 2.369848996475508153E-49",
        "a sign : -",
        "b sign : ",
        "a: 1.2341234E-30, b: 2",
        "?: a ? b; b ? a, a ? a, b ? a",
        "add: 1.2E0; 1.2E0; 2.4682468E-30; 4",
        "sub: 1.2E0; -1.2E0; 0.E-Infinity:7; 0.E-Infinity:1",
        "mul: 2.5E-30; 2.5E-30; 1.5230606E-60; 4",
        "div: 6.2E-31; 1.6E30; 1.0000000E0; 1.0E0",
        "max: 2; 2; 1.2341234E-30; 2",
        "mmax: 2; 2; 1.2341234E-30; 2",
        "min: 1.2341234E-30; 1.2341234E-30; 1.2341234E-30; 2",
        "mmin: 1.2341234E-30; 1.2341234E-30; 1.2341234E-30; 2",
        "mgt: false; true; false; false",
        "mgte: false; true; true; true",
        "mlt: true; false; false; false",
        "mlte: true; false; true; true",
        "meq: false; false; true; true",
        "gt: false; true; false; false",
        "gte: false; true; true; true",
        "lt: true; false; false; false",
        "lte: true; false; true; true",
        "eq: false; false; true; true",
        "neg: -1.2341234E-30; -2",
        "round: 1.2341239E0:37; 7",
        "floor: 1.2341234E-30; 2",
        "abs: 1.2341234E-30; 2",
        "ceil: 1.2341235E-30; 3",
        "inv: 8.1029174E29; 5.0E-1",
        "a ipow 5: 2.8628127E-150",
        "b ipow 5: 3.2E0",
        "a ipow -4: 4.3108772E119",
        "b ipow -4: 6.3E-1",
        "a sign : ",
        "b sign : "
        ],
        actual = [];

    var sci = Num.sci;
    actual.push("zero: " + sci.zero.str() +  ", one: " + sci.unit.str());
    var samples = [ 
        [new Num("-1.45E34", "sci"), Num.sci("4.532312342345234523E12")],
        [new Num("1.2341234E-30", "sci"), new Num("2", "sci")]
    ];
    
    var ops = ['add', 'sub', 'mul', 'div', 'max', 'mmax', 'min', 'mmin'];
    var comps = ['mgt', 'mgte', 'mlt', 'mlte', 'meq', 'gt', 'gte', 'lt', 'lte', 'eq'];
    var unitary = ['neg', 'round', 'floor', 'abs', 'ceil', 'inv'];
    var others = [['ipow', Num.int(5)], ['ipow', -4], ['sign']];
    var nosim = [];
    var format = "";

    samples.forEach(function (bin) {
        var a = bin[0], 
            b = bin[1];
    
        actual.push("a: " + a.str() + ", b: " + b.str());
    
        actual.push("?: a ? b; b ? a, a ? a, b ? a");        
        ops.forEach(function(op) {
            //console.log(op);
            actual.push( op+": " +
                a[op](b).simplify().str(format) + "; " +
                b[op](a).simplify().str(format) + "; " +
                a[op](a).simplify().str(format) + "; " +
                b[op](b).simplify().str(format) 
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
            actual.push(un+": " + a[un]().simplify().str() + "; " + b[un]().simplify().str());
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
                actual.push(str + result.simplify().str());
            } else {
                actual.push(str + result);
            }
            str = "b " + op + " " + argstr +": ";
            result = b[op].apply(b, args);
            if (result instanceof Num) {
                actual.push(str+ result.simplify().str());
            } else {
                actual.push(str+ result);
            }
    
        });
    
        nosim.forEach( function (other) {
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

    var i, n = actual.length;

    for (i =0; i <n; i+=1 ) {
        t.equal(actual[i], expected[i]);
    }

    t.end();
});

test("ad hoc" , function (t) {
    
        t.equal( Num.rat("1/7").str("dec"), "0. 142857", "purely repeating fraction, no limit");
    
        t.equal( Num.rat("1/7").str("dec:3"), "0.142", "purely repeating fraction, not enough digits to display");
    
        t.equal( Num.rat("1 1/7").str("dec"), "1. 142857", "purely repeating fraction with integer");
    
        t.equal(Num.rat("2").add(Num.rat("3")).str(), "5", "2+3 = 5, rationally");
    
        var x = Num.sci("1.5666E0:30");
        t.equal(x.mul(x).sub(Num.int(2)).str(), "4.5423556E-1:29");
        t.equal(x.sub(Num.int(2)).str(), "-4.334E-1:29");
        t.equal(x.sub(Num.sci("1.5E0:30")).str(), "6.66E-2:28");
        t.equal(x.sub(Num.sci("1.566:30")).str(), "6E-4:26");
    
        t.equal(Num.sci("1.566E0:30").str("level:3"), "1.56");
    
        t.end();
    });