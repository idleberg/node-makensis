/* eslint-disable */
const { shared } = require('./shared');
const test = require('ava');
const which = require('which');

// Let's run the tests
test(`MakeNSIS ${shared.version} found in PATH environmental variable`, async t => {
    const actual = await which('makensis');

    t.not(actual, '');
});