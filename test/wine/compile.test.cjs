/* eslint-disable */
const {
    defaultScriptArray,
    defaultScriptString,
    nullDevice,
} = require('../shared');
const MakeNSIS = require('../../dist/makensis.cjs');
const path = require('path');
const test = require('ava');

const scriptFile = {
    minimal: path.join(__dirname, '..', 'fixtures', 'utf8.nsi'),
    warning: path.join(__dirname, '..', 'fixtures', 'warnings.nsi'),
};

// Let's run the tests
test('Compilation from File', (t) => {
    const expected = 0;
    const actual = MakeNSIS.compile.sync(scriptFile.minimal, {
        define: {
            NULL_DEVICE: nullDevice,
        },
        wine: true,
    }).status;

    t.is(actual, expected);
});

test('Compilation from Array', (t) => {
    const expected = 0;
    const actual = MakeNSIS.compile.sync(null, {
        preExecute: defaultScriptArray,
        wine: true,
    }).status;

    t.is(actual, expected);
});

test('Compilation from String', (t) => {
    const expected = 0;
    const actual = MakeNSIS.compile.sync(null, {
        preExecute: defaultScriptString,
        wine: true,
    }).status;

    t.is(actual, expected);
});

test('Compilation from File [async]', async (t) => {
    try {
        const { status } = await MakeNSIS.compile(scriptFile.minimal, {
            define: {
                NULL_DEVICE: nullDevice,
            },
            wine: true,
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
            wine: true,
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
            wine: true,
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
    const actual = MakeNSIS.compile.sync(null, {
        preExecute: scriptWithWarning,
        wine: true,
    }).status;

    t.is(actual, expected);
});

test('Compilation with warning as JSON', (t) => {
    const expected = 1;
    const scriptWithWarning = [...defaultScriptArray, '!warning'];
    const actual = MakeNSIS.compile.sync(null, {
        json: true,
        preExecute: scriptWithWarning,
        wine: true,
    }).warnings;

    t.is(actual, expected);
});

test('Compilation with warning [async]', async (t) => {
    const scriptWithWarning = [...defaultScriptArray, '!warning'];

    try {
        const { status } = await MakeNSIS.compile(null, {
            preExecute: scriptWithWarning,
            wine: true,
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
            json: true,
            preExecute: scriptWithWarning,
            wine: true,
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
    const actual = MakeNSIS.compile.sync(null, {
        preExecute: scriptWithError,
        wine: true,
    }).status;

    t.not(actual, expected);
});

test('Compilation with raw arguments', (t) => {
    const expected = '';
    const actual = MakeNSIS.compile.sync(scriptFile.minimal, {
        rawArguments: ['-V0', '-X"!echo \"EOF\""'],
        wine: true,
    }).stdout;

    t.is(actual, expected);
});

test('Compilation with raw arguments and warning', (t) => {
    const expected = 1;
    const actual = MakeNSIS.compile.sync(scriptFile.warning, {
        rawArguments: ['-WX'],
        wine: true,
    }).status;

    t.is(actual, expected);
});

test('Compilation with raw arguments and warning [async]', async (t) => {
    try {
        const { status } = await MakeNSIS.compile(scriptFile.warning, {
            rawArguments: ['-WX'],
            wine: true,
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
            wine: true,
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
        wine: true,
    }).status;

    t.not(actual, expected);
});

test('Strict compilation with warning [async]', async (t) => {
    const scriptWithWarning = [...defaultScriptArray, '!warning'];

    try {
        const { status } = await MakeNSIS.compile(null, {
            preExecute: scriptWithWarning,
            strict: true,
            wine: true,
        });

        const expected = 0;
        const actual = status;

        t.not(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});
