# makensis

[![License](https://img.shields.io/github/license/idleberg/node-makensis?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/github/v/release/idleberg/node-makensis?style=for-the-badge)](https://github.com/idleberg/node-makensis/releases)
![NodeJS version](https://img.shields.io/node/v/makensis?style=for-the-badge)
[![CI](https://img.shields.io/github/actions/workflow/status/idleberg/node-makensis/default.yml?style=for-the-badge)](https://github.com/idleberg/node-makensis/actions)

A Node wrapper for `makensis`, the compiler for NSIS installers. Supports both, native and [Wine][wine].

## Prerequisites

Make sure that NSIS is properly installed. If `makensis` isn't exposed to your PATH [environment variable][envvars], you need to set [`pathToMakensis`](#pathtomakensis).

<details>
<summary><strong>Windows</strong></summary>

Install NSIS using the [Windows Package Manager][winget] or [Scoop][scoop]:

```powershell
# Windows Package Manager
$ winget install NSIS.NSIS

# Scoop
$ scoop install nsis/nsis
```

Alternatively, you can download the NSIS installer from [SourceForge][sourceforge].

</details>

<details>
<summary><strong>Linux</strong></summary>

Install NSIS from your distribution's default package manager, for example:

```sh
# Debian
$ sudo apt-get install nsis

# Red Hat
$ sudo dnf install nsis
```

</details>

<details>
<summary><strong>macOS</strong></summary>

Install NSIS using [Homebrew][homebrew] or [MacPorts][macports]:

```sh
# Homebrew
$ brew install nsis

# MacPorts
$ port install nsis
```

</details>

## Installation

`npm install makensis`

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

try {
	let output = await NSIS.compile('path/to/installer.nsi', options);
	console.log('Compiler output:', output);
} catch (error) {
	console.error(error);
}
```

### API

#### commandHelp

Usage: `commandHelp(command?, options?, spawnOptions?)`

Returns usage information for a specific command, or a list of all commands. Equivalent of the `-CMDHELP` switch.

#### compile

Usage: `compile(script, options?, spawnOptions?)`

Compiles specified script with MakeNSIS. The script can be omitted in favor of the [`preExecute`](#preExecute) / [`postExecute`](#postExecute) options.

#### headerInfo

Usage: `headerInfo(options?, spawnOptions?)`

Returns information about which options were used to compile MakeNSIS. Equivalent of the `-HDRINFO` switch.

#### license

Usage: `license(options?, spawnOptions?)`

Returns MakeNSIS software license. Equivalent of the `-LICENSE` switch.

#### nsisDir

Usage: `nsisDir(options?, spawnOptions?)`

Returns the path of `${NSISDIR}`.

#### version

Usage: `version(options?, spawnOptions?)`

Returns version of MakeNSIS. Equivalent of the `-VERSION` switch.

### Options

:warning: Some of these options are limited to NSIS v3 (see the [changelog][changelog] for details)

#### define

Type: `Object`

Defines symbols for the script [to value]. Equivalent of the `-D` switch.

<details>
<summary><strong>Example</strong></summary>

```js
define: {
	SPECIAL_BUILD: true,
	LANGUAGE: "English"
}
```

</details>

#### env

Type: `boolean | string`

Enables support for special environment variables, that will be passed on to the script as definitions. Can be a path containing `.env` files or a specific file.

<details>
<summary><strong>Example</strong></summary>

```env
# .env
NSIS_APP_ENVIRONMENT=development
```

```nsis
# installer.nsi
!if ${NSIS_APP_ENVIRONMENT} == "development"
	DetailPrint "Valuable Debug Information"
!endif
```

</details>

#### events

Type: `boolean`

Allows dispatching the log events `stdout`, `stderr` and `exit`.

#### inputCharset

Type: `string`

Specifies the codepage for files without a BOM (`ACP|OEM|CP#|UTF8|UTF16<LE|BE>`). Equivalent of the `-INPUTCHARSET` switch.

#### outputCharset

Type: `string`

Specifies the codepage used by stdout when the output is redirected (`ACP|OEM|CP#|UTF8[SIG]|UTF16<LE|BE>[BOM]`). Equivalent of the `-OUTPUTCHARSET` switch.

:warning: This option is only available on Windows

#### json

Type: `boolean`

Returns output from `makensis` as an object

#### noCD

Type: `boolean`

Disables the current directory change to that of the .nsi file. Equivalent of the `-NOCD` switch.

#### noConfig

Type: `boolean`

Disables inclusion of `<path to makensis.exe>/nsisconf.nsh`. Equivalent of the `-NOCONFIG` switch.

#### pathToMakensis

Type: `string`

Specifies a custom path to `makensis`

#### pause

Type: `boolean`

Pauses after execution. Equivalent of the `-PAUSE` switch.

#### priority

Type: `integer`

Sets the compiler process priority, where the value `5=realtime`, `4=high`, `3=above normal`, `2=normal`, `1=below normal`, `0=idle`. Equivalent of the `-P` switch.

:warning: This option is only available on Windows

#### strict

Type: `boolean`

Treat warnings as errors. Equivalent of the `-WX` switch.

#### ppo / safePPO

Type: `boolean`

Will only run the preprocessor and print the result to stdout. The safe version will not execute instructions like [`!appendfile`][!appendfile] or [`!system`][!system]. [`!packhdr`][!packhdr] and [`!finalize`][!finalize] are never executed. Equivalent of the `-PPO / SAFEPPO` switches.

#### preExecute

Type: `string | string[]`

Prepends script-commands to the script, can be passed as array or multiline-string. Equivalent of the `-X` switch when used _before_ passing a script.

<details>
<summary><strong>Example</strong></summary>

```js
preExecute: [
	'SetCompressor lzma',
	'SetCompressorDictSize 16'
];
```

</details>

#### postExecute

Type: `string | string[]`

Appends commands to the script, can be passed as array or multiline-script. Equivalent of the `-X` switch when used _after_ passing a script.

<details>
<summary><strong>Example</strong></summary>

```js
postExecute: [`!echo "That's all Folks!"`];
```

</details>

#### rawArguments

Type: `string[]`

Specifies raw arguments for `makensis`.

:warning: These will be added to the compiler arguments last and will hence overwrite any of the NSIS options above!

#### verbose

Type: `integer`

Verbosity where the value `4=all`, `3=no script`,`2=no info`, `1=no warnings`, `0=none`. Equivalent of the `-V` switch.

#### Wine Options

Environmental variables allow for Wine to be configured by the user. These can be specified using the `spawnOptions.env` property. See the [documentation][wine-env] for details.

On top of that, the following options for Wine are available.

##### wine

Type: `boolean`

Runs `makensis` on [Wine][wine]

##### pathToWine

Type: `string`

Specifies a custom path to `wine`, useful when working with `wine32` or [`wine32on64`][wine32on64].

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
[wine-env]: https://wiki.winehq.org/Wine_User%27s_Guide#Environment_variables
[atom-language-nsis]: https://atom.io/packages/language-nsis
[vscode-nsis]: https://marketplace.visualstudio.com/items?itemName=idleberg.nsis
[the mit license]: https://opensource.org/licenses/MIT
