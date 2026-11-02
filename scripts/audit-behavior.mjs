import assert from 'node:assert/strict';
import { writeFileSync, mkdirSync } from 'node:fs';
import { ReportGenerator as Original } from '../src/ReportGenerator.js';
import { ReportGenerator as Refactored } from '../src/ReportGenerator.refactored.js';

let comparisons = 0;
function compareExact(reportType, role, items) {
  const originalItems = structuredClone(items);
  const refactoredItems = structuredClone(items);
  const user = { name: 'Auditoria', role };
  const db = {};
  const oldGenerator = new Original(db);
  const newGenerator = new Refactored(db);
  assert.equal(newGenerator.db, db, 'O construtor preserva a referência ao banco.');
  assert.equal(newGenerator.generateReport(reportType, user, refactoredItems),
    oldGenerator.generateReport(reportType, user, originalItems));
  assert.deepEqual(refactoredItems, originalItems, 'Mutações devem coincidir.');
  comparisons++;
}
// Comparação textual exata, sem normalizar HTML ou alterar as suítes fornecidas.
const values = [-1, 0, 499, 500, 501, 999, 1000, 1001, 1200];
for (const value of values) {
  for (const priority of [undefined, false, true]) {
    const item = { id: 1, name: 'Item', value };
    if (priority !== undefined) item.priority = priority;
    for (const role of ['ADMIN', 'USER', 'GUEST', undefined]) {
      compareExact('CSV', role, [item]);
      compareExact('INVALID', role, [item]);
      if (role !== 'ADMIN' || priority || value > 1000) compareExact('HTML', role, [item]);
    }
  }
}
for (const format of ['CSV', 'HTML', 'INVALID']) {
  for (const role of ['ADMIN', 'USER', 'GUEST']) compareExact(format, role, []);
}
const generator = new Refactored({});
const admin = { name: 'Admin', role: 'ADMIN' };
const user = { name: 'User', role: 'USER' };
const lowItem = [{ id: 1, name: 'A', value: 300 }];
const expectedRefactored = '<html><body>\n<h1>Relatório</h1>\n<h2>Usuário: Admin</h2>\n'
  + '<table>\n<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n'
  + '<tr><td>1</td><td>A</td><td>300</td></tr>\n</table>\n<h3>Total: 300</h3>\n</body></html>';
assert.equal(generator.generateReport('HTML', admin, structuredClone(lowItem)), expectedRefactored);
const expectedOriginal = '<html><body>\n<h1>Relatório</h1>\n<h2>Usuário: Admin</h2>\n'
  + '<table>\n<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n'
  + '<tr ><td>1</td><td>A</td><td>300</td></tr>\n</table>\n<h3>Total: 300</h3>\n</body></html>';
assert.equal(new Original({}).generateReport('HTML', admin, structuredClone(lowItem)), expectedOriginal);
assert.notEqual(expectedRefactored, expectedOriginal, 'A correção de formatação é uma diferença explícita.');
const originalLow = structuredClone(lowItem);
const refactoredLow = structuredClone(lowItem);
new Original({}).generateReport('HTML', admin, originalLow);
generator.generateReport('HTML', admin, refactoredLow);
assert.deepEqual(refactoredLow, originalLow);
const limits = [{ id: 1, name: 'Limite', value: 500 }, { id: 2, name: 'Acima', value: 501 }];
assert.equal(generator.generateReport('CSV', user, limits),
  'ID,NOME,VALOR,USUARIO\n1,Limite,500,User\n\nTotal,,\n500,,');
const priorityLimits = [{ id: 1, name: 'Limite', value: 1000 }, { id: 2, name: 'Acima', value: 1001 }];
generator.generateReport('INVALID', admin, priorityLimits);
assert.equal(Object.hasOwn(priorityLimits[0], 'priority'), false);
assert.equal(priorityLimits[1].priority, true, 'ADMIN muda prioridade mesmo com formato desconhecido.');
const marked = [{ id: 1, name: 'A', value: 300, priority: true }];
assert.ok(generator.generateReport('HTML', admin, marked).includes('<tr style="font-weight:bold;">'));
assert.ok(generator.generateReport('HTML', user, marked).includes('<tr><td>1</td>'));
assert.equal(marked[0].priority, true);
compareExact('CSV', 'ADMIN', values.map((value, i) => ({ id: i, name: 'Item', value })));
compareExact('HTML', 'USER', values.map((value, i) => ({ id: i, name: 'Item', value })));
const summary = {
  exactComparisons: comparisons,
  additionalChecks: ['Construtor mantém db', 'HTML corrigido validado integralmente',
    'HTML original divergente validado integralmente', 'Mutações equivalentes na exceção',
    'Limites 500/501 e 1000/1001', 'Prioridade preexistente', 'Formato e perfil desconhecidos',
    'Arrays vazios e múltiplos itens'],
  normalizationApplied: false, originalTestsModified: false, result: 'passed',
};
mkdirSync('docs/evidencias/final', { recursive: true });
writeFileSync('docs/evidencias/final/auditoria-comportamento.json', JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
