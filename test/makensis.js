const makensis = require('../dist/makensis');
const path = require('path');
const { spawnSync } = require('child_process');
const { test } = require('tape');

// Generate script using compiler flags
const script = {
  execute: [
    'OutFile test.exe',
    'Section -default',
    'Nop',
    'SectionEnd'
  ]
};

// Skip test when makensis isn't installed
const hasMakensis = spawnSync('makensis');
let options = {};
if (typeof hasMakensis.error !== 'undefined') {
  options.skip = true;
}

// Let's run the tests
test('Print makensis version', options, (assert) => {
  const expected = spawnSync('makensis', ['-VERSION']).stdout.toString().trim();
  const actual = makensis.versionSync().stdout;

  assert.equal(actual, expected, '- should be equal');
  assert.end();
});

test('Get command help', options, (assert) => {
  const expected = spawnSync('makensis', ['-CMDHELP']).stdout.toString().trim();
  const actual = makensis.cmdhelpSync().stdout;

  assert.equal(actual, expected, '- should be equal');
  assert.end();
});

test('Get help for OutFile command', options, (assert) => {
  const expected = spawnSync('makensis', ['-CMDHELP', 'OutFile']).stdout.toString().trim();
  const actual = makensis.cmdhelpSync('OutFile').stdout;

  assert.equal(actual, expected, '- should be equal');
  assert.end();
});

test('Compile script [async]', options, (assert) => {
  const expected = 0;

  makensis.compile(null, script)
  .then(output => {
      assert.equal(output.status, expected, 'should be equal');
      assert.end();
  }).
  catch();
});

test('Compile script', options, (assert) => {
  const expected = 0;
  const actual = makensis.compileSync(null, script).status;

  assert.equal(actual, expected, '- should be equal');
  assert.end();
});

test('Compile script with error [async]', options, (assert) => {
  let errorScript = script;
  errorScript.execute.push('!error');

  const expected = 0;

  makensis.compile(null, errorScript)
  .then()
  .catch(output => {
      assert.notEqual(output.status, expected, 'should not be equal');
      assert.end();
  });
});

test('Compile script with error', options, (assert) => {
  let errorScript = script;
  errorScript.execute.push('!error');

  const expected = 0;
  const actual = makensis.compileSync(null, errorScript).status;

  assert.notEqual(actual, expected, '- should not be equal');
  assert.end();
});
