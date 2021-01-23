import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

const plugins = [
  commonjs(),
  json(),
  typescript({
    allowSyntheticDefaultImports: true,
    strictNullChecks: true
  })
];

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
      dir: 'dist',
      format: 'cjs'
    },
    plugins: plugins
  }
];
