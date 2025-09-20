import type {JSXElementConstructor, PropsWithChildren, ReactNode} from 'react';
import {Component, createElement} from 'react';
import type {RendererProps} from './create-hook-renderer.js';

// minimal ErrorBoundary implementation

type ErrorBoundaryProps = PropsWithChildren<{
	readonly onError: (error: Error, resetError: () => void) => void;
}>;

type ErrorBoundaryState = {
	hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	static getDerivedStateFromError() {
		return {hasError: true};
	}

	state = {hasError: false};

	resetError = () => {
		this.setState({hasError: false});
	};

	componentDidCatch(error: Error) {
		this.props.onError(error, this.resetError);
	}

	// ReactNode types now contain `Promise<>` in return type, therefore
	// linter thinks that we have to make render function async
	// eslint-disable-next-line @typescript-eslint/promise-function-async
	render() {
		if (this.state.hasError) {
			return null;
		}

		return this.props.children;
	}
}

export function createHookTestHarness<Props, Result>(
	{callback, setValue, setError}: RendererProps<Props, Result>,
	wrapper?: JSXElementConstructor<{children: ReactNode}>,
) {
	function TestComponent({hookProps}: {readonly hookProps: Props}) {
		setValue(callback(hookProps));
		return null;
	}

	let resetError: (() => void) | undefined;
	const handleError = (error: Error, reset: () => void) => {
		resetError = () => {
			resetError = undefined;
			reset();
		};

		setError(error);
	};

	return (props: Props) => {
		resetError?.();

		let children = <TestComponent hookProps={props} />;
		if (wrapper) {
			children = createElement(wrapper, null, children);
		}

		return <ErrorBoundary onError={handleError}>{children}</ErrorBoundary>;
	};
}
