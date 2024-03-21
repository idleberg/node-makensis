/* eslint-disable */
import { nullDevice, shared } from './shared';
import { platform } from 'node:os';
import { randomUUID as uuid } from 'node:crypto';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as MakeNSIS from '../dist/makensis';
import path from 'node:path';
import which from 'which';

const scriptFile = path.join(process.cwd(), 'tests', 'fixtures', 'env.nsi');

const defaultOptions = {
	define: {
		NULL_DEVICE: nullDevice,
	},
	verbose: 4,
};

// Let's run the tests
test(`MakeNSIS ${shared.version} found in PATH environmental variable`, async () => {
	if (platform() === 'win32') {
		// TODO: investigate why this test fails on Windows
		console.log('Skipping test on Windows');
	} else {
		const actual = await which('makensis');

		assert.is.not(actual, '');
	}
});

test('Load magic environment variable from process', async () => {
	const randomString = uuid();
	process.env['NSIS_APP_MAGIC_ENVIRONMENT_VARIABLE'] = randomString;

	try {
		const { stdout } = await MakeNSIS.compile(scriptFile, {
			...defaultOptions,
			env: true,
		});

		const expected = true;
		const actual = stdout.includes('NSIS_APP_MAGIC_ENVIRONMENT_VARIABLE') && stdout.includes(randomString);

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw Error(stderr);
	}
});

test('Ignore magic environment variable', async () => {
	const randomString = uuid();
	process.env['NSIS_APP_MAGIC_ENVIRONMENT_VARIABLE'] = randomString;

	try {
		const { stdout } = await MakeNSIS.compile(scriptFile, {
			...defaultOptions,
			env: false,
		});

		const expected = true;
		const actual = !stdout.includes(randomString);

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw Error(stderr);
	}
});

test.run();
