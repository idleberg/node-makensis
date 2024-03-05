/* eslint-disable */
import { nullDevice } from './shared.mjs';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as MakeNSIS from '../dist/makensis.js';
import path from 'node:path';

// Temporary workaround
const __dirname = path.resolve(path.dirname(''));

// Compiler arguments
const script = {
	// cp850: join(__dirname, 'fixtures', 'cp850.nsi'),
	utf8: path.join(__dirname, 'tests', 'fixtures', 'utf8.nsi'),
};

const defaultOptions = {
	strict: true,
	define: {
		NULL_DEVICE: nullDevice,
	},
};

// Let's run the tests
test('Compile script with correct charset', async (t) => {
	const options = { ...defaultOptions, inputCharset: 'UTF8' };

	try {
		const { status } = await MakeNSIS.compile(script['utf8'], options);

		const expected = 0;
		const actual = status;

		assert.is(actual, expected);
	} catch ({ stderr }) {
		// NSIS < 3.03
		console.log('Legacy NSIS', e);

		const expected = '';
		const actual = stderr;

		assert.is(actual, expected);
	}
});

test('Compile script with incorrect charset', async (t) => {
	const options = { ...defaultOptions, inputCharset: 'UTF16BE' };

	try {
		const { status } = MakeNSIS.compile(script['utf8'], options);

		const expected = 0;
		const actual = status;

		assert.is.not(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test.run();
