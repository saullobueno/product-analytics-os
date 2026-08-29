import { beforeEach, describe, expect, it } from 'vitest'
import { useThemeStore } from './themeStore'

beforeEach(() => {
  localStorage.clear()
  useThemeStore.setState({ mode: 'dark' })
})

describe('useThemeStore', () => {
  it('começa em dark por padrão', () => {
    expect(useThemeStore.getState().mode).toBe('dark')
  })

  it('toggle alterna entre dark e light', () => {
    useThemeStore.getState().toggle()
    expect(useThemeStore.getState().mode).toBe('light')
    useThemeStore.getState().toggle()
    expect(useThemeStore.getState().mode).toBe('dark')
  })

  it('setMode define o modo explicitamente', () => {
    useThemeStore.getState().setMode('light')
    expect(useThemeStore.getState().mode).toBe('light')
  })
})
