import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

const plugins = [
  commonjs(),
  json()
];

const compilerOptions = {
  allowSyntheticDefaultImports: true,
  module: "ES2020",
  moduleResolution: "node",
  strictNullChecks: true,
  typeRoots: ['./types', './node_modules/@types']
};

const external = [
  '@nsis/language-data',
  'child_process',
  'events',
  'os',
  'shlex'
];

export default [
  {
    external,
    input: 'src/makensis.ts',
    output: {
      file: 'dist/makensis.mjs',
      format: 'esm'
    },
    plugins: [
      ...plugins,
      typescript(compilerOptions)
    ]
  }
];
