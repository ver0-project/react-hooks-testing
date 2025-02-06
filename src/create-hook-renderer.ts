import type {JSXElementConstructor, ReactNode} from 'react';
import type {RootOptions} from 'react-dom/client';
import {cleanupAdd, cleanupRemove} from './cleanup.js';

/**
 * Represents the result of rendering a hook.
 */
export type ResultValue<T> =
	| {
			readonly value: undefined;
			readonly error: Error;
	  }
	| {
			readonly value: T;
			readonly error: undefined;
	  };

/**
 * Represents the last rendered hook result and all previous results.
 */
export type ResultValues<T> = ResultValue<T> & {
	readonly all: Array<ResultValue<T>>;
};

function newResults<T>() {
	const results: Array<ResultValue<T>> = [];

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	const result = {
		get all() {
			return [...results];
		},
		get value() {
			// it is impossible to test it in unit-tests - results are populated
			// by the hook on the first render.
			/* v8 ignore next 3 */
			if (results.length === 0) {
				return undefined;
			}

			return results.at(-1)!.value;
		},
		get error() {
			// it is impossible to test it in unit-tests - results are populated
			// by the hook on the first render.
			/* v8 ignore next 3 */
			if (results.length === 0) {
				return undefined;
			}

			return results.at(-1)!.error;
		},
	} as ResultValues<T>;

	return {
		result,
		setValue(value: T) {
			results.push(Object.freeze({value, error: undefined}));
		},
		setError(error: Error) {
			results.push(Object.freeze({value: undefined, error}));
		},
	};
}

// Describes generic hook renderer, disregarding the environment-specific details.
export type Renderer<Props> = {
	render(props?: Props): Promise<void>;
	rerender(props?: Props): Promise<void>;
	unmount(): Promise<void>;
};

// Describes the props that renderer creator receives, which allows it to expose callback invocation results.
export type RendererProps<Props, Result> = {
	callback(props: Props): Result;
	setValue(value: Result): void;
	setError(error: Error): void;
};

// Describes the renderer creator function that creates a renderer for a specific hook.
export type RendererCreator<Props, Result, TRenderer extends Renderer<Props>> = (
	props: RendererProps<Props, Result>,
	options?: RendererOptions<NoInfer<Props>>
) => TRenderer;
export type RendererOptions<Props> = {
	initialProps?: Props;
	wrapper?: JSXElementConstructor<{children: ReactNode}>;
} & Pick<RootOptions, 'onCaughtError' | 'onRecoverableError'>;

export function createHookRenderer<Props, Result, TRenderer extends Renderer<Props>>(
	createRenderer: RendererCreator<Props, Result, TRenderer>
) {
	return async (callback: (props: Props) => Result, options?: RendererOptions<Props>) => {
		const {result, setValue, setError} = newResults<Result>();

		// this variable holds previous props, so it is possible to rerender
		// with previous props preserved
		let hookProps = options?.initialProps;
		const {render, rerender, unmount, ...rest} = createRenderer(
			{
				callback,
				setValue,
				setError,
			},
			options
		);

		await render(hookProps);

		const rerenderHook = async (props?: Props) => {
			hookProps = props ?? hookProps;
			await rerender(hookProps);
		};

		const unmountHook = async () => {
			cleanupRemove(unmountHook);
			await unmount();
		};

		cleanupAdd(unmountHook);

		return {
			result,
			rerender: rerenderHook,
			unmount: unmountHook,
			...rest,
		};
	};
}
