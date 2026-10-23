const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const original = fs.readFileSync(path.join(root, 'js/catalog.js'), 'utf8');
const marcador = '"use strict";';
assert.ok(original.includes(marcador), 'js/catalog.js deveria conter "use strict";');

const fonteParaTeste = original.replace(
  marcador,
  marcador +
    ' global.__catalogTest = { filtrarPrompts, limparFiltros, normalizarTexto, limparMarkdown };'
);

const sandbox = {
  document: {
    addEventListener() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    getElementById() { return null; },
  },
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fonteParaTeste, sandbox);

const api = sandbox.__catalogTest;
assert.ok(api && typeof api.filtrarPrompts === 'function', 'as funções do catálogo não foram carregadas');

const filtrar = (lista, criterios) => Array.from(api.filtrarPrompts(lista, criterios));
const ids = (lista) => lista.map((p) => p.id);
const limpar = (criterios) => JSON.parse(JSON.stringify(api.limparFiltros(criterios)));

const catalogo = [
  {
    id: 'A-01',
    title: 'Organizar relato operacional',
    objective: 'Processo, atores e lacunas.',
    problem: 'Necessidade de organizar o relato.',
    tags: ['operacoes', 'relatorio'],
    categoryId: 'operacoes',
    subcategoryId: 'diagnostico',
    status: 'publicado',
    maturity: 'validado'
  },
  {
    id: 'A-02',
    title: 'Identificar gargalos com evidência',
    objective: 'Gargalos ligados a trechos do relato.',
    problem: 'Falta de clareza sobre onde o trabalho trava.',
    tags: ['operacoes', 'gargalo'],
    categoryId: 'operacoes',
    subcategoryId: 'diagnostico',
    status: 'publicado',
    maturity: 'em_validacao'
  },
  {
    id: 'B-01',
    title: 'Recortar uma dor para conteúdo',
    objective: 'Problema concreto e mensagem central.',
    problem: 'Temas amplos demais.',
    tags: ['conteudo', 'checklist'],
    categoryId: 'conteudo',
    subcategoryId: 'estrategia',
    status: 'rascunho',
    maturity: 'experimental'
  },
  {
    id: 'C-01',
    title: '[Guia de QA](https://exemplo.com) para **bugs**',
    objective: 'Registrar falhas.',
    problem: 'Relatos informais.',
    tags: ['qa'],
    categoryId: 'produto',
    subcategoryId: 'defeitos',
    status: 'em_revisao',
    maturity: 'experimental'
  }
];

test('normalizarTexto remove acentos, maiúsculas e espaços nas pontas', () => {
  assert.equal(api.normalizarTexto('  ÁÉÍÓÚ Ç  '), 'aeiou c');
});

test('normalizarTexto devolve vazio para valores que não são texto', () => {
  for (const valor of [null, undefined, 42, {}, []]) {
    assert.equal(api.normalizarTexto(valor), '');
  }
});

test('limparMarkdown troca links pelo texto e remove marcas', () => {
  assert.equal(api.limparMarkdown('[Texto](https://exemplo.com)'), 'Texto');
  assert.equal(api.limparMarkdown('**negrito** `código` #titulo'), 'negrito código titulo');
});

test('Q02: busca por título', () => {
  assert.deepEqual(ids(filtrar(catalogo, { busca: 'gargalos' })), ['A-02']);
});

test('Q02: busca ignora maiúsculas, minúsculas e acentos', () => {
  assert.deepEqual(ids(filtrar(catalogo, { busca: 'evidencia' })), ['A-02']);
  assert.deepEqual(ids(filtrar(catalogo, { busca: 'EVIDÊNCIA' })), ['A-02']);
});

test('Q02: busca por objetivo', () => {
  assert.deepEqual(ids(filtrar(catalogo, { busca: 'trechos' })), ['A-02']);
});

test('Q02: busca por problema (o código também procura nesse campo)', () => {
  assert.deepEqual(ids(filtrar(catalogo, { busca: 'necessidade' })), ['A-01']);
});

test('Q02: busca por tag', () => {
  assert.deepEqual(ids(filtrar(catalogo, { busca: 'checklist' })), ['B-01']);
  assert.deepEqual(ids(filtrar(catalogo, { busca: 'GARGALO' })), ['A-02']);
});

test('Q02: espaços antes e depois do termo são ignorados', () => {
  assert.deepEqual(ids(filtrar(catalogo, { busca: '   gargalos   ' })), ['A-02']);
});

test('Q02: Markdown no título não atrapalha a busca', () => {
  assert.deepEqual(ids(filtrar(catalogo, { busca: 'guia de qa' })), ['C-01']);
  assert.deepEqual(ids(filtrar(catalogo, { busca: 'bugs' })), ['C-01']);
  assert.deepEqual(ids(filtrar(catalogo, { busca: 'exemplo.com' })), []);
});

test('busca encontra mais de um registro e mantém a ordem original', () => {
  assert.deepEqual(ids(filtrar(catalogo, { busca: 'relato' })), ['A-01', 'A-02', 'C-01']);
});

test('Q04: termo inexistente devolve lista vazia', () => {
  assert.deepEqual(filtrar(catalogo, { busca: 'xyzxyz' }), []);
});

test('busca vazia ou só com espaços devolve todo o catálogo', () => {
  assert.equal(filtrar(catalogo, { busca: '' }).length, 4);
  assert.equal(filtrar(catalogo, { busca: '     ' }).length, 4);
  assert.equal(filtrar(catalogo, {}).length, 4);
});

test('comportamento atual: a busca não procura em categoria nem subcategoria', () => {
  assert.deepEqual(filtrar(catalogo, { busca: 'diagnostico' }), []);
});

test('Q03: filtro por categoria', () => {
  assert.deepEqual(ids(filtrar(catalogo, { categoryId: 'operacoes' })), ['A-01', 'A-02']);
});

test('Q03: filtro por subcategoria', () => {
  assert.deepEqual(ids(filtrar(catalogo, { subcategoryId: 'estrategia' })), ['B-01']);
});

test('Q03: filtro por status', () => {
  assert.deepEqual(ids(filtrar(catalogo, { status: 'publicado' })), ['A-01', 'A-02']);
});

test('Q03: filtro por maturidade', () => {
  assert.deepEqual(ids(filtrar(catalogo, { maturity: 'experimental' })), ['B-01', 'C-01']);
});

test('Q03: filtros diferentes se combinam com "E"', () => {
  const resultado = filtrar(catalogo, { categoryId: 'operacoes', maturity: 'em_validacao' });
  assert.deepEqual(ids(resultado), ['A-02']);
});

test('Q03: busca e filtros combinados mostram só a interseção', () => {
  const resultado = filtrar(catalogo, {
    busca: 'organizar',
    categoryId: 'operacoes',
    status: 'publicado'
  });
  assert.deepEqual(ids(resultado), ['A-01']);
});

test('Q03: combinação sem resultado devolve lista vazia', () => {
  const resultado = filtrar(catalogo, { categoryId: 'conteudo', status: 'publicado' });
  assert.deepEqual(resultado, []);
});

test('Q03: busca que acha registros, mas filtro que os exclui, devolve vazio', () => {
  const resultado = filtrar(catalogo, { busca: 'gargalos', categoryId: 'conteudo' });
  assert.deepEqual(resultado, []);
});

test('filtro vazio, nulo ou só com espaços não filtra nada', () => {
  const resultado = filtrar(catalogo, { categoryId: '', status: null, maturity: undefined, subcategoryId: '   ' });
  assert.equal(resultado.length, 4);
});

test('filtro com valor que não existe devolve lista vazia', () => {
  assert.deepEqual(filtrar(catalogo, { status: 'inexistente' }), []);
});

test('filtrar não altera a lista original', () => {
  const antes = JSON.stringify(catalogo);
  filtrar(catalogo, { busca: 'gargalos', status: 'publicado' });
  assert.equal(JSON.stringify(catalogo), antes);
  assert.equal(catalogo.length, 4);
});

test('limparFiltros remove os filtros e mantém só a busca', () => {
  const limpos = limpar({ busca: 'gargalos', categoryId: 'operacoes', status: 'publicado' });
  assert.deepEqual(limpos, { busca: 'gargalos' });
});

test('limparFiltros sem busca devolve um objeto vazio', () => {
  assert.deepEqual(limpar({ categoryId: 'operacoes', maturity: 'validado' }), {});
});

test('limparFiltros aceita entradas inválidas', () => {
  for (const entrada of [null, undefined, 'texto', 42]) {
    assert.deepEqual(limpar(entrada), {});
  }
});

test('depois de limpar filtros e a busca, o catálogo volta completo', () => {
  const criterios = limpar({ busca: '', categoryId: 'operacoes', status: 'publicado' });
  assert.equal(filtrar(catalogo, criterios).length, 4);
});

test('lista que não é array devolve lista vazia', () => {
  for (const entrada of [null, undefined, {}, 'texto', 42]) {
    assert.deepEqual(filtrar(entrada, { busca: 'x' }), []);
  }
});

test('critérios inválidos funcionam como "sem filtro"', () => {
  for (const criterios of [null, undefined, 'texto', 42]) {
    assert.equal(filtrar(catalogo, criterios).length, 4);
  }
});

test('itens inválidos dentro da lista são descartados', () => {
  const resultado = filtrar([null, 'x', 42, catalogo[0]], {});
  assert.deepEqual(ids(resultado), ['A-01']);
});

test('prompt sem tags, objetivo ou problema não quebra a busca', () => {
  const resultado = filtrar([{ id: 'Z-01', title: 'Somente título' }], { busca: 'titulo' });
  assert.deepEqual(ids(resultado), ['Z-01']);
});

const dados = JSON.parse(fs.readFileSync(path.join(root, 'data/prompts.json'), 'utf8'));
const reais = Array.isArray(dados) ? dados : dados.prompts;

test('dados reais: busca vazia devolve os 24 prompts', () => {
  assert.equal(reais.length, 24);
  assert.equal(filtrar(reais, { busca: '' }).length, 24);
});

test('dados reais: a busca por "gargalos" encontra OP-02', () => {
  assert.ok(ids(filtrar(reais, { busca: 'gargalos' })).includes('OP-02'));
});

test('dados reais: a busca pela primeira tag do primeiro prompt encontra esse prompt', () => {
  const primeiro = reais[0];
  const resultado = filtrar(reais, { busca: primeiro.tags[0] });
  assert.ok(ids(resultado).includes(primeiro.id));
});

test('dados reais: todo resultado de busca contém o termo em algum campo pesquisado', () => {
  for (const termo of ['gargalos', 'relato', 'validacao']) {
    for (const prompt of filtrar(reais, { busca: termo })) {
      const campos = [prompt.title, prompt.objective, prompt.problem, ...(prompt.tags || [])];
      const achou = campos.some((campo) =>
        api.normalizarTexto(api.limparMarkdown(campo)).includes(termo)
      );
      assert.ok(achou, `${prompt.id} apareceu para "${termo}" sem conter o termo`);
    }
  }
});

test('dados reais: filtrar cada categoria devolve só prompts dela e cobre o catálogo', () => {
  const categorias = [...new Set(reais.map((p) => p.categoryId).filter(Boolean))];
  let total = 0;
  for (const categoria of categorias) {
    const resultado = filtrar(reais, { categoryId: categoria });
    assert.ok(resultado.length > 0);
    assert.ok(resultado.every((p) => p.categoryId === categoria));
    total += resultado.length;
  }
  assert.equal(total, reais.filter((p) => p.categoryId).length);
});

test('dados reais: filtros combinados dão a interseção esperada', () => {
  const base = reais[0];
  const esperado = reais.filter(
    (p) => p.categoryId === base.categoryId && p.status === base.status && p.maturity === base.maturity
  );
  const resultado = filtrar(reais, {
    categoryId: base.categoryId,
    status: base.status,
    maturity: base.maturity
  });
  assert.deepEqual(ids(resultado), ids(esperado));
  assert.ok(ids(resultado).includes(base.id));
});