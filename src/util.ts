import { eventEmitter } from './events';
import { input as inputCharsets, output as outputCharsets } from './charsets';
import { platform } from 'os';
import { spawn, spawnSync } from 'child_process';

import type { SpawnOptions } from 'child_process';
import type makensis from '../types';

function splitCommands(data: string | string[]): string[] {
  const args: string[] = [];

  if (typeof data === 'string') {
    if (data.trim().includes('\n')) {
      const lines = data.trim().split('\n');

      lines.map(line => {
        if (line.trim().length) {
          args.push(`-X${line}`);
        }
      });
    } else {
      args.push(`-X${data}`);
    }
  } else {
    data.map(key => {
      if (key.trim().length) {
        args.push(`-X${key}`);
      }
    });
  }

  return args;
}

function mapArguments(args: string[], options: makensis.CompilerOptions): makensis.MapArguments {
  const pathToMakensis: string = options.pathToMakensis
    ? options.pathToMakensis
    : 'makensis';

  const pathToWine: string = options.pathToWine
    ? options.pathToWine
    : 'wine';

    let cmd: string;

  if (platform() !== 'win32' && options.wine === true) {
    cmd = pathToWine;
    args.unshift(pathToMakensis);
  } else {
    cmd = pathToMakensis;
  }

  if (args.length > 1 || args.includes('-CMDHELP')) {
    return [cmd, args, {
      json: options.json,
      wine: options.wine
    }];
  }

  if (options?.define) {
    Object.keys(options.define).map(key => {
      if (options?.define && options?.define[key]) {
        args.push(`-D${key}=${options.define[key]}`);
      }
    });
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
    const priority = parseInt(String(options.priority), 10);

    if (platform() === 'win32' && isNumeric(priority) && inRange(priority, 0, 5)) {
      args.push(`-P${options.priority}`);
    }
  }

  if (options.verbose) {
  const verbosity = parseInt(String(options.verbose), 10);

    if (isNumeric(verbosity) && inRange(verbosity, 0, 4)) {
      args.push(`-V${verbosity}`);
    }
  }

  if (options.rawArguments && Array.isArray(options.rawArguments)) {
    args = [...args, ...options.rawArguments];
  }

  return [cmd, args, { json: options.json, wine: options.wine }];
}

function stringify(data): string {
  return data?.length
    ? data.toString().trim()
    : '';
}

function isNumeric(x): boolean {
  return !isNaN(x);
}

function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

function hasWarnings(line: string): number {
  const match = line.match(/(\d+) warnings?:/);

  if (match !== null) {
    return parseInt(match[1], 10);
  }

  return 0;
}

function formatOutput(stream, args, opts: makensis.CompilerOptions): makensis.StreamOptions {
  if (args.includes('-CMDHELP') && !stream.stdout.trim() && stream.stderr) {
    // CMDHELP writes to stderr by default, let's fix this
    [stream.stdout, stream.stderr] = [stream.stderr, ''];
  }

  if (opts.json === true) {
    if (args.includes('-CMDHELP')) {
      const minLength = (opts.wine === true) ? 2 : 1;

      if (args.length === minLength) {
        stream.stdout = objectifyHelp(stream.stdout, opts);
      } else {
        stream.stdout = objectify(stream.stdout, 'help');
      }
    } else if (args.includes('-HDRINFO')) {
      stream.stdout = objectifyFlags(stream.stdout, opts);
    } else if (args.includes('-LICENSE')) {
      stream.stdout = objectify(stream.stdout, 'license');
    } else if (args.includes('-VERSION')) {
      stream.stdout = objectify(stream.stdout, 'version');
    }
  }

  return stream;
}

function objectify(input: string, key: string | null): Record<string, unknown> | string {
  let output: { [key: string]: unknown } | string = {};

  if (key === 'version' && input.startsWith('v')) {
    input = input.substr(1);
  }

  if (key === null) {
    output = input;
  } else {
    output[key] = input;
  }

  return output;
}

function objectifyHelp(input: string, opts: makensis.CompilerOptions): Record<string, unknown> {
  const lines = splitLines(input, opts);
  lines.sort();

  const output = {};

  if (lines?.length) {
    lines.map(line => {
      let command = line.substr(0, line.indexOf(' '));
      const usage = line.substr(line.indexOf(' ') + 1);

      // Workaround
      if (['!AddIncludeDir', '!AddPluginDir'].includes(command)) {
        command = command.toLowerCase();
      }

      if (command)
        output[command] = usage;
    });
  }

  return output;
}

function objectifyFlags(input: string, opts: makensis.CompilerOptions): Record<string, unknown> {
  const output = {};
  const lines = splitLines(input, opts);

  if (!lines?.length) {
    return output;
  }

  const filteredLines = lines.filter(line => {
    if (line !== '') {
      return line;
    }
  });

  const tableSizes = {};
  const tableSymbols = {};
  let symbols;

  if (!filteredLines?.length) {
    return output;
  }

  // Split sizes
  filteredLines.map(line => {
    if (line.startsWith('Size of ')) {
      const pair = line.split(' is ');

      pair[0] = pair[0].replace('Size of ', '');
      pair[0] = pair[0].replace(' ', '_');
      pair[1] = pair[1].slice(0, -1);

      tableSizes[pair[0]] = pair[1];
    } else if (line.startsWith('Defined symbols: ')) {
      symbols = line.replace('Defined symbols: ', '').split(',');
    }
  });

  output['sizes'] = tableSizes;

  if (!symbols?.length) {
    return output;
  }

  // Split symbols
  symbols.map(symbol => {
    const pair = symbol.split('=');

    if (pair.length > 1 && pair[0] !== 'undefined') {
      if (isNumeric(pair[1]) === true) {
        pair[1] = parseInt(pair[1], 10);
      }

      tableSymbols[pair[0]] = pair[1];
    } else {
      tableSymbols[symbol] = true;
    }
  });

  output['defined_symbols'] = tableSymbols;

  return output;
}

function hasErrorCode(input: string) {
  if (input?.includes('ENOENT') && input.match(/\bENOENT\b/)) {
    return true;
  } else if (input?.includes('EACCES') && input.match(/\bEACCES\b/)) {
    return true;
  } else if (input?.includes('EISDIR') && input.match(/\bEISDIR\b/)) {
    return true;
  } else if (input?.includes('EMFILE') && input.match(/\bEMFILE\b/)) {
    return true;
  }

  return false;
}

function splitLines(input: string, opts: makensis.CompilerOptions = {}): string[] {
  const lineBreak = (platform() === 'win32' || opts.wine === true) ? '\r\n' : '\n';
  const output = input.split(lineBreak);

  return output;
}

function detectOutfile(str: string): string {
  if (str.includes('Output: "')) {
    const regex = new RegExp('Output: "(.*.exe)"', 'g');
    const result = regex.exec(str.toString());

    if (typeof result === 'object' && result && result['1']) {
      try {
        return result['1'];
      } catch (e) {
        return '';
      }
    }
  }

  return '';
}

function spawnMakensis(cmd: string, args: Array<string>, compilerOptions: makensis.CompilerOptions, spawnOptions: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  return new Promise<makensis.CompilerOutput>((resolve, reject) => {
    if (compilerOptions.wine) {
      spawnOptions['env'] = Object.create({
        WINEDEBUG: '-all',
        ...process.env,
        ...spawnOptions.env
      });
    }

    let stream: makensis.StreamOptions = {
      stdout: '',
      stderr: ''
    };

    let warningsCounter = 0;
    let outFile = '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const child: any = spawn(cmd, args, spawnOptions);

    child.stdout.on('data', data => {
      const line = stringify(data);
      const warnings = hasWarnings(line);

      warningsCounter += warnings;

      if (outFile === '') {
        outFile = detectOutfile(line);
      }

      eventEmitter.emit('stdout', {
        line,
        outFile,
        hasWarning: Boolean(warnings)
      });

      stream.stdout += line;
    });

    child.stderr.on('data', data => {
      const line = stringify(data);

      eventEmitter.emit('stderr', {
        line
      });

      stream.stderr += line;
    });

    child.on('error', errorMessage => {
      console.error(errorMessage);
    });

    // Using 'exit' will truncate stdout
    child.on('close', code => {
      stream = formatOutput(stream, args, compilerOptions);

      const output: makensis.CompilerOutput = {
        status: code,
        stdout: stream.stdout || '',
        stderr: stream.stderr || '',
        warnings: warningsCounter
      };

      if (outFile.length) {
        output['outFile'] = outFile;
      }

      eventEmitter.emit('exit', output);

      if (code === 0 || (stream.stderr && !hasErrorCode(stream.stderr))) {
        // Promise also resolves on MakeNSIS errors
        resolve(output);
      } else {
        reject(output.stderr);
      }
    });
  });
}

function spawnMakensisSync(cmd: string, args: Array<string>, compilerOptions: makensis.CompilerOptions, spawnOptions: SpawnOptions = {}): makensis.CompilerOutput {
  if (compilerOptions.wine) {
    spawnOptions['env'] = Object.create({
      WINEDEBUG: '-all',
      ...process.env,
      ...spawnOptions.env
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let child: any = spawnSync(cmd, args, spawnOptions);

  child.stdout = stringify(child.stdout);
  child.stderr = stringify(child.stderr);

  const warningsCounter = hasWarnings(child.stdout);
  const outFile = detectOutfile(child.stdout);

  child = formatOutput(child, args, compilerOptions);

  const output: makensis.CompilerOutput = {
    'status': child.status,
    'stdout': child.stdout,
    'stderr': child.stderr,
    'warnings': warningsCounter
  };

  if (outFile.length) {
    output['outFile'] = outFile;
  }

  return output;
}

export {
  mapArguments,
  objectify,
  objectifyFlags,
  spawnMakensis,
  spawnMakensisSync,
  splitCommands
};
