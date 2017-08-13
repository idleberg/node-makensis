const makensis = require('../dist/makensis');
const path = require('path');
const { spawnSync } = require('child_process');
const { test } = require('tape');

const script = path.join(__dirname, 'pass.nsi');

// Skip test when makensis isn't installed
const hasMakensis = spawnSync('makensis');
let options = {};
if (typeof hasMakensis.error !== 'undefined') {
  options.skip = true;
}

test('Compile script [async]', options, (assert) => {
  const expected = 0;
  let actual;

  makensis.compile(script)
  .then(output => {
      assert.equal(output.status, expected, 'should be equal');
      assert.end();
  }).
  catch();
});

test('Compile script with error [async]', options, (assert) => {
  const expected = 0;
  let actual;

  makensis.compile(script, {execute: ['!error']})
  .then()
  .catch(output => {
      assert.notEqual(output.status, expected, 'should not be equal');
      assert.end();
  });
});

test('Compile script', options, (assert) => {
  const expected = 0;
  const actual = makensis.compileSync(script).status;

  assert.equal(actual, expected, '- should be equal');
  assert.end();
});

test('Get command help', options, (assert) => {
  const expected = spawnSync('makensis', ['-CMDHELP', 'OutFile']).stdout.toString().trim();
  const actual = makensis.helpSync('OutFile').stdout;

  assert.equal(actual, expected, '- should be equal');
  assert.end();
});

test('Print makensis version', options, (assert) => {
  const expected = spawnSync('makensis', ['-VERSION']).stdout.toString().trim();
  const actual = makensis.versionSync().stdout;

  assert.equal(actual, expected, '- should be equal');
  assert.end();
});