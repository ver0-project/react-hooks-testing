import {describe, expect, test} from 'vitest';
import {renderHookServer} from '../index.js';
import {expectResultValue} from './test-helpers.test.js';

describe('result history SSR', () => {
	function useValue(value: number) {
		if (value === 2) {
			throw new Error('expected');
		}

		return value;
	}

	test('should capture all renders states of hook with hydration', async () => {
		const {result} = await renderHookServer((value) => useValue(value), {initialProps: 0});

		expect(expectResultValue(result)).toEqual(0);
		expect(result.all).toEqual([{value: 0}]);
	});
});
