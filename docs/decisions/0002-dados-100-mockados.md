# 0002 - Dados 100% mockados, sem backend real

## Contexto

Regra geral do projeto: por ser peça de portfólio, deve evitar
infraestrutura própria e dados de usuários reais, preferindo sempre a
versão simulada de qualquer integração externa, a menos que exista tier
gratuito real sem cartão de crédito. As features do produto (event
explorer, funis, retenção, cohorts, segmentação, jornada, adoção de
features, eventos em tempo real, anomalias) não exigem multiusuário ou
persistência entre dispositivos para serem demonstradas — exigem, sim,
um dataset que pareça real (tendências, sazonalidade, quedas
explicáveis) para o AI Analyst ter evidências plausíveis para citar.

## Decisão

- Todo o dataset (eventos, DAU, sessões, funis, retenção, cohorts) é
  gerado inteiramente no cliente por um motor de dados sintéticos
  determinístico, com PRNG (pseudo-random number generator) com seed
  fixa — mesmo seed sempre produz o mesmo dataset, entre reloads e em
  testes.
- Não existe backend/API real. Nenhuma chamada de rede para dados de
  produto.
- "Saved reports" e configuração de dashboards customizáveis (posição
  dos widgets) persistem em `localStorage` do navegador.
- O motor de dados deve embutir eventos "narrativos" deliberados (ex.:
  uma queda de conversão mobile correlacionada com um release
  específico) para que o AI Analyst (ver ADR do motor de insight, fase 4) tenha uma causa raiz real para encontrar nos dados, não apenas
  ruído aleatório.

## Consequências

- Custo de infraestrutura zero; comportamento 100% reproduzível, o que
  também facilita testes determinísticos.
- Sem multiusuário real, sem persistência entre dispositivos/navegadores
  — aceitável para portfólio, mas deve ficar explícito no README que
  isso é uma simplificação deliberada, não uma limitação técnica.
- O gerador de dados sintéticos é, na prática, uma peça de lógica de
  domínio não trivial (precisa parecer um produto real) e deve ser
  testado como tal.
