import { test } from 'uvu';
import * as assert from 'uvu/assert';
/* eslint-disable */
import { detectOutfile, objectifyFlags } from '../../src/util.ts';

// `detectOutfile` runs against raw chunks off the child process's stdout, which is why several
// of these cases are deliberately unlovely: chunks are not line-aligned and may carry more than
// one `Output:` line, or none at all.
const cases: Array<[string, string, string | null]> = [
	['plain exe', 'Output: "C:\\dist\\setup.exe"', 'C:\\dist\\setup.exe'],
	['posix path', 'Output: "/tmp/out.exe"', '/tmp/out.exe'],
	// The old pattern required `.exe`, via an unescaped dot that matched any character
	['non-exe extension', 'Output: "/tmp/out.bin"', '/tmp/out.bin'],
	['no extension', 'Output: "/tmp/installer"', '/tmp/installer'],
	['name containing spaces', 'Output: "/tmp/My Installer.exe"', '/tmp/My Installer.exe'],
	['two outputs in one chunk', 'Output: "a.exe"\nOutput: "b.exe"\n', 'a.exe'],
	// Greedy `.*` returned everything between the first and last quote on a line. Newlines save
	// it in the case above, since `.` does not cross them — this is the case that does not.
	['two outputs on one line', 'Output: "a.exe" then Output: "b.exe"', 'a.exe'],
	['surrounded by other output', 'Processing...\nOutput: "a.exe"\nDone.\n', 'a.exe'],
	['no match', 'Processing script file...', null],
	['empty string', '', null],
	// An empty capture is indistinguishable from no output file for our purposes
	['empty output name', 'Output: ""', null],
	['unterminated quote', 'Output: "/tmp/out.exe', null],
];

for (const [name, input, expected] of cases) {
	test(`detectOutfile: ${name}`, () => {
		assert.is(detectOutfile(input), expected);
	});
}

// The regex is module-scoped, so a stray `g` flag would make results depend on call order.
// Two identical calls returning different answers is the symptom that bug presents with.
test('detectOutfile: is stateless across calls', () => {
	const line = 'Output: "/tmp/out.exe"';

	assert.is(detectOutfile(line), '/tmp/out.exe');
	assert.is(detectOutfile(line), '/tmp/out.exe');
	assert.is(detectOutfile(line), '/tmp/out.exe');
});

// `objectifyFlags` splits its input into lines. That split used to pick `\r\n` or `\n` by
// platform and `wine`, so a CRLF-emitting compiler invoked natively left a trailing `\r` on
// every value — including, for `Defined symbols:`, on the last symbol of the list.
test('objectifyFlags: parses CRLF output without a trailing carriage return', () => {
	const input = ['Size of datablock is 1234 bytes.', 'Defined symbols: NSISDIR=/usr/share/nsis,MUI_INSERT'].join(
		'\r\n',
	);

	assert.equal(objectifyFlags(input), {
		sizes: { datablock: '1234 bytes' },
		defined_symbols: { NSISDIR: '/usr/share/nsis', MUI_INSERT: true },
	});
});

test('objectifyFlags: parses LF output identically', () => {
	const input = ['Size of datablock is 1234 bytes.', 'Defined symbols: NSISDIR=/usr/share/nsis,MUI_INSERT'].join('\n');

	assert.equal(objectifyFlags(input), {
		sizes: { datablock: '1234 bytes' },
		defined_symbols: { NSISDIR: '/usr/share/nsis', MUI_INSERT: true },
	});
});

// Every `Size of …` line makensis emits today names two words, so replacing the first space only
// worked by luck. A three-word name is what that luck runs out on.
test('objectifyFlags: underscores every space in a size name', () => {
	assert.equal(objectifyFlags('Size of install code is 42 bytes.').sizes, { install_code: '42 bytes' });
	assert.equal(objectifyFlags('Size of install section code is 42 bytes.').sizes, {
		install_section_code: '42 bytes',
	});
});

test.run();
