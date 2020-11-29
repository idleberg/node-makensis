import {
  mapArguments,
  objectify,
  spawnMakensis,
  splitCommands
} from './util';

import { SpawnOptions } from 'child_process';
import makensis from '../types';

/**
 * Returns usage information for a command, or list all commands
 * @param command - an NSIS command
 * @param options - compiler options
 * @returns - usage description
 */
function commandHelp(command = '', options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-CMDHELP'], options);

  if (typeof command !== 'undefined' && typeof command !== 'object' && command !== '') {
    args.push(command);
  }

  return spawnMakensis(cmd, args, opts, spawnOpts);
}

/**
 * Compile specified script with MakeNSIS
 * @param script - path to NSIS script
 * @param options - compiler options
 */
function compile(script: string, options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  const [cmd, args, opts]: any = mapArguments([], options);

  if (script) {
    if (cmd === 'wine') {
      args.push('--');
    }
    args.push(script);
  }

  const postExecuteArgs = splitCommands(options.postExecute);
  if (postExecuteArgs.length) {
    args.push(...postExecuteArgs);
  }

  return spawnMakensis(cmd, args, opts, spawnOpts);
}

/**
 * Returns information about which options were used to compile MakeNSIS
 * @param options - compiler options
 * @returns - compiler options
 */
function headerInfo(options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-HDRINFO'], options);

  return spawnMakensis(cmd, args, opts, spawnOpts);
}

/**
 * Returns MakeNSIS software license
 * @param options - compiler options
 * @returns - compiler license
 */
function license(options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): Promise<makensis.CompilerOutput> {

  const [cmd, args, opts]: any = mapArguments(['-LICENSE'], options);

  return spawnMakensis(cmd, args, opts, spawnOpts);
}

/**
 * Returns directory where NSIS is installed to
 * @param options - compiler options
 * @returns - NSIS directory
 */
async function nsisDir(options: makensis.CompilerOptions = {}): Promise<string | unknown> {
  const hdrOptions = { ...options, json: true };

  function handler(hdrinfo) {
    if (options.json === true) {
      return objectify(hdrinfo.stdout.defined_symbols.NSISDIR, 'nsisdir');
    }

    return hdrinfo.stdout.defined_symbols.NSISDIR;
  }

  try {
    const hdrinfo = await headerInfo(hdrOptions);
    return handler(hdrinfo);
  } catch(error) {
    // NSIS < 3.03
    return handler(error);
  }
}

/**
 * Returns version of MakeNSIS
 * @param options - compiler options
 * @returns - compiler version
 */
function version(options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-VERSION'], options);

  return spawnMakensis(cmd, args, opts, spawnOpts);
}

// Aliases
async function cmdHelp(command = '', options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  console.warn('makensis: cmdHelp() has been deprecated and will be removed in future versions, please use commandHelp() instead');

  return await commandHelp(command, options, spawnOpts);
}

async function hdrInfo(): Promise<makensis.CompilerOutput> {
  console.warn('makensis: hdrInfo() has been deprecated and will be removed in future versions, please use headerInfo() instead');

  return await headerInfo();
}

export {
  commandHelp,
  compile,
  headerInfo,
  license,
  nsisDir,
  version,

  // Aliases
  cmdHelp,
  hdrInfo
};
