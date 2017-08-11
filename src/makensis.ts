import { spawnMakensis } from './util';

interface CompilerOptions {
    define?: Object;
    execute?: Array<string>;
    nocd?: boolean;
    noconfig?: boolean;
    pause?: boolean;
    strict?: boolean;
    verbose?: number;
}

/**
 * Returns usage information for a command, or list all commands
 * @param {string} [command] - an NSIS command
 * @returns {string} - usage description
 */
const cmdhelp = (command: string = '') => {
    let args: Array<string> = ['-CMDHELP'];

    if (typeof command !== 'undefined' && command !== '') {
        args.push(command);
    }
    return spawnMakensis(args);
};

/**
 * Compile specified script with MakeNSIS
 * @param {string} script - path to NSIS script
 * @param {Object} options - compiler options
 */
const compile = (script: string, options: CompilerOptions = null) => {
    options || (options = {});

    let args: Array<string> = [];

    if (Number.isInteger(options.verbose) && options.verbose >= 0 && options.verbose <= 4) {
        args.push('-V' + options.verbose);
    }

    if (options.pause === true) {
        args.push('-PAUSE');
    }

    if (options.nocd === true) {
        args.push('-NOCD');
    }

    if (options.noconfig === true) {
        args.push('-NOCONFIG');
    }

    if (options.strict === true) {
        args.push('-WX');
    }

    if (typeof options.define !== 'undefined') {
        Object.keys(options.define).forEach(function(key) {
            args.push(`-D${key}=${options.define[key]}`);
        });
    }

    if (typeof options.execute !== 'undefined') {
        options.execute.forEach(function(key) {
            args.push(`-X${key}`);
        });
    }

    args.push(script);

    return spawnMakensis(args);
};

/**
 * Returns version of MakeNSIS
 * @returns {string} - compiler version
 */
const version = () => {
    return spawnMakensis(['-VERSION']);
};

export { compile, cmdhelp, version };
