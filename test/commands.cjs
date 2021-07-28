/* eslint-disable */

// Dependencies
const { existsSync } = require('fs');
const { platform } = require('os');
const { spawnSync } = require('child_process');
const MakeNSIS = require('../dist/makensis.cjs');
const path = require('path');
const test = require('ava');

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
    minimal: path.join(__dirname, 'fixtures', 'utf8.nsi'),
    warning: path.join(__dirname, 'fixtures', 'warnings.nsi'),
};

// Expected values
const commandHelp =
    spawnSync('makensis', ['-CMDHELP']).stdout.toString().trim() ||
    spawnSync('makensis', ['-CMDHELP']).stderr.toString().trim();
const headerInfo = spawnSync('makensis', ['-HDRINFO']).stdout.toString().trim();
const outFile =
    spawnSync('makensis', ['-CMDHELP', 'OutFile']).stdout.toString().trim() ||
    spawnSync('makensis', ['-CMDHELP', 'OutFile']).stderr.toString().trim();
const license = spawnSync('makensis', ['-LICENSE']).stdout.toString().trim();
const version = spawnSync('makensis', ['-VERSION']).stdout.toString().trim();

// Let's run the tests
test(`MakeNSIS ${version} found in PATH environmental variable`, (t) => {
    const which = platform() === 'win32' ? 'where' : 'which';
    const actual = spawnSync(which, ['makensis']).stdout.toString().trim();

    t.not(actual, '');
});

test('Print makensis version', (t) => {
    const expected = version;
    const actual = MakeNSIS.version.sync().stdout;

    t.is(actual, expected);
});

test('Print makensis version as JSON', (t) => {
    let expected = version;
    let actual = MakeNSIS.version.sync({ json: true }).stdout;

    if (expected.startsWith('v')) {
        expected = expected.substr(1);
    }

    actual = JSON.stringify(actual);
    expected = JSON.stringify({ version: expected });

    t.is(actual, expected);
});

test('Print makensis version [async]', async (t) => {
    try {
        const { stdout } = await MakeNSIS.version();

        const expected = version;
        const actual = stdout;

        t.is(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});

test('Print makensis version as JSON [async]', async (t) => {
    try {
        const { stdout } = await MakeNSIS.version({ json: true });

        let expected = version;

        if (expected.startsWith('v')) {
            expected = expected.substr(1);
        }

        expected = JSON.stringify({ version: expected });

        let actual = stdout;
        actual.version = `${actual.version}`;
        actual = JSON.stringify(actual);

        t.is(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});

test('Print makensis license', (t) => {
    let expected = license;
    let actual = MakeNSIS.license.sync().stdout;

    t.is(actual, expected);
});

test('Print makensis license as JSON', (t) => {
    let expected = license;
    let actual = MakeNSIS.license.sync({ json: true }).stdout;

    actual = JSON.stringify(actual);
    expected = JSON.stringify({ license: expected });

    t.is(actual, expected);
});

test('Print makensis license [async]', async (t) => {
    try {
        const { stdout } = await MakeNSIS.license();

        const expected = license;
        const actual = stdout;

        t.is(actual, expected);
    } catch ({ stdout }) {
        // NSIS < 3.03
        t.log('Legacy NSIS');
        const expected = license;
        const actual = stdout;

        t.is(actual, expected);
    }
});

test('Print makensis license as JSON [async]', async (t) => {
    try {
        const { stdout } = await MakeNSIS.license({ json: true });

        let expected = license;
        expected = JSON.stringify({ license: expected });

        let actual = stdout;
        actual.license = `${actual.license}`;
        actual = JSON.stringify(actual);

        t.is(actual, expected);
    } catch ({ stdout }) {
        // NSIS < 3.03
        t.log('Legacy NSIS');
        let expected = license;
        expected = JSON.stringify({ license: expected });

        let actual = stdout;
        actual.license = `${actual.license}`;
        actual = JSON.stringify(actual);

        t.is(actual, expected);
    }
});

test('Print compiler information', (t) => {
    const expected = headerInfo;
    const actual = MakeNSIS.headerInfo.sync().stdout;

    t.is(actual, expected);
});

test('Print compiler information as JSON', (t) => {
    const expected = true;
    const actual = MakeNSIS.headerInfo.sync({ json: true }).stdout
        .defined_symbols.__GLOBAL__;

    t.is(actual, expected);
});

test('Print compiler information [async]', async (t) => {
    try {
        const { stdout } = await MakeNSIS.headerInfo();

        const expected = headerInfo;
        const actual = stdout;

        t.is(actual, expected);
    } catch ({ stdout }) {
        // NSIS < 3.03
        t.log('Legacy NSIS');
        const expected = headerInfo;
        const actual = stdout;

        t.is(actual, expected);
    }
});

test('Print help for all commands', (t) => {
    const expected = commandHelp;
    const actual = MakeNSIS.commandHelp.sync().stdout;

    t.is(actual, expected);
});

test('Print help for all commands [async]', async (t) => {
    return Promise.resolve(MakeNSIS.commandHelp())
        .then((output) => {
            const expected = commandHelp.replace(/\s+/g, '');
            const actual = output.stdout.replace(/\s+/g, '');

            t.is(actual, expected);
        })
        .catch(({ stdout }) => {
            // NSIS < 3.03
            t.log('Legacy NSIS');
            const expected = commandHelp.replace(/\s+/g, '');
            const actual = stdout.replace(/\s+/g, '');

            t.is(actual, expected);
        });
});

test('Print help for OutFile command', (t) => {
    const expected = outFile;
    const actual = MakeNSIS.commandHelp.sync('OutFile').stdout;

    t.is(actual, expected);
});

test('Print help for OutFile command [async]', async (t) => {
    try {
        const { stdout } = await MakeNSIS.commandHelp('OutFile');

        const expected = outFile;
        const actual = stdout;

        t.is(actual, expected);
    } catch ({ stdout }) {
        // NSIS < 3.03
        t.log('Legacy NSIS');
        const expected = outFile;
        const actual = stdout;

        t.is(actual, expected);
    }
});

test('Print help for OutFile command as JSON', (t) => {
    let expected = outFile;
    let actual = MakeNSIS.commandHelp.sync('OutFile', { json: true }).stdout;

    actual = JSON.stringify(actual);
    expected = JSON.stringify({ help: expected });

    t.is(actual, expected);
});

test('Compilation from File', (t) => {
    const expected = 0;
    const actual = MakeNSIS.compile.sync(scriptFile.minimal, {
        define: {
            NULL_DEVICE: nullDevice,
        },
    }).status;

    t.is(actual, expected);
});

test('Compilation from Array', (t) => {
    const expected = 0;
    const actual = MakeNSIS.compile.sync(null, {
        preExecute: defaultScriptArray,
    }).status;

    t.is(actual, expected);
});

test('Compilation from String', (t) => {
    const expected = 0;
    const actual = MakeNSIS.compile.sync(null, {
        preExecute: defaultScriptString,
    }).status;

    t.is(actual, expected);
});

test('Compilation from File [async]', async (t) => {
    try {
        const { status } = await MakeNSIS.compile(scriptFile.minimal, {
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

test('Compilation from Array [async]', async (t) => {
    try {
        const { status } = await MakeNSIS.compile(null, {
            preExecute: defaultScriptString,
        });

        const expected = 0;
        const actual = status;

        t.is(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});

test('Compilation from String [async]', async (t) => {
    try {
        const { status } = await MakeNSIS.compile(null, {
            preExecute: defaultScriptString,
        });

        const expected = 0;
        const actual = status;

        t.is(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});

test('Compilation with warning', (t) => {
    const scriptWithWarning = [...defaultScriptArray, '!warning'];

    const expected = 0;
    const actual = MakeNSIS.compile.sync(null, { preExecute: scriptWithWarning })
        .status;

    t.is(actual, expected);
});

test('Compilation with warning as JSON', (t) => {
    const expected = 1;
    const scriptWithWarning = [...defaultScriptArray, '!warning'];
    const actual = MakeNSIS.compile.sync(null, {
        preExecute: scriptWithWarning,
        json: true,
    }).warnings;

    t.is(actual, expected);
});

test('Compilation with warning [async]', async (t) => {
    const scriptWithWarning = [...defaultScriptArray, '!warning'];

    try {
        const { status } = await MakeNSIS.compile(null, {
            preExecute: scriptWithWarning,
        });

        const expected = 0;
        const actual = status;

        t.is(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});

test('Compilation with warning as JSON [async]', async (t) => {
    const scriptWithWarning = [...defaultScriptArray, '!warning'];

    try {
        const { warnings } = await MakeNSIS.compile(null, {
            preExecute: scriptWithWarning,
            json: true,
        });

        const expected = 1;
        const actual = warnings;

        t.is(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});

test('Compilation with error', (t) => {
    const scriptWithError = [...defaultScriptArray, '!error'];

    const expected = 0;
    const actual = MakeNSIS.compile.sync(null, { preExecute: scriptWithError })
        .status;

    t.not(actual, expected);
});

test('Compilation with raw arguments string', (t) => {
    const expected = '';
    const actual = MakeNSIS.compile.sync(scriptFile.minimal, {
        rawArguments: '-V0',
    }).stdout;

    t.is(actual, expected);
});

test('Compilation with raw arguments string [async]', async (t) => {
    try {
        const { status } = await MakeNSIS.compile(scriptFile.minimal, {
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
        t.fail(stderr);
    }
});

test('Compilation with raw arguments array', (t) => {
    const expected = '';
    const actual = MakeNSIS.compile.sync(scriptFile.minimal, {
        rawArguments: ['-V0'],
    }).stdout;

    t.is(actual, expected);
});

test('Compilation with raw arguments array [async]', async (t) => {
    try {
        const { status } = await MakeNSIS.compile(scriptFile.minimal, {
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

test('Compilation with raw arguments string and warning', (t) => {
    const expected = 1;
    const actual = MakeNSIS.compile.sync(scriptFile.warning, {
        rawArguments: '-WX',
    }).status;

    t.is(actual, expected);
});

test('Compilation with raw arguments string and warning [async]', async (t) => {
    try {
        const { status } = await MakeNSIS.compile(scriptFile.warning, {
            rawArguments: '-WX',
        });

        const expected = 1;
        const actual = status;

        t.is(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});

test('Compilation with error [async]', async (t) => {
    let scriptWithError = [...defaultScriptArray, '!error'];

    try {
        const { status } = await MakeNSIS.compile(null, {
            preExecute: scriptWithError,
        });

        const expected = 0;
        const actual = status;

        t.not(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});

test('Strict compilation with warning', (t) => {
    const scriptWithWarning = [...defaultScriptArray, '!warning'];

    const expected = 0;
    const actual = MakeNSIS.compile.sync(null, {
        preExecute: scriptWithWarning,
        strict: true,
    }).status;

    t.not(actual, expected);
});

test('Strict compilation with warning [async]', async (t) => {
    const scriptWithWarning = [...defaultScriptArray, '!warning'];

    try {
        const { status } = await MakeNSIS.compile(null, {
            preExecute: scriptWithWarning,
            strict: true,
        });

        const expected = 0;
        const actual = status;

        t.not(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});

test('Print ${NSISDIR}', (t) => {
    const nsisDir = MakeNSIS.nsisDir.sync();
    const nsisCfg = path.join(nsisDir, 'Include', 'MUI2.nsh');

    const expected = true;
    const actual = existsSync(nsisCfg);

    t.is(actual, expected);
});

test('Print ${NSISDIR} [async]', async (t) => {
    try {
        const nsisDir = await MakeNSIS.nsisDir();
        const nsisCfg = path.join(nsisDir, 'Include', 'MUI2.nsh');

        const expected = true;
        const actual = existsSync(nsisCfg);

        t.is(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});

test('Print ${NSISDIR} as JSON', (t) => {
    const nsisDir = MakeNSIS.nsisDir.sync({ json: true }).nsisdir;
    const nsisCfg = path.join(nsisDir, 'Include', 'MUI2.nsh');

    const expected = true;
    const actual = existsSync(nsisCfg);

    t.is(actual, expected);
});

test('Print ${NSISDIR} as JSON [async]', async (t) => {
    try {
        const nsisDir = await MakeNSIS.nsisDir({ json: true });
        const nsisCfg = path.join(nsisDir.nsisdir, 'Include', 'MUI2.nsh');

        const expected = true;
        const actual = existsSync(nsisCfg);

        t.is(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});
