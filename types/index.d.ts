import type { EventEmitter } from 'node:events';
import type { SpawnOptions } from 'node:child_process';

declare module 'makensis' {
	function commandHelp(command: string, compilerOptions: CompilerOptions, spawnOptions: SpawnOptions): Promise<CompilerOutput>;
	function compile(script: string, compilerOptions: CompilerOptions, spawnOptions: SpawnOptions): Promise<CompilerOutput>;
	function headerInfo(compilerOptions: CompilerOptions, spawnOptions: SpawnOptions): Promise<CompilerOutput>;
	function license(compilerOptions: CompilerOptions, spawnOptions: SpawnOptions): Promise<CompilerOutput>;
	function nsisDir(compilerOptions: CompilerOptions): Promise<string | JSON>;
	function version(compilerOptions: CompilerOptions, spawnOptions: SpawnOptions): Promise<CompilerOutput>;

	const events: EventEmitter;

  interface DefineOptions {
    [key: string]: string;
  }

  interface CompilerOptions {
    // makensis
    define?: DefineOptions;
    env?: string | boolean;
    events?: boolean;
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

  interface EnvironmentVariables {
    [key: string]: string;
  }

  type MapArguments = [string, string[], MapArgumentOptions];

  interface MapArgumentOptions {
    events?: boolean;
    json?: boolean;
    wine?: boolean;
  }

  interface StreamOptions {
    stdout: string;
    stderr: string;
  }
}
