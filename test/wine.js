/* eslint-disable */

// Dependencies
import * as MakeNSIS from '../dist/makensis.js';
import { spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { platform } from 'os';
import test from 'ava';

// Generate script using compiler flags
const nullDevice = platform() === 'win32' ? 'NUL' : '/dev/null';

const defaultScriptArray = [
    `OutFile ${nullDevice}`,
    `Unicode true`,
    `Section -default`,
    `Nop`,
    `SectionEnd`,
];

const defaultScriptString = defaultScriptArray.join('\n');

const scriptFile = {
    minimal: join(__dirname, 'fixtures', 'utf8.nsi'),
    warning: join(__dirname, 'fixtures', 'warnings.nsi'),
};

// These test require NSIS to be setup properly, with makensis in your
// PATH environmental variable
test('Wine found in PATH environmental variable', (t) => {
    const actual = spawnSync('which', ['wine']).stdout.toString().trim();

    t.not(actual, '');
});

// Expected values
const commandHelp = spawnSync('wine', ['makensis', '-CMDHELP'])
    .stdout.toString()
    .trim()
    .replace(/\r\n/g, '\n');
const headerInfo = spawnSync('wine', ['makensis', '-HDRINFO'])
    .stdout.toString()
    .trim();
const outFile = spawnSync('wine', ['makensis', '-CMDHELP', 'OutFile'])
    .stdout.toString()
    .trim()
    .replace(/\r\n/g, '\n');
const license = spawnSync('wine', ['makensis', '-LICENSE'])
    .stdout.toString()
    .trim();
const version = spawnSync('wine', ['makensis', '-VERSION'])
    .stdout.toString()
    .trim();

test('Print makensis version', (t) => {
    const expected = version;
    const actual = MakeNSIS.versionSync({ wine: true }).stdout;

    t.is(actual, expected);
});

test('Print makensis version as JSON', (t) => {
    let expected = version;
    let actual = MakeNSIS.versionSync({ wine: true, json: true }).stdout;

    if (expected.startsWith('v')) {
        expected = expected.substr(1);
    }

    actual = JSON.stringify(actual);
    expected = JSON.stringify({ version: expected });

    t.is(actual, expected);
});

test('Print makensis version [async]', (t) => {
    return Promise.resolve(MakeNSIS.version({ wine: true }))
        .then((output) => {
            const expected = version;
            const actual = output.stdout;

            t.is(actual, expected);
        })
        .catch((error) => {
            t.fail(error);
        });
});

test('Print makensis version as JSON [async]', (t) => {
    return Promise.resolve(MakeNSIS.version({ wine: true, json: true }))
        .then((output) => {
            let expected = version;

            if (expected.startsWith('v')) {
                expected = expected.substr(1);
            }
            expected = JSON.stringify({ version: expected });

            let actual = output.stdout;
            actual.version = `${actual.version}`;
            actual = JSON.stringify(actual);

            t.is(actual, expected);
        })
        .catch((error) => {
            t.fail(error);
        });
});

test('Print makensis license', (t) => {
    let expected = license;
    let actual = MakeNSIS.licenseSync({ wine: true }).stdout;

    t.is(actual, expected);
});

test('Print makensis license as JSON', (t) => {
    let expected = license;
    let actual = MakeNSIS.licenseSync({ wine: true, json: true }).stdout;

    actual = JSON.stringify(actual);
    expected = JSON.stringify({ license: expected });

    t.is(actual, expected);
});

test('Print makensis license [async]', (t) => {
    return Promise.resolve(MakeNSIS.license({ wine: true }))
        .then((output) => {
            const expected = license;
            const actual = output.stdout;

            t.is(actual, expected);
        })
        .catch((output) => {
            // NSIS < 3.03
            t.log('Legacy NSIS');
            const expected = license;
            const actual = output.stdout;

            t.is(actual, expected);
        });
});

test('Print makensis license as JSON [async]', (t) => {
    return Promise.resolve(MakeNSIS.license({ wine: true, json: true }))
        .then((output) => {
            let expected = license;
            expected = JSON.stringify({ license: expected });

            let actual = output.stdout;
            actual.license = `${actual.license}`;
            actual = JSON.stringify(actual);

            t.is(actual, expected);
        })
        .catch((output) => {
            // NSIS < 3.03
            t.log('Legacy NSIS');
            let expected = license;
            expected = JSON.stringify({ license: expected });

            let actual = output.stdout;
            actual.license = `${actual.license}`;
            actual = JSON.stringify(actual);

            t.is(actual, expected);
        });
});

test('Print compiler information', (t) => {
    const expected = headerInfo;
    const actual = MakeNSIS.headerInfoSync({ wine: true }).stdout;

    t.is(actual, expected);
});

test('Print compiler information as JSON', (t) => {
    const expected = true;
    const actual = MakeNSIS.headerInfoSync({ wine: true, json: true }).stdout
        .defined_symbols.__GLOBAL__;

    t.is(actual, expected);
});

test('Print compiler information [async]', (t) => {
    return Promise.resolve(MakeNSIS.headerInfo({ wine: true }))
        .then((output) => {
            const expected = headerInfo;
            const actual = output.stdout;

            t.is(actual, expected);
        })
        .catch((output) => {
            // NSIS < 3.03
            t.log('Legacy NSIS');
            const expected = headerInfo;
            const actual = output.stdout;

            t.is(actual, expected);
        });
});

test('Print help for all commands', (t) => {
    const expected = commandHelp;
    const actual = MakeNSIS.commandHelpSync({ wine: true }).stdout;

    t.is(actual, expected);
});

test('Print help for all commands [async]', (t) => {
    return Promise.resolve(MakeNSIS.commandHelp({ wine: true }))
        .then((output) => {
            const expected = commandHelp;
            const actual = output.stdout;

            t.is(actual, expected);
        })
        .catch((output) => {
            // NSIS < 3.03
            t.log('Legacy NSIS');
            const expected = commandHelp;
            const actual = output.stdout;

            t.is(actual, expected);
        });
});

test('Print help for OutFile command', (t) => {
    const expected = outFile;
    const actual = MakeNSIS.commandHelpSync('OutFile', { wine: true }).stdout;

    t.is(actual, expected);
});

test('Print help for OutFile command [async]', (t) => {
    return Promise.resolve(MakeNSIS.commandHelp('OutFile', { wine: true }))
        .then((output) => {
            const expected = outFile;
            const actual = output.stdout;

            t.is(actual, expected);
        })
        .catch((output) => {
            // NSIS < 3.03
            t.log('Legacy NSIS');
            const expected = outFile;
            const actual = output.stdout;

            t.is(actual, expected);
        });
});

test('Print help for OutFile command as JSON', (t) => {
    let expected = outFile;
    let actual = MakeNSIS.commandHelpSync('OutFile', { wine: true, json: true })
        .stdout;

    actual = JSON.stringify(actual);
    expected = JSON.stringify({ help: expected });

    t.is(actual, expected);
});

test('Compilation from File', (t) => {
    const expected = 0;
    const actual = MakeNSIS.compileSync(scriptFile.minimal, {
        wine: true,
        define: {
            NULL_DEVICE: nullDevice,
        },
    }).status;

    t.is(actual, expected);
});

test('Compilation from Array', (t) => {
    const expected = 0;
    const actual = MakeNSIS.compileSync(null, {
        wine: true,
        preExecute: defaultScriptArray,
    }).status;

    t.is(actual, expected);
});

test('Compilation from String', (t) => {
    const expected = 0;
    const actual = MakeNSIS.compileSync(null, {
        wine: true,
        preExecute: defaultScriptString,
    }).status;

    t.is(actual, expected);
});

test('Compilation from File [async]', async (t) => {
    try {
        const { status } = await MakeNSIS.compile(scriptFile.minimal, {
            wine: true,
            define: {
                NULL_DEVICE: nullDevice,
            },
        });

        const expected = 0;
        const actual = status;

        t.is(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});

test('Compilation from Array [async]', (t) => {
    return Promise.resolve(
        MakeNSIS.compile(null, { wine: true, preExecute: defaultScriptArray })
    )
        .then((output) => {
            const expected = 0;
            const actual = output.status;

            t.is(actual, expected);
        })
        .catch();
});

test('Compilation from String [async]', (t) => {
    return Promise.resolve(
        MakeNSIS.compile(null, { wine: true, preExecute: defaultScriptString })
    )
        .then((output) => {
            const expected = 0;
            const actual = output.status;

            t.is(actual, expected);
        })
        .catch();
});

test('Compilation with warning', (t) => {
    const scriptWithWarning = defaultScriptArray.concat(['!warning']);

    const expected = 0;
    const actual = MakeNSIS.compileSync(null, {
        wine: true,
        preExecute: scriptWithWarning,
    }).status;

    t.is(actual, expected);
});

test('Compilation with warning as JSON', (t) => {
    const expected = 1;
    const scriptWithWarning = defaultScriptArray.concat(['!warning']);
    const actual = MakeNSIS.compileSync(null, {
        wine: true,
        preExecute: scriptWithWarning,
        json: true,
    }).warnings;

    t.is(actual, expected);
});

test('Compilation with warning [async]', (t) => {
    const scriptWithWarning = defaultScriptArray.concat(['!warning']);

    return Promise.resolve(
        MakeNSIS.compile(null, { wine: true, preExecute: scriptWithWarning })
    )
        .then((output) => {
            const expected = 0;
            const actual = output.status;

            t.is(actual, expected);
        })
        .catch();
});

test('Compilation with warning as JSON [async]', (t) => {
    const scriptWithWarning = defaultScriptArray.concat(['!warning']);

    return Promise.resolve(
        MakeNSIS.compile(null, {
            wine: true,
            preExecute: scriptWithWarning,
            json: true,
        })
    )
        .then((output) => {
            const expected = 1;
            const actual = output.warnings;

            t.is(actual, expected);
        })
        .catch();
});

test('Compilation with error', (t) => {
    const scriptWithError = defaultScriptArray.concat(['!error']);

    const expected = 0;
    const actual = MakeNSIS.compileSync(null, {
        wine: true,
        preExecute: scriptWithError,
    }).status;

    t.not(actual, expected);
});

test('Compilation with error [async]', (t) => {
    let scriptWithError = defaultScriptArray.concat(['!error']);

    return Promise.resolve(
        MakeNSIS.compile(null, { wine: true, preExecute: scriptWithError })
    )
        .then((output) => {
            const expected = 0;
            const actual = output.status;

            t.not(actual, expected);
        })
        .catch((output) => {
            const expected = 0;
            const actual = output.status;

            t.not(actual, expected);
        });
});

test('Compilation with raw arguments strings', (t) => {
    const expected = '';
    const actual = MakeNSIS.compileSync(scriptFile.minimal, {
        wine: true,
        rawArguments: '-V0',
    }).stdout;

    t.is(actual, expected);
});

test('Compilation with raw arguments strings [async]', async (t) => {
    try {
        const { status } = await MakeNSIS.compile(scriptFile.minimal, {
            wine: true,
            rawArguments: '-V0',
            define: {
                NULL_DEVICE: nullDevice,
            },
        });

        const expected = 0;
        const actual = status;

        t.is(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});

test('Compilation with raw arguments array', (t) => {
    const expected = '';
    const actual = MakeNSIS.compileSync(scriptFile.minimal, {
        wine: true,
        rawArguments: ['-V0'],
    }).stdout;

    t.is(actual, expected);
});

test('Compilation with raw arguments array [async]', async (t) => {
    try {
        const { status } = await MakeNSIS.compile(scriptFile.minimal, {
            wine: true,
            rawArguments: ['-V0'],
            define: {
                NULL_DEVICE: nullDevice,
            },
        });

        const expected = 0;
        const actual = status;

        t.is(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});

test('Compilation with raw arguments strings and warning', (t) => {
    const expected = 1;
    const actual = MakeNSIS.compileSync(scriptFile.warning, {
        wine: true,
        rawArguments: '-WX',
    }).status;

    t.is(actual, expected);
});

test('Compilation with raw arguments strings and warning [async]', async (t) => {
    try {
        const { status } = await MakeNSIS.compile(scriptFile.warning, {
            wine: true,
            rawArguments: '-WX',
        });

        const expected = 1;
        const actual = status;

        t.is(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});

test('Compilation with raw arguments array and warning', (t) => {
    const expected = 1;
    const actual = MakeNSIS.compileSync(scriptFile.warning, {
        wine: true,
        rawArguments: ['-WX'],
    }).status;

    t.is(actual, expected);
});

test('Compilation with raw arguments array and warning [async]', async (t) => {
    try {
        const { status } = await MakeNSIS.compile(scriptFile.warning, {
            wine: true,
            rawArguments: ['-WX'],
        });

        const expected = 1;
        const actual = status;

        t.is(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});

test('Strict compilation with warning', (t) => {
    const scriptWithWarning = defaultScriptArray.concat(['!warning']);

    const expected = 0;
    const actual = MakeNSIS.compileSync(null, {
        wine: true,
        preExecute: scriptWithWarning,
        strict: true,
    }).status;

    t.not(actual, expected);
});

test('Strict compilation with warning [async]', (t) => {
    const scriptWithWarning = defaultScriptArray.concat(['!warning']);

    return Promise.resolve(
        MakeNSIS.compile(null, {
            wine: true,
            preExecute: scriptWithWarning,
            strict: true,
        })
    )
        .then((output) => {
            const expected = 0;
            const actual = output.status;

            t.not(actual, expected);
        })
        .catch((output) => {
            const expected = 0;
            const actual = output.status;

            t.not(actual, expected);
        });
});

test('Print ${NSISDIR}', (t) => {
    const nsisDir = MakeNSIS.nsisDirSync({ wine: true });
    let nsisCfg = spawnSync('winepath', [nsisDir]).stdout.toString().trim();
    nsisCfg = join(nsisCfg, 'Include', 'MUI2.nsh');

    const expected = true;
    const actual = existsSync(nsisCfg);

    t.is(actual, expected);
});

test('Print ${NSISDIR} [async]', (t) => {
    return Promise.resolve(MakeNSIS.nsisDir({ wine: true }))
        .then((nsisDir) => {
            let nsisCfg = spawnSync('winepath', [nsisDir])
                .stdout.toString()
                .trim();
            nsisCfg = join(nsisCfg, 'Include', 'MUI2.nsh');

            const expected = true;
            const actual = existsSync(nsisCfg);

            t.is(actual, expected);
        })
        .catch((error) => {
            t.fail(error);
        });
});

test('Print ${NSISDIR} as JSON', (t) => {
    const nsisDir = MakeNSIS.nsisDirSync({ wine: true, json: true }).nsisdir;
    let nsisCfg = spawnSync('winepath', [nsisDir]).stdout.toString().trim();
    nsisCfg = join(nsisCfg, 'Include', 'MUI2.nsh');

    const expected = true;
    const actual = existsSync(nsisCfg);

    t.is(actual, expected);
});

test('Print ${NSISDIR} as JSON [async]', (t) => {
    return Promise.resolve(MakeNSIS.nsisDir({ wine: true, json: true }))
        .then((nsisDir) => {
            let nsisCfg = spawnSync('winepath', [nsisDir.nsisdir])
                .stdout.toString()
                .trim();
            nsisCfg = join(nsisCfg, 'Include', 'MUI2.nsh');

            const expected = true;
            const actual = existsSync(nsisCfg);

            t.is(actual, expected);
        })
        .catch((error) => {
            t.fail(error);
        });
});
