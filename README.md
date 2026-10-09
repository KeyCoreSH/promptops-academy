# PromptOps Academy

Atividade Real 02 da KeyCore Tech Hub para transformar prompts dispersos em um catálogo operacional com contexto, resultados, iterações e relações entre etapas.

> Tecnologia que devolve tempo.

## Problema

Um prompt sem contexto, evidência, histórico de teste ou relação com a próxima etapa obriga a equipe a recomeçar decisões. Este projeto propõe um fluxo rastreável para encontrar, entender, testar, registrar e continuar.

## Objetivos de aprendizagem

- Engenharia de prompt;
- Engenharia de contexto;
- Loops de melhoria;
- Relações e pipelines entre prompts;
- Registro de resultados e evidências;
- Desenvolvimento web, qualidade e colaboração via Git.

## Fluxo do produto

**Encontrar → Entender → Copiar e testar → Registrar → Continuar**

## Exercício individual

O laboratório guiado organiza a construção de um prompt em cinco camadas:

1. Task — tarefa;
2. Goal — objetivo;
3. Audience — público;
4. Intended Use — uso pretendido;
5. Specific Sections or Details — detalhes específicos.

A fórmula é:

```text
Tarefa + Objetivo + Público + Uso + Detalhes = Prompt contextualizado
```

### CLEAR para prompts de liderança

Antes de encaminhar uma análise a uma liderança, revisar:

- **C — Complete:** respondeu tudo o que foi pedido?
- **L — Logical:** faz sentido do início ao fim?
- **E — Evidence:** está correto e baseado em evidências? Fontes precisam ser verificadas?
- **A — Audience:** está adequado para quem vai ler ou usar?
- **R — Relevant:** mantém o foco na tarefa?

O laboratório demonstra visualmente qual trecho do prompt atende a cada letra.

## Estrutura

```text
index.html                          Início e catálogo (único ponto de entrada)
prompt.html                         Detalhe do prompt (?id=...)
css/styles.css                      Estilos compartilhados
js/                                 Scripts (catalog.js, script.js, storage.js)
data/prompts.json                   Dados dos prompts; não publicar registros reais
public/laboratorio-de-prompts.html  Interface do laboratório individual
docs/                               Guia oficial, briefing e documentação técnica
```

## Como executar localmente

Os dados são carregados com `fetch`, então abrir o HTML direto no navegador (`file://`) não funciona. Rode um servidor local na raiz do projeto:

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000`. O laboratório fica em `http://localhost:8000/public/laboratorio-de-prompts.html`.

No VS Code, também funciona a extensão Live Server: clique com o botão direito em `index.html` e escolha "Open with Live Server".

## Regra de caminhos relativos

- Páginas na raiz (`index.html`, `prompt.html`) usam `./css/...`, `./js/...` e `./data/...`.
- Páginas em subpastas (`public/`) usam `../css/...`, `../js/...`, `../data/...` e voltam ao início com `../index.html`.
- Não criar cópias de `index.html`, `prompt.html` nem de CSS/JS compartilhados: toda tela nova reaproveita os arquivos existentes.

## Fluxo de navegação

Início → Catálogo → Detalhe do prompt (`prompt.html?id=...`) → Laboratório → Início.
## Privacidade e dados

O repositório é público. Não versionar registros individuais reais, credenciais, tokens, cookies ou dados sensíveis. O ambiente operacional autenticado mantém os registros dos estagiários fora deste repositório.

## Governança de branches

- `main` é protegida;
- contribuições devem seguir por Pull Request;
- somente **@rogerin** pode aprovar e liberar alterações para `main`.

## Documentação

- [Guia de produto e execução](docs/guia-produto-e-execucao.pdf)
- [Briefing da Atividade Real 02](docs/atividade-real-02-briefing.html)

## Licença

Material educacional e operacional da KeyCore Tech Hub. Uso conforme orientação da organização.
