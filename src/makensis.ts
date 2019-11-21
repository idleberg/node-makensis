import { mapArguments, objectify, spawnMakensis, spawnMakensisSync } from './util';
import { SpawnOptions } from 'child_process';

/**
 * Returns usage information for a command, or list all commands
 * @param command - an NSIS command
 * @param options - compiler options
 * @returns - usage description
 */
const cmdHelp = (command: string = '', options: CompilerOptions = {}, spawnOpts: SpawnOptions = {}) => {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-CMDHELP'], options);

  if (typeof command !== 'undefined' && typeof command !== 'object' && command !== '') {
    args.push(command);
  }

  return spawnMakensis(cmd, args, opts, spawnOpts);
};

/**
 * Returns usage information for a command, or list all commands
 * @param command - an NSIS command
 * @param options - compiler options
 * @returns - usage description
 */
const cmdHelpSync = (command: string = '', options: CompilerOptions = {}, spawnOpts: SpawnOptions = {}) => {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-CMDHELP'], options);

  if (typeof command !== 'undefined' && typeof command !== 'object' && command !== '') {
    args.push(command);
  }

  return spawnMakensisSync(cmd, args, opts, spawnOpts);
};

/**
 * Returns information about which options were used to compile MakeNSIS
 * @param options - compiler options
 * @returns - compiler options
 */
const hdrInfo =  (options: CompilerOptions = {}, spawnOpts: SpawnOptions = {}) => {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-HDRINFO'], options);

  return spawnMakensis(cmd, args, opts, spawnOpts);
};

/**
 * Returns information about which options were used to compile MakeNSIS
 * @returns - compiler options
 */
const hdrInfoSync = (options: CompilerOptions = {}, spawnOpts: SpawnOptions = {}) => {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-HDRINFO'], options);

  return spawnMakensisSync(cmd, args, opts, spawnOpts);
};

/**
 * Compile specified script with MakeNSIS
 * @param} script - path to NSIS script
 * @param options - compiler options
 */
const compile = (script: string, options: CompilerOptions = {}, spawnOpts: SpawnOptions = {}) => {
  const [cmd, args, opts]: any = mapArguments([], options);

  if (script) {
    if (cmd === 'wine') {
      args.push('--');
    }
    args.push(script);
  }

  if (typeof options.postExecute !== 'undefined') {
    if (typeof options.postExecute === 'string') {
      if (options.postExecute.trim().includes('\n')) {
        const lines = options.postExecute.trim().split('\n');

        lines.forEach( line => {
          if (line.trim().length) {
            args.push(`-X${line}`);
          }
        });
      } else {
        args.push(`-X${options.postExecute}`);
      }
    } else {
      options.postExecute.forEach( key => {
        if (key.trim().length) {
          args.push(`-X${key}`);
        }
      });
    }
  }

  return spawnMakensis(cmd, args, opts, spawnOpts);
};

/**
 * Compile specified script with MakeNSIS
 * @param script - path to NSIS script
 * @param options - compiler options
 */
const compileSync = (script: string, options: CompilerOptions = {}, spawnOpts: SpawnOptions = {}) => {
  const [cmd, args, opts]: any = mapArguments([], options);

  if (script) {
    if (cmd === 'wine') {
      args.push('--');
    }
    args.push(script);
  }

  if (typeof options.postExecute !== 'undefined') {
    if (typeof options.postExecute === 'string') {
      args.push(`-X${options.postExecute}`);
    } else {
      options.postExecute.forEach((key) => {
        args.push(`-X${key}`);
      });
    }
  }

  return spawnMakensisSync(cmd, args, opts, spawnOpts);
};

/**
 * Returns version of MakeNSIS
 * @param options - compiler options
 * @returns - compiler version
 */
const version = (options: CompilerOptions = {}, spawnOpts: SpawnOptions = {}) => {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-VERSION'], options);

  return spawnMakensis(cmd, args, opts, spawnOpts);
};

/**
 * Returns version of MakeNSIS
 * @param options - compiler options
 * @returns - compiler version
 */
const versionSync = (options: CompilerOptions = {}, spawnOpts: SpawnOptions = {}) => {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-VERSION'], options);

  return spawnMakensisSync(cmd, args, opts, spawnOpts);
};

/**
 * Returns MakeNSIS software license
 * @param options - compiler options
 * @returns - compiler license
 */
const license = (options: CompilerOptions = {}, spawnOpts: SpawnOptions = {}) => {

  const [cmd, args, opts]: any = mapArguments(['-LICENSE'], options);

  return spawnMakensis(cmd, args, opts, spawnOpts);
};

/**
 * Returns MakeNSIS software license
 * @param options - compiler options
 * @returns - compiler license
 */
const licenseSync = (options: CompilerOptions = {}, spawnOpts: SpawnOptions = {}) => {
  const [cmd, args, opts]: any = mapArguments(['-LICENSE'], options);

  return spawnMakensisSync(cmd, args, opts, spawnOpts);
};

/**
 * Returns directory where NSIS is installed to
 * @param options - compiler options
 * @returns - NSIS directory
 */
const nsisDir = (options: CompilerOptions = {}, spawnOpts: SpawnOptions = {}) => {
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
const nsisDirSync = (options: CompilerOptions = {}, spawnOpts: SpawnOptions = {}) => {
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
