/**
 * Key value pair consisting of NSIS command as key and its description as value.
 */
export type CommandHelpOptions = {
	[key: string]: string;
};

/**
 * Object storing the output file, and whether the compilation had warnings and the lines where they occurred.
 */
export type CompilerData = {
	line: string;
	outFile: string | null;
	hasWarning: boolean;
};

/**
 * Compiler options for all exposed NSIS methods.
 */
export type CompilerOptions = {
	define?: DefineOptions;
	env?: boolean;
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
};

/**
 * Standard output of all MakenNSIS commands. Contains the name of the output file, status code, standard output, standard error, and number of warnings.
 */
export type CompilerOutput = {
	outFile?: string;
	status: number;
	stdout: string | HeaderInfo | HelpObject | OutputObject | null;
	stderr: string | null;
	warnings: number;
};

/**
 * Key value pair consisting of NSIS definitions as key and their value.
 */
export type DefineOptions = {
	[key: string]: string;
};

/**
 * Key value pair consisting of environment variables as key and their value.
 */
export type EnvironmentVariables = {
	[key: string]: string | undefined;
};

/**
 * Header information returned by the `-HDRINFO` command.
 */
export type HeaderInfo = {
	sizes: HeaderInfoSizes;
	defined_symbols: HeaderInfoSymbols;
};

/**
 * Key value pair consisting of header information sizes as key and their value.
 */
export type HeaderInfoSizes = {
	[key: string]: string;
};

export type HeaderInfoSymbols = {
	[key: string]: boolean | number | string;
};

/**
 * Key value pair consisting of NSIS command as key and its description as value.
 */
export type HelpObject = {
	[key: string]: string;
};

/**
 * An array containing the command, arguments, and options passed to MakeNSIS.
 */
export type MapArguments = [string, string[], MapArgumentOptions];

/**
 * Options for mapping arguments to MakeNSIS commands.
 */
export type MapArgumentOptions = {
	json?: boolean;
	wine?: boolean;
	onData?: (data: CompilerData) => void;
	onError?: (line: string) => void;
	onClose?: (data: CompilerOutput) => void;
};

export type StreamOptions = {
	stdout: string;
	stderr: string;
};

export type StreamOptionsFormatted = {
	stdout: string | HeaderInfo | HelpObject | OutputObject;
	stderr: string;
};

export type OutputObject = {
	[key: string]: boolean | number | string | undefined;
};
