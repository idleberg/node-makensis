/* eslint-disable */
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as MakeNSIS from '../../dist/makensis.mjs';
import path from 'node:path';

// Temporary workarounds
import { defaultScriptArray, defaultScriptString, nullDevice } from '../shared.mjs';
const __dirname = path.resolve(path.dirname(''));

const scriptFile = {
	minimal: path.join(__dirname, 'tests', 'fixtures', 'utf8.nsi'),
	warning: path.join(__dirname, 'tests', 'fixtures', 'warnings.nsi'),
};

// Let's run the tests
test('Compilation from File', async (t) => {
	try {
		const { status } = await MakeNSIS.compile(scriptFile.minimal, {
			define: {
				NULL_DEVICE: nullDevice,
			},
			wine: true,
		});

		const expected = 0;
		const actual = status;

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test('Compilation from Array', async (t) => {
	try {
		const { status } = await MakeNSIS.compile(null, {
			preExecute: defaultScriptString,
			wine: true,
		});

		const expected = 0;
		const actual = status;

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test('Compilation from String', async (t) => {
	try {
		const { status } = await MakeNSIS.compile(null, {
			preExecute: defaultScriptString,
			wine: true,
		});

		const expected = 0;
		const actual = status;

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test('Compilation with warning', async (t) => {
	const scriptWithWarning = [...defaultScriptArray, '!warning'];

	try {
		const { status } = await MakeNSIS.compile(null, {
			preExecute: scriptWithWarning,
			wine: true,
		});

		const expected = 0;
		const actual = status;

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test('Compilation with warning as JSON', async (t) => {
	const scriptWithWarning = [...defaultScriptArray, '!warning'];

	try {
		const { warnings } = await MakeNSIS.compile(null, {
			json: true,
			preExecute: scriptWithWarning,
			wine: true,
		});

		const expected = 1;
		const actual = warnings;

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test('Compilation with raw arguments and warning', async (t) => {
	try {
		const { status } = await MakeNSIS.compile(scriptFile.warning, {
			rawArguments: ['-WX'],
			wine: true,
		});

		const expected = 1;
		const actual = status;

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test('Compilation with error', async (t) => {
	let scriptWithError = [...defaultScriptArray, '!error'];

	try {
		const { status } = await MakeNSIS.compile(null, {
			preExecute: scriptWithError,
			wine: true,
		});

		const expected = 0;
		const actual = status;

		assert.is.not(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test('Strict compilation with warning', async (t) => {
	const scriptWithWarning = [...defaultScriptArray, '!warning'];

	try {
		const { status } = await MakeNSIS.compile(null, {
			preExecute: scriptWithWarning,
			strict: true,
			wine: true,
		});

		const expected = 0;
		const actual = status;

		assert.is.not(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test.run();
