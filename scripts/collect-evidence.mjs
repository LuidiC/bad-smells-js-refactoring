import { spawnSync, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const phase = process.argv[2];
if (!['baseline', 'incremental', 'final'].includes(phase)) {
  throw new Error('Uso: node scripts/collect-evidence.mjs baseline|incremental|final');
}
const directory = resolve('docs/evidencias', phase);
if (phase === 'baseline' && (existsSync(directory) || existsSync('src/ReportGenerator.refactored.js'))) {
  throw new Error('A evidência inicial não pode ser sobrescrita nem coletada após a refatoração.');
}
mkdirSync(directory, { recursive: true });
const results = [];
function run(name, args) {
  const startedAt = new Date().toISOString();
  const result = spawnSync(process.execPath, args, {
    encoding: 'utf8', env: { ...process.env, FORCE_COLOR: '0' },
  });
  if (result.error || result.signal) throw result.error || new Error(result.signal);
  const command = `node ${args.map(arg => /\s/.test(arg) ? JSON.stringify(arg) : arg).join(' ')}`;
  writeFileSync(resolve(directory, `${name}.stdout.txt`), result.stdout);
  writeFileSync(resolve(directory, `${name}.stderr.txt`), result.stderr);
  results.push({ name, command, startedAt, finishedAt: new Date().toISOString(), exitCode: result.status });
  console.log(`${name}: exit ${result.status}`);
}
function tests(name, path) {
  run(name, ['--experimental-vm-modules', 'node_modules/jest/bin/jest.js', '--runInBand',
    ...(path ? ['--runTestsByPath', path] : []), '--json', '--outputFile',
    `docs/evidencias/${phase}/${name}.json`]);
}
function lint(name, path) {
  run(name, ['node_modules/eslint/bin/eslint.js', path]);
  run(`${name}-json`, ['node_modules/eslint/bin/eslint.js', path, '--format', 'json',
    '--output-file', `docs/evidencias/${phase}/${name}.json`]);
}
if (phase === 'baseline') {
  run('jest-sem-suporte-esm', ['node_modules/jest/bin/jest.js', '--runInBand']);
  tests('testes-originais', 'tests/ReportGenerator.test.js');
  lint('eslint-antes', 'src/');
} else {
  tests('testes-refatorados', '__tests__/ReportGenerator.refactored.test.js');
  if (phase === 'final') {
    tests('testes-originais', 'tests/ReportGenerator.test.js');
    tests('testes-completos');
    lint('eslint-original', 'src/ReportGenerator.js');
  }
  lint('eslint-refatorado', 'src/ReportGenerator.refactored.js');
}
const manifest = {
  phase, node: process.version, platform: process.platform,
  referenceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  files: ['src/ReportGenerator.js', 'tests/ReportGenerator.test.js', '.eslintrc.json', 'package-lock.json']
    .filter(existsSync).map(path => ({ path, sha256: createHash('sha256').update(readFileSync(path)).digest('hex') })),
  results,
};
writeFileSync(resolve(directory, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
// Falhas esperadas continuam nos resultados; a coleta não transforma uma suíte em aprovada.
console.log(`Evidências: ${directory}`);
