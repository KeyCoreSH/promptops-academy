/*
 * PromptOps Catalog — Integração de Busca, Filtros e Interface Visual.
 * Módulo unificado: Filtros (Levi) + Renderização de Interface (Carlos).
 */
(function (global) {
  "use strict";

  // --- Lógica de Filtros e Busca (Levi) ---
  const CAMPOS_DE_FILTRO = [
    "categoryId",
    "subcategoryId",
    "status",
    "maturity",
  ];

  function normalizarTexto(valor) {
    if (typeof valor !== "string") {
      return "";
    }

    return valor
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
  }

  function correspondeABusca(prompt, buscaNormalizada) {
    if (!buscaNormalizada) {
      return true;
    }

    const textos = [prompt.title, prompt.objective];

    if (Array.isArray(prompt.tags)) {
      textos.push(...prompt.tags);
    }

    return textos.some(function (texto) {
      return normalizarTexto(texto).includes(buscaNormalizada);
    });
  }

  function filtroEstaAtivo(valor) {
    return (
      valor !== undefined &&
      valor !== null &&
      !(typeof valor === "string" && valor.trim() === "")
    );
  }

  function correspondeAosFiltros(prompt, criterios) {
    return CAMPOS_DE_FILTRO.every(function (campo) {
      return !filtroEstaAtivo(criterios[campo]) || prompt[campo] === criterios[campo];
    });
  }

  function filtrarPrompts(prompts, criterios) {
    if (!Array.isArray(prompts)) {
      return [];
    }

    const consulta = criterios && typeof criterios === "object" ? criterios : {};
    const buscaNormalizada = normalizarTexto(consulta.busca).trim();

    return prompts.filter(function (prompt) {
      if (!prompt || typeof prompt !== "object") {
        return false;
      }

      return (
        correspondeABusca(prompt, buscaNormalizada) &&
        correspondeAosFiltros(prompt, consulta)
      );
    });
  }

  function limparFiltros(criterios) {
    const consulta = criterios && typeof criterios === "object" ? criterios : {};
    const criteriosLimpos = {};

    if (Object.prototype.hasOwnProperty.call(consulta, "busca")) {
      criteriosLimpos.busca = consulta.busca;
    }

    return criteriosLimpos;
  }

  // --- Lógica de Renderização e Interface (Carlos) ---
  const grid = document.querySelector('#prompt-grid');
  const state = document.querySelector('#catalog-state');
  const resultCount = document.querySelector('#result-count');
  const promptCount = document.querySelector('#prompt-count');
  const categoryCount = document.querySelector('#category-count');
  const pipelineCount = document.querySelector('#pipeline-count');

  const STATUS_LABELS = {
    rascunho: 'Rascunho',
    em_revisao: 'Em revisão',
    publicado: 'Publicado',
    arquivado: 'Arquivado'
  };

  const MATURITY_LABELS = {
    experimental: 'Experimental',
    em_validacao: 'Em validação',
    validado: 'Validado'
  };

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function categoryColor(index) {
    if (index % 3 === 1) return 'blue';
    if (index % 3 === 2) return 'green';
    return '';
  }

  function createCard(prompt, context) {
    const category = context.categories.find(item => item.id === prompt.categoryId);
    const subcategory = category?.subcategories?.find(item =>
      typeof item === 'string' ? item === prompt.subcategoryId : item.id === prompt.subcategoryId
    );
    const version = context.versions.find(item => item.id === prompt.currentVersionId);
    const tests = context.tests.filter(item => item.promptId === prompt.id);
    const categoryIndex = Math.max(0, context.categories.indexOf(category));

    const card = element('article', 'card');
    card.setAttribute('aria-labelledby', `title-${prompt.id}`);

    const badge = element('div', `card-badge ${categoryColor(categoryIndex)}`, category?.title || 'Categoria');
    const title = element('h3', 'card-title');
    title.id = `title-${prompt.id}`;

    const link = element('a', 'card-title-link', prompt.title);
    link.href = `public/details.html?id=${encodeURIComponent(prompt.id)}`;
    title.appendChild(link);

    const sub = element('p', 'card-sub', subcategory?.title || subcategory || 'Geral');
    const desc = element('p', 'card-description', prompt.problem || prompt.objective || '');

    const meta = element('div', 'card-meta');
    meta.appendChild(element('span', 'meta-pill', STATUS_LABELS[prompt.status] || prompt.status || 'Status'));
    meta.appendChild(element('span', 'meta-pill', MATURITY_LABELS[prompt.maturity] || prompt.maturity || 'Maturidade'));
    meta.appendChild(element('span', 'meta-pill', `v${version?.number || 1}`));
    meta.appendChild(element('span', 'meta-pill', `${tests.length} teste(s)`));

    const footer = element('div', 'card-footer');
    footer.appendChild(element('span', 'meta-owner', `Responsável: ${prompt.responsible || 'Time'}`));

    const tagContainer = element('div', 'meta-tags');
    (prompt.tags || []).slice(0, 3).forEach(tagText => {
      tagContainer.appendChild(element('span', 'tag', `#${tagText}`));
    });
    footer.appendChild(tagContainer);

    card.append(badge, title, sub, desc, meta, footer);
    return card;
  }

  function showState(type, message) {
    if (!state) return;

    state.classList.remove('hidden', 'empty', 'error', 'loading');
    state.innerHTML = '';

    if (type === 'loading') {
      state.classList.add('loading');
      state.append(element('div', 'spinner'), element('p', null, message || 'Carregando catálogo...'));
      return;
    }

    if (type === 'error') {
      state.classList.add('error');
      state.append(
        element('h3', null, 'Não foi possível carregar os prompts'),
        element('p', null, message || 'Verifique sua conexão ou tente novamente mais tarde.')
      );
      return;
    }

    if (type === 'search-empty') {
      state.classList.add('empty');
      state.append(
        element('h3', null, 'Nenhum prompt encontrado'),
        element('p', null, 'Tente ajustar os termos da busca ou limpar os filtros aplicados.')
      );
      return;
    }

    state.classList.add('empty');
    state.append(
      element('h3', null, 'Catálogo em construção'),
      element('p', null, message || 'Nenhum prompt foi cadastrado até o momento.')
    );
  }

  function render(data = {}, filters = {}) {
    if (!grid) return;

    const safeData = {
      prompts: data.prompts || [],
      categories: data.categories || [],
      versions: data.versions || [],
      tests: data.tests || []
    };

    grid.innerHTML = '';

    // Aplica filtragem (Levi)
    const items = filtrarPrompts(safeData.prompts, filters);

    if (!safeData.prompts.length) {
      showState('empty');
    } else if (!items.length) {
      showState('search-empty');
    } else {
      if (state) state.classList.add('hidden');
      const fragment = document.createDocumentFragment();
      items.forEach(prompt => fragment.appendChild(createCard(prompt, safeData)));
      grid.appendChild(fragment);
    }

    if (resultCount) resultCount.textContent = String(items.length);
    if (promptCount) promptCount.textContent = String(safeData.prompts.length);
    if (categoryCount) categoryCount.textContent = String(data.totalCategories ?? safeData.categories.length);
    if (pipelineCount) pipelineCount.textContent = String(data.totalPipelines ?? 0);
  }

  // Eventos de Menu Responsivo
  const menuToggle = document.querySelector('#menu-toggle');
  const sidebar = document.querySelector('#sidebar');
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      const open = sidebar.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    sidebar.addEventListener('click', event => {
      if (event.target.closest('a') && window.innerWidth <= 700) {
        sidebar.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
      }
    });
  }

  // Exportação Global do Módulo
  global.PromptOpsCatalog = Object.freeze({
    render: render,
    showState: showState,
    createCard: createCard,
    filtrarPrompts: filtrarPrompts,
    limparFiltros: limparFiltros,
  });

  window.dispatchEvent(new CustomEvent('promptops:catalog-ready'));

  // Carregamento automático e integração com o DOM
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      let currentData = null;

      function getFilters() {
        const searchInput = document.querySelector('#catalog-search') || document.querySelector('#global-search');
        const catSelect = document.querySelector('#category-filter');
        const subSelect = document.querySelector('#subcategory-filter');
        const statusSelect = document.querySelector('#status-filter');
        const matSelect = document.querySelector('#maturity-filter');

        return {
          busca: searchInput ? searchInput.value : '',
          categoryId: catSelect ? catSelect.value : '',
          subcategoryId: subSelect ? subSelect.value : '',
          status: statusSelect ? statusSelect.value : '',
          maturity: matSelect ? matSelect.value : ''
        };
      }

      function update() {
        if (currentData) {
          render(currentData, getFilters());
        }
      }

      function populateCategories(data) {
        const catSelect = document.querySelector('#category-filter');
        const statusSelect = document.querySelector('#status-filter');
        const matSelect = document.querySelector('#maturity-filter');

        if (catSelect && Array.isArray(data.categories) && catSelect.options.length <= 1) {
          catSelect.innerHTML = '<option value="">Todas as categorias</option>';
          data.categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.id;
            opt.textContent = cat.name || cat.id;
            catSelect.appendChild(opt);
          });
        }

        if (statusSelect && statusSelect.options.length <= 1) {
          statusSelect.innerHTML = `
            <option value="">Todos os status</option>
            <option value="rascunho">Rascunho</option>
            <option value="em_revisao">Em revisão</option>
            <option value="publicado">Publicado</option>
            <option value="arquivado">Arquivado</option>
          `;
        }

        if (matSelect && matSelect.options.length <= 1) {
          matSelect.innerHTML = `
            <option value="">Todas as maturidades</option>
            <option value="experimental">Experimental</option>
            <option value="em_validacao">Em validação</option>
            <option value="validado">Validado</option>
          `;
        }
      }

      const inputs = document.querySelectorAll('#catalog-search, #global-search, #category-filter, #subcategory-filter, #status-filter, #maturity-filter');
      inputs.forEach(input => {
        input.addEventListener('input', update);
        input.addEventListener('change', update);
      });

      showState('loading');
      fetch('data/prompts.json')
        .then(res => {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(data => {
          currentData = data;
          populateCategories(data);
          render(currentData, getFilters());
        })
        .catch(err => {
          console.error('Erro ao carregar prompts.json:', err);
          showState('error', 'Não foi possível carregar os dados de data/prompts.json.');
        });
    });
  }
})(globalThis);
