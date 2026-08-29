import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RealtimePage } from './RealtimePage'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('RealtimePage', () => {
  it('renderiza o feed de eventos recentes', () => {
    render(<RealtimePage />)
    expect(
      screen.getByRole('heading', { name: /eventos em tempo real/i }),
    ).toBeInTheDocument()
  })

  it('atualiza o "há Xs" com o passar do tempo', () => {
    render(<RealtimePage />)
    vi.advanceTimersByTime(5000)
    expect(screen.getAllByText(/há \d+(s|min)/).length).toBeGreaterThan(0)
  })
})
