import { getArguments, runWithWine, spawnMakensis, spawnMakensisSync } from './util';

interface CompilerOptions {
    define?: Object;
    execute?: Array<string>;
    nocd?: boolean;
    noconfig?: boolean;
    inputcharset?: string;
    outputcharset?: string;
    pause?: boolean;
    ppo?: boolean;
    wine?: boolean;
    safeppo?: boolean;
    strict?: boolean;
    verbose?: number;
}

/**
 * Returns usage information for a command, or list all commands
 * @param {string} [command] - an NSIS command
 * @returns {string} - usage description
 */
const cmdhelp = (command: string = '', options: CompilerOptions = null) => {
    options || (options = {});
    const p = runWithWine(['-CMDHELP'], options);

    if (typeof command !== 'undefined' && command !== '') {
        p.args.push(command);
    }

    return spawnMakensis(p.cmd, p.args);
};

/**
 * Returns usage information for a command, or list all commands
 * @param {string} [command] - an NSIS command
 * @returns {string} - usage description
 */
const cmdhelpSync = (command: string = '', options: CompilerOptions = null) => {
    options || (options = {});
    const p = runWithWine(['-CMDHELP'], options);

    if (command !== '') {
        p.args.push(command);
    }

    return spawnMakensisSync(p.cmd, p.args);
};

/**
 * Returns information about which options were used to compile MakeNSIS
 * @returns {string} - compiler options
 */
const hdrinfo =  (options: CompilerOptions = null) => {
    options || (options = {});
    const p = runWithWine(['-HDRINFO'], options);

    return spawnMakensis(p.cmd, p.args);
};

/**
 * Returns information about which options were used to compile MakeNSIS
 * @returns {string} - compiler options
 */
const hdrinfoSync = (options: CompilerOptions = null) => {
    options || (options = {});
    let p = runWithWine(['-HDRINFO'], options);

    return spawnMakensisSync(p.cmd, p.args);
};

/**
 * Compile specified script with MakeNSIS
 * @param {string} script - path to NSIS script
 * @param {Object} options - compiler options
 */
const compile = (script: string, options: CompilerOptions = null) => {
    options || (options = {});
    const p = getArguments(options);

    if (script) {
        if (p.cmd === 'wine') {
            p.args.push('--');
        }
        p.args.push(script);
    }

    return spawnMakensis(p.cmd, p.args);
};

/**
 * Compile specified script with MakeNSIS
 * @param {string} script - path to NSIS script
 * @param {Object} options - compiler options
 */
const compileSync = (script: string, options: CompilerOptions = null) => {
    options || (options = {});

    let p = getArguments(options);

    if (script) {
        if (p.cmd === 'wine') {
            p.args.push('--');
        }
        p.args.push(script);
    }

    return spawnMakensisSync(p.cmd, p.args);
};

/**
 * Returns version of MakeNSIS
 * @returns {string} - compiler version
 */
const version = (options: CompilerOptions = null) => {
    options || (options = {});
    const p = runWithWine(['-VERSION'], options);

    return spawnMakensis(p.cmd, p.args);
};

/**
 * Returns version of MakeNSIS
 * @returns {string} - compiler version
 */
const versionSync = (options: CompilerOptions = null) => {
    options || (options = {});
    const p = runWithWine(['-VERSION'], options);

    return spawnMakensisSync(p.cmd, p.args);
};

export {
    cmdhelp,
    cmdhelpSync,
    compile,
    compileSync,
    hdrinfo,
    hdrinfoSync,
    version,
    versionSync
};
