import { useSyncExternalStore } from 'react'
import { useRouter } from '@tanstack/react-router'
import type { HistoryLocation, RouterHistory } from '@tanstack/history'

export type RecordedHistoryState = {
  cursor: number
  locations: Array<HistoryLocation>
}

const SESSION_STORAGE_KEY = 'TanstackRouterRecordHistory.state'
export function wrapHistoryWithRecordAddon<
  TRouterHistory extends RouterHistory,
>(history: TRouterHistory) {
  const historyState = sessionStorage.getItem('SESSION_STORAGE_KEY')
  const recordedState: RecordedHistoryState = historyState
    ? JSON.parse(historyState)
    : {
        cursor: 0,
        locations: [history.location],
      }
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(recordedState))

  history.subscribe(({ action, location }) => {
    if (action.type === 'PUSH') {
      recordedState.locations = [
        ...recordedState.locations.slice(0, recordedState.cursor + 1),
        location,
      ]
      recordedState.cursor += 1
    } else if (action.type === 'REPLACE') {
      const newLocations = recordedState.locations.slice(
        0,
        recordedState.cursor,
      )
      newLocations.splice(recordedState.locations.length - 1, 1, location)
      recordedState.locations = newLocations
    } else if (action.type === 'POP') {
      const oldLocationIndex = recordedState.locations.findIndex(
        (oldLocation) => oldLocation.state.key === location.state.key,
      )
      recordedState.cursor = oldLocationIndex
    }

    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(recordedState))
  })
  ;(history as any).__IS_WRAPPED_WITH_RECORD_ADDON = true
  return history
}

export function getRecordedHistory() {
  const stateString = sessionStorage.getItem(SESSION_STORAGE_KEY)

  if (!stateString)
    throw new Error(
      'useRecordedHistory must be used with a history wrapped by wrapHistoryWithRecordAddon',
    )

  const parsedState: RecordedHistoryState = JSON.parse(stateString)
  return parsedState
}

export function useRecordedHistory() {
  const router = useRouter()
  const history: RouterHistory = router.history

  const stateString = useSyncExternalStore(
    (onStoreChange) => history.subscribe(onStoreChange),
    () => sessionStorage.getItem(SESSION_STORAGE_KEY),
  )

  if (!stateString)
    throw new Error(
      'useRecordedHistory must be used with a history wrapped by wrapHistoryWithRecordAddon',
    )

  const parsedState: RecordedHistoryState = JSON.parse(stateString)
  return parsedState
}
