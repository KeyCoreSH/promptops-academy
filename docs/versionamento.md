# Versionamento — Jornada e loop | Etapa 0 — Fundação

## Status

**Atividade:** Atividade Real 02 — PromptOps Academy
**Frente oficial:** Jornada e loop
**Responsável:** Levi
**Etapa:** 0 — Fundação
**Tipo:** Proposta técnica para validação
**Status:** Em revisão

Este documento descreve o fluxo de versionamento da frente de Jornada e loop. Ele não substitui o modelo de dados do projeto nem transforma propostas da Etapa 0 em regras já aprovadas.

**Referência canônica de dados:** `docs/modelo-de-dados.md`

Em caso de divergência, prevalece o schema canônico aprovado pela equipe.

---

## 1. Base confirmada da Atividade 02

O Guia de Produto e Execução estabelece o fluxo:

`Versão → Teste → Avaliação → Ajuste → Novo teste`

O teste precisa preservar informações suficientes para identificar a versão executada, entrada, esperado, obtido, avaliação, falha, ajuste, responsável, data e próximo teste.

O guia também exige preservação do histórico: um resultado antigo não pode parecer associado a uma versão diferente daquela efetivamente testada.

Os cenários Q09 e Q10 verificam, respectivamente:

- cópia exata de uma versão histórica;
- vínculo correto entre teste e versão após falha, nova versão e reteste.

---

## 2. Integração com o schema canônico

Este documento usa, sem redefinir, os campos relevantes de `docs/modelo-de-dados.md`:

- `Prompt.currentVersionId`;
- `Version.promptId`, `number`, `text`, `restrictions`, `createdAt`, `changeReason`, `editorialChanges`;
- `Test.promptId`, `versionId`, `textSnapshot`, `input`, `expected`, `obtained`, `evaluation`, `failure`, `adjustment`, `responsible`, `createdAt`, `nextTest`.

O schema atual define `evaluation` como:

`aprovado | ajustar | reprovado`

Também define que:

- testes devem apontar para `promptId` e `versionId` existentes;
- `currentVersionId` deve apontar para uma versão existente do mesmo prompt;
- números de versão não podem se repetir dentro do mesmo prompt;
- alterações operacionais capazes de mudar comportamento, interpretação, formato ou resposta esperada geram nova versão;
- correções editoriais que não mudam o sentido permanecem na versão e são registradas em `editorialChanges`.

Qualquer mudança futura nesses campos deve ser feita primeiro no schema canônico e depois refletida aqui.

---

## 3. Fluxo de versionamento

```text
RASCUNHO
   ↓
pronto para teste
   ↓
  v1
   ↓
 TESTE
   ↓
AVALIAÇÃO
   ↓
┌──────────────────────────────┐
│                              │
adequado                 falha/ajuste
│                              ↓
mantém versão          alteração necessária
                               ↓
                    muda comportamento?
                       ↙             ↘
                     NÃO             SIM
                      ↓               ↓
              ajuste editorial   nova versão
                      │               ↓
                      │            RETESTE
                      └──────→ HISTÓRICO
```

A passagem exata de rascunho para `v1` e o tratamento de situações não cobertas pelo schema permanecem como decisões da Etapa 0.

---

## 4. Regras de versionamento

### RV-01 — Primeira versão
**Proposta da frente:** o prompt permanece em rascunho enquanto está sendo preparado. Ao ficar pronto para o primeiro teste, passa a `v1`.

### RV-02 — Histórico preservado
**Alinhado ao guia e ao schema:** uma versão já testada não deve ter seu histórico silenciosamente substituído por uma alteração operacional posterior.

### RV-03 — Teste vinculado à versão
**Confirmado no schema:** cada teste identifica a versão realmente executada por `versionId`.

### RV-04 — Texto executado
**Confirmado no schema:** `textSnapshot` preserva o texto exato utilizado na execução do teste.

### RV-05 — Avaliação
**Confirmado no schema:** `evaluation` utiliza `aprovado`, `ajustar` ou `reprovado`. A avaliação deve seguir critérios definidos para o teste.

### RV-06 — Nova versão
**Confirmado no schema atual:** alteração operacional capaz de mudar comportamento, interpretação, formato ou resposta esperada gera nova versão.

### RV-07 — Alteração editorial
**Confirmado no schema atual:** correção que não altera o sentido não gera nova versão e é registrada em `editorialChanges`.

### RV-08 — Impacto incerto
**Proposta da frente:** se não for possível determinar com segurança se uma mudança altera o comportamento, priorizar nova versão para preservar a rastreabilidade.

### RV-09 — Versão atual
**Confirmado no schema:** `currentVersionId` identifica a versão atual e deve apontar para uma versão existente do mesmo prompt.

### RV-10 — Motivo da evolução
**Alinhado ao schema:** `failure` e `adjustment` registram a evidência que originou a mudança; `changeReason` pode complementar o histórico da nova versão.

### RV-11 — Reteste
**Alinhado ao guia:** uma nova versão precisa ser testada antes de ser apresentada como melhoria. Quando possível, reutilizar a mesma entrada e os mesmos critérios.

### RV-12 — Evidência de melhoria
**Alinhado ao guia:** a melhoria é demonstrada pela comparação das evidências de testes vinculados às respectivas versões, e não apenas pela existência de uma versão nova.

---

## 5. Exemplo mínimo

```text
OP-02
├── v1
│   └── T01 → reprovado
│       falha: criou métricas sem evidência
│       ajuste: restringir métricas não sustentadas pela entrada
│
└── v2
    └── T02 → aprovado
```

Nesse caso, T01 permanece ligado à v1 e T02 à v2. O `textSnapshot` preserva o texto executado em cada teste.

Uma correção exclusivamente editorial, como `"Analize"` → `"Analise"`, permanece na mesma versão e é registrada em `editorialChanges`, conforme o schema atual.

---

## 6. Integridade, privacidade e persistência

O versionamento deve seguir as validações de `docs/modelo-de-dados.md`.

Para esta frente, são essenciais:

- não criar referências para prompts ou versões inexistentes;
- preservar versões e testes históricos;
- validar o JSON recuperado antes de utilizá-lo;
- tratar falhas de leitura ou gravação sem informar sucesso indevido;
- não armazenar senhas, tokens, chaves de API ou outros segredos;
- evitar dados pessoais, confidenciais ou desnecessários em prompts, testes e resultados;
- aplicar às exportações as mesmas regras de privacidade do armazenamento local;
- tratar conteúdo de prompt como texto, sem renderização arbitrária de HTML.

O MVP utiliza JSON local e `localStorage`; esses mecanismos não devem ser tratados como armazenamento seguro para dados sensíveis.

---

## 7. QA e evidência

### Q09 — Versão histórica

**Cenário:** selecionar uma versão anterior e copiar.

**Esperado:** copiar exatamente o texto da versão exibida.

### Q10 — Nova versão após falha

**Cenário:** registrar falha, criar uma nova versão e repetir o teste.

**Esperado:** cada teste continuar vinculado à versão correta.

Cada execução deve registrar o esperado, o obtido, o status da execução, responsável, data e evidência. Um teste só pode ser marcado como executado depois da execução real.

---

## 8. Dependências e revisão

Esta especificação depende de:

- `docs/modelo-de-dados.md` — contrato canônico de dados;
- Dados e persistência — Danyelle;
- Governança e aceite — Isaac;
- Arquitetura e integração — Luan;
- aprovação da Etapa 0 — Rogério.

Alterações no contrato de dados não devem ser feitas unilateralmente pela frente de Jornada e loop.

---

## 9. Status para aprovação

### Confirmado / referenciado

- fluxo de loop da Atividade 02;
- vínculo teste ↔ versão;
- preservação do histórico;
- campos e validações definidos no schema canônico;
- Q09 e Q10;
- requisitos de integridade e proteção de dados.

### Propostas ainda dependentes de validação

- momento operacional exato de rascunho → `v1`;
- tratamento RV-08 para alterações de impacto incerto;
- detalhes de execução não definidos pelo guia ou pelo schema.

A validação final da Etapa 0 permanece com Rogério.
