/**
 * prompt-detail.js - PromptOps Academy
 * Módulo de exibição detalhada de prompts e ações de fluxo (Issue #19)
 *
 * Responsável por:
 * 1. Obter o parâmetro 'id' da URL (ex.: prompt.html?id=OP-01 ou prompt-01).
 * 2. Carregar os dados de data/prompts.json (respeitando o schema canônico sem duplicar dados).
 * 3. Renderizar todos os detalhes do prompt selecionado com total acessibilidade e responsividade.
 * 4. Conectar as ações do fluxo: "Testar no Laboratório", "Copiar Texto", "Voltar ao Catálogo" e "Ir ao Início".
 */

(function (global) {
  'use strict';

  var statusLabels = {
    rascunho: 'Rascunho',
    em_revisao: 'Em revisão',
    publicado: 'Publicado',
    arquivado: 'Arquivado'
  };

  var maturityLabels = {
    experimental: 'Experimental',
    em_validacao: 'Em validação',
    validado: 'Validado'
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getQueryParam(param) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  function loadPromptDetail() {
    var promptId = getQueryParam('id');
    var container = document.getElementById('prompt-detail-content');
    var loadingState = document.getElementById('detail-loading');
    var errorState = document.getElementById('detail-error');

    if (!container) return;

    if (!promptId) {
      showError('Nenhum identificador de prompt foi especificado na URL.');
      return;
    }

    fetch('./data/prompts.json')
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Falha ao carregar arquivo de dados (HTTP ' + response.status + ')');
        }
        return response.json();
      })
      .then(function (data) {
        // Se houver dados locais consolidados via localStorage, dá suporte sem conflitar
        var prompts = data.prompts || [];
        if (global.PromptOpsStorage && typeof global.PromptOpsStorage.getConsolidatedPrompts === 'function') {
          prompts = global.PromptOpsStorage.getConsolidatedPrompts(prompts);
        }

        var prompt = prompts.find(function (p) {
          return p.id === promptId || String(p.id).toLowerCase() === promptId.toLowerCase();
        });

        if (!prompt) {
          showError('Prompt com ID "' + escapeHtml(promptId) + '" não foi encontrado no catálogo.');
          return;
        }

        // Busca informações complementares (versão, categoria, subcategoria)
        var versions = data.versions || [];
        var version = versions.find(function (v) {
          return v.id === prompt.currentVersionId || v.promptId === prompt.id;
        }) || {
          number: 1,
          text: prompt.problem ? (prompt.title + '\n\n' + prompt.objective + '\n\n' + prompt.problem) : 'Texto da versão não disponível.',
          author: prompt.responsible || 'Equipe PromptOps'
        };

        var categories = data.categories || [];
        var category = categories.find(function (c) {
          return c.id === prompt.categoryId;
        });

        var categoryName = category ? category.name : (prompt.categoryId || 'Geral');
        var subcategoryName = prompt.subcategoryId || 'Geral';

        renderPrompt(prompt, version, categoryName, subcategoryName);
      })
      .catch(function (error) {
        console.error('PromptOps: Erro ao carregar detalhe do prompt:', error);
        showError('Não foi possível carregar os dados do prompt. Verifique sua conexão ou tente novamente mais tarde.');
      });

    function showError(message) {
      if (loadingState) loadingState.hidden = true;
      if (container) container.hidden = true;
      if (errorState) {
        errorState.hidden = false;
        var msgEl = document.getElementById('error-message');
        if (msgEl) msgEl.textContent = message;
      }
    }

    function renderPrompt(prompt, version, categoryName, subcategoryName) {
      if (loadingState) loadingState.hidden = true;
      if (errorState) errorState.hidden = true;
      if (container) container.hidden = false;

      // Atualiza título da página
      document.title = prompt.title + ' - PromptOps Academy';

      // Atualiza Breadcrumb
      var breadcrumbEl = document.getElementById('breadcrumb-prompt-title');
      if (breadcrumbEl) {
        breadcrumbEl.textContent = prompt.title;
      }

      // Badges
      var badgeIdEl = document.getElementById('prompt-badge-id');
      if (badgeIdEl) badgeIdEl.textContent = prompt.id;

      var badgeCatEl = document.getElementById('prompt-badge-category');
      if (badgeCatEl) badgeCatEl.textContent = categoryName;

      var badgeSubEl = document.getElementById('prompt-badge-subcategory');
      if (badgeSubEl) badgeSubEl.textContent = subcategoryName;

      var badgeStatusEl = document.getElementById('prompt-badge-status');
      if (badgeStatusEl) {
        var statusKey = prompt.status || 'rascunho';
        badgeStatusEl.textContent = statusLabels[statusKey] || statusKey;
        badgeStatusEl.className = 'badge badge-status ' + statusKey;
      }

      var badgeMaturityEl = document.getElementById('prompt-badge-maturity');
      if (badgeMaturityEl) {
        var matKey = prompt.maturity || 'experimental';
        badgeMaturityEl.textContent = maturityLabels[matKey] || matKey;
      }

      // Título principal
      var titleEl = document.getElementById('prompt-detail-title');
      if (titleEl) titleEl.textContent = prompt.title;

      // Objetivo
      var objectiveEl = document.getElementById('prompt-objective');
      if (objectiveEl) objectiveEl.textContent = prompt.objective || 'Nenhum objetivo cadastrado.';

      // Problema
      var problemEl = document.getElementById('prompt-problem');
      if (problemEl) problemEl.textContent = prompt.problem || 'Nenhum problema cadastrado.';

      // Tags
      var tagsContainer = document.getElementById('prompt-tags-list');
      if (tagsContainer) {
        tagsContainer.innerHTML = '';
        if (Array.isArray(prompt.tags) && prompt.tags.length > 0) {
          prompt.tags.forEach(function (tag) {
            var span = document.createElement('span');
            span.className = 'prompt-tag';
            span.textContent = '#' + tag;
            tagsContainer.appendChild(span);
          });
        } else {
          tagsContainer.innerHTML = '<span class="prompt-tag">Sem tags</span>';
        }
      }

      // Texto do Prompt / Versão
      var promptText = version.text || 'Conteúdo do prompt não cadastrado.';
      var textEl = document.getElementById('prompt-text-content');
      if (textEl) {
        textEl.textContent = promptText;
      }

      var versionInfoEl = document.getElementById('prompt-version-info');
      if (versionInfoEl) {
        versionInfoEl.textContent = 'Versão ' + (version.number || 1) + ' · Autor: ' + (version.author || prompt.responsible || 'Equipe');
      }

      // Configuração dos Botões de Ação
      var copyBtn = document.getElementById('btn-copy-prompt');
      var feedbackToast = document.getElementById('copy-feedback');

      if (copyBtn) {
        copyBtn.addEventListener('click', function () {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(promptText).then(function () {
              showCopySuccess();
            }).catch(function () {
              fallbackCopy(promptText);
            });
          } else {
            fallbackCopy(promptText);
          }
        });
      }

      function fallbackCopy(text) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          showCopySuccess();
        } catch (err) {
          alert('Não foi possível copiar automaticamente.');
        }
        document.body.removeChild(textarea);
      }

      function showCopySuccess() {
        if (!feedbackToast) return;
        feedbackToast.hidden = false;
        setTimeout(function () {
          feedbackToast.hidden = true;
        }, 3000);
      }

      // Botão "Testar no Laboratório"
      var labBtn = document.getElementById('btn-test-in-lab');
      if (labBtn) {
        labBtn.addEventListener('click', function () {
          if (global.PromptOpsNavigation) {
            global.PromptOpsNavigation.goToLaboratorio(prompt.id);
          } else {
            window.location.href = 'public/laboratorio-de-prompts.html?promptId=' + encodeURIComponent(prompt.id);
          }
        });
      }
    }
  }

  // Inicialização
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPromptDetail);
  } else {
    loadPromptDetail();
  }

  global.PromptOpsPromptDetail = {
    load: loadPromptDetail
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
