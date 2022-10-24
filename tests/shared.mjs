/* eslint-disable */
import { platform } from 'os';
import { spawnSync } from 'child_process';

let cp;
const shared = {};

cp = spawnSync('makensis', ['-CMDHELP']);
shared['commandHelp'] = cp.stdout?.toString().trim() || cp.stderr?.toString().trim() || undefined;

cp = spawnSync('makensis', ['-CMDHELP', 'OutFile']);
shared['outFile'] = cp.stdout?.toString().trim() || cp.stderr?.toString().trim() || undefined;

cp = spawnSync('makensis', ['-HDRINFO']);
shared['headerInfo'] = cp.stdout?.toString().trim() || cp.stderr?.toString().trim() || undefined;

cp = spawnSync('makensis', ['-LICENSE']);
shared['license'] = cp.stdout?.toString().trim() || cp.stderr?.toString().trim() || undefined;

cp = spawnSync('makensis', ['-VERSION']);
shared['version'] = cp.stdout?.toString().trim() || cp.stderr?.toString().trim() || undefined;

const nullDevice = platform() === 'win32' ? 'NUL' : '/dev/null';
const defaultScriptArray = [`OutFile ${nullDevice}`, `Unicode true`, `Section -default`, `Nop`, `SectionEnd`];
const defaultScriptString = defaultScriptArray.join('\n');

export { defaultScriptArray, defaultScriptString, nullDevice, shared };
