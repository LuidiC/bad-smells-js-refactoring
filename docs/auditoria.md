# Auditoria técnica - versão de desenvolvimento

Autor: Luidi Cadete Silva. Matrícula: 804945. Data: 02/11/2026 (America/Sao_Paulo).
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
| Branch de desenvolvimento | trabalho/refatoracao-segura preservada no commit aprovado | Atendido |
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
| PDF de 2-4 páginas | output/pdf/relatorio-final.pdf; quatro páginas, evidências reais, antes/depois e conclusão | Atendido |
| Capa completa | Instituição, curso, disciplina, título, Luidi Cadete Silva, matrícula 804945 e ano 2026 | Atendido |
| Publicação no fork | Código, testes, PDF definitivo e evidências na main | Atendido |
| Integração na main | Fast-forward do commit 45555e2, após auditoria independente e autorização | Atendido |

## Limitações e decisões

A correção de `<tr >` para `<tr>` existe somente no refatorado. `npm test` retorna 1
pela falha original; o lint global retorna 1 por incluir o original preservado.
Não se desativaram regras, não se excluíram testes nem se alteraram expectativas.
O ESLint 8 é legado e emite aviso na instalação; não se aplicou audit fix --force.
A assistência de IA foi declarada no README e no relatório definitivo.
A limitação da suíte original permanece explícita, sem declaração de conformidade integral.

## Auditoria de publicação e reprodução

Na auditoria anterior à integração, o plugin GitHub confirmou a branch em `77bd637` e a main em
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

## Revisão acadêmica definitiva

Dados conferidos: Luidi Cadete Silva, matrícula 804945, Engenharia de Software,
Testes de Software, PUC Minas, 2026. O documento definitivo é
[relatorio-final.pdf](../output/pdf/relatorio-final.pdf); possui exatamente quatro
páginas, todas renderizadas com Poppler e inspecionadas visualmente. A capa foi
limpa, os nomes dos smells foram destacados na tabela e as observações
administrativas foram removidas do PDF. A versão anterior permanece no histórico Git.

A captura original foi mantida com sua identificação correta de página local
exibindo stdout/stderr reais; não foi apresentada como captura nativa de terminal.
Não se alteraram a imagem, a configuração de lint nem os registros baseline.

Antes da geração definitiva, a suíte completa foi executada novamente: 9 aprovados
e 1 reprovado em duas suítes. Foram confirmados 4/5 testes originais, 5/5 refatorados,
zero erros/avisos de lint no refatorado e integridade dos arquivos protegidos. Uma
cópia temporária da auditoria anterior estava duplicando a descoberta de testes;
ela foi removida e os comandos foram repetidos sem alterações de configuração.

A lógica de produção, os testes e suas expectativas permaneceram inalterados nesta
etapa. A integração à main foi autorizada após a auditoria independente da versão definitiva.
A limitação acadêmica dos testes originais permanece dependente de orientação do professor.

## Integração final na main

O commit aprovado `45555e2581125a6efb9a05e92df5cb87ab9dd047` foi integrado por
fast-forward, preservando todos os commits. Antes da integração, confirmou-se a
ausência de alterações locais, a main na base `39d39f9`, a integridade dos originais
e o PDF aprovado com quatro páginas e o mesmo SHA-256 registrado.

Após a integração, somente README e documentos de análise/auditoria foram ajustados
para indicar a publicação na main. Código original, código refatorado, ambas as
suítes, configuração de lint, PDF e evidências permanecem idênticos ao aprovado.
Os resultados registrados continuam sendo 4/5 testes originais, 5/5 refatorados,
9/10 na suíte completa e zero erros/avisos de ESLint no refatorado.
