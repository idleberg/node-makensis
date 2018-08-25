import { mapArguments, objectify, spawnMakensis, spawnMakensisSync } from './util';

/**
 * Returns usage information for a command, or list all commands
 * @param command - an NSIS command
 * @param options - compiler options
 * @returns - usage description
 */
const cmdHelp = (command: string = '', options: CompilerOptions = {}) => {
  options = { ...options, verbose: 0 };

  const p = mapArguments(['-CMDHELP'], options);

  if (typeof command !== 'undefined' && typeof command !== 'object' && command !== '') {
    p.args.push(command);
  }

  return spawnMakensis(p.cmd, p.args, p.opts);
};

/**
 * Returns usage information for a command, or list all commands
 * @param command - an NSIS command
 * @param options - compiler options
 * @returns - usage description
 */
const cmdHelpSync = (command: string = '', options: CompilerOptions = {}) => {
  options = { ...options, verbose: 0 };

  const p = mapArguments(['-CMDHELP'], options);

  if (typeof command !== 'undefined' && typeof command !== 'object' && command !== '') {
    p.args.push(command);
  }

  return spawnMakensisSync(p.cmd, p.args, p.opts);
};

/**
 * Returns information about which options were used to compile MakeNSIS
 * @param options - compiler options
 * @returns - compiler options
 */
const hdrInfo =  (options: CompilerOptions = {}) => {
  options = { ...options, verbose: 0 };

  const p = mapArguments(['-HDRINFO'], options);

  return spawnMakensis(p.cmd, p.args, p.opts);
};

/**
 * Returns information about which options were used to compile MakeNSIS
 * @returns - compiler options
 */
const hdrInfoSync = (options: CompilerOptions = {}) => {
  options = { ...options, verbose: 0 };

  let p = mapArguments(['-HDRINFO'], options);

  return spawnMakensisSync(p.cmd, p.args, p.opts);
};

/**
 * Compile specified script with MakeNSIS
 * @param} script - path to NSIS script
 * @param options - compiler options
 */
const compile = (script: string, options: CompilerOptions = {}) => {
  const p = mapArguments([], options);

  if (script) {
    if (p.cmd === 'wine') {
      p.args.push('--');
    }
    p.args.push(script);
  }

  if (typeof options.postExecute !== 'undefined') {
    if (typeof options.postExecute === 'string') {
      p.args.push(`-X${options.postExecute}`);
    } else {
      options.postExecute.forEach((key) => {
        p.args.push(`-X${key}`);
      });
    }
  }

  return spawnMakensis(p.cmd, p.args, p.opts);
};

/**
 * Compile specified script with MakeNSIS
 * @param script - path to NSIS script
 * @param options - compiler options
 */
const compileSync = (script: string, options: CompilerOptions = {}) => {
  let p = mapArguments([], options);

  if (script) {
    if (p.cmd === 'wine') {
      p.args.push('--');
    }
    p.args.push(script);
  }

  if (typeof options.postExecute !== 'undefined') {
    if (typeof options.postExecute === 'string') {
      p.args.push(`-X${options.postExecute}`);
    } else {
      options.postExecute.forEach((key) => {
        p.args.push(`-X${key}`);
      });
    }
  }

  return spawnMakensisSync(p.cmd, p.args, p.opts);
};

/**
 * Returns version of MakeNSIS
 * @param options - compiler options
 * @returns - compiler version
 */
const version = (options: CompilerOptions = {}) => {
  options = { ...options, verbose: 0 };

  const p = mapArguments(['-VERSION'], options);

  return spawnMakensis(p.cmd, p.args, p.opts);
};

/**
 * Returns version of MakeNSIS
 * @param options - compiler options
 * @returns - compiler version
 */
const versionSync = (options: CompilerOptions = {}) => {
  options = { ...options, verbose: 0 };

  const p = mapArguments(['-VERSION'], options);

  return spawnMakensisSync(p.cmd, p.args, p.opts);
};

/**
 * Returns MakeNSIS software license
 * @param options - compiler options
 * @returns - compiler license
 */
const license = (options: CompilerOptions = {}) => {

  const p = mapArguments(['-LICENSE'], options);

  return spawnMakensis(p.cmd, p.args, p.opts);
};

/**
 * Returns MakeNSIS software license
 * @param options - compiler options
 * @returns - compiler license
 */
const licenseSync = (options: CompilerOptions = {}) => {
  const p = mapArguments(['-LICENSE'], options);

  return spawnMakensisSync(p.cmd, p.args, p.opts);
};

/**
 * Returns NSIS directory
 * @param options - compiler options
 * @returns - compiler version
 */
const nsisDir = (options: CompilerOptions = {}) => {
  const hdrOptions = { ...options, json: true };
  const output: any = hdrInfo(hdrOptions);

  return Promise.resolve(output)
  .then(hdrinfo => {
    if (options.json === true) {
      return objectify(hdrinfo.stdout.defined_symbols.NSISDIR, 'nsisdir');
    }

    return hdrinfo.stdout.defined_symbols.NSISDIR;
  })
  .catch(hdrinfo => {
    // NSIS < 3.03
    if (options.json === true) {
      return objectify(hdrinfo.stdout.defined_symbols.NSISDIR, 'nsisdir');
    }

    return hdrinfo.stdout.defined_symbols.NSISDIR;
  });
};

/**
 * Returns NSIS directory
 * @param options - compiler options
 * @returns - compiler version
 */
const nsisDirSync = (options: CompilerOptions = {}) => {
  const hdrOptions = { ...options, json: true };
  const hdrinfo: any = hdrInfoSync(hdrOptions);

  if (options.json === true) {
      return objectify(hdrinfo.stdout.defined_symbols.NSISDIR, 'nsisdir');
    }

  return hdrinfo.stdout.defined_symbols.NSISDIR;
};

export {
  cmdHelp,
  cmdHelpSync,
  compile,
  compileSync,
  hdrInfo,
  hdrInfoSync,
  license,
  licenseSync,
  nsisDir,
  nsisDirSync,
  version,
  versionSync
};
