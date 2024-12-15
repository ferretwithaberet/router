---
title: History Types
---

While it's not required to know the `@tanstack/history` API itself to use TanStack Router, it's a good idea to understand how it works. Under the hood, TanStack Router requires and uses a `history` abstraction to manage the routing history.

If you don't create a history instance, a browser-oriented instance of this API is created for you when the router is initialized. If you need a special history API type, You can use the `@tanstack/history` package to create your own:

- `createBrowserHistory`: The default history type.
- `createHashHistory`: A history type that uses a hash to track history.
- `createMemoryHistory`: A history type that keeps the history in memory.

Once you have a history instance, you can pass it to the `Router` constructor:

```ts
import { createMemoryHistory, createRouter } from '@tanstack/react-router'

const memoryHistory = createMemoryHistory({
  initialEntries: ['/'], // Pass your initial url
})

const router = createRouter({ routeTree, history: memoryHistory })
```

## Browser Routing

The `createBrowserHistory` is the default history type. It uses the browser's history API to manage the browser history.

## Hash Routing

Hash routing can be helpful if your server doesn't support rewrites to index.html for HTTP requests (among other environments that don't have a server).

```ts
import { createHashHistory, createRouter } from '@tanstack/react-router'

const hashHistory = createHashHistory()

const router = createRouter({ routeTree, history: hashHistory })
```

## Memory Routing

Memory routing is useful in environments that are not a browser or when you do not want components to interact with the URL.

```ts
import { createMemoryHistory, createRouter } from '@tanstack/react-router'

const memoryHistory = createMemoryHistory({
  initialEntries: ['/'], // Pass your initial url
})

const router = createRouter({ routeTree, history: memoryHistory })
```

Refer to the [SSR Guide](./ssr.md#server-history) for usage on the server for server-side rendering.

## Recording history state

An addon is provided for recording the history state.

```ts
import { createBrowserHistory, createRouter } from '@tanstack/react-router'
import { wrapHistoryWithRecordAddon } from '@tanstack/record-history-addon'

const browserHistory = createBrowserHistory()

const router = createRouter({
  routeTree,
  history: wrapHistoryWithRecordAddon(browserHistory),
})
```

The history state can then be read through `getRecordedHistory` or `useRecordedHistory`.

```tsx
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useRecordedHistory } from "@tanstack/record-history-addon"

export const Route = createFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const recordedHistory = useRecordedHistory()
  const canGoBack = recordedHistory.cursor > 0

  return (
    <>
      {canGoBack ? (
        <button onClick={() => router.history.back()}>Go back</button>
      ) : null}

      <div>Content</div>
    </>
  )
}
```
