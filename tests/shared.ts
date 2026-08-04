import { spawnSync } from 'node:child_process';
import { platform } from 'node:os';

const commands = {
	commandHelp: ['-CMDHELP'],
	outFile: ['-CMDHELP', 'OutFile'],
	headerInfo: ['-HDRINFO'],
	license: ['-LICENSE'],
	version: ['-VERSION'],
};

/**
 * Whether a `makensis` binary is available. Integration tests are skipped without one, rather
 * than failing unreadably — or, worse, reporting success without having run.
 */
export const hasMakensis = spawnSync('makensis', ['-VERSION']).status === 0;

if (!hasMakensis) {
	console.log('Skipping integration tests: makensis was not found in PATH');
}

export const shared: Record<string, string | undefined> = hasMakensis
	? Object.fromEntries(
			Object.entries(commands).map(([command, args]) => {
				const cp = spawnSync('makensis', args);

				return [command, cp.stdout?.toString().trim() || cp.stderr?.toString().trim() || undefined];
			}),
		)
	: {};

export const nullDevice = platform() === 'win32' ? 'NUL' : '/dev/null';
export const defaultScriptArray = [`OutFile ${nullDevice}`, 'Unicode true', 'Section -default', 'Nop', 'SectionEnd'];
export const defaultScriptString = defaultScriptArray.join('\n');
