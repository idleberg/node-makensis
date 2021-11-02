/* eslint-disable */
import { createRequire } from 'node:module';
import { v4 as uuid } from 'uuid';
import MakeNSIS from '../dist/makensis.cjs';
import path from 'path';
import test from 'ava';
import which from 'which';

// Temporary workarounds
const require = createRequire(import.meta.url);
const { nullDevice, shared } = require('./shared');
const __dirname = path.resolve(path.dirname(''));

const scriptFile = path.join(__dirname, 'fixtures', 'env.nsi')
const randomString = uuid();

const defaultOptions = {
  define: {
      NULL_DEVICE: nullDevice,
  },
  env: true,
  verbose: 4
};

process.env['NSIS_APP_MAGIC_ENVIRONMENT_VARIABLE'] = randomString;

// Let's run the tests
test(`MakeNSIS ${shared.version} found in PATH environmental variable`, async t => {
    const actual = await which('makensis');

    t.not(actual, '');
});

test('Define magic environment variable', (t) => {
  const { stdout } = MakeNSIS.compile.sync(scriptFile.minimal, defaultOptions);

  const expected = true;
  const actual = stdout.includes(randomString);

  t.is(actual, expected);
});

test('Define magic environment variable [async]', async t => {
  try {
      const { stdout } = await MakeNSIS.compile(scriptFile, defaultOptions);

      const expected = true;
      const actual = stdout.includes(randomString);

      t.is(actual, expected);
  } catch ({ stderr }) {
      t.fail(stderr);
  }
});
