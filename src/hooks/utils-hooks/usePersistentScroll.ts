import { useEffect, useMemo, useRef, type RefObject } from 'react'

import { storageKeys } from '@/constants/storage'
import { readJson, writeJson } from '@/utils/storage'

const SCROLL_PERSIST_THROTTLE_MS = 300

export const usePersistentScroll = (scrollRef: RefObject<HTMLElement | null>) => {
  const savedOffset = useMemo(() => readJson<number>(storageKeys.scrollOffset, 0), [])
  const restoredRef = useRef(false)
  const flushTimeoutIdRef = useRef<number | null>(null)
  const pendingOffsetRef = useRef<number | null>(null)
  const lastPersistedOffsetRef = useRef<number | null>(null)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const flushPendingOffset = () => {
      flushTimeoutIdRef.current = null
      if (pendingOffsetRef.current == null) return
      if (pendingOffsetRef.current === lastPersistedOffsetRef.current) return

      writeJson(storageKeys.scrollOffset, pendingOffsetRef.current)
      lastPersistedOffsetRef.current = pendingOffsetRef.current
      pendingOffsetRef.current = null
    }

    const handleScroll = () => {
      pendingOffsetRef.current = element.scrollTop
      if (flushTimeoutIdRef.current != null) return
      flushTimeoutIdRef.current = window.setTimeout(flushPendingOffset, SCROLL_PERSIST_THROTTLE_MS)
    }

    element.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      element.removeEventListener('scroll', handleScroll)
      if (flushTimeoutIdRef.current != null) {
        window.clearTimeout(flushTimeoutIdRef.current)
        flushTimeoutIdRef.current = null
      }
      if (pendingOffsetRef.current != null) {
        if (pendingOffsetRef.current !== lastPersistedOffsetRef.current) {
          writeJson(storageKeys.scrollOffset, pendingOffsetRef.current)
          lastPersistedOffsetRef.current = pendingOffsetRef.current
        }
        pendingOffsetRef.current = null
      }
    }
  }, [scrollRef])

  useEffect(() => {
    if (restoredRef.current) return
    const frameId = window.requestAnimationFrame(() => {
      if (!scrollRef.current) return
      scrollRef.current.scrollTop = savedOffset
      restoredRef.current = true
    })
    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [savedOffset, scrollRef])

  return null
}
