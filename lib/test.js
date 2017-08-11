"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var makensis = require("./makensis");
var options = {
    verbose: 2,
    define: {
        'SHOW_WARNING': 'true'
    },
    execute: [
        'OutFile inst.exe'
    ]
};
makensis.compile('/Users/jan/Desktop/_nsis/error.nsi', options)
    .then(function (stdStream) {
    console.log(stdStream);
}).catch(function (stdErr) {
    console.error(stdErr);
});
// makensis.version().then((version) => {
//     console.log(version);
// }).catch((error) => {
//     console.error(error);
// });
// makensis.cmdhelp('OutFile').then((version) => {
//     console.log(version);
// }).catch((error) => {
//     console.error(error);
// }); 
