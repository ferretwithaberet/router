import * as React from 'react'
import {
  Link,
  Outlet,
  createRootRoute,
  useRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useRecordedHistory } from '@tanstack/record-history-addon'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    )
  },
})

function RootComponent() {
  const router = useRouter()
  const recordedHistory = useRecordedHistory()
  const canBack = recordedHistory.cursor > 0
  const canForward =
    recordedHistory.cursor < recordedHistory.locations.length - 1

  console.log('REC', recordedHistory)

  return (
    <>
      <div className="flex gap-2 p-2 text-lg border-b">
        <button
          style={{
            color: canBack ? 'blue' : 'grey',
          }}
          disabled={!canBack}
          onClick={() => router.history.go(-2)}
        >
          &lt;&lt;
        </button>{' '}
        <button
          style={{
            color: canBack ? 'blue' : 'grey',
          }}
          disabled={!canBack}
          onClick={() => router.history.back()}
        >
          &lt;
        </button>{' '}
        <button
          style={{
            color: canForward ? 'blue' : 'grey',
          }}
          disabled={!canForward}
          onClick={() => router.history.forward()}
        >
          &gt;
        </button>{' '}
        <button
          style={{
            color: canForward ? 'blue' : 'grey',
          }}
          disabled={!canForward}
          onClick={() => router.history.go(2)}
        >
          &gt;&gt;
        </button>{' '}
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{' '}
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}
          replace
        >
          Home replace
        </Link>{' '}
        <Link
          to="/posts"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Posts
        </Link>{' '}
        <Link
          to="/layout-a"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Layout
        </Link>{' '}
        <Link
          to="/anchor"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Anchor
        </Link>{' '}
        <Link
          // @ts-expect-error
          to="/this-route-does-not-exist"
          activeProps={{
            className: 'font-bold',
          }}
        >
          This Route Does Not Exist
        </Link>
      </div>
      <hr />
      <Outlet />
      {/* Start rendering router matches */}
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
