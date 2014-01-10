/*global require*/

var Num, test;

Num = require('../index.js');
test = require('tape');

test("float tests" , function (t) {

    // var key = 'float tests';

    var expected = [
        "zero: 0, one: 1",
        "a: 2.3, b: -3",
        "?: a ? b; b ? a, a ? a, b ? a",
        "add: -0.7000000000000002; -0.7000000000000002; 4.6; -6",
        "sub: 5.3; -5.3; 0; 0",
        "mul: -6.8999999999999995; -6.8999999999999995; 5.289999999999999; 9",
        "div: -0.7666666666666666; -1.3043478260869565; 1; 1",
        "max: 2.3; 2.3; 2.3; -3",
        "mmax: -3; -3; 2.3; -3",
        "min: -3; -3; 2.3; -3",
        "mmin: 2.3; 2.3; 2.3; -3",
        "mgt: false; true; false; false",
        "mgte: false; true; true; true",
        "mlt: true; false; false; false",
        "mlte: true; false; true; true",
        "meq: false; false; true; true",
        "gt: true; false; false; false",
        "gte: true; false; true; true",
        "lt: false; true; false; false",
        "lte: false; true; true; true",
        "eq: false; false; true; true",
        "neg: -2.3; 3",
        "round: 2; -3",
        "floor: 2; -3",
        "abs: 2.3; 3",
        "ceil: 3; -3",
        "inv: 0.4347826086956522; -0.3333333333333333",
        "a ipow 5: 64.36342999999998",
        "b ipow 5: -243",
        "a ipow -4: 0.03573457784956459",
        "b ipow -4: 0.012345679012345678",
        "a sign : ",
        "b sign : -"
        ],
        actual = [];

    var float = Num.float;
    actual.push("zero: " + float.zero.str() +  ", one: " + float.unit.str());
    var samples = [ 
        [new Num(2.3, "float"), Num.float(-3)]
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

test("integers",  function (t) {
    
        // var key = 'integers';
    
        var expected = [
            "zero: 0, one: 1",
            "a: 10, b: -12",
            "?: a ? b; b ? a, a ? a, b ? a",
            "add: -2; -2; 20; -24",
            "sub: 22; -22; 0; 0",
            "mul: -120; -120; 100; 144",
            "div: -5/6; -1_1/5; 1; 1",
            "max: 10; 10; 10; -12",
            "mmax: -12; -12; 10; -12",
            "min: -12; -12; 10; -12",
            "mmin: 10; 10; 10; -12",
            "quo: 0; 1; 1; 1",
            "rem: 10; 2; 0; 0",
            "gcd: 2; 2; 10; 12",
            "lcm: -60; 60; 10; -12",
            "mgt: false; true; false; false",
            "mgte: false; true; true; true",
            "mlt: true; false; false; false",
            "mlte: true; false; true; true",
            "meq: false; false; true; true",
            "gt: true; false; false; false",
            "gte: true; false; true; true",
            "lt: false; true; false; false",
            "lte: false; true; true; true",
            "eq: false; false; true; true",
            "neg: -10; 12",
            "round: 10; -12",
            "floor: 10; -12",
            "abs: 10; 12",
            "ceil: 10; -12",
            "inv: 1/10; -1/12",
            "a ipow 5: 100000",
            "b ipow 5: -248832",
            "a ipow -4: 1/10000",
            "b ipow -4: 1/20736",
            "a sign : ",
            "b sign : -",
            "a shift 2: 1000",
            "b shift 2: -1200",
            "a: 123456789123456789123456789, b: 5",
            "?: a ? b; b ? a, a ? a, b ? a",
            "add: 123456789123456789123456794; 123456789123456789123456794; 246913578246913578246913578; 10",
            "sub: 123456789123456789123456784; -123456789123456789123456784; 0; 0",
            "mul: 617283945617283945617283945; 617283945617283945617283945; 15241578780673678546105778281054720515622620750190521; 25",
            "div: 24691357824691357824691357_4/5; 5/123456789123456789123456789; 1; 1",
            "max: 123456789123456789123456789; 123456789123456789123456789; 123456789123456789123456789; 5",
            "mmax: 123456789123456789123456789; 123456789123456789123456789; 123456789123456789123456789; 5",
            "min: 5; 5; 123456789123456789123456789; 5",
            "mmin: 5; 5; 123456789123456789123456789; 5",
            "quo: 24691357824691357824691357; 0; 1; 1",
            "rem: 4; 5; 0; 0",
            "gcd: 1; 1; 123456789123456789123456789; 5",
            "lcm: 617283945617283945617283945; 617283945617283945617283945; 123456789123456789123456789; 5",
            "mgt: true; false; false; false",
            "mgte: true; false; true; true",
            "mlt: false; true; false; false",
            "mlte: false; true; true; true",
            "meq: false; false; true; true",
            "gt: true; false; false; false",
            "gte: true; false; true; true",
            "lt: false; true; false; false",
            "lte: false; true; true; true",
            "eq: false; false; true; true",
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
            "a sign : ",
            "b sign : ",
            "a shift 2: 12345678912345678912345678900",
            "b shift 2: 500"
            ],
            actual = [];
    
        var int = Num.int;
        actual.push("zero: " + int.zero.str() +  ", one: " + int.unit.str());
        var samples = [ 
            [new Num(10, "int"), Num.int(-12)],
            [new Num("123456789123456789123456789", "int"), new Num("5", "int")]
        ];
        
        var ops = ['add', 'sub', 'mul', 'div', 'max', 'mmax', 'min', 'mmin'];
        var comps = ['mgt', 'mgte', 'mlt', 'mlte', 'meq', 'gt', 'gte', 'lt', 'lte', 'eq'];
        var unitary = ['neg', 'round', 'floor', 'abs', 'ceil', 'inv'];
        var others = [['ipow', Num.int(5)], ['ipow', -4], ['sign']];
        var nosim = [];
        var format = "";
        
        others.push(["shift", 2]);
        ops.push("quo", "rem", "gcd", "lcm");
    
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

test("rationals" , function (t) {
    
        // var key = 'rationals';
    
        var expected = [
            "zero: 0, one: 1/1",
            "a: -23_4/5, b: 2_1/4",
            "?: a ? b; b ? a, a ? a, b ? a",
            "add: -21_11/20; -21_11/20; -47_3/5; 4_1/2",
            "sub: -26_1/20; 26_1/20; 0; 0",
            "mul: -53_11/20; -53_11/20; 566_11/25; 5_1/16",
            "div: -10_26/45; -45/476; 1; 1",
            "max: 2_1/4; 2_1/4; -23_4/5; 2_1/4",
            "mmax: -23_4/5; -23_4/5; -23_4/5; 2_1/4",
            "min: -23_4/5; -23_4/5; -23_4/5; 2_1/4",
            "mmin: 2_1/4; 2_1/4; -23_4/5; 2_1/4",
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
            "neg: 23_4/5; -2_1/4",
            "round: -24; 2",
            "floor: -24; 2",
            "abs: 23_4/5; 2_1/4",
            "ceil: -23; 3",
            "inv: -5/119; 4/9",
            "w: 0; 0",
            "n: 119; 9",
            "d: 5; 4",
            "mix: -23_4/5; 2_1/4",
            "reduce: -23_4/5; 2_1/4",
            "sim: -23_4/5; 2_1/4",
            "simplify: -23_4/5; 2_1/4",
            "frac: 4/5; 1/4",
            "a ipow 5: -7636331_2224/3125",
            "b ipow 5: 57_681/1024",
            "a ipow -4: 625/200533921",
            "b ipow -4: 256/6561",
            "a sign : -",
            "b sign : ",
            "a scale 5: -23_20/25",
            "b scale 5: 2_5/20",
            "a imp : -119/5",
            "b imp : 9/4",
            "a: -34233112312312_423452345234523/52323412412341234123412424, b: 5_2/3",
            "?: a ? b; b ? a, a ? a, b ? a",
            "add: -34233112312306_17441137471203863719705331/52323412412341234123412424; -34233112312306_17441137471203863719705331/52323412412341234123412424; -68466224624624_141150781744841/8720568735390205687235404; 11_1/3",
            "sub: -34233112312317_34882274941984275094176139/52323412412341234123412424; 34233112312317_34882274941984275094176139/52323412412341234123412424; 0; 0",
            "mul: -193987636436434_34882274943960386038603913/52323412412341234123412424; -193987636436434_34882274943960386038603913/52323412412341234123412424; 1171905978587367447426785898_29143618721581228223533500083789330819707263174097/304193276274660525031203063573354935712562044172864; 32_1/9",
            "div: -6041137466878_174411374708227566089942603/296499337003266993366003736; -296499337003266993366003736/1791193253675097227288115267987014198811; 1; 1",
            "max: 5_2/3; 5_2/3; -34233112312312_141150781744841/17441137470780411374470808; 5_2/3",
            "mmax: -34233112312312_141150781744841/17441137470780411374470808; -34233112312312_141150781744841/17441137470780411374470808; -34233112312312_141150781744841/17441137470780411374470808; 5_2/3",
            "min: -34233112312312_141150781744841/17441137470780411374470808; -34233112312312_141150781744841/17441137470780411374470808; -34233112312312_141150781744841/17441137470780411374470808; 5_2/3",
            "mmin: 5_2/3; 5_2/3; -34233112312312_141150781744841/17441137470780411374470808; 5_2/3",
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
            "neg: 34233112312312_141150781744841/17441137470780411374470808; -5_2/3",
            "round: -34233112312312; 6",
            "floor: -34233112312313; 5",
            "abs: 34233112312312_141150781744841/17441137470780411374470808; 5_2/3",
            "ceil: -34233112312312; 6",
            "inv: -17441137470780411374470808/597064417891699075762705089329004732937; 3/17",
            "w: 0; 0",
            "n: 1791193253675097227288115267987014198811; 17",
            "d: 52323412412341234123412424; 3",
            "mix: -34233112312312_141150781744841/17441137470780411374470808; 5_2/3",
            "reduce: -34233112312312_141150781744841/17441137470780411374470808; 5_2/3",
            "sim: -34233112312312_141150781744841/17441137470780411374470808; 5_2/3",
            "simplify: -34233112312312_141150781744841/17441137470780411374470808; 5_2/3",
            "frac: 141150781744841/17441137470780411374470808; 2/3",
            "a ipow 5: -47014511139780571582377359825559234057617674731971477385847767793926_1525250224837769284919460092615384308088866363311718136179059984477520150281692414212793240460232331987986860715964434982277289/1613890354536187775302160953265752695435112751828964879426742328250076236565133446172529180718845080409079319836700746358816768",
            "b ipow 5: 5843_8/243",
            "a ipow -4: 92533549330711945869681728269646333056653001625070330909647963004625471113007801763490586377913962496/127082210525379419180829536422181247314673467860098639914056136490622318985233240122776502477599013115836647748861587708356077596951348198006971786371948961",
            "b ipow -4: 81/83521",
            "a sign : -",
            "b sign : ",
            "a scale 5: -34233112312312_705753908724205/87205687353902056872354040",
            "b scale 5: 5_10/15",
            "a imp : -1791193253675097227288115267987014198811/52323412412341234123412424",
            "b imp : 17/3"
            ],
            actual = [];
    
        var rat = Num.rat;
        actual.push("zero: " + rat.zero.str() +  ", one: " + rat.unit.str());
        var samples = [ 
            [new Num("-23 4/5", "rat"), Num.rat("2 1/4")],
            [Num.rat("-34233112312312 423452345234523/52323412412341234123412424"), new Num("5 2/3", "rat")]
        ];
        
        var ops = ['add', 'sub', 'mul', 'div', 'max', 'mmax', 'min', 'mmin'];
        var comps = ['mgt', 'mgte', 'mlt', 'mlte', 'meq', 'gt', 'gte', 'lt', 'lte', 'eq'];
        var unitary = ['neg', 'round', 'floor', 'abs', 'ceil', 'inv'];
        var others = [['ipow', Num.int(5)], ['ipow', -4], ['sign']];
        var nosim = [];
        var format = "";
        
        unitary.push("w", "n", "d", "mix", "reduce", "sim", "simplify", "frac");
        
        nosim.push(["scale", 5], ["imp"]);
        
        format = "simplify";
    
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

test("scientific" , function (t) {
    
        // var key = 'scientific';
    
        var expected = [
            "zero: 0, one: 1",
            "a: -1.45E34, b: 4.532312342345234523E12",
            "?: a ? b; b ? a, a ? a, b ? a",
            "add: -1.450E34; -1.450E34; -2.90E34; 9.064624684690469046E12",
            "sub: -1.450E34; 1.450E34; 0; 0",
            "mul: -6.572E46; -6.572E46; 2.103E68; 2.0541855168574946343E24",
            "div: -3.199E21; -3.126E-22; 1.000; 1.0000000000000000000",
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
            "inv: -6.897E-35; 2.2063792705922653079E-13",
            "a ipow 5: -6.410E170",
            "b ipow 5: 1.9124899304072916416E60",
            "a ipow -4: 2.262E-137",
            "b ipow -4: 2.3698489964755081534E-49",
            "a sign : -",
            "b sign : ",
            "a: 1.2341234E-30:50, b: 2",
            "?: a ? b; b ? a, a ? a, b ? a",
            "add: 2.0000000000000000000000000000012341234:50; 2.0000000000000000000000000000012341234:50; 2.4682468E-30:50; 4",
            "sub: -1.9999999999999999999999999999987658766:50; 1.9999999999999999999999999999987658766:50; 0; 0",
            "mul: 2.4682468E-30:50; 2.4682468E-30:50; 1.52306056642756E-60:50; 4",
            "div: 6.17061700000000000000000000000000000000000000000000E-31; 1.62058348460129675849270826564021069529999998379417E30; 1.00000000000000000000000000000000000000000000000000; 1.00000000000000000000000000000000000000000000000000",
            "max: 2; 2; 1.2341234E-30:50; 2",
            "mmax: 2; 2; 1.2341234E-30:50; 2",
            "min: 1.2341234E-30:50; 1.2341234E-30:50; 1.2341234E-30:50; 2",
            "mmin: 1.2341234E-30:50; 1.2341234E-30:50; 1.2341234E-30:50; 2",
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
            "neg: -1.2341234E-30:50; -2",
            "round: 1.2341239:80; 7",
            "floor: 1.2341234E-30:50; 2",
            "abs: 1.2341234E-30:50; 2",
            "ceil: 1.2341235E-30:50; 3",
            "inv: 8.10291742300648379246354132820105347649999991897083E29; 5.00000000000000000000000000000000000000000000000000E-1",
            "a ipow 5: 2.86281269807873706507238858292251424E-150:50",
            "b ipow 5: 3.2:50",
            "a ipow -4: 4.31087720418535539870480940138687709429732542850646E119",
            "b ipow -4: 6.25000000000000000000000000000000000000000000000000E-1",
            "a sign : ",
            "b sign : "
            ],
            actual = [];
    
        var sci = Num.sci;
        actual.push("zero: " + sci.zero.str() +  ", one: " + sci.unit.str());
        var samples = [ 
            [new Num("-1.45E34", "sci"), Num.sci("4.532312342345234523E12")],
            [new Num("1.2341234E-30:50", "sci"), new Num("2.:50", "sci")]
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

test("complex" , function (t) {
    
        // var key = 'Complex';
    
        var expected = [
            "zero: 0, one: 1",
            "a: 5+10i, b: -8-43i",
            "?: a ? b; b ? a, a ? a, b ? a",
            "add: -3-33i; -3-33i; 10+20i; -16-86i",
            "sub: 13+53i; -13-53i; 0; 0",
            "mul: 390-295i; 390-295i; -75+100i; -1785+688i",
            "div: -470/1913+135/1913i; -3_19/25-1_2/25i; 1; 1",
            "neg: -5-10i; 8+43i",
            "inv: 1/25-2/25i; -8/1913+43/1913i",
            "abssq: 125; 1913",
            "re: 5; -8",
            "im: 10; -43",
            "a ipow 5: 128125-118750i",
            "b ipow 5: -127317928-97004603i",
            "a ipow -4: -7/390625+24/390625i",
            "b ipow -4: 2712881/13392445265761+2456160/13392445265761i"
            ],
            actual = [];
    
        var com = Num.com, int = Num.int;
        actual.push("zero: " + com.zero.str() +  ", one: " + com.unit.str());
        var samples = [ 
            [com({re : int(5), im : int(10)}), com({re:int(-8), im : int(-43)})]
        ];
        
        var ops = ['add', 'sub', 'mul', 'div', 'max', 'mmax', 'min', 'mmin'];
        var comps = ['mgt', 'mgte', 'mlt', 'mlte', 'meq', 'gt', 'gte', 'lt', 'lte', 'eq'];
        var unitary = ['neg', 'round', 'floor', 'abs', 'ceil', 'inv'];
        var others = [['ipow', Num.int(5)], ['ipow', -4], ['sign']];
        var nosim = [];
        var format = "";
        
        ops = ['add', 'sub', 'mul', 'div'];
        comps = [];
        unitary = ['neg', 'inv', 'abssq', 're', 'im'];
        others.pop();
    
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
    
        t.equal( Num.rat("1/7").str("dec"), "0._142857", "purely repeating fraction, no limit");
    
        t.equal( Num.rat("1/7").str("dec:3"), "0.142", "purely repeating fraction, not enough digits to display");
    
        t.equal( Num.rat("1 1/7").str("dec"), "1._142857", "purely repeating fraction with integer");
    
        t.equal(Num("2").rat().add(Num("3").rat()).str(), "5", "2+3 = 5, rationally");
    
        var x = Num.sci("1.5666E0:30");
        t.equal(x.mul(x).sub(Num.int(2)).str(), "4.5423556E-1:29");
        t.equal(x.sub(Num.int(2)).str(), "-4.334E-1:29");
        t.equal(x.sub(Num.sci("1.5E0:30")).str(), "6.66E-2:28");
        t.equal(x.sub(Num.sci("1.566:30")).str(), "6E-4:26");
    
        t.equal(Num.sci("1.566E0:30").str("level:3"), "1.566");
    
        t.end();
    });

test("parsing", function (t) {
        var p = function (str) {
            return Num(str).str();
        };
        // integer
        t.equal(p("0"), "0", "zero");
        t.equal(p("1"), "1", "one");
        t.equal(p("123456789123456789123456789"), "123456789123456789123456789", "positive integer");
        t.equal(p("-213"), "-213", "negative integer");
    
        // rational
        t.equal(p("1/7"), "1/7", "fraction");
        t.equal(p("-3_1/7"), "-3_1/7", "mixed fraction");
        t.equal(Num("534/2").mix().str(), "267", "improper fraction");
        t.equal(p("5.3_2"), "5_29/90", "repeating decimal");
    
        // sci
        t.equal(p("1.34E5"), "1.34E5", "scientific");
        t.equal(p("1.346E5:2"), "1.35E5", "scientific precision");
        t.equal(p("-1.346E5:2"), "-1.35E5", "negative scientific precision");
    
        //complex
        t.equal(p("1+i"), "1+i", "complex integral");
        t.equal(p("1-i"), "1-i", "complex integral negative");
        t.equal(p("-i"), "(!-i)", "failure to parse imag with no real");
    
        t.end();
    
    });