//Dependencies
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

test('Print compiler information', t => {
  const expected = spawnSync('makensis', ['-HDRINFO']).stdout.toString().trim();
  const actual = makensis.hdrinfoSync().stdout;

  t.is(actual, expected);
});

test('Print help for all commands', t => {
  const expected = spawnSync('makensis', ['-CMDHELP']).stdout.toString().trim();
  const actual = makensis.cmdhelpSync().stdout;

  t.is(actual, expected);
});

test('Print help for OutFile command', t => {
  const expected = spawnSync('makensis', ['-CMDHELP', 'OutFile']).stdout.toString().trim();
  const actual = makensis.cmdhelpSync('OutFile').stdout;

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

test('Compilation with warning [async]', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, {execute: scriptWithWarning}))
  .then( output => {
    t.is(output.status, 0)
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
