/* eslint-disable */
const { spawnSync } = require('child_process');
const MakeNSIS = require('../../dist/makensis.cjs');
const test = require('ava');

const cp = spawnSync('wine', ['makensis', '-VERSION']);
const version = cp.stdout.toString().trim() || cp.stderr.toString().trim();

// Let's run the tests
test('Print makensis version', (t) => {
    const expected = version;
    const actual = MakeNSIS.version.sync({ wine: true }).stdout;

    t.is(actual, expected);
});

test('Print makensis version as JSON', (t) => {
    let expected = version;
    let actual = MakeNSIS.version.sync({ json: true, wine: true }).stdout;

    if (expected.startsWith('v')) {
        expected = expected.substr(1);
    }

    actual = JSON.stringify(actual);
    expected = JSON.stringify({ version: expected });

    t.is(actual, expected);
});

test('Print makensis version [async]', async (t) => {
    try {
        const { stdout } = await MakeNSIS.version({ wine: true });

        const expected = version;
        const actual = stdout;

        t.is(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});

test('Print makensis version as JSON [async]', async (t) => {
    try {
        const { stdout } = await MakeNSIS.version({ json: true, wine: true });

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
