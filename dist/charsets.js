'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.output = exports.input = void 0;
var tslib_1 = require("tslib");
var language_data_1 = require("@nsis/language-data");
var codePages = [];
Object.keys(language_data_1.meta).forEach(function (key) {
    var codePage = language_data_1.meta[key].code_page;
    if (!isNaN(codePage) && !codePages.includes("CP" + codePage)) {
        codePages.push("CP" + codePage);
    }
});
var input = tslib_1.__spreadArrays([
    'ACP'
], codePages, [
    'OEM',
    'UTF8',
    'UTF16BE',
    'UTF16LE'
]);
exports.input = input;
var output = tslib_1.__spreadArrays([
    'ACP'
], codePages, [
    'OEM',
    'UTF16BE',
    'UTF16BEBOM',
    'UTF16LE',
    'UTF16LEBOM',
    'UTF8',
    'UTF8SIG'
]);
exports.output = output;
