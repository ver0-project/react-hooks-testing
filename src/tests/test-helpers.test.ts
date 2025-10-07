import {expect} from 'vitest';
import type {ResultValue} from '../index.js';

/**
 * Helper to assert that a hook result is successful and extract its value in a type-safe way.
 */
export function expectResultValue<T>(result: ResultValue<T>) {
	expect(result.error).toBeUndefined();

	if (result.error) {
		throw new Error('result has unexpected error');
	}

	return result.value;
}
