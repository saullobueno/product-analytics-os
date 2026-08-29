import { useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'

/** Espelha o tema do store no atributo `data-theme` do `<html>` (ver src/index.css). */
export function useThemeSync(): void {
  const mode = useThemeStore((state) => state.mode)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])
}
