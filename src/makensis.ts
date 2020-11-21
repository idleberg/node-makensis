import {
  mapArguments,
  objectify,
  spawnMakensis,
  spawnMakensisSync,
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
function cmdHelp(command = '', options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-CMDHELP'], options);

  if (typeof command !== 'undefined' && typeof command !== 'object' && command !== '') {
    args.push(command);
  }

  return spawnMakensis(cmd, args, opts, spawnOpts);
}

/**
 * Returns usage information for a command, or list all commands
 * @param command - an NSIS command
 * @param options - compiler options
 * @returns - usage description
 */
function cmdHelpSync(command = '', options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): makensis.CompilerOutput {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-CMDHELP'], options);

  if (typeof command !== 'undefined' && typeof command !== 'object' && command !== '') {
    args.push(command);
  }

  return spawnMakensisSync(cmd, args, opts, spawnOpts);
}

/**
 * Returns information about which options were used to compile MakeNSIS
 * @param options - compiler options
 * @returns - compiler options
 */
function hdrInfo(options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-HDRINFO'], options);

  return spawnMakensis(cmd, args, opts, spawnOpts);
}

/**
 * Returns information about which options were used to compile MakeNSIS
 * @returns - compiler options
 */
function hdrInfoSync(options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): makensis.CompilerOutput {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-HDRINFO'], options);

  return spawnMakensisSync(cmd, args, opts, spawnOpts);
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

  if (typeof options.postExecute !== 'undefined') {
    if (typeof options.postExecute === 'string') {
      args.push(`-X${options.postExecute}`);
    } else {
      options.postExecute.forEach(key => {
        args.push(`-X${key}`);
      });
    }
  }

  return spawnMakensisSync(cmd, args, opts, spawnOpts);
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
 * Returns version of MakeNSIS
 * @param options - compiler options
 * @returns - compiler version
 */
function versionSync(options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): makensis.CompilerOutput {
  options = { ...options, verbose: 0 };

  const [cmd, args, opts]: any = mapArguments(['-VERSION'], options);

  return spawnMakensisSync(cmd, args, opts, spawnOpts);
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
 * Returns MakeNSIS software license
 * @param options - compiler options
 * @returns - compiler license
 */
function licenseSync(options: makensis.CompilerOptions = {}, spawnOpts: SpawnOptions = {}): makensis.CompilerOutput {
  const [cmd, args, opts]: any = mapArguments(['-LICENSE'], options);

  return spawnMakensisSync(cmd, args, opts, spawnOpts);
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
    const hdrinfo = await hdrInfo(hdrOptions);
    return handler(hdrinfo);
  } catch(error) {
    // NSIS < 3.03
    return handler(error);
  }
}

/**
 * Returns NSIS directory
 * @param options - compiler options
 * @returns - compiler version
 */
function nsisDirSync(options: makensis.CompilerOptions = {}): string | unknown {
  const hdrOptions = { ...options, json: true };
  const hdrinfo: any = hdrInfoSync(hdrOptions);

  if (options.json === true) {
    return objectify(hdrinfo.stdout.defined_symbols.NSISDIR, 'nsisdir');
  }

  return hdrinfo.stdout.defined_symbols.NSISDIR;
}

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
