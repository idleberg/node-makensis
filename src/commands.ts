import { mapArguments, objectify, spawnMakensis, splitCommands } from './util';

import type { SpawnOptions } from 'node:child_process';

/**
 * Returns usage information for a command, or list all commands
 * @param command - an NSIS command
 * @param compilerOptions - compiler options
 * @returns - usage description
 */
export async function commandHelp(command = '', compilerOptions: Makensis.CompilerOptions = {}, spawnOptions: SpawnOptions = {}): Promise<Makensis.CompilerOutput> {
	const options: Makensis.CompilerOptions = { ...compilerOptions, verbose: 0 };

	const [cmd, args, opts]: Makensis.MapArguments = await mapArguments(['-CMDHELP'], options);

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
export async function compile(script: string, compilerOptions: Makensis.CompilerOptions = {}, spawnOptions: SpawnOptions = {}): Promise<Makensis.CompilerOutput> {
	const [cmd, args, opts]: Makensis.MapArguments = await mapArguments([], compilerOptions);

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
export async function headerInfo(compilerOptions: Makensis.CompilerOptions = {}, spawnOptions: SpawnOptions = {}): Promise<Makensis.CompilerOutput> {
	const options: Makensis.CompilerOptions = { ...compilerOptions, verbose: 0 };
	const [cmd, args, opts]: Makensis.MapArguments = await mapArguments(['-HDRINFO'], options);

	return spawnMakensis(cmd, args, opts, spawnOptions);
}

/**
 * Returns MakeNSIS software license
 * @param compilerOptions - compiler options
 * @returns - compiler license
 */
export async function license(compilerOptions: Makensis.CompilerOptions = {}, spawnOptions: SpawnOptions = {}): Promise<Makensis.CompilerOutput> {
	const [cmd, args, opts]: Makensis.MapArguments = await mapArguments(['-LICENSE'], compilerOptions);

	return spawnMakensis(cmd, args, opts, spawnOptions);
}

/**
 * Returns directory where NSIS is installed to
 * @param compilerOptions - compiler options
 * @returns - NSIS directory
 */
export async function nsisDir(compilerOptions: Makensis.CompilerOptions = {}): Promise<string | JSON> {
	const hdrOptions: Makensis.CompilerOptions = { ...compilerOptions, json: true };

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function handler(hdrinfo: any) {
		if (compilerOptions.json === true) {
			return objectify(hdrinfo.stdout['defined_symbols']['NSISDIR'], 'nsisdir');
		}

		return hdrinfo.stdout['defined_symbols']['NSISDIR'];
	}

	const hdrinfo = await headerInfo(hdrOptions);

	return handler(hdrinfo);
}

/**
 * Returns version of MakeNSIS
 * @param compilerOptions - compiler options
 * @returns - compiler version
 */
export async function version(compilerOptions: Makensis.CompilerOptions = {}, spawnOptions: SpawnOptions = {}): Promise<Makensis.CompilerOutput> {
	const options: Makensis.CompilerOptions = { ...compilerOptions, verbose: 0 };
	const [cmd, args, opts]: Makensis.MapArguments = await mapArguments(['-VERSION'], options);

	return spawnMakensis(cmd, args, opts, spawnOptions);
}

