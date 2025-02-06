import {describe, expect, test} from 'vitest';
import {renderHook, renderHookServer} from '../index.js';

describe('result history DOM', () => {
	function useValue(value: number) {
		if (value === 2) {
			throw new Error('expected');
		}
		return value;
	}

	test('should capture all renders states of hook', async () => {
		const {result, rerender} = await renderHook((value) => useValue(value), {initialProps: 0});

		expect(result.value).toEqual(0);
		expect(result.all).toEqual([{value: 0}]);

		await rerender(1);

		expect(result.value).toBe(1);
		expect(result.all).toEqual([{value: 0}, {value: 1}]);

		await rerender(2);

		// "fun part" is that react tries to render errored component twice, therefore we have two errors
		expect(result.error).toEqual(new Error('expected'));
		expect(result.all).toEqual([{value: 0}, {value: 1}, {error: new Error('expected')}]);

		await rerender(3);

		expect(result.value).toBe(3);
		expect(result.all).toEqual([{value: 0}, {value: 1}, {error: new Error('expected')}, {value: 3}]);

		await rerender();

		expect(result.value).toBe(3);
		expect(result.all).toEqual([{value: 0}, {value: 1}, {error: new Error('expected')}, {value: 3}, {value: 3}]);
	});
});

describe('result history SSR hydrated', () => {
	function useValue(value: number) {
		if (value === 2) {
			throw new Error('expected');
		}
		return value;
	}

	test('should capture all renders states of hook with hydration', async () => {
		const {result, hydrate, rerender} = await renderHookServer((value) => useValue(value), {initialProps: 0});

		expect(result.value).toEqual(0);
		expect(result.all).toEqual([{value: 0}]);

		await hydrate();

		expect(result.value).toEqual(0);
		expect(result.all).toEqual([{value: 0}, {value: 0}]);

		await rerender(1);

		expect(result.value).toBe(1);
		expect(result.all).toEqual([{value: 0}, {value: 0}, {value: 1}]);

		await rerender(2);

		// "fun part" is that react tries to render errored component twice, therefore we have two errors
		expect(result.error).toEqual(new Error('expected'));
		expect(result.all).toEqual([{value: 0}, {value: 0}, {value: 1}, {error: new Error('expected')}]);

		await rerender(3);

		expect(result.value).toBe(3);
		expect(result.all).toEqual([{value: 0}, {value: 0}, {value: 1}, {error: new Error('expected')}, {value: 3}]);

		await rerender();

		expect(result.value).toBe(3);
		expect(result.all).toEqual([
			{value: 0},
			{value: 0},
			{value: 1},
			{error: new Error('expected')},
			{value: 3},
			{value: 3},
		]);
	});
});
