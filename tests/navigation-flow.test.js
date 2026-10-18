/**
 * navigation-flow.test.js
 * Testes automatizados de integridade para a Issue #19 (Navegação Principal e Fluxo do Usuário)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Iniciando testes de integridade da Issue #19...\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    Erro: ${err.message}`);
  }
}

// 1. Verificação de Arquivos Obrigatórios
test('Todos os arquivos da Issue #19 devem existir', () => {
  const files = [
    'prompt.html',
    'public/laboratorio-de-prompts.html',
    'js/navigation.js',
    'js/prompt-detail.js',
    'css/navigation.css',
    'docs/evidencias-issue-19.md'
  ];

  files.forEach(file => {
    const fullPath = path.join(rootDir, file);
    assert.strictEqual(fs.existsSync(fullPath), true, `Arquivo ${file} deve existir no repositório.`);
  });
});

// 2. Verificação do Fluxo: Início → Catálogo → Detalhe → Laboratório → Início
test('prompt.html deve conter os links e botões de ação para o Laboratório e Catálogo', () => {
  const promptHtml = fs.readFileSync(path.join(rootDir, 'prompt.html'), 'utf-8');
  
  assert.ok(promptHtml.includes('btn-test-in-lab'), 'Deve conter botão para testar no Laboratório.');
  assert.ok(promptHtml.includes('index.html#catalogo'), 'Deve conter link de retorno para o Catálogo.');
  assert.ok(promptHtml.includes('index.html#inicio'), 'Deve conter link de retorno para o Início.');
  assert.ok(promptHtml.includes('js/navigation.js'), 'Deve carregar o script de navegação.');
  assert.ok(promptHtml.includes('js/prompt-detail.js'), 'Deve carregar o script de detalhe.');
  assert.ok(promptHtml.includes('css/navigation.css'), 'Deve carregar a folha de estilos de navegação.');
});

test('public/laboratorio-de-prompts.html deve conter link de retorno ao início', () => {
  const labHtml = fs.readFileSync(path.join(rootDir, 'public/laboratorio-de-prompts.html'), 'utf-8');
  assert.ok(labHtml.includes('../index.html'), 'Laboratório deve apontar para ../index.html para retornar ao início.');
  assert.ok(labHtml.includes('Voltar ao início'), 'Texto do link deve ser "Voltar ao início".');
});

// 3. Verificação do módulo js/navigation.js
test('js/navigation.js deve exportar métodos de roteamento e navegação', () => {
  const navJs = fs.readFileSync(path.join(rootDir, 'js/navigation.js'), 'utf-8');
  
  assert.ok(navJs.includes('PromptOpsNavigation'), 'Deve exportar a API PromptOpsNavigation.');
  assert.ok(navJs.includes('goToLaboratorio'), 'Deve fornecer método goToLaboratorio.');
  assert.ok(navJs.includes('goToCatalogo'), 'Deve fornecer método goToCatalogo.');
  assert.ok(navJs.includes('goToInicio'), 'Deve fornecer método goToInicio.');
  assert.ok(navJs.includes('goToPromptDetail'), 'Deve fornecer método goToPromptDetail.');
  assert.ok(navJs.includes('bindSidebarToggle'), 'Deve suportar alternância do menu mobile.');
});

// 4. Verificação do módulo js/prompt-detail.js
test('js/prompt-detail.js deve ler id via URLSearchParams e renderizar dados sem conflitos', () => {
  const detailJs = fs.readFileSync(path.join(rootDir, 'js/prompt-detail.js'), 'utf-8');
  
  assert.ok(detailJs.includes('URLSearchParams'), 'Deve ler parâmetro id via URLSearchParams.');
  assert.ok(detailJs.includes('prompts.json'), 'Deve buscar dados canônicos de prompts.json.');
  assert.ok(detailJs.includes('btn-test-in-lab'), 'Deve vincular ação ao botão do laboratório.');
  assert.ok(detailJs.includes('PromptOpsPromptDetail'), 'Deve exportar o módulo de detalhes.');
});

// Resumo dos testes
console.log(`\n📊 Resultado dos testes: ${passedTests}/${totalTests} passaram.`);
if (passedTests !== totalTests) {
  process.exit(1);
}
