"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
/**
 * Returns usage information for a command, or list all commands
 * @param {string} [command] - an NSIS command
 * @returns {string} - usage description
 */
var help = function (command) {
    if (command === void 0) { command = ''; }
    var args = ['-CMDHELP'];
    if (typeof command !== 'undefined' && command !== '') {
        args.push(command);
    }
    return util_1.spawnMakensis(args);
};
exports.help = help;
/**
 * Returns information about which options were used to compile MakeNSIS
 * @returns {string} - compiler options
 */
var hdrinfo = function () {
    return util_1.spawnMakensis(['-HDRINFO']);
};
exports.hdrinfo = hdrinfo;
/**
 * Returns information about which options were used to compile MakeNSIS
 * @returns {string} - compiler options
 */
var hdrinfoSync = function () {
    return util_1.spawnMakensisSync(['-HDRINFO']);
};
exports.hdrinfoSync = hdrinfoSync;
/**
 * Returns usage information for a command, or list all commands
 * @param {string} [command] - an NSIS command
 * @returns {string} - usage description
 */
var helpSync = function (command) {
    if (command === void 0) { command = ''; }
    var args = ['-CMDHELP'];
    if (typeof command !== 'undefined' && command !== '') {
        args.push(command);
    }
    return util_1.spawnMakensisSync(args);
};
exports.helpSync = helpSync;
/**
 * Compile specified script with MakeNSIS
 * @param {string} script - path to NSIS script
 * @param {Object} options - compiler options
 */
var compile = function (script, options) {
    if (options === void 0) { options = null; }
    options || (options = {});
    var args = util_1.getArguments(options);
    if (script) {
        args.push(script);
    }
    return util_1.spawnMakensis(args);
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
    var args = util_1.getArguments(options);
    if (script) {
        args.push(script);
    }
    return util_1.spawnMakensisSync(args);
};
exports.compileSync = compileSync;
/**
 * Returns version of MakeNSIS
 * @returns {string} - compiler version
 */
var version = function () {
    return util_1.spawnMakensis(['-VERSION']);
};
exports.version = version;
/**
 * Returns version of MakeNSIS
 * @returns {string} - compiler version
 */
var versionSync = function () {
    return util_1.spawnMakensisSync(['-VERSION']);
};
exports.versionSync = versionSync;
