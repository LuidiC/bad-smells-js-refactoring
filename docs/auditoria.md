# Auditoria técnica - versão de desenvolvimento

Autor: Luidi Cadete Silva. Matrícula não fornecida. Data: 02/11/2026 (America/Sao_Paulo).
A base está em `39d39f9`; a implementação validada está em `2383b83`.
Os manifestos registram os commits de referência e os comandos exatos.

| Item | Antes | Depois |
| --- | --- | --- |
| Testes originais | 4/5 aprovados | 4/5; sem alterações |
| Testes refatorados | Não existiam | 5/5 aprovados |
| Suíte completa | Uma suíte com falha | 9/10; falha original visível |
| ESLint | 2 erros no original | 0 no refatorado; 2 no original |
| Avisos de ESLint | 0 | 0 |
| Complexidade de generateReport | 27 | 5 |

## Verificações complementares

Foram realizadas 321 comparações textuais exatas e de mutações em cenários sem a
diferença autorizada. O HTML divergente teve saídas completas original e corrigida
verificadas separadamente, sem normalização de strings. Conferiram-se ainda limites
500/501 e 1000/1001, prioridade preexistente, perfis/formatos desconhecidos, referência
db, arrays vazios e múltiplos itens. Isso não constitui prova universal para toda entrada JavaScript.

A auditoria de integridade confere SHA-256 dos originais contra a coleta inicial,
blobs Git contra a base, cópia dos testes alterando somente o import e hash da
configuração idêntico nas análises. Os resultados estão em
`evidencias/final/auditoria-qualidade.json` e `auditoria-comportamento.json`.

## Matriz de requisitos

| Exigência | Implementação/evidência | Situação |
| --- | --- | --- |
| Fork real e histórico original | Fork LuidiC; commits originais ancestrais | Atendido |
| Branch de desenvolvimento | trabalho/refatoracao-segura; sem merge | Atendido |
| Ambiente compatível | Versões fixadas, lockfile e flag ESM | Atendido |
| Originais preservados | Hashes e blobs Git | Atendido |
| Pelo menos três smells | Método longo, condicionais complexas, duplicação; adicional: números mágicos | Atendido |
| ESLint/SonarJS e limite 15 | JSON válido e configuração estável | Atendido |
| Evidência anterior à refatoração | baseline com logs, JSON, PNGs e manifestos | Atendido |
| Comparação manual/automática | analise.md e relatório, página 2 | Atendido |
| Arquivo refatorado exigido | src/ReportGenerator.refactored.js | Atendido |
| Cópia de testes, só import | __tests__/ReportGenerator.refactored.test.js | Atendido |
| Validação incremental | evidencias/incremental | Atendido |
| Redução significativa de smells | Erros 2 para 0; complexidade 27 para 5 | Atendido |
| Suíte refatorada aprovada | 5/5 | Atendido |
| Suíte original aprovada | 4/5; defeito preexistente | Não atendido na base preservada |
| Suíte completa aprovada | 9/10; uma falha original | Não atendido na base preservada |
| PDF de 2-4 páginas | Quatro páginas, evidências reais, antes/depois e conclusão | Preliminar |
| Capa completa | Nome, título e disciplina; matrícula ausente | Pendente de matrícula |
| Publicação no fork | Branch publicada e consultada pelo plugin GitHub; main permanece em 39d39f9 | Atendido |
| Entrega final aprovada | Não apresentada como concluída | Pendente de aprovação |

## Limitações e decisões

A correção de `<tr >` para `<tr>` existe somente no refatorado. `npm test` retorna 1
pela falha original; o lint global retorna 1 por incluir o original preservado.
Não se desativaram regras, não se excluíram testes nem se alteraram expectativas.
O ESLint 8 é legado e emite aviso na instalação; não se aplicou audit fix --force.
A assistência de IA foi declarada no README. O relatório permanece preliminar até
receber matrícula e aprovação do aluno.

## Auditoria de publicação e reprodução

O plugin GitHub confirmou a branch publicada em `77bd637` e a main preservada em
`39d39f9`; o arquivo refatorado remoto foi conferido (blob `31bd4a3`).
Uma cópia limpa independente instalou 423 pacotes com `npm ci --offline` e reproduziu
5/5 testes refatorados, 4/5 originais e zero erros de lint no refatorado. A primeira
cópia temporária aninhada herdou a configuração ESLint do diretório pai e gerou
conflito de plugins; o ensaio foi refeito fora dessa árvore, sem mudar a configuração
utilizada nas medições. Não era um defeito da refatoração.

`.gitattributes` define PDF e PNG como binários para preservar seus bytes entre
checkouts. A revisão incluiu arquivos publicados, integridade dos originais, ausência
de credenciais nos novos textos e exclusão de node_modules, caches e temporários.
O relatório foi renderizado com Poppler e as quatro páginas foram inspecionadas.
