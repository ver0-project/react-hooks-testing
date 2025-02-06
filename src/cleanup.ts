export type CleanupCallback = () => Promise<void> | void;

const cbs = new Set<CleanupCallback>();

/**
 * Perform all registered cleanup callbacks.
 */
export async function hooksCleanup() {
	for (const cb of cbs) {
		cbs.delete(cb);

		// eslint-disable-next-line no-await-in-loop
		await cb();
	}
}

/**
 * Register a cleanup callback. Returns a function that can be used to remove the callback.
 */
export function cleanupAdd(cb: CleanupCallback) {
	cbs.add(cb);
}

/**
 * Remove a cleanup callback.
 */
export function cleanupRemove(cb: CleanupCallback) {
	cbs.delete(cb);
}
