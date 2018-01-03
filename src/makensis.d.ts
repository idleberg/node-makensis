interface CompilerOptions {
  // makensis
  define?: Object;
  execute?: Array<string>;
  json?: boolean;
  noCD?: boolean;
  noConfig?: boolean;
  inputCharset?: string;
  outputCharset?: string;
  pause?: boolean;
  ppo?: boolean;
  wine?: boolean;
  safePPO?: boolean;
  strict?: boolean;
  verbose?: number;

  // child_process
  cwd?: string;
  detached?: boolean;
  shell?: string;

  // library
  pathToMakensis?: string;
}
