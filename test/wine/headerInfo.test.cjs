/* eslint-disable */
const { spawnSync } = require('child_process');
const MakeNSIS = require('../../dist/makensis.cjs');
const test = require('ava');

const cp = spawnSync('wine', ['makensis', '-HDRINFO']);
const headerInfo  = cp.stdout.toString().trim() || cp.stderr.toString().trim();

// Let's run the tests
test('Print compiler information', t => {
    const expected = headerInfo;
    const actual = MakeNSIS.headerInfo.sync({ wine: true }).stdout;

    t.is(actual, expected);
});

test('Print compiler information as JSON', t => {
    const expected = true;
    const actual = MakeNSIS.headerInfo.sync({ json: true, wine: true }).stdout
        .defined_symbols.__GLOBAL__;

    t.is(actual, expected);
});

test('Print compiler information [async]', async t => {
    try {
        const { stdout } = await MakeNSIS.headerInfo({ wine: true });

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

test('Print compiler information as JSON [async]', async t => {
    try {
        const actual = (await MakeNSIS.headerInfo({ json: true, wine: true })).stdout
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