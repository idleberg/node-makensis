# makensis

[![npm](https://img.shields.io/npm/l/makensis.svg?style=flat-square)](https://www.npmjs.org/package/makensis)
[![npm](https://img.shields.io/npm/v/makensis.svg?style=flat-square)](https://www.npmjs.org/package/makensis)
[![Travis](https://img.shields.io/travis/idleberg/node-makensis.svg?style=flat-square)](https://travis-ci.org/idleberg/node-makensis)
[![David](https://img.shields.io/david/dev/idleberg/node-makensis.svg?style=flat-square)](https://david-dm.org/idleberg/node-makensis?type=dev)

A Node wrapper for `makensis`, the compiler for NSIS installers. Supports both, native compilers and [Wine](http://winehq.org/).

## Prerequisites

Make sure that NSIS is properly installed with `makensis` in your PATH [environmental variable](http://superuser.com/a/284351/195953).

On non-Windows platforms, you can usually install NSIS with your package manager:

```sh
# Debian
sudo apt-get install nsis

# Red Hat
sudo dnf install nsis

# Homebrew
brew install nsis

# MacPorts
port install nsis
```

Alternatively, you can setup NSIS in your [Wine](http://winehq.org/) environment. Keep in mind that Wine writes standard streams while running `makensis`, so additional parsing of the compiler output might be necessary.

## Installation

`yarn add makensis || npm install makensis`

## Usage

Use ES6 imports or `require()` to include the module:

```js
// ECMAScript Import
import * as makensis from 'makensis';

// Node Require
const makensis = require('makensis');
```

Example usage in script:

```js
import * as makensis from 'makensis';

const options = {
    verbose: 2,
    define: {
        'SPECIAL_BUILD': true
    }
}

// Asynchronous
makensis.compile('/path/to/installer.nsi', options)
.then(output => {
    console.log('Standard output:\n' + output.stdout);
}).catch(output => {
    console.error(`Exit Code ${output.status}: ${output.stderr}`);
});

// Synchronous
let output = makensis.compileSync('/path/to/installer.nsi', options);

if (output.status === 0) {
    console.log('Standard output:\n' + output.stdout);
} else {
    console.error(`Exit Code ${output.status}: ${output.stderr}`);
}
```

### Methods

#### compile

Usage: `compile(script, [options])`

Compiles specified script with MakeNSIS. The script can be omitted in favor of [`execute`](#execute).

#### compileSync

Usage: `compileSync(script, [options])`

Compiles specified script with MakeNSIS. The script can be omitted in favor of [`execute`](#execute).

#### version

Usage: `version([options])`

Returns version of MakeNSIS. Equivalent of the `-VERSION` switch.

#### versionSync

Usage: `versionSync([options])`

Returns version of MakeNSIS. Equivalent of the `-VERSION` switch.

#### hdrInfo

Usage: `hdrInfo([options])`

Returns information about which options were used to compile MakeNSIS. Equivalent of the `-HDRINFO` switch.

#### hdrInfoSync

Usage: `hdrInfoSync([options])`

Returns information about which options were used to compile MakeNSIS. Equivalent of the `-HDRINFO` switch.

#### cmdHelp

Usage: `cmdHelp([command], [options])`

Returns usage information for a specific command, or a list all commands. Equivalent of the `-CMDHELP` switch.

#### cmdHelpSync

Usage: `cmdHelpSync([command], [options])`

Returns usage information for a specific command, or a list all commands. Equivalent of the `-CMDHELP` switch.

### Options

#### MakeNSIS

**Note:** Some of these options are limited to NSIS v3 (see the [changelog](http://nsis.sourceforge.net/Docs) for details)

##### verbose

Type: `integer`

Verbosity where x is 4=all,3=no script,2=no info,1=no warnings,0=none. Equivalent of the `-V` switch.

##### pause

Type: `boolean`

Pauses after execution. Equivalent of the `-PAUSE` switch.

##### noCD

Type: `boolean`

Disables the current directory change to that of the .nsi file. Equivalent of the `-NOCD` switch.

Alias: `nocd`

##### noConfig

Type: `boolean`

Disables inclusion of `<path to makensis.exe>/nsisconf.nsh`. Equivalent of the `-NOCONFIG` switch.

Alias: `noconfig`

##### inputCharset

Type: `string`

allows you to specify a specific codepage for files without a BOM (`ACP|OEM|CP#|UTF8|UTF16<LE|BE>`). Equivalent of the `-INPUTCHARSET` switch.

Alias: `inputcharset`

##### outputCharset

Type: `string`

Allows you to specify the codepage used by stdout when the output is redirected (`ACP|OEM|CP#|UTF8[SIG]|UTF16<LE|BE>[BOM]`). Equivalent of the `-OUTPUTCHARSET` switch.

Alias: `outputcharset`

##### strict

Type: `boolean`

Treat warnings as errors. Equivalent of the `-WX` switch.

##### ppo / safePPO

Type: `boolean`

Will only run the preprocessor and print the result to stdout. The safe version will not execute instructions like [`!appendfile`](https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!appendfile.md) or [`!system`](https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!system.md). [`!packhdr`](https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!packhdr.md) and [`!finalize`](https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!finalize.md) are never executed. Equivalent of the `-PPO / SAFEPPO` switches.

Alias: `PPO` / `safeppo`

##### define

Type: `Object`

Defines symbols for the script [to value]. Equivalent of the `-D` switch.

**Example:**

```js
define: {
    "SPECIAL_BUILD": true,
    "LANGUAGE": "English"
}
```

##### execute

Type: `Array`

Executes script-commands in the script, parameters are processed by order. Equivalent of the `-X` switch

**Example:**

```js
execute: [
    "SetCompressor lzma",
    "SetCompressorDictSize 16"
]
```

##### wine

Type: `boolean`

Run `makensis` on [Wine](http://winehq.org/)

#### Spawn

##### cwd

Type: `string`

Current working directory of the child process

##### detached

Type: `boolean`

Prepare child to run independently of its parent process. Specific behavior depends on the platform, see [`options.detached`](https://nodejs.org/api/child_process.html#child_process_options_detached).

##### shell

Type: `boolean|string`

If true, runs command inside of a shell. Uses `/bin/sh` on UNIX, and `process.env.ComSpec` on Windows. A different shell can be specified as a string. See [Shell Requirements](https://nodejs.org/api/child_process.html#child_process_shell_requirements) and [Default Windows Shell](https://nodejs.org/api/child_process.html#child_process_default_windows_shell).

#### Other

##### json

Type: `boolean`

Return output from `makensis` as an object

##### pathToMakensis

Type: `string`

Specifies a custom path to `makensis`

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/node-makensis) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`
