/* eslint-disable */
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { test } from 'uvu';
import { win32 as path } from 'node:path';
import * as assert from 'uvu/assert';
import * as MakeNSIS from '../../dist/makensis.mjs';

function winePath(filePath) {
	return spawnSync('winepath', [path.normalize(filePath)])
		.stdout.toString()
		.trim();
}

// Let's run the tests

test('Print ${NSISDIR}', async (t) => {
	try {
		const nsisDir = await MakeNSIS.nsisDir({ wine: true });
		const nsisCfg = path.join(nsisDir, 'Include', 'MUI2.nsh');

		const expected = true;
		const actual = existsSync(winePath(nsisCfg));

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test('Print ${NSISDIR} as JSON', async (t) => {
	try {
		const nsisDir = await MakeNSIS.nsisDir({ json: true, wine: true });
		const nsisCfg = path.join(nsisDir.nsisdir, 'Include', 'MUI2.nsh');

		const expected = true;
		const actual = existsSync(winePath(nsisCfg));

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test.run();
