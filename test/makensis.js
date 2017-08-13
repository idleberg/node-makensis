//Dependencies
const makensis = require('../dist/makensis');
const path = require('path');
const { spawnSync } = require('child_process');
const { test } = require('tape');

// Generate script using compiler flags
const execute = [
  'OutFile test.exe',
  'Section -default',
  'Nop',
  'SectionEnd'
];

// Skip test when makensis isn't installed
const hasMakensis = spawnSync('makensis');
let options = {};
if (typeof hasMakensis.error !== 'undefined') {
  options.skip = true;
}

console.log('\nRunning Tape tests:\n');

// Let's run the tests
test('Print makensis version', options, (assert) => {
  const expected = spawnSync('makensis', ['-VERSION']).stdout.toString().trim();
  const actual = makensis.versionSync().stdout;

  assert.equal(actual, expected, '');
  assert.end();
});

test('Get command help', options, (assert) => {
  const expected = spawnSync('makensis', ['-CMDHELP']).stdout.toString().trim();
  const actual = makensis.cmdhelpSync().stdout;

  assert.equal(actual, expected, '');
  assert.end();
});

test('Get help for OutFile command', options, (assert) => {
  const expected = spawnSync('makensis', ['-CMDHELP', 'OutFile']).stdout.toString().trim();
  const actual = makensis.cmdhelpSync('OutFile').stdout;

  assert.equal(actual, expected, '');
  assert.end();
});

test('Compilation [async]', options, (assert) => {
  const expected = 0;

  makensis.compile(null, {execute: execute})
  .then(output => {
      assert.equal(output.status, expected, '');
      assert.end();
  })
  .catch();
});

test('Compilation with warning [async]', options, (assert) => {
  const executeWithWarning = execute.concat(['!warning']);
  const expected = 0;

  makensis.compile(null, {execute: executeWithWarning})
  .then( output => {
    assert.equal(output.status, expected, '');
    assert.end();
  })
  .catch();
});

test('Compilation with error [async]', options, (assert) => {
  let executeWithError = execute.concat(['!error']);
  const expected = 0;

  makensis.compile(null, {execute: executeWithError})
  .catch(output => {
      assert.notEqual(output.status, expected, '');
      assert.end();
  });
});

test('Compilation', options, (assert) => {
  const expected = 0;
  const actual = makensis.compileSync(null, {execute: execute}).status;

  assert.equal(actual, expected, '');
  assert.end();
});

test('Compilation with warning', options, (assert) => {
  const executeWithWarning = execute.concat(['!warning']);
  const expected = 0;
  const actual = makensis.compileSync(null, {execute: executeWithWarning}).status;

  assert.equal(actual, expected, '');
  assert.end();
});

test('Compilation with error', options, (assert) => {
  const executeWithError = execute.concat(['!error']);
  const expected = 0;
  const actual = makensis.compileSync(null, {execute: executeWithError}).status;

  assert.notEqual(actual, expected, '');
  assert.end();
});

test('Strict compilation with warning [async]', options, (assert) => {
  const executeWithWarning = execute.concat(['!warning']);
  const expected = 0;

  makensis.compile(null, {execute: executeWithWarning, strict: true})
  .catch(output => {
    assert.notEqual(output.status, expected, '');
    assert.end();
  });
});

test('Strict compilation with warning', options, (assert) => {
  const executeWithWarning = execute.concat(['!warning']);
  const expected = 0;
  const actual = makensis.compileSync(null, {execute: executeWithWarning, strict: true}).status;

  assert.notEqual(actual, expected, '');
  assert.end();
});
