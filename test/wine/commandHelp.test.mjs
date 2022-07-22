/* eslint-disable */
import { spawnSync } from 'node:child_process';
import * as MakeNSIS from '../../dist/makensis.mjs';
import test from 'ava';

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

		t.is(actual, expected);
	} catch ({ stdout }) {
		// NSIS < 3.03
		t.log('Legacy NSIS');
		const expected = commandHelp.replace(/\s+/g, '');
		const actual = stdout.replace(/\s+/g, '');

		t.is(actual, expected);
	}
});

test('Print help for OutFile command', async (t) => {
	try {
		const { stdout } = await MakeNSIS.commandHelp('OutFile', {
			wine: true,
		});

		const expected = outFile;
		const actual = stdout;

		t.is(actual, expected);
	} catch ({ stdout }) {
		// NSIS < 3.03
		t.log('Legacy NSIS');
		const expected = outFile;
		const actual = stdout;

		t.is(actual, expected);
	}
});

test('Print help for OutFile command as JSON', async (t) => {
	try {
		let expected = outFile;
		let actual = (await MakeNSIS.commandHelp('OutFile', { json: true, wine: true })).stdout;

		actual = JSON.stringify(actual);
		expected = JSON.stringify({ help: expected });

		t.is(actual, expected);
	} catch ({ stdout }) {
		// NSIS < 3.03
		t.log('Legacy NSIS');
		const expected = outFile;
		const actual = stdout;

		t.is(actual, expected);
	}
});
