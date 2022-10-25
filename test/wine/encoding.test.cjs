/* eslint-disable */
const { nullDevice } = require('../shared');
const MakeNSIS = require('../../dist/makensis.cjs');
const path = require('path');
const test = require('ava');

// Compiler arguments
const script = {
    // cp850: join(__dirname, 'fixtures', 'cp850.nsi'),
    utf8: path.join(__dirname, '..', 'fixtures', 'utf8.nsi'),
};

const defaultOptions = {
    strict: true,
    define: {
        NULL_DEVICE: nullDevice,
    },
    wine: true
};

// Let's run the tests
test('Compile script with correct charset', (t) => {
    const options = { ...defaultOptions, inputCharset: 'UTF8' };

    const expected = '';
    const actual = MakeNSIS.compile.sync(script['utf8'], options).stderr;

    t.is(actual, expected);
});

test('Compile script with incorrect charset', (t) => {
    const options = { ...defaultOptions, inputCharset: 'UTF16BE' };

    const expected = 0;
    const actual = MakeNSIS.compile.sync(script['utf8'], options).status;

    t.not(actual, expected);
});

test('Compile script with correct charset [async]', async (t) => {
    const options = { ...defaultOptions, inputCharset: 'UTF8' };

    try {
        const { status } = await MakeNSIS.compile(script['utf8'], options);

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
    const options = { ...defaultOptions, inputCharset: 'UTF16BE' };

    try {
        const { status } = MakeNSIS.compile(script['utf8'], options);

        const expected = 0;
        const actual = status;

        t.not(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});