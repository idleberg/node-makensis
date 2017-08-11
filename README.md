# makensis

[![npm](https://img.shields.io/npm/l/makensis.svg?style=flat-square)](https://www.npmjs.org/package/makensis)
[![npm](https://img.shields.io/npm/v/makensis.svg?style=flat-square)](https://www.npmjs.org/package/makensis)
[![Travis](https://img.shields.io/travis/idleberg/node-makensis.svg?style=flat-square)](https://travis-ci.org/idleberg/node-makensis)
[![David](https://img.shields.io/david/idleberg/node-makensis.svg?style=flat-square)](https://david-dm.org/idleberg/node-makensis)
[![David](https://img.shields.io/david/dev/idleberg/node-makensis.svg?style=flat-square)](https://david-dm.org/idleberg/node-makensis?type=dev)

A Node wrapper for `makensis`, the NSIS compiler

## Installation

`npm install -g -makensis`

## Usage

```js
import * as makensis from 'makensis';
const options = {
    verbose: 2,
    define: {
        'SPECIAL_BUILD': true
    }
}

makensis.compile('/path/to/installer.nsi', options)
}).catch((err) => {
    console.error(err);
});
```

### Methods

`compile(script, [options])`

Compile specified script with MakeNSIS

`version()`

Returns version of MakeNSIS

`cmdhelp([command])`

Returns usage information for a specific command, or a list all commands

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/node-makensis) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`