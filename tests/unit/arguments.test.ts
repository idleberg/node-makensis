import { platform } from 'node:os';
import { env } from 'node:process';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import type * as Makensis from '../../src/types.ts';
/* eslint-disable */
import { mapArguments } from '../../src/util.ts';

const isWin32 = platform() === 'win32';

/**
 * `mapArguments` pushes onto the array it is handed, so every case gets a fresh one.
 */
function argsFor(options: Makensis.CompilerOptions, initial: string[] = []): string[] {
	const [, args] = mapArguments([...initial], options);

	return args;
}

function commandFor(options: Makensis.CompilerOptions, initial: string[] = []): string {
	const [command] = mapArguments([...initial], options);

	return command;
}

/**
 * Wine support prints a deprecation notice to the console, which is noise in test output.
 */
function quietly<T>(callback: () => T): T {
	const warn = console.warn;
	console.warn = () => {};

	try {
		return callback();
	} finally {
		console.warn = warn;
	}
}

/**
 * Runs `callback` against a known set of `NSIS_APP_*` variables, restoring the environment
 * afterwards. Pre-existing magic variables are cleared so the assertion is deterministic.
 */
function withMagicEnvVars<T>(variables: Record<string, string>, callback: () => T): T {
	const saved = Object.entries(env).filter(([key]) => key.startsWith('NSIS_APP_'));

	for (const [key] of saved) {
		delete env[key];
	}

	Object.assign(env, variables);

	try {
		return callback();
	} finally {
		for (const key of Object.keys(variables)) {
			delete env[key];
		}

		for (const [key, value] of saved) {
			env[key] = value;
		}
	}
}

// Options that map to a fixed set of flags, independent of platform
const cases: Array<[string, Makensis.CompilerOptions, string[]]> = [
	['no options', {}, []],
	['define', { define: { A: '1', B: '2' } }, ['-DA=1', '-DB=2']],
	['define with empty value is skipped', { define: { A: '', B: '2' } }, ['-DB=2']],
	['preExecute as string', { preExecute: 'Nop' }, ['-XNop']],
	['preExecute as multiline string', { preExecute: 'Nop\nOtherNop' }, ['-XNop', '-XOtherNop']],
	['preExecute as array', { preExecute: ['Nop', 'OtherNop'] }, ['-XNop', '-XOtherNop']],
	['noCD', { noCD: true }, ['-NOCD']],
	['noConfig', { noConfig: true }, ['-NOCONFIG']],
	['pause', { pause: true }, ['-PAUSE']],
	['strict', { strict: true }, ['-WX']],
	['ppo', { ppo: true }, ['-PPO']],
	['safePPO', { safePPO: true }, ['-SAFEPPO']],
	['booleans set to false emit nothing', { noCD: false, noConfig: false, strict: false }, []],
	['inputCharset', { inputCharset: 'UTF8' }, ['-INPUTCHARSET', 'UTF8']],
	['unsupported inputCharset is dropped', { inputCharset: 'NOPE' }, []],
	['verbose', { verbose: 4 }, ['-V4']],
	['verbose out of range is dropped', { verbose: 9 as unknown as 4 }, []],
	['rawArguments as array', { rawArguments: ['-WX', '-V2'] as unknown as string }, ['-WX', '-V2']],
	[
		'flag order follows the option table',
		{ define: { A: '1' }, preExecute: 'Nop', noCD: true, strict: true, verbose: 2 },
		['-DA=1', '-XNop', '-NOCD', '-WX', '-V2'],
	],
	['rawArguments are appended last', { strict: true, rawArguments: ['-V0'] as unknown as string }, ['-WX', '-V0']],
];

for (const [name, options, expected] of cases) {
	test(`mapArguments: ${name}`, () => {
		assert.equal(argsFor(options), expected);
	});
}

// Platform-gated switches
test('mapArguments: outputCharset is win32-only', () => {
	assert.equal(argsFor({ outputCharset: 'UTF8' }), isWin32 ? ['-OUTPUTCHARSET', 'UTF8'] : []);
});

test('mapArguments: priority is win32-only', () => {
	assert.equal(argsFor({ priority: 3 }), isWin32 ? ['-P3'] : []);
});

test('mapArguments: priority out of range is dropped', () => {
	assert.equal(argsFor({ priority: 9 as unknown as 5 }), []);
});

// Command resolution
test('mapArguments: defaults to makensis on PATH', () => {
	assert.is(commandFor({}), 'makensis');
});

test('mapArguments: honours pathToMakensis', () => {
	assert.is(commandFor({ pathToMakensis: '/opt/nsis/makensis' }), '/opt/nsis/makensis');
});

if (!isWin32) {
	test('mapArguments: wine runs makensis through wine', () => {
		quietly(() => {
			assert.is(commandFor({ wine: true }), 'wine');
			assert.equal(argsFor({ wine: true, strict: true }), ['makensis', '-WX']);
		});
	});

	test('mapArguments: wine honours pathToWine and pathToMakensis', () => {
		quietly(() => {
			const options = { wine: true, pathToWine: '/usr/bin/wine64', pathToMakensis: '/nsis/makensis.exe' };

			assert.is(commandFor(options), '/usr/bin/wine64');
			assert.equal(argsFor(options), ['/nsis/makensis.exe']);
		});
	});
}

// Informational commands
test('mapArguments: -CMDHELP skips option mapping', () => {
	// -CMDHELP consumes the next argument as its command name, so switches must not follow it
	assert.equal(argsFor({ strict: true, verbose: 2 }, ['-CMDHELP']), ['-CMDHELP']);
});

test('mapArguments: -HDRINFO keeps switches after the command', () => {
	// makensis -V0 -HDRINFO prints nothing, while makensis -HDRINFO -V0 works
	assert.equal(argsFor({ verbose: 4 }, ['-HDRINFO']), ['-HDRINFO', '-V4']);
});

// Magic environment variables
test('mapArguments: env is opt-in', () => {
	withMagicEnvVars({ NSIS_APP_ONE: 'a' }, () => {
		assert.equal(argsFor({}), []);
		assert.equal(argsFor({ env: false }), []);
	});
});

test('mapArguments: env maps NSIS_APP_* to defines', () => {
	withMagicEnvVars({ NSIS_APP_ONE: 'a' }, () => {
		assert.equal(argsFor({ env: true }), ['-DNSIS_APP_ONE=a']);
	});
});

// Defect pins. These describe the behaviour we want, not the behaviour we have, so they are
// skipped until the corresponding fix lands — at which point `test.skip` becomes `test` and
// the assertion is the acceptance criterion. See PLAN-3.x.md §2.
test.skip('defect 2.1: verbose: 0 emits -V0', () => {
	assert.equal(argsFor({ verbose: 0 }), ['-V0']);
});

test.skip('defect 2.2: rawArguments accepts a string', () => {
	assert.equal(argsFor({ rawArguments: '-WX' }), ['-WX']);
});

test.skip('defect 2.3: env maps every NSIS_APP_* variable', () => {
	const variables = {
		NSIS_APP_ONE: 'a',
		NSIS_APP_TWO: 'b',
		NSIS_APP_THREE: 'c',
		NSIS_APP_FOUR: 'd',
	};

	withMagicEnvVars(variables, () => {
		assert.equal(argsFor({ env: true }), [
			'-DNSIS_APP_ONE=a',
			'-DNSIS_APP_TWO=b',
			'-DNSIS_APP_THREE=c',
			'-DNSIS_APP_FOUR=d',
		]);
	});
});

if (!isWin32) {
	test.skip('fragile: wine and native agree on informational commands', () => {
		quietly(() => {
			assert.equal(argsFor({ wine: true, verbose: 4 }, ['-HDRINFO']), ['makensis', '-HDRINFO', '-V4']);
		});
	});
}

test.run();
