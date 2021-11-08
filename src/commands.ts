import {
  mapArguments,
  objectify,
  spawnMakensis,
  splitCommands
} from './util';

import type { SpawnOptions } from 'child_process';
import type makensis from '../types';

/**
 * Returns usage information for a command, or list all commands
 * @param command - an NSIS command
 * @param compilerOptions - compiler options
 * @returns - usage description
 */
function commandHelp(command = '', compilerOptions: makensis.CompilerOptions = {}, spawnOptions: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  const options: makensis.CompilerOptions = { ...compilerOptions, verbose: 0 };

  const [cmd, args, opts]: makensis.MapArguments = mapArguments(['-CMDHELP'], options);

  if (command?.length && typeof command === 'string') {
    args.push(command);
  }

  return spawnMakensis(cmd, args, opts, spawnOptions);
}

/**
 * Compile specified script with MakeNSIS
 * @param script - path to NSIS script
 * @param compilerOptions - compiler options
 */
function compile(script: string, compilerOptions: makensis.CompilerOptions = {}, spawnOptions: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  const [cmd, args, opts]: makensis.MapArguments = mapArguments([], compilerOptions);

  if (script) {
    if (cmd === 'wine') {
      args.push('--');
    }
    args.push(script);
  }

  if (compilerOptions?.postExecute) {

    const postExecuteArgs = splitCommands(compilerOptions.postExecute);

    if (postExecuteArgs.length) {
      args.push(...postExecuteArgs);
    }
  }

  return spawnMakensis(cmd, args, opts, spawnOptions);
}

/**
 * Returns information about which options were used to compile MakeNSIS
 * @param compilerOptions - compiler options
 * @returns - compiler options
 */
function headerInfo(compilerOptions: makensis.CompilerOptions = {}, spawnOptions: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  const options: makensis.CompilerOptions = { ...compilerOptions, verbose: 0 };
  const [cmd, args, opts]: makensis.MapArguments = mapArguments(['-HDRINFO'], options);

  return spawnMakensis(cmd, args, opts, spawnOptions);
}

/**
 * Returns MakeNSIS software license
 * @param compilerOptions - compiler options
 * @returns - compiler license
 */
function license(compilerOptions: makensis.CompilerOptions = {}, spawnOptions: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  const [cmd, args, opts]: makensis.MapArguments = mapArguments(['-LICENSE'], compilerOptions);

  return spawnMakensis(cmd, args, opts, spawnOptions);
}

/**
 * Returns directory where NSIS is installed to
 * @param compilerOptions - compiler options
 * @returns - NSIS directory
 */
async function nsisDir(compilerOptions: makensis.CompilerOptions = {}): Promise<string | JSON> {
  const hdrOptions: makensis.CompilerOptions = { ...compilerOptions, json: true };

  function handler(hdrinfo) {
    if (compilerOptions.json === true) {
      return objectify(hdrinfo.stdout['defined_symbols']['NSISDIR'], 'nsisdir');
    }

    return hdrinfo.stdout['defined_symbols']['NSISDIR'];
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
 * @param compilerOptions - compiler options
 * @returns - compiler version
 */
function version(compilerOptions: makensis.CompilerOptions = {}, spawnOptions: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  const options: makensis.CompilerOptions = { ...compilerOptions, verbose: 0 };
  const [cmd, args, opts]: makensis.MapArguments = mapArguments(['-VERSION'], options);

  return spawnMakensis(cmd, args, opts, spawnOptions);
}

export {
  commandHelp,
  compile,
  headerInfo,
  license,
  nsisDir,
  version
};
