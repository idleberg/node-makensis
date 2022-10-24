/* eslint-disable */
import { spawnSync } from 'node:child_process';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as MakeNSIS from '../../dist/makensis.mjs';

const cp = spawnSync('wine', ['makensis', '-LICENSE']);
const license = cp.stdout.toString().trim() || cp.stderr.toString().trim();

// Let's run the tests
test('Print makensis license', async (t) => {
	try {
		const { stdout } = await MakeNSIS.license({ wine: true });

		const expected = license;
		const actual = stdout;

		assert.is(actual, expected);
	} catch ({ stdout }) {
		// NSIS < 3.03
		console.log('Legacy NSIS');
		const expected = license;
		const actual = stdout;

		assert.is(actual, expected);
	}
});

test('Print makensis license as JSON', async (t) => {
	try {
		const { stdout } = await MakeNSIS.license({ json: true, wine: true });

		let expected = license;
		expected = JSON.stringify({ license: expected });

		let actual = stdout;
		actual.license = `${actual.license}`;
		actual = JSON.stringify(actual);

		assert.is(actual, expected);
	} catch ({ stdout }) {
		// NSIS < 3.03
		console.log('Legacy NSIS');
		let expected = license;
		expected = JSON.stringify({ license: expected });

		let actual = stdout;
		actual.license = `${actual.license}`;
		actual = JSON.stringify(actual);

		assert.is(actual, expected);
	}
});

test.run();
