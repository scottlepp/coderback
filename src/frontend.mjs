import { createServer } from 'node:http';

const port = Number(process.env.FRONTEND_PORT ?? 3000);

const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Agent workspace sample</title>
  </head>
  <body>
    <main>
      <h1>Agent workspace sample</h1>
      <p>The isolated frontend preview is ready for browser verification.</p>
    </main>
  </body>
</html>`;

/**
 * Serves the fixture's frontend and readiness endpoints.
 *
 * @param {import('node:http').IncomingMessage} request Incoming HTTP request.
 * @param {import('node:http').ServerResponse} response Outgoing HTTP response.
 * @returns {void}
 */
function handleFrontendRequest(request, response) {
  if (request.url === '/' || request.url === '/health') {
    response.writeHead(200, { 'content-type': request.url === '/health' ? 'application/json' : 'text/html' });
    response.end(request.url === '/health' ? JSON.stringify({ status: 'ready' }) : page);
    return;
  }

  response.writeHead(404, { 'content-type': 'text/plain' });
  response.end('Not found');
}

/** Logs the frontend listen address after the server accepts connections. */
function logFrontendListening() {
  console.log(`Frontend listening on ${port}.`);
}

const server = createServer(handleFrontendRequest);

server.listen(port, '127.0.0.1', logFrontendListening);
