/* eslint-disable */
import { test } from 'uvu';
import { v4 as uuid } from 'uuid';
import * as assert from 'uvu/assert';
import * as MakeNSIS from '../../dist/makensis.mjs';
import path from 'node:path';

// Temporary workarounds
import { nullDevice } from '../shared.mjs';
const __dirname = path.resolve(path.dirname(''));

const scriptFile = path.join(__dirname, 'tests', 'fixtures', 'env.nsi');
const randomString = uuid();

const defaultOptions = {
	define: {
		NULL_DEVICE: nullDevice,
	},
	verbose: 4,
	wine: true,
};

// Let's run the tests
test('Load magic environment variable from file', async (t) => {
	try {
		const { stdout } = await MakeNSIS.compile(scriptFile, {
			...defaultOptions,
			env: path.join(__dirname, 'tests', 'fixtures', '.env'),
		});

		const expected = true;
		const actual = stdout.includes('dotenv:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
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

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
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

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test.run();
