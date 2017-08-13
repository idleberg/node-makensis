import { getArguments, spawnMakensis, spawnMakensisSync } from './util';

interface CompilerOptions {
    define?: Object;
    execute?: Array<string>;
    nocd?: boolean;
    noconfig?: boolean;
    inputcharset?: string;
    outputcharset?: string;
    pause?: boolean;
    ppo?: boolean;
    safeppo?: boolean;
    strict?: boolean;
    verbose?: number;
}

/**
 * Returns usage information for a command, or list all commands
 * @param {string} [command] - an NSIS command
 * @returns {string} - usage description
 */
const help = (command: string = '') => {
    let args: Array<string> = ['-CMDHELP'];

    if (typeof command !== 'undefined' && command !== '') {
        args.push(command);
    }

    return spawnMakensis(args);
};

/**
 * Returns information about which options were used to compile MakeNSIS
 * @returns {string} - compiler options
 */
const hdrinfo = () => {
    return spawnMakensis(['-HDRINFO']);
};

/**
 * Returns information about which options were used to compile MakeNSIS
 * @returns {string} - compiler options
 */
const hdrinfoSync = () => {
    return spawnMakensisSync(['-HDRINFO']);
};

/**
 * Returns usage information for a command, or list all commands
 * @param {string} [command] - an NSIS command
 * @returns {string} - usage description
 */
const helpSync = (command: string = '') => {
    let args: Array<string> = ['-CMDHELP'];

    if (typeof command !== 'undefined' && command !== '') {
        args.push(command);
    }

    return spawnMakensisSync(args);
};

/**
 * Compile specified script with MakeNSIS
 * @param {string} script - path to NSIS script
 * @param {Object} options - compiler options
 */
const compile = (script: string, options: CompilerOptions = null) => {
    options || (options = {});

    let args = getArguments(options);

    if (script) {
        args.push(script);
    }

    return spawnMakensis(args);
};

/**
 * Compile specified script with MakeNSIS
 * @param {string} script - path to NSIS script
 * @param {Object} options - compiler options
 */
const compileSync = (script: string, options: CompilerOptions = null) => {
    options || (options = {});

    let args = getArguments(options);

    if (script) {
        args.push(script);
    }

    return spawnMakensisSync(args);
};

/**
 * Returns version of MakeNSIS
 * @returns {string} - compiler version
 */
const version = () => {
    return spawnMakensis(['-VERSION']);
};

/**
 * Returns version of MakeNSIS
 * @returns {string} - compiler version
 */
const versionSync = () => {
    return spawnMakensisSync(['-VERSION']);
};

export { compile, compileSync, hdrinfo, hdrinfoSync, help, helpSync, version, versionSync };
