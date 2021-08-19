# makensis

[![npm](https://flat.badgen.net/npm/license/makensis)](https://www.npmjs.org/package/makensis)
[![npm](https://flat.badgen.net/npm/v/makensis)](https://www.npmjs.org/package/makensis)
[![CI](https://img.shields.io/github/workflow/status/idleberg/node-makensis/CI?style=flat-square)](https://github.com/idleberg/node-makensis/actions)
[![David](https://flat.badgen.net/david/dep/idleberg/node-makensis)](https://david-dm.org/idleberg/node-makensis)

A Node wrapper for `makensis`, the compiler for NSIS installers. Supports both, native and [Wine][wine].

## Prerequisites

Make sure that NSIS is properly installed. If `makensis` isn't exposed to your PATH [environment variable][envvars], you need to set [`pathToMakensis`](#pathtomakensis).

### Windows

Install NSIS using the [Windows Package Manager][winget] or [Scoop][scoop]:

```powershell
# Windows Package Manager
$ winget install NSIS.NSIS

# Scoop
$ scoop install nsis/nsis
```

Alternatively, you can download the NSIS installer from [SourceForge][sourceforge].

### Linux

Install NSIS from your distribution's default package manager, for example:

```sh
# Debian
$ sudo apt-get install nsis

# Red Hat
$ sudo dnf install nsis
```

### macOS

Install NSIS using [Homebrew][homebrew] or [MacPorts][macports]:

```sh
# Homebrew
$ brew install nsis

# MacPorts
$ port install nsis
```

### Wine

You can setup NSIS in your [Wine][wine] environment, but keep in mind that Wine writes standard streams while executing `makensis`. To disable these debug messages, set the `WINEDEBUG` environment variable to `-all`.

## Installation

`yarn add makensis || npm install makensis`

## Usage

Example usage in script:

```js
import * as NSIS from 'makensis';

const options = {
    verbose: 2,
    define: {
        SPECIAL_BUILD: true
    }
};

// Asynchronous: async/await
try {
    let output = await NSIS.compile('path/to/installer.nsi', options);
    console.log('Compiler output:', output);
} catch (error) {
    console.error(error);
}

// Asynchronous: Promise API
NSIS.compile('path/to/installer.nsi', options)
    .then((output) => {
        console.log('Compiler output:', output);
    })
    .catch((error) => {
        console.error(error);
    });

// Synchronous
let output = NSIS.compile.sync('path/to/installer.nsi', options);
console.log('Compiler output:', output);
```

### API

:warning: Any of the following API methods is asynchronous. To use their synchronous counterpart, append `.sync()` to the method name, e.g. `compile.sync()` instead of `compile()`.

#### commandHelp

Usage: `commandHelp([command], [options], [spawnOptions])`

Returns usage information for a specific command, or a list of all commands. Equivalent of the `-CMDHELP` switch.

#### compile

Usage: `compile(script, [options], [spawnOptions])`

Compiles specified script with MakeNSIS. The script can be omitted in favor of the [`preExecute`](#preExecute) / [`postExecute`](#postExecute) options.

#### headerInfo

Usage: `headerInfo([options], [spawnOptions])`

Returns information about which options were used to compile MakeNSIS. Equivalent of the `-HDRINFO` switch.

#### license

Usage: `license([options], [spawnOptions])`

Returns MakeNSIS software license. Equivalent of the `-LICENSE` switch.

#### nsisDir

Usage: `nsisDir([options], [spawnOptions])`

Returns the path of `${NSISDIR}`.

#### version

Usage: `version([options], [spawnOptions])`

Returns version of MakeNSIS. Equivalent of the `-VERSION` switch.

### Options

:warning: Some of these options are limited to NSIS v3 (see the [changelog][changelog] for details)

#### verbose

Type: `integer`

Verbosity where the value `4=all`, `3=no script`,`2=no info`, `1=no warnings`, `0=none`. Equivalent of the `-V` switch.

#### pause

Type: `boolean`

Pauses after execution. Equivalent of the `-PAUSE` switch.

#### noCD

Type: `boolean`

Disables the current directory change to that of the .nsi file. Equivalent of the `-NOCD` switch.

#### noConfig

Type: `boolean`

Disables inclusion of `<path to makensis.exe>/nsisconf.nsh`. Equivalent of the `-NOCONFIG` switch.

#### priority

Type: `integer`

Sets the compiler process priority, where the value `5=realtime`, `4=high`, `3=above normal`, `2=normal`, `1=below normal`, `0=idle`. Equivalent of the `-P` switch.

:warning: This option is only available on Windows

#### inputCharset

Type: `string`

Specifies the codepage for files without a BOM (`ACP|OEM|CP#|UTF8|UTF16<LE|BE>`). Equivalent of the `-INPUTCHARSET` switch.

#### outputCharset

Type: `string`

Specifies the codepage used by stdout when the output is redirected (`ACP|OEM|CP#|UTF8[SIG]|UTF16<LE|BE>[BOM]`). Equivalent of the `-OUTPUTCHARSET` switch.

:warning: This option is only available on Windows

#### strict

Type: `boolean`

Treat warnings as errors. Equivalent of the `-WX` switch.

#### ppo / safePPO

Type: `boolean`

Will only run the preprocessor and print the result to stdout. The safe version will not execute instructions like [`!appendfile`][!appendfile] or [`!system`][!system]. [`!packhdr`][!packhdr] and [`!finalize`][!finalize] are never executed. Equivalent of the `-PPO / SAFEPPO` switches.

#### define

Type: `Object`

Defines symbols for the script [to value]. Equivalent of the `-D` switch.

<details>
<summary><strong>Example</strong></summary>

```js
define: {
    "SPECIAL_BUILD": true,
    "LANGUAGE": "English"
}
```

</details>

#### preExecute

Type: `string | string[]`

Prepends script-commands to the script, can be passed as array or multiline-string. Equivalent of the `-X` switch when used _before_ passing a script.

<details>
<summary><strong>Example</strong></summary>

```js
preExecute: ['SetCompressor lzma', 'SetCompressorDictSize 16'];
```

</details>

#### postExecute

Type: `string | string[]`

Appends commands to the script, can be passed as array or multiline-script. Equivalent of the `-X` switch when used _after_ passing a script.

<details>
<summary><strong>Example</strong></summary>

```js
postExecute: [`DetailPrint "That's all Folks!"`];
```

</details>

#### wine

Type: `boolean`

Runs `makensis` on [Wine][wine]

#### json

Type: `boolean`

Returns output from `makensis` as an object

#### pathToMakensis

Type: `string`

Specifies a custom path to `makensis`

#### pathToWine

Type: `string`

Specifies a custom path to `wine`, useful when working with `wine32` or [`wine32on64`][wine32on64].

#### rawArguments

Type: `string | string[]`

Specifies raw arguments for `makensis`. For complex quote combinations, consider supplying the arguments as array.

:warning: These will be added to the compiler arguments last and will hence overwrite any of the NSIS options above!

### Events

This module emits three types of events you can hook into using the `on()` and `once()` methods:

#### stdout

Gives access to an object containing the current line, and whether it contains a warning of the path of the outfile.

#### stderr

Gives access to an object containing the current line.

#### exit

Gives access to an object containing the exit code, the full `stdout` and `stderr`, and the number of warnings.

## Related

- [atom-language-nsis][atom-language-nsis] - NSIS package for Atom
- [vscode-nsis][vscode-nsis] - NSIS package for Visual Studio Code

## License

This work is licensed under [The MIT License][the mit license].

[wine]: http://winehq.org/
[envvars]: http://superuser.com/a/284351/195953
[sourceforge]: https://sourceforge.net/p/nsis
[winget]: https://github.com/microsoft/winget-cli
[scoop]: https://github.com/NSIS-Dev/scoop-nsis
[homebrew]: http://brew.sh/
[macports]: https://www.macports.org/
[changelog]: http://nsis.sourceforge.net/Docs
[!appendfile]: https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!appendfile.md
[!finalize]: https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!finalize.md
[!system]: https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!system.md
[!packhdr]: https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!packhdr.md
[!finalize]: https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!finalize.md
[wine32on64]: https://github.com/Gcenx/homebrew-wine
[atom-language-nsis]: https://atom.io/packages/language-nsis
[vscode-nsis]: https://marketplace.visualstudio.com/items?itemName=idleberg.nsis
[the mit license]: https://opensource.org/licenses/MIT
