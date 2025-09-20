# React Hooks Testing Library

## Project Overview

This is a comprehensive testing library for React hooks that provides utilities for testing custom hooks in both
client-side (DOM) and server-side rendering (SSR) environments.

## Purpose

The library simplifies testing React hooks by providing:

- Hook rendering utilities for DOM and SSR environments
- Result history tracking for hook state changes
- Error handling and testing capabilities
- Wrapper component support for context providers
- Cleanup utilities for test environments

## Key Features

- **Dual Environment Support**: Test hooks in both DOM and SSR contexts
- **State History Tracking**: Monitor how hook state changes over time
- **Error Testing**: Verify error handling in custom hooks
- **Context Integration**: Test hooks that depend on React context
- **TypeScript Support**: Full TypeScript definitions for type safety

## Architecture

### Core Components

1. **Hook Renderers** (`render-hook.ts`, `render-hook-server.ts`)
   - Primary interfaces for rendering hooks in test environments
   - Handle initial props, re-renders, and cleanup

2. **Hook Renderer Factory** (`create-hook-renderer.ts`)
   - Creates configured renderer instances
   - Manages environment-specific setup

3. **Test Harness** (`harness.tsx`)
   - React component wrapper for hook execution
   - Provides context and error boundary functionality

4. **Utilities**
   - `act.ts`: React testing utilities integration
   - `cleanup.ts`: Test cleanup and memory management

### Testing Structure

The test suite is organized into:

- **DOM Tests** (`.dom.test.ts`): Client-side rendering scenarios
- **SSR Tests** (`.ssr.test.ts`): Server-side rendering scenarios
- **Setup Tests**: Configuration and initialization testing

## Dependencies

### Runtime Dependencies

- `react`: React library for hook functionality
- `react-dom`: DOM-specific React functionality (peer dependency)

### Development Dependencies

- `vitest`: Modern testing framework
- `jsdom`: DOM environment simulation
- `@types/react`: TypeScript definitions for React
- `eslint`: Code linting and quality
- `typescript`: TypeScript compiler

## Usage Patterns

The library supports various testing patterns:

1. **Basic Hook Testing**: Test simple state hooks
2. **Effect Hook Testing**: Test hooks with side effects
3. **Context Hook Testing**: Test hooks that consume React context
4. **Error Boundary Testing**: Test error handling in hooks
5. **SSR Compatibility**: Verify hooks work in server environments

## Build and Development

- **Build**: `yarn build` - Compiles TypeScript to JavaScript
- **Test**: `yarn test` - Runs the test suite
- **Lint**: `yarn lint` - Code quality checks
- **Coverage**: `yarn test:coverage` - Test coverage analysis

## Distribution

The library is published as an npm package with:

- Main entry point: `dist/index.js`
- TypeScript definitions: `dist/index.d.ts`
- ES Module format for modern bundlers

## Continuous Integration

Automated CI pipeline includes:

- Code linting and formatting
- TypeScript compilation
- Test execution with coverage
- Automated releases via semantic-release
- Dependabot integration for dependency updates

This library serves as a foundation for comprehensive React hook testing across different rendering environments.
