module.exports = function (Folder, args) {


    if (args.file.length === 0) {
        args.file = ["project.md"];
    }

    require('litpro-jshint')(Folder, args);


    var pug = require('pug');
    var md = require('markdown-it')({
        html:true,
        linkify:true
    });
    var cheerio = require('cheerio');

    if (!Folder.prototype.local) {
        Folder.prototype.local = {};
    }
    Folder.prototype.local.md = md; 

    Folder.sync("pug" , function (code, args) {
        options = args.join(",").trim();
        if (options) {
            options = JSON.parse(options);
        } else {
            options = {'pretty':true};
        }
        return pug.render(code, options); 
    });

    Folder.sync( "md", function (code, args) {
        return  md.render(code);
    });


    Folder.sync( "replace" , function(code, args) {
        var selector, replacement;
        var n = args.length;
        var $ = cheerio.load(code);
        for (i = 0; i < n; i += 2) {
            selector = args[i];
            replacement = args[i+1];
            $(selector).html(replacement);
        }
        return $.html();
    });
    

    var postcss      = require('postcss');
    
    Folder.commands.postcss = function (input, args, name) {
        var doc = this;
        var pc = doc.plugins.postcss; 
        var cmds = [];
        if ( (typeof input !== "string") || (input === '') ) {
            doc.gcd.emit("text ready:" + name, input);
        }
        args.forEach(function (el) {
            if (typeof pc[el] === "function" ) {
                cmds.push(pc[el]);
            }
        });
        postcss(cmds).process(input).then(function (result) {
            result.warnings().forEach(function (warn) {
                //doc.log(warn.toString());
            });
            doc.gcd.emit("text ready:" + name, result.css);
        });
    };

     Folder.plugins.postcss = {
         autoprefixer : require('autoprefixer')
     };
    
     Folder.sync("ife", function (code, args) {
         var i, n = args.length;
     
         var internal = [];
         var external = [];
         var arg,ret; 
     
         for (i=0; i <n; i +=1 ) {
             arg = args[i] || "";
             arg = arg.split("=").map(function (el) {
                 return el.trim();
             });
             if (arg[0] === "return") {
                 ret = arg[1] || "";
             } else if (arg.length === 1) {
                 internal.push(arg[0]);
                 external.push(arg[0]);
             } else if (arg.length === 2) {
                 internal.push(arg[0]);
                 external.push(arg[1]);
             }
     
         }
     
         var start = "(function ( "+internal.join(", ")+" ) {";
         var end = "\n} ( "+external.join(",")+" ) )";
     
         if (typeof ret === "string") {
             return start + code + "\n return "+ret+";" + end;
         } else if (code.search(/^\s*function/) === -1) {
             return start + code + end;
         } else {
             return start + "\n return "+ code +";"+ end;
         }
     });

};
