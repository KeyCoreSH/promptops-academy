(function (global) {
  "use strict";

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

  /**
   * Retorna um novo array contendo os prompts compatíveis com a consulta.
   * A função apenas lê os registros recebidos e não realiza persistência.
   */
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

  /**
   * Cria novos critérios sem filtros estruturados e preserva a busca textual.
   */
  function limparFiltros(criterios) {
    const consulta = criterios && typeof criterios === "object" ? criterios : {};
    const criteriosLimpos = {};

    if (Object.prototype.hasOwnProperty.call(consulta, "busca")) {
      criteriosLimpos.busca = consulta.busca;
    }

    return criteriosLimpos;
  }

  global.PromptOpsCatalog = Object.freeze({
    filtrarPrompts: filtrarPrompts,
    limparFiltros: limparFiltros,
  });
})(globalThis);
