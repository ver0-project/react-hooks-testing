<div align="center">
<h1>@ver0/react-hooks-testing</h1>

[![NPM Version](https://img.shields.io/npm/v/%40ver0%2Freact-hooks-testing?style=flat-square)](https://www.npmjs.com/package/@ver0/react-hooks-testing)
[![NPM Downloads](https://img.shields.io/npm/dm/%40ver0%2Freact-hooks-testing?style=flat-square)](https://www.npmjs.com/package/@ver0/react-hooks-testing)
[![Dependents (via libraries.io), scoped npm package](https://img.shields.io/librariesio/dependents/npm/%40ver0/react-hooks-testing?style=flat-square)](https://www.npmjs.com/package/@ver0/react-hooks-testing)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/ver0-project/react-hooks-testing/ci.yml?style=flat-square)](https://github.com/ver0-project/react-hooks-testing/actions)
[![Codecov](https://img.shields.io/codecov/c/github/ver0-project/react-hooks-testing?token=Y2K96S71RH&style=flat-square)](https://app.codecov.io/gh/ver0-project/react-hooks-testing)
[![NPM Type Definitions](https://img.shields.io/npm/types/%40ver0%2Freact-hooks-testing?style=flat-square)](https://www.npmjs.com/package/@ver0/react-hooks-testing)

<p><br/>🧪 Test your React hooks with ease!</p>
</div>

### Features

- ✅ Supports React 19.
- ✅ Server-Side Rendering (SSR) support.
- ✅ Easy-to-use API.
- ✅ Errors reporting, even for SSR.
- ✅ Compatible with any testing framework.

### Why this package exists?

In May 2022,
[ `@testing-library/react-hooks`](https://github.com/testing-library/react-hooks-testing-library/issues/849) was
announced as deprecated, leaving its users locked to React 17. The so-called "merge" with `@testing-library/react` was
never fully realized, as the provided `renderHook` offers only a fraction of the functionality that
`@testing-library/react-hooks` had, and it completely lacks SSR support.

I had hoped that the release of React 19 and server components would bring changes, but nothing has improved despite
React 19 being in RC for almost a year before its release. When asking about SSR support, the response is often to
resolve the issues independently.

This package was created to meet the needs of the hooks library I have been developing. I encourage everyone to
contribute and help make hooks testing simple again. This package offers improved typings compared to
`@testing-library/react-hooks`, is testing-framework agnostic, supports SSR, and is easy to use.

### Dependencies and compatibility

This package aims to be compatible only with the current major version of React. Additionally, it encourages the use of
newer React APIs, such as completely ditching synchronous rendering and support of synchronous `act` behavior, as React
documentation states it will be
[deprecated in future releases](https://react.dev/reference/react/act#await-act-async-actfn).

### How to use

Since the library is designed to be testing-framework agnostic, it does not have any automatic setup and therefore
requires a tiny bit of pre-configuration to work with your testing framework. I'm using `vitest` and will provide
examples for it, but all known frameworks have similar setup functionality.

As this library is tested through testing other hooks, following configuration is applied to this repository and can be
used as an example.

#### Setup

After adding `@ver0/react-hooks-testing` to your dev-dependencies, create a file with the following content and add it
to your test runner configuration as a global setup file.

```ts filename="react-hooks.test.ts"
import {hooksCleanup} from '@ver0/react-hooks-testing';
import {afterEach} from 'vitest';

afterEach(hooksCleanup);
```

```ts filename="vitest.config.ts"
import {defineConfig} from 'vitest/config';

export default defineConfig({
	test: {
		dir: './src',
		setupFiles: ['./src/tests/setup/react-hooks.test.ts'],
	},
});
```

Or, if you don't have many hooks to test, add it directly to your test files.

All this code does - unmounts all rendered hooks after each test, so you don't have to worry about it yourself.

#### Testing client-side hooks

`renderHook` function made close to `@testing-library/react` API-wise, but with several differences, that are dictated
by `act` function.

The `act` function provided by this library is similar to the one from `react`, but with stricter typings. It only
allows async functions to be passed to it, ensuring it always returns a promise, which should be awaited. This is in
line with the React documentation, which [states](https://react.dev/reference/react/act#await-act-async-actfn) that
synchronous `act` will be deprecated in future releases.

Additionally, this `act` function bypasses the
[console error](https://react.dev/reference/react/act#error-the-current-testing-environment-is-not-configured-to-support-act)
regarding the testing environment configuration. Since you're using this library to test hooks, you're already in a
testing environment, making this error redundant.

```ts filename="useState.test.ts"
import {expect, test} from 'vitest';
import {act, renderHook} from '@ver0/react-hooks-testing';

test('should use setState value', async () => {
	const {result} = await renderHook(() => useState('foo'));

	expect(result.value).toBe('foo');
	expect(result.error).toBe(undefined);

	if (result.value === undefined) {
		return;
	}

	await act(async () => {
		result.value[1]('bar');
	});

	expect(result.value[0]).toBe('bar');
});
```

As you can see in above example - `renderHook` function is asynchronous, reason for that is React's request to perform
any rendering within the `act` function.

In contrast to `@testing-library/react`, result object has the following type definition:

```ts
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
	readonly all: ResultValue<T>[];
};
```

The render results history is accessible via the `all` property, which contains every rendering result as well as the
value of the latest render. Unlike `@testing-library/react`, which collects results during the effect phase, this
library populates the results during the render phase - it allows to ensure tested hook results correctness throughout
each render.

Another notable difference is the `error` property. This property captures any error thrown during the hook’s rendering,
thanks to an Error Boundary component wrapped around the hook’s harness component.

Each result object is immutable and contains either a `value` or an `error` property—but never both. The hook’s result
object follows the same principle. Although the `value` and `error` properties are implemented as getters and always
exist, the values they return correspond to the most recent render result from the `all` array.

Otherwise, the API is similar to `@testing-library/react`. Note that the `waitForNextUpdate` function is not provided,
as modern testing frameworks include their own `waitFor` function, which serves the same purpose.

#### Testing server-side hooks

The primary purpose of this package is to provide out-of-the-box SSR (Server-Side Rendering) support through the
`renderHookServer` function. This function works similarly to `renderHook` but includes a few key differences:

- **Initial Render:** The initial render is performed using React's `renderToString` function.
- **Hydration:** The hook's render result includes an extra `hydrate` function that hydrates the hook after the initial
  render.
- **DOM Root Creation:** The client-side DOM root is created only when the `hydrate` function is called, facilitating
  testing in a server environment.
- **Rerenders:** Rerenders are only possible after hydration.

Otherwise, usage is similar to `renderHook`, so dedicated examples are not provided. For usage examples, refer to the
`*.ssr.test.ts` files in this repository.
