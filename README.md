# Detecção de Bad Smells e Refatoração Segura

Testes de Software - Engenharia de Software, PUC Minas.
Autor: **Luidi Cadete Silva**. Matrícula: **pendente de fornecimento**.

**Status: branch de desenvolvimento auditável. Entrega pendente de matrícula e aprovação.
A suíte original contém uma falha real, preservada e documentada.**

- Fork: https://github.com/LuidiC/bad-smells-js-refactoring
- Branch: `trabalho/refatoracao-segura` (sem merge na `main`).
- Projeto-base: https://github.com/CleitonSilvaT/bad-smells-js-refactoring
- Commit original: `39d39f9ad52c6c508239cfe0b968187ad086e654`.

## Executar

Ambiente verificado: Node.js 24.14.1, npm 11.11.0 e Windows.
ESLint 8.57.1, SonarJS 0.21.0 e Jest 29.7.0 estão fixados; o lockfile registra as dependências transitivas.

```bash
git clone --branch trabalho/refatoracao-segura https://github.com/LuidiC/bad-smells-js-refactoring.git
cd bad-smells-js-refactoring
npm ci
npm run test:original
npm run test:refactored
npm test -- --runInBand
npx eslint src/
npm run lint:refactored
npm run audit:behavior
npm run audit:quality
```

No PowerShell, use `npm.cmd`/`npx.cmd` se a política local impedir scripts `.ps1`.
Comandos que encontram a falha original retornam código 1; isso não foi escondido.

## Resultados reais

| Verificação | Resultado |
| --- | --- |
| Jest original, antes e depois | 4 aprovados; 1 reprovado; 5 testes |
| Jest refatorado | 5 aprovados; 0 reprovados |
| Jest completo | 9 aprovados; 1 reprovado; 2 suítes |
| ESLint original, limite 15 | 2 erros; 0 avisos |
| ESLint refatorado, mesma configuração | 0 erros; 0 avisos |
| Complexidade cognitiva de `generateReport` | 27 para 5 |
| Maior complexidade de uma função refatorada | 5 |
| Auditoria complementar | 321 comparações exatas de saída e mutações aprovadas; limites e correção explícita conferidos |

Os erros caíram 100% no refatorado e a complexidade do método caiu 81,5%.
A medição exata das funções usa uma instância suplementar do ESLint com limite zero,
somente para revelar os valores. O lint oficial permanece com limite 15 antes e depois.

## Problemas preexistentes e correção autorizada

O original escreve `<tr >` em itens de ADMIN sem estilo; o teste exige `<tr>`.
**`src/ReportGenerator.js` e `tests/ReportGenerator.test.js` estão intactos.**
A correção foi aplicada somente ao refatorado, mediante autorização do aluno.
É uma diferença observável; não se declara equivalência textual absoluta ou aprovação total.

A base usa ES Modules e Jest 29 com `transform: {}`, mas o script chamava apenas `jest`.
Foi necessário executar com `--experimental-vm-modules`. A falha sem essa flag está registrada;
o aviso experimental continua visível nos logs. Nenhum teste foi alterado para esse ajuste.

O teste original está em `tests/`, embora o enunciado cite `__tests__/`.
A cópia está em `__tests__/ReportGenerator.refactored.test.js` e altera exclusivamente
o import para `../src/ReportGenerator.refactored.js`. Nenhuma expectativa foi modificada,
nenhum mock artificial foi adicionado e nenhum teste foi excluído ou ocultado.

## Refatoração

- Método longo: Extract Method para cabeçalho, linha, rodapé, visibilidade e prioridade.
- Condicionais complexas: Decompose Conditional e redução do aninhamento.
- Duplicação: centralização da construção de linhas e da soma do total.
- Números mágicos: constantes para os limites 500 e 1000.

A classe, construtor, referência `db` e método público foram preservados. ADMIN continua
alterando `item.priority`, inclusive com formato desconhecido. Prioridade preexistente é
respeitada em ADMIN; USER não ganha estilo nem mutações adicionais.

## Documentos e evidências

- [Análise manual e situação inicial](docs/analise.md).
- [Auditoria e matriz de requisitos](docs/auditoria.md).
- [Relatório preliminar de quatro páginas](output/pdf/relatorio-preliminar.pdf).
- [Print inicial legível](docs/evidencias/baseline/eslint-antes-legivel.png).
- `docs/evidencias/baseline/`: comandos, horários UTC, hashes, falha ESM, testes e lint iniciais.
- `docs/evidencias/incremental/`: primeira validação da implementação.
- `docs/evidencias/final/`: resultados separados e conjuntos, lint e auditorias.

Os PNGs são capturas de navegador de uma página local que executou `npx eslint src/`
e exibiu stdout/stderr reais. Não são imagens de um terminal simulado. O mecanismo está
em `scripts/serve-lint-evidence.mjs`, com metadados e saída bruta para cada captura.

`node scripts/collect-evidence.mjs final` repete a coleta, sobrescrevendo os resultados
atuais da pasta final; o histórico Git preserva a versão publicada. O coletor registra
códigos de saída e retorna sucesso de coleta mesmo se testes falharem: consulte os
resultados, não confunda coleta com aprovação. A coleta baseline se recusa a sobrescrever
a evidência inicial ou executar após a criação do arquivo refatorado.

## Configuração e relatório

O limite cognitivo mudou de 5, na base, para **15**, conforme o PDF, antes da medição.
Preservaram-se os presets recomendados e as regras de funções idênticas e ramos duplicados.
O JSON não contém comentários. ESLint 8 está fora de suporte; foi escolhido por
compatibilidade com o formato solicitado, sem migração que alterasse a comparação.
O preset Babel já fazia parte da base e não foi acrescentado para esta solução.

`python scripts/build_report.py` regenera o PDF a partir das evidências. É necessário
Python com ReportLab e fontes Arial/Consolas do Windows, sem novas dependências npm.
A renderização foi conferida com Poppler. A capa declara a matrícula ausente e a versão
preliminar: o documento não deve ser apresentado como entrega final.

## Autoria e pendências

Foi utilizada assistência de IA (Codex) na implementação, verificação e documentação,
com decisões e publicação autorizadas pelo aluno. O aluno deve revisar o material e
confirmar a política institucional antes da entrega; o PDF fornecido não traz regra
específica de IA. Preservaram-se o histórico e a atribuição ao projeto-base.

Pendências: matrícula, aprovação do aluno e tratamento acadêmico da falha original
com o professor. Sem revisão autorizada da base pelo professor, não é possível obter
100% dos testes originais mantendo ambos os arquivos integralmente preservados.

## Referências técnicas

- https://jestjs.io/docs/29.7/ecmascript-modules
- https://github.com/SonarSource/eslint-plugin-sonarjs/tree/0.21.0
- https://eslint.org/docs/latest/use/migrate-to-9.0.0
- https://refactoring.com/catalog/extractFunction.html
- https://refactoring.com/catalog/decomposeConditional.html
