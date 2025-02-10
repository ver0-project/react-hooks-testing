import {buildConfig} from '@ver0/eslint-config';

/** @typedef {import('eslint').Linter} Linter */

/** @type {Linter.Config[]} */
const cfg = [
	{
		ignores: ['dist', 'node_modules', '.yarn', 'coverage'],
	},
	...buildConfig({
		globals: 'node',
		react: true,
		vitest: true,
	}),
	{
		files: ['README.md'],
		language: 'markdown/gfm',
	},
];

export default cfg;
