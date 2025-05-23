export interface CommandHelpOptions {
	[key: string]: string;
}

export interface CompilerData {
	line: string;
	outFile: string | null;
	hasWarning: boolean;
}

export interface CompilerOptions {
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

export interface CompilerOutput {
	outFile?: string;
	status: number;
	stdout: string | HeaderInfo | HelpObject | Objectified | null;
	stderr: string | null;
	warnings: number;
}

export interface DefineOptions {
	[key: string]: string;
}

export interface EnvironmentVariables {
	[key: string]: string | undefined;
}

export interface HeaderInfo {
	sizes: HeaderInfoSizes;
	defined_symbols: HeaderInfoSymbols;
}

export interface HeaderInfoSizes {
	[key: string]: string;
}

export interface HeaderInfoSymbols {
	[key: string]: boolean | number | string;
}

export interface HelpObject {
	[key: string]: string;
}

type MapArguments = [string, string[], MapArgumentOptions];

export interface MapArgumentOptions {
	events?: boolean;
	json?: boolean;
	wine?: boolean;
	onData?: (data: CompilerData) => void;
	onError?: (line: string) => void;
	onClose?: (data: CompilerOutput) => void;
}

export interface StreamOptions {
	stdout: string;
	stderr: string;
}
export interface StreamOptionsFormatted {
	stdout: string | HeaderInfo | HelpObject | Objectified;
	stderr: string;
}

export interface Objectified {
	[key: string]: boolean | number | string | undefined;
}
