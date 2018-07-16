"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
/**
 * Returns usage information for a command, or list all commands
 * @param {string} [command] - an NSIS command
 * @param {Object} options - compiler options
 * @returns {string} - usage description
 */
var cmdHelp = function (command, options) {
    if (command === void 0) { command = ''; }
    if (options === void 0) { options = {}; }
    options = __assign({}, options, { verbose: 0 });
    var p = util_1.mapArguments(['-CMDHELP'], options);
    if (typeof command !== 'undefined' && typeof command !== 'object' && command !== '') {
        p.args.push(command);
    }
    return util_1.spawnMakensis(p.cmd, p.args, p.opts);
};
exports.cmdHelp = cmdHelp;
/**
 * Returns usage information for a command, or list all commands
 * @param {string} [command] - an NSIS command
 * @param {Object} options - compiler options
 * @returns {string} - usage description
 */
var cmdHelpSync = function (command, options) {
    if (command === void 0) { command = ''; }
    if (options === void 0) { options = {}; }
    options = __assign({}, options, { verbose: 0 });
    var p = util_1.mapArguments(['-CMDHELP'], options);
    if (typeof command !== 'undefined' && typeof command !== 'object' && command !== '') {
        p.args.push(command);
    }
    return util_1.spawnMakensisSync(p.cmd, p.args, p.opts);
};
exports.cmdHelpSync = cmdHelpSync;
/**
 * Returns information about which options were used to compile MakeNSIS
 * @param {Object} options - compiler options
 * @returns {string} - compiler options
 */
var hdrInfo = function (options) {
    if (options === void 0) { options = {}; }
    options = __assign({}, options, { verbose: 0 });
    var p = util_1.mapArguments(['-HDRINFO'], options);
    return util_1.spawnMakensis(p.cmd, p.args, p.opts);
};
exports.hdrInfo = hdrInfo;
/**
 * Returns information about which options were used to compile MakeNSIS
 * @returns {string} - compiler options
 */
var hdrInfoSync = function (options) {
    if (options === void 0) { options = {}; }
    options = __assign({}, options, { verbose: 0 });
    var p = util_1.mapArguments(['-HDRINFO'], options);
    return util_1.spawnMakensisSync(p.cmd, p.args, p.opts);
};
exports.hdrInfoSync = hdrInfoSync;
/**
 * Compile specified script with MakeNSIS
 * @param {string} script - path to NSIS script
 * @param {Object} options - compiler options
 */
var compile = function (script, options) {
    if (options === void 0) { options = {}; }
    var p = util_1.mapArguments([], options);
    if (script) {
        if (p.cmd === 'wine') {
            p.args.push('--');
        }
        p.args.push(script);
    }
    if (typeof options.postExecute !== 'undefined') {
        if (typeof options.postExecute === 'string') {
            p.args.push("-X" + options.postExecute);
        }
        else {
            options.postExecute.forEach(function (key) {
                p.args.push("-X" + key);
            });
        }
    }
    return util_1.spawnMakensis(p.cmd, p.args, p.opts);
};
exports.compile = compile;
/**
 * Compile specified script with MakeNSIS
 * @param {string} script - path to NSIS script
 * @param {Object} options - compiler options
 */
var compileSync = function (script, options) {
    if (options === void 0) { options = {}; }
    var p = util_1.mapArguments([], options);
    if (script) {
        if (p.cmd === 'wine') {
            p.args.push('--');
        }
        p.args.push(script);
    }
    if (typeof options.postExecute !== 'undefined') {
        if (typeof options.postExecute === 'string') {
            p.args.push("-X" + options.postExecute);
        }
        else {
            options.postExecute.forEach(function (key) {
                p.args.push("-X" + key);
            });
        }
    }
    return util_1.spawnMakensisSync(p.cmd, p.args, p.opts);
};
exports.compileSync = compileSync;
/**
 * Returns version of MakeNSIS
 * @param {Object} options - compiler options
 * @returns {string} - compiler version
 */
var version = function (options) {
    if (options === void 0) { options = {}; }
    options = __assign({}, options, { verbose: 0 });
    var p = util_1.mapArguments(['-VERSION'], options);
    return util_1.spawnMakensis(p.cmd, p.args, p.opts);
};
exports.version = version;
/**
 * Returns version of MakeNSIS
 * @param {Object} options - compiler options
 * @returns {string} - compiler version
 */
var versionSync = function (options) {
    if (options === void 0) { options = {}; }
    options = __assign({}, options, { verbose: 0 });
    var p = util_1.mapArguments(['-VERSION'], options);
    return util_1.spawnMakensisSync(p.cmd, p.args, p.opts);
};
exports.versionSync = versionSync;
/**
 * Returns NSIS directory
 * @param {Object} options - compiler options
 * @returns {string} - compiler version
 */
var nsisDir = function (options) {
    if (options === void 0) { options = {}; }
    var hdrOptions = __assign({}, options, { json: true });
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
 * @param {Object} options - compiler options
 * @returns {string} - compiler version
 */
var nsisDirSync = function (options) {
    if (options === void 0) { options = {}; }
    var hdrOptions = __assign({}, options, { json: true });
    var hdrinfo = hdrInfoSync(hdrOptions);
    if (options.json === true) {
        return util_1.objectify(hdrinfo.stdout.defined_symbols.NSISDIR, 'nsisdir');
    }
    return hdrinfo.stdout.defined_symbols.NSISDIR;
};
exports.nsisDirSync = nsisDirSync;
