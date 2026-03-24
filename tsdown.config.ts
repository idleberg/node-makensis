import { defineConfig } from 'tsdown';

export default defineConfig((options) => {
	const isProduction = options.watch !== true;

	return {
		clean: true,
		deps: {
			neverBundle: ['@nsis/language-data'],
		},
		dts: isProduction,
		entry: ['src/makensis.ts'],
		format: 'esm',
		minify: isProduction,
		target: 'esnext',
		treeshake: isProduction,
	};
});
