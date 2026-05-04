import { useEffect, useMemo, useRef, type RefObject } from 'react'

import { storageKeys } from '@/constants/storage'
import { readJson, writeJson } from '@/utils/storage'

export const usePersistentScroll = (scrollRef: RefObject<HTMLElement | null>) => {
  const savedOffset = useMemo(() => readJson<number>(storageKeys.scrollOffset, 0), [])
  const restoredRef = useRef(false)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const handleScroll = () => writeJson(storageKeys.scrollOffset, element.scrollTop)
    element.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      element.removeEventListener('scroll', handleScroll)
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
