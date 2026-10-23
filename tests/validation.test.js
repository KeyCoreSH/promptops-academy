const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'js/validation.js'), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox);
const validatePromptOriginal = sandbox.window.PromptValidation.validatePrompt;
const validatePrompt = (...args) => JSON.parse(JSON.stringify(validatePromptOriginal(...args)));

const TITULO_7 = 'Relatos';
const TITULO_8 = 'Gargalos';
const PROMPT_79 = 'Você é analista de operações. Liste os gargalos do relato e cite cada evidência';
const PROMPT_80 = PROMPT_79 + '.';

const valido = (extra = {}) => ({
  title: TITULO_8,
  content: PROMPT_80,
  category: 'operacoes',
  ...extra
});

const camposComErro = (resultado) => resultado.errors.map((e) => e.field);

test('textos de apoio têm o tamanho esperado', () => {
  assert.equal(TITULO_7.length, 7);
  assert.equal(TITULO_8.length, 8);
  assert.equal(PROMPT_79.length, 79);
  assert.equal(PROMPT_80.length, 80);
});

test('Q06: título com 8 e prompt com 80 caracteres são aceitos', () => {
  const resultado = validatePrompt(valido());
  assert.equal(resultado.valid, true);
  assert.deepEqual(resultado.errors, []);
});

test('Q05: título com 7 caracteres é bloqueado com a mensagem do guia', () => {
  const resultado = validatePrompt(valido({ title: TITULO_7 }));
  assert.equal(resultado.valid, false);
  assert.deepEqual(camposComErro(resultado), ['title']);
  assert.equal(resultado.errors[0].message, 'O título precisa ter pelo menos 8 caracteres.');
});

test('Q05: prompt com 79 caracteres é bloqueado', () => {
  const resultado = validatePrompt(valido({ content: PROMPT_79 }));
  assert.equal(resultado.valid, false);
  assert.deepEqual(camposComErro(resultado), ['content']);
  assert.equal(resultado.errors[0].message, 'O texto do prompt precisa ter pelo menos 80 caracteres.');
});

test('Q05: título e prompt abaixo do mínimo geram os dois erros', () => {
  const resultado = validatePrompt(valido({ title: TITULO_7, content: PROMPT_79 }));
  assert.deepEqual(camposComErro(resultado).sort(), ['content', 'title']);
});

test('Q07: campos vazios são bloqueados e cada campo aparece no erro', () => {
  const resultado = validatePrompt({ title: '', content: '', category: '' });
  assert.equal(resultado.valid, false);
  assert.deepEqual(camposComErro(resultado).sort(), ['category', 'content', 'title']);
});

test('Q07: só espaços contam como vazio', () => {
  const resultado = validatePrompt({ title: '        ', content: ' '.repeat(100), category: '   ' });
  assert.equal(resultado.valid, false);
  assert.deepEqual(camposComErro(resultado).sort(), ['category', 'content', 'title']);
});

test('espaços nas pontas não contam para o mínimo de caracteres', () => {
  const resultado = validatePrompt(valido({ title: '  ' + TITULO_7 + '  ' }));
  assert.equal(resultado.valid, false);
  assert.deepEqual(camposComErro(resultado), ['title']);
});

test('o campo "prompt" também é aceito no lugar de "content"', () => {
  const resultado = validatePrompt({ title: TITULO_8, prompt: PROMPT_80, category: 'operacoes' });
  assert.equal(resultado.valid, true);
});

test('categoria é obrigatória', () => {
  const resultado = validatePrompt(valido({ category: '' }));
  assert.equal(resultado.valid, false);
  assert.deepEqual(camposComErro(resultado), ['category']);
});

test('dados que não são um objeto são rejeitados', () => {
  for (const entrada of [null, undefined, 'texto', 42]) {
    const resultado = validatePrompt(entrada);
    assert.equal(resultado.valid, false);
    assert.equal(resultado.errors[0].field, null);
  }
});

test('Q07: título repetido é bloqueado (comportamento atual: compara o título)', () => {
  const existentes = [{ id: 'OP-02', title: TITULO_8 }];
  const resultado = validatePrompt(valido(), existentes);
  assert.equal(resultado.valid, false);
  assert.deepEqual(camposComErro(resultado), ['title']);
  assert.equal(resultado.errors[0].message, 'Já existe um prompt cadastrado com este título.');
});

test('duplicidade ignora maiúsculas, acentos e espaços repetidos', () => {
  const existentes = [{ id: 'OP-01', title: 'Organizar relato operacional' }];
  const resultado = validatePrompt(
    valido({ title: '  ORGANIZAR   relato  operacional ' }),
    existentes
  );
  assert.equal(resultado.valid, false);
  assert.deepEqual(camposComErro(resultado), ['title']);

  const comAcento = validatePrompt(valido({ title: 'Análise geral' }), [{ id: 'X', title: 'analise geral' }]);
  assert.equal(comAcento.valid, false);
});

test('edição: o próprio registro não conta como duplicado (ignoreId)', () => {
  const existentes = [{ id: 'OP-02', title: TITULO_8 }];
  const resultado = validatePrompt(valido(), existentes, { ignoreId: 'OP-02' });
  assert.equal(resultado.valid, true);
});

test('edição: outro registro com o mesmo título continua sendo duplicado', () => {
  const existentes = [{ id: 'OP-02', title: TITULO_8 }, { id: 'OP-03', title: TITULO_8 }];
  const resultado = validatePrompt(valido(), existentes, { ignoreId: 'OP-02' });
  assert.equal(resultado.valid, false);
});

test('lista de existentes com itens inválidos não quebra a validação', () => {
  const resultado = validatePrompt(valido(), [null, undefined, 'x', 7, {}]);
  assert.equal(resultado.valid, true);
});

test('guia p. 9: duplicidade exata pelo texto do prompt (a decidir com o Rogério)', { todo: 'comparação hoje é pelo título' }, () => {
  const existentes = [{ id: 'OP-02', title: 'Outro título qualquer', content: PROMPT_80 }];
  const resultado = validatePrompt(valido({ title: TITULO_8 }), existentes);
  assert.equal(resultado.valid, false);
});

test('guia p. 9: subcategoria deve pertencer à categoria escolhida', { todo: 'validation.js não recebe subcategoria' }, () => {
  const resultado = validatePrompt(valido({ subcategory: 'inexistente' }));
  assert.equal(resultado.valid, false);
});

test('guia p. 9: mensagem de duplicidade do guia', { todo: 'mensagem atual fala em título' }, () => {
  const existentes = [{ id: 'OP-02', title: TITULO_8 }];
  const resultado = validatePrompt(valido(), existentes);
  assert.match(resultado.errors[0].message, /Já existe um prompt com este texto/);
});