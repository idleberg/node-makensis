// Dependencies
import * as makensis from '../dist/makensis';
import { spawnSync } from 'child_process';
import { test } from 'ava';

// Generate script using compiler flags
const scriptDefault = [
'OutFile test.exe',
'Section -default',
'Nop',
'SectionEnd'
];

// Expected values
const version = spawnSync('makensis', ['-VERSION']).stdout.toString().trim();
const hdrInfo = spawnSync('makensis', ['-HDRINFO']).stdout.toString().trim();
const cmdHelp = spawnSync('makensis', ['-CMDHELP']).stderr.toString().trim();
const outFile = spawnSync('makensis', ['-CMDHELP', 'OutFile']).stderr.toString().trim();

// Let's run the tests
test('MakeNSIS found in PATH environmental variable', t => {
  const actual = spawnSync('which', ['makensis']).stdout.toString().trim();

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

  actual.version = `v${actual.version}`;
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
    expected = JSON.stringify({ version: expected });

    let actual = output.stdout;
    actual.version = `v${actual.version}`;
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
    const expected = hdrInfo;
    const actual = output.stdout;

    t.is(actual, expected);
  })
});

test('Print help for all commands', t => {
  const expected = cmdHelp;
  const actual = makensis.cmdHelpSync().stderr;

  t.is(actual, expected);
});

// test('Print help for all commands [async]', t => {
//   return Promise.resolve(makensis.cmdHelp())
//   .then(output => {
//     const expected = cmdHelp;
//     const actual = output.stderr;

//     t.is(actual, expected);
//   })
//   .catch(output => {
//     // NSIS < 3.03
//     const expected = cmdHelp;
//     const actual = output.stderr;

//     t.is(actual, expected);
//   });
// });

test('Print help for all commands as JSON', t => {
  let expected = cmdHelp;
  let actual = makensis.cmdHelpSync(null, {json: true}).stderr;

  actual = JSON.stringify(actual);
  expected = JSON.stringify({help: expected });

  t.is(actual, expected);
});

test('Print help for OutFile command', t => {
  const expected = outFile;
  const actual = makensis.cmdHelpSync('OutFile').stderr;

  t.is(actual, expected);
});

test('Print help for OutFile command [async]', t => {
  return Promise.resolve(makensis.cmdHelp('OutFile'))
  .then(output => {
    const expected = outFile;
    const actual = output.stderr;

    t.is(actual, expected);
  })
  .catch(error => {
    t.fail(error)
  });
});

test('Print help for OutFile command as JSON', t => {
  let expected = outFile;
  let actual = makensis.cmdHelpSync('OutFile', {json: true}).stderr;

  actual = JSON.stringify(actual);
  expected = JSON.stringify({help: expected });

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
  const expected = true;
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
    const expected = true;
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
