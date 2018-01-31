// Dependencies
import * as makensis from '../dist/makensis';
import { spawnSync } from 'child_process';
import { test } from 'ava';

// Generate script using compiler flags
const scriptDefault = [
'OutFile test.exe',
'Section -default',
'Nop',
'SectionEnd'
];

// Let's run the tests
test('MakeNSIS found in PATH environmental variable', t => {
  const actual = spawnSync('which', ['makensis']).stdout.toString().trim();

  t.not(actual, '');
});

test('Print makensis version', t => {
  const expected = spawnSync('makensis', ['-VERSION']).stdout.toString().trim();
  const actual = makensis.versionSync().stdout;

  t.is(actual, expected);
});

test('Print makensis version as JSON', t => {
  let expected = spawnSync('makensis', ['-VERSION']).stdout.toString().trim();
  let actual = makensis.versionSync({json: true}).stdout;

  actual.version = `v${actual.version}`;
  actual = JSON.stringify(actual);
  expected = JSON.stringify({ version: expected });

  t.is(actual, expected);
});

test('Print makensis version [async]', t => {
  return Promise.resolve(makensis.version())
  .then(output => {
    const expected = spawnSync('makensis', ['-VERSION']).stdout.toString().trim();
    const actual = output.stdout;

    t.is(actual, expected);
  })
  .catch(error => {
    t.fail(error)
  });
});

test('Print makensis version as JSON [async]', t => {
  return Promise.resolve(makensis.version({json: true}))
  .then(output => {
    let expected = spawnSync('makensis', ['-VERSION']).stdout.toString().trim();
    expected = JSON.stringify({ version: expected });

    let actual = output.stdout;
    actual.version = `v${actual.version}`;
    actual = JSON.stringify(actual);

    t.is(actual, expected);
  })
  .catch(error => {
    t.fail(error)
  });
});

test('Print compiler information', t => {
  const expected = spawnSync('makensis', ['-HDRINFO']).stdout.toString().trim();
  const actual = makensis.hdrInfoSync().stdout;

  t.is(actual, expected);
});

test('Print compiler information as JSON', t => {
  const expected = true;
  const actual = makensis.hdrInfoSync({json: true}).stdout.defined_symbols.__GLOBAL__;

  t.is(actual, expected);
});

test('Print compiler information [async]', t => {
  return Promise.resolve(makensis.hdrInfo())
  .then(output => {
    const expected = spawnSync('makensis', ['-HDRINFO']).stderr.toString().trim();
    const actual = output.stderr;

    t.is(actual, expected);
  })
  .catch(error => {
    t.fail(error)
  });
});

test('Print compiler information as JSON [async]', t => {
  return Promise.resolve(makensis.hdrInfo({json: true}))
  .then(output => {
    const expected = true;
    const actual = output.stdout.defined_symbols.__GLOBAL__;

    t.is(actual, expected);
  })
  .catch(error => {
    t.fail(error)
  });
});

test('Print help for all commands', t => {
  const expected = spawnSync('makensis', ['-CMDHELP']).stdout.toString().trim();
  const actual = makensis.cmdHelpSync().stdout;

  t.is(actual, expected);
});

// test('Print help for all commands [async]', t => {
//   return Promise.resolve(makensis.cmdHelp())
//   .then(output => {
//     const expected = spawnSync('makensis', ['-CMDHELP']).stdout.toString().trim();
//     const actual = output.stdout;

//     t.is(actual, expected);
//   })
//   .catch(error => {
//     t.fail(error)
//   });
// });

test('Print help for all commands as JSON', t => {
  let expected = spawnSync('makensis', ['-CMDHELP']).stderr.toString().trim();
  let actual = makensis.cmdHelpSync(null, {json: true}).stderr;

  actual = JSON.stringify(actual);
  expected = JSON.stringify({help: expected });

  t.is(actual, expected);
});

test('Print help for OutFile command', t => {
  const expected = spawnSync('makensis', ['-CMDHELP', 'OutFile']).stdout.toString().trim();
  const actual = makensis.cmdHelpSync('OutFile').stdout;

  t.is(actual, expected);
});

// test('Print help for OutFile command [async]', t => {
//   return Promise.resolve(makensis.cmdHelp(OutFile'))
//   .then(output => {
//     const expected = spawnSync('makensis', ['-CMDHELP', OutFile']).stdout.toString().trim();
//     const actual = output.stdout;

//     t.is(actual, expected);
//   })
//   .catch(error => {
//     t.fail(error)
//   });
// });

test('Print help for OutFile command as JSON', t => {
  let expected = spawnSync('makensis', ['-CMDHELP', 'OutFile']).stderr.toString().trim();
  let actual = makensis.cmdHelpSync('OutFile', {json: true}).stderr;

  actual = JSON.stringify(actual);
  expected = JSON.stringify({help: expected });

  t.is(actual, expected);
});

test('Compilation', t => {
  const expected = 0;
  const actual = makensis.compileSync(null, {execute: scriptDefault}).status;

  t.is(actual, expected);
});

test('Compilation [async]', t => {
  return Promise.resolve(makensis.compile(null, {execute: scriptDefault}))
  .then(output => {
    const expected = 0;
    const actual = output.status;

    t.is(actual, expected);
  })
  .catch(error => {
    t.fail(error)
  });
});

test('Compilation with warning', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  const expected = 0;
  const actual = makensis.compileSync(null, {execute: scriptWithWarning}).status;

  t.is(actual, expected);
});

test('Compilation with warning as JSON', t => {
  const expected = true;
  const scriptWithWarning = scriptDefault.concat(['!warning']);
  const actual = makensis.compileSync(null, {execute: scriptWithWarning, json: true}).warnings;

  t.is(actual, expected);
});

test('Compilation with warning [async]', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, {execute: scriptWithWarning}))
  .then( output => {
    const expected = 0;
    const actual = output.status;

    t.is(actual, expected);
  })
  .catch(error => {
    t.fail(error)
  });
});

test('Compilation with warning as JSON [async]', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, {execute: scriptWithWarning, json: true}))
  .then( output => {
    const expected = true;
    const actual = output.warnings;

    t.is(actual, expected);
  })
  .catch(error => {
    t.fail(error)
  });
});

test('Compilation with error', t => {
  const scriptWithError = scriptDefault.concat(['!error']);

  const expected = 0;
  const actual = makensis.compileSync(null, {execute: scriptWithError}).status;

  t.not(actual, expected);
});

test('Compilation with error [async]', t => {
  let scriptWithError = scriptDefault.concat(['!error']);

  return Promise.resolve(makensis.compile(null, {execute: scriptWithError}))
  .catch(output => {
    const expected = 0;
    const actual = output.status;

    t.not(actual, expected)
  });
});

test('Strict compilation with warning', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  const expected = 0;
  const actual = makensis.compileSync(null, {execute: scriptWithWarning, strict: true}).status;

  t.not(actual, expected);
});

test('Strict compilation with warning [async]', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, {execute: scriptWithWarning, strict: true}))
  .catch(output => {
    const expected = 0;
    const actual = output.status;

    t.not(actual, expected)
  });
});
