import {act as reAct} from "react";

type reactGlobal = typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }


/* v8 ignore next 7 */
function getGlobalThis(): reactGlobal {
	if (typeof globalThis !== 'undefined') return globalThis;
	if (typeof self !== 'undefined') return self;
	if (typeof window !== 'undefined') return window;

	throw new Error('Unable to locate global object');
}

function setIsReactEnvironment() {
	const g = getGlobalThis();
	const initial = g.IS_REACT_ACT_ENVIRONMENT;

	g.IS_REACT_ACT_ENVIRONMENT = true;

	return () => {
		g.IS_REACT_ACT_ENVIRONMENT = initial;
	}
}

/**
 * A wrapper around React's `act` function that temporarily sets a global flag
 * indicating a React environment. This prevents errors related to React being
 * in an unexpected environment.
 */
export async function act<T>(callback: () => Promise<T>): Promise<T> {
	const revertEnv = setIsReactEnvironment();

	try {
		return await reAct(callback);
	} finally {
		revertEnv();
	}
}
