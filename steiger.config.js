import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

// https://github.com/feature-sliced/steiger
export default defineConfig([
	...fsd.configs.recommended,
	{
		files: ['./src/**'],
		rules: {
			'fsd/insignificant-slice': 'off',
			'fsd/excessive-slicing': 'off',
			'fsd/shared-lib-grouping': 'off',
		},
	},
]);
