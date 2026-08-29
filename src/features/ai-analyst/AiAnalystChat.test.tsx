import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AiAnalystChat } from './AiAnalystChat'
import { SUGGESTED_QUESTIONS } from './suggestedQuestions'

describe('AiAnalystChat', () => {
  it('mostra as perguntas sugeridas antes da primeira interação', () => {
    render(<AiAnalystChat />)
    expect(
      screen.getByRole('button', { name: SUGGESTED_QUESTIONS[0] }),
    ).toBeInTheDocument()
  })

  it('clicar numa pergunta sugerida mostra a pergunta e um InsightCard de resposta', async () => {
    const user = userEvent.setup()
    render(<AiAnalystChat />)

    await user.click(
      screen.getByRole('button', { name: SUGGESTED_QUESTIONS[0] }),
    )

    expect(screen.getByText(SUGGESTED_QUESTIONS[0])).toBeInTheDocument()
    expect(screen.getByText(/conversion decreased/i)).toBeInTheDocument()
    expect(screen.getByText(/confidence:/i)).toBeInTheDocument()
  })

  it('digitar e enviar uma pergunta não reconhecida mostra a mensagem de fallback', async () => {
    const user = userEvent.setup()
    render(<AiAnalystChat />)

    const input = screen.getByLabelText(/pergunta para o ai analyst/i)
    await user.type(input, 'qual é a cor do céu?')
    await user.click(screen.getByRole('button', { name: /enviar pergunta/i }))

    expect(
      screen.getByText(/não entendi essa pergunta ainda/i),
    ).toBeInTheDocument()
  })
})
