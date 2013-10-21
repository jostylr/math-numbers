# Project page

Time for live examples in a browser. This will put the pages into ghpages directory which locally I have setup as ignored. 


## Files

* [ghpages/index.html](#index "save: *boiler")

## Index

This is the main page

[title]()

    Math-Numbers

[body]()

    <h1>Math-Numbers</h1>

    <p>Welcome to the Math-Numbers page!</p>

    <p>Here is 300! <span id="300"></span></p>

[scripts]()

    <script type="text/javascript" src="index.js"></script>
    <script type="text/javascript">
    document.addEventListener("DOMContentLoaded", function () {
        var i, n =300;
        var fact = Num.int.unit;
        for (i = 1; i <= n; i += 1) {
            fact = fact.mul(Num.int(i));
        }

        document.getElementById("300").innerHTML = fact.str();
    })
    </script>


## Boiler


    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>_"*:title"</title>
            _"*:css? "
        </head>
        <body>
        _"*:body"
        _"*:scripts? "
        </body>
    </html>