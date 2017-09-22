"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var os_1 = require("os");
var mapArguments = function (args, options) {
    var p = {
        cmd: 'makensis',
        args: args,
        opts: options
    };
    if (os_1.platform() !== 'win32' && options.wine === true) {
        p.cmd = 'wine';
        p.args.unshift('makensis');
    }
    if (typeof options.cwd !== 'undefined' && options.cwd !== '') {
        p.opts.cwd = options.cwd;
    }
    if (typeof options.detached !== 'undefined') {
        p.opts.detached = options.detached;
    }
    if (typeof options.shell !== 'undefined' && options.shell !== '') {
        p.opts.shell = options.shell;
    }
    // return unless compile command
    if (args.length > 1) {
        return p;
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
    if (options.nocd === true || options.noCD === true) {
        p.args.push('-NOCD');
    }
    if (options.noconfig === true || options.noConfig === true) {
        p.args.push('-NOCONFIG');
    }
    if (options.pause === true) {
        p.args.push('-PAUSE');
    }
    if (options.strict === true || options.wx === true) {
        p.args.push('-WX');
    }
    if ((typeof options.inputcharset !== 'undefined' && options.inputcharset !== '') || (typeof options.inputCharset !== 'undefined' && options.inputCharset !== '')) {
        p.args.push('-INPUTCHARSET', options.inputcharset);
    }
    if ((typeof options.outputcharset !== 'undefined' && options.outputcharset !== '') || (typeof options.outputCharset !== 'undefined' && options.outputCharset !== '')) {
        p.args.push('-OUTPUTCHARSET', options.outputcharset);
    }
    if (options.ppo === true || options.PPO === true) {
        p.args.push('-PPO');
    }
    if (options.safeppo === true || options.safePPO === true) {
        p.args.push('-SAFEPPO');
    }
    if (Number.isInteger(options.verbose) && options.verbose >= 0 && options.verbose <= 4) {
        p.args.push('-V' + options.verbose);
    }
    return p;
};
exports.mapArguments = mapArguments;
var stringify = function (data) {
    return data.toString().trim();
};
var spawnMakensis = function (cmd, args, opts) {
    return new Promise(function (resolve, reject) {
        var stdOut = '';
        var stdErr = '';
        var child = child_process_1.spawn(cmd, args, opts);
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
var spawnMakensisSync = function (cmd, args, opts) {
    var child = child_process_1.spawnSync(cmd, args, opts);
    var output = {
        'status': child.status,
        'stdout': stringify(child.stdout),
        'stderr': stringify(child.stderr)
    };
    return output;
};
exports.spawnMakensisSync = spawnMakensisSync;
