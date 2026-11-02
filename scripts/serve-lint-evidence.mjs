import { createServer } from 'node:http';
import { spawnSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';

// Página local de evidência: o resultado exibido vem de uma execução real do comando.
if (existsSync('src/ReportGenerator.refactored.js')) {
  throw new Error('A captura inicial deve acontecer antes de criar a versão refatorada.');
}
const escapeHtml = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const evidenceStem = process.argv[2] || 'execucao-visual';
if (!/^[a-z0-9-]+$/.test(evidenceStem)) throw new Error('Nome de evidência inválido.');
if (existsSync(`docs/evidencias/baseline/${evidenceStem}.json`)) {
  throw new Error('Escolha um novo nome: a evidência visual existente será preservada.');
}
createServer((request, response) => {
  if (request.url !== '/') { response.writeHead(404); response.end(); return; }
  const startedAt = new Date().toISOString();
  const command = process.platform === 'win32' ? 'cmd.exe' : 'npx';
  const args = process.platform === 'win32' ? ['/d', '/s', '/c', 'npx.cmd eslint src/'] : ['eslint', 'src/'];
  const result = spawnSync(command, args, { encoding: 'utf8', env: { ...process.env, FORCE_COLOR: '0' } });
  if (result.error || result.signal) throw result.error || new Error(result.signal);
  writeFileSync(`docs/evidencias/baseline/${evidenceStem}.stdout.txt`, result.stdout);
  writeFileSync(`docs/evidencias/baseline/${evidenceStem}.stderr.txt`, result.stderr);
  writeFileSync(`docs/evidencias/baseline/${evidenceStem}.json`, JSON.stringify({
    command: 'npx eslint src/', startedAt, finishedAt: new Date().toISOString(), exitCode: result.status,
    method: 'Página HTTP local que executa o comando e exibe stdout/stderr sem alterar seu conteúdo.',
  }, null, 2) + '\n');
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Evidência real do ESLint</title>
    <style>body{margin:24px;font:22px Arial;color:#172536;background:#fff}h1{font-size:26px}pre{font:22px/1.4 Consolas,monospace;white-space:pre-wrap;overflow-wrap:anywhere;border:1px solid #b5bec9;padding:16px}small{color:#45576b;font-size:18px}</style>
    <h1>Análise estática inicial - saída de execução real</h1><p>Comando: <strong>npx eslint src/</strong> · limite cognitivo: 15</p>
    <small>Início UTC: ${startedAt} · código de saída: ${result.status}</small>
    <pre>${escapeHtml(result.stdout + result.stderr)}</pre><p>A página executa o processo local e exibe sua saída. Os arquivos originais ainda estão preservados.</p></html>`);
}).listen(8765, '127.0.0.1', () => console.log('Captura local: http://127.0.0.1:8765/'));
