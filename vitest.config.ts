import {defineConfig} from 'vitest/config';

export default defineConfig({
	test: {
		dir: './src',
		setupFiles: [
			'./src/tests/setup/react-hooks.test.ts',
		],
		passWithNoTests: true,
		workspace: [
			{
				extends: true,
				test: {
					name: "DOM",
					include: [
						'**/*.dom.test.ts',
					],
					environment: 'jsdom'
				}
			},
			{
				extends: true,
				test: {
					name: "SSR",
					include: [
						'**/*.ssr.test.ts',
					],
					environment: 'node'
				}
			}
		],
	},
});
