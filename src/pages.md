# Project page

Time for live examples in a browser. This will put the pages into ghpages directory which locally I have setup as ignored. 


## Files

* [index.html](#boiler "save: | compile index")

## Index

This is the main page

[title]()

    Math-Numbers

[body]()

    <h1>Math-Numbers</h1>

    <p>Welcome to the Math-Numbers page!</p>

    <p>Here is 300!: </p>
    <p id="300"></p>

[scripts]()
    
    <script type="text/javascript">
    document.addEventListener("DOMContentLoaded", function () {
        var i, n =300;
        var fact = Num.int.unit;
        for (i = 1; i <= n; i += 1) {
            fact = fact.mul(Num.int(i));
        }

        document.getElementById("300").innerHTML = _"factorial string";
        
    })
    </script>

[css]()

## factorial string

This gets and formats the factorial string.

        fact.str().
            split('').
            reverse().
            map( function (el, ind) {
                if ( (ind % 30) === 0)  {
                    return el + '<br/>';
                } else {
                    return el;
                }
            }).
            reverse().
            join('');

## Factorial

The idea is to have a factorial computer -- n is the main parameter. There can be some output display controls. The number of digits of each kind can also be displayed. There can be an array of numbers to do multiple factorials and an analysis on each. 

[title]()

    Factorial

[body]()

    <h1>Factorial Exploration</h1>

    _":questions |md"

    _":inputs"

    _":output"

[questions]()

    So math-numbers can handle factorials of extraordinary length. What might we ask of large factorials?

    1. What is the most frequent digit? 
    2. Are the digits consistent with random creation? 
    3. As it turns out, zeros are far more numerous. If we get rid of the zeros at the end of the number, does that make all the digits uniform? 

[inputs]()

    <form>


[output]()

[scripts]()

[css]()



## Boiler


    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>\_":title"</title>
            \_":css "
        </head>
        <body>
        \_":body"
        <script type="text/javascript" src="index.js"></script>
        \_":scripts "
        </body>
    </html>

