import { randomUUID as uuid } from 'node:crypto';
import { platform } from 'node:os';
import path from 'node:path';
import { cwd, env } from 'node:process';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import which from 'which';
import * as MakeNSIS from '../../src/makensis.ts';
import type * as Makensis from '../../src/types.ts';
/* eslint-disable */
import { hasMakensis, nullDevice, shared } from '../shared.ts';

// Skipped wholesale when no compiler is present, rather than failing unreadably
const it = hasMakensis ? test : test.skip;

const scriptFile = path.join(cwd(), 'tests', 'fixtures', 'env.nsi');

const defaultOptions: Makensis.CompilerOptions = {
	define: {
		NULL_DEVICE: nullDevice,
	},
	verbose: 4,
};

// Let's run the tests
it(`MakeNSIS ${shared.version ?? '(unknown version)'} found in PATH environmental variable`, async () => {
	if (platform() === 'win32') {
		// TODO: investigate why this test fails on Windows
		console.log('Skipping test on Windows');
	} else {
		const actual = await which('makensis');

		assert.is.not(actual, '');
	}
});

it('Load magic environment variable from process', async () => {
	const randomString = uuid();
	env.NSIS_APP_MAGIC_ENVIRONMENT_VARIABLE = randomString;

	const { stdout } = (await MakeNSIS.compile(scriptFile, {
		...defaultOptions,
		env: true,
	})) as { stdout: string };

	const expected = true;
	const actual = stdout.includes('NSIS_APP_MAGIC_ENVIRONMENT_VARIABLE') && stdout.includes(randomString);

	assert.is(actual, expected);
});

it('Ignore magic environment variable', async () => {
	const randomString = uuid();
	env.NSIS_APP_MAGIC_ENVIRONMENT_VARIABLE = randomString;

	const { stdout } = (await MakeNSIS.compile(scriptFile, {
		...defaultOptions,
		env: false,
	})) as { stdout: string };

	const expected = true;
	const actual = !stdout.includes(randomString);

	assert.is(actual, expected);
});

test.run();
