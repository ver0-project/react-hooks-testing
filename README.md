<div align="center">
	<h1>@ver0/react-hooks-testing</h1>
	<p>🧪 Test your React hooks with ease!</p>
</div>

---

### Features

- ✅ Supports React 19.
- ✅ Server-Side Rendering (SSR) support.
- ✅ Easy-to-use API.
- ✅ Errors reporting, even for SSR.
- ✅ Compatible with any testing framework.

### Why this package exists?

In May 2022, [
`@testing-library/react-hooks`](https://github.com/testing-library/react-hooks-testing-library/issues/849)
was announced as deprecated, leaving its users locked to React 17. The so-called "merge" with
`@testing-library/react` was never fully realized, as the provided `renderHook` offers only a
fraction of the functionality that `@testing-library/react-hooks` had, and it completely lacks SSR
support.

I had hoped that the release of React 19 and server components would bring changes, but nothing has
improved despite React 19 being in RC for almost a year before its release. When asking about SSR
support, the response is often to resolve the issues independently.

This package was created to meet the needs of the hooks library I have been developing. I encourage
everyone to contribute and help make hooks testing simple again. This package offers improved
typings compared to `@testing-library/react-hooks`, is testing-framework agnostic, supports SSR, and
is easy to use.

### Dependencies and compatibility

This package aims to be compatible only with the current major version of React. Additionally,
it encourages the use of newer React APIs, such as completely ditching synchronous rendering
and support of synchronous `act` behavior, as React documentation states it will
be [deprecated in future releases](https://react.dev/reference/react/act#await-act-async-actfn).

### How to use


