/* eslint-disable */
import { spawnSync } from 'node:child_process';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as MakeNSIS from '../../dist/makensis.mjs';

let cp;

cp = spawnSync('wine', ['makensis', '-CMDHELP']);
const commandHelp = cp.stdout.toString().trim() || cp.stderr.toString().trim();

cp = spawnSync('wine', ['makensis', '-CMDHELP', 'OutFile']);
const outFile = cp.stdout.toString().trim() || cp.stderr.toString().trim();

// Let's run the tests

test('Print help for all commands', async (t) => {
	try {
		const output = await MakeNSIS.commandHelp('', { wine: true });

		const expected = commandHelp.replace(/\s+/g, '');
		const actual = output.stdout.replace(/\s+/g, '');

		assert.is(actual, expected);
	} catch ({ stdout }) {
		// NSIS < 3.03
		console.log('Legacy NSIS');
		const expected = commandHelp.replace(/\s+/g, '');
		const actual = stdout.replace(/\s+/g, '');

		assert.is(actual, expected);
	}
});

test('Print help for OutFile command', async (t) => {
	try {
		const { stdout } = await MakeNSIS.commandHelp('OutFile', {
			wine: true,
		});

		const expected = outFile;
		const actual = stdout;

		assert.is(actual, expected);
	} catch ({ stdout }) {
		// NSIS < 3.03
		console.log('Legacy NSIS');
		const expected = outFile;
		const actual = stdout;

		assert.is(actual, expected);
	}
});

test('Print help for OutFile command as JSON', async (t) => {
	try {
		let expected = outFile;
		let actual = (await MakeNSIS.commandHelp('OutFile', { json: true, wine: true })).stdout;

		actual = JSON.stringify(actual);
		expected = JSON.stringify({ help: expected });

		assert.is(actual, expected);
	} catch ({ stdout }) {
		// NSIS < 3.03
		console.log('Legacy NSIS');
		const expected = outFile;
		const actual = stdout;

		assert.is(actual, expected);
	}
});

test.run();
