import { randomUUID as uuid } from 'node:crypto';
import path from 'node:path';
import { cwd, env } from 'node:process';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as MakeNSIS from '../../src/makensis.ts';
import type * as Makensis from '../../src/types.ts';
/* eslint-disable */
import { hasMakensis, nullDevice } from '../shared.ts';

// Skipped wholesale when no compiler is present, rather than failing unreadably
const it = hasMakensis ? test : test.skip;

const scriptFile = path.join(cwd(), 'tests', 'fixtures', 'env.nsi');

const defaultOptions: Makensis.CompilerOptions = {
	define: {
		NULL_DEVICE: nullDevice,
	},
	verbose: 4,
};

// A `which('makensis')` test used to sit here, asserting the compiler was on PATH. `hasMakensis`
// already establishes that — by running the binary rather than merely resolving it — and gates
// this whole file on the answer, so the assertion could only ever have held. It was also skipped
// on Windows for reasons nobody recorded. Removing it drops the last use of the `which` package.

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
