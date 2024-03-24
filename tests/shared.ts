import { platform } from 'node:os';
import { spawnSync } from 'node:child_process';

const commands = {
	commandHelp: ['-CMDHELP'],
	outFile: ['-CMDHELP', 'OutFile'],
	headerInfo: ['-HDRINFO'],
	license: ['-LICENSE'],
	version: ['-VERSION'],
};

export const shared = Object.fromEntries(
	Object.entries(commands).map(([command, args]) => {
		const cp = spawnSync('makensis', args);

		return [command, cp.stdout?.toString().trim() || cp.stderr?.toString().trim() || undefined];
	}),
);

export const nullDevice = platform() === 'win32' ? 'NUL' : '/dev/null';
export const defaultScriptArray = [`OutFile ${nullDevice}`, `Unicode true`, `Section -default`, `Nop`, `SectionEnd`];
export const defaultScriptString = defaultScriptArray.join('\n');
