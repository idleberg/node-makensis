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
  if (args.length > 1) {
    return p;
  }

  if (typeof options.define !== 'undefined') {
    Object.keys(options.define).forEach((key) => {
      p.args.push(`-D${key}=${options.define[key]}`);
    });
  }

  if (typeof options.execute !== 'undefined') {
    options.execute.forEach((key) => {
      p.args.push(`-X${key}`);
    });
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

const stringify = (data) => {
  return data.toString().trim();
};

const spawnMakensis = (cmd: string, args: Array<string>, opts: Object) => {
  return new Promise<Object>((resolve, reject) => {
    let stdOut: string = '';
    let stdErr: string = '';

    const child: any = spawn(cmd, args, opts);

    child.stdout.on('data', (data) => {
      stdOut += stringify(data);
    });

    child.stderr.on('data', (data) => {
      stdErr += stringify(data);
    });

    child.on('close', (code) => {
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

const spawnMakensisSync = (cmd: string, args: Array<string>, opts: Object) => {
  const child: any = spawnSync(cmd, args, opts);

  let output: Object = {
    'status': child.status,
    'stdout': stringify(child.stdout),
    'stderr': stringify(child.stderr)
  };

  return output;
};

export { mapArguments, spawnMakensis, spawnMakensisSync };
