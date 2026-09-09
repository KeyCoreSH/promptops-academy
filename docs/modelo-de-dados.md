# Modelo de Dados - Promptops Academy

Estrutura das entidades para a persistência local em JSON e localStorage.

## Entidades

### 1. Prompt
- `id`: String (ex: "OP-02")
- `title`: String
- `categoryId`: String
- `subcategoryId`: String
- `tags`: Array de Strings
- `author`: String
- `status`: String ("rascunho" | "em_revisao" | "publicado" | "arquivado")
- `maturity`: String ("experimental" | "em_validacao" | "validado")
- `currentVersionId`: String (ex: "OP-02-v2")

### 2. Versão
- `id`: String (ex: "OP-02-v1")
- `promptId`: String
- `number`: Number
- `text`: String
- `role`: String
- `objective`: String
- `context`: String
- `constraints`: String
- `format`: String
- `qualityCriteria`: String
- `nextAction`: String
- `createdAt`: String

### 3. Teste
- `id`: String (ex: "T-001")
- `promptId`: String
- `versionId`: String
- `input`: String
- `expected`: String
- `obtained`: String
- `evaluation`: String ("aprovado" | "ajustar" | "reprovado")
- `failureReason`: String
- `recommendedAdjustment`: String
- `author`: String
- `date`: String

### 4. Relação
- `originId`: String
- `targetId`: String
- `type`: String ("anterior" | "proximo" | "depende_de" | "alimenta" | "alternativa" | "revisao" | "relacionado")
- `description`: String
EOF