import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

const plugins = [
  commonjs(),
  json(),
  typescript({
    allowSyntheticDefaultImports: true
  })
];

const external = [
  'child_process',
  'os'
];

export default [
  {
    external,
    input: 'src/charsets.ts',
    output: {
      dir: 'dist',
      format: 'cjs'
    },
    plugins: plugins
  },
  {
    external,
    input: 'src/makensis.ts',
    output: {
      dir: 'dist',
      format: 'cjs'
    },
    plugins: plugins
  },
  {
    external,
    input: 'src/util.ts',
    output: {
      dir: 'dist',
      format: 'cjs'
    },
    plugins: plugins
  }
];
