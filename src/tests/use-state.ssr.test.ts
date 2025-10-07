import {useState} from 'react';
import {describe, expect, it} from 'vitest';
import {act, renderHookServer} from '../index.js';
import {expectResultValue} from './test-helpers.test.js';

describe('useState SSR, non-hydrated', () => {
	it('should use setState value', async () => {
		const {result} = await renderHookServer(() => {
			const [state, setState] = useState('foo');

			return {state, setState};
		});

		expect(expectResultValue(result).state).toBe('foo');
	});

	it('should not update state without hydration', async () => {
		const {result} = await renderHookServer(() => {
			const [state, setState] = useState('foo');

			return {state, setState};
		});

		await act(async () => {
			expectResultValue(result).setState('bar');
		});

		expect(result.all.length).toBe(1);
	});
});
