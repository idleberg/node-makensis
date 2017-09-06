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

// These test require NSIS to be setup properly, with makensis in your
// PATH environmental variable
test('Wine: Print makensis version', t => {
  const expected = spawnSync('wine', ['makensis', '-VERSION']).stdout.toString().trim();
  const actual = makensis.versionSync({wine: true}).stdout;

  t.is(actual, expected);
});

test('Wine: Print makensis version [async]', t => {
  const expected = spawnSync('wine', ['makensis', '-VERSION']).stdout.toString().trim();

  return Promise.resolve(makensis.version({wine: true}))
  .then(output => {
      t.is(output.stdout, expected);
  })
  .catch();
});

test('Wine: Print compiler information', t => {
  const expected = spawnSync('wine', ['makensis', '-HDRINFO']).stdout.toString().trim();
  const actual = makensis.hdrinfoSync({wine: true}).stdout;

  t.is(actual, expected);
});

test('Wine: Print help for all commands', t => {
  const expected = spawnSync('wine', ['makensis', '-CMDHELP']).stdout.toString().trim();
  const actual = makensis.cmdhelpSync('', {wine: true}).stdout;

  t.is(actual, expected);
});

test('Wine: Print help for OutFile command', t => {
  const expected = spawnSync('wine', ['makensis', '-CMDHELP', 'OutFile']).stdout.toString().trim();
  const actual = makensis.cmdhelpSync('OutFile', {wine: true}).stdout;

  t.is(actual, expected);
});

test('Wine: Compilation', t => {
  const actual = makensis.compileSync(null, {execute: scriptDefault, wine: true}).status;

  t.is(actual, 0);
});

test('Wine: Compilation [async]', t => {
  return Promise.resolve(makensis.compile(null, {execute: scriptDefault, wine: true}))
  .then(output => {
      t.is(output.status, 0);
  })
  .catch();
});

test('Wine: Compilation with warning', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);
  const actual = makensis.compileSync(null, {execute: scriptWithWarning, wine: true}).status;

  t.is(actual, 0);
});

test('Wine: Compilation with warning [async]', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, {execute: scriptWithWarning, wine: true}))
  .then( output => {
    t.is(output.status, 0)
  })
  .catch();
});

test('Wine: Compilation with error', t => {
  const scriptWithError = scriptDefault.concat(['!error']);
  const actual = makensis.compileSync(null, {execute: scriptWithError, wine: true}).status;

  t.not(actual, 0);
});

test('Wine: Compilation with error [async]', t => {
  let scriptWithError = scriptDefault.concat(['!error']);

  return Promise.resolve(makensis.compile(null, {execute: scriptWithError, wine: true}))
  .catch(output => {
      t.not(output.status, 0);
  });
});

test('Wine: Strict compilation with warning', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);
  const actual = makensis.compileSync(null, {execute: scriptWithWarning, wine: true, strict: true}).status;

  t.not(actual, 0);
});

test('Wine: Strict compilation with warning [async]', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, {execute: scriptWithWarning, wine: true, strict: true}))
  .catch(output => {
    t.not(output.status, 0);
  });
});
