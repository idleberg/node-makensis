"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var language_data_1 = require("@nsis/language-data");
var codePages = [];
Object.keys(language_data_1.meta).forEach(function (key, index) {
    var codePage = language_data_1.meta[key].code_page;
    if (!isNaN(codePage) && !codePages.includes("CP" + codePage)) {
        codePages.push("CP" + codePage);
    }
});
var input = __spreadArrays([
    'ACP'
], codePages, [
    'OEM',
    'UTF8',
    'UTF16BE',
    'UTF16LE'
]);
exports.input = input;
var output = __spreadArrays([
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
