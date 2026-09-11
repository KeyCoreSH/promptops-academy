# MICROCOPY, MENSAGENS DE ERRO E AJUDA

## PromptOps Academy

**Responsável:** Narah

---

## 1. Tom e Voz

Acerca do tom de voz, deve ser claro, direto e principalmente humano, termos mais técnicos ou desconhecidos devem ser evitados, isso contribui para a praticidade no uso da ferramenta, ajudando a diminuir possíveis dúvidas.

As informações devem ser objetivas e devem indicar de maneira discreta, porém, facilitada sobre o que fazer a seguir da ação que está em execução pelo usuário, isso serve para todas as telas do sistema.

Evitar jargões extremamente exagerados com promessas de perfeição ou coisas do tipo.

---

## 2. Nomenclatura Padronizada

Os termos a seguir devem ser preservados para uma facilidade sobre cada função a ser implementada.

### 2.1. Categorias obrigatórias

* **Operações e Processos**
  * Diagnóstico Operacional
  * Planejamento e Melhoria

* **Conteúdo e Comunicação**
  * Estratégia Editorial
  * Produção e Revisão

* **Produto e Desenvolvimento**
  * Registro de Defeitos
  * Validação e Testes

* **Dados e Análise**
  * Qualidade de Dados
  * Análise Exploratória

* **Segurança e Governança**
  * Privacidade
  * Confiabilidade da Informação

* **Aprendizado e Pesquisa**
  * Pesquisa Orientada
  * Estudo Aplicado

### 2.2. Status de Registro e Maturidade (Nomes Oficiais)

* **Status:** Rascunho / Em revisão / Publicado / Arquivado
* **Maturidade:** Experimental / Em validação / Validado

### 2.3. Avaliação do Teste

* Aprovado
* Ajustar
* Reprovado

### 2.4. Botões

* Buscar
* Filtrar
* Limpar Filtros
* Novo Prompt
* Salvar
* Excluir
* Copiar
* Colar
* Registrar Teste
* Seguir no Pipeline
* Etapa Anterior
* Próxima Etapa
* Exportar Dados (JSON)
* Importar Dados

---

## 3. Microcopy e Mensagem de Erro por Tela

### 3.1. Tela de Início e Catálogo

* **Título:** PromptOps Academy - Sistema de Gestão de prompts
* **Descrição de Apoio:** Organize contextos, registrar testes, transforme boas interações com IA em processos reutilizáveis.
* **Busca (Botão):** Buscar por título, objetivo ou tags
* **Painel de Contadores:** Prompts cadastrados, pipelines ativos, testes realizados, loops comprovados.

---

### 3.2. Cadastro e Edição de Prompts

#### 3.2.1. Funções e Schema Canônico

* **Campo:** Título do Prompt
  * **Rótulo:** Título
  * **Ajuda:** Nome claro e objetivo para identificar a instrução. Mínimo de 8 caracteres.

* **Campo:** Categoria e Subcategoria
  * **Rótulo:** Categoria / Subcategoria
  * **Ajuda:** Selecione a área principal e a subcategoria correspondente ao problema.

* **Campo:** Tags
  * **Rótulo:** Tags
  * **Ajuda:** Insira termos de busca separados por vírgula. Exemplo: atendimento, gargalo, checklist.

* **Campo:** Responsável
  * **Rótulo:** Responsável
  * **Ajuda:** Nome do integrante da equipe responsável pelo registro ou manutenção.

* **Campo:** Status e Maturidade
  * **Rótulo:** Status / Maturidade
  * **Ajuda:** Indique a fase de publicação (`Rascunho`, `Em revisão`, `Publicado`, `Arquivado`) e a maturidade (`Experimental`, `Em validação`, `Validado`).

* **Campo:** Texto do Prompt
  * **Rótulo:** Instrução (Prompt)
  * **Ajuda:** Escreva ou cole a instrução completa. Mínimo de 80 caracteres. Mantenha os marcadores de entrada visíveis.

* **Campo:** Objetivo
  * **Rótulo:** Objetivo Concreto
  * **Ajuda:** Qual transformação ou entrega prática a IA deve produzir.

* **Campo:** Contexto e Limites
  * **Rótulo:** Contexto
  * **Ajuda:** Informe para quem, em qual cenário e com quais entradas/fontes fornecidas.

* **Campo:** Restrições
  * **Rótulo:** Restrições
  * **Ajuda:** Indique expressamente o que a IA não pode inventar, assumir, expor ou executar.

* **Campo:** Formato de Saída
  * **Rótulo:** Formato
  * **Ajuda:** Como a resposta deve ser organizada. Exemplo: tabela, lista numerada, resumo de 3 frases.

* **Campo:** Critérios de Qualidade
  * **Rótulo:** Critérios
  * **Ajuda:** Detalhe os pontos que tornam o resultado aceitável ou reprovado.

* **Campo:** Próxima Ação
  * **Rótulo:** Próxima Ação
  * **Ajuda:** Indique o uso do resultado e qual etapa do pipeline vem a seguir.

#### 3.2.2. Mensagens de Erro por Campo

* **Título com menos de 8 caracteres:** "O título precisa ter pelo menos 8 caracteres."
* **Título em branco:** "Informe um título para identificar este prompt."
* **Prompt com menos de 80 caracteres:** "O texto do prompt precisa ter pelo menos 80 caracteres."
* **Prompt em branco:** "O campo de instrução do prompt é obrigatório e precisa ser preenchido."
* **Duplicidade exata de prompt:** "Já existe um prompt com este texto. Abra o registro existente para revisar ou criar uma nova versão."
* **Categoria ou Subcategoria não selecionada:** "Selecione uma categoria e subcategoria válidas para classificar o prompt."
* **Status Inválido ou Divergente:** "Selecione um status válido (`Rascunho`, `Em revisão`, `Publicado`, `Arquivado`)."
* **Campos obrigatórios pendentes:** "Preencha todos os campos obrigatórios antes de salvar o registro."
* **Falha de identificação por meio de busca:** "Nenhum prompt combina com esta busca. Ajuste o termo ou limpe os filtros."

---

### 3.3. Detalhe do Prompt, Versões e Registro de Teste

* **Aviso sobre Cópia:** "O botão Copiar disponibiliza o texto exato da versão selecionada abaixo."

* **Registro de Teste (Loops):**

  * **Versão:**
    * **Rótulo:** Versão
    * **Ajuda:** Indique a versão do prompt que está sendo testada.

  * **Entrada Utilizada:**
    * **Rótulo:** Entrada
    * **Ajuda:** Cole o relato ou texto fictício utilizado na execução da ferramenta.

  * **Resultado Esperado:**
    * **Rótulo:** Resultado Esperado
    * **Ajuda:** Descreva o resultado esperado conforme os critérios do schema.

  * **Resultado Obtido:**
    * **Rótulo:** Resultado da IA
    * **Ajuda:** Cole a resposta literal gerada pela IA durante o teste.

  * **Avaliação:**
    * **Rótulo:** Avaliação do Teste
    * **Ajuda:** Escolha `Aprovado`, `Ajustar` ou `Reprovado` com base nos critérios de qualidade.

  * **Falha e Ajuste:**
    * **Rótulo:** Falha / Ajuste Recomendado
    * **Ajuda:** Descreva o motivo da reprovação ou o que precisa mudar na instrução para a próxima versão.

  * **Próximo Teste:**
    * **Rótulo:** Próximo Teste
    * **Ajuda:** Indique os passos ou condições para a realização do próximo teste.

* **Mensagem de Confirmação:** "Resultado do teste registrado com sucesso no histórico da versão."

---

### 3.4. Pipelines e Navegação de Fluxo

* **Instrução de Navegação:** "A saída produzida nesta etapa serve como entrada para a etapa seguinte do pipeline."

* **Navegação entre Etapas:**
  * "Avançar para a próxima etapa"
  * "Retornar à etapa anterior"
  * "Ver prompts relacionados"

---

### 3.5. Modais e Ações Destrutivas (Confirmação Explícita)

* **Excluir Prompt:**
  * **Título Modal:** "Excluir Prompt"
  * **Texto de Consequência:** "Tem certeza de que deseja excluir o prompt '**[Nome do Prompt]**'? Esta ação é permanente e apagarás todo o histórico de versões, testes e métricas vinculadas a este registro no seu dispositivo."
  * **Botão Primário (Ação Destrutiva):** "Excluir Definitivamente"
  * **Botão Secundário:** "Cancelar"

* **Preservação de Histórico de Versões / Testes:**
  * **Aviso de Sistema:** "O historico de versões e testes vinculados é preservado para manter a integridade do rastreamento. As alterações devem ser feitas gerando novas versões do prompt."

* **Limpar Todos os Dados / Reset:**
  * **Título Modal:** "Limpar Armazenamento Local"
  * **Texto de Consequência:** "Você está prestes a apagar todos os prompts, testes e pipelines salvos no seu navegador. Certifique-se de ter feito uma cópia de segurança (exportação JSON) antes da exclusão."
  * **Botão Primário:** "Apagar Tudo"
  * **Botão Secundário:** "Cancelar"

---

### 3.6. Estados de Interface (UX States)

#### 3.6.1. Estados Vazios (Empty States)

* **Catálogo Sem Registros (Geral):** "Nenhum prompt cadastrado ainda. Clique em 'Novo Prompt' para registrar sua primeira instrução."
* **Busca Sem Resultados no Catálogo:** "Nenhum prompt combina com esta busca. Ajuste o termo ou limpe os filtros."
* **Histórico de Testes Vazio:** "Nenhum teste foi realizado para esta versão ainda. Copie a instrução, execute em uma ferramenta autorizada e registre o resultado."
* **Pipelines Sem Etapas:** "Este pipeline ainda não possui etapas configuradas. Adicione prompts relacionados para formar o fluxo."

#### 3.6.2. Estados de Carregamento (Loading States)

* **Carregando Dados Gerais:** "Carregando seus prompts..."
* **Processando Busca:** "Buscando no catálogo..."
* **Exportando/Importando:** "Processando arquivo de dados, aguarde um momento..."

#### 3.6.3. Indisponibilidade de Dados e Falhas de Processamento

* **ID ou Link Quebrado:** "O prompt solicitado não foi encontrado ou foi removido. Clique abaixo para retornar ao catálogo."
* **Erro ao Ler Dados:** "Não foi possível carregar os dados salvos. Atualize a página ou tente novamente em instantes."
* **Arquivo Importado Inválido:** "O arquivo selecionado não possui a estrutura compatível com o schema canônico. Verifique a formatação do arquivo JSON."

---

### 3.7. Persistência de Dados e Armazenamento Local (localStorage)

* **Aviso de Armazenamento Local (Banner/Tooltip Persistente):** "Seus dados estão armazenados localmente neste navegador. Para não perder seu trabalho ao limpar o histórico do navegador, exporte seus registros regularmente em JSON."
* **Aviso de Sucesso ao Salvar:** "Prompt salvo neste navegador."
* **Aviso de Sucesso ao Copiar:** "Texto da versão selecionada copiado para a área de transferência!"
* **Sucesso na Exportação:** "Arquivo de backup gerado com sucesso! Guarde este JSON em um local seguro."
* **Sucesso na Importação:** "Dados importados com sucesso! Seu catálogo foi atualizado."
* **Erro de Armazenamento Local (localStorage Cheio/Bloqueado):** "Não foi possível salvar no armazenamento local do seu navegador. Copie seu texto para um arquivo externo para não perder o trabalho e faça uma limpeza nos registros antigos."
