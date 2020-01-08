"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var charsets_1 = require("./charsets");
var child_process_1 = require("child_process");
var os_1 = require("os");
var splitCommands = function (data) {
    var args = [];
    if (typeof data !== 'undefined') {
        if (typeof data === 'string') {
            if (data.trim().includes('\n')) {
                var lines = data.trim().split('\n');
                lines.forEach(function (line) {
                    if (line.trim().length) {
                        args.push("-X" + line);
                    }
                });
            }
            else {
                args.push("-X" + data);
            }
        }
        else {
            data.forEach(function (key) {
                if (key.trim().length) {
                    args.push("-X" + key);
                }
            });
        }
    }
    return args;
};
exports.splitCommands = splitCommands;
var mapArguments = function (args, options) {
    var pathToMakensis = (typeof options.pathToMakensis !== 'undefined' && options.pathToMakensis !== '') ? options.pathToMakensis : 'makensis';
    var cmd;
    if (os_1.platform() !== 'win32' && options.wine === true) {
        cmd = 'wine';
        args.unshift(pathToMakensis);
    }
    else {
        cmd = pathToMakensis;
    }
    // return unless compile command
    if (args.length > 1 || args.includes('-CMDHELP')) {
        return [cmd, args, { json: options.json, wine: options.wine }];
    }
    if (typeof options.define !== 'undefined') {
        Object.keys(options.define).forEach(function (key) {
            args.push("-D" + key + "=" + options.define[key]);
        });
    }
    var preExecuteArgs = splitCommands(options.preExecute);
    if (preExecuteArgs.length) {
        args.push.apply(args, preExecuteArgs);
    }
    if (options.nocd === true || options.noCD === true) {
        args.push('-NOCD');
    }
    if (options.noconfig === true || options.noConfig === true) {
        args.push('-NOCONFIG');
    }
    if (options.pause === true) {
        args.push('-PAUSE');
    }
    if (options.strict === true || options.wx === true) {
        args.push('-WX');
    }
    if (typeof options.inputCharset !== 'undefined' && charsets_1.input.includes(options.inputCharset)) {
        args.push('-INPUTCHARSET', options.inputCharset);
    }
    if (os_1.platform() === 'win32') {
        if (typeof options.outputCharset !== 'undefined' && charsets_1.output.includes(options.outputCharset)) {
            args.push('-OUTPUTCHARSET', options.outputCharset);
        }
    }
    if (options.ppo === true || options.PPO === true) {
        args.push('-PPO');
    }
    if (options.safeppo === true || options.safePPO === true) {
        args.push('-SAFEPPO');
    }
    if (os_1.platform() === 'win32' && Number.isInteger(options.priority) && options.priority >= 0 && options.priority <= 5) {
        args.push("-P" + options.priority);
    }
    if (Number.isInteger(options.verbose) && options.verbose >= 0 && options.verbose <= 4) {
        args.push("-V" + options.verbose);
    }
    return [cmd, args, { json: options.json, wine: options.wine }];
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
    var _a;
    if (args.includes('-CMDHELP') && !stream.stdout.trim() && stream.stderr) {
        // CMDHELP writes to stderr by default, let's fix this
        _a = [stream.stderr, ''], stream.stdout = _a[0], stream.stderr = _a[1];
    }
    if (opts.json === true) {
        if (args.includes('-CMDHELP')) {
            var minLength = (opts.wine === true) ? 2 : 1;
            if (args.length === minLength) {
                stream.stdout = objectifyHelp(stream.stdout, opts);
            }
            else {
                stream.stdout = objectify(stream.stdout, 'help');
            }
        }
        else if (args.includes('-HDRINFO')) {
            stream.stdout = objectifyFlags(stream.stdout, opts);
        }
        else if (args.includes('-LICENSE')) {
            stream.stdout = objectify(stream.stdout, 'license');
        }
        else if (args.includes('-VERSION')) {
            stream.stdout = objectify(stream.stdout, 'version');
        }
    }
    return stream;
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
var objectifyHelp = function (input, opts) {
    var lines = splitLines(input, opts);
    lines.sort();
    var output = {};
    lines.forEach(function (line) {
        var command = line.substr(0, line.indexOf(' '));
        var usage = line.substr(line.indexOf(' ') + 1);
        // Workaround
        if (['!AddIncludeDir', '!AddPluginDir'].includes(command)) {
            command = command.toLowerCase();
        }
        if (command)
            output[command] = usage;
    });
    return output;
};
var objectifyFlags = function (input, opts) {
    var lines = splitLines(input, opts);
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
var splitLines = function (input, opts) {
    var lineBreak = (os_1.platform() === 'win32' || opts.wine === true) ? '\r\n' : '\n';
    var output = input.split(lineBreak);
    return output;
};
var detectOutfile = function (str) {
    if (str.includes('Output: "')) {
        var regex = /Output: \"(.*\.exe)\"\r?\n/g;
        var result = regex.exec(str.toString());
        if (typeof result === 'object') {
            try {
                return result['1'];
            }
            catch (e) {
                return '';
            }
        }
    }
    return '';
};
var spawnMakensis = function (cmd, args, opts, spawnOpts) {
    if (spawnOpts === void 0) { spawnOpts = {}; }
    return new Promise(function (resolve, reject) {
        var stream = {
            stdout: '',
            stderr: ''
        };
        var warnings = 0;
        var outFile = '';
        var child = child_process_1.spawn(cmd, args, spawnOpts);
        child.stdout.on('data', function (line) {
            line = stringify(line);
            warnings += hasWarnings(line);
            if (outFile === '') {
                outFile = detectOutfile(line);
            }
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
            if (outFile.length) {
                output['outfile'] = outFile;
            }
            // Always resolve Promise!
            resolve(output);
        });
    });
};
exports.spawnMakensis = spawnMakensis;
var spawnMakensisSync = function (cmd, args, opts, spawnOpts) {
    if (spawnOpts === void 0) { spawnOpts = {}; }
    var child = child_process_1.spawnSync(cmd, args, spawnOpts);
    child.stdout = stringify(child.stdout);
    child.stderr = stringify(child.stderr);
    var warnings = hasWarnings(child.stdout);
    var outFile = detectOutfile(child.stdout);
    child = formatOutput(child, args, opts);
    var output = {
        'status': child.status,
        'stdout': child.stdout,
        'stderr': child.stderr,
        'warnings': warnings
    };
    if (outFile.length) {
        output['outfile'] = outFile;
    }
    return output;
};
exports.spawnMakensisSync = spawnMakensisSync;
