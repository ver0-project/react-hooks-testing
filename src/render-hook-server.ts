import {hydrateRoot} from 'react-dom/client';
import type {Root} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {act} from './act.js';
import {createHookRenderer} from './create-hook-renderer.js';
import type {RendererOptions, RendererProps} from './create-hook-renderer.js';
import {createHookTestHarness} from './harness.js';

function createServerRenderer<Props, Result>(
	rendererProps: RendererProps<Props, Result>,
	options?: RendererOptions<NoInfer<Props>>,
) {
	let renderProps: Props | undefined;
	let container: Element | undefined;
	let root: Root | undefined;
	let output = '';
	const harness = createHookTestHarness(rendererProps, options?.wrapper);

	return {
		async render(props: Props) {
			renderProps = props;
			try {
				output = renderToString(harness(props));
			} catch (error: unknown) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				rendererProps.setError(error as Error);
			}
		},
		async hydrate() {
			if (container) {
				throw new Error('The component can only be hydrated once');
			}

			container = document.createElement('div');
			container.innerHTML = output;

			await act(async () => {
				root = hydrateRoot(container!, harness(renderProps!), {
					onCaughtError(...args) {
						// we don't need to log these errors as it is accessible via renderer's values
						// this function exists only to prevent React from logging errors to the console

						options?.onCaughtError?.(...args);
					},
					onRecoverableError: options?.onRecoverableError,
				});
			});
		},
		async rerender(props?: Props) {
			if (!root) {
				throw new Error('You must hydrate the component before you can rerender');
			}

			await act(async () => {
				root!.render(harness(props ?? renderProps!));
			});
		},
		async unmount() {
			if (!root) {
				return;
			}

			await act(async () => {
				root!.unmount();
			});
		},
	};
}

/**
 * Renders a hook assuming server environment (lack of DOM). Compared to `renderHook`, this renderer
 * provides `hydrate` method to hydrate the rendered component.
 */
export const renderHookServer = createHookRenderer(createServerRenderer);
