declare namespace makensis {
  interface DefineOptions {
    [key: string]: string;
  }

  interface CompilerOptions {
    // makensis
    define?: DefineOptions;
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
    pathToWine?: string;
  }

  interface CompilerOutput {
    status: number;
    stdout: string;
    stderr: string;
    warnings: number;
  }

  type MapArguments = [string, string[], MapArgumentOptions];

  interface MapArgumentOptions {
    json?: boolean;
    wine?: boolean;
  }

  interface StreamOptions {
    stdout: string;
    stderr: string;
  }
}

export = makensis;
