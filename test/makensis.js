const makensis = require('../dist/makensis');
const path = require('path');
const { spawnSync } = require('child_process');
const { test } = require('tape');

// Generate script using compiler flags
const compilerOpts = {
  execute: [
    'OutFile test.exe',
    'Section -default',
    'Nop',
    'SectionEnd'
  ]
};

// Skip test when makensis isn't installed
const hasMakensis = spawnSync('makensis');
let tapeOpts = {};
if (typeof hasMakensis.error !== 'undefined') {
  tapeOpts.skip = true;
}

// Let's run the tests
test('Print makensis version', tapeOpts, (assert) => {
  const expected = spawnSync('makensis', ['-VERSION']).stdout.toString().trim();
  const actual = makensis.versionSync().stdout;

  assert.equal(actual, expected, '- should be equal');
  assert.end();
});

test('Get command help', tapeOpts, (assert) => {
  const expected = spawnSync('makensis', ['-CMDHELP', 'OutFile']).stdout.toString().trim();
  const actual = makensis.helpSync('OutFile').stdout;

  assert.equal(actual, expected, '- should be equal');
  assert.end();
});

test('Compile script [async]', tapeOpts, (assert) => {
  const expected = 0;
  let actual;

  makensis.compile(null, compilerOpts)
  .then(output => {
      assert.equal(output.status, expected, 'should be equal');
      assert.end();
  }).
  catch();
});

test('Compile script', tapeOpts, (assert) => {
  const expected = 0;
  const actual = makensis.compileSync(null, compilerOpts).status;

  assert.equal(actual, expected, '- should be equal');
  assert.end();
});

test('Compile script with error [async]', tapeOpts, (assert) => {
  const expected = 0;
  let actual;

  let opts = compilerOpts;
  opts.execute.unshift('!error');

  makensis.compile(null, opts)
  .then()
  .catch(output => {
      assert.notEqual(output.status, expected, 'should not be equal');
      assert.end();
  });
});