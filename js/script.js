const STORAGE_KEY = 'promptops-canonical-data-v1';

const CATEGORY_DEFINITIONS = [
  { id: 'operacoes-processos', name: 'Operações e Processos', subcategories: [
    { id: 'diagnostico-operacional', name: 'Diagnóstico Operacional' },
    { id: 'planejamento-melhoria', name: 'Planejamento e Melhoria' }
  ]},
  { id: 'conteudo-comunicacao', name: 'Conteúdo e Comunicação', subcategories: [
    { id: 'estrategia-editorial', name: 'Estratégia Editorial' },
    { id: 'producao-revisao', name: 'Produção e Revisão' }
  ]},
  { id: 'produto-desenvolvimento', name: 'Produto e Desenvolvimento', subcategories: [
    { id: 'registro-defeitos', name: 'Registro de Defeitos' },
    { id: 'validacao-testes', name: 'Validação e Testes' }
  ]},
  { id: 'dados-analise', name: 'Dados e Análise', subcategories: [
    { id: 'qualidade-dados', name: 'Qualidade de Dados' },
    { id: 'analise-exploratoria', name: 'Análise Exploratória' }
  ]},
  { id: 'seguranca-governanca', name: 'Segurança e Governança', subcategories: [
    { id: 'privacidade', name: 'Privacidade' },
    { id: 'confiabilidade-informacao', name: 'Confiabilidade da Informação' }
  ]},
  { id: 'aprendizado-pesquisa', name: 'Aprendizado e Pesquisa', subcategories: [
    { id: 'pesquisa-orientada', name: 'Pesquisa Orientada' },
    { id: 'estudo-aplicado', name: 'Estudo Aplicado' }
  ]}
];

const DEFAULT_DATA = {
  schemaVersion: 1,
  prompts: [],
  versions: [],
  tests: [],
  relations: [],
  pipelines: [
    { id: 'diagnostico-operacional', name: 'Diagnóstico Operacional', objective: 'Apoiar a identificação e organização de problemas operacionais.', steps: [] },
    { id: 'conteudo-educativo', name: 'Conteúdo Educativo', objective: 'Apoiar a criação estruturada de conteúdos educativos.', steps: [] },
    { id: 'qa-produto', name: 'QA de Produto', objective: 'Apoiar a identificação de problemas e a revisão de qualidade.', steps: [] }
  ],
  categories: CATEGORY_DEFINITIONS
};

const $ = selector => document.querySelector(selector);
const clone = value => JSON.parse(JSON.stringify(value));
const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const safe = value => {
  const element = document.createElement('div');
  element.textContent = value || '';
  return element.innerHTML;
};
const makeId = prefix => `${prefix}-${crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(16).slice(2)}`;

function loadData() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!parsed || parsed.schemaVersion !== 1 || !Array.isArray(parsed.prompts)) return clone(DEFAULT_DATA);
    return { ...clone(DEFAULT_DATA), ...parsed, categories: CATEGORY_DEFINITIONS };
  } catch {
    return clone(DEFAULT_DATA);
  }
}

const data = loadData();
const grid = $('#prompt-grid');
const searches = [$('#prompt-search'), $('#global-search')];
const categoryFilter = $('#category-filter');
const subcategoryFilter = $('#subcategory-filter');
const statusFilter = $('#status-filter');
const maturityFilter = $('#maturity-filter');
const message = $('#results-message');
const resultCount = $('#result-count');
const modal = $('#modal');
const form = $('#prompt-form');
const formMessage = $('#form-message');
const formCategory = form.elements.categoryId;
const formSubcategory = form.elements.subcategoryId;

const statusLabels = { rascunho: 'Rascunho', em_revisao: 'Em revisão', publicado: 'Publicado', arquivado: 'Arquivado' };
const maturityLabels = { experimental: 'Experimental', em_validacao: 'Em validação', validado: 'Validado' };

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function categoryById(id) {
  return CATEGORY_DEFINITIONS.find(category => category.id === id);
}

function subcategoryById(categoryId, subcategoryId) {
  return categoryById(categoryId)?.subcategories.find(subcategory => subcategory.id === subcategoryId);
}

function currentVersion(prompt) {
  return data.versions.find(version => version.id === prompt.currentVersionId);
}

function testCount(promptId) {
  return data.tests.filter(test => test.promptId === promptId).length;
}

function badgeClass(categoryId) {
  if (['operacoes-processos', 'dados-analise'].includes(categoryId)) return 'blue-bg';
  if (['produto-desenvolvimento', 'seguranca-governanca'].includes(categoryId)) return 'green-bg';
  return 'purple-bg';
}

function statusClass(status) {
  if (status === 'publicado') return 'approved';
  if (status === 'em_revisao') return 'improving';
  return 'testing';
}

function promptCard(prompt) {
  const category = categoryById(prompt.categoryId);
  const subcategory = subcategoryById(prompt.categoryId, prompt.subcategoryId);
  const version = currentVersion(prompt);
  return `<article class="prompt-card">
    <div class="card-top">
      <span class="badge ${badgeClass(prompt.categoryId)}">${safe(category?.name)}</span>
      <button class="favorite ${prompt.favorite ? 'on' : ''}" data-favorite="${safe(prompt.id)}" aria-label="${prompt.favorite ? 'Remover dos' : 'Adicionar aos'} favoritos" aria-pressed="${prompt.favorite}">${prompt.favorite ? '★' : '☆'}</button>
    </div>
    <h3>${safe(prompt.title)}</h3>
    <p class="description">${safe(prompt.objective)}</p>
    <p class="subcategory-name">${safe(subcategory?.name)}</p>
    <div class="tags">${prompt.tags.map(tag => `<span class="tag">${safe(tag)}</span>`).join('')}</div>
    <footer class="card-footer">
      <span>▤ V${version?.number || 1}</span>
      <span>♧ ${testCount(prompt.id)} Testes</span>
      <span class="${statusClass(prompt.status)}">✦ ${safe(statusLabels[prompt.status])}</span>
      <span>${safe(maturityLabels[prompt.maturity])}</span>
    </footer>
  </article>`;
}

function filteredPrompts() {
  const query = normalize(searches[0].value || searches[1].value);
  return data.prompts.filter(prompt => {
    const searchable = normalize([prompt.title, prompt.objective, ...(prompt.tags || [])].join(' '));
    return (!query || searchable.includes(query))
      && (categoryFilter.value === 'all' || prompt.categoryId === categoryFilter.value)
      && (subcategoryFilter.value === 'all' || prompt.subcategoryId === subcategoryFilter.value)
      && (statusFilter.value === 'all' || prompt.status === statusFilter.value)
      && (maturityFilter.value === 'all' || prompt.maturity === maturityFilter.value);
  });
}

function renderPrompts() {
  const prompts = filteredPrompts();
  grid.innerHTML = prompts.map(promptCard).join('');
  resultCount.textContent = `${prompts.length} ${prompts.length === 1 ? 'resultado' : 'resultados'}`;
  message.hidden = prompts.length > 0;
  message.textContent = data.prompts.length
    ? 'Nenhum prompt combina com esta busca. Ajuste o termo ou limpe os filtros.'
    : "Nenhum prompt cadastrado ainda. Clique em 'Novo Prompt' para registrar sua primeira instrução.";
  $('#stat-prompts').textContent = data.prompts.length;
  $('#stat-categories').textContent = CATEGORY_DEFINITIONS.length;
}

function fillCategorySelects() {
  const options = CATEGORY_DEFINITIONS.map(category => `<option value="${category.id}">${safe(category.name)}</option>`).join('');
  categoryFilter.innerHTML = '<option value="all">Categorias</option>' + options;
  formCategory.innerHTML = '<option value="">Selecione</option>' + options;
}

function fillSubcategoryFilter() {
  const categories = categoryFilter.value === 'all' ? CATEGORY_DEFINITIONS : [categoryById(categoryFilter.value)];
  const options = categories.filter(Boolean).flatMap(category => category.subcategories).map(subcategory => `<option value="${subcategory.id}">${safe(subcategory.name)}</option>`).join('');
  subcategoryFilter.innerHTML = '<option value="all">Subcategorias</option>' + options;
}

function fillFormSubcategories() {
  const options = (categoryById(formCategory.value)?.subcategories || []).map(subcategory => `<option value="${subcategory.id}">${safe(subcategory.name)}</option>`).join('');
  formSubcategory.innerHTML = `<option value="">${options ? 'Selecione' : 'Selecione a categoria'}</option>${options}`;
}

function toggleFavorite(id) {
  const prompt = data.prompts.find(item => item.id === id);
  if (!prompt) return;
  prompt.favorite = !prompt.favorite;
  saveData();
  renderPrompts();
}

function openModal() {
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  form.elements.title.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
  form.reset();
  formMessage.hidden = true;
  fillFormSubcategories();
}

function validatePrompt(formData) {
  const title = formData.get('title').trim();
  const text = formData.get('text').trim();
  const category = categoryById(formData.get('categoryId'));
  const subcategory = category?.subcategories.find(item => item.id === formData.get('subcategoryId'));
  if (title.length < 8) return 'O título precisa ter pelo menos 8 caracteres.';
  if (text.length < 80) return 'O texto do prompt precisa ter pelo menos 80 caracteres.';
  if (!category || !subcategory) return 'Selecione uma categoria e subcategoria válidas para classificar o prompt.';
  if (data.versions.some(version => version.text.trim() === text)) return 'Já existe um prompt com este texto. Abra o registro existente para revisar ou criar uma nova versão.';
  return '';
}

function createPrompt(formData) {
  const error = validatePrompt(formData);
  if (error) {
    formMessage.textContent = error;
    formMessage.hidden = false;
    return;
  }
  const promptId = makeId('prompt');
  const versionId = makeId('version');
  const today = new Date().toISOString().slice(0, 10);
  const prompt = {
    id: promptId,
    title: formData.get('title').trim(),
    categoryId: formData.get('categoryId'),
    subcategoryId: formData.get('subcategoryId'),
    tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(Boolean),
    problem: formData.get('problem').trim(),
    objective: formData.get('objective').trim(),
    responsible: formData.get('responsible').trim(),
    status: formData.get('status'),
    maturity: formData.get('maturity'),
    currentVersionId: versionId,
    favorite: false
  };
  const version = {
    id: versionId,
    promptId,
    number: 1,
    text: formData.get('text').trim(),
    context: formData.get('context').trim(),
    restrictions: formData.get('restrictions').trim(),
    format: formData.get('format').trim(),
    qualityCriteria: formData.get('qualityCriteria').trim(),
    nextAction: formData.get('nextAction').trim(),
    author: prompt.responsible,
    createdAt: today,
    changeReason: '',
    editorialChanges: []
  };
  data.prompts.unshift(prompt);
  data.versions.push(version);
  saveData();
  searches.forEach(input => input.value = '');
  [categoryFilter, subcategoryFilter, statusFilter, maturityFilter].forEach(filter => filter.value = 'all');
  fillSubcategoryFilter();
  renderPrompts();
  closeModal();
}

searches.forEach((input, index) => input.addEventListener('input', () => {
  searches[1 - index].value = input.value;
  renderPrompts();
}));
categoryFilter.addEventListener('change', () => {
  fillSubcategoryFilter();
  renderPrompts();
});
[subcategoryFilter, statusFilter, maturityFilter].forEach(filter => filter.addEventListener('change', renderPrompts));
formCategory.addEventListener('change', fillFormSubcategories);
grid.addEventListener('click', event => {
  const button = event.target.closest('[data-favorite]');
  if (button) toggleFavorite(button.dataset.favorite);
});
$('#clear-filters').addEventListener('click', () => {
  [categoryFilter, subcategoryFilter, statusFilter, maturityFilter].forEach(filter => filter.value = 'all');
  fillSubcategoryFilter();
  renderPrompts();
});
$('#new-prompt').addEventListener('click', openModal);
$('#modal-close').addEventListener('click', closeModal);
$('#modal-cancel').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
form.addEventListener('submit', event => {
  event.preventDefault();
  createPrompt(new FormData(form));
});
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });

const userButton = $('#user-button');
const userMenu = $('#user-menu');
userButton.addEventListener('click', () => {
  const open = userMenu.hidden;
  userMenu.hidden = !open;
  userButton.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', event => {
  if (!event.target.closest('.user-area')) {
    userMenu.hidden = true;
    userButton.setAttribute('aria-expanded', 'false');
  }
});

const menuButton = $('#menu-button');
const sidebar = $('#sidebar');
menuButton.addEventListener('click', () => {
  const open = sidebar.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
sidebar.addEventListener('click', event => {
  if (event.target.closest('a') && innerWidth <= 700) {
    sidebar.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

fillCategorySelects();
fillSubcategoryFilter();
fillFormSubcategories();
renderPrompts();