declare namespace Makensis {

	interface CommandHelpOptions {
		[key: string]: string;
	}

	interface CompilerData {
		line: string;
		outFile: string | null;
		hasWarning: boolean;
	}

	interface CompilerOptions {
		define?: DefineOptions;
		env?: boolean;
		events?: boolean;
		inputCharset?: string;
		json?: boolean;
		noCD?: boolean;
		noConfig?: boolean;
		outputCharset?: string;
		onData?: (data: CompilerData) => void;
		onError?: (line: string) => void;
		onClose?: (data: CompilerOutput) => void;
		pause?: boolean;
		postExecute?: string | string[];
		preExecute?: string | string[];
		priority?: 0 | 1 | 2 | 3 | 4 | 5;
		ppo?: boolean;
		rawArguments?: string;
		safePPO?: boolean;
		strict?: boolean;
		verbose?: 0 | 1 | 2 | 3 | 4;
		wine?: boolean;

		// library
		pathToMakensis?: string;
		pathToWine?: string;
	}

	interface CompilerOutput {
		outFile?: string;
		status: number;
		stdout: string | HeaderInfo | HelpObject | Objectified | null;
		stderr: string | null;
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
		onData?: (data: CompilerData) => void;
		onError?: (line: string) => void;
		onClose?: (data: CompilerOutput) => void;
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
