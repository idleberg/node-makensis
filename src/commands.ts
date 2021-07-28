import {
  mapArguments,
  objectify,
  spawnMakensis,
  spawnMakensisSync,
  splitCommands
} from './util';

import type { SpawnOptions } from 'child_process';
import type makensis from '../types';

/**
 * Returns usage information for a command, or list all commands
 * @param command - an NSIS command
 * @param options - compiler options
 * @returns - usage description
 */
function commandHelp(command = '', options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-CMDHELP'], options);

  if (command?.length && typeof command !== 'object') {
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

  if (options?.postExecute) {

    const postExecuteArgs = splitCommands(options.postExecute);

    if (postExecuteArgs.length) {
      args.push(...postExecuteArgs);
    }
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

/**
 * Returns usage information for a command, or list all commands
 * @param command - an NSIS command
 * @param options - compiler options
 * @returns - usage description
 */
commandHelp.sync = (command = '', options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): makensis.CompilerOutput => {
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
 compile.sync = (script: string, options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): makensis.CompilerOutput => {
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
headerInfo.sync = (options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): makensis.CompilerOutput => {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-HDRINFO'], options);

  return spawnMakensisSync(cmd, args, opts, spawnOpts);
}

/**
 * Returns MakeNSIS software license
 * @param options - compiler options
 * @returns - compiler license
 */
 license.sync = (options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): makensis.CompilerOutput => {
  const [cmd, args, opts]: any = mapArguments(['-LICENSE'], options);

  return spawnMakensisSync(cmd, args, opts, spawnOpts);
}

/**
 * Returns NSIS directory
 * @param options - compiler options
 * @returns - compiler version
 */
nsisDir.sync = (options: makensis.CompilerOptions = {}): string | unknown => {
  const hdrOptions = { ...options, json: true };
  const hdrinfo: any = headerInfo.sync(hdrOptions);

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
version.sync = (options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): makensis.CompilerOutput => {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-VERSION'], options);

  return spawnMakensisSync(cmd, args, opts, spawnOpts);
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

cmdHelp.sync = (command = '', options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): makensis.CompilerOutput => {
  console.warn('makensis: cmdHelp() has been deprecated and will be removed in future versions, please use commandHelp() instead');

  return commandHelp.sync(command, options, spawnOpts);
}

hdrInfo.sync = (): makensis.CompilerOutput => {
  console.warn('makensis: cmdHelp() has been deprecated and will be removed in future versions, please use commandHelp() instead');

  return headerInfo.sync();
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
