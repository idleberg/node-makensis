import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

const plugins = [
  commonjs(),
  json()
];

const compilerOptions = {
  allowSyntheticDefaultImports: true,
  moduleResolution: "node",
  strictNullChecks: true,
  typeRoots: ['./types', './node_modules/@types']
};

const external = [
  'child_process',
  'events',
  'os',
  'quoted-string-space-split'
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
      typescript(compilerOptions)
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
        ...compilerOptions,
        module: "ES2020",
        moduleResolution: "node"
      })
    ]
  }
];
