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
    priority?: 0 | '0' | 1 | '1' | 2 | '2' | 3 | '3' | 4 | '4' | 5 | '5';
    ppo?: boolean;
    rawArguments?: string;
    safePPO?: boolean;
    strict?: boolean;
    verbose?: 0 | '0' | 1 | '1' | 2 | '2' | 3 | '3' | 4 | '4';
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
