import {useState} from 'react';
import {describe, expect, it} from 'vitest';
import {act, renderHook, renderHookServer} from '../index.js';

describe('useState on the client', () => {
	it('should use setState value', async () => {
		const {result} = await renderHook(() => {
			const [state, setState] = useState('foo');

			return {state, setState};
		});

		expect(result.value).not.toBe(undefined);
		expect(result.error).toBe(undefined);

		if (result.value === undefined) {
			return;
		}

		expect(result.value.state).toBe('foo');
	});

	it('should update state', async () => {
		const {result} = await renderHook(() => {
			const [state, setState] = useState('foo');

			return {state, setState};
		});

		expect(result.value).not.toBe(undefined);
		expect(result.error).toBe(undefined);

		if (result.value === undefined) {
			return;
		}

		await act(async () => {
			result.value.setState('bar');
		});

		expect(result.value.state).toBe('bar');
	});
});

describe('useState SSR hydrated', () => {
	it('should update state after hydration', async () => {
		const {result, hydrate} = await renderHookServer(() => {
			const [state, setState] = useState('foo');

			return {state, setState};
		});

		expect(result.value).not.toBe(undefined);
		expect(result.error).toBe(undefined);

		if (result.value === undefined) {
			return;
		}

		await act(async () => {
			result.value.setState('bar');
		});

		expect(result.all.length).toBe(1);

		await hydrate();

		await act(async () => {
			result.value.setState('bar');
		});

		expect(result.value.state).toBe('bar');
	});
});
