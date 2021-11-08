/* eslint-disable */
import { createRequire } from 'node:module';
import { v4 as uuid } from 'uuid';
import * as MakeNSIS from '../../dist/makensis.mjs';
import path from 'node:path';
import test from 'ava';

// Temporary workarounds
const require = createRequire(import.meta.url);
const { nullDevice } = require('../shared');
const __dirname = path.resolve(path.dirname(''));

const scriptFile = path.join(__dirname, 'test', 'fixtures', 'env.nsi')
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
    env: path.join(__dirname, 'test', 'fixtures', '.env')
  });

  const expected = true;
  const actual = stdout.includes('dotenv:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

  t.is(actual, expected);
});

test('Load magic environment variable from file [async]', async t => {
  try {
      const { stdout } = await MakeNSIS.compile(scriptFile, {
        ...defaultOptions,
        env: path.join(__dirname, 'test', 'fixtures', '.env')
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
