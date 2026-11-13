// Servidor estático de desenvolvimento: http://localhost:5503 (npm run dev). Sem dependências.
// Imita o .htaccess no que importa para revisar: 404 para o material interno e nada em cache.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(fileURLToPath(import.meta.url), '..', '..');
const PORTA = 5503;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

// as mesmas regras do .htaccess
const BLOQUEADOS = [
  /\/(_referencia|docs|relatorios|shots|scripts|node_modules)(\/|$)/i,
  /\.md$/i,
  /\/package(-lock)?\.json$/i,
  /\.log$/i,
  /\/\.(?!well-known(\/|$))/i,
];

function responder404(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end('404');
}

createServer(async (req, res) => {
  let caminho;
  try {
    caminho = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  } catch {
    return responder404(res);
  }

  if (BLOQUEADOS.some((re) => re.test(caminho))) return responder404(res);

  let arquivo = normalize(join(RAIZ, caminho));
  if (!arquivo.startsWith(RAIZ + sep) && arquivo !== RAIZ) return responder404(res);

  try {
    let info = await stat(arquivo);
    if (info.isDirectory()) {
      // pasta sem barra no fim: redireciona, como o Apache (senão os caminhos relativos quebram)
      if (!caminho.endsWith('/')) {
        res.writeHead(301, { Location: caminho + '/' });
        return res.end();
      }
      arquivo = join(arquivo, 'index.html');
      info = await stat(arquivo);
    }
    const corpo = await readFile(arquivo);
    res.writeHead(200, {
      'Content-Type': TIPOS[extname(arquivo).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(req.method === 'HEAD' ? undefined : corpo);
  } catch {
    responder404(res);
  }
}).listen(PORTA, () => {
  console.log(`LP Black Zero7 Trading em http://localhost:${PORTA}`);
});
