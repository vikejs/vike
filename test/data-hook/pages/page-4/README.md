This page:
* overrides the `data()` hook via `+data.tsx`
* changes the `data()` hook's `env` to client only via `+meta.ts`
* doesn't override the global `onBeforeRender()` hook
* changes the `onBeforeRender()` hook's `env` to client and server via `+meta.ts`
