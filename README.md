# makensis

[![License](https://img.shields.io/github/license/idleberg/node-makensis?style=for-the-badge)](LICENSE)
[![Version: npm](https://img.shields.io/npm/v/makensis?style=for-the-badge)](https://www.npmjs.org/package/makensis)
[![Version: jsr](https://img.shields.io/jsr/v/@idleberg/makensis?style=for-the-badge)](https://jsr.io/@idleberg/makensis)
[![CI: Node](https://img.shields.io/github/actions/workflow/status/idleberg/node-makensis/nodejs.yml?logo=nodedotjs&logoColor=white&style=for-the-badge)](https://github.com/idleberg/node-makensis/actions/workflows/node.yml)
[![CI: Deno](https://img.shields.io/github/actions/workflow/status/idleberg/node-makensis/deno.yml?logo=deno&logoColor=white&style=for-the-badge)](https://github.com/idleberg/node-makensis/actions/workflows/deno.yml)

A TypeScript wrapper for `makensis`, the compiler for NSIS installers.

## Prerequisites

Make sure that NSIS 3.06 (or later) is installed. If `makensis` isn't exposed to your `PATH` [environment variable][envvars], you need to set [`pathToMakensis`](#pathtomakensis).

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

# Arch Linux
$ pacman -S nsis
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

<details>
<summary><strong>Nix</strong></summary>

Open a [Nix][nix] shell with NSIS installed:

```sh
$ nix-shell -p nsis
```

</details>

## Installation

```sh
# NodeJS
npm install makensis

# Deno
deno add jsr:@idleberg/makensis
```

> [!WARNING]  
> If you need to support a version of NSIS older than 3.06, you can use `makensis@2` as it employs some useful workarounds.

## Usage

Example usage in script:

```js
import * as NSIS from "makensis";

const options = {
    verbose: 2,
    define: {
        SPECIAL_BUILD: true,
    },
};

try {
    const output = await NSIS.compile("path/to/installer.nsi", options);
    console.log("Compiler output:", output);
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

Type: `boolean`

Enables support for special environment variables, that will be passed on to the script as definitions.

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

#### inputCharset

Type: `string`

Specifies the codepage for files without a BOM (`ACP|OEM|CP#|UTF8|UTF16<LE|BE>`). Equivalent of the `-INPUTCHARSET` switch.

#### outputCharset

> [!WARNING]  
> This option is only available on Windows.

Type: `string`

Specifies the codepage used by stdout when the output is redirected (`ACP|OEM|CP#|UTF8[SIG]|UTF16<LE|BE>[BOM]`). Equivalent of the `-OUTPUTCHARSET` switch.

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

> [!WARNING]  
> This option is only available on Windows.

Type: `integer`

Sets the compiler process priority, where the value `5=realtime`, `4=high`, `3=above normal`, `2=normal`, `1=below normal`, `0=idle`. Equivalent of the `-P` switch.

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
preExecute: ["SetCompressor lzma", "SetCompressorDictSize 16"];
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

> [!IMPORTANT]  
> These will be added to the compiler arguments last and will hence overwrite any of the NSIS options above!

#### verbose

Type: `integer`

Verbosity where the value `4=all`, `3=no script`,`2=no info`, `1=no warnings`, `0=none`. Equivalent of the `-V` switch.

### Callbacks

#### onData

Gives access to an object containing the current line, and whether it contains a warning of the path of the outfile.

#### onError

Gives access to an object containing the current line.

#### onExit

Gives access to an object containing the exit code, the full `stdout` and `stderr`, and the number of warnings.

## Related

-   [atom-language-nsis][atom-language-nsis] - NSIS package for Atom/Pulsar
-   [vscode-nsis][vscode-nsis] - NSIS package for Visual Studio Code

## License

This work is licensed under [The MIT License][the mit license].

[!appendfile]: https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!appendfile.md
[!finalize]: https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!finalize.md
[!finalize]: https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!finalize.md
[!packhdr]: https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!packhdr.md
[!system]: https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!system.md
[atom-language-nsis]: https://atom.io/packages/language-nsis
[changelog]: http://nsis.sourceforge.net/Docs
[envvars]: http://superuser.com/a/284351/195953
[homebrew]: http://brew.sh/
[macports]: https://www.macports.org/
[nix]: https://nixos.org/
[scoop]: https://github.com/NSIS-Dev/scoop-nsis
[sourceforge]: https://sourceforge.net/p/nsis
[the mit license]: https://opensource.org/licenses/MIT
[vscode-nsis]: https://marketplace.visualstudio.com/items?itemName=idleberg.nsis
[winget]: https://github.com/microsoft/winget-cli
