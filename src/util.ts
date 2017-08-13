import { spawn, spawnSync } from 'child_process';

const getArguments = (options) => {
  let args: Array<string> = [];

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

  if (options.nocd === true) {
      args.push('-NOCD');
  }

  if (options.noconfig === true) {
      args.push('-NOCONFIG');
  }

  if (options.pause === true) {
      args.push('-PAUSE');
  }

  if (options.strict === true) {
      args.push('-WX');
  }

  if (typeof options.inputcharset !== 'undefined' && options.inputcharset !== '') {
      args.push('-INPUTCHARSET', options.inputcharset);
  }

  if (typeof options.outputcharset !== 'undefined' && options.outputcharset !== '') {
      args.push('-OUTPUTCHARSET', options.outputcharset);
  }

  if (options.ppo === true) {
      args.push('-PPO');
  }

  if (options.safeppo === true) {
      args.push('-SAFEPPO');
  }

  if (Number.isInteger(options.verbose) && options.verbose >= 0 && options.verbose <= 4) {
      args.push('-V' + options.verbose);
  }

  return args;
};

const stringify = (data) => {
  return data.toString().trim();
};

const spawnMakensis = (args: Array<string>) => {
  return new Promise<Object>((resolve, reject) => {
    let stdOut: string = '';
    let stdErr: string = '';

    const cmd: any = spawn('makensis', args);

    cmd.stdout.on('data', (data) => {
        stdOut += stringify(data);
    });

    cmd.stderr.on('data', (data) => {
        stdErr += stringify(data);
    });

    cmd.on('close', (code) => {
        let output: Object = {
            'status': code,
            'stdout': stdOut,
            'stderr': stdErr
        };

        if (code === 0) {
            resolve(output);
        } else {
            reject(output);
        }
    });
  });
};

const spawnMakensisSync = (args: Array<string>) => {
    const cmd = spawnSync('makensis', args);

    let output: Object = {
        'status': cmd.status,
        'stdout': stringify(cmd.stdout),
        'stderr': stringify(cmd.stderr)
    };

    return output;
};

export { getArguments, spawnMakensis, spawnMakensisSync };
