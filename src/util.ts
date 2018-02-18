import { spawn, spawnSync } from 'child_process';
import { platform } from 'os';

const mapArguments = (args, options) => {
  let cmd: string = (typeof options.pathToMakensis !== 'undefined' && options.pathToMakensis !== '') ? options.pathToMakensis : 'makensis';

  let p = {
    cmd: cmd,
    args: args,
    opts: options
  };

  if (platform() !== 'win32' && options.wine === true) {
    p.cmd = 'wine';
    p.args.unshift(cmd);
  }

  if (typeof options.cwd !== 'undefined' && options.cwd !== '') {
    p.opts.cwd = options.cwd;
  }

  if (typeof options.detached !== 'undefined') {
    p.opts.detached = options.detached;
  }

  if (typeof options.shell !== 'undefined' && options.shell !== '') {
    p.opts.shell = options.shell;
  }

  // return unless compile command
  if (args.length > 1 || args.indexOf('-CMDHELP') !== -1) {
    return p;
  }

  if (typeof options.define !== 'undefined') {
    Object.keys(options.define).forEach((key) => {
      p.args.push(`-D${key}=${options.define[key]}`);
    });
  }

  if (typeof options.preExecute !== 'undefined') {
    if (typeof options.preExecute === 'string') {
      p.args.push(`-X${options.preExecute}`);
    } else {
      options.preExecute.forEach((key) => {
        p.args.push(`-X${key}`);
      });
    }
  // Temporary Fallback
  } else if (typeof options.execute !== 'undefined') {
    if (typeof options.execute === 'string') {
      p.args.push(`-X${options.execute}`);
    } else {
      options.execute.forEach((key) => {
        p.args.push(`-X${key}`);
      });
    }
  }

  if (options.nocd === true || options.noCD === true) {
    p.args.push('-NOCD');
  }

  if (options.noconfig === true || options.noConfig === true) {
    p.args.push('-NOCONFIG');
  }

  if (options.pause === true) {
    p.args.push('-PAUSE');
  }

  if (options.strict === true || options.wx === true) {
    p.args.push('-WX');
  }

  if ((typeof options.inputcharset !== 'undefined' && options.inputcharset !== '') || (typeof options.inputCharset !== 'undefined' && options.inputCharset !== '')) {
    p.args.push('-INPUTCHARSET', options.inputcharset);
  }

  if ((typeof options.outputcharset !== 'undefined' && options.outputcharset !== '') || (typeof options.outputCharset !== 'undefined' && options.outputCharset !== '')) {
    p.args.push('-OUTPUTCHARSET', options.outputcharset);
  }

  if (options.ppo === true || options.PPO === true) {
    p.args.push('-PPO');
  }

  if (options.safeppo === true || options.safePPO === true) {
    p.args.push('-SAFEPPO');
  }

  if (Number.isInteger(options.verbose) && options.verbose >= 0 && options.verbose <= 4) {
    p.args.push('-V' + options.verbose);
  }

  return p;
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
  if (args.indexOf('-CMDHELP') !== -1) {
    // CMDHELP writes to stderr by default, let's fix this
    [stream.stdout, stream.stderr] = [stream.stderr, ''];
  }

  if (opts.json === true) {
    if (args.indexOf('-CMDHELP') !== -1) {
      if (args.length > 1) {
        stream.stdout = objectify(stream.stdout, 'help');
      } else {
        stream.stdout = objectifyHelp(stream.stdout);
      }
    } else if (args.indexOf('-HDRINFO') !== -1) {
      stream.stdout = objectifyFlags(stream.stdout);
    } else if (args.indexOf('-VERSION') !== -1) {
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

const objectifyHelp = (input: string): Object => {
  let lines = input.replace('\r\n', '\n').split('\n');
  lines.sort();

  let output = {};

  lines.forEach((line) => {
    let command = line.substr(0, line.indexOf(' '));
    let usage = line.substr(line.indexOf(' ') + 1);

    // Workaround
    if (['!AddIncludeDir', '!AddPluginDir'].indexOf(command) !== -1) {
      command = command.toLowerCase();
    }

    if (command) output[command] = usage;
  });

  return output;
};

const objectifyFlags = (input: string): Object => {
  let lines = input.replace('\r\n', '\n').split('\n');

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

const spawnMakensis = (cmd: string, args: Array<string>, opts: any): Object => {
  return new Promise<Object>((resolve, reject) => {
    let stream: any = {
      stdout: '',
      stderr: ''
    };
    let warnings = 0;

    const child: any = spawn(cmd, args, opts);

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

const spawnMakensisSync = (cmd: string, args: Array<string>, opts: Object): Object => {
  let child: any = spawnSync(cmd, args, opts);

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
