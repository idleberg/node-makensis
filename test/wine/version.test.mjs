/* eslint-disable */
import { spawnSync } from 'child_process';
import * as MakeNSIS from '../../dist/makensis.mjs';
import test from 'ava';

const cp = spawnSync('wine', ['makensis', '-VERSION']);
const version = cp.stdout.toString().trim() || cp.stderr.toString().trim();

// Let's run the tests
test('Print makensis version', async (t) => {
	try {
		const { stdout } = await MakeNSIS.version({ wine: true });

		const expected = version;
		const actual = stdout;

		t.is(actual, expected);
	} catch ({ stderr }) {
		t.fail(stderr);
	}
});

test('Print makensis version as JSON', async (t) => {
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
