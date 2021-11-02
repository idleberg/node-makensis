/* eslint-disable */
import { createRequire } from 'node:module';
import { v4 as uuid } from 'uuid';
import MakeNSIS from '../../dist/makensis.cjs';
import path from 'path';
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
  env: true,
  verbose: 4,
  wine: true
};

process.env['NSIS_APP_MAGIC_ENVIRONMENT_VARIABLE'] = randomString;

// Let's run the tests

test('Define magic environment variable', (t) => {
  const { stdout } = MakeNSIS.compile.sync(scriptFile, defaultOptions);

  const expected = true;
  const actual = stdout.includes(`UUID:${randomString}`);

  t.is(actual, expected);
});

test('Define magic environment variable [async]', async t => {
  try {
      const { stdout } = await MakeNSIS.compile(scriptFile, defaultOptions);

      const expected = true;
      const actual = stdout.includes(`UUID:${randomString}`);

      t.is(actual, expected);
  } catch ({ stderr }) {
      t.fail(stderr);
  }
});
