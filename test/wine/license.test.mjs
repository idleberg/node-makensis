/* eslint-disable */
import { spawnSync } from 'node:child_process';
import * as MakeNSIS from '../../dist/makensis.mjs';
import test from 'ava';

const cp = spawnSync('wine', ['makensis', '-LICENSE']);
const license = cp.stdout.toString().trim() || cp.stderr.toString().trim();

// Let's run the tests
test('Print makensis license', async (t) => {
	try {
		const { stdout } = await MakeNSIS.license({ wine: true });

		const expected = license;
		const actual = stdout;

		t.is(actual, expected);
	} catch ({ stdout }) {
		// NSIS < 3.03
		t.log('Legacy NSIS');
		const expected = license;
		const actual = stdout;

		t.is(actual, expected);
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

		t.is(actual, expected);
	} catch ({ stdout }) {
		// NSIS < 3.03
		t.log('Legacy NSIS');
		let expected = license;
		expected = JSON.stringify({ license: expected });

		let actual = stdout;
		actual.license = `${actual.license}`;
		actual = JSON.stringify(actual);

		t.is(actual, expected);
	}
});
