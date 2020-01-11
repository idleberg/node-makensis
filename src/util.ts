import {input as inputCharsets, output as outputCharsets } from './charsets';
import { spawn, spawnSync, SpawnOptions } from 'child_process';
import { platform } from 'os';

const splitCommands = data => {
  const args = [];

  if (typeof data !== 'undefined') {
    if (typeof data === 'string') {
      if (data.trim().includes('\n')) {
        const lines = data.trim().split('\n');

        lines.forEach( line => {
          if (line.trim().length) {
            args.push(`-X${line}`);
          }
        });
      } else {
        args.push(`-X${data}`);
      }
    } else {
      data.forEach( key => {
       if (key.trim().length) {
          args.push(`-X${key}`);
        }
      });
    }
  }

  return args;
};

const mapArguments = (args, options) => {
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
    return [cmd, args, {json: options.json, wine: options.wine}];
  }

  if (typeof options.define !== 'undefined') {
    Object.keys(options.define).forEach( key => {
      args.push(`-D${key}=${options.define[key]}`);
    });
  }

  const preExecuteArgs = splitCommands(options.preExecute);
  if (preExecuteArgs.length) {
    args.push(...preExecuteArgs);
  }

  if (options.nocd === true || options.noCD === true) {
    args.push('-NOCD');
  }

  if (options.noconfig === true || options.noConfig === true) {
    args.push('-NOCONFIG');
  }

  if (options.pause === true) {
    args.push('-PAUSE');
  }

  if (options.strict === true || options.wx === true) {
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

  if (options.ppo === true || options.PPO === true) {
    args.push('-PPO');
  }

  if (options.safeppo === true || options.safePPO === true) {
    args.push('-SAFEPPO');
  }

  if (platform() === 'win32' && Number.isInteger(options.priority) && options.priority >= 0 && options.priority <= 5) {
    args.push(`-P${options.priority}`);
  }

  if (Number.isInteger(options.verbose) && options.verbose >= 0 && options.verbose <= 4) {
    args.push(`-V${options.verbose}`);
  }

  return [cmd, args, {json: options.json, wine: options.wine}];
};

const stringify = (data): string => {
  return data.toString().trim();
};

const isInteger = (x): boolean => {
  return x % 2 === 0;
};

const hasWarnings = (line: string): number => {
  const match = line.match(/(\d+) warnings?\:/);

  if (match !== null) {
    return parseInt(match[1]);
  }

  return 0;
};

const formatOutput = (stream, args, opts: CompilerOptions): Object => {
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
};

const objectify = (input, key = null): Object => {
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
};

const objectifyHelp = (input: string, opts: any): Object => {
  const lines = splitLines(input, opts);
  lines.sort();

  let output = {};

  lines.forEach( line => {
    let command = line.substr(0, line.indexOf(' '));
    const usage = line.substr(line.indexOf(' ') + 1);

    // Workaround
    if (['!AddIncludeDir', '!AddPluginDir'].includes(command)) {
      command = command.toLowerCase();
    }

    if (command) output[command] = usage;
  });

  return output;
};

const objectifyFlags = (input: string, opts: any): Object => {
  const lines = splitLines(input, opts);

  let filteredLines = lines.filter( line => {
    if (line !== '') {
      return line;
    }
  });

  let output = {};
  const tableSizes = {};
  const tableSymbols = {};
  let symbols;

  // Split sizes
  filteredLines.forEach( line => {
    let obj = {};

    if (line.startsWith('Size of ')) {
      let pair = line.split(' is ');

      pair[0] = pair[0].replace('Size of ', '');
      pair[0] = pair[0].replace(' ', '_');
      pair[1] = pair[1].slice(0, -1);

      tableSizes[pair[0]] = pair[1];
    } else if (line.startsWith('Defined symbols: ')) {
      symbols = line.replace('Defined symbols: ', '').split(',');
    }
  });

  let objSizes = {};
  output['sizes'] = tableSizes;

  // Split symbols
  symbols.forEach( symbol => {
    const pair = symbol.split('=');
    const obj = {};

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
};

const hasErrorCode = (input: string) => {
  if (input.includes('ENOENT')) {
    return true;
  } else if (input.includes('EACCES')) {
    return true;
  } else if (input.includes('EISDIR')) {
    return true;
  } else if (input.includes('EMFILE')) {
    return true;
  } else if (input.includes('EMFILE')) {
    return true;
  }

  return false;
};

const splitLines = (input: string, opts: any): Array<string> => {
  const lineBreak = (platform() === 'win32' || opts.wine === true) ? '\r\n' : '\n';
  const output = input.split(lineBreak);

  return output;
};

const detectOutfile = (str: string): string => {
  if (str.includes('Output: "')) {
    const regex = /Output: \"(.*\.exe)\"\r?\n/g;
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
};

const spawnMakensis = (cmd: string, args: Array<string>, opts: CompilerOptions, spawnOpts: SpawnOptions = {}): Object => {
  return new Promise<Object>( (resolve, reject) => {
    let stream: any = {
      stdout: '',
      stderr: ''
    };

    let warnings: number = 0;
    let outFile: string = '';

    const child: any = spawn(cmd, args, spawnOpts);

    child.stdout.on('data', line => {
      line = stringify(line);

      warnings += hasWarnings(line);

      if (outFile === '') {
        outFile = detectOutfile(line);
      }

      stream.stdout += line;
    });

    child.stderr.on('data', line => {
      stream.stderr += stringify(line);
    });

    child.on('close', code => {
      stream = formatOutput(stream, args, opts);

      const output: CompilerOutput = {
        'status': code,
        'stdout': stream.stdout,
        'stderr': stream.stderr,
        'warnings': warnings
      };

      if (outFile.length) {
        output['outfile'] = outFile;
      }

      if (code === 0 || (code !== 0 && !hasErrorCode(stream.stderr))) {
        // Promise also resolves on MakeNSIS errors
        resolve(output);
      } else {
        reject(output.stderr);
      }
    });
  });
};

const spawnMakensisSync = (cmd: string, args: Array<string>, opts: CompilerOptions, spawnOpts: SpawnOptions = {}): Object => {
  let child: any = spawnSync(cmd, args, spawnOpts);

  child.stdout = stringify(child.stdout);
  child.stderr = stringify(child.stderr);

  const warnings = hasWarnings(child.stdout);

  const outFile = detectOutfile(child.stdout);

  child = formatOutput(child, args, opts);

  const output: CompilerOutput = {
    'status': child.status,
    'stdout': child.stdout,
    'stderr': child.stderr,
    'warnings': warnings
  };

  if (outFile.length) {
    output['outfile'] = outFile;
  }

  return output;
};

export {
  mapArguments,
  objectify,
  objectifyFlags,
  spawnMakensis,
  spawnMakensisSync,
  splitCommands
};
