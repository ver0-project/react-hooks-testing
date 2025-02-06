import {useEffect, useState} from 'react';
import {describe, expect, test, vi} from 'vitest';
import {renderHook, renderHookServer} from '../index.js';

describe('error hook DOM', () => {
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
			const {result} = await renderHook(() => useError(true));

			expect(result.error).toEqual(new Error('expected'));
		});

		test('should reset error', async () => {
			const {result, rerender} = await renderHook(({shouldThrow}) => useError(shouldThrow), {
				initialProps: {shouldThrow: true},
			});

			expect(result.error).not.toBe(undefined);

			await rerender({shouldThrow: false});

			expect(result.value).not.toBe(undefined);
			expect(result.error).toBe(undefined);
		});
	});

	describe('asynchronous', () => {
		function useAsyncError(shouldThrow: boolean) {
			const [value, setValue] = useState<boolean>();
			useEffect(() => {
				const timeout = setTimeout(() => {
					setValue(shouldThrow);
				}, 100);
				return () => {
					clearTimeout(timeout);
				};
			}, [shouldThrow]);
			throwError(value);
			return true;
		}

		test('should capture async error', async () => {
			const {result} = await renderHook(() => useAsyncError(true));

			await vi.waitFor(() => {
				expect(result.error).toEqual(new Error('expected'));
			});
		});

		test('should reset async error', async () => {
			const {result, rerender} = await renderHook(({shouldThrow}) => useAsyncError(shouldThrow), {
				initialProps: {shouldThrow: true},
			});

			await vi.waitFor(() => {
				expect(result.error).not.toBe(undefined);
			});

			await rerender({shouldThrow: false});

			await vi.waitFor(() => {
				expect(result.value).not.toBe(undefined);
				expect(result.error).toBe(undefined);
			});
		});
	});

	describe('effect', () => {
		function useEffectError(shouldThrow: boolean) {
			useEffect(() => {
				throwError(shouldThrow);
			}, [shouldThrow]);
			return true;
		}

		test('should capture effect error', async () => {
			const {result} = await renderHook(() => useEffectError(true));
			expect(result.error).toEqual(new Error('expected'));
		});

		test('should reset effect error', async () => {
			const {result, rerender} = await renderHook(({shouldThrow}) => useEffectError(shouldThrow), {
				initialProps: {shouldThrow: true},
			});

			expect(result.error).not.toBe(undefined);

			await rerender({shouldThrow: false});

			expect(result.value).not.toBe(undefined);
			expect(result.error).toBe(undefined);
		});
	});
});

describe('error hook SSR client', () => {
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

		test('should reset error', async () => {
			const {result, rerender, hydrate} = await renderHookServer(({shouldThrow}) => useError(shouldThrow), {
				initialProps: {shouldThrow: true},
			});
			expect(result.error).not.toBe(undefined);

			await hydrate();
			await rerender({shouldThrow: false});

			expect(result.value).not.toBe(undefined);
			expect(result.error).toBe(undefined);
		});
	});

	describe('effect', () => {
		function useEffectError(shouldThrow: boolean) {
			useEffect(() => {
				throwError(shouldThrow);
			}, [shouldThrow]);
			return true;
		}

		test('should capture effect error', async () => {
			const {result, hydrate} = await renderHookServer(() => useEffectError(true));
			await hydrate();
			expect(result.error).toEqual(new Error('expected'));
		});

		test('should reset effect error', async () => {
			const {result, rerender, hydrate} = await renderHookServer(({shouldThrow}) => useEffectError(shouldThrow), {
				initialProps: {shouldThrow: true},
			});

			await hydrate();
			expect(result.error).not.toBe(undefined);

			await rerender({shouldThrow: false});

			expect(result.value).not.toBe(undefined);
			expect(result.error).toBe(undefined);
		});
	});
});
