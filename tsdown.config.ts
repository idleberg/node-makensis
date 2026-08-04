import { defineConfig } from 'tsdown';
import pkg from './package.json' with { type: 'json' };

export default defineConfig((options) => {
	const isProduction = options.watch !== true;

	return {
		clean: true,
		deps: {
			neverBundle: [...Object.keys(pkg.dependencies)],
		},
		dts: isProduction,
		entry: ['src/makensis.ts'],
		format: 'esm',
		minify: isProduction,
		target: 'esnext',
		treeshake: isProduction,
	};
});
