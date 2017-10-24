#!/usr/bin/env node
'use strict';

var inquirer = require('inquirer');
var lib = require('../lib/lib.js');

console.log('Insert project params!');

var p = inquirer.prompt(lib.questions);
p.then(function (answers) {
    lib.getFiles(answers);
});