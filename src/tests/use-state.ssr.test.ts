import {useState} from "react";
import {describe, expect, it} from "vitest";
import {act, renderHookServer} from "../index.js";

describe("useState SSR, non-hydrated", () => {
	it('should use setState value', async () => {
		const {result} = await renderHookServer(() => useState('foo'))

		expect(result.value).not.toBe(undefined)
		expect(result.error).toBe(undefined)

		if (result.value === undefined) {
			return;
		}

		expect(result.value[0]).toBe('foo')
	})

	it('should not update state without hydration', async () => {
		const {result} = await renderHookServer(() => useState('foo'))

		expect(result.value).not.toBe(undefined)
		expect(result.error).toBe(undefined)

		if (result.value === undefined) {
			return;
		}

		await act(async () => {
			result.value[1]('bar')
		})

		expect(result.all.length).toBe(1)
	})
})
