import {
  mapArguments,
  objectify,
  spawnMakensis,
  splitCommands
} from './util';

import type { SpawnOptions } from 'node:child_process';

/**
 * Returns usage information for a command, or list all commands
 * @param command - an NSIS command
 * @param compilerOptions - compiler options
 * @returns - usage description
 */
async function commandHelp(command = '', compilerOptions: makensis.CompilerOptions = {}, spawnOptions: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  const options: makensis.CompilerOptions = { ...compilerOptions, verbose: 0 };

  const [cmd, args, opts]: makensis.MapArguments = await mapArguments(['-CMDHELP'], options);

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
async function compile(script: string, compilerOptions: makensis.CompilerOptions = {}, spawnOptions: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  const [cmd, args, opts]: makensis.MapArguments = await mapArguments([], compilerOptions);

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
async function headerInfo(compilerOptions: makensis.CompilerOptions = {}, spawnOptions: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  const options: makensis.CompilerOptions = { ...compilerOptions, verbose: 0 };
  const [cmd, args, opts]: makensis.MapArguments = await mapArguments(['-HDRINFO'], options);

  return spawnMakensis(cmd, args, opts, spawnOptions);
}

/**
 * Returns MakeNSIS software license
 * @param compilerOptions - compiler options
 * @returns - compiler license
 */
async function license(compilerOptions: makensis.CompilerOptions = {}, spawnOptions: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  const [cmd, args, opts]: makensis.MapArguments = await mapArguments(['-LICENSE'], compilerOptions);

  return spawnMakensis(cmd, args, opts, spawnOptions);
}

/**
 * Returns directory where NSIS is installed to
 * @param compilerOptions - compiler options
 * @returns - NSIS directory
 */
async function nsisDir(compilerOptions: makensis.CompilerOptions = {}): Promise<string | JSON> {
  const hdrOptions: makensis.CompilerOptions = { ...compilerOptions, json: true };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handler(hdrinfo: any) {
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
async function version(compilerOptions: makensis.CompilerOptions = {}, spawnOptions: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  const options: makensis.CompilerOptions = { ...compilerOptions, verbose: 0 };
  const [cmd, args, opts]: makensis.MapArguments = await mapArguments(['-VERSION'], options);

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
