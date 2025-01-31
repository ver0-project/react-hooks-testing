import {Component, createElement, JSXElementConstructor, PropsWithChildren, ReactNode} from "react";
import {RendererProps} from "./create-hook-renderer.js";

// minimal ErrorBoundary implementation

type ErrorBoundaryProps = PropsWithChildren<{
	onError: (error: Error, resetError: () => void) => void;
}>;

type ErrorBoundaryState = {
	hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state = {hasError: false};

	static getDerivedStateFromError() {
		return {hasError: true}
	}

	resetError = () => {
		this.setState({hasError: false})
	}

	componentDidCatch(error: Error) {
		this.props.onError(error, this.resetError);
	}

	render() {
		if (this.state.hasError) {
			return null
		}

		return this.props.children;
	}
}


export function createHookTestHarness<Props, Result>(
	{callback, setValue, setError}: RendererProps<Props, Result>,
	wrapper?: JSXElementConstructor<{ children: ReactNode }>
) {
	function TestComponent({hookProps}: { hookProps: Props }) {
		setValue(callback(hookProps))
		return null;
	}

	let resetError: (() => void) | undefined;
	const handleError = (error: Error, reset: () => void) => {
		resetError = () => {
			resetError = undefined;
			reset();
		};

		setError(error);
	}

	return (props: Props) => {
		resetError?.();

		let children = <TestComponent hookProps={props}/>;
		if (wrapper) {
			children = createElement(wrapper, null, children);
		}

		return (
			<ErrorBoundary onError={handleError}>{children}</ErrorBoundary>
		)
	};
}
