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
    content = "define(['jquery'], function (jQuery) {\n"
                + content
                + "\n});";

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