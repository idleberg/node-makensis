// Dependencies
import * as makensis from '../dist/makensis';
import { spawnSync } from 'child_process';
import { exists, existsSync } from 'fs';
import { join } from 'path';
import test from 'ava';

// Generate script using compiler flags
const defaultScriptArray = [
  `OutFile ${nullDevice}`,
  `Section -default`,
  `Nop`,
  `SectionEnd`
];

const defaultScriptString = `
  OutFile ${nullDevice}
  Section -default
  Nop
  SectionEnd
`;

// These test require NSIS to be setup properly, with makensis in your
// PATH environmental variable
test('Wine found in PATH environmental variable', t => {
  const actual = spawnSync('which', ['wine']).stdout.toString().trim();

  t.not(actual, '');
});

// Expected values
const cmdHelp = spawnSync('wine', ['makensis', '-CMDHELP']).stderr.toString().trim().replace(/\r\n/g, '\n');
const hdrInfo = spawnSync('wine', ['makensis', '-HDRINFO']).stdout.toString().trim();
const outFile = spawnSync('wine', ['makensis', '-CMDHELP', 'OutFile']).stderr.toString().trim().replace(/\r\n/g, '\n');
const license = spawnSync('wine', ['makensis', '-LICENSE']).stdout.toString().trim();
const version = spawnSync('wine', ['makensis', '-VERSION']).stdout.toString().trim();

test('Print makensis version', t => {
  const expected = version;
  const actual = makensis.versionSync().stdout;

  t.is(actual, expected);
});

test('Print makensis version as JSON', t => {
  let expected = version;
  let actual = makensis.versionSync({ wine: true, json: true }).stdout;

  if (expected.startsWith('v')) {
    expected = expected.substr(1);
  }

  actual = JSON.stringify(actual);
  expected = JSON.stringify({ version: expected });

  t.is(actual, expected);
});

test('Print makensis version [async]', t => {
  return Promise.resolve(makensis.version({ wine: true }))
  .then(output => {
    const expected = version;
    const actual = output.stdout;

    t.is(actual, expected);
  })
  .catch();
});

test('Print makensis version as JSON [async]', t => {
  return Promise.resolve(makensis.version({ wine: true, json: true }))
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

test('Print makensis license', t => {
  let expected = license;
  let actual = makensis.licenseSync().stdout;

  t.is(actual, expected);
});

test('Print makensis license as JSON', t => {
  let expected = license;
  let actual = makensis.licenseSync({ wine: true, json: true }).stdout;

  actual = JSON.stringify(actual);
  expected = JSON.stringify({ license: expected });

  t.is(actual, expected);
});

test('Print makensis license [async]', t => {
  return Promise.resolve(makensis.license({ wine: true }))
  .then(output => {
    const expected = license;
    const actual = output.stdout;

    t.is(actual, expected);
  })
  .catch(output => {
    // NSIS < 3.03
    t.log('Legacy NSIS');
    const expected = license;
    const actual = output.stdout;

    t.is(actual, expected);
  });
});

test('Print makensis license as JSON [async]', t => {
  return Promise.resolve(makensis.license({ wine: true, json: true }))
  .then(output => {
    let expected = license;
    expected = JSON.stringify({ license: expected });

    let actual = output.stdout;
    actual.license = `${actual.license}`;
    actual = JSON.stringify(actual);

    t.is(actual, expected);
  })
  .catch(output => {
    // NSIS < 3.03
    t.log('Legacy NSIS');
    let expected = license;
    expected = JSON.stringify({ license: expected });

    let actual = output.stdout;
    actual.license = `${actual.license}`;
    actual = JSON.stringify(actual);

    t.is(actual, expected);
  });
});

test('Print compiler information', t => {
  const expected = hdrInfo;
  const actual = makensis.hdrInfoSync({ wine: true }).stdout;

  t.is(actual, expected);
});

test('Print compiler information as JSON', t => {
  const expected = true;
  const actual = makensis.hdrInfoSync({ wine: true, json: true }).stdout.defined_symbols.__GLOBAL__;

  t.is(actual, expected);
});

test('Print compiler information [async]', t => {
  return Promise.resolve(makensis.hdrInfo({ wine: true }))
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
  });
});

test('Print help for all commands', t => {
  const expected = cmdHelp;
  const actual = makensis.cmdHelpSync({ wine: true }).stdout;

  t.is(actual, expected);
});

test('Print help for all commands [async]', t => {
  return Promise.resolve(makensis.cmdHelp({ wine: true }))
  .then(output => {
    // const expected = cmdHelp;
    // const actual = output.stderr;

    // t.is(actual, expected);
    t.pass();
  })
  .catch(output => {
    // NSIS < 3.03
    t.log('Legacy NSIS');
    const expected = cmdHelp;
    const actual = output.stdout;

    t.is(actual, expected);
  });
});

test('Print help for OutFile command', t => {
  const expected = outFile;
  const actual = makensis.cmdHelpSync('OutFile', { wine: true }).stdout;

  t.is(actual, expected);
});

test('Print help for OutFile command [async]', t => {
  return Promise.resolve(makensis.cmdHelp('OutFile', { wine: true }))
  .then(output => {
    const expected = outFile;
    const actual = output.stdout;

    t.is(actual, expected);
  })
  .catch(output => {
    // NSIS < 3.03
    t.log('Legacy NSIS');
    const expected = outFile;
    const actual = output.stdout;

    t.is(actual, expected);
  });
});

test('Print help for OutFile command as JSON', t => {
  let expected = outFile;
  let actual = makensis.cmdHelpSync('OutFile', { wine: true, json: true }).stdout;

  actual = JSON.stringify(actual);
  expected = JSON.stringify({'help': expected });

  t.is(actual, expected);
});

test('Compilation from Array', t => {
  const expected = 0;
  const actual = makensis.compileSync(null, { wine: true, execute: defaultScriptArray }).status;

  t.is(actual, expected);
});

test('Compilation from String', t => {
  const expected = 0;
  const actual = makensis.compileSync(null, { wine: true, execute: defaultScriptString }).status;

  t.is(actual, expected);
});

test('Compilation from Array [async]', t => {
  return Promise.resolve(makensis.compile(null, { wine: true, execute: defaultScriptArray }))
  .then(output => {
    const expected = 0;
    const actual = output.status;

    t.is(actual, expected);
  })
  .catch();
});

test('Compilation from String [async]', t => {
  return Promise.resolve(makensis.compile(null, { wine: true, execute: defaultScriptString }))
  .then(output => {
    const expected = 0;
    const actual = output.status;

    t.is(actual, expected);
  })
  .catch();
});

test('Compilation with warning', t => {
  const scriptWithWarning = defaultScriptArray.concat(['!warning']);

  const expected = 0;
  const actual = makensis.compileSync(null, { wine: true, execute: scriptWithWarning }).status;

  t.is(actual, expected);
});

test('Compilation with warning as JSON', t => {
  const expected = 1;
  const scriptWithWarning = defaultScriptArray.concat(['!warning']);
  const actual = makensis.compileSync(null, { wine: true, execute: scriptWithWarning, json: true }).warnings;

  t.is(actual, expected);
});

test('Compilation with warning [async]', t => {
  const scriptWithWarning = defaultScriptArray.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, { wine: true, execute: scriptWithWarning }))
  .then( output => {
    const expected = 0;
    const actual = output.status;

    t.is(actual, expected);
  })
  .catch();
});

test('Compilation with warning as JSON [async]', t => {
  const scriptWithWarning = defaultScriptArray.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, { wine: true, execute: scriptWithWarning, json: true }))
  .then( output => {
    const expected = 1;
    const actual = output.warnings;

    t.is(actual, expected);
  })
  .catch();
});

test('Compilation with error', t => {
  const scriptWithError = defaultScriptArray.concat(['!error']);

  const expected = 0;
  const actual = makensis.compileSync(null, { wine: true, execute: scriptWithError }).status;

  t.not(actual, expected);
});

test('Compilation with error [async]', t => {
  let scriptWithError = defaultScriptArray.concat(['!error']);

  return Promise.resolve(makensis.compile(null, { wine: true, execute: scriptWithError }))
  .catch(output => {
    const expected = 0;
    const actual = output.status;

    t.not(actual, expected)
  });
});

test('Strict compilation with warning', t => {
  const scriptWithWarning = defaultScriptArray.concat(['!warning']);

  const expected = 0;
  const actual = makensis.compileSync(null, { wine: true, execute: scriptWithWarning, strict: true}).status;

  t.not(actual, expected);
});

test('Strict compilation with warning [async]', t => {
  const scriptWithWarning = defaultScriptArray.concat(['!warning']);

  return Promise.resolve(makensis.compile(null, { wine: true, execute: scriptWithWarning, strict: true}))
  .catch(output => {
    const expected = 0;
    const actual = output.status;

    t.not(actual, expected)
  });
});

test('Print ${NSISDIR}', t => {
  const nsisDir = makensis.nsisDirSync({ wine: true});
  let nsisCfg = spawnSync('winepath', [nsisDir]).stdout.toString().trim();
  nsisCfg = join(nsisCfg, 'Include', 'MUI2.nsh');

  const expected = true;
  const actual = existsSync(nsisCfg);

  t.is(actual, expected);
});

test('Print ${NSISDIR} [async]', t => {
  return Promise.resolve(makensis.nsisDir({ wine: true}))
  .then(nsisDir => {
    let nsisCfg = spawnSync('winepath', [nsisDir]).stdout.toString().trim();
    nsisCfg = join(nsisCfg, 'Include', 'MUI2.nsh');

    const expected = true;
    const actual = existsSync(nsisCfg);

    t.is(actual, expected)
  });
});

test('Print ${NSISDIR} as JSON', t => {
  const nsisDir = makensis.nsisDirSync({ wine: true, json: true}).nsisdir;
  const nsisCfg = join(nsisDir, 'Include', 'MUI2.nsh');

  const expected = true;
  const actual = existsSync(nsisCfg);

  t.is(actual, expected);
});

test('Print ${NSISDIR} as JSON [async]', t => {
  return Promise.resolve(makensis.nsisDir({ wine: true, json: true}))
  .then(output => {
    const nsisCfg = join(output.nsisdir, 'Include', 'MUI2.nsh');

    const expected = true;
    const actual = existsSync(nsisCfg);

    t.is(actual, expected)
  });
});
