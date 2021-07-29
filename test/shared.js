/* eslint-disable */
import { spawnSync } from 'child_process';

let cp;
const shared = {};

cp = spawnSync('makensis', ['-CMDHELP']);
shared['commandHelp'] = cp.stdout.toString().trim() || cp.stderr.toString().trim();

cp = spawnSync('makensis', ['-CMDHELP', 'OutFile']);
shared['outFile'] = cp.stdout.toString().trim() || cp.stderr.toString().trim();

cp = spawnSync('makensis', ['-HDRINFO']);
shared['headerInfo'] = cp.stdout.toString().trim() || cp.stderr.toString().trim();

cp = spawnSync('makensis', ['-LICENSE']);
shared['license'] = cp.stdout.toString().trim() || cp.stderr.toString().trim();

cp = spawnSync('makensis', ['-VERSION']);
shared['version'] = cp.stdout.toString().trim() || cp.stderr.toString().trim();

export {
  shared
};
