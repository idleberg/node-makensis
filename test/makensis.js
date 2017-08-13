//Dependencies
import * as makensis from '../dist/makensis';
import { spawnSync } from 'child_process';
import { test } from 'ava';

// Generate script using compiler flags
const execute = [
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

test('Get command help', t => {
  const expected = spawnSync('makensis', ['-CMDHELP']).stdout.toString().trim();
  const actual = makensis.cmdhelpSync().stdout;

  t.is(actual, expected);
});

test('Get help for OutFile command', t => {
  const expected = spawnSync('makensis', ['-CMDHELP', 'OutFile']).stdout.toString().trim();
  const actual = makensis.cmdhelpSync('OutFile').stdout;

  t.is(actual, expected);
});

test('Compilation [async]', t => {
  return Promise.resolve(makensis.compile(null, {execute: execute}))
  .then(output => {
      t.is(output.status, 0);
  })
  .catch();
});

test('Compilation with warning [async]', t => {
  const executeWithWarning = execute.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, {execute: executeWithWarning}))
  .then( output => {
    t.is(output.status, 0)
  })
  .catch();
});

test('Compilation with error [async]', t => {
  let executeWithError = execute.concat(['!error']);

  return Promise.resolve(makensis.compile(null, {execute: executeWithError}))
  .catch(output => {
      t.not(output.status, 0);
  });
});

test('Compilation', t => {
  const actual = makensis.compileSync(null, {execute: execute}).status;

  t.is(actual, 0);
});

test('Compilation with warning', t => {
  const executeWithWarning = execute.concat(['!warning']);
  const actual = makensis.compileSync(null, {execute: executeWithWarning}).status;

  t.is(actual, 0);
});

test('Compilation with error', t => {
  const executeWithError = execute.concat(['!error']);
  const actual = makensis.compileSync(null, {execute: executeWithError}).status;

  t.not(actual, 0);
});

test('Strict compilation with warning [async]', t => {
  const executeWithWarning = execute.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, {execute: executeWithWarning, strict: true}))
  .catch(output => {
    t.not(output.status, 0);
  });
});

test('Strict compilation with warning', t => {
  const executeWithWarning = execute.concat(['!warning']);
  const actual = makensis.compileSync(null, {execute: executeWithWarning, strict: true}).status;

  t.not(actual, 0);
});