import type { EventEmitter } from 'node:events';
import type { SpawnOptions } from 'node:child_process';

declare namespace Makensis {
	function commandHelp(command: string, compilerOptions: CompilerOptions, spawnOptions: SpawnOptions): Promise<CompilerOutput>;
	function compile(script: string, compilerOptions: CompilerOptions, spawnOptions: SpawnOptions): Promise<CompilerOutput>;
	function headerInfo(compilerOptions: CompilerOptions, spawnOptions: SpawnOptions): Promise<CompilerOutput>;
	function license(compilerOptions: CompilerOptions, spawnOptions: SpawnOptions): Promise<CompilerOutput>;
	function nsisDir(compilerOptions: CompilerOptions): Promise<string | JSON>;
	function version(compilerOptions: CompilerOptions, spawnOptions: SpawnOptions): Promise<CompilerOutput>;

	const events: EventEmitter;

	interface CommandHelpOptions {
		[key: string]: string;
	}

	interface CompilerOptions {
		define?: DefineOptions;
		env?: string | boolean;
		events?: boolean;
		inputCharset?: string;
		json?: boolean;
		noCD?: boolean;
		noConfig?: boolean;
		outputCharset?: string;
		pause?: boolean;
		postExecute?: string | string[];
		preExecute?: string | string[];
		priority?: 0 | '0' | 1 | '1' | 2 | '2' | 3 | '3' | 4 | '4' | 5 | '5';
		ppo?: boolean;
		rawArguments?: string;
		safePPO?: boolean;
		strict?: boolean;
		verbose?: 0 | '0' | 1 | '1' | 2 | '2' | 3 | '3' | 4 | '4';
		wine?: boolean;

		// library
		pathToMakensis?: string;
		pathToWine?: string;
	}

	interface CompilerOutput {
		outFile?: string;
		status: number;
		stdout: string | HeaderInfo | HelpObject | Objectified;
		stderr: string;
		warnings: number;
	}

	interface DefineOptions {
		[key: string]: string;
	}

	interface EnvironmentVariables {
		[key: string]: string | undefined;
	}

	interface HeaderInfo {
		sizes: HeaderInfoSizes;
		defined_symbols: HeaderInfoSymbols;
	}

	interface HeaderInfoSizes {
		[key: string]: string;
	}

	interface HeaderInfoSymbols {
		[key: string]: boolean | number | string;
	}

	interface HelpObject {
		[key: string]: string;
	}

	type MapArguments = [string, string[], MapArgumentOptions];

	interface MapArgumentOptions {
		events?: boolean;
		json?: boolean;
		wine?: boolean;
	}

	interface StreamOptions {
		stdout: string;
		stderr: string;
	}
	interface StreamOptionsFormatted {
		stdout: string | HeaderInfo | HelpObject | Objectified;
		stderr: string;
	}

	interface Objectified {
		[key: string]: boolean | number | string | undefined;
	}
}

export = Makensis;
export as namespace Makensis;