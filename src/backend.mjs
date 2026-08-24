import { createServer } from 'node:http';

const port = Number(process.env.BACKEND_PORT ?? 3001);

/**
 * Serves the fixture's health and API endpoints.
 *
 * @param {import('node:http').IncomingMessage} request Incoming HTTP request.
 * @param {import('node:http').ServerResponse} response Outgoing HTTP response.
 * @returns {void}
 */
function handleBackendRequest(request, response) {
  if (request.url === '/health') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ status: 'ready' }));
    return;
  }

  if (request.url === '/api/greeting') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ message: 'Hello from the candidate backend.' }));
    return;
  }

  response.writeHead(404, { 'content-type': 'application/json' });
  response.end(JSON.stringify({ error: 'Not found' }));
}

/** Logs the backend listen address after the server accepts connections. */
function logBackendListening() {
  console.log(`Backend listening on ${port}.`);
}

const server = createServer(handleBackendRequest);

server.listen(port, '127.0.0.1', logBackendListening);
