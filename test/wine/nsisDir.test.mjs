/* eslint-disable */
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import * as MakeNSIS from '../../dist/makensis.mjs';
import { win32 as path } from 'node:path';
import test from 'ava';

function winePath(filePath) {
    return spawnSync('winepath', [path.normalize(filePath)])
        .stdout.toString()
        .trim();
}

// Let's run the tests
test('Print ${NSISDIR}', (t) => {
    const nsisDir = MakeNSIS.nsisDir.sync({ wine: true });
    const nsisCfg = path.join(nsisDir, 'Include', 'MUI2.nsh');

    const expected = true;
    const actual = existsSync(winePath(nsisCfg));

    t.is(actual, expected);
});

test('Print ${NSISDIR} [async]', async (t) => {
    try {
        const nsisDir = await MakeNSIS.nsisDir({ wine: true });
        const nsisCfg = path.join(nsisDir, 'Include', 'MUI2.nsh');

        const expected = true;
        const actual = existsSync(winePath(nsisCfg));

        t.is(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});

test('Print ${NSISDIR} as JSON', (t) => {
    const nsisDir = MakeNSIS.nsisDir.sync({ json: true, wine: true }).nsisdir;
    const nsisCfg = path.join(nsisDir, 'Include', 'MUI2.nsh');

    const expected = true;
    const actual = existsSync(winePath(nsisCfg));

    t.is(actual, expected);
});

test('Print ${NSISDIR} as JSON [async]', async (t) => {
    try {
        const nsisDir = await MakeNSIS.nsisDir({ json: true, wine: true });
        const nsisCfg = path.join(nsisDir.nsisdir, 'Include', 'MUI2.nsh');

        const expected = true;
        const actual = existsSync(winePath(nsisCfg));

        t.is(actual, expected);
    } catch ({ stderr }) {
        t.fail(stderr);
    }
});
