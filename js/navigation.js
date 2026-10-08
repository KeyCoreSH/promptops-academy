/**
 * navigation.js - PromptOps Academy
 * Módulo de Integração da Navegação Principal e Fluxo do Usuário (Issue #19)
 *
 * Responsável por orquestrar o fluxo:
 * Início → Catálogo → Detalhe/Ação → Laboratório → Início
 *
 * Não substitui código de catálogo ou arquitetura de outros colaboradores.
 * Funciona de maneira autônoma e modular em desktop e mobile.
 */

(function (global) {
  'use strict';

  var Navigation = {
    /**
     * Inicializa os comportamentos de navegação na página atual
     */
    init: function () {
      this.bindSidebarToggle();
      this.highlightActiveNavLink();
      this.bindQuickNavigation();
      this.bindSmoothScroll();
    },

    /**
     * Configura o botão de alternância do menu mobile (hambúrguer)
     */
    bindSidebarToggle: function () {
      var menuToggle = document.querySelector('#menu-toggle') || document.querySelector('.menu-toggle');
      var sidebar = document.querySelector('#sidebar') || document.querySelector('.sidebar');

      if (!menuToggle || !sidebar) return;

      menuToggle.addEventListener('click', function () {
        var isOpen = sidebar.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
      });

      // Fechar menu mobile ao clicar em qualquer link da sidebar
      sidebar.addEventListener('click', function (event) {
        var link = event.target.closest('a');
        if (link && window.innerWidth <= 768) {
          sidebar.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
        }
      });
    },

    /**
     * Destaca o link ativo na navegação lateral de acordo com a página ou âncora
     */
    highlightActiveNavLink: function () {
      var currentPath = window.location.pathname;
      var currentHash = window.location.hash;
      var navLinks = document.querySelectorAll('.side-nav .nav-link, .nav-link');

      if (!navLinks || navLinks.length === 0) return;

      navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (!href) return;

        var isMatch = false;

        if (currentPath.endsWith('laboratorio-de-prompts.html') && href.includes('laboratorio-de-prompts.html')) {
          isMatch = true;
        } else if (currentPath.endsWith('prompt.html') && (href.includes('prompt.html') || href.includes('#catalogo') || href.includes('index.html#catalogo'))) {
          isMatch = href.includes('catalogo');
        } else if (currentHash && href.endsWith(currentHash)) {
          isMatch = true;
        } else if (!currentHash && (href === '#inicio' || href === 'index.html' || href === 'index.html#inicio')) {
          isMatch = true;
        }

        if (isMatch) {
          link.classList.add('active');
        }
      });
    },

    /**
     * Intercepta botões ou links que acionam ações do fluxo (ex: ir ao laboratório passando contexto)
     */
    bindQuickNavigation: function () {
      document.addEventListener('click', function (event) {
        var target = event.target.closest('[data-nav-action]');
        if (!target) return;

        var action = target.getAttribute('data-nav-action');
        var promptId = target.getAttribute('data-prompt-id');

        if (action === 'open-lab') {
          event.preventDefault();
          Navigation.goToLaboratorio(promptId);
        } else if (action === 'go-back') {
          event.preventDefault();
          Navigation.goBack(target.getAttribute('data-fallback-url') || 'index.html#catalogo');
        }
      });
    },

    /**
     * Navegação suave para âncoras dentro da mesma página
     */
    bindSmoothScroll: function () {
      document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
          var targetId = this.getAttribute('href').substring(1);
          var targetElement = document.getElementById(targetId);

          if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth' });
            history.pushState(null, '', '#' + targetId);
          }
        });
      });
    },

    /**
     * Redireciona para o Laboratório de Prompts
     * @param {string} [promptId] ID opcional do prompt para teste
     */
    goToLaboratorio: function (promptId) {
      var url = 'public/laboratorio-de-prompts.html';
      // Ajusta caminho relativo dependendo do diretório atual
      if (window.location.pathname.includes('/public/')) {
        url = 'laboratorio-de-prompts.html';
      }
      if (promptId) {
        url += '?promptId=' + encodeURIComponent(promptId);
      }
      window.location.href = url;
    },

    /**
     * Redireciona para a página de catálogo
     */
    goToCatalogo: function () {
      var url = 'index.html#catalogo';
      if (window.location.pathname.includes('/public/')) {
        url = '../index.html#catalogo';
      }
      window.location.href = url;
    },

    /**
     * Redireciona para a página inicial
     */
    goToInicio: function () {
      var url = 'index.html#inicio';
      if (window.location.pathname.includes('/public/')) {
        url = '../index.html';
      }
      window.location.href = url;
    },

    /**
     * Redireciona para a página de detalhe de um prompt
     * @param {string} promptId
     */
    goToPromptDetail: function (promptId) {
      if (!promptId) return;
      var url = 'prompt.html?id=' + encodeURIComponent(promptId);
      if (window.location.pathname.includes('/public/')) {
        url = '../prompt.html?id=' + encodeURIComponent(promptId);
      }
      window.location.href = url;
    },

    /**
     * Retorna à página anterior com fallback seguro
     * @param {string} fallbackUrl
     */
    goBack: function (fallbackUrl) {
      if (window.history.length > 1 && document.referrer && document.referrer.includes(window.location.host)) {
        window.history.back();
      } else {
        window.location.href = fallbackUrl || 'index.html#catalogo';
      }
    }
  };

  // Auto-inicialização quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      Navigation.init();
    });
  } else {
    Navigation.init();
  }

  // Exportação global
  global.PromptOpsNavigation = Navigation;
})(typeof globalThis !== 'undefined' ? globalThis : window);
