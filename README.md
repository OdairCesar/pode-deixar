# Pode Deixar

Assistente executiva de IA para pequenos negócios, operada pelo WhatsApp.

A assistente recebe instruções do dono em linguagem natural (texto ou áudio), executa tarefas administrativas e aprende o negócio com o uso. Tarefas-alvo: atendimento e agenda de clientes, pedidos a fornecedores, pagamentos dentro de limites e histórico de cada cliente.

## Estratégia técnica

Reutilizar duas ferramentas open source e concentrar o desenvolvimento próprio na **Camada de Inteligência Pessoal**:

- **[OpenClaw](https://docs.openclaw.ai)** — agente executor.
- **[ai-memory](https://github.com/akitaonrails/ai-memory)** — memória persistente.
- **Camada de Inteligência Pessoal** (a desenvolver) — entende pessoas e decide quando agir; registrada no OpenClaw como ferramenta (MCP ou plugin).

## Documentação

O [index.html](index.html) na raiz reúne a apresentação e a especificação numa página só, pronta para o GitHub Pages (Settings → Pages → Deploy from a branch → branch `main`, pasta `/ (root)`).

- [Especificação técnica (MVP)](docs/especificacao-tecnica-mvp.md) — escopo, arquitetura, requisitos (RF-01 a RF-20), modelo de dados, segurança e plano de entregas.
- [Proposta](docs/proposta.pdf) ([pptx](docs/proposta.pptx) / [html](docs/proposta.html))

## Status

Projeto em fase de protótipo — ainda sem código. Próximos passos e decisões pendentes estão descritos na seção "Decisões pendentes e riscos" da especificação técnica.
