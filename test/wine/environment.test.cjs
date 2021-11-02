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
  dotEnv: true,
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
