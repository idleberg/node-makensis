"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
/**
 * Returns usage information for a command, or list all commands
 * @param {string} [command] - an NSIS command
 * @param {Object} options - compiler options
 * @returns {string} - usage description
 */
var cmdhelp = function (command, options) {
    if (command === void 0) { command = ''; }
    if (options === void 0) { options = null; }
    options || (options = {});
    var p = util_1.runWithWine(['-CMDHELP'], options);
    if (typeof command !== 'undefined' && command !== '') {
        p.args.push(command);
    }
    return util_1.spawnMakensis(p.cmd, p.args);
};
exports.cmdhelp = cmdhelp;
/**
 * Returns usage information for a command, or list all commands
 * @param {string} [command] - an NSIS command
 * @param {Object} options - compiler options
 * @returns {string} - usage description
 */
var cmdhelpSync = function (command, options) {
    if (command === void 0) { command = ''; }
    if (options === void 0) { options = null; }
    options || (options = {});
    var p = util_1.runWithWine(['-CMDHELP'], options);
    if (typeof command !== 'undefined' && command !== '') {
        p.args.push(command);
    }
    return util_1.spawnMakensisSync(p.cmd, p.args);
};
exports.cmdhelpSync = cmdhelpSync;
/**
 * Returns information about which options were used to compile MakeNSIS
 * @param {Object} options - compiler options
 * @returns {string} - compiler options
 */
var hdrinfo = function (options) {
    if (options === void 0) { options = null; }
    options || (options = {});
    var p = util_1.runWithWine(['-HDRINFO'], options);
    return util_1.spawnMakensis(p.cmd, p.args);
};
exports.hdrinfo = hdrinfo;
/**
 * Returns information about which options were used to compile MakeNSIS
 * @returns {string} - compiler options
 */
var hdrinfoSync = function (options) {
    if (options === void 0) { options = null; }
    options || (options = {});
    var p = util_1.runWithWine(['-HDRINFO'], options);
    return util_1.spawnMakensisSync(p.cmd, p.args);
};
exports.hdrinfoSync = hdrinfoSync;
/**
 * Compile specified script with MakeNSIS
 * @param {string} script - path to NSIS script
 * @param {Object} options - compiler options
 */
var compile = function (script, options) {
    if (options === void 0) { options = null; }
    options || (options = {});
    var p = util_1.getArguments(options);
    if (script) {
        if (p.cmd === 'wine') {
            p.args.push('--');
        }
        p.args.push(script);
    }
    return util_1.spawnMakensis(p.cmd, p.args);
};
exports.compile = compile;
/**
 * Compile specified script with MakeNSIS
 * @param {string} script - path to NSIS script
 * @param {Object} options - compiler options
 */
var compileSync = function (script, options) {
    if (options === void 0) { options = null; }
    options || (options = {});
    var p = util_1.getArguments(options);
    if (script) {
        if (p.cmd === 'wine') {
            p.args.push('--');
        }
        p.args.push(script);
    }
    return util_1.spawnMakensisSync(p.cmd, p.args);
};
exports.compileSync = compileSync;
/**
 * Returns version of MakeNSIS
 * @param {Object} options - compiler options
 * @returns {string} - compiler version
 */
var version = function (options) {
    if (options === void 0) { options = null; }
    options || (options = {});
    var p = util_1.runWithWine(['-VERSION'], options);
    return util_1.spawnMakensis(p.cmd, p.args);
};
exports.version = version;
/**
 * Returns version of MakeNSIS
 * @param {Object} options - compiler options
 * @returns {string} - compiler version
 */
var versionSync = function (options) {
    if (options === void 0) { options = null; }
    options || (options = {});
    var p = util_1.runWithWine(['-VERSION'], options);
    return util_1.spawnMakensisSync(p.cmd, p.args);
};
exports.versionSync = versionSync;
