import { input as inputCharsets, output as outputCharsets } from './charsets';
import { eventEmitter } from './events';
import { spawn, spawnSync } from 'child_process';
import { platform } from 'os';

import { SpawnOptions } from 'child_process';
import makensis from '../types';

function splitCommands(data: string | string[]): string[] {
  const args = [];

  if (typeof data !== 'undefined') {
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
  }

  return args;
}

function mapArguments(args: string[], options: makensis.CompilerOptions): unknown[] {
  const pathToMakensis: string = (typeof options.pathToMakensis !== 'undefined' && options.pathToMakensis !== '') ? options.pathToMakensis : 'makensis';
  let cmd: string;

  if (platform() !== 'win32' && options.wine === true) {
    cmd = 'wine';
    args.unshift(pathToMakensis);
  } else {
    cmd = pathToMakensis;
  }

  // return unless compile command
  if (args.length > 1 || args.includes('-CMDHELP')) {
    return [cmd, args, { json: options.json, wine: options.wine }];
  }

  if (typeof options.define !== 'undefined') {
    Object.keys(options.define).forEach(key => {
      args.push(`-D${key}=${options.define[key]}`);
    });
  }

  const preExecuteArgs = splitCommands(options.preExecute);
  if (preExecuteArgs.length) {
    args.push(...preExecuteArgs);
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

  if (typeof options.inputCharset !== 'undefined' && inputCharsets.includes(options.inputCharset)) {
    args.push('-INPUTCHARSET', options.inputCharset);
  }

  if (platform() === 'win32') {
    if (typeof options.outputCharset !== 'undefined' && outputCharsets.includes(options.outputCharset)) {
      args.push('-OUTPUTCHARSET', options.outputCharset);
    }
  }

  if (options.ppo === true) {
    args.push('-PPO');
  }

  if (options.safePPO === true) {
    args.push('-SAFEPPO');
  }

  if (platform() === 'win32' && Number.isInteger(options.priority) && options.priority >= 0 && options.priority <= 5) {
    args.push(`-P${options.priority}`);
  }

  if (Number.isInteger(options.verbose) && options.verbose >= 0 && options.verbose <= 4) {
    args.push(`-V${options.verbose}`);
  }

  return [cmd, args, { json: options.json, wine: options.wine }];
}

function stringify(data): string {
  return data
    ? data.toString().trim()
    : '';
}

function isInteger(x): boolean {
  return x % 2 === 0;
}

function hasWarnings(line: string): number {
  const match = line.match(/(\d+) warnings?:/);

  if (match !== null) {
    return parseInt(match[1]);
  }

  return 0;
}

function formatOutput(stream, args, opts: makensis.CompilerOptions): unknown {
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

function objectify(input: null | string, key = null): unknown {
  let output = {};

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

function objectifyHelp(input: string, opts: unknown): unknown {
  const lines = splitLines(input, opts);
  lines.sort();

  const output = {};

  lines.forEach(line => {
    let command = line.substr(0, line.indexOf(' '));
    const usage = line.substr(line.indexOf(' ') + 1);

    // Workaround
    if (['!AddIncludeDir', '!AddPluginDir'].includes(command)) {
      command = command.toLowerCase();
    }

    if (command)
      output[command] = usage;
  });

  return output;
}

function objectifyFlags(input: string, opts: unknown): unknown {
  const lines = splitLines(input, opts);

  const filteredLines = lines.filter(line => {
    if (line !== '') {
      return line;
    }
  });

  const output = {};
  const tableSizes = {};
  const tableSymbols = {};
  let symbols;

  // Split sizes
  filteredLines.forEach(line => {
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

  // Split symbols
  symbols.map(symbol => {
    const pair = symbol.split('=');

    if (pair.length > 1 && pair[0] !== 'undefined') {
      if (isInteger(pair[1]) === true) {
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
  if (input.includes('ENOENT') && input.match(/\bENOENT\b/)) {
    return true;
  } else if (input.includes('EACCES') && input.match(/\bEACCES\b/)) {
    return true;
  } else if (input.includes('EISDIR') && input.match(/\bEISDIR\b/)) {
    return true;
  } else if (input.includes('EMFILE') && input.match(/\bEMFILE\b/)) {
    return true;
  }

  return false;
}

function splitLines(input: string, opts: makensis.CompilerOptions): Array<string> {
  const lineBreak = (platform() === 'win32' || opts.wine === true) ? '\r\n' : '\n';
  const output = input.split(lineBreak);

  return output;
}

function detectOutfile(str: string): string {
  if (str.includes('Output: "')) {
    const regex = /Output: "(.*\.exe)"\r?\n/g;
    const result = regex.exec(str.toString());

    if (typeof result === 'object') {
      try {
        return result['1'];
      } catch (e) {
        return '';
      }
    }
  }

  return '';
}

function spawnMakensis(cmd: string, args: Array<string>, opts: makensis.CompilerOptions, spawnOpts: SpawnOptions = {}): Promise<makensis.CompilerOutput> {
  return new Promise<makensis.CompilerOutput>((resolve, reject) => {
    let stream: makensis.StreamOptions = {
      stdout: '',
      stderr: ''
    };

    let warnings = 0;
    let outFile = '';

    const child: any = spawn(cmd, args, spawnOpts);

    child.stdout.on('data', data => {
      const line = stringify(data);

      warnings += hasWarnings(line);

      if (outFile === '') {
        outFile = detectOutfile(line);
      }

      eventEmitter.emit('stdout', {
        line,
        outFile,
        warnings
      });

      stream.stdout += line;
    });

    child.stderr.on('data', data => {
      const line = stringify(data);

      eventEmitter.emit('stderr', {
        line
      });

      stream.stderr += stringify(line);
    });

    child.on('error', errorMessage => {
      console.error(errorMessage);
    });

    child.on('close', code => {
      stream = formatOutput(stream, args, opts);

      const output: makensis.CompilerOutput = {
        'status': code,
        'stdout': stream.stdout,
        'stderr': stream.stderr,
        'warnings': warnings
      };

      if (outFile.length) {
        output['outfile'] = outFile;
      }

      eventEmitter.emit('close', output);

      if (code === 0 || (code !== 0 && !hasErrorCode(stream.stderr))) {
        // Promise also resolves on MakeNSIS errors
        resolve(output);
      } else {
        reject(output.stderr);
      }
    });
  });
}

function spawnMakensisSync(cmd: string, args: Array<string>, opts: makensis.CompilerOptions, spawnOpts: SpawnOptions = {}): makensis.CompilerOutput {
  let child: any = spawnSync(cmd, args, spawnOpts);

  child.stdout = stringify(child.stdout);
  child.stderr = stringify(child.stderr);

  const warnings = hasWarnings(child.stdout);
  const outFile = detectOutfile(child.stdout);

  child = formatOutput(child, args, opts);

  const output: makensis.CompilerOutput = {
    'status': child.status,
    'stdout': child.stdout,
    'stderr': child.stderr,
    'warnings': warnings
  };

  if (outFile.length) {
    output['outfile'] = outFile;
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
