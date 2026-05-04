const canUseStorage = () => typeof window !== 'undefined' && !!window.localStorage

export const readJson = <T>(key: string, fallback: T): T => {
  if (!canUseStorage()) return fallback

  const raw = window.localStorage.getItem(key)
  if (!raw) return fallback

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export const writeJson = (key: string, value: unknown) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(key, JSON.stringify(value))
}
