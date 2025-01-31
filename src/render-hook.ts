import {createRoot, Root} from "react-dom/client";
import {act} from "./act.js";
import {createHookRenderer, RendererOptions, RendererProps} from "./create-hook-renderer.js";
import {createHookTestHarness} from "./harness.js";

function createDOMRenderer<Props, Result>(
	rendererProps: RendererProps<Props, Result>,
	options?: RendererOptions<NoInfer<Props>>
) {
	let root: Root | undefined
	const harness = createHookTestHarness(rendererProps, options?.wrapper)

	return {
		async render(props: Props) {
			await act(async () => {
				root = createRoot(document.createElement('div'), {
					onCaughtError: (...args) => {
						// we don't need to log these errors as it is accessible via renderer's values
						// this function exists only to prevent React from logging errors to the console
						options?.onCaughtError?.(...args);
					},
					onRecoverableError: options?.onRecoverableError
				});

				root.render(harness(props));
			})
		},
		async rerender(props: Props) {
			// this is only logical guard - component is always rendered
			/* v8 ignore next 3 */
			if (!root) {
				throw new Error("The component must be rendered first")
			}

			await act(async () => {
				root!.render(harness(props));
			})
		},
		async unmount() {
			// this is only logical guard - component is always rendered
			/* v8 ignore next 3 */
			if (!root) {
				throw new Error("The component must be rendered first")
			}

			await act(async () => {
				root!.unmount();
			})
		},
	}
}

/**
 * Renders a hook assuming DOM environment.
 */
export const renderHook = createHookRenderer(createDOMRenderer);
