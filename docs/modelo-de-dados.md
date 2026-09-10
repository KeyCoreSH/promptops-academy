# Modelo de Dados — PromptOps Academy

Estrutura das entidades e schema para a persistência local em JSON e `localStorage`.

Este documento define o schema canônico de dados utilizado pelo projeto. A versão apresentada nesta documentação deve ser considerada a referência para a implementação e persistência dos dados da aplicação.

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
- `number`: Number (número inteiro positivo da versão)
- `text`: String (texto completo do prompt - mínimo de 80 caracteres)
- `context`: String (contexto necessário)
- `restrictions`: String (restrições)
- `format`: String (formato esperado da resposta)
- `qualityCriteria`: String (critérios de qualidade)
- `nextAction`: String (próxima ação)
- `author`: String (responsável pela alteração)
- `createdAt`: String (data de criação no formato YYYY-MM-DD)
- `changeReason`: String (opcional; motivo da alteração)
- `editorialChanges`: Array de Objetos (alterações editoriais que não geram uma nova versão):

  - `createdAt`: String (data da alteração)
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
- `createdAt`: String (data do teste)
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

## 2. Regras de Validação e Integridade

1. **Título:** Deve possuir no mínimo 8 caracteres.

2. **Corpo do Prompt:** O campo `text` deve possuir no mínimo 80 caracteres.

3. **Obrigatoriedade:** Campos obrigatórios não podem ser salvos vazios ou ausentes.

4. **Unicidade de IDs:** Todos os IDs devem ser únicos dentro do conjunto de entidades correspondente e não podem ser vazios.

5. **Formato de IDs:** Os IDs devem seguir um padrão consistente com a entidade e não podem conter valores nulos ou inválidos.

6. **Integridade de Subcategoria:** Uma subcategoria deve obrigatoriamente pertencer à categoria indicada em `categoryId`.

7. **Integridade de Testes:** Um teste deve estar vinculado a um `promptId` e a um `versionId` existentes.

8. **Integridade de Versões:** Cada versão deve possuir um `promptId` correspondente a um prompt existente.

9. **Unicidade de Versão:** O campo `number` deve ser um número inteiro positivo e não pode se repetir dentro do mesmo prompt.

10. **Integridade de Referência da Versão Atual:** O `currentVersionId` de um prompt deve corresponder a uma versão existente cujo `promptId` seja o mesmo do prompt.

11. **Integridade de Relações:** Uma relação não pode apontar para um prompt inexistente. Os valores de `sourceId` e `targetId` devem corresponder a IDs de prompts existentes.

12. **Integridade de Pipelines:** Cada `promptId` utilizado em `steps` deve corresponder a um prompt existente.

13. **Versionamento:** Alterações no conteúdo operacional capazes de alterar o comportamento, a interpretação, o formato ou a resposta esperada da IA devem gerar uma nova versão, preservando o histórico anterior.

14. **Alterações Editoriais:** Correções que não alterem o sentido do prompt não devem gerar uma nova versão, mas devem ser registradas em `editorialChanges`, contendo data, autor, descrição, conteúdo anterior e conteúdo posterior.

15. **Referências Existentes:** Nenhum campo de referência (`categoryId`, `subcategoryId`, `promptId`, `versionId`, `currentVersionId`, `sourceId` ou `targetId`) deve apontar para um registro inexistente.

16. **Duplicidade:** A verificação de duplicidade exata considera o texto do prompt após a aplicação de `trim()`.

17. **Consistência de Schema:** Os registros persistidos devem seguir os campos, tipos e valores definidos neste documento. Campos não previstos no schema não devem ser considerados obrigatórios para a persistência.

---

## 3. Privacidade e Dados Sensíveis

1. **Minimização de dados:** O JSON e o `localStorage` devem armazenar somente os dados necessários para o funcionamento da aplicação.

2. **Dados sensíveis:** Não devem ser armazenadas no JSON ou `localStorage` informações pessoais sensíveis ou desnecessárias para a finalidade do sistema.

3. **Credenciais:** Senhas, tokens de autenticação, chaves de API, credenciais de acesso e outros segredos não devem ser armazenados no `localStorage` nem incluídos em arquivos JSON exportados.

4. **Dados pessoais:** Documentos de identificação, informações financeiras, dados de contato pessoais ou outras informações pessoais que não sejam necessárias para o funcionamento do sistema não devem ser armazenados.

5. **Conteúdo dos prompts e testes:** Antes de armazenar ou exportar prompts, testes e seus respectivos resultados, deve-se evitar a inclusão de informações pessoais, confidenciais ou dados pertencentes a terceiros.

6. **Exportações:** Os arquivos JSON exportados devem respeitar as mesmas regras de privacidade aplicadas aos dados armazenados localmente. A exportação não deve incluir credenciais, tokens ou dados pessoais sensíveis.

7. **Dados necessários:** Quando um dado pessoal for indispensável para determinada funcionalidade, deve ser armazenado somente na extensão necessária para essa finalidade.

8. **Persistência local:** O uso de `localStorage` deve ser limitado a dados apropriados para armazenamento no dispositivo do usuário, evitando informações que exigiriam mecanismos de proteção mais robustos.

---

## 4. Estrutura do JSON Inicial

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