"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var os_1 = require("os");
var getArguments = function (options) {
    var p = {
        cmd: 'makensis',
        args: []
    };
    if (os_1.platform() !== 'win32' && options.wine === true) {
        p.cmd = 'wine';
        p.args.unshift('makensis');
    }
    if (typeof options.define !== 'undefined') {
        Object.keys(options.define).forEach(function (key) {
            p.args.push("-D" + key + "=" + options.define[key]);
        });
    }
    if (typeof options.execute !== 'undefined') {
        options.execute.forEach(function (key) {
            p.args.push("-X" + key);
        });
    }
    if (options.nocd === true) {
        p.args.push('-NOCD');
    }
    if (options.noconfig === true) {
        p.args.push('-NOCONFIG');
    }
    if (options.pause === true) {
        p.args.push('-PAUSE');
    }
    if (options.strict === true) {
        p.args.push('-WX');
    }
    if (typeof options.inputcharset !== 'undefined' && options.inputcharset !== '') {
        p.args.push('-INPUTCHARSET', options.inputcharset);
    }
    if (typeof options.outputcharset !== 'undefined' && options.outputcharset !== '') {
        p.args.push('-OUTPUTCHARSET', options.outputcharset);
    }
    if (options.ppo === true) {
        p.args.push('-PPO');
    }
    if (options.safeppo === true) {
        p.args.push('-SAFEPPO');
    }
    if (Number.isInteger(options.verbose) && options.verbose >= 0 && options.verbose <= 4) {
        p.args.push('-V' + options.verbose);
    }
    return p;
};
exports.getArguments = getArguments;
var stringify = function (data) {
    return data.toString().trim();
};
var spawnMakensis = function (cmd, args) {
    return new Promise(function (resolve, reject) {
        var stdOut = '';
        var stdErr = '';
        var child = child_process_1.spawn(cmd, args);
        child.stdout.on('data', function (data) {
            stdOut += stringify(data);
        });
        child.stderr.on('data', function (data) {
            stdErr += stringify(data);
        });
        child.on('close', function (code) {
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
var spawnMakensisSync = function (cmd, args) {
    var child = child_process_1.spawnSync(cmd, args);
    var output = {
        'status': child.status,
        'stdout': stringify(child.stdout),
        'stderr': stringify(child.stderr)
    };
    return output;
};
exports.spawnMakensisSync = spawnMakensisSync;
var runWithWine = function (args, options) {
    var p = {
        cmd: 'makensis',
        args: args
    };
    if (os_1.platform() !== 'win32' && options.wine === true) {
        p.cmd = 'wine';
        p.args.unshift('makensis');
    }
    return p;
};
exports.runWithWine = runWithWine;
