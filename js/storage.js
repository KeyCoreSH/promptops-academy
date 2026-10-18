/*
 * PromptOps Storage — Camada de Persistência via localStorage
 */
(function (global) {
  "use strict";

  var STORAGE_KEY = "promptops_academy_prompts";

  // Carrega registros persistidos
  function loadPersistedPrompts() {
    try {
      var data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error("PromptOps: Erro ao carregar prompts do localStorage", e);
    }
    return [];
  }

  // Salva a lista completa
  function savePersistedPrompts(prompts) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
    } catch (e) {
      console.error("PromptOps: Erro ao salvar prompts no localStorage", e);
    }
  }

  // Salva um novo registro e atualiza o catálogo
  function saveNewPrompt(promptData) {
    var prompts = loadPersistedPrompts();
    prompts.push(promptData);
    savePersistedPrompts(prompts);
    
    // Atualiza o catálogo se estiver disponível
    if (global.PromptOpsCatalog && typeof global.PromptOpsCatalog.refreshData === "function") {
      global.PromptOpsCatalog.refreshData();
    }
  }

  // Recupera a lista consolidada (JSON base + localStorage)
  function getConsolidatedPrompts(basePrompts) {
    var persisted = loadPersistedPrompts();
    return (basePrompts || []).concat(persisted);
  }

  global.PromptOpsStorage = Object.freeze({
    loadPersistedPrompts: loadPersistedPrompts,
    saveNewPrompt: saveNewPrompt,
    getConsolidatedPrompts: getConsolidatedPrompts
  });
})(globalThis);
