declare namespace makensis {
  interface CompilerOptions {
    // makensis
    define?: unknown;
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

  interface StreamOptions {
    stdout?: string;
    stderr?: string;
  }
}

export = makensis;
