"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
/**
 * Returns usage information for a command, or list all commands
 * @param command - an NSIS command
 * @param options - compiler options
 * @returns - usage description
 */
var cmdHelp = function (command, options, spawnOpts) {
    if (command === void 0) { command = ''; }
    if (options === void 0) { options = {}; }
    if (spawnOpts === void 0) { spawnOpts = {}; }
    options = __assign(__assign({}, options), { verbose: 0 });
    var _a = util_1.mapArguments(['-CMDHELP'], options), cmd = _a[0], args = _a[1], opts = _a[2];
    if (typeof command !== 'undefined' && typeof command !== 'object' && command !== '') {
        args.push(command);
    }
    return util_1.spawnMakensis(cmd, args, opts, spawnOpts);
};
exports.cmdHelp = cmdHelp;
/**
 * Returns usage information for a command, or list all commands
 * @param command - an NSIS command
 * @param options - compiler options
 * @returns - usage description
 */
var cmdHelpSync = function (command, options, spawnOpts) {
    if (command === void 0) { command = ''; }
    if (options === void 0) { options = {}; }
    if (spawnOpts === void 0) { spawnOpts = {}; }
    options = __assign(__assign({}, options), { verbose: 0 });
    var _a = util_1.mapArguments(['-CMDHELP'], options), cmd = _a[0], args = _a[1], opts = _a[2];
    if (typeof command !== 'undefined' && typeof command !== 'object' && command !== '') {
        args.push(command);
    }
    return util_1.spawnMakensisSync(cmd, args, opts, spawnOpts);
};
exports.cmdHelpSync = cmdHelpSync;
/**
 * Returns information about which options were used to compile MakeNSIS
 * @param options - compiler options
 * @returns - compiler options
 */
var hdrInfo = function (options, spawnOpts) {
    if (options === void 0) { options = {}; }
    if (spawnOpts === void 0) { spawnOpts = {}; }
    options = __assign(__assign({}, options), { verbose: 0 });
    var _a = util_1.mapArguments(['-HDRINFO'], options), cmd = _a[0], args = _a[1], opts = _a[2];
    return util_1.spawnMakensis(cmd, args, opts, spawnOpts);
};
exports.hdrInfo = hdrInfo;
/**
 * Returns information about which options were used to compile MakeNSIS
 * @returns - compiler options
 */
var hdrInfoSync = function (options, spawnOpts) {
    if (options === void 0) { options = {}; }
    if (spawnOpts === void 0) { spawnOpts = {}; }
    options = __assign(__assign({}, options), { verbose: 0 });
    var _a = util_1.mapArguments(['-HDRINFO'], options), cmd = _a[0], args = _a[1], opts = _a[2];
    return util_1.spawnMakensisSync(cmd, args, opts, spawnOpts);
};
exports.hdrInfoSync = hdrInfoSync;
/**
 * Compile specified script with MakeNSIS
 * @param} script - path to NSIS script
 * @param options - compiler options
 */
var compile = function (script, options, spawnOpts) {
    if (options === void 0) { options = {}; }
    if (spawnOpts === void 0) { spawnOpts = {}; }
    var _a = util_1.mapArguments([], options), cmd = _a[0], args = _a[1], opts = _a[2];
    if (script) {
        if (cmd === 'wine') {
            args.push('--');
        }
        args.push(script);
    }
    if (typeof options.postExecute !== 'undefined') {
        if (typeof options.postExecute === 'string') {
            args.push("-X" + options.postExecute);
        }
        else {
            options.postExecute.forEach(function (key) {
                args.push("-X" + key);
            });
        }
    }
    return util_1.spawnMakensis(cmd, args, opts, spawnOpts);
};
exports.compile = compile;
/**
 * Compile specified script with MakeNSIS
 * @param script - path to NSIS script
 * @param options - compiler options
 */
var compileSync = function (script, options, spawnOpts) {
    if (options === void 0) { options = {}; }
    if (spawnOpts === void 0) { spawnOpts = {}; }
    var _a = util_1.mapArguments([], options), cmd = _a[0], args = _a[1], opts = _a[2];
    if (script) {
        if (cmd === 'wine') {
            args.push('--');
        }
        args.push(script);
    }
    if (typeof options.postExecute !== 'undefined') {
        if (typeof options.postExecute === 'string') {
            args.push("-X" + options.postExecute);
        }
        else {
            options.postExecute.forEach(function (key) {
                args.push("-X" + key);
            });
        }
    }
    return util_1.spawnMakensisSync(cmd, args, opts, spawnOpts);
};
exports.compileSync = compileSync;
/**
 * Returns version of MakeNSIS
 * @param options - compiler options
 * @returns - compiler version
 */
var version = function (options, spawnOpts) {
    if (options === void 0) { options = {}; }
    if (spawnOpts === void 0) { spawnOpts = {}; }
    options = __assign(__assign({}, options), { verbose: 0 });
    var _a = util_1.mapArguments(['-VERSION'], options), cmd = _a[0], args = _a[1], opts = _a[2];
    return util_1.spawnMakensis(cmd, args, opts, spawnOpts);
};
exports.version = version;
/**
 * Returns version of MakeNSIS
 * @param options - compiler options
 * @returns - compiler version
 */
var versionSync = function (options, spawnOpts) {
    if (options === void 0) { options = {}; }
    if (spawnOpts === void 0) { spawnOpts = {}; }
    options = __assign(__assign({}, options), { verbose: 0 });
    var _a = util_1.mapArguments(['-VERSION'], options), cmd = _a[0], args = _a[1], opts = _a[2];
    return util_1.spawnMakensisSync(cmd, args, opts, spawnOpts);
};
exports.versionSync = versionSync;
/**
 * Returns MakeNSIS software license
 * @param options - compiler options
 * @returns - compiler license
 */
var license = function (options, spawnOpts) {
    if (options === void 0) { options = {}; }
    if (spawnOpts === void 0) { spawnOpts = {}; }
    var _a = util_1.mapArguments(['-LICENSE'], options), cmd = _a[0], args = _a[1], opts = _a[2];
    return util_1.spawnMakensis(cmd, args, opts, spawnOpts);
};
exports.license = license;
/**
 * Returns MakeNSIS software license
 * @param options - compiler options
 * @returns - compiler license
 */
var licenseSync = function (options, spawnOpts) {
    if (options === void 0) { options = {}; }
    if (spawnOpts === void 0) { spawnOpts = {}; }
    var _a = util_1.mapArguments(['-LICENSE'], options), cmd = _a[0], args = _a[1], opts = _a[2];
    return util_1.spawnMakensisSync(cmd, args, opts, spawnOpts);
};
exports.licenseSync = licenseSync;
/**
 * Returns directory where NSIS is installed to
 * @param options - compiler options
 * @returns - NSIS directory
 */
var nsisDir = function (options, spawnOpts) {
    if (options === void 0) { options = {}; }
    if (spawnOpts === void 0) { spawnOpts = {}; }
    var hdrOptions = __assign(__assign({}, options), { json: true });
    var output = hdrInfo(hdrOptions);
    return Promise.resolve(output)
        .then(function (hdrinfo) {
        if (options.json === true) {
            return util_1.objectify(hdrinfo.stdout.defined_symbols.NSISDIR, 'nsisdir');
        }
        return hdrinfo.stdout.defined_symbols.NSISDIR;
    })
        .catch(function (hdrinfo) {
        // NSIS < 3.03
        if (options.json === true) {
            return util_1.objectify(hdrinfo.stdout.defined_symbols.NSISDIR, 'nsisdir');
        }
        return hdrinfo.stdout.defined_symbols.NSISDIR;
    });
};
exports.nsisDir = nsisDir;
/**
 * Returns NSIS directory
 * @param options - compiler options
 * @returns - compiler version
 */
var nsisDirSync = function (options, spawnOpts) {
    if (options === void 0) { options = {}; }
    if (spawnOpts === void 0) { spawnOpts = {}; }
    var hdrOptions = __assign(__assign({}, options), { json: true });
    var hdrinfo = hdrInfoSync(hdrOptions);
    if (options.json === true) {
        return util_1.objectify(hdrinfo.stdout.defined_symbols.NSISDIR, 'nsisdir');
    }
    return hdrinfo.stdout.defined_symbols.NSISDIR;
};
exports.nsisDirSync = nsisDirSync;
