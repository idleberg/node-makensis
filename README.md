# makensis

[![npm](https://flat.badgen.net/npm/license/makensis)](https://www.npmjs.org/package/makensis)
[![npm](https://flat.badgen.net/npm/v/makensis)](https://www.npmjs.org/package/makensis)
[![Travis](https://flat.badgen.net/travis/idleberg/node-makensis)](https://travis-ci.org/idleberg/node-makensis)
[![CircleCI](https://flat.badgen.net/circleci/github/idleberg/node-makensis)](https://circleci.com/gh/idleberg/node-makensis)
[![David](https://flat.badgen.net/david/dep/idleberg/node-makensis)](https://david-dm.org/idleberg/node-makensis?)

A Node wrapper for `makensis`, the compiler for NSIS installers. Supports both, native and [Wine](http://winehq.org/).

## Prerequisites

Make sure that NSIS is properly installed with `makensis` in your PATH [environment variable](http://superuser.com/a/284351/195953).

### Windows

Download the NSIS installer from [SourceForge](https://sourceforge.net/p/nsis) and run setup. Once completed, you need to edit your environmental variable manually.

Alternatively, you can install NSIS using the [Scoop](https://github.com/NSIS-Dev/scoop-nsis) package manager:

```sh
$ scoop install nsis/nsis
```

### Linux

Install NSIS from your distribution's default package manager, for example:

```sh
# Debian
$ sudo apt-get -t experimental install nsis

# Red Hat
$ sudo dnf install nsis
```

### macOS

Install NSIS using [Homebrew](http://brew.sh/) or [MacPorts](https://www.macports.org/):

```sh
# Homebrew
$ brew install nsis

# MacPorts
$ port install nsis
```

### Wine

You can setup NSIS in your [Wine](http://winehq.org/) environment, but keep in mind that Wine writes standard streams while executing `makensis`. Additional parsing of the compiler output might be necessary.

## Installation

`yarn add makensis || npm install makensis`

## Usage

Use ES6 imports or `require()` to include the module:

```js
// ECMAScript Import
import * as makensis from 'makensis';

// CommonJS Require
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
};

// Asynchronous: Promise API
makensis.compile('path/to/installer.nsi', options)
.then(output => {
    console.log(`Standard output:\n${output.stdout}`);
})
.catch (output => {
    console.error(`Exit Code ${output.status}: ${output.stderr}`);
});

// Asynchronous: async/await
(async () => {
    try {
        let output = await makensis.compile('path/to/installer.nsi', options);
        console.log(`Standard output:\n${output.stdout}`);
    } catch (output) {
        console.error(`Exit Code ${output.status}: ${output.stderr}`);
    }
})();

// Synchronous
let output = makensis.compileSync('path/to/installer.nsi', options);

if (output.status === 0) {
    console.log(`Standard output:\n${output.stdout}`);
} else {
    console.error(`Exit Code ${output.status}: ${output.stderr}`);
}
```

### Methods

#### cmdHelp

Usage: `cmdHelp([command], [options], [spawnOptions])`

Returns usage information for a specific command, or a list all commands. Equivalent of the `-CMDHELP` switch.

#### cmdHelpSync

Usage: `cmdHelpSync([command], [options], [spawnOptions])`

Returns usage information for a specific command, or a list all commands. Equivalent of the `-CMDHELP` switch.

#### compile

Usage: `compile(script, [options], [spawnOptions])`

Compiles specified script with MakeNSIS. The script can be omitted in favor of [`preExecute`](#preExecute) / [`postExecute`](#postExecute).

#### compileSync

Usage: `compileSync(script, [options], [spawnOptions])`

Compiles specified script with MakeNSIS. The script can be omitted in favor of [`preExecute`](#preExecute) / [`postExecute`](#postExecute).

#### hdrInfo

Usage: `hdrInfo([options], [spawnOptions])`

Returns information about which options were used to compile MakeNSIS. Equivalent of the `-HDRINFO` switch.

#### hdrInfoSync

Usage: `hdrInfoSync([options], [spawnOptions])`

Returns information about which options were used to compile MakeNSIS. Equivalent of the `-HDRINFO` switch.

#### license

Usage: `license([options], [spawnOptions])`

Returns MakeNSIS software license. Equivalent of the `-LICENSE` switch.

#### licenseSync

Usage: `licenseSync([options], [spawnOptions])`

Returns MakeNSIS software license. Equivalent of the `-LICENSE` switch.

#### nsisDir

Usage: `nsisDir([options], [spawnOptions])`

Returns the path of `${NSISDIR}`.

#### nsisDirSync

Usage: `nsisDirSync([options], [spawnOptions])`

Returns the path of `${NSISDIR}`.

#### version

Usage: `version([options], [spawnOptions])`

Returns version of MakeNSIS. Equivalent of the `-VERSION` switch.

#### versionSync

Usage: `versionSync([options], [spawnOptions])`

Returns version of MakeNSIS. Equivalent of the `-VERSION` switch.

### Options

**Note:** Some of these options are limited to NSIS v3 (see the [changelog](http://nsis.sourceforge.net/Docs) for details)

#### verbose

Type: `integer`

Verbosity where x is `4=all`, `3=no script`,`2=no info`, `1=no warnings`, `0=none`. Equivalent of the `-V` switch.

#### pause

Type: `boolean`

Pauses after execution. Equivalent of the `-PAUSE` switch.

#### noCD

Type: `boolean`

Disables the current directory change to that of the .nsi file. Equivalent of the `-NOCD` switch.

Alias: `nocd`

#### noConfig

Type: `boolean`

Disables inclusion of `<path to makensis.exe>/nsisconf.nsh`. Equivalent of the `-NOCONFIG` switch.

Alias: `noconfig`

#### priority

Type: `integer`

Sets the compiler process priority, where x is `5=realtime`, `4=high`, `3=above normal`, `2=normal`, `1=below normal`, `0=idle`.  Equivalent of the `-P` switch.

**Note:** Only available on Windows

#### inputCharset

Type: `string`

allows you to specify a specific codepage for files without a BOM (`ACP|OEM|CP#|UTF8|UTF16<LE|BE>`). Equivalent of the `-INPUTCHARSET` switch.

Alias: `inputcharset`

#### outputCharset

Type: `string`

Allows you to specify the codepage used by stdout when the output is redirected (`ACP|OEM|CP#|UTF8[SIG]|UTF16<LE|BE>[BOM]`). Equivalent of the `-OUTPUTCHARSET` switch.

**Note:** Only available on Windows

Alias: `outputcharset`

#### strict

Type: `boolean`

Treat warnings as errors. Equivalent of the `-WX` switch.

#### ppo / safePPO

Type: `boolean`

Will only run the preprocessor and print the result to stdout. The safe version will not execute instructions like [`!appendfile`](https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!appendfile.md) or [`!system`](https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!system.md). [`!packhdr`](https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!packhdr.md) and [`!finalize`](https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!finalize.md) are never executed. Equivalent of the `-PPO / SAFEPPO` switches.

Aliases: `PPO` / `safeppo`

#### define

Type: `Object`

Defines symbols for the script [to value]. Equivalent of the `-D` switch.

**Example:**

```js
define: {
    "SPECIAL_BUILD": true,
    "LANGUAGE": "English"
}
```

#### preExecute

Type: `Array<string>|string`

Prepends script-commands to the script, can be passed as array or multiline-script. Equivalent of the `-X` switch when used *before* passing a script.

**Example:**

```js
preExecute: [
    "SetCompressor lzma",
    "SetCompressorDictSize 16"
]
```

#### postExecute

Type: `Array<string>|string`

Appends script-commands to the script, can be passed as array or multiline-script. Equivalent of the `-X` switch when used *after* passing a script.

**Example:**

```js
postExecute: [
    `DetailPrint "That's all Folks!"`
]
```

#### wine

Type: `boolean`

Run `makensis` on [Wine](http://winehq.org/)

#### json

Type: `boolean`

Return output from `makensis` as an object

#### pathToMakensis

Type: `string`

Specifies a custom path to `makensis`

## Related

- [atom-language-nsis](https://atom.io/packages/language-nsis) - NSIS package for Atom
- [vscode-nsis](https://marketplace.visualstudio.com/items?itemName=idleberg.nsis) - NSIS package for Visual Studio Code

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)

## Donate

You are welcome to support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/node-makensis) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`
