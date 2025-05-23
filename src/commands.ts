import { mapArguments, objectify, spawnMakensis, splitCommands } from './util.ts';

import type { SpawnOptions } from 'node:child_process';
import type Makensis from '../types/index.d.ts';

/**
 * Returns usage information for a command, or list all commands
 * @param command - an NSIS command
 * @param compilerOptions - compiler options
 * @returns - usage description
 */
export async function commandHelp(
	command = '',
	compilerOptions: Makensis.CompilerOptions = {},
	spawnOptions: SpawnOptions = {},
): Promise<Makensis.CompilerOutput> {
	const options: Makensis.CompilerOptions = { ...compilerOptions, verbose: 0 };

	const [cmd, args, opts]: Makensis.MapArguments = mapArguments(['-CMDHELP'], options);

	if (command?.length && typeof command === 'string') {
		args.push(command);
	}

	return await spawnMakensis(cmd, args, opts, spawnOptions);
}

/**
 * Compile specified script with MakeNSIS
 * @param script - path to NSIS script
 * @param compilerOptions - compiler options
 */
export async function compile(
	script: string | null,
	compilerOptions: Makensis.CompilerOptions = {},
	spawnOptions: SpawnOptions = {},
): Promise<Makensis.CompilerOutput> {
	const [cmd, args, opts]: Makensis.MapArguments = mapArguments([], compilerOptions);

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

	return await spawnMakensis(cmd, args, opts, spawnOptions);
}

/**
 * Returns information about which options were used to compile MakeNSIS
 * @param compilerOptions - compiler options
 * @returns - compiler options
 */
export async function headerInfo(
	compilerOptions: Makensis.CompilerOptions = {},
	spawnOptions: SpawnOptions = {},
): Promise<Makensis.CompilerOutput> {
	const options: Makensis.CompilerOptions = { ...compilerOptions, verbose: 0 };
	const [cmd, args, opts]: Makensis.MapArguments = mapArguments(['-HDRINFO'], options);

	return await spawnMakensis(cmd, args, opts, spawnOptions);
}

/**
 * Returns MakeNSIS software license
 * @param compilerOptions - compiler options
 * @returns - compiler license
 */
export async function license(
	compilerOptions: Makensis.CompilerOptions = {},
	spawnOptions: SpawnOptions = {},
): Promise<Makensis.CompilerOutput> {
	const [cmd, args, opts]: Makensis.MapArguments = mapArguments(['-LICENSE'], compilerOptions);

	return await spawnMakensis(cmd, args, opts, spawnOptions);
}

/**
 * Returns directory where NSIS is installed to
 * @param compilerOptions - compiler options
 * @returns - NSIS directory
 */
export async function nsisDir(
	compilerOptions: Makensis.CompilerOptions = {},
): Promise<string | { nsisdir: string } | null> {
	// We're setting JSON true for easier parsing
	const hdrOptions: Makensis.CompilerOptions = { ...compilerOptions, json: true };

	const hdrinfo = await headerInfo(hdrOptions);

	const header = hdrinfo?.stdout as Makensis.HeaderInfo | undefined;
	const nsisdir = header?.defined_symbols?.NSISDIR;

	if (!nsisdir) {
		return null;
	}

	if (compilerOptions.json === true) {
		return objectify(nsisdir as string, 'nsisdir') as { nsisdir: string };
	}

	return nsisdir as string;
}

/**
 * Returns version of MakeNSIS
 * @param compilerOptions - compiler options
 * @returns - compiler version
 */
export async function version(
	compilerOptions: Makensis.CompilerOptions = {},
	spawnOptions: SpawnOptions = {},
): Promise<Makensis.CompilerOutput> {
	const options: Makensis.CompilerOptions = { ...compilerOptions, verbose: 0 };
	const [cmd, args, opts]: Makensis.MapArguments = mapArguments(['-VERSION'], options);

	return await spawnMakensis(cmd, args, opts, spawnOptions);
}
