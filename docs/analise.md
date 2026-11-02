# Análise inicial e decisões

Autor: Luidi Cadete Silva. Matrícula: 804945. Ano: 2026.

Base: `CleitonSilvaT/bad-smells-js-refactoring`, commit
`39d39f9ad52c6c508239cfe0b968187ad086e654`.

## Situação preexistente

- O teste original está em `tests/`, embora o PDF e o README mencionem `__tests__/`.
  Ele foi preservado no local existente e a cópia foi criada em `__tests__/`.
- A configuração original usa complexidade 5. A configuração deste trabalho usa 15,
  conforme o PDF, tanto antes quanto depois da refatoração. Nenhuma regra foi desativada.
- A base usa ES Modules, Jest 29 e `transform: {}`, mas o script original chama apenas
  `jest`. A execução equivalente sem a flag ESM falhou antes de executar os testes:
  `Cannot use import statement outside a module`. O script foi ajustado para
  `node --experimental-vm-modules node_modules/jest/bin/jest.js`.
- Com esse ajuste de ambiente, a suíte original executou cinco testes: quatro passaram
  e um falhou. O HTML de ADMIN produz `<tr >` para itens sem prioridade, enquanto o
  teste espera `<tr>`. A falha foi preservada, sem alterar código ou testes originais.
- O usuário autorizou corrigir somente essa formatação na versão refatorada. Isso é
  uma correção observável, além da refatoração, e impede alegar equivalência textual
  absoluta entre as duas versões. A suíte completa continuará falhando no original.

## Bad Smells observados manualmente

| Tipo | Local no original | Impacto e ação prevista |
| --- | --- | --- |
| Método longo | `generateReport`, linhas 11-69 | Mistura seleção, prioridade e apresentação. Extrair funções para facilitar leitura, localização de defeitos e testes de cenários. |
| Condicionais complexas | Laço de itens, linhas 27-56 | Aninhamento por perfil, valor e formato dificulta acompanhar caminhos. Decompor condições e separar responsabilidades. |
| Duplicação de lógica | CSV e soma nas linhas 35-37 e 46-48 | Uma mudança pode ser aplicada em apenas um ramo. Centralizar construção de linhas e acumulação. |
| Números mágicos | Limites 500 e 1000 nas linhas 43 e 30 | O significado precisa ser inferido, inclusive ao testar limites. Substituir por constantes com nomes de negócio. |

## Análise automática inicial

O ESLint 8.57.1 com SonarJS 0.21.0 reportou **dois erros e zero avisos**:

1. Linha 11: complexidade cognitiva 27, acima de 15 (`sonarjs/cognitive-complexity`).
2. Linha 43: condicional aninhada que pode ser combinada (`sonarjs/no-collapsible-if`).

O linter quantificou a dificuldade das condicionais. Ele não reportou diretamente
todos os smells manuais: duplicação de trechos não é o mesmo que funções idênticas,
e o preset utilizado não exige detectar números mágicos. Não se inventaram alertas.

## Evidências e reprodutibilidade

`evidencias/baseline/manifest.json` registra comandos, horários, códigos de saída,
versão do Node e hashes. Os arquivos `.stdout.txt`, `.stderr.txt` e JSON contêm as
saídas reais. O primeiro registro foi coletado antes de criar qualquer arquivo refatorado.

`evidencias/baseline/eslint-antes.png` é uma captura de navegador de uma página HTTP
local que executou `npx eslint src/` e exibiu sua saída real, sem alterar stdout/stderr.
O script `scripts/serve-lint-evidence.mjs` preserva o mecanismo de captura; os dados da
execução visual estão nos arquivos `execucao-visual.*`. Não é um terminal simulado.

Dependências de lint foram fixadas por compatibilidade com `.eslintrc.json`:
ESLint 8.57.1, SonarJS 0.21.0 e Jest 29.7.0. O ESLint 8 está fora de suporte;
a escolha preserva o formato didático exigido, e não é uma recomendação para novos
produtos. O preset Babel já existia no projeto e não foi adicionado para esta solução.

## Situação da entrega

O relatório acadêmico definitivo está em `../output/pdf/relatorio-final.pdf`, com quatro
páginas e matrícula 804945. A evidência inicial foi preservada na forma auditada,
sem simular uma captura de terminal ou reconstruir os resultados.
O trabalho não satisfaz a exigência de 100% dos testes originais, por defeito preexistente;
o tratamento dessa limitação depende de orientação do professor.
A branch está publicada e aguarda autorização para integração à principal.
