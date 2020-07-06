import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

const plugins = [
  commonjs(),
  json(),
  typescript({
    "module": "commonjs",
        "moduleResolution": "node",
        "lib": [
            "dom",
            "esnext"
        ],
        "target": "es5"
  })
];

export default [
  {
    input: 'src/charsets.ts',
    output: {
      dir: 'dist',
      format: 'cjs'
    },
    plugins: plugins
  },
  {
    input: 'src/makensis.ts',
    output: {
      dir: 'dist',
      format: 'cjs'
    },
    plugins: plugins
  },
  {
    input: 'src/util.ts',
    output: {
      dir: 'dist',
      format: 'cjs'
    },
    plugins: plugins
  }
];
