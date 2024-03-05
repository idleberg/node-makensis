/* eslint-disable */
import { nullDevice, shared } from './shared.mjs';
import { platform } from 'node:os';
import { test } from 'uvu';
import { v4 as uuid } from 'uuid';
import * as assert from 'uvu/assert';
import * as MakeNSIS from '../dist/makensis.js';
import path from 'node:path';
import which from 'which';

// Temporary workaround
const __dirname = path.resolve(path.dirname(''));

const scriptFile = path.join(__dirname, 'tests', 'fixtures', 'env.nsi');
const randomString = uuid();

const defaultOptions = {
	define: {
		NULL_DEVICE: nullDevice,
	},
	verbose: 4,
};

// Let's run the tests
test(`MakeNSIS ${shared.version} found in PATH environmental variable`, async (t) => {
	if (platform() === 'win32') {
		// TODO: investigate why this test fails on Windows
		console.log('Skipping test on Windows');
	} else {
		const actual = await which('makensis');

		assert.is.not(actual, '');
	}
});

test('Load magic environment variable from file', async (t) => {
	try {
		const { stdout } = await MakeNSIS.compile(scriptFile, {
			...defaultOptions,
			env: path.join(__dirname, 'tests', 'fixtures', '.env'),
		});

		const expected = true;
		const actual = stdout.includes('dotenv:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		t.is(actual, expected);
	} catch ({ stderr }) {
		t.fail(stderr);
	}
});

test('Load magic environment variable from process', async (t) => {
	const uuid = `process.env:${randomString}`;
	process.env['NSIS_APP_MAGIC_ENVIRONMENT_VARIABLE'] = uuid;

	try {
		const { stdout } = await MakeNSIS.compile(scriptFile, {
			...defaultOptions,
			env: true,
		});

		const expected = true;
		const actual = stdout.includes(uuid);

		t.is(actual, expected);
	} catch ({ stderr }) {
		t.fail(stderr);
	}
});

test('Ignore magic environment variable', async (t) => {
	process.env['NSIS_APP_MAGIC_ENVIRONMENT_VARIABLE'] = `process.env:${randomString}`;

	try {
		const { stdout } = await MakeNSIS.compile(scriptFile, {
			...defaultOptions,
			env: false,
		});

		const expected = true;
		const actual = stdout.includes('${NSIS_APP_MAGIC_ENVIRONMENT_VARIABLE}');

		t.is(actual, expected);
	} catch ({ stderr }) {
		t.fail(stderr);
	}
});

test.run();
