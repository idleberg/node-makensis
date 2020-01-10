interface CompilerOptions {
  // makensis
  define?: Object;
  inputCharset?: string;
  json?: boolean;
  noCD?: boolean;
  noConfig?: boolean;
  outputCharset?: string;
  pause?: boolean;
  postExecute?: string | string[];
  preExecute?: string | string[];
  priority?: number;
  ppo?: boolean;
  safePPO?: boolean;
  strict?: boolean;
  verbose?: number;
  wine?: boolean;

  // library
  pathToMakensis?: string;
}

interface CompilerOutput {
  status: number;
  stdout: string;
  stderr: string;
  warnings: number;
}
