/* eslint-disable */
const { spawnSync } = require('child_process');
const test = require('ava');
const which = require('which');

const cp = spawnSync('wine', ['makensis', '-VERSION']);
const version = cp.stdout.toString().trim() || cp.stderr.toString().trim();

// Let's run the tests
test(`MakeNSIS ${version} found in PATH environmental variable`, async (t) => {
    const actual = await which('makensis');

    t.not(actual, '');
});
