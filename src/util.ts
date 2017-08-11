import { spawn } from 'child_process';

const stringify = (data) => {
  return data.toString().trim();
};

const spawnMakensis = (args: Array<string>) => {
  return new Promise((resolve, reject) => {
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
        if (code === 0) {
            resolve(stdOut);
        } else {
            reject(stdErr);
        }
    });
  });
};

export { spawnMakensis, stringify};
