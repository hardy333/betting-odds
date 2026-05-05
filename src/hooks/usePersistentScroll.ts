import { useEffect, useMemo, useRef, type RefObject } from 'react'

import { storageKeys } from '@/constants/storage'
import { readJson, writeJson } from '@/utils/storage'

export const usePersistentScroll = (scrollRef: RefObject<HTMLElement | null>) => {
  const savedOffset = useMemo(() => readJson<number>(storageKeys.scrollOffset, 0), [])
  const restoredRef = useRef(false)
  const frameIdRef = useRef<number | null>(null)
  const pendingOffsetRef = useRef<number | null>(null)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const flushPendingOffset = () => {
      frameIdRef.current = null
      if (pendingOffsetRef.current == null) return
      writeJson(storageKeys.scrollOffset, pendingOffsetRef.current)
      pendingOffsetRef.current = null
    }

    const handleScroll = () => {
      pendingOffsetRef.current = element.scrollTop
      if (frameIdRef.current != null) return
      frameIdRef.current = window.requestAnimationFrame(flushPendingOffset)
    }

    element.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      element.removeEventListener('scroll', handleScroll)
      if (frameIdRef.current != null) {
        window.cancelAnimationFrame(frameIdRef.current)
        frameIdRef.current = null
      }
      if (pendingOffsetRef.current != null) {
        writeJson(storageKeys.scrollOffset, pendingOffsetRef.current)
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
