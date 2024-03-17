import { defineConfig } from 'tsup';

export default defineConfig({
	target: 'esnext',
  clean: true,
  dts: true,
  entry: ['src/makensis.ts'],
	external: ['@nsis/language-data'],
	format: ['cjs', 'esm'],
  minify: true,
  treeshake: 'recommended'
});
