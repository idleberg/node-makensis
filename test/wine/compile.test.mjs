/* eslint-disable */
import { createRequire } from 'node:module';
import * as MakeNSIS from '../../dist/makensis.mjs';
import path from 'node:path';
import test from 'ava';

// Temporary workarounds
const require = createRequire(import.meta.url);
const { defaultScriptArray, defaultScriptString, nullDevice } = require('../shared');
const __dirname = path.resolve(path.dirname(''));

const scriptFile = {
    minimal: path.join(__dirname, 'test', 'fixtures', 'utf8.nsi'),
    warning: path.join(__dirname, 'test', 'fixtures', 'warnings.nsi'),
};

// Let's run the tests
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
