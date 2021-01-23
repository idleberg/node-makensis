/* eslint-disable */

// Dependencies
import { compileSync, compile } from '../dist/makensis';
import { join } from 'path';
import { platform } from 'os';
import test from 'ava';

// Compiler arguments
const script = {
    // cp850: join(__dirname, 'fixtures', 'cp850.nsi'),
    utf8: join(__dirname, 'fixtures', 'utf8.nsi'),
};
const nullDevice = platform() === 'win32' ? 'NUL' : '/dev/null';
let options = {
    strict: true,
    define: {
        NULL_DEVICE: nullDevice,
    },
};

// Let's run the tests
test('Compile script with correct charset', (t) => {
    options = { ...options, inputCharset: 'UTF8' };

    const expected = '';
    const actual = compileSync(script['utf8'], options).stderr;

    t.is(actual, expected);
});

test('Compile script with incorrect charset', (t) => {
    options = { ...options, inputCharset: 'UTF16BE' };

    const expected = 0;
    const actual = compileSync(script['utf8'], options).status;

    t.not(actual, expected);
});

test('Compile script with correct charset [async]', async (t) => {
    options = { ...options, inputCharset: 'UTF8' };

    try {
        const { status } = await compile(script['utf8'], options);

        const expected = 0;
        const actual = status;

        t.is(actual, expected);
    } catch ({ stderr }) {
        // NSIS < 3.03
        t.log('Legacy NSIS');

        const expected = '';
        const actual = stderr;

        t.is(actual, expected);
    }
});

test('Compile script with incorrect charset [async]', async (t) => {
    options = { ...options, inputCharset: 'UTF16BE' };

    try {
        const { status } = compile(script['utf8'], options);

        const expected = 0;
        const actual = status;

        t.not(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});
