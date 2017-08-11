"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var stringify = function (data) {
    return data.toString().trim();
};
exports.stringify = stringify;
var spawnMakensis = function (args) {
    return new Promise(function (resolve, reject) {
        var stdOut = '';
        var stdErr = '';
        var cmd = child_process_1.spawn('makensis', args);
        cmd.stdout.on('data', function (data) {
            stdOut += stringify(data);
        });
        cmd.stderr.on('data', function (data) {
            stdErr += stringify(data);
        });
        cmd.on('close', function (code) {
            if (code === 0) {
                resolve(stdOut);
            }
            else {
                reject(stdErr);
            }
        });
    });
};
exports.spawnMakensis = spawnMakensis;
