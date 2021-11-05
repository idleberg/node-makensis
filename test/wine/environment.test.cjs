/* eslint-disable */
const { nullDevice } = require('../shared');
const MakeNSIS = require('../../dist/makensis.cjs');
const path = require('path');
const test = require('ava');
const uuid = require('uuid').v4;

const scriptFile = path.join(__dirname, '..', 'fixtures', 'env.nsi')
const randomString = uuid();

const defaultOptions = {
  define: {
      NULL_DEVICE: nullDevice,
  },
  verbose: 4,
  wine: true
};

// Let's run the tests
test('Load magic environment variable from file', (t) => {
  const { stdout } = MakeNSIS.compile.sync(scriptFile, {
    ...defaultOptions,
    env: path.join(__dirname, '..', 'fixtures', '.env')
  });

  const expected = true;
  const actual = stdout.includes('dotenv:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

  t.is(actual, expected);
});

test('Load magic environment variable from file [async]', async t => {
  try {
      const { stdout } = await MakeNSIS.compile(scriptFile, {
        ...defaultOptions,
        env: path.join(__dirname, '..', 'fixtures', '.env')
      });

      const expected = true;
      const actual = stdout.includes('dotenv:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

      t.is(actual, expected);
  } catch ({ stderr }) {
      t.fail(stderr);
  }
});

test('Load magic environment variable from process', (t) => {
  const uuid = `process.env:${randomString}`;
  process.env['NSIS_APP_MAGIC_ENVIRONMENT_VARIABLE'] = uuid;

  const { stdout } = MakeNSIS.compile.sync(scriptFile, {
    ...defaultOptions,
    env: true
  });

  const expected = true;
  const actual = stdout.includes(uuid);

  t.is(actual, expected);
});

test('Load magic environment variable from process [async]', async t => {
  const uuid = `process.env:${randomString}`;
  process.env['NSIS_APP_MAGIC_ENVIRONMENT_VARIABLE'] = uuid;

  try {
      const { stdout } = await MakeNSIS.compile(scriptFile, {
        ...defaultOptions,
        env: true
      });

      const expected = true;
      const actual = stdout.includes(uuid);

      t.is(actual, expected);
  } catch ({ stderr }) {
      t.fail(stderr);
  }
});

test('Ignore magic environment variable', (t) => {
  process.env['NSIS_APP_MAGIC_ENVIRONMENT_VARIABLE'] = `process.env:${randomString}`;

  const { stdout } = MakeNSIS.compile.sync(scriptFile, {
    ...defaultOptions,
    env: false
  });

  const expected = true;
  const actual = stdout.includes('${NSIS_APP_MAGIC_ENVIRONMENT_VARIABLE}');

  t.is(actual, expected);
});

test('Ignore magic environment variable [async]', async t => {
  process.env['NSIS_APP_MAGIC_ENVIRONMENT_VARIABLE'] = `process.env:${randomString}`;

  try {
      const { stdout } = await MakeNSIS.compile(scriptFile, {
        ...defaultOptions,
        env: false
      });

      const expected = true;
      const actual = stdout.includes('${NSIS_APP_MAGIC_ENVIRONMENT_VARIABLE}');

      t.is(actual, expected);
  } catch ({ stderr }) {
      t.fail(stderr);
  }
});
