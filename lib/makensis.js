"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
/**
 * Returns usage information for a command, or list all commands
 * @param {string} [command] - an NSIS command
 * @returns {string} - usage description
 */
var cmdhelp = function (command) {
    if (command === void 0) { command = ''; }
    var args = ['-CMDHELP'];
    if (typeof command !== 'undefined' && command !== '') {
        args.push(command);
    }
    return util_1.spawnMakensis(args);
};
exports.cmdhelp = cmdhelp;
/**
 * Compile specified script with MakeNSIS
 * @param {string} script - path to NSIS script
 * @param {Object} options - compiler options
 */
var compile = function (script, options) {
    if (options === void 0) { options = null; }
    options || (options = {});
    var args = [];
    if (Number.isInteger(options.verbose) && options.verbose >= 0 && options.verbose <= 4) {
        args.push('-V' + options.verbose);
    }
    if (options.pause === true) {
        args.push('-PAUSE');
    }
    if (options.nocd === true) {
        args.push('-NOCD');
    }
    if (options.noconfig === true) {
        args.push('-NOCONFIG');
    }
    if (options.strict === true) {
        args.push('-WX');
    }
    if (typeof options.define !== 'undefined') {
        Object.keys(options.define).forEach(function (key) {
            args.push("-D" + key + "=" + options.define[key]);
        });
    }
    if (typeof options.execute !== 'undefined') {
        options.execute.forEach(function (key) {
            args.push("-X" + key);
        });
    }
    args.push(script);
    return util_1.spawnMakensis(args);
};
exports.compile = compile;
/**
 * Returns version of MakeNSIS
 * @returns {string} - compiler version
 */
var version = function () {
    return util_1.spawnMakensis(['-VERSION']);
};
exports.version = version;
