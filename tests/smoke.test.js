const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('catálogo contém 24 prompts com identificadores únicos', () => {
  const prompts = JSON.parse(read('data/prompts.json'));
  const items = Array.isArray(prompts) ? prompts : prompts.prompts;
  assert.equal(items.length, 24);
  const ids = items.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('páginas principais referenciam os scripts necessários', () => {
  const index = read('index.html');
  const detail = read('prompt.html');
  assert.match(index, /js\/storage\.js/);
  assert.match(index, /js\/catalog\.js/);
  assert.match(index, /js\/registration\.js/);
  assert.match(detail, /js\/navigation\.js/);
  assert.match(detail, /js\/prompt-detail\.js/);
});

test('laboratório e detalhe oferecem retorno ao fluxo principal', () => {
  assert.match(read('prompt.html'), /index\.html#catalogo/);
  assert.match(read('public/laboratorio-de-prompts.html'), /\.\.\/index\.html/);
});
