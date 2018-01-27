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

// Let's run the tests
test('MakeNSIS found in PATH environmental variable', t => {
  const actual = spawnSync('which', ['makensis']).stdout.toString().trim();

  t.not(actual, '');
});

test('Print makensis version', t => {
  const expected = spawnSync('makensis', ['-VERSION']).stdout.toString().trim();
  const actual = makensis.versionSync().stdout;

  t.is(actual, expected);
});

test('Print makensis version [async]', t => {
  const expected = spawnSync('makensis', ['-VERSION']).stdout.toString().trim();

  return Promise.resolve(makensis.version())
  .then(output => {
      t.is(output.stdout, expected);
  })
  .catch();
});

test('Print makensis version as JSON', t => {
  let expected = spawnSync('makensis', ['-VERSION']).stdout.toString().trim();
  let actual = makensis.versionSync({json: true}).stdout;

  actual.version = `v${actual.version}`;
  actual = JSON.stringify(actual);
  expected = JSON.stringify({ version: expected });

  t.is(actual, expected);
});

test('Print compiler information [async]', t => {
  const expected = spawnSync('makensis', ['-HDRINFO']).stderr.toString().trim();

  return Promise.resolve(makensis.hdrInfo())
  .catch(output => {
    t.is(output.stderr, expected);
  });
});

test('Print compiler information', t => {
  const expected = spawnSync('makensis', ['-HDRINFO']).stdout.toString().trim();
  const actual = makensis.hdrInfoSync().stdout;

  t.is(actual, expected);
});

test('Print help for all commands', t => {
  const expected = spawnSync('makensis', ['-CMDHELP']).stdout.toString().trim();
  const actual = makensis.cmdHelpSync().stdout;

  t.is(actual, expected);
});

test('Print help for all commands as JSON', t => {
  let expected = spawnSync('makensis', ['-CMDHELP']).stderr.toString().trim();
  let actual = makensis.cmdHelpSync(null, {json: true}).stderr;

  actual = JSON.stringify(actual);
  expected = JSON.stringify({help: expected });

  t.is(actual, expected);
});

test('Print help for OutFile command', t => {
  const expected = spawnSync('makensis', ['-CMDHELP', 'OutFile']).stdout.toString().trim();
  const actual = makensis.cmdHelpSync('OutFile').stdout;

  t.is(actual, expected);
});

test('Print help for OutFile command as JSON', t => {
  let expected = spawnSync('makensis', ['-CMDHELP', 'OutFile']).stderr.toString().trim();
  let actual = makensis.cmdHelpSync('OutFile', {json: true}).stderr;

  actual = JSON.stringify(actual);
  expected = JSON.stringify({help: expected });

  t.is(actual, expected);
});

test('Compilation', t => {
  const actual = makensis.compileSync(null, {execute: scriptDefault}).status;

  t.is(actual, 0);
});

test('Compilation [async]', t => {
  return Promise.resolve(makensis.compile(null, {execute: scriptDefault}))
  .then(output => {
      t.is(output.status, 0);
  })
  .catch();
});

test('Compilation with warning', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);
  const actual = makensis.compileSync(null, {execute: scriptWithWarning}).status;

  t.is(actual, 0);
});

test('Compilation with warning as JSON', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);
  const actual = makensis.compileSync(null, {execute: scriptWithWarning, json: true});

  t.is(actual.warnings, true);
});

test('Compilation with warning [async]', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, {execute: scriptWithWarning}))
  .then( output => {
    t.is(output.status, 0)
  })
  .catch();
});

test('Compilation with warning as JSON [async]', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, {execute: scriptWithWarning, json: true}))
  .then( output => {
    t.is(output.warnings, true)
  })
  .catch();
});

test('Compilation with error', t => {
  const scriptWithError = scriptDefault.concat(['!error']);
  const actual = makensis.compileSync(null, {execute: scriptWithError}).status;

  t.not(actual, 0);
});

test('Compilation with error [async]', t => {
  let scriptWithError = scriptDefault.concat(['!error']);

  return Promise.resolve(makensis.compile(null, {execute: scriptWithError}))
  .catch(output => {
      t.not(output.status, 0);
  });
});

test('Strict compilation with warning', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);
  const actual = makensis.compileSync(null, {execute: scriptWithWarning, strict: true}).status;

  t.not(actual, 0);
});

test('Strict compilation with warning [async]', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, {execute: scriptWithWarning, strict: true}))
  .catch(output => {
    t.not(output.status, 0);
  });
});
