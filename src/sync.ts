import {
  mapArguments,
  objectify,
  spawnMakensisSync
} from './util';

import { SpawnOptions } from 'child_process';
import type makensis from '../types';

/**
 * Returns usage information for a command, or list all commands
 * @param command - an NSIS command
 * @param options - compiler options
 * @returns - usage description
 */
function commandHelpSync(command = '', options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): makensis.CompilerOutput {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-CMDHELP'], options);

  if (command?.length && typeof command !== 'object') {
    args.push(command);
  }

  return spawnMakensisSync(cmd, args, opts, spawnOpts);
}

/**
 * Compile specified script with MakeNSIS
 * @param script - path to NSIS script
 * @param options - compiler options
 */
function compileSync(script: string, options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): makensis.CompilerOutput {
  const [cmd, args, opts]: any = mapArguments([], options);

  if (script) {
    if (cmd === 'wine') {
      args.push('--');
    }
    args.push(script);
  }

  if (typeof options.postExecute === 'string') {
    args.push(`-X${options.postExecute}`);
  } else if (options.postExecute) {
    options.postExecute.map(key => {
      args.push(`-X${key}`);
    });
  }

  return spawnMakensisSync(cmd, args, opts, spawnOpts);
}

/**
 * Returns information about which options were used to compile MakeNSIS
 * @returns - compiler options
 */
function headerInfoSync(options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): makensis.CompilerOutput {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-HDRINFO'], options);

  return spawnMakensisSync(cmd, args, opts, spawnOpts);
}

/**
 * Returns MakeNSIS software license
 * @param options - compiler options
 * @returns - compiler license
 */
function licenseSync(options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): makensis.CompilerOutput {
  const [cmd, args, opts]: any = mapArguments(['-LICENSE'], options);

  return spawnMakensisSync(cmd, args, opts, spawnOpts);
}

/**
 * Returns NSIS directory
 * @param options - compiler options
 * @returns - compiler version
 */
function nsisDirSync(options: makensis.CompilerOptions = {}): string | unknown {
  const hdrOptions = { ...options, json: true };
  const hdrinfo: any = headerInfoSync(hdrOptions);

  if (options.json === true) {
    return objectify(hdrinfo.stdout.defined_symbols.NSISDIR, 'nsisdir');
  }

  return hdrinfo.stdout.defined_symbols.NSISDIR;
}

/**
 * Returns version of MakeNSIS
 * @param options - compiler options
 * @returns - compiler version
 */
function versionSync(options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): makensis.CompilerOutput {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-VERSION'], options);

  return spawnMakensisSync(cmd, args, opts, spawnOpts);
}

// Aliases
function cmdHelpSync(command = '', options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): makensis.CompilerOutput {
  console.warn('makensis: cmdHelpSync() has been deprecated and will be removed in future versions of makensis, please use commandHelpSync() instead');

  return commandHelpSync(command, options, spawnOpts);
}

async function hdrInfoSync(): Promise<makensis.CompilerOutput> {
  console.warn('makensis: hdrInfoSync() has been deprecated and will be removed in future versions of makensis, please use headerInfoSync() instead');

  return await headerInfoSync();
}

export {
  commandHelpSync,
  compileSync,
  headerInfoSync,
  licenseSync,
  nsisDirSync,
  versionSync,

  // Aliases
  cmdHelpSync,
  hdrInfoSync
};
