import {createContext, createElement, PropsWithChildren, useContext} from "react";
import {describe, expect, test} from "vitest";
import {renderHook} from "../index.js";

describe('wrapper dom test', () => {
	const SomeContext = createContext<string | null>(null);

	function Wrapper({children}: PropsWithChildren) {
		return createElement(SomeContext.Provider, {value: "provided"}, children);
	}

	test('should render within provided wrapper', async () => {
		const {result} = await renderHook(() => useContext(SomeContext), {wrapper: Wrapper});
		expect(result.value).toBe("provided");
	})
})
