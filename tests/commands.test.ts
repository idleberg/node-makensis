import { existsSync } from 'node:fs';
import path from 'node:path';
import { cwd } from 'node:process';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as MakeNSIS from '../src/makensis';
import type Makensis from '../types';
/* eslint-disable */
import { defaultScriptArray, defaultScriptString, nullDevice, shared } from './shared';

const scriptFile = {
	minimal: path.join(cwd(), 'tests', 'fixtures', 'utf8.nsi'),
	warning: path.join(cwd(), 'tests', 'fixtures', 'warnings.nsi'),
};

// Let's run the tests
test('Print makensis version', async () => {
	try {
		const { stdout } = await MakeNSIS.version();

		const expected = shared.version;
		const actual = stdout;

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test('Print makensis version as JSON', async () => {
	try {
		const { stdout } = await MakeNSIS.version({ json: true });

		let expected = shared.version;

		if (expected?.startsWith('v')) {
			expected = expected.substring(1);
		}

		expected = JSON.stringify({ version: expected });

		let actual = stdout;
		actual = JSON.stringify(actual);

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test('Print makensis license', async () => {
	const { stdout } = await MakeNSIS.license();

	const expected = shared.license;
	const actual = stdout;

	assert.is(actual, expected);
});

test('Print makensis license as JSON', async () => {
	const { stdout } = await MakeNSIS.license({ json: true });

	let expected = shared.license;
	expected = JSON.stringify({ license: expected });

	let actual = stdout;
	actual = JSON.stringify(actual);

	assert.is(actual, expected);
});

test('Print compiler information', async () => {
	const { stdout } = await MakeNSIS.headerInfo();

	const expected = shared.headerInfo;
	const actual = stdout;

	assert.is(actual, expected);
});

test('Print compiler information as JSON', async () => {
	const actual = ((await MakeNSIS.headerInfo({ json: true })).stdout as Makensis.HeaderInfo).defined_symbols.__GLOBAL__;
	const expected = true;

	assert.is(actual, expected);
});

test('Print help for all commands', async () => {
	const { stdout } = (await MakeNSIS.commandHelp()) as { stdout: string };

	const expected = shared.commandHelp?.replace(/\s+/g, '');
	const actual = stdout.replace(/\s+/g, '');

	assert.is(actual, expected);
});

test('Print help for OutFile command', async () => {
	const { stdout } = await MakeNSIS.commandHelp('OutFile');

	const expected = shared.outFile;
	const actual = stdout;

	assert.is(actual, expected);
});

test('Print help for OutFile command as JSON', async () => {
	let expected = shared.outFile;
	let actual = (await MakeNSIS.commandHelp('OutFile', { json: true })).stdout;

	actual = JSON.stringify(actual);
	expected = JSON.stringify({ help: expected });

	assert.is(actual, expected);
});

test('Compilation from File', async () => {
	try {
		const { status } = await MakeNSIS.compile(scriptFile.minimal, {
			define: {
				NULL_DEVICE: nullDevice,
			},
		});

		const expected = 0;
		const actual = status;

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test('Compilation from Array', async () => {
	try {
		const { status } = await MakeNSIS.compile(null, {
			preExecute: defaultScriptString,
		});

		const expected = 0;
		const actual = status;

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test('Compilation from String', async () => {
	try {
		const { status } = await MakeNSIS.compile(null, {
			preExecute: defaultScriptString,
		});

		const expected = 0;
		const actual = status;

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test('Compilation with warning', async () => {
	const scriptWithWarning = [...defaultScriptArray, '!warning'];

	try {
		const { status } = await MakeNSIS.compile(null, {
			preExecute: scriptWithWarning,
		});

		const expected = 0;
		const actual = status;

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test('Compilation with warning as JSON', async () => {
	const scriptWithWarning = [...defaultScriptArray, '!warning'];

	try {
		const { status } = await MakeNSIS.compile(null, {
			preExecute: scriptWithWarning,
			json: true,
		});

		const expected = 0;
		const actual = status;

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test('Compilation with raw arguments and warning', async () => {
	try {
		const { status } = await MakeNSIS.compile(scriptFile.warning, {
			rawArguments: '-WX',
		});

		const expected = 1;
		const actual = status;

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test('Compilation with error', async () => {
	const scriptWithError = [...defaultScriptArray, '!error'];

	try {
		const { status } = await MakeNSIS.compile(null, {
			preExecute: scriptWithError,
		});

		const expected = 0;
		const actual = status;

		assert.is.not(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test('Strict compilation with warning', async () => {
	const scriptWithWarning = [...defaultScriptArray, '!warning'];

	try {
		const { status } = await MakeNSIS.compile(null, {
			preExecute: scriptWithWarning,
			strict: true,
		});

		const expected = 0;
		const actual = status;

		assert.is.not(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test('Print ${NSISDIR}', async () => {
	try {
		const nsisDir = (await MakeNSIS.nsisDir()) as string;
		const nsisCfg = path.join(nsisDir, 'Include', 'MUI2.nsh');

		const expected = true;
		const actual = existsSync(nsisCfg);

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test('Print ${NSISDIR} as JSON', async () => {
	try {
		const { nsisdir } = (await MakeNSIS.nsisDir({ json: true })) as unknown as { nsisdir: string };
		const nsisCfg = path.join(nsisdir, 'Include', 'MUI2.nsh');

		const expected = true;
		const actual = existsSync(nsisCfg);

		assert.is(actual, expected);
	} catch ({ stderr }) {
		throw new Error(stderr);
	}
});

test.run();
