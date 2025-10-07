import {useState} from 'react';
import {describe, expect, it} from 'vitest';
import {act, renderHook, renderHookServer} from '../index.js';
import {expectResultValue} from './test-helpers.test.js';

describe('useState on the client', () => {
	it('should use setState value', async () => {
		const {result} = await renderHook(() => {
			const [state, setState] = useState('foo');

			return {state, setState};
		});

		expect(expectResultValue(result).state).toBe('foo');
	});

	it('should update state', async () => {
		const {result} = await renderHook(() => {
			const [state, setState] = useState('foo');

			return {state, setState};
		});

		await act(async () => {
			expectResultValue(result).setState('bar');
		});

		expect(expectResultValue(result).state).toBe('bar');
	});
});

describe('useState SSR hydrated', () => {
	it('should update state after hydration', async () => {
		const {result, hydrate} = await renderHookServer(() => {
			const [state, setState] = useState('foo');

			return {state, setState};
		});

		await act(async () => {
			expectResultValue(result).setState('bar');
		});

		expect(result.all.length).toBe(1);

		await hydrate();

		await act(async () => {
			expectResultValue(result).setState('bar');
		});

		expect(expectResultValue(result).state).toBe('bar');
	});
});
