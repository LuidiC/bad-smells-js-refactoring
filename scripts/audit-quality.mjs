import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { ESLint } from 'eslint';

const baseline = JSON.parse(readFileSync('docs/evidencias/baseline/manifest.json', 'utf8'));
const protectedFiles = ['src/ReportGenerator.js', 'tests/ReportGenerator.test.js'];
for (const path of protectedFiles) {
  const expected = baseline.files.find(file => file.path === path).sha256;
  assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), expected);
  assert.equal(execFileSync('git', ['hash-object', '--path', path, path], { encoding: 'utf8' }).trim(),
    execFileSync('git', ['rev-parse', `${baseline.referenceCommit}:${path}`], { encoding: 'utf8' }).trim());
}
const expectedCopy = readFileSync(protectedFiles[1], 'utf8')
  .replace("'../src/ReportGenerator.js'", "'../src/ReportGenerator.refactored.js'");
assert.equal(readFileSync('__tests__/ReportGenerator.refactored.test.js', 'utf8'), expectedCopy);
assert.equal(createHash('sha256').update(readFileSync('.eslintrc.json')).digest('hex'),
  baseline.files.find(file => file.path === '.eslintrc.json').sha256);

const files = ['src/ReportGenerator.js', 'src/ReportGenerator.refactored.js'];
const actual = await new ESLint().lintFiles(files);
// Medição suplementar: limite zero somente nesta instância da API, sem mudar .eslintrc.
// Os resultados oficiais antes/depois continuam usando o limite exigido de 15.
const diagnostic = await new ESLint({ overrideConfig: { rules: {
  'sonarjs/cognitive-complexity': ['error', 0],
} } }).lintFiles(files);
const summary = {
  protectedFilesUnchanged: protectedFiles,
  testCopyOnlyImportChanged: true, sameLintConfiguration: true,
  official: actual.map((file, i) => ({ path: files[i], errors: file.errorCount, warnings: file.warningCount,
    rules: file.messages.map(message => message.ruleId) })),
  diagnostic: diagnostic.map((file, i) => ({ path: files[i],
    functions: file.messages.filter(message => message.ruleId === 'sonarjs/cognitive-complexity')
      .map(message => ({ line: message.line, complexity: Number(message.message.match(/from (\d+) to/)[1]) })) })),
};
mkdirSync('docs/evidencias/final', { recursive: true });
writeFileSync('docs/evidencias/final/auditoria-qualidade.json', JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
assert.equal(actual[1].errorCount, 0);
assert.equal(actual[1].warningCount, 0);
