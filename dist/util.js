"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var parseArgs = function (options) {
    var args = [];
    if (Number.isInteger(options.verbose) && options.verbose >= 0 && options.verbose <= 4) {
        args.push('-V' + options.verbose);
    }
    if (options.pause === true) {
        args.push('-PAUSE');
    }
    if (options.nocd === true) {
        args.push('-NOCD');
    }
    if (options.noconfig === true) {
        args.push('-NOCONFIG');
    }
    if (options.strict === true) {
        args.push('-WX');
    }
    if (typeof options.define !== 'undefined') {
        Object.keys(options.define).forEach(function (key) {
            args.push("-D" + key + "=" + options.define[key]);
        });
    }
    if (typeof options.execute !== 'undefined') {
        options.execute.forEach(function (key) {
            args.push("-X" + key);
        });
    }
    return args;
};
exports.parseArgs = parseArgs;
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
            var output = {
                'status': code,
                'stdout': stdOut,
                'stderr': stdErr
            };
            if (code === 0) {
                resolve(output);
            }
            else {
                reject(output);
            }
        });
    });
};
exports.spawnMakensis = spawnMakensis;
var spawnMakensisSync = function (args) {
    var cmd = child_process_1.spawnSync('makensis', args);
    var output = {
        'status': cmd.status,
        'stdout': stringify(cmd.stdout),
        'stderr': stringify(cmd.stderr)
    };
    return output;
};
exports.spawnMakensisSync = spawnMakensisSync;
