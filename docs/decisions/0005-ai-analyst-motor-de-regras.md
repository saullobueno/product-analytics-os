# 0005 - AI Analyst como motor de regras, não LLM real

## Contexto

O diferencial do produto é o "AI Analyst": o usuário pergunta algo como
"Por que a conversão caiu esta semana?" e recebe uma resposta
estruturada (fator primário, evidências, confiança), como no exemplo
do enunciado do produto. A regra geral do projeto é preferir mock a
integração real com provedor pago, a menos que exista tier gratuito
sem cartão — não é o caso de nenhum provedor de LLM de qualidade
suficiente para isso.

## Decisão

- O "AI Analyst" é um **motor de regras determinístico**
  (`src/features/ai-analyst/engine.ts`), não uma chamada a um provedor
  de LLM. Isso é dito explicitamente na UI (`AiAnalystChat.tsx`) — não
  finge ser algo que não é.
- Reconhecimento de "intenção" (`matchMetric`) é casamento de palavras-
  chave (normalizado, sem acento) contra 4 métricas suportadas:
  conversão, churn, retenção, DAU. Pergunta não reconhecida tem uma
  resposta de fallback honesta, não uma alucinação.
- A análise em si **é real**, não texto fixo: para conversão, o motor
  (a) compara o período atual (7d) com o anterior, (b) descobre qual
  device teve a pior queda de conversão, (c) descobre qual etapa do
  funil teve o maior aumento de abandono _nesse device_, (d) procura um
  release do dataset cuja data caia na janela comparada. O resultado
  (`Android`, `Onboarding`, `Release 2.4.0`) é uma consequência da
  regressão real embutida em `generateFunnel.ts` (ADR 0003), não um
  valor hardcoded — os números mudam se o dataset mudar.
- **Confiança** (`computeConfidence`) é uma heurística explícita e
  documentada como tal no código: base 50, cresce com a magnitude da
  variação, +15 se um release se alinha na janela, +8 se a causa está
  concentrada num segmento em vez de espalhada. Não é uma probabilidade
  de modelo — é apresentada como "confidence" na UI porque é assim que
  o produto a nomeia, mas o código e os comentários deixam claro que é
  uma função determinística de sinais observáveis.
- Métricas sem quebra por device no dataset (DAU, churn, retenção) têm
  uma análise mais simples (valor atual vs. anterior + correlação com
  release), sem inventar uma causa raiz que os dados não sustentam —
  `primaryFactor` fica `null` quando não há evidência suficiente.

## Consequências

- Zero custo, zero chave de API, zero risco de resposta incoerente ou
  fora do domínio — trade-off aceito: o motor só responde ao que foi
  programado para reconhecer, sem a flexibilidade de linguagem natural
  livre de um LLM real.
- Testável de ponta a ponta sem mocks de rede: `engine.test.ts` verifica
  que a pergunta sobre conversão realmente aponta para Android/
  Onboarding/Release 2.4.0 — se a regressão do gerador de dados for
  removida ou alterada, o teste falha, então motor e dado narrativo não
  podem divergir silenciosamente.
- Se o projeto um dia trocar isso por um LLM real (ex.: para portfólio
  avançado), a camada `engine.ts` já expõe os números certos — o LLM
  entraria só na etapa de fraseamento, não teria que fazer a análise
  estatística sozinho (evita alucinação de números).
