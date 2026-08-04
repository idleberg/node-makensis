import { join } from 'node:path';
import { cwd, execPath } from 'node:process';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
/* eslint-disable */
import type * as Makensis from '../../src/types.ts';
import { spawnMakensis } from '../../src/util.ts';

// A path that cannot exist, so `spawn` fails with ENOENT before any compiler runs. These tests
// therefore need no makensis on the host.
const missingCompiler = join(cwd(), 'tests', 'fixtures', 'no-such-makensis');

/**
 * Runs Node as a stand-in compiler that writes `chunks` to stdout, one per turn of the event
 * loop, so each arrives as its own `data` event. Real makensis output is not chunked to order,
 * which is precisely why the boundaries below have to be tested deliberately.
 */
function emitting(chunks: string[], compilerOptions: Makensis.CompilerOptions = {}) {
	const script = `
		const chunks = ${JSON.stringify(chunks)};

		(async () => {
			for (const chunk of chunks) {
				process.stdout.write(chunk);
				await new Promise((resolve) => setTimeout(resolve, 25));
			}
		})();
	`;

	return spawnMakensis(execPath, ['-e', script], compilerOptions);
}

/**
 * Captures anything the library writes to the console, so a stray print fails a test instead of
 * quietly polluting the consumer's stderr.
 */
async function recordingConsole<T>(callback: () => Promise<T>): Promise<{ result: T; printed: unknown[] }> {
	const { error, warn, log } = console;
	const printed: unknown[] = [];
	const record = (...args: unknown[]) => printed.push(args);

	console.error = record;
	console.warn = record;
	console.log = record;

	try {
		return { result: await callback(), printed };
	} finally {
		Object.assign(console, { error, warn, log });
	}
}

test('spawnMakensis: rejects with a message, never with null', async () => {
	try {
		await spawnMakensis(missingCompiler, ['-VERSION'], {});
		assert.unreachable('expected a rejection for a missing compiler');
	} catch (error) {
		// The rejection type stays `string` in 3.x, so this is deliberately not an Error instance
		assert.type(error, 'string');
		assert.ok((error as string).includes('ENOENT'), `expected an ENOENT message, got ${JSON.stringify(error)}`);
	}
});

test('spawnMakensis: does not print to the console on spawn failure', async () => {
	const { printed } = await recordingConsole(async () => {
		try {
			await spawnMakensis(missingCompiler, ['-VERSION'], {});
		} catch {
			// The rejection is asserted above; here only the console matters
		}
	});

	assert.equal(printed, []);
});

// `spawnOptions` is the caller's object. The wine branch used to write a frozen `env` onto it.
test('spawnMakensis: leaves the caller spawnOptions untouched', async () => {
	const spawnOptions = { cwd: cwd(), env: { EXISTING: 'value' } };

	try {
		await spawnMakensis(missingCompiler, ['-VERSION'], { wine: true }, spawnOptions);
	} catch {
		// Failure is expected; the object is what is under test
	}

	assert.equal(spawnOptions, { cwd: cwd(), env: { EXISTING: 'value' } });

	// Asserted separately because the env was handed back *frozen*: a caller reusing the object
	// for a second compile could no longer amend it, silently or by exception under strict mode.
	assert.is(Object.isFrozen(spawnOptions.env), false);
});

// Detection used to run per chunk, so a pattern straddling a boundary matched neither half.
test('spawnMakensis: detects an outfile split across two chunks', async () => {
	const output = await emitting(['Output: "/tmp/ou', 't.exe"\n']);

	assert.is(output.outFile, '/tmp/out.exe');
});

test('spawnMakensis: counts a warning summary split across two chunks', async () => {
	const output = await emitting(['Processing\n2 warn', 'ings:\nsomewhere\n']);

	assert.is(output.warnings, 2);
});

// The last line of a stream has no trailing break, so it stays buffered until close
test('spawnMakensis: scans a final line with no trailing newline', async () => {
	const output = await emitting(['Output: "/tmp/out.exe"\n1 warning:']);

	assert.is(output.outFile, '/tmp/out.exe');
	assert.is(output.warnings, 1);
});

// Buffering must not double-count a line, nor lose one that arrives whole
test('spawnMakensis: counts each warning summary exactly once', async () => {
	const output = await emitting(['1 warning:\n', '2 warnings:\n', '3 warnings:\n']);

	assert.is(output.warnings, 6);
});

// `onData` predates the buffering and hands the consumer raw chunks; `vscode-nsis-lsp` calls
// `append`, so switching to a line-based payload would change its output channel's spacing.
test('spawnMakensis: onData still receives raw chunks', async () => {
	const chunks = ['Output: "/tmp/ou', 't.exe"\n'];
	const received: string[] = [];

	const output = await emitting(chunks, {
		onData: ({ line }) => {
			received.push(line);
		},
	});

	assert.equal(received, chunks);
	assert.is(output.outFile, '/tmp/out.exe');
});

test.run();
