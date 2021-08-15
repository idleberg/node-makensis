import { EventEmitter } from 'events';
import { meta } from '@nsis/language-data';
import { platform } from 'os';
import { spawn, spawnSync } from 'child_process';
import { split } from 'shlex';

var eventEmitter = new EventEmitter();

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

var codePages = [];
Object.keys(meta).map(function (key) {
    var codePage = meta[key].code_page;
    if (!isNaN(codePage) && !codePages.includes("CP" + codePage)) {
        codePages.push("CP" + codePage);
    }
});
var input = __spreadArray(__spreadArray([
    'ACP'
], codePages), [
    'OEM',
    'UTF8',
    'UTF16BE',
    'UTF16LE'
]);
var output = __spreadArray(__spreadArray([
    'ACP'
], codePages), [
    'OEM',
    'UTF16BE',
    'UTF16BEBOM',
    'UTF16LE',
    'UTF16LEBOM',
    'UTF8',
    'UTF8SIG'
]);

function splitCommands(data) {
    var args = [];
    if (typeof data === 'string') {
        if (data.trim().includes('\n')) {
            var lines = data.trim().split('\n');
            lines.map(function (line) {
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
        data.map(function (key) {
            if (key.trim().length) {
                args.push("-X" + key);
            }
        });
    }
    return args;
}
function mapArguments(args, options) {
    var pathToMakensis = options.pathToMakensis
        ? options.pathToMakensis
        : 'makensis';
    var pathToWine = options.pathToWine
        ? options.pathToWine
        : 'wine';
    var cmd;
    if (platform() !== 'win32' && options.wine === true) {
        cmd = pathToWine;
        args.unshift(pathToMakensis);
    }
    else {
        cmd = pathToMakensis;
    }
    if (args.length > 1 || args.includes('-CMDHELP')) {
        return [cmd, args, {
                json: options.json,
                wine: options.wine
            }];
    }
    if (options === null || options === void 0 ? void 0 : options.define) {
        Object.keys(options.define).map(function (key) {
            if ((options === null || options === void 0 ? void 0 : options.define) && (options === null || options === void 0 ? void 0 : options.define[key])) {
                args.push("-D" + key + "=" + options.define[key]);
            }
        });
    }
    if (options === null || options === void 0 ? void 0 : options.preExecute) {
        var preExecuteArgs = splitCommands(options.preExecute);
        if (preExecuteArgs.length) {
            args.push.apply(args, preExecuteArgs);
        }
    }
    if (options.noCD === true) {
        args.push('-NOCD');
    }
    if (options.noConfig === true) {
        args.push('-NOCONFIG');
    }
    if (options.pause === true) {
        args.push('-PAUSE');
    }
    if (options.strict === true) {
        args.push('-WX');
    }
    if (options.inputCharset && input.includes(options.inputCharset)) {
        args.push('-INPUTCHARSET', options.inputCharset);
    }
    if (platform() === 'win32') {
        if (options.outputCharset && output.includes(options.outputCharset)) {
            args.push('-OUTPUTCHARSET', options.outputCharset);
        }
    }
    if (options.ppo === true) {
        args.push('-PPO');
    }
    if (options.safePPO === true) {
        args.push('-SAFEPPO');
    }
    if (options.priority) {
        var priority = parseInt(String(options.priority));
        if (platform() === 'win32' && isInteger(priority) && inRange(priority, 0, 5)) {
            args.push("-P" + options.priority);
        }
    }
    if (options.verbose) {
        var verbosity = parseInt(String(options.verbose));
        if (isInteger(verbosity) && inRange(verbosity, 0, 4)) {
            args.push("-V" + verbosity);
        }
    }
    if (options.rawArguments) {
        if (typeof options.rawArguments === 'string') {
            args.push.apply(args, split(options.rawArguments));
        }
        else if (Array.isArray(options.rawArguments)) {
            args = args.concat(options.rawArguments);
        }
    }
    return [cmd, args, { json: options.json, wine: options.wine }];
}
function stringify(data) {
    return (data === null || data === void 0 ? void 0 : data.length)
        ? data.toString().trim()
        : '';
}
function isInteger(x) {
    return x % 2 === 0;
}
function inRange(value, min, max) {
    return value >= min && value <= max;
}
function hasWarnings(line) {
    var match = line.match(/(\d+) warnings?:/);
    if (match !== null) {
        return parseInt(match[1]);
    }
    return 0;
}
function formatOutput(stream, args, opts) {
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
}
function objectify(input, key) {
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
}
function objectifyHelp(input, opts) {
    var lines = splitLines(input, opts);
    lines.sort();
    var output = {};
    if (lines === null || lines === void 0 ? void 0 : lines.length) {
        lines.map(function (line) {
            var command = line.substr(0, line.indexOf(' '));
            var usage = line.substr(line.indexOf(' ') + 1);
            // Workaround
            if (['!AddIncludeDir', '!AddPluginDir'].includes(command)) {
                command = command.toLowerCase();
            }
            if (command)
                output[command] = usage;
        });
    }
    return output;
}
function objectifyFlags(input, opts) {
    var output = {};
    var lines = splitLines(input, opts);
    if (!(lines === null || lines === void 0 ? void 0 : lines.length)) {
        return output;
    }
    var filteredLines = lines.filter(function (line) {
        if (line !== '') {
            return line;
        }
    });
    var tableSizes = {};
    var tableSymbols = {};
    var symbols;
    if (!(filteredLines === null || filteredLines === void 0 ? void 0 : filteredLines.length)) {
        return output;
    }
    // Split sizes
    filteredLines.map(function (line) {
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
    output['sizes'] = tableSizes;
    if (!(symbols === null || symbols === void 0 ? void 0 : symbols.length)) {
        return output;
    }
    // Split symbols
    symbols.map(function (symbol) {
        var pair = symbol.split('=');
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
}
function hasErrorCode(input) {
    if ((input === null || input === void 0 ? void 0 : input.includes('ENOENT')) && input.match(/\bENOENT\b/)) {
        return true;
    }
    else if ((input === null || input === void 0 ? void 0 : input.includes('EACCES')) && input.match(/\bEACCES\b/)) {
        return true;
    }
    else if ((input === null || input === void 0 ? void 0 : input.includes('EISDIR')) && input.match(/\bEISDIR\b/)) {
        return true;
    }
    else if ((input === null || input === void 0 ? void 0 : input.includes('EMFILE')) && input.match(/\bEMFILE\b/)) {
        return true;
    }
    return false;
}
function splitLines(input, opts) {
    if (opts === void 0) { opts = {}; }
    var lineBreak = (platform() === 'win32' || opts.wine === true) ? '\r\n' : '\n';
    var output = input.split(lineBreak);
    return output;
}
function detectOutfile(str) {
    if (str.includes('Output: "')) {
        var regex = new RegExp('Output: "(.*.exe)"', 'g');
        var result = regex.exec(str.toString());
        if (typeof result === 'object' && result && result['1']) {
            try {
                return result['1'];
            }
            catch (e) {
                return '';
            }
        }
    }
    return '';
}
function spawnMakensis(cmd, args, opts, spawnOptions) {
    if (spawnOptions === void 0) { spawnOptions = {}; }
    return new Promise(function (resolve, reject) {
        var stream = {
            stdout: '',
            stderr: ''
        };
        var warningsCounter = 0;
        var outFile = '';
        var child = spawn(cmd, args, spawnOptions);
        child.stdout.on('data', function (data) {
            var line = stringify(data);
            var warnings = hasWarnings(line);
            warningsCounter += warnings;
            if (outFile === '') {
                outFile = detectOutfile(line);
            }
            eventEmitter.emit('stdout', {
                line: line,
                outFile: outFile,
                hasWarning: Boolean(warnings)
            });
            stream.stdout += line;
        });
        child.stderr.on('data', function (data) {
            var line = stringify(data);
            eventEmitter.emit('stderr', {
                line: line
            });
            stream.stderr += line;
        });
        child.on('error', function (errorMessage) {
            console.error(errorMessage);
        });
        // Using 'exit' will truncate stdout
        child.on('close', function (code) {
            stream = formatOutput(stream, args, opts);
            var output = {
                status: code,
                stdout: stream.stdout || '',
                stderr: stream.stderr || '',
                warnings: warningsCounter
            };
            if (outFile.length) {
                output['outFile'] = outFile;
            }
            eventEmitter.emit('exit', output);
            if (code === 0 || (stream.stderr && !hasErrorCode(stream.stderr))) {
                // Promise also resolves on MakeNSIS errors
                resolve(output);
            }
            else {
                reject(output.stderr);
            }
        });
    });
}
function spawnMakensisSync(cmd, args, opts, spawnOptions) {
    if (spawnOptions === void 0) { spawnOptions = {}; }
    var child = spawnSync(cmd, args, spawnOptions);
    child.stdout = stringify(child.stdout);
    child.stderr = stringify(child.stderr);
    var warningsCounter = hasWarnings(child.stdout);
    var outFile = detectOutfile(child.stdout);
    child = formatOutput(child, args, opts);
    var output = {
        'status': child.status,
        'stdout': child.stdout,
        'stderr': child.stderr,
        'warnings': warningsCounter
    };
    if (outFile.length) {
        output['outFile'] = outFile;
    }
    return output;
}

/**
 * Returns usage information for a command, or list all commands
 * @param command - an NSIS command
 * @param options - compiler options
 * @returns - usage description
 */
function commandHelp(command, options, spawnOptions) {
    if (command === void 0) { command = ''; }
    if (options === void 0) { options = {}; }
    if (spawnOptions === void 0) { spawnOptions = {}; }
    options = __assign(__assign({}, options), { verbose: 0 });
    var _a = mapArguments(['-CMDHELP'], options), cmd = _a[0], args = _a[1], opts = _a[2];
    if ((command === null || command === void 0 ? void 0 : command.length) && typeof command === 'string') {
        args.push(command);
    }
    return spawnMakensis(cmd, args, opts, spawnOptions);
}
/**
 * Compile specified script with MakeNSIS
 * @param script - path to NSIS script
 * @param options - compiler options
 */
function compile(script, options, spawnOptions) {
    if (options === void 0) { options = {}; }
    if (spawnOptions === void 0) { spawnOptions = {}; }
    var _a = mapArguments([], options), cmd = _a[0], args = _a[1], opts = _a[2];
    if (script) {
        if (cmd === 'wine') {
            args.push('--');
        }
        args.push(script);
    }
    if (options === null || options === void 0 ? void 0 : options.postExecute) {
        var postExecuteArgs = splitCommands(options.postExecute);
        if (postExecuteArgs.length) {
            args.push.apply(args, postExecuteArgs);
        }
    }
    return spawnMakensis(cmd, args, opts, spawnOptions);
}
/**
 * Returns information about which options were used to compile MakeNSIS
 * @param options - compiler options
 * @returns - compiler options
 */
function headerInfo(options, spawnOptions) {
    if (options === void 0) { options = {}; }
    if (spawnOptions === void 0) { spawnOptions = {}; }
    options = __assign(__assign({}, options), { verbose: 0 });
    var _a = mapArguments(['-HDRINFO'], options), cmd = _a[0], args = _a[1], opts = _a[2];
    return spawnMakensis(cmd, args, opts, spawnOptions);
}
/**
 * Returns MakeNSIS software license
 * @param options - compiler options
 * @returns - compiler license
 */
function license(options, spawnOptions) {
    if (options === void 0) { options = {}; }
    if (spawnOptions === void 0) { spawnOptions = {}; }
    var _a = mapArguments(['-LICENSE'], options), cmd = _a[0], args = _a[1], opts = _a[2];
    return spawnMakensis(cmd, args, opts, spawnOptions);
}
/**
 * Returns directory where NSIS is installed to
 * @param options - compiler options
 * @returns - NSIS directory
 */
function nsisDir(options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        function handler(hdrinfo) {
            if (options.json === true) {
                return objectify(hdrinfo.stdout.defined_symbols.NSISDIR, 'nsisdir');
            }
            return hdrinfo.stdout.defined_symbols.NSISDIR;
        }
        var hdrOptions, hdrinfo, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hdrOptions = __assign(__assign({}, options), { json: true });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, headerInfo(hdrOptions)];
                case 2:
                    hdrinfo = _a.sent();
                    return [2 /*return*/, handler(hdrinfo)];
                case 3:
                    error_1 = _a.sent();
                    // NSIS < 3.03
                    return [2 /*return*/, handler(error_1)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Returns version of MakeNSIS
 * @param options - compiler options
 * @returns - compiler version
 */
function version(options, spawnOptions) {
    if (options === void 0) { options = {}; }
    if (spawnOptions === void 0) { spawnOptions = {}; }
    options = __assign(__assign({}, options), { verbose: 0 });
    var _a = mapArguments(['-VERSION'], options), cmd = _a[0], args = _a[1], opts = _a[2];
    return spawnMakensis(cmd, args, opts, spawnOptions);
}
/**
 * Returns usage information for a command, or list all commands
 * @param command - an NSIS command
 * @param options - compiler options
 * @returns - usage description
 */
commandHelp.sync = function (command, options, spawnOptions) {
    if (command === void 0) { command = ''; }
    if (options === void 0) { options = {}; }
    if (spawnOptions === void 0) { spawnOptions = {}; }
    options = __assign(__assign({}, options), { verbose: 0 });
    var _a = mapArguments(['-CMDHELP'], options), cmd = _a[0], args = _a[1], opts = _a[2];
    if ((command === null || command === void 0 ? void 0 : command.length) && typeof command !== 'object') {
        args.push(command);
    }
    return spawnMakensisSync(cmd, args, opts, spawnOptions);
};
/**
 * Compile specified script with MakeNSIS
 * @param script - path to NSIS script
 * @param options - compiler options
 */
compile.sync = function (script, options, spawnOptions) {
    if (options === void 0) { options = {}; }
    if (spawnOptions === void 0) { spawnOptions = {}; }
    var _a = mapArguments([], options), cmd = _a[0], args = _a[1], opts = _a[2];
    if (script) {
        if (cmd === 'wine') {
            args.push('--');
        }
        args.push(script);
    }
    if (typeof options.postExecute === 'string') {
        args.push("-X" + options.postExecute);
    }
    else if (options.postExecute) {
        options.postExecute.map(function (key) {
            args.push("-X" + key);
        });
    }
    return spawnMakensisSync(cmd, args, opts, spawnOptions);
};
/**
 * Returns information about which options were used to compile MakeNSIS
 * @returns - compiler options
 */
headerInfo.sync = function (options, spawnOptions) {
    if (options === void 0) { options = {}; }
    if (spawnOptions === void 0) { spawnOptions = {}; }
    options = __assign(__assign({}, options), { verbose: 0 });
    var _a = mapArguments(['-HDRINFO'], options), cmd = _a[0], args = _a[1], opts = _a[2];
    return spawnMakensisSync(cmd, args, opts, spawnOptions);
};
/**
 * Returns MakeNSIS software license
 * @param options - compiler options
 * @returns - compiler license
 */
license.sync = function (options, spawnOptions) {
    if (options === void 0) { options = {}; }
    if (spawnOptions === void 0) { spawnOptions = {}; }
    var _a = mapArguments(['-LICENSE'], options), cmd = _a[0], args = _a[1], opts = _a[2];
    return spawnMakensisSync(cmd, args, opts, spawnOptions);
};
/**
 * Returns NSIS directory
 * @param options - compiler options
 * @returns - compiler version
 */
nsisDir.sync = function (options) {
    if (options === void 0) { options = {}; }
    var hdrOptions = __assign(__assign({}, options), { json: true });
    var hdrinfo = headerInfo.sync(hdrOptions);
    if (options.json === true) {
        return objectify(hdrinfo.stdout.defined_symbols.NSISDIR, 'nsisdir');
    }
    return hdrinfo.stdout.defined_symbols.NSISDIR;
};
/**
 * Returns version of MakeNSIS
 * @param options - compiler options
 * @returns - compiler version
 */
version.sync = function (options, spawnOptions) {
    if (options === void 0) { options = {}; }
    if (spawnOptions === void 0) { spawnOptions = {}; }
    options = __assign(__assign({}, options), { verbose: 0 });
    var _a = mapArguments(['-VERSION'], options), cmd = _a[0], args = _a[1], opts = _a[2];
    return spawnMakensisSync(cmd, args, opts, spawnOptions);
};

export { commandHelp, compile, eventEmitter as events, headerInfo, license, nsisDir, version };
