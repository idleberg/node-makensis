import { EventEmitter } from 'node:events';
import { promises, constants } from 'node:fs';
import { codepages } from '@nsis/language-data';
import { join } from 'node:path';
import { platform } from 'node:os';
import { spawn } from 'node:child_process';
import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

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

var codePages = codepages().map(function (cp) { return "CP".concat(cp); });
var input = __spreadArray(__spreadArray([
    'ACP'
], codePages, true), [
    'OEM',
    'UTF8',
    'UTF16BE',
    'UTF16LE'
], false);
var output = __spreadArray(__spreadArray([
    'ACP'
], codePages, true), [
    'OEM',
    'UTF16BE',
    'UTF16BEBOM',
    'UTF16LE',
    'UTF16LEBOM',
    'UTF8',
    'UTF8SIG'
], false);

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
function fileExists(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises.access(filePath, constants.F_OK)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/, true];
            }
        });
    });
}
function findEnvFile(dotenvPath) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, cwd, dotenvFile, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _b = typeof dotenvPath === 'string' && (dotenvPath === null || dotenvPath === void 0 ? void 0 : dotenvPath.length);
                    if (!_b) return [3 /*break*/, 2];
                    return [4 /*yield*/, fileExists(dotenvPath)];
                case 1:
                    _b = (_e.sent());
                    _e.label = 2;
                case 2:
                    _a = _b;
                    if (!_a) return [3 /*break*/, 4];
                    return [4 /*yield*/, promises.lstat(dotenvPath)];
                case 3:
                    _a = (_e.sent()).isFile();
                    _e.label = 4;
                case 4:
                    if (_a) {
                        return [2 /*return*/, dotenvPath];
                    }
                    cwd = dotenvPath && typeof dotenvPath === 'string'
                        ? dotenvPath
                        : process.cwd();
                    if (!cwd) return [3 /*break*/, 15];
                    _c = true;
                    return [4 /*yield*/, fileExists(join(cwd, ".env.[".concat(process.env.NODE_ENV, "].local")))];
                case 5:
                    switch (_c) {
                        case (_e.sent()): return [3 /*break*/, 10];
                    }
                    return [4 /*yield*/, fileExists(join(cwd, '.env.local'))];
                case 6:
                    switch (_c) {
                        case (_e.sent()): return [3 /*break*/, 11];
                    }
                    _d = process.env.NODE_ENV;
                    if (!_d) return [3 /*break*/, 8];
                    return [4 /*yield*/, fileExists(join(cwd, ".env.[".concat(process.env.NODE_ENV, "]")))];
                case 7:
                    _d = (_e.sent());
                    _e.label = 8;
                case 8:
                    switch (_c) {
                        case (_d): return [3 /*break*/, 12];
                    }
                    return [4 /*yield*/, fileExists(join(cwd, '.env'))];
                case 9:
                    switch (_c) {
                        case (_e.sent()): return [3 /*break*/, 13];
                    }
                    return [3 /*break*/, 14];
                case 10:
                    dotenvFile = join(cwd, ".env.[".concat(process.env.NODE_ENV, "].local"));
                    return [3 /*break*/, 15];
                case 11:
                    dotenvFile = join(cwd, '.env.local');
                    return [3 /*break*/, 15];
                case 12:
                    dotenvFile = join(cwd, ".env.[".concat(process.env.NODE_ENV, "]"));
                    return [3 /*break*/, 15];
                case 13:
                    dotenvFile = join(cwd, '.env');
                    return [3 /*break*/, 15];
                case 14: return [3 /*break*/, 15];
                case 15: return [2 /*return*/, dotenvFile];
            }
        });
    });
}
function formatOutput(stream, args, opts) {
    var _a;
    var stdOut = stream.stdout.toString().trim();
    var stdErr = stream.stderr.toString().trim();
    var output = {
        stdout: stdOut,
        stderr: stdErr
    };
    if (args.includes('-CMDHELP') && !stdOut.trim() && stdErr) {
        // CMDHELP writes to stderr by default, let's fix this
        _a = [stdErr, ''], output.stdout = _a[0], output.stderr = _a[1];
    }
    if (opts.json === true) {
        if (args.includes('-CMDHELP')) {
            var minLength = (opts.wine === true) ? 2 : 1;
            if (args.length === minLength) {
                output.stdout = objectifyHelp(stdOut, opts);
            }
            else {
                output.stdout = objectify(stdOut, 'help');
            }
        }
        else if (args.includes('-HDRINFO')) {
            output.stdout = objectifyFlags(stdOut, opts);
        }
        else if (args.includes('-LICENSE')) {
            output.stdout = objectify(stdOut, 'license');
        }
        else if (args.includes('-VERSION')) {
            output.stdout = objectify(stdOut, 'version');
        }
    }
    return output;
}
function getMagicEnvVars(envFile) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, definitions, prefix;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = expand;
                    _c = (_b = dotenv).config;
                    _d = {};
                    return [4 /*yield*/, findEnvFile(envFile)];
                case 1:
                    _a.apply(void 0, [_c.apply(_b, [(_d.path = _e.sent(),
                                _d)])]);
                    definitions = {};
                    prefix = 'NSIS_APP_';
                    Object.keys(process.env).map(function (item) {
                        if ((item === null || item === void 0 ? void 0 : item.length) && new RegExp("".concat(prefix, "[a-z0-9]+"), 'gi').test(item)) {
                            definitions[item] = process.env[item];
                        }
                    });
                    return [2 /*return*/, definitions];
            }
        });
    });
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
function hasWarnings(line) {
    var match = line.match(/(\d+) warnings?:/);
    if (match !== null) {
        return parseInt(match[1], 10);
    }
    return 0;
}
function isHex(x) {
    return /^(0x|0X)[a-fA-F0-9]+$/.test(String(x));
}
function isNumeric(x) {
    return !isNaN(x);
}
function inRange(value, min, max) {
    return value >= min && value <= max;
}
function mapArguments(args, options) {
    return __awaiter(this, void 0, void 0, function () {
        var pathToMakensis, pathToWine, cmd, defines_1, preExecuteArgs, priority, verbosity;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pathToMakensis = options.pathToMakensis
                        ? options.pathToMakensis
                        : 'makensis';
                    pathToWine = options.pathToWine
                        ? options.pathToWine
                        : 'wine';
                    if (platform() !== 'win32' && options.wine === true) {
                        cmd = pathToWine;
                        args.unshift(pathToMakensis);
                    }
                    else {
                        cmd = pathToMakensis;
                    }
                    if (args.length > 1 || args.includes('-CMDHELP')) {
                        return [2 /*return*/, [cmd, args, {
                                    json: options.json,
                                    wine: options.wine
                                }]];
                    }
                    if (options === null || options === void 0 ? void 0 : options.define) {
                        Object.keys(options.define).map(function (key) {
                            if (options.define && options.define[key]) {
                                args.push("-D".concat(key, "=").concat(options.define[key]));
                            }
                        });
                    }
                    if (!(options === null || options === void 0 ? void 0 : options.env)) return [3 /*break*/, 2];
                    return [4 /*yield*/, getMagicEnvVars(options.env)];
                case 1:
                    defines_1 = _a.sent();
                    if (defines_1 && Object.keys(defines_1).length) {
                        Object.keys(defines_1).map(function (key) {
                            if (defines_1 && defines_1[key]) {
                                args.push("-D".concat(key, "=").concat(defines_1[key]));
                            }
                        });
                    }
                    _a.label = 2;
                case 2:
                    if (options === null || options === void 0 ? void 0 : options.preExecute) {
                        preExecuteArgs = splitCommands(options.preExecute);
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
                        priority = parseInt(String(options.priority), 10);
                        if (platform() === 'win32' && isNumeric(priority) && inRange(priority, 0, 5)) {
                            args.push("-P".concat(options.priority));
                        }
                    }
                    if (options.verbose) {
                        verbosity = parseInt(String(options.verbose), 10);
                        if (isNumeric(verbosity) && inRange(verbosity, 0, 4)) {
                            args.push("-V".concat(verbosity));
                        }
                    }
                    if (options.rawArguments && Array.isArray(options.rawArguments)) {
                        args = __spreadArray(__spreadArray([], args, true), options.rawArguments, true);
                    }
                    return [2 /*return*/, [cmd, args, { json: options.json, wine: options.wine }]];
            }
        });
    });
}
function objectify(input, key) {
    if (key === 'version' && input.startsWith('v')) {
        input = input.substr(1);
    }
    if (key === null) {
        return input;
    }
    var output = {};
    output[key] = input;
    return output;
}
function objectifyFlags(input, opts) {
    var output = {
        sizes: {},
        defined_symbols: {}
    };
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
    var symbols = [];
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
            if (!isHex(pair[1]) && isNumeric(Number(pair[1]))) {
                pair[1] = parseInt(String(pair[1]), 10);
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
function spawnMakensis(cmd, args, compilerOptions, spawnOptions) {
    if (spawnOptions === void 0) { spawnOptions = {}; }
    return new Promise(function (resolve, reject) {
        var _a, _b;
        if (compilerOptions.wine) {
            spawnOptions['env'] = Object.freeze(__assign(__assign({ WINEDEBUG: '-all' }, process.env), spawnOptions.env));
        }
        var stream = {
            stdout: '',
            stderr: ''
        };
        var warningsCounter = 0;
        var outFile = '';
        var child = spawn(cmd, args, spawnOptions);
        (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on('data', function (data) {
            var line = args.includes('-LICENSE') ? data.toString() : stringify(data);
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
        (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on('data', function (data) {
            var line = data.toString();
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
            var streamFormatted = formatOutput(stream, args, compilerOptions);
            var output = {
                status: code,
                stdout: streamFormatted.stdout || '',
                stderr: streamFormatted.stderr || '',
                warnings: warningsCounter
            };
            if (outFile.length) {
                output['outFile'] = outFile;
            }
            eventEmitter.emit('exit', output);
            if (code === 0 || (streamFormatted.stderr && !hasErrorCode(streamFormatted.stderr))) {
                // Promise will be resolved on MakeNSIS errors...
                resolve(output);
            }
            else {
                // ...but will be rejected on all other errors
                reject(output.stderr);
            }
        });
    });
}
function splitCommands(data) {
    var args = [];
    if (typeof data === 'string') {
        if (data.trim().includes('\n')) {
            var lines = data.trim().split('\n');
            lines.map(function (line) {
                if (line.trim().length) {
                    args.push("-X".concat(line));
                }
            });
        }
        else {
            args.push("-X".concat(data));
        }
    }
    else {
        data.map(function (key) {
            if (key.trim().length) {
                args.push("-X".concat(key));
            }
        });
    }
    return args;
}
function splitLines(input, opts) {
    if (opts === void 0) { opts = {}; }
    var lineBreak = (platform() === 'win32' || opts.wine === true) ? '\r\n' : '\n';
    var output = input.split(lineBreak);
    return output;
}
function stringify(data) {
    return (data === null || data === void 0 ? void 0 : data.length)
        ? data.toString().trim()
        : '';
}

/**
 * Returns usage information for a command, or list all commands
 * @param command - an NSIS command
 * @param compilerOptions - compiler options
 * @returns - usage description
 */
function commandHelp(command, compilerOptions, spawnOptions) {
    if (command === void 0) { command = ''; }
    if (compilerOptions === void 0) { compilerOptions = {}; }
    if (spawnOptions === void 0) { spawnOptions = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var options, _a, cmd, args, opts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = __assign(__assign({}, compilerOptions), { verbose: 0 });
                    return [4 /*yield*/, mapArguments(['-CMDHELP'], options)];
                case 1:
                    _a = _b.sent(), cmd = _a[0], args = _a[1], opts = _a[2];
                    if ((command === null || command === void 0 ? void 0 : command.length) && typeof command === 'string') {
                        args.push(command);
                    }
                    return [2 /*return*/, spawnMakensis(cmd, args, opts, spawnOptions)];
            }
        });
    });
}
/**
 * Compile specified script with MakeNSIS
 * @param script - path to NSIS script
 * @param compilerOptions - compiler options
 */
function compile(script, compilerOptions, spawnOptions) {
    if (compilerOptions === void 0) { compilerOptions = {}; }
    if (spawnOptions === void 0) { spawnOptions = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, cmd, args, opts, postExecuteArgs;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, mapArguments([], compilerOptions)];
                case 1:
                    _a = _b.sent(), cmd = _a[0], args = _a[1], opts = _a[2];
                    if (script) {
                        if (cmd === 'wine') {
                            args.push('--');
                        }
                        args.push(script);
                    }
                    if (compilerOptions === null || compilerOptions === void 0 ? void 0 : compilerOptions.postExecute) {
                        postExecuteArgs = splitCommands(compilerOptions.postExecute);
                        if (postExecuteArgs.length) {
                            args.push.apply(args, postExecuteArgs);
                        }
                    }
                    return [2 /*return*/, spawnMakensis(cmd, args, opts, spawnOptions)];
            }
        });
    });
}
/**
 * Returns information about which options were used to compile MakeNSIS
 * @param compilerOptions - compiler options
 * @returns - compiler options
 */
function headerInfo(compilerOptions, spawnOptions) {
    if (compilerOptions === void 0) { compilerOptions = {}; }
    if (spawnOptions === void 0) { spawnOptions = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var options, _a, cmd, args, opts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = __assign(__assign({}, compilerOptions), { verbose: 0 });
                    return [4 /*yield*/, mapArguments(['-HDRINFO'], options)];
                case 1:
                    _a = _b.sent(), cmd = _a[0], args = _a[1], opts = _a[2];
                    return [2 /*return*/, spawnMakensis(cmd, args, opts, spawnOptions)];
            }
        });
    });
}
/**
 * Returns MakeNSIS software license
 * @param compilerOptions - compiler options
 * @returns - compiler license
 */
function license(compilerOptions, spawnOptions) {
    if (compilerOptions === void 0) { compilerOptions = {}; }
    if (spawnOptions === void 0) { spawnOptions = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, cmd, args, opts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, mapArguments(['-LICENSE'], compilerOptions)];
                case 1:
                    _a = _b.sent(), cmd = _a[0], args = _a[1], opts = _a[2];
                    return [2 /*return*/, spawnMakensis(cmd, args, opts, spawnOptions)];
            }
        });
    });
}
/**
 * Returns directory where NSIS is installed to
 * @param compilerOptions - compiler options
 * @returns - NSIS directory
 */
function nsisDir(compilerOptions) {
    if (compilerOptions === void 0) { compilerOptions = {}; }
    return __awaiter(this, void 0, void 0, function () {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function handler(hdrinfo) {
            if (compilerOptions.json === true) {
                return objectify(hdrinfo.stdout['defined_symbols']['NSISDIR'], 'nsisdir');
            }
            return hdrinfo.stdout['defined_symbols']['NSISDIR'];
        }
        var hdrOptions, hdrinfo, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hdrOptions = __assign(__assign({}, compilerOptions), { json: true });
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
 * @param compilerOptions - compiler options
 * @returns - compiler version
 */
function version(compilerOptions, spawnOptions) {
    if (compilerOptions === void 0) { compilerOptions = {}; }
    if (spawnOptions === void 0) { spawnOptions = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var options, _a, cmd, args, opts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = __assign(__assign({}, compilerOptions), { verbose: 0 });
                    return [4 /*yield*/, mapArguments(['-VERSION'], options)];
                case 1:
                    _a = _b.sent(), cmd = _a[0], args = _a[1], opts = _a[2];
                    return [2 /*return*/, spawnMakensis(cmd, args, opts, spawnOptions)];
            }
        });
    });
}

export { commandHelp, compile, eventEmitter as events, headerInfo, license, nsisDir, version };
