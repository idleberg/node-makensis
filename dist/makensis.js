"use strict";
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
    Object.assign(options, { verbose: 0 });
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
    Object.assign(options, { verbose: 0 });
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
    Object.assign(options, { verbose: 0 });
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
    Object.assign(options, { verbose: 0 });
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
    Object.assign(options, {});
    var p = util_1.mapArguments([], options);
    if (script) {
        if (p.cmd === 'wine') {
            p.args.push('--');
        }
        p.args.push(script);
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
    Object.assign(options, {});
    var p = util_1.mapArguments([], options);
    if (script) {
        if (p.cmd === 'wine') {
            p.args.push('--');
        }
        p.args.push(script);
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
    Object.assign(options, { verbose: 0 });
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
    Object.assign(options, { verbose: 0 });
    var p = util_1.mapArguments(['-VERSION'], options);
    return util_1.spawnMakensisSync(p.cmd, p.args, p.opts);
};
exports.versionSync = versionSync;
