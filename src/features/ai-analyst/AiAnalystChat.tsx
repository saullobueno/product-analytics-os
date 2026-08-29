import { Send } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Card } from '@/components/Card'
import { InsightCard } from './InsightCard'
import { SUGGESTED_QUESTIONS } from './suggestedQuestions'
import { useAiAnalystChat } from './useAiAnalystChat'

export function AiAnalystChat() {
  const { messages, ask } = useAiAnalystChat()
  const [draft, setDraft] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    ask(draft)
    setDraft('')
  }

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-ink">AI Analyst</h1>
        <p className="text-sm text-ink-secondary">
          Pergunte sobre variações nas métricas do produto. As respostas vêm de
          um motor de regras que analisa o dataset sintético — não há um modelo
          de linguagem real por trás (ver README).
        </p>
      </div>

      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => ask(question)}
              className="rounded-full border border-border px-3 py-1.5 text-sm text-ink-secondary hover:bg-surface hover:text-ink"
            >
              {question}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {messages.map((message) => {
          if (message.role === 'user') {
            return (
              <div
                key={message.id}
                className="self-end rounded-2xl bg-series-1 px-4 py-2 text-sm text-white"
              >
                {message.question}
              </div>
            )
          }

          if (message.answer?.recognized === false) {
            return (
              <Card key={message.id} className="text-sm text-ink-secondary">
                Não entendi essa pergunta ainda. Tente perguntar sobre
                conversão, churn, retenção ou DAU — por exemplo: “
                {SUGGESTED_QUESTIONS[0]}”
              </Card>
            )
          }

          if (message.answer?.recognized === true) {
            return <InsightCard key={message.id} report={message.answer} />
          }

          return null
        })}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor="ai-analyst-input" className="sr-only">
          Pergunta para o AI Analyst
        </label>
        <input
          id="ai-analyst-input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Por que a conversão caiu esta semana?"
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:ring-2 focus:ring-series-1 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Enviar pergunta"
          className="flex items-center justify-center rounded-lg bg-series-1 px-3 py-2 text-white"
        >
          <Send aria-hidden="true" size={16} />
        </button>
      </form>
    </div>
  )
}
