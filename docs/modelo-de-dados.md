# Rascunho do Modelo de Dados — PromptOps Academy

Estrutura das entidades e schema para a persistência local em JSON e `localStorage`.

---

## 1. Entidades Principais

### 1.1. Prompt

Representa o registro principal de um prompt.

- `id`: String (ex: `"OP-02"`)
- `title`: String (mínimo de 8 caracteres)
- `categoryId`: String
- `subcategoryId`: String
- `tags`: Array de Strings
- `problem`: String (problema que o prompt busca resolver)
- `objective`: String (objetivo do prompt)
- `responsible`: String / Autor
- `status`: String (`"rascunho"` | `"em_revisao"` | `"publicado"` | `"arquivado"`)
- `maturity`: String (`"experimental"` | `"em_validacao"` | `"validado"`)
- `currentVersionId`: String (ex: `"OP-02-v1"`)

### 1.2. Version (Versão)

Representa uma versão específica de um prompt.

- `id`: String (ex: `"OP-02-v1"`)
- `promptId`: String (ID do prompt pai)
- `number`: Number (número da versão)
- `text`: String (texto completo do prompt - mínimo de 80 caracteres)
- `context`: String (contexto necessário)
- `restrictions`: String (restrições)
- `format`: String (formato esperado da resposta)
- `qualityCriteria`: String (critérios de qualidade)
- `nextAction`: String (próxima ação)
- `author`: String (responsável pela alteração)
- `date`: String (data YYYY-MM-DD)
- `changeReason`: String (opcional; motivo da alteração)
- `editorialChanges`: Array de Objetos (alterações editoriais que não geram uma nova versão):
  - `date`: String (data da alteração)
  - `author`: String (responsável pela alteração)
  - `description`: String (descrição da alteração)
  - `before`: String (conteúdo antes da alteração)
  - `after`: String (conteúdo depois da alteração)

### 1.3. Test (Teste)

Representa a execução e avaliação de um teste em uma versão específica.

- `id`: String
- `promptId`: String
- `versionId`: String
- `textSnapshot`: String (cópia exata do texto do prompt utilizado no momento da execução)
- `input`: String (entrada utilizada)
- `expected`: String (resultado esperado)
- `obtained`: String (resultado obtido)
- `evaluation`: String (`"aprovado"` | `"ajustar"` | `"reprovado"`)
- `failure`: String (falha identificada, se houver)
- `adjustment`: String (ajuste recomendado)
- `responsible`: String
- `date`: String
- `nextTest`: String (próximo teste)

### 1.4. Relation (Relação)

Representa uma conexão entre dois prompts.

- `sourceId`: String (prompt de origem)
- `targetId`: String (prompt de destino)
- `type`: String (`"anterior"` | `"proximo"` | `"depende_de"` | `"alimenta"` | `"alternativa"` | `"revisao"` | `"relacionado"`)
- `description`: String

### 1.5. Pipeline (Fluxo)

Representa um fluxo sequencial de trabalho formado por prompts.

- `id`: String (ex: `"PL-001"`)
- `name`: String
- `objective`: String
- `steps`: Array de Objetos:
  - `promptId`: String
  - `input`: String
  - `expectedOutput`: String

### 1.6. Category (Categoria)

Representa as categorias de classificação dos prompts.

- `id`: String
- `name`: String
- `subcategories`: Array de Strings

**Categorias Obrigatórias:**

1. Operações e Processos
2. Conteúdo e Comunicação
3. Produto e Desenvolvimento
4. Dados e Análise
5. Segurança e Governança
6. Aprendizado e Pesquisa

---

## 2. Regras de Validação

1. **Título:** Deve possuir no mínimo 8 caracteres.
2. **Corpo do Prompt:** Deve possuir no mínimo 80 caracteres.
3. **Obrigatoriedade:** Campos obrigatórios não podem ser salvos vazios.
4. **Unicidade de IDs:** Todos os IDs devem ser estritamente únicos.
5. **Integridade de Subcategoria:** Uma subcategoria deve obrigatoriamente pertencer à categoria selecionada.
6. **Integridade de Testes:** Um teste deve estar vinculado a um prompt e a uma versão existentes.
7. **Integridade de Relações:** Uma relação não pode apontar para um prompt inexistente.
8. **Versionamento:** Alterações no conteúdo operacional capazes de alterar o comportamento, a interpretação, o formato ou a resposta esperada da IA devem gerar uma nova versão, preservando o histórico anterior.
9. **Alterações Editoriais:** Correções que não alterem o sentido do prompt não devem gerar uma nova versão, mas devem ser registradas em `editorialChanges`, contendo data, autor, descrição, conteúdo anterior e conteúdo posterior.
10. **Duplicidade:** A verificação de duplicidade exata considera o texto do prompt após `trim()`.

---

## 3. Estrutura do JSON Inicial

```json
{
  "schemaVersion": 1,
  "prompts": [],
  "versions": [],
  "tests": [],
  "relations": [],
  "pipelines": [],
  "categories": []
}
```