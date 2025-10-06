/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		checker({
			typescript: { tsconfigPath: './tsconfig.app.json' },
			eslint: {
				lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
				useFlatConfig: true,
			},
			stylelint: {
				lintCommand: 'stylelint ./src/**/*.css',
			},
		}),
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
	base: './',
	server: {
		port: 5174,
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/shared/tests/index.ts',
	},
});
