import type { ChildProcess, SpawnOptions } from 'node:child_process';
import { spawn } from 'node:child_process';
import { platform } from 'node:os';
import { env } from 'node:process';
import type * as Makensis from '../types/index.d.ts';
import { input as inputCharsets, output as outputCharsets } from './charsets.ts';

const REGEX_HEX_NUMBER = /^[0-9a-fA-F]+$/;

/**
 * Detects the output file from the NSIS output.
 * @param str - The string to search for the output file.
 * @returns The detected output file path or null if not found.
 */
function detectOutfile(str: string): null | string {
	if (str.includes('Output: "')) {
		const regex = /Output: "(.*.exe)"/g;
		const result = regex.exec(str.toString());

		if (typeof result === 'object' && result && result['1']) {
			try {
				return result['1'];
			} catch (_error) {
				return null;
			}
		}
	}

	return null;
}

/**
 * Normalizes the output of the `makensis` command.
 * @param stream - The stream options containing stdout and stderr.
 * @param args - The arguments passed to the `makensis` command.
 * @param opts - The compiler options used for the makensis functions.
 * @returns normalized output with stdout and stderr or JSON.
 */
function formatOutput(
	stream: Makensis.StreamOptions,
	args: Array<string>,
	opts: Makensis.CompilerOptions,
): Makensis.StreamOptionsFormatted {
	const stdOut = stream.stdout.toString().trim();
	const stdErr = stream.stderr.toString().trim();

	const output: Makensis.StreamOptionsFormatted = {
		stdout: stdOut,
		stderr: stdErr,
	};

	if (args.includes('-CMDHELP') && !stdOut.trim() && stdErr) {
		// CMDHELP writes to stderr by default, let's fix this
		[output.stdout, output.stderr] = [stdErr, ''];
	}

	if (opts.json === true) {
		if (args.includes('-CMDHELP')) {
			const minLength = opts.wine === true ? 2 : 1;

			if (args.length === minLength) {
				output.stdout = objectifyHelp(stdOut, opts);
			} else {
				output.stdout = objectify(stdOut, 'help');
			}
		} else if (args.includes('-HDRINFO')) {
			output.stdout = objectifyFlags(stdOut, opts);
		} else if (args.includes('-LICENSE')) {
			output.stdout = objectify(stdOut, 'license');
		} else if (args.includes('-VERSION')) {
			output.stdout = objectify(stdOut, 'version');
		}
	}

	return output;
}

/**
 * Filters environment variables that start with `NSIS_APP_` prefix.
 * @returns An object containing the filtered environment variables.
 */
function getMagicEnvVars(): Makensis.EnvironmentVariables {
	const definitions: Makensis.EnvironmentVariables = {};
	const prefix = 'NSIS_APP_';
	const ENV_VAR_REGEX = new RegExp(`${prefix}[a-z0-9]+`, 'gi');

	for (const item of Object.keys(env)) {
		if (item?.length && ENV_VAR_REGEX.test(item)) {
			definitions[item] = env[item];
		}
	}

	return definitions;
}

/**
 * Checks the output for common NodeJS errors.
 * @param input - The input string to check for error codes.
 * @returns true if the input contains an error code, false otherwise.
 */
function hasErrorCode(input: string) {
	if (input?.includes('ENOENT') && input.match(/\bENOENT\b/)) {
		return true;
	}
	if (input?.includes('EACCES') && input.match(/\bEACCES\b/)) {
		return true;
	}
	if (input?.includes('EISDIR') && input.match(/\bEISDIR\b/)) {
		return true;
	}
	if (input?.includes('EMFILE') && input.match(/\bEMFILE\b/)) {
		return true;
	}

	return false;
}

/**
 * Checks if the given line contains warnings and returns the count.
 * @param line - The line to check for warnings.
 * @returns The number of warnings found in the line.
 */
function hasWarnings(line: string): number {
	const match = line.match(/(\d+) warnings?:/);

	if (match !== null) {
		return Number.parseInt(match[1], 10);
	}

	return 0;
}

/**
 * Checks if the given value is a hexadecimal number string.
 * @param x - The value to check if it is a hexadecimal number.
 * @returns true if the value is a hexadecimal number, false otherwise.
 */
function isHex(x: number | string): boolean {
	return REGEX_HEX_NUMBER.test(String(x));
}

/**
 * Helper function to check if a number is numeric.
 * @param x - The number to check.
 * @returns true if the number is numeric, false otherwise.
 */
function isNumeric(x: number): boolean {
	return !Number.isNaN(x);
}

/**
 * Checks if a value is within a specified range.
 * @param value - The value to check.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns true if the value is within the range, false otherwise.
 */
function inRange(value: number, min: number, max: number): boolean {
	return value >= min && value <= max;
}

/**
 * Maps argument options to flags to be passed to `makensis` command.
 * @param args - The arguments to be passed to `makensis`.
 * @param options - The compiler options to be used.
 * @internal
 */
export function mapArguments(args: string[], options: Makensis.CompilerOptions): Makensis.MapArguments {
	const pathToMakensis: string = options.pathToMakensis ? options.pathToMakensis : 'makensis';
	const pathToWine: string = options.pathToWine ? options.pathToWine : 'wine';

	const defaultArguments = {
		json: options.json,
		wine: options.wine,
		onData: options.onData,
		onClose: options.onClose,
		onError: options.onError,
	};

	let cmd: string;

	if (platform() !== 'win32' && options.wine === true) {
		console.warn(
			'Wine support has been degraded to an experimental feature, but it will be continued to be supported for the time being.',
		);

		cmd = pathToWine;
		args.unshift(pathToMakensis);
	} else {
		cmd = pathToMakensis;
	}

	if (args.length > 1 || args.includes('-CMDHELP')) {
		return [cmd, args, defaultArguments];
	}

	if (options?.define) {
		for (const key of Object.keys(options.define)) {
			if (options.define?.[key]) {
				args.push(`-D${key}=${options.define[key]}`);
			}
		}
	}

	if (options?.env) {
		const defines = getMagicEnvVars();

		if (defines && Object.keys(defines).length) {
			for (const key of Object.keys(defines)) {
				if (defines?.[key]) {
					args.push(`-D${key}=${defines[key]}`);
				}
			}
		}
	}

	if (options?.preExecute) {
		const preExecuteArgs = splitCommands(options.preExecute);
		if (preExecuteArgs.length) {
			args.push(...preExecuteArgs);
		}
	}

	if (options.noCD === true) {
		args.push('-NOCD');
	}

	if (options.noConfig === true) {
		args.push('-NOCONFIG');
	}

	if (options.pause === true) {
		args.push('-PAUSE');
	}

	if (options.strict === true) {
		args.push('-WX');
	}

	if (options.inputCharset && inputCharsets.includes(options.inputCharset)) {
		args.push('-INPUTCHARSET', options.inputCharset);
	}

	if (platform() === 'win32') {
		if (options.outputCharset && outputCharsets.includes(options.outputCharset)) {
			args.push('-OUTPUTCHARSET', options.outputCharset);
		}
	}

	if (options.ppo === true) {
		args.push('-PPO');
	}

	if (options.safePPO === true) {
		args.push('-SAFEPPO');
	}

	if (options.priority) {
		const priority = Number.parseInt(String(options.priority), 10);

		if (platform() === 'win32' && isNumeric(priority) && inRange(priority, 0, 5)) {
			args.push(`-P${options.priority}`);
		}
	}

	if (options.verbose) {
		const verbosity = Number.parseInt(String(options.verbose), 10);

		if (isNumeric(verbosity) && inRange(verbosity, 0, 4)) {
			args.push(`-V${verbosity}`);
		}
	}

	if (options.rawArguments && Array.isArray(options.rawArguments)) {
		args.push(...options.rawArguments);
	}

	return [cmd, args, defaultArguments];
}

/**
 * Helper function to return the output of MakeNSIS into a normalized object.
 * @internal
 */
export function objectify(input: string, key: string | null): Makensis.OutputObject | string {
	const normalizedInput = key === 'version' && input.startsWith('v') ? input.substring(1) : input;

	if (key === null) {
		return normalizedInput;
	}

	const output: Makensis.OutputObject = {
		[key]: normalizedInput,
	};

	return output;
}

/**
 * Helper function to convert flags from the `-HDRINFO` output into an object.
 * @internal
 */
export function objectifyFlags(input: string, opts: Makensis.CompilerOptions): Makensis.HeaderInfo {
	const output: Makensis.HeaderInfo = {
		sizes: {},
		defined_symbols: {},
	};

	const lines = splitLines(input, opts);

	if (!lines?.length) {
		return output;
	}

	const filteredLines = lines.filter((line) => line !== '');

	const tableSizes: Makensis.HeaderInfoSizes = {};
	const tableSymbols: Makensis.HeaderInfoSymbols = {};
	let symbols: string[] = [];

	if (!filteredLines?.length) {
		return output;
	}

	// Split sizes
	for (const line of filteredLines) {
		if (line.startsWith('Size of ')) {
			const pair = line.split(' is ');

			pair[0] = pair[0].replace('Size of ', '');
			pair[0] = pair[0].replace(' ', '_');
			pair[1] = pair[1].slice(0, -1);

			tableSizes[pair[0]] = pair[1];
		} else if (line.startsWith('Defined symbols: ')) {
			symbols = line.replace('Defined symbols: ', '').split(',');
		}
	}

	output.sizes = tableSizes;

	if (!symbols?.length) {
		return output;
	}

	// Split symbols
	for (const symbol of symbols) {
		const pair: Array<number | string> = symbol.split('=');

		if (pair.length > 1 && pair[0] !== 'undefined') {
			if (!isHex(pair[1]) && isNumeric(Number(pair[1]))) {
				pair[1] = Number.parseInt(String(pair[1]), 10);
			}

			tableSymbols[pair[0]] = pair[1];
		} else {
			tableSymbols[symbol] = true;
		}
	}

	output.defined_symbols = tableSymbols;

	return output;
}

function objectifyHelp(input: string, opts: Makensis.CompilerOptions): Makensis.HelpObject | string {
	const lines = splitLines(input, opts);
	lines.sort();

	const output: Makensis.CommandHelpOptions = {};

	if (lines?.length) {
		lines.map((line) => {
			let command = line.substring(0, line.indexOf(' '));
			const usage = line.substring(line.indexOf(' ') + 1);

			// Workaround
			if (['!AddIncludeDir', '!AddPluginDir'].includes(command)) {
				command = command.toLowerCase();
			}

			if (command) output[command] = usage;
		});
	}

	return output;
}

/**
 * Helper function to spawn MakeNSIS.
 * @internal
 */
export function spawnMakensis(
	cmd: string,
	args: Array<string>,
	compilerOptions: Makensis.CompilerOptions,
	spawnOptions: SpawnOptions = {},
): Promise<Makensis.CompilerOutput> {
	return new Promise<Makensis.CompilerOutput>((resolve, reject) => {
		if (compilerOptions.wine) {
			spawnOptions.env = Object.freeze({
				WINEDEBUG: '-all',
				...env,
				...spawnOptions.env,
			});
		}

		const stream: Makensis.StreamOptions = {
			stdout: '',
			stderr: '',
		};

		let warningsCounter = 0;
		let outFile: string | null = '';

		const child: ChildProcess = spawn(cmd, args, spawnOptions);

		child.stdout?.on('data', (data) => {
			const line = data.toString();

			stream.stdout += line;
			const warnings = hasWarnings(line);

			warningsCounter += warnings;

			if (!outFile) {
				outFile = detectOutfile(line);
			}

			if (typeof compilerOptions.onData !== 'function') {
				return;
			}

			compilerOptions.onData({
				line,
				outFile,
				hasWarning: Boolean(warnings),
			});
		});

		child.stderr?.on('data', (data) => {
			const line = data.toString();
			stream.stderr += line;

			if (typeof compilerOptions.onError !== 'function') {
				return;
			}

			compilerOptions.onError(line);
		});

		child.on('error', (errorMessage: string) => {
			console.error(errorMessage);
		});

		// Using 'exit' will truncate stdout, so we use 'close' instead
		child.on('close', (code: number | null) => {
			const streamFormatted = formatOutput(stream, args, compilerOptions);

			const output: Makensis.CompilerOutput = {
				status: code || 0,
				stdout: streamFormatted.stdout || null,
				stderr: streamFormatted.stderr || null,
				warnings: warningsCounter,
			};

			if (outFile) {
				output.outFile = outFile;
			}

			if (typeof compilerOptions.onClose === 'function') {
				compilerOptions.onClose(output);
			}

			if (code === 0 || (streamFormatted.stderr && !hasErrorCode(streamFormatted.stderr))) {
				// Promise will be resolved on MakeNSIS errors...
				resolve(output);
			} else {
				// ...but will be rejected on all other errors
				reject(output.stderr);
			}
		});
	});
}

/**
 * Maps the commands specified in the `postExecute` or `preExecute` to the `-X` flag.
 * @internal
 */
export function splitCommands(data: string | string[]): string[] {
	const args: string[] = [];

	if (typeof data === 'string') {
		if (data.trim().includes('\n')) {
			const lines = data.trim().split('\n');

			lines.map((line) => {
				if (line.trim().length) {
					args.push(`-X${line}`);
				}
			});
		} else {
			args.push(`-X${data}`);
		}
	} else {
		data.map((key) => {
			if (key.trim().length) {
				args.push(`-X${key}`);
			}
		});
	}

	return args;
}

/**
 * Splits the input string into lines based on the platform-specific line break.
 * @param input - The input string to split into lines.
 * @param opts - Compiler options that may affect line splitting (e.g., wine).
 * @returns An array of strings, each representing a line from the input.
 */
function splitLines(input: string, opts: Makensis.CompilerOptions = {}): string[] {
	const lineBreak = platform() === 'win32' || opts.wine === true ? '\r\n' : '\n';
	const output = input.split(lineBreak);

	return output;
}
