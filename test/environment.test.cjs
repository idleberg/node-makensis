/* eslint-disable */
const { nullDevice, shared } = require('./shared');
const MakeNSIS = require('../dist/makensis.cjs');
const path = require('path');
const test = require('ava');
const uuid = require('uuid').v4;
const which = require('which');

const scriptFile = path.join(__dirname, 'fixtures', 'env.nsi')
const randomString = uuid();

process.env['NSIS_APP_MAGIC_ENVIRONMENT_VARIABLE'] = randomString;

// Let's run the tests
test(`MakeNSIS ${shared.version} found in PATH environmental variable`, async t => {
    const actual = await which('makensis');

    t.not(actual, '');
});

test('Define magic environment variable', (t) => {
  const { stdout } = MakeNSIS.compile.sync(scriptFile, {
      define: {
          NULL_DEVICE: nullDevice,
      },
  });

  const expected = true;
  const actual = stdout.includes(randomString);

  t.is(actual, expected);
});

test('Define magic environment variable [async]', async t => {
  try {
      const { stdout } = await MakeNSIS.compile(scriptFile, {
          define: {
              NULL_DEVICE: nullDevice,
          },
          verbose: 4
      });

      const expected = true;
      const actual = stdout.includes(randomString);

      t.is(actual, expected);
  } catch ({ stderr }) {
      t.fail(stderr);
  }
});
