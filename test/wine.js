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


// These test require NSIS to be setup properly, with makensis in your
// PATH environmental variable
test('Wine found in PATH environmental variable', t => {
  const actual = spawnSync('which', ['wine']).stdout.toString().trim();

  t.not(actual, '');
});

// Expected values
const version = spawnSync('wine', ['makensis', '-VERSION']).stdout.toString().trim();
const hdrInfo = spawnSync('wine', ['makensis', '-HDRINFO']).stdout.toString().trim();
const cmdHelp = spawnSync('wine', ['makensis', '-CMDHELP']).stderr.toString().trim();
const outFile = spawnSync('wine', ['makensis', '-CMDHELP', 'OutFile']).stderr.toString().trim();

test('Wine: Print makensis version', t => {
  const expected = version;
  const actual = makensis.versionSync().stdout;

  t.is(actual, expected);
});

test('Wine: Print makensis version as JSON', t => {
  let expected = version;
  let actual = makensis.versionSync({wine: true, json: true}).stdout;

  if (expected.startsWith('v')) {
    expected = expected.substr(1);
  }

  actual = JSON.stringify(actual);
  expected = JSON.stringify({ version: expected });

  t.is(actual, expected);
});

test('Wine: Print makensis version [async]', t => {
  return Promise.resolve(makensis.version({wine: true}))
  .then(output => {
    const expected = version;
    const actual = output.stdout;

    t.is(actual, expected);
  })
  .catch();
});

test('Wine: Print makensis version as JSON [async]', t => {
  return Promise.resolve(makensis.version({wine: true, json: true}))
  .then(output => {
    let expected = version;

    if (expected.startsWith('v')) {
      expected = expected.substr(1);
    }
    expected = JSON.stringify({ version: expected });

    let actual = output.stdout;
    actual.version = `${actual.version}`;
    actual = JSON.stringify(actual);

    t.is(actual, expected);
  })
  .catch();
});

test('Wine: Print compiler information', t => {
  const expected = hdrInfo;
  const actual = makensis.hdrInfoSync({wine: true}).stdout;

  t.is(actual, expected);
});

test('Wine: Print compiler information as JSON', t => {
  const expected = true;
  const actual = makensis.hdrInfoSync({wine: true, json: true}).stdout.defined_symbols.__GLOBAL__;

  t.is(actual, expected);
});

test('Wine: Print compiler information [async]', t => {
  return Promise.resolve(makensis.hdrInfo({wine: true}))
  .then(output => {
    const expected = hdrInfo;
    const actual = output.stdout;

    t.is(actual, expected);
  })
  .catch(output => {
    // NSIS < 3.03
    t.log('Legacy NSIS');
    const expected = hdrInfo;
    const actual = output.stdout;

    t.is(actual, expected);
  })
});

test('Wine: Print help for all commands', t => {
  const expected = cmdHelp;
  const actual = makensis.cmdHelpSync({wine: true}).stdout;

  t.is(actual, expected);
});

// test('Wine: Print help for all commands [async]', t => {
//   return Promise.resolve(makensis.cmdHelp({wine: true}))
//   .then(output => {
//     // const expected = cmdHelp;
//     // const actual = output.stderr;

//     // t.is(actual, expected);
//     t.pass();
//   })
//   .catch(output => {
//     // NSIS < 3.03
//     t.log('Legacy NSIS');
//     const expected = cmdHelp;
//     const actual = output.stdout;

//     t.is(actual, expected);
//   });
// });

// test('Wine: Print help for OutFile command', t => {
//   const expected = outFile;
//   const actual = makensis.cmdHelpSync('OutFile', {wine: true}).stdout;

//   t.is(actual, expected);
// });

// test('Wine: Print help for OutFile command [async]', t => {
//   return Promise.resolve(makensis.cmdHelp('OutFile', {wine: true}))
//   .then(output => {
//     const expected = outFile;
//     const actual = output.stdout;

//     t.is(actual, expected);
//   })
//   .catch(output => {
//     // NSIS < 3.03
//     t.log('Legacy NSIS');
//     const expected = outFile;
//     const actual = output.stdout;

//     t.is(actual, expected);
//   });
// });

// test('Wine: Print help for OutFile command as JSON', t => {
//   let expected = outFile;
//   let actual = makensis.cmdHelpSync('OutFile', {wine: true, json: true}).stdout;

//   actual = JSON.stringify(actual);
//   expected = JSON.stringify({'help': expected });

//   t.is(actual, expected);
// });

test('Wine: Compilation', t => {
  const expected = 0;
  const actual = makensis.compileSync(null, {wine: true, execute: scriptDefault}).status;

  t.is(actual, expected);
});

test('Wine: Compilation [async]', t => {
  return Promise.resolve(makensis.compile(null, {wine: true, execute: scriptDefault}))
  .then(output => {
    const expected = 0;
    const actual = output.status;

    t.is(actual, expected);
  })
  .catch();
});

test('Wine: Compilation with warning', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  const expected = 0;
  const actual = makensis.compileSync(null, {wine: true, execute: scriptWithWarning}).status;

  t.is(actual, expected);
});

test('Wine: Compilation with warning as JSON', t => {
  const expected = 1;
  const scriptWithWarning = scriptDefault.concat(['!warning']);
  const actual = makensis.compileSync(null, {wine: true, execute: scriptWithWarning, json: true}).warnings;

  t.is(actual, expected);
});

test('Wine: Compilation with warning [async]', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, {wine: true, execute: scriptWithWarning}))
  .then( output => {
    const expected = 0;
    const actual = output.status;

    t.is(actual, expected);
  })
  .catch();
});

test('Wine: Compilation with warning as JSON [async]', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, {wine: true, execute: scriptWithWarning, json: true}))
  .then( output => {
    const expected = 1;
    const actual = output.warnings;

    t.is(actual, expected);
  })
  .catch();
});

test('Wine: Compilation with error', t => {
  const scriptWithError = scriptDefault.concat(['!error']);

  const expected = 0;
  const actual = makensis.compileSync(null, {wine: true, execute: scriptWithError}).status;

  t.not(actual, expected);
});

test('Wine: Compilation with error [async]', t => {
  let scriptWithError = scriptDefault.concat(['!error']);

  return Promise.resolve(makensis.compile(null, {wine: true, execute: scriptWithError}))
  .catch(output => {
    const expected = 0;
    const actual = output.status;

    t.not(actual, expected)
  });
});

test('Wine: Strict compilation with warning', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  const expected = 0;
  const actual = makensis.compileSync(null, {wine: true, execute: scriptWithWarning, strict: true}).status;

  t.not(actual, expected);
});

test('Wine: Strict compilation with warning [async]', t => {
  const scriptWithWarning = scriptDefault.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, {wine: true, execute: scriptWithWarning, strict: true}))
  .catch(output => {
    const expected = 0;
    const actual = output.status;

    t.not(actual, expected)
  });
});
