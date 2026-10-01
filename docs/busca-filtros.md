# Busca e filtros — Jornada e loop | Etapa 0 — Fundação
## Status
**Atividade:** Atividade Real 02 — PromptOps Academy  
**Frente oficial:** Jornada e loop  
**Responsável:** Levi  
**Etapa:** 0 — Fundação  
**Tipo:** Especificação de comportamento para validação  
**Status:** Em revisão

Este documento define o comportamento de busca e filtros da frente de Jornada e loop. Ele não redefine o modelo de dados nem transforma propostas da frente em decisões aprovadas.
**Referência canônica:** `docs/modelo-de-dados.md`
Em caso de divergência, prevalece o schema canônico aprovado pela equipe.

---
## 1. Objetivo
Permitir que o usuário encontre o prompt adequado sem conhecer previamente seu ID ou navegar manualmente por todo o catálogo.
A funcionalidade deve permitir:
- pesquisa textual;
- aplicação de filtros;
- combinação entre busca e filtros;
- retorno claro sobre os resultados;
- tratamento de busca sem resultado;
- navegação previsível entre catálogo e detalhe.

---
## 2. Base confirmada da Atividade 02
Busca e filtros fazem parte dos requisitos de aceite do produto.
O guia define pesquisa em:
- título;
- objetivo;
- tags.
Também define filtros por:
- categoria;
- subcategoria;
- status;
- maturidade.
Filtros diferentes devem funcionar com lógica **E**, exibindo apenas registros compatíveis.
O guia também orienta:
- filtros ativos visíveis;
- quantidade de resultados;
- ação para limpar filtros;
- estado vazio quando nenhum registro for encontrado.
A Etapa 1 — Catálogo integra dados, cards, busca, filtros e detalhe, com participação de Danyelle, Carlos e Levi.

---
## 3. Integração com o schema canônico
Esta especificação usa os campos definidos em `docs/modelo-de-dados.md`:
- `title`;
- `objective`;
- `tags`;
- `categoryId`;
- `subcategoryId`;
- `status`;
- `maturity`.
Valores atuais de `status`:
`rascunho | em_revisao | publicado | arquivado`
Valores atuais de `maturity`:
`experimental | em_validacao | validado`
A relação entre categoria e subcategoria deve respeitar a regra de integridade do schema: a subcategoria precisa pertencer à categoria indicada.
Esta frente não deve criar nomes de campos ou valores alternativos sem alinhamento com o modelo de dados.

---
## 4. Fluxo principal
```text
ABRIR CATÁLOGO
      ↓
digitar busca e/ou selecionar filtros
      ↓
aplicar critérios
      ↓
filtrar registros
      ↓
┌─────────────────────────────┐
│                             │
há resultados          zero resultados
│                             │
exibir compatíveis     mostrar estado vazio
│                             │
mostrar quantidade     permitir ajuste/limpeza
│
abrir detalhe
      ↓
retornar ao catálogo
```
Busca e filtros podem ser usados em conjunto. O catálogo também deve poder ser consultado sem todos os filtros ativos.

---
## 5. Regras de comportamento
### BF-01 — Campos pesquisáveis
**Confirmado pelo guia.**
A busca textual deve pesquisar em `title`, `objective` e `tags`. Um registro pode ser encontrado quando o termo corresponder a qualquer um desses campos.

### BF-02 — Filtros disponíveis
**Confirmado pelo guia.**
Os filtros são `categoryId`, `subcategoryId`, `status` e `maturity`.
**Proposta da frente:** todos são opcionais para permitir navegação livre pelo catálogo.

### BF-03 — Combinação dos critérios
**Confirmado pelo guia.**
Busca e filtros ativos devem funcionar por interseção. Exemplo:
```text
Busca: gargalo
Categoria: Operações e Processos
Status: publicado
```
O resultado deve atender à busca **E** à categoria **E** ao status.

### BF-04 — Nenhum resultado
**Alinhado ao guia e ao Q04.**
Quando nenhum registro corresponder:
- não mostrar resultado incompatível;
- apresentar estado vazio claro;
- orientar ajuste da busca ou filtros;
- disponibilizar ação para limpar filtros.
**Proposta da frente:** manter os critérios visíveis para explicar o motivo do resultado vazio.

### BF-05 — Limpar filtros
**Alinhado ao guia.**
A interface deve permitir limpar os filtros ativos e recalcular imediatamente o catálogo.
**Proposta da frente:** `Limpar filtros` remove apenas filtros estruturados e preserva o texto da busca.

### BF-06 — Retorno do detalhe
**Proposta de experiência apresentada pelo guia; depende de validação.**
Ao abrir um prompt e retornar ao catálogo, propõe-se preservar o texto pesquisado e os filtros ativos para evitar reconstrução da consulta.

### BF-07 — Quantidade de resultados
**Orientação do guia.**
A interface deve informar e atualizar a quantidade de registros encontrados sempre que a busca ou os filtros mudarem.

### BF-08 — Campos ausentes
**Proposta da frente para robustez.**
Campo textual vazio ou ausente não deve quebrar a busca. Ele apenas não produz correspondência. Se faltar o valor exigido por um filtro ativo, o registro não corresponde ao filtro.

### BF-09 — Maiúsculas e minúsculas
**Proposta da frente para validação.**
A busca deve ser `case-insensitive`: `GARGALO`, `Gargalo` e `gargalo` devem produzir o mesmo comportamento.

### BF-10 — Acentos e correspondência parcial
**Proposta da frente para validação.**
A busca deve ignorar diferenças de acentuação e aceitar correspondência textual parcial. Exemplo: `analise` pode encontrar `Análise exploratória`.
O MVP usa busca textual; busca semântica, embeddings ou IA ficam fora desta especificação.

### BF-11 — Dependência entre filtros
A combinação de filtros diferentes com lógica **E** é requisito do guia. Categoria e subcategoria devem respeitar o schema.
**Propostas da frente:**
- um valor por tipo de filtro no MVP;
- ao trocar categoria, limpar subcategoria incompatível;
- nunca permitir combinação categoria/subcategoria inválida.

### BF-12 — QA
A matriz do guia inclui Q02, Q03 e Q04:
- **Q02:** buscar por título, objetivo e tag; esperado: encontrar registros em cada campo pesquisável.
- **Q03:** combinar busca e dois ou mais filtros; esperado: exibir a interseção de todos os critérios.
- **Q04:** buscar algo inexistente e limpar filtros; esperado: estado vazio orientativo e retorno do catálogo após a limpeza.
**Testes complementares propostos:**
- preservação da busca/filtros ao voltar do detalhe;
- maiúsculas/minúsculas;
- acentos;
- correspondência parcial;
- campos ausentes;
- dependência categoria/subcategoria.
Nenhum teste deve ser declarado como executado antes da execução real.

---
## 6. Exemplo mínimo
```text
Busca: atendimento
Categoria: Operações e Processos
Status: publicado
Maturidade: em_validacao
```
O sistema deve localizar `atendimento` em `title`, `objective` ou `tags` e depois manter apenas os registros compatíveis com todos os filtros ativos.
Um registro que corresponda ao texto, mas não ao status, não deve aparecer.
A quantidade exibida deve representar exatamente o conjunto final.

---
## 7. Integridade e limites
A funcionalidade deve respeitar `docs/modelo-de-dados.md`, especialmente:
- `categoryId` deve apontar para categoria existente;
- `subcategoryId` deve apontar para subcategoria existente;
- a subcategoria deve pertencer à categoria indicada;
- `status` e `maturity` devem usar valores válidos;
- pesquisar e filtrar não devem alterar registros persistidos;
- pesquisar e filtrar não devem modificar versões, testes ou histórico.
Esta documentação define comportamento de consulta, não persistência nem novas entidades.

---
## 8. Critérios de aceite
A especificação estará pronta para implementação quando houver alinhamento sobre:
- campos pesquisáveis;
- filtros;
- combinação entre critérios;
- estado vazio;
- limpeza de filtros;
- preservação de estado ao retornar do detalhe;
- normalização textual;
- dependência categoria/subcategoria;
- cenários de QA.
A implementação deve permitir demonstrar:
```text
termo + dois filtros ativos
        ↓
somente registros compatíveis
```
com resultado conferível.

---
## 9. Dependências
Esta funcionalidade se relaciona com:
- `docs/modelo-de-dados.md` — contrato canônico;
- Dados e persistência — Danyelle;
- Interface e QA visual — Carlos;
- Arquitetura e integração — Luan;
- Governança e aceite — quando aplicável.
Alterações no contrato de dados devem ser alinhadas antes da implementação.

---
## 10. Status para aprovação
### Confirmado pelo documento/schema
- busca por título, objetivo e tags;
- filtros por categoria, subcategoria, status e maturidade;
- combinação de filtros;
- interseção entre busca e filtros;
- busca e filtros como requisito de aceite;
- campos canônicos da consulta;
- integridade categoria/subcategoria.

### Orientações existentes no guia
- filtros ativos visíveis;
- quantidade de resultados;
- estado vazio orientativo;
- ação `Limpar filtros`;
- proposta de preservar consulta ao retornar do detalhe;
- cenários Q02, Q03 e Q04.

### Propostas da frente de Jornada e loop
- filtros opcionais para navegação livre;
- `Limpar filtros` preservar o texto da busca;
- manter critérios visíveis no estado vazio;
- busca sem diferenciar maiúsculas/minúsculas;
- normalização de acentos;
- correspondência textual parcial;
- tratamento de campos ausentes;
- um valor por tipo de filtro no MVP;
- limpar subcategoria incompatível ao trocar categoria;
- testes complementares do BF-12.

Essas propostas não devem ser tratadas como decisão oficial antes da validação correspondente.
A aprovação da Etapa 0 permanece com Rogério.
