import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from './authStore'

beforeEach(() => {
  localStorage.clear()
  useAuthStore.setState({ isAuthenticated: false })
})

describe('useAuthStore', () => {
  it('começa deslogado por padrão', () => {
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  it('login autentica', () => {
    useAuthStore.getState().login()
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
  })

  it('logout desautentica', () => {
    useAuthStore.getState().login()
    useAuthStore.getState().logout()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })
})
