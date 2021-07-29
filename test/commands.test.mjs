/* eslint-disable */
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import * as MakeNSIS from '../dist/makensis.mjs';
import path from 'node:path';
import test from 'ava';
import which from 'which';

// Temporary workarounds
const require = createRequire(import.meta.url);
const { defaultScriptArray, defaultScriptString, nullDevice, shared } = require('./shared');
const __dirname = path.resolve(path.dirname(''));

const scriptFile = {
    minimal: path.join(__dirname, 'test', 'fixtures', 'utf8.nsi'),
    warning: path.join(__dirname, 'test', 'fixtures', 'warnings.nsi'),
};

// Let's run the tests
test(`MakeNSIS ${shared.version} found in PATH environmental variable`, async t => {
    const actual = await which('makensis');

    t.not(actual, '');
});

test('Print makensis version', (t) => {
    const expected = shared.version;
    const actual = MakeNSIS.version.sync().stdout;

    t.is(actual, expected);
});

test('Print makensis version as JSON', (t) => {
    let expected = shared.version;
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

        const expected = shared.version;
        const actual = stdout;

        t.is(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});

test('Print makensis version as JSON [async]', async (t) => {
    try {
        const { stdout } = await MakeNSIS.version({ json: true });

        let expected = shared.version;

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
    let expected = shared.license;
    let actual = MakeNSIS.license.sync().stdout;

    t.is(actual, expected);
});

test('Print makensis license as JSON', (t) => {
    let expected = shared.license;
    let actual = MakeNSIS.license.sync({ json: true }).stdout;

    actual = JSON.stringify(actual);
    expected = JSON.stringify({ license: expected });

    t.is(actual, expected);
});

test('Print makensis license [async]', async (t) => {
    try {
        const { stdout } = await MakeNSIS.license();

        const expected = shared.license;
        const actual = stdout;

        t.is(actual, expected);
    } catch ({ stdout }) {
        // NSIS < 3.03
        t.log('Legacy NSIS');
        const expected = shared.license;
        const actual = stdout;

        t.is(actual, expected);
    }
});

test('Print makensis license as JSON [async]', async (t) => {
    try {
        const { stdout } = await MakeNSIS.license({ json: true });

        let expected = shared.license;
        expected = JSON.stringify({ license: expected });

        let actual = stdout;
        actual.license = `${actual.license}`;
        actual = JSON.stringify(actual);

        t.is(actual, expected);
    } catch ({ stdout }) {
        // NSIS < 3.03
        t.log('Legacy NSIS');
        let expected = shared.license;
        expected = JSON.stringify({ license: expected });

        let actual = stdout;
        actual.license = `${actual.license}`;
        actual = JSON.stringify(actual);

        t.is(actual, expected);
    }
});

test('Print compiler information', (t) => {
    const expected = shared.headerInfo;
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

        const expected = shared.headerInfo;
        const actual = stdout;

        t.is(actual, expected);
    } catch ({ stdout }) {
        // NSIS < 3.03
        t.log('Legacy NSIS');
        const expected = shared.headerInfo;
        const actual = stdout;

        t.is(actual, expected);
    }
});

test('Print compiler information as JSON [async]', async t => {
    try {
        const actual = (await MakeNSIS.headerInfo({ json: true })).stdout
            .defined_symbols.__GLOBAL__;

            const expected = true;

        t.is(actual, expected);
    } catch (error) {
        // NSIS < 3.03
        t.log('Legacy NSIS');
        const expected = true;
        const actual = stdout.defined_symbols.__GLOBAL__;

        t.is(actual, expected);
    }
});

test('Print help for all commands', (t) => {
    const expected = shared.commandHelp;
    const actual = MakeNSIS.commandHelp.sync().stdout;

    t.is(actual, expected);
});

test('Print help for all commands [async]', async t => {
    try {
        const output = await MakeNSIS.commandHelp();

        const expected = shared.commandHelp.replace(/\s+/g, '');
        const actual = output.stdout.replace(/\s+/g, '');

        t.is(actual, expected);
    } catch ({ stdout }) {
        // NSIS < 3.03
        t.log('Legacy NSIS');
        const expected = shared.commandHelp.replace(/\s+/g, '');
        const actual = stdout.replace(/\s+/g, '');

        t.is(actual, expected);
    }
});

test('Print help for OutFile command', (t) => {
    const expected = shared.outFile;
    const actual = MakeNSIS.commandHelp.sync('OutFile').stdout;

    t.is(actual, expected);
});

test('Print help for OutFile command [async]', async (t) => {
    try {
        const { stdout } = await MakeNSIS.commandHelp('OutFile');

        const expected = shared.outFile;
        const actual = stdout;

        t.is(actual, expected);
    } catch ({ stdout }) {
        // NSIS < 3.03
        t.log('Legacy NSIS');
        const expected = shared.outFile;
        const actual = stdout;

        t.is(actual, expected);
    }
});

test('Print help for OutFile command as JSON', (t) => {
    let expected = shared.outFile;
    let actual = MakeNSIS.commandHelp.sync('OutFile', { json: true }).stdout;

    actual = JSON.stringify(actual);
    expected = JSON.stringify({ help: expected });

    t.is(actual, expected);
});

test('Print help for OutFile command as JSON [async]', async t => {
    try {
        let expected = shared.outFile;
        let actual = (await MakeNSIS.commandHelp('OutFile', { json: true })).stdout;

        actual = JSON.stringify(actual);
        expected = JSON.stringify({ help: expected });

        t.is(actual, expected);
    } catch ({ stdout }) {
        // NSIS < 3.03
        t.log('Legacy NSIS');
        const expected = outFile;
        const actual = stdout;

        t.is(actual, expected);
    }
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
