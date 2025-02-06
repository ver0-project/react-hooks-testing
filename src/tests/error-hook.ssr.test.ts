import {describe, expect, test} from 'vitest';
import {renderHookServer} from '../index.js';

describe('error hook SSR', () => {
	function throwError(shouldThrow?: boolean) {
		if (shouldThrow) {
			throw new Error('expected');
		}
	}

	describe('synchronous', () => {
		function useError(shouldThrow?: boolean) {
			throwError(shouldThrow);
			return true;
		}

		test('should capture error', async () => {
			const {result} = await renderHookServer(() => useError(true));

			expect(result.error).toEqual(new Error('expected'));
		});
	});
});
