import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

const plugins = [
  commonjs(),
  json()
];

const external = [
  '@nsis/language-data',
  'child_process',
  'dotenv',
  'dotenv-expand',
  'events',
  'os',
  'shlex'
];

export default [
  {
    external,
    input: 'src/makensis.ts',
    output: {
      file: 'dist/makensis.cjs',
      format: 'cjs'
    },
    plugins: [
      ...plugins,
      typescript()
    ]
  },
  {
    external,
    input: 'src/makensis.ts',
    output: {
      file: 'dist/makensis.mjs',
      format: 'esm'
    },
    plugins: [
      ...plugins,
      typescript({
        module: "ES2020",
        moduleResolution: "node"
      })
    ]
  }
];
