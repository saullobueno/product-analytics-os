import { useRef, useState } from 'react'
import { getDataset } from '@/data'
import { answerQuestion } from './engine'
import type { AnalystAnswer } from './types'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  question?: string
  answer?: AnalystAnswer
}

export interface AiAnalystChat {
  messages: ChatMessage[]
  ask: (question: string) => void
}

export function useAiAnalystChat(): AiAnalystChat {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const idRef = useRef(0)

  function ask(question: string) {
    const trimmed = question.trim()
    if (!trimmed) return

    const dataset = getDataset()
    const answer = answerQuestion(dataset, trimmed)
    const userId = `msg-${idRef.current++}`
    const assistantId = `msg-${idRef.current++}`

    setMessages((prev) => [
      ...prev,
      { id: userId, role: 'user', question: trimmed },
      { id: assistantId, role: 'assistant', answer },
    ])
  }

  return { messages, ask }
}
