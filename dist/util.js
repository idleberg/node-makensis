"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var os_1 = require("os");
var mapArguments = function (args, options) {
    var cmd = (typeof options.pathToMakensis !== 'undefined' && options.pathToMakensis !== '') ? options.pathToMakensis : 'makensis';
    var p = {
        cmd: cmd,
        args: args,
        opts: options
    };
    if (os_1.platform() !== 'win32' && options.wine === true) {
        p.cmd = 'wine';
        p.args.unshift(cmd);
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
    if (args.length > 1 || args[0] === '-CMDHELP') {
        return p;
    }
    if (typeof options.define !== 'undefined') {
        Object.keys(options.define).forEach(function (key) {
            p.args.push("-D" + key + "=" + options.define[key]);
        });
    }
    if (typeof options.preExecute !== 'undefined') {
        if (typeof options.preExecute === 'string') {
            p.args.push("-X" + options.preExecute);
        }
        else {
            options.preExecute.forEach(function (key) {
                p.args.push("-X" + key);
            });
        }
        // Temporary Fallback
    }
    else if (typeof options.execute !== 'undefined') {
        if (typeof options.execute === 'string') {
            p.args.push("-X" + options.execute);
        }
        else {
            options.execute.forEach(function (key) {
                p.args.push("-X" + key);
            });
        }
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
var isInteger = function (x) {
    return x % 2 === 0;
};
var hasWarnings = function (line) {
    var match = line.match(/(\d+) warnings?\:/);
    if (match !== null) {
        return parseInt(match[1]);
    }
    return 0;
};
var formatOutput = function (stream, args, opts) {
    if (args[0] === '-CMDHELP') {
        // CMDHELP writes to stderr by default, let's fix this
        _a = [stream.stderr, ''], stream.stdout = _a[0], stream.stderr = _a[1];
    }
    if (opts.json === true) {
        if (args.indexOf('-CMDHELP') !== -1) {
            if (args.length > 1) {
                stream.stdout = objectify(stream.stdout, 'help');
            }
            else {
                stream.stdout = objectifyHelp(stream.stdout);
            }
        }
        else if (args.indexOf('-HDRINFO') !== -1) {
            stream.stdout = objectifyFlags(stream.stdout);
        }
        else if (args.indexOf('-VERSION') !== -1) {
            stream.stdout = objectify(stream.stdout, 'version');
        }
    }
    return stream;
    var _a;
};
var objectify = function (input, key) {
    if (key === void 0) { key = null; }
    var output = {};
    if (key === 'version' && input.startsWith('v')) {
        input = input.substr(1);
    }
    if (key === null) {
        output = input;
    }
    else {
        output[key] = input;
    }
    return output;
};
exports.objectify = objectify;
var objectifyHelp = function (input) {
    var lines = input.split('\n');
    lines.sort();
    var output = {};
    lines.forEach(function (line) {
        var command = line.substr(0, line.indexOf(' '));
        var usage = line.substr(line.indexOf(' ') + 1);
        // Workaround
        if (['!AddIncludeDir', '!AddPluginDir'].indexOf(command) !== -1) {
            command = command.toLowerCase();
        }
        if (command)
            output[command] = usage;
    });
    return output;
};
var objectifyFlags = function (input) {
    var lines = input.split('\n');
    var filteredLines = lines.filter(function (line) {
        if (line !== '') {
            return line;
        }
    });
    var output = {};
    var tableSizes = {};
    var tableSymbols = {};
    var symbols;
    // Split sizes
    filteredLines.forEach(function (line) {
        var obj = {};
        if (line.startsWith('Size of ')) {
            var pair = line.split(' is ');
            pair[0] = pair[0].replace('Size of ', '');
            pair[0] = pair[0].replace(' ', '_');
            pair[1] = pair[1].slice(0, -1);
            tableSizes[pair[0]] = pair[1];
        }
        else if (line.startsWith('Defined symbols: ')) {
            symbols = line.replace('Defined symbols: ', '').split(',');
        }
    });
    var objSizes = {};
    output['sizes'] = tableSizes;
    // Split symbols
    symbols.forEach(function (symbol) {
        var pair = symbol.split('=');
        var obj = {};
        if (pair.length > 1 && pair[0] !== 'undefined') {
            if (isInteger(pair[1]) === true) {
                pair[1] = parseInt(pair[1], 10);
            }
            tableSymbols[pair[0]] = pair[1];
        }
        else {
            tableSymbols[symbol] = true;
        }
    });
    output['defined_symbols'] = tableSymbols;
    return output;
};
exports.objectifyFlags = objectifyFlags;
var spawnMakensis = function (cmd, args, opts) {
    return new Promise(function (resolve, reject) {
        var stream = {
            stdout: '',
            stderr: ''
        };
        var warnings = 0;
        var child = child_process_1.spawn(cmd, args, opts);
        child.stdout.on('data', function (line) {
            line = stringify(line);
            warnings = hasWarnings(line);
            stream.stdout += line;
        });
        child.stderr.on('data', function (line) {
            stream.stderr += stringify(line);
        });
        child.on('close', function (code) {
            stream = formatOutput(stream, args, opts);
            var output = {
                'status': code,
                'stdout': stream.stdout,
                'stderr': stream.stderr,
                'warnings': warnings
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
    child.stdout = stringify(child.stdout);
    child.stderr = stringify(child.stderr);
    var warnings = hasWarnings(child.stdout);
    child = formatOutput(child, args, opts);
    var output = {
        'status': child.status,
        'stdout': child.stdout,
        'stderr': child.stderr,
        'warnings': warnings
    };
    return output;
};
exports.spawnMakensisSync = spawnMakensisSync;
