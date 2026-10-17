# Especificação técnica — Pode Deixar (MVP)

Oct 17, 2026 · @Odair Cesar Ferreira

## Contexto e objetivo

Se a proposta for aprovada pelos sócios, o time desenvolve o MVP do Pode Deixar, uma assistente executiva de IA para pequenos negócios, operada pelo WhatsApp. Este documento descreve o que precisa ser construído, o que só precisa ser configurado e como cada entrega será aceita.

A assistente recebe instruções do dono em linguagem natural (texto ou áudio), executa tarefas administrativas e aprende o negócio com o uso. Tarefas-alvo: atendimento e agenda de clientes, pedidos a fornecedores, pagamentos dentro de limites e lembrança do histórico de cada cliente.

A estratégia técnica é reutilizar duas ferramentas open source — o [OpenClaw](https://docs.openclaw.ai) como agente executor e o [ai-memory](https://github.com/akitaonrails/ai-memory) como memória persistente — e concentrar o desenvolvimento na **Camada de Inteligência Pessoal**, que entende pessoas e decide quando agir. Valores entre colchetes ainda dependem de decisão dos sócios.

## Escopo do MVP

O MVP atende um único nicho de pequenos negócios, escolhido pelos sócios, com a assistente operando só pelo WhatsApp em texto e áudio.

| Item | No MVP | Observação |
| --- | --- | --- |
| Conversa com o dono pelo WhatsApp (texto) | Sim | Número dedicado por empresa |
| Mensagens de áudio do dono | Sim | Transcrição do áudio recebido |
| Atendimento a clientes da empresa pelo WhatsApp | Sim | Confirmar, marcar e remarcar horários |
| Agenda do dono e da equipe | Sim | Integração com um calendário \[Google ou Outlook\] |
| Pedidos a fornecedores por mensagem | Sim | Com confirmação do dono antes de enviar |
| Pagamentos | Sim, limitado | Só por meio de pagamento com limite; nunca o cartão direto |
| Onboarding conversacional | Sim | Primeira versão |
| Alertas contextuais | Sim | Primeira versão do motor de contexto |
| Ligação de voz em tempo real | Não | Fase posterior (telefonia) |
| Painel web para o dono | Não | Consulta da memória fica para depois |
| Vários nichos ao mesmo tempo | Não | Um nicho no piloto |
| Integração com sistemas de gestão (ERP) | Não | Sob demanda, após o piloto |

## Arquitetura

O WhatsApp é a única interface; o OpenClaw executa, a Camada de Inteligência Pessoal decide e o ai-memory guarda. Em destaque, o único componente com código próprio.

&#91;embedded content: arquitetura do MVP · 3 camadas e serviços externos\]

A Camada é um serviço independente registrado no OpenClaw como ferramenta (MCP ou plugin): ele a consulta antes de agir e informa o resultado depois. Assim, OpenClaw ou ai-memory podem ser trocados no futuro sem reescrever o produto.

## Componentes reutilizados (configuração, sem desenvolvimento)

OpenClaw e ai-memory entram como estão, com versões fixadas; o trabalho aqui é instalação, configuração e testes de integração.

| Componente | O que configurar | Observação |
| --- | --- | --- |
| OpenClaw | Instalação e execução contínua em segundo plano | Máquina local no protótipo; VPS na produção |
| OpenClaw | Canal WhatsApp em número dedicado, restrito aos números autorizados | Avaliar a API oficial do WhatsApp Business antes de clientes pagantes |
| OpenClaw | Workspace do agente com as instruções-base de comportamento | Arquivos de instrução do próprio OpenClaw |
| OpenClaw | Mensagens de áudio e integração de calendário | Skills e plugins existentes |
| OpenClaw | Registro da Camada de Inteligência Pessoal como ferramenta | Via MCP ou plugin |
| ai-memory | Servidor com diretório de dados próprio, um por empresa | A documentação exige um servidor por diretório de dados |
| ai-memory | Integração com o OpenClaw: MCP e hooks de ciclo de vida | Suporte oficial listado na [matriz de compatibilidade](https://github.com/akitaonrails/ai-memory/blob/main/docs/support-matrix.md) |
| ai-memory | Autenticação por token e TLS via proxy reverso | Obrigatório fora da máquina local |
| ai-memory | Regras de exclusão de captura | Impedir que dados sensíveis sejam gravados |
| ai-memory | Provedor de LLM e de embeddings | Opcional: melhora resumos e habilita busca semântica |

## O que precisa ser desenvolvido

Todo o desenvolvimento próprio fica na Camada de Inteligência Pessoal, um serviço independente que o OpenClaw consulta e que grava no ai-memory. São seis módulos e 20 requisitos; os IDs servem para rastrear tarefas e testes.

| ID | Módulo | Requisito |
| --- | --- | --- |
| RF-01 | Onboarding | Iniciar a integração pela conversa, a partir da primeira mensagem, sem formulário |
| RF-02 | Onboarding | Coletar na primeira semana: nível de autonomia, limites de gasto, horários e urgências |
| RF-03 | Onboarding | Escolher a próxima pergunta por utilidade, incerteza e momento, com no máximo \[N\] perguntas por dia |
| RF-04 | Onboarding | Nunca perguntar algo já registrado como declarado |
| RF-05 | Modelo de perfis | Representar dono, clientes, fornecedores e equipe como entidades com página própria no ai-memory |
| RF-06 | Modelo de perfis | Classificar cada registro como declarado, observado, hipótese ou regra de ação, com origem, data e confiança |
| RF-07 | Modelo de perfis | Permitir que o dono consulte e corrija pelo WhatsApp o que a assistente sabe |
| RF-08 | Modelo de perfis | Registrar mudança de preferência sem apagar o histórico |
| RF-09 | Motor de contexto | Antes de cada tarefa, identificar as pessoas envolvidas e recuperar suas páginas |
| RF-10 | Motor de contexto | Desambiguar nomes iguais e perguntar só quando houver dúvida real |
| RF-11 | Motor de contexto | Cruzar a tarefa com os registros e alertar somente quando houver conflito |
| RF-12 | Motor de contexto | Entregar ao OpenClaw um pacote de contexto enxuto por tarefa |
| RF-13 | Ciclo de aprendizado | Após cada tarefa, extrair aprendizados candidatos e classificá-los |
| RF-14 | Ciclo de aprendizado | Promover hipótese a regra só após \[N\] ocorrências e confirmação do dono |
| RF-15 | Ciclo de aprendizado | Definir quando uma conversa do WhatsApp vira registro consolidado: por tarefa, por dia ou por conversa |
| RF-16 | Permissões | Manter a política de autonomia separada da memória: o que a assistente faz sozinha e o que pede confirmação |
| RF-17 | Permissões | Aplicar limite por compra e limite diário; acima deles, confirmação obrigatória |
| RF-18 | Permissões | Registrar de forma auditável toda ação executada |
| RF-19 | Privacidade | Filtrar dados pessoais sensíveis antes da gravação, com regras próprias para o nicho escolhido |
| RF-20 | Privacidade | Excluir os dados de um cliente da empresa quando solicitado (LGPD) |

## Modelo de dados

Cada empresa é um projeto isolado no ai-memory, e cada pessoa vira uma página em markdown com registros tipados. O ai-memory foi pensado para projetos de código; este mapeamento é o que o adapta a pessoas e negócios.

| Conceito do produto | Onde fica no ai-memory | Observação |
| --- | --- | --- |
| Empresa | Projeto com diretório de dados próprio | Isolamento entre clientes do produto |
| Pessoa (dono, cliente, fornecedor, equipe) | Página de entidade em markdown | Uma página por pessoa |
| Registro sobre uma pessoa | Item na página, com metadados | Campos na tabela abaixo |
| Relação entre pessoas | Link ou relação tipada entre páginas | Ex.: cliente atendido por um profissional |
| Preferência que mudou | Relação do tipo “contradiz” + validade no tempo | O histórico não é apagado |
| Histórico de conversas | Captura por hooks, consolidada em páginas | Regra de consolidação no RF-15 |

Campos de cada registro:

| Campo | Valores | Para que serve |
| --- | --- | --- |
| tipo | declarado, observado, hipótese, regra | Separar fato de suposição |
| texto | Frase curta | O conteúdo do registro |
| origem | ID da mensagem ou da tarefa | Rastreabilidade e LGPD |
| data | Data e hora | Ordem e validade |
| confiança | baixa, média, alta | Decidir se age ou pergunta |
| status | ativo, substituído, descartado | Manter o histórico sem usá-lo |
| confirmado\_por | dono ou vazio | Regras só valem com confirmação |

Exemplo de página de pessoa (ilustrativo):

```markdown
# [Nome da cliente]
papel: cliente · desde: [data]

## Registros
- [declarado · alta] Alergia a [componente] — origem: msg [id], [data]
- [observado · média] Remarcou as 3 últimas visitas da manhã — origem: agenda, [data]
- [hipótese · baixa] Prefere horários à tarde — aguardando confirmação
- [regra · confirmada pelo dono] Oferecer a tarde primeiro

## Relações
- atendida por: [[Profissional X]]
```

## Fluxos principais

Toda tarefa passa por três verificações da Camada antes de o OpenClaw agir, e termina com o registro do que foi aprendido.

&#91;embedded content: execução de uma tarefa · 3 verificações da Camada\]

Em destaque, as etapas executadas pela Camada; as três verificações também rodam no motor de contexto (RF-09 a RF-12).

Onboarding na primeira semana:

1. Na primeira mensagem, a assistente se apresenta e pergunta como o dono prefere trabalhar.
2. Pergunta o nível de autonomia e os limites de gasto (RF-02).
3. Registra as respostas como declaradas, com confiança alta.
4. Nos dias seguintes, pergunta só o que uma tarefa real exigir (RF-03).

Consolidação do aprendizado após cada tarefa:

1. A Camada lista o que aprendeu na tarefa (RF-13).
2. Classifica cada item como declarado, observado ou hipótese.
3. Grava no ai-memory, na página de cada pessoa envolvida.
4. Quando uma hipótese se repete \[N\] vezes, pergunta ao dono se ela vira regra (RF-14).

## Segurança, privacidade e pagamentos

No MVP, toda ação com dinheiro ou que não possa ser desfeita exige confirmação do dono, e mensagens de clientes nunca disparam ações administrativas.

- **Isolamento por empresa:** uma instância do ai-memory por empresa; nenhuma consulta cruza dados de empresas diferentes.
- **Quem pode dar ordens:** só números autorizados (dono e equipe) acionam tarefas administrativas. Clientes da empresa acessam apenas o fluxo de atendimento.
- **Mensagens de terceiros são dados, não ordens:** texto vindo de clientes ou fornecedores não pode mudar permissões, pedir pagamentos ou expor dados de outras pessoas.
- **Pagamentos:** o cartão do dono nunca fica acessível à IA. Usar um meio de pagamento com limite por compra de \[R$ \_\_\] e limite diário de \[R$ \_\_\], com registro de cada transação. Provedor: \[a definir\].
- **Credenciais:** fora do código, em cofre de segredos; token de acesso no ai-memory e TLS fora da máquina local.
- **LGPD:** base legal e prazo de retenção definidos com o jurídico \[a definir\]; exclusão a pedido (RF-20); trilha de auditoria de toda gravação e ação.
- **Dados sensíveis:** se o nicho for saúde, dados clínicos ficam fora da memória até haver regra específica aprovada.

## Requisitos não funcionais e operação

As metas numéricas abaixo estão em aberto e devem ser fechadas pelo time antes do piloto.

| ID | Requisito | Meta |
| --- | --- | --- |
| RNF-01 | Tempo de resposta a uma mensagem simples do dono | \[\_\_ segundos\] |
| RNF-02 | Disponibilidade no piloto (máquina local) | Horário comercial do nicho |
| RNF-03 | Disponibilidade na produção (nuvem) | \[\_\_%\] |
| RNF-04 | Backup do diretório de dados do ai-memory | Diário, com teste de restauração |
| RNF-05 | Logs e monitoramento de falhas de envio e de tarefas | Alerta ao time em \[\_\_ minutos\] |
| RNF-06 | Versões de OpenClaw e ai-memory | Fixadas; atualização só após teste em homologação |
| RNF-07 | Custo de IA por empresa por mês | Medido no piloto; teto de \[R$ \_\_\] |
| RNF-08 | Reinício automático após queda ou reinicialização | Obrigatório |

## Plano de entregas e critérios de aceite

O trabalho começa com a aprovação dos sócios e passa por dois portões de qualidade; nenhuma fase começa sem o critério da anterior atendido.

&#91;embedded content: plano de entregas · 3 fases e 3 portões\]

Os prazos entre colchetes serão estimados pelo time depois da leitura deste documento.

| Fase | Entregas | Critério de aceite |
| --- | --- | --- |
| 1 · Protótipo | OpenClaw e ai-memory configurados; Camada com RF-01 a RF-20; fluxos da seção Fluxos principais | Todos os requisitos passam nos testes internos; custo de IA por empresa medido (RNF-07) |
| 2 · Piloto | \[3\] negócios de um nicho usando por \[\_\_\] semanas; ajustes a partir do uso real | \[**%\] das tarefas concluídas sem intervenção; menos de \[**\] perguntas por tarefa; pilotos querem continuar |
| 3 · Lançamento | Produção em nuvem; API oficial do WhatsApp Business; processo de implantação | RNF-01 a RNF-08 atendidos; novo cliente implantado em \[\_\_\] dias |

## Decisões pendentes e riscos

Quatro decisões travam o início da Fase 1; as demais podem ser fechadas durante o protótipo.

Antes da Fase 1:

- [ ] Nicho do piloto (sócios)
- [ ] Calendário a integrar: Google ou Outlook
- [ ] Integração do WhatsApp: conexão do OpenClaw no protótipo e API oficial do WhatsApp Business para clientes pagantes?
- [ ] Provedor de modelo de IA e orçamento mensal de testes

Durante o protótipo:

- [ ] Regra de consolidação das conversas (RF-15): por tarefa, por dia ou por conversa
- [ ] Provedor de pagamento com limites (cartão virtual ou conta de pagamento)
- [ ] Hospedagem de produção e região dos dados
- [ ] Base legal e retenção de dados com o jurídico

Riscos técnicos:

| Risco | Impacto | Mitigação |
| --- | --- | --- |
| Bloqueio do número por uso não oficial do WhatsApp | Assistente fica fora do ar | Número dedicado; API oficial em produção |
| Mudanças incompatíveis no OpenClaw ou no ai-memory | Integração quebra após atualização | Versões fixadas; testes antes de atualizar; camada própria desacoplada |
| Mensagem maliciosa de terceiro tentando dar ordens | Ação indevida ou vazamento | Separar ordens do dono de dados de terceiros; confirmação para ações sensíveis |
| Custo de IA acima do previsto | Margem negativa | Medição por empresa desde o protótipo (RNF-07) |
| Memória com dados incorretos | Ações erradas | Tipos de registro, confiança e correção pelo dono (RF-06, RF-07) |

## Fontes

- [ai-memory — README](https://github.com/akitaonrails/ai-memory)
- [ai-memory — matriz de compatibilidade](https://github.com/akitaonrails/ai-memory/blob/main/docs/support-matrix.md)
- [OpenClaw — documentação](https://docs.openclaw.ai)
