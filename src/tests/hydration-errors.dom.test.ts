import {useCallback, useState} from 'react'
import {describe, expect, test} from "vitest";
import {renderHookServer} from "../render-hook-server.js";

describe('hydration errors tests', () => {
	function useCounter() {
		const [count, setCount] = useState(0)

		const increment = useCallback(() => setCount(count + 1), [count])
		const decrement = useCallback(() => setCount(count - 1), [count])

		return {count, increment, decrement}
	}

	test('should throw error if component is rehydrated twice in a row', async () => {
		const {hydrate} = await renderHookServer(() => useCounter())

		await hydrate()

		await expect(async () => await hydrate()).rejects.toThrow(Error('The component can only be hydrated once'))
	})

	test('should throw error if component tries to rerender without hydrating', async () => {
		const {rerender} = await renderHookServer(() => useCounter())

		await expect(async () => await rerender()).rejects.toThrow(
			Error('You must hydrate the component before you can rerender')
		)
	})
})
