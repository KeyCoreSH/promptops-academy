# Benchmark — Kauã

**Autoria/validação:** Carlos — responsável pela execução desta parte da atividade, conforme divisão de responsabilidades do projeto.

## Objetivo

Analisar três referências do ecossistema de IA para identificar
padrões aplicáveis ao PromptOps Academy, principalmente nas áreas
de gerenciamento de prompts, versionamento, Graph, pipelines e
navegação conectada.

## Referências analisadas

### 1. Langfuse

**Foco:** gerenciamento e versionamento de prompts.

**Observações:**
- gerenciamento centralizado de prompts;
- versionamento;
- labels;
- colaboração;
- acompanhamento da evolução dos prompts.

**Aplicação no PromptOps Academy:**
Adotar o conceito de manter prompts organizados e versionados,
registrando alterações e resultados de testes.

**Não será reproduzido:**
Observabilidade, infraestrutura, integrações externas e demais
recursos fora do escopo do MVP.

### 2. Langflow

**Foco:** Graph visual e workflows.

**Observações:**
- workflows representados visualmente;
- componentes conectados;
- fluxos compostos por etapas;
- conexão entre componentes;
- Prompt Templates.

**Aplicação no PromptOps Academy:**
Usar como referência para representar pipelines como sequências
de prompts conectados e para definir a navegação entre etapas.

**Não será reproduzido:**
Agentes, integrações externas, execução automática de modelos e
a complexidade do editor visual.

### 3. LangSmith

**Foco:** gerenciamento, organização e versionamento de prompts.

**Observações:**
- histórico de versões;
- comparação entre versões;
- tags;
- organização;
- Prompt Hub;
- colaboração.

**Aplicação no PromptOps Academy:**
Adotar o conceito de histórico e evolução dos prompts, mantendo
a relação entre versões e resultados dos testes.

**Não será reproduzido:**
Ambientes de produção, infraestrutura de LLM, APIs externas e
funcionalidades que não pertencem ao MVP.

## Síntese das decisões

| Referência | Conceito aproveitado | Aplicação |
|---|---|---|
| Langfuse | Gestão e versionamento | Histórico e evolução dos prompts |
| Langflow | Graph e workflows | Pipelines e relações entre prompts |
| LangSmith | Versionamento e organização | Histórico, versões e organização |

## Decisão final

O PromptOps Academy combinará os conceitos mais adequados das três
referências sem reproduzir sua complexidade.

O Graph será orientado principalmente pela lógica de fluxos do
Langflow, enquanto a organização e evolução dos prompts utilizarão
como referência os conceitos observados no Langfuse e no LangSmith.

A implementação permanecerá dentro do escopo definido para o MVP:
HTML5, CSS3, JavaScript puro, JSON local, localStorage e Git/GitHub.
# Fluxo do usuário

## Jornada principal

O usuário deve seguir a jornada:

Encontrar → Entender → Copiar e testar → Registrar → Continuar.

## Navegação pelos pipelines

### Pipeline 01 — Diagnóstico operacional

Relato
→ Gargalos
→ Priorização
→ Perguntas de validação
→ Plano
→ Revisão

Cada etapa deve permitir acessar o prompt correspondente.

### Pipeline 02 — Conteúdo educativo

Problema
→ Público
→ Briefing
→ Rascunho
→ Revisão de tom
→ Checklist

### Pipeline 03 — QA de produto

Relato de falha
→ Reprodução
→ Severidade
→ Caso de teste
→ Bug
→ Validação da correção

## Decisões do Graph

As relações entre prompts serão utilizadas para representar
a sequência e a dependência entre diferentes etapas do processo.

### Anterior
Indica o prompt que deve ser consultado antes do prompt atual.

### Próximo
Indica o próximo prompt da sequência principal.

### Depende de
Indica que o prompt atual necessita das informações ou resultado
de outro prompt.

### Alimenta
Indica que o resultado de um prompt será utilizado por outro.

### Alternativa
Indica outro prompt que pode ser utilizado como caminho alternativo.

### Revisão
Indica um prompt utilizado para revisar ou melhorar o resultado
de outro prompt.

### Relacionado
Indica uma relação temática entre prompts que não possuem
necessariamente uma dependência ou sequência direta.

## Navegação conectada

Ao visualizar um prompt pertencente a um pipeline,
o usuário deve conseguir identificar sua posição no fluxo
e acessar prompts relacionados.

As relações utilizadas serão:

- anterior;
- próximo;
- depende de;
- alimenta;
- alternativa;
- revisão;
- relacionado.
