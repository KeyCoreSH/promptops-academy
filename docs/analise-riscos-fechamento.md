# PromptOps Academy — Análise Preventiva de Riscos com IA

**Projeto:** PromptOps Academy — KeyCore Tech Hub  
**Frente:** Jornada e Loop  
**Responsável pela análise:** Levi  
**Data:** 27/10/2026  
**Situação:** análise proposta para revisão da equipe

## 1. Decisão e meta

A decisão analisada é liberar a versão final navegável do PromptOps Academy somente após verificar a integração dos recursos críticos na aplicação publicada.

A meta é assegurar que cadastro, busca, filtros, navegação e persistência funcionem de ponta a ponta, com evidências reproduzíveis.

O objetivo é evitar que testes automatizados aprovados sejam interpretados como garantia de funcionamento integral quando ainda existem falhas de integração.

## 2. Pré-mortem por quatro perspectivas

**Cenário hipotético:** imagine que o projeto foi considerado pronto, mas apresentou falhas durante a demonstração final. O que poderia ter causado esse resultado?

### Perspectiva 1 — Usuário ou cliente

O usuário consegue navegar pelo catálogo, mas encontra dificuldades para cadastrar prompts ou percebe conteúdos duplicados. Isso reduz a confiança na aplicação.

**Risco principal:** cadastro inconsistente e experiência insatisfatória.

### Perspectiva 2 — Execução técnica

Os testes de funções isoladas passam, mas as interfaces entre arquivos JavaScript utilizam contratos de dados diferentes. A aplicação apresenta falhas quando o fluxo completo é executado.

**Risco principal:** erros de integração não detectados pelos testes automatizados.

### Perspectiva 3 — Recursos e equipe

Diversas PRs dependem de revisão, aprovação e integração. O acúmulo de pendências reduz o tempo disponível para retestes e registro de evidências.

**Risco principal:** atraso da entrega e validação insuficiente.

### Perspectiva 4 — Crítico externo

Um avaliador independente utiliza a versão publicada em outro dispositivo ou navegador e encontra comportamento diferente daquele observado nos testes locais.

**Risco principal:** divergência entre ambiente de desenvolvimento e versão demonstrável.

## 3. Radar de riscos priorizados

| ID | Risco | Prioridade | Primeiro sinal observável | Fonte e frequência | Responsável pelo acompanhamento | Ação |
|---|---|---|---|---|---|---|
| R01 | Cadastro aceitar títulos duplicados ou dados incompletos | Alta | Q07 falha ou dois cards aparecem com o mesmo título | Teste do formulário e Issue #30; a cada mudança no cadastro | Narah e Luan | Corrigir |
| R02 | Integração entre arquivos apresentar contratos incompatíveis | Alta | Testes isolados passam, mas Q06 falha no navegador | PRs e testes de integração; a cada commit relevante | Luan e Narah | Investigar e corrigir |
| R03 | PRs críticas acumularem sem revisão | Alta | Alterações prontas continuam fora da `main` | Aba Pull Requests; acompanhamento diário no fechamento | Coordenação e responsáveis pelas PRs | Reduzir exposição |
| R04 | Versão pública divergir da versão testada | Alta | Correção funciona localmente, mas falha no GitHub Pages | Deploy e Issue #31; após cada publicação | Levi e Luan | Pausar o aceite até o reteste |
| R05 | Problemas mobile passarem despercebidos | Média | Campos cortados, botões inacessíveis ou navegação inconsistente | QA de interface e Issue #23; após mudanças visuais | Carlos e Isaac | Corrigir |

As prioridades são estimativas qualitativas para apoiar a discussão. Não representam classificação formal já aprovada pela coordenação.

## 4. Evidências disponíveis

Os seguintes registros sustentam o diagnóstico técnico:

- **Issue #30:** integração e critérios de validação do cadastro. https://github.com/KeyCoreSH/promptops-academy/issues/30
- **PR #37:** correções em desenvolvimento na integração do formulário. https://github.com/KeyCoreSH/promptops-academy/pull/37
- **Issue #31:** smoke tests e evidências dos problemas encontrados. https://github.com/KeyCoreSH/promptops-academy/issues/31
- **PR #38:** correções de responsividade e navegação mobile integradas. https://github.com/KeyCoreSH/promptops-academy/pull/38
- **PR #39:** correções de cópia e acesso ao Laboratório integradas. https://github.com/KeyCoreSH/promptops-academy/pull/39

## 5. Plano de resposta e revisão

**Revisão proposta:** 28/10/2026, sujeita à confirmação da equipe.

Na revisão, deverão ser verificados:

1. Resultado do teste Q06 para cadastro válido.
2. Resultado do Q07 para títulos duplicados.
3. Bloqueio de campos obrigatórios e subcategoria.
4. Persistência após recarregamento da página.
5. Correspondência entre alterações aprovadas, `main` e versão pública.
6. Registro de aprovação ou reprovação dos critérios pendentes nas Issues #30, #31 e #23.

**Evidências esperadas:** links das PRs, resultados dos testes, capturas da versão pública e comentários de QA.

**Critério para reduzir a exposição aos riscos:** os fluxos críticos passam nos testes de integração e na versão publicada, sem bloqueios críticos conhecidos.

**Se algum teste crítico falhar:** manter o item pendente, documentar a falha e não declarar o aceite final.

## 6. Papel da inteligência artificial

A IA foi utilizada como apoio para estruturar o pré-mortem, sugerir riscos, organizar os primeiros sinais e propor respostas.

As observações sobre o código e as PRs foram fundamentadas em registros do GitHub. Os cenários de falha futuros são hipóteses preventivas.

**A IA não substitui testes em navegador, revisão técnica, aprovação de PRs ou decisão da coordenação.**

## 7. Conclusão

O principal aprendizado é que **código implementado não equivale necessariamente a funcionalidade validada**.

A melhor forma de reduzir o risco da entrega é combinar revisão de código, testes automatizados, testes reais de integração, evidências e governança das aprovações.

**Status final deste documento:** análise preparada; revisão da equipe e validação dos riscos ainda pendentes.
