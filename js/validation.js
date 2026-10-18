(function () {
  function normalize(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .replace(/\s+/g, " ")
      .toLocaleLowerCase("pt-BR");
  }

  function validatePrompt(candidate, existingPrompts = [], options = {}) {
    const errors = [];
    const ignoreId = options.ignoreId;

    if (!candidate || typeof candidate !== "object") {
      return {
        valid: false,
        errors: [{ field: null, message: "Os dados do prompt são inválidos." }]
      };
    }

    const title = String(candidate.title ?? "").trim();
    if (!title) {
      errors.push({
        field: "title",
        message: "Informe um título para identificar este prompt."
      });
    } else if (title.length < 8) {
      errors.push({
        field: "title",
        message: "O título precisa ter pelo menos 8 caracteres."
      });
    }

    const content = String(candidate.content ?? candidate.prompt ?? "").trim();
    if (!content) {
      errors.push({
        field: "content",
        message: "Informe o texto do prompt."
      });
    } else if (content.length < 80) {
      errors.push({
        field: "content",
        message: "O texto do prompt precisa ter pelo menos 80 caracteres."
      });
    }

    const category = String(candidate.category ?? "").trim();
    if (!category) {
      errors.push({
        field: "category",
        message: "Selecione uma categoria válida para o prompt."
      });
    }

    if (title && title.length >= 8) {
      const normalizedCandidateTitle = normalize(title);

      const isDuplicate = existingPrompts.some((prompt) => {
        if (!prompt || typeof prompt !== "object") return false;

        if (
          ignoreId != null &&
          prompt.id != null &&
          String(prompt.id) === String(ignoreId)
        ) {
          return false;
        }

        const promptTitle = prompt.title ?? "";
        return normalize(promptTitle) === normalizedCandidateTitle;
      });

      if (isDuplicate) {
        errors.push({
          field: "title",
          message: "Já existe um prompt cadastrado com este título."
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  window.PromptValidation = { validatePrompt };
})();