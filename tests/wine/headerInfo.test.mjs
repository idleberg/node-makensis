/* eslint-disable */
import { spawnSync } from 'node:child_process';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as MakeNSIS from '../../dist/makensis.mjs';

const cp = spawnSync('wine', ['makensis', '-HDRINFO']);
const headerInfo = cp.stdout.toString().trim() || cp.stderr.toString().trim();

// Let's run the tests
test('Print compiler information', async (t) => {
	try {
		const { stdout } = await MakeNSIS.headerInfo({ wine: true });

		const expected = headerInfo;
		const actual = stdout;

		assert.is(actual, expected);
	} catch ({ stdout }) {
		// NSIS < 3.03
		console.log('Legacy NSIS');
		const expected = headerInfo;
		const actual = stdout;

		assert.is(actual, expected);
	}
});

test('Print compiler information as JSON', async (t) => {
	try {
		const actual = (await MakeNSIS.headerInfo({ json: true, wine: true })).stdout.defined_symbols.__GLOBAL__;

		const expected = true;

		assert.is(actual, expected);
	} catch (error) {
		// NSIS < 3.03
		console.log('Legacy NSIS');
		const expected = true;
		const actual = stdout.defined_symbols.__GLOBAL__;

		assert.is(actual, expected);
	}
});

test.run();
