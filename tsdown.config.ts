import { defineConfig } from 'tsdown';

export default defineConfig({
	clean: true,
	deps: {
		neverBundle: ['@nsis/language-data'],
	},
	dts: true,
	entry: ['src/makensis.ts'],
	format: 'esm',
	target: 'esnext',
	treeshake: true,
});
