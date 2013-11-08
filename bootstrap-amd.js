#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var inputDir = process.argv[2];
var exists = fs.existsSync || path.existsSync;

function mkDir(dir) {
    if (!exists(dir)) {
        //511 is decimal for 0777 octal
        fs.mkdirSync(dir, 511);
    }
}

function convert(content)
{
    content = "\n\
(function (factory) {\n\
    'use strict';\n\
    if (typeof define === 'function' && define.amd) {\n\
        // Register as an anonymous AMD module:\n\
        define([\n\
            'jquery'\n\
        ], factory);\n\
    } else {\n\
        // Browser globals:\n\
        factory(\n\
            window.jQuery\n\
        );\n\
    }\n\
}(\n\
" + content;
    content = content.replace(/\(.*jQuery\);\s$/m, '));')
    content = content.replace(/\+function/, 'function');
    return content;
}

mkDir(inputDir + '/amd');

glob("js/*.js", {cwd: inputDir}, function (err, files) {
    files.forEach(function (file) {
        file = inputDir + '/' + file;

        if (fs.statSync(file).isFile())
        {
            var content = convert(fs.readFileSync(file, 'utf8'));
            fs.writeFileSync(inputDir + '/amd/' + path.basename(file), content);
        }
    })
})