// Dependencies
import * as makensis from '../dist/makensis';
import { spawnSync } from 'child_process';
import { exists, existsSync } from 'fs';
import { join } from 'path';
import { platform } from 'os';
import { test } from 'ava';

// Generate script using compiler flags
const nullDevice = (platform() === 'win32') ? 'NUL' : '/dev/null';
const scriptDefault = [
  `OutFile ${nullDevice}`,
  `Section -default`,
  `Nop`,
  `SectionEnd`
];

// Expected values
const version = spawnSync('makensis', ['-VERSION']).stdout.toString().trim();
const hdrInfo = spawnSync('makensis', ['-HDRINFO']).stdout.toString().trim();
const cmdHelp = spawnSync('makensis', ['-CMDHELP']).stderr.toString().trim();
const outFile = spawnSync('makensis', ['-CMDHELP', 'OutFile']).stderr.toString().trim();

// Let's run the tests
test('MakeNSIS found in PATH environmental variable', t => {
  const which = (platform() === 'win32') ? 'where' : 'which';
  const actual = spawnSync(which, ['makensis']).stdout.toString().trim();

  t.not(actual, '');
});

test('Print makensis version', t => {
  const expected = version;
  const actual = makensis.versionSync().stdout;

  t.is(actual, expected);
});

test('Print makensis version as JSON', t => {
  let expected = version;
  let actual = makensis.versionSync({json: true}).stdout;

  if (expected.startsWith('v')) {
    expected = expected.substr(1);
  }

  actual = JSON.stringify(actual);
  expected = JSON.stringify({ version: expected });

  t.is(actual, expected);
});

test('Print makensis version [async]', t => {
  return Promise.resolve(makensis.version())
  .then(output => {
    const expected = version;
    const actual = output.stdout;

    t.is(actual, expected);
  })
  .catch();
});

test('Print makensis version as JSON [async]', t => {
  return Promise.resolve(makensis.version({json: true}))
  .then(output => {
    let expected = version;

    if (expected.startsWith('v')) {
      expected = expected.substr(1);
    }
    expected = JSON.stringify({ version: expected });

    let actual = output.stdout;
    actual.version = `${actual.version}`;
    actual = JSON.stringify(actual);

    t.is(actual, expected);
  })
  .catch();
});

test('Print compiler information', t => {
  const expected = hdrInfo;
  const actual = makensis.hdrInfoSync().stdout;

  t.is(actual, expected);
});

test('Print compiler information as JSON', t => {
  const expected = true;
  const actual = makensis.hdrInfoSync({json: true}).stdout.defined_symbols.__GLOBAL__;

  t.is(actual, expected);
});

test('Print compiler information [async]', t => {
  return Promise.resolve(makensis.hdrInfo())
  .then(output => {
    const expected = hdrInfo;
    const actual = output.stdout;

    t.is(actual, expected);
  })
  .catch(output => {
    // NSIS < 3.03
    t.log('Legacy NSIS');
    const expected = hdrInfo;
    const actual = output.stdout;

    t.is(actual, expected);
  })
});

test('Print help for all commands', t => {
  const expected = cmdHelp;
  const actual = makensis.cmdHelpSync().stdout;

  t.is(actual, expected);
});

test('Print help for all commands [async]', t => {
  return Promise.resolve(makensis.cmdHelp())
  .then(output => {
    // const expected = cmdHelp;
    // const actual = output.stderr;

    // t.is(actual, expected);
    t.pass();
  })
  .catch(output => {
    // NSIS < 3.03
    t.log('Legacy NSIS');
    const expected = cmdHelp;
    const actual = output.stdout;

    t.is(actual, expected);
  });
});

test('Print help for OutFile command', t => {
  const expected = outFile;
  const actual = makensis.cmdHelpSync('OutFile').stdout;

  t.is(actual, expected);
});

test('Print help for OutFile command [async]', t => {
  return Promise.resolve(makensis.cmdHelp('OutFile'))
  .then(output => {
    const expected = outFile;
    const actual = output.stdout;

    t.is(actual, expected);
  })
  .catch(output => {
    // NSIS < 3.03
    t.log('Legacy NSIS');
    const expected = outFile;
    const actual = output.stdout;

    t.is(actual, expected);
  });
});

test('Print help for OutFile command as JSON', t => {
  let expected = outFile;
  let actual = makensis.cmdHelpSync('OutFile', {json: true}).stdout;

  actual = JSON.stringify(actual);
  expected = JSON.stringify({'help': expected });

  t.is(actual, expected);
});

test('Compilation', t => {
  const expected = 0;
  const actual = makensis.compileSync(null, {execute: scriptDefault}).status;

  t.is(actual, expected);
});

test('Compilation [async]', t => {
  return Promise.resolve(makensis.compile(null, {execute: scriptDefault}))
  .then(output => {
    const expected = 0;
    const actual = output.status;

    t.is(actual, expected);
  })
  .catch();
});

test('Compilation with warning', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  const expected = 0;
  const actual = makensis.compileSync(null, {execute: scriptWithWarning}).status;

  t.is(actual, expected);
});

test('Compilation with warning as JSON', t => {
  const expected = 1;
  const scriptWithWarning = scriptDefault.concat(['!warning']);
  const actual = makensis.compileSync(null, {execute: scriptWithWarning, json: true}).warnings;

  t.is(actual, expected);
});

test('Compilation with warning [async]', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, {execute: scriptWithWarning}))
  .then( output => {
    const expected = 0;
    const actual = output.status;

    t.is(actual, expected);
  })
  .catch();
});

test('Compilation with warning as JSON [async]', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, {execute: scriptWithWarning, json: true}))
  .then( output => {
    const expected = 1;
    const actual = output.warnings;

    t.is(actual, expected);
  })
  .catch();
});

test('Compilation with error', t => {
  const scriptWithError = scriptDefault.concat(['!error']);

  const expected = 0;
  const actual = makensis.compileSync(null, {execute: scriptWithError}).status;

  t.not(actual, expected);
});

test('Compilation with error [async]', t => {
  let scriptWithError = scriptDefault.concat(['!error']);

  return Promise.resolve(makensis.compile(null, {execute: scriptWithError}))
  .catch(output => {
    const expected = 0;
    const actual = output.status;

    t.not(actual, expected)
  });
});

test('Strict compilation with warning', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  const expected = 0;
  const actual = makensis.compileSync(null, {execute: scriptWithWarning, strict: true}).status;

  t.not(actual, expected);
});

test('Strict compilation with warning [async]', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, {execute: scriptWithWarning, strict: true}))
  .catch(output => {
    const expected = 0;
    const actual = output.status;

    t.not(actual, expected)
  });
});

test('Get ${NSISDIR}', t => {
  const nsisDir = makensis.nsisDirSync();
  const nsisCfg = join(nsisDir, 'nsisconf.nsh')

  console.log('nsisDir', nsisDir);
  console.log('nsisCfg', nsisCfg);

  const expected = true;
  const actual = existsSync(nsisCfg);

  t.is(actual, expected);
});

test('Get ${NSISDIR} [async]', t => {
  return Promise.resolve(makensis.nsisDir())
  .then(nsisDir => {
    const nsisCfg = join(nsisDir, 'nsisconf.nsh')

    const expected = true;
    const actual = existsSync(nsisCfg);

    t.is(actual, expected)
  });
});
