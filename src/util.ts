import { input as inputCharsets, output as outputCharsets } from './charsets';
import { spawn, spawnSync, SpawnOptions } from 'child_process';
import { platform } from 'os';

const mapArguments = (compilerFlags, options) => {
  let cmd: string = (typeof options.pathToMakensis !== 'undefined' && options.pathToMakensis !== '') ? options.pathToMakensis : 'makensis';
  const compilerArgs: string[] = compilerFlags;

  if (platform() !== 'win32' && options.wine === true) {
    cmd = 'wine';
    compilerFlags.unshift(cmd);
  }

  // return unless compile command
  if (compilerFlags.length > 1 || compilerFlags.includes('-CMDHELP')) {
    return [cmd, compilerArgs];
  }

  if (typeof options.define !== 'undefined') {
    Object.keys(options.define).forEach((key) => {
      compilerArgs.push(`-D${key}=${options.define[key]}`);
    });
  }

  if (typeof options.preExecute !== 'undefined') {
    if (typeof options.preExecute === 'string') {
      compilerArgs.push(`-X${options.preExecute}`);
    } else {
      options.preExecute.forEach((key) => {
        compilerArgs.push(`-X${key}`);
      });
    }
  // Temporary Fallback
  } else if (typeof options.execute !== 'undefined') {
    if (typeof options.execute === 'string') {
      compilerArgs.push(`-X${options.execute}`);
    } else {
      options.execute.forEach((key) => {
        compilerArgs.push(`-X${key}`);
      });
    }
  }

  if (options.nocd === true || options.noCD === true) {
    compilerArgs.push('-NOCD');
  }

  if (options.noconfig === true || options.noConfig === true) {
    compilerArgs.push('-NOCONFIG');
  }

  if (options.pause === true) {
    compilerArgs.push('-PAUSE');
  }

  if (options.strict === true || options.wx === true) {
    compilerArgs.push('-WX');
  }

  if ((typeof options.inputcharset !== 'undefined' && inputCharsets.includes(options.inputcharset)) || (typeof options.inputCharset !== 'undefined' && inputCharsets.includes(options.inputCharset))) {
    compilerArgs.push('-INPUTCHARSET', (options.inputcharset || options.inputCharset));
  }

  if (platform() === 'win32') {
    if ((typeof options.outputcharset !== 'undefined' && outputCharsets.includes(options.outputcharset)) || (typeof options.outputCharset !== 'undefined' && outputCharsets.includes(options.outputCharset))) {
      compilerArgs.push('-OUTPUTCHARSET', (options.outputcharset || options.outputCharset));
    }
  }

  if (options.ppo === true || options.PPO === true) {
    compilerArgs.push('-PPO');
  }

  if (options.safeppo === true || options.safePPO === true) {
    compilerArgs.push('-SAFEPPO');
  }

  if (platform() === 'win32' && Number.isInteger(options.priority) && options.priority >= 0 && options.priority <= 5) {
    compilerArgs.push(`-P${options.priority}`);
  }

  if (Number.isInteger(options.verbose) && options.verbose >= 0 && options.verbose <= 4) {
    compilerArgs.push(`-V${options.verbose}`);
  }

  return [cmd, compilerArgs];
};

const stringify = (data): string => {
  return data.toString().trim();
};

const isInteger = (x): boolean => {
  return x % 2 === 0;
};

const hasWarnings = (line: string): number => {
  let match = line.match(/(\d+) warnings?\:/);

  if (match !== null) {
    return parseInt(match[1]);
  }

  return 0;
};

const formatOutput = (stream, args, opts): Object => {
  if (args.includes('-CMDHELP') && !stream.stdout.trim() && stream.stderr) {
    // CMDHELP writes to stderr by default, let's fix this
    [stream.stdout, stream.stderr] = [stream.stderr, ''];
  }

  if (opts.json === true) {
    if (args.includes('-CMDHELP')) {
      let minLength = (opts.wine === true) ? 2 : 1;

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
  let lines = splitLines(input, opts);
  lines.sort();

  let output = {};

  lines.forEach((line) => {
    let command = line.substr(0, line.indexOf(' '));
    let usage = line.substr(line.indexOf(' ') + 1);

    // Workaround
    if (['!AddIncludeDir', '!AddPluginDir'].includes(command)) {
      command = command.toLowerCase();
    }

    if (command) output[command] = usage;
  });

  return output;
};

const objectifyFlags = (input: string, opts: any): Object => {
  let lines = splitLines(input, opts);

  let filteredLines = lines.filter((line) => {
    if (line !== '') {
      return line;
    }
  });

  let output = {};
  let tableSizes = {};
  let tableSymbols = {};
  let symbols;

  // Split sizes
  filteredLines.forEach((line) => {
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
  symbols.forEach((symbol) => {
    let pair = symbol.split('=');
    let obj = {};

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

const splitLines = (input: string, opts: any): Array<string> => {
  let lineBreak = (platform() === 'win32' || opts.wine === true) ? '\r\n' : '\n';
  let output = input.split(lineBreak);

  return output;
};

const spawnMakensis = (cmd: string, args: Array<string>, opts: any, spawnOpts: SpawnOptions = {}): Object => {
  return new Promise<Object>((resolve, reject) => {
    let stream: any = {
      stdout: '',
      stderr: ''
    };
    let warnings = 0;

    const child: any = spawn(cmd, args, spawnOpts);

    child.stdout.on('data', (line) => {
      line = stringify(line);

      warnings = hasWarnings(line);
      stream.stdout += line;
    });

    child.stderr.on('data', (line) => {
      stream.stderr += stringify(line);
    });

    child.on('close', (code) => {
      stream = formatOutput(stream, args, opts);

      const output: Object = {
        'status': code,
        'stdout': stream.stdout,
        'stderr': stream.stderr,
        'warnings': warnings
      };

      if (code === 0) {
        resolve(output);
      } else {
        reject(output);
      }
    });
  });
};

const spawnMakensisSync = (cmd: string, args: Array<string>, opts: Object, spawnOpts: SpawnOptions = {}): Object => {
  let child: any = spawnSync(cmd, args, spawnOpts);

  child.stdout = stringify(child.stdout);
  child.stderr = stringify(child.stderr);

  let warnings = hasWarnings(child.stdout);

  child = formatOutput(child, args, opts);

  let output: Object = {
    'status': child.status,
    'stdout': child.stdout,
    'stderr': child.stderr,
    'warnings': warnings
  };

  return output;
};

export {
  mapArguments,
  objectify,
  objectifyFlags,
  spawnMakensis,
  spawnMakensisSync
};
